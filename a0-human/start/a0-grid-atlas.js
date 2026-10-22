(() => {
  'use strict';

  const $ = id => document.getElementById(id);
  const mod = (n, m) => ((n % m) + m) % m;
  const svgNS = 'http://www.w3.org/2000/svg';
  const TAU = Math.PI * 2;

  const crt = $('crtN');
  function updateCrt() {
    const n = +crt.value;
    const x111 = mod(n, 111), y111 = Math.floor(n / 111);
    const x112 = mod(n, 112), y112 = Math.floor(n / 112);
    $('crtNOut').value = n;
    $('crtValue').textContent = n;
    $('addr111').textContent = `(${x111},${y111})`;
    $('mods111').textContent = `mod 7 = ${mod(n, 7)} · mod 11 = ${mod(n, 11)} · mod 77 = ${mod(n, 77)}`;
    $('addr112').textContent = `(${x112},${y112})`;
    $('mods112').textContent = `mod 112 = ${x112} · mod 11 = ${mod(n, 11)} · CRT mod 1232 = ${mod(n, 1232)}`;
  }
  crt.addEventListener('input', updateCrt);
  updateCrt();

  const specs = {
    77: [7, 11, '7×11'], 121: [11, 11, '11×11'], 1221: [11, 111, '11×111'],
    12321: [111, 111, '111×111'], 12320: [112, 110, '112×110'],
    10201: [101, 101, '101×101'], 840: [840, 1, 'Q840 ring'],
    1000000: [1000, 1000, '1000×1000']
  };
  const carrier = $('carrier'), gridN = $('gridN'), gridLens = $('gridLens'), mini = $('miniGrid');
  const isPrime = value => {
    if (!Number.isInteger(value) || value < 2) return false;
    for (let divisor = 2; divisor * divisor <= value; divisor += 1) if (value % divisor === 0) return false;
    return true;
  };
  const primeIndex = value => {
    if (!isPrime(value)) return null;
    let index = 0;
    for (let candidate = 2; candidate <= value; candidate += 1) if (isPrime(candidate)) index += 1;
    return index;
  };
  let currentGridAddress = null, previousGridAddress = null, committedGridAddress = null;
  function paintGrid(track = true) {
    const [w, h, label] = specs[carrier.value];
    const n = +gridN.value, x = mod(n, w), y = Math.floor(n / w) % h;
    const nextAddress = { n, x, y, w, h };
    if (!committedGridAddress) committedGridAddress = nextAddress;
    if (track && committedGridAddress && (committedGridAddress.n !== n || committedGridAddress.w !== w)) previousGridAddress = committedGridAddress;
    currentGridAddress = nextAddress;
    const fold = x + y, foldIndex = primeIndex(fold);
    $('gridReadout').textContent = h === 1 ? `${x} mod 840` : `${x} · ${y}`;
    $('gridMeta').textContent = `${label} · address ${mod(n, w * h)} / ${w * h - 1}`;
    $('gridFold').textContent = h === 1
      ? `ring coordinate ${x} · no two-axis fold`
      : `σ${w}(${n})=${x}+${y}=${fold}${foldIndex ? `=p${foldIndex}` : ' · composite/non-prime'}`;
    $('gridAddressLedger').textContent = h === 1
      ? `ring r=${x} · kein zweiachsiges Quotient/Rest-Ledger`
      : `q=${y}${isPrime(y) ? `=p${primeIndex(y)}` : '∉P'} · r=${x}${isPrime(x) ? `=p${primeIndex(x)}` : '∉P'} · q+r=${fold}${foldIndex ? `=p${foldIndex}` : '∉P'}`;
    if (previousGridAddress && previousGridAddress.w === w) {
      const dx = x - previousGridAddress.x, dy = y - previousGridAddress.y;
      const viewportDx = mod(x - previousGridAddress.x + 5, 11) - 5;
      const viewportDy = mod(y - previousGridAddress.y + 5, 11) - 5;
      $('gridDrift').textContent = `trace ${previousGridAddress.n}→${n} · Δfull=(${dx},${dy}) · Δviewport=(${viewportDx},${viewportDy})`;
    } else $('gridDrift').textContent = 'Trace startet mit der nächsten Eingabe im selben Carrier.';
    const binary = Math.max(0, Math.trunc(n)).toString(2);
    const trinary = Math.max(0, Math.trunc(n)).toString(3);
    const symbolicTrinary = trinary.replaceAll('2', 'x');
    $('gridCode').textContent = `bin₂ ${binary} · tri₃ ${trinary} → ${symbolicTrinary} · W₁…W₄: 101 · 1001 · 10001 · 100001`;
    mini.style.gridTemplateColumns = 'repeat(11,1fr)';
    mini.innerHTML = '';
    for (let i = 0; i < 121; i += 1) {
      const el = document.createElement('i');
      const column = i % 11, row = Math.floor(i / 11), classes = [];
      if (gridLens.value === 'prime-value' && isPrime(i)) classes.push('prime');
      if (gridLens.value === 'prime-fold' && isPrime(column + row)) classes.push('fold-prime');
      if (gridLens.value === 'trace' && previousGridAddress && previousGridAddress.w === w && column === mod(previousGridAddress.x, 11) && row === mod(previousGridAddress.y, 11)) classes.push('prev');
      if (column === mod(x, 11) && row === mod(y, 11)) classes.push('sel');
      el.className = classes.join(' ');
      el.title = gridLens.value === 'prime-fold' ? `(${column},${row}) · fold ${column + row}${isPrime(column + row) ? ` = p${primeIndex(column + row)}` : ''}` : `(${column},${row}) · local value ${i}${isPrime(i) ? ` = p${primeIndex(i)}` : ''}`;
      mini.appendChild(el);
    }
  }
  carrier.addEventListener('change', () => { currentGridAddress = null; previousGridAddress = null; committedGridAddress = null; paintGrid(false); });
  gridN.addEventListener('input', paintGrid);
  gridN.addEventListener('change', () => { paintGrid(true); committedGridAddress = currentGridAddress; });
  gridLens.addEventListener('change', () => paintGrid(false));
  paintGrid(false);

  const crt16 = {
    moduli: [17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79],
    product: 107147677900122307955347471n,
    selected: 0
  };
  const tileN = $('tileN'), tileLens = $('tileLens'), tileRotation = $('tileRotation');
  const tileAperture = $('tileAperture'), tileTempo = $('tileTempo'), tilePlay = $('tilePlay'), tilePhaseOutput = $('tilePhase');
  const carrierView = $('carrierView'), recordLens = $('recordLens'), foldView = $('foldView'), shadowView = $('shadowView');
  const crt16Svg = $('crt16Svg');
  let tilePhase = 0, tileTimer = 0;
  const makeSvg = (name, attrs = {}) => {
    const node = document.createElementNS(svgNS, name);
    Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
    return node;
  };
  const addSvgText = (parent, value, attrs) => {
    const node = makeSvg('text', attrs);
    node.textContent = value;
    parent.appendChild(node);
    return node;
  };
  const pointFor = (sector, ring, rotation) => {
    const angle = -Math.PI / 2 + (sector + rotation) * 2 * Math.PI / 5;
    const radius = [102, 176, 250][ring];
    return { x: 380 + Math.cos(angle) * radius, y: 312 + Math.sin(angle) * radius };
  };
  const polarPoint = (angle, radius, cx = 380, cy = 312) => ({
    x: cx + Math.cos(angle) * radius,
    y: cy + Math.sin(angle) * radius
  });
  const points = list => list.map(point => `${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(' ');
  function drawFoldOverlay(mode, rotation, opacity = 1) {
    if (mode === 'addresses') return;
    const group = makeSvg('g', { class: `fold-overlay ${mode}`, opacity });
    const turn = rotation * 2 * Math.PI / 5;
    const aperture = Math.max(0, Math.min(1, Number(tileAperture.value) / 100));
    const innerRadius = 190 - 112 * aperture;
    const apexRadius = 226 + 60 * aperture;
    const activeSector = tilePhase % 5;
    for (let sector = 0; sector < 5; sector += 1) {
      const angle = -Math.PI / 2 + turn + sector * 2 * Math.PI / 5;
      const next = angle + 2 * Math.PI / 5;
      const middle = angle + Math.PI / 5;
      const inner = polarPoint(middle, innerRadius);
      const left = polarPoint(angle, 226);
      const apex = polarPoint(middle, apexRadius);
      const right = polarPoint(next, 226);
      if (mode === 'triangles') {
        group.appendChild(makeSvg('polygon', { points: points([inner, left, apex]), class: `fold-triangle ${sector % 2 ? 'alternate' : ''}` }));
        group.appendChild(makeSvg('polygon', { points: points([inner, apex, right]), class: `fold-triangle ${sector % 2 ? '' : 'alternate'}` }));
      } else {
        group.appendChild(makeSvg('polygon', { points: points([inner, left, apex, right]), class: 'fold-kite' }));
      }
      group.appendChild(makeSvg('line', { x1: inner.x, y1: inner.y, x2: apex.x, y2: apex.y, class: sector === activeSector ? 'fold-edge active' : 'fold-edge' }));
    }
    crt16Svg.appendChild(group);
    const edgeAngle = -Math.PI / 2 + turn + Math.PI / 5;
    const label = polarPoint(edgeAngle, 190);
    addSvgText(crt16Svg, `+1 fold · aperture ${Math.round(aperture * 100)}%`, { x: label.x, y: label.y, class: 'fold-label' });
  }
  function drawShadowOverlay(mode, rotation) {
    if (mode === 'single') return;
    const group = makeSvg('g', { class: `shadow-overlay ${mode}` });
    if (mode === 'triple') {
      for (let axis = 0; axis < 3; axis += 1) {
        const phi = axis * Math.PI / 3 + rotation * Math.PI / 5;
        const plane = Array.from({ length: 5 }, (_, index) => {
          const angle = -Math.PI / 2 + index * 2 * Math.PI / 5;
          const x = Math.cos(angle) * 205, y = Math.sin(angle) * 88;
          return { x: 380 + x * Math.cos(phi) - y * Math.sin(phi), y: 312 + x * Math.sin(phi) + y * Math.cos(phi) };
        });
        group.appendChild(makeSvg('polygon', { points: points(plane), class: `shadow-plane axis-${axis + 1}` }));
        const apex = polarPoint(phi, 245), baseA = polarPoint(phi - 0.16, 128), baseB = polarPoint(phi + 0.16, 128);
        group.appendChild(makeSvg('polygon', { points: points([baseA, baseB, apex]), class: `shadow-tab axis-${axis + 1}` }));
      }
      addSvgText(group, '3 C5 view planes · 3 projected tabs · hypothesis', { x: 380, y: 590, class: 'shadow-label' });
    } else {
      group.appendChild(makeSvg('line', { x1: 145, y1: 312, x2: 615, y2: 312, class: 'shadow-axis' }));
      group.appendChild(makeSvg('line', { x1: 380, y1: 82, x2: 380, y2: 542, class: 'shadow-axis' }));
      group.appendChild(makeSvg('path', { d: 'M 520 312 A 140 140 0 1 1 380 172', class: 'shadow-turn' }));
      addSvgText(group, '270° = 3×90° = 540°/2 · VIEW ROTATION, NOT CLOSURE', { x: 380, y: 590, class: 'shadow-label warning' });
    }
    crt16Svg.appendChild(group);
  }
  function setTileReadout(channel, modulus, residue, address, title, text) {
    $('tileChannel').textContent = channel;
    $('tileModulus').textContent = modulus;
    $('tileResidue').textContent = residue;
    $('tileAddress').textContent = address;
    $('tileLensTitle').textContent = title;
    $('tileLensText').textContent = text;
  }
  function drawDuerer(rotation) {
    const matrix = [[16, 3, 2, 13], [5, 10, 11, 8], [9, 6, 7, 12], [4, 15, 14, 1]];
    const group = makeSvg('g', { class: 'duerer-grid' });
    const size = 96, x0 = 188, y0 = 112;
    matrix.forEach((row, r) => row.forEach((value, c) => {
      group.appendChild(makeSvg('rect', { x: x0 + c * size, y: y0 + r * size, width: size, height: size, class: 'duerer-cell' }));
      addSvgText(group, String(value), { x: x0 + c * size + size / 2, y: y0 + r * size + 57, class: 'duerer-number' });
    }));
    crt16Svg.appendChild(group);
    drawFoldOverlay(foldView.value, rotation, foldView.value === 'addresses' ? 0 : 0.74);
    drawShadowOverlay(shadowView.value, rotation);
    addSvgText(crt16Svg, 'DÜRER Q4 · every row, column and main diagonal = 34', { x: 380, y: 76, class: 'svg-heading' });
    addSvgText(crt16Svg, '16 labels ↔ 16 display slots · placement adapter only', { x: 380, y: 610, class: 'svg-caption center' });
    setTileReadout('Dürer Q4', '4 × 4 · labels 1…16', 'Σ row = Σ column = Σ diagonal = 34', 'The 4×4 carrier supplies rectangles and a complement placement. The C5 kite/triangle overlay is separately declared.', 'Dürer × Pascal display adapter', 'Dürer supplies the exact sixteen-slot grid; Pascal supplies the five-sector envelope. Neither Σ34 nor the label placement derives the fold edge.');
  }
  function facePoint(address) {
    if (address === 1) return { x: 380, y: 70 };
    if (address === 12) return { x: 380, y: 554 };
    if (address <= 6) return polarPoint(-Math.PI / 2 + (address - 2) * 2 * Math.PI / 5, 150, 380, 245);
    return polarPoint(-Math.PI / 2 + Math.PI / 5 + (address - 7) * 2 * Math.PI / 5, 150, 380, 385);
  }
  function drawFaceCarrier(carrierName, rotation) {
    drawFoldOverlay(foldView.value, rotation, 0.48);
    drawShadowOverlay(shadowView.value, rotation);
    const group = makeSvg('g', { class: 'face-carrier' });
    const upper = [2, 3, 4, 5, 6].map(facePoint), lower = [7, 8, 9, 10, 11].map(facePoint);
    group.appendChild(makeSvg('polygon', { points: points(upper), class: 'face-ring upper' }));
    group.appendChild(makeSvg('polygon', { points: points(lower), class: 'face-ring lower' }));
    for (let i = 0; i < 5; i += 1) {
      group.appendChild(makeSvg('line', { x1: upper[i].x, y1: upper[i].y, x2: lower[i].x, y2: lower[i].y, class: 'face-link' }));
    }
    const selected = +$('faceAddress').value;
    for (let address = 1; address <= 12; address += 1) {
      const point = facePoint(address);
      const node = makeSvg('g', { class: `face-address ${address === selected ? 'selected' : ''}`, role: 'button', tabindex: '0', transform: `translate(${point.x} ${point.y})` });
      node.appendChild(makeSvg('circle', { cx: 0, cy: 0, r: address === selected ? 27 : 22, class: 'face-disc' }));
      addSvgText(node, `${carrierName}${address}`, { x: 0, y: 5, class: 'face-label' });
      const choose = () => { $('faceAddress').value = address; updateFaceCarrier(); drawCrt16(); };
      node.addEventListener('click', choose);
      node.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); choose(); } });
      group.appendChild(node);
    }
    crt16Svg.appendChild(group);
    addSvgText(crt16Svg, `${carrierName}1…${carrierName}12 · complete dodecahedral face-address carrier`, { x: 380, y: 614, class: 'svg-caption center' });
    const zone = selected === 1 ? 'north pole' : selected <= 6 ? 'upper pentagonal ring' : selected <= 11 ? 'lower pentagonal ring' : 'south pole';
    setTileReadout(`${carrierName}${selected}`, '12 face addresses', zone, 'Only addresses 2…6 belong to the five tested open D/E gates; the remaining addresses complete the carrier.', 'D/E face carrier', 'This view completes D1…D12 and E1…E12. The fold overlay is a declared display adapter, not a recovered dodecahedral unfolding.');
  }
  function drawCoupledFaceCarrier(rotation) {
    drawFoldOverlay(foldView.value, rotation, 0.38);
    drawShadowOverlay(shadowView.value, rotation);
    const group = makeSvg('g', { class: 'face-coupling' });
    const selected = +$('faceAddress').value;
    const turn = rotation * 2 * Math.PI / 5;
    const rings = [
      { prefix: 'D', start: 2, radius: 100, offset: 0, className: 'd-gate' },
      { prefix: 'E', start: 2, radius: 174, offset: Math.PI / 5, className: 'e-upper' },
      { prefix: 'E', start: 7, radius: 246, offset: 0, className: 'e-lower' }
    ];
    const ringPoints = rings.map(ring => Array.from({ length: 5 }, (_, index) => polarPoint(-Math.PI / 2 + turn + ring.offset + index * 2 * Math.PI / 5, ring.radius)));
    ringPoints.forEach((ring, ringIndex) => group.appendChild(makeSvg('polygon', { points: points(ring), class: `coupling-ring ${rings[ringIndex].className}` })));
    for (let index = 0; index < 5; index += 1) {
      group.appendChild(makeSvg('line', { x1: ringPoints[0][index].x, y1: ringPoints[0][index].y, x2: ringPoints[1][index].x, y2: ringPoints[1][index].y, class: `coupling-step ${tilePhase % 5 === index ? 'active' : ''}` }));
      group.appendChild(makeSvg('line', { x1: ringPoints[1][index].x, y1: ringPoints[1][index].y, x2: ringPoints[2][index].x, y2: ringPoints[2][index].y, class: `coupling-step return ${tilePhase % 5 === index ? 'active' : ''}` }));
    }
    rings.forEach((ring, ringIndex) => ringPoints[ringIndex].forEach((point, index) => {
      const address = ring.start + index;
      const node = makeSvg('g', { class: `coupled-address ${ring.className} ${address === selected ? 'selected' : ''}`, role: 'button', tabindex: '0', transform: `translate(${point.x} ${point.y})` });
      node.appendChild(makeSvg('circle', { cx: 0, cy: 0, r: address === selected ? 24 : 19, class: 'coupled-disc' }));
      addSvgText(node, `${ring.prefix}${address}`, { x: 0, y: 5, class: 'face-label' });
      const choose = () => { $('faceAddress').value = address; updateFaceCarrier(); drawCrt16(); };
      node.addEventListener('click', choose);
      node.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); choose(); } });
      group.appendChild(node);
    }));
    [['D1/E1', 380, 45], ['D12/E12', 380, 578]].forEach(([label, x, y]) => {
      group.appendChild(makeSvg('circle', { cx: x, cy: y, r: 27, class: 'coupled-pole' }));
      addSvgText(group, label, { x, y: y + 5, class: 'face-label' });
    });
    crt16Svg.appendChild(group);
    addSvgText(crt16Svg, 'D gate → E upper → E lower · three typed address layers', { x: 380, y: 615, class: 'svg-caption center' });
    const phaseGroup = Math.floor((tilePhase % 15) / 5);
    const phaseNames = ['D2…D6', 'E2…E6', 'E7…E11'];
    setTileReadout('D/E coupling', '3 × C5 address layers', `phase ${String(tilePhase).padStart(2, '0')} · ${phaseNames[phaseGroup]}`, 'The highlighted stair is a display schedule across one D gate ring and two E address groups. It does not derive a dodecahedral transport operator.', 'D/E stair and kite aperture', 'D2…D6 are the five tested gate addresses. E2…E6 and E7…E11 are simultaneously visible address groups; the animated links are a declared display coupling only.');
  }
  function drawF50Comparator(rotation) {
    drawFoldOverlay(foldView.value, rotation, 0.32);
    drawShadowOverlay(shadowView.value, rotation);
    const group = makeSvg('g', { class: 'f50-comparator' });
    group.appendChild(makeSvg('line', { x1: 160, y1: 312, x2: 600, y2: 312, class: 'f50-line' }));
    [[210, '101', 'rank 50'], [380, 'F₅₀', 'factor field'], [550, '151', 'rank 50']].forEach(([x, label, meta]) => {
      group.appendChild(makeSvg('circle', { cx: x, cy: 312, r: label === 'F₅₀' ? 64 : 48, class: `f50-node ${label === 'F₅₀' ? 'field' : ''}` }));
      addSvgText(group, label, { x, y: 305, class: 'f50-label' });
      addSvgText(group, meta, { x, y: 332, class: 'f50-meta' });
    });
    crt16Svg.appendChild(group);
    addSvgText(crt16Svg, '12 586 269 025 = 5² · 11 · 101 · 151 · 3001', { x: 380, y: 112, class: 'svg-heading' });
    addSvgText(crt16Svg, '151 = 150 + 1', { x: 550, y: 232, class: 'fold-label' });
    addSvgText(crt16Svg, 'EXACT FACTOR BRIDGE · SELECTOR FAIL', { x: 380, y: 490, class: 'f50-verdict' });
    addSvgText(crt16Svg, '+1 arithmetic ≠ fold edge without a declared geometry', { x: 380, y: 610, class: 'svg-caption center' });
    setTileReadout('F₅₀ comparator', '101 ↔ 151', 'rankF₅₀(101) = rankF₅₀(151) = 50', 'The factor bridge is exact, but F₅₀ does not uniquely select 101 and does not generate the highlighted +1 fold edge.', 'Negative selector control', '151 = 150+1 is exact arithmetic. The fold edge remains a separately declared Pascal/Dürer display hypothesis.');
  }
  function drawD30Carrier(rotation) {
    const phase = makeSvg('g', { class: 'd30-phase' });
    for (let index = 0; index < 30; index += 1) {
      const angle = -Math.PI / 2 + index * 2 * Math.PI / 30;
      const a = polarPoint(angle, index % 3 === 0 ? 244 : 252), b = polarPoint(angle, 268);
      phase.appendChild(makeSvg('line', { x1: a.x, y1: a.y, x2: b.x, y2: b.y, class: index % 3 === 0 ? 'phase-tick major' : 'phase-tick' }));
      if (index % 3 === 0) {
        const label = polarPoint(angle, 286);
        addSvgText(phase, String(index), { x: label.x, y: label.y + 4, class: 'phase-label' });
      }
    }
    const nodes = Array.from({ length: 10 }, (_, index) => polarPoint(-Math.PI / 2 + rotation * 2 * Math.PI / 5 + index * 2 * Math.PI / 10, 178));
    phase.appendChild(makeSvg('polygon', { points: points(nodes), class: 'c10-cycle' }));
    const starOrder = [0, 3, 6, 9, 2, 5, 8, 1, 4, 7];
    phase.appendChild(makeSvg('polygon', { points: points(starOrder.map(index => nodes[index])), class: 'decagram-lens' }));
    phase.appendChild(makeSvg('polygon', { points: points([0, 2, 4, 6, 8].map(index => nodes[index])), class: 'sheet-pentagon d-sheet' }));
    phase.appendChild(makeSvg('polygon', { points: points([1, 3, 5, 7, 9].map(index => nodes[index])), class: 'sheet-pentagon e-sheet' }));
    nodes.forEach((point, index) => {
      phase.appendChild(makeSvg('circle', { cx: point.x, cy: point.y, r: 20, class: `c10-node ${index % 2 ? 'e-sheet' : 'd-sheet'}` }));
      addSvgText(phase, `${index % 2 ? 'E' : 'D'}${Math.floor(index / 2) + 1}`, { x: point.x, y: point.y + 5, class: 'c10-label' });
    });
    crt16Svg.appendChild(phase);
    drawFoldOverlay(foldView.value, rotation, 0.28);
    drawShadowOverlay(shadowView.value, rotation);
    addSvgText(crt16Svg, 'D30 PHASE RING · C10→C5 DOUBLE COVER · DECAGRAM VIEW', { x: 380, y: 50, class: 'svg-heading' });
    addSvgText(crt16Svg, 'p=2k−n mod30 · L:−1 · R:+1 · reflection composition ±12°', { x: 380, y: 612, class: 'svg-caption center' });
    setTileReadout('D30 / C10', '30 phases · 10 spatial addresses', 'C10 → C5 · one side bit', 'The alternating D1…D5 / E1…E5 nodes are the exact double-cover display. The decagram chords are a chosen embedding and do not select the D30 increment.', 'Phase carrier and star lens', 'The signed D30 schedule and C10 double cover are exact. A ten-point star, three projected pentagons or a 270° shadow are display choices, not new carrier identities.');
  }
  function drawRegisterEvidence(rotation) {
    const group = makeSvg('g', { class: 'grid-record' });
    const records = [
      { value: 33, note: '3×11', x: 102, side: 'source' },
      { value: 7, note: 'prime anchor', x: 230, side: 'source' },
      { value: 45, note: '3×15', x: 408, side: 'fold' },
      { value: 78, note: '3×26', x: 536, side: 'fold' },
      { value: 90, note: '3×30', x: 664, side: 'fold' }
    ];
    const y = 182;
    records.slice(0, 1).forEach((record, index) => {
      const next = records[index + 1];
      group.appendChild(makeSvg('line', { x1: record.x + 34, y1: y, x2: next.x - 34, y2: y, class: 'record-edge local' }));
    });
    records.slice(2, 4).forEach((record, index) => {
      const next = records[index + 3];
      group.appendChild(makeSvg('line', { x1: record.x + 34, y1: y, x2: next.x - 34, y2: y, class: 'record-edge local' }));
    });
    group.appendChild(makeSvg('path', { d: 'M 264 182 C 315 118 337 246 374 182', class: 'record-edge unbound' }));
    records.forEach(record => {
      group.appendChild(makeSvg('circle', { cx: record.x, cy: y, r: 31, class: `record-node ${record.side}` }));
      addSvgText(group, String(record.value), { x: record.x, y: y + 7, class: 'record-value' });
      addSvgText(group, record.note, { x: record.x, y: y + 55, class: 'record-note' });
    });
    addSvgText(group, 'SOURCE SIDE', { x: 166, y: 108, class: 'record-zone source' });
    addSvgText(group, 'FOLD RECORDS', { x: 536, y: 108, class: 'record-zone fold' });
    addSvgText(group, 'operator / transport rule still open', { x: 320, y: 136, class: 'record-open' });

    const matrixX = 270, matrixY = 292, cellW = 52, cellH = 42;
    for (let row = 0; row < 3; row += 1) {
      for (let column = 0; column < 5; column += 1) {
        group.appendChild(makeSvg('rect', { x: matrixX + column * cellW, y: matrixY + row * cellH, width: cellW - 5, height: cellH - 5, rx: 5, class: `record-matrix-cell row-${row + 1}` }));
      }
    }
    addSvgText(group, 'A ∈ ℤ³ˣ⁵ · address/register matrix · coefficients pending', { x: 400, y: 446, class: 'record-matrix-label' });
    addSvgText(group, '3 rows = views/axes · 5 columns = record positions', { x: 400, y: 468, class: 'record-note center' });

    const chips = [
      ['105', '3×5×7'], ['77', '7×11 grid'], ['7', 'layers'], ['9', 'intervals'], ['11', 'windings']
    ];
    chips.forEach(([value, label], index) => {
      const x = 120 + index * 130;
      group.appendChild(makeSvg('rect', { x: x - 52, y: 510, width: 104, height: 58, rx: 11, class: index < 2 ? 'record-chip exact' : 'record-chip proposed' }));
      addSvgText(group, value, { x, y: 535, class: 'record-chip-value' });
      addSvgText(group, label, { x, y: 554, class: 'record-chip-label' });
    });
    crt16Svg.appendChild(group);
    drawShadowOverlay(shadowView.value, rotation);
    addSvgText(crt16Svg, 'GRID-REGISTER PATH · EXACT ANCHORS, OPEN JOINTS', { x: 380, y: 50, class: 'svg-heading' });
    addSvgText(crt16Svg, 'solid = arithmetic label · dashed = not source-bound transport', { x: 380, y: 612, class: 'svg-caption center' });
    setTileReadout('Grid record', '3×5 register · 7×11 carrier', '3×5×7 = 105 · 7×11 = 77', 'The records 33, 7, 45, 78 and 90 are retained as separately typed addresses. Their order is a proposed movement path; no transition operator has yet been recovered.', 'Register movement, not ℝ⁵→ℝ³', 'A 3×5 address matrix can bind three views to five record positions. It becomes a Euclidean projection only after fifteen numerical coefficients and the source/target bases are declared.');
  }
  function drawMod77Evidence() {
    const n = mod(Math.trunc(Number(tileN.value) || 0), 77), a = mod(n, 7), b = mod(n, 11);
    const group = makeSvg('g', { class: 'mod77-evidence' });
    const x0 = 104, y0 = 118, w = 48, h = 48;
    for (let row = 0; row < 7; row += 1) {
      addSvgText(group, `a=${row}`, { x: x0 - 23, y: y0 + row * h + 29, class: 'mod77-axis' });
      for (let column = 0; column < 11; column += 1) {
        const value = mod(22 * row + 56 * column, 77), selected = row === a && column === b;
        group.appendChild(makeSvg('rect', { x: x0 + column * w, y: y0 + row * h, width: w - 4, height: h - 4, rx: 5, class: `mod77-cell ${selected ? 'selected' : ''}` }));
        addSvgText(group, String(value), { x: x0 + column * w + 22, y: y0 + row * h + 27, class: `mod77-value ${selected ? 'selected' : ''}` });
      }
    }
    for (let column = 0; column < 11; column += 1) addSvgText(group, `b=${column}`, { x: x0 + column * w + 22, y: y0 - 12, class: 'mod77-axis' });
    crt16Svg.appendChild(group);
    addSvgText(crt16Svg, 'HMA‑01 · ℤ₇₇ ≅ ℤ₇ × ℤ₁₁ · JOINT CRT ADDRESS', { x: 380, y: 50, class: 'svg-heading' });
    addSvgText(crt16Svg, `n=${n} ↦ (P₇,P₁₁)=(${a},${b}) ↦ 22·${a}+56·${b} ≡ ${n} (mod 77)`, { x: 380, y: 492, class: 'record-matrix-label' });
    addSvgText(crt16Svg, 'P₇ alone: 11-to-1 · P₁₁ alone: 7-to-1 · pair: exact', { x: 380, y: 532, class: 'evidence-copy green' });
    addSvgText(crt16Svg, 'HISTORICAL GRID MAPPING = VISUAL_ONLY · HMA‑01 CLOSED', { x: 380, y: 612, class: 'svg-caption center' });
    setTileReadout('HMA‑01 Mod‑77', '7 × 11 = 77', `(${a}, ${b})`, `Inverse: n ≡ 22·P₇ + 56·P₁₁ (mod 77). The pair reconstructs ${n} uniquely.`, 'Exact CRT joint; historical image still bounded', 'This is the source-bound address joint. It validates the arithmetic carrier, not a historical geometric transformation or a new NEXAH mechanism.');
  }
  function drawClampEvidence() {
    const x = Math.min(12, Math.max(0, Math.trunc(Number(tileN.value) || 0))), ca = Math.min(x, 3), cb = x - ca;
    const group = makeSvg('g', { class: 'clamp-evidence' });
    addSvgText(group, 'A/B-SIDE CLAMP · K=3', { x: 380, y: 52, class: 'svg-heading' });
    const baseY = 420, unit = 28, left = 380 - x * unit / 2;
    for (let index = 0; index < ca; index += 1) group.appendChild(makeSvg('rect', { x: left + index * unit, y: baseY - 155, width: unit - 3, height: 155, class: 'clamp-core' }));
    for (let index = 0; index < cb; index += 1) group.appendChild(makeSvg('rect', { x: left + (ca + index) * unit, y: baseY - 155, width: unit - 3, height: 155, class: 'clamp-residual' }));
    group.appendChild(makeSvg('circle', { cx: 380, cy: 214, r: 7, class: 'clamp-total' }));
    addSvgText(group, `x=${x}`, { x: 380, y: 196, class: 'clamp-label' });
    addSvgText(group, `CA=min(x,3)=${ca}`, { x: 250, y: 460, class: 'clamp-label' });
    addSvgText(group, `CB=x−CA=${cb}`, { x: 510, y: 460, class: 'clamp-label' });
    group.appendChild(makeSvg('rect', { x: 110, y: 500, width: 540, height: 70, rx: 12, class: 'evidence-box exact' }));
    addSvgText(group, 'CRT test periods 77 · 91 · 119 · 133 — all tested pairs reconstruct exactly', { x: 380, y: 529, class: 'evidence-copy green' });
    addSvgText(group, 'CA alone collapses x≥3 · CA+CB retains x · A↔B is algebraic involution', { x: 380, y: 552, class: 'evidence-copy' });
    crt16Svg.appendChild(group);
    addSvgText(crt16Svg, 'ACR‑38 · CORE + B-SIDE RESIDUAL', { x: 380, y: 612, class: 'svg-caption center' });
    setTileReadout('ACR‑38 clamp', 'K = 3 · x ∈ {0…12}', `CA=${ca} · CB=${cb}`, `x = CA + CB = ${x}. Keeping both sides is lossless; CA alone is non-injective after the clamp.`, 'Exact split; no new CRT theorem', 'The tested CRT addresses are exact controls. The A/B flip is algebraic and sum-preserving, not evidence for a physical fold.');
  }
  function drawPositionEvidence() {
    const group = makeSvg('g', { class: 'position-evidence' });
    const hex = Array.from({ length: 6 }, (_, i) => polarPoint(-Math.PI / 2 + i * Math.PI / 3, 132, 230, 300));
    const labels = ['P1', 'P2', 'P2', 'P1', 'P3', 'P3'];
    hex.forEach((point, index) => {
      const next = hex[(index + 1) % 6];
      group.appendChild(makeSvg('line', { x1: point.x, y1: point.y, x2: next.x, y2: next.y, class: 'p-mask-edge' }));
      group.appendChild(makeSvg('circle', { cx: point.x, cy: point.y, r: 25, class: 'p-mask-node mask' }));
      addSvgText(group, labels[index], { x: point.x, y: point.y + 5, class: 'p-mask-label' });
    });
    addSvgText(group, 'HANDLE‑7 OBSERVER MASK', { x: 230, y: 106, class: 'record-zone source' });
    [0, 1, 2].forEach((index) => {
      const x = 492 + index * 90;
      if (index < 2) group.appendChild(makeSvg('line', { x1: x + 25, y1: 270, x2: x + 65, y2: 270, class: 'p-mask-edge' }));
      group.appendChild(makeSvg('circle', { cx: x, cy: 270, r: 26, class: 'p-mask-node' }));
      addSvgText(group, `P${index}`, { x, y: 275, class: 'p-mask-label' });
    });
    addSvgText(group, 'P₃ PATH = {P0,P1,P2}', { x: 582, y: 205, class: 'record-zone fold' });
    group.appendChild(makeSvg('rect', { x: 450, y: 350, width: 264, height: 110, rx: 14, class: 'evidence-box open' }));
    addSvgText(group, '±1 / ±2 seam-offset reading', { x: 582, y: 390, class: 'evidence-title' });
    addSvgText(group, 'OPEN · no source-bound operator', { x: 582, y: 420, class: 'evidence-copy gold' });
    addSvgText(group, 'mask labels ≠ path states ≠ prime indices', { x: 380, y: 535, class: 'evidence-copy green' });
    crt16Svg.appendChild(group);
    addSvgText(crt16Svg, 'P-POSITION DISAMBIGUATION', { x: 380, y: 50, class: 'svg-heading' });
    addSvgText(crt16Svg, 'P3 names a three-vertex path; it is not a fourth position', { x: 380, y: 612, class: 'svg-caption center' });
    setTileReadout('P-position audit', 'mask: P1/P2/P3 · path: P0/P1/P2', 'same-address frames 10 · 26 · 42', 'The six labels belong to an observer mask. The exact P₃ carrier has three positions P0, P1 and P2.', 'Typed positions, not yet offsets', 'The proposed −1/−2 reading may be tested later, but it is not currently a bound transport rule.');
  }
  function drawPalindromeEvidence() {
    const group = makeSvg('g', { class: 'palindrome-evidence' });
    group.appendChild(makeSvg('line', { x1: 126, y1: 220, x2: 634, y2: 220, class: 'pal-line' }));
    [[150, '4114', '22×187', ''], [380, '4444', '22×202', 'center'], [610, '4774', '22×217', '']].forEach(([x, label, meta, cls]) => {
      group.appendChild(makeSvg('circle', { cx: x, cy: 220, r: 44, class: `pal-node ${cls}` }));
      addSvgText(group, label, { x, y: 216, class: 'pal-label' });
      addSvgText(group, meta, { x, y: 238, class: 'pal-meta' });
    });
    addSvgText(group, '4114 + 4774 = 8888 · gcd = 22 · radius 330 = 22×15', { x: 380, y: 306, class: 'record-matrix-label' });
    addSvgText(group, 'normalized: 187 — 202 — 217 · radius 15', { x: 380, y: 335, class: 'evidence-copy green' });
    group.appendChild(makeSvg('line', { x1: 230, y1: 440, x2: 530, y2: 440, class: 'pal-line mirror-control' }));
    [[230, '3773', ''], [530, '27227', 'mirror-control']].forEach(([x, label, cls]) => {
      group.appendChild(makeSvg('circle', { cx: x, cy: 440, r: 39, class: `pal-node ${cls}` }));
      addSvgText(group, label, { x, y: 446, class: 'pal-label' });
    });
    addSvgText(group, 'S₃₁₀₀₀(x)=−x mod 31000 · exact control pair', { x: 380, y: 510, class: 'evidence-copy gold' });
    addSvgText(group, 'NO SOURCE-BOUND 3773 ↔ 4774 BRIDGE', { x: 380, y: 552, class: 'record-open' });
    crt16Svg.appendChild(group);
    addSvgText(crt16Svg, '4774 / 4114 · PALINDROME SEAM AUDIT', { x: 380, y: 50, class: 'svg-heading' });
    addSvgText(crt16Svg, 'digit seam 4|7|7|4 is a typed word; arithmetic center is 4444', { x: 380, y: 612, class: 'svg-caption center' });
    setTileReadout('4774 / 4114', 'sum 8888 · gcd 22', 'midpoint 4444 · radius 330', 'After division by 22: midpoint 202 and radius 15. These are exact arithmetic relations.', 'Exact palindrome pair + separate control', '3773 is verified only in the distinct S₃₁₀₀₀ control pair 3773↔27227. No relation to 4774 is asserted.');
  }
  function drawGridRecord(rotation) {
    const views = { register: drawRegisterEvidence, mod77: drawMod77Evidence, clamp: drawClampEvidence, positions: drawPositionEvidence, palindrome: drawPalindromeEvidence };
    (views[recordLens.value] || drawRegisterEvidence)(rotation);
  }
  function labelFor(index, n, lens) {
    if (lens === 'abc') return ['A', 'B', 'C'][index % 3];
    if (lens === 'pq') return n % 2 ? 'P' : 'Q';
    if (lens === 'q106') return index === 15 ? 'A' : `I${Math.floor(index / 5) + 1}`;
    return String(mod(n, crt16.moduli[index]));
  }
  function lensCopy(n) {
    const odd = Math.abs(n) % 2 === 1;
    const copy = {
      residue: ['CRT residue lens', 'Jeder Kanal zeigt den Rest desselben Zahlenwerts in seinem eigenen Primmodulus.'],
      abc: ['ABC display labels', 'A/B/C laufen zyklisch über die 16 Anzeigeslots. Das ist eine beschriftete Sicht, keine Q106-Node-Zuordnung.'],
      pq: ['P/Q 17/18 comparator', 'Parität typisiert den bestehenden Vergleich: ungerade P↔17↔+1, gerade Q↔18↔−1. Sie selektiert keinen CRT-Kanal.'],
      q106: ['Q106 · I15 comparator', 'Die 15 Randplätze zeigen drei Fünfergruppen plus Zentrum. Eine Abbildung dieser Slots auf Q106 ist ausdrücklich nicht definiert.']
    }[tileLens.value];
    $('tileLensTitle').textContent = copy[0];
    $('tileLensText').textContent = copy[1];
    $('pqSource').textContent = odd ? 'P · 17' : 'Q · 18';
    $('pqTarget').textContent = odd ? '29 · +12' : '36 · +18 ≡ −12 (mod 30)';
  }
  function drawTileNode(index, point, n, lens, center = false) {
    const modulus = crt16.moduli[index], residue = mod(n, modulus);
    const selected = index === crt16.selected;
    const group = makeSvg('g', {
      class: `tile-node ${selected ? 'selected' : ''} ${lens === 'q106' && index < 15 ? `q106-band-${Math.floor(index / 5) + 1}` : ''}`,
      role: 'button', tabindex: '0',
      'aria-label': `Kanal ${index + 1}, Modulus ${modulus}, Rest ${residue}`,
      transform: `translate(${point.x} ${point.y})`
    });
    group.appendChild(makeSvg(center ? 'rect' : 'circle', center
      ? { x: -35, y: -35, width: 70, height: 70, rx: 18, class: 'node-shape center-node' }
      : { cx: 0, cy: 0, r: selected ? 31 : 27, class: 'node-shape' }));
    addSvgText(group, labelFor(index, n, lens), { x: 0, y: 6, class: 'node-label' });
    addSvgText(group, `${index + 1}·${modulus}`, { x: 0, y: center ? 53 : 47, class: 'node-meta' });
    const choose = () => { crt16.selected = index; drawCrt16(); };
    group.addEventListener('click', choose);
    group.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); choose(); }
    });
    crt16Svg.appendChild(group);
  }
  function drawTileProjections(n, rotation) {
    const phaseTurn = tilePhase * TAU / 30;
    const azimuth = rotation * TAU / 5 + phaseTurn;
    const aperture = Number(tileAperture.value) / 100;
    const zScale = .42 + .58 * aperture;
    const nodes = Array.from({ length: 15 }, (_, index) => {
      const sector = index % 5, layer = Math.floor(index / 5);
      const angle = -Math.PI / 2 + sector * TAU / 5 + azimuth;
      const radius = .7 + layer * .16;
      return { index, x: Math.cos(angle) * radius, y: Math.sin(angle) * radius, z: (layer - 1) * zScale };
    });
    nodes.push({ index: 15, x: 0, y: 0, z: 0 });
    const edges = [];
    for (let layer = 0; layer < 3; layer += 1) for (let sector = 0; sector < 5; sector += 1) {
      edges.push([layer * 5 + sector, layer * 5 + mod(sector + 1, 5), 'ring']);
      if (layer < 2) {
        edges.push([layer * 5 + sector, (layer + 1) * 5 + sector, 'pillar']);
        edges.push([layer * 5 + sector, (layer + 1) * 5 + mod(sector + 1, 5), 'seam']);
      }
    }
    for (let sector = 0; sector < 5; sector += 1) edges.push([15, sector, 'core']);
    const views = {
      tileViewFront: point => ({ x: point.x, y: -point.z }),
      tileViewTop: point => ({ x: point.x, y: point.y }),
      tileViewSide: point => ({ x: point.y, y: -point.z }),
      tileViewIso: point => ({ x: (point.x - point.y) * .72, y: (point.x + point.y) * .34 - point.z * .78 })
    };
    Object.entries(views).forEach(([id, project]) => {
      const svg = $(id);
      svg.replaceChildren();
      const projected = nodes.map(point => {
        const p = project(point);
        return { x: 120 + p.x * 67, y: 92 + p.y * 67 };
      });
      edges.forEach(([a, b, kind]) => svg.appendChild(makeSvg('line', {
        x1: projected[a].x, y1: projected[a].y, x2: projected[b].x, y2: projected[b].y,
        class: `projection-edge ${kind} ${a === crt16.selected || b === crt16.selected ? 'active' : ''}`
      })));
      projected.forEach((point, index) => {
        const group = makeSvg('g', { class: `projection-node ${index === crt16.selected ? 'active' : ''}` });
        group.appendChild(makeSvg(index === 15 ? 'rect' : 'circle', index === 15
          ? { x: point.x - 7, y: point.y - 7, width: 14, height: 14, rx: 3 }
          : { cx: point.x, cy: point.y, r: index === crt16.selected ? 6 : 4 }));
        if (index === crt16.selected || index === 15) addSvgText(group, index === 15 ? '0' : String(index + 1), { x: point.x, y: point.y - 9, class: 'projection-label' });
        svg.appendChild(group);
      });
    });
    $('tileProjectionMeta').textContent = `4 views · channel ${crt16.selected + 1}/16 · n=${n} · C5 turn ${rotation} · phase ${String(tilePhase).padStart(2, '0')}/29 · aperture ${tileAperture.value}% · diagonals are declared fold seams, not new state`;
  }
  function drawCrt16() {
    const n = Math.max(0, Math.trunc(Number(tileN.value) || 0));
    const rotation = +tileRotation.value, lens = tileLens.value;
    crt16Svg.innerHTML = '';

    const title = makeSvg('title', { id: 'crt16Title' });
    title.textContent = 'Interaktive CRT-16-Pentagonanzeige';
    const desc = makeSvg('desc', { id: 'crt16Desc' });
    desc.textContent = 'Fünf Sektoren mit je drei CRT-Kanälen und einem sechzehnten Zentrumskanal. Auswahl und Rotation verändern nur die Anzeige.';
    crt16Svg.append(title, desc);

    const defs = makeSvg('defs');
    const glow = makeSvg('filter', { id: 'crtGlow', x: '-80%', y: '-80%', width: '260%', height: '260%' });
    glow.appendChild(makeSvg('feGaussianBlur', { stdDeviation: '7', result: 'blur' }));
    const merge = makeSvg('feMerge');
    merge.appendChild(makeSvg('feMergeNode', { in: 'blur' }));
    merge.appendChild(makeSvg('feMergeNode', { in: 'SourceGraphic' }));
    glow.appendChild(merge);
    defs.appendChild(glow);
    crt16Svg.appendChild(defs);
    drawTileProjections(n, rotation);

    if (carrierView.value === 'd30') { drawD30Carrier(rotation); updateRepresentation(); return; }
    if (carrierView.value === 'record') { drawGridRecord(rotation); updateRepresentation(); return; }
    if (carrierView.value === 'duerer') { drawDuerer(rotation); updateRepresentation(); return; }
    if (carrierView.value === 'DE') { drawCoupledFaceCarrier(rotation); updateRepresentation(); return; }
    if (carrierView.value === 'D' || carrierView.value === 'E') { drawFaceCarrier(carrierView.value, rotation); updateRepresentation(); return; }
    if (carrierView.value === 'f50') { drawF50Comparator(rotation); updateRepresentation(); return; }

    const geometry = makeSvg('g', { class: 'tile-geometry' });
    for (let ring = 0; ring < 3; ring += 1) {
      const pts = Array.from({ length: 5 }, (_, sector) => pointFor(sector, ring, rotation));
      geometry.appendChild(makeSvg('polygon', {
        points: pts.map(p => `${p.x},${p.y}`).join(' '), class: `pentagon ring-${ring + 1}`
      }));
    }
    for (let sector = 0; sector < 5; sector += 1) {
      const a = pointFor(sector, 0, rotation), b = pointFor(sector, 2, rotation);
      geometry.appendChild(makeSvg('line', { x1: 380, y1: 312, x2: b.x, y2: b.y, class: 'sector-ray' }));
      geometry.appendChild(makeSvg('line', { x1: a.x, y1: a.y, x2: b.x, y2: b.y, class: 'sector-axis' }));
    }
    crt16Svg.appendChild(geometry);
    drawFoldOverlay(foldView.value, rotation);
    drawShadowOverlay(shadowView.value, rotation);
    for (let index = 0; index < 15; index += 1) {
      drawTileNode(index, pointFor(index % 5, Math.floor(index / 5), rotation), n, lens);
    }
    drawTileNode(15, { x: 380, y: 312 }, n, lens, true);
    addSvgText(crt16Svg, `C5 rotation ${rotation} · lens ${lens} · fold ${foldView.value}`, { x: 24, y: 614, class: 'svg-caption' });

    const modulus = crt16.moduli[crt16.selected];
    $('tileChannel').textContent = `Kanal ${crt16.selected + 1}`;
    $('tileModulus').textContent = `m${crt16.selected + 1} = ${modulus}`;
    $('tileResidue').textContent = `${n} mod ${modulus} = ${mod(n, modulus)}`;
    $('tileAddress').textContent = `Residue tuple component ${crt16.selected + 1}/16 · pairwise-coprime contract retained.`;
    lensCopy(n);
    updateRepresentation();
  }
  tileN.addEventListener('input', drawCrt16);
  tileLens.addEventListener('change', drawCrt16);
  tileRotation.addEventListener('input', drawCrt16);
  tileAperture.addEventListener('input', () => { tilePhaseOutput.textContent = `φ ${String(tilePhase).padStart(2, '0')}/29 · aperture ${tileAperture.value}%`; drawCrt16(); });
  carrierView.addEventListener('change', () => {
    if (carrierView.value === 'D' || carrierView.value === 'E' || carrierView.value === 'DE') $('faceCarrier').value = carrierView.value;
    updateFaceCarrier();
    drawCrt16();
  });
  recordLens.addEventListener('change', () => {
    carrierView.value = 'record';
    drawCrt16();
  });
  foldView.addEventListener('change', drawCrt16);
  shadowView.addEventListener('change', drawCrt16);
  document.querySelectorAll('[data-tile-n]').forEach(button => button.addEventListener('click', () => {
    tileN.value = button.dataset.tileN;
    drawCrt16();
  }));
  $('tilePrev').addEventListener('click', () => { crt16.selected = mod(crt16.selected - 1, 16); drawCrt16(); });
  $('tileNext').addEventListener('click', () => { crt16.selected = mod(crt16.selected + 1, 16); drawCrt16(); });
  function animationStep() {
    tilePhase = mod(tilePhase + 1, 30);
    const local = tilePhase % 10;
    tileRotation.value = Math.floor(tilePhase / 6) % 5;
    tileAperture.value = local <= 5 ? local * 20 : (10 - local) * 20;
    crt16.selected = tilePhase % 16;
    $('faceAddress').value = tilePhase % 15 < 10 ? 2 + tilePhase % 5 : 7 + tilePhase % 5;
    updateFaceCarrier();
    tilePhaseOutput.textContent = `φ ${String(tilePhase).padStart(2, '0')}/29 · aperture ${tileAperture.value}%`;
    drawCrt16();
    syncGhostToTile();
  }
  function stopTileAnimation() {
    if (tileTimer) window.clearInterval(tileTimer);
    tileTimer = 0;
    tilePlay.setAttribute('aria-pressed', 'false');
    tilePlay.textContent = '▶ Animation';
  }
  function startTileAnimation() {
    stopTileAnimation();
    tilePlay.setAttribute('aria-pressed', 'true');
    tilePlay.textContent = 'Ⅱ Pause';
    tileTimer = window.setInterval(animationStep, Number(tileTempo.value));
  }
  tilePlay.addEventListener('click', () => { if (tileTimer) stopTileAnimation(); else startTileAnimation(); });
  tileTempo.addEventListener('change', () => { if (tileTimer) startTileAnimation(); });
  $('showCoupling').addEventListener('click', () => { carrierView.value = 'DE'; $('faceCarrier').value = 'DE'; foldView.value = 'kites'; updateFaceCarrier(); drawCrt16(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopTileAnimation(); });

  const digitsInBase = (n, base) => {
    if (n === 0) return [0];
    const digits = [], sign = n < 0 ? -1 : 1;
    let rest = Math.abs(n);
    while (rest > 0) { digits.unshift(rest % base); rest = Math.floor(rest / base); }
    if (sign < 0) digits[0] *= -1;
    return digits;
  };
  function updateRepresentation() {
    const n = Math.trunc(Number(tileN.value) || 0);
    const base = crt16.moduli[crt16.selected];
    const mode = $('representationMode').value;
    const tuple = crt16.moduli.map(value => mod(n, value));
    const views = {
      base: [`${n} = [${digitsInBase(n, base).join(',')}]₍${base}₎`, `Base ${base} bewahrt n als vollständiges Ziffernwort.`],
      mod: [`${n} ↦ ${mod(n, base)} (mod ${base})`, `Mod ${base} ist eine Quotientenabbildung; ohne Zusatzdaten gehen Fasern zusammen.`],
      grid: [`${n} ↦ (${mod(n, base)}, ${Math.floor(n / base)})`, `Gridbreite ${base} zerlegt n in Spalte und Zeile; beide Koordinaten bewahren n.`],
      crt: [`(${tuple.slice(0, 4).join(',')}, …, ${tuple[15]})`, 'Das vollständige 16er-Resttupel rekonstruiert n nur modulo dem Produkt M.']
    };
    $('representationOutput').textContent = views[mode][0];
    $('representationMeta').textContent = views[mode][1];
  }
  function updateFaceCarrier() {
    const carrierName = $('faceCarrier').value;
    const address = +$('faceAddress').value;
    const zone = address === 1 ? 'Nordpol' : address <= 6 ? 'oberer Pentagonring' : address <= 11 ? 'unterer Pentagonring' : 'Südpol';
    const gate = address >= 2 && address <= 6 ? ` · Kandidatentor D${address}/E${address}` : ' · kein geprüftes offenes Tor';
    $('returnLabel').textContent = carrierName === 'DE' ? `D${address} ↔ E${address}` : `${carrierName}${address}`;
    $('returnMeta').textContent = `${zone}${gate}`;
  }
  $('representationMode').addEventListener('change', updateRepresentation);
  $('faceCarrier').addEventListener('change', () => { carrierView.value = $('faceCarrier').value; updateFaceCarrier(); drawCrt16(); });
  $('faceAddress').addEventListener('input', () => { updateFaceCarrier(); if (carrierView.value === 'D' || carrierView.value === 'E' || carrierView.value === 'DE') drawCrt16(); });
  document.querySelectorAll('[data-face]').forEach(button => button.addEventListener('click', () => {
    $('faceAddress').value = button.dataset.face;
    updateFaceCarrier();
    if (carrierView.value === 'D' || carrierView.value === 'E' || carrierView.value === 'DE') drawCrt16();
  }));
  updateRepresentation();
  updateFaceCarrier();
  drawCrt16();

  $('roots').innerHTML = [2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => `√${n} = ${Math.sqrt(n).toFixed(3)}`).join('<br>');
  function updateXO() {
    const n = +$('xoN').value;
    $('m101').textContent = mod(n, 101);
    $('m111').textContent = mod(n, 111);
  }
  $('xoN').addEventListener('input', updateXO);
  updateXO();
  function updateMirror() {
    const p = +$('mirrorP').value;
    const r = Number(String(Math.abs(Math.trunc(p))).split('').reverse().join('')) * Math.sign(p || 1);
    $('mirrorOut').textContent = `${p} ↔ ${r} · Δ₁₁₁=${Math.min(mod(p - r, 111), mod(r - p, 111))}`;
  }
  $('mirrorP').addEventListener('input', updateMirror);
  updateMirror();

  const ghost = $('ghostGrid'), ghostPreset = $('ghostPreset'), ghostFieldSize = $('ghostFieldSize'), ghostViewport = $('ghostViewport');
  const ghostColor = $('ghostColor'), ghostAperture = $('ghostAperture');
  const ghostNp = $('ghostNp'), ghostRr = $('ghostRr');
  const ghostPlay = $('ghostPlay'), ghostFollowTile = $('ghostFollowTile'), ghostPhaseOutput = $('ghostPhase'), ghostLegend = $('ghostLegend');
  const ghostFixtures = JSON.parse($('ghostTileFixtures').textContent);
  if(window.A0TesaGridCandidate)ghostFixtures.tesa28=window.A0TesaGridCandidate.fixture;
  const lrrlTrace = [0, -1, 0, 1, 0];
  let ghostPhase = 0, ghostTimer = 0, ghostSelection = { x: 0, y: 0 };

  function ghostSide() { return Number(ghostFieldSize.value) === 1000 ? 1000 : 100; }
  function ghostCoordinate(value, side = ghostSide()) {
    const numeric = Number(value);
    return mod(Number.isFinite(numeric) ? Math.trunc(numeric) : 0, side);
  }
  function encodeGhostAddress(np, rr, side = ghostSide()) { return ghostCoordinate(np, side) * side + ghostCoordinate(rr, side); }
  function decodeGhostAddress(address, side = ghostSide()) {
    const flat = mod(Math.trunc(Number(address) || 0), side * side);
    return { np: Math.floor(flat / side), rr: flat % side };
  }
  function ghostAddressAt(x, y) {
    const side = ghostSide();
    return { np: mod(ghostCoordinate(ghostNp.value, side) + y, side), rr: mod(ghostCoordinate(ghostRr.value, side) + x, side) };
  }
  function proceduralGhost() {
    const values = [], viewport = [6, 7, 8, 25].includes(Number(ghostViewport.value)) ? Number(ghostViewport.value) : 7;
    for (let y = 0; y < viewport; y += 1) for (let x = 0; x < viewport; x += 1) {
      const { np, rr } = ghostAddressAt(x, y);
      values.push(mod(rr * 37 + np * 53 + rr * np * 7, 101));
    }
    const side = ghostSide();
    return { label: `Ghost Memory · ${side}×${side} · ${viewport}×${viewport} viewport`, cols: viewport, rows: viewport, values, status: 'DECLARED_ADDRESS_VIEWPORT' };
  }
  function dyadicGhost() {
    return {
      label: 'Ghostgrid · exact paired dyadic lift', cols: 5, rows: 2,
      values: [97, 194, 388, 776, 1552, 101, 202, 404, 808, 1616],
      status: 'SOURCE_BOUND_EXACT_RETURN'
    };
  }
  function activeGhostFixture() {
    if (ghostPreset.value === 'procedural') return proceduralGhost();
    if (ghostPreset.value === 'dyadic') return dyadicGhost();
    return { ...ghostFixtures[ghostPreset.value], status: ghostFixtures.status };
  }
  function inGhostAperture(x, y, cols, rows) {
    if (ghostAperture.value === 'open') return true;
    const nx = cols === 1 ? 0 : (x - (cols - 1) / 2) / Math.max(1, (cols - 1) / 2);
    const ny = rows === 1 ? 0 : (y - (rows - 1) / 2) / Math.max(1, (rows - 1) / 2);
    if (ghostAperture.value === 'kite') return Math.abs(nx) + Math.abs(ny) <= 1.08;
    if (ghostAperture.value === 'vertical') return Math.abs(nx) <= .38 || (Math.abs(ny) <= .2 && Math.abs(nx) <= .72);
    if (ghostAperture.value === 'golden') {
      const angle = 51.827292 * Math.PI / 180;
      const u = nx * Math.cos(angle) - ny * Math.sin(angle);
      const v = nx * Math.sin(angle) + ny * Math.cos(angle);
      return Math.abs(u) + .72 * Math.abs(v) <= 1.02;
    }
    const outer = nx * nx + ny * ny <= 1.05;
    const inner = (nx + .32) * (nx + .32) + ny * ny < .72;
    return outer && !inner;
  }
  function sourceGhostClass(preset, value, x, y) {
    if (ghostPreset.value === 'procedural') return value < 8 ? 'source-b' : value < 18 ? 'source-a' : value === 35 ? 'source-c' : 'source-neutral';
    if (ghostPreset.value === 'dyadic') return y === 0 ? 'source-a' : 'source-b';
    if (ghostPreset.value === 'systemx') return `source-lane-${y + 1}`;
    return `g${mod(value, 3)}`;
  }
  function ghostColourRecord(x, y, index, total, value, coordinate = { np: y, rr: x }) {
    const trinity = mod(coordinate.rr + 2 * coordinate.np + ghostPhase, 3);
    const theta = TAU * mod(index + ghostPhase, total) / total;
    const tauSector = Math.min(2, Math.floor(mod(theta, TAU) / (TAU / 3)));
    const piParity = mod(index + ghostPhase, 2);
    const shift = lrrlTrace[ghostPhase % lrrlTrace.length];
    const flatAddress = encodeGhostAddress(coordinate.np, coordinate.rr);
    const phase12 = mod(flatAddress - ghostPhase, 12);
    let channel = trinity, classes = [];
    if (ghostColor.value === 'source') classes.push(sourceGhostClass(ghostPreset.value, value, x, y));
    else if (ghostColor.value === 'minus-1-12') { channel = phase12; classes.push('phase-12', phase12 === 0 ? 'phase-12-zero' : ''); }
    else if (ghostColor.value === 'tau') { channel = tauSector; classes.push(`g${channel}`, 'tau-pulse'); }
    else if (ghostColor.value === 'pi') { channel = piParity; classes.push(piParity ? 'pi-odd' : 'pi-even'); }
    else if (ghostColor.value === 'lrrl') { channel = mod(x + 2 * y + shift, 3); classes.push(`g${channel}`, x === mod(Math.floor((activeGhostFixture().cols - 1) / 2) + shift, activeGhostFixture().cols) ? 'trace-active' : ''); }
    else {
      classes.push(`g${channel}`);
      if (ghostColor.value === 'pi-tau-3') classes.push('tau-pulse', piParity ? 'pi-odd' : 'pi-even');
    }
    return { channel, theta, piParity, phase12, shift, classes: classes.filter(Boolean) };
  }
  function renderGhost() {
    const preset = activeGhostFixture(), total = preset.cols * preset.rows;
    const isAddressViewport = ghostPreset.value === 'procedural';
    const side = ghostSide(), digits = String(side - 1).length;
    ghostNp.disabled = !isAddressViewport;
    ghostRr.disabled = !isAddressViewport;
    ghostFieldSize.disabled = !isAddressViewport;
    ghostViewport.disabled = !isAddressViewport;
    ghostNp.max = String(side - 1);
    ghostRr.max = String(side - 1);
    ghost.replaceChildren();
    ghost.style.gridTemplateColumns = `repeat(${preset.cols},1fr)`;
    const isTesa=ghostPreset.value==='tesa28',tesaStretch=isTesa?Number($('tesaStretch').value):1,tesaMirror=isTesa?$('tesaMirror').checked:false;
    ghost.style.aspectRatio = `${preset.cols*tesaStretch}/${preset.rows}`;
    ghost.style.gridTemplateRows=isTesa?`repeat(${preset.rows},1fr)`:'';
    ghost.style.minHeight=isTesa?'0':'';ghost.style.maxHeight=isTesa?'none':'';
    preset.values.forEach((value, index) => {
      const x = index % preset.cols, y = Math.floor(index / preset.cols);
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'ghost-cell';
      if (value === null) {
        el.classList.add('void');
        el.disabled = true;
        el.setAttribute('aria-label', `empty fixture position ${x},${y}`);
        ghost.appendChild(el);
        return;
      }
      const coordinate = isAddressViewport ? ghostAddressAt(x, y) : { np: y, rr: x };
      const flatAddress = encodeGhostAddress(coordinate.np, coordinate.rr);
      const record = ghostColourRecord(x, y, index, total, value, coordinate);
      el.classList.add(...record.classes);
      if (!inGhostAperture(x, y, preset.cols, preset.rows)) el.classList.add('outside-aperture');
      if (ghostSelection.x === x && ghostSelection.y === y) {
        el.classList.add('selected');
        $('ghostOut').textContent = `NP ${String(coordinate.np).padStart(digits, '0')}; RR ${String(coordinate.rr).padStart(digits, '0')} · flat ${flatAddress} · cell (${x},${y}) · value ${value} · χ₃=${mod(coordinate.rr + 2 * coordinate.np + ghostPhase, 3)} · c₁₂=${record.phase12}`;
      }
      el.style.setProperty('--pulse', String((.3 + .7 * (1 + Math.cos(record.theta)) / 2).toFixed(3)));
      el.style.setProperty('--phase12', String(record.phase12));
      el.dataset.value = String(value);
      if(isTesa){const p=window.A0TesaGridCandidate.view(value,{mirror:tesaMirror,stretch:tesaStretch});el.style.gridRow=String(p.viewRow+1);el.style.gridColumn=String(p.col+1);el.dataset.tesaAddress=String(value);}
      el.textContent = total <= 49 ? String(value) : '';
      el.title = `${preset.label} · NP ${String(coordinate.np).padStart(digits, '0')}; RR ${String(coordinate.rr).padStart(digits, '0')} · flat ${flatAddress} · value ${value} · χ₃ ${mod(coordinate.rr + 2 * coordinate.np + ghostPhase, 3)} · c₁₂ ${record.phase12}`;
      el.addEventListener('click', () => {
        ghostSelection = { x, y };
        $('ghostOut').textContent = `NP ${String(coordinate.np).padStart(digits, '0')}; RR ${String(coordinate.rr).padStart(digits, '0')} · flat ${flatAddress} · cell (${x},${y}) · value ${value} · χ₃=${mod(coordinate.rr + 2 * coordinate.np + ghostPhase, 3)} · c₁₂=${record.phase12}`;
        renderGhost();
      });
      ghost.appendChild(el);
    });
    const phaseFraction = mod(ghostPhase, total) / total;
    ghostPhaseOutput.textContent = ghostColor.value === 'minus-1-12'
      ? `t ${String(ghostPhase).padStart(2, '0')} · backward phase ${mod(-ghostPhase, 12)}/12 · −${ghostPhase}/12 turns`
      : `t ${String(ghostPhase).padStart(2, '0')} · τ phase ${phaseFraction.toFixed(3)} · χ₃ ${mod(ghostPhase, 3)}`;
    ghostLegend.innerHTML = ghostColor.value === 'minus-1-12'
      ? '<span><i class="swatch s0"></i>c₁₂=0</span><span><i class="swatch s1"></i>c₁₂=1…11</span><span><i class="swatch aperture"></i>Aperture</span>'
      : '<span><i class="swatch s0"></i>χ₃=0</span><span><i class="swatch s1"></i>χ₃=1</span><span><i class="swatch s2"></i>χ₃=2</span><span><i class="swatch aperture"></i>Aperture</span>';
    const boundary = preset.status === 'DOCUMENTARY_TRANSCRIPTION_NOT_FORMULA' ? 'visual transcription only' : preset.status.toLowerCase().replaceAll('_', ' ');
    const lrrl = ghostColor.value === 'lrrl' ? ` · LRRL shift ${lrrlTrace[ghostPhase % 5]} (balanced Return is not unique)` : '';
    const addressContract = isAddressViewport ? ` · origin NP ${String(ghostCoordinate(ghostNp.value)).padStart(digits, '0')}; RR ${String(ghostCoordinate(ghostRr.value)).padStart(digits, '0')} · flat=${side}·NP+RR` : '';
    const phaseContract = ghostColor.value === 'minus-1-12' ? ' · c₁₂(n,t)=(n−t) mod 12 · one backward display tick = −1/12 turn' : '';
    const apertureContract = ghostAperture.value === 'golden' ? ' · φ aperture 51.827292° (display rotation)' : '';
    $('ghostMeta').textContent = `${preset.label} · ${boundary}${addressContract}${phaseContract}${apertureContract} · χ₃(RR,NP,t)=(RR+2NP+t) mod 3 · τ=2π${lrrl}`;
    window.A0TesaGridLens?.update();
  }
  function stopGhostClock() {
    if (ghostTimer) window.clearInterval(ghostTimer);
    ghostTimer = 0;
    ghostPlay.setAttribute('aria-pressed', 'false');
    ghostPlay.textContent = '▶ Ghost clock';
  }
  function startGhostClock() {
    stopGhostClock();
    ghostFollowTile.checked = false;
    ghostPlay.setAttribute('aria-pressed', 'true');
    ghostPlay.textContent = 'Ⅱ Pause ghost';
    ghostTimer = window.setInterval(() => { ghostPhase = mod(ghostPhase + 1, 30); renderGhost(); }, 420);
  }
  function syncGhostToTile() {
    if (!ghostFollowTile || !ghostFollowTile.checked) return;
    ghostPhase = tilePhase;
    renderGhost();
  }
  [ghostPreset, ghostColor, ghostAperture, ghostViewport].forEach(control => control.addEventListener('change', () => { ghostSelection = { x: 0, y: 0 }; renderGhost(); }));
  ghostPreset.addEventListener('change',()=>{if(ghostPreset.value==='tesa28'){stopGhostClock();ghostFollowTile.checked=false;ghostAperture.value='open';ghostColor.value='source';renderGhost();}});
  ghostFieldSize.addEventListener('change', () => {
    ghostNp.value = String(ghostCoordinate(ghostNp.value));
    ghostRr.value = String(ghostCoordinate(ghostRr.value));
    ghostSelection = { x: 0, y: 0 };
    renderGhost();
  });
  [ghostNp, ghostRr].forEach(control => control.addEventListener('input', () => {
    control.value = String(ghostCoordinate(control.value));
    ghostSelection = { x: 0, y: 0 };
    renderGhost();
  }));
  ghostFollowTile.addEventListener('change', () => { if (ghostFollowTile.checked) { stopGhostClock(); syncGhostToTile(); } });
  ghostPlay.addEventListener('click', () => { if (ghostTimer) stopGhostClock(); else startGhostClock(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopGhostClock(); });
  renderGhost();
  window.A0GhostTiles = { fixtures: ghostFixtures, render: renderGhost, encodeAddress: encodeGhostAddress, decodeAddress: decodeGhostAddress, lrrlTrace: [...lrrlTrace], selectValue(value){const preset=activeGhostFixture(),index=preset.values.indexOf(value);if(index<0)return false;ghostSelection={x:index%preset.cols,y:Math.floor(index/preset.cols)};renderGhost();return true;},get selection(){const preset=activeGhostFixture();return{...ghostSelection,value:preset.values[ghostSelection.y*preset.cols+ghostSelection.x]};},get side() { return ghostSide(); }, get phase() { return ghostPhase; } };
})();
