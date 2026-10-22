const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const api=require('./a0-family-record-player.js');let checks=0;
const ok=(v,m)=>{assert.ok(v,m);checks++},eq=(a,b)=>{assert.deepEqual(a,b);checks++};
const html=fs.readFileSync(path.join(__dirname,'A0_FAMILY_CONNECTION_ATLAS.html'),'utf8');
const source=fs.readFileSync(path.join(__dirname,'a0-family-record-player.js'),'utf8');
const m=api.create();eq(m.snapshot(),{id:'tessarec',view:'state',address:0});
for(let i=0;i<16;i++){ok(m.address(i));eq(m.snapshot().address,i);}
for(const bad of [-1,16,1.2,NaN,'2',null])ok(!m.address(bad));
ok(!m.select('unknown'));ok(!m.view('goethe'));ok(m.view('observer'));
for(const r of api.RECORDS){
 ok(m.select(r.id));eq(m.snapshot().address,r.id==='tessarec'?15:null);
 for(const v of r.views){
  ok(m.view(v[0]));eq(m.snapshot().view,v[0]);
  const [file,anchor]=api.sourceHref(r,v[0]).split('#');
  const h=file?fs.readFileSync(path.join(__dirname,file),'utf8'):html;
  ok(!anchor||h.includes('id="'+anchor+'"'),r.id+' anchor '+anchor);
  if(r.id!=='tessarec'){const svg=api.artwork(r,v[0]);ok(svg.startsWith('<svg'));ok(svg.includes('KEIN LIVE-READBACK'));ok(!/NaN|undefined|<script|https?:\/\//.test(svg.replace('http://www.w3.org/2000/svg','')));ok(!m.address(3));}
 }
}
ok(m.select('tessarec'));eq(m.snapshot(),{id:'tessarec',view:'observer',address:15});
ok(html.includes('id="familyRecordPlayer"'));ok(html.includes('a0-family-record-player.css'));
ok(!/setInterval|setTimeout|fetch\(|iframe|localStorage|sessionStorage|twPlay/.test(source));
// Actual intro controller: exactly one existing animation loop, no automatic state/mode changes.
const intro=html.slice(html.indexOf('function initAtlasIntro(){'),html.indexOf('    const families={'));
function introHarness(reduced){
 const queue=[],nodes={},listeners={},arcs=[];const ctx=new Proxy({arc:(...p)=>arcs.push(p)},{get:(o,k)=>o[k]||(()=>{})});
 for(const id of ['atlasIntroCanvas','atlasIntroField','atlasIntroCore','atlasIntroReadout'])nodes[id]={textContent:'',getContext:()=>ctx,getBoundingClientRect:()=>({width:600,height:360})};
 const buttons=['state','phase','observer'].map(mode=>({dataset:{introMode:mode},setAttribute(){}}));
 const win={};const sandbox={window:win,$:id=>nodes[id],document:{querySelectorAll:()=>buttons},matchMedia:()=>({matches:reduced}),devicePixelRatio:1,requestAnimationFrame:fn=>queue.push(fn),addEventListener:(k,fn)=>listeners[k]=fn};
 vm.runInNewContext(intro+';initAtlasIntro();',sandbox);
 return {api:win.A0AtlasIntroView,queue,nodes,listeners,arcs};
}
for(const reduced of [false,true]){
 const h=introHarness(reduced);eq(h.queue.length,1);
 h.queue.shift()(0);eq(h.queue.length,reduced?0:1);
 ok(h.api.selectMode('observer'));ok(h.api.selectAddress(11));ok(!h.api.selectAddress(16));ok(!h.api.selectMode('bad'));
 h.api.refresh();if(!reduced)eq(h.queue.length,1);
 while(h.queue.length&&reduced)h.queue.shift()(90000);
 if(!reduced){h.queue.shift()(90000);eq(h.queue.length,1);}
 eq(JSON.parse(JSON.stringify(h.api.snapshot())),{mode:'observer',address:11,scope:'INTRO_ONLY'});
 ok(h.nodes.atlasIntroCore.textContent.includes('S11'));
 const p=h.arcs.findLast(a=>a[2]===6.4);eq(h.api.selectAt(p[0],p[1]),11);
 eq(h.api.selectAt(-1000,-1000),null);eq(h.api.selectAt(NaN,0),null);
 eq(h.api.snapshot().mode,'observer');h.api.setLens(false);h.api.setLens(true);
 if(!reduced)eq(h.queue.length,1);
}
// Small DOM double executes actual mount/events without loading any original.
function domHarness(options={}){
 const els={},records=api.RECORDS.map(r=>({dataset:{frpRecord:r.id},setAttribute(k,v){this[k]=v;}})),events={},calls=[];
 const element=()=>({hidden:false,textContent:'',value:'',innerHTML:'',style:{setProperty(){}},setAttribute(k,v){this[k]=v;},addEventListener(k,fn){this[k]=fn;},append(n){this.child=n;},focus(){this.focused=true;}});
 const stations=[...api.GRAY,...api.GRAY].map(address=>({dataset:{frpStation:String(address)},setAttribute(k,v){this[k]=v;}}));
 const layouts=['wheel','jukebox'].map(id=>({dataset:{frpLayout:id},setAttribute(k,v){this[k]=v;}}));
 const host={dataset:{},style:{setProperty(){}},innerHTML:'',querySelector(s){return els[s]||(els[s]=element());},querySelectorAll:s=>s==='[data-frp-station]'?stations:s==='[data-frp-layout]'?layouts:records,addEventListener(k,fn){events[k]=fn;}};
 const native={},map={scrollIntoView:()=>calls.push('scroll')},start={classList:{add:()=>{}}};
 const canvas=element();canvas.getBoundingClientRect=()=>({left:10,top:20});
 const doc={hidden:false,addEventListener(k,fn){this[k]=fn;},getElementById:id=>({familyRecordPlayer:host,start,map,atlasIntroCanvas:canvas}[id]),querySelector:()=>native};
 const win={location:{href:options.url||'file:///book/A0_FAMILY_CONNECTION_ATLAS.html'},A0AtlasIntroView:{selectMode:v=>calls.push(['view',v]),selectAddress:v=>calls.push(['address',v]),refresh:()=>calls.push('refresh'),setLens:v=>calls.push(['lens',v]),selectAt:(x,y)=>{calls.push(['pick',x,y]);return 9;}},A0FamilyAtlasBridge:{apply:s=>calls.push(['bridge',s])}};
 const click=(kind,value)=>{const target={dataset:{[kind]:value},closest:s=>s==='[data-'+kind.replace(/[A-Z]/g,c=>'-'+c.toLowerCase())+']'?target:null};events.click({target});};
 const queue=[];if(options.clock)win.requestAnimationFrame=fn=>queue.push(fn);win.matchMedia=()=>({matches:!!options.reduced});
 return{host,doc,win,els,calls,click,native,canvas,queue,stations,layouts};
}
const d=domHarness(),controller=api.mount(d.doc,d.win);ok(controller);eq(d.els['[data-frp-native]'].child,d.native);eq(api.mount(d.doc,d.win),null);
d.calls.length=0;d.click('frpRecord','eclipse');eq(d.calls,[]);eq(controller.snapshot().id,'eclipse');
ok(d.els['[data-frp-native]'].hidden);ok(!d.els['[data-frp-reference]'].hidden);
d.click('frpView','mirror');eq(d.calls,[]);ok(d.els['[data-frp-open]'].href.endsWith('#mirror'));
let prevented=false;d.els['[data-frp-open]'].click({preventDefault:()=>prevented=true});ok(!prevented);
d.click('frpRecord','tessarec');ok(!d.els['[data-frp-native]'].hidden);ok(d.els['[data-frp-reference]'].hidden);
d.els['[data-frp-address]'].value='7';d.els['[data-frp-address]'].input();eq(controller.snapshot().address,7);
d.calls.length=0;d.els['[data-frp-open]'].click({preventDefault:()=>prevented=true});ok(prevented);eq(d.calls,[['bridge',{mode:'tessarec'}],'scroll']);
d.calls.length=0;d.click('frpAtlas','family');eq(d.calls,[['bridge',{mode:'family'}],'scroll']);
d.els['[data-frp-lens]'].setAttribute=()=>{};
d.calls.length=0;d.els['[data-frp-lens]'].click();eq(d.calls,[['lens',false]]);
d.click('frpView','observer');d.canvas.pointerdown({clientX:50,clientY:80,button:0});
eq(controller.snapshot(),{id:'tessarec',view:'observer',address:9});ok(d.calls.some(c=>Array.isArray(c)&&c[0]==='pick'&&c[1]===40&&c[2]===60));
d.calls.length=0;d.canvas.pointerdown({clientX:50,clientY:80,button:2});eq(d.calls,[]);
d.click('frpRecord','eclipse');ok(d.els['[data-frp-lens-panel]'].hidden);d.calls.length=0;d.canvas.pointerdown({clientX:50,clientY:80,button:0});eq(d.calls,[]);
eq(new Set(api.GRAY).size,16);eq(api.GRAY[0],0);
for(const address of api.GRAY){const next=api.nextAddress(address),bit=address^next;ok(bit>0&&(bit&(bit-1))===0);}
eq(api.nextAddress(api.GRAY[15]),0);eq((api.wheelMarkup().match(/data-frp-station=/g)||[]).length,16);
const w=domHarness({clock:true}),wc=api.mount(w.doc,w.win);
ok(wc.isRunning());eq(w.queue.length,1);w.queue.shift()(0);w.queue.shift()(900);eq(wc.snapshot().address,1);eq(w.queue.length,1);
w.click('frpView','observer');ok(wc.isRunning());eq(wc.snapshot().address,1);
w.click('frpStation','6');ok(!wc.isRunning());eq(wc.snapshot(),{id:'tessarec',view:'observer',address:6});
w.queue.shift()(1800);eq(w.queue.length,0);eq(wc.snapshot().address,6);
w.els['[data-frp-orbit-play]'].click();w.els['[data-frp-orbit-play]'].click();w.els['[data-frp-orbit-play]'].click();
eq(w.queue.length,2);w.queue.shift()(2000);eq(w.queue.length,1);w.queue.shift()(2000);w.queue.shift()(2900);eq(wc.snapshot().address,api.nextAddress(6));eq(w.queue.length,1);
w.els['[data-frp-orbit-step]'].click();ok(!wc.isRunning());eq(wc.snapshot().view,'observer');
w.queue.shift()(4000);eq(w.queue.length,0);
w.els['[data-frp-orbit-play]'].click();w.doc.hidden=true;w.doc.visibilitychange();ok(!wc.isRunning());w.queue.shift()(5000);eq(w.queue.length,0);
w.doc.hidden=false;w.els['[data-frp-orbit-play]'].click();w.click('frpRecord','eclipse');ok(!wc.isRunning());ok(w.els['[data-frp-orbit-panel]'].hidden);w.queue.shift()(6000);eq(w.queue.length,0);
w.calls.length=0;wc.play();eq(w.queue.length,0);eq(w.calls,[]);
const reduced=domHarness({clock:true,reduced:true}),rc=api.mount(reduced.doc,reduced.win);ok(!rc.isRunning());eq(reduced.queue.length,0);rc.play();ok(rc.isRunning());rc.pause();
const incoming=domHarness({clock:true,url:'file:///book/A0_FAMILY_CONNECTION_ATLAS.html?plate=eclipse'}),ic=api.mount(incoming.doc,incoming.win);eq(ic.snapshot().id,'eclipse');ok(!ic.isRunning());eq(incoming.queue.length,0);
const notifications=[];const stop=ic.subscribe(s=>notifications.push(s.id));eq(notifications,['eclipse']);incoming.click('frpRecord','three-lenses');eq(notifications,['eclipse','three-lenses']);stop();incoming.click('frpRecord','caro');eq(notifications,['eclipse','three-lenses']);
const invalid=domHarness({url:'file:///book/A0_FAMILY_CONNECTION_ATLAS.html?plate=evil'});eq(api.mount(invalid.doc,invalid.win).snapshot().id,'tessarec');
const layoutHarness=domHarness({clock:true}),lc=api.mount(layoutHarness.doc,layoutHarness.win);const beforeLayout=lc.snapshot();layoutHarness.calls.length=0;
ok(lc.setLayout('jukebox'));eq(lc.displayLayout(),'jukebox');eq(lc.snapshot(),beforeLayout);ok(lc.isRunning());eq(layoutHarness.queue.length,1);eq(layoutHarness.calls,[]);
ok(layoutHarness.els['[data-frp-wheel-face]'].hidden);ok(!layoutHarness.els['[data-frp-jukebox-face]'].hidden);
layoutHarness.click('frpStation','12');eq(lc.snapshot().address,12);ok(!lc.isRunning());eq(layoutHarness.stations.filter(s=>s['aria-pressed']==='true').length,2);
layoutHarness.click('frpLayout','wheel');eq(lc.displayLayout(),'wheel');eq(lc.snapshot().address,12);ok(!lc.isRunning());ok(!lc.setLayout('unknown'));
eq((api.jukeboxMarkup().match(/data-frp-station=/g)||[]).length,16);eq((api.orbitMarkup().match(/data-frp-orbit-play/g)||[]).length,1);
console.log(JSON.stringify({status:'PASS',checks,scope:'model, anchors, mount/events, Gray station wheel, pause/resume/stale frames/hidden/reduced motion and intro controller in DOM double; browser pixels OPEN'}));
