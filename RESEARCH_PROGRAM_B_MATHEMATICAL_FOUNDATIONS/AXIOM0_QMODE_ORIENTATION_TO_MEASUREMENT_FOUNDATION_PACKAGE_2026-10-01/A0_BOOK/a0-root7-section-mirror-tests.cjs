'use strict';
const a=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const S=require('./a0-root7-section-mirror.js'),R=require('./a0-root7-q4-coupling.js'),C=require('./a0-orientation-controller-bench.js');
let checks=0;function ok(v,label){checks++;a.ok(v,label);}function near(x,y){ok(Math.abs(x-y)<1e-8,x+' ≈ '+y);}
const area=p=>Math.abs(p.reduce((s,v,i)=>{const q=p[(i+1)%p.length];return s+v[0]*q[1]-v[1]*q[0];},0))/2;
for(let i=0;i<=300;i++){
  const t=i/100,c=S.cut(t),expected=t===0||t===3?1:t<=1||t>=2?3:6;
  ok(c.vertexCount===expected,'section cardinality '+t);
  c.vertices.forEach(p=>{near(p[0]/2+p[1]+p[2],t);ok(p.every((v,j)=>v>=-1e-9&&v<=[2,1,1][j]+1e-9),'inside actual cuboid');});
  near(c.area,S.cut(3-t).area);
  near(c.triangles.reduce((s,tri)=>s+area(tri.map(j=>c.plane[j])),0),c.area);
  for(let j=0;j<c.vertices.length;j++)for(let k=j+1;k<c.vertices.length;k++)near(Math.hypot(...c.vertices[j].map((v,m)=>v-c.vertices[k][m])),Math.hypot(...c.plane[j].map((v,m)=>v-c.plane[k][m])));
}
ok(S.cut(1.5).triangles.length===4,'hexagon four-triangle fan');
near(S.cut(1.5).area,2.25); // normalized area times anisotropic plane-area factor
for(const angle of [0,15,30,45,60,90])for(const order of ['AB','BA']){
  const r=S.snapshot(5,1,{angle,order}),alpha=r.mirrors.rotationDegrees*Math.PI/180;
  r.section.plane.forEach((p,i)=>{
    const twice=S.mirror(S.mirror(p,angle),angle);near(twice[0],p[0]);near(twice[1],p[1]);
    const q=r.mirrors.second[i];near(q[0],Math.cos(alpha)*p[0]-Math.sin(alpha)*p[1]);near(q[1],Math.sin(alpha)*p[0]+Math.cos(alpha)*p[1]);
    near(Math.hypot(...p),Math.hypot(...q));
  });near(area(r.section.plane),area(r.mirrors.first));near(area(r.section.plane),area(r.mirrors.second));
}
for(const angle of [0,30,45,90])for(const order of ['A','B']){
  const r=S.snapshot(5,1,{angle,order}),expectedAngle=order==='A'?0:angle;
  ok(r.mirrors.finalType==='REFLECTION',order+' is a single reflection');ok(r.mirrors.rotationDegrees===null,order+' is not reported as a rotation');
  ok(r.mirrors.views.length===2,order+' exposes original and one result');ok(r.mirrors.determinants.at(-1)===-1,order+' reverses orientation');
  r.section.plane.forEach((p,i)=>{const q=S.mirror(p,expectedAngle),actual=r.mirrors.final[i];near(actual[0],q[0]);near(actual[1],q[1]);near(Math.hypot(...p),Math.hypot(...actual));});
  near(area(r.section.plane),area(r.mirrors.final));ok(!S.drawing(r).includes('NaN'),'finite single-mirror SVG');
}
for(let tick=0;tick<16;tick++){
  const state=C.createRootSpaceEngine({tick}),before=JSON.stringify(state),r=R.snapshot(state,C,'q4',{mode:'follow',angle:30,order:'BA'});
  near(r.sectionView.section.t,3*tick/15);ok(r.sectionView.sourceTick===tick);ok(r.sectionView.layer===state.frame.layer);ok(JSON.stringify(state)===before,'source unchanged');
  ok(!S.drawing(r.sectionView).includes('NaN'),'finite SVG');
  const replay=R.snapshot(JSON.parse(before),C,'q4',r.sectionView.options);a.deepEqual(replay,r);checks++;
}
for(const t of [-1,4,NaN,Infinity]){a.throws(()=>S.cut(t));checks++;}
for(const opt of [{angle:NaN},{order:'XX'},{mode:'auto'},{t:Infinity}]){a.throws(()=>S.snapshot(0,0,opt));checks++;}
const html=fs.readFileSync(path.join(__dirname,'A0_ORIENTATION_CONTROLLER_BENCH.html'),'utf8');
for(const id of ['root7Sections','root7CutMode','root7CutPosition','root7CutCenter','root7MirrorAngle','root7MirrorOrder','root7SectionSvg','root7SectionLedger'])ok(html.includes('id="'+id+'"'),id);
for(const value of ['A','B','AB','BA'])ok(html.includes('option value="'+value+'"'),value+' mirror mode');
ok(html.indexOf('src="a0-root7-section-mirror.js"')<html.indexOf('src="a0-root7-q4-coupling.js"'),'dependency order');
const nodes=new Map(),doc={getElementById:id=>{if(!nodes.has(id))nodes.set(id,{dataset:{},value:undefined,textContent:'',innerHTML:''});return nodes.get(id);}};
nodes.set('root7CutMode',{value:'follow'});nodes.set('root7MirrorAngle',{value:'30'});nodes.set('root7MirrorOrder',{value:'BA'});
const state=C.createRootSpaceEngine({tick:6}),record=R.render(doc,state,C,'q4');
near(record.sectionView.section.t,1.2);ok(nodes.get('root7CutPosition').disabled);ok(nodes.get('root7SectionLedger').textContent.includes('−60')||nodes.get('root7SectionLedger').textContent.includes('-60'));
R.render(doc,{...state,carrierId:'wrong'},C,'q4');ok(nodes.get('root7SectionSvg').innerHTML==='');ok(nodes.get('root7SectionLedger').textContent==='HOLD');
ok(!/setInterval|setTimeout|requestAnimationFrame|fetch\(|postMessage|localStorage/.test(fs.readFileSync(path.join(__dirname,'a0-root7-section-mirror.js'),'utf8')),'no second clock or external writes');
console.log('PASS '+checks+' section/mirror geometry, source-binding and DOM checks');
