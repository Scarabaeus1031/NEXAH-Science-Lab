/* Breathing display adapter over existing content and the existing signal clock. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.A0BreathingFinModel=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  function breath(time,strength=.6){if(!Number.isFinite(time)||!Number.isFinite(strength)||strength<0||strength>1)throw new RangeError('finite time and strength 0..1');const wave=strength*Math.sin(time);return{time,strength,opening:.5+.5*wave,width:1+.25*wave,height:1+.04*wave,bend:strength===0?0:strength*Math.cos(time)*5,coreWidth:1+.1*wave,envelopeWidth:1+.16*wave};}
  function finPath(ctx,top,bottom,width,bend){const mid=(top+bottom)/2;ctx.beginPath();ctx.moveTo(0,top);ctx.bezierCurveTo(-width*.24+bend,mid-25,-width+bend,mid+4,0,bottom);ctx.bezierCurveTo(width+bend,mid+4,width*.24+bend,mid-25,0,top);ctx.closePath();}
  function flamePath(ctx,cx,base,height,width,phase=0){ctx.beginPath();ctx.moveTo(cx,base-height);ctx.bezierCurveTo(cx-width*(.18+phase),base-height*.72,cx-width,base-height*.35,cx,base);ctx.bezierCurveTo(cx+width,base-height*.35,cx+width*(.12-phase),base-height*.72,cx,base-height);ctx.closePath();}
  return{breath,finPath,flamePath};
});
(() => {
  if(typeof window==='undefined')return;
  const $=id=>document.getElementById(id),host=$('breathingFinControls'),view=window.A0ThreeLissajousPlanesView,model=window.A0BreathingFinModel;
  if(!host||!view||!model)return;
  const colors=['#e5b340','#29c7ef','#ee6ca5'];let lastTime=-Infinity,lastCell='';
  const enabled=()=>$('breathingFinEnabled').checked,mode=()=>$('breathingFinContent').value,reading=()=>model.breath(view.snapshot.clock,Number($('breathingFinStrength').value));
  function content(){
    if(mode()==='orbit'){const source=window.A0FlameMandelbrotFormationView?.orbitSource;if(!source)return{mode:'orbit',available:false,reason:'Vorhandene Orbitquelle ist noch nicht gerendert.'};return{mode:'orbit',available:true,source,points:source.orbit.points.slice(0,80),mapping:'Existing critical orbit, first at most 80 points; separate affine fit into Fin bounds, then tongue clipping. No added iteration or c change.'};}
    if(mode()==='flame')return{mode:'flame',available:true,source:'Four-layer flame display motif; not an additional fractal or a recursive texture'};
    if(mode()==='mandelbrot'){
      const canvas=$('mandelbrotCanvas'),source=window.A0FlameMandelbrotFormationView?.mandelbrotSource;
      if(!canvas||!source||canvas.width<1||canvas.height<1)return{mode:'mandelbrot',available:false,reason:'Mandelbrot-Quellbild ist noch nicht gerendert.'};
      const cut=Math.min(.9,50/Math.max(1,source.cssHeight));
      return{mode:'mandelbrot',available:true,sourceCanvasId:'mandelbrotCanvas',renderedSource:JSON.parse(JSON.stringify(source)),cropPixels:[0,0,source.width,Math.max(1,source.height*(1-cut))],mapping:'Existing canvas texture stretched affinely into the Fin bounding rectangle, then clipped by the tongue path; lower 50 CSS pixels omitted to exclude the caption.',bitmapStoredInReturn:false};
    }
    if(mode()==='cell'){
      const wiring=window.A0CellPivotWiring?.snapshot;if(!wiring)return{mode:'cell',available:false,reason:'Zell-Verschaltung nicht verfügbar'};
      const r=wiring.route;return{mode:'cell',available:true,route:r,selected:r.selected.id,pivot:r.pivot.id,source:'Existing cell-selection / slot-comparison record; not signal coordinates'};
    }
    if(mode()==='pi'){
      const seq=window.A0ShadowChamber?.explanation;
      if(!seq)return{mode:'pi',available:false,reason:'Im Erklärteller nπ oder 2ⁿπ wählen und einen Leseschritt einstellen.'};
      return{mode:'pi',available:true,sequence:seq,points:seq.selected.signals.map((_,i)=>[seq.selected.signals[i]/Math.sqrt(2),seq.selected.signals[(i+1)%3]/Math.sqrt(2)]),source:'Selected reference step from existing explanation plate, not the live time'};
    }
    const s=view.snapshot;return{mode:'overlay',available:true,time:s.clock,signals:s.signals.slice(),points:[[s.signals[0],s.signals[1]],[s.signals[1],s.signals[2]],[s.signals[2],s.signals[0]]].map(p=>p.map(v=>v/Math.sqrt(2))),source:'Existing raw shared AM/VM/PM overlay; the Fin is a separate drawing mask'};
  }
  function paintContent(ctx,cx,cy,rx,ry,c){
    ctx.lineWidth=1.2;
    if(!c.available){ctx.fillStyle='#bca7dd';ctx.font='8px monospace';ctx.textAlign='center';ctx.fillText('QUELLE WÄHLEN',cx,cy);return;}
    if(c.mode==='mandelbrot'){ctx.drawImage($(c.sourceCanvasId),...c.cropPixels,cx-rx,cy-ry,2*rx,2*ry);return;}
    if(c.mode==='orbit'){const extent=Math.max(2,...c.points.flat().map(Math.abs));ctx.strokeStyle='#e5b340';ctx.beginPath();c.points.forEach((p,i)=>{const x=cx+p[0]/extent*rx,y=cy-p[1]/extent*ry;i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.stroke();c.points.forEach((p,i)=>{ctx.fillStyle=i?'#29c7ef':'#ffffff';ctx.beginPath();ctx.arc(cx+p[0]/extent*rx,cy-p[1]/extent*ry,i?2:4,0,Math.PI*2);ctx.fill();});return;}
    if(c.mode==='flame'){model.flamePath(ctx,cx,cy+ry*.8,ry*1.6,rx*.8,.02);const g=ctx.createLinearGradient(cx,cy-ry,cx,cy+ry);g.addColorStop(0,'#fff4bd');g.addColorStop(.55,'#e5b340');g.addColorStop(1,'#ee6ca5');ctx.fillStyle=g;ctx.fill();ctx.strokeStyle='#29c7ef';ctx.stroke();return;}
    if(c.mode==='cell'){
      const positions=[[-.75,-.6],[-.75,.6],[.75,-.6],[.75,.6]],slot=(c.route.pivot.index-48)/11;
      positions.forEach((p,i)=>{const x=cx+p[0]*rx,y=cy+p[1]*ry;ctx.strokeStyle=i<2?colors[1]:colors[2];ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(cx,cy);ctx.stroke();ctx.fillStyle=ctx.strokeStyle;ctx.beginPath();ctx.arc(x,y,3,0,2*Math.PI);ctx.fill();});
      ctx.fillStyle=colors[0];ctx.beginPath();ctx.arc(cx,cy,4+slot*2,0,2*Math.PI);ctx.fill();return;
    }
    if(c.mode==='pi'){
      c.sequence.steps.slice(0,c.sequence.index+1).forEach(step=>{for(let i=0;i<3;i++){ctx.fillStyle=colors[i];ctx.globalAlpha=.35;ctx.beginPath();ctx.arc(cx+step.signals[i]/Math.sqrt(2)*rx,cy-step.signals[(i+1)%3]/Math.sqrt(2)*ry,2,0,2*Math.PI);ctx.fill();}});ctx.globalAlpha=1;
    }
    ctx.strokeStyle='rgba(255,255,255,.7)';ctx.setLineDash([3,3]);ctx.beginPath();c.points.forEach((p,i)=>i?ctx.lineTo(cx+p[0]*rx,cy-p[1]*ry):ctx.moveTo(cx+p[0]*rx,cy-p[1]*ry));ctx.closePath();ctx.stroke();ctx.setLineDash([]);
    c.points.forEach((p,i)=>{ctx.fillStyle=colors[i];ctx.beginPath();ctx.arc(cx+p[0]*rx,cy-p[1]*ry,4,0,2*Math.PI);ctx.fill();});
  }
  function snapshot(){return{kind:'BREATHING_FIN_DISPLAY_MASK',enabled:enabled(),mode:mode(),breath:reading(),content:content(),sourceState:JSON.parse(JSON.stringify(view.state)),boundary:'Display shape and clipping only; no new clock, no c mutation, no cell-to-signal map. Clipped contents remain in the record.'};}
  function status(){const b=reading(),c=content();let detail=c.reason??'vorhandene drei Signalpunkte';if(c.available){if(c.mode==='pi')detail=c.sequence.selected.label;else if(c.mode==='cell')detail=`${c.selected} → ${c.pivot}`;else if(c.mode==='mandelbrot')detail=`Quellbild bei c=(${c.renderedSource.c.join(', ')}), N=${c.renderedSource.iterations}`;else if(c.mode==='orbit')detail=`vorhandene Bahn bei c=(${c.source.c.join(', ')}), ${c.points.length-1} Schritte gezeigt`;else if(c.mode==='flame')detail='goldenes Flammenmotiv';}$('breathingFinStrengthOut').textContent=Number($('breathingFinStrength').value).toFixed(2);$('breathingFinStatus').textContent=`${enabled()?'An':'Aus'} · Signalzeit t=${b.time.toFixed(3)} · Breite ${b.width.toFixed(3)}× · ${c.mode} · ${detail}. Maske verändert keine Fraktalparameter oder Zelladressen.`;}
  function refresh(){status();window.A0BluePinkDodecaCellReturnView?.refresh();window.A0FlameMandelbrotFormationView?.redrawFlame();}
  window.A0BreathingFin={get enabled(){return enabled();},get snapshot(){return snapshot();},
    sourceRendered(){status();if(enabled())window.A0BluePinkDodecaCellReturnView?.refresh();},
    renderFin(ctx,cx,cy,top,bottom,rotation){const b=reading(),c=content(),end=top+(bottom-top)*b.height,width=78*b.width,mid=(top+end)/2;
      ctx.save();ctx.translate(cx,cy);ctx.rotate(rotation);model.finPath(ctx,top,end,width,b.bend);ctx.fillStyle=`rgba(229,179,64,${.1+.13*b.opening})`;ctx.fill();ctx.strokeStyle='#ffe698';ctx.lineWidth=1.5;ctx.stroke();
      ctx.save();model.finPath(ctx,top,end,width,b.bend);ctx.clip();paintContent(ctx,0,mid,width*.75,(end-top)*.42,c);ctx.restore();
      ctx.strokeStyle='#e5b340';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,top);ctx.lineTo(0,end);ctx.stroke();ctx.fillStyle='#ffe8a2';ctx.font='8px monospace';ctx.textAlign='center';ctx.fillText(`FIN · ${c.mode.toUpperCase()}`,0,end+17);ctx.restore();
    },
    renderFlame(ctx,{width:w,height:h,layers,observerSeed,definitions}){const b=reading(),c=content(),cx=w/2,base=h*.86,height=h*.68,active=new Set(layers);ctx.clearRect(0,0,w,h);ctx.fillStyle='#020d15';ctx.fillRect(0,0,w,h);
      function layer(baseY,heightY,widthX,phase,color,fill){model.flamePath(ctx,cx,baseY,heightY,widthX,phase);ctx.fillStyle=fill;ctx.strokeStyle=color;ctx.lineWidth=1.5;ctx.fill();ctx.stroke();}
      if(active.has('envelope'))layer(base,height*b.height,w*.34*b.envelopeWidth,.08,'#29c7ef','rgba(41,199,239,.06)');
      if(active.has('boundary')){layer(base-8,height*.85*b.height,w*.24*b.width,-.04+b.bend*.003,'#ffd979','rgba(229,179,64,.1)');ctx.save();model.flamePath(ctx,cx,base-8,height*.85*b.height,w*.24*b.width,-.04+b.bend*.003);ctx.clip();paintContent(ctx,cx,base-height*.42,w*.22,height*.32,c);ctx.restore();}
      if(active.has('core'))layer(base-22,height*.48,w*.10*b.coreWidth,.02,'#e5b340','rgba(229,179,64,.4)');
      if(active.has('axis')){ctx.strokeStyle='#ffeeb4';ctx.setLineDash([6,7]);ctx.beginPath();ctx.moveTo(cx,h*.12);ctx.lineTo(cx,base+18);ctx.stroke();ctx.setLineDash([]);}
      ctx.font='9px monospace';ctx.textAlign='left';definitions.forEach((item,i)=>{ctx.fillStyle=active.has(item.id)?'#e5b340':'#536872';ctx.fillText(`${active.has(item.id)?'●':'○'} ${item.label}`,18,h*.2+i*46);ctx.fillStyle='#78929d';ctx.fillText(item.role,18,h*.2+i*46+14);});ctx.fillStyle='#a6bbc4';ctx.textAlign='center';ctx.fillText(`OBSERVER SEED · ${observerSeed}`,cx,h-20);
    }
  };
  for(const id of ['breathingFinEnabled','breathingFinContent'])$(id).addEventListener('change',refresh);
  $('breathingFinStrength').addEventListener('input',refresh);
  $('breathingFinReturn').addEventListener('click',()=>window.A0RootRoomPhaseBridge.select('RETURN'));
  for(const id of ['chamberSequence','chamberStep','chamberPrevious','chamberNext'])$(id)?.addEventListener(id==='chamberSequence'?'change':id==='chamberStep'?'input':'click',refresh);
  window.addEventListener('a0-lissajous-frame',event=>{const t=event.detail.clock;if(t<lastTime||t-lastTime>=.05){lastTime=t;if(enabled())refresh();}});
  window.addEventListener('a0-cell-selection',()=>{const key=window.A0CellPivotWiring?.snapshot.route.selected.id+':'+window.A0CellPivotWiring?.snapshot.route.shift;if(mode()==='cell'&&key!==lastCell){lastCell=key;status();window.A0FlameMandelbrotFormationView?.redrawFlame();}});
  refresh();
})();
