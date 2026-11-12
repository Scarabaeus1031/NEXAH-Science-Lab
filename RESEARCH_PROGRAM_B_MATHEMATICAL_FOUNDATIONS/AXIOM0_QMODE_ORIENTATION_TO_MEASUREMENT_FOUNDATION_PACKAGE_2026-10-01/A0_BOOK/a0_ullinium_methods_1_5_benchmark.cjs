const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const preregPath = path.join(__dirname, "results/a0-ullinium-methods-1-5-preregistration-2026-11-11.json");
const preregBytes = fs.readFileSync(preregPath);
const prereg = JSON.parse(preregBytes);

function stable(value) {
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  if (value && typeof value === "object") return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stable(value[key])}`).join(",")}}`;
  return JSON.stringify(value);
}
function sha(value) { return crypto.createHash("sha256").update(typeof value === "string" ? value : stable(value)).digest("hex"); }
function xorshift32(seed) {
  let x = seed >>> 0;
  return () => {
    x ^= x << 13; x ^= x >>> 17; x ^= x << 5;
    return (x >>> 0) / 4294967296;
  };
}
function randint(random, min, max) { return min + Math.floor(random() * (max - min + 1)); }
function shuffle(values, random) {
  const out = values.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
function edgeKey(a, b) { return a < b ? `${a}-${b}` : `${b}-${a}`; }
function normalizeEdges(edges) {
  return [...new Set(edges.map(([a, b]) => edgeKey(a, b)))].map((key) => key.split("-").map(Number)).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}
function graph(n, edges) { return { n, edges: normalizeEdges(edges) }; }

function generateGraph(family, n, random) {
  const edges = [];
  if (family === "cycle") {
    for (let i = 0; i < n; i++) edges.push([i, (i + 1) % n]);
  } else if (family === "tree") {
    for (let i = 1; i < n; i++) edges.push([i, Math.floor(random() * i)]);
  } else if (family === "grid") {
    const cols = n / 2;
    for (let r = 0; r < 2; r++) for (let c = 0; c < cols - 1; c++) edges.push([r * cols + c, r * cols + c + 1]);
    for (let c = 0; c < cols; c++) edges.push([c, cols + c]);
  } else if (family === "fan") {
    for (let i = 1; i < n; i++) edges.push([0, i]);
    for (let i = 1; i < n - 1; i++) edges.push([i, i + 1]);
  } else if (family === "general") {
    for (let i = 1; i < n; i++) edges.push([i - 1, i]);
    for (let i = 0; i < n; i++) for (let j = i + 2; j < n; j++) if (random() < 0.24) edges.push([i, j]);
  } else throw new Error(`UNKNOWN_FAMILY:${family}`);
  return graph(n, edges);
}

function paths2(source) {
  const neighbors = Array.from({ length: source.n }, () => []);
  for (const [a, b] of source.edges) { neighbors[a].push(b); neighbors[b].push(a); }
  const out = [];
  for (let middle = 0; middle < source.n; middle++) {
    const ns = neighbors[middle].slice().sort((a, b) => a - b);
    for (let i = 0; i < ns.length; i++) for (let j = i + 1; j < ns.length; j++) out.push([ns[i], middle, ns[j]]);
  }
  return out;
}
function chooseOverlap(a, b, kind, random) {
  let av; let bv;
  if (kind === "vertex") {
    av = [randint(random, 0, a.n - 1)];
    bv = [randint(random, 0, b.n - 1)];
  } else if (kind === "edge") {
    av = a.edges[randint(random, 0, a.edges.length - 1)].slice();
    bv = b.edges[randint(random, 0, b.edges.length - 1)].slice();
  } else {
    const ap = paths2(a); const bp = paths2(b);
    av = ap[randint(random, 0, ap.length - 1)].slice();
    bv = bp[randint(random, 0, bp.length - 1)].slice();
  }
  if (random() < 0.5) bv.reverse();
  return { kind, A: av, B: bv };
}

class UnionFind {
  constructor(values) { this.parent = Object.fromEntries(values.map((value) => [value, value])); }
  find(value) {
    if (this.parent[value] !== value) this.parent[value] = this.find(this.parent[value]);
    return this.parent[value];
  }
  union(a, b) {
    const ra = this.find(a); const rb = this.find(b);
    if (ra !== rb) this.parent[rb] = ra;
  }
}
function vertexToken(layer, index) { return `${layer}:v${index}`; }
function edgeToken(layer, edge) { return `${layer}:e${edge[0]}-${edge[1]}`; }
function parseEdgeToken(token) {
  const match = /^([AB]):e(\d+)-(\d+)$/.exec(token);
  if (!match) throw new Error(`BAD_EDGE_TOKEN:${token}`);
  return { layer: match[1], edge: [Number(match[2]), Number(match[3])] };
}
function sourceDigest(sources) { return sha({ A: sources.A, B: sources.B }); }

function makeTrial(family, overlapKind, random) {
  const sizes = family === "grid" ? [6, 8, 10, 12, 14] : [6, 7, 8, 9, 10, 11, 12, 13, 14];
  const A = generateGraph(family, sizes[randint(random, 0, sizes.length - 1)], random);
  const B = generateGraph(family, sizes[randint(random, 0, sizes.length - 1)], random);
  const overlap = chooseOverlap(A, B, overlapKind, random);
  const tokens = [];
  for (const layer of ["A", "B"]) for (let i = 0; i < (layer === "A" ? A.n : B.n); i++) tokens.push(vertexToken(layer, i));
  const uf = new UnionFind(tokens);
  overlap.A.forEach((value, index) => uf.union(vertexToken("A", value), vertexToken("B", overlap.B[index])));
  const roots = [...new Set(tokens.map((token) => uf.find(token)))];
  const ids = shuffle(Array.from({ length: roots.length }, (_, index) => index), random);
  const rootToId = Object.fromEntries(roots.map((root, index) => [root, ids[index]]));
  const vertexMap = Object.fromEntries(tokens.map((token) => [token, rootToId[uf.find(token)]]));
  const displayEdgeKeys = new Set();
  for (const [layer, source] of [["A", A], ["B", B]]) {
    for (const edge of source.edges) displayEdgeKeys.add(edgeKey(vertexMap[vertexToken(layer, edge[0])], vertexMap[vertexToken(layer, edge[1])]));
  }
  const displayEdges = [...displayEdgeKeys].map((key) => key.split("-").map(Number)).sort((x, y) => x[0] - y[0] || x[1] - y[1]);
  const displayEdgeId = Object.fromEntries(displayEdges.map((edge, index) => [edgeKey(...edge), index]));
  const edgeMap = {};
  for (const [layer, source] of [["A", A], ["B", B]]) {
    for (const edge of source.edges) edgeMap[edgeToken(layer, edge)] = displayEdgeId[edgeKey(vertexMap[vertexToken(layer, edge[0])], vertexMap[vertexToken(layer, edge[1])])];
  }
  const display = { vertices: roots.length, edges: displayEdges };
  const sources = { A, B };
  const provenance = { vertexMap, edgeMap };
  return { family, overlap, sources, display, provenance, sourceDigest: sourceDigest(sources), provenanceDigest: sha(provenance) };
}

function records(value) {
  if (Array.isArray(value)) return value.length + value.reduce((sum, item) => sum + records(item), 0);
  if (value && typeof value === "object") return Object.values(value).reduce((sum, item) => sum + records(item), 0);
  return 0;
}
function payloadStats(payload) { return { bytes: Buffer.byteLength(stable(payload)), records: records(payload) }; }
function originTables(trial) {
  const nodeOrigins = Array.from({ length: trial.display.vertices }, () => []);
  for (const [token, id] of Object.entries(trial.provenance.vertexMap)) nodeOrigins[id].push(token);
  const edgeOrigins = Array.from({ length: trial.display.edges.length }, () => []);
  for (const [token, id] of Object.entries(trial.provenance.edgeMap)) edgeOrigins[id].push(token);
  nodeOrigins.forEach((items) => items.sort()); edgeOrigins.forEach((items) => items.sort());
  return { nodeOrigins, edgeOrigins };
}
function encode(method, trial) {
  if (method === "ADJACENCY_ONLY") return { schema: "adjacency/1", display: trial.display };
  if (method === "PROPERTY_GRAPH") {
    const { nodeOrigins, edgeOrigins } = originTables(trial);
    return {
      schema: "property-graph/1", sourceCounts: { A: trial.sources.A.n, B: trial.sources.B.n }, sourceDigest: trial.sourceDigest,
      provenanceDigest: trial.provenanceDigest,
      nodes: nodeOrigins.map((origins, id) => ({ id, origins })),
      edges: trial.display.edges.map(([u, v], id) => ({ id, u, v, origins: edgeOrigins[id] }))
    };
  }
  if (method === "BIPARTITE_INCIDENCE") {
    return {
      schema: "bipartite-incidence/1", sourceCounts: { A: trial.sources.A.n, B: trial.sources.B.n }, sourceDigest: trial.sourceDigest,
      provenanceDigest: trial.provenanceDigest, display: trial.display,
      occurrences: Object.entries(trial.provenance.vertexMap).sort().map(([token, displayVertex]) => ({ token, displayVertex })),
      incidenceEdges: Object.entries(trial.provenance.edgeMap).sort().map(([token, displayEdge]) => {
        const parsed = parseEdgeToken(token);
        return { token, ends: parsed.edge.map((index) => vertexToken(parsed.layer, index)), displayEdge };
      })
    };
  }
  if (method === "COSPAN_PUSHOUT") {
    return { schema: "cospan-pushout/1", sourceDigest: trial.sourceDigest, provenanceDigest: trial.provenanceDigest, sources: trial.sources, display: trial.display, vertexMap: trial.provenance.vertexMap, edgeMap: trial.provenance.edgeMap };
  }
  if (method === "NEXAH_RETURN_RECEIPT") {
    const layer = (name) => ({
      vertices: Object.entries(trial.provenance.vertexMap).filter(([token]) => token.startsWith(`${name}:`)).sort().map(([token, displayVertex]) => ({ token, displayVertex })),
      edges: Object.entries(trial.provenance.edgeMap).filter(([token]) => token.startsWith(`${name}:`)).sort().map(([token, displayEdge]) => ({ token, displayEdge }))
    });
    return {
      schema: "nexah-loss-return-receipt/1", display: trial.display,
      returnReceipt: {
        status: "RETURN_MAP_DECLARED", sourceDigest: trial.sourceDigest, provenanceDigest: trial.provenanceDigest,
        layers: { A: layer("A"), B: layer("B") },
        seam: { selector: trial.overlap.kind, preimages: trial.overlap.A.map((value, index) => [vertexToken("A", value), vertexToken("B", trial.overlap.B[index])]) },
        claimBoundary: "encoding-reconstruction-only", loss: "display-alone-omits-labelled-preimages"
      }
    };
  }
  throw new Error(`UNKNOWN_METHOD:${method}`);
}

function graphFromEdgeTokens(layer, n, edgeTokens) {
  const edges = edgeTokens.filter((token) => token.startsWith(`${layer}:`)).map((token) => parseEdgeToken(token).edge);
  return graph(n, edges);
}
function verifyDecoded(decoded, payload) {
  if (!decoded || !decoded.sources || !decoded.provenance || !decoded.display) return { valid: false };
  if (sha(decoded.provenance) !== decoded.provenanceDigest) return { valid: false };
  if (sourceDigest(decoded.sources) !== decoded.sourceDigest) return { valid: false };
  const expectedTokens = [];
  for (const layer of ["A", "B"]) for (let i = 0; i < decoded.sources[layer].n; i++) expectedTokens.push(vertexToken(layer, i));
  if (Object.keys(decoded.provenance.vertexMap).sort().join("|") !== expectedTokens.sort().join("|")) return { valid: false };
  const quotientEdges = new Set();
  const expectedEdgeTokens = [];
  for (const layer of ["A", "B"]) {
    for (const edge of decoded.sources[layer].edges) {
      const token = edgeToken(layer, edge); expectedEdgeTokens.push(token);
      const u = decoded.provenance.vertexMap[vertexToken(layer, edge[0])];
      const v = decoded.provenance.vertexMap[vertexToken(layer, edge[1])];
      if (!Number.isInteger(u) || !Number.isInteger(v)) return { valid: false };
      quotientEdges.add(edgeKey(u, v));
      const displayId = decoded.display.edges.findIndex((item) => edgeKey(...item) === edgeKey(u, v));
      if (decoded.provenance.edgeMap[token] !== displayId) return { valid: false };
    }
  }
  if (Object.keys(decoded.provenance.edgeMap).sort().join("|") !== expectedEdgeTokens.sort().join("|")) return { valid: false };
  const displaySet = new Set(decoded.display.edges.map((edge) => edgeKey(...edge)));
  if (quotientEdges.size !== displaySet.size || [...quotientEdges].some((edge) => !displaySet.has(edge))) return { valid: false };
  return { valid: true, sources: decoded.sources };
}
function decode(method, payload) {
  try {
    if (method === "ADJACENCY_ONLY") return { valid: false };
    if (method === "PROPERTY_GRAPH") {
      const vertexMap = {}; const edgeMap = {};
      for (const node of payload.nodes) for (const token of node.origins) vertexMap[token] = node.id;
      for (const edge of payload.edges) for (const token of edge.origins) edgeMap[token] = edge.id;
      const edgeTokens = Object.keys(edgeMap);
      return verifyDecoded({
        sources: { A: graphFromEdgeTokens("A", payload.sourceCounts.A, edgeTokens), B: graphFromEdgeTokens("B", payload.sourceCounts.B, edgeTokens) },
        provenance: { vertexMap, edgeMap }, display: { vertices: payload.nodes.length, edges: payload.edges.map(({ u, v }) => [u, v]) },
        sourceDigest: payload.sourceDigest, provenanceDigest: payload.provenanceDigest
      }, payload);
    }
    if (method === "BIPARTITE_INCIDENCE") {
      const vertexMap = Object.fromEntries(payload.occurrences.map((item) => [item.token, item.displayVertex]));
      const edgeMap = Object.fromEntries(payload.incidenceEdges.map((item) => [item.token, item.displayEdge]));
      const edgeTokens = Object.keys(edgeMap);
      return verifyDecoded({
        sources: { A: graphFromEdgeTokens("A", payload.sourceCounts.A, edgeTokens), B: graphFromEdgeTokens("B", payload.sourceCounts.B, edgeTokens) },
        provenance: { vertexMap, edgeMap }, display: payload.display, sourceDigest: payload.sourceDigest, provenanceDigest: payload.provenanceDigest
      }, payload);
    }
    if (method === "COSPAN_PUSHOUT") return verifyDecoded({ sources: payload.sources, provenance: { vertexMap: payload.vertexMap, edgeMap: payload.edgeMap }, display: payload.display, sourceDigest: payload.sourceDigest, provenanceDigest: payload.provenanceDigest }, payload);
    if (method === "NEXAH_RETURN_RECEIPT") {
      const rr = payload.returnReceipt;
      const vertices = [...rr.layers.A.vertices, ...rr.layers.B.vertices];
      const edges = [...rr.layers.A.edges, ...rr.layers.B.edges];
      const vertexMap = Object.fromEntries(vertices.map((item) => [item.token, item.displayVertex]));
      const edgeMap = Object.fromEntries(edges.map((item) => [item.token, item.displayEdge]));
      const counts = { A: rr.layers.A.vertices.length, B: rr.layers.B.vertices.length };
      const edgeTokens = Object.keys(edgeMap);
      const decoded = verifyDecoded({
        sources: { A: graphFromEdgeTokens("A", counts.A, edgeTokens), B: graphFromEdgeTokens("B", counts.B, edgeTokens) },
        provenance: { vertexMap, edgeMap }, display: payload.display, sourceDigest: rr.sourceDigest, provenanceDigest: rr.provenanceDigest
      }, payload);
      if (!decoded.valid) return decoded;
      for (const [a, b] of rr.seam.preimages) if (vertexMap[a] !== vertexMap[b]) return { valid: false };
      return decoded;
    }
  } catch (_) { return { valid: false }; }
  return { valid: false };
}

function clone(value) { return JSON.parse(JSON.stringify(value)); }
function relocatePropertyOrigin(payload, token) {
  const source = payload.nodes.find((node) => node.origins.includes(token));
  if (!source) return;
  source.origins = source.origins.filter((item) => item !== token);
  const target = payload.nodes.find((node) => node.id !== source.id);
  target.origins.push(token); target.origins.sort();
}
function corrupt(method, payload, trial, seamOnly) {
  const out = clone(payload);
  const token = seamOnly ? vertexToken("B", trial.overlap.B[0]) : vertexToken("A", 0);
  if (method === "PROPERTY_GRAPH") relocatePropertyOrigin(out, token);
  else if (method === "BIPARTITE_INCIDENCE") {
    const item = out.occurrences.find((entry) => entry.token === token);
    item.displayVertex = (item.displayVertex + 1) % out.display.vertices;
  } else if (method === "COSPAN_PUSHOUT") out.vertexMap[token] = (out.vertexMap[token] + 1) % out.display.vertices;
  else if (method === "NEXAH_RETURN_RECEIPT") {
    const item = out.returnReceipt.layers[token[0]].vertices.find((entry) => entry.token === token);
    item.displayVertex = (item.displayVertex + 1) % out.display.vertices;
  }
  return out;
}
function exactSources(decoded, trial) { return decoded.valid && stable(decoded.sources) === stable(trial.sources); }

function run() {
  if (prereg.status !== "FROZEN_BOUNDED_ENGINEERING_VERIFICATION_NOT_A_LAB_RUN") throw new Error("PREREG_NOT_FROZEN");
  const started = process.hrtime.bigint();
  const random = xorshift32(prereg.seed);
  const methods = prereg.methods;
  const stats = Object.fromEntries(methods.map((method) => [method, { exact: 0, corruptionDetected: 0, falseSeamDetected: 0, bytes: 0, records: 0 }]));
  const population = { families: Object.fromEntries(prereg.families.map((family) => [family, 0])), overlaps: Object.fromEntries(prereg.overlaps.map((overlap) => [overlap, 0])) };
  let trialIndex = 0;
  for (const family of prereg.families) {
    for (let within = 0; within < prereg.trials_per_family; within++, trialIndex++) {
      const overlapKind = prereg.overlaps[trialIndex % prereg.overlaps.length];
      const trial = makeTrial(family, overlapKind, random);
      population.families[family]++; population.overlaps[overlapKind]++;
      for (const method of methods) {
        const payload = encode(method, trial);
        const size = payloadStats(payload);
        stats[method].bytes += size.bytes; stats[method].records += size.records;
        stats[method].exact += Number(exactSources(decode(method, payload), trial));
        if (method !== "ADJACENCY_ONLY") {
          stats[method].corruptionDetected += Number(!decode(method, corrupt(method, payload, trial, false)).valid);
          stats[method].falseSeamDetected += Number(!decode(method, corrupt(method, payload, trial, true)).valid);
        }
      }
    }
  }
  const summary = {};
  for (const method of methods) {
    const value = stats[method];
    summary[method] = {
      exact_count: value.exact, exact_rate: value.exact / prereg.trials,
      corruption_detected_count: value.corruptionDetected, corruption_detection_rate: value.corruptionDetected / prereg.trials,
      false_seam_detected_count: value.falseSeamDetected, false_seam_detection_rate: value.falseSeamDetected / prereg.trials,
      total_bytes: value.bytes, mean_bytes: value.bytes / prereg.trials,
      total_records: value.records, mean_records: value.records / prereg.trials
    };
  }
  const provenanceMethods = methods.slice(1);
  const gates = {
    population_total: trialIndex === prereg.trials,
    population_families: Object.values(population.families).every((count) => count === prereg.trials_per_family),
    population_overlaps: Math.max(...Object.values(population.overlaps)) - Math.min(...Object.values(population.overlaps)) <= 1,
    adjacency_exact: summary.ADJACENCY_ONLY.exact_rate <= prereg.gates.adjacency_exact_max,
    provenance_exact: provenanceMethods.every((method) => summary[method].exact_rate >= prereg.gates.provenance_methods_exact_min),
    corruption_detection: provenanceMethods.every((method) => summary[method].corruption_detection_rate >= prereg.gates.provenance_methods_corruption_detection_min),
    false_seam_detection: provenanceMethods.every((method) => summary[method].false_seam_detection_rate >= prereg.gates.provenance_methods_false_seam_detection_min)
  };
  const valid = Object.values(gates).every(Boolean);
  const nexah = summary.NEXAH_RETURN_RECEIPT;
  const baselines = provenanceMethods.filter((method) => method !== "NEXAH_RETURN_RECEIPT").map((method) => summary[method]);
  const bestExact = Math.max(...baselines.map((item) => item.exact_rate));
  const bestRobustness = Math.max(...baselines.map((item) => Math.min(item.corruption_detection_rate, item.false_seam_detection_rate)));
  const bestBytes = Math.min(...baselines.map((item) => item.mean_bytes));
  let conclusion = "FALSIFIED_OR_INVALID";
  if (valid) {
    const nexahRobustness = Math.min(nexah.corruption_detection_rate, nexah.false_seam_detection_rate);
    if (nexah.exact_rate > bestExact || nexahRobustness > bestRobustness || nexah.mean_bytes < bestBytes) conclusion = "METHOD_ADVANTAGE";
    else if (nexah.exact_rate === bestExact && nexahRobustness === bestRobustness && nexah.mean_bytes > bestBytes) conclusion = "EQUIVALENT_RECOVERY_WITH_EXPLICIT_GOVERNANCE_OVERHEAD";
    else conclusion = "NO_DISTINCT_METHOD_ADVANTAGE";
  }
  return {
    schema: "a0.ullinium-methods-1-5-result/1.0.0", date: "2026-11-11",
    classification: "BOUNDED_ENGINEERING_VERIFICATION_NOT_A_LAB_RUN",
    preregistration_sha256: crypto.createHash("sha256").update(preregBytes).digest("hex"), seed: prereg.seed,
    trials: prereg.trials, population, methods: summary, gates, valid_comparison: valid, conclusion,
    comparison: {
      best_standard_mean_bytes: bestBytes,
      nexah_mean_bytes: nexah.mean_bytes,
      nexah_byte_overhead_vs_best_standard: nexah.mean_bytes - bestBytes,
      nexah_byte_ratio_vs_best_standard: nexah.mean_bytes / bestBytes,
      distinct_reconstruction_advantage: nexah.exact_rate > bestExact,
      distinct_robustness_advantage: Math.min(nexah.corruption_detection_rate, nexah.false_seam_detection_rate) > bestRobustness
    },
    descriptive_runtime_ms: Number(process.hrtime.bigint() - started) / 1e6,
    claim_ceiling: prereg.claim_ceiling, identity_effect: prereg.identity_effect
  };
}

if (require.main === module) {
  const result = run();
  if (process.argv.includes("--write")) {
    const out = path.join(__dirname, "results/a0-ullinium-methods-1-5-result-2026-11-11.json");
    fs.writeFileSync(out, `${JSON.stringify(result, null, 2)}\n`);
    console.log(out);
  } else console.log(JSON.stringify(result, null, 2));
}

module.exports = { stable, xorshift32, generateGraph, paths2, makeTrial, encode, decode, corrupt, run };
