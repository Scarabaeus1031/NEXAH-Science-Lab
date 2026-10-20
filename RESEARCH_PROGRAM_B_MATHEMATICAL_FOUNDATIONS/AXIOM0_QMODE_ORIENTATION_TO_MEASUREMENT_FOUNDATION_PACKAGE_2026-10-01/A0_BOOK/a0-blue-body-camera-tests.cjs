const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('A0_TESSAREC_BLUE_BODY_LAB.html','utf8');
const guide=fs.readFileSync('a0-source-seam-guided-test.js','utf8');
const block=html.slice(html.indexOf("    const rotationButton="),html.indexOf("    const rotate=p=>"));
assert.ok(block.includes('function setRotation')&&block.includes('function nudgeCamera'));
let checks=0;
const ok=(value,message)=>{checks++;assert.ok(value,message);};
function mount(reduced=false){
 const controls=new Map(),nudges=[];
 function el(id){if(!controls.has(id))controls.set(id,{textContent:'',attrs:{},listeners:{},setAttribute(k,v){this.attrs[k]=v},addEventListener(k,fn){this.listeners[k]=fn}});return controls.get(id);}
 for(const value of ['-0.261799,0','0.261799,0','0,-0.174533','0,0.174533'])nudges.push({...el(value),dataset:{cameraNudge:value}});
 const context={document:{getElementById:el,querySelectorAll:()=>nudges},window:{A0SourceSeamGuidedTestView:{stop(){context.stops++}}},stops:0,draws:0,reduced};
 vm.createContext(context);
 vm.runInContext("const reducedMotion=reduced;let rx=-.16,ry=.46,viewMode='orbit';function draw(){draws++}function setView(mode){viewMode=mode;rx=-.16;ry=.46;syncRotation()};"+block+";this.api={setRotation,nudgeCamera,state:()=>({rx,ry,rotationEnabled,rotationRate,viewMode})};",context);
 return{context,controls,nudges,api:context.api};
}
const f=mount();ok(f.api.state().rotationEnabled,'normal rotation initially enabled');
f.api.setRotation(true,.00045);ok(f.api.state().rotationRate===.00045,'tour uses visible camera speed');
f.controls.get('blueRotationToggle').listeners.click();ok(!f.api.state().rotationEnabled,'button pauses');
ok(f.context.stops===1,'manual camera button stops tour');
f.nudges[1].listeners.click();ok(f.api.state().ry>.46,'right button turns camera');
ok(!f.api.state().rotationEnabled,'manual turn stays stopped');
f.api.nudgeCamera(0,10);ok(f.api.state().rx===1.3,'pitch is bounded');
f.controls.get('blueCameraReset').listeners.click();ok(f.api.state().rx===-.16&&f.api.state().ry===.46,'start view restored');
const r=mount(true);ok(!r.api.state().rotationEnabled,'reduced motion disables automatic rotation');
ok(r.api.setRotation(true)===false,'tour respects reduced motion');
r.nudges[0].listeners.click();ok(r.api.state().ry<.46,'manual steps work with reduced motion');
ok(guide.includes("selectView('orbit')")&&guide.includes('setRotation(true,.00045)'),'tour demonstrates actual spatial view');
ok(guide.includes("click('#bodyPlayerPlay')"),'tour plays existing body sequencer');
ok(guide.includes("closest?.('[data-body-camera-controls]')"),'manual camera takeover avoids pre-click toggle race');
ok(!block.includes('stateRange')&&!block.includes('dispatch('),'camera controls do not mutate carrier or native source');
for(const id of ['blueRotationToggle','blueRotationNote','blueCameraReset'])ok(html.includes('id="'+id+'"'),'visible camera control '+id);
console.log(JSON.stringify({status:'PASS',checks,scope:'camera controller extracted from actual HTML; mocked controls, no browser pixels'}));
