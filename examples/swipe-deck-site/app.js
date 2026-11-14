/* Fork or Pass: a swipe deck. The top card follows your finger, tilting with its distance and fading in a FORK or
   PASS stamp; the cards beneath scale up as it leaves. Release past a threshold (or flick fast) and it flies off the
   screen on the Web Animations API; otherwise it springs back. Undo flies the last card back in. */
(function () {
  'use strict';

  var DISHES = [
    { n: 'Charred Corn Ribs', p: 12, d: 'Smoked paprika butter, lime, cotija and a hot honey drizzle.', t: ['Veg', 'Spicy'], a: '#ffd166', b: '#ffe08a', c: '#e0a100', k: '#f08a24' },
    { n: 'Miso Mushroom Ramen', p: 17, d: 'Roasted mushroom broth, soft egg, spring onion and chilli oil.', t: ['Warm', 'Umami'], a: '#ff9f80', b: '#ffd6a8', c: '#d9703a', k: '#7a3b1e' },
    { n: 'Burrata & Peach', p: 15, d: 'Creamy burrata, grilled peach, basil and cracked pepper.', t: ['Veg', 'Fresh'], a: '#ffb3c1', b: '#fff1e6', c: '#f4a98f', k: '#2f9e5b' },
    { n: 'Brown Butter Gnocchi', p: 19, d: 'Pillowy potato gnocchi, sage, brown butter and parmesan.', t: ['Veg', 'Rich'], a: '#bde0fe', b: '#fff0c9', c: '#e8c27a', k: '#6b8f3a' },
    { n: 'Sticky Gochujang Wings', p: 14, d: 'Crisp wings glazed in gochujang, sesame and pickled radish.', t: ['Spicy', 'Share'], a: '#ff8fa3', b: '#e5484d', c: '#8f1d22', k: '#fff' },
    { n: 'Whole Roast Cauliflower', p: 21, d: 'Tahini, pomegranate, dukkah and herbs. Carved at the table.', t: ['Veg', 'Share'], a: '#caffbf', b: '#fff6d6', c: '#e9d08b', k: '#c0392b' },
    { n: 'Lemon Ricotta Pancakes', p: 13, d: 'Fluffy stacks, blueberry compote and whipped honey butter.', t: ['Sweet', 'Brunch'], a: '#a0c4ff', b: '#fff0c4', c: '#e6b86a', k: '#4361ee' },
    { n: 'Salted Caramel Pot', p: 9, d: 'Silky caramel custard, sea salt and a shortbread crumb.', t: ['Sweet', 'Dessert'], a: '#ffd6a5', b: '#f2b36b', c: '#a8611f', k: '#fff' }
  ];
  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (id) { return document.getElementById(id); };
  var deck = $('deck'), end = $('end'), picks = $('picks'), ctrl = $('ctrl'), count = $('count');
  var bPass = $('pass'), bFork = $('fork'), bUndo = $('undo');
  var idx = 0, history = [], busy = false, THRESH = 110;
  var EASE = 'cubic-bezier(.22,.8,.2,1)';

  function cardEl(d) {
    var el = document.createElement('article');
    el.className = 'card';
    el.style.setProperty('--a', d.a); el.style.setProperty('--b', d.b); el.style.setProperty('--c', d.c); el.style.setProperty('--d', d.k);
    el.innerHTML = '<div class="art"><i class="plate"></i><i class="food"></i>' +
      '<i class="dot" style="left:14%;top:16%"></i><i class="dot" style="right:12%;top:26%;width:8%"></i><i class="dot" style="left:20%;bottom:14%;width:9%"></i>' +
      '<span class="stamp yes">FORK</span><span class="stamp no">PASS</span></div>' +
      '<div class="info"><h3>' + d.n + '</h3><p>' + d.d + '</p><div class="tags">' + d.t.map(function (x) { return '<span>' + x + '</span>'; }).join('') + '<b>$' + d.p + '</b></div></div>';
    return el;
  }

  function layout() {
    var cards = [].slice.call(deck.children);
    cards.forEach(function (c) {
      var depth = +c.dataset.depth;
      if (c === dragEl) return;
      c.style.zIndex = 10 - depth;
      c.style.transition = RM ? 'none' : 'transform .45s ' + EASE;
      c.style.transform = 'translateY(' + depth * 14 + 'px) scale(' + (1 - depth * 0.05) + ')';
      c.style.pointerEvents = depth === 0 ? 'auto' : 'none';
      c.setAttribute('aria-hidden', depth === 0 ? 'false' : 'true');
    });
  }

  function render() {
    deck.textContent = '';
    for (var k = 2; k >= 0; k--) {
      var d = DISHES[idx + k];
      if (!d) continue;
      var el = cardEl(d); el.dataset.depth = k; el.dataset.i = idx + k;
      deck.appendChild(el);
    }
    layout();
    var done = idx >= DISHES.length;
    end.hidden = !done; deck.hidden = done; ctrl.hidden = done && false;
    bPass.disabled = bFork.disabled = done; bUndo.disabled = history.length === 0;
    var forked = history.filter(function (h) { return h.dir > 0; }).length;
    count.textContent = done ? '' : (idx + 1) + ' of ' + DISHES.length + ' · ' + forked + ' forked';
    if (done) {
      var f = history.filter(function (h) { return h.dir > 0; });
      picks.innerHTML = f.length ? f.map(function (h) { return '<li>' + DISHES[h.i].n + '<span>$' + DISHES[h.i].p + '</span></li>'; }).join('') : '<li class="empty">You passed on everything. Tough crowd.</li>';
    }
    wire();
  }

  /* ---- dragging ---- */
  var dragEl = null, sx = 0, sy = 0, dx = 0, dy = 0, t0 = 0;
  function wire() {
    var top = deck.querySelector('[data-depth="0"]');
    if (!top) return;
    top.addEventListener('pointerdown', function (e) {
      if (busy) return;
      dragEl = top; sx = e.clientX; sy = e.clientY; dx = dy = 0; t0 = performance.now();
      top.classList.add('drag'); top.style.transition = 'none'; top.setPointerCapture(e.pointerId);
    });
    top.addEventListener('pointermove', function (e) {
      if (dragEl !== top) return;
      dx = e.clientX - sx; dy = e.clientY - sy;
      pose(top, dx, dy);
    });
    var up = function () {
      if (dragEl !== top) return;
      var v = Math.abs(dx) / Math.max(1, performance.now() - t0);        // px per ms
      top.classList.remove('drag');
      if (Math.abs(dx) > THRESH || (v > 0.6 && Math.abs(dx) > 40)) decide(dx > 0 ? 1 : -1);
      else { dragEl = null; spring(top); }
    };
    top.addEventListener('pointerup', up);
    top.addEventListener('pointercancel', up);
  }

  function pose(el, x, y) {
    el.style.transform = 'translate(' + x + 'px,' + y * 0.4 + 'px) rotate(' + (x * 0.07).toFixed(2) + 'deg)';
    var p = Math.min(1, Math.abs(x) / THRESH);
    el.querySelector('.stamp.yes').style.opacity = x > 0 ? p : 0;
    el.querySelector('.stamp.no').style.opacity = x < 0 ? p : 0;
    var next = deck.querySelector('[data-depth="1"]');
    if (next) { next.style.transition = 'none'; next.style.transform = 'translateY(' + (14 - 14 * p) + 'px) scale(' + (0.95 + 0.05 * p) + ')'; }
  }

  function spring(el) {
    el.style.transition = RM ? 'none' : 'transform .5s cubic-bezier(.34,1.56,.64,1)';
    el.style.transform = '';
    el.style.transform = 'translateY(0) scale(1)';
    el.querySelector('.stamp.yes').style.opacity = 0; el.querySelector('.stamp.no').style.opacity = 0;
    layout();
  }

  function decide(dir) {
    if (busy || idx >= DISHES.length) return;
    busy = true;
    var top = deck.querySelector('[data-depth="0"]');
    var i = idx; history.push({ i: i, dir: dir }); idx++;
    var fromX = dragEl === top ? dx : 0, fromY = dragEl === top ? dy * 0.4 : 0;
    dragEl = null;
    top.style.pointerEvents = 'none';
    top.querySelector(dir > 0 ? '.stamp.yes' : '.stamp.no').style.opacity = 1;
    var outX = dir * (innerWidth + 300);
    var finished = false;
    var done = function () { if (finished) return; finished = true; busy = false; render(); };
    if (RM || !top.animate) return done();
    top.animate([
      { transform: 'translate(' + fromX + 'px,' + fromY + 'px) rotate(' + (fromX * 0.07) + 'deg)', opacity: 1 },
      { transform: 'translate(' + outX + 'px,' + (fromY - 60) + 'px) rotate(' + dir * 38 + 'deg)', opacity: 0 }
    ], { duration: 480, easing: 'cubic-bezier(.4,0,.8,.6)', fill: 'forwards' }).onfinish = done;
    setTimeout(done, 620);   // safety net: never leave the deck locked if the finish event is missed
    // the next cards move up while this one leaves
    [].slice.call(deck.children).forEach(function (c) {
      var dpt = +c.dataset.depth; if (dpt === 0) return;
      c.dataset.depth = dpt - 1;
    });
    layout();
    top.style.zIndex = 20;
  }

  function undo() {
    if (busy || !history.length) return;
    var last = history.pop(); idx = last.i; busy = true;
    render();
    var top = deck.querySelector('[data-depth="0"]');
    busy = false;
    if (!RM && top.animate) top.animate([
      { transform: 'translate(' + last.dir * (innerWidth * 0.6) + 'px,-40px) rotate(' + last.dir * 30 + 'deg)', opacity: 0 },
      { transform: 'translate(0,0) rotate(0)', opacity: 1 }
    ], { duration: 460, easing: EASE });
  }

  bFork.addEventListener('click', function () { decide(1); });
  bPass.addEventListener('click', function () { decide(-1); });
  bUndo.addEventListener('click', undo);
  $('again').addEventListener('click', function () { idx = 0; history = []; render(); });
  window.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') decide(1);
    else if (e.key === 'ArrowLeft') decide(-1);
    else if (e.key === 'Backspace' || e.key.toLowerCase() === 'z') undo();
  });

  render();
})();
