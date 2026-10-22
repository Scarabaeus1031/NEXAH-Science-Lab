/* Public presentation transform. The A0 source remains unchanged. */
(function () {
  "use strict";

  const header = document.querySelector("header.top");
  if (!header) return;

  // Der Einstieg muss sowohl unter nexahedron.com als auch unter einer
  // GitHub-Project-Page funktionieren. Root-relative Links ("/") verlassen
  // auf GitHub Pages sonst das Repository und enden auf der Account-404.
  const currentScriptUrl = new URL(document.currentScript?.src || location.href);
  const a0StartUrl = new URL("./", currentScriptUrl);
  const a0RootUrl = new URL("../", a0StartUrl);

  const brand = document.createElement("a");
  brand.className = "brand a0-public-brand";
  brand.href = a0StartUrl.href;
  brand.target = "_top";
  brand.textContent = "NEXAH";
  brand.setAttribute("aria-label", "NEXAH · A0 Startseite");

  const nav = document.createElement("nav");
  nav.className = "a0-public-bridges";
  nav.setAttribute("aria-label", "NEXAH Ecosystem");

  const links = [
    [new URL("instruments/A0_NEXAH_APERTURE_JOURNEY.html#human-view", a0RootUrl).href, "Human", false],
    ["A0_SCIENTIFIC_POSITION_REPORT.html", "Science", false],
    ["A0_MATHEMATICAL_JOINTS.html", "Builder", false],
    ["#arkade-tool", "Werkbank", false],
  ];

  links.forEach(([href, label, external]) => {
    const link = document.createElement("a");
    link.href = href;
    link.innerHTML = `<strong>${label} <span aria-hidden="true">+</span></strong>`;
    if (external) {
      link.target = "_blank";
      link.rel = "noreferrer";
    }
    if (label === "Science") link.setAttribute("aria-current", "page");
    nav.append(link);
  });

  const tools = document.createElement("div");
  tools.className = "a0-public-tools";

  const overview = document.createElement("a");
  overview.className = "a0-public-overview";
  overview.href = "#wegweiser";
  overview.innerHTML = "<strong>Übersicht<span aria-hidden=\"true\">+</span></strong>";

  const scarab = document.createElement("a");
  scarab.className = "a0-public-scarab-link";
  scarab.href = "https://www.scarabaeus1033.net/";
  scarab.target = "_blank";
  scarab.rel = "noreferrer";
  scarab.setAttribute("aria-label", "Scarabæus 1033 · Werkstatt öffnen");
  scarab.title = "Scarabæus 1033 · Werkstatt";
  scarab.innerHTML = '<svg class="a0-public-scarab" viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="4" r="2.2"/><path d="M16 7c-4.2 0-6.5 3.2-6.5 7.7V20c0 4.5 2.3 7 6.5 9 4.2-2 6.5-4.5 6.5-9v-5.3C22.5 10.2 20.2 7 16 7Z"/><path d="M10 11C5.8 8.7 2.7 11 3.5 15.2c.7 3.6 3.1 5.8 6 6.2M22 11c4.2-2.3 7.3 0 6.5 4.2-.7 3.6-3.1 5.8-6 6.2M10 15H5M22 15h5M10 20l-5 3M22 20l5 3M13 8 9 4M19 8l4-4M10 24l-3 4M22 24l3 4"/></svg>';

  tools.append(overview, scarab);
  header.replaceChildren(brand, nav, tools);
  header.className = "top a0-public-header";
})();
