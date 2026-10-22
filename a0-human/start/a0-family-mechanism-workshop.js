(function(root,factory){
 const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;
 else{root.A0FamilyMechanismWorkshop=api;const boot=()=>{root.A0FamilyMechanismWorkshopController=api.mount(document,root);};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();}
})(typeof globalThis==='undefined'?this:globalThis,function(){
 'use strict';
 const FOLD='A0_AXIS08_FOLD_RETURN_SEQUENCER.html',OBSERVER='A0_NEWTON_GOETHE_OBSERVER_LENS.html',ECLIPSE='A0_BLACK_SUN_BIG_MOON.html';
 const ITEMS={
  fold:{title:'Falten & zurückführen',tag:'AXIS08 · 8 → 7 + Residuum',file:FOLD,panel:'sequencer',why:'Sieben Koordinaten plus Rest rekonstruieren die acht Lane-Werte. Ein konkreter Return, nicht nur eine ähnliche Form.',boundary:'E8 ist Referenzgeometrie; der Operator wird nicht daraus erzeugt.',mark:'8 → 7 + r'},
  sewing:{title:'Paaren & sichtbar machen',tag:'SEWING · APERTUR',file:FOLD,panel:'pentagonSewing',why:'Paarungen, gespeicherte Unterschiede und Ausschnitte derselben acht Quellen untersuchen.',boundary:'Apertur maskiert die Zeichnung, nicht die Werte. Pentagon und Viereck sind Darstellungsplätze.',mark:'5 + 3 ↔ 4 + 4'},
  score:{title:'Einsatz & Antwort',tag:'PARTITUR · OHNE TON',file:FOLD,panel:'sewingScore',why:'Die vorhandene Sewing-Partitur zeigt Einsätze, Atemthemen und Antworten. Sewing bleibt als zugehörige Geometrie sichtbar.',boundary:'Nur die bestehende Sewing-/Partiturkopplung; keine neue Uhr für Atlas, AXIS08 oder Generationen.',mark:'6 · 1 · 6'},
  generations:{title:'Relationen weiterreichen',tag:'GENERATIONEN · JANUS',file:FOLD,panel:'generationLab',why:'Einen Ausgang als nächsten Eingang lesen und mit einem leicht veränderten Lauf vergleichen.',boundary:'Deklarierte Beispielregel, kein universelles Wachstumsgesetz.',mark:'in → out → in'},
  observer:{title:'Drei Perspektiven vergleichen',tag:'NEWTON · LEIBNIZ · GOETHE',file:OBSERVER,panel:'lens',why:'Zerlegung, relationale Differenz und Hell–Dunkel-Grenze direkt im vorhandenen Original untersuchen.',boundary:'Drei unterscheidbare Modelle, keine gemeinsame physikalische Theorie.',mark:'N · L · G'},
  neon:{title:'Sichtbarkeit & Fenster',tag:'BLACK SUN · NEON',file:ECLIPSE,panel:'operator',why:'Das feste Feld unter den drei vorhandenen Sichtbarkeitszuständen lesen: Was bleibt sichtbar, verdeckt oder fehlgelesen?',boundary:'Kontrast- und Sichtbarkeitsmodell. Keine neu behauptete Critical-Line-Geometrie.',mark:'B↓ · B* · B↑'},
  mirror:{title:'Grau & Neon gegenüberstellen',tag:'BIG MOON · REAL MIRROR',file:ECLIPSE,panel:'mirror',why:'Die komplementäre Grau-/Neonansicht mit ihrer vorhandenen Rückkehrlinie öffnen.',boundary:'Originale Experience-Lesart; nicht mit Q4-Adressen gleichgesetzt.',mark:'( · )'},
  caro:{title:'Crossing im Instrument',tag:'CARO · BENCH',file:'A0_ORIENTATION_CONTROLLER_BENCH.html',panel:'caroControlBench',why:'Das Crossing gehört in sein vorhandenes Instrument. Der Zugang öffnet gezielt CARO statt eine zweite Bench zu laden.',boundary:'Noch kein isolierter Originalfenster-Modus für CARO. Daher bewusster Direktzugang.',mark:'C ↔',external:true}
 };
 const BODY_ROUTES=[
  {title:'Körper erkunden',anchor:'pentagon-body-player',copy:'48er Player · sieben lokal synchronisierte Ansichten'},
  {title:'Mechanismus untersuchen',anchor:'fold-contact',copy:'Box / Laschen · Kontakt und CON–DAO; eigener enger Quellvertrag'},
  {title:'Return prüfen',anchor:'return',copy:'Carrier und Hülle unterscheiden · verlorene Lokalität lesen'}
 ];
 function bodyRoutesMarkup(){return '<section class="mw-body-routes" data-mw-body-routes aria-label="Blue Body Lab als Körper-Werkstatt"><header><small>BLUE BODY LAB · EIGENES INSTRUMENT</small><strong>Körper-Werkstatt: gezielt statt die ganze Seite auf einmal</strong><p>Diese drei Wege öffnen vorhandene Bereiche. Navigation überträgt weder Atlas-Cursor noch Instrumentzustand.</p></header><nav>'+BODY_ROUTES.map(r=>'<a href="A0_TESSAREC_BLUE_BODY_LAB.html#'+r.anchor+'" target="_blank" rel="noopener"><strong>'+r.title+' ↗</strong><span>'+r.copy+'</span></a>').join('')+'</nav></section>';}
 const ROOMS={
  tessarec:{title:'Vom Körper zur Mechanik',copy:'Der vorhandene Atlas bleibt darunter. Hier kannst du passende Operatoren und Rückwege einzeln untersuchen.',items:['fold','sewing','score','generations']},
  eclipse:{title:'Sichtbarkeit, Gegenblick, Rückkehr',copy:'Zwei Originalfenster der gewählten Experience. Keine Übertragung des Q4-Cursors auf ihre Parameter.',items:['neon','mirror']},
  'three-lenses':{title:'Differenz lesen und rekonstruieren',copy:'Die Vergleichslinse und der bereits verlinkte Fold-Return bilden einen Lesepfad, keine gemeinsame Engine.',items:['observer','fold']},
  caro:{title:'Orientierung und relationale Anschlüsse',copy:'CARO direkt bedienen; Sewing daneben als getrennten Vergleich für Orientierung und Apertur untersuchen.',items:['caro','sewing']}
 };
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function route(item,plate){if(!ITEMS[item]||!ROOMS[plate]||!ROOMS[plate].items.includes(item))return null;const x=ITEMS[item];return x.file+(x.external?'#'+x.panel:'?atlasPanel='+x.panel+'&atlasPlate='+plate+'#'+x.panel);}
 function mount(doc,win){
  const host=doc.getElementById('familyMechanisms'),player=win.A0FamilyRecordPlayerController;if(!host||!player?.subscribe||host.dataset.mounted)return null;host.dataset.mounted='true';
  let plate=null,selected=null,frame=null,serial=0;const remembered={};
  host.innerHTML='<header><div><small>03 · PASSENDE WERKSTATT</small><h2 data-mw-title></h2><p data-mw-copy></p></div><a href="A0_ORIENTATION_CONTROLLER_BENCH.html#benchFoyer">Alle Werkzeuge in der Bench ↗</a></header><nav class="mw-cards" data-mw-cards aria-label="Mechanismus wählen"></nav><section class="mw-selection"><div><small data-mw-tag></small><h3 data-mw-name></h3><p data-mw-why></p></div><div class="mw-actions"><button type="button" data-mw-load>Originalfenster laden</button><button type="button" data-mw-unload disabled>Fenster entladen</button><a data-mw-original target="_blank" rel="noopener">Vollständige Quelle ↗</a></div></section><p class="mw-notice" data-mw-status role="status">Noch kein Original geladen.</p><div class="mw-frame" data-mw-frame hidden></div><details class="mw-boundary"><summary>Was ist verbunden — und was bleibt getrennt?</summary><p data-mw-boundary></p><p>Ein Originalfenster, eine eigene lokale Instanz. Kein Transfer von Cursor, Quelle, Uhr oder Return. Beim Entladen, Bereichs- oder Mechanismuswechsel geht der lokale Fensterzustand verloren; Returns vorher im Original sichern. Der vollständige Quelltext und seine Engine bleiben maßgeblich.</p></details>';
  const el=n=>host.querySelector('[data-mw-'+n+']');
  el('cards').insertAdjacentHTML('beforebegin',bodyRoutesMarkup());
  function unload(message='Fenster entladen · lokale Uhr und Zustand beendet.'){
   serial++;if(frame){frame.remove();frame=null;}el('frame').hidden=true;el('unload').disabled=true;el('load').disabled=!!ITEMS[selected]?.external;el('status').textContent=message;
  }
  function select(item){
   if(!ROOMS[plate].items.includes(item))return false;
   unload('Mechanismus gewählt · noch kein Original geladen.');selected=item;remembered[plate]=item;const x=ITEMS[item];
   el('name').textContent=x.title;el('tag').textContent=x.tag;el('why').textContent=x.why;el('boundary').textContent=x.boundary;
   el('original').href=x.file+'#'+x.panel;el('load').disabled=!!x.external;el('load').textContent=x.external?'Direktzugang rechts nutzen':'Originalfenster laden';
   host.querySelectorAll('[data-mw-item]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mwItem===selected)));return true;
  }
  function change(s){
   if(!ROOMS[s.id]||plate===s.id)return;
   plate=s.id;const room=ROOMS[plate];el('title').textContent=room.title;el('copy').textContent=room.copy;el('body-routes').hidden=plate!=='tessarec';
   el('cards').innerHTML=room.items.map(id=>{const x=ITEMS[id];return '<button type="button" data-mw-item="'+id+'" aria-pressed="false"><span aria-hidden="true">'+esc(x.mark)+'</span><small>'+esc(x.tag)+'</small><strong>'+esc(x.title)+'</strong></button>';}).join('');
   select(remembered[plate]||room.items[0]);
   const work=doc.getElementById('familyAtlasWorkbench');if(work)work.open=plate==='tessarec';
  }
  function load(){
   const x=ITEMS[selected];if(frame||!x||x.external)return false;player.pause();
   const id=++serial;frame=doc.createElement('iframe');frame.title=x.title+' · vorhandenes Original';frame.src=route(selected,plate);frame.referrerPolicy='no-referrer';
   frame.addEventListener('load',()=>{if(id===serial)el('status').textContent='Originalseite geladen · im Fenster prüfen und bedienen. Eigene Uhr, keine Cursor-Kopplung.';});
   frame.addEventListener('error',()=>{if(id===serial)el('status').textContent='Original nicht erreichbar. Bitte den vollständigen Quellenlink verwenden.';});
   el('frame').appendChild(frame);el('frame').hidden=false;el('unload').disabled=false;el('load').disabled=true;
   el('status').textContent='Original wird geladen · Wechsel oder Entladen verwirft seinen lokalen Zustand.';return true;
  }
  host.addEventListener('click',e=>{const b=e.target.closest?.('[data-mw-item]');if(b)select(b.dataset.mwItem);});
  el('load').addEventListener('click',load);el('unload').addEventListener('click',()=>unload());
  // Existing deep links must still reveal their original workbench.
  function reveal(){const id=win.location.hash.slice(1),work=doc.getElementById('familyAtlasWorkbench'),target=doc.getElementById(id);if(work&&target&&work.contains(target))work.open=true;}
  win.addEventListener?.('hashchange',reveal);
  player.subscribe(change);reveal();
  try{if(new URL(win.location.href).searchParams.get('focus')==='mechanisms')host.scrollIntoView?.({block:'start'});}catch{}
  return{select,load,unload,snapshot:()=>({plate,item:selected,loaded:!!frame})};
 }
 return{ITEMS,BODY_ROUTES,bodyRoutesMarkup,ROOMS,route,mount};
});
