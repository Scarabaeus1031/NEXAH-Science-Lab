(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.A0TypedBoundaryHingeDock = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const DANCE = ['KW', 'MM', 'TD', 'WM', 'DT', 'FF', 'S7', '7S'];
  const MONTH_SCORE = ['J₁', 'F₂', 'M₃', 'A₄', 'M₅', 'J₆', 'J₇', 'A₈', 'S₉', 'O₁₀', 'N₁₁', 'D₁₂'];
  const OCTAVE_GAPS = [3, 3, 2, 4, 4, 5, 3];
  const mod = (value, modulus) => ((Number(value) % modulus) + modulus) % modulus;

  function decodePhase(value) {
    const phase = mod(Math.trunc(Number(value) || 0), 280);
    const macro = phase % 56;
    const fiber = Math.floor(phase / 56);
    const station = macro % 7;
    const hinge = Math.floor(macro / 7) % 4;
    const side = Math.floor(macro / 28);
    const orientation = hinge + 4 * side;
    return { phase, macro, fiber, station, hinge, side, orientation, label: DANCE[orientation] };
  }

  function encodePhase(macro, fiber) {
    return mod(macro, 56) + 56 * mod(fiber, 5);
  }

  function rotate(value, step) {
    return mod(decodePhase(value).phase + step, 280);
  }

  function flip(value) {
    const state = decodePhase(value);
    return encodePhase(state.macro + 28, state.fiber);
  }

  function mount(scope) {
    const dock = scope || document.getElementById('typedBoundaryHingeDock');
    if (!dock || dock.dataset.mounted === 'true') return null;
    dock.dataset.mounted = 'true';

    const phaseInput = dock.querySelector('[data-phase-input]');
    const grid = dock.querySelector('[data-state-grid]');
    const fibers = dock.querySelector('[data-fibers]');
    const dance = dock.querySelector('[data-dance]');
    const monthScore = dock.querySelector('[data-month-score]');
    const readouts = Object.fromEntries(Array.from(dock.querySelectorAll('[data-readout]')).map(node => [node.dataset.readout, node]));
    const params = new URLSearchParams(window.location.search);
    const handedPhase = params.get('a0_phase');
    let phase = decodePhase(handedPhase ?? phaseInput.value).phase;

    for (let orientation = 0; orientation < 8; orientation += 1) {
      for (let station = 0; station < 7; station += 1) {
        const macro = station + 7 * (orientation % 4) + 28 * Math.floor(orientation / 4);
        const cell = document.createElement('button');
        cell.type = 'button';
        cell.className = 'tbh-state';
        cell.dataset.macro = String(macro);
        cell.setAttribute('aria-label', `${DANCE[orientation]}, Station ${station + 1}, Adresse ${macro}`);
        cell.innerHTML = `<span>${DANCE[orientation]}</span><b>${station + 1}</b><small>${macro}</small>`;
        cell.addEventListener('click', () => {
          phase = encodePhase(macro, decodePhase(phase).fiber);
          render();
        });
        grid.appendChild(cell);
      }
    }

    DANCE.forEach((label, index) => {
      const item = document.createElement('span');
      item.dataset.orientation = String(index);
      item.textContent = label;
      dance.appendChild(item);
    });
    MONTH_SCORE.forEach(label => {
      const item = document.createElement('span');
      item.textContent = label;
      monthScore.appendChild(item);
    });
    for (let fiber = 0; fiber < 5; fiber += 1) {
      const item = document.createElement('button');
      item.type = 'button';
      item.dataset.fiber = String(fiber);
      item.innerHTML = `<b>T${fiber + 1}</b><small>${fiber * 56}–${fiber * 56 + 55}</small>`;
      item.addEventListener('click', () => {
        phase = encodePhase(decodePhase(phase).macro, fiber);
        render();
      });
      fibers.appendChild(item);
    }

    function render() {
      const state = decodePhase(phase);
      phaseInput.value = String(state.phase);
      readouts.phase.textContent = state.phase;
      readouts.macro.textContent = state.macro;
      readouts.fiber.textContent = `T${state.fiber + 1}`;
      readouts.station.textContent = state.station + 1;
      readouts.hinge.textContent = state.hinge;
      readouts.orientation.textContent = `${state.orientation} · ${state.label}`;
      readouts.side.textContent = state.side ? 'R / B' : 'L / A';
      dock.querySelectorAll('[data-macro]').forEach(node => node.classList.toggle('is-active', Number(node.dataset.macro) === state.macro));
      dock.querySelectorAll('[data-fiber]').forEach(node => node.classList.toggle('is-active', Number(node.dataset.fiber) === state.fiber));
      dock.querySelectorAll('[data-orientation]').forEach(node => node.classList.toggle('is-active', Number(node.dataset.orientation) === state.orientation));
      const backLink = dock.querySelector('[data-compass-return]');
      backLink.href = `DRAFTS/A0_TYPED_MIRROR_ROTATION_COMPASS_DRAFT_2026-11-07.html?a0_phase=${state.phase}#five-t-title`;
    }

    phaseInput.addEventListener('input', () => { phase = decodePhase(phaseInput.value).phase; render(); });
    dock.querySelectorAll('[data-step]').forEach(button => button.addEventListener('click', () => {
      const step = button.dataset.step;
      phase = step === 'flip' ? flip(phase) : step === 'return' ? 0 : rotate(phase, Number(step));
      render();
    }));
    if (handedPhase !== null) window.addEventListener('pageshow', () => { phase = decodePhase(handedPhase).phase; render(); }, { once: true });
    render();
    return { get phase() { return phase; }, render };
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => mount());
    else mount();
  }

  return { DANCE, MONTH_SCORE, OCTAVE_GAPS, mod, decodePhase, encodePhase, rotate, flip, mount };
}));
