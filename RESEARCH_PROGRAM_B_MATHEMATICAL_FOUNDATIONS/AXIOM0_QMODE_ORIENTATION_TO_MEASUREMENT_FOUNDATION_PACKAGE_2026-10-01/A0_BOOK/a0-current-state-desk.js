(() => {
  const cards = [
    {
      channels: "science",
      overline: "Science · Authority",
      state: "Current",
      title: "A0 Science Desk",
      copy: "Hält Evidenzstatus, Findings-Triage, Claim Ceiling und den nächsten wissenschaftlich zulässigen Schritt.",
      gate: "Nur ausgewählte Review- oder Release-Pakete weiterführen.",
      exit: "Kein direkter Human-/NEXAHEDRON-Exit.",
      links: [["#science-currentness-20261103", "Currentness"], ["../../../SCIENCE_LAB/NAVIGATION/APP/index.html#a0-orientation-evidence", "Source Graph"]]
    },
    {
      channels: "science builder",
      overline: "Science Flagship · Instrument",
      state: "Review",
      title: "Z100 Stoffregister",
      copy: "Carrier und drei Ansichten sind stabil rückgebunden. Der Build ist für diesen Return beendet.",
      gate: "Kuratieren und Claim Review; Human- oder Thermal-Test nur nach separatem Intake.",
      exit: "Zuerst Science-/nexah.de-Cut entscheiden; keine automatische NEXAHEDRON-Pipeline.",
      links: [["DRAFTS/A0_PERIODIC_CARRIER_Z100_2026-11-03.html#game-of-worlds-carrier-binding", "Instrument"], ["?desk=returns#periodic-carrier-z100-science-return-20261103", "Return"]]
    },
    {
      channels: "builder machina human",
      overline: "Singuläres Flagship House",
      state: "Select cut",
      title: "THE MACHINA",
      copy: "729/729 plus 49/49 Checks sind grün. Die Maschine bleibt frozen; jetzt zählt Auswahl statt weiterer Ausbau.",
      gate: "Eine Impact Tour oder einen Exhibition Cut mit Frage, fairer Baseline und Return auswählen.",
      exit: "Stärkster Kandidat für ein späteres NEXAHEDRON-Handoff; noch nicht ausgewählt.",
      links: [["A0_MACHINA_COCKPIT.html#benchFoyer", "MACHINA"], ["?desk=returns#machina-bridge-tour-addendum-20261103", "Return"]]
    },
    {
      channels: "builder machina",
      overline: "Machine Configuration",
      state: "Frozen",
      title: "IOI Leaf Fold × Open Book",
      copy: "Reproduzierbare interne Machine Configuration mit drei Arbeitsfenstern; kein eigenständiges Instrument.",
      gate: "Nur als Szene innerhalb eines ausgewählten Machina-Cuts einsetzen.",
      exit: "Kein eigener NEXAHEDRON-Exit.",
      links: [["DRAFTS/A0_IOI_LEAF_FOLD_OPEN_BOOK_START_2026-11-02.html", "Machine"], ["?desk=returns#ioi-leaf-fold-open-book-machine-freeze-20261102", "Return"]]
    },
    {
      channels: "science",
      overline: "External Review Candidate",
      state: "Review-ready",
      title: "SCC-003-R1",
      copy: "Das begrenzte Review-Paket ist vorbereitet. Kontakt, Übermittlung und Veröffentlichung benötigen ein Owner-Gate.",
      gate: "Reviewerprofil, exakte Revision und Qualifikationskriterien festlegen.",
      exit: "Externes Review vor jeder öffentlichen Human-Erzählung.",
      links: [["A0_SCC_003_PASCAL_PENTAGON_PAPER.html", "Paper"], ["#current-work", "Desk Record"]]
    },
  ];

  const cardHtml = card => `<article class="current-state-card${card.human ? " current-state-human" : ""}" data-current-channel="${card.channels}"><header><small>${card.overline}</small><span class="state-chip">${card.state}</span></header><h3>${card.title}</h3><p>${card.copy}</p><dl><div><dt>Gate</dt><dd>${card.gate}</dd></div><div><dt>Exit</dt><dd>${card.exit}</dd></div></dl><div class="btns">${card.links.map(([href, label], index) => `<a class="btn${index === 0 ? " gold" : ""}" href="${href}">${label}</a>`).join("")}</div></article>`;

  const mount = () => {
    const currentness = document.getElementById("science-currentness-20261103");
    if (!currentness || document.getElementById("a0-current-state")) return;
    const section = document.createElement("section");
    section.className = "a0-current-state";
    section.id = "a0-current-state";
    section.setAttribute("aria-labelledby", "a0CurrentStateTitle");
    section.innerHTML = `<div class="spread"><header class="head"><div class="no">NOW / EXIT</div><div><div class="label">A0 Current State · Desk-Linse · 03.11.2026</div><h2 id="a0CurrentStateTitle">Was ist draußen. Was ist Staging. Was muss durch Mission Control.</h2><p class="sub">Eine gemeinsame Desk-Leseebene über Science, Builder und THE MACHINA. Die A0 Human View bleibt als eigener ausklappbarer Einstieg in der globalen Navigation; hier erscheint nur ihr Exit- und Freigabekontext.</p></div></header><nav class="current-state-filters" aria-label="Current State nach Kanal filtern"><button type="button" data-current-filter="all" aria-pressed="true">Alles</button><button type="button" data-current-filter="science" aria-pressed="false">Science</button><button type="button" data-current-filter="builder" aria-pressed="false">Builder</button><button type="button" data-current-filter="machina" aria-pressed="false">THE MACHINA</button><a href="A0_NEXAH_APERTURE_JOURNEY.html#a0-human-overview">A0 Human View ↗</a><a href="A0_CURRENT_STATE.json">Machine-readable JSON ↗</a></nav><div class="current-state-summary" aria-label="Current State Zusammenfassung"><article><small>Science</small><strong>25 Records · 0 neue Promotions</strong><p>Keine aktive Research Cycle. Review- und Claim-Gates bleiben getrennt.</p></article><article><small>Builder</small><strong>23 / 23 · 0 aktive Builds</strong><p>Der aktuelle Bestand ist gebaut; kuratieren, prüfen oder HOLD.</p></article><article><small>Exit</small><strong>1 starker Human-Kandidat</strong><p>THE MACHINA Impact Cut ist auswählbar, aber noch nicht für NEXAHEDRON aktiviert.</p></article></div><div class="current-state-grid">${cards.map(cardHtml).join("")}</div><section class="exit-lens" id="nexahedron-exit-delta" aria-labelledby="nexahedronExitTitle"><header><div><small>Mission Control Exit · NEXAHEDRON Delta</small><h3 id="nexahedronExitTitle">Nicht hineinholen. Kontrolliert hinausgeben.</h3></div><p>NEXAHEDRON bleibt eine getrennte, bereits live und Owner-abgenommene Human Experience. Diese Desk-Linse zeigt nur, welches A0-Paket als nächstes hinausgehen könnte — ohne Deployment, Outreach oder Publikation zu autorisieren.</p></header><div class="exit-state-grid"><article class="is-live"><b>Draußen · stabil</b><span>nexah.de und nexahedron.com sind live. Für NEXAHEDRON besteht aktuell kein aktiver Website-Cut.</span></article><article class="is-stage"><b>Staging · auswählbar</b><span>THE MACHINA Impact Tour ist der stärkste Human-Kandidat. Z100 ist primär ein Science-Cut; IOI nur eine mögliche Szene.</span></article><article class="is-gate"><b>Gate · nicht autorisiert</b><span>Kontakt, Outreach, Publikation und Deployment bleiben STOP, bis Mission Control einen konkreten Cut freigibt.</span></article></div><div class="exit-sequence" aria-label="NEXAHEDRON Exit Sequenz"><span data-step="01">Einen Cut wählen</span><span data-step="02">Frage + Audience</span><span data-step="03">Baseline + Return</span><span data-step="04">Claim + Access prüfen</span><span data-step="05">Owner Gate</span><span data-step="06">Handoff + Receipt</span></div><div class="btns" style="padding:18px"><a class="btn gold" href="../../../../../00%20EXECUTIVE/NEXAH-Mission-Control/INTERNAL_NAVIGATOR/index.html#action-board">Mission Control · Exit wählen</a><a class="btn" href="../../../../../10%20NEXAH%20CORE/NEXAH/BUILDER/B0_BUILDER_DECK/public-field.html">Public Field Status</a><a class="btn" href="A0_CURRENT_STATE.json">Current State JSON</a></div></section><div class="desk-now-boundary"><strong>Authority boundary:</strong> Diese Seite ist eine interne Currentness-Projektion. Sie verändert keine Source-Identität, Graphrelation, Study, Finding, Publikations- oder Deployment-Autorität.</div></div>`;
    currentness.after(section);

    const overview = document.querySelector(".desk-direct-grid section:first-child");
    if (overview && !overview.querySelector('a[href="#a0-current-state"]')) {
      const link = document.createElement("a");
      link.href = "#a0-current-state";
      link.textContent = "Current State · Häuser & Exit";
      overview.children[1]?.after(link);
    }

    const buttons = [...section.querySelectorAll("[data-current-filter]")];
    const stateCards = [...section.querySelectorAll("[data-current-channel]")];
    const applyFilter = channel => {
      const selected = ["science", "builder", "machina"].includes(channel) ? channel : "all";
      buttons.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.currentFilter === selected)));
      stateCards.forEach(card => { card.hidden = selected !== "all" && !card.dataset.currentChannel.split(" ").includes(selected); });
      document.body.dataset.currentStateChannel = selected;
    };
    buttons.forEach(button => button.addEventListener("click", () => {
      const url = new URL(location.href);
      url.searchParams.set("desk", "overview");
      if (button.dataset.currentFilter === "all") url.searchParams.delete("channel");
      else url.searchParams.set("channel", button.dataset.currentFilter);
      history.replaceState(history.state, "", `${url.pathname}${url.search}#a0-current-state`);
      applyFilter(button.dataset.currentFilter);
    }));
    const initialChannel = new URLSearchParams(location.search).get("channel") || "all";
    if (initialChannel === "human") {
      const cleanUrl = new URL(location.href);
      cleanUrl.searchParams.delete("channel");
      history.replaceState(history.state, "", `${cleanUrl.pathname}${cleanUrl.search}#a0-current-state`);
    }
    applyFilter(initialChannel);
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
