'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const model=require('./a0-theory-storyboard.js');
const html=fs.readFileSync(path.join(__dirname,'A0_THEORY_STORYBOARD.html'),'utf8');
let checks=0;function check(value,message){assert.ok(value,message);checks++;}
check(model.scenes.length===7,'seven scenes');
for(let i=0;i<7;i++){
  const s=model.scenes[i];
  for(const field of ['title','idea','built','open','href','relation','caption','control'])check(Boolean(s[field]),field);
  for(const width of [260,320,480,700,1100])for(const value of [0,25,50,75,100,NaN]){
    const result=model.drawing(i,value,width,420);
    check(!/NaN|undefined|Infinity/.test(result),'finite drawing');
    check(result.includes('<')&&result.length>200,'nonempty scene');
  }
  check(new Set([0,50,100].map(v=>model.drawing(i,v))).size>1,'slider changes diagram');
}
class Element{
  constructor(id){this.id=id;this.hidden=false;this.value='50';this.style={};this.handlers={};this.attributes={};this.textContent='';this.innerHTML='';this.tagName='DIV';}
  addEventListener(type,fn){this.handlers[type]=fn;}
  setAttribute(key,value){this.attributes[key]=value;}
  querySelectorAll(selector){
    if(selector!=='[data-layer]')throw Error('unexpected selector '+selector);
    if(!this.children)this.children=[...this.innerHTML.matchAll(/data-layer="([^"]+)"/g)].map(m=>{const child=new Element(m[1]);child.dataset={layer:m[1]};return child;});
    return this.children;
  }
  getBoundingClientRect(){return{width:360};}
  focus(){this.focused=true;}
  emit(type,event={}){this.handlers[type]({target:this,preventDefault(){},...event});}
}
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]),elements=Object.fromEntries(ids.map(id=>[id,new Element(id)]));
const doc={getElementById(id){assert.ok(elements[id],'existing queried element '+id);return elements[id];}};
const events={},win={location:{hash:''},history:{replaceState(a,b,hash){win.location.hash=hash;}},addEventListener(type,fn){events[type]=fn;}};
const ui=model.mount(doc,win);
check(ui.snapshot.scene===-1&&!elements.overview.hidden&&elements.scene.hidden,'overview is initial view');
check((elements.sceneCards.innerHTML.match(/data-scene=/g)||[]).length===7,'seven native cards');
for(let i=0;i<7;i++){
  elements.sceneCards.emit('click',{target:{closest(){return{dataset:{scene:String(i)}};}}});
  check(ui.snapshot.scene===i&&!elements.scene.hidden&&elements.overview.hidden,'card opens scene');
  check(elements.sceneTitle.textContent===model.scenes[i].title,'correct title');
  check(elements.instrumentLink.attributes.href===model.scenes[i].href,'correct instrument');
  check(elements.sceneTitle.focused,'focus transferred');
  const before=elements.sceneSvg.innerHTML;
  elements.moment.emit('input',{target:{value:100}});
  check(elements.sceneSvg.innerHTML!==before&&ui.snapshot.value===100,'actual input changes diagram');
}
elements.next.emit('click');check(ui.snapshot.scene===-1,'last step returns to overview');
ui.show(0);elements.previous.emit('click');check(ui.snapshot.scene===0,'previous bounded at first scene');
elements.next.emit('click');check(ui.snapshot.scene===1,'next works');
elements.previous.emit('click');check(ui.snapshot.scene===0,'previous works');
win.location.hash='#scene-7';events.hashchange();check(ui.snapshot.scene===6,'deep link works');
win.location.hash='#scene-99';events.hashchange();check(ui.snapshot.scene===-1,'invalid route fails to overview');
ui.show(2);elements.storyboard.emit('keydown',{target:{tagName:'INPUT'},key:'ArrowRight'});check(ui.snapshot.scene===2,'slider keyboard not intercepted');
elements.storyboard.emit('keydown',{target:{tagName:'DIV'},key:'Escape'});check(ui.snapshot.scene===-1,'escape overview');
check(model.drawing(6,0).includes('Restfehler: 3')&&model.drawing(6,100).includes('MIT d'),'return distinction visible');
for(const v of [0,25,50,75,100]){const r=model.returnExample(v);check(Math.abs(r.a-r.aReturn)===r.residual&&Math.abs(r.b-r.bReturn)===r.residual,'computed return error');}
check(model.layers.length===4&&model.layers[3].number==='+1','three areas plus one');
check(new Set(model.layers.map(layer=>layer.id)).size===4,'unique local groups');
for(let i=0;i<7;i++)check(model.layersForScene(i).includes('return'),'return crosses every scene');
for(const layer of model.layers){
  check(layer.scenes.every(i=>i>=0&&i<7)&&new Set(layer.scenes).size===layer.scenes.length,'valid scene mapping');
  ui.showArchitecture(layer.id);
  check(ui.snapshot.view==='architecture'&&!elements.architecture.hidden&&elements.scene.hidden&&elements.overview.hidden,'architecture visibility');
  check(elements.layerTitle.textContent===layer.title,'selected layer details');
  check(elements.layerRoute.innerHTML.includes(layer.route[0][0]),'relation route present');
  check((elements.layerScenes.innerHTML.match(/data-scene=/g)||[]).length===layer.scenes.length,'correct scene buttons');
  check(elements.architectureMap.querySelectorAll('[data-layer]').filter(b=>b.attributes['aria-pressed']==='true').length===1,'one selected native control');
}
const prior=ui.snapshot.selectedLayer;check(ui.showArchitecture('unknown')===false&&ui.snapshot.selectedLayer===prior,'unknown group rejected');
elements.architectureMap.emit('click',{target:{closest(){return{dataset:{layer:'visibility'}};}}});
check(ui.snapshot.selectedLayer==='visibility'&&elements.layerTitle.textContent==='Sichtbarkeit','actual map click changes explanation');
elements.layerScenes.emit('click',{target:{closest(){return{dataset:{scene:'4'}};}}});
check(ui.snapshot.scene===4&&ui.snapshot.view==='scene','layer scene navigation');
check(elements.sceneLayers.innerHTML.includes('data-layer="visibility"')&&elements.sceneLayers.innerHTML.includes('data-layer="return"'),'scene shows cross-layer links');
elements.moment.emit('input',{target:{value:77}});
elements.toArchitecture.emit('click');check(ui.snapshot.view==='architecture','scene back to architecture');
elements.layerScenes.emit('click',{target:{closest(){return{dataset:{scene:'4'}};}}});
check(ui.snapshot.value===77&&elements.moment.value==='77','scene moment survives view change');
elements.viewArchitecture.emit('click');check(elements.viewArchitecture.attributes['aria-pressed']==='true','architecture switch state');
for(const v of [0,25,50,75,100]){
  elements.returnDifference.emit('input',{target:{value:v}});
  check(Number(elements.returnError.textContent)===model.returnExample(v).residual,'live register computes actual error');
  check(ui.snapshot.returnValue===v&&elements.returnDifferenceValue.textContent===v+' %','live register slider state');
}
elements.returnDifference.emit('input',{target:{value:0}});
check(elements.returnExplanation.textContent.includes('4/6'),'lost difference ambiguity explained');
win.location.hash='#layer-coupling';events.hashchange();check(ui.snapshot.selectedLayer==='coupling'&&ui.snapshot.view==='architecture','deep link group');
win.location.hash='#sources';events.hashchange();check(ui.snapshot.view==='architecture','source anchor does not silently change view');
win.location.hash='#architecture';events.hashchange();check(ui.snapshot.view==='architecture','architecture root route');
elements.viewOverview.emit('click');check(ui.snapshot.view==='overview'&&elements.architecture.hidden,'overview switch works');
function linkExists(href){
  const [p,anchor]=href.split('#'),target=p?path.resolve(__dirname,decodeURIComponent(p.split('?')[0])):path.join(__dirname,'A0_THEORY_STORYBOARD.html');
  check(fs.existsSync(target),'link exists '+href);
  if(anchor&&target.endsWith('.html'))check(fs.readFileSync(target,'utf8').includes('id="'+anchor+'"'),'anchor exists '+href);
}
for(const m of html.matchAll(/(?:href|src)="([^"]+)"/g))linkExists(m[1]);
for(const s of model.scenes)linkExists(s.href);
check(!/setInterval|requestAnimationFrame|fetch\(|localStorage/.test(fs.readFileSync(path.join(__dirname,'a0-theory-storyboard.js'),'utf8')),'no timer, network or shared storage');
console.log('PASS · '+checks+' checks · seven scenes, 3+1 map, local Return register, simulated UI, routes, links; no live-browser claim.');
if(process.argv.includes('--preview')){
  const sharp=require('/Users/tho2020/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
  let svg='<svg xmlns="http://www.w3.org/2000/svg" width="1040" height="1420"><rect width="1040" height="1420" fill="#061820"/>';
  model.scenes.forEach((s,i)=>{const x=(i%2)*520,y=Math.floor(i/2)*350;svg+='<g transform="translate('+x+' '+y+')"><text x="22" y="30" fill="#e7eff0" font-size="20" font-family="sans-serif">'+(i+1)+' · '+s.title.replace(/&/g,'&amp;')+'</text><g transform="translate(0 38)">'+model.drawing(i,50,520,300)+'</g></g>';});
  svg+='</svg>';sharp(Buffer.from(svg)).png().toFile('/private/tmp/a0-storyboard-scenes.png').then(()=>console.log('Renderer preview: /private/tmp/a0-storyboard-scenes.png')).catch(e=>{console.error(e);process.exitCode=1;});
}
