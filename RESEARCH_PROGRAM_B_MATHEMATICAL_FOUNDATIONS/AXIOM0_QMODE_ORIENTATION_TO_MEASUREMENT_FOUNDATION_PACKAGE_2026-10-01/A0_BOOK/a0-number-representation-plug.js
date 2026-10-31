(function(root,factory){
  const node=typeof module==='object'&&module.exports;
  const api=factory(
    node?require('./a0-game-of-numbers-model.js'):root.A0GameOfNumbers,
    node?require('./a0-lantern-panel-v-control-lens.js'):root.A0LanternPanelVControlLens
  );
  if(node)module.exports=api;else root.A0NumberRepresentationPlug=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(numbers,lantern){
  'use strict';
  const HORIZON=16,PORTS=Object.freeze(['DEC','BIN','QRT20','TERRACE']),PROFILE='CERTIFIED_147_5';
  const clamp=value=>Math.max(0,Math.min(HORIZON,Math.trunc(Number(value)||0)));
  const normalizePort=value=>PORTS.includes(String(value).toUpperCase())?String(value).toUpperCase():'DEC';
  const integerAt=step=>'9'+'7'.repeat(clamp(step)+1)+'8';
  function decodeBinary(word){return BigInt('0b'+word).toString()}
  function representInteger(value,port='DEC'){
    const integer=BigInt(value).toString(),selected=normalizePort(port),codec=numbers.codec(integer);
    const representations=Object.freeze({
      DEC:Object.freeze({label:'DECIMAL',value:codec.decimal,decode:codec.decimal,kind:'LOSSLESS_INTEGER_CODEC'}),
      BIN:Object.freeze({label:'BINARY',value:codec.binary,decode:decodeBinary(codec.binary),kind:'LOSSLESS_INTEGER_CODEC'}),
      QRT20:Object.freeze({label:'QRT20',value:`q${codec.q} / r${codec.r}`,decode:String(20n*BigInt(codec.q)+BigInt(codec.r)),kind:'LOSSLESS_EUCLIDEAN_ADDRESS'})
    });
    const reading=representations[selected];
    if(!reading)return Object.freeze({integer,port:selected,reading:null,receipt:Object.freeze({status:'RESIDUAL',decoded:null,witness:'DECLARED_PROJECTION_WITNESS_REQUIRED'})});
    return Object.freeze({integer,port:selected,reading,codec,receipt:Object.freeze({status:reading.decode===integer?'EXACT_RETURN':'RESIDUAL',decoded:reading.decode,witness:'FULL_INTEGER_RETAINED'})});
  }
  function model(step=0,port='DEC'){
    const n=clamp(step),selected=normalizePort(port),integer=integerAt(n),codec=numbers.codec(integer),terrace=numbers.eightfoldTerrace(n,HORIZON),light=lantern.sample(PROFILE,n/HORIZON);
    const representations=Object.freeze({
      DEC:Object.freeze({label:'DECIMAL',value:codec.decimal,decode:codec.decimal,kind:'LOSSLESS_INTEGER_CODEC'}),
      BIN:Object.freeze({label:'BINARY',value:codec.binary,decode:decodeBinary(codec.binary),kind:'LOSSLESS_INTEGER_CODEC'}),
      QRT20:Object.freeze({label:'QRT20',value:`q${codec.q} / r${codec.r}`,decode:String(20n*BigInt(codec.q)+BigInt(codec.r)),kind:'LOSSLESS_EUCLIDEAN_ADDRESS'}),
      TERRACE:Object.freeze({label:'TERRACE',value:`${terrace.address} · k${terrace.step}`,decode:null,kind:'CURSOR_ADDRESS_PROJECTION'})
    });
    const reading=representations[selected],exact=reading.decode===integer;
    return Object.freeze({
      schema:'nexah.a0.number-representation-plug/1',
      identityReuse:Object.freeze(['NEXAH_A0_ORIENTATION_CONTROLLER_BENCH','MOD:NUMBER_VIEW_SUITE','A0_LANTERN_PANEL_V_CONTROL_LENS']),
      step:n,horizon:HORIZON,integer,port:selected,reading,representations,codec,terrace,lantern:light,
      receipt:Object.freeze(exact?{status:'EXACT_RETURN',decoded:integer,numericError:'0',witness:'FULL_INTEGER_RETAINED'}:{status:'RESIDUAL',decoded:null,numericError:'UNDEFINED_WITHOUT_SOURCE_WITNESS',witness:'SOURCE_INTEGER_REQUIRED'}),
      coupling:Object.freeze({kind:'TYPED_REPRESENTATION_BUS',heldInteger:true,sharedCursor:true,sharedClock:false,sourceMutation:false,lanternRole:'VIEW_OUTPUT_ONLY'}),
      authority:Object.freeze({newIdentity:false,newRelation:false,newOperator:false,newStudy:false,newFinding:false,claimPromotion:false,publication:false}),
      boundary:'DECIMAL, BINARY AND QRT20 ARE LOSSLESS READINGS OF ONE HELD INTEGER. TERRACE IS A CURSOR ADDRESS PROJECTION AND CANNOT RECONSTRUCT THE INTEGER WITHOUT THE RETAINED SOURCE WITNESS. LANTERN IS VIEW OUTPUT ONLY. NO SHARED SOURCE CLOCK OR NEW NUMBER LAW.'
    });
  }
  function verify(){
    let checks=0;const need=(value,label)=>{if(!value)throw new Error(label);checks++};
    for(const step of [0,8,16])for(const port of ['DEC','BIN','QRT20']){const r=model(step,port);need(r.receipt.status==='EXACT_RETURN'&&r.receipt.decoded===r.integer,`${port} n${step}`)}
    const residual=model(8,'TERRACE');
    need(residual.terrace.address==='b1 / s0'&&residual.receipt.status==='RESIDUAL','terrace residual');
    need(residual.receipt.witness==='SOURCE_INTEGER_REQUIRED','witness boundary');
    need(model(0).lantern.event==='OPEN'&&model(8).lantern.event==='STOP'&&model(16).lantern.event==='EXACT_RETURN','lantern output milestones');
    need(PORTS.length===4&&Object.values(residual.authority).every(value=>value===false),'governance');
    return Object.freeze({status:'PASS_TYPED_REPRESENTATION_BUS',checks,newCanonicalIds:[],relationChanges:[],exactPorts:['DEC','BIN','QRT20'],residualPorts:['TERRACE']});
  }
  const svg=(tag,attrs={})=>{const node=document.createElementNS('http://www.w3.org/2000/svg',tag);Object.entries(attrs).forEach(([key,value])=>node.setAttribute(key,String(value)));return node};
  const label=(stage,x,y,value,klass)=>{const node=svg('text',{x,y,class:klass});node.textContent=value;stage.append(node);return node};
  function render(stage,record){
    stage.replaceChildren();stage.setAttribute('viewBox','0 0 960 440');
    const ports=[['DEC',690,86],['BIN',820,166],['QRT20',820,282],['TERRACE',690,362]];
    label(stage,42,38,'HELD INTEGER · SOURCE RECORD','nrp-kicker');
    label(stage,42,98,record.integer,'nrp-integer');
    label(stage,42,127,`n${record.step} · Nₖ₊₁ = 10Nₖ − 2`,'nrp-meta');
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
    stage.append(svg('path',{d:'M552 278 L552 358',class:'nrp-output-cable'}));
    stage.append(svg('rect',{x:438,y:358,width:228,height:54,rx:10,class:'nrp-output'}));
    label(stage,552,380,`LANTERN · ${record.lantern.event}`,'nrp-output-title');
    label(stage,552,399,`${record.lantern.angle.toFixed(3)}° · VIEW OUTPUT ONLY`,'nrp-output-sub');
  }
  function mount(scope=document,win=scope.defaultView||{}){
    const root=scope.querySelector?.('#numberRepresentationPlug');if(!root)return null;
    const stage=root.querySelector('[data-nrp-stage]'),output=root.querySelector('[data-nrp-output]'),slider=root.querySelector('[data-nrp-slider]'),run=root.querySelector('[data-nrp-run]');let step=0,port='DEC',timer=null;
    function stop(){if(timer){win.clearInterval(timer);timer=null}run.setAttribute('aria-pressed','false');run.textContent='PLAY 0→16'}
    function paint(){const record=model(step,port);slider.value=String(step);root.querySelectorAll('[data-nrp-port]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.nrpPort===port)));render(stage,record);output.textContent=`${record.receipt.status} · n${step} · ${port} · ${record.reading.value} · ${record.receipt.witness}`;root.dataset.receipt=record.receipt.status.toLowerCase();return record}
    function set(value){step=clamp(value);return paint()}
    function select(value){port=normalizePort(value);return paint()}
    function play(){if(timer){stop();return}if(step>=HORIZON)step=0;paint();run.setAttribute('aria-pressed','true');run.textContent='PAUSE';if(win.matchMedia?.('(prefers-reduced-motion: reduce)').matches){set(HORIZON);stop();return}timer=win.setInterval(()=>{if(step>=HORIZON){stop();return}set(step+1)},420)}
    root.querySelectorAll('[data-nrp-port]').forEach(button=>button.addEventListener('click',()=>select(button.dataset.nrpPort)));
    root.querySelector('[data-nrp-prev]').addEventListener('click',()=>{stop();set(step-1)});root.querySelector('[data-nrp-next]').addEventListener('click',()=>{stop();set(step+1)});root.querySelector('[data-nrp-reset]').addEventListener('click',()=>{stop();step=0;port='DEC';paint()});slider.addEventListener('input',()=>{stop();set(slider.value)});run.addEventListener('click',play);paint();
    return Object.freeze({set,select,play,reset:()=>{step=0;port='DEC';return paint()},verify,get record(){return model(step,port)}});
  }
  if(typeof document!=='undefined')document.addEventListener('DOMContentLoaded',()=>mount(document,window));
  return Object.freeze({HORIZON,PORTS,integerAt,representInteger,model,verify,render,mount});
});
