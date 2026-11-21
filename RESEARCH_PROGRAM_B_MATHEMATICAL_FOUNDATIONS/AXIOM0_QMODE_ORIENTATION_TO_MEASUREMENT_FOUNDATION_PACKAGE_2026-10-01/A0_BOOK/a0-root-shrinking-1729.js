(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.A0RootShrinking1729=api;
})(typeof window!=='undefined'?window:globalThis,function(){
  'use strict';

  const VERSION='1.0.0';
  const MAX_SAFE=Number.MAX_SAFE_INTEGER;

  function clamp(value,min,max){return Math.max(min,Math.min(max,value))}

  function rootGap(k){
    if(!Number.isFinite(k)||k<1)throw new RangeError('k must be finite and >= 1');
    const integer=Number.isInteger(k);
    const direct=Math.sqrt(k+1)-Math.sqrt(k);
    const stable=1/(Math.sqrt(k+1)+Math.sqrt(k));
    const asymptotic=1/(2*Math.sqrt(k));
    return Object.freeze({
      k,integer,direct,stable,asymptotic,
      residual:direct-stable,
      ratioToAsymptotic:stable/asymptotic,
      exact:integer&&k<=MAX_SAFE?`1 / (√${k+1} + √${k})`:null,
      adjacentIntegerResolved:integer&&k<=MAX_SAFE&&k+1!==k,
      boundary:k>MAX_SAFE?'SCALE_ONLY_FLOAT64_ADJACENCY_NOT_RESOLVED':'ADJACENT_INTEGER_FLOAT64_INPUT_RESOLVED'
    });
  }

  function thresholdForEpsilon(epsilon){
    if(!Number.isFinite(epsilon)||epsilon<=0||epsilon>1)throw new RangeError('epsilon must be in (0,1]');
    const kStar=Math.pow((1/epsilon-epsilon)/2,2);
    const safeInteger=kStar<=MAX_SAFE;
    let minimumK=safeInteger?Math.max(1,Math.ceil(kStar)):null;
    if(minimumK!==null){
      const gapAt=n=>1/(Math.sqrt(n+1)+Math.sqrt(n));
      while(minimumK>1&&gapAt(minimumK-1)<=epsilon)minimumK--;
      while(gapAt(minimumK)>epsilon)minimumK++;
    }
    return Object.freeze({
      epsilon,kStar,minimumK,safeInteger,
      formula:'k >= ((epsilon^-1 - epsilon) / 2)^2',
      scaleEstimate:1/(4*epsilon*epsilon),
      boundary:safeInteger?'MINIMUM_INTEGER_RESOLVED':'THRESHOLD_SCALE_ONLY_INTEGER_EXCEEDS_FLOAT64_SAFE_RANGE'
    });
  }

  function thresholdForDecade(m){
    if(!Number.isInteger(m)||m<0||m>15)throw new RangeError('m must be an integer from 0 to 15');
    return thresholdForEpsilon(Math.pow(10,-m));
  }

  function taxicabJoint(){
    return Object.freeze({
      predecessor:Object.freeze({n:1728,representation:'12^3'}),
      n:1729,
      cubePaths:Object.freeze([Object.freeze([1,12]),Object.freeze([9,10])]),
      factorization:Object.freeze([7,13,19]),
      rootGap:rootGap(1728),
      statement:'1729 = 1^3 + 12^3 = 9^3 + 10^3 = 7 * 13 * 19',
      boundary:'The taxicab identity and the adjacent-root gap are parallel records at the same address, not the same operator.'
    });
  }

  function curveSamples(minExponent=0,maxExponent=30,count=181){
    if(count<2)throw new RangeError('count must be >= 2');
    const out=[];
    for(let i=0;i<count;i++){
      const logK=minExponent+(maxExponent-minExponent)*i/(count-1);
      const k=Math.pow(10,logK),gap=rootGap(k);
      out.push(Object.freeze({logK,k,logGap:Math.log10(gap.stable),gap:gap.stable}));
    }
    return Object.freeze(out);
  }

  function scientific(value,digits=6){
    if(value===0)return '0';
    if(!Number.isFinite(value))return String(value);
    return value.toExponential(digits).replace('e+','e');
  }

  function buildRecord(logK=3.237795,decade=6){
    const k=Math.pow(10,clamp(Number(logK)||0,0,30));
    return Object.freeze({
      schema:'nexah.a0.root-shrinking-1729/1.0.0',version:VERSION,
      identityReuse:Object.freeze(['MOD:NUMBER_VIEW_SUITE','ART:A0:MATHEMATICAL_JOINTS','A0:ROOTROOM_CODON_ORIENTATION_RETURN:V1']),
      selected:rootGap(k),threshold:thresholdForDecade(clamp(Math.round(decade),0,15)),joint:taxicabJoint(),
      law:'Delta_k = sqrt(k+1) - sqrt(k) = 1/(sqrt(k+1)+sqrt(k)) ~ 1/(2sqrt(k))',
      navigatorEffect:Object.freeze({newIdentities:0,newRelations:0,newStudies:0,newFindings:0}),
      boundary:'Root shrinking is algebraic power-law decay. Log coordinates and the spiral are declared display encodings, not an intrinsic root orbit.'
    });
  }

  function init(container){
    if(!container||container.dataset.rsReady)return;
    container.dataset.rsReady='true';
    const canvas=container.querySelector('canvas'),logInput=container.querySelector('[data-rs-logk]'),decadeInput=container.querySelector('[data-rs-decade]');
    const fields={k:container.querySelector('[data-rs-k]'),gap:container.querySelector('[data-rs-gap]'),direct:container.querySelector('[data-rs-direct]'),ratio:container.querySelector('[data-rs-ratio]'),epsilon:container.querySelector('[data-rs-epsilon]'),threshold:container.querySelector('[data-rs-threshold]'),float:container.querySelector('[data-rs-float]')};
    let state=buildRecord(Number(logInput.value),Number(decadeInput.value));

    function draw(){
      const rect=canvas.getBoundingClientRect(),dpr=Math.min(2,window.devicePixelRatio||1),w=Math.max(320,rect.width),h=Math.max(360,rect.height);
      canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);const c=canvas.getContext('2d');c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,w,h);
      const top=38,bottom=h-46,left=58,split=w*.62,right=w-24;
      c.fillStyle='#07101e';c.fillRect(0,0,w,h);
      c.strokeStyle='rgba(129,183,255,.16)';c.lineWidth=1;c.font='12px ui-monospace, monospace';c.fillStyle='#8ca0ba';
      for(let e=0;e<=30;e+=5){const x=left+(split-left)*e/30;c.beginPath();c.moveTo(x,top);c.lineTo(x,bottom);c.stroke();c.fillText(`10^${e}`,x-14,bottom+20)}
      for(let g=0;g>=-16;g-=2){const y=top+(bottom-top)*(-g)/16;c.beginPath();c.moveTo(left,y);c.lineTo(split,y);c.stroke();c.fillText(`10^${g}`,8,y+4)}
      const samples=curveSamples(0,30,241);c.beginPath();samples.forEach((p,i)=>{const x=left+(split-left)*p.logK/30,y=top+(bottom-top)*clamp(-p.logGap/16,0,1);i?c.lineTo(x,y):c.moveTo(x,y)});c.strokeStyle='#f3c75f';c.lineWidth=3;c.stroke();
      const logK=Math.log10(state.selected.k),logGap=Math.log10(state.selected.stable),sx=left+(split-left)*logK/30,sy=top+(bottom-top)*clamp(-logGap/16,0,1);
      c.beginPath();c.arc(sx,sy,7,0,Math.PI*2);c.fillStyle='#ff6eb5';c.fill();c.strokeStyle='#fff2a0';c.lineWidth=2;c.stroke();
      c.fillStyle='#e7edf7';c.font='600 13px system-ui';c.fillText('log₁₀ k →',split-72,bottom+38);c.save();c.translate(18,top+118);c.rotate(-Math.PI/2);c.fillText('log₁₀ Δₖ',0,0);c.restore();

      const cx=(split+right)/2,cy=(top+bottom)/2,rMax=Math.min((right-split)*.43,(bottom-top)*.43),turns=7;
      c.beginPath();for(let i=0;i<=360;i++){const t=i/360,angle=-Math.PI/2+t*turns*Math.PI*2,r=8+t*rMax,x=cx+Math.cos(angle)*r,y=cy+Math.sin(angle)*r;i?c.lineTo(x,y):c.moveTo(x,y)}c.strokeStyle='rgba(103,220,255,.5)';c.lineWidth=2;c.stroke();
      for(let m=0;m<=15;m+=3){const t=m/15,angle=-Math.PI/2+t*turns*Math.PI*2,r=8+t*rMax;c.beginPath();c.arc(cx+Math.cos(angle)*r,cy+Math.sin(angle)*r,4,0,Math.PI*2);c.fillStyle=m===Number(decadeInput.value)?'#ff6eb5':'#f3c75f';c.fill()}
      c.fillStyle='#e7edf7';c.textAlign='center';c.font='600 13px system-ui';c.fillText('Display spiral',cx,bottom+22);c.font='11px system-ui';c.fillStyle='#8ca0ba';c.fillText('ε-decades only · no intrinsic orbit',cx,bottom+38);c.textAlign='left';
    }

    function render(){
      state=buildRecord(Number(logInput.value),Number(decadeInput.value));
      fields.k.textContent=scientific(state.selected.k,5);
      fields.gap.textContent=scientific(state.selected.stable,8);
      fields.direct.textContent=scientific(state.selected.direct,8);
      fields.ratio.textContent=state.selected.ratioToAsymptotic.toFixed(10);
      fields.epsilon.textContent=`10^−${decadeInput.value}`;
      fields.threshold.textContent=state.threshold.minimumK!==null?state.threshold.minimumK.toLocaleString('de-DE'):scientific(state.threshold.kStar,6)+' (scale)';
      fields.float.textContent=state.selected.boundary==='SCALE_ONLY_FLOAT64_ADJACENCY_NOT_RESOLVED'?'Scale only: k+1 is not a distinct safe integer.':'Adjacent integer input resolved in Float64.';
      draw();
    }
    logInput.addEventListener('input',render);decadeInput.addEventListener('input',render);window.addEventListener('resize',draw);render();
  }

  if(typeof document!=='undefined')document.addEventListener('DOMContentLoaded',()=>document.querySelectorAll('[data-root-shrinking]').forEach(init));
  return Object.freeze({VERSION,MAX_SAFE,rootGap,thresholdForEpsilon,thresholdForDecade,taxicabJoint,curveSamples,scientific,buildRecord,init});
});
