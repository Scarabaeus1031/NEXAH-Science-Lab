(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.A0TessarecBlueBody = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const RINGS = ["A", "B", "C", "E", "D", "F"];
  const mod8 = (value) => (value + 8) % 8;
  const vertexId = (ring, index) => `${ring}${mod8(index)}`;
  const edgeKey = (left, right) => left < right ? `${left}|${right}` : `${right}|${left}`;

  function buildShell() {
    const vertices = RINGS.flatMap((ring) => Array.from({ length: 8 }, (_, index) => vertexId(ring, index)));
    const faces = [
      { id: "O-N", type: "O", vertices: Array.from({ length: 8 }, (_, index) => vertexId("A", index)) },
      { id: "O-S", type: "O", vertices: Array.from({ length: 8 }, (_, index) => vertexId("F", 7 - index)) }
    ];
    for (let index = 0; index < 8; index += 1) {
      faces.push({
        id: `P-N${index + 1}`,
        type: "P",
        vertices: [vertexId("A", index), vertexId("A", index + 1), vertexId("B", index + 1), vertexId("C", index), vertexId("B", index)]
      });
      faces.push({
        id: `H-${index + 1}`,
        type: "H",
        vertices: [vertexId("C", index - 1), vertexId("B", index), vertexId("C", index), vertexId("E", index), vertexId("D", index), vertexId("E", index - 1)]
      });
      faces.push({
        id: `P-S${index + 1}`,
        type: "P",
        vertices: [vertexId("F", index), vertexId("D", index), vertexId("E", index), vertexId("D", index + 1), vertexId("F", index + 1)]
      });
    }

    const edgeOwners = new Map();
    for (const face of faces) {
      for (let index = 0; index < face.vertices.length; index += 1) {
        const key = edgeKey(face.vertices[index], face.vertices[(index + 1) % face.vertices.length]);
        if (!edgeOwners.has(key)) edgeOwners.set(key, []);
        edgeOwners.get(key).push(face.id);
      }
    }
    const adjacency = new Map(vertices.map((vertex) => [vertex, new Set()]));
    for (const key of edgeOwners.keys()) {
      const [left, right] = key.split("|");
      adjacency.get(left).add(right);
      adjacency.get(right).add(left);
    }
    return { vertices, faces, edgeOwners, adjacency };
  }

  function buildCarrier() {
    const states = [];
    const edges = [];
    for (let layer = 0; layer < 3; layer += 1) {
      for (let q = 0; q < 16; q += 1) states.push(`P${layer}:${q.toString(2).padStart(4, "0")}`);
      for (let q = 0; q < 16; q += 1) {
        for (let bit = 0; bit < 4; bit += 1) {
          const other = q ^ (1 << bit);
          if (q < other) edges.push({ left: stateId(layer, q), right: stateId(layer, other), kind: `Q${bit}` });
        }
      }
    }
    for (let layer = 0; layer < 2; layer += 1) {
      for (let q = 0; q < 16; q += 1) edges.push({ left: stateId(layer, q), right: stateId(layer + 1, q), kind: "P" });
    }
    return { states, edges };
  }

  function stateId(layer, q) {
    return `P${layer}:${q.toString(2).padStart(4, "0")}`;
  }

  function allPairsShortestPaths(shell) {
    const distances = new Map();
    const paths = new Map();
    for (const source of shell.vertices) {
      const queue = [source];
      const distance = new Map([[source, 0]]);
      const previous = new Map();
      for (let cursor = 0; cursor < queue.length; cursor += 1) {
        const current = queue[cursor];
        const neighbors = [...shell.adjacency.get(current)].sort();
        for (const next of neighbors) {
          if (distance.has(next)) continue;
          distance.set(next, distance.get(current) + 1);
          previous.set(next, current);
          queue.push(next);
        }
      }
      for (const target of shell.vertices) {
        const route = [target];
        let current = target;
        while (current !== source) {
          current = previous.get(current);
          if (current === undefined) throw new Error(`Disconnected shell: ${source} -> ${target}`);
          route.push(current);
        }
        route.reverse();
        distances.set(`${source}>${target}`, distance.get(target));
        paths.set(`${source}>${target}`, route);
      }
    }
    return { distances, paths };
  }

  function bandVertices(layer) {
    const pair = layer === 0 ? ["A", "B"] : layer === 1 ? ["C", "E"] : ["D", "F"];
    return pair.flatMap((ring) => Array.from({ length: 8 }, (_, index) => vertexId(ring, index)));
  }

  function grayBaseline() {
    const gray = [0, 1, 3, 2, 6, 7, 5, 4];
    const mapping = {};
    const pairs = [["A", "B"], ["C", "E"], ["D", "F"]];
    for (let layer = 0; layer < 3; layer += 1) {
      for (let index = 0; index < 8; index += 1) {
        mapping[stateId(layer, gray[index])] = vertexId(pairs[layer][0], index);
        mapping[stateId(layer, 8 | gray[index])] = vertexId(pairs[layer][1], index);
      }
    }
    return mapping;
  }

  function seededRandom(seed) {
    let value = seed >>> 0;
    return function random() {
      value = (value + 0x6D2B79F5) >>> 0;
      let mixed = value;
      mixed = Math.imul(mixed ^ (mixed >>> 15), mixed | 1);
      mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61);
      return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
    };
  }

  function wirelength(mapping, carrier, shortest) {
    return carrier.edges.reduce((sum, edge) => sum + shortest.distances.get(`${mapping[edge.left]}>${mapping[edge.right]}`), 0);
  }

  function optimizeMapping(options = {}) {
    const shell = options.shell || buildShell();
    const carrier = options.carrier || buildCarrier();
    const shortest = options.shortest || allPairsShortestPaths(shell);
    const iterations = options.iterations || 60000;
    const random = seededRandom(options.seed === undefined ? 4802168 : options.seed);
    const mapping = { ...(options.start || grayBaseline()) };
    const preserveLayers = options.preserveLayers !== false;
    const statesByLayer = preserveLayers
      ? [0, 1, 2].map((layer) => Array.from({ length: 16 }, (_, q) => stateId(layer, q)))
      : [carrier.states.slice()];
    if (!preserveLayers && !options.start) {
      const states = statesByLayer[0];
      const targets = states.map((state) => mapping[state]);
      for (let index = targets.length - 1; index > 0; index -= 1) {
        const swap = Math.floor(random() * (index + 1));
        [targets[index], targets[swap]] = [targets[swap], targets[index]];
      }
      states.forEach((state, index) => { mapping[state] = targets[index]; });
    }
    let current = wirelength(mapping, carrier, shortest);
    let bestScore = current;
    let best = { ...mapping };

    for (let step = 0; step < iterations; step += 1) {
      const layer = Math.floor(random() * statesByLayer.length);
      const states = statesByLayer[layer];
      const left = states[Math.floor(random() * states.length)];
      let right = states[Math.floor(random() * states.length)];
      if (right === left) right = states[(states.indexOf(left) + 1) % states.length];
      const temp = mapping[left]; mapping[left] = mapping[right]; mapping[right] = temp;
      const candidate = wirelength(mapping, carrier, shortest);
      const temperature = Math.max(0.04, 5.5 * (1 - step / iterations));
      const accept = candidate <= current || random() < Math.exp((current - candidate) / temperature);
      if (accept) {
        current = candidate;
        if (candidate < bestScore) { bestScore = candidate; best = { ...mapping }; }
      } else {
        const rollback = mapping[left]; mapping[left] = mapping[right]; mapping[right] = rollback;
      }
    }
    return { mapping: best, score: bestScore, iterations, seed: options.seed === undefined ? 4802168 : options.seed, preserveLayers };
  }

  function metrics(mapping, shell, carrier, shortest) {
    const loads = new Map([...shell.edgeOwners.keys()].map((key) => [key, 0]));
    const lengths = [];
    const routed = [];
    for (const edge of carrier.edges) {
      const source = mapping[edge.left];
      const target = mapping[edge.right];
      const path = shortest.paths.get(`${source}>${target}`);
      lengths.push(path.length - 1);
      for (let index = 0; index < path.length - 1; index += 1) {
        const key = edgeKey(path[index], path[index + 1]);
        loads.set(key, loads.get(key) + 1);
      }
      routed.push({ ...edge, source, target, path });
    }
    const total = lengths.reduce((sum, value) => sum + value, 0);
    const maxLoad = Math.max(...loads.values());
    const maxDilation = Math.max(...lengths);
    const vertexBand = (vertex) => vertex[0] === "A" || vertex[0] === "B" ? 0 : vertex[0] === "C" || vertex[0] === "E" ? 1 : 2;
    const layerRetained = carrier.states.filter((state) => Number(state[1]) === vertexBand(mapping[state])).length;
    return {
      wirelength: total,
      meanDilation: total / lengths.length,
      maxDilation,
      maxCongestion: maxLoad,
      directEdges: lengths.filter((value) => value === 1).length,
      layerRetained,
      routed,
      loads
    };
  }

  function validate(shell, carrier, mapping) {
    const faceCounts = shell.faces.reduce((counts, face) => ({ ...counts, [face.type]: (counts[face.type] || 0) + 1 }), {});
    const closed = [...shell.edgeOwners.values()].every((owners) => owners.length === 2);
    const cubic = [...shell.adjacency.values()].every((neighbors) => neighbors.size === 3);
    const mapped = Object.values(mapping);
    return {
      vertices: shell.vertices.length,
      edges: shell.edgeOwners.size,
      faces: shell.faces.length,
      euler: shell.vertices.length - shell.edgeOwners.size + shell.faces.length,
      faceCounts,
      closed,
      cubic,
      carrierStates: carrier.states.length,
      carrierEdges: carrier.edges.length,
      bijective: mapped.length === carrier.states.length && new Set(mapped).size === shell.vertices.length && mapped.every((vertex) => shell.adjacency.has(vertex))
    };
  }

  function run(options = {}) {
    const shell = buildShell();
    const carrier = buildCarrier();
    const shortest = allPairsShortestPaths(shell);
    const baseline = grayBaseline();
    const optimized = optimizeMapping({ shell, carrier, shortest, ...options, preserveLayers: true });
    const free = optimizeMapping({ shell, carrier, shortest, ...options, preserveLayers: false, seed: options.freeSeed === undefined ? 7 : options.freeSeed });
    return {
      shell,
      carrier,
      shortest,
      baseline,
      optimized,
      free,
      validation: validate(shell, carrier, optimized.mapping),
      baselineMetrics: metrics(baseline, shell, carrier, shortest),
      optimizedMetrics: metrics(optimized.mapping, shell, carrier, shortest),
      freeMetrics: metrics(free.mapping, shell, carrier, shortest)
    };
  }

  return { RINGS, buildShell, buildCarrier, allPairsShortestPaths, grayBaseline, optimizeMapping, metrics, validate, run, stateId, edgeKey, bandVertices };
});
