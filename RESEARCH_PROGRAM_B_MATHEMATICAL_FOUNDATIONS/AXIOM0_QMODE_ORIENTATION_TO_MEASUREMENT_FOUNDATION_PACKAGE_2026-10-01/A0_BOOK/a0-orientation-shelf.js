/* A curated view over existing instruments. Not a module or evidence registry. */
(() => {
  'use strict';
  const rows = [
    {title:'Träger & Grids',families:'F2 · Address / Boundary',color:'#49d2e8',question:'Worauf arbeiten wir? Welche Adresse gehört zu welchem Träger?',tools:[
      {title:'Mathfield · Mathematical Joints',href:'A0_MATHEMATICAL_JOINTS.html',use:'Begriffe, endliche Grids und mathematische Fugen gemeinsam untersuchen.',input:'Q°-Record, definierte Raster und Maps',output:'Definitionen und begrenzte Joint-Fragen',state:'Mathematische Werkstatt',links:[['Fields & Joints · Feldkarte','A0_FIELDS_AND_JOINTS_ATLAS.html']]},
      {title:'Pink Diamond · Grid Atlas',href:'A0_PINK_DIAMOND_GRID_ATLAS.html',use:'Base, Mod, Grid und CRT am selben Zahlenrecord unterscheiden; Viewports und Projektionsansichten vergleichen.',input:'Deklarierte Zahlen- und Adressräume',output:'Ziffernwort, Rest, Grid-Koordinate oder CRT-Tupel',state:'Typisierte Darstellungswechsel',links:[['Base · Mod · Grid · CRT','A0_PINK_DIAMOND_GRID_ATLAS.html#representationMode']]},
      {title:'Q4 · Joint Audit',href:'A0_Q4_MAGIC_SQUARE_JOINT_AUDIT.html',use:'Bitadressen, Komplement und Pascal-Gewicht mit Magic-Square-Ansichten vergleichen.',input:'16 Bitzustände / deklarierte Matrixansichten',output:'Komplementpaare und getrennte Zahlenaudits',state:'Endliche Kontrollen',links:[]}
    ]},
    {title:'Operatoren & Phasen',families:'F3 · Transition / Operator · F4 · Phase / Drift',color:'#ffc94d',question:'Was tun wir mit dem Träger? Welche Operation und welcher Takt sind definiert?',tools:[
      {title:'Orientation Controller Bench',href:'A0_ORIENTATION_CONTROLLER_BENCH.html',use:'J, Rotation und zentrierten Elevator bedienen; Apertur und Projektion getrennt prüfen.',input:'Benannter State-Record',output:'Operationsverlauf und vier Return-Prüfungen',state:'Engineering-Bench · 65 Kernprüfungen',links:[['Offene Mess- und Kalibrierfragen','../100_A0_ORIENTATION_CONTROLLER_BENCH_GAP_REGISTER_2026-10-16.md']]},
      {title:'Pascal / Pentagon',href:'A0_PASCAL_PENTAGON_OPERATOR_JOINTS.html',use:'Pascal-Träger, Register, Quotienten und Phasen als verschiedene Rollen erkunden.',input:'Deklarierte Pascal-Zellen und Register',output:'Quotienten, Phasen- und Return-Records',state:'Operator-Instrument',links:[['Generation Corner','A0_PASCAL_GENERATION_CORNER.html']]},
      {title:'AXIS08 · Fold / Return',href:'A0_AXIS08_FOLD_RETURN_SEQUENCER.html',use:'Geordnete Faltungen und Rückkehrfolgen im Sequencer verfolgen.',input:'Deklarierter Carrier und Schrittfolge',output:'View- und Return-Sequenz',state:'Gebundener Sequencer',links:[]}
    ]},
    {title:'Linsen & Sichtbarkeit',families:'F1 · Observation / Record',color:'#f35fa7',question:'Was wird sichtbar? Was fehlt im Record — und was wird hinzugezeichnet?',tools:[
      {title:'Newton · Leibniz · Goethe',href:'A0_NEWTON_GOETHE_OBSERVER_LENS.html',use:'Zerlegung, relationale Ordnung und Erscheinung nebeneinander lesen.',input:'Deklarierte Vergleichsfenster',output:'Spektrum, Rasterdifferenz und Erscheinungsbild',state:'Vergleichslinse · kein kalibriertes Optikmodell',links:[['Rainbow / Purple Rain','A0_RAINBOW_PURPLE_RAIN.html']]},
      {title:'NEON · Cartography ≠ Ontology',href:'../../../SCIENCE_LAB/NAVIGATION/EVIDENCE/ILAU_ORIENTATION_INSTRUMENTS_2026-10-09/INSTRUMENTS/Neon_Cartography_Ontology.html',use:'Dasselbe Feld in drei Sichtfenstern vergleichen: verborgen, erhalten oder überzeichnet.',input:'Fixes Feld und veränderter Sichtbarkeitsparameter',output:'Record mit verdeckten Strukturen oder zusätzlichen Scheintoren',state:'ILAU:NEON_CARTOGRAPHY_ONTOLOGY · Sichtbarkeitskontrolle',links:[['NEON / Trap Door · Human View','A0_NEON_TRAP_DOOR.html']]},
      {title:'Black Sun / Big Moon',href:'A0_BLACK_SUN_BIG_MOON.html',use:'Maske, Verdeckung und sichtbares Residuum auseinanderhalten.',input:'Quelle, Transformation und Sichtfenster',output:'Begrenzter View mit sichtbarer Differenz',state:'Source-bound Beobachtungslinse',links:[]}
    ]},
    {title:'Körper & Topologie',families:'F5 · Connectivity / Topology',color:'#a98aff',question:'Welche Nachbarschaften und Verklebungen bestehen wirklich? Welche Form ist nur eine Ansicht?',tools:[
      {title:'Blue Body · Host Lab',href:'A0_TESSAREC_BLUE_BODY_LAB.html',use:'Endlichen Host, Innenraum und äußere Darstellung getrennt untersuchen.',input:'MOD:TESSAREC · benannter endlicher Host',output:'Adressierte Zustände und Körperansichten',state:'Carrier und geometrischer View getrennt',links:[['Dodeca Countershot','A0_BLUE_BODY_DODECA_COUNTERSHOT.html'],['Runde Hülle → lokales Grid','#blue-body-topology']]},
      {title:'Ihara / Hashimoto',href:'A0_IHARA_HASHIMOTO_CYCLE_BRIDGE.html',use:'Kante, erlaubten Turn, primitiven Zyklus und Zeta-Record desselben Graphen vergleichen.',input:'Definierter endlicher Graph',output:'Nicht-rücklaufende Wege, Zyklusprodukt und Determinante',state:'Graphinstrument · Riemann-Analogie getrennt',links:[]},
      {title:'Torus · Möbius · Klein',href:'#view-coupling',use:'Formansichten mit expliziten Rand- und Verklebungsfragen vergleichen.',input:'Jeweils zu deklarierende Fläche und Randabbildung',output:'Topologische Frage und nötiger Return-Nachweis',state:'Vergleichsplatz · keine gemeinsame Trägeridentität',links:[['Coupling-Matrix und offene Grenzen','#view-coupling'],['NEON-Record: Sichtbarkeit ist keine Topologie','../../../SCIENCE_LAB/NAVIGATION/EVIDENCE/ILAU_ORIENTATION_INSTRUMENTS_2026-10-09/INSTRUMENTS/Neon_Cartography_Ontology.html']]}
    ]},
    {title:'Fugen & Anwendungen',families:'F3 · Operator · F6 · Synchronization / Control',color:'#65dcb2',question:'Wie werden zwei Werkzeuge verbunden? Welche Information überlebt den Übergang?',tools:[
      {title:'Joint Applications',href:'A0_JOINT_APPLICATION_DEMONSTRATOR.html',use:'Adressierung, Vergleiche und Return-Verträge zu konkreten Demonstratoren zusammensetzen.',input:'Carrier, Map und deklarierter Vergleich',output:'Joint-Record mit Verlust, Zusatz und Residuum',state:'Anwendungswerkstatt',links:[['JARP · Protokoll','A0_JOINT_APPLICATION_DEMONSTRATOR.html#protocol']]},
      {title:'JARP · Cross-Lens',href:'A0_JARP_CROSS_LENS_EXTENSION.html',use:'Rückkehr und Identifizierbarkeit unter verschiedenen Linsen vergleichen.',input:'Gebundener Carrier und Linsenrecord',output:'Rekonstruktionsfrage mit erhaltenen und verlorenen Koordinaten',state:'Typisierte Erweiterung',links:[]},
      {title:'GAME 4 LIFE +1',href:'A0_GAME_4_LIFE_PLUS_1.html',use:'Synchronisierte Views, Flat↔Cylinder und Blue-Body-Transfer als Demonstrator prüfen.',input:'Benannter LIFE-Carrier / deklarierter Transfer',output:'Zustandsansichten und Transfer-Return',state:'Multi-View-Demonstrator',links:[['Blue-Body-Transfer','A0_GAME_4_LIFE_PLUS_1.html#blue-body-transfer'],['Zwei bestehende Crosswalk-Geschichten','#integration-crosswalk']]}
    ]},
    {title:'Quellen, Befunde & Return',families:'F7 · Validation / Governance',color:'#e49c65',question:'Woher stammt die Ansicht? Was trägt der Befund? Welche Frage bleibt offen?',tools:[
      {title:'Visual Field Library',href:'A0_VISUAL_FIELD_LIBRARY.html',use:'Historische Visuals und ihre vorhandenen Quellen als Materialregal öffnen.',input:'Visuelle Quellen und dokumentierte Provenienz',output:'Quellenzugang und begrenzte Vergleichsfragen',state:'Quellenregal · Bildähnlichkeit ist kein Befund',links:[['A0 Asset Index · vollständiger Bestand','A0_ASSET_INDEX.html']]},
      {title:'Scientific Position',href:'A0_SCIENTIFIC_POSITION_REPORT.html',use:'Ergebnisse, Neuheitsfragen und wissenschaftliche Grenzen zusammen lesen.',input:'Vorhandene Assessments und Returns',output:'Lesbare wissenschaftliche Einordnung',state:'Source-bound Report',links:[['A0 Fundamentals · Buch','index.html'],['Return without Identity · Paper C','A0_RETURN_WITHOUT_IDENTITY_PAPER.html']]},
      {title:'A0 Science Desk',href:'A0_RESEARCH_DESK.html',use:'Aktuellen Arbeitsstand, Tests, Lücken und Forschungsgates verfolgen.',input:'Controlling Records, Backlog und Returns',output:'Arbeitsübersicht mit nächsten zulässigen Gates',state:'A0 Science authority · Arbeitsfläche',links:[['Forschungsbacklog','A0_RESEARCH_BACKLOG.html'],['Bewertete Builder-Toolbox','../../../../../00%20EXECUTIVE/NEXAH-Mission-Control/00_OVERVIEW/BUILDER_STATUS_REPORT.html']]}
    ]}
  ];
  const moduli = [2,3,4,5,6,12,20];
  const api = {rows,moduli,remainder:(n,m)=>((n%m)+m)%m};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  if(typeof document==='undefined')return;
  const root=document.getElementById('shelfRows');if(!root)return;
  const element=(tag,text,className)=>{const node=document.createElement(tag);if(text)node.textContent=text;if(className)node.className=className;return node;};
  const link=(title,href)=>{const a=element('a',title);a.href=href;return a;};
  moduli.forEach(m=>{
    const tile=element('article',null,'shelf-mod');tile.append(element('h3',`MOD ${m}`));
    const grid=element('div',null,'shelf-mod-grid');grid.setAttribute('role','img');grid.setAttribute('aria-label',`Zahlen 0 bis 59 modulo ${m}; Farbe entspricht dem Rest`);
    for(let n=0;n<60;n++){const cell=element('span');cell.style.setProperty('--cell',`hsl(${api.remainder(n,m)*360/m} 65% ${m===2?(n%2?75:25):52}%)`);cell.title=`${n} mod ${m} = ${api.remainder(n,m)}`;grid.append(cell);}
    tile.append(grid,element('p',`n ↦ n mod ${m}\n${Array.from({length:Math.min(m+2,12)},(_,n)=>api.remainder(n,m)).join(' · ')} …`));
    document.getElementById('shelfModLenses').append(tile);
  });
  rows.forEach((row,index)=>{
    const section=element('section',null,'shelf-row');section.style.setProperty('--shelf-color',row.color);
    const heading=element('header');heading.append(element('small',`${String(index+1).padStart(2,'0')} · ${row.families}`),element('h3',row.title),element('p',row.question));
    const cards=element('div',null,'shelf-cards');
    row.tools.forEach(tool=>{
      const card=element('article',null,'shelf-tool');card.dataset.search=[row.title,row.families,...Object.values(tool).filter(v=>typeof v==='string')].join(' ').toLocaleLowerCase('de');
      const h=element('h4');h.append(link(`${tool.title} →`,tool.href));card.append(element('small',tool.state),h,element('p',tool.use));
      const dl=element('dl');[['INPUT',tool.input],['OUTPUT / RETURN',tool.output]].forEach(([key,value])=>dl.append(element('dt',key),element('dd',value)));card.append(dl);
      if(tool.links.length){const more=element('details');more.append(element('summary','Vertiefen · Quellen & Unterfenster'));tool.links.forEach(([title,href])=>more.append(link(`${title} →`,href)));card.append(more);}
      cards.append(card);
    });section.append(heading,cards);root.append(section);
  });
  const search=document.getElementById('shelfSearch');
  function filter(){const query=search.value.trim().toLocaleLowerCase('de');let count=0;root.querySelectorAll('.shelf-row').forEach(row=>{let visible=0;row.querySelectorAll('.shelf-tool').forEach(card=>{card.hidden=!card.dataset.search.includes(query);if(!card.hidden){count++;visible++;}});row.hidden=!visible;});document.getElementById('shelfCount').textContent=`${count} / ${rows.reduce((n,row)=>n+row.tools.length,0)} Werkzeugplätze`;document.getElementById('shelfEmpty').hidden=count!==0;}
  search.addEventListener('input',filter);filter();
})();
