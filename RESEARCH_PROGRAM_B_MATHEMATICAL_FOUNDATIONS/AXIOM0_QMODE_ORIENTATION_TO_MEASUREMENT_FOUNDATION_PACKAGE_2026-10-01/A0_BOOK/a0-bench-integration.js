(function(root,factory){
 const node=typeof module==='object'&&module.exports;
 const api=factory(node?require('./assets/a0-pentagon-body-player-v1.js'):root.A0PentagonBodyPlayer,node?require('./assets/a0-blue-body-life-transfer-v1.js'):root.A0BlueBodyLifeTransfer,node?require('./a0-mask-observer.js'):root.A0MaskObserver,node?require('./a0-orbit-grid-joints.js'):root.A0OrbitGridJoints,node?require('./a0-pascal-aperture-bridge.js'):root.A0PascalAperture);
 if(node)module.exports=api;else{root.A0BenchIntegration=api;root.A0BenchIntegrationController=api.mount(document,root);}
})(typeof globalThis==='undefined'?this:globalThis,function(B,L,M,J,P){
 'use strict';
 const clone=x=>JSON.parse(JSON.stringify(x)),FOCI=['AM','VM','PM'],SPAN=1.6;
 const RULE='DECLARED_DISPLAY_PROJECTION_48_TO_28_WITH_SOURCE_WITNESS_NOT_CARRIER_IDENTITY';
 function cell(point){
  if(!Array.isArray(point)||point.length!==2||!point.every(Number.isFinite))throw Error('invalid projection point');
  const [x,y]=point;
  if(x < -SPAN||x>=SPAN||y<=-SPAN||y>SPAN)return null;
  const col=Math.floor((x+SPAN)/(2*SPAN)*7),row=Math.floor((SPAN-y)/(2*SPAN)*4);
  return row*7+col+1;
 }
 function snapshot(input){
  const {keys,focus='AM',mask=M.create(),witness=true,origin='LOCAL_ADDRESS_SELECTION',pascal=null}=input;
  if(!FOCI.includes(focus)||typeof witness!=='boolean'||!['LOCAL_ADDRESS_SELECTION','BODY_PLAYER_READBACK','HELD_BODY_PLAYER_READBACK'].includes(origin))throw Error('invalid view settings');
  if(!Array.isArray(keys)||keys.length>48||new Set(keys).size!==keys.length||keys.some(k=>!L.sourceToCell(k)))throw Error('invalid source keys');
  M.validate(mask);
  const cells=keys.map(k=>L.sourceToCell(k)),house=B.houseLedger(cells,focus),frame=M.frame(mask.config,mask.tick);
  const projected=house.nodes.map(n=>({sourceKey:n.sourceKey,layer:n.layer,point:n.point.slice(),address:cell(n.point),active:n.active,observer:J.project(n.point,frame)}));
  const bins=Array.from({length:28},(_,i)=>({address:i+1,sourceKeys:projected.filter(n=>n.address===i+1).map(n=>n.sourceKey),activeKeys:projected.filter(n=>n.address===i+1&&n.active).map(n=>n.sourceKey)}));
  const active=projected.filter(n=>n.active),selectedBins=bins.filter(b=>b.activeKeys.length);
  const candidates=selectedBins.flatMap(b=>b.sourceKeys),unique=active.every(n=>n.address!==null&&bins[n.address-1].sourceKeys.length===1);
  const returnedKeys=witness?keys.slice():unique?active.map(n=>n.sourceKey):null;
  const pascalView=pascal?P.snapshot(pascal,{shape:'triangle',scale:.6,folded:false,keepResidual:witness}):null;
  return{schema:'a0.bench-integration/1',rule:RULE,source:{keys:keys.slice(),origin},focus,mask:clone(mask),witness,projected,bins,
   returnReceipt:{status:witness?'PASS_SAVED_SOURCE_KEYS':unique?'PASS_UNIQUE_DISPLAY_BIN':'HOLD_AMBIGUOUS_OR_OUTSIDE_BIN',returnedKeys,candidateCount:candidates.length,wholeMachineReturn:false,historyRecovered:false},
   pascalSource:pascal?clone(pascal):null,pascalView,
   policy:{bounds:[-SPAN,SPAN],columns:7,rows:4,xBoundary:'left inclusive; right exclusive',yBoundary:'bottom exclusive; top inclusive',sharedClock:false,sourceWrites:false,pascalIsIndependent:true,marker29:'EXTERNAL_UNASSIGNED',bodyReadMode:'EXPLICIT_ONE_SHOT_NOT_LIVE_SYNCHRONIZATION',witnessWithheld:'RETURN_ABLATION_ONLY_SOURCE_KEYS_STILL_IN_RECOMPUTABLE_RECORD'},
   boundary:'New fixed-window binning of existing House display coordinates. AM=XY, VM=YZ, PM=ZX. No rescaling, modulo, 48=28 identity, native TESA topology, common Pascal carrier or physical optics. Saved address keys are not dynamical history.'};
 }
 function verify(record){try{
  return JSON.stringify(record)===JSON.stringify(snapshot({keys:record.source.keys,origin:record.source.origin,focus:record.focus,mask:record.mask,witness:record.witness,pascal:record.pascalSource}));
 }catch{return false;}}
 function drawing(r){
  if(!verify(r))throw Error('invalid record');
  const colors=['#31cde9','#ee6ca5','#e5b340'],at=p=>[145+p[0]*70,150-p[1]*70];
  let s='<svg viewBox="0 0 720 340" role="img" aria-label="House-Projektion und TESA-Maske mit erhaltenen Quellschlüsseln"><title>48 Quellen, 28 Projektionsfelder; Überlagerung ist keine Identität</title>';
  for(const n of r.projected){const p=at(n.point);s+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="'+(n.active?7:3)+'" fill="'+colors[n.layer]+'" stroke="'+(n.active?'white':'none')+'"><title>'+n.sourceKey+' → '+n.address+'</title></circle>';}
  for(const bin of r.bins){const x=340+((bin.address-1)%7)*48,y=30+Math.floor((bin.address-1)/7)*62;
   const layers=new Set(bin.activeKeys.map(k=>Number(k[1]))),fill=layers.size>1?'#825d8f':layers.size?colors[[...layers][0]]:'#304550';
   s+='<rect x="'+x+'" y="'+y+'" width="44" height="56" fill="'+fill+'" stroke="#78939e"/><text x="'+(x+5)+'" y="'+(y+20)+'" fill="white">'+bin.address+'</text><text x="'+(x+5)+'" y="'+(y+43)+'" fill="white" font-size="11">'+bin.activeKeys.length+'/'+bin.sourceKeys.length+'</text>';
  }
  return s+'<text x="20" y="310" fill="#dcecf4">'+r.focus+' · Cyan P0 / Pink P1 / Gold P2 · Weiß: ausgewählt</text><text x="340" y="310" fill="#dcecf4">aktiv / mögliche Quellen · 29 extern</text></svg>';
 }
 function mount(doc,win){
  const host=doc.getElementById('benchIntegration');if(!host)return null;
  host.innerHTML='<h2>Quelladresse → Projektion → TESA-Maske → Record</h2><p>Ein lesender Bench-Anschluss. Die vollständigen 48 Quelladressen bleiben erhalten; 28 Felder sind eine neue deklarierte Ansichtsmaske, kein Ersatzträger.</p><div class="bi-controls"><label>Lokale Quelladresse <select data-bi-key></select></label><button data-bi-local type="button">Lokale Adresse lesen</button><button data-bi-body type="button">Aktuellen Body-Player lesen</button><label>Projektion <select data-bi-focus><option>AM</option><option>VM</option><option>PM</option></select></label><label><input type="checkbox" data-bi-witness checked> Quellschlüssel / Pascal-Rest behalten</label><button data-bi-pascal type="button">Pascal-Auswahl dazu lesen</button></div><p>Vor „Body-Player lesen“ den <a href="#bodyRouteBench">01c-Player oben öffnen</a>. Bei gesperrtem Readback: HOLD, kein Ersatz durch lokale Werte. Lokale Auswahl ist ausdrücklich kein Live-Game-Zustand. Pascal wird separat gelesen und bleibt ein eigener Träger.</p><output data-bi-status role="status"></output><div data-bi-drawing></div><pre data-bi-ledger></pre><p>Fenster fest: −1.6…1.6 in vorhandenen House-Anzeigekoordinaten. Keine automatische Anpassung. Grau bezeichnet unbelegte / nicht aktive Rasterfelder, nicht automatisch den historischen ALGO-Kanal. Gold ist P2; die goldene Observer-Linie bleibt ein Projektionsstrahl.</p><div class="bi-controls"><button data-bi-capture type="button">Record halten</button><button data-bi-return type="button" disabled>Lokale Ansicht zurück</button><button data-bi-export type="button" disabled>Record exportieren</button></div><details><summary>Gehaltener Record / Return-Grenze</summary><pre data-bi-record>Noch kein Record.</pre></details><p>Return stellt nur diese gespeicherte Bench-Ansicht wieder her, nicht die Quellfenster, deren Uhren oder verlorene Spielhistorie. Gehaltene Body-Daten bleiben als gehalten markiert.</p><h3>Geprüfte GLB-Quellen · unveränderte Originale</h3><div class="bi-controls"><select data-bi-model aria-label="GLB-Modell"></select><button data-bi-load type="button">Original-GLB anzeigen</button><button data-bi-unload type="button">GLB entladen</button><a data-bi-original>Originaldatei öffnen</a><select data-bi-camera aria-label="GLB-Ansicht"><option value="0deg 90deg auto">Front</option><option value="0deg 0deg auto">Top</option><option value="90deg 90deg auto">Side</option><option value="35deg 65deg auto">Isometrisch</option></select><select data-bi-track aria-label="Animationsspur"></select><button data-bi-play type="button" disabled>Animation starten</button><button data-bi-pause type="button">Pause</button></div><output data-bi-glb-status role="status"></output><div data-bi-viewer></div><pre data-bi-glb-audit></pre><p>GLB-Animationen haben ihre eigene Uhr. Helices_Rotate enthält nur äquivalente Anfangs-/Endorientierungen: keine bestätigte Vollumdrehung. Phi_Pulse ist eine 3%-Gruppenskalierung, kein Fünfstufenzähler.</p><p><a href="assets/game-of-worlds-play/three-domain-transition-test/index.html#bluebody">Paralleler Game-Demonstrator ↗</a> · <a href="A0_RESEARCH_DESK.html#bench-integration-20261021">Science Desk / Prüfstand</a> · <a href="results/a0-bench-fusion-glb-audit-2026-10-21.json">GLB-Binärbefunde</a></p>';
  host.innerHTML=host.innerHTML.replace('<pre data-bi-ledger>', '<div data-bi-observer></div><div data-bi-pascal-view></div><pre data-bi-ledger>').replace('Quellschlüssel / Pascal-Rest behalten','Quellschlüssel als Return-Witness nutzen / Pascal-Rest behalten').replace('#bluebody','#blue-body');
  const el=n=>host.querySelector('[data-bi-'+n+']');
  el('key').innerHTML=B.buildBody().nodes.map(n=>'<option>'+n.sourceKey+'</option>').join('');
  let keys=['P0:0000'],origin='LOCAL_ADDRESS_SELECTION',pascal=null,current=null,held=null,viewer=null,loading=null;
  function derivedViews(r){
   const selected=r.projected.find(n=>n.active);
   el('observer').innerHTML=selected?J.drawing({frame:M.frame(r.mask.config,r.mask.tick),result:selected.observer}):'Keine aktive Quelle für den Observer.';
   el('pascal-view').innerHTML=r.pascalView?P.drawing(r.pascalView):'';
  }
  function refresh(){
   try{
    const source=win.A0MaskObserverController;
    if(!source)throw Error('Maskenquelle fehlt');
    if(source.clockOwner&&!win.A0MaskClockBench?.ready)throw Error('Quellbestätigung fehlt');
    current=snapshot({keys,origin,pascal,focus:el('focus').value,witness:el('witness').checked,mask:source.state});
    el('drawing').innerHTML=drawing(current);derivedViews(current);el('status').textContent=current.returnReceipt.status+' · '+origin+' · '+keys.length+' aktive Quelladressen · Observer zeigt erste aktive Adresse';
    el('ledger').textContent=current.projected.filter(n=>n.active).map(n=>n.sourceKey+' → TESA '+n.address+' · Observer '+n.observer.status+(n.observer.hit?' @ '+n.observer.hit[0].toFixed(4):'')).join('\n')+(pascal?'\nPascal separat: n='+pascal.depth+' · Return '+current.pascalView.returned.status:'\nPascal: nicht gelesen');
    el('capture').disabled=false;
   }catch(e){current=null;el('status').textContent='HOLD · '+e.message;el('drawing').innerHTML='';el('observer').innerHTML='';el('pascal-view').innerHTML='';el('ledger').textContent='';el('capture').disabled=true;}
  }
  el('local').addEventListener('click',()=>{keys=[el('key').value];origin='LOCAL_ADDRESS_SELECTION';refresh();});
  el('body').addEventListener('click',()=>{
   try{
    const view=doc.getElementById('bodyRouteSourceFrame')?.contentWindow?.A0PentagonBodyPlayerView;
    if(!view||!Array.isArray(view.cells))throw Error('Body-Player nicht lesbar / nicht geladen');
    const next=view.cells.map(c=>L.cellToSource(c)?.sourceKey);
    if(next.some(k=>!k))throw Error('Ungültige Quellzelle');
    keys=next;origin='BODY_PLAYER_READBACK';refresh();
   }catch(e){current=null;el('drawing').innerHTML='';el('observer').innerHTML='';el('pascal-view').innerHTML='';el('ledger').textContent='';el('capture').disabled=true;el('status').textContent='HOLD · '+e.message;}
  });
  el('pascal').addEventListener('click',()=>{try{const next=win.A0PascalSource?.read();if(!next)throw Error('Pascal-Quelle fehlt');P.validateSource(next);pascal=clone(next);refresh();}catch(e){el('status').textContent='HOLD · '+e.message;}});
  el('focus').addEventListener('change',refresh);el('witness').addEventListener('change',refresh);
  el('capture').addEventListener('click',()=>{if(!current)return;held=clone(current);el('record').textContent=JSON.stringify(held,null,2);el('return').disabled=false;el('export').disabled=false;});
  el('return').addEventListener('click',()=>{
   if(!held||!verify(held))return;
   keys=held.source.keys.slice();origin=held.source.origin==='LOCAL_ADDRESS_SELECTION'?held.source.origin:'HELD_BODY_PLAYER_READBACK';pascal=clone(held.pascalSource);
   el('focus').value=held.focus;el('witness').checked=held.witness;
   current=clone(held);el('drawing').innerHTML=drawing(current);derivedViews(current);
   el('status').textContent='PASS_LOCAL_VIEW_RETURN · gespeicherte Maske / Adressen, keine Quellfenster-Rückstellung';
   el('ledger').textContent='Gehaltene Ansicht · Maskentick '+held.mask.tick+' · '+keys.join(', ');
  });
  el('export').addEventListener('click',()=>{if(!held)return;const u=win.URL.createObjectURL(new win.Blob([JSON.stringify(held,null,2)],{type:'application/json'})),a=doc.createElement('a');a.href=u;a.download='a0-bench-integration-record.json';a.click();win.URL.revokeObjectURL(u);});
  const models=win.A0BenchFusionGLBAudit?.models||[];
  el('model').innerHTML=models.map((m,i)=>'<option value="'+i+'">'+m.file.split('/').pop()+'</option>').join('');
  function modelInfo(){const m=models[Number(el('model').value)];if(!m)return;el('original').href=m.href;el('glb-audit').textContent=m.nodes+' Nodes · '+m.meshes+' Meshes · SHA256 '+m.sha256+'\nPhi-Layer: '+m.phiLayers.map(n=>n.name).join(', ')+'\n'+m.animations.map(a=>a.name+': '+a.channels.map(c=>c.path+' ['+c.times.join(', ')+']'+(c.equivalentRotationEndpoints?' · HOLD Vollumdrehung':'')).join('; ')).join('\n');}
  function unload(){if(viewer){viewer.pause?.();viewer.remove();viewer=null;}el('play').disabled=true;el('glb-status').textContent='GLB entladen · Archivquelle unverändert';}
  function library(){if(win.customElements?.get('model-viewer'))return Promise.resolve();if(!loading)loading=new Promise((resolve,reject)=>{const s=doc.createElement('script');s.src='assets/vendor/a0-model-viewer-classic.js';s.onload=resolve;s.onerror=()=>reject(Error('Viewerbibliothek nicht geladen'));doc.head.appendChild(s);});return loading;}
  let request=0;
  el('load').addEventListener('click',async()=>{const token=++request,m=models[Number(el('model').value)];if(!m)return;unload();el('glb-status').textContent='Lädt Original …';
   try{await library();if(token!==request)return;viewer=doc.createElement('model-viewer');viewer.setAttribute('camera-controls','');viewer.setAttribute('aria-label','Unveränderte archivierte GLB-Quelle');viewer.cameraOrbit=el('camera').value;viewer.addEventListener('load',()=>{if(token!==request||!viewer)return;el('glb-status').textContent='Original geladen · eigene Viewer-Uhr';const names=viewer.availableAnimations||[];el('track').innerHTML=names.map(n=>'<option>'+n+'</option>').join('');el('play').disabled=!names.length;});viewer.addEventListener('error',()=>{if(token!==request||!viewer)return;el('glb-status').textContent='HOLD · GLB nicht lesbar; Originaldatei über Link öffnen';el('play').disabled=true;});el('viewer').appendChild(viewer);viewer.src=m.href;
   }catch(e){el('glb-status').textContent='HOLD · '+e.message;}
  });
  el('model').addEventListener('change',()=>{request++;unload();modelInfo();});
  el('unload').addEventListener('click',()=>{request++;unload();});
  el('camera').addEventListener('change',()=>{if(viewer)viewer.cameraOrbit=el('camera').value;});
  el('track').addEventListener('change',()=>{if(viewer){viewer.pause();viewer.animationName=el('track').value;viewer.currentTime=0;}});
  el('play').addEventListener('click',()=>{if(viewer&&!el('play').disabled){viewer.animationName=el('track').value;viewer.play();}});
  el('pause').addEventListener('click',()=>viewer?.pause());
  doc.addEventListener?.('visibilitychange',()=>{if(doc.hidden)viewer?.pause();});
  const off=win.A0MaskObserverController?.subscribe(refresh),offClock=win.A0MaskClockBench?.subscribe(refresh);
  modelInfo();refresh();
  return{refresh,get current(){return current?clone(current):null;},get held(){return held?clone(held):null;},dispose(){request++;unload();off?.();offClock?.();}};
 }
 return{SPAN,FOCI,RULE,cell,snapshot,verify,drawing,mount};
});
