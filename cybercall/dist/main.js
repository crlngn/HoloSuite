var He = Object.defineProperty;
var We = (e, t, n) => t in e ? He(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var j = (e, t, n) => We(e, typeof t != "symbol" ? t + "" : t, n);
function Ye(e, t) {
  return e.image ? `<img src="${t(e.image)}" alt="${t(e.callerName)}">` : `<div class="cybercall-initials" aria-hidden="true">${t(e.initials)}</div>`;
}
function we(e, t) {
  const n = `--cybercall-signal: ${e.signal}%;`, a = e.fullscreen ? "cybercall-broadcast" : "", i = e.ringing ? "cybercall-ringing-panel" : "", r = e.accepted ? "cybercall-connected-panel" : "", c = e.showBroadcast ? '<button type="button" data-cybercall-action="broadcast">Broadcast</button>' : "", l = e.accepted ? "" : `
      <header class="cybercall-header">
        <div>
          <div class="cybercall-kicker">${t(e.kicker)}</div>
          <h2>${t(e.callerName)}</h2>
          <p>${t(e.subtitle)}</p>
        </div>
        <div class="cybercall-signal">
          <span>${e.signal}%</span>
          <div class="cybercall-signal-bar" aria-hidden="true"><i></i></div>
        </div>
      </header>
    `, o = e.accepted ? "" : `<blockquote>${t(e.message)}</blockquote>`, u = e.accepted || e.outgoing ? '<button type="button" data-cybercall-action="end">End Call</button>' : `
        ${e.canAccept ? '<button type="button" data-cybercall-action="accept">Accept</button>' : ""}
        <button type="button" data-cybercall-action="decline">Decline</button>
        ${c}
      `;
  return `
    <div class="cybercall-panel cybercall-${e.variant} ${a} ${i} ${r}" style="${n}">
      <div class="cybercall-static" aria-hidden="true"></div>
      <div class="cybercall-reticle" aria-hidden="true"></div>
      ${l}
      <main class="cybercall-body">
        <div class="cybercall-portrait">${Ye(e, t)}</div>
        ${o}
      </main>
      <footer class="cybercall-actions">
        ${u}
      </footer>
    </div>
  `;
}
function ve(e, t) {
  const n = e.call;
  return `
    <form class="cybercall-composer" data-cybercall-composer>
      <label>Actor Portrait
        <select name="actorId">
          <option value="">Manual / no actor</option>
          ${e.actors.map((i) => `<option value="${t(i.id)}">${t(i.name)}</option>`).join("")}
        </select>
      </label>
      <label>Caller Name <input type="text" name="callerName" value="${t(n.callerName)}"></label>
      <label>Subtitle / Faction <input type="text" name="subtitle" value="${t(n.subtitle)}"></label>
      <label>Portrait Image Path <span class="cybercall-composer-path-row"><input type="text" name="image" value="${t(n.image)}"><button type="button" data-cybercall-compose-action="browse-image">Browse</button></span></label>
      <label>Message <textarea name="message" rows="5">${t(n.message)}</textarea></label>
      <label>Signal <input type="range" name="signal" min="0" max="100" value="${n.signal}"></label>
      <label>Variant
        <select name="variant">
          <option value="standard" ${n.variant === "standard" ? "selected" : ""}>Standard Blue</option>
          <option value="emergency" ${n.variant === "emergency" ? "selected" : ""}>Emergency Red</option>
          <option value="corrupted" ${n.variant === "corrupted" ? "selected" : ""}>Corrupted Green</option>
        </select>
      </label>
      <label><input type="checkbox" name="fullscreen" ${n.fullscreen ? "checked" : ""}> Fullscreen Broadcast</label>
      <label><input type="checkbox" name="ringing" ${n.ringing ? "checked" : ""}> Ringing Animation / Sound</label>
      <div class="cybercall-composer-ringtone">
        <label class="cybercall-ringtone-select">
          <span>Ringtone</span>
          <select data-cybercall-ringtone>
            ${(e.ringtoneChoices ?? []).map(
    (i) => `<option value="${t(i.value)}" ${i.selected ? "selected" : ""}>${t(i.label)}</option>`
  ).join("")}
          </select>
        </label>
      </div>
      <div class="cybercall-composer-actions">
        <button type="button" data-cybercall-compose-action="preview">Preview Locally</button>
        <button type="button" data-cybercall-compose-action="broadcast">Broadcast to Players</button>
        <button type="button" data-cybercall-compose-action="add-player-contact">Add to Player Contacts</button>
        <button type="button" data-cybercall-compose-action="manage-player-contacts">Manage Player Contacts</button>
        <button type="button" data-cybercall-compose-action="close-active">Close Active Call</button>
      </div>
    </form>
  `;
}
function Ae(e, t) {
  const n = (c, l) => c.length ? c.map((o) => `
        <li${o.managed ? ' class="cybercall-contact-managed-row"' : ""}>
          <div class="cybercall-contact-avatar">
            ${o.image ? `<img src="${t(o.image)}" alt="">` : `<span>${t(o.initials)}</span>`}
          </div>
          <div class="cybercall-contact-id">
            <strong>${t(o.name)}${o.managed ? ' <span class="cybercall-contact-managed-tag" title="Added by the GM">&#9733;</span>' : ""}</strong>
            <span>${t(o.number)}</span>
          </div>
          <div class="cybercall-contact-actions">
            <button type="button" data-cybercall-contact-action="call" data-contact-scope="${l}" data-contact-id="${t(o.id)}">Call</button>
            <button type="button" data-cybercall-contact-action="remove" data-contact-scope="${o.managed ? "managed" : l}" data-contact-id="${t(o.id)}">Remove</button>
          </div>
        </li>
      `).join("") : '<li class="cybercall-contacts-empty">No contacts stored.</li>', a = e.activeTab !== "group", i = e.activeTab === "group", r = e.canEditContactImages ? '<label>Picture <input type="text" name="image" placeholder="icons/..."></label>' : "";
  return `
    <section class="cybercall-contacts">
      <header class="cybercall-contacts-header">
        <div>
          <div class="cybercall-contacts-kicker">Personal Comms Directory</div>
          <h2>CyberCall Contacts</h2>
        </div>
      </header>
      <nav class="cybercall-contact-tabs">
        <button type="button" class="${a ? "active" : ""}" data-cybercall-contact-tab="personal">Personal</button>
        <button type="button" class="${i ? "active" : ""}" data-cybercall-contact-tab="group">Group</button>
      </nav>
      <section data-cybercall-contact-panel="personal" ${a ? "" : "hidden"}>
        <ul class="cybercall-contacts-list">${n(e.contacts, "personal")}</ul>
      </section>
      <section data-cybercall-contact-panel="group" ${i ? "" : "hidden"}>
        <ul class="cybercall-contacts-list">${n(e.groupContacts, "group")}</ul>
      </section>
      <form class="cybercall-contacts-form" data-cybercall-contacts-form>
        <input type="hidden" name="scope" value="${t(e.activeTab)}">
        <label>Name <input type="text" name="name" required></label>
        <label>Number <input type="text" name="number" required></label>
        ${r}
        <button type="submit">Add Contact</button>
      </form>
      <footer class="cybercall-contacts-footer">
        <label class="cybercall-ringtone-select">
          <span>Ringtone</span>
          <select data-cybercall-ringtone>
            ${(e.ringtoneChoices ?? []).map(
    (c) => `<option value="${t(c.value)}" ${c.selected ? "selected" : ""}>${t(c.label)}</option>`
  ).join("")}
          </select>
        </label>
      </footer>
    </section>
  `;
}
const k = {
  callerName: "UNKNOWN CALLER",
  subtitle: "Unidentified Signal",
  image: "",
  message: "Incoming transmission...",
  signal: 100,
  variant: "standard",
  fullscreen: !1,
  ringing: !0,
  accepted: !1,
  canAccept: !0,
  canDecline: !0,
  allowBroadcast: !0,
  outgoing: !1
}, Ke = /* @__PURE__ */ new Set(["standard", "emergency", "corrupted"]);
function Ie(e) {
  const t = Number(e);
  return Number.isNaN(t) ? k.signal : Math.min(100, Math.max(0, Math.round(t)));
}
function Ne(e) {
  return String(e).split(/\s+/).filter(Boolean).slice(0, 2).map((t) => {
    var n;
    return (n = t[0]) == null ? void 0 : n.toUpperCase();
  }).join("") || "?";
}
function Z() {
  var e;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.randomID ? foundry.utils.randomID() : crypto != null && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function x(e = {}) {
  var i;
  const t = Array.isArray(e.targetUserIds) ? e.targetUserIds.map((r) => String(r)).filter(Boolean) : [], n = Array.isArray(e.targetUserNames) ? e.targetUserNames.map((r) => String(r)).filter(Boolean) : [], a = {
    ...k,
    ...e,
    id: String(e.id ?? Z()),
    callerName: String(e.callerName ?? k.callerName),
    subtitle: String(e.subtitle ?? k.subtitle),
    image: String(e.image ?? k.image),
    message: String(e.message ?? k.message),
    signal: Ie(e.signal ?? k.signal),
    variant: Ke.has(e.variant) ? e.variant : k.variant,
    fullscreen: !!(e.fullscreen ?? k.fullscreen),
    ringing: e.ringing !== !1 && e.accepted !== !0,
    accepted: e.accepted === !0,
    canAccept: e.canAccept !== !1,
    canDecline: e.canDecline !== !1,
    allowBroadcast: e.allowBroadcast !== !1,
    outgoing: e.outgoing === !0,
    callerUserId: String(e.callerUserId ?? ""),
    contactNumber: String(e.contactNumber ?? ""),
    targetUserIds: t,
    targetUserNames: n
  };
  return a.initials = Ne(a.callerName), a.showBroadcast = !!((i = game == null ? void 0 : game.user) != null && i.isGM && a.allowBroadcast), a.isStandard = a.variant === "standard", a.isEmergency = a.variant === "emergency", a.isCorrupted = a.variant === "corrupted", a.isIncoming = !a.accepted, a.hasTargets = a.targetUserIds.length > 0, a.recipientLabel = a.hasTargets ? a.targetUserNames.join(", ") : "All players", a.directionLabel = a.outgoing ? `Calling ${a.recipientLabel}` : `From ${a.callerName}`, a.kicker = a.outgoing ? "Outgoing CyberCall" : a.fullscreen ? "System-wide Broadcast" : "Incoming CyberCall", a;
}
function B(e = {}) {
  return {
    id: String(e.id ?? Z()),
    name: String(e.name ?? "").trim(),
    number: String(e.number ?? "").trim(),
    image: String(e.image ?? e.img ?? "").trim(),
    initials: Ne(e.name),
    managed: e.managed === !0
  };
}
function se(e = {}) {
  return {
    id: String(e.id ?? Z()),
    number: String(e.number ?? "").trim(),
    name: String(e.name ?? "").trim(),
    image: String(e.image ?? e.img ?? "").trim(),
    actorId: String(e.actorId ?? "").trim(),
    ownerUserId: String(e.ownerUserId ?? "").trim(),
    grantedUserIds: Array.isArray(e.grantedUserIds) ? e.grantedUserIds.map(String) : []
  };
}
function F(e) {
  return String(e ?? "").replace(/\D/g, "");
}
function $e(e) {
  let t = "";
  for (let n = 0; n < e; n += 1) t += Math.floor(Math.random() * 10);
  return t;
}
function Se() {
  const e = () => `${2 + Math.floor(Math.random() * 8)}${$e(2)}`;
  return `(${e()}) ${e()}-${$e(4)}`;
}
function Te(e) {
  for (let t = 0; t < 1e4; t += 1) {
    const n = Se();
    if (!e.has(F(n))) return n;
  }
  return Se();
}
function Je() {
  var t, n, a;
  const e = Number(((n = (t = globalThis.game) == null ? void 0 : t.release) == null ? void 0 : n.generation) ?? ((a = game == null ? void 0 : game.release) == null ? void 0 : a.generation));
  return Number.isFinite(e) ? e : null;
}
function Qe() {
  const e = Je();
  return e === null || e >= 13;
}
function Xe() {
  var n, a, i, r, c, l;
  const e = ((a = (n = globalThis.foundry) == null ? void 0 : n.appv1) == null ? void 0 : a.api) ?? ((i = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : i.api) ?? null, t = ((c = (r = globalThis.foundry) == null ? void 0 : r.applications) == null ? void 0 : c.api) ?? ((l = foundry == null ? void 0 : foundry.applications) == null ? void 0 : l.api) ?? null;
  return globalThis.Application ?? (e == null ? void 0 : e.Application) ?? (t == null ? void 0 : t.ApplicationV1) ?? globalThis.FormApplication ?? (e == null ? void 0 : e.FormApplication) ?? (t == null ? void 0 : t.FormApplication) ?? (t == null ? void 0 : t.ApplicationV2);
}
function Ze(e) {
  var be, fe, ye, Ce;
  const {
    moduleId: t,
    templatePath: n,
    composerTemplatePath: a,
    contactsTemplatePath: i,
    escapeHTML: r,
    getDefaultComposerData: c,
    getActorChoices: l,
    getPlayerChoices: o,
    getContacts: u,
    getGroupContacts: d,
    getRingtoneChoices: m,
    getSoundPath: f,
    getActiveContactsTab: h,
    canEditContactImages: I,
    bindCallControls: w,
    bindComposerControls: g,
    bindContactsControls: C,
    stopRinging: S,
    clearActiveCall: A,
    clearActiveComposer: T,
    clearActiveContacts: E
  } = e, G = (fe = (be = foundry == null ? void 0 : foundry.applications) == null ? void 0 : be.api) == null ? void 0 : fe.ApplicationV2, V = (Ce = (ye = foundry == null ? void 0 : foundry.applications) == null ? void 0 : ye.api) == null ? void 0 : Ce.HandlebarsApplicationMixin, K = Xe(), z = Qe();
  class te extends K {
    constructor(b, y = {}) {
      super(y);
      j(this, "callData");
      this.callData = x(b);
    }
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        id: "cybercall-overlay",
        title: "CyberCall",
        template: n,
        classes: ["cybercall-app"],
        popOut: !0,
        resizable: !0,
        width: 440,
        height: 420
      });
    }
    getData() {
      return {
        call: this.callData
      };
    }
    async _renderInner(b) {
      try {
        return await super._renderInner(b);
      } catch (y) {
        return console.warn(`${t} | Template render failed, using inline fallback.`, y), $(we(this.callData, r));
      }
    }
    activateListeners(b) {
      super.activateListeners(b), w(this, b);
    }
    async close(b) {
      return A(this), S(), super.close(b);
    }
  }
  class J extends K {
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        id: "cybercall-composer",
        title: "CyberCall Composer",
        template: a,
        classes: ["cybercall-composer-app"],
        popOut: !0,
        resizable: !0,
        width: 560,
        height: 800
      });
    }
    getData() {
      return {
        call: c(),
        actors: l(),
        players: o(),
        ringtoneChoices: m()
      };
    }
    async _renderInner(v) {
      try {
        return await super._renderInner(v);
      } catch (b) {
        return console.warn(`${t} | Composer template render failed, using inline fallback.`, b), $(ve(v, r));
      }
    }
    activateListeners(v) {
      super.activateListeners(v), g(this, v);
    }
    async close(v) {
      return T(this), super.close(v);
    }
  }
  class ne extends K {
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        id: "cybercall-contacts",
        title: "CyberCall Contacts",
        template: i,
        classes: ["cybercall-contacts-app"],
        popOut: !0,
        resizable: !0,
        width: 500,
        height: 620
      });
    }
    getData() {
      const v = u(), b = d(), y = h();
      return {
        contacts: v,
        groupContacts: b,
        hasContacts: v.length > 0,
        hasGroupContacts: b.length > 0,
        activeTab: y,
        isPersonalTab: y !== "group",
        isGroupTab: y === "group",
        canEditContactImages: I(),
        ringtoneChoices: m(),
        currentRingtone: f()
      };
    }
    async _renderInner(v) {
      try {
        return await super._renderInner(v);
      } catch (b) {
        return console.warn(`${t} | Contacts template render failed, using inline fallback.`, b), $(Ae(v, r));
      }
    }
    activateListeners(v) {
      super.activateListeners(v), C(this, v);
    }
    async close(v) {
      return E(this), super.close(v);
    }
  }
  function H() {
    var N;
    return !z || !G || !V ? null : (N = class extends V(G) {
      constructor(y, D = {}) {
        super(D);
        j(this, "callData");
        this.callData = x(y);
      }
      async _prepareContext(y) {
        return {
          ...await super._prepareContext(y),
          call: this.callData
        };
      }
      async _renderHTML(y, D) {
        try {
          return await super._renderHTML(y, D);
        } catch (M) {
          console.warn(`${t} | Template render failed, using inline fallback.`, M);
          const he = document.createElement("template");
          return he.innerHTML = we(this.callData, r).trim(), he.content;
        }
      }
      _onRender(y, D) {
        var M;
        (M = super._onRender) == null || M.call(this, y, D), w(this);
      }
      async close(y) {
        return A(this), S(), super.close(y);
      }
    }, j(N, "DEFAULT_OPTIONS", {
      id: "cybercall-overlay",
      tag: "section",
      classes: ["cybercall-app"],
      window: {
        title: "CyberCall",
        resizable: !0
      },
      position: {
        width: 440,
        height: 420
      }
    }), j(N, "PARTS", {
      main: {
        template: n
      }
    }), N);
  }
  function je() {
    var N;
    return !z || !G || !V ? null : (N = class extends V(G) {
      async _prepareContext(b) {
        return {
          ...await super._prepareContext(b),
          call: c(),
          actors: l(),
          players: o(),
          ringtoneChoices: m()
        };
      }
      async _renderHTML(b, y) {
        try {
          return await super._renderHTML(b, y);
        } catch (D) {
          console.warn(`${t} | Composer template render failed, using inline fallback.`, D);
          const M = document.createElement("template");
          return M.innerHTML = ve(b, r).trim(), M.content;
        }
      }
      _onRender(b, y) {
        var D;
        (D = super._onRender) == null || D.call(this, b, y), g(this);
      }
      async close(b) {
        return T(this), super.close(b);
      }
    }, j(N, "DEFAULT_OPTIONS", {
      id: "cybercall-composer",
      tag: "section",
      classes: ["cybercall-composer-app"],
      window: {
        title: "CyberCall Composer",
        resizable: !0
      },
      position: {
        width: 560,
        height: 800
      }
    }), j(N, "PARTS", {
      main: {
        template: a
      }
    }), N);
  }
  function ze() {
    var N;
    return !z || !G || !V ? null : (N = class extends V(G) {
      async _prepareContext(b) {
        const y = u(), D = d(), M = h();
        return {
          ...await super._prepareContext(b),
          contacts: y,
          groupContacts: D,
          hasContacts: y.length > 0,
          hasGroupContacts: D.length > 0,
          activeTab: M,
          isPersonalTab: M !== "group",
          isGroupTab: M === "group",
          canEditContactImages: I(),
          ringtoneChoices: m(),
          currentRingtone: f()
        };
      }
      async _renderHTML(b, y) {
        try {
          return await super._renderHTML(b, y);
        } catch (D) {
          console.warn(`${t} | Contacts template render failed, using inline fallback.`, D);
          const M = document.createElement("template");
          return M.innerHTML = Ae(b, r).trim(), M.content;
        }
      }
      _onRender(b, y) {
        var D;
        (D = super._onRender) == null || D.call(this, b, y), C(this);
      }
      async close(b) {
        return E(this), super.close(b);
      }
    }, j(N, "DEFAULT_OPTIONS", {
      id: "cybercall-contacts",
      tag: "section",
      classes: ["cybercall-contacts-app"],
      window: {
        title: "CyberCall Contacts",
        resizable: !0
      },
      position: {
        width: 500,
        height: 620
      }
    }), j(N, "PARTS", {
      main: {
        template: i
      }
    }), N);
  }
  return {
    CyberCallApplication: H() ?? te,
    CyberCallComposer: je() ?? J,
    CyberCallContacts: ze() ?? ne
  };
}
const p = "cybercall", q = `module.${p}`, et = `modules/${p}/templates/cybercall.hbs`, tt = `modules/${p}/templates/cybercall-composer.hbs`, nt = `modules/${p}/templates/cybercall-contacts.hbs`, Ue = {
  "": "Silent",
  [`modules/${p}/audio/Ringtone1.ogg`]: "Ringtone 1",
  [`modules/${p}/audio/Ringtone2.ogg`]: "Ringtone 2",
  [`modules/${p}/audio/Ringtone3.ogg`]: "Ringtone 3"
};
function P(e) {
  var n;
  if ((n = foundry == null ? void 0 : foundry.utils) != null && n.escapeHTML) return foundry.utils.escapeHTML(String(e));
  const t = document.createElement("div");
  return t.innerText = String(e), t.innerHTML;
}
let s = null, O = null, U = null, Q = "personal", W = null, X = null;
function at() {
  var e, t, n, a, i, r, c, l;
  return x({
    callerName: ((e = s == null ? void 0 : s.callData) == null ? void 0 : e.callerName) ?? k.callerName,
    subtitle: ((t = s == null ? void 0 : s.callData) == null ? void 0 : t.subtitle) ?? k.subtitle,
    image: ((n = s == null ? void 0 : s.callData) == null ? void 0 : n.image) ?? "",
    message: ((a = s == null ? void 0 : s.callData) == null ? void 0 : a.message) ?? k.message,
    signal: ((i = s == null ? void 0 : s.callData) == null ? void 0 : i.signal) ?? game.settings.get(p, "defaultSignal"),
    variant: ((r = s == null ? void 0 : s.callData) == null ? void 0 : r.variant) ?? "standard",
    fullscreen: ((c = s == null ? void 0 : s.callData) == null ? void 0 : c.fullscreen) ?? !1,
    ringing: ((l = s == null ? void 0 : s.callData) == null ? void 0 : l.ringing) ?? !0
  });
}
function rt() {
  var e;
  return (((e = game.actors) == null ? void 0 : e.contents) ?? []).map((t) => ({
    id: t.id,
    name: t.name,
    img: t.img ?? ""
  })).sort((t, n) => t.name.localeCompare(n.name));
}
function it() {
  var e;
  return (((e = game.users) == null ? void 0 : e.contents) ?? []).filter((t) => !t.isGM).map((t) => ({
    id: t.id,
    name: t.name,
    active: t.active === !0
  })).sort((t, n) => t.name.localeCompare(n.name));
}
function ie() {
  var e, t;
  return String(((e = game.world) == null ? void 0 : e.id) ?? ((t = game.world) == null ? void 0 : t.title) ?? "default");
}
function Ee() {
  const e = game.settings.get(p, "contacts");
  return Array.isArray(e) ? { [ie()]: e } : !e || typeof e != "object" ? {} : e;
}
function ce() {
  const e = Ee()[ie()], t = Array.isArray(e) ? e.map(B).filter((r) => r.name && r.number) : [], n = ot(), a = new Set(n.map((r) => F(r.number))), i = t.filter((r) => !a.has(F(r.number)));
  return [...n, ...i].sort((r, c) => r.name.localeCompare(c.name));
}
function Y() {
  if (Array.isArray(X))
    return X.map(B).filter((t) => t.name && t.number).sort((t, n) => t.name.localeCompare(n.name));
  const e = game.settings.get(p, "groupContacts");
  return Array.isArray(e) ? e.map(B).filter((t) => t.name && t.number).sort((t, n) => t.name.localeCompare(n.name)) : [];
}
async function Me(e) {
  await game.settings.set(p, "contacts", {
    ...Ee(),
    [ie()]: e.map(B)
  });
}
async function ae(e) {
  X = e.map(B), await game.settings.set(p, "groupContacts", X), game.socket.emit(q, {
    action: "groupContactsChanged",
    contacts: X
  });
}
function R() {
  const e = game.settings.get(p, "directory");
  return Array.isArray(e) ? e.map(se) : [];
}
async function ee(e) {
  if (!game.user.isGM) return;
  const t = e.map(se);
  await game.settings.set(p, "directory", t), game.socket.emit(q, { action: "directoryChanged" });
}
function ct(e) {
  return e ? R().find((t) => t.actorId === e) ?? null : null;
}
function lt(e) {
  const t = F(e);
  return t ? R().find((n) => F(n.number) === t) ?? null : null;
}
function ke() {
  const e = /* @__PURE__ */ new Set();
  for (const t of R()) e.add(F(t.number));
  for (const t of Y()) e.add(F(t.number));
  return e.delete(""), e;
}
function Pe(e) {
  var i, r, c;
  const t = e ? (i = game.actors) == null ? void 0 : i.get(e) : null;
  if (!t) return "";
  const n = (((r = game.users) == null ? void 0 : r.contents) ?? []).filter(
    (l) => {
      var o;
      return !l.isGM && ((o = t.testUserPermission) == null ? void 0 : o.call(t, l, "OWNER"));
    }
  );
  return ((c = n.find((l) => l.active) ?? n[0]) == null ? void 0 : c.id) ?? "";
}
function ot() {
  var t;
  const e = (t = game.user) == null ? void 0 : t.id;
  return e ? R().filter((n) => n.grantedUserIds.includes(e) && n.name && n.number).map((n) => B({
    id: n.id,
    name: n.name,
    number: n.number,
    image: n.image,
    managed: !0
  })) : [];
}
async function st(e, t, n = "personal", a = "") {
  var c, l, o, u, d, m;
  const i = B({
    name: e,
    number: t,
    image: Re() ? a : ""
  });
  if (!i.name || !i.number) {
    (l = (c = ui.notifications) == null ? void 0 : c.warn) == null || l.call(c, "Contact name and number are required.");
    return;
  }
  if (n === "group" && !game.user.isGM) {
    if (!le()) {
      (u = (o = ui.notifications) == null ? void 0 : o.warn) == null || u.call(o, "A GM must be connected to update group contacts.");
      return;
    }
    game.socket.emit(q, {
      action: "groupContactAdd",
      contact: i
    }), (m = (d = ui.notifications) == null ? void 0 : d.info) == null || m.call(d, "Group contact update sent to the GM.");
    return;
  }
  const r = n === "group" ? Y() : ce();
  r.push(i), n === "group" ? await ae(r) : await Me(r), await L();
}
async function ut(e, t = "personal") {
  var n, a, i, r;
  if (t === "group") {
    if (!game.user.isGM) {
      if (!le()) {
        (a = (n = ui.notifications) == null ? void 0 : n.warn) == null || a.call(n, "A GM must be connected to update group contacts.");
        return;
      }
      game.socket.emit(q, {
        action: "groupContactRemove",
        contactId: e
      }), (r = (i = ui.notifications) == null ? void 0 : i.info) == null || r.call(i, "Group contact removal sent to the GM.");
      return;
    }
    await ae(Y().filter((c) => c.id !== e));
  } else
    await Me(ce().filter((c) => c.id !== e));
  await L();
}
function le() {
  var e;
  return ((e = game.users) == null ? void 0 : e.some((t) => t.isGM && t.active)) ?? !1;
}
function re(e = game.user) {
  if (e != null && e.isGM) return !0;
  let t = CONST.USER_ROLES.PLAYER;
  try {
    t = game.settings.get(p, "minimumRole");
  } catch (n) {
    console.warn(`${p} | Permission setting unavailable, using Player role fallback.`, n);
  }
  return Number((e == null ? void 0 : e.role) ?? 0) >= Number(t);
}
function Re(e = game.user) {
  return !!(e != null && e.isGM);
}
function ue(e, t = null) {
  var n;
  return t != null && t[0] ? t[0] : t instanceof HTMLElement ? t : (n = e.element) != null && n[0] ? e.element[0] : e.element ?? null;
}
function dt(e, t = null) {
  const n = ue(e, t);
  n && (n.classList.toggle("cybercall-fullscreen", e.callData.fullscreen), n.classList.toggle("cybercall-ringing", e.callData.ringing && !e.callData.accepted), n.classList.toggle("cybercall-connected", e.callData.accepted), n.querySelectorAll("[data-cybercall-action]").forEach((a) => {
    a.addEventListener("click", (i) => {
      const r = i.currentTarget.dataset.cybercallAction;
      if (r === "accept") {
        vt(e.callData.id);
        return;
      }
      if (r === "broadcast") {
        ge({
          ...e.callData,
          fullscreen: !0,
          ringing: !0
        });
        return;
      }
      (r === "decline" || r === "end") && Le(e.callData.id);
    });
  }));
}
function gt(e) {
  var t;
  return (t = e == null ? void 0 : e.querySelector) == null ? void 0 : t.call(e, "form[data-cybercall-composer]");
}
function De(e) {
  var o, u;
  const t = new FormData(e), n = (o = game.actors) == null ? void 0 : o.get(t.get("actorId")), a = String(t.get("image") ?? "").trim() || (n == null ? void 0 : n.img) || "", i = String(t.get("callerName") ?? "").trim() || (n == null ? void 0 : n.name) || "UNKNOWN CALLER", r = t.getAll("targetUserIds").map((d) => String(d)).filter(Boolean), c = new Map((((u = game.users) == null ? void 0 : u.contents) ?? []).map((d) => [d.id, d])), l = r.map((d) => {
    var m;
    return ((m = c.get(d)) == null ? void 0 : m.name) ?? d;
  });
  return x({
    callerName: i,
    subtitle: String(t.get("subtitle") ?? "").trim(),
    image: a,
    message: String(t.get("message") ?? "").trim(),
    signal: t.get("signal"),
    variant: String(t.get("variant") ?? k.variant),
    fullscreen: t.get("fullscreen") === "on",
    ringing: t.get("ringing") === "on",
    targetUserIds: r,
    targetUserNames: l
  });
}
function oe(e) {
  var a, i;
  const t = (a = e == null ? void 0 : e.elements) == null ? void 0 : a.signal, n = (i = e == null ? void 0 : e.querySelector) == null ? void 0 : i.call(e, "[data-cybercall-signal-output]");
  !t || !n || (n.textContent = `${Ie(t.value)}%`);
}
function mt(e, t = null) {
  var r, c;
  const n = ue(e, t), a = gt(n);
  if (!n || !a) return;
  oe(a);
  const i = n.querySelector("[data-cybercall-ringtone]");
  i && i.addEventListener("change", async (l) => {
    await game.settings.set(p, "ringSound", l.currentTarget.value);
  }), (r = a.elements.signal) == null || r.addEventListener("input", () => oe(a)), (c = a.elements.actorId) == null || c.addEventListener("change", () => {
    var o;
    const l = (o = game.actors) == null ? void 0 : o.get(a.elements.actorId.value);
    l && (a.elements.callerName.value = l.name, a.elements.image.value = l.img ?? "");
  }), a.addEventListener("submit", (l) => {
    l.preventDefault(), _(De(a));
  }), n.querySelectorAll("[data-cybercall-compose-action]").forEach((l) => {
    l.addEventListener("click", async (o) => {
      var m, f, h, I, w, g, C, S;
      const u = o.currentTarget.dataset.cybercallComposeAction, d = De(a);
      if (u === "preview") {
        await _(d);
        return;
      }
      if (u === "broadcast") {
        await ge(d);
        return;
      }
      if (u === "close-active") {
        Le((m = s == null ? void 0 : s.callData) == null ? void 0 : m.id);
        return;
      }
      if (u === "add-player-contact") {
        await Dt({
          actorId: ((f = a.elements.actorId) == null ? void 0 : f.value) ?? "",
          callerName: d.callerName,
          image: d.image
        });
        return;
      }
      if (u === "manage-player-contacts") {
        await xe();
        return;
      }
      if (u === "browse-image") {
        const A = a.elements.image, T = globalThis.FilePicker ?? ((w = (I = (h = globalThis.foundry) == null ? void 0 : h.applications) == null ? void 0 : I.apps) == null ? void 0 : w.FilePicker);
        if (!A || !T) {
          (C = (g = ui.notifications) == null ? void 0 : g.warn) == null || C.call(g, "Foundry FilePicker is unavailable.");
          return;
        }
        const E = new T({
          type: "image",
          current: A.value,
          callback: (G) => {
            A.value = G, A.dispatchEvent(new Event("change", { bubbles: !0 }));
          }
        });
        typeof E.browse == "function" ? E.browse() : (S = E.render) == null || S.call(E, !0);
        return;
      }
      u === "reset" && (a.reset(), oe(a));
    });
  });
}
function pt(e) {
  var t;
  return (t = e == null ? void 0 : e.querySelector) == null ? void 0 : t.call(e, "form[data-cybercall-contacts-form]");
}
function bt(e, t = null) {
  const n = ue(e, t), a = pt(n);
  if (!n || !a) return;
  a.addEventListener("submit", async (r) => {
    var o;
    r.preventDefault();
    const c = new FormData(a), l = String(c.get("scope") ?? Q);
    await st(c.get("name"), c.get("number"), l, c.get("image")), a.reset(), a.elements.scope.value = l, (o = a.elements.name) == null || o.focus();
  }), n.querySelectorAll("[data-cybercall-contact-tab]").forEach((r) => {
    r.addEventListener("click", (c) => {
      Q = c.currentTarget.dataset.cybercallContactTab, n.querySelectorAll("[data-cybercall-contact-tab]").forEach((l) => {
        l.classList.toggle("active", l.dataset.cybercallContactTab === Q);
      }), n.querySelectorAll("[data-cybercall-contact-panel]").forEach((l) => {
        l.hidden = l.dataset.cybercallContactPanel !== Q;
      }), a.elements.scope && (a.elements.scope.value = Q);
    });
  });
  const i = n.querySelector("[data-cybercall-ringtone]");
  i && i.addEventListener("change", async (r) => {
    await game.settings.set(p, "ringSound", r.currentTarget.value);
  }), n.querySelectorAll("[data-cybercall-contact-action]").forEach((r) => {
    r.addEventListener("click", async (c) => {
      const l = c.currentTarget.dataset.cybercallContactAction, o = c.currentTarget.dataset.contactId, u = c.currentTarget.dataset.contactScope ?? "personal", m = (u === "group" ? Y() : ce()).find((f) => f.id === o);
      if (l === "remove") {
        u === "managed" ? await It(o) : await ut(o, u);
        return;
      }
      l === "call" && m && await St(m) && U === e && await e.close();
    });
  });
}
const { CyberCallApplication: ft, CyberCallComposer: yt, CyberCallContacts: Ct } = Ze({
  moduleId: p,
  templatePath: et,
  composerTemplatePath: tt,
  contactsTemplatePath: nt,
  escapeHTML: P,
  getDefaultComposerData: at,
  getActorChoices: rt,
  getPlayerChoices: it,
  getContacts: ce,
  getGroupContacts: Y,
  getRingtoneChoices: Mt,
  getSoundPath: me,
  getActiveContactsTab: () => Q,
  canEditContactImages: Re,
  bindCallControls: dt,
  bindComposerControls: mt,
  bindContactsControls: bt,
  stopRinging: pe,
  clearActiveCall: (e) => {
    s === e && (s = null);
  },
  clearActiveComposer: (e) => {
    O === e && (O = null);
  },
  clearActiveContacts: (e) => {
    U === e && (U = null);
  }
});
async function _(e = {}) {
  var t, n;
  return re() ? (U && await U.close(), await de(), s = new ft(e), await s.render(!0), Be(s), kt(s.callData), s) : ((n = (t = ui.notifications) == null ? void 0 : t.warn) == null || n.call(t, "You do not have permission to open CyberCall transmissions."), null);
}
async function de() {
  if (!s) return;
  const e = s;
  s = null, await e.close();
}
function ht(e) {
  var t;
  return !!((t = s == null ? void 0 : s.callData) != null && t.id) && s.callData.id === e;
}
async function wt() {
  s && (await s.render(!0), Be(s));
}
async function Ge(e) {
  ht(e) && (s.callData.accepted = !0, s.callData.ringing = !1, pe(), await wt());
}
function vt(e) {
  e && (game.socket.emit(q, {
    action: "acceptCall",
    callId: e
  }), Ge(e));
}
async function Oe(e) {
  var t;
  e && ((t = s == null ? void 0 : s.callData) != null && t.id) && s.callData.id !== e || await de();
}
function Le(e) {
  game.socket.emit(q, {
    action: "endCall",
    callId: e
  }), Oe(e);
}
function At(e) {
  const t = lt(e.number);
  if (!t) return "";
  if (t.actorId) {
    const n = Pe(t.actorId);
    if (n) return n;
  }
  return t.ownerUserId;
}
async function $t(e, t) {
  var o, u, d, m, f, h;
  const n = Z(), a = String(((u = (o = game.user) == null ? void 0 : o.character) == null ? void 0 : u.name) ?? ((d = game.user) == null ? void 0 : d.name) ?? "Unknown Caller").trim(), i = String(((f = (m = game.user) == null ? void 0 : m.character) == null ? void 0 : f.img) ?? ((h = game.user) == null ? void 0 : h.avatar) ?? "").trim(), r = {
    id: n,
    signal: game.settings.get(p, "defaultSignal"),
    variant: "standard",
    fullscreen: !1,
    accepted: !1,
    allowBroadcast: !1,
    callerUserId: game.user.id,
    contactNumber: e.number
  }, c = x({
    ...r,
    callerName: e.name,
    subtitle: `Comms ${e.number}`,
    image: e.image,
    message: `Connecting to ${e.name}...`,
    canAccept: !1,
    canDecline: !1,
    outgoing: !0,
    ringing: !0
  }), l = x({
    ...r,
    callerName: a,
    subtitle: "Incoming call",
    image: i,
    message: `${a} is calling.`,
    canAccept: !0,
    canDecline: !0,
    ringing: !0
  });
  return game.socket.emit(q, {
    action: "incomingCall",
    targetUserId: t.id,
    callerName: a,
    contactName: e.name,
    callData: l
  }), _(c);
}
async function St(e) {
  var o, u, d, m, f, h;
  const t = At(e), n = t ? (o = game.users) == null ? void 0 : o.get(t) : null;
  if (n && n.id !== game.user.id)
    return $t(e, n);
  if (game.user.isGM)
    return _({
      callerName: e.name,
      subtitle: `Comms ${e.number}`,
      image: e.image,
      message: `Opening channel ${e.number}...`,
      signal: game.settings.get(p, "defaultSignal"),
      variant: "standard",
      ringing: !1
    });
  if (!le())
    return (d = (u = ui.notifications) == null ? void 0 : u.warn) == null || d.call(u, "No GM is connected to receive the CyberCall."), null;
  const a = Z(), i = String(((m = game.user) == null ? void 0 : m.avatar) ?? ((h = (f = game.user) == null ? void 0 : f.character) == null ? void 0 : h.img) ?? "").trim(), r = {
    id: a,
    signal: game.settings.get(p, "defaultSignal"),
    variant: "standard",
    fullscreen: !1,
    accepted: !1,
    allowBroadcast: !1,
    callerUserId: game.user.id,
    contactNumber: e.number
  }, c = x({
    ...r,
    callerName: e.name,
    subtitle: `Comms ${e.number}`,
    image: e.image,
    message: `Awaiting connection to ${e.name} on ${e.number}...`,
    canAccept: !1,
    canDecline: !1,
    outgoing: !0,
    ringing: !0
  }), l = x({
    ...r,
    callerName: game.user.name,
    subtitle: `Call request from ${game.user.name}`,
    image: i,
    message: `${game.user.name} is calling ${e.name} on ${e.number}.`,
    canAccept: !0,
    ringing: !0
  });
  return game.socket.emit(q, {
    action: "playerCallRequest",
    callData: l
  }), _(c);
}
async function _e() {
  var e, t, n;
  return game.user.isGM ? O ? ((n = O.bringToFront) == null || n.call(O), O) : (O = new yt(), await O.render(!0), O) : ((t = (e = ui.notifications) == null ? void 0 : e.warn) == null || t.call(e, "Only the GM can open the CyberCall composer."), null);
}
async function Fe() {
  var e, t, n, a;
  return re() ? s ? ((n = s.bringToFront) == null || n.call(s), s) : U ? ((a = U.bringToFront) == null || a.call(U), U) : (U = new Ct(), await U.render(!0), U) : ((t = (e = ui.notifications) == null ? void 0 : e.warn) == null || t.call(e, "You do not have permission to use CyberCall contacts."), null);
}
async function L() {
  U && await U.render(!0);
}
async function ge(e = {}) {
  var n, a;
  if (!game.user.isGM)
    return (a = (n = ui.notifications) == null ? void 0 : n.warn) == null || a.call(n, "Only the GM can broadcast CyberCalls to all players."), null;
  const t = x({
    ...e,
    fullscreen: e.fullscreen ?? !0,
    ringing: !0
  });
  return game.socket.emit(q, {
    action: "openCall",
    callData: t,
    targetUserIds: t.targetUserIds
  }), _({ ...t, outgoing: !0 });
}
async function Dt(e = {}) {
  var C, S, A, T, E, G, V, K, z, te, J, ne;
  if (!game.user.isGM) {
    (S = (C = ui.notifications) == null ? void 0 : C.warn) == null || S.call(C, "Only the GM can add contacts to player phones.");
    return;
  }
  const t = e.actorId ? (A = game.actors) == null ? void 0 : A.get(e.actorId) : null, n = (t == null ? void 0 : t.id) ?? "", a = String(e.callerName ?? "").trim() || (t == null ? void 0 : t.name) || "", i = String(e.image ?? "").trim() || (t == null ? void 0 : t.img) || "";
  if (!a) {
    (E = (T = ui.notifications) == null ? void 0 : T.warn) == null || E.call(T, "Enter a caller name or choose an actor before adding a contact.");
    return;
  }
  const r = n ? ct(n) : null, c = n ? Pe(n) : "", l = c ? ((V = (G = game.users) == null ? void 0 : G.get(c)) == null ? void 0 : V.name) ?? "" : "", o = (r == null ? void 0 : r.number) || Te(ke()), u = (((K = game.users) == null ? void 0 : K.contents) ?? []).filter((H) => !H.isGM), d = new Set((r == null ? void 0 : r.grantedUserIds) ?? []), m = await qe({ name: a, image: i, number: o, players: u, grantedSet: d, ownerName: l });
  if (!m) return;
  const f = String(m.number ?? "").trim() || o, h = F(f), I = R().find(
    (H) => F(H.number) === h && H.id !== (r == null ? void 0 : r.id)
  );
  if (I) {
    (te = (z = ui.notifications) == null ? void 0 : z.warn) == null || te.call(z, `Number ${f} is already assigned to ${I.name || "another contact"}.`);
    return;
  }
  const w = R(), g = r ? w.find((H) => H.id === r.id) : null;
  g ? Object.assign(g, { number: f, name: a, image: i, actorId: n, ownerUserId: c, grantedUserIds: m.recipients }) : w.push(se({ number: f, name: a, image: i, actorId: n, ownerUserId: c, grantedUserIds: m.recipients })), await ee(w), await L(), (ne = (J = ui.notifications) == null ? void 0 : J.info) == null || ne.call(J, `Added ${a} (${f}) to ${m.recipients.length} player contact list(s).`);
}
function qe({ name: e, image: t, number: n, players: a, grantedSet: i, ownerName: r }) {
  var h, I, w;
  const c = r ? `Calls to this number reach <strong>${P(r)}</strong>.` : "No player owns this actor &mdash; calls to this number route to the GM.", l = a.length ? a.map(
    (g) => `<label class="cybercall-recipient"><input type="checkbox" name="recipient" value="${P(g.id)}" ${i.has(g.id) ? "checked" : ""}><span>${P(g.name)}</span></label>`
  ).join("") : '<p class="cybercall-recipient-empty">No players exist in this world yet.</p>', o = `
    <div class="cybercall-add-contact">
      <div class="cybercall-add-contact-head">
        ${t ? `<img src="${P(t)}" alt="">` : ""}
        <strong>${P(e)}</strong>
      </div>
      <label class="cybercall-add-contact-number">
        <span>Phone number</span>
        <span class="cybercall-add-contact-number-row">
          <input type="text" name="number" value="${P(n)}" autocomplete="off">
          <button type="button" data-cybercall-regen title="Generate a new unused number"><i class="fa-solid fa-rotate"></i></button>
        </span>
      </label>
      <p class="cybercall-add-contact-route">${c}</p>
      <fieldset class="cybercall-recipients">
        <legend>Players with access to this contact</legend>
        ${l}
      </fieldset>
    </div>
  `, u = (g) => {
    var A, T;
    const C = (A = g == null ? void 0 : g.querySelector) == null ? void 0 : A.call(g, "[data-cybercall-regen]"), S = (T = g == null ? void 0 : g.querySelector) == null ? void 0 : T.call(g, "input[name='number']");
    C == null || C.addEventListener("click", () => {
      S && (S.value = Te(ke()));
    });
  }, d = (g) => {
    var C, S;
    return {
      number: ((S = (C = g == null ? void 0 : g.elements) == null ? void 0 : C.number) == null ? void 0 : S.value) ?? "",
      recipients: Array.from((g == null ? void 0 : g.querySelectorAll("input[name='recipient']:checked")) ?? []).map((A) => A.value)
    };
  }, m = (w = (I = (h = globalThis.foundry) == null ? void 0 : h.applications) == null ? void 0 : I.api) == null ? void 0 : w.DialogV2;
  if (m != null && m.wait)
    return m.wait({
      window: { title: `Add ${e} to player contacts`, icon: "fa-solid fa-address-book" },
      classes: ["cybercall-add-contact-dialog"],
      content: o,
      rejectClose: !1,
      render: (g, C) => u((C == null ? void 0 : C.element) ?? C),
      buttons: [
        { action: "save", label: "Save", icon: "fa-solid fa-floppy-disk", default: !0, callback: (g, C) => d(C.form) },
        { action: "cancel", label: "Cancel", icon: "fa-solid fa-xmark" }
      ]
    }).then((g) => g && g !== "cancel" ? g : null);
  const f = globalThis.Dialog;
  return f ? new Promise((g) => {
    let C = !1;
    const S = (A) => {
      C || (C = !0, g(A));
    };
    new f({
      title: `Add ${e} to player contacts`,
      content: `<form class="cybercall-add-contact-dialog">${o}</form>`,
      buttons: {
        save: { label: "Save", callback: (A) => {
          var E;
          const T = (E = A[0]) == null ? void 0 : E.querySelector("form");
          S(T ? d(T) : null);
        } },
        cancel: { label: "Cancel", callback: () => S(null) }
      },
      default: "save",
      render: (A) => u(A[0]),
      close: () => S(null)
    }).render(!0);
  }) : Promise.resolve(null);
}
async function It(e) {
  var t, n, a, i;
  if (e) {
    if (game.user.isGM) {
      const r = R(), c = r.find((l) => l.id === e);
      if (!c) return;
      c.grantedUserIds = c.grantedUserIds.filter((l) => l !== game.user.id), await ee(r), await L();
      return;
    }
    if (!le()) {
      (n = (t = ui.notifications) == null ? void 0 : t.warn) == null || n.call(t, "A GM must be connected to remove this contact.");
      return;
    }
    game.socket.emit(q, {
      action: "managedContactRemove",
      entryId: e,
      userId: game.user.id
    }), (i = (a = ui.notifications) == null ? void 0 : a.info) == null || i.call(a, "Contact removal sent to the GM.");
  }
}
async function Nt(e) {
  var d, m, f, h, I;
  if (!game.user.isGM) return;
  const t = R().find((w) => w.id === e);
  if (!t) return;
  const n = t.ownerUserId ? ((m = (d = game.users) == null ? void 0 : d.get(t.ownerUserId)) == null ? void 0 : m.name) ?? "" : "", a = (((f = game.users) == null ? void 0 : f.contents) ?? []).filter((w) => !w.isGM), i = await qe({
    name: t.name,
    image: t.image,
    number: t.number,
    players: a,
    grantedSet: new Set(t.grantedUserIds),
    ownerName: n
  });
  if (!i) return;
  const r = String(i.number ?? "").trim() || t.number, c = F(r), l = R().find(
    (w) => F(w.number) === c && w.id !== t.id
  );
  if (l) {
    (I = (h = ui.notifications) == null ? void 0 : h.warn) == null || I.call(h, `Number ${r} is already assigned to ${l.name || "another contact"}.`);
    return;
  }
  const o = R(), u = o.find((w) => w.id === e);
  u && (u.number = r, u.grantedUserIds = i.recipients, await ee(o), await L());
}
async function Tt(e) {
  var r, c, l, o;
  if (!game.user.isGM) return;
  const t = R().find((u) => u.id === e);
  if (!t) return;
  const n = (l = (c = (r = globalThis.foundry) == null ? void 0 : r.applications) == null ? void 0 : c.api) == null ? void 0 : l.DialogV2, a = `<p>Remove <strong>${P(t.name)}</strong> (${P(t.number)}) from all player phones?</p>`;
  (n != null && n.confirm ? await n.confirm({ window: { title: "Delete Player Contact" }, content: a, rejectClose: !1 }) : (o = globalThis.confirm) != null && o.call(globalThis, `Remove ${t.name} (${t.number}) from all player phones?`)) && (await ee(R().filter((u) => u.id !== e)), await L());
}
function Ut() {
  const e = R();
  return e.length ? `<ul class="cybercall-manage-list">${e.map((n) => {
    var c, l;
    const a = n.ownerUserId ? ((l = (c = game.users) == null ? void 0 : c.get(n.ownerUserId)) == null ? void 0 : l.name) ?? "Unknown" : "GM (NPC)", i = n.grantedUserIds.map((o) => {
      var u, d;
      return (d = (u = game.users) == null ? void 0 : u.get(o)) == null ? void 0 : d.name;
    }).filter(Boolean), r = i.length ? i.join(", ") : "no one";
    return `
      <li class="cybercall-manage-row" data-entry-id="${P(n.id)}">
        <div class="cybercall-manage-info">
          <strong>${P(n.name)}</strong>
          <span class="cybercall-manage-meta">${P(n.number)} &middot; reaches ${P(a)}</span>
          <span class="cybercall-manage-held">Held by: ${P(r)}</span>
        </div>
        <div class="cybercall-manage-actions">
          <button type="button" data-dir-action="edit" title="Edit number and access"><i class="fa-solid fa-pen"></i></button>
          <button type="button" data-dir-action="delete" title="Delete for all players"><i class="fa-solid fa-trash"></i></button>
        </div>
      </li>
    `;
  }).join("")}</ul>` : '<p class="cybercall-manage-empty">No contacts have been assigned to players yet. Use &ldquo;Add to Player Contacts&rdquo; on the composer.</p>';
}
async function xe() {
  var n, a, i, r, c, l, o;
  if (!game.user.isGM) {
    (a = (n = ui.notifications) == null ? void 0 : n.warn) == null || a.call(n, "Only the GM can manage player contacts.");
    return;
  }
  const e = (c = (r = (i = globalThis.foundry) == null ? void 0 : i.applications) == null ? void 0 : r.api) == null ? void 0 : c.DialogV2;
  if (!(e != null && e.wait)) {
    (o = (l = ui.notifications) == null ? void 0 : l.warn) == null || o.call(l, "Directory management requires DialogV2 (Foundry v12+).");
    return;
  }
  const t = (u) => {
    var m;
    const d = (u == null ? void 0 : u.element) ?? u;
    (m = d == null ? void 0 : d.querySelectorAll) == null || m.call(d, "[data-dir-action]").forEach((f) => {
      f.addEventListener("click", async () => {
        var w;
        const h = (w = f.closest("[data-entry-id]")) == null ? void 0 : w.dataset.entryId, I = f.dataset.dirAction;
        await u.close(), I === "edit" ? await Nt(h) : I === "delete" && await Tt(h), xe();
      });
    });
  };
  await e.wait({
    window: { title: "Manage Player Contacts", icon: "fa-solid fa-address-book" },
    classes: ["cybercall-manage-dialog"],
    content: Ut(),
    rejectClose: !1,
    render: (u, d) => t(d),
    buttons: [{ action: "close", label: "Close", icon: "fa-solid fa-xmark", default: !0 }]
  });
}
async function Et(e) {
  var t, n, a;
  if (e && !(Array.isArray(e.targetUserIds) && e.targetUserIds.length && !e.targetUserIds.includes((t = game.user) == null ? void 0 : t.id)) && !(Array.isArray((n = e.callData) == null ? void 0 : n.targetUserIds) && e.callData.targetUserIds.length && !e.callData.targetUserIds.includes((a = game.user) == null ? void 0 : a.id))) {
    if (e.action === "openCall") {
      if (!re()) return;
      _(e.callData);
      return;
    }
    if (e.action === "playerCallRequest") {
      if (!game.user.isGM) return;
      _(e.callData);
      return;
    }
    if (e.action === "incomingCall") {
      if (!re()) return;
      const i = e.callData ?? {};
      if (e.targetUserId && e.targetUserId === game.user.id) {
        _(i);
        return;
      }
      game.user.isGM && _(x({
        ...i,
        subtitle: `Monitoring · ${e.callerName ?? i.callerName ?? "Caller"} → ${e.contactName ?? "contact"}`,
        message: `${e.callerName ?? i.callerName ?? "A caller"} is calling ${e.contactName ?? "a contact"}.`,
        canAccept: !1,
        canDecline: !0,
        ringing: !1
      }));
      return;
    }
    if (e.action === "managedContactRemove") {
      if (!game.user.isGM) return;
      const i = R(), r = i.find((c) => c.id === e.entryId);
      if (!r) return;
      r.grantedUserIds = r.grantedUserIds.filter((c) => c !== e.userId), await ee(i), await L();
      return;
    }
    if (e.action === "directoryChanged") {
      await L();
      return;
    }
    if (e.action === "acceptCall") {
      Ge(e.callId);
      return;
    }
    if (e.action === "endCall") {
      Oe(e.callId);
      return;
    }
    if (e.action === "groupContactAdd") {
      if (!game.user.isGM) return;
      const i = B({
        ...e.contact,
        image: ""
      });
      if (!i.name || !i.number) return;
      const r = Y();
      r.push(i), await ae(r), await L();
      return;
    }
    if (e.action === "groupContactRemove") {
      if (!game.user.isGM) return;
      await ae(Y().filter((i) => i.id !== e.contactId)), await L();
      return;
    }
    e.action === "groupContactsChanged" && (X = Array.isArray(e.contacts) ? e.contacts.map(B) : null, await L());
  }
}
function Be(e) {
  var t, n;
  (t = e == null ? void 0 : e.callData) != null && t.fullscreen && ((n = e.setPosition) == null || n.call(e, {
    left: 0,
    top: 0,
    width: window.innerWidth,
    height: window.innerHeight
  }));
}
function me() {
  return String(game.settings.get(p, "ringSound") ?? "").trim();
}
function Mt() {
  const e = me();
  return Object.entries(Ue).map(([t, n]) => ({
    value: t,
    label: n,
    selected: t === e
  }));
}
function pe() {
  if (!W) return;
  const e = W;
  W = null, typeof e.stop == "function" ? e.stop() : (e.pause(), e.currentTime = 0);
}
function kt(e) {
  var r;
  if (pe(), !e.ringing) return;
  const t = me();
  if (!t) return;
  const a = 0.65 * Number(game.settings.get("core", "globalInterfaceVolume") ?? 0.5), i = ((r = foundry == null ? void 0 : foundry.audio) == null ? void 0 : r.AudioHelper) ?? globalThis.AudioHelper;
  i != null && i.play ? i.play({ src: t, volume: a, autoplay: !0, loop: !0 }, !1).then((c) => {
    W = c;
  }).catch((c) => {
    console.warn(`${p} | Unable to play ringing sound.`, c);
  }) : (W = new Audio(t), W.loop = !0, W.volume = a, W.play().catch((c) => {
    console.warn(`${p} | Unable to play ringing sound.`, c);
  }));
}
function Ve() {
  const e = game.modules.get(p);
  e && (e.api = {
    openCall: _,
    closeCall: de,
    broadcastCall: ge,
    openComposer: _e,
    openContacts: Fe,
    get activeCall() {
      return s;
    },
    get activeComposer() {
      return O;
    },
    get activeContacts() {
      return U;
    }
  });
}
function Pt() {
  const e = game.modules.get("holosuite-core"), t = e != null && e.active ? e.api : null;
  return t != null && t.registerApp ? (t.registerApp({
    id: p,
    title: "CyberCall",
    icon: "fa-solid fa-satellite-dish",
    premium: !1,
    description: "Compose calls, contacts, and holographic broadcasts.",
    open: () => {
      var n;
      return (n = game.user) != null && n.isGM ? _e() : Fe();
    }
  }), !0) : !1;
}
function Rt() {
  const e = CONST.USER_ROLES, t = {};
  for (const [n, a] of [
    ["NONE", "None"],
    ["LIMITED", "Limited"],
    ["OBSERVER", "Observer"],
    ["PLAYER", "Player"],
    ["TRUSTED", "Trusted Player"],
    ["ASSISTANT", "Assistant GM"]
  ])
    Number.isFinite(Number(e[n])) && (t[e[n]] = a);
  game.settings.register(p, "defaultSignal", {
    name: "Default Signal Strength",
    hint: "Signal percentage used when a call does not provide one.",
    scope: "client",
    config: !0,
    type: Number,
    default: k.signal,
    range: {
      min: 0,
      max: 100,
      step: 1
    }
  }), game.settings.register(p, "ringSound", {
    name: "Incoming Call Ringtone",
    hint: "Ringtone played locally while a CyberCall is ringing. This is a client setting, so each user can choose their own ringtone.",
    scope: "client",
    config: !1,
    type: String,
    default: "",
    choices: Ue
  }), game.settings.register(p, "minimumRole", {
    name: "Minimum Player Role",
    hint: "Minimum role allowed to open CyberCall overlays and receive GM broadcasts.",
    scope: "world",
    config: !0,
    type: Number,
    default: e.PLAYER,
    choices: t
  }), game.settings.register(p, "contacts", {
    name: "CyberCall Contacts",
    hint: "Player contact directory stored locally for this client and isolated per world.",
    scope: "client",
    config: !1,
    type: Object,
    default: {}
  }), game.settings.register(p, "groupContacts", {
    name: "CyberCall Group Contacts",
    hint: "Shared group contact directory for all players in this world.",
    scope: "world",
    config: !1,
    type: Object,
    default: []
  }), game.settings.register(p, "directory", {
    name: "CyberCall Phone Directory",
    hint: "GM-managed registry of assigned numbers, the actors behind them, and which players hold each contact.",
    scope: "world",
    config: !1,
    type: Array,
    default: []
  });
}
async function Gt() {
  const e = game.settings.get(p, "contacts");
  Array.isArray(e) && await game.settings.set(p, "contacts", {
    [ie()]: e.map(B)
  });
}
Hooks.once("init", () => {
  Rt(), Ve();
});
Hooks.once("ready", async () => {
  await Gt(), Ve(), Pt(), game.socket.on(q, Et), console.log(`${p} | Ready. Use game.modules.get("${p}").api.openCall({...})`);
});
