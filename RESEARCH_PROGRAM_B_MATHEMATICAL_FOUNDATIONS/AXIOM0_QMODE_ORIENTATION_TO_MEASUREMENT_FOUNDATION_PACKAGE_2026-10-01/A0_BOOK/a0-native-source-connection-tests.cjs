'use strict';
const assert=require('node:assert/strict'),bank=require('./a0-native-source-bank.js'),fixture=require('./a0-native-instrument-tests.cjs'),contract=require('./a0-native-instrument-contract.js'),seam=require('./a0-source-seam-package.js');
let checks=0;const ok=(v,msg)=>{assert.ok(v,msg);checks++};
class Element extends fixture.Element{
  constructor(tag){super(tag);this.disabled=false}
  fire(key){if(!this.disabled)for(const fn of this.events[key]||[])fn({target:this})}
}
const host=new Element('section'),doc={getElementById:id=>id==='nativeSourceBank'?host:null,createElement:tag=>new Element(tag)};
const view=bank.mount(doc,{A0PentagonBench:{exportRecord:()=>({schema:'existing-pentagon-test-record',status:'READY'})}});
const all=()=>{const result=[];function visit(el){result.push(el);for(const child of el.children||[])visit(child)}visit(host);return result};
const named=text=>all().find(el=>el.textContent===text);
const choice=all().find(el=>el.id==='nativeBankChoice'),load=named('Quell-HTML hier laden'),unload=named('Quelle entladen · Sitzung verwerfen');
const slot=all().find(el=>el.className==='native-bank-slot');
for(const [key,file] of [['janus',fixture.janusFile],['two-cut',fixture.twoFile]]){
  choice.value=key;choice.fire('change');load.fire('click');
  const frame=slot.children[0],source=fixture.source(file);frame.contentWindow={A0NativeInstrument:source.api};frame.fire('load');
  const read=view.send('READ');ok(read.ok&&read.schema==='nexah.a0.native-instrument/1','real source READ');
  const capture=view.send('CAPTURE');ok(capture.ok,'capture source checkpoint');
  const before=JSON.stringify(capture.state);
  for(let i=0;i<80;i++)view.send('STEP');
  const returned=view.send('RETURN');ok(returned.ok&&returned.returnWitness.exact,'source and host checked Return');
  ok(JSON.stringify(returned.state)===before,'actual source readback restored');
  const selected=all().filter(el=>el.tag==='input');
  for(const el of selected)el.value=key==='janus'?'-2':el.attributes['aria-label'].endsWith(' j')?'5':'16';
  ok(view.send('SET').ok,'host native fields dispatched');
  const record=view.snapshot();ok(record.journal.length<=64&&record.records[key].attached,'bounded typed journal');
  const copy=view.snapshot();copy.records[key].ack.state.changed=true;
  ok(!view.snapshot().records[key].ack.state.changed,'detached journal exports');
  ok(!record.wholeMachineReturn&&!record.sharedCarrier&&!record.simultaneousSnapshot,'no identity or simultaneity claim');
  const n=record.hostSeq;source.api.dispatch({command:'STEP'});ok(view.snapshot().hostSeq>n,'native changes publish to Bench');
  unload.fire('click');ok(!view.snapshot().records[key].attached,'unloaded source explicitly stale');
}
let boxState={t:.5,extension:1.25,foldDeg:180,mode:'square',baseOn:true,number:1111};
const boxView={readState:()=>({...boxState}),pause(){},restore:value=>{boxState={...value}},set(payload){boxState={...boxState,...payload,number:payload.number===undefined?boxState.number:Number(payload.number),baseOn:payload.baseOn===undefined?boxState.baseOn:payload.baseOn==='on'}},step(){boxState.foldDeg=boxState.foldDeg>=180?0:boxState.foldDeg+15},read:()=>({type:'BOX_FOLD_CONTACT_WITH_JOINT_ADDRESS',address:{integer:boxState.number,totient:boxState.number===1111?1000:2000,q4Address:null,layerAddress:null}})};
const boxApi=seam.createInstrument(contract,boxView);
choice.value='box';choice.fire('change');load.fire('click');slot.children[0].contentWindow={A0NativeInstrument:boxApi};slot.children[0].fire('load');
ok(view.send('READ').ok,'Box source READ');view.send('CAPTURE');
for(const field of all().filter(el=>el.tag==='input'||el.tag==='select')){
  const label=field.attributes['aria-label']||'';
  if(label.endsWith(' t'))field.value='.61';else if(label.endsWith(' extension'))field.value='1.144';else if(label.endsWith(' foldDeg'))field.value='120';else if(label.endsWith(' mode'))field.value='triangle';else if(label.endsWith(' baseOn'))field.value='off';else if(label.endsWith(' number'))field.value='3333';
}
let boxAck=view.send('SET');ok(boxAck.ok&&boxAck.state.mode==='triangle'&&!boxAck.state.baseOn&&boxAck.reading.address.integer===3333,'Box controls and Joint profile dispatched');
boxAck=view.send('RETURN');ok(boxAck.ok&&boxAck.returnWitness.exact&&boxAck.state.number===1111,'Box scoped Return verified');unload.fire('click');
ok(Object.keys(view.snapshot().records).length===3,'three native states consolidated without merging carriers');
ok(view.snapshot().existingConnections.pentagon.status==='READY','existing contract export preserved as typed record');
choice.value='double';choice.fire('change');load.fire('click');slot.children[0].contentWindow={};slot.children[0].fire('load');
ok(view.send('READ')===null&&view.snapshot().held,'missing contract is HOLD, not a fabricated state');
unload.fire('click');
choice.value='janus';choice.fire('change');load.fire('click');
const source=fixture.source(fixture.janusFile);slot.children[0].contentWindow={A0NativeInstrument:source.api};slot.children[0].fire('load');
view.send('READ');view.send('CAPTURE');const dispatch=source.api.dispatch;
source.api.dispatch=request=>{const ack=dispatch(request);if(request.command==='RETURN')ack.state.k=3;return ack};
ok(view.send('RETURN')===null&&view.snapshot().held,'host rejects tampered Return acknowledgement');
console.log(JSON.stringify({status:'PASS',checks,sourceEngines:'actual Janus / Two-Cut plus Box seam contract',browserAcceptance:false}));
