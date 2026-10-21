'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const G=require('./a0-bench-body-gallery.js'),W=require('./a0-bench-walk.js'),D=require('./a0-bench-disclosures.js');
let checks=0;const ok=v=>{assert(v);checks++;};
ok(G.ITEMS.length===6);
for(const item of G.ITEMS){const lines=G.paths(item);ok(lines.length>10);ok(lines.every(l=>l.points.every(p=>p.length===2&&p.every(Number.isFinite))));const svg=G.svg(item);ok(svg.includes('<svg'));ok(!/NaN|Infinity|undefined/.test(svg));ok(svg.includes('polyline'));}
const gallery=G.markup();ok((gallery.match(/class="bvg-card"/g)||[]).length===6);ok(gallery.includes('keine Live-Zustände')||gallery.includes('Keine Live-Zustände'));
const room=W.markup(0,G);ok(room.includes('bvg-grid'));ok(!room.includes('DEIN ERSTER SCHRITT'));ok(room.includes('Alle Bereiche'));
class E{
 constructor(tag='DIV'){this.tagName=tag;this.children=[];this.events={};this.parentElement=null;this.classList={contains:c=>this.className===c};}
 appendChild(n){this.children.push(n);n.parentElement=this;}
 before(n){this.beforeNode=n;n.parentElement=this.parentElement;}
 addEventListener(k,f){this.events[k]=f;}
}
const panels=[new E(),new E(),new E(),new E()];panels.forEach(p=>p.parentElement=new E('SECTION'));let n=0;const hooks={};
const doc={querySelectorAll:()=>n++===0?[panels[0]]:n===2?[panels[1]]:[panels[2],panels[3]],createElement:t=>new E(t.toUpperCase()),getElementById:()=>panels[0]};
const win={location:{hash:'#settings'},addEventListener:(k,f)=>hooks[k]=f};
const ctl=D(doc,win);ok(ctl.count===4);
for(const p of panels){ok(p.parentElement.tagName==='DETAILS');ok(p.parentElement.children.includes(p));ok(p.parentElement.children[0].tagName==='SUMMARY');}
ok(panels[0].parentElement.open);ok(panels[1].parentElement.open===undefined);
win.location.hash='#other';hooks.hashchange();ok(panels[0].parentElement.open);
const html=fs.readFileSync(__dirname+'/A0_ORIENTATION_CONTROLLER_BENCH.html','utf8');
ok(html.indexOf('src="a0-bench-body-gallery.js"')<html.indexOf('src="a0-bench-walk.js"'));
ok(html.indexOf('src="a0-bench-disclosures.js"')>html.indexOf('src="a0-bench-integration.js"'));
for(const f of ['a0-bench-body-gallery.js','a0-bench-disclosures.js'])ok(!/setInterval|requestAnimationFrame|postMessage|\.play\(/.test(fs.readFileSync(__dirname+'/'+f,'utf8')));
console.log(JSON.stringify({status:'PASS',checks,visuals:6,parameterDrawers:4,scope:'finite source geometry, gallery-first markup, original-node disclosure wrapping, direct field reveal and script order; browser layout OPEN'}));
