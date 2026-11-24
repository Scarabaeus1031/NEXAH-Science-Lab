(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.A0PrimeTorusThreadDemonstrator=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const MOD_X=7,MOD_Y=11,LIMIT=1000;

  function isPrime(n){
    if(!Number.isInteger(n)||n<2)return false;
    if(n%2===0)return n===2;
    for(let d=3;d*d<=n;d+=2)if(n%d===0)return false;
    return true;
  }

  function primesUpTo(limit){
    const out=[];
    for(let n=2;n<=limit;n++)if(isPrime(n))out.push(n);
    return out;
  }

  function wrapDelta(delta,modulus){
    const half=(modulus-1)/2;
    let value=((delta%modulus)+modulus)%modulus;
    if(value>half)value-=modulus;
    return value;
  }

  function model(limit=LIMIT){
    const primes=primesUpTo(limit);
    const points=primes.map((prime,index)=>Object.freeze({
      index:index+1,
      prime,
      r7:prime%MOD_X,
      r11:prime%MOD_Y,
      zeroGate:prime%MOD_X===0||prime%MOD_Y===0
    }));
    const transitions=points.slice(0,-1).map((from,index)=>{
      const to=points[index+1];
      const raw7=to.r7-from.r7,raw11=to.r11-from.r11;
      return Object.freeze({
        index:index+1,
        from,
        to,
        raw7,
        raw11,
        wrapped7:wrapDelta(raw7,MOD_X),
        wrapped11:wrapDelta(raw11,MOD_Y)
      });
    });
    const unitStates=new Set(points.filter(point=>point.prime>11).map(point=>point.r7+':'+point.r11));
    return Object.freeze({
      limit,
      points:Object.freeze(points),
      transitions:Object.freeze(transitions),
      zeroGates:Object.freeze(points.filter(point=>point.zeroGate)),
      unitStatesVisited:unitStates.size
    });
  }

  function measures(){
    return Object.freeze({
      fullGridNodes:MOD_X*MOD_Y,
      fullGridCells:(MOD_X-1)*(MOD_Y-1),
      unitNodes:(MOD_X-1)*(MOD_Y-1),
      unitCellColumns:MOD_X-2,
      unitCellRows:MOD_Y-2,
      unitCells:(MOD_X-2)*(MOD_Y-2),
      innerUnitNodes:(MOD_X-3)*(MOD_Y-3),
      zeroFrameAddresses:MOD_X+MOD_Y-1,
      normalizedPitchX:2/(MOD_X-1),
      normalizedPitchY:2/(MOD_Y-1)
    });
  }

  function angleDegrees(dx,dy){
    const sx=dx*2/(MOD_X-1),sy=dy*2/(MOD_Y-1);
    return Math.atan2(sy,sx)*180/Math.PI;
  }

  function transitionReadout(transition){
    return Object.freeze({
      rawAngle:angleDegrees(transition.raw7,transition.raw11),
      wrappedAngle:angleDegrees(transition.wrapped7,transition.wrapped11),
      root:`p${transition.from.index}=${transition.from.prime} · (${transition.from.r7},${transition.from.r11})`,
      target:`p${transition.to.index}=${transition.to.prime} · (${transition.to.r7},${transition.to.r11})`,
      raw:`(${transition.raw7},${transition.raw11})`,
      wrapped:`(${transition.wrapped7},${transition.wrapped11})`
    });
  }

  function addressKey(point){return point.r7+':'+point.r11}

  function unitGraph(data){
    const points=data.points.filter(point=>point.prime>11);
    const byKey=new Map(points.map(point=>[addressKey(point),Object.freeze({r7:point.r7,r11:point.r11})]));
    const edgeMap=new Map();
    points.slice(0,-1).forEach((from,index)=>{
      const to=points[index+1],a=addressKey(from),b=addressKey(to);
      const key=a<=b?a+'|'+b:b+'|'+a;
      const current=edgeMap.get(key);
      if(current)current.primeTraversals++;
      else edgeMap.set(key,{key,a,b,primeTraversals:1});
    });
    const degree=new Map([...byKey.keys()].map(key=>[key,0]));
    edgeMap.forEach(edge=>{
      degree.set(edge.a,degree.get(edge.a)+1);
      degree.set(edge.b,degree.get(edge.b)+1);
    });
    const edges=[...edgeMap.values()].sort((a,b)=>a.key.localeCompare(b.key)).map(Object.freeze);
    return Object.freeze({
      vertices:Object.freeze([...byKey.entries()].map(([key,point])=>Object.freeze({key,...point}))),
      byKey,
      edges:Object.freeze(edges),
      primeTransitions:points.length-1,
      repeatedPrimeTraversals:points.length-1-edges.length,
      oddVertices:Object.freeze([...degree].filter(([,value])=>value%2===1).map(([key])=>key).sort()),
      primeStart:addressKey(points[0]),
      primeEnd:addressKey(points[points.length-1])
    });
  }

  function doubledEulerAudit(graph){
    const adjacency=new Map(graph.vertices.map(vertex=>[vertex.key,[]]));
    graph.edges.forEach((edge,edgeIndex)=>{
      for(let copy=0;copy<2;copy++){
        const id=edgeIndex+':'+copy;
        adjacency.get(edge.a).push({id,to:edge.b});
        adjacency.get(edge.b).push({id,to:edge.a});
      }
    });
    adjacency.forEach(list=>list.sort((a,b)=>b.to.localeCompare(a.to)||b.id.localeCompare(a.id)));
    const start=graph.vertices.map(vertex=>vertex.key).sort()[0];
    const used=new Set(),stack=[start],circuit=[];
    while(stack.length){
      const vertex=stack[stack.length-1],list=adjacency.get(vertex);
      let edge=list.pop();
      while(edge&&used.has(edge.id))edge=list.pop();
      if(edge){used.add(edge.id);stack.push(edge.to)}
      else circuit.push(stack.pop());
    }
    const route=circuit.reverse();
    const transitions=route.slice(0,-1).map((from,index)=>{
      const to=route[index+1],a=graph.byKey.get(from),b=graph.byKey.get(to);
      const raw7=b.r7-a.r7,raw11=b.r11-a.r11;
      return Object.freeze({index:index+1,from:a,to:b,fromKey:from,toKey:to,raw7,raw11,wrapped7:wrapDelta(raw7,MOD_X),wrapped11:wrapDelta(raw11,MOD_Y)});
    });
    return Object.freeze({
      route:Object.freeze(route),
      transitions:Object.freeze(transitions),
      closed:route.length>1&&route[0]===route[route.length-1],
      start:route[0],
      duplicatedEdges:graph.edges.length,
      construction:'EVERY_UNIQUE_EDGE_DOUBLED_NON_MINIMAL'
    });
  }

  function eulerAnalysis(data){
    const graph=unitGraph(data),audit=doubledEulerAudit(graph);
    return Object.freeze({graph,audit});
  }

  function auditReadout(transition){
    return Object.freeze({
      rawAngle:angleDegrees(transition.raw7,transition.raw11),
      wrappedAngle:angleDegrees(transition.wrapped7,transition.wrapped11),
      root:`UNIT · (${transition.from.r7},${transition.from.r11})`,
      target:`UNIT · (${transition.to.r7},${transition.to.r11})`,
      raw:`(${transition.raw7},${transition.raw11})`,
      wrapped:`(${transition.wrapped7},${transition.wrapped11})`
    });
  }

  function svgFor(data,transitionIndex=4,options={}){
    const mode=['prime','lilith','euler','difference'].includes(options.mode)?options.mode:'prime';
    const analysis=eulerAnalysis(data),audit=analysis.audit,graph=analysis.graph;
    const sourceTransitions=mode==='euler'?audit.transitions:data.transitions;
    const index=Math.max(1,Math.min(sourceTransitions.length,Number(transitionIndex)||1));
    const selected=sourceTransitions[index-1];
    const showTrail=Boolean(options.showTrail);
    const showMeasures=options.showMeasures!==false;
    const showFrame=options.showFrame!==false;
    const showWrap=options.showWrap!==false;
    const showOddColors=Boolean(options.showOddColors);
    const wobble=Math.max(0,Math.min(1,Number(options.wobble)||0));
    const W=1000,H=650,left=255,top=55,plot=420,right=left+plot,bottom=top+plot;
    const x=r=>left+r/(MOD_X-1)*plot;
    const y=r=>bottom-r/(MOD_Y-1)*plot;
    const qPath=(a,b,shiftX=0,shiftY=0)=>{
      const ax=x(a.r7+shiftX),ay=y(a.r11+shiftY),bx=x(b.r7+shiftX),by=y(b.r11+shiftY);
      const dx=bx-ax,dy=by-ay,length=Math.hypot(dx,dy)||1;
      const bend=wobble*56*Math.sin((selected.index+1)*1.61803398875);
      const cx=(ax+bx)/2-dy/length*bend,cy=(ay+by)/2+dx/length*bend;
      return`M${ax.toFixed(2)} ${ay.toFixed(2)} Q${cx.toFixed(2)} ${cy.toFixed(2)} ${bx.toFixed(2)} ${by.toFixed(2)}`;
    };
    const straightPath=(a,b)=>`M${x(a.r7).toFixed(2)} ${y(a.r11).toFixed(2)} L${x(b.r7).toFixed(2)} ${y(b.r11).toFixed(2)}`;
    const lifted={r7:selected.from.r7+selected.wrapped7,r11:selected.from.r11+selected.wrapped11};
    const parts=[
      `<svg viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="primeThreadSvgTitle primeThreadSvgDesc">`,
      '<title id="primeThreadSvgTitle">Prime Torus Thread Demonstrator</title>',
      '<desc id="primeThreadSvgDesc">Ein ausgewählter Primzahlübergang auf dem vollständigen mod sieben mal mod elf Raster. Nullachsenrahmen, Einheitenfeld, Rohlinie, gewickelte Fortsetzung und Maßangaben sind getrennt schaltbar.</desc>',
      '<defs>',
      `<clipPath id="primeThreadClip"><rect x="${left}" y="${top}" width="${plot}" height="${plot}"/></clipPath>`,
      '<marker id="primeThreadArrowRaw" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" class="ptd-arrow-raw"/></marker>',
      '<marker id="primeThreadArrowWrap" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" class="ptd-arrow-wrap"/></marker>',
      '</defs>',
      `<rect x="${left}" y="${top}" width="${plot}" height="${plot}" class="ptd-field"/>`
    ];

    for(let r=0;r<MOD_X;r++)parts.push(`<line x1="${x(r)}" y1="${top}" x2="${x(r)}" y2="${bottom}" class="ptd-grid-line"/>`);
    for(let r=0;r<MOD_Y;r++)parts.push(`<line x1="${left}" y1="${y(r)}" x2="${right}" y2="${y(r)}" class="ptd-grid-line"/>`);
    parts.push(`<rect x="${x(1)}" y="${y(10)}" width="${x(6)-x(1)}" height="${y(1)-y(10)}" class="ptd-unit-field"/>`);

    if(showFrame){
      parts.push(`<path d="M${left} ${top} V${bottom} H${right}" class="ptd-zero-frame"/>`);
      parts.push(`<text x="${left-18}" y="${top+plot/2}" transform="rotate(-90 ${left-18} ${top+plot/2})" class="ptd-frame-label">r₇=0 · ZERO COLUMN</text>`);
      parts.push(`<text x="${left+plot/2}" y="${bottom+24}" class="ptd-frame-label">r₁₁=0 · ZERO ROW · L FRAME = 17 ADDRESSES</text>`);
    }

    for(let r7=0;r7<MOD_X;r7++)for(let r11=0;r11<MOD_Y;r11++){
      const unit=r7!==0&&r11!==0;
      parts.push(`<circle cx="${x(r7)}" cy="${y(r11)}" r="${unit?2.6:3.6}" class="${unit?'ptd-node ptd-unit-node':'ptd-node ptd-zero-node'}"><title>(${r7},${r11})</title></circle>`);
    }

    if(showOddColors){
      graph.oddVertices.forEach((key,oddIndex)=>{
        const point=graph.byKey.get(key),hue=Math.round(oddIndex*360/graph.oddVertices.length);
        parts.push(`<circle cx="${x(point.r7)}" cy="${y(point.r11)}" r="8" class="ptd-odd-node" style="--ptd-odd-color:hsl(${hue} 84% 62%)"><title>odd-degree audit node ${oddIndex+1}/24 · (${point.r7},${point.r11})</title></circle>`);
      });
      parts.push('<text x="760" y="422" class="ptd-odd-note">24 ODD-DEGREE NODES · COLOR LENS</text>');
    }

    if(showTrail&&mode!=='euler'&&mode!=='difference'){
      data.transitions.forEach(transition=>parts.push(`<path d="${qPath(transition.from,transition.to)}" class="ptd-trail"/>`));
    }

    if(mode==='euler'){
      graph.edges.forEach(edge=>parts.push(`<path d="${straightPath(graph.byKey.get(edge.a),graph.byKey.get(edge.b))}" class="ptd-euler-network"/>`));
      parts.push(`<path d="${straightPath(selected.from,selected.to)}" class="ptd-euler-active" marker-end="url(#primeThreadArrowWrap)"/>`);
    }else if(mode==='difference'){
      graph.edges.forEach(edge=>{
        const a=graph.byKey.get(edge.a),b=graph.byKey.get(edge.b);
        parts.push(`<path d="${straightPath(a,b)}" class="${edge.primeTraversals>1?'ptd-prime-repeat':'ptd-prime-single'}"/>`);
        parts.push(`<path d="${straightPath(a,b)}" class="ptd-audit-copy"/>`);
      });
      parts.push(`<path d="${qPath(selected.from,selected.to)}" class="ptd-raw-thread" marker-end="url(#primeThreadArrowRaw)"/>`);
    }else if(mode==='lilith'){
      parts.push(`<path d="${straightPath(selected.from,selected.to)}" class="ptd-exact-chord"/>`);
      parts.push(`<path d="${qPath(selected.from,selected.to)}" class="ptd-lilith-thread" marker-end="url(#primeThreadArrowRaw)"/>`);
    }else{
      parts.push(`<path d="${qPath(selected.from,selected.to)}" class="ptd-raw-thread" marker-end="url(#primeThreadArrowRaw)"/>`);
    }
    if(showWrap&&mode!=='euler'&&mode!=='difference'){
      for(let tx=-1;tx<=1;tx++)for(let ty=-1;ty<=1;ty++){
        parts.push(`<path d="${qPath(selected.from,lifted,tx*MOD_X,ty*MOD_Y)}" class="ptd-wrap-thread" clip-path="url(#primeThreadClip)" marker-end="url(#primeThreadArrowWrap)"/>`);
      }
    }

    data.zeroGates.forEach(point=>parts.push(`<circle cx="${x(point.r7)}" cy="${y(point.r11)}" r="7" class="ptd-gate"><title>zero gate p=${point.prime}</title></circle>`));
    parts.push(`<circle cx="${x(selected.from.r7)}" cy="${y(selected.from.r11)}" r="9" class="ptd-root"/>`);
    parts.push(`<circle cx="${x(selected.to.r7)}" cy="${y(selected.to.r11)}" r="9" class="ptd-target"/>`);
    parts.push(`<text x="${x(selected.from.r7)+12}" y="${y(selected.from.r11)-12}" class="ptd-point-label">ROOT · ${mode==='euler'?selected.fromKey:selected.from.prime}</text>`);
    parts.push(`<text x="${x(selected.to.r7)+12}" y="${y(selected.to.r11)+20}" class="ptd-point-label">TARGET · ${mode==='euler'?selected.toKey:selected.to.prime}</text>`);

    if(showMeasures){
      const ux0=x(1),ux1=x(6),uy0=y(10),uy1=y(1);
      parts.push(`<path d="M${ux0} ${uy1+18} V${uy1+30} H${ux1} V${uy1+18}" class="ptd-measure"/>`);
      parts.push(`<text x="${(ux0+ux1)/2}" y="${uy1+47}" class="ptd-measure-label">5 CELL COLUMNS · 6 UNIT NODES</text>`);
      parts.push(`<path d="M${ux1+18} ${uy0} H${ux1+30} V${uy1} H${ux1+18}" class="ptd-measure"/>`);
      parts.push(`<text x="${ux1+44}" y="${(uy0+uy1)/2}" transform="rotate(90 ${ux1+44} ${(uy0+uy1)/2})" class="ptd-measure-label">9 CELL ROWS · 10 UNIT NODES</text>`);
      parts.push(`<rect x="${x(0)}" y="${y(1)}" width="${x(1)-x(0)}" height="${y(0)-y(1)}" class="ptd-measure-cell"/>`);
      parts.push(`<text x="${x(0)+8}" y="${y(0)-8}" class="ptd-cell-label">Δr=(1,1) · normalized 1/3 × 1/5</text>`);
    }

    parts.push(`<path d="M${right+70} ${bottom-5} h58 M${right+128} ${bottom-5} l-10 -6 v12 z" class="ptd-axis"/>`);
    parts.push(`<path d="M${right+70} ${bottom-5} v-58 M${right+70} ${bottom-63} l-6 10 h12 z" class="ptd-axis"/>`);
    parts.push(`<text x="${right+136}" y="${bottom}" class="ptd-axis-label">+r₇</text>`);
    parts.push(`<text x="${right+54}" y="${bottom-72}" class="ptd-axis-label">+r₁₁</text>`);
    parts.push(`<text x="760" y="82" class="ptd-side-title">${mode==='euler'?'EULER AUDIT':'THREAD'} ${selected.index} / ${sourceTransitions.length}</text>`);
    parts.push(`<text x="760" y="112" class="ptd-side-copy">${mode==='euler'?selected.fromKey+' → '+selected.toKey:selected.from.prime+' → '+selected.to.prime}</text>`);
    parts.push(`<text x="760" y="142" class="ptd-side-copy">ROOT (${selected.from.r7},${selected.from.r11})</text>`);
    parts.push(`<text x="760" y="166" class="ptd-side-copy">TARGET (${selected.to.r7},${selected.to.r11})</text>`);
    parts.push(`<text x="760" y="214" class="ptd-side-title">RAW Δ</text>`);
    parts.push(`<text x="760" y="244" class="ptd-side-copy">(${selected.raw7}, ${selected.raw11}) · ${angleDegrees(selected.raw7,selected.raw11).toFixed(1)}°</text>`);
    parts.push(`<text x="760" y="292" class="ptd-side-title">WRAPPED Δ</text>`);
    parts.push(`<text x="760" y="322" class="ptd-side-copy">(${selected.wrapped7}, ${selected.wrapped11}) · ${angleDegrees(selected.wrapped7,selected.wrapped11).toFixed(1)}°</text>`);
    parts.push(`<text x="760" y="374" class="ptd-side-note">${mode==='euler'?'135 UNIQUE EDGES × 2 = 270':'WOBBLE = VIEW ONLY'}</text>`);
    parts.push(`<text x="760" y="398" class="ptd-side-note">${mode==='difference'?'27 REPEATED PRIME TRAVERSALS':mode==='euler'?'CLOSED · NON-MINIMAL AUDIT':'ENDPOINTS STAY EXACT'}</text>`);
    parts.push('<text x="760" y="446" class="ptd-side-note">CHART DIRECTIONS</text>');
    parts.push('<text x="760" y="470" class="ptd-side-note">NO CUBE MAP DECLARED</text>');
    parts.push('<text x="470" y="624" class="ptd-footer">FULL GRID 7×11 NODES · UNIT FIELD 6×10 NODES / 5×9 CELLS · INNER UNIT NODES 4×8</text>');
    parts.push('</svg>');
    return parts.join('');
  }

  function mount(doc){
    const host=doc.querySelector('[data-prime-torus-thread]');
    if(!host)return null;
    const data=model(LIMIT);
    const step=host.querySelector('#primeThreadStep');
    const mode=host.querySelector('#primeThreadMode');
    const wobble=host.querySelector('#primeThreadWobble');
    const trail=host.querySelector('#primeThreadTrail');
    const measuresInput=host.querySelector('#primeThreadMeasures');
    const frame=host.querySelector('#primeThreadFrame');
    const wrap=host.querySelector('#primeThreadWrap');
    const oddColors=host.querySelector('#primeThreadOddColors');
    const svg=host.querySelector('#primeThreadSvg');
    const outputs={
      step:host.querySelector('#primeThreadStepOut'),
      wobble:host.querySelector('#primeThreadWobbleOut'),
      root:host.querySelector('#primeThreadRoot'),
      target:host.querySelector('#primeThreadTarget'),
      delta:host.querySelector('#primeThreadDelta'),
      angle:host.querySelector('#primeThreadAngle')
    };
    outputs.audit=host.querySelector('#primeThreadAudit');
    const analysis=eulerAnalysis(data);
    function render(){
      const currentMode=mode?mode.value:'prime';
      const source=currentMode==='euler'?analysis.audit.transitions:data.transitions;
      step.max=String(source.length);
      if(Number(step.value)>source.length)step.value=String(source.length);
      const index=Number(step.value),transition=source[index-1],readout=currentMode==='euler'?auditReadout(transition):transitionReadout(transition);
      outputs.step.textContent=currentMode==='euler'?`${index} · ${transition.fromKey}→${transition.toKey}`:`${index} · ${transition.from.prime}→${transition.to.prime}`;
      outputs.wobble.textContent=Number(wobble.value).toFixed(2);
      outputs.root.textContent=readout.root;
      outputs.target.textContent=readout.target;
      outputs.delta.textContent=`raw ${readout.raw} · wrap ${readout.wrapped}`;
      outputs.angle.textContent=`raw ${readout.rawAngle.toFixed(1)}° · wrap ${readout.wrappedAngle.toFixed(1)}°`;
      if(outputs.audit)outputs.audit.textContent=`${analysis.graph.edges.length} unique · ${analysis.graph.repeatedPrimeTraversals} prime repeats · ${analysis.graph.oddVertices.length} odd · ${analysis.audit.transitions.length} audit steps · ${analysis.audit.closed?'closed':'open'}`;
      svg.innerHTML=svgFor(data,index,{mode:currentMode,showTrail:trail.checked,showMeasures:measuresInput.checked,showFrame:frame.checked,showWrap:wrap.checked,showOddColors:oddColors&&oddColors.checked,wobble:Number(wobble.value)});
    }
    [step,wobble].forEach(input=>input.addEventListener('input',render));
    [trail,measuresInput,frame,wrap,oddColors].filter(Boolean).forEach(input=>input.addEventListener('change',render));
    if(mode)mode.addEventListener('change',render);
    render();
    return Object.freeze({render,data,analysis});
  }

  if(typeof document!=='undefined'){
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>mount(document),{once:true});
    else mount(document);
  }

  return Object.freeze({MOD_X,MOD_Y,LIMIT,isPrime,primesUpTo,wrapDelta,model,measures,angleDegrees,transitionReadout,addressKey,unitGraph,doubledEulerAudit,eulerAnalysis,auditReadout,svgFor,mount});
});
