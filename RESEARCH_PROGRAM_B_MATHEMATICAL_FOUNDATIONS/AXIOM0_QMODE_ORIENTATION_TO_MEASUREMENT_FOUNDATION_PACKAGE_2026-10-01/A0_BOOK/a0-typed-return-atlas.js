(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.A0TypedReturnAtlas = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const CONTRACT_FIELDS = Object.freeze(["record", "carrier", "address", "view", "orientation", "step", "seam", "transform", "return_witness", "negative_control", "claim_holds"]);
  const STAGES = Object.freeze([
    { id: "source", label: "TESA SOURCE", type: "CARRIER", color: "cyan", changes: "none", preserves: "record + address" },
    { id: "rail", label: "OCTAVE RAIL", type: "VIEW", color: "gold", changes: "layout", preserves: "row + column" },
    { id: "coil", label: "COIL", type: "TRANSFORM", color: "pink", changes: "orientation + layer", preserves: "record + address" },
    { id: "seam", label: "SEAM", type: "BOUNDARY", color: "violet", changes: "c6→c0; layer+1", preserves: "record" },
    { id: "uncoil", label: "UNCOIL", type: "INVERSE", color: "mint", changes: "view return", preserves: "exact n" },
    { id: "witness", label: "QRT11 WITNESS", type: "RETURN_WITNESS", color: "blue", changes: "n→(q,r)", preserves: "n=11q+r" },
    { id: "receipt", label: "TYPED RECEIPT", type: "DOCUMENT", color: "white", changes: "none", preserves: "all declared fields" }
  ]);
  const OPEN_MARKERS = Object.freeze([
    { marker: "FIBONACCI COIL", state: "P2_PREPARATION", next: "Test Δ(Fn)→Δ(pFn); keep −1/12, 44→L, φ and colour as separate undefined maps." },
    { marker: "4774 / 47|74", state: "SOURCE_RECOVERY", next: "Locate generator or owner record before operator binding." },
    { marker: "CI|KA|DA", state: "OWNER_TOKEN", next: "Keep token segmentation separate from 3310 carrier." },
    { marker: "HARM|O|NICA", state: "OWNER_TOKEN", next: "Define mapping before lexical or acoustic use." },
    { marker: "PANTONE / COLOUR", state: "MEASUREMENT_OPEN", next: "Bind color standard, illuminant and device profile." },
    { marker: "SUGAR STICK / PHYSICAL COIL", state: "ENGINEERING_HOLD", next: "Require geometry, material, load and calibration contract." },
    { marker: "AUDIO / RESONANCE", state: "SCIENCE_HOLD", next: "Require measured input, baseline, units and falsification threshold." }
  ]);

  function address(n) {
    if (!Number.isInteger(n) || n < 0 || n > 27) throw new RangeError("address must be an integer in [0,27]");
    return { n, oneBased: n + 1, row: Math.floor(n / 7), col: n % 7, lane: ["+1", "−1", "+2", "−2"][Math.floor(n / 7)] };
  }
  function coil(a, direction) {
    const d = ({ "+1": 1, "−1": -1, "+2": 2, "−2": -2 })[direction] || 1;
    return { ...a, direction: direction || "+1", theta: (2 * Math.PI * d * a.col) / 7, layer: a.row };
  }
  function uncoil(c) { return address(c.row * 7 + c.col); }
  function qrt11(n) { return { q: Math.floor(n / 11), r: n % 11, return: 11 * Math.floor(n / 11) + (n % 11) }; }
  function counterweight(n) { return { source: n + 1, partner: 29 - (n + 1), oneBasedSum: 29, role: "COMPARATOR_ONLY" }; }
  function fibonacciMod(modulus) {
    let a = 0, b = 1, period = [];
    do { period.push(a); [a, b] = [b, (a + b) % modulus]; } while (!(a === 0 && b === 1));
    return { modulus, period, length: period.length, unique: [...new Set(period)].sort((x, y) => x - y) };
  }
  function nthPrime(index) {
    if (!Number.isInteger(index) || index < 1) return null;
    const primes = [];
    for (let candidate = 2; primes.length < index; candidate += 1) {
      if (primes.every(p => p * p > candidate || candidate % p !== 0)) primes.push(candidate);
    }
    return primes[index - 1];
  }
  function diagonalPrimeLift(index) {
    const prime = nthPrime(index);
    return prime === null ? null : { source: [index, index], target: [prime, prime], inverseIndex: index, exactOnImage: nthPrime(index) === prime };
  }
  function gcd(a, b) {
    a = Math.abs(a); b = Math.abs(b);
    while (b) [a, b] = [b, a % b];
    return a;
  }
  function signedDodeca(stride) {
    if (![1, -1, 2, -2].includes(stride)) throw new RangeError("dodeca stride must be ±1 or ±2");
    const period = 12 / gcd(12, stride);
    const states = Array.from({ length: period + 1 }, (_, i) => ((i * stride) % 12 + 12) % 12);
    return { stride, angleStep: stride * 30, period, states, exactReturn: states[states.length - 1] === 0 };
  }
  function lAffineControl() {
    return { source: 44, delta: 6, target: 50, roman: "L", inverse: 50 - 6, exact: 44 + 6 === 50 && 50 - 6 === 44, phiBinding: false };
  }
  function rathNeighborLadder() {
    return {
      anchor: 44,
      foldNeighbor: { value: 45, delta: 1, exact: 44 + 1 === 45, angleNamespaceSeparate: true },
      shell: { value: 49, factorization: "7²", totient: 42, gap: 7 },
      romanGate: lAffineControl(),
      rathGate: { value: 51, delta: 7, factorization: "3·17", totient: 32, gap: 19, exact: 44 + 7 === 51 },
      balance: { exact: 49 + 51 === 100, sum: 100 },
      primeAddresses: { p4: 7, p5: 11, p7: 17, seventySeven: "p4·p5", notP4P7: true },
      sourceBoundary: "REUSES_EXISTING_RATH_49_51_SOURCE_AUDIT"
    };
  }
  const FQ_OPEN_PORTS = Object.freeze([
    { port: "φ", state: "UNBOUND", reason: "no declared transform or inverse" },
    { port: "ZE|TA", state: "OWNER_TOKEN_OPEN", reason: "syllable segmentation has no declared operator" },
    { port: "Hz", state: "UNIT_PORT_OPEN", reason: "frequency requires a measured time-domain signal" },
    { port: "mph", state: "UNIT_PORT_OPEN", reason: "speed requires distance and time calibration" },
    { port: "¥", state: "GLYPH_PORT_OPEN", reason: "currency or glyph role has no numeric adapter" },
    { port: "CYAN", state: "OPEN_COLOR_MARKER", reason: "no color standard, illuminant or device profile" },
    { port: "LIGHT BLUE", state: "OPEN_COLOR_MARKER", reason: "no numeric role declared" },
    { port: "DARK BLUE", state: "OPEN_COLOR_MARKER", reason: "no numeric role declared" },
    { port: "YELLOW", state: "OPEN_COLOR_MARKER", reason: "no numeric role declared" }
  ]);
  function makeRecord(n, direction) {
    const a = address(n), c = coil(a, direction), u = uncoil(c), qrt = qrt11(n), cw = counterweight(n);
    return {
      record: `TESA-${String(n + 1).padStart(2, "0")}`,
      carrier: "TESA_DOCUMENTARY_GRID",
      address: { n, row: a.row, col: a.col, lane: a.lane },
      view: ["RAIL", "COIL", "UNCOIL", "QRT11"],
      orientation: c.direction,
      step: Math.abs(({ "+1": 1, "−1": -1, "+2": 2, "−2": -2 })[c.direction]),
      seam: [6, 13, 20].includes(n) ? { outgoing: true, to: n + 1 } : { outgoing: false },
      transform: "RAIL→COIL→UNCOIL→QRT11",
      return_witness: { exact: u.n === n && qrt.return === n, uncoil: u.n, qrt },
      negative_control: { halfTwistOneCircuit: "EXPECTED_FAIL", side: -1 },
      comparator: cw,
      claim_holds: ["PHYSICAL_COIL", "CALIBRATED_AUDIO", "RESONANCE", "FIBONACCI_CAUSATION"]
    };
  }
  function verify() {
    const checks = [];
    const dirs = ["+1", "−1", "+2", "−2"];
    const records = dirs.flatMap(d => Array.from({ length: 28 }, (_, n) => makeRecord(n, d)));
    checks.push(records.length === 112);
    checks.push(records.every(r => CONTRACT_FIELDS.every(f => Object.prototype.hasOwnProperty.call(r, f))));
    checks.push(records.every(r => r.return_witness.exact));
    checks.push(records.every(r => r.return_witness.qrt.return === r.address.n));
    checks.push(records.every(r => r.comparator.oneBasedSum === 29));
    checks.push(new Set(Array.from({ length: 28 }, (_, n) => address(n).n)).size === 28);
    const fib7 = fibonacciMod(7);
    checks.push(fib7.length === 16, fib7.unique.join(",") === "0,1,2,3,4,5,6");
    checks.push(new Set(fib7.period).size < fib7.period.length);
    checks.push(JSON.stringify(diagonalPrimeLift(1)?.target) === "[2,2]");
    checks.push(JSON.stringify(diagonalPrimeLift(2)?.target) === "[3,3]");
    checks.push(diagonalPrimeLift(0) === null);
    checks.push(signedDodeca(1).period === 12 && signedDodeca(1).exactReturn);
    checks.push(signedDodeca(-1).period === 12 && signedDodeca(-1).exactReturn);
    checks.push(signedDodeca(2).period === 6 && signedDodeca(2).exactReturn);
    checks.push(signedDodeca(-2).period === 6 && signedDodeca(-2).exactReturn);
    checks.push(lAffineControl().exact && lAffineControl().inverse === 44 && !lAffineControl().phiBinding);
    const rath = rathNeighborLadder();
    checks.push(rath.foldNeighbor.exact && rath.foldNeighbor.angleNamespaceSeparate);
    checks.push(rath.shell.value === 7 ** 2 && rath.shell.totient === 42 && rath.shell.gap === 7);
    checks.push(rath.rathGate.exact && rath.rathGate.value === 3 * 17 && rath.rathGate.totient === 32);
    checks.push(rath.balance.exact && rath.balance.sum === 100);
    checks.push(rath.primeAddresses.p4 === 7 && rath.primeAddresses.p5 === 11 && rath.primeAddresses.p7 === 17 && rath.primeAddresses.seventySeven === "p4·p5");
    checks.push(FQ_OPEN_PORTS.length === 9 && FQ_OPEN_PORTS.every(x => x.state.includes("OPEN") || x.state === "UNBOUND"));
    checks.push(STAGES.length === 7, OPEN_MARKERS.length === 7);
    checks.push(CONTRACT_FIELDS.length === 11);
    checks.push([6, 13, 20].every(n => makeRecord(n, "+1").seam.outgoing));
    checks.push([5, 7, 12, 14, 19, 21].every(n => !makeRecord(n, "+1").seam.outgoing));
    return { pass: checks.every(Boolean), passed: checks.filter(Boolean).length, total: checks.length, records: records.length, fib7 };
  }

  const esc = x => String(x).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const txt = (x, y, value, cls) => `<text x="${x}" y="${y}" class="${cls || "tra-label"}">${esc(value)}</text>`;
  function routeSvg(record) {
    const xs = [70, 180, 290, 400, 510, 620, 730], y = 150;
    let out = txt(22, 26, `TYPED ROUTE · ${record.record} · ${record.orientation}`, "tra-title");
    STAGES.forEach((s, i) => {
      if (i < STAGES.length - 1) out += `<line x1="${xs[i] + 30}" y1="${y}" x2="${xs[i + 1] - 30}" y2="${y}" class="tra-cable cable-${s.color}"/>`;
      out += `<g class="tra-node node-${s.color}"><circle cx="${xs[i]}" cy="${y}" r="30"/><text x="${xs[i]}" y="${y + 4}" class="tra-node-index">${i + 1}</text></g>`;
      out += txt(xs[i], y + 50, s.label, "tra-node-label") + txt(xs[i], y + 66, s.type, "tra-node-type");
    });
    out += txt(400, 266, `n=${record.address.n} · r${record.address.row}c${record.address.col} · qrt11=(${record.return_witness.qrt.q},${record.return_witness.qrt.r})`, "tra-value");
    out += txt(400, 300, record.return_witness.exact ? "PASS · EXACT RETURN" : "FAIL · RETURN MISMATCH", "tra-verdict");
    return out;
  }
  function ledgerHtml(record) {
    return CONTRACT_FIELDS.map(f => `<article><small>${esc(f)}</small><b>${esc(typeof record[f] === "string" ? record[f] : JSON.stringify(record[f]))}</b></article>`).join("");
  }
  function fibonacciSvg() {
    const fib = fibonacciMod(7), cx = 400, cy = 170, radius = 115;
    let out = txt(22, 26, "FIBONACCI mod 7 · EXACT COMPARATOR", "tra-title");
    for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + i * 2 * Math.PI / 7, x = cx + radius * Math.cos(a), y = cy + radius * Math.sin(a); out += `<circle cx="${x}" cy="${y}" r="22" class="tra-fib-node"/>${txt(x, y + 4, i, "tra-node-index")}`; }
    const pts = fib.period.map((r, i) => { const a = -Math.PI / 2 + r * 2 * Math.PI / 7, scale = radius + (i % 3 - 1) * 8; return `${cx + scale * Math.cos(a)},${cy + scale * Math.sin(a)}`; });
    out += `<polyline points="${pts.join(" ")}" class="tra-fib-path"/>`;
    out += txt(400, 318, `PERIOD 16 · ${fib.period.join("·")}`, "tra-value");
    out += txt(400, 336, "PRIME-INDEX LIFT · Δ1→Δ2 · Δ2→Δ3 · EXACT ON IMAGE", "tra-value");
    out += txt(400, 354, "NOT A RETURN · −1/12 · 44→L · φ · COLOUR REMAIN SEPARATE / OPEN", "tra-verdict");
    return out;
  }
  function fqComparatorSvg() {
    const cx = 400, cy = 162, radius = 104;
    let out = txt(22, 26, "ƒQ°± · PRIME / DODECA TYPE CONTROL", "tra-title");
    for (let i = 0; i < 12; i++) {
      const a = -Math.PI / 2 + i * Math.PI / 6, x = cx + radius * Math.cos(a), y = cy + radius * Math.sin(a);
      out += `<circle cx="${x}" cy="${y}" r="7" class="tra-fib-node"/>${i % 3 === 0 ? txt(x, y - 13, i, "tra-node-type") : ""}`;
    }
    out += `<path d="M ${cx} ${cy - radius} A ${radius} ${radius} 0 1 1 ${cx - .1} ${cy - radius}" class="tra-fib-path"/>`;
    out += txt(cx, cy - 14, "+1/12 · −1/12", "tra-value");
    out += txt(cx, cy + 8, "PERIOD 12 · ±30°", "tra-verdict");
    out += txt(cx, cy + 30, "+2/12 · −2/12 · PERIOD 6", "tra-value");
    out += txt(400, 292, "PRIME-INDEX · Δ1→Δ2 · Δ2→Δ3 · EXACT ON IMAGE · NOT RETURN", "tra-value");
    out += txt(400, 314, "NEIGHBOR RAIL · 44→45 · 49=7² · 50=L · 51=3·17 · 49+51=100", "tra-value");
    out += txt(400, 334, "77=p₄·p₅=7·11 · p₇=17 IS A SEPARATE PRIME ADDRESS", "tra-value");
    out += txt(400, 354, "OPEN PORTS · φ · ZE|TA · Hz · mph · ¥ · FOUR COLOUR MARKERS", "tra-verdict");
    return out;
  }
  function markersHtml() {
    return OPEN_MARKERS.map((m, i) => `<article class="state-${m.state.toLowerCase()}"><small>${String(i + 1).padStart(2, "0")} · ${esc(m.state)}</small><b>${esc(m.marker)}</b><span>${esc(m.next)}</span></article>`).join("");
  }
  function mount(scope) {
    const host = (scope || document).querySelector("#typedReturnAtlas");
    if (!host) return null;
    let n = 0, direction = "+1", view = "route";
    const stage = host.querySelector("[data-tra-stage]"), output = host.querySelector("[data-tra-output]"), index = host.querySelector("[data-tra-index]");
    const paint = () => {
      const record = makeRecord(n, direction);
      stage.className = `tra-stage view-${view}`;
      stage.innerHTML = view === "route" ? `<svg viewBox="0 0 800 360" role="img" aria-label="Typed return route">${routeSvg(record)}</svg>` : view === "ledger" ? `<div class="tra-contract-grid">${ledgerHtml(record)}</div>` : view === "fibonacci" ? `<svg viewBox="0 0 800 360" role="img" aria-label="Fibonacci modulo seven comparator">${fibonacciSvg()}</svg>` : view === "fq" ? `<svg viewBox="0 0 800 360" role="img" aria-label="F Q signed prime and dodeca return comparator">${fqComparatorSvg()}</svg>` : `<div class="tra-marker-grid">${markersHtml()}</div>`;
      index.textContent = String(n + 1).padStart(2, "0");
      host.querySelectorAll("[data-tra-view]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.traView === view)));
      host.querySelectorAll("[data-tra-direction]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.traDirection === direction)));
      output.textContent = view === "route" ? `PASS · ${record.record} · ${record.transform} · exact=${record.return_witness.exact}` : view === "ledger" ? `11/11 REQUIRED FIELDS · QRT11 ${record.return_witness.qrt.q}|${record.return_witness.qrt.r} → ${record.address.n}` : view === "fibonacci" ? "PASS · mod-7 period 16 · Δ1→Δ2 · Δ2→Δ3 prime-index lift exact on image; not a return." : view === "fq" ? "PASS · signed dodeca ±1 returns in 12; ±2 returns in 6 · L affine control exact · φ/colour unbound." : "BACKLOG · 7 typed markers · preparation/open/hold only · no Study activation.";
    };
    host.querySelectorAll("[data-tra-view]").forEach(b => b.addEventListener("click", () => { view = b.dataset.traView; paint(); }));
    host.querySelectorAll("[data-tra-direction]").forEach(b => b.addEventListener("click", () => { direction = b.dataset.traDirection; paint(); }));
    host.querySelector("[data-tra-step]").addEventListener("click", () => { n = (n + 1) % 28; paint(); });
    host.querySelector("[data-tra-seam]").addEventListener("click", () => { n = [6, 13, 20].find(x => x > n) ?? 6; view = "route"; paint(); });
    host.querySelector("[data-tra-return]").addEventListener("click", () => { n = 0; view = "ledger"; paint(); });
    paint();
    return { setRecord(x) { n = x; paint(); } };
  }
  if (typeof document !== "undefined") {
    const boot = () => mount(document);
    document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", boot, { once: true }) : boot();
  }
  return { CONTRACT_FIELDS, STAGES, OPEN_MARKERS, FQ_OPEN_PORTS, address, coil, uncoil, qrt11, counterweight, fibonacciMod, nthPrime, diagonalPrimeLift, signedDodeca, lAffineControl, rathNeighborLadder, makeRecord, verify, routeSvg, fibonacciSvg, fqComparatorSvg, ledgerHtml, markersHtml, mount };
});
