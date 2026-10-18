(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.A0FamilyGridCoupler=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const VERSION='1.1.0',SIZE=11,TAU=Math.PI*2;
  const VIEWS=Object.freeze([
    {id:'life',label:'LIFE GRID',role:'source cells · event state',glb:'crystal'},
    {id:'plate',label:'PLATTE',role:'finite dead field · flat reading',glb:'temporal-z'},
    {id:'cylinder',label:'ZYLINDER',role:'wrapped q → θ · generation → Z',glb:'temporal-z'}
  ]);
  const FLAVORS=Object.freeze([
    {id:'pi',label:'π',name:'Kreis / Phase'},{id:'phi',label:'φ',name:'Proportion / Lens'},
    {id:'root2',label:'√2',name:'Diagonal / Metric'},{id:'e',label:'e',name:'Wachstum / Eulerzahl'},
    {id:'fib',label:'FIB',name:'Folge / Nachbarschaft'}
  ]);
  const HANDLES=Object.freeze([
    {id:'riemann',label:'RIEMANN',role:'spectral reading'},{id:'ramanujan',label:'RAMANUJAN',role:'arithmetic pattern'},
    {id:'euler',label:'EULER',role:'graph / traversal'},{id:'gauss',label:'GAUSS',role:'angle / handle'}
  ]);
  const GLB_CHANNELS=Object.freeze([
    {id:'crystal',label:'GLB 01 · LIFE//CRYSTAL',role:'4+1 transition observatory · five synchronized rooms'},
    {id:'temporal-z',label:'GLB 02 · TEMPORAL Z',role:'wrapped address → θ · generation → world Z'}
  ]);
  const mod=(n,m)=>((Number(n)%m)+m)%m;
  function qAngle(index,size=SIZE){const q=mod(index,size);return{q,size,degrees:360*q/size,radians:TAU*q/size,exactRadians:q===0?'0':`${2*q}π/${size}`,exactDegrees:`${360*q}/${size}°`}}
  function decomposeEleven(mode='5+2x3'){return mode==='5+3x2'?{mode,head:5,groups:3,width:2,total:11,label:'5 + 3×2 = 11'}:{mode:'5+2x3',head:5,groups:2,width:3,total:11,label:'5 + 2×3 = 11'}}
  function glbChannelForView(view){return view==='life'?'crystal':'temporal-z'}
  function cubicIharaFork(branch='c'){const chosen=branch==='d'?'d':'c';return{incoming:'a→b',degree:3,allowed:['b→c','b→d'],blocked:'b→a',chosen:`b→${chosen}`,allowedCount:2,blockedCount:1,sourceGraph:'generalized Petersen G(10,2)',directedEdgeStates:60}}
  function normalizeBenchState(input={}){
    const address=Array.from({length:5},(_,i)=>Number(input.address?.[i]||0));
    const history=Array.isArray(input.history)?input.history:[];
    return{carrierId:String(input.carrierId||'A0.CRT.CHANNEL/5x73'),familyRole:String(input.familyRole||'F3'),address,position:Number(input.position??.25),orientation:Number(input.orientation||0),scale:Number(input.scale??1),side:String(input.side||'INSIDE'),iotaTick:Number(input.iotaTick||0),iotaDrift:Number(input.iotaDrift||0),historyLength:history.length,lastOperator:String(history.at?.(-1)?.operatorId||history[history.length-1]?.operatorId||'∅')}
  }
  function projectBenchState(input={}){
    const bench=normalizeBenchState(input),weights=[2,3,5,7,11];
    const signed=bench.address.reduce((sum,value,index)=>sum+value*weights[index],0);
    const sector=Math.round(bench.orientation/72),seed=mod(signed+sector+bench.historyLength+bench.iotaDrift,97);
    const bits=Array.from({length:SIZE},(_,q)=>mod(seed+q*(q+1)+bench.address[q%5]*(q+3)+sector,2));
    const tick=mod(seed+bench.iotaTick+bench.historyLength,SIZE);
    return{bench,bits,tick,projection:`P11(${bench.address.join(',')}; θ=${bench.orientation}; h=${bench.historyLength})`,invertible:false}
  }
  function createState(overrides={}){return Object.assign({running:false,tick:0,view:'life',flavor:'pi',handle:'euler',glbChannel:'crystal',decomposition:'5+2x3',bits:[1,0,1,0,1,1,0,1,0,0,1],ghost:-1,iharaBranch:'c',focus:'all',bench:normalizeBenchState(),bound:false,projection:'LOCAL FIXTURE'},overrides)}
  function step(input){const state=createState(input),next=mod(state.tick+1,SIZE);state.ghost=state.tick;state.tick=next;return state}
  function mount(doc,win=doc.defaultView||{}){
    const root=doc.querySelector('[data-family-grid-coupler]');if(!root)throw Error('family grid coupler root missing');
    let state=createState(),timer=0;
    const familyRole=()=>state.bench?.familyRole||doc.getElementById('familyRole')?.value||'F3';
    const angle=()=>qAngle(state.tick),decomp=()=>decomposeEleven(state.decomposition);
    function cellStyle(view,i){const a=TAU*i/SIZE;if(view==='cylinder')return`--x:${50+39*Math.sin(a)}%;--y:${51+31*Math.cos(a)}%`;if(view==='plate')return`--x:${8+(i%6)*17}%;--y:${i<6?28:72}%`;return`--x:${10+(i%4)*27}%;--y:${18+Math.floor(i/4)*34}%`}
    function cells(view){return state.bits.map((bit,i)=>`<i class="fgc-cell ${bit?'one':'zero'} ${i===state.tick?'pulse':''} ${i===state.ghost?'ghost':''}" data-cell="${i}" style="${cellStyle(view,i)}"><b>${bit}</b><small>q${i}</small></i>`).join('')}
    function windowMarkup(view){const channel=GLB_CHANNELS.find(item=>item.id===view.glb);return`<details class="fgc-window ${state.focus===view.id?'focused':''}" data-window="${view.id}" ${state.focus==='all'||state.focus===view.id?'open':''}><summary><span><b>${view.label}</b><small>${view.role}</small></span><em>${channel.label}</em></summary><div class="fgc-stage" aria-label="${view.label} eleven state view"><div class="fgc-axis"></div>${cells(view.id)}<div class="fgc-center"><b>${view.label}</b><span>q${state.tick} · ${state.running?'LIVE':'READY'}</span></div></div><footer><button data-focus="${view.id}">${state.focus===view.id?'ALLE 3 FENSTER':'VERGRÖSSERN'}</button><span>${view.glb==='crystal'?'FIVE ROOMS · +1 CONTROL':'TEMPORAL-Z · SAME VIEW TICK'}</span></footer></details>`}
    function operatorButton(id,label,copy){return`<button data-operator="${id}"><b>${label}</b><small>${copy}</small></button>`}
    function render(){
      const a=angle(),d=decomp(),bench=state.bench||normalizeBenchState();root.dataset.running=String(state.running);root.dataset.bound=String(state.bound);
      root.innerHTML=`<div class="fgc-head"><div><small>GAME4LIFE+1 · PRIME / OPERATOR / VIEW BINDER</small><h2>5A · Graph Address → Operator Chain → drei Fenster +1</h2><p>Ein Bench-State speist drei gleichzeitig lesbare Ansichten. Cyan ist der aktuelle, Pink der vorherige View-Tick.</p></div><output>${state.running?'LIVE':'READY'} · ${state.bound?'BENCH BOUND':'LOCAL'} · ${familyRole()}</output></div>
      <div class="fgc-source-sides"><a href="A0_TESSAREC_BLUE_BODY_LAB.html"><small>SOURCE SIDE A</small><b>BLUE BODY</b><span>Q4×P3 · 48 adressierte Body-States</span></a><i>typed handoff · no identity merge</i><a href="A0_BLUE_PINK_DODECA_CELL_RETURN.html#cell-machine"><small>SOURCE SIDE B</small><b>DODECA</b><span>4×12 Body-Zellen + 12 Return-Flächen</span></a></div>
      <div class="fgc-717" aria-label="Local seven one seven reading"><span><b>F7</b><small>SOURCE / VALIDATION</small></span><i>→</i><span class="controller"><b>F1 · +1</b><small>VIEW CONTROLLER</small></span><i>→</i><span><b>F7</b><small>RETURN / CHECK</small></span><em>lokale 7–1–7 Lesespur · keine kanonische Family-Kante</em></div>
      <div class="fgc-toolbar"><button data-action="play" class="primary">${state.running?'Ⅱ PAUSE':'▶ PLAY ALL 3 +1'}</button><button data-action="step">+1 SHARED TICK</button><button data-action="reset">RESET VIEW</button><span class="fgc-decomp">${d.label}</span><button data-decomp="5+2x3" class="${state.decomposition==='5+2x3'?'active':''}">5 + 2×3</button><button data-decomp="5+3x2" class="${state.decomposition==='5+3x2'?'active':''}">5 + 3×2</button></div>
      <div class="fgc-windows">${VIEWS.map(windowMarkup).join('')}</div>
      <section class="fgc-plus-one"><div><small>+1 CONTROLLER · SAME VIEW CLOCK</small><h3>Vier Lesekanäle behalten einen gemeinsamen Kontext.</h3><div class="fgc-four-plus-one"><span>FIELD</span><span>EVENT</span><span>BOUNDARY</span><span>HISTORY</span><b>+1 CONTROL</b></div><code>${state.projection}</code></div><dl><div><dt>PRIME ADDRESS</dt><dd>[${bench.address.join(', ')}]</dd></div><div><dt>OPERATOR</dt><dd>${bench.lastOperator} · ${bench.historyLength} committed</dd></div><div><dt>ORIENTATION</dt><dd>${bench.orientation.toFixed(0)}° · ${bench.iotaTick}/365</dd></div><div><dt>Q° / RAD</dt><dd>q${a.q} · ${a.degrees.toFixed(3)}° · ${a.radians.toFixed(6)} rad</dd></div></dl><div class="fgc-operator-chain">${operatorButton('J','J','Janus mirror')}${operatorButton('R','Rθ','+72° / +73 ticks')}${operatorButton('E','Eₛ','active elevator factor')}</div></section>
      <div class="fgc-glbs">${GLB_CHANNELS.map(x=>`<button data-glb="${x.id}" class="${state.glbChannel===x.id?'active':''}"><b>${x.label}</b><small>${x.role}</small></button>`).join('')}</div>
      <details class="fgc-more"><summary>VERGLEICHSLINSEN & QUELLENROLLEN</summary><div class="fgc-flavors">${FLAVORS.map(x=>`<button data-flavor="${x.id}" class="${state.flavor===x.id?'active':''}"><b>${x.label}</b><small>${x.name}</small></button>`).join('')}</div><div class="fgc-handles">${HANDLES.map(x=>`<button data-handle="${x.id}" class="${state.handle===x.id?'active':''}"><b>${x.label}</b><small>${x.role}</small></button>`).join('')}</div></details>
      <div class="fgc-ledger"><span>ACTIVE ${state.tick}</span><span>GHOST ${state.ghost<0?'—':state.ghost}</span><span>ONES ${state.bits.filter(Boolean).length}/11</span><span>ADDRESS ${bench.address.join(':')}</span><span>CHAIN ${bench.lastOperator}</span><span>GLB ${state.glbChannel.toUpperCase()}</span></div>
      <p class="fgc-boundary"><b>BOUNDARY:</b> Die 11er-Anzeige ist eine deterministische, nicht invertierbare Engineering-Projektion des bestehenden Prime-/Operator-Records. <code>+1</code> ist der gemeinsame View-Controller, kein zusätzlicher Carrier. 7–1–7 ist eine lokale Lesespur, keine neue kanonische Family-Relation. <a href="A0_GAME_4_LIFE_PLUS_1.html">Game4Life+1-Quelle ↗</a> · <a href="A0_FAMILY_CONNECTION_ATLAS.html">Family Atlas ↗</a></p>`;
      root.querySelector('[data-action="play"]').onclick=()=>state.running?pause():start();root.querySelector('[data-action="step"]').onclick=()=>{state=step(state);render()};root.querySelector('[data-action="reset"]').onclick=reset;
      root.querySelectorAll('[data-focus]').forEach(el=>el.onclick=event=>{event.preventDefault();state.focus=state.focus===el.dataset.focus?'all':el.dataset.focus;state.view=el.dataset.focus;state.glbChannel=glbChannelForView(state.view);render()});
      root.querySelectorAll('[data-window]').forEach(el=>el.ontoggle=()=>{if(el.open){state.view=el.dataset.window;state.glbChannel=glbChannelForView(state.view)}});
      root.querySelectorAll('[data-decomp]').forEach(el=>el.onclick=()=>{state.decomposition=el.dataset.decomp;render()});
      root.querySelectorAll('[data-glb]').forEach(el=>el.onclick=()=>{state.glbChannel=el.dataset.glb;state.view=state.glbChannel==='crystal'?'life':'cylinder';render()});
      root.querySelectorAll('[data-operator]').forEach(el=>el.onclick=()=>root.dispatchEvent(new win.CustomEvent('a0:family-grid-operator',{bubbles:true,detail:{operatorId:el.dataset.operator}})));
      root.querySelectorAll('[data-flavor]').forEach(el=>el.onclick=()=>{state.flavor=el.dataset.flavor;render()});root.querySelectorAll('[data-handle]').forEach(el=>el.onclick=()=>{state.handle=el.dataset.handle;render()});
    }
    function start(){if(state.running)return;state.running=true;render();timer=win.setInterval(()=>{state=step(state);state.running=true;state.view=VIEWS[Math.floor(state.tick/4)%3].id;state.glbChannel=glbChannelForView(state.view);render()},760)}
    function pause(){if(timer)win.clearInterval(timer);timer=0;state.running=false;render()}
    function reset(){pause();state=createState({bench:state.bench,bound:state.bound,projection:state.projection});if(state.bound){const projected=projectBenchState(state.bench);state.bits=projected.bits;state.tick=projected.tick;state.projection=projected.projection}render()}
    function setView(view){if(VIEWS.some(item=>item.id===view)){state.view=view;state.glbChannel=glbChannelForView(view);render()}}
    function bindBenchState(input){const projected=projectBenchState(input),previous=state.tick;state.bench=projected.bench;state.bits=projected.bits;state.ghost=state.bound&&previous!==projected.tick?previous:state.ghost;state.tick=projected.tick;state.bound=true;state.projection=projected.projection;render();return projected}
    const fork=doc.querySelector('[data-ihara-cubic-fork]');if(fork){fork.querySelectorAll('[data-ihara-branch]').forEach(button=>button.addEventListener('click',()=>{const result=cubicIharaFork(button.dataset.iharaBranch);fork.dataset.branch=result.chosen.slice(-1);fork.querySelector('output').textContent=`${result.incoming} · ${result.chosen} ALLOW · ${result.blocked} BLOCK`;fork.querySelectorAll('[data-ihara-branch]').forEach(x=>x.classList.toggle('primary',x===button))}))}
    render();return Object.freeze({start,pause,reset,step:()=>{state=step(state);render()},setView,bindBenchState,get state(){return JSON.parse(JSON.stringify(state))}})
  }
  return{VERSION,SIZE,VIEWS,FLAVORS,HANDLES,GLB_CHANNELS,qAngle,decomposeEleven,glbChannelForView,cubicIharaFork,normalizeBenchState,projectBenchState,createState,step,mount};
});
