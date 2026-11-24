(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.A0OrangePackingLadder=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const MODES=Object.freeze({
    E8:Object.freeze({id:'E8',dimension:8,blocks:1,label:'8D · E8 EXACT',equation:'8 = 2³',status:'PROVEN OPTIMAL',neighbors:240,color:'#ff9d3c'}),
    D16:Object.freeze({id:'D16',dimension:16,blocks:2,label:'16D · 2×8 CONTROL',equation:'16 = 2·2³',status:'STAGING / NO OPTIMALITY CLAIM',neighbors:null,color:'#55d7e8'}),
    E8X3:Object.freeze({id:'E8X3',dimension:24,blocks:3,label:'24D · E8³ STAGING',equation:'24 = 3·2³',status:'DIRECT SUM · HAS ROOTS',neighbors:720,color:'#bd8cff'}),
    LEECH:Object.freeze({id:'LEECH',dimension:24,blocks:3,label:'24D · LEECH GLUE',equation:'ΘΛ₂₄ = E₄³ − 720Δ',status:'PROVEN OPTIMAL · ROOTLESS',neighbors:196560,color:'#ffcf4b'})
  });
  function notation(){return Object.freeze({
    intended16:2**3*2,
    parenthesized32:(2**3)**2/2,
    exponentTower256:2**(3**2)/2
  });}
  function mode(id){return MODES[id]||MODES.E8;}
  function boundaryState(dimension){
    if(dimension<8)return 'GAP_TOO_SMALL_FOR_DECLARED_Dn_COMPARATOR';
    if(dimension===8)return 'EXACT_FIT_IN_DECLARED_Dn_COMPARATOR';
    return 'GAP_OVERSHOOTS_IN_DECLARED_Dn_COMPARATOR';
  }
  function receipt(id){
    const m=mode(id),n=notation();
    return Object.freeze({
      mode:m.id,dimension:m.dimension,e8_blocks:m.blocks,equation:m.equation,status:m.status,
      kissing_number:m.neighbors,boundary_comparator:boundaryState(m.dimension),
      intended_midpoint:n.intended16,
      identity_boundary:m.id==='LEECH'?'LEECH_IS_NOT_E8_DIRECT_SUM':'VIEW_DOES_NOT_MERGE_LATTICE_IDENTITIES',
      graph_delta:Object.freeze({entities:0,relations:0,aliases:0})
    });
  }
  function verify(){
    const n=notation(),r=receipt('LEECH');
    const checks={
      intended_notation_is_16:n.intended16===16,
      parenthesized_alternative_is_32:n.parenthesized32===32,
      exponent_tower_alternative_is_256:n.exponentTower256===256,
      ladder_is_8_16_24:[MODES.E8.dimension,MODES.D16.dimension,MODES.E8X3.dimension].join(',')==='8,16,24',
      leech_is_not_direct_sum:r.identity_boundary==='LEECH_IS_NOT_E8_DIRECT_SUM',
      graph_delta_is_zero:Object.values(r.graph_delta).every(x=>x===0)
    };
    return Object.freeze({ok:Object.values(checks).every(Boolean),checks});
  }
  function cubeMarkup(block,index,active){
    const ox=170+index*230,oy=235-index*22,c=active?block.color:'#496173';
    return `<g class="opl-cube" opacity="${active?'1':'.18'}"><path d="M${ox} ${oy}l78-45 78 45-78 45z" fill="${c}" fill-opacity=".24" stroke="${c}"/><path d="M${ox} ${oy}v92l78 45v-92z" fill="${c}" fill-opacity=".11" stroke="${c}"/><path d="M${ox+156} ${oy}v92l-78 45v-92z" fill="${c}" fill-opacity=".18" stroke="${c}"/><circle cx="${ox+78}" cy="${oy+45}" r="10" fill="#ff9d3c"/><text x="${ox+78}" y="${oy+166}" text-anchor="middle">E8 BLOCK ${index+1}</text></g>`;
  }
  function renderSvg(id){
    const m=mode(id),leech=id==='LEECH';
    let blocks='';for(let i=0;i<3;i++)blocks+=cubeMarkup(m,i,i<m.blocks);
    const glue=leech?`<path class="opl-glue" d="M248 280C340 120 478 410 626 258"/><path class="opl-glue" d="M248 280C390 420 500 118 626 258"/><text class="opl-glue-label" x="438" y="92" text-anchor="middle">GLUE / CORRECTION · NOT IDENTITY MERGE</text>`:'';
    return `<svg viewBox="0 0 900 470" role="img" aria-label="${m.label}"><rect class="opl-frame" x="28" y="28" width="844" height="414" rx="22"/><text class="opl-kicker" x="56" y="70">ORANGE BOX · DIMENSION LADDER</text><text class="opl-title" x="56" y="112">${m.label}</text>${blocks}${glue}<path class="opl-axis" d="M85 388H815"/><circle class="opl-step ${m.dimension===8?'is-active':''}" cx="200" cy="388" r="13"/><circle class="opl-step ${m.dimension===16?'is-active':''}" cx="440" cy="388" r="13"/><circle class="opl-step ${m.dimension===24?'is-active':''}" cx="680" cy="388" r="13"/><text class="opl-tick" x="200" y="424" text-anchor="middle">8 = 2³</text><text class="opl-tick" x="440" y="424" text-anchor="middle">16 = 2·2³</text><text class="opl-tick" x="680" y="424" text-anchor="middle">24 = 3·2³</text></svg>`;
  }
  function mount(doc){
    const host=doc&&doc.getElementById('orange-packing-ladder');if(!host)return null;
    const svg=doc.getElementById('oplSvg'),status=doc.getElementById('oplStatus'),dimension=doc.getElementById('oplDimension'),blocks=doc.getElementById('oplBlocks'),equation=doc.getElementById('oplEquation'),neighbors=doc.getElementById('oplNeighbors'),boundary=doc.getElementById('oplBoundary'),identity=doc.getElementById('oplIdentity');
    let selected='D16';
    function render(){const r=receipt(selected),m=mode(selected);svg.innerHTML=renderSvg(selected).replace(/^<svg[^>]*>|<\/svg>$/g,'');status.textContent=m.status;dimension.textContent=String(r.dimension);blocks.textContent=String(r.e8_blocks);equation.textContent=r.equation;neighbors.textContent=r.kissing_number===null?'OPEN / NOT ASSIGNED':new Intl.NumberFormat('de-DE').format(r.kissing_number);boundary.textContent=r.boundary_comparator;identity.textContent=r.identity_boundary;doc.querySelectorAll('[data-opl-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.oplMode===selected)));host.dataset.mode=selected;}
    doc.querySelectorAll('[data-opl-mode]').forEach(b=>b.addEventListener('click',()=>{selected=b.dataset.oplMode;render();}));render();return Object.freeze({render,get state(){return receipt(selected);},select(id){selected=mode(id).id;render();}});
  }
  return Object.freeze({MODES,notation,mode,boundaryState,receipt,verify,renderSvg,mount});
});
