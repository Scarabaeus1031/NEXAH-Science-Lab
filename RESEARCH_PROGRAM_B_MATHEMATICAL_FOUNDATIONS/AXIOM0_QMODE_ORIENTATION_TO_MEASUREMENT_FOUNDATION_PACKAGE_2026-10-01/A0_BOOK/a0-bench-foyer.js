(function(root,factory){
 const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;
 else{root.A0BenchFoyer=api;root.A0BenchFoyerController=api.mount(document,root);}
})(typeof globalThis==='undefined'?this:globalThis,function(){
 'use strict';
 // Existing audited originals; not a new asset registry.
 const MODELS=[
  {"label":"17 Floors","kicker":"01 / 03 · SOURCE WINDOW · HÜLLE & DECKS","copy":"Eine verschachtelte Körperquelle: benannte Ebenen, Schalen, Kristall und Gates liegen wie Decks innerhalb derselben räumlichen Hülle.","role":"Der aufgeschnittene Maschinenkörper — außen Hülle, innen gestaffelte Räume und Übergänge.","facts":"29 Nodes · 28 Meshes · 17 benannte Floors · 0 Animationsspuren.","href":"assets/models/machina-17-floors.glb","original":"../../../../../../../Desktop/Desktop TASKS/DESKTOP_archy/THOOTH DASHBOARD/Nexahedron_Codex Staging Modules/🀆 BLACK Mirror_🌍BLUE Pearl_ATLAS III Time Bridge/Enki_Matryoshka_Enlil_v2.glb","sha256":"5934b82ae9b7862179de0e19a401345f32511960f67af6d8916bd1e59a23537e"},
  {"label":"Blue Pearl","kicker":"02 / 03 · SOURCE WINDOW · KERN & UMLAUF","copy":"Ein innerer Körper mit benannten Solar- und Lunar-Halos. Die vielen Ringe lassen Zentrum, Umlaufbahnen und äußere Krone gleichzeitig lesbar werden.","role":"Der orientierbare Kern im Maschinenkörper — Pearl, Halo und Crown als räumliche Schichten.","facts":"111 Nodes · 110 Meshes · benannte Solar-/Lunar-Halos · 0 Animationsspuren.","href":"assets/models/machina-blue-pearl.glb","original":"../../../../../../../Desktop/Desktop TASKS/DESKTOP_archy/THOOTH DASHBOARD/Nexahedron_Codex Staging Modules/🀆 BLACK Mirror_🌍BLUE Pearl_ATLAS III Time Bridge/blue_pearl_solar_lunar_kite_12_37_39.glb","sha256":"30aae1c0900a8e8807ab290aafa33490fdc37c720d257d6302870641c2f42d3d"},
  {"label":"Resonance Cathedral","kicker":"03 / 03 · SOURCE WINDOW · GERÜST & VERBINDUNG","copy":"Eine dichte bestehende Strukturquelle mit tausenden benannten Teilen. Sie zeigt, wie aus Achsen, Ringen und Verbindungen ein begehbarer Innenraum gelesen werden kann.","role":"Das tragende Gerüst und der große Innenraum — eine Architekturansicht, nicht der Nachweis derselben Maschine wie 17 Floors.","facts":"Bestehende NSN-ID GLB:CATHEDRAL_V8_8_FUSION · 18.080 Nodes · strukturelle Herkunft geprüft.","href":"assets/models/machina-resonance-cathedral.glb","original":"../../../../../../GitHub/NEXAH-CODEX/SYSTEM_1_MATHEMATICA/HERMETIC_PYTHAGORAS_Model/GEOMETRIA_NOVA_Continuum/Modul 01 · Resonance Cathedral/glb/cathedral_v8_8_fusion.glb","sha256":"45496d09f7b86d42fc5d0f10e249498f2aa531b8b97f61d6a776983526a55613"},
  {"label":"Panel V · Five Gates","kicker":"GLB 01 / 05 · BODY / SHADOW GATES","copy":"Fünf getrennte Gate-Kanäle werden als räumlicher Kontrollkörper sichtbar. Das Modell ist der 3D-Träger des bestehenden Body/Shadow/Gate-Ledgers.","role":"Laternen- und Panel-V-Körper — Quellmodell für fünf operable Kanäle, nicht Lichtsimulation.","facts":"48.028 Byte · lokales GLB · Control-Lens-Return vom 29.10.2026.","href":"results/a0-lantern-panel-v-control-lens-2026-10-29.glb","original":"results/a0-lantern-panel-v-control-lens-2026-10-29.glb","sha256":"ce47817dc271aa924ad628571ed914752c30e7fd956d192bcf699a76223efaa6"},
  {"label":"Hinge / Actuator Housing","kicker":"GLB 02 / 05 · SCHARNIER & GEHÄUSE","copy":"Das getrennte Scharnier- und Gehäusemodell macht die mechanische Anschlussstelle der Laterne sichtbar, ohne daraus eine zertifizierte Gesamtmechanik abzuleiten.","role":"Engineering-Prototyp — Housing, Hinge und Actuator als eigenständiger Prüfträger.","facts":"20.756 Byte · lokales GLB · Engineering-Return vom 29.10.2026.","href":"results/a0-lantern-hinge-actuator-housing-prototype-2026-10-29.glb","original":"results/a0-lantern-hinge-actuator-housing-prototype-2026-10-29.glb","sha256":"b1b214ba43776816ed42ebfbf66ba0e04e949bd9c4a479bd67124f963dd68df4"},
  {"label":"Shadow Triangle 3+2","kicker":"GLB 03 / 05 · SHADOW / FOLD","copy":"Die fünf pinken Flächen rahmen den inneren Dreiecksträger. Hier wird die Verbindung von Körper, Projektion und Faltung als vorhandener räumlicher Kandidat lesbar.","role":"Shadow- und Fold-Ansicht — ein Intake-Deliverable, keine Gleichsetzung von Körper und Projektion.","facts":"37.984 Byte · Pentagon-Knick-Intake · vorhandenes GLB-Deliverable.","href":"downloads/A0_PENTAGON_KNICK_APERTURE_INTAKE_2026-10-25/deliverables/glb/NEXAH_Shadow_Triangle_3plus2_Animiert_2026-10-25.glb","original":"downloads/A0_PENTAGON_KNICK_APERTURE_INTAKE_2026-10-25/deliverables/glb/NEXAH_Shadow_Triangle_3plus2_Animiert_2026-10-25.glb","sha256":"e0c85ad8b7a63c60baaeb984a17865ec574569de2ecebbabe577d4d0ed152455"},
  {"label":"Fünfflaschenkrone","kicker":"GLB 04 / 05 · CROWN / APERTURE","copy":"Die animierte Kronenquelle trägt die pentagonale Öffnung und ihre fünfteilige Hülle in denselben Viewer. Sie bleibt eine eigene Quelle neben Panel V und Shadow Triangle.","role":"Crown- und Aperture-Körper — räumlicher Übergabepunkt zur Pentagon-Knick-Familie.","facts":"30.176 Byte · Pentagon-Knick-Intake · vorhandenes GLB-Deliverable.","href":"downloads/A0_PENTAGON_KNICK_APERTURE_INTAKE_2026-10-25/deliverables/glb/NEXAH_Fuenflaschenkrone_Animiert_2026-10-25.glb","original":"downloads/A0_PENTAGON_KNICK_APERTURE_INTAKE_2026-10-25/deliverables/glb/NEXAH_Fuenflaschenkrone_Animiert_2026-10-25.glb","sha256":"24a33c38eb6e95b110e851ed5fe321f19120bf580248fa09b3a4e5c07b33f754"},
  {"label":"Breathing Crystal · Prime Wiring","kicker":"GLB 05 / 05 · BREATH / PRIME BANDS","copy":"Der vollständig verdrahtete Breathing Crystal bringt Kern, Bänder und Prime-Wiring als größtes inneres GLB in das gemeinsame Deck.","role":"Atmungs- und Bandkörper — räumliche Instrumentansicht, keine biologische oder physikalische Behauptung.","facts":"4.142.920 Byte · lokales GLB · Prime-Wiring-Full-Ausgabe.","href":"assets/breathing-crystal/Breathing_Crystal_nBands_Prime_Wiring_FULL.glb","original":"assets/breathing-crystal/Breathing_Crystal_nBands_Prime_Wiring_FULL.glb","sha256":"bdc86517597875a6090ee5cc27d9f713ae577f8ecadc27cc3df74582c190d5d8"}
 ];
 const SOURCE_WINDOWS=Object.freeze([0,1,2]);
 const GLB_DECK=Object.freeze([3,4,5,6,7]);
 const DOORS=[
 ['Körper & Räume','Blue / Pink, Zellen und Körperweg','bodyRouteBench','assets/images/crystal_view_poster.jpeg'],
 ['Grids & Teller','Pink Grids, Raster, Masken und Teller','orbitGridJoints','assets/mathematical-joints/EXPERIMENT_3D_POLAR_CYLINDER.png'],
 ['Spielen & Entdecken','LIFE · Three Domains · Numbers','A0_GAME_OF_WORLDS_PLAY.html?world=domains#domains','assets/reading-sequence/04-events.jpeg'],
 ['Operatoren & Phasen','Drehen, schalten und vergleichen','operatorPanel','assets/mathematical-joints/EXPERIMENT_POLAR_DRIFT_MOD11.png'],
 ['Linsen & Observer','Schnitt, Sichtbarkeit und Projektion','maskObserverBench','assets/au-na-he-ti-reference/consciousness-window.png'],
 ['Return & Records','Was bleibt — und was fehlt?','returnEconomyDemonstrator','assets/images/record_play_poster.jpeg'],
 ['Schaltbild','Anschlüsse und Bindungen lesen','benchMap','assets/mathematical-joints/EXPERIMENT_XO_TRANSITION_MAP.png'],
 ['Alle Werkzeuge','Suchen und gezielt auswählen','benchOverview','assets/images/rooms_of_the_machine.jpeg'],
 ['Quellen & 3D-Bestand','Originale, Modelle und Herkunft','nsnGlbSources','assets/mathematical-joints/EXPERIMENT_NESTED_GRID_111X111.png']
 ];
 const TOUR_STEPS=Object.freeze([
  {kind:'model',index:0,title:'Hülle & Decks',copy:'17 Floors öffnet die Tour als geschnittenes Maschinenhaus.'},
  {kind:'model',index:1,title:'Kern & Umlauf',copy:'Blue Pearl zeigt Kern, Halo und Crown als räumliche Schichten.'},
  {kind:'model',index:2,title:'Gerüst & Innenraum',copy:'Resonance Cathedral liest Achsen und Verbindungen als tragende Architektur.'},
  {kind:'model',index:3,title:'Gate Body',copy:'Panel V bringt fünf getrennte Body/Shadow-Kanäle in den gemeinsamen Viewer.'},
  {kind:'cockpit',from:3,to:4,title:'C1 · Gate Cockpit',copy:'Die erste Übergabe führt vom Gate-Körper zum getrennten Scharniergehäuse.'},
  {kind:'model',index:4,title:'Hinge / Actuator',copy:'Housing, Hinge und Actuator bleiben ein eigener Engineering-Prüfträger.'},
  {kind:'cockpit',from:4,to:5,title:'C2 · Hinge/Fold Cockpit',copy:'Achse und Faltung werden übergeben, ohne Mechanismusidentität zu behaupten.'},
  {kind:'model',index:5,title:'Shadow Triangle 3+2',copy:'Fünf Flächen rahmen den inneren Dreiecksträger als Fold-/Projection-Ansicht.'},
  {kind:'cockpit',from:5,to:6,title:'C3 · Crown Cockpit',copy:'Die Faltansicht übergibt an die pentagonale Crown-/Aperture-Quelle.'},
  {kind:'model',index:6,title:'Fünfflaschenkrone',copy:'Die Krone trägt Öffnung und fünfteilige Hülle als eigene Source.'},
  {kind:'cockpit',from:6,to:7,title:'C4 · Breath Cockpit',copy:'Crown und Prime-Bands treffen sich nur im typisierten Handoff.'},
  {kind:'model',index:7,title:'Breathing Crystal',copy:'Der vollständig verdrahtete Crystal schließt das innere Maschinen-Deck.'},
  {kind:'return',title:'Exact Tour Return',copy:'Die Tour kehrt zum Port zurück, an dem sie betreten wurde.'}
 ]);
 const isFoyer=hash=>!hash||['#orientationBench','#benchFoyer','#machinaGlbDeck','#foyerDoors','#benchMachinePicture'].includes(hash);
 function mount(doc,win){
  const host=doc.getElementById('benchFoyer');if(!host)return null;
  const el=n=>host.querySelector('[data-bf-'+n+']');
  let viewer=null,token=0,libraryPromise=null,preloadPromise=null,chosen=0,circuitTimer=null,circuitStart=0,circuitStep=0,tourTimer=null,tourEntry=0,tourStep=-1;
  const warmed=new Set();
  function status(s){el('status').textContent=s;}
  function release(){token++;if(viewer){viewer.pause?.();viewer.remove();viewer=null;}el('poster').hidden=false;el('close').hidden=true;el('rotate').disabled=true;el('rotate').setAttribute('aria-pressed','false');}
  function select(index){
   if(!MODELS[index])return false;release();chosen=index;
   const model=MODELS[index];
   el('model-name').textContent=model.label;el('original').href=model.href;el('source').textContent='Archivquelle: '+(model.original||model.href);
   const sourcePosition=SOURCE_WINDOWS.indexOf(index),deckPosition=GLB_DECK.indexOf(index);
   el('hash').textContent='SHA-256: '+model.sha256;el('counter').textContent=sourcePosition>=0?String(sourcePosition+1).padStart(2,'0')+' / 03':('GLB '+String(deckPosition+1).padStart(2,'0')+' / 05');
   el('kicker').textContent=model.kicker;el('title').textContent=model.label;el('copy').textContent=model.copy;el('role').textContent=model.role;el('facts').textContent=model.facts;
   host.querySelectorAll('[data-bf-model]').forEach(n=>n.setAttribute('aria-pressed',String(Number(n.dataset.bfModel)===index)));
   status(warmed.has(index)?'Original ausgewählt · 3D vorgeladen · bereit für die Installation':'Original ausgewählt · 3D wird im Hintergrund vorbereitet');
   if(typeof win.CustomEvent==='function'&&doc.dispatchEvent)doc.dispatchEvent(new win.CustomEvent('a0:machina-glb-state',{detail:{index,label:model.label,href:model.href,sha256:model.sha256,port:index+1,total:MODELS.length}}));return true;
  }
  function step(delta){
   const keepOpen=Boolean(viewer),keepRotating=viewer?.hasAttribute('auto-rotate');
   const position=Math.max(0,SOURCE_WINDOWS.indexOf(chosen));
   const selected=select(SOURCE_WINDOWS[(position+delta+SOURCE_WINDOWS.length)%SOURCE_WINDOWS.length]);
   if(selected&&keepOpen)load(Boolean(keepRotating));
   return selected;
  }
  function paintTourButton(label,active){const button=el('tour');if(!button)return;button.textContent=label;button.setAttribute('aria-pressed',String(Boolean(active)));}
  function stopCircuit(message){const wasTour=tourTimer!==null,currentTourStep=tourStep;if(circuitTimer!==null){win.clearTimeout(circuitTimer);circuitTimer=null;}if(tourTimer!==null){win.clearTimeout(tourTimer);tourTimer=null;}circuitStep=0;tourStep=-1;if(wasTour)paintTourButton(currentTourStep>=0?'Tour pausiert · '+String(currentTourStep+1).padStart(2,'0')+'/'+TOUR_STEPS.length:'Geführte Tour',false);if(message)status(message);return chosen;}
  function runCircuit(){
   stopCircuit();circuitStart=GLB_DECK.includes(chosen)?chosen:GLB_DECK[0];circuitStep=0;const startPosition=GLB_DECK.indexOf(circuitStart);
   select(circuitStart);load(true);
   const tick=()=>{circuitStep+=1;const next=GLB_DECK[(startPosition+circuitStep)%GLB_DECK.length];select(next);load(true);
    if(circuitStep<GLB_DECK.length)circuitTimer=win.setTimeout(tick,900);
    else{circuitTimer=null;status('PASS · GLB-DECK-RUNDLAUF · 5 PORTS · EXAKTE RÜCKKEHR ZU '+MODELS[circuitStart].label.toUpperCase());}
   };
   status('RUN · GLB-DECK · 5 Quellen · gemeinsamer Viewer · getrennte Modelle');circuitTimer=win.setTimeout(tick,650);return{start:circuitStart,ports:GLB_DECK.length,exactReturn:true};
  }
  function paintTour(step){const guide=el('tour-guide');if(!guide)return;const progress=step.kind==='return'?'RETURN':String(tourStep+1).padStart(2,'0')+' / '+String(TOUR_STEPS.length).padStart(2,'0');guide.hidden=false;el('tour-progress').textContent=progress;el('tour-title').textContent=step.title;el('tour-copy').textContent=step.copy;paintTourButton(step.kind==='return'?'Tour · Rückkehr':'Tour · '+progress,true);}
  function runTour(){
   stopCircuit();tourEntry=chosen;tourStep=-1;
   const tick=()=>{tourStep+=1;const step=TOUR_STEPS[tourStep];paintTour(step);
    if(step.kind==='model'){select(step.index);load(true);status('TOUR · '+String(tourStep+1).padStart(2,'0')+'/'+TOUR_STEPS.length+' · '+step.title);}
    else if(step.kind==='cockpit'){select(step.to);load(true);status('TOUR COCKPIT · '+MODELS[step.from].label+' → '+step.title+' → '+MODELS[step.to].label);}
    else{select(tourEntry);load(true);tourTimer=null;paintTourButton('Tour erneut starten',false);status('PASS · GEFÜHRTE TOUR · '+TOUR_STEPS.length+' KAPITEL · EXAKTE RÜCKKEHR ZU '+MODELS[tourEntry].label.toUpperCase());return;}
    tourTimer=win.setTimeout(tick,2600);
   };
   el('tour-guide').hidden=false;el('tour-progress').textContent='START';el('tour-title').textContent='Machina-Tour startet';el('tour-copy').textContent='3 Source Windows · 5 GLBs · 4 Cockpits · Rückkehr zum Eintrittskörper.';paintTourButton('Tour startet · 00/'+TOUR_STEPS.length,true);status('TOUR BEREIT · 3 SOURCE WINDOWS · 5 GLBs · 4 COCKPITS · EXAKTER RETURN');tick();return{entry:tourEntry,chapters:TOUR_STEPS.length,exactReturn:true};
  }
  function library(){
   if(win.customElements?.get('model-viewer'))return Promise.resolve();
   if(!libraryPromise)libraryPromise=new Promise((resolve,reject)=>{
    const script=doc.createElement('script');script.src='assets/vendor/a0-model-viewer-classic.js';
    script.onload=()=>win.customElements?.get('model-viewer')?resolve():reject(Error('Viewer nicht bereit'));
    script.onerror=()=>reject(Error('Viewerbibliothek nicht lesbar'));doc.head.appendChild(script);
   }).catch(e=>{libraryPromise=null;throw e;});return libraryPromise;
  }
  function markReady(index,state,label){
   const node=host.querySelector('[data-bf-ready="'+index+'"]');
   if(!node)return;node.dataset.state=state;node.textContent=label;
  }
  function preload(){
   if(preloadPromise)return preloadPromise;
   const warm=(m,index)=>{
    markReady(index,'loading','3D wird vorbereitet');
    if(typeof win.fetch!=='function'){markReady(index,'hold','3D auf Klick laden');return Promise.resolve(false);}
    return win.fetch(m.href,{cache:'force-cache'}).then(response=>{
     if(!response.ok)throw Error('HTTP '+response.status);
     return response.arrayBuffer();
    }).then(()=>{warmed.add(index);markReady(index,'ready','3D vorgeladen');return true;})
     .catch(()=>{markReady(index,'hold','3D auf Klick laden');return false;});
   };
   preloadPromise=Promise.all([library().then(()=>true).catch(()=>false),...MODELS.map(warm)]).then(result=>{
    const count=result.slice(1).filter(Boolean).length;
    if(!viewer)status(count===MODELS.length?'3 Source Windows + 5 GLBs vorgeladen · keine Engine gestartet':count+' / '+MODELS.length+' Quellen vorgeladen · Rest auf Klick');
    return count;
   });
   return preloadPromise;
  }
  async function load(autoRotate){
   release();const request=token,m=MODELS[chosen];status('Original wird geladen …');
   try{
    await library();if(request!==token)return;
    const v=doc.createElement('model-viewer');viewer=v;
    v.setAttribute('camera-controls','');v.setAttribute('interaction-prompt','none');
    if(autoRotate)v.setAttribute('auto-rotate','');
    v.setAttribute('aria-label',m.label+' · unveränderte GLB-Quelle');v.cameraTarget='auto auto auto';v.cameraOrbit='35deg 65deg 105%';v.fieldOfView='38deg';
    v.addEventListener('load',()=>{if(viewer!==v)return;v.cameraTarget='auto auto auto';v.cameraOrbit='35deg 65deg 105%';v.fieldOfView='38deg';v.jumpCameraToGoal?.();el('poster').hidden=true;el('rotate').disabled=false;el('rotate').setAttribute('aria-pressed',String(Boolean(autoRotate)));status(m.label+(autoRotate?' · Installation rotiert · zentriert und bildschirmfüllend':' · zentriert · ziehen zum Drehen, zoomen · keine Modellanimation gestartet'));});
    v.addEventListener('error',()=>{if(viewer!==v)return;release();status('HOLD · Original im Browser nicht lesbar. Referenzbild bleibt sichtbar; Original-Link nutzen.');});
    el('stage').appendChild(v);el('close').hidden=false;v.src=m.href;
   }catch(e){if(request===token){release();status('HOLD · '+e.message+' · Referenzbild bleibt sichtbar');}}
  }
  function route(){
   const foyer=isFoyer(win.location.hash);doc.body.classList.toggle('bench-foyer-mode',foyer);
   if(foyer)win.A0MaskClockBench?.focus(false);else release();
  }
  host.addEventListener('click',e=>{
   const cockpit=e.target.closest?.('[data-bf-cockpit]');if(cockpit?.dataset?.bfCockpit){const [from,to]=cockpit.dataset.bfCockpit.split(':').map(Number);stopCircuit();select(to);load(true);status('COCKPIT HANDOFF · '+MODELS[from].label+' → '+cockpit.dataset.bfCockpitRole+' → '+MODELS[to].label+' · shared runtime state');return;}
   const n=e.target.closest?.('[data-bf-model]');if(!n)return;stopCircuit();
   const enter=Boolean(viewer)||n.hasAttribute?.('data-bf-enter');
   if(select(Number(n.dataset.bfModel))&&enter)load(true);
  });
  el('prev').addEventListener('click',()=>step(-1));
  el('next').addEventListener('click',()=>step(1));
  el('exhibit').addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault?.();step(-1);}if(e.key==='ArrowRight'){e.preventDefault?.();step(1);}});
  el('load').addEventListener('click',()=>load(false));
  el('installation').addEventListener('click',()=>{el('exhibit').scrollIntoView?.({behavior:'smooth',block:'start'});load(true);});
  el('circuit')?.addEventListener('click',()=>runCircuit());
  el('tour')?.addEventListener('click',()=>runTour());
  el('circuit-stop')?.addEventListener('click',()=>stopCircuit('PAUSE · aktuelle Quelle: '+MODELS[chosen].label));
  el('close').addEventListener('click',()=>{release();status('3D entladen · Referenzbild');});
  el('rotate').addEventListener('click',()=>{
   if(!viewer)return;const on=!viewer.hasAttribute('auto-rotate');
   viewer.toggleAttribute('auto-rotate',on);el('rotate').setAttribute('aria-pressed',String(on));
   status(on?'Ansichtsrotation · keine gespeicherte Modellanimation':'Ansichtsrotation angehalten');
  });
  el('camera').addEventListener('change',()=>{if(viewer){viewer.cameraTarget='auto auto auto';viewer.cameraOrbit=el('camera').value.replace('auto','105%');viewer.jumpCameraToGoal?.();}});
  doc.addEventListener('visibilitychange',()=>{if(doc.hidden&&viewer)viewer.removeAttribute('auto-rotate');el('rotate').setAttribute('aria-pressed','false');});
  doc.addEventListener('keydown',e=>{if(e.key==='Escape'&&viewer){release();status('3D geschlossen');el('load').focus();}});
  win.addEventListener('hashchange',route);
  // The existing tour button owns playback; only reveal its workspace first.
  doc.addEventListener('click',e=>{
   if(e.target.closest?.('#benchTourTop')&&isFoyer(win.location.hash)){
    win.location.hash='#benchShowcase';doc.body.classList.toggle('bench-foyer-mode',false);release();
   }
  },true);
  select(0);route();preload();
  return{load,preload,select,step,release,route,runCircuit,runTour,stopCircuit,snapshot:()=>({chosen,sources:MODELS.length,sourceWindows:SOURCE_WINDOWS.length,deckPorts:GLB_DECK.length,running:circuitTimer!==null,tourRunning:tourTimer!==null,circuitStart,tourEntry,tourStep}),get chosen(){return chosen;},get warmed(){return warmed.size;}};
 }
 return{MODELS,DOORS,TOUR_STEPS,SOURCE_WINDOWS,GLB_DECK,isFoyer,mount,GLB_COCKPITS:Object.freeze([{id:'gate',from:3,to:4},{id:'hinge-fold',from:4,to:5},{id:'crown',from:5,to:6},{id:'breath',from:6,to:7}])};
});
