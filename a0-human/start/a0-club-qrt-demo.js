/* Source-bound presentation of ART:ROSETTA:QRT_FIXTURE. Not a Q4 operator. */
(function(root,factory){
 const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;
 else root.A0ClubQRTDemo=api.mount(document);
})(typeof globalThis==='undefined'?this:globalThis,function(){
 'use strict';
 const INPUT=Object.freeze(['A','B','C','D','E','F','X']);
 function flip(sequence){return sequence.slice(0,4).concat(sequence.slice(4).reverse());}
 function frame(step){
  if(!Number.isInteger(step)||step<0||step>4)return null;
  const view=step<2?[...INPUT]:flip(INPUT),returned=step<3?[...view]:flip(view);
  return{step,input:[...INPUT],view,returned,residual:step===4?returned.filter((v,i)=>v!==INPUT[i]).length:null};
 }
 function createSequence(draw=()=>{}){
  let step=0,last=null,following=true,changes=0;
  function show(){const s=frame(step);draw(s);return s;}
  return{observe(s){if(!s||!Number.isInteger(s.q4Address)||s.q4Address<0||s.q4Address>15)return;
    if(last!==null&&last!==s.q4Address&&following){changes++;step=(step+1)%5;show();}last=s.q4Address;},
   select(n){if(!frame(n))return false;following=false;step=n;show();return true;},
   follow(value){following=!!value;show();},
   snapshot:()=>({step,last,following,changes,sourceIdentity:'ART:ROSETTA:QRT_FIXTURE',q4Mapping:false}),show};
 }
 function mount(doc){
  const host=doc.getElementById('clubQRTDemo');if(!host)return null;
  const field=doc.getElementById('clubQRTField'),output=doc.getElementById('clubQRTStatus'),follow=doc.getElementById('clubQRTFollow');
  const nodes={},buttons=[...doc.querySelectorAll('[data-qrt-stage]')];
  for(const [key,name] of [['input','Input'],['view','Ansicht'],['returned','Return']]){
   const row=doc.createElement('div'),label=doc.createElement('span'),lane=doc.createElement('div');label.textContent=name;lane.className='club-qrt-lane';
   nodes[key]=INPUT.map((glyph,index)=>{const cell=doc.createElement('span');cell.textContent=glyph;cell.title='Persistente Position '+(index+1)+(index===3?' · D4 Schnitt':'');
    cell.dataset.hinge=String(index===3);cell.dataset.suffix=String(index>3);lane.append(cell);return cell;});
   row.append(label);row.append(lane);field.append(row);
  }
  let controller;
  function draw(s){
   host.dataset.stage=String(s.step);
   for(const key of Object.keys(nodes))INPUT.forEach((glyph,i)=>nodes[key][i].style.setProperty('--slot',String(s[key].indexOf(glyph))));
   for(const b of buttons)b.setAttribute('aria-pressed',String(Number(b.dataset.qrtStage)===s.step));
   const text=['Input · sieben adressierte Positionen','Q · Schnitt an D4 · rechter Teil deklariert','T · rechter Frame gespiegelt · E ↔ X; F bleibt','R · inverse Spiegelung + Adressausrichtung','Vergleich · '+(s.residual===0?'MATCH · Δ = 0':'CHANGED · Δ = '+s.residual)];
   output.textContent=(controller&&!controller.snapshot().following?'Manuell · ':'')+text[s.step];
   if(controller){follow.setAttribute('aria-pressed',String(controller.snapshot().following));follow.textContent=controller.snapshot().following?'● Mit Platte':'○ Manuell';}
  }
  controller=createSequence(draw);
  for(const b of buttons)b.addEventListener('click',()=>controller.select(Number(b.dataset.qrtStage)));
  follow.addEventListener('click',()=>controller.follow(!controller.snapshot().following));
  controller.show();return controller;
 }
 return{INPUT,flip,frame,createSequence,mount};
});
