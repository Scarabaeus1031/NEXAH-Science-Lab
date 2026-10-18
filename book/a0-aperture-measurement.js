(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.A0ApertureMeasurement=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const TAU=Math.PI*2;
  const VIEW_IDS=Object.freeze(['unrolled','cylinder','top','slice']);
  const VIEW_META=Object.freeze({
    unrolled:{label:'Unrolled trace',map:'x=A/2π · y=h',spatial:['h','A'],hidden:['I']},
    cylinder:{label:'Rolled / cylinder',map:'x=r(I)cos A · y=h · z=r(I)sin A',spatial:['h','A','I'],hidden:[]},
    top:{label:'Top view',map:'x=r(I)cos A · y=r(I)sin A',spatial:['A','I'],hidden:['h']},
    slice:{label:'Aperture slice',map:'x=I · y=h',spatial:['h','I'],hidden:['A']}
  });
  const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
  function createTrace({count=48,opening=.42}={}){
    if(!Number.isInteger(count)||count<8||count>256)throw Error('count must be integer 8..256');
    if(!Number.isFinite(opening)||opening<.18||opening>.72)throw Error('opening must be normalized .18..72');
    return Array.from({length:count},(_,index)=>{
      const t=index/count,A=TAU*t,h=.5+.38*Math.sin(A)+.08*Math.sin(3*A),I=clamp(opening*(.78+.22*Math.cos(2*A)),.02,.98);
      return Object.freeze({index,t,h,A,I});
    });
  }
  function projectSample(sample,view){
    if(!VIEW_IDS.includes(view))throw Error('unknown view');
    const radius=.22+.34*sample.I;
    if(view==='unrolled')return{x:sample.A/TAU,y:1-sample.h,z:0};
    if(view==='cylinder')return{x:.5+radius*Math.cos(sample.A),y:1-sample.h,z:radius*Math.sin(sample.A)};
    if(view==='top')return{x:.5+radius*Math.cos(sample.A),y:.5+radius*Math.sin(sample.A),z:sample.h};
    return{x:sample.I,y:1-sample.h,z:sample.A/TAU};
  }
  function projectTrace(trace,view){return trace.map(sample=>({...projectSample(sample,view),sourceIndex:sample.index}));}
  function traceFingerprint(trace){return trace.map(s=>[s.index,s.t,s.h,s.A,s.I].map(v=>Number(v).toFixed(12)).join(':')).join('|');}
  function compareViews(trace,a,b){
    if(!VIEW_IDS.includes(a)||!VIEW_IDS.includes(b))throw Error('unknown comparison view');
    const pa=projectTrace(trace,a),pb=projectTrace(trace,b),distances=pa.map((p,i)=>Math.hypot(p.x-pb[i].x,p.y-pb[i].y));
    const rmse=Math.sqrt(distances.reduce((sum,value)=>sum+value*value,0)/distances.length);
    return Object.freeze({metric:'NORMALIZED_2D_DISPLAY_RMSE',a,b,rmse,max:Math.max(...distances),sameCarrier:traceFingerprint(trace)===traceFingerprint(trace),sampleCount:trace.length});
  }
  function ledger(trace,a,b,cut=.5){
    const hidden=[...new Set([...VIEW_META[a].hidden,...VIEW_META[b].hidden])];
    return Object.freeze({
      schema:'nexah.a0.aperture-ilau/1',
      retained:['sample order','h','A','I','source index'],
      lost:[],
      introduced:['normalized display coordinates','selected 2D projection','display RMSE'],
      unresolved:['physical units','empirical calibration','cross-view metric meaning beyond this display'],
      spatiallyHidden:hidden,
      cut:Number(cut),
      sourceSamples:trace.length
    });
  }
  function buildRecord({count=48,opening=.42,view='unrolled',compareA='unrolled',compareB='top',cut=.5}={}){
    const trace=createTrace({count,opening}),comparison=compareViews(trace,compareA,compareB),ilau=ledger(trace,compareA,compareB,cut),fingerprint=traceFingerprint(trace);
    return Object.freeze({schema:'nexah.a0.aperture-m3-view-record/1',source:'PXA_BLUE_IRIS_APERTURE',measure:'M3(t)=(h,A,I)',units:{h:'NORMALIZED',A:'RADIANS',I:'NORMALIZED'},count,opening,activeView:view,viewMap:VIEW_META[view].map,compare:comparison,ilau,sourceFingerprint:fingerprint,return:{exact:fingerprint===traceFingerprint(trace),residual:0},boundary:'Engineering trace and representation audit only; no physical aperture law, carrier identity transfer or scientific run.'});
  }
  function mount(doc,win=doc.defaultView){
    const host=doc.getElementById('apertureMeasurement');if(!host)return null;
    const svg=doc.getElementById('m3MeasureSvg'),viewButtons=[...host.querySelectorAll('[data-m3-view]')],play=doc.getElementById('m3Play'),step=doc.getElementById('m3Step'),reset=doc.getElementById('m3Reset'),speed=doc.getElementById('m3Speed'),cut=doc.getElementById('m3Cut'),compareA=doc.getElementById('m3CompareA'),compareB=doc.getElementById('m3CompareB'),metric=doc.getElementById('m3Metric'),readout=doc.getElementById('m3Readout'),ledgerBox=doc.getElementById('m3Ledger'),exportButton=doc.getElementById('m3Export'),sourceAperture=doc.getElementById('pxaAperture'),status=doc.getElementById('m3Status');
    const required={svg,play,step,reset,speed,cut,compareA,compareB,metric,readout,ledgerBox,exportButton};
    const missing=Object.entries(required).filter(([,node])=>!node).map(([name])=>name);
    if(missing.length)throw Error(`M3 mount missing: ${missing.join(', ')}`);
    let view='unrolled',cursor=0,timer=0,viewCursor=0;
    const opening=()=>Number(sourceAperture?.value||42)/100;
    const trace=()=>createTrace({count:48,opening:opening()});
    const svgEl=(name,attrs,text)=>{const node=doc.createElementNS('http://www.w3.org/2000/svg',name);Object.entries(attrs).forEach(([key,value])=>node.setAttribute(key,String(value)));if(text!==undefined)node.textContent=text;return node};
    function commitSvg(nodes){
      while(svg.firstChild)svg.removeChild(svg.firstChild);
      nodes.forEach(node=>svg.appendChild(node));
    }
    function renderFrame(){
      const samples=trace(),points=projectTrace(samples,view),active=samples[cursor],position=points[cursor],cmp=compareViews(samples,compareA.value,compareB.value),ilau=ledger(samples,compareA.value,compareB.value,cut.value);
      const nodes=[];
      nodes.push(svgEl('rect',{x:20,y:20,width:700,height:360,rx:10,class:'m3-frame'}));
      nodes.push(svgEl('text',{x:38,y:48,class:'m3-caption'},`${VIEW_META[view].label.toUpperCase()} · ${VIEW_META[view].map}`));
      if(view==='cylinder')for(let i=0;i<7;i++)nodes.push(svgEl('ellipse',{cx:370,cy:75+i*46,rx:210,ry:38,class:'m3-grid'}));
      if(view==='top')for(let i=1;i<5;i++)nodes.push(svgEl('circle',{cx:370,cy:200,r:i*42,class:'m3-grid'}));
      const xy=p=>[55+p.x*630,58+p.y*292],path=points.map((p,i)=>`${i?'L':'M'}${xy(p).map(n=>n.toFixed(2)).join(' ')}`).join(' ');
      nodes.push(svgEl('path',{d:path,class:'m3-trace'}));
      points.forEach((p,i)=>{const [x,y]=xy(p);nodes.push(svgEl('circle',{cx:x,cy:y,r:i===cursor?7:2.5,class:i===cursor?'m3-point active':'m3-point'}))});
      const [cx,cy]=xy(position);nodes.push(svgEl('line',{x1:cx,y1:58,x2:cx,y2:350,class:'m3-cut'}));nodes.push(svgEl('text',{x:cx+8,y:365,class:'m3-caption'},`CUT ${Number(cut.value).toFixed(2)}`));
      commitSvg(nodes);
      viewButtons.forEach(button=>button.classList.toggle('active',button.dataset.m3View===view));
      doc.getElementById('m3H').textContent=active.h.toFixed(4);doc.getElementById('m3A').textContent=`${active.A.toFixed(4)} rad`;doc.getElementById('m3I').textContent=active.I.toFixed(4);doc.getElementById('m3Index').textContent=`${cursor+1}/48`;
      metric.textContent=`Δ(${compareA.value}, ${compareB.value}) = ${cmp.rmse.toFixed(6)} RMSE · max ${cmp.max.toFixed(6)}`;
      readout.textContent=`same 48 ordered samples · ${VIEW_META[view].map} · source residual 0`;
      ledgerBox.innerHTML=`<span><b>R · RETAINED</b>${ilau.retained.join(' · ')}</span><span><b>L · LOST</b>${ilau.lost.length?ilau.lost.join(' · '):'none from record'}</span><span><b>A · ADDED</b>${ilau.introduced.join(' · ')}</span><span><b>U · UNRESOLVED</b>${ilau.unresolved.join(' · ')}</span><em>spatially hidden: ${ilau.spatiallyHidden.join(' · ')||'none'}</em>`;
      win.A0ApertureMeasurementView={record:buildRecord({opening:opening(),view,compareA:compareA.value,compareB:compareB.value,cut:Number(cut.value)}),cursor};
      if(status){status.textContent='SOURCE · P×A BLUE IRIS · LIVE';status.dataset.state='live'}
      return true;
    }
    function render(){
      try{return renderFrame()}
      catch(error){
        const message=`M3 RENDER ERROR · ${error&&error.message?error.message:String(error)}`;
        metric.textContent=message;readout.textContent='Renderer stopped safely. Reload after repair.';
        if(status){status.textContent=message;status.dataset.state='error'}
        if(win.console&&typeof win.console.error==='function')win.console.error(error);
        return false;
      }
    }
    function advance(){cursor=(cursor+1)%48;if(cursor%12===0){viewCursor=(viewCursor+1)%VIEW_IDS.length;view=VIEW_IDS[viewCursor]}if(!render())stop()}
    function setView(nextView){if(!VIEW_IDS.includes(nextView))throw Error('unknown view');view=nextView;viewCursor=VIEW_IDS.indexOf(view);render();return view}
    function stop(){if(timer)win.clearInterval(timer);timer=0;play.classList.remove('active');play.textContent='Play M3 + views';play.setAttribute('aria-pressed','false')}
    function start(){if(timer)return;play.classList.add('active');play.textContent='Pause M3 + views';play.setAttribute('aria-pressed','true');timer=win.setInterval(advance,Number(speed.value))}
    play.addEventListener('click',()=>timer?stop():start());step.addEventListener('click',()=>{stop();advance()});reset.addEventListener('click',()=>{stop();cursor=0;viewCursor=0;view='unrolled';render()});speed.addEventListener('change',()=>{if(timer){stop();start()}});cut.addEventListener('input',render);compareA.addEventListener('change',render);compareB.addEventListener('change',render);sourceAperture?.addEventListener('input',render);viewButtons.forEach(button=>button.addEventListener('click',()=>{view=button.dataset.m3View;viewCursor=VIEW_IDS.indexOf(view);render()}));
    exportButton.addEventListener('click',()=>{const blob=new Blob([JSON.stringify(win.A0ApertureMeasurementView.record,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=doc.createElement('a');a.href=url;a.download='a0-aperture-m3-ilau-record.json';a.click();URL.revokeObjectURL(url)});
    render();return Object.freeze({start,stop,step:advance,render,setView,get view(){return view},get record(){return win.A0ApertureMeasurementView.record}});
  }
  return{TAU,VIEW_IDS,VIEW_META,createTrace,projectSample,projectTrace,traceFingerprint,compareViews,ledger,buildRecord,mount};
});
