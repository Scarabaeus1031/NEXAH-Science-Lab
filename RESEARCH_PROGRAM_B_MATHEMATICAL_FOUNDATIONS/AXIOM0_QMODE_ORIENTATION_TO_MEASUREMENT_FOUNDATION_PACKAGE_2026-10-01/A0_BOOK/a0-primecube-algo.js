(() => {
  const root = document.querySelector('[data-primecube-algo]');
  if (!root) return;
  const get = name => root.querySelector(`[data-algo-${name}]`);
  const ctx = name => get(name).getContext('2d');
  const guided = root.hasAttribute('data-algo-guide');
  const intervals = [...root.querySelectorAll('[data-algo-interval]')].map(item => ({
    from: Number(item.dataset.from),
    to: Number(item.dataset.to),
    label: item.querySelector('b').textContent
  }));
  const tau = 2 * Math.PI;
  let steps = 60;
  const iterationLimit = 70;
  const circle = count => Array.from({length: count}, (_, i) => {
    const angle = tau * (i % (count - 1)) / (count - 1);
    return [-.75 + .3 * Math.cos(angle), .3 * Math.sin(angle)];
  });
  const colors = {background: '#080c1a', cyan: '#61e6ed', pink: '#fc82b2', gold: '#ffcf73', mirror: '#c5a4fa'};
  const samples = new Map();
  let path;
  let field;
  let deltas;
  let threshold;
  let view = 'path';
  let timer;

  function escapeTime(x, y, re, im) {
    let n = 0;
    while (n < iterationLimit && x * x + y * y <= 4) {
      const nextX = x * x - y * y + re;
      y = 2 * x * y + im;
      x = nextX;
      n++;
    }
    return n;
  }

  function sample(size, halfSpan, centerX, evaluate) {
    const buffer = new Uint8Array(size * size);
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const x = centerX + halfSpan * (2 * (col + .5) / size - 1);
        const y = halfSpan * (1 - 2 * (row + .5) / size);
        buffer[row * size + col] = evaluate(x, y);
      }
    }
    return buffer;
  }

  function julia(c, size, span = 1.6, center = 0) {
    return sample(size, span, center, (x, y) => escapeTime(x, y, ...c));
  }

  function raster(context, data, size) {
    const layer = document.createElement('canvas');
    layer.width = layer.height = size;
    const layerCtx = layer.getContext('2d');
    const image = layerCtx.createImageData(size, size);
    data.forEach((value, i) => {
      const t = Math.sqrt(value / iterationLimit);
      const rgb = value === iterationLimit ? [8, 12, 26] :
        [13 + 235 * t, 22 + 155 * t, 46 + 110 * t];
      image.data.set([...rgb, 255], i * 4);
    });
    layerCtx.putImageData(image, 0, 0);
    context.imageSmoothingEnabled = false;
    context.drawImage(layer, 0, 0, context.canvas.width, context.canvas.height);
  }

  function preparePath() {
    if (!field) field = sample(240, 1.5, -.55, (x, y) => escapeTime(0, 0, x, y));
    ({path, deltas, threshold} = samplesFor(steps));
  }

  function samplesFor(count) {
    if (!samples.has(count)) samples.set(count, samplePath(count));
    return samples.get(count);
  }

  function samplePath(count) {
    const size = 42;
    const path = circle(count);
    const frames = path.map(c => julia(c, size));
    const deltas = frames.map((frame, i) => {
      if (!i) return null;
      const difference = frame.reduce((sum, value, p) => sum + Math.abs(value - frames[i - 1][p]), 0);
      return difference / (frame.length * iterationLimit);
    });
    const observations = deltas.slice(1);
    const mean = observations.reduce((sum, x) => sum + x, 0) / observations.length;
    const variance = observations.reduce((sum, x) => sum + (x - mean) ** 2, 0) / observations.length;
    return {path, deltas, threshold: mean + 2 * Math.sqrt(variance)};
  }

  function dot(context, x, y, radius, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, radius, 0, tau);
    context.fill();
  }

  function trace(context, points, color, width = 1.5) {
    context.beginPath();
    points.forEach(([x, y], i) => i ? context.lineTo(x, y) : context.moveTo(x, y));
    context.strokeStyle = color;
    context.lineWidth = width;
    context.stroke();
  }

  function clear(context) {
    context.fillStyle = colors.background;
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
  }

  function drawDelta(index) {
    const chart = ctx('delta');
    clear(chart);
    const max = guided ? .09 : Math.max(threshold, ...deltas) * 1.15;
    const top = guided ? 27 : 15;
    const angleX = angle => 40 + angle * 744 / 360;
    const x = i => angleX(360 * (guided && i > 0 ? i - .5 : i) / (steps - 1));
    const y = delta => 122 - delta / max * (122 - top);
    if (guided) {
      chart.font = 'bold 14px system-ui';
      chart.textAlign = 'center';
      chart.fillStyle = colors.mirror;
      chart.fillText('Spiegelachse', angleX(180), 18);
      trace(chart, [[angleX(180), top], [angleX(180), 122]], colors.mirror);
      for (const {from, to, label} of intervals) {
        const left = angleX(from);
        const right = angleX(to);
        chart.fillStyle = '#82eadd45';
        chart.fillRect(left, top, right - left, 122 - top);
        trace(chart, [[left, top], [left, 122]], '#82eadd', 1);
        trace(chart, [[right, top], [right, 122]], '#82eadd', 1);
        chart.fillStyle = '#b2f5ea';
        chart.fillText(label, (left + right) / 2, 18);
      }
      chart.textAlign = 'left';
    }
    trace(chart, [[40, top], [40, 122], [784, 122]], '#395065');
    chart.setLineDash([6, 5]);
    trace(chart, [[40, y(threshold)], [784, y(threshold)]], colors.gold);
    chart.setLineDash([]);
    trace(chart, deltas.slice(1).map((d, i) => [x(i + 1), y(d)]), colors.pink, 2);
    deltas.forEach((d, i) => { if (d > threshold) dot(chart, x(i), y(d), 4, colors.gold); });
    const mirrored = steps - index;
    if (guided && index > 0 && mirrored !== index) {
      chart.beginPath();
      chart.arc(x(mirrored), y(deltas[mirrored]), 6, 0, tau);
      chart.lineWidth = 2;
      chart.strokeStyle = colors.mirror;
      chart.stroke();
    }
    trace(chart, [[x(index), top], [x(index), 122]], guided ? '#f5faff' : colors.cyan);
    if (index > 0) dot(chart, x(index), y(deltas[index]), 4, colors.cyan);
    chart.fillStyle = '#b7d2e0';
    chart.font = '13px system-ui';
    chart.fillText('Δ', 14, 24);
    if (guided) {
      chart.fillText('0,09', 6, top + 13);
      chart.textAlign = 'center';
      for (const angle of [0, 90, 180, 270, 360]) chart.fillText(`${angle}°`, angleX(angle) - (angle === 360 ? 5 : 0), 141);
      chart.textAlign = 'left';
    } else {
      chart.fillText('1', 38, 141);
      chart.fillText('Frame 60', 725, 141);
    }
  }

  function drawPath() {
    if (!field) preparePath();
    const index = Number(get('frame').value);
    const zoom = Number(get('zoom').value);
    const resolution = Number(get('resolution').value);
    const c = path[index];
    const mandel = ctx('mandel');
    const juliaView = ctx('julia');
    const map = ([x, y]) => [80 * (x + 2.05), 80 * (1.5 - y)];
    raster(mandel, field, 240);
    trace(mandel, path.map(map), colors.cyan);
    dot(mandel, ...map(c), 5, colors.gold);
    raster(juliaView, julia(c, 180), 180);
    const focus = zoom === 1 ? 0 : .72;
    raster(ctx('shadow'), julia(c, resolution, 1.6 / zoom, focus), resolution);
    if (zoom > 1) {
      const side = 240 / zoom;
      juliaView.strokeStyle = colors.gold;
      juliaView.lineWidth = 2;
      juliaView.strokeRect(120 + 75 * focus - side / 2, 120 - side / 2, side, side);
    }
    if (!guided) get('curtain').hidden = !get('slit').checked;
    drawDelta(index);
    const delta = deltas[index];
    const value = delta === null ? '—' : delta.toFixed(4);
    const peak = delta > threshold ? ' · Peak über Schwelle' : '';
    const mirror = guided && index > 0 ? ` · Spiegel-Δ bei Frame ${steps - index + 1}` : '';
    const parameter = `c = ${c[0].toFixed(4)} ${c[1] < 0 ? '−' : '+'} ${Math.abs(c[1]).toFixed(4)}i`;
    get('path-status').textContent = guided && get('frame').disabled
      ? `${parameter} · fest · Shadow ×${zoom}, ${resolution}²`
      : `Frame ${index + 1}/${steps} · ${parameter} · Δ ${value}${peak}${mirror}`;
  }

  if (guided) {
    const buttons = [...root.querySelectorAll('[data-algo-step]')];
    const frame = get('frame');
    const sampling = get('sampling');
    const compareJump = get('compare-jump');
    const compareIndex = count => 45 * (count - 1) / 59;
    const hofBridge = get('hof-bridge');
    const hofPanel = get('hof-panel');
    const stControls = ['st-parameter', 'st-component', 'st-preset', 'st-cut', 'st-width'].map(get);
    const fineWidth = get('st-fine');
    const fineControl = get('st-fine-control');
    const fineValue = get('st-fine-value');
    const stripThreshold = get('st-threshold');
    const stStatus = get('st-status');
    const stRows = get('st-rows');
    const stComparison = get('st-comparison');
    const singleHead = get('st-single-head');
    const pairHead = get('st-pair-head');
    const gateIndex = 4;
    const commitment = 3;
    const endIndex = 84;

    function hofTrace(deris, [cr, ci], {alpha, beta}, readImaginary, cut, contract) {
      const trace = [];
      let tracker = deris.createTracker();
      let re = 0, im = 0, previousRe = 0, previousIm = 0;
      for (let n = 0; n <= endIndex; n++) {
        tracker = deris.observe(tracker, {value: readImaginary ? im : re, cut, index: n, key: n}, contract);
        trace.push(tracker.history.at(-1));
        if (re * re + im * im > 64) break;
        const nextRe = re * re - im * im + cr + alpha * re + beta * (re - previousRe);
        const nextIm = 2 * re * im + ci + alpha * im + beta * (im - previousIm);
        [previousRe, previousIm, re, im] = [re, im, nextRe, nextIm];
      }
      return trace;
    }

    function renderHofTest() {
      const deris = window.A0DerisPinkStrip;
      const model = window.A0PrimecubeModel;
      if (!deris || !model) {
        stComparison.textContent = '';
        stStatus.textContent = 'Die Quelldateien für den ST-Test konnten nicht geladen werden.';
        return;
      }
      const [parameter, component, preset, cut, width] = stControls.map(control => control.value);
      const coefficients = model.fractalDirectFieldRecord().presets.find(item => item.id === preset);
      const [cr, ci] = samplesFor(60).path[compareIndex(60)];
      const useFineWidth = width === 'fine';
      const epsilon = Number(useFineWidth ? fineWidth.value : width);
      fineControl.hidden = !useFineWidth;
      if (useFineWidth) {
        fineValue.textContent = epsilon.toFixed(4).replace('.', ',');
        fineWidth.setAttribute('aria-valuetext', fineValue.textContent);
      }
      const contract = {epsilon, commitment};
      const readImaginary = component === 'imaginary';
      const showPair = readImaginary && Number(cut) === 0;
      const original = hofTrace(deris, [cr, ci], coefficients, readImaginary, Number(cut), contract);
      const mirror = hofTrace(deris, [cr, -ci], coefficients, readImaginary, Number(cut), contract);
      const mirrored = parameter === 'mirror';
      const trace = mirrored ? mirror : original;
      const hitIndices = items => items.filter(item => item.zone === 'STRIP').map(item => item.index);
      const gateStatus = items => items[gateIndex]?.phase ?? 'außerhalb der Bahn';
      const hits = hitIndices(trace);
      const gate = gateStatus(trace);
      const firstCommit = trace.find(item => item.phase === 'COMMITTED');
      const laterRecross = trace.find(item => item.index > gateIndex && item.phase === 'RECROSS');
      const sample = item => item ? `n=${item.index}` : '—';
      const cLabel = `${cr.toFixed(4)} ${mirrored ? '+' : '−'} ${Math.abs(ci).toFixed(4)}i`;
      const reading = readImaginary ? 'Im' : 'Re';
      stStatus.textContent = `c = ${cLabel} · gₙ = ${reading}(zₙ) − s · Strip-Treffer: ${hits.length ? hits.join(', ') : '—'} · θ4 (n=4): ${gate} · erstes COMMITTED: ${sample(firstCommit)} · erster RECROSS nach n4: ${sample(laterRecross)}`;
      const originalHits = hitIndices(original);
      const mirrorHits = hitIndices(mirror);
      const sameHits = originalHits.join(',') === mirrorHits.join(',');
      const describe = (frameNumber, items, indices) => {
        const firstHit = indices.length ? `n=${indices[0]}` : '—';
        return `Frame ${frameNumber}: ${indices.length} Treffer (erster: ${firstHit}), bei n=4 ${gateStatus(items)}`;
      };
      stComparison.textContent = `Spiegelvergleich · Trefferpositionen ${sameHits ? 'gleich' : 'verschieden'} · ${describe(46, original, originalHits)} · ${describe(15, mirror, mirrorHits)}`;
      stripThreshold.hidden = !showPair;
      if (showPair) {
        const edges = original.slice(2, gateIndex + 1).map(item => {
          const edge = Math.abs(item.g).toFixed(8).replace('.', ',');
          return `n=${item.index} ab ε ≈ ${edge}`;
        });
        stripThreshold.textContent = `Gemeinsame Strip-Ränder · ${edges.join(' · ')}`;
      }
      singleHead.hidden = showPair;
      pairHead.hidden = !showPair;
      const number = item => item.g.toFixed(6).replace('.', ',');
      const pairedPhase = item => {
        if (item.zone === 'STRIP' && item.phase !== 'STRIP') return `${item.phase} · STRIP`;
        if (item.phase === 'AFTER' && item.afterStreak > 0) return `AFTER · ${item.afterStreak}/${commitment}`;
        return item.phase;
      };
      const rows = (showPair ? original : trace).slice(0, gateIndex + 3).map(item => {
        const row = document.createElement('tr');
        row.dataset.zone = item.zone;
        const isGate = item.index === gateIndex;
        if (isGate) row.dataset.gate = '';
        const heading = document.createElement('th');
        heading.scope = 'row';
        heading.textContent = isGate ? `${item.index} · θ4` : String(item.index);
        row.append(heading);
        const values = showPair
          ? [number(item), pairedPhase(item), number(mirror[item.index]), pairedPhase(mirror[item.index])]
          : [number(item), item.zone, item.phase];
        for (const value of values) {
          const cell = document.createElement('td');
          cell.textContent = value;
          row.append(cell);
        }
        return row;
      });
      stRows.replaceChildren(...rows);
    }

    get('st-zero').addEventListener('click', () => {
      get('st-component').value = 'imaginary';
      get('st-cut').value = '0';
      renderHofTest();
    });

    hofBridge.addEventListener('click', () => {
      const opening = hofPanel.hidden;
      hofPanel.hidden = !opening;
      hofBridge.setAttribute('aria-expanded', String(opening));
      if (opening) renderHofTest();
    });

    function renderGuide() {
      drawPath();
      const showComparison = !frame.disabled && Number(frame.value) === compareIndex(steps);
      get('compare').hidden = !showComparison;
      if (showComparison) {
        const lines = [60, 119].map(count => {
          const index = compareIndex(count);
          const mirrorIndex = count - index;
          const record = samplesFor(count);
          const local = n => record.deltas[n].toFixed(6).replace('.', ',');
          return `${count} Frames: Δ bei ${index + 1} = ${local(index)}, Spiegel-Δ bei ${mirrorIndex + 1} = ${local(mirrorIndex)}`;
        });
        get('compare-values').textContent = lines.join(' · ') + '.';
      }
    }

    function selectStep(step) {
      const moving = step === 'delta';
      buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.algoStep === step)));
      for (const name of ['frame-control', 'sampling-control', 'map', 'chart', 'delta-step']) get(name).hidden = !moving;
      get('shadow-step').hidden = moving;
      frame.disabled = sampling.disabled = !moving;
      compareJump.hidden = !moving;
      renderGuide();
    }
    buttons.forEach(button => button.addEventListener('click', () => selectStep(button.dataset.algoStep)));
    compareJump.addEventListener('click', () => {
      frame.value = compareIndex(steps);
      renderGuide();
    });
    root.addEventListener('input', event => {
      if (event.target === fineWidth || stControls.includes(event.target)) {
        renderHofTest();
        return;
      }
      if (event.target === sampling) {
        const position = Number(frame.value) / (steps - 1);
        steps = Number(sampling.value);
        frame.max = steps - 1;
        frame.value = Math.round(position * (steps - 1));
        preparePath();
      }
      renderGuide();
    });
    function openHofLink() {
      if (window.location.hash !== '#algo-hof-d-panel') return false;
      get('st-component').value = 'imaginary';
      get('st-preset').value = 'memory-zoom';
      get('st-cut').value = '0';
      get('st-width').value = 'fine';
      fineWidth.value = '0.2250';
      selectStep('delta');
      hofPanel.hidden = false;
      hofBridge.setAttribute('aria-expanded', 'true');
      renderHofTest();
      hofPanel.scrollIntoView();
      return true;
    }
    window.addEventListener('hashchange', openHofLink);
    if (!openHofLink()) selectStep('shadow');
    return;
  }

  function drawPhase() {
    const context = ctx('phase');
    const [a, b] = get('ratio').value.split(':').map(Number);
    const degrees = Number(get('angle').value);
    const offset = Number(get('offset').value);
    const angle = degrees * tau / 360;
    const point = t => [483 + 200 * Math.sin(a * t + offset * tau / 360), 150 - 116 * Math.sin(b * t)];
    clear(context);
    for (const radius of [29, 43, 57, 71, 85, 99, 113]) {
      context.beginPath();
      context.arc(140, 150, radius, 0, tau);
      context.strokeStyle = '#3a6576';
      context.stroke();
    }
    const needle = [140 + 99 * Math.cos(angle), 150 - 99 * Math.sin(angle)];
    trace(context, [[140, 150], needle], colors.gold);
    dot(context, ...needle, 6, colors.gold);
    trace(context, Array.from({length: 721}, (_, i) => point(tau * i / 720)), colors.cyan, 2);
    dot(context, ...point(angle), 7, colors.pink);
    get('phase-status').textContent = `Ratio ${a}:${b} · δ ${offset}° · Disc ${degrees}°`;
  }

  const render = () => {
    if (!root.open) return;
    if (view === 'path') drawPath();
    if (view === 'phase') drawPhase();
  };
  function stop() {
    clearInterval(timer);
    timer = undefined;
    get('play').textContent = 'Abspielen';
  }
  function stopGif() {
    get('gif-slot').replaceChildren();
    get('gif').textContent = 'GIF abspielen';
    get('gif').setAttribute('aria-pressed', 'false');
  }
  root.addEventListener('toggle', () => {
    if (root.open) render();
    else { stop(); stopGif(); }
  });
  root.querySelectorAll('[data-algo-view]').forEach(button => button.addEventListener('click', () => {
    stop();
    stopGif();
    view = button.dataset.algoView;
    root.querySelectorAll('[data-algo-view]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    root.querySelectorAll('[data-algo-panel]').forEach(panel => { panel.hidden = panel.dataset.algoPanel !== view; });
    get('play').hidden = view === 'zipper';
    render();
  }));
  root.addEventListener('input', render);
  get('play').addEventListener('click', () => {
    if (timer) { stop(); return; }
    get('play').textContent = 'Pause';
    timer = setInterval(() => {
      const input = get(view === 'path' ? 'frame' : 'angle');
      const max = Number(input.max);
      input.value = Number(input.value) >= max ? 0 : Math.min(max, Number(input.value) + (view === 'path' ? 1 : 5));
      render();
    }, view === 'path' ? 160 : 45);
  });
  get('gif').addEventListener('click', () => {
    if (get('gif-slot').firstChild) { stopGif(); return; }
    const image = document.createElement('img');
    image.src = 'assets/primecube-algo-dancin-zipper.gif';
    image.alt = 'Dancin’ Zipper: türkisfarbenes, animiertes Drahtgitter';
    get('gif-slot').append(image);
    get('gif').textContent = 'GIF ausblenden';
    get('gif').setAttribute('aria-pressed', 'true');
  });
  function openOnArrival() {
    if (location.hash === '#primecube-algo') root.open = true;
  }
  window.addEventListener('hashchange', openOnArrival);
  openOnArrival();
})();
