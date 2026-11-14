/* Starter site script. Three small behaviours, each one guarded for reduced motion and touch:
   1. Pointer tilt on the signature card (pointer devices only).
   2. One-time reveals of [data-reveal] elements when they enter the screen.
   3. Adds the .js class so the reveal rules apply only when scripts run.
   Replace or extend the signature behaviour (see references/technique-recipes.md). */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // 1. Pointer tilt with spring-back
  var card = document.getElementById('stage-card');
  if (card && canHover && !reduceQuery.matches) {
    var maxDeg = 10, tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    var loop = function () {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      card.style.transform = 'rotateX(' + cy.toFixed(2) + 'deg) rotateY(' + cx.toFixed(2) + 'deg)';
      var settled = Math.abs(tx - cx) + Math.abs(ty - cy) < 0.01;
      raf = settled ? 0 : requestAnimationFrame(loop);
    };
    var kick = function () { if (!raf) raf = requestAnimationFrame(loop); };
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2 * maxDeg;
      ty = -((e.clientY - r.top) / r.height - 0.5) * 2 * maxDeg;
      kick();
    });
    card.addEventListener('pointerleave', function () { tx = 0; ty = 0; kick(); });
  }

  // 2. One-time reveals
  var items = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  if (reduceQuery.matches || !('IntersectionObserver' in window)) {
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
