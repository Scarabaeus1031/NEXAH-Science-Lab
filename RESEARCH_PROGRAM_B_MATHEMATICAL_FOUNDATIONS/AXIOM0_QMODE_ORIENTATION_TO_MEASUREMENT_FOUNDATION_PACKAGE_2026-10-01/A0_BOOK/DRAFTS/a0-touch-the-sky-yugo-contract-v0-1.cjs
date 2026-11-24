'use strict';

const Yugo = require('../a0-yugo-iota-pivot.js');

const VERSION = '0.1.0';
const CLASSIFICATION = 'LOCAL_WORKING_OPERATOR_CONTRACT / NO_RESEARCH_ACTIVATION';
const PHASES = Object.freeze(['READY', 'PLAY', 'IN_FIELD', 'SHEARED', 'FLIPPED', 'RETURN']);
const ORIENTATIONS = Object.freeze(['A', 'B']);

function freezeLedger(ledger) {
  return Object.freeze(ledger.map(entry => Object.freeze({...entry})));
}

function normalizeWord(value) {
  const raw = String(value);
  if (!/^\d{1,4}$/.test(raw)) throw Error('carrier must contain one to four decimal digits');
  return raw.padStart(4, '0');
}

function middleSquareCut(value) {
  const input = normalizeWord(value);
  const square = String(Number(input) ** 2).padStart(8, '0');
  const left = square.slice(0, 2);
  const visible = square.slice(2, 6);
  const right = square.slice(6, 8);
  return Object.freeze({input, square, left, visible, right, reconstructs: `${left}${visible}${right}` === square});
}

function flipOrientation(value) {
  if (!ORIENTATIONS.includes(value)) throw Error('orientation must be A or B');
  return value === 'A' ? 'B' : 'A';
}

function createState(input = {}) {
  const phase = PHASES.includes(input.phase) ? input.phase : 'READY';
  const orientation = ORIENTATIONS.includes(input.orientation) ? input.orientation : 'A';
  return Object.freeze({
    schema: 'a0.touch-the-sky-yugo-working-state/0.1',
    field: 'MIDDLE_SQUARE_4 / DECLARED CUT FIELD',
    carrier: normalizeWord(input.carrier ?? '4243'),
    cut: input.cut ?? null,
    hidden: input.hidden ? Object.freeze({...input.hidden}) : null,
    fullSquare: input.fullSquare ?? null,
    orientation,
    phase,
    activeView: input.activeView ?? 'FIELD',
    eventCount: Number.isInteger(input.eventCount) ? input.eventCount : 0,
    round: Number.isInteger(input.round) ? input.round : 0,
    seam: input.seam ? Object.freeze({...input.seam}) : null,
    lastReturn: input.lastReturn ? Object.freeze({...input.lastReturn}) : null,
    ledger: freezeLedger(Array.isArray(input.ledger) ? input.ledger : [])
  });
}

function append(state, entry, overrides = {}) {
  return createState({...state, ...overrides, ledger: [...state.ledger, entry]});
}

function requirePhase(state, expected, operator) {
  const current = createState(state);
  if (current.phase !== expected) throw Error(`${operator} requires ${expected}, received ${current.phase}`);
  return current;
}

function plusOne(state, eventId = `round-${createState(state).round}-seam`) {
  const current = requirePhase(state, 'READY', 'PLUS_ONE');
  if (!eventId || typeof eventId !== 'string') throw Error('PLUS_ONE requires a typed event id');
  return append(current, {
    action: 'PLUS_ONE_SEAM_EVENT',
    eventId,
    round: current.round,
    meaning: 'BINDING_EVENT_NOT_ARITHMETIC_INCREMENT'
  }, {
    phase: 'PLAY',
    eventCount: current.eventCount + 1,
    seam: {
      eventId,
      role: 'WHITE_CENTER_EVENT_LINE',
      zipperIdentity: false,
      note: 'The center seam is an event line; the existing YUGO source keeps the paired toothed boundary as the zipper.'
    }
  });
}

function drop(state) {
  const current = requirePhase(state, 'PLAY', 'DROP');
  return append(current, {action: 'DROP_CARRIER', eventId: current.seam.eventId, carrier: current.carrier}, {phase: 'IN_FIELD'});
}

function shear(state) {
  const current = requirePhase(state, 'IN_FIELD', 'SHEAR');
  const cut = middleSquareCut(current.carrier);
  return append(current, {
    action: 'SHEAR_VISIBLE_HIDDEN',
    eventId: current.seam.eventId,
    input: cut.input,
    square: cut.square,
    visible: cut.visible,
    hidden: {left: cut.left, right: cut.right}
  }, {
    carrier: cut.visible,
    cut: cut.visible,
    hidden: {left: cut.left, right: cut.right},
    fullSquare: cut.square,
    phase: 'SHEARED'
  });
}

function flip(state) {
  const current = requirePhase(state, 'SHEARED', 'FLIP');
  const orientation = flipOrientation(current.orientation);
  return append(current, {
    action: 'FLIP_ORIENTATION',
    eventId: current.seam.eventId,
    from: current.orientation,
    to: orientation
  }, {orientation, phase: 'FLIPPED'});
}

function returnView(state) {
  const current = requirePhase(state, 'FLIPPED', 'RETURN');
  return createState({
    ...current,
    phase: 'RETURN',
    activeView: 'HOME',
    lastReturn: {
      eventId: current.seam.eventId,
      round: current.round,
      carrier: current.carrier,
      orientation: current.orientation,
      ledgerLength: current.ledger.length
    },
    ledger: current.ledger
  });
}

function restart(state) {
  const current = requirePhase(state, 'RETURN', 'RESTART');
  return createState({
    ...current,
    phase: 'READY',
    activeView: 'FIELD',
    round: current.round + 1,
    cut: null,
    hidden: null,
    fullSquare: null,
    seam: null,
    ledger: current.ledger
  });
}

function runRound(state, eventId) {
  return returnView(flip(shear(drop(plusOne(state, eventId)))));
}

function replay(seed = '4243', rounds = 4) {
  if (!Number.isInteger(rounds) || rounds < 1 || rounds > 100) throw Error('rounds must be an integer from 1 to 100');
  let state = createState({carrier: seed});
  const records = [];
  for (let index = 0; index < rounds; index += 1) {
    const before = state.carrier;
    state = runRound(state, `round-${index}-seam`);
    records.push(Object.freeze({
      round: index,
      input: before,
      square: state.fullSquare,
      hidden: state.hidden,
      visible: state.cut,
      orientation: state.orientation,
      eventCount: state.eventCount,
      ledgerLength: state.ledger.length
    }));
    if (index < rounds - 1) state = restart(state);
  }
  return Object.freeze({records: Object.freeze(records), state});
}

function buildReceipt(replayResult) {
  const result = replayResult ?? replay();
  const yugo = Yugo.buildReceipt(Yugo.createState());
  return Object.freeze({
    schema: 'a0.touch-the-sky-yugo-working-receipt/0.1',
    version: VERSION,
    classification: CLASSIFICATION,
    existingHostIdentity: Yugo.IDENTITY,
    bindings: Object.freeze({
      yugoRole: yugo.current.yugo.role,
      iotaRole: yugo.current.iota.role,
      centerSeam: yugo.current.distinction.seam,
      zipperRole: yugo.current.distinction.zipper,
      udf: 'WORKING_RECEIPT_SHAPE_ONLY / NOT A NEW UDF PROFILE',
      lissajous: 'DISPLAY_PROJECTION_ONLY / NOT THE STORED STATE'
    }),
    operatorOrder: Object.freeze(['PLUS_ONE', 'DROP', 'SHEAR', 'FLIP', 'RETURN', 'RESTART']),
    result,
    invariants: Object.freeze({
      plusOneIsEventNotAddition: true,
      returnIsNotReset: true,
      returnPreservesLedger: true,
      visiblePlusHiddenReconstructsSquare: result.records.every(record => `${record.hidden.left}${record.visible}${record.hidden.right}` === record.square),
      centerSeamAloneIsZipper: false
    }),
    authority: Object.freeze({
      researchRun: false,
      scientificEvidence: false,
      newCanonicalIdentity: false,
      newRelation: false,
      newOperatorIdentity: false,
      publication: false
    }),
    boundary: 'A deterministic local working contract over existing A0 YUGO/IOTA and Stardust notes. Scarab names a proposed exchange/receipt role only; no universal mechanism, physical controller, YUGO identity change or UDF profile is established.'
  });
}

module.exports = Object.freeze({
  VERSION,
  CLASSIFICATION,
  PHASES,
  ORIENTATIONS,
  normalizeWord,
  middleSquareCut,
  flipOrientation,
  createState,
  plusOne,
  drop,
  shear,
  flip,
  returnView,
  restart,
  runRound,
  replay,
  buildReceipt
});
