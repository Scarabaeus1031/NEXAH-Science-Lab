'use strict';
const assert=require('node:assert/strict');
const M=require('./a0-bench-map.js');
let checks=0;const check=(value,message)=>{assert.ok(value,message);checks++};
assert.equal(M.VERSION,'1.0.0');checks++;
assert.equal(M.IDENTITY,'NEXAH_A0_ORIENTATION_CONTROLLER_BENCH');checks++;
assert.equal(M.GROUPS.length,6);checks++;
check(M.MODULES.length>=20,'complete operational module projection');
assert.equal(new Set(M.MODULES.map(x=>x.id)).size,M.MODULES.length);checks++;
for(const module of M.MODULES){check(M.GROUPS.some(group=>group.id===module.group),`group exists for ${module.id}`);check(Boolean(M.BINDING_TYPES[module.bindingType]),`binding exists for ${module.id}`);check(/^[a-z0-9-]+$/.test(module.id),`stable module id ${module.id}`);check(/^[A-Za-z][A-Za-z0-9_-]+$/.test(module.focusTarget),`focus target ${module.id}`)}
for(const edge of M.EDGES){check(Boolean(M.moduleById(edge.from)),`edge source ${edge.id}`);check(Boolean(M.moduleById(edge.to)),`edge target ${edge.id}`);check(Boolean(M.BINDING_TYPES[edge.bindingType]),`edge binding ${edge.id}`)}
let state=M.createState();assert.equal(state.selectedId,'state');checks++;
state=M.selectState(state,'native-face');assert.equal(state.selectedId,'native-face');checks++;
assert.throws(()=>M.selectState(state,'missing'),/unknown Bench Map module/);checks++;
state=M.filterState(state,'VIEW_PROJECTION');assert.equal(state.filter,'VIEW_PROJECTION');checks++;
assert.throws(()=>M.filterState(state,'MYSTERY'),/unknown Bench Map filter/);checks++;
state=M.playbackState(state,{state:'PLAY',stationId:'native-face',target:'nativeFaceBridge',index:2});assert.equal(state.playback.moduleId,'native-face');checks++;
assert.equal(M.moduleForTarget('systemBinder').id,'binder');checks++;
const registry=M.registry();assert.equal(registry.modules.length,M.MODULES.length);checks++;assert.equal(registry.events.playback,'a0:bench-playback');checks++;
assert.match(registry.boundary,/owns neither Bench state nor playback/);checks++;
console.log(JSON.stringify({status:'PASS',checks,modules:M.MODULES.length,edges:M.EDGES.length,groups:M.GROUPS.length}));
