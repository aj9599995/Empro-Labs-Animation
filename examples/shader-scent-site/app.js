/* Maison Nocturne: a full-screen WebGL fragment shader (no library). The shader warps layered noise into a slow
   flowing field, mixes three palette colours, and bends around the cursor. Choosing a scent glides the palette. */
(function () {
  'use strict';

  var SCENTS = [
    { n: 'Vesper',  t: 'The violet hour, when the city exhales.',        notes: ['Bergamot', 'Iris', 'Cedar'],     p: ['#1b0f3b', '#7a35c8', '#ff7ab8'] },
    { n: 'Ember',   t: 'Smoke and amber from a fire left burning.',      notes: ['Saffron', 'Amber', 'Oud'],       p: ['#2a0a05', '#d9480f', '#ffd166'] },
    { n: 'Tide',    t: 'Salt air over cold, dark water.',                notes: ['Sea salt', 'Vetiver', 'Musk'],   p: ['#04202b', '#0f7c8c', '#9ff3e3'] },
    { n: 'Verdant', t: 'A garden after midnight rain.',                  notes: ['Green fig', 'Moss', 'Jasmine'],  p: ['#06210f', '#2f9e44', '#e3ffb8'] }
  ];
  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cv = document.getElementById('gl');
  var gl = cv.getContext('webgl', { antialias: false, powerPreference: 'low-power' });
  var nameEl = document.getElementById('name'), tagEl = document.getElementById('tag'), notesEl = document.getElementById('notes');
  var idxEl = document.getElementById('idx'), nav = document.getElementById('scents');

  function hex(h) { return [1, 3, 5].map(function (i) { return parseInt(h.substr(i, 2), 16) / 255; }); }
  var cur = SCENTS[0].p.map(hex), dst = cur.map(function (c) { return c.slice(); });
  var mouse = [0.5, 0.5], mt = [0.5, 0.5], active = -1, redraw = null;

  /* ---- UI ---- */
  var btns = SCENTS.map(function (s, i) {
    var b = document.createElement('button');
    b.textContent = s.n;
    b.addEventListener('click', function () { choose(i); });
    nav.appendChild(b);
    return b;
  });

  function choose(i) {
    if (i === active) return;
    var first = active < 0;
    active = i;
    var s = SCENTS[i];
    dst = s.p.map(hex);
    if (RM || first) cur = dst.map(function (c) { return c.slice(); });
    btns.forEach(function (b, k) { b.classList.toggle('on', k === i); });
    idxEl.textContent = ['I', 'II', 'III', 'IV'][i] + ' / IV';
    var apply = function () {
      nameEl.textContent = s.n; tagEl.textContent = s.t;
      notesEl.innerHTML = ['Top', 'Heart', 'Base'].map(function (l, k) { return '<div><dt>' + l + '</dt><dd>' + s.notes[k] + '</dd></div>'; }).join('');
      nameEl.classList.remove('swap');
    };
    if (first || RM) apply(); else { nameEl.classList.add('swap'); setTimeout(apply, 330); }
    if (redraw) redraw();
  }
  window.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') choose((active + 1) % SCENTS.length);
    if (e.key === 'ArrowLeft') choose((active + SCENTS.length - 1) % SCENTS.length);
  });
  choose(0);

  if (!gl) return;   // no WebGL: the CSS gradient on the canvas stays as a fallback

  /* ---- shader ---- */
  var VS = 'attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }';
  var FS = [
    'precision mediump float;',
    'uniform vec2 r; uniform float t; uniform vec2 m; uniform vec3 c1; uniform vec3 c2; uniform vec3 c3;',
    'float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }',
    'float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);',
    '  return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y); }',
    'float fbm(vec2 p){ float v = 0.0, a = 0.5; for(int i=0;i<5;i++){ v += a*noise(p); p = p*2.02 + 7.3; a *= 0.5; } return v; }',
    'void main(){',
    '  vec2 uv = gl_FragCoord.xy / r; vec2 p = (gl_FragCoord.xy - 0.5*r) / r.y * 2.2;',
    '  vec2 mp = (m * r - 0.5*r) / r.y * 2.2;',
    '  vec2 d = p - mp; float md = length(d);',
    '  p += d * exp(-md*md*2.2) * 0.55;',                                   // the cursor pushes the field outward
    '  vec2 q = vec2(fbm(p + 0.08*t), fbm(p + vec2(5.2, 1.3) - 0.06*t));',
    '  vec2 s = vec2(fbm(p + 3.0*q + vec2(1.7, 9.2) + 0.12*t), fbm(p + 3.0*q + vec2(8.3, 2.8) - 0.1*t));',
    '  float f = fbm(p + 3.2*s);',
    '  vec3 col = mix(c1, c2, clamp(f*f*3.2, 0.0, 1.0));',
    '  col = mix(col, c3, clamp(length(q) * 0.9 * smoothstep(0.35, 0.95, f), 0.0, 1.0));',
    '  col += c3 * 0.28 * exp(-md*md*3.0);',                                 // soft glow under the cursor
    '  col *= 0.55 + 0.9 * smoothstep(1.35, 0.1, length(uv - 0.5));',        // vignette
    '  gl_FragColor = vec4(col, 1.0);',
    '}'
  ].join('\n');

  function sh(type, src) {
    var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); return null; }
    return s;
  }
  var vs = sh(gl.VERTEX_SHADER, VS), fs = sh(gl.FRAGMENT_SHADER, FS);
  if (!vs || !fs) return;
  var prog = gl.createProgram();
  gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);
  var buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);   // one oversized triangle
  var loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  var U = {}; ['r', 't', 'm', 'c1', 'c2', 'c3'].forEach(function (n) { U[n] = gl.getUniformLocation(prog, n); });

  var scale = 0.6;   // render below full resolution; the field is soft, so it stays smooth and cheap
  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2) * scale;
    cv.width = Math.round(innerWidth * dpr); cv.height = Math.round(innerHeight * dpr);
    gl.viewport(0, 0, cv.width, cv.height);
  }
  window.addEventListener('resize', resize); resize();
  window.addEventListener('pointermove', function (e) { mt = [e.clientX / innerWidth, 1 - e.clientY / innerHeight]; });

  var t0 = performance.now();
  function frame(now) {
    for (var i = 0; i < 3; i++) for (var k = 0; k < 3; k++) cur[i][k] += (dst[i][k] - cur[i][k]) * 0.035;   // palette glide
    mouse[0] += (mt[0] - mouse[0]) * 0.06; mouse[1] += (mt[1] - mouse[1]) * 0.06;
    gl.uniform2f(U.r, cv.width, cv.height);
    gl.uniform1f(U.t, RM ? 0 : (now - t0) / 1000);
    gl.uniform2f(U.m, mouse[0], mouse[1]);
    gl.uniform3fv(U.c1, cur[0]); gl.uniform3fv(U.c2, cur[1]); gl.uniform3fv(U.c3, cur[2]);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (!RM) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  if (RM) redraw = function () { requestAnimationFrame(frame); };   // reduced motion: draw a still frame per change
})();
