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
        qrtObject: qrtObject(),
        lcMotion: lcMotion(),
        cubeWobble: cubeWobble()
      })
    });
  }

  const VIEWS = Object.freeze({
    factor: Object.freeze({ label: "52 / 18", status: "EXACT · 16 + 17 + 19 = 52 = 4·13 · HOLDOUT 18 · 52/18 ≠ φ,π" }),
    pi: Object.freeze({ label: "π TRIANGLE", status: "EXACT · ∠16 + ∠17 + ∠19 = π · ∠17 = 90° · TWO CONGRUENT HALF-RECTANGLES" }),
    phi: Object.freeze({ label: "18° / φ", status: "EXACT · φ = 1/(2 sin 18°) = 2 cos 36° · INTEGER 18 ≠ φ" }),
    address: Object.freeze({ label: "D3 ADDRESS", status: "TYPED VIEW · 4 = 3·1 + 1 · 753→537→375 · REVERSE ORIENTATION 357→573→735" }),
    phase: Object.freeze({ label: "2⁶ SPACE", status: "EXACT FINITE REGISTER · 64 = 2⁶ = 2²×2⁴ · FOUR QUADRANTS × SIXTEEN LOCAL STATES · PRIMES ARE MARKED ADDRESSES" }),
    axis: Object.freeze({ label: "8 ↔ 55 AXIS", status: "EXACT COUNTER AXIS · 8=001000₂ ↔ 55=110111₂ · XOR=63 · 35+20=55 · 55=5·11 · V×XI=LV" }),
    lamella: Object.freeze({ label: "HEX / L / HINGE", status: "EXACT PLANAR PARTITION · HEXAGON = 3 RHOMBI = 6 EQUILATERAL TRIANGLES · THREE 120° SEAMS · 3×7 LAMELLAE · 8 INTERVALS · DOUBLE ROUTE" }),
    object: Object.freeze({ label: "QRT / T_Y / T_β", status: "EXACT OBJECT SPLIT · QRT AFFINE SQUARE→RHOMBUS · T_Y/BO + T_β/TH · SHARED DIAGONAL · L7 · PHANTOM TINES ADD ZERO FACES" }),
    motion: Object.freeze({ label: "L_c / Θ · Ζ · Λ", status: "KINEMATIC DISPLAY · FIXED 120° BÜGEL · Θ PHASE DRIVER · Ζ CHORD MIDPOINT · Λ RETURN ENDPOINT · EXACT RETURN AFTER ONE TURN" }),
    wobble: Object.freeze({ label: "CUBE WOBBLE", status: "AFFINE DISPLAY WOBBLE · NLK / L-SHELL · 1:2:3 PHASE PATH · L-SEAM ATTACHED · EXACT RETURN AFTER ONE TURN" })
  });

  function mount(scope) {
    const lens = (scope || document).querySelector("[data-triangle-phi-lens]");
    if (!lens) return null;
    const wobbleTemplate = lens.querySelector("[data-tpl-wobble-template]");
    const buttonTray = lens.querySelector(".tpl-buttons");
    const side = lens.querySelector(".tpl-side");
    if (wobbleTemplate && buttonTray && side && !lens.querySelector("[data-tpl-view=wobble]")) {
      const fragment = wobbleTemplate.content.cloneNode(true);
      const wobbleButton = fragment.querySelector("[data-tpl-view=wobble]");
      const wobbleCard = fragment.querySelector(".tpl-wobble-card");
      buttonTray.appendChild(wobbleButton);
      side.insertBefore(wobbleCard, side.querySelector("[data-tpl-status]"));
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
    const result = evaluate();
    let lcFrame = null;
    let lcPreviousTime = null;
    let wobbleFrame = null;
    let wobblePreviousTime = null;

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
      renderWobble(Number(wobblePhase ? wobblePhase.value : 0) + elapsed * .025);
      wobbleFrame = requestAnimationFrame(animateWobble);
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
      } else if (lens.dataset.view === "object") {
        value.textContent = "QRT = T_Y + T_β";
        detail.textContent = "BO · TH · affine square→rhombus · shared diagonal · L7 · phantom face count 0";
      } else if (lens.dataset.view === "motion") {
        value.textContent = "L_c · 120°";
        detail.textContent = "Θ yellow phase · Ζ blue chord midpoint · Λ grey/white return · rigid rotation · exact one-turn closure";
        renderLc(Number(lcPhase ? lcPhase.value : 0));
      } else if (lens.dataset.view === "wobble") {
        value.textContent = "NLK / L-SHELL";
        detail.textContent = "cube display · 1:2:3 phase path · violet L-seam attached · 3 rhombi / 6 triangles / 21 lamellae · exact return";
        renderWobble(Number(wobblePhase ? wobblePhase.value : 0));
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
      status.textContent += " · EXACT NLK/L-SHELL RETURN";
    });
    const reset = lens.querySelector("[data-tpl-reset]");
    if (reset) reset.addEventListener("click", () => {
      stopLc();
      stopWobble();
      renderLc(0);
      renderWobble(0);
      select("factor");
      status.textContent += " · EXACT INTERFACE RETURN";
    });
    renderPhaseGrid();
    renderLc(0);
    renderWobble(0);
    select("factor");
    return { select, result, renderLc, stopLc, renderWobble, stopWobble };
  }

  return { PHI, PHASE_BITS, LOCAL_BITS, PHASE_STATE_COUNT, LOCAL_STATE_COUNT, APERTURE_PULSE, COUNTER_AXIS_PAIR, LAMELLA_COUNT, LAMELLA_FAMILIES, HEX_CENTER, HEX_RADIUS, LC_CENTER, LC_RADIUS, LC_OPENING_DEGREES, POINTS, VIEWS, angleAt, triangleAngles, triangleArea, polygonArea, regularHexagon, lamellaHexagon, qrtObject, lcMotion, cubeWobble, rotate, toBinary, isPrime, factorize, formatFactors, phaseAddress, phaseStates, hammingDistance, bitComplement, counterAxis, pulseRoute, evaluate, mount };
});
