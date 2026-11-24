(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.A0TessarecRootSpaceMatrix = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const VERSION = '1.0.0';
  const SCHEMA = 'nexah.a0.tessarec-root-space-matrix/1';
  const ROOTS = Object.freeze([2, 3, 5, 7]);

  const diagonal = values => values.map((value, row) =>
    values.map((_, column) => row === column ? value : 0));

  const bits = address => ROOTS.map((_, axis) => (address >> axis) & 1);
  const hamming = (left, right) => bits(left).reduce((sum, bit, axis) =>
    sum + Number(bit !== bits(right)[axis]), 0);

  function squaredDistance(left, right) {
    const a = bits(left);
    const b = bits(right);
    return ROOTS.reduce((sum, prime, axis) => sum + prime * Math.abs(a[axis] - b[axis]), 0);
  }

  function vertex(address) {
    if (!Number.isInteger(address) || address < 0 || address > 15) {
      throw new RangeError('Q4 address must be an integer from 0 to 15.');
    }
    const addressBits = bits(address);
    return {
      address,
      bitString: address.toString(2).padStart(4, '0'),
      bits: addressBits,
      rootCoordinates: addressBits.map((bit, axis) => bit ? Math.sqrt(ROOTS[axis]) : 0),
      normalizedCoordinates: addressBits.slice(),
      normSquared: addressBits.reduce((sum, bit, axis) => sum + bit * ROOTS[axis], 0)
    };
  }

  function fieldBasis() {
    return Array.from({ length: 16 }, (_, mask) => {
      const factors = ROOTS.filter((_, axis) => (mask >> axis) & 1);
      const radicand = factors.reduce((product, value) => product * value, 1);
      return {
        mask,
        factors,
        radicand,
        label: mask === 0 ? '1' : `sqrt(${radicand})`
      };
    });
  }

  function record() {
    const vertices = Array.from({ length: 16 }, (_, address) => vertex(address));
    const adjacency = vertices.map(left => vertices.map(right =>
      hamming(left.address, right.address) === 1 ? 1 : 0));
    const distanceSquared = vertices.map(left => vertices.map(right =>
      squaredDistance(left.address, right.address)));
    const edges = [];
    for (let from = 0; from < 16; from += 1) {
      for (let axis = 0; axis < 4; axis += 1) {
        const to = from ^ (1 << axis);
        if (from < to) edges.push({ from, to, axis, lengthSquared: ROOTS[axis] });
      }
    }

    return {
      schema: SCHEMA,
      version: VERSION,
      status: 'BOUNDED_FORMAL_MODEL',
      identity: {
        module: 'MOD:TESSAREC',
        artifact: 'ART:TESSAREC:ROOT_SPACE_8_16',
        effect: 'REUSE_EXTEND_NO_NEW_IDENTITY_NO_NEW_RELATION'
      },
      carrier: {
        roots: ROOTS.slice(),
        basisMatrix: diagonal(ROOTS.map(Math.sqrt)),
        gramMatrix: diagonal(ROOTS),
        rawGeometry: 'FOUR_DIMENSIONAL_ROOT_ORTHOTOPE',
        normalizedGeometry: 'Q4_TESSERACT',
        vertexCount: vertices.length,
        edgeCount: edges.length,
        degree: 4
      },
      vertices,
      edges,
      matrices: {
        adjacency,
        distanceSquared
      },
      inBetween: {
        openCell: '(0,sqrt(2)) x (0,sqrt(3)) x (0,sqrt(5)) x (0,sqrt(7))',
        normalizedOpenCell: '(0,1)^4',
        dimension: 4,
        interpretation: 'The vertices are finite addresses; the open cell is a continuum of interior points. It is not a new number type or a literal gap between rational numbers.'
      },
      algebraicCrosscheck: {
        field: 'Q(sqrt(2),sqrt(3),sqrt(5),sqrt(7))',
        degree: 16,
        basis: fieldBasis(),
        boundary: 'The 16-dimensional field basis and the 16 Q4 vertices have the same count but are different mathematical objects.'
      },
      visualSourceBoundary: 'The supplied Complete Matrix artwork is treated as visual provenance. Its unlabeled numerical grids are not imported as a matrix law. Complete Matrix here means the explicit basis, Gram, adjacency and pairwise squared-distance matrices.',
      claimBoundary: 'Finite geometry and algebraic bookkeeping only. No preferred natural geometry, time quantum, physical resonance, cubit-to-quantum conversion or universal mechanism is claimed.'
    };
  }

  return { VERSION, SCHEMA, ROOTS, bits, hamming, squaredDistance, vertex, fieldBasis, record };
});
