const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const code=fs.readFileSync(path.join(__dirname,'a0-six-marker-grid-views.js'),'utf8');
const api=require('./a0-six-marker-grid-views.js');let checks=0;
function ok(v){assert.ok(v);checks++;}
const report=JSON.parse(fs.readFileSync(path.join(__dirname,'../../../NUMBER_OPERATOR_ARCHITECTURE_CONCORDANCE_AUDIT/DYADIC_GRID_SOURCE_CHECKS_2026-10-18.json'),'utf8'));
const source=fs.readFileSync(path.join(report.custody_root,'data/Navigation_scores__multi-base__multi-grid_.csv'),'utf8').trim().split(/\r?\n/).slice(1).map(l=>l.split(','));
for(const row of api.data.rows)for(const [i,s] of api.data.markers.entries()){
const r=source.find(r=>r[0]===row.name&&r[1]==='AU'&&r[3]==='10'&&Number(r[4])===s);ok(r&&Number(r[6])===row.scores[i]);}
ok(JSON.stringify(api.address(737))==='[2,2,2,34]');
for(const n of api.data.markers){ok(api.candidates(n,false).length===1);ok(api.candidates(n,true).length===37);ok(api.restore(api.reduced(n),Math.floor(n/105))===n);}
for(let i=0;i<6;i++)ok(api.slot(api.slot(i,true),true)===i);
const ids=['gridMarkerRail','gridHeatmap','gridCrt','gridPolar','gridMirror','gridReadout','gridLoss','gridReturn','gridCandidates','gridHide37','gridReturnKey','gridFullDomain'];
const elements=Object.fromEntries(ids.map(id=>[id,{innerHTML:'',textContent:'',checked:id==='gridFullDomain',listeners:{},addEventListener(t,fn){this.listeners[t]=fn;}}]));
const host={listeners:{},addEventListener(t,fn){this.listeners[t]=fn;},contains(){return true;}};
vm.runInNewContext(code,{window:{document:{getElementById:id=>id==='six-marker-comparison'?host:elements[id]}}});
ok(elements.gridReadout.textContent.includes('Marker 737'));ok(elements.gridHeatmap.innerHTML.includes('0.64'));ok(elements.gridCrt.innerHTML.includes('34'));
elements.gridHide37.checked=true;elements.gridHide37.listeners.change();ok(elements.gridCrt.innerHTML.includes('verborgen'));ok(elements.gridLoss.textContent.includes('37 Kandidaten'));
elements.gridFullDomain.checked=false;elements.gridFullDomain.listeners.change();ok(elements.gridReadout.textContent.includes('1 kompatible Zahl'));
elements.gridReturnKey.checked=true;elements.gridReturnKey.listeners.change();ok(elements.gridReturn.textContent.includes('2 + 105 × 7 = 737'));
host.listeners.click({target:{closest(){return {dataset:{gridMarker:'237'}};}}});
ok(elements.gridReadout.textContent.includes('Marker 237'));ok(elements.gridReturn.textContent.includes('27 + 105 × 2 = 237'));
const html=fs.readFileSync(path.join(__dirname,'A0_NUMBERMAGICK_GRID_RESEARCH.html'),'utf8');
for(const id of ids)ok(html.includes('id="'+id+'"'));
ok(html.includes('A0_PINK_DIAMOND_GRID_ATLAS.html#ghost-tiles'));
ok(html.includes('nexah-ghost-grid-mode-2-download.html#nexah-ghost-grid-mode-2'));
console.log(JSON.stringify({status:'PASS',checks,scope:'source cells, pure adapters and actual controller in simulated DOM; no browser visual acceptance'}));

