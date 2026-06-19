var Ye = Object.defineProperty;
var Re = (s, l, y) => l in s ? Ye(s, l, { enumerable: !0, configurable: !0, writable: !0, value: y }) : s[l] = y;
var k = (s, l, y) => Re(s, typeof l != "symbol" ? l + "" : l, y);
const Ne = ["open", "cold", "solved", "classified"], se = ["gm", "players"], Oe = ["database", "noir"], ge = ["physical", "digital", "biological", "weapon", "document", "testimony", "other"], ye = ["unknown", "relevant", "red_herring", "confirmed"], be = ["unknown", "cleared", "person_of_interest", "prime_suspect", "arrested", "dead"], _e = ["link", "supports", "contradicts", "location", "timeline", "identity"], Ce = ["solid", "dashed", "dotted"], Ie = ["cyan", "green", "red", "amber", "violet", "orange", "white"], Pe = ["evidence", "suspects", "locations", "timeline", "connections"], Fe = ["evidence", "suspects", "locations", "timeline", "connections"];
function J(s = {}, { forceNewId: l = !1 } = {}) {
  return {
    id: l ? R() : s.id || R(),
    title: String(s.title || "Untitled Case"),
    subtitle: String(s.subtitle || ""),
    status: Y(s.status, Ne, "open"),
    description: String(s.description || ""),
    image: String(s.image || ""),
    visibility: Y(s.visibility, se, "players"),
    evidence: oe(s.evidence, ve),
    suspects: oe(s.suspects, we),
    locations: oe(s.locations, Se),
    timeline: oe(s.timeline, Le),
    connections: oe(s.connections, me),
    boardLayout: Q(s.boardLayout)
  };
}
function ve(s = {}) {
  return {
    id: s.id || R(),
    title: String(s.title || "Untitled Evidence"),
    type: Y(s.type, ge, "other"),
    description: String(s.description || ""),
    image: String(s.image || ""),
    status: Y(s.status, ye, "unknown"),
    visibility: Y(s.visibility, se, "players"),
    hidden: !!s.hidden,
    journalUuid: String(s.journalUuid || ""),
    notes: String(s.notes || "")
  };
}
function we(s = {}) {
  return {
    id: s.id || R(),
    name: String(s.name || "Unknown Suspect"),
    alias: String(s.alias || ""),
    image: String(s.image || ""),
    motive: String(s.motive || ""),
    alibi: String(s.alibi || ""),
    status: Y(s.status, be, "unknown"),
    visibility: Y(s.visibility, se, "players"),
    hidden: !!s.hidden,
    journalUuid: String(s.journalUuid || ""),
    notes: String(s.notes || "")
  };
}
function Se(s = {}) {
  return {
    id: s.id || R(),
    name: String(s.name || "Unknown Location"),
    sceneId: String(s.sceneId || ""),
    image: String(s.image || ""),
    description: String(s.description || ""),
    visibility: Y(s.visibility, se, "players"),
    hidden: !!s.hidden,
    journalUuid: String(s.journalUuid || ""),
    notes: String(s.notes || "")
  };
}
function Le(s = {}) {
  return {
    id: s.id || R(),
    time: String(s.time || ""),
    title: String(s.title || "Timeline Event"),
    description: String(s.description || ""),
    linkedItemIds: Array.isArray(s.linkedItemIds) ? s.linkedItemIds.map(String) : [],
    visibility: Y(s.visibility, se, "players"),
    hidden: !!s.hidden,
    journalUuid: String(s.journalUuid || "")
  };
}
function me(s = {}) {
  return {
    id: s.id || R(),
    fromId: String(s.fromId || ""),
    toId: String(s.toId || ""),
    label: String(s.label || ""),
    type: Y(s.type, _e, "link"),
    style: Y(s.style, Ce, "solid"),
    color: Y(s.color, Ie, ze(s.type)),
    visibility: Y(s.visibility, se, "players")
  };
}
function Q(s = {}) {
  var l, y, C;
  return {
    theme: Y(s.theme, Oe, "database"),
    view: {
      x: Number((l = s.view) == null ? void 0 : l.x) || 0,
      y: Number((y = s.view) == null ? void 0 : y.y) || 0,
      scale: ue(Number((C = s.view) == null ? void 0 : C.scale) || 1, 0.45, 1.8)
    },
    cards: Object.fromEntries(Object.entries(s.cards ?? {}).map(([_, w]) => [_, {
      x: Number(w == null ? void 0 : w.x) || 0,
      y: Number(w == null ? void 0 : w.y) || 0
    }]))
  };
}
function Je(s, l = "players", y = R()) {
  return s === "evidence" ? ve({ id: y, visibility: l }) : s === "suspects" ? we({ id: y, visibility: l }) : s === "locations" ? Se({ id: y, visibility: l }) : s === "timeline" ? Le({ id: y, visibility: l }) : me({ id: y, visibility: l });
}
function oe(s, l) {
  return Array.isArray(s) ? s.map((y) => l(y)) : [];
}
function Y(s, l, y) {
  return l.includes(s) ? s : y;
}
function R() {
  var s;
  return foundry.utils.randomID ? foundry.utils.randomID() : ((s = crypto.randomUUID) == null ? void 0 : s.call(crypto)) ?? Math.random().toString(36).slice(2, 12);
}
function ze(s) {
  return s === "supports" ? "green" : s === "contradicts" ? "red" : s === "location" ? "amber" : s === "timeline" ? "violet" : s === "identity" ? "orange" : "cyan";
}
function ue(s, l, y) {
  return Math.min(y, Math.max(l, s));
}
function fe(s) {
  return String(s || "").replace(/[-_]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}
function Xe(s) {
  return String(s || "case").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "case";
}
function ne(s) {
  const l = document.createElement("div");
  return l.textContent = String(s ?? ""), l.innerHTML;
}
function Ve(s) {
  const {
    LegacyApplication: l,
    moduleId: y,
    moduleTitle: C,
    CSIBoardItemEditor: _,
    getCase: w,
    prepareBoardData: x,
    openCaseManager: P,
    canUserEditBoard: L,
    publishSharedLayout: N,
    requestLayoutPublish: z,
    deleteBoardItem: X,
    saveCase: W,
    defaultBoardPosition: Z,
    getRectEdgeAnchor: ee,
    isFinitePoint: O,
    openJournalByUuid: K,
    readJournalDropData: d,
    toggleFavorite: p,
    canFavorite: m,
    clearBoardApp: I
  } = s, M = [
    { id: "evidence", label: "Evidence" },
    { id: "suspects", label: "Suspect" },
    { id: "locations", label: "Location" },
    { id: "timeline", label: "Timeline Item" }
  ];
  return class extends l {
    constructor(n, a = {}) {
      super(a);
      k(this, "caseId");
      k(this, "playerMode");
      k(this, "_drag");
      k(this, "_pan");
      k(this, "_localLayout");
      k(this, "_layoutDraft");
      k(this, "_pendingConnection");
      k(this, "_contextBoardPosition");
      k(this, "_boundContextClose");
      k(this, "_dimmedKinds");
      k(this, "_saveTimer");
      k(this, "_boundDragMove");
      k(this, "_boundDragEnd");
      k(this, "_boundPanMove");
      k(this, "_boundPanEnd");
      this.caseId = n, this.playerMode = !!a.playerMode, this._drag = null, this._pan = null, this._localLayout = null, this._layoutDraft = null, this._pendingConnection = null, this._contextBoardPosition = null, this._boundContextClose = null, this._dimmedKinds = /* @__PURE__ */ new Set(), this._saveTimer = null;
    }
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        title: "CSI Toolkit Case Board",
        template: `modules/${y}/templates/case-board.hbs`,
        classes: ["csi-toolkit", "csi-case-board-window"],
        width: 1220,
        height: 840,
        resizable: !0
      });
    }
    get id() {
      return `csi-case-board-${this.caseId}-${this.playerMode ? "player" : "gm"}`;
    }
    get title() {
      const n = w(this.caseId), a = this.playerMode ? "Player Board" : "GM Board";
      return n ? `${n.title} - ${a}` : `CSI Toolkit - ${a}`;
    }
    async getData() {
      return x(this.caseId, { playerMode: this.playerMode, layoutOverride: this._localLayout });
    }
    activateListeners(n) {
      super.activateListeners(n), n.find("[data-action='open-manager']").on("click", () => P()), n.find("[data-action='toggle-favorite']").on("click", () => this._toggleFavorite()), n.find("[data-action='refresh-board']").on("click", () => this._reloadSharedBoard()), n.find("[data-action='publish-layout']").on("click", () => this._publishLayout()), n.find("[data-action='zoom-in']").on("click", () => this._zoomBy(0.1)), n.find("[data-action='zoom-out']").on("click", () => this._zoomBy(-0.1)), n.find("[data-action='context-add-board-item']").on("click", (o) => this._addBoardItemFromContext(o)), n.find("[data-action='edit-card']").on("click", (o) => this._editCard(o.currentTarget.dataset.collection, o.currentTarget.dataset.itemId)), n.find("[data-action='delete-board-item']").on("click", (o) => this._deleteBoardItem(o.currentTarget.dataset.collection, o.currentTarget.dataset.itemId)), n.find("[data-action='move-timeline-item']").on("click", (o) => this._moveTimelineItem(o.currentTarget.dataset.itemId, o.currentTarget.dataset.direction)), n.find("[data-csi-connection-hit]").on("dblclick", (o) => this._editCard("connections", o.currentTarget.dataset.connectionId)), n.find("[data-action='start-connection']").on("click", (o) => this._startConnection(o)), n.find("[data-csi-dim-kind]").on("change", (o) => this._toggleDimKind(o.currentTarget));
      const a = n[0].querySelector("[data-csi-board-viewport]");
      a && (a.addEventListener("wheel", (o) => this._onWheel(o), { passive: !1 }), a.addEventListener("mousedown", (o) => this._onViewportMouseDown(o)), a.addEventListener("contextmenu", (o) => this._openContextMenu(o)), a.addEventListener("dragover", (o) => this._onBoardDragOver(o)), a.addEventListener("dragleave", (o) => this._onBoardDragLeave(o)), a.addEventListener("drop", (o) => this._onBoardDrop(o))), n.find("[data-csi-board-card]").on("mousedown", (o) => this._onCardMouseDown(o)), n.find("[data-csi-board-card]").on("click", (o) => this._completeConnection(o)), n.find("[data-csi-board-card]").on("dblclick", (o) => this._onCardDoubleClick(o)), n.find(".csi-card-image").on("load", () => this._queueConnectionLineUpdate()), this._syncDimControls(), this._applyDimmedKinds(), this._queueConnectionLineUpdate();
    }
    _onCardMouseDown(n) {
      if (!L(this.caseId) || n.button !== 0 || n.target.closest("button")) return;
      const a = n.currentTarget, o = this._getView(), h = this._getLayout(), g = a.dataset.itemId, b = h.cards[g] ?? { x: Number(a.dataset.x) || 0, y: Number(a.dataset.y) || 0 };
      n.preventDefault(), this._drag = {
        itemId: g,
        card: a,
        startClientX: n.clientX,
        startClientY: n.clientY,
        startX: b.x,
        startY: b.y,
        scale: o.scale,
        x: b.x,
        y: b.y,
        frame: null,
        cards: this._getBoardCardMap(),
        connectionGroups: this._getConnectionGroupsForItem(g)
      }, document.addEventListener("mousemove", this._boundDragMove = (E) => this._onCardDrag(E)), document.addEventListener("mouseup", this._boundDragEnd = () => this._endDrag());
    }
    _onCardDrag(n) {
      if (!this._drag) return;
      const a = Math.round(this._drag.startX + (n.clientX - this._drag.startClientX) / this._drag.scale), o = Math.round(this._drag.startY + (n.clientY - this._drag.startClientY) / this._drag.scale);
      this._drag.x = a, this._drag.y = o, !this._drag.frame && (this._drag.frame = globalThis.requestAnimationFrame ? globalThis.requestAnimationFrame(() => this._flushCardDrag()) : globalThis.setTimeout(() => this._flushCardDrag(), 0));
    }
    _flushCardDrag() {
      this._drag && (this._drag.frame = null, this._applyCardDragPosition(this._drag.x, this._drag.y), this._updateConnectionLines(this._drag.connectionGroups, this._drag.cards));
    }
    _applyCardDragPosition(n, a) {
      this._drag && (this._drag.card.style.left = `${n}px`, this._drag.card.style.top = `${a}px`, this._drag.card.dataset.x = n, this._drag.card.dataset.y = a);
    }
    _endDrag() {
      var a;
      if (!this._drag) return;
      document.removeEventListener("mousemove", this._boundDragMove), document.removeEventListener("mouseup", this._boundDragEnd), this._drag.frame && (globalThis.cancelAnimationFrame ? globalThis.cancelAnimationFrame(this._drag.frame) : (a = globalThis.clearTimeout) == null || a.call(globalThis, this._drag.frame), this._drag.frame = null), this._applyCardDragPosition(this._drag.x, this._drag.y), this._updateConnectionLines(this._drag.connectionGroups, this._drag.cards);
      const n = this._getLayout();
      n.cards[this._drag.itemId] = {
        ...n.cards[this._drag.itemId] ?? {},
        x: Number(this._drag.card.dataset.x),
        y: Number(this._drag.card.dataset.y)
      }, this._drag = null, this._saveLayout(n);
    }
    _onViewportMouseDown(n) {
      if (n.button !== 0 || n.target.closest("[data-csi-board-card], [data-csi-context-menu], [data-csi-connection-hit], button")) return;
      this._hideContextMenu();
      const a = this._getView();
      n.preventDefault(), this._pan = {
        startClientX: n.clientX,
        startClientY: n.clientY,
        startX: a.x,
        startY: a.y
      }, document.addEventListener("mousemove", this._boundPanMove = (o) => this._onPan(o)), document.addEventListener("mouseup", this._boundPanEnd = () => this._endPan());
    }
    _onPan(n) {
      if (!this._pan) return;
      const a = this._getLayout();
      a.view.x = Math.round(this._pan.startX + n.clientX - this._pan.startClientX), a.view.y = Math.round(this._pan.startY + n.clientY - this._pan.startClientY), this._layoutDraft = a, this._applyView(a.view);
    }
    _endPan() {
      if (!this._pan) return;
      document.removeEventListener("mousemove", this._boundPanMove), document.removeEventListener("mouseup", this._boundPanEnd);
      const n = this._layoutDraft ?? this._getLayout();
      this._pan = null, this._saveLayout(n), this._layoutDraft = null;
    }
    _onWheel(n) {
      n.preventDefault(), this._hideContextMenu(), this._zoomBy(n.deltaY > 0 ? -0.08 : 0.08, { clientX: n.clientX, clientY: n.clientY });
    }
    _zoomBy(n, a) {
      var b;
      const o = this._getLayout(), h = Number(o.view.scale), g = ue(h + n, 0.45, 1.8);
      if (a && g !== h) {
        const E = (b = this.element[0]) == null ? void 0 : b.querySelector("[data-csi-board-viewport]"), A = E == null ? void 0 : E.getBoundingClientRect();
        if (A) {
          const q = a.clientX - A.left, V = a.clientY - A.top, F = g / h;
          o.view.x = Math.round(q - (q - o.view.x) * F), o.view.y = Math.round(V - (V - o.view.y) * F);
        }
      }
      o.view.scale = g, this._applyView(o.view), this._saveLayout(o);
    }
    _applyView(n) {
      var h, g;
      const a = (h = this.element[0]) == null ? void 0 : h.querySelector("[data-csi-board-canvas]");
      if (!a) return;
      a.style.transform = `translate(${n.x}px, ${n.y}px) scale(${n.scale})`;
      const o = (g = this.element[0]) == null ? void 0 : g.querySelector("[data-csi-zoom]");
      o && (o.textContent = `${Math.round(n.scale * 100)}%`);
    }
    _getView() {
      return this._getLayout().view;
    }
    _getLayout() {
      const n = w(this.caseId);
      return Q(this._layoutDraft ?? this._localLayout ?? (n == null ? void 0 : n.boardLayout));
    }
    async _saveLayout(n) {
      this._localLayout = Q(n);
    }
    async _publishLayout() {
      var a;
      if (!L(this.caseId)) return;
      const n = this._getLayout();
      if ((a = game.user) != null && a.isGM) {
        await N(this.caseId, n);
        return;
      }
      await z(this.caseId, n);
    }
    _reloadSharedBoard() {
      this._localLayout = null, this._layoutDraft = null, this.render(!0);
    }
    _getBoardCardMap() {
      const n = this.element[0];
      return n ? new Map(Array.from(n.querySelectorAll("[data-csi-board-card]")).map((a) => [a.dataset.itemId, a])) : /* @__PURE__ */ new Map();
    }
    _getConnectionGroupsForItem(n) {
      const a = this.element[0];
      return !a || !n ? [] : Array.from(a.querySelectorAll("[data-csi-connection-group]")).filter((o) => o.dataset.fromId === n || o.dataset.toId === n);
    }
    _updateConnectionLines(n = null, a = null) {
      const o = this.element[0];
      if (!o) return;
      const h = a ?? this._getBoardCardMap(), g = n ?? Array.from(o.querySelectorAll("[data-csi-connection-group]"));
      for (const b of g) {
        const E = h.get(b.dataset.fromId), A = h.get(b.dataset.toId);
        if (!E || !A) continue;
        const q = this._getCardBoardRect(E), V = this._getCardBoardRect(A), F = ee(q, V), te = ee(V, q);
        if (!O(F) || !O(te)) continue;
        for (const ie of b.querySelectorAll("[data-csi-connection-line], [data-csi-connection-hit]"))
          ie.setAttribute("x1", F.x), ie.setAttribute("y1", F.y), ie.setAttribute("x2", te.x), ie.setAttribute("y2", te.y);
        const ae = b.querySelector("[data-csi-connection-label]");
        ae && (ae.setAttribute("x", Math.round((F.x + te.x) / 2)), ae.setAttribute("y", Math.round((F.y + te.y) / 2 - 10)));
      }
    }
    _queueConnectionLineUpdate() {
      const n = () => this._updateConnectionLines();
      globalThis.requestAnimationFrame ? globalThis.requestAnimationFrame(n) : globalThis.setTimeout(n, 0);
    }
    _getCardBoardRect(n) {
      const a = Number(n.dataset.x) || Number.parseFloat(n.style.left) || 0, o = Number(n.dataset.y) || Number.parseFloat(n.style.top) || 0, h = n.offsetWidth || 220, g = n.offsetHeight || 246;
      return {
        x: a,
        y: o,
        width: h,
        height: g,
        centerX: a + h / 2,
        centerY: o + g / 2
      };
    }
    _editCard(n, a) {
      L(this.caseId) && new _(this.caseId, n, a).render(!0);
    }
    _onCardDoubleClick(n) {
      var E;
      if (n.target.closest("button, input, select, textarea")) return;
      const a = n.currentTarget, o = a.dataset.collection, h = a.dataset.itemId, g = w(this.caseId), b = (E = g == null ? void 0 : g[o]) == null ? void 0 : E.find((A) => A.id === h);
      if (b != null && b.journalUuid) {
        K(b.journalUuid);
        return;
      }
      L(this.caseId) && this._editCard(o, h);
    }
    async _toggleFavorite() {
      m() && (await p(this.caseId), this.render(!1));
    }
    _onBoardDragOver(n) {
      var a, o;
      L(this.caseId) && (n.preventDefault(), n.dataTransfer && (n.dataTransfer.dropEffect = "copy"), (o = (a = this.element[0]) == null ? void 0 : a.querySelector("[data-csi-board-viewport]")) == null || o.classList.add("is-drop-target"));
    }
    _onBoardDragLeave(n) {
      var o;
      const a = (o = this.element[0]) == null ? void 0 : o.querySelector("[data-csi-board-viewport]");
      n.relatedTarget && (a != null && a.contains(n.relatedTarget)) || a == null || a.classList.remove("is-drop-target");
    }
    async _onBoardDrop(n) {
      var b, E;
      if (!L(this.caseId)) return;
      n.preventDefault(), n.stopPropagation(), (E = (b = this.element[0]) == null ? void 0 : b.querySelector("[data-csi-board-viewport]")) == null || E.classList.remove("is-drop-target");
      const a = this._clientToBoardPosition(n.clientX, n.clientY), o = await d(n);
      if (!o) return;
      const h = await this._chooseDropCategory(o.name);
      if (!h) return;
      const g = { journalUuid: o.uuid };
      h === "suspects" || h === "locations" ? g.name = o.name : g.title = o.name, o.isImage && o.image && (g.image = o.image), new _(this.caseId, h, null, { boardPosition: a, prefill: g }).render(!0);
    }
    _chooseDropCategory(n) {
      var h, g, b;
      const a = globalThis.Dialog ?? ((b = (g = (h = globalThis.foundry) == null ? void 0 : h.appv1) == null ? void 0 : g.api) == null ? void 0 : b.Dialog), o = ne(n || "journal page");
      return a ? new Promise((E) => {
        let A = !1;
        const q = (F) => {
          A || (A = !0, E(F));
        }, V = {};
        for (const F of M)
          V[F.id] = {
            label: `<i class="fas fa-plus"></i> ${F.label}`,
            callback: () => q(F.id)
          };
        new a({
          title: `${C}: Add to Board`,
          content: `<p class="csi-drop-dialog-text">Add <strong>${o}</strong> to this board as:</p>`,
          buttons: V,
          default: "evidence",
          close: () => q(null)
        }, { classes: ["csi-toolkit", "csi-drop-dialog"] }).render(!0);
      }) : Promise.resolve("evidence");
    }
    async _deleteBoardItem(n, a) {
      !L(this.caseId) || !Pe.includes(n) || !a || await X(this.caseId, n, a);
    }
    async _moveTimelineItem(n, a) {
      var A;
      if (!L(this.caseId) || !n) return;
      const o = w(this.caseId), h = ((A = o == null ? void 0 : o.timeline) == null ? void 0 : A.findIndex((q) => q.id === n)) ?? -1, b = h + (a === "up" ? -1 : a === "down" ? 1 : 0);
      if (!o || h < 0 || b < 0 || b >= o.timeline.length) return;
      const [E] = o.timeline.splice(h, 1);
      o.timeline.splice(b, 0, E), await W(o);
    }
    _toggleDimKind(n) {
      const a = n == null ? void 0 : n.value;
      ["evidence", "suspects", "locations", "timeline"].includes(a) && (n.checked ? this._dimmedKinds.add(a) : this._dimmedKinds.delete(a), this._applyDimmedKinds());
    }
    _syncDimControls() {
      var n;
      for (const a of ((n = this.element[0]) == null ? void 0 : n.querySelectorAll("[data-csi-dim-kind]")) ?? [])
        a.checked = this._dimmedKinds.has(a.value);
    }
    _applyDimmedKinds() {
      const n = this.element[0];
      if (n) {
        for (const a of n.querySelectorAll("[data-csi-board-card]"))
          a.classList.toggle("is-type-dimmed", this._dimmedKinds.has(a.dataset.collection));
        for (const a of n.querySelectorAll("[data-csi-timeline-row]"))
          a.classList.toggle("is-type-dimmed", this._dimmedKinds.has(a.dataset.collection));
      }
    }
    _addBoardItemFromContext(n) {
      n.preventDefault(), n.stopPropagation();
      const a = n.currentTarget.dataset.collection;
      this._addBoardItem(a, this._contextBoardPosition), this._hideContextMenu();
    }
    _addBoardItem(n = "evidence", a = null) {
      L(this.caseId) && Fe.includes(n) && new _(this.caseId, n, null, { boardPosition: a }).render(!0);
    }
    _openContextMenu(n) {
      var A, q;
      if (!L(this.caseId) || n.target.closest("[data-csi-board-card], button, input, select, textarea")) return;
      const a = (A = this.element[0]) == null ? void 0 : A.querySelector("[data-csi-context-menu]"), o = (q = this.element[0]) == null ? void 0 : q.querySelector("[data-csi-board-viewport]");
      if (!a || !o) return;
      n.preventDefault(), n.stopPropagation(), this._contextBoardPosition = this._clientToBoardPosition(n.clientX, n.clientY), a.hidden = !1;
      const h = a.offsetWidth || 156, g = a.offsetHeight || 180, b = Math.max(4, globalThis.innerWidth - h - 4), E = Math.max(4, globalThis.innerHeight - g - 4);
      a.style.left = `${ue(n.clientX, 4, b)}px`, a.style.top = `${ue(n.clientY, 4, E)}px`, this._boundContextClose && document.removeEventListener("click", this._boundContextClose), this._boundContextClose = () => this._hideContextMenu(), globalThis.setTimeout(() => document.addEventListener("click", this._boundContextClose, { once: !0 }), 0);
    }
    _hideContextMenu() {
      var a;
      const n = (a = this.element[0]) == null ? void 0 : a.querySelector("[data-csi-context-menu]");
      n && (n.hidden = !0), this._boundContextClose && document.removeEventListener("click", this._boundContextClose), this._boundContextClose = null;
    }
    _clientToBoardPosition(n, a) {
      var b;
      const o = (b = this.element[0]) == null ? void 0 : b.querySelector("[data-csi-board-viewport]"), h = o == null ? void 0 : o.getBoundingClientRect(), g = this._getView();
      return h ? {
        x: Math.round((n - h.left - g.x) / g.scale - 220 / 2),
        y: Math.round((a - h.top - g.y) / g.scale - 32)
      } : null;
    }
    _startConnection(n) {
      var h;
      if (n.preventDefault(), n.stopPropagation(), !L(this.caseId)) return;
      const o = n.currentTarget.dataset.itemId;
      if (o) {
        this._pendingConnection = { fromId: o };
        for (const g of this.element[0].querySelectorAll("[data-csi-board-card]")) g.classList.toggle("is-link-source", g.dataset.itemId === o);
        (h = ui.notifications) == null || h.info(`${C}: Select another card to create a connection.`);
      }
    }
    async _completeConnection(n) {
      if (!this._pendingConnection || n.target.closest("button, input, select, textarea") || !L(this.caseId)) return;
      const a = n.currentTarget.dataset.itemId, o = this._pendingConnection.fromId;
      this._pendingConnection = null;
      for (const b of this.element[0].querySelectorAll("[data-csi-board-card]")) b.classList.remove("is-link-source");
      if (!a || a === o) return;
      const h = w(this.caseId);
      if (!h) return;
      const g = me({
        id: R(),
        fromId: o,
        toId: a,
        label: "linked to",
        type: "link",
        style: "solid",
        color: "cyan",
        visibility: "players"
      });
      h.connections.push(g), await W(h), new _(this.caseId, "connections", g.id).render(!0);
    }
    async close(n = {}) {
      return this._hideContextMenu(), I(this), super.close(n);
    }
  };
}
function We(s) {
  const {
    LegacyApplication: l,
    moduleId: y,
    moduleTitle: C,
    singularLabel: _,
    getItemTitle: w,
    getCase: x,
    buildItemChoices: P,
    parseItemElement: L,
    saveCase: N,
    deleteBoardItem: z,
    defaultBoardPosition: X,
    openJournalByUuid: W,
    readJournalDropData: Z
  } = s, ee = ["evidence", "suspects", "locations", "timeline"];
  return class extends l {
    constructor(d, p, m, I = {}) {
      super(I);
      k(this, "caseId");
      k(this, "collection");
      k(this, "itemId");
      k(this, "isNew");
      k(this, "boardPosition");
      k(this, "prefill");
      this.caseId = d, this.collection = p, this.itemId = m || R(), this.isNew = !m, this.boardPosition = I.boardPosition ? {
        x: Number(I.boardPosition.x) || 0,
        y: Number(I.boardPosition.y) || 0
      } : null, this.prefill = I.prefill ?? null;
    }
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        title: "Edit CSI Board Card",
        template: `modules/${y}/templates/board-item-editor.hbs`,
        classes: ["csi-toolkit", "csi-board-item-editor"],
        width: 560,
        height: 520,
        resizable: !0
      });
    }
    get title() {
      const d = this._getItem();
      return this.isNew ? `Add ${_(this.collection)}` : d ? `Edit ${w(d, this.collection)}` : "Edit CSI Board Card";
    }
    async getData() {
      var m;
      const d = x(this.caseId), p = this._getItem();
      return {
        caseId: this.caseId,
        collection: this.collection,
        item: p,
        isNew: this.isNew,
        itemChoices: d ? P(d, !((m = game.user) != null && m.isGM)) : [],
        isEvidence: this.collection === "evidence",
        isSuspect: this.collection === "suspects",
        isLocation: this.collection === "locations",
        isTimeline: this.collection === "timeline",
        isConnection: this.collection === "connections",
        hasJournalField: ee.includes(this.collection),
        journalLink: await this._resolveJournalLink(p == null ? void 0 : p.journalUuid),
        options: {
          evidenceTypes: ge,
          evidenceStatuses: ye,
          suspectStatuses: be,
          connectionTypes: _e,
          connectionStyles: Ce,
          connectionColors: Ie
        }
      };
    }
    activateListeners(d) {
      var M, j, U;
      super.activateListeners(d);
      const p = d[0], m = (M = p == null ? void 0 : p.matches) != null && M.call(p, "[data-csi-board-item-form]") ? p : (j = p == null ? void 0 : p.querySelector) == null ? void 0 : j.call(p, "[data-csi-board-item-form]");
      m && m.addEventListener("submit", (n) => this._save(n)), d.find("[data-action='pick-image']").on("click", (n) => this._pickImage(n.currentTarget)), d.find("[data-action='delete-board-item']").on("click", (n) => this._delete(n)), d.find("[data-action='open-journal-link']").on("click", () => this._openJournalLink()), d.find("[data-action='clear-journal-link']").on("click", () => this._setJournalLink("", ""));
      const I = (U = d[0]) == null ? void 0 : U.querySelector("[data-csi-journal-drop]");
      I && (I.addEventListener("dragover", (n) => {
        n.preventDefault(), I.classList.add("is-drop-target");
      }), I.addEventListener("dragleave", () => I.classList.remove("is-drop-target")), I.addEventListener("drop", (n) => this._onJournalDrop(n, I)));
    }
    async _resolveJournalLink(d) {
      if (!d) return null;
      const p = await this._resolveJournalDoc(d);
      return p ? { uuid: d, name: p.name, missing: !1 } : { uuid: d, name: d, missing: !0 };
    }
    async _resolveJournalDoc(d) {
      const p = globalThis.fromUuid;
      if (!d || typeof p != "function") return null;
      try {
        return await p(d);
      } catch {
        return null;
      }
    }
    _openJournalLink() {
      var m;
      const d = (m = this.element[0]) == null ? void 0 : m.querySelector("[data-csi-journal-input]"), p = d == null ? void 0 : d.value;
      p && W(p);
    }
    async _onJournalDrop(d, p) {
      var I;
      d.preventDefault(), d.stopPropagation(), p.classList.remove("is-drop-target");
      const m = await Z(d);
      if (!m) {
        (I = ui.notifications) == null || I.warn(`${C}: Drop a journal entry or page to link it.`);
        return;
      }
      this._setJournalLink(m.uuid, m.name);
    }
    _setJournalLink(d, p) {
      const m = this.element[0], I = m == null ? void 0 : m.querySelector("[data-csi-journal-input]"), M = m == null ? void 0 : m.querySelector("[data-csi-journal-name]"), j = m == null ? void 0 : m.querySelector("[data-action='open-journal-link']"), U = m == null ? void 0 : m.querySelector("[data-action='clear-journal-link']");
      I && (I.value = d || ""), M && (M.textContent = d ? p || d : "No journal linked. Drag a journal entry or page here.", M.classList.toggle("is-empty", !d), M.classList.remove("is-missing")), j && (j.disabled = !d), U && (U.disabled = !d);
    }
    _getItem() {
      var I;
      const d = x(this.caseId), p = (I = d == null ? void 0 : d[this.collection]) == null ? void 0 : I.find((M) => M.id === this.itemId);
      if (p) return p;
      if (!this.isNew) return null;
      const m = Je(this.collection, "players", this.itemId);
      return this.prefill ? { ...m, ...this.prefill } : m;
    }
    async _save(d) {
      var j, U, n;
      d.preventDefault(), d.stopPropagation(), (j = d.stopImmediatePropagation) == null || j.call(d);
      const p = d.currentTarget, m = x(this.caseId);
      if (!m)
        return (U = ui.notifications) == null || U.warn(`${C}: The case could not be found.`), !1;
      const I = m[this.collection].findIndex((a) => a.id === this.itemId);
      if (I < 0 && !this.isNew)
        return (n = ui.notifications) == null || n.warn(`${C}: The item could not be found.`), !1;
      const M = L(this.collection, p);
      return M.id = this.itemId, M.visibility = "players", M.hidden = I >= 0 ? !!m[this.collection][I].hidden : !1, I >= 0 ? m[this.collection][I] = M : m[this.collection].push(M), this.isNew && this.collection !== "connections" && (m.boardLayout.cards[this.itemId] = this.boardPosition ?? X(m.evidence.length + m.suspects.length + m.locations.length + m.timeline.length)), await N(m), this.close(), !1;
    }
    async _delete(d) {
      var m;
      return d.preventDefault(), d.stopPropagation(), (m = d.stopImmediatePropagation) == null || m.call(d), this.isNew || await z(this.caseId, this.collection, this.itemId, { confirm: !0 }) && this.close(), !1;
    }
    _pickImage(d) {
      var I, M, j, U;
      const p = (I = d.closest(".csi-image-field")) == null ? void 0 : I.querySelector("input"), m = globalThis.FilePicker ?? ((U = (j = (M = globalThis.foundry) == null ? void 0 : M.applications) == null ? void 0 : j.apps) == null ? void 0 : U.FilePicker);
      !p || !m || new m({
        type: "image",
        current: p.value,
        callback: (n) => {
          p.value = n, p.dispatchEvent(new Event("change", { bubbles: !0 }));
        }
      }).render(!0);
    }
  };
}
const B = "csi-toolkit", S = "CSI Toolkit", ce = `module.${B}`, Ke = [
  `modules/${B}/templates/case-manager.hbs`,
  `modules/${B}/templates/case-browser.hbs`,
  `modules/${B}/templates/case-board.hbs`,
  `modules/${B}/templates/item-card.hbs`,
  `modules/${B}/templates/board-item-editor.hbs`
];
function Qe() {
  game.settings.register(B, "cases", {
    name: "CSI Toolkit Cases",
    hint: "Stores all investigation cases for this world.",
    scope: "world",
    config: !1,
    type: Object,
    default: {}
  }), game.settings.register(B, "favoriteBoards", {
    name: "CSI Toolkit Favorite Boards",
    hint: "Stores the shared list of favorited case boards for quick access.",
    scope: "world",
    config: !1,
    type: Array,
    default: []
  });
}
function Ze() {
  Handlebars.registerHelper("csiEq", (s, l) => s === l), Handlebars.registerHelper("csiLabel", (s) => fe(s)), Handlebars.registerHelper("csiCount", (s) => Array.isArray(s) ? s.length : 0), Handlebars.registerHelper("csiFallback", (s, l) => s || l), Handlebars.registerHelper("csiJoin", (s) => Array.isArray(s) ? s.join(", ") : ""), Handlebars.registerHelper("csiOption", (s, l) => s === l ? "selected" : ""), Handlebars.registerHelper("csiChecked", (s) => s === "players" ? "checked" : "");
}
function et() {
  var s, l, y;
  return ((l = (s = globalThis.foundry) == null ? void 0 : s.applications) == null ? void 0 : l.api) ?? ((y = foundry == null ? void 0 : foundry.applications) == null ? void 0 : y.api) ?? null;
}
function tt() {
  var s, l, y;
  return ((l = (s = globalThis.foundry) == null ? void 0 : s.appv1) == null ? void 0 : l.api) ?? ((y = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : y.api) ?? null;
}
function it(s = {}, l = {}) {
  var C, _, w;
  const y = ((_ = (C = globalThis.foundry) == null ? void 0 : C.utils) == null ? void 0 : _.mergeObject) ?? ((w = foundry == null ? void 0 : foundry.utils) == null ? void 0 : w.mergeObject);
  return typeof y == "function" ? y(s, l, { inplace: !1 }) : { ...s, ...l };
}
function nt() {
  var s, l, y, C, _;
  return ((y = (l = (s = globalThis.foundry) == null ? void 0 : s.utils) == null ? void 0 : l.randomID) == null ? void 0 : y.call(l, 8)) ?? ((_ = (C = foundry == null ? void 0 : foundry.utils) == null ? void 0 : C.randomID) == null ? void 0 : _.call(C, 8)) ?? Math.random().toString(36).slice(2, 10);
}
function Ae(s = {}) {
  return {
    id: String(s.id ?? `legacy-application-${nt()}`),
    tag: s.tag ?? "section",
    classes: Array.isArray(s.classes) ? s.classes : [],
    window: {
      title: s.title ?? "",
      icon: s.icon,
      resizable: s.resizable === !0
    },
    position: {
      width: Number(s.width ?? 600),
      height: s.height === "auto" ? "auto" : Number(s.height ?? 600)
    }
  };
}
function st(s) {
  return class extends s {
    constructor(C = {}) {
      const _ = it(new.target.defaultOptions ?? {}, C);
      super(Ae(_));
      k(this, "_v1Options");
      this._v1Options = _;
    }
    static get defaultOptions() {
      return {};
    }
    static get DEFAULT_OPTIONS() {
      return Ae(this.defaultOptions ?? {});
    }
    activateListeners(C) {
    }
    async _renderHTML(C, _) {
      var N, z, X;
      const w = typeof this.getData == "function" ? await this.getData() : {}, x = ((N = this._v1Options) == null ? void 0 : N.template) ?? ((z = this.options) == null ? void 0 : z.template) ?? ((X = this.constructor.defaultOptions) == null ? void 0 : X.template);
      if (!x) return document.createDocumentFragment();
      const P = await globalThis.renderTemplate(x, w), L = document.createElement("template");
      return L.innerHTML = P.trim(), L.content;
    }
    _activateV1Form(C) {
      var w, x;
      if (typeof this._updateObject != "function") return;
      const _ = (w = C.matches) != null && w.call(C, "form") ? C : (x = C.querySelector) == null ? void 0 : x.call(C, "form");
      _ instanceof HTMLFormElement && _.addEventListener("submit", async (P) => {
        var N;
        P.preventDefault(), P.stopPropagation();
        const L = new FormData(_);
        await this._updateObject(P, L), ((N = this._v1Options) == null ? void 0 : N.closeOnSubmit) === !0 && await this.close();
      });
    }
    _replaceHTML(C, _, w) {
      var z, X, W, Z;
      _.replaceChildren(C);
      const x = globalThis.jQuery ?? globalThis.$, P = ((z = _.closest) == null ? void 0 : z.call(_, ".window-app, .app, .application")) ?? _, L = x ? x(P) : P;
      try {
        Object.defineProperty(this, "element", {
          value: L,
          configurable: !0,
          writable: !0
        });
      } catch {
        try {
          this.element = L;
        } catch {
        }
      }
      const N = (X = this._v1Options) == null ? void 0 : X.classes;
      Array.isArray(N) && N.length && (_.classList.add(...N), (Z = (W = _.closest) == null ? void 0 : W.call(_, ".window-app, .app, .application")) == null || Z.classList.add(...N)), this._activateV1Form(_), typeof this.activateListeners == "function" && this.activateListeners(x ? x(_) : _);
    }
  };
}
function at() {
  const s = et(), l = tt(), y = globalThis.Application ?? (l == null ? void 0 : l.Application) ?? (s == null ? void 0 : s.ApplicationV1) ?? globalThis.FormApplication ?? (l == null ? void 0 : l.FormApplication) ?? (s == null ? void 0 : s.FormApplication);
  if (y) return y;
  const C = s == null ? void 0 : s.ApplicationV2;
  return C ? st(C) : null;
}
(() => {
  const s = at(), l = {
    manager: null,
    browser: null,
    boards: /* @__PURE__ */ new Map(),
    playerBoard: null
  };
  Hooks.once("init", async () => {
    Qe(), Ze(), await loadTemplates(Ke), console.log(`${S} | Initialized`);
  }), Hooks.once("ready", () => {
    game.csiToolkit = y();
    const e = game.modules.get(B);
    e && (e.api = game.csiToolkit), C(), game.socket.on(ce, E), console.log(`${S} | API available at game.csiToolkit`);
  });
  function y() {
    return {
      openCaseBoard: (e, t = {}) => o(e, t),
      openCaseManager: () => n(),
      openCaseBrowser: () => a(),
      createCase: (e) => p(e),
      getCases: () => w(),
      exportCase: (e) => U(e),
      importCase: (e) => j(e)
    };
  }
  function C() {
    const e = game.modules.get("holosuite-core"), t = e != null && e.active ? e.api : null;
    return t != null && t.registerApp ? (t.registerApp({
      id: B,
      title: "CSI Toolkit",
      icon: "fa-solid fa-fingerprint",
      premium: !1,
      featureId: B,
      description: "Open case files, evidence boards, and investigation tools.",
      open: () => {
        var i;
        return (i = game.user) != null && i.isGM ? n() : a();
      }
    }), typeof t.registerLauncherSection == "function" && t.registerLauncherSection({
      id: B,
      title: "Favorites",
      icon: "fa-solid fa-bookmark",
      render: () => _(),
      onClick: (i) => {
        var r;
        return o(i, { playerMode: !((r = game.user) != null && r.isGM) });
      }
    }), !0) : !1;
  }
  function _() {
    const e = X();
    return e.length ? e.map((t) => `
      <button type="button" class="holosuite-section-item" data-holosuite-section-item="${ne(t.id)}">
        <span class="holosuite-section-item-icon"><i class="fa-solid fa-fingerprint"></i></span>
        <span class="holosuite-section-item-label">${ne(t.title)}</span>
        <span class="holosuite-section-item-meta">${ne(fe(t.status))}</span>
      </button>
    `).join("") : '<p class="holosuite-section-empty">No favorited boards yet.</p>';
  }
  function w() {
    return ke(game.settings.get(B, "cases") ?? {});
  }
  async function x(e) {
    return game.settings.set(B, "cases", e ?? {});
  }
  function P() {
    try {
      const e = game.settings.get(B, "favoriteBoards");
      return Array.isArray(e) ? e.map(String) : [];
    } catch {
      return [];
    }
  }
  function L(e) {
    return P().includes(String(e));
  }
  function N() {
    var e;
    return ((e = game.user) == null ? void 0 : e.isGM) === !0;
  }
  async function z(e) {
    var f;
    if (!e) return !1;
    if (!N())
      return (f = ui.notifications) == null || f.warn(`${S}: Only the GM can change favorite boards.`), L(e);
    const t = String(e), i = P(), r = i.indexOf(t), c = r >= 0;
    return c ? i.splice(r, 1) : i.push(t), await game.settings.set(B, "favoriteBoards", i), W(), Z(), !c;
  }
  function X() {
    var i;
    const e = ((i = game.user) == null ? void 0 : i.isGM) === !0, t = w();
    return P().map((r) => t[r] ? J(t[r]) : null).filter(Boolean).filter((r) => e || r.visibility !== "gm").map((r) => ({ id: r.id, title: r.title, status: r.status }));
  }
  function W() {
    var e, t;
    (t = game.socket) == null || t.emit(ce, { type: "favorites-updated", userId: (e = game.user) == null ? void 0 : e.id });
  }
  function Z() {
    var i;
    const e = game.modules.get("holosuite-core"), t = e != null && e.active ? e.api : null;
    (i = t == null ? void 0 : t.refreshLauncher) == null || i.call(t);
  }
  function ee() {
    var t;
    return (((t = game.users) == null ? void 0 : t.contents) ?? Array.from(game.users ?? [])).some((i) => (i == null ? void 0 : i.isGM) && (i == null ? void 0 : i.active));
  }
  function O(e) {
    const t = w();
    return t[e] ? J(t[e]) : null;
  }
  async function K(e, { notify: t = !0, render: i = !0, updateReason: r = null, userName: c = null } = {}) {
    var v;
    const f = J(e);
    if (!((v = game.user) != null && v.isGM)) return d(f, { notify: t, render: i });
    const u = w();
    return u[f.id] = f, await x(u), t && b(f.id, { reason: r, userName: c }), i && de(f.id), f;
  }
  async function d(e, { render: t = !0, notify: i = !0 } = {}) {
    var r, c, f, u, v, $;
    return (r = game.socket) != null && r.emit ? ee() ? (game.socket.emit(ce, {
      type: "save-case-request",
      caseData: e,
      userId: (u = game.user) == null ? void 0 : u.id,
      userName: (v = game.user) == null ? void 0 : v.name
    }), i && (($ = ui.notifications) == null || $.info(`${S}: Board update sent to the GM.`)), e) : ((f = ui.notifications) == null || f.warn(`${S}: No active GM is connected to save board changes.`), e) : ((c = ui.notifications) == null || c.warn(`${S}: A GM must be connected to save board changes.`), e);
  }
  async function p(e = {}) {
    var r;
    const t = J(e, { forceNewId: !e.id }), i = w();
    return i[t.id] = t, await x(i), b(t.id), (r = ui.notifications) == null || r.info(`${S}: Created case "${t.title}".`), t;
  }
  async function m(e) {
    var r;
    const t = w(), i = t[e];
    return i ? (delete t[e], await x(t), qe(e), b(e), (r = ui.notifications) == null || r.info(`${S}: Deleted case "${i.title}".`), !0) : !1;
  }
  async function I(e, t, i, { confirm: r = !0 } = {}) {
    var v, $;
    if (!Pe.includes(t) || !i) return !1;
    const c = O(e);
    if (!c) return !1;
    const f = (v = c[t]) == null ? void 0 : v.find((T) => T.id === i);
    if (!f) return !1;
    const u = xe(f, t);
    return r && !await Be({
      title: `Delete ${fe(he(t))}`,
      content: `<p>Delete <strong>${ne(u)}</strong>?${t === "connections" ? "" : " Any attached connections will also be deleted."}</p>`,
      yes: () => !0,
      no: () => !1,
      defaultYes: !1
    }) ? !1 : (c[t] = c[t].filter((T) => T.id !== i), t !== "connections" && (c.connections = c.connections.filter((T) => T.fromId !== i && T.toId !== i), c.timeline = c.timeline.map((T) => ({
      ...T,
      linkedItemIds: (T.linkedItemIds ?? []).filter((D) => D !== i)
    })), delete c.boardLayout.cards[i]), await K(c), ($ = ui.notifications) == null || $.info(`${S}: Deleted "${u}".`), !0);
  }
  async function M(e) {
    var c;
    const t = O(e);
    if (!t) return null;
    const i = J({
      ...t,
      id: R(),
      title: `${t.title} Copy`
    }), r = w();
    return r[i.id] = i, await x(r), b(i.id), (c = ui.notifications) == null || c.info(`${S}: Duplicated case "${t.title}".`), i;
  }
  async function j(e) {
    var r;
    const t = J({
      ...e,
      id: e.id || R()
    }), i = w();
    return i[t.id] && (t.id = R()), i[t.id] = t, await x(i), b(t.id), (r = ui.notifications) == null || r.info(`${S}: Imported case "${t.title}".`), t;
  }
  function U(e) {
    const t = O(e);
    if (!t) return !1;
    const i = new Blob([JSON.stringify(t, null, 2)], { type: "application/json" }), r = URL.createObjectURL(i), c = document.createElement("a");
    return c.href = r, c.download = `${Xe(t.title)}.json`, c.click(), URL.revokeObjectURL(r), !0;
  }
  function n() {
    var e;
    return (e = game.user) != null && e.isGM ? (l.manager || (l.manager = new F()), l.manager.render(!0), l.manager) : a();
  }
  function a() {
    return l.browser || (l.browser = new V()), l.browser.render(!0), l.browser;
  }
  function o(e, t = {}) {
    var v, $, T;
    if (!e)
      return (v = ui.notifications) == null || v.warn(`${S}: No case id provided.`), null;
    if (!O(e))
      return ($ = ui.notifications) == null || $.warn(`${S}: Case "${e}" was not found.`), null;
    const r = t.playerMode ?? !((T = game.user) != null && T.isGM), c = `${e}:${r ? "player" : "gm"}`, f = l.boards.get(c);
    if (f)
      return f.render(!0), f;
    const u = new q(e, { playerMode: r });
    return l.boards.set(c, u), u.render(!0), u;
  }
  async function h(e, t) {
    var r, c, f, u, v, $;
    const i = Q(t);
    return (r = game.socket) != null && r.emit ? ee() ? (game.socket.emit(ce, {
      type: "publish-layout-request",
      caseId: e,
      boardLayout: i,
      userId: (u = game.user) == null ? void 0 : u.id,
      userName: (v = game.user) == null ? void 0 : v.name
    }), ($ = ui.notifications) == null || $.info(`${S}: Layout publish request sent to the GM.`), !0) : ((f = ui.notifications) == null || f.warn(`${S}: No active GM is connected to publish the board layout.`), !1) : ((c = ui.notifications) == null || c.warn(`${S}: A GM must be connected to publish the board layout.`), !1);
  }
  async function g(e, t, { userId: i = ((c) => (c = game.user) == null ? void 0 : c.id)(), userName: r = ((f) => (f = game.user) == null ? void 0 : f.name)() } = {}) {
    var T;
    const u = O(e);
    if (!u) return !1;
    const v = Q(u.boardLayout), $ = Q(t);
    return u.boardLayout = Q({
      ...v,
      cards: $.cards
    }), await K(u, {
      render: !1,
      updateReason: "layout-published",
      userName: r
    }), de(e, { resetLayout: !0 }), (T = ui.notifications) == null || T.info(`${S}: Published shared board layout${r ? ` from ${r}` : ""}.`), !0;
  }
  function b(e, { reason: t = null, userName: i = null } = {}) {
    var r, c;
    (c = game.socket) == null || c.emit(ce, { type: "case-updated", caseId: e, reason: t, userName: i, userId: (r = game.user) == null ? void 0 : r.id });
  }
  function E(e) {
    var t, i, r, c, f;
    if (e) {
      if (e.type === "save-case-request") {
        if (!((t = game.user) != null && t.isGM) || !e.caseData) return;
        K(e.caseData, { render: !1 }).then((u) => {
          var v;
          u && (de(u.id), (v = ui.notifications) == null || v.info(`${S}: Saved player board update from ${e.userName ?? "a player"}.`));
        }).catch((u) => {
          var v;
          console.error(`${S} | Could not save player board update`, u), (v = ui.notifications) == null || v.error(`${S}: Player board update could not be saved.`);
        });
        return;
      }
      if (e.type === "publish-layout-request") {
        if (!((i = game.user) != null && i.isGM) || !e.caseId || !e.boardLayout) return;
        g(e.caseId, e.boardLayout, {
          userId: e.userId,
          userName: e.userName
        }).catch((u) => {
          var v;
          console.error(`${S} | Could not publish player layout`, u), (v = ui.notifications) == null || v.error(`${S}: Player layout could not be published.`);
        });
        return;
      }
      if (e.type === "case-updated" && e.caseId) {
        if (e.userId && e.userId === ((r = game.user) == null ? void 0 : r.id)) return;
        de(e.caseId, { resetLayout: e.reason === "layout-published" }), e.reason === "layout-published" && ((c = ui.notifications) == null || c.info(`${S}: ${e.userName ?? "Someone"} published a shared board layout.`));
        return;
      }
      if (e.type === "favorites-updated") {
        if (e.userId && e.userId === ((f = game.user) == null ? void 0 : f.id)) return;
        Z();
        for (const u of l.boards.values()) u.rendered && u.render(!0);
        return;
      }
    }
  }
  const A = We({
    LegacyApplication: s,
    moduleId: B,
    moduleTitle: S,
    singularLabel: he,
    getItemTitle: xe,
    getCase: O,
    buildItemChoices: Te,
    parseItemElement: ae,
    saveCase: K,
    deleteBoardItem: I,
    defaultBoardPosition: pe,
    openJournalByUuid: Ee,
    readJournalDropData: $e
  }), q = Ve({
    LegacyApplication: s,
    moduleId: B,
    moduleTitle: S,
    CSIBoardItemEditor: A,
    getCase: O,
    prepareBoardData: ie,
    openCaseManager: n,
    canUserEditBoard: De,
    publishSharedLayout: g,
    requestLayoutPublish: h,
    deleteBoardItem: I,
    saveCase: K,
    defaultBoardPosition: pe,
    getRectEdgeAnchor: He,
    isFinitePoint: Ge,
    openJournalByUuid: Ee,
    readJournalDropData: $e,
    toggleFavorite: z,
    canFavorite: N,
    clearBoardApp: (e) => {
      l.boards.delete(`${e.caseId}:${e.playerMode ? "player" : "gm"}`), l.playerBoard === e && (l.playerBoard = null);
    }
  });
  class V extends s {
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        id: "csi-case-browser",
        title: "CSI Toolkit Case Files",
        template: `modules/${B}/templates/case-browser.hbs`,
        classes: ["csi-toolkit", "csi-case-browser"],
        width: 520,
        height: 620,
        resizable: !0
      });
    }
    async getData() {
      var i;
      return {
        cases: Object.values(w()).map((r) => J(r)).sort((r, c) => r.title.localeCompare(c.title)),
        isGM: (i = game.user) == null ? void 0 : i.isGM,
        canContribute: Ue()
      };
    }
    activateListeners(t) {
      super.activateListeners(t), t.find("[data-action='open-board']").on("click", (i) => {
        var r;
        o(i.currentTarget.dataset.caseId, { playerMode: !((r = game.user) != null && r.isGM) });
      }), t.find("[data-action='open-manager']").on("click", () => n());
    }
    async close(t = {}) {
      return l.browser = null, super.close(t);
    }
  }
  class F extends s {
    constructor(t = {}) {
      super(t), this.selectedCaseId = t.caseId ?? null;
    }
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        id: "csi-case-manager",
        title: "CSI Toolkit Case Manager",
        template: `modules/${B}/templates/case-manager.hbs`,
        classes: ["csi-toolkit", "csi-case-manager"],
        width: 1180,
        height: 820,
        resizable: !0
      });
    }
    async getData() {
      var f;
      const t = w(), i = Object.values(t).map((u) => J(u)).sort((u, v) => u.title.localeCompare(v.title));
      !this.selectedCaseId && i.length && (this.selectedCaseId = i[0].id), this.selectedCaseId && !t[this.selectedCaseId] && (this.selectedCaseId = ((f = i[0]) == null ? void 0 : f.id) ?? null);
      const r = this.selectedCaseId ? J(t[this.selectedCaseId]) : null, c = r ? Te(r) : [];
      return {
        cases: i,
        selected: r,
        itemChoices: c,
        options: {
          caseStatuses: Ne,
          themes: Oe,
          evidenceTypes: ge,
          evidenceStatuses: ye,
          suspectStatuses: be,
          connectionTypes: _e,
          connectionStyles: Ce,
          connectionColors: Ie
        }
      };
    }
    activateListeners(t) {
      super.activateListeners(t), t.find("[data-action='select-case']").on("click", (i) => {
        this.selectedCaseId = i.currentTarget.dataset.caseId, this.render(!1);
      }), t.find("[data-action='new-case']").on("click", () => this._createNewCase()), t.find("[data-csi-case-form]").on("submit", (i) => this._saveSelectedCase(i)), t.find("[data-action='save-case']").on("click", (i) => this._saveSelectedCase(i)), t.find("[data-action='delete-case']").on("click", () => this._deleteSelectedCase()), t.find("[data-action='duplicate-case']").on("click", () => this._duplicateSelectedCase()), t.find("[data-action='open-board']").on("click", () => o(this.selectedCaseId)), t.find("[data-action='pick-image']").on("click", (i) => this._pickImage(i.currentTarget)), t.find("[data-action='export-case']").on("click", () => U(this.selectedCaseId)), t.find("[data-action='import-case']").on("click", () => {
        var i;
        return (i = this.element[0].querySelector("[data-csi-import-file]")) == null ? void 0 : i.click();
      }), t.find("[data-csi-import-file]").on("change", (i) => this._importFromFile(i.currentTarget));
    }
    _readCurrentCase() {
      const t = this.element[0].querySelector("[data-csi-case-form]");
      return t ? te(t, this.selectedCaseId) : O(this.selectedCaseId);
    }
    async _createNewCase() {
      const t = await p({
        title: "New Investigation",
        subtitle: "Unfiled case",
        description: "Describe the incident, victim, premise, or central mystery.",
        visibility: "players"
      });
      this.selectedCaseId = t.id, this.render(!1);
    }
    async _saveSelectedCase(t) {
      var i, r;
      if (t.preventDefault(), !!this.selectedCaseId)
        try {
          const c = this._readCurrentCase();
          await K(c), this.selectedCaseId = c.id, (i = ui.notifications) == null || i.info(`${S}: Saved case "${c.title}".`), this.render(!1);
        } catch (c) {
          console.error(`${S} | Could not save case`, c), (r = ui.notifications) == null || r.error(`${S}: ${c.message}`);
        }
    }
    async _deleteSelectedCase() {
      if (!this.selectedCaseId) return;
      const t = O(this.selectedCaseId);
      !t || !await Be({
        title: "Delete CSI Case",
        content: `<p>Delete <strong>${ne(t.title)}</strong>? This cannot be undone.</p>`,
        yes: () => !0,
        no: () => !1,
        defaultYes: !1
      }) || (await m(this.selectedCaseId), this.selectedCaseId = null, this.render(!1));
    }
    async _duplicateSelectedCase() {
      if (!this.selectedCaseId) return;
      const t = await M(this.selectedCaseId);
      t && (this.selectedCaseId = t.id, this.render(!1));
    }
    _pickImage(t) {
      var c, f, u, v, $;
      const i = (c = t.closest(".csi-image-field")) == null ? void 0 : c.querySelector("input");
      if (!i) return;
      const r = globalThis.FilePicker ?? ((v = (u = (f = globalThis.foundry) == null ? void 0 : f.applications) == null ? void 0 : u.apps) == null ? void 0 : v.FilePicker);
      if (!r) {
        ($ = ui.notifications) == null || $.warn(`${S}: Foundry FilePicker is unavailable.`);
        return;
      }
      new r({
        type: "image",
        current: i.value,
        callback: (T) => {
          i.value = T, i.dispatchEvent(new Event("change", { bubbles: !0 }));
        }
      }).render(!0);
    }
    async _importFromFile(t) {
      var r, c;
      const i = (r = t.files) == null ? void 0 : r[0];
      if (i)
        try {
          const f = await i.text(), u = await j(JSON.parse(f));
          this.selectedCaseId = u.id, this.render(!1);
        } catch (f) {
          console.error(`${S} | Import failed`, f), (c = ui.notifications) == null || c.error(`${S}: Import failed. ${f.message}`);
        } finally {
          t.value = "";
        }
    }
    async close(t = {}) {
      return l.manager = null, super.close(t);
    }
  }
  function te(e, t) {
    const i = new FormData(e), r = O(t) ?? J({ id: t }), c = J({
      id: t,
      title: i.get("title"),
      subtitle: i.get("subtitle"),
      status: i.get("status"),
      description: i.get("description"),
      image: i.get("image"),
      visibility: "players",
      evidence: r.evidence,
      suspects: r.suspects,
      locations: r.locations,
      timeline: r.timeline,
      connections: r.connections,
      boardLayout: {
        ...r.boardLayout,
        theme: i.get("theme")
      }
    });
    return J(c);
  }
  function ae(e, t) {
    const i = (f) => {
      var u;
      return ((u = t.querySelector(`[name="${f}"]`)) == null ? void 0 : u.value) ?? "";
    }, r = "players", c = { id: t.dataset.itemId || R(), visibility: r };
    return e === "evidence" ? ve({
      ...c,
      title: i("title"),
      type: i("type"),
      status: i("status"),
      description: i("description"),
      image: i("image"),
      journalUuid: i("journalUuid"),
      notes: i("notes")
    }) : e === "suspects" ? we({
      ...c,
      name: i("name"),
      alias: i("alias"),
      status: i("status"),
      motive: i("motive"),
      alibi: i("alibi"),
      image: i("image"),
      journalUuid: i("journalUuid"),
      notes: i("notes")
    }) : e === "locations" ? Se({
      ...c,
      name: i("name"),
      sceneId: i("sceneId"),
      image: i("image"),
      description: i("description"),
      journalUuid: i("journalUuid"),
      notes: i("notes")
    }) : e === "timeline" ? Le({
      ...c,
      time: i("time"),
      title: i("title"),
      description: i("description"),
      journalUuid: i("journalUuid"),
      linkedItemIds: i("linkedItemIds").split(",").map((f) => f.trim()).filter(Boolean)
    }) : me({
      id: c.id,
      visibility: r,
      fromId: i("fromId"),
      toId: i("toId"),
      label: i("label"),
      type: i("type"),
      style: i("style"),
      color: i("color")
    });
  }
  function ie(e, { playerMode: t = !1, layoutOverride: i = null } = {}) {
    var $, T;
    const r = O(e);
    if (!r) return { isMissing: !0, playerMode: t, isGM: ($ = game.user) == null ? void 0 : $.isGM };
    const c = ke(r);
    i && (c.boardLayout = Q(i)), c.evidence = re(c.evidence), c.suspects = re(c.suspects), c.locations = re(c.locations), c.timeline = re(c.timeline);
    const f = je(c), u = new Map(f.map((D) => [D.id, D]));
    c.timeline = c.timeline.map((D) => ({
      ...D,
      linkedLabels: (D.linkedItemIds ?? []).map((H) => {
        var G;
        return (G = u.get(H)) == null ? void 0 : G.label;
      }).filter(Boolean)
    }));
    const v = re(c.connections).map((D) => {
      const H = u.get(D.fromId), G = u.get(D.toId);
      return {
        ...D,
        fromLabel: (H == null ? void 0 : H.label) ?? D.fromId,
        toLabel: (G == null ? void 0 : G.label) ?? D.toId,
        x1: H ? H.x + 220 / 2 : 0,
        y1: H ? H.y + 94 : 0,
        x2: G ? G.x + 220 / 2 : 0,
        y2: G ? G.y + 94 : 0,
        labelX: H && G ? Math.round((H.x + G.x + 220) / 2) : 0,
        labelY: H && G ? Math.round((H.y + G.y) / 2 + 84) : 0,
        typeClass: `csi-connection--${D.type}`,
        styleClass: `csi-connection-line--${D.style}`,
        colorClass: `csi-connection-color--${D.color}`,
        hasVisibleEnds: !!(H && G)
      };
    }).filter((D) => D.hasVisibleEnds);
    return {
      case: c,
      cards: f,
      connections: v,
      boardSize: { width: 5200, height: 3600 },
      viewStyle: `transform: translate(${c.boardLayout.view.x}px, ${c.boardLayout.view.y}px) scale(${c.boardLayout.view.scale});`,
      zoomPercent: Math.round(c.boardLayout.view.scale * 100),
      themeClass: `csi-theme-${c.boardLayout.theme}`,
      playerMode: t,
      isGM: (T = game.user) == null ? void 0 : T.isGM,
      canEditBoard: De(r),
      isFavorite: L(e),
      canFavorite: N(),
      addCollections: Fe.map((D) => ({
        id: D,
        label: fe(he(D))
      })),
      counts: {
        evidence: c.evidence.length,
        suspects: c.suspects.length,
        locations: c.locations.length,
        timeline: c.timeline.length,
        connections: v.length
      }
    };
  }
  function re(e) {
    return Array.isArray(e) ? e : [];
  }
  function je(e) {
    const t = Q(e.boardLayout), i = [];
    for (const r of e.evidence) i.push(le(r, "evidence", "Evidence", r.title, t, i.length));
    for (const r of e.suspects) i.push(le(r, "suspects", "Suspect", r.name, t, i.length));
    for (const r of e.locations) i.push(le(r, "locations", "Location", r.name, t, i.length));
    for (const r of e.timeline) i.push(le(r, "timeline", "Timeline", r.title, t, i.length));
    return i;
  }
  function le(e, t, i, r, c, f) {
    const u = c.cards[e.id] ?? pe(f);
    return {
      ...e,
      collection: t,
      kind: t === "suspects" ? "suspect" : t === "locations" ? "location" : t === "timeline" ? "timeline" : "evidence",
      kindLabel: i,
      label: r,
      x: Number(u.x) || 0,
      y: Number(u.y) || 0,
      layer: "public",
      style: `left: ${Number(u.x) || 0}px; top: ${Number(u.y) || 0}px;`
    };
  }
  function pe(e) {
    return {
      x: 80 + e % 5 * 300,
      y: 90 + Math.floor(e / 5) * 330
    };
  }
  function Te(e) {
    const t = [];
    for (const i of e.evidence) t.push({ id: i.id, label: `Evidence: ${i.title}` });
    for (const i of e.suspects) t.push({ id: i.id, label: `Suspect: ${i.name}` });
    for (const i of e.locations) t.push({ id: i.id, label: `Location: ${i.name}` });
    for (const i of e.timeline) t.push({ id: i.id, label: `Timeline: ${i.title}` });
    return t;
  }
  function de(e, { resetLayout: t = !1 } = {}) {
    var i;
    (i = l.manager) != null && i.rendered && l.manager.render(!0);
    for (const [r, c] of l.boards.entries())
      t && r.startsWith(`${e}:`) && (c._localLayout = null), r.startsWith(`${e}:`) && c.rendered && c.render(!0);
  }
  function De(e) {
    return !!(typeof e == "string" ? O(e) : e);
  }
  function Ue() {
    return !0;
  }
  function qe(e) {
    for (const [t, i] of l.boards.entries())
      t.startsWith(`${e}:`) && i.close();
  }
  function ke(e) {
    return foundry.utils.deepClone ? foundry.utils.deepClone(e) : JSON.parse(JSON.stringify(e));
  }
  function he(e) {
    return e === "suspects" ? "suspect" : e === "locations" ? "location" : e === "timeline" ? "timeline item" : e === "connections" ? "connection" : "evidence";
  }
  function xe(e, t) {
    return t === "connections" ? e.label || `${e.fromId} -> ${e.toId}` : t === "suspects" || t === "locations" ? e.name : e.title;
  }
  function He(e, t) {
    const i = t.centerX - e.centerX, r = t.centerY - e.centerY;
    if (!i && !r) return { x: Math.round(e.centerX), y: Math.round(e.centerY) };
    const c = i === 0 ? Number.POSITIVE_INFINITY : Math.abs(e.width / 2 / i), f = r === 0 ? Number.POSITIVE_INFINITY : Math.abs(e.height / 2 / r), u = Math.min(c, f);
    return !Number.isFinite(u) || u <= 0 ? { x: Math.round(e.centerX), y: Math.round(e.centerY) } : {
      x: Math.round(e.centerX + i * u),
      y: Math.round(e.centerY + r * u)
    };
  }
  function Ge(e) {
    return Number.isFinite(e == null ? void 0 : e.x) && Number.isFinite(e == null ? void 0 : e.y);
  }
  async function Me(e) {
    const t = globalThis.fromUuid;
    if (!e || typeof t != "function") return null;
    try {
      return await t(e);
    } catch {
      return null;
    }
  }
  async function Ee(e) {
    var i, r;
    const t = await Me(e);
    return t ? t.documentName === "JournalEntryPage" && ((r = t.parent) != null && r.sheet) ? (t.parent.sheet.render(!0, { pageId: t.id }), !0) : t.sheet ? (t.sheet.render(!0), !0) : !1 : ((i = ui.notifications) == null || i.warn(`${S}: The linked journal could not be found.`), !1);
  }
  async function $e(e) {
    var u, v, $, T, D;
    const t = (($ = (v = (u = foundry.applications) == null ? void 0 : u.ux) == null ? void 0 : v.TextEditor) == null ? void 0 : $.implementation) ?? ((T = globalThis.TextEditor) == null ? void 0 : T.implementation) ?? globalThis.TextEditor;
    let i = null;
    try {
      i = t != null && t.getDragEventData ? t.getDragEventData(e) : JSON.parse(((D = e.dataTransfer) == null ? void 0 : D.getData("text/plain")) || "null");
    } catch {
      i = null;
    }
    if (!i || i.type !== "JournalEntry" && i.type !== "JournalEntryPage") return null;
    const r = i.uuid ? await Me(i.uuid) : null;
    if (!r) return null;
    const c = r.documentName === "JournalEntryPage", f = c && r.type === "image" && !!r.src;
    return {
      uuid: i.uuid,
      name: r.name,
      isPage: c,
      isImage: f,
      image: f ? r.src : ""
    };
  }
  function Be(e) {
    var i, r, c, f, u;
    const t = globalThis.Dialog ?? ((c = (r = (i = globalThis.foundry) == null ? void 0 : i.appv1) == null ? void 0 : r.api) == null ? void 0 : c.Dialog);
    return t != null && t.confirm ? t.confirm(e) : Promise.resolve((u = globalThis.confirm) == null ? void 0 : u.call(globalThis, ((f = e.content) == null ? void 0 : f.replace(/<[^>]+>/g, "")) ?? e.title));
  }
})();
