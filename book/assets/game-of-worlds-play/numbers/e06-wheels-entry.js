(() => {
  'use strict';

  const params = new URLSearchParams(window.location.search);
  const target = document.getElementById('wheelMod19Title');
  const numbers = window.GameOfNumbersView;
  if (!numbers || !target || params.get('view') !== 'wheels' ||
      params.get('meter') !== '7/8' || window.location.hash !== '#wheelMod19Title') return;

  numbers.command('rule', 'wheels');
  numbers.command('view', 'wheels');
  numbers.command('wheel-meter', '7/8');

  target.tabIndex = -1;
  requestAnimationFrame(() => {
    target.focus({preventScroll: true});
    target.scrollIntoView({block: 'start'});
  });
})();
