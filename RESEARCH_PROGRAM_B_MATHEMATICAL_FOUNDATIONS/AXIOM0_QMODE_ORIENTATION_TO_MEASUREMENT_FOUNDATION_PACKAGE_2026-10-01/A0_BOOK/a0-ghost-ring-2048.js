(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.A0GhostRing2048=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const N=2048,HALF=1024,PACKETS=64,PACKET_SIZE=32;
  const mod=(x,n)=>((x%n)+n)%n;
  function antipode(index){return mod(Number(index)+HALF,N);}
  function packet(index){return Math.floor(mod(Number(index),N)/PACKET_SIZE);}
  function angle(index){return 2*Math.PI*mod(Number(index),N)/N;}
  function threePiWitness(){return Object.freeze({lift:'3π',visible_angle:'π',turns:1,residual:'π',index:HALF,packet:32});}
  function tokenAudit(){
    const tokens=Object.freeze([8,6,4,2,3,8]);
    return Object.freeze({
      source:'2^3 | 2·3 | 2²(i) | 2(j) | 3 | 2³(k)',
      tokens,
      ijk_product:4*2*3*8,
      arithmetic_minus_parse:8-6-(4*2*3*8),
      status:'SEPARATOR_VIEW_HELD_NO_2048_IDENTITY'
    });
  }
  function receipt(index=0){
    const p=mod(Number(index),N),q=antipode(p);
    return Object.freeze({
      carrier:N,power:'2^11',cursor:p,antipode:q,cursor_packet:packet(p),antipode_packet:packet(q),
      halves:Object.freeze([HALF,HALF]),packetization:`${PACKETS}×${PACKET_SIZE}=${N}`,
      pc_ratio:64/64,three_pi:threePiWitness(),token_audit:tokenAudit(),
      type_boundary:'ANGLE_ADDRESS_FREQUENCY_REMAIN_DISTINCT',graph_delta:Object.freeze({entities:0,relations:0,aliases:0})
    });
  }
  function verify(){
    const t=threePiWitness(),a=tokenAudit(),r=receipt(37);
    const checks={
      carrier_is_2_pow_11:N===2**11,
      two_halves_close:HALF+HALF===N,
      packetization_closes:PACKETS*PACKET_SIZE===N,
      pc_normalizes:64/64===1,
      antipode_is_involution:antipode(antipode(37))===37,
      three_pi_projects_to_antipode:t.index===HALF&&t.visible_angle==='π',
      token_product_is_192:a.ijk_product===192,
      arithmetic_parse_is_negative_190:a.arithmetic_minus_parse===-190,
      token_grammar_does_not_equal_carrier:a.ijk_product!==N,
      graph_delta_zero:Object.values(r.graph_delta).every(v=>v===0)
    };
    return Object.freeze({ok:Object.values(checks).every(Boolean),checks});
  }
  function renderSvg(index=0,showThreePi=false){
    const r=receipt(index),cx=430,cy=255,rad=174;
    let ticks='';
    for(let i=0;i<PACKETS;i++){
      const a=-Math.PI/2+2*Math.PI*i/PACKETS,x1=cx+Math.cos(a)*(rad-10),y1=cy+Math.sin(a)*(rad-10),x2=cx+Math.cos(a)*(rad+7),y2=cy+Math.sin(a)*(rad+7),half=i<32?'#e968df':'#48b9ff';
      ticks+=`<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" stroke="${half}" stroke-width="${i%8===0?4:2}"/>`;
    }
    const point=(idx,rr=rad)=>{const a=-Math.PI/2+angle(idx);return [cx+Math.cos(a)*rr,cy+Math.sin(a)*rr];};
    const [px,py]=point(r.cursor),[qx,qy]=point(r.antipode),[tx,ty]=point(HALF,rad+32);
    const witness=showThreePi?`<path class="gsr-winding" d="M430 77 A178 178 0 1 1 429.9 77 A178 178 0 1 1 430 433"/><circle class="gsr-three" cx="${tx.toFixed(2)}" cy="${ty.toFixed(2)}" r="10"/><text class="gsr-three-label" x="${(tx+18).toFixed(2)}" y="${(ty+5).toFixed(2)}">3π → π · INDEX 1024 · +1 TURN WITNESS</text>`:'';
    return `<svg viewBox="0 0 900 520" role="img" aria-label="2048 Ghost Ring with two 1024-address memory halves"><defs><filter id="gsrGlow"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect class="gsr-frame" x="20" y="20" width="860" height="480" rx="22"/><text class="gsr-kicker" x="48" y="62">GHOST SNAKE · FINITE RING ADDRESS</text><text class="gsr-title" x="48" y="102">2048 = 2¹¹ = 1024 + 1024</text><path class="gsr-half gsr-m0" d="M256 255a174 174 0 0 1 348 0"/><path class="gsr-half gsr-m1" d="M604 255a174 174 0 0 1-348 0"/>${ticks}<line class="gsr-diameter" x1="256" y1="255" x2="604" y2="255"/><text class="gsr-half-label" x="430" y="145" text-anchor="middle">M₀ · 1024</text><text class="gsr-half-label" x="430" y="382" text-anchor="middle">M₁ · 1024</text><circle class="gsr-cursor" cx="${px.toFixed(2)}" cy="${py.toFixed(2)}" r="10"/><circle class="gsr-antipode" cx="${qx.toFixed(2)}" cy="${qy.toFixed(2)}" r="10"/><path class="gsr-chord" d="M${px.toFixed(2)} ${py.toFixed(2)}L${qx.toFixed(2)} ${qy.toFixed(2)}"/><text class="gsr-read" x="48" y="462">p=${r.cursor} · packet ${r.cursor_packet}</text><text class="gsr-read" x="852" y="462" text-anchor="end">p+1024=${r.antipode} · packet ${r.antipode_packet}</text>${witness}</svg>`;
  }
  function mount(doc){
    const host=doc&&doc.getElementById('ghost-ring-2048');if(!host)return null;
    const svg=doc.getElementById('gsrSvg'),slider=doc.getElementById('gsrCursor'),cursor=doc.getElementById('gsrCursorOut'),anti=doc.getElementById('gsrAntipode'),pack=doc.getElementById('gsrPacket'),winding=doc.getElementById('gsrWinding'),status=doc.getElementById('gsrStatus');
    let index=0,showThreePi=false;
    function render(){const r=receipt(index);svg.innerHTML=renderSvg(index,showThreePi).replace(/^<svg[^>]*>|<\/svg>$/g,'');slider.value=index;cursor.textContent=String(r.cursor);anti.textContent=String(r.antipode);pack.textContent=`${r.cursor_packet} ↔ ${r.antipode_packet}`;winding.textContent=showThreePi?'3π → π · +1 TURN HELD':'DIRECT ADDRESS VIEW';status.textContent=showThreePi?'3π LIFT WITNESS':'2048 FINITE RETURN';}
    slider.addEventListener('input',e=>{index=mod(Number(e.target.value),N);showThreePi=false;render();});
    doc.querySelectorAll('[data-gsr-action]').forEach(b=>b.addEventListener('click',()=>{const a=b.dataset.gsrAction;if(a==='step')index=mod(index+1,N);if(a==='antipode')index=antipode(index);if(a==='three-pi'){index=HALF;showThreePi=true;}if(a==='reset'){index=0;showThreePi=false;}render();}));
    render();return Object.freeze({render,get state(){return receipt(index);}});
  }
  return Object.freeze({N,HALF,PACKETS,PACKET_SIZE,mod,antipode,packet,angle,threePiWitness,tokenAudit,receipt,verify,renderSvg,mount});
});
