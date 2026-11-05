'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const deskPath = path.join(__dirname, 'A0_RESEARCH_DESK.html');
const decisionPath = path.resolve(__dirname, '../../../../../00 EXECUTIVE/NEXAH-Mission-Control/00_LAB_RESEARCH_DIRECTOR_DESK/OWNER_DECISION_REQUIRED_2026-11-05_A0_REGROUP_AND_NEXT_THREAD.md');
const desk = fs.readFileSync(deskPath, 'utf8');
const decision = fs.readFileSync(decisionPath, 'utf8');
let checks = 0;
const check = (value, message) => { assert.ok(value, message); checks += 1; };

check(desk.includes('id="next-owner-gate-20261105"'), 'owner gate is visible at Desk top');
check(desk.indexOf('next-owner-gate-20261105') < desk.indexOf('science-currentness-20261105'), 'owner gate precedes currentness');
check(desk.includes('0e8d860a') && desk.includes('codex/grid-observatory-mission-control'), 'exact branch candidate framed');
check(desk.includes('Owner decision required'), 'pending decision state visible');
check(desk.includes('kein PR, Merge, Deployment, neuer Research-Run'), 'non-activation boundary visible');
check(fs.existsSync(decisionPath), 'Mission Control decision packet exists');
check(decision.includes('PREPARED_OWNER_DECISION / NOT_YET_ADOPTED'), 'decision remains unadopted');
check(decision.includes('ACCEPT_FOR_PR_REVIEW') && decision.includes('PARK_BRANCH'), 'branch dispositions declared');
check(decision.includes('A0 navigation closure') && decision.includes('Mission Control recommendation'), 'next-thread recommendation declared');
check(decision.includes('Active research cycles remain `0`'), 'research activation remains zero');
check(decision.includes('creates no Navigator node') && decision.includes('typed relation'), 'Source Graph non-effect declared');

console.log(`PASS · ${checks} checks · pending A0 regroup decision is visible, bounded and linked to Mission Control.`);
