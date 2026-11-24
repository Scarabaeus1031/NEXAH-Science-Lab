(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.A0TwinPrimeBaseGridAudit=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const SCHEMA='a0.twin-prime-base-grid-audit/1.0.0';
  const LIMIT=1111;
  const MIRROR_SUM=1274;
  const BASES=Object.freeze([3,7,11,37]);
  const ROLES=Object.freeze(['L','C','R']);
  const DIGITS='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  function ensure(condition,code){if(!condition)throw new TypeError(code)}
  function isPrime(n){
    if(!Number.isInteger(n)||n<2)return false;
    for(let divisor=2;divisor*divisor<=n;divisor+=1)if(n%divisor===0)return false;
    return true;
  }
  function primeFactors(n){
    const factors=[];
    let value=n;
    for(let divisor=2;divisor*divisor<=value;divisor+=1){
      while(value%divisor===0){factors.push(divisor);value/=divisor}
    }
    if(value>1)factors.push(value);
    return factors;
  }
  function baseString(n,base){
    ensure(Number.isInteger(n)&&n>=0,'TWIN_BASE_VALUE_INVALID');
    ensure(Number.isInteger(base)&&base>=2&&base<=37,'TWIN_BASE_RADIX_INVALID');
    let value=n,result='';
    do{const digit=value%base;result=(digit<36?DIGITS[digit]:'{36}')+result;value=Math.floor(value/base)}while(value);
    return result;
  }
  function address(n){return{mod7:n%7,mod11:n%11}}
  function packetAddress(role,residue){
    const roleIndex=ROLES.indexOf(role);
    ensure(roleIndex>=0,'TWIN_PACKET_ROLE_INVALID');
    return roleIndex*37+((residue%37)+37)%37;
  }
  function packetRecord(values){
    return ROLES.map((role,index)=>{
      const value=values[index],residue=((value%37)+37)%37;
      return{role,value,residue,address:packetAddress(role,residue)};
    });
  }
  function buildPairs(){
    const primes=[];
    for(let value=2;value<=LIMIT;value+=1)if(isPrime(value))primes.push(value);
    const pairs=[];
    for(let index=0;index<primes.length-1;index+=1){
      if(primes[index+1]-primes[index]===2)pairs.push({
        ordinal:pairs.length+1,
        values:[primes[index],primes[index+1]],
        positions:[index+1,index+2]
      });
    }
    return pairs;
  }
  const PAIRS=Object.freeze(buildPairs().map(pair=>Object.freeze(pair)));
  function inspect(ordinal){
    const pair=PAIRS[Number(ordinal)-1];
    ensure(pair,'TWIN_PAIR_ORDINAL_INVALID');
    const [left,right]=pair.values;
    const [leftPosition,rightPosition]=pair.positions;
    const next=PAIRS[pair.ordinal];
    const mirror=[MIRROR_SUM-right,MIRROR_SUM-left];
    const sourcePacket=[left,left+1,right];
    const mirrorPacket=[MIRROR_SUM-right,MIRROR_SUM-(left+1),MIRROR_SUM-left];
    const sourceRegister=packetRecord(sourcePacket);
    const mirrorRegister=packetRecord(mirrorPacket);
    const divisibleBy3=mirror.find(value=>value>3&&value%3===0)??null;
    return{
      ...pair,
      value_addresses:pair.values.map(address),
      index_addresses:pair.positions.map(address),
      index_factors:pair.positions.map(primeFactors),
      superprime_flags:pair.positions.map(isPrime),
      bases:Object.fromEntries(BASES.map(base=>[base,{
        values:pair.values.map(value=>baseString(value,base)),
        positions:pair.positions.map(value=>baseString(value,base))
      }])),
      mirror:{
        operator:'R637(n)=1274-n',
        image:mirror,
        gap_preserved:mirror[1]-mirror[0]===2,
        twin_preserved:mirror.every(isPrime),
        divisible_by_3_witness:divisibleBy3
      },
      packet:{
        source:sourceRegister,
        mirror:mirrorRegister,
        full:isPrime(left)&&isPrime(right),
        matrix:sourceRegister.map((source,index)=>({
          source_role:source.role,
          source_address:source.address,
          mirror_role:ROLES[2-index],
          mirror_address:mirrorRegister[2-index].address
        }))
      },
      next_gap:next?{
        next_ordinal:next.ordinal,
        next_pair:next.values,
        integers_strictly_between:next.values[0]-right-1,
        prime_positions_without_twin_member:[rightPosition+1,next.positions[0]-1]
      }:null
    };
  }
  function layerRecords(layer){
    const residue=Number(layer);
    ensure(Number.isInteger(residue)&&residue>=0&&residue<37,'TWIN_LAYER_INVALID');
    return PAIRS.flatMap(pair=>{
      const values=[pair.values[0],pair.values[0]+1,pair.values[1]];
      return values.map((value,index)=>({pair:pair.ordinal,role:ROLES[index],value,residue:value%37})).filter(row=>row.residue===residue);
    });
  }
  function buildReceipt(){
    const rows=PAIRS.map(pair=>inspect(pair.ordinal));
    const largest=rows.filter(row=>row.next_gap).sort((a,b)=>b.next_gap.integers_strictly_between-a.next_gap.integers_strictly_between)[0];
    return validate({
      schema:SCHEMA,
      status:'PASS_FINITE_TWIN_BASE_GRID_AUDIT',
      limit:LIMIT,
      pair_count:PAIRS.length,
      distinct_prime_endpoints:new Set(PAIRS.flatMap(pair=>pair.values)).size,
      count_base_crosswalk:Object.fromEntries(BASES.map(base=>[base,baseString(PAIRS.length,base)])),
      limit_base_crosswalk:Object.fromEntries(BASES.map(base=>[base,baseString(LIMIT,base)])),
      largest_gap:{
        after_pair:largest.ordinal,
        left_pair:largest.values,
        right_pair:largest.next_gap.next_pair,
        integers_strictly_between:largest.next_gap.integers_strictly_between,
        prime_positions:largest.next_gap.prime_positions_without_twin_member
      },
      seam11:{
        pair:30,
        values:[659,661],
        positions:[120,121],
        positions_base11:['AA','100'],
        square:11**2,
        center:660,
        center_mod11:660%11
      },
      mirror_control:{
        operator:'R637(n)=1274-n',
        pairs_tested:rows.length,
        twin_images:rows.filter(row=>row.mirror.twin_preserved).length,
        reason:'For every non-exceptional twin pair p,p+2, p≡2 mod3. Since 1274≡2 mod3, one reflected value is 0 mod3. The two small pairs fail separately as finite checks.'
      },
      grid:{
        carrier:'Z7 × Z11 × Z37',
        visible_slice:'Z7 × Z11',
        nodes_per_layer:77,
        layers:37,
        total_nodes:2849,
        address_types:['PRIME_VALUE_RESIDUE','PRIME_INDEX_RESIDUE']
      },
      packet_register:{roles:ROLES,states:111,address_rule:'role_index*37 + residue'},
      matrix111:{width:111,height:111,cells:12321,role:'SOURCE_PACKET_TO_R637_MIRROR_PACKET'},
      authority:{
        identity_reuse:['MOD:NUMBER_VIEW_SUITE','NEXAH:PBM:V1','NN:CRT_QRT_37_CARRIER_LADDER'],
        new_canonical_ids:[],relation_changes:[],aliases:[],study_activation:false,
        claim_boundary:'Finite enumeration and representation audit. Bases change notation; residues change coordinates; neither creates primality.'
      }
    });
  }
  function validate(record){
    ensure(record?.schema===SCHEMA,'TWIN_AUDIT_SCHEMA_INVALID');
    ensure(record.status==='PASS_FINITE_TWIN_BASE_GRID_AUDIT','TWIN_AUDIT_STATUS_INVALID');
    ensure(record.pair_count===40&&record.distinct_prime_endpoints===79,'TWIN_AUDIT_COUNT_INVALID');
    ensure(record.count_base_crosswalk[3]==='1111'&&record.count_base_crosswalk[11]==='37'&&record.count_base_crosswalk[37]==='13','TWIN_AUDIT_BASE_COUNT_INVALID');
    ensure(record.limit_base_crosswalk[11]==='920'&&record.limit_base_crosswalk[37]==='U1','TWIN_AUDIT_BASE_LIMIT_INVALID');
    ensure(record.largest_gap.after_pair===30&&record.largest_gap.integers_strictly_between===147&&record.largest_gap.prime_positions.join(',')==='122,139','TWIN_AUDIT_GAP_INVALID');
    ensure(record.seam11.positions_base11.join(',')==='AA,100'&&record.seam11.square===121&&record.seam11.center_mod11===0,'TWIN_AUDIT_11_SEAM_INVALID');
    ensure(record.mirror_control.pairs_tested===40&&record.mirror_control.twin_images===0,'TWIN_AUDIT_MIRROR_INVALID');
    ensure(record.grid.nodes_per_layer===77&&record.grid.layers===37&&record.grid.total_nodes===2849&&record.grid.address_types.length===2,'TWIN_AUDIT_GRID_INVALID');
    ensure(record.packet_register.states===111&&record.matrix111.cells===12321,'TWIN_AUDIT_PACKET_INVALID');
    ensure(record.authority.new_canonical_ids.length===0&&record.authority.relation_changes.length===0&&record.authority.aliases.length===0&&!record.authority.study_activation,'TWIN_AUDIT_AUTHORITY_INVALID');
    return record;
  }

  function mount(host){
    if(!host)return null;
    const receipt=buildReceipt();
    let ordinal=30;
    let layer37=32;
    const q=selector=>host.querySelector(selector);
    function gridSvg(row){
      const width=560,height=430,pad=42,dx=(width-2*pad)/6,dy=(height-2*pad)/10;
      const nodes=[];
      for(let y=0;y<11;y+=1)for(let x=0;x<7;x+=1){
        nodes.push(`<circle cx="${(pad+x*dx).toFixed(2)}" cy="${(height-pad-y*dy).toFixed(2)}" r="3"/>`);
      }
      const marks=[];
      function mark(point,label,kind,index,layerMatch){
        const x=pad+point.mod7*dx,y=height-pad-point.mod11*dy;
        const cls=kind==='value'?'twin-grid__value':'twin-grid__index';
        const offset=index===0?-9:13;
        marks.push(`<g class="${cls}${layerMatch?' is-layer':''}"><circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${kind==='value'?12:7}"/><text x="${x.toFixed(2)}" y="${(y+offset).toFixed(2)}" text-anchor="middle">${label}</text></g>`);
      }
      row.value_addresses.forEach((point,index)=>mark(point,String(row.values[index]),'value',index,row.values[index]%37===layer37));
      row.index_addresses.forEach((point,index)=>mark(point,'p'+row.positions[index],'index',index,row.positions[index]%37===layer37));
      return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Mod 7 mal Mod 11 Raster für Primwerte und Primindizes"><g class="twin-grid__nodes">${nodes.join('')}</g>${marks.join('')}<text x="42" y="22">y = mod 11</text><text x="455" y="420">x = mod 7</text></svg>`;
    }
    function matrixSvg(row){
      const size=360,pad=28,span=size-2*pad;
      const lines=Array.from({length:12},(_,index)=>{
        const value=pad+index*span/11;
        return `<path d="M${value.toFixed(2)} ${pad}V${size-pad}M${pad} ${value.toFixed(2)}H${size-pad}"/>`;
      }).join('');
      const points=row.packet.matrix.map(link=>{
        const x=pad+link.source_address/110*span;
        const y=size-pad-link.mirror_address/110*span;
        return `<g><circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="7"/><text x="${(x+9).toFixed(2)}" y="${(y-8).toFixed(2)}">${link.source_role}→${link.mirror_role}</text></g>`;
      }).join('');
      return `<svg viewBox="0 0 ${size} ${size}" role="img" aria-label="111 mal 111 Operator-Matrix vom Quellpaket zum Spiegelpaket"><g class="twin-matrix__grid">${lines}</g><g class="twin-matrix__points">${points}</g><text x="${size/2}" y="${size-4}" text-anchor="middle">source packet address · 0…110</text><text x="8" y="${size/2}" transform="rotate(-90 8 ${size/2})" text-anchor="middle">mirror packet address · 0…110</text></svg>`;
    }
    function factorText(values,factors,flags){
      return values.map((value,index)=>`${value} = ${factors[index].join('·')||value}${flags[index]?' · Primindex':''}`).join(' | ');
    }
    function render(){
      const row=inspect(ordinal);
      q('[data-twin-select]').value=String(ordinal);
      q('[data-twin-ordinal]').textContent=`Paar ${ordinal}/40`;
      q('[data-twin-pair]').textContent=`(${row.values.join(', ')})`;
      q('[data-twin-positions]').textContent=`p₍${row.positions[0]}₎ / p₍${row.positions[1]}₎`;
      q('[data-twin-factors]').textContent=factorText(row.positions,row.index_factors,row.superprime_flags);
      q('[data-twin-grid]').innerHTML=gridSvg(row);
      q('[data-twin-grid-readout]').textContent=`Wertadressen: ${row.values.map((value,index)=>value+'→('+row.value_addresses[index].mod7+','+row.value_addresses[index].mod11+')').join(' · ')} | Indexadressen: ${row.positions.map((value,index)=>value+'→('+row.index_addresses[index].mod7+','+row.index_addresses[index].mod11+')').join(' · ')}`;
      q('[data-twin-bases]').innerHTML=BASES.map(base=>`<tr><th scope="row">Basis ${base}</th><td>${row.bases[base].values.join(' / ')}</td><td>${row.bases[base].positions.join(' / ')}</td></tr>`).join('');
      q('[data-twin-mirror]').textContent=`${row.values.join('↔')} → ${row.mirror.image.join('↔')} · Abstand 2: JA · Twin Prime: ${row.mirror.twin_preserved?'JA':'NEIN'} · durch 3 teilbar: ${row.mirror.divisible_by_3_witness}`;
      q('[data-twin-gap]').textContent=row.next_gap?`Bis zum nächsten Paar ${row.next_gap.next_pair.join('↔')}: ${row.next_gap.integers_strictly_between} innere Zahlen · Primpositionen ${row.next_gap.prime_positions_without_twin_member.join('–')}`:'Letztes Twin-Paar bis 1111.';
      q('[data-twin-packet]').innerHTML=row.packet.source.map(item=>`<article data-role="${item.role}"><small>${item.role}</small><strong>${item.value}</strong><span>r₃₇=${item.residue}</span><code>#${item.address}</code></article>`).join('');
      q('[data-twin-packet-status]').textContent=`PRIME PACKET ${row.packet.full?'FULL':'OPEN'} · 111 addresses = 3 roles × 37 residues`;
      q('[data-twin-layer]').value=String(layer37);
      q('[data-twin-layer-value]').textContent=String(layer37);
      const layerRows=layerRecords(layer37);
      q('[data-twin-layer-records]').textContent=layerRows.length?layerRows.map(item=>`P${item.pair}:${item.role}=${item.value}`).join(' · '):'Keine Twin-Paketadresse dieser endlichen Population.';
      q('[data-twin-layer-special]').textContent=layer37===32?'BOUNDARY MATCH · 661 und 809 liegen beide auf r₃₇=32 · Δ=148=4×37=2×74':'Schicht zeigt endliche L/C/R-Paketadressen; gleiche Restklasse ist keine Zahlenidentität.';
      q('[data-twin-matrix]').innerHTML=matrixSvg(row);
      q('[data-twin-matrix-readout]').textContent=row.packet.matrix.map(link=>`${link.source_role}#${link.source_address}→${link.mirror_role}#${link.mirror_address}`).join(' · ');
      host.dataset.seam11=String(ordinal===30);
    }
    const select=q('[data-twin-select]');
    select.innerHTML=PAIRS.map(pair=>`<option value="${pair.ordinal}">${String(pair.ordinal).padStart(2,'0')} · ${pair.values.join(' / ')}</option>`).join('');
    host.addEventListener('click',event=>{
      const button=event.target.closest('[data-twin-jump]');
      if(!button)return;
      const jump=button.dataset.twinJump;
      ordinal=jump==='prev'?Math.max(1,ordinal-1):jump==='next'?Math.min(PAIRS.length,ordinal+1):Number(jump);
      render();
    });
    select.addEventListener('change',()=>{ordinal=Number(select.value);render()});
    q('[data-twin-layer]').addEventListener('input',event=>{layer37=Number(event.target.value);render()});
    host.addEventListener('click',event=>{
      const button=event.target.closest('[data-twin-layer-jump]');
      if(!button)return;
      layer37=Number(button.dataset.twinLayerJump);
      render();
    });
    render();
    return{receipt,inspect,layerRecords,select(value){ordinal=Number(value);render()},setLayer(value){layer37=Number(value);render()},get state(){return{ordinal,layer37}}};
  }
  function mountAll(doc=globalThis.document){if(!doc)return[];return[...doc.querySelectorAll('[data-twin-prime-base-audit]')].map(mount)}
  if(typeof document!=='undefined'){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>mountAll(document),{once:true});else mountAll(document)}

  return{SCHEMA,LIMIT,MIRROR_SUM,BASES,ROLES,PAIRS,isPrime,primeFactors,baseString,address,packetAddress,layerRecords,inspect,buildReceipt,validate,mount,mountAll};
});
