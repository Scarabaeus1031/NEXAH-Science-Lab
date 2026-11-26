(() => {
  const iframe = document.querySelector('[data-archive-plot]');
  const geometry = document.querySelector('[data-archive-geometry]');
  const probe = document.createElement('canvas').getContext('webgl');
  if (probe) {
    probe.getExtension('WEBGL_lose_context')?.loseContext();
    iframe.src = iframe.dataset.archivePlot;
    iframe.hidden = false;
    return;
  }

  geometry.hidden = false;
  const canvas = geometry.querySelector('canvas');
  const context = canvas.getContext('2d');
  const rotation = geometry.querySelector('input');
  const tau = 2 * Math.PI;
  const phi = (1 + Math.sqrt(5)) / 2;
  const surface = (angle, z, height = z) => {
    const radius = 1 + .5 * Math.sin(3 * angle + z);
    return [radius * Math.cos(angle), radius * Math.sin(angle), height];
  };
  const sample = (count, fn) => Array.from({length: count}, (_, i) => fn(i / (count - 1)));
  const levels = sample(17, t => sample(121, u => surface(tau * u, 4 * t - 2)));
  const meridians = sample(25, t => sample(65, u => surface(tau * t, 4 * u - 2)));
  const mirror = sample(121, t => surface(tau * t, 0, 0));
  const spiral = sample(300, t => {
    const radius = .1 + 1.9 * t;
    const angle = phi * tau * radius;
    return [radius * Math.cos(angle), radius * Math.sin(angle), .2 * radius + .2 * Math.sin(2 * tau * radius)];
  });

  // The archived FFT used 300 samples, including both endpoints of the angle interval.
  const signal = sample(300, t => Math.sin(3 * tau * t) + .5 * Math.sin(7 * tau * t));
  const binWidth = 299 / (signal.length * tau);
  const harmonics = Array.from({length: 149}, (_, i) => {
    const bin = i + 1;
    let real = 0;
    let imaginary = 0;
    signal.forEach((value, j) => {
      const angle = tau * bin * j / signal.length;
      real += value * Math.cos(angle);
      imaginary -= value * Math.sin(angle);
    });
    return Math.hypot(real, imaginary);
  });
  const amplitude = Math.max(...harmonics);

  function stroke(points, color, width) {
    context.beginPath();
    for (const [i, point] of points.entries()) {
      const [x, y] = point;
      if (i === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    }
    context.strokeStyle = color;
    context.lineWidth = width;
    context.stroke();
  }

  function draw() {
    const azimuth = rotation.valueAsNumber * Math.PI / 180;
    const cos = Math.cos(azimuth);
    const sin = Math.sin(azimuth);
    const project = ([x, y, z]) => [320 + 75 * (x * cos - y * sin), 173 - 63 * z + 38 * (x * sin + y * cos)];
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (const level of levels) stroke(level.map(project), '#498c89', 1);
    for (const meridian of meridians) stroke(meridian.map(project), '#31596b', 1);
    stroke(mirror.map(project), '#a9cddd', 1.6);
    stroke(spiral.map(project), '#ffcf65', 3);
    stroke([[48, 426], [600, 426]], '#466779', 1);
    stroke(harmonics.map((value, i) => [48 + 552 * i / (harmonics.length - 1), 426 - 61 * value / amplitude]), '#ee6ca5', 2);
    context.font = '16px system-ui';
    context.fillStyle = '#ffcf65';
    context.fillText('Φ-Spirale', 24, 29);
    context.fillStyle = '#ee9abe';
    context.fillText('Fourier-Spur', 48, 355);
    context.fillStyle = '#b8cfdb';
    context.fillText(binWidth.toFixed(2).replace('.', ','), 48, 452);
    const end = (binWidth * harmonics.length).toFixed(2).replace('.', ',');
    context.fillText(end, 600 - context.measureText(end).width, 452);
  }

  rotation.addEventListener('input', draw);
  draw();
})();
