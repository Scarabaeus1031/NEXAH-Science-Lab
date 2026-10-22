(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.A0LivingInterior = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const STAGES = ['outside', 'contact', 'inside', 'life', 'memory'];
  const GRID = { cols: 38, rows: 24 };
  const STAGE_COPY = {
    outside: ['01 / 05', 'THE BODY / OUTSIDE', 'A bounded form is visible. Its internal transition has not yet been read.'],
    contact: ['02 / 05', 'MEMBRANE CONTACT', 'The surface becomes a gate: not a second body, but a change of reading position.'],
    inside: ['03 / 05', 'THE CELLULAR INTERIOR', 'The shell recedes. Addresses become cells and the field surrounds the observer.'],
    life: ['04 / 05', 'GAME 4 LIFE', 'Local neighbours change local states. One deterministic carrier remains underneath.'],
    memory: ['05 / 05', 'THE BODY REMEMBERS', 'Current cells glow; vanished events remain briefly visible as a fading record.']
  };

  function index(x, y) { return y * GRID.cols + x; }

  function createSeed() {
    const cells = Array(GRID.cols * GRID.rows).fill(0);
    const motifs = [
      [[0,1],[1,2],[2,0],[2,1],[2,2]],
      [[0,0],[1,0],[0,1],[1,1]],
      [[1,0],[2,1],[0,2],[1,2],[2,2]],
      [[0,0],[1,0],[2,0],[2,1],[1,2]]
    ];
    const anchors = [[6,5,0],[15,6,1],[27,5,2],[9,15,3],[20,14,0],[29,16,2]];
    anchors.forEach(([ax, ay, motif]) => motifs[motif].forEach(([dx, dy]) => {
      cells[index(ax + dx, ay + dy)] = 1;
    }));
    for (let x = 13; x <= 24; x += 1) {
      if (x % 2 === 0) cells[index(x, 11)] = 1;
    }
    return cells;
  }

  function summarize(cells) {
    return { alive: cells.reduce((sum, cell) => sum + Number(Boolean(cell)), 0), total: cells.length };
  }

  function step(cells) {
    const next = Array(cells.length).fill(0);
    let births = 0;
    let survivals = 0;
    let deaths = 0;
    const events = Array(cells.length).fill('empty');
    for (let y = 0; y < GRID.rows; y += 1) {
      for (let x = 0; x < GRID.cols; x += 1) {
        let neighbours = 0;
        for (let dy = -1; dy <= 1; dy += 1) {
          for (let dx = -1; dx <= 1; dx += 1) {
            if ((!dx && !dy) || x + dx < 0 || x + dx >= GRID.cols || y + dy < 0 || y + dy >= GRID.rows) continue;
            neighbours += cells[index(x + dx, y + dy)];
          }
        }
        const at = index(x, y);
        const alive = Boolean(cells[at]);
        const remains = alive && (neighbours === 2 || neighbours === 3);
        const born = !alive && neighbours === 3;
        next[at] = remains || born ? 1 : 0;
        if (born) { births += 1; events[at] = 'birth'; }
        else if (remains) { survivals += 1; events[at] = 'survive'; }
        else if (alive) { deaths += 1; events[at] = 'death'; }
      }
    }
    return { next, births, survivals, deaths, events };
  }

  function startBrowserView() {
    if (typeof document === 'undefined') return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const passage = document.getElementById('passageCanvas');
    const lifeCanvas = document.getElementById('lifeCanvas');
    if (!passage || !lifeCanvas) return;

    const pctx = passage.getContext('2d');
    const lctx = lifeCanvas.getContext('2d');
    let stage = 'outside';
    let stageStarted = performance.now();
    let passageTimer = 0;
    let cells = createSeed();
    let previousEvents = Array(cells.length).fill('empty');
    let memory = Array(cells.length).fill(0);
    let generation = 0;
    let playing = !reduced;
    let lastLifeStep = performance.now();
    let lastPassageFrame = 0;

    const stageIndex = document.getElementById('stageIndex');
    const stageTitle = document.getElementById('stageTitle');
    const stageCopy = document.getElementById('stageCopy');
    const enter = document.getElementById('enterPassage');
    const play = document.getElementById('lifePlay');
    const stepButton = document.getElementById('lifeStep');
    const reset = document.getElementById('lifeReset');
    const outputs = {
      generation: document.getElementById('generationOut'),
      alive: document.getElementById('aliveOut'),
      births: document.getElementById('birthOut'),
      survivals: document.getElementById('surviveOut'),
      deaths: document.getElementById('deathOut'),
      memory: document.getElementById('memoryOut')
    };

    function fit(canvas, context) {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.floor(canvas.clientWidth));
      const height = Math.max(1, Math.floor(canvas.clientHeight));
      if (canvas.width !== Math.floor(width * ratio) || canvas.height !== Math.floor(height * ratio)) {
        canvas.width = Math.floor(width * ratio);
        canvas.height = Math.floor(height * ratio);
      }
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      return [width, height];
    }

    function setStage(nextStage) {
      if (!STAGES.includes(nextStage)) return;
      stage = nextStage;
      stageStarted = performance.now();
      const copy = STAGE_COPY[stage];
      stageIndex.textContent = copy[0];
      stageTitle.textContent = copy[1];
      stageCopy.textContent = copy[2];
      document.querySelectorAll('[data-stage]').forEach(button => button.classList.toggle('active', button.dataset.stage === stage));
    }

    function startPassage() {
      window.clearInterval(passageTimer);
      let position = 0;
      enter.setAttribute('aria-pressed', 'true');
      enter.innerHTML = 'PASSAGE IN MOTION <span>↘</span>';
      setStage(STAGES[position]);
      passageTimer = window.setInterval(() => {
        position += 1;
        if (position >= STAGES.length) {
          window.clearInterval(passageTimer);
          enter.setAttribute('aria-pressed', 'false');
          enter.innerHTML = 'ENTER AGAIN <span>↘</span>';
          if (!reduced) document.getElementById('life').scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
        setStage(STAGES[position]);
      }, reduced ? 300 : 1900);
    }

    function drawPassage(now) {
      const [width, height] = fit(passage, pctx);
      const order = STAGES.indexOf(stage);
      const pulse = reduced ? 0 : Math.sin(now * .0014);
      const cx = width * (.73 - order * .018);
      const cy = height * .46;
      const base = Math.min(width, height) * (.28 + order * .026);
      pctx.clearRect(0, 0, width, height);

      const glow = pctx.createRadialGradient(cx, cy, base * .04, cx, cy, base * 1.55);
      glow.addColorStop(0, order >= 2 ? 'rgba(255,201,77,.22)' : 'rgba(56,218,243,.1)');
      glow.addColorStop(.45, order >= 3 ? 'rgba(255,79,180,.11)' : 'rgba(76,119,255,.08)');
      glow.addColorStop(1, 'rgba(1,3,9,0)');
      pctx.fillStyle = glow;
      pctx.fillRect(cx - base * 1.7, cy - base * 1.7, base * 3.4, base * 3.4);

      pctx.save();
      pctx.translate(cx, cy);
      for (let ring = 0; ring < 9; ring += 1) {
        const progress = ring / 8;
        const zoom = 1 + order * .22 + progress * .5 + pulse * .012 * (ring + 1);
        pctx.beginPath();
        pctx.ellipse(0, 0, base * .68 * zoom, base * zoom, 0, 0, Math.PI * 2);
        pctx.strokeStyle = ring % 3 === 0 ? `rgba(255,79,180,${.18 + order * .035})` : `rgba(56,218,243,${.1 + order * .028})`;
        pctx.lineWidth = ring === 0 ? 2 : 1;
        pctx.stroke();
      }

      if (order >= 1) {
        for (let ray = 0; ray < 28; ray += 1) {
          const angle = ray / 28 * Math.PI * 2 + now * .00008;
          const inner = base * (.22 + order * .06);
          const outer = base * (1.1 + order * .14);
          pctx.beginPath();
          pctx.moveTo(Math.cos(angle) * inner * .7, Math.sin(angle) * inner);
          pctx.lineTo(Math.cos(angle) * outer * .7, Math.sin(angle) * outer);
          pctx.strokeStyle = `rgba(${ray % 2 ? '56,218,243' : '255,79,180'},${.04 + order * .015})`;
          pctx.stroke();
        }
      }

      if (order >= 2) {
        const points = 170 + order * 80;
        for (let n = 0; n < points; n += 1) {
          const angle = n * 2.399963 + now * .00003;
          const radius = base * Math.sqrt(n / points) * (.88 + order * .07);
          const x = Math.cos(angle) * radius * .68;
          const y = Math.sin(angle) * radius;
          const flicker = .45 + .35 * Math.sin(now * .002 + n);
          pctx.fillStyle = order === 2 ? `rgba(56,218,243,${flicker})` : order === 3 ? `rgba(${n % 3 ? '255,201,77' : '56,218,243'},${flicker})` : `rgba(${n % 4 ? '156,100,255' : '255,79,180'},${flicker})`;
          pctx.beginPath();
          pctx.arc(x, y, order >= 3 && n % 11 === 0 ? 3.2 : 1.4, 0, Math.PI * 2);
          pctx.fill();
        }
      }

      pctx.beginPath();
      pctx.ellipse(0, 0, base * .68, base, 0, 0, Math.PI * 2);
      pctx.strokeStyle = order === 0 ? '#38daf3' : order === 1 ? '#ffc94d' : '#ff4fb4';
      pctx.lineWidth = 2.3;
      pctx.shadowColor = pctx.strokeStyle;
      pctx.shadowBlur = 18;
      pctx.stroke();
      pctx.restore();
    }

    function updateLifeReadout(transition) {
      outputs.generation.textContent = String(generation);
      outputs.alive.textContent = String(summarize(cells).alive);
      outputs.births.textContent = String(transition ? transition.births : 0);
      outputs.survivals.textContent = String(transition ? transition.survivals : 0);
      outputs.deaths.textContent = String(transition ? transition.deaths : 0);
      outputs.memory.textContent = String(memory.filter(value => value > .05).length);
    }

    function advanceLife() {
      const transition = step(cells);
      memory = memory.map((value, at) => Math.max(value * .82, transition.events[at] === 'death' ? .9 : transition.next[at] ? 1 : 0));
      cells = transition.next;
      previousEvents = transition.events;
      generation += 1;
      if (summarize(cells).alive === 0 || generation > 220) resetLife(false);
      updateLifeReadout(transition);
    }

    function resetLife(update = true) {
      cells = createSeed();
      previousEvents = Array(cells.length).fill('empty');
      memory = cells.map(value => Number(value));
      generation = 0;
      if (update) updateLifeReadout(null);
    }

    function drawLife(now) {
      const [width, height] = fit(lifeCanvas, lctx);
      const breath = 1 + (reduced ? 0 : Math.sin(now * .00115) * .018);
      const margin = Math.max(28, Math.min(width, height) * .08);
      const cellSize = Math.min((width - margin * 2) / GRID.cols, (height - margin * 2) / GRID.rows);
      const gridWidth = cellSize * GRID.cols;
      const gridHeight = cellSize * GRID.rows;
      const left = (width - gridWidth) / 2;
      const top = (height - gridHeight) / 2;
      lctx.clearRect(0, 0, width, height);

      const background = lctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height) * .55);
      background.addColorStop(0, 'rgba(42,17,63,.6)');
      background.addColorStop(.5, 'rgba(5,23,34,.78)');
      background.addColorStop(1, '#02050b');
      lctx.fillStyle = background;
      lctx.fillRect(0, 0, width, height);

      lctx.save();
      lctx.beginPath();
      lctx.ellipse(width / 2, height / 2, gridWidth * .48 * breath, gridHeight * .52 * breath, 0, 0, Math.PI * 2);
      lctx.clip();

      for (let y = 0; y < GRID.rows; y += 1) {
        for (let x = 0; x < GRID.cols; x += 1) {
          const at = index(x, y);
          const px = left + x * cellSize;
          const py = top + y * cellSize;
          const trace = memory[at];
          lctx.strokeStyle = 'rgba(56,218,243,.055)';
          lctx.strokeRect(px + .6, py + .6, cellSize - 1.2, cellSize - 1.2);
          if (trace > .02) {
            const event = previousEvents[at];
            const color = event === 'birth' ? [56,218,243] : event === 'survive' ? [255,201,77] : [255,79,180];
            lctx.fillStyle = `rgba(${color.join(',')},${.1 + trace * .72})`;
            lctx.shadowColor = `rgb(${color.join(',')})`;
            lctx.shadowBlur = cells[at] ? 10 : 2;
            lctx.fillRect(px + 2, py + 2, Math.max(1, cellSize - 4), Math.max(1, cellSize - 4));
          }
        }
      }
      lctx.restore();
      lctx.shadowBlur = 0;

      for (let ring = 0; ring < 4; ring += 1) {
        lctx.beginPath();
        lctx.ellipse(width / 2, height / 2, gridWidth * (.48 + ring * .018) * breath, gridHeight * (.52 + ring * .018) * breath, 0, 0, Math.PI * 2);
        lctx.strokeStyle = ring === 0 ? 'rgba(255,79,180,.82)' : `rgba(56,218,243,${.2 - ring * .04})`;
        lctx.lineWidth = ring === 0 ? 2 : 1;
        lctx.stroke();
      }
    }

    function animate(now) {
      if (!reduced || now - lastPassageFrame > 300) {
        drawPassage(now);
        drawLife(now);
        lastPassageFrame = now;
      }
      if (playing && now - lastLifeStep > 470) {
        advanceLife();
        lastLifeStep = now;
      }
      window.requestAnimationFrame(animate);
    }

    document.querySelector('.stage-rail').addEventListener('click', event => {
      const button = event.target.closest('[data-stage]');
      if (!button) return;
      window.clearInterval(passageTimer);
      enter.setAttribute('aria-pressed', 'false');
      enter.innerHTML = 'ENTER THE INNER PASSAGE <span>↘</span>';
      setStage(button.dataset.stage);
    });
    enter.addEventListener('click', startPassage);
    play.addEventListener('click', () => {
      playing = !playing;
      play.setAttribute('aria-pressed', String(playing));
      play.textContent = playing ? 'PAUSE LIFE' : 'PLAY LIFE';
    });
    stepButton.addEventListener('click', () => { playing = false; play.setAttribute('aria-pressed', 'false'); play.textContent = 'PLAY LIFE'; advanceLife(); });
    reset.addEventListener('click', () => { resetLife(); playing = !reduced; play.setAttribute('aria-pressed', String(playing)); play.textContent = playing ? 'PAUSE LIFE' : 'PLAY LIFE'; });
    new ResizeObserver(() => { drawPassage(performance.now()); drawLife(performance.now()); }).observe(document.body);
    resetLife();
    play.setAttribute('aria-pressed', String(playing));
    play.textContent = playing ? 'PAUSE LIFE' : 'PLAY LIFE';
    window.requestAnimationFrame(animate);
    window.A0LivingInteriorView = { setStage, step: advanceLife, reset: resetLife, get state() { return { stage, generation, alive: summarize(cells).alive, playing }; } };
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', startBrowserView, { once: true });
    else startBrowserView();
  }

  return { STAGES, GRID, createSeed, summarize, step };
});
