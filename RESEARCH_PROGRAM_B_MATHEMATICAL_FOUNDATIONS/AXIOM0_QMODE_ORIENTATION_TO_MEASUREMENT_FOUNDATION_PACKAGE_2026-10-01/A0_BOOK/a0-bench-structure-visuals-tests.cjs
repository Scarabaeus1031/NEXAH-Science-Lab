'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const V=require('./a0-bench-structure-visuals.js'),M=require('./a0-bench-machine-picture.js'),MapModel=require('./a0-bench-map.js'),C=require('./a0-orientation-controller-bench.js'),Mask=require('./a0-mask-observer.js'),R=require('./a0-return-economy.js');
let checks=0;const ok=v=>{assert(v);checks++;};
const before=JSON.stringify([C.createState(),Mask.DEFAULT,R.METRICS]);
for(const group of MapModel.GROUPS){
 const svg=V.svg(group.id);ok(svg.includes('<svg'));ok(!/NaN|Infinity|undefined/.test(svg));ok(V.image(group.id).url.startsWith('data:image/svg+xml'));ok(V.META[group.id].source.length>0);
 ok(M.imageFor(group.id,null).url.startsWith('data:image/svg+xml'));
}
ok(V.META.VERIFY.kind==='CONCEPT');ok(V.fixture('STATE').primes.join(',')===C.PRIMES.join(','));
ok(V.fixture('OPERATE').after.every(x=>x.state.history.length===0));
ok(V.fixture('VIEW').cuts.points.length===Mask.frame(Mask.DEFAULT,0).cuts.points.length);
ok(V.fixture('RETURN').returned===42);ok(V.fixture('RETURN').exact===true);
ok(JSON.stringify([C.createState(),Mask.DEFAULT,R.METRICS])===before);
const ports=V.ports();ok(ports.length===39);ok(ports.every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)&&p.x>0&&p.x<1240&&p.y>0&&p.y<960));
for(const module of MapModel.MODULES){
 const svg=V.composition(module.id,M.COLORS,M.DASH);ok((svg.match(/data-machine-select=/g)||[]).length===39);ok((svg.match(/data-machine-edge=/g)||[]).length===19);ok(!/NaN|Infinity|undefined/.test(svg));ok(!svg.includes('nicht geladen'));ok(svg.includes('KONZEPTUELLE ANORDNUNG'));
}
const header=fs.readFileSync(__dirname+'/A0_ORIENTATION_CONTROLLER_BENCH.html','utf8');ok(header.indexOf('src="a0-bench-structure-visuals.js"')<header.indexOf('src="a0-bench-visual-shelves.js"'));
const source=fs.readFileSync(__dirname+'/a0-bench-structure-visuals.js','utf8');ok(!/setInterval|requestAnimationFrame|postMessage|fetch\(|\.play\(|createElement\(/.test(source));
console.log(JSON.stringify({status:'PASS',checks,structureVisuals:6,conceptVisuals:1,modules:39,edges:19,scope:'source fixtures, immutable inputs, no live controller calls, complete finite composition, exact graph reuse; browser pixels OPEN'}));
