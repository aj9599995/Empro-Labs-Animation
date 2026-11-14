/* Pigment & Pail: layout animation. Filtering uses FLIP (first, last, invert, play) so tiles glide to their new
   cells; opening a swatch grows a clip-path from the tile's own rectangle to the full screen. */
(function () {
  'use strict';

  var PAINTS = [
    { n: 'Brick Dust',  h: '#b5503c', f: 'warm',    d: 'A dusty terracotta that warms a north-facing room.' },
    { n: 'Saffron',     h: '#e3a02b', f: 'warm',    d: 'Late-summer yellow with a little orange in it. Loud, in a friendly way.' },
    { n: 'Peach Fuzz',  h: '#f2b693', f: 'warm',    d: 'Soft and sleepy. Looks best in morning light.' },
    { n: 'Rust Belt',   h: '#8a3b1f', f: 'warm',    d: 'Deep, iron-rich brown for doors and bold accent walls.' },
    { n: 'Harbour',     h: '#2f5d7c', f: 'cool',    d: 'A working-boat blue, steady and a little grey.' },
    { n: 'Sea Glass',   h: '#9fcdbf', f: 'cool',    d: 'Pale green that cools a sunny kitchen.' },
    { n: 'Midnight Ink',h: '#1f2a44', f: 'cool',    d: 'Near-black navy. Makes small rooms feel intentional.' },
    { n: 'Lilac Hour',  h: '#b9a7d6', f: 'cool',    d: 'The colour of the sky ten minutes after sunset.' },
    { n: 'Oat Milk',    h: '#e7dcc8', f: 'neutral', d: 'A creamy off-white that never looks yellow.' },
    { n: 'Flint',       h: '#6b6a66', f: 'neutral', d: 'Mid grey with warm undertones. Calm and grown-up.' },
    { n: 'Chalk',       h: '#f1eee8', f: 'neutral', d: 'Soft white for ceilings and trim. Reflects, never glares.' },
    { n: 'Charcoal',    h: '#2b2b2a', f: 'neutral', d: 'Soft black with a matte finish. Hides every scuff.' }
  ];

  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var grid = document.getElementById('grid');
  var filters = document.getElementById('filters');
  var sheet = document.getElementById('sheet');
  var closeBtn = document.getElementById('close');
  var EASE = 'cubic-bezier(.22,.8,.2,1)';
  var openTile = null, opener = null;

  function lum(hex) {
    var c = [1, 3, 5].map(function (i) { return parseInt(hex.substr(i, 2), 16) / 255; });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }
  var textOn = function (hex) { return lum(hex) > 0.55 ? '#1b1a18' : '#faf6ef'; };

  var tiles = PAINTS.map(function (p, i) {
    var b = document.createElement('button');
    b.className = 'tile';
    b.style.background = p.h;
    b.style.color = textOn(p.h);
    b.dataset.f = p.f;
    b.innerHTML = '<b>' + p.n + '</b><span>' + p.f + '</span>';
    b.addEventListener('click', function () { openSheet(i, b); });
    grid.appendChild(b);
    return b;
  });

  /* intro: tiles flip up one after another */
  if (!RM) tiles.forEach(function (t, i) {
    t.animate([
      { opacity: 0, transform: 'perspective(700px) rotateX(-70deg) translateY(30px)' },
      { opacity: 1, transform: 'none' }
    ], { duration: 800, delay: 150 + i * 60, easing: EASE, fill: 'backwards' });
  });

  /* FLIP filter */
  function filter(f) {
    var vis = tiles.filter(function (t) { return !t.hidden; });
    var first = new Map();
    vis.forEach(function (t) { first.set(t, t.getBoundingClientRect()); });

    var entering = [];
    tiles.forEach(function (t) {
      var show = f === 'all' || t.dataset.f === f;
      if (show && t.hidden) entering.push(t);
      t.hidden = !show;
    });

    tiles.forEach(function (t) {
      if (t.hidden || RM) return;
      var a = first.get(t);
      if (a) {
        var b = t.getBoundingClientRect();
        var dx = a.left - b.left, dy = a.top - b.top;
        if (dx || dy) t.animate([{ transform: 'translate(' + dx + 'px,' + dy + 'px)' }, { transform: 'none' }], { duration: 650, easing: EASE });
      } else {
        t.animate([{ opacity: 0, transform: 'scale(.8)' }, { opacity: 1, transform: 'none' }], { duration: 500, delay: 120, easing: EASE, fill: 'backwards' });
      }
    });
  }

  filters.addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b) return;
    [].forEach.call(filters.children, function (x) { x.classList.toggle('on', x === b); });
    filter(b.dataset.f);
  });

  /* open / close: clip-path grows from the tile's rectangle */
  function clipFor(tile) {
    var r = tile.getBoundingClientRect(), W = innerWidth, H = innerHeight;
    return 'inset(' + r.top + 'px ' + (W - r.right) + 'px ' + (H - r.bottom) + 'px ' + r.left + 'px round 6px)';
  }

  function openSheet(i, tile) {
    var p = PAINTS[i];
    openTile = tile; opener = tile;
    sheet.style.background = p.h;
    sheet.style.color = textOn(p.h);
    document.getElementById('sfam').textContent = p.f + ' family';
    document.getElementById('sname').textContent = p.n;
    document.getElementById('shex').textContent = p.h.toUpperCase();
    document.getElementById('sdesc').textContent = p.d;
    sheet.hidden = false;
    document.body.style.overflow = 'hidden';
    if (!RM) {
      sheet.animate([{ clipPath: clipFor(tile) }, { clipPath: 'inset(0px 0px 0px 0px round 0px)' }], { duration: 700, easing: EASE });
      sheet.querySelector('.sheet-in').animate([{ opacity: 0, transform: 'translateY(30px)' }, { opacity: 1, transform: 'none' }], { duration: 600, delay: 300, easing: EASE, fill: 'backwards' });
    }
    closeBtn.focus();
  }

  function closeSheet() {
    if (sheet.hidden) return;
    var done = function () { sheet.hidden = true; document.body.style.overflow = ''; if (opener) opener.focus(); };
    if (RM) return done();
    var a = sheet.animate([{ clipPath: 'inset(0px 0px 0px 0px round 0px)' }, { clipPath: clipFor(openTile) }], { duration: 550, easing: EASE, fill: 'forwards' });
    a.onfinish = function () { a.cancel(); done(); };
  }

  closeBtn.addEventListener('click', closeSheet);
  window.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSheet(); });
})();
