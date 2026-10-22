(function (root, factory) {
  const api = factory(
    typeof module === "object" && module.exports
      ? require("./a0-blue-body-interior-crt16-v1.js")
      : root.A0BlueBodyInteriorCRT16
  );
  if (typeof module === "object" && module.exports) module.exports = api;
  root.A0BlueBodyLifeTransfer = api;
}(typeof globalThis !== "undefined" ? globalThis : this, function (blueBody) {
  "use strict";

  if (!blueBody) throw new Error("A0BlueBodyInteriorCRT16 is required");

  const WIDTH = 8;
  const HEIGHT = 6;
  const CELL_COUNT = WIDTH * HEIGHT;
  const CLAIM_BOUNDARY = "EXACT_COORDINATE_TRANSPORT_ONLY_B3S23_SINGLETON_COLLAPSE_IS_A_NEGATIVE_CONTROL_NO_CARRIER_IDENTITY_NO_LIFE08_REOPEN_NO_NEW_LIFE_RULE";

  function validCell(cell) {
    return cell && Number.isInteger(cell.x) && Number.isInteger(cell.y)
      && cell.x >= 0 && cell.x < WIDTH && cell.y >= 0 && cell.y < HEIGHT;
  }

  function sourceToCell(sourceKey) {
    const source = blueBody.unbind(sourceKey);
    if (!source) return null;
    const highBit = source.q4 >> 3;
    const x = source.q4 & 7;
    const y = source.layer * 2 + highBit;
    return Object.freeze({
      sourceKey: source.sourceKey,
      channel: source.channel,
      layer: source.layer,
      q4: source.q4,
      x,
      y,
      cellKey: `LIFE:8x6:${x},${y}`
    });
  }

  function cellToSource(cell) {
    if (!validCell(cell)) return null;
    const layer = Math.floor(cell.y / 2);
    const q4 = ((cell.y % 2) << 3) | cell.x;
    return blueBody.unbind(`P${layer}:${q4.toString(2).padStart(4, "0")}`);
  }

  const keyOf = (cell) => `${cell.x},${cell.y}`;
  const parseCell = (key) => {
    const [x, y] = String(key).split(",").map(Number);
    return { x, y };
  };

  function lifeStep(cells) {
    const live = new Set(cells.map(keyOf));
    const counts = new Map();
    for (const key of live) {
      const { x, y } = parseCell(key);
      for (let dy = -1; dy <= 1; dy += 1) for (let dx = -1; dx <= 1; dx += 1) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || nx >= WIDTH || ny < 0 || ny >= HEIGHT) continue;
        const neighbor = `${nx},${ny}`;
        counts.set(neighbor, (counts.get(neighbor) || 0) + 1);
      }
    }
    const next = [];
    for (let y = 0; y < HEIGHT; y += 1) for (let x = 0; x < WIDTH; x += 1) {
      const key = `${x},${y}`;
      const neighbors = counts.get(key) || 0;
      if (neighbors === 3 || (live.has(key) && neighbors === 2)) next.push({ x, y });
    }
    return next;
  }

  function signature(cells) {
    return cells.map(keyOf).sort().join("|") || "EMPTY";
  }

  function dynamicCandidates(postCells) {
    const target = signature(postCells);
    const candidates = [];
    for (let layer = 0; layer < 3; layer += 1) for (let channel = 0; channel < 16; channel += 1) {
      const source = blueBody.bind(layer, channel);
      const cell = sourceToCell(source.sourceKey);
      if (signature(lifeStep([cell])) === target) candidates.push(source.sourceKey);
    }
    return candidates;
  }

  function frame(layer, channel, stage = 1) {
    if (![0, 1].includes(stage)) throw new RangeError("stage must be 0 or 1");
    const source = blueBody.bind(layer, channel);
    const cell = sourceToCell(source.sourceKey);
    const pre = [cell];
    const post = stage === 0 ? pre : lifeStep(pre);
    return Object.freeze({ source, cell, stage, pre, post, postSignature: signature(post) });
  }

  function receipt(input = {}) {
    const cell = sourceToCell(input.sourceKey);
    if (!cell) return Object.freeze({ status: "HOLD_INVALID_SOURCE_ADDRESS", sourceKey: input.sourceKey || null, residual: null });
    const stage = input.stage === 0 ? 0 : 1;
    if (stage === 0) {
      const returned = cellToSource(cell);
      return Object.freeze({
        status: "PASS_PRE_DYNAMICS_COORDINATE_RETURN",
        sourceKey: cell.sourceKey,
        returnedSourceKey: returned.sourceKey,
        residual: 0,
        candidateCount: 1,
        claimBoundary: CLAIM_BOUNDARY
      });
    }
    const post = lifeStep([cell]);
    if (input.witness !== true) {
      const candidates = dynamicCandidates(post);
      return Object.freeze({
        status: "HOLD_DYNAMICS_ONLY_AMBIGUOUS",
        sourceKey: cell.sourceKey,
        postSignature: signature(post),
        candidateCount: candidates.length,
        residual: "ADDRESS_ERASED_BY_B3S23_SINGLETON_STEP",
        claimBoundary: CLAIM_BOUNDARY
      });
    }
    if (input.returnedSourceKey !== cell.sourceKey) {
      return Object.freeze({
        status: "HOLD_SOURCE_KEY_MISMATCH",
        sourceKey: cell.sourceKey,
        returnedSourceKey: input.returnedSourceKey || null,
        residual: "SOURCE_KEY_MISMATCH"
      });
    }
    return Object.freeze({
      status: "PASS_TYPED_TRANSPORT_RETURN",
      sourceKey: cell.sourceKey,
      returnedSourceKey: input.returnedSourceKey,
      cellKey: cell.cellKey,
      postSignature: signature(post),
      candidateCount: 1,
      residual: 0,
      claimBoundary: CLAIM_BOUNDARY
    });
  }

  function validateTransfer() {
    const records = [];
    for (let layer = 0; layer < 3; layer += 1) for (let channel = 0; channel < 16; channel += 1) {
      const source = blueBody.bind(layer, channel);
      records.push(sourceToCell(source.sourceKey));
    }
    return Object.freeze({
      records: records.length,
      cells: new Set(records.map((record) => record.cellKey)).size,
      bijectiveBeforeDynamics: records.every((record) => cellToSource(record).sourceKey === record.sourceKey),
      singletonPostSignatures: new Set(records.map((record) => signature(lifeStep([record])))).size,
      dynamicsOnlyCandidateCount: dynamicCandidates([]).length,
      lifeRule: "B3/S23",
      boundary: "finite-dead"
    });
  }

  function mount(rootElement) {
    if (!rootElement || typeof document === "undefined") return null;
    const channel = rootElement.querySelector("#transferChannel");
    const layer = rootElement.querySelector("#transferLayer");
    const stageButton = rootElement.querySelector("#transferStage");
    const witness = rootElement.querySelector("#transferWitness");
    const cycleButton = rootElement.querySelector("#transferCycle");
    const sourceView = rootElement.querySelector("#transferSourceView");
    const preGrid = rootElement.querySelector("#transferPreGrid");
    const postGrid = rootElement.querySelector("#transferPostGrid");
    const receiptView = rootElement.querySelector("#transferReceipt");
    const readout = rootElement.querySelector("#transferReadout");
    let stage = 1;
    let timer = 0;

    function gridMarkup(activeCells, sourceCell, emptyLabel) {
      const active = new Set(activeCells.map(keyOf));
      const cells = [];
      for (let y = 0; y < HEIGHT; y += 1) for (let x = 0; x < WIDTH; x += 1) {
        const key = `${x},${y}`;
        cells.push(`<span class="transfer-cell${active.has(key) ? " active" : ""}${x === sourceCell.x && y === sourceCell.y ? " source" : ""}" title="(${x},${y})"></span>`);
      }
      return `${cells.join("")}${active.size === 0 ? `<b class="transfer-empty">${emptyLabel}</b>` : ""}`;
    }

    function render() {
      const current = frame(Number(layer.value), Number(channel.value), stage);
      const result = receipt({
        sourceKey: current.source.sourceKey,
        stage,
        witness: witness.checked,
        returnedSourceKey: witness.checked ? current.source.sourceKey : null
      });
      const sourceTiles = Array.from({ length: 16 }, (_, index) => `<span class="transfer-source-tile${index === current.source.channel ? " active" : ""}">${index + 1}</span>`).join("");
      sourceView.innerHTML = `<div class="transfer-source-layer">P${current.source.layer}</div><div class="transfer-source-ring">${sourceTiles}</div>`;
      preGrid.innerHTML = gridMarkup(current.pre, current.cell, "");
      postGrid.innerHTML = gridMarkup(current.post, current.cell, "EMPTY · singleton dies");
      receiptView.className = `transfer-receipt ${result.status.startsWith("PASS") ? "pass" : "hold"}`;
      receiptView.innerHTML = `<small>${stage === 0 ? "coordinate inverse" : witness.checked ? "typed sidecar witness" : "dynamics-only ablation"}</small><strong>${result.status}</strong><p>candidate count ${result.candidateCount ?? "—"} · residual ${result.residual ?? "—"}</p>`;
      readout.textContent = `${current.source.sourceKey} · CRT16:${String(current.source.channel + 1).padStart(2, "0")} → (${current.cell.x},${current.cell.y}) · g${stage} · ${current.postSignature}`;
      rootElement.querySelector("#transferChannelValue").textContent = `${current.source.channel + 1}/16 · m=${current.source.modulusLabel}`;
      rootElement.querySelector("#transferLayerValue").textContent = `P${current.source.layer}`;
      stageButton.textContent = stage === 0 ? "Apply B3/S23 step" : "Return to g0";
    }

    function stepAddress() {
      const next = (Number(layer.value) * 16 + Number(channel.value) + 1) % CELL_COUNT;
      layer.value = Math.floor(next / 16);
      channel.value = next % 16;
      render();
    }

    [channel, layer, witness].forEach((control) => control.addEventListener("input", render));
    stageButton.addEventListener("click", () => { stage = stage === 0 ? 1 : 0; render(); });
    cycleButton.addEventListener("click", () => {
      if (timer) {
        clearInterval(timer); timer = 0; cycleButton.textContent = "Play 48 transfers"; cycleButton.setAttribute("aria-pressed", "false");
      } else {
        timer = setInterval(stepAddress, 520); cycleButton.textContent = "Pause transfer"; cycleButton.setAttribute("aria-pressed", "true");
      }
    });
    render();
    return Object.freeze({ render, stop: () => { if (timer) clearInterval(timer); timer = 0; } });
  }

  return Object.freeze({ WIDTH, HEIGHT, CELL_COUNT, CLAIM_BOUNDARY, sourceToCell, cellToSource, lifeStep, signature, dynamicCandidates, frame, receipt, validateTransfer, mount });
}));
