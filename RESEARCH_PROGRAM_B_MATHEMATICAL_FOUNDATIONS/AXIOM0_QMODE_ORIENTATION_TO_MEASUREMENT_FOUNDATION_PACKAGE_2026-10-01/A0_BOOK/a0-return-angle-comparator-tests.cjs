#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const Comparator=require('./a0-return-angle-comparator.js');

const receipt=Comparator.createReceipt();
assert.equal(receipt.status,'PASS_TYPED_RETURN_COMPARATOR');
assert.deepEqual([receipt.sources.pi.role,receipt.sources.pi.degrees],['PHASE_ADDRESS',204]);
assert.deepEqual([receipt.sources.ullinirium.role,receipt.sources.ullinirium.degrees],['VIEW_ANCHOR',135]);
assert.notEqual(receipt.sources.pi.role,receipt.sources.ullinirium.role);
assert.equal(receipt.comparison.numeric_separation_degrees,69);
assert.equal(receipt.comparison.angle_roles_equal,false);
assert.equal(receipt.comparison.derivation,false);
assert.equal(receipt.comparison.transition_operator,null);
assert.equal(receipt.comparison.disposition,'DISPLAY_COMPARISON_ONLY');
assert.equal(receipt.closure.equation,'P=A+B');
assert.equal(receipt.closure.error,0);
assert.match(receipt.closure.return_cell,/^RETURN-00:F\d{2}$/);
assert.equal(receipt.closure.ullinirium_return_role,'ULLINIRIUM_COMMON_RETURN_WITNESS');
assert.deepEqual([receipt.display.pulse_role,receipt.display.carrier_mutation,receipt.display.address_mutation],['DISPLAY_ENVELOPE_ONLY',false,false]);
assert.deepEqual([receipt.new_canonical_ids,receipt.relation_changes,receipt.aliases],[[],[],[]]);
assert.deepEqual(receipt.overlay.grid_steps_degrees,{n36:10,t9:40,beta27:40/3,flip64:5.625});
assert.deepEqual(receipt.overlay.exact_alignment_periods_degrees,{n36_t9:40,n36_beta27:40,n36_flip64:90,full_return:360});
assert.equal(receipt.overlay.ghostgrid_role,'DISPLAY_RESIDUAL_ONLY');
assert.equal(receipt.overlay.plus_minus_2_status,'HOLD_SOURCE_REQUIRED');
assert.deepEqual(receipt.existing_state.parameter,{namespace:'DYNAMICAL_PARAMETER',symbol:'c',value:[-0.1087,0]});
assert.equal(receipt.existing_state.classification,'EXACT_INTERIOR');
assert.equal(receipt.existing_state.angle_operator,null);

for(let slot=0;slot<12;slot+=1){
  const record=Comparator.createReceipt({slot,route:slot%2?'PINK':'YELLOW',faceIndex:slot,addressSlot:slot%4});
  assert.equal(record.comparison.numeric_separation_degrees,69);
  assert.equal(record.closure.return_cell,`RETURN-00:F${String(slot+1).padStart(2,'0')}`);
}

const tampered=structuredClone(receipt);
tampered.comparison.transition_operator='204_TO_135';
assert.throws(()=>Comparator.validate(tampered),/RETURN_COMPARATOR_OPERATOR_FORBIDDEN/);

const html=fs.readFileSync('./A0_BLUE_PINK_DODECA_CELL_RETURN.html','utf8');
for(const token of ['id="returnAngleComparator"','data-return-angle-comparator','204° Phase. 135° View. Ein gemeinsamer Return.','data-rac-return-cell','data-rac-grid','data-rac-grid-status','c=−0.1087+0i · EXACT_INTERIOR','a0-return-angle-comparator.css','a0-return-angle-comparator.js','A0_PLATINUM_IRIDIUM_PI_LENS.html#piLens'])assert.ok(html.includes(token),token);
assert.match(html,/204°<\/code> ist <code>PHASE_ADDRESS<\/code>/);
assert.match(html,/135°<\/code> ist <code>VIEW_ANCHOR<\/code>/);
assert.match(html,/kein Übergang, kein Operator und keine Winkelidentität/);

const makeElement=()=>({textContent:'',attributes:{},listeners:{},setAttribute(name,value){this.attributes[name]=value},addEventListener(name,fn){this.listeners[name]=fn},click(){this.listeners.click?.()}});
const nodes={run:makeElement(),pulse:makeElement(),grid:makeElement(),hold:makeElement(),status:makeElement(),gridStatus:makeElement(),receipt:makeElement(),returnCell:makeElement()};
const host={classes:new Set(),classList:{toggle(name,on){on?host.classes.add(name):host.classes.delete(name)}},querySelector(selector){return ({'[data-rac-run]':nodes.run,'[data-rac-pulse]':nodes.pulse,'[data-rac-grid]':nodes.grid,'[data-rac-hold]':nodes.hold,'[data-rac-status]':nodes.status,'[data-rac-grid-status]':nodes.gridStatus,'[data-rac-receipt]':nodes.receipt,'[data-rac-return-cell]':nodes.returnCell})[selector]}};
const view=Comparator.mount(host);
assert.deepEqual(view.state,{running:false,pulsing:false,grid:false});
nodes.run.click();nodes.pulse.click();nodes.grid.click();
assert.deepEqual(view.state,{running:true,pulsing:true,grid:true});
assert.ok(host.classes.has('is-running')&&host.classes.has('is-pulsing')&&host.classes.has('is-grid'));
assert.match(nodes.status.textContent,/PASS · TYPED RETURN COMPARATOR/);
assert.match(nodes.gridStatus.textContent,/40° · 90° · 360°/);
nodes.hold.click();
assert.deepEqual(view.state,{running:false,pulsing:false,grid:false});
assert.equal(nodes.returnCell.textContent,'RETURN-00:F01');

console.log(JSON.stringify({status:'PASS',schema:Comparator.SCHEMA,checks:'12 slots + type and boundary checks',graph_effect:{identities:0,relations:0,aliases:0}},null,2));
