#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict');
const C=require('./a0-machina-ac-carrier-contract.js');
const checks=[];
const test=(name,fn)=>{try{fn();checks.push({name,pass:true})}catch(error){checks.push({name,pass:false,error:error.message})}};

test('source receipt passes',()=>assert.equal(C.receipt().status,'PASS'));
test('existing identity is reused',()=>assert.equal(C.IDENTITY,'NEXAH_A0_ORIENTATION_CONTROLLER_BENCH'));
test('no new identity, relation or carrier is asserted',()=>assert.deepEqual(C.receipt().authority,{newIdentity:false,newRelation:false,newCarrier:false,newOperatorFamily:false,scientificFinding:false}));
test('P60 stays 48 body plus 12 return',()=>assert.deepEqual([C.PORTS.P60.body,C.PORTS.P60.return,C.PORTS.P60.count],[48,12,60]));
test('Q4 carrier remains 24 faces',()=>assert.equal(C.sourceAudit().q4.faces,24));
test('G8 cubed remains 512 samples',()=>assert.equal(C.sourceAudit().cube.samples,512));
test('Z28 remains 28 ports',()=>assert.equal(C.sourceAudit().winding.ports,28));
test('Rank schedule remains 48',()=>assert.equal(C.sourceAudit().schedule.rank,48));
test('H7/O8 equality remains count-only',()=>{const h=C.sourceAudit().h7o8;assert.equal(h.removed,84);assert.equal(h.inserted,84);assert.equal(h.typing,'COUNT_MATCH_ONLY')});

test('06 returns to 21',()=>assert.equal(C.returnMarker('06'),'21'));
test('21 returns to 06',()=>assert.equal(C.returnMarker('21'),'06'));
test('06/21 return is involutive',()=>assert.equal(C.returnMarker(C.returnMarker('06')),'06'));
test('unknown marker is rejected',()=>assert.throws(()=>C.returnMarker('28'),/06 or 21/));

test('quarter turn on Z28 is seven slots',()=>assert.deepEqual(C.quarterPhase(0),{input:0,quarterTurns:1,offsetTurns:.25,offsetSlots:7,output:7,cardinality:28}));
test('two quarter turns reach antipodal residue',()=>assert.equal(C.quarterPhase(0,2).output,14));
test('three quarter turns reach residue 21',()=>assert.equal(C.quarterPhase(0,3).output,21));
test('four quarter turns close at origin',()=>assert.equal(C.quarterPhase(0,4).output,0));
test('quarter phase preserves cardinality',()=>assert([0,1,2,3,4,27].every(r=>C.quarterPhase(r).cardinality===28)));
test('quarter phase wraps exactly',()=>assert.equal(C.quarterPhase(27).output,6));

test('TD Janus exposes four top ports',()=>assert.deepEqual(C.TOP.map(x=>x.id),['T0','T1','T2','T3']));
test('TD Janus exposes four down ports',()=>assert.deepEqual(C.DOWN.map(x=>x.id),['D0','D1','D2','D3']));
test('TD Janus mirrors top to reversed down',()=>assert.deepEqual(C.TOP.map(x=>C.tdJanus(x).id),['D3','D2','D1','D0']));
test('TD Janus mirrors down to reversed top',()=>assert.deepEqual(C.DOWN.map(x=>C.tdJanus(x).id),['T3','T2','T1','T0']));
test('TD Janus squared is identity for all ports',()=>assert([...C.TOP,...C.DOWN].every(x=>C.tdJanus(C.tdJanus(x)).id===x.id)));
test('invalid TD port is rejected',()=>assert.throws(()=>C.tdJanus('T4'),/T0\.\.T3/));

test('KR cycle contains eight unique ports',()=>assert.equal(new Set(C.KR_SEQUENCE).size,8));
test('KR cycle order is top then reversed down',()=>assert.deepEqual(C.KR_SEQUENCE,['T0','T1','T2','T3','D3','D2','D1','D0']));
test('KR eighth step closes',()=>assert([...C.TOP,...C.DOWN].every(x=>C.krStep(x,8).id===x.id)));
test('KR reverse step closes with forward step',()=>assert([...C.TOP,...C.DOWN].every(x=>C.krStep(C.krStep(x,1),-1).id===x.id)));

test('locator exposes four typed view roles',()=>assert.deepEqual(C.LOCATOR_MODES,['TIP','BOUNDARY','OUTSIDE','RETURN']));
test('locator binds the current tip without creating another body',()=>{const l=C.locate({port:'D2',receipt:'Q24',residue:23,marker:'21',focus:'OUTSIDE'});assert.deepEqual([l.focus,l.tip.address,l.boundary.address,l.outside.address,l.return.partner,l.return.tdPartner],['OUTSIDE','D2','Z28:r23','Q24:OUTSIDE','06','T1'])});
test('locator rejects no source cardinality and wraps its Z28 seam',()=>assert.equal(C.locate({residue:29}).boundary.address,'Z28:r01'));

test('aliases remain noncanonical vocabulary',()=>assert(C.receipt().boundaries.some(x=>x.includes('owner vocabulary aliases'))));
test('28 plus 0.25 is not fractional cardinality',()=>assert.equal(C.receipt().phaseCoupling.interpretation,'PHASE_OFFSET_NOT_FRACTIONAL_CARDINALITY'));
test('contract adds no second clock',()=>assert(C.receipt().boundaries.some(x=>x.includes('no second clock'))));
test('locator roles do not claim four bodies',()=>assert(C.receipt().boundaries.some(x=>x.includes('not four bodies'))));

const failures=checks.filter(check=>!check.pass);
if(failures.length){console.error(JSON.stringify({status:'FAIL',checks:checks.length,failures},null,2));process.exit(1)}
console.log(JSON.stringify({status:'PASS',checks:checks.length,receipt:C.receipt()},null,2));
