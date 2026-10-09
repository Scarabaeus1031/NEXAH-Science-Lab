window.NEXAH_PRIME_CRYSTAL_INSTRUMENT = {
  schema: "nexah.navigator.instrument-family/1.0.0",
  instrument_id: "NEXAH:INSTRUMENT:BREATHING_PRIME_CRYSTAL:V1",
  date: "2026-10-08",
  status: "INTERNAL_READ_ONLY_CALIBRATION_FAMILY",
  title: "Breathing / Prime Crystal Instrument Family",
  subtitle: "Known carrier · three grid cuts · explicit view residual",
  publication_authorized: false,
  changes_canonical_family_count: false,
  carrier: {
    domain: "1..3000",
    size: 3000,
    persistent_address: "integer n"
  },
  exact_inventory: {
    primes: 430,
    twin_prime_members: 162,
    twin_prime_members_with_partner_inside_carrier: 161,
    twin_membership_scope: "global arithmetic property; 2999↔3001 contributes the boundary member 2999",
    euler_41_values: 54,
    euler_41_prime_values: 50,
    root_band_primes: 37
  },
  three_cut_control: [
    { cut_id: "CUT:WIDTH:19", columns: 19, prime_vertical_edges: 0, prime_horizontal_edges: 1, view_edges_total: 1, prime_column_cv: 0.2352 },
    { cut_id: "CUT:WIDTH:20", columns: 20, prime_vertical_edges: 107, prime_horizontal_edges: 1, view_edges_total: 108, prime_column_cv: 1.218 },
    { cut_id: "CUT:WIDTH:21", columns: 21, prime_vertical_edges: 1, prime_horizontal_edges: 1, view_edges_total: 2, prime_column_cv: 0.8601 }
  ],
  three_cut_finding: "The carrier and arithmetic truth fields are unchanged, while the 20-column cut introduces 107 additional vertical prime-prime adjacencies. The strong prime lattice is therefore a view-local topology, not a carrier invariant.",
  overlap_control: {
    euler_twin_overlap: 18,
    euler_root_overlap: 7,
    twin_root_overlap: 10,
    hypergeometric_upper_tail: { euler_twin: 0.644446, euler_root: 0.121839, twin_root: 0.941795 },
    interpretation: "The exploratory overlaps do not support a special Euler-Twin-Root coupling."
  },
  instrument_layers: [
    { layer_id: "BPC:L1:EXACT_CARRIER", title: "Exact arithmetic carrier", role: "Ground truth for identity, residues, primality, twins, Euler-41 and root-band labels.", evidence_state: "exact" },
    { layer_id: "BPC:L2:VIEW_CUTS", title: "Vendessimal and width controls", role: "Compare width 19, 20 and 21 without changing integer identity.", evidence_state: "bounded_computational_control" },
    { layer_id: "BPC:L3:BREATHING_CORE", title: "Breathing comparison core", role: "Use three membranes as three views, the regulator as comparison space and blend as explicit residual.", evidence_state: "instrument_specification" },
    { layer_id: "BPC:L4:LIFE_CONTROL", title: "LIFE / CA-IDENT negative control", role: "CA-IDENT-09 validates the split on the prime fixture; CA-IDENT-10 transfers it to one frozen LIFE05D event carrier.", evidence_state: "single_life_fixture_transfer_pass" }
  ],
  ilau_return: {
    retained: ["integer address", "primality", "mod-19/29 residues", "declared exact labels"],
    lost: ["view-local adjacencies absent under another width", "full relation context in a single overlay"],
    introduced: ["20-column vertical prime chains", "triad-band emphasis", "square-root rail appearance"],
    unresolved: ["a non-arbitrary binding for 0.429/0.456/0.487", "selective square-root rails", "a unique 1061-1064 mechanism"]
  },
  life_bridge: {
    target_id: "MOD:LIFE_ORBIT",
    relation_type: "negative-control-and-method-grammar",
    next_test: "Stop broad expansion. Replicate on additional frozen LIFE runs only under a new preregistration if cross-run generality becomes the explicit question."
  },
  calibration_result: {
    experiment: "CA-IDENT-09",
    alias: "PBC-01",
    verdict: "CALIBRATION_PASS_VIEW_NONINVARIANT",
    gates_passed: "5/5",
    identity_mismatches: 0,
    exact_returns: 9000,
    stable_prediction_disagreement: { width_19: 0, width_21: 0 },
    view_prediction_disagreement: { width_19: 0.504, width_21: 0.513 },
    interpretation: "Persistent address and arithmetic identity survive all cuts exactly; grid adjacency is a view property and must not be promoted to carrier identity."
  },
  life_transfer_result: {
    experiment: "CA-IDENT-10",
    alias: "LIFE-VIEW-01",
    source_run: "LIFE05D / RANDOM-17",
    verdict: "TRANSFER_PASS_VIEW_NONINVARIANT",
    gates_passed: "6/6",
    eligible_event_occurrences: 14132,
    evaluation_event_occurrences: 3530,
    identity_mismatches: 0,
    exact_returns: 42396,
    topology_jaccard: { width_31: 0.338011, width_33: 0.347484 },
    stable_prediction_disagreement: { width_31: 0, width_33: 0 },
    view_prediction_disagreement: { width_31: 0.226629, width_33: 0.268839 },
    interpretation: "Event identity and the lag-2 target survive re-encoding exactly; coordinate-neighbour topology and view-only decisions do not."
  },
  closed_control_lineage: [
    {
      control_id: "WNI-01",
      role: "positive invariant recovery",
      status: "CLOSED",
      finding: "Winding survives Q7/Q11/Q13/Q17 under adequate order, closure, reference, orientation and capacity even when coordinates do not return.",
      boundary: "No prime-grid topology, universal winding law or LIFE evidence."
    },
    {
      control_id: "ETRI-01",
      role: "declared transform invariance",
      status: "CLOSED",
      finding: "Reflection preserves declared Euclidean relations while coordinates and handedness change; augmentation and shear delimit the invariant class.",
      boundary: "Standard Euclidean geometry; no new operator."
    },
    {
      control_id: "NOS-01",
      role: "fail-closed architecture",
      status: "CLOSED",
      finding: "State, view, result, trace, history and provenance remain separate; unresolved and undefined are not zero.",
      boundary: "Coherence is not truth or external validation."
    },
    {
      control_id: "TITAN-01",
      role: "external non-identity control",
      status: "CLOSED",
      finding: "Partial relation survival across observation and regime change does not establish shared identity or mechanism.",
      boundary: "External science remains external; model is not target."
    }
  ],
  contextual_examples: {
    status: "EXPLANATORY_ONLY_NOT_ADDITIONAL_EVIDENCE",
    interpretation: "CRT and Janus surfaces illustrate exact carrier/view/return grammar; HMA-01 remains visual-only for its historical mapping. None supplies LIFE evidence."
  },
  utility_assessment: {
    experiment: "NAV-UTILITY-01",
    status: "READY_FOR_FIRST_HUMAN_OWNER_RUN",
    result: "UNKNOWN_PENDING_HUMAN_INPUT",
    execution_disposition: "DEFERRED_BY_HUMAN_OWNER_NO_DATE",
    decision_question: "Should multi-run CA-IDENT-10 replication be activated automatically now?",
    time_limit_seconds: 720,
    registered_gates: 5,
    participant_scope: "one highly familiar Human Owner",
    interpretation_boundary: "A pass can support internal owner usefulness for this one decision task only; independent-reader and external utility remain open."
  },
  sources: {
    binder: "SCIENCE_LAB/NAVIGATION/EVIDENCE/BREATHING_PRIME_CRYSTAL_INSTRUMENT_2026-10-08/BREATHING_PRIME_CRYSTAL_BINDER_V1_2026-10-08.json",
    readme: "SCIENCE_LAB/NAVIGATION/EVIDENCE/BREATHING_PRIME_CRYSTAL_INSTRUMENT_2026-10-08/README.md",
    forensic_audit: "SCIENCE_LAB/CASE_STUDIES/NEXAH_VENDESSIMAL_PRIME_GRID_FORENSIC_AUDIT_2026-09-28/FINAL_REPORT.md",
    package_readme: "SCIENCE_LAB/CASE_STUDIES/CIKADA_3301_LATER_MARKER_PROVENANCE_INTAKE/CIKADA 3301 LATER MARKER CORPUS/🧭🧭🧭GITHUB-TODO_UPLOAD NAVIGATION/🜂🜂🜂 ANKH 2040 — QED Summary Index/Breathing Crystal · Π‑ring · LIC_Resonant Atlas_Tesla Staricase/Breathing_Crystal_Package_v0_3/README_BreathingCrystal_v0_3.md",
    field_notes: "SCIENCE_LAB/CASE_STUDIES/CIKADA_3301_LATER_MARKER_PROVENANCE_INTAKE/CIKADA 3301 LATER MARKER CORPUS/🧭🧭🧭GITHUB-TODO_UPLOAD NAVIGATION/🜂🜂🜂 ANKH 2040 — QED Summary Index/Breathing Crystal · Π‑ring · LIC_Resonant Atlas_Tesla Staricase/Breathing_Crystal_Package_v0_3/vendessimal_readme.md",
    scene_spec: "SCIENCE_LAB/CASE_STUDIES/CIKADA_3301_LATER_MARKER_PROVENANCE_INTAKE/CIKADA 3301 LATER MARKER CORPUS/🧭🧭🧭GITHUB-TODO_UPLOAD NAVIGATION/🜂🜂🜂 ANKH 2040 — QED Summary Index/Breathing Crystal · Π‑ring · LIC_Resonant Atlas_Tesla Staricase/Breathing_Crystal_Package_v0_3/breathing_crystal_glb_spec_v0_3.json",
    viewer: "SCIENCE_LAB/CASE_STUDIES/CIKADA_3301_LATER_MARKER_PROVENANCE_INTAKE/CIKADA 3301 LATER MARKER CORPUS/🧭🧭🧭GITHUB-TODO_UPLOAD NAVIGATION/🜂🜂🜂 ANKH 2040 — QED Summary Index/Data & ATRIUM Html/breathing_crystal_viewer.html",
    ca_ident_09_readme: "SCIENCE_LAB/CASE_STUDIES/NEXAH_VIEW_INDUCED_TOPOLOGY_CALIBRATION_CA_IDENT_09_2026-10-08/README.md",
    ca_ident_09_result: "SCIENCE_LAB/CASE_STUDIES/NEXAH_VIEW_INDUCED_TOPOLOGY_CALIBRATION_CA_IDENT_09_2026-10-08/CA_IDENT_09_RESULT.json",
    ca_ident_09_lock: "SCIENCE_LAB/CASE_STUDIES/NEXAH_VIEW_INDUCED_TOPOLOGY_CALIBRATION_CA_IDENT_09_2026-10-08/PREREGISTRATION_LOCK.json",
    mission_control_return: "SCIENCE_LAB/MISSION_CONTROL_RETURN_CA_IDENT_09_VIEW_INDUCED_TOPOLOGY_2026-10-08.md",
    ca_ident_10_readme: "SCIENCE_LAB/CASE_STUDIES/NEXAH_LIFE_THREE_CUT_EVENT_TRANSFER_CA_IDENT_10_2026-10-08/README.md",
    ca_ident_10_result: "SCIENCE_LAB/CASE_STUDIES/NEXAH_LIFE_THREE_CUT_EVENT_TRANSFER_CA_IDENT_10_2026-10-08/CA_IDENT_10_RESULT.json",
    ca_ident_10_lock: "SCIENCE_LAB/CASE_STUDIES/NEXAH_LIFE_THREE_CUT_EVENT_TRANSFER_CA_IDENT_10_2026-10-08/PREREGISTRATION_LOCK.json",
    ca_ident_10_mission_control: "SCIENCE_LAB/MISSION_CONTROL_RETURN_CA_IDENT_10_LIFE_THREE_CUT_TRANSFER_2026-10-08.md",
    canonical_synthesis: "SCIENCE_LAB/LABREPORTS/SYNTHESIS/NEXAH_CARRIER_VIEW_RESIDUAL_FINDING_2026-10-08.md",
    mission_control_consolidation: "SCIENCE_LAB/MISSION_CONTROL_RETURN_CA_IDENT_09_10_CARRIER_VIEW_RESIDUAL_2026-10-08.md",
    nav_utility_01: "SCIENCE_LAB/CASE_STUDIES/NEXAH_NAVIGATOR_DECISION_UTILITY_NAV_UTILITY_01_2026-10-08/index.html",
    nav_utility_01_preregistration: "SCIENCE_LAB/CASE_STUDIES/NEXAH_NAVIGATOR_DECISION_UTILITY_NAV_UTILITY_01_2026-10-08/00_PREREGISTRATION.md",
    nav_utility_01_lock: "SCIENCE_LAB/CASE_STUDIES/NEXAH_NAVIGATOR_DECISION_UTILITY_NAV_UTILITY_01_2026-10-08/PREREGISTRATION_LOCK.json",
    nav_utility_01_mission_control: "SCIENCE_LAB/MISSION_CONTROL_RETURN_NAV_UTILITY_01_READINESS_2026-10-08.md",
    wni_01_decision: "SCIENCE_LAB/CASE_STUDIES/WNI01_WINDING_NUMBER_GRID_INVARIANCE_AUDIT/20_FINAL_WNI01_DECISION.md",
    wni_01_marker: "SCIENCE_LAB/CASE_STUDIES/WNI01_WINDING_NUMBER_GRID_INVARIANCE_AUDIT/WNI01_CLOSED_MARKER.png",
    etri_01_decision: "SCIENCE_LAB/CASE_STUDIES/ETRI01_EUCLIDEAN_TRANSFORM_REFLECTION_INCIDENCE_INVARIANCE_AUDIT/20_FINAL_ETRI01_DECISION.md",
    nos_01_decision: "SCIENCE_LAB/CASE_STUDIES/NOS01_NEXAH_ORION_NEXA_NEXUS_SYSTEM_SYNTHESIS/14_FINAL_NOS01_DECISION.md",
    titan_01_decision: "SCIENCE_LAB/CASE_STUDIES/TITAN01_SYSTEM_REGIME_CHANNEL_RELATION_SURVIVAL_CONTROL/12_FINAL_TITAN01_DECISION.md",
    eleven_space_janus: "SCIENCE_LAB/CASE_STUDIES/NEXAH_ELEVEN_SPACE_JANUS_NUMBER_VIEW_2026-10-06/README.md",
    hma_01_boundary: "SCIENCE_LAB/CASE_STUDIES/T_RAN_S_FORMATION/Operator Test Results/HMA01_DOWNLOAD/HMA01_FINAL_DECISION.md"
  },
  claim_ceiling: "Internal calibration and navigation only. No new prime theory, Euler-Twin-Root resonance, selective square-root mechanism, unique 1061-1064 threshold, Prime/LIFE causality, physical crystal, Root-432 mechanism, public release or external utility result."
};
