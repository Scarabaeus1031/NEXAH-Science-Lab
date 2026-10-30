const assert=require('node:assert/strict');
const T=require('./a0-tesa-zither-translator.js');
assert.equal(T.verify().status,'PASS');
assert.equal(T.verify().checks,78);
for(const [glyph,address,primeLift] of [['G',7,17],['I',9,23],['J',10,29],['K',11,31],['U',21,73],['X',24,89]]){
  const r=T.record({glyph,lane:-2,mirror:true,split:true,ratio:[5,6]});
  assert.equal(r.address,address);assert.equal(r.primeLift,primeLift);assert.ok(T.closureError(r)<1e-12);
}
assert.equal(T.record({glyph:'G'}).primePosition,true);
assert.equal(T.record({glyph:'X'}).primePosition,false);
assert.match(T.record({glyph:'U'}).role,/ILAU \/ BUDU/);
assert.throws(()=>T.record({glyph:'?'}),/A..Z/);
assert.throws(()=>T.record({ratio:[0,6]}),/positive integer ratio/);
const acoustic=T.acousticBridge();
assert.equal(T.verifyAcoustic().status,'PASS');
assert.equal(T.verifyAcoustic().checks,39);
assert.deepEqual(acoustic.frequencyRail,[24,27,30,32,36,40,45,48]);
assert.deepEqual(acoustic.stopinders,[3,3,2,4,4,5,3]);
assert.equal(acoustic.exact.stopinderSum,24);
assert.ok(Math.abs(acoustic.exact.ratioProduct-2)<1e-12);
assert.deepEqual(acoustic.repeatedRatioGaps.map(gap=>[gap.from,gap.to,gap.stopinder,gap.ratio]),[['MI','FA',2,'16/15'],['SI','DO′',3,'16/15']]);
assert.deepEqual(acoustic.diatonicFifths.indices,[0,4,1,5,2,6,3,0]);
assert.ok(acoustic.diatonicFifths.fullTwelveStepResidual.cents>23);
assert.equal(acoustic.measuredInput.status,'OPEN_MEASURED_INPUT');
assert.deepEqual(acoustic.newCanonicalIds,[]);assert.deepEqual(acoustic.relationChanges,[]);
const fs=require('node:fs');
const html=fs.readFileSync(__dirname+'/A0_WERKBANK.html','utf8');
for(const token of ['id="tesaZitherTranslator"','data-tz-lane="1"','data-tz-lane="-2"','data-tz-acoustic-view="OCTAVE"','data-tz-acoustic-view="FIFTHS"','data-tz-acoustic-view="COMPARE"','StiX','StaX','TESA_DOCUMENTARY_GRID','a0-spin-to-bloom-measurement.js','a0-tesa-zither-translator.js','numbermagic_panel_fieldart_pack.glb','cosmic_resonance_cross_sorting_wheel.glb','a0-tesa-acoustic-overlay-return-2026-10-30.json'])assert.ok(html.includes(token),token);
console.log(JSON.stringify({suite:'a0-tesa-zither-translator',status:'PASS',checks:T.verify().checks,acousticChecks:T.verifyAcoustic().checks,identity:'REUSE NEXAH_AX0_QMODE_FOUNDATION_PACKAGE / A0_WERKBANK',relationChange:false}));
