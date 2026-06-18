function setupMoviePlayer(videoId, coverId, streamUrl) {
  var video = document.getElementById(videoId);
  var cover = document.getElementById(coverId);
  var loaded = false;
  var hls = null;

  if (!video || !cover || !streamUrl) {
    return;
  }

  function loadStream() {
    if (loaded) {
      return;
    }

    loaded = true;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamUrl;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      return;
    }

    video.src = streamUrl;
  }

  function startPlayback() {
    loadStream();
    cover.classList.add("is-hidden");
    video.controls = true;
    var result = video.play();

    if (result && typeof result.catch === "function") {
      result.catch(function () {
        video.controls = true;
      });
    }
  }

  cover.addEventListener("click", startPlayback);
  video.addEventListener("click", function () {
    if (video.paused) {
      startPlayback();
    }
  });

  window.addEventListener("pagehide", function () {
    if (hls && typeof hls.destroy === "function") {
      hls.destroy();
    }
  });
}
