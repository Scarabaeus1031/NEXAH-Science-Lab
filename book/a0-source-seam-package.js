(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.A0SourceSeamPackage=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const SOURCE='A0_TESSAREC_BLUE_BODY_LAB.html';
  const ALLOWED=['t','extension','foldDeg','mode','baseOn','number','layer'];
  const NUMBERS=[1111,3333,4444,7777];
  const finite=(value,min,max,label)=>{
    const number=Number(value);
    if(!Number.isFinite(number)||number<min||number>max)throw Error(label+' outside ['+min+','+max+']');
    return number;
  };
  const bool=value=>{
    if(value===true||value==='on')return true;
    if(value===false||value==='off')return false;
    throw Error('baseOn must be on/off');
  };
  function installLayerWitness(win,doc){
    if(win.A0JointLayerWitness)return win.A0JointLayerWitness;
    const frames={P0:'F10',P1:'F26',P2:'F42'},numberReadout=doc.getElementById('numberReadout'),numberChips=doc.getElementById('numberChips');let selected='HOLD';
    if(!numberReadout||!numberChips)return null;
    const label=doc.createElement('div'),chips=doc.createElement('div'),readout=doc.createElement('div');label.className='label';label.style.marginTop='18px';label.textContent='1111 layer witness · explicit source selection';chips.className='number-chips';chips.id='jointLayerChips';readout.className='number-readout';readout.id='jointLayerReadout';
    for(const value of ['HOLD','P0','P1','P2']){const button=doc.createElement('button');button.type='button';button.dataset.jointLayer=value;button.textContent=value==='HOLD'?'HOLD':value+' · '+frames[value];chips.append(button)}numberReadout.after(label,chips,readout);
    const activeNumber=()=>Number(numberChips.querySelector('[data-number].active')?.dataset.number||1111);
    function set(value){if(!['HOLD','P0','P1','P2'].includes(value))throw Error('unknown 1111 layer witness');if(value!=='HOLD'&&activeNumber()!==1111)throw Error('layer witness only declared for 1111');selected=value;chips.querySelectorAll('[data-joint-layer]').forEach(button=>button.classList.toggle('active',button.dataset.jointLayer===value));readout.textContent=value==='HOLD'?'HOLD · keine Schicht gewählt · Return-Witness unvollständig':`1111 · ${value} · ${frames[value]} · Witness = integer + layer`;return snapshot()}
    function snapshot(){return{schema:'nexah.a0.1111-layer-witness/1',selected,frame:frames[selected]||null,candidates:{...frames}}}
    chips.addEventListener('click',event=>{const button=event.target.closest('[data-joint-layer]');if(button)set(button.dataset.jointLayer)});numberChips.addEventListener('click',()=>{if(activeNumber()!==1111)set('HOLD')});
    const controller={snapshot,restore:value=>set(value?.selected||'HOLD'),set,clear:()=>set('HOLD')};win.A0JointLayerWitness=controller;set('HOLD');return controller;
  }
  function createView(doc,foldApi){
    const get=id=>{const node=doc.getElementById(id);if(!node)throw Error('missing source control '+id);return node};
    const input=(node,value)=>{node.value=String(value);node.dispatchEvent(new doc.defaultView.Event('input',{bubbles:true}))};
    const activeMode=()=>doc.querySelector('[data-fold-mode].active')?.dataset.foldMode||'square';
    const activeNumber=()=>Number(doc.querySelector('#numberChips [data-number].active')?.dataset.number||1111);
    const conDao=()=>doc.defaultView.A0FoldConDaoController||null,layerWitness=()=>doc.defaultView.A0JointLayerWitness||null;
    const readControls=()=>({
      t:Number(get('foldT').value),
      extension:Number(get('foldExtension').value),
      foldDeg:Number(get('foldAngle').value),
      mode:activeMode(),
      baseOn:get('baseToggle').classList.contains('active'),
      number:activeNumber()
    });
    const readState=()=>({...readControls(),layer:layerWitness()?.snapshot().selected||'HOLD',conDao:conDao()?.snapshot()||{schema:'nexah.a0.con-dao-source-state/1',cursor:0,displayCursor:null,running:false,stateId:null,tickCount:14,intervalMs:620}});
    function pause(){
      const foldPlay=get('foldPlay'),breath=doc.getElementById('conDaoPlay');
      if(foldPlay.textContent.startsWith('Pause'))foldPlay.click();
      if(conDao())conDao().stop();else if(breath?.classList.contains('active'))breath.click();
    }
    function restore(state){
      pause();
      const mode=state.mode==='triangle'?'triangle':'square';
      const modeButton=doc.querySelector('[data-fold-mode="'+mode+'"]');
      if(activeMode()!==mode)modeButton.click();
      const base=get('baseToggle');if(base.classList.contains('active')!==!!state.baseOn)base.click();
      input(get('foldT'),state.t);input(get('foldExtension'),state.extension);input(get('foldAngle'),state.foldDeg);
      const number=doc.querySelector('#numberChips [data-number="'+state.number+'"]');if(number)number.click();
      if(layerWitness())layerWitness().restore({selected:state.layer||'HOLD'});
      if(state.conDao&&conDao())conDao().restore(state.conDao);
    }
    function set(payload){
      if(!payload||typeof payload!=='object'||Array.isArray(payload)||!Object.keys(payload).length||Object.keys(payload).some(key=>!ALLOWED.includes(key)))throw Error('unknown or empty SET fields');
      const next={...readState()};next.conDao={...next.conDao,running:false};
      if('t'in payload)next.t=finite(payload.t,.2,.85,'t');
      if('extension'in payload)next.extension=finite(payload.extension,1,1.5,'extension');
      if('foldDeg'in payload)next.foldDeg=finite(payload.foldDeg,0,180,'foldDeg');
      if('mode'in payload){if(!['square','triangle'].includes(payload.mode))throw Error('unknown fold mode');next.mode=payload.mode;}
      if('baseOn'in payload)next.baseOn=bool(payload.baseOn);
      if('number'in payload){const number=Number(payload.number);if(!NUMBERS.includes(number))throw Error('number profile unavailable');next.number=number;}
      if('layer'in payload){if(!['HOLD','P0','P1','P2'].includes(payload.layer))throw Error('unknown layer witness');next.layer=payload.layer;}
      if(next.number!==1111&&next.layer!=='HOLD'){if('layer'in payload)throw Error('layer witness only declared for 1111');next.layer='HOLD';}
      restore(next);
    }
    function step(){const state=readState();state.foldDeg=state.foldDeg>=180?0:Math.min(180,state.foldDeg+15);state.conDao={...state.conDao,running:false};restore(state);}
    function read(){
      const state=readState(),audit=foldApi.foldAudit(state),profile=foldApi.run().labels.find(item=>item.n===state.number);
      return {
        type:'BOX_FOLD_CONTACT_WITH_JOINT_ADDRESS',
        contact:{state:audit.state,ratio:audit.contactRatio,gap:audit.centralGap,threshold:foldApi.PHI/Math.sqrt(2)},
        address:{integer:profile.n,primeExponents:profile.factors,totient:profile.totient,gap:profile.gap,q4Address:state.number===1111?'1111':null,layerAddress:state.number===1111&&state.layer!=='HOLD'?state.layer:null,frameAddress:state.number===1111&&state.layer!=='HOLD'?({P0:'F10',P1:'F26',P2:'F42'})[state.layer]:null,layerCandidates:state.number===1111?{P0:'F10',P1:'F26',P2:'F42'}:null},
        conDao:{...state.conDao,returnScope:true,exactCursorReturn:true},
        preserved:['fold controls','mode','base state','integer/totient profile','CON-DAO cursor/display/timer state'],
        unresolved:[...(state.number===1111&&state.layer!=='HOLD'?[]:['selected layer witness']),...(state.number===1111?[]:['Q4/layer map for this integer']),'whole-machine Return']
      };
    }
    return {readState,pause,restore,set,step,read};
  }
  function createInstrument(contract,view){
    if(!contract?.create)throw Error('native instrument contract unavailable');
    return contract.create({
      source:SOURCE,
      scope:'BOX_FOLD_CONTACT_CONTROLS_AND_JOINT_INTEGER_PROFILE',
      capabilities:['SET','STEP'],
      snapshot:()=>view.readState(),
      read:()=>view.read(),
      pause:()=>view.pause(),
      restore:state=>view.restore(state),
      apply:(command,payload)=>command==='SET'?view.set(payload):command==='STEP'?view.step():(()=>{throw Error('unsupported box command')})()
    });
  }
  function install(win,doc){
    installLayerWitness(win,doc);const view=createView(doc,win.A0TessarecFoldContact),instrument=createInstrument(win.A0NativeInstrumentContract,view);
    win.A0NativeInstrument=instrument;
    win.A0SourceSeamBoxView=view;
    win.A0NativeInstrumentDisconnect=win.A0NativeInstrumentContract.install(win,instrument);
    ['input','click'].forEach(type=>doc.getElementById('fold-contact')?.addEventListener(type,()=>instrument.publish()));
    return instrument;
  }
  return {SOURCE,ALLOWED,NUMBERS,installLayerWitness,createView,createInstrument,install};
});
