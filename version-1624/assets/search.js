(function () {
  var input = document.getElementById('search-page-input');
  var results = document.getElementById('search-results');
  var params = new URLSearchParams(window.location.search);
  var initialQuery = params.get('q') || '';
  var list = window.SEARCH_INDEX || [];

  function card(movie) {
    return [
      '<article class="movie-card">',
      '<a href="' + movie.url + '" class="card-cover" aria-label="' + escapeHtml(movie.title) + '">',
      '<img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
      '<span class="year-badge">' + escapeHtml(movie.year) + '</span>',
      '</a>',
      '<div class="card-body">',
      '<h3><a href="' + movie.url + '">' + escapeHtml(movie.title) + '</a></h3>',
      '<p>' + escapeHtml(movie.oneLine) + '</p>',
      '<div class="meta-line"><span>' + escapeHtml(movie.region) + '</span><span>' + escapeHtml(movie.type) + '</span></div>',
      '<div class="tag-line"><span>' + escapeHtml(movie.genre) + '</span></div>',
      '</div>',
      '</article>'
    ].join('');
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"]/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;'
      }[char];
    });
  }

  function render(query) {
    var words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    var filtered = list.filter(function (movie) {
      var text = [movie.title, movie.year, movie.region, movie.type, movie.genre, movie.tags, movie.oneLine].join(' ').toLowerCase();
      return words.every(function (word) {
        return text.indexOf(word) !== -1;
      });
    }).slice(0, 120);

    if (!filtered.length) {
      results.innerHTML = '<div class="empty-state">没有找到匹配影片</div>';
      return;
    }

    results.innerHTML = filtered.map(card).join('');
  }

  if (input) {
    input.value = initialQuery;
    input.addEventListener('input', function () {
      render(input.value);
    });
  }

  render(initialQuery);
})();
