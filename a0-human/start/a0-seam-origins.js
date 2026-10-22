(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else {root.A0SeamOrigins=api;api.mount(document);}
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const paths=Object.freeze([
    Object.freeze({id:'B',pair:Object.freeze([-1,-1]),color:'#4bdcff',label:'Blau · gleichgerichtet −'}),
    Object.freeze({id:'PA',pair:Object.freeze([-1,1]),color:'#f36be7',label:'Pink A · − / +'}),
    Object.freeze({id:'PB',pair:Object.freeze([1,-1]),color:'#b890ff',label:'Pink B · + / −'}),
    Object.freeze({id:'Y',pair:Object.freeze([1,1]),color:'#ffd36b',label:'Gelb · gleichgerichtet +'})
  ]);
  function value(p,projection){const q=p.pair[0]+p.pair[1];return projection==='abs'?Math.abs(q):q;}
  function record(id,projection='sum',keep=true){
    const p=paths.find(x=>x.id===id);
    if(!p||!['sum','abs'].includes(projection)||typeof keep!=='boolean')throw Error('invalid seam view');
    return Object.freeze({projection,value:value(p,projection),...(keep?{origin:p.id}:{})});
  }
  function recover(r){
    if(!r||!['sum','abs'].includes(r.projection)||!Number.isFinite(r.value))throw Error('invalid record');
    return paths.filter(p=>value(p,r.projection)===r.value&&(!Object.hasOwn(r,'origin')||p.id===r.origin)).map(p=>p.id);
  }
  function drawing(projection,keep,id){
    const current=record(id,projection,keep),groups=projection==='sum'?[-2,0,2]:[0,2];
    let svg='<svg viewBox="0 0 800 270" role="img" aria-label="Vier geordnete Pfade und ihre Projektionsfasern"><title>Herkunft bleibt nur mit unabhängig mitgeführtem Key rekonstruierbar</title>';
    paths.forEach((p,i)=>{
      const y=45+i*57,g=groups.indexOf(value(p,projection)),out=groups.length===3?55+g*80:95+g*80;
      const match=current.value===value(p,projection),active=keep?p.id===id:match;
      svg+='<path d="M 245 '+y+' C 380 '+y+',400 '+out+',535 '+out+'" fill="none" stroke="'+(keep?p.color:'#95a9b8')+'" stroke-width="'+(active?4:1.5)+'" opacity="'+(active?'.9':'.25')+'"'+(p.id==='PB'?' stroke-dasharray="7 5"':'')+'/>';
      svg+='<text x="12" y="'+(y+5)+'" fill="'+p.color+'" font-size="16">'+p.id+' · ('+p.pair.map(n=>n>0?'+'+n:n).join(', ')+')</text>';
    });
    groups.forEach((q,i)=>{
      const y=groups.length===3?55+i*80:95+i*80,members=paths.filter(p=>value(p,projection)===q);
      const countColor=keep?(members.length===1?members[0].color:'#f36be7'):'#edf6fc';
      svg+='<circle cx="550" cy="'+y+'" r="22" fill="#102b3c" stroke="'+(current.value===q?'#ffd36b':'#61788a')+'"/><text x="550" y="'+(y+6)+'" text-anchor="middle" fill="#edf6fc" font-size="18">'+q+'</text><text x="590" y="'+(y+5)+'" fill="'+countColor+'" font-size="16">'+members.length+' Urbild'+(members.length===1?'':'er')+(keep?' · '+members.map(p=>p.id).join(' / '):' · Herkunft verborgen')+'</text>';
    });
    return svg+'</svg>';
  }
  function digitGroups(digits,width){
    if(typeof digits!=='string'||!/^(0|[1-9][0-9]{0,59})$/.test(digits)||![3,4].includes(width))throw Error('invalid digit grouping');
    const parts=[];for(let i=digits.length;i>0;i-=width)parts.unshift(digits.slice(Math.max(0,i-width),i));
    return{digits,width,parts,display:parts.join(' | '),value:BigInt(digits).toString()};
  }
  function powers(a,b,c){
    if(!Number.isInteger(a)||a<2||a>9||![b,c].every(x=>Number.isInteger(x)&&x>=1&&x<=4))throw Error('bounded integer powers only');
    const left=BigInt(a)**BigInt(b*c),right=BigInt(a)**(BigInt(b)**BigInt(c));
    return{a,b,c,left:left.toString(),right:right.toString(),same:left===right,leftExponent:b*c,rightExponent:(BigInt(b)**BigInt(c)).toString()};
  }
  const structures=Object.freeze([
    Object.freeze({notation:'{a, b}',tree:['a','b']}),
    Object.freeze({notation:'{{a}, {b}}',tree:[['a'],['b']]}),
    Object.freeze({notation:'{{a, b}}',tree:[['a','b']]})
  ]);
  function structure(index){
    if(!Number.isInteger(index)||index<0||index>=structures.length)throw Error('invalid nesting');
    const {notation,tree}=structures[index],depth=t=>Array.isArray(t)?1+Math.max(0,...t.map(depth)):0,leaves=t=>Array.isArray(t)?t.flatMap(leaves):[t];
    return{notation,outerCardinality:tree.length,depth:depth(tree),leaves:leaves(tree)};
  }
  function grammarMarkup(){
    const opts=(min,max,current)=>Array.from({length:max-min+1},(_,i)=>'<option'+(i+min===current?' selected':'')+'>'+String(i+min)+'</option>').join('');
    return '<section class="seam-grammar" aria-label="Register, Rechenklammern und Verschachtelung"><h3>Gleiche Zeichen · andere Gruppierung?</h3><p>Drei getrennte Operatoren. Eine Farbe bezeichnet Herkunft, ein Trennstrich einen Leseblock und eine Rechenklammer einen Auswertungsschritt.</p><div class="seam-grammar-grid"><article><h4>01 · Register / Ziffernblöcke</h4><label>Ganzzahl <select data-seam="digits"><option value="1000000000000">10¹²</option><option value="9000000000000">9 × 10¹²</option><option value="100000000">10⁸</option><option value="12321">12321</option></select></label><label>Blockbreite <select data-seam="width"><option value="3">3 · Dreierblöcke</option><option value="4">4 · Viererblöcke</option></select></label><output data-seam="grouped"></output><p data-seam="groupStatus" role="status" aria-live="polite"></p><small>DE Billion / US trillion / 中文 万亿 bezeichnen hier 10¹². Gruppierung ist kein Basiswechsel und kein neuer Zustand.</small></article><article><h4>02 · Rechenklammern</h4><div class="seam-controls"><label>a <select data-seam="base">'+opts(2,9,2)+'</select></label><label>b <select data-seam="powerB">'+opts(1,4,3)+'</select></label><label>c <select data-seam="powerC">'+opts(1,4,3)+'</select></label></div><output data-seam="powerLeft"></output><output data-seam="powerRight"></output><p data-seam="powerStatus" role="status" aria-live="polite"></p><small>Exakte Ganzzahlen (BigInt), feste Formeln; keine freie Code-Auswertung. Nicht jede Umklammerung ändert den Wert.</small></article><article><h4>03 · Mengen / Verschachtelung</h4><label>Struktur <select data-seam="nesting">'+structures.map((s,i)=>'<option value="'+i+'">'+s.notation+'</option>').join('')+'</select></label><output data-seam="nested"></output><p data-seam="nestStatus" role="status" aria-live="polite"></p><small>Deklarierte endliche Mengenstruktur: a und b sind verschiedene Symbole. Gleiche Blätter bedeuten nicht dieselbe Menge. Unausgeglichene Klammern sind kein gültiger Ausdruck.</small></article></div><details><summary>Gemeinsamer, typisierter Ansichtsrecord</summary><pre data-seam="grammarRecord"></pre></details><p class="seam-boundary">Diese Bedienelemente ändern nur die lokale Lesart. Keine automatische Format-, Würfel-, Tesserakt- oder Ghost-Kopplung; bestehende Quellinstrumente bleiben unverändert.</p></section>';
  }
  function mountGrammar(host){
    const find=k=>host.querySelector('[data-seam="'+k+'"]');if(!find('digits'))return null;
    let state;
    function render(){
      const groups=digitGroups(find('digits').value,Number(find('width').value)),power=powers(Number(find('base').value),Number(find('powerB').value),Number(find('powerC').value)),nested=structure(Number(find('nesting').value));
      find('grouped').textContent=groups.display;
      find('groupStatus').textContent='WERT ERHALTEN · '+groups.value+' · '+groups.parts.length+' Leseblöcke. Rücklesen ohne Trennstriche ergibt exakt dieselbe Ganzzahl.';
      find('powerLeft').textContent='('+power.a+'^'+power.b+')^'+power.c+' = '+power.a+'^'+power.leftExponent+' = '+power.left;
      find('powerRight').textContent=power.a+'^('+power.b+'^'+power.c+') = '+power.a+'^'+power.rightExponent+' = '+power.right;
      find('powerStatus').textContent=power.same?'GLEICHER WERT · andere Klammerstruktur.':'ERGEBNIS GEÄNDERT · Potenzieren ist nicht assoziativ.';
      find('nested').textContent=nested.notation;
      find('nestStatus').textContent='STRUKTUR · '+nested.outerCardinality+' äußere Elemente · Tiefe '+nested.depth+' · Blätter: '+nested.leaves.join(', ')+'. Kein numerisches Rechenergebnis definiert.';
      state={kind:'LOCAL_REGISTER_BRACKET_VIEW',grouping:groups,powers:power,structure:nested};
      find('grammarRecord').textContent=JSON.stringify(state,null,2);
    }
    ['digits','width','base','powerB','powerC','nesting'].forEach(k=>find(k).addEventListener('change',render));
    function reset(){for(const [k,v]of Object.entries({digits:'1000000000000',width:'3',base:'2',powerB:'3',powerC:'3',nesting:'0'}))find(k).value=v;render();}
    render();return{render,reset,snapshot:()=>JSON.parse(JSON.stringify(state))};
  }
  const radiusUnits=Object.freeze([15,30,48,68,88]);
  function radiusLedger(index){
    if(!Number.isInteger(index)||index<0||index>=radiusUnits.length)throw Error('invalid radius index');
    const units=radiusUnits[index],products={48:[4,12],68:[4,17],88:[8,11]},factors=products[units]||null;
    return{
      kind:'LOCAL_RADIUS_PROVENANCE_RECORD',index,
      source:{path:'[redacted-local-source]
      radius:{numerator:units,denominator:100,normalized:units/100,sourceMaxRadius:260,canvasPixels:260*units/100},
      scale:{multiplier:100,units,interpretation:'declared display scale, not measured length'},
      decomposition:factors?{factors,value:factors[0]*factors[1],provenance:'OWNER_STATED_ARITHMETIC',generatorEstablished:false}:null,
      eightReadings:units===88?[{expression:'2^3',value:8},{expression:'4+4',value:8}]:[],
      mathfield:{role:'owner reference',sourceBinding:null},
      bookkeeping:{ownerLabel:'537 GG',targetSide:1000,targetCells:1000000,NP:null,RR:null,flatAddress:null,acknowledged:false,status:'HOLD_ADDRESS_MAP_UNDEFINED',cMeaning:null},
      boundary:'Radius, scaled integer, factorization, role and grid address are distinct. No clock, source mutation, physical field or canonical Family relation.'
    };
  }
  function radiusMarkup(){
    return '<section class="seam-grammar" aria-label="Radius und Herkunfts-Ledger"><h3>Radius → Maßstab → Zerlegung → Buchhaltung</h3><p>Alle fünf Radien des vorhandenen Resonators bleiben erhalten. ×100 ist eine ausdrücklich gewählte Leseskala; die Zerlegungen 48=4×12, 68=4×17 und 88=8×11 stammen aus der Owner-Zuordnung.</p><div class="seam-controls"><label>Resonator-Ebene <select data-seam="radiusIndex">'+radiusUnits.map((n,i)=>'<option value="'+i+'"'+(i===3?' selected':'')+'>'+String(i+1)+' · '+(n/100)+' → '+n+'</option>').join('')+'</select></label></div><div class="seam-ledger-scroll"><table><thead><tr><th>Radius</th><th>×100</th><th>Zerlegung</th><th>Herkunft</th></tr></thead><tbody>'+radiusUnits.map((n,i)=>'<tr data-radius-row="'+i+'"><td>'+n+'/100</td><td>'+n+'</td><td>'+({48:'4 × 12',68:'4 × 17',88:'8 × 11'}[n]||'keine Owner-Zuordnung')+'</td><td>fibSteps['+i+']</td></tr>').join('')+'</tbody></table></div><p data-seam="radiusStatus" role="status" aria-live="polite"></p><details open><summary>Mitgeführter Herkunftsrecord</summary><pre data-seam="radiusRecord"></pre></details><p><a href="A0_PINK_DIAMOND_GRID_ATLAS.html#ghost-tiles">Vorhandenes Ghost-Grid · 1000×1000-Vergleich öffnen →</a></p><p class="seam-boundary">Ziel: 1000×1000 = 1.000.000 Zellen. HOLD: NP, RR und flache Adresse sind nicht festgelegt. „537 GG“ ist ein Owner-Label, keine erfundene Zelladresse; „C“ bleibt ohne zusätzliche Definition offen. Keine Buchung, kein ACK und keine automatische Kopplung. Mathfield bleibt ein ungebundener Quellenverweis. Der SHA-256 bezeichnet den gelesenen Originalstand, keine Live-Prüfung.</p></section>';
  }
  function mountRadius(host){
    const find=k=>host.querySelector('[data-seam="'+k+'"]'),control=find('radiusIndex');if(!control)return null;
    let state;
    function render(){state=radiusLedger(Number(control.value));find('radiusRecord').textContent=JSON.stringify(state,null,2);find('radiusStatus').textContent=state.radius.numerator+'/100 × 100 = '+state.scale.units+(state.decomposition?' = '+state.decomposition.factors.join(' × '):' · Zerlegung nicht zugeordnet')+(state.eightReadings.length?' · 8 = 2³ = 4+4; unterschiedliche Rechenwege.':'')+' · Grid-Buchung HOLD.';}
    control.addEventListener('change',render);
    function reset(){control.value='3';render();}
    render();return{render,reset,snapshot:()=>JSON.parse(JSON.stringify(state))};
  }
  function mount(doc){
    const host=doc.getElementById('seamOrigins');if(!host||host.dataset.mounted)return null;
    host.dataset.mounted='true';
    host.innerHTML='<h2>Die farbigen Einser · zwei Herkünfte in der Mitte</h2><p>Vier geordnete Pfade → drei Summen → <strong>1 : 2 : 1</strong>. Die Zahlen zählen Urbilder; die Farben markieren Herkunft. Pink B erscheint lila und gestrichelt, damit die beiden gemischten Pfade unterscheidbar bleiben.</p><div class="seam-controls"><label>Quellpfad <select data-seam="origin">'+paths.map(p=>'<option value="'+p.id+'">'+p.label+'</option>').join('')+'</select></label><label>Projektion <select data-seam="projection"><option value="sum">q = a + b</option><option value="abs">|q| · Seitenverlust</option></select></label><label><input data-seam="key" type="checkbox" checked> Herkunfts-Key mitführen</label><button type="button" data-seam="reset">Ansicht zurücksetzen</button></div><div data-seam="drawing" class="seam-drawing"></div><p data-seam="status" role="status" aria-live="polite"></p><details><summary>Exportierbarer Ansichtsrecord</summary><pre data-seam="record"></pre></details><p><a href="03_THREE_POSITIONS_SEAM_RETURN.html">Bestehender 1:2:1-/Seam-Vertrag →</a></p><p class="seam-boundary">Lokale Herkunftslinse nach der Owner-Tafel „Five-Zone Seam Test“. Statische Verbindungsspuren, keine zeitlichen Ghost-Echos und kein Anschluss an einen anderen Ghost-Carrier. Kein Atom-/Elektrochemiemodell; keine neue Family oder physikalische Polarität. Ein verlorener Key wird nicht aus dem ausgewählten Quellpfad heimlich rekonstruiert.</p>';
    host.innerHTML+=grammarMarkup()+radiusMarkup();
    const grammar=mountGrammar(host);
    const ledger=mountRadius(host);
    const find=k=>host.querySelector('[data-seam="'+k+'"]'),origin=find('origin'),projection=find('projection'),key=find('key');
    function render(){
      const r=record(origin.value,projection.value,key.checked),candidates=recover(r);
      find('drawing').innerHTML=drawing(projection.value,key.checked,origin.value);
      find('record').textContent=JSON.stringify(r,null,2);
      find('status').textContent='Aus dem Record rekonstruierbar: '+candidates.join(' / ')+'. '+(candidates.length===1?'Eindeutiger Pfad.':'MEHRDEUTIG · '+candidates.length+' mögliche Herkünfte; kein eindeutiger Return.')+' Quellwahl bleibt links sichtbar, gehört ohne Key aber nicht zum Record.';
    }
    [origin,projection,key].forEach(el=>el.addEventListener('change',render));
    find('reset').addEventListener('click',()=>{origin.value='B';projection.value='sum';key.checked=true;if(grammar)grammar.reset();if(ledger)ledger.reset();render();});
    render();return{render,grammar,ledger,snapshot:()=>record(origin.value,projection.value,key.checked)};
  }
  return{paths,record,recover,drawing,mount,digitGroups,powers,structures,structure,grammarMarkup,mountGrammar,radiusUnits,radiusLedger,radiusMarkup,mountRadius};
});
