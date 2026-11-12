(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.A0G9OrionView=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const CLIPS=Object.freeze({
    root:'ROOT_SHRINK_TRAMPOLINE_BREATH',
    museum:'NEXAH_MUSEUM_CYCLE_ORIGINAL_INVERSE_SILO'
  });
  const SIDES=Object.freeze({
    g9:{label:'G9 · HELLBLAU · VIEW FRONT',orbit:'25deg 72deg 108%'},
    counter:{label:'GEGENSEITE · GELB / ROT / WEISS',orbit:'205deg 72deg 108%'}
  });
  function mount(doc){
    const host=doc?.getElementById('g9-orion-rotation');
    if(!host)return null;
    const viewer=host.querySelector('model-viewer'),status=host.querySelector('[data-g9-status]');
    const clipButtons=[...host.querySelectorAll('[data-g9-clip]')],sideButtons=[...host.querySelectorAll('[data-g9-side]')];
    const playButton=host.querySelector('[data-g9-play]'),rotateButton=host.querySelector('[data-g9-rotate]'),resetButton=host.querySelector('[data-g9-reset]');
    let clip='root',side='g9',playing=true,rotating=true;
    const write=(message)=>{if(status)status.textContent=message;};
    const render=()=>{
      host.dataset.g9Side=side;
      clipButtons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.g9Clip===clip)));
      sideButtons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.g9Side===side)));
      if(playButton){playButton.setAttribute('aria-pressed',String(playing));playButton.textContent=playing?'Ⅱ Animation pausieren':'▶ Animation starten';}
      if(rotateButton){rotateButton.setAttribute('aria-pressed',String(rotating));rotateButton.textContent=rotating?'Rotation an':'Rotation aus';}
    };
    const selectClip=(next)=>{
      if(!CLIPS[next])return;
      clip=next;
      viewer.animationName=CLIPS[clip];
      if(playing)viewer.play?.();
      write(CLIPS[clip]+' · '+SIDES[side].label);
      render();
    };
    const selectSide=(next)=>{
      if(!SIDES[next])return;
      side=next;
      viewer.cameraOrbit=SIDES[side].orbit;
      viewer.jumpCameraToGoal?.();
      write(CLIPS[clip]+' · '+SIDES[side].label);
      render();
    };
    clipButtons.forEach(button=>button.addEventListener('click',()=>selectClip(button.dataset.g9Clip)));
    sideButtons.forEach(button=>button.addEventListener('click',()=>selectSide(button.dataset.g9Side)));
    playButton?.addEventListener('click',()=>{playing=!playing;if(playing)viewer.play?.();else viewer.pause?.();render();write((playing?'PLAY · ':'PAUSE · ')+CLIPS[clip]+' · '+SIDES[side].label);});
    rotateButton?.addEventListener('click',()=>{rotating=!rotating;if(rotating)viewer.setAttribute('auto-rotate','');else viewer.removeAttribute('auto-rotate');render();write((rotating?'AUTO ROTATE · ':'FIXED CAMERA · ')+SIDES[side].label);});
    resetButton?.addEventListener('click',()=>{selectSide('g9');selectClip('root');});
    viewer.addEventListener('load',()=>{const names=viewer.availableAnimations||[];write('GLB READY · '+names.length+' CLIPS · '+CLIPS[clip]+' · '+SIDES[side].label);if(playing)viewer.play?.();});
    viewer.addEventListener('error',()=>write('HOLD · GLB NICHT LESBAR · SOURCE LINK BLEIBT VERFÜGBAR'));
    render();
    return{selectClip,selectSide,getState:()=>({clip,side,playing,rotating})};
  }
  return{CLIPS,SIDES,mount};
});
