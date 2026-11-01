(function () {
  "use strict";

  const Q_STAGES = Object.freeze([
    { q: 0.2, chord: 0.4, label: "q=0,2 · c=0,4" },
    { q: 0.1, chord: 0.2, label: "q=0,1 · c=0,2" },
    { q: 0.05, chord: 0.1, label: "q=0,05 · c=0,1" },
    { q: 0.025, chord: 0.05, label: "q=0,025 · c=0,05" }
  ]);
  const ANGLES = Object.freeze([
    { value: "0", label: "0°" },
    { value: "204", label: "204° · Feldansicht" },
    { value: "137.50776405003785", label: "137,507764° · goldener Winkel" }
  ]);

  function delta(q) {
    return (q * q) / (1 + Math.sqrt(1 - q * q));
  }

  function mount(scope) {
    const bay = (scope || document).querySelector("[data-splinter-knob-bay]");
    if (!bay) return null;
    const qInput = bay.querySelector("[data-skb-q]");
    const angleInput = bay.querySelector("[data-skb-angle]");
    const qOutput = bay.querySelector("[data-skb-q-output]");
    const angleOutput = bay.querySelector("[data-skb-angle-output]");
    const qDial = bay.querySelector("[data-skb-q-dial]");
    const angleDial = bay.querySelector("[data-skb-angle-dial]");
    const gate = bay.querySelector("[data-skb-gate]");
    const frame = bay.querySelector("[data-skb-frame]");
    const state = bay.querySelector("[data-skb-state]");
    const status = bay.querySelector("[data-skb-status]");
    const openButton = bay.querySelector("[data-skb-open]");
    const resetButton = bay.querySelector("[data-skb-reset]");
    let loaded = false;

    function dial(dialNode, index, count) {
      const turn = -120 + (240 * index) / Math.max(1, count - 1);
      dialNode.style.setProperty("--turn", `${turn}deg`);
    }

    function applyToSource() {
      if (!loaded || !frame.contentDocument) return false;
      const sourceQ = frame.contentDocument.getElementById("sm-k");
      const sourceAngle = frame.contentDocument.getElementById("sm-angle");
      if (!sourceQ || !sourceAngle) return false;
      sourceQ.value = String(qInput.value);
      sourceAngle.value = ANGLES[Number(angleInput.value)].value;
      sourceQ.dispatchEvent(new frame.contentWindow.Event("change", { bubbles: true }));
      sourceAngle.dispatchEvent(new frame.contentWindow.Event("change", { bubbles: true }));
      return true;
    }

    function sync() {
      const qIndex = Number(qInput.value);
      const angleIndex = Number(angleInput.value);
      const stage = Q_STAGES[qIndex];
      const angle = ANGLES[angleIndex];
      qOutput.textContent = stage.label;
      angleOutput.textContent = angle.label;
      dial(qDial, qIndex, Q_STAGES.length);
      dial(angleDial, angleIndex, ANGLES.length);
      applyToSource();
      status.textContent = `q=${stage.q} · c=${stage.chord} · δ=${delta(stage.q).toFixed(12)} · α=${angle.label} · α changes position only`;
    }

    function load() {
      if (!loaded) {
        frame.src = frame.dataset.src;
        loaded = true;
      }
      gate.open = true;
      state.textContent = "OPEN · source-bound geometry connected";
    }

    qInput.addEventListener("input", sync);
    angleInput.addEventListener("input", sync);
    gate.addEventListener("toggle", () => {
      if (gate.open) load();
      else state.textContent = loaded ? "CLOSED · source state preserved" : "CLOSED · source not loaded";
    });
    frame.addEventListener("load", () => {
      applyToSource();
      state.textContent = "OPEN · q / α controls synchronized";
    });
    openButton.addEventListener("click", load);
    resetButton.addEventListener("click", () => {
      qInput.value = "0";
      angleInput.value = "0";
      sync();
      status.textContent += " · EXACT INTERFACE RETURN";
    });
    if (location.hash === "#splinterChordBay") load();
    sync();
    return { load, sync, delta, isLoaded: () => loaded };
  }

  if (typeof document !== "undefined") {
    const boot = () => mount(document);
    document.readyState === "loading"
      ? document.addEventListener("DOMContentLoaded", boot, { once: true })
      : boot();
  }
  if (typeof module === "object" && module.exports) module.exports = { mount, delta, Q_STAGES, ANGLES };
})();
