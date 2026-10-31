const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const coupler = require(path.join(root, 'a0-tesseract-face-coupler.js'));
const receipt = JSON.parse(fs.readFileSync(path.join(root, 'results/a0-nlk-lshell-finite-grid-observatory-return-2026-10-30.json'), 'utf8'));
const mathfield = fs.readFileSync(path.join(root, 'A0_MATHEMATICAL_JOINTS.html'), 'utf8');
const scienceDesk = fs.readFileSync(path.join(root, 'A0_RESEARCH_DESK.html'), 'utf8');
const builderDesk = fs.readFileSync(path.join(root, 'A0_BUILDER_LOG.html'), 'utf8');
const findings = fs.readFileSync(path.join(root, '..', '32_A0_FINDINGS_AND_PAPER_WORKSPACE_2026-10-11.md'), 'utf8');
const paperE = fs.readFileSync(path.join(root, 'A0_NEXAH_FAMILY_METHOD_WHITE_PAPER.html'), 'utf8');

let checks = 0;
const check = (condition, message) => { assert.ok(condition, message); checks += 1; };

const audit = coupler.auditTransitionTile();
check(audit.pass && audit.addressPass === 512 && audit.residuePass === 512, 'transition tile must return all 512 samples exactly');
check(coupler.TRANSITION_TILE.localAddresses === 16 && coupler.TRANSITION_TILE.seamAddress === 17 && coupler.TRANSITION_TILE.carrier === false, '16+1 must remain sixteen local cells plus a non-carrier seam witness');

const sample = coupler.cubeSamples[173];
const tile = coupler.transitionTileAddress(sample);
const reconstructed = coupler.reconstructTransitionTile(tile);
check(reconstructed.exact && reconstructed.linear === sample.linear, 'complete typed tile receipt must reconstruct the source sample');
const withoutWitness = {...tile};
delete withoutWitness.seamStatus;
const witnessControl = coupler.reconstructTransitionTile(withoutWitness);
check(witnessControl.linear === sample.linear && witnessControl.exact === false, 'missing witness must retain the linear address but fail complete typed equality');

const radial = receipt.radial_observation_coordinate_contract;
check(radial.equations.four_r_squared === '4r^2=dx2^2+dy2^2+dz2^2', 'receipt must state the exact integer radial equation');
const dims = {x:27, y:27, z:25};
const point = {x:18, y:20, z:17};
const dx2 = 2 * point.x - (dims.x - 1);
const dy2 = 2 * point.y - (dims.y - 1);
const dz2 = 2 * point.z - (dims.z - 1);
const fourR2 = dx2 * dx2 + dy2 * dy2 + dz2 * dz2;
const bearing = Math.atan2(Math.abs(dy2), Math.abs(dx2));
check(fourR2 === receipt.verified_example.four_r_squared, 'verified node must reproduce exact 4r^2');
check(Math.abs(Math.sqrt(fourR2) / 2 - receipt.verified_example.radius) < 1e-12, 'verified radius must derive from exact 4r^2');
check(Math.abs(bearing - receipt.verified_example.bearing_radians) < 1e-12, 'verified bearing must derive independently in radians');

check(Object.values(receipt.platonic_seam_cover_contract.face_cycle_counts).join(',') === '4,6,8,12,20', 'Platonic face-cycle counts must remain exact');
check(['EF-NLK-07', 'EF-NLK-08', 'EF-NLK-09', 'EF-NLK-10', 'EF-NLK-11'].every(id => receipt.engineering_findings.some(item => item.id === id)), 'receipt must bind the five engineering findings');
check(receipt.full_tesa_breath.tool_classification === 'CUSTOM_COORDINATED_MULTI_LAYER_VIEW_STACK', 'Full TESA must remain classified as a custom coordinated view stack');
check(receipt.full_tesa_breath.standard_named_tool === false, 'Full TESA must not be presented as a standard named mathematical tool');
check(receipt.finite_framed_observability_lens.classification === 'FINITE_CLOSED_OVER_DECLARED_MODEL_OBSERVABILITY_LENS', 'Plug must remain a finite framed observability lens');
check(receipt.finite_framed_observability_lens.tracked_regions.outside.includes('registered external witnesses'), 'outside tracking must remain limited to registered witnesses');
check(mathfield.includes('id="finite-seam-witness-radial-contract"'), 'Mathfield must expose the bounded lemma');
check(scienceDesk.includes('id="finite-seam-witness-radial-return-20261031"'), 'Science Desk must expose the bounded return');
check(scienceDesk.includes('id="nlk-finite-framed-observability-plug-return-20261031"'), 'Science Desk must expose the finite Plug return');
check(builderDesk.includes('id="nlk-finite-framed-observability-plug-builder-return-20261031"'), 'Builder Desk must expose the finite Plug return');
check(findings.includes('id="finite-seam-witness-radial-documentation-2026-10-31"'), 'Findings workspace must expose the triage anchor');
check(receipt.science_priority_candidate.status === 'OWNER_PRIORITIZED_PREPARATION_ONLY_NOT_ADMITTED_NOT_ACTIVE', 'Goethe–Leibniz candidate must remain preparation-only');
check(receipt.science_priority_candidate.paper_route === 'EXISTING_PAPER_E_METHOD_CASE', 'candidate must reuse existing Paper E');
check(receipt.science_priority_candidate.goethe_channel === 'FRAME_EDGE_ORIENTATION_POLARITY_OVERLAP_PHASE_BOUNDARY_RESPONSE_NOT_WAVELENGTH_SPECTRUM', 'Goethe channel must remain a boundary response, not a wavelength claim');
check(receipt.science_priority_candidate.leibniz_channel === 'TYPED_LAYER_ADJACENCY_OR_LAPLACIAN_PLUS_DECLARED_MULTILAYER_OPERATOR', 'Leibniz channel must remain a typed multilayer operator candidate');
check(scienceDesk.includes('id="nlk-goethe-leibniz-spectrum-priority-20261031"'), 'Science Desk must expose the owner-prioritized methods candidate');
check(builderDesk.includes('id="nlk-goethe-leibniz-spectrum-priority-builder-20261031"'), 'Builder Desk must expose the preparation-only build gate');
check(findings.includes('Owner-prioritized Paper E candidate — Goethe boundary response × Leibniz relational spectrum'), 'Findings workspace must expose the Paper E candidate');
check(receipt.science_priority_candidate.levin_problem_space_crosswalk.status === 'OWNER_REQUESTED_BUILDER_SPECIFICATION_QUEUED_NOT_ACTIVE', 'Levin crosswalk Builder specification must remain queued and inactive');
check(receipt.science_priority_candidate.levin_problem_space_crosswalk.non_identity_boundaries.includes('PLATONIC_BODY_NOT_PLATONIC_SPACE'), 'Platonic Body and Platonic Space must remain non-identical');
check(paperE.includes('id="levin-problem-space-crosswalk"'), 'Paper E must expose the Levin problem-space crosswalk');
check(scienceDesk.includes('id="nlk-levin-problem-space-crosswalk-builder-job-20261031"'), 'Science Desk must expose the owner-requested Builder job');
check(builderDesk.includes('id="nlk-levin-problem-space-crosswalk-builder-job-20261031"'), 'Builder Desk must expose the queued job contract');
check(receipt.science_priority_candidate.toi_dynamic_seam_working_thesis.status === 'DOCUMENTED_METHOD_WORKING_THESIS_NOT_NEW_NUMBER_THEORY', 'TOI must remain a method thesis, not a new number theory');
check(receipt.science_priority_candidate.toi_dynamic_seam_working_thesis.claim_boundaries.includes('TOI_NOT_TOE'), 'TOI and TOE must remain explicitly non-identical');
check(paperE.includes('id="toi-dynamic-seam-working-thesis"'), 'Paper E must expose the TOI dynamic-seam working thesis');
check(scienceDesk.includes('id="nlk-toi-dynamic-seam-working-thesis-20261031"'), 'Science Desk must expose the bounded TOI thesis');
check(builderDesk.includes('id="nlk-toi-dynamic-seam-working-thesis-builder-return-20261031"'), 'Builder Desk must expose the transition-ledger contract');

console.log(`A0 seam witness / radial documentation tests: PASS (${checks} checks)`);
