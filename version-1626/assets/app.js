(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  ready(function () {
    var toggle = document.querySelector("[data-menu-toggle]");
    var mobileNav = document.querySelector("[data-mobile-nav]");

    if (toggle && mobileNav) {
      toggle.addEventListener("click", function () {
        mobileNav.classList.toggle("is-open");
      });
    }

    var hero = document.querySelector("[data-hero]");
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
      var previous = hero.querySelector("[data-hero-prev]");
      var next = hero.querySelector("[data-hero-next]");
      var current = 0;

      function show(index) {
        if (!slides.length) {
          return;
        }
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, itemIndex) {
          slide.classList.toggle("is-active", itemIndex === current);
        });
        dots.forEach(function (dot, itemIndex) {
          dot.classList.toggle("is-active", itemIndex === current);
        });
      }

      if (previous) {
        previous.addEventListener("click", function () {
          show(current - 1);
        });
      }

      if (next) {
        next.addEventListener("click", function () {
          show(current + 1);
        });
      }

      dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
          show(index);
        });
      });

      show(0);
      window.setInterval(function () {
        show(current + 1);
      }, 5000);
    }

    Array.prototype.slice.call(document.querySelectorAll("[data-filter-root]")).forEach(function (root) {
      var input = root.querySelector("[data-search-input]");
      var selectors = Array.prototype.slice.call(root.querySelectorAll("[data-filter-field]"));
      var scope = root.parentElement || document;
      var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-card]"));
      var empty = scope.querySelector("[data-empty-state]");

      function applyFilter() {
        var query = input ? input.value.trim().toLowerCase() : "";
        var visibleCount = 0;

        cards.forEach(function (card) {
          var matched = true;
          var keywords = (card.getAttribute("data-keywords") || card.textContent || "").toLowerCase();

          if (query && keywords.indexOf(query) === -1) {
            matched = false;
          }

          selectors.forEach(function (selector) {
            var field = selector.getAttribute("data-filter-field");
            var value = selector.value;
            if (value && card.getAttribute("data-" + field) !== value) {
              matched = false;
            }
          });

          card.style.display = matched ? "" : "none";
          if (matched) {
            visibleCount += 1;
          }
        });

        if (empty) {
          empty.classList.toggle("is-visible", visibleCount === 0);
        }
      }

      if (input) {
        input.addEventListener("input", applyFilter);
      }
      selectors.forEach(function (selector) {
        selector.addEventListener("change", applyFilter);
      });
    });
  });
})();
