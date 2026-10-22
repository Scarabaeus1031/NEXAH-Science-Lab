(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else{root.ThreeDomainAtlasContracts=api;root.ThreeDomainAtlasContractMonitor=api.mount(root.document,root);}})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const NAMES=['chemistry','life','physics'];
  const DEFINITIONS=[
    ['chemistry','Chemistry','domain-engine.js','Independent chemistry model; thresholded four-channel transition ledger'],
    ['life','Life','domain-engine.js','Independent cellular model; four-channel transition ledger'],
    ['physics','Physics','domain-engine.js','Independent spin model; four-channel transition ledger'],
    ['joint','Joint','app.js','Arithmetic centroid of three ledger phasors; no feedback'],
    ['euler','Euler','euler-view.js','Ledger phasors plus selected exponential base at g mod 8; not Coxeter Euler polynomial'],
    ['fibonacci','Fibonacci','fibonacci-view.js','Exact (0,1) recurrence; index g mod 31; Cassini; loop is not numerical return'],
    ['ihara','Ihara','ihara-view.js','Finite source graph inspection at selected address; non-backtracking law; not Bench cubic cursor'],
    ['k-teller','k·NEG','k-teller-view.js','Separate domain C10 counts; full checkpoint required for source return'],
    ['blue-body','Blue Body','blue-body-view.js','Declared g mod 48 / phi-pi-Euler address schedule; not native body runtime']
  ];
  const OPEN=[
    {id:'atlas-to-bench',status:'OPEN',missing:'Window/session transport, freshness and explicit carrier/coordinate map; navigation is not a live binding'},
    {id:'atlas-to-seed-cross',status:'OPEN',missing:'Explicit current-index convention, source witness and return scope; (1,1) is a different start from (0,1)'},
    {id:'atlas-to-bench-ihara',status:'OPEN',missing:'Source-owned directed-state/index and journal map; same graph name is not a shared cursor'},
    {id:'glyph-vendissimal',status:'OPEN',missing:'Historical symbol decoder and selected alphabet/radix; no automatic 3|666|9 to geometry map'},
    {id:'pentagon-coil-janus',status:'OPEN',missing:'Explicit shared boundary, operator and inverse/negative control; no mapping from colour or count alone'}
  ];
  const copy=x=>JSON.parse(JSON.stringify(x));
  function report(detail,readings={},hidden=false){
    const g=detail?.generation,source=Number.isInteger(g)&&g>=0&&g<=240&&NAMES.every(n=>{
      const s=detail.snapshots?.[n],l=s?.ledger;return s?.generation===g&&l&&['c00','c01','c10','c11','total'].every(k=>Number.isSafeInteger(l[k])&&l[k]>=0)&&l.total===s.n*s.n&&l.c00+l.c01+l.c10+l.c11===l.total;
    });
    const rows=DEFINITIONS.map(([id,label,path,rule])=>{
      const r=readings[id],primary=NAMES.includes(id),local=r?.follow===false;
      let status=hidden?'HOLD_HIDDEN':!source?'HOLD_SOURCE':primary?'FOLLOWING':!r?'HOLD_MISSING_VIEW':('follow' in r&&typeof r.follow!=='boolean')?'HOLD_MISSING_VIEW':local?'LOCAL':r.generation!==g?'HOLD_STALE_VIEW':'FOLLOWING';
      if(status==='FOLLOWING'&&id==='euler'&&r.phase!==g%8)status='HOLD_PHASE';
      if(status==='FOLLOWING'&&id==='fibonacci'&&r.phase!==g%31)status='HOLD_PHASE';
      if(status==='FOLLOWING'&&id==='blue-body'&&r.phase!==g%48)status='HOLD_PHASE';
      return{id,label,path,rule,status,sourceGeneration:source?g:null,reading:primary&&source?{generation:g,ledger:copy(detail.snapshots[id].ledger),controller:copy(detail.snapshots[id].controller||{})}:r?copy(r):null};
    });
    return{schema:'a0.three-domain-atlas-contracts/1',status:hidden?'HOLD_HIDDEN':source?'SOURCE_READOUT':'HOLD_SOURCE',generation:source?g:null,rows,following:rows.filter(r=>r.status==='FOLLOWING').length,local:rows.filter(r=>r.status==='LOCAL').length,openContracts:copy(OPEN),clock:{source:'app.js / generation',masterTimers:1,independentSynchronizedTimers:false,monitorAddsClock:false},boundary:'Nine registered views, not nine equivalent carriers. FOLLOWING is a source/readback check, not a scientific or whole-machine PASS.',wholeMachineReturn:false};
  }
  function mount(doc,win){
    if(!doc?.getElementById('atlasContracts'))return null;let last=null,ended=false,downloadURL=null;
    const $=id=>doc.getElementById(id),text=id=>$(id)?.textContent||'',number=(id,prefix)=>{const s=text(id);return s.startsWith(prefix)&&/^\d+$/.test(s.slice(prefix.length))?Number(s.slice(prefix.length)):null;},value=id=>$(id)?Number($(id).value):null,follow=id=>$(id)?$(id).checked===true:null;
    function readings(){return{
      joint:{generation:last?.generation,re:text('jointRe'),im:text('jointIm'),events:text('jointEvents')},
      euler:{generation:number('eulerGeneration','g'),phase:number('eulerN','n'),follow:follow('eulerFollow'),power:text('eulerPower'),base:doc.querySelector?.('[data-euler-base][aria-pressed="true"]')?.dataset.eulerBase||null},
      fibonacci:{generation:number('fibonacciGeneration','g'),phase:number('fibonacciN','n'),follow:follow('fibonacciFollow'),pair:text('fibonacciPairValue'),cassini:text('fibonacciCassini')},
      ihara:{generation:number('iharaGeneration','g'),follow:follow('iharaFollow'),graph:$('iharaGraph')?.value||null,address:value('iharaPhase'),edge:text('iharaState'),blocked:text('iharaBlocked')},
      'k-teller':{generation:number('kTellerGeneration','t'),total:text('kTellerTotal')},
      'blue-body':{generation:number('blueBodyGeneration','g'),phase:number('blueBodyStepValue',''),follow:follow('blueBodyFollow'),sourceKey:text('blueBodySourceKey'),receipt:text('blueBodyReturnReceipt')}
    };}
    function snapshot(){return report(ended?null:last,readings(),doc.hidden);}
    function render(){const r=snapshot();$('atlasContractsStatus').textContent=`${r.status} · g${r.generation??'—'} · ${r.following}/9 folgen · ${r.local} lokal · kein Gesamt-PASS`;
      const body=$('atlasContractsRows');body.replaceChildren();for(const row of r.rows){const tr=doc.createElement('tr');for(const value of [row.label,row.status,row.sourceGeneration===null?'—':`g${row.sourceGeneration}`,row.reading?JSON.stringify(row.reading):'Keine aktuelle Lesung',row.rule]){const td=doc.createElement('td');td.textContent=value;tr.append(td);}body.append(tr);}
      $('atlasContractsLedger').textContent=JSON.stringify(r,null,2);return r;
    }
    function onSource(e){last=e.detail;render();}
    function download(){const r=snapshot();if(downloadURL)win.URL.revokeObjectURL(downloadURL);downloadURL=win.URL.createObjectURL(new win.Blob([JSON.stringify(r,null,2)],{type:'application/json'}));const a=doc.createElement('a');a.href=downloadURL;a.download='a0-atlas-contract-readout.json';a.click();return r;}
    win.addEventListener('threedomain:render',onSource);doc.addEventListener('change',render);doc.addEventListener('input',render);doc.addEventListener('visibilitychange',render);
    $('atlasContractsRead').addEventListener('click',render);$('atlasContractsExport').addEventListener('click',download);
    win.addEventListener('pagehide',()=>{ended=true;last=null;if(downloadURL)win.URL.revokeObjectURL(downloadURL);downloadURL=null;render();win.removeEventListener?.('threedomain:render',onSource);doc.removeEventListener?.('change',render);doc.removeEventListener?.('input',render);});
    render();return Object.freeze({snapshot,render,exportRecord:snapshot});
  }
  return{DEFINITIONS,OPEN,report,mount};
});
