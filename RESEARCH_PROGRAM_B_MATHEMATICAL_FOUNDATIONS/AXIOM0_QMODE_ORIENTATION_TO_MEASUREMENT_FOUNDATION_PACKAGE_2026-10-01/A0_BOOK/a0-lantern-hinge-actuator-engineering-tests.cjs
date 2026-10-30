'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const child=require('node:child_process');
const root=__dirname;
let passed=0;
const check=(condition,message)=>{assert.ok(condition,message);passed++;};

child.execFileSync(process.execPath,['a0-lantern-hinge-actuator-engineering-runner.cjs','--write'],{cwd:root,stdio:'pipe'});
child.execFileSync(process.execPath,['a0-lantern-prototype-builder.cjs'],{cwd:root,stdio:'pipe'});

const engineering=require('./a0-lantern-hinge-actuator-engineering.js').runEngineering();
check(engineering.pass,'engineering package must pass');
check(engineering.passed===10&&engineering.total===10,'ten engineering contracts must pass');
check(engineering.bearings.length===5,'five bearings required');
check(engineering.actuators.length===5,'five actuator routes required');
check(engineering.bearings.every(item=>item.pinDiameterMillimetres===4&&item.boreDiameterMillimetres===5),'pin and bore contract');
check(engineering.bearings.every(item=>item.radialRunningClearanceMillimetres===0.5),'running clearance contract');
check(engineering.actuators.every(item=>item.route==='COAXIAL_HINGE_SHAFT_TO_EXTERNAL_SERVO_POD'),'external coaxial route contract');
check(engineering.certificate.method==='LIPSCHITZ_INTERVAL_LOWER_BOUND','continuous method must be explicit');
check(engineering.certificate.intervals===4096,'continuous interval count');
check(engineering.certificate.certifiedPairClearanceMillimetres>=1,'pair clearance certificate');
check(engineering.certificate.certifiedFixedClearanceMillimetres>=1,'fixed clearance certificate');
check(engineering.geometry.operatingStopDegrees===147.5,'operating stop contract');
check(engineering.geometry.stopApertureDiameterMillimetres>5,'residual aperture');
check(engineering.geometry.housingRadialMarginMillimetres>=1,'housing radial margin');
check(engineering.geometry.housingTopMarginMillimetres>=1,'housing top margin');
check(engineering.hold.includes('FABRICATION RELEASE'),'fabrication hold must remain visible');

const receipt=JSON.parse(fs.readFileSync(path.join(root,'results/a0-lantern-hinge-actuator-housing-return-2026-10-29.json'),'utf8'));
check(receipt.status==='PASS_KINEMATIC_PROTOTYPE_WITH_LOAD_HOLD','receipt status');
check(receipt.identity_effect.new_global_ids.length===0&&receipt.identity_effect.new_relations.length===0,'no identity effect');

const glb=fs.readFileSync(path.join(root,'results/a0-lantern-hinge-actuator-housing-prototype-2026-10-29.glb'));
check(glb.readUInt32LE(0)===0x46546c67,'GLB magic');
check(glb.readUInt32LE(4)===2,'GLB version');
check(glb.readUInt32LE(8)===glb.length,'GLB declared length');
const jsonLength=glb.readUInt32LE(12),jsonType=glb.readUInt32LE(16);
check(jsonType===0x4e4f534a,'GLB JSON chunk type');
const gltf=JSON.parse(glb.subarray(20,20+jsonLength).toString('utf8').trim());
check(gltf.asset.version==='2.0','glTF asset version');
check(gltf.meshes[0].primitives.length===4,'four prototype mesh groups');
check(gltf.extras.operatingStopDegrees===147.5,'GLB operating stop');
check(gltf.extras.continuousPairClearanceMillimetres>=1,'GLB certificate return');

const html=fs.readFileSync(path.join(root,'A0_WERKBANK.html'),'utf8');
check(html.includes('id="lanternHingeActuatorEngineering"'),'Workbench engineering console');
check(html.includes('data-bcp-engineering-run'),'Workbench engineering action');
check(html.includes('a0-lantern-hinge-actuator-engineering.js'),'Workbench engineering runtime');
const desk=fs.readFileSync(path.join(root,'A0_RESEARCH_DESK.html'),'utf8');
check(desk.includes('id="lantern-hinge-actuator-housing-return-20261029"'),'Science Desk return');
check(desk.includes('Next gate · load / torque')&&desk.includes('PROTOCOL CANDIDATE / NOT EXECUTED'),'Science Desk load and torque next gate');
const findings=fs.readFileSync(path.join(root,'../32_A0_FINDINGS_AND_PAPER_WORKSPACE_2026-10-11.md'),'utf8');
check(findings.includes('<a id="lantern-hinge-actuator-housing-return-20261029"></a>'),'Findings return');
check(findings.includes('Nächster sinnvoller Gate — Last / Drehmoment'),'Findings next gate return');

console.log(`PASS ${passed}/${passed} · hinge / actuator / continuous clearance / housing prototype`);
