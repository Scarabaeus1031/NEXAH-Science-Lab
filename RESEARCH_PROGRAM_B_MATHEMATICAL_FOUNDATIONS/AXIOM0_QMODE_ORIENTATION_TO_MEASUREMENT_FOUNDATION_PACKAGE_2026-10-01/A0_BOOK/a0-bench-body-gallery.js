(function(root,factory){
 const node=typeof module==='object'&&module.exports;
 const api=factory(node?require('./assets/a0-pentagon-body-player-v1.js'):root.A0PentagonBodyPlayer,node?require('./a0-one-flow.js'):root.A0OneFlowModel);
 if(node)module.exports=api;else root.A0BenchBodyGallery=api;
})(typeof globalThis==='undefined'?this:globalThis,function(Body,Flow){
 'use strict';
 const ITEMS=[
 {title:'Blue Body · räumlicher Blick',copy:'48 adressierte Knoten auf drei Lagen. Im Player kannst du den Körper drehen und einzelne Adressen wählen.',kind:'body',view:'iso',href:'#bodyRouteBench',route:'player'},
 {title:'Innenleben · drei Pentagonlagen',copy:'Aufsicht auf die vorhandene Körpergeometrie. 01b öffnet den CRT16-Adapter mit seinen eigenen vier Ansichten.',kind:'body',view:'top',href:'#bodyRouteBench',route:'interior'},
 {title:'Blue Body · Seitenblick',copy:'Dieselben 48 Knoten aus einer anderen Richtung. Ein anderer Blick ist kein zweiter Körper.',kind:'body',view:'side',href:'#bodyRouteBench',route:'player'},
 {title:'Schalen · ineinander',copy:'Die drei vorhandenen Schalenradien als feste Vorschau. Im One-Flow-Original die Ansicht „Schalen“ wählen.',kind:'shells',href:'A0_BLUE_PINK_DODECA_CELL_RETURN.html#oneFlow'},
 {title:'Teller · gegenüberliegend',copy:'Die vorhandenen Paraboloidkurven und die symbolische Taille. In der Bench kannst du Teller und Spiegelansicht vergleichen.',kind:'plates',href:'#plateMirrorBench'},
 {title:'Möbiusband · eine Fläche',copy:'Feste Ansicht der vorhandenen parametrischen Bandgeometrie. Im One-Flow-Original die Möbius-Ansicht wählen.',kind:'mobius',href:'A0_BLUE_PINK_DODECA_CELL_RETURN.html#oneFlow'}
 ];
 const COLORS=['#31cde9','#ed72b1','#e8bf58'];
 function point(p,view){
  if(view==='top')return[p.x,p.y];
  if(view==='side')return[p.y,p.z];
  return[p.x*.82-p.y*.44,p.z*.85+p.x*.3+p.y*.48];
 }
 function paths(item){
  if(item.kind==='body'){
   const body=Body.buildBody(),nodes=new Map(body.nodes.map(n=>[n.sourceKey,n]));
   return body.edges.map(e=>({points:[point(nodes.get(e.a),item.view),point(nodes.get(e.b),item.view)],color:COLORS[nodes.get(e.a).layer]}));
  }
  return Flow.curves(item.kind).map(line=>({points:line.points.map(p=>Flow.project(p,.28)),color:COLORS[line.index]}));
 }
 function svg(item){
  const lines=paths(item),pts=lines.flatMap(l=>l.points),xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]);
  const minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys),scale=Math.min(360/(maxX-minX||1),210/(maxY-minY||1));
  const at=p=>[(220+(p[0]-(minX+maxX)/2)*scale).toFixed(2),(135-(p[1]-(minY+maxY)/2)*scale).toFixed(2)];
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 270" aria-hidden="true"><rect width="440" height="270" fill="#04151f"/>'+lines.map(l=>'<polyline points="'+l.points.map(p=>at(p).join(',')).join(' ')+'" fill="none" stroke="'+l.color+'" stroke-width="1.1" opacity=".65"/>').join('')+'</svg>';
 }
 function markup(){
  return '<div class="bvg-heading"><small>ANSICHTEN DURCHSEHEN · DANN EINSTEIGEN</small><h1 tabindex="-1">Körper &amp; Räume</h1><p>Scroll durch die festen Quellansichten. Wähle das Bild, das du näher erkunden möchtest.</p></div><nav class="bvg-grid" aria-label="Körper und räumliche Ansichten">'+ITEMS.map((item,i)=>'<a class="bvg-card" data-walk-open '+(item.route?'data-body-gallery-route="'+item.route+'" ':'')+'href="'+item.href+'">'+svg(item)+'<div><small>0'+(i+1)+' · FESTE QUELLGEOMETRIE</small><h2>'+item.title+'</h2><p>'+item.copy+'</p><b>Im Instrument erkunden ↗</b></div></a>').join('')+'</nav><p class="bw-note">Die Vorschauen verwenden buildBody() des vorhandenen Pentagon-Players und curves()/project() des One-Flow-Modells. Die Projektion des Body-Bildes ist eine feste Galerieansicht, keine Aufnahme des CRT16-Adapters. Keine Live-Zustände, keine neue Bewegungsregel.</p><details class="bw-room-details"><summary>Weitere Körper, Quellen und Orientierung</summary><p>Die sechs Bilder sind eine Auswahl räumlicher Ansichten, kein vollständiger Modellbestand. Dodeka, vier Satelliten und Return-Flächen findest du im Original; die GLB-Modelle im Ausstellungsfenster oder im Quellenbestand.</p><nav class="bw-neighbours"><a href="A0_BLUE_PINK_DODECA_CELL_RETURN.html#formation">Blue / Pink · Formation ↗</a><a href="#nsnGlbSources" data-walk-open>GLB-Bestand ↓</a><a href="#benchFoyer">3D-Ausstellungsfenster ↑</a><a href="#benchPerspectiveDeck" data-walk-open>Weitere Originalfenster ↓</a></nav></details>';
 }
 return{ITEMS,point,paths,svg,markup};
});
