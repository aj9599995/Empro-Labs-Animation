/* Gumdrop Labs: a small 2D physics toy. Circles fall under gravity, collide with each other and the walls,
   and can be grabbed and thrown. Hand-written (no library): positions are integrated each frame and overlaps pushed apart. */
(function () {
  'use strict';

  var FLAVOURS = ['Mango', 'Lime', 'Cherry', 'Grape', 'Mint', 'Peach', 'Cola', 'Lemon', 'Berry', 'Melon', 'Plum', 'Kiwi', 'Rose', 'Fig'];
  var COLORS = ['#ffb300', '#7bd33f', '#e8264a', '#8a4fe0', '#2ec4b6', '#ff8a65', '#5a3a2e', '#ffe14a', '#d6336c', '#80ed99', '#7048e8', '#9ad13d', '#ff7aa8', '#8d5a97'];
  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cv = document.getElementById('c'), ctx = cv.getContext('2d');
  var countEl = document.getElementById('count');
  var W = 0, H = 0, DPR = 1, balls = [], held = null, hold = { x: 0, y: 0 }, pointer = { x: 0, y: 0, px: 0, py: 0 };
  var G = 0.55, REST = 0.55, MAX = 70;

  function resize() {
    DPR = Math.min(2, window.devicePixelRatio || 1);
    var r = cv.getBoundingClientRect();
    W = r.width; H = r.height;
    cv.width = W * DPR; cv.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    balls.forEach(function (b) { b.x = Math.min(Math.max(b.x, b.r), W - b.r); b.y = Math.min(b.y, H - b.r); });
  }

  function spawn(i, delay) {
    var base = Math.min(W, H) < 600 ? 22 : 30;
    var r = base + Math.random() * base * 0.7;
    var k = i % FLAVOURS.length;
    balls.push({
      x: r + Math.random() * (W - 2 * r), y: -r - Math.random() * H * 0.9 - delay,
      vx: (Math.random() - 0.5) * 3, vy: 0, r: r, m: r * r,
      c: COLORS[k], t: FLAVOURS[k], a: Math.random() * 6.28, w: 0
    });
  }

  function fill(n) { for (var i = 0; i < n; i++) spawn(i, i * 12); }

  function step() {
    var i, j, a, b;
    for (i = 0; i < balls.length; i++) {
      a = balls[i];
      if (a === held) {
        var tx = pointer.x - hold.x, ty = pointer.y - hold.y;
        a.vx = (tx - a.x) * 0.35; a.vy = (ty - a.y) * 0.35;
      } else { a.vy += G; }
      a.x += a.vx; a.y += a.vy;
      a.vx *= 0.997; a.vy *= 0.997;
      a.a += a.vx * 0.02;
      if (a.x < a.r) { a.x = a.r; a.vx = -a.vx * REST; }
      if (a.x > W - a.r) { a.x = W - a.r; a.vx = -a.vx * REST; }
      if (a.y > H - a.r) { a.y = H - a.r; a.vy = -a.vy * REST; a.vx *= 0.985; if (Math.abs(a.vy) < 0.8) a.vy = 0; }
    }
    for (var it = 0; it < 3; it++) {                       // a few passes make the pile settle without jitter
      for (i = 0; i < balls.length; i++) for (j = i + 1; j < balls.length; j++) {
        a = balls[i]; b = balls[j];
        var dx = b.x - a.x, dy = b.y - a.y, min = a.r + b.r, d2 = dx * dx + dy * dy;
        if (d2 >= min * min || d2 === 0) continue;
        var d = Math.sqrt(d2), nx = dx / d, ny = dy / d, over = (min - d);
        var ia = a === held ? 0 : 1 / a.m, ib = b === held ? 0 : 1 / b.m, s = ia + ib;
        if (!s) continue;
        a.x -= nx * over * ia / s; a.y -= ny * over * ia / s;
        b.x += nx * over * ib / s; b.y += ny * over * ib / s;
        var rv = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
        if (rv < 0) {
          var jv = -(1 + REST) * rv / s;
          a.vx -= jv * nx * ia; a.vy -= jv * ny * ia;
          b.vx += jv * nx * ib; b.vy += jv * ny * ib;
        }
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    balls.forEach(function (b) {
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.beginPath(); ctx.arc(0, 0, b.r, 0, 6.2832);
      ctx.fillStyle = b.c; ctx.fill();
      ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(42,23,48,.9)'; ctx.stroke();
      ctx.beginPath(); ctx.arc(-b.r * 0.35, -b.r * 0.4, b.r * 0.22, 0, 6.2832);   // gloss
      ctx.fillStyle = 'rgba(255,255,255,.45)'; ctx.fill();
      ctx.rotate(b.a);
      ctx.fillStyle = '#fff';
      ctx.font = '800 ' + Math.round(b.r * 0.42) + 'px Rubik, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.strokeStyle = 'rgba(42,23,48,.55)'; ctx.lineWidth = 3; ctx.strokeText(b.t, 0, 2);
      ctx.fillText(b.t, 0, 2);
      ctx.restore();
    });
  }

  function loop() {
    step();
    draw();
    countEl.textContent = balls.length + ' gumdrops';
    requestAnimationFrame(loop);
  }

  function toLocal(e) { var r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
  cv.addEventListener('pointerdown', function (e) {
    var p = toLocal(e); pointer.x = p.x; pointer.y = p.y;
    for (var i = balls.length - 1; i >= 0; i--) {
      var b = balls[i];
      if ((p.x - b.x) * (p.x - b.x) + (p.y - b.y) * (p.y - b.y) <= b.r * b.r) {
        held = b; hold.x = p.x - b.x; hold.y = p.y - b.y; cv.classList.add('grab'); cv.setPointerCapture(e.pointerId); break;
      }
    }
  });
  cv.addEventListener('pointermove', function (e) { var p = toLocal(e); pointer.x = p.x; pointer.y = p.y; });
  function release() { if (held) { held.vx = Math.max(-40, Math.min(40, held.vx)); held.vy = Math.max(-40, Math.min(40, held.vy)); } held = null; cv.classList.remove('grab'); }
  cv.addEventListener('pointerup', release);
  cv.addEventListener('pointercancel', release);

  document.getElementById('shake').addEventListener('click', function () {
    balls.forEach(function (b) { b.vx += (Math.random() - 0.5) * 30; b.vy -= 14 + Math.random() * 22; });
  });
  document.getElementById('more').addEventListener('click', function () {
    var n = Math.min(10, MAX - balls.length);
    for (var i = 0; i < n; i++) spawn(balls.length + i, i * 14);
  });
  document.getElementById('reset').addEventListener('click', function () { balls = []; fill(28); });
  window.addEventListener('resize', resize);

  function start() { resize(); fill(28); if (RM) { for (var k = 0; k < 400; k++) step(); } requestAnimationFrame(loop); }
  if (document.fonts && document.fonts.load) document.fonts.load('800 20px Rubik').then(start, start); else start();
})();
