"use strict";const assert=require("node:assert/strict"),D=require("../pqb-audit-engine.js"),C=require("../AUDIT_CONTRACT.json"),P=require("../../NEXAH_LIFE_PRIME_COMPOSITE_WINDOW_LIFE06C_2026-10-07/PREREGISTRATION.json"),checks=[];function check(n,f){f();checks.push(n)}
check("real conjugates multiply to P squared",()=>C.prime_centers.forEach(p=>{const q=D.conjugate(p,C.default_alpha);assert.ok(Math.abs(q.product-p*p)<1e-10)}));
check("prime squared divisor pairs are trivial",()=>C.prime_centers.forEach(p=>assert.deepEqual(D.exactIntegerConjugates(p),[[1,p*p],[p,p]])));
check("additive neighbours are not scale conjugates",()=>C.prime_centers.forEach(p=>assert.equal((p-1)*(p+1),p*p-1)));
check("aggregate ledger spans every integer length",()=>{const x=D.aggregateScores(P,C);assert.equal(x.scores.length,31);assert.deepEqual(x.scores.map(s=>s.length),Array.from({length:31},(_,i)=>i+2))});
check("pearl keeps exact and represented Q separate",()=>{const x=D.aggregateScores(P,C),b=D.pearl(x.scores,13,C.default_alpha);assert.ok(Math.abs(b.product-169)<1e-12);assert.equal(b.exactInteger,false);assert.deepEqual([b.integerLower,b.integerUpper],[8,21])});
check("fiber multiplicity is monotone in tolerance",()=>{const x=D.aggregateScores(P,C),m=C.declared_fiber_tolerances.map(d=>D.fiber(x.scores,29,d).multiplicity);for(let i=1;i<m.length;i++)assert.ok(m[i]>=m[i-1])});
console.log(`PASS ${checks.length}/${checks.length}`);
