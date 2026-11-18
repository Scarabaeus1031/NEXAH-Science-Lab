(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.A0ExponentialDecayGap=api;
})(typeof window!=='undefined'?window:globalThis,function(){
  'use strict';
  const BASES=Object.freeze([.429,.439,.456]);
  const MODES=Object.freeze(['COMPARE','SINGLE','SQUARED','GAP']);
  function validBase(base){if(!Number.isFinite(base)||base<=0||base>=1)throw new RangeError('base must be finite and in (0,1)');}
  function decay(base,x){validBase(base);if(!Number.isFinite(x)||x<0)throw new RangeError('x must be finite and non-negative');return Math.pow(base,x);}
  function squaredExponentDecay(base,n){validBase(base);if(!Number.isInteger(n)||n<0)throw new RangeError('n must be a non-negative integer');return Math.pow(base,Math.pow(2,n));}
  function thresholdCrossing(base,threshold){validBase(base);if(!Number.isFinite(threshold)||threshold<=0||threshold>=1)throw new RangeError('threshold must be in (0,1)');return Math.log(threshold)/Math.log(base);}
  function audit(){
    const values=[0,1,2,4,8].map(x=>({x,values:BASES.map(base=>decay(base,x))}));
    return{schema:'a0.exponential-decay-gap/1.0.0',status:'PASS_EXPONENTIAL_DECAY_BOUNDARY',bases:BASES,values,thresholds:BASES.map(base=>({base,y:.1,x:thresholdCrossing(base,.1)})),simpleAndSquaredAreDistinct:true,claims:{reachesZeroAtFiniteExponent:false,specialTriangleRelation:false,sharedGeneratorBeyondFunctionFamily:false,frequencyRelation:false},identityReuse:['SF-NUMBERMAGICK-2025-AUDIT','MOD:NUMBER_VIEW_SUITE'],newCanonicalIds:[],relationChanges:[]};
  }
  function mount(doc=document,win=window){
    const host=doc.getElementById('grey-pink-decay-gap');if(!host)return null;
    const canvas=doc.getElementById('decayGapCanvas'),ctx=canvas.getContext('2d'),slider=doc.getElementById('decayGapX'),xOut=doc.getElementById('decayGapXOut'),status=doc.getElementById('decayGapStatus'),caption=doc.getElementById('decayGapCaption'),buttons=[...host.querySelectorAll('[data-decay-mode]')];
    const outs=[doc.getElementById('decay429Out'),doc.getElementById('decay439Out'),doc.getElementById('decay456Out')],sqOut=doc.getElementById('decaySquaredOut'),thresholdOut=doc.getElementById('decayThresholdOut');
    let mode='COMPARE';
    const colors=['#6ea0ff','#e0a24e','#ff54b9'],grey='#8b929d',ink='#e9edf5',grid='#343943',bg='#252830';
    function fit(){const dpr=Math.min(2,win.devicePixelRatio||1),r=canvas.getBoundingClientRect(),w=Math.max(340,Math.round(r.width)),h=Math.max(390,Math.round(r.height));if(canvas.width!==w*dpr||canvas.height!==h*dpr){canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)}return[w,h];}
    function line(points,color,width=2,dash=[]){ctx.save();ctx.strokeStyle=color;ctx.lineWidth=width;ctx.setLineDash(dash);ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.stroke();ctx.restore();}
    function dot(x,y,r,color){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();}
    function text(s,x,y,color=ink,size=12,align='left'){ctx.fillStyle=color;ctx.font=`${size}px system-ui,sans-serif`;ctx.textAlign=align;ctx.fillText(s,x,y);}
    function draw(){
      const[w,h]=fit(),pad={l:64,r:24,t:28,b:54},pw=w-pad.l-pad.r,ph=h-pad.t-pad.b,maxX=12;
      ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
      const px=x=>pad.l+x/maxX*pw,py=y=>pad.t+(1-y)*ph;
      for(let i=0;i<=12;i++){line([{x:px(i),y:pad.t},{x:px(i),y:pad.t+ph}],grid,1);text(String(i),px(i),h-25,grey,10,'center')}
      for(let i=0;i<=10;i++){const y=i/10;line([{x:pad.l,y:py(y)},{x:pad.l+pw,y:py(y)}],grid,1);text(y.toFixed(1),pad.l-10,py(y)+4,grey,10,'right')}
      line([{x:pad.l,y:py(0)},{x:pad.l+pw,y:py(0)}],grey,2);text('GREY · y=0 ASYMPTOTE',pad.l+pw-4,py(0)-8,grey,10,'right');
      const active=mode==='SINGLE'||mode==='SQUARED'?[.429]:BASES;
      if(mode!=='SQUARED')active.forEach((base,bi)=>{const pts=[];for(let i=0;i<=360;i++){const x=maxX*i/360;pts.push({x:px(x),y:py(decay(base,x))})}line(pts,colors[BASES.indexOf(base)],mode==='GAP'&&base===.456?4:2.5);text(`${base.toFixed(3)}ˣ`,px(8.6),py(decay(base,8.6))-7,colors[BASES.indexOf(base)],11)});
      if(mode==='SQUARED'){const pts=[];for(let n=0;n<=3;n++){const x=n*2.4+.7,y=squaredExponentDecay(.429,n),p={x:px(x),y:py(y)};pts.push(p);dot(p.x,p.y,5,colors[2]);text(`n${n} · 2^n=${2**n} · ${y.toFixed(6)}`,p.x+8,p.y-8,colors[2],10)}line(pts,colors[2],2,[6,5]);}
      const x=Number(slider.value),step=Math.max(0,Math.min(3,Math.round(x/3)));
      BASES.forEach((base,i)=>{const y=decay(base,x);outs[i].textContent=y.toFixed(6);if(mode!=='SQUARED')dot(px(x),py(y),4,colors[i])});
      const sq=squaredExponentDecay(.429,step);sqOut.textContent=`n=${step} · exponent ${2**step} · ${sq.toFixed(6)}`;thresholdOut.textContent=`x ≈ ${thresholdCrossing(.429,.1).toFixed(3)}`;xOut.textContent=x.toFixed(2);
      if(mode==='GAP'){const y=decay(.456,x);ctx.fillStyle='rgba(255,84,185,.16)';ctx.fillRect(px(x)-3,py(y),6,py(0)-py(y));text(`positive gap ${y.toExponential(3)}`,px(x)+9,(py(y)+py(0))/2,colors[2],10)}
      status.textContent=mode==='SQUARED'?'SQUARED EXPONENT · 0.429^(2^n) · DISCRETE STEPS':`${mode} · POSITIVE GAP · LIMIT 0`;
      caption.textContent=mode==='SQUARED'?'Der Schrittindex n verdoppelt den Exponenten: 1, 2, 4, 8. Diese Folge ist nicht dieselbe x-Achse wie bˣ.':'Grey ist die Asymptote y=0; Pink bleibt für jeden endlichen Exponenten strikt darüber.';
    }
    function setMode(next){if(!MODES.includes(next))throw new TypeError('unknown decay mode');mode=next;buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.decayMode===mode)));draw();}
    buttons.forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.decayMode)));slider.addEventListener('input',draw);win.ResizeObserver&&new win.ResizeObserver(draw).observe(host);setMode('COMPARE');return{draw,setMode,audit,state:()=>({mode,x:Number(slider.value)})};
  }
  if(typeof window!=='undefined')window.addEventListener('DOMContentLoaded',()=>mount());
  return{BASES,MODES,decay,squaredExponentDecay,thresholdCrossing,audit,mount};
});
