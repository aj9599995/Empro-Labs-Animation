/* Pinned route. The reader's active chapter (the one near the middle of the screen) sets the step.
   The route line draws towards that step, the stop fills, and the caption swaps.
   Without scripts, the page shows chapter 1 and the full route. Reduced motion changes text at once. */
(function () {
  'use strict';

  var STEPS = [
    { title: 'Search and shortlist', text: 'Compare on the same criteria.' },
    { title: 'Viewings', text: 'Note the light, the noise and the access.' },
    { title: 'Offer', text: 'Agree the price and the conditions in writing.' },
    { title: 'Survey and mortgage', text: 'These checks run in parallel, not one after another.' },
    { title: 'Completion', text: 'Keys change hands once the funds have cleared.' }
  ];

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var stage = document.getElementById('ps-stage');
  var chapters = Array.prototype.slice.call(document.querySelectorAll('.ps-chapter'));
  var stops = Array.prototype.slice.call(document.querySelectorAll('.ps-stop'));
  var draw = document.getElementById('ps-draw');
  var caption = document.getElementById('ps-caption');
  var capNum = caption.querySelector('.ps-cap-num');
  var capTitle = caption.querySelector('.ps-cap-title');
  var capText = caption.querySelector('.ps-cap-text');

  var length = draw.getTotalLength();
  draw.style.strokeDasharray = String(length);

  var current = -1;

  function writeCaption(i) {
    var s = STEPS[i];
    capNum.textContent = 'Step ' + (i + 1) + ' of ' + STEPS.length;
    capTitle.textContent = s.title;
    capText.textContent = s.text;
  }

  function setStep(i) {
    if (i === current) return;
    current = i;
    stage.setAttribute('data-step', String(i));
    draw.style.strokeDashoffset = String(length * (1 - i / (STEPS.length - 1)));
    stops.forEach(function (stop, k) { stop.classList.toggle('is-on', k <= i); });
    chapters.forEach(function (c, k) { c.classList.toggle('is-active', k === i); });

    if (reduce.matches) { writeCaption(i); return; }
    caption.classList.add('is-swapping');
    setTimeout(function () {
      writeCaption(i);
      caption.classList.remove('is-swapping');
    }, 260);
  }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setStep(Number(entry.target.getAttribute('data-i')));
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    chapters.forEach(function (c) { io.observe(c); });
  }

  setStep(0);
})();
