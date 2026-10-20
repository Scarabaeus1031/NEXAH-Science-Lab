'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const api=require('./a0-native-source-bank.js');let checks=0;
const ok=(v,message)=>{assert.ok(v,message);checks++};
class Element{
  constructor(tag){this.tag=tag;this.children=[];this.events={};this.attributes={};this.disabled=false;}
  append(...nodes){this.children.push(...nodes)}
  replaceChildren(...nodes){this.children=nodes}
  setAttribute(k,v){this.attributes[k]=v}
  addEventListener(k,fn){this.events[k]=fn}
  fire(k){if(!this.disabled)this.events[k]?.()}
}
const host=new Element('section'),doc={getElementById:id=>id==='nativeSourceBank'?host:null,createElement:tag=>new Element(tag)};
const mounted=api.mount(doc),flat=()=>host.children.flatMap(x=>[x,...x.children]);
const select=flat().find(x=>x.tag==='select'),[load,unload]=flat().filter(x=>x.tag==='button'),slot=host.children.at(-1),status=host.children.at(-2);
ok(api.entries.length===9&&new Set(api.entries.map(x=>x.key)).size===9,'nine unique entry points');
ok(slot.children.length===0&&mounted.activeKey===null,'no auto-load');
ok(select.value==='box'&&unload.disabled,'box first, no active source');
for(const entry of api.entries){
  const url=new URL(entry.path,'file://'+__dirname+'/A0_ORIENTATION_CONTROLLER_BENCH.html'),file=decodeURIComponent(url.pathname);
  ok(fs.existsSync(file),'existing source '+entry.key);
  if(url.hash)ok(fs.readFileSync(file,'utf8').includes('id="'+url.hash.slice(1)+'"'),'source anchor');
  select.value=entry.key;select.fire('change');load.fire('click');
  ok(mounted.activeKey===entry.key&&slot.children.length===1,'one explicit source');
  ok(select.disabled&&load.disabled&&!unload.disabled,'no accidental replacement');
  const frame=slot.children[0];ok(frame.src===entry.path,'original path');
  load.fire('click');ok(slot.children[0]===frame,'no duplicate context');
  frame.fire('load');ok(status.textContent.includes('kein Master-Readback'),'load is not proof');
  unload.fire('click');ok(slot.children.length===0&&mounted.activeKey===null&&!select.disabled,'context discarded');
  const stopped=status.textContent;frame.fire('load');frame.fire('error');ok(status.textContent===stopped,'stale events ignored');
}
const html=fs.readFileSync(path.join(__dirname,'A0_ORIENTATION_CONTROLLER_BENCH.html'),'utf8');
ok(html.includes('id="nativeSourceBank"')&&html.includes('a0-native-source-bank.js'),'host mount');
const source=fs.readFileSync(path.join(__dirname,'a0-native-source-bank.js'),'utf8');
ok(!/setInterval|requestAnimationFrame|contentDocument/.test(source),'no animation clock or source DOM scraping; timeout is ACK-only');
const fold=require('./assets/a0-tessarec-fold-contact-v1.js');
ok(Math.abs(fold.PHI/Math.sqrt(2)-1.1441228056353685)<1e-12,'contact extension');
for(const t of [.1,.25,.5,.75,.9]){
  ok(fold.foldAudit({t,extension:fold.PHI/Math.sqrt(2),foldDeg:180}).state==='TOUCH','scale independent threshold');
  ok(fold.foldAudit({t,extension:1,foldDeg:180}).state==='OPEN','regular flap open');
  ok(fold.foldAudit({t,extension:1.25,foldDeg:90}).state==='OPEN','90 degrees open');
}
const receipt=JSON.parse(fs.readFileSync(path.join(__dirname,'assets/a0-native-source-bank-v1.json'),'utf8'));
for(const item of [...receipt.implementationFiles,...receipt.sources]){
  const hash=crypto.createHash('sha256').update(fs.readFileSync(path.resolve(__dirname,item.path))).digest('hex');
  ok(hash===item.sha256,'pin '+item.path);
}
ok(receipt.browserAcceptance===false&&receipt.masterStateContract===false,'no promotion');
console.log(JSON.stringify({status:'PASS',checks,browserAcceptance:false,scope:'source reuse, mocked mount lifecycle, contact arithmetic; not browser interaction'}));
