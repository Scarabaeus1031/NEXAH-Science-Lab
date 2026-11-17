(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.A0BoundaryGridAtlas=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const IDENTITY='ART:A0:MATHEMATICAL_JOINTS';
  const MODES=['plates','boundary','elevator','pascal'];
  const STATIONS=['F00','F01','G','F11','F10','W'];
  const DIMENSIONS=[2,3,4,6,8,12,24];
  const HARMONIC_DIMENSIONS=[9,11,12,13];
  const fmt=value=>new Intl.NumberFormat('de-DE').format(value);
  const esc=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  function binom(n,k){
    n=BigInt(n);k=BigInt(k);if(k<0n||k>n)return 0n;if(k>n-k)k=n-k;
    let value=1n;for(let i=1n;i<=k;i+=1n)value=value*(n-i+1n)/i;return value;
  }
  function plateValues(B=100,a=47,b=74){
    B=Number(B);a=Number(a);b=Number(b);
    const values={B,a,b,F00:B*B,F01:B*b,F10:a*B,F11:a*b};
    values.total=(B+a)*(B+b);values.n=a+b;values.shadowN=a+b+2;values.choose=binom(values.n,a);values.shadowChoose=binom(values.shadowN,a+1);
    return values;
  }
  function dimensionFrame(dimension=2,options={}){
    const d=DIMENSIONS.includes(Number(dimension))?Number(dimension):2;
    const axis=28n,total=axis**BigInt(d),slice=axis**BigInt(d-1);
    const banks=d===24?'2 × 12D':d===12?'3 × 4D':d===8?'2 × 4D':d===6?'3 × 2D':d===4?'1 × 4D':`${d} Achsen`;
    return {dimension:d,axisStates:28,total,body:24n*slice,shadow:4n*slice,visibleDimension:Math.min(3,d),hiddenCoordinates:Math.max(0,d-3),banks,shadowVisible:options.shadowVisible!==false,graphDelta:{identities:0,relations:0,aliases:0}};
  }
  const reverseToken=token=>Array.from(String(token)).reverse().join('');
  function harmonicFrame(dimension=12){
    const d=HARMONIC_DIMENSIONS.includes(Number(dimension))?Number(dimension):12,index=HARMONIC_DIMENSIONS.indexOf(d),previous=index>0?HARMONIC_DIMENSIONS[index-1]:null;
    const total=28n**BigInt(d),previousTotal=previous===null?null:28n**BigInt(previous),ratio=previous===null?null:total/previousTotal;
    const roles=[['GAIA FLOOR','4D reference'],['OBSERVER FIELD','DaLi projection zone'],['SOLAR SYNC SHELL','GAIA′ visible shell'],['HARMONIC CROWN','12D–13D display overlay']];
    return {dimension:d,total,previous,previousTotal,ratio,clock:{slot:9,total:14,address:'9|11'},tokens:{source:'JC',reversed:reverseToken('JC'),raw:'MWJWI'},roles,classification:'SOURCE_BOUND_HARMONIC_VIEW / NOT_A_SPECTRAL_CLAIM',graphDelta:{identities:0,relations:0,aliases:0}};
  }
  function harmonicSvgMarkup(data){
    const cx=380,cy=260,radii=[92,145,198,238],colors=['#70d79b','#e8b94f','#49c8e5','#b785f4'];let out='';
    out+='<path d="M380 34 V466 M92 260 H668" class="bga-harmonic-axis"/>';
    data.roles.forEach(([role,note],index)=>{const r=radii[index];out+=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${colors[index]}" class="bga-harmonic-ring"/><text x="${cx}" y="${cy-r+18}" text-anchor="middle" class="bga-harmonic-label">${esc(role)}</text><text x="${cx}" y="${cy-r+33}" text-anchor="middle" class="bga-harmonic-sub">${esc(note)}</text>`;});
    out+=`<circle cx="${cx}" cy="${cy}" r="28" class="bga-harmonic-center"/><text x="${cx}" y="${cy-3}" text-anchor="middle" class="bga-harmonic-center-label">${data.dimension}D</text><text x="${cx}" y="${cy+13}" text-anchor="middle" class="bga-harmonic-center-sub">VIEW</text>`;
    out+='<path d="M380 260 L552 176" class="bga-harmonic-ray"/><circle cx="552" cy="176" r="8" class="bga-harmonic-marker"/><text x="566" y="180" class="bga-svg-label">9|11 SWITCH · JC↔CJ</text>';
    out+='<text x="70" y="452" class="bga-svg-label">MÖBIUS / KLEIN · FFT · PRIME ACTIVATOR = HELD LABELS / NO CLAIM</text>';
    return out;
  }
  function dimensionSvgMarkup(data){
    const d=data.dimension,nodeCount=Math.min(12,Math.max(4,d)),cx=410,cy=260,rx=258,ry=168;
    let out='<rect x="42" y="38" width="736" height="438" rx="24" class="bga-dim-frame"/>';
    out+='<path d="M410 62 V458 M104 260 H716 M194 112 L626 408 M626 112 L194 408" class="bga-dim-axis"/>';
    out+=`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" class="bga-dim-orbit"/><ellipse cx="${cx}" cy="${cy}" rx="154" ry="96" class="bga-dim-orbit inner"/>`;
    const points=[];
    for(let i=0;i<nodeCount;i+=1){const angle=-Math.PI/2+(Math.PI*2*i/nodeCount),x=cx+rx*Math.cos(angle),y=cy+ry*Math.sin(angle);points.push([x,y,angle]);}
    points.forEach(([x,y,angle],index)=>{
      const elbowX=(x+cx)/2,elbowY=(y+cy)/2;
      out+=`<path d="M${cx} ${cy} L${elbowX.toFixed(1)} ${elbowY.toFixed(1)} L${x.toFixed(1)} ${y.toFixed(1)}" class="bga-dim-rail"/>`;
      out+=`<rect x="${(elbowX-4).toFixed(1)}" y="${(elbowY-4).toFixed(1)}" width="8" height="8" transform="rotate(45 ${elbowX.toFixed(1)} ${elbowY.toFixed(1)})" class="bga-dim-elbow"/>`;
      const radius=10+(index%3)*3;out+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${radius}" class="bga-dim-node n${index%4}"/><text x="${x.toFixed(1)}" y="${(y+4).toFixed(1)}" text-anchor="middle" class="bga-dim-node-label">${index+1}</text>`;
      if(data.shadowVisible&&data.hiddenCoordinates>0)out+=`<circle cx="${(x+18*Math.cos(angle+.8)).toFixed(1)}" cy="${(y+18*Math.sin(angle+.8)).toFixed(1)}" r="${Math.max(3,Math.min(8,data.hiddenCoordinates/2))}" class="bga-dim-shadow"/>`;
    });
    out+=`<circle cx="${cx}" cy="${cy}" r="58" class="bga-dim-core"/><circle cx="${cx}" cy="${cy}" r="13" class="bga-resonance"/>`;
    out+=`<text x="${cx}" y="${cy-10}" text-anchor="middle" class="bga-dim-core-label">GAIA′ · ${d}D→${data.visibleDimension}D</text><text x="${cx}" y="${cy+15}" text-anchor="middle" class="bga-dim-core-sub">G · GATHER / GATE</text>`;
    out+=`<text x="66" y="72" class="bga-svg-label">Da=P ↓ · AmmA′ FIBRES · Li=L ↑</text><text x="66" y="454" class="bga-svg-label">${esc(data.banks)} · ${data.hiddenCoordinates} SHADOW COORDINATES · SOURCE RECORD HELD</text>`;
    return out;
  }
  function frame(input={},options={}){
    const values=plateValues(input.B,input.a,input.b);
    const mode=MODES.includes(options.mode)?options.mode:'plates';
    const step=((Number(options.step)||0)%STATIONS.length+STATIONS.length)%STATIONS.length;
    const station=STATIONS[step];
    return {identity:IDENTITY,values,mode,step,station,moving:Boolean(options.moving),pi:Boolean(options.pi),resonance:{x:390,y:278,fixed:true},graphDelta:{identities:0,relations:0,aliases:0}};
  }
  function svgMarkup(data){
    const v=data.values,plateOpacity=data.mode==='boundary'?'.18':'.36';
    const plates=[
      ['F00',v.F00,90,72,'#49c8e5'],['F01',v.F01,460,72,'#e8b94f'],
      ['F10',v.F10,90,318,'#e668a4'],['F11',v.F11,460,318,'#b785f4']
    ];
    const stationPoints={F00:[205,172],F01:[575,172],G:[390,278],F11:[575,418],F10:[205,418],W:[390,500]};
    const cabinY=stationPoints[data.station][1];
    let out='<rect x="42" y="38" width="696" height="472" rx="18" class="bga-frame"/>';
    for(let x=68;x<738;x+=42)out+=`<line x1="${x}" y1="38" x2="${x}" y2="48" class="bga-frame-tick"/>`;
    plates.forEach(([id,value,x,y,color])=>{
      out+=`<rect x="${x}" y="${y}" width="230" height="200" rx="24" fill="${color}" opacity="${plateOpacity}" class="bga-plate"/>`;
      out+=`<text x="${x+24}" y="${y+34}" class="bga-plate-label">${id}</text><text x="${x+24}" y="${y+57}" class="bga-plate-value">${fmt(value)}</text>`;
    });
    out+='<rect x="365" y="54" width="50" height="438" class="bga-gap"/><rect x="374" y="54" width="32" height="438" rx="16" class="bga-shaft"/>';
    out+=`<path d="M205 172 L575 172 L390 278 L575 418 L205 418 L390 500" class="bga-route ${data.moving?'active':''}"/>`;
    out+=`<circle cx="390" cy="${cabinY}" r="13" class="bga-cabin"/><text x="420" y="${cabinY+4}" class="bga-svg-gold">ELEVATOR · ${data.station}</text>`;
    out+='<circle cx="390" cy="278" r="8" class="bga-resonance"/><text x="407" y="263" class="bga-svg-gold">h · RESONANCE / FRAME LOCK</text>';
    out+='<path d="M205 172 Q390 96 575 172 M205 418 Q390 494 575 418" class="bga-join"/>';
    if(data.mode==='pascal'){
      out+=`<path d="M205 418 Q280 278 390 278 M575 172 Q500 278 390 278" class="bga-shadow-edge"/>`;
      out+=`<text x="72" y="540" class="bga-svg-label">PASCAL JOINT · ${v.a}+${v.b}=${v.n} · C(${v.n},${v.a})=C(${v.n},${v.b})</text>`;
    }else if(data.mode==='boundary'){
      out+='<text x="72" y="540" class="bga-svg-label">BOUNDARY VIEW · plates remain distinct · channel width is visible</text>';
    }else if(data.mode==='elevator'){
      out+='<text x="72" y="540" class="bga-svg-label">ELEVATOR VIEW · the cabin changes station; h remains fixed</text>';
    }else out+='<text x="72" y="540" class="bga-svg-label">PLATE VIEW · four exact fields around one retained frame point</text>';
    if(data.pi){
      out+='<g transform="translate(650 278)"><circle r="66" class="bga-pi-ring ir"/><circle r="43" class="bga-pi-ring pt"/><text x="0" y="-8" text-anchor="middle" class="bga-pi-label">Pt / Ir</text><text x="0" y="10" text-anchor="middle" class="bga-pi-label">4-PORT VIEW</text>';
      [[0,-84],[84,0],[0,84],[-84,0]].forEach((p,index)=>{out+=`<circle cx="${p[0]}" cy="${p[1]}" r="9" class="bga-port ${index<3?'active':''}"/>`;});out+='</g>';
    }
    return out;
  }
  function receipt(data,dimension=dimensionFrame(2),harmonic=harmonicFrame(12)){return {schema:'a0.boundary-grid-atlas.return.v1',identity:IDENTITY,classification:'SOURCE_BOUND_VIEW / NOT_A_LAB_RUN / NOT_ADMITTED',station:data.station,mode:data.mode,body:{F00:data.values.F00,F01:data.values.F01,F10:data.values.F10,F11:data.values.F11,total:data.values.total},shadow:{indices:[data.values.a+1,data.values.b+1],n:data.values.shadowN},gate:{indices:[data.values.a,data.values.b],n:data.values.n,choose:data.values.choose.toString()},dimensionalElevator:{dimension:dimension.dimension,axisStates:dimension.axisStates,total:dimension.total.toString(),body:dimension.body.toString(),shadow:dimension.shadow.toString(),projection:`${dimension.dimension}D→${dimension.visibleDimension}D`,record:'AmmA′_FIBRE_SOURCE_HELD'},harmonicSideband:{dimension:harmonic.dimension,total:harmonic.total.toString(),previous:harmonic.previous,ratio:harmonic.ratio===null?null:harmonic.ratio.toString(),clock:'9/14',packedView:'9|11',reverseToken:`${harmonic.tokens.source}↔${harmonic.tokens.reversed}`,rawToken:harmonic.tokens.raw,classification:harmonic.classification},witness:'SOURCE_INPUT_HELD',graphDelta:data.graphDelta};}
  function verify(){
    const v=plateValues(100,47,74),f=frame(v,{mode:'pascal',step:2,pi:true});
    const d12=dimensionFrame(12),d24=dimensionFrame(24),h11=harmonicFrame(11),h12=harmonicFrame(12);
    const checks=[v.F00===10000,v.F01===7400,v.F10===4700,v.F11===3478,v.total===25578,v.n===121,v.shadowN===123,v.choose===9461526413670410452587229673057400n,f.station==='G',f.resonance.fixed,f.graphDelta.identities===0,f.graphDelta.relations===0,d12.total===232218265089212416n,d12.body+d12.shadow===d12.total,d12.hiddenCoordinates===9,d24.banks==='2 × 12D',d24.body+d24.shadow===d24.total,h11.ratio===784n,h12.ratio===28n,h12.tokens.reversed==='CJ',h12.tokens.raw==='MWJWI'];
    return {status:checks.every(Boolean)?'PASS_BOUNDED_GRID_ATLAS_VIEW':'FAIL',checkCount:checks.length,newCanonicalIds:[],relationChanges:[]};
  }
  function mount(doc,win){
    const svg=doc.getElementById('bgaSvg');if(!svg)return null;
    const local={mode:'plates',step:0,moving:false,pi:false,dimension:2,shadowVisible:true,harmonicDimension:12,harmonicVisible:true,input:(win&&win.A0BoundaryState)||{B:100,a:47,b:74}};
    let timer=0;
    const render=()=>{
      const data=frame(local.input,local);svg.innerHTML=svgMarkup(data);
      const status=doc.getElementById('bgaStatus');if(status)status.textContent=`${data.mode.toUpperCase()} · ${data.station} · h LOCKED`;
      const ids={bgaBody:`F00 ${fmt(data.values.F00)} · F01 ${fmt(data.values.F01)} · F10 ${fmt(data.values.F10)} · F11 ${fmt(data.values.F11)}`,bgaShadow:`${data.values.a+1}+${data.values.b+1}=${data.values.shadowN} · DISPLAY ONLY`,bgaGate:`${data.values.a}+${data.values.b}=${data.values.n} · C=${fmt(data.values.choose)}`,bgaWitness:`B=${data.values.B} · a=${data.values.a} · b=${data.values.b} · SOURCE HELD`};
      Object.entries(ids).forEach(([id,value])=>{const node=doc.getElementById(id);if(node)node.textContent=value;});
      doc.querySelectorAll('[data-bga-mode]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.bgaMode===data.mode)));
      doc.querySelectorAll('.bga-dock').forEach(node=>node.classList.toggle('is-active',node.dataset.station===data.station));
      return data;
    };
    const renderDimension=()=>{
      const data=dimensionFrame(local.dimension,{shadowVisible:local.shadowVisible}),dimSvg=doc.getElementById('bgaDimSvg');if(dimSvg)dimSvg.innerHTML=dimensionSvgMarkup(data);
      const values={bgaDimStatus:`${data.dimension}D · 28^${data.dimension} · SOURCE HELD`,bgaDimSource:`G_${data.dimension} = {0…27}^${data.dimension}`,bgaDimCount:`|G_${data.dimension}| = ${fmt(data.total)}`,bgaDimGaia:`P_${data.dimension} : ℝ^${data.dimension} → ℝ^${data.visibleDimension}`,bgaDimAmma:`Faser-Record · ${data.dimension} Koordinaten`,bgaDimDali:'Da=P · Li=L',bgaDimResidual:`Shadow s=x−LPx · ${data.hiddenCoordinates} verdeckte Koordinaten`,bgaDimGate:`Kugelgelenk · ${Math.min(12,Math.max(4,data.dimension))} sichtbare Sammelpunkte`,bgaDimBanks:data.banks,bgaDimBody:`24·28^${data.dimension-1} = ${fmt(data.body)}`,bgaDimShadow:`4·28^${data.dimension-1} = ${fmt(data.shadow)}`};
      Object.entries(values).forEach(([id,value])=>{const node=doc.getElementById(id);if(node)node.textContent=value;});
      doc.querySelectorAll('[data-bga-dim]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.bgaDim)===data.dimension)));
      return data;
    };
    const renderHarmonic=()=>{
      const data=harmonicFrame(local.harmonicDimension),harmonicSvg=doc.getElementById('bgaHarmonicSvg');if(harmonicSvg)harmonicSvg.innerHTML=harmonicSvgMarkup(data);
      const lift=data.previous===null?'SOURCE ENTRY':`${data.previous}D → ${data.dimension}D · ×${fmt(data.ratio)}`;
      const values={bgaHarmonicStatus:`${data.dimension}D · ${data.dimension>=12?'CROWN':'SIDEBAND'} / SOURCE HELD`,bgaHarmonicDimension:`G_${data.dimension} = 28^${data.dimension}`,bgaHarmonicCount:`${fmt(data.total)} Zustände`,bgaHarmonicLift:lift};
      Object.entries(values).forEach(([id,value])=>{const node=doc.getElementById(id);if(node)node.textContent=value;});
      doc.querySelectorAll('[data-bga-harmonic]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.bgaHarmonic)===data.dimension)));
      return data;
    };
    const stop=()=>{local.moving=false;if(timer){clearInterval(timer);timer=0;}};
    doc.querySelectorAll('[data-bga-mode]').forEach(button=>button.addEventListener('click',()=>{local.mode=button.dataset.bgaMode;render();}));
    doc.querySelectorAll('[data-bga-action]').forEach(button=>button.addEventListener('click',()=>{
      const action=button.dataset.bgaAction;
      if(action==='step'){stop();local.step=(local.step+1)%STATIONS.length;}
      if(action==='return'){stop();local.step=0;}
      if(action==='121'){const preset=doc.getElementById('pascal-121');if(preset)preset.click();local.mode='pascal';}
      if(action==='pi'){local.pi=!local.pi;button.setAttribute('aria-pressed',String(local.pi));}
      if(action==='play'){
        if(timer){stop();button.setAttribute('aria-pressed','false');}
        else{local.moving=true;button.setAttribute('aria-pressed','true');timer=setInterval(()=>{local.step=(local.step+1)%STATIONS.length;render();},900);}
      }
      render();
    }));
    doc.querySelectorAll('[data-bga-dim]').forEach(button=>button.addEventListener('click',()=>{local.dimension=Number(button.dataset.bgaDim);renderDimension();}));
    doc.querySelectorAll('[data-bga-dim-action]').forEach(button=>button.addEventListener('click',()=>{
      const action=button.dataset.bgaDimAction,index=DIMENSIONS.indexOf(local.dimension);
      if(action==='up')local.dimension=DIMENSIONS[Math.min(DIMENSIONS.length-1,index+1)];
      if(action==='down')local.dimension=DIMENSIONS[Math.max(0,index-1)];
      if(action==='return')local.dimension=2;
      if(action==='shadow'){local.shadowVisible=!local.shadowVisible;button.setAttribute('aria-pressed',String(local.shadowVisible));}
      if(action==='harmonic'){local.harmonicVisible=!local.harmonicVisible;button.setAttribute('aria-pressed',String(local.harmonicVisible));const panel=doc.getElementById('bgaHarmonic');if(panel)panel.hidden=!local.harmonicVisible;}
      renderDimension();
    }));
    doc.querySelectorAll('[data-bga-harmonic]').forEach(button=>button.addEventListener('click',()=>{local.harmonicDimension=Number(button.dataset.bgaHarmonic);renderHarmonic();}));
    if(win)win.addEventListener('a0:boundary-state',event=>{local.input=event.detail;render();});
    render();renderDimension();renderHarmonic();return {render,renderDimension,renderHarmonic,receipt:()=>receipt(frame(local.input,local),dimensionFrame(local.dimension,{shadowVisible:local.shadowVisible}),harmonicFrame(local.harmonicDimension)),destroy:stop,state:local};
  }
  return {IDENTITY,MODES,STATIONS,DIMENSIONS,HARMONIC_DIMENSIONS,binom,plateValues,dimensionFrame,dimensionSvgMarkup,reverseToken,harmonicFrame,harmonicSvgMarkup,frame,svgMarkup,receipt,verify,mount};
});
