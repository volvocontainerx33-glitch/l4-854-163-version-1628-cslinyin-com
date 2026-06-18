(function () {
  var button = document.querySelector('[data-menu-button]');
  var panel = document.querySelector('[data-mobile-panel]');

  if (button && panel) {
    button.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var index = 0;
    var timer = null;

    function setSlide(nextIndex) {
      if (!slides.length) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        setSlide(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        setSlide(dotIndex);
        start();
      });
    });

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    setSlide(0);
    start();
  }

  document.querySelectorAll('[data-filter-scope]').forEach(function (scope) {
    var input = scope.querySelector('[data-card-filter]');
    var select = scope.querySelector('[data-year-filter]');
    var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card'));

    function applyFilter() {
      var query = input ? input.value.trim().toLowerCase() : '';
      var year = select ? select.value : '';
      var visible = 0;

      cards.forEach(function (card) {
        var text = card.getAttribute('data-search') || '';
        var cardYear = card.getAttribute('data-year') || '';
        var show = (!query || text.indexOf(query) !== -1) && (!year || cardYear.indexOf(year) !== -1);
        card.classList.toggle('is-filter-hidden', !show);
        if (show) {
          visible += 1;
        }
      });

      var oldEmpty = scope.querySelector('.empty-state');
      if (oldEmpty) {
        oldEmpty.remove();
      }

      if (!visible && cards.length) {
        var empty = document.createElement('div');
        empty.className = 'empty-state';
        empty.textContent = '没有找到匹配影片';
        var grid = scope.querySelector('.movie-grid');
        if (grid) {
          grid.appendChild(empty);
        }
      }
    }

    if (input) {
      input.addEventListener('input', applyFilter);
    }

    if (select) {
      select.addEventListener('change', applyFilter);
    }
  });
})();
