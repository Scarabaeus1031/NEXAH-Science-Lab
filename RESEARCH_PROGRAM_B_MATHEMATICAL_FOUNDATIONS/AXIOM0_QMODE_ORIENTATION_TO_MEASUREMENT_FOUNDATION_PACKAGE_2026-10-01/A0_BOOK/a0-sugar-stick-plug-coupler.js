(function(root,factory){
  const node=typeof module==='object'&&module.exports;
  const api=factory(node?require('./a0-loki-tessarec-pipe.js'):root.A0LokiTessarecPipe,node?require('./a0-number-representation-plug.js'):root.A0NumberRepresentationPlug);
  if(node)module.exports=api;else root.A0SugarStickPlugCoupler=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(pipe,numberPlug){
  'use strict';
  const RETURN=56,PORTS=Object.freeze(['DEC','BIN','QRT20']),TOUR_STOPS=Object.freeze([
    Object.freeze({step:0,port:'DEC',label:'ORIENTIERUNG',target:'#workbenchSwitchboard',title:'1. Schaltungen sehen, ohne zu verschmelzen',copy:'Das Switchboard ist die Leseregel für die ganze Route: Verbindungen werden sichtbar, aber Quellen, Maschinen, Uhren und Autoritäten bleiben getrennt.'}),
    Object.freeze({step:0,port:'DEC',label:'QUELLE',target:'#lokiTessarecPipeTest',title:'2. Der 56er Source-State',copy:'Sieben Stationen und acht Orientierungen bilden 56 unterscheidbare Zustände. Station s und Orientierung o bleiben die Quelle.'}),
    Object.freeze({step:0,port:'DEC',label:'ZAHLEN-PLUG',target:'#numberRepresentationPlug',title:'3. Ein Integer, drei exakte Lesarten',copy:'Der Plug zeigt das Prinzip: DEC, BIN und QRT20 sind verschiedene Schreibweisen eines gehaltenen Integers, keine neuen Zahlen.'}),
    Object.freeze({step:0,port:'DEC',label:'SUGAR STICK',target:'#sugarStickPlugCoupler > header',title:'4. Die gehaltene Achse',copy:'Der Sugar Stick wählt Station s. Die aktive gelbe Leitung führt jetzt sichtbar in denselben Adressbus.'}),
    Object.freeze({step:4,port:'DEC',label:'4-PHASEN-FLIP',target:'#sugarStickPlugCoupler figure',title:'5. Hinge und Seitenkanal',copy:'o=h+4c zerlegt die Orientierung verlustfrei in vier Hinge-Phasen h und den binären Seitenkanal c.'}),
    Object.freeze({step:28,port:'BIN',label:'BIN',target:'#sugarStickPlugCoupler figure',title:'6. Dieselbe Adresse als Binärwort',copy:'a=s+7h+28c ist die gemeinsame Adresse 0…55. BIN verändert nur die Lesart; die Leitung und der Source-State bleiben gleich.'}),
    Object.freeze({step:32,port:'QRT20',label:'QRT20',target:'#sugarStickPlugCoupler figure',title:'7. QRT20 liest denselben Adresswert',copy:'QRT20 zerlegt a euklidisch in q und r. Der cyan markierte Port hängt am selben Bus wie DEC und BIN.'}),
    Object.freeze({step:56,port:'QRT20',label:'EXACT RETURN',target:'#sugarStickPlugCoupler .ssp-ledger',title:'8. Exakter Rückweg',copy:'Nach 56 Schritten kehren Pipe-State und Adresse gemeinsam zu t0 und a0 zurück. Die Darstellung schließt; die Instrumente bleiben getrennt.'})
  ]),mod=(n,m)=>((n%m)+m)%m,clamp=value=>Math.max(0,Math.min(RETURN,Math.trunc(Number(value)||0)));
  function splitOrientation(orientation){const o=mod(orientation,8),hinge=o%4,cube=Math.floor(o/4);return Object.freeze({orientation:o,hinge,cube,hingeBits:hinge.toString(2).padStart(2,'0'),offset:cube?-2:2,side:cube?'BACK':'FRONT'});}
  function addressOf(station,hinge,cube){return mod(station,7)+7*mod(hinge,4)+28*mod(cube,2)}
  function decodeAddress(address){const a=mod(address,56),cube=Math.floor(a/28),within=a%28,hinge=Math.floor(within/7),station=within%7;return Object.freeze({address:a,station,hinge,cube,orientation:hinge+4*cube});}
  function trace19(){return Object.freeze({origin:1,rails:Object.freeze([-2,0,2]),gapsPerRail:6,edges:18,samples:19,classification:'DISPLAY_TRACE_3_TIMES_6_EDGES_PLUS_ORIGIN'});}
  function model(step=0,port='DEC'){
    const cursor=clamp(step),cycleStep=cursor===RETURN?0:cursor,p=pipe.state(cycleStep),split=splitOrientation(p.orientation),address=addressOf(p.station,split.hinge,split.cube),decoded=decodeAddress(address),selected=PORTS.includes(String(port).toUpperCase())?String(port).toUpperCase():'DEC',representation=numberPlug.representInteger(address,selected),returned=cursor===RETURN;
    return Object.freeze({
      schema:'nexah.a0.sugar-stick-plug-coupler/1',cursor,cycleStep,pipe:p,split,address,decoded,port:selected,representation,trace:trace19(),
      return:Object.freeze({status:returned?'EXACT_RETURN':'IN_FLIGHT',pipeReturn:returned,addressReturn:returned,numericError:decoded.station===p.station&&decoded.orientation===p.orientation?0:null}),
      seam:Object.freeze({fourPhaseFlip:true,flipEvery:4,offsets:Object.freeze([2,-2]),moebiusStatus:'HOLD_EDGE_IDENTIFICATION_UNDECLARED'}),
      identityReuse:Object.freeze(['NEXAH_A0_ORIENTATION_CONTROLLER_BENCH','MOD:TESSAREC','MOD:NUMBER_VIEW_SUITE']),
      authority:Object.freeze({newIdentity:false,newRelation:false,newOperator:false,newStudy:false,newFinding:false,claimPromotion:false,publication:false}),
      boundary:'THE BIJECTION BINDS THE EXISTING 56-STATE PIPE ADDRESS TO THE EXISTING TYPED NUMBER-PORT GRAMMAR. THE SUGAR-STICK AND 19-SAMPLE WEAVE ARE VIEWS. THE FOUR-PHASE SIDE FLIP IS EXACT; A MOEBIUS EDGE IDENTIFICATION REMAINS UNDECLARED.'
    });
  }
  function verify(){let checks=0;const need=(v,m)=>{if(!v)throw new Error(m);checks++},records=Array.from({length:56},(_,step)=>model(step));
    need(new Set(records.map(r=>`${r.pipe.station}:${r.pipe.orientation}`)).size===56,'pipe states');
    need(new Set(records.map(r=>r.address)).size===56,'address bijection');
    need(records.every(r=>r.decoded.station===r.pipe.station&&r.decoded.orientation===r.pipe.orientation),'decode roundtrip');
    need(records.every(r=>r.split.orientation===r.split.hinge+4*r.split.cube),'orientation split');
    need(records.slice(0,4).every(r=>r.split.offset===2)&&records.slice(4,8).every(r=>r.split.offset===-2),'four phase flip');
    need(PORTS.every(port=>records.every(r=>numberPlug.representInteger(r.address,port).receipt.status==='EXACT_RETURN')),'number ports exact');
    need(model(56).return.status==='EXACT_RETURN'&&model(56).address===0,'full return');
    need(trace19().edges===3*6&&trace19().samples===19,'trace 19');
    need(TOUR_STOPS[0].step===0&&TOUR_STOPS.at(-1).step===RETURN&&TOUR_STOPS.every(stop=>PORTS.includes(stop.port)),'bounded demo tour');
    need(model(0).seam.moebiusStatus.startsWith('HOLD'),'moebius hold');
    need(Object.values(model(0).authority).every(v=>v===false),'governance');
    return Object.freeze({status:'PASS_EXACT_56_STATE_PLUG_COUPLER',checks,newCanonicalIds:[],relationChanges:[],operatorChanges:[]});
  }
  const svg=(tag,attrs={})=>{const n=document.createElementNS('http://www.w3.org/2000/svg',tag);Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,String(v)));return n},text=(stage,x,y,value,klass,anchor='start')=>{const n=svg('text',{x,y,class:klass,'text-anchor':anchor});n.textContent=value;stage.append(n);return n};
  function render(stage,r){stage.replaceChildren();stage.setAttribute('viewBox','0 0 1100 560');
    text(stage,42,34,'SOURCE · Z₇ × Z₈','ssp-kicker');text(stage,42,70,`S${r.pipe.station+1} · O${r.pipe.orientation}`,'ssp-big');text(stage,42,96,`t${r.cursor} / 56 · ${r.pipe.bits}`,'ssp-meta');
    for(let s=0;s<7;s++){const x=58+s*52;stage.append(svg('line',{x1:x,y1:150,x2:x,y2:330,class:'ssp-station-line'}));stage.append(svg('circle',{cx:x,cy:240,r:s===r.pipe.station?12:5,class:s===r.pipe.station?'ssp-station is-active':'ssp-station'}));text(stage,x,352,String(s+1),'ssp-tick','middle');}
    stage.append(svg('line',{x1:40,y1:240,x2:388,y2:240,class:'ssp-stick'}));text(stage,214,382,'SUGAR STICK · HELD AXIS 1…7','ssp-caption','middle');
    const ringX=500,ringY=240;[0,1,2,3].forEach(h=>{const a=-Math.PI/2+h*Math.PI/2,x=ringX+78*Math.cos(a),y=ringY+78*Math.sin(a);stage.append(svg('line',{x1:ringX,y1:ringY,x2:x,y2:y,class:'ssp-hinge-ray'}));stage.append(svg('circle',{cx:x,cy:y,r:h===r.split.hinge?12:7,class:h===r.split.hinge?'ssp-hinge is-active':'ssp-hinge'}));text(stage,x,y+4,String(h),'ssp-port-text','middle');});stage.append(svg('circle',{cx:ringX,cy:ringY,r:28,class:'ssp-core'}));text(stage,ringX,236,r.split.side,'ssp-core-title','middle');text(stage,ringX,253,`${r.split.offset>0?'+':''}${r.split.offset}`,'ssp-core-sub','middle');text(stage,ringX,382,`h${r.split.hinge} · c${r.split.cube} · o=h+4c`,'ssp-caption','middle');
    const activeStationX=58+r.pipe.station*52;stage.append(svg('path',{d:`M${activeStationX} 240 C410 240 420 240 472 240`,class:'ssp-source-bus'}));stage.append(svg('circle',{cx:430,cy:240,r:5,class:'ssp-bus-pulse'}));text(stage,430,218,'s → a','ssp-bus-label','middle');
    [['DEC',760,160],['BIN',760,240],['QRT20',760,320]].forEach(([id,x,y])=>{const active=id===r.port;stage.append(svg('path',{d:`M528 240 C650 240 650 ${y} 715 ${y}`,class:`ssp-cable${active?' is-active':''}`}));stage.append(svg('circle',{cx:x,cy:y,r:34,class:`ssp-port${active?' is-active':''}`}));text(stage,x,y+4,id,'ssp-port-text','middle');});
    text(stage,650,112,`SUGAR STICK → a${r.address} → ${r.port}`,'ssp-bus-title','middle');
    text(stage,835,146,'PIPE ADDRESS','ssp-kicker');text(stage,835,188,String(r.address),'ssp-address');text(stage,835,220,r.representation.reading.value,'ssp-reading');text(stage,835,250,r.representation.receipt.status,'ssp-exact');text(stage,835,278,`a = s + 7h + 28c`,'ssp-meta');
    const y0=454;[-2,0,2].forEach((rail,index)=>{const y=y0+index*34;for(let s=0;s<7;s++){const x=58+s*52;if(s<6)stage.append(svg('line',{x1:x,y1:y,x2:x+52,y2:y,class:'ssp-trace-edge'}));stage.append(svg('circle',{cx:x,cy:y,r:rail===r.split.offset||rail===0?4:2.5,class:rail===r.split.offset?'ssp-trace-node is-active':'ssp-trace-node'}));}text(stage,18,y+4,rail>0?`+${rail}`:String(rail),'ssp-tick');});text(stage,420,492,'3 × 6 EDGES + 1 ORIGIN = 19 · VIEW TRACE','ssp-caption');text(stage,760,486,'4-PHASE FLIP: EXACT','ssp-exact');text(stage,760,516,'MÖBIUS EDGE ID: HOLD','ssp-hold');
  }
  function mount(scope=document,win=scope.defaultView||{}){
    const root=scope.querySelector?.('#sugarStickPlugCoupler');if(!root)return null;
    const stage=root.querySelector('[data-ssp-stage]'),output=root.querySelector('[data-ssp-output]'),slider=root.querySelector('[data-ssp-slider]'),run=root.querySelector('[data-ssp-run]'),tour=root.querySelector('[data-ssp-tour]'),launchers=[tour,...scope.querySelectorAll('[data-ssp-tour-launch]')],guide=root.querySelector('[data-ssp-guide]'),guideCount=root.querySelector('[data-ssp-guide-count]'),guideTitle=root.querySelector('[data-ssp-guide-title]'),guideCopy=root.querySelector('[data-ssp-guide-copy]');
    let step=0,port='DEC',timer=null,tourIndex=-1,tourLabel='';
    let focusTarget=null;
    const clearFocus=()=>{focusTarget?.classList.remove('ssp-tour-focus');focusTarget=null};
    const closeGuide=()=>{clearFocus();root.classList.remove('is-guiding');if(guide)guide.hidden=true};
    const stop=(close=true)=>{if(timer){win.clearInterval(timer);timer=null}tourIndex=-1;tourLabel='';run.setAttribute('aria-pressed','false');run.textContent='PLAY 56';launchers.forEach(button=>{button.setAttribute('aria-pressed','false');button.textContent='FÜHRUNG STARTEN'});if(close)closeGuide()};
    const paint=()=>{const r=model(step,port);slider.value=String(step);root.querySelectorAll('[data-ssp-port]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.sspPort===port)));render(stage,r);output.textContent=`${tourLabel?`TOUR · ${tourLabel} · `:''}${r.return.status} · t${step} · S${r.pipe.station+1} · h${r.split.hinge} · c${r.split.cube} · ${r.split.offset>0?'+':''}${r.split.offset} · a${r.address} · ${port} ${r.representation.reading.value}`;return r};
    const set=(value,label='')=>{step=clamp(value);tourLabel=label;return paint()};
    const showTourStop=index=>{tourIndex=Math.max(0,Math.min(TOUR_STOPS.length-1,index));const stopRecord=TOUR_STOPS[tourIndex];port=stopRecord.port;clearFocus();focusTarget=scope.querySelector(stopRecord.target)||root;focusTarget.classList.add('ssp-tour-focus');root.classList.add('is-guiding');guide.hidden=false;guideCount.textContent=`FÜHRUNG · ${tourIndex+1}/${TOUR_STOPS.length} · ${stopRecord.label}`;guideTitle.textContent=stopRecord.title;guideCopy.textContent=stopRecord.copy;root.querySelector('[data-ssp-guide-prev]').disabled=tourIndex===0;root.querySelector('[data-ssp-guide-next]').textContent=tourIndex===TOUR_STOPS.length-1?'RETURN':'WEITER';focusTarget.scrollIntoView?.({behavior:win.matchMedia?.('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});return set(stopRecord.step,`${tourIndex+1}/${TOUR_STOPS.length} · ${stopRecord.label}`)};
    root.querySelector('[data-ssp-next]').addEventListener('click',()=>{stop();set(step+1)});
    root.querySelector('[data-ssp-four]').addEventListener('click',()=>{stop();set(step+4)});
    root.querySelector('[data-ssp-return]').addEventListener('click',()=>{stop();set(56)});
    root.querySelector('[data-ssp-reset]').addEventListener('click',()=>{stop();step=0;port='DEC';paint()});
    slider.addEventListener('input',()=>{stop();set(slider.value)});
    root.querySelectorAll('[data-ssp-port]').forEach(b=>b.addEventListener('click',()=>{stop();port=b.dataset.sspPort;paint()}));
    run.addEventListener('click',()=>{if(timer){stop();return}if(step>=56)step=0;tourLabel='';paint();run.setAttribute('aria-pressed','true');run.textContent='PAUSE';if(win.matchMedia?.('(prefers-reduced-motion: reduce)').matches){set(56);stop();return}timer=win.setInterval(()=>{if(step>=56){stop();return}set(step+1)},160)});
    const startGuide=()=>{if(tourIndex>=0){stop();return}stop(false);showTourStop(0);launchers.forEach(button=>{button.setAttribute('aria-pressed','true');button.textContent='FÜHRUNG BEENDEN'})};
    launchers.forEach(button=>button.addEventListener('click',startGuide));
    root.querySelector('[data-ssp-guide-prev]').addEventListener('click',()=>showTourStop(tourIndex-1));
    root.querySelector('[data-ssp-guide-next]').addEventListener('click',()=>{if(tourIndex>=TOUR_STOPS.length-1){showTourStop(0);return}showTourStop(tourIndex+1)});
    root.querySelector('[data-ssp-guide-close]').addEventListener('click',()=>stop());
    paint();return Object.freeze({set,paint,verify,showTourStop,get record(){return model(step,port)}});
  }
  if(typeof document!=='undefined')document.addEventListener('DOMContentLoaded',()=>mount(document,window));
  return Object.freeze({RETURN,PORTS,TOUR_STOPS,splitOrientation,addressOf,decodeAddress,trace19,model,verify,render,mount});
});
