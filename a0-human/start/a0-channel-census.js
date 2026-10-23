(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.A0ChannelCensus=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const VERSION='1.1.0';
  const EVIDENCE=Object.freeze({GENERATED:'GENERATED',CROSS_LEDGER_EXACT:'CROSS_LEDGER_EXACT',CANDIDATE_PATTERN:'CANDIDATE_PATTERN'});
  const COUNTERS=Object.freeze({
    ledger:Object.freeze({value:18,evidence:EVIDENCE.GENERATED,equation:'1 + 2 + 3 + 1 + 1 + 5 + 2 + 1 + 2 = 18',label:'Session Ledger',source:'A0_SCIENTIFIC_POSITION_REPORT.html'}),
    tour:Object.freeze({value:85,evidence:EVIDENCE.GENERATED,equation:'56 target bindings + 29 station/state/shell checks = 85',label:'Bench Tour',source:'A0_SCIENTIFIC_POSITION_REPORT.html'}),
    navigatorAudit:Object.freeze({value:252,evidence:EVIDENCE.GENERATED,equation:'252 explicit app-audit predicates',label:'Navigator App Audit',source:'PUBLIC_SCIENCE_CONTEXT/APP/audit_app.mjs'}),
    htmlCoverage:Object.freeze({value:252,evidence:EVIDENCE.GENERATED,equation:'252 catalogued HTML files / 252 covered',label:'HTML Curation Coverage',source:'PUBLIC_SCIENCE_CONTEXT/A0_SCIENTIFIC_POSITION_REPORT.html'}),
    coupled:Object.freeze({value:332,evidence:EVIDENCE.GENERATED,equation:'13 + (8 + 90×3) + 3 + 28 + 10 = 332',label:'Coupled Window',source:'A0_SCIENTIFIC_POSITION_REPORT.html'})
  });
  const TYPED_170=Object.freeze({
    located:true,
    value:170,
    type:'navigator_internal_entity_count',
    role:'registry_population',
    state:'FROZEN_HISTORICAL_BASELINE',
    source:'PUBLIC_SCIENCE_CONTEXT/FREEZE/NAVIGATOR_INTERNAL_V1_2026-10-07/FREEZE_SNAPSHOT.json',
    generator:'PUBLIC_SCIENCE_CONTEXT/BUILD/build_registry_exports.mjs',
    sameRoleAs252And332:false,
    sameGeneratingContractAs252And332:false,
    currentLikeForLikeCounter:false,
    audit:'A0_SCIENTIFIC_POSITION_REPORT.html'
  });

  function ladder(constant=87){
    if(!Number.isInteger(constant)||constant<5)throw Error('ladder constant must be an integer >= 5');
    return Object.freeze([1,2,3,4,5].map(k=>Object.freeze({k,complement:constant-k,product:k*(constant-k),delta:k===1?null:(constant-(2*k)+1)})));
  }

  function buildCensus({typed170Record=TYPED_170}={}){
    const rows=ladder(87),missing=rows.find(row=>row.product===170);
    const exact252=COUNTERS.navigatorAudit.value===COUNTERS.htmlCoverage.value&&14*COUNTERS.ledger.value===252;
    const exact332=COUNTERS.coupled.value===4*83;
    const exact85=COUNTERS.tour.value===87-2;
    const typed170=typed170Record&&typeof typed170Record==='object'?typed170Record:Object.freeze({located:Boolean(typed170Record),sameRoleAs252And332:Boolean(typed170Record),sameGeneratingContractAs252And332:Boolean(typed170Record),currentLikeForLikeCounter:Boolean(typed170Record)});
    const compatible170=Boolean(typed170.located&&typed170.sameRoleAs252And332&&typed170.sameGeneratingContractAs252And332&&typed170.currentLikeForLikeCounter);
    const classification=compatible170&&exact252&&exact332&&exact85?'SOURCE_BOUND_SEQUENCE_CANDIDATE':typed170.located?'CANDIDATE_PATTERN_TYPED_170_ROLE_MISMATCH':'CANDIDATE_PATTERN_MISSING_TYPED_170';
    return Object.freeze({
      schema:'nexah.a0.channel-census-record/1',version:VERSION,identity:'NEXAH_A0_ORIENTATION_CONTROLLER_BENCH',
      counters:COUNTERS,
      exactRelations:Object.freeze([
        Object.freeze({evidence:EVIDENCE.CROSS_LEDGER_EXACT,equation:'14 × 18 = 252',meaning:'coupled-window scenario count × ledger check count equals the Navigator audit and HTML coverage count; these systems do not calculate one another'}),
        Object.freeze({evidence:EVIDENCE.CROSS_LEDGER_EXACT,equation:'252 = 3 × 84; 332 = 4 × 83',meaning:'adjacent constant-sum factor pairs expose the 87 ladder; not a source generator'}),
        Object.freeze({evidence:EVIDENCE.CROSS_LEDGER_EXACT,equation:'332 − 252 = 80',meaning:'adjacent products differ by 80'})
      ]),
      candidate:Object.freeze({evidence:EVIDENCE.CANDIDATE_PATTERN,rule:'a(k)=k(87−k)',rows,missingProduct:missing.product,typed170Record:typed170,compatible170,classification}),
      decision:Object.freeze({status:classification,sequenceEstablished:Boolean(compatible170&&exact252&&exact332&&exact85),nextGate:compatible170?'COMPARE_FULL_RECORD_LINEAGE':'KEEP_AS_CROSS_LEDGER_RESONANCE_UNLESS_A_LIKE_FOR_LIKE_170_CHANNEL_RECORD_PREEXISTS',stopRule:'Do not promote the 87 ladder: the located frozen 170 counts Navigator entities, while 252 and 332 count audit or test predicates under different generators.'}),
      authority:Object.freeze({researchRun:false,scientificEvidence:false,newIdentity:false,newRelation:false,newFamily:false,newStudy:false,publicationAuthorized:false}),
      boundary:'Generated counter decompositions are source-backed. A typed frozen 170 record exists, but its role, generator and currentness do not match the 252 and 332 counters. The 87 ladder remains a cross-ledger candidate pattern, not an established sequence.'
    });
  }

  function audit(record=buildCensus()){
    const checks=[
      COUNTERS.ledger.value===18,
      COUNTERS.tour.value===85,
      COUNTERS.navigatorAudit.value===252,
      COUNTERS.htmlCoverage.value===252,
      COUNTERS.coupled.value===332,
      COUNTERS.coupled.equation.includes('90×3'),
      record.candidate.rows.map(row=>row.product).join(',')==='86,170,252,332,410',
      record.candidate.rows.slice(1).map(row=>row.delta).join(',')==='84,82,80,78',
      record.candidate.missingProduct===170,
      record.candidate.typed170Record.located===true,
      record.candidate.compatible170===false,
      record.authority.researchRun===false&&record.authority.newIdentity===false
    ];
    return Object.freeze({status:checks.every(Boolean)?'PASS':'FAIL',checks:checks.length,passed:checks.filter(Boolean).length});
  }

  function mount(doc,win=doc.defaultView||{}){
    const host=doc.getElementById('channelCensus');if(!host)return null;
    const status=doc.getElementById('channelCensusStatus'),decision=doc.getElementById('channelCensusDecision'),auditOut=doc.getElementById('channelCensusAudit'),typed170Label=doc.getElementById('channelCensus170Label'),run=doc.getElementById('channelCensusRun'),exportButton=doc.getElementById('channelCensusExport');
    if(!status||!decision||!auditOut||!typed170Label||!run||!exportButton)throw Error('Channel Census mount incomplete');
    const record=buildCensus();
    function render(){
      const result=audit(record);status.textContent=result.status;status.dataset.state=result.status.toLowerCase();
      decision.textContent=record.decision.status;decision.dataset.state=record.decision.sequenceEstablished?'established':'candidate';
      typed170Label.textContent='k=2 · FOUND · ROLE ≠';
      auditOut.textContent=`${result.passed}/${result.checks} MODEL CHECKS · 170: LOCATED / FROZEN / TYPE MISMATCH`;
      win.A0ChannelCensusView=record;return result;
    }
    function download(){const blob=new Blob([JSON.stringify(record,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),anchor=doc.createElement('a');anchor.href=url;anchor.download='a0-channel-census-record.json';anchor.click();URL.revokeObjectURL(url)}
    run.addEventListener('click',render);exportButton.addEventListener('click',download);render();
    return Object.freeze({render,get record(){return record}});
  }

  return{VERSION,EVIDENCE,COUNTERS,TYPED_170,ladder,buildCensus,audit,mount};
});
