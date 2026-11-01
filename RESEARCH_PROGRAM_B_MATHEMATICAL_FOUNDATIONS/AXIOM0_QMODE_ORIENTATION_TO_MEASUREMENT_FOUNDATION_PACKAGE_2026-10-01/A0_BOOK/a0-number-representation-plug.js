(function(root,factory){
  const node=typeof module==='object'&&module.exports;
  const api=factory(
    node?require('./a0-game-of-numbers-model.js'):root.A0GameOfNumbers,
    node?require('./a0-lantern-panel-v-control-lens.js'):root.A0LanternPanelVControlLens
  );
  if(node)module.exports=api;else root.A0NumberRepresentationPlug=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(numbers,lantern){
  'use strict';
  const HORIZON=16,PORTS=Object.freeze(['DEC','BIN','QRT20','QRT60','TERRACE']),MODES=Object.freeze(['SEVENWORD','CARRIER_1031']),PROFILE='CERTIFIED_147_5';
  const clamp=value=>Math.max(0,Math.min(HORIZON,Math.trunc(Number(value)||0)));
  const normalizePort=value=>PORTS.includes(String(value).toUpperCase())?String(value).toUpperCase():'DEC';
  const normalizeMode=value=>MODES.includes(String(value).toUpperCase())?String(value).toUpperCase():'SEVENWORD';
  const integerAt=step=>'9'+'7'.repeat(clamp(step)+1)+'8';
  function decodeBinary(word){return BigInt('0b'+word).toString()}
  function representInteger(value,port='DEC'){
    const integer=BigInt(value).toString(),selected=normalizePort(port),codec=numbers.codec(integer);
    const representations=Object.freeze({
      DEC:Object.freeze({label:'DECIMAL',value:codec.decimal,decode:codec.decimal,kind:'LOSSLESS_INTEGER_CODEC'}),
      BIN:Object.freeze({label:'BINARY',value:codec.binary,decode:decodeBinary(codec.binary),kind:'LOSSLESS_INTEGER_CODEC'}),
      QRT20:Object.freeze({label:'QRT20',value:`q${codec.q} / r${codec.r}`,decode:String(20n*BigInt(codec.q)+BigInt(codec.r)),kind:'LOSSLESS_EUCLIDEAN_ADDRESS'}),
      QRT60:Object.freeze({label:'QRT60',value:`q${BigInt(integer)/60n} / r${BigInt(integer)%60n}`,decode:String(60n*(BigInt(integer)/60n)+BigInt(integer)%60n),kind:'LOSSLESS_EUCLIDEAN_ADDRESS'})
    });
    const reading=representations[selected];
    if(!reading)return Object.freeze({integer,port:selected,reading:null,receipt:Object.freeze({status:'RESIDUAL',decoded:null,witness:'DECLARED_PROJECTION_WITNESS_REQUIRED'})});
    return Object.freeze({integer,port:selected,reading,codec,receipt:Object.freeze({status:reading.decode===integer?'EXACT_RETURN':'RESIDUAL',decoded:reading.decode,witness:'FULL_INTEGER_RETAINED'})});
  }
  function model(step=0,port='DEC',mode='SEVENWORD'){
    const n=clamp(step),selected=normalizePort(port),selectedMode=normalizeMode(mode),heldCarrier=selectedMode==='CARRIER_1031',integer=heldCarrier?'1031':integerAt(n),codec=numbers.codec(integer),terrace=numbers.eightfoldTerrace(n,HORIZON),light=lantern.sample(PROFILE,n/HORIZON),grammar=heldCarrier?numbers.carrier1031Grammar():null;
    const representations=Object.freeze({
      DEC:Object.freeze({label:'DECIMAL',value:codec.decimal,decode:codec.decimal,kind:'LOSSLESS_INTEGER_CODEC'}),
      BIN:Object.freeze({label:'BINARY',value:codec.binary,decode:decodeBinary(codec.binary),kind:'LOSSLESS_INTEGER_CODEC'}),
      QRT20:Object.freeze({label:'QRT20',value:`q${codec.q} / r${codec.r}`,decode:String(20n*BigInt(codec.q)+BigInt(codec.r)),kind:'LOSSLESS_EUCLIDEAN_ADDRESS'}),
      QRT60:Object.freeze({label:'QRT60',value:`q${BigInt(integer)/60n} / r${BigInt(integer)%60n}`,decode:String(60n*(BigInt(integer)/60n)+BigInt(integer)%60n),kind:'LOSSLESS_EUCLIDEAN_ADDRESS'}),
      TERRACE:Object.freeze({label:'TERRACE',value:`${terrace.address} · k${terrace.step}`,decode:null,kind:'CURSOR_ADDRESS_PROJECTION'})
    });
    const reading=representations[selected],exact=reading.decode===integer;
    return Object.freeze({
      schema:'nexah.a0.number-representation-plug/2',
      identityReuse:Object.freeze(['NEXAH_A0_ORIENTATION_CONTROLLER_BENCH','MOD:NUMBER_VIEW_SUITE','A0_LANTERN_PANEL_V_CONTROL_LENS']),
      step:n,horizon:HORIZON,mode:selectedMode,heldCarrier,integer,port:selected,reading,representations,codec,terrace,lantern:light,carrierGrammar:grammar,
      receipt:Object.freeze(exact?{status:'EXACT_RETURN',decoded:integer,numericError:'0',witness:'FULL_INTEGER_RETAINED'}:{status:'RESIDUAL',decoded:null,numericError:'UNDEFINED_WITHOUT_SOURCE_WITNESS',witness:'SOURCE_INTEGER_REQUIRED'}),
      coupling:Object.freeze({kind:'TYPED_REPRESENTATION_BUS',heldInteger:true,sharedCursor:true,sharedClock:false,sourceMutation:false,lanternRole:'VIEW_OUTPUT_ONLY'}),
      authority:Object.freeze({newIdentity:false,newRelation:false,newOperator:false,newStudy:false,newFinding:false,claimPromotion:false,publication:false}),
      boundary:'DECIMAL, BINARY, QRT20 AND QRT60 ARE LOSSLESS READINGS OF ONE HELD INTEGER. TERRACE IS A CURSOR ADDRESS PROJECTION AND CANNOT RECONSTRUCT THE INTEGER WITHOUT THE RETAINED SOURCE WITNESS. 1031 IS A HELD TEST CARRIER, NOT A NEW SEQUENCE STEP; 17.3 IS VIEW ONLY. LANTERN IS VIEW OUTPUT ONLY. NO SHARED SOURCE CLOCK OR NEW NUMBER LAW.'
    });
  }
  function verify(){
    let checks=0;const need=(value,label)=>{if(!value)throw new Error(label);checks++};
    for(const step of [0,8,16])for(const port of ['DEC','BIN','QRT20','QRT60']){const r=model(step,port);need(r.receipt.status==='EXACT_RETURN'&&r.receipt.decoded===r.integer,`${port} n${step}`)}
    const carrier20=model(0,'QRT20','CARRIER_1031'),carrier60=model(0,'QRT60','CARRIER_1031');
    need(carrier20.integer==='1031'&&carrier20.reading.value==='q51 / r11'&&carrier20.carrierGrammar.readings.prime.label==='p173','1031 QRT20 carrier');
    need(carrier60.reading.value==='q17 / r11'&&carrier60.receipt.status==='EXACT_RETURN','1031 QRT60 carrier');
    need(carrier20.carrierGrammar.readings.digit_cut.display==='17.3'&&carrier20.carrierGrammar.readings.digit_cut.classification==='VIEW ONLY','17.3 view boundary');
    need(carrier20.carrierGrammar.controls.adjacent_integers.every(item=>item.prime===false),'adjacent integer control');
    need(carrier20.carrierGrammar.controls.adjacent_primes.join(',')==='1021,1033','adjacent prime control');
    need(carrier20.carrierGrammar.controls.same_r11_mod20.every(item=>item.address.endsWith('/ r11'))&&new Set(carrier20.carrierGrammar.controls.same_r11_mod20.map(item=>item.prime)).size===2,'same residue mixed-prime control');
    const residual=model(8,'TERRACE');
    need(residual.terrace.address==='b1 / s0'&&residual.receipt.status==='RESIDUAL','terrace residual');
    need(residual.receipt.witness==='SOURCE_INTEGER_REQUIRED','witness boundary');
    need(model(0).lantern.event==='OPEN'&&model(8).lantern.event==='STOP'&&model(16).lantern.event==='EXACT_RETURN','lantern output milestones');
    need(PORTS.length===5&&MODES.length===2&&Object.values(residual.authority).every(value=>value===false),'governance');
    return Object.freeze({status:'PASS_TYPED_REPRESENTATION_BUS',checks,newCanonicalIds:[],relationChanges:[],modes:MODES,exactPorts:['DEC','BIN','QRT20','QRT60'],residualPorts:['TERRACE']});
  }
  const svg=(tag,attrs={})=>{const node=document.createElementNS('http://www.w3.org/2000/svg',tag);Object.entries(attrs).forEach(([key,value])=>node.setAttribute(key,String(value)));return node};
  const label=(stage,x,y,value,klass)=>{const node=svg('text',{x,y,class:klass});node.textContent=value;stage.append(node);return node};
  function render(stage,record){
    stage.replaceChildren();stage.setAttribute('viewBox','0 0 960 440');
    const ports=[['DEC',690,62],['BIN',820,132],['QRT20',840,214],['QRT60',820,296],['TERRACE',690,366]];
    label(stage,42,38,record.heldCarrier?'HELD TEST CARRIER · 1031':'HELD INTEGER · SEVENWORD SOURCE','nrp-kicker');
    label(stage,42,98,record.integer,'nrp-integer');
    label(stage,42,127,record.heldCarrier?'p173 · exact carrier · sequence clock held':`n${record.step} · Nₖ₊₁ = 10Nₖ − 2`,'nrp-meta');
    stage.append(svg('path',{d:'M286 214 C390 214 430 214 506 214',class:'nrp-source-cable'}));
    stage.append(svg('circle',{cx:552,cy:214,r:62,class:'nrp-socket'}));
    label(stage,552,208,'PLUG','nrp-plug-title');label(stage,552,230,'TYPED BUS','nrp-plug-sub');
    ports.forEach(([id,x,y])=>{
      const active=id===record.port;
      stage.append(svg('path',{d:`M610 214 C650 214 ${x-62} ${y} ${x-28} ${y}`,class:`nrp-port-cable${active?' is-active':''}`}));
      stage.append(svg('circle',{cx:x,cy:y,r:28,class:`nrp-port${active?' is-active':''}${id==='TERRACE'?' is-residual':''}`}));
      label(stage,x,y+4,id,'nrp-port-label');
    });
    label(stage,42,190,record.reading.label,'nrp-kicker');
    label(stage,42,228,record.reading.value,'nrp-reading');
    label(stage,42,274,record.receipt.status,`nrp-status ${record.receipt.status==='EXACT_RETURN'?'is-exact':'is-residual'}`);
    label(stage,42,300,record.receipt.status==='EXACT_RETURN'?'decode = source · numeric error 0':'cursor address only · source witness required','nrp-meta');
    if(record.carrierGrammar){label(stage,42,334,'1031 = 20×51+11 = 60×17+11','nrp-carrier');label(stage,42,354,'prime index 173 = q8/r13 · 17.3 VIEW ONLY','nrp-meta')}
    stage.append(svg('path',{d:'M552 278 L552 358',class:'nrp-output-cable'}));
    stage.append(svg('rect',{x:438,y:358,width:228,height:54,rx:10,class:'nrp-output'}));
    label(stage,552,380,`LANTERN · ${record.lantern.event}`,'nrp-output-title');
    label(stage,552,399,`${record.lantern.angle.toFixed(3)}° · VIEW OUTPUT ONLY`,'nrp-output-sub');
  }
  function mount(scope=document,win=scope.defaultView||{}){
    const root=scope.querySelector?.('#numberRepresentationPlug');if(!root)return null;
    const stage=root.querySelector('[data-nrp-stage]'),output=root.querySelector('[data-nrp-output]'),slider=root.querySelector('[data-nrp-slider]'),run=root.querySelector('[data-nrp-run]');let step=0,port='DEC',mode='SEVENWORD',timer=null;
    function stop(){if(timer){win.clearInterval(timer);timer=null}run.setAttribute('aria-pressed','false');run.textContent='PLAY 0→16'}
    function paint(){const record=model(step,port,mode),controlWindow=root.querySelector('[data-nrp-control-window]');slider.value=String(step);slider.disabled=record.heldCarrier;run.disabled=record.heldCarrier;root.querySelectorAll('[data-nrp-step-control]').forEach(button=>button.disabled=record.heldCarrier);root.querySelectorAll('[data-nrp-port]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.nrpPort===port)));root.querySelectorAll('[data-nrp-mode]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.nrpMode===mode)));render(stage,record);output.textContent=`${record.receipt.status} · ${record.heldCarrier?'HELD 1031':`n${step}`} · ${port} · ${record.reading.value} · ${record.receipt.witness}`;root.dataset.receipt=record.receipt.status.toLowerCase();root.dataset.mode=mode.toLowerCase();if(controlWindow){controlWindow.dataset.active=String(record.heldCarrier);controlWindow.setAttribute('aria-current',String(record.heldCarrier))}return record}
    function set(value){step=clamp(value);return paint()}
    function select(value){port=normalizePort(value);return paint()}
    function selectMode(value){stop();mode=normalizeMode(value);if(mode==='CARRIER_1031')step=0;return paint()}
    function play(){if(timer){stop();return}if(step>=HORIZON)step=0;paint();run.setAttribute('aria-pressed','true');run.textContent='PAUSE';if(win.matchMedia?.('(prefers-reduced-motion: reduce)').matches){set(HORIZON);stop();return}timer=win.setInterval(()=>{if(step>=HORIZON){stop();return}set(step+1)},420)}
    root.querySelectorAll('[data-nrp-port]').forEach(button=>button.addEventListener('click',()=>select(button.dataset.nrpPort)));
    root.querySelectorAll('[data-nrp-mode]').forEach(button=>button.addEventListener('click',()=>selectMode(button.dataset.nrpMode)));
    root.querySelector('[data-nrp-prev]').addEventListener('click',()=>{stop();set(step-1)});root.querySelector('[data-nrp-next]').addEventListener('click',()=>{stop();set(step+1)});root.querySelector('[data-nrp-reset]').addEventListener('click',()=>{stop();step=0;port='DEC';mode='SEVENWORD';paint()});slider.addEventListener('input',()=>{stop();set(slider.value)});run.addEventListener('click',play);paint();
    return Object.freeze({set,select,selectMode,play,reset:()=>{step=0;port='DEC';mode='SEVENWORD';return paint()},verify,get record(){return model(step,port,mode)}});
  }
  if(typeof document!=='undefined')document.addEventListener('DOMContentLoaded',()=>mount(document,window));
  return Object.freeze({HORIZON,PORTS,MODES,integerAt,representInteger,model,verify,render,mount});
});
