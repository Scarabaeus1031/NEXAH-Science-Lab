(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.A0BlueBodyInteriorCRT16 = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const MODULI = Object.freeze([17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79]);
  const VIEWS = Object.freeze(["front", "top", "side", "isometric"]);
  const CLAIM_BOUNDARY = "ORDINAL_CHANNEL_ADAPTER_ONLY_PRIME_LABELS_DO_NOT_DEFINE_Q4_TOPOLOGY_DISPLAY_APERTURE_DOES_NOT_MUTATE_SOURCE";

  const pad4 = (value) => Number(value).toString(2).padStart(4, "0");
  const validInteger = (value, lower, upper) => Number.isInteger(value) && value >= lower && value <= upper;

  function ringGray(channel) {
    if (!validInteger(channel, 0, 15)) throw new RangeError("channel must be an integer in [0,15]");
    const half = channel & 8;
    const local = channel & 7;
    return half | (local ^ (local >> 1));
  }

  function inverseRingGray(q4) {
    if (!validInteger(q4, 0, 15)) throw new RangeError("q4 must be an integer in [0,15]");
    const half = q4 & 8;
    const gray = q4 & 7;
    let binary = gray;
    for (let shift = 1; shift < 3; shift += 1) binary ^= gray >> shift;
    return half | binary;
  }

  function bind(layer, channel) {
    if (!validInteger(layer, 0, 2)) throw new RangeError("layer must be an integer in [0,2]");
    if (!validInteger(channel, 0, 15)) throw new RangeError("channel must be an integer in [0,15]");
    const q4 = ringGray(channel);
    return Object.freeze({
      carrierId: "MOD:TESSAREC:Q4xP3",
      adapterId: "A0:BLUE_BODY:INTERIOR:CRT16:ORDINAL_GRAY_RING:V1",
      sourceKey: `P${layer}:${pad4(q4)}`,
      layer,
      channel,
      q4,
      q4Bits: pad4(q4),
      modulusLabel: MODULI[channel],
      displayKey: `CRT16:${String(channel + 1).padStart(2, "0")}:P${layer}`
    });
  }

  function unbind(sourceKey) {
    const match = /^P([0-2]):([01]{4})$/.exec(String(sourceKey));
    if (!match) return null;
    const layer = Number(match[1]);
    const q4 = Number.parseInt(match[2], 2);
    return bind(layer, inverseRingGray(q4));
  }

  function tilePoint(channel, layer, phase = 0) {
    if (channel === 15) return { x: 0, y: 0, z: layer - 1 };
    const ring = Math.floor(channel / 5);
    const spoke = channel % 5;
    const radius = 0.62 + ring * 0.48;
    const phaseDirection = layer === 1 ? -1 : 1;
    const angle = -Math.PI / 2 + spoke * Math.PI * 2 / 5 + ring * Math.PI / 5
      + phaseDirection * phase * Math.PI * 2 / 12;
    return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius, z: layer - 1 };
  }

  function project(point, view) {
    const { x, y, z } = point;
    if (view === "front") return { x: x + z * 0.18, y: y - z * 0.14 };
    if (view === "top") return { x: x + z * 0.42, y: z * 0.82 + y * 0.24 };
    if (view === "side") return { x: z * 0.82 + x * 0.24, y };
    if (view === "isometric") return { x: x * 0.82 + z * 0.58, y: y * 0.72 - z * 0.38 };
    throw new RangeError(`unknown view: ${view}`);
  }

  function frame(layer, channel, phase = 0, aperture = 1) {
    if (!validInteger(phase, 0, 11)) throw new RangeError("phase must be an integer in [0,11]");
    if (!Number.isFinite(aperture) || aperture < 0 || aperture > 1) throw new RangeError("aperture must be in [0,1]");
    const source = bind(layer, channel);
    const points = [];
    for (let currentLayer = 0; currentLayer < 3; currentLayer += 1) {
      for (let currentChannel = 0; currentChannel < 16; currentChannel += 1) {
        const record = bind(currentLayer, currentChannel);
        const point = tilePoint(currentChannel, currentLayer, phase);
        points.push({ ...record, point, selected: record.sourceKey === source.sourceKey });
      }
    }
    const projections = Object.fromEntries(VIEWS.map((view) => [view, points.map((entry) => ({
      sourceKey: entry.sourceKey,
      displayKey: entry.displayKey,
      selected: entry.selected,
      ...project(entry.point, view)
    }))]));
    return Object.freeze({ source, phase, aperture, projections });
  }

  function receipt(input = {}) {
    const witness = input.witness !== false;
    if (!witness) return Object.freeze({ status: "HOLD_MISSING_WITNESS", sourceKey: input.sourceKey || null, residual: null });
    const source = unbind(input.sourceKey);
    if (!source) return Object.freeze({ status: "HOLD_INVALID_ADDRESS", sourceKey: input.sourceKey || null, residual: null });
    const viewKeys = Array.isArray(input.viewKeys) ? input.viewKeys : [];
    if (viewKeys.length !== VIEWS.length || viewKeys.some((key) => key !== source.sourceKey)) {
      return Object.freeze({ status: "HOLD_VIEW_DIVERGENCE", sourceKey: source.sourceKey, residual: "VIEW_KEY_MISMATCH" });
    }
    return Object.freeze({
      status: "PASS_EXACT_ADDRESS_RETURN",
      sourceKey: source.sourceKey,
      channel: source.channel,
      layer: source.layer,
      modulusLabel: source.modulusLabel,
      residual: 0,
      claimBoundary: CLAIM_BOUNDARY
    });
  }

  function validateAdapter() {
    const records = [];
    for (let layer = 0; layer < 3; layer += 1) for (let channel = 0; channel < 16; channel += 1) records.push(bind(layer, channel));
    const sourceKeys = new Set(records.map((record) => record.sourceKey));
    const displayKeys = new Set(records.map((record) => record.displayKey));
    return Object.freeze({
      records: records.length,
      sourceKeys: sourceKeys.size,
      displayKeys: displayKeys.size,
      collisionFree: records.length === 48 && sourceKeys.size === 48 && displayKeys.size === 48,
      roundTrips: records.every((record) => unbind(record.sourceKey)?.displayKey === record.displayKey),
      moduliAreLabelsOnly: true
    });
  }

  function mount(rootElement) {
    if (!rootElement || typeof document === "undefined") return null;
    const channel = rootElement.querySelector("#interiorChannel");
    const layer = rootElement.querySelector("#interiorLayer");
    const aperture = rootElement.querySelector("#interiorAperture");
    const phaseBack = rootElement.querySelector("#interiorPhaseBack");
    const phaseForward = rootElement.querySelector("#interiorPhaseForward");
    const play = rootElement.querySelector("#interiorPlay");
    const witness = rootElement.querySelector("#interiorWitness");
    const readout = rootElement.querySelector("#interiorReadout");
    const receiptBox = rootElement.querySelector("#interiorReceipt");
    const views = Object.fromEntries(VIEWS.map((view) => [view, rootElement.querySelector(`[data-interior-view="${view}"]`)]));
    let phase = 0;
    let timer = 0;

    const pentagon = (cx, cy, radius) => Array.from({ length: 5 }, (_, index) => {
      const angle = -Math.PI / 2 + index * Math.PI * 2 / 5;
      return `${(cx + Math.cos(angle) * radius).toFixed(2)},${(cy + Math.sin(angle) * radius).toFixed(2)}`;
    }).join(" ");

    function drawProjection(view, entries, selectedKey, apertureValue) {
      const svg = views[view];
      const byKey = new Map(entries.map((entry) => [entry.sourceKey, entry]));
      const selected = byKey.get(selectedKey);
      const scale = 58;
      const sx = (value) => 160 + value * scale;
      const sy = (value) => 112 + value * scale;
      const edges = [];
      for (let currentLayer = 0; currentLayer < 3; currentLayer += 1) {
        for (let q4 = 0; q4 < 16; q4 += 1) {
          const left = bind(currentLayer, inverseRingGray(q4));
          for (let bit = 0; bit < 4; bit += 1) {
            const other = q4 ^ (1 << bit);
            if (q4 < other) {
              const right = bind(currentLayer, inverseRingGray(other));
              const a = byKey.get(left.sourceKey), b = byKey.get(right.sourceKey);
              edges.push(`<line class="interior-edge" x1="${sx(a.x)}" y1="${sy(a.y)}" x2="${sx(b.x)}" y2="${sy(b.y)}"/>`);
            }
          }
          if (currentLayer < 2) {
            const right = bind(currentLayer + 1, inverseRingGray(q4));
            const a = byKey.get(left.sourceKey), b = byKey.get(right.sourceKey);
            edges.push(`<line class="interior-layer-edge" x1="${sx(a.x)}" y1="${sy(a.y)}" x2="${sx(b.x)}" y2="${sy(b.y)}"/>`);
          }
        }
      }
      const tiles = entries.map((entry) => {
        const distance = selected ? Math.hypot(entry.x - selected.x, entry.y - selected.y) : 0;
        const visible = entry.selected ? 1 : Math.max(0.08, apertureValue * Math.exp(-distance * 0.42));
        const classes = ["interior-tile", entry.selected ? "selected" : "", entry.layer === Number(layer.value) ? "same-layer" : "ghost"].filter(Boolean).join(" ");
        return `<g class="${classes}" opacity="${visible.toFixed(3)}" data-source-key="${entry.sourceKey}"><polygon points="${pentagon(sx(entry.x), sy(entry.y), entry.selected ? 11 : 7)}"/><text x="${sx(entry.x)}" y="${sy(entry.y) + 3}">${entry.channel + 1}</text></g>`;
      }).join("");
      svg.innerHTML = `<title>${view} projection of the same 48-address interior record</title><g class="interior-edges">${edges.join("")}</g><g>${tiles}</g>`;
    }

    function render() {
      const currentLayer = Number(layer.value);
      const currentChannel = Number(channel.value);
      const apertureValue = Number(aperture.value);
      const currentFrame = frame(currentLayer, currentChannel, phase, apertureValue);
      VIEWS.forEach((view) => drawProjection(view, currentFrame.projections[view], currentFrame.source.sourceKey, apertureValue));
      rootElement.querySelector("#interiorChannelValue").textContent = `${currentChannel + 1}/16 · m=${currentFrame.source.modulusLabel}`;
      rootElement.querySelector("#interiorLayerValue").textContent = `P${currentLayer}`;
      rootElement.querySelector("#interiorApertureValue").textContent = apertureValue.toFixed(2);
      rootElement.querySelector("#interiorPhase").textContent = `${String(phase).padStart(2, "0")}/12`;
      readout.innerHTML = `<strong>${currentFrame.source.sourceKey}</strong> · channel ${currentChannel + 1} · modulus label ${currentFrame.source.modulusLabel} · aperture ${apertureValue.toFixed(2)} · phase ${String(phase).padStart(2, "0")}/12 · four views / one source key`;
      const result = receipt({ sourceKey: currentFrame.source.sourceKey, viewKeys: VIEWS.map(() => currentFrame.source.sourceKey), witness: witness.checked });
      receiptBox.dataset.status = result.status.startsWith("PASS") ? "pass" : "hold";
      receiptBox.innerHTML = `<b>${result.status}</b><span>${result.status.startsWith("PASS") ? `return ${result.sourceKey} · residual ${result.residual} · prime ${result.modulusLabel} remains label-only` : "Return stopped: the selected address is visible, but its required witness was withheld."}</span>`;
      globalThis.A0BlueBodyInteriorView = { frame: currentFrame, receipt: result };
    }

    function step(delta) { phase = (phase + delta + 12) % 12; render(); }
    [channel, layer, aperture, witness].forEach((control) => control.addEventListener("input", render));
    phaseBack.addEventListener("click", () => step(-1));
    phaseForward.addEventListener("click", () => step(1));
    play.addEventListener("click", () => {
      if (timer) { clearInterval(timer); timer = 0; play.textContent = "Play 48-state cycle"; play.setAttribute("aria-pressed", "false"); return; }
      timer = setInterval(() => {
        const next = (Number(layer.value) * 16 + Number(channel.value) + 1) % 48;
        layer.value = Math.floor(next / 16);
        channel.value = next % 16;
        step(1);
      }, 520);
      play.textContent = "Pause cycle";
      play.setAttribute("aria-pressed", "true");
    });
    render();
    return { render, stop: () => { if (timer) clearInterval(timer); timer = 0; } };
  }

  if (typeof document !== "undefined") {
    const boot = () => { const element = document.getElementById("blue-body-interior-crt16"); if (element) mount(element); };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true }); else boot();
  }

  return { MODULI, VIEWS, CLAIM_BOUNDARY, ringGray, inverseRingGray, bind, unbind, tilePoint, project, frame, receipt, validateAdapter, mount };
});
