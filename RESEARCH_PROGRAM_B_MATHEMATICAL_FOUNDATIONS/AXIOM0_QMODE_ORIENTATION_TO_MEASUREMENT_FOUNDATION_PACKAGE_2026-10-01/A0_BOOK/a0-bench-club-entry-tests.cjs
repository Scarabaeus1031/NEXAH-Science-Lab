'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');let checks=0;
const ok=v=>{assert.ok(v);checks++;},read=p=>fs.readFileSync(path.join(__dirname,p),'utf8'),html=read('A0_ORIENTATION_CONTROLLER_BENCH.html'),club=read('DRAFTS/A0_FAMILY_NAVIGATOR_DEMO.html'),css=read('a0-bench-club-entry.css');
const nav=html.match(/<nav class="bench-nav"[\s\S]*?<\/nav>/)[0],entry=html.match(/<section class="bench-club-door"[\s\S]*?<\/section>/)[0];
ok(nav.includes('class="bench-club-entry"'));ok(nav.indexOf('class="bench-club-entry"')<nav.indexOf('<details>'));
for(const hash of ['spatial-navigation','club-deck-room','control-room']){
 const href='DRAFTS/A0_FAMILY_NAVIGATOR_DEMO.html#'+hash;
 for(const area of [nav,entry]){ok(area.includes('href="'+href+'"'));ok(!area.match(new RegExp('href="'+href+'"[^>]*(?:onclick|target=)')));}
 ok(club.includes('id="'+hash+'"'));
}
ok(club.includes('A0_ORIENTATION_CONTROLLER_BENCH.html#benchFoyer'));ok(html.includes('href="a0-bench-club-entry.css?rev=20261022"'));ok(css.includes('@media(max-width:760px)'));ok(css.includes(':focus-visible'));ok(!/onclick|iframe|<script/.test(entry));
for(const anchor of ['benchFoyer','foyerDoors','coupledWindowHub','pulseBenchMonitor','benchMap'])ok(nav.includes('href="#'+anchor+'"'));
console.log(JSON.stringify({status:'PASS',checks,scope:'native Bench-to-Club routes, visible header entry, foyer entries, target IDs and reciprocal Bench route; browser pixels open'}));
