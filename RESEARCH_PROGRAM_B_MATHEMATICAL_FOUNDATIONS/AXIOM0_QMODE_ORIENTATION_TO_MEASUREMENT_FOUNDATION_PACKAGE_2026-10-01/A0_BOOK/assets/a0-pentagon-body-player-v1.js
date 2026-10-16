(function (root, factory) {
  const api = factory(
    typeof module === "object" && module.exports ? require("./a0-blue-body-interior-crt16-v1.js") : root.A0BlueBodyInteriorCRT16,
    typeof module === "object" && module.exports ? require("./a0-blue-body-life-transfer-v1.js") : root.A0BlueBodyLifeTransfer,
    typeof module === "object" && module.exports ? require("./a0-tessarec-blue-body-v1.js") : root.A0TessarecBlueBody
  );
  if (typeof module === "object" && module.exports) module.exports = api;
  root.A0PentagonBodyPlayer = api;
}(typeof globalThis !== "undefined" ? globalThis : this, function (blue, transfer, blueBody) {
  "use strict";

  if (!blue || !transfer || !blueBody) throw new Error("A0 Blue Body, shell and LIFE transfer modules are required");

  const CLAIM_BOUNDARY = "SOURCE_BOUND_3D_RECORD_VIEW_TYPED_IHARA_C5_ADAPTER_FIBONACCI_PHI_RANK_EULER_PHASE_TIMES7_COMPOSITION_AND_C5_STEP2_SWITCHES_Q4_HOUSE_DISTRIBUTION_Q_DEGREE_VIEW_AXIS_AND_UNCHANGED_B3S23_PERIOD2_FIXTURE_ONLY_NO_DEEP_FIBONACCI_EULER_GENERATOR_NO_NATURAL_FIBONACCI_OR_VENUS_LAW_NO_INTRINSIC_3D_LIFE_RULE_NO_DODECAHEDRON_OR_Q_DEGREE_CARRIER_IDENTITY_NO_CANONICAL_VM_OPERATOR_NO_PHYSICAL_BODY_NO_STUDY_OR_PUBLICATION";
  const LAYER_COLORS = Object.freeze(["#29c7ef", "#ee6ca5", "#e5b340"]);
  const PULSE_SEED = Object.freeze([
    Object.freeze({ x: 6, y: 0 }), Object.freeze({ x: 5, y: 1 }), Object.freeze({ x: 7, y: 1 }), Object.freeze({ x: 6, y: 2 }),
    Object.freeze({ x: 1, y: 4 }), Object.freeze({ x: 2, y: 4 }), Object.freeze({ x: 3, y: 4 })
  ]);
  const SEQUENCE_IDS = Object.freeze(["layer1617", "gray", "d5", "ihara5", "fibonacci", "fibonacciEuler7", "rose5", "euler7", "prime17", "janus", "ordinal"]);
  const SEQUENCE_LABELS = Object.freeze({
    layer1617: "16/17 layer staircase",
    gray: "Gray / Hamming path",
    d5: "D5 pentagon orbit",
    ihara5: "Ihara C5 inner-ring relay",
    fibonacci: "Fibonacci φ-rank schedule",
    fibonacciEuler7: "Fibonacci → Euler +7 coupling",
    rose5: "Rose / C5 step-2 star",
    euler7: "Euler +7 arc",
    prime17: "Prime +17 orbit",
    janus: "Janus / House Q4 braid",
    ordinal: "Ordinal control"
  });
  const SEQUENCE_NOTES = Object.freeze({
    layer1617: "Exact channel-wise P0→P1→P2 staircase.",
    gray: "Exact four-bit reflected Gray ordering within each P-layer.",
    d5: "Exact spoke-interleaving view over three five-address rings.",
    ihara5: "Typed C5 relay; not an identity with the source graph's directed-edge carrier.",
    fibonacci: "Existing A0 schedule uₖ=frac(k/φ), rank-quantized to 48 unique addresses; no natural Fibonacci law is claimed.",
    fibonacciEuler7: "Typed composition k→frac(k/φ)→exp(2πiuₖ)→rank₄₈→7·rank mod 48; regularity is construction-bound, not a Fibonacci–Euler theorem.",
    rose5: "Exact +2 mod 5 pentagram orbit on each five-address ring; 13, 157, 2041 and Venus remain source-image labels only.",
    euler7: "Exact +7 mod 48 permutation.",
    prime17: "Exact +17 mod 48 permutation.",
    janus: "Exact complement braid over the House Q4 ledger.",
    ordinal: "Sequential control 0…47."
  });

  function fibonacciRankSequence(sampleCount = 48) {
    const phi = (1 + Math.sqrt(5)) / 2;
    const samples = Array.from({ length: sampleCount }, (_, index) => ({ index, fraction: index / phi - Math.floor(index / phi) }));
    const rankByIndex = new Map([...samples].sort((left, right) => left.fraction - right.fraction).map((sample, rank) => [sample.index, rank]));
    return Object.freeze(samples.map((sample) => rankByIndex.get(sample.index)));
  }

  function fibonacciEulerCoupling(step = 0) {
    const sampleCount = 48;
    const normalizedStep = ((Math.trunc(Number(step)) % sampleCount) + sampleCount) % sampleCount;
    const phi = (1 + Math.sqrt(5)) / 2;
    const fraction = normalizedStep / phi - Math.floor(normalizedStep / phi);
    const angleRadians = 2 * Math.PI * fraction;
    const rankAddress = fibonacciRankSequence(sampleCount)[normalizedStep];
    const eulerAddress = rankAddress * 7 % sampleCount;
    return Object.freeze({
      step: normalizedStep,
      sampleCount,
      fraction,
      angleRadians,
      angleDegrees: angleRadians * 180 / Math.PI,
      phaseReal: Math.cos(angleRadians),
      phaseImaginary: Math.sin(angleRadians),
      rankAddress,
      eulerMultiplier: 7,
      eulerAddress,
      completePermutationReason: "gcd(7,48)=1"
    });
  }

  function buildSequence(id = "layer1617") {
    if (id === "layer1617") return Object.freeze(Array.from({ length: 16 }, (_, channel) => [channel, 16 + channel, 32 + channel]).flat());
    if (id === "gray") {
      const path = Array.from({ length: 16 }, (_, value) => value ^ (value >> 1));
      return Object.freeze([0, 1, 2].flatMap((layer) => path.map((channel) => layer * 16 + channel)));
    }
    if (id === "d5") {
      const pentagon = Array.from({ length: 5 }, (_, spoke) => [spoke, 5 + spoke, 10 + spoke]).flat().concat(15);
      return Object.freeze([0, 1, 2].flatMap((layer) => pentagon.map((channel) => layer * 16 + channel)));
    }
    if (id === "ihara5") {
      // Typed adapter from the Ihara/Hashimoto inner Petersen picture: every
      // five-address block is a primitive directed C5 class with no immediate
      // reverse step.  The 16th address is the explicit aperture seam.  This
      // does not identify the 48-address carrier with the 60 directed edges of
      // the dodecahedron graph used by the source instrument.
      const relay = [0, 1, 2, 3, 4, 9, 8, 7, 6, 5, 10, 11, 12, 13, 14, 15];
      return Object.freeze([0, 1, 2].flatMap((layer) => relay.map((channel) => layer * 16 + channel)));
    }
    if (id === "fibonacci") return fibonacciRankSequence(48);
    if (id === "fibonacciEuler7") return Object.freeze(Array.from({ length: 48 }, (_, step) => fibonacciEulerCoupling(step).eulerAddress));
    if (id === "rose5") {
      const star = [0, 2, 4, 1, 3, 5, 7, 9, 6, 8, 10, 12, 14, 11, 13, 15];
      return Object.freeze([0, 1, 2].flatMap((layer) => star.map((channel) => layer * 16 + channel)));
    }
    if (id === "euler7") return Object.freeze(Array.from({ length: 48 }, (_, step) => step * 7 % 48));
    if (id === "prime17") return Object.freeze(Array.from({ length: 48 }, (_, step) => step * 17 % 48));
    if (id === "janus") {
      const braid = [];
      for (let layer = 0; layer < 3; layer += 1) for (let offset = 0; offset < 8; offset += 1) {
        const left = layer % 2 === 0 ? offset : 15 - offset;
        const right = 15 - left;
        braid.push(layer * 16 + left, layer * 16 + right);
      }
      return Object.freeze(braid);
    }
    return Object.freeze(Array.from({ length: 48 }, (_, index) => index));
  }

  function validateSequences() {
    return Object.freeze(Object.fromEntries(SEQUENCE_IDS.map((id) => {
      const sequence = buildSequence(id);
      return [id, Object.freeze({ length: sequence.length, unique: new Set(sequence).size, complete: sequence.length === 48 && new Set(sequence).size === 48, startsAt: sequence[0], returnsTo: sequence[0] })];
    })));
  }

  const cellKey = (cell) => `${cell.x},${cell.y}`;
  const sourceIndex = (sourceKey) => {
    const source = blue.unbind(sourceKey);
    return source ? source.layer * 16 + source.channel : -1;
  };

  function buildBody() {
    const nodes = [];
    for (let layer = 0; layer < 3; layer += 1) {
      for (let channel = 0; channel < 16; channel += 1) {
        const source = blue.bind(layer, channel);
        if (channel === 15) {
          nodes.push(Object.freeze({ ...source, x: 0, y: 0, z: (layer - 1) * 1.08, ring: 3, spoke: 0 }));
          continue;
        }
        const ring = Math.floor(channel / 5);
        const spoke = channel % 5;
        const direction = layer === 1 ? -1 : 1;
        const angle = -Math.PI / 2 + direction * spoke * Math.PI * 2 / 5 + ring * Math.PI / 5 + layer * Math.PI / 10;
        const radius = 0.62 + ring * 0.43;
        nodes.push(Object.freeze({ ...source, x: Math.cos(angle) * radius, y: Math.sin(angle) * radius, z: (layer - 1) * 1.08, ring, spoke }));
      }
    }
    const edges = [];
    const add = (a, b, kind) => edges.push(Object.freeze({ a: `P${a.layer}:${a.q4Bits}`, b: `P${b.layer}:${b.q4Bits}`, kind }));
    for (let layer = 0; layer < 3; layer += 1) {
      for (let ring = 0; ring < 3; ring += 1) {
        for (let spoke = 0; spoke < 5; spoke += 1) {
          const a = blue.bind(layer, ring * 5 + spoke);
          const b = blue.bind(layer, ring * 5 + ((spoke + 1) % 5));
          add(a, b, "pentagon");
          if (ring < 2) add(a, blue.bind(layer, (ring + 1) * 5 + spoke), "radial");
          if (ring === 0) add(blue.bind(layer, 15), a, "aperture");
        }
      }
    }
    for (let layer = 0; layer < 2; layer += 1) {
      for (let channel = 0; channel < 16; channel += 1) add(blue.bind(layer, channel), blue.bind(layer + 1, channel), "layer");
    }
    return Object.freeze({ nodes: Object.freeze(nodes), edges: Object.freeze(edges) });
  }

  function activeSources(cells) {
    return Object.freeze(cells.map((cell) => transfer.cellToSource(cell)).filter(Boolean));
  }

  function layerCounts(cells) {
    const counts = [0, 0, 0];
    for (const source of activeSources(cells)) counts[source.layer] += 1;
    return Object.freeze(counts);
  }

  function patternReceipt(cells, generation, witness) {
    const sources = activeSources(cells);
    const returned = sources.map((source) => transfer.sourceToCell(source.sourceKey));
    const exactCurrentFrame = returned.length === cells.length
      && new Set(returned.map(cellKey)).size === cells.length
      && transfer.signature(returned) === transfer.signature(cells);
    return Object.freeze({
      status: !exactCurrentFrame ? "HOLD_CURRENT_FRAME_MISMATCH" : witness ? "PASS_CURRENT_FRAME_ADDRESS_RETURN" : "HOLD_HISTORY_WITNESS_WITHHELD",
      generation,
      activeCells: cells.length,
      sourceKeys: Object.freeze(sources.map((source) => source.sourceKey)),
      layerCounts: layerCounts(cells),
      residual: exactCurrentFrame ? 0 : "CURRENT_FRAME_ADDRESS_MISMATCH",
      historyReturn: witness ? "RETAINED_FRAME_SEQUENCE" : "NOT_RECONSTRUCTED_FROM_CURRENT_PATTERN",
      claimBoundary: CLAIM_BOUNDARY
    });
  }

  function pulseFrame(generation = 0, witness = true) {
    let cells = PULSE_SEED.map((cell) => ({ ...cell }));
    for (let step = 0; step < generation; step += 1) cells = transfer.lifeStep(cells);
    return Object.freeze({ generation, cells: Object.freeze(cells), receipt: patternReceipt(cells, generation, witness) });
  }

  function validatePlayer() {
    const body = buildBody();
    const phase0 = pulseFrame(0);
    const phase1 = pulseFrame(1);
    const phase2 = pulseFrame(2);
    return Object.freeze({
      nodes: body.nodes.length,
      uniqueSourceKeys: new Set(body.nodes.map((node) => node.sourceKey)).size,
      edges: body.edges.length,
      layers: Object.freeze([0, 1, 2].map((layer) => body.nodes.filter((node) => node.layer === layer).length)),
      pulsePeriod: transfer.signature(phase0.cells) === transfer.signature(phase2.cells) && transfer.signature(phase0.cells) !== transfer.signature(phase1.cells) ? 2 : null,
      phase0LayerCounts: phase0.receipt.layerCounts,
      phase1LayerCounts: phase1.receipt.layerCounts,
      currentFrameReturn: phase0.receipt.status,
      boundary: CLAIM_BOUNDARY
    });
  }

  function mount(rootElement) {
    if (!rootElement || typeof document === "object" && !rootElement.querySelector) return null;
    const body = buildBody();
    const nodeByKey = new Map(body.nodes.map((node) => [node.sourceKey, node]));
    const canvas = rootElement.querySelector("#bodyPlayerCanvas");
    const ctx = canvas && canvas.getContext ? canvas.getContext("2d") : null;
    const layerView = rootElement.querySelector("#bodyLayerView");
    const houseView = rootElement.querySelector("#bodyHouseView");
    const lifeView = rootElement.querySelector("#bodyLifeGrid");
    const trace = rootElement.querySelector("#bodyTrace");
    const receiptView = rootElement.querySelector("#bodyPlayerReceipt");
    const address = rootElement.querySelector("#bodyAddress");
    const addressValue = rootElement.querySelector("#bodyAddressValue");
    const speed = rootElement.querySelector("#bodySpeed");
    const speedValue = rootElement.querySelector("#bodySpeedValue");
    const sequenceSelect = rootElement.querySelector("#bodySequence");
    const witness = rootElement.querySelector("#bodyPlayerWitness");
    const play = rootElement.querySelector("#bodyPlayerPlay");
    const stepButton = rootElement.querySelector("#bodyPlayerStep");
    const reset = rootElement.querySelector("#bodyPlayerReset");
    const modeButtons = Array.from(rootElement.querySelectorAll("[data-body-mode]"));
    const viewButtons = Array.from(rootElement.querySelectorAll("[data-body-view]"));
    const blueCanvas = rootElement.querySelector("#bodyBlueCanvas");
    const blueCtx = blueCanvas && blueCanvas.getContext ? blueCanvas.getContext("2d") : null;
    const blueViewLabel = rootElement.querySelector("#bodyBlueViewLabel");
    if (!canvas || !ctx || !layerView || !houseView || !lifeView || !trace || !receiptView || !address || !play || !sequenceSelect || !blueCanvas || !blueCtx) return null;
    Array.from(sequenceSelect.options || []).forEach((option) => { if (SEQUENCE_LABELS[option.value]) option.textContent = SEQUENCE_LABELS[option.value]; });

    let mode = "address";
    let sequenceId = sequenceSelect.value || "layer1617";
    let sequence = buildSequence(sequenceId);
    let sequenceCursor = 0;
    let viewMode = "day";
    let generation = 0;
    let cells = [transfer.sourceToCell(blue.bind(0, 0).sourceKey)];
    let timer = 0;
    let yaw = -0.62, pitch = -0.32, zoom = 1;
    let blueYaw = 0.46, bluePitch = -0.18, blueDrag = null, blueProjected = [];
    let projected = [];
    let drag = null;
    const shell = blueBody.buildShell();
    const shellMapping = blueBody.grayBaseline();
    const ringSpec = Object.freeze({ A: [1.03, 2.36, 0], B: [1.66, 1.14, 0], C: [1.98, .72, Math.PI / 8], E: [1.98, -.72, Math.PI / 8], D: [1.66, -1.14, 0], F: [1.03, -2.36, 0] });
    const shellPoints = Object.freeze(Object.fromEntries(Object.entries(ringSpec).flatMap(([ring, [radius, y, offset]]) => Array.from({ length: 8 }, (_, index) => {
      const angle = index * Math.PI / 4 + offset;
      return [`${ring}${index}`, Object.freeze({ x: radius * Math.cos(angle), y, z: radius * Math.sin(angle) })];
    }))));

    function selectedKeys() { return new Set(activeSources(cells).map((source) => source.sourceKey)); }
    function setAddress(index, syncCursor = true) {
      const normalized = ((Number(index) % 48) + 48) % 48;
      address.value = normalized;
      if (syncCursor) {
        const found = sequence.indexOf(normalized);
        sequenceCursor = found < 0 ? 0 : found;
      }
      const source = blue.bind(Math.floor(normalized / 16), normalized % 16);
      cells = [transfer.sourceToCell(source.sourceKey)];
      generation = 0;
    }
    function resetMode() {
      generation = 0;
      if (mode === "address") { sequenceCursor = 0; setAddress(sequence[0], false); }
      else cells = PULSE_SEED.map((cell) => ({ ...cell }));
    }
    function step() {
      if (mode === "address") { sequenceCursor = (sequenceCursor + 1) % sequence.length; setAddress(sequence[sequenceCursor], false); }
      else { cells = transfer.lifeStep(cells); generation += 1; }
      render();
    }
    function stop() {
      if (timer) clearInterval(timer);
      timer = 0;
      play.textContent = "Play";
      play.setAttribute("aria-pressed", "false");
    }
    function start() {
      stop();
      timer = setInterval(step, Number(speed.value));
      play.textContent = "Pause";
      play.setAttribute("aria-pressed", "true");
    }

    function rotated(node) {
      const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
      const x1 = node.x * cy + node.z * sy;
      const z1 = -node.x * sy + node.z * cy;
      return { x: x1, y: node.y * cp - z1 * sp, z: node.y * sp + z1 * cp };
    }
    function drawPentagon(x, y, radius) {
      ctx.beginPath();
      for (let i = 0; i < 5; i += 1) {
        const angle = -Math.PI / 2 + i * Math.PI * 2 / 5;
        const px = x + Math.cos(angle) * radius, py = y + Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath();
    }
    function drawBody(active) {
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(320, rect.width || 720), height = Math.max(320, rect.height || 520);
      const ratio = Math.min(2, globalThis.devicePixelRatio || 1);
      if (canvas.width !== Math.round(width * ratio) || canvas.height !== Math.round(height * ratio)) {
        canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
      }
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.clearRect(0, 0, width, height);
      const scale = Math.min(width, height) * 0.27 * zoom;
      projected = body.nodes.map((node) => {
        const p = rotated(node), perspective = 1 / (1.18 - p.z * 0.12);
        return { ...node, depth: p.z, sx: width / 2 + p.x * scale * perspective, sy: height / 2 + p.y * scale * perspective };
      });
      const byKey = new Map(projected.map((node) => [node.sourceKey, node]));
      for (const edge of body.edges) {
        const a = byKey.get(edge.a), b = byKey.get(edge.b);
        const hot = active.has(edge.a) && active.has(edge.b);
        ctx.beginPath(); ctx.moveTo(a.sx, a.sy); ctx.lineTo(b.sx, b.sy);
        ctx.strokeStyle = hot ? "rgba(255,255,255,.82)" : edge.kind === "layer" ? "rgba(238,108,165,.24)" : "rgba(96,151,174,.22)";
        ctx.lineWidth = hot ? 2.4 : edge.kind === "layer" ? 1.2 : 0.85; ctx.stroke();
      }
      for (const node of [...projected].sort((a, b) => a.depth - b.depth)) {
        const hot = active.has(node.sourceKey), radius = hot ? 10 : node.channel === 15 ? 7 : 5.5;
        if (hot) { ctx.shadowBlur = 22; ctx.shadowColor = LAYER_COLORS[node.layer]; }
        drawPentagon(node.sx, node.sy, radius);
        ctx.fillStyle = hot ? LAYER_COLORS[node.layer] : "rgba(8,35,50,.92)";
        ctx.strokeStyle = hot ? "#fff" : `${LAYER_COLORS[node.layer]}88`;
        ctx.lineWidth = hot ? 2 : 1; ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
      }
      ctx.fillStyle = "rgba(220,237,243,.72)"; ctx.font = "11px ui-monospace, monospace";
      ctx.fillText("drag · rotate", 16, 22); ctx.fillText("click tile · select address", 16, 39);
    }

    function drawBlueBody(active) {
      const rect = blueCanvas.getBoundingClientRect();
      const width = Math.max(320, rect.width || 720), height = Math.max(300, rect.height || 460);
      const ratio = Math.min(2, globalThis.devicePixelRatio || 1);
      if (blueCanvas.width !== Math.round(width * ratio) || blueCanvas.height !== Math.round(height * ratio)) {
        blueCanvas.width = Math.round(width * ratio); blueCanvas.height = Math.round(height * ratio);
      }
      blueCtx.setTransform(ratio, 0, 0, ratio, 0, 0); blueCtx.clearRect(0, 0, width, height);
      const mirror = viewMode === "mirror" ? -1 : 1, cy = Math.cos(blueYaw), sy = Math.sin(blueYaw), cp = Math.cos(bluePitch), sp = Math.sin(bluePitch);
      const scale = Math.min(width / 6.4, height / 6.25);
      blueProjected = Object.entries(shellPoints).map(([id, point]) => {
        const x1 = (point.x * cy - point.z * sy) * mirror, z1 = point.x * sy + point.z * cy;
        const y1 = point.y * cp - z1 * sp, z2 = point.y * sp + z1 * cp, perspective = 5.8 / (5.8 + z2);
        return { id, depth: z2, sx: width / 2 + x1 * scale * perspective, sy: height / 2 - y1 * scale * perspective };
      });
      const byId = new Map(blueProjected.map((point) => [point.id, point]));
      const activeHosts = new Set([...active].map((key) => shellMapping[key]));
      const day = "41,199,239", night = "238,108,165";
      const faces = shell.faces.map((face) => ({ ...face, depth: face.vertices.reduce((sum, id) => sum + byId.get(id).depth, 0) / face.vertices.length })).sort((a, b) => a.depth - b.depth);
      for (const face of faces) {
        const points = face.vertices.map((id) => byId.get(id)), hot = face.vertices.some((id) => activeHosts.has(id));
        blueCtx.beginPath(); points.forEach((point, index) => index ? blueCtx.lineTo(point.sx, point.sy) : blueCtx.moveTo(point.sx, point.sy)); blueCtx.closePath();
        const sideColor = viewMode === "day" ? day : viewMode === "night" ? night : points.reduce((sum, point) => sum + point.sx, 0) / points.length < width / 2 ? day : night;
        blueCtx.fillStyle = hot ? `rgba(${sideColor},.56)` : `rgba(${sideColor},.105)`;
        blueCtx.strokeStyle = hot ? "#fff" : `rgba(${sideColor},.58)`; blueCtx.lineWidth = hot ? 2.4 : .85; blueCtx.fill(); blueCtx.stroke();
      }
      for (const point of blueProjected) {
        const hot = activeHosts.has(point.id), radius = hot ? 8 : 3.4; blueCtx.beginPath();
        for (let index = 0; index < 5; index += 1) { const angle = -Math.PI / 2 + index * Math.PI * 2 / 5, x = point.sx + Math.cos(angle) * radius, y = point.sy + Math.sin(angle) * radius; index ? blueCtx.lineTo(x, y) : blueCtx.moveTo(x, y); }
        blueCtx.closePath();
        blueCtx.fillStyle = hot ? viewMode === "night" ? "#ee6ca5" : viewMode === "mirror" ? "#e5b340" : "#29c7ef" : "rgba(221,240,246,.72)";
        blueCtx.strokeStyle = hot ? "#fff" : "rgba(4,26,38,.8)"; blueCtx.lineWidth = hot ? 2 : .7; blueCtx.fill(); blueCtx.stroke();
      }
      const modeLabel = viewMode === "day" ? "DAY · BLUE" : viewMode === "night" ? "NIGHT · PINK" : "VIEW / MIRROR · BILATERAL";
      blueCtx.fillStyle = viewMode === "night" ? "#ffb5d0" : viewMode === "mirror" ? "#ffe09a" : "#bff4ff"; blueCtx.font = "700 11px ui-monospace, monospace";
      blueCtx.fillText(modeLabel, 16, 23); blueCtx.fillStyle = "rgba(196,220,229,.72)"; blueCtx.fillText("O₂–P₁₆–H₈ · drag to rotate · sequence-synchronized", 16, 41);
      if (blueViewLabel) blueViewLabel.textContent = `${modeLabel} · ${[...activeHosts].join(" · ") || "EMPTY"}`;
    }

    function layerMarkup(active) {
      const panels = [0, 1, 2].map((layer) => {
        const cx = 95 + layer * 190, cy = 115;
        const rings = [31, 54, 77].map((radius, ring) => {
          const points = Array.from({ length: 5 }, (_, spoke) => {
            const direction = layer === 1 ? -1 : 1;
            const angle = -Math.PI / 2 + direction * spoke * Math.PI * 2 / 5 + ring * Math.PI / 5 + layer * Math.PI / 10;
            return `${(cx + Math.cos(angle) * radius).toFixed(1)},${(cy + Math.sin(angle) * radius).toFixed(1)}`;
          }).join(" ");
          return `<polygon class="body-layer-ring" points="${points}"/>`;
        }).join("");
        const nodes = body.nodes.filter((node) => node.layer === layer).map((node) => {
          const px = cx + node.x * 55, py = cy + node.y * 55;
          return `<circle class="body-layer-node${active.has(node.sourceKey) ? " active" : ""}" style="--layer:${LAYER_COLORS[layer]}" cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${active.has(node.sourceKey) ? 6 : 3.2}" data-key="${node.sourceKey}"/>`;
        }).join("");
        return `<g><text class="body-layer-label" x="${cx}" y="18" text-anchor="middle">P${layer}</text>${rings}<circle class="body-layer-aperture" cx="${cx}" cy="${cy}" r="14"/>${nodes}</g>`;
      }).join("");
      layerView.innerHTML = `<title>Three synchronized pentagon layers</title>${panels}`;
    }

    function lifeMarkup() {
      const active = new Set(cells.map(cellKey));
      const parts = [];
      for (let y = 0; y < 6; y += 1) for (let x = 0; x < 8; x += 1) {
        const source = transfer.cellToSource({ x, y });
        parts.push(`<button type="button" class="body-life-cell${active.has(`${x},${y}`) ? " active" : ""}" style="--layer:${LAYER_COLORS[source.layer]}" data-cell="${x},${y}" title="${source.sourceKey} · (${x},${y})"><span>${source.q4Bits}</span></button>`);
      }
      lifeView.innerHTML = parts.join("");
    }

    function houseMarkup(active) {
      const x0 = 76, y0 = 54, size = 82;
      const current = activeSources(cells);
      const distribution = layerCounts(cells);
      const complements = new Set(current.map((source) => 15 - source.channel));
      const cellsMarkup = Array.from({ length: 16 }, (_, channel) => {
        const row = Math.floor(channel / 4), column = channel % 4, x = x0 + column * size, y = y0 + row * size;
        const layerHits = [0, 1, 2].filter((layer) => active.has(blue.bind(layer, channel).sourceKey));
        const classes = ["body-house-cell", layerHits.length ? "active" : "", complements.has(channel) ? "pair" : ""].filter(Boolean).join(" ");
        const dots = layerHits.map((layer, index) => `<circle cx="${x + 18 + index * 18}" cy="${y + 54}" r="6" fill="${LAYER_COLORS[layer]}" stroke="#fff" stroke-width="1"><title>P${layer}:${channel.toString(2).padStart(4, "0")}</title></circle>`).join("");
        return `<g><rect class="${classes}" x="${x}" y="${y}" width="${size}" height="${size}"/><text class="body-house-index" x="${x + 10}" y="${y + 19}">${channel.toString(2).padStart(4, "0")}</text><text class="body-house-number" x="${x + size - 10}" y="${y + 20}" text-anchor="end">${channel}</text>${dots}</g>`;
      }).join("");
      const selectedText = current.map((source) => `${source.sourceKey}↔P${source.layer}:${(15 - source.channel).toString(2).padStart(4, "0")}`).join(" · ") || "EMPTY";
      houseView.innerHTML = `<title>House bookkeeping over the Q4 address frame</title>${cellsMarkup}<line class="body-house-pillar" x1="${x0 + 2 * size - 5}" y1="${y0}" x2="${x0 + 2 * size - 5}" y2="${y0 + 4 * size}"/><line class="body-house-pillar" x1="${x0 + 2 * size + 5}" y1="${y0}" x2="${x0 + 2 * size + 5}" y2="${y0 + 4 * size}"/><line class="body-house-seam" x1="${x0}" y1="${y0 + 2 * size}" x2="${x0 + 4 * size}" y2="${y0 + 2 * size}"/><circle class="body-house-hinge" cx="${x0 + 2 * size}" cy="${y0 + 2 * size}" r="8"/><text class="body-house-caption" x="${x0 + 4 * size + 20}" y="${y0 + 24}">HOUSE · LEDGER</text><text class="body-house-caption muted" x="${x0 + 4 * size + 20}" y="${y0 + 47}">pillar = vertex</text><text class="body-house-caption muted" x="${x0 + 4 * size + 20}" y="${y0 + 68}">channel = edge</text><text class="body-house-caption muted" x="${x0 + 4 * size + 20}" y="${y0 + 89}">hinge = incidence</text><polygon class="body-kite" points="425,174 548,218 425,262"/><line class="body-kite-cut" x1="425" y1="174" x2="425" y2="262"/><text class="body-house-caption" x="486" y="286" text-anchor="middle">KITE · A2 → 3-FOLD</text><text class="body-house-caption muted" x="486" y="307" text-anchor="middle">cutEdge = φ·t·s · t=.5</text><text class="body-house-caption muted" x="486" y="328" text-anchor="middle">HYPOTHESIS ONLY</text><text class="body-house-caption" x="425" y="${y0 + 4 * size - 12}">P0:${distribution[0]} · P1:${distribution[1]} · P2:${distribution[2]}</text><text class="body-house-caption" x="${x0}" y="${y0 + 4 * size + 32}">${selectedText}</text>`;
    }

    function render() {
      const active = selectedKeys();
      const receipt = patternReceipt(cells, generation, witness.checked);
      drawBody(active); drawBlueBody(active); layerMarkup(active); houseMarkup(active); lifeMarkup();
      const sources = activeSources(cells);
      const layerText = receipt.layerCounts.map((count, layer) => `P${layer}:${count}`).join(" · ");
      addressValue.textContent = mode === "address" ? `${sequenceCursor + 1}/48 · ${sources[0]?.sourceKey || "—"}` : `${cells.length} active · g${generation}`;
      speedValue.textContent = `${Number(speed.value)} ms`;
      trace.innerHTML = `<div><small>Mode</small><strong>${mode === "address" ? "Exact sequence console" : "Three-layer B3/S23 pulse"}</strong></div><div><small>Sequence</small><strong>${mode === "address" ? SEQUENCE_LABELS[sequenceId] : "native finite-dead B3/S23"}</strong></div><div><small>Sequence contract</small><strong>${mode === "address" ? SEQUENCE_NOTES[sequenceId] : "Unchanged finite-dead B3/S23 fixture."}</strong></div><div><small>Day / Night / View–Mirror</small><strong>${viewMode.toUpperCase()}</strong></div><div><small>House / Q4 complement</small><strong>${sources.map((source) => `${source.sourceKey} ↔ P${source.layer}:${(15 - source.channel).toString(2).padStart(4, "0")}`).join(" · ") || "EMPTY"}</strong></div><div><small>Layer load</small><strong>${layerText}</strong></div><div><small>Current frame</small><strong>${sources.map((source) => source.sourceKey).join(" · ") || "EMPTY"}</strong></div><div><small>History</small><strong>${receipt.historyReturn}</strong></div>`;
      receiptView.className = `body-player-receipt ${receipt.status.startsWith("PASS") ? "pass" : "hold"}`;
      receiptView.innerHTML = `<small>typed return receipt</small><b>${receipt.status}</b><span>current-frame residual ${receipt.residual} · ${mode === "coupled" ? "native finite-dead B3/S23" : `${SEQUENCE_LABELS[sequenceId]} · permutation only`}</span>`;
      modeButtons.forEach((button) => { const current = button.dataset.bodyMode === mode; button.classList.toggle("active", current); button.setAttribute("aria-selected", String(current)); });
      viewButtons.forEach((button) => { const current = button.dataset.bodyView === viewMode; button.classList.toggle("active", current); button.setAttribute("aria-pressed", String(current)); });
      globalThis.A0PentagonBodyPlayerView = { mode, sequenceId, sequenceCursor, viewMode, generation, cells: cells.map((cell) => ({ ...cell })), receipt };
    }

    modeButtons.forEach((button) => button.addEventListener("click", () => { stop(); mode = button.dataset.bodyMode; resetMode(); render(); }));
    address.addEventListener("input", () => { stop(); mode = "address"; setAddress(Number(address.value)); render(); });
    sequenceSelect.addEventListener("change", () => { stop(); mode = "address"; sequenceId = sequenceSelect.value; sequence = buildSequence(sequenceId); resetMode(); render(); });
    viewButtons.forEach((button) => button.addEventListener("click", () => { viewMode = button.dataset.bodyView; render(); }));
    speed.addEventListener("input", () => { speedValue.textContent = `${Number(speed.value)} ms`; if (timer) start(); });
    witness.addEventListener("input", render);
    play.addEventListener("click", () => timer ? stop() : start());
    stepButton.addEventListener("click", () => { stop(); step(); });
    reset.addEventListener("click", () => { stop(); resetMode(); render(); });
    lifeView.addEventListener("click", (event) => {
      const button = event.target.closest("[data-cell]"); if (!button) return;
      stop(); mode = "coupled"; generation = 0;
      const [x, y] = button.dataset.cell.split(",").map(Number), key = `${x},${y}`;
      const active = new Map(cells.map((cell) => [cellKey(cell), cell]));
      if (active.has(key)) active.delete(key); else active.set(key, { x, y });
      cells = Array.from(active.values()); render();
    });
    canvas.addEventListener("pointerdown", (event) => { drag = { x: event.clientX, y: event.clientY, yaw, pitch, moved: false }; canvas.setPointerCapture?.(event.pointerId); });
    canvas.addEventListener("pointermove", (event) => {
      if (!drag) return; const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
      if (Math.abs(dx) + Math.abs(dy) > 3) drag.moved = true;
      yaw = drag.yaw + dx * 0.008; pitch = Math.max(-1.25, Math.min(1.25, drag.pitch + dy * 0.008)); render();
    });
    canvas.addEventListener("pointerup", (event) => {
      if (drag && !drag.moved) {
        const rect = canvas.getBoundingClientRect(), x = event.clientX - rect.left, y = event.clientY - rect.top;
        const nearest = projected.map((node) => ({ node, d: Math.hypot(node.sx - x, node.sy - y) })).sort((a, b) => a.d - b.d)[0];
        if (nearest && nearest.d < 18) { stop(); mode = "address"; setAddress(sourceIndex(nearest.node.sourceKey)); }
      }
      drag = null; render();
    });
    canvas.addEventListener("wheel", (event) => { event.preventDefault(); zoom = Math.max(.65, Math.min(1.55, zoom - event.deltaY * .001)); render(); }, { passive: false });
    blueCanvas.addEventListener("pointerdown", (event) => { blueDrag = { x: event.clientX, y: event.clientY, yaw: blueYaw, pitch: bluePitch, moved: false }; blueCanvas.setPointerCapture?.(event.pointerId); });
    blueCanvas.addEventListener("pointermove", (event) => {
      if (!blueDrag) return; const dx = event.clientX - blueDrag.x, dy = event.clientY - blueDrag.y;
      if (Math.abs(dx) + Math.abs(dy) > 3) blueDrag.moved = true;
      blueYaw = blueDrag.yaw + dx * .008; bluePitch = Math.max(-1.25, Math.min(1.25, blueDrag.pitch + dy * .008)); render();
    });
    blueCanvas.addEventListener("pointerup", (event) => {
      if (blueDrag && !blueDrag.moved) {
        const rect = blueCanvas.getBoundingClientRect(), x = event.clientX - rect.left, y = event.clientY - rect.top;
        const nearest = blueProjected.map((point) => ({ point, distance: Math.hypot(point.sx - x, point.sy - y) })).sort((left, right) => left.distance - right.distance)[0];
        if (nearest && nearest.distance < 18) {
          const source = Object.entries(shellMapping).find(([, host]) => host === nearest.point.id)?.[0];
          if (source) { stop(); mode = "address"; setAddress(sourceIndex(source)); }
        }
      }
      blueDrag = null; render();
    });
    globalThis.addEventListener?.("resize", render);
    let animationFrame = 0, lastAnimation = 0;
    function animate(now) { const elapsed = Math.min(50, now - lastAnimation); lastAnimation = now; if (!blueDrag && !globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches) { blueYaw += elapsed * (viewMode === "night" ? -.00008 : .00008); drawBlueBody(selectedKeys()); } animationFrame = globalThis.requestAnimationFrame(animate); }
    resetMode(); render();
    if (typeof globalThis.requestAnimationFrame === "function") animationFrame = globalThis.requestAnimationFrame(animate);
    return Object.freeze({ render, step, stop, setSequence: (id) => { if (!SEQUENCE_IDS.includes(id)) return false; stop(); mode = "address"; sequenceId = id; sequenceSelect.value = id; sequence = buildSequence(id); resetMode(); render(); return true; }, setView: (id) => { if (!["day", "night", "mirror"].includes(id)) return false; viewMode = id; render(); return true; }, reset: () => { resetMode(); render(); }, destroy: () => { stop(); if (animationFrame && globalThis.cancelAnimationFrame) globalThis.cancelAnimationFrame(animationFrame); } });
  }

  return Object.freeze({ CLAIM_BOUNDARY, LAYER_COLORS, PULSE_SEED, SEQUENCE_IDS, SEQUENCE_LABELS, SEQUENCE_NOTES, fibonacciRankSequence, fibonacciEulerCoupling, buildSequence, validateSequences, buildBody, activeSources, layerCounts, patternReceipt, pulseFrame, validatePlayer, mount });
}));
