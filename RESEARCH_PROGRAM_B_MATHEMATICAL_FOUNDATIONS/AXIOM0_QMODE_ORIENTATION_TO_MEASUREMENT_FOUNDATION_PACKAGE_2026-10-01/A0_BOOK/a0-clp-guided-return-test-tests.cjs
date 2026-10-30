'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const api=require('./a0-clp-guided-return-test.js');
let checks=0;const check=(value,message)=>{assert.ok(value,message);checks+=1};
check(api.VERSION==='1.0.0','version');
check(api.IDENTITY==='NEXAH_A0_ORIENTATION_CONTROLLER_BENCH','identity reused');
check(api.STAGES.join('>')==='SOURCE>CUT>VIEW>RETURN','four-step route');
check(api.FIXTURES.length===20,'twenty collision fixtures');
for(const fixture of api.FIXTURES){
  const point=api.projection(fixture.phase),sig=api.signature(fixture.phase),collisions=api.collisionSet(fixture.phase);
  check(Number.isFinite(point.x)&&Number.isFinite(point.y),`finite projection ${fixture.phase}`);
  check(collisions.length===2,`single-view collision ${fixture.phase}`);
  check(collisions.includes(fixture.phase),`collision retains source ${fixture.phase}`);
  check(api.reconstruct(sig.mod6,sig.mod5)===fixture.phase,`CRT exact return ${fixture.phase}`);
}
let single=api.createState();single=api.advance(single,10);single=api.advance(single,20);single=api.advance(single,30);single=api.score(single,'AMBIGUOUS','VIEW_ONLY',75,40);
check(single.result.answerCorrect,'single ambiguous answer');
check(single.result.classCorrect,'single view classification');
let clp=api.setCondition(api.createState(),'CLP');clp=api.advance(clp,10);clp=api.advance(clp,20);clp=api.advance(clp,30);clp=api.score(clp,String(api.FIXTURES[0].phase),'EXACT_STATE',80,40);
check(clp.result.answerCorrect,'clp exact answer');
check(clp.result.classCorrect,'clp exact classification');
const record=api.buildRecord(clp);
check(record.classification==='PROTOCOL_REHEARSAL_NOT_RESEARCH_RUN','rehearsal classification');
check(record.storage==='NONE_LOCAL_EPHEMERAL','no storage');
check(record.authority.researchRun===false&&record.authority.participantData===false,'no run or participant data');
check(record.authority.newIdentity===false&&record.authority.newRelation===false,'no graph mutation');
check(/No multi-view utility claim/.test(record.failureRule),'failure rule present');
check(/CRT SIGNATURE/.test(api.svgMarkup(clp)),'clp svg exposes CRT');
check(!/CRT SIGNATURE/.test(api.svgMarkup(single)),'single svg hides CRT');
for(const fixture of api.FIXTURES){
  const matrix=api.failClosedMatrix(fixture);
  check(matrix.exact.status==='EXACT_RETURN'&&matrix.exact.exactReturn===fixture.phase,`exact witness returns ${fixture.phase}`);
  check(matrix.tampered.status==='HOLD_CONFLICTING_WITNESS'&&matrix.tampered.exactReturn===null,`tampered witness held ${fixture.phase}`);
  check(matrix.missing.status==='HOLD_MISSING_WITNESS'&&matrix.missing.exactReturn===null,`missing witness held ${fixture.phase}`);
  check(matrix.single.status==='AMBIGUOUS'&&matrix.single.exactReturn===null,`single view remains ambiguous ${fixture.phase}`);
}
const html=fs.readFileSync(__dirname+'/A0_ORIENTATION_CONTROLLER_BENCH.html','utf8');
for(const id of ['clpGuidedGateRun','clpGuidedGateExact','clpGuidedGateTampered','clpGuidedGateMissing','clpGuidedGateSingle'])check(html.includes(`id="${id}"`),`Bench exposes ${id}`);
check(html.includes('a0-clp-fail-closed-consistency-return-2026-10-28.json'),'gate receipt linked');
const desk=fs.readFileSync(__dirname+'/A0_RESEARCH_DESK.html','utf8'),builder=fs.readFileSync(__dirname+'/A0_BUILDER_LOG.html','utf8');
check(desk.includes('id="clp-fail-closed-consistency-return-20261028"'),'Science Desk gate return');
check(builder.includes('id="clp-fail-closed-consistency-return-20261028"'),'Builder gate return');
console.log(`PASS a0-clp-guided-return-test · ${checks} checks`);
