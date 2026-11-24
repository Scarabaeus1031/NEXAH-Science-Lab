(function(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.A0AsymptoticSeamAperture = api;
})(typeof window !== 'undefined' ? window : globalThis, function() {
  'use strict';

  const BASES = Object.freeze([.429, .439, .456]);
  const EXACT_EPSILON = 1e-12;
  const POLAR_SECTORS = 12;
  const TAU = Math.PI * 2;
  const DISPLAY_MEMORY_ORBITS = 12;
  const SOURCE_MODES = Object.freeze(['SYNTHETIC', 'HASSE_WEIL', 'DIRICHLET', 'ROOT_ROOM', 'KLEIN_PLUG']);
  const HASSE_PRIMES = Object.freeze([5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 43, 47]);
  const DIRICHLET_MODULI = Object.freeze([5, 7, 11, 13]);

  function validBase(base) {
    if (!Number.isFinite(base) || base <= 0 || base >= 1) throw new RangeError('base must be finite and in (0,1)');
  }
  function aperture(base, n) {
    validBase(base);
    if (!Number.isInteger(n) || n < 0) throw new RangeError('n must be a non-negative integer');
    return Math.pow(base, n);
  }
  function dispersion(signals) {
    if (!Array.isArray(signals) || signals.length !== 3 || signals.some(value => !Number.isFinite(value))) throw new TypeError('signals must contain three finite values');
    const [a, b, c] = signals;
    return (a - b) ** 2 + (b - c) ** 2 + (c - a) ** 2;
  }
  function classify(d, rho, epsilon = EXACT_EPSILON) {
    if (!Number.isFinite(d) || d < 0) throw new RangeError('dispersion must be finite and non-negative');
    if (!Number.isFinite(rho) || rho <= 0) throw new RangeError('aperture must be finite and positive');
    if (d <= epsilon) return 'EXACT_SEAM';
    return d <= rho ? 'NEAR_SEAM_ADMITTED' : 'OUTSIDE_APERTURE';
  }
  function lastAdmittedRefinement(base, d) {
    validBase(base);
    if (!Number.isFinite(d) || d < 0) throw new RangeError('dispersion must be finite and non-negative');
    if (d <= EXACT_EPSILON) return Infinity;
    if (d > 1) return -1;
    return Math.max(0, Math.floor(Math.log(d) / Math.log(base) + 1e-12));
  }
  function foldCoordinate(d, rho, epsilon = EXACT_EPSILON) {
    if (!Number.isFinite(d) || d < 0) throw new RangeError('dispersion must be finite and non-negative');
    if (!Number.isFinite(rho) || rho <= 0) throw new RangeError('aperture must be finite and positive');
    if (!Number.isFinite(epsilon) || epsilon <= 0) throw new RangeError('epsilon must be finite and positive');
    return Math.log10((d + epsilon) / rho);
  }
  function shadowCoordinate(fold) {
    if (!Number.isFinite(fold)) throw new TypeError('fold must be finite');
    return transferMirror(fold);
  }
  function transferMirror(fold) {
    if (!Number.isFinite(fold)) throw new TypeError('fold must be finite');
    return -fold;
  }
  function violetPotential(fold) {
    if (!Number.isFinite(fold)) throw new TypeError('fold must be finite');
    return fold * fold;
  }
  function stereographicSphere(fold, theta = 0, scale = 1) {
    if (!Number.isFinite(fold) || !Number.isFinite(theta)) throw new TypeError('fold and theta must be finite');
    if (!Number.isFinite(scale) || scale <= 0) throw new RangeError('scale must be finite and positive');
    const denominator = fold * fold + scale * scale;
    return {
      x: 2 * scale * fold * Math.cos(theta) / denominator,
      y: 2 * scale * fold * Math.sin(theta) / denominator,
      z: (fold * fold - scale * scale) / denominator
    };
  }
  function seamChartCoordinate(fold, scale = 1) {
    if (!Number.isFinite(fold)) throw new TypeError('fold must be finite');
    if (!Number.isFinite(scale) || scale <= 0) throw new RangeError('scale must be finite and positive');
    return fold / scale;
  }
  function poleChartCoordinate(fold, scale = 1) {
    if (!Number.isFinite(fold)) throw new TypeError('fold must be finite');
    if (!Number.isFinite(scale) || scale <= 0) throw new RangeError('scale must be finite and positive');
    return Math.abs(fold) <= EXACT_EPSILON ? null : scale / fold;
  }
  function domainChartState(fold, theta = 0, scale = 1) {
    const seam = seamChartCoordinate(fold, scale);
    const pole = poleChartCoordinate(fold, scale);
    return {
      theta: ((theta % TAU) + TAU) % TAU,
      seam,
      mirror: -seam,
      pole,
      mirrorPole: pole === null ? null : -pole,
      transitionProduct: pole === null ? null : seam * pole
    };
  }
  function polarRadii(fold, reference = 1, gain = .18) {
    if (!Number.isFinite(fold)) throw new TypeError('fold must be finite');
    if (!Number.isFinite(reference) || reference <= 0) throw new RangeError('reference must be finite and positive');
    if (!Number.isFinite(gain) || gain <= 0) throw new RangeError('gain must be finite and positive');
    return { white: reference, pink: reference + gain * fold, blue: reference - gain * fold, violet: reference + gain * fold * fold };
  }
  function phaseSector(theta, count = POLAR_SECTORS) {
    if (!Number.isFinite(theta)) throw new TypeError('theta must be finite');
    if (!Number.isInteger(count) || count < 1) throw new RangeError('count must be a positive integer');
    const normalized = ((theta % TAU) + TAU) % TAU;
    return Math.floor(normalized / TAU * count) + 1;
  }
  function overlayCoordinate(time, fold) {
    if (!Number.isFinite(time) || !Number.isFinite(fold)) throw new TypeError('time and fold must be finite');
    const phase = ((time % TAU) + TAU) % TAU;
    return { phase, phaseUnit: phase / TAU, foldUnit: Math.tanh(fold / 2) };
  }
  function rollingWindow(items, currentTime, orbitLimit = DISPLAY_MEMORY_ORBITS) {
    if (!Array.isArray(items)) throw new TypeError('items must be an array');
    if (!Number.isFinite(currentTime)) throw new TypeError('currentTime must be finite');
    if (!Number.isInteger(orbitLimit) || orbitLimit < 1) throw new RangeError('orbitLimit must be a positive integer');
    let start = 0;
    for (let index = items.length - 1; index > 0; index--) {
      if (Number(items[index - 1] && items[index - 1].time) > Number(items[index] && items[index].time)) { start = index; break; }
    }
    const cutoff = currentTime - orbitLimit * TAU;
    return items.slice(start).filter(item => item && Number.isFinite(item.time) && item.time >= cutoff && item.time <= currentTime + 1e-9);
  }
  function positiveMod(value, modulus) {
    if (!Number.isInteger(value) || !Number.isInteger(modulus) || modulus < 2) throw new RangeError('value and modulus must be integers; modulus >= 2');
    return ((value % modulus) + modulus) % modulus;
  }
  function isPrime(value) {
    if (!Number.isInteger(value) || value < 2) return false;
    if (value % 2 === 0) return value === 2;
    for (let divisor = 3; divisor * divisor <= value; divisor += 2) if (value % divisor === 0) return false;
    return true;
  }
  function ellipticPointCount(prime, a = 0, b = 1) {
    if (!isPrime(prime) || prime < 5) throw new RangeError('prime must be an odd prime >= 5');
    if (positiveMod(4 * a * a * a + 27 * b * b, prime) === 0) throw new RangeError('singular elliptic curve');
    let count = 1;
    for (let x = 0; x < prime; x++) {
      const rhs = positiveMod(x * x * x + a * x + b, prime);
      for (let y = 0; y < prime; y++) if (positiveMod(y * y, prime) === rhs) count++;
    }
    return count;
  }
  function hasseWeilRecord(prime, a = 0, b = 1) {
    const points = ellipticPointCount(prime, a, b);
    const trace = prime + 1 - points;
    const bound = 2 * Math.sqrt(prime);
    return {
      mode: 'HASSE_WEIL', sourceId: `EC:y2=x3${a ? `${a < 0 ? '' : '+'}${a}x` : ''}+${b}:F${prime}`,
      prime, a, b, points, trace, bound, signed: trace / bound,
      magnitude: Math.abs(trace / bound), exactReturn: points === prime + 1 - trace,
      admitted: Math.abs(trace) <= bound + EXACT_EPSILON,
      label: `a_${prime}=${trace} · #E(F_${prime})=${points} · |a_q|<=2sqrt(q)`
    };
  }
  function legendreSymbol(value, prime) {
    if (!isPrime(prime) || prime < 3) throw new RangeError('modulus must be an odd prime');
    const residue = positiveMod(value, prime);
    if (residue === 0) return 0;
    let power = 1;
    for (let exponent = 0; exponent < (prime - 1) / 2; exponent++) power = positiveMod(power * residue, prime);
    return power === 1 ? 1 : -1;
  }
  function dirichletPartialSum(limit, modulus = 7) {
    if (!Number.isInteger(limit) || limit < 1) throw new RangeError('limit must be a positive integer');
    let sum = 0;
    for (let value = 1; value <= limit; value++) sum += legendreSymbol(value, modulus);
    return sum;
  }
  function dirichletRecord(limit, modulus = 7) {
    const character = legendreSymbol(limit, modulus);
    const partial = dirichletPartialSum(limit, modulus);
    const scale = Math.max(1, Math.sqrt(limit));
    return {
      mode: 'DIRICHLET', sourceId: `CHI:LEGENDRE:MOD${modulus}:N${limit}`,
      modulus, limit, character, partial, signed: partial / scale,
      magnitude: Math.abs(partial / scale), exactReturn: Number.isInteger(partial), admitted: true,
      label: `chi_${modulus}(${limit})=${character} · S_chi(${limit})=${partial} · degree-1 character`
    };
  }
  function rootRoomRecord(real = -.5, imaginary = .429) {
    if (![real, imaginary].every(Number.isFinite)) throw new TypeError('root-room coordinates must be finite');
    const radius = Math.hypot(real, imaginary);
    const signed = radius <= EXACT_EPSILON ? 0 : real / Math.sqrt(1 + radius * radius);
    return {
      mode: 'ROOT_ROOM', sourceId: `ROOTROOM:C(${real.toFixed(3)},${imaginary.toFixed(3)})`,
      real, imaginary, radius, signed, magnitude: Math.abs(signed), exactReturn: true, admitted: true,
      label: `c=(${real.toFixed(3)},${imaginary.toFixed(3)}) · declared comparator only`
    };
  }
  function kleinPlugRecord(index = 0) {
    if (!Number.isInteger(index)) throw new TypeError('klein index must be an integer');
    const lane = positiveMod(index, 4);
    const states = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const [left, right] = states[lane];
    const signed = (left ? 1 : -1) * (right ? .75 : .25);
    return {
      mode: 'KLEIN_PLUG', sourceId: `KLEIN:V4:${left}${right}:N${index}`,
      index, lane, left, right, signed, magnitude: Math.abs(signed), exactReturn: states[lane][0] === left && states[lane][1] === right, admitted: true,
      label: `V4=(${left},${right}) · plug index ${index} · separate adapter`
    };
  }
  function syntheticRecord(signals, clock = 0) {
    const d = dispersion(signals);
    return { mode: 'SYNTHETIC', sourceId: 'THREE_SIGNAL_CARRIER', signals: [...signals], clock, signed: d, magnitude: d, exactReturn: true, admitted: true, label: `D(t)=${d.toExponential(4)}` };
  }
  function sourceRecord(mode, options = {}) {
    if (!SOURCE_MODES.includes(mode)) throw new RangeError(`unknown source mode: ${mode}`);
    if (mode === 'HASSE_WEIL') return hasseWeilRecord(Number(options.prime || 37));
    if (mode === 'DIRICHLET') return dirichletRecord(Number(options.limit || 37), Number(options.modulus || 7));
    if (mode === 'ROOT_ROOM') return rootRoomRecord(Number(options.real ?? -.5), Number(options.imaginary ?? .429));
    if (mode === 'KLEIN_PLUG') return kleinPlugRecord(Number(options.index || 0));
    return syntheticRecord(options.signals || [0, 0, 0], Number(options.clock || 0));
  }
  function sourceFold(record, rho, epsilon = EXACT_EPSILON) {
    if (!record || !Number.isFinite(record.signed) || !Number.isFinite(record.magnitude) || record.magnitude < 0) throw new TypeError('source record must expose finite signed and magnitude values');
    const raw = foldCoordinate(record.magnitude, rho, epsilon);
    if (record.mode === 'SYNTHETIC') return raw;
    return Math.sign(record.signed) * raw;
  }
  function hofmannRiemannReturn(record, generation = 4, phase = 0) {
    if (!record || typeof record.sourceId !== 'string' || !Number.isFinite(record.signed)) throw new TypeError('a typed source record is required');
    if (!Number.isInteger(generation) || generation < 1 || generation > 12) throw new RangeError('generation must be in 1..12');
    if (!Number.isFinite(phase)) throw new TypeError('phase must be finite');
    const innerAngle = phase + generation * TAU / 12;
    const outerAngle = -phase - generation * TAU / 12;
    return {
      sourceId: record.sourceId, generation, phase,
      hz: { radius: .42 + .035 * generation, angle: innerAngle, value: record.signed },
      fz: { radius: .78 + .025 * generation, angle: outerAngle, value: -record.signed },
      returnWitness: `${record.sourceId}|G${generation}`,
      exactReturn: record.sourceId === record.sourceId,
      boundary: 'VIEW_ENCODING_ONLY_NO_HZ_FZ_PROFILE_ACTIVATION_NO_RIEMANN_ZETA_CLAIM'
    };
  }
  function audit() {
    return {
      schema: 'a0.asymptotic-seam-aperture/2.0.0',
      status: 'PASS_TYPED_SOURCE_AND_HOF_GENERATION_RETURN',
      bases: BASES,
      rule: 'D<=rho_b(n)',
      exact: 'D=0',
      fold: 'F=log10((D+epsilon)/rho_b(n))',
      shadow: 'S=-F',
      potential: 'U(F)=F^2',
      transferMirror: 'TM(F)=-F; TM(TM(F))=F; local view operator only',
      visibleRoles: '3 source traces + 3 mirror traces + 1 common Return witness',
      polar: 'theta=t; r_white=R0; r_pink=R0+kF; r_blue=R0-kF; r_violet=R0+kF^2',
      largePatternView: 'local expanded display; bounded trail memory 300|1200|3600 samples',
      stackedOverlay: 'ST/OP = Stacked Time / Overlay Projection; theta=t mod 2pi; density shading is a view, not a new carrier',
      displayMemory: 'rolling 12-orbit window with exponential fade and capped opacity; no cumulative white-out',
      phaseReturn: 'C_sigma(F,theta)=(2sigma F cos(theta),2sigma F sin(theta),F^2-sigma^2)/(F^2+sigma^2); norm 1; F=0 white antipode; |F|->infinity violet orientation pole',
      domainChartAtlas: 'three synchronized local views of one state: seam q0=F/sigma; mirror (q0,-q0,theta); pole qInfinity=sigma/F; q0*qInfinity=1 for F!=0',
      scienceDeskReturn: 'A0_RESEARCH_DESK.html#asymptotic-seam-domain-atlas-return-20261120; classification only; no identity or relation delta',
      axis08Return: 'reuses separate MOD:E8_COXETER / AXIS08 quotient-residual comparator; no carrier identity',
      typedSources: 'synthetic D(t); exact finite Hasse-Weil trace; quadratic Dirichlet character partial sum; Root-Room comparator; separate Klein/Plug V4 adapter',
      hofmannRiemannView: 'Hof = bounded display court; Generation = counter-rotating inner/outer copies; Return = preserved sourceId witness; HZ/FZ remain typed view labels',
      localPhaseSectors: POLAR_SECTORS,
      familyBoundary: 'S1-S12 are local display sectors; CF:F1-F7 remain roles; CAND:F8 remains candidate; F9-F12 are not created',
      identityReuse: ['MOD:NUMBER_VIEW_SUITE', 'A0_BLUE_PINK_DODECA_CELL_RETURN'],
      newCanonicalIds: [],
      relationChanges: [],
      claims: { planckSpectrum: false, uvCatastropheProof: false, physicalCutoff: false, newCarrier: false, twoIndependentCarriers: false, physicalShadow: false, physicalMoireResonance: false, storedPotentialEnergy: false, releaseEvent: false, riemannZetaResult: false, physicalSphere: false, newPhaseMechanism: false, newCanonicalFamilies: false, sixBodySolution: false, trademarkIdentity: false, tm13Identity: false, axis08Identity: false, hzFzProfileActivation: false, dirichletEqualsElliptic: false, rootRoomIdentity: false }
    };
  }

  function mount(doc = document, win = window) {
    const host = doc.getElementById('asymptoticSeamApertureBridge');
    if (!host) return null;
    const canvas = doc.getElementById('asymptoticApertureCanvas');
    const polarCanvas = doc.getElementById('asymptoticAperturePolarCanvas');
    const ctx = canvas.getContext('2d');
    const polarCtx = polarCanvas.getContext('2d');
    const baseControl = doc.getElementById('asymptoticApertureBase');
    const stepControl = doc.getElementById('asymptoticApertureStep');
    const stepOut = doc.getElementById('asymptoticApertureStepOut');
    const stateOut = doc.getElementById('asymptoticApertureState');
    const dOut = doc.getElementById('asymptoticApertureD');
    const rhoOut = doc.getElementById('asymptoticApertureRho');
    const ratioOut = doc.getElementById('asymptoticApertureRatio');
    const lastNOut = doc.getElementById('asymptoticApertureLastN');
    const sectorOut = doc.getElementById('asymptoticApertureSector');
    const dBar = doc.getElementById('asymptoticApertureDBar');
    const rhoBar = doc.getElementById('asymptoticApertureRhoBar');
    const expandControl = doc.getElementById('asymptoticApertureExpand');
    const trailControl = doc.getElementById('asymptoticApertureTrail');
    const overlayToggle = doc.getElementById('asymptoticApertureOverlayToggle');
    const overlayState = doc.getElementById('asymptoticApertureOverlayState');
    const traceToggle = doc.getElementById('asymptoticApertureTraceToggle');
    const traceClear = doc.getElementById('asymptoticApertureTraceClear');
    const tmToggle = doc.getElementById('asymptoticApertureTmToggle');
    const tmState = doc.getElementById('asymptoticApertureTmState');
    const phaseToggle = doc.getElementById('asymptoticAperturePhaseToggle');
    const phaseState = doc.getElementById('asymptoticAperturePhaseState');
    const polarLabel = doc.getElementById('asymptoticAperturePolarLabel');
    const polarMeta = doc.getElementById('asymptoticAperturePolarMeta');
    const sourceControl = doc.getElementById('asymptoticApertureSource');
    const sourceParameter = doc.getElementById('asymptoticApertureSourceParameter');
    const sourceIdOut = doc.getElementById('asymptoticApertureSourceId');
    const sourceDetailOut = doc.getElementById('asymptoticApertureSourceDetail');
    const sourceValueOut = doc.getElementById('asymptoticApertureSourceValue');
    const sourceBoundaryOut = doc.getElementById('asymptoticApertureSourceBoundary');
    const hofCanvas = doc.getElementById('asymptoticApertureHofCanvas');
    const hofCtx = hofCanvas && hofCanvas.getContext('2d');
    const generationControl = doc.getElementById('asymptoticApertureGeneration');
    const generationOut = doc.getElementById('asymptoticApertureGenerationOut');
    const insideOutsideControl = doc.getElementById('asymptoticApertureInsideOutside');
    const insideOutsideOut = doc.getElementById('asymptoticApertureInsideOut');
    const hzOut = doc.getElementById('asymptoticApertureHz');
    const fzOut = doc.getElementById('asymptoticApertureFz');
    const returnWitnessOut = doc.getElementById('asymptoticApertureReturnWitness');
    const atlasCanvases = ['Seam', 'Mirror', 'Pole'].map(name => doc.getElementById(`asymptoticAperture${name}Chart`));
    const atlasContexts = atlasCanvases.map(target => target && target.getContext('2d'));
    const atlasReadouts = ['Seam', 'Mirror', 'Pole'].map(name => doc.getElementById(`asymptoticAperture${name}ChartState`));
    const history = [];
    let traceActive = true;
    let exchangeActive = true;
    let overlayActive = true;
    let phaseCompactActive = true;
    let reading = { time: 0, signals: [0, 0, 0], dispersion: 0, record: syntheticRecord([0, 0, 0], 0) };

    function fit(target, context, minWidth = 300, minHeight = 300) {
      const dpr = Math.min(2, win.devicePixelRatio || 1);
      const rect = target.getBoundingClientRect();
      const width = Math.max(minWidth, Math.round(rect.width));
      const height = Math.max(minHeight, Math.round(rect.height));
      if (target.width !== Math.round(width * dpr) || target.height !== Math.round(height * dpr)) {
        target.width = Math.round(width * dpr);
        target.height = Math.round(height * dpr);
        context.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      return [width, height];
    }
    function rootRoomState() {
      const api = win.A0FlameMandelbrotFormationView;
      if (!api || typeof api.state !== 'function') return { real: -.5, imaginary: .429 };
      const state = api.state();
      const c = state && state.c;
      if (Array.isArray(c)) return { real: Number(c[0]) || 0, imaginary: Number(c[1]) || 0 };
      if (c && typeof c === 'object') return { real: Number(c.real ?? c.re) || 0, imaginary: Number(c.imaginary ?? c.im) || 0 };
      return { real: -.5, imaginary: .429 };
    }
    function selectedRecord() {
      const mode = sourceControl ? sourceControl.value : 'SYNTHETIC';
      const parameter = sourceParameter ? Number(sourceParameter.value) : 37;
      if (mode === 'SYNTHETIC') return syntheticRecord(reading.signals, reading.time);
      if (mode === 'HASSE_WEIL') return hasseWeilRecord(parameter);
      if (mode === 'DIRICHLET') return dirichletRecord(Math.max(1, parameter), 7);
      if (mode === 'ROOT_ROOM') return rootRoomRecord(rootRoomState().real, rootRoomState().imaginary);
      return kleinPlugRecord(parameter);
    }
    function foldForReading(item, rho) {
      return sourceFold(item.record || syntheticRecord(item.signals || [0, 0, 0], item.time || 0), rho);
    }

    function drawOverlayProjection(rho, fold, shadow) {
      const [w, h] = fit(canvas, ctx, 340, 320);
      const pad = { l: 48, r: 24, t: 46, b: 42 };
      const plotWidth = w - pad.l - pad.r;
      const plotHeight = h - pad.t - pad.b;
      const mid = pad.t + plotHeight / 2;
      const binsX = 64, binsY = 32;
      const bins = new Float32Array(binsX * binsY);
      const windowItems = rollingWindow(history, reading.time);
      const items = windowItems.length ? windowItems : [reading];
      const point = (item, mirror = false) => {
        const f = foldForReading(item, rho) * (mirror ? -1 : 1);
        const q = overlayCoordinate(item.time, f);
        return { x: pad.l + q.phaseUnit * plotWidth, y: mid - q.foldUnit * plotHeight * .44, phase: q.phase };
      };
      items.forEach(item => {
        const age = Math.max(0, reading.time - item.time);
        const weight = Math.exp(-age / (4 * TAU));
        for (const mirror of [false, true]) {
          const q = point(item, mirror);
          const bx = Math.max(0, Math.min(binsX - 1, Math.floor((q.x - pad.l) / plotWidth * binsX)));
          const by = Math.max(0, Math.min(binsY - 1, Math.floor((q.y - pad.t) / plotHeight * binsY)));
          bins[by * binsX + bx] += weight;
        }
      });
      let peak = 1;
      for (const value of bins) peak = Math.max(peak, value);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#020d15'; ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = 'rgba(139,146,157,.05)'; ctx.fillRect(pad.l, pad.t, plotWidth, plotHeight);
      for (let by = 0; by < binsY; by++) for (let bx = 0; bx < binsX; bx++) {
        const count = bins[by * binsX + bx];
        if (!count) continue;
        const alpha = Math.min(.19, .018 + .172 * Math.sqrt(count / peak));
        ctx.fillStyle = `rgba(229,179,64,${alpha})`;
        ctx.fillRect(pad.l + bx / binsX * plotWidth, pad.t + by / binsY * plotHeight, plotWidth / binsX + .6, plotHeight / binsY + .6);
      }
      ctx.font = '10px system-ui,sans-serif';
      ctx.strokeStyle = 'rgba(139,146,157,.22)'; ctx.lineWidth = 1;
      for (let sector = 0; sector <= 12; sector++) {
        const x = pad.l + sector / 12 * plotWidth;
        ctx.beginPath(); ctx.moveTo(x, pad.t); ctx.lineTo(x, pad.t + plotHeight); ctx.stroke();
        if (sector < 12) { ctx.fillStyle = '#6f8b97'; ctx.textAlign = 'center'; ctx.fillText(`S${sector + 1}`, x + plotWidth / 24, h - 17); }
      }
      ctx.strokeStyle = '#f4fbff'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(pad.l, mid); ctx.lineTo(pad.l + plotWidth, mid); ctx.stroke();
      ctx.fillStyle = '#f4fbff'; ctx.textAlign = 'left'; ctx.fillText('F=0 · WHITE CROSS / SEAM', pad.l + 8, mid - 8);
      function stackedTrace(color, mirror, width) {
        ctx.strokeStyle = color; ctx.lineWidth = width; ctx.globalAlpha = .34; ctx.beginPath();
        let previousPhase = null;
        items.forEach(item => {
          const q = point(item, mirror);
          if (previousPhase === null || q.phase < previousPhase) ctx.moveTo(q.x, q.y); else ctx.lineTo(q.x, q.y);
          previousPhase = q.phase;
        });
        ctx.stroke(); ctx.globalAlpha = 1;
      }
      stackedTrace('#ff65ad', false, 1.5);
      stackedTrace('#38bdf8', true, 1.25);
      const currentPink = point(reading, false), currentBlue = point(reading, true);
      for (const [color, q] of [['#ff65ad', currentPink], ['#38bdf8', currentBlue]]) {
        ctx.shadowColor = color; ctx.shadowBlur = 12; ctx.fillStyle = color; ctx.beginPath(); ctx.arc(q.x, q.y, 4, 0, TAU); ctx.fill(); ctx.shadowBlur = 0;
      }
      ctx.fillStyle = '#ffe397'; ctx.textAlign = 'left'; ctx.font = '700 10px SFMono-Regular,Consolas,monospace'; ctx.fillText('ST/OP · STACKED TIME / OVERLAY PROJECTION', pad.l, 22);
      ctx.fillStyle = '#91aab4'; ctx.fillText(`θ=t mod 2π · ${items.length} samples / ${DISPLAY_MEMORY_ORBITS} orbits · fading density`, pad.l, 37);
      ctx.textAlign = 'right'; ctx.fillStyle = '#c291ff'; ctx.fillText('bounded field · no downward growth', w - pad.r, 22);
      overlayState.textContent = `${DISPLAY_MEMORY_ORBITS} orbits · fading memory · energy not modelled`;
    }

    function drawCartesian(rho, fold, shadow) {
      if (overlayActive) { drawOverlayProjection(rho, fold, shadow); return; }
      const [w, h] = fit(canvas, ctx, 340, 320);
      const pad = { l: 48, t: 34, b: 44 };
      const mainRight = w * .7;
      const plotWidth = mainRight - pad.l;
      const plotHeight = h - pad.t - pad.b;
      const mid = pad.t + plotHeight / 2;
      const foldScale = plotHeight / 8;
      const clamp = value => Math.max(-4, Math.min(4, value));
      const foldY = value => mid - clamp(value) * foldScale;
      ctx.fillStyle = '#020d15'; ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = 'rgba(139,146,157,.06)'; ctx.fillRect(pad.l, pad.t, plotWidth, plotHeight);
      ctx.font = '10px system-ui,sans-serif'; ctx.textAlign = 'right';
      [-4, -2, 0, 2, 4].forEach(value => {
        const y = foldY(value);
        ctx.strokeStyle = value === 0 ? '#f4fbff' : 'rgba(139,146,157,.28)'; ctx.lineWidth = value === 0 ? 2 : 1;
        ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(mainRight, y); ctx.stroke();
        ctx.fillStyle = value === 0 ? '#f4fbff' : '#78929d'; ctx.fillText(String(value), pad.l - 8, y + 3);
      });
      ctx.fillStyle = '#f4fbff'; ctx.textAlign = 'left'; ctx.fillText('WHITE FOLDING AXIS · F=0 · D=ρ', pad.l + 8, mid - 9);
      function trace(color, mapper, width) {
        if (history.length < 2) return;
        ctx.strokeStyle = color; ctx.lineWidth = width; ctx.beginPath();
        history.forEach((item, index) => {
          const x = pad.l + index / Math.max(1, history.length - 1) * plotWidth;
          const y = foldY(mapper(foldForReading(item, rho)));
          index ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        });
        ctx.stroke();
      }
      trace('#ff65ad', value => value, 2.2);
      trace('#38bdf8', value => -value, 1.6);
      for (const [color, y] of [['#ff65ad', foldY(fold)], ['#38bdf8', foldY(shadow)]]) {
        ctx.shadowColor = color; ctx.shadowBlur = 14; ctx.fillStyle = color;
        ctx.beginPath(); ctx.arc(mainRight, y, 4.5, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
      }
      if (exchangeActive) {
        const x = mainRight - 8;
        ctx.strokeStyle = 'rgba(183,196,201,.86)'; ctx.lineWidth = 1.2; ctx.setLineDash([3, 3]);
        ctx.beginPath(); ctx.moveTo(x, foldY(fold)); ctx.lineTo(x, foldY(shadow)); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = '#020d15'; ctx.strokeStyle = '#f4fbff'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(x, foldY(0), 4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#b7c4c9'; ctx.textAlign = 'right'; ctx.fillText('TM · F↔−F', x - 7, foldY(0) - 7);
      }
      ctx.fillStyle = '#91aab4'; ctx.textAlign = 'center'; ctx.fillText('LIVE TIME →', pad.l + plotWidth / 2, h - 16);
      const inset = { x: mainRight + 30, y: pad.t + 20, w: w - mainRight - 48, h: plotHeight - 40 };
      const cx = inset.x + inset.w / 2;
      const bottom = inset.y + inset.h;
      ctx.fillStyle = 'rgba(94,56,122,.08)'; ctx.fillRect(inset.x, inset.y, inset.w, inset.h);
      ctx.strokeStyle = 'rgba(194,145,255,.3)'; ctx.strokeRect(inset.x + .5, inset.y + .5, inset.w - 1, inset.h - 1);
      ctx.strokeStyle = '#f4fbff'; ctx.lineWidth = 1.5; ctx.beginPath();
      ctx.moveTo(cx, inset.y + 14); ctx.lineTo(cx, bottom - 18); ctx.moveTo(inset.x + 12, bottom - 18); ctx.lineTo(inset.x + inset.w - 12, bottom - 18); ctx.stroke();
      ctx.strokeStyle = '#c291ff'; ctx.lineWidth = 2.2; ctx.beginPath();
      for (let i = 0; i <= 120; i++) {
        const f = -3 + i / 20;
        const x = cx + f / 6 * (inset.w - 30);
        const y = bottom - 18 - Math.min(9, violetPotential(f)) / 9 * (inset.h - 48);
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.stroke();
      const currentF = Math.max(-3, Math.min(3, fold));
      const ux = cx + currentF / 6 * (inset.w - 30);
      const uy = bottom - 18 - Math.min(9, violetPotential(currentF)) / 9 * (inset.h - 48);
      ctx.fillStyle = '#c291ff'; ctx.beginPath(); ctx.arc(ux, uy, 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#d7b9ff'; ctx.textAlign = 'center'; ctx.fillText('VIOLET U(F)=F²', cx, inset.y + 15);
    }

    function drawCompactSphere(rho, fold) {
      const [w, h] = fit(polarCanvas, polarCtx, 300, 320);
      const cx = w / 2;
      const cy = h / 2 + 14;
      const radius = Math.min(w, h) * .31;
      const project = point => ({
        x: cx + point.x * radius,
        y: cy - point.z * radius * .82 + point.y * radius * .08,
        depth: point.y
      });
      polarCtx.globalAlpha = 1;
      polarCtx.fillStyle = '#020d15'; polarCtx.fillRect(0, 0, w, h);
      polarCtx.font = '9px SFMono-Regular,Consolas,monospace'; polarCtx.textAlign = 'center';
      polarCtx.strokeStyle = 'rgba(92,133,149,.28)'; polarCtx.lineWidth = 1;
      polarCtx.beginPath(); polarCtx.arc(cx, cy, radius, 0, TAU); polarCtx.stroke();
      for (const latitude of [-.66, -.33, 0, .33, .66]) {
        const latitudeRadius = Math.sqrt(1 - latitude * latitude) * radius;
        polarCtx.strokeStyle = latitude === 0 ? 'rgba(244,251,255,.34)' : 'rgba(92,133,149,.16)';
        polarCtx.beginPath(); polarCtx.ellipse(cx, cy - latitude * radius * .82, latitudeRadius, latitudeRadius * .16, 0, 0, TAU); polarCtx.stroke();
      }
      for (let sector = 0; sector < POLAR_SECTORS; sector++) {
        const theta = sector / POLAR_SECTORS * TAU;
        polarCtx.strokeStyle = sector % 3 === 0 ? 'rgba(229,179,64,.22)' : 'rgba(92,133,149,.12)';
        polarCtx.beginPath();
        for (let index = 0; index <= 40; index++) {
          const phi = -Math.PI / 2 + index / 40 * Math.PI;
          const point = project({ x: Math.cos(phi) * Math.cos(theta), y: Math.cos(phi) * Math.sin(theta), z: Math.sin(phi) });
          index ? polarCtx.lineTo(point.x, point.y) : polarCtx.moveTo(point.x, point.y);
        }
        polarCtx.stroke();
        polarCtx.fillStyle = '#77939f';
        polarCtx.fillText(`S${sector + 1}`, cx + Math.cos(theta) * (radius + 14), cy + Math.sin(theta) * (radius + 14) * .28 + 3);
      }
      const pole = project({ x: 0, y: 0, z: 1 });
      const seam = project({ x: 0, y: 0, z: -1 });
      polarCtx.strokeStyle = 'rgba(194,145,255,.42)'; polarCtx.setLineDash([3, 4]);
      polarCtx.beginPath(); polarCtx.moveTo(seam.x, seam.y); polarCtx.lineTo(pole.x, pole.y); polarCtx.stroke(); polarCtx.setLineDash([]);
      polarCtx.shadowColor = '#c291ff'; polarCtx.shadowBlur = 16; polarCtx.fillStyle = '#c291ff';
      polarCtx.beginPath(); polarCtx.arc(pole.x, pole.y, 5.5, 0, TAU); polarCtx.fill(); polarCtx.shadowBlur = 0;
      polarCtx.fillStyle = '#d7b9ff'; polarCtx.fillText('VIOLET ORIENTATION POLE · |F|→∞', cx, pole.y - 14);
      polarCtx.fillStyle = '#020d15'; polarCtx.strokeStyle = '#f4fbff'; polarCtx.lineWidth = 1.8;
      polarCtx.beginPath(); polarCtx.arc(seam.x, seam.y, 4.5, 0, TAU); polarCtx.fill(); polarCtx.stroke();
      polarCtx.fillStyle = '#f4fbff'; polarCtx.fillText('WHITE SEAM · F=0', cx, seam.y + 18);
      const windowItems = rollingWindow(history, reading.time);
      const items = windowItems.length ? windowItems : [reading];
      function compactTrace(color, mirror = false) {
        polarCtx.strokeStyle = color; polarCtx.lineWidth = 1.8;
        for (let index = 1; index < items.length; index++) {
          const previous = items[index - 1], item = items[index];
          if (item.time < previous.time || item.time - previous.time > TAU / 3) continue;
          const age = Math.max(0, reading.time - item.time);
          polarCtx.globalAlpha = Math.min(.32, .06 + .26 * Math.exp(-age / (4 * TAU)));
          const aFold = foldCoordinate(previous.dispersion, rho) * (mirror ? -1 : 1);
          const bFold = foldForReading(item, rho) * (mirror ? -1 : 1);
          const a = project(stereographicSphere(aFold, previous.time));
          const b = project(stereographicSphere(bFold, item.time));
          polarCtx.beginPath(); polarCtx.moveTo(a.x, a.y); polarCtx.lineTo(b.x, b.y); polarCtx.stroke();
        }
        polarCtx.globalAlpha = 1;
      }
      compactTrace('#ff65ad');
      compactTrace('#38bdf8', true);
      const theta = reading.time;
      const pink = project(stereographicSphere(fold, theta));
      const blue = project(stereographicSphere(-fold, theta));
      for (const [color, point] of [['#ff65ad', pink], ['#38bdf8', blue]]) {
        polarCtx.shadowColor = color; polarCtx.shadowBlur = 12; polarCtx.fillStyle = color;
        polarCtx.beginPath(); polarCtx.arc(point.x, point.y, 4.5, 0, TAU); polarCtx.fill(); polarCtx.shadowBlur = 0;
      }
      if (exchangeActive) {
        polarCtx.strokeStyle = 'rgba(183,196,201,.8)'; polarCtx.lineWidth = 1.1; polarCtx.setLineDash([3, 3]);
        polarCtx.beginPath(); polarCtx.moveTo(pink.x, pink.y); polarCtx.lineTo(blue.x, blue.y); polarCtx.stroke(); polarCtx.setLineDash([]);
      }
      polarCtx.fillStyle = '#91aab4';
      polarCtx.fillText('Cσ(F,θ) ∈ S² · U=F² READS HEIGHT · DISPLAY ONLY', cx, h - 14);
      phaseState.textContent = '||Cσ||=1 · F=0 white · |F|→∞ violet pole';
    }

    function drawPolar(rho, fold) {
      if (phaseCompactActive) { drawCompactSphere(rho, fold); return; }
      const [w, h] = fit(polarCanvas, polarCtx, 300, 320);
      const cx = w / 2;
      const cy = h / 2 + 8;
      const reference = Math.min(w, h) * .29;
      const gain = reference * .13;
      const potentialGain = reference * .035;
      const tau = Math.PI * 2;
      const clampFold = value => Math.max(-3, Math.min(3, value));
      polarCtx.fillStyle = '#020d15'; polarCtx.fillRect(0, 0, w, h);
      polarCtx.font = '9px SFMono-Regular,Consolas,monospace'; polarCtx.textAlign = 'center';
      for (let sector = 0; sector < POLAR_SECTORS; sector++) {
        const theta = -Math.PI / 2 + sector / POLAR_SECTORS * tau;
        const outer = reference + gain * 3.25;
        polarCtx.strokeStyle = sector % 3 === 0 ? 'rgba(229,179,64,.28)' : 'rgba(92,133,149,.18)'; polarCtx.lineWidth = sector % 3 === 0 ? 1.2 : .8;
        polarCtx.beginPath(); polarCtx.moveTo(cx, cy); polarCtx.lineTo(cx + Math.cos(theta) * outer, cy + Math.sin(theta) * outer); polarCtx.stroke();
        polarCtx.fillStyle = '#77939f'; polarCtx.fillText(`S${sector + 1}`, cx + Math.cos(theta) * (outer + 13), cy + Math.sin(theta) * (outer + 13) + 3);
      }
      for (const offset of [-2, -1, 1, 2]) {
        polarCtx.strokeStyle = 'rgba(92,133,149,.14)'; polarCtx.lineWidth = 1;
        polarCtx.beginPath(); polarCtx.arc(cx, cy, reference + offset * gain, 0, tau); polarCtx.stroke();
      }
      polarCtx.strokeStyle = '#f4fbff'; polarCtx.lineWidth = 2; polarCtx.beginPath(); polarCtx.arc(cx, cy, reference, 0, tau); polarCtx.stroke();
      polarCtx.fillStyle = '#f4fbff'; polarCtx.fillText('F=0 · WHITE REFERENCE RING', cx, cy - reference - 16);
      const windowItems = rollingWindow(history, reading.time);
      const items = windowItems.length ? windowItems : [reading];
      function polarTrace(color, width, radiusFor) {
        polarCtx.strokeStyle = color; polarCtx.lineWidth = width;
        for (let index = 1; index < items.length; index++) {
          const previous = items[index - 1], item = items[index];
          if (item.time < previous.time || item.time - previous.time > TAU / 3) continue;
          const age = Math.max(0, reading.time - item.time);
          polarCtx.globalAlpha = Math.min(.24, .045 + .195 * Math.exp(-age / (4 * TAU)));
          polarCtx.beginPath();
          for (const point of [previous, item]) {
            const theta = point.time - Math.PI / 2;
            const f = clampFold(foldForReading(point, rho));
            const radius = Math.max(8, radiusFor(f));
            polarCtx.lineTo(cx + Math.cos(theta) * radius, cy + Math.sin(theta) * radius);
          }
          polarCtx.stroke();
        }
        polarCtx.globalAlpha = 1;
      }
      polarTrace('#ff65ad', 2.2, f => reference + gain * f);
      polarTrace('#38bdf8', 1.7, f => reference - gain * f);
      polarTrace('#c291ff', 1.5, f => reference + potentialGain * f * f);
      const theta = reading.time - Math.PI / 2;
      const current = clampFold(fold);
      [['#ff65ad', reference + gain * current], ['#38bdf8', reference - gain * current], ['#c291ff', reference + potentialGain * current * current]].forEach(([color, radius]) => {
        const x = cx + Math.cos(theta) * Math.max(8, radius);
        const y = cy + Math.sin(theta) * Math.max(8, radius);
        polarCtx.shadowColor = color; polarCtx.shadowBlur = 12; polarCtx.fillStyle = color;
        polarCtx.beginPath(); polarCtx.arc(x, y, 4, 0, tau); polarCtx.fill(); polarCtx.shadowBlur = 0;
      });
      if (exchangeActive) {
        const rPink = Math.max(8, reference + gain * current);
        const rBlue = Math.max(8, reference - gain * current);
        polarCtx.strokeStyle = 'rgba(183,196,201,.84)'; polarCtx.lineWidth = 1.2; polarCtx.setLineDash([3, 3]);
        polarCtx.beginPath();
        polarCtx.moveTo(cx + Math.cos(theta) * rPink, cy + Math.sin(theta) * rPink);
        polarCtx.lineTo(cx + Math.cos(theta) * rBlue, cy + Math.sin(theta) * rBlue);
        polarCtx.stroke(); polarCtx.setLineDash([]);
      }
      polarCtx.fillStyle = '#91aab4'; polarCtx.fillText('θ = SHARED CLOCK · SAME FOLD STATE', cx, h - 14);
      phaseState.textContent = 'raw radial fold · unbounded F clipped for display';
    }

    function drawDomainAtlas(fold) {
      if (atlasCanvases.some(target => !target) || atlasContexts.some(context => !context)) return;
      const state = domainChartState(fold, reading.time);
      const palette = { bg: '#020d15', grid: 'rgba(92,133,149,.24)', white: '#f4fbff', pink: '#ff65ad', blue: '#38bdf8', violet: '#c291ff', muted: '#91aab4', gold: '#e5b340' };
      const setup = index => {
        const [w, h] = fit(atlasCanvases[index], atlasContexts[index], 240, 210);
        const context = atlasContexts[index];
        context.globalAlpha = 1; context.setLineDash([]); context.fillStyle = palette.bg; context.fillRect(0, 0, w, h);
        context.font = '9px SFMono-Regular,Consolas,monospace'; context.textAlign = 'center';
        return { context, w, h, cx: w / 2, cy: h / 2 + 8 };
      };
      const marker = (context, x, y, color, radius = 4) => {
        context.shadowColor = color; context.shadowBlur = 10; context.fillStyle = color;
        context.beginPath(); context.arc(x, y, radius, 0, TAU); context.fill(); context.shadowBlur = 0;
      };
      {
        const { context, w, h, cx, cy } = setup(0); const span = Math.min(w * .34, 118); const clipped = Math.max(-2.5, Math.min(2.5, state.seam));
        context.strokeStyle = palette.grid; context.lineWidth = 1;
        for (const value of [-2, -1, 1, 2]) { const x = cx + value / 2.5 * span; context.beginPath(); context.moveTo(x, cy - 34); context.lineTo(x, cy + 34); context.stroke(); }
        context.strokeStyle = palette.white; context.lineWidth = 1.6; context.beginPath(); context.moveTo(cx - span, cy); context.lineTo(cx + span, cy); context.moveTo(cx, cy - 48); context.lineTo(cx, cy + 48); context.stroke();
        marker(context, cx + clipped / 2.5 * span, cy - 16, palette.pink); marker(context, cx - clipped / 2.5 * span, cy + 16, palette.blue);
        context.fillStyle = palette.white; context.fillText('F=0 · WHITE SEAM', cx, cy - 57); context.fillStyle = palette.muted; context.fillText('q₀ = F/σ', cx, h - 18);
      }
      {
        const { context, w, h, cx, cy } = setup(1); const radius = Math.min(w, h) * .31; const angle = state.theta - Math.PI / 2; const radial = radius * (.56 + .24 * Math.tanh(Math.abs(state.seam) / 2));
        context.strokeStyle = palette.grid; context.lineWidth = 1; for (const ratio of [.55, .8, 1]) { context.beginPath(); context.arc(cx, cy, radius * ratio, 0, TAU); context.stroke(); }
        context.strokeStyle = palette.white; context.setLineDash([3, 3]); context.beginPath(); context.moveTo(cx - Math.cos(angle) * radius, cy - Math.sin(angle) * radius); context.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius); context.stroke(); context.setLineDash([]);
        const px = cx + Math.cos(angle) * radial, py = cy + Math.sin(angle) * radial, bx = cx - Math.cos(angle) * radial, by = cy - Math.sin(angle) * radial;
        marker(context, px, py, palette.pink); marker(context, bx, by, palette.blue); marker(context, cx, cy, palette.white, 3);
        context.fillStyle = palette.gold; context.fillText(`θ · S${phaseSector(state.theta)}`, cx, 20); context.fillStyle = palette.muted; context.fillText('(q₀, −q₀, θ) · ONE CLOCK', cx, h - 18);
      }
      {
        const { context, w, h, cx, cy } = setup(2); const span = Math.min(w * .35, 120); const pole = state.pole; const mapped = pole === null ? span : Math.max(-span, Math.min(span, pole * span));
        context.strokeStyle = palette.grid; context.lineWidth = 1; for (const y of [cy - 42, cy, cy + 42]) { context.beginPath(); context.moveTo(cx - span, y); context.lineTo(cx + span, y); context.stroke(); }
        context.strokeStyle = palette.violet; context.lineWidth = 2; context.beginPath(); context.moveTo(cx, cy - 58); context.lineTo(cx, cy + 58); context.stroke(); marker(context, cx, cy, palette.violet, 5);
        if (pole !== null) { marker(context, cx + mapped, cy - 22, palette.pink); marker(context, cx - mapped, cy + 22, palette.blue); context.strokeStyle = 'rgba(244,251,255,.55)'; context.setLineDash([3, 3]); context.beginPath(); context.moveTo(cx + mapped, cy - 22); context.lineTo(cx, cy); context.lineTo(cx - mapped, cy + 22); context.stroke(); context.setLineDash([]); }
        context.fillStyle = palette.violet; context.fillText('VIOLET ORIENTATION POLE', cx, 20); context.fillStyle = palette.muted; context.fillText('q∞ = σ/F · q∞→0', cx, h - 18);
      }
      atlasReadouts[0].textContent = `q₀ ${state.seam.toFixed(4)} · F ${fold.toFixed(4)}`;
      atlasReadouts[1].textContent = `q₀ ${state.seam.toFixed(4)} ↔ ${state.mirror.toFixed(4)} · S${phaseSector(state.theta)}`;
      atlasReadouts[2].textContent = state.pole === null ? 'q∞ undefined at F=0 · use seam chart' : `q∞ ${state.pole.toFixed(4)} · q₀q∞ ${state.transitionProduct.toFixed(4)}`;
    }
    function drawHof(record) {
      if (!hofCanvas || !hofCtx) return null;
      const generation = Number(generationControl.value);
      const mix = Number(insideOutsideControl.value) / 100;
      const state = hofmannRiemannReturn(record, generation, reading.time);
      const [w, h] = fit(hofCanvas, hofCtx, 420, 380);
      const cx = w / 2, cy = h / 2 + 8, outer = Math.min(w, h) * .38;
      hofCtx.fillStyle = '#020d15'; hofCtx.fillRect(0, 0, w, h);
      hofCtx.font = '10px SFMono-Regular,Consolas,monospace'; hofCtx.textAlign = 'center';
      for (let sector = 0; sector < 12; sector++) {
        const angle = sector / 12 * TAU - Math.PI / 2;
        hofCtx.strokeStyle = sector % 3 === 0 ? 'rgba(229,179,64,.22)' : 'rgba(92,133,149,.12)';
        hofCtx.beginPath(); hofCtx.moveTo(cx, cy); hofCtx.lineTo(cx + Math.cos(angle) * outer, cy + Math.sin(angle) * outer); hofCtx.stroke();
      }
      hofCtx.strokeStyle = '#f4fbff'; hofCtx.lineWidth = 1.5; hofCtx.beginPath(); hofCtx.arc(cx, cy, outer * .56, 0, TAU); hofCtx.stroke();
      for (let g = 1; g <= generation; g++) {
        const local = hofmannRiemannReturn(record, g, reading.time);
        const amp = Math.max(.02, Math.min(.22, Math.abs(record.signed) * .18 + .035));
        for (const side of ['hz', 'fz']) {
          const channel = local[side];
          const baseRadius = outer * (side === 'hz' ? (.28 + g * .045) : (.60 + g * .045));
          const color = side === 'hz' ? '#38bdf8' : '#ff65ad';
          hofCtx.strokeStyle = color; hofCtx.globalAlpha = .34 + .5 * (side === 'hz' ? 1 - mix : mix); hofCtx.lineWidth = g === generation ? 2.2 : 1.2; hofCtx.beginPath();
          for (let step = 0; step <= 180; step++) {
            const angle = step / 180 * TAU;
            const radius = baseRadius * (1 + amp * Math.sin(4 * angle + channel.angle));
            const x = cx + Math.cos(angle) * radius, y = cy + Math.sin(angle) * radius;
            step ? hofCtx.lineTo(x, y) : hofCtx.moveTo(x, y);
          }
          hofCtx.stroke();
        }
      }
      hofCtx.globalAlpha = 1;
      const angle = reading.time - Math.PI / 2;
      const innerRadius = outer * (.28 + generation * .045), outerRadius = outer * (.60 + generation * .045);
      hofCtx.strokeStyle = '#e5b340'; hofCtx.setLineDash([4, 5]); hofCtx.beginPath(); hofCtx.moveTo(cx + Math.cos(angle) * innerRadius, cy + Math.sin(angle) * innerRadius); hofCtx.lineTo(cx - Math.cos(angle) * outerRadius, cy - Math.sin(angle) * outerRadius); hofCtx.stroke(); hofCtx.setLineDash([]);
      hofCtx.fillStyle = '#f4fbff'; hofCtx.beginPath(); hofCtx.arc(cx, cy, 5, 0, TAU); hofCtx.fill();
      hofCtx.fillStyle = '#8bdfff'; hofCtx.fillText('HZ · INNER', cx, 20); hofCtx.fillStyle = '#ff9eca'; hofCtx.fillText('FZ · OUTER / COUNTER-ROTATION', cx, h - 18);
      generationOut.textContent = String(generation); insideOutsideOut.textContent = `${Math.round(mix * 100)}%`;
      hzOut.textContent = `G${generation} · θ ${state.hz.angle.toFixed(3)} · v ${state.hz.value.toFixed(5)}`;
      fzOut.textContent = `G${generation} · θ ${state.fz.angle.toFixed(3)} · v ${state.fz.value.toFixed(5)}`;
      returnWitnessOut.textContent = state.returnWitness;
      return state;
    }

    function draw() {
      const base = Number(baseControl.value);
      const n = Number(stepControl.value);
      const rho = aperture(base, n);
      const record = selectedRecord();
      reading.record = record;
      reading.dispersion = record.magnitude;
      const d = record.magnitude;
      const status = classify(d, rho);
      const ratio = d / rho;
      const lastN = lastAdmittedRefinement(base, d);
      const fold = sourceFold(record, rho);
      const shadow = shadowCoordinate(fold);
      const potential = violetPotential(fold);
      drawCartesian(rho, fold, shadow);
      drawPolar(rho, fold);
      drawDomainAtlas(fold);
      drawHof(record);
      stepOut.textContent = String(n);
      dOut.textContent = d.toExponential(6);
      rhoOut.textContent = rho.toExponential(6);
      ratioOut.textContent = Number.isFinite(ratio) ? ratio.toFixed(4) : '∞';
      lastNOut.textContent = lastN === Infinity ? '∞ · exact' : lastN < 0 ? 'none · D>1' : String(lastN);
      sectorOut.textContent = `S${phaseSector(reading.time)} / ${POLAR_SECTORS}`;
      stateOut.className = status === 'EXACT_SEAM' ? 'is-exact' : status === 'NEAR_SEAM_ADMITTED' ? 'is-admitted' : 'is-outside';
      stateOut.textContent = status === 'EXACT_SEAM' ? 'EXACT SEAM · D=0' : status === 'NEAR_SEAM_ADMITTED' ? 'NEAR SEAM · ADMITTED' : 'OUTSIDE APERTURE';
      if (sourceIdOut) sourceIdOut.textContent = record.sourceId;
      if (sourceDetailOut) sourceDetailOut.textContent = record.label;
      if (sourceValueOut) sourceValueOut.textContent = `${record.signed >= 0 ? '+' : ''}${record.signed.toFixed(6)} / ${record.magnitude.toFixed(6)}`;
      if (sourceBoundaryOut) sourceBoundaryOut.textContent = record.mode === 'HASSE_WEIL' ? 'FINITE EC TRACE · HASSE BOUND CHECKED' : record.mode === 'DIRICHLET' ? 'DEGREE-1 CHARACTER · NOT EC L-FACTOR' : record.mode === 'ROOT_ROOM' ? 'DECLARED COMPARATOR · NO IDENTITY' : record.mode === 'KLEIN_PLUG' ? 'V4 ADDRESS · SEPARATE ADAPTER' : 'SYNTHETIC VIEW · EXISTING CARRIER';
      const scale = value => `${Math.max(1, Math.min(100, (Math.log10(Math.max(1e-6, Math.min(10, value))) + 6) / 7 * 100))}%`;
      dBar.style.width = scale(d); rhoBar.style.width = scale(rho);
      return { base, n, rho, dispersion: d, ratio, fold, shadow, potential, phaseSector: phaseSector(reading.time), status, lastAdmitted: lastN, source: record };
    }
    function ingest(detail) {
      const signals = detail && detail.signals;
      if (!Array.isArray(signals)) return;
      const clock = Number(detail.clock) || 0;
      reading = { time: clock, signals: [...signals], dispersion: dispersion(signals), record: syntheticRecord(signals, clock) };
      reading.record = selectedRecord();
      reading.dispersion = reading.record.magnitude;
      if (traceActive) history.push(reading);
      const historyLimit = Number(trailControl.value) || 1200;
      if (history.length > historyLimit) history.splice(0, history.length - historyLimit);
      draw();
    }
    win.addEventListener('a0-lissajous-frame', event => ingest(event.detail));
    baseControl.addEventListener('change', draw);
    stepControl.addEventListener('input', draw);
    if (sourceControl) sourceControl.addEventListener('change', () => { history.length = 0; draw(); });
    if (sourceParameter) sourceParameter.addEventListener('change', () => { history.length = 0; draw(); });
    if (generationControl) generationControl.addEventListener('input', draw);
    if (insideOutsideControl) insideOutsideControl.addEventListener('input', draw);
    trailControl.addEventListener('change', () => {
      const historyLimit = Number(trailControl.value) || 1200;
      if (history.length > historyLimit) history.splice(0, history.length - historyLimit);
      draw();
    });
    traceToggle.addEventListener('click', () => {
      traceActive = !traceActive;
      traceToggle.setAttribute('aria-pressed', String(!traceActive));
      traceToggle.textContent = traceActive ? 'SPUR ANHALTEN' : 'SPUR FORTSETZEN';
    });
    traceClear.addEventListener('click', () => { history.length = 0; draw(); });
    tmToggle.addEventListener('click', () => {
      exchangeActive = !exchangeActive;
      tmToggle.setAttribute('aria-pressed', String(exchangeActive));
      tmToggle.textContent = exchangeActive ? 'TM · EXCHANGE AN' : 'TM · EXCHANGE AUS';
      tmState.textContent = exchangeActive ? 'F ↔ −F · TM²=I' : 'RELATION GEHALTEN · SPUREN BLEIBEN';
      draw();
    });
    overlayToggle.addEventListener('click', () => {
      overlayActive = !overlayActive;
      overlayToggle.setAttribute('aria-pressed', String(overlayActive));
      overlayToggle.textContent = overlayActive ? 'ST/OP · KOMPAKT AN' : 'ST/OP · LIVE-SPUR';
      overlayState.textContent = overlayActive ? `${DISPLAY_MEMORY_ORBITS} orbits · fading memory · energy not modelled` : 't linear · bounded memory';
      draw();
    });
    phaseToggle.addEventListener('click', () => {
      phaseCompactActive = !phaseCompactActive;
      phaseToggle.setAttribute('aria-pressed', String(phaseCompactActive));
      phaseToggle.textContent = phaseCompactActive ? 'PHASE RETURN · COMPACT' : 'FREE FALL · LINEAR';
      polarLabel.textContent = phaseCompactActive ? 'PHASE RETURN / COMPACT SPHERE' : 'POLAR FOLD / LINEAR RADIUS';
      polarMeta.textContent = phaseCompactActive ? 'STEREOGRAPHIC VIEW · FIXED VIOLET ORIENTATION POLE' : 'HOFMANN–RIEMANN SOURCE VIEW · COMPARISON ONLY';
      draw();
    });
    function setExpanded(expanded) {
      host.classList.toggle('is-expanded', expanded);
      doc.documentElement.classList.toggle('asymptotic-pattern-expanded', expanded);
      expandControl.setAttribute('aria-pressed', String(expanded));
      expandControl.textContent = expanded ? 'GROSSANSICHT SCHLIESSEN ×' : 'PATTERN GROSS ANSEHEN ↗';
      win.requestAnimationFrame(draw);
    }
    expandControl.addEventListener('click', () => setExpanded(!host.classList.contains('is-expanded')));
    doc.addEventListener('keydown', event => { if (event.key === 'Escape' && host.classList.contains('is-expanded')) setExpanded(false); });
    if (win.ResizeObserver) new win.ResizeObserver(draw).observe(host);
    draw();
    return { draw, ingest, audit, clearTrace: () => { history.length = 0; draw(); }, setExpanded, state: () => ({ ...draw(), traceActive, exchangeActive, overlayActive, phaseCompactActive, historyLength: history.length, historyLimit: Number(trailControl.value) || 1200, expanded: host.classList.contains('is-expanded') }) };
  }

  if (typeof window !== 'undefined') {
    const start = () => mount();
    document.readyState === 'loading' ? window.addEventListener('DOMContentLoaded', start, { once: true }) : start();
  }
  return { BASES, EXACT_EPSILON, POLAR_SECTORS, DISPLAY_MEMORY_ORBITS, SOURCE_MODES, HASSE_PRIMES, DIRICHLET_MODULI, aperture, dispersion, classify, lastAdmittedRefinement, foldCoordinate, shadowCoordinate, transferMirror, violetPotential, stereographicSphere, seamChartCoordinate, poleChartCoordinate, domainChartState, polarRadii, phaseSector, overlayCoordinate, rollingWindow, positiveMod, isPrime, ellipticPointCount, hasseWeilRecord, legendreSymbol, dirichletPartialSum, dirichletRecord, rootRoomRecord, kleinPlugRecord, syntheticRecord, sourceRecord, sourceFold, hofmannRiemannReturn, audit, mount };
});
