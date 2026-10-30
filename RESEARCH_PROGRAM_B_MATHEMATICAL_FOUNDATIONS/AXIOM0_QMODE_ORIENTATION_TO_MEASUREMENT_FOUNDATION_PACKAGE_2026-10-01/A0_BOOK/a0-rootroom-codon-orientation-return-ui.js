(function () {
  "use strict";
  const engine = window.A0RootroomCodonReturn;
  if (!engine) return;
  const ns = "http://www.w3.org/2000/svg";
  const stage = document.getElementById("rootroomStage");
  const layer = document.getElementById("stationsLayer");
  const codonSelect = document.getElementById("codonSelect");
  const badge = document.getElementById("returnBadge");
  const summary = document.getElementById("returnSummary");
  const record = document.getElementById("stationRecord");
  const stationTitle = document.getElementById("stationTitle");
  let mode = "ORIENTABLE_CONTROL", loops = 1, selected = 0, receipt = engine.run({ codonKey: "F1", mode, loops });

  function point(angle, radius) { const a = (angle - 90) * Math.PI / 180; return [380 + Math.cos(a) * radius, 380 + Math.sin(a) * radius]; }
  function el(name, attrs) { const node = document.createElementNS(ns, name); Object.entries(attrs || {}).forEach(([k, v]) => node.setAttribute(k, v)); return node; }
  function drawPath() {
    const pts = receipt.stations.map((s, i) => point(s.angle_deg, 115 + i * 38));
    document.getElementById("spiralPath").setAttribute("d", `M380 380 ${pts.map((p) => `L${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ")}`);
    const orbit = receipt.stations.map((s) => point(s.angle_deg, 245));
    const close = orbit.concat([orbit[0]]);
    const repeats = loops === 2 ? close.concat(orbit.slice(1), [orbit[0]]) : close;
    document.getElementById("transportPath").setAttribute("d", `M${repeats.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L")}`);
    document.getElementById("transportPath").setAttribute("stroke", receipt.orientation_sign < 0 ? "#ef75c7" : "#d8aa43");
  }
  function drawStations() {
    layer.replaceChildren();
    receipt.stations.forEach((s, i) => {
      const [x, y] = point(s.angle_deg, 245); const g = el("g", { class: "station", tabindex: "0", role: "button", "aria-label": `${s.gate}, CODON ${s.codon_key}, orientation ${s.orientation_sign}` });
      const rot = s.angle_deg + 90;
      const flap = el("path", { d: `M${x} ${y} l-42 -28 l5 55 z`, fill: s.orientation_sign < 0 ? "#ef75c7" : "#8d87c7", opacity: ".82", transform: `rotate(${rot} ${x} ${y})` });
      const pin = el("line", { x1: x - 34, y1: y, x2: x + 34, y2: y, stroke: "#bcecf0", "stroke-width": "7", "stroke-linecap": "round", transform: `rotate(${s.pin_axis_deg} ${x} ${y})` });
      const cube = el("rect", { class: "cube", x: x - 13, y: y - 13, width: "26", height: "26", rx: "3", fill: "#a9e6a0", stroke: i === selected ? "#fff" : "#5b9d74", "stroke-width": i === selected ? "3" : "1" });
      const label = el("text", { x, y: y - 24, fill: "#e8f3f4", "font-size": "13", "text-anchor": "middle" }); label.textContent = `theta${i + 1}`;
      g.append(flap, pin, cube, label); g.addEventListener("click", () => { selected = i; drawStations(); showStation(); }); g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); selected = i; drawStations(); showStation(); } }); layer.append(g);
    });
  }
  function showStation() {
    const s = receipt.stations[selected]; stationTitle.textContent = `${s.gate.replace("theta", "θ")} · Green Cube`;
    const rows = [["root", `√${[2,5,7][selected % 3]} · ${s.root_radius.toFixed(6)}`],["CODON", `${s.codon_key} · ${s.codon_triplet.join(" / ")} · Σ${s.codon_sum}`],["pin axis", `${s.pin_axis_deg.toFixed(1)}°`],["flap", s.flap_side],["pocket", s.pocket_state],["sign", s.orientation_sign > 0 ? "+1" : "−1"]];
    record.innerHTML = rows.map(([k,v]) => `<dt>${k}</dt><dd>${v}</dd>`).join("");
  }
  function render() {
    receipt = engine.run({ codonKey: codonSelect.value, mode, loops });
    document.getElementById("coreCodon").textContent = receipt.codon_triplet.join("·");
    badge.textContent = receipt.classification.replaceAll("_", " "); badge.className = `badge ${receipt.orientation_sign < 0 ? "negative" : "positive"}`;
    summary.textContent = `${receipt.codon_key} · Σ${receipt.codon_sum} · 5 Gates · Sign ${receipt.orientation_sign > 0 ? "+1" : "−1"}`;
    drawPath(); drawStations(); showStation();
  }
  document.querySelectorAll("[data-mode]").forEach((button) => button.addEventListener("click", () => { mode = button.dataset.mode; document.querySelectorAll("[data-mode]").forEach((b) => b.setAttribute("aria-pressed", String(b === button))); render(); }));
  document.querySelectorAll("[data-loops]").forEach((button) => button.addEventListener("click", () => { loops = Number(button.dataset.loops); document.querySelectorAll("[data-loops]").forEach((b) => b.setAttribute("aria-pressed", String(b === button))); render(); }));
  codonSelect.addEventListener("change", render); document.getElementById("runButton").addEventListener("click", render);
  document.getElementById("downloadButton").addEventListener("click", () => { const blob = new Blob([JSON.stringify({ ...receipt, generated_at: new Date().toISOString() }, null, 2)], { type: "application/json" }); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `a0-rootroom-codon-${receipt.codon_key.toLowerCase()}-${receipt.loops}loop.json`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 500); });
  render();
})();
