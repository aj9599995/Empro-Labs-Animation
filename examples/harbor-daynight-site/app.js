/* Gull Cove Inn: one number (the time of day) drives the whole scene. Colour keyframes are interpolated around the
   clock for sky, sea and hills; the sun and moon ride an arc; stars, lighthouse beam and window lights fade in with
   a "night" factor. Waves, clouds, the boat and the beam loop on CSS keyframes underneath. */
(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };
  var scene = $('scene'), slider = $('t'), play = $('play'), clock = $('clock'), phase = $('phase'), lead = $('lead');
  var sunG = $('sunG'), moonG = $('moonG'), sun = $('sun'), refl = $('refl'), beamG = $('beamG');
  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* keyframes by hour: sky top, sky bottom, sea top, sea bottom, hills */
  var K = [
    [0,  '#050816', '#14204a', '#0b1a33', '#050c1b', '#101a2c'],
    [5,  '#2a2f6b', '#f08a6a', '#31406b', '#1a2447', '#3a4560'],
    [7,  '#5b9bd6', '#f6c98b', '#3b7fa8', '#1d5c82', '#78947e'],
    [12, '#3a8ee0', '#a9d8f5', '#2c7fb3', '#14557f', '#6c8f7b'],
    [17, '#4a79c4', '#f7b567', '#2c6a98', '#17496d', '#6a8571'],
    [19, '#3a2a6b', '#f16f5c', '#2a3463', '#151c3d', '#3d4560'],
    [21, '#0b1030', '#26306a', '#0f1d3b', '#07101f', '#141d30'],
    [24, '#050816', '#14204a', '#0b1a33', '#050c1b', '#101a2c']
  ].map(function (r) { return [r[0]].concat(r.slice(1).map(hex)); });
  var NIGHT = [[0, 1], [5, 0.95], [7, 0], [17, 0], [19, 0.6], [21, 1], [24, 1]];

  function hex(h) { return [1, 3, 5].map(function (i) { return parseInt(h.substr(i, 2), 16); }); }
  function rgb(c) { return 'rgb(' + c.map(Math.round).join(',') + ')'; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function mixC(a, b, t) { return a.map(function (v, i) { return lerp(v, b[i], t); }); }
  function seg(table, h) {
    for (var i = 0; i < table.length - 1; i++) if (h >= table[i][0] && h <= table[i + 1][0]) return [i, (h - table[i][0]) / (table[i + 1][0] - table[i][0])];
    return [table.length - 2, 1];
  }
  function colour(col, h) { var s = seg(K, h); return mixC(K[s[0]][col], K[s[0] + 1][col], s[1]); }
  function night(h) { var s = seg(NIGHT, h); return lerp(NIGHT[s[0]][1], NIGHT[s[0] + 1][1], s[1]); }
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };

  /* stars: fixed positions, fade with the night factor */
  var stars = $('stars'), starEls = [];
  for (var i = 0; i < 70; i++) {
    var c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', (Math.random() * 1200).toFixed(0)); c.setAttribute('cy', (Math.random() * 300).toFixed(0));
    c.setAttribute('r', (0.6 + Math.random() * 1.5).toFixed(1)); c.setAttribute('fill', '#fff');
    if (i % 3 === 0) { c.setAttribute('class', 'twinkle'); c.style.animationDelay = (-Math.random() * 3).toFixed(1) + 's'; }
    stars.appendChild(c); starEls.push(c);
  }

  var PHASES = [[0, 'Night'], [5, 'Dawn'], [7, 'Morning'], [11, 'Midday'], [15, 'Afternoon'], [17, 'Golden hour'], [19, 'Dusk'], [21, 'Night']];
  var LINES = {
    'Night': 'The lighthouse sweeps the cove. Every window upstairs is lit.',
    'Dawn': 'First light on the water. Coffee is on in the kitchen.',
    'Morning': 'Breakfast on the terrace, with the fishing boats already out.',
    'Midday': 'Sun straight overhead. The harbour is at its brightest.',
    'Afternoon': 'The sea has gone deep blue. The boat drifts home.',
    'Golden hour': 'Everything turns amber. The best table is by the window.',
    'Dusk': 'The sky burns out and the beam begins to turn.'
  };

  function set(min) {
    var h = min / 60, n = night(h);
    var sky1 = colour(1, h), sky2 = colour(2, h), sea1 = colour(3, h), sea2 = colour(4, h), hill = colour(5, h);
    var st = scene.style;
    st.setProperty('--sky1', rgb(sky1)); st.setProperty('--sky2', rgb(sky2));
    st.setProperty('--sea1', rgb(sea1)); st.setProperty('--sea2', rgb(sea2)); st.setProperty('--hill', rgb(hill));
    st.setProperty('--cloud', rgb(mixC([255, 255, 255], [60, 68, 100], n * 0.85)));
    st.setProperty('--wave', 'rgba(255,255,255,' + (0.35 - n * 0.2).toFixed(2) + ')');
    st.setProperty('--rock', rgb(mixC([106, 100, 88], [32, 36, 50], n)));
    var lit = clamp((n - 0.25) / 0.5, 0, 1);
    st.setProperty('--wall', rgb(mixC([239, 226, 200], [58, 62, 86], n)));
    st.setProperty('--lamp', rgb(mixC([90, 95, 117], [255, 242, 176], lit)));
    scene.querySelectorAll('.win rect, .winc').forEach(function (w) { w.style.fill = rgb(mixC([150, 180, 205], [255, 211, 107], lit)); });
    starEls.forEach(function (s) { s.style.opacity = clamp((n - 0.35) / 0.55, 0, 1).toFixed(2); });
    beamG.style.opacity = clamp((n - 0.2) / 0.5, 0, 1).toFixed(2);

    /* sun arc 05:30 to 18:30, moon arc 17:30 to 06:30 (next day) */
    var ps = (h - 5.5) / 13, hm = h < 12 ? h + 24 : h, pm = (hm - 17.5) / 13;
    var visS = ps >= 0 && ps <= 1, visM = pm >= 0 && pm <= 1;
    sunG.style.opacity = visS ? 1 : 0; moonG.style.opacity = visM ? 1 : 0;
    if (visS) {
      var x = 100 + 1000 * ps, y = 400 - 330 * Math.sin(Math.PI * ps), low = 1 - Math.sin(Math.PI * ps);
      sunG.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')');
      sun.setAttribute('fill', rgb(mixC([255, 212, 94], [255, 110, 60], low)));
      refl.setAttribute('transform', 'translate(' + x.toFixed(1) + ' 520)');
      refl.setAttribute('opacity', (0.25 * Math.sin(Math.PI * ps)).toFixed(2));
    } else {
      sunG.setAttribute('transform', 'translate(-300 -300)');
      refl.setAttribute('opacity', 0);
    }
    if (visM) {
      var xm = 100 + 1000 * pm, ym = 400 - 330 * Math.sin(Math.PI * pm);
      moonG.setAttribute('transform', 'translate(' + xm.toFixed(1) + ' ' + ym.toFixed(1) + ')');
      if (!visS) {
        refl.setAttribute('transform', 'translate(' + xm.toFixed(1) + ' 520)');
        refl.setAttribute('opacity', (0.12 * Math.sin(Math.PI * pm)).toFixed(2));
      }
    } else moonG.setAttribute('transform', 'translate(-300 -300)');

    var hh = Math.floor(min / 60), mm = Math.floor(min % 60);
    clock.textContent = ('0' + hh).slice(-2) + ':' + ('0' + mm).slice(-2);
    var name = 'Night';
    PHASES.forEach(function (p) { if (h >= p[0]) name = p[1]; });   // the last phase that has started
    phase.textContent = name; lead.textContent = LINES[name] || '';
  }

  slider.addEventListener('input', function () { stop(); set(+slider.value); });

  var timer = 0;
  function stop() { if (timer) { clearInterval(timer); timer = 0; play.setAttribute('aria-pressed', 'false'); play.textContent = 'Play the day'; } }
  play.addEventListener('click', function () {
    if (timer) return stop();
    play.setAttribute('aria-pressed', 'true'); play.textContent = 'Pause';
    timer = setInterval(function () {      // a full day in about 30 seconds
      var v = (+slider.value + 5) % 1440;
      slider.value = v; set(v);
    }, 100);
  });

  set(+slider.value);
})();
