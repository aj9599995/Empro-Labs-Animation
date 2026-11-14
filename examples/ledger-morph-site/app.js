/* Crumb & Co. Ledger: data morphing. Every chart keeps its current numbers; changing the range tweens them toward the
   new set (eased, ~800ms), so the line bends, bars slide and figures count rather than snapping. Hover reads the line. */
(function () {
  'use strict';

  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DATA = {
    today: { rl: 'Hourly · 7am to 6pm', x: ['7a','8a','9a','10a','11a','12p','1p','2p','3p','4p','5p','6p'],
      line: [120,310,540,420,380,460,610,520,340,280,190,90], kpi: [4260, 312, 13.65], d: ['+8.4%','+5.1%','+3.2%'],
      bars: [86, 64, 52, 41, 33], mix: [38, 31, 17, 14] },
    month: { rl: 'Every 2.5 days · this month', x: ['1','3','6','8','11','13','16','18','21','23','26','29'],
      line: [2100,2400,2250,2800,3100,2900,3300,3600,3400,3900,4200,4000], kpi: [39950, 2870, 13.92], d: ['+12.2%','+9.8%','+2.2%'],
      bars: [740, 612, 498, 405, 331], mix: [34, 33, 19, 14] },
    year: { rl: 'Monthly · last 12 months', x: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      line: [18000,16500,19200,22000,25000,24100,27300,30200,28400,32500,36100,41000], kpi: [320300, 22940, 13.96], d: ['+24.6%','+19.3%','+4.5%'],
      bars: [8120, 6980, 5640, 4710, 3820], mix: [31, 30, 21, 18] }
  };
  var NAMES = ['Sourdough', 'Croissant', 'Cinnamon bun', 'Baguette', 'Cookie'];
  var MIX = [['Bread', '#ff7a59'], ['Pastry', '#10213a'], ['Cakes', '#f5b942'], ['Coffee', '#6aa9ff']];
  var W = 800, H = 300, ease = function (t) { return 1 - Math.pow(1 - t, 3); };

  var $ = function (id) { return document.getElementById(id); };
  var lineEl = $('line'), areaEl = $('area'), cross = $('cross'), dot = $('dot'), tip = $('tip'), chart = $('chart');
  var ylab = $('ylab'), xlab = $('xlab'), gridEl = $('grid'), barsEl = $('bars'), segsEl = $('segs'), legend = $('legend');
  var kEls = [$('k0'), $('k1'), $('k2')], dEls = [$('d0'), $('d1'), $('d2')];

  /* current (displayed) state and the tween between states */
  var cur = { line: new Array(12).fill(0), kpi: [0, 0, 0], bars: [0, 0, 0, 0, 0], mix: [25, 25, 25, 25], max: 1 };
  var range = 'today', raf = 0;

  /* static pieces */
  barsEl.innerHTML = NAMES.map(function (n, i) { return '<div class="bar" tabindex="0" data-i="' + i + '"><span>' + n + '</span><div class="track"><div class="fill"></div></div><span class="v"></span></div>'; }).join('');
  var fills = [].slice.call(barsEl.querySelectorAll('.fill')), vals = [].slice.call(barsEl.querySelectorAll('.v'));
  segsEl.innerHTML = MIX.map(function (m) { return '<circle cx="100" cy="100" r="70" fill="none" stroke="' + m[1] + '" stroke-width="26"/>'; }).join('');
  var segEls = [].slice.call(segsEl.querySelectorAll('circle'));
  legend.innerHTML = MIX.map(function (m) { return '<li><i style="background:' + m[1] + '"></i>' + m[0] + '<b></b></li>'; }).join('');
  var legVals = [].slice.call(legend.querySelectorAll('b'));
  gridEl.innerHTML = [0, 1, 2, 3].map(function (i) { var y = i * H / 3; return '<line x1="0" x2="' + W + '" y1="' + y + '" y2="' + y + '" stroke="#e3e8f0" vector-effect="non-scaling-stroke"/>'; }).join('');

  var money = function (n) { return '$' + Math.round(n).toLocaleString('en-US'); };
  var short = function (n) { return n >= 1000 ? '$' + (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'k' : '$' + Math.round(n); };

  /* smooth path through the points (Catmull-Rom converted to cubic beziers) */
  function path(pts) {
    var d = 'M' + pts[0][0] + ' ' + pts[0][1];
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      d += ' C' + (p1[0] + (p2[0] - p0[0]) / 6).toFixed(1) + ' ' + (p1[1] + (p2[1] - p0[1]) / 6).toFixed(1) + ' ' +
        (p2[0] - (p3[0] - p1[0]) / 6).toFixed(1) + ' ' + (p2[1] - (p3[1] - p1[1]) / 6).toFixed(1) + ' ' + p2[0].toFixed(1) + ' ' + p2[1].toFixed(1);
    }
    return d;
  }
  var pts = function () { return cur.line.map(function (v, i) { return [i * W / 11, H - (v / cur.max) * (H - 14) - 4]; }); };

  function render() {
    var max = Math.max.apply(null, cur.line) * 1.12 || 1; cur.max = max;
    var p = pts(), d = path(p);
    lineEl.setAttribute('d', d);
    areaEl.setAttribute('d', d + ' L' + W + ' ' + H + ' L0 ' + H + ' Z');
    ylab.innerHTML = [3, 2, 1, 0].map(function (i) { return '<span>' + short(max * i / 3) + '</span>'; }).join('');
    kEls[0].textContent = money(cur.kpi[0]);
    kEls[1].textContent = Math.round(cur.kpi[1]).toLocaleString('en-US');
    kEls[2].textContent = '$' + cur.kpi[2].toFixed(2);
    var bmax = Math.max.apply(null, cur.bars) * 1.05 || 1;
    cur.bars.forEach(function (v, i) { fills[i].style.width = (v / bmax * 100).toFixed(1) + '%'; vals[i].textContent = Math.round(v).toLocaleString('en-US'); });
    var tot = cur.mix.reduce(function (a, b) { return a + b; }, 0) || 1, C = 2 * Math.PI * 70, off = 0;
    cur.mix.forEach(function (v, i) {
      var len = v / tot * C;
      segEls[i].setAttribute('stroke-dasharray', Math.max(0, len - 2).toFixed(2) + ' ' + C.toFixed(2));
      segEls[i].setAttribute('stroke-dashoffset', (-off).toFixed(2));
      legVals[i].textContent = Math.round(v / tot * 100) + '%';
      off += len;
    });
    if (typeof placeHover === 'function') placeHover();   // keep the tooltip in step while the chart morphs
  }

  function go(r, instant) {
    range = r;
    var D = DATA[r], from = { line: cur.line.slice(), kpi: cur.kpi.slice(), bars: cur.bars.slice(), mix: cur.mix.slice() };
    $('rl').textContent = D.rl;
    xlab.innerHTML = D.x.map(function (x) { return '<span>' + x + '</span>'; }).join('');
    D.d.forEach(function (t, i) { dEls[i].textContent = t + ' vs last period'; });
    cancelAnimationFrame(raf);
    var mix = function (a, b, t) { return a.map(function (v, i) { return v + (b[i] - v) * t; }); };
    if (instant || RM) { cur.line = D.line.slice(); cur.kpi = D.kpi.slice(); cur.bars = D.bars.slice(); cur.mix = D.mix.slice(); render(); return; }
    var t0 = performance.now(), dur = 850;
    (function tick(now) {
      var t = ease(Math.min(1, (now - t0) / dur));
      cur.line = mix(from.line, D.line, t); cur.kpi = mix(from.kpi, D.kpi, t); cur.bars = mix(from.bars, D.bars, t); cur.mix = mix(from.mix, D.mix, t);
      render();
      if (now - t0 < dur) raf = requestAnimationFrame(tick); else { cur.line = D.line.slice(); cur.kpi = D.kpi.slice(); cur.bars = D.bars.slice(); cur.mix = D.mix.slice(); render(); }
    })(t0);
  }

  $('seg').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    [].forEach.call($('seg').children, function (x) { x.classList.toggle('on', x === b); x.setAttribute('aria-selected', x === b); });
    go(b.dataset.r);
  });

  /* hover: crosshair snaps to the nearest point */
  var hoverIdx = -1;
  function placeHover() {
    if (hoverIdx < 0) return;
    var r = chart.getBoundingClientRect(), left = 44, w = r.width - left, i = hoverIdx;
    var p = pts()[i], x = left + p[0] / W * w, y = p[1] / H * r.height;
    cross.setAttribute('x1', p[0]); cross.setAttribute('x2', p[0]); cross.setAttribute('opacity', 1);
    dot.style.left = x + 'px'; dot.style.top = y + 'px'; dot.style.opacity = 1;
    tip.style.left = x + 'px'; tip.style.top = Math.max(26, y - 12) + 'px'; tip.style.opacity = 1;
    tip.textContent = DATA[range].x[i] + ' · ' + money(cur.line[i]);
  }
  function hover(e) {
    var r = chart.getBoundingClientRect(), left = 44, w = r.width - left;
    hoverIdx = Math.max(0, Math.min(11, Math.round((e.clientX - r.left - left) / w * 11)));
    placeHover();
  }
  chart.addEventListener('pointermove', hover);
  chart.addEventListener('pointerdown', hover);
  chart.addEventListener('pointerleave', function () { hoverIdx = -1; cross.setAttribute('opacity', 0); dot.style.opacity = 0; tip.style.opacity = 0; });

  render();
  go('today');    // the first load morphs up from zero
})();
