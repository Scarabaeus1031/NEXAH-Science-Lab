(function(){
  'use strict';
  const M=window.A0GameOfNumbers,P=window.A0SpatialReaderPrimitives,$=id=>document.getElementById(id),canvas=$('numberCanvas'),ctx=canvas.getContext('2d');
  if(!M||!P||!ctx){$('numberError').textContent='Zahlen- oder Ansichtsbaustein fehlt.';return}
  const sessions=Object.fromEntries(M.RULES.map(r=>[r,M.start(r)]));let rule='euler',view='rings',timer=null,loop=true,delay=700,orbit=false,drag=null,dirty=true,last=0,raf=null,side='front',touch=null,aperture='all',pqStarted=false,pqReady=false,pqFailed=false;
  const wheelSessions=new Map(),jointSessions=new Map();let jointModulus=12;
  const camera={yaw:.12,pitch:1.05,zoom:1},reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches||false;
  const session=()=>sessions[rule],frame=()=>session().frames[session().cursor];
  function publish(ready=false){parent.postMessage({type:'worlds-play-state',kind:'numbers',ready,running:timer!==null,loop,orbit,rule,side,status:(timer!==null?'Playing':'Paused')+' · '+rule+(rule==='sumlift'?' · '+(session().config.direction==='counter'?'Gegenlauf':'Gleichlauf'):'')+' · n '+session().cursor+' / '+M.limit(rule)},'*')}
  function pause(){if(timer!==null)clearInterval(timer);timer=null;orbit=false;publish();requestDraw()}
  function readout(){document.body.dataset.numberView=view;const s=session(),f=frame(),foldPhase=rule==='mixer'?f.state.phase:360*s.cursor/M.limit(rule),fold=M.mixerFold(Math.max(0,Math.min(360,foldPhase))),foldStatus=$('numberFoldStatus');if(view==='joint'){$('jointModulus').value=String(jointModulus);$('jointDirection').value=rule==='sumlift'?(s.config.direction||'co'):'co';$('jointDirection').disabled=rule!=='sumlift';$('jointActivate').hidden=rule==='sumlift';}$('numberJointControls').hidden=view!=='joint';if(rule==='wheels'){$('wheelRatio').value=s.config.ratio;$('wheelDirection').value=s.config.direction;}$('numberRule').textContent=M.labels[rule].toUpperCase()+(rule==='sumlift'?' · '+(s.config.direction==='counter'?'GEGENLAUF':'GLEICHLAUF'):'');$('numberValue').textContent=rule==='mixer'?f.state.phase+'° · Faltung '+f.state.foldAngle+'°':rule==='pq'?(f.state.clip_ms/1000)+' s · P / Q':M.value(f,rule);$('numberStep').textContent='n '+f.generation+' · '+view.toUpperCase()+' · '+aperture.toUpperCase()+' · '+side.toUpperCase();if(foldStatus){foldStatus.hidden=!['mixer','rgb'].includes(view);foldStatus.textContent='AXIS '+fold.axis+' · FOLD '+fold.angle+'° · CROWN '+String(fold.crownTick).padStart(2,'0')+'/19'+(fold.foldReturn?' · VIEW RETURN':'');}$('numberExact').textContent=JSON.stringify({state:f.state,config:s.config,identity:f.identity,display:M.contract(rule,view,{jointModulus},session().config),side,touch,aperture,contact_binding:'OPEN: Vendissimal X / signal / sign / signet not reconstructed'},null,2);$('numberScrub').max=String(s.frames.length-1);$('numberScrub').value=String(s.cursor);$('numberReceipt').textContent='';dirty=true;requestDraw();publish()}
  function advance(){touch=null;$('numberTouchStatus').textContent='';const s=session();if(s.cursor>=M.limit(rule)){if(loop)sessions[rule]=M.at(s,0);else pause();}else sessions[rule]=M.step(s);readout()}
  function play(){if(timer!==null){pause();return}if(document.hidden)return;timer=setInterval(advance,['mixer','wheels'].includes(rule)?Math.max(20,Math.round(delay/17.5)):rule==='pq'?Math.round(delay*5/7):delay);publish()}
  function command(action,value){
    if(action==='hello'){publish(true);return}
    if(action==='play')play();
    if(action==='pause')pause();
    if(action==='step'){pause();advance()}
    if(action==='wheel-config'&&rule==='wheels'&&value&&['3:2','2:3'].includes(value.ratio)&&['counter','co'].includes(value.direction)){pause();touch=null;$('numberTouchStatus').textContent='';const c=session().config;wheelSessions.set(c.ratio+'|'+c.direction,session());const key=value.ratio+'|'+value.direction;sessions.wheels=wheelSessions.get(key)||M.start('wheels',value);readout()}
    if(action==='joint-direction'&&rule==='sumlift'&&['co','counter'].includes(value)){pause();touch=null;$('numberTouchStatus').textContent='';jointSessions.set(session().config.direction||'co',session());sessions.sumlift=jointSessions.get(value)||M.start('sumlift',{direction:value});readout()}
    if(action==='joint-modulus'&&[11,12,13].includes(value)){jointModulus=value;readout()}
    if(action==='aperture'&&['all','A','B'].includes(value)){aperture=value;readout()}
    if(action==='flip'){side=side==='front'?'back':'front';readout()}
    if(action==='touch'){pause();touch=M.contact(frame());$('numberTouchStatus').textContent='X · CODEC '+touch.status+' · VENDISSIMAL / TOUCH BINDING OPEN';readout()}
    if(action==='reset'){touch=null;$('numberTouchStatus').textContent='';pause();sessions[rule]=M.at(session(),0);readout()}
    if(action==='loop'){loop=Boolean(value);publish()}
    if(action==='speed'&&['slow','normal','fast'].includes(value)){const running=timer!==null;if(running)clearInterval(timer);timer=null;delay={slow:1200,normal:700,fast:350}[value];if(running)play();}
    if(action==='rule'&&M.RULES.includes(value)){pause();touch=null;$('numberTouchStatus').textContent='';rule=value;readout()}
    if(action==='view'&&M.VIEWS.includes(value)){view=value;if(['rails','elevator','joint','mixer','rgb','pq','groups','wheels'].includes(view))orbit=false;if(view==='groups'){camera.pitch=1.05}else if(view==='tower'){camera.pitch=.2}else camera.pitch=1.05;readout()}
    if(action==='hood'){$('numberHood').hidden=!value;document.body.dataset.hood=String(Boolean(value));dirty=true;requestDraw()}
    if(action==='orbit'){orbit=!['rails','elevator','joint'].includes(view)&&Boolean(value);publish();requestDraw()}
  }
  window.addEventListener('message',e=>{if(e.source===parent&&e.data?.type==='worlds-play-command')command(e.data.action,e.data.value)});
  function line(points,color,width=1,alpha=1){if(!points.length)return;ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.globalAlpha=alpha;ctx.stroke();ctx.globalAlpha=1}
  function drawRails(w,h){
    const f=frame(),channels=M.contact(f).channels,primary=channels.find(c=>c.key===(rule==='euler'?'re':'a')),accent=rule==='dyadic'?'#ed72aa':'#54d7ef';
    const word=rule==='euler'?String(f.state.re)+' | '+String(f.state.im):f.state.a,bits=rule==='euler'?channels.filter(c=>['re','im'].includes(c.key)).map(c=>c.binary).join(' | '):primary.binary;
    function row(text,y,label,color){const gap=Math.min(35,w*.82/Math.max(1,text.length)),start=w/2-(text.length-1)*gap/2;ctx.fillStyle='#9fb6c5';ctx.font='10px ui-monospace,monospace';ctx.fillText(label,18,y-28);line([{x:w*.07,y:y+15},{x:w*.93,y:y+15}],color,1,.45);
      for(let i=0;i<text.length;i++){const index=side==='back'?text.length-1-i:i,x=start+index*gap;ctx.fillStyle=text[i]==='0'?'#315365':color;ctx.shadowColor=color;ctx.shadowBlur=text[i]==='0'?0:12;ctx.font=Math.max(7,Math.min(21,gap*.76))+'px ui-monospace,monospace';ctx.textAlign='center';ctx.fillText(text[i],x,y+5);}ctx.shadowBlur=0;ctx.textAlign='left';}
    row(word,h*.34,'DECIMAL · '+(rule==='euler'?'RE | IM':'EXACT WORD'),accent);row(bits,h*.68,'BINARY · EXACT INTEGER ENCODING','#ffca55');
    const cx=w/2,cy=h*.5;line([{x:w*.22,y:h*.38},{x:w*.78,y:h*.62}],accent,1.5,.6);line([{x:w*.78,y:h*.38},{x:w*.22,y:h*.62}],'#ed72aa',1.5,.6);
    ctx.fillStyle='#081b29';ctx.beginPath();ctx.arc(cx,cy,29,0,Math.PI*2);ctx.fill();ctx.strokeStyle=touch?'#ffca55':accent;ctx.stroke();ctx.fillStyle=touch?'#ffca55':accent;ctx.font='22px ui-monospace,monospace';ctx.textAlign='center';ctx.fillText('X',cx,cy+7);ctx.font='9px ui-monospace,monospace';ctx.fillText('TOUCH · CODEC TEST',cx,cy+46);ctx.fillText('VENDISSIMAL BINDING: OPEN',cx,cy+61);ctx.textAlign='left';
    ctx.fillStyle='#c1d7e2';ctx.font='11px ui-monospace,monospace';ctx.fillText('QRT20 · q '+primary.q+' / r '+primary.r,18,h*.84);
    if(rule==='dyadic')ctx.fillText('A '+f.state.left+' · B '+f.state.a+' · Δ '+f.state.delta,18,h*.9);
    if(rule==='repunit')ctx.fillText(f.state.repunit+'² = '+f.state.a,18,h*.9);
    if(rule==='carrier')ctx.fillText('SOURCE ROUTE · '+f.operation,18,h*.9);
    ctx.fillStyle='#8daeba';ctx.font='10px ui-monospace,monospace';ctx.fillText('n '+f.generation+' · '+side.toUpperCase()+' · SIDE FLIP ONLY, NOT NEXT GENERATION',18,h-16);
  }
  function drawElevator(w,h){
    const f=frame(),family=M.elevatorFamily(f),qs=family.map(c=>Number(c.q)),min=523,max=736,top=130,bottom=h-90;
    const x=r=>36+(w-72)*(Number(r)+.5)/20,y=q=>bottom-(Number(q)-min)/(max-min)*(bottom-top);
    ctx.textAlign='center';ctx.font='10px ui-monospace,monospace';
    for(let r=0;r<20;r++){const px=x(side==='back'?19-r:r);ctx.fillStyle=r===17?'#123b4c':'#0a1b29';ctx.fillRect(px-(w-72)/42,top,(w-72)/21,bottom-top);ctx.fillStyle='#91b0bf';ctx.fillText(String(r),px,top-14)}
    for(const c of family){const px=x(side==='back'?19-Number(c.r):c.r),py=y(c.q),active=c.seed==='11537';ctx.strokeStyle=active?'#ffca55':'#54d7ef';ctx.fillStyle='#091b2a';ctx.shadowColor=ctx.strokeStyle;ctx.shadowBlur=active?20:6;ctx.beginPath();ctx.arc(px,py,active?10:6,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.shadowBlur=0;ctx.fillStyle=active?'#ffca55':'#bbe7ed';ctx.font='10px ui-monospace,monospace';ctx.fillText(c.decimal+' · q'+c.q,px+(Number(c.q)%2?-47:47),py-10);}
    ctx.textAlign='left';ctx.fillStyle='#9fb6c5';ctx.fillText('QRT20 · '+(rule==='elevator'?'+20 / STEP · SAME RESIDUE':'FAMILY REFERENCE · SELECT ELEVATOR RULE TO MOVE'),18,h-51);ctx.fillText('n = 20q + r · q '+min+' … '+max+' · '+(side==='back'?'MIRRORED COLUMNS':'r 0 … 19'),18,h-32);ctx.fillText('SEED LIST ≠ GENERATOR · DIGIT FLIP / HISTORICAL ADAPTER: SEPARATE',18,h-14);
  }
  function drawJoint(w,h){
    const active=rule==='sumlift',direction=active?(session().config.direction||'co'):'co',counter=direction==='counter',f=frame(),j=M.jointProjection(active?f.state.left:1836,active?f.state.right:1729,jointModulus,direction),cx=w/2,header=w<600?310:210,legendTop=w<600?250:160,cy=header+(h-header-150)/2,r=Math.max(25,Math.min(w*.30,(h-header-150)*.39)),mirror=side==='back'?-1:1,colors=['#ff796d','#76df9a','#ed72aa'],labels=['A','B','A+B'],values=[j.left,j.right,j.sum],scales=[.82,.94,1.06];
    const xy=(v,scale=1)=>{const t=-2*Math.PI*v/j.modulus-Math.PI/2;return{x:cx+mirror*r*scale*Math.cos(t),y:cy+r*scale*Math.sin(t)}};
    ctx.textAlign='center';ctx.font='11px ui-monospace,monospace';
    for(let k=0;k<j.modulus;k++){const q=xy(k,1.15);line([{x:cx,y:cy},xy(k,1.06)],'#315365',1,.35);ctx.fillStyle='#8daeba';ctx.fillText(String(k),q.x,q.y+4)}
    const history=active?session().frames.slice(Math.max(0,session().cursor-13),session().cursor+1):[null];
    for(let lane=0;lane<3;lane++){
      const circle=Array.from({length:97},(_,i)=>xy(j.modulus*i/96,scales[lane]));line(circle,colors[lane],1,.18);
      const trail=history.map(p=>{if(!p)return xy(j.residues[lane],scales[lane]);const q=M.jointProjection(p.state.left,p.state.right,j.modulus,direction);return xy(q.residues[lane],scales[lane])});line(trail,colors[lane],1.4,.32);
      const q=xy(j.residues[lane],scales[lane]);line([{x:cx,y:cy},q],colors[lane],1,.5);ctx.fillStyle=colors[lane];ctx.shadowColor=colors[lane];ctx.shadowBlur=20;ctx.beginPath();ctx.arc(q.x,q.y,7,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
      ctx.font='10px ui-monospace,monospace';ctx.fillText(labels[lane]+' '+values[lane]+' → '+j.residues[lane],cx,legendTop+lane*18);
    }
    ctx.fillStyle='#ffca55';ctx.font='16px ui-monospace,monospace';ctx.fillText('MOD '+j.modulus,cx,cy+5);ctx.font='10px ui-monospace,monospace';ctx.fillText(counter?'Σ = '+j.sum:active?'n '+f.generation:'REFERENCE',cx,cy+24);if(counter)ctx.fillText('n '+f.generation+' · COUNTER',cx,cy+41);
    ctx.fillStyle='#e1edf0';ctx.font='11px ui-monospace,monospace';ctx.fillText(j.left+' + '+j.right+' = '+j.sum,cx,h-103);ctx.fillText(j.residues[0]+' + '+j.residues[1]+' ≡ '+j.residues[2]+' (mod '+j.modulus+') · Δ '+j.delta,cx,h-82);
    ctx.fillStyle='#ffca55';ctx.font='10px ui-monospace,monospace';ctx.fillText(j.modulus===11?'+11 ≡ 0 · RESIDUE POINTS FIXED':(counter?'A −'+(j.modulus-11)+' / B +'+(j.modulus-11):'A/B −'+(j.modulus-11))+' · REST RETURN '+j.periods[0]+' STEPS',cx,h-61);
    ctx.fillStyle='#8daeba';ctx.font='9px ui-monospace,monospace';ctx.fillText(active?(counter?'COUNTER · A +11 / B −11 · SUM FIXED':'CO · A +11 / B +11 · GAP FIXED')+' · POSITIVE = CCW':'REFERENCE ONLY · ACTIVATE JOINT +11 TO RUN THESE NUMBERS',cx,h-41);ctx.fillText((counter?'A+B STEP 0 · Σ '+j.sum+' CONSTANT':'A+B STEP +22 · PERIOD '+j.periods[2])+' · RESIDUE RETURN ≠ INTEGER RETURN',cx,h-24);ctx.fillText('CHANNEL RADII / TRAILS = DISPLAY · CORE PRIME-FLOW IS A SEPARATE MODEL',cx,h-9);ctx.textAlign='left';
  }
  function foldOverlay(fold){
    const cx=468,cy=74,r=38,rad=Math.PI/180,squash=Math.cos(fold.angle*rad),lift=Math.sin(fold.angle*rad),colors=['#54d7ef','#65e7a4','#f34c6e'];
    let ticks='';for(let i=0;i<20;i++){const a=2*Math.PI*i/20,x1=cx+(r+2)*Math.cos(a),y1=cy+(r+2)*Math.sin(a)*.42,x2=cx+(r+(i===fold.crownTick?10:6))*Math.cos(a),y2=cy+(r+(i===fold.crownTick?10:6))*Math.sin(a)*.42;ticks+='<line x1="'+x1.toFixed(2)+'" y1="'+y1.toFixed(2)+'" x2="'+x2.toFixed(2)+'" y2="'+y2.toFixed(2)+'" stroke="'+(i===fold.crownTick?'#ffca55':'#507284')+'" stroke-width="'+(i===fold.crownTick?2:1)+'"/>';}
    let axes='';for(let i=0;i<3;i++){const a=(-90+i*120)*rad,ex=cx+r*Math.cos(a),ey=cy+r*Math.sin(a)*squash*.58-lift*(i-1)*7,px=cx+r*.58*Math.cos(a+.46),py=cy+r*.58*Math.sin(a+.46)*squash*.58-lift*(i-1)*4;axes+='<path d="M '+cx+' '+cy+' L '+ex.toFixed(2)+' '+ey.toFixed(2)+' L '+px.toFixed(2)+' '+py.toFixed(2)+' Z" fill="'+colors[i]+'" fill-opacity=".16" stroke="'+colors[i]+'" stroke-width="1.2"/><circle cx="'+ex.toFixed(2)+'" cy="'+ey.toFixed(2)+'" r="2.4" fill="'+colors[i]+'"/>';}
    const stops=[0,78,33,7,0],xs=[392,430,468,506,544],station=fold.stopIndex;
    const rail=stops.map((v,i)=>'<g><circle cx="'+xs[i]+'" cy="132" r="'+(i===station?5:3)+'" fill="'+(i===station?'#ffca55':'#294b5c')+'" stroke="#ffca55"/><text x="'+xs[i]+'" y="149" text-anchor="middle" fill="'+(i===station?'#ffca55':'#91aeba')+'" font-size="9" font-family="ui-monospace,monospace">'+v+'°</text></g>').join('');
    return '<g data-stack="fold-guide" data-fold-angle="'+fold.angle+'" data-fold-return="'+fold.foldReturn+'"><title>Deklarierte Drei-Achsen-Faltführung · keine Source-Deformation</title><ellipse cx="'+cx+'" cy="'+cy+'" rx="'+r+'" ry="16" fill="none" stroke="#d9bd7a" stroke-opacity=".7"/>'+ticks+axes+'<circle cx="'+cx+'" cy="'+cy+'" r="4" fill="#fff"/><text x="392" y="24" fill="#ffca55" font-size="10" font-family="ui-monospace,monospace">FOLD GUIDE · SAME CLOCK</text><text x="392" y="39" fill="#bcd0d9" font-size="9" font-family="ui-monospace,monospace">AXIS '+fold.axis+' · '+fold.angle+'° · CROWN '+String(fold.crownTick).padStart(2,'0')+'/19</text><line x1="392" y1="132" x2="544" y2="132" stroke="#315365"/>'+rail+'<text x="392" y="165" fill="#748e9b" font-size="8" font-family="ui-monospace,monospace">VIEW FOLD · NOT SOURCE / PHYSICS</text></g>';
  }
  function mixerDrawing(S,pose,past,rgb,fold){
    if(!rgb)return S.drawing(pose,{echo:true},past)+foldOverlay(fold);
    const colors={'P-A':'#ff0000','P-B':'#00ff00','P-C':'#0000ff'};
    return S.drawing(pose,{echo:false,cuts:false,stackLayers:{tips:false}},[])
      .replace(/<polygon[^>]*data-stack="(P-[ABC])"[^>]*\/>/g,(tag,id)=>tag.replace(/fill="[^"]*"/,'fill="'+colors[id]+'"').replace(/fill-opacity="[^"]*"/,'fill-opacity=".78"') .replace('/>',' style="mix-blend-mode:screen"/>'))
      .replace('DREI PENTAGONE · EIN PHASENWERT','RGB · SAME PHASE · DISPLAY LIGHT')
      .replace('<title>','<title>RGB screen display · ')+foldOverlay(fold);
  }
  function syncPQ(){
    if(view!=='pq')return;const v=$('numberPQViewer'),s=session(),seconds=rule==='pq'?frame().state.clip_ms/1000:48*s.cursor/M.limit(rule);v.style.transform='scaleX('+(side==='back'?-1:1)+')';
    if(pqFailed){$('numberPQStatus').textContent='P/Q-Modell konnte nicht geladen werden. Quellansicht unter der Motorhaube öffnen.';return}
    if(!pqStarted){pqStarted=true;v.setAttribute('src','../../../assets/3d/nexah_pq_conjugate_orbit_v7.glb')}
    if(pqReady){v.pause();v.currentTime=seconds;$('numberPQStatus').textContent='SOURCE CLIP · '+seconds.toFixed(1)+' / 48.0 s · '+(timer!==null?'PLAY cursor':'PAUSED')+' · DRAG CAMERA'}else $('numberPQStatus').textContent='P/Q-Modell lädt · gespeicherte Position '+seconds.toFixed(1)+' s';
  }
  $('numberPQViewer').addEventListener('load',()=>{pqFailed=false;pqReady=true;syncPQ()});
  $('numberPQViewer').addEventListener('error',()=>{pqReady=false;pqFailed=true;if(view==='pq')pause();$('numberPQStatus').textContent='P/Q-Modell konnte nicht geladen werden. Quellansicht unter der Motorhaube öffnen.'});
  function drawGroups(w,h){
    const active=rule==='groups',s=session(),n=active?s.cursor:0,state=active?frame().state:M.groupState(0),scale=Math.max(8,Math.min(w*.105,(h-290)/8)),cx=w/2,cy=155+(h-270)/2;
    const pos=p=>({x:cx+p.x*scale*(side==='back'?-1:1),y:cy-p.y*scale});
    for(let i=-4;i<=4;i++){line([pos({x:i,y:-4}),pos({x:i,y:4})],i?'#234859':'#7399a7',1,i?.45:.8);line([pos({x:-4,y:i}),pos({x:4,y:i})],i?'#234859':'#7399a7',1,i?.45:.8)}
    const seed=pos({x:3,y:1});ctx.strokeStyle='#fff5b0';ctx.lineWidth=1;ctx.beginPath();ctx.arc(seed.x,seed.y,16,0,Math.PI*2);ctx.stroke();ctx.fillStyle='#b9d0d9';ctx.font='10px ui-monospace,monospace';ctx.fillText('seed (3,1)',seed.x+20,seed.y-14);
    for(const [key,color,label]of [['rs','#54d7ef','R → S'],['sr','#ed72aa','S → R']]){const trail=Array.from({length:n+1},(_,i)=>M.groupState(i)[key]).map(pos);line(trail,color,2.5,.8);for(let i=0;i<trail.length;i++){const q=trail[i];ctx.fillStyle=color;ctx.shadowColor=color;ctx.shadowBlur=i===n?18:0;ctx.beginPath();ctx.arc(q.x,q.y,i===n?7:3,0,Math.PI*2);ctx.fill()}ctx.shadowBlur=0;const q=pos(state[key]);ctx.fillStyle=color;ctx.font='12px ui-monospace,monospace';ctx.fillText(label+' ('+state[key].x+','+state[key].y+')',q.x+12,q.y+(key==='rs'?-12:23))}
    const rp=pos(state.rPower),sp=pos(state.sPower);ctx.strokeStyle='#ffca55';ctx.lineWidth=2;ctx.beginPath();ctx.arc(rp.x,rp.y,11,0,Math.PI*2);ctx.stroke();ctx.strokeStyle='#a77dff';ctx.strokeRect(sp.x-12,sp.y-12,24,24);
    ctx.fillStyle='#b9d0d9';ctx.font='11px ui-monospace,monospace';ctx.fillText('R: (x,y) → (−y,x) · S: (x,y) → (x,−y)',18,h-88);ctx.fillStyle='#54d7ef';ctx.fillText('R → S: '+(state.rsWord||'I'),18,h-66);ctx.fillStyle='#ed72aa';ctx.fillText('S → R: '+(state.srWord||'I'),18,h-47);ctx.fillStyle='#ffca55';ctx.fillText('R⁴ = I '+(n>=4?'RETURN CHECKED':'· at step 4')+'   ·   S² = I '+(n>=2?'RETURN CHECKED':'· at step 2'),18,h-27);ctx.fillStyle='#8daeba';ctx.font='9px ui-monospace,monospace';ctx.fillText(active?'EXACT D4 ACTION · ARROWS = CHRONOLOGICAL ORDER · S IS NOT BENCH J':'REFERENCE SEED · SELECT R / S GROUP RULE TO RUN',18,h-10);
  }
  function drawWheels(w,h){
    const s=rule==='wheels'?frame().state:M.wheelState(0),cx=w/2,cy=175+(h-290)/2,r=Math.max(30,Math.min(w*.33,(h-310)*.42)),mirror=side==='back'?-1:1;
    const at=(rad,t)=>({x:cx+mirror*rad*Math.cos(t),y:cy-rad*Math.sin(t)}),circle=(rad,col,alpha)=>line(Array.from({length:145},(_,i)=>at(rad,i*Math.PI/72)),col,1,alpha);
    circle(r*1.18,'#315365',.8);for(let i=0;i<7;i++){const t=Math.PI/2+i*2*Math.PI/7,p=at(r*1.18,t);line([at(r*1.13,t),at(r*1.23,t)],'#9bb3c0',2,.8);ctx.fillStyle='#8daeba';ctx.font='9px ui-monospace,monospace';ctx.textAlign='center';ctx.fillText('7:'+i,p.x,p.y-7)}
    line([{x:cx,y:cy-r*1.28},{x:cx,y:cy+r*1.28}],'#ffca55',1,.65);
    const markers=[];for(const [key,teeth,rad,color,label]of [['tick1836',17,r,'#54d7ef','1836'],['tick1729',29,r*.69,'#ed72aa','1729']]){const theta=2*Math.PI*s[key]/180;circle(rad,color,.6);for(let i=0;i<teeth;i++){const t=theta+2*Math.PI*i/teeth;line([at(rad*.94,t),at(rad*1.04,t)],color,i?1:3,i?.5:1);if(i%2===0){const p=at(rad*1.09,t);ctx.fillStyle=color;ctx.font='8px ui-monospace,monospace';ctx.textAlign='center';ctx.fillText(String(i),p.x,p.y+3)}}const q=at(rad,theta);markers.push(q);line([{x:cx,y:cy},q],color,1.5,.65);ctx.fillStyle=color;ctx.shadowColor=color;ctx.shadowBlur=22;ctx.beginPath();ctx.arc(q.x,q.y,7,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle=color;ctx.font='11px ui-monospace,monospace';ctx.fillText(label,q.x,q.y-16)}
    line(markers,'#ffca55',1,s.alignment?.85:.25);ctx.fillStyle='#071823';ctx.beginPath();ctx.arc(cx,cy,25,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#ffca55';ctx.stroke();ctx.fillStyle='#ffca55';ctx.textAlign='center';ctx.font='16px ui-monospace,monospace';ctx.fillText('XIX',cx,cy+5);ctx.textAlign='left';ctx.font='10px ui-monospace,monospace';ctx.fillStyle='#54d7ef';ctx.fillText('1836 · 17 teeth · '+s.turnNumerator1836+'/180 turns',18,h-88);ctx.fillStyle='#ed72aa';ctx.fillText('1729 · 29 teeth · '+s.turnNumerator1729+'/180 turns',18,h-70);ctx.fillStyle='#ffca55';ctx.fillText('φ '+s.phaseDegrees+'° · '+(s.orientationReturn?'JOINT ORIENTATION RETURN':s.alignment?'RELATIVE ALIGNMENT':'COUPLED PHASE'),18,h-51);ctx.fillStyle='#8daeba';ctx.font='9px ui-monospace,monospace';ctx.fillText('29 · 31 · 33 · 45 · 78 — MARKER LABELS, NOT ANGLES',18,h-31);ctx.fillText(rule==='wheels'?'DECLARED PRESET · POSITIVE = CCW · XIX AND OUTER7 FIXED':'REFERENCE · SELECT XIX WHEELS RULE TO RUN',18,h-13);
  }
  function draw(){$('numberWheelControls').hidden=rule!=='wheels'||view!=='wheels';$('numberPQ').hidden=view!=='pq';if(view==='pq'){canvas.hidden=true;$('numberMixer').hidden=true;$('numberMixerControls').hidden=true;syncPQ();return}$('numberMixerControls').hidden=!['mixer','rgb'].includes(view);for(const [id,pick]of [['mixerAll','all'],['mixerA','A'],['mixerB','B']])$(id).setAttribute('aria-pressed',String(aperture===pick));$('numberMixer').hidden=!['mixer','rgb'].includes(view);canvas.hidden=['mixer','rgb'].includes(view);const rect=canvas.getBoundingClientRect(),w=Math.max(1,rect.width),h=Math.max(1,rect.height),dpr=Math.min(window.devicePixelRatio||1,2);if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr)}ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);const s=session(),f=frame(),history=s.frames.slice(Math.max(0,s.cursor-23),s.cursor+1),first=history[0].generation,project=xyz=>P.project(xyz.map((x,i)=>x*.42*(side==='back'&&i===0?-1:1)),camera,w,h),projectRing=(r,y=0)=>Array.from({length:97},(_,i)=>project([r*Math.cos(i*Math.PI/48),y,r*Math.sin(i*Math.PI/48)]));
    // A deterministic star field is only presentation; it never feeds the recurrence.
    ctx.fillStyle='#80d5ef';for(let i=0;i<95;i++){ctx.globalAlpha=.08+(i%5)*.035;ctx.fillRect(((i*197+17)%997)/997*w,((i*367+71)%991)/991*h,1,1)}ctx.globalAlpha=1;
    if(['mixer','rgb'].includes(view)){const S=window.A0LayeredPentagonScene;if(!S){$('numberError').textContent='Mischerquelle fehlt.';return}const phase=rule==='mixer'?f.state.phase:360*s.cursor/M.limit(rule),fold=M.mixerFold(phase),pose=S.snapshot(phase,'counter'),past=rule==='mixer'?history.slice(-8,-1).map(fr=>S.snapshot(fr.state.phase,'counter')):[];$('numberMixer').innerHTML='<svg style="isolation:isolate;background:#000;transform:scaleX('+ (side==='back'?-1:1) +')" viewBox="'+({all:'0 0 780 470',A:'500 20 280 220',B:'500 230 280 220'}[aperture])+'" xmlns="http://www.w3.org/2000/svg">'+mixerDrawing(S,pose,past,view==='rgb',fold)+'</svg>';return}
    if(view==='wheels'){drawWheels(w,h);return}
    if(view==='groups'){drawGroups(w,h);return}
    if(view==='elevator'){drawElevator(w,h);return}
    if(view==='joint'){drawJoint(w,h);return}
    if(view==='rails'){drawRails(w,h);return}
    if(view==='tower'){for(let i=0;i<12;i++)line(projectRing(2,i*.48-2.5),'#315365',1,.45);}
    else if(view==='grid'){const cols=f.size,rows=f.height;for(let x=0;x<cols;x++)line([project([(x/(cols-1)-.5)*4,0,-2]),project([(x/(cols-1)-.5)*4,0,2])],'#2b6577',1,.32);for(let y=0;y<rows;y++)line([project([-2,0,(y/(rows-1)-.5)*4]),project([2,0,(y/(rows-1)-.5)*4])],'#2b6577',1,.32);}
    else{for(const [i,r]of [.6,1.15,1.7,2.25,2.85].entries())line(projectRing(r),i%2?'#9e4ea4':'#257a8b',1,.3);line([project([-3,0,0]),project([3,0,0])],'#ffca55',1,.3);line([project([0,0,-3]),project([0,0,3])],'#54d7ef',1,.3);}
    const points=history.map(fr=>({frame:fr,point:project(M.point(fr,rule,view,first))}));
    line(points.map(x=>x.point),rule==='euler'?'#54d7ef':rule==='dyadic'?'#ed72aa':'#ffca55',1.8,.7);
    if(rule!=='euler'&&view==='rings'){const ring=history.map(fr=>{const a=2*Math.PI*Number(BigInt(fr.state.a)%7n)/7;return project([1.15*Math.cos(a),0,1.15*Math.sin(a)])});line(ring,'#ed72aa',1,.4);line([points.at(-1).point,ring.at(-1)],'#ed72aa',1.5,.8);const q=ring.at(-1);ctx.fillStyle='#ed72aa';ctx.shadowColor='#ed72aa';ctx.shadowBlur=20;ctx.beginPath();ctx.arc(q.x,q.y,5,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;}
    points.sort((a,b)=>a.point.z-b.point.z);for(const {frame:fr,point:q}of points){const active=fr.generation===s.cursor,age=s.cursor-fr.generation,col=active?'#fff5b0':rule==='euler'?'#54d7ef':fr.generation%2?'#ed72aa':'#ffca55';ctx.globalAlpha=active?1:.25+.6*(1-age/24);ctx.shadowBlur=active?28:12;ctx.shadowColor=col;ctx.fillStyle=col;ctx.beginPath();ctx.arc(q.x,q.y,active?8:3.6,0,Math.PI*2);ctx.fill();if(active){ctx.shadowBlur=0;ctx.strokeStyle=col;ctx.lineWidth=1;ctx.beginPath();ctx.arc(q.x,q.y,17,0,Math.PI*2);ctx.stroke();}}
    ctx.globalAlpha=1;ctx.shadowBlur=0;const origin=project([0,0,0]);ctx.strokeStyle='#bceaf0';ctx.lineWidth=1;ctx.beginPath();ctx.arc(origin.x,origin.y,3,0,Math.PI*2);ctx.stroke();ctx.fillStyle='#8daeba';ctx.font='10px ui-monospace,monospace';ctx.fillText('n '+first+' — '+s.cursor+'  /  '+(view==='tower'?'SEQUENCE HEIGHT':'VIEW ONLY'),20,h-20);
  }
  function animate(now){raf=null;if(document.hidden)return;if(orbit&&!reduced){camera.yaw+=Math.min(50,Math.max(0,now-last))*.00016;dirty=true}last=now;if(dirty){dirty=false;draw()}if(orbit&&!reduced)requestDraw()}
  function requestDraw(){dirty=true;if(raf===null&&!document.hidden)raf=requestAnimationFrame(animate)}
  canvas.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY,moved:false};canvas.setPointerCapture(e.pointerId)});canvas.addEventListener('pointermove',e=>{if(!drag)return;camera.yaw+=(e.clientX-drag.x)*.008;camera.pitch=Math.max(-1.25,Math.min(1.25,camera.pitch+(e.clientY-drag.y)*.008));drag={...drag,x:e.clientX,y:e.clientY,moved:drag.moved||Math.hypot(e.clientX-drag.startX,e.clientY-drag.startY)>7};requestDraw()});canvas.addEventListener('pointerup',e=>{if(drag&&!drag.moved&&view==='rails'){const r=canvas.getBoundingClientRect();if(Math.hypot(e.clientX-(r.left+r.width/2),e.clientY-(r.top+r.height/2))<34)command('touch')}drag=null});canvas.addEventListener('pointercancel',()=>{drag=null});
  canvas.addEventListener('keydown',e=>{if(e.key==='Enter'&&view==='rails'){e.preventDefault();command('touch');return}if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-','='].includes(e.key))return;e.preventDefault();if(e.key==='ArrowLeft')camera.yaw-=.12;if(e.key==='ArrowRight')camera.yaw+=.12;if(e.key==='ArrowUp')camera.pitch=Math.min(1.25,camera.pitch+.1);if(e.key==='ArrowDown')camera.pitch=Math.max(-1.25,camera.pitch-.1);if(['+','='].includes(e.key))camera.zoom=Math.min(2.5,camera.zoom*1.1);if(e.key==='-')camera.zoom=Math.max(.5,camera.zoom/1.1);requestDraw()});
  $('numberScrub').oninput=()=>{pause();touch=null;$('numberTouchStatus').textContent='';sessions[rule]=M.at(session(),Number($('numberScrub').value));readout()};
  for(const [id,pick]of [['mixerAll','all'],['mixerA','A'],['mixerB','B']])$(id).onclick=()=>command('aperture',pick);
  for(const id of ['wheelRatio','wheelDirection'])$(id).onchange=()=>command('wheel-config',{ratio:$('wheelRatio').value,direction:$('wheelDirection').value});
  $('jointModulus').onchange=()=>command('joint-modulus',Number($('jointModulus').value));
  $('jointDirection').onchange=()=>command('joint-direction',$('jointDirection').value);
  $('jointActivate').onclick=()=>command('rule','sumlift');
  $('numberVerify').onclick=()=>{pause();$('numberReceipt').textContent=JSON.stringify(M.replay(M.record(session(),view,{side,touch,aperture,jointModulus})))};
  $('numberExport').onclick=()=>{pause();const r=M.record(session(),view,{side,touch,aperture,jointModulus}),check=M.replay(r);if(check.status!=='PASS'){$('numberReceipt').textContent='HOLD · '+check.status;return}const url=URL.createObjectURL(new Blob([JSON.stringify(r,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='game-of-numbers-'+rule+'-n'+session().cursor+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),0);$('numberReceipt').textContent='Replay PASS · JSON exportiert.'};
  window.addEventListener('resize',requestDraw);document.addEventListener('visibilitychange',()=>{if(document.hidden){pause();if(raf!==null)cancelAnimationFrame(raf);raf=null}else requestDraw()});
  readout();publish(true);window.GameOfNumbersView={snapshot:()=>JSON.parse(JSON.stringify(session())),command,contract:()=>M.contract(rule,view,{jointModulus},session().config)};
})();
