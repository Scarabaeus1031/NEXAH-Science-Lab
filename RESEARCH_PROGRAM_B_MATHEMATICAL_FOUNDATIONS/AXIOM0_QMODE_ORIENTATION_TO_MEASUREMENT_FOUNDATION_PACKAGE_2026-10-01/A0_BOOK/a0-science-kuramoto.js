(() => {
  "use strict";

  const root = document.getElementById("kuramoto-phasenvergleich");
  if (!root) return;

  root.innerHTML = `<header class="kuramoto-workshop-head">
  <h2 id="kuramotoCompareTitle">A0 · Phasenwerkstatt</h2>
  <nav aria-label="Ansichten der Phasenwerkstatt">
    <a href="#kuramoto-schwebung">Zwei Zeiger</a>
    <a href="#kuramoto-stabilitaet">64 Oszillatoren</a>
    <a href="#helix-jupiter-phases">Jupitermonde</a>
  </nav>
</header>
<section id="kuramoto-schwebung" class="kuramoto-beat" aria-labelledby="kuramotoBeatTitle">
  <h3 id="kuramotoBeatTitle">Schwebung, Bindung und Rückkehr</h3>
  <p>Starte die zwei Zeiger frei, schalte dann die Kopplung ein und gib Zeiger B einen kurzen Winkelschub.</p>
  <div class="kuramoto-beat-layout">
    <div class="kuramoto-beat-console">
      <h4>Rad und Steuerung</h4>
  <div class="kuramoto-controls" aria-label="Zwei Oszillatoren steuern">
    <button type="button" data-beat-play>▶ Play</button>
    <button type="button" data-beat-couple aria-pressed="false">Kopplung aus · K = 0</button>
    <button type="button" data-beat-kick>Störung B · +0,25 rad</button>
    <button type="button" data-beat-reset>Zurücksetzen</button>
  </div>
    <figure>
      <svg viewBox="0 0 200 165" role="img" aria-label="Zwei Zeiger auf einem gemeinsamen Phasenkreis">
        <circle cx="100" cy="80" r="64"/><path d="M36 80h128M100 16v128"/>
        <line class="kuramoto-beat-a" x1="100" y1="80" data-beat-hand-a/>
        <line class="kuramoto-beat-b" x1="100" y1="80" data-beat-hand-b/>
      </svg>
      <figcaption><span class="kuramoto-beat-a">Zeiger A</span> · <span class="kuramoto-beat-b">Zeiger B</span></figcaption>
      <dl><div><dt>Zeit</dt><dd data-beat-time></dd></div>
        <div><dt>Abstand im Lift</dt><dd data-beat-lift></dd></div>
        <div><dt>Gebundener Abstand</dt><dd data-beat-target></dd></div></dl>
      <p role="status" data-beat-status></p>
    </figure>
    </div>
    <div class="kuramoto-beat-plots">
      <figure><h4>Schwebung</h4><canvas width="720" height="150" role="img" aria-label="Summensignal und Hüllkurve der Schwebung" data-beat-envelope></canvas>
        <figcaption>Blau zeigt das Summensignal. Gold zeigt die Hüllkurve · H = 2 |cos((φ<sub>B</sub> − φ<sub>A</sub>)/2)|.</figcaption></figure>
      <figure><h4>Phasenabstand im Lift</h4>
        <div class="kuramoto-beat-lift">
          <canvas width="720" height="150" role="img" aria-label="Abgewickelter Phasenabstand im Lift" data-beat-history></canvas>
          <svg viewBox="0 0 720 150" role="group" aria-label="Ereignismarken im Lift" data-beat-markers></svg>
        </div>
        <figcaption>Pink zeigt den Phasenabstand im Lift. Klick auf eine Marke, um beide Zeiger an diesem Zeitpunkt anzusehen.</figcaption>
      </figure>
    </div>
  </div>
  <h4 id="kuramotoBeatEventsTitle">Ereignisse im Lift</h4>
        <div class="kuramoto-beat-events" role="group" aria-labelledby="kuramotoBeatEventsTitle">
          <button type="button" data-beat-event="couple" disabled>Kopplung an</button>
          <button type="button" data-beat-event="kick" disabled>Störung</button>
          <button type="button" data-beat-event="return" disabled>Wieder gebunden</button>
          <button type="button" data-beat-latest hidden>Zum aktuellen Lauf</button>
        </div>
  <p>Modell mit zwei Kuramoto-Oszillatoren · Δω = 1,5 rad/s. Bei K = 3 rad/s nähert sich der Phasenabstand 0,524 rad modulo 2π.</p>
</section>
<h3>Kuramoto · 64 Oszillatoren</h3>
<p>Die Läufe für K = 0, 1 und 2 starten mit denselben Phasen und Eigenfrequenzen. Der gemeinsame Zeitregler führt durch Phasenkreis, Strip und Grid.</p>
<div class="kuramoto-controls">
  <label for="kuramotoCompareTime">Zeit</label>
  <input id="kuramotoCompareTime" type="range" min="0" max="3999" value="3000" data-kuramoto-time aria-valuetext="150 Zeiteinheiten">
  <output for="kuramotoCompareTime" data-kuramoto-time-label>t = 150,00</output>
</div>
<section id="kuramoto-stabilitaet" class="kuramoto-stability" aria-labelledby="kuramotoStabilityTitle">
  <h4 id="kuramotoStabilityTitle">Kleine Störung im Startwinkel</h4>
  <p>Ein zweiter Lauf erhält je K dieselben Eigenfrequenzen und Startphasen bis auf den gewählten Oszillator. Die Kurven zeigen den RMS‑Phasenabstand der beiden Läufe nach Ausrichtung ihrer gemeinsamen Drehung.</p>
  <div class="kuramoto-controls">
    <label for="kuramotoPerturbedOsc">Oszillator</label>
    <select id="kuramotoPerturbedOsc" data-kuramoto-perturbed-osc></select>
    <label for="kuramotoPerturbation">Startwinkel verschieben</label>
    <select id="kuramotoPerturbation" data-kuramoto-perturbation>
      <option value="0">0 rad</option><option value="0.01">+0,01 rad</option><option value="0.05">+0,05 rad</option>
      <option value="0.1" selected>+0,10 rad</option><option value="0.2">+0,20 rad</option>
    </select>
  </div>
  <div class="kuramoto-stability-grid">
    <div class="kuramoto-stability-charts">
      <figure class="kuramoto-drift">
        <canvas width="720" height="230" role="img" aria-label="Abstand der relativen Phasen bei K gleich 0, 1 und 2 auf derselben Zeit- und Radiantskala" data-kuramoto-stability-plot></canvas>
        <figcaption>Klick auf eine Kurve, um Lauf und Zeit auszuwählen. Die weiße Linie zeigt den Zeitregler.</figcaption>
      </figure>
      <figure class="kuramoto-drift" data-kuramoto-oscillator-detail hidden>
        <figcaption data-kuramoto-oscillator-title></figcaption>
        <canvas width="720" height="180" role="img" data-kuramoto-oscillator-trace></canvas>
        <output data-kuramoto-oscillator-readout></output>
      </figure>
    </div>
    <figure class="kuramoto-drift kuramoto-stability-circle">
      <div class="kuramoto-controls">
        <label for="kuramotoStabilityRun">Phasenkreis</label>
        <select id="kuramotoStabilityRun" data-kuramoto-stability-run>
          <option value="0">K = 0</option><option value="1" selected>K = 1</option><option value="2">K = 2</option>
        </select>
      </div>
      <canvas width="300" height="240" role="img" aria-label="Phasenkreis des Störungsvergleichs" data-kuramoto-stability-circle></canvas>
      <figcaption>Innen Referenz, außen gestörter Lauf nach Phasenausrichtung. Klick auf einen Punkt oder Namen für seine Abweichungskurve. Farbige Bögen markieren die stärksten Abweichungen.</figcaption>
      <ol data-kuramoto-stability-ranked aria-label="Oszillatoren mit den größten Phasenabweichungen"></ol>
    </figure>
  </div>
  <table class="kuramoto-stability-values">
    <thead><tr><th scope="col">K</th><th scope="col">Start (rad)</th><th scope="col" data-kuramoto-stability-time>Bei t = 150,00 (rad)</th></tr></thead>
    <tbody data-kuramoto-stability-values></tbody>
  </table>
</section>
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

  function simulate(coupling, perturbedOscillator = 0, offset = 0) {
    const phases = initial.slice();
    phases[perturbedOscillator] += offset;
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

  function driftFrame(canvas, { from, to, low, high }) {
    const left = 47, right = canvas.width - 23, top = 12, bottom = canvas.height - 28;
    const x = i => left + i * (right - left) / (to - from);
    const y = phase => bottom - (phase - low) * (bottom - top) / (high - low);
    return { left, right, top, bottom, x, y };
  }

  function drawDrift(canvas, traces, sample, scale, selectedTrace = -1) {
    const { from, to, low, high, ticks, verticalTicks = [low, 0, high], colors = ["#7ee7f0", "#ffcd76", "#ff83ba"], phaseWrap = false } = scale;
    const ctx = canvas.getContext("2d");
    const { left, right, top, bottom, x, y } = driftFrame(canvas, scale);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "12px system-ui";
    for (const tick of new Set(verticalTicks)) {
      segment(ctx, left, y(tick), right, y(tick), "#2a4859");
      ctx.textAlign = "right";
      ctx.fillStyle = "#c2d4df";
      ctx.fillText(String(tick).replace(".", ","), left - 7, y(tick) + 4);
    }
    for (const time of ticks) {
      ctx.textAlign = "center";
      ctx.fillStyle = "#c2d4df";
      ctx.fillText(String(time).replace(".", ","), x(Math.round(time / dt) - from), bottom + 18);
    }
    const visible = sample >= from && sample <= to;
    const cursor = sample - from;
    if (visible) segment(ctx, x(cursor), top, x(cursor), bottom, "#fff");
    traces.forEach((trace, i) => {
      ctx.strokeStyle = colors[i];
      ctx.lineWidth = i === selectedTrace ? 2.5 : 1;
      ctx.beginPath();
      ctx.moveTo(x(0), y(trace[0]));
      for (let step = 1; step < trace.length; step += 1) {
        if (phaseWrap && Math.abs(trace[step] - trace[step - 1]) > Math.PI) ctx.moveTo(x(step), y(trace[step]));
        else ctx.lineTo(x(step), y(trace[step]));
      }
      ctx.stroke();
      if (visible) dot(ctx, x(cursor), y(trace[cursor]), 4, colors[i]);
    });
    ctx.lineWidth = 1;
  }

  function alignedDifferences(reference, perturbed, sample, differences) {
    const start = sample * count;
    let x = 0;
    let y = 0;
    for (let i = 0; i < count; i += 1) {
      const delta = perturbed.angles[start + i] - reference.angles[start + i];
      differences[i] = delta;
      x += Math.cos(delta);
      y += Math.sin(delta);
    }
    const rotation = Math.atan2(y, x);
    for (let i = 0; i < count; i += 1) differences[i] = wrap(differences[i] - rotation);
  }

  function relativePhaseDistance(reference, perturbed) {
    const differences = new Float64Array(count);
    return Float64Array.from({ length: steps }, (_, sample) => {
      alignedDifferences(reference, perturbed, sample, differences);
      let squared = 0;
      for (const delta of differences) squared += delta ** 2;
      return Math.sqrt(squared / count);
    });
  }

  const runs = [0, 1, 2].map(coupling => simulate(coupling));
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
  const perturbedOscillator = root.querySelector("[data-kuramoto-perturbed-osc]");
  const perturbation = root.querySelector("[data-kuramoto-perturbation]");
  const stabilityPlot = root.querySelector("[data-kuramoto-stability-plot]");
  const stabilityTime = root.querySelector("[data-kuramoto-stability-time]");
  const stabilityValues = root.querySelector("[data-kuramoto-stability-values]");
  const stabilityRun = root.querySelector("[data-kuramoto-stability-run]");
  const stabilityCircle = root.querySelector("[data-kuramoto-stability-circle]");
  const stabilityRanked = root.querySelector("[data-kuramoto-stability-ranked]");
  const oscillatorDetail = root.querySelector("[data-kuramoto-oscillator-detail]");
  const oscillatorTitle = root.querySelector("[data-kuramoto-oscillator-title]");
  const oscillatorTrace = root.querySelector("[data-kuramoto-oscillator-trace]");
  const oscillatorReadout = root.querySelector("[data-kuramoto-oscillator-readout]");
  let inspectedOscillator = null;
  let traceCache = null;
  let circleTargets = [];
  const rankColors = ["#ffcd76", "#ff83ba", "#c4fb81", "#caa8ff", "#7ee7f0"];
  const stabilityColors = ["#7ee7f0", "#ffcd76", "#ff83ba"];
  const stabilityFormat = new Intl.NumberFormat("de-DE", { minimumFractionDigits: 6, maximumFractionDigits: 6 });
  for (let i = 0; i < count; i += 1) perturbedOscillator.add(new Option(String(i + 1), String(i)));
  perturbedOscillator.value = String(markers[0].index);
  let perturbedRuns;
  let stabilityTraces;
  let stabilityScale;

  function computeStability() {
    traceCache = null;
    const selected = Number(perturbedOscillator.value);
    const offset = Number(perturbation.value);
    perturbedRuns = runs.map(run => offset === 0 ? run : simulate(run.coupling, selected, offset));
    stabilityTraces = runs.map((run, index) => relativePhaseDistance(run, perturbedRuns[index]));
    const maximum = Math.max(...stabilityTraces.map(trace => Math.max(...trace)));
    const increment = 10 ** Math.floor(Math.log10(maximum || 0.01));
    const high = Number(((maximum ? Math.ceil(maximum / increment) : 1) * increment).toPrecision(6));
    stabilityScale = { from: 0, to: steps - 1, low: 0, high, ticks: [0, 50, 100, 150, 199.95] };
  }

  function drawStabilityCircle(sample, selectedRun) {
    const run = runs[selectedRun];
    const differences = new Float64Array(count);
    alignedDifferences(run, perturbedRuns[selectedRun], sample, differences);
    const ranked = Array.from(differences, (delta, index) => ({ delta, index }))
      .filter(({ delta }) => Math.abs(delta) >= 0.0000005)
      .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta)).slice(0, 5);

    const ctx = stabilityCircle.getContext("2d");
    const cx = stabilityCircle.width / 2;
    const cy = stabilityCircle.height / 2;
    const point = (radius, phase) => [cx + radius * Math.cos(phase), cy - radius * Math.sin(phase)];
    ctx.clearRect(0, 0, stabilityCircle.width, stabilityCircle.height);
    for (const radius of [82, 102]) {
      ctx.strokeStyle = "#557285";
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, turn);
      ctx.stroke();
    }
    circleTargets = [];
    differences.forEach((delta, i) => {
      const reference = run.angles[sample * count + i];
      const refPoint = point(82, reference);
      const perturbedPoint = point(102, reference + delta);
      circleTargets.push({ index: i, points: [refPoint, perturbedPoint] });
      dot(ctx, ...refPoint, 2, "#97a9b9");
      dot(ctx, ...perturbedPoint, 2, "#7ee7f0");
    });
    ranked.forEach(({ delta, index }, rank) => {
      const reference = run.angles[sample * count + index];
      const perturbed = reference + delta;
      const color = rankColors[rank];
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, 92, -reference, -perturbed, delta > 0);
      ctx.stroke();
      segment(ctx, ...point(82, reference), ...point(92, reference), color);
      segment(ctx, ...point(92, perturbed), ...point(102, perturbed), color);
      dot(ctx, ...point(82, reference), 3.5, color);
      dot(ctx, ...point(102, perturbed), 4, color);
    });
    if (inspectedOscillator !== null) {
      for (const [x, y] of circleTargets[inspectedOscillator].points) {
        ctx.strokeStyle = "#f5f8ff";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(x, y, 7, 0, turn);
        ctx.stroke();
      }
    }
    ctx.lineWidth = 1;
    stabilityCircle.setAttribute("aria-label", "Referenz und gestörter Lauf bei K = " + selectedRun + " und t = " + timeFormat.format(sample * dt));
    stabilityRanked.innerHTML = ranked.length ? ranked.map(({ delta, index }, rank) => `
      <li data-kuramoto-diverging-oscillator="${index + 1}"><button type="button" data-kuramoto-inspect="${index}"
        aria-pressed="${index === inspectedOscillator}" style="color:${rankColors[rank]}">Oszillator ${index + 1}</button> · ${delta > 0 ? "+" : ""}${stabilityFormat.format(delta)} rad</li>`).join("")
      : "<li>Alle Abweichungen runden auf 0 rad.</li>";
  }

  function renderOscillatorTrace(sample, selectedRun) {
    if (inspectedOscillator === null) return;
    if (traceCache?.index !== inspectedOscillator || traceCache?.run !== selectedRun) {
      const differences = new Float64Array(count);
      const values = Float64Array.from({ length: steps }, (_, index) => {
        alignedDifferences(runs[selectedRun], perturbedRuns[selectedRun], index, differences);
        return differences[inspectedOscillator];
      });
      const limit = Math.max(0.01, Math.ceil(Math.max(...values, -Math.min(...values)) * 100) / 100);
      traceCache = { values, index: inspectedOscillator, run: selectedRun, limit };
    }
    const { values, limit } = traceCache;
    const title = `Oszillator ${inspectedOscillator + 1} · K = ${selectedRun} · Winkelabweichung (rad, −π bis +π)`;
    oscillatorDetail.hidden = false;
    oscillatorTitle.textContent = title;
    oscillatorTrace.setAttribute("aria-label", title);
    drawDrift(oscillatorTrace, [values], sample, { ...stabilityScale, low: -limit, high: limit, colors: ["#ffb5db"], phaseWrap: true }, 0);
    const delta = values[sample];
    oscillatorReadout.textContent = `t = ${timeFormat.format(sample * dt)} · Δ ${delta >= 0.0000005 ? "+" : ""}${stabilityFormat.format(delta)} rad`;
  }

  function renderStability(sample) {
    const selectedRun = Number(stabilityRun.value);
    drawDrift(stabilityPlot, stabilityTraces, sample, stabilityScale, selectedRun);
    drawStabilityCircle(sample, selectedRun);
    renderOscillatorTrace(sample, selectedRun);
    stabilityTime.textContent = "Bei t = " + timeFormat.format(sample * dt) + " (rad)";
    stabilityValues.innerHTML = stabilityTraces.map((trace, index) => `
      <tr data-kuramoto-stability-k="${runs[index].coupling}">
        <th scope="row" style="color:${stabilityColors[index]}">K = ${runs[index].coupling}</th>
        <td>${stabilityFormat.format(trace[0])}</td>
        <td>${stabilityFormat.format(trace[sample])}</td>
      </tr>`).join("");
  }

  computeStability();
  for (const control of [perturbedOscillator, perturbation]) {
    control.addEventListener("change", () => {
      computeStability();
      renderStability(Number(slider.value));
    });
  }

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
    renderStability(sample);
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

  stabilityPlot.addEventListener("click", event => {
    const bounds = stabilityPlot.getBoundingClientRect();
    const px = (event.clientX - bounds.left) * stabilityPlot.width / bounds.width;
    const py = (event.clientY - bounds.top) * stabilityPlot.height / bounds.height;
    const { left, right, top, bottom, y } = driftFrame(stabilityPlot, stabilityScale);
    if (px < left || px > right || py < top || py > bottom) return;
    const sample = Math.round((px - left) * (steps - 1) / (right - left));
    let selected = Number(stabilityRun.value);
    let nearest = Math.abs(py - y(stabilityTraces[selected][sample]));
    stabilityTraces.forEach((trace, index) => {
      const distance = Math.abs(py - y(trace[sample]));
      if (distance < nearest) {
        selected = index;
        nearest = distance;
      }
    });
    stabilityRun.value = String(selected);
    slider.value = String(sample);
    render();
  });
  function inspectOscillator(index) {
    inspectedOscillator = index;
    renderStability(Number(slider.value));
  }

  stabilityCircle.addEventListener("click", event => {
    const bounds = stabilityCircle.getBoundingClientRect();
    const x = (event.clientX - bounds.left) * stabilityCircle.width / bounds.width;
    const y = (event.clientY - bounds.top) * stabilityCircle.height / bounds.height;
    let nearest = null;
    let distance = 9;
    for (const { index, points } of circleTargets) {
      for (const [px, py] of points) {
        const difference = Math.hypot(x - px, y - py);
        if (difference < distance) {
          nearest = index;
          distance = difference;
        }
      }
    }
    if (nearest !== null) inspectOscillator(nearest);
  });
  stabilityRanked.addEventListener("click", event => {
    const target = event.target.closest("[data-kuramoto-inspect]");
    if (!target) return;
    inspectOscillator(Number(target.dataset.kuramotoInspect));
    stabilityRanked.querySelector(`[data-kuramoto-inspect="${target.dataset.kuramotoInspect}"]`)?.focus({ preventScroll: true });
  });
  stabilityRun.addEventListener("change", () => renderStability(Number(slider.value)));
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
  mountBeat();

  function mountBeat() {
    const panel = root.querySelector("#kuramoto-schwebung");
    const node = name => panel.querySelector("[data-beat-" + name + "]");
    const play = node("play"), couple = node("couple"), kick = node("kick");
    const status = node("status"), lift = node("lift"), target = node("target"), time = node("time");
    const hands = [node("hand-a"), node("hand-b")];
    const envelopePlot = node("envelope"), liftPlot = node("history");
    const markers = node("markers"), latest = node("latest");
    const eventStyles = [
      { id: "couple", label: "Kopplung an", color: "#7ee7f0" },
      { id: "kick", label: "Störung", color: "#ffcd76" },
      { id: "return", label: "Wieder gebunden", color: "#c4fb81" }
    ];
    markers.innerHTML = eventStyles.map(({ id, color }) => `
      <circle class="kuramoto-beat-marker" data-beat-marker="${id}" fill="${color}" role="button" tabindex="0" style="display:none"/>
    `).join("");
    for (const event of eventStyles) {
      event.button = panel.querySelector(`[data-beat-event="${event.id}"]`);
      event.marker = markers.querySelector(`[data-beat-marker="${event.id}"]`);
    }
    const detuning = 1.5;
    const strength = 3;
    const rate = turn * 0.8;
    const boundAngle = Math.asin(detuning / strength);
    const tolerance = 0.02;
    let phaseDifference = 0;
    let centerPhase = 0;
    let elapsed = 0;
    let lockedAt = null;
    let kickApplied = false;
    let frame = null;
    let lastFrame = null;
    const events = {};
    let inspected = null;
    let history = [];
    let liftHistory = [];
    let liftInterval = 0.05;

    function snapshot() {
      return { time: elapsed, lift: phaseDifference, center: centerPhase, target: lockedAt };
    }

    function record(force = false) {
      const envelope = 2 * Math.abs(Math.cos(phaseDifference / 2));
      const signal = 2 * Math.cos(centerPhase) * Math.cos(phaseDifference / 2);
      const entry = { ...snapshot(), envelope, lower: -envelope, signal };
      history.push(entry);
      while (history.length > 1 && history[1].time < elapsed - 16) history.shift();
      if (force || !liftHistory.length || elapsed - liftHistory.at(-1).time >= liftInterval) liftHistory.push(entry);
      if (liftHistory.length > 1600) {
        liftHistory = liftHistory.filter((_, index) => index % 2 === 0);
        liftInterval *= 2;
      }
    }

    function plot(canvas, series, low, high, { samples = history, from = Math.max(0, elapsed - 16), reference = null, cursor = null } = {}) {
      const ctx = canvas.getContext("2d");
      const left = 54, right = canvas.width - 20, top = 14, bottom = canvas.height - 26;
      const to = Math.max(8, elapsed);
      const x = t => left + (right - left) * (t - from) / (to - from);
      const y = value => bottom - (bottom - top) * (value - low) / (high - low);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = "12px system-ui";
      ctx.fillStyle = "#c2d4df";
      ctx.textAlign = "right";
      for (const tick of [low, (high + low) / 2, high]) {
        segment(ctx, left, y(tick), right, y(tick), "#2a4859");
        ctx.fillText(timeFormat.format(tick), left - 7, y(tick) + 4);
      }
      ctx.textAlign = "center";
      for (const tick of [from, (from + to) / 2, to]) ctx.fillText(timeFormat.format(tick) + " s", x(tick), bottom + 18);
      if (reference !== null) {
        ctx.setLineDash([5, 4]);
        segment(ctx, left, y(reference), right, y(reference), "#a8b6c7");
        ctx.setLineDash([]);
      }
      ctx.save();
      ctx.beginPath();
      ctx.rect(left, top, right - left, bottom - top);
      ctx.clip();
      for (const [key, color] of series) {
        ctx.strokeStyle = color;
        ctx.beginPath();
        samples.forEach((entry, i) => {
          if (i === 0) ctx.moveTo(x(entry.time), y(entry[key]));
          else ctx.lineTo(x(entry.time), y(entry[key]));
        });
        ctx.stroke();
        const current = cursor ?? samples.at(-1);
        dot(ctx, x(current.time), y(current[key]), 3, color);
      }
      if (cursor) {
        ctx.setLineDash([2, 4]);
        segment(ctx, x(cursor.time), top, x(cursor.time), bottom, "#e7eff7");
        ctx.setLineDash([]);
      }
      ctx.restore();
      return { x, y };
    }

    function draw() {
      const view = events[inspected] ?? snapshot();
      [view.center - view.lift / 2, view.center + view.lift / 2].forEach((angle, i) => {
        const radius = i === 0 ? 58 : 64;
        hands[i].setAttribute("x2", 100 + radius * Math.cos(angle));
        hands[i].setAttribute("y2", 80 - radius * Math.sin(angle));
      });
      time.textContent = timeFormat.format(view.time) + " s";
      lift.textContent = values.format(view.lift) + " rad";
      target.textContent = view.target === null ? "–" : values.format(view.target) + " rad";
      const bound = lockedAt !== null && Math.abs(phaseDifference - lockedAt) < tolerance;
      const eventLabel = eventStyles.find(event => event.id === inspected)?.label;
      const message = eventLabel ? "Gespeicherter Zeitpunkt · " + eventLabel : lockedAt === null ? "Freier Lauf · der Abstand driftet."
        : bound ? (kickApplied ? "Nach der Störung zurück im gebundenen Abstand." : "Phasenabstand gebunden.")
        : (kickApplied ? "Die Störung klingt ab." : "Der Abstand nähert sich der Bindung.");
      if (status.textContent !== message) status.textContent = message;

      const samples = [...liftHistory, history.at(-1)];
      let low = view.target ?? view.lift;
      let high = low;
      for (const entry of [...samples, ...Object.values(events)]) {
        low = Math.min(low, entry.lift);
        high = Math.max(high, entry.lift);
      }
      const padding = Math.max(0.15, (high - low) * 0.08);
      plot(envelopePlot, [["signal", "#7ee7f0"], ["envelope", "#ffcd76"], ["lower", "#ffcd76"]], -2.2, 2.2);
      const { x, y } = plot(liftPlot, [["lift", "#ff83ba"]], low - padding, high + padding, {
        samples, from: 0, reference: view.target, cursor: view
      });
      for (const { id, label, button, marker } of eventStyles) {
        const entry = events[id];
        const selected = inspected === id;
        const caption = entry ? `${label} · ${timeFormat.format(entry.time)} s` : label;
        button.disabled = !entry;
        button.setAttribute("aria-pressed", String(selected));
        if (button.textContent !== caption) button.textContent = caption;
        marker.style.display = entry ? "" : "none";
        if (entry) {
          marker.setAttribute("cx", x(entry.time));
          marker.setAttribute("cy", y(entry.lift));
          marker.setAttribute("r", selected ? 7 : 5);
          marker.setAttribute("aria-pressed", String(selected));
          marker.setAttribute("aria-label", `${label} bei ${timeFormat.format(entry.time)} Sekunden`);
        }
      }
      latest.hidden = inspected === null;
      couple.disabled = kick.disabled = inspected !== null;
    }

    function tick(now) {
      const interval = lastFrame === null ? 0 : Math.min(0.1, (now - lastFrame) / 1000);
      lastFrame = now;
      if (interval > 0) {
        const coupling = lockedAt === null ? 0 : strength;
        const slices = Math.ceil(interval / 0.02);
        const h = interval / slices;
        const drift = delta => detuning - coupling * Math.sin(delta);
        for (let step = 0; step < slices; step++) {
          phaseDifference += h * drift(phaseDifference + 0.5 * h * drift(phaseDifference));
        }
        centerPhase = wrap(centerPhase + rate * interval);
        elapsed += interval;
        if (kickApplied && !events.return && Math.abs(phaseDifference - lockedAt) < tolerance) {
          events.return = snapshot();
          record(true);
        } else record();
        draw();
      }
      frame = requestAnimationFrame(tick);
    }

    function pause() {
      cancelAnimationFrame(frame);
      frame = lastFrame = null;
      play.textContent = "▶ Play";
    }

    function bindingTarget() {
      const unstableAngle = Math.PI - boundAngle;
      return boundAngle + turn * Math.ceil((phaseDifference - unstableAngle) / turn);
    }

    function switchCoupling() {
      lockedAt = lockedAt === null ? bindingTarget() : null;
      kickApplied = false;
      if (lockedAt !== null) {
        events.couple = snapshot();
        delete events.kick;
        delete events.return;
        record(true);
      }
      couple.setAttribute("aria-pressed", String(lockedAt !== null));
      couple.textContent = lockedAt === null ? "Kopplung aus · K = 0" : "Kopplung an · K = 3";
      draw();
    }

    function inspect(id) {
      if (!events[id]) return;
      pause();
      inspected = id;
      play.textContent = "▶ Aktuellen Lauf fortsetzen";
      draw();
    }

    function pickMarker(event) {
      const marker = event.target.closest("[data-beat-marker]");
      if (!marker) return;
      inspect(marker.dataset.beatMarker);
      markers.querySelector(`[data-beat-marker="${marker.dataset.beatMarker}"]`)?.focus({ preventScroll: true });
    }

    markers.addEventListener("click", pickMarker);
    markers.addEventListener("keydown", event => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      pickMarker(event);
    });
    for (const { id, button } of eventStyles) button.addEventListener("click", () => inspect(id));
    latest.addEventListener("click", () => {
      inspected = null;
      play.textContent = "▶ Play";
      draw();
    });

    play.addEventListener("click", () => {
      if (frame !== null) pause();
      else {
        inspected = null;
        draw();
        play.textContent = "⏸ Pause";
        frame = requestAnimationFrame(tick);
      }
    });
    couple.addEventListener("click", switchCoupling);
    kick.addEventListener("click", () => {
      phaseDifference += 0.25;
      centerPhase += 0.125;
      kickApplied = lockedAt !== null;
      if (kickApplied) lockedAt = bindingTarget();
      events.kick = snapshot();
      delete events.return;
      record(true);
      draw();
    });
    node("reset").addEventListener("click", () => {
      pause();
      elapsed = phaseDifference = centerPhase = 0;
      history = [];
      liftHistory = [];
      liftInterval = 0.05;
      inspected = null;
      for (const { id } of eventStyles) delete events[id];
      record();
      if (lockedAt !== null) switchCoupling();
      else draw();
    });
    record();
    draw();
  }
})();
