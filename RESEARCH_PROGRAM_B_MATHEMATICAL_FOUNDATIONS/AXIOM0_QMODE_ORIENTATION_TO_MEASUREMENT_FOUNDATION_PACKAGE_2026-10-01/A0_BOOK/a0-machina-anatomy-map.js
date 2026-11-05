(() => {
  "use strict";

  const groups = {
    FRAME: {
      title: "Frame / tragende Ordnung",
      meaning: "Skelett und tragende Ordnung. Es hält Positionen, Ebenen und Gelenke, ohne selbst den Zustand zu bestimmen.",
      items: ["Tower", "Grid", "Plates", "Rails", "Joints"],
      links: [["Parts Shelf / Bench", "A0_ORIENTATION_CONTROLLER_BENCH.html#universalMachinePartsShelf"], ["Tower Return", "A0_TOWER_RETURN_DEMONSTRATOR.html#module-entry"]],
    },
    CORE: {
      title: "Core / Register",
      meaning: "Zentrale Organe und Zustandsräume. Hier werden Träger, Zustand und Zellenregister zusammengehalten.",
      items: ["Dodeka Heart", "Root Room", "Cell Register"],
      links: [["Body / Core Source", "A0_BLUE_PINK_DODECA_CELL_RETURN.html#bodyDomainSuite"], ["Machina Cockpit", "A0_MACHINA_COCKPIT.html#machinaAssembly"]],
    },
    BODY: {
      title: "Body / gekoppelte Ansichten",
      meaning: "Hülle und gekoppelte Körperansichten. Blue, Pink und White sind Rollen beziehungsweise Ansichten desselben Verbunds, keine drei identischen Körper.",
      items: ["Blue Body", "Pink Body", "White Dodeka Hull"],
      links: [["Blue Body Lab", "A0_TESSAREC_BLUE_BODY_LAB.html#module-entry"], ["Pink Diamond Grid", "A0_PINK_DIAMOND_GRID_ATLAS.html#module-entry"], ["Blue × Pink Return", "A0_BLUE_PINK_DODECA_CELL_RETURN.html#bodyDomainSuite"]],
    },
    ROUTING: {
      title: "Routing / steuerbare Wahl",
      meaning: "Auswahl, Steuerung und Übersetzung. Die Bridge verbindet adressierte Wege; Head, Switches und Handles machen die Wahl bedienbar.",
      items: ["Bridge", "Head", "Switches", "Handles"],
      links: [["IOTA Grid Bridge", "A0_IOTA_BRIDGE_DEMONSTRATOR.html#gridBridgeFlagship"], ["Machina Relation Chamber", "A0_MACHINA_COCKPIT.html#relationChamber"]],
    },
    TRACT: {
      title: "Tract / gerichteter Weg",
      meaning: "Gerichtete längere Transportwege. Trakte tragen eine Folge durch mehrere Stationen oder Wicklungen.",
      items: ["Pipe", "Zither Coil", "Seam", "Zipper"],
      links: [["TESA / Zither Translator", "A0_WERKBANK.html#tesaZitherTranslator"], ["IOTA Bridge", "A0_IOTA_BRIDGE_DEMONSTRATOR.html#module-entry"]],
    },
    CHANNEL: {
      title: "Channel / typisierte Leitung",
      meaning: "Einzelne typisierte Leitungen innerhalb eines Trakts oder Körpers. Ihre Namen beschreiben die Rolle, nicht behauptete Biologie.",
      items: ["Nerve", "Blood", "Lymph", "Typed channels"],
      links: [["Typed Return Atlas", "A0_WERKBANK.html#typedReturnAtlas"], ["Blue Body Interior", "A0_TESSAREC_BLUE_BODY_LAB.html#blue-body-interior-crt16"]],
    },
    BOUNDARY: {
      title: "Boundary / Austauschgrenze",
      meaning: "Austausch mit außen. Aperture, Curtain und Cut bestimmen, wo etwas eintritt, austritt oder als Grenze sichtbar bleibt.",
      items: ["Aperture", "Curtain", "Cut", "Skin", "Intake", "Exit"],
      links: [["Body Boundary Source", "A0_BLUE_PINK_DODECA_CELL_RETURN.html#bodyDomainSuite"], ["Crown / Shadow Contact", "A0_CROWN_SHADOW_CONTACT_BENCH.html"]],
    },
  };

  const families = [
    ["F1", "Observation / Record", "Beobachtet Zustand und hält den Record.", "CORE · BODY", ["CORE", "BODY"]],
    ["F2", "Address / Boundary", "Adressiert Ort, Slot und Grenze.", "CORE · BOUNDARY", ["CORE", "BOUNDARY"]],
    ["F3", "Transition / Operator", "Liest Übergang, Handle und Operation.", "ROUTING · TRACT", ["ROUTING", "TRACT"]],
    ["F4", "Phase / Drift", "Liest Phase, Bewegung und Drift.", "TRACT · CHANNEL", ["TRACT", "CHANNEL"]],
    ["F5", "Connectivity / Topology", "Liest Knoten, Kanten und Zusammenhang.", "FRAME · BODY", ["FRAME", "BODY"]],
    ["F6", "Synchronization / Control", "Liest Takt, Steuerung und Kopplung.", "ROUTING · CHANNEL", ["ROUTING", "CHANNEL"]],
    ["F7", "Validation / Governance", "Prüft Return, Grenze und Aussageumfang.", "BOUNDARY · ALL", ["BOUNDARY", "ALL"]],
  ];

  const allView = {
    title: "Machina Anatomy",
    meaning: "Die Übersicht hält Skelett, Kern, Körper, Routing, Trakte, Kanäle und Grenze zusammen, ohne ihre Rollen gleichzusetzen.",
    items: Object.keys(groups),
    links: [["Acht Flagship-Zugänge", "#mainModules"], ["Build / Instrument Atlas", "A0_BUILDER_TOY_STORE.html#instrument-atlas"], ["Machina Cockpit", "A0_MACHINA_COCKPIT.html#machinaAssembly"]],
  };

  const $ = (id) => document.getElementById(id);
  const rail = $("groupRail");
  const stage = $("anatomyStage");
  const inspector = $("humanViewInspector");
  const familyGrid = $("familyGrid");

  const fillItems = (items) => {
    $("selectionItems").replaceChildren(...items.map((item) => {
      const span = document.createElement("span");
      span.textContent = item;
      return span;
    }));
  };

  const fillLinks = (links) => {
    $("selectionLinks").replaceChildren(...links.map(([label, href]) => {
      const link = document.createElement("a");
      link.href = href;
      link.textContent = `${label} ↗`;
      return link;
    }));
  };

  const updateFamilies = (name = "ALL") => {
    const relevant = families.filter((family) => name === "ALL" || family[4].includes(name) || family[4].includes("ALL"));
    $("selectionFamilies").replaceChildren(...relevant.map(([id, title]) => {
      const span = document.createElement("span");
      span.textContent = `${id} · ${title}`;
      return span;
    }));
    familyGrid.querySelectorAll(".family-card").forEach((card) => {
      const roles = card.dataset.roles.split(" ");
      const matches = name === "ALL" || roles.includes(name) || roles.includes("ALL");
      card.classList.toggle("is-relevant", name !== "ALL" && matches);
      card.classList.toggle("is-muted", name !== "ALL" && !matches);
    });
  };

  Object.keys(groups).forEach((name) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = name;
    button.dataset.group = name;
    button.setAttribute("aria-pressed", "false");
    button.addEventListener("click", () => select(name));
    rail.append(button);
  });

  families.forEach(([id, title, text, cross, roles]) => {
    const article = document.createElement("article");
    article.className = "family-card";
    article.dataset.family = id;
    article.dataset.roles = roles.join(" ");
    article.innerHTML = `<b>${id}</b><strong>${title}</strong><span>${text}</span><small>${cross}</small>`;
    familyGrid.append(article);
  });

  function select(name) {
    const data = groups[name];
    if (!data) return;
    stage.classList.add("is-filtered");
    document.querySelectorAll(".anatomy-part").forEach((node) => node.classList.toggle("is-active", node.dataset.group === name));
    rail.querySelectorAll("button").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.group === name)));
    $("showAll").setAttribute("aria-pressed", "false");
    $("selectionCode").textContent = `${name} · ANATOMY ROLE`;
    $("selectionTitle").textContent = data.title;
    $("selectionSummary").textContent = `${name} · ${data.title}`;
    $("selectionMeaning").textContent = data.meaning;
    fillItems(data.items);
    fillLinks(data.links);
    updateFamilies(name);
    inspector.open = true;
    inspector.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function showAll() {
    stage.classList.remove("is-filtered");
    document.querySelectorAll(".anatomy-part").forEach((node) => node.classList.remove("is-active"));
    rail.querySelectorAll("button").forEach((button) => button.setAttribute("aria-pressed", "false"));
    $("showAll").setAttribute("aria-pressed", "true");
    $("selectionCode").textContent = "ALL · COMPOSED VIEW";
    $("selectionTitle").textContent = allView.title;
    $("selectionSummary").textContent = "ALL · Machina Anatomy";
    $("selectionMeaning").textContent = allView.meaning;
    fillItems(allView.items);
    fillLinks(allView.links);
    updateFamilies("ALL");
    inspector.open = true;
  }

  document.querySelectorAll(".anatomy-part").forEach((node) => {
    node.tabIndex = 0;
    node.setAttribute("role", "button");
    node.setAttribute("aria-label", `${node.dataset.group} anatomy role öffnen`);
    node.addEventListener("click", () => select(node.dataset.group));
    node.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      select(node.dataset.group);
    });
  });

  $("showAll").addEventListener("click", showAll);
  $("toggleReturn").addEventListener("click", () => {
    const on = $("toggleReturn").getAttribute("aria-pressed") !== "true";
    $("toggleReturn").setAttribute("aria-pressed", String(on));
    $("toggleReturn").textContent = `RETURN · ${on ? "ON" : "OFF"}`;
    $("returnPaths").classList.toggle("is-off", !on);
  });

  showAll();
  window.A0MachinaAnatomy = { groups, families, select, showAll };
})();
