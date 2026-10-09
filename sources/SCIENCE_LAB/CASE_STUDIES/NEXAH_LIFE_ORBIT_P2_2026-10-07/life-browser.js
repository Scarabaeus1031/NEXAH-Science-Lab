(function initLifeOrbitEngine(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.LifeOrbitEngine = api;
}(typeof globalThis !== "undefined" ? globalThis : this, function lifeOrbitFactory() {
  "use strict";

  const WIDTH = 16;
  const HEIGHT = 16;
  const RULE = "B3/S23";
  const BOUNDARY = "finite-dead";

  const FIXTURES = Object.freeze({
    block: [[5, 5], [6, 5], [5, 6], [6, 6]],
    blinker: [[6, 7], [7, 7], [8, 7]],
    glider: [[4, 3], [5, 4], [3, 5], [4, 5], [5, 5]],
  });

  function assert(condition, message) {
    if (!condition) throw new TypeError(message);
  }

  function canonicalizeCells(cells, width = WIDTH, height = HEIGHT) {
    assert(Array.isArray(cells), "cells must be an array");
    const seen = new Set();
    const result = cells.map((cell, index) => {
      assert(Array.isArray(cell) && cell.length === 2, `cell ${index} must be [x,y]`);
      const x = cell[0];
      const y = cell[1];
      assert(Number.isInteger(x) && Number.isInteger(y), `cell ${index} must contain integers`);
      assert(x >= 0 && x < width && y >= 0 && y < height, `cell ${index} is outside the grid`);
      const key = `${x},${y}`;
      assert(!seen.has(key), `duplicate cell ${key}`);
      seen.add(key);
      return [x, y];
    });
    return result.sort((a, b) => a[1] - b[1] || a[0] - b[0]);
  }

  function makeState(live, width = WIDTH, height = HEIGHT) {
    return { width, height, boundary: BOUNDARY, live: canonicalizeCells(live, width, height) };
  }

  function cellKey(x, y) { return `${x},${y}`; }

  function neighbourCount(state, x, y) {
    const live = new Set(state.live.map((cell) => cellKey(cell[0], cell[1])));
    let count = 0;
    for (let dy = -1; dy <= 1; dy += 1) {
      for (let dx = -1; dx <= 1; dx += 1) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || nx >= state.width || ny < 0 || ny >= state.height) continue;
        if (live.has(cellKey(nx, ny))) count += 1;
      }
    }
    return count;
  }

  function inspectTransition(state, x, y) {
    assert(x >= 0 && x < state.width && y >= 0 && y < state.height, "cell is outside the grid");
    const live = new Set(state.live.map((cell) => cellKey(cell[0], cell[1])));
    const alive = live.has(cellKey(x, y));
    const neighbors = neighbourCount(state, x, y);
    let next = false;
    let branch = "REMAINS_DEAD";
    if (!alive && neighbors === 3) { next = true; branch = "BIRTH_B3"; }
    else if (alive && (neighbors === 2 || neighbors === 3)) { next = true; branch = "SURVIVAL_S23"; }
    else if (alive && neighbors < 2) branch = "DEATH_UNDERPOPULATION";
    else if (alive && neighbors > 3) branch = "DEATH_OVERPOPULATION";
    return { x, y, alive, neighbors, next, branch };
  }

  function step(state) {
    const current = makeState(state.live, state.width, state.height);
    const live = new Set(current.live.map((cell) => cellKey(cell[0], cell[1])));
    const counts = new Map();
    current.live.forEach(([x, y]) => {
      for (let dy = -1; dy <= 1; dy += 1) {
        for (let dx = -1; dx <= 1; dx += 1) {
          if (dx === 0 && dy === 0) continue;
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || nx >= current.width || ny < 0 || ny >= current.height) continue;
          const key = cellKey(nx, ny);
          counts.set(key, (counts.get(key) || 0) + 1);
        }
      }
    });
    const next = [];
    counts.forEach((count, key) => {
      if (count === 3 || (count === 2 && live.has(key))) next.push(key.split(",").map(Number));
    });
    return makeState(next, current.width, current.height);
  }

  function exactKey(state) { return JSON.stringify(state.live); }

  function shape(state) {
    if (state.live.length === 0) return { origin: [0, 0], key: "[]" };
    const minX = Math.min.apply(null, state.live.map((cell) => cell[0]));
    const minY = Math.min.apply(null, state.live.map((cell) => cell[1]));
    const relative = state.live
      .map((cell) => [cell[0] - minX, cell[1] - minY])
      .sort((a, b) => a[1] - b[1] || a[0] - b[0]);
    return { origin: [minX, minY], key: JSON.stringify(relative) };
  }

  function classifyLatest(history) {
    assert(Array.isArray(history) && history.length > 0, "history is required");
    const latestIndex = history.length - 1;
    const latest = history[latestIndex];
    if (latestIndex > 0 && latest.live.length === 0) {
      return { type: "EXTINCTION", base_generation: 0, detected_generation: latestIndex, period: latestIndex, translation: [0, 0] };
    }
    const currentKey = exactKey(latest);
    for (let previous = 0; previous < latestIndex; previous += 1) {
      if (exactKey(history[previous]) === currentKey) {
        const period = latestIndex - previous;
        return { type: period === 1 ? "FIXED_POINT" : "EXACT_PERIODIC_RETURN", base_generation: previous, detected_generation: latestIndex, period, translation: [0, 0] };
      }
    }
    const currentShape = shape(latest);
    for (let previous = 0; previous < latestIndex; previous += 1) {
      const prior = shape(history[previous]);
      if (prior.key !== currentShape.key) continue;
      const translation = [currentShape.origin[0] - prior.origin[0], currentShape.origin[1] - prior.origin[1]];
      if (translation[0] !== 0 || translation[1] !== 0) {
        return { type: "TRANSLATED_RETURN", base_generation: previous, detected_generation: latestIndex, period: latestIndex - previous, translation };
      }
    }
    return { type: "OPEN_TRANSIENT", base_generation: 0, detected_generation: latestIndex, period: null, translation: null };
  }

  function runUntilReturn(name, limit = 12) {
    assert(FIXTURES[name], `unknown fixture ${name}`);
    const history = [makeState(FIXTURES[name])];
    let event = classifyLatest(history);
    while (history.length - 1 < limit && event.type === "OPEN_TRANSIENT") {
      history.push(step(history[history.length - 1]));
      event = classifyLatest(history);
    }
    return { history, event };
  }

  function toggleCell(state, x, y) {
    const key = cellKey(x, y);
    const live = state.live.filter((cell) => cellKey(cell[0], cell[1]) !== key);
    if (live.length === state.live.length) live.push([x, y]);
    return makeState(live, state.width, state.height);
  }

  return {
    BOUNDARY,
    FIXTURES,
    HEIGHT,
    RULE,
    WIDTH,
    canonicalizeCells,
    classifyLatest,
    inspectTransition,
    makeState,
    neighbourCount,
    runUntilReturn,
    step,
    toggleCell,
  };
}));
