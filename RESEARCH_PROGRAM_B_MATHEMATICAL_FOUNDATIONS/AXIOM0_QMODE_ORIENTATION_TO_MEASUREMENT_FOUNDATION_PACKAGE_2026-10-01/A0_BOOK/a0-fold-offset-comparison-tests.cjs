const assert=require('node:assert/strict'),fs=require('node:fs'),G=require('./a0-bench-fold-guide.js'),M=require('./a0-game-of-numbers-model.js'),B=require('./a0-bench-lens-return.js');
let checks=0;const check=(v,m)=>{assert.ok(v,m);checks++;};
const original=JSON.stringify(M.MIXER_FOLD_STOPS);
for(let phase=0;phase<=360;phase++){
 const c=G.comparison(phase),b=M.mixerFold(phase);
 check(JSON.stringify(c.base)===JSON.stringify(b),'original phase law retained');
 check(Math.abs(c.shiftedAngle-b.angle-7)<1e-12,'constant offset');
 check(c.base.crownTick===b.crownTick,'same Crown');
 check(c.shiftedAngle>=7&&c.shiftedAngle<=85,'offset range');
 check(c.stops.map(s=>s.shifted).join(',')==='7,85,40,14,7','five shifted stations');
 const p=c.triangle.points,lengths=p.map((a,i)=>Math.hypot(a[0]-p[(i+1)%3][0],a[1]-p[(i+1)%3][1]));
 check(lengths.every(v=>Math.abs(v-140)<1e-10),'equal sides in undistorted SVG coordinates');
 check(c.triangle.interiorDegrees.reduce((a,b)=>a+b,0)===180,'interior sum');
 check(c.triangle.centralSpacingDegrees===120,'central spacing differs from interior angle');
}
check(JSON.stringify(M.MIXER_FOLD_STOPS)===original,'source stops not mutated');
check(G.comparison(360).base.foldReturn&&G.comparison(360).shiftedAngle===7,'return is relative to shifted reference');
for(const phase of [0,90,180,270,360,232]){
 const svg=G.drawing(phase);
 check(svg.includes('45°'),'prior 45-degree reference retained');
 check(svg.includes('Gleichseitige Referenz'),'new independent triangle visible');
 check(svg.includes('Möbius-Pin'),'pin boundary visible');
 check(!svg.includes('NaN'),'finite geometry');
}
let state=B.create();const before=JSON.stringify(state);
G.comparisonDrawing(state.phase);check(JSON.stringify(state)===before,'readout leaves complete source state unchanged');
state=B.apply(state,'phase',90);const record=B.record(state);check(B.verify(record).status==='PASS','native record schema/replay unchanged');
check(G.comparison(record.state.phase).shiftedAngle===85,'comparison regenerates from saved phase');
for(const invalid of [-1,361,NaN]){assert.throws(()=>G.comparison(invalid));checks++;}
check(!/setInterval|requestAnimationFrame|setTimeout|postMessage/.test(fs.readFileSync('a0-bench-fold-guide.js','utf8')),'no added timer or pin communication');
check(M.wheelState(1,'3:2','counter').rate1729===-2,'1729 existing counter-rotation channel');
console.log(JSON.stringify({status:'PASS',checks,scope:'361 existing phases, constant offset, equal-sided triangle, source/record invariance and existing 1729 counter preset. Browser visual acceptance OPEN.'},null,2));
