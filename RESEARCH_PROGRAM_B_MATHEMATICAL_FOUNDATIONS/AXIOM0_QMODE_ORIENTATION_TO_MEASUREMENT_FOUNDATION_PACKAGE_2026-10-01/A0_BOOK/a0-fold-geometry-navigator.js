(() => {
  'use strict';
  const $ = (q, root = document) => root.querySelector(q);
  const $$ = (q, root = document) => [...root.querySelectorAll(q)];
  const stage = $('#foldStage');
  if (!stage) return;

  const phases = [
    ['θ1 · Seed', 'Setzt den sichtbaren Anfangszustand am Pivot X.', 'M420 345 C470 270 560 270 604 334', [420,345]],
    ['θ2 · Load', 'Lädt entlang der 4:30-Linie; θ1 und θ2 bleiben gekoppelt, aber getrennt adressierbar.', 'M420 345 C455 390 500 425 540 468', [540,468]],
    ['θ3 · Guide', 'Führt die Richtung zwischen Last und Gate.', 'M420 345 C390 300 365 270 335 260', [335,260]],
    ['θ4 · D/E Gate · SMACK', 'Wandert nach innen und markiert den D/E-Übergang als deklarierte Gate-Ansicht.', 'M335 260 C370 300 395 327 420 345', [420,345]],
    ['θ5 · Pressure', 'Hält den Druck vor dem Return; Z bleibt die deklarierte Stabilitätsachse.', 'M420 345 C485 335 548 300 603 272', [603,272]],
    ['θ5+1 · SNAP · X10 · 0', 'Closure-Event: Snap und View-Return zur Nulladresse. Keine sechste Theta-Station.', 'M603 272 C555 185 442 205 420 345', [420,345]]
  ];
  const levels = [
    ['LOCAL CUBE · 7-GON ROOT', 'Nested cubic field · level 1', 1],
    ['EXPANDED CUBE · 17-GON FIELD', 'Nested cubic field · level 2', 2],
    ['HYPER CUBE · 12³ / 13⁴…', 'Nested cubic field · level 3', 3],
    ['NEXUS CUBE · BEYOND / OPEN', 'Declared horizon · no closure claimed', 4]
  ];
  const foldLines = {
    x: {a:[105,345], b:[735,345], state:'CONSTRUCTED', residual:0},
    z: {a:[192,570], b:[648,120], state:'CONSTRUCTED', residual:0},
    incident: {a:[168,500], b:[676,190], state:'INCIDENT', residual:0.006},
    miss: {a:[168,535], b:[676,244], state:'MISS', residual:0.084}
  };
  const sequencePhases = [
    {title:'θ1 · Potential',role:'Carrier und Möglichkeit werden gesetzt.',address:'ABC | G | DEF · start',point:[450,122],key:0},
    {title:'θ2 · Relation',role:'Load koppelt die beiden Halbraumansichten am gemeinsamen Stamm.',address:'A–B–C → G · load',point:[290,500],key:2},
    {title:'θ3 · Orientation',role:'Die linke Führung erhält eine deklarierte Richtung.',address:'ABC → G · guide',point:[285,300],key:5},
    {title:'θ4 · Alignment',role:'Der D–E-Übergang wandert nach innen und hält am Gate.',address:'D | E · G-axis hold',point:[410,365],key:7},
    {title:'θ5 · Motion',role:'Pressure wird als rechte Update-Ansicht geführt.',address:'G → D–E–F · pressure',point:[615,300],key:9},
    {title:'θ5+1 · Return',role:'SNAP schließt die Ansicht über XX und X10 zur Nulladresse.',address:'DEF → G → XX · return 0',point:[450,470],key:12}
  ];
  const pascalStages = [
    {depth:2,badge:'01 · 1:2:1 SEED',code:'DEPTH 2 · LOCAL FACE',title:'1:2:1 · lokale Ausgangssignatur',text:'Die dritte Reihe zeigt die vorhandene 1:2:1-Lesart. Jede Reihenlast ist exakt 2ⁿ.'},
    {depth:3,badge:'02 · 7:8 THRESHOLD',code:'DEPTH 3 · SHELL / CORE',title:'7:8 · der Innenraum überholt die Hülle',text:'Sieben Rand-Einsen umgeben die innere Last 2+3+3=8. Gesamtlast: 15=2⁴−1.'},
    {depth:4,badge:'03 · 14641 BRIDGE',code:'DEPTH 4 · ROW SIGNATURE',title:'1–4–6–4–1 · 14641 = 11⁴',text:'Die fünfte Reihe trägt die exakte 14641-Signatur und hat Reihenlast 16=2⁴.'},
    {depth:6,badge:'04 · SCC-003 LOCAL FACE',code:'DEPTH 6 · FACEWISE ONLY',title:'13 Positionen · Last 96 · lokale Fläche',text:'Die Reihen 5 und 6 enthalten 6+7=13 Positionen und Last 32+64=96. Sie sind nicht die fünf SCC-003-Makroflächen.'}
  ];
  let phase = 0, timer = null, flips = 0, pascalStage = 0, pascalTimer = null, pascalLens = 'shell';

  function cubePath(cx, cy, size, depth) {
    const x = cx-size/2, y = cy-size/2, d = depth;
    return [
      `M${x} ${y}H${x+size}V${y+size}H${x}Z`,
      `M${x+d} ${y-d}H${x+size+d}V${y+size-d}H${x+d}Z`,
      `M${x} ${y}L${x+d} ${y-d}M${x+size} ${y}L${x+size+d} ${y-d}M${x+size} ${y+size}L${x+size+d} ${y+size-d}M${x} ${y+size}L${x+d} ${y+size-d}`
    ];
  }
  function renderCubes(count = 1) {
    const layer = $('#cubeHierarchy'); layer.innerHTML = '';
    const dims = [[360,95],[270,72],[180,48],[100,28]];
    dims.slice(0, count).forEach((d, i) => cubePath(420,345,d[0],d[1]).forEach(path => {
      const p = document.createElementNS('http://www.w3.org/2000/svg','path'); p.setAttribute('d',path); p.style.opacity = String(.42 + i*.16); layer.appendChild(p);
    }));
  }
  function setLevel(index) {
    const [code,title,count] = levels[index]; $('#hierarchyCode').textContent=code; $('#hierarchyTitle').textContent=title; renderCubes(count);
    $$('[data-level]').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.level)===index)));
  }
  function setPhase(index) {
    phase = (index + phases.length) % phases.length;
    const [title,text,path,node] = phases[phase];
    $('#eventBadge').textContent=title; $('#phaseTitle').textContent=title; $('#phaseText').textContent=text; $('#phaseLabel').textContent=title.toLowerCase();
    $('#phaseArc').setAttribute('d',path); $('#phaseNode').setAttribute('cx',node[0]); $('#phaseNode').setAttribute('cy',node[1]);
    $$('#phaseRail li').forEach((li,i) => i===phase ? li.setAttribute('aria-current','step') : li.removeAttribute('aria-current'));
    updateSequenceMap(phase);
  }
  function updateSequenceMap(index) {
    if (!$('#sequenceMap')) return;
    const current=sequencePhases[index],points=sequencePhases.slice(0,index+1).map(item=>item.point);
    const trace=points.length===1?`M${points[0][0]} ${points[0][1]}`:`M${points.map(point=>point.join(' ')).join(' L')}`;
    $('#sequenceTrace').setAttribute('d',trace); $('#sequenceState').textContent=current.title.toUpperCase();
    $('#sequenceTitle').textContent=current.title; $('#sequenceRole').textContent=current.role; $('#sequenceAddress').textContent=current.address;
    $$('[data-sequence-phase]').forEach((node,i)=>node.classList.toggle('active',i===index));
    $$('#operatorSpine li').forEach((item,i)=>i===index?item.setAttribute('aria-current','step'):item.removeAttribute('aria-current'));
    $$('[data-key-index]').forEach(key=>key.classList.toggle('active',Number(key.dataset.keyIndex)===current.key));
  }
  function togglePlay() {
    if (timer) { clearInterval(timer); timer=null; $('#playPhase').textContent='▶ Folge'; return; }
    $('#playPhase').textContent='Ⅱ Pause'; timer=setInterval(()=>setPhase(phase+1), 1150);
  }
  function setFold(key) {
    const v=foldLines[key], line=$('#foldLine'); ['x1','y1','x2','y2'].forEach((a,i)=>line.setAttribute(a,[...v.a,...v.b][i]));
    const dx=v.b[0]-v.a[0],dy=v.b[1]-v.a[1],t=((420-v.a[0])*dx+(345-v.a[1])*dy)/(dx*dx+dy*dy);
    $('#foldHit').setAttribute('cx',v.a[0]+t*dx); $('#foldHit').setAttribute('cy',v.a[1]+t*dy);
    $('#incidenceState').textContent=v.state; $('#incidenceState').style.color=v.state==='MISS'?'var(--red)':'var(--green)'; $('#incidenceResidual').textContent=`residual = ${v.residual.toFixed(3)}`;
  }
  function setFlips(n, returned=false) {
    flips=n; const value=returned?'0':(n%2===0?'+1':'−1'); $('#parityFormula').textContent=returned?'X10 · return address 0':`(−1)^${n} = ${value}`;
    $$('.parity-track span').forEach(s=>s.classList.remove('active')); const target=returned?'#parityReturn':`#parity${n}`; $(target)?.classList.add('active');
    $$('[data-flip]').forEach(b=>b.classList.toggle('active',Number(b.dataset.flip)<=n && !returned));
  }
  const mirrorPoint = (a,b,k=1) => a + k*(b-a)/64;
  const mirrorJ = (x,a,b) => a+b-x;
  const nearlyEqual = (a,b,epsilon=1e-9) => Number.isFinite(a) && Number.isFinite(b) && Math.abs(a-b) <= epsilon*Math.max(1,Math.abs(a),Math.abs(b));
  const numberText = value => Number.isFinite(value) ? Number(value.toFixed(9)).toString() : 'undefined';
  function renderRoomRail(k=1) {
    const rail=$('#roomRail'); if(!rail) return;
    rail.innerHTML='';
    for(let i=1;i<=64;i+=1){const cell=document.createElement('i');cell.className=i<=k?'crossed':'retained';cell.title=`room ${i}`;rail.appendChild(cell)}
  }
  function updateMirrorEdge() {
    const a=Number($('#mirrorA').value),b=Number($('#mirrorB').value),k=Number($('#mirrorK').value);
    const p=mirrorPoint(a,b,k),j=mirrorJ(p,a,b),j2=mirrorJ(j,a,b),sub=k===1?'₁':`(${k})`;
    $('#mirrorKValue').textContent=String(k); $('#startValue').textContent=numberText(a); $('#endValue').textContent=numberText(b);
    $('#crossingNode').textContent=`P${sub} = ${numberText(p)}`; $('#mirrorPoint').textContent=`P${sub} = ${numberText(p)}`;
    $('#mirrorJ').textContent=`J(P) = ${numberText(j)}`; $('#mirrorJ2').textContent=`J²(P) = ${numberText(j2)}`;
    renderRoomRail(k); updateRatio(p);
  }
  function updateRatio(p=mirrorPoint(Number($('#mirrorA').value),Number($('#mirrorB').value),Number($('#mirrorK').value))) {
    const r=Number($('#ratioR').value),t=Number($('#ratioT').value),ratio=t===0?NaN:r/t,match=nearlyEqual(ratio,p);
    $('#ratioValue').textContent=`R/T = ${numberText(ratio)}`; $('#ratioMatch').textContent=match?'MATCH · affine P':'SEPARATE · affine P'; $('#ratioMatch').dataset.match=String(match);
  }
  function setSliceStatus(state) {
    const labels={q:'SLICE · Q PASS',d:'SLICE · D PASS',both:'SLICE · BOTH',neither:'SLICE · NEITHER'};
    $('#sliceStatus').textContent=labels[state]; $('#sliceStatus').dataset.state=state; $('#darkSpot').dataset.state=state;
    $('#split-rest-sequence')?.setAttribute('data-slice-state',state);
    const spotLabels={q:'Q view · declared',d:'D view · declared',both:'overlap · both declared',neither:'RGB fracture · unclassified crossing'};
    $('#darkSpot b').textContent=spotLabels[state];
    $$('[data-slice]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.slice===state)));
  }
  const orientedRest = (value,width=4) => {
    const lower=Math.floor(value/width),upper=Math.ceil(value/width),rest=value-width*lower,deficit=value-width*upper;
    return {value,width,lower,upper,rest,deficit,lowerFraction:rest/width,upperFraction:Math.abs(deficit)/width};
  };
  function setRestView(view) {
    const rest=orientedRest(8451,4),below=view==='below';
    $('#restEquation').textContent=below?`8451 = 4 × ${rest.lower} + ${rest.rest}`:`8451 = 4 × ${rest.upper} ${rest.deficit}`;
    $('#restText').innerHTML=below?`Vom unteren Bound gelesen liegt der Punkt bei <strong>+${rest.rest}/${rest.width}</strong> des Intervalls.`:`Vom oberen Bound gelesen liegt derselbe Punkt bei <strong>${rest.deficit}/${rest.width}</strong> des Intervalls.`;
    $$('[data-rest-view]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.restView===view)));
  }
  const pascalRow = n => {
    const row=[1];
    for(let k=1;k<=n;k+=1) row.push(row[k-1]*(n-k+1)/k);
    return row;
  };
  const pascalTriangle = depth => Array.from({length:depth+1},(_,n)=>pascalRow(n));
  const pascalShellCore = depth => {
    const total=2**(depth+1)-1,shell=2*depth+1;
    return {depth,total,shell,core:total-shell};
  };
  const isPrime = value => {
    if(!Number.isInteger(value)||value<2) return false;
    for(let divisor=2;divisor*divisor<=value;divisor+=1) if(value%divisor===0) return false;
    return true;
  };
  const superscript = value => String(value).replace(/\d/g,d=>'⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(d)]);
  function renderPascal(stageIndex=pascalStage) {
    const root=$('#pascalTriangle');
    if(!root) return;
    const stage=pascalStages[stageIndex],rows=pascalTriangle(stage.depth);
    root.innerHTML=''; root.dataset.stage=String(stageIndex); root.dataset.lens=pascalLens;
    rows.forEach((row,n)=>{
      const line=document.createElement('div'); line.className='pascal-row'; line.dataset.row=String(n);
      if(stageIndex===2&&n===4) line.classList.add('focus-row');
      if(stageIndex===3&&(n===5||n===6)) line.classList.add('lower-pair');
      row.forEach((value,k)=>{
        const cell=document.createElement('span');
        const center=n%2===0?k===n/2:(k===Math.floor(n/2)||k===Math.ceil(n/2));
        cell.className=['pascal-cell',k===0||k===n?'shell':'core',center?'spine':'',isPrime(value)?'prime':'',value%2?'odd':'even'].filter(Boolean).join(' ');
        cell.dataset.row=String(n); cell.dataset.column=String(k); cell.dataset.value=String(value); cell.textContent=String(value);
        cell.title=`C(${n},${k}) = ${value}`; line.appendChild(cell);
      });
      root.appendChild(line);
    });
    const metrics=pascalShellCore(stage.depth),row=rows[stage.depth],rowSum=row.reduce((sum,value)=>sum+value,0);
    $('#pascalStageBadge').textContent=stage.badge; $('#pascalStageCode').textContent=stage.code; $('#pascalStageTitle').textContent=stage.title; $('#pascalStageText').textContent=stage.text;
    $('#pascalRowReadout').textContent=stageIndex===3?'rows 5+6 · 6+7=13':row.join(' · ');
    $('#pascalRowSum').textContent=stageIndex===3?'32 + 64 = 96':`${rowSum} = 2${superscript(stage.depth)}`;
    $('#pascalCumulative').textContent=`${metrics.total} = 2${superscript(stage.depth+1)} − 1`;
    $('#pascalShellCore').textContent=`${metrics.shell} / ${metrics.core}`;
    $$('[data-pascal-stage]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.pascalStage)===stageIndex)));
  }
  function setPascalStage(index) {
    pascalStage=(index+pascalStages.length)%pascalStages.length;
    renderPascal(pascalStage);
  }
  function setPascalLens(lens) {
    pascalLens=lens; $('#pascalTriangle').dataset.lens=lens;
    $$('[data-pascal-lens]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.pascalLens===lens)));
  }
  function togglePascalPlay() {
    if(pascalTimer){clearInterval(pascalTimer);pascalTimer=null;$('#playPascal').textContent='▶ Folge';return;}
    $('#playPascal').textContent='Ⅱ Pause';pascalTimer=setInterval(()=>setPascalStage(pascalStage+1),1450);
  }

  $$('[data-level]').forEach(b=>b.addEventListener('click',()=>setLevel(Number(b.dataset.level))));
  $$('[data-phase]').forEach(b=>b.addEventListener('click',()=>setPhase(Number(b.dataset.phase))));
  $('#stepPhase').addEventListener('click',()=>setPhase(phase+1)); $('#playPhase').addEventListener('click',togglePlay);
  $$('[data-axis-toggle]').forEach(b=>b.addEventListener('click',()=>{const key=b.dataset.axisToggle,on=b.getAttribute('aria-pressed')==='true';b.setAttribute('aria-pressed',String(!on));$(`[data-axis="${key}"]`).classList.toggle('hidden',on)}));
  $('#foldSelect').addEventListener('change',e=>setFold(e.target.value));
  $('#bodyToggle').addEventListener('click',e=>{const on=e.currentTarget.getAttribute('aria-pressed')==='true';e.currentTarget.setAttribute('aria-pressed',String(!on));$('#bodyOverlay').classList.toggle('visible',!on)});
  $('#motionToggle').addEventListener('click',e=>{const on=e.currentTarget.getAttribute('aria-pressed')==='true';e.currentTarget.setAttribute('aria-pressed',String(!on));e.currentTarget.textContent=on?'Motion off':'Motion on';if(on&&timer)togglePlay()});
  $$('[data-flip]').forEach(b=>b.addEventListener('click',()=>setFlips(Number(b.dataset.flip)))); $('#x10Return').addEventListener('click',()=>setFlips(3,true));
  ['#mirrorA','#mirrorB','#mirrorK'].forEach(id=>$(id)?.addEventListener('input',updateMirrorEdge));
  ['#ratioR','#ratioT'].forEach(id=>$(id)?.addEventListener('input',()=>updateRatio()));
  $$('[data-slice]').forEach(b=>b.addEventListener('click',()=>setSliceStatus(b.dataset.slice)));
  $$('[data-sequence-phase]').forEach(node=>{node.addEventListener('click',()=>setPhase(Number(node.dataset.sequencePhase)));node.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();setPhase(Number(node.dataset.sequencePhase));}})});
  $$('[data-rest-view]').forEach(button=>button.addEventListener('click',()=>setRestView(button.dataset.restView)));
  $$('[data-pascal-stage]').forEach(button=>button.addEventListener('click',()=>setPascalStage(Number(button.dataset.pascalStage))));
  $$('[data-pascal-lens]').forEach(button=>button.addEventListener('click',()=>setPascalLens(button.dataset.pascalLens)));
  $('#stepPascal')?.addEventListener('click',()=>setPascalStage(pascalStage+1)); $('#playPascal')?.addEventListener('click',togglePascalPlay);
  renderCubes(1); setPhase(0); setFold('x'); setFlips(0); updateMirrorEdge(); setSliceStatus('neither'); setRestView('below'); renderPascal(0); setPascalLens('shell');

  window.A0FoldGeometry = { phases, sequencePhases, pascalStages, levels, foldLines, arithmetic:{cubeTrinity:23**3+24**3+25**3,square204:204**2,foldCube:12**3,mirror63:3**2*7,mirror64:4**3,splitRest:orientedRest(8451,4),pascalThreshold:pascalShellCore(3)}, mirrorPoint, mirrorJ, nearlyEqual, orientedRest, pascalRow, pascalTriangle, pascalShellCore, isPrime, parity:n=>(-1)**n };
})();
