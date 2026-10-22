(function (root, factory) {
  const profiles = factory();
  if (typeof module === "object" && module.exports) module.exports = profiles;
  root.NexahProfiles = profiles;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const periods = [
    0.9999998937,
    29.530588214,
    365.256363004,
    18.613 * 365.2422,
    25772 * 365.2422
  ];

  const phase = (t, period) => ((t / period) % 1 + 1) % 1;
  const round = (value, digits = 12) => Number(value.toFixed(digits));
  const oyImport = {
    experiment: "OY_BARRIER_01",
    mode: "ARCHIVED_SOURCE_AND_DETERMINISTIC_REPLAY",
    core_result_sha256: "fc377d1e0de786ba60bde03ee162c8c63f1c316affa520f4b9f264c2980fc9b9",
    result_json_sha256: "90b9da8ee282a89f920d8706de54a494b545f507868a23151605d7e56074365c",
    runner_sha256: "6634080af341e9aeac5125ff5a0b97ce369dfaf0e85cc6bd3784b90d6856d522",
    contract_sha256: "92cc351995f75303b7bbd2a5f5215035008e07ab1a5b715acb3c0fb3bc6531a7",
    python_version: "3.9.6",
    all_tests_pass: true,
    tests: {
      T1_pascal_identities: true,
      T2_deterministic_replay: true,
      T3_fire_ice_rate_contrast: true,
      T4_time_order_control: true,
      T5_return_retains_cycle_work: true
    },
    cold_trajectory_sha256: "e7c7f4c46503e1d10b4af7bb2207f2bc57ebc1f80643f01848bd99ad9f7f3952",
    warm_trajectory_sha256: "4556ddb8d9636164087e705646f6e1d8cbf8a3987908136313e885466ef6af0f",
    observed_warm_cold_ratio: 2.592312539382483,
    predicted_warm_cold_ratio: 2.6860619046964636,
    ratio_relative_error: 0.034902161096906956,
    signed_cycle_work_j: 100,
    initial_coordinate_equals_final: true,
    claim_boundary: "exact combinatorics and this frozen synthetic model only; no material, astronomical, universal-mechanism, capability or product claim"
  };

  const fiveHQ = {
    id: "five-h-q",
    version: "0.1.0",
    label: "Five H · One Q°",
    status: "EXECUTABLE",
    authority: "NEXAH_LOCAL_DISPLAY_MODEL",
    binderId: "five-h-q:identity-by-clock-id-v1",
    validateInput(input) {
      return Number.isFinite(input.t0_days) && Number.isFinite(input.loop_days)
        ? { ok: true }
        : { ok: false, error: "t0_days and loop_days must be finite numbers" };
    },
    sample(input, meta) {
      const t = input.t0_days + meta.offset_days;
      return {
        time_days: round(t, 6),
        phases_turns: periods.map((period) => round(phase(t, period))),
        q_marker: "PROJECTION_RELATIVE",
        source: "FIVE_H_Q_LOCAL_MODEL"
      };
    },
    bind(stateB) {
      return { ...stateB, binder_applied: "CLOCK_ID_ALIGNMENT" };
    },
    compare(stateA, stateB) {
      return {
        time_delta_days: round(stateB.time_days - stateA.time_days, 6),
        phase_delta_turns: stateA.phases_turns.map((value, index) => round(stateB.phases_turns[index] - value))
      };
    },
    residual(comparison) {
      const magnitude = Math.sqrt(comparison.phase_delta_turns.reduce((sum, value) => sum + value * value, 0));
      return {
        classification: magnitude <= 1e-12 ? "INVARIANT" : "DIFFERENCE",
        metric: "EUCLIDEAN_PHASE_DELTA_TURNS",
        magnitude: round(magnitude)
      };
    }
  };

  const restAtomic = {
    id: "rest-atomic",
    version: "0.1.0",
    label: "Re/ST Atomic Reflection",
    status: "EXECUTABLE",
    authority: "EXACT_ATOMIC_NUMBER_ARITHMETIC",
    binderId: "rest-atomic:reverse-pair-v1",
    validateInput(input) {
      const validRows = Array.isArray(input.lower) && Array.isArray(input.upper) && input.lower.length === 3 && input.upper.length === 3;
      return validRows && Number.isFinite(input.midpoint) ? { ok: true } : { ok: false, error: "Two three-position rows and midpoint are required" };
    },
    sample(input, meta, side) {
      return {
        row: side === "A" ? [...input.lower] : [...input.upper],
        midpoint: input.midpoint,
        offset: meta.offset_days
      };
    },
    bind(stateB) {
      return { ...stateB, row: [...stateB.row].reverse(), binder_applied: "REVERSE_ORDER" };
    },
    compare(stateA, stateB) {
      const pair_sums = stateA.row.map((value, index) => value + stateB.row[index]);
      return {
        pair_sums,
        midpoint_values: pair_sums.map((value) => value / 2),
        expected_midpoint: stateA.midpoint
      };
    },
    residual(comparison) {
      const deltas = comparison.midpoint_values.map((value) => value - comparison.expected_midpoint);
      return {
        classification: deltas.every((value) => value === 0) ? "INVARIANT" : "DIFFERENCE",
        metric: "MIDPOINT_DELTA_ATOMIC_NUMBER",
        values: deltas
      };
    }
  };

  const observerDoubleCut = {
    id: "observer-double-cut",
    version: "0.1.0",
    label: "Observer A/B Double Cut",
    status: "EXECUTABLE",
    authority: "GENERIC_NUMERIC_PROJECTION_FIXTURE",
    binderId: "observer-double-cut:declared-scale-v1",
    validateInput(input) {
      const ok = Array.isArray(input.state) && input.state.length > 0 && input.state.every(Number.isFinite) && Number.isFinite(input.return_scale);
      return ok ? { ok: true } : { ok: false, error: "state[] and finite return_scale are required" };
    },
    sample(input, meta, side) {
      const scale = side === "A" ? 1 : input.return_scale;
      return {
        vector: input.state.map((value, index) => round((value + meta.offset_days * (index + 1) * 0.001) * scale)),
        frame: side
      };
    },
    bind(stateB, stateA, input) {
      return {
        vector: stateB.vector.map((value) => round(value / input.return_scale)),
        frame: stateA.frame,
        binder_applied: "INVERSE_DECLARED_SCALE"
      };
    },
    compare(stateA, stateB) {
      return { delta: stateB.vector.map((value, index) => round(value - stateA.vector[index])) };
    },
    residual(comparison) {
      const magnitude = Math.sqrt(comparison.delta.reduce((sum, value) => sum + value * value, 0));
      return {
        classification: magnitude <= 1e-12 ? "INVARIANT" : "RESIDUAL",
        metric: "EUCLIDEAN_STATE_DELTA",
        magnitude: round(magnitude)
      };
    }
  };

  const oyBarrier = {
    id: "oy-barrier-01",
    version: "0.1.0",
    label: "OY Barrier 01 · Receipt Replay",
    status: "REPLAYABLE",
    authority: "CLOSED_SYNTHETIC_RUN_IMPORTED_AND_VERIFIED",
    binderId: "oy-barrier-01:source-to-replay-hash-binder-v1",
    orientationFor(side) {
      return side === "A" ? "ARCHIVED_SOURCE" : "DETERMINISTIC_REPLAY";
    },
    validateInput(input) {
      const source = input && input.source;
      const ok = source && source.experiment === oyImport.experiment
        && source.core_result_sha256 === oyImport.core_result_sha256
        && source.result_json_sha256 === oyImport.result_json_sha256
        && source.all_tests_pass === true;
      return ok ? { ok: true } : { ok: false, error: "Verified OY_BARRIER_01 import snapshot is required" };
    },
    sample(input, meta, side) {
      return {
        ...input.source,
        record_role: side === "A" ? "ARCHIVED_SOURCE" : "DETERMINISTIC_REPLAY",
        replay_offset: meta.offset_days
      };
    },
    bind(stateB) {
      return { ...stateB, binder_applied: "SOURCE_REPLAY_HASH_ALIGNMENT" };
    },
    compare(stateA, stateB) {
      const checks = {
        experiment_equal: stateA.experiment === stateB.experiment,
        core_hash_equal: stateA.core_result_sha256 === stateB.core_result_sha256,
        result_hash_equal: stateA.result_json_sha256 === stateB.result_json_sha256,
        runner_hash_equal: stateA.runner_sha256 === stateB.runner_sha256,
        contract_hash_equal: stateA.contract_sha256 === stateB.contract_sha256,
        cold_trajectory_equal: stateA.cold_trajectory_sha256 === stateB.cold_trajectory_sha256,
        warm_trajectory_equal: stateA.warm_trajectory_sha256 === stateB.warm_trajectory_sha256,
        tests_equal: JSON.stringify(stateA.tests) === JSON.stringify(stateB.tests),
        cycle_work_equal: stateA.signed_cycle_work_j === stateB.signed_cycle_work_j,
        all_tests_pass: stateA.all_tests_pass === true && stateB.all_tests_pass === true
      };
      return { checks, check_count: Object.keys(checks).length, passed: Object.values(checks).filter(Boolean).length };
    },
    residual(comparison) {
      const failed = Object.entries(comparison.checks).filter(([, passed]) => !passed).map(([name]) => name);
      return {
        classification: failed.length === 0 ? "INVARIANT" : "RESIDUAL",
        metric: "SOURCE_REPLAY_HASH_AND_RESULT_EQUALITY",
        failed_checks: failed,
        passed: comparison.passed,
        total: comparison.check_count
      };
    }
  };

  const pending = [
    {
      id: "chemistry-6p1",
      version: "0.1.0",
      label: "Chemistry 6+1",
      status: "SOURCE_GATE_PENDING",
      authority: "CONCEPTUAL_MATERIAL_REGISTER",
      missing: ["six source identities", "units and calibrated detectors", "comparators", "hazard dispositions"]
    },
    {
      id: "hz-fz-transfer",
      version: "0.1.0",
      label: "Hz → Fz Transfer",
      status: "ADMISSION_GATE_READY",
      authority: "HZ_FZ_01_MEASUREMENT_CONTRACT_V0_1",
      missing: ["real NULL run", "real REFERENCE_A run", "real REPLAY_B run", "calibration-bound admission receipt"]
    }
  ];

  return { executable: [fiveHQ, restAtomic, observerDoubleCut, oyBarrier], pending, oyImport };
});
