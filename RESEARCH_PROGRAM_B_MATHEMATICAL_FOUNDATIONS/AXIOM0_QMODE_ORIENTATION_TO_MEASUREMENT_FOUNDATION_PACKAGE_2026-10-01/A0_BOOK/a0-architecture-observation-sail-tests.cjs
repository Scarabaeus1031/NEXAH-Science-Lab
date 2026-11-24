'use strict';
const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');const api=require('./a0-architecture-observation-sail.js');const root=__dirname;const html=fs.readFileSync(path.join(root,'A0_ARCHITECTURE_OF_DIFFERENCE.html'),'utf8');const css=fs.readFileSync(path.join(root,'a0-architecture-observation-sail.css'),'utf8');
const a=api.angleContract();assert.equal(a.mean,70);assert.equal(a.halfDifference,20);assert.equal(a.closure,360);assert.equal(a.steps,18);
const codes=api.viewCodes();assert.equal(codes.identity,false);assert.equal(codes.primeIdentity,false);assert.equal(codes.factors.carrier,'2^4·41');assert.equal(codes.factors.projection,'11^2');assert.equal(codes.factors.rootViews,'3·7·37');
const p=api.pentagonComparator();assert.ok(Math.abs(p.ratio-1.6175637393767706)<1e-12);assert.equal(p.exactPhiClaim,false);
for(const token of ['id="observation-sail-fsp"','FSP · THE AI ANGLE &amp; THE RED SHADOW','ALGO SAIL','Ω · ANCHOR / GAP','6|5|6','1|2|1','7|7|7','90° LOT','70° FOLD','50° AI','18×20°=360°','keine Zahlengleichung','keine Primzahlbehauptung','a0-architecture-observation-sail.js'])assert.ok(html.includes(token),`missing ${token}`);
for(const token of ['.sail-fsp-stage[data-stage=cut]','.sail-fsp-stage[data-stage=fold]','.sail-fsp-stage[data-stage=return]','data-red-shadow'])assert.ok(css.includes(token),`missing CSS ${token}`);
console.log('A0 Observation Sail / FSP: angle + view-code + integration checks PASS');
