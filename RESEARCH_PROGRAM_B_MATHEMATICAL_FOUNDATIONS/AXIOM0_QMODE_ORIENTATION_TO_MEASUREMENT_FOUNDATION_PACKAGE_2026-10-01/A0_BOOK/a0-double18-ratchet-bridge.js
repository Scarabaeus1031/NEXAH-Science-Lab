(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.A0Double18RatchetBridge=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const VERSION='1.0.0';
  const IDENTITY='NEXAH_A0_ORIENTATION_CONTROLLER_BENCH';
  const CLASSIFICATION='BOUNDED_DOCUMENTARY_ARITHMETIC_VIEW';
  const PHASES=Object.freeze(['FLOOR','LIFT','DOUBLE_18','RATCHET_LOCK','LIGHT_RETURN']);
  const PRIME_MARKERS=Object.freeze([3,7,11,17,19,29]);

  function isPrime(value){
    if(!Number.isInteger(value)||value<2)return false;
    for(let divisor=2;divisor*divisor<=value;divisor++)if(value%divisor===0)return false;
    return true;
  }

  function arithmetic(){
    const floor=Object.freeze({left:7,right:10,sum:17,gap:3});
    const lift=Object.freeze({left:8,right:11,sum:19,gap:3});
    const diagonals=Object.freeze({forward:floor.left+lift.right,reverse:lift.left+floor.right});
    return Object.freeze({
      floor,lift,diagonals,
      double18:diagonals.forward===18&&diagonals.reverse===18,
      factor18:Object.freeze({twoByThreeSquared:2*(3**2),threeBySix:3*6}),
      total:Object.freeze({seventeenPlusNineteen:floor.sum+lift.sum,twoByEighteen:2*18}),
      localReads:Object.freeze({elevenSquared:11**2,elevenByThree:11*3,tenPlusNineteen:10+19}),
      primeMarkers:Object.freeze(PRIME_MARKERS.map(value=>Object.freeze({value,prime:isPrime(value)})))
    });
  }

  function verify(){
    const read=arithmetic();
    const assertions=Object.freeze({
      floor17:read.floor.sum===17,
      lift19:read.lift.sum===19,
      equalSpacing:read.floor.gap===3&&read.lift.gap===3,
      forward18:read.diagonals.forward===18,
      reverse18:read.diagonals.reverse===18,
      factor18:read.factor18.twoByThreeSquared===18&&read.factor18.threeBySix===18,
      closure36:read.total.seventeenPlusNineteen===36&&read.total.twoByEighteen===36,
      elevenSquared121:read.localReads.elevenSquared===121,
      local33:read.localReads.elevenByThree===33,
      optional29:read.localReads.tenPlusNineteen===29,
      primeMarkers:read.primeMarkers.every(item=>item.prime)
    });
    return Object.freeze({status:Object.values(assertions).every(Boolean)?'PASS':'FAIL',assertions,arithmetic:read});
  }

  function createState(){return Object.freeze({phaseIndex:0,mode:'SHADOW'})}
  function step(state=createState()){
    const phaseIndex=Math.min(state.phaseIndex+1,PHASES.length-1);
    return Object.freeze({...state,phaseIndex});
  }
  function setMode(state=createState(),mode='SHADOW'){
    const value=String(mode).toUpperCase();
    if(!['SHADOW','LIGHT'].includes(value))throw new RangeError(`Unknown mode ${mode}`);
    return Object.freeze({...state,mode:value});
  }
  function inspect(state=createState()){
    const phase=PHASES[state.phaseIndex];
    return Object.freeze({...state,phase,locked:state.phaseIndex>=3,returned:state.phaseIndex===4,arithmetic:arithmetic()});
  }

  function svgMarkup(state=createState()){
    const view=inspect(state),active=state.phaseIndex,light=state.mode==='LIGHT';
    const node=(x,y,value,label,stage)=>`<g class="d18-node${PRIME_MARKERS.includes(value)?' prime':''}${active>=stage?' active':''}" transform="translate(${x} ${y})"><circle r="30"/><text y="7" text-anchor="middle">${value}</text><text class="d18-node-label" y="52" text-anchor="middle">${label}</text></g>`;
    return `<g class="d18-figure ${light?'is-light':'is-shadow'}">
      <rect class="d18-back" x="20" y="20" width="660" height="430" rx="18"/>
      <path class="d18-bracket floor${active>=0?' active':''}" d="M132 354Q350 414 568 354"/>
      <path class="d18-bracket lift${active>=1?' active':''}" d="M132 130Q350 70 568 130"/>
      <path class="d18-rail floor${active>=0?' active':''}" d="M160 330H540"/>
      <path class="d18-rail lift${active>=1?' active':''}" d="M160 150H540"/>
      <path class="d18-post${active>=1?' active':''}" d="M190 300V180M510 300V180"/>
      <path class="d18-diagonal a${active>=2?' active':''}" d="M190 300L510 180"/>
      <path class="d18-diagonal b${active>=2?' active':''}" d="M510 300L190 180"/>
      ${node(190,300,7,'FLOOR · PRIME',0)}${node(510,300,10,'FLOOR',0)}${node(190,180,8,'LIFT',1)}${node(510,180,11,'LIFT · PRIME',1)}
      <g class="d18-core${active>=2?' active':''}" transform="translate(350 240)"><circle r="55"/><text text-anchor="middle" y="-5">18 ╳ 18</text><text class="d18-core-small" text-anchor="middle" y="25">2 × 3²</text></g>
      <path class="d18-ratchet${active>=3?' active':''}" d="M112 356L112 150l-13 18m13-18 13 18"/>
      <path class="d18-return${active>=4?' active':''}" d="M588 150V356l-13-18m13 18 13-18"/>
      <text class="d18-title" x="350" y="54" text-anchor="middle">P1′ — P2 — P1 · OWNER ROLE GLYPH</text>
      <text class="d18-caption" x="350" y="432" text-anchor="middle">17 + 19 = 36 = 2 × 18 · phase ${view.phase}</text>
    </g>`;
  }

  function buildRecord(state=createState()){
    const proof=verify(),view=inspect(state);
    return Object.freeze({
      schema:'nexah.a0.double18-ratchet-bridge/1',version:VERSION,identity:IDENTITY,
      classification:CLASSIFICATION,status:proof.status,proof,view,
      roles:Object.freeze({floor:'ORANGE_FLOOR_7_10',lift:'RAINBOW_LIFT_8_11',towerBuilders:'DISPLAY_POSTS_7_TO_8_AND_10_TO_11',ratchet:'ONE_WAY_DISPLAY_SEQUENCE',ownerGlyph:'P1_PRIME_P2_P1'}),
      authority:Object.freeze({researchRun:false,scientificEvidence:false,newIdentity:false,newRelation:false,newCarrier:false,newOperator:false,claimPromotion:false,physicalMechanism:false}),
      boundary:'Exact finite arithmetic only. Pink circles mark local primes. 121=11² and P1′–P2–P1 are separate Owner readings; neither is identified with 18=2×3². The ratchet is a deterministic display sequence, not a physical mechanism.'
    });
  }

  function mount(doc,host){
    if(!doc||typeof doc.getElementById!=='function')throw new TypeError('Document-like root required');
    const section=doc.getElementById('double18RatchetBridge');if(!section)return null;
    const svg=doc.getElementById('double18RatchetSvg'),status=doc.getElementById('double18RatchetStatus'),phase=doc.getElementById('double18RatchetPhase'),cross=doc.getElementById('double18RatchetCross'),lock=doc.getElementById('double18RatchetLock');
    let state=createState();
    const render=()=>{const view=inspect(state);section.dataset.phase=view.phase.toLowerCase();section.dataset.mode=state.mode.toLowerCase();if(svg)svg.innerHTML=svgMarkup(state);if(status)status.textContent=`${view.phase} · ${state.mode}`;if(phase)phase.textContent=`${state.phaseIndex+1}/5 · ${view.phase}`;if(cross)cross.textContent=view.arithmetic.double18?'18 / 18 · HELD':'OPEN';if(lock)lock.textContent=view.returned?'LIGHT RETURN · CLOSED':view.locked?'RATCHET LOCK · HELD':'OPEN';return state};
    const stepButton=doc.getElementById('double18RatchetStep'),modeButton=doc.getElementById('double18RatchetMode'),reset=doc.getElementById('double18RatchetReset'),exportButton=doc.getElementById('double18RatchetExport');
    if(stepButton)stepButton.addEventListener('click',()=>{state=step(state);render()});
    if(modeButton)modeButton.addEventListener('click',()=>{state=setMode(state,state.mode==='SHADOW'?'LIGHT':'SHADOW');modeButton.setAttribute('aria-pressed',state.mode==='LIGHT'?'true':'false');render()});
    if(reset)reset.addEventListener('click',()=>{state=createState();render()});
    if(exportButton)exportButton.addEventListener('click',()=>{const json=JSON.stringify(buildRecord(state),null,2);section.dataset.lastExport=json;if(host&&host.Blob&&host.URL&&doc.createElement){const link=doc.createElement('a');link.href=host.URL.createObjectURL(new host.Blob([json],{type:'application/json'}));link.download='a0-double18-ratchet-bridge-view.json';link.click();host.URL.revokeObjectURL(link.href)}});
    render();return Object.freeze({getState:()=>state,step(){state=step(state);return render()},reset(){state=createState();return render()},setMode(mode){state=setMode(state,mode);return render()},record:()=>buildRecord(state)});
  }

  return{VERSION,IDENTITY,CLASSIFICATION,PHASES,PRIME_MARKERS,isPrime,arithmetic,verify,createState,step,setMode,inspect,svgMarkup,buildRecord,mount};
});
