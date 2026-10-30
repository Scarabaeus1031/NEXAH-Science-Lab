(function (root, factory) {
  const api = factory(
    typeof module === "object" && module.exports ? require("./a0-blue-body-dodeca-countershot-v1.js") : root.A0BlueBodyDodecaCountershot,
    typeof module === "object" && module.exports ? require("./a0-blue-pink-dodeca-cell-return-v1.js") : root.A0BluePinkDodecaCellReturn,
    typeof module === "object" && module.exports ? require("./a0-tessarec-blue-body-v1.js") : root.A0TessarecBlueBody,
    typeof module === "object" && module.exports ? require("./a0-blue-body-interior-crt16-v1.js") : root.A0BlueBodyInteriorCRT16
  );
  if (typeof module === "object" && module.exports) module.exports = api;
  root.A0BluePinkDodecaCruiser = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (H3, Cell, Blue, Interior) {
  "use strict";

  const TAU = Math.PI * 2;
  const MODES = Object.freeze(["ASSEMBLY", "HULL", "INTERIOR", "APERTURE", "SPECTRUM", "BRIDGE", "RETURN"]);
  const PHASES = Object.freeze(["HULL_LOCK", "ADDRESS_BIND", "APERTURE_ALIGN", "CUT_GATE", "SPECTRUM_SPLIT", "RETURN_COMMIT"]);
  const SPECTRUM = Object.freeze([
    Object.freeze({ id: "RED", color: "#ff505f", wavelengthNm: 630 }),
    Object.freeze({ id: "ORANGE", color: "#ff8b45", wavelengthNm: 590 }),
    Object.freeze({ id: "YELLOW", color: "#f3cc4e", wavelengthNm: 560 }),
    Object.freeze({ id: "GREEN", color: "#58d37e", wavelengthNm: 530 }),
    Object.freeze({ id: "CYAN", color: "#29c7df", wavelengthNm: 490 }),
    Object.freeze({ id: "BLUE", color: "#4385ff", wavelengthNm: 450 }),
    Object.freeze({ id: "VIOLET", color: "#925cf4", wavelengthNm: 410 })
  ]);
  const SPECTRUM_LENSES = Object.freeze(["NEWTON", "LEIBNIZ", "GOETHE"]);
  const CLAIM_BOUNDARY = "SOURCE_BOUND_DETERMINISTIC_VIEW_HANDOFF_HULL_FACE_TO_BLUE_ADDRESS_TO_PINK_APERTURE_CUT_TO_SEVEN_BAND_SPECTRUM_VIEW_TO_RETURN_CELL_NO_CALIBRATED_OPTICS_NO_NEW_BODY_IDENTITY_NO_SHARED_PHYSICAL_ENGINE_NO_NEW_GRAPH_RELATION";
  const SOURCES = Object.freeze([
    "MOD:TESSAREC",
    "A0-VIEW-BLUE-BODY-DODECA-COUNTERSHOT",
    "A0-VIEW-BLUE-PINK-DODECA-CELL-RETURN",
    "A0-VIEW-NEWTON-GOETHE-OBSERVER-LENS",
    "A0-VIEW-RAINBOW-PURPLE-RAIN",
    "NEXAH_A0_ORIENTATION_CONTROLLER_BENCH"
  ]);

  const clamp = (value, lower = 0, upper = 1) => Math.min(upper, Math.max(lower, Number(value) || 0));
  const wrap = (value, size) => ((value % size) + size) % size;

  function normalizeControls(input = {}) {
    const mode = MODES.includes(input.mode) ? input.mode : "ASSEMBLY";
    const manualFace = Number.isInteger(input.faceIndex) ? wrap(input.faceIndex, 12) : null;
    const manualSlot = Number.isInteger(input.addressSlot) ? wrap(input.addressSlot, 4) : null;
    return Object.freeze({
      mode,
      progress: clamp(input.progress),
      aperture: clamp(input.aperture === undefined ? 0.68 : input.aperture),
      thrust: clamp(input.thrust === undefined ? 0.42 : input.thrust),
      spectrumLens: SPECTRUM_LENSES.includes(input.spectrumLens) ? input.spectrumLens : "NEWTON",
      faceIndex: manualFace,
      addressSlot: manualSlot
    });
  }

  function routeFor(controls) {
    const clockStep = Math.min(47, Math.floor(controls.progress * 48));
    const faceIndex = controls.faceIndex === null ? Math.floor(clockStep / 4) : controls.faceIndex;
    const addressSlot = controls.addressSlot === null ? clockStep % 4 : controls.addressSlot;
    const addressIndex = faceIndex * 4 + addressSlot;
    const layer = Math.floor(addressIndex / 16);
    const channel = addressIndex % 16;
    const localProgress = controls.progress >= 1 ? 1 : (controls.progress * 48) % 1;
    const phaseIndex = Math.min(PHASES.length - 1, Math.floor(localProgress * PHASES.length));
    const addressPhase = faceIndex / 12 * TAU - channel / 16 * TAU + controls.progress * TAU * 0.25;
    const gateSignal = 0.5 + 0.5 * Math.cos(addressPhase);
    const effectiveOpening = clamp(controls.aperture * (0.55 + 0.45 * (channel + 1) / 16));
    const gateThreshold = 1 - effectiveOpening * 0.9;
    const cutOpen = effectiveOpening > 0 && gateSignal >= gateThreshold;
    const cutDepth = cutOpen ? controls.thrust * (0.3 + 0.7 * gateSignal) : 0;
    const spectrumIndex = addressIndex % SPECTRUM.length;
    const spectrumBand = SPECTRUM[spectrumIndex];
    const spectrumTransmission = cutOpen ? cutDepth * effectiveOpening : 0;
    const returnCell = Cell.cellAt(48 + faceIndex);
    const trace = PHASES.map((phase, index) => Object.freeze({
      phase,
      status: index < phaseIndex ? "PASS" : index === phaseIndex ? "ACTIVE" : "PENDING"
    }));
    return Object.freeze({ clockStep, faceIndex, addressSlot, addressIndex, layer, channel, phaseIndex, phase: PHASES[phaseIndex], gateSignal, effectiveOpening, gateThreshold, cutOpen, cutDepth, spectrumIndex, spectrumBand, spectrumTransmission, returnCell, trace });
  }

  function assemblyState(input = {}) {
    if (!H3 || !Cell || !Blue || !Interior) throw new Error("Cruiser source modules are not available");
    const controls = normalizeControls(input);
    const dodeca = H3.buildDodecahedron();
    const blue = Blue.buildShell();
    const route = routeFor(controls);
    const phase = Math.min(11, route.faceIndex);
    const frame = Interior.frame(route.layer, route.channel, phase, route.effectiveOpening);
    const apertureAngle = -(TAU * controls.progress * 0.75 + route.channel / 16 * TAU);
    return Object.freeze({
      workingLabel: "BLUE_PINK_DODECA_CRUISER",
      controls,
      phase: route.phase,
      route,
      hull: Object.freeze({ vertices: dodeca.vertices, edges: dodeca.edges, faces: dodeca.faces, faceIndex: route.faceIndex, angle: TAU * controls.progress }),
      body: Object.freeze({ vertexCount: blue.vertices.length, faceCount: blue.faces.length, edgeCount: blue.edgeOwners.size, layer: route.layer, channel: route.channel, frame, angle: TAU * controls.progress * 0.5 }),
      aperture: Object.freeze({ role: Cell.buildPinkDiamondRoleContract(), requestedOpening: controls.aperture, openness: route.effectiveOpening, angle: apertureAngle, gateSignal: route.gateSignal, gateThreshold: route.gateThreshold, cutOpen: route.cutOpen, cutDepth: route.cutDepth }),
      spectrum: Object.freeze({ lens: controls.spectrumLens, bands: SPECTRUM, activeIndex: route.spectrumIndex, activeBand: route.spectrumBand, transmission: route.spectrumTransmission, status: route.cutOpen ? "SPECTRUM_PASS" : "SPECTRUM_HOLD" }),
      returnCell: route.returnCell,
      rotations: Object.freeze({ hull: TAU * controls.progress, body: TAU * controls.progress * 0.5, aperture: apertureAngle }),
      sources: SOURCES,
      claimBoundary: CLAIM_BOUNDARY
    });
  }

  function assemblyReceipt(input = {}) {
    const state = assemblyState(input);
    const sourceKey = state.body.frame.source.sourceKey;
    const addressReturn = Interior.receipt({ sourceKey, witness: true, viewKeys: [sourceKey, sourceKey, sourceKey, sourceKey] });
    return Object.freeze({
      schema: "A0_BLUE_PINK_DODECA_CRUISER_RETURN_V1",
      status: addressReturn.status !== "PASS_EXACT_ADDRESS_RETURN" ? "HOLD_ADDRESS_RETURN" : state.route.cutOpen ? "PASS_EXACT_COUPLED_RETURN" : "HOLD_APERTURE_CLOSED",
      generatedAt: new Date().toISOString(),
      workingLabel: state.workingLabel,
      mode: state.controls.mode,
      phase: state.phase,
      hullFace: state.hull.faces[state.hull.faceIndex].id,
      blueAddress: sourceKey,
      pinkAperture: state.aperture.openness,
      returnCell: state.returnCell.cell_id,
      handoff: Object.freeze({
        route: "DODEKA_HULL_FACE_TO_BLUE_ADDRESS_TO_PINK_APERTURE_CUT_TO_SPECTRUM_TO_RETURN_CELL",
        addressSlot: state.route.addressSlot,
        gateSignal: state.route.gateSignal,
        gateThreshold: state.route.gateThreshold,
        cutOpen: state.route.cutOpen,
        cutDepth: state.route.cutDepth,
        spectrumLens: state.spectrum.lens,
        spectrumBand: state.spectrum.activeBand,
        spectrumTransmission: state.spectrum.transmission,
        trace: state.route.trace
      }),
      counts: Object.freeze({ hullFaces: 12, hullEdges: 30, hullVertices: 20, blueAddresses: 48, blueLayers: 3, blueChannels: 16, returnCells: 60 }),
      displaySynchronization: Object.freeze({ clock: "SHARED_DISPLAY_CLOCK", hullDirection: 1, bodyDirection: 0.5, apertureDirection: -0.75 }),
      sourceIdentities: SOURCES,
      newCanonicalIds: Object.freeze([]),
      relationChanges: Object.freeze([]),
      addressReturn,
      claimBoundary: CLAIM_BOUNDARY
    });
  }

  function validate() {
    const states = [0, 0.25, 0.5, 0.75, 1].map((progress) => assemblyState({ progress }));
    const routes = Array.from({ length: 12 }, (_, faceIndex) => Array.from({ length: 4 }, (_, addressSlot) => assemblyState({ faceIndex, addressSlot, aperture: 1, thrust: 1 }))).flat();
    const addressKeys = new Set(routes.map((state) => state.body.frame.source.sourceKey));
    const routePairs = new Set(routes.map((state) => `${state.hull.faceIndex}:${state.route.addressSlot}`));
    const receipt = assemblyReceipt({ progress: 1, mode: "RETURN", aperture: 1, thrust: 1 });
    return Object.freeze({
      status: receipt.status === "PASS_EXACT_COUPLED_RETURN" ? "PASS_EXACT_COUPLED_RETURN" : receipt.status,
      sourceModulesPresent: Boolean(H3 && Cell && Blue && Interior),
      exactHull: states.every((state) => state.hull.vertices.length === 20 && state.hull.edges.length === 30 && state.hull.faces.length === 12),
      exactInterior: states.every((state) => state.body.vertexCount === 48 && state.body.layer >= 0 && state.body.layer <= 2 && state.body.channel >= 0 && state.body.channel <= 15),
      counterRotation: states.every((state) => state.rotations.aperture <= 0 && state.rotations.hull >= 0),
      exactTwelveByFourBinding: routes.length === 48 && addressKeys.size === 48 && routePairs.size === 48,
      returnFacePreserved: routes.every((state) => state.returnCell.cell_id === `RETURN-00:F${String(state.hull.faceIndex + 1).padStart(2, "0")}`),
      exactSevenBandSpectrum: routes.every((state) => state.spectrum.bands.length === 7 && state.spectrum.activeIndex === state.route.addressIndex % 7),
      noIdentityMerge: receipt.newCanonicalIds.length === 0 && receipt.relationChanges.length === 0,
      claimBoundary: CLAIM_BOUNDARY
    });
  }

  return { MODES, PHASES, SPECTRUM, SPECTRUM_LENSES, SOURCES, CLAIM_BOUNDARY, normalizeControls, routeFor, assemblyState, assemblyReceipt, validate, wrap };
});
