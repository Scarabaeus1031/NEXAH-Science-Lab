(() => {
  "use strict";

  const panel = document.getElementById("helix-jupiter-phases");
  const data = window.A0JupiterHorizons;
  const slider = document.getElementById("kuramotoCompareTime");
  const timeLabel = document.querySelector("[data-kuramoto-time-label]");
  if (!panel || !data || !slider || !timeLabel) return;

  const query = (selector) => panel.querySelector(selector);
  const { satellites, stepHours, calendarStart } = data;
  const fullCount = satellites[0].longitudes.length;
  const windowSelector = query("[data-jupiter-window]");
  let count = 0;
  const colors = ["#8de5ef", "#ffd08a", "#f49ad4"];
  const wrap = (degrees) => ((degrees % 360) + 360) % 360;
  const laplace = Array.from({ length:fullCount }, (_, sample) => {
    const [io, europa, ganymed] = satellites.map(({ longitudes }) => longitudes[sample]);
    return wrap(io - 3 * europa + 2 * ganymed);
  });
  const angle = new Intl.NumberFormat("de-DE", { minimumFractionDigits:3, maximumFractionDigits:3 });
  // The source labels are TDB calendar values. UTC here keeps calendar arithmetic independent of browser timezone.
  const calendar = new Intl.DateTimeFormat("de-DE", {
    day:"2-digit", month:"2-digit", year:"numeric", hour:"2-digit", minute:"2-digit",
    timeZone:"UTC"
  });
  const start = Date.parse(calendarStart + "Z");
  function line(ctx, x0, y0, x1, y1, color) {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
  }

  function dot(ctx, x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
  }

  const dial = query("[data-jupiter-circle]");
  const dialCtx = dial.getContext("2d");
  const strip = query("[data-jupiter-strip]");
  const stripCtx = strip.getContext("2d");
  const grid = query("[data-jupiter-grid]");
  const gridCtx = grid.getContext("2d");

  function drawCircle(sample) {
    const cx = dial.width / 2;
    const cy = dial.height / 2;
    const radius = 63;
    dialCtx.clearRect(0, 0, dial.width, dial.height);
    line(dialCtx, cx - radius, cy, cx + radius, cy, "#355165");
    line(dialCtx, cx, cy - radius, cx, cy + radius, "#355165");
    dialCtx.strokeStyle = "#638092";
    dialCtx.beginPath();
    dialCtx.arc(cx, cy, radius, 0, 2 * Math.PI);
    dialCtx.stroke();
    dialCtx.fillStyle = "#d2e3eb";
    dialCtx.font = "14px system-ui";
    dialCtx.textAlign = "center";
    dialCtx.fillText("0°", cx, cy - radius - 9);
    dialCtx.fillText("180°", cx, cy + radius + 18);
    satellites.forEach(({ longitudes }, i) => {
      const theta = longitudes[sample] * Math.PI / 180;
      const r = radius - i * 9;
      const x = cx + r * Math.sin(theta);
      const y = cy - r * Math.cos(theta);
      line(dialCtx, cx, cy, x, y, colors[i]);
      dot(dialCtx, x, y, 4, colors[i]);
    });
  }

  const left = 62;
  const right = strip.width - 25;
  const top = 14;
  const bottom = strip.height - 29;
  const halfSpan = Math.max(.1, Math.ceil(10 * Math.max(...laplace.map(phi => Math.abs(phi - 180)))) / 10);
  const xAt = (sample) => left + (right - left) * sample / (count - 1);
  const yAt = (phi) => (bottom + top) / 2 - (phi - 180) * (bottom - top) / (2 * halfSpan);
  const gridLeft = 200;
  const gridWidth = grid.width - gridLeft - 16;
  const rowHeight = 68;
  const gridX = (sample) => gridLeft + (gridWidth - 1) * sample / (count - 1);
  let stripBackground;
  let gridBackground;

  function prepareStrip(values, crossings) {
    stripCtx.clearRect(0, 0, strip.width, strip.height);
    stripCtx.lineWidth = 1;
    stripCtx.font = "14px system-ui";
    for (const tick of [180 - halfSpan, 180, 180 + halfSpan]) {
      const y = yAt(tick);
      line(stripCtx, left, y, right, y, tick === 180 ? "#d8ba77" : "#345164");
      stripCtx.fillStyle = "#d2e3eb";
      stripCtx.textAlign = "right";
      stripCtx.fillText(tick.toLocaleString("de-DE") + "°", left - 7, y + 4);
    }
    stripCtx.textAlign = "center";
    for (const sample of [0, (count - 1) / 2, count - 1]) {
      const days = sample * stepHours / 24;
      stripCtx.fillText(days.toLocaleString("de-DE") + " d", xAt(sample), bottom + 21);
    }
    stripCtx.beginPath();
    values.forEach((phi, i) => {
      if (i === 0) stripCtx.moveTo(xAt(i), yAt(phi));
      else stripCtx.lineTo(xAt(i), yAt(phi));
    });
    stripCtx.strokeStyle = "#8de5ef";
    stripCtx.lineWidth = 1.5;
    stripCtx.stroke();
    for (const { sample, part } of crossings) {
      // The dots locate the linear crossing between two sampled endpoints.
      dot(stripCtx, xAt(sample - 1 + part), yAt(180), 2.4, "#ffd08a");
    }
    stripCtx.lineWidth = 1;
    return stripCtx.getImageData(0, 0, strip.width, strip.height);
  }

  function prepareGrid() {
    gridCtx.clearRect(0, 0, grid.width, grid.height);
    satellites.forEach(({ name, longitudes }, row) => {
      const y = 11 + row * rowHeight;
      gridCtx.fillStyle = colors[row];
      gridCtx.font = "33px system-ui";
      gridCtx.fillText(name, 2, y + 41);
      for (let x = 0; x < gridWidth; x++) {
        const sample = Math.round(x * (count - 1) / (gridWidth - 1));
        gridCtx.fillStyle = `hsl(${longitudes[sample]} 74% 54%)`;
        gridCtx.fillRect(gridLeft + x, y, 1, rowHeight - 6);
      }
    });
    return gridCtx.getImageData(0, 0, grid.width, grid.height);
  }

  let previousSample = -1;
  function render() {
    const sample = Math.round(Number(slider.value) * (count - 1) / Number(slider.max));
    if (sample === previousSample) return;
    previousSample = sample;
    const time = calendar.format(start + sample * stepHours * 3600000);
    query("[data-jupiter-time]").textContent = time + " TDB";
    query("[data-jupiter-angle]").textContent = angle.format(laplace[sample]) + "°";
    query("[data-jupiter-longitudes]").textContent = satellites.map(({ name, longitudes }) =>
      name + " " + angle.format(longitudes[sample]) + "°").join(" · ");
    drawCircle(sample);
    stripCtx.putImageData(stripBackground, 0, 0);
    line(stripCtx, xAt(sample), top, xAt(sample), bottom, "#f5efe3");
    dot(stripCtx, xAt(sample), yAt(laplace[sample]), 4, "#ffd08a");
    gridCtx.putImageData(gridBackground, 0, 0);
    line(gridCtx, gridX(sample), 3, gridX(sample), grid.height - 4, "#fff");
  }

  function selectWindow() {
    const days = Number(windowSelector.value);
    count = Math.min(fullCount, Math.round(days * 24 / stepHours) + 1);
    const values = laplace.slice(0, count);
    const minimum = Math.min(...values);
    const maximum = Math.max(...values);
    const mean = values.reduce((sum, value) => sum + value, 0) / count;
    const crossings = [];
    for (let sample = 1; sample < count; sample++) {
      const before = values[sample - 1] - 180;
      const after = values[sample] - 180;
      if (before * after < 0) crossings.push({ sample, part:before / (before - after) });
    }
    const stop = start + (count - 1) * stepHours * 3600000;
    query("[data-jupiter-window-range]").textContent = calendar.format(start) + " bis " + calendar.format(stop) + " TDB";
    query("[data-jupiter-range]").textContent =
      `${angle.format(minimum)}° bis ${angle.format(maximum)}° · Mittelwert ${angle.format(mean)}°`;
    query("[data-jupiter-count]").textContent = count.toLocaleString("de-DE");
    query("[data-jupiter-crossings]").textContent = crossings.length
      ? crossings.length + " Wechsel über 180° zwischen aufeinanderfolgenden Stundenwerten."
      : "Kein Wechsel über 180° zwischen den Stundenwerten.";
    stripBackground = prepareStrip(values, crossings);
    gridBackground = prepareGrid();
    previousSample = -1;
    render();
  }

  // The Kuramoto view also renders after an internal chart click changes the slider's value.
  new MutationObserver(render).observe(timeLabel, { childList:true });
  slider.addEventListener("input", render);
  windowSelector.addEventListener("change", selectWindow);
  slider.closest(".kuramoto-controls").after(panel);
  panel.hidden = false;
  selectWindow();
  if (window.location.hash === "#helix-jupiter-phases") panel.scrollIntoView();
})();
