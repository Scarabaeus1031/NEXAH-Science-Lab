'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const api = require('./a0-architecture-observation-sail.js');

const root = __dirname;
const html = fs.readFileSync(path.join(root, 'A0_ARCHITECTURE_OF_DIFFERENCE.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'a0-architecture-observation-sail.css'), 'utf8');
const scienceDesk = fs.readFileSync(path.join(root, 'A0_RESEARCH_DESK.html'), 'utf8');
const builderLog = fs.readFileSync(path.join(root, 'A0_BUILDER_LOG.html'), 'utf8');

assert.deepEqual(api.innerPrimePlates, [2,3,5,7,11,13,17,19,23]);
assert.deepEqual(api.platePrimes, [2,3,5,7,11,13,17,19,23,29]);
assert.deepEqual(api.primeRoutes.xoxo, ['X','O','X','O']);
assert.deepEqual(api.primeRoutes.xxx, ['X','X','X']);

const inner = api.primePlateContract(23, '2d');
assert.equal(inner.isPrime, true);
assert.equal(inner.primeIndex, 9);
assert.equal(inner.innerWindow, true);
assert.equal(inner.outsideTrigger, false);
assert.equal(inner.cell, 5);
assert.equal(inner.mirrorCell, 3);
assert.equal(inner.sameCarrier, true);
assert.equal(inner.newOperator, false);

const outside = api.primePlateContract(29, '3d');
assert.equal(outside.primeIndex, 10);
assert.equal(outside.innerWindow, false);
assert.equal(outside.outsideTrigger, true);
assert.equal(outside.view, '3d');

const generation = api.generationContract(10);
assert.equal(generation.positions, '1024');
assert.equal(generation.cumulative, '2047');
assert.equal(generation.generation100, '1267650600228229401496703205376');
assert.equal(generation.plus7, 1031);
assert.equal(generation.plus9, 1033);
assert.equal(api.isPrime(1031), true);
assert.equal(api.isPrime(1033), true);

const carrier = api.primeCarrierContract(3);
assert.deepEqual(carrier.coefficients, [1,10,45,120,210,252,210,120,45,10,1]);
assert.equal(carrier.rowSum, 1024);
assert.equal(carrier.pairFields, 121);
assert.equal(carrier.sectors, 8);
assert.equal(carrier.base, 968);
assert.equal(carrier.afterDrift, 992);
assert.equal(carrier.afterSpokes, 1000);
assert.equal(carrier.total, 1024);
assert.equal(carrier.currentTotal, 1024);
assert.equal(carrier.sameNumberNotSameStructure, true);
assert.equal(carrier.sourceBoundHistorical, true);
assert.equal(carrier.generatorLocated, false);
assert.equal(carrier.newOperator, false);

const snake = api.primeSnakeContract(0);
assert.equal(snake.width, 25);
assert.equal(snake.limit, 1000);
assert.equal(snake.pageCount, 10);
assert.equal(snake.start, 1);
assert.equal(snake.end, 100);
assert.equal(snake.rows, 4);
assert.equal(snake.primeCount, 25);
assert.deepEqual(snake.cells.find(cell => cell.n === 1), {n:1,row:0,globalRow:0,column:0,prime:false});
assert.deepEqual(snake.cells.find(cell => cell.n === 25), {n:25,row:0,globalRow:0,column:24,prime:false});
assert.deepEqual(snake.cells.find(cell => cell.n === 26), {n:26,row:1,globalRow:1,column:24,prime:false});
assert.deepEqual(snake.cells.find(cell => cell.n === 50), {n:50,row:1,globalRow:1,column:0,prime:false});
assert.equal(snake.eulerValues.length, 40);
assert.equal(snake.eulerRun, true);
assert.equal(snake.eulerBreak, 1681);
assert.equal(snake.projectionRule, 'number gap != grid jump');
assert.equal(snake.periodicPrimeClaim, false);
assert.equal(snake.newOperator, false);
const lastWindow = api.primeSnakeContract(9);
assert.equal(lastWindow.start, 901);
assert.equal(lastWindow.end, 1000);
assert.equal(lastWindow.cells.length, 100);

for (const token of [
  'id="prime-plate-navigator"', 'OD–FSP–03', '0–28 INNER WINDOW', '29 OUTSIDE TRIGGER',
  '2D · PLATE', '3D · CARRIER', 'XOXO', 'XXX', 'SCARAB ≠ CIKADA',
  '1024+7=1031', '1024+9=1033', 'R₁₀(1033)=3301', 'no new CIKADA operator',
  'Ein Träger, drei Zählungen, zwei X-Achsen.', 'PASCAL · 11×11', '8 SECTORS',
  '8×121', '968', '992', '1000', '1024', 'Xₚ ≠ Xα', 'Chiron/Pluto',
  'PRIMEGRID · 25-SLICE · BOUSTROPHEDON RETURN', '25-SLICE', 'PRIME MASK', 'SNAKE', 'GAP',
  'n²+n+41', '1681=41²', 'prime gap ≠ grid jump', 'BLUE EQUATORIAL FLAP',
  'Kettle-bell projection', '2 × 50 + equator'
]) assert.ok(html.includes(token), `missing HTML token: ${token}`);

for (const token of ['.prime-plate', '.plate-view-2d', '.plate-view-3d', '.plate-cells circle.active', '.route-strip', '.prime-carrier-crosswalk', '.prime-carrier-ledger', '.pc-axis-pascal', '.pc-axis-corridor', '.prime-snake-slices', '.prime-snake-path', '.snake-cell.prime', '.prime-snake-equator'])
  assert.ok(css.includes(token), `missing CSS token: ${token}`);
assert.ok(css.includes('.prime-plate[data-view="3d"] .plate-view-3d{display:block}'));
assert.ok(scienceDesk.includes('id="architecture-prime-plate-return-20261120"'));
assert.ok(builderLog.includes('id="architecture-prime-plate-builder-20261120"'));

console.log('A0 Prime Plate Navigator: window + mirror + X/O + generation checks PASS');
