(function(root){
  'use strict';
  const groups=[['01','Quelle & Steuerung',['control','native','bridges']],['02','Ansicht & Überlagerung',['lens-return','measurement','root']],['03','Operator & Vergleich',['antipode','ghostgons','adapters','window','observatory']],['04','Return & Nachweis',['division-return','economy','ledger']]];
  function arrange(doc,win){
    const hub=doc.querySelector('#coupledWindowHub .coupled-window-launchers');if(!hub)return;
    const cards=Array.from(hub.querySelectorAll('[data-coupled-open]')),byId=new Map(cards.map(n=>[n.dataset.coupledOpen,n]));
    // Move original launcher nodes: listeners, source targets and focus identity survive.
    for(const [n,title,ids] of groups){const section=doc.createElement('section');section.className='bench-window-group';const heading=doc.createElement('h3');heading.innerHTML='<small>'+n+'</small>'+title;section.appendChild(heading);const grid=doc.createElement('div');grid.className='coupled-window-launchers';for(const id of ids)if(byId.has(id)){grid.appendChild(byId.get(id));byId.delete(id)}section.appendChild(grid);hub.parentNode.insertBefore(section,hub)}
    // Preserve future/unrecognised launchers rather than hiding an extension.
    if(!byId.size)hub.hidden=true;
    const count=doc.querySelector('.coupled-window-hub-badge');if(count)count.textContent=cards.length+' FENSTER · BESTEHENDE BENCH';
    const map=doc.getElementById('benchMap');if(map){const drawer=doc.createElement('details');drawer.className='bench-map-drawer';const summary=doc.createElement('summary');summary.textContent='Schaltbild öffnen · Module, Bindungen und Quellen';map.parentNode.insertBefore(drawer,map);drawer.appendChild(summary);drawer.appendChild(map)}
    function revealHash(){const id=decodeURIComponent(win.location?.hash?.slice(1)||'');const target=doc.getElementById(id);if(target){for(let n=target;n;n=n.parentElement)if(n.tagName==='DETAILS')n.open=true;if(id==='benchMap')win.requestAnimationFrame?.(()=>target.scrollIntoView({block:'start'}))}}
    doc.addEventListener('click',e=>{const link=e.target.closest?.('a[href^="#"]');if(!link)return;const target=doc.getElementById(link.getAttribute('href').slice(1));for(let n=target;n;n=n.parentElement)if(n.tagName==='DETAILS')n.open=true});
    win.addEventListener?.('hashchange',revealHash);revealHash();
  }
  if(typeof module==='object'&&module.exports)module.exports={groups,arrange};else root.A0BenchPolish={groups,arrange};
})(typeof globalThis==='undefined'?this:globalThis);
