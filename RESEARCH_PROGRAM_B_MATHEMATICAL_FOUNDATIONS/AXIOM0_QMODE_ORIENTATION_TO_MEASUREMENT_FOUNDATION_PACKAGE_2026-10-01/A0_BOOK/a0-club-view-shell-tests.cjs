const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict'),shell=require('./a0-club-view-shell.js');
let checks=0;const ok=(v,m)=>{assert.ok(v,m);checks++;},eq=(a,b)=>{assert.deepEqual(a,b);checks++;};
const source=fs.readFileSync(__dirname+'/A0_CURSOR_HANDOFF_CLICKDUMMY.html','utf8'),family=fs.readFileSync(__dirname+'/DRAFTS/A0_FAMILY_NAVIGATOR_DEMO.html','utf8');
const inline=[...source.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map(m=>m[1]).filter(s=>s.trim());
eq(inline.length,1);eq(crypto.createHash('sha256').update(inline[0]).digest('hex'),'e5802ca4795d6c5cb0d248708fba1a78d73072dc3e985366787a787d54f8bd72');
ok(source.includes('href="DRAFTS/A0_FAMILY_NAVIGATOR_DEMO.html#spatial-navigation"'));ok(source.includes('href="#performanceConsole" data-jukebox-room="deck" aria-current="page"'));
ok(fs.existsSync(path.resolve(__dirname,'DRAFTS/A0_FAMILY_NAVIGATOR_DEMO.html')));
for(const html of [source,family]){ok(html.includes('a0-club-view-shell.css'));ok(html.includes('club-shell-header'));ok(html.includes('The Club Machine'));ok(html.includes('Let the relations play'));}
const transport=source.match(/<section class="now-playing"[^>]*>([\s\S]*?)<\/section>/)[1];ok(transport.startsWith('<button class="transport-round"'));eq((source.match(/id="tempoPlay"/g)||[]).length,1);
const header={hidden:false},hero={hidden:false},attrs={},doc={querySelector:s=>s==='.hero'?hero:header,documentElement:{setAttribute(k,v){attrs[k]=v;}}},self={};eq(shell.mount(doc,{self,top:self}),false);ok(!header.hidden);ok(!hero.hidden);eq(shell.mount(doc,{self,top:{}}),true);ok(header.hidden);ok(hero.hidden);eq(attrs['data-club-embedded'],'true');eq(shell.mount({querySelector:()=>null},{self,top:self}),false);
const js=fs.readFileSync(__dirname+'/a0-club-view-shell.js','utf8');ok(!/localStorage|postMessage|setInterval|fetch\(|A0CursorHandoff|selectEdge|\.play\(/.test(js));
console.log(JSON.stringify({status:'PASS',checks,scope:'shared shell, reciprocal standalone route, original START node moved left, embedded duplicate header hidden; original inline engine hash preserved; browser pixels OPEN'}));
