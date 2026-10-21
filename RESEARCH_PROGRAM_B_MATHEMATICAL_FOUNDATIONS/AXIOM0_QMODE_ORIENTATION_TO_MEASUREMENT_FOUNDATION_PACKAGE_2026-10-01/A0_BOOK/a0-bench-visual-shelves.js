(function(root,factory){
 const node=typeof module==='object'&&module.exports;
 const api=factory(node?require('./a0-bench-map.js'):root.A0BenchMap,node?require('./a0-bench-foyer.js'):root.A0BenchFoyer,node?require('./a0-bench-body-gallery.js'):root.A0BenchBodyGallery,node?require('./a0-bench-structure-visuals.js'):root.A0BenchStructureVisuals);
 if(node)module.exports=api;
 else{root.A0BenchVisualShelves=api;root.A0BenchVisualShelvesController=api.mount(document,root);root.A0BenchWalkController?.render();}
})(typeof globalThis==='undefined'?this:globalThis,function(MapModel,Foyer,Body,Structure){
 'use strict';
 // Existing shelf roles and colours. Reading lenses, not canonical admission.
 const ROLES={
  F1:['Observation / Record','#f35fa7'],F2:['Address / Boundary','#49d2e8'],
  F3:['Transition / Operator','#ffc94d'],F4:['Phase / Drift','#ffc94d'],
  F5:['Connectivity / Topology','#a98aff'],F6:['Synchronization / Control','#65dcb2'],
  F7:['Validation / Governance','#e49c65']
 };
 // Editorial shelf membership. This is deliberately distinct from F1–F7.
 const MEMBERS=[
  ['body-route','native-face','perspectives','sewing'],
  ['orbit-grid','breath-grid','family-grid','ghostgons','aperture-stack','fold-lag'],
  ['game-atlas','life03'],
  ['operators','ihara','mask-clock','antipode','ail'],
  ['mask-observer','integration','lens-return','prism','measurement','visual1'],
  ['pascal-aperture','division-return','number-return','ninefold','go-return','root7','economy','replay','history','record'],
  ['family-role','binder'],[],['glb-archive','source-bank','pent']
 ];
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const primary=id=>{const i=MEMBERS.findIndex(ids=>ids.includes(id));return i<0?7:i;};
 function entries(){
  const modules=MapModel.MODULES.map(m=>({id:m.id,title:m.label,copy:m.description,href:'#'+m.focusTarget,target:m.focusTarget,group:m.group,area:primary(m.id),module:m.id}));
  const body=Body.ITEMS.map((m,i)=>({id:'body-view-'+i,title:m.title,copy:m.copy,href:m.href,group:'SOURCE',area:m.kind==='plates'?1:0,body:i,bodyRoute:m.route||null}));
  const arcade=['domains','life','numbers'].map((world,i)=>({id:'arcade-'+world,title:['Three Domains','LIFE','Numbers'][i],copy:'Eigenes Arcade-Instrument öffnen; Regeln und Lauf bleiben im Original.',href:'A0_GAME_OF_WORLDS_PLAY.html?world='+world+'#'+world,group:'SOURCE',area:2}));
  const grids=[
   {id:'grid-collection',title:'Grid-Sammlung · gemeinsamer Einstieg',copy:'Die vorhandenen Grid-Träger vergleichen und von dort ein Original wählen.',href:'A0_NUMBERMAGICK_GRID_RESEARCH.html#grid-collection',group:'VIEW',area:1},
   {id:'pink-grid',title:'Pink Diamond Grid Atlas',copy:'Ghost-Auswahl, CRT-Adressen und getrennte Grid-Träger erkunden. Nicht dasselbe Instrument wie das Blue / Pink Lab.',href:'A0_PINK_DIAMOND_GRID_ATLAS.html#ghost-tiles',group:'VIEW',area:1}
  ];
  return [...body,...modules,...arcade,...grids];
 }
 function families(entry,map){
  const source=entry.body!==undefined?(entry.bodyRoute==='interior'?'A0_TESSAREC_BLUE_BODY_LAB.html#blue-body-interior-crt16':entry.bodyRoute?'A0_TESSAREC_BLUE_BODY_LAB.html#pentagon-body-player':null):entry.module?'A0_ORIENTATION_CONTROLLER_BENCH.html#'+entry.target:entry.href;
  if(!source)return [];
  return [...new Set((map?.nodes||[]).filter(n=>n.href===source).flatMap(n=>n.families||[]))].filter(f=>ROLES[f]);
 }
 function select(all,{area=-1,role='ALL',group='ALL',query=''}={},map){
  const q=query.trim().toLocaleLowerCase('de');
  return all.filter(e=>(area<0||area===7||e.area===area||area===0&&e.body!==undefined||e.module&&MEMBERS[area]?.includes(e.module))&&(role==='ALL'||(role==='OPEN'?families(e,map).length===0:families(e,map).includes(role)))&&(group==='ALL'||e.group===group)&&(!q||[e.title,e.copy,e.id].join(' ').toLocaleLowerCase('de').includes(q)));
 }
 function preview(entry,doc){
  if(entry.body!==undefined)return{html:Body.svg(Body.ITEMS[entry.body]),label:'Feste Quellgeometrie · Galerieprojektion'};
  if(entry.module){
   const card=doc?.querySelector('[data-btc-card="'+entry.module+'"]');
   if(card&&['svg','canvas'].includes(card.dataset.preview)){
    const img=card.querySelector('[data-btc-image]');
    if(img?.src?.startsWith('data:image/'))return{html:'<img src="'+esc(img.src)+'" alt="" loading="lazy" decoding="async">',label:'Quellansicht · Momentaufnahme'};
   }
  }
  const visual=Structure.image(entry.group);
  return{html:'<img src="'+esc(visual.url)+'" alt="" loading="lazy" decoding="async">',label:entry.group+' · '+visual.label+' · Gruppenreferenz, kein Originalbild dieses Moduls'};
 }
 function badges(e,map){
  const f=families(e,map);
  return f.length?f.map(id=>'<span style="--role:'+ROLES[id][1]+'" title="Vorhandene lokale Leselinse: '+ROLES[id][0]+'">'+id+' · '+esc(ROLES[id][0])+'</span>').join(''):'<span class="bvs-open">Family-Leselinse offen</span>';
 }
 function demonstrator(e){
  if(e.bodyRoute==='interior')return 'A0_TESSAREC_BLUE_BODY_LAB.html#blue-body-interior-crt16';
  if(e.bodyRoute==='player'||e.module==='body-route')return 'A0_TESSAREC_BLUE_BODY_LAB.html#pentagon-body-player';
  if(e.module==='native-face')return 'A0_BLUE_PINK_DODECA_CELL_RETURN.html#formation';
  if(e.module==='game-atlas')return 'A0_GAME_OF_WORLDS_PLAY.html?world=domains#domains';
  if(e.id==='pink-grid')return 'A0_PINK_DIAMOND_GRID_ATLAS.html#crt16-tile';
  return null;
 }
 function card(e,doc,map,room){
  const p=preview(e,doc),demo=demonstrator(e);
  return '<article class="bvs-card" data-shelf-card="'+e.id+'"><a class="bvs-picture" href="'+esc(e.href)+'" data-shelf-open="'+e.id+'">'+p.html+'<small>'+p.label+'</small></a><div class="bvs-copy"><div class="bvs-badges">'+badges(e,map)+'</div><h3><a data-shelf-open="'+e.id+'" href="'+esc(e.href)+'">'+esc(e.title)+'</a></h3><p>'+esc(e.copy)+'</p><div class="bvs-card-links"><a data-shelf-open="'+e.id+'" href="'+esc(e.href)+'">Instrument öffnen ↗</a>'+(demo?'<a class="bvs-demonstrator" href="'+demo+'">Demonstrator erleben ↗</a>':'')+(room===undefined?'<a href="#bench-area-'+e.area+'">Rubrik kennenlernen →</a>':'')+'</div></div></article>';
 }
 function shelfMarkup(list,doc,map,room){
  // One group visual above; module rows retain explanations and source legends.
  return '<div class="bvs-grid bvs-list" role="list">'+list.map(e=>{
   const demo=demonstrator(e),binding=e.module?MapModel.MODULES.find(m=>m.id===e.module)?.bindingType:'LAUNCHER';
   return '<article class="bvs-row" role="listitem" data-shelf-card="'+e.id+'"><div class="bvs-row-main"><h3><a data-shelf-open="'+e.id+'" href="'+esc(e.href)+'">'+esc(e.title)+'</a></h3><p>'+esc(e.copy)+'</p><div class="bvs-badges"><span>'+esc(binding||'LAUNCHER')+'</span>'+badges(e,map)+'</div></div><div class="bvs-card-links"><a data-shelf-open="'+e.id+'" href="'+esc(e.href)+'">Instrument öffnen ↗</a>'+(demo?'<a class="bvs-demonstrator" href="'+esc(demo)+'">Demonstrator erleben ↗</a>':'')+'</div></article>';
  }).join('')+'</div>';
 }
 function groupVisual(area){
  if([0,1,8].includes(area))return{html:Body.svg(Body.ITEMS[{0:0,1:4,8:1}[area]]),label:'Feste Quellgeometrie · ausgewählte Referenz, nicht die gesamte Rubrik'};
  if(area===2)return{html:'<span class="bvs-type-visual"><b>LIFE</b><b>THREE DOMAINS</b><b>NUMBERS</b></span>',label:'Drei bestehende Spiele · Navigationslegende, keine Live-Vorschau'};
  if(area===6)return{html:'<span class="bvs-type-visual"><b>'+MapModel.MODULES.length+' Module</b><b>↔ '+MapModel.EDGES.length+' Kantenrecords</b></span>',label:'Umfang des lokalen Bench-Schaltbilds · kein vollständiges NEXAH-Inventar'};
  const im=Structure.image({3:'OPERATE',4:'VIEW',5:'RETURN',7:'STATE'}[area]);
  return{html:'<img src="'+esc(im.url)+'" alt="" decoding="async">',label:im.label+' · ausgewählte Rubrikreferenz'};
 }
 function groupTiles(doc,map){
  return Foyer.DOORS.map((d,i)=>{
   const visual=groupVisual(i),count=select(entries(),{area:i},map).length;
   return '<button type="button" class="bvs-group-tile" id="bvs-group-'+i+'" data-shelf-area="'+i+'" aria-expanded="false" aria-controls="bvs-expanded-group"><span class="bvs-tile-visual" aria-hidden="true">'+visual.html+'</span><span class="bvs-tile-copy"><small>0'+(i+1)+' · '+count+' Einträge</small><strong>'+esc(d[0])+'</strong><span>'+esc(d[1])+'</span><small class="bvs-visual-label">'+esc(visual.label)+'</small><span class="bvs-tile-action">Bausteine ausklappen <b aria-hidden="true">＋</b></span></span></button>';
  }).join('');
 }
 function roomMarkup(area,title,copy,doc,map){
  const list=select(entries(),{area},map),v=groupVisual(area);
  const reading=area===1?'<aside class="reading-path" data-reading-path="bench"><h3>Science → Bauteil → Instrument</h3><nav aria-label="Grid-Beispielpfad"><a href="A0_PINK_DIAMOND_GRID_ATLAS.html#ghost-tiles">Pink Grid ansehen →</a><a href="A0_PINK_DIAMOND_GRID_ATLAS.html#crt16-tile">CRT16-Instrument öffnen →</a><a href="A0_FAMILY_CONNECTION_ATLAS.html#spatial-navigation">← Zusammenhang verstehen · Family-Raumkarte</a></nav><small>In der Raumkarte lässt sich eine zuvor gespeicherte Leseposition wiederherstellen. Die Rubrik ist keine Family und kein gemeinsamer Instrumentzustand.</small></aside>':'';
  return '<header class="bvs-room-head"><small>RUBRIK · '+(area+1)+' / 9</small><h1 tabindex="-1">'+esc(title)+'</h1><p>'+esc(copy)+'</p></header>'+reading+'<figure class="bvs-master">'+v.html+'<figcaption>'+esc(v.label)+'</figcaption></figure>'+shelfMarkup(list,doc,map,area);
 }
 function promoteViews(doc){
  // Reuse the actual drawing nodes; only these standalone instrument layouts.
  const targets=[['maskObserverBench','.mask-observer-views'],['benchIntegration','[data-bi-drawing]'],['orbitGridJoints','[data-ogj-drawing]'],['plateMirrorBench','.plate-mirror-views'],['breathGridBench','[data-bg-drawing]']];
  let count=0;
  for(const [id,selector]of targets){
   const host=doc.getElementById(id),heading=host?.querySelector('h2'),view=host?.querySelector(selector);
   if(heading&&view&&view.parentElement===host){heading.after(view);count++;}
  }
  return count;
 }
 function mount(doc,win){
  const host=doc.getElementById('benchVisualShelves');if(!host)return null;
  const all=entries();let area=-1,role='ALL',group='ALL',query='';
  host.innerHTML='<nav class="bvs-areas" aria-label="Gruppe aufklappen">'+groupTiles(doc,win.A0OrientationMap)+'</nav><details class="bvs-lenses"><summary>Legende, Family-Leselinsen &amp; gezielte Suche</summary><p>Die neun Rubriken sind Arbeitsregale, nicht neun Families. Bilder sind beschriftete feste Referenzen, keine Live-Vorschauen. In den Listen bleiben Bindungstyp und vorhandene F1–F7-Leselinsen sichtbar. Farben allein begründen keine Zuordnung.</p><div><label>Leselinse <select data-shelf-role><option value="ALL">Alle / offen</option>'+Object.entries(ROLES).map(([id,v])=>'<option value="'+id+'">'+id+' · '+v[0]+'</option>').join('')+'<option value="OPEN">Zuordnung offen</option></select></label><label>Arbeitsgruppe <select data-shelf-group><option value="ALL">Alle</option>'+MapModel.GROUPS.map(g=>'<option value="'+g.id+'">'+esc(g.title)+'</option>').join('')+'</select></label><label>Suche <input data-shelf-query type="search" placeholder="Modul oder Begriff" autocomplete="off"></label><button data-shelf-reset type="button">Zurücksetzen</button></div></details><output class="bvs-status" data-shelf-count role="status" aria-live="polite"></output><section id="bvs-expanded-group" class="bvs-expanded-group" data-shelf-panel hidden aria-labelledby="bvs-expanded-title"><header class="bvs-expanded-head"><div><small data-shelf-scope></small><h3 id="bvs-expanded-title" data-shelf-title></h3></div><button data-shelf-close type="button">Liste einklappen ↑</button></header><div class="bvs-result-bar"><span>Instrumente öffnen nur ihr bestehendes Ziel; kein Lauf startet hier.</span><a data-shelf-about hidden>Rubrik im Rundgang →</a></div><div data-shelf-results></div></section>';
  const el=n=>host.querySelector('[data-shelf-'+n+']');
  function render(){
   const list=select(all,{area,role,group,query},win.A0OrientationMap);
   const expanded=area>=0||role!=='ALL'||group!=='ALL'||!!query.trim();
   el('panel').hidden=!expanded;
   el('results').innerHTML=!expanded?'':list.length?shelfMarkup(list,doc,win.A0OrientationMap,area):'<p class="bvs-empty">Keine passenden Bausteine. Filter zurücksetzen oder eine andere Leselinse wählen.</p>';
   el('title').textContent=area>=0?Foyer.DOORS[area][0]:'Suchergebnisse · alle Rubriken';
   el('scope').textContent=area>=0?Foyer.DOORS[area][1]:'Gezielte Auswahl über die vorhandenen Regale';
   el('count').textContent=expanded?list.length+' Einträge'+(area>=0?' · '+Foyer.DOORS[area][0]:' · rubrikübergreifend'):'Neun Gruppen · eine Kachel wählen, um ihre Bausteine aufzuklappen.';
   el('about').hidden=area<0;if(area>=0)el('about').href='#bench-area-'+area;
   host.querySelectorAll('[data-shelf-area]').forEach(b=>{const expanded=Number(b.dataset.shelfArea)===area;b.setAttribute('aria-expanded',String(expanded));const action=b.querySelector('.bvs-tile-action');if(action)action.innerHTML=expanded?'Bausteine einklappen <b aria-hidden="true">−</b>':'Bausteine ausklappen <b aria-hidden="true">＋</b>';});
  }
  host.addEventListener('click',event=>{
   const chip=event.target.closest?.('[data-shelf-area]');if(chip){const next=Number(chip.dataset.shelfArea);if(!Number.isInteger(next)||next<0||next>=Foyer.DOORS.length)return;area=next===area?-1:next;render();if(area>=0)el('panel').scrollIntoView({block:'nearest',behavior:'auto'});}
  });
  el('role').addEventListener('change',()=>{role=el('role').value;render();});
  el('group').addEventListener('change',()=>{group=el('group').value;render();});
  el('query').addEventListener('input',()=>{query=el('query').value;render();});
  function reset(){area=-1;role=group='ALL';query='';el('role').value=el('group').value='ALL';el('query').value='';render();}
  el('reset').addEventListener('click',reset);
  el('close').addEventListener('click',()=>{const previous=area;reset();if(previous>=0)doc.getElementById('bvs-group-'+previous)?.focus();});
  function open(id){
   const e=all.find(e=>e.id===id);if(!e||!e.href.startsWith('#'))return false;
   const target=doc.getElementById(e.href.slice(1));if(!target)return false;
   const room=/^#bench-area-([0-8])$/.exec(win.location.hash);
   win.A0BenchWalkController?.remember(room?Number(room[1]):area>=0?area:e.area);win.A0MaskClockBench?.focus(false);
   doc.body.classList.remove('bench-foyer-mode','bench-area-mode');
   if(e.module&&win.A0BenchToolCatalogController?.open){win.A0BenchToolCatalogController.open(e.module);return true;}
   for(let n=target;n;n=n.parentElement)if(n.tagName==='DETAILS')n.open=true;
   win.location.hash=e.href;target.scrollIntoView({block:'start',behavior:'auto'});
   if(e.bodyRoute)win.A0BenchBodyRouteController?.select(e.bodyRoute);
   return true;
  }
  doc.addEventListener('click',event=>{
   const a=event.target.closest?.('[data-shelf-open]');if(a&&open(a.dataset.shelfOpen))event.preventDefault();
  });
  promoteViews(doc);render();win.addEventListener('load',()=>{render();win.A0BenchWalkController?.render();},{once:true});
  return{render,open,get filters(){return{area,role,group,query};}};
 }
 return{ROLES,MEMBERS,entries,families,select,preview,badges,demonstrator,card,shelfMarkup,groupVisual,groupTiles,roomMarkup,promoteViews,mount};
});
