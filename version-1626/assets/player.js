(function () {
  window.initPagePlayer = function (videoId, overlayId, sourceUrl, posterUrl) {
    var video = document.getElementById(videoId);
    var overlay = document.getElementById(overlayId);
    var hlsInstance = null;
    var initialized = false;

    if (!video) {
      return;
    }

    if (posterUrl) {
      video.setAttribute("poster", posterUrl);
    }

    function bindSource() {
      if (initialized) {
        return;
      }
      initialized = true;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = sourceUrl;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hlsInstance.loadSource(sourceUrl);
        hlsInstance.attachMedia(video);
        return;
      }

      video.src = sourceUrl;
    }

    function playNow() {
      bindSource();
      if (overlay) {
        overlay.classList.add("is-hidden");
      }
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(function () {});
      }
    }

    if (overlay) {
      overlay.addEventListener("click", playNow);
    }

    video.addEventListener("click", function () {
      if (video.paused) {
        playNow();
      }
    });

    video.addEventListener("play", function () {
      if (overlay) {
        overlay.classList.add("is-hidden");
      }
    });

    window.addEventListener("pagehide", function () {
      if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
      }
    });
  };
})();
