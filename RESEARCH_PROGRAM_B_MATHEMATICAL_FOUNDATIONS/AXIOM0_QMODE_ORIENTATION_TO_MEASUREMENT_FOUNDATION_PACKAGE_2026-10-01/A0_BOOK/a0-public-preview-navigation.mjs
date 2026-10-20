// Presentation-only navigation for the bounded public test, not a new A0 route.
export function withPublicNavigation(html, {play = false} = {}) {
  const controls = play ? `<label>Welt <select id="previewWorld" aria-label="Welt wählen"><option value="life">LIFE</option><option value="domains">Three Domains</option><option value="numbers">Numbers</option></select></label><label>Ansicht <select id="previewView" aria-label="Ansicht wählen"></select></label>` : `<label>Auf dieser Seite <select id="previewSection" aria-label="Kapitel wählen"><option value="reading-paths">Lesewege</option><option value="field-geometry-book">Buch · Leo / J–L / G–H</option><option value="instruments">Instrumente</option><option value="gh-hinge">GH-Hinge</option><option value="ghReturnGateTitle">Return Gate</option></select></label><a href="#" class="preview-top">↑ Seitenanfang</a>`;
  const navigation = `<!-- public-test-navigation:start -->
<style>
:root{--preview-nav-height:112px}html{scroll-padding-top:calc(var(--preview-nav-height) + 12px)}
#previewNav{position:sticky;top:0;z-index:2000;background:#071823;color:#edfaff;border-bottom:1px solid #4c7184;padding:env(safe-area-inset-top,0px) 10px 6px;font:14px/1.3 system-ui,sans-serif;isolation:isolate}
#previewNav .preview-links{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:4px}
#previewNav a{display:flex;align-items:center;justify-content:center;min-height:44px;color:#e7faff;text-decoration:none;border-radius:6px;border:1px solid #365568;padding:4px 6px;font-size:13px;white-space:nowrap}
#previewNav a[aria-current=page]{border-color:#ffca55;color:#ffca55}
#previewNav .preview-controls{display:flex;gap:8px;align-items:center;margin-top:5px;min-width:0}
#previewNav label{display:flex;align-items:center;gap:5px;flex:1;min-width:0;font-size:12px}
#previewNav select{min-width:0;width:100%;min-height:44px;border:1px solid #4c7184;border-radius:6px;background:#102a39;color:#fff;font:16px system-ui;padding:6px}
#previewNav a:focus-visible,#previewNav select:focus-visible{outline:2px solid #ffca55;outline-offset:2px}
.play-dock{top:var(--preview-nav-height)}header.top.a0-context-ready,header.topbar.a0-context-ready{top:var(--preview-nav-height)}
@media(min-width:701px){#previewNav{display:flex;align-items:center;gap:16px}#previewNav .preview-links{min-width:350px}#previewNav .preview-controls{flex:1;margin-top:0;max-width:650px}}
@media(max-width:700px){.play-head,header.top.a0-context-ready,header.topbar.a0-context-ready{display:none!important}.play-lenses>div:not([hidden]){flex-wrap:nowrap;overflow-x:auto;max-width:100%;padding-bottom:8px}.play-lenses>div button{white-space:nowrap;flex-shrink:0}.play-dock{scroll-margin-top:var(--preview-nav-height)}#previewNav .preview-top{font-size:12px}}
</style>
<nav id="previewNav" aria-label="Öffentliche Test-Navigation"><div class="preview-links"><a href="../index.html#arkade">ARKADE</a><a href="A0_GAME_OF_WORLDS_PLAY.html#numbers"${play ? ' aria-current="page"' : ''}>PLAY</a><a href="A0_NUMBERMAGICK_GRID_RESEARCH.html#field-geometry-book"${!play ? ' aria-current="page"' : ''}>Buch</a><a href="A0_NUMBERMAGICK_GRID_RESEARCH.html#ghReturnGateTitle">Return</a></div><div class="preview-controls">${controls}</div></nav>
<!-- public-test-navigation:end -->`;
  const runtime = `<script id="previewNavigationRuntime">
(() => {
 const nav=document.getElementById('previewNav');
 const size=()=>document.documentElement.style.setProperty('--preview-nav-height',Math.ceil(nav.getBoundingClientRect().height)+'px');
 size();if(typeof ResizeObserver!=='undefined')new ResizeObserver(size).observe(nav);window.addEventListener('resize',size);
 const world=document.getElementById('previewWorld'),view=document.getElementById('previewView');
 if(world&&view){
  const picks={life:'pickLife',domains:'pickDomains',numbers:'pickNumbers'},groups={life:'lifeLenses',domains:'domainLenses',numbers:'numberLenses'};
  function sync(){const kind=Object.keys(picks).find(k=>document.getElementById(picks[k]).getAttribute('aria-pressed')==='true')||'life';world.value=kind;const buttons=[...document.querySelectorAll('#'+groups[kind]+' [data-view]')];const signature=kind+':'+buttons.map(b=>b.dataset.view).join(',');if(view.dataset.signature!==signature){view.replaceChildren(...buttons.map(b=>new Option(b.textContent,b.dataset.view)));view.dataset.signature=signature;}view.value=buttons.find(b=>b.getAttribute('aria-pressed')==='true')?.dataset.view||buttons[0]?.dataset.view;}
  world.addEventListener('change',()=>{document.getElementById(picks[world.value]).click();sync();});
  view.addEventListener('change',()=>document.querySelector('#'+groups[world.value]+' [data-view="'+view.value+'"]').click());
  const observer=new MutationObserver(sync);for(const id of [...Object.values(picks),...Object.values(groups)])observer.observe(document.getElementById(id),{attributes:true,subtree:true,attributeFilter:['aria-pressed','hidden']});sync();
 }
 const section=document.getElementById('previewSection');if(section){section.addEventListener('change',()=>{location.hash=section.value;});const sync=()=>{const key=location.hash.slice(1);if([...section.options].some(o=>o.value===key))section.value=key;};window.addEventListener('hashchange',sync);sync();}
})();
</script>`;
  html = html.replace(/<!-- public-test-navigation:start -->[\s\S]*?<!-- public-test-navigation:end -->\s*/g, '').replace(/<script id="previewNavigationRuntime">[\s\S]*?<\/script>/g, '');
  return html.replace(/<body([^>]*)>/, '<body$1>'+navigation).replace('</body>', runtime+'</body>');
}
