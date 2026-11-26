const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, 'A0_RESEARCH_DESK.html'), 'utf8');
const focusStart = html.indexOf('<section class="sp-focus" id="science-portfolio-focus"');
const focusEnd = html.indexOf('<section class="spread" id="science-portfolio-control"');
const focusBoard = html.slice(focusStart, focusEnd);
const checks = [];
const check = (value, message) => { assert.ok(value, message); checks.push(message); };

check(html.includes('id="science-desk-navigator-20261122"'), 'dated Science Desk meta navigator exists');
check(html.includes('Big Picture · Science Desk Leuchtturm') && html.includes('>Was ist unsere Theorie?</h2>'), 'the current Science Desk lighthouse has the requested name');
check(html.includes('Source / Carrier') && html.includes('Frame / Cut') && html.includes('Return / Residual') && html.includes('Human Decision'), 'typed source-to-decision chain remains explicit');
check(html.includes('Theory of Oriented Interfaces') && html.includes('keine Theory of Everything'), 'TOI is bounded as a working reading key');
check(html.includes('R2–R3 internal') && html.includes('E4 · none'), 'internal maturity and missing external review are both visible');
for (const paper of ['Paper A', 'Paper B', 'Paper C', 'Paper D', 'Paper E', 'Paper F']) check(html.includes(paper), `${paper} remains visible in the family map`);
check(html.includes('<details class="desk-view-switcher" open>'), 'Science Desk Navigator is visible by default');
check(html.includes('deskSnapshot.after(deskViewNav)'), 'existing view navigator is moved directly behind the current snapshot');
check(html.includes('overview: new Set(["science-desk-arbeitsuebersicht", "science-desk-navigator-20261122", "major-builds-connection-status", "nexah-de-public-release-return-20261122"'), 'overview starts from the current meta view, major-build connection status and release receipt');
check(!html.includes('overview: new Set(["desk-routing-8plus3"'), 'historical 8+3 routing no longer defines the current overview');
check(html.includes('{ preserveScroll: view !== "overview" }') && html.includes('preservedScrollY'), 'the overview tab returns to the brief and other views keep the reading position');
check(!html.includes('{ scrollTop: true }'), 'Desk view buttons no longer request a jump to the page top');
for (const pointer of ['Mission Statement', 'Grundbeschreibung', 'Theory · Big Picture', 'Scientific Position', 'Paper Family A–F', 'Living Blueprint']) check(html.includes(pointer), `${pointer} is reachable from the lighthouse`);
check(html.includes('keine neue wissenschaftliche Identität') && html.includes('keine kanonische Theorie-Promotion'), 'meta-view boundary prevents authority promotion');
check(focusStart >= 0 && focusEnd > focusStart, 'Science Portfolio Focus Board remains a bounded Desk lens');
check(focusBoard.includes('Reihenfolge vom 22.11. · Priorität abgeglichen') && focusBoard.includes('SP · R2'), 'priority board carries the current review date and revision');
check(focusBoard.includes('M‑CURATE01 · Vorhandenes kuratieren') && focusBoard.includes('Formale Review-Übergabe geparkt'), 'the portfolio priority matches Mission Control and keeps SCC-003 on hold');
check(focusBoard.includes('A0‑BL‑053 · Pascal–Quaternion Review') && focusBoard.includes('PRED‑01 · unabhängiger Methodenreview'), 'later science review candidates stay sequenced and inactive');
check(focusBoard.includes('A0‑BL‑056') && focusBoard.includes('OWNER DEFERRED'), 'the admitted CLP record is parked rather than shown as current work');
check(focusBoard.includes('BUILD BOUNDARY') && focusBoard.includes('NOTES ONLY'), 'new engineering work remains stopped under the current portfolio direction');
check(focusBoard.includes('M‑PUB01') && focusBoard.includes('MONITOR ONLY'), 'the public schedule is observation-only rather than the active priority');
check(focusBoard.includes('A0 PUBLIC CUT') && focusBoard.includes('LIVE · RECEIPTED'), 'the current nexah.de projection is recorded as a closed public return');
check(!focusBoard.includes('M‑PUB01 · Gate 0 schließen') && !focusBoard.includes('D1–D2 konstruktiv verifizieren'), 'superseded October action cards no longer drive the current board');
check(html.includes('Historischer Arbeitsfaden · Snapshot vom 3. November 2026') && html.includes('sie steuern den Desk nicht mehr'), 'the former current-work block is explicitly retained as history rather than current priority');

console.log(`PASS ${checks.length} · Science Desk meta navigator consolidates theory, method, evidence, papers and currentness without a new authority surface.`);
