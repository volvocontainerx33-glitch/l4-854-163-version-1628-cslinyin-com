(function () {
  var navButton = document.querySelector('.menu-button');
  var navLinks = document.querySelector('.nav-links');

  if (navButton && navLinks) {
    navButton.addEventListener('click', function () {
      var opened = navLinks.classList.toggle('open');
      navButton.setAttribute('aria-expanded', opened ? 'true' : 'false');
    });
  }

  document.querySelectorAll('[data-hero-slider]').forEach(function (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('.hero-dot'));
    var next = slider.querySelector('[data-slide-next]');
    var prev = slider.querySelector('[data-slide-prev]');
    var index = 0;
    var timer = null;

    function show(target) {
      if (!slides.length) {
        return;
      }
      index = (target + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === index);
      });
    }

    function start() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5600);
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        start();
      });
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        start();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-go-slide')) || 0);
        start();
      });
    });

    start();
  });

  document.querySelectorAll('[data-filter-scope]').forEach(function (scope) {
    var input = scope.querySelector('.filter-input');
    var select = scope.querySelector('.filter-select');
    var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card'));

    function normalize(value) {
      return String(value || '').trim().toLowerCase();
    }

    function apply() {
      var query = normalize(input ? input.value : '');
      var category = normalize(select ? select.value : '');
      cards.forEach(function (card) {
        var haystack = normalize([
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-year'),
          card.getAttribute('data-category'),
          card.textContent
        ].join(' '));
        var cardCategory = normalize(card.getAttribute('data-category'));
        var matchQuery = !query || haystack.indexOf(query) !== -1;
        var matchCategory = !category || cardCategory === category;
        card.classList.toggle('is-hidden-by-filter', !(matchQuery && matchCategory));
      });
    }

    if (input) {
      input.addEventListener('input', apply);
    }

    if (select) {
      select.addEventListener('change', apply);
    }
  });

  window.MoviePlayer = {
    init: function (source) {
      var shell = document.querySelector('[data-player]');
      if (!shell || !source) {
        return;
      }

      var video = shell.querySelector('video');
      var overlay = shell.querySelector('.player-overlay');
      var hlsInstance = null;
      var loaded = false;

      function load() {
        if (loaded || !video) {
          return;
        }
        loaded = true;

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = source;
        } else if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({ enableWorker: true });
          hlsInstance.loadSource(source);
          hlsInstance.attachMedia(video);
        } else {
          video.src = source;
        }
      }

      function play() {
        load();
        if (overlay) {
          overlay.classList.add('is-hidden');
        }
        var attempt = video.play();
        if (attempt && typeof attempt.catch === 'function') {
          attempt.catch(function () {});
        }
      }

      if (overlay) {
        overlay.addEventListener('click', play);
      }

      video.addEventListener('click', function () {
        if (video.paused) {
          play();
        }
      });

      video.addEventListener('play', function () {
        if (overlay) {
          overlay.classList.add('is-hidden');
        }
      });

      window.addEventListener('beforeunload', function () {
        if (hlsInstance) {
          hlsInstance.destroy();
        }
      });
    }
  };
})();
