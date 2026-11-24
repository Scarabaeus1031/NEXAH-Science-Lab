const assert=require('node:assert/strict'),fs=require('node:fs'),model=require('./a0-primecube-model.js'),dock=require('./a0-opium-primecube-dock.js');
let checks=0;const ok=(value,message)=>{assert.ok(value,message);checks++},eq=(actual,expected)=>{assert.deepEqual(actual,expected);checks++};

for(const n of [1,2,121,661,809,1001,1111]){
  const record=dock.read(n,model);
  eq(record.sourceNumber,n);ok(record.return.exact,`exact return ${n}`);eq(record.return.n,n);
}
for(const n of [0,1112,1.5,NaN]){assert.throws(()=>dock.read(n,model),RangeError);checks++;}

class Node{
  constructor(value=''){this.value=value;this.textContent='';this.attrs={};this.events={};}
  setAttribute(key,value){this.attrs[key]=value;}
  addEventListener(type,listener){this.events[type]=listener;}
}
const nodes={};for(const id of Object.values(dock.IDS))nodes[id]=new Node();nodes.opiumPrimecubeAddress.value='661';
const doc={getElementById:id=>nodes[id]},view=dock.mount(doc,model);
ok(view,'dock mounted');eq(view.snapshot(),{n:661,recordId:'PC1111:N0661',exact:true,q4Mapping:null,sourceStateTransferred:false,sharedClock:false});
eq(nodes.opiumPrimecubeBase11.textContent,'551 / 550');eq(nodes.opiumPrimecubeCube.textContent,'[0, 5, 5]');ok(nodes.opiumPrimecubeStatus.textContent.includes('Q4 mapping NONE'));
nodes.opiumPrimecubeAddress.value='1111';nodes.opiumPrimecubeRead.events.click();eq(view.snapshot().n,1111);ok(nodes.opiumPrimecubeReturn.textContent.includes('EXACT'));
nodes.opiumPrimecubeAddress.value='1112';nodes.opiumPrimecubeAddress.events.change();eq(view.snapshot().n,null);eq(nodes.opiumPrimecubeAddress.attrs['aria-invalid'],'true');ok(nodes.opiumPrimecubeStatus.textContent.startsWith('HOLD'));

const html=fs.readFileSync(__dirname+'/A0_OPIUM.html','utf8'),js=fs.readFileSync(__dirname+'/a0-opium-primecube-dock.js','utf8');
for(const token of ['id="opiumPrimecubeDock"','Primecube · Platte, Rille, Lesepunkt.','a0-primecube-model.js','a0-opium-primecube-dock.js','Q4-Player, Mixer, Club-Uhr und Q‑Cube','A0_PRIMECUBE_GAP_FOLD_LAB.html#primecube-workbench'])ok(html.includes(token),token);
ok(html.indexOf('a0-primecube-model.js')<html.indexOf('a0-opium-primecube-dock.js'),'source model loads before dock');
ok(!/fetch\(|postMessage|localStorage|sessionStorage|setInterval|setTimeout|requestAnimationFrame/.test(js),'adapter has no transport, storage or clock');
console.log(JSON.stringify({status:'PASS',checks,scope:'read-only Primecube record dock; exact retained source return; invalid HOLD; no Q4 mapping, state transfer, shared clock, transport, storage or new identity; browser pixels OPEN'}));
