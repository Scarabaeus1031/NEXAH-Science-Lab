(() => {
  'use strict';
  const model=window.A0TesaGridCandidate,ghost=window.A0GhostTiles,$=id=>document.getElementById(id),panel=$('tesaCandidate');if(!model||!ghost||!panel)return;
  const svg=$('tesaCompare'),ns='http://www.w3.org/2000/svg';
  const add=(tag,attrs,label)=>{const el=document.createElementNS(ns,tag);for(const[k,v]of Object.entries(attrs))el.setAttribute(k,v);if(label!==undefined)el.textContent=label;svg.appendChild(el);return el;};
  function update(){
    const visible=$('ghostPreset').value==='tesa28';panel.hidden=!visible;panel.style.display=visible?'block':'none';if(!visible)return;
    const delay=Number($('tesaEcho').value),referenceFps=Number($('tesaFps').value);
    if(!Number.isFinite(delay)||delay<0||delay>7||!Number.isFinite(referenceFps)||referenceFps<1||referenceFps>120){svg.replaceChildren();$('tesaStatus').textContent='Ungültige Testeingabe: Echo 0…7 Sekunden; Referenz-FPS 1…120.';$('tesaTiming').textContent='';$('tesaReceipt').textContent=JSON.stringify({status:'INVALID_INPUT_NOT_TESTED'});return;}
    const n=ghost.selection.value,options={mirror:$('tesaMirror').checked,stretch:Number($('tesaStretch').value)},p=model.view(n,options),source=model.event(n),echo=model.echo(source,Number($('tesaEcho').value)),fps=Number($('tesaFps').value),a=model.polar(source),b=model.polar(echo),frames=[model.frame(source,fps),model.frame(echo,fps)];
    svg.replaceChildren();add('circle',{cx:185,cy:145,r:95,fill:'none',stroke:'#486a7a'});add('line',{x1:185,y1:35,x2:185,y2:255,stroke:'#294b5b'});add('line',{x1:75,y1:145,x2:295,y2:145,stroke:'#294b5b'});
    const pa=[185+a.x*95,145+a.y*95],pb=[185+b.x*95,145+b.y*95];add('line',{x1:185,y1:145,x2:pa[0],y2:pa[1],stroke:'#e5b340'});add('line',{x1:185,y1:145,x2:pb[0],y2:pb[1],stroke:'#d778ff','stroke-dasharray':'5 4'});add('circle',{cx:pa[0],cy:pa[1],r:6,fill:'#e5b340'});add('circle',{cx:pb[0],cy:pb[1],r:8,fill:'none',stroke:'#d778ff','stroke-width':2});
    add('text',{x:65,y:20,fill:'#e5b340','font-size':13},`${source.eventId} · Polar: 0° Nord, im Uhrzeigersinn`);
    const span=Math.max(7,echo.seconds+.25),tx=t=>395+t/span*410;
    for(const [event,y,color]of [[source,95,'#e5b340'],[echo,185,'#d778ff']]){add('line',{x1:395,y1:y,x2:805,y2:y,stroke:'#486a7a'});add('circle',{cx:tx(event.seconds),cy:y,r:6,fill:color});add('text',{x:395,y:y-20,fill:color,'font-size':13},`${event.occurrence}: ${event.seconds.toFixed(3)} s · Adresse ${event.address}`);}
    add('text',{x:395,y:245,fill:'#9dbac7','font-size':12},'Statische Testereignisse · keine historische Zeitrekonstruktion');
    $('tesaStatus').textContent=`KANDIDAT / dokumentarische Vorlage · ${model.audit().cases} Modellfälle PASS · Adresse ${n}: Quelle Zeile ${p.row+1}, Spalte ${p.col+1} → Ansicht Zeile ${p.viewRow+1}, Spalte ${p.col+1} · Stretch x${options.stretch}. 29 bleibt außerhalb.`;
    $('tesaTiming').textContent=frames.map(f=>`${f.occurrence} · ${f.eventId} · ${f.seconds.toFixed(3)} s → Referenzframe ${f.frameIndex} bei ${f.fps} fps → Bildzeit ${f.sampledSeconds.toFixed(4)} s · Abtastversatz ${f.quantizationSeconds.toFixed(4)} s`).join('\n');
    $('tesaReceipt').textContent=JSON.stringify({status:'CANDIDATE_VIEW_TEST_NOT_ADOPTED',provenance:model.fixture.provenance,externalMarkers:model.fixture.externalMarkers,view:options,sourceCell:model.cell(n),viewCell:p,recoveredAddress:model.fromView(p.x,p.y,options),source,echo,polar:[a,b],referenceFrames:frames,audit:model.audit()},null,2);
    window.A0TesaGridLens.snapshot=()=>JSON.parse($('tesaReceipt').textContent);
  }
  window.A0TesaGridLens={update,snapshot:()=>null};
  for(const id of ['tesaMirror','tesaStretch'])$(id).addEventListener('change',()=>ghost.render());
  for(const id of ['tesaEcho','tesaFps'])$(id).addEventListener('input',update);
  $('tesaSelect17').addEventListener('click',()=>ghost.selectValue(17));$('tesaSelect27').addEventListener('click',()=>ghost.selectValue(27));
  $('tesaEnter').addEventListener('click',()=>{$('ghostPreset').value='tesa28';$('ghostPreset').dispatchEvent(new Event('change'));ghost.selectValue(17);});
  update();
})();
