const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict'),preview=require('./a0-spatial-deck-preview.js');
let checks=0;const eq=(a,b)=>{assert.deepEqual(a,b);checks++;},ok=(x,m)=>{assert.ok(x,m);checks++;};
class El{constructor(){this.children=[];this.attrs={};this.dataset={};this.parent=null;}setAttribute(k,v){this.attrs[k]=v;}append(n){if(n.parent)n.parent.children=n.parent.children.filter(x=>x!==n);this.children.push(n);n.parent=this;}querySelectorAll(){return this.children;}}
const nodes={};for(const id of ['platterRotor','wheelSvg','spatialFlat','spatialSpace','spatialSplit','spatialStatus'])nodes[id]=new El();nodes.platterRotor.append(nodes.wheelSvg);
let clicks=0;const sectors=Array.from({length:48},(_,i)=>{const n=new El();n.dataset={layer:String(Math.floor(i/16)),address:String(i%16)};n.onclick=()=>clicks++;nodes.wheelSvg.append(n);return n;});
const body=new El(),doc={body,getElementById:id=>nodes[id],createElementNS:()=>new El()},state={address:3,layer:1,running:false},before=JSON.stringify(state);
const view=preview.mount(doc,{});ok(view);eq(nodes.platterRotor.children.length,3);eq(nodes.platterRotor.children.map(s=>s.children.length),[16,16,16]);eq(nodes.wheelSvg.attrs['data-slice'],'0');
eq(view.snapshot(),{spatial:false,opened:false,sourceStateTransferred:false,glbExport:false});ok(nodes.spatialSplit.disabled);
nodes.spatialSpace.onclick();eq(body.attrs['data-deck-view'],'spatial');ok(!nodes.spatialSplit.disabled);nodes.spatialSplit.onclick();eq(body.attrs['data-slices-open'],'true');ok(view.snapshot().opened);
for(const plane of nodes.platterRotor.children)for(const sector of plane.children){ok(sectors.includes(sector));sector.onclick();}eq(clicks,48);eq(JSON.stringify(state),before);
nodes.spatialFlat.onclick();eq(view.snapshot().spatial,false);eq(view.snapshot().opened,false);ok(nodes.spatialSplit.disabled);eq(nodes.platterRotor.children.flatMap(s=>s.children).length,48);
const source=fs.readFileSync(__dirname+'/A0_CURSOR_HANDOFF_CLICKDUMMY.html','utf8'),draft=fs.readFileSync(__dirname+'/DRAFTS/A0_SPATIAL_DECK_DEMO.html','utf8');
const engines=s=>[...s.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map(m=>m[1]).filter(s=>s.trim()).map(s=>crypto.createHash('sha256').update(s).digest('hex'));
eq(engines(draft),engines(source));ok(draft.includes('../a0-spatial-deck-preview.js'));ok(draft.includes('Zum Originaldeck'));ok(!source.includes('a0-spatial-deck-preview'));
const toolsAt=draft.indexOf('<section class="spatial-preview-tools"'),playerAt=draft.indexOf('<div class="platter-zone">'),regulatorsAt=draft.indexOf('<section class="deck" aria-label="Player mit getrennten Reglern">');ok(playerAt<toolsAt);ok(toolsAt<regulatorsAt);eq((draft.match(/id="spatialFlat"/g)||[]).length,1);ok(draft.includes('class="spatial-player-column"'));ok(draft.includes('ENTDECKEN · ANSICHT'));
for(const m of draft.matchAll(/(?:src|href)="([^"]+)"/g)){const target=m[1].split(/[?#]/)[0];if(target&&!/^(?:https?:|data:)/.test(target))ok(fs.existsSync(require('node:path').resolve(__dirname,'DRAFTS',target)),'existing draft asset '+target);}
const js=fs.readFileSync(__dirname+'/a0-spatial-deck-preview.js','utf8');ok(!/A0CursorHandoff|localStorage|postMessage|setInterval|fetch\(|setRunning|\.play\(/.test(js));
console.log(JSON.stringify({status:'PASS',checks,scope:'copied inline engine identical; existing 48 nodes and handlers moved intact; view-only toggles, reset and local assets; browser CSS-3D/picking OPEN'}));
