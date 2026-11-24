(() => {
  const ROOT8_BETA = Math.sqrt(7 / 8);
  const format = value => Number.isFinite(value) ? value.toFixed(value >= 100 ? 3 : 6).replace(/0+$/, '').replace(/\.$/, '') : '∞';

  document.querySelectorAll('[data-root8-gamma-lens]').forEach(lens => {
    const slider = lens.querySelector('[data-r8-beta]');
    const preset = lens.querySelector('[data-r8-preset]');
    const betaOuts = [...lens.querySelectorAll('[data-r8-beta-out]')];
    const gammaOut = lens.querySelector('[data-r8-gamma-out]');
    const gammaBetaOut = lens.querySelector('[data-r8-gamma-beta-out]');
    const invariantOut = lens.querySelector('[data-r8-invariant-out]');
    const readout = lens.querySelector('.r8g7-lens__readout');
    if (!slider || !preset || betaOuts.length === 0 || !gammaOut || !gammaBetaOut || !invariantOut) return;

    const render = () => {
      const beta = Number(slider.value);
      const gamma = 1 / Math.sqrt(1 - beta * beta);
      const gammaBeta = gamma * beta;
      const invariant = gamma * gamma - gammaBeta * gammaBeta;
      const exact = Math.abs(beta - ROOT8_BETA) < 0.00001;
      betaOuts.forEach(output => { output.value = format(beta); });
      gammaOut.value = exact ? '√8 · 2.828427' : format(gamma);
      gammaBetaOut.value = exact ? '√7 · 2.645751' : format(gammaBeta);
      invariantOut.value = format(invariant);
      readout?.classList.toggle('is-root8', exact);
      lens.dataset.exactRoot8 = String(exact);
    };

    slider.addEventListener('input', render);
    preset.addEventListener('click', () => {
      slider.value = ROOT8_BETA.toFixed(6);
      render();
    });
    render();
  });
})();
