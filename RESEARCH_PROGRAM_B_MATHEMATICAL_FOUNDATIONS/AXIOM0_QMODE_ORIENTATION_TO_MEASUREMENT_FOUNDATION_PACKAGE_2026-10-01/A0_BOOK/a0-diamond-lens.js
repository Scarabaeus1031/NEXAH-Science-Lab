(function(){
  'use strict';
  const root=document.getElementById('diamond-lens');
  if(!root)return;
  root.innerHTML=`
    <header class="diamond-lens__head">
      <div><span class="kicker">00 · live player · same carrier</span><h2 id="diamondLensTitle">Look again.</h2></div>
      <p>Der Player führt automatisch durch fünf Leseflächen. White Dodeca bleibt der Träger; View, Zone, Cloud und Apertur verändern nur das sichtbare Bild.</p>
      <span class="dl-live" id="diamondLiveState"><i></i> LIVE TOUR</span>
    </header>
    <div class="diamond-lens__layout">
      <div class="diamond-lens__stage">
        <svg id="diamondLensSvg" viewBox="0 0 900 620" role="img" aria-labelledby="diamondLensSvgTitle diamondLensSvgDesc">
          <title id="diamondLensSvgTitle">Interaktive Diamond Lens mit fünf lokalen Ansichten</title>
          <desc id="diamondLensSvgDesc">Ein unveränderter weißer Diamond-Carrier wird mit gelber AM-Projektion, grünem Emerald Shadow, pinkem Spektrum, Root-Shell oder einer gespiegelten C- und Z-Plane dargestellt.</desc>
          <defs>
            <radialGradient id="dlSpectrum" cx="50%" cy="50%" r="54%"><stop offset="0" stop-color="#fff7b2"/><stop offset=".13" stop-color="#ffb735"/><stop offset=".28" stop-color="#ff4f89"/><stop offset=".45" stop-color="#b95cff"/><stop offset=".62" stop-color="#41c9ff"/><stop offset=".78" stop-color="#38e1a2"/><stop offset="1" stop-color="#38e1a2" stop-opacity="0"/></radialGradient>
            <linearGradient id="dlRail" x1="0" x2="1"><stop offset="0" stop-color="#43d7f2"/><stop offset=".28" stop-color="#50e3a4"/><stop offset=".52" stop-color="#f7cf4f"/><stop offset=".75" stop-color="#ff74b9"/><stop offset="1" stop-color="#a674ff"/></linearGradient>
            <filter id="dlSoftGlow"><feGaussianBlur stdDeviation="6"/></filter>
          </defs>
          <g class="dl-shell" aria-hidden="true"><ellipse cx="450" cy="320" rx="365" ry="258"/><ellipse cx="450" cy="320" rx="310" ry="218"/><ellipse cx="450" cy="320" rx="256" ry="178"/><ellipse cx="450" cy="320" rx="202" ry="139"/><g class="dl-shell-cells" id="diamondShellCells"></g></g>
          <g class="dl-side-projections" aria-hidden="true"><g transform="translate(98 320)"><circle r="72"/><path d="M-58 0H58M0-58V58"/></g><g transform="translate(802 320)"><circle r="72"/><path d="M-58 0H58M0-58V58"/></g></g>
          <circle class="dl-spectrum-halo" cx="450" cy="320" r="215"/>
          <g class="dl-spectrum-rings" aria-hidden="true"><circle cx="450" cy="320" r="205"/><circle cx="450" cy="320" r="188"/><circle cx="450" cy="320" r="171"/><circle cx="450" cy="320" r="154"/><circle cx="450" cy="320" r="137"/></g>
          <g class="dl-cloud" id="diamondCloud" aria-hidden="true"></g>
          <path class="dl-shadow" d="M336 181 534 150 650 309 555 492 342 469 247 301Z"/>
          <g class="dl-carrier" aria-hidden="true"><path class="dl-carrier-fill" d="M450 117 633 225 603 437 450 526 297 437 267 225Z"/><path class="dl-carrier-edge" d="M450 117 633 225 603 437 450 526 297 437 267 225ZM450 117 450 320 633 225M450 320 603 437M450 320 450 526M450 320 297 437M450 320 267 225Z"/><path class="dl-inner-diamond" d="M450 190 566 320 450 450 334 320Z"/></g>
          <g class="dl-root" aria-hidden="true"><path d="M450 320C389 269 349 251 312 247C353 296 367 338 359 407C403 365 430 350 450 320Z"/><path d="M450 320C511 269 551 251 588 247C547 296 533 338 541 407C497 365 470 350 450 320Z"/><path d="M450 320C419 382 421 425 450 478C479 425 481 382 450 320Z"/></g>
          <g class="dl-twin" aria-hidden="true"><path d="M110 320C205 222 282 212 388 320C282 428 205 418 110 320Z"/><path d="M790 320C695 222 618 212 512 320C618 428 695 418 790 320Z"/><path class="dl-twin-dayline" d="M86 320H814"/><text x="151" y="293">C-PLANE</text><text x="690" y="293">Z-PLANE</text></g>
          <g class="dl-tine" id="diamondTine" transform="rotate(0 450 320)" aria-hidden="true"><path d="M450 315 462 142 450 104 438 142Z"/><circle cx="450" cy="320" r="9"/></g>
          <circle class="dl-aperture" cx="450" cy="320" r="34"/><line class="dl-spectrum-axis" x1="205" y1="320" x2="695" y2="320"/>
          <text class="dl-stage-label" x="32" y="44" id="diamondViewLabel">VM · EMERALD SHADOW</text><text class="dl-stage-note" x="32" y="574" id="diamondZoneLabel">BOUNDARY · carrier edge + shadow cut</text><text class="dl-stage-note end" x="868" y="574">VIEW ONLY · NO SOURCE MUTATION</text>
        </svg>
        <div class="dl-player" aria-label="Diamond Lens Player">
          <button type="button" class="dl-play" id="diamondPlay" aria-pressed="true"><span aria-hidden="true">Ⅱ</span><b>PAUSE</b></button>
          <button type="button" id="diamondPrev" aria-label="Vorherige Ansicht">←</button>
          <div class="dl-timeline" id="diamondTimeline" aria-label="Fünf Ansichten">
            <button type="button" data-dl-scene="0"><small>01</small><b>AM</b></button><button type="button" data-dl-scene="1"><small>02</small><b>VM</b></button><button type="button" data-dl-scene="2"><small>03</small><b>PM</b></button><button type="button" data-dl-scene="3"><small>04</small><b>ROOT</b></button><button type="button" data-dl-scene="4"><small>05</small><b>TWIN</b></button>
          </div>
          <button type="button" id="diamondNext" aria-label="Nächste Ansicht">→</button>
          <output id="diamondPlayerCount">02 / 05</output>
        </div>
      </div>
      <aside class="diamond-lens__controls" aria-label="Diamond Lens Steuerung">
        <fieldset><legend>Ansicht / Platte</legend><div class="dl-segmented" id="diamondViewControls">
          <button type="button" data-dl-view="am" aria-pressed="false"><b>AM</b><span>Yellow View</span></button><button type="button" data-dl-view="vm" aria-pressed="true"><b>VM</b><span>Emerald Shadow</span></button><button type="button" data-dl-view="pm" aria-pressed="false"><b>PM</b><span>Pink / Spectrum</span></button><button type="button" data-dl-view="root" aria-pressed="false"><b>ROOT</b><span>Boundary Shell</span></button><button type="button" data-dl-view="twin" aria-pressed="false"><b>EVIL TWIN</b><span>C / Z mirror</span></button>
        </div></fieldset>
        <fieldset><legend>Leseraum</legend><div class="dl-segmented compact" id="diamondZoneControls"><button type="button" data-dl-zone="interior" aria-pressed="false">Interior</button><button type="button" data-dl-zone="boundary" aria-pressed="true">Boundary</button><button type="button" data-dl-zone="exterior" aria-pressed="false">Exterior</button></div></fieldset>
        <fieldset><legend>Cloud preset</legend><div class="dl-segmented compact" id="diamondCloudControls"><button type="button" data-dl-cloud="l" aria-pressed="false">L</button><button type="button" data-dl-cloud="s" aria-pressed="true">S</button><button type="button" data-dl-cloud="d" aria-pressed="false">D</button></div><small>L / S / D bleiben lokale Darstellungs-Presets ohne kanonische Ausdeutung.</small></fieldset>
        <label class="dl-range" for="diamondTineAngle"><span>Black tine / aperture cut <output id="diamondTineAngleOut">0°</output></span><input id="diamondTineAngle" type="range" min="-90" max="90" step="1" value="0"></label>
        <div class="dl-layer-switches"><label><input id="diamondShadowToggle" type="checkbox" checked> Emerald Shadow</label><label><input id="diamondSpectrumToggle" type="checkbox" checked> Rainbow Spectrum</label><label><input id="diamondShellToggle" type="checkbox"> Root / Shell</label></div>
        <output class="dl-readout" id="diamondLensReadout" aria-live="polite">VM · Boundary · Cloud S · Shadow + Spectrum</output>
        <p class="dl-boundary"><b>BOUNDARY:</b> Rekonstruktion belegter Ansichtsmerkmale aus Referenzvisuals. Kein neuer Fraktaloperator und keine behauptete AM/VM/PM-Kopplungsmechanik.</p>
        <div class="dl-sources"><span>Q-Mirror source hash · 3119f251…24ada4</span><span>Root/Shell reference hash · ac3bffae…a7475</span><span>Evil-Twin reference · local owner visual</span></div>
      </aside>
    </div>
    <div class="dl-how" aria-label="So funktioniert die Diamond Lens"><span><small>01 · HOLD</small><b>Carrier bleibt</b></span><i>→</i><span><small>02 · CHANGE</small><b>Ansicht wechselt</b></span><i>→</i><span><small>03 · LOOK</small><b>Muster erscheint</b></span><nav><a href="A0_NEXAH_APERTURE_JOURNEY.html#look-again-room">← HUMAN VIEW</a><a href="A0_LOOK_AGAIN_PLAY.html">LOOK AGAIN SPIELEN ↗</a><a href="#crt16-tile">GRID-WERKZEUG ↓</a></nav></div>`;

  const labels={am:'AM · YELLOW VIEW',vm:'VM · EMERALD SHADOW',pm:'PM · RAINBOW SPECTRUM',root:'ROOT · BOUNDARY SHELL',twin:'EVIL TWIN · C / Z MIRROR'};
  const zoneLabels={interior:'INTERIOR · carrier core',boundary:'BOUNDARY · carrier edge + shadow cut',exterior:'EXTERIOR · shell + projected field'};
  const state={view:'vm',zone:'boundary',cloud:'s',angle:0};
  const scenes=[
    {view:'am',zone:'interior',cloud:'l',angle:-42,shadow:false,spectrum:true,shell:false},
    {view:'vm',zone:'boundary',cloud:'s',angle:-18,shadow:true,spectrum:false,shell:false},
    {view:'pm',zone:'boundary',cloud:'d',angle:0,shadow:false,spectrum:true,shell:false},
    {view:'root',zone:'exterior',cloud:'s',angle:42,shadow:true,spectrum:true,shell:true},
    {view:'twin',zone:'exterior',cloud:'d',angle:70,shadow:true,spectrum:true,shell:true}
  ];
  const params=new URLSearchParams(location.search);
  const humanMode=params.get('origin')==='human';
  const reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let sceneIndex=1,playing=!reduced,timer=0;
  const q=s=>root.querySelector(s),qa=s=>Array.from(root.querySelectorAll(s));
  const cloud=q('#diamondCloud'),cells=q('#diamondShellCells');
  const makeSvg=(name,attrs)=>{const n=document.createElementNS('http://www.w3.org/2000/svg',name);Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,v));return n};
  for(let ring=0;ring<4;ring++)for(let i=0;i<28;i++){const a=i/28*Math.PI*2,r=205+ring*23,x=450+Math.cos(a)*r,y=320+Math.sin(a)*r*.7;const p=makeSvg('path',{d:`M${x.toFixed(1)} ${y.toFixed(1)}l${(Math.cos(a+.45)*12).toFixed(1)} ${(Math.sin(a+.45)*9).toFixed(1)}`});cells.appendChild(p)}
  function drawCloud(){cloud.replaceChildren();const count=state.cloud==='l'?18:state.cloud==='s'?36:62;for(let i=0;i<count;i++){const a=i/count*Math.PI*2+(state.cloud==='d'?i*.13:0),r=state.cloud==='l'?245:state.cloud==='s'?218+(i%3)*20:180+(i%7)*17;const x=450+Math.cos(a)*r,y=320+Math.sin(a)*r*.68,rad=state.cloud==='d'?2+(i%4):3+(i%3)*2;cloud.appendChild(makeSvg('circle',{cx:x.toFixed(1),cy:y.toFixed(1),r:rad}))}}
  function sync(){root.dataset.view=state.view;root.dataset.zone=state.zone;root.dataset.cloud=state.cloud;qa('[data-dl-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.dlView===state.view)));qa('[data-dl-zone]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.dlZone===state.zone)));qa('[data-dl-cloud]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.dlCloud===state.cloud)));qa('[data-dl-scene]').forEach(b=>b.setAttribute('aria-current',String(Number(b.dataset.dlScene)===sceneIndex)));q('#diamondViewLabel').textContent=labels[state.view];q('#diamondZoneLabel').textContent=zoneLabels[state.zone];q('#diamondTine').setAttribute('transform',`rotate(${state.angle} 450 320)`);q('#diamondTineAngleOut').textContent=`${state.angle}°`;q('#diamondTineAngle').value=state.angle;root.classList.toggle('no-shadow',!q('#diamondShadowToggle').checked);root.classList.toggle('no-spectrum',!q('#diamondSpectrumToggle').checked);root.classList.toggle('no-shell',!q('#diamondShellToggle').checked&&state.view!=='root');const layers=[q('#diamondShadowToggle').checked?'Shadow':'',q('#diamondSpectrumToggle').checked?'Spectrum':'',q('#diamondShellToggle').checked||state.view==='root'?'Shell':''].filter(Boolean).join(' + ')||'Carrier only';q('#diamondLensReadout').textContent=`${labels[state.view]} · ${state.zone.toUpperCase()} · CLOUD ${state.cloud.toUpperCase()} · ${layers}`;q('#diamondPlayerCount').textContent=`${String(sceneIndex+1).padStart(2,'0')} / 05`;drawCloud()}
  function applyScene(index){sceneIndex=(index+scenes.length)%scenes.length;const scene=scenes[sceneIndex];Object.assign(state,{view:scene.view,zone:scene.zone,cloud:scene.cloud,angle:scene.angle});q('#diamondShadowToggle').checked=scene.shadow;q('#diamondSpectrumToggle').checked=scene.spectrum;q('#diamondShellToggle').checked=scene.shell;root.classList.remove('scene-flash');void root.offsetWidth;root.classList.add('scene-flash');sync()}
  function setPlaying(next){playing=next&&!reduced;clearInterval(timer);timer=0;q('#diamondPlay').setAttribute('aria-pressed',String(playing));q('#diamondPlay').innerHTML=playing?'<span aria-hidden="true">Ⅱ</span><b>PAUSE</b>':'<span aria-hidden="true">▶</span><b>PLAY</b>';q('#diamondLiveState').innerHTML=playing?'<i></i> LIVE TOUR':'<i></i> MANUAL';root.classList.toggle('is-playing',playing);if(playing)timer=window.setInterval(()=>applyScene(sceneIndex+1),2100)}
  q('#diamondViewControls').addEventListener('click',e=>{const b=e.target.closest('[data-dl-view]');if(!b)return;sceneIndex=Math.max(0,scenes.findIndex(scene=>scene.view===b.dataset.dlView));applyScene(sceneIndex)});
  q('#diamondZoneControls').addEventListener('click',e=>{const b=e.target.closest('[data-dl-zone]');if(!b)return;state.zone=b.dataset.dlZone;sync()});
  q('#diamondCloudControls').addEventListener('click',e=>{const b=e.target.closest('[data-dl-cloud]');if(!b)return;state.cloud=b.dataset.dlCloud;sync()});
  q('#diamondTineAngle').addEventListener('input',e=>{state.angle=Number(e.target.value);sync()});
  ['#diamondShadowToggle','#diamondSpectrumToggle','#diamondShellToggle'].forEach(sel=>q(sel).addEventListener('change',sync));
  q('#diamondPlay').addEventListener('click',()=>setPlaying(!playing));
  q('#diamondPrev').addEventListener('click',()=>applyScene(sceneIndex-1));
  q('#diamondNext').addEventListener('click',()=>applyScene(sceneIndex+1));
  q('#diamondTimeline').addEventListener('click',e=>{const b=e.target.closest('[data-dl-scene]');if(b)applyScene(Number(b.dataset.dlScene))});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){clearInterval(timer);timer=0}else if(playing)setPlaying(true)});
  if(humanMode){
    document.documentElement.classList.add('diamond-consumer');
    document.body.classList.add('diamond-consumer');
    root.classList.add('from-human');
    root.dataset.mode='watch';
    const close=document.createElement('a');
    close.className='diamond-consumer-close';
    close.href='A0_NEXAH_APERTURE_JOURNEY.html#look-again-room';
    close.setAttribute('aria-label','Diamond Lens schließen und zur Human View zurückkehren');
    close.textContent='×';
    document.body.append(close);
  }
  applyScene(humanMode?0:1);
  setPlaying(params.get('play')!=='0');
})();
