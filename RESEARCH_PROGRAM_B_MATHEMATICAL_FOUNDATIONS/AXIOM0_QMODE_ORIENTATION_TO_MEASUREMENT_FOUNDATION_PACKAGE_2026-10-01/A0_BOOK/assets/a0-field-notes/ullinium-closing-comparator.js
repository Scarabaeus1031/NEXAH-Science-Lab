(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.A0UlliniumClosing = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const MODES = Object.freeze({
    open: Object.freeze({
      id: "open",
      label: "OPEN HEXAGON",
      vertices: 6,
      realEdges: 5,
      phantomEdges: 0,
      faces: 0,
      seam: "OPEN",
      loss: "none · source path remains explicit",
      returnReceipt: "identity · 6V / 5E"
    }),
    witness: Object.freeze({
      id: "witness",
      label: "CLOSING WITNESS",
      vertices: 6,
      realEdges: 5,
      phantomEdges: 1,
      faces: 0,
      seam: "DECLARED · non-face",
      loss: "none · witness edge is separately tagged",
      returnReceipt: "remove phantom e₅ → open path"
    }),
    composite: Object.freeze({
      id: "composite",
      label: "BLUE / GREEN COMPOSITE",
      vertices: 10,
      realEdges: 11,
      phantomEdges: 0,
      faces: 2,
      seam: "1 shared display edge",
      loss: "12→10 vertex occurrences · 12→11 edge occurrences",
      returnReceipt: "exact iff layer + seam tags are retained",
      sourceVertices: 12,
      sourceEdges: 12,
      sharedVertexOccurrences: 2,
      sharedEdgeOccurrences: 1
    })
  });

  function state(mode) {
    return MODES[mode] || MODES.open;
  }

  function write(rootNode, key, value) {
    const node = rootNode.querySelector(`[data-uc-out="${key}"]`);
    if (node) node.textContent = String(value);
  }

  function render(rootNode, mode) {
    const next = state(mode);
    rootNode.dataset.ucMode = next.id;
    rootNode.querySelectorAll("[data-uc-mode]").forEach((button) => {
      const selected = button.dataset.ucMode === next.id;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-pressed", selected ? "true" : "false");
    });
    write(rootNode, "mode", next.label);
    write(rootNode, "vertices", next.vertices);
    write(rootNode, "realEdges", next.realEdges);
    write(rootNode, "phantomEdges", next.phantomEdges);
    write(rootNode, "faces", next.faces);
    write(rootNode, "seam", next.seam);
    write(rootNode, "loss", next.loss);
    write(rootNode, "return", next.returnReceipt);
    return next;
  }

  function mount(doc) {
    const rootNode = doc && doc.querySelector("[data-ullinium-closing]");
    if (!rootNode || rootNode.dataset.ucMounted === "true") return null;
    rootNode.dataset.ucMounted = "true";
    rootNode.querySelectorAll("[data-uc-mode]").forEach((button) => {
      button.addEventListener("click", () => render(rootNode, button.dataset.ucMode));
    });
    return render(rootNode, rootNode.dataset.ucMode || "open");
  }

  return Object.freeze({ MODES, state, render, mount });
});
