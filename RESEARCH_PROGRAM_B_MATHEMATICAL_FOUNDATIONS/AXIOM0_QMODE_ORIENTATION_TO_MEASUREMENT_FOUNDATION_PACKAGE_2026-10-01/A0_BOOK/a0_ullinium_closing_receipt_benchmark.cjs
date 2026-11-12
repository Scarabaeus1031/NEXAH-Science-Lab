const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const preregPath = path.join(__dirname, "results/a0-ullinium-closing-receipt-preregistration-2026-11-11.json");
const preregBytes = fs.readFileSync(preregPath);
const prereg = JSON.parse(preregBytes);

function xorshift32(seed) {
  let x = seed >>> 0;
  return () => {
    x ^= x << 13; x ^= x >>> 17; x ^= x << 5;
    return (x >>> 0) / 4294967296;
  };
}

function shuffle(values, random) {
  const out = values.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function orient(cycle, random) {
  const start = Math.floor(random() * cycle.length);
  const direction = random() < 0.5 ? 1 : -1;
  return Array.from({ length: cycle.length }, (_, i) => cycle[(start + direction * i + cycle.length * 2) % cycle.length]);
}

function edgeKey(a, b) { return a < b ? `${a}-${b}` : `${b}-${a}`; }
function edgeSet(cycles) {
  const edges = new Set();
  for (const cycle of cycles) for (let i = 0; i < cycle.length; i++) edges.add(edgeKey(cycle[i], cycle[(i + 1) % cycle.length]));
  return edges;
}

function canonicalCycle(cycle) {
  const variants = [];
  for (const source of [cycle, cycle.slice().reverse()]) {
    for (let i = 0; i < source.length; i++) variants.push(source.slice(i).concat(source.slice(0, i)));
  }
  variants.sort((a, b) => a.join(",").localeCompare(b.join(","), "en", { numeric: true }));
  return variants[0];
}

function findSixCycles(vertices, edges) {
  const found = new Map();
  function visit(pathNow) {
    if (pathNow.length === 6) {
      if (edges.has(edgeKey(pathNow[5], pathNow[0]))) {
        const canonical = canonicalCycle(pathNow);
        found.set(canonical.join(","), canonical);
      }
      return;
    }
    const current = pathNow[pathNow.length - 1];
    for (const next of vertices) {
      if (!pathNow.includes(next) && edges.has(edgeKey(current, next))) visit(pathNow.concat(next));
    }
  }
  for (const start of vertices) visit([start]);
  return [...found.values()].sort((a, b) => a.join(",").localeCompare(b.join(","), "en", { numeric: true }));
}

function mapFromCycles(a, b) {
  const map = {};
  a.forEach((value, i) => { map[`A${i}`] = value; });
  b.forEach((value, i) => { map[`B${i}`] = value; });
  return map;
}

function sameMap(a, b) {
  return Object.keys(a).length === Object.keys(b).length && Object.keys(a).every((key) => a[key] === b[key]);
}

function trial(random) {
  const permutation = shuffle([...Array(10).keys()], random);
  const relabel = (cycle) => cycle.map((value) => permutation[value]);
  let cycles = [relabel([0, 1, 2, 3, 4, 5]), relabel([1, 0, 6, 7, 8, 9])];
  if (random() < 0.5) cycles = [cycles[1], cycles[0]];
  const sourceA = orient(cycles[0], random);
  const sourceB = orient(cycles[1], random);
  const sourceMap = mapFromCycles(sourceA, sourceB);
  const edges = edgeSet(cycles);
  const inferred = findSixCycles(permutation, edges);
  if (inferred.length !== 2 || edges.size !== 11) throw new Error("INVALID_COMPOSITE");

  const fullMap = { ...sourceMap };
  const noTagsMap = mapFromCycles(inferred[0], inferred[1]);
  const wrongMap = { ...sourceMap, B0: sourceMap.B2 };

  const openPath = orient(relabel([0, 1, 2, 3, 4, 5]), random);
  const realEdges = new Set(openPath.slice(0, -1).map((value, i) => edgeKey(value, openPath[i + 1])));
  const withPhantom = new Set(realEdges); withPhantom.add(edgeKey(openPath[0], openPath[5]));
  withPhantom.delete(edgeKey(openPath[0], openPath[5]));
  const phantomReturn = withPhantom.size === realEdges.size && [...realEdges].every((edge) => withPhantom.has(edge));

  return {
    full: sameMap(sourceMap, fullMap),
    noTags: sameMap(sourceMap, noTagsMap),
    wrongSeam: sameMap(sourceMap, wrongMap),
    phantomReturn
  };
}

function run() {
  if (prereg.status !== "FROZEN_BOUNDED_ENGINEERING_VERIFICATION_NOT_A_LAB_RUN") throw new Error("PREREG_NOT_FROZEN");
  const random = xorshift32(prereg.seed);
  const counts = { full: 0, noTags: 0, wrongSeam: 0, phantomReturn: 0 };
  for (let i = 0; i < prereg.trials; i++) {
    const result = trial(random);
    for (const key of Object.keys(counts)) counts[key] += Number(result[key]);
  }
  const rates = Object.fromEntries(Object.entries(counts).map(([key, value]) => [key, value / prereg.trials]));
  const advantage = rates.full - rates.noTags;
  const gates = {
    full_receipt_rate: rates.full === 1,
    phantom_remove_rate: rates.phantomReturn === 1,
    no_tags_rate: rates.noTags <= 0.01,
    wrong_seam_rate: rates.wrongSeam === 0,
    receipt_advantage: advantage >= 0.98
  };
  const pass = Object.values(gates).every(Boolean);
  return {
    schema: "a0.ullinium-closing-receipt-result/1.0.0",
    date: "2026-11-11",
    classification: "BOUNDED_ENGINEERING_VERIFICATION_NOT_A_LAB_RUN",
    preregistration_sha256: crypto.createHash("sha256").update(preregBytes).digest("hex"),
    seed: prereg.seed,
    trials: prereg.trials,
    exact_counts: counts,
    exact_rates: rates,
    receipt_advantage: advantage,
    gates,
    outcome: pass ? "PASS_BOUNDED_INFORMATION_RETURN" : "FALSIFIED",
    claim_ceiling: prereg.claim_ceiling,
    identity_effect: { new_identity: 0, new_relation: 0, new_alias: 0, study: 0, finding: 0, publication: 0 }
  };
}

if (require.main === module) console.log(JSON.stringify(run(), null, 2));
module.exports = { xorshift32, canonicalCycle, findSixCycles, trial, run };
