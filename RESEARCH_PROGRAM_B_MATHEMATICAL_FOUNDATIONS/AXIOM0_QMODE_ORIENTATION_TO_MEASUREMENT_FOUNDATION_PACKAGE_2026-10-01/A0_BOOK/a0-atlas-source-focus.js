(function(root,factory){
 const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;
 else{root.A0AtlasSourceFocus=api;const boot=()=>api.mount(document,root);if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();}
})(typeof globalThis==='undefined'?this:globalThis,function(){
 'use strict';
 // Local presentation views of existing originals, not new engine identities.
 const SOURCES={
  'A0_AXIS08_FOLD_RETURN_SEQUENCER.html':{plate:'tessarec',panels:{sequencer:['sequencer'],pentagonSewing:['pentagonSewing'],sewingScore:['pentagonSewing','sewingScore'],generationLab:['generationLab']}},
  'A0_NEWTON_GOETHE_OBSERVER_LENS.html':{plate:'three-lenses',panels:{lens:['lens']}},
  'A0_BLACK_SUN_BIG_MOON.html':{plate:'eclipse',panels:{eclipse:['eclipse'],operator:['operator'],mirror:['mirror'],core:['core']}}
 };
 const PLATES=['tessarec','eclipse','three-lenses','caro'];
 function parse(url){
  const u=new URL(url,'https://atlas.invalid/'),file=u.pathname.split('/').pop(),source=SOURCES[file];if(!source)return null;
  const requested=u.searchParams.get('atlasPanel'),panel=source.panels[requested]?requested:null;
  const plate=PLATES.includes(u.searchParams.get('atlasPlate'))?u.searchParams.get('atlasPlate'):source.plate;
  return{file,plate,panel,sections:panel?source.panels[panel].slice():[],full:file+(panel?'#'+panel:''),back:'A0_FAMILY_CONNECTION_ATLAS.html?plate='+plate+'&focus=mechanisms#familyMechanisms'};
 }
 function mount(doc,win){
  const state=parse(win.location.href);if(!state||doc.getElementById('atlasSourceReturn'))return null;
  const main=doc.querySelector('main');if(!main)return null;
  const bar=doc.createElement('aside');bar.id='atlasSourceReturn';bar.className='atlas-source-bar';
  const label=doc.createElement('span');label.textContent=state.panel?'Originalfenster · eigene Regeln und Uhr':'Diese Mechanik im Zusammenhang erkunden';
  const back=doc.createElement('a');back.href=state.back;back.textContent='← Zur passenden Atlas-Werkstatt';back.target='_top';
  bar.append(label,back);
  if(state.panel){
   doc.documentElement.classList.add('atlas-source-focus');
   for(const child of [...main.children])if(!state.sections.includes(child.id)&&child.id!=='boundary')child.classList.add('atlas-source-hidden');
   const full=doc.createElement('a');full.href=state.full;full.target='_blank';full.rel='noopener';full.textContent='Vollständige Quelle ↗';bar.append(full);
  }
  main.before(bar);
  // Engines and their state contracts are deliberately untouched.
  return state;
 }
 return{SOURCES,PLATES,parse,mount};
});
