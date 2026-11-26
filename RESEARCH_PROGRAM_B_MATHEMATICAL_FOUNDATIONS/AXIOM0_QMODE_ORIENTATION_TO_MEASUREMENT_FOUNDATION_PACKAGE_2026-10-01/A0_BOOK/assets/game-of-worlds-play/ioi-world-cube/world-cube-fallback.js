(() => {
  'use strict';

  const svg = document.getElementById('worldCubeFallback');
  const model = document.getElementById('worldModel');
  const status = document.getElementById('worldCubeFallbackStatus');
  const canvas = document.getElementById('worldCubeProjectionCanvas');
  const context = canvas.getContext('2d');
  const playButton = document.getElementById('worldCubeProjectionPlay');
  const nativePause = document.getElementById('pauseModel');
  const nativeRotation = document.querySelector('[data-animation="WORLD_RETURN_ROTATION"]');
  const packed = window.A0IOIGameOfWorldsGLB;
  if (!svg || !model || !packed) return;

  const links = {
    EULER_FACE_OBSERVER: document.getElementById('eulerRootMaskLink').href,
    FIBONACCI_DIAGONAL_45: document.getElementById('fibonacciSpiralLink').href
  };
  const focus = new URLSearchParams(location.search).get('focus');
  const fallbackView = svg.parentElement;
  let geometry;
  let fallbackTimer;
  let durationMs;
  let elapsedMs = 0;
  let resumeAt = null;
  let frameId = 0;
  let nativePauseState;

  const faces = [[0, 4, 6, 2], [1, 3, 7, 5], [0, 1, 5, 4], [2, 6, 7, 3], [0, 2, 3, 1], [4, 5, 7, 6]];
  const shades = [.72, .73, .58, 1, .85, .9];

  function add(tag, attributes, parent = svg) {
    const element = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value);
    parent.append(element);
    return element;
  }

  function readGeometry() {
    // This GLB uses one box primitive per material with TRS node transforms.
    const bytes = Uint8Array.from(atob(packed), character => character.charCodeAt(0));
    const jsonSize = new DataView(bytes.buffer).getUint32(12, true);
    const source = JSON.parse(new TextDecoder().decode(bytes.subarray(20, 20 + jsonSize)));
    const clip = source.animations.find(animation => animation.name === 'WORLD_RETURN_ROTATION');
    durationMs = source.accessors[clip.samplers[0].input].max[0] * 1000;
    const colors = source.materials.map(({ pbrMetallicRoughness: { baseColorFactor } }) =>
      shades.map(shade => {
        const rgb = baseColorFactor.slice(0, 3).map(channel =>
          Math.round(Math.min(1, Math.pow(channel * shade, 1 / 2.2)) * 255)
        );
        return `rgba(${rgb.join(',')},${baseColorFactor[3]})`;
      })
    );
    const boxes = [];
    const dot = (a, b) => a.reduce((sum, value, i) => sum + value * b[i], 0);
    const cross = ([a, b, c], [x, y, z]) => [b * z - c * y, c * x - a * z, a * y - b * x];

    function visit(index, parent) {
      const node = source.nodes[index];
      const translation = node.translation ?? [0, 0, 0];
      const scale = node.scale ?? [1, 1, 1];
      const [x, y, z, w] = node.rotation ?? [0, 0, 0, 1];
      const axis = [x, y, z];
      const transform = point => {
        const scaled = point.map((value, i) => value * scale[i]);
        const rotation = cross(axis, scaled);
        const parallel = dot(axis, scaled);
        return parent(scaled.map((value, i) =>
          (2 * w * w - 1) * value + 2 * parallel * axis[i] + 2 * w * rotation[i] + translation[i]
        ));
      };
      if (node.mesh !== undefined) {
        const primitive = source.meshes[node.mesh].primitives[0];
        const { min, max } = source.accessors[primitive.attributes.POSITION];
        const vertices = Array.from({ length: 8 }, (_, corner) =>
          transform(min.map((low, i) => corner & (1 << i) ? max[i] : low))
        );
        boxes.push({ name: node.name, vertices, colors: colors[primitive.material] });
      }
      for (const child of node.children ?? []) visit(child, transform);
    }
    for (const root of source.scenes[source.scene].nodes) visit(root, point => point);
    return boxes;
  }

  function draw() {
    if (fallbackView.hidden || !geometry) return;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const pixelWidth = Math.round(width * ratio);
    const pixelHeight = Math.round(height * ratio);
    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
    }
    const fit = Math.min(pixelWidth / 600, pixelHeight / 460);
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, pixelWidth, pixelHeight);
    context.setTransform(fit, 0, 0, fit, (pixelWidth - 600 * fit) / 2, (pixelHeight - 460 * fit) / 2);
    const selected = document.querySelector('[data-view][aria-pressed="true"]')?.dataset.view;
    const camera = { outside: [45, 68, 31], inside15: [225, 112, 36], inside21: [315, 68, 36] };
    const [theta, phi, scale] = (focus === 'fibonacci-diagonal' && svg.dataset.initialFocus !== 'cleared')
      ? [135, 58, 31]
      : camera[selected] ?? camera.outside;
    // WORLD_RIG is the sole target of the GLB clip. Its quarter-turns
    // have equal lengths, so rotate all vertices together about Y.
    const yaw = theta * Math.PI / 180 - elapsedMs / durationMs * 2 * Math.PI;
    const pitch = phi * Math.PI / 180;
    const sinYaw = Math.sin(yaw), cosYaw = Math.cos(yaw);
    const sinPitch = Math.sin(pitch), cosPitch = Math.cos(pitch);
    const project = ([x, y, z]) => {
      const depth = x * sinYaw + z * cosYaw;
      return [300 + scale * (x * cosYaw - z * sinYaw),
        230 - scale * (y * sinPitch - depth * cosPitch),
        depth * sinPitch + y * cosPitch];
    };
    const polygons = [];
    const targets = {};
    for (const box of geometry) {
      const vertices = box.vertices.map(project);
      if (links[box.name]) targets[box.name] = vertices;
      faces.forEach((face, i) => {
        const points = face.map(corner => vertices[corner]);
        const [a, b, c] = points;
        if ((b[0] - a[0]) * (c[1] - a[1]) >= (b[1] - a[1]) * (c[0] - a[0])) return;
        polygons.push({ points, color: box.colors[i], depth: points.reduce((sum, p) => sum + p[2], 0) / 4 });
      });
    }
    for (const { points, color } of polygons.sort((a, b) => a.depth - b.depth)) {
      context.beginPath();
      context.moveTo(points[0][0], points[0][1]);
      for (const [x, y] of points.slice(1)) context.lineTo(x, y);
      context.closePath();
      context.fillStyle = color;
      context.fill();
    }
    const euler = targets.EULER_FACE_OBSERVER;
    if (euler) {
      const center = axis => euler.reduce((sum, p) => sum + p[axis], 0) / euler.length;
      eulerMarker.setAttribute('cx', center(0));
      eulerMarker.setAttribute('cy', center(1));
    }
    const fibonacci = targets.FIBONACCI_DIAGONAL_45;
    if (fibonacci) {
      const end = vertices => [0, 1].map(axis => vertices.reduce((sum, p) => sum + p[axis], 0) / vertices.length);
      const [a, b] = [end(fibonacci.slice(0, 4)), end(fibonacci.slice(4))];
      for (const line of fibonacciLines) {
        line.setAttribute('x1', a[0]);
        line.setAttribute('y1', a[1]);
        line.setAttribute('x2', b[0]);
        line.setAttribute('y2', b[1]);
      }
    }
  }

  const eulerLink = add('a', { href: links.EULER_FACE_OBSERVER, 'aria-label': 'Euler-Stein · Mittelzelle der Root Mask zeigen' });
  const eulerMarker = add('circle', { r: 8, fill: '#ffd75f', stroke: '#fff2a6',
    'stroke-width': focus === 'euler-center' ? 4 : 1.5 }, eulerLink);
  const fibonacciLink = add('a', { href: links.FIBONACCI_DIAGONAL_45, 'aria-label': 'Fibonacci-Diagonale · Spirale öffnen' });
  const fibonacciLines = [
    add('line', { stroke: '#95f3a0', opacity: focus === 'fibonacci-diagonal' ? 1 : .64, 'stroke-width': 2.5 }, fibonacciLink),
    add('line', { stroke: 'transparent', 'stroke-width': 14, 'pointer-events': 'stroke' }, fibonacciLink)
  ];

  function updatePlaybackButtons() {
    const playing = resumeAt !== null;
    playButton.textContent = playing ? 'Ⅱ Pause' : '▶ Play';
    nativePause.textContent = playing ? 'Animation pausieren' : 'Animation fortsetzen';
    nativePause.setAttribute('aria-pressed', String(!playing));
  }

  function animate(now) {
    elapsedMs = (now - resumeAt) % durationMs;
    draw();
    frameId = requestAnimationFrame(animate);
  }

  function pause() {
    if (resumeAt === null) return;
    resumeAt = null;
    cancelAnimationFrame(frameId);
    updatePlaybackButtons();
  }

  function play() {
    if (!geometry || resumeAt !== null) return;
    resumeAt = performance.now() - elapsedMs;
    updatePlaybackButtons();
    frameId = requestAnimationFrame(animate);
  }

  function togglePlayback() {
    if (resumeAt === null) play();
    else pause();
  }

  function setPresentation(active) {
    if (active && fallbackView.hidden) {
      nativePauseState = [nativePause.textContent, nativePause.getAttribute('aria-pressed')];
      updatePlaybackButtons();
    } else if (!active && !fallbackView.hidden) {
      pause();
      nativePause.textContent = nativePauseState[0];
      nativePause.setAttribute('aria-pressed', nativePauseState[1]);
    }
    fallbackView.hidden = !active;
    model.closest('.viewer-stage').classList.toggle('cube-projection-active', active);
    document.querySelectorAll('[data-animation]').forEach(button => { button.disabled = active && button !== nativeRotation; });
  }

  playButton.addEventListener('click', togglePlayback);
  nativePause.addEventListener('click', event => {
    if (fallbackView.hidden) return;
    event.stopImmediatePropagation();
    togglePlayback();
  }, { capture: true });
  nativeRotation.addEventListener('click', event => {
    if (fallbackView.hidden) return;
    event.stopImmediatePropagation();
    play();
  }, { capture: true });
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
  new ResizeObserver(draw).observe(canvas);

  function showProjection() {
    clearTimeout(fallbackTimer);
    try {
      geometry ??= readGeometry();
      setPresentation(true);
      draw();
    } catch {
      setPresentation(true);
      playButton.disabled = true;
      nativePause.disabled = true;
      nativeRotation.disabled = true;
      status.textContent = 'Die Würfelgeometrie konnte nicht geladen werden.';
    }
  }

  // A GLB load event alone does not confirm that the browser rendered a frame.
  const testContext = document.createElement('canvas').getContext('webgl2');
  model.addEventListener('error', showProjection);
  model.addEventListener('load', () => {
    if (!testContext) return;
    clearTimeout(fallbackTimer);
    setPresentation(false);
  });
  if (!testContext) {
    showProjection();
  } else {
    testContext.getExtension('WEBGL_lose_context')?.loseContext();
    fallbackTimer = setTimeout(showProjection, 5000);
  }

  // Observe the shared camera buttons, including presets selected by the cube tour.
  document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => {
    svg.dataset.initialFocus = 'cleared';
  }));
  new MutationObserver(() => { if (geometry) draw(); }).observe(document.querySelector('.view-switch'), {
    attributes: true, attributeFilter: ['aria-pressed'], subtree: true
  });
  document.getElementById('resetModel').addEventListener('click', () => {
    svg.dataset.initialFocus = 'cleared';
    if (fallbackView.hidden) return;
    pause();
    elapsedMs = 0;
    draw();
  });
})();
