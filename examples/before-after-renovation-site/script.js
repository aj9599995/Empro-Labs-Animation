/* Before and after comparison. The handle sets --pos on the stage, which clips the "before" layer.
   Pointer drag, arrow keys, Home and End all work. On load the handle makes one sweep to show
   the difference, then settles at 50%. Any input skips the sweep. Reduced motion skips it too. */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var stage = document.getElementById('rb-stage');
  var handle = document.getElementById('rb-handle');
  var pos = 50;
  var sweeping = false;
  var dragging = false;

  function clamp(v) { return Math.min(100, Math.max(0, v)); }

  function setPos(v) {
    pos = clamp(v);
    stage.style.setProperty('--pos', pos.toFixed(2) + '%');
    handle.setAttribute('aria-valuenow', String(Math.round(pos)));
    handle.setAttribute('aria-valuetext', Math.round(pos) + '% before');
  }

  function stopSweep() {
    if (!sweeping) return;
    sweeping = false;
    setPos(50);
  }

  // Sweep path: 50 to 92, then to 8, then back to 50. Each leg eases in and out.
  function sweepValue(t) {
    var keys = [[0, 50], [0.3, 92], [0.75, 8], [1, 50]];
    for (var i = 0; i < keys.length - 1; i++) {
      var a = keys[i], b = keys[i + 1];
      if (t <= b[0]) {
        var u = (t - a[0]) / (b[0] - a[0]);
        u = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
        return a[1] + (b[1] - a[1]) * u;
      }
    }
    return 50;
  }

  function runSweep() {
    sweeping = true;
    var start = 0, duration = 1800;
    var step = function (now) {
      if (!sweeping) return;
      if (!start) start = now;
      var t = Math.min(1, (now - start) / duration);
      setPos(sweepValue(t));
      if (t < 1) requestAnimationFrame(step);
      else sweeping = false;
    };
    requestAnimationFrame(step);
  }

  setPos(50);
  if (!reduce.matches) {
    runSweep();
    window.addEventListener('keydown', stopSweep, { once: true });
  }

  function fromEvent(e) {
    var r = stage.getBoundingClientRect();
    setPos((e.clientX - r.left) / r.width * 100);
  }

  stage.addEventListener('pointerdown', function (e) {
    stopSweep();
    dragging = true;
    stage.setPointerCapture(e.pointerId);
    fromEvent(e);
  });
  stage.addEventListener('pointermove', function (e) { if (dragging) fromEvent(e); });
  stage.addEventListener('pointerup', function () { dragging = false; });
  stage.addEventListener('pointercancel', function () { dragging = false; });

  handle.addEventListener('keydown', function (e) {
    var step = e.shiftKey ? 10 : 5;
    if (e.key === 'ArrowLeft') { stopSweep(); setPos(pos - step); e.preventDefault(); }
    else if (e.key === 'ArrowRight') { stopSweep(); setPos(pos + step); e.preventDefault(); }
    else if (e.key === 'Home') { stopSweep(); setPos(0); e.preventDefault(); }
    else if (e.key === 'End') { stopSweep(); setPos(100); e.preventDefault(); }
  });

  // Reveal once as sections enter the screen
  var items = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  if (reduce.matches || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    items.forEach(function (el) { io.observe(el); });
  }
})();
