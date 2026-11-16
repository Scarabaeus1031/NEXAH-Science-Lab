(function (root) {
  'use strict';

  function mount(doc, env) {
    const C = env.A0OrientationController;
    const R = env.A0RedBalloonStory;
    const host = doc.getElementById('typedLoopPhasePlug');
    if (!host || !C) return null;
    const model = C.typedLoopPhasePlug();
    const buttons = [...host.querySelectorAll('[data-phase-plug-station]')];
    const title = doc.getElementById('phasePlugTitle');
    const carrier = doc.getElementById('phasePlugCarrier');
    const exact = doc.getElementById('phasePlugExact');
    const open = doc.getElementById('phasePlugOpen');
    const counter = doc.getElementById('phasePlugCounter');
    const phase = doc.getElementById('phasePlugPhase');
    const rail = doc.getElementById('phasePlugRail');
    let index = 0;
    let cipherMode = 'HANDLE';
    let cipherIndex = 1;

    function render() {
      const station = model.stations[index];
      host.dataset.station = station.key;
      title.textContent = `${station.id} · ${station.title}`;
      carrier.textContent = station.carrier;
      exact.textContent = station.exact;
      open.textContent = station.open;
      counter.textContent = `${station.id}/9 · ${station.key}`;
      phase.textContent = station.key === 'PHASE12'
        ? `ρ=${model.phaseComparator.rhoRD.toFixed(6)} · |Δ₁₀⁄₁₂|=${model.phaseComparator.rhoDistanceToNegativeTenTwelfths.toFixed(6)} · wrap=${model.phaseComparator.wrappedCounterAddress}/12`
        : `i-SEAM · ${station.carrier}`;
      buttons.forEach((button, buttonIndex) => {
        const active = buttonIndex === index;
        button.classList.toggle('active', active);
        button.setAttribute('aria-pressed', String(active));
      });
      rail.style.setProperty('--phase-plug-step', String(index));
    }

    function select(next) {
      index = ((Number(next) % model.stationCount) + model.stationCount) % model.stationCount;
      render();
    }

    function renderCipher() {
      if (!R || typeof R.scarabCipherTrip !== 'function') return null;
      const trip = R.scarabCipherTrip(cipherMode, cipherIndex);
      cipherIndex = trip.index;
      doc.getElementById('phaseCipherWord').textContent = trip.selected;
      doc.getElementById('phaseCipherModeLabel').textContent = `${trip.mode} · ${trip.modes[trip.mode].count}`;
      doc.getElementById('phaseCipherCount').textContent = `${trip.modes[trip.mode].count} ${trip.mode} WORDS`;
      doc.getElementById('phaseCipherIndex').textContent = `${trip.index + 1} / ${trip.modes[trip.mode].count}`;
      host.querySelectorAll('[data-cipher-mode]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.cipherMode === trip.mode)));
      return trip;
    }

    buttons.forEach((button, buttonIndex) => button.addEventListener('click', () => select(buttonIndex)));
    doc.getElementById('phasePlugPrev').addEventListener('click', () => select(index - 1));
    doc.getElementById('phasePlugNext').addEventListener('click', () => select(index + 1));
    host.querySelectorAll('[data-cipher-mode]').forEach(button => button.addEventListener('click', () => {
      cipherMode = button.dataset.cipherMode;
      cipherIndex = cipherMode === 'HANDLE' ? 1 : 0;
      renderCipher();
    }));
    doc.getElementById('phaseCipherPrev').addEventListener('click', () => { cipherIndex -= 1; renderCipher(); });
    doc.getElementById('phaseCipherNext').addEventListener('click', () => { cipherIndex += 1; renderCipher(); });
    doc.getElementById('phasePlugExport').addEventListener('click', () => {
      const payload = { tool: 'A0 Typed Loop Phase Plug', version: C.VERSION, selectedStation: model.stations[index], cipherTrip: renderCipher(), model };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const link = doc.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'a0-typed-loop-phase-plug-receipt.json';
      link.click();
      setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    });
    render();
    const cipherTrip = renderCipher();
    return { model, cipherTrip, select, renderCipher, get index() { return index; }, get cipherMode() { return cipherMode; }, get cipherIndex() { return cipherIndex; } };
  }

  root.A0TypedLoopPhasePlug = { mount };
})(typeof globalThis !== 'undefined' ? globalThis : this);
