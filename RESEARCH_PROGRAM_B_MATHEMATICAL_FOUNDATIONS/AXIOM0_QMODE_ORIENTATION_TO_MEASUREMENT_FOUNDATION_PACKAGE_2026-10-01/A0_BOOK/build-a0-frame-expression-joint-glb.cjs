const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const base = __dirname;
const outDir = path.join(base, 'assets/frame-expression-joint');
const outFile = path.join(outDir, 'a0_frame_expression_joint_r0.glb');
const manifestFile = path.join(outDir, 'MANIFEST.json');
fs.mkdirSync(outDir, { recursive: true });

const THREE = require('./assets/game-of-worlds-play/vendor/three-0.147.0/three.min.js');
global.THREE = THREE;
class NodeFileReader {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((buffer) => {
      this.result = buffer;
      if (this.onloadend) this.onloadend({ target: this });
    }).catch((error) => this.onerror && this.onerror(error));
  }
  readAsDataURL(blob) {
    blob.arrayBuffer().then((buffer) => {
      this.result = `data:${blob.type || 'application/octet-stream'};base64,${Buffer.from(buffer).toString('base64')}`;
      if (this.onloadend) this.onloadend({ target: this });
    }).catch((error) => this.onerror && this.onerror(error));
  }
}
global.FileReader = NodeFileReader;
require('./assets/game-of-worlds-play/vendor/three-0.147.0/GLTFExporter.js');

const scene = new THREE.Scene();
scene.name = 'A0_FRAME_EXPRESSION_JOINT_R0';
scene.userData = {
  schema: 'nexah.a0.frame-expression-joint-glb/1',
  status: 'R0_SOURCE_BOUND_EDITORIAL_DISPLAY_GLB',
  reused_identities: ['A0_ARCHITECTURE_OF_DIFFERENCE', 'A0OE:PASCAL_PENTAGON_D5_TEST'],
  display_instrument: 'FE-GLB-01',
  carrier: 'one declared carrier with two hinged display leaves',
  floorplan: 'hexagonal carrier + pentagonal crown + Tao/Io diamond + Delta seam',
  claim_boundary: 'Editorial geometry demonstrator only. The leaves, colors, Tao/Io spine, Delta seam and motion are display conventions; they do not assert a new physical mechanism, mathematical identity, Study, Navigator identity or publication claim.'
};

function material(name, color, options = {}) {
  return new THREE.MeshStandardMaterial({
    name,
    color,
    emissive: options.emissive ?? color,
    emissiveIntensity: options.emissiveIntensity ?? 0.22,
    roughness: options.roughness ?? 0.48,
    metalness: options.metalness ?? 0.08,
    transparent: Boolean(options.transparent),
    opacity: options.opacity ?? 1,
    side: options.doubleSide ? THREE.DoubleSide : THREE.FrontSide,
    depthWrite: options.depthWrite ?? !options.transparent
  });
}

const mats = {
  carrier: material('CARRIER_GRAPHITE', 0x294754, { emissive: 0x071822, emissiveIntensity: 0.25, metalness: 0.22 }),
  crown: material('PENTAGON_GOLD', 0xe8ae35, { emissive: 0x8b5408, emissiveIntensity: 0.55, metalness: 0.18 }),
  cyan: material('LEFT_LEAF_CYAN', 0x36d7e7, { emissive: 0x087f92, emissiveIntensity: 0.48, transparent: true, opacity: 0.3, doubleSide: true, depthWrite: false }),
  coral: material('RIGHT_LEAF_CORAL', 0xff6b61, { emissive: 0xa92730, emissiveIntensity: 0.48, transparent: true, opacity: 0.28, doubleSide: true, depthWrite: false }),
  pink: material('DELTA_SEAM_PINK', 0xed5ca8, { emissive: 0xaf1d72, emissiveIntensity: 0.72, metalness: 0.12 }),
  violet: material('THETA_RING_VIOLET', 0xb969da, { emissive: 0x6b2188, emissiveIntensity: 0.68, metalness: 0.12 }),
  blue: material('TZL_BLUE', 0x6287ff, { emissive: 0x203b9e, emissiveIntensity: 0.58 }),
  white: material('ADDRESS_WHITE', 0xeaf8ff, { emissive: 0xaeefff, emissiveIntensity: 0.72 }),
  green: material('PASSAGE_GREEN', 0x72dfbd, { emissive: 0x208e72, emissiveIntensity: 0.62 })
};

const P = {
  TAO: [0, 3.35, 0],
  PENT_L: [-1.1, 2.45, 0],
  GAMMA: [-1.8, 1.2, 0],
  BETA: [1.8, 1.2, 0],
  PENT_R: [1.1, 2.45, 0],
  DELTA: [-2.35, 0, 0],
  ALPHA: [2.35, 0, 0],
  ZETA: [-1.45, -1.7, 0],
  LAMBDA: [1.45, -1.7, 0],
  IO: [0, -3.35, 0],
  THETA: [0, 0, 0]
};

const root = new THREE.Group();
root.name = 'FE_01_ONE_CARRIER';
scene.add(root);

function cylinderBetween(parent, name, a, b, radius, mat, extras = {}) {
  const va = new THREE.Vector3(...a);
  const vb = new THREE.Vector3(...b);
  const direction = vb.clone().sub(va);
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, direction.length(), 12), mat);
  mesh.name = name;
  mesh.position.copy(va.clone().add(vb).multiplyScalar(0.5));
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());
  mesh.userData = extras;
  parent.add(mesh);
  return mesh;
}

function marker(parent, name, point, radius, mat, extras = {}) {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 22, 14), mat);
  mesh.name = name;
  mesh.position.set(...point);
  mesh.userData = extras;
  parent.add(mesh);
  return mesh;
}

function frame(parent, prefix, names, radius, mat, extras = {}) {
  return names.map((name, index) => cylinderBetween(parent, `${prefix}_${index + 1}`, P[name], P[names[(index + 1) % names.length]], radius, mat, extras));
}

function leafShape(name, points, mat, z) {
  const shape = new THREE.Shape();
  shape.moveTo(points[0][0], points[0][1]);
  points.slice(1).forEach(([x, y]) => shape.lineTo(x, y));
  shape.closePath();
  const mesh = new THREE.Mesh(new THREE.ShapeGeometry(shape), mat);
  mesh.name = name;
  mesh.position.z = z;
  mesh.userData = { role: 'DISPLAY_LEAF', carrier: 'FE_01_ONE_CARRIER' };
  return mesh;
}

frame(root, 'HEX_CARRIER', ['GAMMA', 'BETA', 'ALPHA', 'LAMBDA', 'ZETA', 'DELTA'], 0.045, mats.carrier, { role: 'HEXAGONAL_CARRIER' });
frame(root, 'PENTAGON_CROWN', ['TAO', 'PENT_R', 'BETA', 'GAMMA', 'PENT_L'], 0.055, mats.crown, { role: 'PENTAGONAL_CROWN' });
frame(root, 'TAO_IO_DIAMOND', ['TAO', 'ALPHA', 'IO', 'DELTA'], 0.032, mats.white, { role: 'TAO_IO_DIAMOND_ADDRESS' });

const leftLeaf = new THREE.Group();
leftLeaf.name = 'LEFT_BOOK_LEAF';
leftLeaf.add(leafShape('LEFT_LEAF_SURFACE', [[0, 3.35], [-1.8, 1.2], [-2.35, 0], [-1.45, -1.7], [0, -3.35]], mats.cyan, -0.035));
root.add(leftLeaf);
const rightLeaf = new THREE.Group();
rightLeaf.name = 'RIGHT_BOOK_LEAF';
rightLeaf.add(leafShape('RIGHT_LEAF_SURFACE', [[0, 3.35], [1.8, 1.2], [2.35, 0], [1.45, -1.7], [0, -3.35]], mats.coral, 0.035));
root.add(rightLeaf);

const seam = new THREE.Group();
seam.name = 'DELTA_DIFFERENCE_SEAM';
cylinderBetween(seam, 'TAO_IO_SPINE', P.TAO, P.IO, 0.065, mats.pink, { role: 'DELTA_EDGE_DIFFERENCE' });
const seamMarker = marker(seam, 'DELTA_JOINT', P.THETA, 0.19, mats.pink, { role: 'SHARED_ADDRESS_NOT_PARTICLE' });
root.add(seam);

const thetaRing = new THREE.Mesh(new THREE.TorusGeometry(0.92, 0.045, 12, 64), mats.violet);
thetaRing.name = 'THETA_7_83_RING';
thetaRing.userData = { role: 'CENTRAL_DISPLAY_RING', label: 'Theta 7.83 Hz (display label)' };
root.add(thetaRing);

cylinderBetween(root, 'TZL_THETA_ZETA', [0, 0.9, 0.08], P.ZETA, 0.035, mats.blue, { role: 'TZL_VIEW_EDGE' });
cylinderBetween(root, 'TZL_THETA_LAMBDA', [0, 0.9, 0.08], P.LAMBDA, 0.035, mats.blue, { role: 'TZL_VIEW_EDGE' });
cylinderBetween(root, 'TZL_ZETA_LAMBDA', P.ZETA, P.LAMBDA, 0.035, mats.green, { role: 'TZL_VIEW_EDGE' });

for (const name of ['TAO', 'IO', 'GAMMA', 'BETA', 'DELTA', 'ALPHA', 'ZETA', 'LAMBDA']) {
  marker(root, `${name}_ADDRESS`, P[name], name === 'TAO' || name === 'IO' ? 0.13 : 0.11, name === 'DELTA' ? mats.pink : mats.white, { address: name });
}

const q = (axis, angle) => new THREE.Quaternion().setFromAxisAngle(axis, angle).toArray();
const yAxis = new THREE.Vector3(0, 1, 0);
const openTimes = [0, 1.4, 3.6, 5.4, 7.2];
const leftValues = [0, 0.58, 0.58, 0, 0].flatMap((angle) => q(yAxis, angle));
const rightValues = [0, -0.58, -0.58, 0, 0].flatMap((angle) => q(yAxis, angle));
const leafClip = new THREE.AnimationClip('BOOK_LEAF_OPEN_CLOSE', 7.2, [
  new THREE.QuaternionKeyframeTrack('LEFT_BOOK_LEAF.quaternion', openTimes, leftValues),
  new THREE.QuaternionKeyframeTrack('RIGHT_BOOK_LEAF.quaternion', openTimes, rightValues)
]);

const baseScale = seamMarker.scale.toArray();
const pulseValues = [1, 1.75, 1, 1.35, 1].flatMap((factor) => baseScale.map((value) => value * factor));
const seamClip = new THREE.AnimationClip('DELTA_SEAM_PULSE', 3.6, [
  new THREE.VectorKeyframeTrack('DELTA_JOINT.scale', [0, 0.65, 1.35, 2.45, 3.6], pulseValues),
  new THREE.VectorKeyframeTrack('DELTA_DIFFERENCE_SEAM.scale', [0, 0.65, 1.35, 2.45, 3.6], pulseValues)
]);

function exportGlb() {
  return new Promise((resolve, reject) => {
    new THREE.GLTFExporter().parse(scene, resolve, reject, {
      binary: true,
      trs: true,
      onlyVisible: true,
      animations: [leafClip, seamClip]
    });
  });
}

function parseDocument(bytes) {
  if (bytes.readUInt32LE(0) !== 0x46546c67) throw new Error('GLB magic mismatch');
  const jsonLength = bytes.readUInt32LE(12);
  return JSON.parse(bytes.subarray(20, 20 + jsonLength).toString('utf8'));
}

(async () => {
  const bytes = Buffer.from(await exportGlb());
  const doc = parseDocument(bytes);
  const sha256 = crypto.createHash('sha256').update(bytes).digest('hex');
  fs.writeFileSync(outFile, bytes);
  const manifest = {
    schema: 'nexah.a0.frame-expression-joint-glb-manifest/1',
    date: '2026-11-14',
    status: scene.userData.status,
    reused_identities: scene.userData.reused_identities,
    new_navigator_identities: [],
    new_navigator_relations: [],
    source: 'A0_ARCHITECTURE_OF_DIFFERENCE.html#frame-expression',
    source_example: 'A0OE:PASCAL_PENTAGON_D5_TEST / SCC-003',
    builder: path.basename(__filename),
    file: path.basename(outFile),
    sha256,
    bytes: bytes.length,
    nodes: doc.nodes?.length || 0,
    meshes: doc.meshes?.length || 0,
    materials: (doc.materials || []).map((entry) => entry.name),
    animations: (doc.animations || []).map((entry) => entry.name),
    contract: {
      carrier: 'one hexagonal carrier',
      leaves: 'two hinged display leaves, not two books',
      crown: 'pentagonal top frame',
      spine: 'Tao/Io display axis',
      delta: 'visible difference seam / edge',
      tzl: 'Theta-Zeta-Lambda display triangle',
      graph_delta: 0
    },
    claim_boundary: scene.userData.claim_boundary
  };
  fs.writeFileSync(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(JSON.stringify({ status: 'PASS', file: path.relative(base, outFile), sha256, bytes: bytes.length, nodes: manifest.nodes, meshes: manifest.meshes, animations: manifest.animations }));
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
