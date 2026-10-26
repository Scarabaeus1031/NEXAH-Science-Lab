(function(root,factory){
 const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;
 else{root.A0FamilyRecordPlayer=api;const boot=()=>{root.A0FamilyRecordPlayerController=api.mount(document,root);};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();}
})(typeof globalThis==='undefined'?this:globalThis,function(){
 'use strict';
 // Source cards over existing originals, not four states of one carrier.
 const RECORDS=[
  {id:'tessarec',title:'Tessarec',subtitle:'Adressierter Träger',mark:'Q',color:'#54d7ef',type:'INTRO-ANSICHT · Q4',href:'#map',state:'Q4-Introadresse · 16 Knoten. Kein Readback des Arbeitsfelds unten.',retained:'Q4-Knoten und Kanten des vorhandenen Intros.',boundary:'Nur die Intro-Lesart ändert sich. Arbeitsfeld, Family-Auswahl und Quellzeit bleiben unabhängig.',views:[['state','Adresse','Welcher Knoten ist markiert?'],['phase','Phasenblick','Welche Kanten werden hervorgehoben?'],['observer','Gegenblick','Welche Seite wird sichtbar?']]},
  {id:'eclipse',title:'Black Sun / Big Moon',subtitle:'Sichtbarkeit & Gegenblick',mark:'◐',color:'#ef71b7',type:'QUELLENKARTE · EIGENES MODELL',href:'A0_BLACK_SUN_BIG_MOON.html',state:'Angehaltene Original-Zeichnung bei t=0; kein Live-Readback des Originals.',retained:'Der Bezug zur vorhandenen Experience-Seite.',boundary:'Die Vorschau verwendet die vorhandenen Zeichenfunktionen. LOW / WINDOW / HIGH sind Sichtbarkeitsbereiche, keine neuen räumlichen Zonen. Das Original behält seine Parameter und eigene Uhr.',views:[['eclipse','Eclipse','Black Sun / Big Moon als Eingang.'],['operator','NEON-Fenster','Sichtbarkeit im bestehenden Operatorfenster.'],['mirror','Spiegel','Die vorhandene Gegenansicht lesen.']]},
  {id:'three-lenses',title:'Newton · Leibniz · Goethe',subtitle:'Drei getrennte Lesarten',mark:'△',color:'#ffc84d',type:'QUELLENKARTE · VERGLEICH',href:'A0_NEWTON_GOETHE_OBSERVER_LENS.html#lens',state:'Vergleichsperspektiven, nicht drei identische physikalische Zustände.',retained:'Die drei bestehenden historischen und erkenntnistheoretischen Perspektiven bleiben unterscheidbar.',boundary:'Die Auswahl benennt eine Lesart. Sie steuert das Original nicht fern und vereinheitlicht seine drei Modelle nicht.',views:[['newton','Newton','Zerlegung / geordnete Farbbänder.'],['leibniz','Leibniz','Relation / Differenzspur.'],['goethe','Goethe','Hell–Dunkel-Grenze / Erscheinung.']]},
  {id:'caro',title:'CARO',subtitle:'Crossing & Orientierung',mark:'＋',color:'#b798ff',type:'QUELLENKARTE · BENCH-INSTRUMENT',href:'A0_ORIENTATION_CONTROLLER_BENCH.html#caroOrientationModes',state:'Richtung und Lesemarke werden erst im Original bedient.',retained:'Der vorhandene CARO-/Orientierungszugang in der Bench.',boundary:'Kein CARO-Readback, keine neue Phase und kein neuer Geschichtenlauf. Auf/Ab sind vorhandene Ansichtslesarten, keine zusätzlichen Quellzustände.',views:[['crossing','Crossing','C · vorhandener Crossing-Zugang.'],['direction','Auf / Ab','Vorhandene Richtungslesart A ↑ / V ↓.'],['marker','Q°-Lesemarke','Fünf vorhandene manuelle Trinity-Lesemarken.']]},
  {id:'qrt-record',title:'Saturn–Titan · QRT Record',subtitle:'Cuts · Rillen · vergleichbare Traces',mark:'R',color:'#eea746',type:'QUELLENKARTE · PRESERVED APPLICATION DEMONSTRATOR',href:'../../../SCIENCE_LAB/CASE_STUDIES/NEXAH_SOLAR_SYSTEM_CLOCKWORK_DOCUMENT_FAMILY_2026-09-14/SOURCE_SNAPSHOT/saturn-titan-qrt-record.html',state:'Ein erhaltener Carrier/Record-Demonstrator mit drei auswählbaren historischen Medienformaten. Die Stackplayer-Auswahl ist eine lokale Lesekarte.',retained:'Cut-Format, deklarierte Drehzahl und zugehörige Trace-Form bleiben als gekoppeltes Quellenlabel erhalten.',boundary:'Die RPM-Angabe steuert weder die Q4-Uhr noch eine andere Bench-Quelle. Formatwechsel ist ein Quellen-Cut, keine neue Physik und kein identischer Carrierzustand.',views:[['ep','7″ · 45 rpm','7″ EP · 45 rpm · kompakter Cut, schnellere Rotation, kürzere Trace.'],['lp','12″ · 33⅓ rpm','12″ LP · 33⅓ rpm · breiterer Cut, langsamere Rotation, längere Trace.'],['shellac','10″ · 78 rpm','10″ Shellac · 78 rpm · historischer Cut, schnelle Rotation, andere Rillendichte.']]}
 ];
 const MODES=[['family','F','Funktionale Rolle','Welche Apertur liest?'],['sequence','T','Sequenzposition','Wo steht die Methodenfolge?'],['joint','J','Beziehungsfokus','Welche Fuge wird geprüft?'],['elevator','E','Leseposition','Source · View · Boundary'],['tessarec','Q','Modell-Arbeitsfeld','Adressierten Träger bedienen']];
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function create(){let id='tessarec',address=0;const views=Object.fromEntries(RECORDS.map(r=>[r.id,r.views[0][0]]));return{
  select(next){if(!RECORDS.some(r=>r.id===next))return false;id=next;return true;},
  view(next){if(!RECORDS.find(r=>r.id===id).views.some(v=>v[0]===next))return false;views[id]=next;return true;},
  address(next){if(id!=='tessarec'||!Number.isInteger(next)||next<0||next>15)return false;address=next;return true;},
  snapshot(){return{id,view:views[id],address:id==='tessarec'?address:null};}
 };}
 function sourceHref(r,view){return r.id==='eclipse'?r.href+'#'+view:r.id==='caro'&&view==='crossing'?'A0_ORIENTATION_CONTROLLER_BENCH.html#caroControlBench':r.href;}
 function artwork(r,view){
  let s='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 360" role="img"><title>'+esc(r.title+' · schematische Lesekarte · '+view)+'</title><rect width="600" height="360" fill="#04131e"/>';
  for(const radius of [135,120,105,90])s+='<ellipse cx="300" cy="180" rx="'+radius*1.6+'" ry="'+radius+'" fill="none" stroke="#284654" opacity=".5"/>';
  if(r.id==='eclipse')s+='<circle cx="245" cy="170" r="84" fill="#02080e" stroke="#ef71b7" stroke-width="3"/><circle cx="370" cy="170" r="54" fill="#e7eff2"/><circle cx="353" cy="162" r="50" fill="#071723"/><path d="M130 283H470" stroke="#54d7ef"/>';
  if(r.id==='three-lenses'){['#54d7ef','#b798ff','#ffc84d'].forEach((c,i)=>{s+='<circle cx="'+(160+i*140)+'" cy="170" r="57" fill="#102938" stroke="'+c+'" stroke-width="'+(i===['newton','leibniz','goethe'].indexOf(view)?4:1)+'"/>';});s+='<path d="M70 170H103M217 170H243M357 170H383M497 170H530" stroke="#c8dbe4"/><path d="M140 198L160 144L180 198Z" fill="none" stroke="#e8f3f6"/><path d="M270 150L330 190M270 190L330 150" stroke="#b798ff"/><path d="M440 116V224" stroke="#ffc84d" stroke-width="6"/>';}
  if(r.id==='caro')s+='<circle cx="300" cy="180" r="90" fill="#0d2233" stroke="#b798ff"/><path d="M300 60V300M170 180H430" stroke="#ef71b7" stroke-width="3"/><path d="M220 220L300 110L380 220Z" fill="none" stroke="#54d7ef"/><circle cx="300" cy="180" r="9" fill="#ffc84d"/>';
  if(r.id==='qrt-record'){
   const cut={ep:{rx:205,ry:89,label:'7″ · 45 rpm',trace:'M426 180l18 0 10-25 12 52 14-66 14 49 15-35 16 25 28 0'},lp:{rx:168,ry:72,label:'12″ · 33⅓ rpm',trace:'M426 180c18 0 18-43 34 0s18 43 34 0 18-43 34 0 18 43 34 0'},shellac:{rx:132,ry:55,label:'10″ · 78 rpm',trace:'M426 180l10 0 8-31 9 59 9-54 9 57 9-64 9 60 9-48 9 41 12 0'}}[view]||null;
   if(cut)s+='<g fill="none" stroke="#34495b"><ellipse cx="248" cy="180" rx="220" ry="98" stroke-width="12" opacity=".55"/><ellipse cx="248" cy="180" rx="205" ry="89"/><ellipse cx="248" cy="180" rx="168" ry="72"/><ellipse cx="248" cy="180" rx="132" ry="55"/></g><ellipse cx="248" cy="180" rx="'+cut.rx+'" ry="'+cut.ry+'" fill="none" stroke="#eea746" stroke-width="6"/><circle cx="248" cy="180" r="42" fill="#b96e2d"/><path d="M248 180L390 116" stroke="#b881ff" stroke-width="4"/><circle cx="397" cy="113" r="12" fill="#b881ff"/><path d="'+cut.trace+'" fill="none" stroke="#eea746" stroke-width="4"/><text x="248" y="308" fill="#eea746" text-anchor="middle" font-family="system-ui" font-size="15">'+cut.label+'</text>';
  }
  return s+'<text x="300" y="325" fill="#aac4cf" text-anchor="middle" font-family="system-ui" font-size="13">LESEKARTE · KEIN LIVE-READBACK</text></svg>';
 }
 function markup(){return '<div class="frp-label"><span>01 · PLATTE WÄHLEN</span><span>Die Quelle bleibt erkennbar.</span></div><nav class="frp-records" aria-label="Quelle oder Modell wählen">'+RECORDS.map((r,i)=>'<button type="button" data-frp-record="'+r.id+'" style="--record:'+r.color+'" aria-pressed="'+(i===0)+'"><span class="frp-disc" aria-hidden="true"><b>'+r.mark+'</b></span><span><small>'+String(i+1).padStart(2,'0')+' · '+(i?'QUELLENKARTE':'INTRO BEDIENBAR')+'</small><strong>'+esc(r.title)+'</strong><em>'+esc(r.subtitle)+'</em></span></button>').join('')+'</nav><div class="frp-deck"><div class="frp-stage"><header><div><small data-frp-type></small><h2 data-frp-title></h2></div><span class="frp-window-label">ANSICHTSFENSTER</span></header><div class="frp-orbit" data-frp-orbit-panel>'+orbitMarkup()+'</div><div data-frp-native></div><div data-frp-reference hidden></div><p class="frp-stage-caption" data-frp-caption></p></div><section class="frp-inspector" aria-label="Aktuelle Auswahl und Lesart"><small>02 · WIE LESEN WIR SIE?</small><div class="frp-views" data-frp-views role="group" aria-label="Lesart der gewählten Quelle"></div><label class="frp-address" data-frp-address-panel>INTRO-ADRESSE <output data-frp-address-value></output><input data-frp-address type="range" min="0" max="15" step="1" value="0"><span>Auswahl im Q4-Intro — kein Quellbefehl.</span></label><section class="frp-lens" data-frp-lens-panel><div><b>TESSARNA / Q°</b><span>Touch and See · UI-Linse</span></div><button type="button" data-frp-lens aria-pressed="true">Q°-Linse sichtbar</button><p>Cursor = Position. Linse = gewählter Blick. Tippe einen Q4-Knoten an oder wähle seine Adresse; die Lesart bleibt dabei erhalten.</p></section><p class="frp-reading" data-frp-reading></p><a class="frp-open" data-frp-open>Im Original bedienen ↗</a><details class="frp-source-details"><summary>Quelle, Erhaltenes und Bindungsgrenze</summary><dl class="frp-ledger"><dt>GEGENSTAND / ZUSTAND</dt><dd data-frp-state></dd><dt>BLEIBT ERHALTEN</dt><dd data-frp-retained></dd><dt>BINDUNGSGRENZE</dt><dd data-frp-boundary></dd></dl></details><output class="frp-status" data-frp-status aria-live="polite"></output></section></div><details class="frp-mode-key"><summary>F · T · J · E · Q zuordnen — keine fünf gleichartigen States</summary><p>Diese bestehenden Arbeitsmodi öffnen den Atlas darunter. Ein Modus ist weder eine neue Platte noch automatisch ein neuer Quellzustand.</p><nav aria-label="Bestehenden Atlas-Arbeitsmodus öffnen">'+MODES.map(([mode,mark,title,copy])=>'<button type="button" data-frp-atlas="'+mode+'"><b>'+mark+'</b><strong>'+title+'</strong><span>'+copy+'</span></button>').join('')+'</nav><p class="frp-format-note">QRT-Verknüpfung: 7″ EP / 45 rpm · 12″ LP / 33⅓ rpm · 10″ Shellac / 78 rpm. Format und Drehzahl bleiben ein typisiertes Quellenlabel; sie ersetzen keine Player- oder Bench-Uhr. 10°Z / 12°Z bleiben als getrennte, offene Orientierungsnotation erhalten.</p></details>';}
 const GRAY=Array.from({length:16},(_,i)=>i^(i>>1));
 function nextAddress(address){return GRAY[(GRAY.indexOf(address)+1)%16];}
 function wheelMarkup(){return '<div class="frp-wheel" aria-label="Stationsrad der 16 Q4-Introadressen"><div class="frp-wheel-track"></div><div class="frp-wheel-cursor" data-frp-wheel-cursor aria-hidden="true"><b>Q°</b></div><div class="frp-wheel-core"><small>INTRO · Q4</small><strong data-frp-wheel-value>S0</strong><span>Cursor + Linse</span></div>'+GRAY.map((address,i)=>{const angle=i*Math.PI/8;return '<button type="button" data-frp-station="'+address+'" style="left:'+(50+43*Math.sin(angle)).toFixed(3)+'%;top:'+(50-43*Math.cos(angle)).toFixed(3)+'%" aria-label="Station S'+address+', '+address.toString(2).padStart(4,'0')+'" aria-pressed="'+(address===0)+'">'+address+'</button>';}).join('')+'</div><div class="frp-orbit-controls"><b>Rad · Station · Blick</b><button type="button" data-frp-orbit-play aria-pressed="false">Weiterlaufen</button><button type="button" data-frp-orbit-step>Eine Station weiter</button><p>Antippen hält an. Q° fährt am Cursor mit. Gray-Reihenfolge der vorhandenen Introadressen; kein GC- oder Quellbefehl.</p></div>';}
 function jukeboxMarkup(){return '<div class="frp-juke-rack" aria-label="Jukebox der gleichen 16 Q4-Stationen">'+GRAY.map((address,i)=>'<button type="button" data-frp-station="'+address+'" aria-label="Station S'+address+', '+address.toString(2).padStart(4,'0')+'" aria-pressed="'+(address===0)+'"><i aria-hidden="true"></i><strong>S'+address+'</strong><span>'+address.toString(2).padStart(4,'0')+'</span></button>').join('')+'<div class="frp-juke-arm" aria-hidden="true"><b>Q°</b></div></div>';}
 function orbitMarkup(){const old=wheelMarkup(),cut=old.indexOf('<div class="frp-orbit-controls">');return '<nav class="frp-layouts" aria-label="Stationsdarstellung wählen"><button type="button" data-frp-layout="wheel" aria-pressed="true">Rad</button><button type="button" data-frp-layout="jukebox" aria-pressed="false">Jukebox</button><span>Andere Anordnung · dieselbe Auswahl</span></nav><div data-frp-wheel-face>'+old.slice(0,cut)+'</div><div data-frp-jukebox-face hidden>'+jukeboxMarkup()+'</div>'+old.slice(cut);}
 function eclipseMarkup(view){return '<div class="frp-eclipse-preview"><header><b>'+ (view==='mirror'?'Grau / Neon · Gegenblick':'Ein Feld · drei Sichtbarkeitsbereiche')+'</b><p>Original-Zeichenfunktionen · angehalten bei t = 0 · keine Fernsteuerung</p></header>'+(view==='mirror'?'<canvas data-frp-mirror-preview role="img" aria-label="Angehaltener Original-Gegenblick Grau und Neon"></canvas>':'<div class="frp-neon-triptych">'+['low','window','high'].map(key=>'<figure><canvas data-frp-neon-preview="'+key+'" role="img" aria-label="Angehaltene Originalansicht '+key+'"></canvas><figcaption data-frp-neon-caption="'+key+'"></figcaption></figure>').join('')+'</div>')+'<p class="frp-preview-note">Die goldene Signalspur und die Sichtbarkeit stammen aus dem Original. Keine zusätzliche Critical-Line-Geometrie und keine Zuordnung zum Q4-Cursor.</p></div>';}
 function drawEclipse(host,view,win){
  const source=win.A0BlackSunBigMoon;if(!source?.renderPreview)return false;
  if(view==='mirror')return source.renderPreview(host.querySelector('[data-frp-mirror-preview]'),'mirror');
  host.querySelectorAll('[data-frp-neon-preview]').forEach(canvas=>{const key=canvas.dataset.frpNeonPreview,s=source.STATES[key],r=source.operatorReadout(s.value);source.renderPreview(canvas,'operator',s.value);host.querySelector('[data-frp-neon-caption="'+key+'"]').textContent=s.label+' · B='+s.value.toFixed(2)+' · '+r.retained+'% retained · '+r.hidden+'% hidden · '+r.falseGates+'% false gates';});
  return true;
 }
 function mount(doc,win){
  const host=doc.getElementById('familyRecordPlayer'),native=doc.querySelector('.atlas-portal');if(!host||!native)return null;
  if(host.dataset.frpMounted)return null;host.dataset.frpMounted='true';
  const model=create(),subscribers=new Set();let lensVisible=true,running=false,ticket=0,last=null,layout='wheel';
  try{const params=new URL(win.location.href).searchParams;model.select(params.get('plate'));}catch{}
  host.innerHTML=markup();host.querySelector('[data-frp-native]').append(native);
  doc.getElementById('start')?.classList.add('frp-ready');const el=n=>host.querySelector('[data-frp-'+n+']');
  function paintSelection(apply=true){
   const s=model.snapshot();if(s.id!=='tessarec')return;
   if(apply)win.A0AtlasIntroView?.selectAddress(s.address);el('address').value=String(s.address);el('address-value').textContent='S'+s.address+' · '+s.address.toString(2).padStart(4,'0');
   el('wheel-value').textContent='S'+s.address;
   el('wheel-cursor').style.setProperty('--station-angle',(GRAY.indexOf(s.address)*22.5)+'deg');
   host.style.setProperty('--juke-row',Math.floor(GRAY.indexOf(s.address)/4));host.style.setProperty('--juke-col',GRAY.indexOf(s.address)%4);
   host.querySelectorAll('[data-frp-station]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.frpStation)===s.address)));
   el('orbit-play').textContent=running?'Umlauf anhalten':'Weiterlaufen';el('orbit-play').setAttribute('aria-pressed',String(running));
   el('status').setAttribute('aria-live',running?'off':'polite');el('status').textContent='Tessarec · S'+s.address+' · '+(running?'Umlauf':'Station gehalten')+' · '+s.view;
  }
  function pause(){running=false;ticket++;last=null;paintSelection(false);}
  function frame(now,activeTicket){
   if(!running||activeTicket!==ticket)return;
   if(doc.hidden||model.snapshot().id!=='tessarec'){pause();return;}
   if(last===null)last=now;
   if(now-last>=900){last=now;model.address(nextAddress(model.snapshot().address));paintSelection();}
   win.requestAnimationFrame(t=>frame(t,activeTicket));
  }
  function play(){if(running||model.snapshot().id!=='tessarec'||!win.requestAnimationFrame||doc.hidden)return;running=true;last=null;const activeTicket=++ticket;paintSelection();win.requestAnimationFrame(t=>frame(t,activeTicket));}
  function render(){
   const s=model.snapshot(),r=RECORDS.find(r=>r.id===s.id),view=r.views.find(v=>v[0]===s.view),isNative=s.id==='tessarec';
   host.style.setProperty('--selected-record',r.color);el('native').hidden=!isNative;el('reference').hidden=isNative;el('address-panel').hidden=!isNative;el('lens-panel').hidden=!isNative;el('orbit-panel').hidden=!isNative;
   el('type').textContent=r.type;el('title').textContent=r.title;el('reading').textContent=view[2];el('state').textContent=r.state;el('retained').textContent=r.retained;el('boundary').textContent=r.boundary;
   el('caption').textContent=isNative?'Vorhandenes Q4-Intro · schematische Projektion. Der Atlas darunter bleibt eigenständig.':'Quelle oben ausgewählt · Original noch nicht geladen · unterer Atlas unverändert.';
   el('open').href=sourceHref(r,s.view);el('open').textContent=isNative?'Tessarec-Arbeitsfeld öffnen ↓':'Diese Quelle im Original öffnen ↗';
   el('views').innerHTML=r.views.map(([id,title])=>'<button type="button" data-frp-view="'+id+'" aria-pressed="'+(id===s.view)+'">'+esc(title)+'</button>').join('');
   if(isNative){win.A0AtlasIntroView?.selectMode(s.view);win.A0AtlasIntroView?.selectAddress(s.address);win.A0AtlasIntroView?.refresh();el('address').value=String(s.address);el('address-value').textContent='S'+s.address+' · '+s.address.toString(2).padStart(4,'0');}
   else if(s.id==='eclipse'&&win.A0BlackSunBigMoon?.renderPreview){el('reference').innerHTML=eclipseMarkup(s.view);drawEclipse(el('reference'),s.view,win);el('caption').textContent='Originalrenderer als angehaltene Vorschau · das bedienbare Original liegt in der Werkstatt darunter.';}
   else el('reference').innerHTML=artwork(r,s.view);
   host.querySelectorAll('[data-frp-record]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.frpRecord===s.id)));
   el('status').textContent=r.title+' · '+view[1]+(isNative?' · Intro S'+s.address:' · Quellenkarte, keine Fernsteuerung');paintSelection();subscribers.forEach(fn=>fn(model.snapshot()));
  }
  host.addEventListener('click',event=>{
   const arrangement=event.target.closest?.('[data-frp-layout]');if(arrangement){setLayout(arrangement.dataset.frpLayout);return;}
   const record=event.target.closest?.('[data-frp-record]');if(record){pause();if(model.select(record.dataset.frpRecord))render();return;}
   const station=event.target.closest?.('[data-frp-station]');if(station){pause();if(model.address(Number(station.dataset.frpStation)))paintSelection();return;}
   const view=event.target.closest?.('[data-frp-view]');if(view&&model.view(view.dataset.frpView)){const selected=view.dataset.frpView;render();host.querySelector('[data-frp-view="'+selected+'"]')?.focus();return;}
   const atlas=event.target.closest?.('[data-frp-atlas]');
   if(atlas&&MODES.some(m=>m[0]===atlas.dataset.frpAtlas)){pause();win.A0FamilyAtlasBridge?.apply({mode:atlas.dataset.frpAtlas});doc.getElementById('map')?.scrollIntoView({block:'start'});}
  });
  el('address').addEventListener('input',()=>{const address=Number(el('address').value);pause();if(model.address(address))paintSelection();});
  el('orbit-play').addEventListener('click',()=>{if(running)pause();else play();});
  el('orbit-step').addEventListener('click',()=>{pause();if(model.address(nextAddress(model.snapshot().address)))paintSelection();});
  doc.addEventListener?.('visibilitychange',()=>{if(doc.hidden)pause();});
  el('lens').addEventListener('click',()=>{lensVisible=!lensVisible;win.A0AtlasIntroView?.setLens(lensVisible);el('lens').setAttribute('aria-pressed',String(lensVisible));el('lens').textContent=lensVisible?'Q°-Linse sichtbar':'Q°-Linse einblenden';});
  const canvas=doc.getElementById('atlasIntroCanvas');
  canvas?.addEventListener('pointerdown',event=>{
   if(model.snapshot().id!=='tessarec'||(event.button!==undefined&&event.button!==0))return;
   const bounds=canvas.getBoundingClientRect(),address=win.A0AtlasIntroView?.selectAt(event.clientX-bounds.left,event.clientY-bounds.top);
   if(Number.isInteger(address)&&model.address(address)){pause();paintSelection();}
  });
  el('open').addEventListener('click',event=>{pause();if(model.snapshot().id!=='tessarec')return;event.preventDefault();win.A0FamilyAtlasBridge?.apply({mode:'tessarec'});doc.getElementById('map')?.scrollIntoView({block:'start'});});
  function setLayout(next){if(!['wheel','jukebox'].includes(next))return false;layout=next;el('wheel-face').hidden=layout!=='wheel';el('jukebox-face').hidden=layout!=='jukebox';host.querySelectorAll('[data-frp-layout]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.frpLayout===layout)));return true;}
  win.addEventListener?.('resize',()=>{const s=model.snapshot();if(s.id==='eclipse'&&win.A0BlackSunBigMoon?.renderPreview)drawEclipse(el('reference'),s.view,win);});
  render();if(!win.matchMedia?.('(prefers-reduced-motion: reduce)').matches)play();
  return{snapshot:model.snapshot,render,pause,play,setLayout,displayLayout:()=>layout,isRunning:()=>running,subscribe(fn){subscribers.add(fn);fn(model.snapshot());return()=>subscribers.delete(fn);}};
 }
 return{RECORDS,MODES,GRAY,nextAddress,wheelMarkup,jukeboxMarkup,orbitMarkup,eclipseMarkup,drawEclipse,create,sourceHref,artwork,markup,mount};
});
