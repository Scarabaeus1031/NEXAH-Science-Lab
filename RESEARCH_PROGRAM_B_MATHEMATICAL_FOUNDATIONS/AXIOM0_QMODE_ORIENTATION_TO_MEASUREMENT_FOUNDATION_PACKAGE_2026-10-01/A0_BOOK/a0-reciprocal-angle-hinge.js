/* Bounded reciprocal-angle view adapter. Display geometry only; no physical mechanism. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else{root.A0ReciprocalAngleHinge=factory();root.A0ReciprocalAngleHinge.mount(root.document);}})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const PRESETS=Object.freeze([{p:1,q:2},{p:2,q:3},{p:1,q:1},{p:3,q:2},{p:2,q:1}]);
const ORIENTATION_ANGLES=Object.freeze([102,204,258]);
const PRIME_FLASHLIGHT_PRESETS=Object.freeze([41,101,121,202,303,313,333,404,444,666,717,808]);
const THETA_LIFT_SEQUENCE=Object.freeze([
 Object.freeze({key:'LOS',delta:0,cumulative:0,displayReset:false}),
 Object.freeze({key:'TAO',delta:90,cumulative:90,displayReset:false}),
 Object.freeze({key:'DAO',delta:90,cumulative:180,displayReset:false}),
 Object.freeze({key:'IOTA',delta:-270,cumulative:-90,displayReset:false}),
 Object.freeze({key:'YUGO',delta:0,cumulative:-90,displayReset:true})
]);
function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b)[a,b]=[b,a%b];return a;}
function ratio(p,q){if(!Number.isInteger(p)||!Number.isInteger(q)||p<=0||q<=0)throw Error('Ratio requires positive integers');const d=gcd(p,q);return {p:p/d,q:q/d};}
function angleDeg(p,q){const r=ratio(p,q);return Math.atan2(r.p,r.q)*180/Math.PI;}
function reciprocal(p,q){const r=ratio(p,q);return ratio(r.q,r.p);}
function complementError(p,q){return Math.abs(angleDeg(p,q)+angleDeg(q,p)-90);}
function signedState(side,p,q){if(side!==1&&side!==-1)throw Error('Side must be +1 or -1');const r=ratio(p,q);return {side,p:r.p,q:r.q,angleDeg:angleDeg(r.p,r.q)};}
function flip(state){const r=reciprocal(state.p,state.q);return signedState(-state.side,r.p,r.q);}
function cycle(state){return flip(flip(state));}
function presetKey(p,q){const r=ratio(p,q);return r.p+':'+r.q;}
function normalizeDegrees(value){const normalized=value%360;return normalized<0?normalized+360:normalized;}
function compassToMath(course){return normalizeDegrees(90-course);}
function quarterTurnRecord(course){
 const source=normalizeDegrees(course),right=normalizeDegrees(source+90),left=normalizeDegrees(source-90);
 return {source,right,left,mathSource:compassToMath(source),mathRight:compassToMath(right),mathLeft:compassToMath(left),east:Math.sin(source*Math.PI/180),north:Math.cos(source*Math.PI/180)};
}
function cardinalResidues(course){
 const source=normalizeDegrees(course);return {source,from0:normalizeDegrees(source),from90:normalizeDegrees(source-90),from180:normalizeDegrees(source-180),from270:normalizeDegrees(source-270)};
}
function thetaLiftRecord(course,step=0){
 if(!Number.isInteger(step)||step<0||step>=THETA_LIFT_SEQUENCE.length)throw Error('Theta lift step must be an integer from 0 to 4');
 const source=normalizeDegrees(course),phase=THETA_LIFT_SEQUENCE[step],pathTarget=normalizeDegrees(source+phase.cumulative),target=phase.displayReset?source:pathTarget;
 return {source,step,key:phase.key,delta:phase.delta,cumulative:phase.cumulative,target,pathTarget,mathTarget:compassToMath(target),rightQuarterTurns:2,leftQuarterTurns:3,ratio:'2:3',displayReset:phase.displayReset,windingPreserved:true};
}
function isPrime(value){
 const n=Number(value);if(!Number.isInteger(n)||n<2)return false;if(n===2)return true;if(n%2===0)return false;
 for(let divisor=3;divisor*divisor<=n;divisor+=2)if(n%divisor===0)return false;return true;
}
function primeCount(value){
 const n=Number(value);if(!Number.isInteger(n)||n<0)throw Error('Prime count requires a non-negative integer');let count=0;
 for(let candidate=2;candidate<=n;candidate++)if(isPrime(candidate))count++;return count;
}
function logarithmicIntegralApprox(value){
 const x=Number(value);if(!Number.isFinite(x)||x<2)throw Error('Logarithmic integral comparator requires x >= 2');
 if(x===2)return 1.0451637801174928;let steps=Math.max(120,Math.ceil((x-2)*2));if(steps%2)steps++;
 const h=(x-2)/steps;let sum=1/Math.log(2)+1/Math.log(x);
 for(let index=1;index<steps;index++)sum+=(index%2?4:2)/Math.log(2+index*h);
 return 1.0451637801174928+h*sum/3;
}
function primeFlashlightRecord(value){
 const source=Number(value);if(!Number.isInteger(source)||source<2)throw Error('Prime flashlight source requires an integer >= 2');
 const exactCount=primeCount(source),prediction=logarithmicIntegralApprox(source);
 return {source,exactCount,prediction,residual:prediction-exactCount,isPrime:isPrime(source),factor101:source%101===0?source/101:null,sourceBound:true,newIdentity:false,relationChange:false};
}
function mountPrimeFlashlight(lens){
 const dock=lens.querySelector('[data-prime-flashlight]');if(!dock||dock.dataset.ready)return null;dock.dataset.ready='true';
 const svg=dock.querySelector('[data-prime-flashlight-stage]'),slider=dock.querySelector('[data-prime-source-slider]'),sourceOut=dock.querySelector('[data-prime-source-out]'),exactOut=dock.querySelector('[data-prime-exact]'),predictionOut=dock.querySelector('[data-prime-prediction]'),residualOut=dock.querySelector('[data-prime-residual]'),factorOut=dock.querySelector('[data-prime-factor]'),buttons=[...dock.querySelectorAll('[data-prime-source]')];
 function render(){
  const record=primeFlashlightRecord(Number(slider.value)),scale=Math.max(record.exactCount,record.prediction,1),exactY=178-record.exactCount/scale*90,predictedY=178-record.prediction/scale*90,residual=Math.abs(predictedY-exactY);
  buttons.forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.primeSource)===record.source)));
  sourceOut.textContent=String(record.source);exactOut.textContent='π('+record.source+') = '+record.exactCount;predictionOut.textContent='Li('+record.source+') ≈ '+record.prediction.toFixed(3);residualOut.textContent='Δ = Li−π = '+record.residual.toFixed(3);factorOut.textContent=record.factor101!==null?record.source+' = '+record.factor101+'×101':record.source+(record.isPrime?' · PRIME':' · COMPOSITE');
  svg.innerHTML='<title>Prime Flashlight für Quelle '+record.source+'</title><desc>Gelb zeigt die glatte logarithmische Vergleichskurve, Blau den exakten Primzahlzähler und Pink ihr Residuum. Der weiße Sektor ist nur eine sichtbare Apertur.</desc><defs><radialGradient id="pfGlow"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset=".35" stop-color="#f0b52b" stop-opacity=".4"/><stop offset="1" stop-color="#f0b52b" stop-opacity="0"/></radialGradient></defs><circle cx="260" cy="130" r="102" fill="#02080c" stroke="#214553" stroke-width="2"/><path d="M260 130 L352 76 A112 112 0 0 1 352 184 Z" fill="#f5fbff" fill-opacity=".12" stroke="#f5fbff" stroke-width="1.5"/><text x="337" y="54" fill="#f5fbff" text-anchor="middle" font-size="10" font-weight="800">FLASHLIGHT · ACTIVE SECTOR</text><path d="M151 130 C190 92 218 88 260 130 S328 168 369 130" fill="none" stroke="#f0b52b" stroke-width="4"/><path d="M151 130 C195 153 223 160 260 130 S325 103 369 '+exactY.toFixed(1)+'" fill="none" stroke="#25d6e7" stroke-width="4"/><line x1="369" y1="'+predictedY.toFixed(1)+'" x2="369" y2="'+exactY.toFixed(1)+'" stroke="#f02f8b" stroke-width="5"/><circle class="prime-source-breath" cx="151" cy="130" r="34" fill="url(#pfGlow)"/><circle class="prime-source-breath" cx="151" cy="130" r="9" fill="#f5fbff" stroke="#f02f8b" stroke-width="3"/><circle cx="369" cy="'+predictedY.toFixed(1)+'" r="7" fill="#f0b52b"/><circle cx="369" cy="'+exactY.toFixed(1)+'" r="7" fill="#25d6e7"/><text x="151" y="176" fill="#f02f8b" text-anchor="middle" font-size="11" font-weight="900">SOURCE '+record.source+'</text><text x="397" y="'+Math.max(38,predictedY-10).toFixed(1)+'" fill="#f0b52b" font-size="10" font-weight="800">J · IRIDIUM · Li</text><text x="397" y="'+Math.min(218,exactY+18).toFixed(1)+'" fill="#25d6e7" font-size="10" font-weight="800">I · PLATINUM · π</text><text x="357" y="'+((predictedY+exactY)/2+4).toFixed(1)+'" fill="#f02f8b" text-anchor="end" font-size="9">Δ '+record.residual.toFixed(2)+'</text><text x="260" y="238" fill="#9db8c4" text-anchor="middle" font-size="10">WHITE APERTURE · DARK COMPLEMENT · SAME SOURCE / SAME CARRIER</text>';
  dock.style.setProperty('--prime-residual-px',residual.toFixed(1)+'px');
 }
 slider.addEventListener('input',render);buttons.forEach(button=>button.addEventListener('click',()=>{slider.value=button.dataset.primeSource;render();}));render();return {render,get record(){return primeFlashlightRecord(Number(slider.value));}};
}
function mountQuarterTurn(host){
 const lens=host.querySelector('[data-quarter-turn-lens]');if(!lens||lens.dataset.ready)return null;lens.dataset.ready='true';
 const svg=lens.querySelector('[data-quarter-turn-stage]'),sourceButtons=[...lens.querySelectorAll('[data-quarter-source]')],modeButtons=[...lens.querySelectorAll('[data-quarter-mode]')],play=lens.querySelector('[data-quarter-play]'),liftRail=[...lens.querySelectorAll('[data-theta-lift-rail] span')],readout=lens.querySelector('[data-quarter-readout]'),math=lens.querySelector('[data-quarter-math]'),vector=lens.querySelector('[data-quarter-vector]'),distance=lens.querySelector('[data-quarter-distance]'),distanceOut=lens.querySelector('[data-quarter-distance-out]'),displacement=lens.querySelector('[data-quarter-displacement]'),table=lens.querySelector('[data-quarter-table]');
 let sourceIndex=0,mode='right',liftStep=0,timer=0;
 const point=(course,radius=122)=>{const angle=(course-90)*Math.PI/180;return [180+Math.cos(angle)*radius,180+Math.sin(angle)*radius];};
 const ray=(course,color,width,label,dash='')=>{const p=point(course);return '<line x1="180" y1="180" x2="'+p[0].toFixed(2)+'" y2="'+p[1].toFixed(2)+'" stroke="'+color+'" stroke-width="'+width+'" '+(dash?'stroke-dasharray="'+dash+'"':'')+'/><circle cx="'+p[0].toFixed(2)+'" cy="'+p[1].toFixed(2)+'" r="6" fill="'+color+'"/><text x="'+p[0].toFixed(2)+'" y="'+(p[1]-11).toFixed(2)+'" fill="'+color+'" text-anchor="middle" font-size="11" font-weight="800">'+label+'</text>';};
 function stop(){if(timer)clearInterval(timer);timer=0;play.textContent='PLAY · TAO/DAO/IOTA/YUGO';play.setAttribute('aria-pressed','false');}
 function render(){
  const source=ORIENTATION_ANGLES[sourceIndex],record=quarterTurnRecord(source),residue=cardinalResidues(source),lift=thetaLiftRecord(source,liftStep),target=mode==='theta'?lift.target:mode==='left'?record.left:record.right;
  sourceButtons.forEach((button,index)=>button.setAttribute('aria-pressed',String(index===sourceIndex)));modeButtons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.quarterMode===mode)));
  liftRail.forEach((item,index)=>item.classList.toggle('is-active',index===liftStep));
  let out='<title>Drei getypte Ausgangswinkel mit getrennten Vierteldrehungen</title><desc>Kompasskurse wachsen im Uhrzeigersinn. Cyan zeigt den Ausgangswinkel, Gold die Rechtsdrehung um neunzig Grad und Pink die Linksdrehung um neunzig Grad.</desc><circle cx="180" cy="180" r="132" fill="none" stroke="#315769" stroke-width="2"/><line x1="180" y1="32" x2="180" y2="328" stroke="#315769"/><line x1="32" y1="180" x2="328" y2="180" stroke="#315769"/><text x="180" y="21" text-anchor="middle" fill="#a9bec7">N · 0°</text><text x="344" y="184" text-anchor="middle" fill="#a9bec7">E · 90°</text><text x="180" y="351" text-anchor="middle" fill="#a9bec7">S · 180°</text><text x="17" y="184" text-anchor="middle" fill="#a9bec7">W · 270°</text>';
  out+=ray(record.source,'#25d6e7',5,'SOURCE '+record.source+'°');
  out+=ray(record.right,'#f0b52b',mode==='right'?7:3,'R+90 · '+record.right+'°',mode==='right'?'':'6 5');
  out+=ray(record.left,'#f02f8b',mode==='left'?7:3,'L−90 · '+record.left+'°',mode==='left'?'':'6 5');
  if(mode==='theta'){
   const liftColor=lift.displayReset?'#36dc83':lift.delta<0?'#f02f8b':'#f0b52b';
   out+=ray(lift.target,liftColor,8,lift.key+' · '+(lift.displayReset?'LOS':(lift.cumulative>0?'+':'')+lift.cumulative+'°'));
   out+='<path d="M180 48 A132 132 0 1 1 179.9 48" fill="none" stroke="#f02f8b" stroke-width="3" stroke-dasharray="4 7" opacity=".55"/><text x="180" y="366" text-anchor="middle" fill="#f0b52b" font-size="10" font-weight="800">Θ LIFT · R 2×90° / L 3×90° · WINDING HELD</text>';
  }
  out+='<circle cx="180" cy="180" r="8" fill="#f5fbff"/><text x="180" y="375" text-anchor="middle" fill="#a9bec7" font-size="10">COMPASS CW · MATH ANGLE = 90° − COURSE</text>';svg.innerHTML=out;
  readout.textContent=mode==='theta'?lift.key+' · '+source+'° '+(lift.displayReset?'⇢ LOS · path '+lift.pathTarget+'° retained':'→ '+(lift.delta>=0?'+':'')+lift.delta+'° → '+target+'°'):source+'° → '+(mode==='left'?'L−90°':'R+90°')+' → '+target+'°';
  math.textContent='Math: '+compassToMath(target)+'° · cos/sin = ('+Math.cos(compassToMath(target)*Math.PI/180).toFixed(3)+', '+Math.sin(compassToMath(target)*Math.PI/180).toFixed(3)+')';
  const targetEast=Math.sin(target*Math.PI/180),targetNorth=Math.cos(target*Math.PI/180),d=Number(distance.value);vector.textContent='Target unit vector E/N = ('+targetEast.toFixed(3)+', '+targetNorth.toFixed(3)+')';distanceOut.textContent=d.toFixed(0)+' km';displacement.textContent='ΔE / ΔN = '+(d*targetEast).toFixed(1)+' km / '+(d*targetNorth).toFixed(1)+' km';
  table.innerHTML=ORIENTATION_ANGLES.map((angle,index)=>{const r=cardinalResidues(angle),special=index===0?r.from270:index===1?r.from180:r.from90;const signed=index===0?angle-270:index===1?angle-180:angle-90;return '<tr class="'+(index===sourceIndex?'is-active':'')+'"><th>'+angle+'°</th><td>'+r.from90+'°</td><td>'+r.from180+'°</td><td>'+r.from270+'°</td><td>'+signed+'° ≡ '+special+'°</td></tr>';}).join('');
 }
 sourceButtons.forEach((button,index)=>button.addEventListener('click',()=>{stop();sourceIndex=index;render();}));
 modeButtons.forEach(button=>button.addEventListener('click',()=>{stop();mode=button.dataset.quarterMode;if(mode==='theta')liftStep=0;render();}));
 distance.addEventListener('input',render);
 play.addEventListener('click',()=>{if(timer){stop();return;}mode='theta';liftStep=0;render();play.textContent='PAUSE · Θ LIFT';play.setAttribute('aria-pressed','true');timer=setInterval(()=>{liftStep=(liftStep+1)%THETA_LIFT_SEQUENCE.length;render();},1150);});
 const primeFlashlight=mountPrimeFlashlight(lens);render();return {get state(){return {source:ORIENTATION_ANGLES[sourceIndex],mode,liftStep}},stop,render,primeFlashlight};
}
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
 const quarterTurn=mountQuarterTurn(host);render();return {get state(){return {...state}},flip:swap,stop,render,quarterTurn};
}
return {PRESETS,ORIENTATION_ANGLES,PRIME_FLASHLIGHT_PRESETS,THETA_LIFT_SEQUENCE,gcd,ratio,angleDeg,reciprocal,complementError,signedState,flip,cycle,presetKey,normalizeDegrees,compassToMath,quarterTurnRecord,cardinalResidues,thetaLiftRecord,isPrime,primeCount,logarithmicIntegralApprox,primeFlashlightRecord,mountPrimeFlashlight,mountQuarterTurn,mount};
});
