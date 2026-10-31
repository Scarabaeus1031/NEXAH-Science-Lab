(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.A0AcousticSourceProjection = api;
  if (typeof document !== "undefined") {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => api.mount(document));
    else api.mount(document);
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const NOTE_NAMES = Object.freeze(["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"]);
  const RAIL_COUNT = 24;
  const mod = (value, modulus) => ((value % modulus) + modulus) % modulus;
  const pitchClass = railIndex => mod(railIndex, 12);
  const noteName = railIndex => NOTE_NAMES[pitchClass(railIndex)];
  const railPoint = (railIndex, count = RAIL_COUNT) => ({x: railIndex / (count - 1), y: 1});
  const fanPoint = (railIndex, t = 1, count = RAIL_COUNT) => {
    const end = railPoint(railIndex, count);
    return {x: 0.5 + t * (end.x - 0.5), y: t};
  };
  const recoverFanAddress = (point, count = RAIL_COUNT, tolerance = 1e-9) => {
    if (!point || Math.abs(point.y) <= tolerance) return {status: "AMBIGUOUS_APEX", railIndex: null, error: null};
    const endpointX = 0.5 + (point.x - 0.5) / point.y;
    const railIndex = Math.round(endpointX * (count - 1));
    if (railIndex < 0 || railIndex >= count) return {status: "OUTSIDE_RAIL", railIndex: null, error: null};
    const expected = railPoint(railIndex, count).x;
    const error = Math.abs(endpointX - expected);
    return {status: error <= tolerance ? "EXACT" : "OFF_RAY", railIndex, error};
  };
  const fifthOrbit = (seed = 0) => Array.from({length: 12}, (_, step) => mod(seed + 7 * step, 12));
  const tritonePartner = value => mod(value + 6, 12);
  const fanTopology = (count = RAIL_COUNT, closed = false) => ({
    carrier: closed ? `C${count}` : `P${count}`,
    lineStates: count,
    innerPassages: count - 1,
    returnSeams: closed ? 1 : 0,
    totalPassages: count - 1 + (closed ? 1 : 0),
    endpoints: closed ? 0 : 2,
    graphEuler: count - (count - 1 + (closed ? 1 : 0)),
    cycleRank: (count - 1 + (closed ? 1 : 0)) - count + 1,
    degreeProfile: closed ? Array(count).fill(2) : [1, ...Array(Math.max(0, count - 2)).fill(2), 1]
  });
  const walkerStep = (railIndex, closed = false, count = RAIL_COUNT) => {
    if (!Number.isInteger(railIndex) || railIndex < 0 || railIndex >= count) return {status: "INVALID_ADDRESS", from: railIndex, to: null, passage: null};
    if (railIndex < count - 1) return {status: "INNER_PASSAGE", from: railIndex, to: railIndex + 1, passage: `${railIndex}→${railIndex + 1}`};
    if (closed) return {status: "RETURN_SEAM", from: railIndex, to: 0, passage: `${railIndex}→0`};
    return {status: "OPEN_STOP", from: railIndex, to: null, passage: null};
  };
  const walkerTrace = (closed = false, count = RAIL_COUNT) => {
    const trace = [];
    for (let index = 0; index < count; index += 1) trace.push(walkerStep(index, closed, count));
    return trace;
  };

  function phase4Carrier(railIndex, options = {}) {
    const source = railPoint(railIndex);
    const boundary = fanPoint(railIndex, options.t ?? 1);
    return {
      schema: "nexah.a0.acoustic-carrier/1.0.0",
      sourceAddress: `rail:${String(railIndex).padStart(2, "0")}`,
      railIndex,
      pitchClass: pitchClass(railIndex),
      note: noteName(railIndex),
      frequencyHz: options.frequencyHz ?? null,
      geometry: options.geometry ?? "UNDECLARED",
      sourcePoint: source,
      boundaryPoint: boundary,
      receiverPoint: options.receiverPoint ?? null,
      materialProfile: options.materialProfile ?? null,
      projectionWitness: {map: "CENTRAL_FAN_V1", t: options.t ?? 1, recoverable: (options.t ?? 1) > 0},
      phase4Status: "READY_FOR_DECLARED_INPUTS",
      authority: {measuredAcoustics: false, physicalMechanism: false, publication: false}
    };
  }

  const model = Object.freeze({
    schema: "nexah.a0.acoustic-source-projection/1.0.0",
    scope: "F-A0-26_EXTENSION_PHASES_1_TO_3",
    rail: {count: RAIL_COUNT, pitchClasses: 12, octaves: 2, map: "pitchClass = railIndex mod 12"},
    fifths: {map: "q -> q + 7 mod 12", orbit: fifthOrbit(0)},
    lyra: {map: "p_i(t) = apex + t(rail_i-apex)", apex: {x: 0.5, y: 0}, identityAtApex: false},
    conDaoExtension: {
      open: fanTopology(RAIL_COUNT, false),
      closed: fanTopology(RAIL_COUNT, true),
      localReading: "23 inner passages + 1 typed return seam",
      existingCarrierCrosswalk: "METHOD_GRAMMAR_ONLY / NON_IDENTITY_WITH_NEXAH:CON_DAO_BREATH:V1"
    },
    sourceClasses: ["FORMALIZATION_CORE", "PROVENANCE_CONTEXT", "HYPOTHESIS_ONLY", "HELD_BACKGROUND"],
    claimBoundary: "Finite address and projection test only; no measured resonance, material law, room response or shared physical mechanism."
  });

  const svg = (mode, selected, closed = false) => {
    const W = 960, H = 390, x0 = 55, x1 = 905, top = 78, bottom = 320;
    if (mode === "fifths") {
      const cx = 480, cy = 195, radius = 132;
      const orbit = fifthOrbit(selected);
      const pts = orbit.map((value, index) => {
        const angle = -Math.PI / 2 + index * 2 * Math.PI / 12;
        return {value, x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle)};
      });
      return `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="#285766" stroke-width="2"/>${pts.map((p, i) => {
        const next = pts[(i + 1) % pts.length];
        return `<line x1="${p.x}" y1="${p.y}" x2="${next.x}" y2="${next.y}" stroke="#5fe4ed" stroke-width="2" opacity=".65"/><circle cx="${p.x}" cy="${p.y}" r="${i === 0 ? 12 : 8}" fill="${i === 0 ? "#ffd45f" : "#0d303b"}" stroke="#ec68b7" stroke-width="2"/><text x="${p.x}" y="${p.y + 4}" text-anchor="middle" fill="#e9f4f5" font-size="12">${NOTE_NAMES[p.value]}</text>`;
      }).join("")}<text x="480" y="365" text-anchor="middle" fill="#9fb7be">separate map · +7 mod 12 · complete 12-class orbit</text>`;
    }
    const points = Array.from({length: RAIL_COUNT}, (_, i) => ({i, x: x0 + (x1 - x0) * i / (RAIL_COUNT - 1)}));
    if (mode === "lyra" || mode === "con-dao") {
      const apexX = (x0 + x1) / 2;
      const activeGap = mode === "con-dao" && selected < RAIL_COUNT - 1
        ? `<path d="M ${apexX} ${bottom} L ${points[selected].x} ${top} L ${points[selected + 1].x} ${top} Z" fill="#ec68b7" opacity=".28"/>`
        : "";
      const seam = mode === "con-dao" && closed
        ? `<path d="M ${x1} ${top} Q ${apexX} 10 ${x0} ${top}" fill="none" stroke="${selected === RAIL_COUNT - 1 ? "#ec68b7" : "#ffd45f"}" stroke-width="${selected === RAIL_COUNT - 1 ? 7 : 3}" stroke-dasharray="9 7"/><text x="${apexX}" y="28" text-anchor="middle" fill="#ffd45f">RETURN SEAM · 23→0</text>`
        : "";
      const caption = mode === "con-dao"
        ? (closed ? "DAO · C24 · 23+1 passages · cycle rank 1 · no endpoints" : "CON · P24 · 23 passages · cycle rank 0 · two endpoints")
        : "shared apex = identity collision unless rail address is retained";
      return `${activeGap}<line x1="${x0}" y1="${top}" x2="${x1}" y2="${top}" stroke="#ffd45f" stroke-width="3"/>${seam}${points.map(p => `<line x1="${apexX}" y1="${bottom}" x2="${p.x}" y2="${top}" stroke="${p.i === selected ? "#ec68b7" : "#5fe4ed"}" stroke-width="${p.i === selected ? 5 : 1.25}" opacity="${p.i === selected ? 1 : .38}"/><circle cx="${p.x}" cy="${top}" r="${p.i === selected ? 7 : 3}" fill="${p.i === selected ? "#ffd45f" : "#64e4b4"}"/>`).join("")}<circle cx="${apexX}" cy="${bottom}" r="9" fill="#ec68b7"/><text x="${apexX}" y="${bottom + 30}" text-anchor="middle" fill="#9fb7be">${caption}</text>`;
    }
    return `<line x1="${x0}" y1="${bottom}" x2="${x1}" y2="${bottom}" stroke="#285766" stroke-width="3"/>${points.map(p => `<line x1="${p.x}" y1="${bottom - (p.i % 12 === 1 || p.i % 12 === 3 || p.i % 12 === 6 || p.i % 12 === 8 || p.i % 12 === 10 ? 115 : 72)}" x2="${p.x}" y2="${bottom}" stroke="${p.i === selected ? "#ffd45f" : (pitchClass(p.i) === 6 ? "#ff7e78" : pitchClass(p.i) === 0 || pitchClass(p.i) === 7 ? "#5fe4ed" : "#9fb7be")}" stroke-width="${p.i === selected ? 7 : 3}"/><text x="${p.x}" y="${bottom + 24}" text-anchor="middle" fill="#e9f4f5" font-size="11">${NOTE_NAMES[pitchClass(p.i)]}</text>`).join("")}<text x="480" y="365" text-anchor="middle" fill="#9fb7be">24 addresses · 12 pitch classes · class repeats after +12</text>`;
  };

  function mount(doc) {
    const root = doc.querySelector("[data-acoustic-source-projection]");
    if (!root) return;
    let mode = "rail", selected = 0, closed = false;
    const canvas = root.querySelector("[data-projection-canvas]");
    const address = root.querySelector("[data-projection-address]");
    const note = root.querySelector("[data-projection-note]");
    const status = root.querySelector("[data-projection-status]");
    const slider = root.querySelector("[data-projection-index]");
    const topologyToggle = root.querySelector("[data-topology-toggle]");
    const paint = () => {
      canvas.innerHTML = svg(mode, selected, closed);
      address.textContent = `rail:${String(selected).padStart(2, "0")}`;
      const step = walkerStep(selected, closed);
      note.textContent = mode === "con-dao" ? `${noteName(selected)} · ${step.status} · ${step.passage ?? "kein weiterer innerer Schritt"}` : `${noteName(selected)} · pitch class ${pitchClass(selected)} · tritone ${NOTE_NAMES[tritonePartner(pitchClass(selected))]}`;
      status.textContent = mode === "con-dao" ? (closed ? "DAO · 24 PASSAGES · 23+1 RETURN" : "CON · 23 PASSAGES · OPEN STOP") : mode === "lyra" ? "EXACT OFF APEX · APEX AMBIGUOUS" : mode === "fifths" ? "12-CLASS ORBIT · RETURN AFTER 12" : "24→12 QUOTIENT · +12 REPEATS CLASS";
      slider.value = selected;
      root.querySelectorAll("[data-projection-mode]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.projectionMode === mode)));
      topologyToggle.disabled = mode !== "con-dao";
      topologyToggle.setAttribute("aria-pressed", String(closed));
      topologyToggle.textContent = closed ? "DAO lösen · öffnen" : "CON schließen · +1";
    };
    root.querySelectorAll("[data-projection-mode]").forEach(button => button.addEventListener("click", () => { mode = button.dataset.projectionMode; paint(); }));
    topologyToggle.addEventListener("click", () => { closed = !closed; paint(); });
    slider.addEventListener("input", () => { selected = Number(slider.value); paint(); });
    paint();
  }

  return {NOTE_NAMES, RAIL_COUNT, model, mod, pitchClass, noteName, railPoint, fanPoint, recoverFanAddress, fifthOrbit, tritonePartner, fanTopology, walkerStep, walkerTrace, phase4Carrier, svg, mount};
});
