/* Meridian Night Rail: scrolling flies the camera forward through a row of station cards in 3D space.
   Each card sits further back in Z; scroll progress moves them toward the viewer, then past it. */
(function () {
  'use strict';

  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var track = document.getElementById('track');
  var viewport = document.getElementById('viewport');
  var rail = document.getElementById('rail');
  var hint = document.getElementById('hint');
  var clock = document.getElementById('clock');
  var cards = [].slice.call(document.querySelectorAll('.station'));
  var N = cards.length;
  var D = 900;                 // depth between stations, px
  var cam = 0, camTarget = 0;  // camera position in station units (0..N-1)
  var active = -1;
  var px = 50, py = 50, tpx = 50, tpy = 50;

  var names = ['Depart', 'Lisbon', 'Madrid', 'Lyon', 'Zurich', 'Vienna'];
  var dots = names.map(function (n, i) {
    var b = document.createElement('button');
    b.innerHTML = '<span>' + n + '</span>';
    b.setAttribute('aria-label', 'Go to ' + n);
    b.addEventListener('click', function () { scrollToStation(i); });
    rail.appendChild(b);
    return b;
  });

  function maxScroll() { return track.offsetHeight - window.innerHeight; }
  function scrollToStation(i) {
    window.scrollTo({ top: (i / (N - 1)) * maxScroll(), behavior: RM ? 'auto' : 'smooth' });
  }

  function readScroll() {
    var p = Math.min(1, Math.max(0, window.scrollY / Math.max(1, maxScroll())));
    camTarget = p * (N - 1);
  }

  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };

  function frame() {
    cam += (camTarget - cam) * (RM ? 1 : 0.08);
    if (Math.abs(camTarget - cam) < 0.0005) cam = camTarget;
    px += (tpx - px) * 0.06;
    py += (tpy - py) * 0.06;
    viewport.style.setProperty('--px', px.toFixed(2) + '%');
    viewport.style.setProperty('--py', py.toFixed(2) + '%');

    var wide = window.innerWidth > 800;
    cards.forEach(function (c, i) {
      var d = i - cam;                       // stations ahead of the camera (negative = passed)
      var z = -d * D;
      var x = wide ? (i % 2 ? 16 : -16) * (1 - clamp(1 - Math.abs(d), 0, 1)) : 0;   // swing to centre as it arrives
      var y = d < 0 ? d * 40 : 0;
      var op = d < 0 ? 1 + d / 0.45 : (d > 1 ? 1 - (d - 1) / 0.9 : 1);
      op = clamp(op, 0, 1);
      c.style.transform = 'translate(-50%, -50%) translate3d(' + x + 'vw,' + y + 'px,' + z.toFixed(1) + 'px)';
      c.style.opacity = op.toFixed(3);
      c.style.filter = d > 1 ? 'blur(' + clamp((d - 1) * 5, 0, 8).toFixed(1) + 'px)' : 'none';
      c.style.visibility = op <= 0.01 ? 'hidden' : 'visible';
      c.style.pointerEvents = op > 0.6 ? 'auto' : 'none';
    });

    var idx = clamp(Math.round(cam), 0, N - 1);
    if (idx !== active) {
      active = idx;
      dots.forEach(function (b, k) { b.classList.toggle('on', k === idx); });
    }
    hint.style.opacity = cam > 0.15 ? 0 : 1;
    clock.textContent = ['20:40', '20:40', '06:10', '15:35', '21:20', '07:05'][idx];
    requestAnimationFrame(frame);
  }

  window.addEventListener('scroll', readScroll, { passive: true });
  window.addEventListener('resize', readScroll);
  window.addEventListener('pointermove', function (e) {
    tpx = 50 + (e.clientX / window.innerWidth - 0.5) * 14;
    tpy = 50 + (e.clientY / window.innerHeight - 0.5) * 10;
  });
  window.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); scrollToStation(Math.min(N - 1, active + 1)); }
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); scrollToStation(Math.max(0, active - 1)); }
  });

  readScroll();
  cam = -0.6;                    // opening: the first card glides in from the distance
  requestAnimationFrame(frame);
})();
