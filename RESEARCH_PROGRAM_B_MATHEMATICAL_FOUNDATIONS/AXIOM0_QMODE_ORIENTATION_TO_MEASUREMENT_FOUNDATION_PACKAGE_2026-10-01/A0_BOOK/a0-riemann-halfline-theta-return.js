(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.A0RiemannHalflineTheta=api;
})(typeof window!=='undefined'?window:globalThis,function(){
  'use strict';
  const VERSION='1.1.0',GAMMA=.5772156649015329,PI=Math.PI;
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

  function moduloReturn(n,m){
    if(!Number.isInteger(n)||!Number.isInteger(m)||m<2)throw new RangeError('integer n and modulus m>=2 required');
    const residue=((n%m)+m)%m;
    return Object.freeze({n,m,residue,returned:((n+m)%m+m)%m,exact:residue===((n+m)%m+m)%m,law:'q_M(n+M)=q_M(n)'});
  }
  function reciprocalReturn(t){
    if(!Number.isFinite(t)||t<=0)throw new RangeError('t must be finite and positive');
    const inverse=1/t,returned=1/inverse;
    return Object.freeze({t,inverse,returned,residual:returned-t,fixedSeam:t===1,side:t<1?'INSIDE':t>1?'OUTSIDE':'SEAM',law:'I(t)=1/t; I²=id'});
  }
  function mirrorReturn(sigma,t=14.134725){
    if(!Number.isFinite(sigma)||!Number.isFinite(t))throw new RangeError('finite sigma and t required');
    const mirrorSigma=1-sigma,returnedSigma=1-mirrorSigma,distance=sigma-.5;
    return Object.freeze({
      source:Object.freeze({re:sigma,im:t}),
      mirror:Object.freeze({re:mirrorSigma,im:t}),
      returned:Object.freeze({re:returnedSigma,im:t}),
      fixed:Math.abs(sigma-.5)<=Number.EPSILON*Math.max(1,Math.abs(sigma))*4,
      sourceDistance:distance,
      mirrorDistance:-distance,
      exact:Math.abs(returnedSigma-sigma)<=Number.EPSILON*Math.max(1,Math.abs(sigma),Math.abs(returnedSigma))*4,
      law:'W(s)=1-conj(s); W²=id',
      fixedSet:'Fix(W)={s in C : Re(s)=1/2}',
      operatorType:'AFFINE_ANTI_HOLOMORPHIC_INVOLUTION',
      boundary:'Set invariance does not imply pointwise fixation or no-crossing.'
    });
  }
  function theta(t,tolerance=1e-14){
    if(!Number.isFinite(t)||t<=0)throw new RangeError('t must be finite and positive');
    const nMax=Math.max(4,Math.ceil(Math.sqrt(-Math.log(tolerance)/(PI*t))));
    let sum=1;
    for(let n=1;n<=nMax;n++)sum+=2*Math.exp(-PI*n*n*t);
    return sum;
  }
  function thetaReturn(t){
    const lhs=theta(1/t),rhs=Math.sqrt(t)*theta(t);
    return Object.freeze({t,lhs,rhs,residual:lhs-rhs,relativeResidual:Math.abs(lhs-rhs)/Math.max(1,Math.abs(lhs),Math.abs(rhs)),law:'theta(1/t)=sqrt(t)*theta(t)',status:'FINITE_GAUSSIAN_SUM_AUDIT'});
  }
  function sieve(limit){
    if(!Number.isInteger(limit)||limit<2)throw new RangeError('integer limit>=2 required');
    const prime=new Uint8Array(limit+1);prime.fill(1,2);
    for(let p=2;p*p<=limit;p++)if(prime[p])for(let q=p*p;q<=limit;q+=p)prime[q]=0;
    const pi=new Uint32Array(limit+1);let count=0;
    for(let n=0;n<=limit;n++){if(prime[n])count++;pi[n]=count}
    return {prime,pi,count};
  }
  function eiPositive(x){
    if(!Number.isFinite(x)||x<=0)throw new RangeError('x must be positive');
    let term=x,sum=term;
    for(let k=2;k<=240;k++){term*=x/k;const add=term/k;sum+=add;if(Math.abs(add)<1e-16*Math.abs(sum))break}
    return GAMMA+Math.log(x)+sum;
  }
  function logarithmicIntegral(x){
    if(!Number.isFinite(x)||x<=1)throw new RangeError('x must be > 1');
    return eiPositive(Math.log(x));
  }
  const sqrtReference=x=>Math.sqrt(x);
  function schoenfeldBound(x){
    if(!Number.isFinite(x)||x<=1)throw new RangeError('x must be > 1');
    return Object.freeze({x,bound:Math.sqrt(x)*Math.log(x)/(8*PI),inTheoremDomain:x>=2657,conditionalOn:'RIEMANN_HYPOTHESIS',citation:'Schoenfeld 1976'});
  }
  function primeResidualSeries(limit=100000,sampleCount=520){
    limit=clamp(Math.round(limit),10,100000);const data=sieve(limit),out=[];
    for(let i=0;i<sampleCount;i++){
      const x=Math.max(2,Math.round(2+(limit-2)*i/(sampleCount-1)));
      const li=logarithmicIntegral(x),residual=data.pi[x]-li,bound=schoenfeldBound(x);
      out.push({x,pi:data.pi[x],li,residual,sqrt:sqrtReference(x),schoenfeld:bound.bound,schoenfeldActive:bound.inTheoremDomain});
    }
    return Object.freeze({limit,primeCount:data.count,samples:Object.freeze(out),endpoint:Object.freeze(out[out.length-1]),allSampledResidualsNegative:out.every(p=>p.residual<0)});
  }
  function buildRecord({modulus=637,n=809,logT=0,primeLimit=100000}={}){
    const t=Math.pow(10,clamp(Number(logT)||0,-2,2));
    return Object.freeze({schema:'nexah.a0.riemann-halfline-theta-return/1.1.0',version:VERSION,
      identityReuse:Object.freeze(['MOD:NUMBER_VIEW_SUITE','ART:A0:MATHEMATICAL_JOINTS','NEXAH_ORION_REF02_Q_MIRROR_2026_10_01']),
      finiteOrbit:moduloReturn(Math.round(n),Math.round(modulus)),involution:reciprocalReturn(t),mirror:mirrorReturn(.4,14.134725),theta:thetaReturn(t),primeResidual:primeResidualSeries(Math.round(primeLimit)),
      navigatorEffect:Object.freeze({newIdentities:0,newRelations:0,newStudies:0,newFindings:0}),
      boundary:'Finite computation and display comparison only. No Riemann proof, no zeta-zero localization, no physical wave or Root-Shrinking identity.'});
  }
  const sci=(v,d=5)=>Number.isFinite(v)?v.toExponential(d).replace('e+','e'):String(v);

  function init(container){
    if(!container||container.dataset.rhtReady)return;container.dataset.rhtReady='true';
    const $=s=>container.querySelector(s),canvas=$('canvas'),controls={m:$('[data-rht-m]'),n:$('[data-rht-n]'),t:$('[data-rht-t]'),limit:$('[data-rht-limit]')};
    const out={orbit:$('[data-rht-orbit]'),inv:$('[data-rht-inv]'),theta:$('[data-rht-theta]'),pi:$('[data-rht-pi]'),res:$('[data-rht-res]'),band:$('[data-rht-band]')};
    let state;
    function render(){
      state=buildRecord({modulus:+controls.m.value,n:+controls.n.value,logT:+controls.t.value,primeLimit:+controls.limit.value});
      out.orbit.textContent=`${state.finiteOrbit.n} ↦ ${state.finiteOrbit.residue}; +M ↦ ${state.finiteOrbit.returned} · EXACT`;
      out.inv.textContent=`${sci(state.involution.t,3)} ↔ ${sci(state.involution.inverse,3)} ↦ ${sci(state.involution.returned,3)}`;
      out.theta.textContent=`relative residual ${sci(state.theta.relativeResidual,3)} · finite sum`;
      out.pi.textContent=`π(${state.primeResidual.limit}) = ${state.primeResidual.primeCount}`;
      out.res.textContent=`π−li = ${state.primeResidual.endpoint.residual.toFixed(5)} · sampled sign: ${state.primeResidual.allSampledResidualsNegative?'negative':'mixed'}`;
      const b=schoenfeldBound(state.primeResidual.limit);out.band.textContent=`±${b.bound.toFixed(5)} · ${b.inTheoremDomain?'IF RH / domain active':'IF RH / outside x≥2657 domain'}`;draw();
    }
    function draw(){
      const rect=canvas.getBoundingClientRect(),dpr=Math.min(2,window.devicePixelRatio||1),w=Math.max(320,rect.width),h=Math.max(500,rect.height);canvas.width=w*dpr;canvas.height=h*dpr;
      const c=canvas.getContext('2d');c.setTransform(dpr,0,0,dpr,0,0);c.fillStyle='#06101a';c.fillRect(0,0,w,h);const gap=26,pad=42,panel=(w-pad*2-gap*2)/3,top=46,bottom=h-58;
      c.font='700 12px ui-monospace,monospace';c.textAlign='center';
      ['FINITE MODULO ORBIT','RECIPROCAL + THETA','PRIME RESIDUAL'].forEach((s,i)=>{const x=pad+i*(panel+gap);c.strokeStyle='rgba(118,161,204,.28)';c.strokeRect(x,top,panel,bottom-top);c.fillStyle=['#f4c85c','#64ddff','#ff75b7'][i];c.fillText(s,x+panel/2,top-15)});
      const x0=pad+panel/2,y0=(top+bottom)/2,r=Math.min(panel*.38,(bottom-top)*.34),m=state.finiteOrbit.m,steps=Math.min(m,220);c.strokeStyle='rgba(244,200,92,.36)';c.beginPath();c.arc(x0,y0,r,0,PI*2);c.stroke();
      for(let i=0;i<steps;i++){const a=-PI/2+2*PI*i/steps;c.fillStyle=i===state.finiteOrbit.residue%steps?'#fff3a4':'rgba(244,200,92,.45)';c.beginPath();c.arc(x0+Math.cos(a)*r,y0+Math.sin(a)*r,i===state.finiteOrbit.residue%steps?5:1.4,0,PI*2);c.fill()}
      c.fillStyle='#e9f2ff';c.font='700 17px system-ui';c.fillText(`ℤ/${m}ℤ`,x0,y0+6);c.font='11px system-ui';c.fillStyle='#91a6bd';c.fillText('circle is a display embedding',x0,bottom-18);
      const px=pad+panel+gap,mid=px+panel/2,cy=(top+bottom)/2,span=panel*.34;c.strokeStyle='rgba(100,221,255,.3)';c.beginPath();c.moveTo(mid-span,cy);c.lineTo(mid+span,cy);c.stroke();c.beginPath();c.arc(mid,cy,4,0,PI*2);c.fillStyle='#f4c85c';c.fill();
      const u=Math.log10(state.involution.t)/2,ax=mid+u*span,bx=mid-u*span;c.strokeStyle='#64ddff';c.lineWidth=2.5;c.beginPath();c.moveTo(ax,cy-34);c.quadraticCurveTo(mid,cy-105,bx,cy-34);c.stroke();[ax,bx].forEach((x,i)=>{c.beginPath();c.arc(x,cy-34,6,0,PI*2);c.fillStyle=i?'#ff75b7':'#64ddff';c.fill()});c.fillStyle='#e9f2ff';c.font='700 14px ui-monospace,monospace';c.fillText('t=1 seam',mid,cy+28);c.font='11px system-ui';c.fillStyle='#91a6bd';c.fillText('involution ≠ Möbius topology',mid,bottom-18);
      const qx=pad+2*(panel+gap),plotL=qx+28,plotR=qx+panel-20,plotT=top+26,plotB=bottom-30,maxAbs=Math.max(1,...state.primeResidual.samples.map(p=>Math.max(Math.abs(p.residual),p.schoenfeld,p.sqrt)));
      c.strokeStyle='rgba(145,166,189,.25)';c.beginPath();c.moveTo(plotL,(plotT+plotB)/2);c.lineTo(plotR,(plotT+plotB)/2);c.stroke();
      function path(key,color,dash=[],active=()=>true){c.beginPath();let started=false;state.primeResidual.samples.forEach(p=>{if(!active(p)){started=false;return}const x=plotL+(plotR-plotL)*(p.x-2)/(state.primeResidual.limit-2),y=(plotT+plotB)/2-(plotB-plotT)*.46*p[key]/maxAbs;started?c.lineTo(x,y):c.moveTo(x,y);started=true});c.strokeStyle=color;c.setLineDash(dash);c.lineWidth=1.8;c.stroke();c.setLineDash([])}
      path('sqrt','rgba(244,200,92,.45)',[4,4]);path('residual','#ff75b7');path('schoenfeld','rgba(100,221,255,.7)',[7,4],p=>p.schoenfeldActive);
      c.font='11px system-ui';c.fillStyle='#91a6bd';c.fillText('±√x = reference only',qx+panel/2,bottom-30);c.fillText('Schoenfeld = conditional on RH',qx+panel/2,bottom-14);c.textAlign='left';
    }
    Object.values(controls).forEach(el=>el.addEventListener('input',render));window.addEventListener('resize',draw);render();
  }
  function initMirror(container){
    if(!container||container.dataset.rhtMirrorReady)return;container.dataset.rhtMirrorReady='true';
    const sigma=container.querySelector('[data-rht-sigma]'),height=container.querySelector('[data-rht-height]'),svg=container.querySelector('[data-rht-mirror-svg]');
    const source=container.querySelector('[data-rht-source]'),partner=container.querySelector('[data-rht-partner]'),returned=container.querySelector('[data-rht-returned]'),status=container.querySelector('[data-rht-fixed]');
    const fmt=v=>(Math.round(v*1000)/1000).toFixed(3);
    function render(){
      const record=mirrorReturn(+sigma.value,+height.value),x=v=>40+v*520,y=140;
      source.textContent=`${fmt(record.source.re)} + ${fmt(record.source.im)}i`;
      partner.textContent=`${fmt(record.mirror.re)} + ${fmt(record.mirror.im)}i`;
      returned.textContent=`${fmt(record.returned.re)} + ${fmt(record.returned.im)}i · ${record.exact?'EXACT':'FAIL'}`;
      status.textContent=record.fixed?'FIXED · source = mirror = return':'PAIRED · distinct source and mirror';
      status.dataset.state=record.fixed?'fixed':'paired';
      svg.innerHTML=`<line x1="40" y1="${y}" x2="560" y2="${y}" class="axis"/><line x1="300" y1="30" x2="300" y2="250" class="seam"/><text x="300" y="20" class="seam-label">Re(s)=1/2</text><path d="M ${x(record.source.re)} ${y-12} Q 300 42 ${x(record.mirror.re)} ${y-12}" class="arc"/><circle cx="${x(record.source.re)}" cy="${y}" r="9" class="source"/><circle cx="${x(record.mirror.re)}" cy="${y}" r="9" class="mirror"/><circle cx="300" cy="${y}" r="4" class="fixed"/><text x="${x(record.source.re)}" y="${y+30}" class="point-label">s</text><text x="${x(record.mirror.re)}" y="${y+30}" class="point-label">W(s)</text><text x="300" y="235" class="return-label">W(W(s)) = s</text>`;
    }
    sigma.addEventListener('input',render);height.addEventListener('input',render);render();
  }
  if(typeof document!=='undefined')document.addEventListener('DOMContentLoaded',()=>{document.querySelectorAll('[data-riemann-halfline-theta]').forEach(init);document.querySelectorAll('[data-rht-mirror]').forEach(initMirror)});
  return Object.freeze({VERSION,moduloReturn,reciprocalReturn,mirrorReturn,theta,thetaReturn,sieve,eiPositive,logarithmicIntegral,sqrtReference,schoenfeldBound,primeResidualSeries,buildRecord,init,initMirror});
});
