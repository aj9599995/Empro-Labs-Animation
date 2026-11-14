/* Placeholder Brand hero: four layers, one shop.
 * Hover or focus a layer to fan the stack, recolour it, and swap the headline phrase.
 * Click a layer (or tap it twice on touch) to jump to its section.
 * Copy for each layer is read from the service cards in index.html, so text lives in one place.
 */
(function () {
  'use strict';

  var RM = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;
  var EASE = 'cubic-bezier(.22,.8,.2,1)';
  var GAP = 34;   // resting spacing between layers, px
  var GZ = 62;    // spacing when fanned, px
  var DX = 66;    // sideways step when fanned, px

  var hero = document.querySelector('.hero');
  var scene = document.getElementById('scene');
  var stack = document.getElementById('stack');
  var glow = document.getElementById('glow');
  var snap = document.getElementById('snap');
  var word = document.getElementById('word');
  var meas = document.getElementById('meas');
  var bar = document.getElementById('bar');
  var ttl = document.getElementById('ttl');
  var dsc = document.getElementById('dsc');
  var chipList = document.getElementById('chips');
  var layers = [].slice.call(stack.querySelectorAll('.layer'));
  var legend = [].slice.call(document.querySelectorAll('.legend li'));
  var copyBlocks = [].slice.call(document.querySelectorAll('.hero__copy > *'));

  var defaults = { word: word.textContent, ttl: ttl.textContent, dsc: dsc.textContent };

  // Each layer links to a service card; read its copy once.
  var svc = layers.map(function (el) {
    var card = document.getElementById(el.getAttribute('href').slice(1));
    return {
      word: card.getAttribute('data-word'),
      title: card.querySelector('.svc__title').textContent,
      desc: card.querySelector('.svc__desc').textContent,
      chips: [].map.call(card.querySelectorAll('li'), function (li) { return li.textContent; })
    };
  });

  var hov = -1;          // index of the layer being previewed, or -1
  var busy = false;      // true while the intro runs
  var wTok = 0;          // token that cancels stale word-swap timers
  var curWord = defaults.word;
  var SS = 1;            // stack scale, set from the scene size
  var TOUCH = false;
  var barScale = 1;      // underline scale, set from the measured phrase
  var tx = 0, ty = 0;    // pointer tilt target, -1..1
  var rx = 0, rz = 0;    // eased tilt actually applied
  var t0 = performance.now();

  function baseZ(i) {
    return (1.5 - i) * GAP;
  }

  // Rest: one tidy stack. Preview: the stack opens into a staircase so every layer keeps a clear edge.
  // The staircase is centred on the stack (mid), so it opens around the middle of the scene, not off to one side.
  var MID = (1.5 * DX) / Math.SQRT2;

  function place() {
    layers.forEach(function (el, i) {
      var z = baseZ(i), a = 0, delay = 0;
      if (hov >= 0) {
        z = (1.5 - i) * GZ + (i === hov ? 14 : 0);
        a = ((3 - i) * DX) / Math.SQRT2 - MID;
        delay = (3 - i) * 0.035;
      }
      el.style.transition = 'transform .75s ' + EASE + ' ' + delay + 's';
      el.style.transform = 'translate3d(' + a.toFixed(1) + 'px,' + a.toFixed(1) + 'px,' + z.toFixed(1) + 'px)';
    });
  }

  // The bar spans the copy column and scales (transform only, no layout work) to the phrase width,
  // so it always matches the word. The hidden twin measures the phrase in the same font.
  function setBar(text) {
    meas.textContent = text;
    var phrase = meas.getBoundingClientRect().width;
    var column = bar.parentNode.clientWidth || 1;
    barScale = Math.min(1, phrase / column);
    bar.style.transform = 'scaleX(' + barScale.toFixed(4) + ')';
  }

  // Blur-slide swap: fade out, change the text while invisible, then rise back in.
  function setWord(text) {
    if (text === curWord) return;
    curWord = text;
    var tok = ++wTok;
    setBar(text);
    if (RM) {
      word.textContent = text;
      return;
    }
    word.style.transition = 'opacity .22s ease, transform .22s ease, filter .22s ease';
    word.style.opacity = '0';
    word.style.transform = 'translateY(-10px)';
    word.style.filter = 'blur(6px)';
    setTimeout(function () {
      if (tok !== wTok) return;               // a newer swap has started
      word.textContent = text;
      word.style.transition = 'none';
      word.style.transform = 'translateY(10px)';
      void word.offsetWidth;                  // commit the start position before animating back
      word.style.transition = 'opacity .35s ease, transform .45s ' + EASE + ', filter .35s ease';
      word.style.opacity = '1';
      word.style.transform = 'translateY(0)';
      word.style.filter = 'blur(0px)';
    }, 220);
  }

  function renderChips(list) {
    chipList.textContent = '';
    list.forEach(function (label, k) {
      var li = document.createElement('li');
      li.textContent = label;
      li.style.setProperty('--i', k);
      chipList.appendChild(li);
    });
  }

  function showCopy(i) {
    var s = svc[i];
    ttl.textContent = s.title;
    dsc.textContent = s.desc;
    renderChips(s.chips);
    setWord(s.word);
  }

  function resetCopy() {
    ttl.textContent = defaults.ttl;
    dsc.textContent = defaults.dsc;
    renderChips([]);
    setWord(defaults.word);
  }

  function markActive(i) {
    layers.forEach(function (el, j) { el.classList.toggle('is-on', j === i); });
    legend.forEach(function (li, j) { li.classList.toggle('is-on', j === i); });
    glow.classList.toggle('is-on', i >= 0);
  }

  function preview(i) {
    if (busy || hov === i) return;
    hov = i;
    markActive(i);
    place();
    showCopy(i);
  }

  function unpreview() {
    if (busy || hov < 0) return;
    hov = -1;
    markActive(-1);
    place();
    resetCopy();
  }

  // Intro: layers drop in from above, bottom first, so the stack builds up floor by floor.
  function intro() {
    if (RM || !layers[0].animate) {
      hero.classList.add('is-ready');
      return;
    }
    busy = true;
    var anims = [], timers = [], done = false;
    var skipEvents = ['pointerdown', 'keydown', 'wheel', 'touchstart'];

    function strike() {
      snap.animate(
        [{ transform: 'scaleX(0)', opacity: 0.9 }, { transform: 'scaleX(1)', opacity: 0 }],
        { duration: 700, easing: EASE }
      );
      scene.animate(
        [{ transform: 'translateY(0)' }, { transform: 'translateY(5px)' }, { transform: 'translateY(0)' }],
        { duration: 260, easing: 'ease-out' }
      );
    }

    function finish() {
      if (done) return;
      done = true;
      busy = false;
      skipEvents.forEach(function (ev) { window.removeEventListener(ev, skip, true); });
      hero.classList.add('is-ready');
      place();
    }

    function skip() {
      timers.forEach(clearTimeout);
      anims.forEach(function (a) { try { a.finish(); } catch (e) { /* already finished */ } });
      finish();
    }

    var t = 260;
    [3, 2, 1, 0].forEach(function (i) {
      var z = baseZ(i);
      anims.push(layers[i].animate(
        [
          { transform: 'translate3d(0,0,' + (z + 360) + 'px)', opacity: 0 },
          { transform: 'translate3d(0,0,' + (z - 6) + 'px)', opacity: 1, offset: 0.72, easing: 'cubic-bezier(.55,0,1,.45)' },
          { transform: 'translate3d(0,0,' + (z + 9) + 'px)', offset: 0.86, easing: 'cubic-bezier(.2,.8,.3,1)' },
          { transform: 'translate3d(0,0,' + z + 'px)' }
        ],
        { duration: 980, delay: t, fill: 'backwards' }
      ));
      timers.push(setTimeout(strike, t + 700));
      t += 300;
    });

    copyBlocks.forEach(function (el, k) {
      var isBar = el === bar;
      var frames = isBar
        ? [{ transform: 'scaleX(0)' }, { transform: 'scaleX(' + barScale.toFixed(4) + ')' }]   // draws out to the phrase width
        : [
            { opacity: 0, transform: 'translateY(14px)', filter: 'blur(6px)' },
            { opacity: 1, transform: 'none', filter: 'blur(0px)' }
          ];
      anims.push(el.animate(frames, { duration: isBar ? 720 : 700, delay: 1250 + k * 110, easing: EASE, fill: 'backwards' }));
    });

    timers.push(setTimeout(finish, 3200));
    skipEvents.forEach(function (ev) { window.addEventListener(ev, skip, { capture: true, passive: true }); });
  }

  function paintStack() {
    stack.style.transform =
      'scale3d(' + SS + ',' + SS + ',' + SS + ') rotateX(' + (58 + rx).toFixed(3) + 'deg) rotateZ(' + (-45 + rz).toFixed(3) + 'deg)';
  }

  // Idle sway plus a slow ease toward the pointer.
  function loop(now) {
    var idle = busy ? 0 : Math.sin((now - t0) / 3200) * 1.8;
    var trz = busy ? 0 : tx * 8 + idle;
    var trx = busy ? 0 : ty * -5;
    rz += (trz - rz) * 0.06;
    rx += (trx - rx) * 0.06;
    paintStack();
    requestAnimationFrame(loop);
  }

  function fit() {
    var r = scene.getBoundingClientRect();
    SS = Math.max(0.6, Math.min(1.25, Math.min(r.width / 500, r.height / 400)));
    if (RM) paintStack();
  }

  // ---------- Events ----------

  document.addEventListener('pointerdown', function (e) {
    TOUCH = e.pointerType === 'touch' || e.pointerType === 'pen';
  }, true);

  layers.forEach(function (el, i) {
    el.addEventListener('pointerenter', function (e) {
      if (e.pointerType === 'touch' || TOUCH) return;
      preview(i);
    });
    el.addEventListener('focus', function () {
      if (!TOUCH) preview(i);
    });
    el.addEventListener('blur', function () {
      if (!TOUCH) unpreview();
    });
    el.addEventListener('click', function (e) {
      if (!TOUCH) return;          // mouse click follows the link
      if (hov === i) return;       // second tap follows the link
      e.preventDefault();          // first tap previews
      preview(i);
    });
  });

  // Keep the preview while the pointer is near a layer; close it when the pointer leaves that zone.
  document.addEventListener('pointermove', function (e) {
    if (TOUCH || hov < 0 || busy) return;
    var x = e.clientX, y = e.clientY, near = false;
    layers.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (x > r.left - 24 && x < r.right + 24 && y > r.top - 24 && y < r.bottom + 24) near = true;
    });
    if (!near) unpreview();
  });

  hero.addEventListener('pointerleave', function () {
    if (!TOUCH) unpreview();
  });

  document.addEventListener('click', function (e) {
    if (TOUCH && hov >= 0 && !e.target.closest('.layer')) unpreview();
  });

  scene.addEventListener('pointermove', function (e) {
    var r = scene.getBoundingClientRect();
    tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
  });

  scene.addEventListener('pointerleave', function () {
    tx = 0;
    ty = 0;
  });

  window.addEventListener('resize', fit);

  // ---------- Start ----------

  fit();
  place();
  setBar(defaults.word);
  if (RM) {
    paintStack();
  } else {
    requestAnimationFrame(loop);
  }
  intro();

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      setBar(curWord);   // re-measure once Archivo has loaded
      fit();
    });
  }
})();
