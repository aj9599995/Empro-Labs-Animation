/* Hatchling Cards: pointer-driven 3D tilt. Over a card, the pointer's position inside it sets rotateX/rotateY, a glare
   hotspot, the rainbow foil's background offset, and parallax shifts for the back, middle and front art layers.
   Leaving springs the card flat again. Keyboard focus gives a gentle tilt demo so it works without a mouse. */
(function () {
  'use strict';

  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DRAGONS = [
    { n: 'Emberling', hp: 60, el: 'Fire', c1: '#ffb36b', c2: '#ff5e3a', glow: '#ff8a4a', sky1: '#ffd6a0', sky2: '#ff9a7a', sun: '#fff1b0', hill: '#c8553d', b1: '#ff9a4a', b2: '#d8441f', horn: '#fff1b0', wing: '#ffcf70', front: '#7a2a1c', a: ['Cinder Hop', 20], b: ['Flare Burst', 40], t: 'Hatched in a campfire and never quite stopped glowing.' },
    { n: 'Tidepip', hp: 55, el: 'Water', c1: '#8be0ff', c2: '#3a7bff', glow: '#5fb4ff', sky1: '#bdeeff', sky2: '#6fb2ff', sun: '#ffffff', hill: '#2f6fd8', b1: '#6fe0ff', b2: '#2a86e0', horn: '#e8fbff', wing: '#a8e8ff', front: '#1d4a9a', a: ['Splash Nip', 20], b: ['Wave Crest', 35], t: 'Surfs on the tide and sneezes bubbles when it is happy.' },
    { n: 'Mossback', hp: 70, el: 'Leaf', c1: '#b6f08a', c2: '#2fa05a', glow: '#6fe08a', sky1: '#e4ffc2', sky2: '#9be8a0', sun: '#fffbc2', hill: '#2f8f50', b1: '#9ae26a', b2: '#2d9a4e', horn: '#f6ffd8', wing: '#c8f59a', front: '#1d6a38', a: ['Vine Snap', 25], b: ['Spore Cloud', 40], t: 'Sleeps under ferns and wakes when it rains.' },
    { n: 'Zapwing', hp: 50, el: 'Spark', c1: '#fff08a', c2: '#ffb800', glow: '#ffd54a', sky1: '#d9c8ff', sky2: '#8a6cff', sun: '#fff7b0', hill: '#5a3fc0', b1: '#fff07a', b2: '#f0a800', horn: '#ffffff', wing: '#ffe680', front: '#3a2890', a: ['Static Peck', 15], b: ['Thunder Dive', 45], t: 'So fast it arrives before its own shadow.' }
  ];
  var host = document.getElementById('cards');

  DRAGONS.forEach(function (d, i) {
    var slot = document.createElement('div'); slot.className = 'slot';
    var card = document.createElement('button');
    card.className = 'card'; card.type = 'button';
    card.setAttribute('aria-label', d.n + ', ' + d.el + ' dragon, ' + d.hp + ' hit points');
    ['c1', 'c2', 'glow', 'sky1', 'sky2', 'sun', 'hill', 'b1', 'b2', 'horn', 'wing', 'front'].forEach(function (k) { card.style.setProperty('--' + k, d[k]); });
    card.innerHTML =
      '<div class="inner">' +
        '<div class="head">' + d.n + '<span>HP ' + d.hp + '</span></div>' +
        '<div class="art">' +
          '<i class="l-back"><i class="sun"></i><i class="hill"></i></i>' +
          '<i class="l-mid"><i class="wing a"></i><i class="wing b"></i><i class="body"></i><i class="belly"></i><i class="head2"></i><i class="horn a"></i><i class="horn b"></i><i class="eye a"></i><i class="eye b"></i></i>' +
          '<i class="l-front"><i class="blade"></i><i class="blade"></i><i class="blade"></i><i class="blade"></i></i>' +
        '</div>' +
        '<div class="info"><b>' + d.el + ' type</b><div class="atk"><span>' + d.a[0] + '</span><span>' + d.a[1] + '</span></div><div class="atk"><span>' + d.b[0] + '</span><span>' + d.b[1] + '</span></div><p>' + d.t + '</p></div>' +
        '<div class="foil"></div><div class="glare"></div>' +
      '</div>';
    /* the art layers are absolutely placed, so give the nested layer boxes full size */
    slot.appendChild(card); host.appendChild(slot);
    wire(card);
  });

  function aim(card, px, py) {                       // px, py: 0..1 across the card
    var rx = (0.5 - py) * 26, ry = (px - 0.5) * 30;   // up to ~13 and 15 degrees
    card.style.setProperty('--rx', rx.toFixed(2) + 'deg');
    card.style.setProperty('--ry', ry.toFixed(2) + 'deg');
    card.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
    card.style.setProperty('--my', (py * 100).toFixed(1) + '%');
    card.style.setProperty('--hx', (20 + px * 60).toFixed(1) + '%');
    card.style.setProperty('--hy', (20 + py * 60).toFixed(1) + '%');
    card.style.setProperty('--o', '1');
    card.style.setProperty('--lift', '30px');
  }
  function rest(card) {
    card.classList.remove('on');
    ['--rx', '--ry'].forEach(function (k) { card.style.setProperty(k, '0deg'); });
    ['--mx', '--my', '--hx', '--hy'].forEach(function (k) { card.style.setProperty(k, '50%'); });
    card.style.setProperty('--o', '0'); card.style.setProperty('--lift', '0px');
  }

  function wire(card) {
    if (RM) return;
    card.addEventListener('pointerenter', function () { card.classList.add('on'); });
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      aim(card, Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)), Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)));
    });
    card.addEventListener('pointerleave', function () { rest(card); });
    card.addEventListener('pointerup', function (e) { if (e.pointerType === 'touch') rest(card); });
    /* keyboard: focusing sweeps the light across the card once */
    card.addEventListener('focus', function () {
      if (!card.matches(':focus-visible')) return;
      card.classList.add('on');
      var t0 = performance.now();
      (function sweep(now) {
        var p = Math.min(1, (now - t0) / 1400);
        aim(card, 0.15 + 0.7 * p, 0.3 + 0.2 * Math.sin(p * Math.PI * 2));
        if (p < 1) requestAnimationFrame(sweep); else rest(card);
      })(t0);
    });
  }
})();
