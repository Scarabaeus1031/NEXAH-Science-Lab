'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, '02_POINT_LINE_COORDINATE.html'), 'utf8');
let checks = 0;
const ok = (condition, message) => { checks += 1; assert.ok(condition, message); };

const cube = n => n ** 3;
const square = n => n ** 2;
const gcd = (a, b) => b === 0 ? Math.abs(a) : gcd(b, a % b);

ok(html.includes('id="carrier-101-line"'), 'carrier lens is present');
ok(html.includes('P₂₆ = 101'), 'prime-index carrier is explicit');
ok(html.includes('q + r = 4'), 'line relation is explicit');
ok(html.includes('Refuted control'), 'negative control stays visible');
ok(html.includes('134&#8239;032 ≠ 115&#8239;600'), 'false Pythagorean equality is rejected');
ok(html.includes('303²') && html.includes('(3,3)') && html.includes('3·101'), 'power, coordinate and product notation are separated');

const carrierPoints = [204, 304, 404].map(n => {
  const q = Math.floor(n / 101);
  const r = n % 101;
  return { n, q, r };
});
ok(carrierPoints.every(({ q, r }) => q + r === 4), 'all three points lie on q+r=4');
assert.deepEqual(carrierPoints, [
  { n: 204, q: 2, r: 2 },
  { n: 304, q: 3, r: 1 },
  { n: 404, q: 4, r: 0 }
]); checks += 1;

ok(cube(23) + cube(24) + cube(25) === square(204), 'consecutive-cube identity');
ok(Array.from({ length: 8 }, (_, i) => square(i + 1)).reduce((a, b) => a + b, 0) === 204, 'first eight squares sum to 204');
ok(square(304) / 64 === square(38), 'B64 aperture identity');
ok(gcd(204, 304) === 4, 'actual gcd is four');
ok(square(204) + square(304) === 134032, 'sum of squares is exact');
ok(square(340) === 115600 && square(204) + square(304) !== square(340), 'purported shared 3-4-5 triple is false');
ok(square(204) + square(272) === square(340), '204 belongs to its separate 3-4-5 triple');
ok(square(228) + square(304) === square(380), '304 belongs to its separate 3-4-5 triple');

const slope = (square(304) - square(204)) / (304 - 204);
ok(slope === 508, 'secant slope is 508');
ok(square(204) === 508 * 204 - 62016 && square(304) === 508 * 304 - 62016, 'both frozen points lie on the secant');

const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
ok(ids.length === new Set(ids).size, 'HTML ids remain unique');
for (const match of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) {
  new vm.Script(match[1]);
  checks += 1;
}

console.log(`PASS ${checks} carrier-101, exact-identity, negative-control and HTML checks.`);
