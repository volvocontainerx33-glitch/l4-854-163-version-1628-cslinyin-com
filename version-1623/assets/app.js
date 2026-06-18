(function () {
  function onReady(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  onReady(function () {
    var toggle = document.querySelector("[data-menu-toggle]");
    var panel = document.querySelector("[data-mobile-panel]");

    if (toggle && panel) {
      toggle.addEventListener("click", function () {
        panel.classList.toggle("is-open");
      });
    }

    document.querySelectorAll("[data-search-form]").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var input = form.querySelector("input[name='q']");
        var query = input ? input.value.trim() : "";
        var target = "search.html";
        if (query) {
          target += "?q=" + encodeURIComponent(query);
        }
        window.location.href = target;
      });
    });

    var searchInput = document.querySelector("[data-page-search]");
    var typeFilter = document.querySelector("[data-type-filter]");
    var categoryFilter = document.querySelector("[data-category-filter]");
    var list = document.querySelector("[data-search-list]");

    if (searchInput && list) {
      var params = new URLSearchParams(window.location.search);
      var query = params.get("q") || "";
      searchInput.value = query;

      var applyFilter = function () {
        var text = normalize(searchInput.value);
        var type = typeFilter ? normalize(typeFilter.value) : "";
        var category = categoryFilter ? normalize(categoryFilter.value) : "";

        list.querySelectorAll(".movie-card").forEach(function (card) {
          var haystack = normalize(card.getAttribute("data-search"));
          var cardType = normalize(card.getAttribute("data-type"));
          var cardText = normalize(card.textContent);
          var matchesText = !text || haystack.indexOf(text) !== -1 || cardText.indexOf(text) !== -1;
          var matchesType = !type || cardType === type;
          var matchesCategory = !category || cardText.indexOf(category) !== -1;

          if (matchesText && matchesType && matchesCategory) {
            card.classList.remove("is-hidden");
          } else {
            card.classList.add("is-hidden");
          }
        });
      };

      searchInput.addEventListener("input", applyFilter);
      if (typeFilter) {
        typeFilter.addEventListener("change", applyFilter);
      }
      if (categoryFilter) {
        categoryFilter.addEventListener("change", applyFilter);
      }
      applyFilter();
    }
  });
})();
