(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (typeof document !== "undefined") {
    const boot = () => api.mount(document);
    document.readyState === "loading"
      ? document.addEventListener("DOMContentLoaded", boot, { once: true })
      : boot();
  }
  root.NexahTrianglePhiLens = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const PHI = (1 + Math.sqrt(5)) / 2;
  const PHASE_BITS = 6;
  const LOCAL_BITS = 4;
  const PHASE_STATE_COUNT = 2 ** PHASE_BITS;
  const LOCAL_STATE_COUNT = 2 ** LOCAL_BITS;
  const APERTURE_PULSE = Object.freeze([16, 17, 20, 18, 19, 20]);
  const COUNTER_AXIS_PAIR = Object.freeze([8, 55]);
  const LAMELLA_COUNT = 7;
  const LAMELLA_FAMILIES = 3;
  const HEX_CENTER = Object.freeze([350, 240]);
  const HEX_RADIUS = 145;
  const LC_CENTER = Object.freeze([350, 240]);
  const LC_RADIUS = 145;
  const LC_OPENING_DEGREES = 120;
  const POINTS = Object.freeze({
    16: Object.freeze([164, 442]),
    17: Object.freeze([164, 208]),
    18: Object.freeze([536, 442]),
    19: Object.freeze([536, 208]),
    20: Object.freeze([350, 326])
  });

  function distance(a, b) {
    return Math.hypot(a[0] - b[0], a[1] - b[1]);
  }

  function angleAt(a, b, c) {
    const u = [a[0] - b[0], a[1] - b[1]];
    const v = [c[0] - b[0], c[1] - b[1]];
    const dot = u[0] * v[0] + u[1] * v[1];
    const norm = Math.hypot(...u) * Math.hypot(...v);
    return Math.acos(Math.max(-1, Math.min(1, dot / norm)));
  }

  function triangleAngles(ids) {
    const p = ids.map((id) => POINTS[id]);
    return [angleAt(p[1], p[0], p[2]), angleAt(p[0], p[1], p[2]), angleAt(p[0], p[2], p[1])];
  }

  function triangleArea(a, b, c) {
    return Math.abs((a[0] * (b[1] - c[1]) + b[0] * (c[1] - a[1]) + c[0] * (a[1] - b[1])) / 2);
  }

  function polygonArea(points) {
    return Math.abs(points.reduce((sum, point, index) => {
      const next = points[(index + 1) % points.length];
      return sum + point[0] * next[1] - next[0] * point[1];
    }, 0) / 2);
  }

  function regularHexagon(center = HEX_CENTER, radius = HEX_RADIUS) {
    return Object.freeze(Array.from({ length: 6 }, (_, index) => {
      const angle = index * Math.PI / 3;
      return Object.freeze([
        center[0] + radius * Math.cos(angle),
        center[1] + radius * Math.sin(angle)
      ]);
    }));
  }

  function lamellaHexagon() {
    const vertices = regularHexagon();
    const center = HEX_CENTER;
    const rhombi = Object.freeze([
      Object.freeze([center, vertices[1], vertices[2], vertices[3]]),
      Object.freeze([center, vertices[3], vertices[4], vertices[5]]),
      Object.freeze([center, vertices[5], vertices[0], vertices[1]])
    ]);
    const rhombusAreas = Object.freeze(rhombi.map(polygonArea));
    return Object.freeze({
      center,
      radius: HEX_RADIUS,
      vertices,
      rhombi,
      rhombusAreas,
      hexagonArea: polygonArea(vertices),
      partitionArea: rhombusAreas.reduce((sum, area) => sum + area, 0),
      rhombusCount: rhombi.length,
      triangleCount: rhombi.length * 2,
      seamCount: 3,
      seamAngleDegrees: 120,
      lamellaFamilies: LAMELLA_FAMILIES,
      lamellaCount: LAMELLA_COUNT,
      totalLamellaLines: LAMELLA_FAMILIES * LAMELLA_COUNT,
      octaveIntervals: LAMELLA_COUNT + 1,
      doubleRouteCount: 2,
      lRoute: Object.freeze([16, 17, 19]),
      hingeRoute: Object.freeze([16, 20, 19])
    });
  }

  function jalousieRegister(pinCount = 18) {
    const pins = Number(pinCount);
    if (!Number.isInteger(pins) || pins < 1) throw new RangeError("jalousie pin count must be a positive integer");
    return Object.freeze({
      objectId: "NLK_L_SHELL_JALOUSIE_VIEW",
      projectionClass: "BOUNDED_DISPLAY_REGISTER",
      interiorPinCount: pins,
      frameBoundaryCount: 2,
      gapCount: pins + 1,
      leftAxisVisible: true,
      tokens: Object.freeze(["MA", "PA", "S", "T", "A"]),
      tokenRole: "LOCAL_POSITION_MARKERS",
      claimBoundary: "DISPLAY_PROJECTION_ONLY"
    });
  }

  function qrtObject() {
    const rhombus = lamellaHexagon().rhombi[2];
    const [origin, cornerU, opposite, cornerV] = rhombus;
    const u = Object.freeze([cornerU[0] - origin[0], cornerU[1] - origin[1]]);
    const v = Object.freeze([cornerV[0] - origin[0], cornerV[1] - origin[1]]);
    const determinant = u[0] * v[1] - u[1] * v[0];
    const triangles = Object.freeze([
      Object.freeze({ id: "T_Y", alias: "BO", points: Object.freeze([origin, cornerU, opposite]), area: triangleArea(origin, cornerU, opposite) }),
      Object.freeze({ id: "T_β", alias: "TH", points: Object.freeze([origin, opposite, cornerV]), area: triangleArea(origin, opposite, cornerV) })
    ]);
    const rhombusArea = polygonArea(rhombus);
    return Object.freeze({
      objectId: "QRT",
      projectionClass: "AFFINE_SQUARE_TO_RHOMBUS",
      sourceSquare: Object.freeze([[0, 0], [1, 0], [1, 1], [0, 1]].map((point) => Object.freeze(point))),
      rhombus,
      rhombusArea,
      sharedDiagonal: Object.freeze([origin, opposite]),
      triangles,
      partitionArea: triangles.reduce((sum, triangle) => sum + triangle.area, 0),
      affine: Object.freeze({
        origin,
        matrix: Object.freeze([u, v]),
        determinant,
        preservesParallelism: true,
        preservesAngles: false,
        preservesLengths: false
      }),
      l7: Object.freeze({ route: "L", lamellaCount: LAMELLA_COUNT, intervalCount: LAMELLA_COUNT + 1 }),
      phantom: Object.freeze({ role: "NEGATIVE_SPACE_CONTINUATION", faceCount: 0 }),
      cube: Object.freeze({ role: "ISOMETRIC_DISPLAY_ONLY", dimensionClaim: false })
    });
  }

  function lcMotion(turns = 0) {
    if (!Number.isFinite(turns)) throw new TypeError("turns must be finite");
    const opening = LC_OPENING_DEGREES * Math.PI / 180;
    const phase = -Math.PI / 2 + turns * Math.PI * 2;
    const pointAt = (angle) => Object.freeze([
      LC_CENTER[0] + LC_RADIUS * Math.cos(angle),
      LC_CENTER[1] + LC_RADIUS * Math.sin(angle)
    ]);
    const theta = pointAt(phase);
    const lambda = pointAt(phase + opening);
    const zeta = Object.freeze([
      (theta[0] + lambda[0]) / 2,
      (theta[1] + lambda[1]) / 2
    ]);
    return Object.freeze({
      objectId: "L_c",
      motionClass: "RIGID_PLANAR_ROTATION",
      center: LC_CENTER,
      radius: LC_RADIUS,
      turns,
      openingDegrees: LC_OPENING_DEGREES,
      openingRadians: opening,
      chordLength: distance(theta, lambda),
      points: Object.freeze({ theta, zeta, lambda }),
      roles: Object.freeze({
        theta: Object.freeze({ label: "Θ", color: "YELLOW", role: "PHASE_DRIVER" }),
        zeta: Object.freeze({ label: "Ζ", color: "BLUE", role: "CHORD_MIDPOINT_WITNESS" }),
        lambda: Object.freeze({ label: "Λ", color: "GREY_WHITE", role: "RETURN_ENDPOINT" })
      }),
      exactReturnTurns: 1,
      claimBoundary: "KINEMATIC_DISPLAY_ONLY"
    });
  }

  function cubeWobble(turns = 0) {
    if (!Number.isFinite(turns)) throw new TypeError("turns must be finite");
    const phase = turns * Math.PI * 2;
    const clean = (value) => Math.abs(value) < 1e-12 ? 0 : value;
    const channels = Object.freeze([
      clean(Math.sin(phase)),
      clean(Math.sin(phase * 2)),
      clean(Math.sin(phase * 3))
    ]);
    const rotationDegrees = 6 * channels[0];
    const shearDegrees = 4 * channels[1];
    const scaleX = 1 + .025 * channels[2];
    const scaleY = 1 - .018 * channels[2];
    return Object.freeze({
      objectId: "NLK_L_SHELL_CUBE_VIEW",
      motionClass: "AFFINE_DISPLAY_WOBBLE",
      turns,
      center: HEX_CENTER,
      frequencyRatio: Object.freeze([1, 2, 3]),
      channels,
      rotationDegrees,
      shearDegrees,
      scaleX,
      scaleY,
      determinant: scaleX * scaleY,
      topology: Object.freeze({ rhombusCount: 3, triangleCount: 6, lamellaCount: LAMELLA_FAMILIES * LAMELLA_COUNT }),
      seam: Object.freeze({
        route: Object.freeze([16, 17, 19]),
        canonicalIdentity: "NLK_L_SHELL",
        localAlias: "LILITH / L-SEAM",
        attachment: "SAME_LOCAL_AFFINE_FRAME"
      }),
      balanceWitness: Object.freeze({
        existingBenchModel: "A0PascalJointCounterweight",
        reading: "COUNTERWEIGHT_WATER_LEVEL",
        centerFixed: true,
        returnLevel: 0
      }),
      exactReturnTurns: 1,
      claimBoundary: "DISPLAY_PROJECTION_ONLY"
    });
  }

  function raThBridge(turns = 0, samples = 181) {
    if (!Number.isFinite(turns)) throw new TypeError("RA/TH turns must be finite");
    if (!Number.isInteger(samples) || samples < 9) throw new RangeError("RA/TH samples must be an integer of at least nine");
    const phase = turns * Math.PI * 2;
    const exactReturn = Math.abs(turns - Math.round(turns)) < 1e-10;
    const sway = Math.sin(phase);
    const counter = Math.sin(phase * 2);
    const pivot = Object.freeze([350, 160]);
    const typedT = Object.freeze({
      x: 350 + 13 * counter,
      y: 235 + 8 * Math.cos(phase),
      rotationDegrees: 9 * sway
    });
    const windowPath = Object.freeze(Array.from({ length: samples }, (_, index) => {
      const parameter = index / (samples - 1) * Math.PI * 2 + phase;
      return Object.freeze([
        350 + 112 * Math.sin(3 * parameter),
        358 + 62 * Math.sin(2 * parameter + Math.PI / 2)
      ]);
    }));
    const iotaStepDegrees = 360 / 365;
    const addressGap = 365 - 360;
    const iotaHalfStep = .5;
    const iotaMarkerDegrees = ((turns * 360) + iotaHalfStep * iotaStepDegrees) % 360;
    return Object.freeze({
      objectId: "NEXAH_A0_ORIENTATION_CONTROLLER_BENCH",
      viewRole: "RA_TH_BRIDGE_PROJECTION",
      motionClass: "TYPED_DISPLAY_HANDOFF",
      turns,
      pivot,
      twinSticks: Object.freeze({
        leftDegrees: -42 + 7 * sway,
        rightDegrees: 42 - 7 * sway,
        counterRotating: true
      }),
      typedT,
      tesaWindow: Object.freeze({
        existingRouter: "A0TesaLissajousWindowRouter",
        frequencyRatio: Object.freeze([3, 2]),
        phaseOffsetRadians: Math.PI / 2,
        path: windowPath,
        iotaDrift: Object.freeze({
          sourceCarrier: "Z_365",
          viewRule: "theta(k)=360deg*k/365",
          displayCircleDegrees: 360,
          carrierStateCount: 365,
          stepDegrees: iotaStepDegrees,
          addressGap,
          vGapDegrees: addressGap * iotaStepDegrees,
          halfStepAddress: iotaHalfStep,
          halfStepDegrees: iotaHalfStep * iotaStepDegrees,
          markerDegrees: iotaMarkerDegrees,
          role: "IOTA_DISPLAY_INTERPOLATION",
          sourceMutation: false,
          boundary: "COORDINATE_READOUT_NOT_OPERATOR_INVARIANT"
        })
      }),
      rec: Object.freeze({
        label: "REC",
        type: "TYPED_RETURN_RECEIPT",
        route: Object.freeze(["RA", "TH", "T", "TESA", "REC", "RA"]),
        readRole: "R",
        displayRole: "D",
        state: exactReturn ? "EXACT_RETURN" : "HOLD",
        sourceAddressHeld: true,
        sourceMutation: false
      }),
      existingModuleHandoffs: Object.freeze({
        fullTesaLissajous: "A0_ORIENTATION_CONTROLLER_BENCH.html#tesaLissajousWindowRouter",
        iotaBridgeTour: "A0_IOTA_BRIDGE_DEMONSTRATOR.html#module-entry",
        iotaGridBridge: "A0_IOTA_BRIDGE_DEMONSTRATOR.html#gridBridgeFlagship",
        contract: "LINKED_EXISTING_MODULES_NO_EMBEDDED_DUPLICATE"
      }),
      roles: Object.freeze({
        RA: "LOCAL_RETURN_AXIS",
        TH: "EXISTING_T_BETA_LOCAL_ALIAS",
        T: "TYPED_HANDOFF_MARKER",
        R: "READ_RETURN_ROLE",
        D: "DISPLAY_ROLE"
      }),
      exactReturnTurns: 1,
      sourceMutation: false,
      newIdentity: false,
      newRelation: false,
      claimBoundary: "DISPLAY_PROJECTION_ONLY"
    });
  }

  function advanceWobbleDegrees(currentDegrees, elapsedMilliseconds) {
    const current = Number(currentDegrees);
    const elapsed = Number(elapsedMilliseconds);
    if (!Number.isFinite(current) || !Number.isFinite(elapsed)) throw new TypeError("wobble phase and elapsed time must be finite");
    const next = current + Math.min(100, Math.max(0, elapsed)) * .025;
    return ((next % 360) + 360) % 360;
  }

  function rotate(values, count) {
    const n = ((count % values.length) + values.length) % values.length;
    return values.slice(n).concat(values.slice(0, n));
  }

  function toBinary(value, width = PHASE_BITS) {
    if (!Number.isInteger(value) || value < 0 || value >= 2 ** width) throw new RangeError(`value must fit in ${width} bits`);
    return value.toString(2).padStart(width, "0");
  }

  function isPrime(value) {
    if (!Number.isInteger(value) || value < 2) return false;
    if (value === 2) return true;
    if (value % 2 === 0) return false;
    for (let divisor = 3; divisor * divisor <= value; divisor += 2) {
      if (value % divisor === 0) return false;
    }
    return true;
  }

  function factorize(value) {
    if (!Number.isInteger(value) || value < 2) return [];
    const factors = [];
    let rest = value;
    for (let divisor = 2; divisor * divisor <= rest; divisor += divisor === 2 ? 1 : 2) {
      let exponent = 0;
      while (rest % divisor === 0) {
        exponent += 1;
        rest /= divisor;
      }
      if (exponent) factors.push(Object.freeze([divisor, exponent]));
    }
    if (rest > 1) factors.push(Object.freeze([rest, 1]));
    return factors;
  }

  function formatFactors(value) {
    if (value === 0) return "0";
    if (value === 1) return "1";
    return factorize(value).map(([base, exponent]) => exponent === 1 ? String(base) : `${base}^${exponent}`).join("×");
  }

  function phaseAddress(value) {
    const bits = toBinary(value);
    const quadrant = value >> LOCAL_BITS;
    const local = value & (LOCAL_STATE_COUNT - 1);
    return Object.freeze({
      value,
      bits,
      outerBits: bits.slice(0, PHASE_BITS - LOCAL_BITS),
      localBits: bits.slice(PHASE_BITS - LOCAL_BITS),
      quadrant,
      local,
      prime: isPrime(value),
      powerOfTwo: value > 0 && (value & (value - 1)) === 0,
      factors: formatFactors(value)
    });
  }

  function phaseStates() {
    return Object.freeze(Array.from({ length: PHASE_STATE_COUNT }, (_, value) => phaseAddress(value)));
  }

  function hammingDistance(left, right) {
    let difference = left ^ right;
    let distance = 0;
    while (difference) {
      distance += difference & 1;
      difference >>>= 1;
    }
    return distance;
  }

  function bitComplement(value, width = PHASE_BITS) {
    toBinary(value, width);
    return ((2 ** width) - 1) ^ value;
  }

  function counterAxis() {
    const [lower, upper] = COUNTER_AXIS_PAIR;
    const mask = PHASE_STATE_COUNT - 1;
    return Object.freeze({
      lower: phaseAddress(lower),
      upper: phaseAddress(upper),
      mask,
      xor: lower ^ upper,
      sum: lower + upper,
      hamming: hammingDistance(lower, upper),
      complement: bitComplement(lower),
      balancedAxis: 16 + 19,
      balancedMirror: 17 + 18,
      still: 20,
      liftedAxis: 16 + 19 + 20,
      romanTyped: "V × XI = LV"
    });
  }

  function pulseRoute(values = APERTURE_PULSE) {
    const route = values.map((value) => phaseAddress(value));
    const transitions = route.slice(1).map((address, index) => Object.freeze({
      from: route[index].value,
      to: address.value,
      xor: route[index].value ^ address.value,
      hamming: hammingDistance(route[index].value, address.value)
    }));
    return Object.freeze({
      route: Object.freeze(route),
      transitions: Object.freeze(transitions),
      totalHamming: transitions.reduce((sum, transition) => sum + transition.hamming, 0),
      returnsToStill: route.at(-1).value === 20
    });
  }

  function evaluate() {
    const angles = triangleAngles([16, 17, 19]);
    const rectangleArea = distance(POINTS[16], POINTS[17]) * distance(POINTS[17], POINTS[19]);
    const triangleAreaA = triangleArea(POINTS[16], POINTS[17], POINTS[19]);
    const triangleAreaB = triangleArea(POINTS[16], POINTS[18], POINTS[19]);
    const states = phaseStates();
    const primes = states.filter((state) => state.prime).map((state) => state.value);
    return Object.freeze({
      triple: 16 + 17 + 19,
      factor: 4 * 13,
      outer: 16 + 17 + 18 + 19,
      all: 16 + 17 + 18 + 19 + 20,
      angles,
      angleSum: angles.reduce((sum, value) => sum + value, 0),
      rightAngle: angles[1],
      rectangleArea,
      triangleAreaA,
      triangleAreaB,
      phi: PHI,
      phiFrom18: 1 / (2 * Math.sin(Math.PI / 10)),
      phiFrom36: 2 * Math.cos(Math.PI / 5),
      negativeRatio: 52 / 18,
      division4311: Object.freeze({ dividend: 4, divisor: 3, quotient: 1, remainder: 1 }),
      d3Forward: Object.freeze(["753", "537", "375"]),
      d3Reverse: Object.freeze(["357", "573", "735"]),
      phaseSpace: Object.freeze({
        bits: PHASE_BITS,
        count: PHASE_STATE_COUNT,
        outerBits: PHASE_BITS - LOCAL_BITS,
        outerCount: PHASE_STATE_COUNT / LOCAL_STATE_COUNT,
        localBits: LOCAL_BITS,
        localCount: LOCAL_STATE_COUNT,
        tetrationReading: 2 ** (2 ** 2),
        squaredSquareReading: (2 ** 2) ** 2,
        states,
        primes: Object.freeze(primes),
        primeCount: primes.length,
        cockpitBand: Object.freeze([16, 17, 18, 19, 20].map(phaseAddress)),
        pulse: pulseRoute(),
        counterAxis: counterAxis(),
        lamellaHexagon: lamellaHexagon(),
        jalousieRegister: jalousieRegister(),
        qrtObject: qrtObject(),
        lcMotion: lcMotion(),
        cubeWobble: cubeWobble(),
        raThBridge: raThBridge()
      })
    });
  }

  const RATH_TOUR_STEPS = Object.freeze([
    Object.freeze({ phase: 0, focus: "pivot", title: "1. RA / TH · zwei Rollen", copy: "RA bleibt die lokale Return-Achse; TH bleibt der vorhandene T_β-Alias. Die gemeinsame Ansicht setzt beide Rollen nicht gleich." }),
    Object.freeze({ phase: 72, focus: "typed-t", title: "2. Taumelndes T · typisierte Übergabe", copy: "Die Gegenrotation bewegt das T als Display-Handoff. Sie erzeugt weder einen neuen Carrier noch eine Körperphysik." }),
    Object.freeze({ phase: 144, focus: "tesa", title: "3. TESA · vorhandenes 3:2-Fenster", copy: "Das T übergibt an den bestehenden A0TesaLissajousWindowRouter mit δ=π/2; das große TESA-Modul bleibt die Quelle." }),
    Object.freeze({ phase: 216, focus: "drift", title: "4. Z365 · V-Lücke und IOTA 0,5", copy: "θ(k)=360°·k/365. Δk=5 ergibt 4,932° V-Lücke; IOTA 0,5 bleibt der getrennte Halbschritt von 0,493°." }),
    Object.freeze({ phase: 288, focus: "rec", title: "5. REC · R und D bleiben getrennt", copy: "REC hält die Quelladresse während der Ansicht. R→D→R ist ein typisierter Rückweg und keine Gleichsetzung von R und D." }),
    Object.freeze({ phase: 0, focus: "return", title: "6. Exact Return · zurück zu RA", copy: "Die Phase, die V-Naht und der Receipt kehren gemeinsam auf den deklarierten Start zurück; Quelle und Identität bleiben unverändert.", returned: true })
  ]);

  const VIEWS = Object.freeze({
    factor: Object.freeze({ label: "52 / 18", status: "EXACT · 16 + 17 + 19 = 52 = 4·13 · HOLDOUT 18 · 52/18 ≠ φ,π" }),
    pi: Object.freeze({ label: "π TRIANGLE", status: "EXACT · ∠16 + ∠17 + ∠19 = π · ∠17 = 90° · TWO CONGRUENT HALF-RECTANGLES" }),
    phi: Object.freeze({ label: "18° / φ", status: "EXACT · φ = 1/(2 sin 18°) = 2 cos 36° · INTEGER 18 ≠ φ" }),
    address: Object.freeze({ label: "D3 ADDRESS", status: "TYPED VIEW · 4 = 3·1 + 1 · 753→537→375 · REVERSE ORIENTATION 357→573→735" }),
    phase: Object.freeze({ label: "2⁶ SPACE", status: "EXACT FINITE REGISTER · 64 = 2⁶ = 2²×2⁴ · FOUR QUADRANTS × SIXTEEN LOCAL STATES · PRIMES ARE MARKED ADDRESSES" }),
    axis: Object.freeze({ label: "8 ↔ 55 AXIS", status: "EXACT COUNTER AXIS · 8=001000₂ ↔ 55=110111₂ · XOR=63 · 35+20=55 · 55=5·11 · V×XI=LV" }),
    lamella: Object.freeze({ label: "HEX / L / HINGE", status: "EXACT PLANAR PARTITION · HEXAGON = 3 RHOMBI = 6 EQUILATERAL TRIANGLES · THREE 120° SEAMS · 3×7 LAMELLAE · 8 INTERVALS · DOUBLE ROUTE" }),
    jalousie: Object.freeze({ label: "JALOUSIE 18 / 19", status: "BOUNDED DISPLAY REGISTER · 18 INTERIOR BLACK PINS + TWO FRAME EDGES = 19 GAPS · LEFT AXIS VISIBLE · MA · PA · S · T · A ARE LOCAL POSITION MARKERS" }),
    object: Object.freeze({ label: "QRT / T_Y / T_β", status: "EXACT OBJECT SPLIT · QRT AFFINE SQUARE→RHOMBUS · T_Y/BO + T_β/TH · SHARED DIAGONAL · L7 · PHANTOM TINES ADD ZERO FACES" }),
    motion: Object.freeze({ label: "L_c / Θ · Ζ · Λ", status: "KINEMATIC DISPLAY · FIXED 120° BÜGEL · Θ PHASE DRIVER · Ζ CHORD MIDPOINT · Λ RETURN ENDPOINT · EXACT RETURN AFTER ONE TURN" }),
    wobble: Object.freeze({ label: "EDELWEISS / 3-FACE WOBBLE", status: "AFFINE THREE-RHOMBUS DISPLAY · NLK / L-SHELL · 1:2:3 PHASE PATH · L-SEAM ATTACHED · NO CUBE-BODY CLAIM · EXACT RETURN AFTER ONE TURN" }),
    rath: Object.freeze({ label: "RA / TH BRIDGE", status: "TYPED DISPLAY HANDOFF · TWIN-STICK PIVOT → WOBBLING T → EXISTING TESA 3:2 WINDOW · Z365 V-GAP + IOTA 0.5 DISPLAY DRIFT → REC → RA · R/D ROLES STAY SEPARATE · NO NEW IDENTITY OR RELATION" })
  });

  function mount(scope) {
    const lens = (scope || document).querySelector("[data-triangle-phi-lens]");
    if (!lens) return null;
    const wobbleTemplate = lens.querySelector("[data-tpl-wobble-template]");
    const buttonTray = lens.querySelector(".tpl-buttons");
    const side = lens.querySelector(".tpl-side");
    const figureSvg = lens.querySelector(".tpl-figure svg");
    if (figureSvg && !lens.querySelector(".tpl-jalousie-layer")) {
      const svgNamespace = "http://www.w3.org/2000/svg";
      const group = document.createElementNS(svgNamespace, "g");
      group.setAttribute("class", "tpl-jalousie-layer");
      group.setAttribute("aria-label", "Jalousie register with left axis, eighteen interior black pins and nineteen gaps");
      const pins = Array.from({ length: 18 }, (_, index) => `<path data-jalousie-pin d="M154 ${122 + index * 14}H360"/>`).join("");
      const tokens = jalousieRegister().tokens.map((token, index) => `<text x="410" y="${150 + index * 48}">${token}</text>`).join("");
      group.innerHTML = `<rect class="tpl-jalousie-field" x="143" y="108" width="228" height="270" rx="8"/><path class="tpl-jalousie-axis" d="M118 86V402M108 108H128M108 378H128"/><rect class="tpl-jalousie-frame" x="143" y="108" width="228" height="270" rx="8"/><g class="tpl-jalousie-pins">${pins}</g><text class="tpl-jalousie-title" x="118" y="66">LEFT AXIS · 18 BLACK PINS · 19 GAPS</text><text class="tpl-jalousie-count" x="95" y="250" transform="rotate(-90 95 250)">A18 ↔ G19</text><path class="tpl-jalousie-marker-rail" d="M389 132V354"/><g class="tpl-jalousie-tokens" aria-label="Local position markers MA PA S T A">${tokens}</g>`;
      figureSvg.appendChild(group);
    }
    if (figureSvg && !lens.querySelector(".tpl-rath-bridge")) {
      const svgNamespace = "http://www.w3.org/2000/svg";
      const group = document.createElementNS(svgNamespace, "g");
      group.setAttribute("class", "tpl-rath-bridge");
      group.setAttribute("aria-label", "RA TH bridge from counter-rotating twin sticks through a wobbling typed T into the existing TESA Lissajous window");
      group.innerHTML = `<text class="tpl-rath-title" x="350" y="42" text-anchor="middle">RA / TH · TWIN STICKS → T → TESA → REC</text><line class="tpl-rath-axis" x1="350" y1="65" x2="350" y2="445"/><g data-tpl-rath-stick-left><line class="tpl-rath-stick left" x1="350" y1="160" x2="350" y2="58"/></g><g data-tpl-rath-stick-right><line class="tpl-rath-stick right" x1="350" y1="160" x2="350" y2="58"/></g><circle class="tpl-rath-pivot" cx="350" cy="160" r="10"/><text class="tpl-rath-role ra" x="208" y="112">RA · RETURN AXIS</text><text class="tpl-rath-role th" x="492" y="112">TH · T_β ALIAS</text><rect class="tpl-rath-window" x="175" y="272" width="350" height="44" rx="4"/><g data-tpl-rath-t><path class="tpl-rath-typed-t" d="M305 218H395M350 218V286"/><text class="tpl-rath-t-label" x="405" y="231">T · TYPED HANDOFF</text></g><circle class="tpl-rath-sphere" cx="350" cy="358" r="104"/><path class="tpl-rath-lissajous" data-tpl-rath-lissajous/><g class="tpl-rath-rec" data-tpl-rath-rec><path d="M510 358H548"/><rect x="548" y="340" width="72" height="36" rx="18"/><text x="584" y="363" text-anchor="middle">REC</text><text class="tpl-rath-rd" x="584" y="394" text-anchor="middle">R → D → R</text></g><text class="tpl-rath-caption" x="350" y="456" text-anchor="middle">EXISTING TESA · 3:2 · δ=π/2 · REC HOLDS SOURCE · ONE-TURN RETURN</text>`;
      const driftGroup = document.createElementNS(svgNamespace, "g");
      driftGroup.setAttribute("class", "tpl-rath-v-gap");
      driftGroup.setAttribute("data-tpl-rath-v-gap", "");
      driftGroup.setAttribute("aria-label", "Z365 coordinate-view V gap with separate IOTA half-step marker");
      driftGroup.innerHTML = `<path d="M326 275L350 296L374 275"/><circle cx="350" cy="296" r="5"/><text x="350" y="324" text-anchor="middle">Z365 · Δk=5 · IOTA 0.5</text>`;
      group.appendChild(driftGroup);
      figureSvg.appendChild(group);
    }
    if (buttonTray && !lens.querySelector("[data-tpl-view=jalousie]")) {
      const jalousieButton = document.createElement("button");
      jalousieButton.type = "button";
      jalousieButton.dataset.tplView = "jalousie";
      jalousieButton.setAttribute("aria-pressed", "false");
      jalousieButton.textContent = "JALOUSIE 18 / 19";
      const objectButton = buttonTray.querySelector("[data-tpl-view=object]");
      buttonTray.insertBefore(jalousieButton, objectButton || null);
    }
    if (wobbleTemplate && buttonTray && side && !lens.querySelector("[data-tpl-view=wobble]")) {
      const fragment = wobbleTemplate.content.cloneNode(true);
      const wobbleButton = fragment.querySelector("[data-tpl-view=wobble]");
      const wobbleCard = fragment.querySelector(".tpl-wobble-card");
      buttonTray.appendChild(wobbleButton);
      side.insertBefore(wobbleCard, side.querySelector("[data-tpl-status]"));
    }
    if (buttonTray && side && !lens.querySelector("[data-tpl-view=rath]")) {
      const bridgeButton = document.createElement("button");
      bridgeButton.type = "button";
      bridgeButton.dataset.tplView = "rath";
      bridgeButton.setAttribute("aria-pressed", "false");
      bridgeButton.textContent = "RA / TH BRIDGE";
      buttonTray.appendChild(bridgeButton);
      const bridgeCard = document.createElement("article");
      bridgeCard.className = "tpl-rath-card";
      bridgeCard.innerHTML = `<small>VISUAL 8 → VISUAL 10 · EXISTING BENCH REUSE</small><strong>TWIN STICKS · TAUMELNDES T · TESA 3:2 · REC</strong><label>PHASE <output data-tpl-rath-output>0° · 3:2 · REC</output><input data-tpl-rath-phase type="range" min="0" max="359" step="1" value="0" aria-label="RA TH bridge display phase"/></label><div><button type="button" data-tpl-rath-play aria-pressed="false">PLAY BRIDGE</button><button type="button" data-tpl-rath-return>EXACT RETURN</button></div><section class="tpl-rath-tour" aria-label="Geführte RA TH TESA REC Bridge Tour"><small>GEFÜHRTE BRIDGE TOUR · 6 SCHRITTE</small><b data-tpl-rath-tour-title>Achsen → T → TESA → Drift → REC → Return</b><span data-tpl-rath-tour-copy>Die Führung zeigt die vollständige Wirkung und hält alle Rollen typisiert.</span><div><button type="button" data-tpl-rath-tour-auto aria-pressed="false">▶ TOUR STARTEN</button><button type="button" data-tpl-rath-tour-next>WEITER →</button><button type="button" data-tpl-rath-tour-pause disabled>PAUSE</button></div><em data-tpl-rath-tour-progress>0 / 6 · BEREIT</em></section><nav aria-label="Existing module handoffs"><a href="A0_ORIENTATION_CONTROLLER_BENCH.html#tesaLissajousWindowRouter">FULL TESA / WEIGHTS / FIGURES ↗</a><a href="A0_IOTA_BRIDGE_DEMONSTRATOR.html#module-entry">IOTA BRIDGE TOUR ↗</a></nav><p><code>RA</code> ist die lokale Return-Achse; <code>TH</code> bleibt der bestehende Alias von <code>T_β</code>. Das taumelnde <code>T</code> übergibt typisiert an den vorhandenen <code>A0TesaLissajousWindowRouter</code>; <code>REC</code> belegt danach <code>R → D → R</code>, ohne R und D gleichzusetzen. Die beiden Links öffnen die bestehenden vollständigen Module — keine verkleinerte Doppelimplementierung. Keine neue Identität, Relation oder Körperphysik.</p>`;
      bridgeCard.insertAdjacentHTML("beforeend", `<p class="tpl-rath-drift-note"><b>Z365 / V-GAP:</b> <code>θ(k)=360°·k/365</code> · <code>Δk=5</code> → <code>4,932°</code>. <code>IOTA 0,5</code> bleibt ein separater Halbschritt-Marker; weder Operatorgleichsetzung noch Quellenmutation.</p>`);
      side.insertBefore(bridgeCard, side.querySelector("[data-tpl-status]"));
    }
    const buttons = Array.from(lens.querySelectorAll("[data-tpl-view]"));
    const status = lens.querySelector("[data-tpl-status]");
    const value = lens.querySelector("[data-tpl-value]");
    const detail = lens.querySelector("[data-tpl-detail]");
    const phaseGrid = lens.querySelector("[data-tpl-phase-grid]");
    const phaseSelected = lens.querySelector("[data-tpl-phase-selected]");
    const phaseMeta = lens.querySelector("[data-tpl-phase-meta]");
    const lcPhase = lens.querySelector("[data-tpl-lc-phase]");
    const lcOutput = lens.querySelector("[data-tpl-lc-output]");
    const lcPlay = lens.querySelector("[data-tpl-lc-play]");
    const lcReturn = lens.querySelector("[data-tpl-lc-return]");
    const wobblePhase = lens.querySelector("[data-tpl-wobble-phase]");
    const wobbleOutput = lens.querySelector("[data-tpl-wobble-output]");
    const wobblePlay = lens.querySelector("[data-tpl-wobble-play]");
    const wobbleReturn = lens.querySelector("[data-tpl-wobble-return]");
    const wobbleGroup = lens.querySelector(".tpl-lamella-hex");
    const wobbleFaces = Array.from(lens.querySelectorAll("[data-tpl-wobble-face]"));
    const rathPhase = lens.querySelector("[data-tpl-rath-phase]");
    const rathOutput = lens.querySelector("[data-tpl-rath-output]");
    const rathPlay = lens.querySelector("[data-tpl-rath-play]");
    const rathReturn = lens.querySelector("[data-tpl-rath-return]");
    const rathTourAuto = lens.querySelector("[data-tpl-rath-tour-auto]");
    const rathTourNext = lens.querySelector("[data-tpl-rath-tour-next]");
    const rathTourPause = lens.querySelector("[data-tpl-rath-tour-pause]");
    const rathTourProgress = lens.querySelector("[data-tpl-rath-tour-progress]");
    const rathTourTitle = lens.querySelector("[data-tpl-rath-tour-title]");
    const rathTourCopy = lens.querySelector("[data-tpl-rath-tour-copy]");
    const result = evaluate();
    let lcFrame = null;
    let lcPreviousTime = null;
    let wobbleFrame = null;
    let wobblePreviousTime = null;
    let wobbleDegrees = 0;
    let rathFrame = null;
    let rathPreviousTime = null;
    let rathDegrees = 0;
    let rathTourTimer = null;
    let rathTourIndex = -1;

    function setPoint(selector, point) {
      const element = lens.querySelector(selector);
      if (!element) return;
      element.setAttribute("cx", point[0].toFixed(6));
      element.setAttribute("cy", point[1].toFixed(6));
    }

    function setLabel(selector, point, dx, dy) {
      const element = lens.querySelector(selector);
      if (!element) return;
      element.setAttribute("x", (point[0] + dx).toFixed(6));
      element.setAttribute("y", (point[1] + dy).toFixed(6));
    }

    function renderLc(degrees = 0) {
      const normalized = ((Number(degrees) % 360) + 360) % 360;
      const state = lcMotion(normalized / 360);
      const { theta, zeta, lambda } = state.points;
      const arc = lens.querySelector("[data-tpl-lc-arc]");
      const chord = lens.querySelector("[data-tpl-lc-chord]");
      const thetaRadius = lens.querySelector("[data-tpl-lc-theta-radius]");
      if (arc) arc.setAttribute("d", `M ${theta[0]} ${theta[1]} A ${state.radius} ${state.radius} 0 0 1 ${lambda[0]} ${lambda[1]}`);
      if (chord) {
        chord.setAttribute("x1", theta[0]); chord.setAttribute("y1", theta[1]);
        chord.setAttribute("x2", lambda[0]); chord.setAttribute("y2", lambda[1]);
      }
      if (thetaRadius) {
        thetaRadius.setAttribute("x1", state.center[0]); thetaRadius.setAttribute("y1", state.center[1]);
        thetaRadius.setAttribute("x2", theta[0]); thetaRadius.setAttribute("y2", theta[1]);
      }
      setPoint("[data-tpl-lc-theta]", theta);
      setPoint("[data-tpl-lc-zeta]", zeta);
      setPoint("[data-tpl-lc-lambda]", lambda);
      setLabel("[data-tpl-lc-theta-label]", theta, 12, -10);
      setLabel("[data-tpl-lc-zeta-label]", zeta, 12, -10);
      setLabel("[data-tpl-lc-lambda-label]", lambda, 12, 20);
      if (lcPhase) lcPhase.value = String(Math.round(normalized));
      if (lcOutput) lcOutput.textContent = `${Math.round(normalized)}°`;
      return state;
    }

    function stopLc() {
      if (lcFrame !== null && typeof cancelAnimationFrame === "function") cancelAnimationFrame(lcFrame);
      lcFrame = null;
      lcPreviousTime = null;
      if (lcPlay) {
        lcPlay.textContent = "PLAY";
        lcPlay.setAttribute("aria-pressed", "false");
      }
    }

    function renderWobble(degrees = 0) {
      const normalized = ((Number(degrees) % 360) + 360) % 360;
      const state = cubeWobble(normalized / 360);
      const [cx, cy] = state.center;
      if (wobbleGroup) wobbleGroup.setAttribute("transform", `translate(${cx} ${cy}) rotate(${state.rotationDegrees}) skewX(${state.shearDegrees}) scale(${state.scaleX} ${state.scaleY}) translate(${-cx} ${-cy})`);
      const faceVectors = [[-10,8],[0,-11],[10,8]];
      wobbleFaces.forEach((face,index)=>{const channel=state.channels[index]||0,[dx,dy]=faceVectors[index];face.setAttribute("transform",`translate(${(dx*channel).toFixed(4)} ${(dy*channel).toFixed(4)}) rotate(${(channel*3).toFixed(4)} 350 240)`)});
      wobbleDegrees = normalized;
      if (wobblePhase) wobblePhase.value = String(Math.round(normalized));
      if (wobbleOutput) wobbleOutput.textContent = `${Math.round(normalized)}° · ${state.frequencyRatio.join(":")}`;
      return state;
    }

    function stopWobble() {
      if (wobbleFrame !== null && typeof cancelAnimationFrame === "function") cancelAnimationFrame(wobbleFrame);
      wobbleFrame = null;
      wobblePreviousTime = null;
      if (wobblePlay) {
        wobblePlay.textContent = "PLAY";
        wobblePlay.setAttribute("aria-pressed", "false");
      }
    }

    function animateWobble(time) {
      if (wobblePreviousTime === null) wobblePreviousTime = time;
      const elapsed = Math.min(100, time - wobblePreviousTime);
      wobblePreviousTime = time;
      renderWobble(advanceWobbleDegrees(wobbleDegrees,elapsed));
      wobbleFrame = requestAnimationFrame(animateWobble);
    }

    function renderRaTh(degrees = 0) {
      const normalized = ((Number(degrees) % 360) + 360) % 360;
      const state = raThBridge(normalized / 360);
      const left = lens.querySelector("[data-tpl-rath-stick-left]");
      const right = lens.querySelector("[data-tpl-rath-stick-right]");
      const typedT = lens.querySelector("[data-tpl-rath-t]");
      const path = lens.querySelector("[data-tpl-rath-lissajous]");
      const vGap = lens.querySelector("[data-tpl-rath-v-gap]");
      if (left) left.setAttribute("transform", `rotate(${state.twinSticks.leftDegrees} 350 160)`);
      if (right) right.setAttribute("transform", `rotate(${state.twinSticks.rightDegrees} 350 160)`);
      if (typedT) typedT.setAttribute("transform", `translate(${state.typedT.x - 350} ${state.typedT.y - 235}) rotate(${state.typedT.rotationDegrees} 350 235)`);
      if (path) path.setAttribute("d", state.tesaWindow.path.map((point, index) => `${index ? "L" : "M"}${point[0].toFixed(3)} ${point[1].toFixed(3)}`).join(" "));
      if (vGap) vGap.setAttribute("transform", `rotate(${state.tesaWindow.iotaDrift.markerDegrees.toFixed(6)} 350 358)`);
      rathDegrees = normalized;
      if (rathPhase) rathPhase.value = String(Math.round(normalized));
      if (rathOutput) rathOutput.textContent = `${Math.round(normalized)}° · 3:2 · ${state.rec.state === "EXACT_RETURN" ? "REC" : "HOLD"}`;
      const rec = lens.querySelector("[data-tpl-rath-rec]");
      if (rec) rec.setAttribute("data-state", state.rec.state.toLowerCase());
      return state;
    }

    function stopRaTh() {
      if (rathFrame !== null && typeof cancelAnimationFrame === "function") cancelAnimationFrame(rathFrame);
      rathFrame = null;
      rathPreviousTime = null;
      if (rathPlay) {
        rathPlay.textContent = "PLAY BRIDGE";
        rathPlay.setAttribute("aria-pressed", "false");
      }
    }

    function stopRaThTour(clearFocus = false) {
      if (rathTourTimer !== null) clearTimeout(rathTourTimer);
      rathTourTimer = null;
      if (rathTourPause) rathTourPause.disabled = true;
      if (rathTourAuto) rathTourAuto.setAttribute("aria-pressed", "false");
      if (clearFocus) delete lens.dataset.rathTourFocus;
    }

    function showRaThTourStep(index) {
      rathTourIndex = ((Number(index) % RATH_TOUR_STEPS.length) + RATH_TOUR_STEPS.length) % RATH_TOUR_STEPS.length;
      const step = RATH_TOUR_STEPS[rathTourIndex];
      stopRaTh();
      select("rath");
      renderRaTh(step.phase);
      lens.dataset.rathTourFocus = step.focus;
      if (rathTourTitle) rathTourTitle.textContent = step.title;
      if (rathTourCopy) rathTourCopy.textContent = step.copy;
      if (rathTourProgress) rathTourProgress.textContent = `${rathTourIndex + 1} / ${RATH_TOUR_STEPS.length} · ${step.returned ? "EXACT RETURN" : "TOUR"}`;
      status.textContent = step.returned ? "PASS · BRIDGE TOUR · EXACT RA/TH → TESA → REC → RA RETURN" : `TOUR · ${step.title}`;
      return step;
    }

    function runRaThTour() {
      stopRaThTour();
      showRaThTourStep(0);
      if (rathTourPause) rathTourPause.disabled = false;
      if (rathTourAuto) rathTourAuto.setAttribute("aria-pressed", "true");
      const tick = () => {
        if (rathTourIndex >= RATH_TOUR_STEPS.length - 1) {
          stopRaThTour();
          return;
        }
        showRaThTourStep(rathTourIndex + 1);
        rathTourTimer = setTimeout(tick, 1500);
      };
      rathTourTimer = setTimeout(tick, 1500);
      return { steps: RATH_TOUR_STEPS.length, exactReturn: true };
    }

    function animateRaTh(time) {
      if (rathPreviousTime === null) rathPreviousTime = time;
      const elapsed = Math.min(100, time - rathPreviousTime);
      rathPreviousTime = time;
      renderRaTh(advanceWobbleDegrees(rathDegrees, elapsed));
      rathFrame = requestAnimationFrame(animateRaTh);
    }

    function animateLc(time) {
      if (lcPreviousTime === null) lcPreviousTime = time;
      const elapsed = Math.min(100, time - lcPreviousTime);
      lcPreviousTime = time;
      renderLc(Number(lcPhase ? lcPhase.value : 0) + elapsed * 0.03);
      lcFrame = requestAnimationFrame(animateLc);
    }

    function selectPhaseAddress(addressOrValue) {
      const address = typeof addressOrValue === "number" ? phaseAddress(addressOrValue) : addressOrValue;
      if (phaseGrid) {
        phaseGrid.querySelectorAll("[data-phase-address]").forEach((button) => {
          button.setAttribute("aria-pressed", String(Number(button.dataset.phaseAddress) === address.value));
        });
      }
      if (phaseSelected) phaseSelected.textContent = `${address.value} · ${address.bits}`;
      if (phaseMeta) {
        const type = address.prime ? "PRIME ADDRESS" : address.powerOfTwo ? "POWER OF TWO" : address.value < 2 ? "UNIT / ZERO" : "COMPOSITE ADDRESS";
        phaseMeta.textContent = `Q${address.quadrant}:${address.local.toString().padStart(2, "0")} · ${address.outerBits}|${address.localBits} · ${type} · ${address.factors}`;
      }
      return address;
    }

    function renderPhaseGrid() {
      if (!phaseGrid || phaseGrid.children.length) return;
      for (let quadrant = 0; quadrant < result.phaseSpace.outerCount; quadrant += 1) {
        const group = document.createElement("section");
        group.className = "tpl-phase-quadrant";
        group.innerHTML = `<header><b>Q${quadrant}</b><small>${toBinary(quadrant, 2)} · 2⁴ LOCAL</small></header><div></div>`;
        const cells = group.querySelector("div");
        result.phaseSpace.states.slice(quadrant * LOCAL_STATE_COUNT, (quadrant + 1) * LOCAL_STATE_COUNT).forEach((address) => {
          const button = document.createElement("button");
          button.type = "button";
          button.dataset.phaseAddress = String(address.value);
          button.className = `${address.prime ? "is-prime" : ""} ${address.powerOfTwo ? "is-power" : ""} ${address.value >= 16 && address.value <= 20 ? "is-cockpit" : ""} ${COUNTER_AXIS_PAIR.includes(address.value) ? "is-counter-axis" : ""}`.trim();
          button.setAttribute("aria-label", `State ${address.value}, binary ${address.bits}${address.prime ? ", prime" : ""}`);
          button.setAttribute("aria-pressed", "false");
          button.innerHTML = `<span>${address.value}</span><small>${address.localBits}</small>`;
          button.addEventListener("click", () => selectPhaseAddress(address));
          cells.appendChild(button);
        });
        phaseGrid.appendChild(group);
      }
      selectPhaseAddress(16);
    }

    function select(name) {
      const view = VIEWS[name] || VIEWS.factor;
      lens.dataset.view = name in VIEWS ? name : "factor";
      buttons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.tplView === lens.dataset.view)));
      status.textContent = view.status;
      if (lens.dataset.view === "pi") {
        value.textContent = "π";
        detail.textContent = `Winkelsumme ${result.angleSum.toFixed(12)} rad · rechter Winkel ${(result.rightAngle * 180 / Math.PI).toFixed(0)}°`;
      } else if (lens.dataset.view === "phi") {
        value.textContent = "φ";
        detail.textContent = `φ=${result.phi.toFixed(12)} · 18°-Identität Δ=${Math.abs(result.phi-result.phiFrom18).toExponential(1)}`;
      } else if (lens.dataset.view === "address") {
        value.textContent = "4:3:1:1";
        detail.textContent = `${result.d3Forward.join(" → ")} · ${result.d3Reverse.join(" → ")}`;
      } else if (lens.dataset.view === "phase") {
        value.textContent = "2⁶";
        detail.textContent = `64=2²×2⁴ · ${result.phaseSpace.primeCount} prime addresses · pulse Hamming=${result.phaseSpace.pulse.totalHamming}`;
        renderPhaseGrid();
      } else if (lens.dataset.view === "axis") {
        value.textContent = "55";
        detail.textContent = "8↔55 · 001000↔110111 · 35+20=55 · 5×11 · V×XI=LV";
        renderPhaseGrid();
        selectPhaseAddress(55);
      } else if (lens.dataset.view === "lamella") {
        value.textContent = "3◇ / 7| / 8";
        detail.textContent = "3 rhombi · 6 triangles · 3×7 lamellae · 8 intervals · L 16→17→19 · hinge 16→20→19";
      } else if (lens.dataset.view === "jalousie") {
        value.textContent = "18 PINS / 19 GAPS";
        detail.textContent = "left axis · bounded frame · black interior tines · MA · PA · S · T · A local position markers";
      } else if (lens.dataset.view === "object") {
        value.textContent = "QRT = T_Y + T_β";
        detail.textContent = "BO · TH · affine square→rhombus · shared diagonal · L7 · phantom face count 0";
      } else if (lens.dataset.view === "motion") {
        value.textContent = "L_c · 120°";
        detail.textContent = "Θ yellow phase · Ζ blue chord midpoint · Λ grey/white return · rigid rotation · exact one-turn closure";
        renderLc(Number(lcPhase ? lcPhase.value : 0));
      } else if (lens.dataset.view === "wobble") {
        value.textContent = "NLK / L-SHELL";
        detail.textContent = "Edelweiss / three-face display · 1:2:3 phase path · violet L-seam attached · 3 rhombi / 6 triangles / 21 lamellae · no cube-body claim · exact return";
        renderWobble(Number(wobblePhase ? wobblePhase.value : 0));
      } else if (lens.dataset.view === "rath") {
        value.textContent = "RA → TH → T → TESA → REC → RA";
        detail.textContent = "twin-stick pivot · wobbling typed T · existing TESA/Lissajous 3:2 window · Z365 view θ(k)=360°k/365 · Δk=5 V-gap · IOTA half-step 0.5 · exact return";
        renderRaTh(Number(rathPhase ? rathPhase.value : 0));
      } else {
        value.textContent = "52";
        detail.textContent = `4·13 · +18=70 · +20=90 · 52/18=${result.negativeRatio.toFixed(6)}`;
      }
      return lens.dataset.view;
    }

    buttons.forEach((button) => button.addEventListener("click", () => select(button.dataset.tplView)));
    lens.querySelectorAll("[data-tpl-phase-jump]").forEach((button) => {
      button.addEventListener("click", () => {
        select("axis");
        selectPhaseAddress(Number(button.dataset.tplPhaseJump));
      });
    });
    if (lcPhase) lcPhase.addEventListener("input", () => {
      stopLc();
      select("motion");
      renderLc(Number(lcPhase.value));
    });
    if (lcPlay) lcPlay.addEventListener("click", () => {
      select("motion");
      if (lcFrame !== null) {
        stopLc();
      } else if (typeof requestAnimationFrame === "function") {
        lcPlay.textContent = "PAUSE";
        lcPlay.setAttribute("aria-pressed", "true");
        lcFrame = requestAnimationFrame(animateLc);
      }
    });
    if (lcReturn) lcReturn.addEventListener("click", () => {
      stopLc();
      select("motion");
      renderLc(0);
      status.textContent += " · EXACT ONE-TURN RETURN";
    });
    if (wobblePhase) wobblePhase.addEventListener("input", () => {
      stopWobble();
      select("wobble");
      renderWobble(Number(wobblePhase.value));
    });
    if (wobblePlay) wobblePlay.addEventListener("click", () => {
      select("wobble");
      if (wobbleFrame !== null) {
        stopWobble();
      } else if (typeof requestAnimationFrame === "function") {
        wobblePlay.textContent = "PAUSE";
        wobblePlay.setAttribute("aria-pressed", "true");
        wobbleFrame = requestAnimationFrame(animateWobble);
      }
    });
    if (wobbleReturn) wobbleReturn.addEventListener("click", () => {
      stopWobble();
      select("wobble");
      renderWobble(0);
      status.textContent += " · EXACT EDELWEISS / NLK-L-SHELL RETURN";
    });
    if (rathPhase) rathPhase.addEventListener("input", () => {
      stopRaThTour(true);
      stopRaTh();
      select("rath");
      renderRaTh(Number(rathPhase.value));
    });
    if (rathPlay) rathPlay.addEventListener("click", () => {
      stopRaThTour(true);
      select("rath");
      if (rathFrame !== null) {
        stopRaTh();
      } else if (typeof requestAnimationFrame === "function") {
        rathPlay.textContent = "PAUSE BRIDGE";
        rathPlay.setAttribute("aria-pressed", "true");
        rathFrame = requestAnimationFrame(animateRaTh);
      }
    });
    if (rathReturn) rathReturn.addEventListener("click", () => {
      stopRaThTour(true);
      stopRaTh();
      select("rath");
      renderRaTh(0);
      status.textContent += " · EXACT RA/TH → TESA RETURN";
    });
    if (rathTourAuto) rathTourAuto.addEventListener("click", runRaThTour);
    if (rathTourNext) rathTourNext.addEventListener("click", () => {
      stopRaThTour();
      showRaThTourStep(rathTourIndex + 1);
    });
    if (rathTourPause) rathTourPause.addEventListener("click", () => {
      stopRaThTour();
      if (rathTourProgress) rathTourProgress.textContent = `${Math.max(0, rathTourIndex + 1)} / ${RATH_TOUR_STEPS.length} · PAUSE`;
    });
    const reset = lens.querySelector("[data-tpl-reset]");
    if (reset) reset.addEventListener("click", () => {
      stopLc();
      stopWobble();
      stopRaTh();
      stopRaThTour(true);
      renderLc(0);
      renderWobble(0);
      renderRaTh(0);
      select("factor");
      status.textContent += " · EXACT INTERFACE RETURN";
    });
    renderPhaseGrid();
    renderLc(0);
    renderWobble(0);
    renderRaTh(0);
    select("factor");
    return { select, result, renderLc, stopLc, renderWobble, stopWobble, renderRaTh, stopRaTh, runRaThTour, showRaThTourStep, stopRaThTour };
  }

  return { PHI, PHASE_BITS, LOCAL_BITS, PHASE_STATE_COUNT, LOCAL_STATE_COUNT, APERTURE_PULSE, COUNTER_AXIS_PAIR, LAMELLA_COUNT, LAMELLA_FAMILIES, HEX_CENTER, HEX_RADIUS, LC_CENTER, LC_RADIUS, LC_OPENING_DEGREES, POINTS, VIEWS, RATH_TOUR_STEPS, angleAt, triangleAngles, triangleArea, polygonArea, regularHexagon, lamellaHexagon, jalousieRegister, qrtObject, lcMotion, cubeWobble, raThBridge, advanceWobbleDegrees, rotate, toBinary, isPrime, factorize, formatFactors, phaseAddress, phaseStates, hammingDistance, bitComplement, counterAxis, pulseRoute, evaluate, mount };
});
