/* Salt & Ladle: a 3D page-turn. Each leaf is hinged on the spine (transform-origin: left) and rotates -180deg;
   its two faces hide their backs, so the front shows on the right and the back appears on the left.
   Stacking order is swapped mid-turn so pages never clip through each other. */
(function () {
  'use strict';

  var book = document.getElementById('book');
  var leaves = [].slice.call(book.querySelectorAll('.leaf'));
  var N = leaves.length, flipped = 0, timers = [];
  var prev = document.getElementById('prev'), next = document.getElementById('next'), pos = document.getElementById('pos');
  var LABELS = ['Cover', 'Contents', 'Slow tomato soup', 'Skillet flatbread', 'Lemon olive-oil cake', 'The end'];

  function stack() {
    leaves.forEach(function (l, i) { l.style.zIndex = i < flipped ? i + 1 : N - i; });
  }

  function update() {
    book.classList.toggle('open', flipped > 0 && flipped < N);
    book.classList.toggle('done', flipped === N);
    prev.disabled = flipped === 0;
    next.disabled = flipped === N;
    pos.textContent = LABELS[flipped] + (flipped === 0 ? '' : '');
    leaves.forEach(function (l) { l.setAttribute('aria-hidden', 'false'); });
  }

  function turn(dir) {
    var i = dir > 0 ? flipped : flipped - 1;
    if (i < 0 || i >= N) return;
    var l = leaves[i];
    l.style.zIndex = N + 2;                         // the moving leaf rides on top while it turns
    flipped += dir;
    l.classList.toggle('flipped', dir > 0);
    update();
    var t = setTimeout(stack, 550);                 // settle into its resting layer once it passes the spine
    timers.push(t);
  }

  next.addEventListener('click', function () { turn(1); });
  prev.addEventListener('click', function () { turn(-1); });
  leaves.forEach(function (l, i) {
    l.addEventListener('click', function () { turn(i < flipped ? -1 : 1); });   // click a page to turn it
  });
  window.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') turn(1);
    if (e.key === 'ArrowLeft') turn(-1);
  });

  stack();
  update();
})();
