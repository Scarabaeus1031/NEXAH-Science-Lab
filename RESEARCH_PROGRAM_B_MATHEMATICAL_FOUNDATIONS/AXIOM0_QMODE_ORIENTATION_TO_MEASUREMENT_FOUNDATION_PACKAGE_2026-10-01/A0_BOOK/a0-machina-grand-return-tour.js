(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.A0MachinaGrandReturnTour=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){'use strict';
const SCENES=Object.freeze([
  {id:'source',label:'SOURCE',title:'Drei Quellen. Ein sichtbarer Anfang.',copy:'Die drei Source Windows bleiben getrennte Körper und beginnen die Tour ohne Identitätsverschmelzung.',formula:'SOURCE₁ ∥ SOURCE₂ ∥ SOURCE₃',left:'SOURCE',core:'3 WINDOWS',right:'BOUND',href:'#benchFoyer',preview:'A0_MACHINA_ANATOMY_MAP.html#mainModules'},
  {id:'blue',label:'BLUE · CARRIER',title:'Der Carrier hält die Adresse.',copy:'Blue Body zeigt Host, Innenregister und Apertur als source-bound Carrier-Ansichten.',formula:'CARRIER → ADDRESS → APERTURE',left:'HOST',core:'BLUE BODY',right:'ADDRESS',href:'A0_TESSAREC_BLUE_BODY_LAB.html#blue-body-interior-crt16',preview:'A0_TESSAREC_BLUE_BODY_LAB.html#blue-body-interior-crt16'},
  {id:'pink',label:'PINK · VIEW ONLY',title:'Das Grid zeigt. Es übernimmt nicht.',copy:'Pink Diamond liest Struktur, Adresse und Projektion; die View wird nicht zum Janus- oder Curtain-Operator.',formula:'GRID = VIEW_ONLY',left:'GRID',core:'PINK DIAMOND',right:'VIEW',href:'A0_PINK_DIAMOND_GRID_ATLAS.html#module-entry',preview:'A0_PINK_DIAMOND_GRID_ATLAS.html#module-entry'},
  {id:'coupling',label:'BLUE × PINK · HANDOFF',title:'Zwei Bodies. Ein typisierter Handoff.',copy:'Die Dodeka-Zelle übergibt Blue-Adresse, Pink-Cut und Return-Witness, ohne die beiden Quellen zu verschmelzen.',formula:'BLUE → CUT → PINK → WITNESS',left:'BLUE',core:'CELL HANDOFF',right:'PINK',href:'A0_BLUE_PINK_DODECA_CELL_RETURN.html#cruiser',preview:'A0_BLUE_PINK_DODECA_CELL_RETURN.html#cruiser'},
  {id:'curtain',label:'CURTAIN · JANUS',title:'Der Curtain liest AM · VM · PM.',copy:'Die bestehende Janus Ladder vergleicht beide Routen und kehrt über REFERENCE → AM → VM → PM → RETURN zurück.',formula:'Jc(SΔ(x)) − SΔ(Jc(x)) = −2Δ',left:'AM · VM · PM',core:'CURTAIN',right:'RETURN',href:'#janusCoordinateAtlas',preview:'../../../SCIENCE_LAB/CASE_STUDIES/NEXAH_ELEVEN_SPACE_JANUS_NUMBER_VIEW_2026-10-06/NEXAH_JANUS_ARITHMETIC_LADDER.html?view=curtain#curtain'},
  {id:'return',label:'HUMAN RETURN · RECEIPT',title:'Der Rest bleibt sichtbar.',copy:'Quelle, View, Handoff, Residuum und Claim Boundary werden als Receipt zurückgegeben; der Mensch entscheidet.',formula:'RECEIPT → ACCEPT / REVISE / STOP',left:'RESIDUAL',core:'HUMAN RETURN',right:'RECEIPT',href:'results/a0-machina-grand-return-tour-2026-11-15.json',preview:'A0_WERKBANK.html#typedReturnAtlas'}
]);
const mod=(n,m)=>((n%m)+m)%m;
const TIMING=Object.freeze({tour:700,module:4200,close:900});
function state(index){const i=mod(index,SCENES.length);return{index:i,scene:SCENES[i],host:'NEXAH_A0_ORIENTATION_CONTROLLER_BENCH',assembly:'THE_MACHINA',newIdentity:false,buildRegisterDelta:0,graph:{nodes:0,relations:0,aliases:0}};}
function step(current,delta=1){return state(current.index+delta);}
function circuit(startIndex=0){const start=state(startIndex);const route=Array.from({length:SCENES.length+1},(_,i)=>state(start.index+i));return{route,sceneIds:route.map(item=>item.scene.id),exactReturn:route.at(-1).index===start.index};}
function choreography(startIndex=0){const route=[];for(let i=0;i<SCENES.length;i+=1){const scene=state(startIndex+i).scene;route.push({scene:scene.id,phase:'tour',open:false,duration:TIMING.tour},{scene:scene.id,phase:'module',open:true,duration:TIMING.module},{scene:scene.id,phase:'close',open:false,duration:TIMING.close});}route.push({scene:state(startIndex).scene.id,phase:'return',open:false,duration:0});return route;}
function verify(){const cue=choreography(0);const checks=[SCENES.length===6,new Set(SCENES.map(x=>x.id)).size===6,SCENES.every(x=>x.href&&x.preview&&x.formula),SCENES.every(x=>!x.preview.includes('A0_MACHINA_COCKPIT.html')),circuit(0).exactReturn,circuit(3).exactReturn,circuit(0).sceneIds.join('>')==='source>blue>pink>coupling>curtain>return>source',cue.length===19&&cue.filter(x=>x.phase==='module'&&x.open).length===6&&cue.at(-1).phase==='return',state(0).host==='NEXAH_A0_ORIENTATION_CONTROLLER_BENCH',!state(0).newIdentity,state(0).buildRegisterDelta===0];return{pass:checks.every(Boolean),passed:checks.filter(Boolean).length,total:checks.length,scenes:SCENES.length};}
function mount(scope){const host=(scope||document).querySelector('[data-machina-grand-return]');if(!host)return null;let current=state(0),timer=null;const buttons=[...host.querySelectorAll('[data-mgr-scene]')],stage=host.querySelector('[data-mgr-stage]'),status=host.querySelector('[data-mgr-status]'),play=host.querySelector('[data-mgr-play]'),stop=host.querySelector('[data-mgr-stop]'),moduleGate=host.querySelector('[data-mgr-module]'),frame=host.querySelector('[data-mgr-frame]'),moduleState=host.querySelector('[data-mgr-module-state]');
  const fields={index:'[data-mgr-index]',title:'[data-mgr-title]',copy:'[data-mgr-copy]',formula:'[data-mgr-formula]',link:'[data-mgr-link]',left:'[data-mgr-left]',core:'[data-mgr-core]',right:'[data-mgr-right]'};
  function showModule(){const scene=current.scene;if(frame.dataset.scene===scene.id)return;frame.dataset.scene=scene.id;frame.title=`Grand Return Tour · ${scene.label}`;frame.src=scene.preview;moduleState.textContent=`LOADING · ${scene.label}`;}
  function paint(message){const scene=current.scene;buttons.forEach((button,index)=>button.setAttribute('aria-pressed',String(index===current.index)));stage.dataset.scene=scene.id;host.querySelector(fields.index).textContent=`${String(current.index+1).padStart(2,'0')} / 06 · ${scene.label}`;host.querySelector(fields.title).textContent=scene.title;host.querySelector(fields.copy).textContent=scene.copy;host.querySelector(fields.formula).textContent=scene.formula;const link=host.querySelector(fields.link);link.href=scene.href;host.querySelector(fields.left).textContent=scene.left;host.querySelector(fields.core).textContent=scene.core;host.querySelector(fields.right).textContent=scene.right;if(moduleGate.open)showModule();else moduleState.textContent=`CLOSED · ${scene.label} · ready to dip`;status.textContent=message||`SCENE ${current.index+1}/6 · ${scene.id.toUpperCase()} · source-bound`;}
  function pause(message='PAUSED · current scene retained'){if(timer){clearTimeout(timer);timer=null}play.setAttribute('aria-pressed','false');play.textContent='▶ GRAND TOUR';stop.disabled=true;if(message)status.textContent=message;}
  function later(fn,delay){timer=setTimeout(()=>{timer=null;fn();},delay);}
  function run(){pause('');let tick=0;play.setAttribute('aria-pressed','true');play.textContent='■ TOUR LÄUFT';stop.disabled=false;function present(){current=state(tick);moduleGate.open=false;paint(`RUNNING · ${String(tick+1).padStart(2,'0')}/06 · ${current.scene.id.toUpperCase()} · TOUR`);later(()=>{moduleGate.open=true;showModule();status.textContent=`RUNNING · ${String(tick+1).padStart(2,'0')}/06 · ${current.scene.id.toUpperCase()} · MODULE OPEN`;later(()=>{moduleGate.open=false;status.textContent=`RUNNING · ${String(tick+1).padStart(2,'0')}/06 · ${current.scene.id.toUpperCase()} · MODULE CLOSED`;later(()=>{tick+=1;if(tick>=SCENES.length){current=state(0);paint('PASS · SOURCE → BLUE → PINK → HANDOFF → CURTAIN → RETURN → SOURCE');pause('PASS · GRAND RETURN · all module windows closed · exact source state restored');return}present();},TIMING.close);},TIMING.module);},TIMING.tour);}present();}
  moduleGate.addEventListener('toggle',()=>{if(moduleGate.open)showModule();else moduleState.textContent=`CLOSED · ${current.scene.label} · source retained`;});frame.addEventListener('load',()=>{moduleState.textContent=`LIVE · ${current.scene.label} · source-bound module view`;});
  buttons.forEach((button,index)=>button.addEventListener('click',()=>{pause('');current=state(index);paint();}));play.addEventListener('click',()=>timer?pause():run());stop.addEventListener('click',()=>pause());host.querySelector('[data-mgr-next]').addEventListener('click',()=>{pause('');current=step(current);paint();});host.querySelector('[data-mgr-return]').addEventListener('click',()=>{pause('');current=state(0);paint('RETURN · SOURCE · all scene identities preserved');});paint();return{getState:()=>current,run,pause,setScene:index=>{pause('');current=state(index);paint();}};}
// The cylinder keeps the transverse frame. The Möbius strip rotates it
// by half the travel angle, so its orientation changes sign at the seam.
function seamRecord(degrees) {
  const angle = mod(degrees, 360) * Math.PI / 180;
  const tilt = degrees * Math.PI / 360;
  const clean = value => Math.abs(value) < 1e-12 ? 0 : value;
  const place = [Math.cos(angle), Math.sin(angle), 0].map(clean);
  return {
    place,
    laps: Math.floor(degrees / 360),
    mobius: [place[0] * Math.sin(tilt), place[1] * Math.sin(tilt), Math.cos(tilt)].map(clean),
    cylinder: [0, 0, 1],
  };
}

function drawSeam(canvas, kind, record) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const {width, height} = canvas;
  const project = ([x, y, z]) => [
    width / 2 + 101 * (x - y),
    height / 2 + 38 * (x + y) - 105 * z,
  ];
  const across = (place, direction, distance) =>
    place.map((value, index) => value + direction[index] * distance);
  function stroke(points, color, lineWidth, dash = []) {
    ctx.beginPath();
    ctx.moveTo(...points[0]);
    for (const point of points.slice(1)) ctx.lineTo(...point);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.setLineDash(dash);
    ctx.stroke();
  }
  ctx.clearRect(0, 0, width, height);
  const stations = Array.from({length: 73}, (_, index) => seamRecord(index * 5));
  const edge = (station, side) => project(across(station.place, station[kind], side * 0.25));
  for (const side of [-1, 1]) stroke(stations.map(station => edge(station, side)), '#6c9bb3', 1.6);
  for (const station of stations.filter((_, index) => index % 6 === 0)) {
    stroke([edge(station, -1), edge(station, 1)], '#355263', 1);
  }
  stroke(stations.map(station => project(station.place)), '#8eb1be', 1.2, [4, 5]);
  stroke([edge(stations[0], -1), edge(stations[0], 1)], '#e4c77e', 2);

  const marker = project(record.place);
  const tip = project(across(record.place, record[kind], 0.46));
  const heading = Math.atan2(tip[1] - marker[1], tip[0] - marker[0]);
  const wing = angle => [tip[0] - 9 * Math.cos(angle), tip[1] - 9 * Math.sin(angle)];
  const accent = kind === 'mobius' ? '#ffd379' : '#8be5d0';
  stroke([marker, tip], accent, 3);
  stroke([wing(heading - 0.58), tip, wing(heading + 0.58)], accent, 3);
  ctx.beginPath();
  ctx.arc(...marker, 4, 0, Math.PI * 2);
  ctx.fillStyle = '#f5f8f9';
  ctx.fill();
}

function mountSeam(panel) {
  if (!panel) return;
  const angle = panel.querySelector('[data-seam-angle]');
  const angleValue = panel.querySelector('[data-seam-angle-value]');
  const status = panel.querySelector('[data-seam-result]');
  const buttons = [...panel.querySelectorAll('[data-seam-turn]')];
  const views = [...panel.querySelectorAll('[data-seam-view]')].map(view => ({
    kind: view.dataset.seamView,
    canvas: view.querySelector('canvas'),
    place: view.querySelector('[data-seam-place]'),
    laps: view.querySelector('[data-seam-laps]'),
    direction: view.querySelector('[data-seam-direction]'),
  }));
  const format = new Intl.NumberFormat('de-DE', {maximumFractionDigits: 3});
  const vector = values => '(' + values.map(value => format.format(value)).join(' / ') + ')';
  function render(degrees) {
    angle.value = String(degrees);
    angleValue.textContent = degrees + '°';
    const record = seamRecord(degrees);
    for (const view of views) {
      view.place.textContent = vector(record.place);
      view.laps.textContent = record.laps;
      view.direction.textContent = vector(record[view.kind]);
      drawSeam(view.canvas, view.kind, record);
    }
    for (const button of buttons) {
      button.setAttribute('aria-pressed', String(Number(button.dataset.seamTurn) === degrees));
    }
    if (degrees === 0) status.textContent = 'Start · Gleicher Ort, gleicher Querpfeil.';
    else if (degrees === 360) status.textContent = '1 Runde · Beide am Startort. Der Möbius-Pfeil ist umgekehrt.';
    else if (degrees === 720) status.textContent = '2 Runden · Beide am Startort. Beide Pfeile zeigen wieder wie am Start.';
    else status.textContent = 'Unterwegs · Der Record zeigt Ort und Richtung am gewählten Winkel.';
  }
  angle.addEventListener('input', () => render(Number(angle.value)));
  for (const button of buttons) button.addEventListener('click', () => render(Number(button.dataset.seamTurn)));
  const win = panel.ownerDocument.defaultView;
  const openByHash = () => {
    if (win.location.hash === '#' + panel.id) panel.open = true;
  };
  win.addEventListener('hashchange', openByHash);
  openByHash();
  render(Number(angle.value));
}

if(typeof document!=='undefined'){
  const boot=()=>{mount(document);mountSeam(document.querySelector('[data-mgr-seam]'));};
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',boot,{once:true}):boot();
}
 return{SCENES,TIMING,state,step,circuit,choreography,verify,mount,seamRecord};
});
