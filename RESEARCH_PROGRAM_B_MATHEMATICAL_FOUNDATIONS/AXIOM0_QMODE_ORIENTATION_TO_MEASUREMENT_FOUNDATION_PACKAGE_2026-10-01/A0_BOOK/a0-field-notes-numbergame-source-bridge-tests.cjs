const assert=require('node:assert/strict'),crypto=require('node:crypto'),fs=require('node:fs'),path=require('node:path');
const base=__dirname,html=fs.readFileSync(path.join(base,'A0_NUMBERMAGICK_GRID_RESEARCH.html'),'utf8');
const receipt=JSON.parse(fs.readFileSync(path.join(base,'results/a0-field-notes-numbergame-source-bridge-2026-11-21.json'),'utf8'));
const nfi='/Users/tho2020/Desktop/Desktop TASKS/DESKTOP_archy/zzz - Homework/NFI DEPOT SUPPORT';
const glb='/Users/tho2020/Desktop/Desktop TASKS/DESKTOP_archy/THOOTH DASHBOARD/Nexahedron_Codex Staging Modules/▲ Regulator_Q-Dimensions_q-elektrodynamics_World_Moons_J.I./tri_mobius_klein_core_silent__world_moons_full.glb';
let checks=0;function ok(value,label){assert.ok(value,label);checks++}function sha(file){return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')}
ok(receipt.status==='PASS_SOURCE_BOUND_ROLE_SEPARATION','receipt status');
ok(receipt.new_canonical_ids.length===0&&receipt.relation_changes.length===0,'no graph delta');
ok(receipt.finding_or_manuscript_effect==='NONE'&&receipt.publication_or_deployment==='NONE','no finding or publication effect');
for(const id of ['field-notes-numbergame-source-bridge-20261121','fieldNotesNumbergameBridgeTitle'])ok(html.includes('id="'+id+'"'),'host anchor '+id);
for(const marker of ['HISTORICAL_SYNTHETIC_DIAGNOSTIC_NOT_EVIDENCE','calendar-preserving null model','The GLB is static'])ok(JSON.stringify(receipt).includes(marker),'receipt boundary '+marker);
const meta=path.join(nfi,'METAREADME.md'),v5=path.join(nfi,'DOCUMENTS PDFS AND MDS/nexah_equation_md_v_5_prime_month_gamma_split.md');
ok(sha(meta)===receipt.historical_nfi.metareadme_sha256,'NFI metareadme hash');
ok(sha(v5)===receipt.historical_nfi.v5_rulecard_sha256,'NFI V5 rulecard hash');
for(const source of receipt.historical_nfi.heatmaps){const file=path.join(nfi,'VISUALS',source.file),bytes=fs.readFileSync(file);ok(bytes.length===source.bytes,'heatmap bytes '+source.file);ok(sha(file)===source.sha256,'heatmap hash '+source.file);ok(html.includes(file),'heatmap displayed '+source.file)}
const bytes=fs.readFileSync(glb);ok(bytes.length===receipt.world_moons_glb.bytes,'GLB bytes');ok(sha(glb)===receipt.world_moons_glb.sha256,'GLB hash');
ok(bytes.toString('ascii',0,4)==='glTF'&&bytes.readUInt32LE(4)===2,'GLB version 2 header');
const jsonLength=bytes.readUInt32LE(12),model=JSON.parse(bytes.subarray(20,20+jsonLength).toString().replace(/\u0000+$/,''));
const names=model.nodes.map(node=>node.name||'');
ok(model.nodes.length===2722&&model.meshes.length===2721,'GLB declared node and mesh counts');
ok((model.animations||[]).length===0,'GLB has no native animation');
for(const year of receipt.world_moons_glb.observed_year_nodes)ok(names.includes('BASE__geometry_'+year),'GLB year node '+year);
ok(!names.some(name=>name.startsWith('bridge_TESSARNA_')),'USDZ bridge names absent from located GLB');
ok(html.includes('A0_GAME_OF_WORLDS_PLAY.html#numbers')&&html.includes('assets/a0-field-notes/index.html#ij-half-seam-direction'),'Field Notes and Numbergame routes');
console.log(JSON.stringify({status:'PASS',checks,scope:'source-bound roles, external source hashes and static GLB inventory'},null,2));
