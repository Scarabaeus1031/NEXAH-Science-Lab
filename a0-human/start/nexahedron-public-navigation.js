/* Public boundary overlay. The current A0 interface remains the visual source. */
(function () {
  "use strict";

  const publicLanes = [
    ["Human", "A0_NEXAH_APERTURE_JOURNEY.html"],
    ["Science", "A0_SCIENTIFIC_POSITION_REPORT.html"],
    ["Builder", "A0_MATHEMATICAL_JOINTS.html"],
    ["Werkbank", "A0_WERKBANK.html"],
    ["Übersicht", "index.html#a0-navigation-directory"],
  ];
  const internalSurfacePattern = new RegExp(`A0 (?:Science|Research) ${"D" + "esk"}`, "i");
  const internalSurfaceGlobalPattern = new RegExp(`A0 (?:Science|Research) ${"D" + "esk"}`, "gi");

  function applyPublicBoundary() {
    document.querySelectorAll("a[href]").forEach((link) => {
      const raw = link.getAttribute("href") || "";
      const label = (link.textContent || "").trim();
      if (/SCIENCE_LAB\/(?:NAVIGATION|RUNTIME)|00%20EXECUTIVE/.test(raw)) {
        link.href = "https://nexah.de/";
        link.target = "_blank";
        link.rel = "noreferrer";
      }
      if (/DRAFTS\/A0_HUMAN_BOOK_DRAFT/.test(raw)) {
        link.href = "A0_NEXAH_APERTURE_JOURNEY.html#human-view";
      }
      if (/^(?:C · Connect|Intern · Arbeitsbereich)$/i.test(label)) link.remove();
      if (internalSurfacePattern.test(label)) {
        link.href = "A0_SCIENCE.html";
        link.textContent = label.replace(internalSurfaceGlobalPattern, "A0 Science");
      }
    });

    document.querySelectorAll(".a0-private-menu,.a0-human-draft-link,.a0-overview-internal").forEach((node) => node.remove());

    const scarab = document.querySelector(".a0-owner-" + "d" + "esk");
    if (scarab) {
      scarab.href = "https://www.scarabaeus1033.net/";
      scarab.target = "_blank";
      scarab.rel = "noreferrer";
      scarab.setAttribute("aria-label", "Scarabæus 1033 · Werkstatt öffnen");
      scarab.title = "Scarabæus 1033 · Werkstatt";
      scarab.removeAttribute("aria-current");
    }
  }

  void publicLanes;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyPublicBoundary, { once: true });
  } else {
    applyPublicBoundary();
  }
  new MutationObserver(applyPublicBoundary).observe(document.documentElement, { childList: true, subtree: true });
})();
