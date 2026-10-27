(() => {
  const isScarabEdition = new URLSearchParams(location.search).get("edition") === "scarabaeus";
  if (!isScarabEdition) return;

  document.title = "SCARABÆUS 1033 · A0 Builder";
  const syncHeaderHeight = () => {
    const header = document.querySelector("header.top, header.topbar");
    if (!header) return;
    document.documentElement.style.setProperty("--a0-context-header-height", `${Math.ceil(header.getBoundingClientRect().height)}px`);
  };
  syncHeaderHeight();
  window.addEventListener("resize", syncHeaderHeight);
})();
