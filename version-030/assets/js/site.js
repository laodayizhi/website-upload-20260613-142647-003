(function() {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function() {
      mobileMenu.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('[data-search-form]').forEach(function(form) {
    form.addEventListener('submit', function(event) {
      var input = form.querySelector('input[name="q"]');
      if (!input || !input.value.trim()) {
        return;
      }
      event.preventDefault();
      window.location.href = './movies.html?q=' + encodeURIComponent(input.value.trim());
    });
  });

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var active = 0;
    var timer = null;

    function show(index) {
      if (!slides.length) {
        return;
      }
      active = (index + slides.length) % slides.length;
      slides.forEach(function(slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === active);
      });
      dots.forEach(function(dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === active);
      });
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function() {
        show(active + 1);
      }, 5200);
    }

    if (prev) {
      prev.addEventListener('click', function() {
        show(active - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function() {
        show(active + 1);
        restart();
      });
    }

    dots.forEach(function(dot, index) {
      dot.addEventListener('click', function() {
        show(index);
        restart();
      });
    });

    show(0);
    restart();
  }

  var list = document.querySelector('.searchable-list');
  if (list) {
    var searchInput = document.querySelector('[data-list-search]');
    var form = document.querySelector('[data-page-search-form]');
    var genreButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter-value]'));
    var yearButtons = Array.prototype.slice.call(document.querySelectorAll('[data-year-value]'));
    var activeGenre = '';
    var activeYear = '';

    function normalize(value) {
      return (value || '').toString().toLowerCase().trim();
    }

    function applyFilters() {
      var query = normalize(searchInput ? searchInput.value : '');
      Array.prototype.slice.call(list.children).forEach(function(card) {
        var text = normalize([
          card.getAttribute('data-title'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-region'),
          card.getAttribute('data-year'),
          card.getAttribute('data-type'),
          card.getAttribute('data-tags')
        ].join(' '));
        var genre = card.getAttribute('data-genre') || '';
        var year = card.getAttribute('data-year') || '';
        var matchQuery = !query || text.indexOf(query) !== -1;
        var matchGenre = !activeGenre || genre.indexOf(activeGenre) !== -1;
        var matchYear = !activeYear || year === activeYear;
        card.classList.toggle('is-filter-hidden', !(matchQuery && matchGenre && matchYear));
      });
    }

    if (form) {
      form.addEventListener('submit', function(event) {
        event.preventDefault();
        applyFilters();
      });
    }

    if (searchInput) {
      var params = new URLSearchParams(window.location.search);
      var q = params.get('q');
      var year = params.get('year');
      if (q) {
        searchInput.value = q;
      }
      if (year) {
        activeYear = year;
      }
      searchInput.addEventListener('input', applyFilters);
    }

    genreButtons.forEach(function(button) {
      button.addEventListener('click', function() {
        activeGenre = button.getAttribute('data-filter-value') || '';
        genreButtons.forEach(function(item) {
          item.classList.toggle('is-active', item === button);
        });
        applyFilters();
      });
    });

    yearButtons.forEach(function(button) {
      if (activeYear && button.getAttribute('data-year-value') === activeYear) {
        yearButtons.forEach(function(item) {
          item.classList.toggle('is-active', item === button);
        });
      }
      button.addEventListener('click', function() {
        activeYear = button.getAttribute('data-year-value') || '';
        yearButtons.forEach(function(item) {
          item.classList.toggle('is-active', item === button);
        });
        applyFilters();
      });
    });

    applyFilters();
  }
}());
