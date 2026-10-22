(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else{root.A0BluePinkMaskClock=api;api.mountSource(root);}})(typeof globalThis==='undefined'?this:globalThis,function(){
  'use strict';
  const CHANNEL='a0.blue-pink-mask-clock/1',TAU=2*Math.PI;
  function tick(clock){if(!Number.isFinite(clock)||clock<0||clock>=TAU+1e-9)throw Error('invalid source phase');return Math.min(119,Math.floor((clock%TAU)*120/TAU+1e-9));}
  function valid(p){return p&&p.channel===CHANNEL&&typeof p.session==='string'&&/^[a-zA-Z0-9-]{8,80}$/.test(p.session)&&Number.isSafeInteger(p.request)&&p.request>=0;}
  function mountSource(win){
    const view=win.A0ThreeLissajousPlanesView;if(!view||win.parent===win)return null;
    let session=null,lastRequest=-1,sequence=0;
    const send=(type,request)=>{const s=view.state;win.parent.postMessage({channel:CHANNEL,type,session,request,sequence:++sequence,clock:s.clock,playing:s.playing,ratio:s.ratio,phaseDegrees:s.phaseDegrees},'*');};
    win.addEventListener('message',event=>{
      const p=event.data;if(event.source!==win.parent||!valid(p))return;
      if(p.type==='HELLO'){session=p.session;lastRequest=p.request;sequence=0;view.setPlaying(false);send('ACK',p.request);return;}
      if(p.session!==session||p.type!=='CMD'||p.request<=lastRequest||!['PLAY','PAUSE','STEP','DISCONNECT'].includes(p.command))return;
      lastRequest=p.request;
      if(p.command==='PLAY')view.setPlaying(true);
      else if(p.command==='STEP')view.stepPhase();
      else view.setPlaying(false);
      send('ACK',p.request);if(p.command==='DISCONNECT')session=null;
    });
    win.addEventListener('a0-lissajous-frame',()=>{if(session)send('FRAME',lastRequest);});
    win.document?.getElementById('lissajousPlay')?.addEventListener('click',()=>{if(session)send('FRAME',lastRequest);});
    return{get connected(){return session!==null;}};
  }
  return{CHANNEL,TAU,tick,valid,mountSource};
});
