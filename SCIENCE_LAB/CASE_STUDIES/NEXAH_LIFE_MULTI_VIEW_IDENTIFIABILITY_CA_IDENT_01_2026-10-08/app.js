(() => {
  "use strict";
  const engine = window.NEXAHLifeMultiView;
  const NS = "http://www.w3.org/2000/svg";
  const el = (id) => document.getElementById(id);
  const svg = (tag, attrs = {}, text = "") => {
    const node = document.createElementNS(NS, tag);
    Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
    if (text) node.textContent = text;
    return node;
  };
  const patternSelect = el("pattern");
  Object.keys(engine.PATTERNS).forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name.replaceAll("_", " ");
    patternSelect.append(option);
  });
  patternSelect.value = "glider";
  let frames = engine.run(patternSelect.value, 48);
  let playing = false;
  let timer = null;

  function drawCarrier(grid) {
    const root = el("carrierSvg");
    root.replaceChildren();
    const size = 16;
    for (let i = 0; i <= engine.WIDTH; i += 1) {
      root.append(svg("line", { x1: i * size, y1: 0, x2: i * size, y2: 640, class: "cell-grid" }));
      root.append(svg("line", { x1: 0, y1: i * size, x2: 640, y2: i * size, class: "cell-grid" }));
    }
    grid.forEach((value, index) => {
      if (!value) return;
      const x = index % engine.WIDTH;
      const y = Math.floor(index / engine.WIDTH);
      root.append(svg("rect", { x: x * size + 1, y: y * size + 1, width: size - 2, height: size - 2, rx: 2, class: "cell" }));
    });
  }

  function drawBlocks(grid) {
    const values = engine.blockVector(grid);
    const root = el("gridSvg");
    root.replaceChildren();
    values.forEach((value, index) => {
      const x = index % 5;
      const y = Math.floor(index / 5);
      const alpha = Math.max(.035, Math.min(1, value * 22));
      root.append(svg("rect", { x: x * 128, y: y * 128, width: 128, height: 128, class: "block", fill: `rgba(85,215,235,${alpha})` }));
      root.append(svg("text", { x: x * 128 + 64, y: y * 128 + 70, "text-anchor": "middle" }, value.toFixed(3)));
    });
  }

  function drawFourier(grid) {
    const values = engine.fourierVector(grid);
    const root = el("fourierSvg");
    root.replaceChildren();
    root.append(svg("line", { x1: 55, y1: 430, x2: 725, y2: 430, class: "axis" }));
    values.forEach((value, index) => {
      const height = value * 340;
      root.append(svg("rect", { x: 70 + index * 82, y: 430 - height, width: 54, height, rx: 4, class: index ? "bar" : "bar base" }));
      root.append(svg("text", { x: 97 + index * 82, y: 460, "text-anchor": "middle" }, `k${index}`));
      root.append(svg("text", { x: 97 + index * 82, y: Math.max(28, 417 - height), "text-anchor": "middle" }, value.toFixed(3)));
    });
  }

  function drawMemory(generation) {
    const values = engine.shadowMemoryVector(frames, generation);
    const root = el("memorySvg");
    root.replaceChildren();
    const density = values.slice(0, 5);
    const changes = values.slice(5);
    const path = (series, yOffset, scale) => series.map((value, index) => `${index ? "L" : "M"}${90 + index * 140},${yOffset - value * scale}`).join(" ");
    root.append(svg("line", { x1: 70, y1: 220, x2: 700, y2: 220, class: "axis" }));
    root.append(svg("line", { x1: 70, y1: 445, x2: 700, y2: 445, class: "axis" }));
    root.append(svg("path", { d: path(density, 220, 1200), class: "trace" }));
    root.append(svg("path", { d: path(changes, 445, 850), class: "trace-secondary" }));
    root.append(svg("text", { x: 75, y: 35 }, "retained density"));
    root.append(svg("text", { x: 75, y: 270 }, "cell-change shadow"));
    density.forEach((value, i) => root.append(svg("circle", { cx: 90 + i * 140, cy: 220 - value * 1200, r: 6, fill: "var(--pink)" })));
    changes.forEach((value, i) => root.append(svg("circle", { cx: 90 + i * 140, cy: 445 - value * 850, r: 6, fill: "var(--cyan)" })));
  }

  function drawGon(grid, sides) {
    const values = engine.shadowGonVector(grid, sides).slice(0, sides);
    const root = el("gonSvg");
    root.replaceChildren();
    const cx = 320;
    const cy = 320;
    const frameRadius = 255;
    const points = values.map((value, index) => {
      const angle = -Math.PI / 2 + index * Math.PI * 2 / sides;
      const radius = 45 + Math.min(1, value * 8) * 195;
      return [cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius];
    });
    const frame = Array.from({ length: sides }, (_, index) => {
      const angle = -Math.PI / 2 + index * Math.PI * 2 / sides;
      return `${cx + Math.cos(angle) * frameRadius},${cy + Math.sin(angle) * frameRadius}`;
    }).join(" ");
    root.append(svg("polygon", { points: frame, class: "gon-frame" }));
    for (let i = 0; i < sides; i += 1) {
      const angle = -Math.PI / 2 + i * Math.PI * 2 / sides;
      root.append(svg("line", { x1: cx, y1: cy, x2: cx + Math.cos(angle) * frameRadius, y2: cy + Math.sin(angle) * frameRadius, class: "gon-ray" }));
    }
    root.append(svg("polygon", { points: points.map((point) => point.join(",")).join(" "), class: "gon-shadow" }));
    points.forEach((point) => root.append(svg("circle", { cx: point[0], cy: point[1], r: 4, fill: "var(--gold)" })));
    el("gonTitle").textContent = `${sides}-gon shadow`;
  }

  function drawCharts(grid) {
    const cart = el("descartesSvg");
    const disk = el("poincareSvg");
    cart.replaceChildren();
    disk.replaceChildren();
    cart.append(svg("line", { x1: 40, y1: 260, x2: 480, y2: 260, class: "axis" }), svg("line", { x1: 260, y1: 40, x2: 260, y2: 480, class: "axis" }), svg("text", { x: 30, y: 30 }, "Descartes"));
    disk.append(svg("circle", { cx: 260, cy: 260, r: 215, class: "disk" }), svg("line", { x1: 45, y1: 260, x2: 475, y2: 260, class: "axis" }), svg("text", { x: 30, y: 30 }, "Poincaré / Cayley"));
    engine.poincarePoints(grid).forEach((point) => {
      cart.append(svg("circle", { cx: 45 + point.source[0] * 11, cy: 45 + point.source[1] * 11, r: 5, class: "point" }));
      disk.append(svg("circle", { cx: 260 + point.disk[0] * 215, cy: 260 - point.disk[1] * 215, r: 5, class: "point" }));
    });
  }

  function drawE8(grid, generation) {
    const vector = engine.e8AdapterVector(grid, frames, generation);
    const state = vector.slice(0, 8).map((value) => Math.round(value * 2 - 1));
    const positions = [[80, 280], [165, 280], [250, 280], [335, 280], [420, 280], [505, 280], [590, 280], [250, 145]];
    const edges = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [2, 7]];
    const root = el("e8Svg");
    root.replaceChildren();
    edges.forEach(([a, b]) => root.append(svg("line", { x1: positions[a][0], y1: positions[a][1], x2: positions[b][0], y2: positions[b][1], class: "e8-edge" })));
    positions.forEach(([x, y], index) => {
      root.append(svg("circle", { cx: x, cy: y, r: 26, class: `e8-node ${state[index] ? "active" : ""}` }));
      root.append(svg("text", { x, y: y + 5, "text-anchor": "middle" }, `${index + 1}:${state[index]}`));
    });
    root.append(svg("text", { x: 80, y: 390 }, "quantized source = baseline + low DFT + memory"));
    root.append(svg("text", { x: 80, y: 420 }, "μᵢ² return checks: 8/8 by construction"));
    root.append(svg("text", { x: 80, y: 450 }, "adapter only · no LIFE/E8 carrier identity"));
  }

  function renderResults(result) {
    const pct = (value) => `${(value * 100).toFixed(1)}%`;
    el("verdict").textContent = result.verdict.replaceAll("_", " ");
    el("resultSummary").innerHTML = `
      <article><span>Training</span><strong>${result.train_rows}</strong></article>
      <article><span>Translated holdout</span><strong>${result.holdout_rows}</strong></article>
      <article><span>Baseline</span><strong>${pct(result.baseline_accuracy)}</strong></article>
      <article><span>Best view</span><strong>${result.best_view}</strong></article>
      <article><span>Best delta</span><strong>${result.best_delta >= 0 ? "+" : ""}${pct(result.best_delta)}</strong></article>`;
    const names = { baseline: "Baseline", grid: "5×5 grid", fourier: "Fourier magnitude", memory: "Shadow memory", polygons: "17/19/29-gons", e8_adapter: "E8 adapter", combined: "Combined" };
    el("resultBars").innerHTML = result.results.map((item) => `<div class="result-row ${item.family === "baseline" ? "baseline" : ""}"><span>${names[item.family]}</span><div class="result-track"><i style="width:${item.accuracy * 100}%"></i></div><b>${pct(item.accuracy)}</b></div>`).join("");
    el("resultBoundary").textContent = result.claim_ceiling;
  }

  function render() {
    const generation = Number(el("generation").value);
    const grid = frames[generation];
    el("generationValue").textContent = generation;
    el("live").textContent = engine.countLive(grid);
    el("components").textContent = engine.componentCount(grid);
    el("entropy").textContent = `${engine.entropy(grid).toFixed(5)} bit`;
    el("future").textContent = engine.futureClass(frames, generation);
    el("hash").textContent = engine.hashGrid(grid);
    drawCarrier(grid);
    drawBlocks(grid);
    drawFourier(grid);
    drawMemory(generation);
    drawGon(grid, Number(el("gon").value));
    drawCharts(grid);
    drawE8(grid, generation);
  }

  function rebuild() {
    frames = engine.run(patternSelect.value, 48);
    render();
  }

  document.querySelectorAll("[data-view]").forEach((button) => button.addEventListener("click", () => {
    document.querySelectorAll("[data-view]").forEach((item) => item.classList.toggle("active", item === button));
    document.querySelectorAll(".view").forEach((view) => view.classList.toggle("active", view.id === `view-${button.dataset.view}`));
  }));
  patternSelect.addEventListener("change", rebuild);
  el("generation").addEventListener("input", render);
  el("gon").addEventListener("change", render);
  el("play").addEventListener("click", () => {
    playing = !playing;
    el("play").textContent = playing ? "Ⅱ Pause" : "▶ Play";
    clearInterval(timer);
    if (playing) timer = setInterval(() => {
      const control = el("generation");
      control.value = Number(control.value) >= Number(control.max) ? 0 : Number(control.value) + 1;
      render();
    }, 260);
  });
  el("rerun").addEventListener("click", () => {
    el("verdict").textContent = "running…";
    setTimeout(() => renderResults(engine.evaluate()), 20);
  });
  render();
  setTimeout(() => renderResults(engine.evaluate()), 30);
})();
