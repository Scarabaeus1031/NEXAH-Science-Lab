(() => {
  'use strict';

  const storageKey = 'nexah.a0.angle-sequence.v1';
  const degreesPerMs = 0.12;
  const dwellMs = 240;
  const steps = [
    { from: 0, delta: 90, label: '1/3 · +90°' },
    { from: 90, delta: 90, label: '2/3 · +90°' },
    { from: 180, delta: -270, label: '3/3 · −270° Rückweg' }
  ];
  const duration = step => Math.abs(step.delta) / degreesPerMs;
  const total = steps.reduce((time, step) => time + duration(step) + dwellMs, 0);

  function readState(value) {
    try {
      const saved = JSON.parse(value);
      if (saved && Number.isFinite(saved.elapsed) && saved.elapsed >= 0
        && saved.elapsed <= total && (saved.startedAt === null || Number.isFinite(saved.startedAt))) return saved;
    } catch {}
    return null;
  }

  function sample(elapsed) {
    for (const step of steps) {
      const segment = duration(step);
      if (elapsed <= segment + dwellMs) {
        return { from: step.from, turn: step.delta * Math.min(1, elapsed / segment), label: step.label };
      }
      elapsed -= segment + dwellMs;
    }
    const { from, delta } = steps.at(-1);
    return { from, turn: delta, label: steps.at(-1).label };
  }

  document.querySelectorAll('[data-angle-sequence]').forEach(panel => {
    const dial = panel.querySelector('[data-angle-wheel]');
    const play = panel.querySelector('[data-angle-play]');
    const status = panel.querySelector('[data-angle-status]');
    const phase = panel.querySelector('[data-angle-phase]');
    const lift = panel.querySelector('[data-angle-lift]');
    const cx = Number(dial.dataset.angleWheel || 110);
    const cy = 110;
    const radius = 72;
    let state = null;
    let frame = null;
    try { state = readState(localStorage.getItem(storageKey)); } catch {}

    dial.insertAdjacentHTML('beforeend', `<g class="wheel-zeta-motion" visibility="hidden" aria-hidden="true">
      <circle class="wheel-zeta-motion-ring" cx="${cx}" cy="${cy}" r="${radius}"/>
      <path class="wheel-zeta-motion-arc"/>
      <line class="wheel-zeta-motion-needle" x1="${cx}" y1="${cy}"/>
      <circle class="wheel-zeta-motion-tip" r="4"/>
    </g>`);
    const motion = dial.querySelector('.wheel-zeta-motion');
    const arc = motion.querySelector('path');
    const needle = motion.querySelector('line');
    const tip = motion.querySelector('.wheel-zeta-motion-tip');

    function point(angle) {
      const radians = (angle - 90) * Math.PI / 180;
      return [cx + radius * Math.cos(radians), cy + radius * Math.sin(radians)];
    }

    function elapsedAt(now) {
      if (!state) return 0;
      return Math.min(total, state.elapsed + (state.startedAt === null ? 0 : Math.max(0, now - state.startedAt)));
    }

    function render() {
      cancelAnimationFrame(frame);
      const elapsed = elapsedAt(Date.now());
      const running = state?.startedAt != null && elapsed < total;
      const finished = elapsed === total;
      const { from, turn, label } = sample(elapsed);
      const angle = from + turn;
      const rounded = Math.round(angle);
      const wrapped = ((rounded % 360) + 360) % 360;
      const currentLabel = finished ? 'Fertig · 270° am Rad, −90° im Lift' : state ? label : 'Start bei 0°';
      if (status.textContent !== currentLabel) status.textContent = currentLabel;
      const buttonLabel = running ? '⏸ Winkelfolge pausieren' : finished ? '↻ Winkelfolge wiederholen'
        : state ? '▶ Winkelfolge fortsetzen' : '▶ Winkelfolge abspielen';
      if (play.textContent !== buttonLabel) play.textContent = buttonLabel;
      phase.textContent = `${wrapped}°`;
      lift.textContent = `${rounded < 0 ? '−' : ''}${Math.abs(rounded)}°`;

      const [sx, sy] = point(from);
      const [x, y] = point(angle);
      motion.setAttribute('visibility', state ? 'visible' : 'hidden');
      motion.classList.toggle('wheel-zeta-reverse', turn < 0);
      arc.setAttribute('d', `M${sx} ${sy} A${radius} ${radius} 0 ${Math.abs(turn) > 180 ? 1 : 0} ${turn >= 0 ? 1 : 0} ${x} ${y}`);
      needle.setAttribute('x2', x);
      needle.setAttribute('y2', y);
      tip.setAttribute('cx', x);
      tip.setAttribute('cy', y);
      panel.dispatchEvent(new CustomEvent('a0-angle-sequence-pose', { detail: { angle, reverse: turn < 0, active: Boolean(state) } }));
      frame = running ? requestAnimationFrame(render) : null;
    }

    play.addEventListener('click', () => {
      const now = Date.now();
      const elapsed = elapsedAt(now);
      const running = state?.startedAt != null && elapsed < total;
      state = { elapsed: elapsed === total ? 0 : elapsed, startedAt: running ? null : now };
      try { localStorage.setItem(storageKey, JSON.stringify(state)); } catch {}
      render();
    });
    window.addEventListener('storage', event => {
      if (event.key !== storageKey) return;
      state = readState(event.newValue);
      render();
    });
    render();
  });
})();
