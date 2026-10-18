(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.A0BenchSessionLedger=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const VERSION='1.0.0',SCHEMA='nexah.a0.bench-session-ledger/1',STORAGE_KEY='nexah.a0.ocb.session-ledger.v1';
  const clone=value=>JSON.parse(JSON.stringify(value));
  function createLedger(overrides={}){return Object.assign({schema:SCHEMA,version:VERSION,sessionId:`OCB-${Date.now().toString(36).toUpperCase()}`,createdAt:new Date().toISOString(),entries:[]},overrides)}
  function normalizeRecord(record={}){return Object.freeze({id:record.id||`R-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2,6).toUpperCase()}`,capturedAt:record.capturedAt||new Date().toISOString(),scenario:String(record.scenario||'unknown'),title:String(record.title||record.scenario||'Untitled record'),sourceId:String(record.sourceId||'NEXAH_A0_ORIENTATION_CONTROLLER_BENCH'),payload:clone(record.payload||{}),authority:'ENGINEERING_RECEIPT_NOT_SCIENTIFIC_EVIDENCE'})}
  function add(ledger,record){const next=clone(ledger);next.entries.push(normalizeRecord(record));return next}
  function remove(ledger,id){const next=clone(ledger);next.entries=next.entries.filter(entry=>entry.id!==id);return next}
  function compare(a,b){const pa=JSON.stringify(a?.payload||{}),pb=JSON.stringify(b?.payload||{});return Object.freeze({sameScenario:a?.scenario===b?.scenario,samePayload:pa===pb,scenarioA:a?.scenario||null,scenarioB:b?.scenario||null,bytesA:pa.length,bytesB:pb.length,classification:pa===pb?'EXACT_REPLAY_MATCH':a?.scenario===b?.scenario?'SAME_WINDOW_STATE_CHANGED':'CROSS_WINDOW_TYPED_COMPARISON'})}
  function receipt(ledger){return Object.freeze({schema:SCHEMA,version:VERSION,sessionId:ledger.sessionId,createdAt:ledger.createdAt,exportedAt:new Date().toISOString(),entryCount:ledger.entries.length,entries:clone(ledger.entries),authority:{sharedCarrier:false,sharedClock:false,scientificEvidence:false,researchRun:false,claimPromotion:false}})}
  function validate(value){return Boolean(value&&value.schema===SCHEMA&&value.version===VERSION&&Array.isArray(value.entries)&&value.entries.every(entry=>entry&&typeof entry.id==='string'&&typeof entry.scenario==='string'&&entry.authority==='ENGINEERING_RECEIPT_NOT_SCIENTIFIC_EVIDENCE'))}
  function load(storage){try{const saved=JSON.parse(storage?.getItem(STORAGE_KEY)||'null');if(validate(saved))return saved}catch(_){}return createLedger()}
  function captureStored(storage,record){const ledger=add(load(storage),record);try{storage?.setItem(STORAGE_KEY,JSON.stringify(ledger))}catch(_){}return ledger.entries.at(-1)}
  function mount(container,options={}){
    const win=options.window||container.ownerDocument?.defaultView||{},storage=options.storage||win.localStorage;
    let ledger=load(storage);
    container.innerHTML=`<div class="bsl-actions"><label>Capture window<select data-bsl="scenario">${(options.scenarios||['window','control','native','measurement','bridges','adapters','economy','root','observatory']).map(id=>`<option value="${id}">${id}</option>`).join('')}</select></label><button type="button" data-bsl="capture">CAPTURE</button><button type="button" data-bsl="compare">COMPARE LAST 2</button><button type="button" data-bsl="export">EXPORT RECEIPT</button><button type="button" data-bsl="clear">CLEAR</button></div><div class="bsl-status" data-bsl="status" aria-live="polite">SESSION READY</div><div class="bsl-list" data-bsl="list"></div><div class="bsl-compare" data-bsl="comparison">Capture two records to compare.</div>`;
    const $=key=>container.querySelector(`[data-bsl="${key}"]`);
    function persist(){try{storage?.setItem(STORAGE_KEY,JSON.stringify(ledger))}catch(_){} }
    function render(){$('list').innerHTML=ledger.entries.length?ledger.entries.map((entry,index)=>`<article><small>${String(index+1).padStart(2,'0')} · ${entry.scenario}</small><b>${entry.title}</b><span>${entry.capturedAt}</span><div><button type="button" data-bsl-replay="${entry.scenario}">OPEN WINDOW</button><button type="button" data-bsl-remove="${entry.id}">REMOVE</button></div></article>`).join(''):'<p>No captures yet.</p>';$('status').textContent=`${ledger.entries.length} RECORD${ledger.entries.length===1?'':'S'} · ${ledger.sessionId}`;container.querySelectorAll('[data-bsl-remove]').forEach(button=>button.addEventListener('click',()=>{ledger=remove(ledger,button.dataset.bslRemove);persist();render()}));container.querySelectorAll('[data-bsl-replay]').forEach(button=>button.addEventListener('click',()=>win.A0CoupledWindowController?.open?.(button.dataset.bslReplay)));return ledger}
    function capture(record){ledger=add(ledger,record);persist();render();return ledger.entries.at(-1)}
    $('capture').addEventListener('click',()=>{const scenario=$('scenario').value,payload=scenario==='observatory'?win.A0ApertureObservatoryController?.snapshot?.():{scenario,status:'DECLARED_WINDOW_CAPTURE',capturedFrom:'SESSION_LEDGER'};capture({scenario,title:`${scenario} window`,payload})});
    $('compare').addEventListener('click',()=>{const pair=ledger.entries.slice(-2);$('comparison').textContent=pair.length<2?'Capture two records to compare.':JSON.stringify(compare(pair[0],pair[1]),null,2)});
    $('export').addEventListener('click',()=>{const data=JSON.stringify(receipt(ledger),null,2),blob=new win.Blob([data],{type:'application/json'}),url=win.URL.createObjectURL(blob),a=container.ownerDocument.createElement('a');a.href=url;a.download=`${ledger.sessionId}.json`;a.click();win.URL.revokeObjectURL(url)});
    $('clear').addEventListener('click',()=>{ledger=createLedger();persist();render();$('comparison').textContent='Capture two records to compare.'});
    render();
    return Object.freeze({capture,get ledger(){return clone(ledger)},render,receipt:()=>receipt(ledger),compareLast:()=>ledger.entries.length<2?null:compare(...ledger.entries.slice(-2))});
  }
  return{VERSION,SCHEMA,STORAGE_KEY,createLedger,normalizeRecord,add,remove,compare,receipt,validate,load,captureStored,mount};
});
