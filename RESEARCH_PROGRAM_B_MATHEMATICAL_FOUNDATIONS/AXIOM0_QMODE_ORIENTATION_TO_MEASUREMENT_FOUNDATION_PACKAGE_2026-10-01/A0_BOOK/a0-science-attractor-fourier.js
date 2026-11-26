(() => {
  "use strict";

  const root = document.getElementById("attraktoren-fourier-projektionen");
  const data = window.A0_ATTRACTOR_FOURIER;
  if (!root || !data) return;

  const viewer = root.querySelector("[data-attractor-viewer]");
  const cards = root.querySelector("[data-attractor-cards]");
  const start = root.querySelector("[data-attractor-start]");
  const time = root.querySelector("[data-attractor-window]");
  const grid = root.querySelector("[data-attractor-grid]");
  const layer = root.querySelector("[data-attractor-layer]");
  const coordinates = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 2 });
  const degrees = new Intl.NumberFormat("de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const strength = new Intl.NumberFormat("de-DE", { minimumFractionDigits: 3, maximumFractionDigits: 6 });
  const colors = [[13, 8, 39], [58, 15, 94], [119, 28, 109], [187, 55, 84],
    [239, 113, 54], [251, 191, 80], [252, 254, 164]];
  const palette = Array.from({ length: 256 }, (_, i) => {
    const position = i * (colors.length - 1) / 255;
    const left = Math.min(Math.floor(position), colors.length - 2);
    const fraction = position - left;
    return colors[left].map((value, channel) =>
      Math.round(value + fraction * (colors[left + 1][channel] - value)));
  });
  const extent = data.radius;
  const bins = 2 * extent + 1;
  const tile = 10;
  const plotSize = bins * tile;
  const bandSpecs = [
    { low: 2, high: 8, color: "#5ff3ff" },
    { low: 8, high: 16, color: "#a0ff93" }
  ];

  function showMap(canvas, item, isControl) {
    const ctx = canvas.getContext("2d");
    const pixels = atob(isControl ? item.control_map : item.map);
    const middle = plotSize / 2;
    for (let row = 0; row < bins; row += 1) {
      for (let column = 0; column < bins; column += 1) {
        const code = pixels.charCodeAt((bins - 1 - row) * bins + column);
        ctx.fillStyle = row === extent && column === extent ? "#616c80" : "rgb(" + palette[code].join(",") + ")";
        ctx.fillRect(column * tile, row * tile, tile, tile);
      }
    }
    ctx.strokeStyle = "#d4cad2";
    ctx.lineWidth = 1;
    for (const radius of [2, 8, 16]) {
      ctx.beginPath();
      ctx.arc(middle, middle, radius * tile, 0, 2 * Math.PI);
      ctx.stroke();
    }
    if (isControl) return;
    for (const [index, measured] of item.bands.entries()) {
      const band = bandSpecs[index];
      const angle = measured[0] * Math.PI / 180;
      const point = (radius) => [
        middle + radius * tile * Math.cos(angle),
        middle - radius * tile * Math.sin(angle)
      ];
      ctx.setLineDash(measured[4] ? [] : [4, 4]);
      for (const sign of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(...point(sign * band.low));
        ctx.lineTo(...point(sign * band.high));
        ctx.lineWidth = 6;
        ctx.strokeStyle = "#211834";
        ctx.stroke();
        ctx.lineWidth = 3;
        ctx.strokeStyle = band.color;
        ctx.stroke();
      }
    }
  }

  function paragraph(tag, text) {
    const element = document.createElement(tag);
    element.textContent = text;
    return element;
  }

  function bandReadout(measured, band) {
    const [angle, observed, q95, , above, stable] = measured;
    const row = document.createElement("div");
    row.className = "attractor-band";
    row.style.setProperty("--band-color", band.color);
    const status = stable ? " · stabil" : "";
    row.append(paragraph("strong", band.low + " ≤ |k| < " + band.high + " · " + degrees.format(angle) + "°" + status));
    const meter = document.createElement("div");
    meter.className = "attractor-meter";
    meter.setAttribute("aria-hidden", "true");
    const fill = document.createElement("span");
    const threshold = document.createElement("i");
    fill.style.width = observed * 100 + "%";
    threshold.style.left = q95 * 100 + "%";
    meter.append(fill, threshold);
    row.append(meter, paragraph("small", strength.format(observed) + (above ? " > " : " ≤ ") +
      strength.format(q95) + " (Kontrolle)"));
    return row;
  }

  function buildPane(item, role, isControl) {
    const pane = document.createElement("div");
    pane.className = "attractor-pane";
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = plotSize;
    canvas.setAttribute("role", "img");
    const mapLabel = isControl ? "Winkelkontrolle" : "räumliches Leistungsspektrum";
    canvas.setAttribute("aria-label", item.system + " · " + item.projection + " · " + role + " · " + mapLabel);
    showMap(canvas, item, isControl);
    const initial = paragraph("p", "(" + item.start.map((value) => coordinates.format(value)).join(" · ") + ")");
    initial.className = "attractor-start";
    pane.append(paragraph("h4", role), initial, canvas);
    item.bands.forEach((band, index) => pane.append(bandReadout(band, bandSpecs[index])));
    return pane;
  }

  function buildDeltas(reference, comparisons) {
    const deltas = document.createElement("div");
    deltas.className = "attractor-deltas";
    for (const [index, band] of bandSpecs.entries()) {
      const ref = reference.bands[index];
      const changes = comparisons.map(({ id, item }) => {
        const axis = item.bands[index];
        const difference = Math.abs(ref[0] - axis[0]);
        return { id, distance: Math.min(difference, 180 - difference), above: ref[4] && axis[4] };
      });
      const maximum = Math.max(...changes.map(change => change.distance));
      const row = document.createElement("div");
      row.className = "attractor-delta-row";
      row.style.setProperty("--band-color", band.color);
      const bandLabel = paragraph("span", band.low + " ≤ |k| < " + band.high);
      bandLabel.className = "attractor-delta-band";
      row.append(bandLabel);
      for (const change of changes) {
        const isMaximum = change.distance === maximum && changes.length > 1;
        const prefix = isMaximum ? "Max. Δ " : "Δ ";
        const label = paragraph("span", "Start " + change.id + " · " + prefix + degrees.format(change.distance) + "°");
        if (isMaximum) label.className = "attractor-delta-max";
        if (!change.above) label.append(paragraph("small", " · Achse an/unter Schwelle"));
        row.append(label);
      }
      deltas.append(row);
    }
    return deltas;
  }

  function render() {
    const setting = "/" + time.value + "/" + grid.value;
    const reference = data.cases["0" + setting];
    if (!reference) return;
    const selected = start.value === "both" ? ["1", "2"] : [start.value];
    const comparisons = selected.filter(id => id !== "0").map(id => ({ id, cards: data.cases[id + setting] }));
    const isTriple = comparisons.length === 2;
    cards.classList.toggle("is-triple", isTriple);
    const isControl = layer.value === "control";
    const snapshots = reference.map((item, index) => {
      const card = document.createElement("article");
      card.className = "attractor-card";
      card.append(paragraph("h3", item.system + " · " + item.projection), paragraph("p",
        "k" + item.projection[0].toLowerCase() + " waagerecht · k" + item.projection[1].toLowerCase() + " senkrecht"));
      const referencePane = buildPane(item, "Referenzstart", isControl);
      if (comparisons.length) {
        const alternatives = comparisons.map(({ id, cards: otherCards }) => ({ id, item: otherCards[index] }));
        const pair = document.createElement("div");
        pair.className = isTriple ? "attractor-pair is-triple" : "attractor-pair";
        pair.append(referencePane, ...alternatives.map(({ id, item }) => buildPane(item, "Vergleichsstart " + id, isControl)));
        card.append(pair, buildDeltas(item, alternatives));
      } else {
        card.append(referencePane);
      }
      return card;
    });
    cards.replaceChildren(...snapshots);
    viewer.hidden = false;
    root.querySelector("[data-attractor-static]").hidden = true;
  }

  [start, time, grid, layer].forEach((select) => select.addEventListener("change", render));
  render();
})();
