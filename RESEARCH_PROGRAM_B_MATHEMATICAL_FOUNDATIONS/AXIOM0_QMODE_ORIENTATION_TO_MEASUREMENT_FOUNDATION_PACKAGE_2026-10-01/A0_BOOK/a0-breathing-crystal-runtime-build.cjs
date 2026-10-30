const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const SOURCE = path.join(__dirname, 'assets/breathing-crystal/breathing_crystal_v2_1.glb');
const TARGET = path.join(__dirname, 'assets/breathing-crystal/breathing_crystal_core_band_runtime_r1.glb');
const CLIP = 'BREATH_CORE_BAND_R1';
const BAND_NAMES = Object.freeze(['BAND_0.429', 'BAND_0.456', 'BAND_0.487']);
const SAMPLE_TIMES = Object.freeze([0, 0.25, 0.5, 0.75, 1]);
const AMPLITUDE = 0.06;

const align4 = value => (value + 3) & ~3;
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');

function parseGlb(bytes) {
  if (bytes.toString('utf8', 0, 4) !== 'glTF') throw new Error('NOT_GLB');
  if (bytes.readUInt32LE(4) !== 2) throw new Error('GLB_VERSION_NOT_2');
  const jsonLength = bytes.readUInt32LE(12);
  const jsonType = bytes.readUInt32LE(16);
  if (jsonType !== 0x4e4f534a) throw new Error('JSON_CHUNK_MISSING');
  const jsonStart = 20;
  const jsonEnd = jsonStart + jsonLength;
  const json = JSON.parse(bytes.subarray(jsonStart, jsonEnd).toString('utf8').replace(/\0+$/u, '').trimEnd());
  const binLength = bytes.readUInt32LE(jsonEnd);
  const binType = bytes.readUInt32LE(jsonEnd + 4);
  if (binType !== 0x004e4942) throw new Error('BIN_CHUNK_MISSING');
  return { json, bin: Buffer.from(bytes.subarray(jsonEnd + 8, jsonEnd + 8 + binLength)) };
}

function floatBytes(values) {
  const buffer = Buffer.alloc(values.length * 4);
  values.forEach((value, index) => buffer.writeFloatLE(value, index * 4));
  return buffer;
}

function build(sourceBytes) {
  const { json, bin } = parseGlb(sourceBytes);
  if (!Array.isArray(json.buffers) || json.buffers.length !== 1) throw new Error('ONE_BUFFER_REQUIRED');
  if ((json.animations || []).length !== 0) throw new Error('SOURCE_ALREADY_ANIMATED');
  const nodeIndex = name => {
    const index = (json.nodes || []).findIndex(node => node.name === name);
    if (index < 0) throw new Error(`NODE_MISSING:${name}`);
    return index;
  };
  const coreIndex = nodeIndex('CORE');
  const bandIndices = BAND_NAMES.map(nodeIndex);
  const chunks = [Buffer.from(bin)];
  let offset = bin.length;
  const append = values => {
    const aligned = align4(offset);
    if (aligned > offset) chunks.push(Buffer.alloc(aligned - offset));
    offset = aligned;
    const bytes = floatBytes(values);
    const view = json.bufferViews.length;
    json.bufferViews.push({ buffer: 0, byteOffset: offset, byteLength: bytes.length });
    chunks.push(bytes);
    offset += bytes.length;
    return view;
  };

  const timeView = append(SAMPLE_TIMES);
  const timeAccessor = json.accessors.length;
  json.accessors.push({ bufferView: timeView, componentType: 5126, count: SAMPLE_TIMES.length, type: 'SCALAR', min: [0], max: [1] });
  const samplers = [];
  const channels = [];
  bandIndices.forEach((targetNode, bandIndex) => {
    const phaseOffset = bandIndex * (Math.PI * 2 / BAND_NAMES.length);
    const scales = SAMPLE_TIMES.flatMap(time => {
      const scale = 1 + AMPLITUDE * Math.sin(Math.PI * 2 * time + phaseOffset);
      return [scale, scale, scale];
    });
    const scaleView = append(scales);
    const scaleAccessor = json.accessors.length;
    json.accessors.push({ bufferView: scaleView, componentType: 5126, count: SAMPLE_TIMES.length, type: 'VEC3' });
    samplers.push({ input: timeAccessor, output: scaleAccessor, interpolation: 'LINEAR' });
    channels.push({ sampler: samplers.length - 1, target: { node: targetNode, path: 'scale' } });
  });
  json.animations = [{ name: CLIP, samplers, channels }];
  json.extras = {
    ...(json.extras || {}),
    a0_runtime_derivative: {
      contract: 'A0_BREATHING_CRYSTAL_SEGMENTATION_R1',
      source_sha256: sha256(sourceBytes),
      core: { node: 'CORE', node_index: coreIndex, disposition: 'FIXED_STATE_ORIGIN' },
      driven_bands: BAND_NAMES,
      driver: { input: 'breath.phase', range: [0, 1], amplitude: AMPLITUDE, clip: CLIP },
      claim_boundary: 'Generated view derivative only. It does not alter the source GLB or establish native breathing, material response or a physical mechanism.'
    }
  };
  const finalBin = Buffer.concat(chunks);
  json.buffers[0].byteLength = finalBin.length;
  const rawJson = Buffer.from(JSON.stringify(json));
  const paddedJson = Buffer.concat([rawJson, Buffer.alloc(align4(rawJson.length) - rawJson.length, 0x20)]);
  const paddedBin = Buffer.concat([finalBin, Buffer.alloc(align4(finalBin.length) - finalBin.length)]);
  const output = Buffer.alloc(12 + 8 + paddedJson.length + 8 + paddedBin.length);
  output.write('glTF', 0, 'utf8');
  output.writeUInt32LE(2, 4);
  output.writeUInt32LE(output.length, 8);
  output.writeUInt32LE(paddedJson.length, 12);
  output.writeUInt32LE(0x4e4f534a, 16);
  paddedJson.copy(output, 20);
  const binHeader = 20 + paddedJson.length;
  output.writeUInt32LE(paddedBin.length, binHeader);
  output.writeUInt32LE(0x004e4942, binHeader + 4);
  paddedBin.copy(output, binHeader + 8);
  return output;
}

if (require.main === module) {
  const output = build(fs.readFileSync(SOURCE));
  if (process.argv.includes('--check')) {
    if (!fs.existsSync(TARGET) || !fs.readFileSync(TARGET).equals(output)) throw new Error('RUNTIME_DERIVATIVE_OUT_OF_DATE');
    console.log(JSON.stringify({ status: 'PASS', target: path.relative(__dirname, TARGET), sha256: sha256(output), bytes: output.length, clip: CLIP }));
  } else {
    fs.writeFileSync(TARGET, output);
    console.log(JSON.stringify({ status: 'BUILT', target: path.relative(__dirname, TARGET), sha256: sha256(output), bytes: output.length, clip: CLIP }));
  }
}

module.exports = { SOURCE, TARGET, CLIP, BAND_NAMES, SAMPLE_TIMES, AMPLITUDE, parseGlb, build, sha256 };
