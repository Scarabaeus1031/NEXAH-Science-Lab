(function(){
  'use strict';
  const $=id=>document.getElementById(id),kind=document.body.dataset.worldsKind,isLife=kind==='life',play=$(isLife?'playPause':'play'),loop=$(isLife?'loopPlayback':'loop'),status=$(isLife?'playbackStatus':'runStatus');
  const allowed=isLife?['rooms','boundary','field','register','phase','rosette','cathedral']:['atlas','domains','montage','euler','fibonacci','ihara','k-teller','blue-body'];
  document.body.dataset.embedded=String(parent!==window);document.body.dataset.atlasDensity='compact';
  function running(){return play.textContent==='Pause'}
  function numberText(id){const text=String($(id)?.textContent??''),match=text.match(/-?\d+(?:\.\d+)?/);return match?Number(match[0]):null}
  function generationValue(){return isLife?Number($('generation')?.value):numberText('runStatus')}
  function visualFallback(name){if(!isLife||!['rooms','boundary'].includes(name)||!document.createElement)return;const stage=document.querySelector(name==='rooms'?'.crystal-stage':'.boundary-stage'),canvas=$(name==='rooms'?'crystalScene':'boundaryScene');if(!stage||!canvas)return;let fallback=stage.querySelector?.('.world-view-fallback');if(!fallback){fallback=document.createElement('div');fallback.className='world-view-fallback';fallback.innerHTML='<small>LIVE 3D VIEW</small><b></b><span>Quellenansicht · der Weltzustand bleibt erhalten</span>';stage.append(fallback);}fallback.querySelector('b').textContent=name==='rooms'?'Die Räume':'Der Zylinder';stage.dataset.renderer='checking';const probe=()=>{let live=false;try{const gl=canvas.getContext('webgl2')||canvas.getContext('webgl');if(gl&&!gl.isContextLost()){const pixel=new Uint8Array(4),w=gl.drawingBufferWidth,h=gl.drawingBufferHeight;for(const [x,y] of [[.5,.5],[.25,.25],[.75,.25],[.25,.75],[.75,.75],[.5,.2],[.5,.8]]){gl.readPixels(Math.max(0,Math.floor(w*x)),Math.max(0,Math.floor(h*y)),1,1,gl.RGBA,gl.UNSIGNED_BYTE,pixel);if(pixel[0]+pixel[1]+pixel[2]>54){live=true;break;}}}}catch{}stage.dataset.renderer=live?'live':'fallback';};window.setTimeout?.(probe,420);}
  function reading(){if(isLife)return{live:numberText('live'),events:numberText('eventCount'),residual:numberText('residual'),fixture:$('fixture')?.value||null};return{chemistryEvents:numberText('chemistryEvents'),chemistryResidual:numberText('chemistryResidual'),lifeEvents:numberText('lifeEvents'),lifeResidual:numberText('lifeResidual'),physicsEvents:numberText('physicsEvents'),physicsResidual:numberText('physicsResidual'),jointRe:$('jointRe')?.textContent||null,jointIm:$('jointIm')?.textContent||null,kTellerTotal:numberText('kTellerTotal'),iharaState:$('iharaState')?.textContent||null,blueBodyPhase:numberText('blueBodyStepValue')}}
  function pulseReading(){const r=reading();if(!isLife)r.atlasContract=window.ThreeDomainAtlasContractMonitor?.snapshot()||null;return r;}
  function publish(ready=false){if(parent!==window)parent.postMessage({type:'worlds-play-state',ready,kind,running:running(),loop:loop.checked,status:status.textContent,generation:generationValue(),reading:reading()},'*')}
  function change(el,value){el.value=value;el.dispatchEvent(new Event('change',{bubbles:true}))}
  function pause(){if(running())play.click();for(const id of ['crystalRotate','boundaryRotate','boundaryFlow']){const el=$(id);if(el?.getAttribute('aria-pressed')==='true')el.click();}publish()}
  function view(name){if(!allowed.includes(name))return;const repeated=document.body.dataset.stage===name;document.body.dataset.stage=name;
    if(isLife){if(['register','phase','rosette'].includes(name))change($('projectionMode'),{register:'four-plus-one',phase:'phase-register',rosette:'transition-rosette'}[name]);if(name==='boundary')change($('boundaryReading'),'temporal-z');}
    visualFallback(name);window.dispatchEvent(new Event('resize'));window.scrollTo(0,0);window.requestAnimationFrame?.(()=>{window.dispatchEvent(new Event('resize'));if(isLife&&name==='rooms')$('crystalCamera')?.click();if(isLife&&name==='boundary')$('boundaryCamera')?.click();window.dispatchEvent(new CustomEvent('worlds:view-activate',{detail:{name,repeated}}));});
  }
  function installStandaloneLenses(){
    if(parent!==window||isLife)return;
    const labels={atlas:'Atlas · 3×3',domains:'Drei Welten · 3+1',montage:'Channels',euler:'Euler',fibonacci:'Fibonacci',ihara:'Ihara','k-teller':'k·NEG Teller','blue-body':'Blue Body · 48'},nav=document.createElement('nav');nav.className='worlds-local-lenses';nav.setAttribute('aria-label','Lokale Ansicht wählen');
    const select=name=>{view(name);for(const button of nav.querySelectorAll('[data-view]'))button.setAttribute('aria-pressed',String(button.dataset.view===name));densityButton.hidden=name!=='atlas';if(window.location.hash!==`#${name}`)window.location.hash=name};
    for(const name of allowed){const button=document.createElement('button');button.type='button';button.dataset.view=name;button.textContent=labels[name];button.setAttribute('aria-pressed','false');button.addEventListener('click',()=>select(name));nav.append(button)}
    const densityButton=document.createElement('button'),syncDensity=()=>{const compact=document.body.dataset.atlasDensity==='compact';densityButton.textContent=compact?'Atlas · kompakt':'Atlas · groß';densityButton.setAttribute('aria-pressed',String(compact));};densityButton.type='button';densityButton.className='atlas-density';densityButton.setAttribute('aria-label','Größe der Atlas-Übersicht wechseln');densityButton.addEventListener('click',()=>{document.body.dataset.atlasDensity=document.body.dataset.atlasDensity==='compact'?'fit':'compact';syncDensity();window.dispatchEvent(new Event('resize'));});syncDensity();nav.append(densityButton);
    document.body.prepend(nav);const requested=(window.location.hash||'').slice(1);select(allowed.includes(requested)?requested:'domains');
  }
  function installAtlasLinks(){
    if(isLife)return;const targets={chemistry:'domains',life:'domains',physics:'domains',joint:'domains',euler:'euler',fibonacci:'fibonacci',ihara:'ihara','k-teller':'k-teller','blue-body':'blue-body'};
    for(const card of document.querySelectorAll?.('.domain-grid article[data-domain]')||[]){const domain=card.dataset?.domain,target=targets[domain];if(!target)continue;const button=document.createElement('button');button.type='button';button.className='atlas-open';button.textContent='Detail öffnen';button.setAttribute('aria-label',`${card.querySelector?.('h2')?.textContent||domain} als Detailansicht öffnen`);button.addEventListener('click',event=>{event.stopPropagation?.();view(target);if(window.location&&window.location.hash!==`#${target}`)window.location.hash=target});card.append(button)}
  }
  function command(action,value){
    if(action==='hello'){publish(true);return}
    if(action==='pause')pause();
    if(action==='play')play.click();
    if(action==='step')$(isLife?'stepForward':'step').click();
    if(action==='reset')$('reset').click();
    if(action==='seek'&&Number.isInteger(Number(value))){const target=Number(value);if(isLife&&target>=0&&target<=Number($('generation').max)){pause();$('generation').value=String(target);$('generation').dispatchEvent(new Event('input',{bubbles:true}));}if(!isLife&&target>=0&&target<=240){pause();$('reset').click();for(let i=0;i<target;i++)$('step').click();}}
    if(action==='loop'){loop.checked=Boolean(value);loop.dispatchEvent(new Event('change',{bubbles:true}));}
    if(action==='speed'&&['slow','normal','fast'].includes(value))change($('speed'),isLife?{slow:'800',normal:'420',fast:'210'}[value]:{slow:'700',normal:'360',fast:'180'}[value]);
    if(action==='seed'&&isLife&&Array.from($('fixture').options).some(o=>o.value===value))change($('fixture'),value);
    if(action==='view')view(value);
    if(action==='density'&&['compact','fit'].includes(value)){document.body.dataset.atlasDensity=value;window.dispatchEvent(new Event('resize'));}
    if(action==='hood'){document.body.dataset.look=value?'engine':'wonder';window.dispatchEvent(new Event('resize'));window.scrollTo(0,0);}
    if(action==='orbit'&&isLife){const el=$(document.body.dataset.stage==='boundary'?'boundaryRotate':'crystalRotate');if(el&&el.getAttribute('aria-pressed')!==String(Boolean(value)))el.click();}
    publish();
  }
  window.addEventListener('message',event=>{if(event.source!==parent||event.data?.type!=='worlds-play-command')return;command(event.data.action,event.data.value)});
  // Separate ACK protocol for ONE PULSE; legacy single-world controls stay intact.
  const pulseType='a0-one-pulse-source/1';let pulseSession=null,pulseId=0,pulseEpoch=null;
  try{const bytes=new Uint8Array(16);window.crypto.getRandomValues(bytes);pulseEpoch=Array.from(bytes,x=>x.toString(16).padStart(2,'0')).join('');}catch{}
  window.addEventListener('message',event=>{
    const m=event.data;if(event.source!==parent||m?.type!==pulseType||!pulseEpoch||!['life','domains'].includes(kind)||typeof m.session!=='string'||!/^[a-f0-9]{32}$/.test(m.session)||!Number.isSafeInteger(m.id)||m.id<1)return;
    if(m.action==='hello'){pulseSession=m.session;pulseId=0;}
    if(m.session!==pulseSession||m.id<=pulseId||!['hello','read','step','seek'].includes(m.action))return;
    pulseId=m.id;
    try{if(m.action==='step')command('step');else if(m.action==='seek'){if(!Number.isInteger(m.value)||m.value<0||m.value>240)throw Error('INVALID_SEEK');command('seek',m.value);}
      parent.postMessage({type:pulseType,session:pulseSession,id:m.id,epoch:pulseEpoch,kind,status:'ACK',frame:{generation:generationValue(),running:running(),reading:pulseReading()}},'*');
    }catch(_){parent.postMessage({type:pulseType,session:pulseSession,id:m.id,epoch:pulseEpoch,kind,status:'HOLD'},'*');}
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden)pause()});
  new MutationObserver(()=>publish()).observe(status,{childList:true,characterData:true,subtree:true});
  if(isLife){change($('fixture'),'ACORN');$('generation').value=24;$('generation').dispatchEvent(new Event('input',{bubbles:true}));}
  const requested=(window.location?.hash||'').slice(1);view(isLife?'rooms':allowed.includes(requested)?requested:'domains');installStandaloneLenses();installAtlasLinks();publish(true);
})();
