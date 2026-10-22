(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.A0TessarecFiberGeometry = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const PHI = (1 + Math.sqrt(5)) / 2;
  const FREE_FIBERS = {
    "1111": [
      { layer: "P0", frame: 10, host: "A0", carrierDegree: 5, hostDegree: 3 },
      { layer: "P1", frame: 26, host: "A7", carrierDegree: 6, hostDegree: 3 },
      { layer: "P2", frame: 42, host: "A5", carrierDegree: 5, hostDegree: 3 }
    ],
    "0111": [
      { layer: "P0", frame: 2, host: "B0", carrierDegree: 5, hostDegree: 3 },
      { layer: "P1", frame: 18, host: "A6", carrierDegree: 6, hostDegree: 3 },
      { layer: "P2", frame: 34, host: "C4", carrierDegree: 5, hostDegree: 3 }
    ]
  };

  function totient(n) {
    let value = n;
    let work = n;
    for (let prime = 2; prime * prime <= work; prime += 1) {
      if (work % prime !== 0) continue;
      while (work % prime === 0) work /= prime;
      value -= value / prime;
    }
    if (work > 1) value -= value / work;
    return value;
  }

  function fiber(address = "1111") {
    if (!FREE_FIBERS[address]) throw new Error(`Unknown frozen fiber ${address}`);
    const integer = parseInt(address, 2);
    const decimalLabel = Number(address);
    const phiValue = totient(decimalLabel);
    return {
      address,
      binaryInteger: integer,
      decimalLabel,
      totient: phiValue,
      totientGap: decimalLabel - phiValue,
      layers: FREE_FIBERS[address].map((record) => ({ ...record })),
      multiplicity: FREE_FIBERS[address].length
    };
  }

  function pentagon(side = 1) {
    const area = 5 * side * side / (4 * Math.tan(Math.PI / 5));
    const goldenTriangleArea = 0.5 * side * side * Math.sin(3 * Math.PI / 5);
    const remainderArea = area - goldenTriangleArea;
    return {
      side,
      diagonal: PHI * side,
      area,
      goldenTriangleArea,
      remainderArea,
      triangleShare: goldenTriangleArea / area,
      remainderShare: remainderArea / area,
      remainderToTriangle: remainderArea / goldenTriangleArea,
      rhombus: { sourceTriangles: 2, side, angles: [72, 108], longDiagonal: PHI * side }
    };
  }

  function truncateApex(t = 1 / PHI, side = 1) {
    if (!(t > 0 && t < 1)) throw new Error("t must lie in (0,1)");
    const p = pentagon(side);
    const triangleArea = 0.5 * (t * side) ** 2 * Math.sin(3 * Math.PI / 5);
    return {
      t,
      side,
      cutEdge: PHI * t * side,
      triangleArea,
      hexagonArea: p.area - triangleArea,
      triangleShare: triangleArea / p.area,
      hexagonShare: 1 - triangleArea / p.area,
      equalCutEdge: Math.abs(PHI * t - 1) < 1e-12,
      boundarySides: 6
    };
  }

  return { PHI, FREE_FIBERS, totient, fiber, pentagon, truncateApex };
});
