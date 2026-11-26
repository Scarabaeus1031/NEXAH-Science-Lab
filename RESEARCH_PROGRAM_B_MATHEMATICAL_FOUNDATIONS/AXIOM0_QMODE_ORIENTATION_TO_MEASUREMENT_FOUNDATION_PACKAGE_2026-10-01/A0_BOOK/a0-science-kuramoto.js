(() => {
  "use strict";

  const root = document.getElementById("kuramoto-phasenvergleich");
  if (!root) return;

  root.innerHTML = `<h3 id="kuramotoCompareTitle">Kuramoto · K=0, K=1 und K=2</h3>
<p>Alle drei Läufe starten mit denselben 64 Phasen und Eigenfrequenzen. Der Zeitregler markiert denselben Zustand im Phasenkreis, im Strip und im Grid.</p>
<div class="kuramoto-controls">
  <label for="kuramotoCompareTime">Zeit</label>
  <input id="kuramotoCompareTime" type="range" min="0" max="3999" value="3000" data-kuramoto-time aria-valuetext="150 Zeiteinheiten">
  <output for="kuramotoCompareTime" data-kuramoto-time-label>t = 150,00</output>
</div>
<div class="kuramoto-controls">
  <button type="button" aria-pressed="true" data-kuramoto-pair-toggle>Oszillator 5 und 19 vergleichen</button>
  <label for="kuramotoCompareOscillator">Einzeloszillator</label>
  <select id="kuramotoCompareOscillator" data-kuramoto-oscillator></select>
  <button type="button" data-kuramoto-most-drift="1">Größte Änderung bei K=1 auswählen</button>
  <button type="button" data-kuramoto-most-drift="2">Größte Änderung bei K=2 auswählen</button>
</div>
<div class="kuramoto-runs" data-kuramoto-runs></div>
<figure class="kuramoto-drift" data-kuramoto-single-trace hidden>
  <canvas width="720" height="230" role="img" aria-label="Abgewickelte relative Phase des ausgewählten Oszillators in allen drei Läufen" data-kuramoto-drift></canvas>
  <figcaption><strong data-kuramoto-drift-title></strong> · K=0 in Blau, K=1 in Gold, K=2 in Pink. Änderung jeweils über bis zu 50 Zeiteinheiten bis zum Reglerstand.</figcaption>
  <p data-kuramoto-drift-values></p>
</figure>
<div data-kuramoto-pair-traces>
  <p>Relative Phasenänderung ab t=100 in Radiant · Zeitfenster 100–150 · gemeinsame Skala. K=0 in Blau, K=1 in Gold, K=2 in Pink.</p>
  <div class="kuramoto-pair-traces">
    <figure class="kuramoto-drift"><strong class="kuramoto-osc-key" style="--osc-color:#c4fb81">Oszillator 5</strong>
      <canvas width="560" height="230" role="img" aria-label="Phasenänderung Oszillator 5 von 100 bis 150" data-kuramoto-pair-plot></canvas>
      <figcaption data-kuramoto-pair-values></figcaption>
    </figure>
    <figure class="kuramoto-drift"><strong class="kuramoto-osc-key" style="--osc-color:#caa8ff">Oszillator 19</strong>
      <canvas width="560" height="230" role="img" aria-label="Phasenänderung Oszillator 19 von 100 bis 150" data-kuramoto-pair-plot></canvas>
      <figcaption data-kuramoto-pair-values></figcaption>
    </figure>
  </div>
</div>
<p>Phasenabweichung im Grid: −π<span class="kuramoto-phase-scale" aria-hidden="true"></span>+π · Mitte = gleiche Phase wie der Mittelzeiger. Grün markiert Oszillator 5, Lila Oszillator 19. Ein Grid-Klick wechselt zur Einzelansicht der gewählten Zeile.</p>
<p>Modell wie in NEXAH Experiment 2 mit Euler-Schritt 0,05 und normalverteilten Eigenfrequenzen (σ = 0,5). Der Start ist reproduzierbar gesetzt. Die abgewickelte Zeitspur zeigt die Phase relativ zum Mittelzeiger in Radiant. <strong>Finding offen.</strong></p>
<template data-kuramoto-template>
  <article class="kuramoto-run">
    <h4 data-kuramoto-heading></h4>
    <dl><div><dt>R</dt><dd data-kuramoto-r></dd></div><div><dt>Ψ abgewickelt</dt><dd data-kuramoto-psi></dd></div></dl>
    <div class="kuramoto-views">
      <figure><canvas width="300" height="240" role="img" data-kuramoto-circle></canvas><figcaption>Phasenkreis · Mittelzeiger in Gold</figcaption></figure>
      <figure><canvas width="300" height="240" role="img" data-kuramoto-strip></canvas><figcaption>Strip · R waagerecht, Ψ in Radiant senkrecht</figcaption></figure>
      <figure class="kuramoto-grid-figure"><canvas width="640" height="128" role="img" data-kuramoto-grid></canvas><figcaption>Grid · Zeit waagerecht, weiß markiert den gewählten Zeitpunkt</figcaption></figure>
    </div>
  </article>
</template>`;

  const count = 64;
  const steps = 4000;
  const dt = 0.05;
  const turn = 2 * Math.PI;
  const pairFrom = 100 / dt;
  const pairTo = 150 / dt;
  const markers = [{ index: 4, color: "#c4fb81" }, { index: 18, color: "#caa8ff" }];
  // Fixed seed for the displayed sample. All runs reuse the generated arrays.
  let state = 20261126;
  function uniform() {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return (state + 0.5) / 2 ** 32;
  }

  const initial = Float64Array.from({ length: count }, () => turn * uniform());
  const frequencies = Float64Array.from({ length: count }, () =>
    0.5 * Math.sqrt(-2 * Math.log(uniform())) * Math.cos(turn * uniform()));

  function wrap(angle) {
    return angle - turn * Math.floor((angle + Math.PI) / turn);
  }

  function simulate(coupling) {
    const phases = initial.slice();
    const angles = new Float64Array(steps * count);
    const radius = new Float64Array(steps);
    const direction = new Float64Array(steps);
    const unwrapped = new Float64Array(steps);
    for (let sample = 0; sample < steps; sample += 1) {
      angles.set(phases, sample * count);
      let x = 0;
      let y = 0;
      for (const phase of phases) {
        x += Math.cos(phase);
        y += Math.sin(phase);
      }
      const r = Math.hypot(x, y) / count;
      const psi = Math.atan2(y, x);
      radius[sample] = r;
      direction[sample] = psi;
      unwrapped[sample] = sample ? unwrapped[sample - 1] + wrap(psi - direction[sample - 1]) : psi;
      for (let i = 0; i < count; i += 1) {
        phases[i] = wrap(phases[i] + dt * (frequencies[i] + coupling * r * Math.sin(psi - phases[i])));
      }
    }
    return { coupling, angles, radius, direction, unwrapped };
  }

  function segment(ctx, x0, y0, x1, y1, color) {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
  }

  function dot(ctx, x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, turn);
    ctx.fill();
  }

  function drawCircle(canvas, run, sample, selected) {
    const ctx = canvas.getContext("2d");
    const x = canvas.width / 2;
    const y = canvas.height / 2;
    const ring = 95;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    segment(ctx, x - ring, y, x + ring, y, "#2a4859");
    segment(ctx, x, y - ring, x, y + ring, "#2a4859");
    ctx.strokeStyle = "#557285";
    ctx.beginPath();
    ctx.arc(x, y, ring, 0, turn);
    ctx.stroke();
    for (let i = 0; i < count; i += 1) {
      const phase = run.angles[sample * count + i];
      dot(ctx, x + ring * Math.cos(phase), y - ring * Math.sin(phase), 2.6, "#7ee7f0");
    }
    const magnitude = ring * run.radius[sample];
    const direction = run.direction[sample];
    const tipX = x + magnitude * Math.cos(direction);
    const tipY = y - magnitude * Math.sin(direction);
    ctx.lineWidth = 2.5;
    segment(ctx, x, y, tipX, tipY, "#ffcd76");
    ctx.lineWidth = 1;
    dot(ctx, tipX, tipY, 4, "#ffcd76");
    for (const { index, color } of selected) {
      const phase = run.angles[sample * count + index];
      const selectedX = x + ring * Math.cos(phase);
      const selectedY = y - ring * Math.sin(phase);
      dot(ctx, selectedX, selectedY, 7, "#071522");
      dot(ctx, selectedX, selectedY, 5, color);
    }
  }

  function stripBackground(canvas, run, low, high) {
    const ctx = canvas.getContext("2d");
    const left = 44;
    const right = canvas.width - 12;
    const top = 16;
    const bottom = canvas.height - 28;
    const x = (r) => left + r * (right - left);
    const y = (psi) => bottom - (psi - low) * (bottom - top) / (high - low);
    for (const tick of [0, 0.5, 1]) {
      segment(ctx, x(tick), top, x(tick), bottom, "#2a4859");
      ctx.fillStyle = "#c2d4df";
      ctx.textAlign = "center";
      ctx.fillText(String(tick).replace(".", ","), x(tick), bottom + 15);
    }
    for (const tick of [low, (low + high) / 2, high]) {
      segment(ctx, left, y(tick), right, y(tick), "#2a4859");
      ctx.fillStyle = "#c2d4df";
      ctx.textAlign = "right";
      ctx.fillText(String(tick).replace(".", ","), left - 6, y(tick) + 3);
    }
    ctx.fillStyle = "#7ee7f0";
    ctx.globalAlpha = 0.32;
    for (let i = 0; i < steps; i += 1) ctx.fillRect(x(run.radius[i]), y(run.unwrapped[i]), 1.5, 1.5);
    ctx.globalAlpha = 1;
    const background = ctx.getImageData(0, 0, canvas.width, canvas.height);
    return (sample) => {
      ctx.putImageData(background, 0, 0);
      dot(ctx, x(run.radius[sample]), y(run.unwrapped[sample]), 4.5, "#ffcd76");
    };
  }

  function phaseColor(delta) {
    const mid = [246, 230, 162];
    const end = delta < 0 ? [42, 119, 190] : [203, 57, 127];
    const fraction = Math.abs(delta) / Math.PI;
    return mid.map((v, channel) => Math.round(v + fraction * (end[channel] - v)));
  }

  function gridBackground(canvas, run) {
    const ctx = canvas.getContext("2d");
    const { width, height } = canvas;
    const image = ctx.createImageData(width, height);
    const sampleAt = (x) => Math.round(x * (steps - 1) / (width - 1));
    function colorAt(sample, row) {
      return phaseColor(wrap(run.angles[sample * count + row] - run.direction[sample]));
    }
    for (let x = 0; x < width; x += 1) {
      const sample = sampleAt(x);
      for (let row = 0; row < count; row += 1) {
        const color = colorAt(sample, row);
        for (let pixel = 0; pixel < 2; pixel += 1) {
          image.data.set([...color, 255], 4 * ((2 * row + pixel) * width + x));
        }
      }
    }
    return (sample, activeRows) => {
      ctx.putImageData(image, 0, 0);
      const selected = Math.round(sample * (width - 1) / (steps - 1));
      ctx.fillStyle = "#fff";
      ctx.fillRect(Math.max(0, selected - 3), 0, 7, height);
      for (let row = 0; row < count; row += 1) {
        ctx.fillStyle = "rgb(" + colorAt(sample, row).join(",") + ")";
        ctx.fillRect(Math.max(0, selected - 1), 2 * row, 3, 2);
      }
      ctx.lineWidth = 1.5;
      for (const { index, color } of activeRows) {
        ctx.strokeStyle = color;
        ctx.strokeRect(0.75, 2 * index - 0.5, width - 1.5, 3);
      }
    };
  }

  function relativeTrajectories(run) {
    return Array.from({ length: count }, (_, oscillator) => {
      const phase = new Float64Array(steps);
      phase[0] = wrap(run.angles[oscillator] - run.direction[0]);
      for (let sample = 1; sample < steps; sample += 1) {
        const current = sample * count + oscillator;
        const oscillatorStep = wrap(run.angles[current] - run.angles[current - count]);
        const meanStep = run.unwrapped[sample] - run.unwrapped[sample - 1];
        phase[sample] = phase[sample - 1] + oscillatorStep - meanStep;
      }
      return phase;
    });
  }

  function phaseBounds(traces) {
    const low = Math.floor(Math.min(0, ...traces.map(trace => Math.min(...trace))));
    const high = Math.max(low + 1, Math.ceil(Math.max(0, ...traces.map(trace => Math.max(...trace)))));
    return { low, high };
  }

  function drawDrift(canvas, traces, sample, { from, to, low, high, ticks }) {
    const ctx = canvas.getContext("2d");
    const left = 47, right = canvas.width - 23, top = 12, bottom = canvas.height - 28;
    const x = i => left + i * (right - left) / (to - from);
    const y = phase => bottom - (phase - low) * (bottom - top) / (high - low);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "12px system-ui";
    for (const tick of new Set([low, 0, high])) {
      segment(ctx, left, y(tick), right, y(tick), "#2a4859");
      ctx.textAlign = "right";
      ctx.fillStyle = "#c2d4df";
      ctx.fillText(String(tick), left - 7, y(tick) + 4);
    }
    for (const time of ticks) {
      ctx.textAlign = "center";
      ctx.fillStyle = "#c2d4df";
      ctx.fillText(String(time).replace(".", ","), x(Math.round(time / dt) - from), bottom + 18);
    }
    const visible = sample >= from && sample <= to;
    const cursor = sample - from;
    if (visible) segment(ctx, x(cursor), top, x(cursor), bottom, "#fff");
    const colors = ["#7ee7f0", "#ffcd76", "#ff83ba"];
    traces.forEach((trace, i) => {
      ctx.strokeStyle = colors[i];
      ctx.beginPath();
      ctx.moveTo(x(0), y(trace[0]));
      for (let step = 1; step < trace.length; step += 1) ctx.lineTo(x(step), y(trace[step]));
      ctx.stroke();
      if (visible) dot(ctx, x(cursor), y(trace[cursor]), 4, colors[i]);
    });
  }

  const runs = [0, 1, 2].map(simulate);
  const phaseHistories = runs.map(relativeTrajectories);
  const pairHistories = markers.map(({ index }) => phaseHistories.map(history => {
    const trace = history[index];
    return trace.slice(pairFrom, pairTo + 1).map(value => value - trace[pairFrom]);
  }));
  const pairScale = { from: pairFrom, to: pairTo, ticks: [100, 125, 150], ...phaseBounds(pairHistories.flat()) };
  const low = Math.floor(Math.min(...runs.map(run => Math.min(...run.unwrapped))));
  const high = Math.ceil(Math.max(...runs.map(run => Math.max(...run.unwrapped))));
  const template = root.querySelector("[data-kuramoto-template]");
  const container = root.querySelector("[data-kuramoto-runs]");
  const slider = root.querySelector("[data-kuramoto-time]");
  const output = root.querySelector("[data-kuramoto-time-label]");
  const oscillator = root.querySelector("[data-kuramoto-oscillator]");
  const driftButtons = [...root.querySelectorAll("[data-kuramoto-most-drift]")];
  const pairToggle = root.querySelector("[data-kuramoto-pair-toggle]");
  const pairPanel = root.querySelector("[data-kuramoto-pair-traces]");
  const pairPlots = [...pairPanel.querySelectorAll("[data-kuramoto-pair-plot]")];
  const pairValues = [...pairPanel.querySelectorAll("[data-kuramoto-pair-values]")];
  const singlePanel = root.querySelector("[data-kuramoto-single-trace]");
  const driftChart = root.querySelector("[data-kuramoto-drift]");
  const driftTitle = root.querySelector("[data-kuramoto-drift-title]");
  const driftValues = root.querySelector("[data-kuramoto-drift-values]");
  for (let i = 1; i <= count; i += 1) oscillator.add(new Option(String(i), String(i - 1)));
  const values = new Intl.NumberFormat("de-DE", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
  const timeFormat = new Intl.NumberFormat("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const renders = runs.map((run) => {
    const card = template.content.firstElementChild.cloneNode(true);
    const node = (key) => card.querySelector("[data-kuramoto-" + key + "]");
    node("heading").textContent = "K = " + run.coupling;
    for (const [key, title] of [["circle", "Phasenkreis"], ["strip", "Strip"], ["grid", "Phasenabweichung je Oszillator"]]) {
      node(key).setAttribute("aria-label", title + " bei K = " + run.coupling);
    }
    const circle = node("circle");
    const strip = stripBackground(node("strip"), run, low, high);
    const gridCanvas = node("grid");
    const grid = gridBackground(gridCanvas, run);
    gridCanvas.addEventListener("click", (event) => {
      const rect = gridCanvas.getBoundingClientRect();
      const row = Math.floor((event.clientY - rect.top) * count / rect.height);
      oscillator.value = String(Math.min(count - 1, Math.max(0, row)));
      showSingle();
    });
    container.append(card);
    return (sample, selected) => {
      node("r").textContent = values.format(run.radius[sample]);
      node("psi").textContent = values.format(run.unwrapped[sample]) + " rad";
      drawCircle(circle, run, sample, selected);
      strip(sample);
      grid(sample, selected);
    };
  });

  function render() {
    const sample = Number(slider.value);
    const time = timeFormat.format(sample * dt);
    output.textContent = "t = " + time;
    slider.setAttribute("aria-valuetext", time + " Zeiteinheiten");
    const selected = Number(oscillator.value);
    const isPair = pairToggle.getAttribute("aria-pressed") === "true";
    pairPanel.hidden = !isPair;
    singlePanel.hidden = isPair;
    renders.forEach(draw => draw(sample, isPair ? markers : [{ index: selected, color: "#c4fb81" }]));
    const from = Math.max(0, sample - 1000);
    const displayResolution = 0.0005;
    const formatChange = change => values.format(Math.abs(change) < displayResolution ? 0 : change) + " rad";
    if (isPair) {
      pairPlots.forEach((plot, index) => {
        const traces = pairHistories[index];
        drawDrift(plot, traces, sample, pairScale);
        pairValues[index].textContent = traces.map((trace, i) => {
          const span = Math.max(...trace) - Math.min(...trace);
          return "K=" + runs[i].coupling + " · Δ " + formatChange(trace.at(-1)) + " · Spanne " + formatChange(span);
        }).join(" | ");
      });
    } else {
      const traces = phaseHistories.map(history => history[selected]);
      drawDrift(driftChart, traces, sample, {
        from: 0, to: steps - 1, ticks: [0, 50, 100, 150, 199.95], ...phaseBounds(traces)
      });
      driftTitle.textContent = "Oszillator " + (selected + 1) + " · relative Phase";
      driftValues.textContent = traces.map((trace, index) =>
        "Δ bei K=" + runs[index].coupling + ": " + formatChange(trace[sample] - trace[from])).join(" · ");
    }
    for (const button of driftButtons) {
      const coupling = Number(button.dataset.kuramotoMostDrift);
      const history = phaseHistories[coupling];
      let largest = 0;
      let magnitude = 0;
      for (const [index, phase] of history.entries()) {
        const change = Math.abs(phase[sample] - phase[from]);
        if (change > magnitude) {
          largest = index;
          magnitude = change;
        }
      }
      button.value = String(largest);
      button.disabled = magnitude < displayResolution;
      button.textContent = button.disabled
        ? "K=" + coupling + " · alle Änderungen runden auf 0,000 rad"
        : "Größte Änderung bei K=" + coupling + " → Oszillator " + (largest + 1);
    }
  }

  function showSingle() {
    pairToggle.setAttribute("aria-pressed", "false");
    render();
  }

  slider.addEventListener("input", render);
  oscillator.addEventListener("change", showSingle);
  pairToggle.addEventListener("click", () => {
    const enabled = pairToggle.getAttribute("aria-pressed") === "true";
    pairToggle.setAttribute("aria-pressed", String(!enabled));
    render();
  });
  for (const button of driftButtons) {
    button.addEventListener("click", () => {
      oscillator.value = button.value;
      showSingle();
    });
  }
  render();
})();
