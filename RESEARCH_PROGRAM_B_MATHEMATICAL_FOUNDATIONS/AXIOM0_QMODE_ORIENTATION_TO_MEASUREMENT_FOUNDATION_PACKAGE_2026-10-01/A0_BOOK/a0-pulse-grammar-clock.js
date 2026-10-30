(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.A0PulseGrammarClock=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const VERSION='1.2.0';
  const IDENTITY='NEXAH_A0_ORIENTATION_CONTROLLER_BENCH';
  const SOURCE_MODEL='NEXAH:CON_DAO_BREATH:V1';
  const CLP_PASCAL_VIEW=Object.freeze({left:'CLP_THREE_DOMAIN_GATE',right:'PASCAL_JOINT',relation:'SOURCE_BOUND_DISPLAY_ANALOGY',sameIdentity:false,newRelation:false});
  const CLP_LOOP=Object.freeze({
    source:'SRC:A0OE:PASCAL_LISSAJOUS_MOBIUS_RETURN',status:'FORMAL_DESIGN_VALIDATION_NOT_ADMITTED_NOT_ACTIVE',
    mnemonic:'COPY–L–PASTE',domainLabelsUnchanged:true,ratio:Object.freeze([5,6]),carrier:'C30',displayLossy:true,
    stages:Object.freeze(['COPY','L','PASTE','RETURN']),tracks:Object.freeze([Object.freeze({id:'A',u:-.8}),Object.freeze({id:'M',u:0}),Object.freeze({id:'B',u:.8})]),
    seamPermutation:Object.freeze({A:'B',M:'M',B:'A'}),oneTurn:'ORIENTATION_REVERSED',exactReturnTurns:2,
    localDisplayOnly:true,sourceMutation:false,feedback:false,newIdentity:false,newRelation:false
  });
  const EXTERNAL_GLB_CANDIDATE=Object.freeze({file:'quantum_grid_galleryIII_v5b_mid.glb',sha256:'327b26ade39d67b10c707fc2493407d768f84d5f5d685f1b047db1d9f92e77e9',status:'FOUND_IN_DESKTOP_ARCHIVE_NOT_NSN_BOUND'});
  const BREATH_PHASES=Object.freeze({AU:Object.freeze({stage:'OPEN',amplitude:.35}),NA:Object.freeze({stage:'EXPAND',amplitude:1}),HE:Object.freeze({stage:'HOLD',amplitude:.65}),TI:Object.freeze({stage:'RETURN',amplitude:0})});
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
    return Object.freeze({mode:'OUTER',outerIndex:0,innerTick:0,pulse:0,transitionCount:0,folded:true,clpArmed:false,clpActive:false,clpIndex:0,clpTurns:0,lastAction:'READY'});
  }

  function inspect(model,state=createState(),jointRecord=null){
    const sequence=innerSequence(model),outer=OUTER[state.outerIndex%OUTER.length],inner=sequence[state.innerTick%sequence.length];
    const jointAccepted=Boolean(jointRecord&&jointRecord.schema==='nexah.a0.three-domain-channel-joint/1'&&jointRecord.status==='SOURCE_BOUND'&&Array.isArray(jointRecord.domains)&&jointRecord.domains.length===3);
    const breath=BREATH_PHASES[outer.token]||Object.freeze({stage:'REST',amplitude:0});
    return Object.freeze({
      identity:IDENTITY,mode:state.mode,outerIndex:state.outerIndex,outerToken:outer.token,outerGroup:outer.group,
      innerTick:state.innerTick,innerTickCount:sequence.length,innerState:inner.stateId,pulse:state.pulse,
      atPhraseGate:outer.group==='CON_DAO',atTransition:state.mode==='INNER'&&inner.stateId==='STILL',
      jointStatus:jointAccepted?'SOURCE_BOUND':jointRecord?'HOLD_INVALID_SOURCE':'HOLD_SOURCE',
      jointGeneration:jointAccepted?jointRecord.generation:null,
      counts:Object.freeze({phrase:Object.freeze([5,2,4]),phraseSlots:11,gate:Object.freeze([6,1,6]),uniqueStates:13,compositeCircumference:24,displayTicks:14,stillDwell:2}),
      fold:Object.freeze({enabled:state.folded,active:state.folded&&outer.group==='AUNAHETI',phrase:'AU–NA–HE–TI',stage:breath.stage,amplitude:breath.amplitude,redRibs:7,purpleFolds:7,displayCount:'7|7',arithmetic77:false}),
      clpPascalView:CLP_PASCAL_VIEW,clpLoop:Object.freeze({armed:state.clpArmed,active:state.clpActive,index:state.clpIndex,stage:CLP_LOOP.stages[state.clpIndex%CLP_LOOP.stages.length],turns:state.clpTurns,contract:CLP_LOOP}),glbCandidate:EXTERNAL_GLB_CANDIDATE,
      equalityClaim:false,sharedNumericalClock:false,sharedPulseGrammar:true
    });
  }

  function step(model,state=createState()){
    const sequence=innerSequence(model);
    if(state.mode==='OUTER'){
      if(state.clpActive&&state.outerIndex>=7){
        const wrap=state.outerIndex===10;
        return Object.freeze({...state,outerIndex:wrap?7:state.outerIndex+1,clpIndex:(state.clpIndex+1)%CLP_LOOP.stages.length,clpTurns:state.clpTurns+(wrap?1:0),pulse:state.pulse+1,lastAction:wrap?'CLP_RETURN':'CLP_BREATH_STEP'});
      }
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

  function toggleFold(state=createState()){
    return Object.freeze({...state,folded:!state.folded,pulse:state.pulse+1,lastAction:state.folded?'FOLD_VIEW_OFF':'FOLD_VIEW_ON'});
  }

  function armClp(state=createState()){
    return Object.freeze({...state,clpArmed:true,lastAction:'CLP_ARMED_WAITING_SOURCE'});
  }

  function activateClp(state=createState()){
    return Object.freeze({...state,mode:'OUTER',outerIndex:7,innerTick:0,folded:true,clpArmed:false,clpActive:true,clpIndex:0,pulse:state.pulse+1,lastAction:'CLP_SOURCE_BOUND'});
  }

  function stopClp(state=createState()){
    return Object.freeze({...state,clpArmed:false,clpActive:false,lastAction:'CLP_STOPPED'});
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
      geometry:Object.freeze({horizontal:'ALGO_WORD_LINE',vertical:'PURPLE_PAIRED_RAIL',relation:'ORTHOGONAL_DISPLAY_VIEW',transition:'PINK_DOT',fold:view.fold,clpPascalView:CLP_PASCAL_VIEW,clpLoop:view.clpLoop}),
      authority:Object.freeze({researchRun:false,scientificEvidence:false,newIdentity:false,newRelation:false,newCarrier:false,newOperator:false,feedback:false}),
      boundary:'The composite circumference is 11 phrase slots + 13 unique gate states = 24. The 14-tick display sequence includes repeated STILL dwell and is not added to 24. AU–NA–HE–TI drives a four-phase display fold only. Seven red ribs and seven purple folds are a 7|7 display count, not the integer 77. COPY–L–PASTE is a local display mnemonic; Chemistry, Life and Physics retain their names and remain frozen read-only source carriers. The 5:6 C30 curve is lossy, and the declared three-track Möbius seam is not intrinsic Pascal topology.'
    });
  }

  function esc(value){return String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]))}

  function points(count,mapper){return Array.from({length:count+1},(_,index)=>mapper(index/count)).map((point,index)=>`${index?'L':'M'}${point[0].toFixed(2)} ${point[1].toFixed(2)}`).join(' ')}

  function mobiusTrackPath(u,cx=450,cy=245){
    return points(120,t=>{const angle=t*Math.PI*4,radius=77+u*19*Math.cos(angle/2);return[cx+radius*Math.cos(angle),cy+radius*.58*Math.sin(angle)]});
  }

  function lissajousPath(cx=450,cy=245){return points(120,t=>{const theta=t*Math.PI*2;return[cx+96*Math.cos(5*theta),cy+60*Math.sin(6*theta)]})}

  function svgMarkup(model,state=createState(),jointRecord=null){
    const view=inspect(model,state,jointRecord),sequence=innerSequence(model),cx=450,cy=245;
    const grid=Array.from({length:17},(_,i)=>`<path d="M${50+i*50} 35V455"/>`).join('')+Array.from({length:9},(_,i)=>`<path d="M50 ${55+i*50}H850"/>`).join('');
    const activeComposite=state.mode==='OUTER'?state.outerIndex:11+sequence[state.innerTick].index;
    const compositeTicks=Array.from({length:24},(_,index)=>{const angle=(-90+index*15)*Math.PI/180,x1=cx+Math.cos(angle)*200,y1=cy+Math.sin(angle)*180,x2=cx+Math.cos(angle)*(index===activeComposite?226:216),y2=cy+Math.sin(angle)*(index===activeComposite?203:194),kind=index<11?'phrase':'gate';return `<path class="pgc-composite-tick ${kind} ${index===activeComposite?'active':''}" d="M${x1.toFixed(2)} ${y1.toFixed(2)}L${x2.toFixed(2)} ${y2.toFixed(2)}"><title>${index<11?`PHRASE ${index+1} · ${OUTER[index].token}`:`GATE ${index-10} · ${model.states[index-11].id}`}</title></path>`}).join('');
    const outerNodes=OUTER.map((item,index)=>{const x=90+index*72,y=430,active=state.mode==='OUTER'&&index===state.outerIndex;return `<g class="pgc-word ${active?'active':''}" data-group="${item.group}"><circle cx="${x}" cy="${y}" r="${active?13:9}" style="--pgc-node:${item.color}"/><text x="${x}" y="${y+29}" text-anchor="middle">${item.token}</text></g>`}).join('');
    const unique=model.states.map((item,index)=>{if(item.id==='STILL')return '';const left=index<6,x=left?305:595,rank=left?index:12-index,y=95+rank*48,active=state.mode==='INNER'&&sequence[state.innerTick].stateId===item.id;return `<g class="pgc-gate-node ${active?'active':''}"><circle cx="${x}" cy="${y}" r="${active?11:7}"/><text x="${left?x-16:x+16}" y="${y+4}" text-anchor="${left?'end':'start'}">${item.id}</text></g>`}).join('');
    const teeth=Array.from({length:6},(_,i)=>{const y=118+i*47;return `<path class="pgc-tooth" d="M365 ${y}L430 ${y+25}M535 ${y}L470 ${y+25}"/>`}).join('');
    const spread=24+view.fold.amplitude*38;
    const ribs=Array.from({length:7},(_,i)=>{const y=105+i*43,dy=(i-3)*3,left=450-spread-i*7,right=450+spread+i*7;return `<path class="pgc-rib red" d="M450 ${245+dy}Q${left} ${y} ${330-i*4} ${y}"/><path class="pgc-rib purple" d="M450 ${245+dy}Q${right} ${y} ${570+i*4} ${y}"/>`}).join('');
    const foldFan=Array.from({length:7},(_,i)=>{const angle=(-66+i*22)*Math.PI/180,x=(450+Math.cos(angle)*(92+view.fold.amplitude*42)).toFixed(2),y=(245+Math.sin(angle)*(92+view.fold.amplitude*42)).toFixed(2);return `<path class="pgc-fold-ray ${i%2?'purple':'red'}" d="M450 245L${x} ${y}"/>`}).join('');
    const joint=jointRecord&&view.jointStatus==='SOURCE_BOUND'?jointRecord:null;
    const ports=['CHEMISTRY','LIFE','PHYSICS'].map((label,index)=>{const x=702+index*58,y=92,domain=joint?.domains?.[index],bars=domain?['c00','c01','c10','c11'].map((key,j)=>`<rect x="${x-20+j*10}" y="${y+18-domain.normalized[key]*30}" width="7" height="${Math.max(2,domain.normalized[key]*30)}"/>`).join(''):'';return `<g class="pgc-domain ${joint?'bound':'hold'}"><title>${label}</title><circle cx="${x}" cy="${y}" r="15"/><text x="${x}" y="${y-25}" text-anchor="middle">${label[0]}</text>${bars}</g>`}).join('');
    const clpTracks=CLP_LOOP.tracks.map(track=>`<path class="pgc-mobius-track track-${track.id.toLowerCase()}" d="${mobiusTrackPath(track.u)}"><title>${track.id} · u=${track.u} · one turn ${CLP_LOOP.seamPermutation[track.id]} · exact return 4π</title></path>`).join('');
    const clpOverlay=view.clpLoop.active?`<g class="pgc-clp-loop active"><path class="pgc-lissajous" d="${lissajousPath()}"/>${clpTracks}<circle class="pgc-clp-sample" cx="${(cx+96*Math.cos(5*(state.clpIndex/4)*Math.PI*2)).toFixed(2)}" cy="${(cy+60*Math.sin(6*(state.clpIndex/4)*Math.PI*2)).toFixed(2)}" r="6"/><text class="pgc-clp-stage" x="450" y="338" text-anchor="middle">${view.clpLoop.stage} · 5:6 / C30 · A↔B · M FIXED · RETURN 4π</text></g>`:`<g class="pgc-clp-loop hold">${clpTracks}<text class="pgc-clp-stage" x="450" y="338" text-anchor="middle">CLP LOOP · ${view.clpLoop.armed?'ARMED / WAITING SOURCE':'HOLD SOURCE'}</text></g>`;
    return `<g class="pgc-grid">${grid}</g><ellipse class="pgc-composite-ring" cx="${cx}" cy="${cy}" rx="200" ry="180"/>${compositeTicks}<path class="pgc-algo-line" d="M65 ${cy}H835"/><text class="pgc-axis-label" x="75" y="${cy-12}">ALGO / WORD LINE · 90°</text><g class="pgc-ribcage ${view.fold.enabled?'enabled':'disabled'} ${view.fold.active?'breathing':''}">${ribs}${foldFan}<text class="pgc-fold-label" x="450" y="72" text-anchor="middle">AU–NA–HE–TI FOLD · ${view.fold.stage} · 7|7 DISPLAY</text></g><path class="pgc-purple-rail" d="M395 60V405M505 60V405"/><path class="pgc-purple-coil" d="M395 70C520 130 520 190 395 245C270 300 270 360 395 405M505 70C380 130 380 190 505 245C630 300 630 360 505 405"/>${teeth}<path class="pgc-clp-pascal" d="M450 245L702 92H818Z"/><text class="pgc-clp-label" x="742" y="132" text-anchor="middle">CLP GATE ↔ PASCAL JOINT VIEW</text><path class="pgc-joint-pipe" d="M450 245C545 192 620 132 702 92M450 245C560 210 666 130 760 92M450 245C575 230 708 128 818 92"/>${clpOverlay}${ports}<circle class="pgc-transition ${view.atTransition?'active':''}" cx="${cx}" cy="${cy}" r="17"/><circle class="pgc-transition-core" cx="${cx}" cy="${cy}" r="5"/><text class="pgc-transition-label" x="${cx}" y="${cy-28}" text-anchor="middle">${view.atTransition?'STILL · TRANSITION':'PINK DOT · GATE'}</text><g class="pgc-still ${view.atTransition?'active':''}"><circle cx="450" cy="245" r="31"/><text x="450" y="250" text-anchor="middle">STILL</text></g>${unique}<path class="pgc-v-rail" d="M305 95L450 245L595 95"/>${outerNodes}<text class="pgc-count" x="450" y="482" text-anchor="middle">11 PHRASE SLOTS + 13 UNIQUE GATE STATES = 24 COMPOSITE</text><text class="pgc-count pgc-count-minor" x="450" y="505" text-anchor="middle">7 RED RIBS | 7 PURPLE FOLDS · 7|7 VIEW, NOT INTEGER 77</text>`;
  }

  function buildRecord(model,state=createState(),jointRecord=null,lastCapture=null){
    return Object.freeze({schema:'nexah.a0.pulse-grammar-clock-view/1',version:VERSION,identity:IDENTITY,classification:'SOURCE_BOUND_REPRESENTATION',sourceModel:SOURCE_MODEL,view:inspect(model,state,jointRecord),phrase:Object.freeze(GROUPS.map(group=>({id:group.id,label:group.label,tokens:[...group.tokens]}))),transition:copy(lastCapture),joint:jointRecord?copy(jointRecord):null,clpPascalView:CLP_PASCAL_VIEW,clpLoop:CLP_LOOP,glbCandidate:EXTERNAL_GLB_CANDIDATE,authority:{researchRun:false,scientificEvidence:false,newIdentity:false,newRelation:false,newCarrier:false,newOperator:false,feedback:false},boundary:'The module couples displays through a typed transition receipt. COPY–L–PASTE is a local display mnemonic and does not rename Chemistry, Life or Physics. The three-domain record remains frozen and read-only. The 5:6 C30 projection is lossy; the three Möbius tracks use a declared seam and do not establish intrinsic Pascal topology. CLP and Pascal Joint are compared as perspectives, not identified. AU–NA–HE–TI drives a display fold; 7|7 is not the integer 77. The external GLB candidate remains archive-found and unbound to NSN. No numerical clock, physiology, astrophysics or common generator is asserted.'});
  }

  function mount(doc,win=doc.defaultView||{}){
    const host=doc.getElementById('pulseGrammarClock');if(!host)return null;
    const model=validateModel(win.NEXAH_BREATH_MODEL),svg=doc.getElementById('pulseGrammarClockSvg'),status=doc.getElementById('pulseGrammarClockStatus'),phraseOut=doc.getElementById('pulseGrammarPhrase'),gateOut=doc.getElementById('pulseGrammarGate'),jointOut=doc.getElementById('pulseGrammarJoint'),receiptOut=doc.getElementById('pulseGrammarReceipt'),foldOut=doc.getElementById('pulseGrammarFold'),crosswalkOut=doc.getElementById('pulseGrammarCrosswalk'),stepButton=doc.getElementById('pulseGrammarStep'),playButton=doc.getElementById('pulseGrammarPlay'),expandButton=doc.getElementById('pulseGrammarExpand'),foldButton=doc.getElementById('pulseGrammarFoldToggle'),captureButton=doc.getElementById('pulseGrammarCapture'),requestButton=doc.getElementById('pulseGrammarRequest'),openButton=doc.getElementById('pulseGrammarOpen'),resetButton=doc.getElementById('pulseGrammarReset'),exportButton=doc.getElementById('pulseGrammarExport');
    const required={svg,status,phraseOut,gateOut,jointOut,receiptOut,foldOut,crosswalkOut,stepButton,playButton,expandButton,foldButton,captureButton,requestButton,openButton,resetButton,exportButton};const missing=Object.entries(required).filter(([,node])=>!node).map(([key])=>key);if(missing.length)throw Error(`Pulse Grammar Clock mount missing: ${missing.join(', ')}`);
    let state=createState(),jointRecord=null,lastCapture=null,timer=null,pulseChannel=typeof win.BroadcastChannel==='function'?new win.BroadcastChannel('nexah-a0-pulse-grammar-clock-v1'):null;
    const adapter=win.A0ThreeDomainJointAdapter,transport=adapter?.createTransport?.(win,{role:'sink',onRecord:record=>{jointRecord=record;if(state.clpArmed){state=activateClp(state);if(!timer)timer=setInterval(stepNow,700)}render()}})||null;
    function dispatch(record){win.dispatchEvent?.(new win.CustomEvent('a0:pulse-grammar-clock',{detail:record}));pulseChannel?.postMessage(record)}
    function render(){const view=inspect(model,state,jointRecord),record=buildRecord(model,state,jointRecord,lastCapture);host.dataset.mode=view.mode.toLowerCase();host.dataset.transition=String(view.atTransition);host.dataset.fold=String(view.fold.enabled);host.dataset.clp=String(view.clpLoop.active);svg.innerHTML=svgMarkup(model,state,jointRecord);status.textContent=`P${String(view.pulse).padStart(4,'0')} · ${view.clpLoop.active?`CLP ${view.clpLoop.stage}`:view.mode} · ${view.atTransition?'PINK DOT / STILL':view.outerToken}`;phraseOut.textContent=`${view.outerIndex+1}/11 · ${view.outerToken} · ${view.outerGroup}`;gateOut.textContent=`${view.innerTick+1}/14 · ${view.innerState}${view.atTransition?' · DWELL 2':''}`;jointOut.textContent=view.jointStatus==='SOURCE_BOUND'?`g${view.jointGeneration} · 3 DOMAINS · READ ONLY`:view.jointStatus;receiptOut.textContent=lastCapture?`${lastCapture.status} · ${lastCapture.pulse}`:'OPEN · STEP TO STILL';foldOut.textContent=`${view.fold.stage} · ${view.fold.displayCount} · ${view.fold.active?'FULL BREATH DISPLAY':'HOLD'}`;crosswalkOut.textContent=view.clpLoop.active?`${view.clpLoop.stage} · 5:6/C30 · TURN ${view.clpLoop.turns} · A↔B / M FIXED`:view.clpLoop.armed?'CLP ARMED · WAITING SOURCE':'CLP ↔ PASCAL · VIEW ONLY · GLB HOLD';captureButton.disabled=!view.atTransition;playButton.textContent=timer?'PAUSE PULSE':'PLAY PULSE';playButton.setAttribute('aria-pressed',String(Boolean(timer)));foldButton.textContent=view.fold.enabled?'HIDE 7|7 FOLD':'SHOW 7|7 FOLD';foldButton.setAttribute('aria-pressed',String(view.fold.enabled));requestButton.textContent=view.clpLoop.active?'CLP LOOP ACTIVE':view.clpLoop.armed?'CLP ARMED · REQUEST AGAIN':'REQUEST + RUN CLP';requestButton.setAttribute('aria-pressed',String(view.clpLoop.active));win.A0PulseGrammarClockView=record;dispatch(record);return record}
    function stepNow(){state=step(model,state);return render()}
    function togglePlay(){if(timer){clearInterval(timer);timer=null}else timer=setInterval(stepNow,700);return render()}
    function expandNow(){state=expand(model,state);lastCapture=null;return render()}
    function foldNow(){state=toggleFold(state);return render()}
    function captureNow(){lastCapture=capture(model,state,jointRecord);return render()}
    function request(){state=armClp(state);if(jointRecord){state=activateClp(state);if(!timer)timer=setInterval(stepNow,700)}else transport?.request();return render()}
    function openDomains(){const target=win.open?.('A0_GAME_OF_WORLDS_PLAY.html#three-domain-transition-test','a0-three-domain-source');if(target)transport?.attachSource?.(target);return target}
    function clear(){if(timer){clearInterval(timer);timer=null}state=reset();lastCapture=null;return render()}
    function exportRecord(){const blob=new Blob([JSON.stringify(buildRecord(model,state,jointRecord,lastCapture),null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),anchor=doc.createElement('a');anchor.href=url;anchor.download='a0-pulse-grammar-clock-record.json';anchor.click();URL.revokeObjectURL(url)}
    stepButton.addEventListener('click',stepNow);playButton.addEventListener('click',togglePlay);expandButton.addEventListener('click',expandNow);foldButton.addEventListener('click',foldNow);captureButton.addEventListener('click',captureNow);requestButton.addEventListener('click',request);openButton.addEventListener('click',openDomains);resetButton.addEventListener('click',clear);exportButton.addEventListener('click',exportRecord);
    render();return Object.freeze({render,step:stepNow,play:togglePlay,expand:expandNow,fold:foldNow,capture:captureNow,request,reset:clear,bindJoint(record){jointRecord=record;if(state.clpArmed)state=activateClp(state);return render()},stopClp(){state=stopClp(state);return render()},get record(){return buildRecord(model,state,jointRecord,lastCapture)}});
  }

  return{VERSION,IDENTITY,SOURCE_MODEL,CLP_PASCAL_VIEW,CLP_LOOP,EXTERNAL_GLB_CANDIDATE,BREATH_PHASES,GROUPS,OUTER,validateModel,innerSequence,createState,inspect,step,expand,toggleFold,armClp,activateClp,stopClp,reset,capture,mobiusTrackPath,lissajousPath,svgMarkup,buildRecord,mount};
});
