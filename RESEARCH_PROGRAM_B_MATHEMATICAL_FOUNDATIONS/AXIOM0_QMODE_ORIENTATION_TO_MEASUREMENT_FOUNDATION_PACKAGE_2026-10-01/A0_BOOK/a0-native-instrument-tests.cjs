'use strict';
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),assert=require('node:assert/strict');
const C=require('./a0-native-instrument-contract.js');let checks=0;
const eq=(a,b,msg)=>{assert.deepEqual(JSON.parse(JSON.stringify(a)),JSON.parse(JSON.stringify(b)),msg);checks++},ok=(v,msg)=>{assert.ok(v,msg);checks++};
class Element{
  constructor(tag='div',id=''){this.tag=tag;this.id=id;this.children=[];this.value='';this.dataset={};this.events={};this.classes=new Set();this.attributes={};this.textContent='';this.parentElement={getBoundingClientRect:()=>({width:1000})};this.classList={toggle:(key,on)=>on?this.classes.add(key):this.classes.delete(key),contains:key=>this.classes.has(key)};}
  append(...children){this.children.push(...children)}
  replaceChildren(...children){this.children=children}
  setAttribute(k,v){this.attributes[k]=v}
  addEventListener(k,fn){(this.events[k]??=[]).push(fn)}
  click(){for(const fn of this.events.click||[])fn({target:this});this.onclick?.({target:this})}
}
function source(file){
  const html=fs.readFileSync(file,'utf8'),nodes={};
  for(const match of html.matchAll(/id="([^"]+)"/g))nodes[match[1]]=new Element('div',match[1]);
  const tabs=['inner','outer','ladder'].map((key,i)=>{const el=new Element('button');el.dataset.view=key;if(!i)el.classes.add('active');return el});
  for(const key of ['inner','outer','ladder'])if(nodes[key]&&key==='inner')nodes[key].classes.add('active');
  if(nodes.k)nodes.k.value='0';
  const doc={events:{},getElementById:key=>nodes[key],createElementNS:(_,tag)=>new Element(tag),createElement:tag=>new Element(tag),
    querySelector(selector){if(selector[0]==='#')return nodes[selector.slice(1)];if(selector==='.tabs button.active')return tabs.find(x=>x.classes.has('active'));const m=selector.match(/data-view="([^"]+)"/);if(m)return tabs.find(x=>x.dataset.view===m[1]);throw Error('unsupported selector '+selector)},
    querySelectorAll:selector=>selector==='.tabs button'?tabs:selector==='.view'?['inner','outer','ladder'].map(x=>nodes[x]):[],
    addEventListener(k,fn){(this.events[k]??=[]).push(fn)}};
  const context={document:doc,A0NativeInstrumentContract:C,ResizeObserver:class{observe(){}},console};context.window=context;
  vm.createContext(context);
  for(const match of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g))if(match[1].trim())vm.runInContext(match[1],context,{filename:file});
  ok(context.A0NativeInstrument,'source-owned API attached');
  return {api:context.A0NativeInstrument,nodes,doc};
}
const root=path.resolve(__dirname,'../../..'),janusFile=path.join(root,'SCIENCE_LAB/CASE_STUDIES/NEXAH_ELEVEN_SPACE_JANUS_NUMBER_VIEW_2026-10-06/NEXAH_JANUS_ARITHMETIC_LADDER.html'),twoFile=path.join(root,'SCIENCE_LAB/RESEARCH_AREAS/FIELD_GLYPH_NUMBER_ARCHITECTURE_STAGE_0_2026-09-14/NEXAH_EULER_ANTIPODE_TWO_CUT_INSTRUMENT.html');
const jan=source(janusFile),two=source(twoFile);
for(const instrument of [jan,two]){
  const api=instrument.api,initial=api.dispatch({command:'READ'}),capture=api.dispatch({command:'CAPTURE'});
  ok(initial.ok&&capture.checkpoint,'source READ and CAPTURE');
  let notifications=0;const stop=api.subscribe(()=>notifications++);
  for(let n=0;n<120;n++)api.dispatch({command:'STEP'});
  ok(notifications===120,'no host timer; source notifications');
  stop();const returned=api.dispatch({command:'RETURN',checkpoint:capture.checkpoint});
  ok(returned.ok&&returned.returnWitness.exact&&!returned.returnWitness.wholeMachine,'bounded real Return');
  eq(returned.state,capture.state,'full scoped source state restored');
  const detached=returned.state;detached.k=100;ok(api.dispatch({command:'READ'}).state.k!==100,'detached exports');
  ok(returned.audit.length<=96,'bounded audit');
  const fresh=api.dispatch({command:'CAPTURE'});
  ok(!api.dispatch({command:'RETURN',checkpoint:capture.checkpoint}).ok,'old checkpoint rejected');
  ok(!api.dispatch({command:'STEP'}).ok,'HOLD blocks mutations');
  ok(api.dispatch({command:'READ'}).ok,'explicit read recovery');
  ok(api.dispatch({command:'RETURN',checkpoint:fresh.checkpoint}).ok,'current checkpoint still returns');
}
jan.api.dispatch({command:'SET',payload:{view:'ladder',k:-3}});
eq(jan.api.dispatch({command:'STEP'}).reading.value,12543);
eq(jan.api.dispatch({command:'MIRROR'}).reading.value,12567);
const before=jan.api.dispatch({command:'READ'}).state;
ok(!jan.api.dispatch({command:'SET',payload:{view:'outer',k:99}}).ok,'atomic Janus validation');
eq(jan.api.dispatch({command:'READ'}).state,before);
two.api.dispatch({command:'SET',payload:{family:'exact',j:5,n:16}});
let read=two.api.dispatch({command:'READ'});
eq([read.reading.sourceIndex,read.reading.sourceValue,read.reading.eulerValue],[113,617,889],'native numerical outputs');
eq(two.api.dispatch({command:'STEP'}).reading.visibleAddress,3);
two.api.dispatch({command:'SET',payload:{family:'historical',j:11,n:0}});
read=two.api.dispatch({command:'READ'});eq([read.reading.sourceIndex,read.reading.sourceValue,read.reading.sourceAddress],[232,1459,12]);
const anchor=two.api.dispatch({command:'CAPTURE'});two.nodes.next.onclick();
two.api.publish();ok(!two.api.dispatch({command:'READ'}).returnWitness,'native source input invalidates old witness');
read=two.api.dispatch({command:'RETURN',checkpoint:anchor.checkpoint});eq(read.state,anchor.state,'native changes restored too');
const frozen=two.api.dispatch({command:'READ'}).state;
ok(!two.api.dispatch({command:'SET',payload:{family:'exact',j:5,n:41}}).ok,'validate before modifying any field');
eq(two.api.dispatch({command:'READ'}).state,frozen);
console.log(JSON.stringify({status:'PASS',checks,scope:'actual Janus and Two-Cut inline source scripts, mock DOM; no browser pixels'}));
module.exports={source,Element,janusFile,twoFile};
