
var mbParent = document.querySelectorAll('.moodboard');
var shopMb = document.querySelector('.shop-mb');
var shopMbEls = shopMb.querySelectorAll('article');
var mbActiveEls = void 0;

window.requestAnimFrame = (function () {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60)
    }
})()

function withinElement (child, parent) {
  // don't throw if `child` is null
  if (!child) return false;

  // Range support
  if (child.commonAncestorContainer) child = child.commonAncestorContainer;
  else if (child.endContainer) child = child.endContainer;

  // traverse up the `parentNode` properties until `parent` is found
  var node = child;
  while (node = node.parentNode) {
    if (node == parent) return true;
  }

  return false;
};

// defined by w3c
var DOCUMENT_NODE = 9;

/**
 * Returns `true` if `w` is a Document object, or `false` otherwise.
 *
 * @param {?} d - Document object, maybe
 * @return {Boolean}
 * @private
 */

function isDocument(d) {
  return d && d.nodeType === DOCUMENT_NODE;
}

/**
 * Returns the `document` object associated with the given `node`, which may be
 * a DOM element, the Window object, a Selection, a Range. Basically any DOM
 * object that references the Document in some way, this function will find it.
 *
 * @param {Mixed} node - DOM node, selection, or range in which to find the `document` object
 * @return {Document} the `document` object associated with `node`
 * @public
 */

function getDocument(node) {
  if (isDocument(node)) {
    return node;

  } else if (isDocument(node.ownerDocument)) {
    return node.ownerDocument;

  } else if (isDocument(node.document)) {
    return node.document;

  } else if (node.parentNode) {
    return getDocument(node.parentNode);

    // Range support
  } else if (node.commonAncestorContainer) {
    return getDocument(node.commonAncestorContainer);

  } else if (node.startContainer) {
    return getDocument(node.startContainer);

    // Selection support
  } else if (node.anchorNode) {
    return getDocument(node.anchorNode);
  }
}

function offset(el) {
  var doc = getDocument(el)
  if (!doc) return

  // Make sure it's not a disconnected DOM node
  if (!withinElement(el, doc)) return

  var body = doc.body
  if (body === el) {
    return bodyOffset(el)
  }

  var box = { top: 0, left: 0 }
  if ( typeof el.getBoundingClientRect !== "undefined" ) {
    // If we don't have gBCR, just use 0,0 rather than error
    // BlackBerry 5, iOS 3 (original iPhone)
    box = el.getBoundingClientRect()

    if (el.collapsed && box.left === 0 && box.top === 0) {
      // collapsed Range instances sometimes report 0, 0
      // see: http://stackoverflow.com/a/6847328/376773
      var span = doc.createElement("span");

      // Ensure span has dimensions and position by
      // adding a zero-width space character
      span.appendChild(doc.createTextNode("\u200b"));
      el.insertNode(span);
      box = span.getBoundingClientRect();

      // Remove temp SPAN and glue any broken text nodes back together
      var spanParent = span.parentNode;
      spanParent.removeChild(span);
      spanParent.normalize();
    }
  }

  var docEl = doc.documentElement
  var clientTop  = docEl.clientTop  || body.clientTop  || 0
  var clientLeft = docEl.clientLeft || body.clientLeft || 0
  var scrollTop  = window.pageYOffset || docEl.scrollTop
  var scrollLeft = window.pageXOffset || docEl.scrollLeft

  return {
    top: box.top  + scrollTop  - clientTop,
    left: box.left + scrollLeft - clientLeft
  }
}

// shop interactive feature
var startShopMb = function startShopMb() {
  var i = 0;
  // hide all shop images
  // and show the currently selected one
  var run = function run() {
    i = i <= shopMbEls.length - 1 ? i = i + 1 : i = 1;
    shopMbEls.forEach(function (el) {
      return el.classList.remove('visible');
    });
    shopMbEls[i - 1].classList.add('visible');
  };
  setInterval(run, 1300);
};

var createMbInstance = function createMbInstance(el, i) {
  // temporary fix to find the most needed parent el
  el = el.parentNode.parentNode.parentNode;
  // assign relative class and
  // set the height based on the elements
  var articles = el.querySelectorAll('article');
  // add the relative and perspective classes
  el.classList.add('mb-active');
  el.classList.add('mb-active-' + i);

  if (window.innerWidth > 901) el.style.height = articles.length * 600 + 'px'; else el.style.height = articles.length * 170 + 'px';

  // manually add layouts through css, just position absolute for now
  articles.forEach(function (article, i) {
    article.style.position = 'absolute';
  });
};

// check the articles are in view
// and convert them to fixed instead of
// absolute
var handleMbScrollPos = function handleMbScrollPos() {

  mbActiveEls.forEach(function (el) {
    var elOffsetTop = offset(el).top;
    var elHeight = el.offsetHeight;
    var winScrollY = window.scrollY;
    var winHeight = window.innerHeight;
    var elClasses = el.classList;

    // if the window scroll is at the top of
    // of the active element, add a fixed class
    if (winScrollY >= elOffsetTop && winScrollY + winHeight <= elHeight + elOffsetTop) {
      if (!elClasses.contains('mb-fixed')) elClasses.add('mb-fixed');
      if (elClasses.contains('mb-bottom')) elClasses.remove('mb-bottom');
      if (elClasses.contains('mb-gone')) elClasses.remove('mb-gone');
      // if window is below the element + height
    } else if (winScrollY > elOffsetTop + elHeight) {
      if (elClasses.contains('mb-bottom')) elClasses.remove('mb-bottom');
      if (!elClasses.contains('mb-gone')) elClasses.add('mb-gone');
      // if the window is past the element
      // place the el in the bottom
    } else if (winScrollY + winHeight >= elOffsetTop + elHeight) {
      if (elClasses.contains('mb-fixed')) elClasses.remove('mb-fixed');
      if (!elClasses.contains('mb-bottom')) elClasses.add('mb-bottom');
      if (elClasses.contains('mb-gone')) elClasses.remove('mb-gone');
    } else if (winScrollY + winHeight > elOffsetTop + elHeight) {
      if (elClasses.contains('mb-bottom')) elClasses.remove('mb-bottom');
      if (!elClasses.contains('mb-gone')) elClasses.add('mb-gone');
      // if the window is above the element
    } else if (winScrollY < elOffsetTop) {
      if (elClasses.contains('mb-fixed')) elClasses.remove('mb-fixed');
      if (elClasses.contains('mb-bottom')) elClasses.remove('mb-bottom');
      if (elClasses.contains('mb-gone')) elClasses.remove('mb-gone');
    }

    // if the current iteration is fixed
    // on scroll call the zoom function which
    // zooms in
    if (elClasses.contains('mb-fixed')) {
      zoomIn(el, winScrollY - elOffsetTop);
      // console.log(window.scrollY - (elOffsetTop))
    }
  });
};

// add translate to el based on zoom pos
var zoomIn = function zoomIn(el, zoomTo) {
  var targetEl = el.querySelector('.view-content');
  var childs = targetEl.querySelectorAll('article');
  // fake step level
  var currentStep = parseInt(zoomTo / 800);

  if (window.innerWidth >= 900) {
    targetEl.style.transform = 'translate3d(0px, 0px, ' + zoomTo * 3 + 'px)';
  } else {
    targetEl.style.transform = 'translate3d(' + -zoomTo * 3 + 'px, 0px, 0px)';
  }
  // targetEl.style.webkitTransform = `translate3d(0, 0, ${zoomTo / 4}px)`
};

var attachWindowEvents = function attachWindowEvents() {
  window.addEventListener('scroll', function () {
    handleMbScrollPos();
  });
};

var init = function init() {
  mbParent.forEach(function (el, i) {
    createMbInstance(el, i);
    mbActiveEls = document.querySelectorAll('.mb-active');
  });

  if (window.innerWidth > 901) {
    attachWindowEvents()
    handleMbScrollPos()
  } else {
    runMobileScroll()
  }

  // attachWindowEvents()
  startShopMb();
};

// use request anim frame for mobile for better res
var runMobileScroll = function runMobileScroll() {
  (function run() {
    window.requestAnimFrame(run);
    handleMbScrollPos();
  })();
};

// document.addEventListener('DOMContentLoaded', init)
init();
