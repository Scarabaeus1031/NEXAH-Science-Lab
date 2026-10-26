(function () {
  'use strict';

  const card = document.getElementById('pentagon-lantern-finding-candidate-20261025');
  if (!card || card.dataset.exhibitionBound === 'true') return;

  const buttons = card.querySelector('.btns');
  const boundary = card.querySelector('.boundary');
  if (!buttons || !boundary) return;

  const exhibition = document.createElement('a');
  exhibition.className = 'btn gold';
  exhibition.href = 'A0_PENTAGON_BODY_EXHIBITION.html#science-deck';
  exhibition.textContent = 'Exhibition / Science View';

  const bench = document.createElement('a');
  bench.className = 'btn';
  bench.href = 'A0_ORIENTATION_CONTROLLER_BENCH.html#pentagonBodyExhibitionBench';
  bench.textContent = 'Bench View';

  buttons.prepend(bench);
  buttons.prepend(exhibition);

  const note = document.createElement('p');
  note.className = 'desk-view-boundary';
  note.innerHTML = '<strong>View return:</strong> Exhibition und Bench ordnen Direct, Context und Candidate visuell. Sie erzeugen keinen neuen wissenschaftlichen Status.';
  boundary.prepend(note);
  card.dataset.exhibitionBound = 'true';
}());
