const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const checks = [];
const check = (name, fn) => {
  fn();
  checks.push({ name, status: 'PASS' });
};

const E = k => 2001 + 100 * k;
const R = n => 5002 - n;
const isPrime = n => {
  if (n < 2) return false;
  for (let divisor = 2; divisor * divisor <= n; divisor += 1) {
    if (n % divisor === 0) return false;
  }
  return true;
};
const gcd = (a, b) => (b === 0 ? Math.abs(a) : gcd(b, a % b));
const lcm = (a, b) => Math.abs(a * b) / gcd(a, b);
const reverse10 = n => Number(String(n).split('').reverse().join(''));
const primeIndex = n => {
  assert.equal(isPrime(n), true);
  let index = 0;
  for (let value = 2; value <= n; value += 1) if (isPrime(value)) index += 1;
  return index;
};
const bigComb = (n, k) => {
  n = BigInt(n);
  k = BigInt(k);
  if (k < 0n || k > n) return 0n;
  if (k > n - k) k = n - k;
  let result = 1n;
  for (let i = 1n; i <= k; i += 1n) result = (result * (n - i + 1n)) / i;
  return result;
};
const nodes = Array.from({ length: 9 }, (_, index) => E(index + 1));
const expected = [2101, 2201, 2301, 2401, 2501, 2601, 2701, 2801, 2901];

check('finite carrier E(k)=2001+100k', () => assert.deepEqual(nodes, expected));
check('all nodes preserve decimal suffix 01', () => assert.ok(nodes.every(n => n % 100 === 1)));
check('mirror law R(E(k))=E(10-k)', () => {
  for (let k = 1; k <= 9; k += 1) assert.equal(R(E(k)), E(10 - k));
});
check('mirror is involutive', () => assert.ok(nodes.every(n => R(R(n)) === n)));
check('2501 is the unique fixed point', () => assert.deepEqual(nodes.filter(n => R(n) === n), [2501]));
check('four mirror pairs close to 5002', () => {
  assert.deepEqual(nodes.slice(0, 4).map((n, i) => [n, nodes[8 - i], n + nodes[8 - i]]), [
    [2101, 2901, 5002], [2201, 2801, 5002], [2301, 2701, 5002], [2401, 2601, 5002]
  ]);
});
check('2301/2401/2501 is an exact 100-step ladder', () => {
  assert.equal(2401 - 2301, 100);
  assert.equal(2501 - 2401, 100);
});
check('root corridor identities', () => {
  assert.equal(49 ** 2 - 10 ** 2, 2301);
  assert.equal(49 ** 2, 2401);
  assert.equal(49 ** 2 + 10 ** 2, 2501);
});
check('2401 is the midpoint of 2301 and 2501', () => assert.equal(2301 + 2501, 2 * 2401));
check('2401/2501/2601 special forms', () => {
  assert.equal(2401, 7 ** 4);
  assert.equal(2501, 41 * 61);
  assert.equal(2601, 51 ** 2);
});
check('2701 is triangular T73', () => assert.equal((73 * 74) / 2, 2701));
check('displayed factorizations reconstruct all composite nodes', () => {
  assert.deepEqual([
    11 * 191,
    31 * 71,
    3 * 13 * 59,
    7 ** 4,
    41 * 61,
    (3 * 17) ** 2,
    37 * 73,
    3 * 967
  ], [2101, 2201, 2301, 2401, 2501, 2601, 2701, 2901]);
});
check('2801 is the only prime on the nine-node carrier', () => {
  assert.equal(isPrime(2801), true);
  assert.deepEqual(nodes.filter(isPrime), [2801]);
});
check('7^4 partition through N-band complement', () => {
  assert.equal(1029, 3 * 7 ** 3);
  assert.equal(429 + 456 + 487, 4 * 7 ** 3);
  assert.equal(1029 + 429 + 456 + 487, 7 ** 4);
});

const mirrorStair = [1031, 1032, 1033, 1087, 1301, 2301, 2801, 3301, 7801];
check('decimal mirror stair keeps three exact reversal pairs', () => {
  assert.equal(reverse10(1031), 1301);
  assert.equal(reverse10(1032), 2301);
  assert.equal(reverse10(1033), 3301);
});
check('mirror stair prime labels and 2801 index are corrected', () => {
  assert.equal(isPrime(1031), true);
  assert.equal(isPrime(1032), false);
  assert.equal(isPrime(1033), true);
  assert.equal(primeIndex(1087), 181);
  assert.equal(primeIndex(2801), 408);
  assert.equal(isPrime(408), false);
  assert.equal(7801, 29 * 269);
});
check('280-wheel is a candidate sieve and 7801 is its negative control', () => {
  const expectedResidues = [191, 192, 193, 247, 181, 61, 1, 221, 241];
  assert.deepEqual(mirrorStair.map(n => n % 280), expectedResidues);
  assert.deepEqual(mirrorStair.map(n => gcd(n, 280)), [1, 8, 1, 1, 1, 1, 1, 1, 1]);
  assert.equal(isPrime(7801), false);
});

const twinCandidates = [
  { n: 1, pair: [5, 7], survives: true, axis: 'A' },
  { n: 2, pair: [11, 13], survives: true, axis: 'B' },
  { n: 3, pair: [17, 19], survives: true, axis: 'A' },
  { n: 4, pair: [23, 25], survives: false, axis: 'B' },
  { n: 5, pair: [29, 31], survives: true, axis: 'A' },
  { n: 6, pair: [35, 37], survives: false, axis: 'B' },
  { n: 7, pair: [41, 43], survives: true, axis: 'A' },
  { n: 10, pair: [59, 61], survives: true, axis: 'B' }
];
check('twin-prime cross rotates through the two mod-12 candidate axes', () => {
  for (const row of twinCandidates) {
    assert.deepEqual(row.pair, [6 * row.n - 1, 6 * row.n + 1]);
    assert.deepEqual(row.pair.map(n => n % 12), row.axis === 'A' ? [5, 7] : [11, 1]);
    assert.equal(row.pair.every(isPrime), row.survives);
  }
});
check('rotating-cross angles distinguish step, pair width and axis flip', () => {
  assert.equal(360 / 12, 30);
  assert.equal(2 * (360 / 12), 60);
  assert.equal(6 * (360 / 12), 180);
});

const crtModuli = [17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79];
check('CRT-RATH-MOD36 bridge reconstructs 1836 without claiming derivation', () => {
  const channels = 16;
  const startModulus = 17;
  const hinge = startModulus + 1;
  const q = (2 * (hinge + hinge)) / 24;
  assert.equal(channels + startModulus, 33);
  assert.equal(q, 3);
  assert.equal(channels + startModulus + q, 36);
  assert.equal(q * startModulus, 51);
  assert.equal((channels + startModulus + q) * (q * startModulus), 1836);
  assert.equal(1836 % 36, 0);
  assert.equal(1836 % 17, 0);
});
check('1836 CRT residue tuple has one zero channel at modulus 17', () => {
  const residues = crtModuli.map(modulus => 1836 % modulus);
  assert.deepEqual(residues, [0, 12, 19, 9, 7, 23, 32, 30, 3, 34, 7, 6, 27, 61, 11, 19]);
  assert.deepEqual(crtModuli.filter((modulus, index) => residues[index] === 0), [17]);
});
check('C72 is the least common carrier of C24 and C36', () => {
  assert.equal(gcd(24, 36), 12);
  assert.equal(lcm(24, 36), 72);
  assert.equal(72 / 36, 2);
  assert.equal(72 / 24, 3);
  assert.equal(36, 6 ** 2);
  assert.equal(36, 4 * 9);
});

check('51 carrier resolves through 3 times the seventh prime', () => {
  assert.equal(primeIndex(17), 7);
  assert.equal(51, 3 * 17);
  assert.equal(2601, 51 ** 2);
  assert.equal(2601, 3 ** 2 * 17 ** 2);
});
check('Fibonacci-prime lock joins P24 through 12 squared to P51', () => {
  assert.equal(primeIndex(89), 24);
  assert.equal(primeIndex(233), 51);
  assert.equal(89 + 12 ** 2, 233);
  assert.equal(12 ** 2 * 12, 1728);
});
check('inner tube mirror and 2801 prime index remain independently bounded', () => {
  assert.equal(2401 + 2601, 2 * 2501);
  assert.equal(2801, 2401 + 20 ** 2);
  assert.equal(primeIndex(2801), 408);
  assert.equal(isPrime(408), false);
});

check('P408 to P409 is an exact twin-prime index switch', () => {
  assert.equal(primeIndex(2801), 408);
  assert.equal(primeIndex(2803), 409);
  assert.equal(2803 - 2801, 2);
  assert.deepEqual([2801 % 12, 2803 % 12], [5, 7]);
  assert.deepEqual([2801 % 32, 2803 % 32], [17, 19]);
});
check('Pascal-121 shortcut preserves indices and separates one-based shadow addresses', () => {
  const B = 100;
  const a = 47;
  const b = 74;
  assert.equal(a + b, 121);
  assert.equal(a * b, 3478);
  assert.equal((B + a) * (B + b), 25578);
  assert.equal(B * (B + a + b) + a * b, 25578);
  assert.deepEqual([a + 1, b + 1], [48, 75]);
  assert.equal((a + 1) + (b + 1), 123);
});
check('horseshoe decimal view separates endpoints, aperture and midpoint', () => {
  const lower = 12;
  const upper = 32;
  assert.equal(upper - lower, 20);
  assert.equal((lower + upper) / 2, 22);
});
check('OVS Pascal invariant and one-based shadow row are exact BigInt controls', () => {
  const invariant = bigComb(121n, 47n);
  const shadow = bigComb(123n, 48n);
  assert.equal(invariant, bigComb(121n, 74n));
  assert.equal(invariant, 9461526413670410452587229673057400n);
  assert.equal(1n << 121n, 2658455991569831745807614120560689152n);
  assert.equal(shadow, bigComb(123n, 75n));
  assert.equal(shadow, 39438795934316160903201102353860929n);
  assert.equal(1n << 123n, 10633823966279326983230456482242756608n);
  assert.equal((1n << 123n) / (1n << 121n), 4n);
});
check('shadow combinatorial lift and repunit prefix remain separately typed', () => {
  const invariant = bigComb(121n, 47n);
  const shadow = bigComb(123n, 48n);
  assert.equal(shadow * 600n, invariant * 2501n);
  assert.equal(11n ** 2n, 121n);
  assert.equal(111n ** 2n, 12321n);
  assert.equal(String(111n ** 2n).startsWith('123'), true);
  assert.equal(123n, 3n * 41n);
});

check('CK horizon glyph view preserves one stem and explicit non-identity boundaries', () => {
  const jointsHtml = fs.readFileSync(path.join(__dirname, 'A0_MATHEMATICAL_JOINTS.html'), 'utf8');
  assert.match(jointsHtml, /id="ck-horizon-lambda-beta-glyph-view"/);
  assert.match(fs.readFileSync(path.join(__dirname, 'a0-red-balloon-story.js'), 'utf8'), /href="#ck-horizon-lambda-beta-glyph-view"/);
  assert.match(jointsHtml, /<code>CK→KK<\/code> nur als View-Dopplung/);
  assert.match(jointsHtml, /NO UNIVERSAL GLYPH SEMANTICS · NO ALGEBRAIC DOUBLING/);
});

const receipt = {
  status: 'PASS',
  checks: checks.length,
  carrier: {
    domain: 'k in {1,...,9}',
    encoder: 'E(k)=overline(2k01)=2001+100k',
    nodes,
    invariant: 'E(k) mod 100 = 1'
  },
  mirror: {
    operator: 'R(n)=5002-n',
    registerForm: 'R(E(k))=E(10-k)',
    fixedPoint: 2501,
    pairs: [[2101, 2901], [2201, 2801], [2301, 2701], [2401, 2601]]
  },
  rootCorridor: {
    lower: '2301=49^2-10^2',
    middle: '2401=49^2=7^4',
    upper: '2501=49^2+10^2',
    midpoint: '2301+2501=2*2401=4802'
  },
  nodeRoles: {
    compositeFactorizations: ['2101=11*191', '2201=31*71', '2301=3*13*59', '2401=7^4', '2501=41*61', '2601=3^2*17^2=51^2', '2701=37*73', '2901=3*967'],
    prime: '2801',
    triangular: '2701=T73'
  },
  nBandPartition: '1029+(429+456+487)=3*7^3+4*7^3=7^4=2401',
  mirrorStair280Wheel: {
    reversals: ['1031<->1301', '1032<->2301', '1033<->3301'],
    residuesMod280: mirrorStair.map(n => [n, n % 280]),
    primeIndices: { 1087: 181, 2801: 408 },
    correction: '2801=P408, not P409; 7801=29*269 passes the wheel candidate gate but is composite.'
  },
  twinPrimeRotatingCross: {
    candidate: 'S_n=(6n-1,6n+1)',
    unitsMod12: [1, 5, 7, 11],
    axes: { A: [5, 7], B: [11, 1] },
    anglesDegrees: { omega: 30, pairWidth: 60, axisFlip: 180 },
    rows: twinCandidates,
    boundary: 'Deterministic candidate rotation plus irregular prime-survival mask; not a twin-prime generator or theorem.'
  },
  crtRathMod36: {
    typedInputs: { channels: 16, startModulus: 17, hinge: 18 },
    declaredOperator: 'q=2*(18+18)/24=3',
    exactBridge: '1836=(16+17+3)*(17*3)=36*51',
    residues: crtModuli.map(modulus => [modulus, 1836 % modulus]),
    commonCarrier: 'lcm(24,36)=72; degrees C72->C36=2 and C72->C24=3',
    boundary: 'Declared typed crosswalk; not derived from A272899. Decimal 18|36 is a view only.'
  },
  fibonacci51Bridge: {
    carrier: '51=3*17 with 17=P7; 2601=51^2=3^2*17^2',
    fibonacciLock: '89+12^2=233 with 89=F11=P24, 144=F12 and 233=F13=P51',
    thresholdReturn: '12^2*12=12^3=1728',
    tubeMirror: '2401+2601=2*2501',
    separatePrimeRead: '2801=7^4+20^2=P408; 408 is composite, so 2801 is not super-prime',
    boundary: 'Prime indices, Fibonacci positions and arithmetic identities are exact but remain distinct operators; index equality is not a causal mechanism.'
  },
  prime409PascalShadowSwitch: {
    primeIndexSwitch: '2801=P408 -> 2803=P409 with twin-prime gap +2',
    residueViews: { mod12: [5, 7], mod32: [17, 19] },
    pascalCore: 'a=47, b=74, n=a+b=121 and C(121,47)=C(121,74)',
    areaShortcut: '(100+47)(100+74)=100*221+3478=25578',
    shadowAddressView: 'one-based addresses (48,75) sum to 123 and are not the Pascal complement indices',
    exactBigInt: {
      invariantCombination: 'C(121,47)=C(121,74)=9461526413670410452587229673057400',
      shadowCombination: 'C(123,48)=C(123,75)=39438795934316160903201102353860929',
      invariantHistories: '2^121=2658455991569831745807614120560689152',
      shadowHistories: '2^123=10633823966279326983230456482242756608',
      historyRatio: '4',
      combinationRatio: 'C(123,48)/C(121,47)=2501/600'
    },
    repunitDecimalView: '11^2=121 -> 111^2=12321; prefix 123 is decimal-view evidence only',
    horseshoeView: '0.032-0.012=0.020; midpoint=0.022',
    openContract: '0.012/0.032/0.020 remain decimal view values until modulus, normalization and RL/RR return operator are declared.'
  },
  ckHorizonGlyphView: {
    carrier: 'one shared vertical K stem',
    upperView: 'K_Lambda: upper opening/projection shell',
    lowerView: 'K_beta: lower receiving/return shell',
    aperture: 'C remains an embracing aperture view',
    hook: 'cedilla/ç is a local attach-return marker on the lower shell',
    boundary: 'CK->KK is view duplication only; no algebraic doubling, new node, topological gluing proof or universal glyph semantics.'
  },
  localVocabulary: {
    label: 'LL0',
    meaning: 'fixed decimal zero seam in overline(2k01)',
    nonIdentity: ['LL->T', 'LL/LR/RL/RR', 'PI LL AR', 'null', 'aperture']
  },
  claimBoundary: 'Exact finite decimal carrier, affine involution, factor arithmetic, prime/Fibonacci indices, candidate sieves and declared typed crosswalks only. Resonance tube and rotating cross are view names. Matching indices do not establish cause. No frequency, material coupling, physical resonance, prime generator, A272899 derivation, canonical LL merge, new Source Graph identity, relation, study or finding.'
};

const json = `${JSON.stringify(receipt, null, 2)}\n`;
if (process.argv.includes('--write')) {
  const output = path.join(__dirname, 'results', 'a0-portal-ll0-mirror-rail-audit-2026-11-17.json');
  fs.writeFileSync(output, json);
  console.log(`WROTE ${output}`);
} else {
  console.log(json);
}
