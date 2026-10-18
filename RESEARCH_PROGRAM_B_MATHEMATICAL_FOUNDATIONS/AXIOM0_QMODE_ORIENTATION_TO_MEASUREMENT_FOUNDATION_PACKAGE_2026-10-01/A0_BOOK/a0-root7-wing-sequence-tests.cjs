'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),vm=require('node:vm'),W=require('./a0-root7-wing-sequence.js'),B=require('./a0-root7-open-book.js'),R=require('./a0-root7-q4-coupling.js'),C=require('./a0-orientation-controller-bench.js');
let checks=0;const ok=(x,m)=>{checks++;assert.ok(x,m);},near=(a,b)=>ok(Math.abs(a-b)<1e-8,a+' ≈ '+b),distance=(p,q)=>Math.hypot(...p.map((x,i)=>x-q[i]));
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],area=p=>p.slice(1,-1).reduce((sum,_,i)=>sum+Math.hypot(...cross(p[i+1].map((x,j)=>x-p[0][j]),p[i+2].map((x,j)=>x-p[0][j])))/2,0);
const baseline=W.snapshot(0,'manual',180,{});
const binding=JSON.parse(fs.readFileSync(__dirname+'/assets/a0-root7-wing-sequence-v1.json','utf8')),crypto=require('node:crypto'),path=require('node:path');
for(const source of [...binding.implementationFiles,...binding.ownerVisuals])ok(crypto.createHash('sha256').update(fs.readFileSync(path.resolve(__dirname,source.path))).digest('hex')===source.sha256,'source/visual pin '+source.path);
for(const value of Object.values(binding.authority))ok(value===false,'no authority promotion');
for(const crease of ['spine','horizontal'])for(const branch of ['front','back'])for(const angle of [0,.5,45,90,120,179.5,180])for(const turn of [0,90,180,270,360]){
 const pose=W.snapshot(0,'manual',angle,{crease,branch,turn,tilt:24,palette:'owner',cutAngle:17,cutOffset:.2});
 ok(pose.referenceCrossFixed&&!pose.independentCreasesSimultaneouslyActive);
 pose.facets.forEach((f,i)=>{
  for(let a=0;a<4;a++)for(let b=a+1;b<4;b++)near(distance(f.points[a],f.points[b]),distance(baseline.facets[i].model[a],baseline.facets[i].model[b]));
  near(area(f.points),area(baseline.facets[i].model));near(area(f.model),area(f.points));
  // All four vertices remain coplanar on their rigid material facet.
  const e=f.points[3].map((x,i)=>x-f.points[0][i]);near(e.reduce((s,x,i)=>s+x*f.normal[i],0),0);
 });
 for(const cut of pose.cuts)for(const segment of cut.segments)for(const p of segment.points){
  near(p.reduce((s,x,i)=>s+x*cut.normal[i],0),cut.offset);
  ok(p.every(Number.isFinite),'finite exact plane intersection');
 }
 ok(!/NaN|Infinity|undefined/.test(W.drawing(pose)),'finite wing SVG');
 ok(!/NaN|Infinity|undefined/.test(W.cutDrawing(pose)),'finite section SVG');
}
for(const crease of ['spine','horizontal']){
 const front=W.snapshot(0,'manual',0,{crease,branch:'front'}),back=W.snapshot(0,'manual',0,{crease,branch:'back'});
 front.facets.forEach((f,i)=>f.points.forEach((p,j)=>p.forEach((x,k)=>near(x,back.facets[i].points[j][k]))));
}
const p=[.7,-.3,.4],a=W.pose(p,0,24),b=W.pose(p,90,24);near(b[0],-a[1]);near(b[1],a[0]);near(b[2],a[2]);
const first=W.snapshot(0,'sequence',180,{}),last=W.snapshot(15,'sequence',180,{});
assert.deepEqual(first.facets,last.facets);checks++;ok(last.viewReturn&&!last.sourceReturnClaim);
for(let t=0;t<16;t++){
 const state=C.createRootSpaceEngine({tick:t}),before=JSON.stringify(state),r=R.snapshot(state,C,'q4',{}, {mode:'sequence',palette:'owner'});
 ok(JSON.stringify(state)===before,'read-only Q4 lens');
 assert.deepEqual(R.snapshot(state,C,'q4',r.sectionView.options,r.bookView.options),r);checks++;
}
for(const options of [{crease:'bad'},{branch:'bad'},{turn:-1},{turn:361},{tilt:61},{palette:'bad'},{cutAngle:NaN},{cutOffset:1.51}]){assert.throws(()=>B.snapshot(0,0,options));checks++;}
const html=fs.readFileSync(__dirname+'/A0_ORIENTATION_CONTROLLER_BENCH.html','utf8'),ids=new Map(),doc={getElementById:id=>{if(!ids.has(id))ids.set(id,{value:undefined,events:{},innerHTML:'',textContent:'',dataset:{},addEventListener(k,f){this.events[k]=f;}});return ids.get(id);}};
let interval=null;const scope=vm.createContext({C,window:{A0Root7Coupling:R,A0Root7Sections:require('./a0-root7-section-mirror.js'),A0Root7Book:B},document:doc,$:doc.getElementById,setInterval:f=>{interval=f;return 1;},clearInterval:()=>{interval=null;},renderRoot838(){scope.latest=R.render(doc,scope.engine(),C,'q4');}});
const extract=(from,to)=>html.slice(html.indexOf(from),html.indexOf(to,html.indexOf(from)));
// The actual scheduler and running setter, plus the actual newly added book handlers.
const scheduler=html.split('\n').filter(l=>l.startsWith('  function stopRootEngine()')||l.startsWith('  function scheduleRootEngine()')||l.startsWith('  function setRootEngineRunning(')).join('\n');
vm.runInContext("let rootEngineTimer=null,root838Mode='q4',rootEngineState=C.createRootSpaceEngine();window.engine=()=>rootEngineState;"+scheduler,scope);
scope.engine=scope.window.engine;
const handlers=html.split('\n').filter(l=>/^\s+\$\('root7Book(Quarter|Sequence|Pause|PoseReturn)'\)\.addEventListener/.test(l)||l.includes("['root7BookBranch','root7BookTurn'")||l.includes("$('root7BookCrease').addEventListener")).join('\n');
vm.runInContext(handlers,scope);
doc.getElementById('root7BookSequence').events.click();ok(interval!==null,'existing Q4 timer starts');ok(scope.latest.bookView.options.mode==='sequence');
for(let i=0;i<15;i++){ok(typeof interval==='function');interval();}
ok(interval===null,'sequence automatically stops at declared view return');ok(scope.latest.source.tick===15&&scope.latest.bookView.wingSequence.viewReturn,'view return does not fake tick zero');
doc.getElementById('root7BookQuarter').events.click();ok(scope.latest.bookView.options.mode==='manual');ok(scope.latest.bookView.options.turn===90);
doc.getElementById('root7BookPoseReturn').events.click();ok(scope.latest.bookView.options.turn===0&&scope.latest.bookView.options.angle===180);ok(scope.latest.source.tick===15,'manual pose return does not reset carrier');
doc.getElementById('root7BookCrease').value='horizontal';doc.getElementById('root7BookAngle').value='90';doc.getElementById('root7BookCrease').events.input();ok(scope.latest.bookView.options.angle===180,'axis switch is registered flat');
const nodes=html.match(/\bid="[^"]+"/g);ok(new Set(nodes).size===nodes.length,'unique IDs');
for(const name of ['a0-root7-wing-sequence.js','a0-root7-open-book.js'])ok(!/setInterval|setTimeout|requestAnimationFrame|fetch\(|postMessage/.test(fs.readFileSync(__dirname+'/'+name,'utf8')),'no private animation clock');
const start=html.indexOf('<section id="root7OpenBook"'),end=html.indexOf('<section id="root7Sections"');
for(const match of html.slice(start,end).matchAll(/href="([^"]+)"/g)){const u=new URL(match[1],'file://'+__dirname+'/A0_ORIENTATION_CONTROLLER_BENCH.html'),file=decodeURIComponent(u.pathname);ok(fs.existsSync(file),'source link '+match[1]);if(u.hash)ok(fs.readFileSync(file,'utf8').includes('id="'+u.hash.slice(1)+'"'),'anchor '+match[1]);}
console.log(JSON.stringify({status:'PASS',checks,rigidFacets:4,sequenceStations:16,sourceTimer:'existing Q4 only',browserAcceptance:false,scientificClaimPromotion:false}));
