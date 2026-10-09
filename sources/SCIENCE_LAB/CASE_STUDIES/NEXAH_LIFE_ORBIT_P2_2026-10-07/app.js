(function startLifeOrbitApp() {
  "use strict";

  const Engine = window.LifeOrbitEngine;
  const $ = (id) => document.getElementById(id);
  const elements = {
    field: $("field-canvas"), time: $("time-canvas"), seed: $("seed-select"), reset: $("reset-button"),
    step: $("step-button"), play: $("play-button"), speed: $("speed-range"), speedValue: $("speed-value"),
    spacing: $("spacing-range"), cellSize: $("cell-range"), slice: $("slice-range"), sliceMax: $("slice-max"),
    sliceLabel: $("slice-label"), generation: $("generation-label"), runState: $("run-state"), liveCount: $("live-count"),
    layerCount: $("layer-count"), stateHash: $("state-hash"), returnType: $("return-type"), returnDetail: $("return-detail"),
    cellAddress: $("cell-address"), cellCurrent: $("cell-current"), cellNeighbors: $("cell-neighbors"),
    cellNext: $("cell-next"), cellRule: $("cell-rule"),
  };

  const state = {
    history: [], selectedGeneration: 0, selectedCell: null, firstReturn: null,
    playing: false, timer: null, maxGenerations: 64,
  };

  function currentState() { return state.history[state.selectedGeneration]; }

  function reset(seedName = elements.seed.value) {
    stop();
    state.history = [Engine.makeState(Engine.FIXTURES[seedName])];
    state.selectedGeneration = 0;
    state.selectedCell = null;
    state.firstReturn = null;
    render();
  }

  function advance() {
    if (state.history.length - 1 >= state.maxGenerations) { stop(); return; }
    const next = Engine.step(state.history[state.history.length - 1]);
    state.history.push(next);
    state.selectedGeneration = state.history.length - 1;
    const event = Engine.classifyLatest(state.history);
    if (!state.firstReturn && event.type !== "OPEN_TRANSIENT") state.firstReturn = event;
    render();
  }

  function play() {
    if (state.playing) { stop(); return; }
    if (state.history.length - 1 >= state.maxGenerations) reset();
    state.playing = true;
    elements.play.textContent = "Pause";
    elements.runState.textContent = "RUNNING";
    schedule();
  }

  function schedule() {
    clearTimeout(state.timer);
    if (!state.playing) return;
    const delay = 1000 / Number(elements.speed.value);
    state.timer = setTimeout(() => { advance(); schedule(); }, delay);
  }

  function stop() {
    state.playing = false;
    clearTimeout(state.timer);
    state.timer = null;
    elements.play.textContent = "Play";
    elements.runState.textContent = "PAUSED";
  }

  function fitCanvas(canvas) {
    const rect = canvas.parentElement.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));
    if (canvas.width !== width * ratio || canvas.height !== height * ratio) {
      canvas.width = width * ratio;
      canvas.height = height * ratio;
    }
    const context = canvas.getContext("2d");
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    return { context, width, height };
  }

  function palette() {
    return { bg: "#050811", grid: "#1d2940", live: "#2ef2c1", glow: "rgba(46,242,193,.36)", gold: "#ffd06b", birth: "#ee5cff", death: "#ff6487", plane: "rgba(103,125,161,.28)", selectedPlane: "rgba(255,208,107,.78)" };
  }

  function drawField() {
    const view = fitCanvas(elements.field);
    const ctx = view.context;
    const colors = palette();
    const grid = currentState();
    const size = Math.min((view.width - 30) / grid.width, (view.height - 30) / grid.height);
    const left = (view.width - size * grid.width) / 2;
    const top = (view.height - size * grid.height) / 2;
    const live = new Set(grid.live.map((cell) => `${cell[0]},${cell[1]}`));
    ctx.clearRect(0, 0, view.width, view.height);
    ctx.fillStyle = colors.bg;
    ctx.fillRect(0, 0, view.width, view.height);

    for (let y = 0; y < grid.height; y += 1) {
      for (let x = 0; x < grid.width; x += 1) {
        const px = left + x * size;
        const py = top + y * size;
        const selected = state.selectedCell && state.selectedCell[0] === x && state.selectedCell[1] === y;
        const transition = Engine.inspectTransition(grid, x, y);
        ctx.strokeStyle = selected ? colors.gold : colors.grid;
        ctx.lineWidth = selected ? 2 : 1;
        ctx.strokeRect(px + 0.5, py + 0.5, size - 1, size - 1);
        if (live.has(`${x},${y}`)) {
          ctx.shadowColor = colors.glow;
          ctx.shadowBlur = 10;
          ctx.fillStyle = transition.next ? colors.live : colors.death;
          ctx.fillRect(px + 2, py + 2, size - 4, size - 4);
          ctx.shadowBlur = 0;
        } else if (transition.next) {
          ctx.strokeStyle = colors.birth;
          ctx.lineWidth = 1.5;
          ctx.strokeRect(px + 3, py + 3, size - 6, size - 6);
        }
      }
    }
    elements.field.dataset.left = String(left);
    elements.field.dataset.top = String(top);
    elements.field.dataset.cell = String(size);
  }

  function diamond(ctx, cx, cy, size, fill, stroke) {
    ctx.beginPath();
    ctx.moveTo(cx, cy - size * 0.42);
    ctx.lineTo(cx + size, cy);
    ctx.lineTo(cx, cy + size * 0.42);
    ctx.lineTo(cx - size, cy);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 0.8; ctx.stroke(); }
  }

  function drawTimeBody() {
    const view = fitCanvas(elements.time);
    const ctx = view.context;
    const colors = palette();
    const spacing = Number(elements.spacing.value);
    const cell = Number(elements.cellSize.value);
    const shown = state.history.slice(0, state.selectedGeneration + 1);
    const baseY = Math.min(view.height - 55, 210 + shown.length * spacing * 0.48);
    const centerX = view.width / 2;
    ctx.clearRect(0, 0, view.width, view.height);
    ctx.fillStyle = colors.bg;
    ctx.fillRect(0, 0, view.width, view.height);

    shown.forEach((layer, generation) => {
      const yLift = generation * spacing;
      const extent = layer.width * cell * 0.5;
      const planeY = baseY - yLift;
      ctx.beginPath();
      ctx.moveTo(centerX, planeY - extent * 0.46);
      ctx.lineTo(centerX + extent, planeY);
      ctx.lineTo(centerX, planeY + extent * 0.46);
      ctx.lineTo(centerX - extent, planeY);
      ctx.closePath();
      ctx.strokeStyle = generation === state.selectedGeneration ? colors.selectedPlane : colors.plane;
      ctx.lineWidth = generation === state.selectedGeneration ? 1.6 : 0.65;
      ctx.stroke();

      layer.live.forEach(([x, y]) => {
        const px = centerX + (x - y) * cell * 0.5;
        const py = planeY + (x + y - layer.width + 1) * cell * 0.23;
        const alpha = Math.max(0.28, 0.94 - (state.selectedGeneration - generation) * 0.025);
        ctx.shadowColor = colors.glow;
        ctx.shadowBlur = generation === state.selectedGeneration ? 10 : 4;
        diamond(ctx, px, py, cell * 0.42, `rgba(46,242,193,${alpha})`, generation === state.selectedGeneration ? "#baffed" : null);
      });
      ctx.shadowBlur = 0;
    });
  }

  function shortStateSignature(grid) {
    let value = 2166136261;
    const text = JSON.stringify(grid.live);
    for (let i = 0; i < text.length; i += 1) {
      value ^= text.charCodeAt(i);
      value = Math.imul(value, 16777619);
    }
    return `P2-FNV32 ${String(value >>> 0).padStart(10, "0")} · P1 SHA-256 remains authoritative`;
  }

  function renderInspector() {
    if (!state.selectedCell) {
      elements.cellAddress.textContent = "CELL —";
      elements.cellCurrent.textContent = "—";
      elements.cellNeighbors.textContent = "—";
      elements.cellNext.textContent = "—";
      elements.cellRule.textContent = "Select a cell to reveal the exact local transition.";
      return;
    }
    const [x, y] = state.selectedCell;
    const result = Engine.inspectTransition(currentState(), x, y);
    elements.cellAddress.textContent = `CELL ${x},${y}`;
    elements.cellCurrent.textContent = result.alive ? "ALIVE" : "DEAD";
    elements.cellNeighbors.textContent = String(result.neighbors);
    elements.cellNext.textContent = result.next ? "ALIVE" : "DEAD";
    const labels = {
      BIRTH_B3: "Birth: a dead cell has exactly three live neighbors.",
      SURVIVAL_S23: "Survival: a live cell has two or three live neighbors.",
      DEATH_UNDERPOPULATION: "Death: a live cell has fewer than two live neighbors.",
      DEATH_OVERPOPULATION: "Death: a live cell has more than three live neighbors.",
      REMAINS_DEAD: "No birth: a dead cell does not have exactly three live neighbors.",
    };
    elements.cellRule.textContent = `${result.branch} · ${labels[result.branch]}`;
  }

  function renderReturn() {
    const slicedHistory = state.history.slice(0, state.selectedGeneration + 1);
    const event = state.firstReturn && state.firstReturn.detected_generation <= state.selectedGeneration
      ? state.firstReturn
      : Engine.classifyLatest(slicedHistory);
    elements.returnType.textContent = event.type;
    if (event.type === "OPEN_TRANSIENT") elements.returnDetail.textContent = "No return detected yet.";
    else if (event.type === "TRANSLATED_RETURN") elements.returnDetail.textContent = `Period ${event.period} · translation (${event.translation[0]},${event.translation[1]})`;
    else elements.returnDetail.textContent = `Period ${event.period} · detected at generation ${event.detected_generation}`;
  }

  function render() {
    const grid = currentState();
    elements.slice.max = String(state.history.length - 1);
    elements.slice.value = String(state.selectedGeneration);
    elements.sliceMax.textContent = String(state.history.length - 1);
    elements.sliceLabel.textContent = `Generation ${state.selectedGeneration}`;
    elements.generation.textContent = `GEN ${state.history.length - 1}`;
    elements.liveCount.textContent = String(grid.live.length);
    elements.layerCount.textContent = String(state.selectedGeneration + 1);
    elements.stateHash.textContent = shortStateSignature(grid);
    drawField();
    drawTimeBody();
    renderInspector();
    renderReturn();
  }

  elements.seed.addEventListener("change", () => reset(elements.seed.value));
  elements.reset.addEventListener("click", () => reset(elements.seed.value));
  elements.step.addEventListener("click", () => { stop(); advance(); });
  elements.play.addEventListener("click", play);
  elements.speed.addEventListener("input", () => { elements.speedValue.textContent = `${elements.speed.value} gen/s`; if (state.playing) schedule(); });
  elements.spacing.addEventListener("input", drawTimeBody);
  elements.cellSize.addEventListener("input", drawTimeBody);
  elements.slice.addEventListener("input", () => { state.selectedGeneration = Number(elements.slice.value); render(); });
  elements.field.addEventListener("click", (event) => {
    const rect = elements.field.getBoundingClientRect();
    const left = Number(elements.field.dataset.left);
    const top = Number(elements.field.dataset.top);
    const size = Number(elements.field.dataset.cell);
    const x = Math.floor((event.clientX - rect.left - left) / size);
    const y = Math.floor((event.clientY - rect.top - top) / size);
    if (x < 0 || x >= Engine.WIDTH || y < 0 || y >= Engine.HEIGHT) return;
    state.selectedCell = [x, y];
    if (!state.playing && state.history.length === 1 && state.selectedGeneration === 0) {
      state.history[0] = Engine.toggleCell(state.history[0], x, y);
      state.firstReturn = null;
      elements.seed.value = "glider";
    }
    render();
  });
  window.addEventListener("resize", render);
  document.addEventListener("visibilitychange", () => { if (document.hidden) stop(); });

  reset("glider");
}());
