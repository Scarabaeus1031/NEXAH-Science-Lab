(() => {
  'use strict';

  const panel = document.getElementById('helix-wheel-decks');
  const clock = window.A0LokiTessarecPipe;
  if (!panel || !clock) return;

  const rings = panel.querySelector('[data-wheel-polar]');
  const helix = panel.querySelector('[data-wheel-helix]');
  const decks = [...panel.querySelectorAll('[data-wheel-deck]')];
  const input = panel.querySelector('input');
  const previous = panel.querySelector('[data-wheel-previous]');
  const next = panel.querySelector('[data-wheel-next]');
  const readout = panel.querySelector('[data-wheel-address]');
  const max = Number.MAX_SAFE_INTEGER;
  let current = 56;

  function svg(parent, tag, attributes) {
    const element = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value);
    parent.append(element);
    return element;
  }

  function text(parent, x, y, label, className = '') {
    svg(parent, 'text', { x, y, class: className, 'text-anchor': 'middle' }).textContent = label;
  }

  const angle = (rest, modulus) => 2 * Math.PI * rest / modulus;

  function polar(cx, cy, radius, phase) {
    return [cx + radius * Math.sin(phase), cy - radius * Math.cos(phase)];
  }

  function line(parent, [x1, y1], [x2, y2], className) {
    svg(parent, 'line', { x1, y1, x2, y2, class: className });
  }

  function dot(parent, [cx, cy], className, r) {
    svg(parent, 'circle', { cx, cy, r, class: className });
  }

  function wheel(parent, cx, cy, radius, modulus, style, markers = []) {
    svg(parent, 'circle', { cx, cy, r: radius, class: `hw-ring ${style}` });
    for (let rest = 0; rest < modulus; rest++) {
      const phase = angle(rest, modulus);
      const first = markers.includes(rest);
      line(parent, polar(cx, cy, radius - (first ? 8 : 3), phase),
        polar(cx, cy, radius + (first ? 5 : 2), phase), `hw-tick ${style}`);
      if (first && rest === 0) text(parent, cx, cy - radius - 9, '0', style);
    }
  }

  function selectRest(rest) {
    let offset = rest - clock.clockAddress(current).rest57;
    if (offset > 28) offset -= 57;
    if (offset < -28) offset += 57;
    if (offset < -current) offset += 57;
    if (offset > max - current) offset -= 57;
    render(current + offset);
  }

  function addWheelTargets(parent, cx, cy, radius, modulus, start, selected, tabStop) {
    const halfStep = Math.PI / modulus;
    const padding = modulus === 57 ? 13 : 14;
    for (let position = 0; position < modulus; position++) {
      const left = angle(position, modulus) - halfStep;
      const right = left + 2 * halfStep;
      const points = [
        polar(cx, cy, radius - padding, left), polar(cx, cy, radius + padding, left),
        polar(cx, cy, radius + padding, right), polar(cx, cy, radius - padding, right)
      ];
      const rest = start + position;
      const label = modulus === 57 ? `57er-Rad · Rest ${rest}` : `Deck ${start / 19 + 1} · Position ${position}`;
      const target = svg(parent, 'polygon', {
        class: 'hw-wheel-target', points: points.map(point => point.join(',')).join(' '),
        role: 'button', 'aria-label': label, 'aria-pressed': String(rest === selected),
        tabindex: position === tabStop ? 0 : -1, 'data-wheel-pick': rest
      });
      svg(target, 'title', {}).textContent = label;
    }
    parent.onclick = event => {
      const target = event.target.closest('[data-wheel-pick]');
      if (target) selectRest(Number(target.dataset.wheelPick));
    };
    parent.onkeydown = event => {
      const target = event.target.closest('[data-wheel-pick]');
      if (!target) return;
      const position = Number(target.dataset.wheelPick) - start;
      const delta = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }[event.key];
      if (delta === undefined && event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      const rest = start + (position + (delta ?? 0) + modulus) % modulus;
      selectRest(rest);
      parent.querySelector(`[data-wheel-pick="${rest}"]`)?.focus();
    };
  }

  function drawPolar(record) {
    rings.replaceChildren();
    wheel(rings, 128, 124, 99, 57, 'hw-gold', [0, 19, 38]);
    wheel(rings, 128, 124, 66, 19, 'hw-blue');
    const outer = polar(128, 124, 99, angle(record.rest57, 57));
    const inner = polar(128, 124, 66, angle(record.rest19, 19));
    line(rings, outer, inner, 'hw-rung');
    dot(rings, outer, 'hw-gold', 5);
    dot(rings, inner, 'hw-blue', 5);
    text(rings, 128, 121, String(current), 'hw-number');
    text(rings, 128, 142, 'Schritt');
    addWheelTargets(rings, 128, 124, 99, 57, 0, record.rest57, record.rest57);
  }

  function drawHelix() {
    helix.replaceChildren();
    const first = Math.max(0, current - current % 8 - 2);
    const last = first + Math.min(max - first, 9);
    const points = [];
    function project(rest, modulus, radius, height) {
      const phase = angle(rest, modulus);
      return [138 + radius * Math.sin(phase), height - radius * .19 * Math.cos(phase)];
    }
    for (let offset = 0; offset <= last - first; offset++) {
      const step = first + offset;
      const y = 221 - offset * 21;
      const { rest57, rest19 } = clock.clockAddress(step);
      const pair = [project(rest57, 57, 91, y), project(rest19, 19, 58, y)];
      points.push({ step, pair, y });
      svg(helix, 'ellipse', { cx: 138, cy: y, rx: 91, ry: 17.3, class: 'hw-level' });
    }
    for (let rail = 0; rail < 2; rail++) {
      svg(helix, 'polyline', {
        points: points.map(({ pair }) => pair[rail].join(',')).join(' '),
        class: `hw-rail ${rail === 0 ? 'hw-gold' : 'hw-blue'}`
      });
    }
    for (const { step, pair, y } of points) {
      const active = step === current;
      line(helix, pair[0], pair[1], active ? 'hw-rung' : 'hw-level');
      dot(helix, pair[0], 'hw-gold', active ? 5 : 2);
      dot(helix, pair[1], 'hw-blue', active ? 5 : 2);
      if (active || step === current - 1 || step === current + 1) {
        text(helix, 262, y + 4, String(step), active ? 'hw-active-step' : '');
      }
    }
  }

  function render(number, syncInput = true) {
    current = number;
    const record = clock.clockAddress(current);
    const deckIndex = Math.floor(record.rest57 / 19);
    if (syncInput) input.value = current;
    previous.disabled = current === 0;
    next.disabled = current === max;
    readout.textContent = `${current} = ${Math.floor(current / 57)} × 57 + ${record.rest57} · Deck ${deckIndex + 1}, Position ${record.rest19}`;
    panel.querySelector('[data-wheel-rest57]').textContent = record.rest57;
    panel.querySelector('[data-wheel-rest19]').textContent = record.rest19;
    drawPolar(record);
    drawHelix();
    decks.forEach((deck, index) => {
      const active = index === deckIndex;
      deck.classList.toggle('hw-deck-active', active);
      deck.querySelector('output').textContent = active ? `Position ${record.rest19} · aktiv` : '';
      const view = deck.querySelector('svg');
      view.replaceChildren();
      wheel(view, 52, 53, 35, 19, active ? 'hw-blue' : '');
      if (active) dot(view, polar(52, 53, 35, angle(record.rest19, 19)), 'hw-blue', 5);
      for (const position of [0, 6, 12, 18]) {
        const [x, y] = polar(52, 53, 46, angle(position, 19));
        text(view, x, y + 4, String(position), 'hw-deck-position');
      }
      addWheelTargets(view, 52, 53, 35, 19, index * 19, record.rest57, record.rest19);
    });
  }

  previous.addEventListener('click', () => render(current - 1));
  next.addEventListener('click', () => render(current + 1));
  panel.querySelector('[data-wheel-reset]').addEventListener('click', () => render(56));
  input.addEventListener('input', () => {
    const number = input.valueAsNumber;
    if (Number.isSafeInteger(number) && number >= 0) render(number, false);
  });
  input.addEventListener('change', () => { input.value = current; });
  render(current);
})();

(() => {
  'use strict';

  const panel = document.getElementById('helix-jila');
  if (!panel) return;

  const lower = panel.querySelector('[data-jila-lower]');
  const upper = panel.querySelector('[data-jila-upper]');
  const play = panel.querySelector('[data-jila-play]');
  const time = panel.querySelector('[data-jila-time]');
  const phase = panel.querySelector('[data-jila-phase]');
  const height = panel.querySelector('#helixJilaHeight');
  const heightValue = panel.querySelector('[data-jila-height-value]');
  const heightLabel = panel.querySelector('[data-jila-height-label]');
  const upperPlane = panel.querySelector('[data-jila-upper-plane]');
  const guides = panel.querySelector('[data-jila-guides]');
  const rate = panel.querySelector('[data-jila-rate]');
  const frequencyDifferencePerMm = 429.228e12 * 9.8e-20;
  const phaseRatePerMm = 360 * frequencyDifferencePerMm;
  const guideCurves = [...panel.querySelectorAll('[data-jila-guide-curve]')];
  const compareLines = [...panel.querySelectorAll('[data-jila-compare-line]')];
  const compareValues = [...panel.querySelectorAll('[data-jila-compare-value]')];
  const timeMid = panel.querySelector('[data-jila-time-mid]');
  const timeMax = panel.querySelector('[data-jila-time-max]');
  const phaseMid = panel.querySelector('[data-jila-phase-mid]');
  const phaseMax = panel.querySelector('[data-jila-phase-max]');
  const chartSeek = panel.querySelector('[data-jila-seek]');
  const chartCursor = panel.querySelector('[data-jila-cursor]');
  const comparePoint = panel.querySelector('[data-jila-compare-point]');
  const phaseScalePerSecond = 0.04;
  const chartBaseline = 144;
  const chartHeight = 114;
  let chartDuration = 0;
  const lengthFormat = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 1 });
  const magnification = 500;
  const timeFormat = new Intl.NumberFormat('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const phaseFormat = new Intl.NumberFormat('de-DE', { minimumFractionDigits: 3, maximumFractionDigits: 3 });
  let elapsed = 0;
  let started = null;
  let frame;

  function chartY(fraction, gap) {
    return chartBaseline - chartHeight * phaseRatePerMm * fraction * gap / phaseScalePerSecond;
  }

  guideCurves.forEach((curve, gap) => curve.setAttribute('y2', chartY(1, gap)));

  function draw(seconds) {
    const sharedAngle = 45 * seconds;
    const lead = phaseRatePerMm * height.valueAsNumber * seconds;
    lower.setAttribute('transform', `rotate(${sharedAngle % 360})`);
    upper.setAttribute('transform', `rotate(${(sharedAngle + lead * magnification) % 360})`);
    time.textContent = `${timeFormat.format(seconds)} s`;
    phase.textContent = `${phaseFormat.format(lead)}°`;

    const duration = Math.max(chartDuration, 20, 20 * Math.ceil(seconds / 20));
    const limit = phaseScalePerSecond * duration;
    if (duration !== chartDuration) {
      chartDuration = duration;
      timeMid.textContent = duration / 2;
      timeMax.textContent = duration;
      chartSeek.setAttribute('aria-valuemax', duration);
      phaseMid.textContent = lengthFormat.format(limit / 2);
      phaseMax.textContent = lengthFormat.format(limit);
    }
    const x = 54 + 384 * seconds / duration;
    chartCursor.setAttribute('x1', x);
    chartCursor.setAttribute('x2', x);
    const gap = height.valueAsNumber;
    comparePoint.setAttribute('cx', x);
    comparePoint.setAttribute('cy', chartY(seconds / duration, gap));
    const accessibleTime = (Math.round(seconds * 10) / 10).toString();
    if (chartSeek.getAttribute('aria-valuenow') !== accessibleTime) {
      chartSeek.setAttribute('aria-valuenow', accessibleTime);
      chartSeek.setAttribute('aria-valuetext', time.textContent);
    }
    const leadPerMm = phaseRatePerMm * seconds;
    compareLines.forEach((line, gap) => {
      const value = gap * leadPerMm;
      line.setAttribute('x2', x);
      line.setAttribute('y2', chartY(seconds / duration, gap));
      compareValues[gap].textContent = `${phaseFormat.format(value)}°`;
    });
  }

  function tick(now) {
    draw(elapsed + (now - started) / 1000);
    frame = requestAnimationFrame(tick);
  }

  function pause() {
    cancelAnimationFrame(frame);
    if (started !== null) elapsed += (performance.now() - started) / 1000;
    started = null;
    play.textContent = '▶ Play';
    draw(elapsed);
  }

  play.addEventListener('click', () => {
    if (started !== null) {
      pause();
      return;
    }
    started = performance.now();
    play.textContent = '⏸ Pause';
    frame = requestAnimationFrame(tick);
  });

  function seek(seconds) {
    elapsed = Math.round(Math.max(0, Math.min(chartDuration, seconds)) * 10) / 10;
    started = null;
    pause();
  }

  chartSeek.addEventListener('click', event => {
    const { left, top, width, height: hitHeight } = chartSeek.getBoundingClientRect();
    const fraction = (event.clientX - left) / width;
    const hitY = event.clientY - top;
    const plotTop = chartBaseline - chartHeight;
    const scaleY = hitHeight / Number(chartSeek.getAttribute('height'));
    let nearestGap = null;
    let nearestDistance = 8;
    guideCurves.forEach((curve, gap) => {
      const distance = Math.abs(hitY - (chartY(fraction, gap) - plotTop) * scaleY);
      if (distance < nearestDistance) {
        nearestGap = gap;
        nearestDistance = distance;
      }
    });
    if (nearestGap !== null) {
      height.value = nearestGap;
      updateHeight();
    }
    seek(chartDuration * fraction);
  });

  chartSeek.addEventListener('keydown', event => {
    const currentTime = Number(chartSeek.getAttribute('aria-valuenow'));
    const destinations = {
      ArrowLeft: currentTime - 1, ArrowDown: currentTime - 1,
      ArrowRight: currentTime + 1, ArrowUp: currentTime + 1,
      Home: 0, End: chartDuration
    };
    if (!Object.hasOwn(destinations, event.key)) return;
    event.preventDefault();
    seek(destinations[event.key]);
  });

  panel.querySelector('[data-jila-reset]').addEventListener('click', () => {
    chartDuration = 0;
    seek(0);
  });

  function updateHeight() {
    const gap = height.valueAsNumber;
    const distance = 65 * gap;
    const upperY = 175 - distance;
    const label = `${lengthFormat.format(gap)} mm`;
    upperPlane.setAttribute('transform', `translate(120 ${upperY})`);
    upper.setAttribute('stroke-dasharray', gap === 0 ? '5 5' : 'none');
    guides.setAttribute('d', `M44 ${upperY}v${distance} M196 ${upperY}v${distance} M245 ${upperY}h14v${distance}h-14`);
    heightLabel.setAttribute('y', 180 - distance / 2);
    heightLabel.textContent = label;
    heightValue.textContent = label;
    height.setAttribute('aria-valuetext', label);
    rate.textContent = `${timeFormat.format(frequencyDifferencePerMm * gap * 1e6)} µHz`;
    comparePoint.dataset.gap = gap;
    comparePoint.classList.toggle('hw-jila-point-hidden', !Number.isInteger(gap));
    compareValues.forEach((value, preset) => {
      const selected = preset === gap;
      value.parentElement.classList.toggle('hw-jila-selected', selected);
      compareLines[preset].classList.toggle('hw-jila-curve-selected', selected);
      guideCurves[preset].classList.toggle('hw-jila-curve-selected', selected);
    });
  }

  height.addEventListener('input', () => {
    updateHeight();
    draw(started === null ? elapsed : elapsed + (performance.now() - started) / 1000);
  });
  updateHeight();
  draw(0);
})();
