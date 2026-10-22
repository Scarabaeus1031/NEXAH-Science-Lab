const assert=require('node:assert/strict'),fs=require('node:fs');
const api=require('./a0-family-jukebox-glb.js');
let checks=0;const ok=(x,m)=>{assert.ok(x,m);checks++;},eq=(a,b)=>{assert.deepEqual(a,b);checks++;},reject=(fn,pattern)=>{assert.throws(fn,pattern);checks++;};
function pack(json){
 const text=Buffer.from(JSON.stringify(json)),size=Math.ceil(text.length/4)*4,buffer=new ArrayBuffer(20+size),v=new DataView(buffer),bytes=new Uint8Array(buffer);
 v.setUint32(0,0x46546c67,true);v.setUint32(4,2,true);v.setUint32(8,buffer.byteLength,true);v.setUint32(12,size,true);v.setUint32(16,0x4e4f534a,true);
 bytes.fill(32,20);bytes.set(text,20);return buffer;
}
const scene={nodes:[{id:'F1@ζ',position:[0,1,0],color:'#54d7ef',extras:{family:'F1',reading_position:'zeta'}}],lines:[{id:'open',color:'#ed7777',points:[[0,0,0],[1,0,0]],extras:{status:'open'}}],extras:{scope:'test-view',layout:'cylinder',engine_state_transfer:false}};
const buffer=api.encode(scene),parsed=api.inspect(buffer);eq(parsed.nodes,2);eq(parsed.meshes,2);eq(parsed.animations,0);eq(parsed.json.extras.engine_state_transfer,false);
const v=new DataView(buffer),jsonBytes=v.getUint32(12,true),binStart=28+jsonBytes,binSize=v.getUint32(20+jsonBytes,true);
eq(binSize,parsed.json.buffers[0].byteLength);eq(buffer.byteLength,binStart+binSize);
for(const mesh of parsed.json.meshes){
 const primitive=mesh.primitives[0],accessor=parsed.json.accessors[primitive.attributes.POSITION],view=parsed.json.bufferViews[accessor.bufferView];
 eq(view.byteLength,accessor.count*12);ok(view.byteOffset+view.byteLength<=binSize);
 ok(primitive.mode===4?accessor.count%3===0:accessor.count%2===0);
 const values=Array.from({length:accessor.count},(_,n)=>[0,1,2].map(i=>v.getFloat32(binStart+view.byteOffset+n*12+i*4,true)));
 for(let i=0;i<3;i++){ok(Math.abs(Math.min(...values.map(p=>p[i]))-accessor.min[i])<1e-6);ok(Math.abs(Math.max(...values.map(p=>p[i]))-accessor.max[i])<1e-6);}
}
reject(()=>api.inspect(new ArrayBuffer(8)),/fehlt/);reject(()=>api.inspect(new ArrayBuffer(api.MAX_BYTES+1)),/32/);
for(const uri of ['https://example.invalid/model.bin','file:///secret','../model.bin','javascript:bad','data:text/html;base64,WA==']){
 reject(()=>api.inspect(pack({asset:{version:'2.0'},buffers:[{uri,byteLength:1}]})),/Externe/);
}
eq(api.inspect(pack({asset:{version:'2.0'},images:[{uri:'data:image/png;base64,AA=='}]})).nodes,0);
for(const key of ['KHR_draco_mesh_compression','EXT_meshopt_compression','KHR_texture_basisu']){
 reject(()=>api.inspect(pack({asset:{version:'2.0'},extensionsUsed:[key]})),/Komprimierte/);
 reject(()=>api.inspect(pack({asset:{version:'2.0'},meshes:[{extensions:{[key]:{}}}]})),/Komprimierte/);
}
reject(()=>api.inspect(pack({asset:{version:'2.0'},extensionsRequired:['unknown']})),/Pflicht/);
reject(()=>api.inspect(pack({asset:{version:'2.0'},buffers:[{byteLength:5}]})),/Binärdaten/);
reject(()=>api.inspect(pack({asset:{version:'1.0'}})),/glTF/);
reject(()=>api.inspect(pack({asset:{version:'2.0'},nodes:Array.from({length:5001},()=>({}))})),/Budget/);
const bad=buffer.slice(0);new DataView(bad).setUint32(8,15,true);reject(()=>api.inspect(bad),/vollständige/);
function harness(){
 const ids=['jukeboxGLB','jukeboxGLBStage','jukeboxGLBStatus','jukeboxGLBDownload','jukeboxGLBPlay','jukeboxGLBFile','jukeboxGLBBuild','jukeboxGLBClear','jukeboxGLBReset'],els={},listeners={},revoked=[],created=[];
 function element(tag){return{tag,attrs:{},listeners:{},children:[],hidden:false,paused:true,availableAnimations:[],setAttribute(k,v){this.attrs[k]=v;},removeAttribute(k){delete this.attrs[k];delete this[k];},addEventListener(k,f){this.listeners[k]=f;},append(child){this.children.push(child);child.parent=this;},remove(){if(this.parent)this.parent.children=this.parent.children.filter(x=>x!==this);},pause(){this.paused=true;},play(){this.paused=false;}};}
 for(const id of ids)els[id]=element(id);
 const doc={getElementById:id=>els[id],createElement:element,addEventListener:(k,f)=>listeners[k]=f,head:element('head'),baseURI:'file:///test/DRAFTS/demo.html'};
 const win={customElements:{get:()=>true},URL:{createObjectURL:blob=>{const url='blob:local-'+created.length;created.push({url,blob});return url;},revokeObjectURL:url=>revoked.push(url)},Blob,addEventListener:(k,f)=>listeners[k]=f,A0FamilySpatialReader:{scene:()=>scene}};
 return{doc,win,els,listeners,created,revoked,mounted:api.mount(doc,win,'file:///test/a0-family-jukebox-glb.js')};
}
(async()=>{
 const h=harness();eq(h.created.length,0);
 await h.mounted.loadFile({name:'one.glb',size:buffer.byteLength,arrayBuffer:async()=>buffer});
 eq(h.created.length,1);eq(h.els.jukeboxGLBStage.children.length,1);ok(!h.els.jukeboxGLBDownload.hidden);
 const first=h.els.jukeboxGLBStage.children[0];eq(first.attrs['camera-controls'],'');ok(!first.attrs.autoplay);ok(!first.attrs.ar);
 first.listeners.load();ok(h.els.jukeboxGLBStatus.textContent.includes('LOKALE DATEI'));ok(h.els.jukeboxGLBPlay.disabled);
 await h.mounted.loadFile({name:'bad.glb',size:100,arrayBuffer:async()=>new ArrayBuffer(3)});
 eq(h.created.length,1);ok(h.els.jukeboxGLBStatus.textContent.includes('HOLD'));
 await h.mounted.loadFile({name:'two.glb',size:buffer.byteLength,arrayBuffer:async()=>buffer});
 eq(h.created.length,2);eq(h.revoked,['blob:local-0']);eq(h.els.jukeboxGLBStage.children.length,1);
 const second=h.els.jukeboxGLBStage.children[0];second.availableAnimations=['track'];second.listeners.load();
 ok(!h.els.jukeboxGLBPlay.disabled);h.els.jukeboxGLBPlay.onclick();ok(!second.paused);
 h.doc.hidden=true;h.listeners.visibilitychange();ok(second.paused);
 let resolve;const pending=h.mounted.loadFile({name:'late.glb',size:buffer.byteLength,arrayBuffer:()=>new Promise(r=>resolve=r)});
 h.els.jukeboxGLBClear.onclick();resolve(buffer);await pending;
 eq(h.created.length,2);eq(h.els.jukeboxGLBStage.children.length,0);ok(h.els.jukeboxGLBDownload.hidden);
 await h.els.jukeboxGLBBuild.onclick();eq(h.created.length,3);eq(h.els.jukeboxGLBDownload.download,'family-jukebox-cylinder.glb');
 h.listeners.pagehide();eq(h.revoked.length,3);
 const r=harness();let finish;
 const stale=r.mounted.loadFile({name:'old.glb',size:buffer.byteLength,arrayBuffer:()=>new Promise(resolve=>finish=resolve)});
 await r.mounted.loadFile({name:'latest.glb',size:buffer.byteLength,arrayBuffer:async()=>buffer});finish(buffer);await stale;
 eq(r.created.length,1);eq(r.els.jukeboxGLBDownload.download,'latest.glb');
 const source=fs.readFileSync(__dirname+'/a0-family-jukebox-glb.js','utf8');
 ok(!/fetch\(|XMLHttpRequest|localStorage|https?:\/\//.test(source));
 console.log(JSON.stringify({status:'PASS',checks,scope:'GLB-2 binary bounds; exact scene export; local import, budget/resource rejection, replace, stale requests, cleanup, explicit animation; WebGL pixels OPEN'}));
})().catch(e=>{console.error(e);process.exitCode=1});
