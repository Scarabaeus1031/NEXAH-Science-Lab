'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const api=require('./a0-bench-walk.js');let checks=0;const ok=x=>{assert(x);checks++;};
const html=fs.readFileSync(__dirname+'/A0_ORIENTATION_CONTROLLER_BENCH.html','utf8');
for(let i=0;i<9;i++){
 ok(api.index(api.route(i))===i);const markup=api.markup(i);ok(markup.includes('DEIN ERSTER SCHRITT'));ok(markup.includes('Alle Bereiche'));
 ok((markup.match(/data-walk-open/g)||[]).length===4);
 for(const s of api.ROOMS[i][2]){const target=s.split('|')[1];ok(target.includes('.html')?fs.existsSync(path.resolve(__dirname,target.split(/[?#]/)[0])):html.includes('id="'+target+'"'));}
}
for(const hash of ['','#benchMap','#benchFoyer','#bench-area-9','#bench-area--1','#bench-area-1foo','#bench-area-01'])ok(api.index(hash)===null);
ok(api.markup(99)==='');ok(api.href('abc')==='#abc');
class E{
 constructor(){this.dataset={};this.attrs={};this.parts={};this.events={};this.classList={toggle:(c,on)=>this.attrs[c]=on};}
 prepend(n){this.child=n;}before(n){this.beforeNode=n;}setAttribute(k,v){this.attrs[k]=v;}
 querySelector(s){return this.parts[s]||(this.parts[s]=new E());}
 addEventListener(k,f){this.events[k]=f;}scrollIntoView(){this.scrolled=true;}focus(){this.focused=true;}
 getAttribute(k){return this.attrs[k];}
}
const main=new E(),body=new E(),doors=Array.from({length:9},()=>new E()),events={};let focus=0;
const details={tagName:'DETAILS',open:false},target={parentElement:details};
const doc={getElementById:id=>id==='orientationBench'?main:id==='bodyRouteBench'?target:null,createElement:()=>new E(),body,querySelectorAll:()=>doors,addEventListener:(k,f)=>events[k]=f};
let selectedBody=null;
const win={location:{hash:'#benchFoyer'},A0BenchBodyGallery:require('./a0-bench-body-gallery.js'),A0BenchBodyRouteController:{select:id=>selectedBody=id},A0MaskClockBench:{focus:()=>focus++},addEventListener:(k,f)=>events[k]=f};
const ctl=api.mount(doc,win),landing=main.child,crumb=main.beforeNode;
ok(doors.every((d,i)=>d.href===api.route(i)));ok(crumb.hidden);ok(!body.attrs['bench-area-mode']);
for(let i=0;i<9;i++){win.location.hash=api.route(i);events.hashchange();ok(ctl.area===i);ok(body.attrs['bench-area-mode']);ok(landing.scrolled);ok(landing.querySelector('h1').focused);ok(crumb.hidden);}
win.location.hash=api.route(0);events.hashchange();
ok(landing.innerHTML.includes('bvg-grid'));
const link=new E();link.attrs.href='#bodyRouteBench';link.attrs['data-body-gallery-route']='player';landing.events.click({target:{closest:()=>link}});ok(details.open);ok(!body.attrs['bench-area-mode']);ok(selectedBody==='player');
win.location.hash='#bodyRouteBench';events.hashchange();ok(!crumb.hidden);ok(crumb.innerHTML.includes('Zur Bereichseinführung'));ok(crumb.innerHTML.includes('#bench-area-0'));
win.location.hash='#benchFoyer';events.hashchange();ok(crumb.hidden);ok(!body.attrs['bench-area-mode']);
win.location.hash=api.route(3);events.hashchange();events.click({target:{closest:()=>true}});ok(win.location.hash==='#benchShowcase');ok(!body.attrs['bench-area-mode']);
ok(focus>=9);
const source=fs.readFileSync(__dirname+'/a0-bench-walk.js','utf8');ok(!/postMessage|setInterval|fetch\(|\.play\(|createElement\(['"]iframe/.test(source));
console.log(JSON.stringify({status:'PASS',checks,rooms:9,scope:'all targets, room content, door routes, focus, next/previous, native instrument reveal, details, breadcrumbs and tour escape; browser acceptance OPEN'}));
