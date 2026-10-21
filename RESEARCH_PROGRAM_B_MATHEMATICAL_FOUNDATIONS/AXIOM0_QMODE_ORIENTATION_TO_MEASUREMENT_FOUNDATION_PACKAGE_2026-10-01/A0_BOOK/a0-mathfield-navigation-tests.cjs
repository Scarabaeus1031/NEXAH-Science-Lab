const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const script=fs.readFileSync(path.join(__dirname,'a0-context-navigation.js'),'utf8');
const harness=fs.readFileSync(path.join(__dirname,'a0-compact-navigation-runtime-tests.cjs'),'utf8').split("for(const file of [")[0];
const mount=new Function('require','__dirname',harness+';return mount;')(require,__dirname);
let checks=0;const check=(v,m)=>{assert.ok(v,m);checks++;};
for(const file of ['index.html','A0_SCIENCE.html','A0_MATHEMATICAL_JOINTS.html','A0_RESEARCH_DESK.html']){
 const result=mount(file),science=result.nodes.find(n=>n.className==='a0-reader-lane a0-reader-lane--science');
 check(Boolean(science),'existing Science lane');
 const cards=result.nodes.filter(n=>n.className?.startsWith('a0-showcase-card '));
 const target=cards.find(n=>n.href==='A0_MATHEMATICAL_JOINTS.html#register-cut-aperture');
 check(Boolean(target),'actual mounted highlight');
 check(target.innerHTML.includes('Mathematische Werkstatt'),'highlight role label');
 check(result.nodes.some(n=>n.tagName==='A'&&n.href==='A0_MATHEMATICAL_JOINTS.html'&&n.innerHTML.includes('Mathfield · mathematische Werkstatt')),'actual mounted reading entry');
 check(target.getAttribute('aria-current')===(file==='A0_MATHEMATICAL_JOINTS.html'?'page':null),'active Mathfield marker');
 check(cards.some(n=>n.href==='A0_SCIENTIFIC_POSITION_REPORT.html'),'position retained');
 check(cards.some(n=>n.href==='A0_SCIENCE.html#contributions'),'contributions retained');
}
check(fs.readFileSync(path.join(__dirname,'A0_MATHEMATICAL_JOINTS.html'),'utf8').includes('id="register-cut-aperture"'),'highlight anchor exists');
check(script.includes('"key": "science"')&&script.includes('"label": "Science"'),'no unrequested renaming');
console.log(JSON.stringify({status:'PASS',checks,scope:'Actual shared navigation mounted on four pages; direct entry, highlight, target, active state and retained Science naming. Browser visual acceptance OPEN.'},null,2));
