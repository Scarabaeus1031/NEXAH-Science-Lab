(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.A0PulseGrammarClock=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const VERSION='1.0.0';
  const IDENTITY='NEXAH_A0_ORIENTATION_CONTROLLER_BENCH';
  const SOURCE_MODEL='NEXAH:CON_DAO_BREATH:V1';
  const GROUPS=Object.freeze([
    Object.freeze({id:'CARO',label:'CA–RO–THÉ–MA–NU',tokens:Object.freeze(['CA','RO','THÉ','MA','NU']),color:'#38d7ef'}),
    Object.freeze({id:'CON_DAO',label:'CON–DAO',tokens:Object.freeze(['CON','DAO']),color:'#f7be3e'}),
    Object.freeze({id:'AUNAHETI',label:'AU–NA–HE–TI',tokens:Object.freeze(['AU','NA','HE','TI']),color:'#f653ad'})
  ]);
  const OUTER=Object.freeze(GROUPS.flatMap((group,groupIndex)=>group.tokens.map((token,index)=>Object.freeze({token,group:group.id,groupIndex,index,color:group.color}))));
  const copy=value=>value==null?null:JSON.parse(JSON.stringify(value));

  function validateModel(model){
    if(!model||model.model_id!==SOURCE_MODEL||!Array.isArray(model.states)||model.states.length!==13)throw new TypeError('CON–DAO source model unavailable');
    const still=model.states.filter(state=>state.id==='STILL');
    if(still.length!==1||still[0].dwell!==2)throw new TypeError('CON–DAO STILL dwell contract mismatch');
    return model;
  }

  function innerSequence(model){
    validateModel(model);
    return Object.freeze(model.states.flatMap((state,index)=>Array.from({length:state.dwell||1},()=>Object.freeze({index,stateId:state.id,side:state.side}))));
  }

  function createState(){
    return Object.freeze({mode:'OUTER',outerIndex:0,innerTick:0,pulse:0,transitionCount:0,lastAction:'READY'});
  }

  function inspect(model,state=createState(),jointRecord=null){
    const sequence=innerSequence(model),outer=OUTER[state.outerIndex%OUTER.length],inner=sequence[state.innerTick%sequence.length];
    const jointAccepted=Boolean(jointRecord&&jointRecord.schema==='nexah.a0.three-domain-channel-joint/1'&&jointRecord.status==='SOURCE_BOUND'&&Array.isArray(jointRecord.domains)&&jointRecord.domains.length===3);
    return Object.freeze({
      identity:IDENTITY,mode:state.mode,outerIndex:state.outerIndex,outerToken:outer.token,outerGroup:outer.group,
      innerTick:state.innerTick,innerTickCount:sequence.length,innerState:inner.stateId,pulse:state.pulse,
      atPhraseGate:outer.group==='CON_DAO',atTransition:state.mode==='INNER'&&inner.stateId==='STILL',
      jointStatus:jointAccepted?'SOURCE_BOUND':jointRecord?'HOLD_INVALID_SOURCE':'HOLD_SOURCE',
      jointGeneration:jointAccepted?jointRecord.generation:null,
      counts:Object.freeze({phrase:Object.freeze([5,2,4]),phraseSlots:11,gate:Object.freeze([6,1,6]),uniqueStates:13,compositeCircumference:24,displayTicks:14,stillDwell:2}),
      equalityClaim:false,sharedNumericalClock:false,sharedPulseGrammar:true
    });
  }

  function step(model,state=createState()){
    const sequence=innerSequence(model);
    if(state.mode==='OUTER'){
      const outer=OUTER[state.outerIndex];
      if(outer.group==='CON_DAO')return Object.freeze({...state,mode:'INNER',innerTick:0,pulse:state.pulse+1,lastAction:'GATE_EXPANDED'});
      return Object.freeze({...state,outerIndex:(state.outerIndex+1)%OUTER.length,pulse:state.pulse+1,lastAction:'PHRASE_STEP'});
    }
    if(state.innerTick<sequence.length-1){
      const next=sequence[state.innerTick+1];
      return Object.freeze({...state,innerTick:state.innerTick+1,pulse:state.pulse+1,transitionCount:state.transitionCount+(next.stateId==='STILL'?1:0),lastAction:next.stateId==='STILL'?'STILL_TRANSITION':'GATE_STEP'});
    }
    return Object.freeze({...state,mode:'OUTER',outerIndex:7,innerTick:0,pulse:state.pulse+1,lastAction:'GATE_COLLAPSED'});
  }

  function expand(model,state=createState()){
    validateModel(model);
    return Object.freeze({...state,mode:'INNER',outerIndex:5,innerTick:0,pulse:state.pulse+1,lastAction:'GATE_EXPANDED'});
  }

  function reset(){return createState()}

  function capture(model,state,jointRecord=null){
    const view=inspect(model,state,jointRecord);
    return Object.freeze({
      schema:'nexah.a0.pulse-grammar-clock-transition/1',version:VERSION,identity:IDENTITY,status:view.atTransition?'TRANSITION_CAPTURED':'HOLD_NOT_AT_TRANSITION',
      pulse:`P${String(state.pulse).padStart(4,'0')}`,phrase:Object.freeze({segmentation:'5|2|4',slot:view.outerIndex+1,token:view.outerToken}),
      gate:Object.freeze({segmentation:'6|1|6',tick:view.innerTick+1,tickCount:view.innerTickCount,state:view.innerState,stillDwell:view.counts.stillDwell}),
      composite:Object.freeze({operation:'11+13',circumference:24,includesDisplayDwell:false}),
      joint:view.jointStatus==='SOURCE_BOUND'?Object.freeze({generation:view.jointGeneration,fingerprint:jointRecord.fingerprint}):Object.freeze({status:view.jointStatus}),
      geometry:Object.freeze({horizontal:'ALGO_WORD_LINE',vertical:'PURPLE_PAIRED_RAIL',relation:'ORTHOGONAL_DISPLAY_VIEW',transition:'PINK_DOT'}),
      authority:Object.freeze({researchRun:false,scientificEvidence:false,newIdentity:false,newRelation:false,newCarrier:false,newOperator:false,feedback:false}),
      boundary:'The composite circumference is 11 phrase slots + 13 unique gate states = 24. The 14-tick display sequence includes repeated STILL dwell and is not added to 24; the three-domain joint is a frozen read-only source receipt.'
    });
  }

  function esc(value){return String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]))}

  function svgMarkup(model,state=createState(),jointRecord=null){
    const view=inspect(model,state,jointRecord),sequence=innerSequence(model),cx=450,cy=245;
    const grid=Array.from({length:17},(_,i)=>`<path d="M${50+i*50} 35V455"/>`).join('')+Array.from({length:9},(_,i)=>`<path d="M50 ${55+i*50}H850"/>`).join('');
    const activeComposite=state.mode==='OUTER'?state.outerIndex:11+sequence[state.innerTick].index;
    const compositeTicks=Array.from({length:24},(_,index)=>{const angle=(-90+index*15)*Math.PI/180,x1=cx+Math.cos(angle)*200,y1=cy+Math.sin(angle)*180,x2=cx+Math.cos(angle)*(index===activeComposite?226:216),y2=cy+Math.sin(angle)*(index===activeComposite?203:194),kind=index<11?'phrase':'gate';return `<path class="pgc-composite-tick ${kind} ${index===activeComposite?'active':''}" d="M${x1.toFixed(2)} ${y1.toFixed(2)}L${x2.toFixed(2)} ${y2.toFixed(2)}"><title>${index<11?`PHRASE ${index+1} · ${OUTER[index].token}`:`GATE ${index-10} · ${model.states[index-11].id}`}</title></path>`}).join('');
    const outerNodes=OUTER.map((item,index)=>{const x=90+index*72,y=430,active=state.mode==='OUTER'&&index===state.outerIndex;return `<g class="pgc-word ${active?'active':''}" data-group="${item.group}"><circle cx="${x}" cy="${y}" r="${active?13:9}" style="--pgc-node:${item.color}"/><text x="${x}" y="${y+29}" text-anchor="middle">${item.token}</text></g>`}).join('');
    const unique=model.states.map((item,index)=>{if(item.id==='STILL')return '';const left=index<6,x=left?305:595,rank=left?index:12-index,y=95+rank*48,active=state.mode==='INNER'&&sequence[state.innerTick].stateId===item.id;return `<g class="pgc-gate-node ${active?'active':''}"><circle cx="${x}" cy="${y}" r="${active?11:7}"/><text x="${left?x-16:x+16}" y="${y+4}" text-anchor="${left?'end':'start'}">${item.id}</text></g>`}).join('');
    const teeth=Array.from({length:6},(_,i)=>{const y=118+i*47;return `<path class="pgc-tooth" d="M365 ${y}L430 ${y+25}M535 ${y}L470 ${y+25}"/>`}).join('');
    const joint=jointRecord&&view.jointStatus==='SOURCE_BOUND'?jointRecord:null;
    const ports=['CHEMISTRY','LIFE','PHYSICS'].map((label,index)=>{const x=702+index*58,y=92,domain=joint?.domains?.[index],bars=domain?['c00','c01','c10','c11'].map((key,j)=>`<rect x="${x-20+j*10}" y="${y+18-domain.normalized[key]*30}" width="7" height="${Math.max(2,domain.normalized[key]*30)}"/>`).join(''):'';return `<g class="pgc-domain ${joint?'bound':'hold'}"><title>${label}</title><circle cx="${x}" cy="${y}" r="15"/><text x="${x}" y="${y-25}" text-anchor="middle">${label[0]}</text>${bars}</g>`}).join('');
    return `<g class="pgc-grid">${grid}</g><ellipse class="pgc-composite-ring" cx="${cx}" cy="${cy}" rx="200" ry="180"/>${compositeTicks}<path class="pgc-algo-line" d="M65 ${cy}H835"/><text class="pgc-axis-label" x="75" y="${cy-12}">ALGO / WORD LINE · 90°</text><path class="pgc-purple-rail" d="M395 60V405M505 60V405"/><path class="pgc-purple-coil" d="M395 70C520 130 520 190 395 245C270 300 270 360 395 405M505 70C380 130 380 190 505 245C630 300 630 360 505 405"/>${teeth}<path class="pgc-joint-arm" d="M450 245L702 92M450 245L760 92M450 245L818 92"/>${ports}<circle class="pgc-transition ${view.atTransition?'active':''}" cx="${cx}" cy="${cy}" r="17"/><circle class="pgc-transition-core" cx="${cx}" cy="${cy}" r="5"/><text class="pgc-transition-label" x="${cx}" y="${cy-28}" text-anchor="middle">${view.atTransition?'STILL · TRANSITION':'PINK DOT · GATE'}</text><g class="pgc-still ${view.atTransition?'active':''}"><circle cx="450" cy="245" r="31"/><text x="450" y="250" text-anchor="middle">STILL</text></g>${unique}<path class="pgc-v-rail" d="M305 95L450 245L595 95"/>${outerNodes}<text class="pgc-count" x="450" y="482" text-anchor="middle">11 PHRASE SLOTS + 13 UNIQUE GATE STATES = 24 COMPOSITE</text><text class="pgc-count pgc-count-minor" x="450" y="505" text-anchor="middle">14 DISPLAY TICKS = 13 STATES + REPEATED STILL · NOT 25</text>`;
  }

  function buildRecord(model,state=createState(),jointRecord=null,lastCapture=null){
    return Object.freeze({schema:'nexah.a0.pulse-grammar-clock-view/1',version:VERSION,identity:IDENTITY,classification:'SOURCE_BOUND_REPRESENTATION',sourceModel:SOURCE_MODEL,view:inspect(model,state,jointRecord),phrase:Object.freeze(GROUPS.map(group=>({id:group.id,label:group.label,tokens:[...group.tokens]}))),transition:copy(lastCapture),joint:jointRecord?copy(jointRecord):null,authority:{researchRun:false,scientificEvidence:false,newIdentity:false,newRelation:false,newCarrier:false,newOperator:false,feedback:false},boundary:'The module couples displays through a typed transition receipt. It does not assert one numerical clock, vocal physiology, astrophysics, or a common generator.'});
  }

  function mount(doc,win=doc.defaultView||{}){
    const host=doc.getElementById('pulseGrammarClock');if(!host)return null;
    const model=validateModel(win.NEXAH_BREATH_MODEL),svg=doc.getElementById('pulseGrammarClockSvg'),status=doc.getElementById('pulseGrammarClockStatus'),phraseOut=doc.getElementById('pulseGrammarPhrase'),gateOut=doc.getElementById('pulseGrammarGate'),jointOut=doc.getElementById('pulseGrammarJoint'),receiptOut=doc.getElementById('pulseGrammarReceipt'),stepButton=doc.getElementById('pulseGrammarStep'),playButton=doc.getElementById('pulseGrammarPlay'),expandButton=doc.getElementById('pulseGrammarExpand'),captureButton=doc.getElementById('pulseGrammarCapture'),requestButton=doc.getElementById('pulseGrammarRequest'),openButton=doc.getElementById('pulseGrammarOpen'),resetButton=doc.getElementById('pulseGrammarReset'),exportButton=doc.getElementById('pulseGrammarExport');
    const required={svg,status,phraseOut,gateOut,jointOut,receiptOut,stepButton,playButton,expandButton,captureButton,requestButton,openButton,resetButton,exportButton};const missing=Object.entries(required).filter(([,node])=>!node).map(([key])=>key);if(missing.length)throw Error(`Pulse Grammar Clock mount missing: ${missing.join(', ')}`);
    let state=createState(),jointRecord=null,lastCapture=null,timer=null,pulseChannel=typeof win.BroadcastChannel==='function'?new win.BroadcastChannel('nexah-a0-pulse-grammar-clock-v1'):null;
    const adapter=win.A0ThreeDomainJointAdapter,transport=adapter?.createTransport?.(win,{role:'sink',onRecord:record=>{jointRecord=record;render()}})||null;
    function dispatch(record){win.dispatchEvent?.(new win.CustomEvent('a0:pulse-grammar-clock',{detail:record}));pulseChannel?.postMessage(record)}
    function render(){const view=inspect(model,state,jointRecord),record=buildRecord(model,state,jointRecord,lastCapture);host.dataset.mode=view.mode.toLowerCase();host.dataset.transition=String(view.atTransition);svg.innerHTML=svgMarkup(model,state,jointRecord);status.textContent=`P${String(view.pulse).padStart(4,'0')} · ${view.mode} · ${view.atTransition?'PINK DOT / STILL':view.outerToken}`;phraseOut.textContent=`${view.outerIndex+1}/11 · ${view.outerToken} · ${view.outerGroup}`;gateOut.textContent=`${view.innerTick+1}/14 · ${view.innerState}${view.atTransition?' · DWELL 2':''}`;jointOut.textContent=view.jointStatus==='SOURCE_BOUND'?`g${view.jointGeneration} · 3 DOMAINS · READ ONLY`:view.jointStatus;receiptOut.textContent=lastCapture?`${lastCapture.status} · ${lastCapture.pulse}`:'OPEN · STEP TO STILL';captureButton.disabled=!view.atTransition;playButton.textContent=timer?'PAUSE PULSE':'PLAY PULSE';playButton.setAttribute('aria-pressed',String(Boolean(timer)));win.A0PulseGrammarClockView=record;dispatch(record);return record}
    function stepNow(){state=step(model,state);return render()}
    function togglePlay(){if(timer){clearInterval(timer);timer=null}else timer=setInterval(stepNow,700);return render()}
    function expandNow(){state=expand(model,state);lastCapture=null;return render()}
    function captureNow(){lastCapture=capture(model,state,jointRecord);return render()}
    function request(){transport?.request();return render()}
    function openDomains(){const target=win.open?.('A0_GAME_OF_WORLDS_PLAY.html#three-domain-transition-test','a0-three-domain-source');if(target)transport?.attachSource?.(target);return target}
    function clear(){if(timer){clearInterval(timer);timer=null}state=reset();lastCapture=null;return render()}
    function exportRecord(){const blob=new Blob([JSON.stringify(buildRecord(model,state,jointRecord,lastCapture),null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),anchor=doc.createElement('a');anchor.href=url;anchor.download='a0-pulse-grammar-clock-record.json';anchor.click();URL.revokeObjectURL(url)}
    stepButton.addEventListener('click',stepNow);playButton.addEventListener('click',togglePlay);expandButton.addEventListener('click',expandNow);captureButton.addEventListener('click',captureNow);requestButton.addEventListener('click',request);openButton.addEventListener('click',openDomains);resetButton.addEventListener('click',clear);exportButton.addEventListener('click',exportRecord);
    render();return Object.freeze({render,step:stepNow,play:togglePlay,expand:expandNow,capture:captureNow,request,reset:clear,bindJoint(record){jointRecord=record;return render()},get record(){return buildRecord(model,state,jointRecord,lastCapture)}});
  }

  return{VERSION,IDENTITY,SOURCE_MODEL,GROUPS,OUTER,validateModel,innerSequence,createState,inspect,step,expand,reset,capture,svgMarkup,buildRecord,mount};
});
