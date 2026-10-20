(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.A0BenchSourcePreset=api.apply(document,location,root.Event,root);})(typeof globalThis==='undefined'?this:globalThis,function(){
  'use strict';
  const synthesis={loki:['loki','miwa'],h3:['h3','miwa'],e8:['e8','miwa'],astrolabe:['h3','astrolabe'],roman:['h3','roman']};
  const frames=['outside','earth','solar','saturn','uranus','loki','closure'];
  function apply(doc,location,EventClass,win={}){
    const key=new URLSearchParams(location.search).get('a0BenchPreset');if(!key)return {status:'INACTIVE'};
    const file=decodeURIComponent(location.pathname).split('/').pop();let mode;
    try{
      if(file==='NEXAH_FAMILY_SYNTHESIS_DEMONSTRATOR.html'&&key.startsWith('synthesis-')){
        mode=key.slice(10);const pair=synthesis[mode];if(!pair)throw Error('Unbekannter Synthese-Modus');
        const system=doc.getElementById('system'),observer=doc.getElementById('observer');if(!system||!observer)throw Error('Quellregler fehlen');
        system.value=pair[0];system.dispatchEvent(new EventClass('change',{bubbles:true}));
        observer.value=pair[1];observer.dispatchEvent(new EventClass('change',{bubbles:true}));
        if(system.value!==pair[0]||observer.value!==pair[1])throw Error('Modus nicht übernommen');
      }else if(file==='MIWA_PINEAP_AN_DROMEDA.html'&&key.startsWith('miwa-')){
        mode=key.slice(5);if(!frames.includes(mode))throw Error('Unbekannter MIWA-Modus');
        const button=doc.querySelector('[data-frame="'+mode+'"]');if(!button)throw Error('Quellmodus fehlt');button.click();
      }else if(file==='A0_TESSAREC_BLUE_BODY_LAB.html'&&key.startsWith('body-')){
        mode=key.slice(5);if(!['day','night','mirror'].includes(mode))throw Error('Unbekannte Body-Ansicht');
        const player=win.A0PentagonBodyPlayerController;if(!player)throw Error('Body-Player fehlt');
        player.stop();if(player.setView(mode)!==true)throw Error('Body-Ansicht nicht übernommen');
        win.A0BlueBodyReadingMode?.showExpert();
        doc.getElementById('pentagon-body-player')?.scrollIntoView({block:'start',behavior:'auto'});
      }else throw Error('Preset gehört nicht zu dieser Quelle');
      return {status:'APPLIED_SOURCE_CONTROLS',preset:key,mode,wordStarted:false,sharedClock:false};
    }catch(error){const note=doc.createElement('p');note.setAttribute('role','alert');note.textContent='BENCH PRESET HOLD · '+error.message;doc.body.prepend(note);return {status:'HOLD',preset:key,error:error.message};}
  }
  return {apply,synthesis,frames};
});
