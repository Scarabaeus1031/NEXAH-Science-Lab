(() => {
  const door = document.getElementById('door');
  const hatch = document.getElementById('trapHatch');
  const threshold = document.getElementById('threshold');
  if (!door || !hatch || !threshold) return;

  let passageTimer = 0;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  hatch.addEventListener('click', () => {
    const open = !door.classList.contains('is-open');
    window.clearTimeout(passageTimer);
    door.classList.toggle('is-open', open);
    hatch.setAttribute('aria-expanded', String(open));
    hatch.setAttribute('aria-label', open ? 'Trap Door schließen' : 'Trap Door öffnen');

    if (open) {
      passageTimer = window.setTimeout(() => {
        threshold.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
      }, reducedMotion.matches ? 120 : 1150);
    }
  });
})();
