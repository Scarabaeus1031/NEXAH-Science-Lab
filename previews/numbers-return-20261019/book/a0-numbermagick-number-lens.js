/* Bounded exact-number teaching lens, not a universal symbolic engine. */
(function(root){
  'use strict';
  const abs=n=>n<0n?-n:n;
  function rational(n,d=1n){if(d===0n)throw Error('Nenner darf nicht 0 sein.');if(d<0n){n=-n;d=-d}let a=abs(n),b=d;while(b){const t=a%b;a=b;b=t}return{kind:'rational',n:String(n/(a||1n)),d:String(d/(a||1n))}}
  function parse(text){
    const s=String(text).trim().replace(',','.');if(s.length>32)throw Error('Eingabe zu lang.');
    if(['√2','sqrt2','sqrt(2)','+√2'].includes(s))return{kind:'sqrt2',sign:1};
    if(['-√2','-sqrt2','-sqrt(2)'].includes(s))return{kind:'sqrt2',sign:-1};
    let match=s.match(/^([+-]?\d+)(?:\/([+-]?\d+))?$/),n,d;
    if(match){n=BigInt(match[1]);d=BigInt(match[2]||1)}
    else{match=s.match(/^([+-]?)(\d+)\.(\d{1,6})$/);if(!match)throw Error('Erlaubt: ganze Zahl, p/q, Dezimalzahl (bis 6 Stellen), ±√2.');d=10n**BigInt(match[3].length);n=BigInt(match[2]+match[3])*(match[1]==='-'?-1n:1n)}
    if(abs(n)>1000000n||abs(d)>1000000n)throw Error('Grenze: |Zähler| und |Nenner| ≤ 1.000.000.');return rational(n,d);
  }
  const zero=c=>c.kind==='rational'&&c.n==='0';
  const integer=c=>c.kind==='rational'&&c.d==='1';
  const negative=c=>c.kind==='sqrt2'?c.sign<0:BigInt(c.n)<0n;
  const negate=c=>c.kind==='sqrt2'?{kind:'sqrt2',sign:-c.sign}:rational(-BigInt(c.n),BigInt(c.d));
  const text=c=>c.kind==='sqrt2'?(c.sign<0?'-':'')+'√2':c.n+(c.d==='1'?'':'/'+c.d);
  const approximate=c=>c.kind==='sqrt2'?c.sign*Math.sqrt(2):Number(c.n)/Number(c.d);
  const number=(re,im='0')=>({re:parse(re),im:parse(im)});
  const key=z=>JSON.stringify(z);
  const label=z=>text(z.re)+(negative(z.im)?' − ':' + ')+text(negative(z.im)?negate(z.im):z.im)+'i';
  function isPrime(n){if(n<2n)return false;for(let p=2n;p*p<=n;p++)if(n%p===0n)return false;return true}
  function membership(z){const real=zero(z.im),int=real&&integer(z.re),nat=int&&BigInt(z.re.n)>=0n;return{N0:nat,Z:int,Q:real&&z.re.kind==='rational',R:real,C:true,P:nat&&isPrime(BigInt(z.re.n))}}
  function grid(z){if(!membership(z).Z)return null;const n=BigInt(z.re.n),mod=(a,m)=>(a%m+m)%m,a=mod(n,7n),b=mod(n,11n),r=mod(22n*a+56n*b,77n);return{a:Number(a),b:Number(b),r:String(r),q:String((n-r)/77n)}}
  function reconstruct(address){return String(BigInt(address.r)+77n*BigInt(address.q))}
  const rotate=z=>({re:negate(z.im),im:{...z.re}});
  function fibonacci(index){if(!Number.isInteger(index)||index<0||index>30)throw Error('Fibonacci-Demo: k=0..30.');let a=0n,b=1n;for(let i=0;i<index;i++)[a,b]=[b,a+b];return String(a)}
  const api={rational,parse,number,text,approximate,key,label,membership,isPrime,grid,reconstruct,rotate,fibonacci};
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.A0NumbermagickNumberLensModel=api;
  if(!root.document)return;
  const host=document.getElementById('number-shell-lens');if(!host)return;
  const el=id=>document.getElementById(id),primitives=root.A0SpatialReaderPrimitives;
  if(!primitives){el('numberLensError').textContent='Lesespur-Baustein fehlt. Bestehende Numbermagick-Instrumente bleiben verfügbar.';return}
  let state={z:number('7'),view:'complex',fib:0,gridKey:true,sideA:{z:number('7'),view:'complex'},channel:'START · beide Seiten zeigen 7'},anchor=JSON.parse(JSON.stringify(state)),trail=primitives.createTrail(state),last='START · Zahl 7, keine Rechenoperation.';
  const clone=x=>JSON.parse(JSON.stringify(x));
  const presets=[['7','0'],['0','0'],['-3','0'],['1/2','0'],['√2','0'],['0','1'],['3','4'],['237','0'],['314','0']];
  presets.forEach(([re,im])=>{const button=document.createElement('button');button.type='button';button.textContent=label(number(re,im));button.onclick=()=>commit({z:number(re,im)},'QUELLWAHL · neue Zahl gewählt.');el('numberLensPresets').append(button)});
  function commit(next,note){state={...state,sideA:{z:clone(state.z),view:state.view},channel:note,...next};last=note;trail.push(state);el('numberLensReturnResult').textContent='';render()}
  const point=(x,y,caption,color='#ffca55')=>'<circle cx="'+x+'" cy="'+y+'" r="6" fill="'+color+'"/><text x="'+(x+10)+'" y="'+(y-10)+'" fill="currentColor" font-size="11">'+caption+'</text>';
  function lineView(){
    const x=approximate(state.z.re),extent=Math.max(8,Math.abs(x)*1.2),sx=180+x/extent*140,real=membership(state.z).R;
    return '<svg viewBox="0 0 360 300" role="img" aria-label="Zahlenlinie: '+(real?'exakte reelle Zahl, Position gerundet':'nur Projektion auf den Realteil')+'"><line x1="30" y1="150" x2="330" y2="150" stroke="currentColor"/><text x="175" y="175" fill="currentColor">0</text><text x="310" y="175" fill="currentColor">ℝ</text><text x="40" y="205" fill="currentColor" font-size="11">−'+extent.toPrecision(3)+'</text><text x="280" y="205" fill="currentColor" font-size="11">+'+extent.toPrecision(3)+'</text>'+point(sx,150,real?text(state.z.re):'Re(z) = '+text(state.z.re),real?'#ffca55':'#ed72aa')+'</svg><p>'+(real?'Die Zahl liegt auf ℝ. Pixelposition gerundet; der exakte Record bleibt erhalten.':'Keine exakte Einbettung dieser nichtreellen Zahl in ℝ: angezeigt wird Re(z). Der Imaginärteil geht in dieser Projektion verloren.')+'</p>';
  }
  function gridView(){
    const g=grid(state.z);if(!g)return '<p class="nl-unbound">NICHT ANWENDBAR: Das gewählte 7×11-Restgrid ist nur für ganze reelle Zahlen definiert. Keine Rundung oder erzwungene Zellzuweisung.</p>';
    let svg='<svg viewBox="0 0 360 300" role="img" aria-label="Grid: Zeile n modulo 7, Spalte n modulo 11">';
    for(let a=0;a<7;a++)for(let b=0;b<11;b++)svg+='<rect x="'+(28+b*27)+'" y="'+(35+a*27)+'" width="24" height="24" fill="'+(a===g.a&&b===g.b?'#ffca55':'#12303f')+'" stroke="#3a6073"/>';
    svg+='<text x="28" y="260" fill="currentColor" font-size="12">Zeile '+g.a+' · Spalte '+g.b+' · r = '+g.r+'</text></svg>';
    return svg+'<p>Adresse: (n mod 7, n mod 11). CRT: r=(22a+56b) mod 77. '+(el('numberLensKey').checked?'Rückschlüssel q='+g.q+': n='+g.r+'+77·('+g.q+').':'Ohne q: n='+g.r+'+77k, k∈ℤ. Unendlich viele kompatible Zahlen; der Quellrecord wird nicht gelöscht.')+'</p>';
  }
  function complexView(){
    const x=approximate(state.z.re),y=approximate(state.z.im),radius=Math.hypot(x,y),extent=Math.max(2,radius*1.2),px=180+x/extent*112,py=150-y/extent*112;
    let svg='<svg viewBox="0 0 360 300" role="img" aria-label="Komplexe Ebene mit Betragsschalen und exaktem Zahlenlabel"><g fill="none" stroke="#36586b">';
    for(const fraction of [1/3,2/3,1])svg+='<circle cx="180" cy="150" r="'+(112*fraction)+'"/>';
    svg+='</g><path d="M35 150H325M180 25V275" stroke="currentColor" opacity=".5"/><text x="305" y="170" fill="currentColor">Re</text><text x="190" y="30" fill="currentColor">Im</text><line x1="180" y1="150" x2="'+px+'" y2="'+py+'" stroke="#54d7ef" stroke-width="2"/>'+point(px,py,label(state.z))+'</svg>';
    return svg+'<p>|z| ≈ '+radius.toPrecision(6)+'. Kreisradien: '+[1/3,2/3,1].map(f=>(extent*f).toPrecision(3)).join(' / ')+'. Das sind Betragsschalen, keine Zahlenmengen. Koordinaten gerundet, Symbolrecord exakt.</p>';
  }
  function render(){
    el('numberLensKey').checked=state.gridKey;
    const m=membership(state.z);el('numberLensRe').value=text(state.z.re);el('numberLensIm').value=text(state.z.im);el('numberLensIdentity').textContent='DU BIST HIER · z = '+label(state.z);
    el('numberLensSideA').textContent=label(state.sideA.z)+' · θ_view = '+state.sideA.view;
    el('numberLensSideB').textContent=label(state.z)+' · θ_view = '+state.view;
    el('numberLensChannel').textContent='n_Kanal · '+state.channel;
    el('numberLensMembership').replaceChildren();
    for(const [id,name] of [['N0','ℕ₀'],['Z','ℤ'],['Q','ℚ'],['R','ℝ'],['C','ℂ'],['P','ℙ ⊂ ℕ₀']]){const badge=document.createElement('span');badge.className=m[id]?'nl-member':'nl-not-member';badge.textContent=name+' · '+(m[id]?'ja':'nein');el('numberLensMembership').append(badge)}
    el('numberLensLine').innerHTML=lineView();el('numberLensGrid').innerHTML=gridView();el('numberLensComplex').innerHTML=complexView();
    for(const view of ['line','grid','complex']){el('numberLensView'+view).setAttribute('aria-pressed',String(state.view===view));el('numberLensCard'+view).dataset.active=String(state.view===view)}
    el('numberLensLedger').textContent=last+' · Leseschritt '+(trail.cursor+1)+'/'+trail.length+'. VIEW erhält z; OPERATOR verändert z; Grid-Rekonstruktion braucht q.';
    el('numberLensFibReadout').textContent='F'+state.fib+' = '+fibonacci(state.fib)+' · Startwerte F0=0, F1=1; (a,b) → (b,a+b).';
    el('numberLensFib').disabled=state.fib>=30;el('numberLensPrevious').disabled=trail.cursor===0;el('numberLensNext').disabled=trail.cursor===trail.length-1;
    el('numberLensError').textContent='';
  }
  el('numberLensApply').onclick=()=>{try{commit({z:number(el('numberLensRe').value,el('numberLensIm').value)},'QUELLWAHL · exakte Eingabe übernommen.')}catch(error){el('numberLensError').textContent=error.message}};
  for(const id of ['numberLensRe','numberLensIm'])el(id).onkeydown=event=>{if(event.key==='Enter'){event.preventDefault();el('numberLensApply').onclick()}};
  for(const view of ['line','grid','complex'])el('numberLensView'+view).onclick=()=>commit({view},'VIEW · '+view+' gewählt; Zahl unverändert.');
  el('numberLensKey').onchange=()=>{commit({gridKey:el('numberLensKey').checked},'VIEW · Rückschlüssel-Anzeige geändert; Quellzahl unverändert.');el('numberLensReturnResult').textContent='';};
  el('numberLensGridReturn').onclick=()=>{const g=grid(state.z);el('numberLensReturnResult').textContent=!g?'NICHT ANWENDBAR · kein ganzzahliger Grid-Eingang.':!el('numberLensKey').checked?'UNBESTIMMT · Grid allein bestimmt nur n='+g.r+'+77k.':reconstruct(g)===state.z.re.n?'PASS · aus Restadresse und q exakt rekonstruiert: '+reconstruct(g):'DIFFERENCE · Rekonstruktion prüfen.'};
  el('numberLensEuler').onclick=()=>commit({z:rotate(state.z)},'OPERATOR · Euler: ×i = Vierteldrehung; (a+bi)i = −b+ai. Neue Zahl, gleicher Betrag.');
  el('numberLensFib').onclick=()=>{if(state.fib>=30)return;const index=state.fib+1;commit({fib:index,z:number(fibonacci(index))},'OPERATOR · nächstes Fibonacci-Beispiel aus den festen Startwerten übernommen; keine Ableitung aus der zuvor gewählten Zahl.')};
  el('numberLensAnchor').onclick=()=>{anchor=clone(state);el('numberLensReturnResult').textContent='Anker gesetzt · '+label(state.z)};
  el('numberLensReturn').onclick=()=>{const expected=clone(anchor);commit(expected,'RETURN · erfasster Zahlenrecord und Ansicht wiederhergestellt.');el('numberLensReturnResult').textContent=JSON.stringify(state)===JSON.stringify(expected)?'PASS · vollständiger Ankerzustand wiederhergestellt.':'DIFFERENCE · Anker prüfen.'};
  for(const [id,delta] of [['numberLensPrevious',-1],['numberLensNext',1]])el(id).onclick=()=>{state=trail.move(delta);last='LESESPUR · gespeicherter Zustand wiederhergestellt.';el('numberLensReturnResult').textContent='';render()};
  render();root.A0NumbermagickNumberLens={snapshot:()=>clone(state),select:(re,im='0')=>commit({z:number(re,im)},'QUELLWAHL · API'),trail};
})(typeof window==='undefined'?globalThis:window);
