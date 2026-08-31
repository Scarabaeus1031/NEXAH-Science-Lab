# Subpackage Status Ledger

Date: `2026-08-29`

Each entry preserves native result wording. `RESEARCH_AUTHORIZATION=NO` is the custody gate, not a rewrite of the native record.

## GPT-01

- `PACKAGE_ID`: `03-6_9_Transformation_Test`
- `NATIVE_TEST_ID`: `GPT-01`
- `NATIVE_TITLE`: `6 ↔ 9 Transformation Test`
- `RESEARCH_QUESTION`: Does a frozen glyph mask for 6 map to the frozen glyph mask for 9 under a predeclared global 180° rotation?
- `PREDECESSOR_OR_PARENT`: `NONE_STATED`
- `INPUTS`: frozen DejaVu Sans Mono glyph masks
- `METHOD`: global 180° mask rotation and IoU
- `CONTROLS`: no translation, deformation or manual alignment; exact threshold 0.98
- `PRIMARY_RESULT`: `GLYPH_TRANSFORMATION_SUPPORTED=YES; ARITHMETIC_RELATION_DERIVED=NO`
- `NATIVE_STATUS`: `TERMINAL_RESULT_PRESENT; EXPLICIT_CLOSED_LABEL_ABSENT`
- `FINAL_DECISION_PRESENT`: `YES_TERMINAL_RESULT_REPORT`
- `STRUCTURED_RESULTS_PRESENT`: `YES`
- `CODE_PRESENT`: `NO`
- `EXECUTION_REQUIRED_FOR_VALIDATION`: `NO_FOR_CUSTODY_INTEGRITY`
- `BOUNDARIES`: font-representation evidence only; no integer relation
- `SUPERSESSION`: `NONE_STATED`
- `REOPEN_CONDITION`: `NONE_STATED; NEW_RUN_NOT_AUTHORIZED`
- `RESEARCH_AUTHORIZATION`: `NO`
- `ORION_DELTA_CLAIM`: `NONE_STATED`
- `NVC01_RELATION`: `ROTATE aligns only as a typed representation-specific use; no retroactive semantic change`
- `DUPLICATE_RELATION`: `NONE_EXACT`
- `TECHNICAL_STATUS`: `COMPLETE_REPRESENTATION_ONLY`
- `CUSTODY_CLASS`: `CLOSED_TEST_ARTIFACT`

## CROA-01

- `PACKAGE_ID`: `CROA01_DOWNLOAD`
- `NATIVE_TEST_ID`: `CROA-01`
- `NATIVE_TITLE`: `Cross-Representation Operator Audit`
- `RESEARCH_QUESTION`: Does one predeclared operator recur across at least two independently specified representations with compatible type, arity, preservation and loss profiles?
- `PREDECESSOR_OR_PARENT`: `GPT-01_ROTATION_ONLY_IMPORTED_FOR_R4`
- `INPUTS`: frozen R1–R6 supplied representations plus GPT-01 rotation only
- `METHOD`: typed local tests and cross-representation matrix
- `CONTROLS`: neutral relabel; anti-overfitting; no post-hoc operator additions except frozen GPT-01 import
- `PRIMARY_RESULT`: `E_NO_STABLE_CROSS_REPRESENTATION_OPERATOR_RECURRENCE`
- `NATIVE_STATUS`: `CLOSED`
- `FINAL_DECISION_PRESENT`: `YES`
- `STRUCTURED_RESULTS_PRESENT`: `YES`
- `CODE_PRESENT`: `NO`
- `EXECUTION_REQUIRED_FOR_VALIDATION`: `NO_FOR_CUSTODY_INTEGRITY`
- `BOUNDARIES`: local structures differ in type/arity/profile; R1 and R3 underdefined; R2 triangle introduced by representation
- `SUPERSESSION`: `NONE_STATED`
- `REOPEN_CONDITION`: `NONE; NEXT_ACTION=STOP`
- `RESEARCH_AUTHORIZATION`: `NO`
- `ORION_DELTA_CLAIM`: `NONE`
- `NVC01_RELATION`: `typed-operator distinctions align; no vocabulary delta`
- `DUPLICATE_RELATION`: `NONE_EXACT`
- `TECHNICAL_STATUS`: `NEGATIVE_CLOSED`
- `CUSTODY_CLASS`: `CLOSED_TEST_ARTIFACT`

## ATS-01

- `PACKAGE_ID`: `ATS01_DOWNLOAD`
- `NATIVE_TEST_ID`: `ATS-01`
- `NATIVE_TITLE`: `Anchor Transport System`
- `RESEARCH_QUESTION`: Is bounded anchor-to-anchor transport well-defined, and is it prime-specific?
- `PREDECESSOR_OR_PARENT`: `NONE_STATED`
- `INPUTS`: integers, `T(n)=n+1`, prime and neutral anchor predicates
- `METHOD`: complete deterministic traces to the next anchor
- `CONTROLS`: multiple prime traces; divisible-by-5 neutral predicate; inverse/return and information tests
- `PRIMARY_RESULT`: `B_DISCRETE_ANCHOR_TRANSPORT_IS_WELL_DEFINED_BUT_GENERIC`
- `NATIVE_STATUS`: `CLOSED`
- `FINAL_DECISION_PRESENT`: `YES`
- `STRUCTURED_RESULTS_PRESENT`: `YES`
- `CODE_PRESENT`: `NO`
- `EXECUTION_REQUIRED_FOR_VALIDATION`: `NO_FOR_CUSTODY_INTEGRITY`
- `BOUNDARIES`: transport is generic iteration; primality is only an anchor selector; inverse is not return
- `SUPERSESSION`: `NONE_STATED`
- `REOPEN_CONDITION`: `NONE; NEXT_ACTION=STOP`
- `RESEARCH_AUTHORIZATION`: `NO`
- `ORION_DELTA_CLAIM`: `NONE`
- `NVC01_RELATION`: `TRACE/EXECUTION/INVERSE/RETURN distinctions align`
- `DUPLICATE_RELATION`: `NONE_EXACT`
- `TECHNICAL_STATUS`: `GENERIC_CLOSED`
- `CUSTODY_CLASS`: `CLOSED_TEST_ARTIFACT`

## PAT-01

- `PACKAGE_ID`: `PAT01_DOWNLOAD`
- `NATIVE_TEST_ID`: `PAT-01`
- `NATIVE_TITLE`: `Prime Anchor Trace`
- `RESEARCH_QUESTION`: What survives in the frozen prime-index/value/trace window under the imported `+1` transition?
- `PREDECESSOR_OR_PARENT`: `ATS-01_TRANSITION_IMPORTED`
- `INPUTS`: prime indices 23–27 and integer window 83–104, extended only to identify 107
- `METHOD`: anchor/gap/complete-trace ledgers and normalized coordinates
- `CONTROLS`: fixed profile classes; factorization check; anti-overfitting gate; no secondary encoder
- `PRIMARY_RESULT`: `B_LOCAL_PRIME_TRACE_SHOWS_ONLY_STANDARD_GAP_AND_TRACE_STRUCTURE`
- `NATIVE_STATUS`: `CLOSED`
- `FINAL_DECISION_PRESENT`: `YES`
- `STRUCTURED_RESULTS_PRESENT`: `YES`
- `CODE_PRESENT`: `NO`
- `EXECUTION_REQUIRED_FOR_VALIDATION`: `NO_FOR_CUSTODY_INTEGRITY`
- `BOUNDARIES`: normalization adds no arithmetic content; 31/33/35 and 24/34 not derived
- `SUPERSESSION`: `NONE_STATED`
- `REOPEN_CONDITION`: `NONE; NEXT_ACTION=STOP`
- `RESEARCH_AUTHORIZATION`: `NO`
- `ORION_DELTA_CLAIM`: `NONE`
- `NVC01_RELATION`: `TRACE/STATE distinctions align; no new operator`
- `DUPLICATE_RELATION`: `NONE_EXACT`
- `TECHNICAL_STATUS`: `BOUNDED_STANDARD_STRUCTURE_CLOSED`
- `CUSTODY_CLASS`: `CLOSED_TEST_ARTIFACT`

## IPG-01

- `PACKAGE_ID`: `IPG01_DOWNLOAD`
- `NATIVE_TEST_ID`: `IPG-01`
- `NATIVE_TITLE`: `Identity, Provenance and Generation`
- `RESEARCH_QUESTION`: Can identity, class, similarity, provenance and generation be kept formally distinct in a bounded synthetic model?
- `PREDECESSOR_OR_PARENT`: `NONE_STATED`
- `INPUTS`: synthetic object, specification, instances and derivation graph
- `METHOD`: typed ledgers, relation definitions, provenance-loss and generation controls
- `CONTROLS`: near-match instance, unattested identical-observation instance, time-order and invisible-copy controls
- `PRIMARY_RESULT`: `A_IDENTITY_PROVENANCE_GENERATION_FORM_DISTINCT_FORMAL_LAYERS`
- `NATIVE_STATUS`: `CLOSED`
- `FINAL_DECISION_PRESENT`: `YES`
- `STRUCTURED_RESULTS_PRESENT`: `YES`
- `CODE_PRESENT`: `NO`
- `EXECUTION_REQUIRED_FOR_VALIDATION`: `NO_FOR_CUSTODY_INTEGRITY`
- `BOUNDARIES`: observable equivalence does not establish identity or provenance; generation requires a derivation edge
- `SUPERSESSION`: `NONE_STATED`
- `REOPEN_CONDITION`: `NONE; NEXT_ACTION=STOP`
- `RESEARCH_AUTHORIZATION`: `NO`
- `ORION_DELTA_CLAIM`: `NONE`
- `NVC01_RELATION`: `OBJECT/ID, PROVENANCE, GENERATION, EQUIVALENCE and DERIVATION align`
- `DUPLICATE_RELATION`: `NONE_EXACT`
- `TECHNICAL_STATUS`: `POSITIVE_BOUNDED_CLOSED`
- `CUSTODY_CLASS`: `CLOSED_TEST_ARTIFACT`

## ASY-01

- `PACKAGE_ID`: `ASY01_DOWNLOAD`
- `NATIVE_TEST_ID`: `ASY-01`
- `NATIVE_TITLE`: `Asymmetry, Orientation and Motion Control`
- `RESEARCH_QUESTION`: What orientation information does a frozen static asymmetry provide, and does it imply motion?
- `PREDECESSOR_OR_PARENT`: `NONE_STATED`
- `INPUTS`: unit disk with frozen radial protrusion and registered rotations
- `METHOD`: symmetry/identifiability analysis
- `CONTROLS`: feature removal, opposite-feature duplication, chirality and explicit dynamic-operator control
- `PRIMARY_RESULT`: `A_ASYMMETRY_SUPPORTS_ORIENTATION_NOT_MOTION`
- `NATIVE_STATUS`: `CLOSED`
- `FINAL_DECISION_PRESENT`: `YES`
- `STRUCTURED_RESULTS_PRESENT`: `YES`
- `CODE_PRESENT`: `NO`
- `EXECUTION_REQUIRED_FOR_VALIDATION`: `NO_FOR_CUSTODY_INTEGRITY`
- `BOUNDARIES`: static orientation is not direction of motion and does not cause motion
- `SUPERSESSION`: `NONE_STATED`
- `REOPEN_CONDITION`: `NONE; NEXT_ACTION=STOP`
- `RESEARCH_AUTHORIZATION`: `NO`
- `ORION_DELTA_CLAIM`: `NONE`
- `NVC01_RELATION`: `ORIENTATION_NE_MOTION aligns exactly`
- `DUPLICATE_RELATION`: `NONE_EXACT`
- `TECHNICAL_STATUS`: `POSITIVE_BOUNDED_CLOSED`
- `CUSTODY_CLASS`: `CLOSED_TEST_ARTIFACT`

## IOTB-01

- `PACKAGE_ID`: `IOTB01_DOWNLOAD`
- `NATIVE_TEST_ID`: `IOTB-01`
- `NATIVE_TITLE`: `Identity–Orientation–Trace Binder`
- `RESEARCH_QUESTION`: Can three closed audits be represented by a minimal non-collapsing typed binder?
- `PREDECESSOR_OR_PARENT`: `IPG-01 + ASY-01 + ATS-01`
- `INPUTS`: the three closed audits as constraints, not recalculations
- `METHOD`: five-field record plus separate operator, execution, trace and derivation objects
- `CONTROLS`: pairwise implications, identity/orientation, state/history, generation/transformation, return/history, neutral relabel and anti-collapse gate
- `PRIMARY_RESULT`: `A_THREE_CLOSED_AUDITS_FORM_COHERENT_NONCOLLAPSING_BINDER`
- `NATIVE_STATUS`: `CLOSED`
- `FINAL_DECISION_PRESENT`: `YES`
- `STRUCTURED_RESULTS_PRESENT`: `YES`
- `CODE_PRESENT`: `NO`
- `EXECUTION_REQUIRED_FOR_VALIDATION`: `NO_FOR_CUSTODY_INTEGRITY`
- `BOUNDARIES`: generic minimal binder for three audits; not a new ontology or universal architecture
- `SUPERSESSION`: `NONE_STATED`
- `REOPEN_CONDITION`: `NONE; NEXT_ACTION=STOP`
- `RESEARCH_AUTHORIZATION`: `NO`
- `ORION_DELTA_CLAIM`: `NONE`
- `NVC01_RELATION`: `source basis; core non-collapse rules preserved`
- `DUPLICATE_RELATION`: `NONE_EXACT`
- `TECHNICAL_STATUS`: `POSITIVE_BOUNDED_SYNTHESIS_CLOSED`
- `CUSTODY_CLASS`: `CLOSED_TEST_ARTIFACT`

## OVI-01

- `PACKAGE_ID`: `OVI01_DOWNLOAD`
- `NATIVE_TEST_ID`: `OVI-01`
- `NATIVE_TITLE`: `Final Historical Inventory`
- `RESEARCH_QUESTION`: What vocabulary is literally present and what formal status survives in the bounded pre-OVI attachment corpus?
- `PREDECESSOR_OR_PARENT`: `29_FILE_BOUNDED_ATTACHMENT_CORPUS; CHAT_NOT_COMPLETE`
- `INPUTS`: 29 locally available pre-OVI text/Markdown attachments
- `METHOD`: exact occurrence/provenance inventory, normalization and status ledgers
- `CONTROLS`: anti-pattern-hunt; no missing terms, meanings, etymology, number search, glyph semantics or backprojection
- `PRIMARY_RESULT`: `CLOSED_HISTORICAL_INVENTORY; 21 SURVIVING FORMAL TOKENS WITH BOUNDED PROVENANCE`
- `NATIVE_STATUS`: `CLOSED`
- `FINAL_DECISION_PRESENT`: `YES_FINAL_INVENTORY`
- `STRUCTURED_RESULTS_PRESENT`: `YES`
- `CODE_PRESENT`: `NO`
- `EXECUTION_REQUIRED_FOR_VALIDATION`: `NO_FOR_CUSTODY_INTEGRITY`
- `BOUNDARIES`: complete for bounded attachments, not ephemeral chat; counts do not imply validity or novelty
- `SUPERSESSION`: `HISTORICAL_RECORD_PRESERVED_BY_OVR-01_RECONCILIATION`
- `REOPEN_CONDITION`: `NONE; NEXT_ACTION=RETURN_INVENTORY_FOR_RECONCILIATION`
- `RESEARCH_AUTHORIZATION`: `NO`
- `ORION_DELTA_CLAIM`: `NONE`
- `NVC01_RELATION`: `preserved historical source basis`
- `DUPLICATE_RELATION`: `NONE_EXACT`
- `TECHNICAL_STATUS`: `CLOSED_BOUNDED_INVENTORY`
- `CUSTODY_CLASS`: `CLOSED_REFERENCE_INPUT`

## OVR-01

- `PACKAGE_ID`: `OVR01_DOWNLOAD`
- `NATIVE_TEST_ID`: `OVR-01`
- `NATIVE_TITLE`: `Final Reconciliation`
- `RESEARCH_QUESTION`: How do OVI-01’s 21 historical formal survivors reconcile against typed distinctions from IOTB-01?
- `PREDECESSOR_OR_PARENT`: `OVI-01 + IOTB-01`
- `INPUTS`: OVI historical inventory and IOTB typed binder
- `METHOD`: typed reconciliation, provenance effects, redundancy, drift and anti-backprojection controls
- `CONTROLS`: neutral relabel; expression/syllable quarantine; no historical additions or inferred meanings
- `PRIMARY_RESULT`: `A_OVI_VOCABULARY_RECONCILES_TO_SMALLER_TYPED_FORMAL_CORE`
- `NATIVE_STATUS`: `CLOSED`
- `FINAL_DECISION_PRESENT`: `YES`
- `STRUCTURED_RESULTS_PRESENT`: `YES`
- `CODE_PRESENT`: `NO`
- `EXECUTION_REQUIRED_FOR_VALIDATION`: `NO_FOR_CUSTODY_INTEGRITY`
- `BOUNDARIES`: 14 typed operators, 3 formal nonoperators, 4 context-dependent terms; no ontology or universal language
- `SUPERSESSION`: `OVI_HISTORICAL_RECORD_NOT_ERASED; PRESENT_CORE_MEMBERSHIP_RECONCILED`
- `REOPEN_CONDITION`: `NONE; NEXT_ACTION=STOP_AND_REVIEW_RECONCILED_VOCABULARY`
- `RESEARCH_AUTHORIZATION`: `NO`
- `ORION_DELTA_CLAIM`: `NONE`
- `NVC01_RELATION`: `direct source of the closed card`
- `DUPLICATE_RELATION`: `NONE_EXACT`
- `TECHNICAL_STATUS`: `CLOSED_RECONCILIATION`
- `CUSTODY_CLASS`: `CLOSED_REFERENCE_INPUT`

## NVC-01

- `PACKAGE_ID`: `NVC01_DOWNLOAD`
- `NATIVE_TEST_ID`: `NVC-01`
- `NATIVE_TITLE`: `NEXAH — Reconciled Vocabulary`
- `RESEARCH_QUESTION`: `NOT_A_NEW_RESEARCH_QUESTION; BOUNDED_REFERENCE_CARD`
- `PREDECESSOR_OR_PARENT`: `OVI-01 + OVR-01 + IOTB-01`
- `INPUTS`: three closed source records
- `METHOD`: bounded reference presentation
- `CONTROLS`: presentation groups are not operator types; expression and syllables remain unpromoted
- `PRIMARY_RESULT`: `CLOSED_REFERENCE_ARTIFACT`
- `NATIVE_STATUS`: `CLOSED_REFERENCE_ARTIFACT`
- `FINAL_DECISION_PRESENT`: `YES_STATUS_PANEL`
- `STRUCTURED_RESULTS_PRESENT`: `NO_SEPARATE_DATA_LEDGER; COUNTS_EMBEDDED`
- `CODE_PRESENT`: `NO`
- `EXECUTION_REQUIRED_FOR_VALIDATION`: `NO`
- `BOUNDARIES`: no new vocabulary, semantics, grammar, ontology, mathematics, physics or architecture
- `SUPERSESSION`: `NONE; DOES_NOT_REWRITE_NATIVE_REPORTS`
- `REOPEN_CONDITION`: `NONE; NEXT_ACTION=STOP`
- `RESEARCH_AUTHORIZATION`: `NO`
- `ORION_DELTA_CLAIM`: `NONE`
- `NVC01_RELATION`: `SELF; VOCABULARY_REFERENCE`
- `DUPLICATE_RELATION`: `SVG_AND_PNG_ARE_DERIVED_PRESENTATIONS_NOT_EXACT_DUPLICATES`
- `TECHNICAL_STATUS`: `CLOSED_REFERENCE`
- `CUSTODY_CLASS`: `REFERENCE_ARTIFACT`
