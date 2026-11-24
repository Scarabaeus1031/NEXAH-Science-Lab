#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const D=require('./a0-prime-torus-thread-demonstrator.js');
let passed=0;
function check(label,value){assert.ok(value,label);passed++;console.log('PASS',label)}
function equal(label,actual,expected){assert.deepEqual(actual,expected,label);passed++;console.log('PASS',label)}

const data=D.model(1000),measure=D.measures(),thread=data.transitions[3],readout=D.transitionReadout(thread);
const analysis=D.eulerAnalysis(data),graph=analysis.graph,audit=analysis.audit;
equal('declared coprime moduli',[D.MOD_X,D.MOD_Y],[7,11]);
check('168 primes at or below 1000',data.points.length===168);
check('167 consecutive prime threads',data.transitions.length===167);
equal('zero gates are exactly 7 and 11',data.zeroGates.map(point=>point.prime),[7,11]);
check('all sixty unit states are visited',data.unitStatesVisited===60);
equal('full grid has seventy-seven nodes',measure.fullGridNodes,77);
equal('full grid has sixty cells',measure.fullGridCells,60);
equal('unit field has sixty nodes',measure.unitNodes,60);
equal('unit field has five by nine cells',[measure.unitCellColumns,measure.unitCellRows,measure.unitCells],[5,9,45]);
equal('inner unit nodes are four by eight',measure.innerUnitNodes,32);
equal('L zero frame has seventeen addresses',measure.zeroFrameAddresses,17);
check('normalized cell pitch is one third by one fifth',Math.abs(measure.normalizedPitchX-1/3)<1e-12&&Math.abs(measure.normalizedPitchY-1/5)<1e-12);
equal('default thread is seven to eleven',[thread.from.prime,thread.to.prime],[7,11]);
equal('default residues are exact',[thread.from.r7,thread.from.r11,thread.to.r7,thread.to.r11],[0,7,4,0]);
equal('raw delta is exact',[thread.raw7,thread.raw11],[4,-7]);
equal('wrapped delta is exact',[thread.wrapped7,thread.wrapped11],[-3,4]);
check('readout distinguishes raw and wrapped angles',readout.rawAngle<0&&readout.wrappedAngle>90);
equal('unit prime walk has one hundred sixty-two transitions',graph.primeTransitions,162);
equal('unit graph has one hundred thirty-five unique undirected edges',graph.edges.length,135);
equal('prime walk repeats twenty-seven undirected traversals',graph.repeatedPrimeTraversals,27);
equal('reduced unit graph has twenty-four odd vertices',graph.oddVertices.length,24);
equal('doubled-edge Euler audit has two hundred seventy transitions',audit.transitions.length,270);
check('Euler audit is closed',audit.closed&&audit.route[0]===audit.route[audit.route.length-1]);
equal('Euler audit declares non-minimal doubled-edge construction',audit.construction,'EVERY_UNIQUE_EDGE_DOUBLED_NON_MINIMAL');
const auditEdgeCounts=new Map();
audit.transitions.forEach(({fromKey,toKey})=>{const key=fromKey<=toKey?fromKey+'|'+toKey:toKey+'|'+fromKey;auditEdgeCounts.set(key,(auditEdgeCounts.get(key)||0)+1)});
check('Euler audit traverses every unique edge exactly twice',graph.edges.every(edge=>auditEdgeCounts.get(edge.key)===2));
const svg=D.svgFor(data,4,{showTrail:true,showMeasures:true,showFrame:true,showWrap:true,wobble:.24});
for(const token of ['L FRAME = 17 ADDRESSES','5 CELL COLUMNS','9 CELL ROWS','NO CUBE MAP DECLARED','WOBBLE = VIEW ONLY'])check('SVG contains '+token,svg.includes(token));
const lilithSvg=D.svgFor(data,4,{mode:'lilith',showWrap:false,wobble:.72});
check('Lilith mode separates exact chord and shadow curve',lilithSvg.includes('ptd-exact-chord')&&lilithSvg.includes('ptd-lilith-thread'));
const eulerSvg=D.svgFor(data,1,{mode:'euler',showWrap:false,wobble:0});
check('Euler mode declares closed non-minimal audit',eulerSvg.includes('135 UNIQUE EDGES × 2 = 270')&&eulerSvg.includes('CLOSED · NON-MINIMAL AUDIT'));
const differenceSvg=D.svgFor(data,1,{mode:'difference',showWrap:false,wobble:.2});
check('difference mode distinguishes repeats and audit copies',differenceSvg.includes('ptd-prime-repeat')&&differenceSvg.includes('ptd-audit-copy'));

const html=fs.readFileSync(path.join(__dirname,'A0_NUMBERMAGICK_GRID_RESEARCH.html'),'utf8');
for(const id of ['prime-torus-thread-demonstrator','primeThreadTitle','primeThreadMode','primeThreadStep','primeThreadWobble','primeThreadWrap','primeThreadFrame','primeThreadMeasures','primeThreadTrail','primeThreadRoot','primeThreadTarget','primeThreadDelta','primeThreadAngle','primeThreadAudit','primeThreadSvg'])check('HTML anchor '+id,html.includes('id="'+id+'"'));
check('demonstrator assets linked',html.includes('a0-prime-torus-thread-demonstrator.css')&&html.includes('a0-prime-torus-thread-demonstrator.js'));
check('cube boundary remains explicit',html.toLowerCase().includes('eine cube-einbettung ist hier noch nicht deklariert'));
check('five by eight is corrected by exact counts',html.includes('5×9=45')&&html.includes('4×8=32'));
check('Euler claim boundary is explicit',html.includes('nicht als kürzeste Eulerisierung deklariert'));

const receipt=JSON.parse(fs.readFileSync(path.join(__dirname,'results/a0-prime-torus-thread-demonstrator-2026-11-20.json'),'utf8'));
equal('receipt carrier counts',[receipt.carrier.prime_count,receipt.carrier.transition_count],[168,167]);
equal('receipt grid counts',[receipt.grid.full_nodes,receipt.grid.unit_nodes,receipt.grid.unit_cells,receipt.grid.inner_unit_nodes,receipt.grid.zero_frame_addresses],[77,60,45,32,17]);
equal('receipt default wrapped delta',receipt.default_thread.wrapped_delta,[-3,4]);
equal('receipt Euler audit counts',[receipt.euler_audit.unique_undirected_edges,receipt.euler_audit.repeated_prime_traversals,receipt.euler_audit.odd_degree_vertices_after_edge_collapse,receipt.euler_audit.audit_transition_count],[135,27,24,270]);
check('receipt keeps Euler claim bounded',receipt.euler_audit.closed===true&&receipt.euler_audit.construction==='EVERY_UNIQUE_EDGE_DOUBLED_NON_MINIMAL'&&receipt.interpretation_boundary.euler==='COMPUTED_VIEW_LENS_NOT_SHORTEST_EULERIZATION_CLAIM');
check('receipt creates no identity or relation',receipt.new_identity===false&&receipt.new_relation===false);
console.log(JSON.stringify({status:'PASS',assertions:passed,schema:receipt.schema,identity_reuse:receipt.identity_reuse,new_identity:false,new_relation:false},null,2));
