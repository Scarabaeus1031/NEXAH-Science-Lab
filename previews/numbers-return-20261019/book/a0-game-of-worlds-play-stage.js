(function(){
  'use strict';
  const $=id=>document.getElementById(id),kind=document.body.dataset.worldsKind,isLife=kind==='life',play=$(isLife?'playPause':'play'),loop=$(isLife?'loopPlayback':'loop'),status=$(isLife?'playbackStatus':'runStatus');
  const allowed=isLife?['rooms','boundary','field','register','phase','rosette']:['domains','montage','euler'];
  function running(){return play.textContent==='Pause'}
  function publish(ready=false){if(parent!==window)parent.postMessage({type:'worlds-play-state',ready,kind,running:running(),loop:loop.checked,status:status.textContent},'*')}
  function change(el,value){el.value=value;el.dispatchEvent(new Event('change',{bubbles:true}))}
  function pause(){if(running())play.click();for(const id of ['crystalRotate','boundaryRotate','boundaryFlow']){const el=$(id);if(el?.getAttribute('aria-pressed')==='true')el.click();}publish()}
  function view(name){if(!allowed.includes(name))return;document.body.dataset.stage=name;
    if(isLife){if(['register','phase','rosette'].includes(name))change($('projectionMode'),{register:'four-plus-one',phase:'phase-register',rosette:'transition-rosette'}[name]);if(name==='boundary')change($('boundaryReading'),'temporal-z');}
    window.dispatchEvent(new Event('resize'));window.scrollTo(0,0);
  }
  function command(action,value){
    if(action==='hello'){publish(true);return}
    if(action==='pause')pause();
    if(action==='play')play.click();
    if(action==='step')$(isLife?'stepForward':'step').click();
    if(action==='reset')$('reset').click();
    if(action==='loop'){loop.checked=Boolean(value);loop.dispatchEvent(new Event('change',{bubbles:true}));}
    if(action==='speed'&&['slow','normal','fast'].includes(value))change($('speed'),isLife?{slow:'800',normal:'420',fast:'210'}[value]:{slow:'700',normal:'360',fast:'180'}[value]);
    if(action==='seed'&&isLife&&Array.from($('fixture').options).some(o=>o.value===value))change($('fixture'),value);
    if(action==='view')view(value);
    if(action==='hood'){document.body.dataset.look=value?'engine':'wonder';window.dispatchEvent(new Event('resize'));window.scrollTo(0,0);}
    if(action==='orbit'&&isLife){const el=$(document.body.dataset.stage==='boundary'?'boundaryRotate':'crystalRotate');if(el&&el.getAttribute('aria-pressed')!==String(Boolean(value)))el.click();}
    publish();
  }
  window.addEventListener('message',event=>{if(event.source!==parent||event.data?.type!=='worlds-play-command')return;command(event.data.action,event.data.value)});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)pause()});
  new MutationObserver(()=>publish()).observe(status,{childList:true,characterData:true,subtree:true});
  if(isLife){change($('fixture'),'ACORN');$('generation').value=24;$('generation').dispatchEvent(new Event('input',{bubbles:true}));}
  view(isLife?'rooms':'domains');publish(true);
})();
