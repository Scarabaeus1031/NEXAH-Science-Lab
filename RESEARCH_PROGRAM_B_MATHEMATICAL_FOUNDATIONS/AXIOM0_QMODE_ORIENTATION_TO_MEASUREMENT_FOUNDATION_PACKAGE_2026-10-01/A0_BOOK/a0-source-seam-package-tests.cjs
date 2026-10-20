'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const contract=require('./a0-native-instrument-contract.js');
const seam=require('./a0-source-seam-package.js');
const fold=require('./assets/a0-tessarec-fold-contact-v1.js');
let checks=0;const ok=(value,message)=>{assert.ok(value,message);checks++};
class ClassList{
  constructor(...values){this.values=new Set(values)}
  contains(value){return this.values.has(value)}
  add(value){this.values.add(value)}
  remove(value){this.values.delete(value)}
  toggle(value,on){if(on===undefined)on=!this.contains(value);on?this.add(value):this.remove(value);return on}
}
class Element{
  constructor({id='',value='',text='',classes=[],dataset={}}={}){this.id=id;this.value=String(value);this.textContent=text;this.classList=new ClassList(...classes);this.dataset={...dataset};this.events={};}
  addEventListener(type,fn){(this.events[type]??=[]).push(fn)}
  dispatchEvent(event){for(const fn of this.events[event.type]||[])fn({target:this})}
  click(){for(const fn of this.events.click||[])fn({target:this})}
}
function fixture(){
  const nodes={
    foldT:new Element({id:'foldT',value:.5}),foldExtension:new Element({id:'foldExtension',value:1.25}),foldAngle:new Element({id:'foldAngle',value:180}),
    foldPlay:new Element({id:'foldPlay',text:'Play contact cycle'}),baseToggle:new Element({id:'baseToggle',text:'base on',classes:['active']}),
    conDaoPlay:new Element({id:'conDaoPlay',text:'CON–DAO breath'}),foldState:new Element({id:'foldState'})
  };
  const modes=['square','triangle'].map((mode,index)=>new Element({dataset:{foldMode:mode},classes:index===0?['active']:[]}));
  const numbers=seam.NUMBERS.map((number,index)=>new Element({dataset:{number:String(number)},classes:index===0?['active']:[]}));
  modes.forEach(button=>button.addEventListener('click',()=>modes.forEach(item=>item.classList.toggle('active',item===button))));
  numbers.forEach(button=>button.addEventListener('click',()=>numbers.forEach(item=>item.classList.toggle('active',item===button))));
  nodes.baseToggle.addEventListener('click',()=>nodes.baseToggle.classList.toggle('active'));
  nodes.foldPlay.addEventListener('click',()=>{nodes.foldPlay.textContent=nodes.foldPlay.textContent.startsWith('Pause')?'Play contact cycle':'Pause contact cycle'});
  const conDaoState={schema:'nexah.a0.con-dao-source-state/1',cursor:0,displayCursor:null,running:false,stateId:null,tickCount:14,intervalMs:620};
  const conDao={seek(tick){const ids=['CON-6','CON-5','CON-4','CON-3','CON-2','CON-1','STILL','STILL','DAO-1','DAO-2','DAO-3','DAO-4','DAO-5','DAO-6'];this.stop();conDaoState.displayCursor=tick;conDaoState.cursor=(tick+1)%14;conDaoState.stateId=ids[tick];nodes.foldAngle.value=String(Math.round(180*(tick<=6?tick/6:tick<=7?1:(13-tick)/6)));},snapshot:()=>({...conDaoState}),stop(){conDaoState.running=false;nodes.conDaoPlay.classList.remove('active');nodes.conDaoPlay.textContent='CON–DAO breath'},restore(value){Object.assign(conDaoState,value);nodes.conDaoPlay.classList.toggle('active',value.running);nodes.conDaoPlay.textContent=value.running?'Pause CON–DAO':'CON–DAO breath'}};
  const layerState={selected:'HOLD'},layer={snapshot:()=>({schema:'nexah.a0.1111-layer-witness/1',selected:layerState.selected,frame:{P0:'F10',P1:'F26',P2:'F42'}[layerState.selected]||null,candidates:{P0:'F10',P1:'F26',P2:'F42'}}),restore(value){layerState.selected=value.selected||'HOLD'},set(value){layerState.selected=value},clear(){layerState.selected='HOLD'}};
  nodes.conDaoPlay.addEventListener('click',()=>{const active=nodes.conDaoPlay.classList.toggle('active');conDaoState.running=active;if(active){conDaoState.displayCursor=conDaoState.cursor;conDaoState.stateId='CON-6';conDaoState.cursor=(conDaoState.cursor+1)%14}nodes.conDaoPlay.textContent=active?'Pause CON–DAO':'CON–DAO breath'});
  const doc={defaultView:{Event:class{constructor(type){this.type=type}},A0FoldConDaoController:conDao,A0JointLayerWitness:layer},getElementById:id=>nodes[id]||null,
    querySelector(selector){
      if(selector==='[data-fold-mode].active')return modes.find(item=>item.classList.contains('active'))||null;
      let match=selector.match(/^\[data-fold-mode="([^"]+)"\]$/);if(match)return modes.find(item=>item.dataset.foldMode===match[1])||null;
      if(selector==='#numberChips [data-number].active')return numbers.find(item=>item.classList.contains('active'))||null;
      match=selector.match(/^#numberChips \[data-number="([^"]+)"\]$/);if(match)return numbers.find(item=>item.dataset.number===match[1])||null;
      return null;
    }};
  return {doc,nodes,modes,numbers,conDao,conDaoState,layer,layerState};
}
const f=fixture(),view=seam.createView(f.doc,fold),api=seam.createInstrument(contract,view);
let read=api.dispatch({command:'READ'});ok(read.ok&&read.source===seam.SOURCE,'source-owned READ');
ok(read.reading.type==='BOX_FOLD_CONTACT_WITH_JOINT_ADDRESS','typed joint/box reading');
ok(read.reading.address.integer===1111&&read.reading.address.totient===1000&&read.reading.address.gap===111,'joint address profile');
ok(read.reading.address.q4Address==='1111'&&read.reading.address.layerAddress===null,'1111 map declared while selected layer remains HOLD');
ok(read.reading.address.layerCandidates.P1==='F26','three source-bound layer candidates exposed');
ok(read.reading.conDao.returnScope&&read.reading.conDao.exactCursorReturn,'CON-DAO cursor belongs to scoped Return');
const anchor=api.dispatch({command:'CAPTURE'});ok(anchor.ok&&anchor.checkpoint,'checkpoint captured');
read=api.dispatch({command:'SET',payload:{number:1111,layer:'P1'}});ok(read.ok&&read.reading.address.layerAddress==='P1'&&read.reading.address.frameAddress==='F26','explicit P1/F26 witness selected');
read=api.dispatch({command:'SET',payload:{t:.61,extension:1.144,foldDeg:135,mode:'triangle',baseOn:'off',number:3333}});
ok(read.ok&&read.state.mode==='triangle'&&!read.state.baseOn&&read.state.layer==='HOLD','validated SET clears undeclared non-1111 layer');
ok(read.reading.address.totient===2000,'selected Joint profile returned');
const beforeBad=JSON.stringify(read.state);ok(!api.dispatch({command:'SET',payload:{t:99,number:4444}}).ok,'invalid SET fails');
ok(JSON.stringify(api.dispatch({command:'READ'}).state)===beforeBad,'invalid SET atomic');
ok(!api.dispatch({command:'SET',payload:{number:3333,layer:'P0'}}).ok,'non-1111 layer selection rejected');api.dispatch({command:'READ'});
read=api.dispatch({command:'RETURN',checkpoint:anchor.checkpoint});ok(read.ok&&read.returnWitness.exact,'exact scoped Return');
assert.deepEqual(read.state,anchor.state);checks++;
f.conDao.restore({schema:'nexah.a0.con-dao-source-state/1',cursor:5,displayCursor:4,running:true,stateId:'CON-2',tickCount:14,intervalMs:620});
const breathAnchor=api.dispatch({command:'CAPTURE'});ok(breathAnchor.ok&&!breathAnchor.state.conDao.running&&breathAnchor.state.conDao.cursor===5,'CAPTURE stops timer and retains next cursor');
f.conDao.restore({schema:'nexah.a0.con-dao-source-state/1',cursor:9,displayCursor:8,running:false,stateId:'DAO-2',tickCount:14,intervalMs:620});
read=api.dispatch({command:'RETURN',checkpoint:breathAnchor.checkpoint});ok(read.ok&&read.returnWitness.exact,'CON-DAO checkpoint returns exactly');
assert.deepEqual(read.state.conDao,breathAnchor.state.conDao);checks++;
f.nodes.foldPlay.click();f.nodes.conDaoPlay.click();ok(f.nodes.foldPlay.textContent.startsWith('Pause')&&f.nodes.conDaoPlay.classList.contains('active'),'fixture timers active');
api.dispatch({command:'STEP'});ok(!f.nodes.foldPlay.textContent.startsWith('Pause')&&!f.nodes.conDaoPlay.classList.contains('active'),'source commands interlock both players');
ok(api.dispatch({command:'READ'}).audit.length<=96,'bounded audit');
const sourceHtml=fs.readFileSync('./A0_TESSAREC_BLUE_BODY_LAB.html','utf8');for(const match of sourceHtml.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g))if(match[1].trim())new vm.Script(match[1]);ok(sourceHtml.includes('A0FoldConDaoController={snapshot,restore,stop,step'),'actual source exposes CON-DAO controller');
for(let tick=0;tick<14;tick++){const r=api.dispatch({command:'SET',payload:{conDaoTick:tick}});ok(r.ok&&r.state.conDao.displayCursor===tick&&!r.state.conDao.running,'native CON-DAO tick seek '+tick);}const beforeTick=api.dispatch({command:'CAPTURE'});api.dispatch({command:'SET',payload:{conDaoTick:4}});const returned=api.dispatch({command:'RETURN',checkpoint:beforeTick.checkpoint});ok(returned.ok&&returned.returnWitness.exact,'CON-DAO scoped Return');for(const v of [-1,14,1.5,'bad']){const r=api.dispatch({command:'SET',payload:{conDaoTick:v}});ok(!r.ok,'invalid breath tick fails closed');api.dispatch({command:'READ'});}
console.log(JSON.stringify({status:'PASS',checks,scope:'native Box/Laschen controls plus Joint integer/totient profile; mock source DOM, not browser pixels'}));
