/* Read-only projection of the existing Number Game sequence; no independent clock. */
(function(root,factory){
 const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;
 else{const room=api.mount(document,root);if(room)root.A0ClubControlRoom=room;}
})(typeof globalThis==='undefined'?this:globalThis,function(){
 'use strict';
 const SEEDS=[10537,11357,11537,11573,11735,12537,13571,13573,14357];
 function point(c){
  if(!c||!/^\d+$/.test(String(c.decimal)))return null;
  const n=Number(c.decimal),q=Number(c.q),r=Number(c.r);
  return Number.isSafeInteger(n)&&Number.isInteger(q)&&Number.isInteger(r)&&r>=0&&r<20&&n===20*q+r?{n,q,r}:null;
 }
 function position(p){return{x:48+p.r*43,y:470-(p.q-520)*1.85};}
 function createProjection(){
  let current=null,previous=null,key=null,history=[];
  return{observe(report){
   const s=report?.sequence,p=point(s?.coordinate);
   if(!p||!['carrier','elevator','manual'].includes(s.mode)||!Array.isArray(s.family)||s.family.length!==9)return null;
   const family=s.family.map(c=>({...point(c),seed:Number(c.seed)}));
   if(family.some((c,i)=>!point(s.family[i])||c.seed!==SEEDS[i]))return null;
   const nextKey=s.mode+':'+s.seed+':'+s.cycles;
   if(key!==nextKey||current&&s.index<current.index){history=[];previous=null;current=null;}
   if(current&&current.n!==p.n){previous=current;history.push(current);history=history.slice(-16);}
   key=nextKey;current={...p,index:s.index};
   return{current:{...current},previous:previous?{...previous}:null,history:history.map(x=>({...x})),family,
    mode:s.mode,seed:s.seed,index:s.index,limit:s.limit,following:s.following,ended:s.ended,loop:s.loop,cycles:s.cycles,
    crtExact:report.carrier?.exact===true};
  }};
 }
 function svg(state){
  let out='<svg viewBox="0 0 920 520" role="img" aria-label="20er-Grid: Rest r horizontal, Quotient q vertikal. Aktueller Träger gold.">';
  out+='<defs><marker id="controlArrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7Z" fill="#f5c657"/></marker></defs>';
  for(let r=0;r<20;r++)out+='<rect x="'+(28+r*43)+'" y="34" width="40" height="450" fill="'+(r===state.current.r?'#153e4b':'#0b202b')+'" stroke="#274451"/><text x="'+(48+r*43)+'" y="23" text-anchor="middle" fill="#b6ccd6">'+r+'</text>';
  for(const q of [520,560,600,640,680,720,760]){const y=position({q,r:0}).y;out+='<path d="M28 '+y+'H885" stroke="#31505c" stroke-dasharray="3 5"/><text x="4" y="'+(y-4)+'" fill="#8aa9b5">'+q+'</text>';}
  const pts=state.history.concat(state.current).map(position);
  if(pts.length>1)out+='<polyline points="'+pts.map(p=>p.x+','+p.y).join(' ')+'" fill="none" stroke="#f5c657" opacity=".65" marker-end="url(#controlArrow)"/>';
  for(const c of state.family){const p=position(c);out+='<circle cx="'+p.x+'" cy="'+p.y+'" r="7" fill="#102e3b" stroke="#4cd6e7"/>';}
  if(state.previous){const p=position(state.previous);out+='<circle cx="'+p.x+'" cy="'+p.y+'" r="13" fill="none" stroke="#f5c657" stroke-dasharray="3 3"/>';}
  const p=position(state.current);
  return out+'<circle cx="'+p.x+'" cy="'+p.y+'" r="11" fill="#f5c657" stroke="#fff1bc"/><text x="'+p.x+'" y="'+(p.y-17)+'" text-anchor="middle" fill="#ffe3a1" font-weight="bold">'+state.current.n+'</text><text x="900" y="507" fill="#b6ccd6">r →</text><text x="4" y="15" fill="#b6ccd6">q ↑</text></svg>';
 }
 function mount(doc,win){
  const field=doc.getElementById('controlElevatorGrid'),status=doc.getElementById('controlElevatorStatus'),table=doc.getElementById('controlCarrierList');
  if(!field||!status||!table)return null;
  const projection=createProjection();let state=null;
  const buttons=SEEDS.map(seed=>{const b=doc.createElement('button');b.type='button';b.addEventListener('click',()=>win.A0ClubCRTLink?.selectSeed(seed));table.append(b);return b;});
  function observe(report){
   const next=projection.observe(report);if(!next){state=null;field.innerHTML='';status.textContent='HOLD · Kein gültiger Trägerrecord';buttons.forEach(b=>{b.disabled=true;b.setAttribute('aria-pressed','false');});return false;}state=next;
   field.innerHTML=svg(next);
   const c=next.current;
   status.textContent=(next.mode==='elevator'?'ELEVATOR +20':next.mode==='carrier'?'CARRIER ROUTE':'FESTER TRÄGER')+' · '+next.index+'/'+next.limit+' · n='+c.n+' = 20×'+c.q+'+'+c.r+' · '+(next.crtExact?'CRT MATCH':'CRT HOLD')+(next.previous?' · zuvor '+next.previous.n:' · Startposition')+(next.ended?' · Ende erreicht':'')+(!next.following?' · Handbetrieb':' · folgt Player-Adresswechseln');
   buttons.forEach((b,i)=>{const c=next.family[i];b.textContent=c.seed+' → '+c.n+' · q='+c.q+' · r='+c.r;b.disabled=next.mode==='carrier';b.setAttribute('aria-pressed',String(next.mode!=='carrier'&&c.seed===next.seed));});
   return true;
  }
  observe(win.A0ClubCRTLink?.snapshot());
  return{observe,snapshot:()=>state?JSON.parse(JSON.stringify(state)):null};
 }
 return{SEEDS,point,position,createProjection,svg,mount};
});
