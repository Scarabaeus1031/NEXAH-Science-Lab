/* Progressive disclosure only. Opening controls never writes reader or carrier state. */
(function(root,factory){
 const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;
 else{const ux=api.mount(document,root);if(ux)root.A0ClubUX=ux;}
})(typeof globalThis==='undefined'?this:globalThis,function(){
 'use strict';
 function reveal(target){
  if(!target)return false;
  for(let node=target;node;node=node.parentElement)if(node.tagName==='DETAILS')node.open=true;
  return true;
 }
 function familyPatch(doc,pickup,selectEdge){
  if(!pickup)return null;
  const svg=doc.createElementNS?doc.createElementNS('http://www.w3.org/2000/svg','svg'):doc.createElement('svg');
  svg.setAttribute('viewBox','0 0 280 116');svg.setAttribute('aria-label','Vorhandene Family-Verbindungen · Kabel anklicken');svg.className?.baseVal!==undefined?svg.className.baseVal='club-patch-cables':svg.setAttribute('class','club-patch-cables');
  pickup.append(svg);
  const colors={exact:'#69d39a',empirical:'#efbd55',method:'#54d7ef',open:'#ed7777',negative:'#b78aef'},dash={method:'5 4',open:'2 5',negative:'7 3 2 3'};
  return{refresh(state){
   if(!state?.edges)return;svg.replaceChildren();
   const id=state.family||state.elevatorFamily;
   for(const [key,edge]of Object.entries(state.edges)){
    if(id&&edge.a!==id&&edge.b!==id)continue;
    const path=doc.createElementNS?doc.createElementNS('http://www.w3.org/2000/svg','path'):doc.createElement('path');
    const a=20+(Number(edge.a.slice(1))-1)*40,b=20+(Number(edge.b.slice(1))-1)*40,depth=32+Math.abs(a-b)*.25;
    path.setAttribute('d','M '+a+' 2 C '+a+' '+depth+', '+b+' '+depth+', '+b+' 2');
    path.setAttribute('fill','none');path.setAttribute('stroke',colors[edge.status]);path.setAttribute('stroke-width',state.selectedEdge===key?'4':'2');
    path.setAttribute('style','color:'+colors[edge.status]);
    if(dash[edge.status])path.setAttribute('stroke-dasharray',dash[edge.status]);
    path.setAttribute('role','button');path.setAttribute('tabindex','0');path.setAttribute('aria-label',edge.a+' → '+edge.b+' · '+edge.label+' · '+edge.status);path.setAttribute('aria-pressed',String(state.selectedEdge===key));
    path.onclick=()=>selectEdge(key);path.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();selectEdge(key);}};svg.append(path);
   }
  }};
 }
 function arrangeConsole(doc,room,panel){
  const toolbar=room.querySelector('.spatial-toolbar'),body=room.querySelector('.spatial-body');
  if(!toolbar||!body)return false;
  toolbar.className+=' club-control-console';toolbar.setAttribute('aria-label','Bedienpult unter der Bühne');
  for(const tool of [...toolbar.querySelectorAll('[data-club-tool]')]){
   const group=doc.createElement('section');group.className='club-control-group';
   group.setAttribute('data-club-control',tool.dataset.clubTool);
   if(tool.id)group.id=tool.id;
   const summary=tool.querySelector('summary'),heading=doc.createElement('h3');
   if(summary){heading.append(...summary.children);group.append(heading);}
   const zoom=tool.querySelector('.club-zoom');if(zoom)panel.append(zoom);
   for(const child of [...tool.children])if(child!==summary)group.append(child);
   tool.before(group);tool.remove();
  }
  const pickup=room.querySelector('.club-pickup-console');
  if(pickup)pickup.after(toolbar);else body.after(toolbar);
  return true;
 }
 function assembleCockpit(doc,room,panel){
  const toolbar=room.querySelector('.club-control-console'),body=room.querySelector('.spatial-body');
  if(!toolbar||!body)return null;
  const board=doc.createElement('section');board.className='club-cockpit';board.setAttribute('aria-label','Club Machine · kompaktes Cockpit');
  body.after(board);
  const context=room.querySelector('.club-current'),pickup=room.querySelector('.club-pickup-console'),history=room.querySelector('.spatial-return');
  for(const node of [context,pickup,toolbar,history])if(node)board.append(node);
  const help=doc.createElement('details'),summary=doc.createElement('summary');help.className='club-cockpit-help';summary.textContent='Cockpit · Bedienung & Grenzen';help.append(summary);
  for(const field of toolbar.querySelectorAll('fieldset'))for(const node of [...field.children])if(node.tagName==='SMALL')help.append(node);
  const pickupNote=pickup?.querySelector('small');if(pickupNote)help.append(pickupNote);
  panel.append(help);
  const short={front:'A · vorne',back:'B · hinten'};
  for(const button of toolbar.querySelectorAll('button')){
   const old=button.textContent;button.title=button.title||old;
   if(button.dataset.room)button.textContent=old.split(' · ')[0];
   else if(short[button.dataset.action])button.textContent=short[button.dataset.action];
   else if(old==='◎ Gesamtansicht')button.textContent='◎ Gesamt';
  }
  const links=doc.createElement('nav');links.className='club-cockpit-links';links.setAttribute('aria-label','Weitere Club-Bereiche');
  // The source-bound route links retain their DOM nodes and hrefs.
  for(const selector of ['.club-guide:not(.club-connections)','.club-connections']){
   const nav=doc.querySelector(selector);if(nav)links.append(nav);
  }
  const orientation=room.querySelector('.jukebox-orientation');
  if(orientation){
   const glbLink=orientation.querySelector('a');if(glbLink)links.append(glbLink);
   orientation.hidden=true;
  }
  board.append(links);
  return board;
 }
 function arrangeStage(doc,room,panel){
  const body=room.querySelector('.spatial-body'),board=room.querySelector('.club-cockpit'),toolbar=room.querySelector('.club-control-console');
  if(!body||!board||!toolbar)return null;
  room.setAttribute('data-club-layout','stage');
  const top=doc.createElement('header');top.className='club-experience-bar';body.before(top);
  const context=room.querySelector('.club-current');if(context)top.append(context);
  const routes=room.querySelector('.club-cockpit-links');
  if(routes){
   for(const link of [...routes.querySelectorAll('a')])if(link.getAttribute('href')==='#jukeboxGLB')panel.append(link);
   const extra=doc.createElement('details'),summary=doc.createElement('summary');extra.className='club-secondary-routes';summary.textContent='Weitere Räume & Quellen';extra.append(summary,routes);panel.append(extra);
  }
  const controls=doc.createElement('aside');controls.className='club-stage-controls';controls.setAttribute('aria-label','Bühne einstellen');
  const coordinates=doc.createElement('div');coordinates.className='club-coordinate-row';
  const jointPatch=doc.querySelector?.('.demo-joints');
  if(jointPatch){body.after(jointPatch);}
  const pickup=room.querySelector('.club-pickup-console'),exhibit=room.querySelector('[data-club-control="exhibit"]');
  if(pickup)coordinates.append(pickup);if(exhibit)coordinates.append(exhibit);
  const legend=room.querySelector('[data-club-sign-legend]');
  if(board.children[0])board.children[0].before(coordinates);else board.append(coordinates);
  const where=panel.querySelector('[data-readout="where"]'),kicker=panel.querySelector('.kicker');
  if(where){
   where.className+=' club-detail-position';
   if(kicker)kicker.hidden=true;
  }
  const familyPicker=panel.querySelector('.club-family-picker'),stops=panel.querySelector('[data-readout="stops"]');
  if(familyPicker){
   const summary=familyPicker.querySelector('summary');if(summary)summary.textContent='Family Elevator · F1–F7 / Quelle · Ansicht · Grenze';
   if(stops)familyPicker.append(stops);
  }
  controls.append(toolbar);body.append(controls);
  if(pickup){
   const title=pickup.querySelector('strong');if(title)title.textContent='Families · F1–F7';
   controls.append(pickup);
  }
  const plates=room.querySelector('.club-pickup-plates');
  if(plates){
   const elevator=doc.createElement('section'),heading=doc.createElement('h3');
   elevator.className='club-control-group';elevator.setAttribute('data-club-control','elevator');
   heading.textContent='Family Elevator';plates.setAttribute('aria-label','Elevator · Quelle, Ansicht, Grenze');
   elevator.append(heading,plates);toolbar.append(elevator);
  }
  if(legend){legend.className+=' club-stage-legend';toolbar.append(legend);}
  const edges=panel.querySelector('[data-readout="edges"]'),joint=panel.querySelector('[data-readout="joint"]');
  if(edges){
   const oldDisclosure=edges.parentElement,connections=doc.createElement('section'),heading=doc.createElement('h3');
   connections.className='club-live-connections';connections.setAttribute('aria-label','Verbindungen der aktuellen Family');
   heading.textContent='Records · Verbindungen';connections.append(heading,edges);if(joint)connections.append(joint);
   controls.append(connections);
   if(oldDisclosure?.tagName==='DETAILS'&&oldDisclosure.children.length===1)oldDisclosure.remove();
  }
  const drawer=doc.createElement('details');drawer.className='club-explanation-drawer';
  const summary=doc.createElement('summary');summary.textContent='Auswahl erklären · Bench & Details';drawer.append(summary,panel);
  coordinates.after(drawer);
  coordinates.hidden=true;
  return{drawer,summary};
 }
 function mount(doc,win){
  const room=doc.getElementById('familySpatialMount'),panel=doc.getElementById('clubBenchPanel');
  if(!room||!panel)return null;
  const toolbar=room.querySelector('.spatial-toolbar'),roomChoices=room.querySelector('[data-control="rooms"]');
  let exhibitChoices=null;
  if(toolbar&&roomChoices){
   const tool=doc.createElement('details');tool.className='club-tool';tool.dataset.clubTool='exhibit';tool.setAttribute('name','club-main-tools');
   const summary=doc.createElement('summary'),title=doc.createElement('span'),label=doc.createElement('small');
   title.textContent='Exponat';label.setAttribute('data-club-current','exhibit');label.textContent='Keines';summary.append(title,label);
   const field=doc.createElement('fieldset'),legend=doc.createElement('legend');legend.textContent='02 · Exponat ausstellen';
   exhibitChoices=doc.createElement('div');exhibitChoices.className='club-exhibit-buttons';exhibitChoices.setAttribute('role','group');exhibitChoices.setAttribute('aria-label','Exponat wählen');
   for(const [value,name]of [['none','Keines'],['bluebody','Blue Body'],['dodeca','Dodeca']]){
    const button=doc.createElement('button');button.type='button';button.dataset.exhibit=value;button.textContent=name;
    button.onclick=()=>{win.A0ClubTours?.interrupt('Exponat gewechselt · Pause');win.A0FamilySpatialReader?.setExhibit(value);};exhibitChoices.append(button);
   }
   const note=doc.createElement('small');note.textContent='Quellkörper im gewählten Raum. Keine Zuordnung von Körperflächen zu Families.';
   field.append(legend,exhibitChoices,note);tool.append(summary,field);toolbar.querySelector('[data-club-tool="room"]').after(tool);
   const viewLegend=toolbar.querySelector('[data-club-tool="view"] legend');if(viewLegend)viewLegend.textContent='Perspektive wählen';
   const viewTitle=toolbar.querySelector('[data-club-tool="view"] summary span');if(viewTitle)viewTitle.textContent='Perspektive';
   const roomTitle=toolbar.querySelector('[data-club-tool="room"] summary span');if(roomTitle)roomTitle.textContent='Grundform';
   const lightTitle=toolbar.querySelector('[data-club-tool="light"] summary span');if(lightTitle)lightTitle.textContent='Licht · LJ';
   const lightLegend=toolbar.querySelector('[data-club-tool="light"] legend');if(lightLegend)lightLegend.textContent='04 · Light Jockey';
   const overview=doc.createElement('button');overview.type='button';overview.textContent='◎ Gesamtansicht';overview.title='Erhöhte Gesamtperspektive · ganze Maschine einpassen';overview.setAttribute('data-club-overview','');overview.setAttribute('aria-pressed','false');overview.onclick=()=>win.A0FamilySpatialReader?.overview();
   const hold=doc.createElement('button');hold.type='button';hold.textContent='Grid';hold.title='Orientierungsraster ein/aus · keine neue Adresszuordnung';hold.setAttribute('data-club-grid','');hold.setAttribute('aria-pressed','false');
   hold.onclick=()=>{const reader=win.A0FamilySpatialReader;reader?.setGuideHeld(!reader.guide().held);hold.setAttribute('aria-pressed',String(reader?.guide().held||false));};
   toolbar.querySelector('[data-club-tool="view"] .demo-control-row')?.append(overview,hold);
   const feedback=doc.createElement('output');feedback.setAttribute('data-view-feedback','');feedback.textContent='Seite A · Kamera dreht, Raum bleibt';
   toolbar.querySelector('[data-club-tool="view"] fieldset')?.append(feedback);
  }
  const consoleReady=arrangeConsole(doc,room,panel);
  const tools=[...room.querySelectorAll('[data-club-tool]')],bench=room.querySelector('[data-club-bench]');
  const names={cylinder:'Zylinder',polar:'Polar',plate:'Platte',bluebody:'Blue Body',dodeca:'Dodeca'};
  let benchOpen=false,lastEdge=null,stage=null,patch=null;
  const context=doc.createElement('div');context.className='club-current';
  const current=doc.createElement('output');current.setAttribute('aria-live','polite');
  const explain=doc.createElement('button');explain.type='button';explain.textContent='Auswahl erklären →';explain.onclick=()=>setBench(true,true);
  context.append(current,explain);room.querySelector('.spatial-body').before(context);
  if(consoleReady)context.append(bench);
  function resize(){win.requestAnimationFrame(()=>win.A0FamilySpatialReader?.resize());}
  function refresh(){
   const state=win.A0FamilySpatialReader?.snapshot();if(!state)return;
   room.setAttribute('data-club-view',benchOpen?'bench':'experience');panel.hidden=!benchOpen;
   bench.setAttribute('aria-expanded',String(benchOpen));
   bench.innerHTML=benchOpen?'Club erleben <small>Bench wieder schließen</small>':'Club Bench öffnen <small>Families · Joints · Details</small>';
   const labels={room:names[state.layout]||state.layout,exhibit:names[state.exhibit]||'Keines',view:state.camera?.pitch>=1.03?'Gesamt':state.camera?Math.cos(state.camera.yaw+.35)>=0?'Seite A':'Seite B':room.getAttribute('data-side')==='b'?'Seite B':'Seite A',light:{read:'Leselicht',room:'Farbraum',dance:'Bühne läuft'}[win.A0JukeboxStage?.snapshot().mode]||'Farbraum'};
   const grid=room.querySelector('[data-club-grid]');if(grid)grid.setAttribute('aria-pressed',String(win.A0FamilySpatialReader?.guide?.().held||false));
   if(exhibitChoices)for(const button of exhibitChoices.children)button.setAttribute('aria-pressed',String(button.dataset.exhibit===(state.exhibit||'none')));
   for(const [key,value]of Object.entries(labels)){const el=room.querySelector('[data-club-current="'+key+'"]');if(el)el.textContent=value;}
   current.textContent=labels.room+' · '+labels.exhibit+' · '+labels.view+' · '+labels.light+' · '+(state.family||state.elevatorFamily)+' · '+({zeta:'ζ Quelle',theta:'θ Ansicht',beta:'β Grenze'}[state.stop]||state.stop);
   win.A0ClubTours?.refresh();
   patch?.refresh(win.A0FamilyAtlasBridge?.snapshot());
  }
  function setBench(open,focus=false){
   benchOpen=!!open;if(stage&&stage.drawer.open!==benchOpen)stage.drawer.open=benchOpen;refresh();resize();
   if(focus){const target=doc.getElementById('jointExplanation');reveal(target);win.requestAnimationFrame(()=>target?.scrollIntoView({block:'nearest'}));}
  }
  bench.onclick=()=>setBench(!benchOpen);
  for(const tool of tools)tool.addEventListener('toggle',()=>{
   if(tool.open)for(const other of tools)if(other!==tool)other.open=false;
   resize();
  });
  // Preserve the actual inspector and its bindings; fold only secondary facts.
  const facts=doc.getElementById('jointFacts'),article=doc.getElementById('jointExplanation');
  if(facts&&article){
   const details=doc.createElement('details'),summary=doc.createElement('summary');summary.textContent='Technische Angaben & Quelle';
   facts.before(details);details.append(summary,facts);
   const source=article.querySelector('a');if(source)details.append(source);
  }
  const notes=room.querySelector('[data-club-notes]'),relation=room.querySelector('.spatial-relations'),history=room.querySelector('.spatial-return');
  if(notes&&relation){
   const actions=[...relation.querySelectorAll('button')];for(const button of actions){button.setAttribute('data-club-transition-control','');history.append(button);}
   if(actions[0])actions[0].textContent='Übergang zurück';
   notes.append(relation);
   for(const note of room.querySelectorAll(':scope > p.spatial-note'))notes.append(note);
  }
  const glb=doc.getElementById('jukeboxGLB');
  if(glb){
   const drawer=doc.createElement('details'),summary=doc.createElement('summary');drawer.className='club-glb-drawer';drawer.id='clubGLBDrawer';
   summary.textContent='3D / GLB öffnen · eigenes Modell & Export';glb.before(drawer);drawer.append(summary,glb);
   drawer.addEventListener('toggle',()=>{if(!drawer.open){glb.querySelector('model-viewer')?.pause?.();const play=doc.getElementById('jukeboxGLBPlay');if(play)play.textContent='Animation starten';}});
  }
  if(consoleReady){
   assembleCockpit(doc,room,panel);stage=arrangeStage(doc,room,panel);
   patch=familyPatch(doc,room.querySelector('.club-pickup-console'),id=>win.A0FamilyAtlasBridge?.selectEdge(id));
   if(stage){
    explain.hidden=true;bench.hidden=true;
    stage.drawer.addEventListener('toggle',()=>{if(benchOpen!==stage.drawer.open)setBench(stage.drawer.open);});
   }
  }
  function followHash(){
   let id;try{id=decodeURIComponent((win.location.hash||'').slice(1));}catch{return}
   if(!id)return;const target=doc.getElementById(id);if(!target)return;
   if(panel.contains(target))setBench(true);
   reveal(target);
   if(id==='clubLights'){for(const tool of tools)tool.open=tool.dataset.clubTool==='light';}
   win.requestAnimationFrame(()=>{win.A0FamilySpatialReader?.resize();target.scrollIntoView({block:'start'});});
  }
  doc.addEventListener('a0:family-atlas-selection',()=>{
   const id=win.A0FamilyAtlasBridge?.snapshot().selectedEdge||null;
   if(id&&id!==lastEdge)setBench(true);
   lastEdge=id;refresh();
  });
  doc.addEventListener('keydown',event=>{
   if(event.key!=='Escape')return;
   const tool=tools.find(t=>t.open&&t.contains(event.target));
   if(tool){tool.open=false;tool.querySelector('summary')?.focus();resize();}
   else if(benchOpen&&panel.contains(event.target)){setBench(false);(stage?.summary||bench).focus();}
  });
  win.addEventListener('hashchange',followHash);refresh();resize();followHash();
  return{refresh,setBench,followHash,snapshot:()=>({benchOpen,openTools:tools.filter(t=>t.open).map(t=>t.dataset.clubTool),scope:'ui-disclosure-only'})};
 }
 return{reveal,familyPatch,arrangeConsole,assembleCockpit,arrangeStage,mount};
});
