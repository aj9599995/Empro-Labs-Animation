/* Harp & Hum: fourteen strings drawn on a canvas, each a damped standing wave. Crossing a string with the pointer
   (or pressing its key) plucks it: the wave rings and fades while Web Audio plays a pentatonic note with a soft
   plucked-string envelope. No samples or libraries; every note is synthesised in the browser. */
(function () {
  'use strict';

  var cv = document.getElementById('c'), ctx = cv.getContext('2d');
  var msg = document.getElementById('msg'), autoBtn = document.getElementById('auto'), muteBtn = document.getElementById('mute');
  var N = 14, SCALE = [0, 2, 4, 7, 9], BASE = 261.63;          // C major pentatonic from middle C
  var KEYS = 'asdfghjklzxcvb', W = 0, H = 0, DPR = 1;
  var strings = [], audio = null, muted = false, last = null, autoTimer = 0, interacted = false;

  for (var i = 0; i < N; i++) {
    var semis = SCALE[i % 5] + 12 * Math.floor(i / 5);
    strings.push({ f: BASE * Math.pow(2, semis / 12), amp: 0, ph: 0, dir: 1, hue: 300 - i * 14, glow: 0, x: 0 });
  }

  function resize() {
    DPR = Math.min(2, window.devicePixelRatio || 1);
    W = innerWidth; H = innerHeight;
    cv.width = W * DPR; cv.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    var pad = Math.max(24, W * 0.06), gap = (W - pad * 2) / (N - 1);
    strings.forEach(function (s, i) { s.x = pad + gap * i; });
  }

  /* ---- sound ---- */
  function ensureAudio() {
    if (audio || muted) return audio;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    audio = new AC();
    var master = audio.createGain(); master.gain.value = 0.5;
    var comp = audio.createDynamicsCompressor();
    master.connect(comp); comp.connect(audio.destination);
    audio.master = master;
    return audio;
  }

  function sound(s, vel) {
    if (muted || !interacted) return;
    var a = ensureAudio(); if (!a) return;
    if (a.state === 'suspended') a.resume();
    var t = a.currentTime, g = a.createGain(), lp = a.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.setValueAtTime(5000, t); lp.frequency.exponentialRampToValueAtTime(700, t + 1.4);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.32 * vel, t + 0.006);     // sharp attack, like a pluck
    g.gain.exponentialRampToValueAtTime(0.0001, t + 2.2);           // long natural decay
    [['triangle', 1, 1], ['sine', 2, 0.35], ['sine', 3, 0.12]].forEach(function (p) {
      var o = a.createOscillator(), og = a.createGain();
      o.type = p[0]; o.frequency.value = s.f * p[1]; og.gain.value = p[2];
      o.connect(og); og.connect(g); o.start(t); o.stop(t + 2.3);
    });
    g.connect(lp); lp.connect(a.master);
  }

  function pluck(i, vel, dir) {
    var s = strings[i];
    s.amp = Math.min(60, 14 + vel * 46); s.dir = dir || 1; s.glow = 1;
    sound(s, Math.min(1, 0.35 + vel * 0.65));
  }

  /* ---- input: crossing a string between two pointer positions plucks it ---- */
  function move(x, y) {
    if (last) {
      var x0 = last.x, x1 = x, lo = Math.min(x0, x1), hi = Math.max(x0, x1);
      var speed = Math.min(1, Math.abs(x1 - x0) / 60);
      strings.forEach(function (s, i) {
        if (s.x > lo && s.x <= hi) {
          if (y > 70 && y < H - 30) pluck(i, speed || 0.3, x1 > x0 ? 1 : -1);
        }
      });
    }
    last = { x: x, y: y };
  }
  cv.addEventListener('pointermove', function (e) { stopAuto(); move(e.clientX, e.clientY); });
  cv.addEventListener('pointerdown', function (e) { interact(); last = { x: e.clientX, y: e.clientY }; });
  cv.addEventListener('pointerleave', function () { last = null; });
  cv.addEventListener('pointerup', function (e) { if (e.pointerType === 'touch') last = null; });
  window.addEventListener('keydown', function (e) {
    var k = KEYS.indexOf(e.key.toLowerCase());
    if (k >= 0 && !e.repeat && !e.metaKey && !e.ctrlKey) { interact(); stopAuto(); pluck(k, 0.7, Math.random() < 0.5 ? 1 : -1); }
  });

  function interact() {
    if (!interacted) { interacted = true; msg.textContent = 'Keep going. Try the keys A S D F G H J K L Z X C V B too.'; }
    var a = ensureAudio(); if (a && a.state === 'suspended') a.resume();
  }

  /* ---- buttons ---- */
  muteBtn.addEventListener('click', function () {
    muted = !muted;
    muteBtn.textContent = muted ? 'Sound off' : 'Sound on';
    muteBtn.setAttribute('aria-pressed', String(muted));
    muteBtn.classList.toggle('on', muted);
    interact();
  });
  function stopAuto() { if (autoTimer) { clearTimeout(autoTimer); autoTimer = 0; autoBtn.classList.remove('on'); autoBtn.textContent = 'Play for me'; } }
  autoBtn.addEventListener('click', function () {
    if (autoTimer) return stopAuto();
    interact(); autoBtn.classList.add('on'); autoBtn.textContent = 'Stop';
    var phrase = [0, 2, 4, 7, 9, 7, 4, 2, 5, 7, 9, 11, 9, 7], n = 0;
    (function next() {
      pluck(phrase[n % phrase.length], 0.6, n % 2 ? 1 : -1); n++;
      autoTimer = setTimeout(next, 260 + (n % 7 === 0 ? 260 : 0));
    })();
  });

  /* ---- drawing ---- */
  function frame() {
    ctx.clearRect(0, 0, W, H);
    var top = 70, bot = H - 30, len = bot - top;
    ctx.lineCap = 'round';
    strings.forEach(function (s) {
      s.ph += 0.55 + s.f / 900; s.amp *= 0.984; s.glow *= 0.965;
      if (s.amp < 0.05) s.amp = 0;
      ctx.beginPath();
      var steps = 40;
      for (var j = 0; j <= steps; j++) {
        var u = j / steps, y = top + u * len;
        var dx = Math.sin(Math.PI * u) * s.amp * Math.sin(s.ph) * s.dir;     // fundamental mode, damped
        dx += Math.sin(2 * Math.PI * u) * s.amp * 0.18 * Math.sin(s.ph * 2.01);
        if (j) ctx.lineTo(s.x + dx, y); else ctx.moveTo(s.x + dx, y);
      }
      var l = 62 + s.glow * 24;
      ctx.strokeStyle = 'hsl(' + s.hue + ',90%,' + l + '%)';
      ctx.lineWidth = 2 + s.glow * 3;
      ctx.shadowColor = 'hsl(' + s.hue + ',100%,65%)';
      ctx.shadowBlur = 4 + s.glow * 26;
      ctx.stroke();
      ctx.shadowBlur = 0;
    });
    requestAnimationFrame(frame);
  }

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(frame);
})();
