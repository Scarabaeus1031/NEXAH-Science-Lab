(function () {
  "use strict";
  const root = document.querySelector("[data-cruiser]");
  const Model = window.A0BluePinkDodecaCruiser;
  if (!root || !Model) return;
  const canvas = root.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  const progress = root.querySelector("[data-cruiser-progress]");
  const aperture = root.querySelector("[data-cruiser-aperture]");
  const thrust = root.querySelector("[data-cruiser-thrust]");
  const auto = root.querySelector("[data-cruiser-auto]");
  const face = root.querySelector("[data-cruiser-face]");
  const slot = root.querySelector("[data-cruiser-slot]");
  const spectrumLens = root.querySelector("[data-cruiser-spectrum-lens]");
  const play = root.querySelector("[data-cruiser-play]");
  const next = root.querySelector("[data-cruiser-next]");
  const badge = root.querySelector("[data-cruiser-phase]");
  const readout = Object.fromEntries([...root.querySelectorAll("[data-cruiser-readout]")].map((node) => [node.dataset.cruiserReadout, node]));
  const trace = Object.fromEntries([...root.querySelectorAll("[data-cruiser-trace]")].map((node) => [node.dataset.cruiserTrace, node]));
  face.innerHTML = Array.from({ length: 12 }, (_, index) => `<option value="${index}">D-${String(index + 1).padStart(2, "0")}</option>`).join("");
  let mode = "ASSEMBLY";
  let playing = false;
  let last = performance.now();

  function size() {
    const ratio = Math.min(2, window.devicePixelRatio || 1);
    const box = canvas.getBoundingClientRect();
    const w = Math.max(320, Math.round(box.width * ratio));
    const h = Math.max(360, Math.round(box.height * ratio));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    return { w, h };
  }
  function rotate([x, y, z], ax, ay) {
    const cy = Math.cos(ay), sy = Math.sin(ay), cx = Math.cos(ax), sx = Math.sin(ax);
    const x1 = x * cy - z * sy, z1 = x * sy + z * cy;
    return [x1, y * cx - z1 * sx, y * sx + z1 * cx];
  }
  function controlState() {
    return { mode, progress: Number(progress.value), aperture: Number(aperture.value), thrust: Number(thrust.value), spectrumLens: spectrumLens.value, faceIndex: auto.checked ? undefined : Number(face.value), addressSlot: auto.checked ? undefined : Number(slot.value) };
  }
  function drawSpectrum(state, cx, cy, scale) {
    const prismX = cx + scale * 0.52, prismY = cy + scale * 0.38, prismSize = scale * 0.16;
    ctx.save();
    ctx.strokeStyle = "#e5f7ff"; ctx.fillStyle = "#dff8ff18"; ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.moveTo(prismX, prismY - prismSize); ctx.lineTo(prismX - prismSize * 0.86, prismY + prismSize * 0.65); ctx.lineTo(prismX + prismSize * 0.86, prismY + prismSize * 0.65); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = state.route.cutOpen ? "#ffffff" : "#75818a"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(prismX - prismSize * 0.55, prismY); ctx.stroke();
    state.spectrum.bands.forEach((band, index) => {
      const selected = index === state.spectrum.activeIndex;
      const targetX = cx + scale * (0.74 + index * 0.035), targetY = cy + scale * (0.55 + index * 0.055);
      ctx.strokeStyle = band.color; ctx.globalAlpha = state.route.cutOpen ? (selected ? 1 : 0.42) : 0.12; ctx.lineWidth = selected ? 4.5 : 1.8;
      ctx.beginPath(); ctx.moveTo(prismX + prismSize * 0.52, prismY); ctx.lineTo(targetX, targetY); ctx.stroke();
      if (selected) { ctx.fillStyle = band.color; ctx.beginPath(); ctx.arc(targetX, targetY, 5, 0, Math.PI * 2); ctx.fill(); }
    });
    ctx.globalAlpha = 1; ctx.fillStyle = state.spectrum.activeBand.color; ctx.font = `${Math.max(9, scale * 0.07)}px ui-monospace,monospace`; ctx.textAlign = "left";
    ctx.fillText(`${state.spectrum.lens} · ${state.spectrum.activeBand.id} · ${state.spectrum.activeBand.wavelengthNm} nm`, prismX - prismSize, prismY + prismSize * 1.15);
    ctx.restore();
    return [prismX, prismY];
  }
  function draw(state) {
    const { w, h } = size(), cx = w * 0.5, cy = h * 0.48, scale = Math.min(w, h) * 0.22;
    ctx.clearRect(0, 0, w, h);
    const grid = ctx.createRadialGradient(cx, cy, 0, cx, cy, scale * 2.4);
    grid.addColorStop(0, "#12374a"); grid.addColorStop(1, "#03131c"); ctx.fillStyle = grid; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "#3d758833"; ctx.lineWidth = 1;
    for (let index = 1; index < 7; index += 1) { ctx.beginPath(); ctx.arc(cx, cy, scale * index / 3, 0, Math.PI * 2); ctx.stroke(); }
    const showHull = ["ASSEMBLY", "HULL", "BRIDGE", "RETURN"].includes(mode);
    const showBody = ["ASSEMBLY", "INTERIOR", "BRIDGE", "RETURN"].includes(mode);
    const showAperture = ["ASSEMBLY", "APERTURE", "SPECTRUM", "BRIDGE", "RETURN"].includes(mode);
    const showSpectrum = ["ASSEMBLY", "SPECTRUM", "BRIDGE", "RETURN"].includes(mode);
    let hullPoint = [cx, cy - scale], bodyPoint = [cx, cy], diamondPoint = [cx, cy], spectrumPoint = [cx, cy];
    if (showHull) {
      const pts = state.hull.vertices.map((vertex) => { const point = rotate(vertex, 0.56, state.rotations.hull * 0.18); return [cx + point[0] * scale, cy + point[1] * scale, point[2]]; });
      const activeFace = state.hull.faces[state.hull.faceIndex];
      const polygon = activeFace.vertices.map((index) => pts[index]);
      hullPoint = polygon.reduce((sum, point) => [sum[0] + point[0] / polygon.length, sum[1] + point[1] / polygon.length], [0, 0]);
      ctx.fillStyle = "#ffd15a28"; ctx.strokeStyle = "#fff3a2"; ctx.lineWidth = 3; ctx.beginPath(); polygon.forEach((point, index) => index ? ctx.lineTo(point[0], point[1]) : ctx.moveTo(point[0], point[1])); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.lineWidth = Math.max(1.2, w / 760); ctx.strokeStyle = "#eabf5577";
      state.hull.edges.forEach(([left, right]) => { ctx.beginPath(); ctx.moveTo(pts[left][0], pts[left][1]); ctx.lineTo(pts[right][0], pts[right][1]); ctx.stroke(); });
    }
    if (showBody) {
      for (let layer = 0; layer < 3; layer += 1) {
        const radius = scale * (0.34 + layer * 0.18);
        ctx.strokeStyle = layer === state.body.layer ? "#65ecff" : "#3da9c066"; ctx.lineWidth = layer === state.body.layer ? 3 : 1.5; ctx.beginPath(); ctx.ellipse(cx, cy, radius, radius * 0.48, Math.sin(state.rotations.body) * 0.12, 0, Math.PI * 2); ctx.stroke();
        for (let channel = 0; channel < 16; channel += 1) {
          const angle = Math.PI * 2 * channel / 16 + state.rotations.body * (layer === 1 ? -1 : 1);
          const x = cx + Math.cos(angle) * radius, y = cy + Math.sin(angle) * radius * 0.48;
          const selected = channel === state.body.channel && layer === state.body.layer;
          if (selected) bodyPoint = [x, y];
          ctx.fillStyle = selected ? "#fff0a0" : "#55dced88"; ctx.beginPath(); ctx.arc(x, y, selected ? 7 : 2.2, 0, Math.PI * 2); ctx.fill();
        }
      }
    }
    if (showAperture) {
      const radius = scale * (0.20 + 0.16 * state.aperture.openness), angle = state.rotations.aperture;
      const points = [[0, -radius], [radius * 0.72, 0], [0, radius], [-radius * 0.72, 0]].map(([x, y]) => [cx + x * Math.cos(angle) - y * Math.sin(angle), cy + x * Math.sin(angle) + y * Math.cos(angle)]);
      diamondPoint = [cx, cy];
      const gradient = ctx.createLinearGradient(cx - radius, cy - radius, cx + radius, cy + radius); gradient.addColorStop(0, "#ffcf64"); gradient.addColorStop(0.48, "#ff5cad"); gradient.addColorStop(1, "#8f4ad8");
      ctx.fillStyle = gradient; ctx.strokeStyle = state.route.cutOpen ? "#8bffd6" : "#ff759e"; ctx.lineWidth = state.route.cutOpen ? 4 : 2; ctx.beginPath(); points.forEach((point, index) => index ? ctx.lineTo(point[0], point[1]) : ctx.moveTo(point[0], point[1])); ctx.closePath(); ctx.globalAlpha = state.route.cutOpen ? 0.86 : 0.45; ctx.fill(); ctx.globalAlpha = 1; ctx.stroke();
    }
    if (showSpectrum) spectrumPoint = drawSpectrum(state, cx, cy, scale);
    if (["ASSEMBLY", "BRIDGE", "RETURN"].includes(mode)) {
      ctx.save(); ctx.setLineDash([8, 7]); ctx.lineWidth = 2.5; ctx.strokeStyle = state.route.cutOpen ? state.spectrum.activeBand.color : "#ff789d"; ctx.beginPath(); ctx.moveTo(hullPoint[0], hullPoint[1]); ctx.lineTo(bodyPoint[0], bodyPoint[1]); ctx.lineTo(diamondPoint[0], diamondPoint[1]); ctx.lineTo(spectrumPoint[0], spectrumPoint[1]); ctx.lineTo(cx, cy + scale * 0.9); ctx.stroke(); ctx.restore();
      ctx.fillStyle = state.route.cutOpen ? state.spectrum.activeBand.color : "#ff789d"; ctx.beginPath(); ctx.arc(cx, cy + scale * 0.9, 8 + state.route.cutDepth * 8, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = "#8cb7c8"; ctx.font = `${Math.max(11, w / 78)}px ui-monospace,monospace`; ctx.textAlign = "center";
    ctx.fillText(`${state.phase} · ${state.hull.faces[state.hull.faceIndex].id}:${state.route.addressSlot + 1} → ${state.body.frame.source.sourceKey} → ${state.route.cutOpen ? state.spectrum.activeBand.id : "HOLD"} → ${state.returnCell.cell_id}`, cx, h - 60);
    badge.textContent = `${mode} · ${state.phase}`;
    readout.hull.textContent = `${state.hull.faces[state.hull.faceIndex].id} · SLOT ${state.route.addressSlot + 1}/4`;
    readout.body.textContent = `${state.body.frame.source.sourceKey} · ${state.route.addressIndex + 1}/48`;
    readout.diamond.textContent = `${Math.round(state.aperture.openness * 100)}% · ${state.route.cutOpen ? "CUT" : "ALIGN"}`;
    readout.gate.textContent = `${state.route.cutOpen ? "OPEN" : "HOLD"} · ${state.route.gateSignal.toFixed(3)} / ${state.route.gateThreshold.toFixed(3)}`;
    readout.gate.dataset.cut = state.route.cutOpen ? "open" : "hold";
    readout.spectrum.textContent = `${state.spectrum.lens} · ${state.spectrum.activeBand.id} · ${state.spectrum.activeBand.wavelengthNm} nm · ${state.spectrum.status.replace("SPECTRUM_", "")}`;
    readout.spectrum.style.color = state.route.cutOpen ? state.spectrum.activeBand.color : "#ff789d";
    readout.cell.textContent = state.returnCell.cell_id; readout.status.textContent = state.phase;
    state.route.trace.forEach((item) => { trace[item.phase].dataset.state = item.status.toLowerCase(); });
    if (auto.checked) { face.value = state.route.faceIndex; slot.value = state.route.addressSlot; }
  }
  function render() { draw(Model.assemblyState(controlState())); }
  function tick(now) { if (playing) { progress.value = (Number(progress.value) + (now - last) / 12000) % 1; render(); } last = now; requestAnimationFrame(tick); }
  root.querySelectorAll("[data-cruiser-mode]").forEach((button) => button.addEventListener("click", () => { mode = button.dataset.cruiserMode; root.querySelectorAll("[data-cruiser-mode]").forEach((item) => item.setAttribute("aria-pressed", String(item === button))); render(); }));
  [progress, aperture, thrust, spectrumLens, face, slot].forEach((input) => input.addEventListener("input", render));
  auto.addEventListener("change", () => { face.disabled = auto.checked; slot.disabled = auto.checked; render(); });
  play.addEventListener("click", () => { playing = !playing; play.textContent = playing ? "PAUSE ROUTE" : "PLAY ROUTE"; });
  next.addEventListener("click", () => { playing = false; play.textContent = "PLAY ROUTE"; if (auto.checked) progress.value = ((Math.floor(Number(progress.value) * 48) + 1) % 48) / 48; else if (Number(slot.value) < 3) slot.value = Number(slot.value) + 1; else { slot.value = 0; face.value = (Number(face.value) + 1) % 12; } render(); });
  root.querySelector("[data-cruiser-export]").addEventListener("click", () => { const receipt = Model.assemblyReceipt(controlState()); const blob = new Blob([JSON.stringify(receipt, null, 2)], { type: "application/json" }); const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = "a0-blue-pink-dodeca-coupled-return.json"; link.click(); setTimeout(() => URL.revokeObjectURL(link.href), 500); });
  window.addEventListener("resize", render); render(); requestAnimationFrame(tick);
})();
