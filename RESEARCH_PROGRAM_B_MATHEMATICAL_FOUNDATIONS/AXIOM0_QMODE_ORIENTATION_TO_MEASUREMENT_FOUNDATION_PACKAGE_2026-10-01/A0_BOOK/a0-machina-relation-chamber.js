(function () {
  "use strict";

  const VIEW_ANCHORS = Object.freeze({
    stage: "mainStageShell",
    dock: "triViewDock"
  });

  const VIEW_STATUS = Object.freeze({
    stage: "CONNECTED · MAIN STAGE · AUTO GRID / BODY / PACKAGE",
    dock: "CONNECTED · TRI-VIEW · GRID ↔ BODY ↔ PACKAGE"
  });

  function mount(scope) {
    const chamber = (scope || document).querySelector("[data-relation-chamber]");
    if (!chamber) return null;

    const gate = chamber.querySelector("[data-mrc-gate]");
    const frame = chamber.querySelector("[data-mrc-frame]");
    const state = chamber.querySelector("[data-mrc-gate-state]");
    const status = chamber.querySelector("[data-mrc-status]");
    const reload = chamber.querySelector("[data-mrc-reload]");
    const viewButtons = [...chamber.querySelectorAll("[data-mrc-view]")];
    let loaded = false;
    let activeView = "stage";

    function sourceFor(view) {
      return `${frame.dataset.src}#${VIEW_ANCHORS[view] || VIEW_ANCHORS.stage}`;
    }

    function syncButtons() {
      viewButtons.forEach((button) => {
        const selected = button.dataset.mrcView === activeView;
        button.classList.toggle("is-active", selected);
        button.setAttribute("aria-pressed", String(selected));
      });
    }

    function load(force, nextView) {
      const requestedView = VIEW_ANCHORS[nextView] ? nextView : activeView;
      const changed = requestedView !== activeView;
      activeView = requestedView;
      syncButtons();

      if (!loaded || force || changed) {
        frame.src = sourceFor(activeView);
        loaded = true;
      }

      status.textContent = VIEW_STATUS[activeView];
      state.textContent = gate.open
        ? `OPEN · ${activeView === "stage" ? "main stage" : "tri-view"} connected`
        : "CLOSED · live state preserved";
    }

    gate.addEventListener("toggle", () => {
      if (gate.open) load(false, activeView);
      else state.textContent = "CLOSED · live state preserved";
    });

    viewButtons.forEach((button) => {
      button.addEventListener("click", () => {
        gate.open = true;
        load(true, button.dataset.mrcView);
      });
    });

    reload.addEventListener("click", () => load(true, activeView));

    if (location.hash === "#relationChamber") {
      gate.open = true;
      load(false, "stage");
    }

    return {
      open(view = "stage") {
        gate.open = true;
        load(false, view);
      },
      show(view) {
        gate.open = true;
        load(true, view);
      },
      reload() {
        load(true, activeView);
      },
      isLoaded: () => loaded,
      activeView: () => activeView
    };
  }

  if (typeof document !== "undefined") {
    const boot = () => mount(document);
    document.readyState === "loading"
      ? document.addEventListener("DOMContentLoaded", boot, { once: true })
      : boot();
  }

  if (typeof module === "object" && module.exports) {
    module.exports = { mount, VIEW_ANCHORS, VIEW_STATUS };
  }
})();
