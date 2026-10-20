const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),model=require('./assets/a0-tesa-grid-candidate.js');
assert.equal(model.fixture.cols*model.fixture.rows,28);assert.equal(new Set(model.fixture.values).size,28);assert.deepEqual(model.fixture.externalMarkers,[29]);assert.throws(()=>model.cell(29),/1..28/);assert.throws(()=>model.cell(0),/1..28/);assert.throws(()=>model.view(1,{stretch:0}),/positive/);assert.equal(model.fromView(-1,1),null);
assert.equal(model.cell(17).row,2);assert.equal(model.cell(17).col,2);assert.equal(model.view(17,{mirror:true}).viewRow,1);assert.equal(model.view(27,{mirror:true}).viewRow,0);assert.equal(model.cell(27).col,5);
assert.equal(model.audit().status,'PASS');assert.equal(model.audit().cases,224);
for(const mirror of [false,true])for(const stretch of [.5,1,1.75,2])for(let n=1;n<=28;n++){
 const point=model.view(n,{mirror,stretch});assert.equal(model.fromView(point.x,point.y,{mirror,stretch}),n);
 const source=model.event(n),echo=model.echo(source,.5);assert.equal(source.address,echo.address);assert.equal(source.eventId,echo.eventId);assert.equal(echo.seconds-source.seconds,.5);
 for(const fps of [24,29.97,30,60]){const sample=model.frame(echo,fps);assert.equal(sample.eventId,source.eventId);assert.equal(sample.address,n);assert.equal(sample.seconds,echo.seconds);assert.ok(sample.quantizationSeconds>=-1e-10&&sample.quantizationSeconds<1/fps+1e-10);}
 const p=model.polar(echo);assert.ok(Math.abs(Math.hypot(p.x,p.y)-1)<1e-12);
}
class El{constructor(value=''){this.value=value;this.checked=false;this.children=[];this.attrs={};this.events={};this.style={setProperty(k,v){this[k]=v;}};this.dataset={};this.classList={add(){}};this.textContent='';}setAttribute(k,v){this.attrs[k]=v;}appendChild(el){this.children.push(el);}replaceChildren(){this.children=[];}addEventListener(name,fn){(this.events[name]??=[]).push(fn);}dispatchEvent(event){for(const fn of this.events[event.type]??[])fn(event);}fire(type){this.dispatchEvent({type});}}
const ids=['tesaCandidate','tesaCompare','ghostPreset','tesaMirror','tesaStretch','tesaEcho','tesaFps','tesaStatus','tesaTiming','tesaReceipt','tesaSelect17','tesaSelect27','tesaEnter'],els=Object.fromEntries(ids.map(id=>[id,new El()]));Object.entries({ghostPreset:'procedural',tesaStretch:'1',tesaEcho:'.5',tesaFps:'30'}).forEach(([k,v])=>els[k].value=v);
let value=1;const window={A0TesaGridCandidate:model,A0GhostTiles:{get selection(){return{value};},render(){window.A0TesaGridLens.update();},selectValue(n){model.cell(n);value=n;window.A0TesaGridLens.update();}}};
vm.runInNewContext(fs.readFileSync('./a0-tesa-grid-candidate.js','utf8'),{window,document:{getElementById:id=>els[id],createElementNS:()=>new El()},Event:class{constructor(type){this.type=type;}}});
assert.equal(els.tesaCandidate.hidden,true);els.tesaEnter.fire('click');assert.equal(els.tesaCandidate.hidden,false);assert.equal(window.A0TesaGridLens.snapshot().source.address,17);
els.tesaMirror.checked=true;els.tesaMirror.fire('change');assert.equal(window.A0TesaGridLens.snapshot().viewCell.viewRow,1);els.tesaStretch.value='2';els.tesaStretch.fire('change');assert.equal(window.A0TesaGridLens.snapshot().recoveredAddress,17);
els.tesaSelect27.fire('click');assert.equal(window.A0TesaGridLens.snapshot().viewCell.viewRow,0);els.tesaFps.value='60';els.tesaFps.fire('input');assert.equal(window.A0TesaGridLens.snapshot().referenceFrames[0].fps,60);
els.tesaEcho.value='-1';els.tesaEcho.fire('input');assert.match(els.tesaStatus.textContent,/Ungültige/);els.tesaEcho.value='.75';els.tesaEcho.fire('input');assert.equal(window.A0TesaGridLens.snapshot().echo.delaySeconds,.75);
els.ghostPreset.value='root7';window.A0TesaGridLens.update();assert.equal(els.tesaCandidate.hidden,true);
const html=fs.readFileSync('./A0_PINK_DIAMOND_GRID_ATLAS.html','utf8'),script=fs.readFileSync('./a0-grid-atlas.js','utf8');
const old=JSON.parse(html.match(/id="ghostTileFixtures">([\s\S]*?)<\/script>/)[1]);assert.equal(old.root5.values.length,25);assert.equal(old.root7.values.length,42);assert.equal(old.systemx.values.length,15);assert.ok(script.includes('ghostFixtures.tesa28=window.A0TesaGridCandidate.fixture'));
assert.ok(html.indexOf('src="assets/a0-tesa-grid-candidate.js"')<html.indexOf('src="a0-grid-atlas.js'));
// Execute the real existing Ghost-Tile block together with the candidate lens.
const actualIds=[...ids,'ghostGrid','ghostFieldSize','ghostViewport','ghostColor','ghostAperture','ghostNp','ghostRr','ghostPlay','ghostFollowTile','ghostPhase','ghostLegend','ghostMeta','ghostOut','ghostTileFixtures'];
const actual=Object.fromEntries(actualIds.map(id=>[id,new El()]));actual.ghostTileFixtures.textContent=JSON.stringify(old);
Object.entries({ghostPreset:'root7',ghostFieldSize:'100',ghostViewport:'7',ghostColor:'source',ghostAperture:'open',ghostNp:'0',ghostRr:'0',tesaStretch:'1',tesaEcho:'.5',tesaFps:'30'}).forEach(([id,value])=>actual[id].value=value);
const realWindow={A0TesaGridCandidate:model,clearInterval(){},setInterval(){return 1;}},realContext=vm.createContext({window:realWindow,$:id=>actual[id],mod:(a,b)=>((a%b)+b)%b,TAU:2*Math.PI,tilePhase:0,document:{getElementById:id=>actual[id],createElement:()=>new El(),createElementNS:()=>new El(),addEventListener(){}},Event:class{constructor(type){this.type=type;}}});
vm.runInContext('(()=>{'+script.slice(script.indexOf("  const ghost = $('ghostGrid')")),realContext);
assert.equal(actual.ghostGrid.children.length,42);
vm.runInContext(fs.readFileSync('./a0-tesa-grid-candidate.js','utf8'),realContext);actual.tesaEnter.fire('click');
assert.equal(actual.ghostGrid.children.length,28);assert.equal(realWindow.A0GhostTiles.fixtures.tesa28.values.length,28);assert.equal(realWindow.A0GhostTiles.selection.value,17);assert.equal(actual.ghostGrid.children[16].style.gridRow,'3');assert.equal(actual.ghostGrid.children[16].style.gridColumn,'3');assert.equal(realWindow.A0GhostTiles.selectValue(29),false);
actual.tesaMirror.checked=true;actual.tesaMirror.fire('change');assert.equal(actual.ghostGrid.children[16].style.gridRow,'2');assert.equal(actual.ghostGrid.children[26].style.gridRow,'1');
actual.tesaStretch.value='2';actual.tesaStretch.fire('change');assert.equal(actual.ghostGrid.style.aspectRatio,'14/4');assert.equal(realWindow.A0TesaGridLens.snapshot().recoveredAddress,17);
actual.ghostPreset.value='root5';actual.ghostPreset.fire('change');assert.equal(actual.ghostGrid.children.length,25);assert.equal(actual.tesaCandidate.hidden,true);assert.equal(actual.ghostGrid.style.gridTemplateRows,'');
console.log('PASS: 224 mirror/stretch/echo cases, all 28 addresses, sparse anchors 17/27, four reference FPS rates, separate marker 29, candidate UI controls and retained existing fixtures');
