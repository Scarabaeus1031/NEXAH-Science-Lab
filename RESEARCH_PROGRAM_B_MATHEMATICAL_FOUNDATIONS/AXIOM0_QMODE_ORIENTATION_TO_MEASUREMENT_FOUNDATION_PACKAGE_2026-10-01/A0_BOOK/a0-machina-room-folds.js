(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.A0MachinaRoomFolds=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const SCHEMA='nexah.view.machina-room-folds/0.1.0-experimental';
  const ROOMS=Object.freeze([
    Object.freeze({selector:'#benchFoyer',id:'viewer',label:'VIEWER / EXHIBITION'}),
    Object.freeze({selector:'#machinaAssembly',id:'assembly',label:'ONE ASSEMBLY'}),
    Object.freeze({selector:'#ulliniriumScarabPort',id:'ullinirium',label:'ULLINIRIUM / SCARAB PORT'}),
    Object.freeze({selector:'#relationChamber',id:'relation',label:'RELATION CHAMBER'}),
    Object.freeze({selector:'#threeVortexSwitchyard',id:'switchyard',label:'THREE-VORTEX / WIRKUNG'}),
    Object.freeze({selector:'#splinterChordBay',id:'splinter',label:'SEHNEN-KNOB'}),
    Object.freeze({selector:'#machinaCockpitOrientation',id:'orientation',label:'COCKPIT / ORIENTIERUNG'}),
    Object.freeze({selector:'#machinaPentagonCockpit',id:'pentagon',label:'PENTAGON COCKPIT'}),
    Object.freeze({selector:'#trianglePhiLens',id:'lens',label:'π / φ TESTLINSE'})
  ]);
  function titleFor(room,config){const labelled=room.getAttribute('aria-labelledby');const title=labelled&&room.ownerDocument.getElementById(labelled);return(title?.textContent||config.label).replace(/\s+/g,' ').trim()}
  function createReceipt(states){return{schema:SCHEMA,host:'NEXAH_A0_ORIENTATION_CONTROLLER_BENCH',kind:'LOCAL_DISCLOSURE_CONTROL_ONLY',rooms:ROOMS.map(room=>({id:room.id,collapsed:Boolean(states[room.id])})),navigation:{deep_links_expand_ancestors:true,existing_tours_preserved:true},new_canonical_ids:[],relation_changes:[],aliases:[]}}
  function mount(doc=globalThis.document,win=globalThis.window){if(!doc)return null;const entries=ROOMS.map(config=>({config,room:doc.querySelector(config.selector)})).filter(entry=>entry.room);const quick=doc.querySelector('.bench-quick-access'),modes=doc.querySelector('.bench-modes');const bar=doc.createElement('nav');bar.className='machina-density-bar';bar.setAttribute('aria-label','Seitendichte und ausklappbare Machina-Räume');bar.innerHTML='<strong>SEITENANSICHT</strong><button type="button" data-menu-modes aria-pressed="true">RÄUME-MENÜ</button><button type="button" data-menu-quick aria-pressed="true">SCHNELLZUGRIFF</button><button type="button" data-fold-all>KOMPAKTE ANSICHT</button><button type="button" data-expand-all>ALLES ÖFFNEN</button>';(quick||modes)?.after(bar);
    const states={};
    function setCollapsed(entry,collapsed){const {room,config}=entry;states[config.id]=Boolean(collapsed);room.dataset.roomCollapsed=String(Boolean(collapsed));const button=room.querySelector(':scope > [data-room-toggle]');if(button){button.setAttribute('aria-expanded',String(!collapsed));button.textContent=collapsed?'ÖFFNEN +':'EINKLAPPEN −'}return !collapsed}
    entries.forEach(entry=>{const {room,config}=entry;room.dataset.machinaFold=config.id;room.dataset.roomCollapsed='false';const summary=doc.createElement('div');summary.className='machina-room-summary';summary.setAttribute('aria-hidden','true');summary.innerHTML=`<span><small>${config.label}</small><b>${titleFor(room,config)}</b></span>`;const button=doc.createElement('button');button.type='button';button.className='machina-room-toggle';button.dataset.roomToggle=config.id;button.setAttribute('aria-expanded','true');button.setAttribute('aria-label',`${titleFor(room,config)} einklappen`);button.textContent='EINKLAPPEN −';button.addEventListener('click',()=>setCollapsed(entry,room.dataset.roomCollapsed!=='true'));room.prepend(summary);room.append(button);states[config.id]=false});
    function foldAll(collapsed){entries.forEach(entry=>setCollapsed(entry,collapsed));bar.querySelector('[data-fold-all]').setAttribute('aria-pressed',String(collapsed));return createReceipt(states)}
    function expandForTarget(target){if(!target)return false;let changed=false;entries.filter(entry=>entry.room===target||entry.room.contains(target)).forEach(entry=>{if(entry.room.dataset.roomCollapsed==='true'){setCollapsed(entry,false);changed=true}});return changed}
    function expandHash(){const hash=win?.location?.hash;if(!hash||hash.length<2)return false;let target=null;try{target=doc.querySelector(hash)}catch(_error){return false}return expandForTarget(target)}
    function toggleMenu(menu,button){if(!menu)return false;menu.hidden=!menu.hidden;button.setAttribute('aria-pressed',String(!menu.hidden));return !menu.hidden}
    bar.querySelector('[data-fold-all]').addEventListener('click',()=>foldAll(true));bar.querySelector('[data-expand-all]').addEventListener('click',()=>foldAll(false));bar.querySelector('[data-menu-modes]').addEventListener('click',event=>toggleMenu(modes,event.currentTarget));bar.querySelector('[data-menu-quick]').addEventListener('click',event=>toggleMenu(quick,event.currentTarget));doc.addEventListener('click',event=>{const anchor=event.target.closest?.('a[href^="#"]');if(!anchor)return;const target=doc.getElementById(anchor.getAttribute('href').slice(1));expandForTarget(target)});win?.addEventListener?.('hashchange',expandHash);expandHash();return{entries,bar,foldAll,expandForTarget,expandHash,getReceipt:()=>createReceipt(states)}}
  if(typeof document!=='undefined'){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>mount(document,window),{once:true});else mount(document,window)}
  return{SCHEMA,ROOMS,titleFor,createReceipt,mount};
});
