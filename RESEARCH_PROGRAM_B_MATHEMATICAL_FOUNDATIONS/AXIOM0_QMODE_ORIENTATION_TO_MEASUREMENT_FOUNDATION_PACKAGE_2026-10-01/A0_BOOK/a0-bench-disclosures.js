(function(root,factory){
 if(typeof module==='object'&&module.exports)module.exports=factory;
 else root.A0BenchDisclosures=factory(document,root);
})(typeof globalThis==='undefined'?this:globalThis,function(doc,win){
 'use strict';
 // Explicitly selected parameter panels only. No source controls are cloned.
 const specs=[
 ['#maskObserverBench > .mask-controls:nth-of-type(2)','Maske · Position, Winkel und Schrittfolge'],
 ['#benchIntegration > .bi-controls:first-of-type','Body / TESA · Quelladresse und Projektion'],
 ['#orbitGridJoints > .ogj-controls','Orbit / Teller · Einstellungen']
 ];
 let count=0;
 for(const [selector,label]of specs)for(const panel of doc.querySelectorAll(selector)){
  if(panel.parentElement?.classList.contains('bench-settings-drawer'))continue;
  const details=doc.createElement('details'),summary=doc.createElement('summary');
  details.className='bench-settings-drawer';summary.textContent='Einstellungen · '+label;
  panel.before(details);details.appendChild(summary);details.appendChild(panel);count++;
 }
 function reveal(){
  const hash=win.location.hash;if(!hash?.startsWith('#'))return;
  const node=doc.getElementById(hash.slice(1));if(!node)return;
  for(let p=node;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;
 }
 win.addEventListener('hashchange',reveal);reveal();
 return{count,reveal};
});
