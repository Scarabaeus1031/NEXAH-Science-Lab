(function(){
 'use strict';
 const button=document.getElementById('opiumMotion');
 const windsButton=document.getElementById('opiumWinds');
 const chamberButton=document.getElementById('opiumChamber');
 if(!button)return;
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 let paused=reduced.matches;
 function draw(){document.body.classList.toggle('opium-paused',paused);button.setAttribute('aria-pressed',String(paused));button.textContent=reduced.matches?'Reduzierte Bewegung aktiv':paused?'Animation fortsetzen ▷':'Animation pausieren Ⅱ';button.disabled=reduced.matches;}
 button.addEventListener('click',()=>{paused=!paused;draw();});
 if(windsButton){let windsVisible=true;windsButton.addEventListener('click',()=>{windsVisible=!windsVisible;document.body.classList.toggle('opium-winds-off',!windsVisible);windsButton.setAttribute('aria-pressed',String(windsVisible));windsButton.textContent=windsVisible?'11 Winds ausblenden':'11 Winds einblenden';});}
 if(chamberButton){let chamberVisible=true;chamberButton.addEventListener('click',()=>{chamberVisible=!chamberVisible;document.body.classList.toggle('opium-chamber-off',!chamberVisible);chamberButton.setAttribute('aria-pressed',String(chamberVisible));chamberButton.textContent=chamberVisible?'Verbinder ausblenden':'Verbinder einblenden';});}
 const records=[
  {title:'E8 · acht Coxeterbahnen',carrier:'E8 · 240 roots',operator:'registrierter Coxeter-Operator',view:'8 Bahnen × 30 Wurzeln',return:'bis zu 30 Kandidaten je Orbitadresse',boundary:'Ring und Petals sind Projektion, nicht der Träger.',source:'A0_SCIENTIFIC_POSITION_REPORT.html'},
  {title:'Typed Coupling · Carrier zu Return',carrier:'E8 · 240 roots',operator:'Coxeter 8×30 partition',view:'8 Zielorbits × 30',return:'mehrdeutig · bis zu 30 Kandidaten',boundary:'Die Abbildung ist exakt; das Bild allein identifiziert keine Wurzel.',source:'A0_SCIENTIFIC_POSITION_REPORT.html'},
  {title:'E8 Mutation Family Graph',carrier:'H3-Orbit · 20 oder 30 Punkte',operator:'drei euklidische Spiegel',view:'Hülle + dualer Orbit',return:'Spiegelfolge bleibt registriert',boundary:'Die SVG-Ansicht ist eine 3D→2D-Projektion.',source:'A0_SCIENTIFIC_POSITION_REPORT.html'},
  {title:'LOKI · Q4 zu Q3',carrier:'Q4 · 16 Zustände',operator:'Forget-W quotient',view:'Q3 · 8 Zielzustände',return:'mehrdeutig · 2 Kandidaten',boundary:'Exakter 2:1-Quotient; W wird für eindeutigen Return benötigt.',source:'A0_SCIENTIFIC_POSITION_REPORT.html'},
  {title:'PrimeGrid · N=8 Kontrolle',carrier:'Z8 · acht Adressen',operator:'prime / complement selector',view:'8-stelliger Adresskreis',return:'voller Orbit + komplexer Return',boundary:'Valid negative: kein primespezifischer Coding-Vorteil.',source:'A0_SCIENTIFIC_POSITION_REPORT.html'},
  {title:'Pascal · 7×8 und 11×11',carrier:'Pascal-Zeile / Paarfelder',operator:'Hamming-Gewicht → Zeile',view:'56 Zählzellen / 121 Paarfelder',return:'11 matches · 110 residual',boundary:'7×8=56 ist nicht C(8,3)=56 als Struktur.',source:'A0_SCIENTIFIC_POSITION_REPORT.html'},
  {title:'Life × E8 · typisierte Nichtidentität',carrier:'Life 128² + E8 240 roots',operator:'B3/S23 + Coxeterwort',view:'lossy Root Projection',return:'OPEN TRANSIENT / residual',boundary:'Carrier, Operator und Uhren bleiben getrennt.',source:'A0_SCIENTIFIC_POSITION_REPORT.html'},
  {title:'7 / 11 · typisierter Crosswalk',carrier:'vier getrennte Quellen',operator:'Vergleich nach Carrier/Adresse',view:'7, 8 und 11 im Kontext',return:'nur quellenweise definiert',boundary:'Kein universeller 7/11-Operator und keine neue Identität.',source:'A0_7_11_TYPED_CROSSWALK.html#crosswalk'}
 ];
 const routeTriggers=document.querySelectorAll?Array.from(document.querySelectorAll('[data-opium-route]')):[];
 const modeButtons=document.querySelectorAll?Array.from(document.querySelectorAll('[data-mask-mode]')):[];
 const ghosts=document.querySelectorAll?Array.from(document.querySelectorAll('.op-ghost')):[];
 const field=id=>document.getElementById(id),fields={index:field('opiumMaskIndex'),title:field('opiumMaskTitle'),carrier:field('opiumMaskCarrier'),operator:field('opiumMaskOperator'),view:field('opiumMaskView'),return:field('opiumMaskReturn'),boundary:field('opiumMaskBoundary'),trail:field('opiumGhostTrail'),source:field('opiumMaskSource')};
 let current=0,history=[];
 function renderRecord(){const record=records[current];if(!record||!fields.title)return;fields.index.textContent='PETAL '+(current+1)+' / 8';fields.title.textContent=record.title;fields.carrier.textContent=record.carrier;fields.operator.textContent=record.operator;fields.view.textContent=record.view;fields.return.textContent=record.return;fields.boundary.textContent=record.boundary;fields.source.setAttribute('href',record.source);fields.trail.textContent=history.length?history.map((index,position)=>(position+1)+' · '+records[index].title).join(' ← '):'noch keine frühere Auswahl';routeTriggers.forEach(el=>el.classList.toggle('is-active',Number(el.dataset.opiumRoute)===current));modeButtons.forEach(el=>el.classList.toggle('is-active',Number(el.dataset.maskMode)===current));ghosts.forEach((el,index)=>{el.classList.toggle('is-history-1',index===0&&history.length>0);el.classList.toggle('is-history-2',index===1&&history.length>1);el.classList.toggle('is-history-3',index===2&&history.length>2);});}
 function selectRecord(index){if(!Number.isInteger(index)||!records[index])return;if(index!==current){history=[current].concat(history.filter(item=>item!==current&&item!==index)).slice(0,3);current=index;}renderRecord();}
 routeTriggers.forEach(el=>{el.addEventListener('click',()=>selectRecord(Number(el.dataset.opiumRoute)));el.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();selectRecord(Number(el.dataset.opiumRoute));}});});
 modeButtons.forEach(el=>el.addEventListener('click',()=>selectRecord(Number(el.dataset.maskMode))));
 reduced.addEventListener?.('change',()=>{paused=true;draw();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){paused=true;draw();}});
 draw();renderRecord();
})();
