/* Listing flip cards. Each card has a front (photo side) and a back (facts). Only one face is
   interactive at a time: the hidden face gets `inert`, so keyboard focus cannot land on it.
   When a flip hides the focused button, focus moves to the matching button on the other face.
   "Show all details" flips every card as a wave, and announces the change politely. */
(function () {
  'use strict';

  var grid = document.getElementById('grid');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.fl-listing'));
  var allButton = document.getElementById('fl-all');
  var status = document.getElementById('fl-status');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var waveTimer = 0;

  function setFlipped(card, on, moveFocus) {
    var front = card.querySelector('.fl-front');
    var back = card.querySelector('.fl-back');
    var focused = document.activeElement;
    card.classList.toggle('is-flipped', on);
    front.inert = on;
    back.inert = !on;

    if (moveFocus && focused && card.contains(focused)) {
      var target = (on ? back : front).querySelector('.fl-flip');
      if (target) target.focus({ preventScroll: true });
    }
  }

  // Start with every card showing its photo side
  cards.forEach(function (card) { setFlipped(card, false, false); });

  // Each card's own buttons flip that card
  cards.forEach(function (card) {
    card.querySelectorAll('.fl-flip').forEach(function (button) {
      button.addEventListener('click', function () {
        setFlipped(card, !card.classList.contains('is-flipped'), true);
      });
    });
  });

  // "Show all details" flips every card in a wave, then announces the new state
  allButton.addEventListener('click', function () {
    var on = allButton.getAttribute('aria-pressed') !== 'true';
    allButton.setAttribute('aria-pressed', String(on));
    allButton.textContent = on ? 'Show all photos' : 'Show all details';
    status.textContent = on ? 'Showing the details for all six homes.' : 'Showing the photos for all six homes.';

    if (!reduce.matches) {
      grid.classList.add('is-wave');
      clearTimeout(waveTimer);
      waveTimer = setTimeout(function () { grid.classList.remove('is-wave'); }, 1400);
    }
    cards.forEach(function (card) { setFlipped(card, on, false); });
  });
})();
