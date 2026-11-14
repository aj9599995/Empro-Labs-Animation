/* Parsec CLI: a terminal that types itself. Headline decodes from random glyphs, boot lines stream in,
   and the prompt answers real commands (help, features, deploy, pricing, theme, clear). Timer-driven, no frames needed. */
(function () {
  'use strict';

  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var out = document.getElementById('out'), screen = document.getElementById('screen');
  var hl = document.getElementById('hl'), form = document.getElementById('form'), cmd = document.getElementById('cmd');
  var caret = document.querySelector('.caret');
  var busy = false, hist = [], hi = 0;
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, RM ? 0 : ms); }); };
  var scroll = function () { screen.scrollTop = screen.scrollHeight; };

  /* headline: every letter cycles through random glyphs, then locks in left to right */
  function decode(el, text) {
    var glyphs = '!<>-_\\/[]{}=+*^?#01', start = performance.now(), per = 38, dur = 600;
    return new Promise(function (resolve) {
      (function tick() {
        var t = performance.now() - start, s = '';
        for (var i = 0; i < text.length; i++) {
          var lock = i * per + dur * 0.4;
          s += text[i] === ' ' || t > lock + dur * 0.6 ? text[i] : glyphs[Math.random() * glyphs.length | 0];
        }
        el.textContent = s;
        if (t < text.length * per + dur) setTimeout(tick, 32); else { el.textContent = text; resolve(); }
      })();
    });
  }

  function line(text, cls) {
    var p = document.createElement('p');
    if (cls) p.className = cls;
    p.textContent = text;
    out.appendChild(p); scroll();
    return p;
  }

  /* type one line character by character */
  async function type(text, cls, speed) {
    var p = line('', cls);
    if (RM) { p.textContent = text; return; }
    for (var i = 0; i < text.length; i++) { p.textContent += text[i]; if (i % 3 === 0) scroll(); await sleep(speed || 14); }
  }

  async function stream(lines, gap) {
    for (var i = 0; i < lines.length; i++) { line(lines[i][0], lines[i][1]); await sleep(gap || 70); }
  }

  async function progress(label) {
    var p = line('', 'bar2'), n = 24;
    for (var i = 0; i <= n; i++) {
      p.textContent = label + ' [' + '█'.repeat(i) + '░'.repeat(n - i) + '] ' + Math.round(i / n * 100) + '%';
      await sleep(45);
    }
    scroll();
  }

  var COMMANDS = {
    help: async function () {
      await stream([['Commands:', 'hot'], ['  features   what Parsec does', 'dim'], ['  deploy     run a pretend deploy', 'dim'], ['  pricing    what it costs', 'dim'], ['  theme      switch amber / green', 'dim'], ['  clear      wipe the screen', 'dim']]);
    },
    features: async function () {
      await stream([['One command, everywhere:', 'hot'], ['  ✓ Preview URL for every branch', 'ok'], ['  ✓ Rollback in one keystroke', 'ok'], ['  ✓ Secrets that never touch your shell history', 'ok'], ['  ✓ Logs that follow you across machines', 'ok']]);
    },
    deploy: async function () {
      await stream([['Resolving project…', 'dim'], ['Building 214 modules…', 'dim']], 260);
      await progress('Uploading');
      await stream([['✓ Live at https://example.parsec.app', 'ok'], ['  Deployed in 3.2s. (Pretend. This is a concept page.)', 'dim']]);
    },
    pricing: async function () {
      await stream([['Hobby   $0   unlimited previews, 1 teammate', ''], ['Team    $12  per seat, audit log, SSO', ''], ['Scale   ask  dedicated build pool', ''], ['No credit card for Hobby.', 'dim']]);
    },
    theme: async function () {
      document.body.classList.toggle('green');
      line('Theme: ' + (document.body.classList.contains('green') ? 'phosphor green' : 'amber'), 'ok');
    },
    clear: async function () { out.textContent = ''; }
  };

  async function run(raw) {
    var c = raw.trim().toLowerCase();
    if (!c) return;
    hist.push(c); hi = hist.length;
    busy = true;
    var p = line(raw, 'cmd');
    if (COMMANDS[c]) await COMMANDS[c]();
    else { await stream([['parsec: command not found: ' + c, 'hot'], ['Type "help" to see what exists.', 'dim']]); }
    busy = false; scroll(); cmd.focus();
  }

  function placeCaret() {
    var w = parseFloat(getComputedStyle(cmd).fontSize) * 0.6;
    caret.style.left = (cmd.offsetLeft + Math.min(cmd.value.length, 200) * w) + 'px';
  }

  form.addEventListener('submit', function (e) { e.preventDefault(); if (busy) return; var v = cmd.value; cmd.value = ''; placeCaret(); run(v); });
  cmd.addEventListener('input', placeCaret);
  cmd.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowUp' && hist.length) { hi = Math.max(0, hi - 1); cmd.value = hist[hi]; e.preventDefault(); placeCaret(); }
    if (e.key === 'ArrowDown') { hi = Math.min(hist.length, hi + 1); cmd.value = hist[hi] || ''; e.preventDefault(); placeCaret(); }
  });
  document.querySelector('.keys').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b || busy) return;
    run(b.dataset.c);
  });
  screen.addEventListener('click', function () { cmd.focus(); });

  async function boot() {
    busy = true;
    await decode(hl, 'Ship faster from the command line.');
    await type('parsec init', 'cmd', 40);
    await stream([['✓ Linked to your repository', 'ok'], ['✓ Detected framework: anything', 'ok'], ['✓ Ready. Type a command below, or tap a button.', 'dim']], 220);
    busy = false; placeCaret(); cmd.focus({ preventScroll: true });
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(boot); else boot();
})();
