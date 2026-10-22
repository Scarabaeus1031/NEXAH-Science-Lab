/* Existing ordinal CRT16 adapter + separate bounded integer CRT readout.
   Prime labels are not Q4 topology; the player's address does not encode n. */
(function(root,factory){
 const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;
 else{root.A0ClubCRTModel=api;root.A0ClubCRTLink=api.mount(document,root);}
})(typeof globalThis==='undefined'?this:globalThis,function(){
 'use strict';
 const FAMILY=Object.freeze([10537,11357,11537,11573,11735,12537,13571,13573,14357]);
 const mod=(n,m)=>(n%m+m)%m;
 function inverse(a,m){
  let r0=m,r1=mod(a,m),s0=0n,s1=1n;
  while(r1){const q=r0/r1;[r0,r1]=[r1,r0-q*r1];[s0,s1]=[s1,s0-q*s1];}
  if(r0!==1n)throw Error('Non-coprime CRT channels');
  return mod(s0,m);
 }
 function reconstruct(residues,moduli){
  if(!Array.isArray(residues)||!Array.isArray(moduli)||!moduli.length||residues.length!==moduli.length)throw Error('Incomplete CRT tuple');
  if(moduli.some(m=>typeof m!=='bigint'||m<2n))throw Error('Invalid CRT moduli');
  const product=moduli.reduce((a,m)=>a*m,1n);let total=0n;
  moduli.forEach((m,i)=>{const r=residues[i];if(typeof r!=='bigint'||r<0n||r>=m)throw Error('Invalid CRT residue');
   const partial=product/m;total+=r*partial*inverse(partial,m);});
  return{value:mod(total,product),product};
 }
 function carrier(n,moduli){
  if(!Number.isSafeInteger(n)||n<0)throw Error('Invalid carrier');
  const original=BigInt(n),mods=moduli.map(BigInt),residues=mods.map(m=>original%m),r=reconstruct(residues,mods);
  const quotient=original/r.product;
  return{n,moduli:[...moduli],residues:residues.map(String),reconstructed:String(r.value),product:String(r.product),quotient:String(quotient),
   exact:quotient*r.product+r.value===original,principal:quotient===0n};
 }
 function address(s,adapter){
  if(!s||s.plate!=='tessarec'||!Number.isInteger(s.q4Address)||s.q4Address<0||s.q4Address>15||
   !(s.layer===null||Number.isInteger(s.layer)&&s.layer>=0&&s.layer<3))return null;
  if(s.q4Bits!==s.q4Address.toString(2).padStart(4,'0'))return null;
  const channel=adapter.inverseRingGray(s.q4Address),layers=s.layer===null?[0,1,2]:[s.layer];
  const records=layers.map(layer=>adapter.bind(layer,channel));
  const returns=records.map(record=>{
   const f=adapter.frame(record.layer,channel,0,1);
   const viewKeys=adapter.VIEWS.map(view=>f.projections[view].find(p=>p.selected)?.sourceKey);
   return adapter.receipt({sourceKey:record.sourceKey,viewKeys,witness:true});
  });
  return{channel,modulus:adapter.MODULI[channel],layer:s.layer,keys:records.map(r=>r.sourceKey),
   status:s.layer===null?'LAYER_OPEN':returns.every(r=>r.status==='PASS_EXACT_ADDRESS_RETURN')?'MATCH':'HOLD'};
 }
 function mount(doc,win){
  const host=doc.getElementById('clubCRTLink'),adapter=win.A0BlueBodyInteriorCRT16;
  if(!host||!adapter)return null;
  const select=doc.getElementById('clubCRTCarrier'),field=doc.getElementById('clubCRTChannels'),
   connection=doc.getElementById('clubCRTAddress'),result=doc.getElementById('clubCRTResult');
  let latest=null,n=11537,report=null;
  const sequence=win.A0ClubCarrierSequence&&win.A0GameOfNumbers?win.A0ClubCarrierSequence.createSequence(win.A0GameOfNumbers):null;
  const rule=doc.getElementById('clubCarrierRule'),follow=doc.getElementById('clubCarrierFollow'),loop=doc.getElementById('clubCarrierLoop'),trace=doc.getElementById('clubCarrierTrace');
  for(const value of FAMILY){const o=doc.createElement('option');o.value=String(value);o.textContent=String(value);select.append(o);}
  select.value=String(n);
  const familyField=doc.getElementById('clubCarrierFamily'),familyCells=familyField?FAMILY.map(seed=>{
   const b=doc.createElement('button');b.type='button';b.addEventListener('click',()=>{sequence?.seed(seed);draw();});familyField.append(b);return b;
  }):[];
  const cells=adapter.MODULI.map((m,channel)=>{
   const b=doc.createElement('button');b.type='button';b.dataset.channel=String(channel);
   b.addEventListener('click',()=>{
    if(!latest)return;
    win.A0ClubReturnMonitor?.choose(adapter.ringGray(channel),latest.layer);
   });field.append(b);return b;
  });
  function draw(){
   const seq=sequence?.snapshot();if(seq){n=seq.n;select.value=String(seq.seed);select.disabled=seq.mode==='carrier';
    if(rule)rule.value=seq.mode;if(follow){follow.textContent=seq.following?'● Mit Platte':'○ Manuell';follow.setAttribute('aria-pressed',String(seq.following));}
    if(loop)loop.setAttribute('aria-pressed',String(seq.loop));
    if(trace)trace.textContent=(seq.mode==='carrier'?'11537 → 11573 → 11357':seq.mode==='elevator'?'Neun Träger · +20 je Schritt':'Fester Zahlenträger')+' · Schritt '+seq.index+'/'+seq.limit+' · n='+seq.n+' = 20×'+seq.coordinate.q+'+'+seq.coordinate.r+(!seq.following?' · Handbetrieb':'')+(seq.ended?' · Ende erreicht'+(seq.loop?' · Loop schaltet zum Start zurück':' · hält; Reset oder Loop wählen'):'')+(seq.cycles?' · Wiederholungen '+seq.cycles:'');
    if(familyField){familyField.hidden=seq.mode!=='elevator';seq.family.forEach((c,i)=>{familyCells[i].textContent=c.decimal+' · ('+c.q+','+c.r+')';familyCells[i].setAttribute('aria-pressed',String(c.seed===String(seq.seed)));});}
   }
   const c=carrier(n,adapter.MODULI),a=address(latest,adapter);
   cells.forEach((b,i)=>{
    b.textContent=adapter.MODULI[i]+' : '+c.residues[i];b.disabled=!a;
    b.setAttribute('aria-pressed',String(!!a&&i===a.channel));
    b.title='Kanal '+(i+1)+' · '+n+' mod '+adapter.MODULI[i]+' = '+c.residues[i]+' · Q4 '+adapter.ringGray(i).toString(2).padStart(4,'0');
   });
   connection.textContent=a?'Q4 '+latest.q4Bits+' ↔ Kanal '+(a.channel+1)+' · m='+a.modulus+' · '+a.keys.join(' / ')+(a.layer===null?' · Lage wählen':' · Adapter '+a.status):'CRT16 wartet auf die Player-Adresse';
   result.textContent=(c.exact?'CRT MATCH':'CRT HOLD')+' · '+n+' → 16 Reste → '+c.reconstructed+' (mod M) · q_M='+c.quotient;
   report={address:a,carrier:c,...(seq?{sequence:seq}:{})};
   win.A0ClubControlRoom?.observe(report);
  }
  select.addEventListener('change',()=>{const next=Number(select.value);if(FAMILY.includes(next)){if(sequence)sequence.seed(next);else n=next;draw();}});
  rule?.addEventListener('change',()=>{sequence?.mode(rule.value);draw();if(rule.value==='manual'){const details=doc.getElementById('clubPlayerDetails');if(details)details.open=true;select.focus?.({preventScroll:true});}});
  follow?.addEventListener('click',()=>{if(sequence)sequence.follow(!sequence.snapshot().following);draw();});
  loop?.addEventListener('click',()=>{if(sequence)sequence.loop(!sequence.snapshot().loop);draw();});
  doc.getElementById('clubCarrierReset')?.addEventListener('click',()=>{sequence?.reset();draw();});
  doc.getElementById('clubCarrierStep')?.addEventListener('click',()=>{sequence?.step();draw();});
  draw();
  return{observe(s,running){latest=s;sequence?.observe(s,running);draw();},selectSeed(seed){if(!sequence||!FAMILY.includes(Number(seed)))return false;sequence.seed(Number(seed));draw();return true;},snapshot:()=>JSON.parse(JSON.stringify(report))};
 }
 return{FAMILY,inverse,reconstruct,carrier,address,mount};
});
