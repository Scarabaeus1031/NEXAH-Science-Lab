#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const root = __dirname;
const source = path.join(root, 'assets', 'universal-machine-fam009', 'atomic_matroschka_triplewheel_helix_words.glb');
const target = path.join(root, 'assets', 'universal-machine-fam009', 'atomic_matroschka_triplewheel_helix_runtime_r1.glb');
const sourceAssetId = 'ASSET-E78DF8527C6B';
const animationName = 'MCB_TRIPLE_WHEEL_RETURN_10S';

function align4(value) {
  return (value + 3) & ~3;
}

function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function parseGlb(buffer) {
  if (buffer.toString('ascii', 0, 4) !== 'glTF' || buffer.readUInt32LE(4) !== 2) {
    throw new Error('Expected a glTF 2.0 binary source');
  }
  const jsonLength = buffer.readUInt32LE(12);
  const json = JSON.parse(buffer.toString('utf8', 20, 20 + jsonLength).replace(/\u0000+$/u, '').trimEnd());
  const binHeader = 20 + jsonLength;
  if (buffer.toString('ascii', binHeader + 4, binHeader + 8) !== 'BIN\u0000') {
    throw new Error('Expected one BIN chunk');
  }
  const binLength = buffer.readUInt32LE(binHeader);
  return {json, bin: buffer.subarray(binHeader + 8, binHeader + 8 + binLength)};
}

function floats(values) {
  const result = Buffer.alloc(values.length * 4);
  values.forEach((value, index) => result.writeFloatLE(value, index * 4));
  return result;
}

function quaternionZ(angle) {
  return [0, 0, Math.sin(angle / 2), Math.cos(angle / 2)];
}

function vectorBounds(values, width) {
  const min = Array(width).fill(Infinity);
  const max = Array(width).fill(-Infinity);
  values.forEach((value, index) => {
    const component = index % width;
    min[component] = Math.min(min[component], value);
    max[component] = Math.max(max[component], value);
  });
  return {min, max};
}

function build() {
  const sourceBuffer = fs.readFileSync(source);
  const {json, bin} = parseGlb(sourceBuffer);
  if ((json.animations || []).length) throw new Error('Source unexpectedly already contains animation');

  const names = new Map(json.nodes.map((node, index) => [node.name, index]));
  const required = ['Q-Space Core', 'Proton Wheel', 'Neutron Wheel', 'Electron Wheel'];
  required.forEach(name => {
    if (!names.has(name)) throw new Error(`Missing named source node: ${name}`);
  });

  json.bufferViews ||= [];
  json.accessors ||= [];
  const chunks = [Buffer.from(bin.subarray(0, json.buffers[0].byteLength))];
  let byteLength = chunks[0].length;

  function appendBuffer(data) {
    const aligned = align4(byteLength);
    if (aligned > byteLength) chunks.push(Buffer.alloc(aligned - byteLength));
    const bufferView = json.bufferViews.length;
    json.bufferViews.push({buffer: 0, byteOffset: aligned, byteLength: data.length});
    chunks.push(data);
    byteLength = aligned + data.length;
    return bufferView;
  }

  function appendAccessor(values, type, count, min, max) {
    const bufferView = appendBuffer(floats(values));
    const accessor = json.accessors.length;
    const record = {bufferView, componentType: 5126, count, type};
    if (min) record.min = min;
    if (max) record.max = max;
    json.accessors.push(record);
    return accessor;
  }

  const keyCount = 9;
  const times = Array.from({length: keyCount}, (_, index) => index * 1.25);
  const timeAccessor = appendAccessor(times, 'SCALAR', keyCount, [0], [10]);
  const rotations = [
    ['Proton Wheel', Math.PI * 2],
    ['Neutron Wheel', -Math.PI * 2],
    ['Electron Wheel', Math.PI * 4]
  ];
  const samplers = [];
  const channels = [];

  rotations.forEach(([name, totalAngle]) => {
    const values = times.flatMap((_, index) => quaternionZ(totalAngle * index / (keyCount - 1)));
    const bounds = vectorBounds(values, 4);
    const output = appendAccessor(values, 'VEC4', keyCount, bounds.min, bounds.max);
    const sampler = samplers.length;
    samplers.push({input: timeAccessor, output, interpolation: 'LINEAR'});
    channels.push({sampler, target: {node: names.get(name), path: 'rotation'}});
  });

  const scaleValues = times.flatMap((_, index) => {
    const scale = 1 + 0.055 * (1 - Math.cos(Math.PI * 2 * index / (keyCount - 1))) / 2;
    return [scale, scale, scale];
  });
  const scaleBounds = vectorBounds(scaleValues, 3);
  const scaleOutput = appendAccessor(scaleValues, 'VEC3', keyCount, scaleBounds.min, scaleBounds.max);
  samplers.push({input: timeAccessor, output: scaleOutput, interpolation: 'LINEAR'});
  channels.push({sampler: samplers.length - 1, target: {node: names.get('Q-Space Core'), path: 'scale'}});

  json.animations = [{name: animationName, samplers, channels}];
  json.buffers[0].byteLength = align4(byteLength);
  json.asset.generator = `${json.asset.generator || 'unknown'} + A0 Matroschka Runtime Builder r1`;
  json.extras = {
    ...(json.extras || {}),
    nexahRuntimeDerivative: {
      sourceAssetId,
      sourceFile: path.basename(source),
      sourceSha256: sha256(sourceBuffer),
      semanticIdentity: 'REUSES_SOURCE_ASSET',
      animation: animationName,
      snapTimes: {'0': 0, '90': 2.5, '180': 5, '270': 7.5, '360_RETURN': 10},
      claimBoundary: 'PRESENTATION_RUNTIME_ONLY / NO_NEW_NAVIGATOR_ID / NO_PHYSICAL_MECHANISM'
    }
  };

  let binary = Buffer.concat(chunks);
  if (binary.length < json.buffers[0].byteLength) {
    binary = Buffer.concat([binary, Buffer.alloc(json.buffers[0].byteLength - binary.length)]);
  }
  let jsonChunk = Buffer.from(JSON.stringify(json), 'utf8');
  jsonChunk = Buffer.concat([jsonChunk, Buffer.alloc(align4(jsonChunk.length) - jsonChunk.length, 0x20)]);
  const binChunkLength = align4(binary.length);
  if (binary.length < binChunkLength) binary = Buffer.concat([binary, Buffer.alloc(binChunkLength - binary.length)]);

  const output = Buffer.alloc(12 + 8 + jsonChunk.length + 8 + binary.length);
  output.write('glTF', 0, 4, 'ascii');
  output.writeUInt32LE(2, 4);
  output.writeUInt32LE(output.length, 8);
  output.writeUInt32LE(jsonChunk.length, 12);
  output.write('JSON', 16, 4, 'ascii');
  jsonChunk.copy(output, 20);
  const binHeader = 20 + jsonChunk.length;
  output.writeUInt32LE(binary.length, binHeader);
  output.write('BIN\u0000', binHeader + 4, 4, 'ascii');
  binary.copy(output, binHeader + 8);

  fs.writeFileSync(target, output);
  console.log(JSON.stringify({
    source: path.relative(root, source),
    sourceSha256: sha256(sourceBuffer),
    target: path.relative(root, target),
    targetSha256: sha256(output),
    bytes: output.length,
    animation: animationName,
    channels: channels.length,
    sourceAssetId,
    graphDelta: {identities: 0, relations: 0, aliases: 0}
  }, null, 2));
}

build();
