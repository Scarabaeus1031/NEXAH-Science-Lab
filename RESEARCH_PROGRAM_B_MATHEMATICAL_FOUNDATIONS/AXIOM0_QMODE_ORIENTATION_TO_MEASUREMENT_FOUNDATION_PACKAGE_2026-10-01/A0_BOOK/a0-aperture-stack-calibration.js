(function(root,factory){
  const api=factory(typeof module==='object'&&module.exports?require('./a0-aperture-measurement.js'):root.A0ApertureMeasurement);
  if(typeof module==='object'&&module.exports)module.exports=api;else root.A0ApertureStackCalibration=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(M3){
  'use strict';
  const SOURCE_ANGLES=Object.freeze([51.63,51.73,51.83,51.93,52.03,52.13]);
  const CONTROL_ANGLES=Object.freeze([37,41,46,54,63,71]);
  const STACKS=Object.freeze({
    source:Object.freeze({id:'source',label:'MUINDI SOURCE-LOCAL STACK',angles:SOURCE_ANGLES,referenceIndex:2,toleranceDeg:.02,provenance:'OWNER-SUPPLIED CONCEPT VISUAL · 5594C644-4C9A-46EF-8DC6-298020D1A5B6_1_105_c.jpeg · executable source not recovered'}),
    control:Object.freeze({id:'control',label:'IRREGULAR NON-SPECIAL CONTROL',angles:CONTROL_ANGLES,referenceIndex:2,toleranceDeg:.02,provenance:'DETERMINISTIC ENGINEERING CONTROL · six plates · deliberately irregular spacing'})
  });
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const rad=degrees=>degrees*Math.PI/180;
  const wrap=value=>Math.atan2(Math.sin(value),Math.cos(value));
  function stackFixture(id='source'){
    const stack=STACKS[id];if(!stack)throw Error('unknown stack');
    const reference=stack.angles[stack.referenceIndex];
    return Object.freeze({...stack,plates:Object.freeze(stack.angles.map((angle,index)=>Object.freeze({index,plate:`P${index+1}`,nominalAngleDeg:angle,deltaThetaDeg:Number((angle-reference).toFixed(2)),reference:index===stack.referenceIndex})))});
  }
  function inspectPlate(trace,plate,{windowDeg=52}={}){
    if(!Array.isArray(trace)||!trace.length)throw Error('trace required');
    const half=rad(clamp(windowDeg,12,120))/2,theta=rad(plate.nominalAngleDeg),visibleIndices=[];
    const display=trace.map(sample=>{
      const local=wrap(sample.A-theta),visible=Math.abs(local)<=half;
      if(visible)visibleIndices.push(sample.index);
      return Object.freeze({sourceIndex:sample.index,x:.5+local/(2*Math.PI),y:1-sample.h,visible});
    });
    return Object.freeze({plate,windowDeg,visibleIndices:Object.freeze(visibleIndices),hiddenCount:trace.length-visibleIndices.length,display:Object.freeze(display),retained:['ordered source record','h','A','I','source index'],lost:[],introduced:['plate-local azimuth display','visibility gate','plate comparison metric'],unresolved:['physical calibration','empirical optical response','causal interpretation']});
  }
  function compareToReference(trace,fixture,plateIndex,options={}){
    const plate=fixture.plates[plateIndex],reference=fixture.plates[fixture.referenceIndex];
    if(!plate)throw Error('plate index out of range');
    const current=inspectPlate(trace,plate,options),base=inspectPlate(trace,reference,options);
    const distances=current.display.map((p,index)=>Math.hypot(p.x-base.display[index].x,p.y-base.display[index].y));
    return Object.freeze({metric:'NORMALIZED_2D_DISPLAY_RMSE',rmse:Math.sqrt(distances.reduce((sum,v)=>sum+v*v,0)/distances.length),max:Math.max(...distances),visibleOverlap:current.visibleIndices.filter(index=>base.visibleIndices.includes(index)).length,current,reference:base});
  }
  function buildRecord({stackId='source',plateIndex=0,opening=.42,windowDeg=52,sourceTrace=null}={}){
    const fixture=stackFixture(stackId),trace=sourceTrace||M3.createTrace({count:48,opening}),comparison=compareToReference(trace,fixture,plateIndex,{windowDeg}),fingerprint=M3.traceFingerprint(trace);
    return Object.freeze({schema:'nexah.a0.aperture-stack-calibration/1',source:'PXA_BLUE_IRIS_APERTURE',fixture:{id:fixture.id,label:fixture.label,provenance:fixture.provenance,toleranceDeg:fixture.toleranceDeg,referenceIndex:fixture.referenceIndex,plates:fixture.plates},activePlate:fixture.plates[plateIndex],windowDeg,opening,sampleCount:trace.length,comparison:{metric:comparison.metric,rmse:comparison.rmse,max:comparison.max,visibleOverlap:comparison.visibleOverlap,visibleCount:comparison.current.visibleIndices.length,hiddenCount:comparison.current.hiddenCount},ilau:{retained:comparison.current.retained,lost:comparison.current.lost,introduced:comparison.current.introduced,unresolved:comparison.current.unresolved},sourceFingerprint:fingerprint,return:{referencePlate:fixture.plates[fixture.referenceIndex].plate,exact:fingerprint===M3.traceFingerprint(trace),residual:0},boundary:'Source-local engineering fixture and display gate only; no empirical, optical, astronomical, prime, causal or physical calibration claim.'});
  }
  function sharedSource(source){
    if(source?.record?.schema!=='nexah.a0.aperture-m3-view-record/1'||source.record.source!=='PXA_BLUE_IRIS_APERTURE'||source.record.count!==48||
      !Array.isArray(source.trace)||source.trace.length!==48||!Number.isInteger(source.cursor)||source.cursor<0||source.cursor>=48||
      source.trace.some((s,i)=>s.index!==i||!['t','h','A','I'].every(k=>Number.isFinite(s[k])))||
      M3.traceFingerprint(source.trace)!==source.record.sourceFingerprint)throw Error('shared M3 source unavailable or inconsistent');
    return source;
  }
  function mount(doc,win=doc.defaultView){
    const host=doc.getElementById('apertureStackCalibration');if(!host)return null;
    const byId=id=>doc.getElementById(id),svg=byId('apStackSvg'),play=byId('apStackPlay'),step=byId('apStackStep'),reset=byId('apStackReset'),speed=byId('apStackSpeed'),mode=byId('apStackMode'),windowControl=byId('apStackWindow'),windowOut=byId('apStackWindowOut'),plateOut=byId('apStackPlate'),angleOut=byId('apStackAngle'),deltaOut=byId('apStackDelta'),visibleOut=byId('apStackVisible'),metric=byId('apStackMetric'),ledger=byId('apStackLedger'),status=byId('apStackStatus'),exportButton=byId('apStackExport'),sourceAperture=byId('pxaAperture');
    const required={svg,play,step,reset,speed,mode,windowControl,windowOut,plateOut,angleOut,deltaOut,visibleOut,metric,ledger,status,exportButton};const missing=Object.entries(required).filter(([,v])=>!v).map(([k])=>k);if(missing.length)throw Error(`Aperture stack mount missing: ${missing.join(', ')}`);
    let plateIndex=0,timer=0;
    const subscribers=new Set(),notify=()=>{for(const fn of subscribers)try{fn();}catch(error){win.console?.error?.('Stack subscriber error',error);}};
    const sharedControl=byId('apStackFollowM3'),sharedStatus=byId('apStackM3Status');
    const opening=()=>Number(sourceAperture?.value||42)/100;
    const svgEl=(name,attrs,text)=>{const node=doc.createElementNS('http://www.w3.org/2000/svg',name);Object.entries(attrs).forEach(([k,v])=>node.setAttribute(k,String(v)));if(text!==undefined)node.textContent=text;return node};
    const clear=()=>{while(svg.firstChild)svg.removeChild(svg.firstChild)};
    function render(){
      try{
        const shared=sharedControl?.checked?sharedSource(win.A0ApertureMeasurementController?.readSource?.()):null;
        const trace=shared?shared.trace:M3.createTrace({count:48,opening:opening()});
        const fixture=stackFixture(mode.value),base=buildRecord({stackId:fixture.id,plateIndex,opening:shared?shared.record.opening:opening(),windowDeg:Number(windowControl.value),sourceTrace:trace});
        const inspection=inspectPlate(trace,base.activePlate,{windowDeg:Number(windowControl.value)}),selectedIndex=shared?shared.cursor:plateIndex*8;
        const record=shared?Object.freeze({...base,m3Link:{mode:'SHARED_SOURCE_RECORD',sourceIndex:selectedIndex,visible:inspection.visibleIndices.includes(selectedIndex),fingerprintMatch:true,sharedClock:false}}):base,plate=record.activePlate;
        clear();const nodes=[];nodes.push(svgEl('rect',{x:18,y:18,width:724,height:404,rx:14,class:'aps-frame'}));nodes.push(svgEl('text',{x:38,y:48,class:'aps-caption'},`${fixture.label} · SAME 48-SAMPLE M3 RECORD`));
        fixture.plates.forEach((item,index)=>{const y=82+index*52,active=index===plateIndex;nodes.push(svgEl('ellipse',{cx:250,cy:y,rx:170,ry:25,class:`aps-plate${active?' active':''}${item.reference?' reference':''}`}));nodes.push(svgEl('ellipse',{cx:250,cy:y,rx:54,ry:14,class:'aps-hole'}));nodes.push(svgEl('text',{x:55,y:y+4,class:'aps-label'},`${item.plate} · ${item.nominalAngleDeg.toFixed(2)}°`));nodes.push(svgEl('text',{x:455,y:y+4,class:'aps-delta'},`${item.deltaThetaDeg>=0?'+':''}${item.deltaThetaDeg.toFixed(2)}°`))});
        const visible=new Set(inspection.visibleIndices),points=trace.map((sample,index)=>{const x=520+(sample.A/M3.TAU)*190,y=360-sample.h*235;return{x,y,visible:visible.has(index)}});nodes.push(svgEl('path',{d:points.map((p,i)=>`${i?'L':'M'}${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' '),class:'aps-trace'}));points.forEach((p,index)=>nodes.push(svgEl('circle',{cx:p.x,cy:p.y,r:index===selectedIndex?6:2.6,class:`aps-sample ${p.visible?'visible':'hidden'}${index===selectedIndex?' linked-selected':''}`})));nodes.push(svgEl('text',{x:520,y:390,class:'aps-caption'},'PLATE-LOCAL VISIBILITY · RECORD RETAINED'));
        nodes.forEach(node=>svg.appendChild(node));plateOut.textContent=`${plate.plate} / 6`;angleOut.textContent=`${plate.nominalAngleDeg.toFixed(2)}°`;deltaOut.textContent=`${plate.deltaThetaDeg>=0?'+':''}${plate.deltaThetaDeg.toFixed(2)}°`;visibleOut.textContent=`${record.comparison.visibleCount}/48`;windowOut.textContent=`${Number(windowControl.value).toFixed(0)}°`;metric.textContent=`Δ(reference, ${plate.plate}) = ${record.comparison.rmse.toFixed(6)} RMSE · tolerance ±${fixture.toleranceDeg.toFixed(2)}°`;
        ledger.innerHTML=`<span><b>R · RETAINED</b>${record.ilau.retained.join(' · ')}</span><span><b>H · HIDDEN</b>${record.comparison.hiddenCount} display samples · full record retained</span><span><b>A · ADDED</b>${record.ilau.introduced.join(' · ')}</span><span><b>U · UNRESOLVED</b>${record.ilau.unresolved.join(' · ')}</span><em>RETURN · ${record.return.referencePlate} · exact ${record.return.exact} · residual ${record.return.residual}</em>`;
        status.textContent=`${fixture.id.toUpperCase()} · ${plate.plate} · LIVE`;status.dataset.state='live';win.A0ApertureStackView={record,plateIndex};
        if(sharedStatus)sharedStatus.textContent=shared?'M3 verbunden · Sample '+(selectedIndex+1)+'/48 · '+(record.m3Link.visible?'sichtbar':'verdeckt')+' durch '+plate.plate+' · Quellenfingerprint gleich · Plattenuhr separat':'Eigenständiger Stack · gleiche Modellregel, kein gemeinsamer Lesepunkt';
        notify();
        return true;
      }catch(error){win.A0ApertureStackView=null;status.textContent=`STACK ERROR · ${error.message}`;status.dataset.state='error';metric.textContent=status.textContent;if(sharedStatus)sharedStatus.textContent='HOLD · kein bestätigter gemeinsamer M3-Record';notify();if(win.console?.error)win.console.error(error);return false}
    }
    function stop(){if(timer)win.clearInterval(timer);timer=0;play.textContent='Play stack';play.setAttribute('aria-pressed','false');notify();}
    function advance(){plateIndex=(plateIndex+1)%6;if(!render())stop()}
    function start(){if(timer||win.matchMedia?.('(prefers-reduced-motion: reduce)').matches)return;play.textContent='Pause stack';play.setAttribute('aria-pressed','true');timer=win.setInterval(advance,Number(speed.value));notify();}
    play.addEventListener('click',()=>timer?stop():start());step.addEventListener('click',()=>{stop();advance()});reset.addEventListener('click',()=>{stop();plateIndex=0;mode.value='source';render()});speed.addEventListener('change',()=>{if(timer){stop();start()}});mode.addEventListener('change',()=>{plateIndex=0;render()});windowControl.addEventListener('input',render);sourceAperture?.addEventListener('input',render);doc.addEventListener?.('visibilitychange',()=>{if(doc.hidden)stop()});win.addEventListener?.('pagehide',stop);
    exportButton.addEventListener('click',()=>{const blob=new Blob([JSON.stringify(win.A0ApertureStackView.record,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=doc.createElement('a');a.href=url;a.download='a0-aperture-stack-calibration-record.json';a.click();URL.revokeObjectURL(url)});
    sharedControl?.addEventListener('change',render);
    const unsubscribe=win.A0ApertureMeasurementController?.subscribe?.(()=>{if(sharedControl?.checked)render()});
    win.addEventListener?.('pagehide',()=>unsubscribe?.());
    render();return Object.freeze({start,stop,step:advance,reset:()=>{stop();plateIndex=0;render()},render,
      subscribe(fn){subscribers.add(fn);return()=>subscribers.delete(fn)},
      setSharedFollow(value){if(typeof value!=='boolean'||!sharedControl)return false;sharedControl.checked=value;return render();},
      get following(){return !!sharedControl?.checked},get running(){return !!timer},get record(){return win.A0ApertureStackView?.record||null}});
  }
  return{SOURCE_ANGLES,CONTROL_ANGLES,STACKS,stackFixture,inspectPlate,compareToReference,buildRecord,sharedSource,mount};
});
