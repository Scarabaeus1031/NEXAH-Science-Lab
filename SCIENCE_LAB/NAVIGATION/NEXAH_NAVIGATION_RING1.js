(() => {
  'use strict';
  const ownScript = document.currentScript;
  const moduleId = ownScript?.dataset.module;
  const registry = globalThis.NEXAH_MODULE_REGISTRY_RING1;
  if (!ownScript || !registry || !registry.modules[moduleId]) {
    console.warn('NEXAH Navigation Ring 1: registry or module id missing');
    return;
  }

  const root = new URL('../', ownScript.src);
  const current = registry.modules[moduleId];
  const urlFor = path => new URL(path, root).href;
  const atlasFor = route => `${urlFor(registry.modules[registry.atlas].path)}#${route || 'all'}`;
  const escapeHtml = value => String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const link = (label, href, kind = '') => `<a class="link ${kind}" href="${escapeHtml(href)}">${escapeHtml(label)}</a>`;
  const related = current.related.map(id => registry.modules[id]).filter(Boolean);

  class NexahNavigationRing extends HTMLElement {
    connectedCallback() {
      if (this.shadowRoot) return;
      const shadow = this.attachShadow({mode:'open'});
      const relatedLinks = related.map(item => link(item.short, urlFor(item.path))).join('');
      shadow.innerHTML = `
        <style>
          :host{display:block;position:relative;z-index:2147480000;margin:0 0 12px;color:#edf5f8;font:12px/1.35 Inter,ui-sans-serif,system-ui,-apple-system,sans-serif}
          :host([data-mode="immersive"]){position:fixed;top:10px;left:50%;width:min(720px,calc(100vw - 32px));margin:0;transform:translateX(-50%);z-index:2147480000}
          *{box-sizing:border-box}.shell{border:1px solid rgba(86,215,239,.32);border-radius:10px;background:rgba(5,14,23,.94);box-shadow:0 12px 36px rgba(0,0,0,.32);backdrop-filter:blur(14px);overflow:hidden}
          .bar{min-height:42px;display:flex;align-items:center;gap:9px;padding:7px 9px;flex-wrap:wrap}.ring{color:#f2bd55;font-weight:800;letter-spacing:.1em;text-transform:uppercase;white-space:nowrap}.current{font-weight:750;white-space:nowrap}.chain{color:#56d7ef;font:700 11px/1.35 ui-monospace,SFMono-Regular,Menlo,monospace;overflow-wrap:anywhere;flex:1 1 220px}
          a,button{min-height:30px;border:1px solid #28475c;border-radius:999px;background:#0a1723;color:#edf5f8;padding:6px 10px;font:inherit;text-decoration:none;display:inline-flex;align-items:center;justify-content:center}a:hover,a:focus-visible,button:hover,button:focus-visible{border-color:#56d7ef;outline:2px solid transparent}a.primary{border-color:#f2bd55;color:#f2bd55}button{cursor:pointer}.toggle[aria-expanded="true"]{background:#f2bd55;border-color:#f2bd55;color:#07131e;font-weight:750}
          .drawer{border-top:1px solid #28475c;padding:11px}.drawer[hidden]{display:none}.why{margin:0;color:#a9bdcc;font-size:12px}.why strong{color:#edf5f8}.meta{display:grid;grid-template-columns:minmax(110px,.35fr) 1fr;gap:7px 12px;margin-top:10px}.label{color:#f2bd55;font-weight:750;text-transform:uppercase;letter-spacing:.06em}.links{display:flex;gap:7px;flex-wrap:wrap}
          @media(max-width:680px){:host([data-mode="immersive"]){top:6px;width:calc(100vw - 12px)}.bar{gap:6px}.ring{font-size:10px}.current{max-width:46vw;overflow:hidden;text-overflow:ellipsis}.chain{order:5;flex-basis:100%;font-size:10px}.bar>a{display:none}.meta{grid-template-columns:1fr}.label{margin-top:4px}}
        </style>
        <nav class="shell" aria-label="NEXAH Navigation Ring 1">
          <div class="bar">
            <span class="ring">NEXAH · Ring 1</span>
            <span class="current">${escapeHtml(current.short)}</span>
            <span class="chain">${escapeHtml(current.chain)}</span>
            ${link('Atlas', atlasFor(current.route), 'primary')}
            ${link('Mission Control', urlFor(registry.modules[registry.missionControl].path))}
            <button class="toggle" type="button" aria-expanded="false" aria-controls="nexah-ring-detail">Verbindungen</button>
          </div>
          <div class="drawer" id="nexah-ring-detail" hidden>
            <p class="why"><strong>Warum verbunden:</strong> ${escapeHtml(current.explanation)}</p>
            <div class="meta">
              <span class="label">Route</span><span class="chain">${escapeHtml(current.chain)}</span>
              <span class="label">Weiter</span><span class="links">${relatedLinks}</span>
              <span class="label">Record</span><span class="links">${link('Modulakte öffnen', urlFor(current.record))}${link('Route im Atlas', atlasFor(current.route), 'primary')}</span>
            </div>
          </div>
        </nav>`;
      const toggle = shadow.querySelector('.toggle');
      const drawer = shadow.querySelector('.drawer');
      toggle.addEventListener('click', () => {
        const open = toggle.getAttribute('aria-expanded') !== 'true';
        toggle.setAttribute('aria-expanded', String(open));
        drawer.hidden = !open;
      });
    }
  }

  customElements.define('nexah-navigation-ring', NexahNavigationRing);
  const element = document.createElement('nexah-navigation-ring');
  element.dataset.mode = current.mode;
  const target = current.mode === 'flow' ? document.querySelector('main') : document.body;
  if (current.mode === 'flow' && target) target.prepend(element); else document.body.append(element);
})();
