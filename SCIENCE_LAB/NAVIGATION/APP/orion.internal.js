/* Generated from ORION_CAPABILITY_EVIDENCE_BINDER_V1_2026-10-10.json. Internal only. */
window.NEXAH_ORION_CAPABILITY_EVIDENCE = {
  "schema": "nexah.navigator.orion-capability-evidence-binder/1.0.0",
  "version": "1.0.0",
  "binder_id": "NEXAH:ORION:CAPABILITY_EVIDENCE:V1",
  "maintained": "2026-10-10",
  "status": "INTERNAL_READ_ONLY_SOURCE_BOUND_LENS",
  "title": "ORION · Capability & Evidence",
  "summary": "A source-bound view separating the certified ORION V1 core, historical implementations, Science Lab validation evidence, external interfaces and open gates.",
  "identity_decision": "REUSE_EXISTING_ORION_OLS_SCIENCE_LAB_AND_BUILDER_IDENTITIES",
  "changes_canonical_registry_counts": false,
  "changes_canonical_family_count": false,
  "publication_authorized": false,
  "claim_ceiling": "This lens does not extend ORION product authority, promote Science Lab results into ORION capabilities, validate navigation or control, merge OLS with an implementation, or authorize publication.",
  "authority_chain": [
    {
      "layer": "OLS 1.0",
      "role": "Normative semantic language",
      "boundary": "Meaning and contracts, not execution.",
      "source": "10 NEXAH CORE/NEXAH/ORIENTATION_LANGUAGE/README.md"
    },
    {
      "layer": "ORION Certified V1",
      "role": "Deterministic structural processor",
      "boundary": "Certified scope only; no Human meaning, general runtime or scientific truth.",
      "source": "20 ORION/NEXAH-ORION/docs/releases/ORION_V1_CERTIFIED_BASELINE.md"
    },
    {
      "layer": "Science Lab",
      "role": "External method tests, controls and replay",
      "boundary": "A Lab PASS does not expand ORION product authority.",
      "source": "20 ORION/NEXAH-ORION/docs/reviews/ORION_HISTORICAL_CLAIM_INVENTORY_2026-10-01.md"
    },
    {
      "layer": "Builder / Human Return",
      "role": "Bounded interfaces and selected use paths",
      "boundary": "An interface does not supply scientific validation or recommendation authority.",
      "source": "00 EXECUTIVE/NEXAH-Mission-Control/00_OVERVIEW/DOCUMENTS/ORION_CAPABILITY_AND_EVIDENCE_CROSSWALK_2026-10-10.md"
    }
  ],
  "certified_core": {
    "status": "CERTIFIED_BOUNDED",
    "included": [
      "Structural Representation with identity, ordering, locators, provenance and declared lossiness",
      "UNDERSTAND as an inventory of declared structural elements",
      "Declared relations, structural navigation and Orientation Map",
      "Expression Contract, construction, conformance and certification",
      "Canonical artifacts, SHA-256 integrity, replay and explicit STOP boundaries"
    ],
    "excluded": [
      "Runtime and Gateway as part of Certified V1",
      "LYRA execution or SIRIUS",
      "Applications and Human reports",
      "Reasoning, semantic interpretation or decision",
      "Physical navigation, planning, control or intervention"
    ],
    "source": "20 ORION/NEXAH-ORION/docs/releases/ORION_V1_CERTIFIED_BASELINE.md"
  },
  "evidence_ladder": [
    {
      "level": "L0",
      "carrier": "Z_365 · T_64 · CRT · restricted Janus relation",
      "status": "IMPLEMENTED_AND_TESTED",
      "status_class": "pass",
      "result": "27/27 registered claims classified; 6/6 false fixtures rejected; exact finite checks.",
      "source": "30 SCIENCE LAB/NEXAH-Science-Lab/ORION_LEVEL_0_CALIBRATION_AND_L1_PREP/04_ORION_L0_EXECUTION_REPORT.md",
      "claim_boundary": "Standard finite mathematics in the declared fixture; no general ORION or novelty claim."
    },
    {
      "level": "L1",
      "carrier": "Harmonic oscillator across declared representations",
      "status": "IMPLEMENTED_AND_TESTED",
      "status_class": "pass",
      "result": "14/14 candidates; 5/5 destructive controls; byte-identical replay.",
      "source": "30 SCIENCE LAB/NEXAH-Science-Lab/ORION_EXP_ORION_L1_001_V1_1_EXECUTION/FINAL_REPORT.md",
      "claim_boundary": "Locked equations, representations, metrics, controls and tolerances only."
    },
    {
      "level": "L2",
      "carrier": "Lorenz-63 and declared information-loss views",
      "status": "IMPLEMENTED_AND_TESTED",
      "status_class": "pass",
      "result": "13/13 candidates; 6/6 destructive controls; information-loss handling; identical replay.",
      "source": "30 SCIENCE LAB/NEXAH-Science-Lab/ORION_EXP_ORION_L2_001_EXECUTION/FINAL_REPORT.md",
      "claim_boundary": "No general nonlinear-dynamics, physical-truth, navigation or control claim."
    },
    {
      "level": "L3",
      "carrier": "Cross-representation and cross-language benchmark",
      "status": "IMPLEMENTED_AND_TESTED",
      "status_class": "pass",
      "result": "10/10 candidates; 3/3 cross-language; 3/3 explicit undefined; 7/7 destructive controls.",
      "source": "30 SCIENCE LAB/NEXAH-Science-Lab/ORION_EXP_ORION_L3_001_EXECUTION/FINAL_REPORT.md",
      "claim_boundary": "Bounded translation and conformance benchmark; no universal representation-independent truth."
    },
    {
      "level": "L4",
      "carrier": "Navigation / NEXAH capability candidates",
      "status": "INVALID_EXPERIMENT",
      "status_class": "invalid",
      "result": "L4.001 and L4.003 both invalid; no positive capability evidence.",
      "source": "30 SCIENCE LAB/NEXAH-Science-Lab/ORION_EXP_ORION_L4_003_TNSPA_V1_EXECUTION/FINAL_REPORT.md",
      "secondary_source": "30 SCIENCE LAB/NEXAH-Science-Lab/ORION_EXP_ORION_L4_001_EXECUTION/FINAL_L4_REPORT.md",
      "claim_boundary": "No support for robustness, navigation, control or intervention."
    }
  ],
  "interfaces": [
    {
      "name": "ORION Scientific Runner V1",
      "state": "METHOD_REFERENCE / FROZEN",
      "role": "Generic deterministic result classifier on one analytic fixture",
      "source": "30 SCIENCE LAB/NEXAH-Science-Lab/SCIENCE_LAB/CASE_STUDIES/NEXAH_ORION_SCIENTIFIC_RUNNER_REFERENCE_2026-10-01/03_REFERENCE_EXPERIMENT_RESULT.md",
      "boundary": "Reference method, not production capability."
    },
    {
      "name": "NEXAHEDRON ORION V1 Gateway",
      "state": "IMPLEMENTED_BOUNDED",
      "role": "External certified-Core seam for confirmed material and Orientation requests",
      "source": "00 EXECUTIVE/NEXAH-Mission-Control/CURRENT/BUILDER_TOOL_INVENTORY.csv",
      "boundary": "Separate interface; no general NEXAH↔ORION membrane or recommendation authority."
    },
    {
      "name": "Historical Runtime / Transformation Engine / LYRA",
      "state": "HISTORICAL_OR_NOT_CERTIFIED_V1",
      "role": "Retained implementation lineage",
      "source": "00 EXECUTIVE/NEXAH-Mission-Control/CURRENT/BUILDER_TOOL_INVENTORY.csv",
      "boundary": "Runnable or implemented does not mean current Certified V1 authority."
    },
    {
      "name": "O8 and SWM-01",
      "state": "RESEARCH_FIXTURE_AND_BLUEPRINT",
      "role": "Exact bounded fixture and language-neutral design input",
      "source": "30 SCIENCE LAB/NEXAH-Science-Lab/SCIENCE_LAB/LABREPORTS/ORION/LABREPORT_ORION_O8_B1_CYCLE_001.md",
      "boundary": "Neither object is adopted into ORION Certified V1."
    }
  ],
  "open_gates": [
    "One valid preregistered L4 benchmark",
    "One concrete external use case with a strong baseline",
    "Independent reproduction outside the current repository chain",
    "Validated Human usefulness for one person, task and moment",
    "Owner decision on a minimum shared result contract; no universal adapter by default"
  ],
  "non_identities": [
    "OLS is not ORION execution",
    "ORION Certified Core is not the Science Lab",
    "Science Lab PASS is not automatic ORION capability adoption",
    "Historical Runtime is not Certified V1",
    "Structural navigation is not physical navigation, control or intervention",
    "A visual architecture is not an evidence receipt"
  ],
  "controlling_sources": [
    "10 NEXAH CORE/NEXAH/ORIENTATION_LANGUAGE/README.md",
    "20 ORION/NEXAH-ORION/docs/releases/ORION_V1_CERTIFIED_BASELINE.md",
    "20 ORION/NEXAH-ORION/docs/reviews/ORION_HISTORICAL_CLAIM_INVENTORY_2026-10-01.md",
    "30 SCIENCE LAB/NEXAH-Science-Lab/SCIENCE_LAB/LAB_REGISTER.md",
    "00 EXECUTIVE/NEXAH-Mission-Control/00_OVERVIEW/DOCUMENTS/ORION_CAPABILITY_AND_EVIDENCE_CROSSWALK_2026-10-10.md"
  ]
};
