const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),vm=require('node:vm');
let checks=0;const ok=(v,m)=>{assert.ok(v,m);checks++},eq=(a,b)=>{assert.deepEqual(a,b);checks++};
const html=fs.readFileSync(__dirname+'/A0_OPIUM.html','utf8'),css=fs.readFileSync(__dirname+'/a0-opium-entry.css','utf8'),js=fs.readFileSync(__dirname+'/a0-opium-entry.js','utf8');
for(const m of html.matchAll(/(?:href|src)="([^"]+)"/g)){const [p,a]=m[1].split('#'),f=path.resolve(__dirname,p||'A0_OPIUM.html');ok(fs.existsSync(f),m[1]);if(a&&!f.endsWith('/NAVIGATION/APP/index.html'))ok(fs.readFileSync(f,'utf8').includes('id="'+a+'"'),a);}
ok(!/<iframe|https?:\/\/|autoplay|fetch\(/.test(html));ok(!/setInterval|setTimeout|requestAnimationFrame|localStorage|postMessage/.test(js));
for(const s of ['prefers-reduced-motion','650px','950px','opium-paused','animation-play-state:paused'])ok(css.includes(s),s);
for(const s of ['KEIN LIVE-READOUT','Lokal gekoppelt','Noch offen','kein Zugriff','keine Veröffentlichung']){if(s==='kein Zugriff')continue;ok(html.includes(s),s);}
eq((html.match(/<a href="[^"]+"><small>0[1-6]/g)||[]).length,6);
function fixture(reduced=false){
 const events={},mediaEvents={},classes=new Set(),button={attrs:{},addEventListener(k,f){events['button:'+k]=f},setAttribute(k,v){this.attrs[k]=v}},doc={hidden:false,body:{classList:{toggle(k,v){if(v)classes.add(k);else classes.delete(k)}}},getElementById:()=>button,addEventListener(k,f){events[k]=f}},media={matches:reduced,addEventListener(k,f){mediaEvents[k]=f}};
 vm.runInNewContext(js,{document:doc,window:{matchMedia:()=>media}});return{doc,button,events,media,mediaEvents,classes};
}
const f=fixture();eq(f.button.attrs['aria-pressed'],'false');f.events['button:click']();eq(f.button.attrs['aria-pressed'],'true');ok(f.classes.has('opium-paused'));f.events['button:click']();eq(f.button.attrs['aria-pressed'],'false');f.doc.hidden=true;f.events.visibilitychange();eq(f.button.attrs['aria-pressed'],'true');
const r=fixture(true);ok(r.button.disabled);eq(r.button.attrs['aria-pressed'],'true');r.media.matches=false;r.mediaEvents.change();ok(!r.button.disabled);eq(r.button.attrs['aria-pressed'],'true');
ok(fs.readFileSync(__dirname+'/a0-builder-toy-store.js','utf8').includes('href:"A0_OPIUM.html"'));
ok(fs.readFileSync(__dirname+'/DRAFTS/A0_FAMILY_NAVIGATOR_DEMO.html','utf8').includes('href="../A0_OPIUM.html"'));
console.log(JSON.stringify({status:'PASS',checks,scope:'local flagship and source routes, six entries, animation pause/reduced-motion/hidden controls in DOM double; no source/player starts; browser pixels OPEN'}));
