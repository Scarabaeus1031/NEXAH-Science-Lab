(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.A0MachinaSharedPhaseBus = api;
  if (root && root.document) {
    const start = () => api.mountAll(root.document);
    if (root.document.readyState === "loading") root.document.addEventListener("DOMContentLoaded", start, { once: true });
    else start();
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const HOST_ID = "NEXAH_A0_ORIENTATION_CONTROLLER_BENCH";
  const TARGETS = Object.freeze(["L_c", "NLK_L_SHELL_CUBE_VIEW", "COUPLED_PINK_AXIS", "RA_TH_BRIDGE_PROJECTION"]);

  function normalizeDegrees(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return 0;
    return ((number % 360) + 360) % 360;
  }

  function phaseState(value) {
    const degrees = normalizeDegrees(value);
    const radians = degrees * Math.PI / 180;
    const pink = 42 * Math.sin(radians);
    return Object.freeze({
      degrees,
      turns: degrees / 360,
      lcDegrees: degrees,
      wobbleDegrees: degrees,
      rathDegrees: degrees,
      pinkCoarseDegrees: pink,
      pinkFineDegrees: -pink,
      exactReturn: degrees === 0,
      coupling: "MINT_LOCK",
      addressesHeld: true
    });
  }

  function createReceipt(value) {
    const state = phaseState(value);
    return {
      schema: "nexah.view.machina-shared-phase-bus/1.0.0",
      host_id: HOST_ID,
      reused_identities: [HOST_ID, "NLK_L_SHELL"],
      display_role: "MINT_COUPLING_LOCK",
      phase_degrees: state.degrees,
      targets: TARGETS.slice(),
      handoff_chain: ["RA", "TH", "T", "TESA", "REC", "RA"],
      typed_return: { label: "REC", roles: { R: "READ_RETURN_ROLE", D: "DISPLAY_ROLE" }, state: state.exactReturn ? "EXACT_RETURN" : "HOLD" },
      existing_module_handoffs: {
        full_tesa_lissajous: "A0_ORIENTATION_CONTROLLER_BENCH.html#tesaLissajousWindowRouter",
        iota_bridge_tour: "A0_IOTA_BRIDGE_DEMONSTRATOR.html#module-entry"
      },
      coordinate_drift: {
        carrier: "Z_365",
        view_rule: "theta(k)=360deg*k/365",
        address_gap: 5,
        v_gap_degrees: 5 * 360 / 365,
        iota_half_step: .5,
        role: "DISPLAY_INTERPOLATION_ONLY"
      },
      exact_return: state.exactReturn,
      addresses_held: true,
      source_mutation: false,
      graph_delta: { ids: 0, relations: 0, aliases: 0 },
      boundary: "Shared display phase only. TESA is nested in the RA/TH projection and REC is its typed output, not an additional phase target. The Z365 V-gap and IOTA 0.5 marker are coordinate-display readings, not a shared operator or invariant. R and D remain separate roles; no shared body physics, source mutation, clock, operator or evidence relation."
    };
  }

  function validate(receipt) {
    return Boolean(receipt && receipt.host_id === HOST_ID && receipt.addresses_held === true &&
      receipt.source_mutation === false && receipt.graph_delta.ids === 0 &&
      receipt.graph_delta.relations === 0 && receipt.graph_delta.aliases === 0 &&
      TARGETS.every((target) => receipt.targets.includes(target)));
  }

  function mount(host) {
    if (!host || host.dataset.sharedPhaseMounted === "true") return null;
    const doc = host.ownerDocument;
    const lens = doc.querySelector("[data-triangle-phi-lens]");
    const pinkAxis = doc.querySelector("[data-tvs-pink-axis]");
    const lcInput = lens && lens.querySelector("[data-tpl-lc-phase]");
    const wobbleInput = lens && lens.querySelector("[data-tpl-wobble-phase]");
    const rathInput = lens && lens.querySelector("[data-tpl-rath-phase]");
    const phaseInput = host.querySelector("[data-shared-phase-input]");
    const phaseOutput = host.querySelector("[data-shared-phase-output]");
    const stateOutput = host.querySelector("[data-shared-phase-state]");
    const play = host.querySelector("[data-shared-phase-play]");
    const pause = host.querySelector("[data-shared-phase-pause]");
    const exactReturn = host.querySelector("[data-shared-phase-return]");
    const receiptOutput = host.querySelector("[data-shared-phase-receipt]");
    let frame = null;
    let lastTime = null;

    if (!lens || !pinkAxis || !lcInput || !wobbleInput || !rathInput || !phaseInput) {
      host.dataset.coupling = "unavailable";
      if (stateOutput) stateOutput.textContent = "UNAVAILABLE · TARGET MISSING";
      return { available: false };
    }

    function stopIndependentPlayers() {
      [lens.querySelector("[data-tpl-lc-play]"), lens.querySelector("[data-tpl-wobble-play]"), lens.querySelector("[data-tpl-rath-play]")].forEach((button) => {
        if (button && button.getAttribute("aria-pressed") === "true") button.click();
      });
    }

    function dispatchInput(input, degrees) {
      input.value = String(Math.round(degrees) % 360);
      const EventCtor = doc.defaultView && doc.defaultView.Event;
      if (EventCtor) input.dispatchEvent(new EventCtor("input", { bubbles: true }));
    }

    function apply(value) {
      const state = phaseState(value);
      phaseInput.value = String(Math.round(state.degrees));
      dispatchInput(lcInput, state.lcDegrees);
      dispatchInput(wobbleInput, state.wobbleDegrees);
      dispatchInput(rathInput, state.rathDegrees);
      lens.dataset.sharedPhase = "coupled";
      pinkAxis.dataset.sharedPhase = "coupled";
      pinkAxis.dataset.axisMotion = state.exactReturn ? "returned" : "coupled";
      const coarse = pinkAxis.querySelector(".tvs-axis-rail.coarse");
      const fine = pinkAxis.querySelector(".tvs-axis-rail.fine");
      if (coarse) coarse.style.transform = `rotateY(${state.pinkCoarseDegrees.toFixed(3)}deg)`;
      if (fine) fine.style.transform = `rotateY(${state.pinkFineDegrees.toFixed(3)}deg)`;
      const axisState = pinkAxis.querySelector("[data-tvs-axis-state]");
      if (axisState) axisState.textContent = state.exactReturn ? "MINT RETURN · SOURCE PAIR HELD" : `MINT LOCK · τ ${Math.round(state.degrees)}° · ADDRESSES HELD`;
      host.dataset.coupling = "locked";
      const receipt = createReceipt(state.degrees);
      if (phaseOutput) phaseOutput.textContent = `${Math.round(state.degrees)}°`;
      if (stateOutput) stateOutput.textContent = state.exactReturn ? "EXACT RETURN · TESA → REC → RA · Z365 V-GAP HELD · FOUR TARGETS AT 0°" : "LOCKED · L_c + NLK/L-SHELL + PINK AXIS + RA/TH → TESA · IOTA 0.5 DRIFT → REC";
      if (receiptOutput) receiptOutput.textContent = JSON.stringify(receipt, null, 2);
      return receipt;
    }

    function stop() {
      if (frame !== null && doc.defaultView) doc.defaultView.cancelAnimationFrame(frame);
      frame = null;
      lastTime = null;
      if (play) play.setAttribute("aria-pressed", "false");
    }

    function tick(time) {
      if (lastTime === null) lastTime = time;
      const delta = time - lastTime;
      lastTime = time;
      apply(Number(phaseInput.value) + delta * 0.03);
      frame = doc.defaultView.requestAnimationFrame(tick);
    }

    phaseInput.addEventListener("input", () => {
      stop();
      stopIndependentPlayers();
      apply(Number(phaseInput.value));
    });
    if (play) play.addEventListener("click", () => {
      stopIndependentPlayers();
      if (frame !== null) return stop();
      play.setAttribute("aria-pressed", "true");
      frame = doc.defaultView.requestAnimationFrame(tick);
    });
    if (pause) pause.addEventListener("click", stop);
    if (exactReturn) exactReturn.addEventListener("click", () => {
      stop();
      stopIndependentPlayers();
      apply(0);
    });

    host.dataset.sharedPhaseMounted = "true";
    apply(Number(phaseInput.value));
    return { available: true, apply, stop, exactReturn: () => apply(0), getReceipt: () => createReceipt(phaseInput.value) };
  }

  function mountAll(scope) {
    return Array.from(scope.querySelectorAll("[data-machina-shared-phase-bus]")).map(mount).filter(Boolean);
  }

  return { HOST_ID, TARGETS, normalizeDegrees, phaseState, createReceipt, validate, mount, mountAll };
});
