/* Human presentation only. Reuses source instruments; no cross-instrument state transfer. */
(function(root){
"use strict";
const stations=[
 {title:"Was versteckt sich auf der Rückseite?",kind:"KÖRPER",name:"Tessarec · Blue Body",file:"A0_TESSAREC_BLUE_BODY_LAB.html",target:"lab",label:"Körper drehen",button:"Körper ausprobieren →",story:"Von vorn sieht ein Körper anders aus als von hinten. Dreh ihn — und entdecke, wie seine Flächen zusammenhängen.",action:"Ziehe am Körper oder benutze Links / Rechts. Halte die Drehung an und wechsle zur Draufsicht.",notice:"Achte darauf: In der flachen Ansicht können Stellen zusammenrücken, die räumlich getrennt sind.",boundary:"Ein konstruiertes geometrisches Modell. Die Hülle und das mathematische Zustandsnetz sind nicht identisch."},
 {title:"Vier Bilder. Was gehört zusammen?",kind:"PERSPEKTIVEN",name:"Blue Body · vier Ansichten des Innenregisters",file:"A0_TESSAREC_BLUE_BODY_LAB.html",target:"blue-body-interior-crt16",label:"Anders sehen",button:"Ansichten ausprobieren →",story:"Jetzt blickst du in ein anderes Modell: ein gemeinsames Register aus Punkten. Von vorn, von oben und von der Seite sieht dieselbe Auswahl anders aus.",action:"Verschiebe den Kanal-Regler. Suche die goldene Auswahl in allen vier Bildern. Mit Play kannst du die Zustände durchlaufen lassen.",notice:"Ein Punkt kann im einen Bild gut sichtbar sein und im anderen mit weiteren Punkten überlagern.",boundary:"Vier Projektionen eines gemeinsamen 48er-Adressregisters. Das ist keine nachgewiesene physische Innengeometrie des Körpers aus Station 1."},
 {title:"Warum bleibt die Mitte offen?",kind:"FALTUNG",name:"Pentagon-Faltbox · Kontaktprojektion",file:"A0_TESSAREC_BLUE_BODY_LAB.html",target:"fold-contact",label:"Eine Lücke finden",button:"Klappen ausprobieren →",story:"Vier Klappen bewegen sich zur Mitte. Aber Falten allein garantiert noch nicht, dass sie sich dort treffen.",action:"Verändere den Faltwinkel. Stelle die Verlängerung zuerst auf 1 und erhöhe sie langsam: Wann wird aus der Lücke Kontakt — und wann Überlappung?",notice:"Beobachte den Kontaktstatus. Die Ansicht zeigt eine konstruierte Faltregel, keine Materialsimulation.",boundary:"Schematische Kontaktprojektion. Klappendicke, räumliche Kollisionen und eine baubare geschlossene Box sind damit nicht bewiesen."},
 {title:"Eine kleine Änderung. Eine andere Welt?",kind:"FRAKTALE",name:"Mandelbrot ↔ Julia · Parameter und Bahn",file:"A0_BLUE_PINK_DODECA_CELL_RETURN.html",target:"formation",label:"Eine Welt verändern",button:"Fraktale ausprobieren →",story:"Eine feste Rechenregel erzeugt sehr unterschiedliche Bilder — je nachdem, welchen Parameter du wählst.",action:"Wähle nacheinander Interior, Boundary und Exterior. Verändere dann Re(c) oder Im(c) ein kleines Stück und vergleiche Mandelbrot-Bild, Julia-Bild und die Punktbahn.",notice:"Die Bilder zeigen unterschiedliche Dinge: links eine Parameterkarte, daneben die Dynamik für den gewählten Parameter.",boundary:"Endliche numerische Fraktaldarstellung mit z → z²+c. Flammenbild und Körperadresse sind Ansichtszuordnungen, kein gemeinsamer physikalischer Mechanismus."},
 {title:"Welche Welt möchtest du bewegen?",kind:"SPIELEN",name:"NEXAH ARKADE · Game of Worlds",file:"../previews/numbers-return-20261019/book/A0_GAME_OF_WORLDS_PLAY.html",target:"life",query:"world=life",focus:false,label:"Spielen & zurückkehren",button:"Arkade öffnen →",story:"Jetzt wird aus dem Lesen ein Spiel. Drei Welten reagieren auf unterschiedliche Regeln — LIFE, Three Domains und Numbers.",action:"Starte mit LIFE. Drücke PLAY oder +1, wechsle dann die Ansicht. Wenn du neugierig bist, öffne oben THREE DOMAINS oder NUMBERS und vergleiche, was Bewegung dort bedeutet.",notice:"Jede Welt behält ihren eigenen Zustand und ihre eigene Uhr. Der Wechsel pausiert die verlassene Welt.",boundary:"Drei getrennte Spielinstrumente mit getrennten Regeln. Gemeinsame Bedienung und Ansichten machen sie vergleichbar, aber nicht zu demselben Operator."}
];
function sourceUrl(station){const query=station.focus===false?station.query:"human-stage="+encodeURIComponent(station.target);return station.file+(query?"?"+query:"")+"#"+station.target}
function indexFromHash(hash){const match=/^#station-([1-5])$/.exec(hash);return match?Number(match[1])-1:null}
function mount(doc,win){
 let current=0,frame=null,opened=false;
 const get=id=>doc.getElementById(id),buttons=Array.from(doc.querySelectorAll("[data-station]"));
 const entry=win.A0HumanCrosswalk?.readContext(win.location.search||"","journey");
 if(entry?.status==="valid"){get("humanCrosswalkBack").href=win.A0HumanCrosswalk.returnHref(entry.context);get("humanCrosswalkCopy").hidden=false;get("humanCrosswalkCopy").textContent="Du kommst aus dem Theorie-Storyboard. Die neue Reise stellt keinen früheren Fragen-Loop wieder her. Der Rücklink bewahrt deine Modellposition."}
 function close(){if(frame){frame.remove();frame=null}get("poster").hidden=false;get("stopInstrument").disabled=true;get("loadInstrument").hidden=false;get("loadStatus").textContent="Instrument geschlossen. Du kannst es erneut starten."}
 function load(){
  close();opened=true;const station=stations[current],owned=doc.createElement("iframe");frame=owned;
  owned.title=station.name+" · interaktives Original";owned.setAttribute("sandbox","allow-scripts allow-same-origin");owned.src=sourceUrl(station);
  get("poster").hidden=true;get("instrumentShell").append(owned);get("stopInstrument").disabled=false;get("loadInstrument").hidden=true;
  get("loadStatus").textContent="Instrument lädt. Falls das Fenster leer bleibt: Das Original ist unter „Was sehe ich hier eigentlich?“ direkt erreichbar.";
  owned.addEventListener("load",()=>{if(frame===owned)get("loadStatus").textContent="Originalseite geladen. Bediene die Regler im Fenster. Beim Weitergehen wird dieses Fenster geschlossen."});
 }
 function select(index,{focus=false,follow=false}={}){
  if(!Number.isInteger(index)||index<0||index>=stations.length)return;
  close();current=index;const s=stations[index];
  for(const [id,value] of Object.entries({stationNumber:String(index+1).padStart(2,"0")+" / "+String(stations.length).padStart(2,"0")+" · "+s.kind,stationTitle:s.title,stationStory:s.story,stationAction:s.action,stationNotice:s.notice,stationBoundary:s.boundary,sourceName:s.name,loadInstrument:s.button}))get(id).textContent=value;
  get("sourceLink").href=sourceUrl(s);get("previousStation").disabled=index===0;
  get("nextStation").textContent=index===stations.length-1?"Zum Return →":"Weiter: "+stations[index+1].label+" →";
  buttons.forEach((button,i)=>{if(i===index)button.setAttribute("aria-current","step");else button.removeAttribute("aria-current")});
  get("loadStatus").textContent="Bereit. Öffne die Station mit „"+s.button.replace(" →","")+"“.";
  if(follow&&opened)load();if(focus){get("stationCopy").focus({preventScroll:true});get("instrument").scrollIntoView({behavior:win.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"})}
 }
 function go(index){if(index===stations.length){close();get("return").focus();get("return").scrollIntoView({block:"start"});return}win.location.hash="station-"+(index+1)}
 buttons.forEach(button=>button.addEventListener("click",event=>{event.preventDefault();const index=Number(button.dataset.station);if(index===current){get("instrument").scrollIntoView({block:"start"});return}go(index)}));
 get("loadInstrument").addEventListener("click",load);get("stopInstrument").addEventListener("click",()=>{opened=false;close()});
 get("previousStation").addEventListener("click",()=>go(current-1));get("nextStation").addEventListener("click",()=>go(current+1));
 win.addEventListener("hashchange",()=>{const index=indexFromHash(win.location.hash);if(index!==null)select(index,{focus:true,follow:true})});
 win.addEventListener("pagehide",close);
 select(indexFromHash(win.location.hash)??0);
 return {select,load,close,get current(){return current}};
}
const api={stations,sourceUrl,indexFromHash,mount};if(typeof module!=="undefined"&&module.exports)module.exports=api;else{root.A0HumanJourney=api;root.A0HumanJourneyView=mount(root.document,root)}
})(typeof window!=="undefined"?window:globalThis);
