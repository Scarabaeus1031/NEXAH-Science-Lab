const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const model=require('./a0-register-overlay.js'),tesa=require('./assets/a0-tesa-grid-candidate.js'),bridge=require('./a0-root-room-bridge.js');
for(const mode of model.modes)for(const effect of model.effects)for(let i=0;i<400;i++){
  const p=model.pose(i*.07,{mode,effect});assert.deepEqual(p.zone,model.zone);
  for(const layer of p.layers){assert.equal(layer.cells.length,mode==='tesa'?28:8);assert.equal(new Set(layer.cells.map(c=>c.id)).size,layer.cells.length);assert.ok(Math.abs(layer.dx)<=22&&Math.abs(layer.dy)<=1.5);assert.ok(layer.opacity>=.35&&layer.opacity<=.65);
    for(const cell of layer.cells){assert.equal(cell.displayed.x,cell.x+layer.dx);assert.equal(cell.displayed.y,cell.y+layer.dy);if(mode==='tesa'){assert.equal(cell.row,tesa.cell(cell.address).row);assert.equal(cell.col,tesa.cell(cell.address).col);}if(cell.zoneIntersection){const a=cell.zoneIntersection;assert.ok(a.width>0&&a.height>0&&a.x>=p.zone.x&&a.x+a.width<=p.zone.x+p.zone.width+1e-10);}}
  }
}
assert.equal(model.cells('eight','A').length+model.cells('eight','B').length,16);
assert.ok(model.cells('eight','A').every(c=>c.y===132));assert.ok(model.cells('eight','B').every(c=>c.y===276));
assert.throws(()=>model.pose(-1));assert.throws(()=>model.pose(0,{mode:'60'}));assert.throws(()=>model.pose(0,{effect:'strobe'}));
assert.equal(model.intersect({x:0,y:0,width:1,height:1},{x:1,y:0,width:1,height:1}),null);
assert.deepEqual(model.pose(0,{},true).layers,model.pose(99,{},true).layers);
for(const effect of ['still','wobble','opacity']){const p=model.pose(5,{effect});if(effect!=='wobble')assert.ok(p.layers.every(l=>l.dx===0&&l.dy===0));}
assert.ok(Math.abs(model.delta(6.2,.1)-(2*Math.PI-6.1))<1e-12);
class El{constructor(value=''){this.value=value;this.children=[];this.attrs={};this.events={};}addEventListener(n,f){this.events[n]=f;}fire(n){this.events[n]?.();}setAttribute(k,v){this.attrs[k]=v;}appendChild(e){this.children.push(e);}replaceChildren(){this.children=[];}}
const els=Object.fromEntries(['registerOverlay','registerOverlaySvg','registerMode','registerEffect','registerHold','registerStatus','registerRecord','registerRecordDetails'].map(id=>[id,new El()]));els.registerMode.value='tesa';els.registerEffect.value='combined';
let clock=0,playing=true,rootHeld,stops=0;const media={matches:false,addEventListener(n,f){this.change=f;}},events={};
const state={ratio:'3:2',phaseDegrees:90};const view={get state(){return{...state,playing};},get snapshot(){return{clock,signals:[.2,.4,.6]};},setPlaying(v){playing=v;},refresh(){emit();}};
const win={A0RegisterOverlayModel:model,A0ThreeLissajousPlanesView:view,matchMedia:()=>media,addEventListener(n,f){events[n]=f;},A0EnjoyLoop:{stop(){stops++;playing=false;}},A0RootRoomPhaseBridge:{select(id){assert.equal(id,'RETURN');rootHeld=bridge.makeReturn({c:[0,0],iterations:60},view.state,view.snapshot,null,null,null,null,null,null,win.A0RegisterOverlay.snapshot);}}};
function emit(){events['a0-lissajous-frame']?.({detail:view.snapshot});}
const code=fs.readFileSync('./a0-register-overlay.js','utf8');assert.ok(!/requestAnimationFrame\(|setInterval\(|setTimeout\(/.test(code));
vm.runInNewContext(code,{window:win,document:{getElementById:id=>els[id],createElementNS:(_,tag)=>Object.assign(new El(),{tag})}});
const role=name=>els.registerOverlaySvg.children.filter(e=>e.attrs['data-role']===name);
assert.equal(role('register-reference').length,28);assert.equal(role('register-cell').length,56);assert.equal(role('external-29').length,1);
const refs=JSON.stringify(role('register-reference').map(e=>e.attrs));clock=1;emit();assert.equal(JSON.stringify(role('register-reference').map(e=>e.attrs)),refs);
const before=JSON.stringify(state);win.A0RegisterOverlay.configure('eight','drift');assert.equal(role('register-reference').length,16);assert.equal(role('register-cell').length,16);assert.equal(role('external-29').length,0);assert.equal(JSON.stringify(state),before);
const paused=JSON.stringify(win.A0RegisterOverlay.snapshot.pose);playing=false;emit();emit();assert.equal(JSON.stringify(win.A0RegisterOverlay.snapshot.pose),paused);
clock=6.2;emit();const t=win.A0RegisterOverlay.snapshot.pose.time;clock=.1;emit();assert.ok(win.A0RegisterOverlay.snapshot.pose.time>t);
els.registerHold.fire('click');assert.equal(stops,1);assert.equal(playing,false);assert.equal(els.registerRecordDetails.open,true);assert.equal(rootHeld.registerOverlay.pose.mode,'eight');
const frozen=JSON.stringify(win.A0RegisterOverlay.held);win.A0RegisterOverlay.configure('tesa','combined');assert.equal(JSON.stringify(win.A0RegisterOverlay.held),frozen);assert.equal(rootHeld.registerOverlay.pose.mode,'eight');
media.matches=true;media.change();const reduced=JSON.stringify(win.A0RegisterOverlay.snapshot.pose.layers);clock=.3;emit();assert.equal(JSON.stringify(win.A0RegisterOverlay.snapshot.pose.layers),reduced);
assert.ok(els.registerOverlaySvg.children.every(e=>Object.values(e.attrs).every(v=>!String(v).includes('NaN'))));
assert.equal(rootHeld.registerOverlay.pose.layers[0].cells.length,8);
console.log('PASS: 4000 poses, fixture address preservation, separate 8+8 registers, immutable reference, bounded motion/opacity, zone intersections, clock unwrap/pause, reduced motion, held clone and Root Return; no timer');
if(process.argv.includes('--preview')){
  const sharp=require(require.resolve('sharp',{paths:[process.env.A0_RUNTIME_MODULES]}));
  const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
  media.matches=false;
  (async()=>{for(const mode of ['tesa','eight']){win.A0RegisterOverlay.configure(mode,'combined');const nodes=els.registerOverlaySvg.children.map(e=>`<${e.tag} ${Object.entries(e.attrs).map(([k,v])=>`${k}="${escape(v)}"`).join(' ')}>${escape(e.textContent??'')}</${e.tag}>`).join('');await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="504" viewBox="0 0 900 420" font-family="monospace">${nodes}</svg>`)).png().toFile(`/private/tmp/a0-register-${mode}.png`);}})().catch(e=>{console.error(e);process.exitCode=1;});
}
