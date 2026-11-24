(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.A0EchoWindingBench=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const VERSION='1.0.0';
  const IDENTITY='NEXAH_A0_ORIENTATION_CONTROLLER_BENCH';
  const CLASSIFICATION='BOUNDED_SYNTHETIC_ECHO_WINDING_VIEW';
  const SOURCE_ID='A0.EWB.SYNTHETIC_PACKET/1';
  const ROUTES=Object.freeze({
    CW_90:Object.freeze({id:'CW_90',label:'+90° · short',steps:Object.freeze([90]),color:'#38d7ee'}),
    CCW_270:Object.freeze({id:'CCW_270',label:'−270° · long',steps:Object.freeze([-90,-90,-90]),color:'#ff9d24'})
  });
  const KERNELS=Object.freeze({
    DIRECT:Object.freeze({id:'DIRECT',label:'Direct control',taps:Object.freeze([{delay:0,gain:1}])}),
    SHORT_ROOM:Object.freeze({id:'SHORT_ROOM',label:'Short room',taps:Object.freeze([{delay:0,gain:.82},{delay:3,gain:.36},{delay:6,gain:.18}])}),
    LAYERED_ROOM:Object.freeze({id:'LAYERED_ROOM',label:'Layered room',taps:Object.freeze([{delay:0,gain:.7},{delay:2,gain:.42},{delay:5,gain:-.25},{delay:9,gain:.16}])})
  });
  const mod=(value,m)=>((value%m)+m)%m;
  const round=value=>Number(Number(value).toFixed(9));
  const energy=values=>round(values.reduce((sum,value)=>sum+value*value,0));
  function sourcePacket(length=24){
    const out=Array.from({length},()=>0);out[2]=1;out[3]=.62;out[4]=.25;return Object.freeze(out);
  }
  function routeRecord(routeId='CW_90'){
    const route=ROUTES[routeId];if(!route)throw new RangeError(`Unknown route ${routeId}`);
    const signedDegrees=route.steps.reduce((sum,value)=>sum+value,0);
    return Object.freeze({id:route.id,label:route.label,steps:route.steps,signedDegrees,endOrientation:mod(signedDegrees,360),quarterTurns:signedDegrees/90,turns:signedDegrees/360,color:route.color});
  }
  function compareRoutes(){
    const short=routeRecord('CW_90'),long=routeRecord('CCW_270');
    return Object.freeze({sameEndpoint:short.endOrientation===long.endOrientation,endpointDegrees:short.endOrientation,historyEqual:JSON.stringify(short.steps)===JSON.stringify(long.steps),relativeDegrees:short.signedDegrees-long.signedDegrees,relativeWinding:(short.signedDegrees-long.signedDegrees)/360});
  }
  function convolve(signal,taps){
    const maxDelay=Math.max(...taps.map(tap=>tap.delay));
    const out=Array.from({length:signal.length+maxDelay},()=>0);
    signal.forEach((value,index)=>taps.forEach(tap=>{out[index+tap.delay]+=value*tap.gain}));
    return Object.freeze(out.map(round));
  }
  function analyze(routeId='CW_90',kernelId='SHORT_ROOM'){
    const route=routeRecord(routeId),kernel=KERNELS[kernelId];if(!kernel)throw new RangeError(`Unknown kernel ${kernelId}`);
    const source=sourcePacket(),echo=convolve(source,kernel.taps),padded=[...source,...Array(echo.length-source.length).fill(0)],residual=Object.freeze(echo.map((value,index)=>round(value-padded[index])));
    const delayed=kernel.taps.filter(tap=>tap.delay>0&&tap.gain!==0),direct=kernel.taps.find(tap=>tap.delay===0)?.gain||0,comparison=compareRoutes();
    return Object.freeze({schema:'nexah.a0.echo-winding-analysis/1',version:VERSION,identity:IDENTITY,classification:CLASSIFICATION,source:Object.freeze({id:SOURCE_ID,kind:'SYNTHETIC_DISPLAY_PACKET',samples:source,energy:energy(source)}),route,kernel:Object.freeze({id:kernel.id,label:kernel.label,taps:kernel.taps}),signals:Object.freeze({echo,residual}),metrics:Object.freeze({sourceEnergy:energy(source),echoEnergy:energy(echo),residualL1:round(residual.reduce((sum,value)=>sum+Math.abs(value),0)),directAttenuation:round(1-Math.abs(direct)),delayedTapCount:delayed.length,delayedGainL1:round(delayed.reduce((sum,tap)=>sum+Math.abs(tap.gain),0)),firstEchoDelay:delayed.length?Math.min(...delayed.map(tap=>tap.delay)):null}),comparison,ilau:Object.freeze({invariant:Object.freeze([SOURCE_ID,`END_${route.endOrientation}_DEG`,'FOUR_ORIENTATION_CHANNELS']),loss:Object.freeze({directAttenuation:round(1-Math.abs(direct))}),addition:Object.freeze({delayedTapCount:delayed.length,delayedGainL1:round(delayed.reduce((sum,tap)=>sum+Math.abs(tap.gain),0))}),unknown:Object.freeze(['PHYSICAL_ROOM_IDENTITY','ATTRACTOR_IDENTITY','HOPF_RELATION','PHOTON_INTERPRETATION']),residual:Object.freeze({l1:round(residual.reduce((sum,value)=>sum+Math.abs(value),0))})}),return:Object.freeze({orientation:'PASS',history:comparison.historyEqual?'PASS':'SPLIT',signal:kernel.id==='DIRECT'?'EXACT':'RESIDUAL'})});
  }
  function verify(){
    const comparison=compareRoutes(),direct=analyze('CW_90','DIRECT'),short=analyze('CW_90','SHORT_ROOM'),layered=analyze('CCW_270','LAYERED_ROOM');
    const assertions=Object.freeze({sameEndpoint:comparison.sameEndpoint&&comparison.endpointDegrees===90,distinctHistory:!comparison.historyEqual,oneRelativeWinding:comparison.relativeWinding===1,directExact:direct.metrics.residualL1===0&&direct.return.signal==='EXACT',echoDelayed:short.metrics.firstEchoDelay===3&&short.metrics.delayedTapCount===2,layeredSignedReflection:KERNELS.LAYERED_ROOM.taps.some(tap=>tap.gain<0),identityReused:[direct,short,layered].every(record=>record.identity===IDENTITY)});
    return Object.freeze({status:Object.values(assertions).every(Boolean)?'PASS':'FAIL',assertions});
  }
  function path(values,width=600,height=180){
    const max=Math.max(1,...values.map(value=>Math.abs(value))),dx=width/(values.length-1||1),mid=height/2;
    return values.map((value,index)=>`${index?'L':'M'}${(index*dx).toFixed(2)} ${(mid-value/max*(height*.42)).toFixed(2)}`).join(' ');
  }
  function svgMarkup(record){
    const route=record.route,active=route.id==='CW_90'?'short':'long';
    return `<g class="ewb-frame"><rect x="8" y="8" width="884" height="484" rx="20"/><g transform="translate(190 245)"><circle class="ewb-ring" r="122"/><line class="ewb-axis" x1="-145" y1="0" x2="145" y2="0"/><line class="ewb-axis" x1="0" y1="-145" x2="0" y2="145"/><path class="ewb-route short ${active==='short'?'active':''}" d="M0-122 A122 122 0 0 1 122 0"/><path class="ewb-route long ${active==='long'?'active':''}" d="M0-122 A122 122 0 1 0 122 0"/><circle class="ewb-source" cx="0" cy="-122" r="10"/><circle class="ewb-end" cx="122" cy="0" r="11"/><text class="ewb-label" x="0" y="-158" text-anchor="middle">SOURCE · 0°</text><text class="ewb-label" x="150" y="5">RETURN · 90°</text><text class="ewb-route-label cyan" x="72" y="-80">+90°</text><text class="ewb-route-label orange" x="-116" y="92">−270°</text></g><g transform="translate(340 76)"><rect class="ewb-chart" width="520" height="330" rx="14"/><path class="ewb-source-trace" d="${path([...record.source.samples,...Array(record.signals.echo.length-record.source.samples.length).fill(0)],480,90)}" transform="translate(20 28)"/><path class="ewb-echo-trace" d="${path(record.signals.echo,480,90)}" transform="translate(20 120)"/><path class="ewb-residual-trace" d="${path(record.signals.residual,480,90)}" transform="translate(20 212)"/><text class="ewb-trace-label" x="20" y="20">SOURCE</text><text class="ewb-trace-label echo" x="20" y="112">ECHO · ${record.kernel.id}</text><text class="ewb-trace-label residual" x="20" y="204">RESIDUAL · ρ₁ ${record.metrics.residualL1.toFixed(3)}</text><text class="ewb-time" x="500" y="318" text-anchor="end">DISCRETE DISPLAY TICKS →</text></g><text class="ewb-caption" x="450" y="472" text-anchor="middle">SAME ENDPOINT · DIFFERENT HISTORY · ${record.return.signal}</text></g>`;
  }
  function buildRecord(routeId='CW_90',kernelId='SHORT_ROOM'){
    const analysis=analyze(routeId,kernelId),proof=verify();
    return Object.freeze({...analysis,status:proof.status,proof,bindings:Object.freeze(['NEXAH_A0_ORIENTATION_CONTROLLER_BENCH','SG:LENS:ILAU_ORIENTATION']),authority:Object.freeze({researchRun:false,scientificEvidence:false,newIdentity:false,newRelation:false,physicalRoom:false,physicalPhoton:false,hopfEstablished:false,riemannIdentity:false}),boundary:'Synthetic discrete display packet and declared finite impulse-response kernels only. +90 and -270 share an endpoint modulo 360 while retaining distinct path histories. This is not an acoustic measurement, attractor equivalence, Hopf structure, Riemann-zeta identity, photon model or physical field.'});
  }
  function mount(doc,host){
    if(!doc||typeof doc.getElementById!=='function')throw new TypeError('Document-like root required');
    const section=doc.getElementById('echoWindingBench');if(!section)return null;
    let routeId='CW_90',kernelId='SHORT_ROOM';
    const byId=id=>doc.getElementById(id),svg=byId('echoWindingSvg');
    const render=()=>{const record=buildRecord(routeId,kernelId);if(svg)svg.innerHTML=svgMarkup(record);section.dataset.route=routeId;section.dataset.kernel=kernelId;const set=(id,value)=>{const node=byId(id);if(node)node.textContent=value};set('echoWindingStatus',`${routeId} · ${kernelId} · ${record.return.signal}`);set('echoWindingEndpoint',`${record.route.signedDegrees}° → ${record.route.endOrientation}°`);set('echoWindingHistory',`q=${record.route.quarterTurns} · Δw=${record.comparison.relativeWinding}`);set('echoWindingDelay',record.metrics.firstEchoDelay===null?'NONE':`${record.metrics.firstEchoDelay} ticks`);set('echoWindingResidual',record.metrics.residualL1.toFixed(6));set('echoWindingIlau',`I 3 · L ${record.metrics.directAttenuation.toFixed(2)} · A ${record.metrics.delayedTapCount} · U 4`);if(doc.querySelectorAll){Array.from(doc.querySelectorAll('[data-ewb-route]')).forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.ewbRoute===routeId)));Array.from(doc.querySelectorAll('[data-ewb-kernel]')).forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.ewbKernel===kernelId)))}return record};
    if(doc.querySelectorAll){Array.from(doc.querySelectorAll('[data-ewb-route]')).forEach(button=>button.addEventListener('click',()=>{routeId=button.dataset.ewbRoute;render()}));Array.from(doc.querySelectorAll('[data-ewb-kernel]')).forEach(button=>button.addEventListener('click',()=>{kernelId=button.dataset.ewbKernel;render()}))}
    const compare=byId('echoWindingCompare');if(compare)compare.addEventListener('click',()=>{routeId=routeId==='CW_90'?'CCW_270':'CW_90';render()});
    const exportButton=byId('echoWindingExport');if(exportButton)exportButton.addEventListener('click',()=>{const json=JSON.stringify(buildRecord(routeId,kernelId),null,2);section.dataset.lastExport=json;if(host&&host.Blob&&host.URL&&doc.createElement){const link=doc.createElement('a');link.href=host.URL.createObjectURL(new host.Blob([json],{type:'application/json'}));link.download='a0-echo-winding-view.json';link.click();host.URL.revokeObjectURL(link.href)}});
    render();return Object.freeze({render,getRecord:()=>buildRecord(routeId,kernelId),setRoute(id){routeId=id;return render()},setKernel(id){kernelId=id;return render()}});
  }
  return{VERSION,IDENTITY,CLASSIFICATION,SOURCE_ID,ROUTES,KERNELS,sourcePacket,routeRecord,compareRoutes,convolve,analyze,verify,path,svgMarkup,buildRecord,mount};
});
