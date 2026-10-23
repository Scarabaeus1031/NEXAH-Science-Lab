(function(root){
  'use strict';
  const doc=root.document,deck=doc?.getElementById('bluePinkStartDeck');if(!deck)return;
  const $=id=>doc.getElementById(id),bar=doc.querySelector('.bp-master-transport'),status=$('benchMasterStatus');let mode='READY',lastPaint=0;
  function render(note=''){
    const source=root.A0ThreeLissajousPlanesView?.state,body=root.A0BodyDomainSuiteController?.state,enjoy=root.A0EnjoyLoop?.snapshot,channel=root.A0CoupledChannelBoundaryView;
    const active=[Boolean(source?.playing),Boolean(body?.playing),Boolean(enjoy?.running),Boolean(channel?.running)],running=active.filter(Boolean).length;
    bar.dataset.state=mode;status.textContent=`${mode} · ${running}/4 ACTIVE · ${channel?.sharedFrame?'SOURCE FRAME':'LOCAL FALLBACK'}${note?` · ${note}`:''}`;
  }
  function startAll(){root.A0CellReturnPerformance?.stop('Master transport übernimmt');root.A0EnjoyLoop?.start();if(!root.A0BodyDomainSuiteController?.state?.playing)root.A0BodyDomainSuiteController?.play();root.A0CoupledChannelBoundaryView?.setRunning(true);root.A0ThreeLissajousPlanesView?.setPlaying(true);mode='RUNNING';render('Körper · Signal · Channel gekoppelt');}
  function pauseAll(){root.A0EnjoyLoop?.stop('Master transport pausiert');root.A0CellReturnPerformance?.stop('Master transport pausiert');root.A0BodyDomainSuiteController?.stop();root.A0ThreeLissajousPlanesView?.setPlaying(false);root.A0CoupledChannelBoundaryView?.setRunning(false);mode='PAUSED';render('Stand bleibt erhalten');}
  function restartAll(){pauseAll();root.A0CoupledChannelBoundaryView?.reset();$('enjoyLoopRestart')?.click();if(!root.A0BodyDomainSuiteController?.state?.playing)root.A0BodyDomainSuiteController?.play();root.A0CoupledChannelBoundaryView?.setRunning(true);root.A0ThreeLissajousPlanesView?.setPlaying(true);mode='RUNNING';render('gemeinsam von vorn');}
  function holdReturn(){pauseAll();root.A0CellReturnPerformance?.hold();root.A0RootRoomPhaseBridge?.select('RETURN');const channel=root.A0CoupledChannelBoundaryView;if(channel){const next={...channel.state,phaseIndex:5};channel.setState(next)}mode='RETURN';render('Return gehalten · Adressen unverändert');}
  $('benchMasterStart').addEventListener('click',startAll);$('benchMasterPause').addEventListener('click',pauseAll);$('benchMasterRestart').addEventListener('click',restartAll);$('benchMasterReturn').addEventListener('click',holdReturn);
  root.addEventListener('a0-lissajous-frame',event=>{if(performance.now()-lastPaint<500)return;lastPaint=performance.now();if(mode==='RUNNING')render(`t=${event.detail.clock.toFixed(2)} · s₁/s₂/s₃ gemeinsam`)});
  doc.addEventListener('a0:bench-playback',()=>render());
  root.A0BluePinkMasterTransport={start:startAll,pause:pauseAll,restart:restartAll,holdReturn,get state(){return{mode,sourceClock:'a0-lissajous-frame',newIdentity:false,sourceMutation:false}}};render();
})(typeof globalThis!=='undefined'?globalThis:this);
