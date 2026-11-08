(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.A0PascalJointRoulette3=api;
  if(typeof document!=='undefined'){
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',api.mount,{once:true});
    else api.mount();
  }
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const BASE_TICKS=40;
  const LEDGER_MICROTICKS=120;
  const LEDGER_DEGREES=3;
  const TIER_LABELS=['N','NP','NLK'];
  const OUTER_ROLE_LABELS=['RDM','TKR','PTHO'];
  const WHEELS=[
    {id:'N',tier:'N',slots:10,direction:1,colour:'#f0b52b'},
    {id:'NP-RL',tier:'NP',slots:20,direction:1,colour:'#f02f8b'},
    {id:'NP-LR',tier:'NP',slots:20,direction:-1,colour:'#25d6e7'},
    {id:'RDM',tier:'NLK',slots:40,direction:1,colour:'#ff6b62'},
    {id:'TKR',tier:'NLK',slots:40,direction:-1,colour:'#64df9b'},
    {id:'PTHO',tier:'NLK',slots:40,direction:1,colour:'#8f7cff'}
  ];
  const VIEW_MODES=['WHEELS','RAILS','ZIGZAG','TRANSPOSE','LEDGER','LANTERN','CUBE'];
  const RAIL_SEQUENCE=[23,24,25];
  const TRANSITION_PAIR=[78,32];
  const TRANSPOSE_RINGS=[.238235,.385473,.473861,.572925,.704294,.766723,.927011,1.139572];
  const PHI_TUBES=[[1,2],[3,6],[4,7],[5,8]];
  const FOLD_STATES=['OPEN','RL','LR'];
  const PENTAGON_A=[0,2,4,6,8];
  const PENTAGON_B=[1,3,5,7,9];
  const ANTIPODAL_JOINTS=[[0,5],[1,6],[2,7],[3,8],[4,9]];
  const PORTAL_COUNT=8;
  const LANTERN_CARRIER_STATES=['A','T','Y'];
  const JUKEBOX_RECORDS=[23,24,25,26];
  const JUKEBOX_BEAT=['DA','DA','DA','DÆ','Ō'];
  const JUKEBOX_NOTES=[392,392,392,311.13,261.63];
  const PENTA_MAGNET_COUNT=5;
  const PENTA_MAGNET_DIRECTION=333;
  const DEEP_BLUE_LOGICAL_WIDTH=760;
  const DEEP_BLUE_LOGICAL_HEIGHT=480;
  const FRAME_SHIP_NODE_COUNT=7;
  const FRAME_SHIP_DIRECTIONS=['HOME','HECHT','Z_FACED'];
  const AQUARIUM_MODES=['HOME','ORCA','PINGUIN','DUET'];
  const AQUARIUM_CENTRE=['BLUE_WHALE','SQUID','NAUTILUS','33+1'];
  const ZIGZAG_ROUTE=[
    {label:'ALPHA',value:31},{label:'P',value:33},{label:'GATE',value:52},
    {label:'P',value:33},{label:'BETA',value:35},{label:'P',value:33},
    {label:'T',value:78},{label:'TRANSIT',value:32},{label:'ALEPH · RETURN',value:null}
  ];
  const mod=(value,base)=>((Number(value)%base)+base)%base;
  const createState=(tick=0)=>({tick:mod(tick,BASE_TICKS),absoluteTick:Number(tick)||0,running:false});
  const address=(wheel,tick)=>{
    const spec=typeof wheel==='string'?WHEELS.find(item=>item.id===wheel):wheel;
    if(!spec)throw new RangeError('unknown wheel');
    const step=BASE_TICKS/spec.slots;
    return mod(spec.direction*Math.floor(mod(tick,BASE_TICKS)/step),spec.slots);
  };
  const phaseDegrees=(wheel,tick)=>{
    const spec=typeof wheel==='string'?WHEELS.find(item=>item.id===wheel):wheel;
    if(!spec)throw new RangeError('unknown wheel');
    return spec.direction*mod(tick,BASE_TICKS)*360/BASE_TICKS;
  };
  const advance=(state,delta=1)=>createState(Number(state.absoluteTick||0)+Number(delta||0));
  const returnHome=()=>createState(0);
  const isHome=state=>mod(state.tick,BASE_TICKS)===0;
  const residualFan=tick=>{
    const separation=mod(2*mod(tick,BASE_TICKS),BASE_TICKS);
    return Math.min(separation,BASE_TICKS-separation);
  };
  const microtickRecord=value=>{
    const microtick=mod(value,LEDGER_MICROTICKS),rouletteExact=microtick%3===0,spokeExact=microtick%4===0,jointExact=microtick%12===0;
    return {microtick,angle:microtick*LEDGER_DEGREES,rouletteExact,rouletteTick:rouletteExact?microtick/3:null,spokeExact,spoke:spokeExact?microtick/4:null,jointExact,joint:jointExact?microtick/12:null};
  };
  const ledger=()=>Array.from({length:LEDGER_MICROTICKS},(_,microtick)=>microtickRecord(microtick));
  const contract=()=>({
    commonCycle:BASE_TICKS,
    tiers:[{label:'N',wheelCount:1,slots:10},{label:'NP',wheelCount:2,slots:20},{label:'NLK',wheelCount:3,slots:40,roles:[...OUTER_ROLE_LABELS]}],
    resolutionRatio:'4:3',
    resolutionMeaning:'four shared microticks across three declared tiers',
    coupledStateCount:BASE_TICKS,
    oneWheelIndependentProduct:10*20*40,
    localLabelsOnly:[...TIER_LABELS,...OUTER_ROLE_LABELS,'Alpha','Aleph','Le Jeu du Liz'],
    railView:{sequence:[...RAIL_SEQUENCE],centralJoint:33,gate:52,anchor:26,transitionPair:[...TRANSITION_PAIR]},
    zigzagView:ZIGZAG_ROUTE.map(node=>({...node})),
    viewModes:[...VIEW_MODES],
    transposeView:{spokes:30,rings:8,rootCarrier:240,ringValues:[...TRANSPOSE_RINGS],phiTubes:PHI_TUBES.map(pair=>[...pair]),mapping:'nearest 12-degree spoke to shared 9-degree forty-tick phase',identityEffect:'reference projection only; no E8 or operator identity merge'},
    microtickLedger:{microticks:LEDGER_MICROTICKS,degreesPerMicrotick:LEDGER_DEGREES,rouletteStride:3,spokeStride:4,jointStride:12,rouletteMarks:40,spokeMarks:30,jointMarks:10,unionMarks:60,foldStates:[...FOLD_STATES],mapping:'exact finite incidence ledger; 40-tick and 30-spoke registers remain distinct',identityEffect:'display adapter only; no new operator, Book identity or physical coupling'},
    lanternView:{exactJoints:10,pentagonA:[...PENTAGON_A],pentagonB:[...PENTAGON_B],pentagonStepDegrees:72,offsetDegrees:36,antipodalJoints:ANTIPODAL_JOINTS.map(pair=>[...pair]),portalCount:PORTAL_COUNT,braidPairs:PHI_TUBES.map(pair=>[...pair]),carrierStates:[...LANTERN_CARRIER_STATES],orientations:[0,90],pivot:'29.02 · X',crystalRole:'R\u2032 · LOCAL VIEW ROLE',interaction:'A/T/Y carrier focus; 0/90 degree carrier rotation; 120-step scrub; selectable portals; braid and Red Balloon visibility toggles',openMnemonics:['A↔Y · ARYAN?','A↔T · ATREUS?'],projectionRoles:['alpha angle view','tan tangent view'],mapping:'two C5 display sheets over the exact ten-joint ledger',identityEffect:'source-bound comparison view only; ARYAN and ATREUS remain open local mnemonics; alpha and tan are display roles; no Lantern, Ledger, Book or Crystal identity merge and no physical portal, hourglass, Lissajous, resonance or mechanism claim'},
    cubeView:{samples:240,displayFrequencies:[3,4,5],cornerPortals:8,referenceSectors:12,planes:['A','T','Y'],seams:['A∩T','T∩Y','Y∩A'],tripleJoint:'R′ · 29.02 · X',sphereShell:{outline:1,meridians:4,latitudeRings:['CANCER LINE','EQ · UATOR / EQ · LIZER','RETURN LATITUDE'],equatorRole:'middle display equalization seam'},jukebox:{records:[...JUKEBOX_RECORDS],needle:true,nexus:'23→24→25→26→NEX·US',foldStates:[...FOLD_STATES],beat:[...JUKEBOX_BEAT],synthNotes:[...JUKEBOX_NOTES],interaction:'PLAY moves the yellow tone arm and record cursor; JUKE SOUND enables a local five-pulse Web Audio mnemonic; DANCE adds finite smear trails at the NEX·US fold'},worldFractalLens:{continentPatches:6,worldRole:'stylized orientation overlay inside the existing sphere shell',mandelbrotRole:'left C-plane display eye',juliaRole:'right Z-plane display eye for one selected shared c',sharedParameter:'c only',ownerMnemonic:'MA · }(BMW | BMX){ · Φ = LOKI’S TRIXS KIẞTE?',interaction:'WORLD MAP and I|J toggles preserve separate projection layers',identityEffect:'reuses the existing Rubik QDC fractal I/J split as a display cross-reference only; no Earth, Rosetta, St. Thomas, BMW, BMX, Loki, phi, Mandelbrot or Julia identity merge'},pentaMagnetView:{starLines:PENTA_MAGNET_COUNT,corners:PENTA_MAGNET_COUNT,squares:PENTA_MAGNET_COUNT,directionDegrees:PENTA_MAGNET_DIRECTION,addressCue:'11→23',crescent:true,role:'large gameplay orientation attractor',identityEffect:'reuses the existing Pascal Pentagon D5 and DIRECT-ZETA 333-degree display references only; magnet and crescent are local view roles, not a physical field, force or new operator'},mapping:'isometric projection of two finite display paths through three orthogonal carrier planes inside a transparent sphere shell in the existing World Cube host',identityEffect:'seventh projection of the existing Roulette cubed adapter only; planes, seams, sphere, latitude, equator, Juke Box, records, needle, NEX US, world patches, Penta Magnet, crescent and beat are local display or interaction roles; the optional sound is a browser-synthesized mnemonic, not a recording or evidence source; Mandelbrot and Julia retain distinct C-plane and Z-plane roles linked only by selected c; no Lissajous mechanism, resonance space, Earth map identity, fractal mechanism, zodiac, astronomical, biological, Möbius, breathing, magnetic force or physical field identity'}
    ,deepBlueMode:{logicalSize:[DEEP_BLUE_LOGICAL_WIDTH,DEEP_BLUE_LOGICAL_HEIGHT],carrier:'existing World Cube',frameRole:'heavy outer carrier display',fieldRole:'delayed deep-blue inner field',splitCue:'7 · SPLIT / CRACK',return:'exact visual HOME',controls:['WOBBLE','7 · SPLIT','RETURN','STRENGTH'],identityEffect:'local display mode only; no second Cube identity, physical ocean, earthquake, fracture or material-mechanics claim'}
    ,frameShipMode:{logicalSize:[DEEP_BLUE_LOGICAL_WIDTH,DEEP_BLUE_LOGICAL_HEIGHT],carrier:'existing World Cube',frameRoles:['ship','lantern','cube corner'],heptagonNodes:FRAME_SHIP_NODE_COUNT,directions:[...FRAME_SHIP_DIRECTIONS],spearRole:'long carrier and keel axis',arrowRole:'short current direction vector',counterfaces:['HECHT','Z-FACED FISH HEAD'],return:'exact visual HOME',controls:['HECHT','Z-FACED','GLIDE','RETURN'],identityEffect:'local counterface display only; no second Cube, vessel, weapon, animal, biological species, navigation mechanism or physical propulsion identity'}
    ,aquariumMode:{logicalSize:[DEEP_BLUE_LOGICAL_WIDTH,DEEP_BLUE_LOGICAL_HEIGHT],carrier:'existing World Cube',modes:[...AQUARIUM_MODES],pendulumRoles:{orca:'large slow display swing',pinguin:'smaller counter-swing'},centreRoles:[...AQUARIUM_CENTRE],nautilusRole:'spiral chamber trace around the open aperture',aperture:'33 + 1 · ATEM / KOPF',pivot:'shared display pivot',return:'exact visual HOME',controls:['ORCA','PINGUIN','DUET','RETURN'],identityEffect:'local motion and image language only; no animal, mollusc, biological species, aquarium, fluid, breathing, head, gravity, frequency, coupled-pendulum, growth-law, logarithmic-spiral or physical dynamics identity'}
  });

  const svgEl=(name,attrs={})=>{
    const node=document.createElementNS('http://www.w3.org/2000/svg',name);
    Object.entries(attrs).forEach(([key,value])=>node.setAttribute(key,String(value)));
    return node;
  };
  const polar=(cx,cy,r,degrees)=>({x:cx+Math.cos((degrees-90)*Math.PI/180)*r,y:cy+Math.sin((degrees-90)*Math.PI/180)*r});
  const arcPath=(cx,cy,r,start,end)=>{
    const a=polar(cx,cy,r,end),b=polar(cx,cy,r,start);
    return `M ${a.x} ${a.y} A ${r} ${r} 0 ${end-start<=180?0:1} 0 ${b.x} ${b.y}`;
  };
  const createHost=()=>{
    const anchor=document.getElementById('pascalJointBookFold')||document.getElementById('pascalJointLoop');
    if(!anchor)return null;
    const section=document.createElement('section');
    section.id='pascalJointRoulette3';
    section.className='pjr3';
    section.setAttribute('aria-labelledby','pjr3Title');
    section.innerHTML=`<header class="pjr3-head"><div><span class="eyebrow">ROULETTE³ · COUNTER-ROTATION · 10/20/40</span><h4 id="pjr3Title">N → NP → NLK · wheels, rails, zigzag, transpose and 120-ledger</h4><p>Six visual wheels share one forty-tick phase. TRANSPOSE compares it with thirty spokes; LEDGER resolves both registers on one exact 120-step, 3° basis.</p></div><code data-pjr3-record>HOME · τ=00/40 · RESIDUAL 00</code></header><div class="pjr3-grid"><div class="pjr3-stage"><svg viewBox="0 0 760 640" role="img" aria-labelledby="pjr3SvgTitle pjr3SvgDesc"><title id="pjr3SvgTitle">Roulette cubed counter-rotation, rail, zigzag, transposed spoke and microtick ledger instrument</title><desc id="pjr3SvgDesc">The forty-tick wheel and thirty-spoke reference remain distinct registers. A 120-microtick ledger marks their exact incidences and keeps the Open, RL and LR book-fold display register separate.</desc><g data-pjr3-static></g><g data-pjr3-dynamic></g></svg><div class="pjr3-caption"><b data-pjr3-readout="state">EXACT HOME</b><span data-pjr3-readout="addresses">N 0 · NP 0/0 · NLK 0/0/0</span></div></div><aside class="pjr3-panel"><div class="pjr3-stats"><div><small>N</small><b>1 × 10</b></div><div><small>NP</small><b>2 × 20</b></div><div><small>NLK</small><b>3 × 40</b></div><div><small>RETURN</small><b>40 TICKS</b></div></div><div class="pjr3-controls" role="group" aria-label="Roulette cubed phase controls"><button type="button" data-pjr3-action="BACK">−1</button><button type="button" data-pjr3-action="PLAY" aria-pressed="false">PLAY</button><button type="button" data-pjr3-action="NEXT">+1</button><button type="button" data-pjr3-action="RETURN">RETURN</button></div><div class="pjr3-views" role="group" aria-label="Roulette cubed visualization"><button type="button" data-pjr3-view="WHEELS" aria-pressed="true">WHEELS</button><button type="button" data-pjr3-view="RAILS" aria-pressed="false">RAILS</button><button type="button" data-pjr3-view="ZIGZAG" aria-pressed="false">ZIGZAG</button><button type="button" data-pjr3-view="TRANSPOSE" aria-pressed="false">TRANSPOSE</button><button type="button" data-pjr3-view="LEDGER" aria-pressed="false">120 LEDGER</button></div><div class="pjr3-ledger-controls" data-pjr3-ledger-controls hidden><button type="button" data-pjr3-micro="BACK">μ−1</button><button type="button" data-pjr3-fold="OPEN" aria-pressed="true">OPEN</button><button type="button" data-pjr3-fold="RL" aria-pressed="false">RL</button><button type="button" data-pjr3-fold="LR" aria-pressed="false">LR</button><button type="button" data-pjr3-micro="NEXT">μ+1</button></div><div class="pjr3-register"><small>COUPLED PHASE REGISTER</small><code data-pjr3-readout="tick">τ 00 / 40</code><code data-pjr3-readout="n">N · 00/10</code><code data-pjr3-readout="np">NP · RL 00/20 · LR 00/20</code><code data-pjr3-readout="nlk">NLK · RDM 00 · TKR 00 · PTHO 00</code><code data-pjr3-readout="fan">RED BALLOON FAN · 00/20</code><code data-pjr3-readout="rail">VIEW · WHEELS</code></div><div class="pjr3-contract"><b>120 MICRO-TICK LEDGER</b><span><code>120 × 3°</code> · τ stride <code>3</code> · spoke stride <code>4</code> · exact joint stride <code>12</code>.</span><span><code>10</code> exact joints per turn. OPEN/RL/LR is a separate Book-Fold display register.</span></div><p><b>Boundary:</b> N, NP, NLK, RDM, TKR, PTHO, Alpha, Aleph and “Le Jeu du Liz” are local owner/view labels. TRANSPOSE and LEDGER reuse bounded reference grids; they do not identify Roulette³ with E8, import an E8 operator, merge the Book identity, or assert frequency, resonance, language, gambling, sound or gear mechanics.</p></aside></div></section>`;
    section.querySelector('#pjr3Title').textContent='N → NP → NLK · wheels, rails, zigzag, transpose, ledger, lantern and cube';
    section.querySelector('.pjr3-head p').textContent='Six visual wheels share one forty-tick phase. TRANSPOSE compares thirty spokes; LEDGER resolves both registers; LANTERN folds the ten exact joints; CUBE projects A/T/Y planes, seams and the finite counterweave.';
    section.querySelector('[data-pjr3-view="LEDGER"]').insertAdjacentHTML('afterend','<button type="button" data-pjr3-view="LANTERN" aria-pressed="false">LANTERN</button>');
    section.querySelector('[data-pjr3-view="LANTERN"]').insertAdjacentHTML('afterend','<button type="button" data-pjr3-view="CUBE" aria-pressed="false">CUBE</button>');
    section.querySelector('[data-pjr3-ledger-controls]').insertAdjacentHTML('afterend','<div class="pjr3-lantern-controls" data-pjr3-lantern-controls hidden><button type="button" data-pjr3-carrier="A" aria-pressed="true">A · YELLOW</button><button type="button" data-pjr3-carrier="T" aria-pressed="false">T · BLUE</button><button type="button" data-pjr3-carrier="Y" aria-pressed="false">Y · JOINT</button><button type="button" data-pjr3-lantern-toggle="ROTATE" aria-pressed="false">ROT · 0°</button><button type="button" data-pjr3-lantern-toggle="WEAVE" aria-pressed="true">ZOPF</button><button type="button" data-pjr3-lantern-toggle="BALLOON" aria-pressed="true">RED BALLOON</button><label>μ PHASE <input type="range" min="0" max="119" step="1" value="0" data-pjr3-lantern-phase aria-label="Lantern microtick phase"></label></div>');
    section.querySelector('[data-pjr3-lantern-phase]').closest('label').insertAdjacentHTML('beforebegin','<button type="button" data-pjr3-lantern-toggle="DANCE" aria-pressed="true">DANCE · ON</button><button type="button" data-pjr3-lantern-toggle="SOUND" aria-pressed="false">JUKE SOUND · OFF</button><button type="button" data-pjr3-lantern-toggle="WORLD" aria-pressed="true">WORLD MAP · ON</button><button type="button" data-pjr3-lantern-toggle="FRACTAL" aria-pressed="true">I | J · ON</button><button type="button" data-pjr3-lantern-toggle="MAGNET" aria-pressed="true">PENTA MAGNET · ON</button><button type="button" data-pjr3-lantern-toggle="CRESCENT" aria-pressed="true">SICHEL · 333°</button>');
    section.querySelector('.pjr3-contract').innerHTML='<b>SPHERE CUBE · JUKE BOX · WORLD / I|J · PENTA MAGNET</b><span><code>23 → 24 → 25 → 26 → NEX·US</code> · moving tone arm, needle and fold register.</span><span><code>PENTA MAGNET</code> exposes 5 lines, 5 corners and 5 squares; <code>SICHEL</code> holds <code>11→23 / 333°</code>.</span><span><code>WORLD MAP</code> adds six stylized continent patches; <code>M | J</code> keeps C-plane and Z-plane distinct.</span>';
    section.querySelector('.pjr3-panel > p').innerHTML='<b>Boundary:</b> Penta Magnet and Sichel are local gameplay/orientation roles. They reuse Pascal-Pentagon/D5 and DIRECT-ZETA 333° display references but assert no magnetic force, physical field or new operator. Juke Box, World, MA/BMW/BMX, Φ, Loki’s Trixs Kißte and DA/DÆ/Ō remain owner/view labels; Mandelbrot and Julia remain separate C- and Z-plane displays.';
    section.insertAdjacentHTML('beforeend',`<section class="pjr3-deep" data-pjr3-deep-mode="HOME" aria-labelledby="pjr3DeepTitle" style="--deep-shift:3.8px;--deep-angle:.48deg;--deep-field-shift:2.5px;--deep-split:3.2px"><header><div><span class="eyebrow">MODE 08 · SAME CARRIER · BELOW THE CUBE</span><h5 id="pjr3DeepTitle">DEEP BLUE · WOBBLE / CRACK</h5><p>Heavy frame, delayed blue field and one controlled seven-shaped seam. The display may hover, split and return; the carrier identity remains unchanged.</p></div><code data-pjr3-deep-status>EXACT HOME · Δ0</code></header><div class="pjr3-deep-grid"><div class="pjr3-deep-stage"><svg viewBox="0 0 760 480" role="img" aria-labelledby="pjr3DeepSvgTitle pjr3DeepSvgDesc"><title id="pjr3DeepSvgTitle">Deep Blue wobble and seven split display mode</title><desc id="pjr3DeepSvgDesc">The existing World Cube is shown as a heavy frame around a delayed blue field. A controlled seven-shaped seam opens only in split mode and closes exactly at return.</desc><defs><clipPath id="pjr3DeepLeftClip"><rect x="96" y="70" width="284" height="350"/></clipPath><clipPath id="pjr3DeepRightClip"><rect x="380" y="70" width="284" height="350"/></clipPath></defs><g class="pjr3-deep-halo"><ellipse cx="380" cy="408" rx="254" ry="24"/></g><g class="pjr3-deep-frame"><path class="pjr3-deep-frame-back" d="M150 74 H574 L624 122 V398 H144 L104 358 V116 Z"/><path class="pjr3-deep-frame-front" d="M150 74 H574 V350 H150 Z M104 116 L150 74 V350 L104 398 Z M150 350 H574 L624 398 H104 Z M574 74 L624 122 V398 L574 350 Z"/><path class="pjr3-deep-gold" d="M121 89 L598 380"/></g><g class="pjr3-deep-field pjr3-deep-half left" clip-path="url(#pjr3DeepLeftClip)"><rect x="150" y="74" width="424" height="276"/><path class="pjr3-deep-grid-lines" d="M203 74V350 M256 74V350 M309 74V350 M362 74V350 M415 74V350 M468 74V350 M521 74V350 M150 108H574 M150 143H574 M150 177H574 M150 212H574 M150 246H574 M150 281H574 M150 315H574"/></g><g class="pjr3-deep-field pjr3-deep-half right" clip-path="url(#pjr3DeepRightClip)"><rect x="150" y="74" width="424" height="276"/><path class="pjr3-deep-grid-lines" d="M203 74V350 M256 74V350 M309 74V350 M362 74V350 M415 74V350 M468 74V350 M521 74V350 M150 108H574 M150 143H574 M150 177H574 M150 212H574 M150 246H574 M150 281H574 M150 315H574"/></g><g class="pjr3-deep-seams"><path d="M150 212 H574"/><path d="M362 74 V350"/><path d="M150 350 L104 398"/></g><path class="pjr3-deep-crack-shadow" d="M342 78 H432 L372 183 L420 207 L350 348"/><path class="pjr3-deep-crack" d="M342 78 H432 L372 183 L420 207 L350 348" data-pjr3-deep-crack="7"/><g class="pjr3-deep-seven-label"><text x="455" y="125">7 · SPLIT</text><text x="455" y="143">CONTROLLED SEAM</text></g><g class="pjr3-deep-home-mark"><circle cx="380" cy="212" r="12"/><path d="M370 212H390 M380 202V222"/></g></svg><div class="pjr3-deep-caption"><b data-pjr3-deep-readout>HOME · FRAME 0 · FIELD 0 · CRACK 0</b><span>SAME WORLD CUBE · DISPLAY MODE</span></div></div><aside class="pjr3-deep-panel"><div class="pjr3-deep-actions" role="group" aria-label="Deep Blue wobble and split controls"><button type="button" data-pjr3-deep-action="WOBBLE" aria-pressed="false">WOBBLE · OFF</button><button type="button" data-pjr3-deep-action="SPLIT" aria-pressed="false">7 · SPLIT · CLOSED</button><button type="button" data-pjr3-deep-action="RETURN">RETURN · HOME</button></div><label>WOBBLE STRENGTH <output data-pjr3-deep-strength>42</output><input type="range" min="0" max="100" step="1" value="42" data-pjr3-deep-intensity aria-label="Deep Blue wobble strength"></label><div class="pjr3-deep-contract"><b>FRAME → FUGE → BLUE FIELD → 7 / CRACK → RETURN</b><span>The frame leads; the field follows with a slower display phase. Split opens two bounded view halves. RETURN removes animation and closes the seam exactly.</span></div><p><b>Boundary:</b> “Deep Blue”, ocean, hovering, trembling and crack are visual roles. This mode asserts no physical ocean, earthquake, fracture, material response, second carrier, new Study, graph identity or relation.</p></aside></div></section>`);
    section.insertAdjacentHTML('beforeend',`<section class="pjr3-frame-ship" data-pjr3-frame-ship="HOME" aria-labelledby="pjr3FrameShipTitle"><header><div><span class="eyebrow">MODE 09 · SAME CARRIER · COUNTERFACE</span><h5 id="pjr3FrameShipTitle">FRAME SHIP · LANTERN / 7-GON</h5><p>The heavy Cube corner becomes a lantern-ship frame. Seven joints steer two local counterfaces: HECHT forward and Z-FACED fish head in return direction.</p></div><code data-pjr3-ship-status>EXACT HOME · ⇄ 0</code></header><div class="pjr3-frame-ship-grid"><div class="pjr3-frame-ship-stage"><svg viewBox="0 0 760 480" role="img" aria-labelledby="pjr3FrameShipSvgTitle pjr3FrameShipSvgDesc"><title id="pjr3FrameShipSvgTitle">Frame ship lantern with heptagon steering organ, spear axis and arrow direction</title><desc id="pjr3FrameShipSvgDesc">The existing World Cube frame is reused as a ship and lantern display. A seven-node magenta steering figure sits between a long gold spear axis and a short arrow showing the selected Hecht or Z-Faced counter-direction.</desc><defs><linearGradient id="pjr3ShipHull" x1="0" x2="1"><stop offset="0" stop-color="#061923"/><stop offset=".52" stop-color="#12364b"/><stop offset="1" stop-color="#06131c"/></linearGradient><marker id="pjr3ShipArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" fill="#fff2a8"/></marker></defs><g class="pjr3-ship-halo"><ellipse cx="380" cy="400" rx="282" ry="26"/></g><g class="pjr3-ship-frame"><path class="pjr3-ship-hull" d="M92 116 L172 62 H590 L676 136 V352 L592 416 H170 L82 342 Z"/><path class="pjr3-ship-corner" d="M172 62V350L82 342 M172 350H592L676 352 M592 416V128L676 136 M92 116H590L592 416 M172 62L592 128 M82 342L170 416"/><path class="pjr3-ship-lantern" d="M172 62L82 342L170 416L592 416L676 352L590 116Z"/></g><g class="pjr3-ship-spear"><line x1="92" y1="240" x2="668" y2="240"/><path d="M668 240L630 218V262Z"/><text x="380" y="223">SPEER · CARRIER / KEEL AXIS</text></g><g class="pjr3-ship-organ" data-pjr3-heptagon="7"><circle cx="380" cy="240" r="154"/><path class="pjr3-ship-heptagon" d="M380 86L500 144L530 274L447 378L313 378L230 274L260 144Z"/><path class="pjr3-ship-chords" d="M380 86L530 274L313 378L260 144L500 144L447 378L230 274L380 86"/><path class="pjr3-ship-chords second" d="M260 144L530 274L380 86L230 274L500 144L313 378L447 378"/><g class="pjr3-ship-nodes"><circle cx="380" cy="86" r="9"/><circle cx="500" cy="144" r="9"/><circle cx="530" cy="274" r="9"/><circle cx="447" cy="378" r="9"/><circle cx="313" cy="378" r="9"/><circle cx="230" cy="274" r="9"/><circle cx="260" cy="144" r="9"/></g><circle class="pjr3-ship-joint" cx="380" cy="240" r="12"/><text x="380" y="244">Oᵥ</text></g><g class="pjr3-ship-faces" data-pjr3-fish-face="HOME"><g class="pjr3-ship-hecht"><path d="M532 240C558 211 604 207 636 228L661 205L656 240L661 275L636 252C603 273 558 269 532 240Z"/><circle cx="626" cy="232" r="4"/><path class="pjr3-fish-stripe" d="M568 220L578 260M588 214L600 264"/><text x="606" y="292">HECHT · FORWARD</text></g><g class="pjr3-ship-zface"><path d="M228 240C202 211 156 207 124 228L99 205L104 240L99 275L124 252C157 273 202 269 228 240Z"/><circle cx="134" cy="232" r="4"/><path class="pjr3-fish-stripe" d="M192 218L175 232L190 244L173 260M158 216L170 264"/><text x="154" y="292">Z-FACED · COUNTER</text></g></g><g class="pjr3-ship-arrow" data-pjr3-ship-direction="HOME"><line x1="350" y1="324" x2="410" y2="324" marker-end="url(#pjr3ShipArrow)"/><text x="380" y="348">PFEIL · CURRENT VECTOR</text></g><g class="pjr3-ship-poles"><text x="380" y="48">ZENITH · LANTERN</text><text x="380" y="445">NADIR · KEEL</text></g></svg><div class="pjr3-frame-ship-caption"><b data-pjr3-ship-readout>HOME · SPEER FIXED · PFEIL 0 · GLIDE OFF</b><span>SAME WORLD CUBE · LOCAL COUNTERFACE</span></div></div><aside class="pjr3-frame-ship-panel"><div class="pjr3-frame-ship-actions" role="group" aria-label="Frame Ship direction controls"><button type="button" data-pjr3-ship-action="HECHT" aria-pressed="false">HECHT →</button><button type="button" data-pjr3-ship-action="Z_FACED" aria-pressed="false">← Z-FACED</button><button type="button" data-pjr3-ship-action="GLIDE" aria-pressed="false">GLIDE · OFF</button><button type="button" data-pjr3-ship-action="RETURN">RETURN · HOME</button></div><div class="pjr3-frame-ship-contract"><b>FRAME → 7-GON → SPEER → PFEIL → COUNTERFACE</b><span><code>SPEER</code> is the long carrier/keel axis. <code>PFEIL</code> is the shorter current vector and flips with the selected face.</span><span>The seven nodes remain one local steering figure inside the same Cube carrier. RETURN removes direction and motion exactly.</span></div><p><b>Boundary:</b> Ship, lantern, Hecht, zebra/Z-faced fish head, spear and arrow are local view mnemonics. They assert no vessel, weapon, animal, biological species, propulsion, navigation mechanism, second carrier, new Study, graph identity or relation.</p></aside></div></section>`);
    section.insertAdjacentHTML('beforeend',`<section class="pjr3-aquarium" data-pjr3-aquarium="HOME" aria-labelledby="pjr3AquariumTitle"><header><div><span class="eyebrow">MODE 10 · SAME CARRIER · DOUBLE PENDULUM DISPLAY</span><h5 id="pjr3AquariumTitle">AQUARIUM · ORCA / PINGUIN</h5><p>Two display pendulums share one pivot. ORCA carries the broad slow arc; PINGUIN counters with the shorter pulse. BLUE WHALE, SQUID and a NAUTILUS chamber trace frame the open 33 + 1 centre.</p></div><code data-pjr3-aquarium-status>EXACT HOME · 33 + 1 OPEN</code></header><div class="pjr3-aquarium-grid"><div class="pjr3-aquarium-stage"><svg viewBox="0 0 760 480" role="img" aria-labelledby="pjr3AquariumSvgTitle pjr3AquariumSvgDesc"><title id="pjr3AquariumSvgTitle">Aquarium double pendulum display with Orca, Pinguin, Blue Whale, Squid, Nautilus and open centre</title><desc id="pjr3AquariumSvgDesc">The existing World Cube carrier contains two animated display arms around a common pivot. A large Orca arm and smaller counter-moving Pinguin arm surround Blue Whale, Squid and a Nautilus chamber trace while the 33 plus 1 aperture remains open.</desc><defs><linearGradient id="pjr3Water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b3a57"/><stop offset=".52" stop-color="#08253a"/><stop offset="1" stop-color="#03131f"/></linearGradient><radialGradient id="pjr3Breath"><stop offset="0" stop-color="#041019"/><stop offset=".62" stop-color="#061823"/><stop offset="1" stop-color="#25d6e7" stop-opacity=".45"/></radialGradient></defs><rect class="pjr3-aquarium-tank" x="70" y="48" width="620" height="376" rx="28"/><path class="pjr3-aquarium-waterline" d="M72 112C155 92 225 128 310 108S470 88 688 112M72 146C166 126 232 158 328 142S509 122 688 146"/><path class="pjr3-aquarium-sweep" d="M154 344A270 270 0 0 1 606 344"/><g class="pjr3-aquarium-pivot"><circle cx="380" cy="82" r="15"/><circle cx="380" cy="82" r="5"/><text x="380" y="58">COMMON PIVOT · Oᵥ</text></g><g class="pjr3-aquarium-orca" data-pjr3-pendulum="ORCA"><line x1="380" y1="82" x2="380" y2="330"/><g transform="translate(380 330)"><path d="M-78 0C-50-42 24-43 68-10L96-34L88 4L100 37L65 17C22 49-48 43-78 0Z"/><path class="pjr3-orca-white" d="M-38 12C-9-4 21-3 47 9C18 31-13 32-38 12Z"/><circle cx="48" cy="-8" r="4"/><text x="0" y="62">ORCA · BROAD ARC</text></g></g><g class="pjr3-aquarium-pinguin" data-pjr3-pendulum="PINGUIN"><line x1="380" y1="82" x2="380" y2="244"/><g transform="translate(380 244)"><path d="M0-38C28-38 38-8 30 23L53 42L21 35L0 58L-21 35L-53 42L-30 23C-38-8-28-38 0-38Z"/><ellipse cx="0" cy="10" rx="18" ry="28"/><circle cx="-10" cy="-17" r="3"/><circle cx="10" cy="-17" r="3"/><path d="M-6-7L6-7L0 1Z"/><text x="0" y="80">PINGUIN · COUNTER</text></g></g><g class="pjr3-aquarium-centre"><g class="pjr3-blue-whale"><path d="M232 282C273 247 331 254 354 281C322 309 268 316 232 282Z M233 282L204 259L210 287L194 310L232 300Z"/><text x="274" y="332">BLUE WHALE · DEEP CARRIER</text></g><g class="pjr3-squid"><path d="M504 252C543 252 560 284 544 314L563 340L541 326L528 352L516 326L496 346L501 316C480 286 482 252 504 252Z"/><circle cx="496" cy="283" r="4"/><circle cx="516" cy="283" r="4"/><text x="516" y="370">SQUID · PULSE</text></g><g class="pjr3-nautilus" data-pjr3-nautilus="33+1" aria-label="Nautilus chamber trace around the open 33 plus 1 aperture"><circle cx="380" cy="286" r="76"/><path d="M380 286C380 264 410 260 418 282C428 311 390 334 360 318C320 296 333 238 382 226C446 210 480 284 447 338C407 404 302 369 297 291C292 198 411 164 486 225"/><path class="pjr3-nautilus-chambers" d="M380 286L418 282M380 286L360 318M380 286L382 226M380 286L447 338M380 286L297 291"/><text x="380" y="196">NAUTILUS · 33+1 CHAMBER</text></g><g class="pjr3-aperture" data-pjr3-aperture="33+1"><circle cx="380" cy="286" r="54"/><circle cx="380" cy="286" r="30"/><path d="M350 286H410M380 256V316"/><text x="380" y="282">33 + 1</text><text x="380" y="298">ATEM / KOPF</text></g></g><g class="pjr3-bubbles"><circle cx="128" cy="350" r="5"/><circle cx="145" cy="320" r="8"/><circle cx="626" cy="328" r="6"/><circle cx="643" cy="294" r="4"/><circle cx="174" cy="176" r="4"/><circle cx="596" cy="188" r="7"/></g></svg><div class="pjr3-aquarium-caption"><b data-pjr3-aquarium-readout>HOME · ORCA 0 · PINGUIN 0 · CENTRE OPEN</b><span>SAME WORLD CUBE · LOCAL MOTION LANGUAGE</span></div></div><aside class="pjr3-aquarium-panel"><div class="pjr3-aquarium-actions" role="group" aria-label="Aquarium display controls"><button type="button" data-pjr3-aquarium-action="ORCA" aria-pressed="false">ORCA · SWING</button><button type="button" data-pjr3-aquarium-action="PINGUIN" aria-pressed="false">PINGUIN · COUNTER</button><button type="button" data-pjr3-aquarium-action="DUET" aria-pressed="false">DUET · BOTH</button><button type="button" data-pjr3-aquarium-action="RETURN">RETURN · HOME</button></div><div class="pjr3-aquarium-contract"><b>PIVOT → ORCA / PINGUIN → BLUE WHALE / SQUID → NAUTILUS → 33 + 1</b><span>The two arms share one visible pivot but keep different display amplitudes and tempos. BLUE WHALE rests deep; SQUID pulses; NAUTILUS draws a chambered spiral around the open centre.</span><span><code>33 + 1</code> remains an aperture — Atem/Kopf — not another filled figure. RETURN restores both arms, the chamber trace and the centre exactly.</span></div><p><b>Boundary:</b> Aquarium, Orca, Pinguin, Blue Whale, Squid, Nautilus, Muschel, Schneckenhaus, Atem and Kopf are local image/motion roles. The chamber trace is not a mollusc model, growth law, Fibonacci/phi claim or asserted logarithmic spiral. The animation asserts no animal species, fluid simulation, breathing mechanism, anatomy, gravity, frequency, coupled-pendulum dynamics, second carrier, new Study, graph identity or relation.</p></aside></div></section>`);
    anchor.insertAdjacentElement('afterend',section);
    return section;
  };
  const drawStatic=host=>{
    const layer=host.querySelector('[data-pjr3-static]');
    layer.replaceChildren();
    const cx=380,cy=318;
    [92,126,162,202,242,282].forEach((r,index)=>layer.append(svgEl('circle',{cx,cy,r,class:`pjr3-orbit orbit-${index}`})));
    for(let i=0;i<40;i+=1){
      const inner=polar(cx,cy,274,i*9),outer=polar(cx,cy,i%4===0?289:283,i*9);
      layer.append(svgEl('line',{x1:inner.x,y1:inner.y,x2:outer.x,y2:outer.y,class:i%4===0?'pjr3-tick major':'pjr3-tick'}));
    }
    layer.append(svgEl('path',{d:'M 162 120 C 245 154 264 236 380 318 C 496 236 515 154 598 120',class:'pjr3-spiral route-a'}));
    layer.append(svgEl('path',{d:'M 598 516 C 515 482 496 400 380 318 C 264 400 245 482 162 516',class:'pjr3-spiral route-b'}));
    const labels=[['N',92],['NP · RL/LR',162],['NLK · RDM/TKR/PTHO',282]];
    labels.forEach(([textValue,r])=>{const text=svgEl('text',{x:380,y:318-r-8,class:'pjr3-tier-label'});text.textContent=textValue;layer.append(text);});
  };
  const addNode=(layer,{x,y,label,value,active=false,kind=''})=>{
    layer.append(svgEl('circle',{cx:x,cy:y,r:active?13:10,class:`pjr3-rail-node ${kind}${active?' is-active':''}`}));
    const name=svgEl('text',{x,y:y-17,class:'pjr3-rail-label'});name.textContent=label;layer.append(name);
    if(value!==null&&value!==undefined){const number=svgEl('text',{x,y:y+4,class:'pjr3-rail-value'});number.textContent=value;layer.append(number);}
  };
  const drawWheels=(layer,state)=>{
    const cx=380,cy=318,radii=[92,126,162,202,242,282];
    WHEELS.forEach((wheel,index)=>{
      const degrees=phaseDegrees(wheel,state.tick),p=polar(cx,cy,radii[index],degrees);
      layer.append(svgEl('path',{d:arcPath(cx,cy,radii[index],degrees-12,degrees+12),class:'pjr3-wheel-arc',stroke:wheel.colour}));
      layer.append(svgEl('circle',{cx:p.x,cy:p.y,r:index<3?8:7,class:'pjr3-wheel-marker',fill:wheel.colour}));
      const label=svgEl('text',{x:p.x,y:p.y-13,class:'pjr3-wheel-label'});label.textContent=wheel.id;layer.append(label);
    });
    const fan=residualFan(state.tick),spread=8+fan*2.15;
    [-2,-1,0,1,2].forEach(offset=>{const p=polar(cx,cy,78,-90+offset*spread/4);layer.append(svgEl('line',{x1:cx,y1:cy,x2:p.x,y2:p.y,class:'pjr3-fan-ray'}));});
    layer.append(svgEl('circle',{cx,cy,r:31,class:'pjr3-coupler'}));
    const yen=svgEl('text',{x:cx,y:cy+10,class:'pjr3-yen'});yen.textContent='¥';layer.append(yen);
    const kink=polar(cx,cy,162,phaseDegrees('NP-RL',state.tick)+45);
    layer.append(svgEl('path',{d:`M ${kink.x-9} ${kink.y-7} L ${kink.x} ${kink.y+8} L ${kink.x+10} ${kink.y-5}`,class:'pjr3-kink'}));
  };
  const drawRails=(layer,state)=>{
    const active=mod(state.tick,9);
    [['TR/P 23 → 24 → 25',150],['ALPHA / P / BETA',300],['78 ↔ 32 TRANSITION',470]].forEach(([label,y])=>{layer.append(svgEl('line',{x1:115,y1:y,x2:645,y2:y,class:'pjr3-rail-line'}));const text=svgEl('text',{x:120,y:y-22,class:'pjr3-rail-title'});text.textContent=label;layer.append(text);});
    layer.append(svgEl('line',{x1:380,y1:88,x2:380,y2:558,class:'pjr3-gate-line'}));
    layer.append(svgEl('polyline',{points:'150,470 380,300 610,150',class:'pjr3-transition-line'}));
    [{x:180,y:150,label:'TR',value:23},{x:380,y:150,label:'P',value:24},{x:580,y:150,label:'TR',value:25},{x:150,y:300,label:'ALPHA',value:31},{x:380,y:300,label:'P · JOINT',value:33},{x:610,y:300,label:'BETA',value:35},{x:150,y:470,label:'T',value:78},{x:610,y:470,label:'TRANSIT',value:32},{x:380,y:90,label:'GATE',value:52},{x:380,y:550,label:'ANCHOR',value:26}].forEach((node,index)=>addNode(layer,{...node,active:index===active,kind:index===4?' joint':index>7?' gate':''}));
  };
  const drawZigzag=(layer,state)=>{
    const positions=[[100,180],[220,315],[350,125],[470,315],[650,180],[570,440],[405,535],[245,455],[105,335]];
    const active=mod(state.tick,ZIGZAG_ROUTE.length);
    layer.append(svgEl('polyline',{points:positions.map(point=>point.join(',')).join(' '),class:'pjr3-zigzag-line'}));
    ZIGZAG_ROUTE.forEach((node,index)=>addNode(layer,{x:positions[index][0],y:positions[index][1],label:node.label,value:node.value,active:index===active,kind:node.label==='P'?' joint':node.label.startsWith('ALEPH')?' aleph':''}));
    const title=svgEl('text',{x:380,y:54,class:'pjr3-zigzag-title'});title.textContent='LE JEU DU LIZ · ll | ? | !!!';layer.append(title);
    const subtitle=svgEl('text',{x:380,y:82,class:'pjr3-zigzag-subtitle'});subtitle.textContent='ALPHA → JOINT → GATE → COUNTER-RAIL → ALEPH / RETURN';layer.append(subtitle);
  };
  const drawTranspose=(layer,state)=>{
    const cx=380,cy=320,max=TRANSPOSE_RINGS.at(-1),radii=TRANSPOSE_RINGS.map(value=>56+(value/max)*220);
    const sharedAngle=mod(state.tick*9,360),spoke=mod(Math.round(sharedAngle/12),30),spokeAngle=spoke*12,delta=sharedAngle-spokeAngle;
    for(let i=0;i<30;i+=1){const a=i*12,p1=polar(cx,cy,48,a),p2=polar(cx,cy,286,a);layer.append(svgEl('line',{x1:p1.x,y1:p1.y,x2:p2.x,y2:p2.y,class:i===spoke?'pjr3-transpose-spoke is-active':'pjr3-transpose-spoke'}));}
    radii.forEach((radius,index)=>{layer.append(svgEl('circle',{cx,cy,r:radius,class:`pjr3-transpose-ring ring-${index+1}`}));const point=polar(cx,cy,radius,-90);const label=svgEl('text',{x:point.x+10,y:point.y+4,class:'pjr3-transpose-label'});label.textContent=`R${index+1}`;layer.append(label);const marker=polar(cx,cy,radius,spokeAngle);layer.append(svgEl('circle',{cx:marker.x,cy:marker.y,r:6,class:'pjr3-transpose-marker'}));});
    const phaseEnd=polar(cx,cy,286,sharedAngle),spokeEnd=polar(cx,cy,286,spokeAngle);
    layer.append(svgEl('line',{x1:cx,y1:cy,x2:spokeEnd.x,y2:spokeEnd.y,class:'pjr3-reference-ray'}));
    layer.append(svgEl('line',{x1:cx,y1:cy,x2:phaseEnd.x,y2:phaseEnd.y,class:'pjr3-shared-ray'}));
    PHI_TUBES.forEach((pair,index)=>{const angle=index*90,r1=radii[pair[0]-1],r2=radii[pair[1]-1],a=polar(cx,cy,r1,angle),b=polar(cx,cy,r2,angle);layer.append(svgEl('line',{x1:a.x,y1:a.y,x2:b.x,y2:b.y,class:`pjr3-phi-tube tube-${index+1}`}));});
    layer.append(svgEl('circle',{cx,cy,r:38,class:'pjr3-transpose-core'}));
    const title=svgEl('text',{x:380,y:45,class:'pjr3-zigzag-title'});title.textContent='OTHER PERSPECTIVE · RING ↔ SPOKE';layer.append(title);
    const subtitle=svgEl('text',{x:380,y:70,class:'pjr3-zigzag-subtitle'});subtitle.textContent=`τ${String(state.tick).padStart(2,'0')} · ${sharedAngle}° → S${String(spoke).padStart(2,'0')} · ${spokeAngle}° · Δ${delta}°`;layer.append(subtitle);
    const core=svgEl('text',{x:cx,y:cy-4,class:'pjr3-transpose-core-text'});core.textContent='8 × 30';layer.append(core);
    const roots=svgEl('text',{x:cx,y:cy+15,class:'pjr3-transpose-core-sub'});roots.textContent='REFERENCE';layer.append(roots);
  };
  const drawLedger=(layer,microtick,fold='OPEN')=>{
    const cx=380,cy=305,record=microtickRecord(microtick),rTau=210,rSpoke=252;
    for(let i=0;i<LEDGER_MICROTICKS;i+=1){
      const angle=i*LEDGER_DEGREES,isTau=i%3===0,isSpoke=i%4===0,isJoint=i%12===0;
      if(!isTau&&!isSpoke)continue;
      if(isTau){const point=polar(cx,cy,rTau,angle);layer.append(svgEl('circle',{cx:point.x,cy:point.y,r:isJoint?6:3,class:isJoint?'pjr3-ledger-mark tau joint':'pjr3-ledger-mark tau'}));}
      if(isSpoke){const point=polar(cx,cy,rSpoke,angle);layer.append(svgEl('circle',{cx:point.x,cy:point.y,r:isJoint?6:3,class:isJoint?'pjr3-ledger-mark spoke joint':'pjr3-ledger-mark spoke'}));}
      if(isJoint){const a=polar(cx,cy,rTau+8,angle),b=polar(cx,cy,rSpoke-8,angle);layer.append(svgEl('line',{x1:a.x,y1:a.y,x2:b.x,y2:b.y,class:'pjr3-ledger-joint-link'}));}
    }
    [rTau,rSpoke].forEach((radius,index)=>layer.append(svgEl('circle',{cx,cy,r:radius,class:`pjr3-ledger-track track-${index}`})));
    const cursor=polar(cx,cy,276,record.angle);layer.append(svgEl('line',{x1:cx,y1:cy,x2:cursor.x,y2:cursor.y,class:'pjr3-ledger-cursor'}));
    layer.append(svgEl('circle',{cx,cy,r:58,class:'pjr3-ledger-core'}));
    const title=svgEl('text',{x:380,y:35,class:'pjr3-zigzag-title'});title.textContent='120 MICRO-TICKS · EXACT INCIDENCE LEDGER';layer.append(title);
    const exact=record.jointExact?`JOINT J${String(record.joint).padStart(2,'0')}`:record.rouletteExact?'ROULETTE ONLY':record.spokeExact?'SPOKE ONLY':'BETWEEN REGISTERS';
    const subtitle=svgEl('text',{x:380,y:61,class:'pjr3-zigzag-subtitle'});subtitle.textContent=`μ${String(record.microtick).padStart(3,'0')} · ${record.angle}° · ${exact}`;layer.append(subtitle);
    const core=svgEl('text',{x:cx,y:cy-8,class:'pjr3-ledger-core-text'});core.textContent=`μ${String(record.microtick).padStart(3,'0')}`;layer.append(core);
    const coreSub=svgEl('text',{x:cx,y:cy+15,class:'pjr3-ledger-core-sub'});coreSub.textContent=`${fold} · ${fold==='LR'?'BGR':fold==='RL'?'RGB':'HOLD'}`;layer.append(coreSub);
    const legend=svgEl('text',{x:380,y:586,class:'pjr3-ledger-legend'});legend.textContent='τ: 40 × 9°  ·  S: 30 × 12°  ·  J: 10 × 36°  ·  kgV=120';layer.append(legend);
  };
  const drawLantern=(layer,microtick,fold='OPEN',lanternState={})=>{
    const cx=380,cy=320,record=microtickRecord(microtick),radius=238;
    const carrier=LANTERN_CARRIER_STATES.includes(lanternState.carrier)?lanternState.carrier:'A',orientation=lanternState.orientation===90?90:0;
    const weave=lanternState.weave!==false,balloon=lanternState.balloon!==false,selectedPortal=mod(lanternState.portal||0,PORTAL_COUNT);
    const phase=record.microtick/LEDGER_MICROTICKS*Math.PI*2,wobble=Math.sin(phase)*24,breath=.78+.22*Math.cos(phase*2);
    const joints=Array.from({length:10},(_,joint)=>({...polar(cx,cy,radius,joint*36),joint}));
    const points=sequence=>sequence.map(index=>`${joints[index].x},${joints[index].y}`).join(' ');
    layer.append(svgEl('line',{x1:cx,y1:78,x2:cx,y2:562,class:'pjr3-lantern-axis'}));
    layer.append(svgEl('polygon',{points:points(PENTAGON_A),class:'pjr3-lantern-pentagon sheet-a'}));
    layer.append(svgEl('polygon',{points:points(PENTAGON_B),class:'pjr3-lantern-pentagon sheet-b'}));
    layer.append(svgEl('path',{d:'M 248 130 L 512 510 M 512 130 L 248 510',class:'pjr3-lantern-hourglass'}));
    layer.append(svgEl('path',{d:`M ${cx-9} 104 C ${cx-52+wobble} 206 ${cx+38-wobble} 252 ${cx-7} 320 C ${cx-46-wobble} 390 ${cx+28+wobble} 454 ${cx-10} 548`,class:`pjr3-lantern-carrier yellow${carrier==='A'?' is-active':''}`}));
    layer.append(svgEl('path',{d:`M ${cx+9} 104 C ${cx+52-wobble} 206 ${cx-38+wobble} 252 ${cx+7} 320 C ${cx+46+wobble} 390 ${cx-28-wobble} 454 ${cx+10} 548`,class:`pjr3-lantern-carrier blue${carrier==='T'?' is-active':''}`}));
    layer.append(svgEl('path',{d:`M ${cx-4} 310 C ${245-wobble} ${270-18*breath} ${160-wobble} ${120+28*breath} ${288+wobble} 128 C ${350+wobble} 132 ${338-wobble} 244 ${cx} 320`,class:`pjr3-lantern-ear ear-a${carrier==='A'?' is-active':''}`}));
    layer.append(svgEl('path',{d:`M ${cx+4} 310 C ${515+wobble} ${270-18*breath} ${600+wobble} ${120+28*breath} ${472-wobble} 128 C ${410-wobble} 132 ${422+wobble} 244 ${cx} 320`,class:`pjr3-lantern-ear ear-t${carrier==='T'?' is-active':''}`}));
    layer.append(svgEl('line',{x1:248,y1:146+wobble*.25,x2:512,y2:146-wobble*.25,class:'pjr3-lantern-tbar'}));
    layer.append(svgEl('path',{d:`M ${270-wobble*.3} 166 L ${468+wobble*.35} 232 L ${528-wobble*.2} 478`,class:'pjr3-lantern-seven'}));
    const labelPositions=orientation===90?{A:[570,324],T:[380,132],Y:[190,324]}:{A:[236,139+wobble*.25],T:[524,139-wobble*.25],Y:[380,290]};
    const aLabel=svgEl('text',{x:labelPositions.A[0],y:labelPositions.A[1],class:`pjr3-lantern-carrier-label yellow${carrier==='A'?' is-active':''}`});aLabel.textContent='A';layer.append(aLabel);
    const tLabel=svgEl('text',{x:labelPositions.T[0],y:labelPositions.T[1],class:`pjr3-lantern-carrier-label blue${carrier==='T'?' is-active':''}`});tLabel.textContent='T';layer.append(tLabel);
    layer.append(svgEl('circle',{cx,cy:286,r:carrier==='Y'?13:8,class:`pjr3-lantern-y-joint${carrier==='Y'?' is-active':''}`}));
    const yLabel=svgEl('text',{x:labelPositions.Y[0],y:labelPositions.Y[1],class:`pjr3-lantern-carrier-label y${carrier==='Y'?' is-active':''}`});yLabel.textContent='Y';layer.append(yLabel);
    const aryan=svgEl('text',{x:208,y:94,class:'pjr3-lantern-open-label'});aryan.textContent='A↔Y · ARYAN?';layer.append(aryan);
    const atreus=svgEl('text',{x:552,y:94,class:'pjr3-lantern-open-label'});atreus.textContent='A↔T · ATREUS?';layer.append(atreus);
    const alpha=svgEl('text',{x:210,y:112,class:'pjr3-lantern-projection-label alpha'});alpha.textContent='α · ALPHA / ANGLE';layer.append(alpha);
    const tangent=svgEl('text',{x:550,y:112,class:'pjr3-lantern-projection-label tangent'});tangent.textContent='tan · TANGENT';layer.append(tangent);
    const braidPaths=[
      `M 212 144 C ${575+wobble} 188 ${190-wobble} 443 548 496`,
      `M 292 118 C ${520-wobble} 218 ${238+wobble} 405 468 522`,
      `M 468 118 C ${240+wobble} 218 ${522-wobble} 405 292 522`,
      `M 548 144 C ${185-wobble} 188 ${570+wobble} 443 212 496`
    ];
    if(weave)braidPaths.forEach((d,index)=>layer.append(svgEl('path',{d,class:`pjr3-lantern-braid braid-${index+1}`,'data-pjr3-braid':String(index+1)})));
    const portalXs=[238,332,428,522];
    [188,452].forEach((y,row)=>portalXs.forEach((x,column)=>{
      const index=row*4+column;
      layer.append(svgEl('ellipse',{cx:x+(row?-.35:.35)*wobble,cy:y+Math.sin(phase+index)*7,rx:27+4*breath,ry:12+4*breath,class:`pjr3-lantern-portal portal-${index+1}${index===selectedPortal?' is-selected':''}`,'data-pjr3-portal':String(index+1),tabindex:'0',role:'button','aria-label':`Portal ${index+1}`}));
    }));
    if(balloon){
      const bx=548+Math.cos(phase)*22,by=118+Math.sin(phase)*16;
      layer.append(svgEl('path',{d:`M ${bx} ${by+15} Q ${500+wobble} 232 ${cx+10} 315`,class:'pjr3-lantern-balloon-string'}));
      layer.append(svgEl('circle',{cx:bx,cy:by,r:15+3*breath,class:'pjr3-lantern-balloon'}));
      const balloonLabel=svgEl('text',{x:bx,y:by+3,class:'pjr3-lantern-balloon-label'});balloonLabel.textContent='RB';layer.append(balloonLabel);
    }
    if(orientation===90)layer.querySelectorAll('.pjr3-lantern-carrier,.pjr3-lantern-ear,.pjr3-lantern-tbar,.pjr3-lantern-seven,.pjr3-lantern-braid,.pjr3-lantern-portal,.pjr3-lantern-balloon-string,.pjr3-lantern-balloon,.pjr3-lantern-y-joint').forEach(node=>node.setAttribute('transform',`rotate(90 ${cx} ${cy})`));
    joints.forEach(({x,y,joint})=>{
      const active=record.jointExact&&record.joint===joint;
      layer.append(svgEl('circle',{cx:x,cy:y,r:active?10:6,class:`pjr3-lantern-joint ${joint%2?'sheet-b':'sheet-a'}${active?' is-active':''}`,'data-pjr3-joint':String(joint)}));
      const label=svgEl('text',{x,y:y+(joint===0?-15:joint===5?24:4),class:'pjr3-lantern-joint-label'});label.textContent=`J${String(joint).padStart(2,'0')}`;layer.append(label);
    });
    const cursor=polar(cx,cy,radius+24,record.angle);layer.append(svgEl('circle',{cx:cursor.x,cy:cursor.y,r:5,class:'pjr3-lantern-cursor'}));
    layer.append(svgEl('circle',{cx,cy,r:54,class:'pjr3-lantern-pivot'}));
    layer.append(svgEl('path',{d:`M ${cx-28} ${cy-28} L ${cx+28} ${cy+28} M ${cx+28} ${cy-28} L ${cx-28} ${cy+28}`,class:'pjr3-lantern-x'}));
    const pivot=svgEl('text',{x:cx,y:cy-6,class:'pjr3-lantern-pivot-text'});pivot.textContent='29.02 · X';layer.append(pivot);
    const role=svgEl('text',{x:cx,y:cy+17,class:'pjr3-lantern-role'});role.textContent=`R′ · ${fold}`;layer.append(role);
    const title=svgEl('text',{x:380,y:35,class:'pjr3-zigzag-title'});title.textContent='DOUBLE PENTAGON · GELENKLATERNE';layer.append(title);
    const subtitle=svgEl('text',{x:380,y:61,class:'pjr3-zigzag-subtitle'});subtitle.textContent=`A/T/Y CARRIER · ROT ${orientation}° · ${weave?'BRAID ON':'BRAID OFF'} · PORTAL ${selectedPortal+1}/8 · μ${String(record.microtick).padStart(3,'0')}`;layer.append(subtitle);
    const top=svgEl('text',{x:380,y:79,class:'pjr3-lantern-pole-label'});top.textContent='TOP · J00 · MEET';layer.append(top);
    const bottom=svgEl('text',{x:380,y:584,class:'pjr3-lantern-pole-label'});bottom.textContent='BOTTOM · J05 · RETURN';layer.append(bottom);
  };
  const drawCube=(layer,microtick,fold='OPEN',lanternState={})=>{
    const record=microtickRecord(microtick),phase=record.angle*Math.PI/180,orientation=lanternState.orientation===90?90:0;
    const carrier=LANTERN_CARRIER_STATES.includes(lanternState.carrier)?lanternState.carrier:'A',weave=lanternState.weave!==false,balloon=lanternState.balloon!==false,dance=lanternState.dance!==false,world=lanternState.world!==false,fractal=lanternState.fractal!==false,magnet=lanternState.magnet!==false,crescent=lanternState.crescent!==false,selectedPortal=mod(lanternState.portal||0,PORTAL_COUNT);
    const cx=380,cy=322,scale=142;
    const recordIndex=Math.min(3,Math.floor(record.microtick/30)),recordAddress=JUKEBOX_RECORDS[recordIndex],beatStep=mod(Math.floor(record.microtick/6),JUKEBOX_BEAT.length),nexusFold=dance&&beatStep>=3;
    layer.setAttribute('data-pjr3-dance',nexusFold?'nexus':dance?'beat':'still');
    layer.setAttribute('data-pjr3-beat',JUKEBOX_BEAT[beatStep]);
    const rotate=point=>orientation===90?{x:-point.z,y:point.y,z:point.x}:point;
    const project=point=>{const p=rotate(point);return{x:cx+scale*(p.x-p.z)*.72,y:cy+scale*(.42*p.x-.86*p.y+.42*p.z)};};
    const pointList=points=>points.map(point=>{const p=project(point);return `${p.x.toFixed(2)},${p.y.toFixed(2)}`;}).join(' ');
    const corners=[];[-1,1].forEach(x=>[-1,1].forEach(y=>[-1,1].forEach(z=>corners.push({x,y,z}))));
    const edgePairs=[];corners.forEach((a,index)=>corners.forEach((b,j)=>{if(j<=index)return;const differences=['x','y','z'].filter(key=>a[key]!==b[key]);if(differences.length===1)edgePairs.push([a,b]);}));
    for(let sector=0;sector<12;sector+=1){const a=polar(cx,cy,276,sector*30),b=polar(cx,cy,sector%3===0?294:286,sector*30);layer.append(svgEl('line',{x1:a.x,y1:a.y,x2:b.x,y2:b.y,class:'pjr3-cube-sector','data-pjr3-cube-sector':String(sector)}));}
    layer.append(svgEl('circle',{cx,cy,r:276,class:'pjr3-cube-sector-ring'}));
    layer.append(svgEl('ellipse',{cx,cy,rx:250,ry:220,class:'pjr3-cube-sphere','data-pjr3-cube-sphere':'shell'}));
    [-56,-28,28,56].forEach((degrees,index)=>layer.append(svgEl('ellipse',{cx,cy,rx:250,ry:92,class:'pjr3-cube-meridian','data-pjr3-cube-meridian':String(index+1),transform:`rotate(${degrees} ${cx} ${cy})`})));
    const latitudes=[
      {id:'CANCER LINE',y:254,rx:224,ry:55,className:'cancer'},
      {id:'EQ · UATOR / EQ · LIZER',y:322,rx:250,ry:72,className:'equator'},
      {id:'RETURN LATITUDE',y:390,rx:224,ry:55,className:'return'}
    ];
    latitudes.forEach(latitude=>layer.append(svgEl('ellipse',{cx,cy:latitude.y,rx:latitude.rx,ry:latitude.ry,class:`pjr3-cube-latitude ${latitude.className}`,'data-pjr3-cube-latitude':latitude.id})));
    layer.append(svgEl('line',{x1:cx,y1:92,x2:cx,y2:552,class:'pjr3-cube-polar-axis','data-pjr3-cube-polar-axis':'true'}));
    if(world){
      const map=svgEl('g',{class:'pjr3-world-map','data-pjr3-world-map':'continents'});
      const continents=[
        ['NORTH AMERICA','M 231 232 C 248 202 288 197 319 219 L 306 245 282 253 269 281 243 270 250 247 Z'],
        ['SOUTH AMERICA','M 298 294 C 320 286 345 298 348 322 L 334 351 329 391 307 421 296 382 303 349 286 320 Z'],
        ['EUROPE','M 378 226 C 392 213 417 212 429 226 L 414 244 386 242 Z'],
        ['AFRICA','M 383 252 C 409 238 443 253 446 285 L 430 330 404 361 388 325 372 284 Z'],
        ['ASIA','M 424 220 C 459 191 521 202 552 236 L 527 270 486 263 458 281 430 254 Z'],
        ['AUSTRALIA','M 492 351 C 514 335 548 345 555 369 L 537 390 501 384 486 366 Z']
      ];
      continents.forEach(([id,d])=>map.append(svgEl('path',{d,class:'pjr3-continent','data-pjr3-continent':id})));
      layer.append(map);
    }
    if(magnet){
      const penta=svgEl('g',{class:'pjr3-penta-magnet','data-pjr3-penta-magnet':'5-lines-5-corners-5-squares'});
      const vertices=Array.from({length:PENTA_MAGNET_COUNT},(_,index)=>polar(cx,cy,205,PENTA_MAGNET_DIRECTION+index*72));
      vertices.forEach((start,index)=>{const end=vertices[(index+2)%PENTA_MAGNET_COUNT],mid={x:(start.x+end.x)/2,y:(start.y+end.y)/2};penta.append(svgEl('line',{x1:start.x,y1:start.y,x2:end.x,y2:end.y,class:'pjr3-penta-line','data-pjr3-penta-line':String(index+1)}));penta.append(svgEl('rect',{x:mid.x-8,y:mid.y-8,width:16,height:16,rx:2,class:'pjr3-penta-square','data-pjr3-penta-square':String(index+1),transform:`rotate(${PENTA_MAGNET_DIRECTION+index*72} ${mid.x} ${mid.y})`}));});
      vertices.forEach((point,index)=>penta.append(svgEl('circle',{cx:point.x,cy:point.y,r:8,class:'pjr3-penta-corner','data-pjr3-penta-corner':String(index+1)})));
      const pentaLabel=svgEl('text',{x:cx,y:cy-214,class:'pjr3-penta-label'});pentaLabel.textContent='PENTA MAGNET · 5 LINES · 5 ECKEN · 5 QUADRATE';penta.append(pentaLabel);layer.append(penta);
    }
    if(crescent){
      const tip=polar(cx,cy,236,PENTA_MAGNET_DIRECTION),rayEnd=polar(cx,cy,218,PENTA_MAGNET_DIRECTION);
      layer.append(svgEl('line',{x1:cx,y1:cy,x2:rayEnd.x,y2:rayEnd.y,class:'pjr3-crescent-ray','data-pjr3-crescent-direction':String(PENTA_MAGNET_DIRECTION)}));
      const crescentGroup=svgEl('g',{class:'pjr3-crescent','data-pjr3-crescent':'11-23-333',transform:`translate(${tip.x} ${tip.y}) rotate(${PENTA_MAGNET_DIRECTION})`});
      crescentGroup.append(svgEl('path',{d:'M -15 -19 A 24 24 0 1 0 -15 19 A 18 18 0 1 1 -15 -19 Z',class:'pjr3-crescent-shape'}));layer.append(crescentGroup);
      const crescentLabel=svgEl('text',{x:tip.x+18,y:tip.y-8,class:'pjr3-crescent-label'});crescentLabel.textContent='11→23 · 333°';layer.append(crescentLabel);
    }
    JUKEBOX_RECORDS.forEach((address,index)=>{
      const foldAngle=fold==='RL'?-12:fold==='LR'?12:0;
      layer.append(svgEl('ellipse',{cx,cy,rx:70+index*28,ry:(70+index*28)*.34,class:`pjr3-jukebox-record${index===recordIndex?' is-active':''}`,'data-pjr3-jukebox-record':String(address),transform:`rotate(${foldAngle} ${cx} ${cy})`}));
      const label=svgEl('text',{x:cx+78+index*28,y:cy-5,class:`pjr3-jukebox-record-label${index===recordIndex?' is-active':''}`,'data-pjr3-jukebox-label':String(address)});label.textContent=`REC ${address}`;layer.append(label);
    });
    const planes=[
      {id:'A',className:'plane-a',points:[{x:0,y:-1,z:-1},{x:0,y:-1,z:1},{x:0,y:1,z:1},{x:0,y:1,z:-1}]},
      {id:'T',className:'plane-t',points:[{x:-1,y:0,z:-1},{x:1,y:0,z:-1},{x:1,y:0,z:1},{x:-1,y:0,z:1}]},
      {id:'Y',className:'plane-y',points:[{x:-1,y:-1,z:0},{x:1,y:-1,z:0},{x:1,y:1,z:0},{x:-1,y:1,z:0}]}
    ];
    planes.forEach(plane=>layer.append(svgEl('polygon',{points:pointList(plane.points),class:`pjr3-cube-plane ${plane.className}${carrier===plane.id?' is-active':''}`,'data-pjr3-cube-plane':plane.id})));
    const seams=[
      {id:'A∩T',a:{x:0,y:0,z:-1},b:{x:0,y:0,z:1},className:'seam-at'},
      {id:'T∩Y',a:{x:-1,y:0,z:0},b:{x:1,y:0,z:0},className:'seam-ty'},
      {id:'Y∩A',a:{x:0,y:-1,z:0},b:{x:0,y:1,z:0},className:'seam-ya'}
    ];
    seams.forEach(seam=>{const a=project(seam.a),b=project(seam.b);layer.append(svgEl('line',{x1:a.x,y1:a.y,x2:b.x,y2:b.y,class:`pjr3-cube-seam ${seam.className}`,'data-pjr3-cube-seam':seam.id}));});
    edgePairs.forEach(([a,b],index)=>{const pa=project(a),pb=project(b);layer.append(svgEl('line',{x1:pa.x,y1:pa.y,x2:pb.x,y2:pb.y,class:'pjr3-cube-edge','data-pjr3-cube-edge':String(index+1)}));});
    const curve=(sign=1)=>Array.from({length:240},(_,index)=>{const t=index/239*Math.PI*2;return{x:Math.sin(3*t+sign*phase),y:Math.sin(4*t+sign*Math.PI/2)*.9,z:Math.sin(5*t-sign*phase/2)*.82};});
    const yellow=curve(1),blue=curve(-1);
    layer.append(svgEl('polyline',{points:pointList(yellow),class:`pjr3-cube-curve yellow${carrier==='A'?' is-active':''}`,'data-pjr3-cube-curve':'A-345'}));
    if(weave)layer.append(svgEl('polyline',{points:pointList(blue),class:`pjr3-cube-curve blue${carrier==='T'?' is-active':''}`,'data-pjr3-cube-curve':'T-345'}));
    if(nexusFold)[-10,-5,5,10].forEach((shift,index)=>layer.append(svgEl('polyline',{points:pointList(index%2?yellow:blue),class:`pjr3-cube-smear smear-${index+1}`,'data-pjr3-cube-smear':String(index+1),transform:`translate(${shift} ${index%2?shift/2:-shift/2})`})));
    const needleAngle=-64+recordIndex*30+Math.sin(phase)*8,needle=polar(cx,cy,92+recordIndex*22,needleAngle),armPivot={x:202,y:118};
    layer.append(svgEl('path',{d:`M ${armPivot.x} ${armPivot.y} Q ${armPivot.x+72} ${armPivot.y+18} ${needle.x} ${needle.y}`,class:'pjr3-jukebox-tonearm','data-pjr3-jukebox-tonearm':String(recordAddress)}));
    layer.append(svgEl('circle',{cx:armPivot.x,cy:armPivot.y,r:11,class:'pjr3-jukebox-pivot'}));
    layer.append(svgEl('circle',{cx:needle.x,cy:needle.y,r:7,class:'pjr3-jukebox-needle','data-pjr3-jukebox-needle':String(recordAddress)}));
    const armLabel=svgEl('text',{x:armPivot.x+17,y:armPivot.y-12,class:'pjr3-jukebox-arm-label'});armLabel.textContent=`TONE ARM · ${recordAddress}`;layer.append(armLabel);
    corners.forEach((corner,index)=>{const p=project(corner);layer.append(svgEl('circle',{cx:p.x,cy:p.y,r:index===selectedPortal?10:7,class:`pjr3-cube-corner${index===selectedPortal?' is-selected':''}`,'data-pjr3-portal':String(index+1),'data-pjr3-cube-corner':String(index+1),tabindex:'0',role:'button','aria-label':`Cube portal ${index+1}`}));});
    const center=project({x:0,y:0,z:0});layer.append(svgEl('circle',{cx:center.x,cy:center.y,r:carrier==='Y'?13:9,class:`pjr3-cube-joint${carrier==='Y'?' is-active':''}`}));
    const joint=svgEl('text',{x:center.x,y:center.y-15,class:'pjr3-cube-joint-label'});joint.textContent='R′ · 29.02 · X';layer.append(joint);
    if(fractal){
      const fractalLens=svgEl('g',{class:'pjr3-fractal-lens','data-pjr3-fractal-lens':'I|J'});
      fractalLens.append(svgEl('line',{x1:380,y1:278,x2:380,y2:366,class:'pjr3-fractal-divider'}));
      fractalLens.append(svgEl('path',{d:'M 354 303 C 330 286 310 306 319 329 C 299 337 307 361 329 356 C 342 378 369 360 361 339 C 377 327 372 308 354 303 Z',class:'pjr3-fractal-mandelbrot','data-pjr3-fractal':'MANDELBROT-C-PLANE'}));
      fractalLens.append(svgEl('path',{d:'M 405 297 C 430 278 458 295 453 318 C 448 340 417 336 407 354 C 397 372 426 384 445 365 C 464 346 442 329 425 326 C 406 322 393 310 405 297 Z',class:'pjr3-fractal-julia','data-pjr3-fractal':'JULIA-Z-PLANE',transform:`rotate(${Math.sin(phase)*14} 426 331)`}));
      fractalLens.append(svgEl('circle',{cx:380,cy:322,r:5,class:'pjr3-fractal-c'}));
      [['M · C-PLANE',334,380],['c',380,380],['J · Z-PLANE',426,380]].forEach(([value,x,textY])=>{const text=svgEl('text',{x,y:textY,class:'pjr3-fractal-label'});text.textContent=value;fractalLens.append(text);});
      layer.append(fractalLens);
    }
    if(balloon){const sample=yellow[record.microtick*2],p=project(sample);layer.append(svgEl('circle',{cx:p.x,cy:p.y,r:10,class:'pjr3-cube-balloon','data-pjr3-cube-balloon':'true'}));}
    const labels=[['A PLANE',project({x:0,y:1,z:-1})],['T PLANE',project({x:1,y:0,z:1})],['Y PLANE',project({x:-1,y:1,z:0})]];
    labels.forEach(([value,p],index)=>{const text=svgEl('text',{x:p.x,y:p.y-9,class:`pjr3-cube-plane-label label-${index}`});text.textContent=value;layer.append(text);});
    [['CANCER LINE',592,250,'cancer'],['EQ · UATOR',592,315,'equator'],['EQ · LIZER',592,330,'equalizer'],['RETURN LAT.',592,394,'return']].forEach(([value,x,y,className])=>{const text=svgEl('text',{x,y,class:`pjr3-cube-latitude-label ${className}`});text.textContent=value;layer.append(text);});
    JUKEBOX_BEAT.forEach((value,index)=>{const text=svgEl('text',{x:326+index*27,y:532,class:`pjr3-jukebox-beat${index===beatStep?' is-active':''}`,'data-pjr3-jukebox-beat':String(index)});text.textContent=value;layer.append(text);});
    const nexus=svgEl('text',{x:380,y:505,class:`pjr3-jukebox-nexus${nexusFold?' is-active':''}`,'data-pjr3-jukebox-nexus':'true'});nexus.textContent=`23 · 24 · 25 · 26 → NEX·US · ${fold}`;layer.append(nexus);
    const ownerMnemonic=svgEl('text',{x:380,y:553,class:'pjr3-owner-mnemonic','data-pjr3-owner-mnemonic':'open'});ownerMnemonic.textContent='MA · }(BMW | BMX){ · Φ · LOKI’S TRIXS KIẞTE?';layer.append(ownerMnemonic);
    [['δ 0°',0],['δ 90°',90],['δ 180°',180],['δ 270°',270]].forEach(([value,degrees])=>{const p=polar(cx,cy,306,degrees);const text=svgEl('text',{x:p.x,y:p.y+3,class:'pjr3-cube-phase-label'});text.textContent=value;layer.append(text);});
    const title=svgEl('text',{x:380,y:35,class:'pjr3-zigzag-title'});title.textContent='JUKE BOX · A / T / Y CUBE · TANZ ZUM BEAT';layer.append(title);
    const subtitle=svgEl('text',{x:380,y:61,class:'pjr3-zigzag-subtitle'});subtitle.textContent=`${magnet?'PENTA 5|5|5':'PENTA OFF'} · ${crescent?'SICHEL 333°':'SICHEL OFF'} · ${world?'WORLD 6 PATCHES':'WORLD OFF'} · ${fractal?'M:C | c | J:Z':'I|J OFF'} · REC ${recordAddress}`;layer.append(subtitle);
    const footer=svgEl('text',{x:380,y:596,class:'pjr3-cube-footer'});footer.textContent=`WORLD ≠ EARTH ID · M:C-PLANE · J:Z-PLANE · SHARED c ONLY · ${JUKEBOX_BEAT[beatStep]}`;layer.append(footer);
  };
  const render=(host,state,view='WHEELS',microtick=state.tick*3,fold='OPEN',lanternState={carrier:'A',orientation:0,weave:true,balloon:true,dance:true,sound:false,world:true,fractal:true,magnet:true,crescent:true,portal:0})=>{
    const layer=host.querySelector('[data-pjr3-dynamic]');
    layer.replaceChildren();
    host.dataset.view=view;
    if(view==='RAILS')drawRails(layer,state);else if(view==='ZIGZAG')drawZigzag(layer,state);else if(view==='TRANSPOSE')drawTranspose(layer,state);else if(view==='LEDGER')drawLedger(layer,microtick,fold);else if(view==='LANTERN')drawLantern(layer,microtick,fold,lanternState);else if(view==='CUBE')drawCube(layer,microtick,fold,lanternState);else drawWheels(layer,state);
    const values=Object.fromEntries(WHEELS.map(wheel=>[wheel.id,address(wheel,state.tick)]));
    const fan=residualFan(state.tick);
    const microRecord=microtickRecord(microtick);
    host.querySelector('[data-pjr3-readout="state"]').textContent=['LEDGER','LANTERN','CUBE'].includes(view)?(microRecord.microtick===0?'EXACT HOME':'MICROTICK CURSOR'):isHome(state)?'EXACT HOME':'COUPLED MOTION';
    host.querySelector('[data-pjr3-readout="addresses"]').textContent=`N ${values.N} · NP ${values['NP-RL']}/${values['NP-LR']} · NLK ${values.RDM}/${values.TKR}/${values.PTHO}`;
    host.querySelector('[data-pjr3-readout="tick"]').textContent=`τ ${String(state.tick).padStart(2,'0')} / 40`;
    host.querySelector('[data-pjr3-readout="n"]').textContent=`N · ${String(values.N).padStart(2,'0')}/10`;
    host.querySelector('[data-pjr3-readout="np"]').textContent=`NP · RL ${String(values['NP-RL']).padStart(2,'0')}/20 · LR ${String(values['NP-LR']).padStart(2,'0')}/20`;
    host.querySelector('[data-pjr3-readout="nlk"]').textContent=`NLK · RDM ${String(values.RDM).padStart(2,'0')} · TKR ${String(values.TKR).padStart(2,'0')} · PTHO ${String(values.PTHO).padStart(2,'0')}`;
    host.querySelector('[data-pjr3-readout="fan"]').textContent=`RED BALLOON FAN · ${String(fan).padStart(2,'0')}/20`;
    const routeNode=ZIGZAG_ROUTE[mod(state.tick,ZIGZAG_ROUTE.length)];
    const sharedAngle=mod(state.tick*9,360),transposeSpoke=mod(Math.round(sharedAngle/12),30),transposeDelta=sharedAngle-transposeSpoke*12;
    host.querySelector('[data-pjr3-readout="rail"]').textContent=view==='WHEELS'?'VIEW · WHEELS':view==='RAILS'?`RAILS · 23→24→25 · 78↔32 · JOINT 33`:view==='ZIGZAG'?`ZIGZAG · ${routeNode.label}${routeNode.value===null?'':` ${routeNode.value}`} · ${mod(state.tick,ZIGZAG_ROUTE.length)+1}/9`:view==='TRANSPOSE'?`TRANSPOSE · τ${String(state.tick).padStart(2,'0')}/40 ↔ S${String(transposeSpoke).padStart(2,'0')}/30 · Δ${transposeDelta}°`:view==='LANTERN'?`LANTERN · μ${String(microRecord.microtick).padStart(3,'0')}/120 · ${microRecord.jointExact?`J${String(microRecord.joint).padStart(2,'0')} EXACT`:'BETWEEN JOINTS'} · ${lanternState.carrier} CARRIER · PORTAL ${mod(lanternState.portal||0,PORTAL_COUNT)+1}/8 · ${fold}`:view==='CUBE'?`JUKE BOX · REC ${JUKEBOX_RECORDS[Math.min(3,Math.floor(microRecord.microtick/30))]} · NEEDLE μ${String(microRecord.microtick).padStart(3,'0')} · ${JUKEBOX_BEAT[mod(Math.floor(microRecord.microtick/6),JUKEBOX_BEAT.length)]} · ${fold}`:`LEDGER · μ${String(microRecord.microtick).padStart(3,'0')}/120 · ${microRecord.jointExact?`J${String(microRecord.joint).padStart(2,'0')} EXACT`:microRecord.rouletteExact?'ROULETTE':microRecord.spokeExact?'SPOKE':'GAP'} · FOLD ${fold}`;
    host.querySelectorAll('[data-pjr3-view]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.pjr3View===view)));
    host.querySelector('[data-pjr3-ledger-controls]').hidden=!['LEDGER','LANTERN','CUBE'].includes(view);
    host.querySelector('[data-pjr3-lantern-controls]').hidden=!['LANTERN','CUBE'].includes(view);
    host.querySelectorAll('[data-pjr3-fold]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.pjr3Fold===fold)));
    host.querySelectorAll('[data-pjr3-carrier]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.pjr3Carrier===lanternState.carrier)));
    host.querySelector('[data-pjr3-lantern-toggle="WEAVE"]').setAttribute('aria-pressed',String(lanternState.weave));
    host.querySelector('[data-pjr3-lantern-toggle="BALLOON"]').setAttribute('aria-pressed',String(lanternState.balloon));
    const danceButton=host.querySelector('[data-pjr3-lantern-toggle="DANCE"]');danceButton.setAttribute('aria-pressed',String(lanternState.dance));danceButton.textContent=`DANCE · ${lanternState.dance?'ON':'OFF'}`;
    const soundButton=host.querySelector('[data-pjr3-lantern-toggle="SOUND"]');soundButton.setAttribute('aria-pressed',String(lanternState.sound));soundButton.textContent=`JUKE SOUND · ${lanternState.sound?'ON':'OFF'}`;
    const worldButton=host.querySelector('[data-pjr3-lantern-toggle="WORLD"]');worldButton.setAttribute('aria-pressed',String(lanternState.world));worldButton.textContent=`WORLD MAP · ${lanternState.world?'ON':'OFF'}`;
    const fractalButton=host.querySelector('[data-pjr3-lantern-toggle="FRACTAL"]');fractalButton.setAttribute('aria-pressed',String(lanternState.fractal));fractalButton.textContent=`I | J · ${lanternState.fractal?'ON':'OFF'}`;
    const magnetButton=host.querySelector('[data-pjr3-lantern-toggle="MAGNET"]');magnetButton.setAttribute('aria-pressed',String(lanternState.magnet));magnetButton.textContent=`PENTA MAGNET · ${lanternState.magnet?'ON':'OFF'}`;
    const crescentButton=host.querySelector('[data-pjr3-lantern-toggle="CRESCENT"]');crescentButton.setAttribute('aria-pressed',String(lanternState.crescent));crescentButton.textContent=`SICHEL · ${lanternState.crescent?'333°':'OFF'}`;
    const rotateButton=host.querySelector('[data-pjr3-lantern-toggle="ROTATE"]');rotateButton.setAttribute('aria-pressed',String(lanternState.orientation===90));rotateButton.textContent=`ROT · ${lanternState.orientation===90?90:0}°`;
    host.querySelector('[data-pjr3-lantern-phase]').value=String(microRecord.microtick);
    host.querySelector('[data-pjr3-record]').textContent=`${isHome(state)?'HOME':'ACTIVE'} · τ=${String(state.tick).padStart(2,'0')}/40 · RESIDUAL ${String(fan).padStart(2,'0')}`;
  };
  const mount=()=>{
    const host=document.getElementById('pascalJointRoulette3')||createHost();
    if(!host||host.dataset.mounted==='true')return;
    host.dataset.mounted='true';drawStatic(host);
    let state=createState(),timer=null,view='WHEELS',microtick=0,fold='OPEN',lanternState={carrier:'A',orientation:0,weave:true,balloon:true,dance:true,sound:false,world:true,fractal:true,magnet:true,crescent:true,portal:0},audioContext=null,lastSoundBeat=-1;
    const deep=host.querySelector('[data-pjr3-deep-mode]');
    let deepState={wobble:false,split:false,intensity:42};
    const renderDeep=()=>{
      const mode=deepState.split?'SPLIT':deepState.wobble?'WOBBLE':'HOME',strength=deepState.intensity;
      deep.dataset.pjr3DeepMode=mode;
      deep.style.setProperty('--deep-shift',`${(1+strength/15).toFixed(2)}px`);
      deep.style.setProperty('--deep-angle',`${(.12+strength/115).toFixed(2)}deg`);
      deep.style.setProperty('--deep-field-shift',`${(.7+strength/23).toFixed(2)}px`);
      deep.style.setProperty('--deep-split',`${(1.2+strength/11).toFixed(2)}px`);
      const wobbleButton=deep.querySelector('[data-pjr3-deep-action="WOBBLE"]'),splitButton=deep.querySelector('[data-pjr3-deep-action="SPLIT"]');
      wobbleButton.setAttribute('aria-pressed',String(deepState.wobble));wobbleButton.textContent=`WOBBLE · ${deepState.wobble?'ON':'OFF'}`;
      splitButton.setAttribute('aria-pressed',String(deepState.split));splitButton.textContent=`7 · SPLIT · ${deepState.split?'OPEN':'CLOSED'}`;
      deep.querySelector('[data-pjr3-deep-strength]').textContent=String(strength);
      deep.querySelector('[data-pjr3-deep-status]').textContent=mode==='HOME'?'EXACT HOME · Δ0':`${mode} · STRENGTH ${String(strength).padStart(2,'0')}`;
      deep.querySelector('[data-pjr3-deep-readout]').textContent=mode==='HOME'?'HOME · FRAME 0 · FIELD 0 · CRACK 0':`${mode} · FRAME LEADS · FIELD LAGS · CRACK ${deepState.split?'7 / OPEN':'0 / CLOSED'}`;
    };
    const frameShip=host.querySelector('[data-pjr3-frame-ship]');
    let frameShipState={direction:'HOME',glide:false};
    const renderFrameShip=()=>{
      const direction=FRAME_SHIP_DIRECTIONS.includes(frameShipState.direction)?frameShipState.direction:'HOME';
      frameShip.dataset.pjr3FrameShip=direction;
      frameShip.dataset.pjr3ShipGlide=String(frameShipState.glide);
      frameShip.querySelector('[data-pjr3-fish-face]').setAttribute('data-pjr3-fish-face',direction);
      frameShip.querySelector('[data-pjr3-ship-direction]').setAttribute('data-pjr3-ship-direction',direction);
      frameShip.querySelectorAll('[data-pjr3-ship-action="HECHT"],[data-pjr3-ship-action="Z_FACED"]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.pjr3ShipAction===direction)));
      const glideButton=frameShip.querySelector('[data-pjr3-ship-action="GLIDE"]');
      glideButton.setAttribute('aria-pressed',String(frameShipState.glide));glideButton.textContent=`GLIDE · ${frameShipState.glide?'ON':'OFF'}`;
      const name=direction==='Z_FACED'?'Z-FACED':direction;
      frameShip.querySelector('[data-pjr3-ship-status]').textContent=direction==='HOME'?'EXACT HOME · ⇄ 0':`${name} · ${direction==='HECHT'?'→':'←'} · ${frameShipState.glide?'GLIDE':'HOLD'}`;
      frameShip.querySelector('[data-pjr3-ship-readout]').textContent=direction==='HOME'?'HOME · SPEER FIXED · PFEIL 0 · GLIDE OFF':`${name} · SPEER FIXED · PFEIL ${direction==='HECHT'?'+1':'−1'} · GLIDE ${frameShipState.glide?'ON':'OFF'}`;
    };
    const aquarium=host.querySelector('[data-pjr3-aquarium]');
    let aquariumState={mode:'HOME'};
    const renderAquarium=()=>{
      const mode=AQUARIUM_MODES.includes(aquariumState.mode)?aquariumState.mode:'HOME';
      aquarium.dataset.pjr3Aquarium=mode;
      aquarium.querySelectorAll('[data-pjr3-aquarium-action="ORCA"],[data-pjr3-aquarium-action="PINGUIN"],[data-pjr3-aquarium-action="DUET"]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.pjr3AquariumAction===mode)));
      aquarium.querySelector('[data-pjr3-aquarium-status]').textContent=mode==='HOME'?'EXACT HOME · 33 + 1 OPEN':`${mode} · 33 + 1 BREATHES`;
      aquarium.querySelector('[data-pjr3-aquarium-readout]').textContent=mode==='HOME'?'HOME · ORCA 0 · PINGUIN 0 · CENTRE OPEN':`${mode} · ORCA ${['ORCA','DUET'].includes(mode)?'BROAD':'0'} · PINGUIN ${['PINGUIN','DUET'].includes(mode)?'COUNTER':'0'} · CENTRE OPEN`;
    };
    const soundPulse=()=>{
      if(!lanternState.sound||view!=='CUBE')return;
      const soundBeat=Math.floor(microtick/6);if(soundBeat===lastSoundBeat)return;lastSoundBeat=soundBeat;
      const AudioContextClass=globalThis.AudioContext||globalThis.webkitAudioContext;if(!AudioContextClass)return;
      if(!audioContext)audioContext=new AudioContextClass();if(audioContext.state==='suspended')audioContext.resume();
      const beatIndex=mod(soundBeat,JUKEBOX_NOTES.length),now=audioContext.currentTime,oscillator=audioContext.createOscillator(),gain=audioContext.createGain();
      oscillator.type=beatIndex===3?'sawtooth':'triangle';oscillator.frequency.setValueAtTime(JUKEBOX_NOTES[beatIndex],now);
      gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(.075,now+.012);gain.gain.exponentialRampToValueAtTime(.0001,now+(beatIndex===4?.46:.19));
      oscillator.connect(gain);gain.connect(audioContext.destination);oscillator.start(now);oscillator.stop(now+(beatIndex===4?.48:.21));
    };
    const update=next=>{state=next;microtick=state.tick*3;render(host,state,view,microtick,fold,lanternState);soundPulse();};
    const updateMicro=delta=>{microtick=mod(microtick+delta,LEDGER_MICROTICKS);render(host,state,view,microtick,fold,lanternState);soundPulse();};
    const stop=()=>{if(timer){clearInterval(timer);timer=null;}state.running=false;const button=host.querySelector('[data-pjr3-action="PLAY"]');button.textContent='PLAY';button.setAttribute('aria-pressed','false');};
    const start=()=>{if(timer)return;state.running=true;const button=host.querySelector('[data-pjr3-action="PLAY"]');button.textContent='PAUSE';button.setAttribute('aria-pressed','true');timer=setInterval(()=>update(advance(state,1)),260);};
    host.querySelector('[data-pjr3-action="BACK"]').addEventListener('click',()=>update(advance(state,-1)));
    host.querySelector('[data-pjr3-action="NEXT"]').addEventListener('click',()=>update(advance(state,1)));
    host.querySelector('[data-pjr3-action="RETURN"]').addEventListener('click',()=>{stop();update(returnHome());});
    host.querySelector('[data-pjr3-action="PLAY"]').addEventListener('click',()=>{if(timer){stop();return;}start();});
    host.querySelectorAll('[data-pjr3-view]').forEach(button=>button.addEventListener('click',()=>{view=button.dataset.pjr3View;if(['LEDGER','LANTERN','CUBE'].includes(view))microtick=state.tick*3;render(host,state,view,microtick,fold,lanternState);}));
    host.querySelector('[data-pjr3-micro="BACK"]').addEventListener('click',()=>updateMicro(-1));
    host.querySelector('[data-pjr3-micro="NEXT"]').addEventListener('click',()=>updateMicro(1));
    host.querySelectorAll('[data-pjr3-fold]').forEach(button=>button.addEventListener('click',()=>{fold=FOLD_STATES.includes(button.dataset.pjr3Fold)?button.dataset.pjr3Fold:'OPEN';render(host,state,view,microtick,fold,lanternState);}));
    host.querySelectorAll('[data-pjr3-carrier]').forEach(button=>button.addEventListener('click',()=>{lanternState.carrier=LANTERN_CARRIER_STATES.includes(button.dataset.pjr3Carrier)?button.dataset.pjr3Carrier:'A';render(host,state,view,microtick,fold,lanternState);}));
    host.querySelector('[data-pjr3-lantern-toggle="ROTATE"]').addEventListener('click',()=>{lanternState.orientation=lanternState.orientation===90?0:90;render(host,state,view,microtick,fold,lanternState);});
    host.querySelector('[data-pjr3-lantern-toggle="WEAVE"]').addEventListener('click',()=>{lanternState.weave=!lanternState.weave;render(host,state,view,microtick,fold,lanternState);});
    host.querySelector('[data-pjr3-lantern-toggle="BALLOON"]').addEventListener('click',()=>{lanternState.balloon=!lanternState.balloon;render(host,state,view,microtick,fold,lanternState);});
    host.querySelector('[data-pjr3-lantern-toggle="DANCE"]').addEventListener('click',()=>{lanternState.dance=!lanternState.dance;render(host,state,view,microtick,fold,lanternState);});
    host.querySelector('[data-pjr3-lantern-toggle="SOUND"]').addEventListener('click',()=>{lanternState.sound=!lanternState.sound;lastSoundBeat=-1;if(lanternState.sound){view='CUBE';start();}render(host,state,view,microtick,fold,lanternState);soundPulse();});
    host.querySelector('[data-pjr3-lantern-toggle="WORLD"]').addEventListener('click',()=>{lanternState.world=!lanternState.world;render(host,state,view,microtick,fold,lanternState);});
    host.querySelector('[data-pjr3-lantern-toggle="FRACTAL"]').addEventListener('click',()=>{lanternState.fractal=!lanternState.fractal;render(host,state,view,microtick,fold,lanternState);});
    host.querySelector('[data-pjr3-lantern-toggle="MAGNET"]').addEventListener('click',()=>{lanternState.magnet=!lanternState.magnet;render(host,state,view,microtick,fold,lanternState);});
    host.querySelector('[data-pjr3-lantern-toggle="CRESCENT"]').addEventListener('click',()=>{lanternState.crescent=!lanternState.crescent;render(host,state,view,microtick,fold,lanternState);});
    host.querySelector('[data-pjr3-lantern-phase]').addEventListener('input',event=>{microtick=mod(Number(event.currentTarget.value),LEDGER_MICROTICKS);render(host,state,view,microtick,fold,lanternState);});
    deep.querySelector('[data-pjr3-deep-action="WOBBLE"]').addEventListener('click',()=>{deepState.wobble=!deepState.wobble;renderDeep();});
    deep.querySelector('[data-pjr3-deep-action="SPLIT"]').addEventListener('click',()=>{deepState.split=!deepState.split;if(deepState.split)deepState.wobble=true;renderDeep();});
    deep.querySelector('[data-pjr3-deep-action="RETURN"]').addEventListener('click',()=>{deepState={...deepState,wobble:false,split:false};renderDeep();});
    deep.querySelector('[data-pjr3-deep-intensity]').addEventListener('input',event=>{deepState.intensity=Number(event.currentTarget.value);renderDeep();});
    frameShip.querySelector('[data-pjr3-ship-action="HECHT"]').addEventListener('click',()=>{frameShipState.direction='HECHT';renderFrameShip();});
    frameShip.querySelector('[data-pjr3-ship-action="Z_FACED"]').addEventListener('click',()=>{frameShipState.direction='Z_FACED';renderFrameShip();});
    frameShip.querySelector('[data-pjr3-ship-action="GLIDE"]').addEventListener('click',()=>{frameShipState.glide=!frameShipState.glide;renderFrameShip();});
    frameShip.querySelector('[data-pjr3-ship-action="RETURN"]').addEventListener('click',()=>{frameShipState={direction:'HOME',glide:false};renderFrameShip();});
    aquarium.querySelector('[data-pjr3-aquarium-action="ORCA"]').addEventListener('click',()=>{aquariumState.mode='ORCA';renderAquarium();});
    aquarium.querySelector('[data-pjr3-aquarium-action="PINGUIN"]').addEventListener('click',()=>{aquariumState.mode='PINGUIN';renderAquarium();});
    aquarium.querySelector('[data-pjr3-aquarium-action="DUET"]').addEventListener('click',()=>{aquariumState.mode='DUET';renderAquarium();});
    aquarium.querySelector('[data-pjr3-aquarium-action="RETURN"]').addEventListener('click',()=>{aquariumState={mode:'HOME'};renderAquarium();});
    host.addEventListener('click',event=>{const portal=event.target.closest?.('[data-pjr3-portal]');if(!portal)return;lanternState.portal=mod(Number(portal.dataset.pjr3Portal)-1,PORTAL_COUNT);render(host,state,view,microtick,fold,lanternState);});
    host.addEventListener('keydown',event=>{if(!event.target.matches?.('[data-pjr3-portal]')||!['Enter',' '].includes(event.key))return;event.preventDefault();lanternState.portal=mod(Number(event.target.dataset.pjr3Portal)-1,PORTAL_COUNT);render(host,state,view,microtick,fold,lanternState);});
    render(host,state,view,microtick,fold,lanternState);renderDeep();renderFrameShip();renderAquarium();
  };
  return {BASE_TICKS,LEDGER_MICROTICKS,LEDGER_DEGREES,TIER_LABELS,OUTER_ROLE_LABELS,WHEELS,VIEW_MODES,RAIL_SEQUENCE,TRANSITION_PAIR,TRANSPOSE_RINGS,PHI_TUBES,FOLD_STATES,PENTAGON_A,PENTAGON_B,ANTIPODAL_JOINTS,PORTAL_COUNT,LANTERN_CARRIER_STATES,JUKEBOX_RECORDS,JUKEBOX_BEAT,JUKEBOX_NOTES,PENTA_MAGNET_COUNT,PENTA_MAGNET_DIRECTION,DEEP_BLUE_LOGICAL_WIDTH,DEEP_BLUE_LOGICAL_HEIGHT,FRAME_SHIP_NODE_COUNT,FRAME_SHIP_DIRECTIONS,AQUARIUM_MODES,AQUARIUM_CENTRE,ZIGZAG_ROUTE,mod,createState,address,phaseDegrees,advance,returnHome,isHome,residualFan,microtickRecord,ledger,contract,createHost,mount};
});
