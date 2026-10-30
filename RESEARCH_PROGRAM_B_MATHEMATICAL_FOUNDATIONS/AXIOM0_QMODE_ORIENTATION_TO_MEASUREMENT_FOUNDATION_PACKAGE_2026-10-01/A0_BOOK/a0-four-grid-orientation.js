(function(root,factory){
  const node=typeof module==='object'&&module.exports;
  const api=factory(node?require('./a0-fold-lag-lens.js'):root.A0FoldLagLens,node?require('./assets/a0-tesa-grid-candidate.js'):root.A0TesaGridCandidate);
  if(node)module.exports=api;else root.A0FourGridOrientation=api;
})(typeof globalThis==='undefined'?this:globalThis,function(F,T){
  'use strict';
  const VERSION='1.0.0',clone=x=>JSON.parse(JSON.stringify(x));
  function snapshot(z=0){
    if(!Number.isInteger(z)||z<0||z>28)throw new RangeError('inspection cursor must be 0..28');
    const u=z/28,terminal=z===28,fold=F.snapshot(z,{mode:'target',lag:3,mirror:'none'}),tesa=z===0?null:T.cell(z);
    const q4=Math.round(u*15),q4p3=Math.round(u*47),bookAngle=180*u,phase=2*Math.PI*u;
    return {schema:'nexah.a0.four-grid-orientation-view/1',version:VERSION,status:'LOCAL_VIEW_ADAPTER',cursor:{z,u,pose:z+1},
      lanes:{
        fold5b:{carrier:'5B_FOLD_DISPLAY',nativeCount:'29 poses / 28 transitions',state:{z,pose:z+1,group:Math.min(4,Math.floor(z/7)+1),localStep:terminal?7:z%7,turn:fold.turn},closure:terminal?'DISPLAY_0_AND_Y_FLIP':'OPEN',addressIdentity:false},
        tesa:{carrier:'TESA_DOCUMENTARY_GRID',nativeCount:'28 interior addresses + external 29',state:tesa?{address:z,row:tesa.row+1,col:tesa.col+1}:{address:null,externalReference:0},closure:terminal?'ADDRESS_28_NOT_RETURN':'NOT_APPLICABLE',addressIdentity:true},
        book:{carrier:'ROOT7_DECLARED_BOOK_VIEW',nativeCount:'fixed seam / two pages',state:{inspectionAngle:bookAngle,hinge:'1–O–4',sidePairing:'6↔2 · 5↔3',q4Sample:q4},closure:terminal?'FLAT_VIEW_NOT_SOURCE_RETURN':'OPENING_VIEW',addressIdentity:false},
        tessarec:{carrier:'ATLAS_TESSAREC_SOURCE_FAMILY',nativeCount:'Q4 16 / Q4×P3 48 states',state:{q4Sample:q4,q4p3Sample:q4p3,layer:Math.floor(q4p3/16)},closure:terminal?'LAST_SAMPLED_VIEW_NOT_CYCLE_RETURN':'SOURCE_CLOCK_UNTOUCHED',addressIdentity:false}
      },
      rhythm:{phase,redShadow:Math.min(3,Math.floor(z/7))%2===0?1:-1,umbrella:{x:-Math.cos(Math.PI*u),y:Math.sin(Math.PI*u)},axisSpan:100+190*(.5-.5*Math.cos(phase)),elevatorPower:.5-.5*Math.cos(phase),pinDot:true,glyph52Rotation:90,exact52:{factorization:'52 = 13 × 2²',gonWitness:'23 + 29 = 52',source:'A0 +4 affine four-rung check'},boundary:'Animated display rhythm only; exact arithmetic and the 90-degree owner glyph/orientation reading are separate types. Complex semicircle, square wave and elevator axis remain separate views.'},
      relation:{kind:'NORMALIZED_INSPECTION_CROSSWALK',rule:'u=z/28; Q4=round(15u); Q4×P3=round(47u); book inspection angle=180u; TESA address=z only for z=1..28',sharedClock:false,sharedCarrier:false,sourceMutation:false,scientificIdentityClaim:false},
      residual:{atZero:'5B pose 1 exists while TESA has no interior address',atTerminal:'5B display closure marker, TESA address 28, flat book view and sampled Tessarec endpoint are different typed states'}};
  }
  function rhythmSvg(r){
    const u=r.cursor.u,p=r.rhythm,px=390+280*u,py=170-62*Math.sin(2*Math.PI*u),redY=p.redShadow>0?108:232;
    const ux=180+100*p.umbrella.x,uy=195-100*p.umbrella.y,span=p.axisSpan;
    let sine='';for(let i=0;i<=112;i++){const q=i/112;sine+=(i?'L':'M')+(390+280*q)+','+(170-62*Math.sin(2*Math.PI*q));}
    return '<title>90-Grad-Glyph, grüner Umbrella, Red Shadow und gezogene Elevator-Achse</title><desc>Der gemeinsame Cursor bewegt einen Pin über eine komplexe Halbkreislesart, eine Sinuskurve und eine rote Rechteckspur. Die weiße Querachse expandiert und kehrt zurück. Alle Rollen sind Displayadapter.</desc>'+
      '<rect x="20" y="18" width="700" height="300" rx="12" fill="#050d12" stroke="#315568"/>'+
      '<text x="40" y="48" fill="#eef7fb" font-size="15">90° / „52“ · PIN / RHYTHM / ELEVATOR</text><text x="40" y="69" fill="#829ba8" font-size="10">EXAKT: 52 = 13 × 2² · 23 + 29 = 52 · GLYPHENLAGE GETRENNT</text>'+
      `<line x1="${180-span/2}" y1="195" x2="${180+span/2}" y2="195" stroke="#fff" stroke-width="3"/><line x1="180" y1="78" x2="180" y2="274" stroke="#dceaf0" opacity=".65"/>`+
      '<path d="M80 195 A100 100 0 0 1 280 195" fill="none" stroke="#62dfa0" stroke-width="3"/><text x="76" y="214" fill="#62dfa0" font-size="11">−1</text><text x="174" y="84" fill="#62dfa0" font-size="11">i</text><text x="280" y="214" fill="#62dfa0" font-size="11">+1</text>'+
      `<line x1="180" y1="195" x2="${ux}" y2="${uy}" stroke="#62dfa0" stroke-width="2"/><circle cx="${ux}" cy="${uy}" r="7" fill="#f3c25a" stroke="#fff"/><text x="48" y="294" fill="#9eb4bf" font-size="11">WHITE AXIS · ELEVATOR POWER ${(100*p.elevatorPower).toFixed(0)}%</text>`+
      '<line x1="390" y1="170" x2="670" y2="170" stroke="#fff" stroke-dasharray="7 6" opacity=".8"/>'+
      `<path d="${sine}" fill="none" stroke="#20e5ef" stroke-width="3"/><path d="M390 108H460V232H530V108H600V232H670" fill="none" stroke="#ff334d" stroke-width="3"/>`+
      `<line x1="${px}" y1="88" x2="${px}" y2="252" stroke="#f3c25a" opacity=".55"/><circle cx="${px}" cy="${py}" r="7" fill="#f3c25a" stroke="#fff"/><circle cx="${px}" cy="${redY}" r="5" fill="#ff334d" stroke="#fff"/><text x="390" y="294" fill="#9eb4bf" font-size="11">CYAN RHYTHM · RED SHADOW ${p.redShadow>0?'+1':'−1'} · PIN Z ${r.cursor.z}</text>`;
  }
  const esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
  function svg(r){
    const z=r.cursor.z,x=58+z*23,lines=[];
    lines.push('<title>Vier getrennte Orientierungsträger unter einem Inspektionscursor</title><desc>5B-Pose, TESA-Adresse, Buchöffnung und Tessarec-Abtastung behalten eigene Typen und Uhren.</desc>');
    lines.push('<rect x="20" y="20" width="700" height="410" rx="12" fill="#071923" stroke="#315568"/>');
    lines.push('<text x="40" y="52" fill="#eef7fb" font-size="16">GEMEINSAMER CURSOR · GETRENNTE TRÄGER</text>');
    const labels=[['5B · 29 POSEN',100,'#d2a9ff'],['TESA · 4 × 7',190,'#59d6ec'],['BUCH · NAHT',285,'#f3c25a'],['TESSAREC · 16 / 48',380,'#62dfa0']];
    for(const [label,y,color] of labels){lines.push(`<text x="40" y="${y-25}" fill="${color}" font-size="12">${label}</text><line x1="58" y1="${y}" x2="702" y2="${y}" stroke="#294453"/>`);}
    for(let i=0;i<29;i++){const xx=58+i*23,active=i===z;lines.push(`<circle cx="${xx}" cy="100" r="${active?7:3}" fill="${active?'#f3c25a':'#9f7dc8'}"/>`);}
    for(let i=1;i<=28;i++){const c=T.cell(i),xx=58+c.col*28,yy=166+c.row*14,active=i===z;lines.push(`<rect x="${xx}" y="${yy}" width="24" height="11" fill="${active?'#f3c25a':'none'}" stroke="#59d6ec" opacity="${active?1:.7}"/>`);}
    lines.push(`<circle cx="282" cy="190" r="6" fill="${z===0?'#f3c25a':'none'}" stroke="#f3c25a"/><text x="294" y="194" fill="#9eb4bf" font-size="10">EXTERN 0 / 29</text>`);
    const a=r.lanes.book.state.inspectionAngle*Math.PI/360,spread=105*Math.sin(a),depth=30*Math.cos(a);
    lines.push(`<line x1="380" y1="245" x2="380" y2="325" stroke="#fff" stroke-width="3"/><polygon points="380,245 ${380-spread},${260+depth} ${380-spread},${310-depth} 380,325" fill="#8d63bd55" stroke="#b387ff"/><polygon points="380,245 ${380+spread},${260+depth} ${380+spread},${310-depth} 380,325" fill="#d9a92f44" stroke="#f3c25a"/><text x="500" y="290" fill="#9eb4bf" font-size="11">β ${r.lanes.book.state.inspectionAngle.toFixed(1)}° · 1–O–4 fest</text>`);
    const cx=245,cy=380,rr=36;for(let i=0;i<16;i++){const a2=2*Math.PI*i/16,active=i===r.lanes.tessarec.state.q4Sample;lines.push(`<circle cx="${cx+rr*Math.cos(a2)}" cy="${cy+rr*Math.sin(a2)}" r="${active?6:2.5}" fill="${active?'#f3c25a':'#62dfa0'}"/>`);}lines.push(`<text x="305" y="384" fill="#9eb4bf" font-size="11">Q4 ${r.lanes.tessarec.state.q4Sample}/15 · Q4×P3 ${r.lanes.tessarec.state.q4p3Sample}/47</text>`);
    lines.push(`<line x1="${x}" y1="68" x2="${x}" y2="132" stroke="#f3c25a" stroke-width="2"/><text x="${Math.min(670,x+8)}" y="84" fill="#f3c25a" font-size="11">Z ${z}</text>`);
    return lines.join('');
  }
  function card(title,kind,state,retained,residual,color){return `<article style="border-top:3px solid ${color};background:#0a1d28;padding:14px;min-height:170px"><small style="color:${color}">${esc(kind)}</small><h4 style="margin:.35rem 0">${esc(title)}</h4><b>${esc(state)}</b><p><strong>ERHALTEN</strong> · ${esc(retained)}</p><p><strong>RESIDUAL</strong> · ${esc(residual)}</p></article>`;}
  function mount(doc,win){
    const host=doc.getElementById('fourGridOrientation');if(!host)return null;const $=q=>host.querySelector('[data-4g-'+q+']');let timer=null,current=null;
    function render(z=Number($('cursor').value)){
      current=snapshot(z);$('cursor').value=String(z);$('step').textContent=`Z ${z}/28 · Pose ${z+1}/29`;$('svg').innerHTML=svg(current);$('rhythm').innerHTML=rhythmSvg(current);
      const L=current.lanes;$('cards').innerHTML=
        card('5B · Klappe','SEQUENCE / DISPLAY',`Pose ${L.fold5b.state.pose}/29 · Gruppe ${L.fold5b.state.group} · Schritt ${L.fold5b.state.localStep}`, 'Reihenfolge, feste Kreuzreferenz, lokaler Nachlauf',L.fold5b.closure,'#d2a9ff')+
        card('TESA · Raster','SPATIAL ADDRESS',L.tesa.state.address?`Adresse ${L.tesa.state.address} · R${L.tesa.state.row} C${L.tesa.state.col}`:'keine Innenadresse · externer Referenzpunkt','28 Adressen und inverse Zeilen-/Spaltenlesung',L.tesa.closure,'#59d6ec')+
        card('Buch · Klappe / Naht','VIEW / HINGE',`β ${L.book.state.inspectionAngle.toFixed(1)}° · Q4-Lesestich ${L.book.state.q4Sample}`,'Naht 1–O–4 und Seitenpaarungen',L.book.closure,'#f3c25a')+
        card('Tessarec · Atlas','SOURCE FAMILY / SAMPLE',`Q4 ${L.tessarec.state.q4Sample}/15 · Q4×P3 ${L.tessarec.state.q4p3Sample}/47 · Layer ${L.tessarec.state.layer+1}`,'Quellzählungen 16/48; Atlas-Uhr unberührt',L.tessarec.closure,'#62dfa0');
      $('status').textContent=z===0?'DIFFERENZ SICHTBAR · 5B Pose 1, TESA extern, Buch geschlossen, Tessarec Stich 0':z===28?'VIER ENDEN · nur 5B zeigt den deklarierten 0/Flip-Abschluss; kein gemeinsamer Return':`INSPEKTION ${z}/28 · gemeinsame Lage im Vergleich, keine gemeinsame Quelluhr`;
      if($('follow').checked&&win.A0FoldLagView){const slider=doc.getElementById('foldLagSlice');if(slider&&Number(slider.value)!==z){slider.value=String(z);slider.dispatchEvent(new win.Event('input',{bubbles:true}));}}
      return clone(current);
    }
    const stop=()=>{if(timer!==null){win.clearInterval(timer);timer=null;}$('play').textContent='▶ Vergleich abspielen';};
    $('cursor').addEventListener('input',()=>{stop();render();});$('prev').addEventListener('click',()=>{stop();render(Math.max(0,current.cursor.z-1));});$('next').addEventListener('click',()=>{stop();render(Math.min(28,current.cursor.z+1));});$('reset').addEventListener('click',()=>{stop();render(0);});
    $('play').addEventListener('click',()=>{if(timer!==null){stop();return;}if(current.cursor.z===28)render(0);$('play').textContent='Pause';timer=win.setInterval(()=>{if(current.cursor.z===28){stop();return;}render(current.cursor.z+1);},450);});
    $('follow').addEventListener('change',()=>render());
    render();return{snapshot:()=>clone(current),render,stop};
  }
  return{VERSION,snapshot,svg,rhythmSvg,mount};
});
