(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.A01729BlindCrosswalkAudit=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const VERSION='1.1.0';
  const IDENTITY='NEXAH_A0_ORIENTATION_CONTROLLER_BENCH';
  const CONTRACT=Object.freeze({
    min:1,max:2500,
    selector:'POSITIVE_UNORDERED_CUBE_PAIR_COUNT_GTE_2',
    pairRule:'1 <= a <= b; a^3 + b^3 = n',
    excludedFromSelection:Object.freeze(['17|29','5×17 @ v29','ROOT-5 / PENTAGON MASK']),
    targetLabel:1729
  });
  const LADDER_CONTRACT=Object.freeze({
    windows:Object.freeze([1728,2500,5000,50000]),
    selector:CONTRACT.selector,
    controls:Object.freeze([52,493,1730,1836]),
    labelsExcluded:true
  });

  function enumerateCubePairs(min=CONTRACT.min,max=CONTRACT.max){
    if(!Number.isInteger(min)||!Number.isInteger(max)||min<1||max<min)throw Error('invalid finite scan window');
    const map=new Map();
    const limit=Math.floor(Math.cbrt(max));
    for(let a=1;a<=limit;a+=1){
      for(let b=a;a**3+b**3<=max;b+=1){
        const value=a**3+b**3;if(value<min)continue;
        if(!map.has(value))map.set(value,[]);
        map.get(value).push(Object.freeze({a,b}));
      }
    }
    return map;
  }

  function blindScan(contract=CONTRACT){
    const map=enumerateCubePairs(contract.min,contract.max);
    const represented=[...map.entries()].map(([value,pairs])=>Object.freeze({value,pairs:Object.freeze(pairs)})).sort((a,b)=>a.value-b.value);
    const candidates=represented.filter(row=>row.pairs.length>=2);
    return Object.freeze({
      contract:Object.freeze({...contract}),
      windowSize:contract.max-contract.min+1,
      representedCount:represented.length,
      candidates:Object.freeze(candidates),
      pass:candidates.length===1&&candidates[0].value===1729,
      labelsUsed:false
    });
  }

  function cyclicLabelNull(candidate=1729,contract=CONTRACT){
    const span=contract.max-contract.min+1,hits=[];
    for(let shift=0;shift<span;shift+=1){
      const assigned=contract.min+((contract.targetLabel-contract.min+shift)%span);
      if(assigned===candidate)hits.push(shift);
    }
    return Object.freeze({model:'EXHAUSTIVE_CYCLIC_LABEL_ASSIGNMENT_NULL',assignments:span,hits:Object.freeze(hits),hitCount:hits.length,fraction:hits.length/span,empiricalProbabilityClaim:false});
  }

  function sensitivityAudit(){
    const below=blindScan(Object.freeze({...CONTRACT,max:1728}));
    const declared=blindScan(CONTRACT);
    const neighbors=[1728,1730].map(value=>Object.freeze({value,pairCount:(enumerateCubePairs(value,value).get(value)||[]).length}));
    return Object.freeze({
      belowTargetCandidateCount:below.candidates.length,
      declaredCandidateCount:declared.candidates.length,
      neighborPairCounts:Object.freeze(neighbors),
      selectedCandidateDivisibleBy5:declared.candidates[0]?.value%5===0,
      pass:below.candidates.length===0&&declared.candidates.length===1&&neighbors.every(row=>row.pairCount===0)&&declared.candidates[0]?.value%5!==0
    });
  }

  function windowStabilityAudit(contract=LADDER_CONTRACT){
    const windows=[...contract.windows];
    if(!windows.length||windows.some((value,index)=>!Number.isInteger(value)||value<1||(index&&value<=windows[index-1])))throw Error('invalid increasing ladder windows');
    const max=windows[windows.length-1],map=enumerateCubePairs(1,max);
    const allCandidates=[...map.entries()].filter(([,pairs])=>pairs.length>=2).map(([value,pairs])=>Object.freeze({value,pairCount:pairs.length,pairs:Object.freeze(pairs)})).sort((a,b)=>a.value-b.value);
    const steps=windows.map(window=>{
      const candidates=allCandidates.filter(row=>row.value<=window);
      return Object.freeze({window,candidateCount:candidates.length,candidateValues:Object.freeze(candidates.map(row=>row.value))});
    });
    const first=allCandidates[0]||null;
    const declared=steps.find(step=>step.window===2500);
    const pass=steps[0]?.candidateCount===0&&declared?.candidateCount===1&&declared?.candidateValues[0]===1729&&first?.value===1729&&steps[steps.length-1].candidateCount>1;
    return Object.freeze({
      contract:Object.freeze({...contract}),steps:Object.freeze(steps),candidates:Object.freeze(allCandidates),
      firstCandidate:first?.value||null,firstRemainsLowest:first?.value===1729,declaredWindowUnique:declared?.candidateCount===1,
      globallyUnique:allCandidates.length===1,labelsUsed:false,pass
    });
  }

  function negativeControlAudit(values=LADDER_CONTRACT.controls){
    const rows=[...values].map(value=>{
      if(!Number.isInteger(value)||value<1)throw Error('invalid negative control');
      const pairs=enumerateCubePairs(value,value).get(value)||[];
      return Object.freeze({value,pairCount:pairs.length,selected:pairs.length>=2});
    });
    return Object.freeze({selector:CONTRACT.selector,rows:Object.freeze(rows),pass:rows.every(row=>row.pairCount===0&&!row.selected),labelsUsed:false});
  }

  function reveal(scan=blindScan()){
    if(!scan.pass)throw Error('blind arithmetic selector did not isolate the declared candidate');
    const candidate=scan.candidates[0];
    return Object.freeze({
      candidate:candidate.value,
      pairs:candidate.pairs,
      address:'17|29',
      addressOperation:'DECIMAL_LABEL_SPLIT_NOT_FACTORIZATION',
      historicalTrigger:'5×17 @ v29',
      historicalTriggerDerivedFromCandidate:false,
      geometricMask:'ROOT-5 / PENTAGON MASK',
      geometricMaskUsedForSelection:false,
      fiveDividesCandidate:candidate.value%5===0,
      conclusion:'ARITHMETIC SURVIVES; CROSSWALK REMAINS DESCRIPTIVE'
    });
  }

  function buildReceipt(){
    const scan=blindScan(),revealed=reveal(scan),labelNull=cyclicLabelNull(revealed.candidate),sensitivity=sensitivityAudit(),windowStability=windowStabilityAudit(),negativeControls=negativeControlAudit();
    const pass=scan.pass&&!scan.labelsUsed&&revealed.candidate===1729&&revealed.pairs.length===2&&revealed.historicalTriggerDerivedFromCandidate===false&&revealed.geometricMaskUsedForSelection===false&&revealed.fiveDividesCandidate===false&&labelNull.hitCount===1&&sensitivity.pass&&windowStability.pass&&!windowStability.labelsUsed&&negativeControls.pass;
    return Object.freeze({
      schema:'nexah.a0.1729-blind-crosswalk-audit/1',version:VERSION,date:'2026-10-23',identity:IDENTITY,
      classification:'BOUNDED_ENGINEERING_FALSIFICATION_AUDIT',status:pass?'PASS':'HOLD',
      contract:CONTRACT,blindScan:scan,reveal:revealed,labelAssignmentControl:labelNull,sensitivity,windowStability,negativeControls,
      interpretation:'The arithmetic selector independently isolates 1729 in 1…2500. Across the frozen window ladder, 1729 remains the first threshold crossing but is not globally unique; later label coincidences remain descriptive post-selection crosswalks.',
      authority:Object.freeze({researchRun:false,scientificEvidence:false,pValue:false,newIdentity:false,newRelation:false,newOperator:false,claimPromotion:false}),
      boundary:'Finite deterministic engineering audit only. Window extension tests selector stability, not global uniqueness. The cyclic label control is a declared synthetic assignment model, not an empirical probability or evidence for a shared mechanism. Root-5 remains an excluded geometric display mask.'
    });
  }

  function mount(doc,win=doc.defaultView||{}){
    const host=doc.getElementById('root5BlindAudit');if(!host)return null;
    const ids=['root5BlindStatus','root5BlindCandidate','root5BlindPairs','root5BlindLabels','root5BlindCounts','root5BlindNull','root5BlindVerdict','root5BlindRun','root5BlindReveal','root5BlindReset','root5BlindExport','root5LadderRun','root5LadderStatus','root5LadderWindows','root5LadderCandidates','root5LadderControls','root5LadderVerdict'];
    const nodes=Object.fromEntries(ids.map(id=>[id,doc.getElementById(id)]));
    const missing=ids.filter(id=>!nodes[id]);if(missing.length)throw Error(`blind crosswalk mount missing: ${missing.join(', ')}`);
    let phase='LOCKED',scan=null,record=null,ladder=null;
    function render(){
      const candidate=scan?.candidates?.[0];
      nodes.root5BlindStatus.textContent=phase==='LOCKED'?'LOCKED · LABELS EXCLUDED':phase==='SCANNED'?'BLIND PASS · 1 ARITHMETIC CANDIDATE':'REVEALED · CROSSWALK DESCRIPTIVE';
      nodes.root5BlindCandidate.textContent=candidate?String(candidate.value):'####';
      nodes.root5BlindPairs.textContent=candidate?candidate.pairs.map(pair=>`${pair.a}³+${pair.b}³`).join(' · '):'hidden until arithmetic scan';
      nodes.root5BlindLabels.textContent=phase==='REVEALED'?'17|29 · 5×17 @ v29 · Root-5':'LOCKED · NOT USED BY SELECTOR';
      nodes.root5BlindCounts.textContent=scan?`${scan.windowSize} integers · ${scan.representedCount} with ≥1 pair · ${scan.candidates.length} with ≥2`:'1…2500 · selector frozen';
      nodes.root5BlindNull.textContent=record?`${record.labelAssignmentControl.hitCount}/${record.labelAssignmentControl.assignments} cyclic assignments · synthetic control`:'not run';
      nodes.root5BlindVerdict.textContent=record?record.reveal.conclusion:'NO INTERPRETATION BEFORE REVEAL';
      nodes.root5BlindReveal.disabled=phase!=='SCANNED';
      nodes.root5LadderRun.disabled=!scan||!scan.pass;
      nodes.root5LadderStatus.textContent=ladder?'PASS · FIRST CANDIDATE STABLE':'LOCKED · RUN INITIAL BLIND SCAN';
      nodes.root5LadderWindows.textContent=ladder?ladder.steps.map(step=>`${step.window}:${step.candidateCount}`).join(' · '):'1728 · 2500 · 5000 · 50000';
      nodes.root5LadderCandidates.textContent=ladder?ladder.candidates.map((row,index)=>`#${index+1} ${row.value}`).join(' · '):'hidden until ladder run';
      nodes.root5LadderControls.textContent=ladder?negativeControlAudit().rows.map(row=>`${row.value}:${row.pairCount}`).join(' · '):'52 · 493 · 1730 · 1836';
      nodes.root5LadderVerdict.textContent=ladder?'1729 FIRST · NOT GLOBALLY UNIQUE':'NO RANGE CLAIM BEFORE LADDER';
      host.dataset.phase=phase.toLowerCase();
      win.A01729BlindCrosswalkView=Object.freeze({phase,scan,record,ladder});
      return record||scan;
    }
    nodes.root5BlindRun.addEventListener('click',()=>{scan=blindScan();record=null;phase=scan.pass?'SCANNED':'HOLD';render()});
    nodes.root5BlindReveal.addEventListener('click',()=>{if(phase!=='SCANNED')return;record=buildReceipt();phase=record.status==='PASS'?'REVEALED':'HOLD';win.A01729BlindCrosswalkReceipt=record;render()});
    nodes.root5LadderRun.addEventListener('click',()=>{if(!scan?.pass)return;ladder=windowStabilityAudit();render()});
    nodes.root5BlindReset.addEventListener('click',()=>{phase='LOCKED';scan=null;record=null;ladder=null;render()});
    nodes.root5BlindExport.addEventListener('click',()=>{const output=record||buildReceipt(),json=JSON.stringify(output,null,2);host.dataset.lastExport=json;if(win.Blob&&win.URL){const link=doc.createElement('a');link.href=win.URL.createObjectURL(new win.Blob([json],{type:'application/json'}));link.download='a0-1729-blind-crosswalk-audit.json';link.click();win.URL.revokeObjectURL(link.href)}});
    render();
    return Object.freeze({run(){scan=blindScan();phase=scan.pass?'SCANNED':'HOLD';return render()},runLadder(){if(!scan?.pass)throw Error('initial scan required before ladder');ladder=windowStabilityAudit();return render()},reveal(){if(phase!=='SCANNED')throw Error('scan required before reveal');record=buildReceipt();phase=record.status==='PASS'?'REVEALED':'HOLD';return render()},reset(){phase='LOCKED';scan=null;record=null;ladder=null;return render()},get phase(){return phase},get record(){return record},get ladder(){return ladder}});
  }

  return{VERSION,IDENTITY,CONTRACT,LADDER_CONTRACT,enumerateCubePairs,blindScan,cyclicLabelNull,sensitivityAudit,windowStabilityAudit,negativeControlAudit,reveal,buildReceipt,mount};
});
