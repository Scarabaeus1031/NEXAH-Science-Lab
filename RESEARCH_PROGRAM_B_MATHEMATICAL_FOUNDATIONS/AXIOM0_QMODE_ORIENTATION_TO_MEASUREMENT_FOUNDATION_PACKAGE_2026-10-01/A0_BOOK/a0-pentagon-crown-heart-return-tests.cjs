const fs=require('fs');
const crypto=require('crypto');

let passed=0;
const failures=[];
function check(condition,label){if(condition){passed+=1;console.log(`PASS ${label}`)}else{failures.push(label);console.error(`FAIL ${label}`)}}

const html=fs.readFileSync('A0_PENTAGON_CROWN_RETURN_DEMONSTRATOR.html','utf8');
const js=fs.readFileSync('a0-pentagon-crown-return.js','utf8');
const css=fs.readFileSync('a0-pentagon-crown-return.css','utf8');
const receipt=JSON.parse(fs.readFileSync('results/a0-pentagon-crown-return-demonstrator-2026-10-29.json','utf8'));
const manifest=JSON.parse(fs.readFileSync('assets/3d/MANIFEST.json','utf8'));
const glb=fs.readFileSync('assets/3d/digital_dodeca_heart_tau200.glb');
const desk=fs.readFileSync('A0_RESEARCH_DESK.html','utf8');
const deskBinding=fs.readFileSync('a0-pentagon-crown-heart-desk-binding.js','utf8');
const hypercubeReference=JSON.parse(fs.readFileSync('assets/a0-dodeka-joint-6i6-hypercube-reference-2026-10-29.json','utf8'));
const harmonicReference=JSON.parse(fs.readFileSync('assets/a0-c-pin-ioi-harmonic-reference-2026-10-29.json','utf8'));
const pin=require('./a0-c-pin-ioi.js');
const harmonicCapture=fs.readFileSync('assets/references/themathematics-harmonic-modes-l1-m0-2026-10-29.png');

check((html.match(/data-stage=/g)||[]).length===7,'seven visible demonstrator stages');
check(html.includes('id="heartModel"')&&html.includes('digital_dodeca_heart_tau200.glb'),'local Heart viewer is bound');
check(html.includes('I‑46L')&&html.includes('I‑46P')&&html.includes('I‑46Q')&&html.includes('I‑46J'),'existing Science Desk returns are linked');
check(desk.includes('a0-pentagon-crown-heart-desk-binding.js'),'Science Desk loads reciprocal binding');
check(['body-crown-module-intake-20261025','fam002-a0-orientation-intake-handoff-20261028','lantern-heart-color-bridge-return-20261029','lantern-crown-source-replay-return-20261029','pulse-grammar-clp-shared-desk-return-20261028'].every(id=>deskBinding.includes(id)),'five existing Desk records return to the demonstrator');
check(html.includes('CALIBRATION HOLD'),'angle labels remain held');
check(css.includes('grid-template-columns:repeat(7,1fr)'),'stage navigation has seven columns');
check(js.includes("NEXAH_A0_PENTAGON_CROWN_RETURN_RECEIPT_V3"),'browser receipt uses V3 schema');
check(js.includes("heartTarget:[1,1,1]"),'browser receipt declares neutral Heart return');
check(receipt.identity.new_canonical_identity===false&&receipt.identity.new_relation===false,'no identity or relation promotion');
check(receipt.holds.trigger_7_1_degree==='UNVERIFIED_HISTORICAL_LABEL'&&receipt.holds.resonance_8_9_degree==='UNVERIFIED_HISTORICAL_LABEL','historical angle labels remain unverified');
check(html.includes('Dodeka Joint · 6‑I‑6')&&html.includes('a0-dodeka-joint-6i6-hypercube-reference-2026-10-29.json'),'external Hypercube projection reference is visible');
check(deskBinding.includes('6‑I‑6 · Hypercube Reference'),'existing Heart Desk record receives the reference');
check(hypercubeReference.status==='SOURCE_BOUND_EXTERNAL_REFERENCE_NOT_EVIDENCE'&&hypercubeReference.identity.new_canonical_identity===false&&hypercubeReference.identity.new_relation===false,'Hypercube comparison remains non-evidentiary and non-canonical');
check(html.includes('id="pinDiagram"')&&html.includes('id="togglePin"'),'C-Pin boundary control is visible and operable');
check(pin.SAMPLE_COUNT===101&&pin.sequence().length===101,'C-Pin has exactly 101 deterministic states');
check(pin.stateAt(0).zone==='INSIDE'&&pin.stateAt(50).zone==='OUTSIDE'&&pin.returned(pin.stateAt(100)),'C-Pin follows I-O-I and returns exactly');
check(Math.abs(pin.stateAt(25).signedClearance)<1e-12&&Math.abs(pin.stateAt(75).signedClearance)<1e-12,'C-Pin crosses the boundary twice');
check(harmonicReference.status==='SOURCE_BOUND_EXTERNAL_REFERENCE_AND_LOCAL_GEOMETRIC_CONTROL_NOT_EVIDENCE'&&harmonicReference.identity.new_canonical_identity===false&&harmonicReference.identity.new_relation===false,'harmonic comparison remains non-evidentiary and non-canonical');
check(crypto.createHash('sha256').update(harmonicCapture).digest('hex')===harmonicReference.external_reference.capture.sha256,'harmonic reference capture hash matches custody record');
check(harmonicReference.complex_extension_hold.status==='OPEN_NOT_BUILT','Mandelbrot and Julia complexity extension remains explicitly unbuilt');
check(deskBinding.includes('C‑Pin · I–O–I · Harmonic Boundary'),'existing Heart Desk record receives the C-Pin reference');
check(html.includes('id="ghostCross"')&&html.includes('>m</text>')&&html.includes('>n</text>')&&html.includes('>X|</text>'),'White Ghost Cross exposes m, n and X|');
check(css.includes('.ghost-line')&&css.includes('stroke-dasharray')&&css.includes('data-relation="COINCIDENCE"'),'Ghost relation is visibly perforated and has a boundary-coincidence state');
check(js.includes("state.zone==='BOUNDARY'?'COINCIDENCE':'GHOST'")&&js.includes('stateTransfer:false'),'Ghost relation changes only at the declared boundary and transfers no state');
check(harmonicReference.white_ghost_cross.state_transfer===false&&harmonicReference.white_ghost_cross.identity_merge===false,'Ghost reference forbids state transfer and identity merge');
check(js.includes("toggleAttribute('hidden',Boolean(hidden))")&&js.includes('setHidden(pinDiagram,stage!==3)'),'inline SVG visibility uses reflected hidden attributes');

const hash=crypto.createHash('sha256').update(glb).digest('hex');
check(hash==='c6a3406d7a054ec369cd7d462ab2b3704dee6c39181388c380f4a82937fd62fc','Heart GLB hash matches custody record');
check(glb.toString('ascii',0,4)==='glTF'&&glb.readUInt32LE(4)===2,'Heart asset is GLB 2.0');

const jsonLength=glb.readUInt32LE(12);
const model=JSON.parse(glb.subarray(20,20+jsonLength).toString().replace(/\0+$/,''));
let chunkOffset=(20+jsonLength+3)&~3;
const binLength=glb.readUInt32LE(chunkOffset);
const binary=glb.subarray(chunkOffset+8,chunkOffset+8+binLength);
function accessor(index){
  const item=model.accessors[index],view=model.bufferViews[item.bufferView];
  const components={SCALAR:1,VEC3:3}[item.type];
  const start=(view.byteOffset||0)+(item.byteOffset||0),rows=[];
  for(let row=0;row<item.count;row+=1){
    const values=[];
    for(let component=0;component<components;component+=1)values.push(binary.readFloatLE(start+(row*components+component)*4));
    rows.push(components===1?values[0]:values);
  }
  return rows;
}

const animation=model.animations[0],sampler=animation.samplers[0];
const times=accessor(sampler.input),scales=accessor(sampler.output);
check(model.nodes.length===8&&model.meshes.length===8,'Heart keeps eight named nodes and meshes');
check(animation.name==='tau_200_step_pulse'&&sampler.interpolation==='STEP','named STEP pulse animation is present');
check(times.length===200&&times[0]===0&&times.at(-1)===199,'pulse has 200 ordered steps');
const high=scales.filter(scale=>Math.abs(scale[0]-1.15)<1e-5).length;
const low=scales.filter(scale=>Math.abs(scale[0]-1)<1e-8).length;
check(high===50&&low===150,'ten five-step highs alternate with ten fifteen-step rests');
check(scales.at(-1).every(value=>value===1),'final scale returns exactly to [1,1,1]');
const manifestEntry=manifest.assets.find(asset=>asset.file==='digital_dodeca_heart_tau200.glb');
check(Boolean(manifestEntry)&&manifestEntry.sha256===hash,'3D manifest binds the Heart asset');

console.log(`\n${passed}/${passed+failures.length} checks passed`);
if(failures.length){process.exitCode=1}
