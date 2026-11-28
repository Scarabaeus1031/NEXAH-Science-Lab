/* Spatial reader of the existing Atlas; no duplicate Family registry or simulation. */
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
    const [x,y,z]=p,cy=Math.cos(camera.yaw),sy=Math.sin(camera.yaw),cp=Math.cos(camera.pitch),sp=Math.sin(camera.pitch);
    const rx=x*cy-z*sy,rz=x*sy+z*cy,ry=y*cp-rz*sp,depth=y*sp+rz*cp;
    const scale=Math.min(width,height)*.30*camera.zoom/(1-depth/8);
    return{x:width/2+rx*scale,y:height/2-ry*scale,z:depth,scale};
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
    return{kind:'READING_POSITION_TRANSITION',family:id,from,to,path,retained:['Family-ID','Raumform','Kamera','Relationsstatus'],changed:['Leseposition','Atlas-Modus → Elevator'],canonicalRelation:false};
  }
  function segmentDistance(x,y,a,b){
    const dx=b.x-a.x,dy=b.y-a.y,length=dx*dx+dy*dy,t=length?Math.max(0,Math.min(1,((x-a.x)*dx+(y-a.y)*dy)/length)):0;
    return Math.hypot(x-a.x-t*dx,y-a.y-t*dy);
  }
  const api={position,project,createTrail,readingJourney,segmentDistance};
  root.A0SpatialReaderPrimitives={project,createTrail};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  if(!root.document)return;
  const bridge=root.A0FamilyAtlasBridge,mount=document.getElementById('familySpatialMount');
  if(!bridge||!mount)return;
  const source=bridge.snapshot(),ids=Object.keys(source.families);
  const bodies={bluebody:root.A0FamilySpatialBodies?.build('bluebody'),dodeca:root.A0FamilySpatialBodies?.build('dodeca')};
  let atlas=source,layout='cylinder',camera={yaw:-.35,pitch:.38,zoom:1},hits=[],drag=null,restoring=false;
  const family=()=>atlas.family||(atlas.mode==='elevator'?atlas.elevatorFamily:null);
  const capture=()=>({family:atlas.family,route:atlas.route,stage:atlas.stage,mode:atlas.mode,stop:atlas.stop,elevatorFamily:atlas.elevatorFamily,layout,camera:{...camera}});
  const trail=createTrail(capture());
  mount.innerHTML='<div class="spatial-toolbar"><label>Raumform <select data-control="layout"><option value="cylinder">Zylinder · drei Ebenen</option><option value="polar">Polar · drei Ringe</option><option value="plate">Platte · Atlas-Koordinaten</option></select></label><label>Atlas-Modus <select data-control="mode"><option value="sync">S · Synchro</option><option value="family">F · Family</option><option value="sequence">T · Zeit</option><option value="joint">J · Fuge</option><option value="elevator">E · Elevator</option><option value="tessarec">Q · Tessarec</option></select></label><button data-action="front">Vorderseite</button><button data-action="back">Rückseite</button><button data-action="zoomOut" aria-label="Verkleinern">−</button><button data-action="zoomIn" aria-label="Vergrößern">+</button></div><div class="spatial-body"><div class="spatial-viewport"><canvas tabindex="0" aria-label="Drehbare Family-Karte. Pfeiltasten drehen, Plus und Minus zoomen. Family-Auswahl auch in der Liste daneben."></canvas><div class="spatial-overlay">DRAG TO ORBIT · KNOTEN WÄHLEN<br>Durchgezogen: exakt / empirisch · gestrichelt: Methode / offen / negativ</div></div><aside><div class="kicker">DU BIST HIER</div><output data-readout="where" aria-live="polite"></output><div data-readout="families" class="spatial-family-list"></div><div data-readout="stops" class="spatial-stops"></div><p data-readout="question"></p><a href="#map">Auswahl im 2D-Atlas lesen ↑</a><details><summary>Verbindungen dieser Auswahl</summary><div data-readout="edges" class="spatial-edges"></div></details></aside></div><div class="spatial-return"><button data-action="previous">← Zurück</button><button data-action="next">Vorwärts →</button><button data-action="home">Zum Einstieg ↺</button><output data-readout="trail" aria-live="polite"></output></div><p class="spatial-note">Lesespur nur für diese Sitzung. Ein neuer Schritt nach Zurück ersetzt den Vorwärtszweig. Ansichtswechsel erhalten IDs und Relationsstatus; die Bildschirmprojektion ist nicht invertierbar.</p>';
  const $=s=>mount.querySelector(s),out=id=>$('[data-readout="'+id+'"]'),canvas=$('canvas'),ctx=canvas.getContext('2d');
  for(const [value,label] of [['bluebody','Blue Body · Quellkörper'],['dodeca','Dodeca · Rot/Grün']])if(bodies[value]){const option=document.createElement('option');option.value=value;option.textContent=label;$('[data-control="layout"]').append(option)}
  const guide=document.createElement('p');guide.className='spatial-note';guide.textContent='Bedienhilfe F4–F7: F4 Phase/Blick → Orbit und Rückseite · F5 Connectivity → Verbindungen lesen · F6 Control → Elevator-Stop wählen · F7 Validation → Return prüfen. Lokale Leserführung, keine neue Family-Zuordnung.';mount.append(guide);
  const bodyNote=document.createElement('p');bodyNote.className='spatial-note';mount.append(bodyNote);
  const returnNote=document.createElement('output');returnNote.className='spatial-note';returnNote.setAttribute('aria-live','polite');mount.append(returnNote);
  const relationPanel=document.createElement('section');relationPanel.className='spatial-relations';relationPanel.setAttribute('aria-label','Relations und Lesepositionswechsel');
  const relationTitle=document.createElement('strong');relationTitle.textContent='RELATIONS · ZAUBERFLÖTE';
  const relationStatus=document.createElement('output');relationStatus.setAttribute('aria-live','polite');
  const relationLegend=document.createElement('p');relationLegend.textContent='Weiße Doppellinien: dieselbe Family zwischen ζ / θ / β. Farbige Pfeile: bestehende Family-Relationen mit eigenem Status. Ein blasser Marker ist dieselbe Adresse an einer anderen Leseposition, keine zusätzliche Family oder Generation.';
  const tripReturn=document.createElement('button');tripReturn.type='button';tripReturn.textContent='↩ Zum Ausgang des Übergangs';tripReturn.disabled=true;
  const tripCancel=document.createElement('button');tripCancel.type='button';tripCancel.textContent='Fahrt abbrechen';tripCancel.disabled=true;
  relationPanel.append(relationTitle,relationStatus,tripReturn,tripCancel,relationLegend);
  const bodyElement=$('.spatial-body');if(bodyElement)bodyElement.before(relationPanel);else mount.append(relationPanel);
  let transit=null,travelToken=0,tripAnchor=null,shafts=[],relationMessage='';
  const reducedMotion=root.matchMedia?.('(prefers-reduced-motion: reduce)').matches??true;
  function cancelTravel(){if(transit){relationMessage='Übergang abgebrochen · Ausgang bleibt erhalten; kein Ziel übernommen.';relationStatus.textContent=relationMessage;tripAnchor=null;tripReturn.disabled=true}travelToken++;transit=null}
  tripCancel.onclick=()=>{cancelTravel();readout();draw()};
  if(!ctx){out('where').textContent='Canvas nicht verfügbar. Bitte den bestehenden 2D-Atlas verwenden.';return}
  let width=800,height=530;
  function select(id,stop=atlas.stop){if(stop!==atlas.stop){if(family()!==id)select(id);travel(stop);return}cancelTravel();root.A0Sync?.pause();bridge.apply({...capture(),family:id,stage:null,stop,mode:atlas.mode==='sync'?'family':atlas.mode});receive()}
  ids.forEach(id=>{const button=document.createElement('button');button.textContent=id+' · '+source.families[id].name;button.onclick=()=>select(id);out('families').append(button)});
  stopIds.forEach((stop,i)=>{const button=document.createElement('button');button.textContent=symbols[i]+' · '+['Source','View','Boundary'][i];button.onclick=()=>travel(stop);out('stops').append(button)});
  function travel(to){
    const route=readingJourney(family(),atlas.stop,to);if(!route)return false;
    cancelTravel();root.A0Sync?.pause();tripAnchor=capture();tripReturn.disabled=true;
    transit={route,progress:0};const token=travelToken;
    relationStatus.textContent=route.path.map(stop=>route.family+'@'+symbols[stopIds.indexOf(stop)]).join(' → ')+' · unterwegs';
    readout();
    function arrive(){
      if(token!==travelToken)return;transit=null;
      bridge.apply({...capture(),family:route.family,stage:null,stop:to,mode:'elevator'});receive();
      relationMessage=route.family+'@'+symbols[stopIds.indexOf(route.from)]+' → '+route.family+'@'+symbols[stopIds.indexOf(to)]+' · ANGEKOMMEN. Erhalten: '+route.retained.join(', ')+'. Geändert: Leseposition und Elevator-Lesemodus. Keine neue Family-Kante.';relationStatus.textContent=relationMessage;
      tripReturn.disabled=false;
    }
    if(reducedMotion){arrive();return true}
    let start=null;
    function frame(now){if(token!==travelToken)return;if(start===null)start=now;transit.progress=Math.min(1,(now-start)/(650*(route.path.length-1)));draw();if(transit.progress===1)arrive();else root.requestAnimationFrame(frame)}
    root.requestAnimationFrame(frame);return true;
  }
  tripReturn.onclick=()=>{if(!tripAnchor)return;const expected=tripAnchor;restore(expected);record();relationMessage=JSON.stringify(capture())===JSON.stringify(expected)?'RETURN PASS · Ausgang des Lesepositionswechsels vollständig wiederhergestellt. Nur Leserzustand geprüft.':'RETURN DIFFERENCE · Ausgang prüfen.';relationStatus.textContent=relationMessage;tripReturn.disabled=true;tripAnchor=null};
  function readout(){
    tripCancel.disabled=!transit;
    const id=family(),symbol=symbols[stopIds.indexOf(atlas.stop)],name=id?source.families[id].name:'Gesamtkarte';
    out('where').textContent=(id||'ALLE')+' · '+name+' / '+symbol+' / '+atlas.mode.toUpperCase();
    out('question').textContent=id?source.families[id].question:'Wähle eine Family. Dieselben IDs und Quellen bleiben im Atlas adressierbar.';
    [...out('families').children].forEach((b,i)=>b.setAttribute('aria-pressed',String(ids[i]===id)));
    [...out('stops').children].forEach((b,i)=>{b.setAttribute('aria-pressed',String(stopIds[i]===atlas.stop));b.disabled=!id||stopIds[i]===atlas.stop;b.title=id?id+'@'+symbol+' → '+id+'@'+symbols[i]:'Zuerst eine Family wählen'});
    if(!transit)relationStatus.textContent=relationMessage||(id?id+'@'+symbol+' · Halte die Family fest und wähle ζ, θ oder β. Weiße Verbindungen im Raum sind ebenfalls auswählbar.':'Wähle zuerst eine Family: dann wird ihr Weg zwischen den drei Lesepositionen sichtbar.');
    $('[data-control="layout"]').value=layout;$('[data-control="mode"]').value=atlas.mode;
    bodyNote.textContent=bodies[layout]?bodies[layout].title+' · '+bodies[layout].vertices.length+' Vertices / '+bodies[layout].edges.length+' Kanten / '+bodies[layout].faces.length+' Flächen. Quellgeometrie aus dem vorhandenen Countershot, einheitlich skaliert. Family-Marker liegen auf separaten Leser-Ringen: keine native Face-Zuordnung. Rot/Grün ist eine deklarierte Gegenflächen-Palette, keine Rekonstruktion der Ebenenszene.':'Platte, Polar und Zylinder: deklarierte Atlas-Layouts. Family-IDs und Relationsstatus bleiben erhalten.';
    out('edges').replaceChildren();
    Object.entries(source.edges).filter(([,e])=>!id||e.a===id||e.b===id).forEach(([key,e])=>{const button=document.createElement('button');button.textContent=e.a+' → '+e.b+' · '+e.label+' · '+e.status;button.style.borderColor=colors[e.status];button.onclick=()=>{bridge.selectEdge(key);receive()};out('edges').append(button)});
    out('trail').textContent='LESESPUR '+(trail.cursor+1)+' / '+trail.length+' · Blick und Auswahl, keine Weltzeit';
    $('[data-action="previous"]').disabled=trail.cursor===0;$('[data-action="next"]').disabled=trail.cursor===trail.length-1;
  }
  function record(){if(!restoring)trail.push(capture());readout();draw()}
  function receive(){const next=bridge.snapshot();if(transit&&JSON.stringify(next)!==JSON.stringify(atlas)){cancelTravel();relationMessage='Übergang abgebrochen · externe Atlas-Auswahl hat Vorrang.'}atlas=next;record()}
  function restore(state){cancelTravel();restoring=true;layout=state.layout;camera={...state.camera};root.A0Sync?.pause();bridge.apply(state);atlas=bridge.snapshot();restoring=false;readout();draw()}
  function draw(){
    ctx.clearRect(0,0,width,height);hits=[];shafts=[];
    const active=stopIds.indexOf(atlas.stop),current=family();
    function line(a,b,color,dash=[],alpha=1){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle=color;ctx.globalAlpha=alpha;ctx.setLineDash(dash);ctx.lineWidth=1.3;ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1}
    const body=bodies[layout];
    if(body){
      const points=body.vertices.map(p=>project(p,camera,width,height));
      [...body.faces].map(face=>({face,depth:face.vertices.reduce((sum,i)=>sum+points[i].z,0)/face.vertices.length})).sort((a,b)=>a.depth-b.depth).forEach(({face})=>{
        ctx.beginPath();face.vertices.forEach((i,j)=>j?ctx.lineTo(points[i].x,points[i].y):ctx.moveTo(points[i].x,points[i].y));ctx.closePath();ctx.fillStyle=face.color;ctx.globalAlpha=.18;ctx.fill();ctx.globalAlpha=1;
      });
      body.edges.forEach(([a,b])=>line(points[a],points[b],layout==='bluebody'?'#54d7ef':'#d6e5df',[],.65));
    }
    if(current){
      const index=ids.indexOf(current),landings=stopIds.map((_,layer)=>project(position(source.families[current],index,layer,layout),camera,width,height));
      for(let i=0;i<2;i++){
        const a=landings[i],b=landings[i+1],length=Math.hypot(b.x-a.x,b.y-a.y)||1,offset={x:-(b.y-a.y)/length*3,y:(b.x-a.x)/length*3};
        line({x:a.x+offset.x,y:a.y+offset.y},{x:b.x+offset.x,y:b.y+offset.y},'#e9f2f5',[],.75);
        line({x:a.x-offset.x,y:a.y-offset.y},{x:b.x-offset.x,y:b.y-offset.y},'#e9f2f5',[],.75);
        shafts.push({a,b,from:stopIds[i],to:stopIds[i+1]});
      }
      if(transit){
        const r=transit.route,progress=stopIds.indexOf(r.from)+(stopIds.indexOf(r.to)-stopIds.indexOf(r.from))*transit.progress,lower=Math.min(1,Math.floor(progress)),mix=progress-lower;
        const a=position(source.families[current],index,lower,layout),b=position(source.families[current],index,lower+1,layout),p=project(a.map((v,i)=>v+(b[i]-v)*mix),camera,width,height);
        ctx.fillStyle='#ffffff';ctx.shadowColor='#efbd55';ctx.shadowBlur=14;ctx.fillRect(p.x-6,p.y-6,12,12);ctx.shadowBlur=0;
      }
    }
    // Context rings are reading positions, not new graph edges or time generations.
    stopIds.forEach((stop,layer)=>{
      const loop=Array.from({length:97},(_,i)=>{const a=i/96*Math.PI*2,r=layout==='polar'?.65+layer*.56:body?2.3:1.85;return project([Math.cos(a)*r,layout==='polar'?0:(layer-1)*1.05,Math.sin(a)*r],camera,width,height)});
      for(let i=1;i<loop.length;i++)line(loop[i-1],loop[i],layer===active?'#436579':'#233b4a',[],layer===active?.8:.45);
      const label=loop[24];ctx.fillStyle=layer===active?'#efbd55':'#96acb7';ctx.font='13px ui-monospace,monospace';ctx.fillText(symbols[layer],label.x+10,label.y);
      const points=Object.fromEntries(ids.map((id,i)=>[id,project(position(source.families[id],i,layer,layout),camera,width,height)]));
      if(layer===active)Object.values(source.edges).forEach(e=>{const a=points[e.a],b=points[e.b],color=colors[e.status]||'#96acb7',dash=e.status==='open'?[2,6]:e.status==='negative'?[10,4,2,4]:e.status==='method'?[7,5]:[];line(a,b,color,dash,!current||e.a===current||e.b===current?.85:.12);
        const t=.62,x=a.x+(b.x-a.x)*t,y=a.y+(b.y-a.y)*t,angle=Math.atan2(b.y-a.y,b.x-a.x);line({x:x-7*Math.cos(angle-.5),y:y-7*Math.sin(angle-.5)},{x,y},color,[],.8);line({x:x-7*Math.cos(angle+.5),y:y-7*Math.sin(angle+.5)},{x,y},color,[],.8)
      });
      ids.forEach(id=>hits.push({...points[id],id,stop,active:layer===active,selected:id===current&&layer===active}));
    });
    hits.sort((a,b)=>a.z-b.z).forEach(p=>{
      const radius=p.selected?18:p.active?14:10;
      ctx.globalAlpha=p.active?1:.48;ctx.beginPath();ctx.arc(p.x,p.y,radius,0,Math.PI*2);ctx.fillStyle=p.selected?'#efbd55':'#102a3a';ctx.fill();ctx.strokeStyle=p.selected?'#efbd55':Math.cos(camera.yaw)<0?'#ef6d9c':'#54d7ef';ctx.lineWidth=p.selected?3:1.5;ctx.stroke();
      ctx.fillStyle=p.selected?'#06121b':'#e9f2f5';ctx.font=(p.selected?'bold ':'')+'12px ui-monospace,monospace';ctx.textAlign='center';ctx.fillText(p.id,p.x,p.y+4);ctx.textAlign='left';ctx.globalAlpha=1;
      if(p.id===current){ctx.fillStyle='#e9f2f5';ctx.font='11px ui-monospace,monospace';ctx.fillText(p.id+'@'+symbols[stopIds.indexOf(p.stop)],p.x+20,p.y-6)}
    });
  }
  function resize(){const box=canvas.getBoundingClientRect(),ratio=Math.min(root.devicePixelRatio||1,2);width=Math.max(1,box.width);height=Math.max(1,box.height);canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);ctx.setTransform(ratio,0,0,ratio,0,0);draw()}
  function viewChange(){cancelTravel();record()}
  $('[data-control="layout"]').onchange=e=>{layout=e.target.value;viewChange()};
  $('[data-control="mode"]').onchange=e=>{root.A0Sync?.pause();bridge.apply({...capture(),mode:e.target.value});receive()};
  const zoom=delta=>{camera.zoom=Math.max(.55,Math.min(1.7,camera.zoom+delta))};
  mount.querySelectorAll('[data-action]').forEach(b=>b.onclick=()=>{
    const action=b.dataset.action;
    if(action==='previous'||action==='next'){restore(trail.move(action==='previous'?-1:1));return}
    if(action==='home'){const expected=trail.home();restore(expected);returnNote.textContent=JSON.stringify(capture())===JSON.stringify(expected)?'F7 · RETURN PASS · Auswahl, Stop, Modus, Raumform und Kamera stimmen mit dem Einstieg überein. Nur Leserzustand geprüft.':'F7 · RETURN DIFFERENCE · Leserzustand prüfen.';return}
    if(action==='front')camera={yaw:-.35,pitch:.38,zoom:camera.zoom};
    if(action==='back')camera={yaw:Math.PI-.35,pitch:.38,zoom:camera.zoom};
    if(action==='zoomIn')zoom(.1);if(action==='zoomOut')zoom(-.1);viewChange();
  });
  canvas.onpointerdown=e=>{if(transit)cancelTravel();drag={x:e.clientX,y:e.clientY,originX:e.clientX,originY:e.clientY,moved:false};canvas.setPointerCapture(e.pointerId)};
  canvas.onpointermove=e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag.moved=drag.moved||Math.hypot(e.clientX-drag.originX,e.clientY-drag.originY)>5;camera.yaw+=dx*.008;camera.pitch=Math.max(-1.3,Math.min(1.3,camera.pitch+dy*.008));drag.x=e.clientX;drag.y=e.clientY;draw()};
  canvas.onpointerup=e=>{if(!drag)return;const moved=drag.moved;drag=null;if(moved){record();return}const box=canvas.getBoundingClientRect(),x=e.clientX-box.left,y=e.clientY-box.top,p=[...hits].reverse().find(p=>Math.hypot(x-p.x,y-p.y)<22);if(p){select(p.id,p.stop);return}const shaft=shafts.find(s=>segmentDistance(x,y,s.a,s.b)<10);if(shaft)travel(atlas.stop===shaft.to?shaft.from:shaft.to)};
  canvas.onpointercancel=()=>{drag=null;record()};
  canvas.onkeydown=e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-'].includes(e.key))return;e.preventDefault();cancelTravel();if(e.key==='ArrowLeft')camera.yaw-=.15;if(e.key==='ArrowRight')camera.yaw+=.15;if(e.key==='ArrowUp')camera.pitch=Math.min(1.3,camera.pitch+.1);if(e.key==='ArrowDown')camera.pitch=Math.max(-1.3,camera.pitch-.1);if(e.key==='+')zoom(.1);if(e.key==='-')zoom(-.1);record()};
  document.addEventListener('a0:family-atlas-selection',receive);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelTravel();readout();draw()}});
  root.addEventListener('resize',resize);resize();readout();
  root.A0FamilySpatialReader={snapshot:()=>capture(),trail,resize,travel,cancelTravel,journey:()=>transit?JSON.parse(JSON.stringify(transit)):null,resume(state){
    if(!root.A0ScienceBuilderPath?.validReader(state)||!source.routes[state.route]||state.family&&!source.families[state.family]||!source.families[state.elevatorFamily]||['bluebody','dodeca'].includes(state.layout)&&!bodies[state.layout])return false;
    restore(JSON.parse(JSON.stringify(state)));record();return true;
  }};
  if(root.location.hash==='#spatial-navigation'){root.A0Sync?.pause();requestAnimationFrame(()=>document.getElementById('spatial-navigation').scrollIntoView({block:'start'}))}
})(typeof window!=='undefined'?window:globalThis);
