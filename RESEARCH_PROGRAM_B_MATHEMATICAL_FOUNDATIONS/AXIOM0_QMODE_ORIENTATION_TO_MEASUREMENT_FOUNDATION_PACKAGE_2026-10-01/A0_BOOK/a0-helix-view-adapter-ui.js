(function(){
  'use strict';
  const root=document.querySelector('[data-helix-adapter]');
  const M=window.A0HelixViewAdapter;
  if(!root||!M)return;
  const canvas=root.querySelector('[data-hv-canvas]'),ctx=canvas.getContext('2d');
  const modeButtons=[...root.querySelectorAll('[data-hv-mode]')],strandButtons=[...root.querySelectorAll('[data-hv-strand]')],registerButtons=[...root.querySelectorAll('[data-hv-register]')],railToggle=root.querySelector('[data-hv-rail]');
  const mixInput=root.querySelector('[data-hv-mix]'),phaseOut=root.querySelector('#helixPhaseOut');
  const phaseControl=root.querySelector('.hv-phase-control'),zetaControl=root.querySelector('[data-hv-zeta-control]'),logXInput=root.querySelector('[data-hv-logx]'),betaOffsetInput=root.querySelector('[data-hv-beta-offset]');
  const residueControl=root.querySelector('[data-hv-residue-control]'),residueAngleButtons=[...root.querySelectorAll('[data-hv-residue-angle]')],residueSummary=root.querySelector('[data-hv-residue-summary]');
  const mod7Panel=root.querySelector('[data-hv-mod7-panel]');
  const mod7Toggle=root.querySelector('[data-hv-mod7-toggle]');
  const sliceToggle=root.querySelector('[data-hv-slice-toggle]');
  const mod7Help=root.querySelector('[data-hv-mod7-help]');
  const slicePanel=root.querySelector('[data-hv-slice-panel]');
  const fourierPanel=root.querySelector('[data-hv-fourier-panel]');
  const fourierCharts=fourierPanel.querySelector('[data-hv-fourier-charts]');
  const fourierWindow=fourierPanel.querySelector('[data-hv-fourier-window]');
  const fourierRows=fourierPanel.querySelector('[data-hv-fourier-rows]');
  const fourierFormat=new Intl.NumberFormat('de-DE',{minimumFractionDigits:3,maximumFractionDigits:3});
  let fourierComparison;
  const sliceStatus=root.querySelector('[data-hv-slice-status]');
  const sliceStrip=root.querySelector('[data-hv-slice-strip]');
  const sliceCounts=root.querySelector('[data-hv-slice-counts]');
  const sliceMarker=root.querySelector('[data-hv-slice-marker]');
  const sliceTargets=root.querySelector('[data-hv-slice-targets]');
  const sliceDistances=[...root.querySelectorAll('[data-hv-slice-distance]')].map(cell=>{
    const key=cell.dataset.hvSliceDistance;
    const target=sliceTargets.querySelector('[data-hv-slice-target="'+key+'"]');
    const arc=sliceTargets.querySelector('[data-hv-slice-arc="'+key+'"]');
    const arcValue=sliceTargets.querySelector('[data-hv-slice-arc-value="'+key+'"]');
    return {cell,key,target,arc,arcValue};
  });
  const sliceAngleFormat=new Intl.NumberFormat('de-DE',{maximumFractionDigits:3});
  const slicePlanRadius=68;
  const octagonStep=M.TAU/8;
  const jacketOffset=octagonStep/2;
  const jacketRadius=slicePlanRadius/Math.cos(jacketOffset);

  function slicePlanPoint(radius,angle){
    return [radius*Math.sin(angle),-radius*Math.cos(angle)].join(',');
  }

  function octagonPoints(radius,offset){
    return Array.from({length:8},(_,index)=>slicePlanPoint(radius,offset+index*octagonStep)).join(' ');
  }

  function sliceArcPath(start,end,radius,cornerRadius){
    const sweep=end>start?1:0;
    return 'M'+slicePlanPoint(slicePlanRadius,start)
      +' L'+slicePlanPoint(radius,start)
      +' A'+radius+','+radius+' 0 0 '+sweep+' '+slicePlanPoint(radius,end)
      +' L'+slicePlanPoint(cornerRadius,end);
  }

  root.querySelector('[data-hv-slice-inner]').setAttribute('points',octagonPoints(slicePlanRadius,0));
  root.querySelector('[data-hv-slice-outer]').setAttribute('points',octagonPoints(jacketRadius,jacketOffset));
  sliceTargets.querySelector('[data-hv-slice-target="j"]').setAttribute('cy',String(-jacketRadius));
  const indexLabel=root.querySelector('[data-hv-index-label]');
  const cameraNote=root.querySelector('[data-hv-camera-note]');

  function sliceHit(residue){
    if(residue===2)return 'green';
    if(residue===6)return 'pink';
    return 'gap';
  }

  const sliceCells=M.primeResidueRecords().map(record=>{
    const cell=document.createElement('span');
    cell.dataset.hit=sliceHit(record.residue7);
    cell.title='Ebene '+record.index+' · '+record.prime+' · Rest '+record.residue7;
    return cell;
  });
  sliceStrip.append(...sliceCells);
  const countHits=hit=>sliceCells.filter(cell=>cell.dataset.hit===hit).length;
  sliceCounts.textContent=countHits('green')+' Grün · '+countHits('pink')+' Pink · '+countHits('gap')+' Lücken';
  function setupSliceSpectra(){
    const windows=M.mod7FourierComparison();
    const scale=Math.max(...windows.flatMap(({tracks})=>tracks.flatMap(track=>[track.peak.amplitude,...track.mixed95])));
    fourierComparison={windows,scale};
    windows.forEach(({start,end,first,last,tracks},index)=>{
      fourierWindow.add(new Option(`Rang ${start}–${end} · ${first}–${last}`,String(index)));
      for(const track of tracks){
        const {hit,hits,reference,peak,bins,mixed95,max95}=track;
        const row=fourierRows.insertRow();
        row.dataset.hit=hit;
        const heading=document.createElement('th');
        heading.scope='row';
        heading.textContent=`${start}–${end}`;
        row.append(heading);
        const values=[hit==='green'?'Grün':'Pink',hits,
          `${peak.bin} · ${fourierFormat.format(peak.amplitude)}`,
          `${reference} · ${fourierFormat.format(bins[reference-1].amplitude)}`,
          fourierFormat.format(mixed95[reference-1]),fourierFormat.format(max95)];
        for(const value of values)row.insertCell().textContent=value;
      }
    });
    renderSliceSpectra();
  }

  function renderSliceSpectra(){
    const {windows,scale}=fourierComparison;
    const {tracks}=windows[Number(fourierWindow.value)];
    const format=value=>fourierFormat.format(value);
    const charts=tracks.map(({hit,residue,hits,reference,peak,bins,mixed95})=>{
      const figure=document.createElement('figure');
      figure.dataset.hit=hit;
      const caption=document.createElement('figcaption');
      const title=document.createElement('strong');
      title.textContent=(hit==='green'?'Grün':'Pink')+' · p mod 7 = '+residue;
      const summary=document.createElement('span');
      summary.textContent=`${hits} Treffer · Maximum k=${peak.bin} (${format(peak.amplitude)})`;
      caption.append(title,summary);
      const plot=document.createElement('div');
      plot.className='hv-fourier-plot';
      plot.setAttribute('aria-hidden','true');
      for(const {bin,amplitude} of bins){
        const threshold=mixed95[bin-1];
        const bar=document.createElement('span');
        bar.style.setProperty('--fill',(100*amplitude/scale)+'%');
        bar.style.setProperty('--mixed',(100*threshold/scale)+'%');
        bar.title=`k=${bin} · Amplitude ${format(amplitude)} · Misch-95 % ${format(threshold)}`;
        plot.append(bar);
      }
      const axis=document.createElement('div');
      axis.className='hv-fourier-axis';
      for(const label of ['1','21','42','63','84']){
        const tick=document.createElement('span');
        tick.textContent=label;
        axis.append(tick);
      }
      const readout=document.createElement('p');
      readout.textContent=`Referenz k=${reference} · ${format(bins[reference-1].amplitude)} · Misch-95 % ${format(mixed95[reference-1])}`;
      figure.append(caption,plot,axis,readout);
      return figure;
    });
    fourierCharts.replaceChildren(...charts);
  }
  fourierWindow.addEventListener('change',renderSliceSpectra);

  let highlightedSlice=null;
  const stackPanel=root.querySelector('[data-hv-stack-panel]');
  const stackToggle=root.querySelector('[data-hv-stack-toggle]');
  const stackLinks=root.querySelector('[data-hv-stack-snapshots]');
  const primeCubeLink=root.querySelector('[data-hv-primecube-return]');
  const stackSnapshots=M.buildPrimeResidueGeometry(M.primeResidueRecords()).stack51;
  function cubeReturnUrl(record){
    const query=new URLSearchParams({helix:record.sourceIds[0]});
    return 'A0_PRIMECUBE_GAP_FOLD_LAB.html?'+query+'#shadow-cube-slice-overlay';
  }
  stackSnapshots.forEach(record=>{
    const link=document.createElement('a');
    link.className='hv-stack-snapshot';
    link.href=cubeReturnUrl(record);
    link.textContent=record.prime+' · Ebene '+record.index+' ↗';
    link.dataset.stackIndex=record.index;
    stackLinks.append(link);
  });
  const zetaLensButtons=[...root.querySelectorAll('[data-hv-zeta-lens]')],traceWordButtons=[...root.querySelectorAll('[data-hv-trace-word]')],traceSwitch=root.querySelector('[data-hv-trace-switch]');
  const zetaSummary=root.querySelector('[data-hv-zeta-summary]'),betaLabel=root.querySelector('[data-hv-beta-label]'),zetaX=root.querySelector('[data-hv-zeta-x]'),zetaLogX=root.querySelector('[data-hv-zeta-logx]'),zetaRho=root.querySelector('[data-hv-zeta-rho]'),zetaTheta=root.querySelector('[data-hv-zeta-theta]'),zetaEnvelope=root.querySelector('[data-hv-zeta-envelope]'),zetaContribution=root.querySelector('[data-hv-zeta-contribution]'),zetaLensOut=root.querySelector('[data-hv-zeta-lens-out]'),zetaWitness=root.querySelector('[data-hv-zeta-witness]');
  const turnsOut=root.querySelector('[data-hv-turns]'),iotaOut=root.querySelector('[data-hv-iota]'),daoOut=root.querySelector('[data-hv-dao]'),pitchOut=root.querySelector('[data-hv-pitch]'),curvatureOut=root.querySelector('[data-hv-curvature]'),torsionOut=root.querySelector('[data-hv-torsion]');
  const kinkTracker=root.querySelector('[data-hv-kink-tracker]');
  const kinkAngle=kinkTracker.querySelector('[data-hv-kink-angle]');
  const kinkAngleOut=kinkTracker.querySelector('[data-hv-kink-angle-out]');
  const kinkPlay=kinkTracker.querySelector('[data-hv-kink-play]');
  const kinkWord=kinkTracker.querySelector('[data-hv-kink-word]');
  const kinkPositions=[...kinkTracker.querySelectorAll('[data-hv-kink-position]')];
  const kinkColors=['#ffd276','#fa9dcd'];
  const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)');
  let traceAngle=0,kinkFrame=null;
  const termPanel=root.querySelector('#helix-phase-term-comparison');
  const termPrime=termPanel.querySelector('[data-hv-term-prime]');
  const termRepeats=termPanel.querySelector('[data-hv-term-repeats]');
  const termReference=termPanel.querySelector('[data-hv-term-reference]');
  const iharaRoute=termPanel.querySelector('[data-hv-term-ihara-route]');
  const iharaStatus=termPanel.querySelector('[data-hv-term-ihara-status]');
  const termRows=termPanel.querySelector('[data-hv-term-rows]');
  const indexInput=root.querySelector('[data-hv-index]'),prev=root.querySelector('[data-hv-prev]'),next=root.querySelector('[data-hv-next]');
  const recordEl=root.querySelector('[data-hv-record]'),pairEl=root.querySelector('[data-hv-pair]'),detailEl=root.querySelector('[data-hv-detail]'),countEl=root.querySelector('[data-hv-count]'),strandReadout=root.querySelector('[data-hv-strand-readout]'),registerReadout=root.querySelector('[data-hv-register-readout]');
  let mode='twins',strandMode='double',registerMode='pair',residueAngle='paired',mix=0,logX=Math.log(1000),betaOffset=0,zetaLens='smooth',traceWord='RLLR',showRail=true,selected=0,rotX=-0.08,rotY=0.42,drag=null,screenRungs=[];

  function css(name){return getComputedStyle(document.documentElement).getPropertyValue(name).trim()}
  function records(){return M.modeRecords(mode)}
  let geometryKey=null,cachedGeometry=null,rotationFrame=null;
  function geometry(){
    const key=[mode,mix,strandMode,logX,betaOffset,zetaLens,traceWord,residueAngle].join('|');
    if(key!==geometryKey){
      cachedGeometry=M.buildGeometry(records(),{mix,strandMode,logX,betaOffset,zetaLens,traceWord,residueAngle});
      geometryKey=key;
    }
    return cachedGeometry;
  }
  function mod7Slicing(){return mode==='residue'&&residueAngle==='mod7'&&sliceToggle.checked}
  function mod7PointAxes(){return mode==='residue'&&residueAngle==='mod7'&&(mod7Toggle.checked||mod7Slicing())}
  function doubleView(){return mode==='residue'?residueAngle==='paired':strandMode==='double'}
  function resize(){
    const rect=canvas.getBoundingClientRect(),dpr=Math.min(2,window.devicePixelRatio||1);
    if(canvas.width!==Math.round(rect.width*dpr)||canvas.height!==Math.round(rect.height*dpr)){canvas.width=Math.round(rect.width*dpr);canvas.height=Math.round(rect.height*dpr)}
    ctx.setTransform(dpr,0,0,dpr,0,0);draw();
  }
  function rotateTracePoint({x,y,z}){
    const radians=traceAngle*Math.PI/180,cosine=Math.cos(radians),sine=Math.sin(radians);
    return {x:x*cosine-y*sine,y:x*sine+y*cosine,z};
  }
  function activeTraceKinks(g){
    const block=Math.floor(selected/g.trace.symbols.length)*g.trace.symbols.length;
    return g.trace.kinkPositions.map(index=>g.rungs[block+index]);
  }
  function project(point,w,h){
    if(mode==='zeta'&&zetaLens==='trace'&&traceAngle!==0)point=rotateTracePoint(point);
    const pitch=mod7PointAxes()?0:rotX;
    const cy=Math.cos(rotY),sy=Math.sin(rotY),cx=Math.cos(pitch),sx=Math.sin(pitch);
    const x1=point.x*cy-point.z*sy,z1=point.x*sy+point.z*cy;
    const y2=point.y*cx-z1*sx,z2=point.y*sx+z1*cx;
    const scale=Math.min(w,h)*(mod7Slicing()?.26:.38),perspective=4.4/(4.4+z2);
    return{x:w/2+x1*scale*perspective,y:h/2+y2*scale*perspective,z:z2,p:perspective};
  }
  function path(points,color,width=1,alpha=1){
    if(!points.length)return;ctx.save();ctx.globalAlpha=alpha;ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(points[0].x,points[0].y);for(let i=1;i<points.length;i++)ctx.lineTo(points[i].x,points[i].y);ctx.stroke();ctx.restore();
  }
  function dot(point,r,color,stroke){ctx.beginPath();ctx.arc(point.x,point.y,r,0,M.TAU);ctx.fillStyle=color;ctx.fill();if(stroke){ctx.lineWidth=2;ctx.strokeStyle=stroke;ctx.stroke()}}
  function registerOverlay(g,w,h,colors){
    if(mode==='zeta'||mode==='residue'||registerMode==='pair')return;
    if(registerMode==='fh14'||registerMode==='triad21'){
      const bundle=M.registerGeometry(registerMode,g.rungs.length,{step:g.step,radius:g.innerRadius*1.18,height:g.height});
      const palette=registerMode==='fh14'?[colors.a,colors.b]:[colors.a,colors.blue,colors.b];
      bundle.strands.forEach((strand,i)=>path(strand.points.map(p=>project(p,w,h)),palette[registerMode==='fh14'?(strand.family==='F'?0:1):(strand.triad-1)],registerMode==='fh14'?1.1:.9,registerMode==='fh14'?.28:.2));
      return;
    }
    const y=g.rungs[selected]&&g.rungs[selected].strandA.y||0,frame=M.z37Frame({y,radius:g.innerRadius*1.3});
    const ring=frame.points.map(p=>project(p,w,h));
    path([...ring,ring[0]],colors.blue,1.2,.55);
    frame.pairs.forEach(pair=>path([project(pair.pointA,w,h),project(pair.pointB,w,h)],colors.line,.75,.22));
    path(frame.axis.map(p=>project(p,w,h)),colors.text,2,.85);
    ring.forEach((p,r)=>dot(p,r===0?5:(r===18||r===19?4:2.1),r===0?colors.text:(r===18||r===19?colors.b:colors.blue)));
  }
  function drawResidueStack(stack,w,h){
    const violet='#cc93ff',gold='#ffdf72';
    const pairs=stack.map(rung=>({
      rung,a:project(rung.point7,w,h),b:project(rung.point11,w,h)
    }));
    const axis7=pairs.map(pair=>pair.a),axis11=pairs.map(pair=>pair.b);
    for(const [axis,color] of [[axis7,violet],[axis11,gold]]){
      path(axis,'#07101b',6);
      path(axis,color,2.7);
    }
    for(const {rung,a,b} of pairs){
      const active=rung.index-1===selected;
      path([a,b],'#07101b',active?5:4);
      path([a,b],'#eaf0f8',active?2:1.1,active?1:.72);
      dot(a,active?7:5.3,violet,'#07101b');
      dot(b,active?7:5.3,gold,'#07101b');
      const label=a.x>b.x?a:b;
      ctx.save();
      ctx.font='700 12px ui-monospace, monospace';
      ctx.lineWidth=4;
      ctx.strokeStyle='#07101b';
      ctx.fillStyle='#eaf0f8';
      ctx.strokeText(String(rung.prime),label.x+10,label.y-5);
      ctx.fillText(String(rung.prime),label.x+10,label.y-5);
      ctx.restore();
    }
  }

  function draw(){
    const rect=canvas.getBoundingClientRect(),w=rect.width,h=rect.height,g=geometry();ctx.clearRect(0,0,w,h);
    const colors={a:css('--cyan'),b:css('--orange'),rail:css('--gold'),line:css('--line'),text:css('--text'),blue:css('--blue')},showDouble=doubleView();
    if(mod7PointAxes()){
      if(mod7Slicing()){
        const y=g.rungs[selected].point7.y,radius=g.innerRadius*1.12;
        const boundary=Array.from({length:49},(_,i)=>{
          const theta=M.TAU*i/48;
          return project({x:radius*Math.cos(theta),y,z:radius*Math.sin(theta)},w,h);
        });
        ctx.save();
        ctx.setLineDash([4,4]);
        path(boundary,'#b4c5d8',1.2,.75);
        ctx.restore();
      }
      screenRungs=g.rungs.filter(r=>sliceHit(r.residue7)!=='gap')
        .map(r=>({r,a:project(r.strandA,w,h)}));
      const hitsByDepth=screenRungs.slice().sort((u,v)=>u.a.z-v.a.z);
      for(const {r,a} of hitsByDepth){
        const active=r.index-1===selected;
        dot(a,(active?6.5:3.15)*a.p,residueColor(r,7),active?colors.text:null);
      }
      return;
    }
    const projected=g.rungs.map(r=>({r,a:project(r.strandA,w,h),b:project(r.strandB,w,h),mid:project(r.midpoint,w,h),railA:project(r.railA,w,h),railB:project(r.railB,w,h)}));
    const byDepth=projected.slice().sort((u,v)=>u.a.z-v.a.z);screenRungs=projected;
    registerOverlay(g,w,h,colors);
    if(showDouble&&mode!=='zeta'&&mode!=='residue'){
      const axisTop=project({x:0,y:-g.height/2,z:0},w,h),axisBottom=project({x:0,y:g.height/2,z:0},w,h);
      ctx.save();ctx.setLineDash([4,5]);path([axisTop,axisBottom],colors.line,1.1,.65);ctx.restore();
    }
    if(mode==='zeta'&&zetaLens==='seam'&&showDouble){
      ctx.save();ctx.setLineDash([7,5]);path(projected.map(x=>x.b),colors.b,4,.86);ctx.restore();path(projected.map(x=>x.a),colors.a,2.1,.95);
    }else{path(projected.map(x=>x.a),colors.a,2.2,.82);if(showDouble)path(projected.map(x=>x.b),colors.b,2.2,.78)}
    if(showRail&&mode!=='zeta'&&mode!=='residue'){path(projected.map(x=>x.railA),colors.rail,1.4,.64);if(showDouble)path(projected.map(x=>x.railB),colors.rail,1.4,.42)}
    for(const item of byDepth){
      const active=item.r.index-1===selected;if(showDouble&&!(mode==='zeta'&&zetaLens==='seam')){path([item.a,item.b],active?colors.text:(item.r.kink?colors.blue:item.r.codon?colors.blue:colors.line),active?2.6:(item.r.kink?2:1),active?1:(mode==='residue'?.18:.72));if(mode!=='zeta'&&mode!=='residue')dot(item.mid,active?3.7:1.8,active?colors.text:colors.blue)}
      const radius=(item.r.codon?4:mode==='residue'?2.1:2.5)*item.a.p;dot(item.a,radius,mode==='residue'?residueColor(item.r,residueAngle==='mod11'?11:7):colors.a,active?colors.text:null);if(showDouble)dot(item.b,radius,mode==='residue'?residueColor(item.r,11):colors.b,active?colors.text:null);
      if(mode==='zeta'&&item.r.kink){dot(item.a,6.2*item.a.p,colors.blue,active?colors.text:colors.rail);if(showDouble)dot(item.b,6.2*item.b.p,colors.blue,active?colors.text:colors.rail)}
      if(mode==='zeta'&&zetaLens==='seam'&&active){dot(item.b,8.5*item.b.p,colors.b,colors.text);dot(item.a,4.5*item.a.p,colors.a,colors.text)}
      if(showRail&&mode!=='zeta'&&mode!=='residue'&&item.r.fibonacci){dot(item.railA,4.4*item.railA.p,colors.rail,colors.text);if(showDouble)dot(item.railB,4.4*item.railB.p,colors.rail,colors.text)}
    }
    if(mode==='zeta'&&zetaLens==='trace'){
      activeTraceKinks(g).forEach((record,index)=>{
        const {a,b}=projected[record.index-1],color=kinkColors[index];
        dot(a,7.5*a.p,color,colors.text);
        if(showDouble)dot(b,7.5*b.p,color,colors.text);
        ctx.font='700 12px ui-monospace, monospace';
        ctx.lineWidth=3;
        ctx.strokeStyle='#08121e';
        ctx.fillStyle=color;
        ctx.strokeText('K'+(index+1),a.x+10,a.y-7);
        ctx.fillText('K'+(index+1),a.x+10,a.y-7);
      });
    }
    if(mode==='residue'&&residueAngle==='paired'&&stackToggle.checked)drawResidueStack(g.stack51,w,h);
  }
  function renderTermComparison(record){
    const p=Number(termPrime.value);
    const limit=Number(termRepeats.value);
    const returnRoute=iharaRoute.value;
    iharaStatus.textContent=returnRoute==='same'
      ? 'Alpha → Rath → Alpha · direkte Umkehr in Rath · kein Ihara-Beitrag'
      : 'Alpha → Rath → Cathedral → Alpha · primitiver Zyklus · 3 Kanten';
    termReference.textContent=`Nullstellenpaar ${selected+1} · γ = ${decimal(record.gamma,6)} · p = ${p}`;
    const signed=value=>`${value>0?'+':''}${decimal(value,6)}`;
    const rows=Array.from({length:limit},(_,i)=>{
      const r=i+1,v=M.comparePrimeRepeat(record,p,r);
      const ihara=M.iharaTriangleTerm(v.phase,r,returnRoute);
      const tr=document.createElement('tr');
      const heading=document.createElement('th');
      heading.scope='row';
      heading.textContent=String(r);
      tr.append(heading);
      const values=[String(v.x),decimal(v.phase,6),decimal(v.helixPhase,6),decimal(v.helixWeight,6),signed(v.helixTerm),
        decimal(v.primeWeight,6),signed(v.primeTerm),signed(v.withoutMinus)];
      values.push(...(ihara
        ? [decimal(ihara.phase,6),decimal(ihara.weight,6),signed(ihara.realTerm)]
        : ['—','—','kein Beitrag']));
      for(const value of values){
        const td=document.createElement('td');
        td.textContent=value;
        tr.append(td);
      }
      return tr;
    });
    termRows.replaceChildren(...rows);
  }

  function renderSliceControls(list){
    const slicing=mod7Slicing();
    slicePanel.hidden=!slicing;
    fourierPanel.hidden=!slicing;
    if(slicing&&!fourierComparison)setupSliceSpectra();
    mod7Toggle.disabled=slicing;
    mod7Help.textContent=slicing
      ? 'Vor und Zurück verschieben den Schnitt um eine Primzahl-Ebene. Die Kamera bleibt fest.'
      : 'Ziehe waagerecht im Plot, um die Punktachsen bei fester Blickhöhe zu drehen.';
    cameraNote.textContent=slicing?'Feste Ansicht · aktive Schnittebene':'drag · rotate';
    indexLabel.textContent=slicing?'Ebene':'Sprosse';
    prev.textContent=slicing?'← Zurück':'←';
    next.textContent=slicing?'Vor →':'→';
    prev.setAttribute('aria-label',slicing?'Vorherige Ebene':'Vorherige Sprosse');
    next.setAttribute('aria-label',slicing?'Nächste Ebene':'Nächste Sprosse');
    prev.disabled=slicing&&selected===0;
    next.disabled=slicing&&selected===list.length-1;
    canvas.toggleAttribute('data-slicing',slicing);
    if(slicing){
      const {prime,residue7,index}=list[selected];
      const hit=sliceHit(residue7);
      const description=hit==='green'?'Grün trifft · Rest 2':hit==='pink'?'Pink trifft · Rest 6':'Lücke · Rest '+residue7;
      sliceStatus.dataset.hit=hit;
      const visibility=hit==='gap'?'hidden':'visible';
      sliceMarker.setAttribute('visibility',visibility);
      sliceTargets.setAttribute('visibility',visibility);
      let angleLabel='';
      if(hit==='gap'){
        for(const {cell,arcValue} of sliceDistances){
          cell.textContent='';
          if(arcValue)arcValue.textContent='';
        }
      }else{
        const {angle7,angleDegrees7}=geometry().rungs[selected];
        sliceMarker.dataset.hit=hit;
        sliceMarker.setAttribute('transform','rotate('+angleDegrees7+')');
        angleLabel=' · '+sliceAngleFormat.format(angleDegrees7)+'°';
        // The four undirected Union-J lines have the same eight bearings as the I vertices.
        for(const {cell,key,target,arc,arcValue} of sliceDistances){
          const offset=key==='j'?jacketOffset:0;
          const nearest=offset+Math.round((angle7-offset)/octagonStep)*octagonStep;
          const distance=Math.abs(angle7-nearest);
          const value=sliceAngleFormat.format(M.degrees(distance))+'°';
          target.setAttribute('transform','rotate('+M.degrees(nearest)+')');
          cell.textContent=value;
          if(arc){
            const isJ=key==='j';
            const cornerRadius=isJ?jacketRadius:slicePlanRadius;
            const arcRadius=isJ?jacketRadius+5:slicePlanRadius-13;
            const labelRadius=arcRadius+(isJ?12:-13);
            const midpoint=(angle7+nearest)/2;
            arc.setAttribute('d',sliceArcPath(angle7,nearest,arcRadius,cornerRadius));
            arcValue.setAttribute('transform','translate('+slicePlanPoint(labelRadius,midpoint)+')');
            arcValue.textContent=value;
          }
        }
      }
      sliceStatus.textContent='Ebene '+index+' / '+list.length+' · '+prime+' · '+description+angleLabel;
      highlightedSlice?.classList.remove('is-current');
      highlightedSlice=sliceCells[selected];
      highlightedSlice.classList.add('is-current');
    }
  }

  function setSelected(index){
    const list=records();selected=mod7Slicing()?Math.max(0,Math.min(index,list.length-1)):(index+list.length)%list.length;renderSliceControls(list);indexInput.max=String(list.length);indexInput.value=String(selected+1);countEl.textContent=mode==='zeta'?`${list.length} zero pairs · ${zetaLens.toUpperCase()} LENS`:mode==='residue'?`${list.length} prime records · ${residueAngle.toUpperCase()}`:`${list.length} ${strandMode==='double'?'rungs':'nodes'} · ${registerLabel()}`;const info=M.inspection(mode,selected,mix,strandMode,{logX,betaOffset,zetaLens,traceWord,residueAngle});
    recordEl.textContent=info.recordId;pairEl.textContent=mode==='residue'?String(info.prime):strandMode==='double'?`${info.pair[0]} ↔ ${info.pair[1]}`:`${info.single[0]}`;
    primeCubeLink.hidden=mode!=='residue';
    if(mode==='residue')primeCubeLink.href=cubeReturnUrl(list[selected]);
    if(mode==='zeta'){
      const trace=M.traceWordData(traceWord),seam=M.phaseSeamData();
      const mirror=zetaLens==='smooth'?'θ ↔ −θ · conjugate wave':zetaLens==='trace'?`${traceWord} slot ${info.traceSlot}/4 · ${info.traceSymbol} · ${info.kink?'KINK':'run'}`:'−1/12 ≡ 11/12 (mod 1) · lift Δ=1';
      detailEl.innerHTML=`<dt>Carrier</dt><dd>ζ zero conjugate pair · finite sample</dd><dt>Source β</dt><dd>${decimal(info.sourceBeta,3)} · fixed</dd><dt>Probe β</dt><dd>${decimal(info.beta,3)} · view only</dd><dt>γ</dt><dd>${decimal(info.gamma,12)}</dd><dt>Phase θ</dt><dd>${decimal(info.theta,6)} rad</dd><dt>Comparator</dt><dd>${mirror}</dd><dt>Return</dt><dd>EXACT → [${info.return.values.join(', ')}]</dd>`;
      strandReadout.innerHTML=strandMode==='double'?(zetaLens==='smooth'?'<b>ζ CONJUGATE PAIR</b> · <code>ρ=β±iγ</code> · mirror <code>θ↔−θ</code> · no central-axis claim':zetaLens==='trace'?`<b>${traceWord} TRACE</b> · signs <code>${trace.signs.join(' ')}</code> · ${trace.kinkCount} kinks / word · complement ${trace.complement}`:'<b>PHASE SEAM</b> · same circle point · distinct lift/history witness'):'<b>ζ POSITIVE ORDINATE</b> · one sampled zero · companion hidden';
      registerReadout.innerHTML=zetaLens==='smooth'?'<b>EXPLICIT FORMULA</b> · finite pair term · <code>θ=γ log x</code> · normalized by <code>√x</code>':zetaLens==='trace'?'<b>TRACE WORD</b> · path witness only · not a Dirichlet character':'<b>VIEW CUT</b> · <code>−1/12 ≡ 11/12 (mod 1)</code> · source lift retained';
      zetaSummary.textContent=`x=${formatNumber(info.x,3)} · β=${decimal(info.beta,3)}`;betaLabel.textContent=decimal(betaOffset,3);
      zetaX.textContent=formatNumber(info.x,3);zetaLogX.textContent=decimal(info.logX,6);zetaRho.textContent=`${decimal(info.beta,3)} + ${decimal(info.gamma,6)}i`;zetaTheta.textContent=`${decimal(info.theta,6)} rad`;zetaEnvelope.textContent=decimal(info.normalizedAmplitude,6);zetaContribution.textContent=decimal(info.normalizedContribution,8);
      renderTermComparison(list[selected]);
      zetaLensOut.textContent=zetaLens.toUpperCase();zetaWitness.textContent=zetaLens==='smooth'?'θ ↔ −θ':zetaLens==='trace'?`${traceWord} · kinks ${trace.kinkPositions.join(',')}`:`${fraction(seam.shadow)} ↔ ${fraction(seam.visible)} · lift +1`;
      renderKinkTracker();
      draw();return;
    }
    if(mode==='residue'){
      stackPanel.hidden=info.angleMode!=='paired';
      mod7Panel.hidden=info.angleMode!=='mod7';
      for(const link of stackLinks.children){
        link.setAttribute('aria-current',String(Number(link.dataset.stackIndex)===info.index));
      }
      const viewLabel=info.angleMode==='paired'?'7|11 · SAME RECORD / TWO RAILS':info.angleMode.toUpperCase();
      detailEl.innerHTML=`<dt>Carrier</dt><dd>Prime p≤1000 · shared finite carrier</dd><dt>Prime index</dt><dd>${info.index} / 168</dd><dt>p mod 7</dt><dd>${info.residue7} · ${decimal(info.angleDegrees7,6)}°</dd><dt>p mod 11</dt><dd>${info.residue11} · ${decimal(info.angleDegrees11,6)}°</dd><dt>Tail boundary</dt><dd>${info.tail.length} primes · 1000&lt;p≤1111 · outside view</dd><dt>Return</dt><dd>EXACT → ${info.return.values[0]}</dd>`;
      strandReadout.innerHTML=`<b>${viewLabel}</b> · vertical order = prime index · angle only changes the view`;
      registerReadout.innerHTML='<b>VIEW CROSSWALK</b> · same <code>PC1111</code> record · no antipodal/DNA rung claim';
      residueSummary.textContent=info.angleMode==='paired'?'7|11 · two declared angle rails':`${info.angleMode.toUpperCase()} · one declared angle rail`;
      draw();return;
    }
    const role=mode==='twins'?'Twin prime pair':(info.fixed?'Fixed point orbit':'Two-cycle orbit');
    const axis=info.axisIntersection?`(${nearZero(info.axisIntersection.x)}, ${info.axisIntersection.y.toFixed(6)}, ${nearZero(info.axisIntersection.z)})`:'NONE · SINGLE STRAND';
    detailEl.innerHTML=`<dt>Carrier</dt><dd>${role}</dd><dt>View</dt><dd>${strandMode==='double'?'(c)D|⁄|A · 2-STRAND':'RN\\A · 1-STRAND'}</dd><dt>Phase step</dt><dd>${info.phaseDegrees.toFixed(6)}°</dd><dt>3er register</dt><dd>Codon ${info.codonIndex} · slot ${info.codonSlot}/3</dd><dt>Axis Lₖ(1/2)</dt><dd>${axis}</dd><dt>Fibonacci index</dt><dd>${info.fibonacciMarker?'YES':'NO'}</dd><dt>Return</dt><dd>EXACT → [${info.return.values.join(', ')}]</dd>`;
    strandReadout.innerHTML=strandMode==='double'?'<b>(c)D|⁄|A</b> · antipodaler Doppelstrang · <code>Lₖ(1/2)=(0,zₖ,0)</code>':'<b>RN\\A</b> · gerichteter Einzelstrang A · kein Gegenstrang / keine Sprosse';
    registerReadout.innerHTML=registerDescription();
    const measures=info.measures;turnsOut.textContent=`${decimal(measures.turns,6)} turns`;iotaOut.textContent=`${decimal(measures.iota,6)} / rad`;daoOut.textContent=decimal(measures.dao,6);pitchOut.textContent=`${decimal(measures.pitchPerTurn,6)} view units`;curvatureOut.textContent=decimal(measures.curvature,6);torsionOut.textContent=`${decimal(measures.torsionMagnitude,6)} / view unit`;
    draw();
  }
  function nearZero(value){return Math.abs(value)<1e-12?'0':value.toFixed(6)}
  function decimal(value,digits){return value.toFixed(digits).replace('.',',')}
  function formatNumber(value,digits){return new Intl.NumberFormat('de-DE',{maximumFractionDigits:digits}).format(value)}
  function renderKinkTracker(){
    const active=mode==='zeta'&&zetaLens==='trace';
    kinkTracker.hidden=!active;
    if(!active)return;
    const angle=formatNumber(traceAngle,1)+'°';
    kinkAngleOut.textContent=angle;
    kinkAngle.setAttribute('aria-valuetext',angle);
    const g=geometry(),size=g.trace.symbols.length;
    kinkWord.textContent=g.trace.word+' · Block '+(Math.floor(selected/size)+1)+' von '+g.rungs.length/size;
    const coords=point=>Object.values(rotateTracePoint(point))
      .map(value=>decimal(Math.abs(value)<0.0005?0:value,3)).join('; ');
    activeTraceKinks(g).forEach((record,index)=>{
      const pair=doubleView()?' · B ('+coords(record.strandB)+')':'';
      kinkPositions[index].textContent='ρ'+record.index+' · A ('+coords(record.strandA)+')'+pair;
    });
  }
  function setTraceAngle(value){
    traceAngle=value;
    kinkAngle.value=String(value);
    renderKinkTracker();
    draw();
  }
  function stopKinkRotation(){
    if(kinkFrame!==null)cancelAnimationFrame(kinkFrame);
    kinkFrame=null;
    kinkPlay.textContent='Drehung abspielen';
  }
  kinkAngle.addEventListener('input',()=>{
    stopKinkRotation();
    setTraceAngle(kinkAngle.valueAsNumber);
  });
  kinkPlay.addEventListener('click',()=>{
    if(kinkFrame!==null){stopKinkRotation();return;}
    const start=traceAngle===90?0:traceAngle;
    if(reduceMotion.matches){setTraceAngle(traceAngle===90?0:90);return;}
    let started=null;
    kinkPlay.textContent='Drehung pausieren';
    function animate(time){
      if(started===null)started=time;
      setTraceAngle(Math.min(90,start+(time-started)*0.018));
      if(traceAngle===90){stopKinkRotation();return;}
      kinkFrame=requestAnimationFrame(animate);
    }
    kinkFrame=requestAnimationFrame(animate);
  });
  function setMode(nextMode){
    stopKinkRotation();
    mode=nextMode;const zeta=mode==='zeta',residue=mode==='residue',locked=zeta||residue;modeButtons.forEach(btn=>btn.setAttribute('aria-pressed',String(btn.dataset.hvMode===mode)));
    phaseControl.hidden=locked;zetaControl.hidden=!zeta;residueControl.hidden=!residue;registerButtons.forEach(btn=>btn.disabled=locked);strandButtons.forEach(btn=>btn.disabled=residue);railToggle.disabled=locked;railToggle.closest('.hv-check').classList.toggle('is-disabled',locked);
    renderKinkTracker();
    setSelected(0);
  }
  function setStrandMode(nextMode){strandMode=M.strandMode(nextMode);strandButtons.forEach(btn=>btn.setAttribute('aria-pressed',String(btn.dataset.hvStrand===strandMode)));setSelected(selected)}
  function registerLabel(){return({pair:'PAIR 1+1',fh14:'F/H 7+7',triad21:'TRIAD 3×7',z37frame:'ℤ₃₇ 1+18'})[registerMode]}
  function registerDescription(){return({pair:'<b>PAIR · 1+1</b> · geprüfter Quellträger ohne zusätzlichen Phasen-Layer',fh14:'<b>F/H · 7+7</b> · F1…F7 plus antipodale H1…H7 auf demselben z-Register',triad21:'<b>TRIAD · 3×7</b> · 21 eindeutige Phasenlagen aus drei 7er-Familien',z37frame:'<b>ℤ₃₇ · 1+18</b> · Fixpunkt 0, 18 Inversionspaare, Achse 0 ↔ Naht 18|19'})[registerMode]}
  function setRegisterMode(nextMode){registerMode=M.registerMode(nextMode);registerButtons.forEach(btn=>btn.setAttribute('aria-pressed',String(btn.dataset.hvRegister===registerMode)));setSelected(selected)}
  function setMix(value){mix=Math.max(0,Math.min(1,value));const deg=M.degrees(M.phaseStep(mix));phaseOut.textContent=`${deg.toFixed(6).replace('.',',')}° · ${mix===0?'10er-Takt':mix===1?'Goldener Winkel':'deklarierter Mix'}`;setSelected(selected)}
  function setLogX(value){logX=Math.max(Math.log(2),Math.min(Math.log(1000000),value));setSelected(selected)}
  function setBetaOffset(value){betaOffset=Math.max(-.08,Math.min(.08,value));setSelected(selected)}
  function setZetaLens(value){stopKinkRotation();zetaLens=M.zetaLensMode(value);zetaLensButtons.forEach(btn=>btn.setAttribute('aria-pressed',String(btn.dataset.hvZetaLens===zetaLens)));traceSwitch.hidden=zetaLens!=='trace';setSelected(selected)}
  function setTraceWord(value){traceWord=M.traceWordData(value).word;traceWordButtons.forEach(btn=>btn.setAttribute('aria-pressed',String(btn.dataset.hvTraceWord===traceWord)));setSelected(selected)}
  function setResidueAngle(value){residueAngle=M.residueAngleMode(value);residueAngleButtons.forEach(btn=>btn.setAttribute('aria-pressed',String(btn.dataset.hvResidueAngle===residueAngle)));setSelected(selected)}
  function residueColor(record,modulus){const residue=modulus===11?record.residue11:record.residue7;return `hsl(${Math.round(300*residue/(modulus-1)+25)} 82% 62%)`}
  function fraction(value){return value===-1/12?'−1/12':value===11/12?'11/12':decimal(value,6)}
  function distanceToSegment(p,a,b){const dx=b.x-a.x,dy=b.y-a.y,l2=dx*dx+dy*dy;if(!l2)return Math.hypot(p.x-a.x,p.y-a.y);const t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/l2));return Math.hypot(p.x-(a.x+t*dx),p.y-(a.y+t*dy))}
  function point(event){const r=canvas.getBoundingClientRect();return{x:event.clientX-r.left,y:event.clientY-r.top}}
  for(const control of [termPrime,termRepeats,iharaRoute]){
    control.addEventListener('change',()=>renderTermComparison(records()[selected]));
  }
  modeButtons.forEach(btn=>btn.addEventListener('click',()=>setMode(btn.dataset.hvMode)));
  strandButtons.forEach(btn=>btn.addEventListener('click',()=>setStrandMode(btn.dataset.hvStrand)));
  registerButtons.forEach(btn=>btn.addEventListener('click',()=>setRegisterMode(btn.dataset.hvRegister)));
  zetaLensButtons.forEach(btn=>btn.addEventListener('click',()=>setZetaLens(btn.dataset.hvZetaLens)));
  traceWordButtons.forEach(btn=>btn.addEventListener('click',()=>setTraceWord(btn.dataset.hvTraceWord)));
  residueAngleButtons.forEach(btn=>btn.addEventListener('click',()=>setResidueAngle(btn.dataset.hvResidueAngle)));
  stackToggle.addEventListener('change',draw);
  mod7Toggle.addEventListener('change',draw);
  sliceToggle.addEventListener('change',()=>{
    drag=null;
    setSelected(selected);
    if(mod7Slicing())indexInput.focus();
  });
  railToggle.addEventListener('change',()=>{showRail=railToggle.checked;draw()});mixInput.addEventListener('input',()=>setMix(Number(mixInput.value)/1000));logXInput.addEventListener('input',()=>setLogX(Number(logXInput.value)));betaOffsetInput.addEventListener('input',()=>setBetaOffset(Number(betaOffsetInput.value)));indexInput.addEventListener('input',()=>setSelected(Number(indexInput.value)-1));prev.addEventListener('click',()=>setSelected(selected-1));next.addEventListener('click',()=>setSelected(selected+1));
  function updateRotation(event){
    const p=point(event);
    const dx=p.x-drag.x,dy=p.y-drag.y;
    if(!drag.moved&&Math.hypot(dx,drag.yawOnly?0:dy)<=4)return;
    drag.moved=true;
    rotY=drag.rotY+dx*.009;
    if(!drag.yawOnly)rotX=Math.max(-1.2,Math.min(1.2,drag.rotX+dy*.007));
    if(rotationFrame===null){
      rotationFrame=requestAnimationFrame(()=>{
        rotationFrame=null;
        draw();
      });
    }
  }

  canvas.addEventListener('pointerdown',event=>{
    if(mod7Slicing()||drag||event.button!==0)return;
    canvas.setPointerCapture(event.pointerId);
    drag={...point(event),id:event.pointerId,rotX,rotY,moved:false,yawOnly:mod7PointAxes()};
  });
  canvas.addEventListener('pointermove',event=>{
    if(drag?.id===event.pointerId)updateRotation(event);
  });
  canvas.addEventListener('pointerup',event=>{
    if(drag?.id!==event.pointerId)return;
    updateRotation(event);
    if(!drag.moved){
      const p=point(event);
      const stackVisible=mode==='residue'&&residueAngle==='paired'&&stackToggle.checked;
      let closest=null,best=18;
      if(stackVisible){
        for(const {r,a,b} of screenRungs){
          if(!stackSnapshots.some(record=>record.index===r.index))continue;
          const distance=Math.min(Math.hypot(p.x-a.x,p.y-a.y),Math.hypot(p.x-b.x,p.y-b.y));
          if(distance<Math.min(9,best)){
            closest=r.index-1;
            best=distance;
          }
        }
        if(closest!==null){
          drag=null;
          location.assign(cubeReturnUrl(stackSnapshots.find(record=>record.index-1===closest)));
          return;
        }
      }
      for(const {r,a,b} of screenRungs){
        const distance=doubleView()?distanceToSegment(p,a,b):Math.hypot(p.x-a.x,p.y-a.y);
        if(distance<best){
          closest=r.index-1;
          best=distance;
        }
      }
      if(closest!==null){
        const snapshot=stackVisible&&stackSnapshots.find(record=>record.index-1===closest);
        if(snapshot)location.assign(cubeReturnUrl(snapshot));
        else setSelected(closest);
      }
    }
    drag=null;
  });
  function clearDrag(event){
    if(drag?.id===event.pointerId)drag=null;
  }
  canvas.addEventListener('pointercancel',clearDrag);
  canvas.addEventListener('lostpointercapture',clearDrag);
  function setupRosslerLift(panel){
    const cycles=M.rosslerLiftCycles();
    const readouts=M.rosslerJanusOverlap(cycles);
    const candidates=readouts.flat().filter(record=>record?.overlap);
    const clusterComparison=M.rosslerClusterComparison(cycles);
    const clusterPanel=panel.querySelector('[data-rossler-clusters]');
    const clusterSample=clusterPanel.querySelector('[data-rossler-cluster-sample]');
    const clusterPoint=clusterPanel.querySelector('[data-rossler-cluster-point]');
    const playback=panel.querySelector('[data-rossler-playback]');
    const transitionPanel=clusterPanel.querySelector('[data-rossler-transition]');
    const transitionSummary=transitionPanel.querySelector('[data-rossler-transition-summary]');
    const transitionStep=transitionPanel.querySelector('[data-rossler-transition-step]');
    const transitionPoint=transitionPanel.querySelector('[data-rossler-transition-point]');
    const matrices=clusterPanel.querySelector('[data-rossler-matrices]');
    let transition=null;
    const clusterColors=['#72ddd1','#ffbc72','#c7a8ff','#f594c1','#a9dc86','#8ebdff'];
    clusterPanel.querySelector('[data-rossler-cluster-legend]').innerHTML=clusterColors.map((color,index)=>
      `<li><span aria-hidden="true" style="background:${color}"></span>Cluster ${index+1}</li>`).join('');
    const percentage=new Intl.NumberFormat('de-DE',{style:'percent',maximumFractionDigits:1});
    const decimal=new Intl.NumberFormat('de-DE',{maximumFractionDigits:2});
    const {samples:clusterSamples,xy,aligned,largest}=clusterComparison;
    const changed=clusterSamples.map((_,index)=>index).filter(index=>xy[index]!==aligned[index])
      .sort((a,b)=>clusterSamples[b].point.z-clusterSamples[a].point.z);
    clusterSample.replaceChildren(...changed.map(index=>{
      const {cycle,index:sample}=clusterSamples[index];
      return new Option('Umlauf '+cycle+' · Sample '+sample,String(index));
    }));
    clusterSample.disabled=changed.length===0;

    function matrixMarkup(title,key,mark){
      const {counts,probabilities}=clusterComparison[key];
      const head=probabilities.map((_,to)=>`<th scope="col">${to+1}</th>`).join('');
      const rows=probabilities.map((row,from)=>{
        const cells=row.map((fraction,to)=>{
          const value=percentage.format(fraction);
          const detail=counts[from][to]+' von '+counts[from].reduce((sum,count)=>sum+count,0)+' Übergängen';
          const highlight=mark&&from===largest.from&&to===largest.to?' class="hv-rossler-largest"':'';
          const name=(from+1)+'→'+(to+1)+' · '+value+' · '+title;
          const content=mark?`<button type="button" data-rossler-transition-cell="${from},${to}" aria-label="${name}" aria-pressed="false">${value}</button>`:value;
          return `<td${highlight} style="--probability:${fraction}" title="${detail}">${content}</td>`;
        }).join('');
        return `<tr><th scope="row">${from+1}</th>${cells}</tr>`;
      }).join('');
      return `<table><caption>${title}</caption><thead><tr><th scope="col">→</th>${head}</tr></thead><tbody>${rows}</tbody></table>`;
    }
    matrices.innerHTML=
      matrixMarkup('XY · Referenz','reference',true)
      +matrixMarkup('XYZ · vor Zuordnung','before',false)
      +matrixMarkup('XYZ · nach Zuordnung','after',true);
    const {matched,mapping,meanBefore,meanAfter}=clusterComparison;
    const pairs=mapping.map((label,index)=>(index+1)+'→'+(label+1)).join(', ');
    clusterPanel.querySelector('[data-rossler-cluster-matches]').textContent=
      matched+' von '+clusterSamples.length+' Sample-IDs stimmen nach der Zuordnung überein ('+
      percentage.format(matched/clusterSamples.length)+'). XYZ → XY: '+pairs+'.';
    const labelDifference=largest.delta>0?'+':'';
    const referenceValue=clusterComparison.reference.probabilities[largest.from][largest.to];
    const alignedValue=clusterComparison.after.probabilities[largest.from][largest.to];
    clusterPanel.querySelector('[data-rossler-cluster-delta]').textContent=
      'Mittlerer Abstand zur XY-Matrix: '+decimal.format(meanBefore*100)+' → '+decimal.format(meanAfter*100)+
      ' Prozentpunkte. Größter Restunterschied '+(largest.from+1)+'→'+(largest.to+1)+': '+
      percentage.format(referenceValue)+' in XY, '+percentage.format(alignedValue)+' in XYZ ('+
      labelDifference+decimal.format(largest.delta*100)+' Prozentpunkte).';
    const stepName=index=>{
      const {cycle,index:sample}=clusterSamples[index];
      return 'Umlauf '+cycle+' · Sample '+sample;
    };
    const stepLabels=(labels,index)=>(labels[index-1]+1)+'→'+(labels[index]+1);

    function clearTransition(){
      transition=null;
      transitionPanel.hidden=true;
      for(const button of matrices.querySelectorAll('[aria-pressed="true"]')){
        button.setAttribute('aria-pressed','false');
      }
    }
    function selectTransition(key){
      const [from,to]=key.split(',').map(Number);
      const lost=[];
      let kept=0,gained=0;
      for(let i=1;i<clusterSamples.length;i++){
        const inXY=xy[i-1]===from&&xy[i]===to;
        const inXYZ=aligned[i-1]===from&&aligned[i]===to;
        if(inXY&&inXYZ)kept++;
        if(inXY&&!inXYZ)lost.push(i);
        if(!inXY&&inXYZ)gained++;
      }
      transition={lost};
      transitionPanel.hidden=false;
      const label=(from+1)+'→'+(to+1);
      transitionSummary.textContent=label+' · XY '+(kept+lost.length)+' Schritte · XYZ '+(kept+gained)+
        ' Schritte · '+lost.length+' fallen heraus, '+kept+' bleiben, '+gained+' kommen hinzu.';
      transitionStep.labels[0].textContent='Aus '+label+' herausgefallener Schritt';
      transitionStep.replaceChildren(...lost.map(index=>new Option(
        stepName(index-1)+' → '+stepName(index)+' · XYZ '+stepLabels(aligned,index),String(index))));
      transitionStep.disabled=lost.length===0;
      for(const button of matrices.querySelectorAll('[data-rossler-transition-cell]')){
        button.setAttribute('aria-pressed',String(button.dataset.rosslerTransitionCell===key));
      }
      renderClusters();
    }
    const janusPanel=panel.querySelector('[data-rossler-janus]');
    const sampleOutput=janusPanel.querySelector('[data-rossler-janus-sample]');
    const janusOutput=janusPanel.querySelector('[data-rossler-janus-value]');
    const curvatureOutput=janusPanel.querySelector('[data-rossler-janus-curvature]');
    const candidateList=janusPanel.querySelector('[data-rossler-candidates]');
    const candidateButtons=candidates.map(candidate=>{
      const button=document.createElement('button');
      button.type='button';
      button.textContent='Umlauf '+(candidate.cycleIndex+1)+' · Sample '+candidate.index;
      button.setAttribute('aria-pressed','false');
      button.addEventListener('click',()=>selectCandidate(candidate));
      candidateList.append(button);
      return button;
    });
    const stepButton=panel.querySelector('[data-rossler-step]');
    const resetButton=panel.querySelector('[data-rossler-reset]');
    const nextButton=panel.querySelector('[data-rossler-next]');
    const cycleOutput=panel.querySelector('[data-rossler-cycle]');
    const peakOutput=panel.querySelector('[data-rossler-peak]');
    const radiusOutput=panel.querySelector('[data-rossler-radius]');
    const status=panel.querySelector('[data-rossler-status]');
    const number=new Intl.NumberFormat('de-DE',{minimumFractionDigits:3,maximumFractionDigits:3});
    const point=(x,y,z=0)=>({x,y,z});
    const gridSize=12;
    const planeCorners=[point(-gridSize,-gridSize),point(-gridSize,gridSize),point(gridSize,-gridSize),point(gridSize,gridSize)];
    const allPoints=[...planeCorners,...cycles.flatMap(cycle=>cycle.samples)];
    const ceiling=Math.ceil(Math.max(...allPoints.map(sample=>sample.peakZ||0)));
    const modeButtons=[...panel.querySelectorAll('[data-rossler-mode]')];
    const singleMetrics=panel.querySelector('[data-rossler-single]');
    const scaleNote=panel.querySelector('[data-rossler-scale]');
    const plots=[...panel.querySelectorAll('[data-rossler-view]')];
    const sides=[...panel.querySelectorAll('[data-rossler-side]')].map(metrics=>({
      metrics,
      progress:metrics.querySelector('[data-rossler-progress]'),
      peak:metrics.querySelector('[data-rossler-side-peak]'),
      radius:metrics.querySelector('[data-rossler-side-radius]')
    }));
    const compareIndices=[0,4];
    function projection(lifted){
      const project=lifted
        ? ({x,y,z})=>({x:x+0.55*y,y:0.18*x-0.38*y-0.78*z})
        : ({x,y})=>({x,y:-y});
      const bounds=[...allPoints,point(0,0,ceiling)].map(project);
      return {
        project,lifted,
        minX:Math.min(...bounds.map(p=>p.x)),maxX:Math.max(...bounds.map(p=>p.x)),
        minY:Math.min(...bounds.map(p=>p.y)),maxY:Math.max(...bounds.map(p=>p.y))
      };
    }
    const flat=projection(false),lift=projection(true);
    const plotHits=new Map();
    let viewMode='compare',cycleIndex=0,sampleIndex=0;

    function plotScale({width,height},{minX,maxX,minY,maxY}){
      return Math.max(0,Math.min((width-42)/(maxX-minX),(height-42)/(maxY-minY)));
    }

    function drawRossler(plot,view,samples,atReturn,sharedScale,cycle){
      const {lifted,project,minX,maxX,minY,maxY}=view;
      const context=plot.getContext('2d');
      if(!context)return;
      const {width,height}=plot.getBoundingClientRect();
      if(width<1||height<1)return;
      const dpr=Math.min(2,window.devicePixelRatio||1);
      const deviceWidth=Math.round(width*dpr),deviceHeight=Math.round(height*dpr);
      if(plot.width!==deviceWidth||plot.height!==deviceHeight){
        plot.width=deviceWidth;
        plot.height=deviceHeight;
      }
      context.setTransform(dpr,0,0,dpr,0,0);
      context.clearRect(0,0,width,height);
      const scale=sharedScale??plotScale({width,height},view);
      const pixel=sample=>{
        const p=project(sample);
        return {x:width/2+(p.x-(minX+maxX)/2)*scale,y:height/2+(p.y-(minY+maxY)/2)*scale};
      };
      function stroke(points,color,lineWidth,dashed=false){
        context.beginPath();
        points.forEach((sample,index)=>{
          const p=pixel(sample);
          if(index===0)context.moveTo(p.x,p.y);
          else context.lineTo(p.x,p.y);
        });
        context.strokeStyle=color;
        context.lineWidth=lineWidth;
        context.setLineDash(dashed?[4,4]:[]);
        context.stroke();
      }
      function marker(sample,radius,fill){
        const p=pixel(sample);
        context.beginPath();
        context.arc(p.x,p.y,radius,0,M.TAU);
        context.fillStyle=fill;
        context.fill();
      }
      function label(sample,value){
        const p=pixel(sample);
        context.font='12px ui-monospace, monospace';
        context.fillStyle='#a8bad1';
        context.fillText(value,p.x+5,p.y-5);
      }

      for(let i=-gridSize;i<=gridSize;i+=4){
        const color=i===0?'#455970':'#213449';
        stroke([point(-gridSize,i),point(gridSize,i)],color,1);
        stroke([point(i,-gridSize),point(i,gridSize)],color,1);
      }
      const section=point(0,-gridSize);
      stroke([point(0,0),section],'#d9a928',1.5,true);
      label(section,'Schnitt');
      label(point(gridSize,0),'x');
      label(point(0,gridSize),'y');
      if(lifted){
        stroke([point(0,0),point(0,0,ceiling)],'#718da9',1,true);
        label(point(0,0,ceiling),'z');
        for(let z=0;z<=ceiling;z+=10){
          stroke([point(-0.35,0,z),point(0.35,0,z)],'#718da9',1);
          label(point(0,0,z),String(z));
        }
      }

      if(viewMode==='clusters'){
        const labels=lifted?aligned:xy;
        const active=Number(clusterSample.value);
        stroke(samples,'#455970',1.25);
        samples.forEach((sample,index)=>marker(sample,2.8,clusterColors[labels[index]]));
        if(transition){
          for(const end of transition.lost){
            stroke([samples[end-1],samples[end]],'#ffc66f',2.7);
            marker(samples[end],3,'#ffc66f');
          }
          if(transition.lost.length){
            const end=Number(transitionStep.value);
            stroke([samples[end-1],samples[end]],'#fff5dc',4);
            marker(samples[end-1],6,'#fff5dc');
            marker(samples[end-1],3.5,'#132235');
            marker(samples[end],6,'#fff5dc');
          }
        }else if(!clusterSample.disabled){
          marker(samples[active],8,'#f5f8ff');
          marker(samples[active],5,clusterColors[labels[active]]);
        }
        return;
      }

      const current=samples[samples.length-1];
      const trailColor=lifted?'#ffb45a':'#31d7c0';
      if(lifted){
        const floor=point(current.x,current.y);
        stroke([floor,current],'#ffb45a',1.5,true);
        marker(floor,3,'#7590a9');
      }
      const hits=[];
      if(viewMode==='janus'){
        stroke(cycle.samples,'#455970',1.25);
        for(const candidate of candidates){
          if(candidate.cycleIndex===cycleIndex){
            hits.push({candidate,...pixel(candidate.point)});
          }
        }
      }
      plotHits.set(plot,hits);
      stroke(samples,trailColor,2.5);
      for(const {candidate} of hits){
        marker(candidate.point,4,'#c3a3ef');
      }
      marker(samples[0],4,'#f1cf77');
      marker(current,5,atReturn?'#f1cf77':'#edf6ff');
      if(viewMode==='janus'&&readouts[cycleIndex][sampleIndex]?.overlap){
        marker(current,8,'#f3dcff');
        marker(current,3,'#633f8e');
      }
    }

    function renderClusters(){
      const points=clusterSamples.map(record=>record.point);
      const views=[flat,lift];
      const scale=Math.min(...plots.map((plot,index)=>plotScale(plot.getBoundingClientRect(),views[index])));
      plots.forEach((plot,index)=>{
        const caption=index===0?'XY · Referenzcluster':'XYZ · zugeordnete Cluster';
        plot.previousElementSibling.textContent=caption;
        plot.setAttribute('aria-label',caption);
        drawRossler(plot,views[index],points,false,scale);
      });
      if(transition){
        if(transition.lost.length===0){
          transitionPoint.textContent='Kein Schritt fällt aus dieser Zelle heraus.';
          return;
        }
        const end=Number(transitionStep.value);
        const {point:start}=clusterSamples[end-1],{point:finish}=clusterSamples[end];
        transitionPoint.textContent='XY '+stepLabels(xy,end)+' · XYZ '+stepLabels(aligned,end)+
          ' · z '+decimal.format(start.z)+' → '+decimal.format(finish.z)+
          ' · Gold zeigt alle herausgefallenen Schritte. Der helle Abschnitt zeigt die Auswahl.';
        return;
      }
      if(clusterSample.disabled){
        clusterPoint.textContent='Alle Sample-IDs haben nach der Zuordnung denselben Cluster.';
        return;
      }
      const active=Number(clusterSample.value),{point,cycle,index}=clusterSamples[active];
      clusterPoint.textContent='Umlauf '+cycle+' · Sample '+index+' · t = '+decimal.format(point.t)+
        ' · z = '+decimal.format(point.z)+' · XY Cluster '+(xy[active]+1)+' → XYZ Cluster '+(aligned[active]+1);
    }

    function render(announce=false){
      if(viewMode==='clusters'){renderClusters();return;}
      const compare=viewMode==='compare';
      const indices=compare?compareIndices:[cycleIndex,cycleIndex];
      const sharedScale=compare?Math.min(...plots.map(plot=>plotScale(plot.getBoundingClientRect(),lift))):undefined;
      let completed=0;
      plots.forEach((plot,index)=>{
        const cycle=cycles[indices[index]];
        const last=cycle.samples.length-1;
        const shown=Math.min(sampleIndex,last);
        const atReturn=shown===last;
        const peak=number.format(cycle.samples[shown].peakZ);
        const radius=atReturn?number.format(cycle.returnRadius):'–';
        const lifted=compare||index===1;
        const caption=plot.previousElementSibling;
        caption.textContent=compare?'Umlauf '+(indices[index]+1)+' · Bahn mit z':index===0?'Projektion auf x–y':'Dieselbe Bahn mit z';
        plot.setAttribute('aria-label',caption.textContent);
        drawRossler(plot,lifted?lift:flat,cycle.samples.slice(0,shown+1),atReturn,sharedScale,cycle);
        if(atReturn)completed++;
        if(compare){
          const side=sides[index];
          side.progress.textContent=shown+' / '+last;
          side.peak.textContent=peak;
          side.radius.textContent=radius;
        }else if(index===0){
          cycleOutput.textContent=(cycleIndex+1)+' / '+cycles.length;
          peakOutput.textContent=peak;
          radiusOutput.textContent=radius;
        }
      });

      if(viewMode==='janus'){
        const record=readouts[cycleIndex][sampleIndex];
        sampleOutput.textContent='Umlauf '+(cycleIndex+1)+' · '+sampleIndex;
        janusOutput.textContent=record?number.format(record.janus):'–';
        curvatureOutput.textContent=record?number.format(record.curvature):'–';
        candidateButtons.forEach((button,index)=>{
          button.setAttribute('aria-pressed',String(candidates[index]===record));
        });
      }

      stepButton.disabled=completed===plots.length;
      resetButton.disabled=sampleIndex===0;
      nextButton.disabled=!stepButton.disabled||cycleIndex===cycles.length-1;
      if(announce){
        if(sampleIndex===0)status.textContent='Start am gerichteten Schnitt.';
        else if(stepButton.disabled)status.textContent=compare?'Beide Returns erreicht.':'Return erreicht · Schritt '+sampleIndex;
        else if(compare&&completed===1)status.textContent='Umlauf 5 am Schnitt · Umlauf 1 läuft weiter.';
        else status.textContent='Schritt '+sampleIndex;
      }
    }

    function selectMode(value){
      viewMode=value;
      const compare=value==='compare';
      const janus=value==='janus',clusters=value==='clusters';
      sampleIndex=0;
      if(janus&&!candidates.some(candidate=>candidate.cycleIndex===cycleIndex)){
        cycleIndex=candidates[0]?.cycleIndex??0;
      }
      janusPanel.hidden=!janus;
      clusterPanel.hidden=!clusters;
      playback.hidden=clusters;
      plots.forEach(plot=>plot.toggleAttribute('data-janus-active',janus));
      modeButtons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.rosslerMode===value)));
      sides.forEach(side=>{side.metrics.hidden=!compare});
      singleMetrics.hidden=compare||clusters;
      scaleNote.hidden=!compare;
      scaleNote.textContent='Gemeinsame z-Skala 0 bis '+ceiling+' · jeder Umlauf hält an seinem Schnittpunkt';
      nextButton.hidden=compare;
      render(true);
    }

    function selectCandidate(candidate){
      cycleIndex=candidate.cycleIndex;
      sampleIndex=candidate.index;
      render(true);
    }

    plots.forEach(plot=>plot.addEventListener('click',event=>{
      if(viewMode!=='janus')return;
      const rect=plot.getBoundingClientRect();
      const x=event.clientX-rect.left,y=event.clientY-rect.top;
      let nearest=null,best=10;
      for(const hit of plotHits.get(plot)||[]){
        const distance=Math.hypot(hit.x-x,hit.y-y);
        if(distance<best){
          nearest=hit.candidate;
          best=distance;
        }
      }
      if(nearest)selectCandidate(nearest);
    }));

    matrices.addEventListener('click',event=>{
      const button=event.target.closest('[data-rossler-transition-cell]');
      if(!button)return;
      selectTransition(button.dataset.rosslerTransitionCell);
      plots[0].scrollIntoView({block:'nearest'});
    });
    transitionStep.addEventListener('change',renderClusters);
    transitionPanel.querySelector('[data-rossler-transition-clear]').addEventListener('click',()=>{
      clearTransition();
      renderClusters();
      clusterSample.focus({preventScroll:true});
    });
    clusterSample.addEventListener('change',()=>{
      clearTransition();
      renderClusters();
    });
    modeButtons.forEach(button=>button.addEventListener('click',()=>selectMode(button.dataset.rosslerMode)));
    stepButton.addEventListener('click',()=>{sampleIndex++;render(true)});
    resetButton.addEventListener('click',()=>{sampleIndex=0;render(true)});
    nextButton.addEventListener('click',()=>{
      cycleIndex++;
      sampleIndex=0;
      render(true);
      stepButton.focus();
    });
    const observer=new ResizeObserver(()=>render());
    plots.forEach(plot=>observer.observe(plot));
    const openRosslerLink=()=>{
      if(location.hash==='#helix-rossler-janus')selectMode('janus');
      if(location.hash==='#helix-rossler-clusters')selectMode('clusters');
    };
    window.addEventListener('hashchange',openRosslerLink);
    selectMode('compare');
    openRosslerLink();
  }

  function openTermLink(){
    if(location.hash!==`#${termPanel.id}`)return false;
    if(mode!=='zeta')setMode('zeta');
    termPanel.scrollIntoView();
    return true;
  }
  window.addEventListener('resize',resize);
  window.addEventListener('hashchange',openTermLink);
  new ResizeObserver(resize).observe(canvas);
  setupRosslerLift(root.querySelector("#helix-rossler-lift"));
  function showPrimeRecord(record,showStack){
    sliceToggle.checked=false;
    stackToggle.checked=showStack;
    setMode('residue');
    setResidueAngle('paired');
    setSelected(record.index-1);
  }
  function showResidueStack(recordId){
    const snapshot=stackSnapshots.find(record=>record.sourceIds[0]===recordId)||stackSnapshots[0];
    showPrimeRecord(snapshot,true);
  }
  function showMod7(slicing){
    sliceToggle.checked=slicing;
    mod7Toggle.checked=true;
    setMode('residue');
    setResidueAngle('mod7');
  }
  function openResidueLink(){
    if(location.hash==='#helix-prime-record'){
      const recordId=new URLSearchParams(location.search).get('helix');
      const record=M.primeResidueRecords().find(item=>item.sourceIds[0]===recordId);
      if(!record)return false;
      showPrimeRecord(record,stackSnapshots.some(snapshot=>snapshot.index===record.index));
      return true;
    }
    if(location.hash==='#helix-stack-5-1'){
      showResidueStack(new URLSearchParams(location.search).get('helix'));
      return true;
    }
    if(location.hash==='#helix-mod7-fourier'){
      showMod7(true);
      fourierPanel.scrollIntoView();
      return true;
    }
    if(location.hash==='#helix-mod7-slices'||location.hash==='#helix-mod7-axes'){
      showMod7(location.hash==='#helix-mod7-slices');
      return true;
    }
    return false;
  }
  function showKinks(){
    setMode('zeta');
    setZetaLens('trace');
  }
  function openKinkLink(){
    if(location.hash!=='#helix-zeta-kinks')return false;
    showKinks();
    return true;
  }
  function setupTour(){
    const tour=root.querySelector('#helix-tour');
    const jump=tour.querySelector('[data-hv-tour-stop]');
    const count=tour.querySelector('[data-hv-tour-count]');
    const back=tour.querySelector('[data-hv-tour-back]');
    const next=tour.querySelector('[data-hv-tour-next]');
    const title=tour.querySelector('#helixTourTitle');
    const reading=tour.querySelector('[data-hv-tour-reading]');
    const action=tour.querySelector('[data-hv-tour-action]');
    const rossler=root.querySelector('#helix-rossler-lift');
    const station=[
      {
        title:'Eine Sprosse lesen', target:'helix-workbench',
        reading:'Die erste Sprosse verbindet 3 und 5, das erste der hier gezeigten Primzahlpaare mit Abstand 2. Rechts steht, welche Zahlen du ausgewählt hast.',
        action:'Zieh an der Grafik. Drücke dann den Pfeil neben dem Sprossenregler und vergleiche das nächste Paar.',
        open(){setMode('twins');setStrandMode('double');setRegisterMode('pair');setMix(0);}
      },
      {
        title:'Eine Primzahl auf zwei Spuren', target:'helix-stack-5-1',
        reading:'Die Höhe folgt der Primzahlreihenfolge. Lila zeigt den Rest bei Division durch 7, Gold den Rest bei Division durch 11. 89, 397 und 859 haben jeweils dieselben beiden Reste.',
        action:'Drehe den Stack und vergleiche die drei Höhen. Die Links bei den Snapshots führen zur genauen Adresse im Primecube.',
        open(){showResidueStack('PC1111:N0397');}
      },
      {
        title:'Eine Ebene nach der anderen', target:'helix-mod7-slices',
        reading:'Grün markiert Rest 2, Pink Rest 6. Im Slicing zeigt die Draufsicht pro Primzahl einen Treffer oder eine leere Ebene.',
        action:'Blättere mit den Pfeilen. Bei einem Treffer zeigen die beiden Bögen die Abstände zu den nächsten Ecken der versetzten Oktagone.',
        open(){showMod7(true);}
      },
      {
        title:'Zwei Knicke beim Drehen verfolgen', target:'helix-zeta-kinks',
        reading:'Im Trace-Wort RLLR wechselt die Richtung zweimal, beim Eintritt in LL und beim Austritt. Gold und Pink markieren diese beiden Stellen im gewählten Viererblock.',
        action:'Starte die Drehung und beobachte die Koordinaten neben der Grafik. Wähle unten LRRL, um die gespiegelte Vorzeichenfolge anzusehen.',
        open(){showKinks();setTraceWord('RLLR');setTraceAngle(0);}
      },
      {
        title:'Riemann und Ihara an einem Beispiel', target:'helix-phase-term-comparison',
        reading:'Für das erste Nullstellenpaar, p=2 und Wiederholung r=1 kannst du Phase, Gewicht und Vorzeichen einzelner Terme vergleichen.',
        action:'Wähle beide Rath-Rückwege nacheinander. Vergleiche, was die sofortige Kantenumkehr und der Umlauf über Cathedral im Ihara-Feld ergeben.',
        open(){
          termPrime.value='2';
          termRepeats.value='1';
          iharaRoute.value='other';
          setMode('zeta');
          setZetaLens('smooth');
        }
      },
      {
        title:'Einen Rössler-Umlauf messen', target:'helix-rossler-lift',
        reading:'Umlauf 1 und 5 beginnen an derselben Schnittregel und laufen bis zur nächsten Passage in derselben Richtung. Beide Bilder benutzen dieselbe z-Skala.',
        action:'Mach ein paar Schritte und vergleiche die z-Spitzen. Unter JANUS-Overlap markiert ein Klick denselben Bahnpunkt im Grundriss und in der Ansicht mit Höhe.',
        open(){rossler.querySelector('[data-rossler-mode="compare"]').click();}
      },
      {
        title:'Wo macht z einen Unterschied?', target:'helix-rossler-clusters',
        reading:'XY und XYZ gruppieren dieselben Samples. In der Zelle 1→1 fallen beim Wechsel zu XYZ 19 Schritte heraus. Gold zeigt diese Schritte in beiden Bahnen.',
        action:'Wähle einen goldenen Schritt im Menü. Lies seinen XYZ-Übergang und die beiden Höhen ab.',
        open(){
          rossler.querySelector('[data-rossler-mode="clusters"]').click();
          rossler.querySelector('[data-rossler-transition-cell="0,0"]').click();
        }
      },
      {
        title:'Kuramoto · Gruppe und Einzelspur', target:'kuramoto-phasenvergleich',
        reading:'Die drei Läufe starten mit denselben Phasen und Eigenfrequenzen. K regelt, wie stark sich die Oszillatoren gegenseitig beeinflussen. R fasst den Zusammenhalt der Gruppe zusammen.',
        action:'Bewege den gemeinsamen Zeitregler. Vergleiche die Spuren von 5 und 19 und prüfe, ob ihre relativen Phasen weiterdriften.'
      }
    ];
    jump.replaceChildren(...station.map(({title},index)=>new Option(title,String(index))));
    let index=0,target=null,scrollFrame=0;
    function showStation(value){
      index=value;
      const entry=station[index];
      tour.hidden=false;
      jump.value=String(index);
      count.textContent=(index+1)+' von '+station.length;
      back.disabled=index===0;
      next.textContent=index===station.length-1?'Tour abschließen':'Weiter';
      title.textContent=entry.title;
      reading.textContent=entry.reading;
      action.textContent=entry.action;
      stopKinkRotation();
      entry.open?.();
      window.cancelAnimationFrame(scrollFrame);
      target=root.querySelector('#'+entry.target);
      scrollFrame=window.requestAnimationFrame(()=>{
        const top=target.getBoundingClientRect().top+window.scrollY-tour.getBoundingClientRect().height-10;
        window.scrollTo({top:Math.max(0,top),behavior:'instant'});
      });
    }
    function closeTour(){
      window.cancelAnimationFrame(scrollFrame);
      tour.hidden=true;
      if(target){
        if(!target.matches('button'))target.setAttribute('tabindex','-1');
        target.focus({preventScroll:true});
      }
    }
    root.querySelector('[data-hv-tour-start]').addEventListener('click',()=>{
      showStation(0);
      title.focus({preventScroll:true});
    });
    jump.addEventListener('change',()=>showStation(Number(jump.value)));
    back.addEventListener('click',()=>{
      showStation(index-1);
      if(back.disabled)next.focus({preventScroll:true});
    });
    next.addEventListener('click',()=>{
      if(index===station.length-1)closeTour();
      else showStation(index+1);
    });
    tour.querySelector('[data-hv-tour-exit]').addEventListener('click',closeTour);
    tour.addEventListener('keydown',event=>{if(event.key==='Escape')closeTour();});
    function openTourLink(){
      if(location.hash==='#helix-tour'){
        showStation(0);
        title.focus({preventScroll:true});
      }
    }
    window.addEventListener('hashchange',openTourLink);
    openTourLink();
  }
  window.addEventListener('hashchange',openResidueLink);
  window.addEventListener('hashchange',openKinkLink);
  if(!openTermLink()&&!openResidueLink()&&!openKinkLink())setMix(0);
  setupTour();
  resize();
})();
