const fs=require('fs');
const path=require('path');
const crypto=require('crypto');
const root=__dirname;
let passed=0;
function ok(value,label){if(!value)throw new Error(`FAIL: ${label}`);passed++;}
function text(file){return fs.readFileSync(path.join(root,file),'utf8');}
function sha(file){return crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex');}

const receipt=JSON.parse(text('results/a0-primecube-sz-khipu-paper-return-2026-11-22.json'));
const desk=text('A0_RESEARCH_DESK.html');
const workspace=text('../32_A0_FINDINGS_AND_PAPER_WORKSPACE_2026-10-11.md');
const paperC=text('../34_A0_RETURN_WITHOUT_IDENTITY_PAPER_DRAFT_2026-10-11.md');
const paperE=text('../35_NEXAH_ORIENTATION_METHOD_POSITION_PAPER_DRAFT_2026-10-12.md');
const paperF=text('../36_A0_TESSAREC_FRAME_ENVELOPE_OBSERVER_PAPER_DRAFT_2026-10-12.md');
const manifest=JSON.parse(text('A0_BOOK_MANIFEST.json'));

ok(desk.includes('id="primecube-sz-khipu-paper-return-20261122"'),'Science Desk return exists');
ok(desk.includes('32/32'),'Science Desk exposes demonstrator coverage');
ok(desk.includes('SOURCE_CUSTODY_CLOSED_BY_FORMAL_SUPERSESSION'),'Science Desk exposes closed custody disposition');
ok(workspace.includes('primecube-sz-khipu-science-desk-paper-return--2026-11-22'),'paper workspace route exists');
ok(paperC.includes('id="primecube-sz-khipu-return-preparation"'),'Paper C preparation exists');
ok(paperE.includes('id="primecube-sz-khipu-method-preparation"'),'Paper E preparation exists');
ok(paperF.includes('id="primecube-shadow-envelope-preparation"'),'Paper F preparation exists');
ok(receipt.classification==='R1_VERIFY_EXISTING','return is R1 verify existing');
ok(receipt.verified_register.demonstrators_bound===32&&receipt.verified_register.contracts_total===32,'32 of 32 demonstrators bound');
ok(receipt.verified_register.record_addresses+receipt.verified_register.shadow_addresses===receipt.verified_register.envelope,'record and shadow balance closes');
ok(receipt.verified_register.mask_positions_per_depth+receipt.verified_register.shadow_positions_per_depth===121,'mask balance closes');
ok(receipt.verified_register.angle_degrees*receipt.verified_register.closure_steps===17*360,'winding closure exact');
ok(receipt.verified_register.mod11['204']+receipt.verified_register.mod11['258']===11,'204/258 residue pair closes');
ok(receipt.authority_effect.graph_delta===0&&receipt.authority_effect.new_findings===0,'authority and graph unchanged');
ok(receipt.authority_effect.publication_authorized===false,'publication remains unauthorized');
ok(receipt.custody_resolution.code==='SOURCE_CUSTODY_CLOSED_BY_OWNER_APPROVED_FORMAL_SUPERSESSION','custody resolution retained');
for(const source of Object.values(receipt.source_files))ok(sha(source.path)===source.sha256,`source hash ${source.path}`);
const primeEntry=manifest.surface_registry.find(item=>item.surface==='A0_PRIMECUBE_GAP_FOLD_LAB.html');
ok(Boolean(primeEntry),'Primecube manifest entry exists');
ok(primeEntry.integration_receipt==='results/a0-primecube-sz-khipu-paper-return-2026-11-22.json','manifest returns to integration receipt');

console.log(JSON.stringify({suite:'a0-primecube-science-desk-paper-return',passed,status:'PASS',classification:receipt.classification},null,2));
