(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else{root.A0BenchWorkDesk=api;root.A0BenchWorkDeskView=api.mount(root.document,root);}})(typeof globalThis==='undefined'?this:globalThis,function(){
 'use strict';
 const copy=x=>JSON.parse(JSON.stringify(x));
 const NAMES={m3:'M3 → Stack',pascal:'Player → Pascal',ihara:'Ihara → Visual 1'};
 function audit(binder,player,pulse,tower){
  const links=['m3','pascal','ihara'].map(id=>{
   const row=binder?.links?.find(x=>x.id===id),status=row?.status||'HOLD';
   let cause,next;
   if(['FOLLOWING','CONNECTED'].includes(status)){cause='READBACK_CONFIRMED';next='Lesepfad bestätigt; laufende Uhr ist dafür nicht erforderlich.';}
   else if(id==='pascal'&&(!player?.current||!['CONNECTED','HOLD_OPEN_LAYER'].includes(player.link))){cause='SOURCE_RECEIPT_MISSING';next='Im Club das Deck laden und „Bench verbinden“ öffnen; nur der Monitor derselben Club-Instanz erhält dessen Receipt. Ein anderer Bench-Tab ist nicht automatisch verbunden.';}
   else if(status==='HELD'){cause='HELD_NOT_LIVE';next='Gehaltene Aufnahme; für laufende Receipts Player→Pascal-Follow einschalten.';}
   else if(status==='SEPARATE'){cause=id==='ihara'?'SOURCE_SELECTION':'FOLLOW_DISABLED';next=id==='ihara'?'Visual 1 auf den kubischen G(10,2)-Read umstellen.':'M3-Follow im vorhandenen Stack einschalten.';}
   else{cause='SOURCE_OR_READBACK_INVALID';next='Vorhandene Quelle und Readback prüfen; keine Ersatzdaten einsetzen.';}
   return{id,title:NAMES[id],status,cause,detail:row?.detail||'Keine Binder-Lesung',next};
  });
  const connected=links.filter(x=>['FOLLOWING','CONNECTED'].includes(x.status)).length;
  const pstatus=pulse?.status==='CONNECTED'&&pulse.current?'CONNECTED':pulse?.status==='WAIT'?'WAIT':'HOLD';
  return{schema:'a0.bench-workdesk-audit/1',links,connected,pulse:{status:pstatus,reason:pulse?.reason||'CONNECT_REQUIRED',generation:pstatus==='CONNECTED'?pulse.current.generation:null,separateFromTower:true},
   tower:{status:tower?.status||'HOLD',retained:tower?.retainedSampleCount??null,anuTransport:null},
   wholeMachineReturn:false,simultaneousSnapshot:false,browserAcceptance:'OPEN'};
 }
 function mount(doc,win){
  const anchor=doc.getElementById('systemBinder')||doc.getElementById('benchMachinePicture');if(!anchor||doc.getElementById('benchWorkDesk'))return null;
  const css=doc.createElement('link');css.rel='stylesheet';css.href='a0-bench-workdesk.css?v=20261022';doc.head.append(css);
  const panel=doc.createElement('section');panel.id='benchWorkDesk';panel.className='bench-workdesk';
  panel.innerHTML='<header><small>ARBEITSPLATZ · NACH DEM RUNDGANG</small><h2>Was möchtest du ausprobieren?</h2><p>Öffne ein Instrument oder verbinde ONE PULSE. Die Anschlussdiagnose ist bei Bedarf direkt darunter.</p></header>'+
   '<div class="workdesk-actions"><button id="workdeskRefresh" type="button">Anschlüsse erneut prüfen</button><button id="workdeskPulse" type="button">ONE PULSE verbinden · ohne Play</button><a href="#anuTowerWorkbench">Tower bedienen ↓</a><a href="#binderConnections">Binder-Regler ↓</a><a href="#carrierReturnWorkbench">CRT / Ghost vergleichen ↓</a></div>'+
   '<output id="workdeskStatus" role="status" aria-live="polite"></output><details><summary>Anschlussdiagnose · drei lokale Lesepfade</summary><div id="workdeskLinks" class="workdesk-links"></div>'+
   '<div class="workdesk-boundaries"><p id="workdeskPulseStatus"></p><p id="workdeskTowerStatus"></p><p>ANU: Eingang, Winkel und Transportregel offen. Verdeckte Samples sind weder verloren noch automatisch gesammelt.</p></div></details>'+
   '<details><summary>Vergleichsnotizen · Quadrate, Register und Patchwork</summary><p>50²+1=2501: Portalstone-Mitte. 204²=41 616: Quadratfeld und 23³+24³+25³. 1000²=1 000 000: Ghost-Adressfeld mit n=1000·NP+RR. Eine gemeinsame Regel für die Seitenlängen 50, 204, 1000 bleibt offen.</p><p>111²=12321; 1111²=1234321. Expansion/Retraction benötigt eine eigene Hin-/Rückregel. Plate P2/P4 sind keine Primzahlindizes p₂/p₄; (p₅,p₃,p₂,p₄)=(11,5,3,7) bei üblicher Zählung mit 2.</p><a href="A0_NUMBERMAGICK_GRID_RESEARCH.html#story-grid">Portalstone / Numbermagick ↗</a> · <a href="#registerJanusWorkbench">Exaktes Klammerlabor ↓</a></details>'+
   '<details><summary>Abnahmefolge und technischer Audit-Record</summary><ol><li>Binder-Pfade einzeln lesen; fehlenden Receipt nicht durch Play ersetzen.</li><li>ONE PULSE verbinden. Erst bestätigte LIFE-/Three-Domain-Lesung zählt; PLAY bleibt im Game.</li><li>Eine Generation im Game schalten und beide Quellen auf dieselbe Generation prüfen; nach Trennen muss HOLD ohne alte Lesung erscheinen.</li><li>Browser-/Human-Abnahme getrennt vom Softwaretest dokumentieren.</li></ol><pre id="workdeskRecord"></pre></details>';
  anchor.before(panel);const el=id=>doc.getElementById(id);let current=null,disposed=false;
  const read=fn=>{try{return fn();}catch{return null;}};
  function render(){
   if(disposed)return;current=audit(read(()=>win.A0BinderConnectionsView?.snapshot()),read(()=>win.A0PlayerBenchMonitor?.snapshot()),read(()=>win.A0PulseBenchMonitor?.snapshot()),read(()=>win.A0AnuTowerController?.snapshot()));
   el('workdeskStatus').textContent=current.connected+'/3 lokale Lesepfade bestätigt · kein Gesamt-PASS';
   el('workdeskLinks').replaceChildren();
   for(const row of current.links){
    const card=doc.createElement('article'),title=doc.createElement('h3'),status=doc.createElement('b'),detail=doc.createElement('p'),next=doc.createElement('p'),link=doc.createElement('a');
    card.dataset.status=row.status;title.textContent=row.title;status.textContent=row.status;detail.textContent=row.detail;next.textContent=row.next;
    link.href=row.id==='m3'?'#apertureStackCalibration':row.id==='pascal'?'#oneOnePlayerMonitor':'#visual1GridGenerator';link.textContent='Vorhandene Regler öffnen ↓';
    card.append(title,status,detail,next,link);el('workdeskLinks').append(card);
   }
   const p=current.pulse;el('workdeskPulseStatus').textContent='ONE PULSE: '+p.status+' · '+p.reason+(p.generation===null?'':' · g'+p.generation)+' · kein M3-/ANU-Transport';
   el('workdeskTowerStatus').textContent='Tower: '+current.tower.status+(current.tower.retained===null?'':' · '+current.tower.retained+' Quellsamples behalten');
   el('workdeskRecord').textContent=JSON.stringify(current,null,2);return copy(current);
  }
  el('workdeskRefresh').addEventListener('click',()=>{win.A0BinderConnectionsView?.render();win.A0AnuTowerController?.render();render();});
  el('workdeskPulse').addEventListener('click',()=>{const button=el('pulseBenchConnect');if(button){button.click();el('pulseBenchMonitor')?.scrollIntoView?.({block:'start'});}render();});
  // Move only documentary sections. Native nodes/IDs/listeners and source authority remain intact.
  const drawers=[];
  for(const [id,label] of [['augustSourceTrail','Historische August-Quellen'],['integrationCrosswalk','Bestand und Quellen-Crosswalk'],['apTowerLegend','Dokumentarische Tower-Legende'],['benchShowcase','Erweiterte Vorführung · verändert Regler und kann Engines starten']]){
   const node=el(id);if(!node||node.parentElement?.classList.contains('workdesk-source-drawer'))continue;
   const drawer=doc.createElement('details'),summary=doc.createElement('summary');drawer.className='workdesk-source-drawer';summary.textContent=label;node.before(drawer);drawer.append(summary,node);drawers.push(drawer);
  }
  win.A0BenchDisclosures?.reveal?.();
  const off=[];
  for(const key of ['A0BinderConnectionsView','A0PulseBenchMonitor','A0ApertureMeasurementController','A0ApertureStackController','A0PlayerBenchMonitor']){const unsubscribe=win[key]?.subscribe?.(render);if(unsubscribe)off.push(unsubscribe);}
  win.addEventListener?.('pagehide',()=>{disposed=true;for(const fn of off)fn();});
  render();return{render,snapshot:()=>copy(current),drawers:drawers.length};
 }
 return{audit,mount};
});
