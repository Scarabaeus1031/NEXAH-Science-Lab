(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.NEXAHLifeMultiView = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const WIDTH = 40;
  const HEIGHT = 40;
  const SAMPLE_TIMES = [6, 12, 18, 24, 30, 36];
  const SHIFTS = [[0, 0], [4, 3], [-5, 2]];
  const GON_SIZES = [17, 19, 29];
  const PATTERNS = {
    block: [[0, 0], [1, 0], [0, 1], [1, 1]],
    blinker: [[-1, 0], [0, 0], [1, 0]],
    beacon: [[0, 0], [1, 0], [0, 1], [3, 2], [2, 3], [3, 3]],
    glider: [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]],
    r_pentomino: [[0, -1], [1, -1], [-1, 0], [0, 0], [0, 1]],
    acorn: [[-3, 0], [-2, 0], [-2, -2], [0, -1], [1, 0], [2, 0], [3, 0]],
    diehard: [[-3, 0], [-2, 0], [-2, 1], [2, 1], [3, -1], [3, 1], [4, 1]]
  };

  const index = (x, y, width = WIDTH) => y * width + x;
  const countLive = (grid) => grid.reduce((sum, value) => sum + value, 0);
  const hashGrid = (grid) => {
    let hash = 2166136261;
    for (let i = 0; i < grid.length; i += 1) {
      hash ^= grid[i] + (i & 255);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(16).padStart(8, "0");
  };

  function createGrid(patternName = "glider", shift = [0, 0], width = WIDTH, height = HEIGHT) {
    const grid = new Uint8Array(width * height);
    const pattern = PATTERNS[patternName];
    if (!pattern) throw new Error(`Unknown pattern: ${patternName}`);
    const cx = Math.floor(width / 2) + shift[0];
    const cy = Math.floor(height / 2) + shift[1];
    pattern.forEach(([dx, dy]) => {
      const x = cx + dx;
      const y = cy + dy;
      if (x >= 0 && x < width && y >= 0 && y < height) grid[index(x, y, width)] = 1;
    });
    return grid;
  }

  function step(grid, width = WIDTH, height = HEIGHT) {
    const next = new Uint8Array(grid.length);
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        let neighbours = 0;
        for (let dy = -1; dy <= 1; dy += 1) {
          for (let dx = -1; dx <= 1; dx += 1) {
            if (!dx && !dy) continue;
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) neighbours += grid[index(nx, ny, width)];
          }
        }
        const alive = grid[index(x, y, width)] === 1;
        next[index(x, y, width)] = neighbours === 3 || (alive && neighbours === 2) ? 1 : 0;
      }
    }
    return next;
  }

  function run(patternName, generations = 48, shift = [0, 0], width = WIDTH, height = HEIGHT) {
    const frames = [createGrid(patternName, shift, width, height)];
    for (let generation = 0; generation < generations; generation += 1) frames.push(step(frames.at(-1), width, height));
    return frames;
  }

  function entropy(grid) {
    const p = countLive(grid) / grid.length;
    if (p === 0 || p === 1) return 0;
    return -(p * Math.log2(p) + (1 - p) * Math.log2(1 - p));
  }

  function componentCount(grid, width = WIDTH, height = HEIGHT) {
    const seen = new Uint8Array(grid.length);
    let count = 0;
    for (let start = 0; start < grid.length; start += 1) {
      if (!grid[start] || seen[start]) continue;
      count += 1;
      const queue = [start];
      seen[start] = 1;
      for (let head = 0; head < queue.length; head += 1) {
        const current = queue[head];
        const x = current % width;
        const y = Math.floor(current / width);
        for (let dy = -1; dy <= 1; dy += 1) {
          for (let dx = -1; dx <= 1; dx += 1) {
            if (!dx && !dy) continue;
            const nx = x + dx;
            const ny = y + dy;
            if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
            const ni = index(nx, ny, width);
            if (grid[ni] && !seen[ni]) {
              seen[ni] = 1;
              queue.push(ni);
            }
          }
        }
      }
    }
    return count;
  }

  function centroid(grid, width = WIDTH, height = HEIGHT) {
    let sx = 0;
    let sy = 0;
    let n = 0;
    for (let y = 0; y < height; y += 1) for (let x = 0; x < width; x += 1) if (grid[index(x, y, width)]) {
      sx += x;
      sy += y;
      n += 1;
    }
    return n ? [sx / n, sy / n] : [(width - 1) / 2, (height - 1) / 2];
  }

  function baselineVector(grid, width = WIDTH, height = HEIGHT) {
    return [countLive(grid) / 64, componentCount(grid, width, height) / 16, entropy(grid)];
  }

  function blockVector(grid, width = WIDTH, height = HEIGHT, blocks = 5) {
    const out = [];
    for (let by = 0; by < blocks; by += 1) for (let bx = 0; bx < blocks; bx += 1) {
      const x0 = Math.floor(bx * width / blocks);
      const x1 = Math.floor((bx + 1) * width / blocks);
      const y0 = Math.floor(by * height / blocks);
      const y1 = Math.floor((by + 1) * height / blocks);
      let sum = 0;
      for (let y = y0; y < y1; y += 1) for (let x = x0; x < x1; x += 1) sum += grid[index(x, y, width)];
      out.push(sum / Math.max(1, (x1 - x0) * (y1 - y0)));
    }
    return out;
  }

  const FOURIER_MODES = [[0, 0], [1, 0], [0, 1], [1, 1], [2, 0], [0, 2], [2, 1], [1, 2]];
  function fourierVector(grid, width = WIDTH, height = HEIGHT) {
    const live = Math.max(1, countLive(grid));
    return FOURIER_MODES.map(([kx, ky]) => {
      let re = 0;
      let im = 0;
      for (let y = 0; y < height; y += 1) for (let x = 0; x < width; x += 1) if (grid[index(x, y, width)]) {
        const angle = -2 * Math.PI * (kx * x / width + ky * y / height);
        re += Math.cos(angle);
        im += Math.sin(angle);
      }
      return Math.hypot(re, im) / live;
    });
  }

  function changeCount(a, b) {
    let total = 0;
    for (let i = 0; i < a.length; i += 1) total += a[i] !== b[i] ? 1 : 0;
    return total;
  }

  function shadowMemoryVector(frames, generation) {
    const out = [];
    const start = Math.max(0, generation - 4);
    for (let t = start; t <= generation; t += 1) out.push(countLive(frames[t]) / 64);
    while (out.length < 5) out.unshift(out[0] || 0);
    for (let t = Math.max(1, generation - 3); t <= generation; t += 1) out.push(changeCount(frames[t - 1], frames[t]) / 64);
    while (out.length < 9) out.push(0);
    return out;
  }

  function minRotation(values) {
    if (!values.length) return values;
    let best = values.slice();
    let bestKey = best.map((value) => value.toFixed(5)).join(",");
    for (let shift = 1; shift < values.length; shift += 1) {
      const candidate = values.slice(shift).concat(values.slice(0, shift));
      const key = candidate.map((value) => value.toFixed(5)).join(",");
      if (key < bestKey) {
        best = candidate;
        bestKey = key;
      }
    }
    return best;
  }

  function shadowGonVector(grid, sides = 17, width = WIDTH, height = HEIGHT) {
    const [cx, cy] = centroid(grid, width, height);
    const counts = Array(sides).fill(0);
    const radii = Array(sides).fill(0);
    let maxRadius = 1;
    const points = [];
    for (let y = 0; y < height; y += 1) for (let x = 0; x < width; x += 1) if (grid[index(x, y, width)]) {
      const radius = Math.hypot(x - cx, y - cy);
      maxRadius = Math.max(maxRadius, radius);
      points.push([x, y, radius]);
    }
    points.forEach(([x, y, radius]) => {
      const angle = (Math.atan2(y - cy, x - cx) + 2 * Math.PI) % (2 * Math.PI);
      const sector = Math.min(sides - 1, Math.floor(angle / (2 * Math.PI) * sides));
      counts[sector] += 1;
      radii[sector] += radius / maxRadius;
    });
    const live = Math.max(1, points.length);
    const canonicalCounts = minRotation(counts.map((value) => value / live));
    const canonicalRadii = minRotation(radii.map((value) => value / live));
    return canonicalCounts.concat(canonicalRadii);
  }

  function poincarePoints(grid, width = WIDTH, height = HEIGHT) {
    const points = [];
    for (let y = 0; y < height; y += 1) for (let x = 0; x < width; x += 1) if (grid[index(x, y, width)]) {
      const re = (x - (width - 1) / 2) / width * 3;
      const im = 0.35 + (y + 1) / (height + 1) * 2.4;
      const nr = re;
      const ni = im - 1;
      const dr = re;
      const di = im + 1;
      const denominator = dr * dr + di * di;
      points.push({
        source: [x, y],
        disk: [(nr * dr + ni * di) / denominator, (ni * dr - nr * di) / denominator]
      });
    }
    return points;
  }

  const E8_EDGES = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [2, 7]];
  function e8AdapterVector(grid, frames, generation) {
    const source = [
      ...baselineVector(grid),
      ...fourierVector(grid).slice(1, 4),
      ...shadowMemoryVector(frames, generation).slice(-2)
    ];
    const state = source.slice(0, 8).map((value) => value > 0.66 ? 1 : value > 0.2 ? 0 : -1);
    const neighbours = Array.from({ length: 8 }, () => []);
    E8_EDGES.forEach(([a, b]) => { neighbours[a].push(b); neighbours[b].push(a); });
    const mutations = state.map((_, generator) => state.map((value, coordinate) => coordinate === generator
      ? -value + neighbours[coordinate].reduce((sum, adjacent) => sum + state[adjacent], 0)
      : value));
    const norms = mutations.map((mutation) => Math.sqrt(mutation.reduce((sum, value) => sum + value * value, 0)) / 6);
    const returns = mutations.map((mutation, generator) => {
      const second = mutation.map((value, coordinate) => coordinate === generator
        ? -value + neighbours[coordinate].reduce((sum, adjacent) => sum + mutation[adjacent], 0)
        : value);
      return second.every((value, coordinate) => value === state[coordinate]) ? 1 : 0;
    });
    return state.map((value) => (value + 1) / 2).concat(norms, returns);
  }

  function futureClass(frames, generation, horizon = 8) {
    const slice = frames.slice(generation, generation + horizon + 1);
    const counts = slice.map(countLive);
    const hashes = slice.map(hashGrid);
    if (counts.at(-1) === 0) return "extinct";
    if (hashes.every((value) => value === hashes[0])) return "fixed";
    if (hashes.length >= 5 && hashes.slice(2).every((value, i) => value === hashes[i])) return "period-2";
    if (counts.every((value) => value === counts[0])) return "constant-count motion";
    const delta = counts.at(-1) - counts[0];
    if (delta >= 4) return "growth";
    if (delta <= -4) return "decay";
    return "transient";
  }

  function featureRecord(frames, generation) {
    const grid = frames[generation];
    const baseline = baselineVector(grid);
    const block = blockVector(grid);
    const fourier = fourierVector(grid);
    const memory = shadowMemoryVector(frames, generation);
    const polygons = GON_SIZES.flatMap((sides) => shadowGonVector(grid, sides));
    const e8_adapter = e8AdapterVector(grid, frames, generation);
    const scale = (vector) => vector.map((value) => value / Math.sqrt(vector.length));
    return {
      baseline,
      grid: block,
      fourier,
      memory,
      polygons,
      e8_adapter,
      combined: [...scale(baseline), ...scale(block), ...scale(fourier), ...scale(memory), ...scale(polygons), ...scale(e8_adapter)]
    };
  }

  function distance(a, b) {
    let total = 0;
    for (let i = 0; i < a.length; i += 1) total += (a[i] - b[i]) ** 2;
    return Math.sqrt(total);
  }

  function nearest(train, vector, family) {
    let best = null;
    for (const item of train) {
      const d = distance(item.features[family], vector);
      if (!best || d < best.distance) best = { distance: d, label: item.label, pattern: item.pattern };
    }
    return best;
  }

  function buildDataset() {
    const rows = [];
    Object.keys(PATTERNS).forEach((pattern) => SHIFTS.forEach((shift, shiftIndex) => {
      const frames = run(pattern, 48, shift);
      SAMPLE_TIMES.forEach((generation) => rows.push({
        pattern,
        shift,
        shiftIndex,
        generation,
        label: futureClass(frames, generation),
        features: featureRecord(frames, generation)
      }));
    }));
    return rows;
  }

  function evaluate() {
    const rows = buildDataset();
    const train = rows.filter((row) => row.shiftIndex === 0);
    const test = rows.filter((row) => row.shiftIndex !== 0);
    const families = ["baseline", "grid", "fourier", "memory", "polygons", "e8_adapter", "combined"];
    const results = families.map((family) => {
      let correct = 0;
      const confusion = {};
      test.forEach((row) => {
        const prediction = nearest(train, row.features[family], family).label;
        if (prediction === row.label) correct += 1;
        const key = `${row.label} → ${prediction}`;
        confusion[key] = (confusion[key] || 0) + 1;
      });
      return {
        family,
        correct,
        total: test.length,
        accuracy: correct / test.length,
        confusion
      };
    });
    const baseline = results.find((result) => result.family === "baseline");
    const combined = results.find((result) => result.family === "combined");
    const best = results.reduce((winner, result) => result.accuracy > winner.accuracy ? result : winner, results[0]);
    return {
      experiment: "CA-IDENT-01",
      date: "2026-10-08",
      status: "EXECUTED_INTERNAL_FIXTURE",
      target: "8-generation behavior class on translated finite-dead holdouts",
      width: WIDTH,
      height: HEIGHT,
      patterns: Object.keys(PATTERNS),
      sample_times: SAMPLE_TIMES,
      train_rows: train.length,
      holdout_rows: test.length,
      results,
      baseline_accuracy: baseline.accuracy,
      combined_accuracy: combined.accuracy,
      delta: combined.accuracy - baseline.accuracy,
      best_view: best.family,
      best_accuracy: best.accuracy,
      best_delta: best.accuracy - baseline.accuracy,
      verdict: combined.accuracy > baseline.accuracy ? "COMBINED_UTILITY_SIGNAL" : best.accuracy > baseline.accuracy ? "LIMITED_VIEW_SIGNAL" : best.accuracy === baseline.accuracy ? "NO_INCREMENTAL_SIGNAL" : "NEGATIVE",
      claim_ceiling: "Deterministic in-repository fixture only. A gain on translated Conway seeds does not establish external utility, E8 specificity, physical resonance, biological meaning or a universal projection law."
    };
  }

  return {
    WIDTH,
    HEIGHT,
    PATTERNS,
    SAMPLE_TIMES,
    SHIFTS,
    GON_SIZES,
    createGrid,
    step,
    run,
    countLive,
    entropy,
    componentCount,
    centroid,
    baselineVector,
    blockVector,
    fourierVector,
    shadowMemoryVector,
    shadowGonVector,
    poincarePoints,
    e8AdapterVector,
    futureClass,
    featureRecord,
    buildDataset,
    evaluate,
    hashGrid
  };
});
