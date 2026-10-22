/* Local-only GLB inspection and derived view export. No source-state handoff. */
(function(root,factory){
 const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;
 else{root.A0FamilyJukeboxGLB=api;api.mount(document,root,document.currentScript?.src);}
})(typeof globalThis==='undefined'?this:globalThis,function(){
 'use strict';
 const MAX_BYTES=32*1024*1024;
 function inspect(buffer){
  if(!(buffer instanceof ArrayBuffer)||buffer.byteLength<20||buffer.byteLength>MAX_BYTES)throw Error('GLB fehlt oder ist größer als 32 MiB.');
  const v=new DataView(buffer);
  if(v.getUint32(0,true)!==0x46546c67||v.getUint32(4,true)!==2||v.getUint32(8,true)!==buffer.byteLength)throw Error('Keine vollständige GLB-2-Datei.');
  let at=12,json=null,bin=0,chunks=0;
  while(at<buffer.byteLength){
   if(at+8>buffer.byteLength)throw Error('GLB-Chunk ist abgeschnitten.');
   const size=v.getUint32(at,true),type=v.getUint32(at+4,true);at+=8;
   if(size%4||at+size>buffer.byteLength)throw Error('Ungültige Chunk-Länge.');
   if(type===0x4e4f534a){if(json||chunks!==0)throw Error('Ungültige JSON-Reihenfolge.');json=JSON.parse(new TextDecoder().decode(new Uint8Array(buffer,at,size)).trim());}
   else if(type===0x004e4942){if(bin)throw Error('Mehrere Binär-Chunks.');bin=size;}
   else throw Error('Unbekannter GLB-Chunk.');
   chunks++;at+=size;
  }
  if(!json||json.asset?.version!=='2.0')throw Error('glTF 2.0 wird benötigt.');
  const blocked=['KHR_draco_mesh_compression','EXT_meshopt_compression','KHR_texture_basisu','EXT_texture_webp'];
  if([...(json.extensionsUsed||[]),...(json.extensionsRequired||[])].some(x=>blocked.includes(x)))throw Error('Komprimierte Sonderformate bitte vorab als unkomprimierte GLB exportieren.');
  const required=json.extensionsRequired||[];
  if(required.some(x=>x!=='KHR_materials_unlit'))throw Error('Nicht unterstützte Pflicht-Erweiterung.');
  function walk(value){
   if(!value||typeof value!=='object')return;
   for(const[k,x]of Object.entries(value)){
    if(blocked.includes(k))throw Error('Komprimierte Sonderformate bitte vorab als unkomprimierte GLB exportieren.');
    if(k==='uri'&&(typeof x!=='string'||!/^data:(image\/(png|jpeg)|application\/(octet-stream|gltf-buffer));base64,[a-zA-Z0-9+/=\s]*$/.test(x)))throw Error('Externe Ressourcen gesperrt: bitte eine vollständig eingebettete GLB wählen.');
    if(typeof x==='object')walk(x);
   }
  }
  walk(json);
  if((json.nodes||[]).length>5000||(json.accessors||[]).reduce((n,a)=>n+(Number(a.count)||0),0)>4000000)throw Error('Modell überschreitet das Vorschaufenster-Budget.');
  if((json.buffers||[]).some(b=>!b.uri&&b.byteLength>bin))throw Error('Binärdaten fehlen.');
  return{json,nodes:(json.nodes||[]).length,meshes:(json.meshes||[]).length,animations:(json.animations||[]).length};
 }
 function encode(scene){
  const json={asset:{version:'2.0',generator:'A0 Family Jukebox · derived navigation view'},scene:0,scenes:[{nodes:[]}],nodes:[],meshes:[],materials:[],accessors:[],bufferViews:[],buffers:[],extensionsUsed:['KHR_materials_unlit'],extras:scene.extras};
  const floats=[],materialIds=new Map();
  function material(color){
   if(materialIds.has(color))return materialIds.get(color);
   const n=parseInt(color.slice(1),16),factor=[(n>>16&255)/255,(n>>8&255)/255,(n&255)/255,1],index=json.materials.length;
   json.materials.push({pbrMetallicRoughness:{baseColorFactor:factor,metallicFactor:0,roughnessFactor:1},doubleSided:true,extensions:{KHR_materials_unlit:{}}});materialIds.set(color,index);return index;
  }
  function geometry(name,points,color,mode,extras){
   if(!points.length)return;
   if(points.some(p=>p.length!==3||!p.every(Number.isFinite)))throw Error('Nicht-endliche Geometrie.');
   const start=floats.length;for(const p of points)floats.push(...p);
   const bounds=[0,1,2].map(i=>[Math.min(...points.map(p=>p[i])),Math.max(...points.map(p=>p[i]))]);
   const view=json.bufferViews.length,accessor=json.accessors.length,mesh=json.meshes.length,node=json.nodes.length;
   json.bufferViews.push({buffer:0,byteOffset:start*4,byteLength:points.length*12,target:34962});
   json.accessors.push({bufferView:view,componentType:5126,count:points.length,type:'VEC3',min:bounds.map(x=>x[0]),max:bounds.map(x=>x[1])});
   json.meshes.push({name,primitives:[{attributes:{POSITION:accessor},material:material(color),mode}]});
   json.nodes.push({name,mesh,extras});json.scenes[0].nodes.push(node);
  }
  const faces=[[0,2,4],[2,1,4],[1,3,4],[3,0,4],[2,0,5],[1,2,5],[3,1,5],[0,3,5]];
  for(const node of scene.nodes){
   const r=.065,vertices=[[r,0,0],[-r,0,0],[0,r,0],[0,-r,0],[0,0,r],[0,0,-r]];
   geometry(node.id,faces.flatMap(face=>face.map(i=>vertices[i].map((x,k)=>x+node.position[k]))),node.color,4,node.extras);
  }
  for(const line of scene.lines)geometry(line.id,line.points,line.color,1,line.extras);
  const binary=new Float32Array(floats);json.buffers=[{byteLength:binary.byteLength}];
  const raw=new TextEncoder().encode(JSON.stringify(json)),jsonLength=Math.ceil(raw.length/4)*4;
  const buffer=new ArrayBuffer(12+8+jsonLength+8+binary.byteLength),v=new DataView(buffer),bytes=new Uint8Array(buffer);
  v.setUint32(0,0x46546c67,true);v.setUint32(4,2,true);v.setUint32(8,buffer.byteLength,true);
  v.setUint32(12,jsonLength,true);v.setUint32(16,0x4e4f534a,true);bytes.fill(32,20,20+jsonLength);bytes.set(raw,20);
  v.setUint32(20+jsonLength,binary.byteLength,true);v.setUint32(24+jsonLength,0x004e4942,true);
  for(let i=0;i<floats.length;i++)v.setFloat32(28+jsonLength+i*4,floats[i],true);
  return buffer;
 }
 function mount(doc,win,scriptURL){
  const panel=doc.getElementById('jukeboxGLB');if(!panel)return null;
  const el=id=>doc.getElementById(id),stage=el('jukeboxGLBStage'),status=el('jukeboxGLBStatus'),download=el('jukeboxGLBDownload');
  let viewer=null,url=null,request=0,library=null;
  const libraryURL=new URL('assets/vendor/a0-model-viewer-classic.js',scriptURL||doc.baseURI).href;
  function ensureLibrary(){
   if(win.customElements?.get('model-viewer'))return Promise.resolve();
   if(!library)library=new Promise((resolve,reject)=>{
    const s=doc.createElement('script'),timer=win.setTimeout(()=>reject(Error('Viewerbibliothek nicht bereit.')),15000);
    s.src=libraryURL;s.onload=()=>{win.clearTimeout(timer);win.customElements?.get('model-viewer')?resolve():reject(Error('WebGL-Viewer nicht verfügbar.'));};
    s.onerror=()=>{win.clearTimeout(timer);reject(Error('Lokale Viewerbibliothek nicht geladen.'));};doc.head.append(s);
   }).catch(error=>{library=null;throw error;});return library;
  }
  function dispose(){
   viewer?.pause?.();viewer?.remove();viewer=null;
   if(url)win.URL.revokeObjectURL(url);url=null;download.removeAttribute('href');download.hidden=true;el('jukeboxGLBPlay').disabled=true;el('jukeboxGLBPlay').textContent='Animation starten';
  }
  async function show(buffer,name,label,token){
   const info=inspect(buffer);await ensureLibrary();if(token!==request)return;
   dispose();url=win.URL.createObjectURL(new win.Blob([buffer],{type:'model/gltf-binary'}));
   const v=doc.createElement('model-viewer');viewer=v;v.setAttribute('camera-controls','');v.setAttribute('touch-action','pan-y');
   v.setAttribute('environment-image','neutral');v.setAttribute('alt',label+' · '+name);v.setAttribute('loading','eager');
   v.addEventListener('load',()=>{if(token!==request)return;status.textContent=label+' · '+name+' · '+info.nodes+' Nodes / '+info.meshes+' Meshes · '+info.animations+' Animationsspuren. Kein State-Transfer.';el('jukeboxGLBPlay').disabled=!(v.availableAnimations||[]).length;});
   v.addEventListener('error',()=>{if(token!==request)return;status.textContent='HOLD · Modell konnte nicht gerendert werden. Kein Source-State übernommen.';});
   stage.append(v);v.src=url;download.href=url;download.download=name;download.hidden=false;
   status.textContent=label+' · wird gerendert …';return info;
  }
  async function loadFile(file){
   const token=++request;if(!file)return;
   status.textContent='Lokale Datei prüfen …';
   try{
    if(!/\.glb$/i.test(file.name)||file.size>MAX_BYTES)throw Error('Bitte eine GLB bis 32 MiB auswählen.');
    const bytes=await file.arrayBuffer();if(token!==request)return;
    await show(bytes,file.name,'LOKALE DATEI · nicht an Families gebunden',token);
   }catch(error){if(token===request)status.textContent='HOLD · '+error.message;}
  }
  el('jukeboxGLBFile').onchange=event=>{loadFile(event.target.files?.[0]);event.target.value='';};
  el('jukeboxGLBBuild').onclick=async()=>{
   const token=++request;
   try{const scene=win.A0FamilySpatialReader?.scene();if(!scene)throw Error('Raumkarte noch nicht bereit.');status.textContent='Ansicht als GLB aufbauen …';await show(encode(scene),'family-jukebox-'+scene.extras.layout+'.glb','ABGELEITETE ATLAS-ANSICHT',token);}
   catch(error){if(token===request)status.textContent='HOLD · '+error.message;}
  };
  el('jukeboxGLBClear').onclick=()=>{request++;dispose();status.textContent='Fenster geleert · lokale Datei nicht verändert.';};
  el('jukeboxGLBReset').onclick=()=>{if(viewer){viewer.cameraTarget='auto auto auto';viewer.cameraOrbit='0deg 75deg 105%';viewer.fieldOfView='auto';}};
  el('jukeboxGLBPlay').onclick=()=>{if(!viewer)return;if(viewer.paused){viewer.play();el('jukeboxGLBPlay').textContent='Animation pausieren';}else{viewer.pause();el('jukeboxGLBPlay').textContent='Animation starten';}};
  doc.addEventListener('visibilitychange',()=>{if(doc.hidden){viewer?.pause?.();el('jukeboxGLBPlay').textContent='Animation starten';}});
  win.addEventListener('pagehide',()=>{request++;dispose();});
  return{loadFile,clear:()=>{request++;dispose();}};
 }
 return{MAX_BYTES,inspect,encode,mount};
});
