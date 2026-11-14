/* Moonrise: split-flap display. Each cell keeps a current character and flips one step at a time through an
   alphabet toward its target, like an airport board, so words clatter into place. Countdown cells flip straight to
   the new digit instead, because a second only lasts a second. */
(function () {
  'use strict';

  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ALPHA = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:.-&';
  var STEP = 80;                                                  // ms per flip

  function Cell(direct) {
    var el = document.createElement('div');
    el.className = 'cell';
    el.innerHTML = '<div class="h up"><span> </span></div><div class="h dn"><span> </span></div>' +
      '<div class="flap ft"><span> </span></div><div class="flap fb"><span> </span></div>';
    this.el = el; this.direct = !!direct; this.cur = ' '; this.target = ' '; this.running = false;
    this.top = el.querySelector('.up span'); this.bot = el.querySelector('.dn span');
    this.ft = el.querySelector('.ft'); this.fb = el.querySelector('.fb');
    this.ftS = this.ft.firstChild; this.fbS = this.fb.firstChild;
  }

  /* one flip from cur to next */
  Cell.prototype.flip = function (next, done) {
    var self = this, old = this.cur;
    this.top.textContent = next; this.bot.textContent = old;
    this.ftS.textContent = old; this.fbS.textContent = next;
    this.cur = next;
    if (RM || !this.ft.animate) { this.bot.textContent = next; return done(); }
    var half = STEP / 2;
    var a1 = this.ft.animate([{ transform: 'rotateX(0deg)' }, { transform: 'rotateX(-90deg)' }], { duration: half, easing: 'ease-in' });
    setTimeout(function () {
      var a2 = self.fb.animate([{ transform: 'rotateX(90deg)' }, { transform: 'rotateX(0deg)' }], { duration: half, easing: 'ease-out' });
      setTimeout(function () {
        // settle explicitly: the old top flap stays folded away, the new bottom half shows through `bot`
        a1.cancel(); a2.cancel();
        self.bot.textContent = next;
        done();
      }, half);
    }, half);
  };

  Cell.prototype.go = function (ch, delay) {
    ch = ALPHA.indexOf(ch) < 0 ? ' ' : ch;
    this.target = ch;
    if (this.running) return;
    var self = this;
    this.running = true;
    setTimeout(function loop() {
      if (self.cur === self.target) { self.running = false; return; }
      var next = self.direct ? self.target : ALPHA[(ALPHA.indexOf(self.cur) + 1) % ALPHA.length];
      self.flip(next, function () { setTimeout(loop, 0); });
    }, delay || 0);
  };

  function makeRow(parent, widths, direct) {
    var cells = [];
    widths.forEach(function (n, gi) {
      var g = document.createElement('div'); g.className = 'board';
      for (var i = 0; i < n; i++) { var c = new Cell(direct); g.appendChild(c.el); cells.push(c); }
      parent.appendChild(g);
    });
    return cells;
  }

  /* ---- lineup board ---- */
  var DAYS = [
    [['18:00', 'AURORA CITY', 'MAIN'], ['19:30', 'THE LOW TIDES', 'BARN'], ['21:00', 'PAPER MOONS', 'MAIN'], ['22:45', 'NIGHT SHIFT', 'TENT']],
    [['14:00', 'MARIGOLD CLUB', 'BARN'], ['16:15', 'SALT & SMOKE', 'TENT'], ['19:00', 'GLASS HARBOUR', 'MAIN'], ['21:30', 'LUNAR DRIVE', 'MAIN']],
    [['13:00', 'SUNDAY CHOIR', 'BARN'], ['15:00', 'OLD GOLD', 'TENT'], ['17:30', 'WILD FERN', 'MAIN'], ['20:00', 'MOONRISE ALL', 'MAIN']]
  ];
  var DAYNAMES = ['Friday', 'Saturday', 'Sunday'];
  var grid = document.getElementById('grid'), live = document.getElementById('live'), tabs = document.getElementById('tabs');
  var rows = DAYS[0].map(function () {
    var r = document.createElement('div'); r.className = 'row'; grid.appendChild(r);
    return makeRow(r, [5, 14, 6], false);
  });

  function pad(s, n) { s = String(s); while (s.length < n) s += ' '; return s.slice(0, n); }
  var day = 0, auto = 0;
  function show(d) {
    day = d;
    DAYS[d].forEach(function (row, ri) {
      var text = pad(row[0], 5) + pad(row[1], 14) + pad(row[2], 6);
      rows[ri].forEach(function (c, i) { c.go(text[i], ri * 140 + i * 22); });
    });
    [].forEach.call(tabs.children, function (b, k) { b.classList.toggle('on', k === d); b.setAttribute('aria-selected', k === d); });
    live.textContent = DAYNAMES[d] + ': ' + DAYS[d].map(function (r) { return r[0] + ' ' + r[1] + ' on the ' + r[2].toLowerCase() + ' stage'; }).join('; ');
  }
  tabs.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    clearInterval(auto); show(+b.dataset.d);
  });
  auto = setInterval(function () { show((day + 1) % 3); }, 11000);

  /* ---- countdown ---- */
  var target = new Date('2027-06-12T21:00:00').getTime();
  var cd = { d: makeRow(document.getElementById('cd-d'), [3], true), h: makeRow(document.getElementById('cd-h'), [2], true),
             m: makeRow(document.getElementById('cd-m'), [2], true), s: makeRow(document.getElementById('cd-s'), [2], true) };
  function tick() {
    var ms = Math.max(0, target - Date.now()), s = Math.floor(ms / 1000);
    var v = { d: Math.floor(s / 86400), h: Math.floor(s % 86400 / 3600), m: Math.floor(s % 3600 / 60), s: s % 60 };
    [['d', 3], ['h', 2], ['m', 2], ['s', 2]].forEach(function (p) {
      var str = ('00' + v[p[0]]).slice(-p[1]);
      cd[p[0]].forEach(function (c, i) { c.go(str[i], 0); });
    });
  }
  tick(); setInterval(tick, 1000);

  show(0);
})();
