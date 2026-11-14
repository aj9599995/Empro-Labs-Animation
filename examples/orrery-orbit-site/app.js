/* The Orrery: six planets orbit a sun on their real relative year lengths (a simulated clock in Earth days drives
   every angle). Orbits are drawn as flattened ellipses for depth. Choosing a planet makes the camera ease toward it
   and keep following as it moves; "All" eases back out. A slider sets how many days pass per second. */
(function () {
  'use strict';

  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NS = 'http://www.w3.org/2000/svg';
  var P = [
    { n: 'Mercury', r: 105, size: 7,  c: '#b9b2a8', yr: 88,    km: 58,   zoom: 5.0, t: 'The smallest planet and the closest to the Sun. It races round in just 88 Earth days.' },
    { n: 'Venus',   r: 165, size: 13, c: '#e8c27a', yr: 225,   km: 108,  zoom: 4.2, t: 'Wrapped in thick cloud, and the hottest planet. It spins backwards compared with most.' },
    { n: 'Earth',   r: 235, size: 14, c: '#4aa3ff', yr: 365,   km: 150,  zoom: 4.2, t: 'Our home. One trip round the Sun is the year we count by.' },
    { n: 'Mars',    r: 305, size: 10, c: '#e2573a', yr: 687,   km: 228,  zoom: 4.6, t: 'The red planet. Its year is almost two of ours.' },
    { n: 'Jupiter', r: 420, size: 30, c: '#d9a066', yr: 4333,  km: 778,  zoom: 2.6, t: 'The giant of the family. It takes nearly twelve Earth years to circle the Sun once.' },
    { n: 'Saturn',  r: 520, size: 25, c: '#ead7a0', yr: 10759, km: 1434, zoom: 2.8, t: 'Famous for its rings. A single Saturn year lasts about 29.5 Earth years.', ring: true }
  ];
  var FLAT = 0.58;                                         // orbit squash: a tilted view of the orbital plane
  var $ = function (id) { return document.getElementById(id); };
  var cam = $('cam'), orbitsG = $('orbits'), planetsG = $('planets'), dock = $('dock'), space = $('space');
  var pk = $('pk'), pn = $('pn'), pd = $('pd'), stats = $('stats'), playB = $('play'), speed = $('speed'), rateEl = $('rate'), clock = $('clock');

  function el(tag, attrs, parent) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; }

  P.forEach(function (p, i) {
    p.phase = i * 1.7;
    el('ellipse', { cx: 0, cy: 0, rx: p.r, ry: p.r * FLAT, fill: 'none', stroke: 'rgba(255,255,255,.14)', 'stroke-width': 1, 'vector-effect': 'non-scaling-stroke' }, orbitsG);
    var g = el('g', {}, planetsG);
    p.g = g;
    if (p.ring) el('ellipse', { rx: p.size * 1.9, ry: p.size * 0.55, fill: 'none', stroke: 'rgba(234,215,160,.8)', 'stroke-width': 4, transform: 'rotate(-18)' }, g);
    p.body = el('circle', { r: p.size, fill: p.c }, g);
    el('circle', { r: p.size, fill: 'url(#shade)', opacity: 0 }, g);
    p.hit = el('circle', { r: Math.max(p.size + 14, 22), fill: 'transparent', class: 'hit', tabindex: 0, role: 'button', 'aria-label': 'Follow ' + p.n }, g);
    p.label = el('text', { 'text-anchor': 'middle', y: -(p.size + 10), 'font-size': 13 }, g);
    p.label.textContent = p.n;
    p.hit.addEventListener('click', function () { focus(i); });
    p.hit.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); focus(i); } });
    var b = document.createElement('button'); b.textContent = p.n; b.dataset.i = i; dock.appendChild(b);
  });
  dock.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) focus(+b.dataset.i); });

  var T = 0, running = true, target = -1, view = { x: 0, y: 0, s: 1 }, last = performance.now();
  var fmt = function (n) { return Math.round(n).toLocaleString('en-US'); };

  function focus(i) {
    target = i;
    [].forEach.call(dock.children, function (b) { b.classList.toggle('on', +b.dataset.i === i); });
    if (i < 0) { pk.textContent = 'Overview'; pn.textContent = 'Six worlds, one star'; pd.textContent = 'Choose a planet to follow it around the Sun. Year lengths are real, so the inner planets lap the outer ones.'; stats.innerHTML = ''; return; }
    var p = P[i];
    pk.textContent = 'Planet ' + (i + 1) + ' of 6'; pn.textContent = p.n; pd.textContent = p.t;
    stats.innerHTML = '<div><dt>Year</dt><dd>' + fmt(p.yr) + ' days</dd></div><div><dt>From the Sun</dt><dd>' + fmt(p.km) + ' million km</dd></div>';
  }

  function rate() { return Math.pow(10, +speed.value); }       // Earth days per real second
  function showRate() { var r = rate(); rateEl.textContent = (r < 10 ? r.toFixed(1) : Math.round(r)) + ' days/s'; }
  speed.addEventListener('input', showRate); showRate();
  playB.addEventListener('click', function () { running = !running; playB.setAttribute('aria-pressed', String(running)); playB.textContent = running ? 'Pause' : 'Play'; });
  window.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') focus(Math.min(P.length - 1, target + 1));
    if (e.key === 'ArrowLeft') focus(Math.max(-1, target - 1));
    if (e.key === 'Escape') focus(-1);
    if (e.key === ' ' && e.target === document.body) { e.preventDefault(); playB.click(); }
  });

  function frame(now) {
    var dt = Math.min(0.1, (now - last) / 1000); last = now;
    if (running && !RM) T += dt * rate();
    P.forEach(function (p) {
      var a = p.phase + 2 * Math.PI * T / p.yr;
      p.x = Math.cos(a) * p.r; p.y = Math.sin(a) * p.r * FLAT;
      p.g.setAttribute('transform', 'translate(' + p.x.toFixed(1) + ' ' + p.y.toFixed(1) + ')');
    });
    var tx = 0, ty = 0, ts = 1;
    if (target >= 0) { tx = P[target].x; ty = P[target].y; ts = P[target].zoom; }
    var k = RM ? 1 : 0.07;
    view.x += (tx - view.x) * k; view.y += (ty - view.y) * k; view.s += (ts - view.s) * k;
    cam.setAttribute('transform', 'translate(500 500) scale(' + view.s.toFixed(3) + ') translate(' + (-view.x).toFixed(1) + ' ' + (-view.y).toFixed(1) + ')');
    P.forEach(function (p) { p.label.setAttribute('font-size', (13 / view.s * (target === P.indexOf(p) ? 1.25 : 1)).toFixed(1)); p.label.setAttribute('y', -(p.size + 10 / view.s)); });
    clock.textContent = 'Day ' + fmt(T);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  focus(-1);
})();
