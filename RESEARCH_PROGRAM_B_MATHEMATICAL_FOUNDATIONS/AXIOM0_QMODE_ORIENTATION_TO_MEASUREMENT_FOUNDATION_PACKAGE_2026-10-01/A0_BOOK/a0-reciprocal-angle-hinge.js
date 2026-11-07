/* Bounded reciprocal-angle view adapter. Display geometry only; no physical mechanism. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else{root.A0ReciprocalAngleHinge=factory();root.A0ReciprocalAngleHinge.mount(root.document);}})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const PRESETS=Object.freeze([{p:1,q:2},{p:2,q:3},{p:1,q:1},{p:3,q:2},{p:2,q:1}]);
function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b)[a,b]=[b,a%b];return a;}
function ratio(p,q){if(!Number.isInteger(p)||!Number.isInteger(q)||p<=0||q<=0)throw Error('Ratio requires positive integers');const d=gcd(p,q);return {p:p/d,q:q/d};}
function angleDeg(p,q){const r=ratio(p,q);return Math.atan2(r.p,r.q)*180/Math.PI;}
function reciprocal(p,q){const r=ratio(p,q);return ratio(r.q,r.p);}
function complementError(p,q){return Math.abs(angleDeg(p,q)+angleDeg(q,p)-90);}
function signedState(side,p,q){if(side!==1&&side!==-1)throw Error('Side must be +1 or -1');const r=ratio(p,q);return {side,p:r.p,q:r.q,angleDeg:angleDeg(r.p,r.q)};}
function flip(state){const r=reciprocal(state.p,state.q);return signedState(-state.side,r.p,r.q);}
function cycle(state){return flip(flip(state));}
function presetKey(p,q){const r=ratio(p,q);return r.p+':'+r.q;}
function mount(doc){
 const host=doc&&doc.querySelector('[data-reciprocal-angle-hinge]');if(!host||host.dataset.ready)return null;host.dataset.ready='true';
 const $=s=>host.querySelector(s);let state=signedState(1,2,3),running=false,raf=0,start=0,displayAngle=state.angleDeg;
 const svg=$('svg'),buttons=[...host.querySelectorAll('[data-ratio]')];
 function point(a,r=205){const t=a*Math.PI/180;return [335+r*Math.cos(t),278-r*Math.sin(t)];}
 function ray(a,color,width,opacity=1,dash=''){const p=point(a);return '<line x1="335" y1="278" x2="'+p[0].toFixed(2)+'" y2="'+p[1].toFixed(2)+'" stroke="'+color+'" stroke-width="'+width+'" opacity="'+opacity+'" '+(dash?'stroke-dasharray="'+dash+'"':'')+'/>';}
 function label(p,q,a){const x=point(a,225);return '<text x="'+x[0].toFixed(2)+'" y="'+x[1].toFixed(2)+'" fill="#dcecf2" font-size="12" text-anchor="middle">'+p+':'+q+' · '+a.toFixed(2)+'°</text>';}
 function render(angle=state.angleDeg){
  displayAngle=angle;const mate=flip(state),selected=presetKey(state.p,state.q),side=state.side===1?'+ · hell':'− · dunkel';
  buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.ratio===selected)));
  $('[data-side]').textContent=side;$('[data-ratio-readout]').textContent=state.p+':'+state.q+' ↔ '+state.q+':'+state.p+' · θ='+state.angleDeg.toFixed(6)+'° · θ′='+mate.angleDeg.toFixed(6)+'°';
  $('[data-return]').textContent='Swap² = Return · '+cycle(state).side+' · '+cycle(state).p+':'+cycle(state).q+' · Komplementfehler '+complementError(state.p,state.q).toExponential(2)+'°';
  const selectedAngle=state.angleDeg,mateAngle=mate.angleDeg,face=state.side===1?'#f0ca62':'#263943',faceOpacity=state.side===1?'.22':'.65';
  let out='<title>Reziproker Winkelbügel '+state.p+' zu '+state.q+'</title><desc>Fünf positive Verhältnisstrahlen. Reziproke Paare spiegeln sich um den Fixstrahl eins zu eins bei fünfundvierzig Grad. Hell und dunkel codieren nur die signierte Ansichtsseite.</desc>';
  out+='<rect x="115" y="48" width="440" height="360" fill="none" stroke="#69b58b" stroke-width="2" opacity=".48"/><circle cx="335" cy="278" r="205" fill="'+face+'" fill-opacity="'+faceOpacity+'" stroke="#69b58b" stroke-width="2"/>';
  out+='<path d="M245 89 C465 118 470 220 335 278 C205 334 215 401 445 420" fill="none" stroke="#bd66d6" stroke-width="4" opacity=".55"/>';
  for(const r of PRESETS){const a=angleDeg(r.p,r.q),key=presetKey(r.p,r.q),active=key===selected||key===presetKey(mate.p,mate.q);out+=ray(a,active?'#52d3ef':'#829aa6',active?4:2,active?1:.45,active?'':'5 6')+label(r.p,r.q,a);}
  out+=ray(45,'#f0ca62',3,.9,'8 6');
  out+=ray(angle,'#ff8b55',7,.95);const w=point(angle);out+='<circle cx="'+w[0].toFixed(2)+'" cy="'+w[1].toFixed(2)+'" r="8" fill="#f0ca62"/>';
  out+='<circle cx="323" cy="278" r="5" fill="#ff8b55"/><circle cx="347" cy="278" r="5" fill="#ff8b55"/><text x="335" y="306" fill="#ffb18b" font-size="20" text-anchor="middle">:</text>';
  out+='<text x="335" y="32" fill="#dcecf2" font-size="15" text-anchor="middle">+ hell  •  :  •  − dunkel</text><text x="335" y="454" fill="#a9bec7" font-size="13" text-anchor="middle">Cube = Frame · Disc = Schnitt · S = Verlaufsrecord</text>';
  svg.innerHTML=out;
 }
 function setState(next){state=signedState(next.side,next.p,next.q);stop();render();}
 function swap(){setState(flip(state));}
 function stop(){running=false;cancelAnimationFrame(raf);const b=$('[data-action=breath]');if(b)b.textContent='Atem starten';}
 function frame(t){if(!running)return;if(!start)start=t;const phase=((t-start)%4000)/4000,u=(1-Math.cos(phase*Math.PI*2))/2,mate=flip(state),a=state.angleDeg+(mate.angleDeg-state.angleDeg)*u;render(a);raf=requestAnimationFrame(frame);}
 buttons.forEach(b=>b.addEventListener('click',()=>{const [p,q]=b.dataset.ratio.split(':').map(Number);setState(signedState(state.side,p,q));}));
 $('[data-action=swap]').addEventListener('click',swap);
 $('[data-action=side]').addEventListener('click',()=>setState(signedState(-state.side,state.p,state.q)));
 const breath=$('[data-action=breath]');breath.addEventListener('click',()=>{if(running){stop();render();return;}running=true;start=0;breath.textContent='Pause';raf=requestAnimationFrame(frame);});
 $('[data-action=reset]').addEventListener('click',()=>setState(signedState(1,2,3)));
 render();return {get state(){return {...state}},flip:swap,stop,render};
}
return {PRESETS,gcd,ratio,angleDeg,reciprocal,complementError,signedState,flip,cycle,presetKey,mount};
});
