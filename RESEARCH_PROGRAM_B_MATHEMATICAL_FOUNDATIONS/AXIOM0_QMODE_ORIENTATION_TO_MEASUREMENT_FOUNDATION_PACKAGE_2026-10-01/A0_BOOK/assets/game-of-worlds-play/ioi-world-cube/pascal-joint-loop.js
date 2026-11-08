(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.A0PascalJointLoop=api;
  if(typeof document!=='undefined'){
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',api.mount,{once:true});
    else api.mount();
  }
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const ROWS=6;
  const PIN_COUNT=ROWS*(ROWS+1)/2;
  const EXIT_COUNT=ROWS+1;
  const RETURN_SEGMENTS=['t1','t2','t3','t4','t5'];
  const PORT_STATES=['LL','LR','RL','RR'];
  const MAX_STEP=ROWS+1+RETURN_SEGMENTS.length+1;
  const NODE_COUNT=42;
  const FREQUENCY_AXIS_COUNT=6;
  const PHASE_RING_COUNT=7;
  const YUGO_ENTRY_NODE=0;
  const YUGO_GATE_MAGNITUDE=7;
  const YUGO_EXIT_MAGNITUDE=8;
  const AXIS_COLORS=['#ff5d5d','#f0b52b','#65d7e8','#66e3ac','#a98cff','#ff79bd'];

  const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
  const sum=values=>values.reduce((total,value)=>total+value,0);
  const binomialRow=n=>Array.from({length:n+1},(_,k)=>{
    let value=1;
    for(let i=1;i<=k;i+=1)value=value*(n-k+i)/i;
    return Math.round(value);
  });
  const enumeratePaths=(rows=ROWS)=>{
    const paths=[];
    const visit=path=>{
      if(path.length===rows){paths.push(path);return;}
      visit(path.concat('L'));
      visit(path.concat('R'));
    };
    visit([]);
    return paths;
  };
  const histogramForPaths=(paths,rows=ROWS)=>{
    const histogram=Array(rows+1).fill(0);
    paths.forEach(path=>{histogram[path.filter(step=>step==='R').length]+=1;});
    return histogram;
  };
  const seededRandom=seed=>{
    let state=(Number(seed)>>>0)||1;
    return ()=>{
      state+=0x6D2B79F5;
      let value=state;
      value=Math.imul(value^(value>>>15),value|1);
      value^=value+Math.imul(value^(value>>>7),value|61);
      return ((value^(value>>>14))>>>0)/4294967296;
    };
  };
  const routePath=(random,bias=0,rows=ROWS)=>{
    const pRight=clamp(.5+Number(bias||0),.05,.95);
    return Array.from({length:rows},()=>random()<pRight?'R':'L');
  };
  const exitSide=mode=>String(mode||'RL').slice(-1)==='R'?1:-1;
  const returnAddress=(index,mode)=>({
    timeSlot:RETURN_SEGMENTS[index%RETURN_SEGMENTS.length],
    microState:PORT_STATES.includes(mode)?mode:'RL',
    address:`${RETURN_SEGMENTS[index%RETURN_SEGMENTS.length]}:${PORT_STATES.includes(mode)?mode:'RL'}`
  });
  const returnAddressSpace=()=>RETURN_SEGMENTS.flatMap(timeSlot=>PORT_STATES.map(microState=>`${timeSlot}:${microState}`));
  const mod=(value,base)=>((Number(value)%base)+base)%base;
  const nodeCoordinates=node=>({frequency:mod(node,FREQUENCY_AXIS_COUNT),phase:mod(node,PHASE_RING_COUNT)});
  const frequencyAxis=axis=>Array.from({length:PHASE_RING_COUNT},(_,index)=>mod(axis+FREQUENCY_AXIS_COUNT*index,NODE_COUNT));
  const phaseRing=phase=>Array.from({length:FREQUENCY_AXIS_COUNT},(_,index)=>mod(phase+PHASE_RING_COUNT*index,NODE_COUNT));
  const rotateNode=(node,step=0)=>mod(node+step,NODE_COUNT);
  const antipodeNode=node=>rotateNode(node,NODE_COUNT/2);
  const mirrorNode=node=>NODE_COUNT-1-mod(node,NODE_COUNT);
  const pinNode=(pin,side=-1)=>{
    const index=clamp(Math.floor(Number(pin)||1),1,PIN_COUNT)-1;
    return index*2+(Number(side)>0?1:0);
  };
  const transformNode=(node,kind='ROTATE',step=0)=>kind==='ANTIPODE'?antipodeNode(node):kind==='MIRROR'?mirrorNode(node):rotateNode(node,step);
  const signedGateNode=(side,magnitude)=>mod((Number(side)<0?-1:1)*magnitude,NODE_COUNT);
  const signedGateRoute=side=>Array.from({length:YUGO_EXIT_MAGNITUDE+1},(_,magnitude)=>signedGateNode(side,magnitude));
  const yugoGate=()=>({
    entry:YUGO_ENTRY_NODE,
    minusGate:signedGateNode(-1,YUGO_GATE_MAGNITUDE),
    minusExit:signedGateNode(-1,YUGO_EXIT_MAGNITUDE),
    plusGate:signedGateNode(1,YUGO_GATE_MAGNITUDE),
    plusExit:signedGateNode(1,YUGO_EXIT_MAGNITUDE),
    minusRoute:signedGateRoute(-1),
    plusRoute:signedGateRoute(1)
  });
  const createRun=(options={})=>{
    const payloadCount=Math.max(1,Math.floor(options.payloadCount??99));
    const witnessCount=1;
    const total=payloadCount+witnessCount;
    const seed=Math.floor(options.seed??21019);
    const bias=clamp(Number(options.bias??0),-.45,.45);
    const mode=PORT_STATES.includes(options.mode)?options.mode:'RL';
    const random=seededRandom(seed);
    const balls=Array.from({length:total},(_,index)=>{
      const path=routePath(random,bias);
      const exit=path.filter(step=>step==='R').length;
      return {
        id:index+1,
        role:index===total-1?'WITNESS':'PAYLOAD',
        path,
        exit,
        hinge:mode,
        returnSide:exitSide(mode),
        ...returnAddress(index,mode)
      };
    });
    const bins=Array(EXIT_COUNT).fill(0);
    balls.forEach(ball=>{bins[ball.exit]+=1;});
    const nominalCapacity=Math.max(1,Math.ceil(total*Math.max(...binomialRow(ROWS))/2**ROWS));
    const packing=bins.map((count,index)=>({
      index,
      count,
      capacity:nominalCapacity,
      fill:count/nominalCapacity,
      void:Math.max(0,nominalCapacity-count),
      overflow:Math.max(0,count-nominalCapacity)
    }));
    return {payloadCount,witnessCount,total,seed,bias,mode,balls,bins,nominalCapacity,packing};
  };
  const stageLabel=step=>{
    if(step===0)return 'SOURCE';
    if(step<=ROWS)return `FALL · ROW ${step}/${ROWS}`;
    if(step===ROWS+1)return 'HINGE · PORT CUT';
    if(step<MAX_STEP)return `OUTER RETURN · ${RETURN_SEGMENTS[step-(ROWS+2)]}`;
    return 'TOP JOINT · RETURN';
  };
  const createState=options=>({run:createRun(options),step:0,complete:false});
  const advance=input=>{
    const state={...input};
    state.step=Math.min(MAX_STEP,state.step+1);
    state.complete=state.step===MAX_STEP;
    return state;
  };
  const conservation=run=>sum(run.bins)===run.total&&run.payloadCount+run.witnessCount===run.total;
  const ballPosition=(ball,step)=>{
    const centerX=380,topY=38,rowGap=48,columnGap=50,bottomY=390;
    if(step===0)return {x:centerX,y:topY};
    if(step<=ROWS){
      const path=ball.path.slice(0,step);
      const rights=path.filter(value=>value==='R').length;
      return {x:centerX+(2*rights-step)*columnGap/2,y:topY+step*rowGap};
    }
    const exitX=centerX+(ball.exit-ROWS/2)*columnGap;
    if(step===ROWS+1)return {x:exitX,y:bottomY};
    if(step<MAX_STEP){
      const segment=step-(ROWS+1);
      const progress=segment/RETURN_SEGMENTS.length;
      const bulge=265*Math.sin(Math.PI*progress);
      return {
        x:exitX*(1-progress)+centerX*progress+ball.returnSide*bulge,
        y:bottomY-(bottomY-topY)*progress
      };
    }
    return {x:centerX,y:topY};
  };
  const escape=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const svgEl=(name,attributes={})=>{
    const node=document.createElementNS('http://www.w3.org/2000/svg',name);
    Object.entries(attributes).forEach(([key,value])=>node.setAttribute(key,String(value)));
    return node;
  };
  const createHost=()=>{
    const pascal=typeof globalThis!=='undefined'?globalThis.A0PascalGenerationTurn:null;
    if(pascal&&typeof pascal.mount==='function')pascal.mount();
    const anchor=document.getElementById('pascalGenerationTurn');
    if(!anchor)return null;
    const host=document.createElement('section');
    host.id='pascalJointLoop';
    host.className='pjl';
    host.setAttribute('aria-labelledby','pjlTitle');
    host.innerHTML=`<header class="pjl-head"><div><span class="eyebrow">PASCAL JOINT LOOP · SOURCE-BOUND ENGINEERING VIEW</span><h3 id="pjlTitle">21 pins → seven bins → hinge → ±1 outer return</h3><p>99 payload carriers and one visible witness fall through six binary rows. The lower joint sends the retained record through five outer return segments; packing is a finite occupancy readout, not mechanical pressure.</p></div><span class="pjl-status">REUSE ONLY<br>NO NEW STUDY</span></header><div class="pjl-grid"><div class="pjl-stage"><svg viewBox="0 0 760 440" role="img" aria-labelledby="pjlSvgTitle pjlSvgDesc"><title id="pjlSvgTitle">Pascal Joint Loop</title><desc id="pjlSvgDesc">Six rows and twenty-one pins distribute one hundred carriers into seven bins. A typed hinge routes them along the left or right outer boundary through five return segments.</desc><g data-pjl-static></g><g data-pjl-balls></g></svg><div class="pjl-stage-caption"><b data-pjl-readout="stage">SOURCE</b><span data-pjl-readout="conservation">100 / 100 retained</span></div></div><aside class="pjl-panel"><div class="pjl-stats"><div><small>PINS / EXITS</small><b>21 / 7</b></div><div><small>PAYLOAD + WITNESS</small><b>99 + 1</b></div><div><small>RETURN ADDRESS SPACE</small><b>5 × 4 = 20</b></div><div><small>FIELD BIAS</small><b data-pjl-readout="bias">0.00</b></div></div><label class="pjl-bias"><span>FIELD / CYLINDER OFFSET</span><input type="range" min="-0.35" max="0.35" step="0.05" value="0" data-pjl-control="bias"><output data-pjl-readout="bias-output">0.00</output></label><fieldset class="pjl-ports"><legend>HINGE PORT</legend>${PORT_STATES.map(mode=>`<button type="button" data-pjl-mode="${mode}" aria-pressed="${mode==='RL'}">${mode}</button>`).join('')}</fieldset><div class="pjl-controls"><button type="button" data-pjl-action="STEP">STEP</button><button type="button" data-pjl-action="PLAY">PLAY</button><button type="button" data-pjl-action="RESET">RESET</button></div><div class="pjl-witness"><small>WITNESS PATH RECORD</small><code data-pjl-readout="witness">W100 · SOURCE</code></div><div class="pjl-packing"><div class="pjl-packing-head"><b>PACKING / VOID</b><span>nominal K=<i data-pjl-readout="capacity">32</i></span></div><ol data-pjl-bins></ol></div><p class="pjl-boundary"><b>Boundary:</b> <code>±1</code> names the two outer return sides. <code>t1…t5 × {LL,LR,RL,RR}</code> is a twenty-address display contract. No physical pressure, magnetic mechanism, second Pascal identity or history reset is asserted.</p><div class="pjl-links"><a href="../../../A0_PASCAL_GENERATION_CORNER.html">Generation Corner ↗</a><a href="../../../results/a0-pascal-joint-loop-return-2026-11-08.json">Return receipt ↗</a></div></aside></div><section class="pjl-frequency" aria-labelledby="pjlFrequencyTitle"><header><div><span class="eyebrow">42-NODE FREQUENCY-AXIS LENS</span><h4 id="pjlFrequencyTitle">21 pin pairs → Z/42Z → six 7-node axes / seven 6-node phases</h4><p>Every Pascal pin owns a typed −1/+1 pair. The same 42 addresses can be read by residue modulo 6 or modulo 7.</p></div><code data-pjl-frequency-record>P1 · −1 → n0</code></header><div class="pjl-frequency-grid"><div class="pjl-frequency-stage"><svg viewBox="0 0 760 560" role="img" aria-labelledby="pjlFrequencySvgTitle pjlFrequencySvgDesc"><title id="pjlFrequencySvgTitle">Frequency axes in the forty-two-node Pascal Joint model</title><desc id="pjlFrequencySvgDesc">Forty-two nodes form six colored seven-node frequency orbits and seven dashed six-node phase orbits. The pink YUGO entry at node zero forks through signed seven-gates to exits plus and minus eight. A selected Pascal pin highlights its minus-one and plus-one node pair.</desc><g data-pjl-frequency-static></g><g data-pjl-frequency-dynamic></g></svg></div><aside class="pjl-frequency-panel"><div class="pjl-frequency-stats"><div><small>CARRIER</small><b>Z/42Z</b></div><div><small>CRT ADDRESS</small><b>Z/6 × Z/7</b></div><div><small>FREQUENCY AXES</small><b>6 × 7</b></div><div><small>PHASE RINGS</small><b>7 × 6</b></div></div><label><span>PASCAL PIN PAIR</span><input type="range" min="1" max="21" step="1" value="1" data-pjl-frequency-control="pin"><output data-pjl-frequency-readout="pin">P1</output></label><label><span>ROTATION q · n↦n+q mod 42</span><input type="range" min="0" max="41" step="1" value="0" data-pjl-frequency-control="rotation"><output data-pjl-frequency-readout="rotation">q=0</output></label><fieldset><legend>VIEW TRANSFORM</legend><button type="button" data-pjl-transform="ROTATE" aria-pressed="true">R+q</button><button type="button" data-pjl-transform="ANTIPODE" aria-pressed="false">H+21</button><button type="button" data-pjl-transform="MIRROR" aria-pressed="false">X · 41−n</button></fieldset><div class="pjl-frequency-pair"><small>SELECTED RETURN PAIR</small><code data-pjl-frequency-readout="pair">P1 · −1:n0 · +1:n1</code></div><div class="pjl-yugo-gate"><small>PINK / YUGO ENTRY · SIGNED SEVEN-GATE</small><b><code>n0</code> → <code>−7:n35</code> → <code>−8:n34</code></b><b><code>n0</code> → <code>+7:n7</code> → <code>+8:n8</code></b><span>±8 passes one step beyond the two signed 7-thresholds.</span><a href="../../../downloads/A0_THE_ONE_D1_D2_YUGO_INTAKE_2026-10-25/NEXAH_Yugo_One_Loop_Offline.html">Existing YUGO source ↗</a></div><div class="pjl-frequency-table"><b>SIX FREQUENCY AXES</b><ol data-pjl-frequency-axes></ol></div><p><b>Boundary:</b> Pink is the local entry cue; YUGO reuses its existing normalized local flow-direction role. This view does not identify Pink Diamond with YUGO. “Frequency” names finite orbit/repetition structure in <code>Z/42Z</code>, not Hertz, resonance evidence or a planetary mechanism. Rotation, antipode and mirror are separate display transforms.</p></aside></div></section>`;
    anchor.insertAdjacentElement('afterend',host);
    return host;
  };
  const drawStatic=(host,run)=>{
    const layer=host.querySelector('[data-pjl-static]');
    layer.replaceChildren();
    const centerX=380,topY=38,rowGap=48,columnGap=50;
    layer.append(svgEl('path',{d:'M380 38 C95 82 62 330 380 430',class:'pjl-return-rail left'}));
    layer.append(svgEl('path',{d:'M380 38 C665 82 698 330 380 430',class:'pjl-return-rail right'}));
    RETURN_SEGMENTS.forEach((label,index)=>{
      const progress=(index+1)/6,angle=Math.PI*progress;
      [-1,1].forEach(side=>{
        const x=centerX+side*(220+45*Math.sin(angle));
        const y=topY+progress*338;
        const text=svgEl('text',{x,y,class:'pjl-return-label'});text.textContent=`${side<0?'−1':'＋1'} · ${label}`;layer.append(text);
      });
    });
    for(let row=0;row<ROWS;row+=1){
      for(let column=0;column<=row;column+=1){
        const x=centerX+(2*column-row)*columnGap/2,y=topY+(row+1)*rowGap;
        if(row<ROWS-1){
          [[x-columnGap/2,y+rowGap],[x+columnGap/2,y+rowGap]].forEach(([x2,y2])=>layer.append(svgEl('line',{x1:x,y1:y,x2,y2,class:'pjl-pin-link'})));
        }
        layer.append(svgEl('circle',{cx:x,cy:y,r:5,class:'pjl-pin'}));
      }
    }
    run.packing.forEach((bin,index)=>{
      const x=centerX+(index-ROWS/2)*columnGap;
      layer.append(svgEl('rect',{x:x-20,y:370,width:40,height:31,rx:5,class:'pjl-bin'}));
      const label=svgEl('text',{x,y:390,class:'pjl-bin-label'});label.textContent=String(bin.count);layer.append(label);
    });
    const hinge=svgEl('text',{x:centerX,y:424,class:'pjl-hinge-label'});hinge.textContent=`HINGE ${run.mode} · ${exitSide(run.mode)<0?'−1 LEFT':'＋1 RIGHT'}`;layer.append(hinge);
  };
  const frequencyPoint=node=>{
    const angle=-Math.PI/2+2*Math.PI*mod(node,NODE_COUNT)/NODE_COUNT;
    return {x:380+218*Math.cos(angle),y:280+218*Math.sin(angle)};
  };
  const drawFrequencyStatic=host=>{
    const layer=host.querySelector('[data-pjl-frequency-static]');
    layer.replaceChildren();
    [72,118,166,218].forEach((radius,index)=>layer.append(svgEl('circle',{cx:380,cy:280,r:radius,class:`pjl-frequency-ring r${index}`})));
    for(let phase=0;phase<PHASE_RING_COUNT;phase+=1){
      const points=phaseRing(phase).map(node=>frequencyPoint(node)).map(point=>`${point.x},${point.y}`).join(' ');
      layer.append(svgEl('polygon',{points,class:'pjl-phase-orbit'}));
    }
    for(let axis=0;axis<FREQUENCY_AXIS_COUNT;axis+=1){
      const points=frequencyAxis(axis).map(node=>frequencyPoint(node)).map(point=>`${point.x},${point.y}`).join(' ');
      layer.append(svgEl('polygon',{points,class:'pjl-frequency-orbit',stroke:AXIS_COLORS[axis],'data-axis':axis}));
    }
    const center=svgEl('text',{x:380,y:285,class:'pjl-frequency-center'});center.textContent='42 = 21 × 2';layer.append(center);
  };
  const drawYugoGate=(layer,view)=>{
    const gate=yugoGate();
    const pointFor=node=>frequencyPoint(transformNode(node,view.transform,view.rotation));
    const routePoints=route=>route.map(pointFor).map(point=>`${point.x},${point.y}`).join(' ');
    layer.append(svgEl('polyline',{points:routePoints(gate.minusRoute),class:'pjl-yugo-arm is-minus'}));
    layer.append(svgEl('polyline',{points:routePoints(gate.plusRoute),class:'pjl-yugo-arm is-plus'}));
    const entry=pointFor(gate.entry);
    layer.append(svgEl('path',{d:`M${entry.x} ${entry.y-13}L${entry.x+13} ${entry.y}L${entry.x} ${entry.y+13}L${entry.x-13} ${entry.y}Z`,class:'pjl-yugo-entry'}));
    [
      [gate.minusGate,'−7','is-minus'],
      [gate.minusExit,'−8','is-minus'],
      [gate.plusGate,'+7','is-plus'],
      [gate.plusExit,'+8','is-plus']
    ].forEach(([node,label,className])=>{
      const point=pointFor(node);
      layer.append(svgEl('circle',{cx:point.x,cy:point.y,r:String(label).includes('8')?8:6,class:`pjl-yugo-marker ${className}`}));
      const text=svgEl('text',{x:point.x,y:point.y+22,class:`pjl-yugo-label ${className}`});text.textContent=label;layer.append(text);
    });
    const entryText=svgEl('text',{x:entry.x,y:entry.y-21,class:'pjl-yugo-label is-entry'});entryText.textContent='PINK · YUGO · 0';layer.append(entryText);
  };
  const renderFrequency=(host,view)=>{
    drawFrequencyStatic(host);
    const layer=host.querySelector('[data-pjl-frequency-dynamic]');
    layer.replaceChildren();
    drawYugoGate(layer,view);
    const minusRaw=pinNode(view.pin,-1),plusRaw=pinNode(view.pin,1);
    const minus=transformNode(minusRaw,view.transform,view.rotation),plus=transformNode(plusRaw,view.transform,view.rotation);
    for(let node=0;node<NODE_COUNT;node+=1){
      const transformed=transformNode(node,view.transform,view.rotation),point=frequencyPoint(transformed),coords=nodeCoordinates(transformed);
      const selected=node===minusRaw||node===plusRaw;
      layer.append(svgEl('circle',{cx:point.x,cy:point.y,r:selected?9:5,class:`pjl-frequency-node${selected?' is-selected':''}`,fill:AXIS_COLORS[coords.frequency]}));
      const label=svgEl('text',{x:point.x,y:point.y-11,class:`pjl-frequency-node-label${selected?' is-selected':''}`});label.textContent=String(transformed);layer.append(label);
    }
    const a=frequencyPoint(minus),b=frequencyPoint(plus);
    layer.append(svgEl('line',{x1:a.x,y1:a.y,x2:b.x,y2:b.y,class:'pjl-frequency-pair-line'}));
    host.querySelector('[data-pjl-frequency-readout="pin"]').textContent=`P${view.pin}`;
    host.querySelector('[data-pjl-frequency-readout="rotation"]').textContent=`q=${view.rotation}`;
    host.querySelector('[data-pjl-frequency-readout="pair"]').textContent=`P${view.pin} · −1:n${minusRaw}→${minus} · +1:n${plusRaw}→${plus}`;
    host.querySelector('[data-pjl-frequency-record]').textContent=`${view.transform} · P${view.pin} · n${minus}/${plus} · CRT (${nodeCoordinates(minus).frequency},${nodeCoordinates(minus).phase}) / (${nodeCoordinates(plus).frequency},${nodeCoordinates(plus).phase})`;
    host.querySelector('[data-pjl-frequency-axes]').innerHTML=Array.from({length:FREQUENCY_AXIS_COUNT},(_,axis)=>`<li style="--axis-color:${AXIS_COLORS[axis]}"><span>A${axis}</span><code>${frequencyAxis(axis).join('·')}</code></li>`).join('');
    host.querySelectorAll('[data-pjl-transform]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.pjlTransform===view.transform)));
  };
  const mount=()=>{
    const host=document.getElementById('pascalJointLoop')||createHost();
    if(!host||host.dataset.mounted==='true')return;
    host.dataset.mounted='true';
    let config={payloadCount:99,seed:21019,bias:0,mode:'RL'};
    let state=createState(config),timer=null;
    let frequencyView={pin:1,rotation:0,transform:'ROTATE'};
    const ballLayer=host.querySelector('[data-pjl-balls]');
    const bins=host.querySelector('[data-pjl-bins]');
    const witness=()=>state.run.balls.find(ball=>ball.role==='WITNESS');
    const stop=()=>{if(timer){clearInterval(timer);timer=null;}host.querySelector('[data-pjl-action="PLAY"]').textContent='PLAY';};
    const render=()=>{
      drawStatic(host,state.run);
      ballLayer.replaceChildren();
      state.run.balls.forEach(ball=>{
        const position=ballPosition(ball,state.step);
        ballLayer.append(svgEl('circle',{cx:position.x,cy:position.y,r:ball.role==='WITNESS'?7:2.4,class:`pjl-ball${ball.role==='WITNESS'?' is-witness':''}`}));
      });
      const selected=witness(),position=ballPosition(selected,state.step);
      host.querySelector('[data-pjl-readout="stage"]').textContent=stageLabel(state.step);
      host.querySelector('[data-pjl-readout="conservation"]').textContent=`${sum(state.run.bins)} / ${state.run.total} retained`;
      host.querySelector('[data-pjl-readout="bias"]').textContent=state.run.bias.toFixed(2);
      host.querySelector('[data-pjl-readout="bias-output"]').textContent=state.run.bias.toFixed(2);
      host.querySelector('[data-pjl-readout="capacity"]').textContent=String(state.run.nominalCapacity);
      host.querySelector('[data-pjl-readout="witness"]').textContent=`W${selected.id} · ${selected.path.join('')} · exit ${selected.exit} · ${selected.hinge} · ${selected.returnSide<0?'−1':'＋1'} · ${selected.timeSlot}:${selected.microState} · (${Math.round(position.x)},${Math.round(position.y)})`;
      bins.innerHTML=state.run.packing.map(bin=>`<li><span>${bin.index}</span><i style="--pjl-fill:${Math.min(1,bin.fill)}"></i><b>${bin.count}/${bin.capacity}</b><small>void ${bin.void}${bin.overflow?` · overflow ${bin.overflow}`:''}</small></li>`).join('');
      host.querySelectorAll('[data-pjl-mode]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.pjlMode===state.run.mode)));
      host.querySelector('[data-pjl-action="STEP"]').disabled=state.complete;
      if(state.complete)stop();
    };
    const reset=()=>{stop();state=createState(config);render();};
    host.querySelector('[data-pjl-control="bias"]').addEventListener('input',event=>{config={...config,bias:Number(event.target.value)};reset();});
    host.querySelectorAll('[data-pjl-mode]').forEach(button=>button.addEventListener('click',()=>{config={...config,mode:button.dataset.pjlMode};reset();}));
    host.querySelector('[data-pjl-action="STEP"]').addEventListener('click',()=>{state=advance(state);render();});
    host.querySelector('[data-pjl-action="RESET"]').addEventListener('click',reset);
    host.querySelector('[data-pjl-action="PLAY"]').addEventListener('click',event=>{
      if(timer){stop();return;}
      if(state.complete)state=createState(config);
      event.currentTarget.textContent='PAUSE';
      timer=setInterval(()=>{state=advance(state);render();},520);
      render();
    });
    host.querySelector('[data-pjl-frequency-control="pin"]').addEventListener('input',event=>{frequencyView={...frequencyView,pin:Number(event.target.value)};renderFrequency(host,frequencyView);});
    host.querySelector('[data-pjl-frequency-control="rotation"]').addEventListener('input',event=>{frequencyView={...frequencyView,rotation:Number(event.target.value)};renderFrequency(host,frequencyView);});
    host.querySelectorAll('[data-pjl-transform]').forEach(button=>button.addEventListener('click',()=>{frequencyView={...frequencyView,transform:button.dataset.pjlTransform};renderFrequency(host,frequencyView);}));
    render();
    renderFrequency(host,frequencyView);
  };

  return {ROWS,PIN_COUNT,EXIT_COUNT,RETURN_SEGMENTS,PORT_STATES,MAX_STEP,NODE_COUNT,FREQUENCY_AXIS_COUNT,PHASE_RING_COUNT,YUGO_ENTRY_NODE,YUGO_GATE_MAGNITUDE,YUGO_EXIT_MAGNITUDE,clamp,mod,nodeCoordinates,frequencyAxis,phaseRing,rotateNode,antipodeNode,mirrorNode,pinNode,transformNode,signedGateNode,signedGateRoute,yugoGate,binomialRow,enumeratePaths,histogramForPaths,seededRandom,routePath,exitSide,returnAddress,returnAddressSpace,createRun,stageLabel,createState,advance,conservation,ballPosition,frequencyPoint,createHost,mount};
});
