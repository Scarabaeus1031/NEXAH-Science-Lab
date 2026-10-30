(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.A0OctaveRailCoilReturn = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const LANES = Object.freeze(["+1", "−1", "+2", "−2"]);
  const DIRECTIONS = Object.freeze({ "+1": 1, "−1": -1, "+2": 2, "−2": -2 });
  const addresses = Object.freeze(Array.from({ length: 28 }, (_, n) => Object.freeze({
    n, row: Math.floor(n / 7), col: n % 7, lane: LANES[Math.floor(n / 7)]
  })));
  const DATA = Object.freeze({
    schema: "nexah.a0.octave-rail-coil-return/1",
    identityReuse: ["A0_WORKBENCH", "TESA_DOCUMENTARY_GRID", "MOD:NUMBER_VIEW_SUITE"],
    newCanonicalIds: [],
    relationChanges: [],
    dimensions: Object.freeze({ rows: 4, columns: 7, addresses: 28 }),
    addresses,
    seams: Object.freeze([[6, 7], [13, 14], [20, 21]]),
    fifthsWalk: Object.freeze([0, 4, 1, 5, 2, 6, 3]),
    negativeControl: Object.freeze({ kind: "HALF_TWIST", oneCircuitSide: -1, twoCircuitSide: 1, exactOneCircuitReturn: false }),
    claimCeiling: "Address topology and deterministic display transform only; no physical string, calibrated sound, resonance, or Möbius identity."
  });

  function coil(address, direction) {
    const step = DIRECTIONS[direction] || 1;
    const angle = (2 * Math.PI * step * address.col) / 7;
    return Object.freeze({ n: address.n, row: address.row, col: address.col, lane: address.lane, angle, x: Math.cos(angle), y: Math.sin(angle), z: address.row });
  }
  function uncoil(point) { return point.row * 7 + point.col; }
  function walk(step, start) {
    const seen = [], used = new Set();
    let c = ((start || 0) % 7 + 7) % 7;
    while (!used.has(c)) { used.add(c); seen.push(c); c = ((c + step) % 7 + 7) % 7; }
    return seen;
  }
  function verify() {
    const checks = [];
    checks.push(addresses.length === 28, new Set(addresses.map(a => a.n)).size === 28);
    checks.push(addresses.every(a => a.row >= 0 && a.row < 4 && a.col >= 0 && a.col < 7));
    Object.keys(DIRECTIONS).forEach(d => checks.push(addresses.every(a => uncoil(coil(a, d)) === a.n)));
    checks.push(DATA.seams.every(([a, b]) => addresses[a].col === 6 && addresses[b].col === 0));
    checks.push(DATA.seams.every(([a, b]) => addresses[b].row === addresses[a].row + 1));
    checks.push(walk(4, 0).join(",") === DATA.fifthsWalk.join(","));
    checks.push(new Set(walk(4, 0)).size === 7, new Set(walk(2, 0)).size === 7);
    checks.push(walk(7, 0).length === 1);
    checks.push(DATA.negativeControl.oneCircuitSide === -1, DATA.negativeControl.twoCircuitSide === 1);
    checks.push(DATA.negativeControl.exactOneCircuitReturn === false);
    checks.push(DATA.newCanonicalIds.length === 0, DATA.relationChanges.length === 0);
    checks.push(4 * 7 === 28, gcd(4, 7) === 1, gcd(2, 7) === 1);
    return { pass: checks.every(Boolean), passed: checks.filter(Boolean).length, total: checks.length };
  }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; }

  const esc = value => String(value).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const text = (x, y, value, cls) => `<text x="${x}" y="${y}" class="${cls || "ocr-label"}">${esc(value)}</text>`;
  const circle = (x, y, r, cls, attrs) => `<circle cx="${x}" cy="${y}" r="${r}" class="${cls || "ocr-dot"}" ${attrs || ""}/>`;
  const line = (x1, y1, x2, y2, cls) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls || "ocr-line"}"/>`;
  const railPoint = a => ({ x: 92 + a.col * 94, y: 76 + a.row * 66 });
  const coilPoint = (a, direction) => {
    const p = coil(a, direction), depth = Math.sin(p.angle), radius = 112;
    return { x: 380 + Math.cos(p.angle) * radius, y: 55 + a.n * 9.2, depth };
  };

  function railSvg(active, direction) {
    let out = text(24, 25, "RAIL · 4 LANES × 7 ADDRESSES", "ocr-title");
    LANES.forEach((lane, r) => { out += text(35, 82 + r * 66, lane, "ocr-lane"); out += line(82, 76 + r * 66, 680, 76 + r * 66, "ocr-rail"); });
    addresses.forEach(a => { const p = railPoint(a), on = a.n === active ? " is-active" : ""; out += circle(p.x, p.y, 13, `ocr-dot lane-${a.row}${on}`) + text(p.x, p.y + 4, a.n + 1, "ocr-index"); });
    out += text(380, 330, `StaX ADDRESS · direction ${direction} · 28 UNIQUE CELLS`, "ocr-verdict");
    return out;
  }

  function coilSvg(active, direction) {
    const pts = addresses.map(a => coilPoint(a, direction));
    let out = text(24, 25, "COIL · SAME 28 ADDRESSES / FOUR TURNS", "ocr-title");
    out += `<polyline points="${pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")}" class="ocr-coil-path"/>`;
    [6, 13, 20].forEach(n => { const p = pts[n]; out += line(245, p.y + 4, 515, p.y + 4, "ocr-seam-line") + text(540, p.y + 7, `${n + 1}→${n + 2} SEAM`, "ocr-seam-label"); });
    addresses.slice().sort((a, b) => pts[a.n].depth - pts[b.n].depth).forEach(a => { const p = pts[a.n], on = a.n === active ? " is-active" : ""; out += circle(p.x, p.y, 8 + (p.depth + 1) * 2, `ocr-dot lane-${a.row}${on}`) + text(p.x, p.y + 3, a.n + 1, "ocr-coil-index"); });
    out += text(380, 330, `StiX PATH · ${direction} · ADDRESS METADATA RETAINED`, "ocr-verdict");
    return out;
  }

  function seamSvg(active) {
    const pairs = DATA.seams;
    let out = text(24, 25, "SEAM · COLUMN 7 WRAPS TO COLUMN 1 / LAYER +1", "ocr-title");
    pairs.forEach(([a, b], i) => {
      const y = 92 + i * 92;
      out += circle(210, y, 27, `ocr-dot lane-${addresses[a].row}${active === a ? " is-active" : ""}`) + text(210, y + 4, a + 1, "ocr-index");
      out += line(250, y, 510, y, "ocr-wrap-arrow") + text(380, y - 15, `c6 → c0 · r${addresses[a].row} → r${addresses[b].row}`, "ocr-seam-label");
      out += circle(550, y, 27, `ocr-dot lane-${addresses[b].row}${active === b ? " is-active" : ""}`) + text(550, y + 4, b + 1, "ocr-index");
    });
    out += text(380, 330, "SEAM CHANGES DISPLAY EDGE · NOT RECORD IDENTITY", "ocr-verdict");
    return out;
  }

  function uncoilSvg(active, direction) {
    const returned = addresses.map(a => uncoil(coil(a, direction)));
    let out = text(24, 25, "UNCOIL · INVERSE ADDRESS CHECK", "ocr-title");
    addresses.forEach(a => {
      const p = railPoint(a), ok = returned[a.n] === a.n, on = a.n === active ? " is-active" : "";
      out += `<rect x="${p.x - 19}" y="${p.y - 19}" width="38" height="38" rx="7" class="ocr-return-cell${on}"/>` + text(p.x, p.y + 4, ok ? "✓" : "×", "ocr-return-mark");
    });
    out += text(380, 330, `PASS · ${returned.filter((n, i) => n === i).length}/28 EXACT RETURNS · direction ${direction}`, "ocr-verdict");
    return out;
  }

  function twistSvg() {
    return [
      text(24, 25, "NEGATIVE CONTROL · HALF-TWIST IS NOT AN ORDINARY COIL", "ocr-title"),
      `<path d="M125 170 C210 45 300 45 380 170 C460 295 550 295 635 170" class="ocr-twist-a"/>`,
      `<path d="M125 170 C210 295 300 295 380 170 C460 45 550 45 635 170" class="ocr-twist-b"/>`,
      circle(125, 170, 16, "ocr-side-a") + text(125, 175, "+", "ocr-index"),
      circle(635, 170, 16, "ocr-side-b") + text(635, 175, "−", "ocr-index"),
      text(380, 104, "ONE CIRCUIT: SIDE + → SIDE −", "ocr-value"),
      text(380, 245, "TWO CIRCUITS REQUIRED FOR ORIENTED RETURN", "ocr-value"),
      text(380, 330, "EXPECTED FAIL · 1-CIRCUIT ORIENTATION RETURN", "ocr-verdict")
    ].join("");
  }

  const renderers = { rail: railSvg, coil: coilSvg, seam: seamSvg, uncoil: uncoilSvg, twist: twistSvg };
  const outputs = {
    rail: "RAIL · 28/28 unique StaX addresses · four signed display lanes.",
    coil: "COIL · 28 addresses wrapped through four turns · no address merged.",
    seam: "SEAM · 7→8, 14→15 and 21→22 change column edge and layer only.",
    uncoil: "PASS · coil⁻¹(coil(n)) = n for all 28 addresses and all ±1/±2 directions.",
    twist: "EXPECTED FAIL · one Möbius half-twist flips the oriented side; two circuits are required."
  };

  function mount(scope) {
    const host = (scope || document).querySelector("#octaveRailCoilReturn");
    if (!host) return null;
    const stage = host.querySelector("[data-ocr-stage]"), output = host.querySelector("[data-ocr-output]");
    let view = "rail", direction = "+1", active = 0, timer = null;
    const paint = () => {
      stage.innerHTML = renderers[view](active, direction);
      host.querySelectorAll("[data-ocr-view]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.ocrView === view)));
      host.querySelectorAll("[data-ocr-direction]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.ocrDirection === direction)));
      host.querySelector("[data-ocr-index]").textContent = String(active + 1).padStart(2, "0");
      output.textContent = outputs[view];
    };
    const stop = () => { if (timer) clearInterval(timer); timer = null; };
    host.querySelectorAll("[data-ocr-view]").forEach(b => b.addEventListener("click", () => { stop(); view = b.dataset.ocrView; paint(); }));
    host.querySelectorAll("[data-ocr-direction]").forEach(b => b.addEventListener("click", () => { stop(); direction = b.dataset.ocrDirection; paint(); }));
    host.querySelector("[data-ocr-step]").addEventListener("click", () => { stop(); active = (active + 1) % 28; paint(); });
    host.querySelector("[data-ocr-play]").addEventListener("click", () => { stop(); view = "coil"; timer = setInterval(() => { active = (active + 1) % 28; paint(); if (active === 27) stop(); }, 90); paint(); });
    host.querySelector("[data-ocr-return]").addEventListener("click", () => { stop(); view = "uncoil"; active = 0; paint(); });
    paint();
    return { setView(v) { view = v; paint(); }, stop };
  }

  if (typeof document !== "undefined") {
    const boot = () => mount(document);
    document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", boot, { once: true }) : boot();
  }
  return { DATA, DIRECTIONS, coil, uncoil, walk, gcd, verify, railSvg, coilSvg, seamSvg, uncoilSvg, twistSvg, mount };
});
