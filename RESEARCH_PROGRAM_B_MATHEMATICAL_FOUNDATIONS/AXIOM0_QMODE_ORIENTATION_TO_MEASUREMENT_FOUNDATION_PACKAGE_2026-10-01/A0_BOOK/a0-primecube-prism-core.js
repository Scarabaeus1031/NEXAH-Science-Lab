(function () {
  'use strict';

  const meridian = 8.614;
  const radians = Math.PI / 180;
  const phi = (1 + Math.sqrt(5)) / 2;
  const epsilon = 1e-9;
  const dot = (a, b) => a.reduce((sum, value, i) => sum + value * b[i], 0);
  const norms = [];
  const vertices = [];
  const signs = [-1, 1];
  for (const s of signs) {
    for (const t of signs) {
      norms.push([0, s, t * phi], [s, t * phi, 0], [s * phi, 0, t]);
      vertices.push([0, s * phi, t / phi], [s / phi, 0, t * phi], [s * phi, t / phi, 0]);
      for (const u of signs) vertices.push([s, t, u]);
    }
  }
  // Each face is n · p = 1. Scale the vertices to match these planes.
  const points = vertices.map(vertex => vertex.map(value => value / (phi * phi)));
  const faces = norms.map((normal, i) => {
    const corners = points.filter(point => Math.abs(dot(normal, point) - 1) < epsilon);
    const center = normal.map(value => value / dot(normal, normal));
    const u = corners[0].map((value, j) => value - center[j]);
    const v = [
      normal[1] * u[2] - normal[2] * u[1],
      normal[2] * u[0] - normal[0] * u[2],
      normal[0] * u[1] - normal[1] * u[0]
    ].map(value => value / Math.hypot(...normal));
    const angle = point => Math.atan2(dot(point, v), dot(point, u));
    return { id: i + 1, normal, corners: corners.sort((a, b) => angle(a) - angle(b)) };
  });

  const nodeSource = [
    [1, 75.298, 8.614, 'axis'],
    [2, 51.165, 48.740, 'outer'],
    [3, 28.215, 25.100, 'inner'],
    [4, 28.215, -7.871, 'inner'],
    [5, 51.165, -31.512, 'outer']
  ];
  const nodes = nodeSource.map(([id, latitude, longitude, group]) => {
    const lat = latitude * radians;
    const offset = (longitude - meridian) * radians;
    const direction = [Math.cos(lat) * Math.cos(offset), Math.cos(lat) * Math.sin(offset), Math.sin(lat)];
    const support = Math.max(...norms.map(normal => dot(normal, direction)));
    const point = direction.map(value => value / support);
    return {
      id, latitude, longitude, group, point,
      faceIds: faces.filter(face => Math.abs(dot(face.normal, point) - 1) < epsilon).map(face => face.id)
    };
  });

  const mirrorSection = new Map();
  for (const face of faces) {
    for (const [i, point] of face.corners.entries()) {
      const next = face.corners[(i + 1) % face.corners.length];
      if (Math.abs(point[1]) < epsilon) {
        mirrorSection.set(point.join(','), point);
      } else if (point[1] * next[1] < 0) {
        const t = point[1] / (point[1] - next[1]);
        const hit = [point[0] + t * (next[0] - point[0]), 0, point[2] + t * (next[2] - point[2])];
        mirrorSection.set(hit.map(value => value.toFixed(9)).join(','), hit);
      }
    }
  }
  const mirrorCorners = [...mirrorSection.values()].sort((a, b) => Math.atan2(a[2], a[0]) - Math.atan2(b[2], b[0]));
  const pairs = [[nodes[4], nodes[1]], [nodes[3], nodes[2]]];
  const colors = { axis: '#f4d477', outer: '#65deef', inner: '#f7a5dc' };

  const pentagon = [nodes[0], nodes[4], nodes[3], nodes[2], nodes[1]];
  const interpolate = (a, b, fraction) => a.map((value, i) => value + (b[i] - value) * fraction);
  const axisCrossings = pairs.map(([left, right]) =>
    interpolate(left.point, right.point, -left.point[1] / (right.point[1] - left.point[1])));
  const centerMark = interpolate(...axisCrossings, 0.5);

  function renderSvg(yaw, pitch, showPentagon = false) {
    const a = yaw * radians;
    const b = pitch * radians;
    function project([x, y, z]) {
      const depth = x * Math.cos(a) + y * Math.sin(a);
      const right = y * Math.cos(a) - x * Math.sin(a);
      const up = z * Math.cos(b) - depth * Math.sin(b);
      return [320 + right * 222, 192 - up * 222, depth * Math.cos(b) + z * Math.sin(b)];
    }
    const coords = point => project(point).slice(0, 2).map(value => value.toFixed(2)).join(',');
    const polygon = corners => corners.map(coords).join(' ');
    const layers = faces.map(face => {
      const depth = project(face.normal)[2];
      const occupied = nodes.filter(node => node.faceIds.includes(face.id));
      const color = occupied.length ? colors[occupied.at(-1).group] : '#899bc6';
      return {
        depth,
        svg: `<polygon points="${polygon(face.corners)}" fill="${color}" fill-opacity="${depth > 0 ? '.11' : '.03'}" stroke="${color}" stroke-opacity="${depth > 0 ? '.58' : '.25'}" stroke-width="1.25"/>`
      };
    }).sort((a, b) => a.depth - b.depth);
    const section = `<polygon points="${polygon(mirrorCorners)}" fill="#e96cb9" fill-opacity=".13" stroke="#f5a1d4" stroke-opacity=".75" stroke-width="1.5" stroke-dasharray="5 4"/>`;
    const traces = pairs.map(([left, right]) => `<polyline points="${polygon([left.point, right.point])}" fill="none" stroke="${colors[left.group]}" stroke-width="2" stroke-dasharray="5 4"/>`).join('');
    let overlay = '';
    if (showPentagon) {
      const ticks = pairs.map(([left, right]) => {
        const [x1, y1] = project(left.point);
        const [x2, y2] = project(right.point);
        const normal = Math.atan2(y2 - y1, x2 - x1) + Math.PI / 2;
        const dx = Math.cos(normal) * 5;
        const dy = Math.sin(normal) * 5;
        return Array.from({ length: 5 }, (_, i) => {
          const [x, y] = project(interpolate(left.point, right.point, (i + 1) / 6));
          return `<line data-prism-tick="${left.id}-${right.id}" x1="${x - dx}" y1="${y - dy}" x2="${x + dx}" y2="${y + dy}" stroke="${colors[left.group]}" stroke-width="2"/>`;
        }).join('');
      }).join('');
      const [cx, cy] = project(centerMark);
      overlay = `<g data-prism-pentagon-overlay>
        <polygon data-prism-pentagon="1-5-4-3-2-1" points="${polygon(pentagon.map(node => node.point))}" fill="#f4d477" fill-opacity=".06" stroke="#f4d477" stroke-width="2.4"/>
        <polyline points="${polygon(axisCrossings)}" fill="none" stroke="#f5a1d4" stroke-width="1.5"/>
        ${ticks}
        <path data-prism-center-mark d="M${cx} ${cy - 7} L${cx + 7} ${cy} L${cx} ${cy + 7} L${cx - 7} ${cy} Z" fill="#f5a1d4" stroke="#181326" stroke-width="2"/>
      </g>`;
    }
    const markers = nodes.map(node => {
      const [x, y, depth] = project(node.point);
      return { node, x, y, depth };
    }).sort((a, b) => a.depth - b.depth).map(({ node, x, y }) => {
      const color = colors[node.group];
      return `<g data-prism-node="${node.id}"><circle cx="${x}" cy="${y}" r="7" fill="${color}" stroke="#111522" stroke-width="2"/><text x="${x + 12}" y="${y - 10}" fill="${color}" stroke="#101320" stroke-width="3" paint-order="stroke" font-size="16" font-weight="800">${node.id}</text></g>`;
    }).join('');
    return layers.filter(layer => layer.depth <= 0).map(layer => layer.svg).join('') + section
      + layers.filter(layer => layer.depth > 0).map(layer => layer.svg).join('') + traces + overlay + markers;
  }

  function mount(root) {
    const svg = root.querySelector('[data-prism-svg]');
    const yaw = root.querySelector('[data-prism-yaw]');
    const pitch = root.querySelector('[data-prism-pitch]');
    const pentagonToggle = root.querySelector('[data-prism-pentagon-toggle]');
    const readout = root.querySelector('[data-prism-readout]');
    const slots = root.querySelectorAll('[data-prism-slot]');
    slots.forEach(slot => {
      const node = nodes.find(item => item.id === Number(slot.dataset.prismSlot));
      const label = node.faceIds.map(face => 'F' + String(face).padStart(2, '0')).join(' ∩ ');
      slot.textContent = node.faceIds.length === 2 ? 'Kante ' + label : 'Fläche ' + label;
    });
    function render() {
      const azimuth = Number(yaw.value);
      const elevation = Number(pitch.value);
      svg.innerHTML = renderSvg(azimuth, elevation, pentagonToggle.checked);
      readout.textContent = `Azimut ${azimuth}° · Neigung ${elevation}°`;
    }
    yaw.addEventListener('input', render);
    pitch.addEventListener('input', render);
    pentagonToggle.addEventListener('change', render);
    root.querySelectorAll('[data-prism-preset]').forEach(button => {
      button.addEventListener('click', () => {
        [yaw.value, pitch.value] = button.dataset.prismPreset.split(',');
        if (button.hasAttribute('data-prism-show-pentagon')) pentagonToggle.checked = true;
        render();
      });
    });
    render();
  }

  if (typeof module === 'object' && module.exports) {
    module.exports = { faces, nodes, mirrorCorners, renderSvg };
  } else {
    const root = document.querySelector('[data-prism-core]');
    if (root) mount(root);
  }
})();
