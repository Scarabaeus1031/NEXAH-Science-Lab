(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.A0BreathingCrystalApertureModel=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const STAGES=['SOURCE','ALIGN','PUNCH','BREATHE','FOURIER','RETURN'];
  const MATERIALS={'orange-shadow':{label:'ORANGE SHADOW',faces:['#3a1609','#7a2f10','#c8581d','#f08a32'],edge:'#ffad5c',bracket:'#ff4fbf'},obsidian:{label:'OBSIDIAN',faces:['#020304','#0a0b0d','#17191c','#292c30'],edge:'#a4854d',bracket:'#ff4fbf'},graphite:{label:'GRAPHITE',faces:['#15171a','#2a2d31','#464b50','#6c7277'],edge:'#d0b06a',bracket:'#ff4fbf'},gold:{label:'GOLD',faces:['#3d2b08','#75510b','#b9891d','#e7c45b'],edge:'#ffe6a1',bracket:'#ff4fbf'}};
  function clamp(v,a=0,b=1){return Math.max(a,Math.min(b,v));}
  function ease(v){v=clamp(v);return v*v*(3-2*v);}
  function stageState(stage,time=0){
    const i=typeof stage==='number'?stage:STAGES.indexOf(stage),s=STAGES[clamp(i,0,STAGES.length-1)]||STAGES[0],wave=Math.sin(time*Math.PI*2);
    const state={stage:s,index:STAGES.indexOf(s),aperture:0,crystalY:.72,scale:.78,breath:0,reveal:0,returnError:0};
    if(s==='ALIGN')Object.assign(state,{aperture:.35,crystalY:.42,scale:.86});
    if(s==='PUNCH')Object.assign(state,{aperture:1,crystalY:.05,scale:.92});
    if(s==='BREATHE')Object.assign(state,{aperture:1,crystalY:0,scale:1+.035*wave,breath:.5+.5*wave});
    if(s==='FOURIER')Object.assign(state,{aperture:1,crystalY:0,scale:1+.025*wave,breath:.5+.5*wave,reveal:.72+.18*wave});
    return state;
  }
  function returnCheck(state){const expected=stageState('RETURN',0),keys=['aperture','crystalY','scale','breath','reveal'],error=Math.max(...keys.map(k=>Math.abs(state[k]-expected[k])));return{pass:error<=1e-12,error,expected,keys};}
  const BAND_ROUTE = Object.freeze(['SOURCE', 'PUNCH', 'FOURIER', 'RETURN']);

  function bandSample(address, group) {
    if (!address.connected || group?.name !== address.node || !group.points.length) {
      throw new Error('GLB-Knoten stimmt nicht mit der Bench-Adresse überein.');
    }
    const point = group.points.reduce((edge, candidate) => candidate.x > edge.x ? candidate : edge);
    const {x, y, z} = point.clone().sub(group.pivot);
    if (!Number.isFinite(x) || x <= 0 || !Number.isFinite(y) || !Number.isFinite(z)) {
      throw new Error('Keine projizierbare +X-Referenz am GLB-Knoten.');
    }
    const scale = .43 / x;
    return {
      port: address.port, node: group.name, modelSha256: address.sha256,
      reference: {x: .43, y: y * scale, z: z * scale},
      x: .43, y: (.22 * y - z) * scale
    };
  }

  function bandFrame(state, sample, material) {
    return {
      stage: state.stage,
      view: material,
      port: sample.port,
      node: sample.node,
      modelSha256: sample.modelSha256,
      x: sample.x * state.scale,
      y: state.crystalY + sample.y * state.scale
    };
  }

  function quarterTurnFrame(state, sample, material, degrees) {
    if (degrees !== 90 && degrees !== -270) throw new RangeError('Vierteldrehung: +90° oder −270° erwartet.');
    const {x, y, z} = sample.reference;
    // Both forward angles are one positive quarter turn around the GLB Z axis.
    const entered = state.stage !== 'SOURCE' && state.stage !== 'ALIGN';
    const rotated = entered ? {x: -y, y: x} : {x, y};
    const returned = state.stage === 'RETURN';
    // Both inverse angles are one negative quarter turn.
    const position = returned ? {x: rotated.y, y: -rotated.x} : rotated;
    return {
      ...bandFrame(state, {...sample, x: position.x, y: .22 * position.y - z}, material),
      angle: entered && !returned ? degrees : 0,
      ...(returned ? {inverseAngle: -degrees} : {})
    };
  }

  function checkBandReturn(frames) {
    if (frames.length !== BAND_ROUTE.length) return null;
    const source = frames[0];
    const returned = frames[frames.length - 1];
    const addressMatches = frames.every(frame =>
      frame.port === source.port && frame.node === source.node && frame.modelSha256 === source.modelSha256
    );
    const routeMatches = frames.every((frame, index) => frame.stage === BAND_ROUTE[index])
      && frames[2].view === 'orange-shadow';
    const residual = Math.hypot(returned.x - source.x, returned.y - source.y);
    return {pass: routeMatches && addressMatches && residual <= 1e-12, addressMatches, residual};
  }

  return{STAGES,MATERIALS,clamp,ease,stageState,returnCheck,BAND_ROUTE,bandSample,bandFrame,quarterTurnFrame,checkBandReturn};
});

(()=>{
  if(typeof window==='undefined')return;
  const model=window.A0BreathingCrystalApertureModel,canvas=document.getElementById('crystalCanvas');if(!model||!canvas)return;
  const ctx=canvas.getContext('2d'),img=document.getElementById('fourierTexture'),status=document.getElementById('crystalStatus');
  const stageButtons=[...document.querySelectorAll('[data-crystal-stage]')],materialButtons=[...document.querySelectorAll('[data-crystal-material]')];
  let stage=0,material='orange-shadow',running=false,stageStart=0,raf=0;
  const bandAddress = document.getElementById('crystalBandAddress');
  const bandResult = document.getElementById('crystalBandResult');
  const quarterTurn = document.getElementById('crystalQuarterTurn');
  const turnRoute = document.getElementById('crystalQuarterTurnRoute');
  const turnResults = document.getElementById('crystalQuarterTurnResults');
  const lines = [
    {label: 'A Line', angle: 90, angleLabel: '+90°', inverseLabel: '−90°', color: '#5bdce4', output: document.getElementById('crystalQuarterTurnA')},
    {label: 'B Line', angle: -270, angleLabel: '−270°', inverseLabel: '+270°', color: '#ff8cce', output: document.getElementById('crystalQuarterTurnB')}
  ];
  let tracks = [];
  let runId = 0;
  const activeTracks = () => quarterTurn.checked ? tracks : tracks.slice(0, 1);
  const frameFor = (state, track) => quarterTurn.checked
    ? model.quarterTurnFrame(state, track.sample, material, track.angle)
    : model.bandFrame(state, track.sample, material);

  function captureBandFrame() {
    const active = activeTracks();
    if (!active.length) return;
    const state = model.stageState(stage, 0);
    const captures = active.map(track => {
      const frame = frameFor(state, track);
      if (state.stage === 'SOURCE') track.frames = [];
      if (state.stage === model.BAND_ROUTE[track.frames.length]
          && (state.stage !== 'FOURIER' || material === 'orange-shadow')) track.frames.push(frame);
      return {track, frame, result: model.checkBandReturn(track.frames)};
    });
    const {frame, result} = captures[0];
    if (quarterTurn.checked) {
      bandAddress.textContent = state.stage + ' · A/B · ' + frame.port;
      for (const {track, frame: current, result: outcome} of captures) {
        const forwardAngle = current.angle ? ' · ' + track.angleLabel : '';
        const returnText = outcome
          ? ' · ' + track.inverseLabel + ' · ' + (outcome.pass ? 'PASS' : 'FAIL') + ' · Residuum ' + outcome.residual.toFixed(3)
          : forwardAngle;
        track.output.textContent = track.label + ' · ' + current.node + returnText;
      }
    } else {
      bandAddress.textContent = frame.stage + ' · ' + frame.port + ' / ' + frame.node;
    }
    bandResult.textContent = state.stage === 'RETURN'
      ? result
        ? quarterTurn.checked
          ? (captures.every(capture => capture.result?.pass) ? 'PASS · beide Adressen wieder erreicht' : 'FAIL · A/B‑Adressrücklauf')
          : (result.pass ? 'PASS · gleiche Adresse · Residuum ' : 'FAIL · Adressrücklauf · Residuum ') + result.residual.toFixed(3)
        : 'Adressrücklauf ausstehend · SOURCE, PUNCH und FOURIER mit Orange Shadow durchlaufen.'
      : 'Adressspur ' + active[0].frames.length + '/4';
  }

  async function loadBand() {
    const address = window.A0BreathingCrystalBench.runtimeState();
    const response = await fetch(address.src);
    if (!response.ok) throw new Error('GLB konnte nicht geladen werden.');
    const buffer = await response.arrayBuffer();
    const digest = await crypto.subtle.digest('SHA-256', buffer);
    const sha256 = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
    if (sha256 !== address.sha256) throw new Error('GLB-Prüfsumme weicht von der Bench ab.');
    const addresses = [address, window.A0BreathingCrystalBench.step(address, 1)];
    const groups = await window.A0GLBPointView.readPoints(buffer, addresses.map(item => item.node));
    tracks = addresses.map((item, index) => {
      const matches = groups.filter(group => group.name === item.node);
      if (matches.length !== 1) throw new Error('GLB-Knoten ist nicht eindeutig: ' + item.node);
      return {...lines[index], sample: model.bandSample(item, matches[0]), frames: []};
    });
    quarterTurn.disabled = false;
    captureBandFrame();
    draw(performance.now());
  }
  function fit(){const r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);canvas.width=Math.max(1,Math.round(r.width*d));canvas.height=Math.max(1,Math.round(r.height*d));ctx.setTransform(d,0,0,d,0,0);draw(performance.now());}
  function polygon(points,fill,stroke,width=1){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke();}
  function drawCrystal(cx,cy,size,state,palette){
    const sy=size*state.scale,rx=sy*.43,mid=cy,top=cy-sy*.72,bottom=cy+sy*.72,left=cx-rx,right=cx+rx;
    ctx.save();ctx.shadowColor=palette.edge;ctx.shadowBlur=10+state.breath*15;
    polygon([[cx,top],[right,mid],[cx,mid+sy*.12]],palette.faces[2],palette.edge,1.25);
    polygon([[cx,top],[cx,mid+sy*.12],[left,mid]],palette.faces[3],palette.edge,1.25);
    polygon([[left,mid],[cx,mid+sy*.12],[cx,bottom]],palette.faces[1],palette.edge,1.25);
    polygon([[cx,mid+sy*.12],[right,mid],[cx,bottom]],palette.faces[0],palette.edge,1.25);
    ctx.shadowBlur=0;
    if(state.reveal>0&&img.complete&&img.naturalWidth){ctx.save();ctx.beginPath();ctx.moveTo(cx,top);ctx.lineTo(right,mid);ctx.lineTo(cx,bottom);ctx.lineTo(left,mid);ctx.closePath();ctx.clip();ctx.globalAlpha=.18+.28*state.reveal;ctx.globalCompositeOperation='screen';ctx.filter='grayscale(1) sepia(1) saturate(1.6) hue-rotate(342deg)';ctx.drawImage(img,cx-sy*.58,cy-sy*.58,sy*1.16,sy*1.16);ctx.restore();}
    ctx.restore();
  }
  function draw(now){
    cancelAnimationFrame(raf);
    const w=canvas.clientWidth,h=canvas.clientHeight,t=running?(now-stageStart)/2600:0,state=model.stageState(stage,t),p=model.MATERIALS[material];ctx.clearRect(0,0,w,h);
    const bg=ctx.createRadialGradient(w*.5,h*.46,10,w*.5,h*.46,Math.max(w,h)*.68);bg.addColorStop(0,'#162127');bg.addColorStop(.48,'#090d10');bg.addColorStop(1,'#020304');ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
    ctx.strokeStyle='rgba(190,201,205,.18)';ctx.setLineDash([5,8]);ctx.beginPath();ctx.moveTo(w*.5,h*.06);ctx.lineTo(w*.5,h*.94);ctx.moveTo(w*.12,h*.37);ctx.lineTo(w*.88,h*.37);ctx.stroke();ctx.setLineDash([]);
    const ax=w*.5,ay=h*.37,rx=Math.min(w*.34,270),ry=Math.max(34,rx*.22),wall=h*.23;
    ctx.fillStyle='rgba(18,43,49,.72)';ctx.beginPath();ctx.ellipse(ax,ay+wall,rx,ry,0,0,Math.PI);ctx.lineTo(ax-rx,ay);ctx.ellipse(ax,ay,rx,ry,0,Math.PI,Math.PI*2,true);ctx.closePath();ctx.fill();ctx.strokeStyle='#5bdce4';ctx.lineWidth=2;ctx.stroke();
    ctx.strokeStyle='rgba(255,79,191,.28)';ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(ax,ay,rx,ry,0,0,Math.PI*2);ctx.stroke();
    ctx.save();ctx.strokeStyle=p.bracket;ctx.shadowColor=p.bracket;ctx.shadowBlur=14;ctx.lineWidth=5;ctx.lineCap='round';ctx.beginPath();ctx.ellipse(ax,ay,rx,ry,0,Math.PI,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.moveTo(ax-rx,ay);ctx.lineTo(ax-rx,ay+wall*.16);ctx.moveTo(ax+rx,ay);ctx.lineTo(ax+rx,ay+wall*.16);ctx.stroke();ctx.restore();
    ctx.setLineDash([8,8]);ctx.strokeStyle='rgba(215,224,226,.7)';ctx.beginPath();ctx.moveTo(ax-rx,ay);ctx.lineTo(ax,ay-ry*2.2);ctx.lineTo(ax+rx,ay);ctx.lineTo(ax,ay+ry*2.2);ctx.closePath();ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle='#0a1115';ctx.strokeStyle='#eef3f2';ctx.setLineDash([4,4]);ctx.lineWidth=1.5;ctx.beginPath();ctx.roundRect(ax-31,ay-22,62,44,10);ctx.fill();ctx.stroke();ctx.setLineDash([]);ctx.fillStyle='#f5f1e8';ctx.font='700 18px ui-monospace,monospace';ctx.textAlign='center';ctx.fillText('X|',ax,ay+6);
    if(state.reveal>0&&img.complete&&img.naturalWidth){ctx.save();ctx.globalAlpha=.08+.16*state.reveal;ctx.globalCompositeOperation='screen';ctx.drawImage(img,ax-rx*.72,ay-rx*.72,rx*1.44,rx*1.44);ctx.restore();}
    const size = Math.min(w,h)*.24;
    drawCrystal(ax,ay+state.crystalY*h*.47,size,state,p);
    for (const [index, track] of activeTracks().entries()) {
      const frame = frameFor(state, track);
      const x = ax + frame.x * size;
      const y = ay + state.crystalY * h * .47 + (frame.y - state.crystalY) * size;
      ctx.beginPath();
      ctx.arc(x, y, quarterTurn.checked && index === 0 ? 7 : 4, 0, Math.PI * 2);
      ctx.fillStyle = quarterTurn.checked ? track.color : state.stage === 'FOURIER' && material === 'orange-shadow' ? p.edge : '#5bdce4';
      ctx.fill();
      ctx.strokeStyle = '#f5f1e8';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      if (quarterTurn.checked) {
        const labelX = x + (index === 0 ? -13 : 13);
        const labelY = y - 9;
        ctx.font = '700 12px ui-monospace,monospace';
        ctx.textAlign = index === 0 ? 'right' : 'left';
        ctx.fillStyle = track.color;
        ctx.fillText(track.label + (frame.angle ? ' ' + track.angleLabel : ''), labelX, labelY);
      }
    }
    ctx.fillStyle='rgba(243,235,213,.72)';ctx.font='600 11px ui-monospace,monospace';ctx.textAlign='left';ctx.fillText(`${state.stage} · ${p.label} · VIEW LAYER`,18,h-20);
    status.textContent=state.stage==='RETURN'?'RETURN · 0.000 · VISUAL STATE RESTORED':`${String(stage+1).padStart(2,'0')} / 06 · ${state.stage} · ${p.label}`;
    if(running)raf=requestAnimationFrame(draw);
  }
  function selectStage(i,play=false){stage=model.clamp(i,0,model.STAGES.length-1);running=play&&(model.STAGES[stage]==='BREATHE'||model.STAGES[stage]==='FOURIER');stageStart=performance.now();stageButtons.forEach((b,n)=>b.toggleAttribute('aria-current',n===stage));cancelAnimationFrame(raf);captureBandFrame();draw(stageStart);}
  stageButtons.forEach((button, index) => button.addEventListener('click', () => {
    runId++;
    selectStage(index, true);
  }));
  quarterTurn.addEventListener('change', () => {
    runId++;
    turnRoute.hidden = turnResults.hidden = !quarterTurn.checked;
    selectStage(0);
  });
  materialButtons.forEach(b=>b.addEventListener('click',()=>{material=b.dataset.crystalMaterial;materialButtons.forEach(x=>x.toggleAttribute('aria-pressed',x===b));captureBandFrame();draw(performance.now());}));
  document.getElementById('crystalRun').addEventListener('click', async () => {
    const currentRun = ++runId;
    const delay = matchMedia('(prefers-reduced-motion: reduce)').matches ? 180 : 850;
    for (const [index, stageName] of model.STAGES.entries()) {
      if (currentRun !== runId) return;
      selectStage(index, stageName === 'BREATHE' || stageName === 'FOURIER');
      if (stageName !== 'RETURN') await new Promise(resolve => setTimeout(resolve, delay));
    }
  });
  document.getElementById('crystalReturn').addEventListener('click', () => {
    runId++;
    selectStage(model.STAGES.indexOf('RETURN'));
  });
  document.getElementById('crystalExport').addEventListener('click',()=>{const state=model.stageState(stage,0),payload={schema:'nexah.a0.breathing-crystal-aperture-return/1.0.0',created_at:new Date().toISOString(),identity:'NEXAH:INSTRUMENT:BREATHING_PRIME_CRYSTAL:V1',stage:model.STAGES[stage],view_role:material,aperture_role:'pink-bracket',...(quarterTurn.checked
    ? {quarter_turn_return: {axis: 'Z', lines: tracks.map(track => ({label:track.label,angle:track.angle,frames:track.frames,result:model.checkBandReturn(track.frames)}))}}
    : {band_address_return: {frames:tracks[0]?.frames || [],result:model.checkBandReturn(tracks[0]?.frames || [])}}),visual_return:model.returnCheck(model.stageState('RETURN',0)),fourier_texture:'assets/references/Fourier_Reveal_Enhanced_Inverted.png',claim_boundary:'Orange Shadow and Pink Bracket are display roles only; no measured spectrum, resonance evidence, physical prototype or material prescription.'},a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}));a.download='a0-breathing-crystal-aperture-return.json';a.click();URL.revokeObjectURL(a.href);});
  new ResizeObserver(fit).observe(canvas);img.addEventListener('load',()=>draw(performance.now()));selectStage(0,false);
  loadBand().catch(error => {
    bandAddress.textContent = 'Knotenprobe nicht verfügbar · ' + error.message;
    bandResult.textContent = 'Adressrücklauf ausstehend.';
  });
})();
