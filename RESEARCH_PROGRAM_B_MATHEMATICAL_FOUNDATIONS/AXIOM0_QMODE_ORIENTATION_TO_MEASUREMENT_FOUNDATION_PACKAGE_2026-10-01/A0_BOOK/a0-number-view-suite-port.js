(function (root, factory) {
  const api = factory(root);
  if (typeof module === "object" && module.exports) module.exports = api;
  root.A0NumberViewSuitePort = api;
  if (typeof document !== "undefined") {
    const boot = () => document.querySelectorAll("[data-number-view-suite-port]").forEach(api.mount);
    document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", boot) : boot();
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function (root) {
  "use strict";

  const IDENTITY = "MOD:NUMBER_VIEW_SUITE";
  const STAGES = ["CARRIER", "POINT", "LINE", "SLICE", "GLUE", "TOPOLOGY", "RETURN"];
  const STAGE_ACTIONS = [
    "SOURCE RETAINED", "POINT MARKED", "LINE EXTENDED", "SLICE OPENED",
    "GLUE DECLARED", "VIEW TOPOLOGY APPLIED", "EXACT RECORD RETURN"
  ];
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
    return { identity: IDENTITY, roleKey: key, role: ROLES[key], stageIndex: stage, stage: STAGES[stage], action: STAGE_ACTIONS[stage], address, intrinsicTopology: false, graphDelta: 0 };
  }

  function compareHelix(address, helixRecord, cubeModel) {
    const cubeReturn = cubeModel.cubeNumber(address);
    if (!helixRecord) return { cubeReturn, helix: null };

    const { residue7, residue11 } = helixRecord;
    const period = 7 * 11;
    // 22 = 1 mod 7 and 0 mod 11. 56 has the opposite residues.
    const residue77 = cubeModel.mod(22 * residue7 + 56 * residue11, period);
    const band = Math.floor(address.n / period);
    const helixReturn = residue77 + period * band;
    const exact = cubeReturn === address.n && helixReturn === address.n
      && helixRecord.sourceIds[0] === address.returnId;
    return { cubeReturn, helix: { residue7, residue11, residue77, band, helixReturn, exact } };
  }

  function traceIndices(stageIndex) {
    const stage = Math.max(0, Math.min(STAGES.length - 1, Number(stageIndex) || 0));
    return Array.from({ length: stage + 1 }, (_, index) => index);
  }

  const MOTION = [
    { x: 0, y: 0, angle: 0 },
    { x: 42, y: -24, angle: -3 },
    { x: 88, y: -12, angle: 2 },
    { x: 126, y: 18, angle: -4 },
    { x: 92, y: 43, angle: 3 },
    { x: 38, y: 34, angle: -2 },
    { x: 0, y: 0, angle: 0 }
  ];

  function motionForStage(stageIndex) {
    const stage = Math.max(0, Math.min(STAGES.length - 1, Number(stageIndex) || 0));
    return { ...MOTION[stage] };
  }

  function diagram(state, visitedInput) {
    const visited = new Set(Array.isArray(visitedInput) ? visitedInput : traceIndices(state.stageIndex));
    const nodes = STAGES.map((stage, i) => {
      const x = 55 + i * 92;
      const active = i === state.stageIndex;
      const seen = visited.has(i);
      return `<g class="nvp-node${seen ? " is-visited" : ""}${active ? " is-active" : ""}" transform="translate(${x} 72)"><circle r="17"/><text y="4">${i + 1}</text><text class="nvp-node-label" y="42">${stage}</text></g>`;
    }).join("");
    const route = STAGES.slice(0, -1).map((_, i) => `<path class="nvp-route-segment${visited.has(i + 1) ? " is-visited" : ""}" d="M${72 + i * 92} 72H${130 + i * 92}"/>`).join("");
    const address = state.address;
    const px = 105 + address.x * 18;
    const py = 230 - address.y * 12 - address.z * 5;
    const pointX = px + 55;
    const pointY = py - 28;
    const motion = motionForStage(state.stageIndex);
    const motionTransform = `translate(${motion.x} ${motion.y}) rotate(${motion.angle} 193 205)`;
    const motionTrace = [...visited].sort((a, b) => a - b).map(index => {
      const item = motionForStage(index);
      return `${193 + item.x},${205 + item.y}`;
    }).join(" ");
    const artifacts = [
      visited.has(1) ? `<g class="nvp-artifact nvp-artifact-point"><circle cx="${px}" cy="${py}" r="8"/><text x="${px + 12}" y="${py - 10}">P</text></g>` : "",
      visited.has(2) ? `<g class="nvp-artifact nvp-artifact-line"><path d="M${px} ${py}L${pointX + 46} ${pointY - 20}"/><circle cx="${pointX + 46}" cy="${pointY - 20}" r="4"/><text x="${pointX + 51}" y="${pointY - 25}">L</text></g>` : "",
      visited.has(3) ? `<g class="nvp-artifact nvp-artifact-slice"><path d="M${px - 30} ${py + 20}l98 -50 62 30 -98 50z"/><text x="${px + 71}" y="${py + 33}">Σ</text></g>` : "",
      visited.has(4) ? `<g class="nvp-artifact nvp-artifact-glue"><path d="M${px - 19} ${py + 13}Q${px + 39} ${py + 73} ${px + 98} ${py + 10}"/><path d="M${px + 2} ${py - 10}Q${px + 49} ${py - 67} ${px + 112} ${py - 12}"/><text x="${px + 46}" y="${py + 61}">GLUE</text></g>` : "",
      visited.has(5) ? `<g class="nvp-artifact nvp-artifact-topology"><path d="M${px + 23} ${py + 8}c30 -46 92 -43 108 0c12 33 -18 55 -51 33c-27 -18 -9 -52 28 -42"/><text x="${px + 103}" y="${py + 51}">VIEW</text></g>` : "",
      visited.has(6) ? `<g class="nvp-artifact nvp-artifact-return"><path d="M${px + 126} ${py + 24}C${px + 165} ${py + 88} ${px - 69} ${py + 94} ${px} ${py + 8}"/><text x="${px - 37}" y="${py + 83}">RETURN</text></g>` : ""
    ].join("");
    const trace = STAGES.map((stage, i) => `<text class="nvp-trace-label${visited.has(i) ? " is-visited" : ""}" x="${55 + i * 92}" y="288">${i + 1}</text>`).join("");
    return `<svg viewBox="0 0 680 310" role="img" aria-label="Typed Number View Suite return path with retained stage trace and moving view body"><defs><filter id="nvpGlow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><path class="nvp-route" d="M72 72H607"/>${route}${nodes}<polyline class="nvp-motion-trace" points="${motionTrace}"/><circle class="nvp-origin-halo" cx="${px}" cy="${py}" r="16"/><circle class="nvp-origin" cx="${px}" cy="${py}" r="5"/><text class="nvp-origin-label" x="${px + 13}" y="${py - 15}">SOURCE ${address.n} · LOCKED</text><g class="nvp-cube nvp-cube-moving" transform="${motionTransform}"><path d="M80 178h180v86H80zM126 142h180v86h-46M80 178l46-36m134 36 46-36m-46 122 46-36"/><circle class="nvp-source-point" cx="${px}" cy="${py}" r="7"/>${artifacts}</g><g class="nvp-readout"><text x="360" y="168">SOURCE n=${address.n} · ${address.address}</text><text x="360" y="194">VIEW BODY Δ(${motion.x},${motion.y}) · ${motion.angle}°</text><text x="360" y="220">${state.stage}: ${state.action}</text><text x="360" y="246">RETURN ${address.returnId}</text></g><g class="nvp-trace-rail"><path d="M55 282H607"/>${trace}</g></svg>`;
  }

  function mount(host) {
    let roleKey = host.dataset.defaultRole || "PRIME_CORE";
    let stageIndex = 0;
    let n = Number(host.dataset.defaultN || 661);
    let visited = new Set([0]);
    let playTimer = null;
    let tickCount = 0;
    let completedCycles = 0;
    const playButton = host.querySelector("[data-nvp-play]");
    const helixLink = host.querySelector("[data-nvp-helix-link]");
    const cubeModel = root.A0PrimecubeModel;
    const helixModel = root.A0HelixViewAdapter;
    const helixRecords = helixLink && cubeModel && helixModel
      ? new Map(helixModel.primeResidueRecords().map(record => [record.prime, record]))
      : null;
    if (helixRecords && root.location?.hash === "#primecube-helix-return") {
      const sourceId = new URLSearchParams(root.location.search).get("helix");
      const linkedRecord = [...helixRecords.values()].find(record => record.sourceIds[0] === sourceId);
      if (linkedRecord) n = linkedRecord.prime;
    }
    const stopPlayback = (finished) => {
      if (playTimer) clearInterval(playTimer);
      playTimer = null;
      host.classList.remove("is-playing");
      if (playButton) {
        playButton.setAttribute("aria-pressed", "false");
        playButton.textContent = finished ? "↻ NOCH EINMAL" : "▶ PLAY SEQUENCE";
      }
    };
    const render = () => {
      const state = inspect(roleKey, stageIndex, n);
      host.querySelectorAll("[data-nvp-role]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.nvpRole === roleKey)));
      host.querySelectorAll("[data-nvp-stage]").forEach(b => b.setAttribute("aria-pressed", String(Number(b.dataset.nvpStage) === stageIndex)));
      const stage = host.querySelector("[data-nvp-diagram]"); if (stage) stage.innerHTML = diagram(state, [...visited]);
      const set = (name, value) => { const el = host.querySelector(`[data-nvp-${name}]`); if (el) el.textContent = value; };
      set("identity", state.identity); set("source", state.role.source); set("operator", state.role.operator);
      set("view", state.role.view); set("return", `${state.address.returnId} · ${state.address.address}`); set("boundary", state.role.boundary);
      set("locked-source", `SOURCE ${state.address.n} · LOCKED`);
      if (helixRecords) {
        const { cubeReturn, helix } = compareHelix(state.address, helixRecords.get(n), cubeModel);
        set("cube-address", `(x, y, z) = ${state.address.address}`);
        set("cube-return", String(cubeReturn));
        set("helix-residues", helix
          ? `${helix.residue7} mod 7 · ${helix.residue11} mod 11`
          : "Außerhalb des gemeinsamen Primzahlträgers bis 1000");
        set("helix-return", helix
          ? `${helix.residue77} + 77 × ${helix.band} = ${helix.helixReturn} · ${helix.exact ? "EXAKT" : "ABWEICHUNG"}`
          : "—");
        helixLink.hidden = !helix;
        if (helix) helixLink.href = `A0_HELIX_VIEW_ADAPTER.html?helix=${encodeURIComponent(state.address.returnId)}#helix-prime-record`;
      }
      set("status", `${state.stageIndex + 1}/7 · ${state.stage} · TRACE ${visited.size}/7`);
      set("cycle", `PHASE ${state.stageIndex + 1}/7 · t=${tickCount} · CYCLE ${completedCycles}`);
      set("trace", `SPUR ${[...visited].sort((a, b) => a - b).map(i => i + 1).join("→")} · ${state.action}`);
      const link = host.querySelector("[data-nvp-link]"); if (link) { link.href = state.role.href; link.textContent = `${state.role.label} öffnen →`; }
      const input = host.querySelector("[data-nvp-number]"); if (input && Number(input.value) !== n) input.value = n;
    };
    const resetTrace = (resetClock = false) => { stageIndex = 0; visited = new Set([0]); if (resetClock) { tickCount = 0; completedCycles = 0; } };
    const startPlayback = () => {
      if (playTimer) { stopPlayback(false); return; }
      if (stageIndex >= STAGES.length - 1) resetTrace();
      host.classList.add("is-playing");
      if (playButton) { playButton.setAttribute("aria-pressed", "true"); playButton.textContent = "Ⅱ PAUSE"; }
      render();
      playTimer = setInterval(() => {
        stageIndex += 1;
        tickCount += 1;
        visited.add(stageIndex);
        if (stageIndex >= STAGES.length - 1) completedCycles += 1;
        render();
        if (stageIndex >= STAGES.length - 1) stopPlayback(true);
      }, 820);
    };
    host.querySelectorAll("[data-nvp-role]").forEach(b => b.addEventListener("click", () => { stopPlayback(false); roleKey = b.dataset.nvpRole; resetTrace(); render(); }));
    host.querySelectorAll("[data-nvp-stage]").forEach(b => b.addEventListener("click", () => { stopPlayback(false); stageIndex = Number(b.dataset.nvpStage); tickCount += 1; traceIndices(stageIndex).forEach(i => visited.add(i)); render(); }));
    playButton?.addEventListener("click", startPlayback);
    host.querySelector("[data-nvp-clear]")?.addEventListener("click", () => { stopPlayback(false); resetTrace(true); render(); });
    host.querySelector("[data-nvp-number]")?.addEventListener("input", e => { const v = Number(e.target.value); if (Number.isInteger(v) && v >= 1 && v <= 1111) { stopPlayback(false); n = v; resetTrace(true); render(); } });
    render();
  }

  return { IDENTITY, STAGES, STAGE_ACTIONS, ROLES, MOTION, primeAddress, inspect, compareHelix, traceIndices, motionForStage, diagram, mount };
});
