(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.A0NBandQuadratureBoundary=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const IDENTITY='ART:A0:MATHEMATICAL_JOINTS';
  const NUMBER_VIEW='MOD:NUMBER_VIEW_SUITE';
  const TOLERANCE=1e-12;
  const MATERIAL_ADAPTERS=Object.freeze([
    Object.freeze({id:'QUARTZ',label:'QUARTZ',carrier:'DISPLAY CUBE Q',input:'MECHANICAL STRESS',output:'ELECTRICAL POLARIZATION / CHARGE',class:'PIEZOELECTRIC ADAPTER',physicalModel:false,measurementRequired:true}),
    Object.freeze({id:'IRON',label:'EISEN',carrier:'DISPLAY CUBE Fe',input:'MAGNETIC FIELD / STRAIN / TEMPERATURE',output:'MAGNETIZATION / MAGNETOSTRICTION / HEAT STATE',class:'MAGNETOSTRICTIVE + THERMAL COMPARATOR',physicalModel:false,measurementRequired:true}),
    Object.freeze({id:'ICE_WATER',label:'EIS / WASSER',carrier:'DISPLAY CUBE H₂O',input:'TEMPERATURE / PRESSURE',output:'PHASE / FLOW STATE',class:'PHASE-BOUNDARY COMPARATOR',physicalModel:false,measurementRequired:true})
  ]);
  const FIRE_RAIL=Object.freeze({id:'FIRE',label:'FEUER',role:'ENERGY / PROCESS RAIL',materialNode:false,operatorIdentity:false});
  const clamp=(value,min,max)=>Math.min(max,Math.max(min,Number(value)||0));
  const rad=degrees=>degrees*Math.PI/180;
  function quadrature(deltaDegrees=0){
    const delta=clamp(deltaDegrees,0,720),theta=rad(delta/2),cos=Math.cos(theta),sin=Math.sin(theta),qPlus=cos*cos,qMinus=sin*sin,sum=qPlus+qMinus,residual=Math.abs(1-sum);
    return {deltaDegrees:delta,thetaDegrees:delta/2,cos,sin,qPlus,qMinus,sum,residual,weightReturn:delta>0&&delta%360===0,vectorReturn:delta>0&&delta%720===0};
  }
  function quadratureAudit(stepDegrees=.5){
    const step=Math.max(.05,Number(stepDegrees)||.5),samples=[];let maxResidual=0;
    for(let delta=0;delta<=720+step/2;delta+=step){const row=quadrature(Math.min(720,delta));samples.push(row);maxResidual=Math.max(maxResidual,row.residual);}
    return {samples:samples.length,stepDegrees:step,maxResidual,tolerance:TOLERANCE,status:maxResidual<=TOLERANCE?'PASS_EXACT_NUMERIC_QUADRATURE_CLOSURE':'FAIL_QUADRATURE_CLOSURE'};
  }
  function shellRecord(n=1){
    const band=Math.max(1,Math.trunc(Number(n)||1)),previous=band-1,square=band**2,previousSquare=previous**2,cube=band**3,previousCube=previous**3,squareShell=square-previousSquare,cubeShell=cube-previousCube;
    return {band,previous,square,cube,squareShell,cubeShell,squareFormula:2*band-1,cubeFormula:3*band**2-3*band+1,squarePass:squareShell===2*band-1,cubePass:cubeShell===3*band**2-3*band+1};
  }
  function shellAudit(maxBand=64){
    const limit=Math.max(1,Math.trunc(Number(maxBand)||64)),rows=Array.from({length:limit},(_,index)=>shellRecord(index+1)),failures=rows.filter(row=>!row.squarePass||!row.cubePass);
    return {bands:limit,failures:failures.length,status:failures.length===0?'PASS_SQUARE_AND_CUBE_SHELL_IDENTITIES':'FAIL_SHELL_IDENTITY'};
  }
  function materialAudit(){
    const types=new Set(MATERIAL_ADAPTERS.map(item=>item.class));
    return {adapterCount:MATERIAL_ADAPTERS.length,distinctTypeCount:types.size,fireMaterialNode:FIRE_RAIL.materialNode,allMeasurementBound:MATERIAL_ADAPTERS.every(item=>item.measurementRequired&&!item.physicalModel),identityMerge:false,status:types.size===MATERIAL_ADAPTERS.length&&!FIRE_RAIL.materialNode?'PASS_TYPED_MATERIAL_SEPARATION':'FAIL_MATERIAL_TYPE_SEPARATION'};
  }
  function integrationGate(overrides={}){
    const quadratureResult=overrides.quadratureResult||quadratureAudit(),shellResult=overrides.shellResult||shellAudit(),materialResult=overrides.materialResult||materialAudit();
    const mathPass=quadratureResult.status.startsWith('PASS')&&shellResult.status.startsWith('PASS');
    const typePass=materialResult.status.startsWith('PASS')&&materialResult.identityMerge===false;
    const status=!mathPass?'REJECT_MATHEMATICAL_CONTRACT':!typePass?'HOLD_TYPE_SEPARATION':'GO_TYPED_ADAPTER_ONLY';
    return {status,mathPass,typePass,displayIntegration:status==='GO_TYPED_ADAPTER_ONLY',primeCubeIdentity:false,physicalMechanism:'HOLD_MEASUREMENT_REQUIRED',newCanonicalIds:[],relationChanges:[],graphDelta:{identities:0,relations:0,aliases:0,studies:0,findings:0}};
  }
  function record(deltaDegrees=0,band=12){return {quadrature:quadrature(deltaDegrees),shell:shellRecord(band),materials:materialAudit(),gate:integrationGate()};}
  const point=(x,y)=>`${Number(x).toFixed(2)},${Number(y).toFixed(2)}`;
  function curvePath(key){const points=[];for(let i=0;i<=180;i+=1){const row=quadrature(i*4),x=55+i*(790/180),y=215-row[key]*135;points.push(`${i?'L':'M'}${point(x,y)}`);}return points.join(' ');}
  function cubeMarkup(x,label,value,klass,role){return `<g class="nbq-cube ${klass}" transform="translate(${x} 345)"><path d="M0 30 L54 0 L108 30 L54 60 Z"/><path d="M0 30 V92 L54 122 V60 Z"/><path d="M108 30 V92 L54 122 V60 Z"/><text x="54" y="48" text-anchor="middle">${label}</text><text x="54" y="84" text-anchor="middle" class="nbq-cube-value">${value.toFixed(6)}</text><text x="54" y="145" text-anchor="middle" class="nbq-cube-role">${role}</text></g>`;}
  function svgMarkup(data){
    const q=data.quadrature,x=55+(q.deltaDegrees/720)*790,yPlus=215-q.qPlus*135,yMinus=215-q.qMinus*135;
    return `<svg viewBox="0 0 900 520" role="img" aria-labelledby="nbqSvgTitle nbqSvgDesc"><title id="nbqSvgTitle">N-Band Quadrature Boundary Deck</title><desc id="nbqSvgDesc">Sinusquadrat und Cosinusquadrat schließen numerisch auf eins. Drei isometrische Formen sind getrennte Display-Carrier und keine physischen Piezo-Cubes.</desc><rect x="20" y="20" width="860" height="480" rx="22" class="nbq-frame"/><g class="nbq-grid"><line x1="55" y1="80" x2="845" y2="80"/><line x1="55" y1="147.5" x2="845" y2="147.5"/><line x1="55" y1="215" x2="845" y2="215"/></g><path d="${curvePath('qPlus')}" class="nbq-curve plus"/><path d="${curvePath('qMinus')}" class="nbq-curve minus"/><line x1="${x.toFixed(2)}" y1="65" x2="${x.toFixed(2)}" y2="235" class="nbq-cursor"/><circle cx="${x.toFixed(2)}" cy="${yPlus.toFixed(2)}" r="7" class="nbq-dot plus"/><circle cx="${x.toFixed(2)}" cy="${yMinus.toFixed(2)}" r="7" class="nbq-dot minus"/><text x="55" y="58" class="nbq-label">Q+ = cos²(Δφ/2)</text><text x="845" y="58" text-anchor="end" class="nbq-label minus">Q− = sin²(Δφ/2)</text><text x="450" y="258" text-anchor="middle" class="nbq-closure">Q+ + Q− = ${q.sum.toFixed(15)} · |ε|=${q.residual.toExponential(2)}</text>${cubeMarkup(120,'Q+',q.qPlus,'plus','COS² REGISTER')}${cubeMarkup(396,'1',q.sum,'return','CLOSURE / RETURN')}${cubeMarkup(672,'Q−',q.qMinus,'minus','SIN² REGISTER')}<text x="450" y="500" text-anchor="middle" class="nbq-foot">THREE DISPLAY CARRIERS · NOT THREE PHYSICAL PIEZO CUBES</text></svg>`;
  }
  function hostMarkup(){return `<header class="nbq-head"><div><div class="eyebrow">Existing A0 quadrature · n-band shell audit · typed material adapters</div><h2 id="nbqHeading">N-BAND QUADRATURE BOUNDARY DECK</h2><p>Das Deck prüft zuerst die exakte S/C-Closure und die diskreten Quadrat-/Cube-Schalen. Erst danach werden Quartz, Eisen und Eis/Wasser als getrennte Display-Adapter zugeschaltet; Feuer bleibt Prozessschiene.</p></div><output id="nbqStatus">GO_TYPED_ADAPTER_ONLY</output></header><div class="nbq-controls"><button type="button" data-nbq-action="play" aria-pressed="false">PLAY</button><button type="button" data-nbq-action="return">RETURN 0</button><label>Δφ <output id="nbqDeltaOut">0°</output><input id="nbqDelta" type="range" min="0" max="720" step="1" value="0"></label><label>N-BAND <output id="nbqBandOut">12</output><input id="nbqBand" type="range" min="1" max="32" step="1" value="12"></label></div><div class="nbq-workspace"><div class="nbq-stage" id="nbqStage"></div><aside class="nbq-ledger"><article><small>QUADRATURE</small><b id="nbqClosure">Q+ + Q− = 1</b><span id="nbqResidual">|ε| = 0</span></article><article><small>SQUARE SHELL</small><b id="nbqSquare">n²−(n−1)² = 2n−1</b><span>diskreter Flächen-/Adresszuwachs</span></article><article><small>CUBE SHELL</small><b id="nbqCube">n³−(n−1)³ = 3n²−3n+1</b><span>diskreter Volumenregister-Zuwachs</span></article><article><small>DISPLAY GATE</small><b>GO_TYPED_ADAPTER_ONLY</b><span>Einbau als View-Adapter bestanden</span></article><article class="hold"><small>PHYSICAL GATE</small><b>HOLD_MEASUREMENT_REQUIRED</b><span>keine Materialkonstanten, Geometrie oder Messdaten gebunden</span></article></aside></div><div class="nbq-materials"><article><small>PIEZOELECTRIC ADAPTER</small><h3>QUARTZ</h3><p>mechanische Spannung ↔ elektrische Polarisation/Ladung</p></article><article><small>MAGNETOSTRICTIVE / THERMAL COMPARATOR</small><h3>EISEN</h3><p>Magnetfeld, Dehnung und Temperatur bleiben eigene Kanäle; kein Piezo-Operator</p></article><article><small>PHASE-BOUNDARY COMPARATOR</small><h3>EIS / WASSER</h3><p>Temperatur und Druck adressieren Phase/Fluss; kein Quartz- oder Eisen-Identitätsmerge</p></article><article class="fire"><small>PROCESS RAIL · NOT MATERIAL NODE</small><h3>FEUER</h3><p>Energie-/Prozesskanal; keine vierte Cube-Identität</p></article></div><p class="nbq-boundary"><strong>Typed boundary:</strong> <code>Q+=cos²(Δφ/2)</code>, <code>Q−=sin²(Δφ/2)</code> und <code>Q++Q−=1</code> wiederverwenden die bestehende A0 Field-Notes-Lesart. Quadrat- und Cube-Schale sind exakte diskrete Identitäten. Die drei isometrischen Formen sind Register-Carrier, keine drei physischen Piezo-Cubes. Quartz, Eisen und Eis/Wasser bleiben typverschiedene Adapter; Feuer ist ein Prozessrail. Das bestandene Gate autorisiert nur die Anzeige im bestehenden Boundary Graph, nicht Prime-Cube-Identität, Physik, Study, Finding oder Publikation. Identity reuse: <code>${IDENTITY}</code>, <code>${NUMBER_VIEW}</code>; Source-Graph-Delta: <code>0/0/0</code>.</p><nav class="nbq-links"><a href="A0_NBAND_QUADRATURE_BOUNDARY_LAB.html">Isoliertes Lab öffnen</a><a href="FIELD_NOTES_A0.md">A0 Field Notes</a><a href="results/a0-nband-quadrature-boundary-2026-11-23.json">Test receipt</a></nav>`;}
  function mount(doc){
    const host=doc&&doc.getElementById('nband-quadrature-boundary');if(!host)return null;if(!host.innerHTML.trim())host.innerHTML=hostMarkup();
    const stage=host.querySelector('#nbqStage'),delta=host.querySelector('#nbqDelta'),band=host.querySelector('#nbqBand'),deltaOut=host.querySelector('#nbqDeltaOut'),bandOut=host.querySelector('#nbqBandOut');let timer=null;
    function render(){const data=record(Number(delta.value),Number(band.value));stage.innerHTML=svgMarkup(data);deltaOut.textContent=`${data.quadrature.deltaDegrees}°`;bandOut.textContent=String(data.shell.band);host.querySelector('#nbqClosure').textContent=`Q+ ${data.quadrature.qPlus.toFixed(6)} + Q− ${data.quadrature.qMinus.toFixed(6)} = ${data.quadrature.sum.toFixed(12)}`;host.querySelector('#nbqResidual').textContent=`|ε| = ${data.quadrature.residual.toExponential(2)}`;host.querySelector('#nbqSquare').textContent=`${data.shell.square}−${data.shell.previous**2} = ${data.shell.squareShell} = 2·${data.shell.band}−1`;host.querySelector('#nbqCube').textContent=`${data.shell.cube}−${data.shell.previous**3} = ${data.shell.cubeShell}`;const play=host.querySelector('[data-nbq-action="play"]');play.textContent=timer?'HOLD':'PLAY';play.setAttribute('aria-pressed',String(Boolean(timer)));return data;}
    function stop(){if(timer){clearInterval(timer);timer=null;}}
    host.querySelectorAll('input').forEach(input=>input.addEventListener('input',render));host.querySelector('[data-nbq-action="play"]').addEventListener('click',()=>{if(timer){stop();render();return;}timer=setInterval(()=>{delta.value=String((Number(delta.value)+2)%721);render();},60);render();});host.querySelector('[data-nbq-action="return"]').addEventListener('click',()=>{stop();delta.value='0';render();});render();return Object.freeze({render,stop,gate:integrationGate(),receipt:()=>record(Number(delta.value),Number(band.value))});
  }
  return {IDENTITY,NUMBER_VIEW,TOLERANCE,MATERIAL_ADAPTERS,FIRE_RAIL,quadrature,quadratureAudit,shellRecord,shellAudit,materialAudit,integrationGate,record,svgMarkup,hostMarkup,mount};
});
