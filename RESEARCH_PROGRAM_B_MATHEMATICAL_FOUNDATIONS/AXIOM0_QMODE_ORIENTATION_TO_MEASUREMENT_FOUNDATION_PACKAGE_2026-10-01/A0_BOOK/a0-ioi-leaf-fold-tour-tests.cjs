#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const leafPath = path.join(__dirname, 'DRAFTS', 'A0_IOI_LEAF_FOLD_RETURN_2026-11-02.html');
const commonStartPath = path.join(__dirname, 'DRAFTS', 'A0_IOI_LEAF_FOLD_OPEN_BOOK_START_2026-11-02.html');
const openBookPath = path.join(__dirname, 'DRAFTS', 'IOI_PRIME_OPEN_BOOK_COMPOSITION.html');
const ioiSourcePath = path.join(__dirname, 'DRAFTS', 'IOI_PRINCIPLE_90_DEGREE_FOLD_CANDIDATE.html');
const primeSourcePath = path.join(__dirname, 'DRAFTS', 'PRIME_FOLDINGS_SIDE_STUDY.html');
const openBookAssetsPath = path.join(__dirname, 'DRAFTS', 'ioi_open_book_assets');
const leaf = fs.readFileSync(leafPath, 'utf8');
const commonStart = fs.readFileSync(commonStartPath, 'utf8');
const openBook = fs.readFileSync(openBookPath, 'utf8');
const ioiSource = fs.readFileSync(ioiSourcePath, 'utf8');
const primeSource = fs.readFileSync(primeSourcePath, 'utf8');
let checks = 0;

function ok(condition, message) {
  checks += 1;
  if (!condition) throw new Error(`FAIL ${checks}: ${message}`);
}

const germanScrabble = Object.freeze({
  A:1, B:3, C:4, D:1, E:1, F:4, G:2, H:2, I:1, J:6, K:4, L:2, M:3,
  N:1, O:2, P:4, Q:10, R:1, S:1, T:1, U:1, V:6, W:3, X:8, Y:10, Z:3
});
const normalizeWord = word => word.toUpperCase().replace(/[^A-Z]/g, '');
const a1z26 = word => [...normalizeWord(word)].reduce((sum, letter) => sum + letter.charCodeAt(0) - 64, 0);
const scrabbleScore = word => [...normalizeWord(word)].reduce((sum, letter) => sum + germanScrabble[letter], 0);

ok(leaf.includes('id=&quot;leaf-fold-tour&quot;'), 'Leaf Fold contains the guided-tour source section');
ok(leaf.includes('id="leaf-reader-home"') && leaf.includes('← COMMON START'), 'Outer Leaf reader keeps a persistent return to the common start');
ok(leaf.includes('id="leaf-reader-mode"') && leaf.includes('LESEMODUS'), 'Outer Leaf reader exposes an explicit reading mode');
ok(leaf.includes('id="leaf-reader-play"') && leaf.includes('▶ PLAY ALL'), 'Outer Leaf reader exposes the inner tour at shell level');
ok(leaf.includes('id="leaf-reader-book"') && leaf.includes('OPEN BOOK ↗'), 'Outer Leaf reader exposes the coupled Open Book window');
ok(leaf.includes('id="leaf-reader-fullscreen"') && leaf.includes('requestFullscreen'), 'Outer Leaf reader exposes a real fullscreen control');
ok(leaf.includes('leaf-reader-active') && leaf.includes('max-width:960px') && leaf.includes('line-height:1.72'), 'Reading mode creates a narrower long-form reading measure');
ok(leaf.includes("doc?.querySelector('#leaf-tour-start')") && leaf.includes('target.click()'), 'Outer Play All delegates to the existing source-bound tour controller');
ok(leaf.includes('A0_IOI_LEAF_FOLD_OPEN_BOOK_START_2026-11-02.html') && leaf.includes('Gemeinsamer Start'), 'Leaf Fold exposes the common start route');
ok(leaf.includes('id=&quot;leaf-common-start&quot;') && leaf.includes('window.top.location.href = href') && leaf.includes('window.open(href, &#x27;_top&#x27;)'), 'Leaf Fold promotes the common start route out of the embedded presentation');
ok(leaf.includes('IOI Leaf Fold · geführte Demo'), 'Tour has a visible demo title');
ok((leaf.match(/data-leaf-tour-step=&quot;[0-6]&quot;/g) || []).length === 7, 'Tour exposes exactly seven ordered stations');
ok(leaf.includes('7 STOPS · LIVE INSTRUMENTS · EDELWEISS'), 'Tour declares its live-instrument and Edelweiss contract');
ok(leaf.includes('101 SOURCE') && leaf.includes('Q-CUT') && leaf.includes('OPEN BOOK'), 'Tour begins with Source, Q-Cut and Open Book');
ok(leaf.includes('CUBE PIVOT') && leaf.includes('TWO HANDS') && leaf.includes('H8 STACK') && leaf.includes('07&lt;br&gt;RETURN'), 'Tour ends through Cube, Two Hands, H8 and Return');
ok(leaf.includes('IOI_PRIME_OPEN_BOOK_COMPOSITION.html#letterSyllableLens'), 'Leaf Fold links to the existing Open Book letter/syllable lens');
ok(leaf.includes("leafTourHash === &#x27;#leaf-tour-cube&#x27;") && leaf.includes('window.parent.location.hash'), 'Leaf Fold recognizes the outer Open Book return hash inside the srcdoc');
ok(leaf.includes("target: &#x27;#ioi-fold-state&#x27;") && leaf.includes("target: &#x27;#qcut-title&#x27;") && leaf.includes("target: &#x27;#glb-world-title&#x27;"), 'Tour controller binds Source, Q-Cut and the visible Edelweiss GLB station');
ok(leaf.includes("target: &#x27;#h4-h5-two-hand-bridge&#x27;") && leaf.includes("target: &#x27;#h8-record-deck-mode-lens&#x27;") && leaf.includes("target: &#x27;#protocol-ledger&#x27;"), 'Tour controller binds the final three internal instruments');
ok(leaf.includes("qcutStep.value = &#x27;5&#x27;"), 'Q-Cut tour stop deterministically selects Q90 as five 18-degree steps');
ok(leaf.includes('OBS-34') && leaf.includes('Open Book Return Route'), 'Ledger records the source-bound demo route');
ok(leaf.includes('id=&quot;q4-antipode-ledger&quot;') && leaf.includes('Antipoden und Fenster'), 'Leaf Fold connects the existing Q4 antipode and window ledger');
ok(leaf.includes('../A0_Q4_MAGIC_SQUARE_JOINT_AUDIT.html') && leaf.includes('../A0_ORIENTATION_CONTROLLER_BENCH.html#coupledWindowHub'), 'Q4 window links return to both existing source-bound audits');
ok(leaf.includes('x+R180(x)=17') && leaf.includes('v+T(2,2)(v)=15'), 'Q4 ledger keeps the two carrier-specific complement involutions distinct');
ok(leaf.includes('Khajuraho toroidal 2×2 = 34') && leaf.includes('Dürer planar 2×2 variiert'), 'Q4 ledger includes the uniform-window result and its negative control');
ok(leaf.includes('data-kv-word=&quot;LUX&quot;') && leaf.includes('data-kv-word=&quot;PINK&quot;') && leaf.includes('data-kv-word=&quot;BLUE&quot;'), 'KV/TESA bench exposes LUX, PINK and BLUE as direct fixtures');
ok(leaf.includes('id=&quot;kv-a1z26-sum&quot;') && leaf.includes('id=&quot;kv-scrabble-score&quot;'), 'Word fixtures expose A1Z26 and declared German Scrabble readouts');
ok(leaf.includes('const kvScrabbleDe = { A:1, B:3, C:4') && leaf.includes('X:8, Y:10, Z:3'), 'German Scrabble tile table is frozen in the local test contract');
ok(leaf.includes('LUX 57 / 11 · PINK 50 / 10 · BLUE 40 / 7'), 'Visible fixture summary records the expected A1Z26 and German Scrabble totals');
ok(a1z26('LUX') === 57 && a1z26('PINK') === 50 && a1z26('BLUE') === 40, 'Independent A1Z26 fixture calculation reproduces the three declared totals');
ok(scrabbleScore('LUX') === 11 && scrabbleScore('PINK') === 10 && scrabbleScore('BLUE') === 7, 'Independent German Scrabble fixture calculation reproduces the three declared totals');
ok(leaf.includes('OBS-35') && leaf.includes('OBS-36') && leaf.includes('H34'), 'Ledger and status table record Q4 and word-projection returns');
ok(leaf.includes('Magische Summen, Dezimalquersummen, Scrabblewerte, Farbrollen und Cube-Geometrie sind verschiedene Typen'), 'Integration preserves the type and claim boundary');
ok(openBook.includes('id="letterSyllableLens"'), 'Open Book retains its letter/syllable source lens');
ok(openBook.includes('id="progressionCube"'), 'Open Book retains the AL-to-Cube-to-PINKY progression pivot');
ok(openBook.includes('id="leafFoldReturn"'), 'Open Book exposes a return control to the Leaf Fold demo');
ok(openBook.includes('id="commonStartReturn"') && openBook.includes('COMMON START ⌂'), 'Open Book exposes the common start route');
ok(openBook.includes('href="A0_IOI_LEAF_FOLD_OPEN_BOOK_START_2026-11-02.html"'), 'Open Book resolves the common start through a portable relative route');
ok(openBook.includes('A0_IOI_LEAF_FOLD_RETURN_2026-11-02.html#leaf-tour-cube'), 'Open Book returns specifically to the Cube tour station');
ok(openBook.includes('href="A0_IOI_LEAF_FOLD_RETURN_2026-11-02.html#leaf-tour-cube"'), 'Open Book return works in file and local-server modes through a relative route');
ok(openBook.includes('data-file-src="../assets/game-of-worlds-play/ioi-world-cube/index.html?embed=progression"'), 'Open Book resolves the progression cube inside the canonical A0 package');
ok(fs.readdirSync(openBookAssetsPath).filter(name => name.endsWith('.png')).length === 7, 'Frozen Open Book bundle retains all seven referenced image assets');
ok(!leaf.includes('src=&quot;file:///Users/tho2020/Desktop/00_INCOMING/IOI_PRIME_OPEN_BOOK_COMPOSITION.html'), 'Leaf Fold does not duplicate or iframe the Open Book source');
ok(openBook.includes('>OPEN CHURCH</button>') && openBook.includes("storyToggle.textContent = isStory ? 'CLOSE CHURCH' : 'OPEN CHURCH'"), 'Church control names the available action rather than the current surface');
ok(openBook.includes('.shell[data-surface="story"] .controls > :not(#storyToggle):not(#leafFoldReturn):not(#commonStartReturn) { display: none; }'), 'Church surface removes unrelated book controls while preserving both return routes');
ok(openBook.includes('.shell[data-surface="story"] #storyToggle[aria-pressed="true"]') && openBook.includes('background: var(--pink)'), 'Church close action is visibly pink');
ok(openBook.includes('PIN LINK · OFF') && openBook.includes('L↔R SCROLL · OFF'), 'Both coupling channels expose an explicit initial state');
ok(openBook.includes("data.type !== 'ioi-open-book-scroll'") && openBook.includes("type:'ioi-open-book-scroll-to'") && !openBook.includes('let syncing = false'), 'Parent relays proportional scrolling and relies on child-side echo suppression');
ok(openBook.includes("bindDirectScroll(ioiFrame, 'ioi')") && openBook.includes("bindDirectScroll(primeFrame, 'prime')") && openBook.includes('directScrollMute[data.source]'), 'Parent keeps a same-origin fallback with loop suppression');
ok(openBook.includes("type:'ioi-open-book-command', action:'click'") && openBook.includes("type:'ioi-open-book-command', action:'show'"), 'Parent has file-safe command fallbacks for child controls and focus');
ok(openBook.includes('L↔R SCROLL · ${percent}%') && openBook.includes("source === 'ioi' ? 'LINKS' : 'RECHTS'"), 'Scroll coupling exposes direction and percentage feedback');
ok(ioiSource.includes("source:'ioi', ratio:ratio()") && ioiSource.includes("data.type === 'ioi-open-book-scroll-to'"), 'IOI source exposes the embedded scroll bridge');
ok(primeSource.includes("source:'prime', ratio:ratio()") && primeSource.includes("data.type === 'ioi-open-book-scroll-to'"), 'Prime source exposes the embedded scroll bridge');
ok(ioiSource.includes("document.addEventListener('scroll', reportScroll, {capture:true,passive:true})") && primeSource.includes("document.addEventListener('scroll', reportScroll, {capture:true,passive:true})"), 'Both children capture document and window scroll events');
ok(ioiSource.includes("type:'ioi-open-book-control',source:'ioi',kind:'angle'") && ioiSource.includes("kind:'inch'"), 'IOI child reports angle and inch controls across file boundaries');
ok(primeSource.includes("type:'ioi-open-book-control',source:'prime',kind:'prime'") , 'Prime child reports prime controls across file boundaries');
ok(ioiSource.includes("new URLSearchParams(location.search).get('embed') !== 'open-book'") && primeSource.includes("new URLSearchParams(location.search).get('embed') !== 'open-book'"), 'Child bridges remain scoped to the Open Book embed mode');
ok(leaf.includes('id=&quot;leaf-tour-start&quot;') && leaf.includes('id=&quot;leaf-tour-auto&quot;') && leaf.includes('id=&quot;leaf-tour-stop&quot;'), 'Tour exposes start, autoplay/pause and stop controls');
ok(leaf.includes('▶ PLAY ALL · TOUR + INSTRUMENTE'), 'Tour exposes an explicit Play All action');
ok(leaf.includes('.leaf-tour[data-tour-active=&quot;true&quot;] .leaf-tour-stage { position:fixed;'), 'Active tour keeps its explanatory guide visible');
ok(leaf.includes('function moveLeafTourCamera(target)') && leaf.includes('requestAnimationFrame(frame)'), 'Tour uses a controlled animated camera instead of a raw section jump');
ok(leaf.includes('async function playLeafTourInstrument(index)') && leaf.includes('LIVE-INSTRUMENT WIRD BEDIENT'), 'Play All executes a live choreography at every station');
ok(leaf.includes("root.querySelector(&#x27;#number-game-breathe&#x27;)?.click()") && leaf.includes('101 ATEM · CARO → CON–DAO → AU–NA'), 'Station 01 runs the 101 breath cycle');
ok(leaf.includes('for (const step of [0,1,2,5,10,20,5])') && leaf.includes('renderQCut(step)'), 'Station 02 visibly traverses the Q-Cut sequence and returns to Q90');
ok(leaf.includes('SOURCE WINDOW · OPEN BOOK BLEIBT OPTIONAL · PLAY ALL LÄUFT WEITER'), 'Station 03 shows the source boundary without interrupting Play All');
ok(leaf.includes('[data-glb-animation=&quot;EDELWEISS_L_FRAME_WOBBLE&quot;]') && leaf.includes('BINDER → 7 OUTER → 11 LIFT → 11 MIRROR RETURN → O₀'), 'Station 04 visibly activates the Edelweiss GLB clip');
ok(leaf.includes("root.querySelector(&#x27;#two-hand-run-return&#x27;)?.click()"), 'Station 05 runs the two-hand return');
ok(leaf.includes('for (const button of h8ModeButtons)') && leaf.includes('for (const button of h8SpectrumButtons)'), 'Station 06 cycles all six H8 modes and three spectra');
ok(leaf.includes("#protocol-ledger .protocol-ledger &gt; div") && leaf.includes('tour-ledger-pulse'), 'Station 07 pulses ledger entries in sequence');
ok(leaf.includes('cancelLeafTourAction') && leaf.includes('PLAY ALL PAUSIERT · LIVE-AKTION GESTOPPT'), 'Pause stops the active station choreography');
ok(leaf.includes("if (leafTourHash === &#x27;#leaf-tour-cube&#x27;) leafTourIndex = 3;") && leaf.includes('renderLeafTour({ move:false });'), 'Return hash preselects Cube without an immediate scroll jump');
ok(leaf.includes('prefers-reduced-motion:reduce') && leaf.includes('leafTourReducedMotion'), 'Tour respects reduced-motion preferences');
ok(leaf.includes('id=&quot;leaf-tour-progress&quot;') && leaf.includes('leafTourProgress.style.width'), 'Tour exposes visible seven-step progress');
ok(leaf.includes('.leaf-tour-actions [hidden] { display:none !important; }'), 'Inactive tour controls and the source link remain visually hidden');
ok(leaf.includes('let leafTourRenderToken = 0;') && leaf.includes('renderToken !== leafTourRenderToken'), 'New navigation cancels stale camera completion callbacks');
ok(commonStart.includes('2 DOCUMENTS · 1 PIVOT · NO MERGE'), 'Common start declares the two-source non-merge contract');
ok(commonStart.includes('3 WINDOWS · 2 DOCUMENTS · 1 PIVOT · NO MERGE'), 'Common start declares the three-window coupled reading');
ok(commonStart.includes('WINDOW 01 · NUMBER / FOLD / WORLD') && commonStart.includes('WINDOW 02 · CUBE / PIVOT') && commonStart.includes('WINDOW 03 · LETTER / SYLLABLE / BOOK'), 'Common start visibly names all three windows');
ok(commonStart.includes('id="worldCubePivot"') && commonStart.includes('href="../assets/game-of-worlds-play/ioi-world-cube/index.html"'), 'Window 02 opens the existing Game of Worlds cube through a portable package-relative route');
ok(commonStart.includes('Euler Disc ×<br>Fibonacci Algo Cube') && commonStart.includes('BODY</span><span>SHADOW</span><span>GHOST'), 'Window 02 names the Euler/Fibonacci reading and its three view depths');
ok(commonStart.includes('Body, Shadow und Ghost sind drei Ansichten desselben Navigationspivots') && !commonStart.includes('WINDOW 04'), 'World cube remains a depth view of Window 02 rather than a fourth window');
ok(commonStart.includes('THE / OPERATOR · WINDOW / SHUTTER / PIVOT') && commonStart.includes('Zwei Quellen. Ein Durchgang. Zwei Quellen.'), 'Common start introduces the slash as a bounded three-window operator');
ok(commonStart.includes("{state:'two',count:'2'") && commonStart.includes("{state:'one',count:'1'") && commonStart.includes('RUNNING · 2 → 1 → 2'), 'Slash pulse implements the finite 2-to-1-to-2 shutter sequence');
ok(commonStart.includes('Das ist kein Cube-Flächensatz und keine Division.') && commonStart.includes('Kein Merge, keine neue Identität.'), 'Slash sequence preserves its non-identity and non-geometric boundary');
ok(commonStart.includes('A0_IOI_LEAF_FOLD_RETURN_2026-11-02.html#leaf-fold-tour'), 'Common start opens the Leaf Fold Play All tour');
ok(commonStart.includes('IOI_PRIME_OPEN_BOOK_COMPOSITION.html#letterSyllableLens'), 'Common start opens the Open Book letter/syllable lens');
ok(commonStart.includes('keine Source-Graph-Relation') && commonStart.includes('keine wissenschaftliche Aktivierung'), 'Common start preserves governance and activation boundaries');
ok(leaf.includes('OBS-43') && leaf.includes('Slash Window / Shutter Pulse') && leaf.includes('2 → 1 → 2'), 'Leaf ledger records the bounded slash-window pulse');

console.log(JSON.stringify({
  status: 'PASS_SOURCE_BOUND_BIDIRECTIONAL_DEMO',
  checks,
  tour: ['101_SOURCE', 'Q90_CUT', 'OPEN_BOOK', 'CUBE_PIVOT', 'TWO_HANDS', 'H8_STACK', 'LEDGER_RETURN'],
  identity: 'TWO_EXISTING_DOCUMENTS_REMAIN_SEPARATE',
  relation_changes: 0
}));
