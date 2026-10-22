(function(root,factory){
 const api=factory(typeof module==='object'&&module.exports?require('./a0-bench-foyer.js'):root.A0BenchFoyer);
 if(typeof module==='object'&&module.exports)module.exports=api;
 else{root.A0BenchWalk=api;root.A0BenchWalkController=api.mount(document,root);}
})(typeof globalThis==='undefined'?this:globalThis,function(Foyer){
 'use strict';
 // Editorial rooms over existing targets, not a second module registry.
 const ROOMS=[
 ['Hier begegnest du den Körpern und ihren unterschiedlichen Ansichten. Blue/Pink und die archivierten Modelle bleiben eigene Quellen.','Beginne beim Körperweg und wähle dort ein Originalfenster. Vergleiche erst danach eine andere Ansicht.',['Körperweg|bodyRouteBench','Originalfenster|benchPerspectiveDeck','GLB-Quellen|nsnGlbSources']],
 ['Raster und Teller geben demselben Thema verschiedene Darstellungsräume. Eine ähnliche Form bedeutet noch keinen gemeinsamen Träger.','Öffne Orbit / Grid / Teller. Lies zuerst die deklarierte Projektion, bevor du Parameter veränderst.',['Orbit / Grid / Teller|orbitGridJoints','Kreis / Grid|breathGridBench','Teller / Spiegel|plateMirrorBench']],
 ['Drei spielbare Zugänge machen Zustände, Übergänge und Ansichten erfahrbar. Die Arcade bleibt eine eigene Anwendung.','Starte mit Three Domains. Wechsle dort zunächst nur die Ansicht und beobachte, was derselbe Lauf zeigt.',['Three Domains|A0_GAME_OF_WORLDS_PLAY.html?world=domains#domains','LIFE|A0_GAME_OF_WORLDS_PLAY.html?world=life#life','Numbers|A0_GAME_OF_WORLDS_PLAY.html?world=numbers#numbers']],
 ['Hier geht es um definierte Operationen und ihre Schrittfolgen — nicht nur um bewegte Bilder.','Öffne die Operatoren und lies die gewählte Operation. Nutze dann einen einzelnen Schritt statt sofort einen Loop.',['Operatoren / Ihara|operatorPanel','Maskenfolge|maskObserverBench','Arbeitsfenster|coupledWindowHub']],
 ['Ein Observer liest einen Ausschnitt. Maske, Projektionsstrahl und sichtbares Ergebnis haben unterschiedliche Rollen.','Beginne mit dem Mask-Observer. Vergleiche Aufsicht und Screen, bevor du die Maske bewegst.',['Mask-Observer|maskObserverBench','Body / TESA / Observer|benchIntegration','Originalansichten|benchPerspectiveDeck']],
 ['Ein Return zeigt, welche Information erhalten blieb und welche zusätzliche Angabe zur Rückkehr gebraucht wird. Ein gespeicherter Record ist nicht automatisch die ganze Geschichte.','Beginne mit Return Economy und lies die Verlustgrenze. Wähle danach einen passenden Record- oder Replay-Weg.',['Return Economy|returnEconomyDemonstrator','Teilung / Übersetzung|divisionReturnBench','Native Replay|ocbRecordReplay']],
 ['Das Schaltbild zeigt die bestehenden Arbeitsmodule und ihre unterschiedlichen Bindungsarten. Eine Verbindungslinie ist kein gemeinsamer Lauf.','Wähle zunächst eine Tafel. Lies ihren Bindungstyp; öffne erst dann das zugehörige Modul.',['Schaltbild öffnen|benchMap','Gekoppelte Arbeitsfenster|coupledWindowHub','Vollständiger Katalog|benchOverview']],
 ['Hier findest du die vollständige lokale Werkzeugauswahl. Gruppen und Suche helfen, ein konkretes Instrument statt die ganze Bench auf einmal zu wählen.','Öffne den Katalog, wähle eine Gruppe oder suche nach einem Begriff. Mit „Zum Modul“ gelangst du zum Instrument.',['Werkzeugkatalog|benchOverview','Schaltbild|benchMap','Arbeitsfenster|coupledWindowHub']],
 ['Originaldateien, historische Bestände und Quellenbindungen liegen hier nebeneinander. Ein Fund ist nicht automatisch im Source Lineage aufgenommen.','Beginne bei den GLB-Quellen. Lies Verfügbarkeit und Herkunft; öffne anschließend bei Bedarf die Source Lineage-Lineage.',['GLB-Bestand|nsnGlbSources','Historische HTML-Serie|augustSourceTrail','Source Lineage / Lineage|A0_SCIENTIFIC_POSITION_REPORT.html']]
 ];
 const route=i=>'#bench-area-'+i;
 function index(hash){const m=/^#bench-area-([0-8])$/.exec(hash);return m?Number(m[1]):null;}
 const href=s=>s.includes('.html')?s:'#'+s;
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function markup(i,gallery,shelves,doc,map){
  if(!ROOMS[i])return '';
  const d=Foyer.DOORS[i],r=ROOMS[i];
  if(shelves)return '<a class="bw-back" href="#benchFoyer">← Foyer</a>'+shelves.roomMarkup(i,d[0],r[0],doc,map)+'<nav class="bw-neighbours" aria-label="Rubrik wechseln"><a href="'+route((i+8)%9)+'">← '+esc(Foyer.DOORS[(i+8)%9][0])+'</a><a href="#benchFoyer">Alle Rubriken</a><a href="'+route((i+1)%9)+'">'+esc(Foyer.DOORS[(i+1)%9][0])+' →</a></nav>';
  if(i===0&&gallery)return '<a class="bw-back" href="#benchFoyer">← Foyer</a>'+gallery.markup()+'<nav class="bw-neighbours" aria-label="Bereich wechseln"><a href="'+route(8)+'">← Quellen &amp; 3D-Bestand</a><a href="#benchFoyer">Alle Bereiche</a><a href="'+route(1)+'">Grids &amp; Teller →</a></nav>';
  return '<a class="bw-back" href="#benchFoyer">← Foyer</a><div class="bw-hero"><img src="'+d[3]+'" alt=""><div><small>BEREICH '+(i+1)+' / 9 · BENCH-RUNDGANG</small><h1 tabindex="-1">'+esc(d[0])+'</h1><p>'+esc(r[0])+'</p></div></div><div class="bw-start"><small>DEIN ERSTER SCHRITT</small><h2>So kannst du beginnen.</h2><p>'+esc(r[1])+'</p><a class="bw-primary" data-walk-open href="'+href(r[2][0].split('|')[1])+'">'+esc(r[2][0].split('|')[0])+' öffnen ↗</a></div><h2>Werkzeuge in diesem Bereich</h2><nav class="bw-tools" aria-label="Passende Werkzeuge">'+r[2].map((s,n)=>{const [label,target]=s.split('|');return '<a data-walk-open href="'+href(target)+'"><small>0'+(n+1)+'</small><b>'+esc(label)+'</b><span>'+(target.includes('.html')?'Eigene Quellseite öffnen ↗':'Instrument in der Bench öffnen ↓')+'</span></a>';}).join('')+'</nav><p class="bw-note">Die Bildreferenz steht für das Thema, nicht für einen aktuellen Messzustand. Öffnen verändert keine Quellparameter und startet keinen Lauf. Die vollständige Werkbank bleibt über Direktlinks erreichbar.</p><nav class="bw-neighbours" aria-label="Bereich wechseln"><a href="'+route((i+8)%9)+'">← '+esc(Foyer.DOORS[(i+8)%9][0])+'</a><a href="#benchFoyer">Alle Bereiche</a><a href="'+route((i+1)%9)+'">'+esc(Foyer.DOORS[(i+1)%9][0])+' →</a></nav>';
 }
 function mount(doc,win){
  const main=doc.getElementById('orientationBench');if(!main||!Foyer)return null;
  const landing=doc.createElement('section');landing.id='benchAreaLanding';landing.className='bench-area-landing';main.prepend(landing);
  const crumb=doc.createElement('nav');crumb.className='bw-breadcrumb';crumb.setAttribute('aria-label','Rückweg im Bench-Rundgang');main.before(crumb);
  let previous=null;
  const doors=doc.querySelectorAll('#benchFoyer .bf-door');
  doors.forEach((a,i)=>{if(i<ROOMS.length)a.href=route(i);});
  function render(){
   const i=index(win.location.hash),foyer=Foyer.isFoyer(win.location.hash);
   doc.body.classList.toggle('bench-area-mode',i!==null);
   crumb.hidden=foyer||i!==null||previous===null;
   if(i!==null){
    previous=i;win.A0MaskClockBench?.focus(false);
    landing.innerHTML=markup(i,win.A0BenchBodyGallery,win.A0BenchVisualShelves,doc,win.A0OrientationMap);landing.scrollIntoView({block:'start',behavior:'auto'});
    landing.querySelector('h1')?.focus({preventScroll:true});
   }else if(previous!==null){
    crumb.innerHTML='<a href="#benchFoyer">← Foyer</a><span>/ '+esc(Foyer.DOORS[previous][0])+' / Instrument</span><a href="'+route(previous)+'">Zur Bereichseinführung ↑</a>';
   }
  }
  landing.addEventListener('click',event=>{
   const a=event.target.closest?.('[data-walk-open]');if(!a)return;
   const target=a.getAttribute('href');if(!target?.startsWith('#'))return;
   const node=doc.getElementById(target.slice(1));if(!node)return;
   win.A0MaskClockBench?.focus(false);
   // Reveal before the browser resolves the native anchor scroll.
   doc.body.classList.toggle('bench-area-mode',false);
   for(let p=node;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;
   const bodyRoute=a.getAttribute('data-body-gallery-route');
   if(bodyRoute)win.A0BenchBodyRouteController?.select(bodyRoute);
  });
  doc.addEventListener('click',event=>{
   if(event.target.closest?.('#benchTourTop')&&index(win.location.hash)!==null){
    doc.body.classList.toggle('bench-area-mode',false);win.location.hash='#benchShowcase';
   }
  },true);
  win.addEventListener('hashchange',render);render();
  return{render,remember(i){if(Number.isInteger(i)&&i>=0&&i<ROOMS.length)previous=i;},get area(){return previous;}};
 }
 return{ROOMS,route,index,href,markup,mount};
});
