(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
      return;
    }
    callback();
  }

  ready(function () {
    var menuButton = document.querySelector("[data-mobile-menu]");
    var mobilePanel = document.querySelector("[data-mobile-panel]");

    if (menuButton && mobilePanel) {
      menuButton.addEventListener("click", function () {
        mobilePanel.classList.toggle("is-open");
      });
    }

    document.querySelectorAll("[data-hero-carousel]").forEach(function (carousel) {
      var slides = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-dot]"));
      var prev = carousel.querySelector("[data-hero-prev]");
      var next = carousel.querySelector("[data-hero-next]");
      var index = 0;
      var timer = null;

      function show(nextIndex) {
        if (!slides.length) {
          return;
        }

        index = (nextIndex + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("is-active", slideIndex === index);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("is-active", dotIndex === index);
        });
      }

      function restart() {
        if (timer) {
          window.clearInterval(timer);
        }
        timer = window.setInterval(function () {
          show(index + 1);
        }, 5200);
      }

      dots.forEach(function (dot, dotIndex) {
        dot.addEventListener("click", function () {
          show(dotIndex);
          restart();
        });
      });

      if (prev) {
        prev.addEventListener("click", function () {
          show(index - 1);
          restart();
        });
      }

      if (next) {
        next.addEventListener("click", function () {
          show(index + 1);
          restart();
        });
      }

      restart();
    });

    document.querySelectorAll("[data-filter-scope]").forEach(function (scope) {
      var input = scope.querySelector("[data-card-filter]");
      var section = scope.closest(".content-section");
      var cards = section ? Array.prototype.slice.call(section.querySelectorAll(".movie-card")) : [];

      if (!input || !cards.length) {
        return;
      }

      input.addEventListener("input", function () {
        var keyword = input.value.trim().toLowerCase();
        cards.forEach(function (card) {
          var haystack = [
            card.getAttribute("data-title"),
            card.getAttribute("data-region"),
            card.getAttribute("data-type"),
            card.getAttribute("data-year"),
            card.getAttribute("data-genre"),
            card.getAttribute("data-tags")
          ].join(" ").toLowerCase();
          card.classList.toggle("is-hidden", keyword && haystack.indexOf(keyword) === -1);
        });
      });
    });

    var searchPanel = document.querySelector("[data-live-search]");
    var searchInput = document.querySelector("[data-search-input]");
    var searchCards = Array.prototype.slice.call(document.querySelectorAll("[data-search-results] .movie-card"));

    function applySearch(value) {
      var keyword = (value || "").trim().toLowerCase();
      searchCards.forEach(function (card) {
        var haystack = [
          card.getAttribute("data-title"),
          card.getAttribute("data-region"),
          card.getAttribute("data-type"),
          card.getAttribute("data-year"),
          card.getAttribute("data-genre"),
          card.getAttribute("data-tags")
        ].join(" ").toLowerCase();
        card.classList.toggle("is-hidden", keyword && haystack.indexOf(keyword) === -1);
      });
    }

    if (searchPanel && searchInput && searchCards.length) {
      var params = new URLSearchParams(window.location.search);
      var initial = params.get("q") || "";
      searchInput.value = initial;
      applySearch(initial);

      searchInput.addEventListener("input", function () {
        applySearch(searchInput.value);
      });

      searchPanel.querySelectorAll("[data-search-chip]").forEach(function (button) {
        button.addEventListener("click", function () {
          searchInput.value = button.getAttribute("data-search-chip") || "";
          applySearch(searchInput.value);
          searchInput.focus();
        });
      });
    }
  });
}());
