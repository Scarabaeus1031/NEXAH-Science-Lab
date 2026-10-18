(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.A0ResultsTour = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const STEPS = Object.freeze([
    Object.freeze({
      id: "orientation-question",
      status: "Ausgangsfrage",
      title: "Eine Quelle kann mehrere Ansichten haben.",
      question: "Was bleibt erhalten, wenn derselbe Gegenstand anders dargestellt oder nur teilweise beobachtet wird?",
      result: "A0 trennt Quelle, Operator, Ansicht, Zusatzinformation und Return. Gleiche Bilder sind dadurch nicht automatisch dieselbe Quelle.",
      useful: "Wir können Instrumente verbinden, ohne ihre Identitäten zu vermischen — und genau benennen, was eine Ansicht zeigt.",
      boundary: "Das ist ein methodischer Rahmen. Er beweist noch keine neue Naturtheorie und keine allgemeine menschliche Nützlichkeit.",
      href: "A0_LIVING_BLUEPRINT.html#a0-map-home",
      linkLabel: "Crosswalk und Orientierungsmap öffnen"
    }),
    Object.freeze({
      id: "return-result",
      status: "Angenommener Mischbefund · BL-055",
      title: "Exakter Return gelingt — aber Sparsamkeit nicht überall.",
      question: "Können wir aus einer reduzierten Ansicht wieder eindeutig zur adressierten Quelle zurückkehren?",
      result: "Der getestete Return war auf drei von drei Carriern exakt. Einen messbaren Bitvorteil gab es jedoch nur auf einem von drei.",
      useful: "Wir wissen jetzt, dass Verlässlichkeit und Kompression zwei verschiedene Ziele sind. Ein System darf exakt sein, ohne automatisch sparsam zu sein.",
      boundary: "Das Ergebnis gilt für die getesteten Carrier und Typverträge; keine universelle Return-Ökonomie wurde gezeigt.",
      href: "A0_ORIENTATION_CONTROLLER_BENCH.html#returnEconomyDemonstrator",
      linkLabel: "Return-Economy-Demonstrator öffnen"
    }),
    Object.freeze({
      id: "operator-typing",
      status: "Angenommener positiver Befund · BL-049",
      title: "IOTA und THOTH funktionieren gemeinsam, wenn die Übergabe typisiert ist.",
      question: "Lassen sich zwei Operatoren koppeln, ohne Herkunft, Zwischenzustand und Rückweg zu verlieren?",
      result: "Der gemeinsame typisierte Return bestand 9000 von 9000 Prüffällen. Die Übergabe bleibt als eigener Record sichtbar.",
      useful: "Module können zusammenarbeiten und trotzdem prüfbar bleiben. Das ist die Grundlage für gekoppelte Bench-Fenster statt undurchsichtiger Großmaschinen.",
      boundary: "Ein bestandener interner Typvertrag ist noch kein externer Wirksamkeits- oder Neuheitsnachweis.",
      href: "A0_ORIENTATION_CONTROLLER_BENCH.html#nativeFaceBridge",
      linkLabel: "Gekoppelte Source Chain öffnen"
    }),
    Object.freeze({
      id: "negative-controls",
      status: "Angenommener Negativbefund · BL-054",
      title: "Nicht jede Ansicht ist stabil genug.",
      question: "Bleibt die Zuordnung auch dann zuverlässig, wenn wir grob abtasten oder die Ansicht stark vereinfachen?",
      result: "Alle Nicht-View-Kontrollen bestanden, aber 21 von 81 groben 8-Bin-Ansichten verletzten die festgelegte Stabilitätsschwelle.",
      useful: "Der Fehler zeigt, wo eine Ansicht zu grob wird. Negative Resultate schützen uns davor, eine schöne Projektion mit einer verlässlichen Messung zu verwechseln.",
      boundary: "Der Befund widerlegt die getestete Stabilitätsannahme; er widerlegt nicht den Carrier oder alle feineren Ansichten.",
      href: "../110_A0_EXPERIMENT_LEARNING_MAP_2026-10-18.md",
      linkLabel: "Learning Map mit allen 18 Records öffnen"
    }),
    Object.freeze({
      id: "bench-application",
      status: "Anwendung · Engineering",
      title: "Die Bench macht die Regeln sichtbar und bedienbar.",
      question: "Wie sehen Quelle, Ansicht, Kopplung und Return aus, wenn sie nicht nur im Bericht stehen?",
      result: "Die Orientation Controller Bench bündelt zehn gekoppelte Arbeitsfenster, Observatory, Session Ledger und geführte Tour, ohne die Originalmodule zu kopieren.",
      useful: "Wir können Ansichten wechseln, laufende Module vergleichen, Übergaben beobachten und danach zum jeweiligen Original zurückkehren.",
      boundary: "Eine funktionierende Demonstration ist Engineering-Evidenz. Manuelle Browser-, Mobile- und High-Zoom-Abnahme bleiben separat.",
      href: "A0_ORIENTATION_CONTROLLER_BENCH.html#coupledWindowHub",
      linkLabel: "Coupled Window Hub starten"
    }),
    Object.freeze({
      id: "next-gate",
      status: "Nächster sinnvoller Schritt",
      title: "Jetzt zählt Abnahme und unabhängige Prüfung.",
      question: "Was bringt die Forschung nach den internen Experimenten wirklich weiter?",
      result: "Der interne Stand trennt positive, negative und gemischte Resultate sauber. Der Engpass ist nicht noch mehr Umfang, sondern gezielte Abnahme und externe Gegenprüfung.",
      useful: "Zuerst die wichtigsten Demonstratoren manuell auf Phone, Tablet und High Zoom prüfen; danach den engsten formalen Kandidaten unabhängig reviewen lassen.",
      boundary: "Active research cycles bleiben 0. Keine Study, Publikation oder externe Gültigkeit wird durch diese Tour aktiviert.",
      href: "A0_RESEARCH_BACKLOG.html",
      linkLabel: "Backlog und nächste Gates öffnen"
    })
  ]);

  function createController(length, initialIndex) {
    const size = Number.isInteger(length) && length > 0 ? length : 1;
    let index = Number.isInteger(initialIndex) ? Math.max(0, Math.min(initialIndex, size - 1)) : 0;
    const listeners = new Set();
    const notify = () => listeners.forEach(listener => listener(index));
    return Object.freeze({
      get index() { return index; },
      get length() { return size; },
      goTo(nextIndex) {
        if (!Number.isInteger(nextIndex)) return index;
        index = Math.max(0, Math.min(nextIndex, size - 1));
        notify();
        return index;
      },
      next() { return this.goTo(index + 1); },
      previous() { return this.goTo(index - 1); },
      subscribe(listener) {
        if (typeof listener !== "function") return function () {};
        listeners.add(listener);
        return () => listeners.delete(listener);
      }
    });
  }

  function mount(doc) {
    if (!doc) return null;
    const dialog = doc.getElementById("a0-results-tour-dialog");
    if (!dialog || dialog.dataset.resultsTourMounted === "true") return null;
    dialog.dataset.resultsTourMounted = "true";
    const find = name => dialog.querySelector(`[data-results-tour-${name}]`);
    const nodes = {
      progress: find("progress"), status: find("status"), title: find("title"),
      question: find("question"), result: find("result"), useful: find("useful"),
      boundary: find("boundary"), source: find("source"), stations: find("stations"),
      previous: find("prev"), next: find("next"), close: find("close")
    };
    const controller = createController(STEPS.length, 0);

    STEPS.forEach((step, index) => {
      const button = doc.createElement("button");
      button.type = "button";
      button.textContent = String(index + 1);
      button.setAttribute("aria-label", `Station ${index + 1}: ${step.title}`);
      button.addEventListener("click", () => controller.goTo(index));
      nodes.stations.append(button);
    });

    function render(index) {
      const step = STEPS[index];
      nodes.progress.textContent = `Station ${index + 1} von ${STEPS.length}`;
      nodes.status.textContent = step.status;
      nodes.title.textContent = step.title;
      nodes.question.textContent = step.question;
      nodes.result.textContent = step.result;
      nodes.useful.textContent = step.useful;
      nodes.boundary.textContent = step.boundary;
      nodes.source.href = step.href;
      nodes.source.textContent = `${step.linkLabel} →`;
      nodes.previous.disabled = index === 0;
      nodes.next.disabled = index === STEPS.length - 1;
      nodes.next.textContent = index === STEPS.length - 1 ? "Tour vollständig" : "Weiter →";
      Array.from(nodes.stations.children).forEach((button, stationIndex) => {
        if (stationIndex === index) button.setAttribute("aria-current", "step");
        else button.removeAttribute("aria-current");
      });
    }

    controller.subscribe(render);
    render(0);
    const open = () => {
      controller.goTo(0);
      if (typeof dialog.showModal === "function") dialog.showModal();
      else dialog.setAttribute("open", "");
    };
    const close = () => {
      if (typeof dialog.close === "function") dialog.close();
      else dialog.removeAttribute("open");
    };
    doc.querySelectorAll("[data-results-tour-open]").forEach(button => button.addEventListener("click", open));
    nodes.close.addEventListener("click", close);
    nodes.previous.addEventListener("click", () => controller.previous());
    nodes.next.addEventListener("click", () => controller.next());
    dialog.addEventListener("click", event => { if (event.target === dialog) close(); });
    dialog.addEventListener("keydown", event => {
      if (event.key === "ArrowRight") controller.next();
      if (event.key === "ArrowLeft") controller.previous();
    });
    return Object.freeze({ controller, open, close, render });
  }

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => mount(document), { once: true });
    else mount(document);
  }

  return Object.freeze({ STEPS, createController, mount });
});
