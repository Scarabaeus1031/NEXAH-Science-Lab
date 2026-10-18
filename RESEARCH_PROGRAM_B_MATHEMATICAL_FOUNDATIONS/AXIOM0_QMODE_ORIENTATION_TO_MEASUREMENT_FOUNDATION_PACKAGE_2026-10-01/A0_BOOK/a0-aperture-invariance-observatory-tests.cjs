'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),O=require('./a0-aperture-invariance-observatory.js'),C=require('./a0-coupled-window.js');
let checks=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);checks++},ok=(v,m)=>{assert.ok(v,m);checks++};
eq(O.VERSION,'1.0.0','version');eq(O.TRANSFORMS.length,7,'seven comparison operators');
for(const carrier of ['durer','khajuraho'])for(const size of [2,3])for(const boundary of ['planar','torus'])for(const transform of O.TRANSFORMS){
  const shot=O.snapshot({carrier,size,boundary,transform,running:false},C.CARRIERS);
  eq(shot.returnExact,true,`${carrier}/${size}/${boundary}/${transform} preserves source multiset`);
  eq(shot.comparison.base.length,boundary==='torus'?16:(5-size)**2,'base trace count');
  eq(shot.comparison.candidate.length,shot.comparison.base.length,'candidate trace count');
  ok(['INVARIANT','LOCATION_DEPENDENT','PLACEMENT_DEPENDENT'].includes(shot.comparison.classification),'typed classification');
}
let grid=C.DÜRER;for(let i=0;i<4;i++)grid=O.transform(grid,'rotate90');eq(grid,C.DÜRER,'R90 fourth power');
eq(O.transform(O.transform(C.DÜRER,'reflectX'),'reflectX'),C.DÜRER,'reflection involution');
eq(O.snapshot({carrier:'khajuraho',size:2,boundary:'planar',transform:'otherCarrier'},C.CARRIERS).comparison.classification,'PLACEMENT_DEPENDENT','Dürer vs Khajuraho 2x2 distinguishes placement');
eq(O.snapshot({carrier:'durer',size:3,boundary:'torus',transform:'otherCarrier'},C.CARRIERS).comparison.sameMultiset,true,'toroidal 3x3 multiset shared');
eq(O.snapshot({carrier:'durer',size:3,boundary:'torus',transform:'otherCarrier'},C.CARRIERS).comparison.classification,'LOCATION_DEPENDENT','toroidal 3x3 shared values move location');
eq(O.snapshot({carrier:'khajuraho',size:2,boundary:'torus',transform:'identity'},C.CARRIERS).comparison.uniqueBase,1,'Khajuraho 2x2 torus constant');
eq(O.snapshot({carrier:'khajuraho',size:2,boundary:'torus',transform:'control'},C.CARRIERS).comparison.classification,'PLACEMENT_DEPENDENT','matched control breaks 2x2 constancy');
const html=fs.readFileSync('A0_ORIENTATION_CONTROLLER_BENCH.html','utf8');ok(html.includes('data-coupled-open="observatory"'),'observatory launcher');ok(html.includes('a0-aperture-invariance-observatory.js'),'observatory mounted');
console.log(JSON.stringify({status:'PASS',checks,comparisons:56,classification:'FINITE_ENGINEERING_COMPARISON_NOT_RESEARCH_RUN'}));
