'use strict';

const isDecimalPalindrome = value => {
  const text = String(value);
  return text === [...text].reverse().join('');
};

function decimalOverlay(factor) {
  const shifted = factor * 100;
  const addend = factor;
  const width = Math.max(String(shifted).length, String(addend).length);
  const a = String(shifted).padStart(width, '0').split('').map(Number).reverse();
  const b = String(addend).padStart(width, '0').split('').map(Number).reverse();
  let carry = 0;
  const columns = [];
  for (let position = 0; position < width || carry; position += 1) {
    const left = a[position] || 0;
    const right = b[position] || 0;
    const carryIn = carry;
    const raw = left + right + carryIn;
    carry = Math.floor(raw / 10);
    columns.push({ position, left, right, carryIn, digit: raw % 10, carryOut: carry });
  }
  return {
    identity: '101q=100q+q',
    factor,
    shifted,
    addend,
    value: shifted + addend,
    overlappingColumns: columns.filter(column => column.left !== 0 && column.right !== 0).map(column => column.position),
    carryPositions: columns.filter(column => column.carryOut !== 0).map(column => column.position),
    columns
  };
}

function buildRecord() {
  const dyadic = Array.from({ length: 13 }, (_, k) => {
    const factor = 2 ** k;
    const value = 101 * factor;
    const overlay = decimalOverlay(factor);
    return {
      k,
      factor,
      value,
      u: Math.floor(k / 2),
      epsilon: k % 2,
      channel: k % 2 === 0 ? 'EVEN' : 'ODD',
      mirror: [-value, 0, value],
      decimalForm: factor < 10 ? `${factor}0${factor}` : null,
      repeatedBlock: factor >= 10 && factor < 100 ? `${factor}${factor}` : null,
      palindrome: isDecimalPalindrome(value),
      overlap: overlay.overlappingColumns.length > 0,
      carry: overlay.carryPositions.length > 0
    };
  });
  const additive = Array.from({ length: 9 }, (_, index) => {
    const n = index + 1;
    return { n, value: 101 * n, digitForm: `${n}0${n}` };
  });
  const dyadicValues = new Set(dyadic.map(record => record.value));
  const shared = additive.filter(record => dyadicValues.has(record.value)).map(record => record.value);
  const additiveOnly = additive.filter(record => !dyadicValues.has(record.value)).map(record => record.value);

  return {
    id: 'A0_SNCE_101_12928_CONNECTOR_2026_10_25',
    status: 'PASS_EXACT_RECONCILIATION_WITH_TYPED_SOURCE_BOUNDARIES',
    reusedIdentity: 'MOD:NUMBER_VIEW_SUITE',
    sourceRoles: {
      snceAuthority: 'SNCE_101_DYADIC_PARITY_V1 / 35_SNCE_101_PARITY_PROFILE_01_RESULT_REPORT.md',
      dyadicSourceBinding: '51_A0_4774_4114_8888_SNCE_404_SOURCE_BINDING_2026-10-13.md',
      demonstratorConsolidation: '100_A0_101_TO_106_DEMONSTRATOR_CONSOLIDATION_2026-10-15.md',
      ncsAuthority: 'SCC-003 / A0-BL-023 / NCS_292_Q106_INTERTWINER_RETURN_PACKAGE_2026-10-11',
      provenanceRoute: 'A0-BL-037 remains a documentary archaeology route, not the NCS or SNCE operator authority'
    },
    arithmetic: {
      additive,
      dyadic,
      shared,
      additiveOnly,
      cut12928: {
        value: 12928,
        placeValue: '1*10000+292*10+8',
        segmentation: ['1', '292', '8'],
        factor292: '292=4*73',
        palindrome292: isDecimalPalindrome(292),
        modulo292: 12928 % 292,
        status: 'DIGIT_SUBSTRING_ONLY'
      },
      outerDigits: { sum: '1+8=9=3^2', additionalSquare: '9^2=81=3^4' },
      reversal18_81: { reverse18: Number([...String(18)].reverse().join('')), inDyadicK0K12: false, operatorStatus: 'NO_OPERATOR_ROUTE_DEFINED' },
      firstOverlap: dyadic.find(record => record.overlap).k,
      firstCarry: dyadic.find(record => record.carry).k,
      overlay128: decimalOverlay(128),
      overlay4096: decimalOverlay(4096)
    },
    sourceComparison: {
      snce12928: { k: 7, u: 3, epsilon: 1, roundtrip: true },
      ncs292: { role: 'PACKAGE_MARKER_AND_TYPED_NCS_CONTEXT', equalsDigitSubstring: false, importedMechanism: false },
      f50To101ToSnce: { exactFactorMembership: true, uniqueSelector: false, status: 'EXTERNAL_TYPED_SELECTION_REQUIRED' },
      lightAndSpace: { status: 'OWNER_READING_ONLY', rule: 'Projection, shadow, UV/Hg and real mirror remain separate unless an explicit adapter is supplied.' }
    },
    ownerReadings: ['Nullöse', 'zwei Balken', '|Q°i|', 'kleines Gamma', '1│292│8', 'Licht und Raum', 'real mirror', 'UV/Hg'],
    claimBoundary: 'Exact decimal arithmetic and source reconciliation only; no NCS equality, geometric aperture, light operator, physical resonance, new family, study or finding.'
  };
}

const record = buildRecord();

if (typeof module !== 'undefined') module.exports = { buildRecord, decimalOverlay, isDecimalPalindrome, record };
if (typeof window !== 'undefined') window.A0Snce10112928Connector = { buildRecord, decimalOverlay, isDecimalPalindrome, record };
