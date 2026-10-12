(function () {
  'use strict';

  var root = document.documentElement;

  // ---------- Footer year ----------
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  // ---------- Light / dark toggle ----------
  var toggle = document.querySelector('.theme-toggle');
  var systemDark = window.matchMedia('(prefers-color-scheme: dark)');

  function isDark() {
    var theme = root.dataset.theme;
    return theme ? theme === 'dark' : systemDark.matches;
  }

  function syncToggle() {
    var dark = isDark();
    toggle.setAttribute('aria-pressed', String(dark));
    toggle.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  }

  if (toggle) {
    syncToggle();

    toggle.addEventListener('click', function () {
      var next = isDark() ? 'light' : 'dark';
      root.dataset.theme = next;
      try {
        localStorage.setItem('theme', next);
      } catch (e) {
        // Storage can be blocked (e.g. private mode); ignore it
      }
      syncToggle();
    });

    // Follow the system setting until the user picks one
    systemDark.addEventListener('change', function () {
      if (!root.dataset.theme) syncToggle();
    });
  }

  // ---------- Highlight the current section in the nav ----------
  var links = document.querySelectorAll('.nav-list a[href^="#"]');
  if (!('IntersectionObserver' in window) || links.length === 0) return;

  var linkById = {};
  links.forEach(function (link) {
    linkById[link.getAttribute('href').slice(1)] = link;
  });

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (link) { link.removeAttribute('aria-current'); });
        var active = linkById[entry.target.id];
        if (active) active.setAttribute('aria-current', 'true');
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  Object.keys(linkById).forEach(function (id) {
    var section = document.getElementById(id);
    if (section) observer.observe(section);
  });
})();
