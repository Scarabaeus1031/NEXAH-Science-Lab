(function(){
"use strict";
const root=document.getElementById('cathedral-glb-stage');if(!root)return;
const models=window.A0CathedralModels,viewer=document.getElementById('cathedralModel');
const pick=document.getElementById('cathedralModelPick'),status=document.getElementById('cathedralModelStatus'),tracks=document.getElementById('cathedralTrack'),play=document.getElementById('cathedralPlay');
const controls=document.getElementById('cathedralPartsControls'),part=document.getElementById('cathedralPart'),explode=document.getElementById('cathedralExplode'),height=document.getElementById('cathedralHeight'),download=document.getElementById('cathedralDerivedDownload'),partsStatus=document.getElementById('cathedralPartsStatus');
let current=null,url=null,request=0,playing=false,sourceBytes=null,derived=false;
const lifeControls=document.getElementById('cathedralLifeControls'),lifePlay=document.getElementById('cathedralLifePlay'),lifeStep=document.getElementById('cathedralLifeStep'),lifeReset=document.getElementById('cathedralLifeReset'),lifePattern=document.getElementById('cathedralLifePattern'),lifeMode=document.getElementById('cathedralLifeMode'),lifeStatus=document.getElementById('cathedralLifeStatus');
let lifeSession=null,lifeActive=false,lifeRunning=false,lifeTimer=null,lifeBusy=false,lifeRenderedMode=null;
function lifePause(){lifeRunning=false;if(lifeTimer!==null)clearTimeout(lifeTimer);lifeTimer=null;if(lifePlay)lifePlay.textContent='▶ LIFE starten';if(lifeStatus)lifeStatus.textContent=lifeStatus.textContent.replace('läuft','pausiert');}
function lifeSchedule(){if(!lifeActive||!lifeRunning||lifeBusy||document.hidden||lifeTimer!==null)return;lifeTimer=setTimeout(()=>{lifeTimer=null;lifeAdvance();},1100);}
function lifeRender(){
 if(current?.id!=='RC08'||!sourceBytes||!window.A0CathedralLife)return;
 const entering=!lifeActive;lifeActive=true;derived=true;stop();tracks.disabled=play.disabled=true;
 lifeSession??=window.A0CathedralLife.start(lifePattern.value);
 try{const r=window.A0CathedralLife.render(sourceBytes,lifeSession,lifeMode.value);lifeBusy=true;lifeStep.disabled=true;display(r.bytes);download.download='cathedral-life-g'+r.generation+'.glb';lifeStatus.textContent='Generation '+r.generation+' / 32 · '+r.live+' lebende Zellen · '+r.cells+' Zellen im Verlauf · '+(lifeRunning?'läuft':'pausiert');partsStatus.textContent='LIFE-Verlauf aktiv · Zellkoordinaten auf X/Z, Generation auf Y; die Architektur ist eine Ansicht.';document.getElementById('cathedralModelNote').textContent='B3/S23 unverändert · 16×16, endlicher toter Rand. Alte Generationen sind Erinnerung, keine Nachbarn der aktuellen Generation.';
 if(entering||lifeRenderedMode!==lifeMode.value){viewer.cameraTarget=lifeMode.value==='exploded'?'0m 12m -10m':'0m 6m -10m';viewer.cameraOrbit=lifeMode.value==='exploded'?'35deg 70deg 50m':'35deg 70deg 36m';viewer.fieldOfView='45deg';}lifeRenderedMode=lifeMode.value;
 if(r.generation>=window.A0CathedralLife.LIMIT){lifePause();lifeStatus.textContent+=' · Horizont erreicht';}
 }catch(e){lifePause();lifeBusy=false;lifeStep.disabled=false;lifeStatus.textContent='LIFE-Ansicht fehlgeschlagen: '+e.message;}
}
function lifeAdvance(){if(lifeBusy||current?.id!=='RC08'||!sourceBytes)return;lifeSession??=window.A0CathedralLife.start(lifePattern.value);if(lifeSession.frames.length>window.A0CathedralLife.LIMIT){lifePause();return;}lifeSession=window.A0CathedralLife.step(lifeSession);lifeRender();}
pick.innerHTML=models.map(m=>'<option value="'+m.id+'">'+m.label+'</option>').join('');
function stop(){viewer.pause();playing=false;play.textContent='Animation starten';}
function configureTracks(){
 const names=derived?[]:viewer.availableAnimations||[];
 tracks.innerHTML=names.length?names.map(n=>'<option>'+n+'</option>').join(''):'<option>Keine eingebettete Animation</option>';
 tracks.disabled=play.disabled=names.length===0;
 if(names.length){tracks.value=names.includes('BreathPulse_Procedural')?'BreathPulse_Procedural':names[0];viewer.animationName=tracks.value;}
 status.textContent=current.label+(lifeActive?' · LIFE-VERLAUF':derived?' · ABGELEITETE STATISCHE ANSICHT':' · Original')+' · '+names.length+' eingebettete Animationen. Ziehen: drehen · Scrollen/Pinch: zoomen.';
}
function display(bytes){const previous=url;url=URL.createObjectURL(new Blob([bytes],{type:'model/gltf-binary'}));viewer.src=url;if(download){download.hidden=!derived;if(derived)download.href=url;}if(previous)URL.revokeObjectURL(previous);}
function partsView(){
 if(!sourceBytes||current?.id!=='RC08'||!part||!window.A0CathedralParts)return;
 lifePause();lifeActive=false;lifeBusy=false;if(lifeStep)lifeStep.disabled=false;if(lifeStatus)lifeStatus.textContent='LIFE-Ansicht inaktiv · Start setzt den bisherigen Verlauf fort; LIFE-Reset beginnt neu.';if(download)download.download='cathedral-0.8-bauteilansicht.glb';
 stop();tracks.disabled=play.disabled=true;derived=part.value!=='original';
 try{
  if(!derived){explode.value='0';height.value='100';display(sourceBytes);partsStatus.textContent='Original · 494 Knoten, davon 491 direkt am Wurzelknoten. Zwei Journey-Hilfsknoten sind nicht an die Szene angeschlossen. Originalanimationen verfügbar.';}
  else{const result=window.A0CathedralParts.derive(sourceBytes,{part:part.value,explode:Number(explode.value)/100,height:Number(height.value)});display(result.bytes);partsStatus.textContent=result.report.selected+' / '+result.report.attached+' angeschlossene Bauteilknoten · Abstand '+explode.value+' % · Höhe '+height.value+' % · statisch, keine Simulation.';}
  document.getElementById('cathedralModelNote').textContent=derived?'Abgeleitete 0.8-Bauteilansicht: Originalmeshes und Binärdaten erhalten; Gruppen gefiltert / versetzt. Animationsspuren bewusst entfernt.':'0.8: unverändertes Original mit Spin, BreathPulse und Journey. Bewegung startet nur auf Knopfdruck.';
 }catch(e){partsStatus.textContent='Bauteilansicht fehlgeschlagen: '+e.message;}
}
function packed(m){
 if(window.A0CathedralPacked&&window.A0CathedralPacked[m.id])return Promise.resolve(window.A0CathedralPacked[m.id]);
 return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=m.file;s.onload=()=>resolve(window.A0CathedralPacked[m.id]);s.onerror=()=>reject(Error('Lokales Modellpaket nicht lesbar'));document.head.append(s);});
}
async function select(id){
 const token=++request,m=models.find(m=>m.id===id);if(!m)return;
 lifePause();lifeActive=false;lifeBusy=false;if(lifeControls)lifeControls.disabled=true;
 stop();current=m;sourceBytes=null;derived=false;if(controls)controls.disabled=true;if(download)download.hidden=true;tracks.disabled=play.disabled=true;status.textContent=m.label+' wird geladen …';
 if(part){part.value='original';explode.value='0';height.value='100';partsStatus.textContent=id==='RC08'?'Bauteile werden geladen …':'Bauteilzerlegung ist nur für das geprüfte 0.8-Modell definiert.';}
 document.getElementById('cathedralOriginal').href=m.source;
 document.getElementById('cathedralModelNote').textContent=id==='RC08'?'0.8: unverändertes Original mit Spin, BreathPulse und Journey. Bewegung startet nur auf Knopfdruck.':id==='RC88'?'8.8: unverändertes Fusion-Modell ohne eingebettete Animation. Kein BreathPulse-Transfer ausgeführt.':'Eigenständiges Originalmodell; gemeinsame Anzeige bedeutet keine Carrier-Identität.';
 try{
  const encoded=await packed(m);if(token!==request)return;
  const bytes=Uint8Array.from(atob(encoded),c=>c.charCodeAt(0));
  sourceBytes=bytes;if(controls)controls.disabled=id!=='RC08';if(lifeControls)lifeControls.disabled=id!=='RC08';
  if(id==='RC08'&&part&&window.A0CathedralParts)partsView();else display(bytes);
 }catch(e){if(token===request)status.textContent='3D-Laden fehlgeschlagen: '+e.message+'. Originaldatei über den Link öffnen.';}
}
viewer.addEventListener('load',()=>{stop();configureTracks();lifeBusy=false;if(lifeStep)lifeStep.disabled=false;lifeSchedule();});
viewer.addEventListener('error',()=>{stop();lifePause();lifeBusy=false;if(lifeStep)lifeStep.disabled=false;status.textContent='3D-Ansicht konnte nicht geladen werden. Bitte Originaldatei öffnen; WebGL und lokale Viewer-Skripte müssen verfügbar sein.';});
pick.addEventListener('change',()=>select(pick.value));
tracks.addEventListener('change',()=>{stop();viewer.animationName=tracks.value;viewer.currentTime=0;});
play.addEventListener('click',()=>{if(playing){stop();return;}viewer.play();playing=true;play.textContent='Animation pausieren';});
document.getElementById('cathedralReset').addEventListener('click',()=>{stop();viewer.currentTime=0;viewer.cameraOrbit='auto auto auto';viewer.cameraTarget='auto auto auto';viewer.fieldOfView='auto';if(part&&current?.id==='RC08'){part.value='original';partsView();}});
if(part){part.addEventListener('change',partsView);for(const slider of [explode,height])slider.addEventListener('change',()=>{if(part.value==='original')part.value='all';partsView();});}
if(lifePlay){lifePlay.addEventListener('click',()=>{if(lifeRunning){lifePause();return;}if(current?.id!=='RC08'||!sourceBytes)return;if(lifeSession&&lifeSession.frames.length>window.A0CathedralLife.LIMIT){lifeStatus.textContent='Horizont erreicht · LIFE-Reset beginnt wieder bei Generation 0.';return;}lifeRunning=true;lifePlay.textContent='Ⅱ LIFE pausieren';if(!lifeActive)lifeRender();else{lifeStatus.textContent=lifeStatus.textContent.replace('pausiert','läuft');lifeSchedule();}});lifeStep.addEventListener('click',()=>{lifePause();lifeAdvance();});lifeReset.addEventListener('click',()=>{lifePause();lifeSession=window.A0CathedralLife.start(lifePattern.value);lifeRender();});lifePattern.addEventListener('change',()=>{lifePause();lifeSession=window.A0CathedralLife.start(lifePattern.value);lifeRender();});lifeMode.addEventListener('change',()=>{lifePause();lifeRender();});}
document.addEventListener('visibilitychange',()=>{if(document.hidden){stop();lifePause();if(lifeStatus)lifeStatus.textContent=lifeStatus.textContent.replace('läuft','pausiert');}});
window.addEventListener('pagehide',()=>{stop();lifePause();if(url)URL.revokeObjectURL(url);});
if(window.customElements){customElements.whenDefined('model-viewer').then(()=>select('RC08'));}
})();

