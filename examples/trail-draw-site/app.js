/* Switchback: a trail line is drawn down the page as you scroll (stroke-dashoffset), a hiker dot rides its tip,
   the altitude badge counts to the current stop, and each block wipes in once with a clip-path. */
(function () {
  'use strict';

  var page = document.getElementById('page');
  var svg = document.getElementById('trail');
  var line = document.getElementById('line');
  var ghost = document.getElementById('ghost');
  var hiker = document.getElementById('hiker');
  var alt = document.getElementById('alt');
  var stops = [].slice.call(document.querySelectorAll('.stop'));
  var ridges = [].slice.call(document.querySelectorAll('.ridge svg path'));
  var len = 1, wide = true;

  function pathFromStops() {
    var W = page.clientWidth, H = page.clientHeight;
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    wide = W > 700;
    var pts = stops.map(function (s, i) {
      var y = s.offsetTop + s.offsetHeight / 2;
      var x = !wide ? W * 0.9 : (s.classList.contains('hero') ? W / 2 : s.classList.contains('left') ? W * 0.74 : W * 0.26);
      if (i === 0) y = s.offsetTop + s.offsetHeight * 0.88;      // start below the headline
      return [x, y];
    });
    var d = 'M' + pts[0][0] + ' ' + pts[0][1];
    for (var i = 1; i < pts.length; i++) {
      var a = pts[i - 1], b = pts[i], my = (a[1] + b[1]) / 2;
      d += ' C' + a[0] + ' ' + my + ' ' + b[0] + ' ' + my + ' ' + b[0] + ' ' + b[1];
    }
    ghost.setAttribute('d', d);
    line.setAttribute('d', d);
    len = line.getTotalLength();
    line.style.strokeDasharray = len;
    update();
  }

  function update() {
    var vh = window.innerHeight;
    var y = window.scrollY + vh * 0.5;                   // the tip tracks the middle of the screen
    var first = stops[0].offsetTop + stops[0].offsetHeight * 0.88;
    var last = stops[stops.length - 1].offsetTop + stops[stops.length - 1].offsetHeight / 2;
    var p = Math.min(1, Math.max(0, (y - first) / (last - first)));
    line.style.strokeDashoffset = len * (1 - p);
    var pt = line.getPointAtLength(len * p);
    hiker.setAttribute('cx', pt.x);
    hiker.setAttribute('cy', pt.y);
    hiker.style.opacity = p > 0 ? 1 : 0;

    // altitude: ease between the data-alt of the surrounding stops
    var pos = (y - stops[0].offsetTop) / (stops[0].offsetHeight);
    var idx = 0;
    stops.forEach(function (s, i) { if (y >= s.offsetTop) idx = i; });
    var cur = stops[idx], nxt = stops[Math.min(idx + 1, stops.length - 1)];
    var t = idx === stops.length - 1 ? 0 : Math.min(1, Math.max(0, (y - cur.offsetTop) / cur.offsetHeight));
    var a = (+cur.dataset.alt) + ((+nxt.dataset.alt) - (+cur.dataset.alt)) * t;
    alt.textContent = Math.round(a).toLocaleString('en-US') + ' m';

    // parallax on the hero mountains
    var sy = window.scrollY;
    ridges.forEach(function (r, i) { r.style.transform = 'translateY(' + (sy * (0.12 + i * 0.12)).toFixed(1) + 'px)'; });
  }

  /* watch the unclipped parent block; its .reveal children wipe in one after another */
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      [].forEach.call(e.target.querySelectorAll('.reveal'), function (el, k) {
        el.style.transitionDelay = (k * 0.14) + 's';
        el.classList.add('in');
      });
      io.unobserve(e.target);
    });
  }, { threshold: 0.3 }) : null;
  [].forEach.call(document.querySelectorAll('.txt'), function (el) {
    if (io) io.observe(el);
    else [].forEach.call(el.querySelectorAll('.reveal'), function (r) { r.classList.add('in'); });
  });

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', pathFromStops);
  window.addEventListener('load', pathFromStops);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(pathFromStops);
  pathFromStops();
})();
