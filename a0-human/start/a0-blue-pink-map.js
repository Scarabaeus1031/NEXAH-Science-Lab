/* Explanatory map over the existing renderer. No replacement geometry or dynamics. */
(() => {
  const entries = [
    {key:'blue',label:'Blue / Black Sun',color:'#29c7ef',text:'Die beiden cyanfarbenen Körper zeigen die Blue-Seite bei −θ. Bei der Ausgangseinstellung sind das −42°. Black Sun ist hier die zugrunde liegende, teilweise verdeckte Feldseite.',status:'Bestehende Ansichtsrolle · keine zusätzliche Körperfamilie',links:[['Black Sun / Big Moon','A0_BLACK_SUN_BIG_MOON.html#eclipse']]},
    {key:'pink',label:'Pink / Big Moon',color:'#ee6ca5',text:'Die beiden pinken Körper zeigen die andere Beobachterseite bei +θ, anfangs +42°. Beide Seiten bleiben gleichzeitig sichtbar. Die Schenkel sind die zwei vorzeichenverschiedenen Beobachterrichtungen.',status:'±θ sind Ansichtsparameter, keine neu gemessenen Raumwinkel.',links:[['Big Moon / Black Sun','A0_BLACK_SUN_BIG_MOON.html#eclipse'],['Observer Lens','A0_NEWTON_GOETHE_OBSERVER_LENS.html']]},
    {key:'shadow',label:'Shadow / Ghost-gons',color:'#bca7dd',text:'Die gestrichelten Konturen gehören zu den vier äußeren Körpern. In unserer Bildsprache sind sie die wiedererkannten Ghost-gons: versetzte View-Konturen derselben Geometrie, keine weiteren Zellkörper.',status:'Die Face-Cell-Auswahl markiert derzeit die Quellfläche; die gekoppelte flächenspezifische Schattenspur ist noch offen.',links:[['NEON · Sichtbarkeit und verborgene Übergänge','A0_SCIENTIFIC_POSITION_REPORT.html']]},
    {key:'ullinirium',label:'Ullinirium / 12+1',color:'#d4baff',text:'Das polare Feld hält zwölf Richtungsmarker und einen gemeinsamen Pivot. Der als 135° bezeichnete View Anchor, die Ringe und die Körperformation drehen sich gemeinsam. Ullinirium bezeichnet hier diese lokale Koordinationsansicht. Der verknüpfte Atem-Sequencer zeigt separat das grüne Nachbarpaar und den gestrichelten Return: unsere Anschlussidee „Green Sewing / Zipper“.',status:'Die Atmungen sind derzeit getrennte Anzeigevorgänge, noch kein gemeinsamer Takt oder übertragener Faltungsoperator.',links:[['Atem / Green Sewing / Fold–Return','A0_AXIS08_FOLD_RETURN_SEQUENCER.html#sequencer']]},
    {key:'band',label:'Violet Band / 512π',color:'#d778ff',text:'Das violette Oval heißt im Modell „Möbius View Band“ und bezeichnet einen Beobachtungskorridor. Thomas verbindet es mit dem historischen Ghost Snake 512π: violet ghost / pink shadow.',status:'512π ist eine Owner-Zuordnung. Die heutige Ellipse ist weder der GIF-Generator noch eine implementierte Möbius-Verklebung.',links:[['Ihara / Cycle Bridge','A0_IHARA_HASHIMOTO_CYCLE_BRIDGE.html']]},
    {key:'seam',label:'Golden Seam / Zipper',color:'#e5b340',text:'Die goldene Linie ist die Aperture Spine, im Modell als Zipper Seam beschrieben. Sie kreuzt den violetten Korridor an der Apertur. Spoon und J gehören zu den gesammelten Bildwörtern; Euler ist dieser Linie bisher nicht mathematisch zugeordnet.',status:'Öffnen / Schließen ist eine beschriebene Ansichtsrolle, noch keine zusätzliche Dynamik dieser Linie.',links:[['Apertur und Operatoren · Bench','A0_ORIENTATION_CONTROLLER_BENCH.html#masterCockpit']]},
    {key:'rails',label:'Double-Pyramid Rails / Kite',color:'#65d9d9',text:'Die cyanfarbenen, verschachtelten Konturen bilden die Double-Pyramid Rails. Ihre Kite- und Pyramidenform ist sichtbar; eine Pascal- oder Fibonacci-Regel erzeugt diese Linien derzeit nicht.',status:'Gezeichnete Vergleichsgeometrie · die formale Verbindung bleibt eine offene Frage.',links:[['Pascal / Pentagon','A0_PASCAL_PENTAGON_OPERATOR_JOINTS.html'],['Generation Corner','A0_PASCAL_GENERATION_CORNER.html']]},
    {key:'fin',label:'Zunge / Blatt / Return',color:'#ffe39b',text:'Die herausragende Form heißt im Instrument Display Fin / Return Vector. Zunge, Blatt, Flamme, Spoon und Zipline sind unsere Bildwörter für die Form und ihre Richtung. Sie wird derzeit mit Bézierkurven gezeichnet.',status:'Darstellung des Return-Vektors · keine implementierte Fibonacci-Öffnungsfolge.',links:[['Flamme / Mandelbrot / Julia vor Ort','#formation'],['Atem / Green Sewing / Fold–Return','A0_AXIS08_FOLD_RETURN_SEQUENCER.html#sequencer'],['Return ohne Identität','A0_RETURN_WITHOUT_IDENTITY_PAPER.html']]},
    {key:'cell',label:'Face-Cell / Prisma-Einfall',color:'#ffffff',text:'Eine angeklickte Pentagonfläche bleibt weiß und behält ihre Zelladresse. Ihre Schattenfläche und deklarierte Vergleichsslots der vier Körper werden über einen gemeinsamen Return-Slot sichtbar verbunden. Der Versatz ist wählbar; die Wege sind keine optischen Bahnen.',status:'Slot-Verschaltung mit Auswahlspur und Return vorhanden. Geometrische Körperkorrespondenz und 60-zu-TESA-Abbildung bleiben offen.',links:[['Blue Body · Pentagon-Player','A0_TESSAREC_BLUE_BODY_LAB.html#pentagon-body-player'],['Zellregister verschalten · vor Ort','#cellPivotWiring']]},
    {key:'iota',label:'Root / Iota / Drift',color:'#83dbac',text:'Root Room, gerichteter Iota-Schnitt und die Iota-Ticks der Bench sind vorhandene Zugänge. Die genannte 2,5/5-Drift ist als Anschlussfrage erhalten, aber noch nicht eindeutig mit der Atmung dieser goldenen Linie verbunden.',status:'Quellen zum Vergleichen · keine automatische Übertragung ihrer Regeln auf diese Ansicht.',links:[['Root Room vor Ort','#rootRoom'],['Tessarec Q · Iota · Pearl','A0_SCIENTIFIC_POSITION_REPORT.html'],['Bench · Iota / Drift','A0_ORIENTATION_CONTROLLER_BENCH.html#masterCockpit']]}
  ];
  for(const key of ['ullinirium','fin'])entries.find(entry=>entry.key===key).links.push(['Pentagon Sewing · Matroschka 7 → 1','A0_AXIS08_FOLD_RETURN_SEQUENCER.html#pentagonSewing']);
  entries.find(entry=>entry.key==='fin').links.push(['Generationen · Klammern / Janus / Vergleich','A0_AXIS08_FOLD_RETURN_SEQUENCER.html#generationLab']);
  entries.find(entry=>entry.key==='fin').links.push(['Visuelle Partitur · Atem / BPM / Schatten','A0_AXIS08_FOLD_RETURN_SEQUENCER.html#sewingScore']);
  entries.find(entry=>entry.key==='shadow').links.push(['TESA · 4×7 + externe 29 · Grid-Kandidat','A0_PINK_DIAMOND_GRID_ATLAS.html#ghost-tiles']);
  function anchors(width,height,state){
    const cx=width*.5,cy=height*.42,roll=state.projection==='top'?0:state.yaw-.42;
    const rotate=(x,y)=>{const dx=x-cx,dy=y-cy;return[cx+dx*Math.cos(roll)-dy*Math.sin(roll),cy+dx*Math.sin(roll)+dy*Math.cos(roll)];};
    const radius=Math.max(72,Math.min(145,width*.125,height*.19));
    return {blue:rotate(width*.16,height*.3),pink:rotate(width*.84,height*.3),shadow:rotate(width*.31-24,height*.66-35),ullinirium:rotate(cx+width*.29,cy),band:rotate(cx-radius*.9,cy-radius*.65),seam:rotate(cx,cy-radius*1.45),rails:rotate(cx+radius*.9,cy+radius*.95),fin:rotate(cx,cy+radius*1.65),cell:rotate(cx+radius*.36,cy+radius*.12)};
  }
  if(typeof module!=='undefined'&&module.exports){module.exports={entries,anchors};return;}
  const instrument=document.getElementById('cells'),stage=document.getElementById('cellStage'),canvas=document.getElementById('cellCanvas');
  if(!instrument||!stage||!window.A0BluePinkDodecaCellReturnView)return;
  const actions=document.createElement('div');actions.className='bp-map-actions';
  const expand=document.createElement('button');expand.type='button';expand.textContent='Raum erweitern ↗';
  const markersToggle=document.createElement('button');markersToggle.type='button';markersToggle.textContent='Kartenmarker · an';markersToggle.setAttribute('aria-pressed','true');
  const hint=document.createElement('span');hint.textContent='Marker oder Körperfläche wählen · Legende lesen · Modul im Fenster öffnen';
  actions.append(expand,markersToggle,hint);stage.before(actions);
  const legend=document.createElement('details');legend.className='bp-legend';legend.id='mapLegend';legend.open=true;
  const summary=document.createElement('summary');summary.textContent='Legende · Blue. Dodeca. Pink.';
  const layout=document.createElement('div');layout.className='bp-legend-layout';
  const nav=document.createElement('nav');nav.className='bp-legend-nav';nav.setAttribute('aria-label','Elemente der Gesamtkarte');
  const inspector=document.createElement('article');inspector.setAttribute('aria-live','polite');
  const title=document.createElement('h3'),text=document.createElement('p'),status=document.createElement('p'),links=document.createElement('div');
  status.className='bp-legend-status';links.className='bp-legend-links';inspector.append(title,text,status,links);layout.append(nav,inspector);legend.append(summary,layout);stage.after(legend);
  const moduleDialog=document.createElement('dialog');moduleDialog.className='bp-map-dialog';moduleDialog.setAttribute('aria-label','Modulfenster');document.body.append(moduleDialog);
  function openModule(label,href){
    if(href.startsWith('#')){if(roomDialog.open)roomDialog.close();document.querySelector(href)?.scrollIntoView({behavior:'smooth'});return;}
    moduleDialog.replaceChildren();
    const bar=document.createElement('div');bar.className='bp-map-dialog-bar';
    const heading=document.createElement('span');heading.textContent=label;
    const close=document.createElement('button');close.type='button';close.textContent='Zur Karte zurück ×';close.addEventListener('click',()=>moduleDialog.close());bar.append(heading,close);
    const source=document.createElement('a');source.className='bp-map-dialog-source';source.href=href;source.target='_blank';source.rel='noopener';source.textContent='Quellmodul einzeln öffnen ↗';
    const frame=document.createElement('iframe');frame.title=label;frame.src=href;moduleDialog.append(bar,source,frame);moduleDialog.showModal();
  }
  moduleDialog.addEventListener('close',()=>moduleDialog.replaceChildren());
  const buttons=new Map(),markers=new Map();
  function inspect(key){const entry=entries.find(item=>item.key===key);if(!entry)return;title.textContent=entry.label;text.textContent=entry.text;status.textContent=entry.status;links.replaceChildren();for(const [label,href]of entry.links){const button=document.createElement('button');button.type='button';button.textContent=label;button.addEventListener('click',()=>openModule(label,href));links.append(button);}
    buttons.forEach((button,k)=>button.setAttribute('aria-pressed',String(k===key)));legend.open=true;
  }
  entries.forEach((entry,index)=>{const button=document.createElement('button');button.type='button';button.style.setProperty('--map-accent',entry.color);button.textContent=`${index+1} · ${entry.label}`;button.addEventListener('click',()=>inspect(entry.key));nav.append(button);buttons.set(entry.key,button);
    if(entry.key==='iota')return;const marker=document.createElement('button');marker.type='button';marker.className='bp-hotspot';marker.style.setProperty('--map-accent',entry.color);marker.textContent=String(index+1);marker.setAttribute('aria-label',`${entry.label} erklären`);marker.title=entry.label;marker.addEventListener('click',()=>{inspect(entry.key);legend.scrollIntoView({block:'nearest'});});stage.append(marker);markers.set(entry.key,marker);
  });
  let markersOn=true;
  markersToggle.addEventListener('click',()=>{markersOn=!markersOn;markersToggle.setAttribute('aria-pressed',String(markersOn));markersToggle.textContent=`Kartenmarker · ${markersOn?'an':'aus'}`;markers.forEach(marker=>{marker.hidden=!markersOn;});});
  function updateMarkers(){const state=window.A0BluePinkDodecaCellReturnView.state;const points=anchors(canvas.clientWidth,canvas.clientHeight,state);for(const[key,marker]of markers){const point=points[key];marker.style.left=`${Math.max(15,Math.min(canvas.clientWidth-15,point[0]))}px`;marker.style.top=`${Math.max(15,Math.min(canvas.clientHeight-15,point[1]))}px`;}}
  let lastSelection=window.A0BluePinkDodecaCellReturnView.state.selected;
  window.addEventListener('a0-cell-selection',event=>{updateMarkers();if(event.detail.selected!==lastSelection){lastSelection=event.detail.selected;inspect('cell');}});
  new ResizeObserver(updateMarkers).observe(canvas);
  const roomDialog=document.createElement('dialog');roomDialog.className='bp-map-dialog';roomDialog.setAttribute('aria-label','Blue Pink Gesamtkarte erweitert');document.body.append(roomDialog);
  const placeholder=document.createComment('Blue Pink map original position');
  expand.addEventListener('click',()=>{if(roomDialog.open){roomDialog.close();return;}instrument.before(placeholder);const bar=document.createElement('div');bar.className='bp-map-dialog-bar';const label=document.createElement('span');label.textContent='Blue. Dodeca. Pink. · Gesamtkarte';const close=document.createElement('button');close.type='button';close.textContent='Raum verkleinern ×';close.addEventListener('click',()=>roomDialog.close());bar.append(label,close);roomDialog.replaceChildren(bar,instrument);roomDialog.showModal();expand.textContent='Raum verkleinern ↙';updateMarkers();});
  roomDialog.addEventListener('close',()=>{placeholder.replaceWith(instrument);roomDialog.replaceChildren();expand.textContent='Raum erweitern ↗';updateMarkers();expand.focus();});
  inspect('cell');updateMarkers();
})();
