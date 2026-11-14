/* Squeeze & Co.: a chain of circles chases the cursor, each one lagging more than the last; an SVG goo filter
   (blur + alpha threshold) fuses overlapping circles into one stretching liquid. Click to squirt a droplet.
   Buttons and cards lean toward the pointer when it is near. */
(function () {
  'use strict';

  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hero = document.getElementById('hero'), goo = document.getElementById('goo');
  var COLORS = ['#ff8a3d', '#ffb02e', '#ff6b4a', '#ffd34d', '#ff8a3d', '#ffb02e', '#ff6b4a'];
  var blobs = COLORS.map(function (c, i) {
    var el = document.createElement('div');
    var s = 150 - i * 15;
    el.className = 'blob';
    el.style.cssText = 'width:' + s + 'px;height:' + s + 'px;margin:' + (-s / 2) + 'px 0 0 ' + (-s / 2) + 'px;background:' + c;
    goo.appendChild(el);
    return { el: el, x: 0, y: 0, k: 0.28 - i * 0.032 };
  });
  var drops = [];
  var mx = innerWidth / 2, my = innerHeight / 2, inside = false, t0 = performance.now();

  hero.addEventListener('pointermove', function (e) {
    var r = hero.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; inside = true;
  });
  hero.addEventListener('pointerleave', function () { inside = false; });
  hero.addEventListener('pointerdown', function (e) {
    var r = hero.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    for (var i = 0; i < 5; i++) {
      var a = Math.random() * 6.283, sp = 6 + Math.random() * 9, s = 22 + Math.random() * 34;
      var el = document.createElement('div');
      el.className = 'blob';
      el.style.cssText = 'width:' + s + 'px;height:' + s + 'px;margin:' + (-s / 2) + 'px 0 0 ' + (-s / 2) + 'px;background:#ff8a3d';
      goo.appendChild(el);
      drops.push({ el: el, x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 6, life: 1 });
    }
  });

  function frame(now) {
    var t = (now - t0) / 1000, W = hero.clientWidth, H = hero.clientHeight;
    if (!inside) { mx = W / 2 + Math.cos(t * 0.8) * W * 0.28; my = H / 2 + Math.sin(t * 1.3) * H * 0.22; }   // wander when idle
    var px = mx, py = my;
    blobs.forEach(function (b) {
      b.x += (px - b.x) * b.k; b.y += (py - b.y) * b.k;
      b.el.style.transform = 'translate(' + b.x.toFixed(1) + 'px,' + b.y.toFixed(1) + 'px)';
      px = b.x; py = b.y;
    });
    for (var i = drops.length - 1; i >= 0; i--) {
      var d = drops[i];
      d.vy += 0.5; d.x += d.vx; d.y += d.vy; d.vx *= 0.985; d.life -= 0.012;
      d.el.style.transform = 'translate(' + d.x.toFixed(1) + 'px,' + d.y.toFixed(1) + 'px) scale(' + Math.max(0, d.life).toFixed(2) + ')';
      if (d.life <= 0 || d.y > H + 80) { d.el.remove(); drops.splice(i, 1); }
    }
    requestAnimationFrame(frame);
  }
  if (!RM) requestAnimationFrame(frame);
  else blobs.forEach(function (b, i) { b.el.style.transform = 'translate(' + (innerWidth * 0.5 + i * 30) + 'px,' + (innerHeight * 0.5) + 'px)'; });

  /* magnetic pull */
  var mags = [].slice.call(document.querySelectorAll('.mag'));
  window.addEventListener('pointermove', function (e) {
    if (RM) return;
    mags.forEach(function (m) {
      var r = m.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      var dx = e.clientX - cx, dy = e.clientY - cy, d = Math.hypot(dx, dy), reach = Math.max(r.width, r.height) * 0.9;
      if (d < reach) { m.classList.add('on'); var pull = (1 - d / reach) * 0.35; m.style.transform = 'translate(' + (dx * pull).toFixed(1) + 'px,' + (dy * pull).toFixed(1) + 'px)'; }
      else { m.classList.remove('on'); m.style.transform = ''; }
    });
  });
})();
