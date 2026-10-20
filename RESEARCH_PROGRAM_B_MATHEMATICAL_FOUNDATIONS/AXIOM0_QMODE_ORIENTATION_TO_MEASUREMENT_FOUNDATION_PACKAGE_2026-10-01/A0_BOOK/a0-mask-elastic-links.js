(function(root,factory){const api=factory(typeof module==='object'&&module.exports?require('./a0-mask-observer.js'):root.A0MaskObserver);if(typeof module==='object'&&module.exports)module.exports=api;else root.A0MaskElasticLinks=api;})(typeof globalThis==='undefined'?this:globalThis,function(M){
 'use strict';
 function options(o={}){const s={visible:o.visible??false,curved:o.curved??true};if(typeof s.visible!=='boolean'||typeof s.curved!=='boolean')throw Error('invalid link view');return s;}
 function snapshot(config,tick){
  const f=M.frame(config,tick),base=M.frame(config,0),distance=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
  const links=f.a.map((a,i)=>{
   const b=f.b[i],length=distance(a,b),baselineLength=distance(base.a[i],base.b[i]),delta=length-baselineLength,bend=Math.max(-.35,Math.min(.35,-.6*delta)),normal=length>1e-12?[-(b[1]-a[1])/length,(b[0]-a[0])/length]:[0,0];
   return {id:'A'+i+'↔B'+i,a:a.slice(),b:b.slice(),length,baselineLength,delta,status:Math.abs(delta)<1e-9?'BASELINE':delta>0?'LONGER':'SHORTER',control:a.map((v,k)=>(v+b[k])/2+bend*normal[k])};
  });
  return {schema:'a0.mask-elastic-links/1',config:f.config,tick,links,edgeCrossings:f.counts.edgeCrossings,crossingsPlusPivot:f.counts.crossingsPlusPivot,
   boundary:'Index-paired display links, baseline at tick0 of current config; no springs, forces or integration. Endpoint coordinates come from unchanged native frames. Curve bend is a declared display law. Length is endpoint distance in source units, not curve arc length.'};
 }
 function drawing(config,tick,view={}){
  const o=options(view);if(!o.visible)return '';const r=snapshot(config,tick),p=([x,y])=>[350+110*x,280-110*y].map(v=>Number(v.toFixed(5))).join(' ');
  return '<g data-mask-elastic-links="display-only" fill="none" stroke-width="2">'+r.links.map(l=>'<path data-link-id="'+l.id+'" d="M '+p(l.a)+(o.curved?' Q '+p(l.control)+' '+p(l.b):' L '+p(l.b))+'" stroke="'+(l.status==='LONGER'?'#55d7ec':l.status==='SHORTER'?'#ee6ca5':'#9bb7c5')+'"/>').join('')+'</g>';
 }
 function ledger(config,tick,view={}){
  const o=options(view);if(!o.visible)return 'Verbindungen ausgeblendet · Quellenzustand unverändert.';
  const r=snapshot(config,tick),f=x=>x.toFixed(4);
  return '<table style="width:100%;border-collapse:collapse"><caption>'+r.links.length+' adressierte Aᵢ↔Bᵢ-Verbindungen · Tick '+tick+' · '+r.edgeCrossings+' Kantenschnitte</caption><thead><tr><th>ID</th><th>Länge L</th><th>Startlänge L₀</th><th>ΔL</th></tr></thead><tbody>'+r.links.map(l=>'<tr><td>'+l.id+'</td><td>'+f(l.length)+'</td><td>'+f(l.baselineLength)+'</td><td style="color:'+(l.status==='LONGER'?'#55d7ec':l.status==='SHORTER'?'#ee6ca5':'#9bb7c5')+'">'+(l.delta>=0?'+':'')+f(l.delta)+'</td></tr>').join('')+'</tbody></table>';
 }
 function numberReading(){return {sequence:[21,5,21,5,21],sum:73,primeIndex:21,primeAtIndex:73,primePairIndices:[2,4],primePair:[3,7],pairSum:10,digitSum73:10,boundary:'Exact arithmetic only; no assignment of these values to link identities, forces or intersection counts.'};}
 return {options,snapshot,drawing,ledger,numberReading};
});
