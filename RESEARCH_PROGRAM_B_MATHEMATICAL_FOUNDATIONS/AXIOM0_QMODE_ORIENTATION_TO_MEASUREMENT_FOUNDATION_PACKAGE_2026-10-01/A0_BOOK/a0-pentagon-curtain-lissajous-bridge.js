(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.A0PentagonCurtainLissajousBridge=api;
})(typeof window!=='undefined'?window:globalThis,function(){
  'use strict';
  const TAU=Math.PI*2;
  const SOURCE_IDS=Object.freeze([
    'SRC:A0OE:PENTAGON_CURTAIN_LAB',
    'SRC:A0OE:PENTAGON_CURTAIN_SEAM_TEST',
    'SRC:A0OE:PENTAGON_CURTAIN_CONSTRUCTION_VISUAL'
  ]);
  const CHANNELS=Object.freeze([
    {id:'AM',color:'#e5b340'},
    {id:'VM',color:'#29c7ef'},
    {id:'PM',color:'#ee6ca5'}
  ]);
  const clamp01=value=>Math.max(0,Math.min(1,Number(value)||0));
  const point=(cx,cy,rx,ry,angle)=>({x:cx+Math.cos(angle)*rx,y:cy+Math.sin(angle)*ry});
  const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
  function buildGeometry(phase=0,width=760,height=520){
    const q=clamp01(phase),breath=Math.sin(TAU*q),twist=.16*breath,fold=.5+.5*Math.cos(TAU*q);
    const cx=width*.5,topY=height*.25,bottomY=height*.73,rx=Math.min(width*.31,230),ry=Math.min(height*.13,70);
    const upper=Array.from({length:5},(_,i)=>point(cx,topY,rx*(1+.035*breath),ry,-Math.PI/2+i*TAU/5+twist));
    const lower=Array.from({length:5},(_,i)=>point(cx,bottomY,rx*(1-.035*breath),ry,-Math.PI/2+i*TAU/5-twist));
    const hinges=upper.map((u,i)=>({x:(u.x+lower[i].x)/2,y:(u.y+lower[i].y)/2}));
    const ghost=hinges.map((m,i)=>({x:cx+(m.x-cx)*(.48+.08*fold),y:height*.49+(m.y-height*.49)*.28}));
    const sectors=upper.map((u,i)=>{const j=(i+1)%5;return{index:i,channel:CHANNELS[i%3],points:[u,upper[j],lower[j],lower[i]],hinges:[hinges[i],hinges[j]]};});
    const rods=upper.flatMap((u,i)=>[{from:u,to:hinges[i],side:'UPPER',index:i},{from:hinges[i],to:lower[i],side:'LOWER',index:i}]);
    const apertureRadius=24+18*(.5+.5*breath);
    return{phase:q,breath,twist,fold,width,height,center:{x:cx,y:height*.49},upper,lower,hinges,ghost,sectors,rods,apertureRadius};
  }
  function auditGeometry(geometry){
    const pairErrors=geometry.upper.map((u,i)=>Math.abs(distance(u,geometry.hinges[i])-distance(geometry.hinges[i],geometry.lower[i])));
    const returned=buildGeometry(1,geometry.width,geometry.height),origin=buildGeometry(0,geometry.width,geometry.height);
    const returnError=Math.max(...origin.upper.concat(origin.lower,origin.hinges).map((p,i)=>distance(p,returned.upper.concat(returned.lower,returned.hinges)[i])));
    return{
      upperVertices:geometry.upper.length,
      lowerVertices:geometry.lower.length,
      middleHinges:geometry.hinges.length,
      rods:geometry.rods.length,
      curtainSectors:geometry.sectors.length,
      maxEqualRodPairError:Math.max(...pairErrors),
      returnError,
      seamClosureClaim:false,
      signalMechanicsClaim:false
    };
  }
  function svgPoint(p){return`${p.x.toFixed(2)},${p.y.toFixed(2)}`}
  function renderSvg(svg,geometry,signals=[0,0,0]){
    const ns='http://www.w3.org/2000/svg';
    const path=points=>points.map(svgPoint).join(' ');
    const signalValues=[0,1,2].map(i=>Number(signals[i])||0);
    const panelMarkup=geometry.sectors.map(sector=>{
      const value=signalValues[sector.index%3],opacity=(.09+.16*(value+1)/2).toFixed(3);
      return`<polygon points="${path(sector.points)}" fill="${sector.channel.color}" fill-opacity="${opacity}" stroke="${sector.channel.color}" stroke-opacity=".28" data-curtain-sector="${sector.index}" data-channel="${sector.channel.id}"/>`;
    }).join('');
    const seamMarkup=geometry.rods.map(rod=>`<line x1="${rod.from.x}" y1="${rod.from.y}" x2="${rod.to.x}" y2="${rod.to.y}" class="curtain-rod" data-side="${rod.side}"/>`).join('');
    const hingeMarkup=geometry.hinges.map((p,i)=>`<circle cx="${p.x}" cy="${p.y}" r="5" class="curtain-hinge" data-hinge="${i}"/>`).join('');
    const upper=path(geometry.upper),lower=path(geometry.lower),ghost=path(geometry.ghost);
    svg.setAttribute('viewBox',`0 0 ${geometry.width} ${geometry.height}`);
    svg.innerHTML=`
      <defs><filter id="curtainGlow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
      <g class="curtain-grid"><line x1="${geometry.center.x}" y1="34" x2="${geometry.center.x}" y2="${geometry.height-28}"/><line x1="90" y1="${geometry.center.y}" x2="${geometry.width-90}" y2="${geometry.center.y}"/></g>
      <g class="curtain-panels">${panelMarkup}</g>
      <g class="curtain-seams">${seamMarkup}</g>
      <polygon points="${upper}" class="curtain-frame upper"/><polygon points="${lower}" class="curtain-frame lower"/>
      <polygon points="${ghost}" class="curtain-ghost"/>
      <g class="curtain-hinges">${hingeMarkup}</g>
      <circle cx="${geometry.center.x}" cy="${geometry.center.y}" r="${geometry.apertureRadius.toFixed(2)}" class="curtain-aperture"/>
      <circle cx="${geometry.center.x}" cy="${geometry.center.y}" r="4" class="curtain-pin"/>
      <text x="${geometry.center.x+geometry.apertureRadius+10}" y="${geometry.center.y+4}" class="curtain-label">APERTURE · VIEW</text>
    `;
    return svg;
  }
  function init(doc=document){
    const host=doc.getElementById('pentagonCurtainLissajousBridge');
    if(!host)return null;
    const svg=doc.getElementById('pentagonCurtainSvg'),phase=doc.getElementById('pentagonCurtainPhase'),phaseOut=doc.getElementById('pentagonCurtainPhaseOut'),play=doc.getElementById('pentagonCurtainPlay'),follow=doc.getElementById('pentagonCurtainFollow'),readout=doc.getElementById('pentagonCurtainReadout'),reset=doc.getElementById('pentagonCurtainReset');
    let signals=[0,0,0],playing=false,raf=0,last=0;
    function render(){
      const geometry=buildGeometry(Number(phase.value));
      renderSvg(svg,geometry,signals);
      const audit=auditGeometry(geometry);
      phaseOut.textContent=`${(geometry.phase*360).toFixed(0)}°`;
      readout.textContent=`5 SECTORS · 5 HINGES · 10 RODS · RETURN ε ${audit.returnError.toExponential(1)} · SIGNAL→VIEW ONLY`;
      return{geometry,audit,signals:[...signals]};
    }
    function loop(now){if(!playing)return;const dt=Math.min(80,Math.max(0,now-last));last=now;phase.value=String((Number(phase.value)+dt/6000)%1);render();raf=requestAnimationFrame(loop)}
    function setPlaying(value){playing=Boolean(value);play.classList.toggle('active',playing);play.textContent=playing?'Pause curtain':'Play curtain';play.setAttribute('aria-pressed',String(playing));last=performance.now();cancelAnimationFrame(raf);if(playing)raf=requestAnimationFrame(loop)}
    phase.addEventListener('input',()=>{setPlaying(false);render()});
    play.addEventListener('click',()=>setPlaying(!playing));
    reset.addEventListener('click',()=>{setPlaying(false);phase.value='0';signals=[0,0,0];render()});
    window.addEventListener('a0-lissajous-frame',event=>{if(!follow.checked)return;signals=event.detail?.signals||signals;phase.value=String(((Number(event.detail?.clock)||0)%TAU)/TAU);render()});
    render();
    return{render,setPlaying,get state(){return{phase:Number(phase.value),signals:[...signals],following:follow.checked,sourceIds:[...SOURCE_IDS],...auditGeometry(buildGeometry(Number(phase.value)))}}};
  }
  return{SOURCE_IDS,CHANNELS,buildGeometry,auditGeometry,renderSvg,init};
});
