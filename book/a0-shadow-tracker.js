/* The existing shadow coordinates over signal time, not a new light model. */
(() => {
  const keys=['AM','VM','PM'],epsilon=1e-8;
  function readout(signals){
    if(!Array.isArray(signals)||signals.length!==3||!signals.every(Number.isFinite))throw new TypeError('Three finite signal values required');
    const max=Math.max(...signals.map(Math.abs));
    return{rule:'AM=s1, VM=s2, PM=s3; each shadow lies at (value,0)',values:[...signals],relativeMagnitudes:max>epsilon?signals.map(value=>Math.abs(value)/max):null,pairRatios:[
      {label:'AM/VM',value:Math.abs(signals[1])>epsilon?signals[0]/signals[1]:null},
      {label:'VM/PM',value:Math.abs(signals[2])>epsilon?signals[1]/signals[2]:null},
      {label:'PM/AM',value:Math.abs(signals[0])>epsilon?signals[2]/signals[0]:null}
    ],unit:'signal-coordinate units',zeroTolerance:epsilon};
  }
  function createHistory(windowSize=4*Math.PI){
    let samples=[],signature=null,latest=null;
    return{
      append(snapshot){
        const time=snapshot.distance?.elapsed;if(!Number.isFinite(time))return;
        const nextSignature=JSON.stringify(snapshot.distance.parameters),current=readout(snapshot.signals);
        if(nextSignature!==signature||(latest&&time<latest.time-1e-9)){samples=[];signature=nextSignature;}
        latest={time,...current};
        if(!samples.length||time-samples.at(-1).time>=.02-1e-9)samples.push({time,values:[...current.values]});
        samples=samples.filter(point=>point.time>=time-windowSize).slice(-1200);
      },
      get points(){return samples.map(point=>({time:point.time,values:[...point.values]}));},
      get snapshot(){return latest?JSON.parse(JSON.stringify({...latest,windowSize,sampleCount:samples.length})):null;}
    };
  }
  if(typeof module!=='undefined'&&module.exports){module.exports={readout,createHistory};return;}
  const meter=document.getElementById('lissajousDistanceMeter'),view=window.A0ThreeLissajousPlanesView;
  if(!meter||!view)return;
  const pair=document.createElement('div');pair.className='bp-meter-pair';meter.before(pair);
  const panel=document.createElement('section');panel.className='bp-root-bridge bp-shadow-tracker';panel.id='shadowDisplacementTracker';panel.setAttribute('aria-label','Schattenausschlag und Verhältnisse');
  const title=document.createElement('h3');title.textContent='Schatten-Tracker · Ausschlag & Verhältnis';
  const note=document.createElement('p');note.textContent='Die farbigen Achsenschatten über dieselbe Signalzeit: AM=s₁, VM=s₂, PM=s₃. Der Ausschlag hat ein Vorzeichen; gemessen wird relativ zum Nullpunkt der jeweiligen lokalen Achse.';
  const canvas=document.createElement('canvas');canvas.className='bp-shadow-chart';canvas.setAttribute('role','img');canvas.setAttribute('aria-label','Drei farbige Ausschlagskurven über die Signalzeit, Werte von minus eins bis plus eins');
  const values=document.createElement('output');values.className='bp-root-live';values.setAttribute('aria-live','off');
  const ratios=document.createElement('p'),pairRatios=document.createElement('p');ratios.className=pairRatios.className='bp-root-key';
  const key=document.createElement('p');key.className='bp-root-key';key.textContent='Gold = AM · Cyan = VM · Pink = PM. Betrag-Verhältnis auf den aktuell größten Betrag normiert. Quotienten mit Nenner nahe null bleiben „—“. Sichtfenster: bis 4π Signalzeit; Zählernull, Paar- oder Phasenwechsel beginnt eine neue Spur.';
  panel.append(title,note,canvas,values,ratios,pairRatios,key);pair.append(meter,panel);
  const history=createHistory(),ctx=canvas.getContext('2d'),colors=['#e5b340','#29c7ef','#ee6ca5'];
  function draw(){
    const latest=history.snapshot;if(!latest)return;
    const w=Math.max(240,canvas.clientWidth),h=270,dpr=Math.min(devicePixelRatio||1,2);
    if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
    const left=36,right=w-15,top=18,bottom=h-32,start=Math.max(0,latest.time-latest.windowSize),span=latest.windowSize;
    const x=time=>left+(time-start)/span*(right-left),y=value=>(top+bottom)/2-value*(bottom-top)/2;
    ctx.font='10px monospace';ctx.textAlign='right';
    for(const v of [-1,0,1]){ctx.strokeStyle=v===0?'#6c8490':'#284650';ctx.beginPath();ctx.moveTo(left,y(v));ctx.lineTo(right,y(v));ctx.stroke();ctx.fillStyle='#a9c3cf';ctx.fillText(String(v),left-8,y(v)+3);}
    const points=history.points;if(!points.length||points.at(-1).time!==latest.time)points.push({time:latest.time,values:latest.values});
    for(let k=0;k<3;k++){ctx.strokeStyle=colors[k];ctx.lineWidth=1.7;ctx.beginPath();points.forEach((point,index)=>{const px=x(point.time),py=y(point.values[k]);index?ctx.lineTo(px,py):ctx.moveTo(px,py);});ctx.stroke();ctx.fillStyle=colors[k];ctx.beginPath();ctx.arc(x(latest.time),y(latest.values[k]),3.5,0,2*Math.PI);ctx.fill();}
    ctx.fillStyle='#9ab5c2';ctx.textAlign='left';ctx.fillText(start.toFixed(2),left,h-12);ctx.textAlign='right';ctx.fillText(`${(start+span).toFixed(2)} · Signalzeit seit Null`,right,h-12);
  }
  function update(snapshot){history.append(snapshot);const current=history.snapshot;if(!current)return;values.textContent=keys.map((name,index)=>`${name}: ${current.values[index]>=0?'+':''}${current.values[index].toFixed(3)}`).join(' · ');ratios.textContent=current.relativeMagnitudes?`Beträge AM : VM : PM = ${current.relativeMagnitudes.map(value=>value.toFixed(3)).join(' : ')} (Maximum = 1)`:'Alle Ausschläge nahe null · Betrag-Verhältnis nicht bestimmt';pairRatios.textContent=current.pairRatios.map(item=>`${item.label}: ${item.value===null?'—':item.value.toFixed(3)}`).join(' · ');draw();}
  window.addEventListener('a0-lissajous-frame',event=>update(event.detail));new ResizeObserver(draw).observe(canvas);update(view.snapshot);
  window.A0ShadowTracker={get snapshot(){return history.snapshot;}};
})();
