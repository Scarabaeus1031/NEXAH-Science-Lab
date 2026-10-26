const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const bookHome = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
assert.match(bookHome,/NEXAH \/ LABORATORY \/ A0|aria-label="Position im NEXAH Ecosystem"/,'A0 home exposes its position in the public ecosystem');
assert.match(bookHome,/A view into the NEXAH Cosmos\./,'A0 threshold names the Cosmos UX view');
assert.match(bookHome,/history\.scrollRestoration = "manual"/,'A0 home disables browser scroll restoration for the declared #top entry');
assert.match(bookHome,/document\.querySelectorAll\("\.portal-house iframe, model-viewer"\)/,'A0 home holds #top while its previews settle');
assert.match(bookHome,/addEventListener\("pageshow", \(\) => requestAnimationFrame\(restoreHomeTop\)\)/,'restored A0 home pages return to the declared top');
assert.match(bookHome,/„NEXAH Cosmos“ bezeichnet hier diese Human-facing UX-Ansicht/,'Cosmos label is bounded as a view, not a new authority');
assert.match(bookHome,/50%20PUBLISHING\/20%20WEBSITE%20STAGING\/nexah\/index\.html/,'A0 previews the generated nexah.de prototype instead of copying its editable source');
assert.match(bookHome,/UNDERSTAND · LOCAL PROTOTYPE/,'A0 distinguishes the local nexah.de prototype from the current online version');
assert.match(bookHome,/Die aktuelle Onlinefassung bleibt davon getrennt/,'A0 keeps the live nexah.de state explicit');
for (const hatch of ['Map &amp; Atlas','Library &amp; Papers','Instruments &amp; Games','Repositories &amp; Sources','Build &amp; Matter','Connect &amp; Return']) assert.ok(bookHome.includes(hatch),`ecosystem hatch missing: ${hatch}`);
assert.match(bookHome,/https:\/\/nexah\.de\/visitor-guide\/#map-title/,'public ecosystem map remains the public overview authority');
assert.doesNotMatch(bookHome,/href="[^"]*(?:A0_RESEARCH_DESK|A0_RESEARCH_BACKLOG|A0_BUILDER_LOG|A0_LABORATORY)\.html/,'ecosystem hatches do not expose internal desks');
assert.doesNotMatch(bookHome,/Eine Stimme gehört zum Record\./,'A0 home leaves the Human Voice/Record presentation to NEXAHEDRON');
assert.match(bookHome,/<template id="a0-built-world-concept" data-disposition="nexahedron-human-view-candidate">/,'the Built World concept is removed from the active A0 flow and retained for Human View disposition');
assert.doesNotMatch(bookHome,/<details class="portal-depth">/,'the Built World panorama is no longer an active A0-home module');
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
assert.doesNotMatch(navigation,/const entryLink|const benchEntry/,'no duplicate A0 entry or flat Bench shortcut');
assert.match(navigation,/NEXAH A0 · gemeinsames Portal/,'brand is the one A0 portal return');
assert.match(navigation,/brand\.href = "index\.html#top"/,'A0 portal return always targets the page start');
assert.match(navigation,/brand\.addEventListener\("click", \(event\) =>/,'same-page Home clicks have an explicit top action');
assert.match(navigation,/target\.pathname !== location\.pathname \|\| target\.hash !== "#top"/,'same-page Home remains active with preview revision parameters');
assert.doesNotMatch(navigation,/target\.search !== location\.search/,'preview revision parameters do not disable the same-page Home action');
assert.match(navigation,/window\.scrollTo\(0, 0\)/,'same-page Home clicks return to the actual viewport top');
assert.match(navigation,/\[readerLanes\[0\], readerLanes\[1\], dataMenu, readerLanes\[2\], benchMenu\]/,'Data sits beside Science; Builder and Werkbank remain adjacent');
assert.doesNotMatch(navigation,/DRAFTS\/A0_HUMAN_BOOK_DRAFT\.html/,'archived Human Book draft is absent from current navigation');
assert.doesNotMatch(styles,/\.a0-human-draft-entry\{/,'archived draft has no live-navigation styling');
assert.doesNotMatch(navigation,/class="a0-reader-home"/,'Reader panels do not repeat the house entry');
assert.match(navigation,/if \(!laneIsCurrent\)/,'inactive house buttons route before exposing their navigation');
assert.match(navigation,/window\.location\.href = lane\.entry/,'inactive local houses open their own entry page');
assert.match(navigation,/\$\{lane\.label\} Navigation öffnen/,'the current house exposes its navigation as the second action');
assert.match(navigation,/"entry": "A0_BUILDER_TOY_STORE\.html#top"/,'Builder first enters a shared-A0-navigation page before exposing its legend');
assert.match(navigation,/\|\| null\);/,'unlisted tool and register pages do not fall back to a false Science current state');
assert.doesNotMatch(navigation,/\|\| readerLanes\[1\]/,'Science is never the implicit fallback lane');
const scienceEntry=fs.readFileSync(path.join(root,'NEXAH_SCIENCE.html'),'utf8');
const a0ScienceEntry=fs.readFileSync(path.join(root,'A0_SCIENCE.html'),'utf8');
assert.match(a0ScienceEntry,/<a class="btn gold" href="A0_SCIENTIFIC_POSITION_REPORT.html">Scientific Position/);
assert.ok(scienceEntry.includes('id="who-we-are"') && scienceEntry.includes('https://nexah.de/about/'),'public Science identifies NEXAH and links its canonical About page');
assert.ok(scienceEntry.includes('https://github.com/Scarabaeus1031/NEXAH') && scienceEntry.includes('https://github.com/Scarabaeus1031/NEXAH-Science-Lab'),'public Science exposes Core and Laboratory repositories');
for (const [name, source] of [['index.html',bookHome],['NEXAH_SCIENCE.html',scienceEntry],['A0_SCIENTIFIC_POSITION_REPORT.html',fs.readFileSync(path.join(root,'A0_SCIENTIFIC_POSITION_REPORT.html'),'utf8')]]) {
  for (const internal of ['A0_RESEARCH_DESK.html','A0_RESEARCH_BACKLOG.html','A0_BUILDER_LOG.html','A0_LABORATORY.html']) assert.ok(!source.includes(`href="${internal}`),`${name} has no public route into ${internal}`);
  assert.ok(!source.includes('SCIENCE_LAB/NAVIGATION/APP/'),`${name} does not route to the internal Navigator app`);
}
assert.match(fs.readFileSync(path.join(root,'A0_THEORY_STORYBOARD.html'),'utf8'),/<a href="A0_SCIENTIFIC_POSITION_REPORT.html">Science · Scientific Position<\/a>/);
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'A0_BOOK_MANIFEST.json'), 'utf8'));
// The ARKADE build-root template is not a source-directory Reader page.
const registered = [...new Set(manifest.surface_registry.map((record) => record.surface.split('#')[0]).filter((surface) => surface.endsWith('.html') && surface !== 'a0-public-arkade-index.html'))];

for (const surface of registered) assert.ok(navigation.includes(surface), `${surface} must be reachable from the shared Reader navigation`);

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
assert.deepEqual(lanes.map(l=>[l.key,l.code,l.label]),[['human','H','NEXAHEDRON · Human'],['science','S','NEXAH · Science'],['builder','B','Builder']]);
assert.equal(lanes.find(l=>l.key==='human').entry,'https://nexahedron.com/','Human home is the canonical NEXAHEDRON start page');
const scienceLane=lanes.find(l=>l.key==='science');
assert.equal(scienceLane.entry,'A0_SCIENCE.html#top');
assert.ok(scienceLane.sections[0].label.startsWith('Wo wir stehen'));
assert.equal(scienceLane.sections[0].items[0][0],'A0_SCIENTIFIC_POSITION_REPORT.html');
assert.equal(scienceLane.sections[1].label,'Papers');
const internalTargets=new Set(['A0_RESEARCH_DESK.html','A0_RESEARCH_BACKLOG.html','A0_BUILDER_LOG.html','A0_LABORATORY.html']);
for(const lane of lanes)for(const section of lane.sections)for(const [href] of section.items)assert.ok(!internalTargets.has(href.split('#')[0]),'no internal workspace in Reader menus: '+href);
assert.match(navigation,/header.replaceChildren\(brand, laneNav, workspaceOverview, connectDot, overview\)/,'header separates A0 lanes from right-side work overviews');
assert.match(navigation,/workspaceOverview\.className = "a0-workspace-overviews"/,'right-side workspace overview group exists');
assert.match(navigation,/workspaceOverview\.append\(deskMenu\)/,'Science and Builder desks share one compact overview menu');
assert.match(navigation,/workspaceOverview\.append\(missionControlLink\)/,'Mission Control is grouped with the work overviews');
assert.match(navigation,/workspaceOverview\.append\(scarabaeusLink\)/,'Scarabæus closes the right-side overview group');
assert.match(navigation,/A0_RESEARCH_DESK\.html\?desk=research&rev=desk-top-r2#top/,'Science Desk starts at the top of its selected view with a fresh in-app-browser revision');
assert.match(navigation,/builderDeskHref[^`]*Builder Desk/,'Builder Desk remains a direct existing route');
assert.match(navigation,/href\.startsWith\("\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/"\)/,'localhost rebases existing ecosystem links onto the reachable workspace server');
assert.match(navigation,/connectDot\.className = "nexah-public-connect"/);
assert.match(navigation,/connectDot\.href = "NEXAH_C_CONNECT\.html"/);
assert.match(styles,/\.a0-context-compact>\.nexah-public-connect\{[^}]*height:34px[^}]*width:34px/,'Connect keeps a usable transparent target');
assert.match(styles,/\.a0-context-compact>\.nexah-public-connect>span\[aria-hidden=true\]\{[^}]*height:18px[^}]*width:18px/,'Connect renders one small pink orb');
assert.match(navigation,/class="a0-owner-scarab"/);
assert.match(navigation,/localOwnerContext \? scarabaeusStagingHref : "https:\/\/www\.scarabaeus1033\.net"/,'Scarab opens the local staged office locally and the canonical website publicly');
assert.doesNotMatch(navigation,/quickNav|pageTools|primaryNav|pageContext/,'duplicate global navigation layers removed');
assert.match(navigation,/overviewSummary.textContent = "Übersicht"/);
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
assert.deepEqual(htmlFiles.filter((name) => !shared.includes(name)).sort(), ['A0_7_11_TYPED_CROSSWALK.html', 'A0_ASSEMBLY_ATLAS.html', 'A0_ASSET_INDEX.html', 'A0_BUILDER_LOG.html', 'A0_CROWN_SHADOW_CONTACT_BENCH.html', 'A0_CURSOR_HANDOFF_CLICKDUMMY.html', 'A0_IOTA_BRIDGE_DEMONSTRATOR.html', 'A0_LOOK_AGAIN_PLAY.html', 'A0_ONE_PULSE_BENCH_MONITOR.html', 'A0_OPIUM.html', 'A0_PENTAGON_BODY_RETURN_GUIDED.html', 'A0_THEORY_STORYBOARD.html', 'A0_TOWER_RETURN_DEMONSTRATOR.html', 'LAB_ORIENTATION_MACHINE.html']);
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
assert.ok(human.includes('href="index.html"') && human.includes('href="A0_GAME_OF_WORLDS_PLAY.html#pulse"') && human.includes('href="A0_THE_LIVING_INTERIOR.html'), 'quiet Human journey retains explicit portal, play and Living Interior exits');
console.log(JSON.stringify({ status: 'PASS', registeredReaders: registered.length, sharedNavigationSurfaces: shared.length, standaloneSurfaces: htmlFiles.length - shared.length, allLocalHtmlReachable: htmlFiles.length }, null, 2));
