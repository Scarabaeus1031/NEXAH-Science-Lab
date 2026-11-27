(() => {
  const host = document.getElementById('fromDustToDawn');
  const canvas = host.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const buttons = Array.from(host.querySelectorAll('[data-mycelium-stage]'));
  const caption = host.querySelector('[data-mycelium-caption]');
  const stages = [
    'Eine Spore ist der Startpunkt des Geflechts.',
    'Wachsende Pilzfäden breiten sich vom Zentrum nach außen aus. Der gestrichelte Ring zeigt ihre ungefähre Front.',
    'Die Fäden verzweigen sich. Wo zwei Zweige wieder zusammenwachsen, entsteht eine Schleife mit einem zusätzlichen Weg.'
  ];
  const center = [canvas.width / 2, canvas.height / 2];
  const frontRadius = 116;
  const color = {front: '#5497a6', thread: '#64d4bd', fusion: '#f2cb72'};

  function point(radius, angle) {
    return [center[0] + radius * Math.cos(angle), center[1] + radius * Math.sin(angle)];
  }

  function line(points, stroke, width) {
    ctx.beginPath();
    ctx.moveTo(...points[0]);
    for (const next of points.slice(1)) ctx.lineTo(...next);
    ctx.strokeStyle = stroke;
    ctx.lineWidth = width;
    ctx.stroke();
  }

  function dot([x, y], radius, fill) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = fill;
    ctx.fill();
  }

  function render(stage) {
    buttons.forEach((button, index) => button.setAttribute('aria-pressed', String(index === stage)));
    caption.textContent = stages[stage];
    canvas.setAttribute('aria-label', stages[stage]);
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    if (stage >= 1) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(...center, frontRadius, 0, 2 * Math.PI);
      ctx.setLineDash([4, 7]);
      ctx.strokeStyle = color.front;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      const angleStep = 2 * Math.PI / 10;
      const branches = Array.from({length: 10}, (_, index) => {
        const angle = index * angleStep - Math.PI / 2;
        const fork = point(45 + (index % 3) * 5, angle);
        const tip = point(103 + (index % 3) * 5, angle + 0.03);
        const left = point(88, angle - angleStep / 3);
        const right = point(88, angle + angleStep / 3);
        line([center, point(23, angle - 0.1), fork, point(78, angle - 0.06), tip], color.thread, 1.9);
        dot(tip, 2.7, color.thread);
        if (stage === 2) {
          line([left, fork, right], color.thread, 1.5);
        }
        return {left, right};
      });
      if (stage === 2) {
        for (const index of [0, 2, 4, 7]) {
          const from = branches[index].right;
          const to = branches[(index + 1) % branches.length].left;
          line([from, to], color.fusion, 2.8);
          dot(from, 3, color.fusion);
          dot(to, 3, color.fusion);
        }
      }
    }
    dot(center, 12, '#3d3221');
    dot(center, 6, color.fusion);
  }

  buttons.forEach((button, index) => button.addEventListener('click', () => render(index)));
  render(0);
})();
