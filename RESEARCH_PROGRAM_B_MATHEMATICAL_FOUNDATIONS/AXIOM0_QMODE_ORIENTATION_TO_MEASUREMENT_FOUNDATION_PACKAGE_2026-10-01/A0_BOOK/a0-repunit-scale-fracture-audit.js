(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.A0RepunitScaleFractureAudit=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const SCHEMA='a0.repunit-scale-fracture-audit/1.2.0';
  const SCALES=Object.freeze([111,1111]);
  const MODULI=Object.freeze([11,20,101,121]);
  const WORDS=Object.freeze(['LRRL','RLLR']);
  const FIELD_VIEWS=Object.freeze(['BASE_AXES','MOD20_VIGESIMAL','MOD101_SQUARE','MOD121_SHEAR','CRT1111_INTERSECTIONS']);
  const AUTHORITY=Object.freeze({
    identityReuse:Object.freeze(['MOD:NUMBER_VIEW_SUITE','NEXAH_A0_ORIENTATION_CONTROLLER_BENCH','A0_11X111_GRID_ELEVATOR','NEXAH:CON_DAO_BREATH:V1']),
    newCanonicalIds:Object.freeze([]),relationChanges:Object.freeze([]),aliases:Object.freeze([]),studyActivation:false
  });
  function ensure(condition,code){if(!condition)throw new TypeError(code)}
  function mod(value,modulus){return((value%modulus)+modulus)%modulus}
  function repunit(length){
    ensure(Number.isInteger(length)&&length>=1&&length<=18,'REPUNIT_LENGTH_INVALID');
    return BigInt('1'.repeat(length));
  }
  function repunitSquare(length){
    const root=repunit(length),coefficients=Array.from({length:2*length-1},(_,i)=>Math.min(i+1,2*length-1-i,length));
    const noDecimalCarry=coefficients.every(value=>value<10);
    return Object.freeze({length,root,value:root*root,coefficients:Object.freeze(coefficients),digitPalindrome:noDecimalCarry?coefficients.join(''):null,noDecimalCarry});
  }
  function scaleRecord(size){
    ensure(SCALES.includes(size),'REPUNIT_SCALE_INVALID');
    const center=(size-1)/2;
    return Object.freeze({
      size,samples:size,intervals:size-1,states:size*size,edges:2*size*(size-1),boundaryVertices:4*size-4,interiorVertices:(size-2)**2,
      center,centerMinus11:center-11,centerPlus11:center+11,janusFixed:Object.freeze([center,center]),janusTwoCycles:(size*size-1)/2,
      repunitLength:String(size).length,square:String(BigInt(size)**2n),mod11:size%11,mod121:size%121
    });
  }
  function janus(size,point){
    const record=scaleRecord(size),[x,y]=point;
    ensure(Number.isInteger(x)&&Number.isInteger(y)&&x>=0&&x<size&&y>=0&&y<size,'JANUS_POINT_INVALID');
    return Object.freeze([size-1-x,size-1-y]);
  }
  function residueLocus(size,modulus){
    ensure(SCALES.includes(size)&&MODULI.includes(modulus),'RESIDUE_LOCUS_INVALID');
    const coefficient=size%modulus,segments=[];
    if(coefficient===0){
      for(let k=0;k*modulus<=size-1;k+=1)segments.push(Object.freeze({x0:k*modulus,y0:0,x1:k*modulus,y1:size-1,k}));
    }else{
      const maxK=Math.ceil((size-1)*(coefficient+1)/modulus);
      for(let k=0;k<=maxK;k+=1){
        const intercept=k*modulus;
        const y0=Math.max(0,(intercept-(size-1))/coefficient),y1=Math.min(size-1,intercept/coefficient);
        if(y0<=y1)segments.push(Object.freeze({x0:intercept-coefficient*y0,y0,x1:intercept-coefficient*y1,y1,k}));
      }
    }
    const classification=coefficient===0?'VERTICAL_STRIPES':coefficient===1||coefficient===modulus-1?'UNIT_DIAGONALS':'OBLIQUE_DIAGONALS';
    return Object.freeze({size,modulus,coefficient,equation:`x+${coefficient}y ≡ 0 (mod ${modulus})`,classification,segments:Object.freeze(segments)});
  }
  function fieldPoint(n,size=111){
    ensure(Number.isInteger(n)&&n>=0&&Number.isInteger(size)&&size>0,'REPUNIT_FIELD_POINT_INVALID');
    return Object.freeze([n%size,Math.floor(n/size)]);
  }
  function multiplePoints(divisor,size=111){
    ensure(Number.isInteger(divisor)&&divisor>0&&Number.isInteger(size)&&size>0,'REPUNIT_MULTIPLE_POINTS_INVALID');
    const limit=size*size-1,points=[];
    for(let n=0;n<=limit;n+=divisor)points.push(Object.freeze({n,point:fieldPoint(n,size)}));
    return Object.freeze(points);
  }
  function vectorStats(a,b){
    const dot=a[0]*b[0]+a[1]*b[1],det=a[0]*b[1]-a[1]*b[0],normA=Math.hypot(a[0],a[1]),normB=Math.hypot(b[0],b[1]);
    return Object.freeze({dot,det,normA,normB,orthogonal:dot===0,equalLength:Math.abs(normA-normB)<1e-12,cellArea:Math.abs(det)});
  }
  function fieldViewRecord(view='BASE_AXES'){
    ensure(FIELD_VIEWS.includes(view),'REPUNIT_FIELD_VIEW_INVALID');
    if(view==='BASE_AXES')return Object.freeze({view,carrier:111,classification:'CARRIER_AXES',basis:Object.freeze([Object.freeze([1,0]),Object.freeze([0,1])]),stats:vectorStats([1,0],[0,1]),points:Object.freeze([]),anchor:Object.freeze([55,55]),cell:Object.freeze([]),equation:'n=x+111y'});
    if(view==='MOD20_VIGESIMAL'){
      const a=Object.freeze([9,1]),b=Object.freeze([-2,2]),anchor=Object.freeze([55,55]);
      return Object.freeze({view,carrier:111,classification:'VIGESIMAL_BAND_SUBLATTICE',modulus:20,equation:'x+11y ≡ 0 (mod 20)',basis:Object.freeze([a,b]),stats:vectorStats(a,b),points:multiplePoints(20),anchor,cell:Object.freeze([anchor,Object.freeze([64,56]),Object.freeze([62,58]),Object.freeze([53,57])]),sourceSteps:Object.freeze([120,220]),base20:Object.freeze({carrier:'111₁₀ = 5B₂₀',mod101:'101₁₀ = 51₂₀',mod121:'121₁₀ = 61₂₀',return1111:'1111₁₀ = 2FB₂₀'})});
    }
    if(view==='MOD101_SQUARE'){
      const a=Object.freeze([10,-1]),b=Object.freeze([1,10]),anchor=Object.freeze([56,55]);
      return Object.freeze({view,carrier:111,classification:'ROTATED_SQUARE_SUBLATTICE',modulus:101,equation:'x+10y ≡ 0 (mod 101)',basis:Object.freeze([a,b]),stats:vectorStats(a,b),points:multiplePoints(101),anchor,cell:Object.freeze([anchor,Object.freeze([66,54]),Object.freeze([67,64]),Object.freeze([57,65])]),sourceSteps:Object.freeze([-101,1111])});
    }
    if(view==='MOD121_SHEAR'){
      const a=Object.freeze([10,1]),b=Object.freeze([-1,12]),anchor=Object.freeze([66,55]);
      return Object.freeze({view,carrier:111,classification:'SHEARED_SUBLATTICE',modulus:121,equation:'x−10y ≡ 0 (mod 121)',basis:Object.freeze([a,b]),stats:vectorStats(a,b),points:multiplePoints(121),anchor,cell:Object.freeze([anchor,Object.freeze([76,56]),Object.freeze([75,68]),Object.freeze([65,67])]),sourceSteps:Object.freeze([121,1331])});
    }
    const points=Object.freeze(Array.from({length:12},(_,k)=>Object.freeze({n:1111*k,point:Object.freeze([k,10*k])})));
    const a=Object.freeze([1,10]),b=Object.freeze([-110,11]);
    return Object.freeze({view,carrier:111,classification:'CRT_COMMON_RETURN_RAIL',modulus:1111,equation:'n ≡ 0 (mod lcm(11,101))',basis:Object.freeze([a,b]),stats:vectorStats(a,b),points,anchor:Object.freeze([0,0]),cell:Object.freeze([]),sourceSteps:Object.freeze([1111,-11110]),commonModuli:Object.freeze([11,101])});
  }
  function transportRecord(field,word){
    ensure(field&&FIELD_VIEWS.includes(field.view)&&WORDS.includes(word),'REPUNIT_TRANSPORT_INVALID');
    if(field.cell.length!==4)return Object.freeze({word,active:false,classification:'NO_DECLARED_CELL_TRANSPORT',vertices:Object.freeze([]),letters:Object.freeze([])});
    const order=word==='LRRL'?[0,1,2,3,0]:[0,3,2,1,0];
    return Object.freeze({word,active:true,classification:word==='LRRL'?'POSITIVE_BASIS_LOOP':'NEGATIVE_BASIS_LOOP',vertices:Object.freeze(order.map(index=>field.cell[index])),letters:Object.freeze(word.split('')),closed:true,role:'DECLARED_2D_CELL_VIEW_TRANSPORT_NOT_CUBE_LIFT'});
  }
  function wordRecord(word){
    ensure(WORDS.includes(word),'REPUNIT_WORD_INVALID');
    let position=0;
    const trace=[0];
    for(const letter of word){position+=letter==='L'?-1:1;trace.push(position)}
    return Object.freeze({word,trace:Object.freeze(trace),balanced:position===0,palindrome:word===word.split('').reverse().join(''),complement:word.replace(/[LR]/g,letter=>letter==='L'?'R':'L'),role:'DECLARED_PATH_WITNESS_NOT_GRID_OPERATOR'});
  }
  function ladder(){
    const r2=repunit(2),r3=repunit(3),r4=repunit(4),j2=r2*r3,j3=r3*r4;
    return Object.freeze({
      squares:Object.freeze([repunitSquare(2),repunitSquare(3),repunitSquare(4)]),
      junctions:Object.freeze([
        Object.freeze({value:j2,leftSquare:r2*r2,rightSquare:r3*r3,identity:j2*j2===(r2*r2)*(r3*r3)}),
        Object.freeze({value:j3,leftSquare:r3*r3,rightSquare:r4*r4,identity:j3*j3===(r3*r3)*(r4*r4)})
      ]),
      sequence:Object.freeze(['121','1221','12321','123321','1234321'])
    });
  }
  function audit(size=111,modulus=11,word='LRRL',fieldView='BASE_AXES'){
    const scale=scaleRecord(size),locus=residueLocus(size,modulus),path=wordRecord(word),chain=ladder(),field=fieldViewRecord(fieldView),transport=transportRecord(field,word);
    const probe=Object.freeze([scale.centerMinus11,scale.centerPlus11]),mirror=janus(size,probe);
    return Object.freeze({
      schema:SCHEMA,status:'PASS_EXACT_REPUNIT_SCALE_AND_DIAGONAL_FRACTURE_VIEW',scale,locus,path,ladder:chain,field,transport,
      janus:Object.freeze({formula:`J(x,y)=(${size-1}−x,${size-1}−y)`,probe,mirror,involution:JSON.stringify(janus(size,mirror))===JSON.stringify(probe)}),
      conDao:Object.freeze({sourceLabels:Object.freeze([110,111,112]),offsets:Object.freeze([-1,0,1]),role:'SEPARATE_SOURCE_LABEL_RAIL_NOT_CENTER_PLUS_MINUS_11'}),
      notationBoundary:Object.freeze({base3Count:'1111₃=40₁₀',decimalRepunit:'1111₁₀',sameGlyph:false}),
      authority:AUTHORITY,
      claimBoundary:'EXACT FINITE ARITHMETIC AND VIEW COMPARATOR; MOD-20, MOD-101 AND MOD-121 ARE SUBLATTICE VIEWS OF THE 111 CARRIER, NOT NEW CARRIERS; PRIME POINTS ARE AN OVERLAY, NOT LATTICE NODES; LRRL/RLLR IS A DECLARED 2D CELL-VIEW TRANSPORT ONLY, NOT A CUBE LIFT; PASCAL-LIKE CONVOLUTION IS NOT A PASCAL ROW; CON-DAO LABELS ARE NOT GRID COORDINATES WITHOUT A DECLARED MAP.'
    });
  }
  function validate(record){
    ensure(record?.schema===SCHEMA&&record.status==='PASS_EXACT_REPUNIT_SCALE_AND_DIAGONAL_FRACTURE_VIEW','REPUNIT_AUDIT_SCHEMA_INVALID');
    ensure(record.ladder.sequence.join(',')==='121,1221,12321,123321,1234321','REPUNIT_LADDER_INVALID');
    ensure(record.ladder.junctions.every(row=>row.identity),'REPUNIT_BRIDGE_INVALID');
    ensure(record.janus.involution&&record.path.balanced&&record.path.palindrome,'REPUNIT_SYMMETRY_INVALID');
    ensure(record.field.carrier===111&&record.field.stats.cellArea>0,'REPUNIT_FIELD_VIEW_INVALID');
    ensure(!record.transport.active||record.transport.closed,'REPUNIT_TRANSPORT_INVALID');
    ensure(record.authority.newCanonicalIds.length===0&&record.authority.relationChanges.length===0&&!record.authority.studyActivation,'REPUNIT_AUTHORITY_INVALID');
    return record;
  }
  function svgFor(record){
    const W=1000,H=590,plot={x:54,y:58,size:450},N=record.scale.size-1;
    const sx=x=>plot.x+x/N*plot.size,sy=y=>plot.y+plot.size-y/N*plot.size;
    const grid=Array.from({length:12},(_,index)=>{const v=plot.x+index*plot.size/11,h=plot.y+index*plot.size/11;return `<path d="M${v.toFixed(2)} ${plot.y}V${plot.y+plot.size}M${plot.x} ${h.toFixed(2)}H${plot.x+plot.size}"/>`}).join('');
    const loci=record.locus.segments.map(segment=>`<path d="M${sx(segment.x0).toFixed(2)} ${sy(segment.y0).toFixed(2)}L${sx(segment.x1).toFixed(2)} ${sy(segment.y1).toFixed(2)}"/>`).join('');
    const field=record.field,showField=record.scale.size===111&&field.view!=='BASE_AXES';
    const base11=showField?residueLocus(111,11).segments.map(segment=>`<path d="M${sx(segment.x0).toFixed(2)} ${sy(segment.y0).toFixed(2)}L${sx(segment.x1).toFixed(2)} ${sy(segment.y1).toFixed(2)}"/>`).join(''):'';
    const fieldPoints=showField?field.points.map(row=>`<circle class="${field.view==='CRT1111_INTERSECTIONS'?'rsf-common-point':'rsf-field-point'}" cx="${sx(row.point[0]).toFixed(2)}" cy="${sy(row.point[1]).toFixed(2)}" r="${field.view==='CRT1111_INTERSECTIONS'?5:2.8}"/>`).join(''):'';
    const fieldCell=showField&&field.cell.length?`<polygon points="${field.cell.map(point=>`${sx(point[0]).toFixed(2)},${sy(point[1]).toFixed(2)}`).join(' ')}"/>`:'';
    const basisAxes=showField&&field.view!=='CRT1111_INTERSECTIONS'?field.basis.map((vector,index)=>{const a=field.anchor,span=7,start=[a[0]-span*vector[0],a[1]-span*vector[1]],end=[a[0]+span*vector[0],a[1]+span*vector[1]];return `<path class="rsf-basis-${index+1}" d="M${sx(start[0]).toFixed(2)} ${sy(start[1]).toFixed(2)}L${sx(end[0]).toFixed(2)} ${sy(end[1]).toFixed(2)}" marker-end="url(#rsfArrow${index+1})"/>`}).join(''):'';
    const transport=showField&&record.transport.active?`<polyline points="${record.transport.vertices.map(point=>`${sx(point[0]).toFixed(2)},${sy(point[1]).toFixed(2)}`).join(' ')}" marker-mid="url(#rsfTransportArrow)"/>${record.transport.letters.map((letter,index)=>{const p=record.transport.vertices[index],q=record.transport.vertices[index+1];return `<text x="${sx((p[0]+q[0])/2).toFixed(2)}" y="${(sy((p[1]+q[1])/2)-6).toFixed(2)}">${letter}</text>`}).join('')}`:'';
    const center=record.scale.center,minus=record.scale.centerMinus11,plus=record.scale.centerPlus11;
    const axes=[center,minus,plus].map((value,index)=>`<path class="${index?'rsf-offset-axis':'rsf-center-axis'}" d="M${sx(value).toFixed(2)} ${plot.y}V${plot.y+plot.size}M${plot.x} ${sy(value).toFixed(2)}H${plot.x+plot.size}"/>`).join('');
    const p=record.janus.probe,j=record.janus.mirror;
    const janus=`<path d="M${sx(p[0]).toFixed(2)} ${sy(p[1]).toFixed(2)}L${sx(j[0]).toFixed(2)} ${sy(j[1]).toFixed(2)}"/><circle cx="${sx(p[0]).toFixed(2)}" cy="${sy(p[1]).toFixed(2)}" r="8"/><circle cx="${sx(j[0]).toFixed(2)}" cy="${sy(j[1]).toFixed(2)}" r="8"/><circle class="rsf-fixed" cx="${sx(center).toFixed(2)}" cy="${sy(center).toFixed(2)}" r="10"/>`;
    const wordPoints=record.path.trace.map((value,index)=>`${610+index*72},${354-value*42}`).join(' ');
    const wordLabels=record.path.word.split('').map((letter,index)=>`<text x="${646+index*72}" y="414">${letter}</text>`).join('');
    const ladderX=[594,676,758,850,944],ladder=record.ladder.sequence.map((value,index)=>`<g><circle cx="${ladderX[index]}" cy="120" r="${index%2?24:30}"/><text x="${ladderX[index]}" y="124">${value}</text>${index<4?`<path d="M${ladderX[index]+31} 120H${ladderX[index+1]-31}"/>`:''}</g>`).join('');
    return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Repunit scale and diagonal fracture audit for ${record.scale.size} by ${record.scale.size}"><defs><clipPath id="rsfPlotClip"><rect x="${plot.x}" y="${plot.y}" width="${plot.size}" height="${plot.size}"/></clipPath><marker id="rsfArrow1" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path fill="#1aa7b2" d="M0 0L8 4L0 8Z"/></marker><marker id="rsfArrow2" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path fill="#9c3d89" d="M0 0L8 4L0 8Z"/></marker><marker id="rsfTransportArrow" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="5" markerHeight="5" orient="auto"><path fill="#ef476f" d="M0 0L8 4L0 8Z"/></marker></defs><text class="rsf-title" x="54" y="30">${record.scale.size}×${record.scale.size} · ${showField?field.classification:record.locus.classification} · ${showField?field.equation:record.locus.equation}</text><g clip-path="url(#rsfPlotClip)"><g class="rsf-grid">${grid}</g><g class="rsf-base11">${base11}</g><g class="rsf-loci">${showField?'':loci}</g><g class="rsf-field-points">${fieldPoints}</g><g class="rsf-local-cell">${fieldCell}</g><g class="rsf-basis-axes">${basisAxes}</g><g class="rsf-transport-loop rsf-transport-${record.path.word.toLowerCase()}">${transport}</g><g class="rsf-axes">${axes}</g><g class="rsf-janus">${janus}</g></g><text class="rsf-label" x="54" y="538">${showField?`${field.classification} · basis (${field.basis[0].join(',')}) / (${field.basis[1].join(',')}) · area ${field.stats.cellArea}${record.transport.active?` · ${record.transport.classification}`:''}`:`c=${center} · c±11=${minus}/${plus} · ${record.janus.formula}`}</text><text class="rsf-label" x="54" y="561">ANALYTIC LOCUS / VIEW · PRIME OVERLAY IS NOT A LATTICE · 2D TRANSPORT IS NOT A CUBE LIFT</text><text class="rsf-kicker" x="770" y="55">REPUNIT / JUNCTION LADDER</text><g class="rsf-ladder">${ladder}</g><text class="rsf-equation" x="770" y="178">1221² = 121·12321</text><text class="rsf-equation" x="770" y="202">123321² = 12321·1234321</text><text class="rsf-kicker" x="770" y="286">${record.path.word} · ${record.transport.active?record.transport.classification:'BALANCED PATH WITNESS'}</text><g class="rsf-word"><polyline points="${wordPoints}"/>${record.path.trace.map((value,index)=>`<circle cx="${610+index*72}" cy="${354-value*42}" r="6"/>`).join('')}${wordLabels}</g><text class="rsf-equation" x="770" y="445">trace [${record.path.trace.join(', ')}] · return 0</text><text class="rsf-kicker" x="770" y="495">CON–DAO SOURCE LABEL RAIL · SEPARATE</text><g class="rsf-condao"><path d="M640 535H900"/>${[110,111,112].map((value,index)=>`<g><circle cx="${680+index*90}" cy="535" r="9"/><text x="${680+index*90}" y="566">${value}</text></g>`).join('')}</g></svg>`;
  }
  function mount(host){
    if(!host)return null;
    let size=111,modulus=11,word='LRRL',fieldView='BASE_AXES';
    const q=selector=>host.querySelector(selector);
    function render(){
      const record=validate(audit(size,modulus,word,fieldView));
      host.querySelectorAll('[data-rsf-scale]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.rsfScale)===size)));
      host.querySelectorAll('[data-rsf-modulus]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.rsfModulus)===modulus)));
      host.querySelectorAll('[data-rsf-word]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.rsfWord===word)));
      host.querySelectorAll('[data-rsf-field]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.rsfField===fieldView)));
      q('[data-rsf-status]').textContent=fieldView==='BASE_AXES'?`${record.locus.classification} · a=${record.locus.coefficient}`:`${record.field.classification} · area=${record.field.stats.cellArea}`;
      q('[data-rsf-scale-readout]').textContent=`${size} samples · ${record.scale.intervals} intervals · ${record.scale.states.toLocaleString('en-US')} states`;
      q('[data-rsf-locus-readout]').textContent=`n=${size}y+x · ${record.locus.equation}`;
      q('[data-rsf-center-readout]').textContent=`c=${record.scale.center} · c±11=${record.scale.centerMinus11}/${record.scale.centerPlus11} · J fixed (${record.scale.center},${record.scale.center})`;
      q('[data-rsf-word-readout]').textContent=`${word} · ${record.transport.active?record.transport.classification:'SCALAR WITNESS'} · trace [${record.path.trace.join(', ')}] · ${record.path.balanced?'RETURN':'OPEN'}`;
      q('[data-rsf-field-readout]').textContent=fieldView==='BASE_AXES'?'BASE · x/y carrier axes':`${record.field.classification} · (${record.field.basis[0].join(',')}) / (${record.field.basis[1].join(',')}) · ${record.field.points.length} anchors`;
      q('[data-rsf-stage]').innerHTML=svgFor(record);
      q('[data-rsf-fracture]').textContent=fieldView==='MOD20_VIGESIMAL'?'VIGESIMAL VIEW: 111₁₀=5B₂₀ · x+11y≡0 (mod 20) · index-20 band sublattice':fieldView==='MOD101_SQUARE'?'MINIGRID: a·b=0 · |a|=|b|=√101 · cell area 101 · exact rotated square sublattice':fieldView==='MOD121_SHEAR'?'NESTED SHEAR: det(a,b)=121 · every green node remains inside the mod-11 structure':fieldView==='CRT1111_INTERSECTIONS'?'COMMON RETURN: lcm(11,101)=1111 · 12 anchors n=0…12221 · step (1,10)':size===111&&modulus===11?'DIAGONAL: 111≡1 (mod 11) → x+y≡0':size===1111&&modulus===11?'FRACTURE: 1111≡0 (mod 11) → x≡0 · VERTICAL STRIPES':`${record.locus.classification}: ${record.locus.equation}`;
      return record;
    }
    host.addEventListener('click',event=>{
      const scaleButton=event.target.closest('[data-rsf-scale]'),modulusButton=event.target.closest('[data-rsf-modulus]'),wordButton=event.target.closest('[data-rsf-word]'),fieldButton=event.target.closest('[data-rsf-field]');
      if(scaleButton){size=Number(scaleButton.dataset.rsfScale);if(size!==111)fieldView='BASE_AXES'}
      if(modulusButton)modulus=Number(modulusButton.dataset.rsfModulus);
      if(wordButton)word=wordButton.dataset.rsfWord;
      if(fieldButton){fieldView=fieldButton.dataset.rsfField;size=111;if(fieldView==='MOD20_VIGESIMAL')modulus=20;if(fieldView==='MOD101_SQUARE'||fieldView==='CRT1111_INTERSECTIONS')modulus=11;if(fieldView==='MOD121_SHEAR')modulus=121}
      if(scaleButton||modulusButton||wordButton||fieldButton)render();
    });
    return Object.freeze({render,getState:()=>Object.freeze({size,modulus,word,fieldView})});
  }
  function mountAll(doc=globalThis.document){if(!doc)return[];return[...doc.querySelectorAll('[data-repunit-scale-fracture-audit]')].map(mount)}
  if(typeof document!=='undefined'){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>mountAll(document),{once:true});else mountAll(document)}
  return Object.freeze({SCHEMA,SCALES,MODULI,WORDS,FIELD_VIEWS,AUTHORITY,mod,repunit,repunitSquare,scaleRecord,janus,residueLocus,fieldPoint,multiplePoints,vectorStats,fieldViewRecord,transportRecord,wordRecord,ladder,audit,validate,svgFor,mount,mountAll});
});
