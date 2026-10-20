(function () {
  "use strict";

  const button = document.getElementById("globalFibPlay");
  const bus = document.getElementById("masterBus");
  const clock = document.getElementById("masterTick");
  if (!button || !bus || !clock) return;

  const moduleTargets = {
    carrier: { target: "lab", moduleId: "carrier", bindingType: "source-view" },
    shell: { target: "double", moduleId: "shell-seam", bindingType: "typed-view" },
    fiber: { target: "fiber-geometry", moduleId: "fiber-cut", bindingType: "typed-view" },
    fold: { target: "fold-contact", moduleId: "fold-breath", bindingType: "typed-view" },
    spectrum: { target: "spectral-audit", moduleId: "spectrum-return", bindingType: "typed-view" },
    rings: { target: "fibonacci-ring-operator", moduleId: "ring-comparator", bindingType: "typed-view" }
  };

  bus.querySelectorAll("span[data-master-node]").forEach((chip) => {
    const binding = moduleTargets[chip.dataset.masterNode];
    if (!binding) return;
    const link = document.createElement("a");
    link.href = `#${binding.target}`;
    link.textContent = chip.textContent;
    link.dataset.masterNode = chip.dataset.masterNode;
    link.dataset.moduleId = binding.moduleId;
    link.dataset.focusTarget = binding.target;
    link.dataset.bindingType = binding.bindingType;
    link.setAttribute("aria-label", `${chip.textContent} direkt öffnen`);
    chip.replaceWith(link);
  });

  const nodes = [...bus.querySelectorAll("[data-master-node]")];
  const scheduleOrder = ["UNIFORM", "FIBONACCI", "SEEDED_RANDOM"];
  const seamOrder = ["disjoint", "connected", "octagons"];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const state = { running: false, tick: 0, timer: 0, periodMs: 620, cycleLength: 48, antiPhase: 0 };

  function emitInput(control) {
    if (control) control.dispatchEvent(new Event("input", { bubbles: true }));
  }

  function stopIndependentPlayers() {
    const fold = document.getElementById("foldPlay");
    const breath = document.getElementById("conDaoPlay");
    const fibonacci = document.getElementById("fibPlay");
    if (fold && fold.textContent.startsWith("Pause")) fold.click();
    if (breath && breath.classList.contains("active")) breath.click();
    if (fibonacci && fibonacci.classList.contains("active")) fibonacci.click();
  }

  function setButton() {
    button.classList.toggle("active", state.running);
    button.setAttribute("aria-pressed", String(state.running));
    button.innerHTML = state.running
      ? '<span aria-hidden="true">Ⅱ</span>Pause all · coupled page'
      : '<span aria-hidden="true">▶</span>Start all · coupled page';
    bus.classList.toggle("active", state.running);
    nodes.forEach((node) => node.classList.toggle("active", state.running));
  }

  function step() {
    const tick = state.tick;
    const wave = 0.5 - 0.5 * Math.cos((Math.PI * 2 * tick) / state.cycleLength);

    const carrier = document.getElementById("stateRange");
    carrier.value = String(tick % 48);
    emitInput(carrier);

    const seamMode = seamOrder[Math.floor(tick / 16) % seamOrder.length];
    const seam = document.querySelector(`[data-seam="${seamMode}"]`);
    if (seam && !seam.classList.contains("active")) seam.click();

    const fiberAddress = tick < 24 ? "1111" : "0111";
    const fiber = document.querySelector(`[data-fiber-address="${fiberAddress}"]`);
    if (fiber && !fiber.classList.contains("active")) fiber.click();
    const cut = document.getElementById("cutRange");
    cut.value = (0.2 + 0.65 * wave).toFixed(2);
    emitInput(cut);

    const breathStep = document.getElementById("conDaoStep");
    if (breathStep) breathStep.click();

    if (window.A0TessarecSpectralSlices) {
      window.A0TessarecSpectralSlices.setLane(tick % 8, !reducedMotion);
    }
    const pair = document.getElementById("e8PairRange");
    pair.value = String(tick % 7);
    emitInput(pair);

    const nextAntiPhase = tick >= 24 ? 1 : 0;
    if (nextAntiPhase !== state.antiPhase) {
      document.getElementById("antiJanus")?.click();
      state.antiPhase = nextAntiPhase;
    }

    const schedule = scheduleOrder[Math.floor(tick / 16) % scheduleOrder.length];
    const scheduleButton = document.querySelector(`[data-fib-schedule="${schedule}"]`);
    if (scheduleButton && !scheduleButton.classList.contains("active")) scheduleButton.click();

    clock.textContent = `MASTER CLOCK · ${String(tick + 1).padStart(2, "0")}/48 · ${seamMode.toUpperCase()} · ${schedule.replace("_", " ")}`;
    window.A0TessarecPageOrchestratorState = {
      running: state.running,
      tick,
      phase: wave,
      carrierState: tick % 48,
      seamMode,
      fiberAddress,
      spectralLane: tick % 8,
      pairStart: tick % 7,
      schedule
    };
    window.dispatchEvent(new CustomEvent("a0:tessarec-tick", { detail: window.A0TessarecPageOrchestratorState }));
    state.tick = (tick + 1) % state.cycleLength;
  }

  function start() {
    if (state.running) return;
    stopIndependentPlayers();
    state.running = true;
    setButton();
    step();
    if (!reducedMotion) state.timer = window.setInterval(step, state.periodMs);
  }

  function stop() {
    if (state.timer) window.clearInterval(state.timer);
    state.timer = 0;
    state.running = false;
    setButton();
    clock.textContent = `MASTER CLOCK · PAUSED · ${String(state.tick || 48).padStart(2, "0")}/48`;
    if (window.A0TessarecPageOrchestratorState) {
      window.A0TessarecPageOrchestratorState.running = false;
    }
  }

  button.addEventListener("click", () => state.running ? stop() : start());
  setButton();
  window.A0TessarecPageOrchestrator = {
    start,
    stop,
    step,
    get state() { return { ...state, timer: undefined }; }
  };
})();
