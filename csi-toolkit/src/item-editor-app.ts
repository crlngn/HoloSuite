import {
  CONNECTION_COLORS,
  CONNECTION_STYLES,
  CONNECTION_TYPES,
  EVIDENCE_STATUSES,
  EVIDENCE_TYPES,
  SUSPECT_STATUSES,
  defaultItem,
  randomId
} from "./case-model";

declare const foundry: any;
declare const game: any;
declare const globalThis: any;
declare const ui: any;

export function createCSIBoardItemEditorClass(deps: any) {
  const {
    LegacyApplication,
    moduleId,
    moduleTitle,
    singularLabel,
    getItemTitle,
    getCase,
    buildItemChoices,
    parseItemElement,
    saveCase,
    deleteBoardItem,
    defaultBoardPosition,
    openJournalByUuid,
    readJournalDropData
  } = deps;

  const JOURNAL_COLLECTIONS = ["evidence", "suspects", "locations", "timeline"];

  return class CSIBoardItemEditor extends LegacyApplication {
    caseId: string;
    collection: string;
    itemId: string;
    isNew: boolean;
    boardPosition: any;
    prefill: any;

    constructor(caseId: string, collection: string, itemId: string | null, options: any = {}) {
      super(options);
      this.caseId = caseId;
      this.collection = collection;
      this.itemId = itemId || randomId();
      this.isNew = !itemId;
      this.boardPosition = options.boardPosition ? {
        x: Number(options.boardPosition.x) || 0,
        y: Number(options.boardPosition.y) || 0
      } : null;
      this.prefill = options.prefill ?? null;
    }

    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        title: "Edit CSI Board Card",
        template: `modules/${moduleId}/templates/board-item-editor.hbs`,
        classes: ["csi-toolkit", "csi-board-item-editor"],
        width: 560,
        height: 520,
        resizable: true
      });
    }

    get title() {
      const item = this._getItem();
      return this.isNew ? `Add ${singularLabel(this.collection)}` : item ? `Edit ${getItemTitle(item, this.collection)}` : "Edit CSI Board Card";
    }

    async getData() {
      const csiCase = getCase(this.caseId);
      const item = this._getItem();
      return {
        caseId: this.caseId,
        collection: this.collection,
        item,
        isNew: this.isNew,
        itemChoices: csiCase ? buildItemChoices(csiCase, !game.user?.isGM) : [],
        isEvidence: this.collection === "evidence",
        isSuspect: this.collection === "suspects",
        isLocation: this.collection === "locations",
        isTimeline: this.collection === "timeline",
        isConnection: this.collection === "connections",
        hasJournalField: JOURNAL_COLLECTIONS.includes(this.collection),
        journalLink: await this._resolveJournalLink(item?.journalUuid),
        options: {
          evidenceTypes: EVIDENCE_TYPES,
          evidenceStatuses: EVIDENCE_STATUSES,
          suspectStatuses: SUSPECT_STATUSES,
          connectionTypes: CONNECTION_TYPES,
          connectionStyles: CONNECTION_STYLES,
          connectionColors: CONNECTION_COLORS
        }
      };
    }

    activateListeners(html: any) {
      super.activateListeners(html);
      const root = html[0];
      const form = root?.matches?.("[data-csi-board-item-form]") ? root : root?.querySelector?.("[data-csi-board-item-form]");
      if (form) form.addEventListener("submit", (event: any) => this._save(event));
      html.find("[data-action='pick-image']").on("click", (event: any) => this._pickImage(event.currentTarget));
      html.find("[data-action='delete-board-item']").on("click", (event: any) => this._delete(event));
      html.find("[data-action='open-journal-link']").on("click", () => this._openJournalLink());
      html.find("[data-action='clear-journal-link']").on("click", () => this._setJournalLink("", ""));

      const dropZone = html[0]?.querySelector("[data-csi-journal-drop]");
      if (dropZone) {
        dropZone.addEventListener("dragover", (event: any) => {
          event.preventDefault();
          dropZone.classList.add("is-drop-target");
        });
        dropZone.addEventListener("dragleave", () => dropZone.classList.remove("is-drop-target"));
        dropZone.addEventListener("drop", (event: any) => this._onJournalDrop(event, dropZone));
      }
    }

    async _resolveJournalLink(uuid: string) {
      if (!uuid) return null;
      const doc = await this._resolveJournalDoc(uuid);
      if (!doc) return { uuid, name: uuid, missing: true };
      return { uuid, name: doc.name, missing: false };
    }

    async _resolveJournalDoc(uuid: string) {
      const resolver = (globalThis as any).fromUuid;
      if (!uuid || typeof resolver !== "function") return null;
      try {
        return await resolver(uuid);
      } catch (error) {
        return null;
      }
    }

    _openJournalLink() {
      const input = this.element[0]?.querySelector("[data-csi-journal-input]");
      const uuid = input?.value;
      if (uuid) openJournalByUuid(uuid);
    }

    async _onJournalDrop(event: any, dropZone: any) {
      event.preventDefault();
      event.stopPropagation();
      dropZone.classList.remove("is-drop-target");
      const parsed = await readJournalDropData(event);
      if (!parsed) {
        ui.notifications?.warn(`${moduleTitle}: Drop a journal entry or page to link it.`);
        return;
      }
      this._setJournalLink(parsed.uuid, parsed.name);
    }

    _setJournalLink(uuid: string, name: string) {
      const root = this.element[0];
      const input = root?.querySelector("[data-csi-journal-input]");
      const nameEl = root?.querySelector("[data-csi-journal-name]");
      const openButton = root?.querySelector("[data-action='open-journal-link']");
      const clearButton = root?.querySelector("[data-action='clear-journal-link']");
      if (input) input.value = uuid || "";
      if (nameEl) {
        nameEl.textContent = uuid ? (name || uuid) : "No journal linked. Drag a journal entry or page here.";
        nameEl.classList.toggle("is-empty", !uuid);
        nameEl.classList.remove("is-missing");
      }
      if (openButton) openButton.disabled = !uuid;
      if (clearButton) clearButton.disabled = !uuid;
    }

    _getItem() {
      const csiCase = getCase(this.caseId);
      const item = csiCase?.[this.collection]?.find((candidate: any) => candidate.id === this.itemId);
      if (item) return item;
      if (!this.isNew) return null;
      const base = defaultItem(this.collection, "players", this.itemId);
      return this.prefill ? { ...base, ...this.prefill } : base;
    }

    async _save(event: any) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation?.();

      const form = event.currentTarget;
      const csiCase = getCase(this.caseId);
      if (!csiCase) {
        ui.notifications?.warn(`${moduleTitle}: The case could not be found.`);
        return false;
      }

      const index = csiCase[this.collection].findIndex((item: any) => item.id === this.itemId);
      if (index < 0 && !this.isNew) {
        ui.notifications?.warn(`${moduleTitle}: The item could not be found.`);
        return false;
      }

      const updated = parseItemElement(this.collection, form);
      updated.id = this.itemId;
      updated.visibility = "players";
      updated.hidden = index >= 0 ? Boolean(csiCase[this.collection][index].hidden) : false;
      if (index >= 0) csiCase[this.collection][index] = updated;
      else csiCase[this.collection].push(updated);
      if (this.isNew && this.collection !== "connections") {
        csiCase.boardLayout.cards[this.itemId] = this.boardPosition ?? defaultBoardPosition(csiCase.evidence.length + csiCase.suspects.length + csiCase.locations.length + csiCase.timeline.length);
      }
      await saveCase(csiCase);
      this.close();
      return false;
    }

    async _delete(event: any) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation?.();
      if (this.isNew) return false;
      const deleted = await deleteBoardItem(this.caseId, this.collection, this.itemId, { confirm: true });
      if (deleted) this.close();
      return false;
    }

    _pickImage(button: any) {
      const field = button.closest(".csi-image-field")?.querySelector("input");
      const Picker = globalThis.FilePicker ?? globalThis.foundry?.applications?.apps?.FilePicker;
      if (!field || !Picker) return;
      new Picker({
        type: "image",
        current: field.value,
        callback: (path: string) => {
          field.value = path;
          field.dispatchEvent(new Event("change", { bubbles: true }));
        }
      }).render(true);
    }
  };
}
