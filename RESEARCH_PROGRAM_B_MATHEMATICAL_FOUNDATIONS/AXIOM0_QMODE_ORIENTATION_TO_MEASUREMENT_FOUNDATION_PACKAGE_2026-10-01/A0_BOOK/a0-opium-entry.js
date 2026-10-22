(function(){
 'use strict';
 const button=document.getElementById('opiumMotion');
 if(!button)return;
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 let paused=reduced.matches;
 function draw(){document.body.classList.toggle('opium-paused',paused);button.setAttribute('aria-pressed',String(paused));button.textContent=reduced.matches?'Reduzierte Bewegung aktiv':paused?'Animation fortsetzen ▷':'Animation pausieren Ⅱ';button.disabled=reduced.matches;}
 button.addEventListener('click',()=>{paused=!paused;draw();});
 reduced.addEventListener?.('change',()=>{paused=true;draw();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){paused=true;draw();}});
 draw();
})();
