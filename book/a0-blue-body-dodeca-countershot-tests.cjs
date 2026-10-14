const assert = require("node:assert/strict");
const countershot = require("./assets/a0-blue-body-dodeca-countershot-v1.js");

const result = countershot.validate();
assert.deepEqual(result, {
  vertices: 20,
  edges: 30,
  faces: 12,
  pentagonal: true,
  oppositePairs: 6,
  euler: 2,
  palindrome: true
});

const word = countershot.word4774();
assert.deepEqual(word.tokens, [4, 7, 7, 4]);
assert.equal(word.four.exact, "2²");
assert.equal(word.seven.exact, "2² + 3");
assert.equal(word.seven.grid3x3.filter(Boolean).length, 7);
assert.equal(word.seven.residual, 2);
assert.equal(word.classification, "EXACT_PALINDROME_PLUS_CONSTRUCTED_ROLE_CODE");

console.log(JSON.stringify({ status: "PASS", assertions: 13, dodecahedron: result, word: word.tokens }, null, 2));
