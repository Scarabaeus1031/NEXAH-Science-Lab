(function(){
  'use strict';
  const api=window.A0LanternPanelVControlLens;
  const model=document.getElementById('panelModel');
  const select=document.getElementById('profileSelect');
  const status=document.getElementById('panelStatus');
  const ledger=document.getElementById('channelLedger');
  const log=document.getElementById('eventLog');
  const label=document.getElementById('shadowLabel');
  const group=document.getElementById('shadowFlaps');
  const cuts=document.getElementById('shadowCuts');
  const pockets=document.getElementById('shadowPockets');
  const oneButton=document.getElementById('microscopeOne');
  const allButton=document.getElementById('microscopeAll');
  const tipRegister=document.getElementById('tipRegister');
  const jointReadout=document.getElementById('jointReadout');
  const ns='http://www.w3.org/2000/svg';
  let progress=0,timer=null,history=[],scope='one',selectedJoint=0,selectedTip=0;

  for(let i=0;i<5;i++){
    const a=-90+i*72,b=a-24,c=a+24,r1=55,r2=168;
    const pt=(r,d)=>[300+r*Math.cos(d*Math.PI/180),270+r*Math.sin(d*Math.PI/180)];
    const p1=pt(r1,a),p2=pt(r2,b),p3=pt(r2,c);
    const path=document.createElementNS(ns,'path');
    path.setAttribute('d',`M${p1} L${p2} L${p3} Z`);
    path.setAttribute('class','flap');path.dataset.index=i;group.appendChild(path);

    const chord=document.createElementNS(ns,'line');
    chord.setAttribute('x1',p2[0]);chord.setAttribute('y1',p2[1]);
    chord.setAttribute('x2',p3[0]);chord.setAttribute('y2',p3[1]);
    chord.setAttribute('class','chord');cuts.appendChild(chord);

    const slit=document.createElementNS(ns,'line'),s0=pt(154,c),s1=pt(190,c);
    slit.setAttribute('x1',s0[0]);slit.setAttribute('y1',s0[1]);
    slit.setAttribute('x2',s1[0]);slit.setAttribute('y2',s1[1]);
    slit.setAttribute('class','slit');cuts.appendChild(slit);

    const pocket=document.createElementNS(ns,'g');
    const seamA=pt(174,c-2.8),seamB=pt(174,c+2.8),outer=pt(195,c),inner=pt(160,c);
    const gold=document.createElementNS(ns,'polygon'),pink=document.createElementNS(ns,'polygon');
    gold.setAttribute('points',`${seamA} ${seamB} ${outer}`);gold.setAttribute('class','pocket-gold');
    pink.setAttribute('points',`${seamA} ${inner} ${seamB}`);pink.setAttribute('class','pocket-pink');
    const markers=document.createElementNS(ns,'g');
    markers.setAttribute('class','joint-markers');
    const gap=document.createElementNS(ns,'line');
    gap.setAttribute('x1',seamA[0]);gap.setAttribute('y1',seamA[1]);gap.setAttribute('x2',seamB[0]);gap.setAttribute('y2',seamB[1]);gap.setAttribute('class','gap-mark');
    const point=(xy,kind,textValue)=>{const g=document.createElementNS(ns,'g'),dot=document.createElementNS(ns,'circle'),text=document.createElementNS(ns,'text');dot.setAttribute('cx',xy[0]);dot.setAttribute('cy',xy[1]);dot.setAttribute('r','5');dot.setAttribute('class',`joint-point ${kind}`);text.setAttribute('x',xy[0]+8);text.setAttribute('y',xy[1]-7);text.setAttribute('class',`joint-label ${kind}`);text.textContent=textValue;g.append(dot,text);return g;};
    markers.append(gap,point(seamA,'y','Y · GRIP'),point(seamB,'z','Z · DIVOT'),point(inner,'local-pin','PIN'));
    pocket.setAttribute('class','fold-pocket');pocket.dataset.index=i;pocket.setAttribute('tabindex','0');pocket.setAttribute('role','button');pocket.setAttribute('aria-label',`Gelenk θ${i+1} auswählen`);pocket.append(gold,pink,markers);pockets.appendChild(pocket);
    pocket.addEventListener('click',()=>selectJoint(i));
    pocket.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();selectJoint(i);}});
  }

  for(let i=0;i<11;i++){
    const button=document.createElement('button');
    button.type='button';button.textContent=String(i+1).padStart(2,'0');button.setAttribute('aria-label',`Beobachtete Spitze ${i+1} von 11`);
    button.onclick=()=>{selectedTip=i;updateMicroscope();};tipRegister.appendChild(button);
  }

  function selectJoint(index){selectedJoint=index;scope='one';updateMicroscope();}

  function updateMicroscope(){
    pockets.classList.toggle('microscope-one',scope==='one');
    pockets.classList.toggle('microscope-all',scope==='all');
    pockets.querySelectorAll('.fold-pocket').forEach((el,i)=>el.classList.toggle('is-selected',i===selectedJoint));
    tipRegister.querySelectorAll('button').forEach((el,i)=>{el.classList.toggle('is-selected',i===selectedTip);el.setAttribute('aria-pressed',i===selectedTip?'true':'false');});
    oneButton.setAttribute('aria-pressed',scope==='one'?'true':'false');allButton.setAttribute('aria-pressed',scope==='all'?'true':'false');
    jointReadout.textContent=scope==='one'?`θ${selectedJoint+1} · TIP ${String(selectedTip+1).padStart(2,'0')}/11 · Y↔Z · GRIP/DIVOT`:`θ1…θ5 · REPEATED Y↔Z · 11-TIP REGISTER`;
  }

  function addEvent(sample){
    if(history.at(-1)?.event===sample.event)return;
    history.push(sample);
    const li=document.createElement('li');
    li.textContent=`${sample.event} · ${sample.phase} · ${sample.angle.toFixed(6)}°`;
    log.prepend(li);
  }

  function render(){
    const sample=api.sample(select.value,progress);
    const ratio=sample.angle/sample.profile.degrees;
    const foldState=sample.event==='EXACT_RETURN'?'EXACT_RETURN':ratio<.05?'LEAF_CLOSED':ratio<.55?'SLIT_RELEASE':'POCKET_OPEN';
    status.textContent=`${sample.profile.authority} · ${sample.angle.toFixed(3)}° · ${sample.event}`;
    label.textContent=`${foldState} · ${sample.angle.toFixed(3)}°`;
    group.querySelectorAll('.flap').forEach((el,i)=>el.style.transform=`rotate(${(i%2?1:-1)*ratio*8}deg) scale(${1-.16*ratio})`);
    pockets.querySelectorAll('.fold-pocket').forEach((el,i)=>el.style.transform=`rotate(${(i%2?1:-1)*ratio*10}deg) scaleY(${1-.42*ratio})`);
    ledger.innerHTML=sample.channels.map(ch=>`<div class="channel"><b>${ch.id}</b><i style="--fill:${(ratio*100).toFixed(2)}%"></i><span>${ch.angle.toFixed(2)}°</span></div>`).join('');
    if(model.duration)model.currentTime=model.duration*progress;
    addEvent(sample);
  }

  function setProfile(){
    model.animationName=select.value;progress=0;history=[];
    log.innerHTML='<li>PROFILE SELECTED · comparison boundary active</li>';render();
  }

  select.addEventListener('change',setProfile);
  document.getElementById('stepPlan').onclick=()=>{progress=Math.min(1,progress+.1);render();};
  document.getElementById('resetPlan').onclick=()=>{clearInterval(timer);progress=0;render();};
  document.getElementById('playPlan').onclick=()=>{clearInterval(timer);progress=0;render();timer=setInterval(()=>{progress=Math.min(1,progress+.01);render();if(progress>=1)clearInterval(timer);},30);};
  oneButton.onclick=()=>{scope='one';updateMicroscope();};
  allButton.onclick=()=>{scope='all';updateMicroscope();};
  document.getElementById('exportPlan').onclick=()=>{const data=api.receipt(select.value,history),blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`a0-panel-v-${select.value.toLowerCase()}-receipt.json`;a.click();URL.revokeObjectURL(a.href);};
  model.addEventListener('load',render);updateMicroscope();render();
})();
