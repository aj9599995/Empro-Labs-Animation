/* Late Reel: an endless row of posters with real momentum. Drag, fling or scroll; velocity decays with friction,
   the row skews with speed, posters near the centre scale up, and the title follows whichever poster is centred. */
(function () {
  'use strict';

  var FILMS = [
    { t: 'Night Tram',   m: '1962 · 94 min · Noir',        a: '#1d3557', b: '#0a1020', w: 'NOIR' },
    { t: 'Red Harbour',  m: '1974 · 108 min · Thriller',   a: '#c1121f', b: '#3a0509', w: 'RED' },
    { t: 'Glass Summer', m: '1988 · 91 min · Romance',     a: '#e9c46a', b: '#8a5a12', w: 'SUN' },
    { t: 'The Long Dry', m: '1979 · 122 min · Western',    a: '#b5651d', b: '#3d2008', w: 'DUST' },
    { t: 'Neon Aquarium',m: '1996 · 99 min · Sci-fi',      a: '#06d6a0', b: '#053b30', w: 'NEON' },
    { t: 'Paper Moon',   m: '1971 · 87 min · Comedy',      a: '#cdb4db', b: '#4a3a62', w: 'MOON' },
    { t: 'Quiet Engine', m: '2004 · 115 min · Drama',      a: '#8d99ae', b: '#222a38', w: 'IRON' }
  ];
  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var stage = document.getElementById('stage');
  var track = document.getElementById('track');
  var title = document.getElementById('title');
  var meta = document.getElementById('meta');
  var big = document.getElementById('bigword');
  var GAP = 28, setW = 0, items = [], x = 0, v = 0, down = false, lastX = 0, lastT = 0, cur = -1;

  /* three copies so the loop never shows an edge */
  for (var c = 0; c < 3; c++) FILMS.forEach(function (f, i) {
    var p = document.createElement('div');
    p.className = 'poster';
    p.style.background = 'linear-gradient(165deg,' + f.a + ',' + f.b + ')';
    p.innerHTML = '<span>' + f.m.split(' · ')[0] + '</span><b>' + f.t + '</b>';
    p.dataset.i = i;
    track.appendChild(p);
    items.push(p);
  });

  function measure() {
    var n = FILMS.length;
    setW = items[n].offsetLeft - items[0].offsetLeft;      // width of one full set
    if (!x) x = -setW + (innerWidth - items[0].offsetWidth) / 2;    // start with the first poster centred in the middle copy
  }

  function show(i) {
    if (i === cur) return;
    cur = i;
    title.textContent = FILMS[i].t;
    meta.textContent = FILMS[i].m;
    big.textContent = FILMS[i].w;
    document.documentElement.style.setProperty('--hot', FILMS[i].a);
  }

  function frame() {
    if (!down) { x += v; v *= 0.95; if (Math.abs(v) < 0.02) v = 0; }
    var lo = -setW * 1.5, hi = -setW * 0.5;                 // keep the middle copy in view by wrapping
    while (x < lo - innerWidth) x += setW;
    while (x > hi + innerWidth) x -= setW;
    var skew = Math.max(-14, Math.min(14, v * 0.35));
    track.style.transform = 'translate3d(' + x.toFixed(2) + 'px,-58%,0) skewX(' + (-skew).toFixed(2) + 'deg)';

    var mid = innerWidth / 2, best = 1e9, bi = 0;
    items.forEach(function (p) {
      var r = p.offsetLeft + x + p.offsetWidth / 2;
      var d = Math.abs(r - mid);
      var k = Math.max(0, 1 - d / (innerWidth * 0.45));
      p.style.transform = 'scale(' + (0.82 + 0.26 * k).toFixed(3) + ') translateY(' + (-k * 14).toFixed(1) + 'px)';
      p.style.filter = 'brightness(' + (0.55 + 0.45 * k).toFixed(2) + ')';
      if (d < best) { best = d; bi = +p.dataset.i; }
    });
    show(bi);
    requestAnimationFrame(frame);
  }

  stage.addEventListener('pointerdown', function (e) { down = true; lastX = e.clientX; lastT = performance.now(); v = 0; stage.classList.add('drag'); stage.setPointerCapture(e.pointerId); });
  stage.addEventListener('pointermove', function (e) {
    if (!down) return;
    var now = performance.now(), dx = e.clientX - lastX, dt = Math.max(1, now - lastT);
    x += dx; v = dx / dt * 16; lastX = e.clientX; lastT = now;
  });
  function up() { down = false; stage.classList.remove('drag'); }
  stage.addEventListener('pointerup', up);
  stage.addEventListener('pointercancel', up);
  stage.addEventListener('wheel', function (e) { e.preventDefault(); v -= (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY) * 0.06; }, { passive: false });
  window.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') v -= 22; if (e.key === 'ArrowLeft') v += 22; });
  window.addEventListener('resize', measure);

  function start() { measure(); requestAnimationFrame(frame); if (!RM) v = -26; }   // a small opening fling
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(start); else start();
})();
