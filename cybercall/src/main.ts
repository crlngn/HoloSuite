import { createCyberCallAppClasses } from "./apps";
import {
  DEFAULT_CALL,
  clampSignal,
  createCallId,
  generateUniqueNumber,
  normalizeCallData,
  normalizeContact,
  normalizeDirectoryEntry,
  phoneDigits
} from "./call-model";
import {
  COMPOSER_TEMPLATE_PATH,
  CONTACTS_TEMPLATE_PATH,
  MODULE_ID,
  RINGTONE_CHOICES,
  SOCKET_NAME,
  TEMPLATE_PATH
} from "./constants";
import { escapeHTML } from "./dom-utils";

let activeCall = null;
let activeComposer = null;
let activeContacts = null;
let activeContactsTab = "personal";
let ringingAudio = null;
let groupContactsCache = null;

function getDefaultComposerData() {
  return normalizeCallData({
    callerName: activeCall?.callData?.callerName ?? DEFAULT_CALL.callerName,
    subtitle: activeCall?.callData?.subtitle ?? DEFAULT_CALL.subtitle,
    image: activeCall?.callData?.image ?? "",
    message: activeCall?.callData?.message ?? DEFAULT_CALL.message,
    signal: activeCall?.callData?.signal ?? game.settings.get(MODULE_ID, "defaultSignal"),
    variant: activeCall?.callData?.variant ?? "standard",
    fullscreen: activeCall?.callData?.fullscreen ?? false,
    ringing: activeCall?.callData?.ringing ?? true
  });
}

function getActorChoices() {
  return (game.actors?.contents ?? [])
    .map((actor) => ({
      id: actor.id,
      name: actor.name,
      img: actor.img ?? ""
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function getPlayerChoices() {
  return (game.users?.contents ?? [])
    .filter((user) => !user.isGM)
    .map((user) => ({
      id: user.id,
      name: user.name,
      active: user.active === true
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function getWorldContactsKey() {
  return String(game.world?.id ?? game.world?.title ?? "default");
}

function getContactsStore() {
  const contacts = game.settings.get(MODULE_ID, "contacts");
  if (Array.isArray(contacts)) return { [getWorldContactsKey()]: contacts };
  if (!contacts || typeof contacts !== "object") return {};
  return contacts;
}

function getContacts() {
  const stored = getContactsStore()[getWorldContactsKey()];
  const personal = Array.isArray(stored)
    ? stored.map(normalizeContact).filter((contact) => contact.name && contact.number)
    : [];

  const managed = getManagedContacts();
  const managedDigits = new Set(managed.map((contact) => phoneDigits(contact.number)));
  const personalOnly = personal.filter((contact) => !managedDigits.has(phoneDigits(contact.number)));

  return [...managed, ...personalOnly].sort((a, b) => a.name.localeCompare(b.name));
}

function getGroupContacts() {
  if (Array.isArray(groupContactsCache)) {
    return groupContactsCache
      .map(normalizeContact)
      .filter((contact) => contact.name && contact.number)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  const contacts = game.settings.get(MODULE_ID, "groupContacts");
  if (!Array.isArray(contacts)) return [];

  return contacts
    .map(normalizeContact)
    .filter((contact) => contact.name && contact.number)
    .sort((a, b) => a.name.localeCompare(b.name));
}

async function saveContacts(contacts) {
  await game.settings.set(MODULE_ID, "contacts", {
    ...getContactsStore(),
    [getWorldContactsKey()]: contacts.map(normalizeContact)
  });
}

async function saveGroupContacts(contacts) {
  groupContactsCache = contacts.map(normalizeContact);
  await game.settings.set(MODULE_ID, "groupContacts", groupContactsCache);
  game.socket.emit(SOCKET_NAME, {
    action: "groupContactsChanged",
    contacts: groupContactsCache
  });
}

function getDirectory() {
  const entries = game.settings.get(MODULE_ID, "directory");
  if (!Array.isArray(entries)) return [];
  return entries.map(normalizeDirectoryEntry);
}

async function saveDirectory(entries) {
  if (!game.user.isGM) return;
  const normalized = entries.map(normalizeDirectoryEntry);
  await game.settings.set(MODULE_ID, "directory", normalized);
  game.socket.emit(SOCKET_NAME, { action: "directoryChanged" });
}

function findDirectoryEntryByActor(actorId) {
  if (!actorId) return null;
  return getDirectory().find((entry) => entry.actorId === actorId) ?? null;
}

function findDirectoryEntryByNumber(number) {
  const digits = phoneDigits(number);
  if (!digits) return null;
  return getDirectory().find((entry) => phoneDigits(entry.number) === digits) ?? null;
}

function getUsedNumberDigits() {
  const used = new Set<string>();
  for (const entry of getDirectory()) used.add(phoneDigits(entry.number));
  for (const contact of getGroupContacts()) used.add(phoneDigits(contact.number));
  used.delete("");
  return used;
}

function resolveActorOwner(actorId) {
  const actor = actorId ? game.actors?.get(actorId) : null;
  if (!actor) return "";
  const owners = (game.users?.contents ?? []).filter(
    (user) => !user.isGM && actor.testUserPermission?.(user, "OWNER")
  );
  const active = owners.find((user) => user.active);
  return (active ?? owners[0])?.id ?? "";
}

// Personal-tab contacts pushed by the GM: directory entries granted to me. Read-only here.
function getManagedContacts() {
  const userId = game.user?.id;
  if (!userId) return [];
  return getDirectory()
    .filter((entry) => entry.grantedUserIds.includes(userId) && entry.name && entry.number)
    .map((entry) => normalizeContact({
      id: entry.id,
      name: entry.name,
      number: entry.number,
      image: entry.image,
      managed: true
    }));
}

async function addContact(name: any, number: any, scope = "personal", image: any = "") {
  const contact = normalizeContact({
    name,
    number,
    image: canEditContactImages() ? image : ""
  });
  if (!contact.name || !contact.number) {
    ui.notifications?.warn?.("Contact name and number are required.");
    return;
  }

  if (scope === "group" && !game.user.isGM) {
    if (!hasActiveGM()) {
      ui.notifications?.warn?.("A GM must be connected to update group contacts.");
      return;
    }

    game.socket.emit(SOCKET_NAME, {
      action: "groupContactAdd",
      contact
    });
    ui.notifications?.info?.("Group contact update sent to the GM.");
    return;
  }

  const contacts = scope === "group" ? getGroupContacts() : getContacts();
  contacts.push(contact);
  if (scope === "group") await saveGroupContacts(contacts);
  else await saveContacts(contacts);
  await refreshContacts();
}

async function removeContact(contactId, scope = "personal") {
  if (scope === "group") {
    if (!game.user.isGM) {
      if (!hasActiveGM()) {
        ui.notifications?.warn?.("A GM must be connected to update group contacts.");
        return;
      }

      game.socket.emit(SOCKET_NAME, {
        action: "groupContactRemove",
        contactId
      });
      ui.notifications?.info?.("Group contact removal sent to the GM.");
      return;
    }

    await saveGroupContacts(getGroupContacts().filter((contact) => contact.id !== contactId));
  } else {
    await saveContacts(getContacts().filter((contact) => contact.id !== contactId));
  }
  await refreshContacts();
}

function hasActiveGM() {
  return game.users?.some((user) => user.isGM && user.active) ?? false;
}

function canUseCyberCall(user = game.user) {
  if (user?.isGM) return true;
  let requiredRole = CONST.USER_ROLES.PLAYER;
  try {
    requiredRole = game.settings.get(MODULE_ID, "minimumRole");
  } catch (error) {
    console.warn(`${MODULE_ID} | Permission setting unavailable, using Player role fallback.`, error);
  }
  return Number(user?.role ?? 0) >= Number(requiredRole);
}

function canEditContactImages(user = game.user) {
  return Boolean(user?.isGM);
}

function getElement(app: any, html: any = null) {
  if (html?.[0]) return html[0];
  if (html instanceof HTMLElement) return html;
  if (app.element?.[0]) return app.element[0];
  return app.element ?? null;
}

function bindCallControls(app: any, html: any = null) {
  const element = getElement(app, html);
  if (!element) return;
  element.classList.toggle("cybercall-fullscreen", app.callData.fullscreen);
  element.classList.toggle("cybercall-ringing", app.callData.ringing && !app.callData.accepted);
  element.classList.toggle("cybercall-connected", app.callData.accepted);

  element.querySelectorAll("[data-cybercall-action]").forEach((button) => {
    button.addEventListener("click", (event) => {
      const action = event.currentTarget.dataset.cybercallAction;
      if (action === "accept") {
        acceptCallForEveryone(app.callData.id);
        return;
      }

      if (action === "broadcast") {
        broadcastCall({
          ...app.callData,
          fullscreen: true,
          ringing: true
        });
        return;
      }

      if (action === "decline" || action === "end") {
        endCallForEveryone(app.callData.id);
      }
    });
  });
}

function getComposerForm(element) {
  return element?.querySelector?.("form[data-cybercall-composer]");
}

function readComposerForm(form) {
  const formData = new FormData(form);
  const actor = game.actors?.get(formData.get("actorId"));
  const image = String(formData.get("image") ?? "").trim() || actor?.img || "";
  const callerName = String(formData.get("callerName") ?? "").trim() || actor?.name || "UNKNOWN CALLER";
  const targetUserIds = formData.getAll("targetUserIds").map((id) => String(id)).filter(Boolean);
  const usersById = new Map<string, any>((game.users?.contents ?? []).map((user) => [user.id, user]));
  const targetUserNames = targetUserIds.map((id) => usersById.get(id)?.name ?? id);

  return normalizeCallData({
    callerName,
    subtitle: String(formData.get("subtitle") ?? "").trim(),
    image,
    message: String(formData.get("message") ?? "").trim(),
    signal: formData.get("signal"),
    variant: String(formData.get("variant") ?? DEFAULT_CALL.variant),
    fullscreen: formData.get("fullscreen") === "on",
    ringing: formData.get("ringing") === "on",
    targetUserIds,
    targetUserNames
  });
}

function updateComposerSignal(form) {
  const signal = form?.elements?.signal;
  const output = form?.querySelector?.("[data-cybercall-signal-output]");
  if (!signal || !output) return;
  output.textContent = `${clampSignal(signal.value)}%`;
}

function bindComposerControls(app: any, html: any = null) {
  const element = getElement(app, html);
  const form = getComposerForm(element);
  if (!element || !form) return;

  updateComposerSignal(form);

  const ringtoneSelect = element.querySelector("[data-cybercall-ringtone]");
  if (ringtoneSelect) {
    ringtoneSelect.addEventListener("change", async (event) => {
      await game.settings.set(MODULE_ID, "ringSound", event.currentTarget.value);
    });
  }

  form.elements.signal?.addEventListener("input", () => updateComposerSignal(form));
  form.elements.actorId?.addEventListener("change", () => {
    const actor = game.actors?.get(form.elements.actorId.value);
    if (!actor) return;
    form.elements.callerName.value = actor.name;
    form.elements.image.value = actor.img ?? "";
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    openCall(readComposerForm(form));
  });

  element.querySelectorAll("[data-cybercall-compose-action]").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const action = event.currentTarget.dataset.cybercallComposeAction;
      const callData = readComposerForm(form);

      if (action === "preview") {
        await openCall(callData);
        return;
      }

      if (action === "broadcast") {
        await broadcastCall(callData);
        return;
      }

      if (action === "close-active") {
        endCallForEveryone(activeCall?.callData?.id);
        return;
      }

      if (action === "add-player-contact") {
        await addPlayerContact({
          actorId: form.elements.actorId?.value ?? "",
          callerName: callData.callerName,
          image: callData.image
        });
        return;
      }

      if (action === "manage-player-contacts") {
        await manageDirectory();
        return;
      }

      if (action === "browse-image") {
        const input = form.elements.image;
        const Picker = (globalThis as any).FilePicker ?? (globalThis as any).foundry?.applications?.apps?.FilePicker;
        if (!input || !Picker) {
          ui.notifications?.warn?.("Foundry FilePicker is unavailable.");
          return;
        }
        const picker = new Picker({
          type: "image",
          current: input.value,
          callback: (path) => {
            input.value = path;
            input.dispatchEvent(new Event("change", { bubbles: true }));
          }
        });
        if (typeof picker.browse === "function") picker.browse();
        else picker.render?.(true);
        return;
      }

      if (action === "reset") {
        form.reset();
        updateComposerSignal(form);
      }
    });
  });
}

function getContactsForm(element) {
  return element?.querySelector?.("form[data-cybercall-contacts-form]");
}

function bindContactsControls(app: any, html: any = null) {
  const element = getElement(app, html);
  const form = getContactsForm(element);
  if (!element || !form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const scope = String(formData.get("scope") ?? activeContactsTab);
    await addContact(formData.get("name"), formData.get("number"), scope, formData.get("image"));
    form.reset();
    form.elements.scope.value = scope;
    form.elements.name?.focus();
  });

  element.querySelectorAll("[data-cybercall-contact-tab]").forEach((button) => {
    button.addEventListener("click", (event) => {
      activeContactsTab = event.currentTarget.dataset.cybercallContactTab;
      element.querySelectorAll("[data-cybercall-contact-tab]").forEach((tabButton) => {
        tabButton.classList.toggle("active", tabButton.dataset.cybercallContactTab === activeContactsTab);
      });
      element.querySelectorAll("[data-cybercall-contact-panel]").forEach((panel) => {
        panel.hidden = panel.dataset.cybercallContactPanel !== activeContactsTab;
      });
      if (form.elements.scope) form.elements.scope.value = activeContactsTab;
    });
  });

  const ringtoneSelect = element.querySelector("[data-cybercall-ringtone]");
  if (ringtoneSelect) {
    ringtoneSelect.addEventListener("change", async (event) => {
      await game.settings.set(MODULE_ID, "ringSound", event.currentTarget.value);
    });
  }

  element.querySelectorAll("[data-cybercall-contact-action]").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const action = event.currentTarget.dataset.cybercallContactAction;
      const contactId = event.currentTarget.dataset.contactId;
      const scope = event.currentTarget.dataset.contactScope ?? "personal";
      const contactList = scope === "group" ? getGroupContacts() : getContacts();
      const contact = contactList.find((entry) => entry.id === contactId);

      if (action === "remove") {
        if (scope === "managed") await removeManagedContact(contactId);
        else await removeContact(contactId, scope);
        return;
      }

      if (action === "call" && contact) {
        const call = await requestCallToGM(contact);
        if (call && activeContacts === app) await app.close();
      }
    });
  });
}

const { CyberCallApplication, CyberCallComposer, CyberCallContacts } = createCyberCallAppClasses({
  moduleId: MODULE_ID,
  templatePath: TEMPLATE_PATH,
  composerTemplatePath: COMPOSER_TEMPLATE_PATH,
  contactsTemplatePath: CONTACTS_TEMPLATE_PATH,
  escapeHTML,
  getDefaultComposerData,
  getActorChoices,
  getPlayerChoices,
  getContacts,
  getGroupContacts,
  getRingtoneChoices,
  getSoundPath,
  getActiveContactsTab: () => activeContactsTab,
  canEditContactImages,
  bindCallControls,
  bindComposerControls,
  bindContactsControls,
  stopRinging,
  clearActiveCall: (app) => {
    if (activeCall === app) activeCall = null;
  },
  clearActiveComposer: (app) => {
    if (activeComposer === app) activeComposer = null;
  },
  clearActiveContacts: (app) => {
    if (activeContacts === app) activeContacts = null;
  }
});

async function openCall(callData: any = {}) {
  if (!canUseCyberCall()) {
    ui.notifications?.warn?.("You do not have permission to open CyberCall transmissions.");
    return null;
  }

  if (activeContacts) await activeContacts.close();
  await closeCall();
  activeCall = new CyberCallApplication(callData);
  await activeCall.render(true);
  applyFullscreenPosition(activeCall);
  playRinging(activeCall.callData);
  return activeCall;
}

async function closeCall() {
  if (!activeCall) return;
  const call = activeCall;
  activeCall = null;
  await call.close();
}

function isActiveCallId(callId) {
  return Boolean(activeCall?.callData?.id) && activeCall.callData.id === callId;
}

async function refreshActiveCall() {
  if (!activeCall) return;
  await activeCall.render(true);
  applyFullscreenPosition(activeCall);
}

async function acceptCall(callId) {
  if (!isActiveCallId(callId)) return;
  activeCall.callData.accepted = true;
  activeCall.callData.ringing = false;
  stopRinging();
  await refreshActiveCall();
}

function acceptCallForEveryone(callId) {
  if (!callId) return;
  game.socket.emit(SOCKET_NAME, {
    action: "acceptCall",
    callId
  });
  acceptCall(callId);
}

async function endCall(callId) {
  if (callId && activeCall?.callData?.id && activeCall.callData.id !== callId) return;
  await closeCall();
}

function endCallForEveryone(callId) {
  game.socket.emit(SOCKET_NAME, {
    action: "endCall",
    callId
  });
  endCall(callId);
}

function resolveCallOwnerUserId(contact) {
  const entry = findDirectoryEntryByNumber(contact.number);
  if (!entry) return "";
  // Re-resolve from the live actor when possible so ownership changes are respected.
  if (entry.actorId) {
    const liveOwner = resolveActorOwner(entry.actorId);
    if (liveOwner) return liveOwner;
  }
  return entry.ownerUserId;
}

async function placePrivateCall(contact, owner) {
  const callId = createCallId();
  const callerName = String(game.user?.character?.name ?? game.user?.name ?? "Unknown Caller").trim();
  const callerImage = String(game.user?.character?.img ?? game.user?.avatar ?? "").trim();
  const baseCall = {
    id: callId,
    signal: game.settings.get(MODULE_ID, "defaultSignal"),
    variant: "standard",
    fullscreen: false,
    accepted: false,
    allowBroadcast: false,
    callerUserId: game.user.id,
    contactNumber: contact.number
  };

  const outgoingCall = normalizeCallData({
    ...baseCall,
    callerName: contact.name,
    subtitle: `Comms ${contact.number}`,
    image: contact.image,
    message: `Connecting to ${contact.name}...`,
    canAccept: false,
    canDecline: false,
    outgoing: true,
    ringing: true
  });

  const incomingCall = normalizeCallData({
    ...baseCall,
    callerName,
    subtitle: "Incoming call",
    image: callerImage,
    message: `${callerName} is calling.`,
    canAccept: true,
    canDecline: true,
    ringing: true
  });

  game.socket.emit(SOCKET_NAME, {
    action: "incomingCall",
    targetUserId: owner.id,
    callerName,
    contactName: contact.name,
    callData: incomingCall
  });

  return openCall(outgoingCall);
}

async function requestCallToGM(contact) {
  // If the dialed number belongs to another user's character, connect the two of them directly.
  const ownerUserId = resolveCallOwnerUserId(contact);
  const owner = ownerUserId ? game.users?.get(ownerUserId) : null;
  if (owner && owner.id !== game.user.id) {
    return placePrivateCall(contact, owner);
  }

  if (game.user.isGM) {
    return openCall({
      callerName: contact.name,
      subtitle: `Comms ${contact.number}`,
      image: contact.image,
      message: `Opening channel ${contact.number}...`,
      signal: game.settings.get(MODULE_ID, "defaultSignal"),
      variant: "standard",
      ringing: false
    });
  }

  if (!hasActiveGM()) {
    ui.notifications?.warn?.("No GM is connected to receive the CyberCall.");
    return null;
  }

  const callId = createCallId();
  const callerImage = String(game.user?.avatar ?? game.user?.character?.img ?? "").trim();
  const baseCall = {
    id: callId,
    signal: game.settings.get(MODULE_ID, "defaultSignal"),
    variant: "standard",
    fullscreen: false,
    accepted: false,
    allowBroadcast: false,
    callerUserId: game.user.id,
    contactNumber: contact.number
  };
  const callerCall = normalizeCallData({
    ...baseCall,
    callerName: contact.name,
    subtitle: `Comms ${contact.number}`,
    image: contact.image,
    message: `Awaiting connection to ${contact.name} on ${contact.number}...`,
    canAccept: false,
    canDecline: false,
    outgoing: true,
    ringing: true
  });
  const gmCall = normalizeCallData({
    ...baseCall,
    callerName: game.user.name,
    subtitle: `Call request from ${game.user.name}`,
    image: callerImage,
    message: `${game.user.name} is calling ${contact.name} on ${contact.number}.`,
    canAccept: true,
    ringing: true
  });

  game.socket.emit(SOCKET_NAME, {
    action: "playerCallRequest",
    callData: gmCall
  });

  return openCall(callerCall);
}

async function openComposer() {
  if (!game.user.isGM) {
    ui.notifications?.warn?.("Only the GM can open the CyberCall composer.");
    return null;
  }

  if (activeComposer) {
    activeComposer.bringToFront?.();
    return activeComposer;
  }

  activeComposer = new CyberCallComposer();
  await activeComposer.render(true);
  return activeComposer;
}

async function openContacts() {
  if (!canUseCyberCall()) {
    ui.notifications?.warn?.("You do not have permission to use CyberCall contacts.");
    return null;
  }

  if (activeCall) {
    activeCall.bringToFront?.();
    return activeCall;
  }

  if (activeContacts) {
    activeContacts.bringToFront?.();
    return activeContacts;
  }

  activeContacts = new CyberCallContacts();
  await activeContacts.render(true);
  return activeContacts;
}

async function refreshContacts() {
  if (!activeContacts) return;
  await activeContacts.render(true);
}

async function broadcastCall(callData: any = {}) {
  if (!game.user.isGM) {
    ui.notifications?.warn?.("Only the GM can broadcast CyberCalls to all players.");
    return null;
  }

  const call = normalizeCallData({
    ...callData,
    fullscreen: callData.fullscreen ?? true,
    ringing: true
  });

  game.socket.emit(SOCKET_NAME, {
    action: "openCall",
    callData: call,
    targetUserIds: call.targetUserIds
  });

  return openCall({ ...call, outgoing: true });
}

async function addPlayerContact(source: any = {}) {
  if (!game.user.isGM) {
    ui.notifications?.warn?.("Only the GM can add contacts to player phones.");
    return;
  }

  const actor = source.actorId ? game.actors?.get(source.actorId) : null;
  const actorId = actor?.id ?? "";
  const name = String(source.callerName ?? "").trim() || actor?.name || "";
  const image = String(source.image ?? "").trim() || actor?.img || "";
  if (!name) {
    ui.notifications?.warn?.("Enter a caller name or choose an actor before adding a contact.");
    return;
  }

  const existing = actorId ? findDirectoryEntryByActor(actorId) : null;
  const ownerUserId = actorId ? resolveActorOwner(actorId) : "";
  const ownerName = ownerUserId ? (game.users?.get(ownerUserId)?.name ?? "") : "";
  const suggestedNumber = existing?.number || generateUniqueNumber(getUsedNumberDigits());
  const players = (game.users?.contents ?? []).filter((user) => !user.isGM);
  const grantedSet = new Set(existing?.grantedUserIds ?? []);

  const result = await promptRecipients({ name, image, number: suggestedNumber, players, grantedSet, ownerName });
  if (!result) return;

  const finalNumber = String(result.number ?? "").trim() || suggestedNumber;
  const finalDigits = phoneDigits(finalNumber);
  const collision = getDirectory().find(
    (entry) => phoneDigits(entry.number) === finalDigits && entry.id !== existing?.id
  );
  if (collision) {
    ui.notifications?.warn?.(`Number ${finalNumber} is already assigned to ${collision.name || "another contact"}.`);
    return;
  }

  const directory = getDirectory();
  const entry = existing ? directory.find((item) => item.id === existing.id) : null;
  if (entry) {
    Object.assign(entry, { number: finalNumber, name, image, actorId, ownerUserId, grantedUserIds: result.recipients });
  } else {
    directory.push(normalizeDirectoryEntry({ number: finalNumber, name, image, actorId, ownerUserId, grantedUserIds: result.recipients }));
  }

  await saveDirectory(directory);
  await refreshContacts();
  ui.notifications?.info?.(`Added ${name} (${finalNumber}) to ${result.recipients.length} player contact list(s).`);
}

function promptRecipients({ name, image, number, players, grantedSet, ownerName }: any) {
  const routeLine = ownerName
    ? `Calls to this number reach <strong>${escapeHTML(ownerName)}</strong>.`
    : "No player owns this actor &mdash; calls to this number route to the GM.";
  const rows = players.length
    ? players.map((user) =>
        `<label class="cybercall-recipient"><input type="checkbox" name="recipient" value="${escapeHTML(user.id)}" ${grantedSet.has(user.id) ? "checked" : ""}><span>${escapeHTML(user.name)}</span></label>`
      ).join("")
    : `<p class="cybercall-recipient-empty">No players exist in this world yet.</p>`;
  const content = `
    <div class="cybercall-add-contact">
      <div class="cybercall-add-contact-head">
        ${image ? `<img src="${escapeHTML(image)}" alt="">` : ""}
        <strong>${escapeHTML(name)}</strong>
      </div>
      <label class="cybercall-add-contact-number">
        <span>Phone number</span>
        <span class="cybercall-add-contact-number-row">
          <input type="text" name="number" value="${escapeHTML(number)}" autocomplete="off">
          <button type="button" data-cybercall-regen title="Generate a new unused number"><i class="fa-solid fa-rotate"></i></button>
        </span>
      </label>
      <p class="cybercall-add-contact-route">${routeLine}</p>
      <fieldset class="cybercall-recipients">
        <legend>Players with access to this contact</legend>
        ${rows}
      </fieldset>
    </div>
  `;

  const bindRegen = (root: any) => {
    const button = root?.querySelector?.("[data-cybercall-regen]");
    const input = root?.querySelector?.("input[name='number']");
    button?.addEventListener("click", () => {
      if (input) input.value = generateUniqueNumber(getUsedNumberDigits());
    });
  };
  const readForm = (form: any) => ({
    number: form?.elements?.number?.value ?? "",
    recipients: Array.from(form?.querySelectorAll("input[name='recipient']:checked") ?? []).map((el: any) => el.value)
  });

  const DialogV2 = (globalThis as any).foundry?.applications?.api?.DialogV2;
  if (DialogV2?.wait) {
    return DialogV2.wait({
      window: { title: `Add ${name} to player contacts`, icon: "fa-solid fa-address-book" },
      classes: ["cybercall-add-contact-dialog"],
      content,
      rejectClose: false,
      render: (_event: any, dialog: any) => bindRegen(dialog?.element ?? dialog),
      buttons: [
        { action: "save", label: "Save", icon: "fa-solid fa-floppy-disk", default: true, callback: (_event: any, button: any) => readForm(button.form) },
        { action: "cancel", label: "Cancel", icon: "fa-solid fa-xmark" }
      ]
    }).then((value: any) => (value && value !== "cancel") ? value : null);
  }

  const DialogV1 = (globalThis as any).Dialog;
  if (!DialogV1) return Promise.resolve(null);
  return new Promise((resolve) => {
    let resolved = false;
    const finish = (value: any) => { if (!resolved) { resolved = true; resolve(value); } };
    new DialogV1({
      title: `Add ${name} to player contacts`,
      content: `<form class="cybercall-add-contact-dialog">${content}</form>`,
      buttons: {
        save: { label: "Save", callback: (html: any) => { const form = html[0]?.querySelector("form"); finish(form ? readForm(form) : null); } },
        cancel: { label: "Cancel", callback: () => finish(null) }
      },
      default: "save",
      render: (html: any) => bindRegen(html[0]),
      close: () => finish(null)
    }).render(true);
  });
}

async function removeManagedContact(entryId) {
  if (!entryId) return;

  if (game.user.isGM) {
    const directory = getDirectory();
    const entry = directory.find((item) => item.id === entryId);
    if (!entry) return;
    entry.grantedUserIds = entry.grantedUserIds.filter((id) => id !== game.user.id);
    await saveDirectory(directory);
    await refreshContacts();
    return;
  }

  if (!hasActiveGM()) {
    ui.notifications?.warn?.("A GM must be connected to remove this contact.");
    return;
  }

  game.socket.emit(SOCKET_NAME, {
    action: "managedContactRemove",
    entryId,
    userId: game.user.id
  });
  ui.notifications?.info?.("Contact removal sent to the GM.");
}

async function editDirectoryEntry(entryId) {
  if (!game.user.isGM) return;
  const entry = getDirectory().find((item) => item.id === entryId);
  if (!entry) return;

  const ownerName = entry.ownerUserId ? (game.users?.get(entry.ownerUserId)?.name ?? "") : "";
  const players = (game.users?.contents ?? []).filter((user) => !user.isGM);
  const result = await promptRecipients({
    name: entry.name,
    image: entry.image,
    number: entry.number,
    players,
    grantedSet: new Set(entry.grantedUserIds),
    ownerName
  });
  if (!result) return;

  const finalNumber = String(result.number ?? "").trim() || entry.number;
  const finalDigits = phoneDigits(finalNumber);
  const collision = getDirectory().find(
    (item) => phoneDigits(item.number) === finalDigits && item.id !== entry.id
  );
  if (collision) {
    ui.notifications?.warn?.(`Number ${finalNumber} is already assigned to ${collision.name || "another contact"}.`);
    return;
  }

  const directory = getDirectory();
  const target = directory.find((item) => item.id === entryId);
  if (!target) return;
  target.number = finalNumber;
  target.grantedUserIds = result.recipients;
  await saveDirectory(directory);
  await refreshContacts();
}

async function deleteDirectoryEntry(entryId) {
  if (!game.user.isGM) return;
  const entry = getDirectory().find((item) => item.id === entryId);
  if (!entry) return;

  const DialogV2 = (globalThis as any).foundry?.applications?.api?.DialogV2;
  const confirmContent = `<p>Remove <strong>${escapeHTML(entry.name)}</strong> (${escapeHTML(entry.number)}) from all player phones?</p>`;
  const confirmed = DialogV2?.confirm
    ? await DialogV2.confirm({ window: { title: "Delete Player Contact" }, content: confirmContent, rejectClose: false })
    : (globalThis as any).confirm?.(`Remove ${entry.name} (${entry.number}) from all player phones?`);
  if (!confirmed) return;

  await saveDirectory(getDirectory().filter((item) => item.id !== entryId));
  await refreshContacts();
}

function buildManageDirectoryContent() {
  const directory = getDirectory();
  if (!directory.length) {
    return `<p class="cybercall-manage-empty">No contacts have been assigned to players yet. Use &ldquo;Add to Player Contacts&rdquo; on the composer.</p>`;
  }
  const rows = directory.map((entry) => {
    const owner = entry.ownerUserId ? (game.users?.get(entry.ownerUserId)?.name ?? "Unknown") : "GM (NPC)";
    const grantees = entry.grantedUserIds.map((id) => game.users?.get(id)?.name).filter(Boolean);
    const heldBy = grantees.length ? grantees.join(", ") : "no one";
    return `
      <li class="cybercall-manage-row" data-entry-id="${escapeHTML(entry.id)}">
        <div class="cybercall-manage-info">
          <strong>${escapeHTML(entry.name)}</strong>
          <span class="cybercall-manage-meta">${escapeHTML(entry.number)} &middot; reaches ${escapeHTML(owner)}</span>
          <span class="cybercall-manage-held">Held by: ${escapeHTML(heldBy)}</span>
        </div>
        <div class="cybercall-manage-actions">
          <button type="button" data-dir-action="edit" title="Edit number and access"><i class="fa-solid fa-pen"></i></button>
          <button type="button" data-dir-action="delete" title="Delete for all players"><i class="fa-solid fa-trash"></i></button>
        </div>
      </li>
    `;
  }).join("");
  return `<ul class="cybercall-manage-list">${rows}</ul>`;
}

async function manageDirectory() {
  if (!game.user.isGM) {
    ui.notifications?.warn?.("Only the GM can manage player contacts.");
    return;
  }
  const DialogV2 = (globalThis as any).foundry?.applications?.api?.DialogV2;
  if (!DialogV2?.wait) {
    ui.notifications?.warn?.("Directory management requires DialogV2 (Foundry v12+).");
    return;
  }

  const bindRows = (dialog: any) => {
    const root = dialog?.element ?? dialog;
    root?.querySelectorAll?.("[data-dir-action]").forEach((button: any) => {
      button.addEventListener("click", async () => {
        const entryId = button.closest("[data-entry-id]")?.dataset.entryId;
        const action = button.dataset.dirAction;
        await dialog.close();
        if (action === "edit") await editDirectoryEntry(entryId);
        else if (action === "delete") await deleteDirectoryEntry(entryId);
        manageDirectory();
      });
    });
  };

  await DialogV2.wait({
    window: { title: "Manage Player Contacts", icon: "fa-solid fa-address-book" },
    classes: ["cybercall-manage-dialog"],
    content: buildManageDirectoryContent(),
    rejectClose: false,
    render: (_event: any, dialog: any) => bindRows(dialog),
    buttons: [{ action: "close", label: "Close", icon: "fa-solid fa-xmark", default: true }]
  });
}

async function handleSocketMessage(message) {
  if (!message) return;
  if (Array.isArray(message.targetUserIds) && message.targetUserIds.length && !message.targetUserIds.includes(game.user?.id)) {
    return;
  }
  if (Array.isArray(message.callData?.targetUserIds) && message.callData.targetUserIds.length && !message.callData.targetUserIds.includes(game.user?.id)) {
    return;
  }

  if (message.action === "openCall") {
    if (!canUseCyberCall()) return;
    openCall(message.callData);
    return;
  }

  if (message.action === "playerCallRequest") {
    if (!game.user.isGM) return;
    openCall(message.callData);
    return;
  }

  if (message.action === "incomingCall") {
    if (!canUseCyberCall()) return;
    const base = message.callData ?? {};
    if (message.targetUserId && message.targetUserId === game.user.id) {
      openCall(base);
      return;
    }
    // GMs receive a non-interactive monitor copy for oversight.
    if (game.user.isGM) {
      openCall(normalizeCallData({
        ...base,
        subtitle: `Monitoring · ${message.callerName ?? base.callerName ?? "Caller"} → ${message.contactName ?? "contact"}`,
        message: `${message.callerName ?? base.callerName ?? "A caller"} is calling ${message.contactName ?? "a contact"}.`,
        canAccept: false,
        canDecline: true,
        ringing: false
      }));
    }
    return;
  }

  if (message.action === "managedContactRemove") {
    if (!game.user.isGM) return;
    const directory = getDirectory();
    const entry = directory.find((item) => item.id === message.entryId);
    if (!entry) return;
    entry.grantedUserIds = entry.grantedUserIds.filter((id) => id !== message.userId);
    await saveDirectory(directory);
    await refreshContacts();
    return;
  }

  if (message.action === "directoryChanged") {
    await refreshContacts();
    return;
  }

  if (message.action === "acceptCall") {
    acceptCall(message.callId);
    return;
  }

  if (message.action === "endCall") {
    endCall(message.callId);
    return;
  }

  if (message.action === "groupContactAdd") {
    if (!game.user.isGM) return;
    const contact = normalizeContact({
      ...message.contact,
      image: ""
    });
    if (!contact.name || !contact.number) return;
    const contacts = getGroupContacts();
    contacts.push(contact);
    await saveGroupContacts(contacts);
    await refreshContacts();
    return;
  }

  if (message.action === "groupContactRemove") {
    if (!game.user.isGM) return;
    await saveGroupContacts(getGroupContacts().filter((contact) => contact.id !== message.contactId));
    await refreshContacts();
    return;
  }

  if (message.action === "groupContactsChanged") {
    groupContactsCache = Array.isArray(message.contacts) ? message.contacts.map(normalizeContact) : null;
    await refreshContacts();
  }
}

function applyFullscreenPosition(app: any) {
  if (!app?.callData?.fullscreen) return;
  app.setPosition?.({
    left: 0,
    top: 0,
    width: window.innerWidth,
    height: window.innerHeight
  });
}

function getSoundPath() {
  return String(game.settings.get(MODULE_ID, "ringSound") ?? "").trim();
}

function getRingtoneChoices() {
  const current = getSoundPath();
  return Object.entries(RINGTONE_CHOICES).map(([value, label]) => ({
    value,
    label,
    selected: value === current
  }));
}

function stopRinging() {
  if (!ringingAudio) return;
  const handle = ringingAudio;
  ringingAudio = null;
  if (typeof handle.stop === "function") {
    handle.stop();
  } else {
    handle.pause();
    handle.currentTime = 0;
  }
}

function playRinging(callData) {
  stopRinging();
  if (!callData.ringing) return;

  const soundPath = getSoundPath();
  if (!soundPath) return;

  const interfaceVolume = Number(game.settings.get("core", "globalInterfaceVolume") ?? 0.5);
  const volume = 0.65 * interfaceVolume;
  const AudioHelperClass = foundry?.audio?.AudioHelper ?? (globalThis as any).AudioHelper;
  if (AudioHelperClass?.play) {
    AudioHelperClass.play({ src: soundPath, volume, autoplay: true, loop: true }, false)
      .then((handle) => { ringingAudio = handle; })
      .catch((error) => {
        console.warn(`${MODULE_ID} | Unable to play ringing sound.`, error);
      });
  } else {
    ringingAudio = new Audio(soundPath);
    ringingAudio.loop = true;
    ringingAudio.volume = volume;
    ringingAudio.play().catch((error) => {
      console.warn(`${MODULE_ID} | Unable to play ringing sound.`, error);
    });
  }
}

function registerApi() {
  const module = game.modules.get(MODULE_ID);
  if (!module) return;

  module.api = {
    openCall,
    closeCall,
    broadcastCall,
    openComposer,
    openContacts,
    get activeCall() {
      return activeCall;
    },
    get activeComposer() {
      return activeComposer;
    },
    get activeContacts() {
      return activeContacts;
    }
  };
}

function registerWithHoloSuite() {
  const holosuite = game.modules.get("holosuite-core");
  const api = holosuite?.active ? holosuite.api : null;
  if (!api?.registerApp) return false;

  api.registerApp({
    id: MODULE_ID,
    title: "CyberCall",
    icon: "fa-solid fa-satellite-dish",
    premium: false,
    description: "Compose calls, contacts, and holographic broadcasts.",
    open: () => game.user?.isGM ? openComposer() : openContacts()
  });
  return true;
}

function registerSettings() {
  const roles = CONST.USER_ROLES;
  const roleChoices = {};
  for (const [key, label] of [
    ["NONE", "None"],
    ["LIMITED", "Limited"],
    ["OBSERVER", "Observer"],
    ["PLAYER", "Player"],
    ["TRUSTED", "Trusted Player"],
    ["ASSISTANT", "Assistant GM"]
  ]) {
    if (Number.isFinite(Number(roles[key]))) roleChoices[roles[key]] = label;
  }

  game.settings.register(MODULE_ID, "defaultSignal", {
    name: "Default Signal Strength",
    hint: "Signal percentage used when a call does not provide one.",
    scope: "client",
    config: true,
    type: Number,
    default: DEFAULT_CALL.signal,
    range: {
      min: 0,
      max: 100,
      step: 1
    }
  });

  game.settings.register(MODULE_ID, "ringSound", {
    name: "Incoming Call Ringtone",
    hint: "Ringtone played locally while a CyberCall is ringing. This is a client setting, so each user can choose their own ringtone.",
    scope: "client",
    config: false,
    type: String,
    default: "",
    choices: RINGTONE_CHOICES
  });

  game.settings.register(MODULE_ID, "minimumRole", {
    name: "Minimum Player Role",
    hint: "Minimum role allowed to open CyberCall overlays and receive GM broadcasts.",
    scope: "world",
    config: true,
    type: Number,
    default: roles.PLAYER,
    choices: roleChoices
  });

  game.settings.register(MODULE_ID, "contacts", {
    name: "CyberCall Contacts",
    hint: "Player contact directory stored locally for this client and isolated per world.",
    scope: "client",
    config: false,
    type: Object,
    default: {}
  });

  game.settings.register(MODULE_ID, "groupContacts", {
    name: "CyberCall Group Contacts",
    hint: "Shared group contact directory for all players in this world.",
    scope: "world",
    config: false,
    type: Object,
    default: []
  });

  game.settings.register(MODULE_ID, "directory", {
    name: "CyberCall Phone Directory",
    hint: "GM-managed registry of assigned numbers, the actors behind them, and which players hold each contact.",
    scope: "world",
    config: false,
    type: Array,
    default: []
  });
}

async function migrateLegacyContactsSetting() {
  const contacts = game.settings.get(MODULE_ID, "contacts");
  if (!Array.isArray(contacts)) return;
  await game.settings.set(MODULE_ID, "contacts", {
    [getWorldContactsKey()]: contacts.map(normalizeContact)
  });
}

function addSceneControl(controls) {
  if (!canUseCyberCall()) return;

  const openDemoCall = () => game.user.isGM ? openComposer() : openContacts();

  const tool = {
    name: "cybercall",
    title: game.user.isGM ? "Compose CyberCall" : "CyberCall Contacts",
    icon: "fas fa-satellite-dish",
    button: true,
    visible: true,
    onClick: openDemoCall,
    onChange: openDemoCall
  };

  if (!Array.isArray(controls)) {
    const tokenControls = controls.tokens ?? controls.token;
    if (!tokenControls?.tools) return;
    const order = Object.keys(tokenControls.tools).length;
    tokenControls.tools.cybercall = { ...tool, order };
    return;
  }

  const tokenControls = controls.find((control) => control.name === "token");
  if (!tokenControls?.tools) return;
  tokenControls.tools.push(tool);
}

Hooks.once("init", () => {
  registerSettings();
  registerApi();
});

// HoloSuite Core is the suite launcher; keep this module out of the scene-control toolbar.

Hooks.once("ready", async () => {
  await migrateLegacyContactsSetting();
  registerApi();
  registerWithHoloSuite();
  game.socket.on(SOCKET_NAME, handleSocketMessage);
  console.log(`${MODULE_ID} | Ready. Use game.modules.get("${MODULE_ID}").api.openCall({...})`);
});
