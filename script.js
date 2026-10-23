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

// Enna Scene-uh demo quiz in "The game" section
(function () {
  var opts = document.querySelectorAll(".quiz-opt");
  if (!opts.length) return;
  var result = document.querySelector(".quiz-result");
  var again = document.querySelector(".quiz-again");
  var confetti = document.querySelector(".confetti");
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var colors = ["#FFC23C", "#E3336B", "#139488", "#1B1446", "#FFFFFF"];

  var burst = function () {
    if (!confetti || reduceMotion) return;
    for (var i = 0; i < 48; i++) {
      var piece = document.createElement("span");
      var angle = Math.random() * Math.PI * 2;
      var dist = 120 + Math.random() * 220;
      piece.style.background = colors[i % colors.length];
      piece.style.setProperty("--x", Math.cos(angle) * dist + "px");
      piece.style.setProperty("--y", Math.sin(angle) * dist - 120 + "px");
      piece.style.setProperty("--r", Math.random() * 720 - 360 + "deg");
      piece.style.animationDelay = Math.random() * 0.15 + "s";
      confetti.appendChild(piece);
    }
    setTimeout(function () { confetti.innerHTML = ""; }, 1800);
  };

  var answer = function (picked) {
    var correct = picked.hasAttribute("data-correct");
    opts.forEach(function (o) {
      o.disabled = true;
      if (o.hasAttribute("data-correct")) o.classList.add("is-correct");
      else if (o !== picked) o.classList.add("is-dimmed");
    });
    if (correct) {
      result.textContent = "Correct! It's Anbe Sivam. You're a true Kollywood fan!";
      burst();
    } else {
      picked.classList.add("is-wrong");
      result.textContent = "Oops! The answer is Anbe Sivam.";
    }
    again.hidden = false;
  };

  opts.forEach(function (o) {
    o.addEventListener("click", function () { answer(o); });
  });

  again.addEventListener("click", function () {
    opts.forEach(function (o) {
      o.disabled = false;
      o.classList.remove("is-correct", "is-wrong", "is-dimmed");
    });
    result.textContent = "Tap an option to play.";
    again.hidden = true;
    opts[0].focus();
  });
})();
