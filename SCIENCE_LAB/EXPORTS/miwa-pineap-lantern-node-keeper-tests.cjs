'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'MIWA_PINEAP_AN_DROMEDA.html'),'utf8');

test('MIWA master retains Lantern frame and observer-local Node Keeper',()=>{
  assert.match(html,/Lantern · Curtain · Shadow Play/);
  assert.match(html,/LANTERN-SHADOW-CUT/);
  assert.match(html,/Scarab · Node Keeper/);
  assert.match(html,/PINEAL \/ PINEAPPLE APERTURE/);
  assert.match(html,/π · PHASE CANOPY/);
  assert.match(html,/not a physical carrier coupling or Source Graph relation/);
});

test('MIWA inline runtime remains syntactically valid',()=>{
  const scripts=[...html.matchAll(/<script(?![^>]+src=)[^>]*>([\s\S]*?)<\/script>/gi)].map(match=>match[1]).filter(source=>source.trim());
  assert.ok(scripts.length>0);
  scripts.forEach(source=>assert.doesNotThrow(()=>new Function(source)));
});
