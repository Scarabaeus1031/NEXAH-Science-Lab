const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = __dirname;
const contextSource = fs.readFileSync(path.join(root, "a0-context-navigation.js"), "utf8");
const orientation = require(path.join(root, "a0-orientation-map.js"));

function readArray(source, declaration) {
  const declarationStart = source.indexOf(declaration);
  assert.notEqual(declarationStart, -1, `missing declaration: ${declaration}`);
  const arrayStart = source.indexOf("[", declarationStart);
  let depth = 0;
  let quote = "";
  let escaped = false;
  for (let index = arrayStart; index < source.length; index += 1) {
    const character = source[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === quote) quote = "";
      continue;
    }
    if (character === '"' || character === "'" || character === "`") {
      quote = character;
      continue;
    }
    if (character === "[") depth += 1;
    if (character === "]" && --depth === 0) {
      return vm.runInNewContext(`(${source.slice(arrayStart, index + 1)})`);
    }
  }
  throw new Error(`unterminated array: ${declaration}`);
}

const groups = readArray(contextSource, "const navigationGroups = [");
const directoryPages = new Set(
  groups.flatMap((group) => group.sections.flatMap((section) => section.pages))
);
const orientationPages = new Set(orientation.pages.map((page) => page.file));
const htmlPages = new Set(
  fs.readdirSync(root).filter((name) => name.endsWith(".html"))
);

assert.deepEqual([...directoryPages].sort(), [...htmlPages].sort(), "thematic directory drift");
assert.deepEqual([...orientationPages].sort(), [...htmlPages].sort(), "A0 Navigator page inventory drift");

assert.match(contextSource, /"key": "science"[\s\S]*?"entry": "A0_SCIENCE\.html#top"/);
assert.match(contextSource, /"key": "builder"[\s\S]*?"entry": "A0_BUILDER_TOY_STORE\.html#top"/);
assert.match(contextSource, /\["A0_SCIENCE\.html#top", "A0 Science"/);
assert.match(contextSource, /scienceViewLink\.href = scienceDeskHref/);
assert.match(contextSource, /builderViewLink\.href = builderDeskHref/);
assert.match(contextSource, /const builderShowcaseHref = "A0_BUILDER_TOY_STORE\.html#top"/);
assert.doesNotMatch(contextSource, /A0_BUILDER_LOG\.html\?rev=currentness-r3-20261031#top/);
assert.match(contextSource, /const pairedLane = \(\) => lane/);
assert.match(contextSource, /triggers: \[scienceLaneSummary\]/);
assert.match(contextSource, /triggers: \[builderLaneSummary, \.\.\.localBuilderEntries\]/);
assert.doesNotMatch(
  contextSource,
  /"key": "science"[\s\S]*?"entry": "A0_RESEARCH_DESK\.html/
);

console.log(JSON.stringify({
  status: "PASS",
  checks: 12,
  htmlPages: htmlPages.size,
  scope: "A0 Reader/Desk route separation and shared navigation inventory currentness"
}, null, 2));
