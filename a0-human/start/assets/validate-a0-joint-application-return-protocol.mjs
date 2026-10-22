import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const protocol = JSON.parse(fs.readFileSync(path.join(here, "a0-joint-application-return-protocol-v1.json"), "utf8"));
const failures = [];
let checks = 0;
const check = (condition, message) => { checks += 1; if (!condition) failures.push(message); };

const factorize = (n) => {
  let x = n;
  const factors = [];
  for (let p = 2; p * p <= x; p += p === 2 ? 1 : 2) {
    if (x % p) continue;
    let exponent = 0;
    while (x % p === 0) { x /= p; exponent += 1; }
    factors.push([p, exponent]);
  }
  if (x > 1) factors.push([x, 1]);
  return factors;
};
const phi = (n) => factorize(n).reduce((value, [prime]) => value / prime * (prime - 1), n);
const isPalindrome = (n) => String(n) === [...String(n)].reverse().join("");
const palindromes = [];
for (let a = 1; a <= 9; a += 1) for (let b = 0; b <= 9; b += 1) palindromes.push(101 * a + 10 * b);
const palindromePairs = (target) => {
  const pairs = [];
  for (let i = 0; i < palindromes.length; i += 1) {
    for (let j = i; j < palindromes.length; j += 1) {
      if (palindromes[i] + palindromes[j] === target) pairs.push([palindromes[i], palindromes[j]]);
    }
  }
  return pairs;
};
const candidates = (n, moduli) => {
  const values = [];
  for (let x = 0; x < 19019; x += 1) if (moduli.every((m) => x % m === n % m)) values.push(x);
  return values;
};
const byId = Object.fromEntries(protocol.cases.map((item) => [item.id, item]));

check(protocol.schema === "nexah.a0.joint-application-return-protocol/1.0.0", "protocol schema");
check(protocol.protocol_id === "A0:JARP:V1", "stable protocol id");
check(protocol.status === "INTERNAL_ENGINEERING_FIXTURE_NOT_SCIENCE_RUN", "engineering-only status");
check(protocol.publication_authorized === false, "publication remains false");
check(protocol.cases.length === 10, "ten frozen application cases");
check(new Set(protocol.cases.map((item) => item.id)).size === 10, "unique case ids");
check(protocol.domain.palindrome_source_count === palindromes.length, "90 palindrome sources");
check(protocol.domain.palindrome_unordered_pair_count === palindromes.length * (palindromes.length + 1) / 2, "4095 unordered pairs");

for (const id of ["APP-01", "APP-02", "APP-03"]) {
  const item = byId[id];
  const values = candidates(item.input.n, item.input.moduli);
  check(values.length === item.expected.candidate_count, `${id} candidate count`);
  check(values.includes(item.input.n) === (item.expected.contains_source ?? true), `${id} source membership`);
}
check(JSON.stringify(candidates(11357, [7, 11, 13, 19])) === JSON.stringify([11357]), "APP-01 unique reconstruction");
check(JSON.stringify([7, 11, 13, 19].map((m) => 11357 % m)) === JSON.stringify(byId["APP-01"].expected.residues), "APP-01 residues");
check(Math.floor(11357 / 20) === byId["APP-03"].expected.q && 11357 % 20 === byId["APP-03"].expected.r, "APP-03 QRT address");

for (const id of ["APP-04", "APP-05", "APP-06"]) {
  const item = byId[id];
  const [a, b] = item.input.ordered_pair;
  const sum = a + b;
  const pairs = palindromePairs(sum);
  const ordered = pairs.reduce((count, [x, y]) => count + (x === y ? 1 : 2), 0);
  check(palindromes.includes(a) && palindromes.includes(b), `${id} sources in frozen domain`);
  check(sum === item.expected.sum, `${id} sum`);
  check(isPalindrome(sum) === item.expected.palindrome, `${id} closure class`);
  check(pairs.length === item.expected.unordered_preimages, `${id} unordered preimages`);
  check(ordered === item.expected.ordered_preimages, `${id} ordered preimages`);
}

const app07 = byId["APP-07"];
check(app07.input.registered_pairs.every(([a, b]) => a + b === app07.expected.sum), "APP-07 registered sums");
check(phi(app07.expected.sum) === app07.expected.totient, "APP-07 totient");
const app08 = byId["APP-08"];
check(app08.input.states.length === app08.expected.state_count && app08.expected.same_address === true, "APP-08 same-address fiber");
const app09 = byId["APP-09"];
check(phi(app09.input.shell) === app09.expected.phi_49, "APP-09 phi(49)");
check(app09.input.frame === app09.input.totient_output && app09.expected.role_identity === false, "APP-09 numeric equality without role identity");
const app10 = byId["APP-10"];
check(JSON.stringify(app10.input.values.map(phi)) === JSON.stringify(app10.expected.totients), "APP-10 totients");
check(JSON.stringify(app10.input.values.map((n, i) => n - app10.expected.totients[i])) === JSON.stringify(app10.expected.gaps), "APP-10 gaps");

for (const item of protocol.cases) check(protocol.result_vocabulary.includes(item.expected.result), `${item.id} result vocabulary`);
check(protocol.identity_reuse.includes("MOD:TESSAREC"), "Tessarec identity reused");
check(protocol.identity_reuse.includes("MOD:NUMBER_VIEW_SUITE"), "Number View identity reused");
check(protocol.identity_reuse.includes("NN:CRT_QRT_37_CARRIER_LADDER"), "CRT/QRT lens reused");

const result = {status: failures.length ? "FAIL" : "PASS", checks, cases: protocol.cases.length, failures};
console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exitCode = 1;
