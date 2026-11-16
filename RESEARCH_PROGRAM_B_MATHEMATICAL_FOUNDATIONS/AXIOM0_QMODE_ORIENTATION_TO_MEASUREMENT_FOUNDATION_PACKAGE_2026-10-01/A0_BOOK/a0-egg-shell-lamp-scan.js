(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.A0EggShellLampScan=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const NS='http://www.w3.org/2000/svg';
  const byId=(doc,id)=>doc.getElementById(id);
  const svg=(doc,name,attrs={})=>{const node=doc.createElementNS(NS,name);Object.entries(attrs).forEach(([key,value])=>node.setAttribute(key,String(value)));return node};
  function project(sample){
    const lat=sample.latitudeDegrees*Math.PI/180,az=sample.azimuthDegrees*Math.PI/180;
    const taper=.82+.18*Math.cos(lat);
    return {x:300+174*taper*Math.cos(lat)*Math.sin(az),y:238-195*Math.sin(lat),front:sample.depth>=0};
  }
  function mount(doc,env){
    const C=env.A0OrientationController,host=byId(doc,'eggShellLampScan');
    if(!C||!host)throw new Error('egg-shell scan dependencies unavailable');
    const fixture=C.eggShellScanFixture(),transition=C.numericalTransitionSequence(),grid=byId(doc,'eggScanGrid'),trace=byId(doc,'eggScanTrace'),lamp=byId(doc,'eggScanLamp'),meter=byId(doc,'eggScanMeter');
    let state=C.createEggShellScanState(),timer=null,called=false,transitionIndex=0,wheelOrientation='HORIZONTAL',wheelTaper=.22,wheelModel=C.nexusEggWheel({orientation:wheelOrientation,taper:wheelTaper});
    const points=fixture.samples.map(project),cells=[];
    for(let band=0;band<fixture.latitudeBands;band+=1){
      const samples=fixture.samples.filter(item=>item.band===band+1).map(project);
      grid.appendChild(svg(doc,'path',{d:samples.map((p,index)=>`${index?'L':'M'}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' '),class:'egg-grid-line'}));
    }
    for(let sector=0;sector<fixture.longitudeSteps;sector+=3){
      const samples=fixture.samples.filter(item=>item.sector===sector+1).map(project);
      grid.appendChild(svg(doc,'path',{d:samples.map((p,index)=>`${index?'L':'M'}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' '),class:`egg-grid-line ${points[sector].front?'':'back'}`}));
    }
    fixture.samples.forEach(sample=>{const cell=doc.createElement('i');cell.className='egg-scan-cell';cell.title=sample.key;meter.appendChild(cell);cells.push(cell)});
    function stop(){if(timer){env.clearInterval(timer);timer=null}state=C.createEggShellScanState({...state,running:false});byId(doc,'eggScanRun').textContent='RUN'}
    function render(){
      const frame=state.frame,current=frame.current,currentPoint=current?project(current):project(fixture.samples[0]);
      trace.replaceChildren();
      state.history.forEach(sample=>{const point=project(sample);trace.appendChild(svg(doc,'circle',{cx:point.x,cy:point.y,r:sample.key===current?.key?4:2.3,class:`egg-scan-dot ${point.front?'':'back'}`}))});
      lamp.setAttribute('cx',currentPoint.x);lamp.setAttribute('cy',currentPoint.y);lamp.hidden=!called;
      cells.forEach((cell,index)=>{cell.classList.toggle('visited',index<frame.visited);cell.classList.toggle('back',fixture.samples[index].depth<0);cell.classList.toggle('current',Boolean(current&&fixture.samples[index].key===current.key))});
      byId(doc,'eggScanStatus').textContent=frame.complete?'CLOSURE · RECEIPT READY':called?(state.running?'SCANNING':'PAUSED'):'WAITING · LAMPENRUF';
      byId(doc,'eggScanTime').textContent=`τ ${frame.normalizedTime.toFixed(3)}`;
      byId(doc,'eggScanAzimuth').textContent=current?`φ ${current.azimuthDegrees.toFixed(0)}°`:'φ 0°';
      byId(doc,'eggScanBand').textContent=current?`${current.band}/${fixture.latitudeBands}`:`0/${fixture.latitudeBands}`;
      byId(doc,'eggScanCoverage').textContent=`${frame.visited}/${fixture.totalSamples} · ${(frame.coverage*100).toFixed(1)}%`;
      byId(doc,'eggScanAddress').textContent=current?`${current.key} · ${frame.readingLabel}`:frame.readingLabel;
      const receipt=byId(doc,'eggScanReceipt');receipt.textContent=frame.closureReceipt||'OPEN · vollständige Schale noch nicht besucht';receipt.classList.toggle('closed',frame.complete);
      byId(doc,'eggScanExport').disabled=!frame.complete;
      if(frame.complete)stop();
    }
    function step(){called=true;state=C.stepEggShellScan(state,1);render()}
    function run(){called=true;if(state.frame.complete)return;state=C.createEggShellScanState({...state,running:!state.running});if(state.running){timer=env.setInterval(step,state.speedMs);byId(doc,'eggScanRun').textContent='PAUSE'}else stop();render()}
    function renderTransition(){
      const layer=transition.layers[transitionIndex],lane=byId(doc,'numericalTransitionLane');
      lane.dataset.activeLayer=String(layer.depth);
      byId(doc,'numericalTransitionLayer').textContent=`LAYER ${layer.depth} · ${layer.key.replaceAll('_',' ')}`;
      byId(doc,'numericalTransitionOperator').textContent=layer.operator;
      byId(doc,'numericalTransitionFormula').textContent=layer.formula;
      doc.querySelectorAll('[data-numerical-layer]').forEach(node=>node.classList.toggle('active',Number(node.dataset.numericalLayer)===layer.depth));
      byId(doc,'numericalTransitionIn').disabled=transitionIndex===transition.layers.length-1;
      byId(doc,'numericalTransitionOut').disabled=transitionIndex===0;
    }
    function renderWheel(){
      wheelModel=C.nexusEggWheel({orientation:wheelOrientation,taper:wheelTaper});
      const horizontal=wheelModel.orientation==='HORIZONTAL',map=point=>({x:340+point.x*(horizontal?250:155),y:215+point.y*(horizontal?155:180)});
      const shellPath=wheelModel.shell.map((point,index)=>{const p=map(point);return `${index?'L':'M'}${p.x.toFixed(2)},${p.y.toFixed(2)}`}).join(' ')+' Z';
      byId(doc,'nexusWheelShell').setAttribute('d',shellPath);
      const drawGrid=(id,points,radius)=>{const group=byId(doc,id);group.replaceChildren();points.forEach(point=>{const p=map(point);group.appendChild(svg(doc,'circle',{cx:p.x.toFixed(2),cy:p.y.toFixed(2),r:radius}))})};
      drawGrid('nexusWheel64',wheelModel.grids.outer64,2.5);drawGrid('nexusWheel27',wheelModel.grids.inner27,3.1);
      const anchors=byId(doc,'nexusWheelAnchors');anchors.replaceChildren();wheelModel.anchors.forEach(anchor=>{const p=map(anchor),left=p.x<340,top=p.y<215;anchors.appendChild(svg(doc,'line',{x1:340,y1:215,x2:p.x.toFixed(2),y2:p.y.toFixed(2)}));anchors.appendChild(svg(doc,'circle',{cx:p.x.toFixed(2),cy:p.y.toFixed(2),r:5}));const label=svg(doc,'text',{x:(p.x+(left?-8:8)).toFixed(2),y:(p.y+(top?-8:15)).toFixed(2),'text-anchor':left?'end':'start'});label.textContent=`${anchor.id} ${anchor.value} · ${anchor.angleDegrees}°`;anchors.appendChild(label)});
      const axis=byId(doc,'nexusWheelAxis');axis.setAttribute('x1',horizontal?62:340);axis.setAttribute('y1',horizontal?215:35);axis.setAttribute('x2',horizontal?618:340);axis.setAttribute('y2',horizontal?215:395);
      byId(doc,'nexusEggWheel').dataset.orientation=wheelModel.orientation;
      byId(doc,'nexusWheelTaperValue').textContent=wheelModel.taper.toFixed(2);
      byId(doc,'nexusWheelReadout').textContent=`BODY TOP → ${wheelModel.asymmetry.screenDirectionOfBodyTop} · κ ${wheelModel.taper.toFixed(2)} · W↑/W↓ ${wheelModel.asymmetry.upperToLowerRatio.toFixed(3)}`;
    }
    byId(doc,'eggScanCall').addEventListener('click',()=>{called=true;if(!state.step)step();if(!state.frame.complete&&!state.running)run()});
    byId(doc,'eggScanRun').addEventListener('click',run);
    byId(doc,'eggScanStep').addEventListener('click',()=>{stop();step()});
    byId(doc,'eggScanReset').addEventListener('click',()=>{stop();called=false;state=C.createEggShellScanState({speedMs:Number(byId(doc,'eggScanSpeed').value)});render()});
    byId(doc,'eggScanSpeed').addEventListener('change',event=>{const wasRunning=state.running;stop();state=C.createEggShellScanState({...state,speedMs:Number(event.target.value),running:false});if(wasRunning)run();render()});
    byId(doc,'eggScanExport').addEventListener('click',()=>{const payload={tool:'A0 Egg-Shell Lamp Scan',version:C.VERSION,state,fixture:{...fixture,samples:undefined},numericalTransition:transition,nexusEggWheel:wheelModel,receipt:state.frame.closureReceipt,boundary:state.frame.boundary};const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}),a=doc.createElement('a');a.href=URL.createObjectURL(blob);a.download='a0-egg-shell-lamp-scan-receipt.json';a.click();env.setTimeout(()=>URL.revokeObjectURL(a.href),1000)});
    byId(doc,'numericalTransitionIn').addEventListener('click',()=>{transitionIndex=Math.min(transition.layers.length-1,transitionIndex+1);renderTransition()});
    byId(doc,'numericalTransitionOut').addEventListener('click',()=>{transitionIndex=Math.max(0,transitionIndex-1);renderTransition()});
    byId(doc,'numericalTransitionReset').addEventListener('click',()=>{transitionIndex=0;renderTransition()});
    byId(doc,'nexusWheelOrientation').addEventListener('click',()=>{wheelOrientation=wheelOrientation==='HORIZONTAL'?'VERTICAL':'HORIZONTAL';renderWheel()});
    byId(doc,'nexusWheelTaper').addEventListener('input',event=>{wheelTaper=Number(event.target.value);renderWheel()});
    byId(doc,'nexusWheelReset').addEventListener('click',()=>{wheelOrientation='HORIZONTAL';wheelTaper=.22;byId(doc,'nexusWheelTaper').value='0.22';renderWheel()});
    render();renderTransition();renderWheel();
    return {getState:()=>state,getTransition:()=>({index:transitionIndex,layer:transition.layers[transitionIndex],contract:transition}),getNexusWheel:()=>wheelModel,step,run,reset:()=>byId(doc,'eggScanReset').click()};
  }
  return {mount,project};
});
