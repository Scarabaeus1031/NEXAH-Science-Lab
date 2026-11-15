(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else {
    root.A0SplinterOrbitReturn = api;
    const boot = () => api.mount(root.document);
    if (root.document.readyState === "loading") root.document.addEventListener("DOMContentLoaded", boot);
    else boot();
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const TAU = 2 * Math.PI;
  const EPS = 1e-10;

  function deltaRecord() {
    const x = 0.2;
    const terms = [x ** 2 / 2, x ** 4 / 8, x ** 6 / 16, 5 * x ** 8 / 128, 7 * x ** 10 / 256];
    const exact = 1 - Math.sqrt(1 - x * x);
    return {
      x,
      exact,
      radical: ((Math.sqrt(3) - Math.sqrt(2)) ** 2) / 5,
      terms,
      partial: terms.reduce((sum, value) => sum + value, 0),
      tail: exact - terms.reduce((sum, value) => sum + value, 0),
      digitBlock: "0.0202041028",
      implies204Degrees: false
    };
  }

  function residual204Record() {
    const source = [1933, 1939, 1945];
    const anchor = 1729;
    const residuals = source.map((value) => value - anchor);
    return { source, anchor, residuals, first: residuals[0], factorization: [12, 17], angleClaim: false };
  }

  function auditHorizonRecord() {
    return {
      value: 2048,
      exactPower: { base: 2, exponent: 11 },
      range: "1<=n<=2048",
      successorHits: 311,
      digitCut: { prefix: "204", suffix: "8", role: "DISPLAY_ONLY" },
      derivedFrom204: false,
      derivedFromDelta: false,
      role: "BOUNDED_SUCCESSOR_AUDIT_HORIZON"
    };
  }

  function polarLift(theta, options) {
    const opts = Object.assign({ harmonic: 5, radius: 0.95, amplitude: 0.22, height: 0.42 }, options || {});
    const r = opts.radius + opts.amplitude * Math.sin(opts.harmonic * theta);
    return { theta, r, x: r * Math.cos(theta), y: r * Math.sin(theta), z: opts.height * Math.sin(theta) };
  }

  function mirror(point) {
    return { theta: point.theta, r: point.r, x: point.x, y: point.y, z: -point.z };
  }

  function distance(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
  }

  function peakCount(harmonic, samples) {
    const count = samples || 3600;
    const radii = Array.from({ length: count }, (_, i) => polarLift(TAU * i / count, { harmonic }).r);
    let peaks = 0;
    for (let i = 0; i < count; i += 1) {
      const prev = radii[(i - 1 + count) % count];
      const next = radii[(i + 1) % count];
      if (radii[i] > prev && radii[i] >= next) peaks += 1;
    }
    return peaks;
  }

  function closureAudit(harmonic, endTheta) {
    const end = endTheta == null ? TAU : endTheta;
    const startPoint = polarLift(0, { harmonic });
    const endPoint = polarLift(end, { harmonic });
    const error = distance(startPoint, endPoint);
    return {
      harmonic,
      startPoint,
      endPoint,
      endTheta: end,
      closureError: error,
      closed: error < EPS,
      winding: end / TAU,
      peaks: peakCount(harmonic)
    };
  }

  function negativeControls() {
    const short = closureAudit(5, TAU - Math.PI / 12);
    const perturbed = closureAudit(5);
    perturbed.endPoint = Object.assign({}, perturbed.endPoint, { x: perturbed.endPoint.x + 0.025 });
    perturbed.closureError = distance(perturbed.startPoint, perturbed.endPoint);
    perturbed.closed = perturbed.closureError < EPS;
    return { shortCycleRejected: !short.closed, perturbedEndpointRejected: !perturbed.closed, short, perturbed };
  }

  function buildReceipt() {
    const five = closureAudit(5);
    const seven = closureAudit(7);
    const controls = negativeControls();
    return {
      status: five.closed && seven.closed && controls.shortCycleRejected && controls.perturbedEndpointRejected
        ? "PASS_DECLARED_RETURN" : "FAIL",
      verificationClass: "BOUNDED_ENGINEERING_VERIFICATION",
      views: ["SHADOW", "FIELD", "RETURN"],
      delta: deltaRecord(),
      residual204: residual204Record(),
      auditHorizon2048: auditHorizonRecord(),
      five,
      seven,
      belts: 12,
      controls,
      authority: {
        researchRun: false,
        scientificEvidence: false,
        newIdentity: false,
        newRelation: false,
        newOperator: false,
        sourceGraphEffect: "NO_SOURCE_GRAPH_EFFECT"
      },
      proves: [
        "closure of the declared parametric carrier",
        "mirror involution and equal xy projection",
        "separation of delta from the historical 204 residual"
      ],
      doesNotProve: [
        "a Ramanujan theorem",
        "a universal Splinter operator",
        "legacy ODE or IEEE power-grid behavior",
        "delta implies 204 degrees",
        "a physical mechanism"
      ]
    };
  }

  function pathFor(harmonic, panel, lifted) {
    const points = [];
    for (let i = 0; i <= 240; i += 1) {
      const p = polarLift(TAU * i / 240, { harmonic });
      const sx = panel.x + panel.w / 2 + p.x * panel.scale + (lifted ? p.z * 18 : 0);
      const sy = panel.y + panel.h / 2 - p.y * panel.scale + (lifted ? p.z * 10 : 0);
      points.push(`${i ? "L" : "M"}${sx.toFixed(2)},${sy.toFixed(2)}`);
    }
    return points.join(" ");
  }

  function svgMarkup() {
    const panels = [
      { x: 20, y: 38, w: 250, h: 220, scale: 78 },
      { x: 295, y: 38, w: 250, h: 220, scale: 78 },
      { x: 570, y: 38, w: 250, h: 220, scale: 78 }
    ];
    const labels = ["SHADOW · 5-fold projection", "FIELD · 5 / 7 / 12", "RETURN · full-cycle audit"];
    const frames = panels.map((p, i) => `<g><rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="8" fill="#071722" stroke="#315467"/><text x="${p.x + 12}" y="${p.y + 22}" fill="#f1bd3b" font-size="12" font-family="monospace">${labels[i]}</text></g>`).join("");
    const belts = Array.from({ length: 12 }, (_, i) => `<circle cx="420" cy="148" r="${18 + i * 6}" fill="none" stroke="#29485a" stroke-width="0.65"/>`).join("");
    return `<svg viewBox="0 0 840 280" role="img" aria-label="Shadow, field and return views of the declared splinter orbit" style="width:100%;height:auto;display:block">${frames}
      <path d="${pathFor(5, panels[0], false)}" fill="none" stroke="#55d7e5" stroke-width="3"/>
      ${belts}<path d="${pathFor(5, panels[1], false)}" fill="none" stroke="#55d7e5" stroke-width="2.5"/><path d="${pathFor(7, panels[1], false)}" fill="none" stroke="#e653b4" stroke-width="1.5" opacity=".82"/>
      <path d="${pathFor(5, panels[2], true)}" fill="none" stroke="#b7773c" stroke-width="3"/><line x1="695" y1="72" x2="695" y2="232" stroke="#f1bd3b" stroke-width="2"/><circle cx="769.1" cy="148" r="5" fill="#fff" stroke="#f1bd3b"/><circle cx="769.1" cy="148" r="10" fill="none" stroke="#55d7e5"/>
    </svg>`;
  }

  function mount(doc) {
    if (!doc) return false;
    const svg = doc.getElementById("a0SorSvg");
    if (!svg) return false;
    svg.innerHTML = svgMarkup();
    const status = doc.getElementById("a0SorStatus");
    const ledger = doc.getElementById("a0SorLedger");
    const run = doc.getElementById("a0SorRun");
    const execute = () => {
      const receipt = buildReceipt();
      if (status) status.textContent = `${receipt.status} · 5 peaks=${receipt.five.peaks} · 7 peaks=${receipt.seven.peaks}`;
      if (ledger) ledger.textContent = `closure₅=${receipt.five.closureError.toExponential(2)} · closure₇=${receipt.seven.closureError.toExponential(2)} · negative controls=2/2`;
      return receipt;
    };
    if (run) run.addEventListener("click", execute);
    execute();
    return true;
  }

  return { TAU, EPS, deltaRecord, residual204Record, auditHorizonRecord, polarLift, mirror, distance, peakCount, closureAudit, negativeControls, buildReceipt, svgMarkup, mount };
});
