(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function () {
    var menuButton = document.querySelector('[data-menu-button]');
    var mobilePanel = document.querySelector('[data-mobile-panel]');
    if (menuButton && mobilePanel) {
      menuButton.addEventListener('click', function () {
        mobilePanel.classList.toggle('open');
      });
    }

    document.querySelectorAll('img').forEach(function (img) {
      img.addEventListener('error', function () {
        img.classList.add('is-missing');
        if (img.parentElement) {
          img.parentElement.classList.add('missing-image');
        }
      });
    });

    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    var current = 0;
    function setSlide(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    }
    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        setSlide(dotIndex);
      });
    });
    if (slides.length > 1) {
      setInterval(function () {
        setSlide(current + 1);
      }, 5200);
    }
    setSlide(0);

    var filterRoot = document.querySelector('[data-filter-root]');
    if (filterRoot) {
      var search = filterRoot.querySelector('[data-search]');
      var select = filterRoot.querySelector('[data-year-filter]');
      var chips = Array.prototype.slice.call(filterRoot.querySelectorAll('[data-chip]'));
      var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
      var result = filterRoot.querySelector('[data-result-count]');
      var empty = document.querySelector('[data-empty]');
      var activeChip = 'all';

      function applyFilter() {
        var keyword = search ? search.value.trim().toLowerCase() : '';
        var year = select ? select.value : 'all';
        var visible = 0;
        cards.forEach(function (card) {
          var haystack = card.getAttribute('data-search-text') || '';
          var cardYear = card.getAttribute('data-year') || '';
          var cardType = card.getAttribute('data-type') || '';
          var matchesKeyword = !keyword || haystack.indexOf(keyword) !== -1;
          var matchesYear = year === 'all' || cardYear === year;
          var matchesChip = activeChip === 'all' || cardType.indexOf(activeChip) !== -1;
          var show = matchesKeyword && matchesYear && matchesChip;
          card.style.display = show ? '' : 'none';
          if (show) {
            visible += 1;
          }
        });
        if (result) {
          result.textContent = String(visible);
        }
        if (empty) {
          empty.style.display = visible ? 'none' : 'block';
        }
      }

      if (search) {
        search.addEventListener('input', applyFilter);
      }
      if (select) {
        select.addEventListener('change', applyFilter);
      }
      chips.forEach(function (chip) {
        chip.addEventListener('click', function () {
          chips.forEach(function (item) {
            item.classList.remove('active');
          });
          chip.classList.add('active');
          activeChip = chip.getAttribute('data-chip') || 'all';
          applyFilter();
        });
      });
      applyFilter();
    }

    document.querySelectorAll('[data-video-shell]').forEach(function (shell) {
      var video = shell.querySelector('video');
      var button = shell.querySelector('[data-play-button]');
      var source = shell.getAttribute('data-src') || (video ? video.getAttribute('data-src') : '');
      var initialized = false;
      function startVideo() {
        if (!video || initialized || !source) {
          return;
        }
        initialized = true;
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = source;
        } else if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
          hls.loadSource(source);
          hls.attachMedia(video);
          shell.hls = hls;
        } else {
          video.src = source;
        }
        shell.classList.add('is-playing');
        video.setAttribute('controls', 'controls');
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(function () {});
        }
      }
      if (button) {
        button.addEventListener('click', function (event) {
          event.preventDefault();
          event.stopPropagation();
          startVideo();
        });
      }
      shell.addEventListener('click', function (event) {
        if (!initialized && event.target !== button) {
          startVideo();
        }
      });
    });
  });
})();
