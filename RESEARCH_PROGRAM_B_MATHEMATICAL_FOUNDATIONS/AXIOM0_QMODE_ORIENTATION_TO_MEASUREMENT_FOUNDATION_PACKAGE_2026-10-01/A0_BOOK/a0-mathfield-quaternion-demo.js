(() => {
  const demo = document.getElementById('k-quaternion-demo');
  if (!demo) return;

  const slider = demo.querySelector('input');
  const dial = demo.querySelector('.k-quaternion-dial');
  const orientation = demo.querySelector('[data-orientation]');
  const quaternion = demo.querySelector('[data-quaternion]');
  const returnStatus = demo.querySelector('[data-return]');
  const stops = demo.querySelectorAll('button[data-angle]');
  const format = new Intl.NumberFormat('de', { maximumFractionDigits: 4 });

  function render() {
    const angle = Number(slider.value);
    const visibleAngle = angle % 360;
    const halfAngle = angle * Math.PI / 360;
    const atStartOrientation = visibleAngle === 0;
    const rotation = atStartOrientation ? '0° · Startausrichtung' : visibleAngle + '°';
    const state = atStartOrientation
      ? (angle === 360 ? '−1' : '+1')
      : format.format(Math.cos(halfAngle)) + ' ' +
        (angle < 360 ? '+' : '−') + ' ' + format.format(Math.abs(Math.sin(halfAngle))) + ' k';

    dial.style.setProperty('--angle', -visibleAngle + 'deg');
    orientation.textContent = rotation;
    quaternion.textContent = 'q(' + angle + '°)' + (atStartOrientation ? ' = ' : ' ≈ ') + state;
    returnStatus.textContent = {
      0: 'Anfangszustand',
      360: 'Ansicht geschlossen · Quaternionenvorzeichen gewechselt',
      720: 'Anfangszustand wieder erreicht'
    }[angle] || '';
    for (const stop of stops) {
      stop.setAttribute('aria-pressed', String(Number(stop.dataset.angle) === angle));
    }
  }

  slider.addEventListener('input', render);
  for (const stop of stops) {
    stop.addEventListener('click', () => {
      slider.value = stop.dataset.angle;
      render();
    });
  }
  render();
})();
