'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const D=require('./assets/a0-field-notes/digit-pentagon-ticker.js');
let checks=0;
const eq=(actual,expected,message)=>{assert.deepEqual(actual,expected,message);checks+=1;};
const ok=(value,message)=>{assert.ok(value,message);checks+=1;};

for(const name of ['pi','e','phi','sqrt2'])eq(D.DIGITS[name].length,500,name+' has pinned 500-digit fixture');
eq(D.DIGITS.pi.slice(0,50),'14159265358979323846264338327950288419716939937510','pi prefix');
eq(D.DIGITS.e.slice(0,50),'71828182845904523536028747135266249775724709369995','e prefix');
eq(D.DIGITS.phi.slice(0,50),'61803398874989484820458683436563811772030917980576','phi prefix');
eq(D.DIGITS.sqrt2.slice(0,50),'41421356237309504880168872420969807856967187537694','sqrt2 prefix');

const first=D.snapshot(0,0);
eq(first.total,100,'100 five-digit frames');
eq(first.decimalRange,[1,5],'first decimal range');
eq([first.constants.pi.block,first.constants.phi.block,first.constants.sqrt2.block],['14159','61803','41421'],'first three blocks');
eq([first.constants.pi.sum,first.constants.phi.sum,first.constants.sqrt2.sum],[20,18,12],'first sums');
eq([first.constants.pi.mean,first.constants.phi.mean,first.constants.sqrt2.mean],[4,3.6,2.4],'first means');

const sample=D.analyzeBlock('61803');
eq([sample.iMin,sample.min,sample.iMax,sample.max],[3,0,2,8],'oriented extrema retain indices');
eq(sample.discarded.map(x=>[x.index,x.digit]),[[0,6],[1,1],[4,3]],'loss receipt preserves discarded positions and values');
eq(sample.discarded.reduce((s,x)=>s+x.digit,0)+sample.min+sample.max,sample.sum,'loss receipt closes digit sum');
const zero=D.analyzeBlock('00000');
ok(Math.abs(zero.centroid.x)<1e-15&&Math.abs(zero.centroid.y)<1e-15,'zero block at origin');

const stats=Object.fromEntries(['pi','phi','sqrt2'].map(name=>[name,D.statistics(name)]));
eq([stats.pi.sum,stats.phi.sum,stats.sqrt2.sum],[2211,2266,2280],'500-digit sums');
eq([stats.pi.digitMean,stats.phi.digitMean,stats.sqrt2.digitMean],[4.422,4.532,4.56],'500-digit means');
for(const name of ['pi','phi','sqrt2']){ok(stats[name].distance<0.011,name+' finite mean centroid near origin');eq(D.frames(name,4).length,99,name+' shifted offset has 99 complete frames');}

for(const name of ['pi','phi','sqrt2'])for(const frame of D.frames(name)){
 eq(frame.points.length,5,name+' frame has five vertices');
 ok(frame.points.every(point=>Math.hypot(point.x,point.y)<=1+1e-12),name+' radii remain in unit circle');
 eq(D.rathAdapter(frame).pairSum,100,name+' RATH display pair closes at 100');
}

const eStats=D.statistics('e');
eq([eStats.sum,eStats.digitMean],[2280,4.56],'Euler 500-digit fixture');
eq(Array.from(D.DIGITS.e.slice(0,50),Number).reduce((a,b)=>a+b,0),246,'Euler first 50 digits sum');
const rel0=D.relativeSnapshot(0);
eq([rel0.pi.block,rel0.constants.e.block,rel0.constants.phi.block,rel0.constants.sqrt2.block],['14159','71828','61803','41421'],'first relative blocks');
eq([rel0.pi.sum,rel0.constants.e.sum,rel0.constants.phi.sum,rel0.constants.sqrt2.sum],[20,26,18,12],'first relative sums');
eq(rel0.pi.relativeCentroid,{x:0,y:0},'pi is exact relative origin');
ok(Math.abs(rel0.constants.e.relativeCentroid.x-(rel0.constants.e.centroid.x-rel0.pi.centroid.x))<1e-15,'relative subtraction is exact');
ok(rel0.bridge.t>=0&&rel0.bridge.t<=1,'closest point remains on finite bridge');
const triInside=D.barycentricOrigin({x:1,y:0},{x:0,y:1},{x:-1,y:-1});
eq(triInside.status,'INSIDE','origin lies strictly inside reference triangle');
ok(Object.values(triInside.weights).every(weight=>weight>0),'inside triangle has three positive weights');
ok(Math.abs(triInside.weightSum-1)<1e-15&&triInside.reconstruction.residual<1e-15,'barycentric weights close and reconstruct origin');
eq(D.barycentricOrigin({x:0,y:0},{x:1,y:0},{x:0,y:1}).status,'ON_BOUNDARY','zero vertex identifies boundary case');
eq(D.barycentricOrigin({x:-1,y:0},{x:0,y:0},{x:1,y:0}).status,'DEGENERATE','collinear triangle is separated as degenerate');
eq(rel0.triangle.status,'OUTSIDE','first decimal frame leaves pi outside triangle');
ok(Math.abs(rel0.triangle.weightSum-1)<1e-15&&rel0.triangle.reconstruction.residual<1e-15,'first frame barycentric receipt closes');
const relStats=D.relativeStatistics();
eq([relStats.frames,relStats.transits,relStats.minIndex],[100,21,25],'declared relative transit fixture');
ok(Math.abs(relStats.meanDistance-0.11108881850743782)<1e-15,'relative mean bridge distance');
ok(Math.abs(relStats.minDistance-0.0023194948679866128)<1e-15,'relative minimum bridge distance');
eq(relStats.minBlocks,{pi:'46095',e:'35966',phi:'38622',sqrt2:'60558'},'minimum-distance receipt');
eq([relStats.insideFrames,relStats.boundaryFrames,relStats.degenerateFrames,relStats.maxAreaIndex],[8,0,0,59],'finite barycentric frame fixture');
ok(Math.abs(relStats.meanArea-0.008437648275172164)<1e-15,'mean triangle area fixture');
ok(Math.abs(relStats.maxArea-0.03117488148173245)<1e-15,'maximum triangle area fixture');
eq(relStats.maxAreaBlocks,{pi:'41273',e:'92069',phi:'95364',sqrt2:'07989'},'maximum-area receipt');

const audit=D.audit();
eq(audit.status,'PASS','model audit');
eq(audit.claimBoundary,'FINITE_DECIMAL_DIAGNOSTIC_NOT_NORMALITY_PROOF','claim ceiling');
eq(audit.relativeClaimBoundary,'COORDINATE_CHANGE_AND_DECLARED_THRESHOLD_NOT_CONSTANT_RELATION','relative claim ceiling');
eq(audit.triangleClaimBoundary,'FINITE_BLOCK_BARYCENTRIC_TEST_NOT_CONSTANT_IDENTITY','triangle claim ceiling');
eq(audit.graphDelta,{newNodes:0,newRelations:0,newAliases:0},'existing identity only');

const html=fs.readFileSync(path.join(__dirname,'assets/a0-field-notes/index.html'),'utf8');
for(const token of ['id="digit-pentagon-ticker"','id="pi-relative-ticker"','digit-pentagon-ticker.css','digit-pentagon-ticker.js','data-dpt-offset','data-dpt-receipt','data-dpt-relative-svg','data-dpt-relative-bary','λe·Ce + λφ·Cφ + λ√2·C√2','Crel,k = Ck − Cπ','NOT NORMALITY PROOF','VIEW ADAPTER ≠ CONSTANT IDENTITY'])ok(html.includes(token),token);

console.log(JSON.stringify({status:'PASS',checks,digitsPerConstant:500,frames:100,scope:'finite decimal-position visualization, centroid diagnostic, oriented extrema projection, loss receipt, offset control, typed RATH display adapter and pi-centered relative coordinate view with finite-segment and barycentric triangle tests; no normality proof, constant relation, new graph relation or research activation'}));
