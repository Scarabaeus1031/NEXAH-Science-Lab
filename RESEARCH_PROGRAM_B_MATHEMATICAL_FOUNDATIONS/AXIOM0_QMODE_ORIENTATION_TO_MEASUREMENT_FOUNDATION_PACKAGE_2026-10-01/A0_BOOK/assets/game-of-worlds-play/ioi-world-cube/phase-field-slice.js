(() => {
  'use strict';

  const panel = document.getElementById('phaseFieldSlice');
  if (!panel || document.body.classList.contains('progression-embed')) return;

  const size = 11;
  const sampleCount = 5000;
  const frame = 220;
  const origin = 10;
  const get = selector => panel.querySelector(selector);
  const counts = Array.from({ length: size * size }, () => []);
  // NEXAH Core, nexah_core_model_v.6.9.py at 43effebb (SHA-256 9a66015cd9d740ec08aa97c2603116fc7bf2c04d62d111208e0229f2210a61ee).
  const points = Array.from({ length: sampleCount }, (_, index) => {
    // NEXAH Core v6.9: generate_dummy_traj → hopf_projection → retain X, Y.
    const a = (0.7 + 0.3 * Math.sin(index * 0.02) - 0.7) / 0.4;
    const b = (0.05 * Math.cos(index * 0.02)) / 0.05;
    const phase = Math.floor(index / 300) % 4 * Math.PI / 2;
    const norm = Math.sqrt(a * a + b * b + 1 + 1e-9);
    const x1 = a / norm;
    const x2 = b / norm;
    const x3 = Math.sin(phase) / norm;
    const x4 = Math.cos(phase) / norm;
    return [2 * (x1 * x3 + x2 * x4), 2 * (x2 * x3 - x1 * x4)];
  });
  // Fixed [-1, 1] bounds and equal-width cells. The upper endpoint belongs to the last cell.
  const bin = value => Math.max(0, Math.min(size - 1, Math.floor((value + 1) * size / 2)));
  const plot = ([x, y]) => [origin + (x + 1) * frame / 2, origin + (1 - y) * frame / 2];
  const plottedPoints = points.map(plot);
  const steps = points.slice(0, -1).map(([x, y], index) => {
    const cell = bin(x) + size * (size - 1 - bin(y));
    counts[cell].push(index);
    return { cell, start: plottedPoints[index], end: plottedPoints[index + 1] };
  });

  const helixAdapter = window.A0HelixViewAdapter;
  const helix = helixAdapter.bundleStrand(sampleCount, 0, {
    step: helixAdapter.TAU * 5 / (sampleCount - 1), height: 2.35
  }).map(({ x, y, z }) => [120 + 83 * x, 120 - 82 * y + 20 * z]);

  const cells = [];
  const grid = get('.phase-grid');
  const path = get('.phase-path');
  const range = get('input');
  const status = get('output');
  let selectedCell = -1;
  let selectedStep = null;

  function svg(tag, attributes) {
    const node = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, value);
    return node;
  }

  function coordinates(point) {
    return point.map(value => value.toFixed(2)).join(' ');
  }

  function segment({ start, end }) {
    return `M${coordinates(start)}L${coordinates(end)}`;
  }

  function place(marker, [x, y]) {
    marker.setAttribute('cx', x);
    marker.setAttribute('cy', y);
  }

  function select(cell, index) {
    if (cell !== selectedCell) {
      cells[selectedCell]?.setAttribute('aria-pressed', 'false');
      cells[selectedCell]?.setAttribute('tabindex', '-1');
      cells[cell].setAttribute('aria-pressed', 'true');
      cells[cell].setAttribute('tabindex', '0');
      get('.phase-cell-trace').setAttribute('d', counts[cell].map(step => segment(steps[step])).join(''));
    }
    selectedCell = cell;
    selectedStep = index;
    const active = index === null ? null : steps[index];
    get('.phase-active-trace').setAttribute('d', active ? segment(active) : '');
    get('.phase-path-cursor').classList.toggle('is-hidden', !active);
    get('.phase-helix-cursor').classList.toggle('is-hidden', !active);
    const rectangle = cells[cell];
    const guide = get('.phase-cell-guide');
    guide.setAttribute('x', rectangle.getAttribute('x'));
    guide.setAttribute('y', rectangle.getAttribute('y'));
    if (active) {
      range.value = index + 1;
      place(get('.phase-path-cursor'), active.start);
      place(get('.phase-helix-cursor'), helix[index]);
    }
    range.setAttribute('aria-valuetext', active ? `Schritt ${index + 1}` : `Zu Schritt ${range.value} wechseln`);
    const column = cell % size + 1;
    const row = Math.floor(cell / size) + 1;
    const visits = counts[cell].length;
    const summary = visits ? `${visits} Bahnschritte · Schritt ${index + 1} von ${steps.length}` : 'Keine Bahnschritte';
    status.textContent = `Spalte ${column}, Zeile ${row} · ${summary}`;
    panel.dataset.selectedCell = String(cell);
    panel.dataset.selectedStep = index === null ? '' : String(index + 1);
  }

  function selectCell(cell) {
    const trace = counts[cell];
    select(cell, trace.includes(selectedStep) ? selectedStep : trace[0] ?? null);
  }

  const peak = Math.max(...counts.map(trace => trace.length));
  for (let cell = 0; cell < counts.length; cell++) {
    const column = cell % size;
    const row = Math.floor(cell / size);
    const visits = counts[cell].length;
    const rectangle = svg('rect', {
      x: origin + column * 20, y: origin + row * 20, width: 20, height: 20, rx: 1.5,
      fill: visits ? `hsl(194 64% ${24 + 35 * Math.sqrt(visits / peak)}%)` : '#424b54',
      tabindex: -1, role: 'button', 'aria-pressed': 'false', 'data-phase-cell': cell,
      'aria-label': `Spalte ${column + 1}, Zeile ${row + 1}, ${visits} Bahnschritte`
    });
    rectangle.addEventListener('click', () => selectCell(cell));
    rectangle.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectCell(cell);
        return;
      }
      const next = {
        ArrowLeft: column > 0 ? cell - 1 : cell,
        ArrowRight: column < size - 1 ? cell + 1 : cell,
        ArrowUp: row > 0 ? cell - size : cell,
        ArrowDown: row < size - 1 ? cell + size : cell
      }[event.key];
      if (next === undefined) return;
      event.preventDefault();
      selectCell(next);
      cells[next].focus();
    });
    cells.push(rectangle);
    grid.append(rectangle);
  }

  get('.phase-trajectory').setAttribute('d', 'M' + plottedPoints.map(coordinates).join('L'));
  get('.phase-helix-rail').setAttribute('d', 'M' + helix.filter((_, i) => i % 10 === 0 || i === sampleCount - 1).map(coordinates).join('L'));

  path.addEventListener('click', event => {
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(path.getScreenCTM().inverse());
    let best = -1;
    let bestDistance = 7 ** 2;
    steps.forEach(({ start, end }, index) => {
      const dx = end[0] - start[0];
      const dy = end[1] - start[1];
      const lengthSquared = dx * dx + dy * dy;
      const fraction = lengthSquared ? ((point.x - start[0]) * dx + (point.y - start[1]) * dy) / lengthSquared : 0;
      const t = Math.min(1, Math.max(0, fraction));
      const distance = (point.x - start[0] - t * dx) ** 2 + (point.y - start[1] - t * dy) ** 2;
      if (distance < bestDistance || (best >= 0 && distance === bestDistance && index === selectedStep)) {
        best = index;
        bestDistance = distance;
      }
    });
    if (best >= 0) select(steps[best].cell, best);
  });
  range.max = steps.length;
  range.addEventListener('input', () => {
    const index = Number(range.value) - 1;
    select(steps[index].cell, index);
  });
  select(steps[0].cell, 0);
})();
