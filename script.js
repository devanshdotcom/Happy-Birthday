$(document).ready(function () {
  let currentPage = 1;
  let bookInitialized = false;

  // ✅ Open the book
  $('#open-book-btn').click(function () {
    console.log("Open button clicked");
    $('#landing-page').fadeOut(400, function () {
      $('#book-container').fadeIn(400).removeClass('hidden');

      // initialize only once
      if (!bookInitialized) {
        initializeBook();
        bookInitialized = true;
      }
    });
  });

  // ✅ Close the book and go back
  $('#close-book-btn').click(function () {
    $('#book-container').fadeOut(400, function () {
      $('#book-container').addClass('hidden');
      $('#landing-page').fadeIn(400);
      $('html, body').animate({ scrollTop: 0 }, 500);
    });
  });

  // ✅ Initialize Turn.js flipbook
  function initializeBook() {
    // make sure Turn.js is loaded
    if (typeof $.fn.turn !== 'function') {
      console.warn("Turn.js not loaded yet — retrying...");
      setTimeout(initializeBook, 300);
      return;
    }

    // Initialize flipbook
    $("#flipbook").turn({
      width: 800,
      height: 600,
      elevation: 50,
      gradients: true,
      autoCenter: true,
      duration: 1500
    });

    const totalPages = $("#flipbook").turn("pages");
    updatePageCounter(1, totalPages);

    // When a page turns
    $("#flipbook").bind("turned", function (event, page) {
      currentPage = page;
      updatePageCounter(page, totalPages);

      // 🎁 Show surprise button on last page
      if (page >= totalPages - 1) {
        $('#end-surprise').fadeIn(1000).removeClass('hidden');

        setTimeout(() => {
          const button = $('#end-surprise');
          const offset = button.offset().top - ($(window).height() / 2) + (button.outerHeight() / 2);
          $('html, body').animate({ scrollTop: offset }, 800);
        }, 600);
      } else {
        $('#end-surprise').fadeOut(400).addClass('hidden');
        $('html, body').animate({ scrollTop: 0 }, 500);
      }
    });
  }

  // ✅ Update page counter
  function updatePageCounter(page, total) {
    $('#current-page').text(page);
    $('#total-pages').text(total);
  }

  // ✅ Navigation buttons
  $('#prev-btn').click(() => $("#flipbook").turn("previous"));
  $('#next-btn').click(() => $("#flipbook").turn("next"));

  // ✅ Keyboard controls
  $(document).keydown(function (e) {
    if (!$('#book-container').hasClass('hidden')) {
      if (e.keyCode === 37) $("#flipbook").turn("previous");
      else if (e.keyCode === 39) $("#flipbook").turn("next");
    }
  });

  // ✅ Surprise button redirect
  $('#show-surprise-btn').click(function () {
    // 🎉 Confetti effect
    confetti({
      particleCount: 150,
      spread: 120,
      origin: { y: 0.6 }
    });

    // small extra bursts for smoother animation
    setTimeout(() => confetti({ particleCount: 80, spread: 160, origin: { x: 0.2, y: 0.4 } }), 200);
    setTimeout(() => confetti({ particleCount: 80, spread: 160, origin: { x: 0.8, y: 0.4 } }), 400);

    // wait a bit before redirect
    setTimeout(() => {
      window.location.href = "collage.html";
    }, 1500);
  });
});
