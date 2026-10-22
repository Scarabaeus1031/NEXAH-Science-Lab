/* One comparative reading over existing tools, not a common carrier or clock. */
(() => {
  'use strict';
  const $=id=>document.getElementById(id),root=$('orientationReading');if(!root)return;
  const protocol='A0_ORIENTATION_READING_V1',files={pascal:'A0_ORIENTATION_CONTROLLER_BENCH.html#pascalShadow',grid:'A0_PINK_DIAMOND_GRID_ATLAS.html#ghost-tiles'},frames=new Map(),panels=new Map();
  const questions={source:'Welche Quelle? Sewing: acht Lane-Werte. Pascal: trinomialer Träger der Tiefe n. Grid: ausgewähltes Fixture. Es gibt noch keine gemeinsame Quellabbildung.',orientation:'Welche Orientierung? Sewing-Paare und Offset, Pascal-Antipode mit Vorzeichen, Grid-Spiegelung und Streckung bleiben eigene Operationen.',projection:'Was zeigt die Ansicht? Apertur maskiert Zeichnung; Shadow-gon summiert Sektormassen; Grid adressiert Zellen. Räumlicher Ausschlag ist kein zeitliches Signal.',return:'Was bleibt erhalten? Sewing rekonstruiert acht Werte. Pascal-Schatten kann Orientierungen zusammenlegen; der Handle hält das Zeichen. TESA erhält deklarierte Quelladressen.'};
  let active='sewing',serial=0,collection=null,timer=null;
  const clone=value=>JSON.parse(JSON.stringify(value));
  const send=(key,payload)=>frames.get(key)?.contentWindow?.postMessage({protocol,target:key,...payload},'*');
  function explain(){const focus=$('orientationReadingFocus').value||'source';$('orientationReadingQuestion').textContent=questions[focus];if(active!=='sewing')send(active,{action:'focus',focus});}
  function select(key){
    if(!['sewing','pascal','grid'].includes(key))return;
    active=key;
    if(key!=='sewing'&&!panels.has(key)){
      const panel=document.createElement('section');panel.className='orientation-reading-panel';
      const frame=document.createElement('iframe');frame.title=key==='pascal'?'Original Orientation Controller Bench · Pascal / Antipode':'Original Pink Diamond Grid Atlas · TESA';frame.src=files[key];
      frame.addEventListener('load',()=>{if(active===key)explain();});
      panel.appendChild(frame);$('orientationReadingPanels').appendChild(panel);frames.set(key,frame);panels.set(key,panel);
    }
    panels.forEach((panel,k)=>panel.hidden=k!==key);
    root.querySelectorAll('[data-orientation-view]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.orientationView===key)));
    $('orientationReadingCurrent').textContent=key==='sewing'?'Sewing/Apertur bleibt direkt darunter bedienbar.':'Originalseite eingebettet · eigener Zustand und eigene Uhr bleiben erhalten.';
    $('orientationReadingStandalone').hidden=key==='sewing';if(key!=='sewing')$('orientationReadingStandalone').href=files[key];explain();
  }
  function show(){
    if(!collection)return;
    $('orientationReadingRecord').textContent=JSON.stringify(collection,null,2);
    const s=collection.sources.sewing,p=collection.sources.pascal,g=collection.sources.grid;
    $('orientationReadingStatus').textContent=`Sewing: ${s.status==='READ'?`${s.record.record.mode}, t=${s.record.time.toFixed(3)}`:s.status} · Pascal: ${p.status==='READ'?`n=${p.record.depth}, m=${p.record.sides}, Schattenkollision ${p.record.projectionCollision?'ja':'nein'}`:p.status} · Grid: ${g.status==='READ'?g.record.preset:g.status}. Getrennte Lesemomente, kein atomarer Freeze und keine gemeinsame Zeit.`;
    $('orientationReadingExport').disabled=Object.values(collection.sources).some(item=>item.status==='PENDING');
  }
  function collect(){
    if(timer!==null)clearTimeout(timer);
    const requestId=`reading-${++serial}`;
    let sewing;try{sewing={status:'READ',capturedAt:new Date().toISOString(),record:clone(window.A0PentagonSewingView.snapshot())};}catch(error){sewing={status:'UNAVAILABLE',error:String(error.message)};}
    collection={kind:'COMPARATIVE_ORIENTATION_READING',version:1,requestId,startedAt:new Date().toISOString(),question:$('orientationReadingFocus').value||'source',sources:{sewing,pascal:{status:frames.has('pascal')?'PENDING':'NOT_OPENED',source:files.pascal},grid:{status:frames.has('grid')?'PENDING':'NOT_OPENED',source:files.grid}},relations:{navigation:'CONNECTED_EXISTING_VIEWS',commonCarrier:'UNBOUND',pascalToTemporalSignals:'UNBOUND',pascalSectorsToTesaAddresses:'UNBOUND',clock:'INDEPENDENT_NOT_SYNCHRONIZED'},boundary:'Read-only capture, not pause or replay. No automatic transfer of carrier values, sign, depth, sectors or grid addresses.'};
    for(const key of frames.keys())send(key,{action:'snapshot',requestId});show();
    timer=setTimeout(()=>{if(collection?.requestId!==requestId)return;for(const item of Object.values(collection.sources))if(item.status==='PENDING')item.status='UNAVAILABLE';show();timer=null;},1800);
  }
  window.addEventListener('message',event=>{
    const data=event.data;if(!data||data.protocol!==protocol||!['pascal','grid'].includes(data.source)||event.source!==frames.get(data.source)?.contentWindow||data.requestId!==collection?.requestId||!['READ','UNAVAILABLE'].includes(data.status)||collection.sources[data.source].status!=='PENDING')return;
    collection.sources[data.source]=clone({status:data.status,capturedAt:data.capturedAt,record:data.record,error:data.error});show();
  });
  root.querySelectorAll('[data-orientation-view]').forEach(button=>button.addEventListener('click',()=>select(button.dataset.orientationView)));
  $('orientationReadingFocus').addEventListener('change',explain);
  $('orientationReadingSewing').addEventListener('click',()=>{select('sewing');$('pentagonSewing').scrollIntoView({block:'start',behavior:'smooth'});});
  $('orientationReadingCapture').addEventListener('click',collect);
  $('orientationReadingExport').addEventListener('click',()=>{if(!collection||$('orientationReadingExport').disabled)return;const url=URL.createObjectURL(new Blob([JSON.stringify(collection,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='a0-comparative-orientation-reading.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
  window.A0OrientationReadingWorkspace={select,collect,snapshot:()=>collection?clone(collection):null};select('sewing');
})();
