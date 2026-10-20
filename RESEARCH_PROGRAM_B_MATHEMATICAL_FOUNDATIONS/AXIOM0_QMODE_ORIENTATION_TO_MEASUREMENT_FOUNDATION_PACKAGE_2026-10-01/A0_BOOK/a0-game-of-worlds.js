(function(root){
  'use strict';
  if(!root.document||!document.getElementById('worldPick'))return;
  const model=root.A0GameOfWorldsModel,temporal=root.LifeTemporalZ,projection=root.A0SpatialReaderPrimitives,$=id=>document.getElementById(id);
  if(!model||!temporal||!projection){$('worldError').textContent='Ein Quellbaustein fehlt. Das Originalinstrument bleibt verfügbar.';return}
  let session=model.start({world:'life'}),timer=null,pending=false,selected=null,drag=null,camera={yaw:-.4,pitch:.35,zoom:1},afterBox=null;
  const color={life:'#ed72aa',euler:'#ffca55',fibonacci:'#76e1b3'};
  function pause(){if(timer!==null)root.clearInterval(timer);timer=null;$('worldPlay').textContent='PLAY ▶';$('worldPlay').setAttribute('aria-pressed','false')}
  function configure(){pause();pending=true;$('worldError').textContent='Neue Auswahl vorgemerkt · „Neue Welt starten“ übernimmt sie und ersetzt den bisherigen Lauf.';updateButtons()}
  function updateButtons(){
    const atEnd=session.cursor>=model.worlds[session.config.world].limit;
    $('worldStep').disabled=pending||atEnd;$('worldPlay').disabled=pending||atEnd;$('worldBack').disabled=session.cursor===0;
    $('worldRe').disabled=$('worldPick').value!=='euler';$('worldIm').disabled=$('worldPick').value!=='euler';
    $('worldPattern').disabled=$('worldPick').value!=='life';$('worldBoundary').disabled=$('worldPick').value!=='life';
  }
  function start(){
    pause();try{const fresh=model.start({world:$('worldPick').value,pattern:$('worldPattern').value,boundary:$('worldBoundary').value,re:$('worldRe').value,im:$('worldIm').value});session=fresh;pending=false;selected=null;$('worldError').textContent='';$('worldReceipt').textContent='Neue Welt · noch kein Replay geprüft.';render()}catch(error){$('worldError').textContent=error.message}
  }
  function step(manual=false){
    if(pending)return;if(manual)pause();
    try{session=model.step(session);$('worldReceipt').textContent='Record erweitert · Replay kann erneut geprüft werden.';if(model.mission(session).success||session.cursor===model.worlds[session.config.world].limit)pause();render()}catch(error){pause();$('worldError').textContent=error.message}
  }
  function play(){if(timer!==null){pause();return}if(pending||document.hidden)return;
    timer=root.setInterval(()=>step(false),Number($('worldSpeed').value));$('worldPlay').textContent='PAUSE Ⅱ';$('worldPlay').setAttribute('aria-pressed','true');
  }
  function jump(index){pause();session=model.at(session,index);render()}
  function label(frame){
    const c=session.config,s=frame.state;
    if(c.world==='life')return 'g'+frame.generation+' · '+s.live.length+' lebende Zellen';
    if(c.world==='euler')return 'g'+frame.generation+' · z = '+s.re+(s.im<0?' − ':' + ')+Math.abs(s.im)+'i';
    return 'F'+frame.generation+' = '+s.a+' · Paar ('+s.a+', '+s.b+')';
  }
  function canvas(id){const el=$(id),box=el.getBoundingClientRect(),w=Math.max(1,box.width),h=Math.max(1,box.height),ratio=Math.min(root.devicePixelRatio||1,2),ctx=el.getContext('2d');el.width=Math.round(w*ratio);el.height=Math.round(h*ratio);ctx.setTransform(ratio,0,0,ratio,0,0);ctx.clearRect(0,0,w,h);return{el,ctx,w,h}}
  function field(id,frame){
    const {ctx,w,h}=canvas(id),cell=Math.min((w-30)/frame.size,(h-30)/frame.height),left=(w-cell*frame.size)/2,top=(h-cell*frame.height)/2;
    for(let y=0;y<frame.height;y++)for(let x=0;x<frame.size;x++){ctx.fillStyle='#12303f';ctx.fillRect(left+x*cell,top+y*cell,Math.max(1,cell-1.5),Math.max(1,cell-1.5))}
    for(const p of frame.points){ctx.fillStyle=selected&&p.x===selected.x&&p.y===selected.y?'#ffca55':color[session.config.world];ctx.fillRect(left+p.x*cell,top+p.y*cell,Math.max(1,cell-1.5),Math.max(1,cell-1.5))}
    if(selected){ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.strokeRect(left+selected.x*cell,top+selected.y*cell,cell,cell)}
    if(id==='worldAfter')afterBox={left,top,cell,width:frame.size,height:frame.height};
  }
  function polar(frame){
    const{ctx,w,h}=canvas('worldPolar'),cx=w/2,cy=h/2,radius=Math.min(w,h)*.39;
    for(const fraction of [.35,.65,1]){ctx.beginPath();ctx.arc(cx,cy,radius*fraction,0,2*Math.PI);ctx.strokeStyle='#315365';ctx.stroke()}
    function point(p,ghost=false){const angle=2*Math.PI*p.x/frame.size-Math.PI/2,r=radius*(.35+.65*p.y/Math.max(1,frame.height-1)),x=cx+r*Math.cos(angle),y=cy+r*Math.sin(angle);ctx.beginPath();ctx.arc(x,y,ghost?7:4,0,Math.PI*2);if(ghost){ctx.strokeStyle='#fff';ctx.stroke()}else{ctx.fillStyle=color[session.config.world];ctx.fill()}}
    frame.points.forEach(p=>point(p));if(selected)point(selected,true);
  }
  function history(){
    const{ctx,w,h}=canvas('worldHistory'),first=Math.max(0,session.cursor-11),last=session.cursor,frames=session.frames.slice(first,last+1),items=[],shape=$('worldHistoryShape').value;
    const project=xyz=>projection.project(xyz.map(v=>v*.4),camera,w,h);
    ctx.strokeStyle='#315365';ctx.lineWidth=1;
    for(const frame of frames){
      const z=(frame.generation-first)/Math.max(1,last-first)*5-2.5;
      const guide=shape==='cylinder'?Array.from({length:49},(_,i)=>{const angle=i/48*Math.PI*2;return[2.2*Math.cos(angle),z,2.2*Math.sin(angle)]}):[[-2,z,-2],[2,z,-2],[2,z,2],[-2,z,2],[-2,z,-2]];
      ctx.beginPath();guide.map(project).forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.stroke();
    }
    for(const frame of frames)for(const p of frame.points){
      let xyz;
      if(shape==='cylinder'){const q=temporal.map(p,frame.size,'cylinder-x',first,last,{height:5,baseRadius:1.2,laneDepth:.9});xyz=[q.x,q.z,q.y]}
      else xyz=[(p.x/Math.max(1,frame.size-1)-.5)*4,(frame.generation-first)/Math.max(1,last-first)*5-2.5,(p.y/Math.max(1,frame.height-1)-.5)*4];
      items.push({p,point:project(xyz),latest:frame.generation===last});
    }
    items.sort((a,b)=>a.point.z-b.point.z);
    for(const{p,point,latest}of items){ctx.globalAlpha=latest?1:.28;ctx.beginPath();ctx.arc(point.x,point.y,latest?4:2.3,0,2*Math.PI);ctx.fillStyle=selected&&selected.x===p.x&&selected.y===p.y?'#ffca55':color[session.config.world];ctx.fill()}
    ctx.globalAlpha=1;ctx.fillStyle='#a6becb';ctx.font='11px ui-monospace,monospace';ctx.fillText('g'+first+' → g'+last+' · '+shape+' · view only',12,h-12);
  }
  function joint(){
    const L=model.joint(session),{ctx,w,h}=canvas('worldJoint'),colors=['#647786','#54d7ef','#ed72aa','#ffca55'],counts=[L.c00,L.c01,L.c10,L.c11],x=18,y=25,aw=w*.34,ah=h-80,top=L.previous.zero/L.total*ah,bottom=ah-top,ts=L.previous.zero?L.c00/L.previous.zero*aw:0,bs=L.previous.one?L.c10/L.previous.one*aw:0;
    for(const [i,box]of[[0,[x,y,ts,top]],[1,[x+ts,y,aw-ts,top]],[2,[x,y+top,bs,bottom]],[3,[x+bs,y+top,aw-bs,bottom]]]){ctx.fillStyle=colors[i];ctx.fillRect(...box)}
    ctx.strokeStyle='#d3e6f0';ctx.strokeRect(x,y,aw,ah);
    const sx=w*.53,tx=w*.9,ys=[y+ah*.22,y+ah*.78];
    for(let a=0;a<2;a++)for(let b=0;b<2;b++){const i=a*2+b;if(!counts[i])continue;ctx.beginPath();ctx.moveTo(sx,ys[a]);ctx.bezierCurveTo(sx+w*.15,ys[a],tx-w*.15,ys[b],tx,ys[b]);ctx.strokeStyle=colors[i];ctx.globalAlpha=.7;ctx.lineWidth=Math.max(1,counts[i]/L.total*22);ctx.stroke()}
    ctx.globalAlpha=1;ctx.lineWidth=1;ctx.fillStyle='#e9f2f5';ctx.font='12px ui-monospace,monospace';ctx.fillText('EXACT AREA',x,h-20);ctx.fillText('0',sx-20,ys[0]);ctx.fillText('1',sx-20,ys[1]);ctx.fillText('0',tx+10,ys[0]);ctx.fillText('1',tx+10,ys[1]);ctx.fillText('t → t+1 · min. 1px Kanalbreite',sx,h-20);
    $('worldJointReadout').textContent=(L.hasTransition?'ÜBERGANG':'STARTVERGLEICH, noch kein Zeitschritt')+' · C₀₀ '+L.c00+' + C₀₁ '+L.c01+' + C₁₀ '+L.c10+' + C₁₁ '+L.c11+' = '+L.total+' · '+(L.exact?'EXACT':'HOLD')+'\nFeldbelegung gleich: '+(L.occupancyEqual?'ja':'nein')+' · vollständiger Weltzustand gleich: '+(L.fullStateEqual?'ja':'nein');
  }
  function render(){
    const f=session.frames[session.cursor],before=session.frames[Math.max(0,session.cursor-1)],c=session.config,m=model.mission(session),events=model.eventLedger(session);
    $('worldName').textContent=model.worlds[c.world].name;$('worldEquation').textContent=model.worlds[c.world].equation;$('worldCarrier').textContent='ε_Träger · '+model.worlds[c.world].carrier+(c.world==='life'?' · dynamischer Rand: '+c.boundary:'');
    $('worldLocation').textContent='g '+f.generation+' / '+model.worlds[c.world].limit;
    $('worldAxisContract').textContent='Z · '+session.viewContract.axis_kind.toUpperCase()+' · '+session.viewContract.z_semantics+'\nθ · Display-Spalte | r · Display-Zeile | sample '+session.cursor+'\nNur View: '+session.viewContract.carrier_id;
    $('worldMission').textContent=m.title;$('worldAchievement').textContent=m.success?'ZIEL ERREICHT ✓ · weiter inspizieren oder Replay lesen':'Schritt '+f.generation+' · Ziel ab Schritt '+m.target;
    $('worldChannel').textContent=c.world==='life'?'LIFE · B3/S23':c.world==='euler'?'Euler · ×i':'Fibonacci · Paarregel';
    $('worldBeforeValue').textContent=label(before);$('worldAfterValue').textContent=label(f);
    $('worldScrub').max=String(session.frames.length-1);$('worldScrub').value=String(session.cursor);
    $('worldTimeline').replaceChildren();
    session.frames.forEach((frame,i)=>{const button=document.createElement('button');button.type='button';button.textContent='g'+i;button.setAttribute('aria-pressed',String(i===session.cursor));button.onclick=()=>jump(i);$('worldTimeline').append(button)});
    if(c.world==='life'){$('worldEvents').textContent=(session.cursor?'ÜBERGANG':'START · noch kein Übergang')+'\nBirth '+events.births+' · Survive '+events.survivals+' · Death '+events.deaths;$('worldViewBoundary').textContent='Ereignistypen kommen aus dem unveränderten LIFE-Kern. Der geometrische Zylinder ist davon getrennt.'}
    else{$('worldEvents').textContent=c.world==='euler'?'EXAKTE DREHUNG · |z|² = '+(f.state.re*f.state.re+f.state.im*f.state.im):'F'+f.generation+' = '+f.state.a+' · positive Primzahl: '+(events.prime?'ja':'nein');$('worldViewBoundary').textContent=c.world==='fibonacci'?'Das Grid trägt (F mod 11, F mod 7), nicht die vollständige Zahl. Der exakte Record behält das Paar. Keine LIFE-Birth/Death-Semantik.':'Das Feld zeigt Re(z)+10, Im(z)+10. Die Ansicht ist nicht die Menge der ganzen komplexen Zahlen. Keine LIFE-Birth/Death-Semantik.'}
    const address=selected||f.points[0];$('worldAddress').textContent=address?'Welt '+c.world+' · g'+f.generation+' · Adresse ('+address.x+','+address.y+') · '+(f.points.some(p=>p.x===address.x&&p.y===address.y)?'belegt':'unbelegt')+'\nRecord-ID: '+f.identity:'Keine belegte Adresse · g'+f.generation+' · der leere Zustand bleibt ein gültiger Zustand.';
    $('worldInspectX').max=String(f.size-1);$('worldInspectY').max=String(f.height-1);$('worldInspectX').value=String(address?.x??0);$('worldInspectY').value=String(address?.y??0);
    updateButtons();field('worldBefore',before);field('worldAfter',f);polar(f);history();joint();
  }
  $('worldNew').onclick=start;$('worldPlay').onclick=play;$('worldStep').onclick=()=>step(true);$('worldBack').onclick=()=>jump(Math.max(0,session.cursor-1));$('worldHome').onclick=()=>jump(0);
  $('worldScrub').oninput=()=>jump(Number($('worldScrub').value));
  for(const id of ['worldPick','worldPattern','worldBoundary','worldRe','worldIm'])$(id).onchange=configure;
  $('worldSpeed').onchange=()=>{const running=timer!==null;pause();if(running)play()};
  $('worldHistoryShape').onchange=render;
  $('worldInspectX').onfocus=$('worldInspectY').onfocus=pause;
  $('worldInspect').onclick=()=>{pause();const f=session.frames[session.cursor],x=Number($('worldInspectX').value),y=Number($('worldInspectY').value);if(!Number.isInteger(x)||!Number.isInteger(y)||x<0||y<0||x>=f.size||y>=f.height){$('worldError').textContent='Adresse liegt außerhalb des aktiven Trägers.';return}selected={x,y};render()};
  $('worldReplayCheck').onclick=()=>{pause();const result=model.replay(session);$('worldReceipt').textContent=result.status+' · '+(result.frames||0)+' Frames exakt wiederberechnet. Gespeicherter Return, keine inverse Dynamik.'};
  $('worldExport').onclick=()=>{pause();const result=model.replay(session);if(result.status!=='PASS'){$('worldReceipt').textContent='Export HOLD · Replay nicht bestanden.';return}const blob=new Blob([JSON.stringify(session,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='nexah-game-of-worlds-'+session.config.world+'-g'+session.cursor+'.json';document.body.append(link);link.click();link.remove();root.setTimeout(()=>URL.revokeObjectURL(url),0);$('worldReceipt').textContent='Record exportiert · Replay PASS. Keine Publikation.'};
  $('worldAfter').onclick=event=>{const box=$('worldAfter').getBoundingClientRect(),x=Math.floor((event.clientX-box.left-afterBox.left)/afterBox.cell),y=Math.floor((event.clientY-box.top-afterBox.top)/afterBox.cell);if(x>=0&&y>=0&&x<afterBox.width&&y<afterBox.height){selected={x,y};render()}};
  $('worldHistory').onpointerdown=event=>{drag={x:event.clientX,y:event.clientY};$('worldHistory').setPointerCapture(event.pointerId)};
  $('worldHistory').onpointermove=event=>{if(!drag)return;camera.yaw+=(event.clientX-drag.x)*.008;camera.pitch=Math.max(-1.3,Math.min(1.3,camera.pitch+(event.clientY-drag.y)*.008));drag={x:event.clientX,y:event.clientY};history()};
  $('worldHistory').onpointerup=$('worldHistory').onpointercancel=()=>{drag=null};
  $('worldHistory').onkeydown=event=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key))return;event.preventDefault();if(event.key==='ArrowLeft')camera.yaw-=.15;if(event.key==='ArrowRight')camera.yaw+=.15;if(event.key==='ArrowUp')camera.pitch=Math.min(1.3,camera.pitch+.1);if(event.key==='ArrowDown')camera.pitch=Math.max(-1.3,camera.pitch-.1);history()};
  document.addEventListener('visibilitychange',()=>{if(document.hidden)pause()});root.addEventListener('resize',render);
  render();root.A0GameOfWorlds={snapshot:()=>JSON.parse(JSON.stringify(session)),pause,step:()=>step(true),render,replay:()=>model.replay(session)};
})(typeof window==='undefined'?globalThis:window);
