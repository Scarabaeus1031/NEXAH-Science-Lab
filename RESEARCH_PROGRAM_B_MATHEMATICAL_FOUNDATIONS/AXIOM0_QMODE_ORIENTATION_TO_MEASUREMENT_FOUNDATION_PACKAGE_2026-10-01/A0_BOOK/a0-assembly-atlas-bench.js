(function () {
  'use strict';

  const section = document.getElementById('assemblyAtlasBench');
  const openButton = document.getElementById('assemblyAtlasOpen');
  const closeButton = document.getElementById('assemblyAtlasClose');
  const host = document.getElementById('assemblyAtlasFrameHost');
  const status = document.getElementById('assemblyAtlasStatus');
  if (!section || !openButton || !closeButton || !host || !status) return;

  function openAtlas() {
    let frame = host.querySelector('iframe');
    if (!frame) {
      frame = document.createElement('iframe');
      frame.title = 'A0 Assembly Atlas · interaktiver Bauplan';
      frame.src = 'A0_ASSEMBLY_ATLAS.html#map';
      frame.loading = 'eager';
      frame.addEventListener('load', function () {
        status.textContent = 'Atlas geladen · Nodes reagieren auf Hover, Fokus und Klick.';
      }, { once: true });
      host.replaceChildren(frame);
      closeButton.disabled = false;
      openButton.textContent = 'Atlas fokussieren';
      status.textContent = 'Assembly Atlas wird geladen …';
    }
    frame.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function closeAtlas() {
    host.replaceChildren();
    closeButton.disabled = true;
    openButton.textContent = 'Atlas in der Bench öffnen';
    status.textContent = 'Atlas geschlossen · die Bench-Position bleibt erhalten.';
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    openButton.focus({ preventScroll: true });
  }

  openButton.addEventListener('click', openAtlas);
  closeButton.addEventListener('click', closeAtlas);
}());
