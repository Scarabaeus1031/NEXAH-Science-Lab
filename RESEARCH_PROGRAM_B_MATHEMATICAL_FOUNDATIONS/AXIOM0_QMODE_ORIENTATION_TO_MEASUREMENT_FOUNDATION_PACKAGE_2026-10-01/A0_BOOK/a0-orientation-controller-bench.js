(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.A0OrientationController = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const VERSION = '0.20.0';
  const EPSILON = 1e-9;
  const PRIMES = [2, 3, 5, 7, 11];
  const OPERATOR_IDS = ['J', 'R', 'E'];
  const PRIME_SHADOW_GONS = [7, 17, 19, 29];
  const SHADOW_GONS = [7, 8, 17, 19, 29];
  const LIFE04B_STRESS_FIXTURE = Object.freeze({
    decision: 'NO E8 ANTIPODAL SPECIFICITY',
    exactReturn: true,
    meanAxialResidual: 0.8041667963674868,
    usedAxes: 4,
    totalAxes: 120,
    maxReturnError: 4.718958039861916e-17,
    pairCollisions: 56,
    randomP: 0.375,
    lockedGatesPassed: 0,
    lockedGatesTotal: 4
  });
  const FAMILY_ORIENTATION_FIXTURE = Object.freeze({
    roles: Object.freeze({ F1: 'OBSERVATION_RECORD', F2: 'ADDRESS', F5: 'CONNECTIVITY', F6: 'SYNCHRONIZATION_CONTROL', F7: 'VALIDATION_GOVERNANCE' }),
    terminalFrames: Object.freeze(['TAO', 'DAO', 'IOTA']),
    terminalAngles: Object.freeze([90, 180, 270]),
    axes: Object.freeze([['F1', 'F2', 'F6'], ['F1', 'F5'], ['F1', 'F7'], ['F7', 'F6']]),
    candidateMarkers: Object.freeze({ F1_F7: 27, F7_F6: 13, E_TA: 21, complement: 50, sum: 71 }),
    boundary: 'Role correspondences and number labels are local hypotheses, not canonical Family relations or selector laws.'
  });

  const clone = value => JSON.parse(JSON.stringify(value));
  const close = (a, b) => Math.abs(Number(a) - Number(b)) <= EPSILON;
  const mod = (value, modulus) => ((value % modulus) + modulus) % modulus;
  const normalizeDegrees = value => mod(Number(value), 360);
  const classifySide = position => close(position, 0.5) ? 'MEMBRANE' : position < 0.5 ? 'INSIDE' : 'OUTSIDE';
  const primeSupport = address => address.map((value, index) => Number(value) !== 0 ? PRIMES[index] : null).filter(Boolean);

  function createState(overrides = {}) {
    const state = {
      schema: 'nexah.a0.orientation-controller-state',
      version: VERSION,
      carrierId: 'A0.CRT.CHANNEL/5x73',
      address: [1, 0, 0, 0, 0],
      familyRole: 'F3',
      position: 0.25,
      orientation: 0,
      scale: 1,
      side: 'INSIDE',
      iotaTick: 0,
      iotaDrift: 0,
      degreeSignature: [1, 1, 2],
      residual: 0,
      history: []
    };
    Object.assign(state, clone(overrides));
    state.address = (state.address || []).slice(0, 5).map(Number);
    while (state.address.length < 5) state.address.push(0);
    state.orientation = normalizeDegrees(state.orientation);
    state.iotaTick = mod(Number(state.iotaTick), 365);
    state.side = classifySide(Number(state.position));
    state.history = Array.isArray(state.history) ? state.history : [];
    return state;
  }

  function stateCore(state) {
    return {
      carrierId: state.carrierId,
      address: clone(state.address),
      familyRole: state.familyRole,
      position: Number(state.position),
      orientation: normalizeDegrees(state.orientation),
      scale: Number(state.scale),
      side: state.side,
      iotaTick: mod(Number(state.iotaTick), 365),
      iotaDrift: Number(state.iotaDrift),
      degreeSignature: clone(state.degreeSignature),
      residual: Number(state.residual)
    };
  }

  function applyOperator(input, operatorId, parameters = {}, record = true) {
    if (!OPERATOR_IDS.includes(operatorId)) throw new Error(`Unknown operator: ${operatorId}`);
    const before = createState(input);
    const next = createState(input);
    const params = {};

    if (operatorId === 'J') {
      next.position = 1 - Number(next.position);
      next.side = classifySide(next.position);
    }

    if (operatorId === 'R') {
      const direction = Number(parameters.direction ?? 1) < 0 ? -1 : 1;
      const sectors = Math.max(1, Math.round(Math.abs(Number(parameters.sectors ?? 1))));
      params.direction = direction;
      params.sectors = sectors;
      next.orientation = normalizeDegrees(next.orientation + direction * sectors * 72);
      next.iotaTick = mod(next.iotaTick + direction * sectors * 73, 365);
      next.iotaDrift += direction * sectors;
    }

    if (operatorId === 'E') {
      const factor = Number(parameters.factor ?? 2);
      if (!Number.isFinite(factor) || close(factor, 0)) throw new Error('E requires a finite, non-zero factor.');
      params.factor = factor;
      next.position = 0.5 + factor * (Number(next.position) - 0.5);
      next.scale = Number(next.scale) * factor;
      next.side = classifySide(next.position);
    }

    // Residual is return memory, not the distance moved by the latest step.
    // J and E can therefore close exactly through their inverse, while the
    // 360/365 register deliberately retains one drift unit per R sector.
    next.residual = Math.abs(Number(next.iotaDrift));
    if (record) {
      next.history = clone(before.history);
      next.history.push({
        index: next.history.length + 1,
        operatorId,
        parameters: params,
        before: stateCore(before),
        after: stateCore(next)
      });
    }
    return next;
  }

  function replay(initial, history) {
    return (history || []).reduce((state, entry) => applyOperator(state, entry.operatorId, entry.parameters, true), createState({ ...initial, history: [] }));
  }

  function exactEqual(a, b) {
    return a.carrierId === b.carrierId &&
      a.familyRole === b.familyRole &&
      JSON.stringify(a.address) === JSON.stringify(b.address) &&
      JSON.stringify(a.degreeSignature) === JSON.stringify(b.degreeSignature) &&
      close(a.position, b.position) && close(normalizeDegrees(a.orientation), normalizeDegrees(b.orientation)) &&
      close(a.scale, b.scale) && a.side === b.side && a.iotaTick === b.iotaTick &&
      close(a.iotaDrift, b.iotaDrift) && close(a.residual, b.residual);
  }

  function assessReturn(initialInput, currentInput) {
    const initial = stateCore(createState(initialInput));
    const current = stateCore(createState(currentInput));
    const supportA = primeSupport(initial.address);
    const supportB = primeSupport(current.address);
    const exact = exactEqual(initial, current);
    const carrier = initial.carrierId === current.carrierId && JSON.stringify(initial.address) === JSON.stringify(current.address);
    const structural = carrier && JSON.stringify(initial.degreeSignature) === JSON.stringify(current.degreeSignature);
    const invariant = structural && JSON.stringify(supportA) === JSON.stringify(supportB);
    return {
      exact: { pass: exact, label: 'Exact return', condition: 'all declared state fields coincide' },
      carrier: { pass: carrier, label: 'Carrier return', condition: 'carrier and prime address coincide' },
      structural: { pass: structural, label: 'Structural return', condition: 'degree signature [1,1,2] is retained' },
      invariant: { pass: invariant, label: 'Invariant return', condition: 'declared prime support is retained' }
    };
  }

  function lcg(seed) {
    let value = (Number(seed) >>> 0) || 1;
    return function () {
      value = (1664525 * value + 1013904223) >>> 0;
      return value / 4294967296;
    };
  }

  function createBlindChallenge(seed = Date.now()) {
    const random = lcg(seed);
    const operatorId = OPERATOR_IDS[Math.floor(random() * OPERATOR_IDS.length)];
    const positions = [0.2, 0.3, 0.4, 0.65, 0.8];
    const phases = [0, 72, 144, 216, 288];
    const before = createState({
      position: positions[Math.floor(random() * positions.length)],
      orientation: phases[Math.floor(random() * phases.length)],
      address: [0, 0, 0, 0, 0].map(() => Math.floor(random() * 3))
    });
    const parameters = operatorId === 'R' ? { direction: random() > 0.5 ? 1 : -1, sectors: 1 } : operatorId === 'E' ? { factor: random() > 0.5 ? 2 : 0.5 } : {};
    const after = applyOperator(before, operatorId, parameters, false);
    return { seed: Number(seed), operatorId, parameters, before: stateCore(before), after: stateCore(after) };
  }

  function verifyBlindAnswer(challenge, answer) {
    if (answer === 'HOLD') return { status: 'HOLD', pass: null, expected: challenge.operatorId };
    return { status: answer === challenge.operatorId ? 'PASS' : 'FAIL', pass: answer === challenge.operatorId, expected: challenge.operatorId };
  }

  function edge(from, to) {
    return { from: mod(Number(from), 5), to: mod(Number(to), 5) };
  }

  function neighborsC5(node) {
    const n = mod(Number(node), 5);
    return [mod(n - 1, 5), mod(n + 1, 5)];
  }

  function classifyEdgeTurn(incoming, candidate) {
    if (!incoming || !candidate || Number(candidate.from) !== Number(incoming.to)) return 'HOLD';
    if (!neighborsC5(incoming.to).includes(mod(Number(candidate.to), 5))) return 'HOLD';
    return mod(Number(candidate.to), 5) === mod(Number(incoming.from), 5) ? 'BLOCK' : 'ALLOW';
  }

  function createEdgeState(overrides = {}) {
    const state = {
      schema: 'nexah.a0.ihara-edge-turn-state',
      version: VERSION,
      graphId: 'C5_INNER_RING_TYPED_ADAPTER',
      layer: 0,
      incoming: edge(0, 1),
      candidate: edge(1, 2),
      startEdge: edge(0, 1),
      path: [0, 1],
      committedTurns: 0,
      rejectedBacktracks: 0,
      closures: 0,
      status: 'READY',
      primitiveClass: null,
      ledger: []
    };
    Object.assign(state, clone(overrides));
    state.layer = mod(Number(state.layer), 3);
    state.incoming = edge(state.incoming.from, state.incoming.to);
    state.candidate = edge(state.candidate.from, state.candidate.to);
    state.startEdge = edge(state.startEdge.from, state.startEdge.to);
    state.path = Array.isArray(state.path) ? state.path.map(value => mod(Number(value), 5)) : [state.incoming.from, state.incoming.to];
    state.ledger = Array.isArray(state.ledger) ? state.ledger : [];
    return state;
  }

  function setEdgeCandidate(input, to) {
    const state = createEdgeState(input);
    state.candidate = edge(state.incoming.to, to);
    state.status = classifyEdgeTurn(state.incoming, state.candidate) === 'ALLOW' ? 'CANDIDATE_READY' :
      classifyEdgeTurn(state.incoming, state.candidate) === 'BLOCK' ? 'BACKTRACK_SELECTED' : 'CANDIDATE_HOLD';
    return state;
  }

  function rotateEdgeCandidate(input, direction = 1) {
    const state = createEdgeState(input);
    const options = neighborsC5(state.incoming.to);
    const current = Math.max(0, options.indexOf(state.candidate.to));
    const step = Number(direction) < 0 ? -1 : 1;
    return setEdgeCandidate(state, options[mod(current + step, options.length)]);
  }

  function canonicalOrientedCycle(vertices) {
    const cycle = vertices.map(value => mod(Number(value), 5));
    if (!cycle.length) return '';
    const rotations = cycle.map((_, index) => cycle.slice(index).concat(cycle.slice(0, index)));
    rotations.sort((a, b) => a.join(',').localeCompare(b.join(',')));
    return rotations[0].join('→');
  }

  function commitEdgeTurn(input) {
    const state = createEdgeState(input);
    const verdict = classifyEdgeTurn(state.incoming, state.candidate);
    const record = {
      index: state.ledger.length + 1,
      incoming: clone(state.incoming),
      candidate: clone(state.candidate),
      verdict
    };
    if (verdict !== 'ALLOW') {
      if (verdict === 'BLOCK') state.rejectedBacktracks += 1;
      state.status = verdict === 'BLOCK' ? 'BLOCKED_BACKTRACK' : 'HOLD_DISCONNECTED';
      record.status = state.status;
      state.ledger.push(record);
      return state;
    }

    state.incoming = edge(state.candidate.from, state.candidate.to);
    state.path.push(state.incoming.to);
    state.committedTurns += 1;
    const closed = state.committedTurns > 0 && state.incoming.from === state.startEdge.from && state.incoming.to === state.startEdge.to;
    if (closed) {
      state.closures += 1;
      state.primitiveClass = canonicalOrientedCycle(state.path.slice(0, -2));
      state.status = 'PRIMITIVE_C5_CLOSURE';
    } else {
      state.status = 'COMMITTED';
    }
    const next = neighborsC5(state.incoming.to).find(node => node !== state.incoming.from);
    state.candidate = edge(state.incoming.to, next);
    record.status = state.status;
    record.committed = clone(state.incoming);
    state.ledger.push(record);
    return state;
  }

  function traceC5(k) {
    const length = Number(k);
    return Number.isInteger(length) && length > 0 && length % 5 === 0 ? 10 : 0;
  }

  function createEdgeBlindChallenge(seed = Date.now()) {
    const random = lcg(seed);
    const from = Math.floor(random() * 5);
    const direction = random() < 0.5 ? -1 : 1;
    const to = mod(from + direction, 5);
    const incoming = edge(from, to);
    const kind = Math.floor(random() * 3);
    let candidate;
    if (kind === 0) candidate = edge(to, mod(to + direction, 5));
    if (kind === 1) candidate = edge(to, from);
    if (kind === 2) candidate = edge(to, mod(to + 2, 5));
    return { seed: Number(seed), graphId: 'C5', incoming, candidate, expected: classifyEdgeTurn(incoming, candidate) };
  }

  function verifyEdgeBlindAnswer(challenge, answer) {
    const expected = classifyEdgeTurn(challenge.incoming, challenge.candidate);
    return { status: answer === expected ? 'PASS' : 'FAIL', pass: answer === expected, expected };
  }

  function factorial(n) {
    let value = 1;
    for (let k = 2; k <= Number(n); k += 1) value *= k;
    return value;
  }

  function trinomialMultiplicity(i, j, k) {
    const values = [i, j, k].map(Number);
    if (values.some(value => !Number.isInteger(value) || value < 0)) throw new Error('Trinomial indices must be non-negative integers.');
    return factorial(values[0] + values[1] + values[2]) / values.map(factorial).reduce((a, b) => a * b, 1);
  }

  function binomialCoefficient(n, k) {
    const row = Number(n), index = Number(k);
    if (!Number.isInteger(row) || !Number.isInteger(index) || row < 0 || index < 0 || index > row) return 0;
    const limit = Math.min(index, row - index);
    let value = 1;
    for (let i = 1; i <= limit; i += 1) value = value * (row - limit + i) / i;
    return value;
  }

  function pascalRow(n = 7) {
    const row = Number(n);
    if (!Number.isInteger(row) || row < 0 || row > 30) throw new Error('Pascal row must be an integer from 0 to 30.');
    return Array.from({ length: row + 1 }, (_, k) => binomialCoefficient(row, k));
  }

  function fibonacci(n) {
    const index = Number(n);
    if (!Number.isInteger(index) || index < 0 || index > 78) throw new Error('Fibonacci index must be an integer from 0 to 78.');
    let a = 0, b = 1;
    for (let i = 0; i < index; i += 1) [a, b] = [b, a + b];
    return a;
  }

  function isPrimeInteger(n) {
    const value = Number(n);
    if (!Number.isInteger(value) || value < 2) return false;
    for (let divisor = 2; divisor * divisor <= value; divisor += 1) if (value % divisor === 0) return false;
    return true;
  }

  function pascalSpecificityCalibration(n = 7, modulus = 7) {
    const rowIndex = Number(n), m = Number(modulus);
    if (!Number.isInteger(m) || m < 2 || m > 29) throw new Error('Pascal modulus must be an integer from 2 to 29.');
    const row = pascalRow(rowIndex);
    const diagonalTerms = Array.from({ length: Math.floor(rowIndex / 2) + 1 }, (_, k) => binomialCoefficient(rowIndex - k, k));
    const diagonalSum = diagonalTerms.reduce((sum, value) => sum + value, 0);
    const rowSum = row.reduce((sum, value) => sum + value, 0);
    const interiorResidues = Array.from({ length: m - 1 }, (_, offset) => binomialCoefficient(m, offset + 1) % m);
    const primePattern = interiorResidues.every(value => value === 0);
    const compositeControl = Array.from({ length: 5 }, (_, offset) => binomialCoefficient(6, offset + 1) % 6);
    return {
      n: rowIndex,
      modulus: m,
      row,
      diagonalTerms,
      diagonalSum,
      fibonacciIndex: rowIndex + 1,
      fibonacciValue: fibonacci(rowIndex + 1),
      rowSum,
      powerValue: 2 ** rowIndex,
      interiorResidues,
      primePattern,
      expectedPrime: isPrimeInteger(m),
      compositeControl,
      gates: {
        diagonal: diagonalSum === fibonacci(rowIndex + 1),
        rowSum: rowSum === 2 ** rowIndex,
        primeCharacterization: primePattern === isPrimeInteger(m),
        compositeNegative: compositeControl.some(value => value !== 0)
      }
    };
  }

  function trinomialLayer(depth = 7) {
    const n = Number(depth);
    if (!Number.isInteger(n) || n < 0 || n > 11) throw new Error('Pascal depth must be an integer from 0 to 11.');
    const states = [];
    for (let i = 0; i <= n; i += 1) for (let j = 0; j <= n - i; j += 1) {
      const k = n - i - j;
      states.push({ i, j, k, multiplicity: trinomialMultiplicity(i, j, k) });
    }
    return states;
  }

  function antipodePascal(state) {
    return { i: Number(state.k), j: Number(state.j), k: Number(state.i), sigma: Number(state.sigma ?? 1) * -1 };
  }

  function shadowGonProjection(depth = 7, sides = 17, sigma = 1) {
    const n = Number(depth);
    const m = Number(sides);
    if (!SHADOW_GONS.includes(m)) throw new Error(`Unsupported local shadow-gon frame: ${m}`);
    const sectors = Array(m).fill(0);
    const layer = trinomialLayer(n);
    layer.forEach(source => {
      const state = Number(sigma) < 0 ? antipodePascal({ ...source, sigma: 1 }) : { ...source, sigma: 1 };
      const x = n ? (state.k - state.j) / n : 0;
      const y = n ? (state.i - (state.j + state.k) / 2) / n : 0;
      const angle = (Math.atan2(y, x) + 2 * Math.PI) % (2 * Math.PI);
      const sector = n ? Math.min(m - 1, Math.floor(angle / (2 * Math.PI) * m)) : 0;
      sectors[sector] += source.multiplicity;
    });
    const mass = sectors.reduce((sum, value) => sum + value, 0);
    const max = Math.max(1, ...sectors);
    return {
      depth: n,
      sides: m,
      sigma: Number(sigma) < 0 ? -1 : 1,
      macroNodes: layer.length,
      pathMass: mass,
      orientedMass: 2 * mass,
      sectors,
      normalized: sectors.map(value => value / max),
      depthEqualsFrame: n === m
    };
  }

  function antipodalSpecificityAblation(depth = 7, sides = 7) {
    const plus = shadowGonProjection(depth, sides, 1);
    const minus = shadowGonProjection(depth, sides, -1);
    const projectionCollision = plus.sectors.every((value, index) => value === minus.sectors[index]);
    const antipodeProbe = { i: plus.depth, j: 0, k: 0, sigma: 1 };
    const exactInvolution = JSON.stringify(antipodePascal(antipodePascal(antipodeProbe))) === JSON.stringify(antipodeProbe);
    const shadowOnlyAccuracyCeiling = projectionCollision ? 0.5 : 1;
    const signedHandleAccuracy = 1;
    const pathMass = plus.pathMass;
    const orientedMass = plus.orientedMass;
    return {
      depth: plus.depth,
      sides: plus.sides,
      pathMass,
      orientedMass,
      projectionCollision,
      exactInvolution,
      shadowOnlyAccuracyCeiling,
      shadowInformationBits: projectionCollision ? 0 : 1,
      signedHandleAccuracy,
      signedHandleInformationBits: 1,
      specificityEstablished: false,
      decision: projectionCollision
        ? 'HANDLE IS RETAINED ORIENTATION, NOT EMERGENT SPECIFICITY'
        : 'ORIENTATION VISIBLE IN THIS PROJECTION; EXTERNAL SPECIFICITY STILL UNTESTED',
      whiteCross: plus.depth === 7 ? {
        source: String(pathMass),
        oriented: String(orientedMass),
        seam: '43|74',
        innerDifference: 4,
        status: 'DECIMAL_RENDERING_MARKER_ONLY'
      } : null,
      gates: {
        exactAntipodeInvolution: exactInvolution,
        projectionCollisionExposed: projectionCollision,
        handleRecoversDeclaredSign: signedHandleAccuracy === 1,
        leakageRejectedAsSpecificity: projectionCollision && shadowOnlyAccuracyCeiling === 0.5
      }
    };
  }

  function pascalExteriorContract(depth = 4, sides = 7, sigma = 1, mode = 'shadow') {
    const exteriorMode = String(mode);
    if (!['shadow', 'signed', 'body'].includes(exteriorMode)) throw new Error(`Unsupported Pascal exterior: ${exteriorMode}`);
    const projection = shadowGonProjection(depth, sides, sigma);
    const ablation = antipodalSpecificityAblation(depth, sides);
    const common = {
      mode: exteriorMode,
      depth: projection.depth,
      sides: projection.sides,
      sigma: projection.sigma,
      sectorMass: projection.sectors.slice(),
      pathMass: projection.pathMass,
      carrierIdentityTransferred: false,
      scientificIdentityCreated: false
    };
    if (exteriorMode === 'shadow') return {
      ...common,
      codomain: `S_${projection.sides}`,
      formula: `P_${projection.sides}(x)` ,
      retained: ['sector mass'],
      discarded: ['orientation sigma', 'carrier microstate'],
      orientationBits: ablation.shadowInformationBits,
      returnReady: false,
      decision: 'ORIENTATION_COLLIDES_IN_SYMMETRIC_FULL_LAYER_SHADOW'
    };
    if (exteriorMode === 'signed') return {
      ...common,
      codomain: `S_${projection.sides} x {+,-}`,
      formula: `(P_${projection.sides}(x), sigma)`,
      retained: ['sector mass', 'declared orientation sigma'],
      discarded: ['carrier microstate', 'residual'],
      orientationBits: ablation.signedHandleInformationBits,
      returnReady: false,
      decision: 'ORIENTATION_VISIBLE_BECAUSE_SIGNED_HANDLE_IS_RETAINED'
    };
    return {
      ...common,
      codomain: 'H_BLUE_BODY',
      formula: `B(P_${projection.sides}(x), sigma, r)`,
      retained: ['sector mass', 'declared orientation sigma', 'declared residual r'],
      discarded: ['undeclared carrier details'],
      orientationBits: ablation.signedHandleInformationBits,
      returnReady: true,
      returnFormula: 'z = sigma alpha + r',
      decision: 'HOST_ADDRESS_IS_RETURN_READY_WHEN_SIGN_AND_RESIDUAL_ARE_RETAINED'
    };
  }

  function polygonAntipodeContract(sides = 7, sourceIndex = 0, sigma = 1) {
    const m = Number(sides);
    const source = Number(sourceIndex);
    const sign = Number(sigma) < 0 ? -1 : 1;
    if (!Number.isInteger(m) || m < 3) throw new Error('Polygon order must be an integer of at least three.');
    if (!Number.isInteger(source)) throw new Error('Polygon source index must be an integer.');
    const normalizedSource = mod(source, m);
    const even = m % 2 === 0;
    const lower = mod(normalizedSource + Math.floor(m / 2), m);
    const upper = mod(normalizedSource + Math.ceil(m / 2), m);
    return {
      sides: m,
      parity: even ? 'EVEN' : 'ODD',
      sourceIndex: normalizedSource,
      antipodeType: even ? 'UNIQUE_VERTEX' : 'EDGE_GAP_TWO_NEIGHBOURS',
      candidates: even ? [lower] : [lower, upper],
      selected: even ? lower : sign > 0 ? upper : lower,
      requiresOrientationHandle: !even,
      orientationBitsRequired: even ? 0 : 1,
      boundary: 'This is a regular-polygon display contract. It does not identify polygon adjacency with a carrier graph.'
    };
  }

  function polygonCountershotOverlayContract(sides = 17) {
    const m = Number(sides);
    if (!Number.isInteger(m) || m < 3) throw new Error('Polygon order must be an integer of at least three.');
    const enabled = m === 17;
    const cadence = [3, 1, 3, 1, 3, 1];
    return {
      sides: m,
      enabled,
      outerDecomposition: enabled ? {
        leftWing: 8,
        pivot: 1,
        rightWing: 8,
        total: 17,
        expression: '2^3 + 1^2 + 2^3 = 17'
      } : null,
      innerCore: enabled ? { sides: 8, nodeCount: 8, expression: '8 = 2^3' } : null,
      displayCadence: enabled ? {
        groups: cadence,
        nodeCount: cadence.reduce((sum, value) => sum + value, 0),
        expression: '3+1+3+1+3+1 = 12',
        carrierStatus: 'DISPLAY_ORBIT_NOT_POLYGON_ORDER'
      } : null,
      countershot: enabled ? {
        sourceIndex: 0,
        plus: polygonAntipodeContract(17, 0, 1),
        minus: polygonAntipodeContract(17, 0, -1)
      } : null,
      tongue: enabled ? { extensionNodes: 1, countedInPolygon: false, role: 'DISPLAY_EXTENSION' } : null,
      identityClaim: false,
      boundary: 'The C17 countershot is a local display overlay: C8 core, 12-node cadence and tongue remain separate registers. The tongue is not an eighteenth polygon vertex.'
    };
  }

  function qhDefgSeriesContract() {
    return {
      status: 'OPEN_SOURCE_BOUND_CROSSWALK_NO_RECONSTRUCTION',
      baseObjects: ['A', 'B', 'C'],
      relationObjects: {
        D: 'A INTERSECT B',
        E: 'B INTERSECT C',
        F: 'C INTERSECT A',
        G: 'A INTERSECT B INTERSECT C'
      },
      roleRecursion: ['Q_n -> H_n', 'H_n -> Q_(n+1)'],
      independentSplits: {
        relation: ['D', 'E'],
        layer: ['H+', 'H-'],
        cells: ['D+', 'E+', 'D-', 'E-']
      },
      retainedOutsideCross: ['F', 'G'],
      series: {
        position9: { title: 'Recursive Source-Court Tree', source: 'STATIC_DOCUMENTARY_ONLY', html: 'MISSING_UNRECOVERED' },
        position10: { title: 'Closed Loop Moving World', source: 'EXECUTABLE_HTML_PRESENT', html: 'closed-loop-moving-world-standalone.html' }
      },
      candidateAddresses: ['9.DEFG?', '10.F?'],
      identityClaim: false,
      boundary: 'The address labels are an open reading over existing historical sources. They do not reconstruct the missing position-9 HTML or establish Q/H, DEFG and polygon carriers as identical.'
    };
  }

  function polarToSquare(angleDegrees = 0) {
    const angle = normalizeDegrees(angleDegrees) * Math.PI / 180;
    const circle = [Math.cos(angle), Math.sin(angle)];
    const scale = 1 / Math.max(Math.abs(circle[0]), Math.abs(circle[1]), EPSILON);
    return { angle: normalizeDegrees(angleDegrees), circle, square: circle.map(value => value * scale) };
  }

  function fold45Pair(left = 4, right = 5) {
    const source = [Number(left), Number(right)];
    if (!source.every(value => Number.isInteger(value) && value >= 0 && value <= 9)) {
      throw new Error('The fold comparator accepts decimal digits from 0 through 9.');
    }
    const returned = [source[1], source[0]];
    const secondFold = [returned[1], returned[0]];
    const render = pair => pair[0] * 10 + pair[1];
    const sourceNumeral = render(source);
    const returnNumeral = render(returned);
    return {
      carrier: { source, returned },
      operator: { id: 'S45', axisDegrees: 45, rule: '(x,y)->(y,x)', involution: secondFold[0] === source[0] && secondFold[1] === source[1] },
      representation: { sourceNumeral, returnNumeral, type: 'ORDERED_DECIMAL_CONCATENATION' },
      invariants: { sum: source[0] + source[1], product: source[0] * source[1] },
      factorMarker: returnNumeral === 54 ? { value: 54, factors: [6, 9], exact: 6 * 9 === 54, status: 'SEPARATE_ARITHMETIC_MARKER' } : null,
      boundary: 'The 45-degree fold axis and the decimal numeral 45 are different typed objects.'
    };
  }

  function recordMirrorCode() {
    return {
      provenance: { id: 'EXP-LAB-01', date: '2025-05-24', sourceClass: 'USER_SUPPLIED_VISUAL' },
      format: { value: 7, unit: 'inch', role: 'EP_FORMAT_DIAMETER' },
      speeds: [
        { value: 33 + 1 / 3, unit: 'rpm', label: '33⅓', role: 'PLAYBACK_SPEED', openReading: 'IOTA_PLUS_II' },
        { value: 45, unit: 'rpm', label: '45', role: 'PLAYBACK_SPEED' },
        { value: 78, unit: 'rpm', label: '78', role: 'PLAYBACK_SPEED', mirrorWitness: { endpoints: [41, 37], exact: 41 + 37 === 78 } }
      ],
      covariantViews: { carrier: 'ONE_RECORD', views: ['A', 'B'], relation: 'SAME_CARRIER_DIFFERENT_FACE' },
      sideTurn: { fromA: 90, edge: 0, toB: 90, totalDegrees: 180, status: 'DECLARED_DISPLAY_DECOMPOSITION' },
      trueMirror: { source: 41, returned: 37, sum: 78, difference: 4, fixedPoint: false },
      boundary: '7 inches is a format diameter; 33⅓, 45 and 78 are rpm. A/B covariant views do not by themselves define the value-changing mirror operator.'
    };
  }

  function noiseGridControlContract(size = 111, operatorStates = 8) {
    const n = Number(size);
    const states = Number(operatorStates);
    if (!Number.isInteger(n) || n < 1) throw new Error('Grid size must be a positive integer.');
    if (!Number.isInteger(states) || states < 2) throw new Error('Operator alphabet must contain at least two states.');
    const carrierStates = n ** 2;
    return {
      gridSize: n,
      carrierStates,
      crtAddress: { modulus: 777, factors: [21, 37], coprime: true, exact: 21 * 37 === 777 },
      operatorStates: states,
      registers: [
        { name: 'CARRIER', value: `${n}^2=${carrierStates}` },
        { name: 'CRT_ADDRESS', value: '777=21*37' },
        { name: 'OPERATOR_ALPHABET', value: `${states} states` }
      ],
      controls: {
        declaredMapping: true,
        permutationNull: 'REQUIRED_NOT_RUN',
        phaseShiftNull: 'REQUIRED_NOT_RUN',
        outOfSampleReplay: 'REQUIRED_NOT_RUN'
      },
      decision: 'GRID_NOT_YET_IDENTIFIED',
      boundary: 'A rendered grid is not evidence of structure unless it outperforms locked null mappings and replays out of sample.'
    };
  }

  function janusGridFoldSummary(size = 11) {
    const n = Number(size);
    if (!Number.isInteger(n) || n < 1 || n % 2 === 0) throw new Error('Janus grid size must be a positive odd integer.');
    const originalStates = n ** 2;
    const quotientOrbits = n * (n + 1) / 2;
    return {
      size: n,
      originalStates,
      quotientOrbits,
      quotientRetention: quotientOrbits / originalStates,
      lostWithoutSideBit: 1 - quotientOrbits / originalStates,
      fixedAxisStates: n,
      involution: true,
      exactWithSideBit: true,
      cyclicAdjacencyRetention: n === 11 ? 1 : null,
      randomPairingMean: n === 11 ? 0.27365 : null,
      monteCarloP: n === 11 ? 0.0009 : null,
      boundary: 'Finite Janus grid quotient only; the side bit restores handedness and does not imply a physical effect.'
    };
  }

  function polarPassRaster(angleBins = 144, orbitSamples = 1000, transportSamples = 1000) {
    const a = Math.max(1, Math.trunc(Number(angleBins)));
    const o = Math.max(1, Math.trunc(Number(orbitSamples)));
    const t = Math.max(1, Math.trunc(Number(transportSamples)));
    return {
      angleBins: a,
      orbitSamples: o,
      transportSamples: t,
      angleStates: a,
      orbitStates: a * o,
      transportStates: a * o * t,
      operatorPath: ['ANGLE', 'ORBIT', 'TRANSPORT'],
      boundary: 'Declared raster cardinality only; semantics require a separately specified measurement model.'
    };
  }

  function memoryGateLens(delta0 = 1, epsilon = 1e-6, lambda = -0.1) {
    const d = Math.abs(Number(delta0));
    const e = Math.abs(Number(epsilon));
    const l = Math.abs(Number(lambda));
    if (!(d > 0) || !(e > 0) || !(l > 0)) throw new Error('Memory gate parameters must be finite and non-zero.');
    return {
      delta0: d,
      epsilon: e,
      lambda: Number(lambda),
      tauM: Math.log(d / e) / l,
      radialBands: ['N0-in', 'N1-in', 'N2-in', 'N3-shell', 'N2-out', 'N1-out', 'N0-out'],
      evidenceStatus: 'CONDITIONAL_ARCHIVE_NO_INDEPENDENT_REPLAY',
      boundary: 'Analytic local-contraction lens only; archived EXP-JANUS-18D gate rows and frozen classifier are not available.'
    };
  }

  function familyOrientationSnapshot(step = 0) {
    const safeStep = Math.max(0, Math.trunc(Number(step) || 0));
    const index = mod(safeStep, FAMILY_ORIENTATION_FIXTURE.terminalFrames.length);
    const trail = Array.from({ length: Math.min(3, safeStep) }, (_, offset) => {
      const trailIndex = mod(index - offset - 1, FAMILY_ORIENTATION_FIXTURE.terminalFrames.length);
      return FAMILY_ORIENTATION_FIXTURE.terminalFrames[trailIndex];
    });
    return {
      step: safeStep,
      alphaRole: 'F1',
      thetaRole: 'F7',
      terminalFrame: FAMILY_ORIENTATION_FIXTURE.terminalFrames[index],
      theta: FAMILY_ORIENTATION_FIXTURE.terminalAngles[index],
      epsilonTrace: trail,
      operatorE: 'E_s',
      traceSymbol: 'ε',
      markers: { ...FAMILY_ORIENTATION_FIXTURE.candidateMarkers }
    };
  }

  function cycleAntipode(order = 7, vertex = 0, sheet = 1, retainSheet = true) {
    const n = Number(order);
    if (!Number.isInteger(n) || n < 3 || n > 64) throw new Error('Cycle order must be an integer from 3 to 64.');
    const i = mod(Number(vertex), n);
    const sigma = Number(sheet) < 0 ? -1 : 1;
    if (n % 2 === 0) {
      return {
        order: n,
        source: { vertex: i, sheet: sigma },
        resolved: true,
        sheetRequired: false,
        candidates: [{ vertex: mod(i + n / 2, n), sheet: sigma }]
      };
    }
    const left = { vertex: mod(i + (n - 1) / 2, n), sheet: 1 };
    const right = { vertex: mod(i + (n + 1) / 2, n), sheet: -1 };
    if (!retainSheet) {
      return {
        order: n,
        source: { vertex: i, sheet: null },
        resolved: false,
        sheetRequired: true,
        candidates: [left, right]
      };
    }
    const step = sigma < 0 ? (n - 1) / 2 : (n + 1) / 2;
    return {
      order: n,
      source: { vertex: i, sheet: sigma },
      resolved: true,
      sheetRequired: true,
      candidates: [{ vertex: mod(i + step, n), sheet: -sigma }]
    };
  }

  function cycleGoReturn(order = 7, startVertex = 0, sheet = 1, goSteps = 1, retainSheet = true) {
    const n = Number(order);
    const steps = mod(Math.trunc(Number(goSteps)), n);
    const start = { vertex: mod(Number(startVertex), n), sheet: Number(sheet) < 0 ? -1 : 1 };
    const go = { vertex: mod(start.vertex + steps, n), sheet: start.sheet };
    const first = cycleAntipode(n, go.vertex, go.sheet, retainSheet);
    const trace = [{ phase: 'SOURCE', ...start }, { phase: 'GO', ...go }];
    if (!first.resolved) {
      return {
        order: n,
        goSteps: steps,
        retainSheet: false,
        resolved: false,
        exact: false,
        trace,
        ambiguity: first.candidates,
        decision: 'HOLD_PROJECTION_LOST_SIDE'
      };
    }
    const across = first.candidates[0];
    trace.push({ phase: 'KNICK', ...across });
    const second = cycleAntipode(n, across.vertex, across.sheet, retainSheet);
    const unfolded = second.candidates[0];
    trace.push({ phase: 'UNFOLD', ...unfolded });
    const returned = { vertex: mod(unfolded.vertex - steps, n), sheet: unfolded.sheet };
    trace.push({ phase: 'RETURN', ...returned });
    const exact = returned.vertex === start.vertex && (!first.sheetRequired || returned.sheet === start.sheet);
    return {
      order: n,
      goSteps: steps,
      retainSheet: Boolean(retainSheet),
      resolved: true,
      exact,
      trace,
      ambiguity: [],
      decision: exact ? 'EXACT_RETURN' : 'RETURN_MISMATCH'
    };
  }

  function exhaustiveCycleGoReturn(order = 7, retainSheet = true, goSteps = 1) {
    const n = Number(order);
    cycleAntipode(n, 0, 1, retainSheet);
    const sheets = n % 2 === 1 && retainSheet ? [-1, 1] : [1];
    const runs = [];
    for (let vertex = 0; vertex < n; vertex += 1) {
      for (const sheet of sheets) runs.push(cycleGoReturn(n, vertex, sheet, goSteps, retainSheet));
    }
    const resolved = runs.filter(run => run.resolved).length;
    const exact = runs.filter(run => run.exact).length;
    const ambiguous = runs.length - resolved;
    return {
      order: n,
      parity: n % 2 === 0 ? 'EVEN' : 'ODD',
      retainSheet: Boolean(retainSheet),
      goSteps: mod(Math.trunc(Number(goSteps)), n),
      testedStates: runs.length,
      resolved,
      exact,
      ambiguous,
      exactRate: runs.length ? exact / runs.length : 0,
      sheetRequired: n % 2 === 1,
      orientationBitsRequired: n % 2 === 1 ? 1 : 0,
      decision: ambiguous > 0 ? 'HOLD_AMBIGUOUS_ODD_ANTIPODE' : exact === runs.length ? 'PASS_EXACT_GO_RETURN' : 'FAIL_RETURN_MISMATCH',
      runs
    };
  }

  function oddAntipodeBattery(orders = [6, 7, 8], goSteps = 1) {
    const uniqueOrders = [...new Set(orders.map(Number))];
    const controls = uniqueOrders.map(order => ({
      order,
      projected: exhaustiveCycleGoReturn(order, false, goSteps),
      handled: exhaustiveCycleGoReturn(order, true, goSteps)
    }));
    const even = controls.filter(control => control.order % 2 === 0);
    const odd = controls.filter(control => control.order % 2 === 1);
    const gates = {
      evenControlsUniqueWithoutSheet: even.length > 0 && even.every(control => control.projected.exactRate === 1),
      oddProjectionExposesAmbiguity: odd.length > 0 && odd.every(control => control.projected.ambiguous === control.projected.testedStates),
      oddSheetRestoresDeterminism: odd.length > 0 && odd.every(control => control.handled.resolved === control.handled.testedStates),
      oddSheetClosesExactReturn: odd.length > 0 && odd.every(control => control.handled.exactRate === 1)
    };
    return {
      orders: uniqueOrders,
      goSteps: Number(goSteps),
      controls,
      gates,
      pass: Object.values(gates).every(Boolean),
      decision: Object.values(gates).every(Boolean) ? 'PASS_ODD_ANTIPODE_REQUIRES_ORIENTATION_HANDLE' : 'FAIL_OR_UNINFORMATIVE',
      claimBoundary: 'Finite cycle theorem and exhaustive local implementation only; no E8, physical or universal specificity claim.'
    };
  }

  function s3PermutationRegister() {
    const words = ['123', '132', '213', '231', '312', '321'];
    const axisByWord = { '123': 'A', '321': 'A', '132': 'B', '231': 'B', '213': 'C', '312': 'C' };
    const inversionParity = word => {
      let inversions = 0;
      for (let i = 0; i < word.length; i += 1) for (let j = i + 1; j < word.length; j += 1) if (word[i] > word[j]) inversions += 1;
      return inversions % 2 === 0 ? 1 : -1;
    };
    const states = words.map(word => ({
      word,
      axis: axisByWord[word],
      side: inversionParity(word),
      reverse: [...word].reverse().join('')
    }));
    return {
      carrier: 'S3',
      stateCount: states.length,
      states,
      reversalPairs: [['123', '321'], ['132', '231'], ['213', '312']],
      addressRule: 'S3 is bijective as a state set with {A,B,C} x C2; this is not asserted as a direct-product group identity.',
      orientationMarker: { notation: '2^1·i', magnitude: 2, basis: 'i', square: -4, role: 'TYPED_COMPLEX_DISPLAY_MARKER' }
    };
  }

  function repunitPalindromeGate(length = 3) {
    const k = Math.trunc(Number(length));
    if (!Number.isInteger(k) || k < 1 || k > 9) throw new RangeError('Repunit palindrome gate length must be an integer from 1 to 9.');
    const root = '1'.repeat(k);
    const square = (BigInt(root) ** 2n).toString();
    const ascending = Array.from({ length: k }, (_, index) => String(index + 1)).join('');
    const mirrorClosure = ascending + [...ascending.slice(0, -1)].reverse().join('');
    return {
      length: k,
      root,
      square,
      halfSeed: ascending,
      mirrorClosure,
      exactCoincidence: square === mirrorClosure,
      rule: 'For 1 <= k <= 9, the square of the k-digit decimal repunit is the carry-free odd palindrome 123...k...321.',
      boundary: 'Numeric squaring and word-level mirror closure are distinct constructions whose outputs coincide in this bounded decimal family.'
    };
  }

  function hypercubeGraph(dimension = 3) {
    const d = Math.trunc(Number(dimension));
    if (!Number.isInteger(d) || d < 1 || d > 8) throw new RangeError('Hypercube dimension must be an integer from 1 to 8.');
    const vertexCount = 2 ** d;
    const vertices = Array.from({ length: vertexCount }, (_, value) => ({
      value,
      bits: value.toString(2).padStart(d, '0')
    }));
    const edges = [];
    for (let from = 0; from < vertexCount; from += 1) {
      for (let axis = 0; axis < d; axis += 1) {
        const to = from ^ (1 << axis);
        if (from < to) edges.push({ from, to, axis });
      }
    }
    return {
      dimension: d,
      vertices,
      edges,
      vertexCount,
      edgeCount: edges.length,
      degree: d,
      handshakeEdgeCount: vertexCount * d / 2
    };
  }

  function rootSpace838Audit() {
    const q3 = hypercubeGraph(3);
    const bridgeEdges = q3.vertices.map(vertex => ({ from: vertex.value, to: vertex.value + q3.vertexCount, axis: 3 }));
    const q4 = hypercubeGraph(4);
    const p8 = 19;
    const doubled = 2 * p8;
    const reversed = Number(String(doubled).split('').reverse().join(''));
    let primeIndex = 0;
    for (let value = 2; value <= reversed; value += 1) if (isPrimeInteger(value)) primeIndex += 1;
    const leftConcat = Number(`${q3.vertexCount}${doubled}`);
    const rightConcat = Number(`${reversed}${q3.vertexCount}`);
    return {
      identity: { module: 'MOD:TESSAREC', artifact: 'ART:TESSAREC:ROOT_SPACE_8_16' },
      q3,
      double: {
        layerCount: 2,
        verticesPerLayer: q3.vertexCount,
        internalTransitionTypes: q3.dimension,
        internalEdgesPerLayer: q3.edgeCount,
        bridgeEdges,
        vertexCount: 2 * q3.vertexCount,
        edgeCount: 2 * q3.edgeCount + bridgeEdges.length
      },
      q4,
      readingMask: [q3.vertexCount, q3.dimension, bridgeEdges.length],
      decimalCheck: {
        p8,
        doubled,
        reversed,
        reversedPrimeIndex: primeIndex,
        leftConcat,
        rightConcat,
        palindrome: leftConcat === rightConcat
      },
      gates: {
        q3Handshake: q3.edgeCount === q3.handshakeEdgeCount && q3.edgeCount === 12,
        q4LayerDecomposition: q4.vertexCount === 16 && q4.edgeCount === 2 * q3.edgeCount + bridgeEdges.length,
        declaredReadingMask: q3.vertexCount === 8 && q3.dimension === 3 && bridgeEdges.length === 8,
        decimalPalindrome: leftConcat === 838 && rightConcat === 838,
        reversedIsPrime23: isPrimeInteger(reversed) && primeIndex === 23
      },
      boundary: '8|3|8 is a declared graph-reading mask. The 19→38→83→838 chain is a separate decimal mnemonic, not an integer equation, graph derivation, identity proof or physics claim.'
    };
  }

  const Q4_GRAY_AXIS_SCHEDULE = Object.freeze([0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 3]);

  function rootSpaceEngineFrame(tick = 0) {
    const normalizedTick = mod(Math.trunc(Number(tick)), 16);
    const q4Address = normalizedTick ^ (normalizedTick >> 1);
    const previousTick = mod(normalizedTick - 1, 16);
    const previousAddress = previousTick ^ (previousTick >> 1);
    const axis = Q4_GRAY_AXIS_SCHEDULE[previousTick];
    return {
      tick: normalizedTick,
      q4Address,
      bits: q4Address.toString(2).padStart(4, '0'),
      layer: (q4Address >> 3) & 1,
      vertex: q4Address & 7,
      previousAddress,
      previousLayer: (previousAddress >> 3) & 1,
      previousVertex: previousAddress & 7,
      axis,
      transitionType: axis === 3 ? 'BRIDGE' : 'INTERNAL',
      returned: normalizedTick === 0
    };
  }

  function createRootSpaceEngine(overrides = {}) {
    const tick = mod(Math.trunc(Number(overrides.tick || 0)), 16);
    return {
      schema: 'nexah.a0.root-space-engine-state',
      version: VERSION,
      carrierId: 'MOD:TESSAREC',
      artifactId: 'ART:TESSAREC:ROOT_SPACE_8_16',
      tick,
      cycles: Math.max(0, Math.trunc(Number(overrides.cycles || 0))),
      speedMs: Math.max(120, Math.trunc(Number(overrides.speedMs || 720))),
      running: Boolean(overrides.running),
      history: Array.isArray(overrides.history) ? clone(overrides.history) : [],
      frame: rootSpaceEngineFrame(tick)
    };
  }

  function stepRootSpaceEngine(input = {}, direction = 1) {
    const state = createRootSpaceEngine(input);
    const step = Number(direction) < 0 ? -1 : 1;
    const nextTick = mod(state.tick + step, 16);
    const wrappedForward = step > 0 && state.tick === 15;
    const wrappedBackward = step < 0 && state.tick === 0;
    const frame = rootSpaceEngineFrame(nextTick);
    const history = state.history.concat({
      index: state.history.length + 1,
      fromTick: state.tick,
      toTick: nextTick,
      axis: step > 0 ? Q4_GRAY_AXIS_SCHEDULE[state.tick] : frame.axis,
      transitionType: (step > 0 ? Q4_GRAY_AXIS_SCHEDULE[state.tick] : frame.axis) === 3 ? 'BRIDGE' : 'INTERNAL',
      q4Address: frame.q4Address,
      bits: frame.bits
    });
    return createRootSpaceEngine({
      tick: nextTick,
      cycles: state.cycles + (wrappedForward ? 1 : 0) - (wrappedBackward && state.cycles > 0 ? 1 : 0),
      speedMs: state.speedMs,
      running: state.running,
      history
    });
  }

  function runRootSpaceEngine(steps = 16, initial = {}) {
    let state = createRootSpaceEngine(initial);
    for (let index = 0; index < Math.max(0, Math.trunc(Number(steps))); index += 1) state = stepRootSpaceEngine(state, 1);
    return state;
  }

  const PXA_JOURNEY_PHASES = Object.freeze([
    Object.freeze({ id: 'CARRIER', title: 'One carrier enters', handoff: 'DECLARED_CARRIER', retains: 'x · address · provenance', copy: 'The declared carrier enters before either view is drawn.' }),
    Object.freeze({ id: 'P_VIEW', title: 'Pascal view opens', handoff: 'PASCAL_PROJECTION', retains: 'P(x) · cyan sheet', copy: 'The cyan lens exposes a bounded Pascal projection of the same carrier.' }),
    Object.freeze({ id: 'BINDER', title: 'The seam becomes visible', handoff: 'BOUNDARY_RECORD', retains: 'cut · aperture · comparison frame', copy: 'The hourglass is a binder and comparison seam, not a second carrier.' }),
    Object.freeze({ id: 'A_VIEW', title: 'Antipode view answers', handoff: 'ANTIPODE_ORIENTATION', retains: 'A(x) · magenta sheet · sigma', copy: 'The magenta lens answers with the oriented antipode view of that carrier.' }),
    Object.freeze({ id: 'RESIDUAL', title: 'The rest remains', handoff: 'RESIDUAL_LEDGER', retains: 'r · mismatch · unresolved trace', copy: 'Difference that cannot be identified with either view is retained below the seam.' }),
    Object.freeze({ id: 'RETURN', title: 'Compare and return', handoff: 'PXA_RETURN_RECORD', retains: 'x -> (P(x), A(x); r) -> compare', copy: 'The return closes the view journey while preserving the typed record of what changed.' })
  ]);

  function createPxaJourneyState(overrides = {}) {
    const phaseIndex = mod(Math.trunc(Number(overrides.phaseIndex || 0)), PXA_JOURNEY_PHASES.length);
    return {
      schema: 'nexah.a0.pascal-antipode-view-journey',
      version: VERSION,
      phaseIndex,
      cycles: Math.max(0, Math.trunc(Number(overrides.cycles || 0))),
      speedMs: Math.max(700, Math.trunc(Number(overrides.speedMs || 2100))),
      running: Boolean(overrides.running),
      history: Array.isArray(overrides.history) ? clone(overrides.history) : [],
      currentPhase: clone(PXA_JOURNEY_PHASES[phaseIndex]),
      carrierId: 'TRINOMIAL_LAYER',
      boundary: 'PASCAL_ANTIPODE_VIEW_GRAMMAR_NOT_CARRIER_IDENTITY'
    };
  }

  function stepPxaJourney(input = {}, direction = 1) {
    const state = createPxaJourneyState(input);
    const step = Number(direction) < 0 ? -1 : 1;
    const nextIndex = mod(state.phaseIndex + step, PXA_JOURNEY_PHASES.length);
    const from = PXA_JOURNEY_PHASES[state.phaseIndex];
    const to = PXA_JOURNEY_PHASES[nextIndex];
    const wrappedForward = step > 0 && nextIndex === 0;
    const wrappedBackward = step < 0 && state.phaseIndex === 0;
    const history = state.history.concat({
      index: state.history.length + 1,
      from: from.id,
      to: to.id,
      carrier: state.carrierId,
      sameCarrier: true,
      handoff: to.handoff,
      boundary: state.boundary
    });
    return createPxaJourneyState({
      phaseIndex: nextIndex,
      cycles: state.cycles + (wrappedForward ? 1 : 0) - (wrappedBackward && state.cycles > 0 ? 1 : 0),
      speedMs: state.speedMs,
      running: state.running,
      history
    });
  }

  function runPxaJourney(steps = PXA_JOURNEY_PHASES.length, initial = {}) {
    let state = createPxaJourneyState(initial);
    for (let index = 0; index < Math.max(0, Math.trunc(Number(steps))); index += 1) state = stepPxaJourney(state, 1);
    return state;
  }

  const MASTER_DEMO_PHASES = Object.freeze([
    Object.freeze({ id: 'SOURCE', title: 'State enters the bench', carrier: 'A0.CRT.CHANNEL/5x73', handoff: 'STATE_RECORD', target: '#statePanel', copy: 'Prime address and carrier enter the bench. No later carrier identity is inferred from this source.' }),
    Object.freeze({ id: 'OPERATOR', title: 'Local operator acts', carrier: 'A0.CRT.CHANNEL/5x73', handoff: 'TYPED_OPERATOR_RESULT', target: '#operatorPanel', copy: 'A declared local adapter changes the state record; the source carrier remains explicit.' }),
    Object.freeze({ id: 'EDGE', title: 'Directed edge-turn', carrier: 'C5_DIRECTED_EDGE', handoff: 'EDGE_TURN_RECORD', target: '[data-demo-phase="EDGE"]', copy: 'The operator result is handed to a finite C5 edge-turn instrument. This is a typed translation, not carrier identity.' }),
    Object.freeze({ id: 'SHADOW', title: 'Projected shadow', carrier: 'TRINOMIAL_LAYER', handoff: 'PROJECTED_SHADOW_RECORD', target: '[data-demo-phase="SHADOW"]', copy: 'A separate exact combinatorial layer is projected into a bounded shadow view.' }),
    Object.freeze({ id: 'FAMILY', title: 'Family role lens', carrier: 'A0_FAMILY_ROLE_LENS', handoff: 'ROLE_TRACE', target: '[data-demo-phase="FAMILY"]', copy: 'The trace enters a local role lens; role correspondence is kept distinct from scientific identity.' }),
    Object.freeze({ id: 'GRID', title: 'Separated evidence grid', carrier: 'SEPARATED_SOURCE_CONTRACTS', handoff: 'EVIDENCE_CLASS_LEDGER', target: '[data-demo-phase="GRID"]', copy: 'Noise, grid, transport and memory remain four declared evidence classes inside one visible corridor.' }),
    Object.freeze({ id: 'RETURN', title: 'Finite return audit', carrier: 'FINITE_CYCLE_C6_C8', handoff: 'RETURN_AUDIT', target: '[data-demo-phase="RETURN"]', copy: 'Even and odd controls test whether the retained sheet is sufficient for an exact return.' }),
    Object.freeze({ id: 'FOLD', title: 'Representation fold', carrier: 'ORDERED_PAIR_RECORD', handoff: 'REPRESENTATION_RECORD', target: '[data-demo-phase="FOLD"]', copy: 'The 45° fold records a representation change while refusing a physical-field claim.' }),
    Object.freeze({ id: 'ROOT', title: 'Q4 root-space replay', carrier: 'MOD:TESSAREC', handoff: 'Q4_REPLAY', target: '[data-demo-phase="ROOT"]', copy: 'The finite Q4 engine exposes 8|3|8 as a reading mask over a deterministic 16-step cycle.' }),
    Object.freeze({ id: 'RECORD', title: 'Typed run closes', carrier: 'TYPED_RUN_RECORD', handoff: 'COMPLETE', target: '#recordPanel', copy: 'The run closes as a ledger of typed handoffs. Its carriers remain separate and replayable.' })
  ]);

  function createMasterDemonstratorState(overrides = {}) {
    const phaseIndex = mod(Math.trunc(Number(overrides.phaseIndex || 0)), MASTER_DEMO_PHASES.length);
    return {
      schema: 'nexah.a0.orientation-cockpit-run',
      version: VERSION,
      phaseIndex,
      cycles: Math.max(0, Math.trunc(Number(overrides.cycles || 0))),
      speedMs: Math.max(600, Math.trunc(Number(overrides.speedMs || 2400))),
      running: Boolean(overrides.running),
      history: Array.isArray(overrides.history) ? clone(overrides.history) : [],
      currentPhase: clone(MASTER_DEMO_PHASES[phaseIndex]),
      boundary: 'TYPED_HANDOFF_NOT_CARRIER_IDENTITY'
    };
  }

  function stepMasterDemonstrator(input = {}, direction = 1) {
    const state = createMasterDemonstratorState(input);
    const step = Number(direction) < 0 ? -1 : 1;
    const nextIndex = mod(state.phaseIndex + step, MASTER_DEMO_PHASES.length);
    const from = MASTER_DEMO_PHASES[state.phaseIndex];
    const to = MASTER_DEMO_PHASES[nextIndex];
    const wrappedForward = step > 0 && nextIndex === 0;
    const wrappedBackward = step < 0 && state.phaseIndex === 0;
    const history = state.history.concat({
      index: state.history.length + 1,
      from: from.id,
      to: to.id,
      carrierFrom: from.carrier,
      carrierTo: to.carrier,
      sameCarrier: from.carrier === to.carrier,
      handoff: to.handoff,
      boundary: 'TYPED_HANDOFF_NOT_CARRIER_IDENTITY'
    });
    return createMasterDemonstratorState({
      phaseIndex: nextIndex,
      cycles: state.cycles + (wrappedForward ? 1 : 0) - (wrappedBackward && state.cycles > 0 ? 1 : 0),
      speedMs: state.speedMs,
      running: state.running,
      history
    });
  }

  function runMasterDemonstrator(steps = MASTER_DEMO_PHASES.length, initial = {}) {
    let state = createMasterDemonstratorState(initial);
    for (let index = 0; index < Math.max(0, Math.trunc(Number(steps))); index += 1) state = stepMasterDemonstrator(state, 1);
    return state;
  }

  return {
    VERSION, PRIMES, OPERATOR_IDS, createState, stateCore, applyOperator, replay,
    assessReturn, createBlindChallenge, verifyBlindAnswer, normalizeDegrees, classifySide, primeSupport,
    neighborsC5, classifyEdgeTurn, createEdgeState, setEdgeCandidate, rotateEdgeCandidate,
    canonicalOrientedCycle, commitEdgeTurn, traceC5, createEdgeBlindChallenge, verifyEdgeBlindAnswer,
    PRIME_SHADOW_GONS, SHADOW_GONS, LIFE04B_STRESS_FIXTURE, FAMILY_ORIENTATION_FIXTURE,
    binomialCoefficient, pascalRow, fibonacci, isPrimeInteger, pascalSpecificityCalibration,
    trinomialMultiplicity, trinomialLayer, antipodePascal, shadowGonProjection, antipodalSpecificityAblation, pascalExteriorContract,
    polygonAntipodeContract, polygonCountershotOverlayContract, qhDefgSeriesContract,
    polarToSquare, fold45Pair, recordMirrorCode, noiseGridControlContract, janusGridFoldSummary, polarPassRaster, memoryGateLens, familyOrientationSnapshot,
    cycleAntipode, cycleGoReturn, exhaustiveCycleGoReturn, oddAntipodeBattery, s3PermutationRegister, repunitPalindromeGate,
    hypercubeGraph, rootSpace838Audit, Q4_GRAY_AXIS_SCHEDULE,
    rootSpaceEngineFrame, createRootSpaceEngine, stepRootSpaceEngine, runRootSpaceEngine,
    PXA_JOURNEY_PHASES, createPxaJourneyState, stepPxaJourney, runPxaJourney,
    MASTER_DEMO_PHASES, createMasterDemonstratorState, stepMasterDemonstrator, runMasterDemonstrator
  };
});
