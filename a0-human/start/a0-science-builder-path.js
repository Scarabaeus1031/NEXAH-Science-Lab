(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 else{root.A0ScienceBuilderPath=api;const boot=()=>api.mount(document,root);if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();}
})(typeof globalThis==='undefined'?this:globalThis,function(){
 'use strict';
 // Presentation cut over existing sources, not an asset/Family identity registry.
 const EXPLAIN=new Set(['A0_SCIENCE.html','A0_METHOD.html','A0_NEXAH_RESEARCH_METHOD.html','A0_NEXAH_FAMILY_METHOD_WHITE_PAPER.html','A0_FAMILY_CONNECTION_ATLAS.html','A0_FIELDS_AND_JOINTS_ATLAS.html','A0_MATHEMATICAL_JOINTS.html','A0_LIVING_BLUEPRINT.html','A0_THEORY_STORYBOARD.html','A0_NUMBERMAGICK_GRID_RESEARCH.html']);
 const WORK=new Set(['A0_ORIENTATION_CONTROLLER_BENCH.html','A0_TESSAREC_BLUE_BODY_LAB.html']);
 const EXPERIENCE=new Set(['A0_RAINBOW_PURPLE_RAIN.html','A0_BLACK_SUN_BIG_MOON.html','A0_NEON_TRAP_DOOR.html','A0_NEWTON_GOETHE_OBSERVER_LENS.html','A0_THE_LIVING_INTERIOR.html']);
 const HANDS_ON=new Set(['A0_BLUE_PINK_DODECA_CELL_RETURN.html','A0_BLUE_BODY_DODECA_COUNTERSHOT.html','A0_IHARA_HASHIMOTO_CYCLE_BRIDGE.html','A0_AXIS08_FOLD_RETURN_SEQUENCER.html','A0_GAME_OF_WORLDS_PLAY.html']);
 const INTERNAL=new Set(['A0_SCIENCE.html','A0_SCIENCE.html','A0_SCIENTIFIC_POSITION_REPORT.html','A0_WERKBANK.html','A0_SCIENTIFIC_POSITION_REPORT.html']);
 function purpose(entry){
  const file=(entry.path||'').split(/[?#]/)[0];
  if(EXPLAIN.has(file))return 'explain';
  if(INTERNAL.has(file)||/_PAPER\.html$/.test(file))return 'record';
  if(file==='A0_NEXAH_APERTURE_JOURNEY.html'||entry.role==='reader')return 'reader';
  if(WORK.has(file))return 'work';
  if(EXPERIENCE.has(file))return 'experience';
  if(HANDS_ON.has(file)||entry.role==='instrument')return 'instrument';
  return entry.role==='record'?'record':'unclassified';
 }
 function inToyStore(entry){return ['instrument','experience','work'].includes(purpose(entry));}
 const KEY='a0.family.reading-position.v1';
 function validReader(s){
  const family=x=>x===null||/^F[1-7]$/.test(x),stop=x=>['zeta','theta','beta'].includes(x);
  return !!s&&typeof s==='object'&&family(s.family)&&/^F[1-7]$/.test(s.elevatorFamily)&&stop(s.stop)&&
   ['sync','family','sequence','joint','elevator','tessarec'].includes(s.mode)&&
   ['plate','polar','cylinder','bluebody','dodeca'].includes(s.layout)&&
   (s.stage===null||/^T[1-8]$/.test(s.stage))&&typeof s.route==='string'&&s.route.length<60&&
   !!s.camera&&['yaw','pitch','zoom'].every(k=>typeof s.camera[k]==='number'&&Number.isFinite(s.camera[k]))&&
   Math.abs(s.camera.yaw)<=1e6&&Math.abs(s.camera.pitch)<=1.3&&s.camera.zoom>=.55&&s.camera.zoom<=1.7;
 }
 function packet(state){
  if(!validReader(state))return null;
  return{schema:'A0_FAMILY_READING_POSITION_V1',state:{family:state.family,elevatorFamily:state.elevatorFamily,stop:state.stop,mode:state.mode,layout:state.layout,stage:state.stage,route:state.route,camera:{yaw:state.camera.yaw,pitch:state.camera.pitch,zoom:state.camera.zoom}}};
 }
 function read(storage){try{const p=JSON.parse(storage.getItem(KEY));return p?.schema==='A0_FAMILY_READING_POSITION_V1'?packet(p.state):null;}catch{return null;}}
 function save(storage,state){const p=packet(state);if(!p)return false;try{storage.setItem(KEY,JSON.stringify(p));return true;}catch{return false;}}
 function mount(doc,win){
  const panels=[...doc.querySelectorAll('[data-reading-path]')];if(!panels.length)return null;
  let storage;try{storage=win.sessionStorage;}catch{}
  const saved=()=>read(storage);
  panels.forEach(panel=>{if(panel.dataset.readingPath==='return')panel.hidden=!saved();});
  const status=message=>doc.querySelectorAll('[data-reading-status]').forEach(n=>{n.textContent=message;});
  const resume=doc.querySelector('[data-reading-resume]');
  if(resume){resume.hidden=!saved();resume.addEventListener('click',()=>{
   const p=saved(),reader=win.A0FamilySpatialReader;
   if(!p||!reader?.resume?.(p.state)){status('Leseposition nicht wiederherstellbar. Die Raumkarte bleibt unabhängig bedienbar.');return;}
   status('Leseposition wiederhergestellt · Family, Blick und Kamera; kein Instrumentzustand übertragen.');
  });}
  doc.addEventListener('click',event=>{
   if(!event.target.closest?.('[data-reading-depart]'))return;
   const state=win.A0FamilySpatialReader?.snapshot();
   status(save(storage,state)?'Leseposition für diese Sitzung behalten. Der Zielpfad startet keine Quelle.':'Leseposition hier nicht speicherbar. Der normale Rücklink zur Raumkarte bleibt verfügbar.');
  });
  return{read:saved};
 }
 return{EXPLAIN,WORK,EXPERIENCE,HANDS_ON,INTERNAL,purpose,inToyStore,KEY,validReader,packet,read,save,mount};
});
