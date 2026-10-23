// Kollywood Games: mobile menu and light/dark theme toggle
(function () {
  var root = document.documentElement;

  // Theme toggle: remembers the visitor's choice, otherwise follows the system setting
  var themeBtn = document.querySelector(".theme-toggle");
  if (themeBtn) {
    var isDark = function () {
      var t = root.getAttribute("data-theme");
      if (t) return t === "dark";
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    };
    var syncLabel = function () {
      themeBtn.setAttribute("aria-label", isDark() ? "Switch to light mode" : "Switch to dark mode");
      themeBtn.setAttribute("aria-pressed", isDark() ? "true" : "false");
    };
    syncLabel();
    themeBtn.addEventListener("click", function () {
      var next = isDark() ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("kg-theme", next); } catch (e) {}
      syncLabel();
    });
  }

  // Mobile menu
  var menuBtn = document.querySelector(".menu-toggle");
  var nav = document.getElementById("site-nav");
  if (!menuBtn || !nav) return;

  var setOpen = function (open) {
    nav.classList.toggle("is-open", open);
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };

  menuBtn.addEventListener("click", function () {
    setOpen(!nav.classList.contains("is-open"));
  });

  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) setOpen(false);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      setOpen(false);
      menuBtn.focus();
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 960) setOpen(false);
  });
})();
