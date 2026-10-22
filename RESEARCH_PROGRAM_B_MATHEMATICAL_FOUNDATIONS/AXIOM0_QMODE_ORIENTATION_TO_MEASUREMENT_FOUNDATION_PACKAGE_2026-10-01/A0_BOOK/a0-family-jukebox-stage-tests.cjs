const assert=require('node:assert/strict'),fs=require('node:fs');
const api=require('./a0-family-jukebox-stage.js');
let checks=0;const ok=(v,m)=>{assert.ok(v,m);checks++},eq=(a,b)=>{assert.deepEqual(a,b);checks++};
const source=[.3,.5,-.7],copy=[...source];
for(const t of [0,1,10,100,1000,NaN]){
 const p=api.poseAt(t),x=api.transform(source,p);ok(x.every(Number.isFinite));ok(p.scale>=.975&&p.scale<=1.025);ok(Math.abs(p.tilt)<=.12);
 ok(Math.abs(Math.hypot(...x)-Math.hypot(...source)*p.scale)<1e-12);
}
eq(source,copy);eq(api.transform(source,api.poseAt(0)),source);
function harness(reduced=false){
 const buttons={children:[],append(x){this.children.push(x)}},status={},attrs={},events={},frames=[],media={matches:reduced,addEventListener:(k,f)=>events.media=f};
 let draws=0;
 const room={querySelector:s=>s.includes('lights')?buttons:status,setAttribute:(k,v)=>attrs[k]=v};
 const doc={getElementById:()=>room,createElement:()=>({dataset:{},setAttribute(k,v){this[k]=v}}),addEventListener:(k,f)=>events[k]=f};
 const win={matchMedia:()=>media,A0FamilySpatialReader:{redraw(){draws++}},requestAnimationFrame:fn=>frames.push(fn),addEventListener:(k,f)=>events[k]=f};
 const stage=api.mount(doc,win);
 return{stage,doc,win,buttons,status,attrs,events,frames,media,get draws(){return draws}};
}
const h=harness();eq(h.buttons.children.length,3);eq(h.stage.snapshot().mode,'room');eq(h.frames.length,0);eq(h.stage.pose(),null);
ok(h.stage.setMode('dance'));eq(h.attrs['data-light'],'dance');eq(h.frames.length,1);eq(h.buttons.children[2]['aria-pressed'],'true');
h.frames.shift()(0);h.frames.shift()(50);ok(h.stage.snapshot().decorative_seconds>0);ok(h.draws>1);
ok(h.stage.pose().yaw>0);eq(h.stage.snapshot().source_state_transferred,false);
h.stage.setMode('read');const oldDraws=h.draws;h.frames.shift()(100);eq(h.draws,oldDraws);eq(h.stage.pose(),null);eq(h.stage.snapshot().decorative_seconds,0);
ok(!h.stage.setMode('new-state'));eq(h.stage.snapshot().mode,'read');
h.stage.setMode('dance');h.doc.hidden=true;h.events.visibilitychange();eq(h.stage.snapshot().mode,'room');ok(h.status.textContent.includes('pausiert'));
h.stage.setMode('dance');h.media.matches=true;h.events.media();eq(h.stage.snapshot().mode,'room');ok(h.status.textContent.includes('reduzieren'));
const r=harness(true);r.stage.setMode('dance');eq(r.frames.length,0);eq(r.stage.snapshot().mode,'room');ok(r.status.textContent.includes('statisch'));
h.media.matches=false;h.stage.setMode('dance');h.events.pagehide();eq(h.attrs['data-light'],'room');
const text=fs.readFileSync(__dirname+'/a0-family-jukebox-stage.js','utf8');
ok(!/A0FamilyAtlasBridge|setInterval|localStorage|fetch\(/.test(text));
// No engine/Family API is available to the stage; animation is bounded decorative time only.
const css=fs.readFileSync(__dirname+'/a0-family-jukebox-stage.css','utf8');
ok(css.includes('prefers-reduced-motion'));ok(css.includes('18s'));ok(!css.includes('colors.exact'));
console.log(JSON.stringify({status:'PASS',checks,scope:'rigid source-copy pose + bounded pulse; opt-in decorative stage; no state transfer; visibility/reduced-motion/stale-frame stops; browser pixels OPEN'}));
