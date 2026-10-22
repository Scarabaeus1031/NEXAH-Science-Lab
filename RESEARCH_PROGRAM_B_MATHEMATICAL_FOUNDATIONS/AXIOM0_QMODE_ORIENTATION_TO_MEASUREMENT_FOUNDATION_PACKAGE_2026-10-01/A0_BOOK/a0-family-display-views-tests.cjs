const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const player=require('./a0-family-record-player.js');let checks=0;
const ok=(v,m)=>{assert.ok(v,m);checks++;},eq=(a,b)=>{assert.deepEqual(a,b);checks++;};
const src=fs.readFileSync(__dirname+'/assets/a0-black-sun-big-moon-v1.js','utf8'),html=fs.readFileSync(__dirname+'/A0_FAMILY_CONNECTION_ATLAS.html','utf8');
// Loading the original feature on the Atlas must not mount its three-canvas engine.
let frames=0;const sandbox={window:{document:{getElementById:()=>null},devicePixelRatio:1},requestAnimationFrame:()=>frames++};
vm.runInNewContext(src,sandbox);eq(frames,0);const original=sandbox.A0BlackSunBigMoon;ok(original.renderPreview);
const commands=[];const gradient={addColorStop:(...args)=>commands.push(['stop',...args])};
const context=new Proxy({createRadialGradient:()=>gradient,createLinearGradient:()=>gradient},{get:(o,k)=>o[k]||((...args)=>{for(const value of args)if(typeof value==='number')ok(Number.isFinite(value),'finite '+k);commands.push([k,...args]);})});
function canvas(key){return{dataset:{frpNeonPreview:key},getContext:()=>context,getBoundingClientRect:()=>({width:260,height:240})};}
const canvases=['low','window','high'].map(canvas),captions=Object.fromEntries(canvases.map(c=>[c.dataset.frpNeonPreview,{}])),mirror=canvas();
const host={querySelectorAll:()=>canvases,querySelector:s=>s==='[data-frp-mirror-preview]'?mirror:captions[s.match(/="([^"]+)"/)[1]]};
ok(player.drawEclipse(host,'operator',{A0BlackSunBigMoon:original}));eq(frames,0);
for(const c of canvases){const key=c.dataset.frpNeonPreview,def=original.STATES[key],r=original.operatorReadout(def.value);ok(captions[key].textContent.includes(def.label));ok(captions[key].textContent.includes(r.retained+'% retained'));eq(c.width,260);eq(c.height,240);}
ok(commands.some(c=>c[0]==='lineTo'));ok(commands.some(c=>c[0]==='arc'));
ok(player.drawEclipse(host,'mirror',{A0BlackSunBigMoon:original}));eq(frames,0);ok(commands.some(c=>c[0]==='bezierCurveTo'));ok(commands.some(c=>c[0]==='ellipse'));
ok(!original.renderPreview(null));ok(!original.renderPreview(mirror,'unknown'));ok(!player.drawEclipse(host,'operator',{}));
eq((player.eclipseMarkup('operator').match(/data-frp-neon-preview=/g)||[]).length,3);
ok(player.eclipseMarkup('mirror').includes('data-frp-mirror-preview'));ok(!player.eclipseMarkup('mirror').includes('data-frp-neon-preview='));
ok(html.indexOf('src="assets/a0-black-sun-big-moon-v1.js')<html.indexOf('src="a0-family-record-player.js'));
ok(html.includes('a0-family-display-views.css'));ok(!/setInterval|setTimeout|requestAnimationFrame/.test(src.slice(src.indexOf('function renderPreview'),src.indexOf('return{STATES'))));
console.log(JSON.stringify({status:'PASS',checks,scope:'actual source renderer at t=0, finite drawing commands, exact source readouts, no engine mount or preview clock; browser pixels OPEN'}));
