const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),model=require('./assets/a0-pentagon-sewing.js');
for(const mode of ['5+3','4+4'])for(let offset=0;offset<8;offset++)for(let n=0;n<50;n++){
  const values=Array.from({length:8},(_,i)=>Math.sin(i*1.37+n)*3),r=model.fold(values,offset,mode);
  assert.equal(r.quotient.length,mode==='5+3'?5:4);assert.equal(r.residuals.length,mode==='5+3'?3:4);
  assert.equal(new Set(r.pairs.flat().concat(r.singles)).size,8);
  assert.ok(r.error<1e-14);r.source.fill(100);const reconstructed=model.reconstruct(r);
  values.forEach((v,i)=>assert.ok(Math.abs(v-reconstructed[i])<1e-14));
  const read=model.reading(r,.73);assert.equal(read.signals.length,3);assert.ok(read.signals.every(Number.isFinite));
}
for(const mode of ['5+3','4+4'])for(let offset=0;offset<8;offset++){
  const equal=model.fold(Array(8).fill(5.25),offset,mode);assert.equal(equal.error,0);assert.ok(equal.residuals.every(v=>v===0));
  assert.ok(model.reading(equal,1).views.flat().every(Number.isFinite));
}
assert.throws(()=>model.fold(Array(8).fill(1),0,'invalid'),/mode/);
const fourth=model.fold([1,3,2,6,5,9,7,8],0,'4+4');assert.equal(fourth.quotient[3],7.5);assert.equal(fourth.residuals[3],-.5);assert.equal(fourth.singles.length,0);
assert.deepEqual(model.reading(fourth,.4),model.reading(model.fold(fourth.source),.4));
for(const count of [4,5])for(const reference of ['ring90','incircle','circumcircle']){
  const a=model.aperture(count,reference),expected=reference==='incircle'||reference==='circumcircle'?count:count===4?8:0;
  assert.equal(a.contacts.length,expected);
  for(const contact of a.contacts){
    assert.ok(Math.abs(Math.hypot(...contact.point)-a.circleRadius)<1e-9);
    for(const edge of contact.edges){const p=a.polygon[edge],q=a.polygon[(edge+1)%count],dx=q[0]-p[0],dy=q[1]-p[1],t=((contact.point[0]-p[0])*dx+(contact.point[1]-p[1])*dy)/(dx*dx+dy*dy);
      assert.ok(t>=-1e-10&&t<=1+1e-10);assert.ok(Math.abs(dx*(contact.point[1]-p[1])-dy*(contact.point[0]-p[0]))<1e-8);
      if(reference==='incircle')assert.ok(Math.abs(t-.5)<1e-10);
    }
    assert.equal(contact.edges.length,reference==='circumcircle'?2:1);
  }
}
assert.equal(model.aperture(5).relation,'inside');assert.ok(Math.abs(model.aperture(5).edgeGap-3.8459713474939)<1e-10);assert.equal(model.aperture(4).relation,'crossing');
assert.throws(()=>model.aperture(7),/count/);assert.throws(()=>model.aperture(5,'invalid'),/reference/);
assert.throws(()=>model.fold([1,2]),/eight/);assert.throws(()=>model.fold(Array(8).fill(1),8),/offset/);
assert.throws(()=>model.advance(0,-1),/nonnegative/);
const r=model.fold([1,3,2,6,5,9,7,8]),sample=model.reading(r,.4);
assert.deepEqual(sample.views,[[sample.signals[0],sample.signals[1]],[sample.signals[1],sample.signals[2]],[sample.signals[2],sample.signals[0]]]);
assert.equal(model.advance(1,.5,2),2);assert.equal(model.advance(1,0,2),1);
class Element{
  constructor(value=''){this.value=value;this.children=[];this.events={};this.attrs={};this.textContent='';this.classList={toggle(){},remove(){},add(){}};}
  addEventListener(name,fn){this.events[name]=fn;}
  setAttribute(k,v){this.attrs[k]=v;}
  appendChild(el){this.children.push(el);}
  replaceChildren(...els){this.children=els;}
  fire(name){this.events[name]?.();}
}
const ids=['pentagonSewing','sewingSvg','sewingLevel','sewingOffset','sewingSpeed','sewingPlay','sewingAuto','sewingReadout','sewingRecord','sewingLevelOut','sewingOffsetOut','sewingSpeedOut','sewingReset','sewingHold','sewingLevelStrip','sewingMode','sewingPairSummary','sewingAperture','sewingCircleReference','sewingApertureOut'];
const elements=Object.fromEntries(ids.map(id=>[id,new Element()]));elements.sewingLevel.value='2';elements.sewingOffset.value='0';elements.sewingSpeed.value='1';let nextFrame;
const window={A0PentagonSewing:model,A0Axis08FoldReturnView:{source:{source:{laneMeans:[1,3,2,6,5,9,7,8]}}}};
vm.runInNewContext(fs.readFileSync('./a0-pentagon-sewing.js','utf8'),{window,document:{getElementById:id=>elements[id],createElementNS:()=>new Element(),createElement:()=>new Element()},requestAnimationFrame:fn=>{nextFrame=fn;},console});
assert.equal(elements.sewingLevelStrip.children.length,7);
assert.equal(window.A0PentagonSewingView.snapshot().time,0);
nextFrame(0);elements.sewingPlay.fire('click');nextFrame(100);assert.ok(window.A0PentagonSewingView.snapshot().time>0);
elements.sewingHold.fire('click');const held=JSON.parse(elements.sewingRecord.textContent);assert.equal(held.coupling.quotient.length,5);assert.equal(held.coupling.residuals.length,3);assert.ok(held.history.length>0);assert.equal(held.coupling.error,0);
const paused=window.A0PentagonSewingView.snapshot().time;nextFrame(200);assert.equal(window.A0PentagonSewingView.snapshot().time,paused);
elements.sewingMode.value='4+4';elements.sewingMode.fire('change');
assert.equal(window.A0PentagonSewingView.snapshot().time,paused);assert.equal(window.A0PentagonSewingView.snapshot().held,null);
assert.equal(window.A0PentagonSewingView.snapshot().record.quotient.length,4);assert.match(elements.sewingPairSummary.textContent,/r4=.*−.*\/2=/);assert.match(elements.sewingLevelStrip.children[2].textContent,/Viereck/);
elements.sewingLevel.value='1';elements.sewingLevel.fire('input');
assert.equal(elements.sewingSvg.children.filter(el=>/^q\d$/.test(el.textContent)).length,4);
const descendants=el=>[el,...el.children.flatMap(descendants)];
assert.ok(descendants(elements.sewingSvg).some(el=>el.textContent==='r4'));
assert.ok(descendants(elements.sewingSvg).every(el=>Object.values(el.attrs).every(v=>!String(v).includes('NaN'))));
elements.sewingHold.fire('click');const heldFour=JSON.parse(elements.sewingRecord.textContent);assert.equal(heldFour.kind,'8_TO_4_PLUS_4_DISPLAY_RETURN');assert.equal(heldFour.coupling.residuals.length,4);assert.equal(heldFour.history.length,0);assert.equal(heldFour.display.signals.length,3);
elements.sewingOffset.value='7';elements.sewingOffset.fire('input');assert.equal(window.A0PentagonSewingView.snapshot().record.offset,7);assert.equal(window.A0PentagonSewingView.snapshot().time,0);assert.equal(window.A0PentagonSewingView.snapshot().held,null);
assert.equal(window.A0PentagonSewingView.snapshot().record.mode,'4+4');
elements.sewingMode.value='5+3';elements.sewingMode.fire('change');assert.equal(window.A0PentagonSewingView.snapshot().record.quotient.length,5);assert.match(elements.sewingLevelStrip.children[2].textContent,/Pentagon/);
elements.sewingLevel.value='1';elements.sewingLevel.fire('input');elements.sewingPlay.fire('click');nextFrame(250);elements.sewingHold.fire('click');
const beforeAperture=JSON.parse(elements.sewingRecord.textContent);
for(const mask of ['inside','outside','all'])for(const reference of ['ring90','incircle','circumcircle']){
  elements.sewingAperture.value=mask;elements.sewingAperture.fire('change');elements.sewingCircleReference.value=reference;elements.sewingCircleReference.fire('change');
  const snap=window.A0PentagonSewingView.snapshot();assert.equal(snap.time,beforeAperture.time);assert.equal(snap.held,null);assert.equal(snap.aperture.mask,mask);
  const nodes=descendants(elements.sewingSvg),layer=nodes.find(el=>el.attrs['data-layer']==='aperture-source');
  assert.equal(layer.attrs['clip-path'],mask==='all'?undefined:'url(#sewingApertureClip)');
  assert.equal(nodes.filter(el=>el.attrs['data-role']==='aperture-contact').length,reference==='ring90'?0:5);
  assert.ok(nodes.every(el=>Object.values(el.attrs).every(v=>!String(v).includes('NaN'))));
  elements.sewingHold.fire('click');const held=JSON.parse(elements.sewingRecord.textContent);assert.deepEqual(held.coupling,beforeAperture.coupling);assert.deepEqual(held.history,beforeAperture.history);assert.equal(held.aperture.reference,reference);
}
assert.match(elements.sewingApertureOut.textContent,/keine Kantentangente/);
elements.sewingAuto.fire('click');nextFrame(300);assert.equal(window.A0PentagonSewingView.snapshot().automatic,true);
elements.sewingLevel.value='1';elements.sewingLevel.fire('input');assert.equal(window.A0PentagonSewingView.snapshot().automatic,false);assert.match(elements.sewingReadout.textContent,/Schatten/);
elements.sewingReset.fire('click');assert.equal(window.A0PentagonSewingView.snapshot().time,0);
elements.sewingLevelStrip.children[0].fire('click');assert.equal(window.A0PentagonSewingView.snapshot().level,7);assert.equal(window.A0PentagonSewingView.snapshot().automatic,false);
console.log('PASS: 800 reversible folds, 16 constant cases; both modes/all offsets; six circle/polygon geometries with exact edge contacts; nine mask/reference UI states, preserved source/time/history, r4 and typed return');
