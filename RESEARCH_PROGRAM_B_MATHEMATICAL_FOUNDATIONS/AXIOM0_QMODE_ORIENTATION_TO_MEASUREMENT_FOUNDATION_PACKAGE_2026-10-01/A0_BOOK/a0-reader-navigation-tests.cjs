const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const bookHome = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
assert.equal((bookHome.match(/id="scientific-position-entry"/g)||[]).length,1,'one visible position-report entry');
assert.ok(bookHome.indexOf('id="scientific-position-entry"')<bookHome.indexOf('id="wegweiser"'),'position report before instrument directory');
assert.ok(bookHome.includes('Was macht NEXAH konkret?'));
assert.ok(bookHome.includes('href="A0_SCIENTIFIC_POSITION_REPORT.html"'));
assert.ok(bookHome.includes('href="A0_SCIENTIFIC_POSITION_REPORT.html#currentness-20261019"'));
assert.ok(bookHome.includes('historischer Status-Snapshot 12. Oktober 2026'));
assert.ok(!bookHome.includes('Mission Control valid · 393 sources'),'historical count is not a live validity badge');
assert.ok(fs.readFileSync(path.join(root,'A0_SCIENTIFIC_POSITION_REPORT.html'),'utf8').includes('id="currentness-20261019"'),'currentness target exists');
const navigation = fs.readFileSync(path.join(root, 'a0-context-navigation.js'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'a0-context-navigation.css'), 'utf8');
assert.doesNotMatch(navigation,/positionLink|a0-scientific-position-direct/,'no duplicate top-level position button');
assert.doesNotMatch(styles,/a0-scientific-position-direct/,'obsolete direct-button styles removed');
assert.match(styles,/\.top\.a0-context-ready:not\(\.a0-context-quiet\)>\.a0-reader-lanes\{display:flex\}/,'Reader shortcuts survive page-local mobile nav hiding');
assert.match(styles,/\.a0-reader-lanes\{flex-wrap:wrap;overflow-x:visible\}/,'direct entry wraps on mobile');
assert.match(navigation,/entryLink\.href = "index\.html"/,'shared Reader navigation begins with the A0 entry');
assert.match(navigation,/Einstieg<\/strong><small>A0 Start/,'entry is visibly named before the three Reader lanes');
assert.match(navigation,/if \(!quietEntry\) laneNav\.append\(entryLink\)/,'Human View omits the duplicate A0 entry button');
assert.match(navigation,/DRAFTS\/A0_HUMAN_BOOK_DRAFT\.html#human-view/,'Human View exposes the retained draft');
assert.match(navigation,/Entwurf<\/strong><small>Human Book/,'retained draft is visibly named');
assert.match(styles,/\.a0-reader-entry\{/,'entry has a shared navigation-button style');
assert.match(styles,/\.a0-human-draft-entry\{/,'draft has a distinct shared-navigation style');
assert.match(navigation,/class="a0-reader-home"/,'each Reader panel promotes its own entry as the first action');
assert.match(navigation,/Zum \$\{lane\.label\} →/,'Reader panel action names Human, Science or Builder');
assert.doesNotMatch(navigation,/href="\$\{lane\.entry\}">Zum Einstieg →/,'Reader panels do not duplicate the global A0 entry');
assert.match(styles,/\.a0-reader-home\{/,'Reader entry is styled as a button rather than a second headline');
const scienceEntry=fs.readFileSync(path.join(root,'A0_SCIENCE.html'),'utf8');
assert.match(scienceEntry,/<a class="btn gold" href="A0_SCIENTIFIC_POSITION_REPORT.html">Scientific Position/);
assert.match(fs.readFileSync(path.join(root,'A0_THEORY_STORYBOARD.html'),'utf8'),/<a href="A0_SCIENTIFIC_POSITION_REPORT.html">Science · Scientific Position<\/a>/);
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'A0_BOOK_MANIFEST.json'), 'utf8'));
// The ARKADE build-root template is not a source-directory Reader page.
const registered = [...new Set(manifest.surface_registry.map((record) => record.surface.split('#')[0]).filter((surface) => surface.endsWith('.html') && surface !== 'a0-public-arkade-index.html'))];

for (const surface of registered) assert.ok(navigation.includes(surface), `${surface} must be reachable from the shared Reader navigation`);

for (const token of [
  'Reader nach Perspektive',
  'Auf dieser Seite',
  'Science Desk',
  'Intern · Arbeitsbereich',
  'Szenen · Deep Links',
  'Wo wir stehen',
  'C · Connect'
]) assert.ok(navigation.includes(token), `navigation contract missing: ${token}`);

const lanes=JSON.parse(navigation.match(/const readerLanes = (\[[\s\S]*?\n  \]);/)[1]);
assert.deepEqual(lanes.map(l=>[l.key,l.code,l.label]),[['human','H','Human'],['science','S','Science'],['builder','B','Builder']]);
const scienceLane=lanes.find(l=>l.key==='science');
assert.equal(scienceLane.entry,'A0_SCIENCE.html');
assert.ok(scienceLane.sections[0].label.startsWith('Wo wir stehen'));
assert.equal(scienceLane.sections[0].items[0][0],'A0_SCIENTIFIC_POSITION_REPORT.html');
assert.equal(scienceLane.sections[1].label,'Papers');
const internalTargets=new Set(['A0_RESEARCH_DESK.html','A0_RESEARCH_BACKLOG.html','A0_BUILDER_LOG.html','A0_LABORATORY.html']);
for(const lane of lanes)for(const section of lane.sections)for(const [href] of section.items)assert.ok(!internalTargets.has(href.split('#')[0]),'no internal workspace in Reader menus: '+href);
assert.match(navigation,/header.replaceChildren\(brand, laneNav, \.\.\.\(quietEntry \? \[draftLink\] : \[\]\), overview, ownerDesk\)/,'one compact header with contextual draft and separate owner shortcut');
assert.match(navigation,/ownerDesk\.textContent = "Desk · intern"/);
assert.doesNotMatch(navigation,/quickNav|pageTools|primaryNav|pageContext/,'duplicate global navigation layers removed');
assert.match(navigation,/overviewSummary.textContent = "Übersicht"/);
assert.match(navigation,/file === "index.html"\) \{/,'directory only on book home');
assert.match(navigation,/main.append\(directory\)/,'directory no longer precedes page content');
assert.match(navigation,/const directory = document.createElement\("details"\)/,'directory folded by default');
assert.match(navigation,/group.sections.filter\(section => !section.internal\)/,'internal inventory not shown as Reader directory');
assert.match(navigation, /A0_SCIENTIFIC_POSITION_REPORT\.html/);
assert.ok(scienceEntry.includes('id="contributions"'),'reader contributions have a Science home');

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
assert.deepEqual([...groupedPages].sort(), [...htmlFiles].sort(), 'all top-level HTMLs have a navigation home');
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
assert.deepEqual(htmlFiles.filter((name) => !shared.includes(name)).sort(), ['A0_ASSET_INDEX.html', 'A0_BUILDER_LOG.html', 'A0_ORIENTATION_CONTROLLER_BENCH.html', 'A0_THEORY_STORYBOARD.html', 'LAB_ORIENTATION_MACHINE.html']);
for (const surface of ['A0_BUILDER_LOG.html', 'A0_THEORY_STORYBOARD.html']) {
  assert.ok(fs.readFileSync(path.join(root, surface), 'utf8').includes('href="A0_TOURS.html"'), surface + ' retains an explicit tour return');
}
for (const surface of htmlFiles) assert.ok(navigation.includes(surface), surface + ' is linked from shared Reader navigation');
assert.ok(navigation.includes('Wo wir stehen · Ergebnisse & Einordnung'));
assert.ok(navigation.includes('A0_TOURS.html#historical-htmls'));

const livingBlueprint = fs.readFileSync(path.join(root, 'A0_LIVING_BLUEPRINT.html'), 'utf8');
assert.match(livingBlueprint, /a0-context-navigation\.css\?rev=reader-lanes-20261019-lane-entry/);
assert.match(livingBlueprint, /a0-context-navigation\.js\?rev=reader-lanes-20261019-lane-entry/);

const human = fs.readFileSync(path.join(root, 'A0_NEXAH_APERTURE_JOURNEY.html'), 'utf8');
assert.ok(human.includes('href="index.html"') && human.includes('href="A0_BUILDER_TOY_STORE.html"'), 'quiet Human journey retains explicit exits');
console.log(JSON.stringify({ status: 'PASS', registeredReaders: registered.length, sharedNavigationSurfaces: shared.length, standaloneSurfaces: 5, allLocalHtmlReachable: htmlFiles.length }, null, 2));
