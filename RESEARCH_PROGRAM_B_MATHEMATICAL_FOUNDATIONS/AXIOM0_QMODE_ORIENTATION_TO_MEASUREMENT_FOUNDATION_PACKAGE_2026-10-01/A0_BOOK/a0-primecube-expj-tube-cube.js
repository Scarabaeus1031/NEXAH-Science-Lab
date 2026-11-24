(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.A0PrimecubeExpJTubeCube=api;
})(typeof window!=='undefined'?window:globalThis,function(){
  'use strict';

  const BINS=Object.freeze(['H0+','H0−','H180+','H180−','V270+','V270−','V90+','V90−']);
  const COLORS=Object.freeze(['#2997d6','#ff8a2a','#35b43c','#e5262b','#9368c5','#a56555','#e26fc1','#8a8f94']);
  const MODULI=Object.freeze([41,42,43,59,61,97]);
  const SERIES=Object.freeze({
    41:Object.freeze({occupancy:[.170,.095,.050,.195,.025,.215,.245,.005],mean:4.1,max:12,switchRate:.132,peaks:[.10,.20,.44],motif:'TRIANGLE'}),
    42:Object.freeze({occupancy:[.145,.120,.100,.165,.025,.215,.230,0],mean:2.0,max:6,switchRate:.244,peaks:[],motif:'TUBE_ONLY'}),
    43:Object.freeze({occupancy:[.160,.095,.020,.210,.045,.205,.255,.010],mean:3.9,max:11,switchRate:.128,peaks:[.14,.24,.28,.33,.89],motif:'PENTAGON'}),
    59:Object.freeze({occupancy:[.150,.105,.240,0,.050,.205,.250,0],mean:6.2,max:17,switchRate:.103,peaks:[],motif:'TUBE_ONLY'}),
    61:Object.freeze({occupancy:[.150,.095,.265,0,.030,.215,.245,0],mean:6.7,max:18,switchRate:.100,peaks:[],motif:'TUBE_ONLY'}),
    97:Object.freeze({occupancy:[.145,.110,.055,.200,.025,.220,.245,0],mean:10.8,max:23,switchRate:.068,peaks:[],motif:'TUBE_ONLY'})
  });
  const TRANSITIONS=Object.freeze([
    Object.freeze([.86,0,0,0,0,0,.14,0]),
    Object.freeze([.15,.85,0,0,0,0,0,0]),
    Object.freeze([0,0,.80,.06,.14,0,0,0]),
    Object.freeze([0,0,.12,.86,.02,0,0,0]),
    Object.freeze([0,0,0,0,.44,.56,0,0]),
    Object.freeze([0,.07,0,0,0,.93,0,0]),
    Object.freeze([0,0,.04,0,0,0,.96,0]),
    Object.freeze([0,0,0,1,0,0,0,0])
  ]);
  const CORNERS=Object.freeze([
    Object.freeze({x:620,y:145}),Object.freeze({x:515,y:90}),Object.freeze({x:235,y:90}),Object.freeze({x:130,y:145}),
    Object.freeze({x:130,y:385}),Object.freeze({x:235,y:440}),Object.freeze({x:620,y:385}),Object.freeze({x:515,y:440})
  ]);

  const sum=values=>values.reduce((a,b)=>a+b,0);
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const fmt=v=>Number(v).toFixed(3).replace(/0+$/,'').replace(/\.$/,'');

  function phaseFor(modulus,step){
    const peaks=SERIES[modulus].peaks;
    return peaks.length?2*Math.PI*peaks[step%peaks.length]:2*Math.PI*((step%modulus)/modulus);
  }

  function nextState(modulus,state,step){
    const phase=phaseFor(modulus,step);
    const row=TRANSITIONS[state];
    const selector=.5+.5*Math.sin(phase*(step+1)+(state+1)*.73);
    let cumulative=0;
    for(let index=0;index<row.length;index+=1){
      cumulative+=row[index];
      if(selector<=cumulative)return index;
    }
    return state;
  }

  function motifPoints(modulus){
    const peaks=SERIES[modulus].peaks;
    if(!peaks.length)return [];
    const radius=modulus===43?108:96;
    return peaks.map((ratio,index)=>{
      const theta=2*Math.PI*ratio-Math.PI/2;
      return Object.freeze({x:375+radius*Math.cos(theta),y:265+radius*Math.sin(theta),ratio,index});
    });
  }

  function spectrum(trace){
    const signal=trace.slice(-32).map(index=>Math.cos(index*Math.PI/4));
    if(!signal.length)return Array(8).fill(0);
    return Array.from({length:8},(_,k)=>{
      let re=0,im=0;
      signal.forEach((value,n)=>{const a=-2*Math.PI*k*n/signal.length;re+=value*Math.cos(a);im+=value*Math.sin(a);});
      return Math.sqrt(re*re+im*im)/signal.length;
    });
  }

  function createState(modulus=41){
    if(!MODULI.includes(Number(modulus)))throw new RangeError('declared Series XI modulus required');
    return {modulus:Number(modulus),step:0,active:0,trace:[0],playing:false};
  }

  function advance(state){
    const next=nextState(state.modulus,state.active,state.step);
    return {...state,step:state.step+1,active:next,trace:[...state.trace,next].slice(-96)};
  }

  function selectModulus(state,modulus){
    const next=createState(modulus);return {...next,playing:false};
  }

  function clearTrace(state){return {...state,trace:[state.active]};}

  function runChecks(){
    const checks=[];const add=(id,pass)=>checks.push({id,pass:Boolean(pass)});
    add('EIGHT_TYPED_TUBE_ADDRESSES',BINS.length===8&&new Set(BINS).size===8);
    add('SIX_DECLARED_MODULI',MODULI.join(',')==='41,42,43,59,61,97');
    add('OCCUPANCY_NORMALIZED',MODULI.every(m=>Math.abs(sum(SERIES[m].occupancy)-1)<1e-12));
    add('EXPJ_MOTIFS_BOUNDED',SERIES[41].peaks.length===3&&SERIES[43].peaks.length===5&&MODULI.filter(m=>SERIES[m].peaks.length).length===2);
    add('TRANSITION_ROWS_NORMALIZED',TRANSITIONS.every(row=>Math.abs(sum(row)-1)<1e-12));
    const a=createState(41),b=advance(a),c=clearTrace(b);
    add('TRACE_RETAIN_AND_EXPLICIT_CLEAR',b.trace.length===2&&c.trace.length===1&&c.active===b.active);
    add('NO_SOURCE_FEEDBACK',Object.values(SERIES).every(row=>Object.isFrozen(row)));
    return Object.freeze({status:checks.every(c=>c.pass)?'PASS':'HOLD',passed:checks.filter(c=>c.pass).length,total:checks.length,checks:Object.freeze(checks),new_ids:0,new_relations:0});
  }

  function mount(doc,win){
    const host=doc?.querySelector('[data-pc-expj-tube-cube]');
    if(!host)return null;
    const q=selector=>host.querySelector(selector);
    let state=createState(Number(host.dataset.defaultModulus||41));
    let timer=null;

    function svgEl(name,attrs={},text=''){
      const el=doc.createElementNS('http://www.w3.org/2000/svg',name);
      Object.entries(attrs).forEach(([key,value])=>el.setAttribute(key,value));
      if(text)el.textContent=text;return el;
    }

    function draw(){
      const svg=q('[data-pc-etc-svg]');svg.replaceChildren();
      const data=SERIES[state.modulus],phase=phaseFor(state.modulus,state.step);
      const edgePairs=[[0,3],[3,4],[4,6],[6,0],[1,2],[2,5],[5,7],[7,1],[0,1],[3,2],[4,5],[6,7]];
      const defs=svgEl('defs');
      const glow=svgEl('filter',{id:'etcGlow',x:'-100%',y:'-100%',width:'300%',height:'300%'});
      glow.append(svgEl('feGaussianBlur',{stdDeviation:'5',result:'b'}));
      const merge=svgEl('feMerge');merge.append(svgEl('feMergeNode',{in:'b'}),svgEl('feMergeNode',{in:'SourceGraphic'}));glow.append(merge);defs.append(glow);svg.append(defs);
      svg.append(svgEl('rect',{x:0,y:0,width:750,height:520,fill:'#06111d'}));
      edgePairs.forEach(([a,b])=>svg.append(svgEl('line',{x1:CORNERS[a].x,y1:CORNERS[a].y,x2:CORNERS[b].x,y2:CORNERS[b].y,class:'etc-cube-edge'})));

      const points=motifPoints(state.modulus);
      if(points.length){
        const shape=points.map((p,i)=>`${i?'L':'M'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')+' Z';
        svg.append(svgEl('path',{d:shape,class:`etc-motif ${state.modulus===43?'pentagon':'triangle'}`}));
        points.forEach(p=>svg.append(svgEl('circle',{cx:p.x,cy:p.y,r:4,class:'etc-motif-node'})));
      }

      const tracePoints=state.trace.map(index=>CORNERS[index]);
      for(let i=1;i<tracePoints.length;i++){
        const alpha=.12+.78*(i/tracePoints.length);
        svg.append(svgEl('line',{x1:tracePoints[i-1].x,y1:tracePoints[i-1].y,x2:tracePoints[i].x,y2:tracePoints[i].y,class:'etc-trace','stroke-opacity':alpha.toFixed(3)}));
      }

      CORNERS.forEach((point,index)=>{
        const pulse=.76+.24*Math.cos(phase+index*Math.PI/4);
        const weight=data.occupancy[index]*pulse;
        const radius=9+42*Math.sqrt(weight);
        const group=svgEl('g',{class:index===state.active?'active':''});
        group.append(svgEl('circle',{cx:point.x,cy:point.y,r:radius,fill:COLORS[index],class:'etc-node-halo'}));
        group.append(svgEl('circle',{cx:point.x,cy:point.y,r:index===state.active?12:8,fill:COLORS[index],class:'etc-node-core',filter:index===state.active?'url(#etcGlow)':'none'}));
        group.append(svgEl('text',{x:point.x,y:point.y-32,class:'etc-node-label','text-anchor':'middle'},BINS[index]));
        group.append(svgEl('text',{x:point.x,y:point.y+38,class:'etc-node-value','text-anchor':'middle'},`${(data.occupancy[index]*100).toFixed(1)}%`));
        svg.append(group);
      });
      svg.append(svgEl('circle',{cx:375,cy:265,r:24,class:'etc-core'}));
      svg.append(svgEl('text',{x:375,y:260,class:'etc-core-text','text-anchor':'middle'},`m${state.modulus}`));
      svg.append(svgEl('text',{x:375,y:278,class:'etc-core-sub','text-anchor':'middle'},`φ ${(phase*180/Math.PI).toFixed(1)}°`));

      const mags=spectrum(state.trace),max=Math.max(...mags,1e-9),baseY=502;
      mags.forEach((value,index)=>svg.append(svgEl('rect',{x:278+index*25,y:baseY-38*(value/max),width:14,height:38*(value/max),rx:2,class:'etc-spectrum-bar'})));
      svg.append(svgEl('text',{x:270,y:509,class:'etc-spectrum-label','text-anchor':'end'},'DFT VIEW'));
    }

    function render(){
      const data=SERIES[state.modulus];
      host.dataset.modulus=state.modulus;host.dataset.motif=data.motif;
      q('[data-pc-etc-state]').textContent=`m${state.modulus} · STEP ${state.step} · ${BINS[state.active]}`;
      q('[data-pc-etc-role]').textContent=data.motif==='TUBE_ONLY'?'TUBE OPERATOR · NO EXP-J PEAK SET':`EXP-J ${data.motif} ↔ TUBE CUBE`;
      q('[data-pc-etc-peaks]').textContent=data.peaks.length?data.peaks.map(fmt).join(' · '):'— · not supplied';
      q('[data-pc-etc-persistence]').textContent=`mean ${fmt(data.mean)} · max ${data.max} · switch ${fmt(data.switchRate)}`;
      q('[data-pc-etc-active]').textContent=`${BINS[state.active]} · ${(data.occupancy[state.active]*100).toFixed(1)}%`;
      q('[data-pc-etc-trace]').textContent=`${state.trace.length} retained samples`;
      q('[data-pc-etc-play]').textContent=state.playing?'■ Pause':'▶ Play + retain trace';
      q('[data-pc-etc-play]').setAttribute('aria-pressed',String(state.playing));
      host.querySelectorAll('[data-pc-etc-modulus]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.pcEtcModulus)===state.modulus)));
      draw();
      win.A0PrimecubeExpJTubeCubeView=Object.freeze({state:{...state,trace:[...state.trace]},data,checks:runChecks()});
    }

    function stop(){state={...state,playing:false};if(timer){win.clearInterval(timer);timer=null;}}
    function tick(){state=advance(state);render();}
    q('[data-pc-etc-play]').addEventListener('click',()=>{if(state.playing){stop();render();return;}state={...state,playing:true};timer=win.setInterval(tick,460);render();});
    q('[data-pc-etc-step]').addEventListener('click',()=>{stop();tick();});
    q('[data-pc-etc-clear]').addEventListener('click',()=>{state=clearTrace(state);render();});
    host.querySelectorAll('[data-pc-etc-modulus]').forEach(button=>button.addEventListener('click',()=>{stop();state=selectModulus(state,Number(button.dataset.pcEtcModulus));render();}));
    doc.querySelectorAll('[data-pc-etc-jump]').forEach(button=>button.addEventListener('click',()=>host.scrollIntoView({behavior:'smooth',block:'start'})));
    render();
    return Object.freeze({render,advance:()=>{tick();return state;},clear:()=>{state=clearTrace(state);render();return state;},select:m=>{stop();state=selectModulus(state,m);render();return state;},runChecks,get state(){return {...state,trace:[...state.trace]};}});
  }

  return Object.freeze({BINS,COLORS,MODULI,SERIES,TRANSITIONS,CORNERS,phaseFor,nextState,motifPoints,spectrum,createState,advance,selectModulus,clearTrace,runChecks,mount});
});

if(typeof window!=="undefined"&&typeof document!=="undefined"){
  const boot=()=>window.A0PrimecubeExpJTubeCube?.mount(document,window);
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});
  else boot();
}

