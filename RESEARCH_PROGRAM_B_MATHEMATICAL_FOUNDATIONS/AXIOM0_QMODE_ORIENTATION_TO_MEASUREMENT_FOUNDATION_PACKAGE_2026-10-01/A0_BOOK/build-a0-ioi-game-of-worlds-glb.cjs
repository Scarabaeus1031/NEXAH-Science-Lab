const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const base = __dirname;
const outDir = path.join(base, 'assets/game-of-worlds-play/ioi-world-cube');
const outFile = path.join(outDir, 'a0_ioi_game_of_worlds_r0.glb');
const packedFile = path.join(outDir, 'a0_ioi_game_of_worlds_r0.packed.js');
const manifestFile = path.join(outDir, 'MANIFEST.json');

fs.mkdirSync(outDir, { recursive: true });

const THREE = require('./assets/game-of-worlds-play/vendor/three-0.147.0/three.min.js');
global.THREE = THREE;

class NodeFileReader {
  constructor() {
    this.result = null;
    this.onloadend = null;
    this.onerror = null;
  }
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((buffer) => {
      this.result = buffer;
      if (this.onloadend) this.onloadend({ target: this });
    }).catch((error) => {
      if (this.onerror) this.onerror(error);
    });
  }
  readAsDataURL(blob) {
    blob.arrayBuffer().then((buffer) => {
      this.result = `data:${blob.type || 'application/octet-stream'};base64,${Buffer.from(buffer).toString('base64')}`;
      if (this.onloadend) this.onloadend({ target: this });
    }).catch((error) => {
      if (this.onerror) this.onerror(error);
    });
  }
}

global.FileReader = NodeFileReader;
require('./assets/game-of-worlds-play/vendor/three-0.147.0/GLTFExporter.js');

const scene = new THREE.Scene();
scene.name = 'A0_IOI_GAME_OF_WORLDS_R0';
scene.userData = {
  schema: 'nexah.a0.ioi-game-of-worlds-glb/1',
  status: 'R0_DOCUMENTED_SOURCE_BOUND_ILLUSTRATIVE_GLB',
  reused_identity: 'A0_GAME_OF_WORLDS_PLAY',
  source_instrument: 'DRAFTS/A0_IOI_LEAF_FOLD_RETURN_2026-11-02.html',
  carrier: '11x11x11 observer cube with visible 11x11 faces and 9x9 interiors',
  face_record_order: 'I,A,L,R,O,U',
  selected_record: 'ALU=011001=25',
  open_address_hypotheses: ['RAMANUJAN_1729_TO_THREE_ACTIVE_ILAU_NODES_UNCALIBRATED'],
  full_space: '2^6=64; B singleton 1/64; A complement 63/64',
  octant_space: '2^3=8; B singleton 1/8; A complement 7/8',
  projection_views: ['NUMBER', 'WORD', 'GRAPH', 'WORLD'],
  observer_views: ['RIEMANN_CORNER', 'IHARA_DIRECTED_EDGE', 'EULER_FACE', 'FIBONACCI_DIAGONAL_45'],
  visual_constellation: 'GHOST_3_PLUS_1 = WORLD_CENTER + SUN + MOON + STAR; pulse-only, no astronomical orbit claim',
  visual_effect: 'EDELWEISS_L_FRAME_WOBBLE = view-only owner mnemonic; pink binder fixed in position, seven outer cells pulse, eleven-cell lift and mirrored return',
  rose_bridge: 'ROSE_C5 uses the exact +2 mod 5 route 0->2->4->1->3->0 over five declared front-face field addresses; the corresponding directed-edge walk has no immediate reversal',
  sheet_contract: 'AM/XY = INSIDE source view; VM/YZ = directed seam; PM/ZX = INSIDE_PRIME return view with Ghost 3+1 as fixed-position witness; display contract only',
  claim_boundary: 'Illustrative projection and addressable inspection object; not a new mathematical identity, physical mechanism, scientific result, Study, Navigator identity or publication.'
};

const material = (name, color, options = {}) => {
  const value = new THREE.MeshStandardMaterial({
    name,
    color,
    emissive: options.emissive ?? color,
    emissiveIntensity: options.emissiveIntensity ?? 0.12,
    roughness: options.roughness ?? 0.55,
    metalness: options.metalness ?? 0.08,
    transparent: Boolean(options.transparent),
    opacity: options.opacity ?? 1,
    side: options.doubleSide ? THREE.DoubleSide : THREE.FrontSide,
    depthWrite: options.depthWrite ?? !options.transparent
  });
  return value;
};

const mats = {
  blue: material('BODY_BLUE', 0x123a9b, { emissive: 0x07143c, emissiveIntensity: 0.28, metalness: 0.16 }),
  blueDeep: material('INNER_BLUE_9X9', 0x071b64, { emissive: 0x02082c, emissiveIntensity: 0.3 }),
  teal: material('OUTER_TEAL_FRAME', 0x087c7b, { emissive: 0x023c40, emissiveIntensity: 0.32, metalness: 0.18 }),
  cyan: material('DIAGONAL_CYAN', 0x25d6e7, { emissive: 0x0a8398, emissiveIntensity: 0.65, metalness: 0.1 }),
  white: material('RETURN_WHITE', 0xeefbff, { emissive: 0xb9f4ff, emissiveIntensity: 0.72, metalness: 0.02 }),
  orange: material('EDGE_ORANGE', 0xc46a08, { emissive: 0x733100, emissiveIntensity: 0.46, metalness: 0.24 }),
  o0Inside: material('O0_INSIDE_ORANGE', 0xffa51f, { emissive: 0xc95b00, emissiveIntensity: 0.82, metalness: 0.12 }),
  pink: material('B_CORNER_PINK', 0xf02f8b, { emissive: 0xb40b61, emissiveIntensity: 0.7, metalness: 0.14 }),
  pinkWord: material('ILAU_ACTIVE_PINK', 0xff67b5, { emissive: 0xc51f78, emissiveIntensity: 0.62, metalness: 0.08 }),
  green: material('CARRIER_GREEN', 0x1ecf73, { emissive: 0x087a3f, emissiveIntensity: 0.5, metalness: 0.1 }),
  gold: material('EULER_GOLD', 0xf0b52b, { emissive: 0xa86804, emissiveIntensity: 0.55, metalness: 0.22 }),
  red: material('RIEMANN_RED', 0xe44747, { emissive: 0x922020, emissiveIntensity: 0.55 }),
  violet: material('HALF_PLANE_VIOLET', 0xa766f5, { emissive: 0x582190, emissiveIntensity: 0.35, transparent: true, opacity: 0.18, doubleSide: true, depthWrite: false }),
  ghost: material('INACTIVE_FACE_GHOST', 0x173b47, { emissive: 0x071a21, emissiveIntensity: 0.12, transparent: true, opacity: 0.42, depthWrite: false }),
  zero: material('ZERO_CORE', 0x03070e, { emissive: 0x000000, emissiveIntensity: 0 }),
  ghostWorld: material('GHOST_WORLD_CENTER', 0x63f5d0, { emissive: 0x20a889, emissiveIntensity: 0.72, transparent: true, opacity: 0.82, depthWrite: false }),
  ghostSun: material('GHOST_SUN', 0xffc42e, { emissive: 0xd17a00, emissiveIntensity: 0.9, transparent: true, opacity: 0.86, depthWrite: false }),
  ghostMoon: material('GHOST_MOON', 0xb8b8ff, { emissive: 0x5c55b8, emissiveIntensity: 0.72, transparent: true, opacity: 0.8, depthWrite: false }),
  ghostStar: material('GHOST_STAR', 0xf5fbff, { emissive: 0xa5eaff, emissiveIntensity: 0.95, transparent: true, opacity: 0.9, depthWrite: false }),
  rose: material('IHARA_ROSE_C5', 0xff4fd8, { emissive: 0xb51785, emissiveIntensity: 0.82, metalness: 0.08 })
};

const cube = new THREE.BoxGeometry(1, 1, 1);
cube.name = 'UNIT_BOX_SHARED_GEOMETRY';

function addBox(parent, name, position, scale, mat, extras = {}) {
  const mesh = new THREE.Mesh(cube, mat);
  mesh.name = name;
  mesh.position.set(...position);
  mesh.scale.set(...scale);
  mesh.userData = extras;
  parent.add(mesh);
  return mesh;
}

function addBar(parent, name, start, end, thickness, mat, extras = {}) {
  const a = new THREE.Vector3(...start);
  const b = new THREE.Vector3(...end);
  const delta = b.clone().sub(a);
  const length = delta.length();
  const mesh = addBox(parent, name, a.clone().add(b).multiplyScalar(0.5).toArray(), [thickness, thickness, length], mat, extras);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), delta.normalize());
  return mesh;
}

const worldRig = new THREE.Group();
worldRig.name = 'WORLD_RIG';
worldRig.userData = { role: 'shared carrier for Number, Word, Graph and World projections' };
scene.add(worldRig);

const carrier = new THREE.Group();
carrier.name = 'WORLD_CARRIER_11';
carrier.userData = { outer_edge: 11, inner_face: '9x9', visible_faces: 3, complete_cube_implied: true };
worldRig.add(carrier);

const numberWorld = new THREE.Group();
numberWorld.name = 'NUMBER_WORLD';
numberWorld.userData = { roles: ['P13=41 address witness', '2x2 zero orientation core', '11 and 9 grid counts'] };
worldRig.add(numberWorld);

const wordWorld = new THREE.Group();
wordWorld.name = 'WORD_WORLD_ILAU';
wordWorld.userData = { alphabet: 'I,A,L,R,O,U', record: 'ALU', bitword: '011001', decimal: 25 };
worldRig.add(wordWorld);

const graphWorld = new THREE.Group();
graphWorld.name = 'GRAPH_WORLD_OBSERVERS';
graphWorld.userData = { ihara: 'directed-edge non-backtracking view', riemann: 'corner camera onto normalized half-plane', euler: 'face/product view', fibonacci: '45-degree diagonal recurrence view' };
worldRig.add(graphWorld);

const pitch = 0.70;
const count = 11;
const half = pitch * (count - 1) / 2;
const cell = 0.58;

function faceMaterial(row, col) {
  if (row === 8 && col === 8) return mats.white;
  if (row === col) return mats.cyan;
  if (row === 0 || row === 10 || col === 0 || col === 10) return mats.teal;
  return mats.blueDeep;
}

for (let row = 0; row < count; row += 1) {
  for (let col = 0; col < count; col += 1) {
    const u = (col - 5) * pitch;
    const v = (row - 5) * pitch;
    const region = row > 0 && row < 10 && col > 0 && col < 10 ? 'INNER_9X9' : 'OUTER_BORDER';
    addBox(carrier, `TOP_r${row}_c${col}`, [u, half, v], [cell, 0.12, cell], faceMaterial(row, col), { face: 'O', row, col, region, diagonal: row === col });
    addBox(carrier, `FRONT_r${row}_c${col}`, [u, -v, half], [cell, cell, 0.12], faceMaterial(row, col), { face: 'R', row, col, region, diagonal: row === col });
    addBox(carrier, `RIGHT_r${row}_c${col}`, [half, -v, -u], [0.12, cell, cell], faceMaterial(row, col), { face: 'I', row, col, region, diagonal: row === col });
  }
}

const frameHalf = half + 0.28;
const corners = [-1, 1];
for (const y of corners) for (const z of corners) addBar(carrier, `GREEN_X_${y}_${z}`, [-frameHalf, y * frameHalf, z * frameHalf], [frameHalf, y * frameHalf, z * frameHalf], 0.065, mats.green, { role: 'carrier frame' });
for (const x of corners) for (const z of corners) addBar(carrier, `GREEN_Y_${x}_${z}`, [x * frameHalf, -frameHalf, z * frameHalf], [x * frameHalf, frameHalf, z * frameHalf], 0.065, mats.green, { role: 'carrier frame' });
for (const x of corners) for (const y of corners) addBar(carrier, `GREEN_Z_${x}_${y}`, [x * frameHalf, y * frameHalf, -frameHalf], [x * frameHalf, y * frameHalf, frameHalf], 0.065, mats.green, { role: 'carrier frame' });

addBar(carrier, 'ORANGE_TOP_FRONT_EDGE', [-frameHalf, frameHalf, frameHalf], [frameHalf, frameHalf, frameHalf], 0.18, mats.orange, { role: 'highlighted edge', glyph: 'T_OR_Y' });
addBar(carrier, 'ORANGE_RIGHT_FRONT_EDGE', [frameHalf, -frameHalf, frameHalf], [frameHalf, frameHalf, frameHalf], 0.18, mats.orange, { role: 'highlighted edge', glyph: 'T_OR_Y' });
const bCorner = addBox(carrier, 'B_CORNER_ALU', [frameHalf, frameHalf, frameHalf], [0.54, 0.54, 0.54], mats.pink, { role: 'declared B singleton / fixed-position Edelweiss binder', record: 'ALU', bits: '011001', decimal: 25, full_weight: '1/64', octant_weight: '1/8' });

const criticalPlane = addBox(worldRig, 'RIEMANN_HALF_PLANE', [0, 0, 0], [0.035, 6.15, 6.15], mats.violet, { coordinate: 'Re(s)=1/2 after normalized chart', involution: 's <-> 1-s', spatial_status: 'projective analogy; not literal complex geometry' });

const faceVectors = {
  I: [2.55, 0, 0], A: [-2.55, 0, 0],
  L: [0, 0, -2.55], R: [0, 0, 2.55],
  O: [0, 2.55, 0], U: [0, -2.55, 0]
};
const active = new Set(['A', 'L', 'U']);
for (const [face, endpoint] of Object.entries(faceVectors)) {
  const selected = active.has(face);
  addBar(wordWorld, `ILAU_RAY_${face}`, [0, 0, 0], endpoint, selected ? 0.095 : 0.045, selected ? mats.cyan : mats.ghost, { face, selected, pair: face === 'I' || face === 'A' ? 'I/A' : face === 'L' || face === 'R' ? 'L/R' : 'O/U' });
  addBox(wordWorld, `ILAU_NODE_${face}`, endpoint, [0.32, 0.32, 0.32], selected ? mats.pinkWord : mats.ghost, {
    face,
    bit: selected ? 1 : 0,
    selected,
    selected_record: selected ? 'ALU' : null,
    address_candidate: selected ? 'RAMANUJAN_1729_UNCALIBRATED_OPEN' : null
  });
}

for (let index = 0; index < 24; index += 1) {
  const angle = index / 24 * Math.PI * 2;
  addBox(wordWorld, `O0_RING_${String(index).padStart(2, '0')}`, [Math.cos(angle) * 0.58, 0, Math.sin(angle) * 0.58], [0.07, 0.07, 0.07], mats.gold, { role: 'O0 shared return ring', index });
}
addBox(wordWorld, 'O0_CENTER', [0, 0, 0], [0.22, 0.22, 0.22], mats.o0Inside, { role: 'shared pin / return center', view_pair: 'INSIDE_OUT_FUGE_B', paired_material: 'RETURN_WHITE' });

for (const x of [-0.34, 0.34]) for (const z of [-0.34, 0.34]) addBox(numberWorld, `ZERO_CORE_${x}_${z}`, [x, -0.32, z], [0.48, 0.11, 0.48], mats.zero, { value: 0, role: '2x2 orientation core' });

addBar(numberWorld, 'PRIME_DIAGONAL_P13_TO_41', [-3.0, -3.0, -3.0], [3.0, 3.0, 3.0], 0.055, mats.gold, { prime_index: 13, prime_value: 41, status: 'exact numerical address; no geometric identity' });
for (let index = 0; index < 13; index += 1) {
  const t = index / 12;
  addBox(numberWorld, `PRIME_ADDRESS_${index + 1}`, [-3 + 6 * t, -3 + 6 * t, -3 + 6 * t], [0.1, 0.1, 0.1], index === 12 ? mats.white : mats.gold, { ordinal: index + 1, terminal_value: index === 12 ? 41 : null });
}

addBar(graphWorld, 'IHARA_DIRECTED_EDGE', [frameHalf + 0.38, frameHalf + 0.38, -2.55], [frameHalf + 0.38, frameHalf + 0.38, 2.55], 0.11, mats.orange, { observer: 'IHARA', state_space: 'directed edges', rule: 'no immediate reversal' });
addBox(graphWorld, 'IHARA_EDGE_OBSERVER', [frameHalf + 0.38, frameHalf + 0.38, 0], [0.36, 0.36, 0.36], mats.orange, { observer: 'IHARA', location: 'oriented edge midpoint' });
addBar(graphWorld, 'RIEMANN_CORNER_SIGHTLINE', [frameHalf + 0.55, frameHalf + 0.55, frameHalf + 0.55], [0, 0, 0], 0.045, mats.red, { observer: 'RIEMANN', chart: 'corner camera toward half-plane' });
addBox(graphWorld, 'RIEMANN_CORNER_OBSERVER', [frameHalf + 0.55, frameHalf + 0.55, frameHalf + 0.55], [0.42, 0.42, 0.42], mats.red, { observer: 'RIEMANN', mathematical_boundary: 'critical line is analytic, corner is NEXAH camera placement' });
addBox(graphWorld, 'EULER_FACE_OBSERVER', [0, frameHalf + 0.48, 0], [0.48, 0.18, 0.48], mats.gold, { observer: 'EULER', location: 'face center', role: 'local factors to global product / face view' });
addBar(graphWorld, 'FIBONACCI_DIAGONAL_45', [-3.05, 0.16, -3.05], [3.05, 0.16, 3.05], 0.09, mats.green, { observer: 'FIBONACCI', angle_degrees: 45, role: 'rotated lattice recurrence view', identity_claim: false });

const ghostConstellation = new THREE.Group();
ghostConstellation.name = 'GHOST_GONS_3_PLUS_1';
ghostConstellation.position.set(0, 0, frameHalf + 1.05);
ghostConstellation.userData = { role: 'view-only 3+1 constellation anchored in front of the cube', center: 'WORLD', satellites: ['SUN', 'MOON', 'STAR'], orbit_status: 'OFF', motion: 'sequential scale pulse only', physical_center_claim: false };
worldRig.add(ghostConstellation);
const ghostWorld = addBox(ghostConstellation, 'GHOST_WORLD_CENTER', [0, 0, 0], [0.42, 0.42, 0.42], mats.ghostWorld, { role: 'center / world', constellation: '3+1', astronomical_identity: false });
const ghostSun = addBox(ghostConstellation, 'GHOST_SUN_NODE', [1.52, 0.42, 0], [0.28, 0.28, 0.28], mats.ghostSun, { role: 'sun glyph / satellite 1', orbit_status: 'OFF' });
const ghostMoon = addBox(ghostConstellation, 'GHOST_MOON_NODE', [-0.62, 1.28, 0.66], [0.25, 0.25, 0.25], mats.ghostMoon, { role: 'moon glyph / satellite 2', orbit_status: 'OFF' });
const ghostStar = addBox(ghostConstellation, 'GHOST_STAR_NODE', [-0.78, -1.04, -0.72], [0.23, 0.23, 0.23], mats.ghostStar, { role: 'star glyph / satellite 3', orbit_status: 'OFF' });

const roseBridge = new THREE.Group();
roseBridge.name = 'IHARA_ROSE_C5_BRIDGE';
const roseRoute = [0, 2, 4, 1, 3, 0];
const roseAddressSpecs = [
  { id: 0, row: 1, col: 5 },
  { id: 1, row: 4, col: 8 },
  { id: 2, row: 8, col: 7 },
  { id: 3, row: 8, col: 3 },
  { id: 4, row: 4, col: 2 }
];
const roseDirectedStates = roseRoute.slice(0, -1).flatMap((from, index) => {
  const to = roseRoute[index + 1];
  return [`${from}->${to}`, `${to}->${from}`];
});
roseBridge.userData = {
  role: 'typed local adapter from five cube field addresses to the existing Rose C5 and Ihara/Hashimoto contracts',
  source_cycle_instrument: 'A0_IHARA_HASHIMOTO_CYCLE_BRIDGE.html',
  source_rose_record: 'assets/a0-pentagon-body-player-v1.json',
  operator: '+2 mod 5',
  route: roseRoute.join('->'),
  directed_edge_states: roseDirectedStates,
  hashimoto_rule: '(a->b)->(b->c) only when c!=a',
  immediate_reversal_count: 0,
  h5_rebound: false,
  claim_boundary: 'view adapter only; no new Ihara theorem, shell identity, physical bridge or game state'
};
graphWorld.add(roseBridge);
const rosePoint = ({ row, col }) => [(col - 5) * pitch, -(row - 5) * pitch, half + 0.34];
const roseNodes = roseAddressSpecs.map((spec) => addBox(
  roseBridge,
  `ROSE_C5_VERTEX_${spec.id}`,
  rosePoint(spec),
  [0.18, 0.18, 0.18],
  mats.rose,
  { ...spec, cube_field: `FRONT_r${spec.row}_c${spec.col}`, rose_address: spec.id, operator: '+2 mod 5' }
));
const roseEdges = roseRoute.slice(0, -1).map((from, index) => {
  const to = roseRoute[index + 1];
  return addBar(
    roseBridge,
    `IHARA_ROSE_EDGE_${from}_TO_${to}`,
    roseNodes[from].position.toArray(),
    roseNodes[to].position.toArray(),
    0.045,
    mats.rose,
    { from, to, directed_state: `${from}->${to}`, next: `${to}->${roseRoute[index + 2]}`, immediate_reverse_forbidden: `${to}->${from}`, route_index: index }
  );
});

const q0 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI / 2, 0));
const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI, 0));
const q3 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI * 3 / 2, 0));
const q4 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI * 2, 0));
const rotationTrack = new THREE.QuaternionKeyframeTrack('WORLD_RIG.quaternion', [0, 6, 12, 18, 24], [...q0.toArray(), ...q1.toArray(), ...q2.toArray(), ...q3.toArray(), ...q4.toArray()]);
const planeTrack = new THREE.VectorKeyframeTrack('RIEMANN_HALF_PLANE.scale', [0, 2, 4], [1, 1, 1, 1.07, 1.07, 1.07, 1, 1, 1]);
const rotationClip = new THREE.AnimationClip('WORLD_RETURN_ROTATION', 24, [rotationTrack]);
const halfClip = new THREE.AnimationClip('HALF_PLANE_PULSE', 4, [planeTrack]);
const redObserverTrack = new THREE.VectorKeyframeTrack('RIEMANN_CORNER_OBSERVER.scale', [0, 0.6, 1.2, 1.8, 2.4], [1, 1, 1, 1.65, 1.65, 1.65, 1, 1, 1, 1.65, 1.65, 1.65, 1, 1, 1]);
const redObserverClip = new THREE.AnimationClip('RED_CORNER_WITNESS_PULSE', 2.4, [redObserverTrack]);
const ghostTimes = [0, 0.6, 1.2, 1.8, 2.4, 3.0];
const pulseValues = (peakIndex, peak = 1.7) => ghostTimes.flatMap((_, index) => {
  const value = index === peakIndex ? peak : 1;
  return [value, value, value];
});
const ghostWorldTrack = new THREE.VectorKeyframeTrack(`${ghostWorld.name}.scale`, ghostTimes, pulseValues(1, 1.45));
const ghostSunTrack = new THREE.VectorKeyframeTrack(`${ghostSun.name}.scale`, ghostTimes, pulseValues(2));
const ghostMoonTrack = new THREE.VectorKeyframeTrack(`${ghostMoon.name}.scale`, ghostTimes, pulseValues(3));
const ghostStarTrack = new THREE.VectorKeyframeTrack(`${ghostStar.name}.scale`, ghostTimes, pulseValues(4, 2.2));
const ghostClip = new THREE.AnimationClip('GHOST_3_PLUS_1_PULSE', 3, [ghostWorldTrack, ghostSunTrack, ghostMoonTrack, ghostStarTrack]);
const fugeTimes = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4];
const scaledValues = (base, factors) => factors.flatMap((factor) => base.map((value) => value * factor));
const outsideFugeFactors = [1, 1.42, 1, 1, 1, 1.42, 1, 1, 1];
const insideFugeFactors = [1, 1, 1, 1.8, 1, 1, 1, 1.8, 1];
const fugeTracks = [
  new THREE.VectorKeyframeTrack('TOP_r8_c8.scale', fugeTimes, scaledValues([0.58, 0.12, 0.58], outsideFugeFactors)),
  new THREE.VectorKeyframeTrack('FRONT_r8_c8.scale', fugeTimes, scaledValues([0.58, 0.58, 0.12], outsideFugeFactors)),
  new THREE.VectorKeyframeTrack('RIGHT_r8_c8.scale', fugeTimes, scaledValues([0.12, 0.58, 0.58], outsideFugeFactors)),
  new THREE.VectorKeyframeTrack('O0_CENTER.scale', fugeTimes, scaledValues([0.22, 0.22, 0.22], insideFugeFactors))
];
const fugeClip = new THREE.AnimationClip('FUGE_INSIDE_OUT_PULSE', 4, fugeTracks);

const edelweissDuration = 6;
const pulseTrackAt = (node, peak, factor = 1.46, duration = edelweissDuration) => {
  const times = [0, peak - 0.16, peak, peak + 0.16, duration];
  return new THREE.VectorKeyframeTrack(`${node.name}.scale`, times, scaledValues(node.scale.toArray(), [1, 1, factor, 1, 1]));
};
const wobbleTrack = (node, axis, phase = 0) => {
  const times = [0, 0.75, 1.5, 2.25, 3, 3.75, 4.5, 5.25, 6];
  const angles = [0, 0.055, -0.055, 0.07, -0.07, 0.055, -0.055, 0.035, 0].map((angle) => angle * (phase ? -1 : 1));
  const values = angles.flatMap((angle) => node.quaternion.clone().multiply(new THREE.Quaternion().setFromAxisAngle(axis, angle)).toArray());
  return new THREE.QuaternionKeyframeTrack(`${node.name}.quaternion`, times, values);
};
const edelweissTracks = [];
const lFrameHorizontal = carrier.getObjectByName('GREEN_X_1_1');
const lFrameVertical = carrier.getObjectByName('GREEN_Y_1_1');
edelweissTracks.push(
  wobbleTrack(lFrameHorizontal, new THREE.Vector3(0, 0, 1)),
  wobbleTrack(lFrameVertical, new THREE.Vector3(1, 0, 0), 1)
);
for (let index = 0; index < 7; index += 1) {
  edelweissTracks.push(pulseTrackAt(carrier.getObjectByName(`TOP_r0_c${index + 2}`), 0.55 + index * 0.24, 1.34));
}
for (let index = 0; index < 11; index += 1) {
  edelweissTracks.push(pulseTrackAt(carrier.getObjectByName(`FRONT_r${10 - index}_c${10 - index}`), 1.45 + index * 0.21, 1.42));
  edelweissTracks.push(pulseTrackAt(carrier.getObjectByName(`RIGHT_r${index}_c${index}`), 3.55 + index * 0.19, 1.42));
}
edelweissTracks.push(
  new THREE.VectorKeyframeTrack(`${bCorner.name}.scale`, [0, 0.5, 0.9, 2.85, 3.2, 5.45, 6], scaledValues(bCorner.scale.toArray(), [1, 1.22, 1, 1.22, 1, 1.22, 1])),
  new THREE.VectorKeyframeTrack('O0_CENTER.scale', [0, 4.8, 5.25, 5.7, 6], scaledValues([0.22, 0.22, 0.22], [1, 1, 1.75, 1, 1]))
);
const edelweissClip = new THREE.AnimationClip('EDELWEISS_L_FRAME_WOBBLE', edelweissDuration, edelweissTracks);

const roseDuration = 5;
const iharaRoseTracks = [];
for (let index = 0; index < roseRoute.length - 1; index += 1) {
  const address = roseRoute[index];
  iharaRoseTracks.push(pulseTrackAt(roseNodes[address], 0.45 + index * 0.52, 1.8, roseDuration));
  iharaRoseTracks.push(pulseTrackAt(roseEdges[index], 0.70 + index * 0.52, 1.65, roseDuration));
}
for (const nodeName of ['TOP_r8_c8', 'FRONT_r8_c8', 'RIGHT_r8_c8']) {
  iharaRoseTracks.push(pulseTrackAt(carrier.getObjectByName(nodeName), 3.45, 1.48, roseDuration));
}
iharaRoseTracks.push(
  new THREE.VectorKeyframeTrack('O0_CENTER.scale', [0, 3.65, 3.95, 4.25, 5], scaledValues([0.22, 0.22, 0.22], [1, 1, 1.9, 1, 1])),
  pulseTrackAt(ghostWorld, 4.05, 1.5, roseDuration),
  pulseTrackAt(ghostSun, 4.25, 1.7, roseDuration),
  pulseTrackAt(ghostMoon, 4.45, 1.7, roseDuration),
  pulseTrackAt(ghostStar, 4.65, 1.9, roseDuration)
);
const iharaRoseClip = new THREE.AnimationClip('IHARA_ROSE_C5_RETURN', roseDuration, iharaRoseTracks);

function exportGlb() {
  return new Promise((resolve, reject) => {
    new THREE.GLTFExporter().parse(scene, resolve, reject, {
      binary: true,
      trs: true,
      onlyVisible: true,
      animations: [rotationClip, halfClip, redObserverClip, ghostClip, fugeClip, edelweissClip, iharaRoseClip]
    });
  });
}

function parseDocument(bytes) {
  if (bytes.readUInt32LE(0) !== 0x46546c67) throw new Error('GLB magic mismatch');
  const jsonLength = bytes.readUInt32LE(12);
  return JSON.parse(bytes.subarray(20, 20 + jsonLength).toString('utf8'));
}

(async () => {
  const result = await exportGlb();
  const bytes = Buffer.from(result);
  const doc = parseDocument(bytes);
  const hash = crypto.createHash('sha256').update(bytes).digest('hex');
  fs.writeFileSync(outFile, bytes);
  fs.writeFileSync(packedFile, `/* Generated byte-preserving GLB payload. */\nwindow.A0IOIGameOfWorldsGLB=${JSON.stringify(bytes.toString('base64'))};\n`);
  const manifest = {
    schema: 'nexah.a0.ioi-game-of-worlds-glb-manifest/1',
    date: '2026-11-02',
    status: 'R0_DOCUMENTED_SOURCE_BOUND_ILLUSTRATIVE_GLB',
    reused_identities: ['A0_GAME_OF_WORLDS_PLAY', 'GAME_4_LIFE_PLUS_1_BUILDER_PATTERN', 'A0_IOI_LEAF_FOLD_RETURN_R0_DRAFT'],
    new_navigator_identities: [],
    new_navigator_relations: [],
    source: 'DRAFTS/A0_IOI_LEAF_FOLD_RETURN_2026-11-02.html',
    builder: 'build-a0-ioi-game-of-worlds-glb.cjs',
    file: path.basename(outFile),
    sha256: hash,
    bytes: bytes.length,
    nodes: doc.nodes?.length || 0,
    meshes: doc.meshes?.length || 0,
    materials: (doc.materials || []).map((entry) => entry.name),
    animations: (doc.animations || []).map((entry) => entry.name),
    contract: {
      outer_grid: '11x11 on three visible faces',
      inner_grid: '9x9 chromatic interior on each visible face',
      selected_record: 'ALU=011001=25',
      full_space: '2^6=64',
      octant_space: '2^3=8',
      observer_views: ['RIEMANN_CORNER', 'IHARA_DIRECTED_EDGE', 'EULER_FACE', 'FIBONACCI_DIAGONAL_45'],
      projection_views: ['NUMBER_WORLD', 'WORD_WORLD_ILAU', 'GRAPH_WORLD_OBSERVERS', 'WORLD_CARRIER_11'],
      edelweiss_wobble: 'view-only: two L-frame bars wobble; seven outer cells pulse; eleven front diagonal cells lift; eleven right diagonal cells return in mirror order; pink B-corner position remains fixed',
      ihara_rose_c5: 'five front-face field addresses; exact route +2 mod 5 = 0->2->4->1->3->0; ten directed edge states; selected walk has zero immediate reversals; White outside -> O0 Orange inside -> fixed Ghost PM/inside-prime witnesses',
      sheet_views: ['AM_XY_INSIDE', 'VM_YZ_DIRECTED_SEAM', 'PM_ZX_INSIDE_PRIME']
    },
    claim_boundary: scene.userData.claim_boundary
  };
  fs.writeFileSync(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(JSON.stringify({ status: 'PASS', file: path.relative(base, outFile), sha256: hash, bytes: bytes.length, nodes: manifest.nodes, meshes: manifest.meshes, animations: manifest.animations }));
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
