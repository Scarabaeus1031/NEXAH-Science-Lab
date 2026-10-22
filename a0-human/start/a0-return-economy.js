(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.A0ReturnEconomy=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const VERSION='1.0.0';
  const PHASES=Object.freeze([
    Object.freeze({id:'source',label:'01 SOURCE',title:'Drei getrennte Quellen',copy:'Jede Lane beginnt bei ihrem eigenen Carrier. Gleiche Bedienung bedeutet keine gemeinsame Identität.'}),
    Object.freeze({id:'view',label:'02 VIEW',title:'Die View ist kleiner als die Quelle',copy:'Q106 fällt auf 16 Zustände, die Seam auf 106 Adressen und jede Dezimalprojektion vergisst eine Ziffer.'}),
    Object.freeze({id:'residual',label:'03 RESIDUAL',title:'Fehlende Information wird sichtbar',copy:'Faserposition, typisiertes Seam-Bit oder zweite Dezimalansicht tragen genau das, was die erste View nicht mehr weiß.'}),
    Object.freeze({id:'return',label:'04 RETURN',title:'Alle drei kehren exakt zurück',copy:'Quelle und rekonstruierter Zustand stimmen in 106/106, 140/140 und 9000/9000 Fällen überein.'}),
    Object.freeze({id:'control',label:'05 CONTROL',title:'Kontrollen verhindern den Kurzschluss',copy:'Shuffle, ungültiger Glue und Swap zeigen, dass exakter Return weder kanonische Zuordnung noch allgemeinen Vorteil beweist.'}),
    Object.freeze({id:'compare',label:'06 COMPARE',title:'Dreimal Return. Nur einmal Economy.',copy:'Der Typed Seam spart 0.464286 Bit im Mittel. Q106/O16 und Decimal D4 bleiben auf ihrer Raw-Baseline.'})
  ]);

  const METRICS=Object.freeze({
    q106:Object.freeze({sourceCount:106,addressCount:16,collisions:90,exactReturn:106,rawBits:7,recordBits:7,saving:0,advantage:false}),
    seam:Object.freeze({sourceCount:140,addressCount:106,collisions:34,exactReturn:140,rawBits:8,recordBits:7.535714,saving:.464286,advantage:true}),
    decimal:Object.freeze({sourceCount:9000,addressCount:9000,collisions:8000,exactReturn:9000,rawBits:14,recordBits:14,saving:0,advantage:false})
  });

  const tupleKey=tuple=>tuple.join(':');
  function buildSeamIndex(){
    const raw=[];for(let face=0;face<5;face++)for(let level=0;level<=6;level++)for(let slot=0;slot<=level;slot++)raw.push([face,level,slot]);
    const parent=raw.map((_,index)=>index),lookup=new Map(raw.map((tuple,index)=>[tupleKey(tuple),index]));
    const find=index=>{while(parent[index]!==index){parent[index]=parent[parent[index]];index=parent[index]}return index};
    const union=(a,b)=>{const ra=find(a),rb=find(b);if(ra!==rb)parent[rb]=ra};
    for(let face=1;face<5;face++)union(lookup.get('0:0:0'),lookup.get(`${face}:0:0`));
    for(let face=0;face<5;face++)for(let level=1;level<=6;level++)union(lookup.get(`${face}:${level}:${level}`),lookup.get(`${(face+1)%5}:${level}:0`));
    const grouped=new Map();raw.forEach((tuple,index)=>{const root=find(index);if(!grouped.has(root))grouped.set(root,[]);grouped.get(root).push({tuple,index})});
    const classes=[...grouped.values()].sort((a,b)=>a[0].index-b[0].index),byRaw=new Map();
    classes.forEach((members,address)=>members.forEach((member,residual)=>byRaw.set(member.index,{address,residual,size:members.length,tuple:member.tuple,members:members.map(item=>item.tuple)})));
    return Object.freeze({raw:Object.freeze(raw.map(Object.freeze)),classes:Object.freeze(classes.map(members=>Object.freeze(members.map(item=>Object.freeze(item.tuple))))),byRaw});
  }
  const SEAM=buildSeamIndex();

  const clamp=(value,min,max)=>Math.max(min,Math.min(max,Number(value)));
  const bits=size=>size<=1?0:Math.ceil(Math.log2(size));
  const pad=(value,width)=>String(value).padStart(width,'0');

  function q106Record(source){
    source=Math.trunc(clamp(source,0,105));const view=source%16,residual=Math.floor(source/16),returned=view+16*residual;
    return Object.freeze({id:'q106',source,label:`Q${pad(source,3)}`,view:`O16:${pad(view,2)}`,lost:`${METRICS.q106.collisions} collisions · fibre 6/7`,residual:`rank ${residual} · 3 bit`,returned,returnLabel:`Q${pad(returned,3)}`,exact:returned===source,selectedBits:7,control:'MATCHED SHUFFLE · same 7 bit · 100 assignments differ'});
  }

  function seamRecord(source){
    source=Math.trunc(clamp(source,0,139));const entry=SEAM.byRaw.get(source),returned=SEAM.raw.findIndex(tuple=>tupleKey(tuple)===tupleKey(entry.members[entry.residual]));
    return Object.freeze({id:'seam',source,label:`I${pad(source,3)} · (${entry.tuple.join(',')})`,view:`S${pad(entry.address,3)}`,lost:`${METRICS.seam.collisions} merges · class ${entry.size}`,residual:entry.size===1?'typed residual ∅':`member ${entry.residual}/${entry.size-1} · ${bits(entry.size)} bit`,returned,returnLabel:`I${pad(returned,3)}`,exact:returned===source,selectedBits:7+bits(entry.size),control:'INVALID GLUE · 30 mixed levels · 106/140 return'});
  }

  function decimalRecord(source){
    source=Math.trunc(clamp(source,1000,9999));const digits=String(source).split(''),first=digits.slice(1).join(''),second=[digits[0],digits[2],digits[3]].join(''),returned=Number(second[0]+first);
    return Object.freeze({id:'decimal',source,label:String(source),view:`δ₁ ${first}`,secondView:`δ₂ ${second}`,lost:'δ₁ fibre 9 · δ₂ fibre 10',residual:`joint view (${first}, ${second})`,returned,returnLabel:String(returned),exact:returned===source,selectedBits:14,control:'MIDDLE SWAP · bijective · no compression'});
  }

  function record(id,source){if(id==='q106')return q106Record(source);if(id==='seam')return seamRecord(source);if(id==='decimal')return decimalRecord(source);throw Error(`unknown return-economy lane: ${id}`)}
  function createState(overrides={}){return Object.assign({running:false,phase:0,samples:{q106:37,seam:73,decimal:1737},cycles:0},overrides)}
  function advance(state){const next=(state.phase+1)%PHASES.length,wrapped=next===0;return{...state,phase:next,cycles:state.cycles+(wrapped?1:0),samples:wrapped?{q106:(state.samples.q106+17)%106,seam:(state.samples.seam+13)%140,decimal:1000+((state.samples.decimal-1000+137)%9000)}:{...state.samples}}}
  function snapshot(state){return Object.freeze({version:VERSION,phase:PHASES[state.phase],lanes:Object.freeze({q106:q106Record(state.samples.q106),seam:seamRecord(state.samples.seam),decimal:decimalRecord(state.samples.decimal)}),metrics:METRICS,summary:Object.freeze({exactReturnCarriers:3,economyCarriers:1,requiredEconomyCarriers:2,classification:'MIXED_RETURN_GRAMMAR_PASS_ECONOMY_GENERALIZATION_FAIL'}),authority:Object.freeze({researchRun:false,newCarrier:false,carrierIdentity:false,universalCompression:false,publication:false})})}

  function mount(doc,win=doc.defaultView||{}){
    const root=doc.getElementById('returnEconomyDemonstrator');if(!root)throw Error('return economy root missing');
    const $=selector=>root.querySelector(selector),all=selector=>[...root.querySelectorAll(selector)],play=$('#returnEconomyPlay'),step=$('#returnEconomyStep'),reset=$('#returnEconomyReset'),status=$('#returnEconomyStatus'),phaseTitle=$('#returnEconomyPhaseTitle'),phaseCopy=$('#returnEconomyPhaseCopy');
    if(!play||!step||!reset||!status||!phaseTitle||!phaseCopy)throw Error('return economy controls missing');
    let state=createState(),timer=0;const reduced=()=>Boolean(win.matchMedia?.('(prefers-reduced-motion: reduce)').matches);const delay=()=>reduced()?4200:1900;
    function clear(){if(timer)win.clearTimeout(timer);timer=0}
    function lane(id){return root.querySelector(`[data-return-lane="${id}"]`)}
    function setText(node,role,value){const target=node.querySelector(`[data-return-${role}]`);if(target)target.textContent=value}
    function render(){
      const snap=snapshot(state),phase=snap.phase;root.dataset.phase=phase.id;root.dataset.running=String(state.running);status.textContent=state.running?'PLAYING':state.phase===PHASES.length-1?'RESULT':'READY';play.textContent=state.running?'Ⅱ PAUSE':'▶ PLAY ALL';play.setAttribute('aria-pressed',String(state.running));phaseTitle.textContent=phase.title;phaseCopy.textContent=phase.copy;
      all('[data-return-phase]').forEach((button,index)=>{button.classList.toggle('active',index===state.phase);button.setAttribute('aria-current',index===state.phase?'step':'false')});
      Object.entries(snap.lanes).forEach(([id,data])=>{const node=lane(id),metric=METRICS[id];node.dataset.advantage=String(metric.advantage);setText(node,'source',data.label);setText(node,'view',data.view);setText(node,'lost',data.lost);setText(node,'residual',data.residual);setText(node,'returned',data.returnLabel);setText(node,'control',data.control);setText(node,'selected-bits',`${data.selectedBits.toFixed(data.selectedBits%1?0:0)} bit sample`);const input=node.querySelector('input[type="range"]');if(input&&Number(input.value)!==data.source)input.value=String(data.source);const returnNode=node.querySelector('[data-return-returned]');if(returnNode)returnNode.dataset.exact=String(data.exact)});
    }
    function schedule(){clear();if(!state.running)return;timer=win.setTimeout(()=>{state=advance(state);render();schedule()},delay())}
    function start(){state={...state,running:true};render();schedule();return snapshot(state)}
    function pause(){clear();state={...state,running:false};render();return snapshot(state)}
    function next(){clear();state=advance({...state,running:false});render();return snapshot(state)}
    function setPhase(index){clear();state={...state,running:false,phase:Math.trunc(clamp(index,0,PHASES.length-1))};render();return snapshot(state)}
    function resetState(){clear();state=createState();render();return snapshot(state)}
    play.addEventListener('click',()=>state.running?pause():start());step.addEventListener('click',next);reset.addEventListener('click',resetState);
    all('[data-return-phase]').forEach((button,index)=>button.addEventListener('click',()=>setPhase(index)));
    all('[data-return-lane] input[type="range"]').forEach(input=>input.addEventListener('input',()=>{clear();const id=input.closest('[data-return-lane]').dataset.returnLane;state={...state,running:false,samples:{...state.samples,[id]:Number(input.value)}};render()}));
    render();return Object.freeze({start,pause,step:next,reset:resetState,setPhase,get state(){return createState({...state,samples:{...state.samples}})},snapshot:()=>snapshot(state)});
  }

  return{VERSION,PHASES,METRICS,SEAM,q106Record,seamRecord,decimalRecord,record,createState,advance,snapshot,mount};
});
