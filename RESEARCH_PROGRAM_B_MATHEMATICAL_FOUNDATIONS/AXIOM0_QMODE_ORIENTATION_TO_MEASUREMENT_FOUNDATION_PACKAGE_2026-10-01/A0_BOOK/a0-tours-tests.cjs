'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
let checks = 0;
const check = (v,m) => { assert.ok(v,m); checks++; };
const read = f => fs.readFileSync(path.join(__dirname,f),'utf8');
const hub = read('A0_TOURS.html'), desk = read('A0_RESEARCH_DESK.html');
const nav = read('a0-context-navigation.js');
check((hub.match(/class="route" id="tour-/g)||[]).length === 6, 'six actual routes');
check((hub.match(/data-historical-html/g)||[]).length === 13, 'all thirteen retained historical HTMLs');
check(hub.includes('Vier dokumentierte Quelllücken'), 'source gaps remain explicit');
check(hub.includes('ausführbare EMP-02→A0-Adapter fehlt'), 'navigation not runtime integration');
check(desk.indexOf('id="tours"') < desk.indexOf('id="engineering-20261017"'), 'tour entry precedes engineering work');
check(desk.includes('href="A0_TOURS.html"'), 'Desk primary tour link');
const reader = desk.match(/<details class="reader-dossier" id="reader">([\s\S]*?)<\/details>/)?.[1];
check(reader?.includes('id="achievements-reader"'), '09 is in Reader dossier');
check(reader?.includes('id="scientific-position"'), '10 is in Reader dossier');
check(nav.includes('Ergebnisse & Einordnung · Reader'), 'Reader menu contains dedicated results group');
check(nav.includes('A0_TOURS.html'), 'Tour hub in shared menu');
for (const name of fs.readdirSync(__dirname).filter(f=>f.endsWith('.html'))) {
  check(nav.includes(name), 'every local HTML reachable: '+name);
}
const dynamic = new Set([
  'A0_THEORY_STORYBOARD.html#overview', 'A0_THEORY_STORYBOARD.html#scene-1',
  'A0_THEORY_STORYBOARD.html#scene-5', 'A0_THEORY_STORYBOARD.html#architecture'
]);
for (const match of hub.matchAll(/href="([^"]+)"/g)) {
  const href=decodeURIComponent(match[1]);
  const [pathname,anchor]=href.split('#');
  const file=pathname.split('?')[0];
  const target=file?path.resolve(__dirname,file):path.join(__dirname,'A0_TOURS.html');
  check(fs.existsSync(target),'link file exists: '+href);
  if(anchor&&!dynamic.has(href)) {
    const html=fs.readFileSync(target,'utf8');
    check(html.includes('id="'+anchor+'"')||html.includes("id='"+anchor+"'"),'static anchor exists: '+href);
  }
}
for(const name of ['A0_TOURS.html','A0_RESEARCH_DESK.html']){
  const ids=[...read(name).matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  check(ids.length===new Set(ids).size,'unique IDs: '+name);
}
// Exercise just the new handler, not the whole page or a claimed browser.
const handler=desk.match(/function revealReaderTarget\(\) \{([\s\S]*?)\n      \}/)?.[0];
check(handler,'Reader anchor handler present');
for(const hash of ['#reader','#achievements-reader','#scientific-position','#top','#unknown']){
  const details={open:false};let scrolled=false;
  const target=hash==='#unknown'?null:{closest:()=>hash==='#top'?null:details,scrollIntoView:()=>{scrolled=true;}};
  const context={location:{hash},document:{getElementById:()=>target}};
  vm.runInNewContext(handler+';revealReaderTarget();',context);
  check(details.open===!['#top','#unknown'].includes(hash),'Reader disclosure behavior: '+hash);
  check(scrolled===details.open,'scroll only exposed target: '+hash);
}
for(const match of desk.matchAll(/<script>([\s\S]*?)<\/script>/g)) new vm.Script(match[1]);
new vm.Script(nav);
check(!hub.includes('<iframe'),'tour menu does not load remote instrument controllers');
console.log('PASS: '+checks+' tour/navigation checks; simulated Reader deep links, no live-browser claim.');
