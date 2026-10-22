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
  brand.innerHTML = "NEXAHEDRON <span>· A0</span>";
  brand.setAttribute("aria-label", "NEXAHEDRON · A0 Startseite");

  const nav = document.createElement("nav");
  nav.className = "a0-public-bridges";
  nav.setAttribute("aria-label", "NEXAH Ecosystem");

  const links = [
    [new URL("instruments/A0_NEXAH_APERTURE_JOURNEY.html#human-view", a0RootUrl).href, "Human", "Die spielbare A0-Reise", false],
    ["https://nexah.de/", "Science", "NEXAH · Methode und Forschung", true],
    ["https://scarabaeus1033.net/", "Builder", "Scarabæus · Werkstatt", true],
    ["#wegweiser", "Übersicht", "A0 Wege und Kapitel", false],
    ["https://nexahedron.com/about", "About", "NEXAHEDRON im Ecosystem", true],
  ];

  links.forEach(([href, label, description, external], index) => {
    const link = document.createElement("a");
    link.href = href;
    link.innerHTML = `<strong>${label}${external ? " ↗" : ""}</strong><span>${description}</span>`;
    if (external) {
      link.target = "_blank";
      link.rel = "noreferrer";
    } else if (href.startsWith("/")) {
      link.target = "_top";
    }
    if (index === 0) link.dataset.accent = "human";
    nav.append(link);
  });

  header.replaceChildren(brand, nav);
  header.className = "top a0-public-header";
})();
