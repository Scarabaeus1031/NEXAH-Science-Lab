(function () {
  'use strict';

  const section = document.getElementById('pentagonBodyExhibitionBench');
  const openButton = document.getElementById('pentagonExhibitionOpen');
  const closeButton = document.getElementById('pentagonExhibitionClose');
  const host = document.getElementById('pentagonExhibitionFrameHost');
  const status = document.getElementById('pentagonExhibitionStatus');
  if (!section || !openButton || !closeButton || !host || !status) return;

  const source = 'A0_PENTAGON_BODY_EXHIBITION.html#science-deck';

  function openExhibition() {
    let frame = host.querySelector('iframe');
    if (!frame) {
      frame = document.createElement('iframe');
      frame.title = 'Pentagon Body Exhibition · Science View';
      frame.src = source;
      frame.loading = 'eager';
      frame.addEventListener('load', function () {
        status.textContent = 'Ausstellung geladen · Schließen kehrt an diese Stelle der Bench zurück.';
      }, { once: true });
      host.replaceChildren(frame);
      closeButton.disabled = false;
      openButton.textContent = 'Ausstellung fokussieren';
      status.textContent = 'Ausstellung wird geladen …';
    }
    frame.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function closeExhibition() {
    host.replaceChildren();
    closeButton.disabled = true;
    openButton.textContent = 'Ausstellung in der Bench öffnen';
    status.textContent = 'Fenster geschlossen · Bench-Position gehalten; die lokale Ausstellungssitzung wurde entladen.';
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    openButton.focus({ preventScroll: true });
  }

  openButton.addEventListener('click', openExhibition);
  closeButton.addEventListener('click', closeExhibition);
}());
