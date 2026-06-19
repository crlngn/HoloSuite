var F = Object.defineProperty;
var x = (e, t, n) => t in e ? F(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var A = (e, t, n) => x(e, typeof t != "symbol" ? t + "" : t, n);
function h(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function C(e, t) {
  return h(e) ? t.includes(String(e.name ?? "")) : !1;
}
function w(e) {
  if (!h(e) || !("tools" in e)) return !1;
  const t = String(e.name ?? "");
  return !["measure", "templates", "walls", "lighting", "sounds", "notes", "tiles", "drawings"].includes(t);
}
function z(e, t, n) {
  if (Array.isArray(e))
    return e.find((r) => C(r, t)) ?? (n ? e.find(w) : null) ?? null;
  if (!h(e)) return null;
  for (const r of t)
    if (h(e[r])) return e[r];
  return Object.values(e).find((r) => C(r, t)) ?? (n ? Object.values(e).find(w) : null) ?? null;
}
function R(e) {
  const t = Object.values(e).map((n) => Number(n == null ? void 0 : n.order)).filter(Number.isFinite);
  return t.length ? Math.max(...t) + 1 : Object.keys(e).length;
}
function E(e, t, n = ["tokens", "token"], r = {}) {
  const i = z(e, n, r.allowFallback === !0);
  if (!i) return !1;
  const o = i.tools;
  return Array.isArray(o) ? o.some((a) => (a == null ? void 0 : a.name) === t.name) ? !1 : (o.push(t), !0) : !h(o) || o[t.name] ? !1 : (o[t.name] = { ...t, order: t.order ?? R(o) }, !0);
}
const c = "holosuite-core", D = "disableForPlayers", N = "theme", j = "open-launcher", P = {
  default: "Default Cyan",
  ember: "Ember",
  violet: "Violet"
}, g = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map();
let s = null;
function U() {
  var n, r, i, o, a, u;
  const e = ((r = (n = globalThis.foundry) == null ? void 0 : n.appv1) == null ? void 0 : r.api) ?? ((i = foundry == null ? void 0 : foundry.appv1) == null ? void 0 : i.api) ?? null, t = ((a = (o = globalThis.foundry) == null ? void 0 : o.applications) == null ? void 0 : a.api) ?? ((u = foundry == null ? void 0 : foundry.applications) == null ? void 0 : u.api) ?? null;
  return globalThis.FormApplication ?? (e == null ? void 0 : e.FormApplication) ?? globalThis.Application ?? (e == null ? void 0 : e.Application) ?? (t == null ? void 0 : t.ApplicationV2);
}
const q = U();
function d(e) {
  const t = document.createElement("div");
  return t.textContent = String(e ?? ""), t.innerHTML;
}
function p(e, t, n = `${t}s`) {
  return `${e} ${e === 1 ? t : n}`;
}
function v(e, t) {
  try {
    return game.settings.get(e, t);
  } catch {
    return null;
  }
}
function k(e) {
  var t;
  return ((t = game.modules.get(e)) == null ? void 0 : t.api) ?? null;
}
function K() {
  var e, t, n;
  return String(((t = (e = game.user) == null ? void 0 : e.character) == null ? void 0 : t.name) ?? ((n = game.user) == null ? void 0 : n.name) ?? "Player");
}
function Y(e) {
  var t, n, r, i, o, a;
  if (e === "cybercall") {
    const u = y(v("cybercall", "contacts")), l = y(v("cybercall", "groupContacts"));
    return p(u.length + l.length, "link");
  }
  if (e === "bounty-board") {
    const u = y((n = (t = k("bounty-board")) == null ? void 0 : t.getAllBounties) == null ? void 0 : n.call(t, { includeHidden: !1 }));
    return p(u.length, "contract");
  }
  if (e === "csi-toolkit") {
    const u = Object.values(((i = (r = k("csi-toolkit")) == null ? void 0 : r.getCases) == null ? void 0 : i.call(r)) ?? {}).filter((l) => (l == null ? void 0 : l.visibility) !== "gm");
    return p(u.length, "case");
  }
  if (e === "galaxy-map") {
    const u = y((a = (o = k("galaxy-map")) == null ? void 0 : o.getMaps) == null ? void 0 : a.call(o)).filter((l) => (l == null ? void 0 : l.visibility) === "players");
    return p(u.length, "chart");
  }
  return "";
}
function y(e) {
  return Array.isArray(e) ? e : [];
}
function W(e) {
  const t = String((e == null ? void 0 : e.id) ?? "").trim(), n = String((e == null ? void 0 : e.title) ?? "").trim(), r = String((e == null ? void 0 : e.icon) ?? "").trim();
  return !t || !n || !r || typeof (e == null ? void 0 : e.open) != "function" ? (console.warn(`${c} | Ignoring invalid app registration.`, e), null) : {
    id: t,
    title: n,
    icon: r,
    premium: e.premium === !0,
    playerVisible: e.playerVisible !== !1,
    description: String(e.description ?? "").trim(),
    featureId: String(e.featureId ?? t).trim() || t,
    open: e.open
  };
}
function J(e) {
  const t = String((e == null ? void 0 : e.id) ?? "").trim();
  return !t || typeof (e == null ? void 0 : e.render) != "function" ? (console.warn(`${c} | Ignoring invalid launcher section registration.`, e), null) : {
    id: t,
    title: String(e.title ?? "").trim(),
    icon: String(e.icon ?? "").trim(),
    playerVisible: e.playerVisible !== !1,
    render: e.render,
    onClick: typeof e.onClick == "function" ? e.onClick : void 0
  };
}
function Q(e) {
  var t;
  return ((t = game.user) == null ? void 0 : t.isGM) === !0 ? !0 : m() ? !1 : e.playerVisible !== !1;
}
function X() {
  const e = [...b.values()].filter(Q);
  return e.length ? e.map((t) => {
    let n = "";
    try {
      n = String(t.render() ?? "");
    } catch (i) {
      console.error(`${c} | Launcher section "${t.id}" failed to render.`, i), n = "";
    }
    if (!n) return "";
    const r = t.title ? `<header class="holosuite-launcher-section-header">
          ${t.icon ? `<i class="${d(t.icon)}"></i>` : ""}
          <span>${d(t.title)}</span>
        </header>` : "";
    return `
      <section class="holosuite-launcher-section" data-holosuite-section="${d(t.id)}">
        ${r}
        <div class="holosuite-launcher-section-body">${n}</div>
      </section>
    `;
  }).join("") : "";
}
function Z(e) {
  var o;
  const t = ((o = game.user) == null ? void 0 : o.isGM) === !0;
  if (!t && m()) return;
  const n = () => f.openLauncher(), r = () => ({
    name: "holosuite-core-launcher",
    title: t ? "HoloSuite Command Deck" : "HoloSuite Player View",
    icon: "fa-solid fa-terminal",
    button: !0,
    visible: !0,
    onClick: n,
    onChange: n
  }), i = E(e, r(), ["tiles", "tile"]);
  E(e, r(), ["tokens", "token"], { allowFallback: !i });
}
function L() {
  document.querySelectorAll(".holosuite-sidebar-launcher, .holosuite-floating-launcher").forEach((e) => e.remove());
}
function G(e) {
  var r;
  if (e instanceof HTMLElement) return e;
  if (Array.isArray(e) && e[0] instanceof HTMLElement) return e[0];
  const t = e, n = ((r = t == null ? void 0 : t.get) == null ? void 0 : r.call(t, 0)) ?? (t == null ? void 0 : t[0]);
  return n instanceof HTMLElement ? n : null;
}
function ee(e) {
  var o;
  const t = ((o = game.user) == null ? void 0 : o.isGM) === !0;
  if (!t && m()) return;
  const n = G(e) ?? document.querySelector("#controls, #scene-controls");
  if (!n || n.querySelector("[data-tool='holosuite-core-launcher']")) return;
  const r = n.querySelector(
    ".control-tools.active, .sub-controls.active, .scene-control-tools.active, .control-tools, .sub-controls, .scene-control-tools"
  );
  if (!r) return;
  const i = document.createElement("li");
  i.className = "control-tool holosuite-scene-control", i.dataset.tool = "holosuite-core-launcher", i.title = t ? "HoloSuite Command Deck" : "HoloSuite Player View", i.innerHTML = '<i class="fa-solid fa-terminal"></i>', i.addEventListener("click", (a) => {
    a.preventDefault(), a.stopPropagation(), f.openLauncher();
  }), r.appendChild(i);
}
function te() {
  game.settings.register(c, N, {
    name: "HoloSuite Theme",
    hint: "Changes the shared color theme used by HoloSuite windows.",
    scope: "world",
    config: !0,
    type: String,
    choices: P,
    default: "default",
    restricted: !0,
    onChange: (e) => _(e)
  }), game.settings.register(c, D, {
    name: "Disable HoloSuite for Players",
    hint: "When enabled, the HoloSuite launcher and all apps are hidden from players.",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    restricted: !0
  }), game.settings.registerMenu(c, "launcher", {
    name: "HoloSuite Command Deck",
    label: "Open HoloSuite",
    hint: "Open the HoloSuite launcher and registered app deck.",
    icon: "fas fa-terminal",
    type: H,
    restricted: !0
  });
}
function ne() {
  var e;
  (e = game.keybindings) != null && e.register && game.keybindings.register(c, j, {
    name: "Open HoloSuite Command Deck",
    hint: "Toggles the HoloSuite launcher (GM command deck or player commlink).",
    editable: [
      { key: "Equal", modifiers: ["Alt"] },
      { key: "NumpadAdd", modifiers: ["Alt"] }
    ],
    restricted: !1,
    onDown: () => {
      var t;
      return ((t = game.user) == null ? void 0 : t.isGM) !== !0 && m() ? !1 : (s != null && s.rendered ? s.close() : f.openLauncher(), !0);
    }
  });
}
function re(e) {
  return Object.hasOwn(P, String(e)) ? String(e) : "default";
}
function _(e) {
  const t = re(e), n = [document.documentElement, document.body].filter(Boolean);
  for (const r of n)
    t === "default" ? r.removeAttribute("data-holosuite-theme") : r.setAttribute("data-holosuite-theme", t);
}
function oe() {
  _(v(c, N));
}
function m() {
  try {
    return game.settings.get(c, D) === !0;
  } catch {
    return !1;
  }
}
function I(e) {
  var t;
  return ((t = game.user) == null ? void 0 : t.isGM) === !0 ? !0 : m() ? !1 : e.playerVisible !== !1;
}
async function ie(e) {
  var n, r, i, o;
  const t = g.get(e);
  return t ? I(t) ? t.open() : ((o = (i = ui.notifications) == null ? void 0 : i.warn) == null || o.call(i, `${t.title} is not available from the player view.`), null) : ((r = (n = ui.notifications) == null ? void 0 : n.warn) == null || r.call(n, `HoloSuite app "${e}" is not registered.`), null);
}
function M() {
  var u;
  const e = ((u = game.user) == null ? void 0 : u.isGM) === !0, t = [...g.values()].filter(I).sort((l, S) => l.title.localeCompare(S.title)), n = e ? "GM Command Deck" : "Player Link", r = e ? "Apps" : "Commlink", i = e ? "No HoloSuite apps have registered yet." : "No player apps are available yet.", o = e ? "" : `
    <section class="holosuite-player-home">
      <div>
        <span class="holosuite-kicker">Active User</span>
        <strong>${d(K())}</strong>
      </div>
      <div class="holosuite-player-status">
        <span>LINK STABLE</span>
      </div>
    </section>
  `, a = t.length ? t.map((l) => {
    const S = l.title, B = e && l.description ? `<p>${d(l.description)}</p>` : "", T = e ? "" : Y(l.id);
    return `
        <button type="button" class="holosuite-app-tile" data-holosuite-app="${d(l.id)}">
          <span class="holosuite-app-icon"><i class="${d(l.icon)}"></i></span>
          <span class="holosuite-app-title">${d(S)}</span>
          ${B}
          ${T ? `<span class="holosuite-app-count">${d(T)}</span>` : ""}
        </button>
      `;
  }).join("") : `<p class="holosuite-empty">${d(i)}</p>`;
  return `
    <section class="holosuite-phone">
      <div class="holosuite-phone-shell">
        <header class="holosuite-status-bar">
          <span>HoloSuite</span>
        </header>
        <main class="holosuite-screen">
          <div class="holosuite-screen-heading">
            <div>
              <span class="holosuite-kicker">${d(n)}</span>
              <h2>${d(r)}</h2>
            </div>
          </div>
          ${o}
          <div class="holosuite-app-grid">
            ${a}
          </div>
          ${X()}
        </main>
        <footer class="holosuite-dock">
          <button type="button" data-holosuite-action="close" title="Close"><i class="fa-solid fa-circle-xmark"></i></button>
        </footer>
      </div>
    </section>
  `;
}
function O(e) {
  e && (e.querySelectorAll("[data-holosuite-app]").forEach((t) => {
    t.addEventListener("click", (n) => {
      ie(n.currentTarget.dataset.holosuiteApp ?? "");
    });
  }), e.querySelectorAll("[data-holosuite-section-item]").forEach((t) => {
    t.addEventListener("click", (n) => {
      var a, u;
      const r = n.currentTarget, i = (a = r.closest("[data-holosuite-section]")) == null ? void 0 : a.dataset.holosuiteSection, o = i ? b.get(i) : null;
      (u = o == null ? void 0 : o.onClick) == null || u.call(o, r.dataset.holosuiteSectionItem, n);
    });
  }), e.querySelectorAll("[data-holosuite-action='close']").forEach((t) => {
    t.addEventListener("click", () => s == null ? void 0 : s.close());
  }));
}
class H extends q {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "holosuite-launcher",
      title: "HoloSuite",
      classes: ["holosuite-launcher-window"],
      popOut: !0,
      resizable: !1,
      width: 420,
      height: "auto"
    });
  }
  async _renderInner() {
    return $(M());
  }
  activateListeners(t) {
    super.activateListeners(t), O(G(t));
  }
  async _renderHTML() {
    const t = document.createElement("template");
    return t.innerHTML = M().trim(), t.content;
  }
  _replaceHTML(t, n) {
    n.replaceChildren(t), O(n);
  }
  async close(t = {}) {
    return s = null, super.close(t);
  }
  async _updateObject() {
  }
}
A(H, "DEFAULT_OPTIONS", {
  id: "holosuite-launcher",
  tag: "section",
  classes: ["holosuite-launcher-window"],
  window: {
    title: "HoloSuite",
    resizable: !1
  },
  position: {
    width: 420,
    height: "auto"
  }
});
const f = {
  registerApp(e) {
    const t = W(e);
    return t ? (g.set(t.id, t), s == null || s.render(!1), t) : null;
  },
  unregisterApp(e) {
    const t = g.delete(String(e ?? ""));
    return t && (s == null || s.render(!1)), t;
  },
  getApps() {
    return [...g.values()];
  },
  registerLauncherSection(e) {
    const t = J(e);
    return t ? (b.set(t.id, t), s == null || s.render(!1), t) : null;
  },
  unregisterLauncherSection(e) {
    const t = b.delete(String(e ?? ""));
    return t && (s == null || s.render(!1)), t;
  },
  refreshLauncher() {
    s == null || s.render(!1);
  },
  async openLauncher() {
    return s || (s = new H()), await s.render(!0), s;
  }
};
function V() {
  const e = game.modules.get(c);
  if (game.holosuite = f, globalThis.HoloSuiteCoreApi = f, e)
    try {
      e.api = f;
    } catch (t) {
      console.warn(`${c} | Could not attach API to game.modules; using game.holosuite fallback.`, t);
    }
  Hooks.callAll(`${c}.apiReady`, f);
}
Hooks.once("init", () => {
  te(), ne(), V();
});
Hooks.on("getSceneControlButtons", Z);
Hooks.on("renderSceneControls", (e, t) => ee(t));
Hooks.on("renderSidebar", L);
Hooks.on("renderSidebarTab", L);
Hooks.once("ready", () => {
  V(), oe(), L(), console.log(`${c} | Ready. API available at game.modules.get("${c}").api`);
});
