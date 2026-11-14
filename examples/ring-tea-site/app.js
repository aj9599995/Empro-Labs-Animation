/* Kettle & Cloud: a ring of 3D frames you spin by dragging, scrolling or arrow keys.
   The front frame sets the page colour, rolls the title letter by letter, and fills the caption. */
(function () {
  'use strict';

  var TEAS = [
    { name: 'Smoke', bg: '#2b2b33', accent: '#e8d9c0', c1: '#4a4a57', c2: '#1d1d24', notes: 'Pine-smoked black tea with a dry, campfire finish.', meta: '4 min · 95°C · $14' },
    { name: 'Jade',  bg: '#12332b', accent: '#9be3b5', c1: '#2f7a5f', c2: '#0b211b', notes: 'Spring green tea, grassy and sweet, with no bitterness.', meta: '2 min · 75°C · $16' },
    { name: 'Ember', bg: '#3a1510', accent: '#ff9a62', c1: '#b8431f', c2: '#2a0d09', notes: 'Roasted oolong with toasted nuts and stone fruit.', meta: '3 min · 90°C · $18' },
    { name: 'Mist',  bg: '#1e2a3a', accent: '#a9c8ee', c1: '#4b6d99', c2: '#142031', notes: 'Silver-needle white tea, light as air, faintly floral.', meta: '3 min · 80°C · $22' },
    { name: 'Dusk',  bg: '#2a1a3a', accent: '#d9a8ff', c1: '#6e45a0', c2: '#1c1028', notes: 'Blackcurrant and hibiscus, tart and deep purple.', meta: '5 min · 98°C · $13' },
    { name: 'Honey', bg: '#3a2a0c', accent: '#ffd166', c1: '#b98421', c2: '#271b06', notes: 'Golden chamomile with wild honey. Made for late evenings.', meta: '5 min · 95°C · $12' }
  ];

  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var N = TEAS.length, STEP = 360 / N;
  var root = document.documentElement;
  var stage = document.getElementById('top');
  var ring = document.getElementById('ring');
  var wordEl = document.getElementById('word');
  var notes = document.getElementById('notes');
  var meta = document.getElementById('meta');
  var count = document.getElementById('count');
  var dotsEl = document.getElementById('dots');

  var frames = TEAS.map(function (t, i) {
    var f = document.createElement('div');
    f.className = 'frame';
    f.style.setProperty('--c1', t.c1);
    f.style.setProperty('--c2', t.c2);
    f.innerHTML = '<span>Tea ' + (i + 1) + '</span><b>' + String(i + 1).padStart(2, '0') + '</b><span>' + t.name + '</span>';
    f.addEventListener('click', function () { if (!moved) goTo(i); });
    ring.appendChild(f);
    return f;
  });

  var dots = TEAS.map(function (t, i) {
    var b = document.createElement('button');
    b.setAttribute('aria-label', t.name);
    b.addEventListener('click', function () { goTo(i); });
    dotsEl.appendChild(b);
    return b;
  });

  var angle = 0, target = 0, active = -1, radius = 300, moved = false, wheelTimer = 0;

  function layout() {
    var w = parseFloat(getComputedStyle(root).getPropertyValue('--fw')) || 230;
    radius = Math.round((w / 2) / Math.tan(Math.PI / N)) + 18;
    frames.forEach(function (f, i) {
      f.style.transform = 'rotateY(' + (i * STEP) + 'deg) translateZ(' + radius + 'px)';
    });
  }

  function norm(a) { a = a % 360; return a < -180 ? a + 360 : a > 180 ? a - 360 : a; }

  function paint() {
    ring.style.transform = 'translateZ(' + (-radius) + 'px) rotateY(' + angle.toFixed(3) + 'deg)';
    frames.forEach(function (f, i) {
      var d = Math.abs(norm(angle + i * STEP));
      var k = Math.max(0, Math.cos(d * Math.PI / 180));
      f.style.opacity = (0.3 + 0.7 * k).toFixed(3);
      f.style.filter = 'brightness(' + (0.55 + 0.45 * k).toFixed(3) + ')';
    });
    var idx = (((-Math.round(angle / STEP)) % N) + N) % N;
    if (idx !== active) show(idx);
  }

  function tick() {
    angle += (target - angle) * (RM ? 1 : 0.09);
    if (Math.abs(target - angle) < 0.01) angle = target;
    paint();
    requestAnimationFrame(tick);
  }

  function snap() { target = Math.round(target / STEP) * STEP; }

  function goTo(i) {
    var cur = (((-Math.round(target / STEP)) % N) + N) % N;
    var diff = i - cur;
    if (diff > N / 2) diff -= N;
    if (diff < -N / 2) diff += N;
    target -= diff * STEP;
  }
  function step(d) { target = Math.round(target / STEP) * STEP - d * STEP; }

  /* letter-by-letter roll: old letters leave upward, new letters rise from below */
  function roll(text) {
    var olds = [].slice.call(wordEl.querySelectorAll('.w'));
    var fresh = document.createElement('span');
    fresh.className = 'w';
    text.split('').forEach(function (c) {
      var s = document.createElement('span');
      s.className = 'ch';
      s.textContent = c;
      fresh.appendChild(s);
    });
    if (RM || !fresh.animate) {
      wordEl.textContent = '';
      wordEl.appendChild(fresh);
      return;
    }
    olds.forEach(function (o, k) { if (k < olds.length - 1) o.remove(); });
    var old = wordEl.querySelector('.w');
    wordEl.appendChild(fresh);
    var opt = function (i) { return { duration: 650, delay: i * 40, easing: 'cubic-bezier(.65,0,.25,1)', fill: 'both' }; };
    [].forEach.call(fresh.children, function (c, i) {
      c.animate([{ transform: 'translateY(105%)' }, { transform: 'translateY(0)' }], opt(i));
    });
    if (old) {
      [].forEach.call(old.children, function (c, i) {
        c.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-105%)' }], opt(i));
      });
      setTimeout(function () { old.remove(); }, 650 + 40 * old.children.length + 50);
    }
  }

  function show(i) {
    var first = active < 0;
    active = i;
    var t = TEAS[i];
    root.style.setProperty('--bg', t.bg);
    root.style.setProperty('--accent', t.accent);
    if (first) {
      wordEl.textContent = '';
      var s = document.createElement('span');
      s.className = 'w';
      s.textContent = t.name;
      wordEl.appendChild(s);
    } else {
      roll(t.name);
    }
    notes.textContent = t.notes;
    meta.textContent = t.meta;
    count.textContent = String(i + 1).padStart(2, '0') + ' / ' + String(N).padStart(2, '0');
    dots.forEach(function (d, k) { d.classList.toggle('on', k === i); });
  }

  /* drag */
  var down = false, sx = 0, st = 0;
  stage.addEventListener('pointerdown', function (e) {
    if (e.target.closest('button, a')) return;
    down = true; moved = false; sx = e.clientX; st = target;
    stage.classList.add('drag');
  });
  window.addEventListener('pointermove', function (e) {
    stage.style.setProperty('--mx', e.clientX + 'px');
    stage.style.setProperty('--my', (e.clientY - stage.getBoundingClientRect().top) + 'px');
    if (!down) return;
    var dx = e.clientX - sx;
    if (Math.abs(dx) > 4) moved = true;
    target = st + dx * 0.35;
  });
  window.addEventListener('pointerup', function () {
    if (!down) return;
    down = false;
    stage.classList.remove('drag');
    snap();
    setTimeout(function () { moved = false; }, 0);
  });

  /* wheel: sideways scroll or shift+wheel spins the ring; plain vertical scroll still scrolls the page */
  stage.addEventListener('wheel', function (e) {
    var dx = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : (e.shiftKey ? e.deltaY : 0);
    if (!dx) return;
    e.preventDefault();
    target -= dx * 0.12;
    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(snap, 140);
  }, { passive: false });

  window.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);
  });
  document.getElementById('next').addEventListener('click', function () { step(1); });
  document.getElementById('prev').addEventListener('click', function () { step(-1); });
  window.addEventListener('resize', layout);

  layout();
  target = -STEP * 0; angle = -60;      // opening turn: the ring settles into place
  paint();
  requestAnimationFrame(tick);
})();
