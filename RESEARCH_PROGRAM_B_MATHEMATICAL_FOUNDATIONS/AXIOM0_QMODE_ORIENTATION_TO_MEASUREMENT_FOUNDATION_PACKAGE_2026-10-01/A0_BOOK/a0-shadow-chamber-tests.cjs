const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),model=require('./a0-shadow-chamber.js'),bridge=require('./a0-root-room-bridge.js');
for(const shape of ['open','kite','square','rose'])for(const opening of [.4,1,1.4]){
  for(const point of model.boundary({shape,opening}))assert.ok(model.contains(point,{shape,opening}));
  for(let i=0;i<100;i++){
    const signals=[Math.sin(i*.2),Math.sin(i*.31),Math.cos(i*.13)],s=model.observe({clock:i/10,signals},{shape,opening});
    assert.deepEqual(s.signals,signals);assert.deepEqual(s.views.map(v=>v.sourcePoint),bridge.projectSignals(signals).map(v=>v.point));
    s.views.forEach(v=>assert.equal(v.admitted,model.contains(v.platePoint,{shape,opening})));
  }
}
assert.ok(model.contains([0,0],{shape:'rose'}));assert.ok(!model.contains([0,.8],{shape:'rose'}));assert.ok(model.contains([0,-.8],{shape:'rose'}));
assert.ok(model.contains([.5,.5],{shape:'kite'}));assert.ok(!model.contains([.6,.6],{shape:'kite'}));assert.ok(!model.contains([.66,0],{shape:'square'}));
assert.throws(()=>model.settings({shape:'unknown'}));assert.throws(()=>model.settings({opening:0}));assert.throws(()=>model.observe({clock:NaN,signals:[0,0,0]},{}));
for(const ratio of ['3:2','2:3','1:1','5:6'])for(const phaseDegrees of [0,90,135])for(const family of ['linear','dyadic']){
  const seq=model.sequence({ratio,phaseDegrees},family),[a,b]=ratio.split(':').map(Number),delta=phaseDegrees*Math.PI/180;
  assert.equal(seq.steps.length,10);seq.steps.forEach((s,index)=>{assert.equal(s.factor,family==='linear'?index+1:2**index);assert.equal(s.time,s.factor*Math.PI);assert.deepEqual(s.signals,[Math.sin(a*s.time),Math.sin(b*s.time+delta),Math.sin(s.time+delta/2)]);});
}
assert.equal(model.sequence({ratio:'3:2',phaseDegrees:90},'dyadic').steps[9].factor,512);
assert.ok(model.sequence({ratio:'3:2',phaseDegrees:90},'dyadic').steps[9].sameSignalAs.includes(1));assert.equal(model.sequence({ratio:'3:2',phaseDegrees:90},'linear').steps[1].sameSignalAs.length,0);
assert.throws(()=>model.sequence({ratio:'3:2',phaseDegrees:90},'invalid'));assert.throws(()=>model.sequence({ratio:'bad',phaseDegrees:90}));
for(let degrees=0;degrees<=360;degrees++){
  const p=[.27,-.81],r=model.rotate(p,degrees),back=model.rotate(r,-degrees);assert.ok(Math.abs(Math.hypot(...p)-Math.hypot(...r))<1e-12);assert.ok(back.every((v,i)=>Math.abs(v-p[i])<1e-12));
}
assert.equal(model.reading('cross').rays.length,4);assert.equal(model.reading('overlay').rays.length,8);assert.equal(model.reading('rotate',22.5).angleDegrees,22.5);assert.equal(model.reading('sector').sector.length,9);assert.equal(model.reading('complement').sector.length,357);assert.throws(()=>model.reading('mobius'));assert.throws(()=>model.reading('rotate',46));
class El{constructor(value=''){this.value=value;this.children=[];this.events={};this.attrs={};this.textContent='';}addEventListener(n,f){this.events[n]=f;}fire(n){this.events[n]?.();}appendChild(el){this.children.push(el);}setAttribute(k,v){this.attrs[k]=v;}replaceChildren(){this.children=[];}}
const ids=['shadowChamberInstrument','shadowChamberSvg','chamberShape','chamberOpening','chamberOpeningOut','chamberPlay','chamberClear','chamberReturn','chamberStatus','chamberSequence','chamberSequenceReadout','chamberStep','chamberStepOut','chamberPrevious','chamberNext'],els=Object.fromEntries(ids.map(id=>[id,new El()]));els.chamberShape.value='rose';els.chamberOpening.value='1';els.chamberSequence.value='live';els.chamberStep.value='0';
const state={ratio:'3:2',phaseDegrees:90,playing:true};let clock=0,held;
els.chamberReading=new El('off');els.chamberReadingStatus=new El();
const view={get state(){return state;},get snapshot(){return{clock,signals:[Math.sin(3*clock),Math.cos(2*clock),Math.sin(clock+Math.PI/4)]};},setPlaying(value){state.playing=value;}};
const handlers={},window={A0ShadowChamberModel:model,A0ThreeLissajousPlanesView:view,addEventListener:(name,fn)=>handlers[name]=fn,A0RootRoomPhaseBridge:{select(id){assert.equal(id,'RETURN');view.setPlaying(false);held=bridge.makeReturn({c:[0,0],iterations:10},state,view.snapshot,null,null,window.A0ShadowChamber.snapshot);}}};
const source=fs.readFileSync('./a0-shadow-chamber.js','utf8');assert.ok(!source.includes('requestAnimationFrame'));
vm.runInNewContext(source,{window,document:{getElementById:id=>els[id],createElementNS:()=>new El()}});
const emit=()=>handlers['a0-lissajous-frame']({detail:view.snapshot});
assert.equal(window.A0ShadowChamber.snapshot.history.length,1);emit();assert.equal(window.A0ShadowChamber.snapshot.history.length,1);
clock=.03;emit();assert.equal(window.A0ShadowChamber.snapshot.history.length,2);
const raw=window.A0ShadowChamber.snapshot.history.map(p=>p.signals);
els.chamberShape.value='open';els.chamberShape.fire('change');assert.ok(window.A0ShadowChamber.snapshot.current.views.every(p=>p.admitted));assert.equal(els.shadowChamberSvg.children.filter(el=>el.attrs['data-role']==='admitted-point').length,3);
let linkedRefreshes=0;window.A0OneFlow={refreshProjection(){linkedRefreshes++;}};
els.chamberOpening.value='.4';els.chamberOpening.fire('input');assert.ok(linkedRefreshes>0);assert.equal(window.A0ShadowChamber.snapshot.current.time,.03);assert.deepEqual(window.A0ShadowChamber.snapshot.history.map(p=>p.signals),raw);
els.chamberShape.value='square';els.chamberShape.fire('change');assert.ok(window.A0ShadowChamber.snapshot.current.views.some(p=>!p.admitted));
els.chamberReturn.fire('click');assert.equal(state.playing,false);assert.equal(held.shadowChamber.current.aperture.shape,'square');assert.equal(held.shadowChamber.current.time,held.lissajous.time);assert.equal(held.shadowChamber.history.length,2);
const first=els.shadowChamberSvg.children[0];emit();const afterFirst=els.shadowChamberSvg.children[0];emit();assert.equal(els.shadowChamberSvg.children[0],afterFirst,'paused repeated source time does not redraw forever');
els.chamberClear.fire('click');assert.equal(window.A0ShadowChamber.snapshot.history.length,0);assert.equal(held.shadowChamber.history.length,2);
els.chamberPlay.fire('click');assert.equal(state.playing,true);clock=.1;emit();state.ratio='5:6';clock=.2;emit();assert.equal(window.A0ShadowChamber.snapshot.history.length,1);
clock=10;emit();assert.equal(window.A0ShadowChamber.snapshot.history.length,1,'expired raw samples leave bounded window');
assert.ok(els.shadowChamberSvg.children.every(el=>Object.values(el.attrs).every(v=>!String(v).includes('NaN'))));
const liveBefore=window.A0ShadowChamber.snapshot;
els.chamberSequence.value='dyadic';els.chamberSequence.fire('change');assert.equal(window.A0ShadowChamber.snapshot.explanation.selected.factor,1);assert.equal(window.A0ShadowChamber.snapshot.current.time,10);assert.equal(els.chamberPrevious.disabled,true);
els.chamberNext.fire('click');assert.equal(window.A0ShadowChamber.snapshot.explanation.selected.factor,2);
els.chamberStep.value='9';els.chamberStep.fire('input');assert.equal(window.A0ShadowChamber.snapshot.explanation.selected.factor,512);assert.equal(els.chamberNext.disabled,true);assert.match(els.chamberSequenceReadout.textContent,/Gleiche drei Signale/);
assert.deepEqual(window.A0ShadowChamber.snapshot.history,liveBefore.history);assert.deepEqual(window.A0ShadowChamber.snapshot.sourceState,liveBefore.sourceState);
els.chamberReturn.fire('click');assert.equal(held.shadowChamber.explanation.selected.factor,512);assert.equal(held.lissajous.time,10);assert.equal(held.shadowChamber.explanation.displayed.time,512*Math.PI);
els.chamberSequence.value='linear';els.chamberSequence.fire('change');assert.equal(window.A0ShadowChamber.snapshot.explanation.selected.label,'1π');els.chamberNext.fire('click');assert.equal(window.A0ShadowChamber.snapshot.explanation.selected.factor,2);
els.chamberSequence.value='live';els.chamberSequence.fire('change');assert.equal(window.A0ShadowChamber.snapshot.explanation,null);assert.equal(els.chamberStep.disabled,true);assert.equal(window.A0ShadowChamber.snapshot.current.time,10);
const beforeReading=window.A0ShadowChamber.snapshot;
for(const mode of ['cross','rotate','overlay','arc','sector','complement']){
  window.A0ShadowChamber.setReading(mode,45);const after=window.A0ShadowChamber.snapshot;
  assert.deepEqual(after.history,beforeReading.history);assert.deepEqual(after.current,beforeReading.current);assert.deepEqual(after.sourceState,beforeReading.sourceState);
  assert.equal(els.shadowChamberSvg.children.filter(e=>e.attrs['data-role']==='reading-ray').length,['overlay','arc'].includes(mode)?16:8);
  assert.equal(els.shadowChamberSvg.children.filter(e=>e.attrs['data-role']==='reading-sector').length,['sector','complement'].includes(mode)?2:0);
}
window.A0ShadowChamber.setReading('rotate',22.5);assert.equal(window.A0ShadowChamber.snapshot.reading.angleDegrees,22.5);
assert.deepEqual(window.A0ShadowChamber.reading.current,window.A0ShadowChamber.snapshot.current);assert.equal(window.A0ShadowChamber.reading.reference,null);els.chamberSequence.value='dyadic';els.chamberStep.value='9';els.chamberStep.fire('input');assert.equal(window.A0ShadowChamber.reading.reference.observation.time,512*Math.PI);assert.equal(window.A0ShadowChamber.reading.current.time,10);const linked=window.A0ShadowChamber.reading;linked.current.views[0].platePoint[0]=99;assert.notEqual(window.A0ShadowChamber.reading.current.views[0].platePoint[0],99);
els.chamberReading.value='cross';els.chamberReading.fire('change');assert.equal(window.A0ShadowChamber.snapshot.reading.angleDegrees,0);
els.chamberReturn.fire('click');assert.equal(held.shadowChamber.reading.mode,'cross');
console.log('PASS: 1200 aperture observations; 24 pi-sequence parameter sets, 512pi endpoint and real coincidences; live/reference separation, manual step controls, retained source/history, mask output and extended Root Return');
