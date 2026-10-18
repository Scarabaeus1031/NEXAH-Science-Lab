(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.A0FamilyGridCoupler=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const VERSION='1.0.0',SIZE=11,TAU=Math.PI*2;
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
  function createState(overrides={}){return Object.assign({running:false,tick:0,view:'life',flavor:'pi',handle:'euler',glbChannel:'crystal',decomposition:'5+2x3',bits:[1,0,1,0,1,1,0,1,0,0,1],ghost:-1,iharaBranch:'c'},overrides)}
  function step(input){const state=createState(input),next=mod(state.tick+1,SIZE);state.ghost=state.tick;state.tick=next;return state}
  function mount(doc,win=doc.defaultView||{}){
    const root=doc.querySelector('[data-family-grid-coupler]');if(!root)throw Error('family grid coupler root missing');
    let state=createState(),timer=0;
    const familyRole=()=>doc.getElementById('familyRole')?.value||'F3';
    const angle=()=>qAngle(state.tick),decomp=()=>decomposeEleven(state.decomposition);
    function cellStyle(i){const a=TAU*i/SIZE;if(state.view==='cylinder')return`--x:${50+39*Math.sin(a)}%;--y:${51+31*Math.cos(a)}%`;if(state.view==='plate')return`--x:${8+(i%6)*17}%;--y:${i<6?28:72}%`;return`--x:${8+(i%4)*28}%;--y:${18+Math.floor(i/4)*34}%`}
    function render(){
      const a=angle(),d=decomp();root.dataset.view=state.view;root.dataset.running=String(state.running);
      root.innerHTML=`<div class="fgc-head"><div><small>GAME4LIFE+1 · FAMILY / PINK GHOST COUPLER</small><h2>5A · Life Grid → Platte → Zylinder</h2><p>Ein lokales 11er-Display, drei Ansichten. Pink ist der vorherige Puls; Cyan der aktuelle. Keine neue Family-Relation.</p></div><output>${state.running?'LIVE':'READY'} · ${familyRole()}</output></div>
      <div class="fgc-toolbar"><button data-action="play" class="primary">${state.running?'Ⅱ PAUSE':'▶ PLAY ALL'}</button><button data-action="step">STEP</button><button data-action="reset">RESET</button><span class="fgc-decomp">${d.label}</span><button data-decomp="5+2x3" class="${state.decomposition==='5+2x3'?'active':''}">5 + 2×3</button><button data-decomp="5+3x2" class="${state.decomposition==='5+3x2'?'active':''}">5 + 3×2</button></div>
      <div class="fgc-body"><div class="fgc-stage" aria-label="Eleven state family grid"><div class="fgc-axis"></div>${state.bits.map((bit,i)=>`<button class="fgc-cell ${bit?'one':'zero'} ${i===state.tick?'pulse':''} ${i===state.ghost?'ghost':''}" data-cell="${i}" style="${cellStyle(i)}"><b>${bit}</b><small>q${i}</small></button>`).join('')}<div class="fgc-center"><b>${state.view.toUpperCase()}</b><span>${state.view==='cylinder'?'θ around · axial retained':state.view==='plate'?'finite dead field · flat':'source state · 11 cells'}</span></div></div>
      <aside><div class="fgc-angle"><small>Q° · RAD / DEG</small><b>q${a.q} · ${a.degrees.toFixed(3)}°</b><code>${a.exactRadians} = ${a.radians.toFixed(6)} rad</code><span>${a.exactDegrees}</span></div><div class="fgc-view-buttons"><button data-view="life" class="${state.view==='life'?'active':''}">LIFE GRID</button><button data-view="plate" class="${state.view==='plate'?'active':''}">PLATTE</button><button data-view="cylinder" class="${state.view==='cylinder'?'active':''}">ZYLINDER</button></div><div class="fgc-glbs">${GLB_CHANNELS.map(x=>`<button data-glb="${x.id}" class="${state.glbChannel===x.id?'active':''}"><b>${x.label}</b><small>${x.role}</small></button>`).join('')}</div><div class="fgc-flavors">${FLAVORS.map(x=>`<button data-flavor="${x.id}" class="${state.flavor===x.id?'active':''}"><b>${x.label}</b><small>${x.name}</small></button>`).join('')}</div><div class="fgc-handles">${HANDLES.map(x=>`<button data-handle="${x.id}" class="${state.handle===x.id?'active':''}"><b>${x.label}</b><small>${x.role}</small></button>`).join('')}</div></aside></div>
      <div class="fgc-ledger"><span>ACTIVE ${state.tick}</span><span>GHOST ${state.ghost<0?'—':state.ghost}</span><span>ONES ${state.bits.filter(Boolean).length}/11</span><span>FAMILY VIEW ${familyRole()}</span><span>GLB ${state.glbChannel.toUpperCase()}</span><span>FLAVOR ${state.flavor.toUpperCase()}</span><span>HANDLE ${state.handle.toUpperCase()}</span></div>
      <p class="fgc-boundary"><b>BOUNDARY:</b> π, φ, √2, e und Fibonacci sind umschaltbare Vergleichslinsen. Riemann, Ramanujan, Euler und Gauss sind getrennte Quellen-/Leserollen. Weder Namen noch Farben erzeugen eine kanonische Family-Kante. <a href="A0_GAME_4_LIFE_PLUS_1.html">Game4Life+1-Quelle ↗</a> · <a href="A0_FAMILY_CONNECTION_ATLAS.html">Family Atlas ↗</a> · <a href="A0_PINK_DIAMOND_GRID_ATLAS.html">Pink Grid ↗</a></p>`;
      root.querySelector('[data-action="play"]').onclick=()=>state.running?pause():start();root.querySelector('[data-action="step"]').onclick=()=>{state=step(state);render()};root.querySelector('[data-action="reset"]').onclick=reset;
      root.querySelectorAll('[data-cell]').forEach(el=>el.onclick=()=>{const i=Number(el.dataset.cell);state.bits[i]=state.bits[i]?0:1;state.tick=i;render()});
      root.querySelectorAll('[data-view]').forEach(el=>el.onclick=()=>{state.view=el.dataset.view;state.glbChannel=glbChannelForView(state.view);render()});root.querySelectorAll('[data-decomp]').forEach(el=>el.onclick=()=>{state.decomposition=el.dataset.decomp;render()});
      root.querySelectorAll('[data-glb]').forEach(el=>el.onclick=()=>{state.glbChannel=el.dataset.glb;state.view=state.glbChannel==='crystal'?'life':'cylinder';render()});
      root.querySelectorAll('[data-flavor]').forEach(el=>el.onclick=()=>{state.flavor=el.dataset.flavor;render()});root.querySelectorAll('[data-handle]').forEach(el=>el.onclick=()=>{state.handle=el.dataset.handle;render()});
    }
    function start(){if(state.running)return;state.running=true;render();timer=win.setInterval(()=>{state=step(state);state.running=true;state.view=['life','plate','cylinder'][Math.floor(state.tick/4)%3];state.glbChannel=glbChannelForView(state.view);render()},760)}
    function pause(){if(timer)win.clearInterval(timer);timer=0;state.running=false;render()}
    function reset(){pause();state=createState();render()}
    function setView(view){if(['life','plate','cylinder'].includes(view)){state.view=view;state.glbChannel=glbChannelForView(view);render()}}
    const fork=doc.querySelector('[data-ihara-cubic-fork]');if(fork){fork.querySelectorAll('[data-ihara-branch]').forEach(button=>button.addEventListener('click',()=>{const result=cubicIharaFork(button.dataset.iharaBranch);fork.dataset.branch=result.chosen.slice(-1);fork.querySelector('output').textContent=`${result.incoming} · ${result.chosen} ALLOW · ${result.blocked} BLOCK`;fork.querySelectorAll('[data-ihara-branch]').forEach(x=>x.classList.toggle('primary',x===button))}))}
    render();return Object.freeze({start,pause,reset,step:()=>{state=step(state);render()},setView,get state(){return JSON.parse(JSON.stringify(state))}})
  }
  return{VERSION,SIZE,FLAVORS,HANDLES,GLB_CHANNELS,qAngle,decomposeEleven,glbChannelForView,cubicIharaFork,createState,step,mount};
});
