(function(root,factory){
 const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;
 else{root.A0BenchFoyer=api;root.A0BenchFoyerController=api.mount(document,root);}
})(typeof globalThis==='undefined'?this:globalThis,function(){
 'use strict';
 // Existing audited originals; not a new asset registry.
 const MODELS=[
  {"label":"17 Floors","kicker":"01 / 03 · HÜLLE & DECKS","copy":"Eine verschachtelte Körperquelle: benannte Ebenen, Schalen, Kristall und Gates liegen wie Decks innerhalb derselben räumlichen Hülle.","role":"Der aufgeschnittene Maschinenkörper — außen Hülle, innen gestaffelte Räume und Übergänge.","facts":"29 Nodes · 28 Meshes · 17 benannte Floors · 0 Animationsspuren.","href":"assets/models/machina-17-floors.glb","original":"../../../../../../../Desktop/Desktop TASKS/DESKTOP_archy/THOOTH DASHBOARD/Nexahedron_Codex Staging Modules/🀆 BLACK Mirror_🌍BLUE Pearl_ATLAS III Time Bridge/Enki_Matryoshka_Enlil_v2.glb","sha256":"5934b82ae9b7862179de0e19a401345f32511960f67af6d8916bd1e59a23537e"},
  {"label":"Blue Pearl","kicker":"02 / 03 · KERN & UMLAUF","copy":"Ein innerer Körper mit benannten Solar- und Lunar-Halos. Die vielen Ringe lassen Zentrum, Umlaufbahnen und äußere Krone gleichzeitig lesbar werden.","role":"Der orientierbare Kern im Maschinenkörper — Pearl, Halo und Crown als räumliche Schichten.","facts":"111 Nodes · 110 Meshes · benannte Solar-/Lunar-Halos · 0 Animationsspuren.","href":"assets/models/machina-blue-pearl.glb","original":"../../../../../../../Desktop/Desktop TASKS/DESKTOP_archy/THOOTH DASHBOARD/Nexahedron_Codex Staging Modules/🀆 BLACK Mirror_🌍BLUE Pearl_ATLAS III Time Bridge/blue_pearl_solar_lunar_kite_12_37_39.glb","sha256":"30aae1c0900a8e8807ab290aafa33490fdc37c720d257d6302870641c2f42d3d"},
  {"label":"Resonance Cathedral","kicker":"03 / 03 · GERÜST & VERBINDUNG","copy":"Eine dichte bestehende Strukturquelle mit tausenden benannten Teilen. Sie zeigt, wie aus Achsen, Ringen und Verbindungen ein begehbarer Innenraum gelesen werden kann.","role":"Das tragende Gerüst und der große Innenraum — eine Architekturansicht, nicht der Nachweis derselben Maschine wie 17 Floors.","facts":"Bestehende Source Lineage-ID GLB:CATHEDRAL_V8_8_FUSION · 18.080 Nodes · strukturelle Herkunft geprüft.","href":"assets/models/machina-resonance-cathedral.glb","original":"../../../../../../GitHub/NEXAH-CODEX/SYSTEM_1_MATHEMATICA/HERMETIC_PYTHAGORAS_Model/GEOMETRIA_NOVA_Continuum/Modul 01 · Resonance Cathedral/glb/cathedral_v8_8_fusion.glb","sha256":"45496d09f7b86d42fc5d0f10e249498f2aa531b8b97f61d6a776983526a55613"}
 ];
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
 const isFoyer=hash=>!hash||['#orientationBench','#benchFoyer','#foyerDoors','#benchMachinePicture'].includes(hash);
 function mount(doc,win){
  const host=doc.getElementById('benchFoyer');if(!host)return null;
  const el=n=>host.querySelector('[data-bf-'+n+']');
  let viewer=null,token=0,libraryPromise=null,preloadPromise=null,chosen=0;
  const warmed=new Set();
  function status(s){el('status').textContent=s;}
  function release(){token++;if(viewer){viewer.pause?.();viewer.remove();viewer=null;}el('poster').hidden=false;el('close').hidden=true;el('rotate').disabled=true;el('rotate').setAttribute('aria-pressed','false');}
  function select(index){
   if(!MODELS[index])return false;release();chosen=index;
   const model=MODELS[index];
   el('model-name').textContent=model.label;el('original').href=model.href;el('source').textContent='Archivquelle: '+(model.original||model.href);
   el('hash').textContent='SHA-256: '+model.sha256;el('counter').textContent=String(index+1).padStart(2,'0')+' / '+String(MODELS.length).padStart(2,'0');
   el('kicker').textContent=model.kicker;el('title').textContent=model.label;el('copy').textContent=model.copy;el('role').textContent=model.role;el('facts').textContent=model.facts;
   host.querySelectorAll('[data-bf-model]').forEach(n=>n.setAttribute('aria-pressed',String(Number(n.dataset.bfModel)===index)));
   status(warmed.has(index)?'Original ausgewählt · 3D vorgeladen · bereit für die Installation':'Original ausgewählt · 3D wird im Hintergrund vorbereitet');return true;
  }
  function step(delta){
   const keepOpen=Boolean(viewer),keepRotating=viewer?.hasAttribute('auto-rotate');
   const selected=select((chosen+delta+MODELS.length)%MODELS.length);
   if(selected&&keepOpen)load(Boolean(keepRotating));
   return selected;
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
    if(!viewer)status(count===MODELS.length?'Drei 3D-Originale vorgeladen · keine Engine gestartet':count+' / '+MODELS.length+' 3D-Originale vorgeladen · Rest auf Klick');
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
   const n=e.target.closest?.('[data-bf-model]');if(!n)return;
   const enter=Boolean(viewer)||n.hasAttribute?.('data-bf-enter');
   if(select(Number(n.dataset.bfModel))&&enter)load(true);
  });
  el('prev').addEventListener('click',()=>step(-1));
  el('next').addEventListener('click',()=>step(1));
  el('exhibit').addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault?.();step(-1);}if(e.key==='ArrowRight'){e.preventDefault?.();step(1);}});
  el('load').addEventListener('click',()=>load(false));
  el('installation').addEventListener('click',()=>{el('exhibit').scrollIntoView?.({behavior:'smooth',block:'start'});load(true);});
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
  return{load,preload,select,step,release,route,get chosen(){return chosen;},get warmed(){return warmed.size;}};
 }
 return{MODELS,DOORS,isFoyer,mount};
});
