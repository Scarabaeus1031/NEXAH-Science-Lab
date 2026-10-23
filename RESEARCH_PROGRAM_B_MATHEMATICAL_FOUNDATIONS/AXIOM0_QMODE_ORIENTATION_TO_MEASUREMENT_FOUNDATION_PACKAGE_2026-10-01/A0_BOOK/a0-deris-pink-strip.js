(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.A0DerisPinkStrip=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const VERSION='1.0.0';
  const PHASES=Object.freeze(['HOLD','BEFORE','STRIP','AFTER','RECROSS','COMMITTED']);
  const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));

  function normalizeContract({epsilon=.03,commitment=3}={}){
    epsilon=Number(epsilon);commitment=Number(commitment);
    if(!Number.isFinite(epsilon)||epsilon<0||epsilon>.25)throw Error('epsilon must be in 0..0.25');
    if(!Number.isInteger(commitment)||commitment<1||commitment>12)throw Error('commitment must be integer 1..12');
    return Object.freeze({epsilon,commitment});
  }

  function classify(value,cut,epsilon){
    value=Number(value);cut=Number(cut);epsilon=Number(epsilon);
    if(![value,cut,epsilon].every(Number.isFinite))return Object.freeze({phase:'HOLD',g:null});
    const g=value-cut,tolerance=1e-12;
    return Object.freeze({phase:g<-epsilon-tolerance?'BEFORE':g>epsilon+tolerance?'AFTER':'STRIP',g});
  }

  function createTracker(){
    return Object.freeze({phase:'HOLD',zone:'HOLD',armed:false,pending:false,committed:false,afterStreak:0,eventId:0,lastKey:null,history:Object.freeze([])});
  }

  function observe(previous,observation,contractInput){
    const contract=normalizeContract(contractInput),state=previous||createTracker();
    if(!observation||!Number.isFinite(Number(observation.value))||!Number.isFinite(Number(observation.cut)))return createTracker();
    const key=String(observation.key??observation.index??state.history.length);
    if(key===state.lastKey)return state;
    const reading=classify(observation.value,observation.cut,contract.epsilon),zone=reading.phase;
    let {armed,pending,committed,afterStreak,eventId}=state,phase=zone;
    if(zone==='BEFORE'){
      phase=pending&&!committed?'RECROSS':'BEFORE';
      armed=true;pending=false;committed=false;afterStreak=0;
    }else if(zone==='STRIP'){
      phase=pending&&!committed?'RECROSS':'STRIP';
      armed=true;pending=false;committed=false;afterStreak=0;
    }else if(zone==='AFTER'){
      if(committed)phase='COMMITTED';
      else if(armed||pending){
        if(!pending)eventId+=1;
        pending=true;afterStreak+=1;
        if(afterStreak>=contract.commitment){phase='COMMITTED';committed=true;pending=false}
      }
    }
    const entry=Object.freeze({index:Number(observation.index),sourceKey:String(observation.sourceKey||'M3'),value:Number(observation.value),cut:Number(observation.cut),g:reading.g,zone,phase,afterStreak,eventId});
    return Object.freeze({phase,zone,armed,pending,committed,afterStreak,eventId,lastKey:key,history:Object.freeze([...state.history,entry].slice(-96))});
  }

  function buildReceipt({tracker,contract,sourceRecord}={}){
    const normalized=normalizeContract(contract),state=tracker||createTracker();
    return Object.freeze({
      schema:'nexah.a0.deris-pink-strip-record/1',version:VERSION,
      identity:'NEXAH_A0_ORIENTATION_CONTROLLER_BENCH',source:'PXA_BLUE_IRIS_APERTURE / M3',
      eventFunction:'g(sample)=I(sample)-observingCut',strip:'|g|<=epsilon',
      parameters:normalized,current:{phase:state.phase,zone:state.zone,afterStreak:state.afterStreak,eventId:state.eventId},
      observations:state.history,sourceFingerprint:sourceRecord?.sourceFingerprint||null,
      authority:{researchRun:false,scientificEvidence:false,newCarrier:false,newOperatorIdentity:false},
      boundary:'Object-specific engineering classifier over the existing M3 trace. DERIS is a documentary/diagnostic label here, not a universal operator or physical transition law.'
    });
  }

  function mount(doc,win=doc.defaultView||{},options={}){
    const host=doc.getElementById('derisPinkStripBench');if(!host)return null;
    const epsilon=doc.getElementById('derisEpsilon'),epsilonOut=doc.getElementById('derisEpsilonOut'),commitment=doc.getElementById('derisCommitment'),commitmentOut=doc.getElementById('derisCommitmentOut'),phase=doc.getElementById('derisPhase'),gOut=doc.getElementById('derisG'),sampleOut=doc.getElementById('derisSample'),streakOut=doc.getElementById('derisStreak'),history=doc.getElementById('derisHistory'),rail=doc.getElementById('derisRail'),reset=doc.getElementById('derisReset'),exportButton=doc.getElementById('derisExport'),cutInput=doc.getElementById('m3Cut');
    const required={epsilon,epsilonOut,commitment,commitmentOut,phase,gOut,sampleOut,streakOut,history,rail,reset,exportButton,cutInput};
    const missing=Object.entries(required).filter(([,node])=>!node).map(([name])=>name);
    if(missing.length)throw Error(`DERIS mount missing: ${missing.join(', ')}`);
    const source=options.source||win.A0ApertureMeasurementController;
    if(!source||typeof source.readSource!=='function'||typeof source.subscribe!=='function')throw Error('DERIS requires the existing M3 source controller');
    let tracker=createTracker(),contractKey='',lastRecord=null;

    const readContract=()=>normalizeContract({epsilon:Number(epsilon.value),commitment:Number(commitment.value)});
    function render(force=false){
      const contract=readContract(),cut=Number(cutInput.value),nextContractKey=`${contract.epsilon}|${contract.commitment}|${cut}`;
      if(nextContractKey!==contractKey){tracker=createTracker();contractKey=nextContractKey;force=true}
      epsilonOut.textContent=contract.epsilon.toFixed(3);commitmentOut.textContent=`${contract.commitment} samples`;
      const snapshot=source.readSource(),active=snapshot?.trace?.[snapshot.cursor];
      if(!active){tracker=createTracker();phase.textContent='HOLD';host.dataset.phase='hold';gOut.textContent='g = —';sampleOut.textContent='M3 source unavailable';streakOut.textContent=`0 / ${contract.commitment}`;history.innerHTML='<span>HOLD · no M3 source record</span>';lastRecord=buildReceipt({tracker,contract,sourceRecord:snapshot?.record});return false}
      const sourceFingerprint=snapshot.record?.sourceFingerprint||'M3',key=`${sourceFingerprint}:${snapshot.cursor}`;
      if(force||key!==tracker.lastKey)tracker=observe(tracker,{key,index:active.index,value:active.I,cut,sourceKey:`M3:${active.index}`},contract);
      const current=tracker.history[tracker.history.length-1],value=Number(active.I);
      phase.textContent=tracker.phase;host.dataset.phase=tracker.phase.toLowerCase();
      gOut.textContent=`g = ${current&&Number.isFinite(current.g)?current.g.toFixed(4):'—'}`;
      sampleOut.textContent=`I ${value.toFixed(4)} · cut ${cut.toFixed(3)} · sample ${active.index+1}/${snapshot.trace.length}`;
      streakOut.textContent=`${tracker.afterStreak} / ${contract.commitment}`;
      const stripLeft=clamp(cut-contract.epsilon,0,1)*100,stripRight=clamp(cut+contract.epsilon,0,1)*100;
      rail.style.setProperty('--deris-value',`${clamp(value,0,1)*100}%`);rail.style.setProperty('--deris-cut',`${clamp(cut,0,1)*100}%`);rail.style.setProperty('--deris-strip-left',`${stripLeft}%`);rail.style.setProperty('--deris-strip-width',`${Math.max(0,stripRight-stripLeft)}%`);
      history.innerHTML=tracker.history.slice(-8).map(item=>`<span data-phase="${item.phase.toLowerCase()}"><b>${item.phase}</b><i>#${item.index+1}</i><em>${item.g.toFixed(4)}</em></span>`).join('');
      lastRecord=buildReceipt({tracker,contract,sourceRecord:snapshot.record});
      win.A0DerisPinkStripView=lastRecord;return true;
    }
    function resetTracker(){tracker=createTracker();contractKey='';render(true)}
    function download(){const record=lastRecord||buildReceipt({tracker,contract:readContract(),sourceRecord:source.readSource()?.record}),blob=new Blob([JSON.stringify(record,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),anchor=doc.createElement('a');anchor.href=url;anchor.download='a0-deris-pink-strip-record.json';anchor.click();URL.revokeObjectURL(url)}
    epsilon.addEventListener('input',resetTracker);commitment.addEventListener('input',resetTracker);cutInput.addEventListener('input',()=>render());reset.addEventListener('click',resetTracker);exportButton.addEventListener('click',download);
    const unsubscribe=source.subscribe(()=>render());render(true);
    return Object.freeze({render,reset:resetTracker,dispose(){unsubscribe?.()},get state(){return tracker},get record(){return lastRecord}});
  }

  return{VERSION,PHASES,normalizeContract,classify,createTracker,observe,buildReceipt,mount};
});
