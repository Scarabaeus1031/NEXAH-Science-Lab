(function(root,factory){
  const api=factory(root);
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.A0PiOvalSampler=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(root){
  'use strict';

  const TAU=Math.PI*2;
  const GOLDEN_RATIO=(1+Math.sqrt(5))/2;

  function audit(phaseDegrees=0){
    const lens=root&&root.A0PlatinumIridiumPI;
    if(lens&&typeof lens.ovalPhiSamplingAudit==='function')return lens.ovalPhiSamplingAudit(phaseDegrees);
    if(!Number.isFinite(phaseDegrees))throw new TypeError('finite phase required');
    const phase=((phaseDegrees%360)+360)%360;
    const radians=phase*Math.PI/180;
    const a=1.18+.1*Math.sin(radians);
    const b=.78-.07*Math.sin(radians);
    const sample=(count,index)=>{
      const theta=TAU*index/count;
      return{index,theta,point:[a*Math.cos(theta),b*Math.sin(theta)]};
    };
    const platinum=Array.from({length:24},(_,i)=>sample(24,i));
    const iridium=Array.from({length:12},(_,i)=>sample(12,i));
    const residual=Math.max(...iridium.map((item,i)=>Math.hypot(item.point[0]-platinum[i*2].point[0],item.point[1]-platinum[i*2].point[1])));
    return{
      schema:'a0.oval-phi-dual-sampler/1.0.0',
      status:residual<=1e-12?'PASS_SHARED_OVAL_TWO_TO_ONE_SAMPLING':'FAIL_OVAL_SAMPLE_ALIGNMENT',
      phaseDegrees:phase,
      oval:{semiMajor:a,semiMinor:b,area:Math.PI*a*b,parameterization:'x=a(phi) cos(theta), y=b(phi) sin(theta)'},
      sampling:{platinum:{count:24,role:'FAST_READER_2',points:platinum},iridium:{count:12,role:'BASE_READER_1',points:iridium},ratio:'2:1',sharedSamples:12,platinumOnlySamples:12,coincidenceResidual:residual},
      symbols:{phase:'phi = display phase',goldenRatio:'varphi = (1+sqrt(5))/2 reference only'},
      claims:{biologicalEgg:false,materialResponse:false,metrology:false,physicalBreathing:false,goldenRatioGenerator:false,ghostSnakeIdentity:false},
      sourceGeometryChanged:false,
      newCanonicalIds:[],
      relationChanges:[]
    };
  }

  function mount(doc=root&&root.document,win=root){
    const canvas=doc&&doc.getElementById('piOvalSamplerCanvas');
    if(!canvas)return null;
    const ctx=canvas.getContext('2d');
    const phaseInput=doc.getElementById('piOvalPhase');
    const phaseOut=doc.getElementById('piOvalPhaseOut');
    const statusOut=doc.getElementById('piOvalStatus');
    const axesOut=doc.getElementById('piOvalAxes');
    const play=doc.getElementById('piOvalPlay');
    const step=doc.getElementById('piOvalStep');
    const reset=doc.getElementById('piOvalReset');
    const reduced=!!(win&&win.matchMedia&&win.matchMedia('(prefers-reduced-motion: reduce)').matches);
    let phase=Number(phaseInput&&phaseInput.value)||0;
    let running=false;
    let frame=0;
    let last=0;

    function resize(){
      const box=canvas.getBoundingClientRect();
      const dpr=Math.min(2,(win&&win.devicePixelRatio)||1);
      const width=Math.max(320,Math.round(box.width||canvas.clientWidth||860));
      const height=Math.max(300,Math.round(box.height||canvas.clientHeight||520));
      canvas.width=Math.round(width*dpr);
      canvas.height=Math.round(height*dpr);
      ctx.setTransform(dpr,0,0,dpr,0,0);
      draw(width,height);
    }

    function dot(x,y,r,fill,stroke,lineWidth=1){
      ctx.beginPath();ctx.arc(x,y,r,0,TAU);
      if(fill){ctx.fillStyle=fill;ctx.fill();}
      if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lineWidth;ctx.stroke();}
    }

    function draw(width=canvas.clientWidth||860,height=canvas.clientHeight||520){
      const report=audit(phase);
      ctx.clearRect(0,0,width,height);
      const gradient=ctx.createRadialGradient(width*.5,height*.5,12,width*.5,height*.5,width*.55);
      gradient.addColorStop(0,'#102a35');gradient.addColorStop(.62,'#061720');gradient.addColorStop(1,'#020a0f');
      ctx.fillStyle=gradient;ctx.fillRect(0,0,width,height);
      const cx=width*.5,cy=height*.5;
      const scale=Math.min(width*.36,height*.36);
      const rx=report.oval.semiMajor*scale,ry=report.oval.semiMinor*scale;

      ctx.save();ctx.setLineDash([3,8]);ctx.strokeStyle='rgba(67,208,242,.24)';ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(cx-rx-44,cy);ctx.lineTo(cx+rx+44,cy);ctx.moveTo(cx,cy-ry-44);ctx.lineTo(cx,cy+ry+44);ctx.stroke();ctx.restore();
      ctx.beginPath();ctx.ellipse(cx,cy,rx,ry,0,0,TAU);ctx.strokeStyle='#ffd05a';ctx.lineWidth=2.5;ctx.stroke();
      ctx.beginPath();ctx.ellipse(cx,cy,rx*1.035,ry*1.035,0,0,TAU);ctx.strokeStyle='rgba(236,240,244,.2)';ctx.lineWidth=7;ctx.stroke();

      report.sampling.platinum.points.forEach((sample,i)=>{
        const x=cx+sample.point[0]*scale,y=cy+sample.point[1]*scale;
        const shared=i%2===0;
        dot(x,y,shared?3.2:2.2,shared?'#eff5f8':'#b6c2ca',null);
      });
      report.sampling.iridium.points.forEach(sample=>{
        const x=cx+sample.point[0]*scale,y=cy+sample.point[1]*scale;
        dot(x,y,7,null,'#32d1f2',2);
      });

      const fastIndex=Math.floor((report.phaseDegrees/360)*24)%24;
      const baseIndex=Math.floor((report.phaseDegrees/360)*12)%12;
      const fast=report.sampling.platinum.points[fastIndex];
      const base=report.sampling.iridium.points[baseIndex];
      dot(cx+fast.point[0]*scale,cy+fast.point[1]*scale,9,'#f4f6f7','#ffffff',2);
      dot(cx+base.point[0]*scale,cy+base.point[1]*scale,13,'rgba(50,209,242,.18)','#32d1f2',3);
      dot(cx,cy,5,'#ffd05a',null);

      ctx.fillStyle='#dce7eb';ctx.font='600 12px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.fillText('Pt · READER 2 · 24 SAMPLES',24,31);
      ctx.fillStyle='#32d1f2';ctx.fillText('Ir · READER 1 · 12 SAMPLES',24,50);
      ctx.fillStyle='#ffd05a';ctx.fillText('SHARED OVAL · 2:1',24,height-24);
      ctx.textAlign='right';ctx.fillStyle='#9cb2bc';ctx.fillText('φ DISPLAY PHASE · ϕ REFERENCE',width-24,height-24);ctx.textAlign='left';

      if(phaseInput)phaseInput.value=String(Math.round(report.phaseDegrees));
      if(phaseOut)phaseOut.textContent=`${report.phaseDegrees.toFixed(1)}°`;
      if(statusOut)statusOut.textContent=`${report.status} · SHARED 12 · Pt-ONLY 12`;
      if(axesOut)axesOut.textContent=`a ${report.oval.semiMajor.toFixed(3)} · b ${report.oval.semiMinor.toFixed(3)} · A ${report.oval.area.toFixed(3)}`;
      return report;
    }

    function setPhase(next){phase=((Number(next)%360)+360)%360;return draw();}
    function tick(now){
      if(!running)return;
      if(last)phase=(phase+(now-last)*.018)%360;
      last=now;draw();frame=win.requestAnimationFrame(tick);
    }
    function setRunning(next){
      running=!!next&&!reduced;
      play&&play.setAttribute('aria-pressed',String(running));
      if(play)play.textContent=running?'Ⅱ PAUSE PHASE':'▶ PLAY PHASE';
      if(frame)win.cancelAnimationFrame(frame);
      frame=0;last=0;
      if(running)frame=win.requestAnimationFrame(tick);
    }

    phaseInput&&phaseInput.addEventListener('input',()=>{setRunning(false);setPhase(phaseInput.value);});
    play&&play.addEventListener('click',()=>setRunning(!running));
    step&&step.addEventListener('click',()=>{setRunning(false);setPhase(phase+15);});
    reset&&reset.addEventListener('click',()=>{setRunning(false);setPhase(0);});
    const observer=win&&win.ResizeObserver?new win.ResizeObserver(resize):null;
    observer&&observer.observe(canvas);
    resize();
    return{audit,draw,setPhase,setRunning,state:()=>({phase,running,goldenRatio:GOLDEN_RATIO}),destroy(){setRunning(false);observer&&observer.disconnect();}};
  }

  return{GOLDEN_RATIO,audit,mount};
});
