(function(root,factory){
 const api=factory(typeof module==='object'&&module.exports?require('./a0-club-crt-link.js'):root.A0ClubCRTModel,typeof module==='object'&&module.exports?require('./assets/a0-blue-body-interior-crt16-v1.js'):root.A0BlueBodyInteriorCRT16);
 if(typeof module==='object'&&module.exports)module.exports=api;
 else{root.A0CarrierReturn=api;root.A0CarrierReturnController=api.mount(root.document,root);}
})(typeof globalThis==='undefined'?this:globalThis,function(C,A){
 'use strict';
 const clone=x=>JSON.parse(JSON.stringify(x)),LIMIT=31000;
 function valid(n){if(!Number.isInteger(n)||n<0||n>LIMIT)throw Error('Träger außerhalb der Fixture-Domäne 0…31000');return n;}
 function apply(n,op){valid(n);if(op==='suffix2')return n-n%100+10*(n%10)+Math.floor(n%100/10);if(op==='shadow')return LIMIT-n;throw Error('Unbekannter Operator');}
 function factors(n){valid(n);const out=[];let x=n;for(let d=2;d*d<=x;d++)while(x%d===0){out.push(d);x/=d;}if(x>1)out.push(x);return out;}
 function inspect(n){
  valid(n);if(!C||!A)throw Error('Bestehendes CRT-Modell fehlt');
  const crt=C.carrier(n,A.MODULI),restored=BigInt(crt.quotient)*BigInt(crt.product)+BigInt(crt.reconstructed);
  if(!crt.exact||restored!==BigInt(n))throw Error('CRT-Return ungültig');
  const ghost={source:'A0_PINK_DIAMOND_GRID_ATLAS.html#ghost-tiles',side:1000,np:Math.floor(n/1000),rr:n%1000,flat:n,rule:'n=1000*NP+RR',status:'DECLARED_ADDRESS_VIEW',stateTransferred:false};
  return{n,factors:factors(n),mod125:n%125,q125:Math.floor(n/125),mod1000:n%1000,q1000:Math.floor(n/1000),crt,ghost};
 }
 function proof(pair,op){const mapped=pair.map(n=>apply(n,op)),back=mapped.map(n=>apply(n,op));return{operator:op,input:[...pair],mapped,back,residual:back.map((n,i)=>n-pair[i]),exact:back.every((n,i)=>n===pair[i]),signedDeltaBefore:pair[1]-pair[0],signedDeltaAfter:mapped[1]-mapped[0]};}
 function create(seed=11537){
  let anchor,current,history=[],lastReturn=null,error=null;
  function reset(n){if(![11537,11573].includes(n)||!C?.FAMILY.includes(n))throw Error('Unbekannte Quellenfixture');anchor=[n,n===11537?11573:11537];current=[...anchor];history=[];lastReturn=null;error=null;}
  reset(seed);
  return{reset,step(op){if(history.length>=64)throw Error('64 Schritte erreicht; erst Rückweg ausführen.');const next=current.map(n=>apply(n,op));current=next;history.push(op);lastReturn=null;},
   returnPath(){const start=[...current],ops=[...history].reverse();let back=[...start];for(const op of ops)back=back.map(n=>apply(n,op));
    lastReturn={from:start,inversePath:ops,back,residual:back.map((n,i)=>n-anchor[i]),exact:back.every((n,i)=>n===anchor[i])};
    if(!lastReturn.exact)throw Error('Rückweg weicht vom Quellenanker ab');current=back;history=[];return clone(lastReturn);},
   snapshot(){return{schema:'nexah.a0.carrier-return-ui/1',sourceMode:'LOCAL_SOURCE_FIXTURE',sourceModule:'a0-club-crt-link.js',anchor:[...anchor],current:current.map(inspect),history:[...history],signedDelta:current[1]-current[0],proofs:['suffix2','shadow'].map(op=>proof(current,op)),lastReturn:clone(lastReturn),liveClubCarrier:false,anuTransport:null,wholeMachineReturn:false,
    missing:['Live-Club-Zahlenträger wird vom bestehenden Player-Relay nicht übertragen.','Kein Transportvertrag zur ANU-Schale.','mod 125 und mod 1000 sind nicht teilerfremd; keine gemeinsame eindeutige CRT-Rekonstruktion aus diesen zwei Resten.']};}};
 }
 function mount(doc,win={}){
  const host=doc?.getElementById('registerJanusWorkbench');if(!host||doc.getElementById('carrierReturnWorkbench'))return null;
  const panel=doc.createElement('section');panel.id='carrierReturnWorkbench';panel.className='register-janus';
  panel.innerHTML='<header><small>VORHANDENER CRT-PFAD · LOKALE QUELLENFIXTURE · KEIN LIVE-CLUB-RECEIPT</small><h3>11537 ↔ 11573 · Schnitt und Rückweg</h3><p>Der vollständige Träger bleibt der Anker. Restansichten, Operatoren und Rückweg werden getrennt geprüft. Keine eigene Uhr.</p></header>'+
   '<label>Quellenanker <select id="carrierReturnSeed"><option value="11537">11537 / 11573</option><option value="11573">11573 / 11537</option></select></label>'+
   '<div class="janus-inputs"><button type="button" id="carrierSuffix">Letzte zwei Ziffern umkehren</button><button type="button" id="carrierShadow">S(n) = 31000 − n</button><button type="button" id="carrierInverse">Rückweg ausführen</button></div>'+
   '<p>Suffixregel: 11537 ↔ 11573; nicht Umkehr aller drei Endziffern. Schattenregel: Spiegelzentrum 15500. Gemischte Wege werden in umgekehrter Operatorreihenfolge zurückgeführt.</p>'+
   '<output id="carrierReturnStatus" aria-live="polite"></output><div id="carrierReturnViews" class="janus-comparisons"></div>'+
   '<h4>Jeden Operator zweimal anwenden · reine Prüfung</h4><ul id="carrierReturnProofs"></ul>'+
   '<h4>Noch nicht angebunden</h4><ul id="carrierReturnMissing"></ul>'+
   '<button type="button" id="carrierOpenPink">Pink im bestehenden Bench-Quellfenster öffnen</button><p id="carrierPinkStatus" role="status">Kein zusätzliches Quellfenster angefordert.</p>'+
   '<p><a href="DRAFTS/A0_FAMILY_NAVIGATOR_DEMO.html#control-room">Vorhandener Club / Control Room ↗</a> · <a href="a0-club-crt-link.js">Wiederverwendete CRT-Quelle</a> · <a href="A0_PINK_DIAMOND_GRID_ATLAS.html#ghost-tiles" target="_blank" rel="noopener noreferrer">Pink / Ghost Grid im Original öffnen ↗</a></p>'+
   '<p>Ghost-Adressansicht: Im Original „Ghost address field“ und „1000×1000“ wählen, dann NP/RR aus der jeweiligen Trägerkarte eintragen. Der Quellenlink überträgt keine Parameter; keine Live-Kopplung oder gemeinsame Uhr. Feldadresse ist nicht der prozedural erzeugte Zellwert. Das bestehende „−1/12“-Farbraster bezeichnet einen Anzeigeschritt, kein arithmetisches Restresultat.</p>'+
   '<details><summary>Vollständiger Return-Record</summary><pre id="carrierReturnRecord"></pre></details><p id="carrierReturnError" role="alert"></p>';
  host.after(panel);const el=id=>doc.getElementById(id);let state;
  try{state=create();}catch(e){el('carrierReturnError').textContent='HOLD · '+e.message;return null;}
  function list(id,items){el(id).replaceChildren();for(const text of items){const li=doc.createElement('li');li.textContent=text;el(id).append(li);}}
  function render(){
   const r=state.snapshot();el('carrierReturnError').textContent='';
   el('carrierReturnViews').replaceChildren();
   for(const [i,v] of r.current.entries()){
    const article=doc.createElement('article'),title=doc.createElement('h4'),out=doc.createElement('output');title.textContent='Träger '+(i+1)+' · '+v.n;
    out.textContent='Primfaktoren: '+(v.n<2?'keine':v.factors.join(' × '))+'\nmod 125 → '+v.mod125+' · q = '+v.q125+'\nmod 1000 → '+v.mod1000+' · q = '+v.q1000+'\nGhost 1000×1000: NP '+v.ghost.np+'; RR '+v.ghost.rr+' → flat '+v.ghost.flat+'\nBestehender CRT16 → '+v.crt.reconstructed+' · exakter Return '+v.crt.exact;
    article.append(title,out);el('carrierReturnViews').append(article);
   }
   const last=r.lastReturn;el('carrierReturnStatus').textContent='Quelle '+r.anchor.join(' / ')+' → '+(r.history.join(' → ')||'Identität')+' → '+r.current.map(v=>v.n).join(' / ')+'\nGerichteter Abstand: '+r.signedDelta+(last?'\nRÜCKWEG '+(last.exact?'PASS':'FAIL')+' · Residuen '+last.residual.join(' / '):'\nRückweg noch nicht ausgeführt.');
   list('carrierReturnProofs',r.proofs.map(p=>p.operator+': '+p.input.join('/')+' → '+p.mapped.join('/')+' → '+p.back.join('/')+' · '+(p.exact?'PASS':'FAIL')+' · Δ '+p.signedDeltaBefore+' → '+p.signedDeltaAfter));
   list('carrierReturnMissing',r.missing);el('carrierReturnRecord').textContent=JSON.stringify(r,null,2);el('carrierInverse').disabled=!r.history.length;return r;
  }
  function act(fn){try{fn();render();}catch(e){el('carrierReturnError').textContent='HOLD · '+e.message;}}
  el('carrierReturnSeed').addEventListener('change',()=>act(()=>state.reset(Number(el('carrierReturnSeed').value))));
  el('carrierSuffix').addEventListener('click',()=>act(()=>state.step('suffix2')));
  el('carrierShadow').addEventListener('click',()=>act(()=>state.step('shadow')));
  el('carrierInverse').addEventListener('click',()=>act(()=>state.returnPath()));
  el('carrierOpenPink').addEventListener('click',()=>{
   const status=el('carrierPinkStatus');
   try{
    const pane=win.A0BenchPerspectiveDeckView?.panes?.A;if(!pane)throw Error('Bestehendes Bench-Quellfenster nicht verfügbar; Original-Link verwenden.');
    const s=pane.snapshot();if(s.requested&&s.requested!=='pink')throw Error('Quelle A ist mit '+s.requested+' belegt. Dort ausdrücklich entladen oder Original separat öffnen.');
    if(!s.requested){pane.select('pink');pane.open();}
    const now=pane.snapshot();status.textContent=(now.documentLoaded?'Pink-Dokument geladen':'Pink-Dokument angefordert')+' · Quelle A · native Regler bedienen; kein NP/RR-Readback und keine Parameterübertragung.';
    doc.getElementById('benchPerspectiveDeck')?.scrollIntoView?.({block:'start'});
   }catch(e){status.textContent='HOLD · '+e.message;}
  });
  render();return{snapshot:()=>state.snapshot(),render};
 }
 return{apply,factors,inspect,proof,create,mount};
});
