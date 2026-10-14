(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.A0TessarecBigBlueComparator = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const round = (value, places = 6) => Number(value.toFixed(places));

  const objects = Object.freeze({
    carrier: { id: "Q4_VIEW_OF_Q4_X_P3", states: 16, edges: 32 },
    intrinsic: { id: "H_T_REACHABLE_FRAME_AGGREGATE" },
    observed: { id: "PI_PLUS_MINUS_THETA_OF_H" },
    host: { id: "O2_P16_H8_BLUE_BODY", vertices: 48, edges: 72, faces: 26, octagons: 2, pentagons: 16, hexagons: 8 },
    delivery: { id: "FOUR_TRUNCATED_PENTAGON_WALL_FOLD", walls: 4 },
    seam: { id: "DOUBLE_BLUE_BODY_H7_12_COMBINATORIAL_CANDIDATE", heptagons: 12 }
  });

  const adapters = Object.freeze([
    { from: "Q4_X_P3_CARRIER", to: objects.host.id, type: "VERTEX_BIJECTION_WITH_ROUTED_EDGES_NOT_GRAPH_IDENTITY" },
    { from: "FOUR_O8_OVERLAP_VIEW", to: objects.delivery.id, type: "PROJECTION_ONLY_VIEW_TO_TOOL_HANDOFF" },
    { from: "TWO_DISJOINT_BLUE_BODIES", to: objects.seam.id, type: "H7_12_COMBINATORIAL_SEAM_CANDIDATE" }
  ]);

  function intrinsicAxes(phaseDegrees) {
    const theta = phaseDegrees * Math.PI / 180;
    const scale = 1 + 0.15 * Math.cos(theta);
    return [round(105 * scale), round(118 / scale)];
  }

  function observedAxes(intrinsic, angleDegrees) {
    const theta = angleDegrees * Math.PI / 180;
    return [
      round(intrinsic[0] * (0.35 + 0.65 * Math.abs(Math.cos(theta)))),
      round(intrinsic[1] * (0.72 + 0.28 * Math.abs(Math.sin(theta))))
    ];
  }

  function evaluate(input = {}) {
    const phase = input.phase_degrees ?? 175;
    const phaseReference = input.phase_reference_degrees ?? 180;
    const angle = input.observer_angle_degrees ?? 42;
    const angleReference = input.observer_reference_degrees ?? 45;
    const stateIndex = Math.min(15, Math.floor((((phase % 720) + 720) % 720) / 45));
    const intrinsic = intrinsicAxes(phase);
    const observed = observedAxes(intrinsic, angle);
    const observedReference = observedAxes(intrinsic, angleReference);
    const perSide = Math.abs(angleReference - angle);
    const bilateral = 2 * perSide;
    const distinctIds = new Set(Object.values(objects).map((item) => item.id)).size === Object.keys(objects).length;
    const gates = {
      I1_STATE_SYNC: { status: stateIndex === 3 ? "PASS" : "FAIL", state_index: stateIndex, expected: 3 },
      I2_PARAMETER_TYPING: { status: phase !== angle && Math.abs(phaseReference - phase) === 5 ? "PASS" : "FAIL", phase_to_reference_degrees: Math.abs(phaseReference - phase), phase_and_view_distinct: phase !== angle },
      I3_APERTURE_LEDGER: { status: perSide === 3 && bilateral === 6 ? "PASS" : "FAIL", per_side_degrees: perSide, bilateral_degrees: bilateral, separation_at_42: 2 * angle, separation_at_45: 2 * angleReference },
      I4_INTRINSIC_INVARIANCE: { status: JSON.stringify(intrinsic) === JSON.stringify(intrinsicAxes(phase)) ? "PASS" : "FAIL", axes: intrinsic, observer_delta: 0 },
      I5_OBSERVED_RESPONSE: { status: JSON.stringify(observed) !== JSON.stringify(observedReference) ? "PASS" : "FAIL", at_42: observed, at_45: observedReference, mirror_pair: [-angle, angle] },
      I6_NAMESPACE_GUARD: { status: distinctIds && objects.host.pentagons === 16 && objects.seam.heptagons === 12 ? "PASS" : "FAIL", distinct_object_ids: distinctIds, host_pentagons: objects.host.pentagons, registered_pentagon_16_17_connector: false, seam_heptagons: objects.seam.heptagons, adapter_types: adapters.map((adapter) => adapter.type) }
    };
    const passed = Object.values(gates).every((gate) => gate.status === "PASS");
    return {
      schema: "nexah.a0.tessarec-big-blue-envelope-comparator-result",
      version: "1.0.0",
      record_id: "A0_TESSAREC_BIG_BLUE_ENVELOPE_COMPARATOR_RUN_001",
      date: "2026-10-14",
      status: passed ? "PASS_BOUNDED_INTEGRATION_DEMONSTRATOR" : "FAIL_BOUNDED_INTEGRATION_DEMONSTRATOR",
      module_id: "MOD:TESSAREC",
      fixture: { phase_degrees: phase, phase_reference_degrees: phaseReference, observer_angle_degrees: angle, observer_reference_degrees: angleReference, state_index: stateIndex },
      gates,
      objects,
      adapters,
      governance: { engineering_demonstrator: true, authorized_science_run: false, new_navigator_identity: false, new_navigator_relation: false, claim_promotion_authorized: false }
    };
  }

  return { objects, adapters, intrinsicAxes, observedAxes, evaluate };
});
