const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const html = fs.readFileSync(path.join(__dirname, "A0_DATA_AND_REGISTERS.html"), "utf8");
const builderDesk = fs.readFileSync(path.resolve(__dirname, "../../../../../10 NEXAH CORE/NEXAH/BUILDER/B0_BUILDER_DECK/a0-tools.html"), "utf8");

assert.doesNotMatch(html, /<nav class="a0-desk-trinity/);
assert.match(html, /a0-context-navigation\.js/);
assert.match(html, /<title>NEXAH · A0 Daten &amp; Register<\/title>/);
assert.match(html, /<main id="top">/);
assert.match(html, /history\.scrollRestoration="manual"/);
assert.match(html, /\["wheel","touchstart","pointerdown","keydown"\]/);
assert.match(html, /document\.querySelectorAll\("\.register-window iframe"\)/);
assert.match(html, /frame\.addEventListener\("load",\(\)=>requestAnimationFrame\(restoreDataTop\),\{once:true\}\)/);
assert.match(html, /addEventListener\("load",\(\)=>requestAnimationFrame\(\(\)=>requestAnimationFrame\(restoreDataTop\)\),\{once:true\}\)/);
assert.match(html, /addEventListener\("pageshow",\(\)=>requestAnimationFrame\(restoreDataTop\)\)/);
assert.match(html, /addEventListener\("hashchange",\(\)=>\{if\(location\.hash==="#top"\)requestAnimationFrame\(restoreDataTop\)\}\)/);
assert.match(html, /Fünf Registerfamilien · fünf Zuständigkeiten/);
assert.doesNotMatch(html, /<h3>Mission Control · Current<\/h3>/);
assert.doesNotMatch(html, /Vorschau Mission Control/);
assert.match(html, /<h3>Ecosystem Source Field<\/h3>/);
assert.match(html, /src="https:\/\/nexah\.de\/library\/"/);
assert.equal((html.match(/<article class="family"/g) || []).length, 5);
assert.equal((html.match(/class="register-question"/g) || []).length, 5);
assert.match(html, /Beantwortet die Frage/);
assert.match(html, /<h3>Builder Register Stack<\/h3>/);
assert.match(html, /Tool Inventory · gepflegter Werkzeugbestand/);
assert.match(html, /Toolbox · What we can build/);
assert.match(html, /Builder Desk<\/a>/);

assert.match(builderDesk, /id="register-stack"/);
assert.match(builderDesk, /MAINTAINED SOURCE REGISTER/);
assert.match(builderDesk, /Inventory = gepflegter Bestand/);
assert.match(builderDesk, /Toolbox = Eignung/);
assert.match(builderDesk, /A0_DATA_AND_REGISTERS\.html#assets-publications/);

console.log("A0 data/registers workspace navigation tests passed.");
