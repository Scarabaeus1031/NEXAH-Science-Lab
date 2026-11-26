(function(){
  'use strict';
  const M=globalThis.A0PrimecubeModel;
  const esc=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const project=({x,y,z})=>({x:455+(x-y)*19,y:322+(x+y)*7-z*22});
  const backProject=({x,y,z})=>project({x:10-x,y:10-y,z});
  function yawCamera(degrees){
    if(degrees%360===0)return project;
    if(degrees===180)return backProject;
    const angle=degrees*Math.PI/180;
    const cosine=Math.cos(angle),sine=Math.sin(angle),center=(M.CUBE_SIZE-1)/2;
    return ({x,y,z})=>project({
      x:center+(x-center)*cosine-(y-center)*sine,
      y:center+(x-center)*sine+(y-center)*cosine,
      z
    });
  }
  const point=(item,classes,r,camera)=>{const p=camera(item.address);return `<circle class="${classes}" cx="${p.x.toFixed(2)}" cy="${p.y.toFixed(2)}" r="${r}"/>`};
  const line=(a,b,klass,camera=project)=>{const p=camera(a),q=camera(b);return `<path class="${klass}" d="M${p.x},${p.y}L${q.x},${q.y}"/>`};
  const formatCount=new Intl.NumberFormat('de-DE',{maximumFractionDigits:2});
  function frame(camera){
    let out='';
    for(const x of [0,10])for(const y of [0,10])out+=line({x,y,z:0},{x,y,z:10},'pc-shadow-frame',camera);
    for(const z of [0,9,10]){for(const x of [0,10])out+=line({x,y:0,z},{x,y:10,z},z===9?'pc-shadow-plane':'pc-shadow-frame',camera);for(const y of [0,10])out+=line({x:0,y,z},{x:10,y,z},z===9?'pc-shadow-plane':'pc-shadow-frame',camera)}
    return out;
  }
  function unionFlag(tensionToggle,camera){
    const front=(x,z)=>({x,y:10,z});
    const face=[[2,3],[8,3],[8,7],[2,7]].map(([x,z])=>{
      const p=camera(front(x,z));
      return `${p.x},${p.y}`;
    }).join(' ');
    const diagonals=line(front(2,3),front(8,7),'flag-diagonal',camera)+line(front(2,7),front(8,3),'flag-diagonal',camera);
    const hitArea=line(front(2,3),front(8,7),'flag-hit',camera)+line(front(2,7),front(8,3),'flag-hit',camera);
    const cross=line(front(2,5),front(8,5),'flag-cross',camera)+line(front(5,3),front(5,7),'flag-cross',camera);
    const caption=camera(front(5,2.2));
    const control=tensionToggle?`role="button" tabindex="0" aria-label="Union J / Flag · Diagonalen spannen" aria-controls="loki-root-mask-grid" aria-pressed="${tensionToggle.getAttribute('aria-pressed')}"`:'aria-hidden="true"';
    return `<g class="pc-shadow-union-flag" data-pc-union-flag ${control}><polygon points="${face}"/>${diagonals}${cross}${tensionToggle?hitArea:''}<text x="${caption.x}" y="${caption.y}" text-anchor="middle">UNION J / FLAG</text></g>`;
  }
  function plaFlag(camera){
    const bands=['#2856c2','#f6f4ee','#d9364d'].map((fill,i)=>{
      const right=8-i*2,left=right-2;
      const points=[[right,3],[left,3],[left,7],[right,7]].map(([x,z])=>{
        const p=camera({x,y:0,z});
        return `${p.x},${p.y}`;
      }).join(' ');
      return `<polygon fill="${fill}" points="${points}"/>`;
    }).join('');
    const caption=camera({x:5,y:0,z:2.2});
    return `<g class="pc-shadow-pla" data-pc-pla-flag aria-hidden="true">${bands}<text x="${caption.x}" y="${caption.y}" text-anchor="middle">PLA</text></g>`;
  }
  function renderLokiPath(root,state){
    const layer=root.querySelector('[data-pc-loki-path]');
    const {dx,dy}=state;
    const path=[{x:0,y:0,z:10},{x:dx,y:0,z:10},{x:dx,y:dy,z:10}].map(address=>{
      const p=state.camera(address);
      return `${p.x},${p.y}`;
    }).join(' ');
    layer.innerHTML=dx||dy?`<polyline points="${path}"/>`:'';
  }
  function axis(){
    const nodes=Array.from({length:11},(_,i)=>`<g transform="translate(${260+i*39} 541)"><circle class="${i===5?'dot':''}" r="7"/><text class="pc-shadow-label ${i===5?'gold':''}" text-anchor="middle" y="22">${i===5?'·':i<5?i+1:11-i}</text></g>`).join('');
    return `<g class="pc-shadow-dot-axis">${nodes}<text class="pc-shadow-label strong" x="455" y="585" text-anchor="middle">5 + · + 5 = 11 · TEN FINGERS / ONE SPLINTER AXIS</text></g>`;
  }
  function cikada(){
    return `<g class="pc-shadow-cikada" transform="translate(46 442)"><rect width="169" height="66" rx="10"/><rect class="outside" x="169" width="169" height="66" rx="10"/><rect x="338" width="169" height="66" rx="10"/><text x="84" y="21" text-anchor="middle">CI · INSIDE</text><text x="253" y="21" text-anchor="middle" class="accent">KA · OUTSIDE</text><text x="422" y="21" text-anchor="middle">DA · INSIDE′</text><text x="84" y="43" text-anchor="middle">1111 · RECORD</text><text x="253" y="43" text-anchor="middle">1112…1331 · ADDRESS</text><text x="422" y="43" text-anchor="middle">PROJECTION RETURN</text><text x="253" y="59" text-anchor="middle" class="pc-shadow-label">RETURN ≠ CARRIER REENTRY</text></g>`;
  }
  function packingInset(record,packing){
    const x0=735,y0=54;
    if(packing==='mask-extrusion'){
      let cells='';
      for(let y=0;y<11;y++)for(let x=0;x<11;x++){
        const selected=(x!==5&&y!==5)||(x===5&&y===5);
        cells+=`<rect class="${selected?'carrier':'shadow'}" x="${x0+x*11}" y="${y0+y*11}" width="9" height="9" rx="1"/>`;
      }
      return `<g class="pc-shadow-inset"><text x="${x0}" y="${y0-12}">REPACKED MASK · 101 / 20</text>${cells}<text x="${x0}" y="${y0+140}">101×11 + 20×11 = 1331</text></g>`;
    }
    if(packing==='z-slices'){
      let bars='';
      for(let z=0;z<11;z++){const yy=y0+z*13,carrier=z<9?121:z===9?22:0,shadow=121-carrier;bars+=`<rect class="carrier" x="${x0}" y="${yy}" width="${carrier}" height="8"/><rect class="shadow" x="${x0+carrier}" y="${yy}" width="${shadow}" height="8"/><text x="${x0-18}" y="${yy+7}">z${z}</text>`}
      return `<g class="pc-shadow-inset"><text x="${x0}" y="${y0-12}">NATIVE Z-SLICES</text>${bars}<text x="${x0}" y="${y0+158}">9×121 + 22 | 99 + 121</text></g>`;
    }
    return `<g class="pc-shadow-inset"><text x="${x0}" y="${y0-12}">FULL ADDRESS ENVELOPE</text><rect class="carrier" x="${x0}" y="${y0}" width="101" height="24"/><rect class="shadow" x="${x0+101}" y="${y0}" width="20" height="24"/><text x="${x0}" y="${y0+42}">1111 / 1331 = 101 / 121</text><text x="${x0}" y="${y0+58}">220 / 1331 = 20 / 121</text></g>`;
  }
  function sliceShape(axis,index,items,camera){
    const [u,v]=['x','y','z'].filter(dimension=>dimension!==axis);
    const end=M.CUBE_SIZE-1;
    const frame=[[0,0],[end,0],[end,end],[0,end]].map(([a,b])=>{
      const p=camera({[axis]:index,[u]:a,[v]:b});
      return `${p.x},${p.y}`;
    }).join(' ');
    return `<polygon class="pc-slice-plane" points="${frame}"/>${items.map(item=>point(item,'pc-slice-point',3,camera)).join('')}`;
  }
  function renderSlicePreview(root,state){
    const {slice,camera}=state;
    const {axis,index,previewIndex,groups}=slice;
    const layer=root.querySelector('[data-pc-cube-slice-preview]');
    layer.innerHTML=previewIndex===null||previewIndex===index?'':sliceShape(axis,previewIndex,groups[previewIndex],camera);
  }
  function renderSlices(root,state,record){
    const {slice}=state;
    if(!slice)return;
    const {panel,axis,mask,index,bars}=slice;
    const size=M.CUBE_SIZE;
    const groups=Array.from({length:size},()=>[]);
    if(mask!=='shadow'){
      for(let n=1;n<=M.MAX_N;n++){
        const address=M.fullCubeAddress(n);
        groups[address[axis]].push({address});
      }
    }
    if(mask!=='carrier'){
      for(const item of record.visibleShadow)groups[item.address[axis]].push(item);
    }
    slice.groups=groups;
    const counts=groups.map(group=>group.length);
    const end=size-1;
    const layer=root.querySelector('[data-pc-cube-slice]');
    layer.innerHTML=sliceShape(axis,index,groups[index],state.camera);
    renderSlicePreview(root,state);
    panel.querySelector('[data-pc-slice-current]').textContent=`${axis}=${index} · ${counts[index]} von ${size**2} Zellen markiert`;
    panel.querySelector('[data-pc-slice-prev]').disabled=index===0;
    panel.querySelector('[data-pc-slice-next]').disabled=index===end;
    bars.forEach((bar,i)=>{
      const count=counts[i];
      bar.setAttribute('aria-current',String(i===index));
      bar.setAttribute('aria-label',`${axis}=${i}, ${count} markierte Zellen`);
      bar.style.setProperty('--fill',`${100*count/size**2}%`);
      bar.querySelector('strong').textContent=count;
      bar.querySelector('small').textContent=`${axis}=${i}`;
    });

    const mean=counts.reduce((sum,count)=>sum+count,0)/size;
    const spectrum=Array.from({length:Math.floor(size/2)},(_,i)=>{
      const bin=i+1;
      let real=0,imag=0;
      counts.forEach((count,j)=>{
        const angle=2*Math.PI*bin*j/size;
        real+=(count-mean)*Math.cos(angle);
        imag-=(count-mean)*Math.sin(angle);
      });
      return {bin,amplitude:2*Math.hypot(real,imag)/size};
    });
    const peak=spectrum.reduce((best,term)=>term.amplitude>best.amplitude?term:best);
    panel.querySelector('[data-pc-slice-mean]').textContent=`Mittelwert (k=0) · ${formatCount.format(mean)} Zellen`;
    panel.querySelector('[data-pc-slice-spectrum]').innerHTML=spectrum.map(({bin,amplitude})=>
      `<li><span>k=${bin}</span><span class="pc-slice-frequency" aria-hidden="true"><i style="--fill:${peak.amplitude?100*amplitude/peak.amplitude:0}%"></i></span><strong>${formatCount.format(amplitude)}</strong></li>`
    ).join('');
    panel.querySelector('[data-pc-slice-result]').textContent=peak.amplitude<1e-9
      ?'Konstante Folge. Das Spektrum zeigt nur den Mittelwert.'
      :`Stärkster Anteil abseits des Mittelwerts: k=${peak.bin}, also ${peak.bin===1?'eine Welle':peak.bin+' Wellen'} pro 11 Slices.`;
  }
  function bindSlices(root,state){
    const panel=root.querySelector('[data-pc-slices]');
    if(!panel)return;
    const axis=panel.querySelector('[data-pc-slice-axis]');
    const mask=panel.querySelector('[data-pc-slice-mask]');
    const counts=panel.querySelector('[data-pc-slice-counts]');
    counts.innerHTML=Array.from({length:M.CUBE_SIZE},(_,index)=>
      `<li><button type="button" data-pc-slice-index="${index}" aria-controls="shadow-cube-3d"><span class="pc-slice-column" aria-hidden="true"><i></i></span><strong></strong><small></small></button></li>`
    ).join('');
    const bars=Array.from(counts.querySelectorAll('button'));
    state.slice={panel,index:M.CUBE_SIZE-2,axis:axis.value,mask:mask.value,bars,previewIndex:null};
    const update=()=>renderSlices(root,state,M.shadowCubeEnvelopeRecord(state.reach));
    function preview(index){
      state.slice.previewIndex=index;
      renderSlicePreview(root,state);
    }
    const selectSlice=index=>{
      state.slice.index=index;
      state.slice.previewIndex=null;
      update();
    };
    bars.forEach((bar,index)=>{
      bar.addEventListener('pointerenter',event=>{
        if(event.pointerType!=='touch')preview(index);
      });
      bar.addEventListener('pointerleave',()=>preview(null));
    });
    counts.addEventListener('click',event=>{
      const bar=event.target.closest('[data-pc-slice-index]');
      if(bar)selectSlice(Number(bar.dataset.pcSliceIndex));
    });
    axis.addEventListener('change',()=>{
      state.slice.axis=axis.value;
      update();
    });
    mask.addEventListener('change',()=>{
      state.slice.mask=mask.value;
      update();
    });
    panel.querySelector('[data-pc-slice-prev]').addEventListener('click',()=>selectSlice(state.slice.index-1));
    panel.querySelector('[data-pc-slice-next]').addEventListener('click',()=>selectSlice(state.slice.index+1));
  }
  function cubeViewName(state){
    if(state.lokiCompare)return 'Drehwinkel '+state.yaw+'°';
    return state.face==='front'?'Union J / Flag vorne':'Pla hinten, Blau–Weiß–Rot';
  }
  function render(root,state){
    const record=M.shadowCubeEnvelopeRecord(state.reach),allCarrier=state.mode!=='shadow',allShadow=state.mode!=='carrier';
    const {camera}=state;
    const faceName=cubeViewName(state);
    const carrier=[];
    if(allCarrier){for(let n=1;n<=1111;n++){const address=M.fullCubeAddress(n);carrier.push(point({address},'pc-shadow-carrier',n>1089?2.45:1.15,camera))}}
    const shadow=allShadow?record.shadow.map((item,index)=>point(item,`pc-shadow-address${index<record.revealed?' is-reached':''}${item.n===1210||item.n===1331?' is-seam':''}`,item.n===1210||item.n===1331?4:2.2,camera)).join(''):'';
    const traceItems=[{n:1111,address:M.fullCubeAddress(1111)},...record.visibleShadow],trace=traceItems.map(item=>{const p=camera(item.address);return `${p.x.toFixed(2)},${p.y.toFixed(2)}`}).join(' ');
    const labels=record.checkpoints.map(item=>{const p=camera(item.address),active=item.n<=1111||item.n<=1111+record.revealed;return `<g opacity="${active?1:.3}"><circle cx="${p.x}" cy="${p.y}" r="5" fill="${item.n===1111?'#55d9f2':'#ffd35a'}" stroke="#fff"/><text class="pc-shadow-label ${item.n===1210||item.n===1331?'gold':''}" x="${p.x+8}" y="${p.y-8}">${item.n} · ${item.role.replaceAll('_',' ')}</text></g>`}).join('');
    root.querySelector('[data-pc-shadow-stage]').innerHTML=`<svg viewBox="0 0 910 610" role="group" aria-label="Prime Cube und Shadow Cube · ${faceName}"><g aria-hidden="true"><text class="pc-shadow-label strong" x="24" y="27">${state.mode.toUpperCase()} · REACH ${record.revealed}/220</text><text class="pc-shadow-label" x="886" y="27" text-anchor="end">11 × 11 × 11 · 1331 ADDRESSES</text>${frame(camera)}<g>${carrier.join('')}${shadow}</g>${trace?`<polyline class="pc-shadow-path" points="${trace}"/>`:''}${labels}${packingInset(record,state.packing)}${cikada()}${axis()}</g><g data-pc-cube-slice aria-hidden="true"></g><g data-pc-cube-slice-preview aria-hidden="true"></g><g data-pc-loki-path aria-hidden="true"></g>${state.face==='front'?unionFlag(state.tensionToggle,camera):plaFlag(camera)}<g data-pc-overlay-markers></g></svg>`;
    renderOverlayPair(root,state);
    renderSlices(root,state,record);
    renderLokiPath(root,state);
    const current=record.revealed?record.visibleShadow.at(-1):record.checkpoints[0],phase=record.revealed===0?'CARRIER_BOUNDARY':record.revealed<=99?'LAYER_10_REMAINDER':'LAYER_11_FULL';
    const pack=record.packingViews.find(item=>item.id===state.packing),balance=record.volumeBalance;
    root.querySelector('[data-pc-shadow-detail]').innerHTML=`<div class="pc-eyebrow">Address envelope record</div><h3>${esc(current.n)}</h3><span class="pc-shadow-status">${phase.replaceAll('_',' ')}</span><dl><dt>Mode</dt><dd>${state.mode.toUpperCase()}</dd><dt>Packing</dt><dd>${pack.label}<br>${pack.equation}</dd><dt>Reach</dt><dd>${record.revealed} / 220 shadow addresses</dd><dt>Address</dt><dd>[${current.address.x},${current.address.y},${current.address.z}]</dd><dt>Base 11</dt><dd>${M.toBase11(current.n)}₁₁ · addr ${M.toBase11(current.n-1)}₁₁</dd><dt>Carrier</dt><dd>${balance.carrier.reducedRatio} = ${balance.carrier.ratio.toFixed(7)}</dd><dt>Shadow</dt><dd>${balance.shadow.reducedRatio} = ${balance.shadow.ratio.toFixed(7)}</dd><dt>−0.834</dt><dd>separate cosine input<br>gap ${balance.cosineComparator.absoluteGap.toFixed(7)}</dd><dt>Dot</dt><dd>${record.reach.notation}<br>${record.reach.meaning.replaceAll('_',' ')}</dd><dt>CIKADA</dt><dd>CI → KA → DA<br>INSIDE → OUTSIDE → INSIDE′</dd><dt>Authority</dt><dd>0 new IDs · 0 relations</dd></dl><p class="pc-detail-boundary"><b>${pack.addressing.replaceAll('_',' ')}.</b> ADDRESS EXISTS · RECORD ABSENT. No primality or constellation predicate is evaluated for this shadow address.</p>`;
    root.querySelector('[data-pc-shadow-reach]').value=String(record.revealed);root.querySelector('[data-pc-shadow-reach-out]').textContent=`${record.revealed} / 220`;
    root.querySelectorAll('[data-pc-shadow-mode]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.pcShadowMode===state.mode)));
    root.querySelectorAll('[data-pc-shadow-packing]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.pcShadowPacking===state.packing)));
  }
  function sharedPrimeRecords(){
    return M.sieve(1000).map((n,i)=>({
      id:'PC1111:N'+String(n).padStart(4,'0'),
      n,index:i+1,residue:n%7,address:M.cubeAddress(n)
    }));
  }
  function setHelixBackLink(link,record){
    link.href='A0_HELIX_VIEW_ADAPTER.html?'+new URLSearchParams({helix:record.id})+'#helix-prime-record';
    link.textContent='Zur Helix-Ebene '+record.index+' ↗';
  }
  function renderYzGrid(grid,records,size){
    const at=new Map(records.map(record=>[record.address.y+','+record.address.z,record]));
    const cell=(y,z)=>{
      const record=at.get(y+','+z);
      if(!record)return '<span class="pc-shadow-yz-empty" aria-hidden="true"></span>';
      const label=record.n+' · Rest '+record.residue+' mod 7 · z='+z+' · Loki-Schnitt y='+y+' öffnen';
      return `<button type="button" data-pc-yz-record="${record.n}" data-pc-yz-residue="${record.residue}" aria-pressed="false" aria-label="${label}" title="${label}">${record.n}</button>`;
    };
    const axis=label=>`<span class="pc-shadow-yz-axis" aria-hidden="true">${label}</span>`;
    const columns=Array.from({length:size},(_,y)=>y);
    grid.innerHTML=columns.slice().reverse().map(z=>axis(z)+columns.map(y=>cell(y,z)).join('')).join('')
      +axis('z / y')+columns.map(axis).join('');
  }
  function xZeroFace(camera){
    const end=M.CUBE_SIZE-1;
    const side=[[0,0],[end,0],[end,end],[0,end]].map(([y,z])=>{
      const p=camera({x:0,y,z});
      return p.x+','+p.y;
    }).join(' ');
    return `<polygon class="pc-shadow-helix-face" points="${side}"/>`;
  }
  function renderSharedPrimeMarker(record,camera,label=record.id,direction=1){
    const p=camera(record.address);
    const anchor=direction>0?'start':'end';
    return `<g class="pc-shadow-pair-marker prime" data-pc-yz-residue="${record.residue}" data-pc-helix-cube-number="${record.n}">${point(record,'halo',10,camera)}${point(record,'pin',4,camera)}<text x="${p.x+12*direction}" y="${p.y-9}" text-anchor="${anchor}">${label}</text></g>`;
  }
  function renderOverlayPair(root,state){
    const markers=root.querySelector('[data-pc-overlay-markers]');
    const stage=markers.ownerSVGElement;
    const {pair,mode,camera}=state;
    const faceName=cubeViewName(state);
    if(state.lokiCompare){
      const [lila,pink]=state.lokiRecords;
      const left=camera(lila.address).x<=camera(pink.address).x;
      const segment=line(lila.address,pink.address,'pc-shadow-loki-segment',camera);
      markers.innerHTML=xZeroFace(camera)+segment
        +renderSharedPrimeMarker(lila,camera,lila.n,left?-1:1)+renderSharedPrimeMarker(pink,camera,pink.n,left?1:-1);
      stage.setAttribute('aria-label','3D-Würfel · '+faceName+' · 397 und 419 · Strecke entlang y von 3 bis 5 bei x=0, z=3');
      return;
    }
    if(state.helixReturn){
      const record=state.helixReturn;
      const {x,y,z}=record.address;
      const face=x===0?xZeroFace(camera):'';
      markers.innerHTML=mode==='shadow'?'':face+renderSharedPrimeMarker(record,camera);
      stage.setAttribute('aria-label','3D-Würfel · '+faceName+(mode==='shadow'?'':' · '+record.id+' · Adresse ('+x+', '+y+', '+z+')'));
      return;
    }
    if(!pair){
      markers.innerHTML='';
      stage.setAttribute('aria-label','Prime Cube und Shadow Cube · '+faceName);
      return;
    }
    const {prime,shadow}=pair;
    const names=[];
    const label=(item,label,kind,direction)=>{
      names.push(label+' '+item.n);
      const p=camera(item.address);
      const anchor=direction>0?'start':'end';
      return `<g class="pc-shadow-pair-marker ${kind}" data-pc-pair-number="${item.n}" role="button" tabindex="0" aria-label="${label} ${item.n} · Gemeinsames Rasterfeld markieren">${point(item,'marker-hit',18,camera)}${point(item,'halo',10,camera)}${point(item,'pin',4,camera)}<text x="${p.x+13*direction}" y="${p.y-9}" text-anchor="${anchor}">${label} · ${item.n}</text></g>`;
    };
    const connector=mode==='envelope'?line(prime.address,shadow.address,'pc-shadow-pair-line',camera):'';
    markers.innerHTML=connector
      +(mode!=='shadow'?label(prime,'PRIME CUBE','prime',1):'')
      +(mode!=='carrier'?label(shadow,'SHADOW CUBE','shadow',-1):'');
    stage.setAttribute('aria-label','3D-Würfel · '+faceName+' · Markiert: '+names.join(' und '));
  }
  function bindSliceOverlay(root,state,stopLokiCompare){
    const overlay=root.querySelector('[data-pc-shadow-overlay]');
    if(!overlay)return;
    const slider=overlay.querySelector('[data-pc-overlay-shift]');
    const sliderY=overlay.querySelector('[data-pc-overlay-shift-y]');
    const stage=overlay.querySelector('[data-pc-overlay-stage]');
    const shiftValue=overlay.querySelector('[data-pc-overlay-shift-value]');
    const shiftYValue=overlay.querySelector('[data-pc-overlay-shift-y-value]');
    const count=overlay.querySelector('[data-pc-overlay-count]');
    const pair=overlay.querySelector('[data-pc-overlay-pair]');
    const jump=overlay.querySelector('[data-pc-overlay-jump]');
    const yzGrid=overlay.querySelector('[data-pc-yz-grid]');
    const sideStage=overlay.querySelector('[data-pc-loki-side-stage]');
    const sideRow=overlay.querySelector('[data-pc-loki-side-row]');
    const helixReadout=overlay.querySelector('[data-pc-helix-return]');
    const helixBack=overlay.querySelector('[data-pc-helix-back]');
    const helixSelect=overlay.querySelector('[data-pc-helix-select]');
    for(const record of state.sharedPrimes){
      helixSelect.add(new Option(record.n+' · Ebene '+record.index,record.id));
    }
    const returnMarkers='[data-pc-side-number], [data-pc-pair-number]';
    const size=M.CUBE_SIZE, center=Math.floor(size/2), cell=20;
    const shadow=M.shadowCubeEnvelopeRecord().shadow.filter(item=>item.address.z===10);
    const selected={x:8,y:center};
    const directions={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};

    renderYzGrid(yzGrid,state.xZeroRecords,size);
    const yzButtons=yzGrid.querySelectorAll('[data-pc-yz-record]');

    function lokiSlice(y,prime,shadow){
      const last=size-1, grid=size*cell;
      const cells=Array.from({length:size*size},(_,index)=>{
        const x=index%size, z=Math.floor(index/size);
        const kind=M.cubeNumber({x,y,z})===null?'shadow':'carrier';
        return `<rect class="${kind}" x="${x*cell}" y="${(last-z)*cell}" width="${cell}" height="${cell}"/>`;
      }).join('');
      const marker=(item,kind)=>{
        const {x,z}=item.address;
        const cx=(x+.5)*cell, cy=(last-z+.5)*cell;
        const name=kind==='prime'?'Prime Cube':'Shadow Cube';
        const direction=x<=center?1:-1;
        const textX=cx+13*direction, textY=cy+4;
        const hitX=cx-(direction===1?12:51);
        const isSharedPrime=item.id!==undefined;
        const attribute=isSharedPrime?'data-pc-helix-side-number':'data-pc-side-number';
        const control=isSharedPrime?'':`role="button" tabindex="0" aria-label="${name} ${item.n} · Gemeinsames Rasterfeld markieren"`;
        const color=isSharedPrime?`data-pc-yz-residue="${item.residue}"`:'';
        return `<g class="pc-shadow-pair-marker ${kind}" ${color} ${attribute}="${item.n}" ${control}><rect class="marker-hit" x="${hitX}" y="${cy-12}" width="63" height="24"/><circle class="halo" cx="${cx}" cy="${cy}" r="8"/><circle class="pin" cx="${cx}" cy="${cy}" r="3.5"/><text x="${textX}" y="${textY}" text-anchor="${direction===1?'start':'end'}">${item.n}</text></g>`;
      };
      const description=shadow?`Prime Cube ${prime.n} und Shadow Cube ${shadow.n}`:prime?.id??'kein gemeinsames Feld';
      const markers=(prime?marker(prime,'prime'):'')+(shadow?marker(shadow,'shadow'):'');
      return `<svg viewBox="-30 -5 ${grid+37} ${grid+31}" role="group" aria-label="Loki-Seitenwand bei y=${y}: ${description}">${cells}<rect class="frame" width="${grid}" height="${grid}"/><g class="axes" aria-hidden="true"><text x="-9" y="14" text-anchor="end">${last}</text><text x="-9" y="${grid-3}" text-anchor="end">0</text><text x="-9" y="${grid/2}" text-anchor="end">z</text><text x="10" y="${grid+17}" text-anchor="middle">0</text><text x="${grid/2}" y="${grid+17}" text-anchor="middle">x</text><text x="${grid-10}" y="${grid+17}" text-anchor="middle">${last}</text></g>${markers}</svg>`;
    }
    overlay.querySelectorAll('[data-pc-loki-compare]').forEach(panel=>{
      const record=state.xZeroRecords.find(item=>item.n===Number(panel.dataset.pcLokiCompare));
      panel.querySelector('[data-pc-loki-compare-stage]').innerHTML=lokiSlice(record.address.y,record);
      const link=document.createElement('a');
      setHelixBackLink(link,record);
      panel.append(link);
    });

    function renderSide(){
      const helix=state.helixReturn;
      helixSelect.value=helix?.id??'';
      yzButtons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.pcYzRecord===String(helix?.n))));
      const y=helix?helix.address.y:selected.y;
      const selectedPair=state.pair;
      sideRow.textContent=!helix&&selectedPair&&selectedPair.shadow.address.y!==y
        ?`x–z · Prime y=${y} · Shadow y=${selectedPair.shadow.address.y}`
        :'x–z · y='+y;
      sideStage.innerHTML=helix?lokiSlice(y,helix):lokiSlice(y,selectedPair?.prime,selectedPair?.shadow);
      helixReadout.hidden=!helix;
      pair.hidden=Boolean(helix);
      jump.hidden=Boolean(helix)||!state.pair;
      if(helix){
        const {x,y,z}=helix.address;
        helixReadout.querySelector('[data-pc-helix-record]').textContent=helix.id+' · Adresse ('+x+', '+y+', '+z+')';
        setHelixBackLink(helixBack,helix);
      }
    }
    function addresses(x,y){
      const address={x,y,z:8};
      return {prime:{address,n:M.cubeNumber(address)},shadow:shadow[(y-state.dy)*size+x-state.dx]};
    }
    function fullCube(){
      if(state.mode==='envelope')return false;
      state.mode='envelope';
      render(root,state);
      return true;
    }
    function selectSharedPrime(record){
      state.helixReturn=record??null;
      stage.querySelector('[data-cell-x][tabindex="0"]')?.setAttribute('aria-pressed',String(!record));
      renderSide();
      const leftCompare=stopLokiCompare();
      if(!fullCube()&&!leftCompare)renderOverlayPair(root,state);
    }
    yzGrid.addEventListener('click',event=>{
      const button=event.target.closest('[data-pc-yz-record]');
      if(button)selectSharedPrime(state.xZeroRecords.find(record=>record.n===Number(button.dataset.pcYzRecord)));
    });
    helixSelect.addEventListener('change',()=>{
      selectSharedPrime(state.sharedPrimes.find(record=>record.id===helixSelect.value));
    });
    function select(x,y,focus=false){
      if(focus)state.helixReturn=null;
      selected.x=x;
      selected.y=y;
      const previous=stage.querySelector('[data-cell-x][tabindex="0"]');
      if(previous){
        previous.setAttribute('aria-pressed','false');
        previous.setAttribute('tabindex','-1');
      }
      const target=stage.querySelector(`[data-cell-x="${x}"][data-cell-y="${y}"]`);
      target.setAttribute('aria-pressed',String(!state.helixReturn));
      target.setAttribute('tabindex','0');
      if(focus)target.focus({preventScroll:true});
      state.pair=addresses(x,y);
      const describe=item=>`${item.n} [${item.address.x},${item.address.y},${item.address.z}]`;
      pair.textContent=`Ausgewählt · Prime Cube ${describe(state.pair.prime)} und Shadow ${describe(state.pair.shadow)}.`;
      renderSide();
      const leftCompare=focus&&stopLokiCompare();
      if(!(focus&&fullCube())&&!leftCompare)renderOverlayPair(root,state);
      return target;
    }

    function returnToGrid(marker){
      const target=select(selected.x,selected.y,true);
      target.scrollIntoView({block:marker.hasAttribute('data-pc-pair-number')?'center':'nearest',inline:'nearest'});
      if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
      target.animate([{fill:'#fff2b6',strokeWidth:4},{fill:'#fff2b645',strokeWidth:2.5}],650);
    }

    function update(){
      const dx=slider.valueAsNumber,dy=sliderY.valueAsNumber;
      state.dx=dx;
      state.dy=dy;
      renderLokiPath(root,state);
      const width=size+dx,height=size+dy,shared=(size-dx)*(size-dy);
      let grid='';
      let cells='';
      for(let y=0;y<height;y++)for(let x=0;x<width;x++){
        const prime=x<size&&y<size,shifted=x>=dx&&y>=dy;
        if(!prime&&!shifted)continue;
        const band=prime&&shifted?'both':prime?'carrier':'shadow';
        grid+=`<rect class="${band}" x="${x*cell}" y="${y*cell}" width="${cell}" height="${cell}"/>`;
      }
      for(let y=dy;y<size;y++)for(let x=dx;x<size;x++){
        const {prime,shadow}=addresses(x,y);
        cells+=`<rect class="pc-shadow-overlay-cell" x="${x*cell}" y="${y*cell}" width="${cell}" height="${cell}" data-cell-x="${x}" data-cell-y="${y}" role="button" tabindex="-1" aria-pressed="false" aria-label="Prime Cube ${prime.n}, Shadow ${shadow.n}"/>`;
      }
      stage.innerHTML=`<svg viewBox="-1 -1 ${width*cell+2} ${height*cell+2}" role="group" aria-label="${shared} gemeinsame Felder"><g aria-hidden="true">${grid}</g>${cells}</svg>`;
      shiftValue.textContent=dx===0?'0':'+'+dx;
      shiftYValue.textContent=dy===0?'0':'+'+dy;
      count.textContent=`${width} Spalten × ${height} Zeilen · ${size-dx} × ${size-dy} gemeinsame Felder = ${shared}`;
      jump.hidden=shared===0;
      if(shared===0){
        state.pair=null;
        pair.textContent='Die beiden Schnitte haben keine gemeinsamen Felder.';
        renderSide();
        renderOverlayPair(root,state);
        return;
      }
      select(Math.max(dx,selected.x),Math.max(dy,selected.y));
    }
    stage.addEventListener('click',event=>{
      const target=event.target.closest('[data-cell-x]');
      if(target)select(Number(target.dataset.cellX),Number(target.dataset.cellY),true);
    });
    stage.addEventListener('keydown',event=>{
      if(!event.target.matches('[data-cell-x]'))return;
      if(event.key==='Enter'||event.key===' '){
        event.preventDefault();
        select(selected.x,selected.y,true);
      }
      const step=directions[event.key];
      if(!step)return;
      event.preventDefault();
      const x=Math.max(state.dx,Math.min(size-1,selected.x+step[0]));
      const y=Math.max(state.dy,Math.min(size-1,selected.y+step[1]));
      select(x,y,true);
    });
    root.addEventListener('click',event=>{
      const marker=event.target.closest(returnMarkers);
      if(marker)returnToGrid(marker);
    });
    root.addEventListener('keydown',event=>{
      if(!event.target.matches(returnMarkers)||(event.key!=='Enter'&&event.key!==' '))return;
      event.preventDefault();
      returnToGrid(event.target);
    });
    jump.addEventListener('click',fullCube);
    const changeOffset=()=>{
      state.helixReturn=null;
      stopLokiCompare();
      update();
    };
    slider.addEventListener('input',changeOffset);
    sliderY.addEventListener('input',changeOffset);
    overlay.querySelector('[data-pc-helix-stage]').addEventListener('click',fullCube);
    update();
  }
  function returnCube(shape,coords,n){
    const [xMax,yMax,zMax]=shape.map(size=>size-1);
    const camera=({x,y,z})=>({x:130+(x-y)*8,y:143+(x+y)*3-z*9});
    let edges='';
    for(const x of [0,xMax])for(const y of [0,yMax]){
      edges+=line({x,y,z:0},{x,y,z:zMax},'pc-q-edge',camera);
    }
    for(const z of [0,zMax]){
      for(const x of [0,xMax])edges+=line({x,y:0,z},{x,y:yMax,z},'pc-q-edge',camera);
      for(const y of [0,yMax])edges+=line({x:0,y,z},{x:xMax,y,z},'pc-q-edge',camera);
    }
    const [x,y,z]=coords,address={x,y,z};
    const guides=line({x,y,z:0},address,'pc-q-guide',camera)
      +line({x,y:0,z:0},{x,y,z:0},'pc-q-guide',camera)
      +line({x:0,y:0,z:0},{x,y:0,z:0},'pc-q-guide',camera);
    const p=camera(address);
    return `<svg viewBox="25 24 210 185" role="img" aria-label="${n} bei (${coords.join(', ')})">${edges}${guides}${point({address},'pc-q-pin',5,camera)}<text class="pc-q-label" x="${p.x+9}" y="${p.y-7}">${n}</text></svg><output>${n} · (${coords.join(', ')})</output>`;
  }
  function bindGreyQ(root){
    const panel=root.querySelector('[data-pc-q-return]');
    if(!panel)return;
    const open=root.querySelector('[data-pc-q-open]');
    const close=panel.querySelector('[data-pc-q-close]');
    const prime=panel.querySelector('[data-pc-q-prime]');
    const crt=panel.querySelector('[data-pc-q-crt]');
    const next=panel.querySelector('[data-pc-q-next]');
    const back=panel.querySelector('[data-pc-q-back]');
    const step=panel.querySelector('[data-pc-q-step]');
    const title=panel.querySelector('h3');
    const q=M.qCubeRecord();
    const start=496;
    let current=start;
    function drawQ(){
      const {x,y,z}=M.cubeAddress(current);
      const {mod7,mod11,mod13}=M.qCubeAddress(current);
      prime.innerHTML=returnCube([M.CUBE_SIZE,M.CUBE_SIZE,M.CUBE_SIZE],[x,y,z],current);
      crt.innerHTML=returnCube(q.shape,[mod7,mod11,mod13],current);
      back.disabled=current===start;
      next.disabled=current!==start;
    }
    function applyQ(operator){
      const previous=current;
      current=M.mod(current*operator.multiplier,q.modulus);
      step.textContent=`${previous} × ${operator.multiplier} mod ${q.modulus} = ${current}`;
      drawQ();
      (next.disabled?back:next).focus({preventScroll:true});
    }
    function showQ(){
      panel.hidden=false;
      open.setAttribute('aria-expanded','true');
      drawQ();
    }
    open.addEventListener('click',()=>{
      showQ();
      title.focus({preventScroll:true});
      panel.scrollIntoView({block:'start'});
    });
    close.addEventListener('click',()=>{
      panel.hidden=true;
      open.setAttribute('aria-expanded','false');
      open.focus();
    });
    next.addEventListener('click',()=>applyQ(q.forward));
    back.addEventListener('click',()=>applyQ(q.inverse));
    if(location.hash==='#grey-q-return')showQ();
  }
  function boot(){
    const root=document.querySelector('[data-pc-shadow-envelope]');if(!root||!M)return;
    const main=root.closest('[data-primecube]');
    const tensionToggle=main?.querySelector('[data-pc-root-mask-tension]');
    const sharedPrimes=sharedPrimeRecords();
    const xZeroRecords=sharedPrimes.filter(record=>record.address.x===0&&[5,2,6].includes(record.residue));
    const linkedId=new URLSearchParams(location.search).get('helix');
    const helixReturn=sharedPrimes.find(record=>record.id===linkedId)??null;
    const lokiRecords=[397,419].map(n=>xZeroRecords.find(record=>record.n===n));
    const state={mode:'envelope',packing:'full-envelope',reach:220,tensionToggle,face:'front',camera:project,dx:6,dy:0,sharedPrimes,xZeroRecords,helixReturn,lokiRecords,lokiCompare:false,yaw:0},slider=root.querySelector('[data-pc-shadow-reach]');
    bindSlices(root,state);
    bindGreyQ(root);
    const faces=root.querySelectorAll('[data-pc-shadow-face]');
    const lokiToggle=root.querySelector('[data-pc-loki-3d-toggle]');
    const lokiControls=root.querySelector('[data-pc-loki-3d-controls]');
    const yawInput=root.querySelector('[data-pc-loki-yaw]');
    const yawOutput=root.querySelector('[data-pc-loki-yaw-out]');

    function rotate(yaw){
      state.yaw=yaw;
      const front=Math.cos(yaw*Math.PI/180)>=0;
      state.face=front?'front':'back';
      state.camera=yawCamera(yaw);
      yawInput.value=String(yaw);
      yawOutput.value=yaw+'°';
      faces.forEach(button=>{
        const face=button.dataset.pcShadowFace;
        const active=state.lokiCompare?(face==='front'?yaw%360===0:yaw===180):face===state.face;
        button.setAttribute('aria-pressed',String(active));
      });
      render(root,state);
    }
    function setLokiCompare(active){
      state.lokiCompare=active;
      lokiToggle.setAttribute('aria-pressed',String(active));
      lokiControls.hidden=!active;
      if(active&&state.mode==='shadow')state.mode='envelope';
      rotate(state.face==='front'?0:180);
    }
    function stopLokiCompare(){
      if(!state.lokiCompare)return false;
      setLokiCompare(false);
      return true;
    }
    lokiToggle.addEventListener('click',()=>setLokiCompare(!state.lokiCompare));
    yawInput.addEventListener('input',()=>rotate(yawInput.valueAsNumber));
    const openLokiCompare=()=>{
      if(location.hash==='#primecube-loki-3d'&&!state.lokiCompare)setLokiCompare(true);
    };
    window.addEventListener('hashchange',openLokiCompare);
    root.querySelector('a[href="#primecube-loki-3d"]').addEventListener('click',()=>{if(!state.lokiCompare)setLokiCompare(true)});
    faces.forEach(button=>button.addEventListener('click',()=>rotate(button.dataset.pcShadowFace==='front'?0:180)));
    if(tensionToggle){
      const flag='[data-pc-union-flag]';
      root.addEventListener('click',event=>{
        if(event.target.closest(flag))tensionToggle.click();
      });
      root.addEventListener('keydown',event=>{
        if(!event.target.matches(flag)||(event.key!=='Enter'&&event.key!==' '))return;
        event.preventDefault();
        if(!event.repeat)tensionToggle.click();
      });
      main.addEventListener('click',event=>{
        if(event.target===tensionToggle){
          root.querySelector(flag)?.setAttribute('aria-pressed',tensionToggle.getAttribute('aria-pressed'));
        }
      });
    }
    root.addEventListener('click',event=>{const mode=event.target.closest('[data-pc-shadow-mode]'),packing=event.target.closest('[data-pc-shadow-packing]');if(mode){state.mode=mode.dataset.pcShadowMode;if(state.mode==='shadow'&&stopLokiCompare())return;}if(packing)state.packing=packing.dataset.pcShadowPacking;if(event.target.closest('[data-pc-shadow-grow]'))state.reach=Math.min(220,state.reach+11);if(event.target.closest('[data-pc-shadow-reset]'))state.reach=0;if(event.target.closest('[data-pc-shadow-complete]'))state.reach=220;if(mode||packing||event.target.closest('[data-pc-shadow-grow],[data-pc-shadow-reset],[data-pc-shadow-complete]'))render(root,state)});
    slider.addEventListener('input',()=>{state.reach=Number(slider.value);render(root,state)});render(root,state);
    bindSliceOverlay(root,state,stopLokiCompare);
    openLokiCompare();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
