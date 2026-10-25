(function(){
  'use strict';
  const $=id=>document.getElementById(id),kind=document.body.dataset.worldsKind,isLife=kind==='life',play=$(isLife?'playPause':'play'),loop=$(isLife?'loopPlayback':'loop'),status=$(isLife?'playbackStatus':'runStatus');
  const allowed=isLife?['rooms','boundary','field','register','phase','rosette','cathedral']:['atlas','domains','montage','euler','fibonacci','ihara','k-teller','blue-body'];
  document.body.dataset.embedded=String(parent!==window);document.body.dataset.atlasDensity='compact';
  function running(){return play.textContent==='Pause'}
  function numberText(id){const text=String($(id)?.textContent??''),match=text.match(/-?\d+(?:\.\d+)?/);return match?Number(match[0]):null}
  function generationValue(){return isLife?Number($('generation')?.value):numberText('runStatus')}
  function reading(){if(isLife)return{live:numberText('live'),events:numberText('eventCount'),residual:numberText('residual'),fixture:$('fixture')?.value||null};return{chemistryEvents:numberText('chemistryEvents'),chemistryResidual:numberText('chemistryResidual'),lifeEvents:numberText('lifeEvents'),lifeResidual:numberText('lifeResidual'),physicsEvents:numberText('physicsEvents'),physicsResidual:numberText('physicsResidual'),jointRe:$('jointRe')?.textContent||null,jointIm:$('jointIm')?.textContent||null,kTellerTotal:numberText('kTellerTotal'),iharaState:$('iharaState')?.textContent||null,blueBodyPhase:numberText('blueBodyStepValue')}}
  function pulseReading(){const r=reading();if(!isLife)r.atlasContract=window.ThreeDomainAtlasContractMonitor?.snapshot()||null;return r;}
  function publish(ready=false){if(parent!==window)parent.postMessage({type:'worlds-play-state',ready,kind,running:running(),loop:loop.checked,status:status.textContent,generation:generationValue(),reading:reading()},'*')}
  function change(el,value){el.value=value;el.dispatchEvent(new Event('change',{bubbles:true}))}
  function pause(){if(running())play.click();for(const id of ['crystalRotate','boundaryRotate','boundaryFlow']){const el=$(id);if(el?.getAttribute('aria-pressed')==='true')el.click();}publish()}
  function view(name){if(!allowed.includes(name))return;const repeated=document.body.dataset.stage===name;document.body.dataset.stage=name;
    if(isLife){if(['register','phase','rosette'].includes(name))change($('projectionMode'),{register:'four-plus-one',phase:'phase-register',rosette:'transition-rosette'}[name]);if(name==='boundary')change($('boundaryReading'),'temporal-z');}
    const refit=()=>{window.dispatchEvent(new Event('resize'));if(isLife&&name==='rooms')$('crystalCamera')?.click();if(isLife&&name==='boundary')$('boundaryCamera')?.click();};refit();window.scrollTo(0,0);window.requestAnimationFrame?.(()=>window.requestAnimationFrame?.(()=>{refit();window.dispatchEvent(new CustomEvent('worlds:view-activate',{detail:{name,repeated}}));}));window.setTimeout?.(refit,80);window.setTimeout?.(refit,260);
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
  function installChannelTranslator(){
    if(isLife)return;
    const grid=document.querySelector?.('.transition-montage .montage-grid');if(!grid?.parentNode||typeof document.createElement!=='function'||$('montageJointInspector'))return;
    const workbench=document.createElement('div');workbench.className='montage-workbench';grid.parentNode.insertBefore(workbench,grid);workbench.appendChild(grid);
    const inspector=document.createElement('article');inspector.id='montageJointInspector';inspector.className='montage-joint-inspector';
    inspector.innerHTML='<header><div><span>JOINT TRANSLATOR · 3 × 4 → 1</span><h3>Quellen und vollständiger Joint.</h3></div><b>READOUT · NO FEEDBACK</b></header><svg id="montageJointSvg" viewBox="0 0 700 400" role="img" aria-labelledby="montageJointTitle montageJointDesc"><title id="montageJointTitle">Three-Domain channel-to-joint translator</title><desc id="montageJointDesc">Three separate domain ports each contribute four typed transition channels to one derived arithmetic centroid.</desc><text class="montage-joint-wait" x="350" y="200" text-anchor="middle">WAITING FOR SOURCE RECORD</text></svg><div class="montage-joint-keys"><span class="c00"><b>C₀₀</b> 0→0 · hold</span><span class="c01"><b>C₀₁</b> 0→1 · positive</span><span class="c10"><b>C₁₀</b> 1→0 · pink</span><span class="c11"><b>C₁₁</b> 1→1 · retained</span></div><div class="montage-trace-controls"><label>Quell-Port <select id="montageTraceDomain"><option value="chemistry">Chemistry</option><option value="life">LIFE</option><option value="physics">Physics</option></select></label><label>Übergangskanal <select id="montageTraceChannel"><option value="c00">C₀₀ · 0→0</option><option value="c01">C₀₁ · 0→1</option><option value="c10" selected>C₁₀ · 1→0 · Pink</option><option value="c11">C₁₁ · 1→1</option></select></label></div><div class="montage-proof-grid"><article><small>SELECTED CONTRIBUTION · SOURCE → Z̄</small><pre id="montageTraceReadout">HOLD · kein Quellrecord</pre></article><article class="montage-register-compare"><small>REGISTER COMPARISON · SEPARATE INTEGER RECORD</small><label>Integer <select id="montageIntegerRecord"><option value="1000000000000">1000000000000</option><option value="1000000000001">1000000000001</option></select></label><div role="group" aria-label="Zifferngruppierung"><button type="button" data-register-size="3" aria-pressed="true">3er-Gruppen</button><button type="button" data-register-size="4" aria-pressed="false">4er-Gruppen</button></div><code id="montageRegisterDigits">LOADING EXACT INTEGER MODULE</code><p id="montageRegisterStatus">HOLD · Registermodul lädt</p></article></div><nav class="montage-route-rail" aria-label="Übersetzungsansichten ohne Datenübertragung"><span><b>VIEW ROUTES</b> · SAME SOURCE CONTEXT · NO DATA TRANSFER</span><a href="A0_FIELDS_AND_JOINTS_ATLAS.html#map" target="_blank" rel="noopener"><b>01</b> Domain Graph ↗</a><a href="assets/game-of-worlds-play/numbers/index.html" target="_blank" rel="noopener"><b>02</b> Number Game ↗</a><a href="A0_ORIENTATION_CONTROLLER_BENCH.html#aePaperBoatReturnDut" target="_blank" rel="noopener"><b>03</b> Bench · Joint / Z–77 ↗</a><small><strong>Z̄</strong> = aktueller berechneter Readout. <strong>Z / 77</strong>, vier Quadranten und Sanduhr / Fliege = offene Bench-/Owner-Lesart, kein Operator.</small></nav><p><b>Pink ist ein Kanal, nicht der ganze Joint.</b> Z̄ ist der Mittelwert der drei Port-Phasoren. Die Registergruppierung steht nur daneben; vier Ziffern je Gruppe sind keine vier Übergangskanäle.</p><output id="montageJointStatus" aria-live="polite">HOLD · wartet auf Generation</output>';
    const routeHrefs=['../../../A0_FIELDS_AND_JOINTS_ATLAS.html#map','../numbers/index.html','../../../A0_ORIENTATION_CONTROLLER_BENCH.html#aePaperBoatReturnDut'];
    [...inspector.querySelectorAll('.montage-route-rail a')].forEach((link,index)=>{link.href=new URL(routeHrefs[index],window.location.href).href});
    workbench.appendChild(inspector);
    let latestRecord=null,registerSize=3;
    const complex=value=>`${value.re<0?'−':'+'}${Math.abs(value.re).toFixed(6)} ${value.im<0?'−':'+'}${Math.abs(value.im).toFixed(6)}i`;
    function renderTrace(){
      const out=$('montageTraceReadout'),adapter=window.A0ThreeDomainJointAdapter;if(!out||!latestRecord||!adapter){if(out)out.textContent='HOLD · kein Quellrecord; fehlend ist nicht null';return;}
      const trace=adapter.trace(latestRecord,$('montageTraceDomain').value,$('montageTraceChannel').value),s=trace.selection;
      out.textContent=`SOURCE ${trace.source.path}\ng${trace.source.generation} · ${s.domain} · ${s.label} ${s.transition}\nledger = C00 ${trace.port.ledger.c00} · C01 ${trace.port.ledger.c01} · C10 ${trace.port.ledger.c10} · C11 ${trace.port.ledger.c11}\ncount = ${s.count}${s.zero?' · OBSERVED ZERO':''} · N = ${s.total} · missing = ${s.missing}\nweight = ${s.count}/${trace.normalization.denominator} = ${trace.normalization.ratio}\nselected port contribution = ${complex(trace.port.selectedContribution)}\nport z = ${complex(trace.port.phasor)}\n${trace.joint.ports.map(port=>`z_${port.id} = ${complex(port.phasor)}`).join('\n')}\nZ̄ = (z_chemistry + z_life + z_physics) / 3\nZ̄ = ${complex(trace.joint.result)} · |Z̄| ${trace.joint.result.magnitude.toFixed(6)}\nselected contribution to Z̄ = ${complex(trace.joint.selectedContribution)}\nfeedback = ${trace.joint.feedback}`;
      for(const fibre of $('montageJointSvg').querySelectorAll?.('.pbr-channel-fibre')||[])fibre.classList.toggle('is-selected',fibre.dataset.domain===s.domain&&fibre.dataset.channel===s.channel);
    }
    function renderRegister(){
      const api=window.A0RegisterJanus,digits=$('montageRegisterDigits'),status=$('montageRegisterStatus');if(!digits||!status)return;
      if(!api?.integerRecord){digits.textContent='HOLD · Registermodul fehlt';status.textContent='MISSING MODULE ≠ INTEGER ZERO';return;}
      const jointFingerprint=latestRecord?.fingerprint??null,record=api.integerRecord($('montageIntegerRecord').value),key=registerSize===3?'groups3':'groups4';digits.textContent=record.views[key];
      status.textContent=`RETURN ${record.returnChecks[key]?'PASS':'FAIL'} · ${record.value} · Sprachname: getrennte Ebene / nicht gesetzt · Joint ${latestRecord&&jointFingerprint===latestRecord.fingerprint?'UNCHANGED':'NOT CONNECTED'}`;
      for(const button of inspector.querySelectorAll('[data-register-size]'))button.setAttribute('aria-pressed',String(Number(button.dataset.registerSize)===registerSize));
    }
    for(const id of ['montageTraceDomain','montageTraceChannel'])$(id).addEventListener('change',renderTrace);
    $('montageIntegerRecord').addEventListener('change',renderRegister);for(const button of inspector.querySelectorAll('[data-register-size]'))button.addEventListener('click',()=>{registerSize=Number(button.dataset.registerSize);renderRegister();});
    if(!window.A0RegisterJanus){const script=document.createElement('script');script.src='../../../a0-register-janus.js?rev=20261025-exact-integer-record';script.addEventListener('load',renderRegister);script.addEventListener('error',renderRegister);document.head.append(script);}else renderRegister();
    window.addEventListener('threedomain:render',event=>{
      const svg=$('montageJointSvg'),jointStatus=$('montageJointStatus'),adapter=window.A0ThreeDomainJointAdapter;if(!svg||!jointStatus||!adapter)return;
      const record=adapter.normalize(event.detail,{observedAt:'VIEW_ONLY'});latestRecord=record;svg.innerHTML='<title id="montageJointTitle">Three-Domain channel-to-joint translator</title><desc id="montageJointDesc">Three separate domain ports each contribute four typed transition channels to one derived arithmetic centroid.</desc>'+adapter.svgMarkup(record);renderTrace();renderRegister();
      jointStatus.textContent=`g${record.generation} · Z̄ ${record.joint.re<0?'−':'+'}${Math.abs(record.joint.re).toFixed(3)} ${record.joint.im<0?'−':'+'} ${Math.abs(record.joint.im).toFixed(3)}i · 3 PORTS × 4 CHANNELS`;
    });
    $('threshold')?.dispatchEvent(new Event('input',{bubbles:true}));
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
  const requested=(window.location?.hash||'').slice(1);view(isLife?'rooms':allowed.includes(requested)?requested:'domains');installStandaloneLenses();installAtlasLinks();installChannelTranslator();publish(true);
})();
