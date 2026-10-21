(function(root,factory){const api=factory(typeof module==='object'&&module.exports?require('./a0-blue-pink-mask-clock.js'):root.A0BluePinkMaskClock);if(typeof module==='object'&&module.exports)module.exports=api;else root.A0MaskClockBench=api.mount(document,root);})(typeof globalThis==='undefined'?this:globalThis,function(P){
  'use strict';
  function mount(doc,win){
    const $=id=>doc.getElementById(id),host=$('maskClockLink'),frame=$('nativeFaceSourceFrame'),mask=win.A0MaskObserverController;if(!host||!frame||!mask)return null;
    let session=null,request=0,pending=null,sequence=0,deadline=null,last=null;const listeners=new Set();
    const status=s=>{$('maskClockStatus').textContent=s;for(const f of [...listeners])f();};
    const clear=()=>{if(deadline!==null)win.clearTimeout(deadline);deadline=null;};
    function send(type,command){frame.contentWindow.postMessage({channel:P.CHANNEL,type,session,request:++request,...(command?{command}:{})},'*');return request;}
    function release(reason){clear();if(mask.clockOwner===session)mask.unbindClock(session);session=null;pending=null;status(reason);}
    function hold(reason){if(session)try{send('CMD','PAUSE');}catch(_){}release('HOLD · '+reason);}
    function watch(){clear();deadline=win.setTimeout(()=>hold('keine aktuelle Quellbestätigung; Maskenfolge angehalten.'),2000);}
    function connect(){
      if(session){status('Bereits verbunden / Verbindung läuft.');return;}
      const src=String(frame.getAttribute('src')||'').split('#')[0].split('?')[0];
      if(src!== 'A0_BLUE_PINK_DODECA_CELL_RETURN.html'){status('HOLD · unerwartete Quelladresse.');return;}
      session=win.crypto.randomUUID();sequence=0;last=null;mask.bindClock(session);
      try{pending=send('HELLO');watch();status('WAITING · Quelle pausieren und bestätigen …');}catch(error){hold(error.message);}
    }
    function command(command){
      if(!session){status('HOLD · zuerst verbinden.');return;}
      if(pending!==null){status('WAITING · vorherigen Quellbefehl bestätigen lassen.');return;}
      try{pending=send('CMD',command);watch();status('WAITING · '+command);}catch(error){hold(error.message);}
    }
    function receive(event){
      const p=event.data;if(event.source!==frame.contentWindow||!P.valid(p)||p.session!==session||!session||!['ACK','FRAME'].includes(p.type))return;
      if(!Number.isSafeInteger(p.sequence)||p.sequence<=sequence||typeof p.playing!=='boolean'||typeof p.ratio!=='string'||!/^\d+:\d+$/.test(p.ratio)||!Number.isFinite(p.phaseDegrees)||p.phaseDegrees<0||p.phaseDegrees>360)return;
      if(p.request!==request||p.type==='ACK'&&p.request!==pending)return;
      try{
        const target=P.tick(p.clock),readback=mask.followClock(session,target);
        if(readback.tick!==target||readback.localTimerRunning)throw Error('Masken-Readback stimmt nicht.');
        sequence=p.sequence;last={source:{clock:p.clock,ratio:p.ratio,phaseDegrees:p.phaseDegrees,playing:p.playing,sequence},maskTick:readback.tick,quantization:'floor((sourcePhase mod 2pi)*120/(2pi)); error < 1/120 cycle',scope:'Geometric mask tick only. Assembly/compass remain local 3:2/90 readings, not source signal followers.'};
        if(p.type==='ACK')pending=null;
        if(pending===null){if(p.playing)watch();else clear();}
        status((pending!==null?'WAITING':'SYNC')+' · Blue/Pink t='+p.clock.toFixed(4)+' · '+p.ratio+' / '+p.phaseDegrees+'° → Maske '+target+'/120 · Readback bestätigt · lokale Maskenuhr AUS'+(p.playing?' · läuft':' · pausiert'));
      }catch(error){hold(error.message);}
    }
    $('maskClockConnect').addEventListener('click',connect);
    $('maskClockShowSource')?.addEventListener('click',()=>win.A0BenchSourceSectionsController?.select('lissajous'));
    for(const [id,cmd]of [['maskClockPlay','PLAY'],['maskClockPause','PAUSE'],['maskClockStep','STEP']])$(id).addEventListener('click',()=>command(cmd));
    function disconnect(){if(session)try{send('CMD','DISCONNECT');}catch(_){}release('GETRENNT · Maske bleibt stehen; lokale Bedienung wieder frei.');}
    $('maskClockDisconnect').addEventListener('click',disconnect);
    $('maskClockExport').addEventListener('click',()=>{
      if(!last||!session||pending!==null){status('HOLD · kein bestätigter gemeinsamer Lesestand.');return;}
      const record={schema:'a0.blue-pink-mask-readback/1',...last,mask:mask.record(),wholeMachineReturn:false},url=win.URL.createObjectURL(new win.Blob([JSON.stringify(record,null,2)],{type:'application/json'})),a=doc.createElement('a');a.href=url;a.download='a0-blue-pink-mask-readback.json';a.click();win.URL.revokeObjectURL(url);
    });
    frame.addEventListener('load',()=>{if(session)hold('Quelle neu geladen; erneut verbinden.');});
    doc.addEventListener?.('visibilitychange',()=>{if(doc.hidden&&session)command('PAUSE');});
    win.addEventListener('message',receive);
    const focus=on=>{doc.documentElement.classList.toggle('mask-clock-focus',on);$('maskClockFocus').setAttribute('aria-pressed',String(on));};
    $('maskClockFocus').addEventListener('click',()=>focus(!doc.documentElement.classList.contains('mask-clock-focus')));
    win.addEventListener('hashchange',()=>{const id=win.location.hash.slice(1);if(id&&!['maskClockLink','maskObserverBench','nativeFaceBridge','sourceSections'].includes(id))focus(false);});
    focus(!win.location.hash||['maskClockLink','maskObserverBench','nativeFaceBridge','sourceSections'].includes(win.location.hash.slice(1)));
    function confirmed(action){
      return new Promise((resolve,reject)=>{
        if(!['CONNECT','PLAY','PAUSE','STEP'].includes(action)){reject(Error('unknown clock action'));return;}
        if(pending!==null){reject(Error('Quellbestätigung noch offen'));return;}
        let armed=false;
        const done=()=>{if(!armed)return;if(!session){listeners.delete(done);reject(Error($('maskClockStatus').textContent));}else if(pending===null&&last){listeners.delete(done);resolve(JSON.parse(JSON.stringify(last)));}};
        listeners.add(done);armed=true;
        try{if(action==='CONNECT'){if(session)command('PAUSE');else connect();}else command(action);done();}catch(error){listeners.delete(done);reject(error);}
      });
    }
    return{connect,command,confirmed,disconnect,focus,receive,subscribe(listener){listeners.add(listener);return()=>listeners.delete(listener);},get ready(){return session!==null&&pending===null&&last!==null;},get last(){return last?JSON.parse(JSON.stringify(last)):null;},get connected(){return session!==null;}};
  }
  return{mount};
});
