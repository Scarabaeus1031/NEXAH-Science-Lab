'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const api=require('./a0-bench-foyer.js');let checks=0;
const ok=x=>{assert(x);checks++;};
class E{
 constructor(){this.parts={};this.handlers={};this.dataset={};this.attrs={};this.classList={toggle:(key,on)=>this.attrs[key]=on};}
 querySelector(s){return this.parts[s]||(this.parts[s]=new E());}
 addEventListener(n,f){(this.handlers[n]||=[]).push(f);}
 fire(n){for(const f of this.handlers[n]||[])f({target:this});}
 setAttribute(k,v){this.attrs[k]=v;}hasAttribute(k){return k in this.attrs;}
 removeAttribute(k){delete this.attrs[k];}toggleAttribute(k,on){on?this.setAttribute(k,''):this.removeAttribute(k);}
 appendChild(n){this.child=n;}remove(){this.removed=true;}pause(){this.paused=true;}focus(){this.focused=true;}
}
(async()=>{
 const html=fs.readFileSync(__dirname+'/A0_ORIENTATION_CONTROLLER_BENCH.html','utf8');
 for(const d of api.DOORS){
  ok(fs.existsSync(path.join(__dirname,d[3])));
  ok(d[2].includes('.html')?fs.existsSync(path.join(__dirname,d[2].split(/[?#]/)[0])):html.includes('id="'+d[2]+'"'));
 }
 ok(api.DOORS.length===9);ok(html.includes('id="benchVisualShelves"'));ok(!html.includes('class="bf-door"'));
 for(const m of api.MODELS){const bytes=fs.readFileSync(path.resolve(__dirname,m.href));ok(crypto.createHash('sha256').update(bytes).digest('hex')===m.sha256);}
 ok(fs.existsSync(__dirname+'/assets/vendor/a0-model-viewer-classic.js'));
 for(const h of ['', '#orientationBench','#benchFoyer','#foyerDoors'])ok(api.isFoyer(h));
 for(const h of ['#benchMap','#benchOverview','#maskObserverBench'])ok(!api.isFoyer(h));
 const host=new E(),body=new E(),head=new E(),listeners={};let focusCalls=0,creations=0,fetchCalls=0;
 host.querySelectorAll=()=>api.MODELS.map((m,i)=>{const n=new E();n.dataset.bfModel=String(i);return n;});
 const doc={getElementById:()=>host,body,head,hidden:false,addEventListener:(k,f)=>listeners[k]=f,createElement:tag=>{if(tag==='model-viewer')creations++;return new E();}};
 const win={location:{hash:'#orientationBench'},customElements:{get:()=>true},fetch:async()=>{fetchCalls++;return{ok:true,arrayBuffer:async()=>new ArrayBuffer(0)};},A0MaskClockBench:{focus:()=>focusCalls++},addEventListener:(k,f)=>listeners[k]=f};
 const ctl=api.mount(doc,win),el=n=>host.querySelector('[data-bf-'+n+']');
 ok(creations===0);ok(body.attrs['bench-foyer-mode']);ok(focusCalls===1);ok(!ctl.select(99));
 await ctl.preload();ok(fetchCalls===3);ok(ctl.warmed===3);ok(el('status').textContent.includes('vorgeladen'));
 ok(el('counter').textContent==='01 / 03');ok(el('title').textContent==='17 Floors');ok(el('role').textContent.includes('Maschinenkörper'));
 ctl.select(1);ok(el('model-name').textContent==='Blue Pearl');
 ok(el('counter').textContent==='02 / 03');ok(el('facts').textContent.includes('111 Nodes'));
 el('next').fire('click');ok(ctl.chosen===2);ok(el('title').textContent==='Resonance Cathedral');
 el('next').fire('click');ok(ctl.chosen===0);el('prev').fire('click');ok(ctl.chosen===2);ctl.select(1);
 await ctl.load();ok(creations===1);let v=el('stage').child;ok(v.src===api.MODELS[1].href);ok(!v.hasAttribute('autoplay'));
 v.fire('load');ok(el('poster').hidden);ok(!el('rotate').disabled);
 el('rotate').fire('click');ok(v.hasAttribute('auto-rotate'));
 doc.hidden=true;listeners.visibilitychange();ok(!v.hasAttribute('auto-rotate'));
 el('camera').value='90deg 90deg auto';el('camera').fire('change');ok(v.cameraOrbit==='90deg 90deg 105%'&&v.cameraTarget==='auto auto auto');
 ctl.release();await ctl.load(true);v=el('stage').child;ok(v.hasAttribute('auto-rotate'));v.fire('load');ok(el('rotate').attrs['aria-pressed']==='true');
 const liveIndex=ctl.chosen;el('next').fire('click');await new Promise(resolve=>setImmediate(resolve));v=el('stage').child;ok(ctl.chosen===(liveIndex+1)%api.MODELS.length);ok(v.src===api.MODELS[ctl.chosen].href);ok(v.hasAttribute('auto-rotate'));
 win.location.hash='#benchMap';listeners.hashchange();ok(!body.attrs['bench-foyer-mode']);ok(v.removed);ok(!el('poster').hidden);
 win.location.hash='#benchFoyer';listeners.hashchange();ok(body.attrs['bench-foyer-mode']);
 const card=new E();card.dataset.bfModel='0';card.setAttribute('data-bf-enter','');host.handlers.click[0]({target:{closest:()=>card}});await new Promise(resolve=>setImmediate(resolve));v=el('stage').child;ok(v.src===api.MODELS[0].href);ok(v.hasAttribute('auto-rotate'));ctl.release();
 await ctl.load();v=el('stage').child;v.fire('error');ok(v.removed);ok(el('status').textContent.includes('HOLD'));ok(!el('poster').hidden);
 await ctl.load();v=el('stage').child;listeners.keydown({key:'Escape'});ok(v.removed);ok(el('load').focused);
 // Cancel a lazy library request by changing route.
 delete win.customElements;const pending=ctl.load();win.location.hash='#benchOverview';listeners.hashchange();win.customElements={get:()=>true};head.child.onload?.();await pending;ok(creations===6);
 win.location.hash='#benchFoyer';listeners.click({target:{closest:()=>true}});ok(win.location.hash==='#benchShowcase');ok(!body.attrs['bench-foyer-mode']);
 const source=fs.readFileSync(__dirname+'/a0-bench-foyer.js','utf8');ok(source.includes("cache:'force-cache'"));ok(!/setInterval|postMessage|\.play\(/.test(source));
 ok(html.indexOf('id="benchFoyer"')<html.indexOf('id="benchOverview"'));
 console.log(JSON.stringify({status:'PASS',checks,doors:9,models:3,scope:'DOM-double navigation, direct card launch, live arrow switching, persistent model controls, guarded three-model preloading, installation rotation, camera, release, errors, visibility, Escape, request cancellation and binary hashes; browser pixels OPEN'}));
})().catch(e=>{console.error(e);process.exitCode=1;});
