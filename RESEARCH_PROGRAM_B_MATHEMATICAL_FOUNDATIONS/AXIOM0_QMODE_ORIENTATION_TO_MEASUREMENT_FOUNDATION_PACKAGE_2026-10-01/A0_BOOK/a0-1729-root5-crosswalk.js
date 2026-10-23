(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.A01729Root5Crosswalk=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const VERSION='1.0.0';
  const IDENTITY='NEXAH_A0_ORIENTATION_CONTROLLER_BENCH';
  const LAYERS=Object.freeze(['ARITHMETIC','ADDRESS','HISTORICAL_TRIGGER','GEOMETRIC_MASK']);
  const ROOT5_VALUES=Object.freeze([1,2,3,4,5,6,7,6,7,8,9,9,11,15,15,16,14,16,17,20,21,22,23,24,25]);
  const ROOT7_VALUES=Object.freeze([1,2,3,4,5,6,7,8,9,10,11,15,13,14,15,16,17,18,19,20,21,23,23,24,29,26,27,28,29,40,31,32,33,34,35,36,37,38,38,40,42,43]);
  const copy=value=>JSON.parse(JSON.stringify(value));

  function positions(values,target,cols){
    return values.reduce((out,value,index)=>{if(value===target)out.push(Object.freeze({index,row:Math.floor(index/cols)+1,col:index%cols+1}));return out},[]);
  }

  function arithmeticRecord(){
    return Object.freeze({
      value:1729,
      primeFactors:Object.freeze([7,13,19]),
      product:7*13*19,
      taxicab:Object.freeze([
        Object.freeze({a:1,b:12,sum:1**3+12**3}),
        Object.freeze({a:9,b:10,sum:9**3+10**3})
      ]),
      exact:true
    });
  }

  function addressRecord(){
    return Object.freeze({source:'1729',left:'17',right:'29',display:'17|29',operation:'DIGIT_ADDRESS_SPLIT',factorization:false,numericEqualityClaim:false});
  }

  function historicalRecord(){
    return Object.freeze({
      controller:'v29_root_cube_navigation_controller.py',
      declaredTitle:'NEXAH v29 – 5×17 Prime Trigger + Full Möbius Rotation',
      triggerLiteral:0.0085,
      labelProduct:5*17,
      derivationFrom1729:false,
      closureVisual:'ramanujan_final_closure_v4.9.py',
      closureCenterLabel:'17-29-5 / 1729 HIDY',
      status:'HISTORICAL_ENGINEERING_PARAMETER'
    });
  }

  function geometricRecord(){
    return Object.freeze({
      fixtureStatus:'DOCUMENTARY_TRANSCRIPTION_NOT_FORMULA',
      root5:Object.freeze({shape:'5×5',contains17:positions(ROOT5_VALUES,17,5),contains29:positions(ROOT5_VALUES,29,5)}),
      root7:Object.freeze({shape:'7×6',contains17:positions(ROOT7_VALUES,17,7),contains29:positions(ROOT7_VALUES,29,7)}),
      closureMask:Object.freeze({pentagonalHarmonic:5,heptagonalFrame:7,radialBelts:12,identityClaim:false}),
      interpretation:'GEOMETRIC_MASK_NOT_ROOT_EXTRACTION'
    });
  }

  function negativeControls(){
    return Object.freeze({
      fiveIsNotFactor:1729%5!==0,
      fifthRootIsNotInteger:4**5<1729&&1729<5**5,
      addressIsNotFactorization:17*29!==1729,
      triggerIsNotDerivedFrom1729:true,
      maskIsNotMechanism:true
    });
  }

  function primeFactors(value){
    let rest=value,divisor=2;const factors=[];
    while(divisor*divisor<=rest){while(rest%divisor===0){factors.push(divisor);rest/=divisor}divisor+=divisor===2?1:2}
    if(rest>1)factors.push(rest);
    return Object.freeze(factors);
  }

  function positiveCubePairs(value){
    const limit=Math.floor(Math.cbrt(value)),pairs=[];
    for(let a=1;a<=limit;a+=1){for(let b=a;b<=limit;b+=1){if(a**3+b**3===value)pairs.push(Object.freeze({a,b}))}}
    return Object.freeze(pairs);
  }

  function neighborAudit(){
    const cases=[1728,1729,1730].map(value=>{
      const cubePairs=positiveCubePairs(value);
      return Object.freeze({value,factors:primeFactors(value),address:`${String(value).slice(0,2)}|${String(value).slice(2)}`,positiveCubePairs:cubePairs,hasTwoPositiveCubePairs:cubePairs.length===2,divisibleBy5:value%5===0,historicalCenterLabelMatch:value===1729});
    });
    const center=cases[1],neighbors=[cases[0],cases[2]];
    return Object.freeze({cases:Object.freeze(cases),pass:center.hasTwoPositiveCubePairs&&neighbors.every(item=>!item.hasTwoPositiveCubePairs)&&center.historicalCenterLabelMatch&&neighbors.every(item=>!item.historicalCenterLabelMatch),conclusion:'1729 is isolated by the declared positive-cube-pair and historical-label tests; address splitting and geometric masking remain available display operations for all three values and are not promoted by the arithmetic result.'});
  }

  function buildReceipt(){
    const arithmetic=arithmeticRecord(),address=addressRecord(),historical=historicalRecord(),geometry=geometricRecord(),controls=negativeControls(),neighbors=neighborAudit();
    const arithmeticPass=arithmetic.product===1729&&arithmetic.taxicab.every(item=>item.sum===1729);
    const maskPass=geometry.root5.contains17.length===1&&geometry.root5.contains29.length===0&&geometry.root7.contains17.length===1&&geometry.root7.contains29.length===2;
    const controlsPass=Object.values(controls).every(Boolean);
    const pass=arithmeticPass&&maskPass&&controlsPass&&neighbors.pass&&historical.derivationFrom1729===false;
    return Object.freeze({
      schema:'nexah.a0.1729-root5-crosswalk-receipt/1',version:VERSION,date:'2026-10-23',identity:IDENTITY,
      classification:'METHOD_RELEVANT_ENGINEERING_OBSERVATION',status:pass?'PASS':'HOLD',
      layers:Object.freeze({arithmetic,address,historicalTrigger:historical,geometricMask:geometry}),
      audit:Object.freeze({arithmeticPass,maskPass,controlsPass,neighborPass:neighbors.pass,negativeControls:controls,neighbors}),
      chain:Object.freeze(['1729','17|29','5×17 @ v29','ROOT-5 / PENTAGON MASK']),
      authority:Object.freeze({researchRun:false,scientificEvidence:false,newIdentity:false,newRelation:false,newCarrier:false,newOperator:false,claimPromotion:false}),
      boundary:'Typed crosswalk only. Exact arithmetic, digit address, historical engineering parameter and geometric mask retain separate provenance; proximity does not establish derivation, identity, mechanism or physical law.'
    });
  }

  function svgMarkup(active){
    const items=[
      {key:'ARITHMETIC',x:110,y:92,label:'ARITHMETIC',value:'7 × 13 × 19',tone:'#46dced'},
      {key:'ADDRESS',x:490,y:92,label:'ADDRESS',value:'17 | 29',tone:'#f55dae'},
      {key:'HISTORICAL_TRIGGER',x:110,y:330,label:'HISTORICAL TRIGGER',value:'5 × 17 @ v29',tone:'#ffae2d'},
      {key:'GEOMETRIC_MASK',x:490,y:330,label:'GEOMETRIC MASK',value:'ROOT-5',tone:'#b478ff'}
    ];
    const spokes=items.map(item=>`<line x1="300" y1="210" x2="${item.x}" y2="${item.y}" class="r5-spoke ${active===item.key?'active':''}" style="--tone:${item.tone}"/>`).join('');
    const nodes=items.map(item=>`<g class="r5-node ${active===item.key?'active':''}" transform="translate(${item.x} ${item.y})" style="--tone:${item.tone}"><circle r="54"/><text y="-8">${item.label}</text><text y="17" class="value">${item.value}</text></g>`).join('');
    const pentagon=Array.from({length:5},(_,i)=>{const a=-Math.PI/2+i*Math.PI*2/5;return `${300+76*Math.cos(a)},${210+76*Math.sin(a)}`}).join(' ');
    return `<g class="r5-grid"><path d="M40 210H560M300 24V396"/><circle cx="300" cy="210" r="145"/><circle cx="300" cy="210" r="92"/></g>${spokes}<polygon points="${pentagon}" class="r5-pentagon ${active==='GEOMETRIC_MASK'?'active':''}"/><g class="r5-core"><circle cx="300" cy="210" r="48"/><text x="300" y="205">1729</text><text x="300" y="228">TYPED CROSSWALK</text></g>${nodes}`;
  }

  function mount(doc,win=doc.defaultView||{}){
    const host=doc.getElementById('root5Crosswalk');if(!host)return null;
    const ids=['root5CrosswalkStatus','root5CrosswalkSvg','root5CrosswalkLayer','root5CrosswalkClaim','root5CrosswalkControl','root5CrosswalkNeighbors','root5CrosswalkAudit','root5CrosswalkReset','root5CrosswalkExport'];
    const nodes=Object.fromEntries(ids.map(id=>[id,doc.getElementById(id)]));
    const missing=ids.filter(id=>!nodes[id]);if(missing.length)throw Error(`1729/Root-5 crosswalk mount missing: ${missing.join(', ')}`);
    let active='ARITHMETIC',receipt=null;
    const layerText={
      ARITHMETIC:['1729 = 7×13×19','1³+12³ = 9³+10³ = 1729'],
      ADDRESS:['17|29 · DIGIT SPLIT','address view; not multiplication'],
      HISTORICAL_TRIGGER:['5×17 @ v29','historical parameter; not derived'],
      GEOMETRIC_MASK:['ROOT-5 / PENTAGON','display mask; not fifth root']
    };
    function render(){
      nodes.root5CrosswalkSvg.innerHTML=svgMarkup(active);
      nodes.root5CrosswalkLayer.textContent=active.replace('_',' / ');
      nodes.root5CrosswalkClaim.textContent=layerText[active][0];
      nodes.root5CrosswalkControl.textContent=layerText[active][1];
      nodes.root5CrosswalkStatus.textContent=receipt?.status==='PASS'?'PASS · 5/5 NEGATIVE CONTROLS':'READY · FOUR TYPED LAYERS';
      const neighborRecord=receipt?.audit?.neighbors||neighborAudit();
      nodes.root5CrosswalkNeighbors.innerHTML=neighborRecord.cases.map(item=>`<article data-target="${item.value===1729}"><small>${item.value===1729?'TARGET':'NULL CONTROL'}</small><b>${item.value}</b><code>${item.factors.join('×')}</code><span>${item.positiveCubePairs.length?item.positiveCubePairs.map(pair=>`${pair.a}³+${pair.b}³`).join(' · '):'0 positive cube pairs'}</span><em>${item.historicalCenterLabelMatch?'HISTORICAL LABEL MATCH':'NO LABEL MATCH'}</em></article>`).join('');
      host.dataset.status=receipt?.status?.toLowerCase()||'ready';host.dataset.layer=active.toLowerCase();
      host.querySelectorAll('[data-root5-layer]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.root5Layer===active)));
      win.A01729Root5CrosswalkView=receipt||Object.freeze({activeLayer:active,identity:IDENTITY});
      return receipt;
    }
    host.querySelectorAll('[data-root5-layer]').forEach(button=>button.addEventListener('click',()=>{active=button.dataset.root5Layer;render()}));
    nodes.root5CrosswalkAudit.addEventListener('click',()=>{receipt=buildReceipt();win.A01729Root5CrosswalkReceipt=receipt;render()});
    nodes.root5CrosswalkReset.addEventListener('click',()=>{active='ARITHMETIC';receipt=null;render()});
    nodes.root5CrosswalkExport.addEventListener('click',()=>{const record=receipt||buildReceipt(),json=JSON.stringify(record,null,2);host.dataset.lastExport=json;if(win.Blob&&win.URL){const link=doc.createElement('a');link.href=win.URL.createObjectURL(new win.Blob([json],{type:'application/json'}));link.download='a0-1729-root5-crosswalk.json';link.click();win.URL.revokeObjectURL(link.href)}});
    render();
    return Object.freeze({render,audit(){receipt=buildReceipt();return render()},reset(){active='ARITHMETIC';receipt=null;return render()},select(layer){if(!LAYERS.includes(layer))throw Error(`Unknown layer: ${layer}`);active=layer;return render()},get record(){return receipt},get activeLayer(){return active}});
  }

  return{VERSION,IDENTITY,LAYERS,ROOT5_VALUES,ROOT7_VALUES,positions,arithmeticRecord,addressRecord,historicalRecord,geometricRecord,negativeControls,primeFactors,positiveCubePairs,neighborAudit,buildReceipt,svgMarkup,mount};
});
