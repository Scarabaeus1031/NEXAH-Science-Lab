const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {entries,anchors}=require('./a0-blue-pink-map.js');
assert.equal(entries.length,10);
assert.equal(new Set(entries.map(entry=>entry.key)).size,10);
const html=fs.readFileSync(path.join(__dirname,'A0_BLUE_PINK_DODECA_CELL_RETURN.html'),'utf8');
assert.ok(html.includes('a0-blue-pink-map.js'));
assert.ok(html.includes('a0-blue-pink-map.css'));
for(const entry of entries){assert.ok(entry.text&&entry.status&&entry.color);for(const[label,href]of entry.links){assert.ok(label);const[file,hash]=href.split('#'),target=file?path.resolve(__dirname,file):path.join(__dirname,'A0_BLUE_PINK_DODECA_CELL_RETURN.html');assert.ok(fs.existsSync(target),href);if(hash)assert.ok(fs.readFileSync(target,'utf8').includes(`id="${hash}"`),href);}}
for(const projection of ['orbit','top'])for(const yaw of [-3,0,.42,3]){const points=anchors(1000,700,{projection,yaw});assert.equal(Object.keys(points).length,9);for(const point of Object.values(points))assert.ok(point.every(Number.isFinite));}
const base=anchors(1000,700,{projection:'orbit',yaw:.42});assert.deepEqual(base.blue,[160,210]);assert.deepEqual(base.pink,[840,210]);
assert.deepEqual(anchors(1000,700,{projection:'top',yaw:2}),anchors(1000,700,{projection:'top',yaw:0}));
const script=fs.readFileSync(path.join(__dirname,'a0-blue-pink-map.js'),'utf8');new vm.Script(script);
// Lightweight DOM verifies dialog relocation, lazy module opening and map restoration.
class Element{constructor(tag){this.tag=tag;this.children=[];this.events={};this.attrs={};this.style={setProperty(){}};this.clientWidth=1000;this.clientHeight=700;this.open=false;}append(...items){this.children.push(...items);}before(item){this.beforeItem=item;}after(item){this.afterItem=item;}replaceChildren(...items){this.children=items;}replaceWith(item){this.replacement=item;}setAttribute(k,v){this.attrs[k]=v;}addEventListener(k,v){this.events[k]=v;}scrollIntoView(){}focus(){this.focused=true;}showModal(){this.open=true;}close(){this.open=false;this.events.close?.();}}
const nodes={cells:new Element('section'),cellStage:new Element('div'),cellCanvas:new Element('canvas')};
const body=new Element('body'),events={},view={state:{projection:'orbit',yaw:.42,selected:48}};
vm.runInNewContext(script,{document:{body,getElementById:key=>nodes[key],createElement:tag=>new Element(tag),createComment:()=>new Element('comment'),querySelector:()=>new Element('target')},window:{A0BluePinkDodecaCellReturnView:view,addEventListener:(key,fn)=>{events[key]=fn;}},ResizeObserver:class{observe(){}}});
const actions=nodes.cellStage.beforeItem,legend=nodes.cellStage.afterItem;
assert.equal(nodes.cellStage.children.length,9,'Nine scene markers');
assert.equal(legend.children[0].textContent,'Legende · Blue. Dodeca. Pink.');
const dialogs=body.children;assert.equal(dialogs.length,2);
assert.equal(dialogs[0].children.length,0,'No module iframe loaded before user request');
actions.children[0].events.click();assert.equal(dialogs[1].open,true);assert.equal(dialogs[1].children[1],nodes.cells,'Expansion moves the original live instrument');
dialogs[1].close();assert.equal(nodes.cells.beforeItem.replacement,nodes.cells,'Closing restores original instrument');
const inspector=legend.children[1].children[1],linkButtons=inspector.children[3];
linkButtons.children[0].events.click();assert.equal(dialogs[0].open,true);assert.equal(dialogs[0].children[2].tag,'iframe');
dialogs[0].close();assert.equal(dialogs[0].children.length,0,'Closed module is unloaded');
actions.children[1].events.click();assert.ok(nodes.cellStage.children.every(marker=>marker.hidden));
events['a0-cell-selection']({detail:{selected:2}});assert.equal(inspector.children[0].textContent,'Face-Cell / Prisma-Einfall');
console.log('PASS: 10 legend entries, all source links, 9 moving markers, lazy module dialog, expanded original canvas and return');
