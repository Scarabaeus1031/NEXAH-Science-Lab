(() => {
  "use strict";

  const main = document.querySelector("main");
  const route = document.getElementById("human-route");
  const finalReturn = document.getElementById("return");
  if (!main || !route || !finalReturn || document.querySelector(".human-journey-dock")) return;

  const stages = [
    {
      key: "machina",
      number: "OPTIONAL",
      title: "The Machina",
      copy: "Drei Körper in einem ruhigen Viewer.",
      nodes: [document.querySelector(".human-machina-door")],
    },
    {
      key: "look",
      number: "ROOM 02",
      title: "Look Again",
      copy: "Ein Carrier, eine andere sichtbare Relation.",
      nodes: [document.getElementById("look-again-room")],
    },
    {
      key: "light",
      number: "ROOM 01",
      title: "Rainbow Light",
      copy: "Sechs Stationen von Dark Room bis Return.",
      nodes: [document.getElementById("invitation"), document.getElementById("rainbow-light-tour")],
    },
    {
      key: "next",
      number: "AFTER THE PATH",
      title: "Free Doors",
      copy: "Fünf freiwillige Fortsetzungen nach der geführten Lesart.",
      nodes: [document.getElementById("instrument")],
    },
  ].filter((stage) => stage.nodes.every(Boolean));

  const dock = document.createElement("nav");
  dock.className = "human-journey-dock";
  dock.setAttribute("aria-label", "Deine Strecke durch Human View");
  dock.innerHTML = `
    <span class="human-journey-dock__label">DEINE STRECKE</span>
    <a href="#human-view" data-route-key="start"><i>00</i><b>Start</b></a>
    <a href="#human-route" data-route-key="route"><i>01</i><b>Lesen</b></a>
    <a href="#human-stage-light" data-route-key="light"><i>02</i><b>Light</b></a>
    <a href="#human-stage-look" data-route-key="look"><i>03</i><b>Look</b></a>
    <a href="#human-stage-next" data-route-key="next"><i>04</i><b>Türen</b></a>
    <a class="human-journey-dock__return" href="#return" data-route-key="return"><i>↺</i><b>Return</b></a>`;
  route.before(dock);

  let routeLockUntil = 0;
  function setCurrentRoute(key, lock = false) {
    dock.querySelectorAll("a").forEach((link) => link.toggleAttribute("aria-current", link.dataset.routeKey === key));
    if (lock) routeLockUntil = performance.now() + 1800;
  }

  const folds = [];
  for (const stage of stages) {
    const [first] = stage.nodes;
    const fold = document.createElement("details");
    fold.className = `human-stage-fold human-stage-fold--${stage.key}`;
    fold.id = `human-stage-${stage.key}`;
    const summary = document.createElement("summary");
    summary.innerHTML = `<span><small>${stage.number}</small><strong>${stage.title}</strong><em>${stage.copy}</em></span><i aria-hidden="true"></i>`;
    const body = document.createElement("div");
    body.className = "human-stage-fold__body";
    first.before(fold);
    if (stage.key === "light") {
      body.classList.add("human-light-gate");
      body.append(...stage.nodes);
    } else {
      stage.nodes.forEach((node) => body.append(node));
    }
    fold.append(summary, body);
    fold.addEventListener("toggle", () => {
      if (!fold.open) {
        if (stage.key === "light") body.classList.remove("is-entered");
        return;
      }
      folds.forEach((other) => { if (other !== fold) other.open = false; });
      requestAnimationFrame(() => window.dispatchEvent(new Event("resize")));
    });
    folds.push(fold);
  }

  let routeCursor = route;
  ["light", "look", "machina", "next"].forEach((key) => {
    const fold = folds.find((item) => item.id === `human-stage-${key}`);
    if (!fold) return;
    routeCursor.after(fold);
    routeCursor = fold;
  });

  function foldForTarget(target) {
    if (!(target instanceof Element)) return null;
    return target.matches(".human-stage-fold") ? target : target.closest(".human-stage-fold");
  }

  function revealHash(hash, scroll = false) {
    if (!hash || hash === "#") return;
    let target;
    try { target = document.querySelector(hash); } catch (_) { return; }
    if (!target) return;
    const fold = foldForTarget(target);
    if (fold) fold.open = true;
    if (target.id === "rainbow-light-tour") target.closest(".human-light-gate")?.classList.add("is-entered");
    const key = fold ? fold.id.replace("human-stage-", "") : target === route ? "route" : target === finalReturn ? "return" : "start";
    setCurrentRoute(key, scroll);
    if (scroll) {
      requestAnimationFrame(() => requestAnimationFrame(() => target.scrollIntoView({ behavior: "smooth", block: "start" })));
    }
  }

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href^='#']");
    if (!link) return;
    const hash = link.getAttribute("href");
    let target;
    try { target = document.querySelector(hash); } catch (_) { return; }
    const fold = foldForTarget(target);
    if (!fold) return;
    event.preventDefault();
    fold.open = true;
    if (target.id === "rainbow-light-tour") target.closest(".human-light-gate")?.classList.add("is-entered");
    history.pushState(null, "", hash);
    setCurrentRoute(fold.id.replace("human-stage-", ""), true);
    requestAnimationFrame(() => requestAnimationFrame(() => target.scrollIntoView({ behavior: "smooth", block: "start" })));
  });

  window.addEventListener("hashchange", () => revealHash(location.hash, true));
  revealHash(location.hash);

  const beginJourney = document.getElementById("beginJourney");
  beginJourney?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    const tour = document.getElementById("rainbow-light-tour");
    const lightBody = tour?.closest(".human-light-gate");
    if (!tour || !lightBody) return;
    lightBody.classList.add("is-entered");
    history.pushState(null, "", "#rainbow-light-tour");
    setCurrentRoute("light", true);
    window.dispatchEvent(new Event("resize"));
    requestAnimationFrame(() => requestAnimationFrame(() => tour.scrollIntoView({ behavior: "smooth", block: "start" })));
  }, true);

  if ("IntersectionObserver" in window) {
    const watched = [
      [document.getElementById("human-view"), "start"],
      [route, "route"],
      ...folds.map((fold) => [fold, fold.id.replace("human-stage-", "")]),
      [finalReturn, "return"],
    ].filter(([node]) => node);
    const observer = new IntersectionObserver((entries) => {
      if (performance.now() < routeLockUntil) return;
      let anchoredTarget = null;
      try { anchoredTarget = location.hash ? document.querySelector(location.hash) : null; } catch (_) {}
      if (anchoredTarget) {
        const anchoredFold = foldForTarget(anchoredTarget);
        const anchoredKey = anchoredFold ? anchoredFold.id.replace("human-stage-", "") : anchoredTarget === route ? "route" : anchoredTarget === finalReturn ? "return" : anchoredTarget.id === "human-view" ? "start" : null;
        if (anchoredKey) {
          setCurrentRoute(anchoredKey);
          return;
        }
      }
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const key = watched.find(([node]) => node === visible.target)?.[1];
      setCurrentRoute(key);
    }, { rootMargin: "-24% 0px -58%", threshold: [0, .1, .35] });
    watched.forEach(([node]) => observer.observe(node));
  }
})();
