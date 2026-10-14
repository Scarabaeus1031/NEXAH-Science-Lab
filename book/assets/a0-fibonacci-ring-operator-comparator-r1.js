(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.A0FibonacciRingOperatorComparator = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const PHI = (1 + Math.sqrt(5)) / 2;
  const DEFAULTS = Object.freeze({ sampleCount: 48, seed: 110121, address: [1, 1], phaseHalfSpanDegrees: 1.84 });
  const round = (value, places = 12) => Number(value.toFixed(places));
  const frac = (value) => value - Math.floor(value);

  function decodeAddress(address, base = 10) {
    if (!Array.isArray(address) || address.length !== 2) throw new TypeError("address must be [i,j]");
    return address[0] + address[1] / base;
  }

  function operatorChain(input = {}) {
    const address = input.address || DEFAULTS.address;
    const x = decodeAddress(address, 10);
    const halfSpan = input.phaseHalfSpanDegrees ?? DEFAULTS.phaseHalfSpanDegrees;
    const squareEnvelope = x * x;
    const rawPhaseSpan = halfSpan - (-halfSpan);
    const effectivePhaseSpan = x * rawPhaseSpan;
    return {
      origin_address: [0, 0],
      target_address: [...address],
      decoder: "D(i,j)=i+j/10",
      decoded_scalar: round(x),
      square_operator: "S(x)=x^2",
      square_envelope: round(squareEnvelope),
      phase_pair_degrees: [-halfSpan, halfSpan],
      raw_phase_span_degrees: round(rawPhaseSpan),
      effective_phase_operator: "B(x,a)=x*(a-(-a))",
      effective_phase_span_degrees: round(effectivePhaseSpan),
      address_scalar_identity: false
    };
  }

  function mulberry32(seed) {
    let state = seed >>> 0;
    return function () {
      state += 0x6D2B79F5;
      let value = state;
      value = Math.imul(value ^ value >>> 15, value | 1);
      value ^= value + Math.imul(value ^ value >>> 7, value | 61);
      return ((value ^ value >>> 14) >>> 0) / 4294967296;
    };
  }

  function schedule(kind, sampleCount = DEFAULTS.sampleCount, seed = DEFAULTS.seed) {
    if (!Number.isInteger(sampleCount) || sampleCount < 8) throw new RangeError("sampleCount must be an integer >= 8");
    if (kind === "UNIFORM") return Array.from({ length: sampleCount }, (_, index) => index / sampleCount);
    if (kind === "FIBONACCI") return Array.from({ length: sampleCount }, (_, index) => frac(index / PHI));
    if (kind === "SEEDED_RANDOM") {
      const random = mulberry32(seed);
      return Array.from({ length: sampleCount }, () => random());
    }
    throw new RangeError(`unknown schedule: ${kind}`);
  }

  function targetSignal(theta) {
    return 1 + 0.11 * Math.cos(theta) + 0.21 * Math.cos(2 * theta) + 0.184 * Math.sin(3 * theta);
  }

  function recoverCoefficients(fractions) {
    const n = fractions.length;
    const values = fractions.map((u) => ({ theta: 2 * Math.PI * u, radius: targetSignal(2 * Math.PI * u) }));
    const coefficients = [values.reduce((sum, item) => sum + item.radius, 0) / n];
    for (let harmonic = 1; harmonic <= 3; harmonic += 1) {
      coefficients.push(2 * values.reduce((sum, item) => sum + item.radius * Math.cos(harmonic * item.theta), 0) / n);
      coefficients.push(2 * values.reduce((sum, item) => sum + item.radius * Math.sin(harmonic * item.theta), 0) / n);
    }
    return coefficients;
  }

  function maximumCircularGap(fractions) {
    const sorted = [...fractions].sort((a, b) => a - b);
    return sorted.reduce((maximum, value, index) => {
      const next = index === sorted.length - 1 ? 1 + sorted[0] : sorted[index + 1];
      return Math.max(maximum, next - value);
    }, 0);
  }

  function evaluateSchedule(kind, sampleCount = DEFAULTS.sampleCount, seed = DEFAULTS.seed) {
    const fractions = schedule(kind, sampleCount, seed);
    const expected = [1, 0.11, 0, 0.21, 0, 0, 0.184];
    const recovered = recoverCoefficients(fractions);
    const rmse = Math.sqrt(recovered.reduce((sum, value, index) => sum + (value - expected[index]) ** 2, 0) / expected.length);
    return {
      schedule: kind,
      sample_count: sampleCount,
      seed: kind === "SEEDED_RANDOM" ? seed : null,
      coefficient_rmse: round(rmse),
      maximum_circular_gap_turns: round(maximumCircularGap(fractions)),
      recovered_coefficients: recovered.map((value) => round(value)),
      fractions: fractions.map((value) => round(value))
    };
  }

  function evaluate(input = {}) {
    const sampleCount = input.sampleCount ?? DEFAULTS.sampleCount;
    const seed = input.seed ?? DEFAULTS.seed;
    const chain = operatorChain(input);
    const schedules = ["UNIFORM", "FIBONACCI", "SEEDED_RANDOM"].map((kind) => evaluateSchedule(kind, sampleCount, seed));
    const byName = Object.fromEntries(schedules.map((item) => [item.schedule, item]));
    const fibonacciPrivileged = byName.FIBONACCI.coefficient_rmse < byName.UNIFORM.coefficient_rmse && byName.FIBONACCI.coefficient_rmse < byName.SEEDED_RANDOM.coefficient_rmse;
    const ordering = [...schedules].sort((a, b) => a.coefficient_rmse - b.coefficient_rmse).map((item) => item.schedule);
    return {
      schema: "nexah.a0.fibonacci-ring-operator-comparator-result/1.0.0",
      record_id: "A0_FIBONACCI_RING_OPERATOR_COMPARATOR_RUN_001",
      date: "2026-10-14",
      status: fibonacciPrivileged ? "PASS_FIBONACCI_PRIVILEGED_ON_SYNTHETIC_FIXTURE" : "PASS_CONTROLS_DISTINGUISHED_FIBONACCI_NOT_PRIVILEGED",
      module_id: "MOD:TESSAREC",
      gate: "G6_SAMPLING_PREFLIGHT_ONLY",
      operator_chain: chain,
      comparator: {
        sample_count: sampleCount,
        seed,
        target_signal: "r(theta)=1+0.11*cos(theta)+0.21*cos(2theta)+0.184*sin(3theta)",
        expected_coefficients: [1, 0.11, 0, 0.21, 0, 0, 0.184],
        schedules,
        rmse_order_best_to_worst: ordering,
        fibonacci_beats_uniform: byName.FIBONACCI.coefficient_rmse < byName.UNIFORM.coefficient_rmse,
        fibonacci_beats_seeded_random: byName.FIBONACCI.coefficient_rmse < byName.SEEDED_RANDOM.coefficient_rmse,
        fibonacci_privileged: fibonacciPrivileged
      },
      governance: {
        synthetic_engineering_fixture: true,
        authorized_science_run: false,
        study_activated: false,
        closes_g6: false,
        new_navigator_identity: false,
        new_navigator_relation: false,
        claim_promotion_authorized: false
      },
      claim_boundary: "The exact operator chain and deterministic comparator are verified. This synthetic fixture does not establish a natural Fibonacci law, physical resonance, privileged constants or a scientific G6 result."
    };
  }

  function renderSvg(result = evaluate()) {
    const width = 1440;
    const height = 920;
    const colors = { bg: "#04131d", panel: "#082332", ink: "#eaf7fb", muted: "#91aab5", cyan: "#29c7ef", gold: "#e5b340", pink: "#ee6ca5", green: "#63d9aa", line: "#244554" };
    const panels = [
      { name: "UNIFORM", x: 260, color: colors.cyan },
      { name: "FIBONACCI", x: 720, color: colors.gold },
      { name: "SEEDED_RANDOM", x: 1180, color: colors.pink }
    ];
    const escape = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
    const fmt = (value) => value < 1e-10 ? "0" : value.toFixed(6);
    const scheduleMap = Object.fromEntries(result.comparator.schedules.map((item) => [item.schedule, item]));
    const bodyPath = "M -118 32 C -142 -50 -100 -124 0 -138 C 100 -124 142 -50 118 32 C 98 104 48 142 0 152 C -48 142 -98 104 -118 32 Z";
    const fragments = [`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`, `<rect width="100%" height="100%" fill="${colors.bg}"/>`, `<style>text{font-family:Inter,system-ui,sans-serif}.mono{font-family:ui-monospace,SFMono-Regular,Consolas,monospace}.serif{font-family:Georgia,serif}</style>`, `<text x="70" y="62" fill="${colors.ink}" font-size="32" font-weight="750">A0 · Fibonacci Ring Operator Comparator</text>`, `<text x="70" y="94" fill="${colors.muted}" font-size="16" class="mono">address → decimal scalar → square envelope → bilateral phase span · matched N=48</text>`];

    const chain = ["(0,0)", "(1,1)", "D → 1.1", "S → 1.21", "±1.84°", "B → 4.048°"];
    chain.forEach((label, index) => {
      const x = 70 + index * 218;
      fragments.push(`<rect x="${x}" y="130" width="174" height="70" rx="9" fill="${colors.panel}" stroke="${index < 2 ? colors.cyan : index < 4 ? colors.gold : colors.pink}"/>`);
      fragments.push(`<text x="${x + 87}" y="174" text-anchor="middle" fill="${colors.ink}" font-size="23" font-weight="700" class="mono">${escape(label)}</text>`);
      if (index < chain.length - 1) fragments.push(`<path d="M ${x + 180} 165 H ${x + 207}" stroke="${colors.muted}" stroke-width="2"/><path d="M ${x + 207} 165 l -8 -5 v 10 z" fill="${colors.muted}"/>`);
    });

    panels.forEach((panel) => {
      const record = scheduleMap[panel.name];
      fragments.push(`<g transform="translate(${panel.x} 500)">`);
      fragments.push(`<rect x="-190" y="-245" width="380" height="500" rx="16" fill="${colors.panel}" stroke="${colors.line}"/>`);
      fragments.push(`<path d="${bodyPath}" fill="#061a27" stroke="${colors.cyan}" stroke-width="2" opacity=".82"/>`);
      fragments.push(`<circle r="124" fill="none" stroke="${panel.color}" stroke-width="1.5" opacity=".7"/>`);
      fragments.push(`<circle r="84" fill="none" stroke="${panel.color}" stroke-width="1" opacity=".35"/>`);
      fragments.push(`<circle r="44" fill="none" stroke="${panel.color}" stroke-width="1" opacity=".2"/>`);
      if (panel.name === "FIBONACCI") fragments.push(`<text x="0" y="57" text-anchor="middle" fill="${colors.ink}" font-size="150" class="serif" opacity=".92">e</text>`);
      record.fractions.forEach((fraction, index) => {
        const angle = 2 * Math.PI * fraction - Math.PI / 2;
        const radius = 44 + (index % 3) * 40;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        fragments.push(`<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="3.2" fill="${panel.color}" opacity=".92"/>`);
      });
      fragments.push(`<text x="0" y="-202" text-anchor="middle" fill="${panel.color}" font-size="20" font-weight="800" class="mono">${panel.name}</text>`);
      fragments.push(`<text x="0" y="188" text-anchor="middle" fill="${colors.ink}" font-size="17" font-weight="700" class="mono">RMSE ${fmt(record.coefficient_rmse)}</text>`);
      fragments.push(`<text x="0" y="216" text-anchor="middle" fill="${colors.muted}" font-size="14" class="mono">max gap ${record.maximum_circular_gap_turns.toFixed(6)} turns</text>`);
      fragments.push(`</g>`);
    });

    fragments.push(`<rect x="70" y="790" width="1300" height="84" rx="12" fill="#0b211f" stroke="${colors.green}"/>`);
    fragments.push(`<text x="100" y="826" fill="${colors.green}" font-size="21" font-weight="800">${escape(result.status)}</text>`);
    fragments.push(`<text x="100" y="854" fill="${colors.ink}" font-size="16" class="mono">Uniform is exact on the frozen harmonic fixture; Fibonacci beats seeded random but not uniform. G6 remains open.</text>`);
    fragments.push(`</svg>`);
    return fragments.join("\n");
  }

  return { PHI, DEFAULTS, decodeAddress, operatorChain, schedule, targetSignal, recoverCoefficients, maximumCircularGap, evaluateSchedule, evaluate, renderSvg };
});
