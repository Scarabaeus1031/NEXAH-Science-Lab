#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const F=require('./a0-fibonacci-crt-clock.js');
let checks=0;
function check(value,message){assert.ok(value,message);checks+=1}
const receipt=F.validate();
check(F.pisanoPeriod(7)===16,'pi 7');
check(F.pisanoPeriod(11)===10,'pi 11');
check(F.pisanoPeriod(37)===76,'pi 37');
check(F.pisanoPeriod(2849)===1520,'pi 2849');
check(F.lcm(F.lcm(16,10),76)===1520,'joint lcm');
check(F.CARRIER===2849,'CRT product');
check(F.fibPairMod(10,2849).join(',')==='55,89','F10 F11');
check(F.fibPairBigInt(10).join(',')==='55,89','exact bigint pair');
const s0=F.state(0),s10=F.state(10),s16=F.state(16),s76=F.state(76),s1520=F.state(1520);
check(s0.returns.full&&s0.exact.a===0n&&s0.exact.b===1n,'origin return');
check(s10.returns.mod11&&!s10.returns.mod7&&!s10.returns.mod37,'mod11 partial return');
check(s16.returns.mod7&&!s16.returns.mod11&&!s16.returns.mod37,'mod7 partial return');
check(s76.returns.mod37&&!s76.returns.mod7&&!s76.returns.mod11,'mod37 partial return');
check(s1520.returns.full,'full joint return');
check(s1520.crt.a===0&&s1520.crt.b===1,'full CRT pair');
for(const n of [0,1,2,10,76,761,1520]){
  const state=F.state(n);
  check([7,11,37].every(m=>state.crt.a%m===state.residues[m].a&&state.crt.b%m===state.residues[m].b),`CRT reconstruct ${n}`);
  check((state.register111[0].residue+state.register111[1].residue)%37===state.register111[2].residue,`sum register ${n}`);
}
check(s10.register74.length===2&&s10.register74.every(item=>item.address>=0&&item.address<74),'74 two lane register');
check(s10.register111.length===3&&s10.register111.every(item=>item.address>=0&&item.address<111),'111 three lane register');
check(receipt.registers.pair_state_space===1369,'37 squared pair state space');
check(F.state(137,'RECURRENCE').crt.a===F.state(137,'GOLDEN').crt.a,'view does not mutate recurrence');
check(F.state(137,'GOLDEN').boundary==='QUASIPERIODIC_DISPLAY_NO_FINITE_RETURN','golden boundary');
check(F.state(137,'UNIFORM').boundary==='MATCHED_UNIFORM_DISPLAY_CONTROL','uniform boundary');
check(receipt.comparator_result==='PASS_CONTROLS_DISTINGUISHED_FIBONACCI_NOT_PRIVILEGED','existing comparator retained');
check(receipt.authority.new_canonical_ids.length===0&&receipt.authority.relation_changes.length===0&&!receipt.authority.study_activation,'no graph effect');
check(F.svgFor(F.state(76)).includes('Z7 × Z11')&&F.svgFor(F.state(76)).includes('EXACT_FINITE_RECURRENCE'),'SVG typed');
assert.throws(()=>F.state(1521),/FIB_CLOCK_INDEX_INVALID/);checks+=1;
assert.throws(()=>F.state(1,'SPIRAL'),/FIB_VIEW_INVALID/);checks+=1;
const html=fs.readFileSync(path.join(__dirname,'A0_NUMBERMAGICK_GRID_RESEARCH.html'),'utf8');
for(const token of ['data-fibonacci-crt-clock','data-fib-index','data-fib-stage','FIBONACCI CLOCK','1520','PASS_CONTROLS_DISTINGUISHED_FIBONACCI_NOT_PRIVILEGED','a0-fibonacci-crt-clock.js','a0-fibonacci-crt-clock.css'])check(html.includes(token),`HTML ${token}`);
console.log(JSON.stringify({status:'PASS',schema:F.SCHEMA,checks,periods:F.PERIODS,carrier:F.CARRIER,graph_effect:{identities:0,relations:0,aliases:0,studies:0}},null,2));
