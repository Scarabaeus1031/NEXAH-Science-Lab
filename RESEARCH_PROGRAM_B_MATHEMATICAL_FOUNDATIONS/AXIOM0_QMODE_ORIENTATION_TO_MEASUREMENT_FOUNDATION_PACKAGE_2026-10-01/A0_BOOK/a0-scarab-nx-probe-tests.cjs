'use strict';
const assert=require('node:assert/strict');
const probe=require('./a0-scarab-nx-probe.js');

let checks=0;
function eq(actual,expected,message){assert.deepEqual(actual,expected,message);checks++;}
function ok(value,message){assert.ok(value,message);checks++;}

const data=probe.sieve(5000);
eq(data.primes.length,669,'669 primes below 5000');
eq(data.primes.at(-1),4999,'last carrier prime');

const expectedEdges={7:36,11:87,13:112,17:145,19:154};
for(const [m,count] of Object.entries(expectedEdges))eq(probe.edgeSet(data.primes,Number(m)).size,count,`mod ${m} edge count`);

const nx=probe.analyze(1729);
eq(nx.classification,'INJECTED_COMPOSITE');
eq([nx.lower,nx.nx,nx.upper],[1723,1729,1733]);
eq(nx.factors,[7,13,19]);
eq(nx.sensors.map(item=>item.residues[1]),[0,2,0,12,0]);
eq(nx.zeroHits,[7,13,19]);
eq(nx.detectedBy,[7,13,19]);
eq(nx.silentAt,[11,17]);

const prime=probe.analyze(1733);
eq(prime.classification,'LEGIT_PRIME');
ok(prime.sensors.every(item=>!item.detected),'carrier prime uses only legitimate edges');

const coreSweep=probe.sweep(5000,[7,11,13,17,19]);
eq([coreSweep.tested,coreSweep.detected,coreSweep.silent],[4319,3514,805]);
const extendedSweep=probe.sweep(5000,[3,5,7,11,13,17,19]);
eq([extendedSweep.tested,extendedSweep.detected,extendedSweep.silent],[4319,4163,156]);

eq(probe.isPrime(1729),false);
eq(probe.isPrime(1733),true);
console.log(`SCARAB n_x probe: ${checks} checks PASS`);
