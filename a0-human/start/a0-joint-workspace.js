/* One reading frame over existing sources; no new scientific identity or copied tool logic. */
(() => {
  const views = {
    overview: {title:'Gesamtkarte', description:'Gesamtkarte: Felder, Perspektiven, Fugen-Builder und Ledger.'},
    mathfield: {title:'Mathfield · mathematische Werkstatt', file:'A0_MATHEMATICAL_JOINTS.html', description:'Mathfield: Träger, Grids, Maps und mathematische Fugen präzisieren.'},
    pascal: {title:'Pascal / Pentagon · Operator-Faden', file:'A0_PASCAL_PENTAGON_OPERATOR_JOINTS.html', description:'Pascal / Pentagon: Ein konkreter Faden von Quelltafeln über Operatoren zu Views und offenen Übergängen.'},
    applications: {title:'Anwendungen / Return · Prüfbank', file:'A0_JOINT_APPLICATION_DEMONSTRATOR.html', description:'Anwendungen / Return: Adressen, Projektionen, Informationsverlust und Rückwege praktisch prüfen.'}
  };
  const keyFromHash = hash => Object.keys(views).find(key => hash === `#workspace-${key}`) || 'overview';
  if (typeof module !== 'undefined' && module.exports) { module.exports = {views, keyFromHash}; return; }
  const root = document.getElementById('joint-workspace');
  if (!root) return;
  const atlas = document.getElementById('jointAtlasContent');
  const host = document.getElementById('jointWorkspacePanels');
  const description = document.getElementById('jointWorkspaceDescription');
  const tabs = [...root.querySelectorAll('[data-joint-view]')];
  const panels = new Map();
  function select(key) {
    if (!views[key]) key = 'overview';
    atlas.hidden = key !== 'overview';
    description.textContent = views[key].description;
    tabs.forEach(tab => tab.setAttribute('aria-current', String(tab.dataset.jointView === key)));
    if (key !== 'overview' && !panels.has(key)) {
      const view = views[key];
      const panel = document.createElement('section');
      panel.className = 'joint-workspace-panel';
      panel.setAttribute('aria-label', view.title);
      const note = document.createElement('p');
      note.append('Bestehende Quellseite · ');
      const standalone = document.createElement('a');
      standalone.href = view.file;
      standalone.target = '_blank';
      standalone.rel = 'noopener';
      standalone.textContent = 'Einzeln öffnen ↗';
      note.append(standalone);
      const frame = document.createElement('iframe');
      frame.title = view.title;
      frame.src = `${view.file}?embed=fugen`;
      panel.append(note, frame);
      host.append(panel);
      panels.set(key, panel);
    }
    panels.forEach((panel, panelKey) => { panel.hidden = panelKey !== key; });
  }
  tabs.forEach(tab => tab.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const hash = `#workspace-${tab.dataset.jointView}`;
    if (location.hash !== hash) history.pushState(null, '', hash);
    select(tab.dataset.jointView);
  }));
  const restore = () => select(keyFromHash(location.hash));
  window.addEventListener('hashchange', restore);
  window.addEventListener('popstate', restore);
  restore();
})();
