(function(root,factory){
 'use strict';
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 else{root.A0RegisterJanus=api;root.A0RegisterJanusController=api.mount(root.document);}
})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 function integer(value,min,max){
  if(!/^\d+$/.test(String(value)))throw Error('Bitte eine ganze Zahl eingeben.');
  const n=Number(value);if(!Number.isSafeInteger(n)||n<min||n>max)throw Error('Erlaubter Bereich: '+min+' bis '+max+'.');return n;
 }
 function group(value,size){return BigInt(value).toString().replace(new RegExp('\\B(?=(\\d{'+size+'})+(?!\\d))','g'),'│');}
 function parseGroup(text,size){
  const parts=String(text).split('│');
  if(!new RegExp('^[1-9]\\d{0,'+(size-1)+'}$').test(parts[0])||parts.slice(1).some(p=>!new RegExp('^\\d{'+size+'}$').test(p)))throw Error('Ungültige Gruppierung');
  return BigInt(parts.join(''));
 }
 function model(multiplier='1',base='2',inner='3',outer='2',side='204'){
  const m=integer(multiplier,1,9);if(m!==1&&m!==9)throw Error('Nur die beiden Bildwerte 1 und 9.');
  const a=integer(base,2,10),b=integer(inner,1,6),c=integer(outer,1,3),n=integer(side,1,512);
  const value=BigInt(m)*10n**12n,left=(BigInt(a)**BigInt(b))**BigInt(c),right=BigInt(a)**(BigInt(b)**BigInt(c));
  const three=group(value,3),four=group(value,4);
  return{schema:'nexah.a0.register-janus-ui/1',value:String(value),
   registers:[{label:'DE · lange Skala',name:m+' '+(m===1?'Billion':'Billionen'),digits:three},
    {label:'US · short scale',name:m+' trillion',digits:three},
    {label:'中文 · Vierergruppen',name:m===1?'一万亿':'九万亿',digits:four}],
   registerReturn:parseGroup(three,3)===value&&parseGroup(four,4)===value,
   power:{base:a,inner:b,outer:c,left:String(left),right:String(right),difference:String(right-left),
    ratio:right%left===0n?String(right/left)+':1':String(right)+':'+String(left),equal:left===right},
   field:{side:n,places:String(BigInt(n)**2n),physicalA0Mapping:null},
   imageCheck:{first:String(parseGroup('1│0000│0000│0000',4)),second:String(parseGroup('1│0000│0000',4)),secondMatchesTrillion:false},
   sourceTransport:false,anuAssignment:null,marillionValue:null};
 }
 function checks(){
  const r=model(),nine=model('9'),out=[
   ['Drei Register → gleicher Ganzzahlwert',r.registerReturn&&nine.registerReturn],
   ['2^(3²) = 512',r.power.right==='512'],
   ['(2³)² = 64',r.power.left==='64'],
   ['Verhältnis 512 : 64 = 8 : 1',r.power.ratio==='8:1'],
   ['204 × 204 = 41 616',r.field.places==='41616'],
   ['Zweites Bild: 1│0000│0000 = 10^8, nicht 10^12',r.imageCheck.second==='100000000'&&!r.imageCheck.secondMatchesTrillion],
   ['Keine automatische ANU-Zuordnung',r.anuAssignment===null&&!r.sourceTransport]
  ];return out.map(([label,pass])=>({label,pass}));
 }
 function mount(doc){
  const host=doc?.getElementById('anuTowerWorkbench');if(!host)return null;
  if(doc.getElementById('registerJanusWorkbench'))return null;
  const css=doc.createElement('link');css.rel='stylesheet';css.href='a0-register-janus.css?v=20261022';doc.head.append(css);
  const panel=doc.createElement('section');panel.id='registerJanusWorkbench';panel.className='register-janus';
  panel.innerHTML='<header><small>JANUS · EXAKTER REGISTER- UND KLAMMERTEST</small><h3>Ein Wert. Drei Register.</h3><p>Darstellung wechseln hält den Wert. Klammern wechseln kann den Wert ändern.</p></header>'+
   '<label>Bildwert <select id="janusValue"><option value="1">10¹²</option><option value="9">9 × 10¹²</option></select></label>'+
   '<div id="janusRegisters" class="janus-registers"></div>'+
   '<p id="janusReturn" role="status" aria-live="polite"></p>'+
   '<details><summary>Die zwei gelieferten Bilder vergleichen</summary><p>Bild 1: 1│0000│0000│0000 = 10¹². Bild 2: 1│0000│0000 = 10⁸. Im zweiten Bild fehlt oben eine Vierergruppe; die mittige Angabe 10¹² passt dazu nicht.</p></details>'+
   '<div class="janus-comparisons"><article><h4>Klammerlabor</h4><div class="janus-inputs">'+
   '<label>Basis a <input id="janusBase" type="number" min="2" max="10" step="1" value="2"></label>'+
   '<label>Exponent b <input id="janusInner" type="number" min="1" max="6" step="1" value="3"></label>'+
   '<label>Exponent c <input id="janusOuter" type="number" min="1" max="3" step="1" value="2"></label></div>'+
   '<p>a^(b^c) gegenüber (a^b)^c · Potenztürme werden rechts geklammert.</p><output id="janusPowers"></output></article>'+
   '<article><h4>Endliches Quadratfeld</h4><label>Seitenlänge in Positionen <input id="janusSide" type="number" min="1" max="512" step="1" value="204"></label>'+
   '<div id="janusField"></div><p id="janusFieldReadout"></p><p>Positionenmodell, keine festgelegte Auflösung des physischen A0-Blatts.</p></article></div>'+
   '<p id="janusError" role="alert"></p><button id="janusTest" type="button">Referenztests prüfen</button><ul id="janusChecks"></ul>'+
   '<p>Lokales Rechen- und Darstellungsfeld · keine eigene Uhr, kein Core-/ANU-Transport. „Marillion“ bleibt ein Name ohne festgelegten Zahlenwert.</p>'+
   '<details><summary>Exakter aktueller Record</summary><pre id="janusRecord"></pre></details>';
  host.after(panel);const el=id=>doc.getElementById(id);let current=null;
  function render(){
   try{
    const r=model(el('janusValue').value,el('janusBase').value,el('janusInner').value,el('janusOuter').value,el('janusSide').value);
    current=r;el('janusError').textContent='';el('janusRegisters').replaceChildren();
    for(const register of r.registers){const article=doc.createElement('article'),title=doc.createElement('h4'),name=doc.createElement('p'),digits=doc.createElement('code');title.textContent=register.label;name.textContent=register.name;digits.textContent=register.digits;article.append(title,name,digits);el('janusRegisters').append(article);}
    el('janusReturn').textContent='REGISTER-RETURN '+(r.registerReturn?'PASS':'FAIL')+' · exakter Wert '+r.value+' bleibt erhalten.';
    const p=r.power;
    el('janusPowers').textContent=p.base+'^('+p.inner+'^'+p.outer+') = '+p.right+'\n('+p.base+'^'+p.inner+')^'+p.outer+' = '+p.left+'\nVerhältnis rechts : links = '+p.ratio+' · Differenz = '+p.difference+' · '+(p.equal?'gleicher Wert':'verschiedene Werte');
    el('janusField').innerHTML='<svg viewBox="0 0 204 204" role="img" aria-label="Quadratfeld mit '+r.field.side+' mal '+r.field.side+' Positionen"><defs><pattern id="janusGrid" width="'+204/r.field.side+'" height="'+204/r.field.side+'" patternUnits="userSpaceOnUse"><path d="M0 '+204/r.field.side+'V0H'+204/r.field.side+'" fill="none" stroke="#43d9df" stroke-width=".18"/></pattern></defs><rect x="0" y="0" width="204" height="204" fill="url(#janusGrid)" stroke="#ffca65" stroke-width="1"/></svg>';
    el('janusFieldReadout').textContent=r.field.side+' × '+r.field.side+' = '+r.field.places+' Positionen · endliches Feld';
    el('janusRecord').textContent=JSON.stringify(r,null,2);return r;
   }catch(error){
    current=null;el('janusError').textContent=error.message;el('janusReturn').textContent='HOLD · Eingaben korrigieren; keine gültige aktuelle Rechnung.';
    el('janusRegisters').replaceChildren();el('janusPowers').textContent='';el('janusField').innerHTML='';el('janusFieldReadout').textContent='';el('janusRecord').textContent='null';return null;
   }
  }
  for(const id of ['janusValue','janusBase','janusInner','janusOuter','janusSide'])el(id).addEventListener('input',render);
  function test(){el('janusChecks').replaceChildren();for(const check of checks()){const li=doc.createElement('li');li.textContent=(check.pass?'PASS · ':'FAIL · ')+check.label;el('janusChecks').append(li);}}
  el('janusTest').addEventListener('click',test);render();test();
  return{render,snapshot:()=>current?JSON.parse(JSON.stringify(current)):null};
 }
 return{model,group,parseGroup,checks,mount};
});
