(() => {
  const root = document.getElementById('quachCouplingDemo');
  if (!root) return;

  const range = root.querySelector('[data-qc-range]');
  const play = root.querySelector('[data-qc-play]');
  let timer = null;

  const prime = (value) => {
    if (!Number.isInteger(value) || value < 2) return false;
    if (value % 2 === 0) return value === 2;
    for (let divisor = 3; divisor * divisor <= value; divisor += 2) if (value % divisor === 0) return false;
    return true;
  };

  const values = (n) => ({ a: [n, n + 1], b: [n + 1, n + 2], c: [2 * n + 1, 2 * n + 3] });
  const put = (name, value) => { const node = root.querySelector(`[data-qc-${name}]`); if (node) node.textContent = value; };

  function render(raw) {
    const n = Math.max(1, Math.min(2048, Number(raw) || 1));
    range.value = n;
    const { a, b, c } = values(n);
    const twin = prime(c[0]) && prime(c[1]);
    put('n', n);
    put('a', `(${a[0]}, ${a[1]})`);
    put('b', `(${b[0]}, ${b[1]})`);
    put('c', `(${c[0]}, ${c[1]})`);
    put('mediant', `${a[0]}/${a[1]} ⊕ ${b[0]}/${b[1]} = ${c[0]}/${c[1]}`);
    put('return', `(${c[0]},${c[1]}) − (${b[0]},${b[1]}) = (${a[0]},${a[1]})`);
    put('prime', twin ? `TWIN PRIME · ${c[0]} / ${c[1]}` : `GAP 2 · COMPOSITE CONTROL`);
    root.dataset.twin = twin ? 'true' : 'false';
    root.querySelectorAll('[data-qc-left]').forEach((node, index) => { node.textContent = [a[0], b[0], c[0]][index]; });
    root.querySelectorAll('[data-qc-right]').forEach((node, index) => { node.textContent = [a[1], b[1], c[1]][index]; });
  }

  function step(delta = 1) {
    const current = Number(range.value);
    render(current + delta > 2048 ? 1 : current + delta < 1 ? 2048 : current + delta);
  }

  function nextTwin() {
    let n = Number(range.value);
    for (let checked = 0; checked < 2048; checked += 1) {
      n = n >= 2048 ? 1 : n + 1;
      const c = values(n).c;
      if (prime(c[0]) && prime(c[1])) return render(n);
    }
  }

  function togglePlay() {
    if (timer) {
      clearInterval(timer);
      timer = null;
      play.textContent = 'PLAY';
      play.setAttribute('aria-pressed', 'false');
      return;
    }
    play.textContent = 'PAUSE';
    play.setAttribute('aria-pressed', 'true');
    timer = setInterval(() => step(1), 700);
  }

  range.addEventListener('input', (event) => render(event.target.value));
  root.querySelector('[data-qc-prev]').addEventListener('click', () => step(-1));
  root.querySelector('[data-qc-next]').addEventListener('click', () => step(1));
  root.querySelector('[data-qc-twin]').addEventListener('click', nextTwin);
  play.addEventListener('click', togglePlay);
  render(2);
})();
