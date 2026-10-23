'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const C=require('./a0-bench-tool-catalog.js'),M=require('./a0-bench-map.js'),O=require('./a0-orientation-map.js');
let checks=0;const ok=(v,m)=>{assert.ok(v,m);checks++;};
ok(C.search().length===M.MODULES.length);
for(const m of M.MODULES){ok(C.search(m.id).some(x=>x.id===m.id),'id searchable');ok(C.search('',m.group).some(x=>x.id===m.id),'group searchable');ok(C.search('', 'ALL',m.bindingType).some(x=>x.id===m.id),'binding searchable');ok(O.nodes.some(n=>n.key===C.contextKey(m.id,O)),'existing orientation context');}
ok(C.contextKey('record',O)==='bench','no substitution of coupling receipt for Bench record');
ok(C.contextKey('life03',O)==='life03');
ok(C.contextKey('missing',O)===null&&C.contextKey('record',{})===null);
ok(C.search('Fibonacci').some(m=>m.id==='game-atlas'));
ok(C.search('beobachter').some(m=>m.id==='mask-observer'));
ok(C.search('KÖRPER').length===C.search('korper').length);
ok(C.search('zz-no-such-tool').length===0);
for(const group of M.GROUPS){ok(C.search('',group.id).every(m=>m.group===group.id));ok(C.sketch(group.id).startsWith('<svg'));ok(!C.sketch(group.id).includes('script'));}
assert.throws(()=>C.search('','WRONG'));checks++;
assert.throws(()=>C.search('','ALL','WRONG'));checks++;
class E{
 constructor(){this.value='';this.checked=false;this.hidden=false;this.textContent='';this.innerHTML='';this.dataset={};this.events={};this.attrs={};this.children=[];this.tagName='DIV';this.parentElement=null;}
 addEventListener(t,f){this.events[t]=f;}fire(t,event={}){return this.events[t]?.(event);}
 setAttribute(k,v){this.attrs[k]=v;if(k.startsWith('data-')){const n=k.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase());this.dataset[n]=v;}}
 getAttribute(k){return this.attrs[k]||null;}removeAttribute(k){delete this.attrs[k];if(k==='data-btc-open')delete this.dataset.btcOpen;}
 appendChild(n){this.children.push(n);}scrollIntoView(){this.scrolled=true;}focus(){this.focused=true;}
}
const els={},el=n=>els[n]??=new E(),host=new E(),cards=M.MODULES.map(m=>{const n=new E();n.dataset.btcCard=m.id;n.parts={};n.querySelector=q=>n.parts[q]??=new E();return n;});
const chips=['ALL',...M.GROUPS.map(g=>g.id)].map(id=>{const e=new E();e.dataset.btcGroup=id;return e;});
host.querySelector=q=>el(q.match(/data-btc-(.*)\]/)[1]);
host.querySelectorAll=q=>q==='[data-btc-card]'?cards:q==='[data-btc-group]'?chips:[];
el('binding').value='ALL';el('layout').value='auto';
const targets=Object.fromEntries(M.MODULES.map(m=>{const t=new E();t.querySelector=()=>null;return[m.focusTarget,t];}));
const detail=new E();detail.tagName='DETAILS';targets.pascalApertureBridge.parentElement=detail;
const doc={getElementById:id=>id==='benchToolCatalog'?host:targets[id]||null,createElement:()=>new E()};
let focusOff=0,selected=null,context=null,load;
const win={location:{hash:''},A0OrientationMap:O,A0OrientationMapView:{openNode:k=>context=k},A0MaskClockBench:{focus:v=>{ok(v===false);focusOff++;}},A0BenchMapController:{select:id=>selected=id},addEventListener:(t,f)=>{if(t==='load')load=f;},matchMedia:()=>({matches:true})};
const mounted=C.mount(doc,win);ok(cards.length===M.MODULES.length&&cards.every(c=>!c.hidden));
ok(cards.find(c=>c.dataset.btcCard==='glb-archive').dataset.preview==='bound-image');
ok(cards.find(c=>c.dataset.btcCard==='sewing').dataset.preview==='bound-schematic');
ok(cards.find(c=>c.dataset.btcCard==='game-atlas').dataset.preview==='bound-schematic');
ok(cards.find(c=>c.dataset.btcCard==='body-route').dataset.preview==='bound-contract','body route gets a contract-specific fallback until its renderer is available');
ok(C.search('1729').some(x=>x.id==='root5-crosswalk'),'1729 crosswalk searchable');
ok(C.search('Root-5').some(x=>x.id==='root5-crosswalk'),'Root-5 crosswalk searchable');
ok(C.search('blind audit').some(x=>x.id==='root5-blind-audit'),'blind crosswalk audit searchable');
ok(C.search('window stability').some(x=>x.id==='root5-blind-audit'),'window stability audit searchable');
ok(C.search('50000').some(x=>x.id==='root5-blind-audit'),'extended blind window searchable');
ok(host.dataset.catalogColumns==='auto');
el('query').value='Observer';el('query').fire('input');ok(cards.filter(c=>!c.hidden).every(c=>C.search('Observer').some(m=>m.id===c.dataset.btcCard)));
el('query').value='zz-no-such-tool';el('query').fire('input');ok(!el('empty').hidden&&cards.every(c=>c.hidden));
el('clear').fire('click');ok(cards.every(c=>!c.hidden));
const groupEvent={target:{closest:q=>q==='[data-btc-group]'?chips.find(c=>c.dataset.btcGroup==='RETURN'):null}};
host.fire('click',groupEvent);ok(mounted.state.group==='RETURN'&&host.dataset.catalogGroup==='RETURN');ok(cards.filter(c=>!c.hidden).length===C.search('','RETURN').length);
el('layout').value='4';el('layout').fire('change');ok(host.dataset.catalogColumns==='4');
ok(mounted.open('pascal-aperture'));ok(detail.open&&targets.pascalApertureBridge.focused&&selected==='pascal-aperture'&&win.location.hash==='pascalApertureBridge');
ok(focusOff===1);ok(!mounted.open('missing'));
const ctxButton=new E();ctxButton.tagName='BUTTON';ctxButton.dataset.btcContext='life03';
host.fire('click',{target:{closest:q=>q==='[data-btc-context]'?ctxButton:null},preventDefault(){this.prevented=true;}});
ok(context==='life03');
win.A0OrientationMapView=null;
host.fire('click',{target:{closest:q=>q==='[data-btc-context]'?ctxButton:null}});
ok(el('count').textContent.includes('noch nicht bereit'));
load();ok(cards.every(c=>/^(bound-|svg|canvas)/.test(c.dataset.preview)),'every card has a source snapshot or its own contract miniature');
ok(C.sewingPoster().startsWith('data:image/svg+xml')&&C.atlasPoster().startsWith('data:image/svg+xml'));
ok(C.boundPreview('glb-archive',{}).url==='assets/images/crystal_view_poster.jpeg');
ok(C.boundPreview('record',{}).kind==='bound-contract');
ok(C.boundPreview('missing',{})===null);
const sourceCards=['source-bank','native-face','pent','life03'].map(id=>C.boundPreview(id,{}));
ok(sourceCards.every(x=>x.kind==='bound-contract'&&x.url.startsWith('data:image/svg+xml')));
ok(new Set(sourceCards.map(x=>x.url)).size===sourceCards.length,'source contracts have distinct miniatures');
// Canvas snapshots are downsampled without advancing or mutating the source.
let drawn=0;const sourceCanvas={width:100,height:50},small={getContext:()=>({fillRect(){},drawImage(c){ok(c===sourceCanvas);drawn++;}}),toDataURL:()=> 'data:image/png;base64,test'};
const p=C.preview({querySelector:q=>q==='canvas'?sourceCanvas:null},{createElement:()=>small},{});
ok(p.kind==='canvas'&&drawn===1&&small.width===480&&small.height===280);
const blocked=C.preview({querySelector(){throw Error('isolated');}},doc,win);ok(blocked.kind==='unavailable'&&blocked.url===null);
// Sanitization uses a clone; source event attributes are never copied into the preview.
const child=new E();child.setAttribute('onload','bad()');child.setAttribute('class','source');
Object.defineProperty(child,'attributes',{get(){return Object.entries(this.attrs).map(([name,value])=>({name,value}));}});
const copy=new E();copy.querySelectorAll=q=>q==='*'?[child]:[];copy.getAttribute=k=>k==='viewBox'?'0 0 100 100':null;copy.attributes=[];
const svg={matches:()=>true,querySelector:()=>true,cloneNode:()=>copy,querySelectorAll:()=>[{}]};
const sp=C.preview(svg,doc,{XMLSerializer:class{serializeToString(){return '<svg><path/></svg>';}},getComputedStyle:()=>({getPropertyValue:k=>k==='fill'?'#29c7ef':''})});
ok(sp.kind==='svg'&&sp.url.startsWith('data:image/svg+xml'));
ok(child.getAttribute('onload')===null&&child.getAttribute('class')===null&&child.getAttribute('fill')==='#29c7ef');
ok(C.preview(null,doc,win).kind==='missing');
const html=fs.readFileSync('A0_ORIENTATION_CONTROLLER_BENCH.html','utf8'),code=fs.readFileSync('a0-bench-tool-catalog.js','utf8');
ok(html.indexOf('id="benchToolCatalog"')<html.indexOf('id="maskClockLink"'),'catalog at entrance');
ok(html.indexOf('a0-bench-tool-catalog.js')>html.indexOf('a0-bench-integration.js'),'snapshots after renderers');
ok(!/setInterval|setTimeout|requestAnimationFrame|postMessage|createElement\(['"]iframe/.test(code),'no new engines, source windows or clock');
ok(code.includes('A0OrientationMapView.openNode'),'existing Blueprint detail mechanic reused');
console.log(JSON.stringify({status:'PASS',checks,modules:M.MODULES.length,groups:M.GROUPS.length,scope:'search/filter/reset, context routing, adaptive menu grid, original target opening, SVG clone sanitization, canvas downsampling, unavailable previews and no source startup; DOM doubles, not browser pixels'}));
