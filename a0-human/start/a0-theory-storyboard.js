(function(root,factory){
  const api=factory(typeof module==='object'&&module.exports?require('./a0-human-crosswalk.js'):root.A0HumanCrosswalk);if(typeof module==='object'&&module.exports)module.exports=api;
  if(root&&root.document){root.A0TheoryStoryboard=api;api.mount(root.document,root);}
})(typeof window!=='undefined'?window:null,function(crosswalk){
  'use strict';
  const scenes=[
  {
    "title": "Eine Beziehung erkennen",
    "tag": "01 · Zwei Dinge und ein weiterer Blick",
    "teaser": "Eine Verbindung wird aus einer anderen Position anders lesbar.",
    "question": "Zwei Menschen sprechen miteinander. Was sieht eine dritte Person von ihrer Beziehung?",
    "idea": "Eine Verbindung hängt nicht nur von zwei einzelnen Dingen ab. Auch ihre Lage zueinander und der Blick darauf spielen eine Rolle. Verschiebe den dritten Punkt: A und B bleiben an ihrem Platz, aber das Beziehungsbild verändert sich.",
    "built": "Die Theorie-Arbeitsfassung beschreibt A/B → C und weitere Beziehungsebenen. Der gemeinsame Blue/Pink-Raum bietet ein konkretes Instrument für mehrere Ansichten.",
    "open": "Eine Perspektive beobachten und eine Situation verändern sind verschiedene Vorgänge. Aus dem dritten Punkt folgt noch kein allgemeiner Emergenzmechanismus.",
    "href": "A0_BLUE_PINK_DODECA_CELL_RETURN.html#cells",
    "control": "Dritte Perspektive verschieben",
    "caption": "Drei Positionen und ihre Beziehungen · schematisches Lesemodell.",
    "relation": "Wir beginnen bei Beziehungen. Diese Frage begleitet alle weiteren Szenen."
  },
  {
    "title": "Eine Grenze ziehen",
    "tag": "02 · Innen, außen und ein Anschluss",
    "teaser": "Eine Tür trennt Räume und verbindet sie zugleich.",
    "question": "Was ist innen, was ist außen — und wo kann etwas hindurch?",
    "idea": "Ein Zimmer hat Wände und eine Tür. Die Wand unterscheidet zwei Bereiche; die Öffnung erlaubt einen möglichen Übergang. Öffne den gezeichneten Rand mit dem Regler. Dass zwei Seiten nahe beieinanderliegen, erklärt aber noch nicht, was zwischen ihnen übertragen werden kann.",
    "built": "Das Haus zeigt adressierte Zustände und Relationen. H7/O8 besitzt ein Vergleichsledger und separat eine H7-Schaltansicht; beide sind erreichbar, noch nicht durchgängig gekoppelt.",
    "open": "7/8-Slot → Demonstrator-Reaktion → typisierter Return fehlt. Die Öffnung hier ist nur eine Zeichnungsregel, kein berechneter H7-Nahtkörper.",
    "href": "A0_BLUE_PINK_DODECA_CELL_RETURN.html#h7o8Lens",
    "control": "Den gezeichneten Rand öffnen",
    "caption": "Ein offener Rand und ein Anschluss · weder Polyederrekonstruktion noch Topologiebeweis.",
    "relation": "Nachdem wir eine Beziehung gesehen haben, fragen wir: Welche Grenze und welche Verbindung meinen wir genau?"
  },
  {
    "title": "Teil und Ganzes wechseln",
    "tag": "03 · Schachtel, Zimmer, Haus",
    "teaser": "Was eben das Ganze war, kann selbst ein Teil sein.",
    "question": "Ein Zimmer liegt in einem Haus. Was ändert sich, wenn du den größeren Rahmen wählst?",
    "idea": "Eine Schachtel kann mehrere kleine Schachteln enthalten und selbst in einer größeren liegen. So wechselt die Rolle von Teil und Ganzem. Ziehe die gezeichneten Hüllen auseinander: Ihre Unterschiede werden sichtbar. Daraus folgt nicht, dass jede Ebene denselben Regeln gehorcht.",
    "built": "Der Fold-Sequencer enthält sieben wählbare Leseniveaus, Sewing und deklarierte Generationsregeln mit erhaltenen Unterschieden.",
    "open": "Die sieben Leseniveaus sind keine bereits hergeleiteten physikalischen Schalen. Verschachtelung behauptet keine identischen Gesetze auf allen Maßstäben.",
    "href": "A0_AXIS08_FOLD_RETURN_SEQUENCER.html",
    "control": "Hüllen auseinanderziehen",
    "caption": "Geöffnete Hüllen mit sichtbaren Lippen · Bildidee, keine festgelegte Skalenmetrik.",
    "relation": "Eine Grenze gehört zu einem gewählten Rahmen. Wechseln wir ihn, kann aus einem Ganzen wieder ein Teil werden."
  },
  {
    "title": "Bewegung vergleichen",
    "tag": "04 · Gemeinsam oder gegeneinander",
    "teaser": "Nicht nur der Ort zählt, sondern auch der Zeitpunkt.",
    "question": "Zwei Menschen schaukeln. Bewegen sie sich gleichzeitig oder gegeneinander?",
    "idea": "Beide können denselben Takt haben und trotzdem an verschiedenen Stellen ihrer Bewegung sein. Diesen Versatz nennt man Phase. Ändere mit dem Regler den Versatz der drei gezeichneten Wellen. Vergleiche, was sich gegeneinander verschiebt — ohne daraus einen gemeinsamen Antrieb abzuleiten.",
    "built": "Deklarierte Dreisignal-Beispiele besitzen kontrollierbare Paaransichten AM/VM/PM und Achsenschatten. Die hier gezeichneten drei Signale sind ein eigenes schematisches Beispiel.",
    "open": "π-Ringe und Topologie bleiben unterschiedliche Fragen: Winkel/Umlauf ist nicht automatisch Rand/Verklebung. Die historische Reihe enthält 2ⁿπ, nicht pauschal πⁿ; Stufenzuordnungen sind offen.",
    "href": "A0_BLUE_PINK_DODECA_CELL_RETURN.html#threeLissajousPlanes",
    "control": "Relativen Phasenversatz ändern",
    "caption": "Drei Beispielsignale · keine kalibrierten Frequenzen und kein globaler Instrumenttakt.",
    "relation": "Nach den Bereichen betrachten wir ihre Veränderung: Welche Bewegung gehört zu welchem Teil?"
  },
  {
    "title": "Den Blick verändern",
    "tag": "05 · Gegenstand und Ansicht",
    "teaser": "Mehrere Bilder können zu derselben Quelle gehören.",
    "question": "Ein Gegenstand sieht von oben anders aus als von der Seite. Was bleibt derselbe Gegenstand?",
    "idea": "Eine Taschenlampe wirft je nach Richtung einen anderen Schatten. Ähnlich zeigt eine Projektion ausgewählte Beziehungen einer Quelle. Drehe hier den Projektionswinkel: Aus denselben fünf Punkten entstehen verschiedene Konturen. Die Zeichnung veranschaulicht Ansichten, nicht die Lichtphysik einer Lampe.",
    "built": "Blue/Pink zeigt gemeinsame Geometrie mit versetzten Schattenansichten. Die CRT-Innenansichten besitzen räumlichen Schlierenkontrast; zeitliche Echos sind davon getrennt.",
    "open": "Ghostgons 17/19/23 benötigen eigene Geometrie- und Phasenregeln. Diese Projektionen sind keine optischen Lichtschatten und keine physikalische Feldmessung.",
    "href": "A0_BLUE_PINK_DODECA_CELL_RETURN.html#cells",
    "control": "Projektionswinkel verändern",
    "caption": "O sowie zwei Projektionen O′ und O″ derselben fünf Punkte · keine drei unabhängigen Körper.",
    "relation": "Bewegung und Blickwechsel sind nicht dasselbe: Manchmal ändert sich die Quelle, manchmal nur ihre Darstellung."
  },
  {
    "title": "Ein Muster hinterfragen",
    "tag": "06 · Auffallen ist noch nicht erklären",
    "teaser": "Was entsteht durch die Hervorhebung — und was besteht darüber hinaus?",
    "question": "Du erkennst in einem Liniengewirr plötzlich eine Blüte. Ist etwas Neues entstanden oder nur sichtbar geworden?",
    "idea": "Ein Muster kann deutlicher werden, wenn einzelne Verbindungen hervortreten. Probiere den Regler aus: Die Punkte und Linien bleiben dieselben; nur ihre Sichtbarkeit verändert sich. Ob darüber hinaus eine neue stabile Organisation entsteht, wäre eine andere Frage und müsste eigens geprüft werden.",
    "built": "Überlagerungen, Schlieren und mehrere Ansichten machen Muster untersuchbar. Hier bleiben Knoten und Kanten gleich; nur die Kantengewichtung der Darstellung verändert sich.",
    "open": "Das Hervorheben einer Rosette ist keine neue Dynamik. Robustheit, Wechselwirkung, Vergleichsfälle und ein Maß der behaupteten neuen Eigenschaft fehlen für einen allgemeinen Mechanismus.",
    "href": "A0_TESSAREC_BLUE_BODY_LAB.html",
    "control": "Kantengewichtung der Ansicht ändern",
    "caption": "Gleiche Knoten und Kanten · andere Sichtbarkeit. Visuelle Emergenz ist nicht automatisch strukturelle Emergenz.",
    "relation": "Ein veränderter Blick kann ein Muster zeigen. Ob das Muster mehr als ein Ansichtseffekt ist, bleibt eine eigene Prüfaufgabe."
  },
  {
    "title": "Den Rückweg prüfen",
    "tag": "07 · Was müssen wir aufbewahren?",
    "teaser": "Ein Ergebnis kann Informationen über seinen Ursprung verlieren.",
    "question": "Du kennst nur den Durchschnitt zweier Zahlen. Kannst du die beiden Ausgangszahlen wiederfinden?",
    "idea": "2 und 8 ergeben im Durchschnitt 5. Das tun aber auch 4 und 6. Die Mitte allein genügt also nicht. Führe mit dem Regler zusätzlich den Unterschied mit: Erst mit der vollständigen Zusatzangabe wird der Rückweg im Beispiel eindeutig. Return bedeutet hier: genau benennen, was sich zurückgewinnen lässt.",
    "built": "Haus-Ledger, rekonstruierbare Fold-Beispiele und Cell-Return-Partitur besitzen jeweils eigene Adressen, Regeln und Prüfgrenzen. Ihre Quellen werden nicht gleichgesetzt.",
    "open": "Eine instrumentübergreifende Gesamtmaschine ist noch nicht geschlossen. Insbesondere fehlt der 7/8-Demonstrator-Return. Dieses Storyboard verbindet Lesarten und Links, keine fremden Controller.",
    "href": "A0_BLUE_PINK_DODECA_CELL_RETURN.html#cellReturnPerformance",
    "control": "Den Unterschied mitführen",
    "caption": "Beispiel: aus A und B werden Mitte m und Unterschied d. Erst beide zusammen erlauben den exakten Rückweg.",
    "relation": "Vom ersten Blick bis zum Rückweg gilt dieselbe Frage: Was haben wir verändert, was bewahrt und was wissen wir noch nicht?"
  }
];
  // Local editorial groups only: no canonical Family IDs or runtime bindings.
  const layers=[
    {id:'structure',number:'1',title:'Struktur',terms:'Innen / außen · Boundary · Matroschka',scenes:[0,1,2],question:'Was ist Teil, was ist Ganzes — und relativ zu welchem Rahmen?',explanation:'Die erste Lesart beschreibt Bereiche und ihre Grenzen. Eine Zelle kann in einer Hülle liegen; dieser gesamte Zusammenhang kann auf einer nächsten Ebene selbst zum Teil werden. Relation ist dabei mehr als räumliche Nachbarschaft.',route:[['Bereich unterscheiden','Innen und außen brauchen einen gewählten Rahmen.'],['Boundary benennen','Trennung, Lippe, Kontakt und Übergang nicht verwechseln.'],['Rahmen wechseln','Matroschka: Teil und Ganzes können ihre Rolle wechseln.']],boundary:'Das ist eine Leseschicht. Sie behauptet weder identische Skalenphysik noch sieben formal bestimmte Schalen.'},
    {id:'coupling',number:'2',title:'Kopplung & Bewegung',terms:'Plugs · Phasen · Breathing · π-Ringe / Topologiefragen',scenes:[1,3],question:'Was darf sich verbinden — und unter welcher Orientierungs- oder Phasenregel?',explanation:'Ein Plug bezeichnet eine Anschlussfrage. Phase, Abstand und Öffnung können die Beziehung verändern. Topologie fragt zusätzlich nach Zusammenhang, Rand und Orientierung; ein π-Umlauf ist nicht automatisch eine Verklebungsregel.',route:[['Anschlussregel festlegen','Adresse, Fläche, Kante und Signal sind nicht dasselbe.'],['Relative Lage verändern','Phase und Breathing sind getrennte Darstellungsparameter.'],['Erhalt und Orientierungswechsel prüfen','Möbius- und Klein-Motive bleiben von der π-Ring-Zuordnung unterschieden.']],boundary:'Der 7/8-Anschluss ist kein fertiger Datenbus: Ledger und Demonstrator besitzen noch keinen durchgehenden Return-Vertrag.'},
    {id:'visibility',number:'3',title:'Sichtbarkeit',terms:'Apertur · Projektion · Schatten · Emergenzfrage',scenes:[4,5],question:'Was erscheint durch eine Ansicht — und was bleibt darüber hinaus stabil?',explanation:'Ein Ausschnitt macht ausgewählte Beziehungen sichtbar. Mehrere Schatten können aus derselben Quelle stammen. Ein auffälliges Muster kann ein Projektionseffekt sein; robuste neue Organisation ist eine zusätzliche, prüfpflichtige Frage.',route:[['Zugang wählen','Position, Ausschnitt und Auflösung deklarieren.'],['Projektion vergleichen','O, O′ und O″ können Ansichten derselben Quelle sein.'],['Muster hinterfragen','Sichtbarkeit allein beweist keinen emergenten Mechanismus.']],boundary:'Schatten sind hier erklärte Projektionen, keine kalibrierte Optik. Schlieren sind noch kein gemessenes physikalisches Feld.'},
    {id:'return',number:'+1',title:'Ledger & Return',terms:'Quer zu allen drei Bereichen · Herkunft · Unterschiede · Verlust',scenes:[6,0,1,2,3,4,5],question:'Welche Herkunft und Unterschiede muss jeder Übergang mitführen?',explanation:'Das +1 ist keine vierte gleichartige Fläche. Die Prüfebene begleitet Struktur, Kopplung und Sichtbarkeit: Sie hält Herkunft, Regel und verbliebene Unterschiede fest. Ohne diese Angaben ist eine Rückkehr oft nicht eindeutig.',route:[['Struktur rückbinden','Welcher Bereich und welcher Rahmen waren die Quelle?'],['Kopplung protokollieren','Welche Regel wurde angewendet; welche Unterschiede wurden bewahrt?'],['Ansicht zurücklesen','Was ist rekonstruierbar, was verloren oder weiterhin offen?']],boundary:'Die Verbindung dieser Lesarten ist noch keine integrierte Runtime. Der Return unten gilt nur für das ausdrücklich deklarierte Zahlenbeispiel.'}
  ];
  function layersForScene(index){return layers.filter(layer=>layer.scenes.includes(index)).map(layer=>layer.id);}
  const C={cyan:'#62d3e5',pink:'#ed8db8',gold:'#efc76d',violet:'#b6a0ef',line:'#365966',ink:'#e7eff0'};
  const clamp=(x,a,b)=>Math.max(a,Math.min(b,Number.isFinite(Number(x))?Number(x):a));
  const fmt=x=>Number(x.toFixed(2));
  function returnExample(value){const fraction=clamp(value,0,100)/100,m=5,d=-3,retained=d*fraction;return{a:2,b:8,m,d,retained,aReturn:m+retained,bReturn:m-retained,residual:Math.abs(d-retained)};}
  function line(a,b,c=C.line,opacity=1,dash=''){return '<line x1="'+fmt(a[0])+'" y1="'+fmt(a[1])+'" x2="'+fmt(b[0])+'" y2="'+fmt(b[1])+'" stroke="'+c+'" stroke-width="1.5" opacity="'+opacity+'"'+(dash?' stroke-dasharray="'+dash+'"':'')+'/>';}
  function circle(x,y,r,c,fill=false){return '<circle cx="'+fmt(x)+'" cy="'+fmt(y)+'" r="'+fmt(r)+'" stroke="'+c+'" stroke-width="1.5" fill="'+(fill?c:'none')+'"/>';}
  function text(x,y,s,c=C.ink,anchor='middle'){return '<text x="'+fmt(x)+'" y="'+fmt(y)+'" text-anchor="'+anchor+'" fill="'+c+'" font-family="system-ui,sans-serif" font-size="14">'+s+'</text>';}
  function path(d,c,opacity=1,dash=''){return '<path d="'+d+'" fill="none" stroke="'+c+'" stroke-width="1.5" opacity="'+opacity+'"'+(dash?' stroke-dasharray="'+dash+'"':'')+'/>';}
  function poly(points,c,opacity=1){return path(points.map((p,i)=>(i?'L':'M')+fmt(p[0])+','+fmt(p[1])).join(' ')+'Z',c,opacity);}
  function points(n,cx,cy,r,angle=0){return Array.from({length:n},(_,i)=>[cx+r*Math.cos(i*2*Math.PI/n+angle),cy+r*Math.sin(i*2*Math.PI/n+angle)]);}
  function drawing(index,value,width=700,height=420,mini=false){
    const i=clamp(index,0,6)|0,t=clamp(value,0,100)/100,w=clamp(width,90,1600),h=clamp(height,100,700);
    const cx=w*.5,cy=h*.5,r=Math.min(w*.3,h*.31);let s='';
    const label=(x,y,v,c)=>mini?'':text(x,y,v,c);
    if(i===0){
      const p=[[w*.22,h*.68],[w*.78,h*.68],[w*(.25+.5*t),h*.26]];
      s+=line(p[0],p[1],C.gold)+line(p[1],p[2],C.pink)+line(p[2],p[0],C.cyan);
      p.forEach((q,k)=>{s+=circle(q[0],q[1],mini?4:8,[C.cyan,C.pink,C.gold][k],true)+label(q[0],q[1]-20,['A','B','C'][k]);});
      s+=label(cx,h*.85,w<450?'AB → C':'AB wird beobachtbar für C');
    }else if(i===1){
      const gap=.12+t*.6,start=gap,end=Math.PI*2-gap;
      const p=Array.from({length:100},(_,k)=>[cx+r*Math.cos(start+(end-start)*k/99),cy+r*Math.sin(start+(end-start)*k/99)]);
      s+=path(p.map((q,k)=>(k?'L':'M')+fmt(q[0])+','+fmt(q[1])).join(' '),C.violet);
      s+=poly(points(5,cx-r*.25,cy,r*.35,-Math.PI/2),C.cyan);
      s+=line([cx+r*.35,cy],[w*.87,cy],C.gold,1,'5 5');
      s+=circle(cx+r*Math.cos(gap),cy+r*Math.sin(gap),mini?3:6,C.pink,true)+circle(cx+r*Math.cos(gap),cy-r*Math.sin(gap),mini?3:6,C.pink,true);
      s+=label(cx-r*.27,cy+r*.65,'INNEN')+label(w*.85,cy-25,'PLUG')+label(cx,h*.12,'AUSSEN · gewählter Rahmen');
    }else if(i===2){
      for(let k=3;k>=0;k--){
        const rr=r*(.37+k*.21),offset=(k-1.5)*t*w*.055,xx=cx+offset,yy=cy+(k-1.5)*t*h*.07;
        const p=Array.from({length:90},(_,j)=>{const a=.35+j*(Math.PI*2-.7)/89;return[xx+rr*Math.cos(a),yy+rr*1.05*Math.sin(a)];});
        const color=[C.gold,C.cyan,C.pink,C.violet][k];
        s+=path(p.map((q,j)=>(j?'L':'M')+fmt(q[0])+','+fmt(q[1])).join(' '),color);
        s+=line(p[0],[p[0][0]+w*.045,p[0][1]-h*.035],color)+line(p[89],[p[89][0]+w*.045,p[89][1]+h*.035],color);
      }
      s+=label(cx,h*.12,'HÜLLEN / LIPPEN')+label(cx,h*.93,'Teil ↔ Ganzes · relativ zum Rahmen');
    }else if(i===3){
      [C.cyan,C.pink,C.gold].forEach((color,k)=>{
        const yy=h*(.24+k*.25),a=h*.075,phase=k*t*Math.PI*2;
        const pp=Array.from({length:120},(_,j)=>{const u=j/119;return[w*.1+w*.8*u,yy+a*Math.sin(u*2*Math.PI+phase)];});
        s+=line([w*.1,yy],[w*.9,yy])+path(pp.map((q,j)=>(j?'L':'M')+fmt(q[0])+','+fmt(q[1])).join(' '),color);
        const u=.45;s+=circle(w*.1+w*.8*u,yy+a*Math.sin(u*2*Math.PI+phase),mini?3:6,color,true);
        s+=label(w*.06,yy+4,['s₁','s₂','s₃'][k]);
      });s+=label(cx,h*.94,'Versatz ≠ Maßstab ≠ Topologie');
    }else if(i===4){
      const rr=Math.min(w*.15,h*.22),orig=points(5,0,0,rr,-Math.PI/2),a=t*Math.PI;
      const p=orig.map(q=>[w*.23+q[0],cy+q[1]]);
      const q=orig.map(v=>[w*.7+v[0]*Math.cos(a),h*.34+v[1]*.45]);
      const z=orig.map(v=>[w*.7+v[0]*Math.cos(a+.8),h*.72+v[1]*.35]);
      p.forEach((v,k)=>{s+=line(v,q[k],C.line,.4)+line(v,z[k],C.line,.25);});
      s+=poly(p,C.cyan)+poly(q,C.pink)+poly(z,C.violet);
      [p,q,z].forEach((set,k)=>set.forEach(v=>{s+=circle(v[0],v[1],mini?2:4,[C.cyan,C.pink,C.violet][k],true);}));
      s+=label(w*.23,cy+rr+28,'O')+label(w*.7,h*.34+rr*.45+26,'O′')+label(w*.7,h*.72+rr*.35+26,'O″');
    }else if(i===5){
      const pp=points(12,cx,cy,r,-Math.PI/2);
      pp.forEach((p,j)=>{for(let k=j+1;k<pp.length;k++){const d=Math.min(k-j,12-(k-j));s+=line(p,pp[k],d===5?C.pink:C.cyan,d===5?.2+.7*t:.4-.3*t);}});
      pp.forEach(p=>{s+=circle(p[0],p[1],mini?2:4,C.gold,true);});
      s+=label(cx,h*.12,'EIN BESTAND · ANDERE GEWICHTUNG')+label(cx,h*.94,'Muster sichtbar ≠ Mechanismus erklärt');
    }else{
      const y=h*.43,xx=[w*.18,w*.5,w*.82];
      s+=line([xx[0],y],[xx[1],y],C.cyan)+line([xx[1],y],[xx[2],y],C.gold);
      xx.forEach((x,k)=>{s+=circle(x,y,mini?13:25,[C.cyan,C.pink,C.gold][k]);});
      const ex=returnExample(value);s+=path('M'+xx[2]+','+(y+80)+' Q'+cx+','+(h*.91)+' '+xx[0]+','+(y+80),t===1?C.gold:C.violet,1,t===1?'':'5 5');
      s+=label(xx[0],y+5,'A, B')+label(xx[1],y+5,t>0?'m, d':'m')+label(xx[2],y+5,'A′, B′');
      s+=label(xx[0],y+52,'2 / 8')+label(xx[1],y+52,'d: '+fmt(ex.retained))+label(xx[2],y+52,fmt(ex.aReturn)+' / '+fmt(ex.bReturn));
      s+=label(cx,h*.17,'m = (A+B)/2 · d = (A−B)/2')+label(cx,h*.94,t===1?'MIT d: exakter Beispiel-Return':w<450?'Restfehler: '+fmt(ex.residual)+' · d unvollständig':'Restfehler: '+fmt(ex.residual)+' · d nur teilweise gelesen');
    }
    return s;
  }
  function mount(doc,win){
    const el=id=>doc.getElementById(id);if(!el('storyboard'))return null;
    let current=-1,value=50,view='overview',selectedLayer='structure',returnValue=100;
    const moments=Array(7).fill(50);
    const incoming=crosswalk.readContext(win.location.search||'','storyboard');
    if(incoming.status==='valid'){moments[incoming.context.scene-1]=incoming.context.moment;if(incoming.context.layer)selectedLayer=incoming.context.layer;}
    const cards=el('sceneCards'),svg=el('sceneSvg');
    cards.innerHTML=scenes.map((s,i)=>'<button type="button" class="scene-card" data-scene="'+i+'"><svg viewBox="0 0 280 145" aria-hidden="true">'+drawing(i,50,280,145,true)+'</svg><span class="card-copy"><span class="number">0'+(i+1)+'</span><strong>'+s.title+'</strong><span class="teaser">'+s.teaser+'</span></span></button>').join('');
    const map=el('architectureMap');
    map.innerHTML=layers.map((layer,i)=>'<button type="button" class="layer-button" data-layer="'+layer.id+'" aria-pressed="'+(layer.id===selectedLayer)+'" aria-controls="layerTitle layerExplanation layerRoute layerScenes">'+(i<3?'<svg viewBox="0 0 280 145" aria-hidden="true">'+drawing([2,3,4][i],50,280,145,true)+'</svg>':'')+'<span class="layer-number">'+layer.number+'</span><strong>'+layer.title+'</strong><span class="layer-terms">'+layer.terms+'</span></button>').join('');
    function viewButtons(){
      el('viewOverview').setAttribute('aria-pressed',String(view==='overview'||view==='scene'));
      el('viewArchitecture').setAttribute('aria-pressed',String(view==='architecture'));
    }
    function humanReading(){
      if(current<0)return;const row=crosswalk.rowFor(current+1),context={scene:current+1,moment:value,layer:selectedLayer};
      el('humanBindingState').textContent=row.status==='open'?'Zuordnung offen':'Redaktionell gebunden · keine Identität';
      el('humanReadingQuestion').textContent=row.human;el('humanReadingReason').textContent=row.reason;
      el('humanReadingLinks').hidden=row.status!=='bound';
      if(row.status==='bound'){
        el('humanJourneyLink').setAttribute('href',crosswalk.outbound(context,'journey'));
        el('humanJourneyLink').textContent='Human '+String(crosswalk.questions[row.question].index+1).padStart(2,'0')+' · '+crosswalk.questions[row.question].text+' ↗';
        el('humanBlueprintLink').setAttribute('href',crosswalk.outbound(context,'blueprint'));
      }
    }
    function renderLayer(){
      const layer=layers.find(item=>item.id===selectedLayer);
      map.setAttribute('data-selected',selectedLayer);
      // Use attributes instead of rebuilding native controls, retaining focus.
      map.querySelectorAll('[data-layer]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.layer===selectedLayer)));
      el('layerKicker').textContent=layer.number==='+1'?'Querbeziehung · +1':layer.number+' · 3+1-Lesart';
      el('layerTitle').textContent=layer.title;el('layerExplanation').textContent=layer.explanation;
      el('layerQuestion').textContent=layer.question;el('layerBoundary').textContent=layer.boundary;
      el('layerRoute').innerHTML=layer.route.map(step=>'<li>'+step[0]+'<small>'+step[1]+'</small></li>').join('');
      el('layerScenes').innerHTML=layer.scenes.map(i=>'<button type="button" data-scene="'+i+'">0'+(i+1)+' · '+scenes[i].title+' ↗</button>').join('');
    }
    function returnRegister(){
      const r=returnExample(returnValue);
      el('returnDifferenceValue').textContent=returnValue+' %';
      el('returnTransfer').textContent='m = '+r.m+' · d gelesen = '+fmt(r.retained);
      el('returnReconstructed').textContent='A′ = '+fmt(r.aReturn)+' · B′ = '+fmt(r.bReturn);
      el('returnError').textContent=String(fmt(r.residual));
      el('returnExplanation').textContent=returnValue===100?'Beispiel exakt: Mitte und vollständiger Unterschied rekonstruieren 2 und 8. Das ist kein Nachweis für die anderen Instrumente.':returnValue===0?'Nur die Mitte 5 bleibt: 2/8, 4/6 und viele weitere Paare passen dazu. Der gewählte Mittelwert-Rückweg 5/5 verliert den Unterschied.':'Nur ein Anteil von d wird verwendet. Der angezeigte Fehler vergleicht den Beispiel-Eingang mit den rückgelesenen Werten.';
    }
    function showArchitecture(layer=selectedLayer,updateHash=true){
      if(!layers.some(item=>item.id===layer))return false;
      selectedLayer=layer;view='architecture';current=-1;
      el('overview').hidden=true;el('scene').hidden=true;el('architecture').hidden=false;
      viewButtons();renderLayer();returnRegister();
      if(updateHash){win.history.replaceState(null,'','#layer-'+selectedLayer);el('architectureTitle').focus({preventScroll:true});el('architectureTitle').scrollIntoView?.({block:'start'});}
      return true;
    }
    function diagram(){
      if(current<0)return;const w=Math.max(260,Math.round(svg.getBoundingClientRect().width||700)),h=w<450?330:420,s=scenes[current];
      svg.setAttribute('viewBox','0 0 '+w+' '+h);svg.style.height=h+'px';
      svg.innerHTML='<title id="svgTitle">'+s.title+'</title><desc id="svgDesc">'+s.caption+'</desc>'+drawing(current,value,w,h);
      el('momentValue').textContent=value+' / 100';
      humanReading();
    }
    function show(index,updateHash=true){
      current=index<0?-1:clamp(index,0,6)|0;
      view=current<0?'overview':'scene';el('architecture').hidden=true;viewButtons();
      el('overview').hidden=current>=0;el('scene').hidden=current<0;
      if(updateHash)win.history.replaceState(null,'',current<0?'#overview':'#scene-'+(current+1));
      if(current<0){if(updateHash){el('overviewTitle').focus({preventScroll:true});el('overviewTitle').scrollIntoView?.({block:'start'});}return;}
      const s=scenes[current];el('sceneCount').textContent='0'+(current+1)+' / 07';
      ['sceneTitle','sceneKicker','sceneQuestion','ideaText','builtText','openText','momentLabel','diagramCaption','sceneRelation'].forEach((id,k)=>{el(id).textContent=[s.title,s.tag,s.question,s.idea,s.built,s.open,s.control,s.caption,s.relation][k];});
      el('instrumentLink').setAttribute('href',s.href);el('previous').disabled=current===0;
      el('next').textContent=current===6?'Gesamtkarte ↗':'Weiter →';
      value=moments[current];el('moment').value=String(value);diagram();
      el('sceneLayers').innerHTML=layersForScene(current).map(id=>{const layer=layers.find(item=>item.id===id);return '<button type="button" data-layer="'+id+'">'+layer.number+' · '+layer.title+' ↗</button>';}).join('');
      if(updateHash){el('sceneTitle').focus({preventScroll:true});el('sceneTitle').scrollIntoView?.({block:'start'});}
    }
    cards.addEventListener('click',event=>{const b=event.target.closest('[data-scene]');if(b)show(Number(b.dataset.scene));});
    el('toOverview').addEventListener('click',()=>show(-1));
    function preserveDeparture(){
      if(current<0||crosswalk.rowFor(current+1).status!=='bound')return;
      // Preserve this page's current context for browser Back/reload, without storage.
      win.history.replaceState(null,'',crosswalk.returnHref({scene:current+1,moment:value,layer:selectedLayer}));
    }
    el('humanJourneyLink').addEventListener('click',preserveDeparture);
    el('humanBlueprintLink').addEventListener('click',preserveDeparture);
    el('viewOverview').addEventListener('click',()=>show(-1));
    el('viewArchitecture').addEventListener('click',()=>showArchitecture());
    el('toArchitecture').addEventListener('click',()=>showArchitecture(layersForScene(current)[0]||selectedLayer));
    el('sceneLayers').addEventListener('click',event=>{const button=event.target.closest('[data-layer]');if(button)showArchitecture(button.dataset.layer);});
    map.addEventListener('click',event=>{
      const button=event.target.closest('[data-layer]');
      if(!button||!layers.some(item=>item.id===button.dataset.layer))return;
      selectedLayer=button.dataset.layer;renderLayer();win.history.replaceState(null,'','#layer-'+selectedLayer);
    });
    el('layerScenes').addEventListener('click',event=>{const button=event.target.closest('[data-scene]');if(button)show(Number(button.dataset.scene));});
    el('returnDifference').addEventListener('input',event=>{returnValue=clamp(event.target.value,0,100);returnRegister();});
    el('previous').addEventListener('click',()=>{if(current>0)show(current-1);});
    el('next').addEventListener('click',()=>show(current===6?-1:current+1));
    el('moment').addEventListener('input',event=>{if(current<0)return;value=clamp(event.target.value,0,100);moments[current]=value;diagram();});
    el('storyboard').addEventListener('keydown',event=>{
      if(/^(INPUT|SELECT|TEXTAREA|A|BUTTON)$/.test(event.target.tagName)||event.ctrlKey||event.metaKey||event.altKey)return;
      if(event.key==='Escape'){show(-1);event.preventDefault();}
      if(current>=0&&event.key==='ArrowRight'){show(current===6?-1:current+1);event.preventDefault();}
      if(current>0&&event.key==='ArrowLeft'){show(current-1);event.preventDefault();}
    });
    function fromHash(){
      const hash=win.location.hash,m=/^#scene-([1-7])$/.exec(hash),layer=/^#layer-(structure|coupling|visibility|return)$/.exec(hash);
      if(hash==='#sources')return;
      if(hash==='#architecture'||layer){showArchitecture(layer?layer[1]:selectedLayer,false);return;}
      show(m?Number(m[1])-1:-1,false);
    }
    win.addEventListener('hashchange',fromHash);if(win.ResizeObserver)new win.ResizeObserver(diagram).observe(svg);
    if(incoming.status==='valid'){
      show(incoming.context.scene-1,false);
      el('humanReturnStatus').hidden=false;el('humanReturnStatus').textContent='Navigationskontext: Szene '+incoming.context.scene+' und Regler '+incoming.context.moment+' wiederhergestellt. Kein wissenschaftlicher Rekonstruktionsnachweis.';
      el('sceneTitle').focus({preventScroll:true});el('sceneTitle').scrollIntoView?.({block:'start'});
    }else{
      if(incoming.status==='invalid'){show(-1,false);el('humanReturnStatus').hidden=false;el('humanReturnStatus').textContent='Ungültiger Rückkehrkontext: neutraler Einstieg, keine fremden Werte übernommen.';}
      else fromHash();
    }
    return {show,showArchitecture,get snapshot(){return{view,scene:current,value,selectedLayer,returnValue};}};
  }
  return{scenes,layers,layersForScene,drawing,returnExample,mount};
});
