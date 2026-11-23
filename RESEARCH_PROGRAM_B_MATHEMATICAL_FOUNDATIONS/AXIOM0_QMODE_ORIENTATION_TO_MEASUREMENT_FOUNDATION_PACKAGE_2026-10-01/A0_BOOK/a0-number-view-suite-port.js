(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.A0NumberViewSuitePort = api;
  if (typeof document !== "undefined") {
    const boot = () => document.querySelectorAll("[data-number-view-suite-port]").forEach(api.mount);
    document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", boot) : boot();
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const IDENTITY = "MOD:NUMBER_VIEW_SUITE";
  const STAGES = ["CARRIER", "POINT", "LINE", "SLICE", "GLUE", "TOPOLOGY", "RETURN"];
  const ROLES = {
    PRIME_CORE: {
      label: "Prime Core", code: "PRIME_BOUND_CORE",
      source: "PC1111 · n=1…1111", operator: "n−1=x+11y+121z",
      view: "Cube · Projection · Mirror Nodes", boundary: "Kein natürlicher Primzahlkörper.",
      href: "A0_PRIMECUBE_GAP_FOLD_LAB.html"
    },
    VIEW_ADAPTER: {
      label: "View Adapter", code: "CROSS_DOMAIN_VIEW_ADAPTER",
      source: "gebundener Quellrecord", operator: "Helix / RDMH display transform",
      view: "Einbettung · Torsion · Gegenansicht", boundary: "Die View-Grammatik ist nicht intrinsisch prime-only.",
      href: "A0_HELIX_VIEW_ADAPTER.html"
    },
    TYPE_BOUNDARY: {
      label: "Type Boundary", code: "TYPE_BOUNDARY_AUDIT",
      source: "CRT-Adresse + Root-Koordinate", operator: "typed comparison",
      view: "periodisches Gitter ↔ aperiodischer Maßstab", boundary: "Vergleich ist keine Identität.",
      href: "A0_CRT_ROOT_BOUNDARY_AUDIT.html"
    },
    ROOT_METRIC: {
      label: "Root Metric", code: "ROOT_METRIC_LENS",
      source: "k · √k · Δk", operator: "Δk=√(k+1)−√k",
      view: "Root Ruler · Shrinking intervals", boundary: "Metrik erzeugt den Primecube-Fold nicht.",
      href: "A0_ROOT_SHRINKING_1729_RETURN.html"
    },
    TOPOLOGY_ADAPTER: {
      label: "Topology Adapter", code: "POINT_LINE_GLUE_VIEW_ADAPTER",
      source: "adressierter Punkt / bestehender Record", operator: "Punkt→Linie→Schnitt→deklarierte Verklebung",
      view: "Cylinder · Möbius · Klein bottle als Displaytests", boundary: "Topologie gehört zur View; der Record erhält keine intrinsische Topologie.",
      href: "A0_BOUNDARY_GRAPH_DEMONSTRATOR.html#point-line-glue-topology-return"
    }
  };

  function primeAddress(n) {
    const value = Number(n);
    if (!Number.isInteger(value) || value < 1 || value > 1111) throw new RangeError("n must be an integer in 1…1111");
    const q = value - 1;
    const z = Math.floor(q / 121);
    const r = q % 121;
    const y = Math.floor(r / 11);
    const x = r % 11;
    return { n: value, x, y, z, address: `[${x},${y},${z}]`, returnId: `PC1111:N${String(value).padStart(4, "0")}` };
  }

  function inspect(roleKey, stageIndex, n) {
    const key = ROLES[roleKey] ? roleKey : "PRIME_CORE";
    const stage = Math.max(0, Math.min(STAGES.length - 1, Number(stageIndex) || 0));
    const address = primeAddress(n == null ? 661 : n);
    return { identity: IDENTITY, roleKey: key, role: ROLES[key], stageIndex: stage, stage: STAGES[stage], address, intrinsicTopology: false, graphDelta: 0 };
  }

  function diagram(state) {
    const nodes = STAGES.map((stage, i) => {
      const x = 55 + i * 92;
      const active = i === state.stageIndex;
      return `<g class="nvp-node${active ? " is-active" : ""}" transform="translate(${x} 72)"><circle r="17"/><text y="4">${i + 1}</text><text class="nvp-node-label" y="42">${stage}</text></g>`;
    }).join("");
    const address = state.address;
    const px = 105 + address.x * 18;
    const py = 230 - address.y * 12 - address.z * 5;
    return `<svg viewBox="0 0 680 300" role="img" aria-label="Typed Number View Suite return path"><path class="nvp-route" d="M72 72H607"/>${nodes}<g class="nvp-cube"><path d="M80 178h180v86H80zM126 142h180v86h-46M80 178l46-36m134 36 46-36m-46 122 46-36"/><circle cx="${px}" cy="${py}" r="7"/><text x="335" y="168">n=${address.n} · ${address.address}</text><text x="335" y="194">${state.role.code}</text><text x="335" y="220">${state.stage}: ${state.stage === "TOPOLOGY" ? "DISPLAY GLUE ONLY" : "TYPED RETURN ROUTE"}</text><text x="335" y="246">${address.returnId}</text></g></svg>`;
  }

  function mount(host) {
    let roleKey = host.dataset.defaultRole || "PRIME_CORE";
    let stageIndex = 0;
    let n = Number(host.dataset.defaultN || 661);
    const render = () => {
      const state = inspect(roleKey, stageIndex, n);
      host.querySelectorAll("[data-nvp-role]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.nvpRole === roleKey)));
      host.querySelectorAll("[data-nvp-stage]").forEach(b => b.setAttribute("aria-pressed", String(Number(b.dataset.nvpStage) === stageIndex)));
      const stage = host.querySelector("[data-nvp-diagram]"); if (stage) stage.innerHTML = diagram(state);
      const set = (name, value) => { const el = host.querySelector(`[data-nvp-${name}]`); if (el) el.textContent = value; };
      set("identity", state.identity); set("source", state.role.source); set("operator", state.role.operator);
      set("view", state.role.view); set("return", `${state.address.returnId} · ${state.address.address}`); set("boundary", state.role.boundary);
      set("status", `${state.stageIndex + 1}/7 · ${state.stage} · EXACT RECORD RETURN`);
      const link = host.querySelector("[data-nvp-link]"); if (link) { link.href = state.role.href; link.textContent = `${state.role.label} öffnen →`; }
      const input = host.querySelector("[data-nvp-number]"); if (input && Number(input.value) !== n) input.value = n;
    };
    host.querySelectorAll("[data-nvp-role]").forEach(b => b.addEventListener("click", () => { roleKey = b.dataset.nvpRole; stageIndex = 0; render(); }));
    host.querySelectorAll("[data-nvp-stage]").forEach(b => b.addEventListener("click", () => { stageIndex = Number(b.dataset.nvpStage); render(); }));
    host.querySelector("[data-nvp-number]")?.addEventListener("input", e => { const v = Number(e.target.value); if (Number.isInteger(v) && v >= 1 && v <= 1111) { n = v; render(); } });
    render();
  }

  return { IDENTITY, STAGES, ROLES, primeAddress, inspect, mount };
});
