const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');let checks=0;const ok=(v,m)=>{assert(v,m);checks++;};
const script=fs.readFileSync(__dirname+'/a0-cathedral-world-view.js','utf8');
async function test(kind){
 const nodes={},events={},renders=[],revoked=[],body={dataset:kind==='life'?{worldsKind:'life',stage:'rooms'}:{cathedral:'false'}},main={append(){}};let observerCallback;
 const element=id=>nodes[id]??={id,value:id==='cathedralWorldMode'?'body':'',events:{},addEventListener(k,f){this.events[k]=f;},innerHTML:'',textContent:''};
 const document={body,head:{append(){throw Error('cached model expected');}},createElement:()=>element('root'),querySelector:()=>main,getElementById:element};
 const window={A0CathedralPacked:{RC08:'Z2xURg=='},A0CathedralWorldProjection:{life:s=>s,numbers:s=>s,render(bytes,data,mode){renders.push({generation:data.generation,mode});return{bytes:new Uint8Array([1,2,3]),first:Math.max(0,data.generation-32),last:data.generation,count:1};}},addEventListener(k,f){events[k]=f;},customElements:{whenDefined:()=>Promise.resolve()}};
 class Observer{constructor(f){observerCallback=f;}observe(){}disconnect(){this.disconnected=true;}}
 vm.runInNewContext(script,{window,document,MutationObserver:Observer,Uint8Array,Blob,atob,URL:{createObjectURL:()=> 'blob:'+renders.length,revokeObjectURL:u=>revoked.push(u)}});
 const event=kind==='life'?'lifecrystal:render':'numbers:cathedral-state',frame=g=>({generation:g,rule:kind,frames:[{generation:g,points:[]}]}),flush=()=>new Promise(r=>setImmediate(r));
 events[event]({detail:frame(24)});await flush();ok(renders.length===0,'inactive view does not load/render');
 if(kind==='life')body.dataset.stage='cathedral';else{body.dataset.cathedral='true';window.GameOfNumbersView={snapshot:()=>frame(24)};}
 observerCallback();await flush();ok(renders.length===1&&renders[0].generation===24,'opens current source generation without reset');
 events[event]({detail:frame(25)});events[event]({detail:frame(26)});await flush();ok(renders.length===1,'coalesces while GLB loads');nodes.cathedralWorldModel.events.load();await flush();ok(renders.length===2&&renders[1].generation===26,'latest source snapshot wins');
 nodes.cathedralWorldModel.events.load();await flush();events[event]({detail:frame(26)});await flush();ok(renders.length===2,'identical source does not reload');
nodes.cathedralWorldMode.value='exploded';nodes.cathedralWorldMode.events.change();await flush();ok(renders.at(-1).generation===26&&renders.at(-1).mode==='exploded','body mode does not advance source');ok(nodes.cathedralWorldModel.cameraTarget==='0m 12.8m -10m'&&nodes.cathedralWorldModel.cameraOrbit==='35deg 68deg 19m','exploded camera fits history');
 events.pagehide();ok(revoked.length>=2,'generated blobs cleaned up');
}
(async()=>{await test('life');await test('numbers');ok(!/setInterval|\.step\(/.test(script),'view owns no simulation timer or world step');console.log(JSON.stringify({status:'PASS',checks,scope:'actual view adapter in DOM double with renderer stub; source following, lazy load, coalescing, camera mode and blob cleanup; no browser pixels'},null,2));})().catch(e=>{console.error(e);process.exitCode=1;});
