const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const bookHome = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
assert.match(bookHome,/aria-label="Position in A0"/,'A0 home exposes its own internal position');
assert.match(bookHome,/A view into the NEXAH Cosmos\./,'A0 threshold names the Cosmos UX view');
assert.match(bookHome,/history\.scrollRestoration = "manual"/,'A0 home disables browser scroll restoration for the declared #top entry');
assert.match(bookHome,/document\.querySelectorAll\("\.portal-house iframe, model-viewer"\)/,'A0 home holds #top while its previews settle');
assert.match(bookHome,/addEventListener\("pageshow", \(\) => requestAnimationFrame\(restoreHomeTop\)\)/,'restored A0 home pages return to the declared top');
assert.match(bookHome,/„NEXAH Cosmos“ bezeichnet hier diese Human-facing UX-Ansicht/,'Cosmos label is bounded as a view, not a new authority');
assert.match(bookHome,/40%20EXPERIENCE%20PRODUCTION\/NEXAH-Experience\/dist\/index\.html/,'A0 previews the composed release artifact instead of copying editable website source');
assert.match(bookHome,/UNDERSTAND · STAGING/,'A0 identifies the composed artifact as the current Owner staging view');
assert.match(bookHome,/data-a0-nexah-stage-preview/,'A0 marks the NEXAH Science preview for the canonical Staging-root binding');
assert.match(bookHome,/data-a0-nexah-stage/,'the NEXAH Science card opens the website stage inside the existing A0 acceptance frame');
assert.match(bookHome,/Aktueller nexah\.de-Stagingstand mit öffentlicher Science, About, Library, Legal und den weiteren öffentlichen Seiten/,'A0 describes the integrated public staging surface');
for (const hatch of ['Map &amp; Atlas','Library &amp; Papers','Instruments &amp; Games','Repositories &amp; Sources','Build &amp; Matter','Connect &amp; Return']) assert.ok(bookHome.includes(hatch),`ecosystem hatch missing: ${hatch}`);
assert.match(bookHome,/NEXAHEDRON · Human/,'the four-window portal includes the Human View');
assert.match(bookHome,/Builder \+ Werkbank/,'the four-window portal includes the Workbench');
assert.match(bookHome,/Scarabæus 1033/,'the four-window portal includes the Builder projection');
assert.doesNotMatch(bookHome,/href="[^"]*(?:A0_RESEARCH_DESK|A0_RESEARCH_BACKLOG|A0_BUILDER_LOG|A0_LABORATORY)\.html/,'ecosystem hatches do not expose internal desks');
assert.doesNotMatch(bookHome,/Eine Stimme gehört zum Record\./,'A0 home leaves the Human Voice/Record presentation to NEXAHEDRON');
assert.match(bookHome,/<template id="a0-built-world-concept" data-disposition="nexahedron-human-view-candidate">/,'the Built World concept is removed from the active A0 flow and retained for Human View disposition');
assert.equal((bookHome.match(/<article class="portal-house /g)||[]).length,4,'A0 starts with exactly four embedded portal windows');
assert.equal((bookHome.match(/id="scientific-position-entry"/g)||[]).length,1,'one visible position-report entry');
assert.ok(bookHome.indexOf('id="scientific-position-entry"')<bookHome.indexOf('id="wegweiser"'),'position report before instrument directory');
assert.ok(bookHome.includes('Was macht NEXAH konkret?'));
assert.ok(bookHome.includes('href="A0_SCIENTIFIC_POSITION_REPORT.html"'));
assert.ok(bookHome.includes('href="A0_SCIENTIFIC_POSITION_REPORT.html#currentness-20261024"'));
assert.ok(bookHome.includes('Historischer A0 Status vom 12. Oktober 2026'));
assert.ok(!bookHome.includes('Mission Control valid · 393 sources'),'historical count is not a live validity badge');
assert.ok(fs.readFileSync(path.join(root,'A0_SCIENTIFIC_POSITION_REPORT.html'),'utf8').includes('id="currentness-20261024"'),'currentness target exists');
const navigation = fs.readFileSync(path.join(root, 'a0-context-navigation.js'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'a0-context-navigation.css'), 'utf8');
assert.doesNotMatch(navigation,/positionLink|a0-scientific-position-direct/,'no duplicate top-level position button');
assert.doesNotMatch(styles,/a0-scientific-position-direct/,'obsolete direct-button styles removed');
assert.match(styles,/\.top\.a0-context-ready:not\(\.a0-context-quiet\)>\.a0-reader-lanes\{display:flex\}/,'Reader shortcuts survive page-local mobile nav hiding');
assert.match(styles,/\.a0-reader-lanes\{flex-wrap:wrap;overflow-x:visible\}/,'direct entry wraps on mobile');
assert.match(styles,/\.a0-workspace-icon svg\{[^}]*fill:none/,'desk symbols remain outlined foreground icons instead of black filled shapes');
assert.match(navigation,/const workbenchEntry = document\.createElement\("details"\)/,'THE MACHINA is an expandable room beside the restored Builder lane');
assert.match(navigation,/const registerEntry = document\.createElement\("a"\)/,'the existing source-bound Register has a direct A0 shortcut beside Workbench');
assert.match(navigation,/NEXAH A0 · gemeinsames Portal/,'brand is the one A0 portal return');
assert.match(navigation,/brand\.href = "index\.html#top"/,'A0 portal return always targets the page start');
assert.match(navigation,/brand\.addEventListener\("click", \(event\) =>/,'same-page Home clicks have an explicit top action');
assert.match(navigation,/target\.pathname !== location\.pathname \|\| target\.hash !== "#top"/,'same-page Home remains active with preview revision parameters');
assert.doesNotMatch(navigation,/target\.search !== location\.search/,'preview revision parameters do not disable the same-page Home action');
assert.match(navigation,/window\.scrollTo\(0, 0\)/,'same-page Home clicks return to the actual viewport top');
assert.match(navigation,/readerLanes\.filter\(\(lane\) => lane\.key !== "human"\)\.forEach/,'A0 Science and Builder are the internal expandable lanes');
assert.doesNotMatch(navigation,/const benchMenu =/,'Werkbank is integrated into Builder instead of duplicated as a top-level lane');
for (const section of ['Highlights · aktueller Build','Workbench','Demonstratoren','Bestand & Status']) assert.ok(navigation.includes(`"label": "${section}"`),`Builder separates ${section}`);
assert.match(navigation,/A0_LIVING_BLUEPRINT\.html#open-questions[\s\S]*?Status & offene Fragen/,'Builder status group returns to the existing read-only Blueprint questions');
assert.ok(!navigation.includes('"label": "Flagship Labs"'),'Builder directory no longer repeats the primary flagship cards');
assert.match(navigation,/A0_SPIN_TO_BLOOM_MEASUREMENT\.html#edelweissBridge[^\n]*EDELWEISS/,'Builder foregrounds the existing Edelweiß bridge as its current flagship');
assert.match(styles,/\.a0-showcase-card--edelweiss\{/,'Edelweiß flagship has a distinct navigation accent');
assert.match(styles,/\.a0-flagship-constellation\{/,'major flagships have one compact constellation');
assert.doesNotMatch(navigation,/const dataMenu =/,'Data and registers no longer form a duplicate top-level lane');
assert.doesNotMatch(navigation,/humanBookDraftHref|humanBookDraftLink|a0-human-draft-entry/,'the archived Human Book integration draft is no longer exposed in live A0 navigation');
assert.doesNotMatch(styles,/\.a0-human-draft-entry\{/,'archived draft has no live-navigation styling');
assert.doesNotMatch(navigation,/class="a0-reader-home"/,'Reader panels do not repeat the house entry');
assert.match(navigation,/if \(!laneIsCurrent && lane\.key !== "builder"\)/,'A0 Builder always opens its panel while other inactive houses retain their entry behavior');
assert.match(navigation,/workbenchEntry\.className = "a0-workbench-entry"/,'THE MACHINA remains the existing house identity');
assert.match(navigation,/const machinaRooms = \[/,'THE MACHINA owns one explicit room dropdown');
assert.match(navigation,/window\.location\.href = lane\.entry/,'inactive local houses open their own entry page');
assert.match(navigation,/\$\{lane\.label\} Navigation öffnen/,'the current house exposes its navigation as the second action');
assert.match(navigation,/"entry": "A0_BUILDER_TOY_STORE\.html#bench-page-top"/,'the restored expandable Builder lane enters through the normal A0 Builder source');
assert.match(navigation,/\|\| null\);/,'unlisted tool and register pages do not fall back to a false Science current state');
assert.doesNotMatch(navigation,/\|\| readerLanes\[1\]/,'Science is never the implicit fallback lane');
const scienceEntry=fs.readFileSync(path.join(root,'NEXAH_SCIENCE.html'),'utf8');
const a0ScienceEntry=fs.readFileSync(path.join(root,'A0_SCIENCE.html'),'utf8');
assert.match(a0ScienceEntry,/<a class="btn gold" href="A0_SCIENTIFIC_POSITION_REPORT.html">Scientific Position/);
assert.ok(scienceEntry.includes('id="who-we-are"') && scienceEntry.includes('href="/about/"'),'public Science identifies NEXAH and links its canonical About page');
assert.ok(scienceEntry.includes('https://github.com/Scarabaeus1031/NEXAH') && scienceEntry.includes('https://github.com/Scarabaeus1031/NEXAH-Science-Lab'),'public Science exposes Core and Laboratory repositories');
assert.doesNotMatch(scienceEntry,/href="(?:A0_|index\.html|NEXAH_C_CONNECT)/,'public Science does not route into A0 yet');
for (const [name, source] of [['index.html',bookHome],['NEXAH_SCIENCE.html',scienceEntry],['A0_SCIENTIFIC_POSITION_REPORT.html',fs.readFileSync(path.join(root,'A0_SCIENTIFIC_POSITION_REPORT.html'),'utf8')]]) {
  for (const internal of ['A0_RESEARCH_DESK.html','A0_RESEARCH_BACKLOG.html','A0_BUILDER_LOG.html','A0_LABORATORY.html']) assert.ok(!source.includes(`href="${internal}`),`${name} has no public route into ${internal}`);
  assert.ok(!source.includes('SCIENCE_LAB/NAVIGATION/APP/'),`${name} does not route to the internal Navigator app`);
}
assert.match(fs.readFileSync(path.join(root,'A0_THEORY_STORYBOARD.html'),'utf8'),/<a href="A0_SCIENTIFIC_POSITION_REPORT.html">Science · Scientific Position<\/a>/);
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'A0_BOOK_MANIFEST.json'), 'utf8'));
// The ARKADE build-root template is not a source-directory Reader page.
const registered = [...new Set(manifest.surface_registry.map((record) => record.surface.split('#')[0]).filter((surface) => surface.endsWith('.html') && surface !== 'a0-public-arkade-index.html'))];
const archivedReaderSurfaces = new Set(['NEXAH_SCIENCE.html']);

for (const surface of registered) {
  if (archivedReaderSurfaces.has(surface)) continue;
  assert.ok(navigation.includes(surface), `${surface} must be reachable from the shared Reader navigation`);
}

for (const token of [
  'Reader nach Perspektive',
  'Auf dieser Seite',
  'A0 Science',
  'Intern · Arbeitsbereich',
  'Szenen · Deep Links',
  'Wo wir stehen',
  'C · Connect'
]) assert.ok(navigation.includes(token), `navigation contract missing: ${token}`);

const lanes=JSON.parse(navigation.match(/const readerLanes = (\[[\s\S]*?\n  \]);/)[1]);
assert.deepEqual(lanes.map(l=>[l.key,l.code,l.label]),[['human','H','NEXAHEDRON · Human'],['science','S','A0 · Science'],['builder','B','A0 · Builder']]);
assert.equal(lanes.find(l=>l.key==='builder').entry,'A0_BUILDER_TOY_STORE.html#bench-page-top','A0 Builder and the Scarabæus public projection remain distinct routes to the shared source');
assert.match(navigation,/const builderShowcaseHome = \["index\.html\?projection=builder-showcase", "A0 Builder Home"/,'the A0 Builder home reuses the existing long source-bound projection');
assert.doesNotMatch(navigation,/summary\.setAttribute\("data-a0-builder-showcase", ""\)/,'the Builder lane opens its navigation directly instead of intercepting the first click');
assert.match(navigation,/A0_WERKBANK\.html#bench-page-top">Werkbank · Start/,'A0 Navigator exposes Workbench as a direct start route');
assert.equal(lanes.find(l=>l.key==='human').entry,'https://nexahedron.com/','Human home is the canonical NEXAHEDRON start page');
const humanLane=lanes.find(l=>l.key==='human');
assert.ok(humanLane.sections.flatMap(section=>section.items).some(([href,label])=>href==='A0_OPIUM.html#entrance'&&label==='OPIUM / Club'),'Human navigation exposes the existing OPIUM entrance');
const scienceLane=lanes.find(l=>l.key==='science');
assert.equal(scienceLane.entry,'A0_SCIENCE.html');
assert.ok(scienceLane.sections[0].label.startsWith('Wo wir stehen'));
assert.equal(scienceLane.sections[0].items[0][0],'A0_SCIENTIFIC_POSITION_REPORT.html');
assert.equal(scienceLane.sections[1].label,'Papers');
assert.ok(scienceLane.sections.some(section=>section.label.startsWith('A0 NSNavigator')),'Science owns the A0 NSNavigator register lens');
assert.ok(scienceLane.sections.flatMap(section=>section.items).some(([href])=>href==='A0_DATA_AND_REGISTERS.html#top'),'Science exposes the existing data/register map');
const internalTargets=new Set(['A0_RESEARCH_DESK.html','A0_F_A0_26_REVIEW_PROBE.html','A0_RESEARCH_BACKLOG.html','A0_BUILDER_LOG.html','A0_LABORATORY.html']);
for(const lane of lanes)for(const section of lane.sections)for(const [href] of section.items)assert.ok(!internalTargets.has(href.split('#')[0]),'no internal workspace in Reader menus: '+href);
assert.match(navigation,/header.replaceChildren\(brand, laneNav, workspaceOverview, overview\)/,'header separates A0 lanes from right-side work overviews');
assert.match(navigation,/workspaceOverview\.className = "a0-workspace-overviews"/,'right-side workspace overview group exists');
assert.match(navigation,/workspaceOverview\.append\(scienceDeskLink, builderDeskLink\)/,'Science and Builder desks are direct compact icon routes');
assert.match(navigation,/workspaceOverview\.append\(missionControlLink\)/,'Mission Control is grouped with the work overviews');
assert.doesNotMatch(navigation,/workspaceOverview\.append\(humanBookDraftLink\)/,'the archived Human Book draft has no visible A0 control');
assert.doesNotMatch(navigation,/nexahScienceStagingLink|a0-nexah-science-staging-link/,'the redundant NEXAH Science staging workspace control is removed');
assert.doesNotMatch(navigation,/summary\.setAttribute\("data-a0-nexah-stage"/,'A0 Science no longer doubles as the nexah.de staging trigger');
assert.match(navigation,/nexahPublic\.href = "https:\/\/nexah\.de\/"/,'nexah.de is a separate public channel');
assert.match(navigation,/nexahedronPublic\.href = "https:\/\/nexahedron\.com\/"/,'NEXAHEDRON is a separate public channel');
assert.match(navigation,/scarabaeusPublic\.href = "https:\/\/www\.scarabaeus1033\.net\/"/,'Scarabæus is a separate public channel');
assert.match(navigation,/readerLanes\.filter\(\(lane\) => lane\.key !== "human"\)/,'the A0 lane row is separated from the three public websites');
assert.match(navigation,/\["A0_WERKBANK\.html#bench-page-top", "WERKBANK · START"/,'THE MACHINA dropdown keeps the Workbench start room');
assert.match(navigation,/\["A0_ORIENTATION_CONTROLLER_BENCH\.html#benchWorkDesk", "04 · FULL BENCH"/,'THE MACHINA dropdown reaches the existing full bench');
assert.match(navigation,/registerEntry\.href = "A0_DATA_AND_REGISTERS\.html#top"/,'A0 Register reuses the existing Science-owned locator page');
assert.match(navigation,/A0_RESEARCH_DESK\.html\?desk=research&rev=desk-top-r2#top/,'Science Desk starts at the top of its selected view with a fresh in-app-browser revision');
assert.match(navigation,/builderDeskLink\.href = builderDeskHref/,'Builder Desk remains a direct existing route');
assert.match(navigation,/href\.startsWith\("\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/"\)/,'localhost rebases existing ecosystem links onto the reachable workspace server');
assert.doesNotMatch(navigation,/nexah-public-connect|connectDot/,'A0 global navigation has no ambiguous pink Connect point');
assert.doesNotMatch(a0ScienceEntry,/NEXAH_C_CONNECT|science-connect-dot/,'A0 Science does not repeat the public Connect control');
assert.match(navigation,/class="a0-builder-scarab"/);
assert.doesNotMatch(navigation,/class="a0-owner-nexah"/,'the retired standalone staging diamond is absent');
assert.match(navigation,/const nexahStagingHref =/,'NEXAH Science reuses the existing local website stage');
assert.match(navigation,/const ownerFrameParams = new URLSearchParams\(location\.search\)[\s\S]*?const requestedNexahPath = ownerFrameParams\.get\("nexah-path"\)/,'A0 accepts one generic owner-frame path handoff from the NEXAH stage');
assert.match(navigation,/requested\.origin === stagingOrigin \? requested\.href : nexahStagingHref/,'owner-frame handoff remains restricted to the NEXAH staging origin');
assert.match(navigation,/href: nexahProjectionHref/,'the existing NEXAH projection opens the requested website path without creating a second A0 route tree');
assert.match(navigation,/const scarabaeusA0Href = "A0_BUILDER_TOY_STORE\.html\?edition=scarabaeus"/,'Scarabæus is now the Builder edition inside A0');
assert.doesNotMatch(navigation,/quickNav|pageTools|primaryNav|pageContext/,'duplicate global navigation layers removed');
assert.match(navigation,/overviewSummary.textContent = "A0 Navigator"/);
assert.match(navigation,/if \(internalPages\.has\(file\)\) overviewBody\.append\(internalMenu\)/,'internal menu only mounts on internal work pages');
assert.match(navigation,/file === "index.html"\) \{/,'directory only on book home');
assert.match(navigation,/main.append\(directory\)/,'directory no longer precedes page content');
assert.match(navigation,/const directory = document.createElement\("details"\)/,'directory folded by default');
assert.match(navigation,/group.sections.filter\(section => !section.internal\)/,'internal inventory not shown as Reader directory');
assert.match(navigation, /A0_SCIENTIFIC_POSITION_REPORT\.html/);
assert.ok(scienceEntry.includes('id="contributions"'),'reader contributions have a Science home');
assert.ok(a0ScienceEntry.includes('id="understand"'),'the preserved A0-specific Science reader remains available');
const dataRegisters=fs.readFileSync(path.join(root,'A0_DATA_AND_REGISTERS.html'),'utf8');
assert.equal((dataRegisters.match(/class="register-window(?: local-only)?"/g)||[]).length,5,'five register families expose one calm overview window each');
for(const preview of ['A0 Science Desk · Register','NEXAH Science · Quellen &amp; Relationen','Ecosystem Source Field · Locator','A0 · Asset Index','nexah.de · Library']) assert.ok(dataRegisters.includes(`data-window="${preview}"`),`register preview missing: ${preview}`);
assert.ok(!dataRegisters.includes('data-window="Mission Control · Current"'),'Mission Control Current is not a data/register family');
assert.match(dataRegisters,/\.register-window iframe\{[^}]*pointer-events:none/,'register overview windows remain screenshot-like and non-interactive');

for (const selector of ['.a0-reader-lanes', '.a0-reader-panel', '.a0-context-compact', '.a0-page-menu-body']) {
  assert.ok(styles.includes(selector), `shared style missing: ${selector}`);
}
assert.match(styles, /@media\(max-width:820px\)/);
assert.match(styles, /@media\(max-width:560px\)/);

// Public-entry source template uses deployment-root book/ links; it is not a local Reader page.
const htmlFiles = fs.readdirSync(root).filter((name) => name.endsWith('.html') && name !== 'a0-public-arkade-index.html');
const groups = JSON.parse(navigation.match(/const navigationGroups = (\[[\s\S]*?\]);/)[1]);
assert.equal(groups.length,4);
const resultGroup=groups.find(g=>g.key==='desk');
assert.equal(resultGroup.entry,'A0_SCIENTIFIC_POSITION_REPORT.html','results primary action opens position report');
assert.equal(resultGroup.title,'Ergebnisse & Papers');
assert.deepEqual(new Set(resultGroup.sections.filter(s=>s.internal).flatMap(s=>s.pages)),internalTargets,'all internal pages retained separately');
const groupedPages = groups.flatMap(g=>g.sections.flatMap(s=>s.pages));
assert.equal(new Set(groupedPages).size,groupedPages.length,'one primary navigation home per HTML');
const activeHtmlFiles = htmlFiles.filter((name) => !archivedReaderSurfaces.has(name));
assert.deepEqual([...groupedPages].sort(), [...activeHtmlFiles].sort(), 'all active top-level HTMLs have a navigation home');
for (const group of groups) {
  assert.ok(htmlFiles.includes(group.entry), 'existing main page');
  for (const name of group.sections.flatMap(s=>s.pages)) assert.ok(fs.existsSync(path.join(root,name)),name);
}
assert.match(navigation,/a0-navigation-directory/);
assert.match(navigation,/F1–F7 sind übergreifende Funktionen/);
for (const action of ['Lesen','Zusammenhänge verstehen','Werkzeuge nutzen','Ergebnisse einordnen']) assert.ok(navigation.includes(action));
assert.doesNotMatch(navigation,/header.after\(primaryNav\)|header.after\(moduleNav\)/,'no additional top-level navigation strips');
const shared = htmlFiles.filter((name) => fs.readFileSync(path.join(root, name), 'utf8').includes('a0-context-navigation.js'));
// Newer standalone log/storyboard retain their own controls; explicit tour return is required.
assert.deepEqual(htmlFiles.filter((name) => !shared.includes(name)).sort(), ['A0_7_11_TYPED_CROSSWALK.html', 'A0_ASSET_INDEX.html', 'A0_BUILDER_LOG.html', 'A0_CROWN_SHADOW_CONTACT_BENCH.html', 'A0_CURSOR_HANDOFF_CLICKDUMMY.html', 'A0_IOTA_BRIDGE_DEMONSTRATOR.html', 'A0_LOOK_AGAIN_PLAY.html', 'A0_ONE_PULSE_BENCH_MONITOR.html', 'A0_OPIUM.html', 'A0_PENTAGON_BODY_RETURN_GUIDED.html', 'A0_THEORY_STORYBOARD.html', 'A0_TOWER_RETURN_DEMONSTRATOR.html', 'LAB_ORIENTATION_MACHINE.html', 'NEXAH_SCIENCE.html']);
for (const surface of ['A0_BUILDER_LOG.html', 'A0_THEORY_STORYBOARD.html']) {
  assert.ok(fs.readFileSync(path.join(root, surface), 'utf8').includes('href="A0_TOURS.html"'), surface + ' retains an explicit tour return');
}
for (const surface of activeHtmlFiles) assert.ok(navigation.includes(surface), surface + ' is linked from shared Reader navigation');
assert.ok(navigation.includes('Wo wir stehen · Ergebnisse & Einordnung'));
assert.ok(navigation.includes('A0_TOURS.html#historical-htmls'));

const livingBlueprint = fs.readFileSync(path.join(root, 'A0_LIVING_BLUEPRINT.html'), 'utf8');
assert.match(livingBlueprint, /a0-context-navigation\.css\?rev=flagship-constellation-r1-20261030/);
assert.match(livingBlueprint, /a0-context-navigation\.js\?rev=flagship-constellation-r1-20261030/);

const human = fs.readFileSync(path.join(root, 'A0_NEXAH_APERTURE_JOURNEY.html'), 'utf8');
assert.ok(human.includes('href="index.html"') && human.includes('href="A0_GAME_OF_WORLDS_PLAY.html#pulse"') && human.includes('href="A0_THE_LIVING_INTERIOR.html'), 'quiet Human journey retains explicit portal, play and Living Interior exits');
console.log(JSON.stringify({ status: 'PASS', registeredReaders: registered.length, sharedNavigationSurfaces: shared.length, standaloneSurfaces: htmlFiles.length - shared.length, allLocalHtmlReachable: htmlFiles.length }, null, 2));
