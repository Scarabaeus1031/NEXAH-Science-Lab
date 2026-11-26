const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const api = require("./a0-number-view-suite-port.js");
const cube = require("./a0-primecube-model.js");
const helix = require("./a0-helix-view-adapter.js");
let checks = 0;
function ok(value, message) { assert.ok(value, message); checks += 1; }
function eq(a, b, message) { assert.deepEqual(a, b, message); checks += 1; }

eq(api.IDENTITY, "MOD:NUMBER_VIEW_SUITE");
eq(api.STAGES, ["CARRIER", "POINT", "LINE", "SLICE", "GLUE", "TOPOLOGY", "RETURN"]);
eq(api.STAGE_ACTIONS.length, 7);
eq(api.traceIndices(0), [0]);
eq(api.traceIndices(4), [0,1,2,3,4]);
eq(api.traceIndices(99), [0,1,2,3,4,5,6]);
eq(api.MOTION.length, 7);
eq(api.motionForStage(0), { x:0,y:0,angle:0 });
eq(api.motionForStage(3), { x:126,y:18,angle:-4 });
eq(api.motionForStage(6), { x:0,y:0,angle:0 });
eq(api.primeAddress(1), { n:1,x:0,y:0,z:0,address:"[0,0,0]",returnId:"PC1111:N0001" });
eq(api.primeAddress(661), { n:661,x:0,y:5,z:5,address:"[0,5,5]",returnId:"PC1111:N0661" });
eq(api.primeAddress(809), { n:809,x:5,y:7,z:6,address:"[5,7,6]",returnId:"PC1111:N0809" });
eq(api.primeAddress(1111), { n:1111,x:10,y:1,z:9,address:"[10,1,9]",returnId:"PC1111:N1111" });
const helixRecords = helix.primeResidueRecords();
const recordsByPrime = new Map(helixRecords.map(record => [record.prime, record]));
eq(api.compareHelix(api.primeAddress(661), recordsByPrime.get(661), cube), {
  cubeReturn: 661,
  helix: { residue7:3, residue11:1, residue77:45, band:8, helixReturn:661, exact:true }
});
eq(api.compareHelix(api.primeAddress(353), recordsByPrime.get(353), cube).helix, {
  residue7:3, residue11:1, residue77:45, band:4, helixReturn:353, exact:true
});
eq(api.compareHelix(api.primeAddress(661), recordsByPrime.get(353), cube).helix.exact, false);
eq(api.compareHelix(api.primeAddress(1009), recordsByPrime.get(1009), cube), { cubeReturn:1009, helix:null });
ok(helixRecords.every(record => api.compareHelix(api.primeAddress(record.prime), record, cube).helix.exact),
  "all shared records return through both views");
assert.throws(() => api.primeAddress(0), RangeError); checks += 1;
assert.throws(() => api.primeAddress(1112), RangeError); checks += 1;
eq(Object.keys(api.ROLES).length, 5);
eq(api.inspect("TOPOLOGY_ADAPTER", 5, 661).intrinsicTopology, false);
eq(api.inspect("TOPOLOGY_ADAPTER", 5, 661).graphDelta, 0);
eq(api.inspect("BAD", 99, 661).roleKey, "PRIME_CORE");
eq(api.inspect("BAD", 99, 661).stage, "RETURN");
eq(api.inspect("PRIME_CORE", 4, 661).action, "GLUE DECLARED");
const fullTrace = api.diagram(api.inspect("PRIME_CORE", 6, 661), api.traceIndices(6));
ok(fullTrace.includes("nvp-artifact-point"), "retained point artifact");
ok(fullTrace.includes("nvp-artifact-glue"), "retained glue artifact");
ok(fullTrace.includes("nvp-artifact-topology"), "retained topology artifact");
ok(fullTrace.includes("nvp-artifact-return"), "retained return artifact");
ok(fullTrace.includes("retained stage trace"), "accessible retained trace label");
ok(fullTrace.includes("nvp-cube-moving"), "view body has a declared moving transform");
ok(fullTrace.includes("SOURCE 661 · LOCKED"), "source record remains visibly fixed while view body moves");
ok(fullTrace.includes("nvp-motion-trace"), "movement path remains visible as a trace");

for (const file of ["A0_WERKBANK.html", "A0_PRIMECUBE_GAP_FOLD_LAB.html", "A0_MACHINA_ANATOMY_MAP.html", "A0_BUILDER_LOG.html", "A0_RESEARCH_DESK.html"]) {
  const html = fs.readFileSync(path.join(__dirname, file), "utf8");
  ok(html.includes("MOD:NUMBER_VIEW_SUITE"), `${file} identity binding`);
  ok(html.includes("number-view-suite-port"), `${file} port binding`);
  if (["A0_WERKBANK.html", "A0_PRIMECUBE_GAP_FOLD_LAB.html"].includes(file)) {
    ok(html.includes("data-nvp-play"), `${file} play control`);
    ok(html.includes("data-nvp-clear"), `${file} trace reset control`);
    ok(html.includes("data-nvp-trace"), `${file} live trace output`);
  }
}
const primecube = fs.readFileSync(path.join(__dirname, "A0_PRIMECUBE_GAP_FOLD_LAB.html"), "utf8");
ok(primecube.indexOf('id="primecube-workbench"') < primecube.indexOf('id="number-view-suite-port"'), "workbench precedes the motion chapter");
ok(primecube.indexOf('id="number-view-suite-port"') < primecube.indexOf('id="contract-demo-audit"'), "motion chapter precedes the contract overview");
ok(primecube.includes("data-nvp-cycle"), "visible phase and cycle counter");

const helixUi = fs.readFileSync(path.join(__dirname, "a0-helix-view-adapter-ui.js"), "utf8");
const urlBuilder = helixUi.match(/  function cubeReturnUrl\(record[^\n]*\n[\s\S]*?\n  }/)[0];
const cubeReturnUrl = vm.runInNewContext(`(${urlBuilder.trim()})`, { URLSearchParams });
const portSource = fs.readFileSync(path.join(__dirname, "a0-number-view-suite-port.js"), "utf8");
function openReturn(record, target) {
  const location = new URL(cubeReturnUrl(record, target), "file:///a0/");
  const sandbox = { URLSearchParams, location, A0PrimecubeModel: cube, A0HelixViewAdapter: helix };
  vm.runInNewContext(portSource, sandbox);
  const input = { value: "661", addEventListener() {} };
  const readout = { textContent: "" };
  const link = { href: "" };
  const host = {
    dataset: { defaultN: "661" },
    querySelectorAll() { return []; },
    querySelector(selector) {
      return {
        "[data-nvp-number]": input,
        "[data-nvp-return]": readout,
        "[data-nvp-helix-link]": link,
      }[selector];
    },
  };
  sandbox.A0NumberViewSuitePort.mount(host);
  return [location.hash, Number(input.value), readout.textContent];
}
const returnTarget = "primecube-helix-return";
eq(openReturn(recordsByPrime.get(661), returnTarget), ["#primecube-helix-return", 661, "PC1111:N0661 · [0,5,5]"]);
eq(openReturn(recordsByPrime.get(419), returnTarget), ["#primecube-helix-return", 419, "PC1111:N0419 · [0,5,3]"]);
eq(openReturn({ sourceIds: ["PC1111:N1009"] }, returnTarget), ["#primecube-helix-return", 661, "PC1111:N0661 · [0,5,5]"]);
eq(openReturn(recordsByPrime.get(419)), ["#shadow-cube-slice-overlay", 661, "PC1111:N0661 · [0,5,5]"]);
console.log(`PASS ${checks}/${checks} · Number View Suite Port`);
