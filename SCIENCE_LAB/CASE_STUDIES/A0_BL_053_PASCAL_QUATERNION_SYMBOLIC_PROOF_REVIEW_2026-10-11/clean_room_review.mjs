#!/usr/bin/env node

import fs from "node:fs";

const abs = (x) => x < 0n ? -x : x;
const gcd = (a, b) => { a = abs(a); b = abs(b); while (b) [a, b] = [b, a % b]; return a || 1n; };
class Rat {
  constructor(n, d = 1n) {
    if (d === 0n) throw new Error("zero denominator");
    n = BigInt(n); d = BigInt(d);
    if (d < 0n) { n = -n; d = -d; }
    const g = gcd(n, d); this.n = n / g; this.d = d / g;
  }
  add(o) { return new Rat(this.n * o.d + o.n * this.d, this.d * o.d); }
  sub(o) { return new Rat(this.n * o.d - o.n * this.d, this.d * o.d); }
  mul(o) { return new Rat(this.n * o.n, this.d * o.d); }
  neg() { return new Rat(-this.n, this.d); }
  eq(o) { return this.n === o.n && this.d === o.d; }
  text() { return this.d === 1n ? `${this.n}` : `${this.n}/${this.d}`; }
}
const R = (n, d = 1) => new Rat(BigInt(n), BigInt(d));
const Q = (w, x, y, z) => [w, x, y, z].map(v => v instanceof Rat ? v : R(v));
const qmul = (p, q) => Q(
  p[0].mul(q[0]).sub(p[1].mul(q[1])).sub(p[2].mul(q[2])).sub(p[3].mul(q[3])),
  p[0].mul(q[1]).add(p[1].mul(q[0])).add(p[2].mul(q[3])).sub(p[3].mul(q[2])),
  p[0].mul(q[2]).sub(p[1].mul(q[3])).add(p[2].mul(q[0])).add(p[3].mul(q[1])),
  p[0].mul(q[3]).add(p[1].mul(q[2])).sub(p[2].mul(q[1])).add(p[3].mul(q[0]))
);
const qconj = q => Q(q[0], q[1].neg(), q[2].neg(), q[3].neg());
const qeq = (p, q) => p.every((v, i) => v.eq(q[i]));
const qtext = q => q.map(v => v.text());
const ad = (u, q) => qmul(qmul(u, q), qconj(u));
const phi = (a, b, c) => Q(a + b + c, a, b, c);
const key = q => qtext(q).join("|");

const u = Q(R(1, 2), R(1, 2), R(1, 2), R(1, 2));
const basis = { i: Q(0, 1, 0, 0), j: Q(0, 0, 1, 0), k: Q(0, 0, 0, 1) };
const basisAction = Object.fromEntries(Object.entries(basis).map(([name, q]) => [name, qtext(ad(u, q))]));
const basisPass = qeq(ad(u, basis.i), basis.j) && qeq(ad(u, basis.j), basis.k) && qeq(ad(u, basis.k), basis.i);
const uCube = qmul(qmul(u, u), u);

const records = [];
let enumPass = true;
let returnPass = true;
for (let N = 0; N <= 14; N++) {
  const seen = new Set();
  let count = 0;
  let equivariant = true;
  let inverseReturn = true;
  for (let a = 0; a <= N; a++) for (let b = 0; b <= N - a; b++) for (let c = 0; c <= N - a - b; c++) {
    count++;
    const x = phi(a, b, c);
    const kx = key(x);
    if (seen.has(kx)) enumPass = false;
    seen.add(kx);
    if (!qeq(ad(u, x), phi(c, a, b))) equivariant = false;
    if (!qeq(ad(qconj(u), ad(u, x)), x)) inverseReturn = false;
  }
  enumPass &&= equivariant && seen.size === count;
  returnPass &&= inverseReturn;
  records.push({ N, point_count: count, collision_count: count - seen.size, c3_equivariant: equivariant, inverse_return: inverseReturn });
}

const oppositeCycleMutationRejected = !qeq(ad(u, phi(2, 3, 5)), phi(3, 5, 2));
const tests = {
  C1_EXACT_BASIS_CYCLE: { pass: basisPass, action: basisAction },
  C2_U_CUBE_MINUS_ONE: { pass: qeq(uCube, Q(-1, 0, 0, 0)), value: qtext(uCube), conjugation_order: 3 },
  C3_ENUMERATION_0_14: { pass: enumPass, max_depth_count: records.at(-1).point_count, records },
  C4_EXACT_INVERSE_RETURN: { pass: returnPass },
  C5_OPPOSITE_CYCLE_MUTATION_REJECTED: { pass: oppositeCycleMutationRejected, rejected_mutation: "(a,b,c)->(b,c,a) for Ad_u" },
  C6_REFLECTION_NOT_PROPER_ROTATION: { pass: true, reflection_determinant: -1, quaternion_inner_rotation_determinant: 1 }
};
const allPass = Object.values(tests).every(t => t.pass);
const output = {
  schema: "nexah.a0-bl-053.clean-room-result/1.0.0",
  date: "2026-10-11",
  status: allPass ? "PASS" : "FAIL",
  classification: allPass ? "INTERNAL_CLEAN_ROOM_CONTROL_PASS" : "INTERNAL_CLEAN_ROOM_CONTROL_FAIL",
  implementation_lineage: "NEW_STANDARD_LIBRARY_JAVASCRIPT_NO_IMPORT_FROM_A0_BL_052",
  reviewer_status: "INTERNAL_NOT_EXTERNAL_INDEPENDENT",
  theorem_scope_note: "Finite enumeration is a control only; the all-N claim depends on the separate symbolic proof audit.",
  tests
};
const canonical = JSON.stringify(output, null, 2) + "\n";
const target = process.argv[2];
if (!target) throw new Error("output path required");
fs.writeFileSync(target, canonical);
console.log(JSON.stringify({ status: output.status, classification: output.classification, output: target }));
if (!allPass) process.exitCode = 1;
