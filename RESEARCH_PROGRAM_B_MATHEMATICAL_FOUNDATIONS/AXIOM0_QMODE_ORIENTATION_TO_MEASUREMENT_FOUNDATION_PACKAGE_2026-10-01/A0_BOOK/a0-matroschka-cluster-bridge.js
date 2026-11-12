(function(){
  'use strict';
  const M=window.A0MatroschkaClusterModel;
  const $=s=>document.querySelector(s),fmt=(v,n=4)=>Number(v).toFixed(n),inputs=['a','b','c','azimuth','elevation'];
  const state={a:2,b:1,c:4,azimuth:35,elevation:25,side:'F0',snap:0,playing:false,timer:null,modelReady:false,modelPlaying:false,modelOrbit:false,nativeAnimation:false};
  const model3d=$('#mcb-3d-model'),snapTimes=[0,2.5,5,7.5,10];
  function matrix(host,A){host.innerHTML=A.flat().map(v=>`<span>${fmt(v,2)}</span>`).join('')}
  function set(id,value){const el=$('#'+id);if(el)el.textContent=value}
  function modelPlay(){
    if(!state.modelReady||!model3d)return;
    if(state.nativeAnimation){try{model3d.play({repetitions:Infinity})}catch(error){model3d.play()}}
    state.modelPlaying=true;
    const button=$('#mcb-3d-play');if(button){button.textContent=state.nativeAnimation?'Ⅱ PAUSE WHEELS':'Ⅱ PAUSE SNAP CYCLE';button.setAttribute('aria-pressed','true')}
  }
  function modelPause(){
    if(state.modelReady&&state.nativeAnimation&&model3d&&typeof model3d.pause==='function')model3d.pause();
    state.modelPlaying=false;
    const button=$('#mcb-3d-play');if(button){button.textContent=state.nativeAnimation?'▶ PLAY WHEELS':'▶ PLAY SNAP CYCLE';button.setAttribute('aria-pressed','false')}
  }
  function syncModelSnap(index,preservePlayback=false){
    const snap=M.snapOf(index),time=snapTimes[snap.index];
    set('mcb-3d-state',`${state.modelReady?'READY':'LOADING'} · ${snap.angle}° ${snap.bearing}`);
    set('mcb-3d-frame',`FRAME ${fmt(time,2)} s · ${snap.polarity}`);
    document.querySelectorAll('[data-mcb-3d-snap]').forEach(button=>button.classList.toggle('is-active',Number(button.getAttribute('data-mcb-3d-snap'))===snap.index));
    if(model3d)model3d.style.setProperty('--mcb-model-angle',`${snap.angle}deg`);
    if(!state.modelReady||!model3d)return;
    if(!state.nativeAnimation){state.modelPlaying=state.playing;state.modelPlaying?modelPlay():modelPause();return}
    const wasPlaying=state.modelPlaying;
    model3d.currentTime=time;
    if(preservePlayback&&wasPlaying)modelPlay();else modelPause();
  }
  function render(){
    inputs.forEach(id=>state[id]=Number($('#mcb-'+id).value));
    const r=M.route([state.a,state.b,state.c],state),C=M.census(),color=r.cluster.color,snap=M.snapOf(state.snap);
    inputs.forEach(id=>set('mcb-'+id+'-value',state[id]+(id==='azimuth'||id==='elevation'?'°':'')));
    set('mcb-address',`(${r.source.join(',')}) ∈ Z₆³`);set('mcb-cluster',`${r.cluster.id} · ${r.cluster.label}`);
    set('mcb-radius',fmt(r.rho,6));set('mcb-chart',`${fmt(r.riemann.re,3)} ${r.riemann.im<0?'−':'+'} ${fmt(Math.abs(r.riemann.im),3)}i`);
    set('mcb-q',fmt(r.qDegree.measurement,6));set('mcb-return',r.return.epsilon.toExponential(2));
    set('mcb-witnessless',r.controls.witnessless.epsilon.toExponential(2));set('mcb-wrong',r.controls.wrongOrder.epsilon.toExponential(2));
    set('mcb-f0-side',r.f0.side);
    set('mcb-census',`${C.exactReturns}/${C.nodes}`);set('mcb-failures',`${C.witnesslessFailures} / ${C.wrongOrderFailures}`);
    $('#mcb-source-point').setAttribute('cx',150+state.a*22);$('#mcb-source-point').setAttribute('cy',484-state.b*18);$('#mcb-source-point').style.color=color;
    $('#mcb-cluster-point').setAttribute('cx',[315,405,495][r.cluster.index]);$('#mcb-cluster-point').setAttribute('cy',[390,330,390][r.cluster.index]);$('#mcb-cluster-point').style.color=color;
    const gx=690+r.oriented[0]*130,gy=310-r.oriented[1]*130;
    $('#mcb-geo-point').setAttribute('cx',gx);$('#mcb-geo-point').setAttribute('cy',gy);$('#mcb-geo-point').style.color=color;
    const qx=690+r.qDegree.axis[0]*150,qy=310-r.qDegree.axis[1]*150,mx=690-r.qDegree.axis[0]*150,my=310+r.qDegree.axis[1]*150;
    $('#mcb-q-plus').setAttribute('x2',qx);$('#mcb-q-plus').setAttribute('y2',qy);$('#mcb-q-minus').setAttribute('x2',mx);$('#mcb-q-minus').setAttribute('y2',my);
    $('#mcb-q-plus-label').setAttribute('x',qx+(qx>=690?8:-36));$('#mcb-q-plus-label').setAttribute('y',qy-8);
    $('#mcb-q-minus-label').setAttribute('x',mx+(mx>=690?8:-36));$('#mcb-q-minus-label').setAttribute('y',my+18);
    $('#mcb-route').setAttribute('d',`M${150+state.a*22},${484-state.b*18} C260,470 290,410 ${[315,405,495][r.cluster.index]},${[390,330,390][r.cluster.index]} S560,310 ${gx},${gy} S905,270 1035,315 S1110,430 1045,500`);
    $('#mcb-return-point').setAttribute('fill',r.return.exact?'#69df9e':'#ff4d83');
    set('mcb-snap-name',snap.label);set('mcb-snap-angle',`${snap.angle}° · ${snap.polarity} · ${snap.operator}`);
    set('mcb-bearing',snap.bearing);set('mcb-landing-token',snap.landing.token);set('mcb-landing-type',snap.landing.type);
    set('mcb-nest-state',snap.index===3?'EXTERNAL VIEW · RIEMANN / Q°':snap.index===4?'RETURN · ALL SHELLS CLOSE':`${snap.angle}° · ${snap.label} SHELL`);
    const roseAngle=(snap.angle%360)*Math.PI/180,roseX=690+Math.cos(roseAngle)*176,roseY=310-Math.sin(roseAngle)*176;
    $('#mcb-azimuth-ray').setAttribute('x2',roseX);$('#mcb-azimuth-ray').setAttribute('y2',roseY);
    $('#mcb-azimuth-head').setAttribute('cx',roseX);$('#mcb-azimuth-head').setAttribute('cy',roseY);
    set('mcb-azimuth-rose',`AZIMUT ${snap.angle}°`);
    const route=$('#mcb-route'),cursor=$('#mcb-snap-cursor'),fractions=[0,.24,.52,.76,1],point=route.getPointAtLength(route.getTotalLength()*fractions[snap.index]);
    cursor.setAttribute('cx',point.x);cursor.setAttribute('cy',point.y);
    document.querySelectorAll('[data-snap]').forEach(button=>button.classList.toggle('is-active',Number(button.dataset.snap)===snap.index));
    document.querySelectorAll('[data-snap-station]').forEach(station=>station.classList.toggle('is-active',Number(station.dataset.snapStation)===snap.index));
    document.querySelectorAll('[data-landing-station]').forEach(station=>station.classList.toggle('is-active',Number(station.dataset.landingStation)===snap.index));
    document.body.dataset.cluster=r.cluster.id;document.body.dataset.snap=String(snap.index);document.body.dataset.qPolarity=snap.polarity.endsWith('−')?'minus':'plus';document.body.dataset.playing=state.playing?'true':'false';
    $('#mcb-play').textContent=state.playing?'PAUSE BOLA':'PLAY BOLA';
  }
  function setSnap(index){
    state.snap=((Number(index)%M.SNAP_SEQUENCE.length)+M.SNAP_SEQUENCE.length)%M.SNAP_SEQUENCE.length;
    state.side=state.snap===3?'F0-':'F0';
    render();syncModelSnap(state.snap,state.playing);
  }
  function stop(){if(state.timer)clearInterval(state.timer);state.timer=null;state.playing=false;modelPause();render()}
  function togglePlay(){
    if(state.playing){stop();return}
    state.playing=true;modelPlay();render();state.timer=setInterval(()=>setSnap(state.snap+1),1100);
  }
  const translationCanvas=$('#mcb-translation-canvas'),translationContext=translationCanvas&&translationCanvas.getContext('2d');
  const translation={inner:'julia',outer:'riemann',rot:.35,scale:1,sample:1,phase:.35};
  const translationOperators=['invert','rotate','scale','sample','rank','phase'];
  const clamp01=value=>Math.max(0,Math.min(1,value));
  function translationField(cx,cy,radius,kind,time){
    const points=[],count=Math.max(64,Math.floor(340*translation.sample));
    for(let i=0;i<=count;i++){
      const q=i/count;
      if(kind==='julia'){
        const t=q*Math.PI*8,radial=.55+.18*Math.sin(3*t+time)+.1*Math.sin(7*t);
        points.push([cx+radius*radial*Math.cos(t),cy+radius*radial*Math.sin(t)]);
      }else if(kind==='mandelbrot'){
        const t=q*Math.PI*2,radial=.42*(1-Math.cos(t))+.12*Math.cos(5*t+time);
        points.push([cx+radius*radial*Math.cos(t),cy+radius*.72*radial*Math.sin(t)]);
      }else if(kind==='hofmann'){
        const t=q*Math.PI*4+time,a=.45722,u=Math.sin(t)*Math.cos(a*t),v=Math.sin(t)*Math.sin(a*t)*Math.sin(2*t);
        points.push([cx+radius*u*translation.scale,cy-radius*v*translation.scale]);
      }else{
        const t=-35+q*70,den=.25+t*t,u=.5/den,v=-t/den;
        points.push([cx+radius*v*.95,cy-radius*(u*5-.08)]);
      }
    }
    return points;
  }
  function translationLine(points,color,width=1.5){
    translationContext.beginPath();points.forEach((point,index)=>index?translationContext.lineTo(point[0],point[1]):translationContext.moveTo(point[0],point[1]));
    translationContext.strokeStyle=color;translationContext.lineWidth=width;translationContext.stroke();
  }
  function translationFlow(ax,ay,bx,by,time,color,reverse=false){
    translationContext.globalAlpha=.36;translationContext.strokeStyle=color;translationContext.beginPath();translationContext.moveTo(ax,ay);
    translationContext.bezierCurveTo((ax+bx)/2,ay-34,(ax+bx)/2,by+34,bx,by);translationContext.stroke();
    for(let k=0;k<5;k++){const q=((reverse?-time:time)*.12+k/5+2)%1,px=ax+(bx-ax)*q,py=ay+(by-ay)*q-Math.sin(q*Math.PI)*24;translationContext.beginPath();translationContext.arc(px,py,2.2,0,Math.PI*2);translationContext.fillStyle=color;translationContext.fill()}
    translationContext.globalAlpha=1;
  }
  function drawTranslation(timeMs=0){
    if(!translationContext)return;
    const ratio=Math.min(2,window.devicePixelRatio||1),rect=translationCanvas.getBoundingClientRect(),width=Math.max(720,rect.width||1080),height=Math.max(420,rect.height||620);
    if(translationCanvas.width!==Math.round(width*ratio)||translationCanvas.height!==Math.round(height*ratio)){translationCanvas.width=Math.round(width*ratio);translationCanvas.height=Math.round(height*ratio)}
    translationContext.setTransform(ratio,0,0,ratio,0,0);translationContext.fillStyle='#02090d';translationContext.fillRect(0,0,width,height);
    const time=timeMs/1000,L=width*.22,C=width*.5,R=width*.78,cy=height*.49,radius=Math.min(width*.16,height*.28),wheelRadius=Math.min(104,width*.09);
    translationContext.font='800 10px ui-monospace';translationContext.fillStyle='#8eabb3';translationContext.textAlign='center';
    translationContext.fillText('INNER DISPLAY · '+translation.inner.toUpperCase(),L,48);translationContext.fillText('DECLARED OPERATOR WHEEL',C,48);translationContext.fillText('OUTER DISPLAY · '+translation.outer.toUpperCase(),R,48);
    translationLine(translationField(L,cy,radius,translation.inner,time*.16),'rgba(255,77,131,.84)',1.7);
    translationLine(translationField(R,cy,radius,translation.outer,time*translation.phase*.25),'rgba(57,200,239,.9)',1.8);
    for(let k=0;k<6;k++){translationContext.beginPath();translationContext.arc(C,cy,wheelRadius*(.35+k*.11),0,Math.PI*2);translationContext.strokeStyle=k%2?'rgba(57,200,239,.25)':'rgba(255,208,91,.25)';translationContext.stroke()}
    translationOperators.forEach((operator,index)=>{const angle=time*translation.rot+index*Math.PI/3,x=C+Math.cos(angle)*wheelRadius*.82,y=cy+Math.sin(angle)*wheelRadius*.82;translationContext.fillStyle=index<4?'#39c8ef':'#ffd05b';translationContext.fillText(operator,x,y)});
    translationContext.beginPath();translationContext.arc(C,cy,6,0,Math.PI*2);translationContext.fillStyle='#ffd05b';translationContext.fill();
    translationFlow(L+radius*.72,cy,C-wheelRadius*.82,cy,time,'#ff4d83');translationFlow(C+wheelRadius*.82,cy,R-radius*.72,cy,time+.4,'#39c8ef');
    translationFlow(R-radius*.72,cy+58,C+wheelRadius*.7,cy+58,time,'#ffd05b',true);translationFlow(C-wheelRadius*.7,cy+58,L+radius*.72,cy+58,time,'#ffd05b',true);
    const preserved=clamp01(.92-.28*(1-translation.sample)-.08*Math.abs(translation.scale-1));
    const changed=clamp01(.08+.42*Math.abs(translation.scale-1)+.18*translation.phase);
    const collapsed=clamp01((1-translation.sample)*.72);
    set('mcb-translation-preserved',(preserved*100).toFixed(1)+'%');set('mcb-translation-changed',(changed*100).toFixed(1)+'%');set('mcb-translation-collapsed',(collapsed*100).toFixed(1)+'%');
    set('mcb-translation-state',translation.inner.toUpperCase()+' → '+translation.outer.toUpperCase()+' · VIEW');
    requestAnimationFrame(drawTranslation);
  }
  if(translationCanvas){
    document.querySelectorAll('[data-mcb-inner-lens]').forEach(button=>button.addEventListener('click',()=>{translation.inner=button.dataset.mcbInnerLens;document.querySelectorAll('[data-mcb-inner-lens]').forEach(item=>item.classList.toggle('is-active',item===button))}));
    document.querySelectorAll('[data-mcb-outer-lens]').forEach(button=>button.addEventListener('click',()=>{translation.outer=button.dataset.mcbOuterLens;document.querySelectorAll('[data-mcb-outer-lens]').forEach(item=>item.classList.toggle('is-active',item===button))}));
    for(const key of ['rot','scale','sample','phase']){$('#mcb-translation-'+key).addEventListener('input',event=>{translation[key]=Number(event.target.value);set('mcb-translation-'+key+'-value',translation[key].toFixed(2))})}
    requestAnimationFrame(drawTranslation);
  }
  inputs.forEach(id=>$('#mcb-'+id).addEventListener('input',render));
  $('#mcb-next').addEventListener('click',()=>{let n=state.a*36+state.b*6+state.c;n=(n+1)%216;state.a=Math.floor(n/36);state.b=Math.floor(n/6)%6;state.c=n%6;['a','b','c'].forEach(id=>$('#mcb-'+id).value=state[id]);render()});
  $('#mcb-corner').addEventListener('click',()=>{state.a=5;state.b=5;state.c=5;['a','b','c'].forEach(id=>$('#mcb-'+id).value=state[id]);render()});
  $('#mcb-center').addEventListener('click',()=>{state.a=2;state.b=2;state.c=2;['a','b','c'].forEach(id=>$('#mcb-'+id).value=state[id]);render()});
  $('#mcb-f0').addEventListener('click',()=>{state.side=state.side==='F0'?'F0-':'F0';render()});
  $('#mcb-snap').addEventListener('click',()=>{stop();setSnap(state.snap+1)});
  $('#mcb-play').addEventListener('click',togglePlay);
  document.querySelectorAll('[data-snap]').forEach(button=>button.addEventListener('click',()=>{stop();setSnap(Number(button.dataset.snap))}));
  document.querySelectorAll('[data-mcb-3d-snap]').forEach(button=>button.addEventListener('click',()=>{stop();setSnap(Number(button.getAttribute('data-mcb-3d-snap')))}));
  if(model3d){
    model3d.addEventListener('load',()=>{
      state.modelReady=true;document.body.setAttribute('data-3d-loaded','true');
      state.nativeAnimation=typeof model3d.play==='function'&&Array.isArray(model3d.availableAnimations)&&model3d.availableAnimations.includes('MCB_TRIPLE_WHEEL_RETURN_10S');
      document.body.dataset.mcb3dMode=state.nativeAnimation?'native-clip':'snap-fallback';
      if(state.nativeAnimation)model3d.animationName='MCB_TRIPLE_WHEEL_RETURN_10S';
      syncModelSnap(state.snap,false);modelPause();
    });
    model3d.addEventListener('error',()=>{set('mcb-3d-state','GLB LOAD ERROR · SOURCE PRESERVED');state.modelReady=false});
    model3d.addEventListener('timeupdate',()=>{if(state.modelPlaying)set('mcb-3d-frame',`FRAME ${fmt(model3d.currentTime||0,2)} s · LIVE`) });
  }
  $('#mcb-3d-play').addEventListener('click',()=>state.nativeAnimation?(state.modelPlaying?modelPause():modelPlay()):togglePlay());
  $('#mcb-3d-reset').addEventListener('click',()=>{
    if(!model3d)return;model3d.cameraOrbit='0deg 12deg 105%';model3d.fieldOfView='auto';
    if(typeof model3d.resetTurntableRotation==='function')model3d.resetTurntableRotation();
    if(typeof model3d.jumpCameraToGoal==='function')model3d.jumpCameraToGoal();
  });
  $('#mcb-3d-orbit').addEventListener('click',()=>{
    state.modelOrbit=!state.modelOrbit;model3d.autoRotate=state.modelOrbit;
    const button=$('#mcb-3d-orbit');button.textContent=`AUTO ORBIT ${state.modelOrbit?'ON':'OFF'}`;button.setAttribute('aria-pressed',String(state.modelOrbit));
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&state.playing)stop()});
  matrix($('#mcb-A1'),M.A1);matrix($('#mcb-A2'),M.A2);matrix($('#mcb-A3'),M.A3);render();syncModelSnap(0,false);
})();
