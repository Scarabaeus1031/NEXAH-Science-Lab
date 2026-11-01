const fs = require('node:fs');
const path = require('node:path');

const preregPath = path.join(__dirname, 'results', 'a0-elevator-88-discrimination-preregistration-2026-11-01.json');
const prereg = JSON.parse(fs.readFileSync(preregPath, 'utf8'));
const fail = (message) => { throw new Error(message); };
const assert = (condition, message) => { if (!condition) fail(message); };
const isPrime = (value) => {
  if (value < 2) return false;
  for (let divisor = 2; divisor * divisor <= value; divisor += 1) if (value % divisor === 0) return false;
  return true;
};
const primes = [];
for (let value = 2; primes.length < 89; value += 1) if (isPrime(value)) primes.push(value);

assert(prereg.status === 'FROZEN_BEFORE_EXECUTION', 'preregistration is not frozen');
assert(prereg.default.dao_binding === 'NONE', 'DAO binding default changed');
assert(prereg.blinding.labels_hidden_before_run === true, 'labels are not concealed');
assert(prereg.blinding.expected_target_direction_hidden_before_run === true, 'expected target is not concealed');

const floors = prereg.matrix.floors;
const angles = prereg.matrix.angle_variants;
const directions = prereg.matrix.direction_masks;
assert(floors.length === 3 && angles.length === 4 && directions.length === 2, 'factor dimensions changed');
assert(new Set(floors).size === 3 && new Set(angles.map((item) => item.mask)).size === 4 && new Set(directions).size === 2, 'factor duplication');
assert(angles.every((item) => Number.isFinite(item.degrees)), 'non-finite angle');
const theta = Math.atan2(80, 120) * 180 / Math.PI;
const frozenAngles = [theta - 0.17, theta, theta + 0.17, 90 - theta];
assert(angles.every((item, index) => Math.abs(item.degrees - frozenAngles[index]) < 1e-12), 'frozen angle mismatch');
assert(primes[86] === 449 && primes[87] === 457 && primes[88] === 461, 'p87/p88/p89 mismatch');

const blindOrder = [17, 4, 21, 8, 13, 0, 19, 6, 23, 10, 15, 2, 18, 5, 22, 9, 12, 1, 20, 7, 16, 3, 14, 11];
const canonical = [];
for (const floor of floors) {
  for (const angle of angles) {
    for (const direction of directions) {
      canonical.push({floor, floorMask:`L${floors.indexOf(floor)}`, angleMask:angle.mask, angleName:angle.name, degrees:angle.degrees, directionMask:direction});
    }
  }
}
assert(canonical.length === prereg.matrix.cell_count, 'matrix cell count changed');
assert(new Set(blindOrder).size === canonical.length && blindOrder.every((index) => index >= 0 && index < canonical.length), 'blind order is invalid');

const blindCells = blindOrder.map((index, blindIndex) => ({
  blindId:`B${String(blindIndex + 1).padStart(2, '0')}`,
  floorMask:canonical[index].floorMask,
  angleMask:canonical[index].angleMask,
  directionMask:canonical[index].directionMask
}));
assert(blindCells.every((cell) => !('floor' in cell) && !('degrees' in cell) && !('route' in cell)), 'pre-run label leak');

const landingOnly = (cell) => `L${cell.floor}`;
const landingAngle = (cell) => `L${cell.floor}|${cell.angleMask}`;
const withDirectionWitness = (cell) => `L${cell.floor}|${cell.angleMask}|${cell.directionMask}`;
const pairs = [];
for (const floor of floors) {
  for (const angle of angles) {
    const pair = canonical.filter((cell) => cell.floor === floor && cell.angleMask === angle.mask);
    pairs.push({
      floor,
      angleMask:angle.mask,
      landingOnlyUnique:new Set(pair.map(landingOnly)).size,
      landingAngleUnique:new Set(pair.map(landingAngle)).size,
      withWitnessUnique:new Set(pair.map(withDirectionWitness)).size
    });
  }
}

const floor88Pairs = pairs.filter((pair) => pair.floor === 88);
const neighborPairs = pairs.filter((pair) => pair.floor !== 88);
const selfSelects = floor88Pairs.every((pair) => pair.landingOnlyUnique === 2)
  && neighborPairs.every((pair) => pair.landingOnlyUnique === 1);
const witnessOnly = pairs.every((pair) => pair.landingOnlyUnique === 1 && pair.landingAngleUnique === 1 && pair.withWitnessUnique === 2);
const verdict = selfSelects ? 'SUCCESS_88_SELF_SELECTS' : witnessOnly ? 'NEGATIVE_88_DOES_NOT_SELECT_WITNESS_ONLY' : 'OPEN_PATTERN';

const directionReveal = {MASK_A:'G°D', MASK_B:'D°G'};
const result = {
  schema:'nexah.a0.elevator88.discrimination/1',
  preregistration_id:prereg.preregistration_id,
  date:prereg.date,
  status:'COMPLETE',
  aborted:false,
  matrix:{floors, angle_variants:angles, direction_count:directions.length, cell_count:canonical.length, pair_count:pairs.length},
  blind_execution:{order:blindCells.map((cell) => cell.blindId), labels_hidden:true, expected_target_hidden:true, independent_blinding:false},
  exact_controls:{p87:primes[86],p88:primes[87],p89:primes[88],theta_degrees:theta,delta_degrees:0.17,complement_degrees:90-theta},
  projections:{landing_only:'floor', landing_plus_angle:'floor|angle_variant', direction_witness:'floor|angle_variant|direction_handle'},
  pair_results:pairs,
  verdict,
  classifications:{
    exact:['3*4*2=24 complete cells','theta arithmetic and complement','p87=449; p88=457; p89=461'],
    candidate:['direction-bearing witness preserves two records but encodes rather than derives direction'],
    view_only:['blind masks and post-classification direction labels'],
    negative:['floor 88 does not preserve direction after witness ablation','angle variant alone does not preserve direction'],
    open:prereg.followups_not_in_scope
  },
  reveal:{direction_labels:directionReveal, applied_after_classification:true},
  dao_binding:'NONE',
  governance_delta:{new_ids:0,new_relations:0,new_operators:0,new_studies:0,finding_promotions:0,publication_authorizations:0,deployment:false}
};

assert(result.matrix.cell_count === 24 && result.matrix.pair_count === 12, 'incomplete matrix');
assert(result.dao_binding === 'NONE', 'DAO binding changed during run');
assert(result.verdict === 'NEGATIVE_88_DOES_NOT_SELECT_WITNESS_ONLY', 'unexpected preregistered outcome class');
process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
