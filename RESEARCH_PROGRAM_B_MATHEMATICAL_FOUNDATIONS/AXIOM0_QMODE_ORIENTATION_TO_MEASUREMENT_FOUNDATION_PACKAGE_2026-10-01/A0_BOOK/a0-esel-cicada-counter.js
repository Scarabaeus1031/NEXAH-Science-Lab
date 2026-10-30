(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.A0EselCicadaCounter = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const DATA = Object.freeze({
    schema: "nexah.a0.esel-cicada-counter/1",
    identityReuse: ["A0_WORKBENCH", "MOD:NUMBER_VIEW_SUITE"],
    newCanonicalIds: [],
    relationChanges: [],
    hinge: Object.freeze({ E: 5, S: 19, L: 12, ES: 14, EL: 7, ratio: "2:1", pairES: 24, pairEL: 17, pairGap: 7 }),
    mobius: Object.freeze([
      { n: 11, factors: "11", mu: -1 },
      { n: 121, factors: "11²", mu: 0 },
      { n: 331, factors: "331", mu: -1 },
      { n: 3310, factors: "2·5·331", mu: -1 },
      { n: 3301, factors: "3301", mu: -1 }
    ]),
    carriers: Object.freeze({
      decimalAppend: "331 × 10 = 3310",
      reversal: "rev₁₀(1033) = 3301",
      verdict: "3301 ≠ 3310"
    }),
    tokens: Object.freeze([
      { label: "CI|KA|DA", sums: [12, 12, 5], total: 29, verdict: "OWNER TOKEN · NOT DERIVED FROM 3310" },
      { label: "HARM|O|NICA", sums: [40, 15, 27], total: 82, verdict: "OWNER TOKEN · MAPPING UNDECLARED" }
    ]),
    claimCeiling: "Exact arithmetic and bounded display only; no acoustic, biological, or lexical identity established."
  });

  function verify() {
    const h = DATA.hinge;
    const checks = [
      h.ES === Math.abs(h.S - h.E), h.EL === Math.abs(h.L - h.E), h.ES / h.EL === 2,
      h.pairES === h.E + h.S, h.pairEL === h.E + h.L, h.pairES - h.pairEL === 7,
      331 * 10 === 3310, Number(String(1033).split("").reverse().join("")) === 3301,
      3301 !== 3310, DATA.mobius.find(x => x.n === 121).mu === 0,
      DATA.mobius.find(x => x.n === 3310).mu === -1,
      DATA.tokens[0].sums.reduce((a, b) => a + b, 0) === 29,
      DATA.tokens[1].sums.reduce((a, b) => a + b, 0) === 82,
      DATA.newCanonicalIds.length === 0, DATA.relationChanges.length === 0
    ];
    return { pass: checks.every(Boolean), passed: checks.filter(Boolean).length, total: checks.length };
  }

  const esc = value => String(value).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const text = (x, y, value, cls) => `<text x="${x}" y="${y}" class="${cls || "ehc-label"}">${esc(value)}</text>`;
  const line = (x1, y1, x2, y2, cls) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls || "ehc-line"}"/>`;
  const node = (x, y, label, sub, cls) => `<g class="ehc-node ${cls || ""}"><circle cx="${x}" cy="${y}" r="28"/>${text(x, y + 4, label, "ehc-node-label")}${sub ? text(x, y + 48, sub, "ehc-small") : ""}</g>`;

  function renderHinge() {
    return [
      text(24, 30, "E–HINGE · TWO ARMS / ONE EXACT COUNTERWEIGHT", "ehc-title"),
      line(380, 70, 380, 315, "ehc-axis"), line(380, 190, 135, 88), line(380, 190, 625, 122),
      node(380, 190, "E", "5 · HINGE", "is-hinge"), node(135, 88, "S", "19"), node(625, 122, "L", "12"),
      text(205, 112, "|S−E| = 14", "ehc-value"), text(512, 142, "|L−E| = 7", "ehc-value"),
      text(380, 286, "14 : 7 = 2 : 1", "ehc-verdict"), text(380, 310, "ADDRESS RATIO · ACOUSTIC IDENTITY HOLD", "ehc-small")
    ].join("");
  }

  function renderMobius() {
    const xs = [80, 225, 370, 515, 660];
    return [text(24, 30, "μ COUNTER · SQUARE-FREE SIGN / REPEATED-PRIME ZERO", "ehc-title")].concat(DATA.mobius.map((m, i) => {
      const cls = m.mu === 0 ? "is-zero" : "is-negative";
      return `${node(xs[i], 154, String(m.n), m.factors, cls)}${text(xs[i], 236, `μ = ${m.mu}`, "ehc-verdict")}`;
    })).concat(text(380, 310, "ONLY 121 = 11² HITS μ = 0 · APPENDED DECIMAL 0 DOES NOT", "ehc-small")).join("");
  }

  function renderTokens() {
    const rows = DATA.tokens.map((t, row) => {
      const y = 104 + row * 128;
      const cells = t.sums.map((v, i) => `${node(310 + i * 105, y, String(v), t.label.split("|")[i], "is-token")}${i < 2 ? line(338 + i * 105, y, 387 + i * 105, y, "ehc-token-line") : ""}`).join("");
      return `${text(55, y + 4, t.label, "ehc-token-title")}${cells}${text(680, y + 4, `Σ ${t.total}`, "ehc-value")}${text(310, y + 72, t.verdict, "ehc-small")}`;
    }).join("");
    return text(24, 30, "TOKEN LANES · SEGMENT SUMS ARE CONTROLS, NOT IDENTITIES", "ehc-title") + rows;
  }

  function renderCarriers() {
    return [
      text(24, 30, "CARRIERS · SAME DIGITS DO NOT MEAN SAME OPERATION", "ehc-title"),
      node(145, 148, "1033", "SOURCE"), line(180, 148, 315, 148, "ehc-reverse"), node(350, 148, "3301", "REVERSAL"),
      node(500, 148, "331", "PRIME"), line(535, 148, 625, 148, "ehc-append"), node(660, 148, "3310", "×10"),
      text(247, 105, "rev₁₀", "ehc-value"), text(580, 105, "append 0", "ehc-value"),
      text(380, 255, "3301 ≠ 3310", "ehc-verdict"),
      text(380, 287, "CI|KA|DA LABEL IS OWNER-SUPPLIED · NOT A NUMBER DERIVATION", "ehc-small")
    ].join("");
  }

  const RENDERERS = { hinge: renderHinge, mobius: renderMobius, tokens: renderTokens, carriers: renderCarriers };
  const OUTPUTS = {
    hinge: "PASS · E=5 is the hinge: 14 and 7 form an exact 2:1 address ratio. Acoustic octave remains HOLD.",
    mobius: "PASS · μ(11)=−1, μ(331)=−1, μ(3310)=−1; μ(121)=0 is the repeated-prime control.",
    tokens: "HOLD · CI|KA|DA → 12|12|5 and HARM|O|NICA → 40|15|27 under A1Z26, but neither spelling derives the carrier number.",
    carriers: "PASS · 3301 is the decimal reversal of 1033; 3310 is 331×10. They are different carriers."
  };

  function mount(host) {
    if (!host) return false;
    const stage = host.querySelector("[data-ehc-stage]");
    const output = host.querySelector("[data-ehc-output]");
    const buttons = Array.from(host.querySelectorAll("[data-ehc-view]"));
    function setView(name) {
      if (!RENDERERS[name]) name = "hinge";
      stage.innerHTML = RENDERERS[name]();
      output.textContent = OUTPUTS[name];
      buttons.forEach(b => b.setAttribute("aria-pressed", String(b.dataset.ehcView === name)));
    }
    buttons.forEach(b => b.addEventListener("click", () => setView(b.dataset.ehcView)));
    setView("hinge");
    return true;
  }

  if (typeof document !== "undefined") {
    const boot = () => mount(document.getElementById("eselCicadaCounter"));
    document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", boot, { once: true }) : boot();
  }
  return { DATA, verify, mount, renderHinge, renderMobius, renderTokens, renderCarriers };
});
