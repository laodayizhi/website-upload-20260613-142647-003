(function () {
  function ready(callback) {
    if (document.readyState !== "loading") {
      callback();
      return;
    }
    document.addEventListener("DOMContentLoaded", callback);
  }

  function setupNavigation() {
    var toggle = document.querySelector("[data-nav-toggle]");
    var nav = document.querySelector("[data-site-nav]");
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener("click", function () {
      nav.classList.toggle("is-open");
    });
  }

  function setupBackTop() {
    var button = document.querySelector("[data-back-top]");
    if (!button) {
      return;
    }
    window.addEventListener("scroll", function () {
      button.classList.toggle("is-visible", window.scrollY > 520);
    }, { passive: true });
    button.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function setupHero() {
    document.querySelectorAll("[data-hero-slider]").forEach(function (slider) {
      var slides = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-dot]"));
      if (slides.length < 2) {
        return;
      }
      var current = 0;
      var timer = null;

      function show(index) {
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, itemIndex) {
          slide.classList.toggle("is-active", itemIndex === current);
        });
        dots.forEach(function (dot, itemIndex) {
          dot.classList.toggle("is-active", itemIndex === current);
        });
      }

      function start() {
        timer = window.setInterval(function () {
          show(current + 1);
        }, 5200);
      }

      function restart() {
        if (timer) {
          window.clearInterval(timer);
        }
        start();
      }

      dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
          show(index);
          restart();
        });
      });
      start();
    });
  }

  function setupFilters() {
    document.querySelectorAll("[data-filter-panel]").forEach(function (panel) {
      var query = panel.querySelector("[data-filter-query]");
      var type = panel.querySelector("[data-filter-type]");
      var year = panel.querySelector("[data-filter-year]");
      var empty = panel.querySelector("[data-filter-empty]");
      var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card"));
      if (!cards.length) {
        return;
      }

      function valueOf(control) {
        return control ? control.value.trim().toLowerCase() : "all";
      }

      function apply() {
        var q = valueOf(query);
        var typeValue = valueOf(type);
        var yearValue = valueOf(year);
        var visible = 0;
        cards.forEach(function (card) {
          var haystack = [
            card.dataset.title,
            card.dataset.region,
            card.dataset.type,
            card.dataset.year,
            card.dataset.genre
          ].join(" ").toLowerCase();
          var typeText = (card.dataset.type || "").toLowerCase() + " " + (card.dataset.genre || "").toLowerCase();
          var yearText = (card.dataset.year || "").toLowerCase();
          var matched = true;
          if (q && haystack.indexOf(q) === -1) {
            matched = false;
          }
          if (typeValue !== "all" && typeText.indexOf(typeValue) === -1) {
            matched = false;
          }
          if (yearValue !== "all" && yearText !== yearValue) {
            matched = false;
          }
          card.hidden = !matched;
          if (matched) {
            visible += 1;
          }
        });
        if (empty) {
          empty.hidden = visible !== 0;
        }
      }

      [query, type, year].forEach(function (control) {
        if (control) {
          control.addEventListener("input", apply);
          control.addEventListener("change", apply);
        }
      });
    });
  }

  function setupPlayers() {
    document.querySelectorAll("[data-player-root]").forEach(function (root) {
      var video = root.querySelector("video[data-src]");
      var button = root.querySelector("[data-play-button]");
      if (!video) {
        return;
      }
      var source = video.getAttribute("data-src");
      var attached = false;
      var hls = null;

      function attachSource() {
        if (attached || !source) {
          return;
        }
        attached = true;
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = source;
          return;
        }
        if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
          hls.loadSource(source);
          hls.attachMedia(video);
          return;
        }
        video.src = source;
      }

      function startPlayback() {
        attachSource();
        if (button) {
          button.classList.add("is-hidden");
        }
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(function () {
            video.controls = true;
          });
        }
      }

      if (button) {
        button.addEventListener("click", startPlayback);
      }
      video.addEventListener("play", attachSource);
      video.addEventListener("click", function () {
        if (!attached) {
          startPlayback();
        }
      });
      window.addEventListener("beforeunload", function () {
        if (hls && typeof hls.destroy === "function") {
          hls.destroy();
        }
      });
    });
  }

  ready(function () {
    setupNavigation();
    setupBackTop();
    setupHero();
    setupFilters();
    setupPlayers();
  });
})();
