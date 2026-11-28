(function () {
  "use strict";

  const api = globalThis.A0ReturnLayerAudit;
  if (!api) return;

  const format = (value) => {
    const magnitude = Math.abs(value);
    if (magnitude < 1e-10) return "0";
    if (magnitude >= 10000 || magnitude < 0.001) return value.toExponential(3);
    return value.toFixed(magnitude >= 100 ? 1 : 4);
  };

  document.querySelectorAll("[data-return-layer-audit]").forEach((root) => {
    const range = root.querySelector("[data-rla-phase]");
    const phaseLabel = root.querySelector("[data-rla-phase-label]");
    const rows = [...root.querySelectorAll("[data-rla-row]")];
    const buttons = [...root.querySelectorAll("[data-rla-mode]")];
    const outputs = Object.fromEntries(
      [...root.querySelectorAll("[data-rla-output]")].map((node) => [node.dataset.rlaOutput, node])
    );
    let mode = "residual";

    function render() {
      const record = api.sample(Number(range.value));
      phaseLabel.textContent = `${record.t.toFixed(3)} rad · ${(record.t * 180 / Math.PI).toFixed(1)}°`;
      const values = {
        carrierLeft: record.carrier,
        carrierRight: record.nextCarrier,
        carrierDefect: record.carrierDefect,
        witnessLeft: record.witness,
        witnessRight: record.nextWitness,
        witnessDefect: record.witnessDefect,
        residualLeft: record.residual,
        residualRight: record.nextResidual,
        residualDefect: record.residualDefect
      };
      Object.entries(values).forEach(([key, value]) => {
        if (outputs[key]) outputs[key].textContent = format(value);
      });
      rows.forEach((row) => row.classList.toggle("is-active", row.dataset.rlaRow === mode));
      buttons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.rlaMode === mode)));
      root.dataset.activeMode = mode;
    }

    buttons.forEach((button) => button.addEventListener("click", () => {
      mode = button.dataset.rlaMode;
      render();
    }));
    range.addEventListener("input", render);
    root.querySelector("[data-rla-reset]").addEventListener("click", () => {
      range.value = "0";
      mode = "residual";
      render();
    });
    render();
  });
})();
