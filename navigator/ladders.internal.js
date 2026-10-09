/* Generated from LADDER_ATLAS_BINDER_V1_2026-10-06.json. Internal only. */
window.NEXAH_LADDER_ATLAS_BINDER = {
  "schema": "nexah.navigator.ladder-atlas-binder",
  "version": "1.0.0",
  "binder_id": "NEXAH:LADDER_ATLAS:V1",
  "maintained": "2026-10-06",
  "title": "Ladder Atlas",
  "status": "INTERNAL_BOUNDED_ORIENTATION",
  "summary": "A compact comparison surface for recurring NEXAH ladder forms. It compares order, carrier, operator, invariant, loss and return without treating visual resemblance as a shared mechanism.",
  "claim_boundary": "A ladder is a representation format, not a scientific result. Shared rung structure does not establish shared generators, mechanisms, physics or evidence levels.",
  "breath_sequencer": {
    "sequencer_id": "NEXAH:CON_DAO_BREATH:V1",
    "title": "CON–DAO Janus Breath Sequencer",
    "status": "BOUNDED EXECUTABLE REPRESENTATION",
    "summary": "A thirteen-state Janus carrier with six CON addresses, one fixed Stillpoint and six DAO addresses. Alternative 7+5 and 8+4 lenses group the same twelve outer positions.",
    "instrument": "SCIENCE_LAB/CASE_STUDIES/NEXAH_CON_DAO_JANUS_BREATH_SEQUENCER_2026-10-06/NEXAH_CON_DAO_JANUS_BREATH_SEQUENCER.html",
    "controlling_source": "SCIENCE_LAB/CASE_STUDIES/NEXAH_CON_DAO_JANUS_BREATH_SEQUENCER_2026-10-06/README.md",
    "historical_provenance": "SCIENCE_LAB/CASE_STUDIES/THREE_LIFE_SYSTEMS_PLUS_ONE_BINDER_VISUAL_SERIES_2026-08-24/FINAL_VISUAL_SERIES_DECISION.md",
    "carrier": "CON-6…CON-1 → STILL → DAO-1…DAO-6",
    "invariant": "J(J(x))=x and J(STILL)=STILL",
    "lenses": [
      "6|1|6 · Janus Breath",
      "7+5 · Relations + Pentagon Envelope",
      "8+4 · Octave + Four Axes"
    ],
    "source_trace": [
      5,
      4,
      4,
      3,
      3,
      3,
      2,
      1,
      0,
      0,
      9,
      8,
      8,
      7,
      7,
      6,
      5,
      5,
      4,
      4,
      3
    ],
    "claim_boundary": "The 13-state executable carrier is exact only for the declared demonstrator. The 21-tick Root Breath trace is historical provenance, not an identified generator or physical mechanism."
  },
  "questions": [
    {
      "id": "sequence",
      "title": "Sequence / state",
      "question": "What is ordered, and what counts as one step?",
      "accent": "green"
    },
    {
      "id": "representation",
      "title": "Representation / scale",
      "question": "Which carrier, frame or normalization makes the rungs visible?",
      "accent": "gold"
    },
    {
      "id": "interpretation",
      "title": "Interpretation / information",
      "question": "What is retained, lost, added or left unresolved?",
      "accent": "cyan"
    },
    {
      "id": "evidence",
      "title": "Evidence / claims",
      "question": "What was executed, what is exact, and where is the claim ceiling?",
      "accent": "violet"
    }
  ],
  "status_legend": [
    {
      "class": "exact",
      "label": "Exact / executed",
      "definition": "An exact relation or a completed bounded run with a controlling record."
    },
    {
      "class": "bounded",
      "label": "Bounded method",
      "definition": "A declared comparison, preregistration or governance method."
    },
    {
      "class": "constructed",
      "label": "Constructed representation",
      "definition": "A deliberate scale or view whose arithmetic may be exact but is not a universal law."
    },
    {
      "class": "historical-bounded",
      "label": "Historical source + bounded method",
      "definition": "Historical provenance is retained while the operational comparison is typed separately."
    },
    {
      "class": "open",
      "label": "Open candidate",
      "definition": "A candidate connection awaiting a declared test or controlling source."
    },
    {
      "class": "rejected",
      "label": "Rejected / not identified",
      "definition": "A tested claim failed, conflicted or remains unidentified."
    }
  ],
  "core_ladders": [
    {
      "ladder_id": "LAD:FIB_EULER",
      "title": "Fibonacci–Euler Staircase",
      "family": "sequence",
      "type": "Shared-index comparison",
      "status": "EXACT + METHOD COMPARISON",
      "status_class": "exact",
      "summary": "Places Fibonacci recursion and Euler's n²+n+41 polynomial on one index staircase so their different growth and prime behavior can be inspected without merging the generators.",
      "carrier": "Integer index n",
      "rungs": [
        "F₀, F₁, … by Fₙ=Fₙ₋₁+Fₙ₋₂",
        "q(n)=n²+n+41",
        "q(0)…q(39) are prime",
        "q(40)=41² marks the break"
      ],
      "operator": "Recurrence beside polynomial evaluation",
      "invariant": "The index n is shared; the generating laws are not.",
      "information_loss": "A combined plot hides the difference between recursive state and direct evaluation unless both generators remain labeled.",
      "return_condition": "Return to n and recompute both sequences independently.",
      "controlling_source": "SCIENCE_LAB/CASE_STUDIES/E8_DEMOS_INTERACTIVE_ORIENTATION_2026-09-21/COXETER_ORBIT_TOPOLOGY_LAB_2026-10-05/NEXAH_WORD_ORBIT_SEQUENCER.html",
      "instrument": "SCIENCE_LAB/CASE_STUDIES/E8_DEMOS_INTERACTIVE_ORIENTATION_2026-09-21/COXETER_ORBIT_TOPOLOGY_LAB_2026-10-05/NEXAH_WORD_ORBIT_SEQUENCER.html",
      "last_verified": "2026-10-06",
      "claim_ceiling": "Exact arithmetic and comparative visualization only.",
      "does_not_imply": [
        "A common generator",
        "A prime law for all n",
        "Euler–Mascheroni γ"
      ]
    },
    {
      "ladder_id": "LAD:PRIME_ANTIPODE",
      "title": "Prime-Index / Antipode Ladder",
      "family": "sequence",
      "type": "Index, clock and two-cut return",
      "status": "EXACT BOUNDED METHOD",
      "status_class": "exact",
      "summary": "Keeps prime value, prime index, 20-clock address and antipodal cuts distinct while testing whether an address survives the declared return path.",
      "carrier": "Prime register with a 20-position clock",
      "rungs": [
        "Prime value",
        "Prime index",
        "Clock residue",
        "Antipode",
        "Two cuts",
        "Return address"
      ],
      "operator": "Indexing, modular placement, antipode and cut",
      "invariant": "Declared address under the bounded two-cut construction.",
      "information_loss": "Collapsing value, index and clock position into one label erases which operation produced the relation.",
      "return_condition": "The reconstructed address must match the declared source address.",
      "controlling_source": "SCIENCE_LAB/RESEARCH_AREAS/FIELD_GLYPH_NUMBER_ARCHITECTURE_STAGE_0_2026-09-14/26_TRANSVERSUM_TWO_CUT_ANTIPODE_SYNTHESIS.md",
      "instrument": "SCIENCE_LAB/RESEARCH_AREAS/FIELD_GLYPH_NUMBER_ARCHITECTURE_STAGE_0_2026-09-14/NEXAH_EULER_ANTIPODE_TWO_CUT_INSTRUMENT.html",
      "last_verified": "2026-10-06",
      "claim_ceiling": "A reproducible arithmetic address method, not a physical antipode mechanism.",
      "does_not_imply": [
        "Prime causation",
        "A cosmological clock",
        "Identity between index and value"
      ]
    },
    {
      "ladder_id": "LAD:JANUS",
      "title": "Janus Arithmetic Ladder",
      "family": "representation",
      "type": "Affine reflection / eleven-space view",
      "status": "EXACT REPRESENTATION",
      "status_class": "exact",
      "summary": "Uses the involution Jc(x)=2c−x to compare midpoint, nested-shell and palindrome views of the same arithmetic reflection.",
      "carrier": "Ordered integer positions around a declared center c",
      "rungs": [
        "Source x",
        "Center c",
        "Reflected value 2c−x",
        "Nested shell",
        "Palindrome view",
        "Return to x"
      ],
      "operator": "Jc(x)=2c−x",
      "invariant": "Jc(Jc(x))=x and the midpoint c is fixed.",
      "information_loss": "A shell or palindrome view may suppress the affine coordinate that generated it.",
      "return_condition": "Apply the same Janus operator twice.",
      "controlling_source": "SCIENCE_LAB/CASE_STUDIES/NEXAH_ELEVEN_SPACE_JANUS_NUMBER_VIEW_2026-10-06/README.md",
      "instrument": "SCIENCE_LAB/CASE_STUDIES/NEXAH_ELEVEN_SPACE_JANUS_NUMBER_VIEW_2026-10-06/NEXAH_JANUS_ARITHMETIC_LADDER.html",
      "last_verified": "2026-10-06",
      "claim_ceiling": "Exact affine arithmetic and bounded visual translation.",
      "does_not_imply": [
        "A physical mirror",
        "A privileged eleven-dimensional space",
        "Mechanism from visual symmetry"
      ]
    },
    {
      "ladder_id": "LAD:ROOT_432",
      "title": "Root-432 Mirrored Scale",
      "family": "representation",
      "type": "Constructed scale map",
      "status": "CONSTRUCTED SCALE + EXACT ARITHMETIC",
      "status_class": "constructed",
      "summary": "Compares reciprocal scale placements around 432, 1080 and 2700 and explicitly keeps the nearby 0.429 marker off the declared 0.2 grid.",
      "carrier": "Normalized scale and angular turn register",
      "rungs": [
        "1.0: 432/432 = 2700/2700",
        "0.8: 432/540 = 2160/2700",
        "0.6: 432/720 = 1620/2700",
        "0.4: 432/1080 = 1080/2700",
        "0.429: off-grid candidate"
      ],
      "operator": "Scale by 2.5, mirror ratios, reduce angles modulo 360°",
      "invariant": "1080²=432×2700 and 432:1080:2700=1:2.5:6.25.",
      "information_loss": "Normalization hides absolute magnitude and can make a nearby off-grid value look like a rung.",
      "return_condition": "Reconstruct both ratio sides from the declared absolute values.",
      "controlling_source": "SCIENCE_LAB/CASE_STUDIES/E8_DEMOS_INTERACTIVE_ORIENTATION_2026-09-21/MUTATION_FAMILY_GRAPH_ADDENDUM_2026-10-05/06_MULTI_RETURN_SYNTHESIS_2026-10-05.md",
      "visual": "SCIENCE_LAB/CASE_STUDIES/E8_DEMOS_INTERACTIVE_ORIENTATION_2026-09-21/MUTATION_FAMILY_GRAPH_ADDENDUM_2026-10-05/SOURCE_MATERIAL/07_ROOT_432_CROWN.jpeg",
      "last_verified": "2026-10-06",
      "claim_ceiling": "Constructed scale map with exact arithmetic; not a universal law.",
      "does_not_imply": [
        "Universal scale privilege",
        "Physical resonance",
        "That 0.429 belongs to the 0.2 ladder"
      ]
    },
    {
      "ladder_id": "LAD:EMP05_INTERPRETATION",
      "title": "EMP-05 Interpretation Ladder",
      "family": "interpretation",
      "type": "Executed finite-state identification protocol",
      "status": "CLOSED CONDITIONAL PASS / DOMAIN MAPPED",
      "status_class": "exact",
      "summary": "Turns observation into an equivalence class, evaluates uncertainty, chooses a cue by expected information gain, updates the posterior and either identifies or abstains.",
      "carrier": "Finite deterministic toy state space",
      "rungs": [
        "Observe Y",
        "Form fiber μ=T⁻¹(y)",
        "Evaluate H",
        "Choose cue maximizing ΔH or utility",
        "Update posterior",
        "Identify, repeat or abstain"
      ],
      "operator": "Transformation, conditioning and adaptive cue selection",
      "invariant": "Identification depends on multiplicity and probability within the observed fiber.",
      "information_loss": "H(X|Y) quantifies remaining uncertainty; adaptive cues can reduce it but do not make the transformation invertible.",
      "return_condition": "Replay the six frozen runs from the declared inputs and compare summaries.",
      "controlling_source": "SCIENCE_LAB/CASE_STUDIES/T_RAN_S_FORMATION/FullPackage/EMP_05_DATASET_FREEZE_2026-08-27/01_RUN_SUMMARY.csv",
      "visual": "SCIENCE_LAB/CASE_STUDIES/T_RAN_S_FORMATION/FullPackage/EMP_05_DATASET_FREEZE_2026-08-27/EMP_05_FINAL_MARKER.png",
      "last_verified": "2026-10-06",
      "claim_ceiling": "Six passed runs in the frozen finite-state domain; no empirical generalization.",
      "does_not_imply": [
        "Real-world sensor validity",
        "A universal observation policy",
        "That equal multiplicity implies equal information gain"
      ],
      "note": "The poster is a stale snapshot: it reports 05/06 and names Run 06 as next. The controlling frozen run summary contains Run 06 as PASS. Data record outranks poster copy."
    },
    {
      "ladder_id": "LAD:INFORMATION_LOSS",
      "title": "Information-Loss Ladder",
      "family": "interpretation",
      "type": "Cross-representation loss taxonomy",
      "status": "PREREGISTERED BOUNDED METHOD",
      "status_class": "bounded",
      "summary": "Orders the transitions from full state through invertible transforms, sampling, graph construction, projection and render so losses are named before comparison.",
      "carrier": "Representations R0–R6",
      "rungs": [
        "R0 full state / branching",
        "R1 invertible representation",
        "R2 sampled geometry",
        "R3 z-projection",
        "R4 graph",
        "R5 estimated field",
        "R6 render"
      ],
      "operator": "Transform, sample, project, estimate and render",
      "invariant": "Only explicitly declared observables may be compared across a transition.",
      "information_loss": "Each non-invertible step must name what cannot be reconstructed.",
      "return_condition": "A return is allowed only where an inverse or a bounded reconstruction test is declared.",
      "controlling_source": "ORION_LEVEL_3_CROSS_REPRESENTATION_PREREGISTRATION/06_ORION_L3_INFORMATION_LOSS_LADDER.md",
      "last_verified": "2026-10-06",
      "claim_ceiling": "Preregistered taxonomy and test architecture, not validation of a specific empirical claim.",
      "does_not_imply": [
        "Lossless projection",
        "Equivalence of representations",
        "Successful empirical transfer"
      ]
    },
    {
      "ladder_id": "LAD:EVIDENCE_E0_E4",
      "title": "NEXAH Evidence Ladder E0–E4",
      "family": "evidence",
      "type": "Versioned governance taxonomy",
      "status": "CURRENT ORIENTATION SCHEME",
      "status_class": "bounded",
      "summary": "Separates expression, exact formal result, synthetic behavior, calibrated local measurement and independent reproduction so evidence does not travel upward by visual resemblance.",
      "carrier": "Claim records and evidence receipts",
      "rungs": [
        "E0 expression / question / navigation",
        "E1 exact result in a declared formal system",
        "E2 synthetic or software behavior",
        "E3 calibrated local measurement",
        "E4 independent reproduction"
      ],
      "operator": "Evidence classification and promotion gate",
      "invariant": "Every claim retains its source and evidence class.",
      "information_loss": "A single 'supported' label erases domain, execution and independence distinctions.",
      "return_condition": "Trace every promoted claim back to a controlling receipt at the stated level.",
      "controlling_source": "SCIENCE_LAB/NEXAH_CURRENT_TOTAL_OVERVIEW_2026-09-18.md",
      "last_verified": "2026-10-06",
      "claim_ceiling": "Governance vocabulary only; it does not upgrade the evidence attached to a claim.",
      "does_not_imply": [
        "Automatic promotion",
        "Transfer between domains",
        "That all older E0–E4 labels use this meaning"
      ],
      "note": "Older September documents use incompatible E0–E4 meanings. This card is explicitly versioned to the current total overview."
    },
    {
      "ladder_id": "LAD:RUSSELL_PERIODIC",
      "title": "Russell / Periodic Multi-View Carrier",
      "family": "evidence",
      "type": "Historical provenance + bounded representation method",
      "status": "REPRESENTATION ARCHITECTURE / NOT ALTERNATIVE CHEMISTRY",
      "status_class": "historical-bounded",
      "summary": "Treats Russell's cyclic or octave layouts and the modern periodic table as distinct views over a shared element register, then records what each cut retains, loses, adds or leaves unresolved.",
      "carrier": "Shared element register",
      "rungs": [
        "Choose carrier",
        "Declare frame and order",
        "Apply cut or projection",
        "Align comparable fields",
        "Record retained/lost/added/unresolved",
        "Compute residual or abstain"
      ],
      "operator": "Multi-view alignment with explicit frame, cut and residual",
      "invariant": "Element identity stays on the shared register; view position does not become chemical identity.",
      "information_loss": "Cyclic and tabular layouts emphasize different adjacencies and can add interpretive groupings.",
      "return_condition": "Rebind every displayed relation to the same element address and disclose unresolved mappings.",
      "controlling_source": "SCIENCE_LAB/RESEARCH_AREAS/FIELD_GLYPH_NUMBER_ARCHITECTURE_STAGE_0_2026-09-14/25_RUSSELL_X_TENSIONS_MULTI_VIEW_CARRIER.md",
      "last_verified": "2026-10-06",
      "claim_ceiling": "Russell is a historical/genealogical source; the NEXAH result is a bounded comparison architecture.",
      "does_not_imply": [
        "An alternative atom model",
        "New chemistry",
        "That carrier motion, frame motion and observer motion are the same"
      ]
    }
  ],
  "supporting_ladders": [
    {
      "title": "Research Ladder",
      "role": "Question → source → formalization → test → decision",
      "source": "MISSION_02_HIDDEN_ARCHITECTURE/05_RESEARCH_LADDER.md",
      "status": "supporting method"
    },
    {
      "title": "PMR Claim Ladder",
      "role": "Claim maturity and bounded prediction staging",
      "source": "SCIENCE_LAB/CASE_STUDIES/NEXAH_PMR01_CROSS_MODULUS_STRUCTURAL_TRANSITION_PREDICTION_2026-09-30/05_CLAIM_LADDER.md",
      "status": "research candidate"
    },
    {
      "title": "ORION Validation Ladder",
      "role": "Validation architecture and reproducibility gates",
      "source": "ORION_MATH_THE_MATH_VALIDATION_ARCHITECTURE_PASS/04_ORION_VALIDATION_LADDER.md",
      "status": "supporting method"
    },
    {
      "title": "Certificate and Information Ladder",
      "role": "Translation-fidelity certificates and information boundaries",
      "source": "NEXAH_TRANSLATION_FIDELITY_EXPERIMENT/02_CERTIFICATE_AND_INFORMATION_LADDER.md",
      "status": "supporting method"
    },
    {
      "title": "UTG Maturity Path",
      "role": "Transition-geometry definitions and bounded framework placement",
      "route": "#utg",
      "status": "navigator route"
    }
  ],
  "historical_metaphors": [
    {
      "title": "Illinium / Higgs Staircase",
      "provenance_state": "OWNER-SUPPLIED VISUAL · UNBOUND",
      "summary": "A nine-rung narrative staircase joining Fibonacci, Cassini, Q-flip, Möbius and mirror motifs.",
      "boundary": "Historical metaphor and visual synthesis only; no particle-physics claim."
    },
    {
      "title": "Tesla and harmonic staircases",
      "provenance_state": "HISTORICAL CORPUS",
      "summary": "Legacy staircase language used to organize frequency, return and resonance motifs.",
      "boundary": "Provenance only until each rung, operator and source are independently declared."
    },
    {
      "title": "Metallic resonance ladders",
      "provenance_state": "HISTORICAL CORPUS",
      "summary": "Sequences such as Be–Al–Ti–Ge–Hg–Au or Ir–Pt–Au–Hg appear as historical ordering motifs.",
      "boundary": "Not evidence for chemical or physical mechanism."
    },
    {
      "title": "Greek Axis / letter staircase",
      "provenance_state": "OWNER-SUPPLIED VISUAL · UNBOUND",
      "summary": "An ordinal alphabet carrier with later interpretive overlays.",
      "boundary": "Provenance only: alphabet order is exact convention; assigned operator meanings require a separate codebook."
    },
    {
      "title": "Binding Mirror, Root-40 and Kappa ladders",
      "provenance_state": "OWNER-SUPPLIED VISUAL · UNBOUND",
      "summary": "Recent visual syntheses joining arithmetic identities, reflection and return language.",
      "boundary": "Provenance only: retained as intake candidates, with no upgrade from illustration to formal or empirical evidence."
    },
    {
      "title": "Cosmological, alchemical and planetary ladders",
      "provenance_state": "HISTORICAL CORPUS",
      "summary": "Symbolic ascent structures found in the wider provenance archive.",
      "boundary": "Context and genealogy only; not a mechanism class in the Navigator."
    }
  ],
  "editorial_rules": [
    "One ladder card must name its carrier, rungs, operator, invariant, information loss, return condition and claim ceiling.",
    "Historical provenance and formal support must never share one undifferentiated status label.",
    "A visual can illustrate a controlled relation but cannot promote its evidence class.",
    "New ladders enter the supporting or historical archive before they can join the eight-card core.",
    "The public Navigator allowlist remains unchanged; this atlas is internal and read-only."
  ],
  "known_version_conflicts": [
    {
      "title": "EMP-05 poster lag",
      "resolution": "The poster says 05/06 and announces Run 06; the frozen structured run summary contains Run 06 PASS. Treat the CSV and freeze records as controlling."
    },
    {
      "title": "E0–E4 vocabulary drift",
      "resolution": "Earlier September records use different rung meanings. This atlas binds the scheme to NEXAH_CURRENT_TOTAL_OVERVIEW_2026-09-18.md and does not silently rewrite older records."
    }
  ]
};
