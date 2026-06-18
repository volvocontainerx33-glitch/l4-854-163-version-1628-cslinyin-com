function setupVideo(source) {
  var video = document.getElementById('video-player');
  var overlay = document.getElementById('play-overlay');
  var hlsPlayer = null;
  var ready = false;

  if (!video || !source) {
    return;
  }

  function attachSource() {
    if (ready) {
      return;
    }

    ready = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hlsPlayer = new window.Hls({
        maxBufferLength: 45,
        backBufferLength: 45
      });
      hlsPlayer.loadSource(source);
      hlsPlayer.attachMedia(video);
      return;
    }

    video.src = source;
  }

  function startPlayback() {
    attachSource();

    if (overlay) {
      overlay.classList.add('is-hidden');
    }

    var playTask = video.play();
    if (playTask && typeof playTask.catch === 'function') {
      playTask.catch(function () {
        if (overlay) {
          overlay.classList.remove('is-hidden');
        }
      });
    }
  }

  if (overlay) {
    overlay.addEventListener('click', startPlayback);
  }

  video.addEventListener('click', function () {
    if (!ready || video.paused) {
      startPlayback();
    }
  });

  video.addEventListener('play', function () {
    if (overlay) {
      overlay.classList.add('is-hidden');
    }
  });

  window.addEventListener('pagehide', function () {
    if (hlsPlayer) {
      hlsPlayer.destroy();
      hlsPlayer = null;
    }
  });
}
