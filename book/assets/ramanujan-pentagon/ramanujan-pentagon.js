(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.RamanujanPentagon = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const POINTS = {
    P1: [3, 0, 0],
    P2: [0.9270509831248424, 2.8531695488854605, 0.5],
    P3: [-2.427050983124842, 1.7633557568774196, 2],
    P4: [-2.427050983124843, -1.7633557568774192, 0],
    P5: [0.9270509831248417, -2.853169548885461, 0]
  };

  const BOUNDARY = ['P1P2', 'P2P3', 'P3P4', 'P4P5', 'P1P5'];
  const HULL_FACES = ['123', '124', '135', '145', '234', '345'];
  const CURTAINS = {
    T4: { faces: ['125', '245', '234'], diagonals: ['P2P4', 'P2P5'] },
    T5: { faces: ['125', '235', '345'], diagonals: ['P2P5', 'P3P5'] }
  };
  const HULL_EDGES = edgesFromFaces(HULL_FACES);
  const SPLINTER_EDGES = HULL_EDGES.filter((edge) => !BOUNDARY.includes(edge));

  function edgeKey(a, b) {
    return a < b ? `P${a}P${b}` : `P${b}P${a}`;
  }

  function edgesFromFaces(faces) {
    const found = new Set();
    faces.forEach((face) => {
      const ids = face.split('').map(Number);
      found.add(edgeKey(ids[0], ids[1]));
      found.add(edgeKey(ids[1], ids[2]));
      found.add(edgeKey(ids[2], ids[0]));
    });
    return [...found].sort();
  }

  function curtainBoundary(faces) {
    const counts = new Map();
    faces.forEach((face) => {
      const ids = face.split('').map(Number);
      [[ids[0], ids[1]], [ids[1], ids[2]], [ids[2], ids[0]]].forEach(([a, b]) => {
        const key = edgeKey(a, b);
        counts.set(key, (counts.get(key) || 0) + 1);
      });
    });
    return [...counts].filter(([, count]) => count === 1).map(([edge]) => edge).sort();
  }

  function sub(a, b) { return a.map((value, index) => value - b[index]); }
  function add(a, b) { return a.map((value, index) => value + b[index]); }
  function mul(a, scalar) { return a.map((value) => value * scalar); }
  function dot(a, b) { return a.reduce((sum, value, index) => sum + value * b[index], 0); }
  function cross(a, b) {
    return [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0]
    ];
  }

  function hullFaces(points = POINTS, tolerance = 1e-9) {
    const ids = Object.keys(points);
    const faces = [];
    for (let i = 0; i < ids.length; i += 1) {
      for (let j = i + 1; j < ids.length; j += 1) {
        for (let k = j + 1; k < ids.length; k += 1) {
          const a = points[ids[i]];
          const b = points[ids[j]];
          const c = points[ids[k]];
          const normal = cross(sub(b, a), sub(c, a));
          const distances = ids
            .filter((_, index) => ![i, j, k].includes(index))
            .map((id) => dot(normal, sub(points[id], a)));
          if (distances.every((distance) => distance >= -tolerance) ||
              distances.every((distance) => distance <= tolerance)) {
            faces.push(`${i + 1}${j + 1}${k + 1}`);
          }
        }
      }
    }
    return faces;
  }

  function axisPiercesEquator(points = POINTS) {
    const a = points.P1;
    const b = points.P3;
    const c = points.P4;
    const u = points.P2;
    const v = points.P5;
    const normal = cross(sub(b, a), sub(c, a));
    const direction = sub(v, u);
    const t = dot(normal, sub(a, u)) / dot(normal, direction);
    const point = add(u, mul(direction, t));
    const v0 = sub(b, a);
    const v1 = sub(c, a);
    const v2 = sub(point, a);
    const d00 = dot(v0, v0);
    const d01 = dot(v0, v1);
    const d11 = dot(v1, v1);
    const d20 = dot(v2, v0);
    const d21 = dot(v2, v1);
    const denominator = d00 * d11 - d01 * d01;
    const beta = (d11 * d20 - d01 * d21) / denominator;
    const gamma = (d00 * d21 - d01 * d20) / denominator;
    const alpha = 1 - beta - gamma;
    return {
      t,
      point,
      barycentric: [alpha, beta, gamma],
      inside: t > 0 && t < 1 && [alpha, beta, gamma].every((value) => value > 0)
    };
  }

  const MODES = {
    cikada: {
      title: 'CIKADA · OPEN CURTAIN',
      subtitle: 'T4/T5 diagonal flip on one pentagonal boundary',
      rotation: [-0.92, -0.12, -0.14],
      defaults: { curtain: true, hull: false, axis: true, splinters: false, slits: false }
    },
    scarab: {
      title: 'SCARAB · CLOSED HULL',
      subtitle: 'five vertices close as a triangular bipyramid',
      rotation: [-0.78, 0.46, 0.04],
      defaults: { curtain: false, hull: true, axis: true, splinters: true, slits: false }
    },
    dragonfly: {
      title: 'DRAGONFLY · 010 SOUTH CROSS',
      subtitle: 'curtain and hull share one transverse projection frame',
      rotation: [1.45, 0.08, 1.56],
      defaults: { curtain: true, hull: true, axis: true, splinters: true, slits: true }
    }
  };

  function rotatePoint(point, rotation) {
    let [x, y, z] = point;
    const [rx, ry, rz] = rotation;
    let c = Math.cos(rx); let s = Math.sin(rx);
    [y, z] = [y * c - z * s, y * s + z * c];
    c = Math.cos(ry); s = Math.sin(ry);
    [x, z] = [x * c + z * s, -x * s + z * c];
    c = Math.cos(rz); s = Math.sin(rz);
    [x, y] = [x * c - y * s, x * s + y * c];
    return [x, y, z];
  }

  function init(rootNode) {
    if (!rootNode) return;
    const stage = rootNode.querySelector('[data-rp-stage]');
    const modeLabel = rootNode.querySelector('[data-rp-mode-label]');
    const modeCopy = rootNode.querySelector('[data-rp-mode-copy]');
    const stateLabel = rootNode.querySelector('[data-rp-state]');
    const faceLabel = rootNode.querySelector('[data-rp-faces]');
    const viewLabel = rootNode.querySelector('[data-rp-view]');
    const toggles = [...rootNode.querySelectorAll('[data-layer]')];
    const state = {
      mode: 'cikada',
      triangulation: 'T4',
      rotation: [...MODES.cikada.rotation],
      layers: { ...MODES.cikada.defaults },
      dragging: false,
      pointer: null
    };

    function projected() {
      const width = 800;
      const height = 560;
      const scale = state.mode === 'dragonfly' ? 73 : 77;
      return Object.fromEntries(Object.entries(POINTS).map(([id, point]) => {
        const rotated = rotatePoint(point, state.rotation);
        return [id, { x: width / 2 + rotated[0] * scale, y: height / 2 - rotated[1] * scale, depth: rotated[2] }];
      }));
    }

    function line(edge, className, points, label) {
      const match = edge.match(/P(\d)P(\d)/);
      const a = points[`P${match[1]}`];
      const b = points[`P${match[2]}`];
      return `<line class="${className}" x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" data-edge="${edge}"><title>${label || edge}</title></line>`;
    }

    function polygon(face, className, points) {
      const ids = face.split('').map((id) => `P${id}`);
      const depth = ids.reduce((sum, id) => sum + points[id].depth, 0) / 3;
      const coords = ids.map((id) => `${points[id].x},${points[id].y}`).join(' ');
      return { depth, html: `<polygon class="${className}" points="${coords}" data-face="${face}"><title>face ${face}</title></polygon>` };
    }

    function render() {
      const points = projected();
      const layers = [];
      if (state.layers.hull) HULL_FACES.forEach((face) => layers.push(polygon(face, 'rp-face rp-hull-face', points)));
      if (state.layers.curtain) CURTAINS[state.triangulation].faces.forEach((face) => layers.push(polygon(face, 'rp-face rp-curtain-face', points)));
      layers.sort((a, b) => a.depth - b.depth);

      const marks = [];
      marks.push(...layers.map((layer) => layer.html));
      if (state.layers.hull) marks.push(...HULL_EDGES.map((edge) => line(edge, 'rp-edge rp-hull-edge', points, `${edge} · hull edge`)));
      if (state.layers.curtain) {
        marks.push(...BOUNDARY.map((edge) => line(edge, 'rp-edge rp-boundary-edge', points, `${edge} · pentagon boundary`)));
        marks.push(...CURTAINS[state.triangulation].diagonals.filter((edge) => edge !== 'P2P5').map((edge) => line(edge, 'rp-edge rp-flip-edge', points, `${edge} · active flip diagonal`)));
      }
      if (state.layers.splinters) marks.push(...SPLINTER_EDGES.map((edge) => line(edge, 'rp-edge rp-splinter-edge', points, `${edge} · exposed hull splinter`)));
      if (state.layers.axis) marks.push(line('P2P5', 'rp-edge rp-axis-edge', points, 'P2P5 · internal apex axis, not a hull edge'));

      if (state.layers.slits && state.mode === 'dragonfly') {
        marks.push('<g class="rp-slit-notes" aria-label="View-only slit annotations"><path d="M278 236l-54 28"/><path d="M525 330l58 24"/><text x="157" y="281">SLIT / VIEW GAP</text><text x="587" y="371">SLIT / VIEW GAP</text></g>');
      }

      Object.entries(points).sort(([, a], [, b]) => a.depth - b.depth).forEach(([id, point]) => {
        marks.push(`<g class="rp-point" transform="translate(${point.x} ${point.y})"><circle r="9"/><text x="13" y="-12">${id}</text></g>`);
      });

      marks.push('<g class="rp-frame"><path d="M76 72H724V488H76Z"/><path d="M116 42H764V458L724 488M76 72l40-30M724 72l40-30"/></g>');
      if (state.mode === 'dragonfly') marks.push('<text class="rp-view-code" x="400" y="526" text-anchor="middle">000 → 010 → 000 · SOUTH CROSS VIEW</text>');
      stage.innerHTML = marks.join('');

      const config = MODES[state.mode];
      modeLabel.textContent = config.title;
      modeCopy.textContent = config.subtitle;
      stateLabel.textContent = state.triangulation;
      faceLabel.textContent = CURTAINS[state.triangulation].faces.join(' · ');
      viewLabel.textContent = state.mode === 'dragonfly' ? '010 / SOUTH CROSS' : state.mode.toUpperCase();
      rootNode.dataset.mode = state.mode;
      rootNode.dataset.triangulation = state.triangulation;
      rootNode.querySelectorAll('[data-mode]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.mode === state.mode)));
      rootNode.querySelectorAll('[data-flip]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.flip === state.triangulation)));
      toggles.forEach((input) => { input.checked = Boolean(state.layers[input.dataset.layer]); });
    }

    function applyMode(mode) {
      state.mode = mode;
      state.rotation = [...MODES[mode].rotation];
      state.layers = { ...MODES[mode].defaults };
      render();
    }

    rootNode.querySelectorAll('[data-mode]').forEach((button) => button.addEventListener('click', () => applyMode(button.dataset.mode)));
    rootNode.querySelectorAll('[data-flip]').forEach((button) => button.addEventListener('click', () => { state.triangulation = button.dataset.flip; render(); }));
    toggles.forEach((input) => input.addEventListener('change', () => { state.layers[input.dataset.layer] = input.checked; render(); }));
    rootNode.querySelector('[data-return]').addEventListener('click', () => {
      state.triangulation = 'T4';
      applyMode('cikada');
    });
    stage.addEventListener('pointerdown', (event) => {
      state.dragging = true;
      state.pointer = [event.clientX, event.clientY];
      stage.setPointerCapture(event.pointerId);
    });
    stage.addEventListener('pointermove', (event) => {
      if (!state.dragging) return;
      const dx = event.clientX - state.pointer[0];
      const dy = event.clientY - state.pointer[1];
      state.rotation[1] += dx * 0.008;
      state.rotation[0] += dy * 0.008;
      state.pointer = [event.clientX, event.clientY];
      render();
    });
    stage.addEventListener('pointerup', () => { state.dragging = false; });
    stage.addEventListener('pointercancel', () => { state.dragging = false; });
    render();
  }

  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => init(document.querySelector('[data-ramanujan-pentagon]')));
  }

  return {
    POINTS,
    BOUNDARY,
    HULL_FACES,
    HULL_EDGES,
    SPLINTER_EDGES,
    CURTAINS,
    MODES,
    edgesFromFaces,
    curtainBoundary,
    hullFaces,
    axisPiercesEquator,
    rotatePoint,
    init
  };
});
