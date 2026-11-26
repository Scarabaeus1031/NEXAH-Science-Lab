(() => {
  "use strict";

  const panel = document.getElementById("helix-jupiter-phases");
  const data = window.A0JupiterHorizons;
  const model = window.A0PrimecubeModel;
  const slider = document.getElementById("kuramotoCompareTime");
  const timeLabel = document.querySelector("[data-kuramoto-time-label]");
  if (!panel || !data || !model || !slider || !timeLabel) return;

  const query = (selector) => panel.querySelector(selector);
  const { satellites, stepHours, calendarStart } = data;
  const fullCount = satellites[0].longitudes.length;
  const windowSelector = query("[data-jupiter-window]");
  const crossingSelector = query("[data-jupiter-crossing-select]");
  const crossingStatus = query("[data-jupiter-crossing-status]");
  if (new URLSearchParams(window.location.search).get("jupiter") === "365") windowSelector.value = "365";
  let count = 0;
  let crossings = [];
  let selectedCrossing = null;
  let pickedSample = null;
  let pickedSliderValue = null;
  let movingSliderForPick = false;
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
  const sampleTime = (sample) => calendar.format(start + sample * stepHours * 3600000) + " TDB";
  const crossingDirection = ({ rising }) => rising ? "↑ über 180°" : "↓ unter 180°";
  const crossingLabel = (crossing) => crossingDirection(crossing) + " · " + sampleTime(crossing.sample);
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
  const gridTop = 28;
  const rowHeight = 68;
  const gridX = (sample) => gridLeft + (gridWidth - 1) * sample / (count - 1);
  let stripBackground;
  let gridBackground;

  const crossingColor = ({ rising }) => rising ? "#ffd08a" : "#f49ad4";
  const gridMarkY = ({ rising }) => rising ? 12 : grid.height - 12;
  const crossingX = ({ sample, part }) => xAt(sample - 1 + part);

  function prepareStrip(values) {
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
    for (const crossing of crossings) {
      dot(stripCtx, crossingX(crossing), yAt(180), 2.4, crossingColor(crossing));
    }
    stripCtx.lineWidth = 1;
    return stripCtx.getImageData(0, 0, strip.width, strip.height);
  }

  function prepareGrid() {
    gridCtx.clearRect(0, 0, grid.width, grid.height);
    satellites.forEach(({ name, longitudes }, row) => {
      const y = gridTop + row * rowHeight;
      gridCtx.fillStyle = colors[row];
      gridCtx.font = "33px system-ui";
      gridCtx.fillText(name, 2, y + 41);
      for (let x = 0; x < gridWidth; x++) {
        const sample = Math.round(x * (count - 1) / (gridWidth - 1));
        gridCtx.fillStyle = `hsl(${longitudes[sample]} 74% 54%)`;
        gridCtx.fillRect(gridLeft + x, y, 1, rowHeight - 6);
      }
    });
    for (const crossing of crossings) {
      dot(gridCtx, gridX(crossing.sample), gridMarkY(crossing), 6, crossingColor(crossing));
    }
    return gridCtx.getImageData(0, 0, grid.width, grid.height);
  }

  const samplingPanel = query("[data-jupiter-sampling]");
  const samplingCanvas = query("[data-jupiter-sample-strip]");
  const samplingCtx = samplingCanvas.getContext("2d");
  const sampleX = index => 10 + (samplingCanvas.width - 20) * index / (fullCount - 1);
  const primeHours = model.sieve(fullCount - 1);
  const uniformHours = primeHours.map((_, i) => Math.round(i * (fullCount - 1) / (primeHours.length - 1)));
  const offsetSelector = query("[data-jupiter-prime-offset]");
  const primeKey = query("[data-jupiter-prime-key]");
  let activeSampling;
  let samplingBackground;
  const uniformSet = new Set(uniformHours);
  const formatCount = number => number.toLocaleString("de-DE");
  const formatPercent = new Intl.NumberFormat("de-DE", {
    style:"percent", minimumFractionDigits:1, maximumFractionDigits:1
  });

  function summarizeSampling(name, values) {
    const row = query("[data-jupiter-sample-summary]").insertRow();
    const heading = document.createElement("th");
    heading.scope = "row";
    heading.textContent = name;
    row.append(heading);
    const below = values.filter(value => value < 180).length;
    const changes = values.filter((value, i) => i > 0 && (value - 180) * (values[i - 1] - 180) < 0).length;
    const average = values.reduce((sum, value) => sum + value, 0) / values.length;
    for (const value of [
      formatCount(values.length),
      `${angle.format(Math.min(...values))}°–${angle.format(Math.max(...values))}°`,
      angle.format(average) + "°",
      formatPercent.format(below / values.length),
      formatCount(changes)
    ]) row.insertCell().textContent = value;
    return row;
  }
  summarizeSampling("Alle Stunden", laplace);
  summarizeSampling("Gleichmäßig", uniformHours.map(i => laplace[i]));
  const offsetCases = [...offsetSelector.options].map(option => {
    const offset = Number(option.value);
    const yearHours = fullCount - 1; // The last sample is the right endpoint at 1 January 2026.
    const hours = primeHours.map(index => (index + offset) % yearHours).sort((a, b) => a - b);
    const label = "Primzahlmarken " + (offset ? "+" : "") + formatCount(offset) + " h";
    const row = summarizeSampling(label, hours.map(index => laplace[index]));
    return { offset, label, hours, row, membership:new Set(hours) };
  });

  function selectSampling() {
    activeSampling = offsetCases[offsetSelector.selectedIndex];
    for (const entry of offsetCases) {
      if (entry === activeSampling) entry.row.setAttribute("aria-current", "true");
      else entry.row.removeAttribute("aria-current");
    }
    primeKey.textContent = "Oben: " + activeSampling.label;
    samplingCtx.clearRect(0, 0, samplingCanvas.width, samplingCanvas.height);
    for (const [hours, color, y] of [[activeSampling.hours, "#8de5ef", 10], [uniformHours, "#f49ad4", 38]]) {
      samplingCtx.fillStyle = color;
      for (const index of hours) samplingCtx.fillRect(Math.round(sampleX(index)), y, 1, 17);
    }
    samplingBackground = samplingCtx.getImageData(0, 0, samplingCanvas.width, samplingCanvas.height);
    previousSample = -1;
  }

  let previousSample = -1;
  function render() {
    if (pickedSample !== null && slider.value !== pickedSliderValue) clearPick();
    const sample = pickedSample ??
      Math.round(Number(slider.value) * (count - 1) / Number(slider.max));
    if (sample === previousSample) return;
    previousSample = sample;
    query("[data-jupiter-time]").textContent = sampleTime(sample);
    query("[data-jupiter-angle]").textContent = angle.format(laplace[sample]) + "°";
    query("[data-jupiter-longitudes]").textContent = satellites.map(({ name, longitudes }) =>
      name + " " + angle.format(longitudes[sample]) + "°").join(" · ");
    drawCircle(sample);
    stripCtx.putImageData(stripBackground, 0, 0);
    line(stripCtx, xAt(sample), top, xAt(sample), bottom, "#f5efe3");
    dot(stripCtx, xAt(sample), yAt(laplace[sample]), 4, "#ffd08a");
    if (selectedCrossing) {
      stripCtx.beginPath();
      stripCtx.arc(crossingX(selectedCrossing), yAt(180), 7, 0, 2 * Math.PI);
      stripCtx.strokeStyle = "#fff5cf";
      stripCtx.stroke();
    }
    gridCtx.putImageData(gridBackground, 0, 0);
    line(gridCtx, gridX(sample), 3, gridX(sample), grid.height - 4, "#fff");
    if (selectedCrossing) {
      dot(gridCtx, gridX(sample), gridMarkY(selectedCrossing), 11, "#fff5cf");
      dot(gridCtx, gridX(sample), gridMarkY(selectedCrossing), 7, crossingColor(selectedCrossing));
    }
    if (!samplingPanel.hidden) {
      samplingCtx.putImageData(samplingBackground, 0, 0);
      line(samplingCtx, sampleX(sample), 3, sampleX(sample), samplingCanvas.height - 4, "#fff");
      const primeLabel = activeSampling.offset ? "verschobene Primzahlmarke" : "Primzahlindex";
      const membership = [activeSampling.membership.has(sample) ? primeLabel : "", uniformSet.has(sample) ? "gleichmäßig" : ""].filter(Boolean);
      query("[data-jupiter-sample-cursor]").textContent =
        "Stunde " + formatCount(sample) + " · " + (membership.join(" und ") || "außerhalb beider Stichproben");
    }
  }

  function clearPick() {
    if (pickedSample === null) return;
    pickedSample = null;
    selectedCrossing = null;
    crossingSelector.value = "";
    crossingStatus.textContent = "";
    previousSample = -1;
  }

  function selectCrossing(crossing) {
    if (!crossing) return;
    selectSample(crossing.sample, crossing);
  }

  function selectSample(sample, crossing) {
    pickedSample = sample;
    selectedCrossing = crossing;
    crossingSelector.value = crossing ? String(sample) : "";
    crossingStatus.textContent = crossing
      ? `${crossingDirection(crossing)} · zwischen ${sampleTime(sample - 1)} und ${sampleTime(sample)} · der zweite Stundenwert ist ausgewählt.`
      : "";
    // The model slider has fewer steps than the annual series. Keep the exact Jupiter sample.
    slider.value = String(Math.round(sample * Number(slider.max) / (count - 1)));
    pickedSliderValue = slider.value;
    previousSample = -1;
    movingSliderForPick = true;
    slider.dispatchEvent(new Event("input", { bubbles:true }));
    movingSliderForPick = false;
    render();
  }

  function crossingAt(event) {
    const bounds = strip.getBoundingClientRect();
    const y = bounds.top + yAt(180) * bounds.height / strip.height;
    let nearest = null;
    let distance = 12;
    for (const crossing of crossings) {
      const x = bounds.left + crossingX(crossing) * bounds.width / strip.width;
      const delta = Math.hypot(event.clientX - x, event.clientY - y);
      if (delta < distance) {
        nearest = crossing;
        distance = delta;
      }
    }
    return nearest;
  }

  function gridTarget(event) {
    const bounds = grid.getBoundingClientRect();
    const x = (event.clientX - bounds.left) * grid.width / bounds.width;
    const y = (event.clientY - bounds.top) * grid.height / bounds.height;
    const position = (x - gridLeft) / (gridWidth - 1);
    if (position < 0 || position > 1) return null;

    // Put the two directions on opposite edges so adjacent crossings stay selectable.
    const rising = y < gridTop;
    const inMarkerLane = rising || y >= gridTop + 3 * rowHeight;
    let crossing = null;
    let distance = 8;
    if (inMarkerLane) {
      for (const mark of crossings) {
        if (mark.rising !== rising) continue;
        const delta = Math.abs(x - gridX(mark.sample)) * bounds.width / grid.width;
        if (delta < distance) {
          crossing = mark;
          distance = delta;
        }
      }
    }
    const sample = crossing?.sample ?? Math.round(position * (count - 1));
    return { sample, crossing:crossing ?? crossings.find(mark => mark.sample === sample) ?? null };
  }

  function selectWindow() {
    clearPick();
    grid.title = "";
    const days = Number(windowSelector.value);
    count = Math.min(fullCount, Math.round(days * 24 / stepHours) + 1);
    samplingPanel.hidden = count !== fullCount;
    const values = laplace.slice(0, count);
    const minimum = Math.min(...values);
    const maximum = Math.max(...values);
    const mean = values.reduce((sum, value) => sum + value, 0) / count;
    crossings = [];
    for (let sample = 1; sample < count; sample++) {
      const before = values[sample - 1] - 180;
      const after = values[sample] - 180;
      if (before * after < 0) crossings.push({ sample, part:before / (before - after), rising:after > 0 });
    }
    const stop = start + (count - 1) * stepHours * 3600000;
    query("[data-jupiter-window-range]").textContent = calendar.format(start) + " bis " + calendar.format(stop) + " TDB";
    query("[data-jupiter-range]").textContent =
      `${angle.format(minimum)}° bis ${angle.format(maximum)}° · Mittelwert ${angle.format(mean)}°`;
    query("[data-jupiter-count]").textContent = count.toLocaleString("de-DE");
    query("[data-jupiter-crossings]").textContent = crossings.length
      ? `${crossings.length} Wechsel an der 180°-Linie zwischen aufeinanderfolgenden Stundenwerten.`
      : "Kein Wechsel an der 180°-Linie zwischen den Stundenwerten.";
    crossingSelector.replaceChildren(new Option(crossings.length ? "Marke auswählen" : "Keine Übergänge", ""));
    crossingSelector.options[0].disabled = true;
    for (const crossing of crossings) {
      crossingSelector.add(new Option(crossingLabel(crossing), String(crossing.sample)));
    }
    crossingSelector.disabled = !crossings.length;
    strip.title = "";
    strip.style.cursor = "";
    stripBackground = prepareStrip(values);
    gridBackground = prepareGrid();
    previousSample = -1;
    render();
  }

  // The Kuramoto view also renders after an internal chart click changes the slider's value.
  new MutationObserver(render).observe(timeLabel, { childList:true });
  slider.addEventListener("input", () => {
    if (!movingSliderForPick) clearPick();
    render();
  });
  crossingSelector.addEventListener("change", () => {
    selectCrossing(crossings.find(({ sample }) => sample === Number(crossingSelector.value)));
  });
  strip.addEventListener("click", event => selectCrossing(crossingAt(event)));
  strip.addEventListener("pointermove", event => {
    const crossing = crossingAt(event);
    strip.style.cursor = crossing ? "pointer" : "";
    strip.title = crossing ? crossingLabel(crossing) : "";
  });
  grid.addEventListener("click", event => {
    const target = gridTarget(event);
    if (target) selectSample(target.sample, target.crossing);
  });
  grid.addEventListener("pointermove", event => {
    const target = gridTarget(event);
    grid.style.cursor = target ? "pointer" : "";
    grid.title = target?.crossing ? crossingLabel(target.crossing) : target ? sampleTime(target.sample) : "";
  });
  windowSelector.addEventListener("change", selectWindow);
  offsetSelector.addEventListener("change", () => {
    selectSampling();
    render();
  });
  slider.closest(".kuramoto-controls").after(panel);
  panel.hidden = false;
  selectSampling();
  selectWindow();
  if (window.location.hash === "#helix-jupiter-phases") panel.scrollIntoView();
})();
