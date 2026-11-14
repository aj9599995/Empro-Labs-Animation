/* Stretch & Co.: variable-font proximity animation. Every letter is its own element; each frame its weight and width
   (font-variation-settings) ease toward a target set by how close the pointer is. With no pointer, a wave rolls
   through the letters. The tester below drives the same axes from sliders, with a "surprise me" tween. */
(function () {
  'use strict';

  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (id) { return document.getElementById(id); };
  var hero = $('hero'), letters = [];
  var px = -9999, py = -9999, lastMove = 0;
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };

  /* split each headline line into one span per letter */
  ['l1', 'l2'].forEach(function (id, li) {
    var el = $(id), text = el.textContent;
    el.textContent = '';
    text.split('').forEach(function (c) {
      var s = document.createElement('span');
      s.className = 'ch' + (c === ' ' ? ' sp' : '');
      s.textContent = c === ' ' ? ' ' : c;
      el.appendChild(s);
      letters.push({ el: s, w: 120, d: 60, line: li, i: letters.length });
    });
  });

  hero.addEventListener('pointermove', function (e) { px = e.clientX; py = e.clientY; lastMove = performance.now(); });
  hero.addEventListener('pointerdown', function (e) { px = e.clientX; py = e.clientY; lastMove = performance.now(); });
  hero.addEventListener('pointerleave', function () { lastMove = 0; });

  function frame(now) {
    var R = Math.max(140, Math.min(innerWidth, 900) * 0.22), idle = now - lastMove > 1800;
    var t = now / 1000, n = letters.length;
    for (var k = 0; k < n; k++) {
      var L = letters[k], tw, td;
      if (idle) {                                                    // no pointer: a slow wave rolls through
        var wave = (Math.sin(t * 1.8 - k * 0.55) + 1) / 2;
        tw = lerp(120, 820, wave); td = lerp(60, 140, wave);
      } else {
        var r = L.el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        var near = clamp(1 - Math.hypot(cx - px, (cy - py) * (L.line ? 1.8 : 1)) / R, 0, 1);
        near = near * near * (3 - 2 * near);                          // smoothstep falloff
        tw = lerp(120, 900, near); td = lerp(60, 150, near);
      }
      L.w += (tw - L.w) * 0.16; L.d += (td - L.d) * 0.16;
      L.el.style.fontVariationSettings = "'wght' " + L.w.toFixed(0) + ", 'wdth' " + L.d.toFixed(0);
    }
    if (!RM) requestAnimationFrame(frame);
  }
  if (RM) { letters.forEach(function (L) { L.el.style.fontVariationSettings = "'wght' 700, 'wdth' 100"; }); }
  else requestAnimationFrame(frame);

  /* ---- tester ---- */
  var txt = $('txt'), w = $('w'), d = $('d'), s = $('s'), ow = $('ow'), od = $('od'), os = $('os');
  function apply() {
    txt.style.fontVariationSettings = "'wght' " + w.value + ", 'wdth' " + d.value;
    txt.style.fontSize = s.value + 'px';
    ow.textContent = Math.round(w.value); od.textContent = Math.round(d.value); os.textContent = Math.round(s.value);
  }
  [w, d, s].forEach(function (el) { el.addEventListener('input', apply); });
  var tween = 0;
  function to(tw, td, ts) {
    cancelAnimationFrame(tween);
    var f = [+w.value, +d.value, +s.value], t0 = performance.now(), dur = RM ? 1 : 900;
    (function step(now) {
      var p = clamp((now - t0) / dur, 0, 1), e = 1 - Math.pow(1 - p, 3);
      w.value = lerp(f[0], tw, e); d.value = lerp(f[1], td, e); s.value = lerp(f[2], ts, e); apply();
      if (p < 1) tween = requestAnimationFrame(step);
    })(t0);
  }
  $('rand').addEventListener('click', function () { to(100 + Math.random() * 800, 50 + Math.random() * 100, 40 + Math.random() * 100); });
  $('reset').addEventListener('click', function () { to(500, 100, 72); });
  apply();
})();
