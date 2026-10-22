/* Standalone copy of the Atlas spatial reader, 2026-10-21. Source stays unchanged; copied snapshot is explicit. */
(function(root){
  'use strict';
  const stopIds=['zeta','theta','beta'], symbols=['ζ','θ','β'];
  const colors={exact:'#69d39a',empirical:'#efbd55',method:'#54d7ef',open:'#ed7777',negative:'#b78aef'};
  function position(family,index,layer,layout){
    const a=index*Math.PI*2/7-Math.PI/2;
    if(layout==='plate')return[(family.x-490)/260,(layer-1)*.85,(family.y-280)/210];
    const r=layout==='polar'?.65+layer*.56:['bluebody','dodeca'].includes(layout)?2.12:1.6;
    return[Math.cos(a)*r,layout==='polar'?0:(layer-1)*1.05,Math.sin(a)*r];
  }
  function project(p,camera,width,height){
    const [x,y,z]=p.map((v,i)=>v-(camera.target?.[i]||0)),cy=Math.cos(camera.yaw),sy=Math.sin(camera.yaw),cp=Math.cos(camera.pitch),sp=Math.sin(camera.pitch);
    const rx=x*cy-z*sy,rz=x*sy+z*cy,ry=y*cp-rz*sp,depth=y*sp+rz*cp;
    const scale=Math.min(width,height)*.30*camera.zoom/(1-depth/8);
    return{x:width/2+(camera.frameOffset?.[0]||0)*width+rx*scale,y:height/2+(camera.frameOffset?.[1]||0)*height-ry*scale,z:depth,scale};
  }
  function createTrail(initial){
    let entries=[JSON.parse(JSON.stringify(initial))],cursor=0;
    const copy=x=>JSON.parse(JSON.stringify(x));
    return{
      push(state){if(JSON.stringify(entries[cursor])===JSON.stringify(state))return;entries=entries.slice(0,cursor+1);entries.push(copy(state));cursor++},
      move(delta){cursor=Math.max(0,Math.min(entries.length-1,cursor+delta));return copy(entries[cursor])},
      home(){cursor=0;return copy(entries[0])},
      get current(){return copy(entries[cursor])},get cursor(){return cursor},get length(){return entries.length}
    };
  }
  function readingJourney(id,from,to){
    const a=stopIds.indexOf(from),b=stopIds.indexOf(to);
    if(!/^F[1-7]$/.test(id)||a<0||b<0||a===b)return null;
    const path=[];for(let i=a;;i+=Math.sign(b-a)){path.push(stopIds[i]);if(i===b)break}
    return{kind:'READING_POSITION_TRANSITION',family:id,from,to,path,retained:['Family-ID','Raumform','Relationsstatus'],changed:['Leseposition','Atlas-Modus → Elevator','Kamerafokus'],canonicalRelation:false};
  }
  function segmentDistance(x,y,a,b){
    const dx=b.x-a.x,dy=b.y-a.y,length=dx*dx+dy*dy,t=length?Math.max(0,Math.min(1,((x-a.x)*dx+(y-a.y)*dy)/length)):0;
    return Math.hypot(x-a.x-t*dx,y-a.y-t*dy);
  }
  const sideForYaw=yaw=>Math.cos(yaw+.35)>=0?'a':'b';
  const viewForCamera=camera=>camera.pitch>=1.03?'overview':sideForYaw(camera.yaw)==='a'?'front':'back';
  const mix=(a,b,t)=>a.map((x,i)=>x+(b[i]-x)*t);
  // Exhibition transforms only: uniform scale/rotation/placement, never source geometry edits.
  function exhibitPoint(p,room){
    const [scale,y,yaw]=room==='polar'?[.36,.48,Math.PI/7]:room==='plate'?[.5,0,Math.PI/4]:[.72,0,0];
    return[scale*(p[0]*Math.cos(yaw)-p[2]*Math.sin(yaw)),p[1]*scale+y,scale*(p[0]*Math.sin(yaw)+p[2]*Math.cos(yaw))];
  }
  function scaffold(room){
    const lines=[],add=(a,b)=>lines.push([a,b]);
    if(room==='polar'){
      for(let i=0;i<12;i++){const a=i*Math.PI/6;add([0,0,0],[Math.cos(a)*1.95,0,Math.sin(a)*1.95]);}
      add([0,-.35,0],[0,.95,0]);
    }else if(room==='plate'){
      for(const y of [-.85,0,.85])for(let i=-4;i<=4;i++){const v=i*.45;add([-1.8,y,v],[1.8,y,v]);add([v,y,-1.8],[v,y,1.8]);}
      add([0,-1.2,0],[0,1.2,0]);
    }else{
      for(let i=0;i<8;i++){const a=i*Math.PI/4,x=Math.cos(a)*1.85,z=Math.sin(a)*1.85;add([x,-1.05,z],[x,1.05,z]);}
      for(let i=-4;i<=4;i++){const v=i*.5;add([-2,-1.28,v],[2,-1.28,v]);add([v,-1.28,-2],[v,-1.28,2]);}
      add([0,-1.4,0],[0,1.4,0]);
    }
    return lines;
  }
  function cameraBetween(a,b,t){return{yaw:a.yaw+(b.yaw-a.yaw)*t,pitch:a.pitch+(b.pitch-a.pitch)*t,zoom:a.zoom+(b.zoom-a.zoom)*t,target:mix(a.target||[0,0,0],b.target||[0,0,0],t),...(a.frameOffset||b.frameOffset?{frameOffset:mix(a.frameOffset||[0,0],b.frameOffset||[0,0],t)}:{})};}
  function readingHead(landings,from,to,progress){
    const position=from+(to-from)*Math.max(0,Math.min(1,progress)),lower=Math.min(1,Math.floor(position));
    return mix(landings[lower],landings[lower+1],position-lower);
  }
  function fitCamera(points,camera,width,height){
    if(!points.length)return{...camera};
    const padding={left:width<600?34:44,right:width<600?66:185,top:50,bottom:62};
    const xs=[],ys=[];
    for(const p of points){
      const q=project(p,{...camera,zoom:1,frameOffset:[0,0]},width,height);xs.push(q.x-width/2);ys.push(q.y-height/2);
    }
    const minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);
    const zoom=Math.max(.02,Math.min(1.8,(width-padding.left-padding.right)/Math.max(1,maxX-minX),(height-padding.top-padding.bottom)/Math.max(1,maxY-minY))*.96);
    return{...camera,zoom,frameOffset:[((padding.left-padding.right)/2-(minX+maxX)/2*zoom)/width,((padding.top-padding.bottom)/2-(minY+maxY)/2*zoom)/height]};
  }
  const api={position,project,createTrail,readingJourney,segmentDistance,sideForYaw,viewForCamera,cameraBetween,mix,exhibitPoint,scaffold,readingHead,fitCamera};
  root.A0SpatialReaderPrimitives={project,createTrail};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  if(!root.document)return;
  const bridge=root.A0FamilyAtlasBridge,mount=document.getElementById('familySpatialMount');
  if(!bridge||!mount)return;
  const source=bridge.snapshot(),ids=Object.keys(source.families);
  const bodies={bluebody:root.A0FamilySpatialBodies?.build('bluebody'),dodeca:root.A0FamilySpatialBodies?.build('dodeca')};
  let atlas=source,layout='cylinder',camera={yaw:-.35,pitch:.38,zoom:1,target:[0,0,0]},hits=[],edgeHits=[],drag=null,restoring=false,motion=null,motionToken=0;
  let exhibit='none',triangle=false;
  let width=800,height=530,autoFrame=true,frameInitialized=false;
  const family=()=>atlas.family||(atlas.mode==='elevator'?atlas.elevatorFamily:null);
  const bodyKey=()=>exhibit==='none'?(bodies[layout]?layout:null):exhibit;
  const capture=()=>({family:atlas.family,route:atlas.route,stage:atlas.stage,mode:atlas.mode,stop:atlas.stop,elevatorFamily:atlas.elevatorFamily,selectedEdge:atlas.selectedEdge||null,layout,exhibit,autoFrame,camera:{...camera,target:[...(camera.target||[0,0,0])],...(camera.frameOffset?{frameOffset:[...camera.frameOffset]}:{})} });
  let trail=createTrail(capture());
  function framingPoints(room=layout){
    const points=scaffold(room).flat();
    for(let l=0;l<3;l++){
      ids.forEach(id=>{const p=position(source.families[id],ids.indexOf(id),l,room);points.push(p,[2.35,p[1]+.12,1.25],[2.02,p[1]+.18,p[2]*.45]);});
      for(let i=0;i<=96;i++)points.push(ringPoint(l,i,room));
    }
    // Reserve a sphere for every decorative body pose: no fit pumping on stage pulses.
    if(bodies[bodyKey()]){
      const center=exhibitPoint([0,0,0],room),edge=exhibitPoint([1.29,0,0],room),r=Math.hypot(...edge.map((x,i)=>x-center[i]));
      for(const x of [-r,r])for(const y of [-r,r])for(const z of [-r,r])points.push([center[0]+x,center[1]+y,center[2]+z]);
    }
    return points;
  }
  function applyFit(){if(autoFrame){const points=framingPoints();if(motion&&motion.fromLayout!==layout)points.push(...framingPoints(motion.fromLayout));camera=fitCamera(points,camera,width,height);}}
  function overview(resetPerspective=true){autoFrame=true;fly({...camera,...(resetPerspective?{yaw:-.35,pitch:1.15}:{}),target:[0,0,0]},layout,true);}
  mount.innerHTML='<div class="spatial-toolbar demo-navigation"><details class="club-tool" data-club-tool="room" name="club-main-tools"><summary><span>Raum</span><small data-club-current="room">Zylinder</small></summary><fieldset class="demo-room-control"><legend>01 · Raum wählen</legend><div class="demo-room-buttons" data-control="rooms" role="group" aria-label="Raumform wählen"></div><label hidden>Raumform <select data-control="layout"><option value="cylinder">Zylinder · drei Ebenen</option><option value="polar">Polar · drei Ringe</option><option value="plate">Platte · Atlas-Koordinaten</option></select></label><small>Eine Maschine · verschiedene räumliche Anordnungen.</small></fieldset></details><details class="club-tool" data-club-tool="view" name="club-main-tools"><summary><span>Blick</span><small data-club-current="view">Seite A</small></summary><fieldset><legend>02 · Blick wechseln</legend><div class="demo-control-row"><button data-action="front">Seite A · vorne</button><button data-action="back">Seite B · hinten</button></div><small>Zwei Kamerablicke auf dieselbe Karte.</small></fieldset><details class="club-zoom"><summary>Zoom fein einstellen</summary><button data-action="zoomOut" aria-label="Verkleinern">−</button><button data-action="zoomIn" aria-label="Vergrößern">+</button></details></details><details id="clubLights" class="club-tool" data-club-tool="light" name="club-main-tools"><summary><span>Licht &amp; Bühne</span><small data-club-current="light">Farbraum</small></summary><fieldset class="jukebox-light-control"><legend>03 · Licht &amp; Bühne</legend><div data-control="lights" class="demo-control-row" role="group" aria-label="Raumbeleuchtung"></div><small data-readout="lightStatus">Beleuchtung lädt.</small></fieldset></details><button class="club-bench-button" type="button" data-club-bench aria-controls="clubBenchPanel" aria-expanded="false">Club Bench öffnen <small>Families · Joints · Details</small></button></div><nav class="jukebox-orientation" aria-label="Orientierung im gemeinsamen Raum"><strong>EIN RAUM · DREI LESEEBENEN</strong><a href="#jukeboxGLB">3D / GLB-Fenster ↓</a><div class="jukebox-mini" data-control="landmarks"></div><output data-readout="orientation" aria-live="polite"></output></nav><div class="spatial-body"><div class="spatial-viewport"><div class="jukebox-light-arrows" aria-hidden="true"><span>‹</span><span>›</span></div><canvas tabindex="0" aria-label="Drehbare Family-Karte. Pfeiltasten drehen, Plus und Minus zoomen. Family-Auswahl auch in der Liste daneben."></canvas><div class="spatial-overlay">DRAG TO ORBIT · KNOTEN WÄHLEN<br>Durchgezogen: exakt / empirisch · gestrichelt: Methode / offen / negativ</div></div><aside id="clubBenchPanel" hidden><div class="kicker">DU BIST HIER</div><output data-readout="where" aria-live="polite"></output><div data-club-selection></div><details class="club-family-picker"><summary>Family wählen · F1–F7</summary><div data-readout="families" class="spatial-family-list"></div></details><div data-readout="stops" class="spatial-stops"></div><p data-readout="question"></p><details class="jukebox-mode-panel"><summary>Lesemodus &amp; Fokus</summary><label>Was möchtest du lesen?<select data-control="mode"><option value="family">Family · zugehörige Anschlüsse</option><option value="joint">Joints · alle Verbindungen</option><option value="elevator">Elevator · Ebenenwege</option></select></label><small data-readout="modeHelp"></small><button class="jukebox-focus" data-action="focus">Zur gewählten Family fahren</button><button class="jukebox-focus" data-action="overview">Gesamte Maschine sehen</button></details><div data-club-legend></div><a href="../A0_FAMILY_CONNECTION_ATLAS.html#map">Auswahl im 2D-Atlas lesen ↑</a><div class="demo-joint-mini" data-readout="joint"></div><a href="#jointExplanation">Joint-Erklärung und Zeichenlegende ↓</a><details><summary>Verbindungen dieser Auswahl</summary><div data-readout="edges" class="spatial-edges"></div></details></aside></div><div class="spatial-return"><button data-action="previous">← Zurück</button><button data-action="next">Vorwärts →</button><button data-action="home">Zum Einstieg ↺</button><output data-readout="trail" aria-live="polite"></output></div><details class="club-session-notes"><summary>Lesespur &amp; Grenzen</summary><div data-club-notes><p class="spatial-note">Lesespur nur für diese Sitzung. Ein neuer Schritt nach Zurück ersetzt den Vorwärtszweig. Ansichtswechsel erhalten IDs und Relationsstatus; die Bildschirmprojektion ist nicht invertierbar.</p></div></details>';
  const $=s=>mount.querySelector(s),out=id=>$('[data-readout="'+id+'"]'),canvas=$('canvas'),ctx=canvas.getContext('2d');
  root.A0FamilyNavigatorDemo?.dockJointPanel(document,mount);
  for(const [value,label] of [['bluebody','Blue Body · Quellkörper'],['dodeca','Dodeca · Rot/Grün']])if(bodies[value]){const option=document.createElement('option');option.value=value;option.textContent=label;$('[data-control="layout"]').append(option)}
  const roomButtons=$('[data-control="rooms"]');
  if(roomButtons)for(const option of $('[data-control="layout"]').options){
    const button=document.createElement('button');button.type='button';button.dataset.room=option.value;
    button.textContent=option.textContent;button.onclick=()=>changeLayout(option.value);
    if(bodies[option.value])button.hidden=true;
    roomButtons.append(button);
  }
  const guide=document.createElement('p');guide.className='spatial-note';guide.textContent='Bedienhilfe F4–F7: F4 Phase/Blick → Orbit und Rückseite · F5 Connectivity → Verbindungen lesen · F6 Control → Elevator-Stop wählen · F7 Validation → Return prüfen. Lokale Leserführung, keine neue Family-Zuordnung.';mount.append(guide);
  const bodyNote=document.createElement('p');bodyNote.className='spatial-note';mount.append(bodyNote);
  const returnNote=document.createElement('output');returnNote.className='spatial-note';returnNote.setAttribute('aria-live','polite');mount.append(returnNote);
  const relationPanel=document.createElement('section');relationPanel.className='spatial-relations';relationPanel.setAttribute('aria-label','Relations und Lesepositionswechsel');
  const relationTitle=document.createElement('strong');relationTitle.textContent='3 LESEEBENEN · JEWEILS F1–F7';
  const relationStatus=document.createElement('output');relationStatus.setAttribute('aria-live','polite');
  const relationLegend=document.createElement('p');relationLegend.textContent='ζ Quelle · θ Ansicht · β Grenze: Auf jeder Ebene stehen dieselben sieben Families. Elevator = weißer Weg einer gewählten Family zwischen den Ebenen. Joints = farbige Beziehungen zwischen Families auf der gewählten Ebene. Keine drei Raumachsen und keine Zuordnung zu Single / EP / LP.';
  const tripReturn=document.createElement('button');tripReturn.type='button';tripReturn.textContent='↩ Zum Ausgang des Übergangs';tripReturn.disabled=true;
  const tripCancel=document.createElement('button');tripCancel.type='button';tripCancel.textContent='Fahrt abbrechen';tripCancel.disabled=true;
  relationPanel.append(relationTitle,relationStatus,tripReturn,tripCancel,relationLegend);
  const bodyElement=$('.spatial-body');if(bodyElement)bodyElement.before(relationPanel);else mount.append(relationPanel);
  let transit=null,travelToken=0,tripAnchor=null,shafts=[],relationMessage='';
  const reducedMotion=root.matchMedia?.('(prefers-reduced-motion: reduce)').matches??true;
  let guideHeld=false,guideAlpha=0,guideTimer=null,guideToken=0,lastViewYaw=camera.yaw,lastViewSide=sideForYaw(camera.yaw),lastPerspective=viewForCamera(camera);
  function clearGuide(){guideToken++;if(guideTimer!==null)root.clearTimeout?.(guideTimer);guideTimer=null;guideAlpha=0;}
  function previewGuide(){
    clearGuide();guideAlpha=1;
    if(!root.setTimeout)return;
    const token=guideToken;
    guideTimer=root.setTimeout(()=>{
      guideTimer=null;if(token!==guideToken||guideHeld)return;
      if(reducedMotion){guideAlpha=0;draw();return;}
      let start=null;
      const fade=now=>{if(token!==guideToken||guideHeld||document.hidden)return;if(start===null)start=now;guideAlpha=Math.max(0,1-(now-start)/500);draw();if(guideAlpha>0)root.requestAnimationFrame(fade);};
      root.requestAnimationFrame(fade);
    },2750);
  }
  function setGuideHeld(value){guideHeld=!!value;clearGuide();draw();root.A0ClubUX?.refresh();return guideHeld;}
  function pointAt(id,layer){const end=position(source.families[id],ids.indexOf(id),layer,layout);return motion?mix(motion.points[layer][ids.indexOf(id)],end,motion.progress):end;}
  function ringPoint(layer,i,room=layout){
    const a=i/96*Math.PI*2,r=room==='polar'?.65+layer*.56:bodies[room]?2.3:1.85;
    return[Math.cos(a)*r,room==='polar'?0:(layer-1)*1.05,Math.sin(a)*r];
  }
  function ringAt(layer,i){const end=ringPoint(layer,i);return motion?mix(motion.rings[layer][i],end,motion.progress):end;}
  function cancelMotion(settle=true){
    motionToken++;if(motion&&settle)camera=motion.toCamera;motion=null;
  }
  function fly(toCamera,toLayout=layout,keepTravel=false){
    const points=stopIds.map((_,l)=>ids.map(id=>pointAt(id,l))),rings=stopIds.map((_,l)=>Array.from({length:97},(_,i)=>ringAt(l,i))),fromCamera={...camera,target:[...(camera.target||[0,0,0])]},fromLayout=layout;
    cancelMotion(false);if(!keepTravel)cancelTravel();layout=toLayout;
    if(reducedMotion){camera=toCamera;record();return;}
    motion={points,rings,fromCamera,toCamera,fromLayout,progress:0};const token=motionToken;let start=null;readout();
    function frame(now){
      if(token!==motionToken||!motion)return;if(start===null)start=now;
      const t=Math.min(1,(now-start)/750);motion.progress=t*t*(3-2*t);camera=cameraBetween(fromCamera,toCamera,motion.progress);draw();
      if(t===1){camera=toCamera;motion=null;record();}else root.requestAnimationFrame(frame);
    }
    root.requestAnimationFrame(frame);
  }
  function changeLayout(to){if(!['cylinder','polar','plate','bluebody','dodeca'].includes(to)||['bluebody','dodeca'].includes(to)&&!bodies[to])return false;autoFrame=true;previewGuide();fly({...camera,target:[0,0,0]},to,true);return true;}
  function focusFamily(){if(family())overview(false);}
  function focusLayer(){overview(false);}
  const landmarks=$('[data-control="landmarks"]');
  if(landmarks){
    const whole=document.createElement('button');whole.type='button';whole.textContent='◎ Gesamt';whole.onclick=overview;landmarks.append(whole);
    stopIds.forEach((stop,i)=>{const button=document.createElement('button');button.type='button';button.textContent=symbols[i]+' · '+['Quelle','Ansicht','Grenze'][i];button.dataset.stop=stop;button.onclick=()=>{if(stop===atlas.stop)focusLayer();else travel(stop)};landmarks.append(button)});
  }
  function cancelTravel(){if(transit){relationMessage='Übergang abgebrochen · Ausgang bleibt erhalten; kein Ziel übernommen.';relationStatus.textContent=relationMessage;tripAnchor=null;tripReturn.disabled=true}travelToken++;transit=null}
  tripCancel.onclick=()=>{cancelTravel();readout();draw()};
  if(!ctx){out('where').textContent='Canvas nicht verfügbar. Bitte den bestehenden 2D-Atlas verwenden.';return}
  function select(id,stop=atlas.stop){if(stop!==atlas.stop){if(family()!==id)select(id);travel(stop);return}cancelMotion();cancelTravel();root.A0Sync?.pause();bridge.apply({...capture(),family:id,stage:null,stop,mode:atlas.mode==='sync'?'family':atlas.mode});receive();focusFamily()}
  ids.forEach(id=>{const button=document.createElement('button');button.textContent=id+' · '+source.families[id].name;button.onclick=()=>select(id);out('families').append(button)});
  stopIds.forEach((stop,i)=>{const button=document.createElement('button');button.textContent=symbols[i]+' · '+['Quelle','Ansicht','Grenze'][i];button.onclick=()=>travel(stop);out('stops').append(button)});
  function travel(to){
    const route=readingJourney(family(),atlas.stop,to);if(!route)return false;
    cancelMotion();cancelTravel();root.A0Sync?.pause();tripAnchor=capture();tripReturn.disabled=true;
    transit={route,progress:0};const token=travelToken;
    relationStatus.textContent=route.path.map(stop=>route.family+'@'+symbols[stopIds.indexOf(stop)]).join(' → ')+' · unterwegs';
    readout();
    function arrive(){
      if(token!==travelToken)return;transit=null;
      bridge.apply({...capture(),family:route.family,stage:null,stop:to,mode:'elevator'});receive();
      relationMessage=route.family+'@'+symbols[stopIds.indexOf(route.from)]+' → '+route.family+'@'+symbols[stopIds.indexOf(to)]+' · ANGEKOMMEN. Erhalten: '+route.retained.join(', ')+'. Geändert: Leseposition und Elevator-Lesemodus. Keine neue Family-Kante.';relationStatus.textContent=relationMessage;
      tripReturn.disabled=false;
      focusLayer();
    }
    if(reducedMotion){arrive();return true}
    let start=null;
    function frame(now){if(token!==travelToken)return;if(start===null)start=now;transit.progress=Math.min(1,(now-start)/(650*(route.path.length-1)));draw();if(transit.progress===1)arrive();else root.requestAnimationFrame(frame)}
    root.requestAnimationFrame(frame);return true;
  }
  tripReturn.onclick=()=>{if(!tripAnchor)return;const expected=tripAnchor;restore(expected);record();relationMessage=JSON.stringify(capture())===JSON.stringify(expected)?'RETURN PASS · Ausgang des Lesepositionswechsels vollständig wiederhergestellt. Nur Leserzustand geprüft.':'RETURN DIFFERENCE · Ausgang prüfen.';relationStatus.textContent=relationMessage;tripReturn.disabled=true;tripAnchor=null};
  // One retained Family, three reading plates. Local navigation, not a deck-state handoff.
  const pickupPanel=document.createElement('section');pickupPanel.className='club-pickup-console';pickupPanel.setAttribute('aria-label','Tonarm · Family und Leseplatte');
  const pickupTitle=document.createElement('strong');pickupTitle.textContent='● NAVIGATION · FOLGE DEM GELBEN PUNKT';
  const pickupFamilies=document.createElement('div');pickupFamilies.className='club-pickup-families';pickupFamilies.setAttribute('role','group');pickupFamilies.setAttribute('aria-label','Family für den Lesekopf wählen');
  ids.forEach(id=>{const button=document.createElement('button');button.type='button';button.textContent=id;button.title=source.families[id].name;button.onclick=()=>select(id);pickupFamilies.append(button);});
  const pickupPlates=document.createElement('div');pickupPlates.className='club-pickup-plates';pickupPlates.setAttribute('role','group');pickupPlates.setAttribute('aria-label','Leseplatte anfahren');
  stopIds.forEach((stop,i)=>{const button=document.createElement('button');button.type='button';button.textContent=symbols[i]+' · '+['Quelle','Ansicht','Grenze'][i];button.onclick=()=>{if(stop===atlas.stop)focusLayer();else travel(stop)};pickupPlates.append(button);});
  const pickupStatus=document.createElement('output');pickupStatus.setAttribute('role','status');
  const pickupNote=document.createElement('small');pickupNote.textContent='Family festhalten → Leseplatte wählen → hier ablesen. Elevator = Tonarmweg; farbige Joints bleiben Family-Beziehungen. Kein Q4-/P0–P2-Handoff.';
  pickupPanel.append(pickupTitle,pickupFamilies,pickupPlates,pickupStatus,pickupNote);
  if(bodyElement)bodyElement.after(pickupPanel);else mount.append(pickupPanel);
  function pickup(){
    const id=family(),index=stopIds.indexOf(atlas.stop),route=transit?.route;
    const text=!id?'Family wählen':route?id+' · '+symbols[stopIds.indexOf(route.from)]+' → '+symbols[stopIds.indexOf(route.to)]+' · Ziel noch nicht übernommen':id+'@'+symbols[index]+' · '+['Quelle','Ansicht','Grenze'][index];
    if(pickupStatus.textContent!==text)pickupStatus.textContent=text;
    for(const [i,button]of [...pickupFamilies.children].entries())button.setAttribute('aria-pressed',String(ids[i]===id));
    for(const [i,button]of [...pickupPlates.children].entries()){
      button.setAttribute('aria-pressed',String(!transit&&i===index));button.setAttribute('data-pickup-target',String(!!route&&stopIds[i]===route.to));button.disabled=!id||!!transit;
    }
  }
  function readout(){
    mount.setAttribute('data-room',layout);
    mount.setAttribute('aria-busy',String(!!motion));
    const orientation=out('orientation');if(orientation)orientation.textContent=layout+' · Blick '+sideForYaw(camera.yaw).toUpperCase()+' · '+(motion?'Kamerafahrt / Umordnung':Math.hypot(...(camera.target||[0,0,0]))<.05&&camera.zoom<=1.01?'Gesamtansicht':'Detailblick')+' · Ebene '+symbols[stopIds.indexOf(atlas.stop)]+' ausgewählt';
    if(landmarks)for(const button of landmarks.children)button.setAttribute('aria-pressed',String(button.dataset.stop===atlas.stop));
    const modeHelp=out('modeHelp');if(modeHelp)modeHelp.textContent=atlas.mode==='joint'?'Alle Joints der aktiven Ebene sind sichtbar. Kante oder Verbindungsliste anklicken.':atlas.mode==='elevator'?'Die sieben Ebenenwege werden betont. Weißen Weg oder ζ / θ / β wählen.':'Die Anschlüsse der gewählten Family werden betont. Ein Klick fährt die Kamera zur Family.';
    const edgesDetails=out('edges').parentElement;if(edgesDetails)edgesDetails.open=atlas.mode==='joint';
    if(roomButtons)for(const button of roomButtons.children)button.setAttribute('aria-pressed',String(button.dataset.room===layout));
    const near=(a,b)=>Math.abs(Math.atan2(Math.sin(a-b),Math.cos(a-b)))<.08;
    $('[data-action="front"]').setAttribute('aria-pressed',String(near(camera.yaw,-.35)&&Math.abs(camera.pitch-.38)<.08));
    $('[data-action="back"]').setAttribute('aria-pressed',String(near(camera.yaw,Math.PI-.35)&&Math.abs(camera.pitch-.38)<.08));
    tripCancel.disabled=!transit;
    const id=family(),symbol=symbols[stopIds.indexOf(atlas.stop)],name=id?source.families[id].name:'Gesamtkarte';
    out('where').textContent=(id||'ALLE')+' · '+name+' / '+symbol+' / '+atlas.mode.toUpperCase();
    out('question').textContent=id?source.families[id].question:'Wähle eine Family. Dieselben IDs und Quellen bleiben im Atlas adressierbar.';
    out('joint').textContent=atlas.selectedEdge?source.edges[atlas.selectedEdge].label+' · '+source.edges[atlas.selectedEdge].status+' · Erklärung darunter.':'Klicke eine farbige Kante für ihre Joint-Erklärung.';
    [...out('families').children].forEach((b,i)=>b.setAttribute('aria-pressed',String(ids[i]===id)));
    [...out('stops').children].forEach((b,i)=>{b.setAttribute('aria-pressed',String(stopIds[i]===atlas.stop));b.disabled=!id||stopIds[i]===atlas.stop;b.title=id?id+'@'+symbol+' → '+id+'@'+symbols[i]:'Zuerst eine Family wählen'});
    if(!transit)relationStatus.textContent=relationMessage||(id?id+'@'+symbol+' · Halte die Family fest und wähle ζ, θ oder β. Weiße Verbindungen im Raum sind ebenfalls auswählbar.':'Wähle zuerst eine Family: dann wird ihr Weg zwischen den drei Lesepositionen sichtbar.');
    $('[data-control="layout"]').value=layout;$('[data-control="mode"]').value=atlas.mode;
    bodyNote.textContent=bodies[layout]?bodies[layout].title+' · '+bodies[layout].vertices.length+' Vertices / '+bodies[layout].edges.length+' Kanten / '+bodies[layout].faces.length+' Flächen. Quellgeometrie aus dem vorhandenen Countershot, einheitlich skaliert. Family-Marker liegen auf separaten Leser-Ringen: keine native Face-Zuordnung. Rot/Grün ist eine deklarierte Gegenflächen-Palette, keine Rekonstruktion der Ebenenszene.':'Platte, Polar und Zylinder: deklarierte Atlas-Layouts. Family-IDs und Relationsstatus bleiben erhalten.';
    if(exhibit!=='none')bodyNote.textContent=bodies[exhibit].title+' · Exponat im Raum '+layout+'. Quellgeometrie unverändert; Family-Marker bleiben auf ihren eigenen Leser-Ringen. Keine Flächenzuordnung oder neue Relation.';
    out('edges').replaceChildren();
    Object.entries(source.edges).filter(([,e])=>!id||e.a===id||e.b===id).forEach(([key,e])=>{
      const button=document.createElement('button'),pair=document.createElement('strong'),label=document.createElement('small'),status=document.createElement('span');
      pair.textContent=e.a+' → '+e.b;label.textContent=e.label;status.textContent=e.status;status.className='club-edge-status';
      button.append(pair,label,status);button.title=e.a+' → '+e.b+' · '+e.label+' · '+e.status;button.setAttribute('aria-label',button.title);
      button.style.borderColor=colors[e.status];button.setAttribute('aria-pressed',String(key===atlas.selectedEdge));button.onclick=()=>{bridge.selectEdge(key);receive()};out('edges').append(button);
    });
    out('trail').textContent='LESESPUR '+(trail.cursor+1)+' / '+trail.length+' · Blick und Auswahl, keine Weltzeit';
    $('[data-action="previous"]').disabled=trail.cursor===0;$('[data-action="next"]').disabled=trail.cursor===trail.length-1;
    root.A0ClubUX?.refresh();
    root.A0ClubTours?.refresh();
    pickup();
  }
  function record(){applyFit();if(!restoring)trail.push(capture());readout();draw()}
  function receive(){const next=bridge.snapshot();if(motion)cancelMotion();if(transit&&JSON.stringify(next)!==JSON.stringify(atlas)){cancelTravel();relationMessage='Übergang abgebrochen · externe Atlas-Auswahl hat Vorrang.'}atlas=next;record()}
  function restore(state){cancelMotion();cancelTravel();restoring=true;autoFrame=state.autoFrame!==false;layout=state.layout;exhibit=bodies[state.exhibit]?state.exhibit:'none';camera={...state.camera,target:[...(state.camera.target||[0,0,0])],...(state.camera.frameOffset?{frameOffset:[...state.camera.frameOffset]}:{})};root.A0Sync?.pause();bridge.apply(state);atlas=bridge.snapshot();restoring=false;readout();draw()}
  function draw(){
    applyFit();
    const viewSide=sideForYaw(camera.yaw),perspective=viewForCamera(camera),delta=camera.yaw-lastViewYaw;
    mount.setAttribute('data-side',viewSide);
    mount.setAttribute('data-perspective',perspective);
    if(Math.abs(delta)>.0001)mount.setAttribute('data-turn-direction',delta>0?'right':'left');
    if(perspective!==lastPerspective){mount.setAttribute('data-view-arrival',perspective==='overview'?'overview':viewSide);root.A0ClubUX?.refresh();}
    const overviewButton=$('[data-club-overview]');if(overviewButton)overviewButton.setAttribute('aria-pressed',String(perspective==='overview'));
    for(const [action,side,angle]of [['front','a',-.35],['back','b',Math.PI-.35]]){
      const button=$('[data-action="'+action+'"]'),distance=Math.atan2(Math.sin(angle-camera.yaw),Math.cos(angle-camera.yaw));
      button.setAttribute('aria-pressed',String(perspective===action));
      button.setAttribute('data-turn-to',Math.abs(distance)<.08?'here':distance>0?'right':'left');
      button.title=(side==='a'?'Vorderseite A':'Rückseite B')+' · '+(Math.abs(distance)<.08?'hier':distance>0?'nach rechts drehen':'nach links drehen');
    }
    const viewFeedback=$('[data-view-feedback]');
    if(viewFeedback&&(viewSide!==lastViewSide||Math.abs(delta)>.0001))viewFeedback.textContent=(delta>0?'→ Rechts':delta<0?'← Links':'Blick')+' · Seite '+viewSide.toUpperCase()+' · Kamera dreht, Raum bleibt';
    lastViewYaw=camera.yaw;lastViewSide=viewSide;lastPerspective=perspective;
    ctx.clearRect(0,0,width,height);hits=[];edgeHits=[];shafts=[];
    const active=stopIds.indexOf(atlas.stop),current=family();
    pickup();
    function line(a,b,color,dash=[],alpha=1,strokeWidth=1.3){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle=color;ctx.globalAlpha=alpha;ctx.setLineDash(dash);ctx.lineWidth=strokeWidth;ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1}
    const guideOpacity=guideHeld?1:guideAlpha;
    if(guideOpacity>0){
      scaffold(layout).forEach(([a,b])=>line(project(a,camera,width,height),project(b,camera,width,height),'#7997a5',[],guideOpacity*.28,.9));
      const label=project([0,layout==='polar'?.95:1.4,0],camera,width,height);ctx.fillStyle='#96acb7';ctx.globalAlpha=guideOpacity;ctx.font='10px ui-monospace,monospace';ctx.fillText('ORIENTIERUNG · keine Relation',label.x+8,label.y);ctx.globalAlpha=1;
    }
    const body=bodies[bodyKey()];
    function drawBody(shape,room,opacity){
      if(!shape||opacity<=0)return;
      const pose=root.A0JukeboxStage?.pose(),points=shape.vertices.map(p=>{
        const q=pose?root.A0JukeboxStage.transform(p,pose):p,end=exhibitPoint(q,layout),placed=motion?mix(exhibitPoint(q,motion.fromLayout),end,motion.progress):end;
        return project(placed,camera,width,height);
      });
      [...shape.faces].map(face=>({face,depth:face.vertices.reduce((sum,i)=>sum+points[i].z,0)/face.vertices.length})).sort((a,b)=>a.depth-b.depth).forEach(({face})=>{
        ctx.beginPath();face.vertices.forEach((i,j)=>j?ctx.lineTo(points[i].x,points[i].y):ctx.moveTo(points[i].x,points[i].y));ctx.closePath();ctx.fillStyle=face.color;ctx.globalAlpha=.18*opacity;ctx.fill();ctx.globalAlpha=1;
      });
      shape.edges.forEach(([a,b])=>line(points[a],points[b],room==='bluebody'?'#54d7ef':'#d6e5df',[],.65*opacity));
    }
    if(exhibit==='none'&&motion&&motion.fromLayout!==layout){drawBody(bodies[motion.fromLayout],motion.fromLayout,1-motion.progress);drawBody(body,bodyKey(),motion.progress);}
    else drawBody(body,bodyKey(),1);
    if(current){
      const landings=stopIds.map((_,layer)=>project(pointAt(current,layer),camera,width,height));
      for(let i=0;i<2;i++){
        const a=landings[i],b=landings[i+1],length=Math.hypot(b.x-a.x,b.y-a.y)||1,offset={x:-(b.y-a.y)/length*3,y:(b.x-a.x)/length*3};
        line({x:a.x+offset.x,y:a.y+offset.y},{x:b.x+offset.x,y:b.y+offset.y},'#e9f2f5',[],.75);
        line({x:a.x-offset.x,y:a.y-offset.y},{x:b.x-offset.x,y:b.y-offset.y},'#e9f2f5',[],.75);
        shafts.push({a,b,from:stopIds[i],to:stopIds[i+1]});
      }
    }
    if(atlas.mode==='elevator')ids.filter(id=>id!==current).forEach(id=>{
      for(let l=0;l<2;l++)line(project(pointAt(id,l),camera,width,height),project(pointAt(id,l+1),camera,width,height),'#d4e3e8',[],.4);
    });
    // Context rings are reading positions, not new graph edges or time generations.
    stopIds.forEach((stop,layer)=>{
      const loop=Array.from({length:97},(_,i)=>project(ringAt(layer,i),camera,width,height));
      for(let i=1;i<loop.length;i++)line(loop[i-1],loop[i],layer===active?'#436579':'#233b4a',[],layer===active?.8:.45);
      const label=loop[24];ctx.fillStyle=layer===active?'#efbd55':'#96acb7';ctx.font='13px ui-monospace,monospace';ctx.fillText(width<600?symbols[layer]:symbols[layer]+' · '+['Quelle','Ansicht','Grenze'][layer]+' · F1–F7',label.x+10,label.y);
      const points=Object.fromEntries(ids.map(id=>[id,project(pointAt(id,layer),camera,width,height)]));
      if(layer===active)Object.entries(source.edges).forEach(([key,e])=>{const start=points[e.a],end=points[e.b],paired=Object.values(source.edges).some(other=>other.a===e.b&&other.b===e.a),length=Math.hypot(end.x-start.x,end.y-start.y)||1,ox=paired?-(end.y-start.y)/length*6:0,oy=paired?(end.x-start.x)/length*6:0,a={x:start.x+ox,y:start.y+oy},b={x:end.x+ox,y:end.y+oy},color=colors[e.status]||'#96acb7',dash=e.status==='open'?[2,6]:e.status==='negative'?[10,4,2,4]:e.status==='method'?[7,5]:[];line(a,b,color,dash,atlas.mode==='joint'||!current||e.a===current||e.b===current?.85:.12,key===atlas.selectedEdge?3.6:1.3);edgeHits.push({key,a,b});
        const t=.62,x=a.x+(b.x-a.x)*t,y=a.y+(b.y-a.y)*t,angle=Math.atan2(b.y-a.y,b.x-a.x);line({x:x-7*Math.cos(angle-.5),y:y-7*Math.sin(angle-.5)},{x,y},color,[],.8);line({x:x-7*Math.cos(angle+.5),y:y-7*Math.sin(angle+.5)},{x,y},color,[],.8)
      });
      if(triangle&&layer===active)for(const key of ['e12','e13','e23']){
        const edge=source.edges[key];if(edge)line(points[edge.a],points[edge.b],colors[edge.status],[],.95,3.5);
      }
      ids.forEach(id=>hits.push({...points[id],id,stop,active:layer===active,selected:id===current&&layer===active}));
    });
    hits.sort((a,b)=>a.z-b.z).forEach(p=>{
      const radius=p.selected?18:p.active?14:10;
      ctx.globalAlpha=p.active?1:.48;ctx.beginPath();ctx.arc(p.x,p.y,radius,0,Math.PI*2);ctx.fillStyle=p.selected?'#efbd55':'#102a3a';ctx.fill();ctx.strokeStyle=p.selected?'#efbd55':Math.cos(camera.yaw)<0?'#ef6d9c':'#54d7ef';ctx.lineWidth=p.selected?3:1.5;ctx.stroke();
      ctx.fillStyle=p.selected?'#06121b':'#e9f2f5';ctx.font=(p.selected?'bold ':'')+'12px ui-monospace,monospace';ctx.textAlign='center';ctx.fillText(p.id,p.x,p.y+4);ctx.textAlign='left';ctx.globalAlpha=1;
      if(p.id===current){ctx.fillStyle='#e9f2f5';ctx.font='11px ui-monospace,monospace';ctx.fillText(p.id+'@'+symbols[stopIds.indexOf(p.stop)],p.x+20,p.y-6)}
      if(triangle&&p.active&&['F1','F2','F3'].includes(p.id)){ctx.beginPath();ctx.arc(p.x,p.y,radius+5,0,Math.PI*2);ctx.strokeStyle='#c5d8de';ctx.lineWidth=1;ctx.stroke();}
    });
    if(current){
      const r=transit?.route,landings=stopIds.map((_,layer)=>pointAt(current,layer));
      const head=readingHead(landings,r?stopIds.indexOf(r.from):active,r?stopIds.indexOf(r.to):active,transit?.progress||0);
      const tip=project(head,camera,width,height),pivot=project([2.35,head[1]+.12,1.25],camera,width,height),elbow=project([2.02,head[1]+.18,head[2]*.45],camera,width,height);
      // Neutral mechanical overlay, not a typed Family relation and not a hit target.
      line(pivot,elbow,'#06151e',[],.85,7);line(elbow,tip,'#06151e',[],.85,7);
      line(pivot,elbow,'#c5d8de',[],.9,3);line(elbow,tip,'#c5d8de',[],.9,3);
      ctx.beginPath();ctx.arc(pivot.x,pivot.y,6,0,Math.PI*2);ctx.fillStyle='#c5d8de';ctx.fill();
      ctx.beginPath();ctx.arc(tip.x,tip.y,23,0,Math.PI*2);ctx.strokeStyle='#efbd55';ctx.lineWidth=2;ctx.stroke();
      ctx.fillStyle='#ffffff';ctx.shadowColor='#efbd55';ctx.shadowBlur=transit?14:5;ctx.fillRect(tip.x-4,tip.y-4,8,8);ctx.shadowBlur=0;
      ctx.font='bold 11px ui-monospace,monospace';ctx.fillStyle='#efbd55';ctx.fillText(width<600?current+'@'+(transit?'→':symbols[active]):'TONARM · '+current+(transit?' · unterwegs':'@'+symbols[active]),elbow.x+8,elbow.y-12);
    }
  }
  function resize(){const box=canvas.getBoundingClientRect();if(box.width<1||box.height<1)return;const ratio=Math.min(root.devicePixelRatio||1,2);width=box.width;height=box.height;canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);ctx.setTransform(ratio,0,0,ratio,0,0);applyFit();if(!frameInitialized){trail=createTrail(capture());frameInitialized=true;}draw()}
  function viewChange(){cancelMotion();cancelTravel();record()}
  $('[data-control="layout"]').onchange=e=>changeLayout(e.target.value);
  $('[data-control="mode"]').onchange=e=>{root.A0Sync?.pause();bridge.apply({...capture(),mode:e.target.value});receive()};
  const zoom=delta=>{autoFrame=false;camera.zoom=Math.max(.08,Math.min(2.5,camera.zoom+delta))};
  mount.querySelectorAll('[data-action]').forEach(b=>b.onclick=()=>{
    const action=b.dataset.action;
    if(action==='overview'){overview();return}
    if(action==='focus'){focusFamily();return}
    if(action==='previous'||action==='next'){restore(trail.move(action==='previous'?-1:1));return}
    if(action==='home'){const expected=trail.home();restore(expected);returnNote.textContent=JSON.stringify(capture())===JSON.stringify(expected)?'F7 · RETURN PASS · Auswahl, Stop, Modus, Raumform und Kamera stimmen mit dem Einstieg überein. Nur Leserzustand geprüft.':'F7 · RETURN DIFFERENCE · Leserzustand prüfen.';return}
    if(action==='front'||action==='back'){autoFrame=true;const angle=action==='front'?-.35:Math.PI-.35;fly({...camera,target:[0,0,0],yaw:camera.yaw+Math.atan2(Math.sin(angle-camera.yaw),Math.cos(angle-camera.yaw)),pitch:.38},layout,true);return}
    if(action==='zoomIn')zoom(.1);if(action==='zoomOut')zoom(-.1);viewChange();
  });
  canvas.onpointerdown=e=>{cancelMotion();if(transit)cancelTravel();drag={x:e.clientX,y:e.clientY,originX:e.clientX,originY:e.clientY,moved:false};canvas.setPointerCapture(e.pointerId)};
  canvas.onpointermove=e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag.moved=drag.moved||Math.hypot(e.clientX-drag.originX,e.clientY-drag.originY)>5;camera.yaw+=dx*.008;camera.pitch=Math.max(-1.3,Math.min(1.3,camera.pitch+dy*.008));drag.x=e.clientX;drag.y=e.clientY;draw()};
  canvas.onpointerup=e=>{if(!drag)return;const moved=drag.moved;drag=null;if(moved){record();return}const box=canvas.getBoundingClientRect(),x=e.clientX-box.left,y=e.clientY-box.top,p=[...hits].reverse().find(p=>Math.hypot(x-p.x,y-p.y)<22);if(p){select(p.id,p.stop);return}const shaft=shafts.find(s=>segmentDistance(x,y,s.a,s.b)<10);if(shaft){travel(atlas.stop===shaft.to?shaft.from:shaft.to);return}const edge=edgeHits.map(e=>({...e,distance:segmentDistance(x,y,e.a,e.b)})).filter(e=>e.distance<9).sort((a,b)=>a.distance-b.distance)[0];if(edge){bridge.selectEdge(edge.key);receive()}};
  canvas.onpointercancel=()=>{drag=null;record()};
  canvas.onkeydown=e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-'].includes(e.key))return;e.preventDefault();cancelMotion();cancelTravel();if(e.key==='ArrowLeft')camera.yaw-=.15;if(e.key==='ArrowRight')camera.yaw+=.15;if(e.key==='ArrowUp')camera.pitch=Math.min(1.3,camera.pitch+.1);if(e.key==='ArrowDown')camera.pitch=Math.max(-1.3,camera.pitch-.1);if(e.key==='+')zoom(.1);if(e.key==='-')zoom(-.1);record()};
  document.addEventListener('a0:family-atlas-selection',receive);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){clearGuide();cancelMotion();cancelTravel();readout();draw()}});
  root.addEventListener('pagehide',clearGuide);
  root.addEventListener('resize',resize);resize();readout();
  if(root.ResizeObserver){const observer=new root.ResizeObserver(resize);observer.observe(canvas);root.addEventListener('pagehide',()=>observer.disconnect());}
  function scene(){
    if(motion||transit)throw Error('Bitte das Ende der Kamerafahrt oder des Ebenenwechsels abwarten.');
    const nodes=[],lines=[];
    for(let l=0;l<3;l++){
      ids.forEach(id=>nodes.push({id:id+'@'+symbols[l],position:pointAt(id,l),color:id===family()?'#efbd55':'#54d7ef',extras:{family:id,reading_position:stopIds[l],label:source.families[id].name}}));
      const ring=[];for(let i=1;i<=96;i++)ring.push(ringPoint(l,i-1),ringPoint(l,i));
      lines.push({id:'reading-ring-'+stopIds[l],points:ring,color:'#436579',extras:{kind:'layout-guide',not_a_relation:true}});
      Object.entries(source.edges).forEach(([key,e])=>{
        let a=pointAt(e.a,l),b=pointAt(e.b,l);
        const length=Math.hypot(...a.map((x,i)=>b[i]-x))||1,dx=b[0]-a[0],dz=b[2]-a[2],flat=Math.hypot(dx,dz)||1;
        const paired=Object.values(source.edges).some(other=>other.a===e.b&&other.b===e.a),offset=paired?[-dz/flat*.025,0,dx/flat*.025]:[0,0,0];
        a=a.map((v,i)=>v+offset[i]);b=b.map((v,i)=>v+offset[i]);
        const points=[],parts=['method','negative','open'].includes(e.status)?20:1;
        for(let s=0;s<parts;s++){if(parts>1&&s%2)continue;points.push(mix(a,b,s/parts),mix(a,b,(s+1)/parts));}
        const tip=mix(a,b,.65),tail=mix(a,b,.65-.09/length),wing=[-dz/flat*.035,0,dx/flat*.035];
        points.push(tail.map((v,i)=>v+wing[i]),tip,tail.map((v,i)=>v-wing[i]),tip);
        lines.push({id:key+'@'+stopIds[l],points,color:colors[e.status],extras:{source_record:key,from:e.a,to:e.b,status:e.status,label:e.label,reading_position:stopIds[l],canonical_relation_created:false}});
      });
    }
    ids.forEach(id=>{for(let l=0;l<2;l++)lines.push({id:'elevator-'+id+'-'+l,points:[pointAt(id,l),pointAt(id,l+1)],color:'#d4e3e8',extras:{kind:'same-family-reading-path',family:id,from:stopIds[l],to:stopIds[l+1],not_a_family_relation:true}})});
    const body=bodies[bodyKey()];if(body)lines.push({id:body.title,points:body.edges.flatMap(([a,b])=>[exhibitPoint(body.vertices[a],layout),exhibitPoint(body.vertices[b],layout)]),color:'#a6bcca',extras:{kind:'source-body-landmark',family_face_mapping:false,display_preset:layout,uniform_exhibition_transform:true}});
    return{nodes,lines,extras:{scope:'derived-atlas-navigation-view',layout,selectedFamily:family(),selectedStop:atlas.stop,source:'A0_FAMILY_CONNECTION_ATLAS.html',source_sha256:root.A0FamilyNavigatorDemoData?.meta.sha256||null,canonicalFamilies:7,readingPositions:3,sourceRelations:15,engine_state_transfer:false,decorative_stage_animation_exported:false}};
  }
  root.A0FamilySpatialReader={selectFamily(id){if(!source.families[id])return false;select(id);return true;},setTriangle(value){if(value&&!['e12','e13','e23'].every(key=>source.edges[key]))return false;triangle=!!value;draw();return triangle;},triangle:()=>triangle,setGuideHeld,guide:()=>({held:guideHeld,alpha:guideHeld?1:guideAlpha}),setExhibit(value){if(value!=='none'&&!bodies[value])return false;cancelMotion();cancelTravel();autoFrame=true;exhibit=value;camera.target=[0,0,0];record();return true;},snapshot:()=>capture(),trail,resize,redraw:draw,travel,cancelTravel,scene,changeLayout,focusFamily,overview,motion:()=>motion?{progress:motion.progress,layout}:null,journey:()=>transit?JSON.parse(JSON.stringify(transit)):null,resume(state){
    if(!state?.camera||!Number.isFinite(state.camera.zoom)||state.camera.zoom<.02||state.camera.zoom>2.5)return false;
    if(state?.camera?.frameOffset&&(!Array.isArray(state.camera.frameOffset)||state.camera.frameOffset.length!==2||!state.camera.frameOffset.every(x=>Number.isFinite(x)&&Math.abs(x)<2)))return false;
    if(state?.camera?.target&&(!Array.isArray(state.camera.target)||state.camera.target.length!==3||!state.camera.target.every(x=>Number.isFinite(x)&&Math.abs(x)<10)))return false;
    // Reuse the legacy semantic gate, but validate this draft's wider fit zoom locally.
    const semanticState={...state,camera:{...state.camera,zoom:Math.max(.55,Math.min(1.7,state.camera.zoom))}};
    if(!root.A0ScienceBuilderPath?.validReader(semanticState)||!source.routes[state.route]||state.family&&!source.families[state.family]||!source.families[state.elevatorFamily]||['bluebody','dodeca'].includes(state.layout)&&!bodies[state.layout])return false;
    restore(JSON.parse(JSON.stringify(state)));record();return true;
  }};
  if(root.location.hash==='#spatial-navigation'){root.A0Sync?.pause();requestAnimationFrame(()=>document.getElementById('spatial-navigation').scrollIntoView({block:'start'}))}
})(typeof window!=='undefined'?window:globalThis);
