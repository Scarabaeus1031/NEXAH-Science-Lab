'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const read = file => fs.readFileSync(path.join(__dirname, file), 'utf8');
const science = read('A0_SCIENCE.html');
const desk = read('A0_RESEARCH_DESK.html');
const storyboard = read('A0_THEORY_STORYBOARD.html');
let checks = 0;
const check = (condition, message) => { assert.ok(condition, message); checks += 1; };

check(science.includes('Owner Staging · 05.11.2026'), 'science owner-staging date');
check(science.includes('Currentness Overlay · 5. November 2026'), 'science currentness overlay');
check(science.includes('25 F-A0 Records · 0 Promotions'), 'science ledger ceiling');
check(science.includes('140→106') && science.includes('180 Kanten') && science.includes('135 Rekurrenzen'), 'red-balloon bounded return');
check(science.includes('SOURCE → CARRIER → LENS → INSPECT'), '101 IOI TESSAREC thread');
check(science.includes('SCIENCE RELEASE READY = NONE'), 'publication boundary');
check(!science.includes('Owner Staging · 03.11.2026'), 'stale science staging removed');

check(desk.includes('id="science-currentness-20261105"'), 'desk currentness anchor');
check((desk.match(/science-currentness-20261103/g) || []).length === 1, 'legacy desk anchor retained without stale routing');
check(desk.includes('Delta 01.–05.11.'), 'desk delta window');
check(desk.includes('?desk=returns#ioi-tessarec3-a0-binding-return-20261105'), 'latest binding return');
check(desk.includes('?desk=returns#red-balloon-c20-carrier-ledger-20261104'), 'red-balloon return');
check(desk.includes('25 Records · 0 neue Promotions'), 'desk finding ceiling');

check(storyboard.includes('id="currentness-20261105"'), 'storyboard currentness anchor');
check(storyboard.includes('Science · Scientific Position'), 'scientific-position navigation preserved');
check(storyboard.includes('Science · Überblick'), 'science overview navigation');

for (const [document, href] of [
  [science, 'A0_RESEARCH_DESK.html#science-currentness-20261105'],
  [storyboard, 'A0_RESEARCH_DESK.html?desk=returns#ioi-tessarec3-a0-binding-return-20261105']
]) {
  const [, anchor] = href.split('#');
  check(document.includes(`href="${href}"`), `link declared ${href}`);
  check(desk.includes(`id="${anchor}"`), `desk anchor exists ${anchor}`);
}

console.log(`PASS · ${checks} checks · A0 Science, Desk and Storyboard currentness aligned at 05.11.2026.`);
