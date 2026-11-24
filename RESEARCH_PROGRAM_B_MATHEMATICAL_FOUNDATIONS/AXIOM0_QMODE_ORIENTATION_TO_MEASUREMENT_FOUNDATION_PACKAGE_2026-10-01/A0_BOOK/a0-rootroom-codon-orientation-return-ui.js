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
  const traveler = document.getElementById("codonTraveler");
  const animateButton = document.getElementById("animateButton");
  const animationSpeed = document.getElementById("animationSpeed");
  const animationProgress = document.getElementById("animationProgress");
  const animationStatus = document.getElementById("animationStatus");
  const phaseCode = document.getElementById("phaseCode");
  const phaseName = document.getElementById("phaseName");
  const phaseDescription = document.getElementById("phaseDescription");
  const phaseSteps = Array.from(document.querySelectorAll("#phaseSequence li"));
  const PHASES = [
    { key: "seed", code: "θ1 · SEED", name: "Ansatz setzen", description: "Der Traveler erhält seinen sichtbaren Startzustand." },
    { key: "load", code: "θ1 + θ2 · LOAD", name: "Gekoppelt laden", description: "θ2 lädt gemeinsam mit θ1; beide Anker bleiben gleichzeitig aktiv." },
    { key: "direction", code: "θ3 · DIRECTION", name: "Richtung setzen", description: "Die lokale Achse richtet den folgenden Impuls aus." },
    { key: "smack", code: "θ4 · SMACK", name: "Schwellenimpuls", description: "Ein kurzer Kontaktimpuls markiert das deklarierte Übergangsereignis." },
    { key: "push-off", code: "θ5 · PUSH-OFF", name: "In den Return lösen", description: "Der Traveler löst sich aus dem Kontakt und tritt in den Rücklauf ein." }
  ];
  let mode = "ORIENTABLE_CONTROL", loops = 1, selected = 0, receipt = engine.run({ codonKey: "F1", mode, loops });
  let animationFrame = 0, animationStart = 0, animationFraction = 0, animationPlaying = false;

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
    const [loadA, loadB] = orbit;
    const loadBridge = document.getElementById("loadBridge");
    loadBridge.setAttribute("x1", loadA[0]); loadBridge.setAttribute("y1", loadA[1]); loadBridge.setAttribute("x2", loadB[0]); loadBridge.setAttribute("y2", loadB[1]);
    const directionPoint = orbit[2];
    const directionAngle = (receipt.stations[2].angle_deg - 90) * Math.PI / 180;
    const directionGuide = document.getElementById("directionGuide");
    directionGuide.setAttribute("x1", directionPoint[0]); directionGuide.setAttribute("y1", directionPoint[1]);
    directionGuide.setAttribute("x2", directionPoint[0] + Math.cos(directionAngle) * 105); directionGuide.setAttribute("y2", directionPoint[1] + Math.sin(directionAngle) * 105);
    const smackPoint = orbit[3];
    const smackPulse = document.getElementById("smackPulse");
    smackPulse.setAttribute("cx", smackPoint[0]); smackPulse.setAttribute("cy", smackPoint[1]);
    const smackLabel = document.getElementById("smackLabel");
    smackLabel.setAttribute("x", smackPoint[0]); smackLabel.setAttribute("y", smackPoint[1] - 43);
  }
  function drawStations() {
    layer.replaceChildren();
    receipt.stations.forEach((s, i) => {
      const phase = PHASES[i];
      const isCoupledLoad = selected === 1 && i === 0;
      const [x, y] = point(s.angle_deg, 245); const g = el("g", { class: `station${i === selected ? " is-active" : ""}${isCoupledLoad ? " is-coupled" : ""}`, tabindex: "0", role: "button", "aria-label": `${s.gate}, ${phase.name}, CODON ${s.codon_key}, orientation ${s.orientation_sign}` });
      const rot = s.angle_deg + 90;
      const flap = el("path", { d: `M${x} ${y} l-42 -28 l5 55 z`, fill: s.orientation_sign < 0 ? "#ef75c7" : "#8d87c7", opacity: ".82", transform: `rotate(${rot} ${x} ${y})` });
      const pin = el("line", { x1: x - 34, y1: y, x2: x + 34, y2: y, stroke: "#bcecf0", "stroke-width": "7", "stroke-linecap": "round", transform: `rotate(${s.pin_axis_deg} ${x} ${y})` });
      const cube = el("rect", { class: "cube", x: x - 13, y: y - 13, width: "26", height: "26", rx: "3", fill: "#a9e6a0", stroke: i === selected ? "#fff" : "#5b9d74", "stroke-width": i === selected ? "3" : "1" });
      const label = el("text", { x, y: y - 24, fill: "#e8f3f4", "font-size": "13", "text-anchor": "middle" }); label.textContent = `theta${i + 1}`;
      g.append(flap, pin, cube, label); g.addEventListener("click", () => { pauseAnimation(); selected = i; drawStations(); showStation(); }); g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pauseAnimation(); selected = i; drawStations(); showStation(); } }); layer.append(g);
    });
  }
  function showPhase() {
    const phase = PHASES[selected];
    stage.dataset.phase = phase.key;
    document.getElementById("loadBridge").style.opacity = selected === 1 ? ".9" : "0";
    document.getElementById("directionGuide").style.opacity = selected === 2 ? "1" : "0";
    document.getElementById("smackPulse").style.opacity = selected === 3 ? "1" : "0";
    document.getElementById("smackLabel").style.opacity = selected === 3 ? "1" : "0";
    phaseCode.textContent = phase.code;
    phaseName.textContent = phase.name;
    phaseDescription.textContent = phase.description;
    phaseSteps.forEach((step, index) => index === selected ? step.setAttribute("aria-current", "step") : step.removeAttribute("aria-current"));
  }
  function showStation() {
    const s = receipt.stations[selected]; const phase = PHASES[selected];
    showPhase();
    stationTitle.textContent = `${s.gate.replace("theta", "θ")} · ${phase.name}`;
    const rows = [["phase", phase.key.toUpperCase()],["root", `√${[2,5,7][selected % 3]} · ${s.root_radius.toFixed(6)}`],["CODON", `${s.codon_key} · ${s.codon_triplet.join(" / ")} · Σ${s.codon_sum}`],["pin axis", `${s.pin_axis_deg.toFixed(1)}°`],["flap", s.flap_side],["pocket", s.pocket_state],["sign", s.orientation_sign > 0 ? "+1" : "−1"]];
    record.innerHTML = rows.map(([k,v]) => `<dt>${k}</dt><dd>${v}</dd>`).join("");
  }
  function render() {
    resetAnimation();
    receipt = engine.run({ codonKey: codonSelect.value, mode, loops });
    document.getElementById("coreCodon").textContent = receipt.codon_triplet.join("·");
    badge.textContent = receipt.classification.replaceAll("_", " "); badge.className = `badge ${receipt.orientation_sign < 0 ? "negative" : "positive"}`;
    summary.textContent = `${receipt.codon_key} · Σ${receipt.codon_sum} · 5 Gates · Sign ${receipt.orientation_sign > 0 ? "+1" : "−1"}`;
    drawPath(); drawStations(); showStation();
  }
  function animationDuration() { return (loops === 2 ? 9800 : 5600) / Number(animationSpeed.value); }
  function setTraveler(fraction) {
    const path = document.getElementById("transportPath");
    const length = path.getTotalLength();
    const position = path.getPointAtLength(length * Math.min(1, Math.max(0, fraction)));
    traveler.setAttribute("transform", `translate(${position.x.toFixed(2)} ${position.y.toFixed(2)})`);
    traveler.setAttribute("visibility", "visible");
    traveler.querySelector("text").textContent = receipt.codon_key;
  }
  function updateAnimation(fraction) {
    animationFraction = Math.min(1, Math.max(0, fraction));
    const visits = loops * receipt.gate_count;
    const visit = animationFraction >= 1 ? visits - 1 : Math.floor(animationFraction * visits);
    const nextSelected = visit % receipt.gate_count;
    const loopNumber = Math.min(loops, Math.floor(visit / receipt.gate_count) + 1);
    if (nextSelected !== selected) { selected = nextSelected; drawStations(); showStation(); }
    setTraveler(animationFraction);
    animationProgress.value = animationFraction * 100;
    animationProgress.textContent = `${Math.round(animationFraction * 100)}%`;
    animationStatus.value = `${receipt.codon_key} · ${PHASES[selected].code} · Loop ${loopNumber}/${loops} · ${Math.round(animationFraction * 100)}%`;
  }
  function animationStep(now) {
    if (!animationPlaying) return;
    const fraction = (now - animationStart) / animationDuration();
    updateAnimation(fraction);
    if (fraction < 1) animationFrame = requestAnimationFrame(animationStep);
    else {
      animationPlaying = false;
      animateButton.setAttribute("aria-pressed", "false");
      animateButton.textContent = "↺ Codon wiederholen";
      animationStatus.value = `${receipt.codon_key} · Return vollständig · Sign ${receipt.orientation_sign > 0 ? "+1" : "−1"}`;
    }
  }
  function pauseAnimation() {
    if (animationFrame) cancelAnimationFrame(animationFrame);
    animationFrame = 0;
    animationPlaying = false;
    if (animateButton) {
      animateButton.setAttribute("aria-pressed", "false");
      animateButton.textContent = animationFraction > 0 && animationFraction < 1 ? "▶ Fortsetzen" : "▶ Codon animieren";
    }
  }
  function resetAnimation() {
    pauseAnimation();
    animationFraction = 0;
    selected = 0;
    if (traveler) traveler.setAttribute("visibility", "hidden");
    if (animationProgress) { animationProgress.value = 0; animationProgress.textContent = "0%"; }
    if (animationStatus) animationStatus.value = `Bereit · θ1 Seed · Loop 1/${loops}`;
  }
  function toggleAnimation() {
    if (animationPlaying) { pauseAnimation(); return; }
    if (animationFraction >= 1) animationFraction = 0;
    animationPlaying = true;
    animateButton.setAttribute("aria-pressed", "true");
    animateButton.textContent = "Ⅱ Pause";
    animationStart = performance.now() - animationFraction * animationDuration();
    animationFrame = requestAnimationFrame(animationStep);
  }
  document.querySelectorAll("[data-mode]").forEach((button) => button.addEventListener("click", () => { mode = button.dataset.mode; document.querySelectorAll("[data-mode]").forEach((b) => b.setAttribute("aria-pressed", String(b === button))); render(); }));
  document.querySelectorAll("[data-loops]").forEach((button) => button.addEventListener("click", () => { loops = Number(button.dataset.loops); document.querySelectorAll("[data-loops]").forEach((b) => b.setAttribute("aria-pressed", String(b === button))); render(); }));
  codonSelect.addEventListener("change", render); document.getElementById("runButton").addEventListener("click", render);
  animateButton.addEventListener("click", toggleAnimation);
  animationSpeed.addEventListener("change", () => { if (animationPlaying) { animationStart = performance.now() - animationFraction * animationDuration(); } });
  document.getElementById("downloadButton").addEventListener("click", () => { const blob = new Blob([JSON.stringify({ ...receipt, generated_at: new Date().toISOString() }, null, 2)], { type: "application/json" }); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `a0-rootroom-codon-${receipt.codon_key.toLowerCase()}-${receipt.loops}loop.json`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 500); });
  render();
})();
