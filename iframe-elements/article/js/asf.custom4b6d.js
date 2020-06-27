(function($) {

  initPage();

    // ------------------------------------ //
    // Initialize Page
    // -------------------------------------//

    function initPage() {

      $('.follow-socials a').each(function() {
        $(this).attr('target', '_blank');
      });

      $('.menu-name-menu-legal a').each(function() {
        $(this).attr('data-type', '');
      });


      $("a.user-login").click(function(event) {
          event.preventDefault();
          window.open(
            'https://shop.theweeknd.com/user/login',
            '_blank' // <- This is what makes it open in a new window.
          );
          event.stopImmediatePropagation();
      });




      $html = $("html"),
          $body = $("body"),
          $nav = $(".block--menu-block-asf-common-mm-nav"),
          $navWrap = $(".l-header"),
          $pageContent = $(".l-main");

      require(["IGA.utils"]);

      var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
      if(isChrome) {
        $('html').addClass('chrome');
      }

      // Remove name from videos
      $('.node--video').each(function() {
        // Copy title to desc
        var theTitle = $(this).find('.field--name-title').text().replace('The Weeknd - ', '');
        $(this).find('.field--name-title h5 a').text(theTitle);
      });


      // Add lookbook links
      try {
        $('#edit-field-product-departments-tid').append( "<div class='view-footer'><a href='/lookbook'>LOOKBOOK</a></div>");
      }
      catch(err) {
          console.log('not-store');
      }

      try {
        $('.view-id-store_departments.view-display-id-block_offcanvas .view-content').append('<div class="views-row views-row-8 views-row-even views-row-last"><div class="views-field views-field-name"><span class="field-content"><a href="/lookbook" class="bef-select-as-links jquery-once-1-processed">Lookbook</a></span></div><div> ');
      }
      catch(err) {
            console.log('not-store');
      }

      if( $('#edit-field-product-departments-tid-321').is(':checked') ) {
        $('html, body').animate({
                scrollTop: $(".l-columns").offset().top
            }, 2000);
      }


      // Adjustments to Markup That Can't Be Done Via Drupal Admin
      initMiscAdjustments();

      // Change .highlight background and text colors based on attributes
      initHighlights();

      // Lazy Loaded Images
      // initLazyImages();

      // Sequential loading of views-row
      sequentialLoad();

      // HeadroomJS
      //initHeadroom();

      // Countdown
      initCountdown();

      // pause video banner on mobile
      //pauseMobileVideoBanner();

      // Check if an item is coming smooth-fonts
      checkComingSoon();

      // Static Event Maps as the headline image backgrounds
      // initEventMap();

      //Store filter on mobile
      //storeFilters();

      // Slide-In Follow Buttons
      $('.slide-in').each(function() {
        $(this).find('.slide-in__toggle, .slide-in__close').on( "click", function() {
          $(this).parent().parent().toggleClass('slide-in--open');
        });
      });

      // Throttled resize function
      $(window).on('resize', Foundation.utils.throttle(function(e){
        // Do responsive stuff
        //pauseMobileVideoBanner();
        //storeFilters();
        containTracks();
      }, 100));

      // Static Event Maps as the headline image backgrounds
      // initEventMap();

      // Initialize for non touch screen devices
      if (!$("html").hasClass("touch")) {

        // Determine whether or not to parallax header based on SASS
        var parallaxBG = window.getComputedStyle(
          document.querySelector('#page'), ':before'
        ).getPropertyValue('content');

        parallaxBG = parallaxBG.replace(/"/g, ""); // Remove double quotes

        // Set main banner carousel bgs to parallax if enable via SASS
        if (parallaxBG == 'parallax') {

          //var dbMoveHeader = _.debounce(parallaxBanner, 5);
          //$(window).resize(dbMoveHeader);
          //$(window).scroll(dbMoveHeader);
          //parallaxBanner();

          // Throttled resize function
          $(window).on('resize', Foundation.utils.throttle(function(e){
            // Do responsive stuff
            parallaxBanner();
          }, 10));
          // Throttled resize function
          $(window).on('scroll', Foundation.utils.throttle(function(e){
            // Do responsive stuff
            parallaxBanner();
          }, 10));

        }


      }

      $( window ).load(function() {
        //sequentialLoad();
      });


        function initCountdown() {

          requirejs(['//cache.umusic.com/_sites/onerepublic.com/letter/js/jquery.countdown.min.js', 'IGA.utils', 'underscore'],


                  function(countdown, utils, _) {

                    var futureDate  = new Date(Date.UTC(2017, 6, 18, 17, 0, 0));

                    // $(".front #countdown").countdown("2016/05/2 12:00:00", function(event) {
                    $(" #countdown").countdown(futureDate, function(event) {

                      var totalHours = event.offset.totalDays * 24 + event.offset.hours;
                      if(totalHours < 24) {
                        $(this).closest('.countdown-container').addClass('last-chance');
                      }

                      var $this = $(this).html(event.strftime(''
                        + '<div><span class="nmbr">%D</span><span class="lbl">Days</span></div>'
                        + '<div><span class="nmbr">%H</span><span class="lbl">Hours</span></div>'
                        + '<div><span class="nmbr">%M</span><span class="lbl">Minutes</span></div>'
                        + '<div><span class="nmbr">%S</span><span class="lbl">Seconds</span></div>'));
                    });

                  }); // End requirejs



        }



      $(window).on('load', function() {

        // Initialize Sticky Sidebar
        // initStickySidebar();

        // Trigger Slide In Follow Buttons on Load
        $('.slide-in .slide-in__toggle').trigger('click');

        setTimeout(function(){
          $('.slide-in').removeClass('slide-in--open');
        }, 3000);

        // Contain album tracks to a container
        containTracks();

        $(window).trigger('resize');

      });

      // Debounced Scroll and Resize Events
      requirejs(['underscore'],
        function(underscore) {

          var dbCheckOnScreen = _.debounce(checkOnScreen, 50);
          $(window).scroll(dbCheckOnScreen);
          $(window).resize(dbCheckOnScreen);
          checkOnScreen();

          // Detect if scrolled more than 1px in order to add header shadow
          var dbScrolled = _.debounce(scrolledDown, 250);
          $(window).scroll(scrolledDown);
          scrolledDown();

        });
    }

  // ------------------------------------ //
  // Detect Webkit Browsers
  // ------------------------------------ //
  var isWebkit = 'WebkitAppearance' in document.documentElement.style;

  // ------------------------------------ //
  // Adjustments to Markup That Can't Be
  // Done via Drupal Admin
  // ------------------------------------ //
  function initMiscAdjustments() {

    // Add wrapper for fixed sidebar
    //$('.not-front .l-region--sidebar-first').wrapInner("<div class='js-sidebar'></div>");

    // Move webform icon into socials
    //$(".l-header .block--exact-target-webform").appendTo(".l-header .block--menu-block-iga-common-socials-nav");

    // Add sidebar wrapper for fixed sidebars

    // If a user swipes the offcanvas trigger a menu close
    $(".touch .l-off-canvas").on("swipe", function(event) {
      $(".menu-icon.active").trigger('click');
    });

    $(".l-region--header .icon-cancel-circled-outline").on("click", function(event) {
      $('html').addClass('no-message');
    });

    $(".pager a").each(function(e) {
      $(this).on("click", function(event) {
        $(this).closest('.block--views').addClass("seq-processed");
        $(this).closest('.view').addClass("seq-processed");
        //sequentialLoad();
      });
    });

    $('.storewide .l-off-canvas .form-item label').each(function(e) {
      $(this).on( "click", function() {
        $('a.menu-icon').trigger('click');
      });
    });


    var totalProducts = $('.storewide .node--full .bolero-slick-carousel .bolero-slick-row').length;
    //console.log(totalProducts);
    if(totalProducts < 2) {
      $('.storewide .node--full .bolero-slick-carousel').hide();
    }

    $(".node--product--full .bolero-slick-carousel .bolero-slick-row").each(function(e) {

      $('.slick-featured-img').addClass('selected');
      $(this).on("click", function(event) {
        $(".node--product--full .bolero-slick-carousel .bolero-slick-row").removeClass('selected');
        $(this).addClass('selected');
      });
    });

  }

  function pauseMobileVideoBanner() {

    var is_iPad = navigator.userAgent.match(/iPad/i) != null;

    if(Modernizr.mq('(max-width: 1025px)')) {
      $('.bolero-gifv').pause();
    } else {
      setTimeout(function () {
         $('.bolero-gifv').play();
      }, 250);
    }

    if(is_iPad) {
      $('.bolero-gifv').pause();
      $('.bolero-gifv').trigger('click');
    }

  }

  // store filter
  function storeFilters() {
    if (Modernizr.mq('(max-width: 600px)')) {
      $('.toggle-filter').on( "click", function() {
        $('.block--views-exp-store-page').toggleClass('opened');
        $(this).toggleClass('opened');
      });
      $('.block--views-exp-store-page .form-item').on( "click", function() {
        $('.toggle-filter, .block--views-exp-store-page').removeClass('opened');
      });
    }
  }

  // Sequential Load
  function sequentialLoad() {

        // Add sequential loading
        Foundation.utils.image_loaded($('.l-main .view-bolero-grid .views-row img'), function(){
          $('.l-main .view-bolero-grid .views-row').each(function(e) {
              var t = $(this);
              setTimeout(function() {
                  t.addClass("loaded")
              }, e * 100);
          });
          $(this).closest('.block--views').addClass("seq-processed");
          $(this).closest('.view').addClass("seq-processed");
          //$('.l-columns .view-bolero.view-bolero-grid ').parent().addClass("seq-processed");

        })

  }

  function replaceMobileVideoBanner() {
    if (Modernizr.mq('(max-width: 600px)')) {
      //$('.bolero-gifv').attr('poster','//dl.dropboxusercontent.com/s/yui8hu3a8ph0qlu/video-mobile.jpg');
      $('.touch .bolero-gifv').replaceWith('<img src="//dl.dropboxusercontent.com/s/yui8hu3a8ph0qlu/video-mobile.jpg" />');
    }
  }

  $(document).ajaxComplete(function(event, xhr, settings) {
    if(typeof settings.extraData != 'undefined' && typeof settings.extraData.view_display_id != 'undefined') {

        switch(settings.extraData.view_display_id){

            case "page":

                //console.log('your_view_id ajax results!');
                if( $('body').hasClass('section-store') ) {
                  sequentialLoad();
                }

                break;

            case "page_latest":

                //console.log('video ajax results!');
                //sequentialLoad();

                break;

            default:

                //console.log('some other ajax result...');

                break;

        }
    }

  });

  // ------------------------------------ //
  // Add a 'scrolled' class to the html tag
  // (when the user scrolls down) so that
  // we can use Modernizr to detect
  // ------------------------------------ //
  function scrolledDown() {
    var scroll = getCurrentScroll();
    if (scroll >= 40) {
      $('html').addClass('scrolled');
    } else {
      $('html').removeClass('scrolled');
    }
  }

  function getCurrentScroll() {
    return window.pageYOffset || document.documentElement.scrollTop;
  }


  // ------------------------------------ //
  // Parallax Banner Images
  // ------------------------------------ //
  function parallaxBanner() {
    scrollTotal = $(window).scrollTop();
    scrollTotal = Math.floor(scrollTotal / 8);
    $(".no-touch .not-front .l-banner .ds-region--background > div").css({
      transform: "translate3d(0, " + scrollTotal + "px, 0px)"
    })
  }

  // ------------------------------------ //
  // Add custom .hihlight  background colors
  // using data-color and data-textcolor attributes
  // ------------------------------------ //
  function initHighlights() {

    // Set banner highlight colors
    $(".highlight").each(function() {
      $(this).css('background-color', function() { //or for code's consistency, i'd use background-color instead
        return $(this).data('color')
      });
    });

    // Set banner highlight colors
    $(".highlight").each(function() {
      $(this).css('color', function() { //or for code's consistency, i'd use background-color instead
        return $(this).data('textcolor')
      });
    });

  }

  // ------------------------------------ //
  // Add custom .hihlight  background colors
  // using data-color and data-textcolor attributes
  // ------------------------------------ //
  function checkComingSoon() {

    // Set banner highlight colors
    $(".storewide .node.view-mode-full").each(function() {
      var prodStatus = $(this).find('.field--name-field-product-status').text();
      //console.log(prodStatus);
      if (prodStatus == "Coming Soon") {
        $(this).find('.field--type-commerce-product-reference').remove();
      }
    });


  }

  // ------------------------------------ //
  // HeadroomJS
  // http://wicky.nillia.ms/headroom.js
  // -------------------------------------//
  function initHeadroom() {
    // HeadroomJS - http://wicky.nillia.ms/headroom.js/
    requirejs(['//cdnjs.cloudflare.com/ajax/libs/headroom/0.7.0/headroom.min.js', '//cdnjs.cloudflare.com/ajax/libs/headroom/0.7.0/jQuery.headroom.min.js'],
      function(headroom, jqheadroom) {
        if ($('body').hasClass('front')) {
          bannerOffset = $(".l-banner").height();
        } else {
          bannerOffset = 500;
        }
        //subheaderOffset = $(".l-subheader").height() - 30;
        $(".no-touch body:not(.inverted) .l-header").headroom({
          "offset": bannerOffset,
          "tolerance": 5,
          "classes": {
            "initial": "animated",
            "pinned": "slideDown",
            "unpinned": "slideUp"
          },
          // callback when above offset, `this` is headroom object
          onTop: function() {},
          // callback when below offset, `this` is headroom object
          onNotTop: function() {}
        });

      }); // End requirejs
  }

  function containTracks() {
    if (Modernizr.mq('(min-width: 992px)')) {
      $('.node--release--featured').each(function() {
        var albumHeight = $(this).find('.group-left .field--name-field-release-cover').height();
        $(this).find('.group-middle .field-collection-container').css('max-height', albumHeight);
      });
    }
  }


  // ------------------------------------ //
  // Check if views are on the screen
  // -------------------------------------//

  $.fn.isOnScreen = function() {

    var win = $(window);
    win.trigger('scroll');

    var viewport = {
      top: win.scrollTop(),
      left: win.scrollLeft()
    };
    viewport.right = viewport.left + win.width();
    viewport.bottom = viewport.top + win.height();

    var bounds = this.offset();
    bounds.right = bounds.left + this.outerWidth();
    bounds.bottom = bounds.top + this.outerHeight();

    return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));

  };

  function checkOnScreen() {

    $(".view").not('.views-loaded').each(function() {
      if ($(this).isOnScreen() == true) {
        $(this).addClass('on-screen');
      }
    });

  }

})(jQuery); // end of jQuery name space

require(["IGA.utils"]);

// Foundation libraries
//define("foundation/foundation.topbar", ["foundation.topbar"]);
