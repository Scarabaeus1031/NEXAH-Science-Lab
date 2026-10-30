(function(root){
  'use strict';
  const SOURCE_MODEL='NEXAH:CON_DAO_BREATH:V1';
  const SHADOWS=Object.freeze({
    white:Object.freeze({blocked:[],rgb:[244,241,232],label:'WHITE · RGB offen'}),
    cyan:Object.freeze({blocked:['R'],rgb:[40,220,230],label:'CYAN · R blockiert'}),
    magenta:Object.freeze({blocked:['G'],rgb:[238,64,182],label:'MAGENTA · G blockiert'}),
    yellow:Object.freeze({blocked:['B'],rgb:[246,214,48],label:'YELLOW · B blockiert'}),
    red:Object.freeze({blocked:['G','B'],rgb:[240,42,54],label:'RED RESIDUAL · nur R offen'}),
    dark:Object.freeze({blocked:['R','G','B'],rgb:[8,13,18],label:'DARK · RGB blockiert'})
  });
  const CON_DAO_STATES=Object.freeze(['CON-6','CON-5','CON-4','CON-3','CON-2','CON-1','STILL','DAO-1','DAO-2','DAO-3','DAO-4','DAO-5','DAO-6']);
  function clamp(value,min,max){return Math.min(max,Math.max(min,Number(value)||0))}
  function state(progress,tilt,direction,shadow,counterTilt=0){
    const p=clamp(progress,0,1),axis=clamp(tilt,-90,90),counterAxis=clamp(counterTilt,-90,90),reverse=direction==='return',route=reverse?1-p:p;
    const approach=Math.sin(Math.PI*route),spacing=12*(1-.62*approach),stageIndex=Math.min(4,Math.floor(route*5));
    return Object.freeze({progress:p,route,axis,counterAxis,reverse,approach,ringSpacing:spacing,stage:['SOURCE','BOUNDARY','INNER','DETECTOR','RECORD'][stageIndex],shadow:SHADOWS[shadow]||SHADOWS.white,returnClosed:(p===0||p===1)});
  }
  function sequenceProjection(stateId){
    const index=CON_DAO_STATES.indexOf(stateId);
    if(index<0)return null;
    const phase=index/(CON_DAO_STATES.length-1),angle=-75+150*phase,atTransition=stateId==='STILL';
    return Object.freeze({sourceModel:SOURCE_MODEL,stateId,index,phase,primaryAngle:angle,counterAngle:-angle,progress:phase,atTransition,plusOne:atTransition,veilOpacity:atTransition?.46:.09+.19*(1-Math.abs(phase-.5)*2)});
  }
  function zetaRotate(sigma,t){
    const s=Number(sigma),tau=Number(t);
    if(!Number.isFinite(s)||!Number.isFinite(tau))throw new TypeError('sigma and t must be finite');
    return Object.freeze({re:-tau,im:s-.5,reOfIS:-tau});
  }
  function record(s,sequence=null){
    return Object.freeze({
      schema:'nexah.a0.spectral-shadow-return/2',moduleId:'OCB:SPECTRAL_SHADOW_RETURN_MACHINE',
      sourceIds:['TOP_BOUNDARY_01','NEXAH_A0_ORIENTATION_CONTROLLER_BENCH',SOURCE_MODEL],
      direction:s.reverse?'RIGHT_TO_LEFT_RETURN':'LEFT_TO_RIGHT_FORWARD',progress:s.progress,
      axisTiltDeg:s.axis,counterTiltDeg:s.counterAxis,ringSpacing:s.ringSpacing,shadow:s.shadow.label,
      returnClosed:s.returnClosed,sequence:sequence?Object.freeze({sourceModel:SOURCE_MODEL,state:sequence.stateId,projection:'DISPLAY_ADAPTER_ONLY',plusOne:sequence.plusOne}):null,
      schlierenRole:'UNCALIBRATED_DISPLAY_OVERLAY',zetaView:Object.freeze({map:'w=i(s-1/2)',re:'-t',im:'sigma-1/2',claim:'EXACT_AFFINE_COORDINATE_VIEW_ONLY'}),
      nautilusRole:'HISTORICAL_VISUAL_MORPHOLOGY_ONLY',
      claimCeiling:'SOURCE_BOUND_SEQUENCE_ADAPTER_NO_PHYSICAL_MECHANISM_NO_RIEMANN_LINK'
    });
  }
  function mount(doc,win){
    const host=doc.getElementById('spectralShadowReturnMachine');if(!host)return null;
    const progress=host.querySelector('[data-ssrm-progress]'),tilt=host.querySelector('[data-ssrm-tilt]'),counterTilt=host.querySelector('[data-ssrm-counter-tilt]'),direction=host.querySelector('[data-ssrm-direction]'),play=host.querySelector('[data-ssrm-play]'),sequenceButton=host.querySelector('[data-ssrm-sequence]'),stepButton=host.querySelector('[data-ssrm-step]'),reset=host.querySelector('[data-ssrm-reset]');
    const carrier=host.querySelector('[data-ssrm-carrier]'),counterCarrier=host.querySelector('[data-ssrm-counter-carrier]'),rings=[...host.querySelectorAll('[data-ssrm-ring]')],spiral=host.querySelector('[data-ssrm-spiral]'),signal=host.querySelector('[data-ssrm-signal]'),route=host.querySelector('[data-ssrm-route]'),screen=host.querySelector('[data-ssrm-screen-color]'),veil=host.querySelector('[data-ssrm-veil]'),scan=host.querySelector('[data-ssrm-scan]'),plusOne=host.querySelector('[data-ssrm-plus-one]'),plusOneLabel=host.querySelector('[data-ssrm-plus-one-label]');
    const stageOut=host.querySelector('[data-ssrm-stage]'),spacingOut=host.querySelector('[data-ssrm-spacing]'),axisOut=host.querySelector('[data-ssrm-axis]'),returnOut=host.querySelector('[data-ssrm-return]'),conDaoOut=host.querySelector('[data-ssrm-con-dao]'),plusOneOut=host.querySelector('[data-ssrm-plus-one-readout]'),status=host.querySelector('[data-ssrm-status]'),shadowButtons=[...host.querySelectorAll('[data-ssrm-shadow]')],sequenceNodes=[...host.querySelectorAll('.ssrm-sequence>*')];
    const zetaVertical=host.querySelector('[data-ssrm-zeta-vertical]'),zetaHorizontal=host.querySelector('[data-ssrm-zeta-horizontal]');
    let shadow='white',timer=null,last=0,sequence=null;
    function stop(){if(timer){win.cancelAnimationFrame(timer);timer=null}play.textContent='▶ BEWEGUNG';play.classList.remove('is-active')}
    function drawZetaMarkers(){
      const vertical=[],horizontal=[];
      for(let i=0;i<12;i++){const y=40+i*11.2,x=445+i*19.5;vertical.push(`<circle class="zeta-point" cx="180" cy="${y.toFixed(1)}" r="4"><title>supplied marker t${i+1}</title></circle>`);horizontal.push(`<circle class="zeta-point" cx="${x.toFixed(1)}" cy="108" r="4"><title>rotated marker −t${12-i}</title></circle>`)}
      zetaVertical.innerHTML=vertical.join('');zetaHorizontal.innerHTML=horizontal.join('');
    }
    function render(){
      const projected=sequence;
      if(projected){progress.value=String(projected.progress*100);tilt.value=String(projected.primaryAngle);counterTilt.value=String(projected.counterAngle)}
      const s=state(progress.value/100,tilt.value,direction.value,shadow,counterTilt.value),cx=350,cy=132,veilOpacity=projected?projected.veilOpacity:.08+.22*s.approach;
      carrier.setAttribute('transform',`rotate(${s.axis} ${cx} ${cy})`);counterCarrier.setAttribute('transform',`rotate(${s.counterAxis} ${cx} ${cy})`);spiral.setAttribute('transform',`rotate(${s.axis} ${cx} ${cy})`);
      rings.forEach((ring,index)=>ring.setAttribute('r',String(10+(index+1)*s.ringSpacing)));
      signal.setAttribute('cx',String(70+s.route*620));route.setAttribute('d',s.reverse?'M690 132H70':'M70 132H690');route.classList.toggle('active',s.route>.02&&s.route<.98);
      const atTransition=Boolean(projected&&projected.atTransition),displayRgb=atTransition?[54,15,78]:s.shadow.rgb;
      screen.setAttribute('fill',`rgb(${displayRgb.join(',')})`);veil.style.opacity=String(veilOpacity);scan.setAttribute('transform',`translate(${Math.round(s.route*105)} 0)`);plusOne.classList.toggle('active',atTransition);plusOneLabel.textContent=atTransition?'+1 · BLACKLIGHT':'+1 · OPEN';
      stageOut.textContent=s.stage;spacingOut.textContent=s.ringSpacing.toFixed(3);axisOut.textContent=`${s.axis.toFixed(0)}° / ${s.counterAxis.toFixed(0)}°`;returnOut.textContent=s.returnClosed?'CLOSED':'OPEN';conDaoOut.textContent=projected?`${projected.stateId} · SOURCE-BOUND VIEW`:'MANUAL · UNBOUND';plusOneOut.textContent=atTransition?'STILL · BLACKLIGHT DISPLAY':'OPEN · RGB RETURN';
      status.textContent=`${s.reverse?'RETURN ←':'FORWARD →'} · ${atTransition?'STILL / +1 BLACKLIGHT':s.shadow.label}`;shadowButtons.forEach(button=>button.classList.toggle('is-active',button.dataset.ssrmShadow===shadow));
      sequenceNodes.forEach((node,index)=>{if(projected&&index===projected.index)node.dataset.active='true';else delete node.dataset.active});
      host.dataset.stage=s.stage.toLowerCase();host.dataset.direction=s.reverse?'return':'forward';host.dataset.sequence=projected?projected.stateId.toLowerCase():'manual';host.A0Record=record(s,projected);
    }
    function tick(time){if(!last)last=time;const delta=time-last;last=time;if(delta>0){let next=Number(progress.value)+delta/90;if(next>=100){progress.value=100;render();stop();last=0;return}progress.value=String(next);render()}timer=win.requestAnimationFrame(tick)}
    function detachSequence(){sequence=null;sequenceButton.classList.remove('is-active')}
    function onPulse(event){const view=event&&event.detail&&event.detail.view;if(!view||view.mode!=='INNER')return;const projected=sequenceProjection(view.innerState);if(!projected)return;stop();sequence=projected;sequenceButton.classList.add('is-active');render()}
    play.addEventListener('click',()=>{detachSequence();if(timer){stop();return}if(Number(progress.value)>=100)progress.value=0;last=0;play.textContent='Ⅱ PAUSE';play.classList.add('is-active');timer=win.requestAnimationFrame(tick)});
    sequenceButton.addEventListener('click',()=>{stop();const controller=win.A0PulseGrammarClockController;if(!controller){status.textContent='CON–DAO HOLD · SOURCE CLOCK UNAVAILABLE';return}controller.expand();controller.play()});
    stepButton.addEventListener('click',()=>{stop();const controller=win.A0PulseGrammarClockController;if(!controller){status.textContent='CON–DAO HOLD · SOURCE CLOCK UNAVAILABLE';return}if(controller.record.view.mode!=='INNER')controller.expand();else controller.step()});
    reset.addEventListener('click',()=>{stop();detachSequence();progress.value=0;tilt.value=0;counterTilt.value=0;direction.value='forward';shadow='white';render()});
    [progress,tilt,counterTilt,direction].forEach(control=>control.addEventListener('input',()=>{stop();detachSequence();render()}));shadowButtons.forEach(button=>button.addEventListener('click',()=>{shadow=button.dataset.ssrmShadow;render()}));win.addEventListener('a0:pulse-grammar-clock',onPulse);drawZetaMarkers();render();
    return Object.freeze({state:()=>host.A0Record,stop,project(stateId){sequence=sequenceProjection(stateId);render();return host.A0Record},zetaRotate});
  }
  const api=Object.freeze({SOURCE_MODEL,SHADOWS,CON_DAO_STATES,state,sequenceProjection,zetaRotate,record,mount});if(typeof module!=='undefined'&&module.exports)module.exports=api;root.A0SpectralShadowReturnMachine=api;
})(typeof window!=='undefined'?window:globalThis);
