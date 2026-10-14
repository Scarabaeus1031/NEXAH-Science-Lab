import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const scienceLabRepo = path.resolve(here, "../../../..");
const ecosystemRoot = path.resolve(scienceLabRepo, "../..");
const binderPath = path.join(here, "MRB_ACR_NCS_Q106_RETURN_CROSSWALK_BINDER_V1_2026-10-11.json");
const binder = JSON.parse(fs.readFileSync(binderPath, "utf8"));
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const sha256 = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");

check(binder.node_id === "NN:MRB_ACR_NCS_Q106_RETURN_CROSSWALK", "stable lens node id");
check(binder.status === "INTERNAL_SOURCE_BOUND_EVIDENCE_LENS", "internal source-bound status");
check(binder.publication_authorized === false, "publication remains false");
check(binder.changes_canonical_module_count === false, "module count unchanged");
check(binder.changes_canonical_family_count === false, "family count unchanged");
check(JSON.stringify(binder.identity_reuse?.module_ids) === JSON.stringify(["MOD:NUMBER_VIEW_SUITE", "MOD:READOUT_RECONSTRUCTION"]), "existing modules reused");
check(binder.identity_reuse?.artifact_ids?.includes("ART:NUMBER:PRIMEGRID_BLOCK02B_TRINARY_ANTIPODE"), "Primegrid identity reused");

const expectedMrbIds = Array.from({length: 10}, (_, index) => `MRB-${String(index + 1).padStart(2, "0")}`);
check(JSON.stringify(binder.mrb_series.map((item) => item.id)) === JSON.stringify(expectedMrbIds), "complete MRB-01 through MRB-10 ordinal census");
const mrb03 = binder.mrb_series.find((item) => item.id === "MRB-03");
check(mrb03?.status === "DOCUMENTATION_GAP_NO_SOURCE_PACKAGE", "MRB-03 gap retained");
check(mrb03?.route_stage === null, "MRB-03 contributes no inferred route stage");

for (const source of binder.sources) {
  const sourcePath = path.join(ecosystemRoot, source.path);
  check(fs.existsSync(sourcePath), `source exists ${source.source_id}`);
  if (fs.existsSync(sourcePath)) check(sha256(sourcePath) === source.sha256, `source hash ${source.source_id}`);
}

const sourceById = Object.fromEntries(binder.sources.map((source) => [source.source_id, source]));
for (const id of ["01", "02", "04", "05", "06", "07", "08", "09", "10"]) {
  check(Boolean(sourceById[`SRC:NN:MRB${id}`]), `MRB-${id} result source bound`);
}

const auditPath = path.join(ecosystemRoot, sourceById["SRC:NN:NCS_X20_Q106_INTERTWINER_AUDIT"].path);
const audit = JSON.parse(fs.readFileSync(auditPath, "utf8"));
check(audit.status === "PASS_UNDEFINED_CONTRACT_ADJACENCY_MISSING", "intertwiner audit status retained");
check(audit.classification === "UNDEFINED_CONTRACT_ADJACENCY_MISSING", "intertwiner classification retained");
check(audit.summary?.checks_passed === audit.summary?.checks_total, "intertwiner audit checks pass");
check(audit.summary?.rotation_equivariant_bijections === 15000, "rotation-equivariant count retained");
check(audit.summary?.d5_equivariant_bijections === 24, "D5-equivariant count retained");
check(audit.summary?.typed_intertwiner_to_q106 === null, "typed intertwiner remains null");

const acrPath = path.join(ecosystemRoot, sourceById["SRC:NN:ACR44"].path);
const acr = JSON.parse(fs.readFileSync(acrPath, "utf8"));
check(acr.tests?.mid_side_exactly_reconstructs_axes === true, "ACR-44 exact basis inverse retained");
check(acr.tests?.all_four_rational_ratios_close === true, "ACR-44 rational closure retained");
check(acr.decision?.PHASE_AND_EVENT_ORIGIN === "DEPEND_ON_START_AND_DIRECTION_METADATA", "ACR-44 metadata gate retained");
check(acr.decision?.REAL_GROOVE_OR_AUDIO_VALIDATION === "NOT_PERFORMED", "ACR-44 real-signal boundary retained");

const triplePath = path.join(ecosystemRoot, sourceById["SRC:NN:TRIPLE19_PC_PD"].path);
const triple = JSON.parse(fs.readFileSync(triplePath, "utf8"));
check(triple.creates_new_identity === false, "Triple-19 creates no identity");
check(triple.relation?.intertwiner === null, "Triple-19 intertwiner remains null");
check(binder.triple19_relation?.status === "RELATED_NON_IDENTITY_SHARED_C2_FACTOR_ONLY", "Triple-19 relation records bounded shared factor only");

const sourceContractPath = path.join(ecosystemRoot, sourceById["SRC:NN:NCS_X20_TYPED_CARRIER_PCPD_Q106_AUDIT"].path);
const sourceContract = JSON.parse(fs.readFileSync(sourceContractPath, "utf8"));
check(sourceContract.status === "PASS_SOURCE_AUDIT_WITH_UNRECOVERED_CONTRACT", "X20 source-contract audit status retained");
check(sourceContract.classification === "SOURCE_CONTRACT_UNRECOVERED", "X20 source-contract classification retained");
check(sourceContract.checks?.passed === 60 && sourceContract.checks?.total === 60, "X20 source-contract checks pass");
check(sourceContract.source_contract?.x20_edge_set === null && sourceContract.source_contract?.x20_edge_types === null, "X20 edge contract remains null");
check(sourceContract.source_contract?.triple19_to_x20_map === null, "Triple-19 to X20 map remains null");
check(sourceContract.candidate_gate?.d5_equivariant_charts === 24 && sourceContract.candidate_gate?.adjacency_tests_executed === 0, "twenty-four D5 charts blocked before comparison");
check(/P_c and P_d are oriented-state constructors/.test(sourceContract.correction || ""), "Triple-19 constructor/involution typing corrected");

const factorPath = path.join(ecosystemRoot, sourceById["SRC:NN:TRIPLE19_X40_C2_FACTOR_AUDIT"].path);
const factor = JSON.parse(fs.readFileSync(factorPath, "utf8"));
check(factor.status === "PASS_SHARED_C2_ORIENTATION_FACTOR_WITH_QUOTIENT_LOSS", "Triple-19/X40 C2 factor audit passed");
check(factor.classification === "SHARED_C2_FACTOR_ORIENTATION_LOST_IN_X20_QUOTIENT", "C2 factor and quotient-loss classification retained");
check(factor.checks?.passed === 50 && factor.checks?.total === 50, "C2 factor checks pass");
check(factor.shared_factor?.factor === "C2_orientation" && factor.shared_factor?.compatible_x40_operators?.length === 2, "both Janus laws induce shared C2 flip");
check(factor.quotient?.fibres === 20 && factor.quotient?.orientation_factors_through_x20 === false, "X40-to-X20 quotient erases orientation factor");
check(factor.base_cycle_obstruction?.nontrivial_homomorphisms === 0, "no nontrivial C7-to-C5 homomorphism");
check(factor.maps?.full_carrier_intertwiner === null && factor.shared_factor?.historical_janus_selection === null, "full intertwiner and Janus selection remain null");

const clockworkLiftPath = path.join(ecosystemRoot, sourceById["SRC:NN:CLOCKWORK_PQ_C2_LIFT_AUDIT"].path);
const clockworkLift = JSON.parse(fs.readFileSync(clockworkLiftPath, "utf8"));
check(clockworkLift.status === "PASS_UNLABELED_C2_DISPLAY_LIFT", "Clockwork p/q C2 display-lift audit passed");
check(clockworkLift.classification === "CLOCKWORK_PQ_REALIZES_TWO_SHEET_DISPLAY_LIFT_WITH_GLOBAL_LABEL_AMBIGUITY", "Clockwork p/q bounded classification retained");
check(clockworkLift.checks?.passed === 37 && clockworkLift.checks?.total === 37, "Clockwork p/q display-lift checks pass");
check(clockworkLift.display_lift?.states === 40 && clockworkLift.display_lift?.base_states === 20 && clockworkLift.display_lift?.fibre_size === 2, "Clockwork display lift has forty states over twenty two-state fibres");
check(clockworkLift.display_lift?.admissible_global_labelings === 2 && clockworkLift.display_lift?.canonical_orientation_bit_to_pq_labeling === null, "both global p/q labelings remain admissible and no canonical labeling is selected");
check(JSON.stringify(clockworkLift.display_lift?.compatible_x40_operators) === JSON.stringify(["J_c", "J_d"]), "both X40 Janus candidates act as sheet flips");
check(clockworkLift.gamma_basis?.status === "DISPLAY_BASIS_ONLY_NOT_NUMERIC_NCS_OPERATOR", "p/q sum-difference basis remains display-only");
check(clockworkLift.maps?.clockwork_glb_nodes_to_x20 === null && clockworkLift.maps?.x20_adjacency === null, "Clockwork supplies neither GLB-node map nor X20 adjacency");
check(clockworkLift.maps?.triple19_to_x20 === null && clockworkLift.maps?.typed_x20_to_q106_intertwiner === null, "Clockwork supplies neither Triple-19 map nor typed Q106 intertwiner");
check(clockworkLift.maps?.historical_janus_selection === null, "Clockwork does not select a historical Janus law");
check(binder.clockwork_pq_c2_lift_gate?.canonical_orientation_bit_to_pq_labeling === null, "binder preserves unlabeled Clockwork lift");

const pq1718Path = path.join(ecosystemRoot, sourceById["SRC:NN:PQ_17_18_COUNTERROTATION_SELECTOR_AUDIT"].path);
const pq1718 = JSON.parse(fs.readFileSync(pq1718Path, "utf8"));
check(pq1718.status === "PASS_CONDITIONAL_ORDERED_17_18_SELECTOR", "P/Q 17/18 conditional selector audit passed");
check(pq1718.checks?.passed === 18 && pq1718.checks?.total === 18, "P/Q 17/18 selector checks pass");
check(pq1718.candidate_contract?.ordered_register_assignment?.P === 17 && pq1718.candidate_contract?.ordered_register_assignment?.Q === 18, "Owner-declared ordered P/Q register bridge retained");
check(pq1718.candidate_contract?.parity === "e(n)=n mod 2" && pq1718.candidate_contract?.turn_encoding === "turn=2e-1", "parity and turn selector retained");
check(pq1718.candidate_contract?.selected_labeling?.["e=1"] === "P / 17 / +1 turn" && pq1718.candidate_contract?.selected_labeling?.["e=0"] === "Q / 18 / -1 turn", "conditional P/Q bit labeling retained");
check(pq1718.authority?.canonical_within_declared_contract === true && pq1718.authority?.canonical_without_owner_contract === false, "conditional authority boundary retained");
check(pq1718.authority?.historical_source_recovery === null, "historical 17/18 order remains unrecovered");
check(pq1718.maps?.x20_adjacency === null && pq1718.maps?.typed_x20_to_q106_intertwiner === null, "selector creates neither X20 adjacency nor Q106 intertwiner");

const beadReturnPath = path.join(ecosystemRoot, sourceById["SRC:NN:CLOCKWORK_BEAD_X40_P4_RETURN_AUDIT"].path);
const beadReturn = JSON.parse(fs.readFileSync(beadReturnPath, "utf8"));
check(beadReturn.status === "PASS_CONDITIONAL_DIHEDRAL_BEAD_QUOTIENT_WITH_P4_RESIDUAL_RETURN", "Clockwork bead/X40 residual-Return audit passed");
check(beadReturn.checks?.passed === 49 && beadReturn.checks?.total === 49, "Clockwork bead/X40 checks pass");
check(beadReturn.carrier_attachment?.source === "X40=C5×P4×C2" && beadReturn.carrier_attachment?.display === "B10=C5×{P,Q}", "X40 source and ten-bead display carriers retained");
check(beadReturn.carrier_attachment?.global_phase_charts === 5 && beadReturn.carrier_attachment?.historical_phase_chart === null, "five phase charts and null historical phase origin retained");
check(beadReturn.carrier_attachment?.fibre_size === 4 && beadReturn.carrier_attachment?.pointwise_minimal_residual_bits === 2, "four-state P4 fibres and two-bit Return residual retained");
check(beadReturn.operator_result?.selected_on_display_quotient?.startsWith("J_d") && beadReturn.operator_result?.rejected_on_display_quotient?.startsWith("J_c"), "Jd selected and Jc rejected on displayed quotient");
check(beadReturn.operator_result?.historical_ncs_janus_selection === null, "historical NCS Janus selection remains null");
check(beadReturn.glb_node_mapping?.unique_glb_node_to_x40_state === null && beadReturn.glb_node_mapping?.unique_glb_node_to_x20_state === null, "GLB beads do not uniquely identify X40 or X20 states");
check(beadReturn.maps?.x20_adjacency === null && beadReturn.maps?.typed_x20_to_q106_intertwiner === null, "bead quotient supplies neither X20 adjacency nor Q106 intertwiner");

const wobblePath = path.join(ecosystemRoot, sourceById["SRC:NN:PQ_17_29_18_36_C30_P4_WOBBLE_AUDIT"].path);
const wobble = JSON.parse(fs.readFileSync(wobblePath, "utf8"));
check(wobble.status === "PASS_CONDITIONAL_C30_COUNTERSTEP_WITH_P4_WOBBLE_TYPE_GATE", "17/29 and 18/36 C30/P4 wobble audit passed");
check(wobble.checks?.passed === 38 && wobble.checks?.total === 38, "C30/P4 wobble checks pass");
check(wobble.c30_c5_result?.increments_C30?.P === 12 && wobble.c30_c5_result?.increments_C30?.Q === 18, "C30 increments 12 and 18 retained");
check(wobble.c30_c5_result?.embedded_C5_steps?.P === 2 && wobble.c30_c5_result?.embedded_C5_steps?.Q === -2, "opposite C5 generator steps retained");
check(wobble.phase_chart_gate?.charts_compatible_with_mirror_pairs_alone === 5, "mirror pairs alone retain five charts");
check(wobble.phase_chart_gate?.selected_chart_under_numeric_address_convention === 0 && wobble.phase_chart_gate?.historical_phase_chart === null, "conditional chart zero and null historical phase retained");
check(wobble.wobble_gate?.full_phase_tag?.closes_parent_four_state_bead_fibre === true, "full mod-four tag closes P4 fibre");
check(wobble.wobble_gate?.pulse_only?.closes_parent_four_state_bead_fibre === false, "binary every-four pulse does not close P4 fibre");
check(wobble.wobble_gate?.source_semantics_selected === null && wobble.maps?.glb_wobble_to_p4 === null, "wobble source semantics and GLB-to-P4 map remain null");
check(wobble.maps?.x20_adjacency === null && wobble.maps?.typed_x20_to_q106_intertwiner === null, "wobble audit supplies neither X20 adjacency nor Q106 intertwiner");

const root40FibonacciPath = path.join(ecosystemRoot, sourceById["SRC:NN:ROOT40_FIBONACCI_C30_P4_SOURCE_BINDING_AUDIT"].path);
const root40Fibonacci = JSON.parse(fs.readFileSync(root40FibonacciPath, "utf8"));
check(root40Fibonacci.status === "PASS_EXISTING_PASCAL_QUATERNION_CONNECTOR_REUSED_ROOT40_OUTSIDE_IMAGE_NCS_P4_ADAPTER_NULL", "corrected Root-40/Fibonacci connector-reuse audit passed");
check(root40Fibonacci.checks?.passed === 59 && root40Fibonacci.checks?.total === 59, "corrected Root-40/Fibonacci checks pass");
check(root40Fibonacci.source_closure?.root40_scientific_hash === "cc7d402a48416df4ad08875245c92384c625d66247abc8ce00b4b06a4ec523ee", "existing Root-40 scientific hash retained");
check(root40Fibonacci.c30_schedule?.fibonacci_pair_period === 6 && root40Fibonacci.c30_schedule?.joint_period === 30, "Fibonacci C6 and joint C30 periods retained");
check(root40Fibonacci.existing_pascal_quaternion_connector?.status === "CLOSED_OWNER_ACCEPTED_EXACT_FOUR_CHANNEL_CONNECTOR_PASS", "existing closed Pascal-quaternion connector reused");
check(root40Fibonacci.existing_pascal_quaternion_connector?.slot_semantics?.scalar === "depth=a+b+c" && root40Fibonacci.existing_pascal_quaternion_connector?.slot_semantics?.i === "a" && root40Fibonacci.existing_pascal_quaternion_connector?.slot_semantics?.j === "b" && root40Fibonacci.existing_pascal_quaternion_connector?.slot_semantics?.k === "c", "canonical Pascal quaternion slot semantics retained");
check(root40Fibonacci.root40_pascal_connector_test?.in_pascal_phi_image === false && root40Fibonacci.root40_pascal_connector_test?.pascal_required_scalar === 10 && root40Fibonacci.root40_pascal_connector_test?.observed_scalar === 2, "Root-40 record correctly rejected from Pascal Phi image");
check(root40Fibonacci.root40_p4_gate?.ordered_signed_integer_norm40_records === 144, "144 ordered signed norm-40 quaternion records retained");
check(root40Fibonacci.root40_p4_gate?.possible_slot_to_role_bijections === 24 && root40Fibonacci.root40_p4_gate?.canonical_slot_to_role_map === null, "24 unresolved cross-type NCS P4 role adapters retained");
check(/full-carrier intertwiner null/.test(root40Fibonacci.existing_operator_controls?.triple19_antipode || "") && /grouping lens, not a shared generator/.test(root40Fibonacci.existing_operator_controls?.con_dao || ""), "Triple-19 and CON-DAO typed controls retained");
check(root40Fibonacci.maps?.fibonacci_to_x20_or_x40 === null && root40Fibonacci.maps?.root40_slots_to_p4_roles === null, "Fibonacci transport and Root-40 slot role map remain null");
check(root40Fibonacci.maps?.x20_adjacency === null && root40Fibonacci.maps?.typed_x20_to_q106_intertwiner === null, "Root-40/Fibonacci gate supplies neither X20 adjacency nor Q106 intertwiner");

const p4AdapterPath = path.join(ecosystemRoot, sourceById["SRC:NN:PASCAL_QUATERNION_NCS_P4_ADAPTER_GATE_AUDIT"].path);
const p4Adapter = JSON.parse(fs.readFileSync(p4AdapterPath, "utf8"));
check(p4Adapter.status === "PASS_NO_OPERATOR_EQUIVARIANT_ADAPTER_UNDER_DECLARED_NCS_ACTION", "Pascal-quaternion to NCS P4 adapter gate passed");
check(p4Adapter.checks?.passed === 31 && p4Adapter.checks?.total === 31, "P4 adapter gate checks pass");
check(p4Adapter.enumeration?.static_bijections === 24 && p4Adapter.enumeration?.exact_address_return === 24, "24 reversible static P4 address adapters retained");
check(p4Adapter.enumeration?.operator_equivariant_adapters === 0, "zero operator-equivariant adapters under declared NCS role action");
check(p4Adapter.enumeration?.distinct_induced_role_c3_actions === 8 && p4Adapter.enumeration?.adapters_per_induced_action === 3, "eight possible induced role C3 actions with three adapters each retained");
check(p4Adapter.lexical_candidate?.source_declared === false && p4Adapter.lexical_candidate?.operator_equivariant === false, "lexical slot-to-role candidate remains unprivileged and non-equivariant");
check(p4Adapter.decision?.canonical_ncs_p4_adapter === null && p4Adapter.decision?.typed_x20_to_q106_intertwiner === null, "canonical NCS P4 adapter and Q106 intertwiner remain null");

const life06dContractPath = path.join(ecosystemRoot, sourceById["SRC:NN:LIFE06D_PQB_CONTRACT"].path);
const life06dReportPath = path.join(ecosystemRoot, sourceById["SRC:NN:LIFE06D_PQB_REPORT"].path);
const life06dValidationPath = path.join(ecosystemRoot, sourceById["SRC:NN:LIFE06D_VALIDATION"].path);
const life06dContract = JSON.parse(fs.readFileSync(life06dContractPath, "utf8"));
const life06dReport = JSON.parse(fs.readFileSync(life06dReportPath, "utf8"));
const life06dValidation = JSON.parse(fs.readFileSync(life06dValidationPath, "utf8"));
check(life06dContract.status === "DESCRIPTIVE_FORMAL_AUDIT_NO_NEW_PRIMARY_HYPOTHESIS", "LIFE06D descriptive formal-audit boundary retained");
check(life06dContract.relations?.scale_conjugate === "q- = P/alpha and q+ = P*alpha, hence q-*q+ = P^2", "LIFE06D scale-conjugacy operator retained");
check(/conditional equivalence classes, not identities or mechanisms/.test(life06dContract.claim_ceiling || ""), "LIFE06D conditional-fibre non-identity boundary retained");
check(life06dReport.status === "CLOSED_CONDITIONAL_IDENTIFIABILITY", "LIFE06D conditional-identifiability audit remains closed");
check(life06dReport.integerConjugacy?.result === "NO_NONTRIVIAL_DISTINCT_POSITIVE_INTEGER_SCALE_CONJUGATES_FOR_PRIME_CENTERS", "LIFE06D integer scale-conjugacy negative control retained");
check(life06dValidation.status === "PASS" && life06dValidation.checks_passed === 18 && life06dValidation.checks_total === 18, "LIFE06D validation passes 18/18");
check(binder.life06d_pqb_control_gate?.relation_to_clockwork_pq === "TYPED_ANALOGY_NON_IDENTITY_CONTROL", "LIFE06D is bound as typed non-identity control");
check(binder.life06d_pqb_control_gate?.canonical_orientation_bit_to_pq_labeling === null, "LIFE06D does not assign the Clockwork orientation bit");

const triplesixPath = path.join(ecosystemRoot, sourceById["SRC:NN:TRIPLESIX_S3_CUBE_GRID_FOLD_AUDIT"].path);
const triplesix = JSON.parse(fs.readFileSync(triplesixPath, "utf8"));
check(triplesix.status === "PASS_PARTIAL_AXIS_SIDE_BRIDGE_WITH_MULTIAXIS_FOLD_LOSS", "TripleSix cube-grid fold audit passed");
check(triplesix.classification === "S3_AXIS_C2_ADDRESS_SINGLE_AXIS_SUFFICIENT_MULTIAXIS_INSUFFICIENT", "TripleSix bounded bridge classification retained");
check(triplesix.checks?.passed === 58 && triplesix.checks?.total === 58, "TripleSix cube-grid checks pass");
check(triplesix.triplesix?.carrier === "S3" && triplesix.triplesix?.states === 6, "TripleSix S3 six-state carrier retained");
check(triplesix.grid_fold?.profiles?.["3"]?.["8"] === 1, "one eight-state 3D pivot fibre retained");
check(triplesix.bridge_limit?.full_cube_grid_identity === false, "cube-grid identity remains false");
check(triplesix.maps?.canonical_cube_63_to_64_inverse === null && triplesix.maps?.historical_janus_selection === null, "inverse and historical Janus selection remain null");

const generalFoldPath = path.join(ecosystemRoot, sourceById["SRC:NN:GENERAL_COORDINATE_FOLD_RETURN_AUDIT"].path);
const generalFold = JSON.parse(fs.readFileSync(generalFoldPath, "utf8"));
check(generalFold.status === "PASS_GENERAL_COORDINATE_FOLD_PROFILE_AND_MINIMAL_RESIDUAL_RETURN", "general coordinate-fold audit passed");
check(generalFold.classification === "EXACT_FIBRE_PROFILE_POINTWISE_K_BITS_UNIFORM_D_BITS", "general fold classification retained");
check(generalFold.checks?.passed === 101 && generalFold.checks?.total === 101, "general coordinate-fold checks pass");
check(generalFold.return?.pointwise_minimal_bits === "k(y)" && generalFold.return?.uniform_fixed_width_minimal_bits === "d", "minimal residual Return retained");
check(generalFold.a0_bl_025?.full_grid_fold_channel_specification === "OPEN_ADMISSION_REQUIRED", "full A0-BL-025 remains open");

const channelPath = path.join(ecosystemRoot, sourceById["SRC:NN:GRID_FOLD_CHANNEL_CONTRACT_AUDIT"].path);
const channel = JSON.parse(fs.readFileSync(channelPath, "utf8"));
check(channel.status === "PASS_COMPLETE_FINITE_GRID_FOLD_CHANNEL_FORMAL_DESIGN", "Grid-Fold-Channel formal design passed");
check(channel.classification === "TYPED_INTERFACE_QUOTIENT_UPDATE_AND_MINIMAL_RESIDUAL_RETURN", "Grid-Fold-Channel classification retained");
check(channel.checks?.passed === 55 && channel.checks?.total === 55, "Grid-Fold-Channel checks pass");
check(channel.contract?.fibre_size === "2^(k(y)+g(y)) where g(y)=1 on the glued interface and 0 otherwise", "assembled fibre law retained");
check(channel.a0_bl_025?.formal_design_checklist === "COMPLETE_ON_TWO_NON_IDENTICAL_CONTROLS", "A0-BL-025 formal-design checklist complete");
check(channel.a0_bl_025?.study_admission === "NOT_ADMITTED_REQUIRES_SEPARATE_OWNER_DECISION", "A0-BL-025 admission boundary retained");

const game4lifeBindingPath = path.join(ecosystemRoot, sourceById["SRC:NN:GAME4LIFE_NCS_RETURN_LENS_BINDING"].path);
const game4lifeBinding = JSON.parse(fs.readFileSync(game4lifeBindingPath, "utf8"));
check(game4lifeBinding.identity_reuse?.navigator_lens_id === binder.node_id, "GAME 4 LIFE +1 reuses this stable NN lens identity");
check(game4lifeBinding.identity_reuse?.study_id === "NEXAH_LIFE_BOUNDARY_CYLINDER_LIFE08_2026_10_11", "GAME 4 LIFE +1 retains the closed LIFE08 carrier identity");
check(game4lifeBinding.canonical_count_effect === "NONE" && game4lifeBinding.publication_authorized === false, "application projection changes no canonical count or publication state");
check(binder.game4life_ncs_application_gate?.status === "DURABLE_INTERNAL_VIEW_ADAPTER", "durable GAME 4 LIFE +1 NCS view adapter bound");
check(binder.game4life_ncs_application_gate?.changes_life_operator === false, "NCS application lens does not change the LIFE operator");

check(binder.relations.length === 3, "three typed lens relations");
check(binder.sources.length === 31, "thirty-one source-bound records");
check(binder.relations.every((relation) => Array.isArray(relation.does_not_imply) && relation.does_not_imply.length > 0), "all relations carry non-implications");
check(binder.open_boundaries.includes("X20 source contract remains unrecovered: adjacency and edge types are null"), "X20 graph gap visible");
check(binder.open_boundaries.some((item) => /Owner-declared ordered bridge P-to-17 and Q-to-18 conditionally selects/.test(item) && /historical recovery.+remains null/.test(item)), "conditional 17/18 selector and historical-recovery boundary visible");
check(binder.open_boundaries.some((item) => /ten Clockwork transfer beads represent C5×C2 only/.test(item) && /four-state P4 fibre/.test(item)), "Clockwork bead quotient and P4 fibre boundary visible");
check(binder.open_boundaries.some((item) => /selects Jd rather than Jc only on the declared bead quotient/.test(item) && /historical NCS Janus law remains unselected/.test(item)), "conditional Jd and historical-law boundary visible");
check(binder.open_boundaries.some((item) => /17→29 and 18→36/.test(item) && /not a recovered historical phase origin/.test(item)), "conditional C30 counter-step and phase boundary visible");
check(binder.open_boundaries.some((item) => /full t mod 4 wobble tag/.test(item) && /binary every-four pulse would not/.test(item)), "P4 wobble type boundary visible");
check(binder.open_boundaries.some((item) => /A0-BL-052\/053 already fix/.test(item) && /required scalar is 10, not 2/.test(item)), "existing Pascal connector and Root-40 non-image boundary visible");
check(binder.open_boundaries.some((item) => /all 24 Pascal-slot-to-NCS-role bijections/.test(item) && /zero intertwine/.test(item) && /no canonical NCS P4 adapter exists/.test(item)), "negative NCS P4 operator-adapter result visible");
check(binder.open_boundaries.some((item) => /NCS role action of cycle type \(1,3\)/.test(item) && /typed slot-to-role anchor/.test(item)), "minimal P4 adapter reopening input visible");
check(binder.open_boundaries.some((item) => /Triple-19 supplies an exact antipode/.test(item) && /CON–DAO's 8\+4 display/.test(item)), "Triple-19 and CON-DAO operator boundaries visible");
check(binder.open_boundaries.some((item) => /Fibonacci C6 schedule supplies no typed transport/.test(item)), "Fibonacci transport boundary visible");
check(binder.open_boundaries.some((item) => /LIFE06D Q-\/Q\+ are scale conjugates/.test(item)), "LIFE06D versus Clockwork P/Q type distinction visible");
check(/no carrier identity/i.test(binder.claim_ceiling), "claim ceiling blocks carrier identity");

if (failures.length) {
  console.error(JSON.stringify({status: "FAIL", failures}, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  status: "PASS",
  node_id: binder.node_id,
  mrb_ordinals: binder.mrb_series.length,
  bound_sources: binder.sources.length,
  relations: binder.relations.length,
  intertwiner_status: binder.intertwiner_gate.status,
  typed_intertwiner_to_q106: binder.intertwiner_gate.typed_intertwiner_to_q106,
  publication_authorized: binder.publication_authorized
}, null, 2));
