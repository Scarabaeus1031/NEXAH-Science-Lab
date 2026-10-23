/* Public boundary overlay. The current A0 interface remains the visual source. */
(function () {
  "use strict";

  const publicLanes = [
    ["Human", "A0_NEXAH_APERTURE_JOURNEY.html"],
    ["Science", "A0_SCIENTIFIC_POSITION_REPORT.html"],
    ["Builder", "A0_MATHEMATICAL_JOINTS.html"],
    ["Werkbank", "A0_WERKBANK.html"],
    ["Connect", "NEXAH_C_CONNECT.html"],
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
      if (/^Intern · Arbeitsbereich$/i.test(label)) link.remove();
      if (internalSurfacePattern.test(label)) {
        link.href = "A0_SCIENCE.html";
        link.textContent = label.replace(internalSurfaceGlobalPattern, "A0 Science");
      }
    });

    document.querySelectorAll(".a0-private-menu,.a0-human-draft-link,.a0-overview-internal").forEach((node) => node.remove());

    if (!document.getElementById("nexahPublicConnectStyle")) {
      const style = document.createElement("style");
      style.id = "nexahPublicConnectStyle";
      style.textContent = ".nexah-public-connect{align-items:center;border:0;border-radius:50%;display:inline-flex;height:34px;justify-content:center;padding:0;text-decoration:none;width:34px}.nexah-public-connect>span[aria-hidden=true]{background:radial-gradient(circle at 34% 28%,#ffd2e8 0 9%,#f26bae 18%,#e14996 48%,#782551 100%);border:1px solid rgba(255,180,218,.75);border-radius:50%;box-shadow:0 2px 8px rgba(240,79,167,.2);display:block;height:18px;transition:transform .18s ease,box-shadow .18s ease;width:18px}.nexah-public-connect:hover>span[aria-hidden=true],.nexah-public-connect:focus-visible>span[aria-hidden=true]{box-shadow:0 0 0 4px rgba(240,79,167,.12),0 3px 10px rgba(240,79,167,.28);transform:scale(1.08)}.nexah-public-connect:focus-visible{outline:1px solid #f04fa7;outline-offset:2px}.nexah-public-connect-label{height:1px;overflow:hidden;position:absolute;width:1px;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap}";
      document.head.append(style);
    }

    const header = document.querySelector("header.a0-context-ready");
    const overview = header?.querySelector(".a0-overview-menu");
    if (header && overview && !header.querySelector(".nexah-public-connect")) {
      const connect = document.createElement("a");
      connect.className = "nexah-public-connect";
      connect.href = "NEXAH_C_CONNECT.html";
      connect.innerHTML = '<span aria-hidden="true"></span><span class="nexah-public-connect-label">C · Connect</span>';
      connect.setAttribute("aria-label", "C Connect · öffentliche Übergangskarte öffnen");
      connect.title = "C Connect";
      overview.before(connect);
    }

    const scarab = document.querySelector(".a0-owner-" + "d" + "esk");
    if (scarab) {
      scarab.href = "https://www.scarabaeus1033.net";
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
