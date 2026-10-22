(function () {
  "use strict";

  const decks = [...document.querySelectorAll("[data-perspective-deck]")];
  if (!decks.length) return;

  const state = {
    carrierState: Number(document.getElementById("stateRange")?.value || 0),
    spectralLane: Number(document.getElementById("sliceRange")?.value || 0),
    pairStart: Number(document.getElementById("e8PairRange")?.value || 0),
    schedule: "FIBONACCI",
    sampleCount: Number(document.getElementById("fibSampleCount")?.value || 48),
    phase: 0
  };

  function activate(deck, name) {
    deck.querySelectorAll("[data-perspective-tab]").forEach((button) => {
      const active = button.dataset.perspectiveTab === name;
      button.setAttribute("aria-selected", String(active));
      button.classList.toggle("active", active);
    });
    deck.querySelectorAll("[data-perspective-panel]").forEach((panel) => {
      panel.hidden = panel.dataset.perspectivePanel !== name;
    });
    deck.dataset.activePerspective = name;
  }

  decks.forEach((deck) => {
    deck.querySelectorAll("[data-perspective-tab]").forEach((button) => {
      button.addEventListener("click", () => activate(deck, button.dataset.perspectiveTab));
    });
  });

  function currentSchedule() {
    return document.querySelector("[data-fib-schedule].active")?.dataset.fibSchedule || state.schedule;
  }

  function syncFromControls() {
    state.carrierState = Number(document.getElementById("stateRange")?.value || state.carrierState);
    state.spectralLane = Number(document.getElementById("sliceRange")?.value || state.spectralLane);
    state.pairStart = Number(document.getElementById("e8PairRange")?.value || state.pairStart);
    state.sampleCount = Number(document.getElementById("fibSampleCount")?.value || state.sampleCount);
    state.schedule = currentSchedule();
    state.phase = state.carrierState / 47;
    render();
  }

  function setHot(nodes, index) {
    nodes.forEach((node, nodeIndex) => node.classList.toggle("hot", nodeIndex === index));
  }

  function rotatePoint(radius, angle) {
    return { x: radius * Math.cos(angle), y: radius * Math.sin(angle) };
  }

  function setReadout(panel, text) {
    const target = document.querySelector(`[data-perspective-panel="${panel}"] [data-perspective-readout]`);
    if (target) target.textContent = text;
  }

  function render() {
    const carrier = ((state.carrierState % 48) + 48) % 48;
    const lane = ((state.spectralLane % 8) + 8) % 8;
    const pair = ((state.pairStart % 7) + 7) % 7;
    const phase = Number.isFinite(state.phase) ? Math.max(0, Math.min(1, state.phase)) : carrier / 47;

    const projectionNodes = [...document.querySelectorAll("[data-pv-projection-nodes] .pv-node")];
    projectionNodes.forEach((node, index) => node.classList.toggle("hot", index === carrier % 4 || index === 4 + carrier % 2));
    setReadout("projection", `Carrier ${String(carrier).padStart(2, "0")} · candidate ${carrier % 4 + 1}/4 · return ${carrier % 2 + 1}/2`);

    const iharaNodes = [...document.querySelectorAll("[data-pv-ihara-nodes] .pv-node")];
    setHot(iharaNodes, lane);
    const iharaLabel = document.getElementById("pvIharaLane");
    if (iharaLabel) iharaLabel.textContent = `L${lane + 1}`;
    setReadout("ihara", `Lane ${lane + 1}/8 · cycle address retained · immediate backtrack excluded`);

    const tunnel = document.getElementById("pvTunnelCursor");
    if (tunnel) tunnel.setAttribute("transform", `translate(${145 + phase * 470} 0)`);
    const orientation = phase < 0.46 ? "IN" : phase > 0.54 ? "OUT" : "SEAM";
    setReadout("tunnel", `${orientation} · phase ${phase.toFixed(3)} · carrier ${String(carrier).padStart(2, "0")} · address retained`);

    const widths = {
      pvLedgerOuter: 130 + (carrier % 12) * 5,
      pvLedgerCycle: 75 + lane * 13,
      pvLedgerCore: 44 + (carrier % 4) * 12,
      pvLedgerReturn: 72 + pair * 15
    };
    Object.entries(widths).forEach(([id, width]) => document.getElementById(id)?.setAttribute("width", String(width)));
    setReadout("ledger", `outer 48 · lane ${lane + 1} · pair ${pair + 1}+${pair + 2} · return ${orientation.toLowerCase()}`);

    const angle = carrier / 48 * 360;
    document.getElementById("pvRatioNeedle")?.setAttribute("transform", `rotate(${angle} 0 0)`);
    setReadout("ratios", `carrier ${String(carrier).padStart(2, "0")} · radial phase ${angle.toFixed(1)}° · marker ${carrier % 5 + 1}/5`);

    const unified = document.getElementById("pvUnifiedCursor");
    if (unified) {
      const point = rotatePoint(116, phase * Math.PI * 2);
      unified.setAttribute("cx", String(point.x));
      unified.setAttribute("cy", String(point.y));
    }
    setReadout("unified", `Ramanujan bound PASS · Ihara lane ${lane + 1} · flow phase ${phase.toFixed(3)}`);

    const fibonacci = [32, 70, 122, 177];
    const fibRadius = fibonacci[carrier % fibonacci.length];
    const fibPoint = rotatePoint(fibRadius, -carrier * Math.PI * 2 / 5);
    const fibCursor = document.getElementById("pvFibCursor");
    if (fibCursor) {
      fibCursor.setAttribute("cx", String(fibPoint.x));
      fibCursor.setAttribute("cy", String(fibPoint.y));
    }
    setReadout("fibonacci", `schedule ${state.schedule.replace("_", " ")} · N=${state.sampleCount} · step ${carrier + 1}`);

    const samplingDots = [...document.querySelectorAll("#pvSamplingDots circle")];
    const scheduleIndex = ["UNIFORM", "FIBONACCI", "SEEDED_RANDOM"].indexOf(state.schedule);
    samplingDots.forEach((dot, index) => dot.setAttribute("opacity", index === scheduleIndex ? "1" : ".22"));
    setReadout("sampling", `${state.schedule.replace("_", " ")} · N=${state.sampleCount} · FROZEN R1 remains controlling`);

    window.A0TessarecPerspectiveDeckState = { ...state, orientation, activeViews: Object.fromEntries(decks.map((deck) => [deck.dataset.perspectiveDeck, deck.dataset.activePerspective])) };
  }

  window.addEventListener("a0:tessarec-tick", (event) => {
    Object.assign(state, event.detail || {});
    state.phase = Number.isFinite(event.detail?.phase) ? event.detail.phase : state.phase;
    render();
  });
  ["stateRange", "sliceRange", "e8PairRange", "fibSampleCount"].forEach((id) => {
    document.getElementById(id)?.addEventListener("input", syncFromControls);
  });
  document.querySelectorAll("[data-fib-schedule]").forEach((button) => button.addEventListener("click", () => window.setTimeout(syncFromControls, 0)));

  decks.forEach((deck) => activate(deck, deck.querySelector("[data-perspective-tab][aria-selected='true']")?.dataset.perspectiveTab || deck.querySelector("[data-perspective-tab]")?.dataset.perspectiveTab));
  syncFromControls();
  window.A0TessarecPerspectiveDeck = { activate, render, get state() { return { ...state }; } };
})();
