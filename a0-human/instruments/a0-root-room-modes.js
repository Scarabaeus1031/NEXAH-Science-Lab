/* Shared signal time drives a declared reading overlay on the existing root rings. */
(() => {
  const rings=[
    {mode:'AM',register:'Φ',y:.18,rx:.22,ry:.035,color:'#e5b340'},
    {mode:'VM',register:'π',y:.31,rx:.18,ry:.052,color:'#29c7ef'},
    {mode:'PM',register:'√2',y:.43,rx:.13,ry:.068,color:'#ee6ca5'}
  ];
  function reading(ratio,phaseDegrees,time){
    const[a,b]=ratio.split(':').map(Number),delta=phaseDegrees*Math.PI/180;
    if(![a,b,phaseDegrees,time].every(Number.isFinite)||a<=0||b<=0)throw new TypeError('Finite ratio, phase and time required');
    const frequencies=[a,b,1],offsets=[0,delta,delta/2];
    return{rule:'Declared AM/VM/PM reading overlay on Φ/π/√2 rings; constants are not frequencies',time,ratio,phaseDegrees,frequencies,markers:rings.map((ring,index)=>({...ring,frequency:frequencies[index],phaseRadians:frequencies[index]*time+offsets[index],localShadow:Math.sin(frequencies[index]*time+offsets[index])}))};
  }
  function position(marker,width,height,c){
    const cx=width*.42,cy=height*marker.y,scale=.9+.12*Math.min(1.6,Math.hypot(...c)),rx=width*marker.rx*scale,ry=height*marker.ry,rotation=c[1]*.16;
    const x=rx*Math.sin(marker.phaseRadians),y=-ry*Math.cos(marker.phaseRadians);
    return[cx+x*Math.cos(rotation)-y*Math.sin(rotation),cy+x*Math.sin(rotation)+y*Math.cos(rotation)];
  }
  if(typeof module!=='undefined'&&module.exports){module.exports={rings,reading,position};return;}
  const canvas=document.getElementById('rootRoomCanvas'),root=document.getElementById('rootRoom'),view=window.A0ThreeLissajousPlanesView,bridge=window.A0RootRoomPhaseBridge;
  if(!canvas||!root||!view||!bridge)return;
  const stage=document.createElement('div');stage.className='bp-root-phase-stage';canvas.before(stage);stage.append(canvas);
  const controls=document.createElement('section');controls.className='bp-root-bridge bp-root-local-modes';controls.id='rootRoomLocalModes';controls.setAttribute('aria-label','Modus direkt an den Root-Ringen wählen');
  const title=document.createElement('h3');title.textContent='Hier wählen · unten mitlesen';
  const note=document.createElement('p');note.textContent='AM / VM / PM wählen dieselbe Ebene wie die Steuerung darüber und die drei Teller darunter. Die Ringmarker laufen mit derselben Signalzeit t: a·t, b·t+δ und t+δ/2. Ihr lokaler horizontaler Ausschlag ist der erste Koordinatenwert ihrer Ebene — derselbe wie im Schatten-Tracker. Φ / π / √2 bleiben Ansichtsregister, nicht Frequenzwerte.';
  const nav=document.createElement('nav');nav.setAttribute('aria-label','Root Room AM VM PM Return');
  const buttons=new Map(),markers=new Map();let active='AM',lastReading=null;
  const out=document.createElement('output');out.className='bp-root-live';out.setAttribute('aria-live','off');
  const target=document.createElement('button');target.type='button';target.textContent='Zugehörige Ebene unten zeigen ↓';target.addEventListener('click',()=>document.getElementById('threeLissajousPlanes').scrollIntoView({behavior:'smooth',block:'start'}));
  for(const mode of ['AM','VM','PM','RETURN']){const button=document.createElement('button');button.type='button';button.textContent=mode==='RETURN'?'Return · halten':mode;button.setAttribute('aria-pressed',String(mode===active));button.addEventListener('click',()=>bridge.select(mode));buttons.set(mode,button);nav.append(button);}
  const play=document.createElement('button');play.type='button';play.addEventListener('click',()=>{view.setPlaying(!view.state.playing);update(view.snapshot);});nav.append(play);
  controls.append(title,note,nav,out,target);root.querySelector('.root-room-grid').before(controls);
  for(const ring of rings){const marker=document.createElement('button');marker.type='button';marker.className='bp-root-ring-marker';marker.style.setProperty('--ring-color',ring.color);marker.textContent=ring.mode;marker.setAttribute('aria-label',`${ring.mode} wählen · Phasenmarker auf ${ring.register}-Register`);marker.addEventListener('click',()=>bridge.select(ring.mode));stage.append(marker);markers.set(ring.mode,marker);}
  const returnMarker=document.createElement('button');returnMarker.type='button';returnMarker.className='bp-root-gate-mode';returnMarker.textContent='Return';returnMarker.addEventListener('click',()=>bridge.select('RETURN'));stage.append(returnMarker);
  function update(snapshot){
    const state=view.state,c=window.A0FlameMandelbrotFormationView.state.c;
    lastReading=reading(state.ratio,state.phaseDegrees,snapshot.clock);
    for(const marker of lastReading.markers){const button=markers.get(marker.mode),point=position(marker,canvas.clientWidth,canvas.clientHeight,c);
      button.style.left=`${point[0]}px`;button.style.top=`${point[1]}px`;button.setAttribute('aria-pressed',String(active===marker.mode));}
    returnMarker.style.left=`${canvas.clientWidth*.42}px`;returnMarker.style.top=`${canvas.clientHeight*.72}px`;returnMarker.setAttribute('aria-pressed',String(active==='RETURN'));
    buttons.forEach((button,mode)=>button.setAttribute('aria-pressed',String(mode===active)));
    out.textContent=`${active==='ALL'?'Alle Ebenen':active} · t=${snapshot.clock.toFixed(3)} · Takte a:b:1 = ${lastReading.frequencies.join(':')} · AM ${state.ratio} / VM ${lastReading.frequencies[1]}:1 / PM 1:${lastReading.frequencies[0]} · ${state.playing?'gemeinsamer Zeitlauf':'gehalten'}`;
    play.textContent=state.playing?'Gemeinsamen Takt pausieren':'Gemeinsamen Takt starten';play.setAttribute('aria-pressed',String(state.playing));
  }
  window.addEventListener('a0-root-mode-change',event=>{active=event.detail.mode;update(view.snapshot);});
  window.addEventListener('a0-lissajous-frame',event=>update(event.detail));
  for(const id of ['cReal','cImag'])document.getElementById(id).addEventListener('input',()=>update(view.snapshot));
  new ResizeObserver(()=>update(view.snapshot)).observe(canvas);update(view.snapshot);
  window.A0RootRoomModes={get snapshot(){return lastReading?JSON.parse(JSON.stringify({...lastReading,selectedMode:active})):null;}};
})();
