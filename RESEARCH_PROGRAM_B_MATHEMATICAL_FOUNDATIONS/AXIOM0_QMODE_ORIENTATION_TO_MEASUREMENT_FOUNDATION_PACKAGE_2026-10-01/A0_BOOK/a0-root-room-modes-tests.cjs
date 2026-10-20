const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {reading,position}=require('./a0-root-room-modes.js');
for(const ratio of ['3:2','2:3','1:1','5:6'])for(const degrees of [0,90,180,360])for(const t of [0,.5,2,6]){
  const[a,b]=ratio.split(':').map(Number),delta=degrees*Math.PI/180,r=reading(ratio,degrees,t),expected=[Math.sin(a*t),Math.sin(b*t+delta),Math.sin(t+delta/2)];
  assert.deepEqual(r.frequencies,[a,b,1]);r.markers.forEach((marker,index)=>{assert.ok(Math.abs(marker.localShadow-expected[index])<1e-12);assert.ok(position(marker,700,540,[-.1087,.2]).every(Number.isFinite));});
}
assert.throws(()=>reading('bad',90,1));
const r=reading('3:2',90,0),point=position(r.markers[0],700,540,[0,0]);assert.ok(Math.abs(point[0]-700*.42)<1e-9);
class El{constructor(){this.children=[];this.events={};this.attrs={};this.style={setProperty(){}};this.clientWidth=700;this.clientHeight=540;}append(...items){this.children.push(...items);}before(item){this.beforeItem=item;}setAttribute(k,v){this.attrs[k]=v;}addEventListener(k,v){this.events[k]=v;}scrollIntoView(){this.scrolled=true;}querySelector(){return this.grid||(this.grid=new El());}}
const canvas=new El(),root=new El(),planes=new El(),inputs={cReal:new El(),cImag:new El()},events={};let selected=null,playing=true;
const state={ratio:'3:2',phaseDegrees:90,get playing(){return playing;}},snapshot={clock:.5};
const view={state,snapshot,setPlaying:v=>{playing=v;}};
const win={A0ThreeLissajousPlanesView:view,A0FlameMandelbrotFormationView:{state:{c:[-.1087,0]}},A0RootRoomPhaseBridge:{select:mode=>{selected=mode;events['a0-root-mode-change']({detail:{mode}});}},addEventListener:(key,fn)=>{events[key]=fn;}};
vm.runInNewContext(fs.readFileSync('a0-root-room-modes.js','utf8'),{document:{getElementById:id=>({rootRoomCanvas:canvas,rootRoom:root,threeLissajousPlanes:planes,...inputs}[id]),createElement:()=>new El()},window:win,ResizeObserver:class{observe(){}}});
const controls=root.grid.beforeItem,nav=controls.children[2],stage=canvas.beforeItem;
assert.equal(stage.children[0],canvas,'Original canvas and renderer preserved');assert.equal(stage.children.length,5,'Three signal markers and Return marker');
nav.children[1].events.click();assert.equal(selected,'VM');assert.equal(nav.children[1].attrs['aria-pressed'],'true');assert.equal(stage.children[2].attrs['aria-pressed'],'true');
stage.children[3].events.click();assert.equal(selected,'PM');
events['a0-root-mode-change']({detail:{mode:'AM'}});assert.equal(nav.children[0].attrs['aria-pressed'],'true','Other controls synchronize local modes');
nav.children[4].events.click();assert.equal(playing,false);assert.match(nav.children[4].textContent,/starten/);
controls.children[4].events.click();assert.equal(planes.scrolled,true);
events['a0-root-mode-change']({detail:{mode:'RETURN'}});assert.equal(win.A0RootRoomModes.snapshot.selectedMode,'RETURN');
const {makeReturn}=require('./a0-root-room-bridge.js');const record=makeReturn({c:[0,0],iterations:120},{ratio:'3:2',phaseDegrees:90},{clock:.5,signals:[1,2,3]},null,win.A0RootRoomModes.snapshot);assert.equal(record.rootRingReading.selectedMode,'RETURN');
console.log('PASS: shared a:b:1 phase clocks, root marker geometry, synchronized mode buttons, Return marker/record and lower-plane route');
