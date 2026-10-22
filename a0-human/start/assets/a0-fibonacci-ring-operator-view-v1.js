(function () {
  "use strict";

  const api = window.A0FibonacciRingOperatorComparator;
  const bodyApi = window.A0PentagonBodyPlayer;
  const svg = document.getElementById("fibRingSvg");
  if (!api || !svg) return;

  const ns = "http://www.w3.org/2000/svg";
  const colors = { UNIFORM: "#29c7ef", FIBONACCI: "#e5b340", SEEDED_RANDOM: "#ee6ca5" };
  const labels = { UNIFORM: "UNIFORM CONTROL", FIBONACCI: "FIBONACCI RING", SEEDED_RANDOM: "SEEDED RANDOM" };
  const order = ["UNIFORM", "FIBONACCI", "SEEDED_RANDOM"];
  const state = { schedule: "FIBONACCI", sampleCount: 48, seed: 110121, playing: false, timer: null };

  const make = (tag, attrs, text) => {
    const node = document.createElementNS(ns, tag);
    Object.entries(attrs || {}).forEach(([key, value]) => node.setAttribute(key, value));
    if (text !== undefined) node.textContent = text;
    return node;
  };

  const root = make("g");
  const bodyPath = "M380 92 C500 105 562 190 548 296 C536 399 472 462 380 488 C288 462 224 399 212 296 C198 190 260 105 380 92 Z";
  root.append(make("path", { d: bodyPath, class: "fib-body" }));
  [72, 126, 180].forEach((radius) => root.append(make("circle", { cx: 380, cy: 286, r: radius, class: "fib-ring" })));
  root.append(make("path", { d: "M380 106 C480 120 540 194 532 286 C524 386 463 448 380 474 C297 448 236 386 228 286 C220 194 280 120 380 106 Z", class: "fib-ring-shell" }));
  const eMark = make("text", { x: 380, y: 342, "text-anchor": "middle", class: "fib-e" }, "e");
  root.append(eMark);
  const label = make("text", { x: 30, y: 38, class: "fib-svg-strong" }, labels[state.schedule]);
  const note = make("text", { x: 30, y: 59, class: "fib-svg-label" }, "N=48 · exact frozen view");
  root.append(label, note);
  const dots = make("g");
  const eulerPhaseGuide = make("line", { x1: 380, y1: 286, x2: 380, y2: 106, stroke: "#63d9aa", "stroke-width": 2, opacity: .18 });
  const eulerPhaseCursor = make("circle", { cx: 380, cy: 106, r: 8, fill: "#63d9aa", stroke: "#ffffff", "stroke-width": 2, opacity: .18 });
  root.append(dots, eulerPhaseGuide, eulerPhaseCursor);
  svg.append(root);

  const controls = [...document.querySelectorAll("[data-fib-schedule]")];
  const count = document.getElementById("fibSampleCount");
  const countOutput = document.getElementById("fibSampleOutput");
  const play = document.getElementById("fibPlay");
  const frozen = document.getElementById("fibFrozen");
  const rmse = document.getElementById("fibRmse");
  const gap = document.getElementById("fibGap");
  const rank = document.getElementById("fibRank");
  const evidence = document.getElementById("fibState");
  const verdict = document.getElementById("fibVerdict");
  const eulerCouple = document.getElementById("fibEulerCouple");
  const eulerStep = document.getElementById("fibEulerStep");
  const eulerComplex = document.getElementById("fibEulerComplex");
  const eulerAddress = document.getElementById("fibEulerAddress");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coupling = { step: 0, playing: false, timer: null };

  function formatMetric(value) {
    return value < 1e-10 ? "0" : value.toFixed(6);
  }

  function couplingRecord() {
    return bodyApi && bodyApi.fibonacciEulerCoupling ? bodyApi.fibonacciEulerCoupling(coupling.step) : null;
  }

  function drawCoupling() {
    const record = couplingRecord();
    if (!record) return;
    const displayAngle = record.angleRadians - Math.PI / 2;
    const x = 380 + 180 * Math.cos(displayAngle), y = 286 + 180 * Math.sin(displayAngle);
    eulerPhaseGuide.setAttribute("x2", x.toFixed(2)); eulerPhaseGuide.setAttribute("y2", y.toFixed(2));
    eulerPhaseCursor.setAttribute("cx", x.toFixed(2)); eulerPhaseCursor.setAttribute("cy", y.toFixed(2));
    eulerPhaseGuide.setAttribute("opacity", coupling.playing ? ".88" : ".42"); eulerPhaseCursor.setAttribute("opacity", coupling.playing ? "1" : ".58");
    eulerStep.textContent = `k=${record.step} · u=${record.fraction.toFixed(6)} · ${record.angleDegrees.toFixed(2)}°`;
    eulerComplex.textContent = `${record.phaseReal.toFixed(4)} ${record.phaseImaginary < 0 ? "−" : "+"} ${Math.abs(record.phaseImaginary).toFixed(4)}i`;
    eulerAddress.textContent = `${record.rankAddress} → ${record.eulerAddress}`;
    eulerCouple.classList.toggle("active", coupling.playing);
    eulerCouple.setAttribute("aria-pressed", String(coupling.playing));
    eulerCouple.textContent = coupling.playing ? "Pause φ → Euler phase → +7" : "Couple φ schedule → Euler phase → +7";
  }

  function draw() {
    const result = api.evaluate({ sampleCount: state.sampleCount, seed: state.seed });
    const current = result.comparator.schedules.find((entry) => entry.schedule === state.schedule);
    dots.replaceChildren();
    current.fractions.forEach((fraction, index) => {
      const angle = 2 * Math.PI * fraction - Math.PI / 2;
      const radius = 72 + (index % 3) * 54;
      dots.append(make("circle", {
        cx: (380 + radius * Math.cos(angle)).toFixed(2),
        cy: (286 + radius * Math.sin(angle)).toFixed(2),
        r: state.schedule === "FIBONACCI" ? 4.1 : 3.6,
        fill: colors[state.schedule],
        class: "fib-dot"
      }));
    });
    label.textContent = labels[state.schedule];
    note.textContent = `N=${state.sampleCount} · seed=${state.seed}${state.sampleCount === 48 ? " · frozen result" : " · exploratory view"}`;
    eMark.style.opacity = state.schedule === "FIBONACCI" ? ".88" : ".16";
    controls.forEach((button) => button.classList.toggle("active", button.dataset.fibSchedule === state.schedule));
    count.value = String(state.sampleCount);
    countOutput.textContent = String(state.sampleCount);
    rmse.textContent = formatMetric(current.coefficient_rmse);
    gap.textContent = current.maximum_circular_gap_turns.toFixed(6);
    rank.textContent = String(result.comparator.rmse_order_best_to_worst.indexOf(state.schedule) + 1) + " / 3";
    const isFrozen = state.sampleCount === 48;
    evidence.textContent = isFrozen ? "FROZEN R1" : "EXPLORATORY";
    verdict.classList.toggle("explore", !isFrozen);
    verdict.textContent = isFrozen
      ? "PASS · Controls distinguished; Fibonacci is not privileged on the frozen synthetic fixture. G6 remains open."
      : "EXPLORATORY VIEW · N changed. This live projection is not the frozen Check-88 result and creates no new evidence.";
    drawCoupling();
    window.A0FibonacciRingOperatorView = { state: { ...state, timer: undefined }, coupling: { ...coupling, timer: undefined, record: couplingRecord() }, result, current };
  }

  function choose(schedule) {
    state.schedule = schedule;
    draw();
  }

  controls.forEach((button) => button.addEventListener("click", () => choose(button.dataset.fibSchedule)));
  count.addEventListener("input", () => { state.sampleCount = Number(count.value); draw(); });
  frozen.addEventListener("click", () => { state.sampleCount = 48; state.seed = 110121; choose("FIBONACCI"); });
  function syncPlayControls() {
    play.classList.toggle("active", state.playing);
    play.textContent = state.playing ? "Pause operator" : "Play operator";
    play.setAttribute("aria-pressed", String(state.playing));
  }

  function togglePlay() {
    if (reducedMotion) { choose(order[(order.indexOf(state.schedule) + 1) % order.length]); return; }
    state.playing = !state.playing;
    syncPlayControls();
    if (state.timer) window.clearInterval(state.timer);
    state.timer = state.playing ? window.setInterval(() => choose(order[(order.indexOf(state.schedule) + 1) % order.length]), 950) : null;
  }

  play.addEventListener("click", togglePlay);
  eulerCouple?.addEventListener("click", () => {
    state.schedule = "FIBONACCI";
    if (reducedMotion) { coupling.step = (coupling.step + 1) % 48; draw(); return; }
    coupling.playing = !coupling.playing;
    if (coupling.timer) window.clearInterval(coupling.timer);
    coupling.timer = coupling.playing ? window.setInterval(() => { coupling.step = (coupling.step + 1) % 48; draw(); }, 420) : null;
    draw();
  });

  syncPlayControls();
  draw();
})();
