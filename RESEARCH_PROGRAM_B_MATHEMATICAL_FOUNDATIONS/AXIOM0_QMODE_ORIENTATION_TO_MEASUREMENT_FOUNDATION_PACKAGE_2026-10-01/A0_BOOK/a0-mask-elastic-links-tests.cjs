'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),M=require('./a0-mask-observer.js'),E=require('./a0-mask-elastic-links.js'),V=require('./a0-mask-observer-view.js');
let checks=0;const eq=(a,b)=>{assert.deepEqual(a,b);checks++},ok=x=>{assert.ok(x);checks++};
for(const kind of ['pentagon','square'])for(const word of ['LRRL','RLLR'])for(let tick=0;tick<=120;tick++){
 const config={...M.DEFAULT,kind,word,angle:kind==='square'?45:36},f=M.frame(config,tick),before=JSON.stringify(f),r=E.snapshot(config,tick),base=M.frame(config,0);
 eq(r.links.length,f.a.length);eq(r.edgeCrossings,f.cuts.points.length);
 r.links.forEach((l,i)=>{eq(l.id,'A'+i+'↔B'+i);eq(l.a,f.a[i]);eq(l.b,f.b[i]);ok(Math.abs(l.length-Math.hypot(l.a[0]-l.b[0],l.a[1]-l.b[1]))<1e-12);ok(l.control.every(Number.isFinite));eq(l.delta,l.length-l.baselineLength);if(tick===0)eq(l.delta,0);});
 const out=E.drawing(config,tick,{visible:true});eq((out.match(/<path /g)||[]).length,f.a.length);ok(out.includes(' Q '));ok(E.drawing(config,tick,{visible:true,curved:false}).includes(' L '));eq(E.drawing(config,tick), '');
 const rendered=V.draw(f,[],{visible:true});ok(rendered.top.indexOf('data-mask-elastic-links')<rendered.top.indexOf('data-mask-fold-layer'));
 eq(JSON.stringify(f),before);
}
eq([0,30,60,90,120].map(t=>E.snapshot(M.DEFAULT,t).edgeCrossings),[10,2,10,6,10]);
const zero=E.snapshot({...M.DEFAULT,angle:0,amplitude:0},0);ok(zero.links.every(l=>l.length<1e-12&&l.control.every(Number.isFinite)));
for(const bad of [{visible:1},{curved:'yes'}]){assert.throws(()=>E.options(bad));checks++;}
const n=E.numberReading();eq(n.sequence.reduce((a,b)=>a+b,0),73);eq(n.sum,73);eq(n.pairSum,10);eq(n.digitSum73,7+3);
const primes=[];for(let x=2;x<=73;x++){let prime=true;for(let d=2;d*d<=x;d++)if(x%d===0)prime=false;if(prime)primes.push(x);}
eq(primes.length,21);eq(primes[20],73);eq(primes[1]+primes[3],10);
function el(){return {value:'',checked:false,disabled:false,textContent:'',innerHTML:'',events:{},setAttribute(){},addEventListener(k,f){this.events[k]=f;},click(){this.events.click?.({target:this});}};}
const html=fs.readFileSync(__dirname+'/A0_ORIENTATION_CONTROLLER_BENCH.html','utf8'),ids=[...html.matchAll(/id="(mask[^"]*)"/g)].map(m=>m[1]),els=Object.fromEntries(ids.map(id=>[id,el()]));
els.maskElasticVisible.checked=true;els.maskElasticCurved.checked=true;
const doc={getElementById:id=>els[id]||null,addEventListener(){},createElement:el};let interval=null;
const win={setInterval:f=>{interval=f;return 1;},clearInterval:()=>{interval=null;},matchMedia:()=>({matches:false})};
const ui=V.mount(doc,win);eq(interval,null);ok(els.maskTopSvg.innerHTML.includes('data-mask-elastic-links'));ok(els.maskElasticLedger.innerHTML.includes('5 adressierte'));
const before=JSON.stringify(ui.state);els.maskElasticVisible.checked=false;els.maskElasticVisible.events.change();eq(JSON.stringify(ui.state),before);ok(!els.maskTopSvg.innerHTML.includes('data-mask-elastic-links'));
els.maskElasticVisible.checked=true;els.maskElasticVisible.events.change();els.maskElasticCurved.checked=false;els.maskElasticCurved.events.change();eq(JSON.stringify(ui.state),before);ok(els.maskTopSvg.innerHTML.includes(' L '));
els.maskPlay.click();ok(interval);for(let tick=0;tick<30;tick++)interval();eq(ui.state.tick,30);ok(els.maskElasticLedger.innerHTML.includes('2 Kantenschnitte'));ui.pause();eq(interval,null);
ui.command('CAPTURE');els.maskElasticVisible.checked=false;els.maskElasticVisible.events.change();ui.command('STEP');ui.command('RETURN');eq(ui.state.tick,30);eq(els.maskElasticVisible.checked,false);
eq((html.match(/src="a0-mask-elastic-links.js/g)||[]).length,1);ok(html.indexOf('src="a0-mask-elastic-links.js')<html.indexOf('src="a0-mask-observer-view.js'));
ok(!/setTimeout|setInterval|requestAnimationFrame|fetch\(/.test(fs.readFileSync(__dirname+'/a0-mask-elastic-links.js','utf8')));
console.log(JSON.stringify({status:'PASS',checks,frames:484,actualTimerCallbacks:30,browserAcceptance:false,scope:'native endpoints, baseline lengths, stable indices, no geometry mutation, real mounted existing timer and view controls; no spring dynamics or numeric-marker identity'}));
