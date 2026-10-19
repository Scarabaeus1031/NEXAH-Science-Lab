'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const hc=require('./a0-human-crosswalk.js'),story=require('./a0-theory-storyboard.js'),journey=require('./assets/a0-nexah-aperture-journey-v1.js');
let checks=0;const check=(v,m)=>{assert.ok(v,m);checks++;};
check(hc.rows.length===7&&hc.rows.filter(row=>row.status==='bound').length===6,'six bindings, one open disposition');
for(const row of hc.rows){
  if(row.status==='open'){check(hc.outbound({scene:row.scene,moment:77},'journey')===null,'no invented emergence route');continue;}
  check(hc.questions[row.question].text===journey.HUMAN_QUESTIONS[hc.questions[row.question].index].question,'binding matches source Human question');
  for(const moment of [0,1,50,77,100])for(const target of ['journey','blueprint']){
    const context={scene:row.scene,moment,layer:'visibility'},url=new URL(hc.outbound(context,target),'file:///test/'),entry=hc.readContext(url.search,target);
    check(entry.status==='valid'&&entry.context.scene===row.scene&&entry.context.moment===moment,'outbound parsed');
    const returned=new URL(hc.returnHref(entry.context),'file:///test/'),back=hc.readContext(returned.search,'storyboard');
    check(back.status==='valid'&&back.context.moment===moment&&returned.hash==='#scene-'+row.scene,'roundtrip exact navigation context');
    const local=path.join(__dirname,path.basename(url.pathname));check(fs.existsSync(local)&&fs.readFileSync(local,'utf8').includes('id="'+url.hash.slice(1)+'"'),'Human target/anchor exists');
  }
}
const valid=new URL(hc.outbound({scene:5,moment:77,layer:'visibility'},'journey'),'file:///test/');
for(const [key,value] of [['hc_v','2'],['hc_scene','0'],['hc_scene','8'],['hc_scene','1.5'],['hc_scene','5\n'],['hc_moment','77\n'],['hc_moment','-1'],['hc_moment','101'],['hc_moment','NaN'],['hc_moment',''],['hc_layer','../x'],['hc_from','other'],['hc_target','https://example.com'],['hc_question','act'],['hc_unknown','x']]){
  const p=new URLSearchParams(valid.search);p.set(key,value);check(hc.readContext(p.toString(),'journey').status==='invalid','invalid '+key+' '+value);
}
for(const key of ['hc_v','hc_from','hc_scene','hc_moment','hc_target','hc_question']){const p=new URLSearchParams(valid.search);p.delete(key);check(hc.readContext(p.toString(),'journey').status==='invalid','missing required '+key);}
const duplicate=new URLSearchParams(valid.search);duplicate.append('hc_scene','2');check(hc.readContext(duplicate.toString(),'journey').status==='invalid','duplicates rejected');
check(hc.readContext('','journey').status==='none','direct visit neutral');
check(hc.readContext(valid.search,'blueprint').status==='invalid','target role mismatch');
const attack=new URLSearchParams(valid.search);attack.set('returnUrl','https://example.com/steal');const safe=hc.returnHref(hc.readContext(attack.toString(),'journey').context);check(safe.startsWith('A0_THEORY_STORYBOARD.html?')&&!safe.includes('example.com'),'arbitrary return target never copied');
check(hc.returnHref({scene:99,moment:2})==='A0_THEORY_STORYBOARD.html#overview','bad outbound context neutral');
class Element{
  constructor(id=''){this.id=id;this.dataset={};this.hidden=false;this.value='50';this.attributes={};this.handlers={};this.innerHTML='';this.textContent='';this.children=[];this.style={setProperty(){}};this.classSet=new Set();this.classList={add:(...ks)=>ks.forEach(k=>this.classSet.add(k)),remove:(...ks)=>ks.forEach(k=>this.classSet.delete(k)),toggle:(k,v)=>v?this.classSet.add(k):this.classSet.delete(k)};}
  setAttribute(k,v){this.attributes[k]=v;}
  addEventListener(k,fn){this.handlers[k]=fn;}
  appendChild(child){this.children.push(child);return child;}
  replaceChildren(){this.children=[];}
  after(){}
  focus(){this.focused=true;}
  scrollIntoView(){}
  querySelectorAll(selector){if(selector==='[data-layer]'){if(!this.layerButtons)this.layerButtons=[...this.innerHTML.matchAll(/data-layer="([^"]+)"/g)].map(m=>{const e=new Element();e.dataset.layer=m[1];return e;});return this.layerButtons;}return[];}
  getBoundingClientRect(){return{width:360,height:300};}
  emit(type,event={}){this.handlers[type]({target:this,preventDefault(){},...event});}
}
function fixture(file,search='',hash=''){
  const html=fs.readFileSync(path.join(__dirname,file),'utf8'),elements={},classes={};
  for(const tag of html.matchAll(/<[A-Za-z][^>]*>/g)){
    const id=/\bid="([^"]+)"/.exec(tag[0]),node=new Element(id?id[1]:'');
    if(id)elements[id[1]]=node;if(/\bhidden(?:\s|>)/.test(tag[0]))node.hidden=true;
    const cls=/\bclass="([^"]+)"/.exec(tag[0]);if(cls)for(const key of cls[1].split(' '))if(!classes[key])classes[key]=node;
    const page=/data-hc-page="([^"]+)"/.exec(tag[0]);if(page)node.dataset.hcPage=page[1];
  }
  const listeners={};
  const doc={readyState:'loading',body:new Element(),documentElement:new Element(),hidden:false,getElementById(id){if(id==='cubeGraph'&&!elements[id])return null;assert.ok(elements[id],'fixture element '+id);return elements[id];},querySelector(sel){return classes[sel.slice(1)]||null;},createElementNS(){return new Element();},addEventListener(k,fn){(listeners[k]||(listeners[k]=[])).push(fn);}};
  const win={location:{search,hash},history:{replaceState(a,b,next){const u=new URL(next,'file:///test/'+file+win.location.search+win.location.hash);win.location.hash=u.hash;win.location.search=u.search;}},addEventListener(){},A0HumanCrosswalk:hc};
  return{doc,win,elements,fire(){for(const fn of listeners.DOMContentLoaded||[])fn();}};
}
const backUrl=new URL(hc.returnHref(hc.readContext(valid.search,"journey").context),"file:///test/");
const restored=fixture('A0_THEORY_STORYBOARD.html',backUrl.search,backUrl.hash),controller=story.mount(restored.doc,restored.win);
check(controller.snapshot.scene===4&&controller.snapshot.value===77,'actual storyboard mount restores pilot');
check(controller.snapshot.selectedLayer==='visibility'&&restored.elements.moment.value==='77','layer and slider restored');
check(!restored.elements.humanReturnStatus.hidden,'navigation return disclosed');
check(restored.elements.sceneTitle.focused,'restored scene receives focus');
restored.elements.moment.emit('input',{target:{value:23}});
restored.elements.humanJourneyLink.emit('click');
check(hc.readContext(restored.win.location.search,'storyboard').context.moment===23,'browser Back URL preserves current departure context');
const backReload=fixture('A0_THEORY_STORYBOARD.html',restored.win.location.search,restored.win.location.hash);
check(story.mount(backReload.doc,backReload.win).snapshot.value===23,'Back with full reload restores current departure');
const repeat=new URL(restored.elements.humanJourneyLink.attributes.href,'file:///test/');check(hc.readContext(repeat.search,'journey').context.moment===23,'second outbound uses current value, not stale context');

controller.show(5);check(restored.elements.humanReadingLinks.hidden&&restored.elements.humanBindingState.textContent.includes("offen"),"emergence remains open");
const blueprint=fixture('A0_LIVING_BLUEPRINT.html',new URL(hc.outbound({scene:5,moment:77},'blueprint'),'file:///test/').search),blueResult=hc.mountHuman(blueprint.doc,blueprint.win);
check(blueResult.status==='valid'&&blueprint.elements.humanCrosswalkCopy.textContent.includes('keine bestimmte dynamische Station'),'Blueprint does not pretend dynamic selection');
check(fs.readFileSync(path.join(__dirname,'DRAFTS/A0_HUMAN_BOOK_DRAFT.html'),'utf8').includes('a0-human-flagship-journey.js'),'draft Human controller retained');
check(!/localStorage|sessionStorage|fetch[(]|window[.]open|postMessage|setInterval/.test(fs.readFileSync(path.join(__dirname,'a0-human-crosswalk.js'),'utf8')),'no network, storage or cross-tab bus');
require("./a0-human-flagship-journey-tests.cjs");
console.log("PASS · "+checks+" crosswalk/Storyboard checks; five-chapter Human Book retained as draft beside restored Aperture Journey. Browser acceptance open.");
