/* Location only: reads hash, never touches source controls. */
(() => {
  const label = document.getElementById("benchLocationLabel");
  if (!label) return;
  const names = {
    benchFoyer:"Entdecken · Foyer", foyerDoors:"Entdecken · Werkzeuge",
    benchWorkDesk:"Arbeiten · Arbeitsplatz", anuTowerWorkbench:"Arbeiten · Tower / ANU",
    pulseBenchMonitor:"Arbeiten · ONE PULSE", carrierReturnWorkbench:"Arbeiten · CRT / Ghost",
    nativeSourceBank:"Quellen & Prüfen · Originale", benchSetupDrawer:"Quellen & Prüfen · Verträge"
  };
  const update = () => { label.textContent = names[location.hash.slice(1)] || "Instrumente"; };
  window.addEventListener("hashchange", update);
  update();
})();

