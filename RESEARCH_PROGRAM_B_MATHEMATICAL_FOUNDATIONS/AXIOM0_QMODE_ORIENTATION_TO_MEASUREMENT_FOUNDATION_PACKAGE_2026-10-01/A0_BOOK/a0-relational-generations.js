(() => {
  'use strict';
  const host=document.getElementById('generationLab'),model=window.A0RelationalGenerations;
  if(!host||!model||!window.A0Axis08FoldReturnView)return;
  const $=id=>document.getElementById(id),seed=window.A0Axis08FoldReturnView.source.source.laneMeans.slice(),svg=$('generationSvg'),ns='http://www.w3.org/2000/svg';
  let result=null,orderResult=null,selected=1,playing=false,last=null,elapsed=0;
  const add=(tag,attrs,label)=>{const e=document.createElementNS(ns,tag);for(const[k,v]of Object.entries(attrs))e.setAttribute(k,v);if(label!==undefined)e.textContent=label;svg.appendChild(e);return e;};
  const text=(x,y,label,color='#dff2f7',size=12)=>add('text',{x,y,fill:color,'font-family':'monospace','font-size':size},label);
  const path=points=>points.map((p,i)=>`${i?'L':'M'}${p[0]},${p[1]}`).join(' ');
  function render(){
    const row=result.steps[selected-1];svg.replaceChildren();
    if(!row){$('generationDetail').textContent=result.stop?.reason||'Keine Generation';return;}
    const s=row.main,centers=[170,500,830],max=Math.max(.001,...s.input.map(Math.abs),...s.output.map(Math.abs)),points=(values,cx)=>values.map((v,i)=>[cx+Math.sin(i*Math.PI/4)*(62+45*Math.abs(v)/max),190-Math.cos(i*Math.PI/4)*(62+45*Math.abs(v)/max)]);
    [s.input,s.output,row.comparison.output].forEach((values,k)=>{const p=points(values,centers[k]);add('path',{d:path(p)+' Z',fill:'none',stroke:k===0?'#29c7ef':k===1?'#63d9aa':'#ee6ca5','stroke-width':2});p.forEach((v,i)=>{add('circle',{cx:v[0],cy:v[1],r:4,fill:k===0?'#29c7ef':k===1?'#63d9aa':'#ee6ca5'});text(v[0]+5,v[1],String(i+1),'#a8c1ca',10);});text(centers[k]-110,45,['Eingang / Herkunft','Ausgang → nächste Generation','Vergleich / Start + ε'][k]);if(k===0)s.pairs.forEach(([a,b])=>add('path',{d:path([p[a],p[b]]),fill:'none',stroke:'#e5b340','stroke-width':3}));});
    text(315,190,'→','#e5b340',30);text(650,190,'↔','#bca7dd',30);
    const data=result.comparisons,maxDelta=Math.max(1e-15,...data.map(p=>p.difference)),chart=data.map(p=>[60+p.generation/Math.max(1,result.steps.length)*870,435-p.difference/maxDelta*95]);
    add('path',{d:path(chart),fill:'none',stroke:'#ee6ca5','stroke-width':2});text(60,325,'Δg = max |Hauptlauf − Vergleich| · gemeinsame, lineare Skala');text(60,465,`0 → ${result.steps.length} Generationen · Δmax=${maxDelta.toExponential(3)} · kein Chaosnachweis`);
    text(60,495,`G${s.parent} → G${s.generation} · Paarstart ${s.offset+1} · ${s.formula}`,'#ffe397');
    $('generationSelect').max=String(result.steps.length);$('generationSelect').value=String(selected);$('generationOut').textContent=String(selected);
    $('generationDetail').textContent=JSON.stringify({...s,comparisonDifference:result.comparisons[selected].difference},null,2);
    $('generationStatus').textContent=`${result.steps.length} berechnete Generationen · Janus ${result.options.direction===1?'direkt':'umgekehrt'} · Gesamtausgang ×${result.options.gain} je Generation · ${result.stop?`STOP G${result.stop.generation}: ${result.stop.reason}`:'Alle Schritte innerhalb der Größenbegrenzung.'} Quellpaar: a+b=2m. Der Ausgang nach Operator und Skalierung ist gesondert protokolliert. Keine 64/64-Normierung. Die drei Formen teilen eine normierte Zeichenskala.`;
    window.A0RelationalGenerationsView={snapshot:()=>JSON.parse(JSON.stringify({result,selected,playing})),orderSnapshot:()=>JSON.parse(JSON.stringify(orderResult)),select:n=>{selected=Math.max(1,Math.min(result.steps.length,Number(n)));render();}};
  }
  function renderOrder(){
    const orderSvg=$('generationOrderSvg'),detail=$('generationOrderDetail'),status=$('generationOrderStatus');
    if(!orderSvg||!detail||!status||!orderResult)return;
    orderSvg.replaceChildren();
    const orderAdd=(tag,attrs,label)=>{const e=document.createElementNS(ns,tag);for(const[k,v]of Object.entries(attrs))e.setAttribute(k,v);if(label!==undefined)e.textContent=label;orderSvg.appendChild(e);return e;};
    const orderText=(x,y,label,color='#dff2f7',size=11)=>orderAdd('text',{x,y,fill:color,'font-family':'monospace','font-size':size,'text-anchor':'middle'},label);
    const panels=[
      {label:'G',state:orderResult.sourceState.values,color:'#29c7ef'},
      {label:'R(G)',state:orderResult.pathA.rotatedInput,color:'#ffe397'},
      {label:'A = T(R(G))',state:orderResult.pathA.state,color:'#63d9aa'},
      {label:'B = R(T(G))',state:orderResult.pathB.state,color:'#ee6ca5'},
      {label:'A − B',state:orderResult.comparison.difference,color:'#bca7dd'}
    ];
    panels.forEach((panel,panelIndex)=>{
      const cx=100+panelIndex*200,cy=115,r=54;
      orderAdd('circle',{cx,cy,r,fill:'none',stroke:'#315260','stroke-width':1.5});
      panel.state.forEach((value,index)=>{
        const angle=-Math.PI/2+index*Math.PI/4,x=cx+r*Math.cos(angle),y=cy+r*Math.sin(angle);
        orderAdd('circle',{cx:x,cy:y,r:5,fill:panel.color});
        orderText(x,y+(y<cy?-11:18),Number(value).toFixed(3),'#a8c1ca',9);
      });
      orderText(cx,26,panel.label,panel.color,13);
    });
    orderAdd('path',{d:'M176 115 L224 115 M218 109 L224 115 L218 121',stroke:'#ffe397','stroke-width':2,fill:'none'});
    orderAdd('path',{d:'M376 115 L424 115 M418 109 L424 115 L418 121',stroke:'#63d9aa','stroke-width':2,fill:'none'});
    orderAdd('path',{d:'M576 115 L624 115 M618 109 L624 115 L618 121',stroke:'#ee6ca5','stroke-width':2,fill:'none'});
    orderText(500,210,`max |A−B| = ${orderResult.comparison.maxAbsDifference.toFixed(12)} · tolerance = ${orderResult.comparison.tolerance}`,'#ffe397',12);
    orderText(500,235,orderResult.comparison.withinTolerance?'COMMUTES WITHIN TOLERANCE':'DOES NOT COMMUTE','#ee6ca5',14);
    detail.textContent=JSON.stringify(orderResult,null,2);
    status.textContent=`Adapter: acht vorhandene Lane-Werte → Rand eines 3×3-Gitters; Mittelpunkt [1,1], +z-Achse. R ist eine exakte 2D-Indexpermutation. T ist Generation 0 mit Offset ${orderResult.T.offset}, Richtung ${orderResult.T.direction}, Exponent ${orderResult.T.exponent}, Gain ${orderResult.T.gain}. Identität, R⁴ und R⁻¹R sind exakt. A und B sind weder exakt gleich noch innerhalb ${orderResult.comparison.tolerance}; max |A−B| = ${orderResult.comparison.maxAbsDifference.toFixed(12)}.`;
  }
  function calculate(){playing=false;$('generationPlay').textContent='Generationen abspielen';elapsed=0;result=model.run(seed,{count:Number($('generationCount').value),offset:Number($('generationOffset').value),direction:Number($('generationDirection').value),exponent:Number($('generationOperator').value),gain:Number($('generationGain').value),epsilon:Number($('generationEpsilon').value)});orderResult=model.compareRotationGeneration(seed,{offset:0,direction:1,exponent:2,gain:1,tolerance:1e-12});selected=1;$('generationHeld').textContent='Noch kein Generations-Return gehalten.';render();renderOrder();}
  for(const id of ['generationCount','generationOffset','generationDirection','generationOperator','generationEpsilon','generationGain'])$(id).addEventListener('change',calculate);
  $('generationSelect').addEventListener('input',()=>{selected=Number($('generationSelect').value);render();});
  $('generationPlay').addEventListener('click',()=>{playing=!playing;elapsed=0;$('generationPlay').textContent=playing?'Pause':'Generationen abspielen';});
  $('generationHold').addEventListener('click',()=>{playing=false;$('generationPlay').textContent='Generationen abspielen';$('generationHeld').textContent=JSON.stringify({selected,...result},null,2);render();});
  function frame(now){if(last!==null&&playing){elapsed+=(now-last)/1000;if(elapsed>=1.2){elapsed%=1.2;selected=selected%Math.max(1,result.steps.length)+1;render();}}last=now;requestAnimationFrame(frame);}
  calculate();requestAnimationFrame(frame);
})();
