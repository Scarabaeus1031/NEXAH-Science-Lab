'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const B=require('./a0-root7-open-book.js'),R=require('./a0-root7-q4-coupling.js'),C=require('./a0-orientation-controller-bench.js');
let checks=0;const ok=(v,s)=>{checks++;assert.ok(v,s);},near=(a,b)=>ok(Math.abs(a-b)<1e-9,a+' ≈ '+b);
const distance=(p,q)=>Math.hypot(...p.map((v,i)=>v-q[i]));
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const triangle=(p,q,r)=>Math.hypot(...cross(q.map((v,i)=>v-p[i]),r.map((v,i)=>v-p[i])))/2;
const area=p=>p.slice(1,-1).reduce((s,_,i)=>s+triangle(p[0],p[i+1],p[i+2]),0);
for(let angle=0;angle<=180;angle++){
  const r=B.snapshot(0,0,{angle}),[l,rr]=r.geometry.pages,baseline=B.snapshot(0,0,{angle:180}).geometry.pages;
  near(r.options.angle,angle);
  r.geometry.pages.forEach((page,j)=>{
    ok(page.vertices.length===5,'five genuine boundary vertices');
    for(const key of ['top','center','bottom'])assert.deepEqual(page.points[key],r.geometry.hinge[key]);checks+=3;
    for(let i=0;i<5;i++)for(let k=i+1;k<5;k++)near(distance(page.vertices[i],page.vertices[k]),distance(baseline[j].vertices[i],baseline[j].vertices[k]));
    const edges=page.rhombus.map((p,i)=>distance(p,page.rhombus[(i+1)%4]));edges.forEach(x=>near(x,edges[0]));
    near(area(page.vertices),page.pageArea);near(area(page.rhombus),page.rhombusArea);
    near(area(page.rhombus)+page.triangles.reduce((s,t)=>s+triangle(...t),0),area(page.vertices));
  });
  l.vertices.forEach((p,i)=>{const q=rr.vertices[i];near(p[0],-q[0]);near(p[1],q[1]);near(p[2],q[2]);});
  const lp=l.points.tip,rp=rr.points.tip;
  near(distance(lp,rp),4*B.A*Math.sin(angle*Math.PI/360));
  // Opening α is the angle between radial vectors of the two pages.
  const cosine=(lp[0]*rp[0]+lp[2]*rp[2])/(4*B.A*B.A);near(cosine,Math.cos(angle*Math.PI/180));
  ok(!/NaN|Infinity|undefined/.test(B.drawing(r)),'finite drawing');
}
const flat=B.snapshot(0,0,{angle:180});
ok(flat.geometry.flatOutline==='HEXAGON_WITH_TWO_COLLINEAR_HINGE_WITNESSES');
near(flat.geometry.areas.pagesTotal,flat.geometry.areas.rhombiTotal+flat.geometry.areas.fourTrianglesTotal);
// Six true outer corners at flat opening, not nine regular-pentagon vertices.
const p=flat.geometry.pages;
const outline=[p[0].points.tip,p[0].points.upper,p[1].points.upper,p[1].points.tip,p[1].points.lower,p[0].points.lower];
outline.forEach((v,i)=>near(distance(v,outline[(i+1)%6]),2*B.A));
for(let tick=0;tick<16;tick++){
  const state=C.createRootSpaceEngine({tick}),before=JSON.stringify(state),r=R.snapshot(state,C,'q4',{}, {mode:'follow'});
  near(r.bookView.options.angle,22.5*Math.min(tick,16-tick));ok(r.bookView.sourceTick===tick);ok(r.bookView.sourceLayer===state.frame.layer);ok(JSON.stringify(state)===before);
  assert.deepEqual(R.snapshot(JSON.parse(before),C,'q4',r.sectionView.options,r.bookView.options),r);checks++;
}
for(const opt of [{angle:-1},{angle:181},{angle:NaN},{mode:'auto'},{focus:'unknown'}]){assert.throws(()=>B.snapshot(0,0,opt));checks++;}
for(const pair of [[16,0],[-1,0],[0,2],[0,NaN]]){assert.throws(()=>B.snapshot(...pair));checks++;}
const html=fs.readFileSync(path.join(__dirname,'A0_ORIENTATION_CONTROLLER_BENCH.html'),'utf8');
for(const id of ['root7OpenBook','root7BookSvg','root7BookLedger','root7BookMode','root7BookAngle','root7BookFocus','root7BookClosed','root7BookOpen','root7BookFlat'])ok(html.includes('id="'+id+'"'),id);
ok(html.indexOf('src="a0-root7-open-book.js"')<html.indexOf('src="a0-root7-q4-coupling.js"'));
const nodes=new Map(),doc={getElementById:id=>{if(!nodes.has(id))nodes.set(id,{dataset:{},value:undefined,textContent:'',innerHTML:''});return nodes.get(id);}};
const set=(id,v)=>doc.getElementById(id).value=v;
set('root7BookMode','follow');set('root7BookFocus','left');
const rendered=R.render(doc,C.createRootSpaceEngine({tick:8}),C,'q4');near(rendered.bookView.options.angle,180);ok(doc.getElementById('root7BookAngle').disabled);ok(doc.getElementById('root7BookLedger').textContent.includes('FLACH'));
set('root7BookMode','manual');set('root7BookAngle','90');
const manual=R.render(doc,C.createRootSpaceEngine({tick:8}),C,'q4');near(manual.bookView.options.angle,90);ok(!doc.getElementById('root7BookAngle').disabled);
set('root7BookAngle','wrong');ok(R.render(doc,C.createRootSpaceEngine(),C,'q4')===null);ok(doc.getElementById('root7BookSvg').innerHTML==='');ok(doc.getElementById('root7BookLedger').textContent==='HOLD');
const code=fs.readFileSync(path.join(__dirname,'a0-root7-open-book.js'),'utf8');ok(!/setInterval|setTimeout|requestAnimationFrame|fetch\(|postMessage|localStorage/.test(code),'read-only adapter without own clock');
const record=JSON.parse(fs.readFileSync(path.join(__dirname,'assets/a0-root7-q4-coupling-v1.json'),'utf8')),ref=record.openBook.visualReference;
ok(require('node:crypto').createHash('sha256').update(fs.readFileSync(ref.path)).digest('hex')===ref.sha256,'exact user-supplied visual reference retained, without adopting its claims');
console.log('PASS '+checks+' open-book geometry, mirror, hinge, source-binding and DOM checks');
