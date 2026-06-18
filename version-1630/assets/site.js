(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
      return;
    }
    document.addEventListener("DOMContentLoaded", fn);
  }

  function setupMobileNav() {
    var toggle = document.querySelector("[data-mobile-toggle]");
    var panel = document.querySelector("[data-mobile-panel]");
    if (!toggle || !panel) {
      return;
    }
    toggle.addEventListener("click", function () {
      panel.classList.toggle("is-open");
    });
  }

  function setupSearch() {
    var inputs = document.querySelectorAll("[data-search-input]");
    inputs.forEach(function (input) {
      var target = input.getAttribute("data-search-target");
      var scope = target ? document.querySelector(target) : document;
      if (!scope) {
        scope = document;
      }
      input.addEventListener("input", function () {
        var query = input.value.trim().toLowerCase();
        var cards = scope.querySelectorAll("[data-search-card]");
        cards.forEach(function (card) {
          var text = (card.getAttribute("data-search-text") || "").toLowerCase();
          card.hidden = Boolean(query && text.indexOf(query) === -1);
        });
      });
    });
  }

  function setupHero() {
    var root = document.querySelector("[data-hero-slider]");
    if (!root) {
      return;
    }
    var slides = Array.prototype.slice.call(root.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(root.querySelectorAll("[data-hero-dot]"));
    if (slides.length < 2) {
      return;
    }
    var active = 0;
    function show(index) {
      active = index;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === active);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === active);
      });
    }
    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        show(index);
      });
    });
    window.setInterval(function () {
      show((active + 1) % slides.length);
    }, 5200);
  }

  function attachHls(video, stream) {
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = stream;
      return;
    }
    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({ enableWorker: true });
      hls.loadSource(stream);
      hls.attachMedia(video);
      video._hls = hls;
      return;
    }
    video.src = stream;
  }

  function setupPlayers() {
    var players = document.querySelectorAll("[data-player]");
    players.forEach(function (player) {
      var video = player.querySelector("video");
      var button = player.querySelector("[data-play]");
      if (!video || !button) {
        return;
      }
      var stream = video.getAttribute("data-stream");
      var started = false;
      function start() {
        if (!stream) {
          return;
        }
        if (!started) {
          attachHls(video, stream);
          started = true;
        }
        player.classList.add("is-playing");
        video.controls = true;
        var playTask = video.play();
        if (playTask && typeof playTask.catch === "function") {
          playTask.catch(function () {});
        }
      }
      button.addEventListener("click", start);
      video.addEventListener("click", function () {
        if (!started || video.paused) {
          start();
        }
      });
    });
  }

  ready(function () {
    setupMobileNav();
    setupSearch();
    setupHero();
    setupPlayers();
  });
})();
