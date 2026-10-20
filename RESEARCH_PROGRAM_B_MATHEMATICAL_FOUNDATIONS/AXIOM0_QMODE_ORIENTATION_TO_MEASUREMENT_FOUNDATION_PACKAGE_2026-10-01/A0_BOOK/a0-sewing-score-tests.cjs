const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),model=require('./assets/a0-sewing-score.js'),sewing=require('./assets/a0-pentagon-sewing.js');
assert.ok(Math.abs(model.rate(78)*10-model.TAU)<1e-12);assert.ok(Math.abs(model.rate(78)*40-4*model.TAU)<1e-12);
assert.equal(model.position(4*model.TAU).arrangement,0);
assert.equal(model.layout(5).beats,65);assert.equal(model.layout(5).themes,5);assert.equal(model.position(5*model.TAU,5).arrangement,0);
const alternate=model.events([1,1,1],[4,3,2],5);assert.equal(alternate.AM.length,20);assert.equal(alternate.VM.length,15);assert.equal(alternate.PM.length,10);assert.ok(alternate.AM.every(b=>b<65));
assert.throws(()=>model.layout(7),/meter/);assert.throws(()=>model.events([1,1,1],[1,1,1]),/ratio/);
const alternateReading=sewing.reading(sewing.fold([1,3,2,6,5,9,7,8]),.4,[4,3,2]);assert.deepEqual(alternateReading.frequencies,[4,3,2]);assert.ok(Math.abs(alternateReading.signals[0]+Math.sin(4*.4))<1e-12);
assert.equal(model.position(6/13*model.TAU).section,'Wenden');assert.equal(model.position(6/13*model.TAU).envelope,1);
assert.equal(model.position(0).breath,.96);assert.equal(model.position(6.5/13*model.TAU).breath,1.04);
const e=model.events();assert.equal(e.AM.length,12);assert.equal(e.VM.length,8);assert.equal(e.PM.length,4);assert.equal(e.sewing.length,12);assert.equal(e.VM[0],0);
assert.throws(()=>model.rate(0),/BPM/);assert.throws(()=>model.echoes([0],5),/delay/);assert.equal(model.echoes([0],.5)[0],.5);
assert.equal(model.echoes([51.75],.5,true)[0],.25);assert.equal(model.echoes([51.75],.5).length,0);
assert.equal(model.events([0,1,1]).AM.length,0);const negative=model.events([-1,1,1]).AM[0];assert.ok(Math.abs(-Math.sin(3*negative/13*model.TAU)-1)<1e-12);
for(const [frequency,offset,key]of [[3,0,'AM'],[2,Math.PI/2,'VM'],[1,Math.PI/4,'PM']])for(const beat of e[key])assert.ok(Math.abs(Math.sin(frequency*beat/13*model.TAU+offset)-1)<1e-12);
class El{
 constructor(value=''){this.value=value;this.children=[];this.events={};this.attrs={};this.textContent='';this.checked=false;this.classList={toggle(){},add(){},remove(){}};}
 setAttribute(k,v){this.attrs[k]=v;}appendChild(el){this.children.push(el);}append(...els){this.children.push(...els);}replaceChildren(...els){this.children=els;}addEventListener(name,fn){this.events[name]=fn;}fire(name){this.events[name]?.();}
}
const ids=['pentagonSewing','sewingSvg','sewingLevel','sewingOffset','sewingSpeed','sewingPlay','sewingAuto','sewingReadout','sewingRecord','sewingLevelOut','sewingOffsetOut','sewingSpeedOut','sewingReset','sewingHold','sewingLevelStrip','sewingMode','sewingPairSummary','sewingScore','scoreSvg','scorePlay','scorePosition','scoreLink','scoreTracks','scoreBpm','scoreBpmOut','scoreDelay','scoreDelayOut','scoreReset','scoreMeter','scoreRatio'],els=Object.fromEntries(ids.map(id=>[id,new El()]));
Object.entries({sewingLevel:'2',sewingOffset:'0',sewingSpeed:'1',scoreBpm:'78',scoreDelay:'1'}).forEach(([key,value])=>els[key].value=value);
let frame;const seed=[.415,.238,.213,.075,-.008,-.252,-.287,-.394],window={A0PentagonSewing:sewing,A0SewingScoreModel:model,A0Axis08FoldReturnView:{source:{source:{laneMeans:seed}}}};
const context=vm.createContext({window,document:{getElementById:id=>els[id],createElement:()=>new El(),createElementNS:()=>new El(),createTextNode:text=>({textContent:text})},requestAnimationFrame:fn=>{frame=fn;}});
vm.runInContext(fs.readFileSync('./a0-pentagon-sewing.js','utf8'),context);vm.runInContext(fs.readFileSync('./a0-sewing-score.js','utf8'),context);
assert.equal(els.scoreTracks.children.length,9);assert.equal(els.sewingSpeed.disabled,true);assert.equal(els.sewingAuto.disabled,true);assert.equal(window.A0SewingScore.snapshot().tracks.echo,false);
els.scorePlay.fire('click');frame(0);for(let i=1;i<=100;i++)frame(i*100);assert.ok(Math.abs(window.A0PentagonSewingView.snapshot().time-model.TAU)<1e-12);
els.scorePlay.fire('click');const time=window.A0PentagonSewingView.snapshot().time;frame(10100);assert.equal(window.A0PentagonSewingView.snapshot().time,time);
els.scoreBpm.value='156';els.scoreBpm.fire('input');assert.equal(window.A0PentagonSewingView.snapshot().time,time);assert.equal(window.A0SewingScore.snapshot().bpm,156);
els.scorePlay.fire('click');frame(10600);els.scorePlay.fire('click');assert.ok(Math.abs(window.A0PentagonSewingView.snapshot().time-time-.5*model.rate(156))<1e-12);
const amBox=els.scoreTracks.children[3].children[0];amBox.checked=false;amBox.fire('change');assert.equal(window.A0SewingScore.geometry(time).tracks.AM,false);
const echoBox=els.scoreTracks.children[8].children[0];echoBox.checked=true;echoBox.fire('change');assert.equal(window.A0SewingScore.snapshot().tracks.echo,true);assert.ok(window.A0SewingScore.geometry(time).echoDelay>0);
els.sewingHold.fire('click');const held=JSON.parse(els.sewingRecord.textContent);assert.equal(held.score.bpm,156);assert.deepEqual(held.coupling.source,seed);
const unchangedTime=window.A0PentagonSewingView.snapshot().time;
els.scoreMeter.value='5';els.scoreMeter.fire('change');assert.equal(window.A0SewingScore.snapshot().meter,5);assert.match(els.scorePosition.textContent,/65 Viertel/);assert.equal(window.A0PentagonSewingView.snapshot().time,unchangedTime);
els.scoreRatio.value='4:3:2';els.scoreRatio.fire('change');assert.equal(window.A0SewingScore.snapshot().frequencies.join(':'),'4:3:2');assert.equal(window.A0PentagonSewingView.snapshot().time,unchangedTime);assert.equal(window.A0PentagonSewingView.snapshot().held,null);
els.sewingHold.fire('click');const changed=JSON.parse(els.sewingRecord.textContent);assert.equal(changed.display.frequencies.join(':'),'4:3:2');assert.equal(changed.score.meter,5);assert.equal(changed.history.length,0);assert.deepEqual(changed.coupling.source,seed);
els.scoreLink.fire('click');assert.equal(els.sewingSpeed.disabled,false);assert.equal(window.A0SewingScore.rate(),null);
els.scoreLink.fire('click');els.scoreReset.fire('click');assert.equal(window.A0PentagonSewingView.snapshot().time,0);assert.equal(window.A0PentagonSewingView.snapshot().held,null);
assert.match(els.scorePosition.textContent,/Position 1\/13/);
els.scorePlay.fire('click');frame(10700);frame(10800);
const beforeMode=window.A0PentagonSewingView.snapshot(),beforeSignals=sewing.reading(beforeMode.record,beforeMode.time,[4,3,2]);
els.sewingMode.value='4+4';els.sewingMode.fire('change');
const fourMode=window.A0PentagonSewingView.snapshot();assert.equal(fourMode.time,beforeMode.time);assert.equal(fourMode.playing,true);assert.equal(fourMode.record.mode,'4+4');assert.equal(fourMode.record.residuals.length,4);assert.equal(fourMode.record.error,beforeMode.record.error);
assert.deepEqual(sewing.reading(fourMode.record,fourMode.time,[4,3,2]),beforeSignals);assert.equal(els.scoreTracks.children.length,9);
frame(10900);assert.ok(window.A0PentagonSewingView.snapshot().time>fourMode.time);
els.sewingHold.fire('click');const fourHeld=JSON.parse(els.sewingRecord.textContent);assert.equal(fourHeld.coupling.mode,'4+4');assert.equal(fourHeld.coupling.residuals.length,4);assert.equal(fourHeld.score.meter,5);assert.equal(fourHeld.display.signals.length,3);assert.ok(fourHeld.history.every(h=>h.time>fourMode.time));
els.sewingMode.value='5+3';els.sewingMode.fire('change');assert.deepEqual(JSON.parse(JSON.stringify(window.A0PentagonSewingView.snapshot().record.source)),seed);
console.log('PASS: 78 BPM/10s theme, 52/65-quarter alignments, independent 4/4–5/4 and 3:2:1–4:3:2, shared signal/impulse frequencies, source preservation, pause, phase continuity, clean trace changes, echo and return');
