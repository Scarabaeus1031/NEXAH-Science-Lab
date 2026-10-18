(function(root,factory){
  const api=factory(typeof module==='object'&&module.exports?require('./a0-layered-pentagon-scene.js'):root.A0LayeredPentagonScene);
  if(typeof module==='object'&&module.exports)module.exports=api;
  else {root.A0PhaseWiring=api;root.A0PhaseWiringView=api.mount(document,root);}
})(typeof globalThis!=='undefined'?globalThis:this,function(L){
  'use strict';
  const clone=x=>JSON.parse(JSON.stringify(x)),rad=x=>x*Math.PI/180;
  const sourceFiles=[
    {path:'/Users/tho2020/Desktop/zzz_leftovers/4D-Hyper-Resonator.html',sha256:'3a1b24f6a93285e07b9d852b92d99be0bfea4621d3c6bcaa5756777bb0679ea2',role:'source-derived renderer, not original runtime'},
    {path:'/Users/tho2020/Desktop/zzz_leftovers/Euler-41-Gitter.html',sha256:'986820e39526d574c6dd4942bf829ea95bc9f557c895cc0fabb58976bbdb54e0',role:'source-derived renderer, not original runtime'}
  ];
  function options(o={}){
    const p={frequency:3,energy:50,tint:0,colour:1,...o};
    if(!Number.isFinite(p.frequency)||p.frequency<1||p.frequency>10||!Number.isFinite(p.energy)||p.energy<10||p.energy>100||![p.tint,p.colour].every(n=>Number.isFinite(n)&&n>=0&&n<=1))throw Error('invalid view parameters');
    return p;
  }
  function frame(pose,o={}){
    L.validate(pose);o=options(o);
    const phase=pose.phase,t=rad(phase),radius=260*.68+Math.sin(t*2)*5;
    return{
      schema:'nexah.a0.phase-wiring-frame/1',phase,angleOffset:t,options:o,
      resonator:{
        ringRadius:radius,scales:[.15,.3,.48,.68,.88],
        pentagons:[.15,.3,.48,.68,.88].map(s=>Array.from({length:5},(_,i)=>[260*s*Math.cos(2*Math.PI*i/5),260*s*Math.sin(2*Math.PI*i/5)])),
        nodes:Array.from({length:41},(_,n)=>{const angle=2*Math.PI*(n%5)/5+.04*Math.floor(n/5),r=40+200*n/40;return{n,value:n*n+n+41,point:[r*Math.cos(angle),r*Math.sin(angle)],radius:4+Math.sin(t*3+n*n+n+41)*2};}),
        marker:[radius*Math.cos(t),radius*Math.sin(t)]
      },
      euler:{nodes:Array.from({length:41},(_,n)=>{const angle=2*Math.PI*(n%5)/5+.04*Math.floor(n/5)+t*.1,r=30+180*n/40;return{n,value:n*n+n+41,point:[r*Math.cos(angle),r*Math.sin(angle)],composite:n===40};})},
      pentagonPose:clone(pose),
      boundary:'Declared adapter: source angleOffset/t = phase*pi/180. One existing layered clock, no 4D dynamics, no Ihara operator, no electromagnetic model. Gold cursor is an added view marker; n=40 gold node remains composite.'
    };
  }
  function displayColour(tint,amount){
    options({tint,colour:amount});const blue=[78,168,222],green=[70,220,150],c=blue.map((n,i)=>n+(green[i]-n)*tint),gray=c.reduce((a,b)=>a+b,0)/3;
    return '#'+c.map(n=>Math.round(gray+(n-gray)*amount).toString(16).padStart(2,'0')).join('');
  }
  function svgFrame(f,kind,history=[]){
    if(!['resonator','euler'].includes(kind))throw Error('invalid view');
    const p=q=>[300+q[0],300+q[1]],points=ps=>ps.map(p).map(q=>q.join(',')).join(' '),c=displayColour(f.options.tint,f.options.colour),t=f.angleOffset;
    let s='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" role="img" data-phase="'+f.phase+'" aria-label="'+kind+' · gemeinsame Phase '+f.phase+' Grad"><title>'+kind+' · source-derived view adapter</title><rect width="600" height="600" rx="20" fill="#0a172c"/><circle cx="300" cy="300" r="260" fill="none" stroke="'+c+'" stroke-width="3"/>';
    for(let i=0;i<5;i++){const a=2*Math.PI*i/5;s+='<line x1="300" y1="300" x2="'+(300+260*Math.cos(a))+'" y2="'+(300+260*Math.sin(a))+'" stroke="#7890a0" opacity=".2"/>';}
    if(kind==='resonator'){
      for(const pent of f.resonator.pentagons)s+='<polygon points="'+points(pent)+'" fill="none" stroke="#c8ac49" stroke-width="1.5"/>';
      s+='<circle cx="300" cy="300" r="'+f.resonator.ringRadius+'" fill="none" stroke="#5bc0be" stroke-dasharray="6 6" stroke-width="2"/>';
      const markers=history.map(x=>x.marker);
      if(markers.length>1)s+='<polyline points="'+points(markers)+'" fill="none" stroke="#ffd166" stroke-dasharray="3 4" opacity=".65"/>';
      const angles=[Math.PI,Math.PI/2,0,3*Math.PI/2];
      angles.forEach((a,i)=>{const x=300+260*Math.cos(a),y=300+260*Math.sin(a);s+='<circle cx="'+x+'" cy="'+y+'" r="12" fill="#1d3557" stroke="#fff"/><text x="'+x+'" y="'+(y-19)+'" fill="#dae8f2" font-size="11" text-anchor="middle">Cube '+(23+i)+'</text>';});
    }else s+='<circle cx="300" cy="300" r="230" fill="none" stroke="#e63946" stroke-dasharray="4 4"/>';
    const spiral=[];
    for(let a=0;a<4*Math.PI;a+=.05){
      const r=kind==='resonator'?260*.07*a*f.options.energy/50:230*.05*a;
      if(r>260)break;const theta=a-t*(kind==='resonator'?f.options.frequency:1);spiral.push([r*Math.cos(theta),r*Math.sin(theta)]);
    }
    s+='<polyline points="'+points(spiral)+'" fill="none" stroke="#ff4d6d" stroke-width="2"/>';
    for(const n of f[kind].nodes){const [x,y]=p(n.point);s+='<circle cx="'+x+'" cy="'+y+'" r="'+(kind==='euler'?(n.composite?7:5):n.radius)+'" fill="'+(kind==='euler'&&n.composite?'#ffd166':c)+'" stroke="#c5d9e5" stroke-width=".7"><title>n='+n.n+' · q='+n.value+'</title></circle>';}
    if(kind==='resonator'){const [x,y]=p(f.resonator.marker);s+='<circle cx="'+x+'" cy="'+y+'" r="8" fill="#ffd166" stroke="#fff" stroke-width="2"><title>Zusätzlicher Phasencursor, keine Primzahlmarkierung</title></circle>';}
    return s+'<circle cx="300" cy="300" r="10" fill="#ff4d6d" stroke="#fff"/><text x="22" y="580" fill="#d5e6f1" font-family="system-ui" font-size="13">φ='+f.phase+'° · '+(kind==='resonator'?'5 Ebenen · goldener Phasencursor':'40 Primwerte + 1681 = 41²')+'</text></svg>';
  }
  const scope=s=>({pose:clone(s.pose),repeat:s.repeat,layers:clone(s.layers)});
  function markup(){
    return '<div class="phase-head"><div><small>INTEGRATIONSPAKET · EIN BESTEHENDER TAKT</small><h2>Phase → Resonator → Pentagon → Return</h2></div><a href="#root7ProjectionOverlay">Original-Schichtenansicht ↓</a></div><p>Die vorhandene Pentagon-Phase steuert jetzt zwei aus den Original-HTMLs abgeleitete Ansichten. Fünf feste Resonator-Pentagone und drei bewegliche Bench-Pentagone bleiben verschiedene Geometrien.</p><div class="phase-controls"><button data-wire="capture" type="button">Startanker lesen</button><button data-wire="step" type="button">Schritt +2°</button><button data-wire="play" type="button" aria-pressed="false">Abspielen</button><button data-wire="pause" type="button">Pause</button><button data-wire="return" type="button" disabled>Return zum Anker</button><button data-wire="export" type="button">Record herunterladen</button><label>Phase <input data-wire="phase" type="range" min="0" max="360" step="1" value="0"></label></div><div class="phase-controls"><label>Spiralfaktor <input data-wire="frequency" type="range" min="1" max="10" step=".5" value="3"></label><label>Spiralskala <input data-wire="energy" type="range" min="10" max="100" step="1" value="50"></label><label>Blau → Grün <input data-wire="tint" type="range" min="0" max="1" step=".01" value="0"></label><label>Grau → Farbe <input data-wire="colour" type="range" min="0" max="1" step=".01" value="1"></label></div><p data-wire="status" role="status" aria-live="polite"></p><div class="phase-view-grid"><article><h3>Resonator · 5 Radien + Spur</h3><div data-wire="resonator"></div></article><article><h3>Euler +41 · unveränderte Werte</h3><div data-wire="euler"></div></article></div><details><summary>Pentagon-Readback · dieselbe Phase</summary><svg data-wire="pentagon" viewBox="0 0 840 470" role="img" aria-label="Tatsächlich gelesene Pentagon-Pose"></svg></details><details><summary>Gemeinsamer Record / Return-Witness</summary><pre data-wire="record"></pre></details><p class="phase-boundary">Mapping: Originalwinkel t bzw. angleOffset = φ·π/180. Phase 360° ist ein Endpunkt, kein automatischer Return. Goldcursor und Spur sind ergänzte Ansichtsmarkierungen. Blau/Grün/Grau verändert nur Displayfarben. Der als „Ihara“ beschriftete Kreis bleibt ein Radiuspuls; keine Zeta-, E/B-, α- oder 41.616-Pfade-Berechnung. Return prüft Schichtenpose/-Controls, lokale Viewparameter und eigene Spur — nicht andere Quellzustände oder die Overlay-Gesamthistorie.</p>';
  }
  function mount(doc,win){
    const host=doc.getElementById('phaseWiring'),source=win.A0LayeredSceneView;
    if(!host||!source||!source.subscribe||host.dataset.mounted)return null;host.dataset.mounted='true';host.innerHTML=markup();
    const el=k=>host.querySelector('[data-wire="'+k+'"]');
    let o=options(),history=[],dropped=0,anchor=null,witness=null,last=null,seq=0,audit=[],holding=false,reason='';
    function log(action,status){audit.push({seq:++seq,action,status,phase:last?.phase??null});audit=audit.slice(-128);}
    function payload(){return{schema:'nexah.a0.phase-wiring-run/1',status:holding?'HOLD':'LOCAL_PHASE_READBACK',seq,sourceScope:scope(source.exportState()),viewOptions:clone(o),current:last?clone(last):null,history:clone(history),dropped,anchor:anchor?clone(anchor):null,returnWitness:witness?clone(witness):null,audit:clone(audit),sources:clone(sourceFiles),limits:{trail:64,audit:128},evidence:{endToEndBrowserAcceptance:false,nativeFaceBinding:false,iharaCoupling:false,gridBooking:false,originalRuntimeCoupling:false}};}
    function status(playing=false){
      el('status').setAttribute('aria-live',playing?'off':'polite');
      el('status').textContent=(holding?'HOLD · '+reason:playing?'LÄUFT · vorhandener Schichten-Takt':witness?'RETURN · '+(witness.pass?'PASS · deklarierter Startanker wiederhergestellt':'FAIL'): 'PAUSIERT · synchroner Phasen-Readback')+' · φ='+(last?.phase??0)+'° · Spur '+history.length+'/64 · verworfen '+dropped;
      el('play').setAttribute('aria-pressed',String(playing));el('play').textContent=playing?'Pause':'Abspielen';
      el('return').disabled=!anchor;el('record').textContent=JSON.stringify(payload(),null,2);
    }
    function accept(state){
      if(holding)return;
      try{
        if(last&&JSON.stringify(last.pentagonPose)!==JSON.stringify(state.pose))witness=null;
        const next=frame(state.pose,o);last=next;const marker={phase:next.phase,marker:next.resonator.marker};
        if(!history.length||JSON.stringify(history.at(-1))!==JSON.stringify(marker)){history.push(clone(marker));if(history.length>64){history.shift();dropped++;}}
        el('phase').value=String(next.phase);
        el('resonator').innerHTML=svgFrame(next,'resonator',history);el('euler').innerHTML=svgFrame(next,'euler');
        el('pentagon').innerHTML=L.drawing(state.pose,{scheme:'redblue',amount:o.colour,stackLayers:source.exportState().layers}).replaceAll('stack-','wire-stack-');
        el('pentagon').setAttribute('data-phase',String(next.phase));status(state.playing);
      }catch(e){holding=true;reason=e.message;source.pause();status(false);}
    }
    source.subscribe(accept);
    function send(action,value){
      try{
        if(holding&&action!=='read'&&action!=='pause')throw Error('HOLD: erst Readback erneut lesen');
        if(action==='read'){holding=false;reason='';source.pause();accept({pose:source.exportState().pose,playing:false});}
        else if(action==='pause')source.pause();
        else if(action==='capture'){
          source.pause();anchor={source:scope(source.exportState()),options:clone(o),history:clone(history),dropped};witness=null;
        }else if(action==='return'){
          if(!anchor)throw Error('kein Startanker');source.pause();o=clone(anchor.options);
          for(const k of ['frequency','energy','tint','colour'])el(k).value=String(o[k]);
          source.restorePose(anchor.source);
          history=clone(anchor.history);dropped=anchor.dropped;
          accept({pose:source.exportState().pose,playing:false});
          const readback={source:scope(source.exportState()),options:clone(o),history:clone(history),dropped};
          witness={pass:JSON.stringify(readback)===JSON.stringify(anchor),scope:'layer pose, repeat, layer controls, local options and local trail only',readback};
          if(!witness.pass)throw Error('Return-Readback weicht ab');
        }else if(action==='phase'||action==='step'){
          const expected=action==='step'?Math.min(360,source.exportState().pose.phase+2):Number(value);
          witness=null;source.setPhase(expected);
          if(source.exportState().pose.phase!==expected||last.phase!==expected)throw Error('Phasen-Readback weicht ab');
        }else if(action==='play'){
          witness=null;doc.getElementById('layerScenePlay').click();
        }else throw Error('unbekannter Befehl');
        log(action,'ACK');status(source.exportState().playing);return payload();
      }catch(e){holding=true;reason=e.message;source.pause();log(action,'HOLD');status(false);return payload();}
    }
    for(const k of ['capture','step','play','pause','return'])el(k).addEventListener('click',()=>send(k));
    el('phase').addEventListener('input',()=>send('phase',el('phase').value));
    for(const k of ['frequency','energy','tint','colour'])el(k).addEventListener('input',()=>{source.pause();try{o=options({...o,[k]:Number(el(k).value)});witness=null;accept({pose:source.exportState().pose,playing:false});log('view:'+k,'ACK');status(false);}catch(e){holding=true;reason=e.message;status(false);}});
    // Recovery and re-read require no unconfirmed mutation.
    const readButton=doc.createElement('button');readButton.type='button';readButton.textContent='Readback erneut lesen';readButton.addEventListener('click',()=>send('read'));el('pause').after(readButton);
    el('export').addEventListener('click',()=>{source.pause();const url=win.URL.createObjectURL(new win.Blob([JSON.stringify(payload(),null,2)],{type:'application/json'})),a=doc.createElement('a');a.href=url;a.download='a0-phase-wiring-run.json';a.click();win.URL.revokeObjectURL(url);});
    doc.addEventListener('visibilitychange',()=>{if(doc.hidden)send('pause');});
    return{send,snapshot:payload};
  }
  return{frame,options,displayColour,svgFrame,scope,markup,mount};
});
