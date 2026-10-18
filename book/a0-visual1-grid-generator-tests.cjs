'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),V=require('./a0-visual1-grid-generator.js'),T=require('./assets/a0-tesa-grid-candidate.js');
const base={journey:{phaseIndex:0,currentPhase:{id:'CARRIER'}},edge:{incoming:{from:0,to:1},candidate:{from:1,to:2},layer:0},aperture:42};
const first=V.derive(base);assert.equal(first.schema,'nexah.a0.visual1-grid-generator/1');assert.equal(first.follow,true);assert.ok(first.address>=1&&first.address<=28);assert.equal(T.cell(first.address).address,first.address);assert.equal(first.edge.verdict,'ALLOW');
assert.equal(V.derive({...base,edge:{...base.edge,candidate:{from:1,to:0}}}).edge.verdict,'BLOCK');
for(let phaseIndex=0;phaseIndex<6;phaseIndex++)for(let layer=0;layer<3;layer++)for(let aperture=18;aperture<=72;aperture+=6){const r=V.derive({...base,journey:{phaseIndex},edge:{...base.edge,layer},aperture});assert.ok(r.address>=1&&r.address<=28);assert.ok(r.antipode.hexagonSector<6);assert.ok(r.antipode.octagonSector<8);assert.match(r.boundary,/NOT A CARRIER MERGE/)}
assert.equal(V.derive(base,17).address,17);assert.equal(V.derive(base,17).follow,false);assert.equal(V.derive(base,99).address,28);
const html=fs.readFileSync('./A0_ORIENTATION_CONTROLLER_BENCH.html','utf8'),css=fs.readFileSync('./a0-visual1-grid-generator.css','utf8');
for(const token of ['id="visual1GridGenerator"','id="pxaTesaGenerator"','class="pxa-hexagon"','a0-visual1-grid-generator.js','assets/a0-tesa-grid-candidate.js'])assert.ok(html.includes(token),token);
for(const token of ['grid-template-columns:repeat(3,1fr)','grid-template-columns:repeat(7,1fr)','C6_CONTAINING_C8_VIEW'])assert.ok((css+fs.readFileSync('./a0-visual1-grid-generator.js','utf8')).includes(token),token);
console.log('visual1-grid-generator: deterministic 3+1 matrix PASS');
