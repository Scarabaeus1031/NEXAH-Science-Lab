(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.A0ZipperFrameHandoff = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const ID = 'A0_ZIPPER_FRAME_HANDOFF_V1';
  const PARENT_ADDRESS = '1.111.111.111';
  const HINGE_ADDRESS = 'PINK_K90_DIAMOND';
  const LOCAL_RETURN = '1:8878/A0';
  const ORIENTATIONS = Object.freeze(['PORTRAIT', 'LANDSCAPE']);
  const FORMATS = Object.freeze(['A', 'B', 'US_LETTER']);
  const RAYS = Object.freeze([
    Object.freeze({ id: 'IOTA_1', angle: -10 }),
    Object.freeze({ id: 'IOTA_2', angle: -5 }),
    Object.freeze({ id: 'IOTA_3', angle: 0 }),
    Object.freeze({ id: 'IOTA_4', angle: 5 }),
    Object.freeze({ id: 'IOTA_5', angle: 10 })
  ]);
  const POSITION_COUNT = 88;
  const STATE_COUNT = ORIENTATIONS.length * FORMATS.length * RAYS.length * POSITION_COUNT;
  const RED_SHADOW = Object.freeze({ id: 'RED_SHADOW', angle: 45, role: 'VIEW_GUIDE', countedRay: false });
  const PHASES = Object.freeze([
    'BLUE_FOLD_DOWN', 'PIVOT_SPARK', 'BLUE_FOLD_UP', 'PINK_STRIP_GATE',
    'ZIPPER_CAPTURE', 'PINK_DIAMOND_LENS', 'ORANGE_HOLD', 'YELLOW_FRAME', 'ORANGE_RETURN'
  ]);

  function assertChoice(value, choices, label) {
    if (!choices.includes(value)) throw new RangeError(`${label} outside declared carrier`);
    return value;
  }

  function normalize(input) {
    const orientation = assertChoice(input.orientation || ORIENTATIONS[0], ORIENTATIONS, 'orientation');
    const format = assertChoice(input.format || FORMATS[0], FORMATS, 'format');
    const rayIndex = Number(input.rayIndex ?? 0);
    const position = Number(input.position ?? 0);
    if (!Number.isInteger(rayIndex) || rayIndex < 0 || rayIndex >= RAYS.length) throw new RangeError('rayIndex outside 0..4');
    if (!Number.isInteger(position) || position < 0 || position >= POSITION_COUNT) throw new RangeError('position outside 0..87');
    return { orientation, format, rayIndex, position };
  }

  function indexOf(input) {
    const state = normalize(input);
    return (((ORIENTATIONS.indexOf(state.orientation) * FORMATS.length + FORMATS.indexOf(state.format)) * RAYS.length + state.rayIndex) * POSITION_COUNT) + state.position;
  }

  function stateAt(index) {
    if (!Number.isInteger(index) || index < 0 || index >= STATE_COUNT) throw new RangeError('state index outside 0..2639');
    let rest = index;
    const position = rest % POSITION_COUNT; rest = Math.floor(rest / POSITION_COUNT);
    const rayIndex = rest % RAYS.length; rest = Math.floor(rest / RAYS.length);
    const formatIndex = rest % FORMATS.length; rest = Math.floor(rest / FORMATS.length);
    return snapshot({ orientation: ORIENTATIONS[rest], format: FORMATS[formatIndex], rayIndex, position });
  }

  function snapshot(input) {
    const state = normalize(input);
    const index = indexOf(state);
    return Object.freeze({
      id: ID,
      ...state,
      ray: RAYS[state.rayIndex],
      stateIndex: index,
      stateNumber: index + 1,
      stateCount: STATE_COUNT,
      phases: PHASES,
      activePhase: assertChoice(input.activePhase || PHASES[0], PHASES, 'activePhase'),
      frameReturn: Object.freeze(['ORANGE_HOLD', 'YELLOW_FRAME', 'ORANGE_RETURN']),
      redShadow: RED_SHADOW,
      greenWheel: Object.freeze({ position: state.position, role: 'DISPLAY_SLOT_LOCK', ratioClaim: null }),
      addresses: Object.freeze({ parent: PARENT_ADDRESS, hinge: HINGE_ADDRESS, localReturn: LOCAL_RETURN }),
      classification: 'FINITE_VIEW_HANDOFF',
      identityMerge: false,
      physicalMechanismClaim: false
    });
  }

  function verify(input) {
    const value = snapshot(input);
    const failures = [];
    if (value.stateCount !== 2640) failures.push('STATE_COUNT');
    if (value.redShadow.countedRay !== false || value.redShadow.angle !== 45) failures.push('RED_SHADOW_BOUNDARY');
    if (value.greenWheel.position !== value.position || value.greenWheel.role !== 'DISPLAY_SLOT_LOCK' || value.greenWheel.ratioClaim !== null) failures.push('GREEN_WHEEL_SLOT_LOCK');
    if (value.addresses.parent !== PARENT_ADDRESS || value.addresses.hinge !== HINGE_ADDRESS || value.addresses.localReturn !== LOCAL_RETURN) failures.push('ADDRESS_DRIFT');
    if (value.phases.join('>') !== PHASES.join('>')) failures.push('PHASE_ORDER');
    return Object.freeze({ pass: failures.length === 0, failures: Object.freeze(failures), snapshot: value });
  }

  function auditAll() {
    const seen = new Set();
    const failures = [];
    for (let i = 0; i < STATE_COUNT; i += 1) {
      const state = stateAt(i);
      seen.add(indexOf(state));
      const result = verify(state);
      if (!result.pass || state.stateIndex !== i) failures.push(i);
    }
    return Object.freeze({ pass: failures.length === 0 && seen.size === STATE_COUNT, checked: STATE_COUNT, unique: seen.size, failures: Object.freeze(failures) });
  }

  return Object.freeze({ ID, PARENT_ADDRESS, HINGE_ADDRESS, LOCAL_RETURN, ORIENTATIONS, FORMATS, RAYS, POSITION_COUNT, STATE_COUNT, RED_SHADOW, PHASES, normalize, indexOf, stateAt, snapshot, verify, auditAll });
});
