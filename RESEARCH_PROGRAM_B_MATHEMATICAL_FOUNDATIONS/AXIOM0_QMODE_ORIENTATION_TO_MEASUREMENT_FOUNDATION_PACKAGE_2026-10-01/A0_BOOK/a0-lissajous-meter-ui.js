(() => {
  const view=window.A0ThreeLissajousPlanesView,select=document.getElementById('lissajousRatio'),planes=document.getElementById('threeLissajousPlanes');
  if(!view||!select||!planes)return;
  const meter=document.createElement('section');meter.className='bp-root-bridge bp-distance-meter';meter.id='lissajousDistanceMeter';meter.setAttribute('aria-label','Strecken der drei Lissajous-Ebenen');
  const title=document.createElement('h3');title.textContent='Strecke · AM / VM / PM / Summe';
  const note=document.createElement('p');note.textContent='Numerisch integrierte Kurvenlänge der bewegten Punkte seit Zählerstart, in Signal-Koordinateneinheiten. Die Summe addiert drei Ansichtslängen; sie ist keine zusätzliche Raumstrecke und kein Hz-Wert. Frequenzpaar oder Phase ändern startet die Messung neu, Pausieren und Loop-Grenzen erhalten sie.';
  const grid=document.createElement('div');grid.className='bp-distance-grid';
  const outputs={};for(const[key,label]of [['AM','AM · (s₁,s₂)'],['VM','VM · (s₂,s₃)'],['PM','PM · (s₃,s₁)'],['sum','Σ · drei Ansichtslängen']]){const card=document.createElement('div'),heading=document.createElement('b'),output=document.createElement('output');heading.textContent=label;output.textContent='0.000';output.setAttribute('aria-live','off');card.append(heading,output);grid.append(card);outputs[key]=output;}
  const time=document.createElement('p');time.className='bp-root-key';
  const reset=document.createElement('button');reset.type='button';reset.textContent='Streckenzähler null';reset.addEventListener('click',()=>view.resetDistance());
  const nav=document.createElement('nav');nav.setAttribute('aria-label','Frequenzpaar direkt auswählen');
  const buttons=[];for(const option of select.options){const button=document.createElement('button');button.type='button';button.textContent=option.value;button.title=option.textContent;button.dataset.ratio=option.value;button.addEventListener('click',()=>view.setRatio(option.value));buttons.push(button);nav.append(button);}
  const pairLabel=document.createElement('p');pairLabel.textContent='Signalpaar a:b · direkt wählen (Winkelfrequenzfaktoren relativ zur Signalzeit, keine kalibrierten Hertz)';
  meter.append(title,note,grid,time,reset,pairLabel,nav);planes.querySelector('.lissajous-controls').after(meter);
  const comparison=document.createElement('p');comparison.className='bp-root-key';comparison.append('HZ/FZ untersucht im vorhandenen Profil Frequenz und axiale Kraft bzw. Kraft-Weg-Phasen, nicht diese Ansichtslängen. ');const compass=document.createElement('a');compass.href='../../../SCIENCE_LAB/EXPORTS/NEXAH_HZ_FZ_COMPASS_MISSION_CONTROL.html';compass.target='_blank';compass.rel='noopener';compass.textContent='HZ/FZ-Kompass separat vergleichen ↗';compass.style.color='#8de7f1';comparison.append(compass);meter.append(comparison);
  function update(snapshot){if(!snapshot.distance)return;const value=snapshot.distance;for(const[key,output]of Object.entries(outputs))output.textContent=value[key].toFixed(3);time.textContent=`Signalzeit seit Zählerstart: ${value.elapsed.toFixed(3)} · Umläufe à 2π: ${value.turns.toFixed(3)} · Summierte Kurvenlängen, keine Verbindungskanten zwischen den Ebenen.`;buttons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.ratio===select.value)));}
  window.addEventListener('a0-lissajous-frame',event=>update(event.detail));update(view.snapshot);
})();
