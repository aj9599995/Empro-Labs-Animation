/* The Night Gallery: the same scene is drawn twice, once dark and once in full colour. The bright copy is hidden
   by a radial mask centred on a "lantern" that eases toward the pointer, flickers, and swells while you hold down.
   Standing the lantern close to an artefact finds it. When the pointer is idle the lantern wanders by itself. */
(function () {
  'use strict';

  var ART = [
    { n: 'Brass Compass', x: 14, y: 40, s: 'round',   c: '#b8862c', hi: '#ffe08a', lo: '#5a3d0c', d: 'Brass Compass. Found in a ship\'s chest, 1893. It still points slightly west.' },
    { n: 'Jade Mask',     x: 33, y: 66, s: 'tall',    c: '#2e8b6a', hi: '#9af0cc', lo: '#0f3d2e', d: 'Jade Mask. Worn once a year to ask for rain. It has never failed.' },
    { n: 'Cracked Vase',  x: 52, y: 36, s: 'tall',    c: '#c4573c', hi: '#ffb59c', lo: '#5a1f12', d: 'Cracked Vase. Mended with gold, so the crack is the best part.' },
    { n: 'Silver Key',    x: 70, y: 62, s: 'diamond', c: '#aab4c2', hi: '#ffffff', lo: '#4a5362', d: 'Silver Key. Opens a door nobody has found. We keep looking.' },
    { n: 'Spiral Shell',  x: 86, y: 38, s: 'shell',   c: '#e8a7b5', hi: '#fff0f3', lo: '#8a4a5a', d: 'Spiral Shell. Hold it to your ear and you hear the gallery at night.' },
    { n: 'Old Coin',      x: 22, y: 82, s: 'round',   c: '#d9b44a', hi: '#fff2b0', lo: '#6a5214', d: 'Old Coin. Stamped with a king no record remembers.' },
    { n: 'Paper Lantern', x: 62, y: 84, s: 'square',  c: '#ff7a59', hi: '#ffd1b8', lo: '#7a2a14', d: 'Paper Lantern. Lit by hand every evening. This is the one you are holding.' },
    { n: 'Clay Owl',      x: 44, y: 58, s: 'round',   c: '#8a6a4a', hi: '#d9b88f', lo: '#3a2a1a', d: 'Clay Owl. Watches the door. Has never blinked.' }
  ];
  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (id) { return document.getElementById(id); };
  var hall = $('hall'), dim = $('dim'), lit = $('lit'), info = $('info'), foundEl = $('found'), intro = $('intro');
  var DEFAULT_INFO = 'Concept museum · not a real gallery';

  function build(target, interactive) {
    ART.forEach(function (a, i) {
      var el = document.createElement('div');
      el.className = 'art';
      el.style.cssText = 'left:' + a.x + '%;top:' + a.y + '%;--c:' + a.c + ';--hi:' + a.hi + ';--lo:' + a.lo;
      el.innerHTML = '<i class="shape ' + a.s + '"></i>' + (interactive ? '<b>' + a.n + '</b>' : '<b>&nbsp;</b>');
      el.dataset.i = i;
      target.appendChild(el);
    });
  }
  build(dim, false); build(lit, true);
  var litEls = [].slice.call(lit.querySelectorAll('.art'));
  var seen = {}, nSeen = 0;

  var W = innerWidth, H = innerHeight;
  var tx = W * 0.5, ty = H * 0.55, x = tx, y = ty, down = false, idleAt = performance.now(), R = 190, base = 190;
  var cursor = document.createElement('div'); cursor.className = 'cursor'; hall.appendChild(cursor);

  function pt(e) { tx = e.clientX; ty = e.clientY; idleAt = performance.now(); intro.classList.add('gone'); }
  hall.addEventListener('pointermove', pt);
  hall.addEventListener('pointerdown', function (e) { pt(e); down = true; });
  window.addEventListener('pointerup', function () { down = false; });
  hall.addEventListener('pointerleave', function () { idleAt = 0; });
  window.addEventListener('resize', function () { W = innerWidth; H = innerHeight; });

  function frame(now) {
    var t = now / 1000;
    if (now - idleAt > 3200) {          // nobody is steering: the lantern drifts on its own
      tx = W * (0.5 + 0.36 * Math.sin(t * 0.37)); ty = H * (0.52 + 0.3 * Math.sin(t * 0.53 + 1));
    }
    x += (tx - x) * 0.14; y += (ty - y) * 0.14;
    var want = (down ? 1.55 : 1) * Math.min(230, Math.max(150, Math.min(W, H) * 0.3));
    base += (want - base) * 0.1;
    var flicker = RM ? 0 : Math.sin(t * 9) * 3 + Math.sin(t * 23.7) * 2 + Math.sin(t * 4.1) * 3;
    R = base + flicker;
    hall.style.setProperty('--x', x.toFixed(1) + 'px');
    hall.style.setProperty('--y', y.toFixed(1) + 'px');
    hall.style.setProperty('--r', R.toFixed(1) + 'px');
    cursor.style.transform = 'translate(' + tx + 'px,' + ty + 'px)';

    /* which artefacts are near the lantern? */
    var nearest = -1, best = 1e9;
    litEls.forEach(function (el, i) {
      var r = el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      var d = Math.hypot(cx - x, cy - y);
      if (d < R * 0.62 && !seen[i]) { seen[i] = true; nSeen++; el.classList.add('seen'); foundEl.textContent = nSeen + ' of ' + ART.length + ' found'; }
      if (d < R * 0.7 && d < best) { best = d; nearest = i; }
    });
    var text = nearest >= 0 ? ART[nearest].d : (nSeen === ART.length ? 'You found everything. Lock up on your way out.' : DEFAULT_INFO);
    if (info.textContent !== text) info.textContent = text;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
