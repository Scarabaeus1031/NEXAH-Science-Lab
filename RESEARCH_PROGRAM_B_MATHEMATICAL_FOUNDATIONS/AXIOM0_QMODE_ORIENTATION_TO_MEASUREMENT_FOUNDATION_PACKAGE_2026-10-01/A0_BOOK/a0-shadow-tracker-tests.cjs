const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {readout,createHistory}=require('./a0-shadow-tracker.js');
const r=readout([.5,-1,0]);assert.deepEqual(r.values,[.5,-1,0]);assert.deepEqual(r.relativeMagnitudes,[.5,1,0]);assert.equal(r.pairRatios[0].value,-.5);assert.equal(r.pairRatios[1].value,null);assert.equal(r.pairRatios[2].value,0);
assert.equal(readout([0,0,0]).relativeMagnitudes,null);assert.ok(readout([0,0,0]).pairRatios.every(item=>item.value===null));assert.equal(readout([1,1e-10,0]).pairRatios[0].value,null);assert.throws(()=>readout([1,Infinity,0]));
const sample=(time,phase=0)=>({signals:[Math.sin(time),Math.cos(time),Math.sin(time+.5)],distance:{elapsed:time,parameters:{a:3,b:2,phaseRadians:phase}}});
const history=createHistory();for(let i=0;i<2000;i++)history.append(sample(i*.02));assert.ok(history.snapshot.sampleCount<=1200);assert.ok(history.points.every(point=>point.time>=39.98-4*Math.PI));
const count=history.snapshot.sampleCount;history.append(sample(39.98));assert.equal(history.snapshot.sampleCount,count,'No fake samples while paused');
history.append(sample(0));assert.equal(history.points.length,1,'Meter reset clears prior trace');history.append(sample(.1,1));assert.equal(history.points.length,1,'Phase or pair changes clear trace');
const held=history.snapshot;held.values[0]=99;assert.notEqual(history.snapshot.values[0],99,'Independent snapshots');
const {makeReturn}=require('./a0-root-room-bridge.js');const record=makeReturn({c:[0,0],iterations:120},{ratio:'3:2',phaseDegrees:0},{clock:.1,signals:[0,1,0]},history.snapshot);assert.deepEqual(record.shadowTracker.values,history.snapshot.values);
class El{constructor(){this.children=[];this.events={};this.attrs={};this.clientWidth=500;}append(...items){this.children.push(...items);}before(item){this.beforeItem=item;}setAttribute(k,v){this.attrs[k]=v;}addEventListener(k,v){this.events[k]=v;}getContext(){return new Proxy({},{get:()=>()=>{}});}}
const meter=new El(),events={},win={A0ThreeLissajousPlanesView:{snapshot:sample(0)},addEventListener:(key,fn)=>{events[key]=fn;}};
vm.runInNewContext(fs.readFileSync('a0-shadow-tracker.js','utf8'),{document:{getElementById:()=>meter,createElement:()=>new El()},window:win,devicePixelRatio:1,ResizeObserver:class{observe(){}}});
const pair=meter.beforeItem;assert.equal(pair.children[0],meter);const panel=pair.children[1];assert.equal(panel.id,'shadowDisplacementTracker');assert.equal(panel.children[2].attrs.role,'img');
events['a0-lissajous-frame']({detail:sample(1)});assert.match(panel.children[3].textContent,/AM: \+0\.841/);assert.match(panel.children[4].textContent,/Maximum = 1/);assert.equal(win.A0ShadowTracker.snapshot.time,1);
events['a0-lissajous-frame']({detail:{signals:[0,0,0],distance:{elapsed:2,parameters:{a:3,b:2,phaseRadians:0}}}});assert.match(panel.children[4].textContent,/nicht bestimmt/);assert.ok(!panel.children[5].textContent.includes('Infinity'));
console.log('PASS: signed shadows, normalized magnitudes, safe zero ratios, bounded trace, reset/parameter changes, side-by-side UI and held Return');
