(function(root,factory){
 const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;
 else{root.A0FamilyRecordPlayer=api;const boot=()=>{root.A0FamilyRecordPlayerController=api.mount(document,root);};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();}
})(typeof globalThis==='undefined'?this:globalThis,function(){
 'use strict';
 // Source cards over existing originals, not four states of one carrier.
 const RECORDS=[
  {id:'tessarec',title:'Tessarec',subtitle:'Adressierter Träger',mark:'Q',color:'#54d7ef',type:'INTRO-ANSICHT · Q4',href:'#map',state:'Q4-Introadresse · 16 Knoten. Kein Readback des Arbeitsfelds unten.',retained:'Q4-Knoten und Kanten des vorhandenen Intros.',boundary:'Nur die Intro-Lesart ändert sich. Arbeitsfeld, Family-Auswahl und Quellzeit bleiben unabhängig.',views:[['state','Adresse','Welcher Knoten ist markiert?'],['phase','Phasenblick','Welche Kanten werden hervorgehoben?'],['observer','Gegenblick','Welche Seite wird sichtbar?']]},
  {id:'eclipse',title:'Black Sun / Big Moon',subtitle:'Sichtbarkeit & Gegenblick',mark:'◐',color:'#ef71b7',type:'QUELLENKARTE · EIGENES MODELL',href:'A0_BLACK_SUN_BIG_MOON.html',state:'Hier ist kein Zustand des Originals übernommen.',retained:'Der Bezug zur vorhandenen Experience-Seite.',boundary:'Die Grafik ist eine schematische Lesekarte, kein Screenshot oder Live-Zustand. Das Original besitzt seine eigenen Parameter.',views:[['eclipse','Eclipse','Black Sun / Big Moon als Eingang.'],['operator','NEON-Fenster','Sichtbarkeit im bestehenden Operatorfenster.'],['mirror','Spiegel','Die vorhandene Gegenansicht lesen.']]},
  {id:'three-lenses',title:'Newton · Leibniz · Goethe',subtitle:'Drei getrennte Lesarten',mark:'△',color:'#ffc84d',type:'QUELLENKARTE · VERGLEICH',href:'A0_NEWTON_GOETHE_OBSERVER_LENS.html#lens',state:'Vergleichsperspektiven, nicht drei identische physikalische Zustände.',retained:'Die drei bestehenden historischen und erkenntnistheoretischen Perspektiven bleiben unterscheidbar.',boundary:'Die Auswahl benennt eine Lesart. Sie steuert das Original nicht fern und vereinheitlicht seine drei Modelle nicht.',views:[['newton','Newton','Zerlegung / geordnete Farbbänder.'],['leibniz','Leibniz','Relation / Differenzspur.'],['goethe','Goethe','Hell–Dunkel-Grenze / Erscheinung.']]},
  {id:'caro',title:'CARO',subtitle:'Crossing & Orientierung',mark:'＋',color:'#b798ff',type:'QUELLENKARTE · BENCH-INSTRUMENT',href:'A0_ORIENTATION_CONTROLLER_BENCH.html#caroOrientationModes',state:'Richtung und Lesemarke werden erst im Original bedient.',retained:'Der vorhandene CARO-/Orientierungszugang in der Bench.',boundary:'Kein CARO-Readback, keine neue Phase und kein neuer Geschichtenlauf. Auf/Ab sind vorhandene Ansichtslesarten, keine zusätzlichen Quellzustände.',views:[['crossing','Crossing','C · vorhandener Crossing-Zugang.'],['direction','Auf / Ab','Vorhandene Richtungslesart A ↑ / V ↓.'],['marker','Q°-Lesemarke','Fünf vorhandene manuelle Trinity-Lesemarken.']]}
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
  return s+'<text x="300" y="325" fill="#aac4cf" text-anchor="middle" font-family="system-ui" font-size="13">LESEKARTE · KEIN LIVE-READBACK</text></svg>';
 }
 function markup(){return '<div class="frp-label"><span>01 · PLATTE WÄHLEN</span><span>Die Quelle bleibt erkennbar.</span></div><nav class="frp-records" aria-label="Quelle oder Modell wählen">'+RECORDS.map((r,i)=>'<button type="button" data-frp-record="'+r.id+'" style="--record:'+r.color+'" aria-pressed="'+(i===0)+'"><span class="frp-disc" aria-hidden="true"><b>'+r.mark+'</b></span><span><small>'+String(i+1).padStart(2,'0')+' · '+(i?'QUELLENKARTE':'INTRO BEDIENBAR')+'</small><strong>'+esc(r.title)+'</strong><em>'+esc(r.subtitle)+'</em></span></button>').join('')+'</nav><div class="frp-deck"><div class="frp-stage"><header><div><small data-frp-type></small><h2 data-frp-title></h2></div><span class="frp-window-label">ANSICHTSFENSTER</span></header><div data-frp-native></div><div data-frp-reference hidden></div><p class="frp-stage-caption" data-frp-caption></p></div><section class="frp-inspector" aria-label="Aktuelle Auswahl und Lesart"><small>02 · WIE LESEN WIR SIE?</small><div class="frp-views" data-frp-views role="group" aria-label="Lesart der gewählten Quelle"></div><label class="frp-address" data-frp-address-panel>INTRO-ADRESSE <output data-frp-address-value></output><input data-frp-address type="range" min="0" max="15" step="1" value="0"><span>Auswahl im Q4-Intro — kein Quellbefehl.</span></label><section class="frp-lens" data-frp-lens-panel><div><b>TESSARNA / Q°</b><span>Touch and See · UI-Linse</span></div><button type="button" data-frp-lens aria-pressed="true">Q°-Linse sichtbar</button><p>Cursor = Position. Linse = gewählter Blick. Tippe einen Q4-Knoten an oder wähle seine Adresse; die Lesart bleibt dabei erhalten.</p></section><p class="frp-reading" data-frp-reading></p><a class="frp-open" data-frp-open>Im Original bedienen ↗</a><dl class="frp-ledger"><dt>GEGENSTAND / ZUSTAND</dt><dd data-frp-state></dd><dt>BLEIBT ERHALTEN</dt><dd data-frp-retained></dd><dt>BINDUNGSGRENZE</dt><dd data-frp-boundary></dd></dl><output class="frp-status" data-frp-status aria-live="polite"></output></section></div><details class="frp-mode-key"><summary>F · T · J · E · Q zuordnen — keine fünf gleichartigen States</summary><p>Diese bestehenden Arbeitsmodi öffnen den Atlas darunter. Ein Modus ist weder eine neue Platte noch automatisch ein neuer Quellzustand.</p><nav aria-label="Bestehenden Atlas-Arbeitsmodus öffnen">'+MODES.map(([mode,mark,title,copy])=>'<button type="button" data-frp-atlas="'+mode+'"><b>'+mark+'</b><strong>'+title+'</strong><span>'+copy+'</span></button>').join('')+'</nav><p class="frp-format-note">Deine Formatidee: 7″ · 33 · 45 · 78 · 10°Z · 12°Z. Format, Tempo und Orientierung bleiben zunächst getrennt; die Bedeutung der Z-Angaben und eine mögliche Zuordnung sind noch offen.</p></details>';}
 function mount(doc,win){
  const host=doc.getElementById('familyRecordPlayer'),native=doc.querySelector('.atlas-portal');if(!host||!native)return null;
  if(host.dataset.frpMounted)return null;host.dataset.frpMounted='true';
  const model=create();let lensVisible=true;host.innerHTML=markup();host.querySelector('[data-frp-native]').append(native);
  doc.getElementById('start')?.classList.add('frp-ready');const el=n=>host.querySelector('[data-frp-'+n+']');
  function render(){
   const s=model.snapshot(),r=RECORDS.find(r=>r.id===s.id),view=r.views.find(v=>v[0]===s.view),isNative=s.id==='tessarec';
   host.style.setProperty('--selected-record',r.color);el('native').hidden=!isNative;el('reference').hidden=isNative;el('address-panel').hidden=!isNative;el('lens-panel').hidden=!isNative;
   el('type').textContent=r.type;el('title').textContent=r.title;el('reading').textContent=view[2];el('state').textContent=r.state;el('retained').textContent=r.retained;el('boundary').textContent=r.boundary;
   el('caption').textContent=isNative?'Vorhandenes Q4-Intro · schematische Projektion. Der Atlas darunter bleibt eigenständig.':'Quelle oben ausgewählt · Original noch nicht geladen · unterer Atlas unverändert.';
   el('open').href=sourceHref(r,s.view);el('open').textContent=isNative?'Tessarec-Arbeitsfeld öffnen ↓':'Diese Quelle im Original öffnen ↗';
   el('views').innerHTML=r.views.map(([id,title])=>'<button type="button" data-frp-view="'+id+'" aria-pressed="'+(id===s.view)+'">'+esc(title)+'</button>').join('');
   if(isNative){win.A0AtlasIntroView?.selectMode(s.view);win.A0AtlasIntroView?.selectAddress(s.address);win.A0AtlasIntroView?.refresh();el('address').value=String(s.address);el('address-value').textContent='S'+s.address+' · '+s.address.toString(2).padStart(4,'0');}
   else el('reference').innerHTML=artwork(r,s.view);
   host.querySelectorAll('[data-frp-record]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.frpRecord===s.id)));
   el('status').textContent=r.title+' · '+view[1]+(isNative?' · Intro S'+s.address:' · Quellenkarte, keine Fernsteuerung');
  }
  host.addEventListener('click',event=>{
   const record=event.target.closest?.('[data-frp-record]');if(record&&model.select(record.dataset.frpRecord)){render();return;}
   const view=event.target.closest?.('[data-frp-view]');if(view&&model.view(view.dataset.frpView)){const selected=view.dataset.frpView;render();host.querySelector('[data-frp-view="'+selected+'"]')?.focus();return;}
   const atlas=event.target.closest?.('[data-frp-atlas]');
   if(atlas&&MODES.some(m=>m[0]===atlas.dataset.frpAtlas)){win.A0FamilyAtlasBridge?.apply({mode:atlas.dataset.frpAtlas});doc.getElementById('map')?.scrollIntoView({block:'start'});}
  });
  el('address').addEventListener('input',()=>{if(model.address(Number(el('address').value)))render();});
  el('lens').addEventListener('click',()=>{lensVisible=!lensVisible;win.A0AtlasIntroView?.setLens(lensVisible);el('lens').setAttribute('aria-pressed',String(lensVisible));el('lens').textContent=lensVisible?'Q°-Linse sichtbar':'Q°-Linse einblenden';});
  const canvas=doc.getElementById('atlasIntroCanvas');
  canvas?.addEventListener('pointerdown',event=>{
   if(model.snapshot().id!=='tessarec'||(event.button!==undefined&&event.button!==0))return;
   const bounds=canvas.getBoundingClientRect(),address=win.A0AtlasIntroView?.selectAt(event.clientX-bounds.left,event.clientY-bounds.top);
   if(Number.isInteger(address)&&model.address(address))render();
  });
  el('open').addEventListener('click',event=>{if(model.snapshot().id!=='tessarec')return;event.preventDefault();win.A0FamilyAtlasBridge?.apply({mode:'tessarec'});doc.getElementById('map')?.scrollIntoView({block:'start'});});
  render();return{snapshot:model.snapshot,render};
 }
 return{RECORDS,MODES,create,sourceHref,artwork,markup,mount};
});
