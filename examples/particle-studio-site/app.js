/* Murmur: a field of particles that forms each word, springs back when the cursor pushes through it. */
(function () {
  'use strict';

  var WORDS = [
    { w: 'Listen', tag: 'We record rooms the way they actually sound.', c: '#ff6b6b', bg: '#0b0f2a' },
    { w: 'Make',   tag: 'Build the track with people who hear what you hear.', c: '#ffd166', bg: '#0f1a2b' },
    { w: 'Play',   tag: 'Master it, press it, send it out loud.', c: '#6be6c1', bg: '#0a1f1f' }
  ];
  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cv = document.getElementById('field');
  var ctx = cv.getContext('2d');
  var tabsEl = document.getElementById('tabs');
  var tag = document.getElementById('tag');
  var sr = document.getElementById('srword');
  var root = document.documentElement;
  var W = 0, H = 0, DPR = 1, parts = [], active = -1, mouse = { x: -999, y: -999 }, timer = 0, color = [255, 107, 107];

  var tabs = WORDS.map(function (o, i) {
    var b = document.createElement('button');
    b.textContent = o.w; b.setAttribute('role', 'tab');
    b.addEventListener('click', function () { go(i, true); });
    tabsEl.appendChild(b);
    return b;
  });

  function hex(h) { return [1, 3, 5].map(function (i) { return parseInt(h.substr(i, 2), 16); }); }

  function sample(word) {
    var oc = document.createElement('canvas');
    oc.width = W; oc.height = H;
    var o = oc.getContext('2d');
    var size = Math.min(W * 0.86 / (word.length * 0.78), H * 0.42);
    o.fillStyle = '#fff';
    o.font = '800 100px Syne, sans-serif';
    size = Math.min(size, W * 0.86 / (o.measureText(word).width / 100));   // fit the real width
    o.font = '800 ' + size + 'px Syne, sans-serif';
    o.textAlign = 'center'; o.textBaseline = 'middle';
    o.fillText(word, W / 2, H * 0.42);
    var d = o.getImageData(0, 0, W, H).data, gap = Math.max(4, Math.round(size / 38)), pts = [];
    for (var y = 0; y < H; y += gap) for (var x = 0; x < W; x += gap) {
      if (d[(y * W + x) * 4 + 3] > 128) pts.push([x, y]);
    }
    return pts;
  }

  function retarget() {
    var pts = sample(WORDS[active].w);
    for (var i = pts.length - 1; i > 0; i--) { var j = Math.random() * (i + 1) | 0, t = pts[i]; pts[i] = pts[j]; pts[j] = t; }
    while (parts.length < pts.length) {
      parts.push({ x: Math.random() * W, y: H + Math.random() * 200, vx: 0, vy: 0, tx: 0, ty: 0, on: true, s: 1 + Math.random() * 1.2 });
    }
    parts.forEach(function (p, i) {
      if (i < pts.length) { p.tx = pts[i][0]; p.ty = pts[i][1]; p.on = true; }
      else { p.on = false; p.tx = Math.random() * W; p.ty = -40; }   // spares drift off the top
    });
  }

  function go(i, manual) {
    if (i === active) return;
    active = i;
    var o = WORDS[i];
    color = hex(o.c);
    root.style.setProperty('--accent', o.c);
    root.style.setProperty('--bg', o.bg);
    tag.textContent = o.tag; sr.textContent = o.w;
    tabs.forEach(function (b, k) { b.classList.toggle('on', k === i); b.setAttribute('aria-selected', k === i); });
    retarget();
    clearTimeout(timer);
    if (!RM) timer = setTimeout(function () { go((active + 1) % WORDS.length); }, manual ? 7000 : 4800);
  }

  function resize() {
    DPR = Math.min(2, window.devicePixelRatio || 1);
    var r = cv.getBoundingClientRect();
    W = Math.round(r.width); H = Math.round(r.height);
    cv.width = W * DPR; cv.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    if (active >= 0) retarget();
  }

  function frame() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = 'rgb(' + color.join(',') + ')';
    var R = 110, R2 = R * R;
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      var dx = mouse.x - p.x, dy = mouse.y - p.y, d2 = dx * dx + dy * dy;
      if (d2 < R2 && d2 > 1) { var d = Math.sqrt(d2), f = (1 - d / R) * 9; p.vx -= dx / d * f; p.vy -= dy / d * f; }
      p.vx += (p.tx - p.x) * 0.045; p.vy += (p.ty - p.y) * 0.045;
      p.vx *= 0.86; p.vy *= 0.86;
      p.x += p.vx; p.y += p.vy;
      if (!p.on && p.y < -20) continue;
      ctx.fillRect(p.x, p.y, p.s + 0.6, p.s + 0.6);
    }
    requestAnimationFrame(frame);
  }

  var hero = document.getElementById('top');
  hero.addEventListener('pointermove', function (e) { var r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
  hero.addEventListener('pointerleave', function () { mouse.x = mouse.y = -999; });
  window.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') go((active + 1) % WORDS.length, true);
    if (e.key === 'ArrowLeft') go((active + WORDS.length - 1) % WORDS.length, true);
  });
  window.addEventListener('resize', resize);

  function start() { resize(); go(0, false); requestAnimationFrame(frame); }
  if (document.fonts && document.fonts.load) document.fonts.load('800 100px Syne').then(start, start); else start();
})();
