/* Separate, reversible display experiment. Does not modify AXIS08 or the fractal operator. */
(() => {
  'use strict';
  const host=document.getElementById('pentagonSewing'),model=window.A0PentagonSewing;
  if(!host||!model||!window.A0Axis08FoldReturnView)return;
  const svg=document.getElementById('sewingSvg'),levelInput=document.getElementById('sewingLevel'),offsetInput=document.getElementById('sewingOffset'),speedInput=document.getElementById('sewingSpeed'),play=document.getElementById('sewingPlay'),auto=document.getElementById('sewingAuto'),readout=document.getElementById('sewingReadout'),recordOut=document.getElementById('sewingRecord'),ns='http://www.w3.org/2000/svg';
  const values=window.A0Axis08FoldReturnView.source.source.laneMeans.slice();
  const modeInput=document.getElementById('sewingMode'),pairSummary=document.getElementById('sewingPairSummary');
  const apertureInput=document.getElementById('sewingAperture'),referenceInput=document.getElementById('sewingCircleReference'),apertureOut=document.getElementById('sewingApertureOut');
  const apertureState=()=>({mask:apertureInput?.value||'all',...model.aperture(record.quotient.length,referenceInput?.value||'ring90')});
  let record=model.fold(values),time=0,playing=false,automatic=false,last=null,history=[],held=null,lastSample=-Infinity,lastDraw=-Infinity;
  const strip=document.getElementById('sewingLevelStrip'),levelButtons=[];
  if(strip)model.LEVELS.forEach((name,i)=>{const button=document.createElement('button');button.type='button';button.textContent=`${7-i} · ${name}`;button.addEventListener('click',()=>{levelInput.value=String(7-i);automatic=false;auto.classList.remove('active');render();});strip.appendChild(button);levelButtons.push(button);});
  const colors=['#e5b340','#29c7ef','#ee6ca5','#63d9aa'];
  let target=svg;
  const add=(tag,attrs,text,parent=target)=>{const el=document.createElementNS(ns,tag);Object.entries(attrs).forEach(([key,value])=>el.setAttribute(key,value));if(text!==undefined)el.textContent=text;parent.appendChild(el);return el;};
  const line=(a,b,color,width=1,dash='')=>add('line',{x1:a[0],y1:a[1],x2:b[0],y2:b[1],stroke:color,'stroke-width':width,'stroke-dasharray':dash});
  const circle=(p,r,color)=>add('circle',{cx:p[0],cy:p[1],r,fill:color});
  const text=(p,label,color='#dff2f7',size=12)=>add('text',{x:p[0],y:p[1],fill:color,'font-family':'monospace','font-size':size,'text-anchor':'middle'},label);
  const polar=(radius,index,count)=>[330+radius*Math.sin(index*2*Math.PI/count),280-radius*Math.cos(index*2*Math.PI/count)];
  const path=points=>points.map((p,i)=>`${i?'L':'M'}${p[0]},${p[1]}`).join(' ');
  const reading=t=>model.reading(record,t,window.A0SewingScore?.geometry(t)?.frequencies);
  function hold(){held={kind:record.mode==='4+4'?'8_TO_4_PLUS_4_DISPLAY_RETURN':'8_TO_5_PLUS_3_DISPLAY_RETURN',level:Number(levelInput.value),time,breathTime:time,aperture:apertureState(),score:window.A0SewingScore?.snapshot()??null,coupling:JSON.parse(JSON.stringify(record)),display:reading(time),history:history.map(p=>({time:p.time,views:p.views.map(v=>v.slice())})),boundary:'Aperture clips only the left source/pair/sewing drawing, not data or signal history. r4 is stored with no fourth signal rule. BPM is a visual pulse, not physical calibration.'};recordOut.textContent=JSON.stringify(held,null,2);}
  function setPlaying(value){playing=Boolean(value);play.textContent=playing?'Pause':'Sewing starten';play.classList.toggle('active',playing);render();}
  function render(){
    const score=window.A0SewingScore?.geometry(time);if(score)levelInput.value=String(score.level);
    speedInput.disabled=Boolean(score);auto.disabled=Boolean(score);levelInput.disabled=Boolean(score);levelButtons.forEach(button=>button.disabled=Boolean(score));
    const names=model.levels(record.mode),level=Number(levelInput.value),stage=score?6:7-level,r=reading(time),breath=score?(score.tracks.breath?score.breath:1):r.breath,radius=205*breath,poles=values.map((_,i)=>polar(radius,i,8)),q=record.quotient.map((_,i)=>polar(116,i,record.quotient.length));
    svg.setAttribute('aria-label',`${record.mode} · acht Quellpole, ${record.pairs.length} Paare, ${q.length} gelbe Koordinaten; drei bewegte Signalansichten`);
    svg.replaceChildren();target=svg;
    const aperture=apertureState(),boundaryPath=path(q)+' Z';
    const defs=add('defs',{}),clip=add('clipPath',{id:'sewingApertureClip',clipPathUnits:'userSpaceOnUse'},undefined,defs);
    add('path',{d:aperture.mask==='outside'?`M40,40 H620 V520 H40 Z ${boundaryPath}`:boundaryPath,'clip-rule':'evenodd'},undefined,clip);
    for(let n=7;n>=1;n--)add('circle',{cx:330,cy:280,r:38+n*26,fill:'none',stroke:n===level?'#e5b340':'#294b5b','stroke-width':n===level?2:1,opacity:.65});
    text([330,28],score?`MATROSCHKA ${score.phase<7?'7 → 1':'1 → 7'} · Ebene ${level} · ${score.section}`:`MATROSCHKA ${level} → 1 · ${names[stage]}`,'#ffe397',14);
    const sourceLayer=add('g',{'data-layer':'aperture-source',...(aperture.mask!=='all'?{'clip-path':'url(#sewingApertureClip)'}:{})});target=sourceLayer;
    poles.forEach((p,i)=>{line([330,280],p,'#315364');circle(p,7,'#218cc5');text([p[0],p[1]-14],`p${i+1}`);});
    if(stage>=1)record.pairs.forEach(([a,b],i)=>{line(poles[a],poles[b],'#63d9aa',4);text([(poles[a][0]+poles[b][0])/2,(poles[a][1]+poles[b][1])/2],`r${i+1}`,'#63d9aa');});
    target=svg;
    if(stage>=2||aperture.mask!=='all'){add('path',{d:boundaryPath,fill:'rgba(229,179,64,.08)',stroke:'#e5b340','stroke-width':2});q.forEach((p,i)=>{circle(p,5,'#e5b340');text([p[0],p[1]-12],`q${i+1}`,'#ffe397');});}
    if(stage>=3)record.residuals.forEach((v,i)=>text([810,52+i*22],`r${i+1} = ${v.toFixed(6)}`,colors[i]));
    target=sourceLayer;
    if(stage>=5&&(!score||score.tracks.sewing))record.pairs.forEach(([a,b],i)=>{[a,b].forEach((index,j)=>{const p=poles[index],c=q[i],control=[330+(j?100:-100),350+i*15];add('path',{d:`M${c[0]},${c[1]} Q${control[0]},${control[1]} ${p[0]},${p[1]}`,fill:'none',stroke:'#63d9aa','stroke-width':2,'stroke-dasharray':'7 6','stroke-dashoffset':-time*24});});});
    target=svg;
    if(stage>=2||aperture.mask!=='all'){
      add('circle',{cx:330,cy:280,r:aperture.circleRadius,fill:'none',stroke:'#d778ff','stroke-width':2,'stroke-dasharray':'4 4','data-role':'aperture-circle'});
      aperture.contacts.forEach((contact,i)=>{const p=[330+contact.point[0],280+contact.point[1]];add('circle',{cx:p[0],cy:p[1],r:4,fill:'#d778ff',stroke:'#071f2c','stroke-width':1,'data-role':'aperture-contact'});text([p[0]+10,p[1]+14],`${aperture.relation==='tangent'?'T':aperture.relation==='vertices'?'V':'X'}${i+1}`,'#eebaff',9);});
    }
    circle([330,280],24,'#071f2c');text([330,285],'RETURN','#ffe397',10);
    const scale=65/Math.max(...record.residuals.slice(0,3).map(Math.abs),.001);
    if(stage>=4){['AM','VM','PM'].forEach((name,i)=>{if(score&&!score.tracks[name])return;const center=[810,195+i*145],pos=v=>[center[0]+v[0]*scale,center[1]-v[1]*scale];line([center[0]-75,center[1]],[center[0]+75,center[1]],'#315364');line([center[0],center[1]-65],[center[0],center[1]+65],'#315364');text([center[0]-100,center[1]],name,colors[i]);
      if(stage>=5&&history.length>1){add('path',{d:path(history.map(h=>pos(h.views[i]))),fill:'none',stroke:colors[i],'stroke-width':1.5,opacity:.65});if(!score||score.tracks.shadow)add('path',{d:path(history.map(h=>pos([h.views[i][0],0]))),fill:'none',stroke:'#bca7dd','stroke-width':3,opacity:.45});}
      const p=pos(r.views[i]),shadow=pos([r.views[i][0],0]);if(!score||score.tracks.shadow){line(p,shadow,'#bca7dd',1,'4 4');circle(shadow,4,'#bca7dd');}circle(p,5,colors[i]);
      if(score&&score.echoDelay!==null&&time>=score.echoDelay){const previous=reading(time-score.echoDelay).views[i],echo=pos([previous[0],0]);add('circle',{cx:echo[0],cy:echo[1],r:7,fill:'none',stroke:'#d778ff','stroke-width':2});}
    });}
    text([330,552],stage>=6?`${record.mode} → 8 · Returnfehler ${record.error.toExponential(2)}`:record.mode==='4+4'?'Vier Paarmittel · vier Unterschiede bleiben erhalten':'Drei Paarmittel + zwei Einzelwerte · drei Unterschiede bleiben erhalten','#ffe397');
    if(pairSummary)pairSummary.textContent=`${record.mode} · ${record.pairs.map(([a,b],i)=>`r${i+1}=(p${a+1}−p${b+1})/2=${record.residuals[i].toFixed(6)}`).join(' · ')}${record.singles.length?` · einzeln: ${record.singles.map(i=>`p${i+1}`).join(', ')}`:' · r4 gespeichert, ohne zusätzliche Schwingung'}. Gelbe Werte q=[${record.quotient.map(v=>v.toFixed(6)).join(', ')}]. Rückweg zu acht Werten: Fehler ${record.error.toExponential(2)}. Polygonpositionen sind Darstellungsplätze, keine Wertradien.`;
    if(apertureOut){const relation={inside:'Kreis liegt innen; kein Kantenkontakt',tangent:'Tangente an jeder Kante',crossing:'Kreis schneidet die Kanten',vertices:'Kreis durch die Ecken; keine Kantentangente'}[aperture.relation];apertureOut.textContent=`${q.length===5?'Pentagon':'Viereck'} · Apertur ${aperture.mask==='all'?'alles':aperture.mask==='inside'?'innen':'außen'} · R=116 · Inkreis=${aperture.inradius.toFixed(3)} · Vergleichsradius=${aperture.circleRadius.toFixed(3)} · ${relation} · ${aperture.contacts.length} eindeutige Kontakte${aperture.relation==='inside'?` · Abstand zur Kante ${aperture.edgeGap.toFixed(3)}`:''}. Violett: Kreisreferenz; T=Berührung, X=Schnitt, V=Ecke. Referenz, Rand und rechte Signalansichten bleiben unmaskiert; Quelldaten und volle Signalspur bleiben erhalten.`;}
    document.getElementById('sewingLevelOut').textContent=String(level);document.getElementById('sewingOffsetOut').textContent=String(record.offset+1);document.getElementById('sewingSpeedOut').textContent=Number(speedInput.value).toFixed(2)+'×';
    levelButtons.forEach((button,i)=>{button.textContent=`${7-i} · ${names[i]}`;button.classList.toggle('active',7-i===level);button.setAttribute('aria-pressed',String(7-i===level));});
    readout.textContent=`t=${time.toFixed(2)} · Frequenzverhältnis ${r.frequencies.join(':')} · ${history.length} Spurpunkte · Schatten: (x,y) → (x,0). ${score?'Partitur-Gesamtansicht · 13 Viertel pro Atembogen; × und Ebenen-Automatik pausieren.':'7–1 ist die Leserichtung, nicht die Zahl unabhängiger Koordinaten.'}`;
    window.A0PentagonSewingView={snapshot:()=>({record:JSON.parse(JSON.stringify(record)),time,level,playing,automatic,held,aperture:apertureState()}),holdReturn:hold,setPlaying,refresh:render,clearTrace:()=>{history=[];lastSample=-Infinity;held=null;recordOut.textContent='Noch kein Return gehalten.';},reset:()=>{reset();render();}};
    window.A0SewingScore?.update({time,playing,residuals:record.residuals.slice(0,3)});
  }
  function reset(){time=0;history=[];lastSample=-Infinity;held=null;recordOut.textContent='Noch kein Return gehalten.';}
  levelInput.addEventListener('input',()=>{automatic=false;auto.classList.remove('active');render();});
  offsetInput.addEventListener('input',()=>{record=model.fold(values,Number(offsetInput.value),record.mode);reset();render();});
  modeInput?.addEventListener('change',()=>{record=model.fold(values,Number(offsetInput.value),modeInput.value);history=[];lastSample=-Infinity;held=null;recordOut.textContent='Noch kein Return gehalten.';render();});
  [apertureInput,referenceInput].forEach(input=>input?.addEventListener('change',()=>{held=null;recordOut.textContent='Noch kein Return gehalten.';render();}));
  play.addEventListener('click',()=>setPlaying(!playing));
  auto.addEventListener('click',()=>{automatic=!automatic;auto.classList.toggle('active',automatic);if(automatic){playing=true;play.textContent='Pause';play.classList.add('active');}});
  document.getElementById('sewingReset').addEventListener('click',()=>{reset();render();});
  document.getElementById('sewingHold').addEventListener('click',()=>{playing=false;play.textContent='Sewing starten';play.classList.remove('active');hold();render();});
  speedInput.addEventListener('input',render);
  function frame(now){const elapsed=last===null?0:Math.max(0,(now-last)/1000),scoreRate=window.A0SewingScore?.rate(),dt=scoreRate!=null?elapsed:Math.min(elapsed,.1);last=now;if(playing){time=model.advance(time,dt,scoreRate??Number(speedInput.value));if(automatic)levelInput.value=model.levelAt(time);if(time-lastSample>=.025){const r=reading(time);history.push({time,views:r.views});history=history.filter(p=>time-p.time<=2*Math.PI).slice(-600);lastSample=time;}if(now-lastDraw>=33){render();lastDraw=now;}}requestAnimationFrame(frame);}
  render();requestAnimationFrame(frame);
})();
