// Bounded static test artifact. Never writes source files or the Pages root.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {withPublicNavigation} from './a0-public-preview-navigation.mjs';
const book=path.dirname(fileURLToPath(import.meta.url));
const ecosystem=path.resolve(book,'../../../../..');
const core=path.join(ecosystem,'10 NEXAH CORE/NEXAH');
const out=path.resolve(process.argv[2]||'');
if(!process.argv[2]||!out.includes('/previews/numbers-return-20261019'))throw Error('Explicit isolated preview destination required');
if(fs.existsSync(out)&&fs.readdirSync(out).length)throw Error('Preview destination must be new or empty');
fs.mkdirSync(out,{recursive:true});
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const entries=new Map(),queue=[],external=new Set(),unavailable=new Set();
const inDir=(f,d)=>f.startsWith(d+path.sep);
const allowedHtml=f=>['A0_GAME_OF_WORLDS_PLAY.html','A0_NUMBERMAGICK_GRID_RESEARCH.html'].includes(path.basename(f))||inDir(f,path.join(book,'assets/game-of-worlds-play'));
function assign(f){
  f=path.resolve(f);if(entries.has(f))return entries.get(f).dest;
  const ext=path.extname(f).toLowerCase();
  if(!fs.existsSync(f)||!fs.statSync(f).isFile())return null;
  if(ext==='.html'&&!allowedHtml(f))return null;
  if(!['.html','.js','.mjs','.css','.json','.png','.jpg','.jpeg','.webp','.svg','.gif','.glb','.gltf','.woff2','.wasm','.bin'].includes(ext))return null;
  let dest;
  if(inDir(f,book))dest='book/'+path.relative(book,f).split(path.sep).join('/');
  else if(inDir(f,core))dest='core/'+path.relative(core,f).split(path.sep).join('/');
  else if(['.png','.jpg','.jpeg','.webp','.svg','.gif'].includes(ext))dest='media/'+hash(fs.readFileSync(f)).slice(0,20)+ext;
  else return null;
  entries.set(f,{dest,source_sha256:hash(fs.readFileSync(f))});queue.push(f);return dest;
}
const relative=(from,to)=>path.posix.relative(path.posix.dirname(from),to)||path.posix.basename(to);
function reference(raw,source,dest,required){
  if(/^(https?:)?\/\//.test(raw)){external.add(raw);return raw;}
  if(/^(#|data:|blob:|about:|mailto:|javascript:)/.test(raw)||!raw)return raw;
  const match=raw.match(/^([^?#]*)(.*)$/);let name;
  try{name=decodeURIComponent(match[1]);}catch{return raw;}
  const f=path.resolve(path.dirname(source),name),mapped=assign(f);
  if(mapped)return relative(dest,mapped).split('/').map(encodeURIComponent).join('/')+match[2];
  if(required){unavailable.add(raw);return relative(dest,'unavailable.html');}
  return raw;
}
assign(path.join(book,'A0_GAME_OF_WORLDS_PLAY.html'));
assign(path.join(book,'A0_NUMBERMAGICK_GRID_RESEARCH.html'));
assign(path.join(book,'a0-arkade.css'));
// Dynamic GLB and iframe URLs are resolved against their document, not JS file.
assign(path.join(book,'assets/3d/nexah_pq_conjugate_orbit_v7.glb'));
// Cathedral is loaded lazily relative to the child document, not this JS module.
assign(path.join(book,'assets/a0-cathedral-rc08.packed.js'));
assign(path.join(book,'assets/game-of-worlds-play/numbers/index.html'));
assign(path.join(book,'assets/game-of-worlds-play/three-domain-transition-test/index.html'));
const banner='<aside style="padding:8px 14px;background:#483713;color:#fff;font:12px system-ui">Public engineering test · 19 Oct 2026 · Numbers and angle Return Gate are distinct typed models. No scientific promotion. <a style="color:#fff" href="../index.html#arkade">Return to ARKADE</a></aside>';
while(queue.length){
  const f=queue.shift(),entry=entries.get(f),ext=path.extname(f).toLowerCase(),target=path.join(out,entry.dest);fs.mkdirSync(path.dirname(target),{recursive:true});
  if(!['.html','.js','.mjs','.css','.json','.svg'].includes(ext)){fs.copyFileSync(f,target);continue;}
  let text=fs.readFileSync(f,'utf8');
  if(ext==='.html'){
    text=text.replace(/\b(href|src)="([^"]*)"/g,(_,a,v)=>a+'="'+reference(v,f,entry.dest,true)+'"');
    if(f===path.join(book,'A0_GAME_OF_WORLDS_PLAY.html')||f===path.join(book,'A0_NUMBERMAGICK_GRID_RESEARCH.html')){
      text=text.replace(/<body([^>]*)>/,'<body$1>'+banner);
      text=withPublicNavigation(text,{play:f===path.join(book,'A0_GAME_OF_WORLDS_PLAY.html')});
    }
    // Runtime iframes retain their own body and presentation semantics.
  }
  if(ext==='.css')text=text.replace(/url\(["']?([^\s)'";]+)["']?\)/g,(_,v)=>'url("'+reference(v,f,entry.dest,true)+'")');
  if(['.js','.mjs'].includes(ext))text=text.replace(/(["'])([^"'\n]+\.(?:js|mjs|css|json|glb|gltf|png|webp|jpg|svg|wasm)(?:\?[^"'\n]*)?)\1/g,(full,q,v)=>q+reference(v,f,entry.dest,false)+q);
  text=text.replaceAll('/Users/tho2020','[local-source]');
  if(ext==='.json'){
    const clean=v=>typeof v==='string'&&v.includes('[local-source]')?'[local provenance withheld from public preview]':Array.isArray(v)?v.map(clean):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).map(([k,x])=>[k,clean(x)])):v;
    text=JSON.stringify(clean(JSON.parse(text)),null,2);
  }
  fs.writeFileSync(target,text);
}
// Context navigation is retained, but non-exported book pages stop explicitly.
const stop='<!doctype html><html lang="de"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Außerhalb des Teststands</title><body style="font:18px system-ui;padding:2rem;background:#071823;color:#eefaff"><h1>Nicht Teil dieser Testversion</h1><p>Dieses Quellen- oder Forschungsziel wurde nicht mitveröffentlicht. Keine fehlende Quelle wird ersetzt oder als validiert ausgegeben.</p><p><a style="color:#ffca55" href="./index.html">Zum Test-Einstieg</a></p></body></html>';
fs.writeFileSync(path.join(out,'unavailable.html'),stop);
for(const name of fs.readdirSync(book).filter(n=>n.endsWith('.html')&&n!=='a0-public-arkade-index.html')){const f=path.join(out,'book',name);if(!fs.existsSync(f))fs.writeFileSync(f,stop.replace('href="./index.html"','href="../index.html"'));}
const cells='<i></i>'.repeat(25);
const publicEntrySource=path.join(book,'a0-public-arkade-index.html');
fs.writeFileSync(path.join(out,'index.html'),fs.readFileSync(publicEntrySource,'utf8').replace('{{LIFE_CELLS}}',cells));
for(const name of ['LICENSE','LICENSE_SCOPE.md'])fs.copyFileSync(path.resolve(book,'../../..',name),path.join(out,name));
const receipt={mobile_navigation:{revision:'20261019-a0-tool-3',source_sha256:hash(fs.readFileSync(path.join(book,'a0-public-preview-navigation.mjs'))),scope:'A0-linked Builder Arkade plus sticky in-game navigation; existing world/view controls only'},public_entry:{source_sha256:hash(fs.readFileSync(publicEntrySource)),role:'A0_TOOL',returns_to:'https://scarabaeus1031.github.io/NEXAH-Science-Lab/book/index.html#arkade-tool',canonical_identity_created:false,graph_relation_created:false},schema:'a0.public-play-preview/1',date:'2026-10-19',owner_authorization:'Public iPhone test and A0 story integration approved in chat',source_revision_is_dirty:true,boundary:'Bounded engineering preview linked from the existing A0 story; not canonical graph admission or scientific publication',provenance_redaction:'Local Photos and home paths withheld in generated JSON; source receipts unchanged',sources:[...entries.values()],external_dependencies:[...external],excluded_link_count:unavailable.size};
fs.writeFileSync(path.join(out,'PREVIEW_RECEIPT.json'),JSON.stringify(receipt,null,2));
let checked=0;function audit(d){for(const item of fs.readdirSync(d,{withFileTypes:true})){const f=path.join(d,item.name);if(item.isDirectory()){audit(f);continue;}if(!f.endsWith('.html'))continue;for(const m of fs.readFileSync(f,'utf8').matchAll(/\b(?:href|src)="([^"#]+)"/g)){if(/^(https?:|data:|blob:|about:)/.test(m[1]))continue;const raw=decodeURIComponent(m[1].split(/[?#]/)[0]);if(!fs.existsSync(path.resolve(path.dirname(f),raw)))throw Error('Missing preview target '+path.relative(out,f)+': '+raw);checked++;}}}audit(out);
const published=[];function inventory(d){for(const item of fs.readdirSync(d,{withFileTypes:true})){const f=path.join(d,item.name);if(item.isDirectory())inventory(f);else published.push({path:path.relative(out,f).split(path.sep).join('/'),sha256:hash(fs.readFileSync(f))});}}inventory(out);
fs.writeFileSync(path.join(out,'PREVIEW_SHA256.json'),JSON.stringify(published,null,2));
console.log(JSON.stringify({status:'PASS',out,source_files:entries.size,published_files:published.length+1,html_local_links_checked:checked,external_dependencies:external.size,excluded_links:unavailable.size},null,2));
