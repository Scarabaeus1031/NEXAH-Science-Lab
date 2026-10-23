(function(root,factory){
  const tower=typeof module==='object'&&module.exports?require('./a0-tower-shell-return.js'):root.A0TowerShellReturn;
  const api=factory(tower);
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.A0TowerReturnDemonstrator=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(tower){
  'use strict';
  const VERSION='1.0.0';
  const IDENTITY='NEXAH_A0_ORIENTATION_CONTROLLER_BENCH';
  const STAGES=Object.freeze(['EXCITATION','TRACE','WITNESS','RETURN']);

  function pinFixture(q=1,screenRead='OCCUPIED'){
    const occupied=screenRead==='OCCUPIED';
    return Object.freeze({schema:'nexah.a0.tl-final-pin-view/1',identity:IDENTITY,state:Object.freeze({phase:occupied?'pinned':'open',scanner:Object.freeze({q,screenRead})}),input:Object.freeze({declaredParts:Object.freeze([2,1])}),pin:Object.freeze({address:`q${String(q).padStart(2,'0')}`,decision:occupied?'PINNED_2_TO_1':'HOLD_GAP'})});
  }

  function dgFixture(stage='EXCITATION'){
    const index={EXCITATION:0,TRACE:5,WITNESS:9,RETURN:14}[stage];
    if(index===undefined)throw new RangeError(`Unknown D°G stage ${stage}`);
    return Object.freeze({schema:'nexah.a0.dg-sampling-loop-record/1',identity:IDENTITY,current:Object.freeze({stage,sample:`${index+1}/18`,wheelDeg:index/18*360,samples:18,bands:5,index}),finalPinHandoff:Object.freeze({status:'ACCEPTED'})});
  }

  function nextStage(record){
    const current=record?.current?.stage;
    const index=STAGES.indexOf(current);
    return STAGES[Math.min(index<0?0:index+1,STAGES.length-1)];
  }

  function mount(doc,win=doc.defaultView||{}){
    const load=doc.getElementById('towerDemoLoad'),gap=doc.getElementById('towerDemoGap'),clear=doc.getElementById('towerDemoClear'),source=doc.getElementById('towerDemoSource');
    if(!load||!gap||!clear||!source)throw Error('Tower demonstrator source controls missing');
    let pin=null,dg=null,controller=null;
    const adapter=Object.freeze({step(){dg=dgFixture(nextStage(dg));win.A0DgSamplingLoopView=dg;controller?.bindDg(dg);return dg}});
    win.A0DgSamplingLoopController=adapter;
    controller=tower.mount(doc,win);
    if(!controller)throw Error('Tower return controller did not mount');
    function publish(label){win.A0TlFinalPinView=pin;win.A0DgSamplingLoopView=dg;controller.bindPin(pin);controller.bindDg(dg);source.textContent=label;return controller.record}
    function loadFixture(){pin=pinFixture();dg=dgFixture();return publish('q01 · OCCUPIED · N18 / 5 BANDS')}
    function loadGap(){pin=pinFixture(2,'GAP');dg=dgFixture();return publish('q02 · GAP · PIN MUST HOLD')}
    function resetSource(){pin=null;dg=null;controller.reset();return publish('NO SOURCE FIXTURE · HOLD')}
    load.addEventListener('click',loadFixture);gap.addEventListener('click',loadGap);clear.addEventListener('click',resetSource);
    resetSource();
    return Object.freeze({load:loadFixture,loadGap,clear:resetSource,step:adapter.step,get record(){return controller.record},get source(){return Object.freeze({pin,dg})}});
  }

  return{VERSION,IDENTITY,STAGES,pinFixture,dgFixture,nextStage,mount};
});
