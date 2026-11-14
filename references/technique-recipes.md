# Technique Recipes

Short, original recipes. Each one is a building block for a new page. They are not copied from any example or reference. They are written to be pasted into `script.js` and adapted. Every JavaScript recipe compiles (checked before this file was committed). Always test in the browser after you paste.

Rules that apply to all recipes:

- Use `transform` and `opacity` for movement.
- Read layout (`getBoundingClientRect`, `offsetWidth`) before you write styles in the same frame. Do not alternate reads and writes in a loop.
- Check `prefers-reduced-motion` before you start any loop.
- Give every element an id that is unique on the page.

## 1. Reduced motion and skipping the intro

```js
const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const reduced = () => reduceQuery.matches;

// Run `finish` once on the first click, tap or key press. Use it to skip an intro.
function skipOnInput(finish) {
  const done = () => {
    finish();
    removeEventListener('pointerdown', done);
    removeEventListener('keydown', done);
  };
  addEventListener('pointerdown', done, { once: true });
  addEventListener('keydown', done, { once: true });
}
```

## 2. Pointer tilt with spring-back

```js
function tilt(card, maxDeg = 12) {
  let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
  const loop = () => {
    cx += (tx - cx) * 0.12;
    cy += (ty - cy) * 0.12;
    card.style.transform = `rotateX(${cy.toFixed(2)}deg) rotateY(${cx.toFixed(2)}deg)`;
    const settled = Math.abs(tx - cx) + Math.abs(ty - cy) < 0.01;
    raf = settled ? 0 : requestAnimationFrame(loop);
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };
  card.addEventListener('pointermove', (e) => {
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;   // -0.5 .. 0.5
    const py = (e.clientY - r.top) / r.height - 0.5;
    tx = px * 2 * maxDeg;
    ty = -py * 2 * maxDeg;
    kick();
  });
  card.addEventListener('pointerleave', () => { tx = 0; ty = 0; kick(); });
}
```

## 3. Measured underline for a swapping phrase

Keep a hidden copy of the phrase with the same font. Measure it, then size the underline. Animate with `scaleX` if the underline is a pseudo-element, or with `width` only if it is short.

```js
const measure = document.getElementById('phrase-measure'); // visibility:hidden; white-space:nowrap
function fitUnderline(text, bar) {
  measure.textContent = text;
  bar.style.width = measure.offsetWidth + 'px';
}
```

## 4. FLIP: animate a reordered or filtered grid

```js
function flip(items, change, duration = 450) {
  const first = new Map(items.map((el) => [el, el.getBoundingClientRect()]));
  change(); // reorder, hide or show nodes here
  for (const el of items) {
    const before = first.get(el);
    if (!before || el.hidden) continue;
    const after = el.getBoundingClientRect();
    const dx = before.left - after.left;
    const dy = before.top - after.top;
    if (dx || dy) {
      el.animate(
        [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }],
        { duration, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' }
      );
    }
  }
}
```

Items that appear for the first time need their own entrance (a scale from 0.9 with opacity from 0).

## 5. Canvas particles that form a word

Sample the word's pixels once, then spring each particle to its target.

```js
function sampleText(text, font, w, h, step = 4) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const x = c.getContext('2d');
  x.font = font; x.textBaseline = 'middle'; x.fillStyle = '#fff';
  x.fillText(text, (w - x.measureText(text).width) / 2, h / 2);
  const d = x.getImageData(0, 0, w, h).data;
  const points = [];
  for (let y = 0; y < h; y += step) {
    for (let i = 0; i < w; i += step) {
      if (d[(y * w + i) * 4 + 3] > 128) points.push([i, y]);
    }
  }
  return points;
}

// each frame, for each particle p = { x, y, vx, vy, tx, ty }:
//   p.vx = (p.vx + (p.tx - p.x) * 0.02) * 0.86;  p.x += p.vx;   (same for y)
```

Fit the word to the canvas by measuring it first, so it never clips. Use fewer particles on small screens.

## 6. Scroll progress and one-time reveals

```js
// Progress as a CSS variable, throttled to one write per frame
let queued = false;
addEventListener('scroll', () => {
  if (queued) return;
  queued = true;
  requestAnimationFrame(() => {
    const max = document.documentElement.scrollHeight - innerHeight;
    document.documentElement.style.setProperty('--p', (max > 0 ? scrollY / max : 0).toFixed(4));
    queued = false;
  });
}, { passive: true });

// Reveal once when an element enters the screen
const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  }
}, { threshold: 0.2 });
document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
```

Observe the block that is laid out, not a clipped child inside it.

## 7. Stroke drawn by scroll (SVG)

```js
const path = document.querySelector('#trail path');
const length = path.getTotalLength();
path.style.strokeDasharray = `${length}`;
function drawTo(startY, endY) {
  const p = Math.min(1, Math.max(0, (scrollY - startY) / (endY - startY)));
  path.style.strokeDashoffset = `${length * (1 - p)}`;
}
```

Call `drawTo` inside the throttled scroll handler from recipe 6.

## 8. Gooey metaball cursor (SVG filter)

```html
<svg width="0" height="0" aria-hidden="true">
  <filter id="goo-filter">
    <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur" />
    <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 30 -14" />
  </filter>
</svg>
<div id="goo-layer" style="filter: url(#goo-filter)"><!-- circles here --></div>
```

Give the filter and the layer different ids. Chase the pointer with circles that lag more each time:

```js
const blobs = Array.from({ length: 7 }, () => ({ x: 0, y: 0 }));
let mx = 0, my = 0;
addEventListener('pointermove', (e) => { mx = e.clientX; my = e.clientY; });
function chase() {
  let px = mx, py = my;
  for (const b of blobs) {
    b.x += (px - b.x) * 0.25;
    b.y += (py - b.y) * 0.25;
    b.el.style.transform = `translate(${b.x}px, ${b.y}px)`;
    px = b.x; py = b.y;
  }
  requestAnimationFrame(chase);
}
```

## 9. Physics: circles with gravity, walls and pile-up

Simplified on purpose: positions are integrated, walls bounce, overlaps are pushed apart. It is not a full rigid-body solver.

```js
const G = 1800, BOUNCE = 0.55;
function step(balls, dt, W, H) {
  for (const b of balls) {
    b.vy += G * dt;
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    if (b.x - b.r < 0) { b.x = b.r; b.vx = -b.vx * BOUNCE; }
    if (b.x + b.r > W) { b.x = W - b.r; b.vx = -b.vx * BOUNCE; }
    if (b.y + b.r > H) { b.y = H - b.r; b.vy = -b.vy * BOUNCE; b.vx *= 0.98; }
  }
  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      const a = balls[i], c = balls[j];
      const dx = c.x - a.x, dy = c.y - a.y;
      const d = Math.hypot(dx, dy), min = a.r + c.r;
      if (d > 0 && d < min) {
        const k = (min - d) / d / 2;
        a.x -= dx * k; a.y -= dy * k;
        c.x += dx * k; c.y += dy * k;
      }
    }
  }
}
// call with dt clamped to 1/30 s, so a slow frame does not explode the simulation
```

## 10. Momentum carousel with friction

```js
let pos = 0, vel = 0, dragging = false, lastX = 0, lastT = 0;
const FRICTION = 0.94; // velocity kept per frame at 60 fps
function inertia(dt) {
  if (!dragging) {
    vel *= Math.pow(FRICTION, dt * 60);
    pos += vel * dt;
    if (Math.abs(vel) < 2) vel = 0;
  }
  track.style.transform = `translate3d(${pos}px, 0, 0)`;
  requestAnimationFrame((t) => inertia((t - lastT) / 1000));
}
track.addEventListener('pointerdown', (e) => { dragging = true; lastX = e.clientX; lastT = performance.now(); track.setPointerCapture(e.pointerId); });
track.addEventListener('pointermove', (e) => {
  if (!dragging) return;
  const now = performance.now();
  const dx = e.clientX - lastX;
  pos += dx;
  vel = dx / Math.max(1, now - lastT) * 1000;   // px per second
  lastX = e.clientX; lastT = now;
});
track.addEventListener('pointerup', () => { dragging = false; });
```

Wrap `pos` modulo the track width so the row loops.

## 11. Typing and decoding text

```js
const GLYPHS = '#%&@$*+=?/<>01';
function decode(el, target, step = 40) {
  let locked = 0;
  const timer = setInterval(() => {
    el.textContent = [...target].map((ch, k) => {
      if (k < locked || ch === ' ') return ch;
      return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
    }).join('');
    if (locked < target.length) locked++;      // lock one more letter each tick
    else { clearInterval(timer); el.textContent = target; }
  }, step);
}
```

Typing: append one character per tick with `setTimeout`, and read the timing from a small array so the rhythm can vary.

## 12. Split-flap cell step

```js
const ALPHABET = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
function setFlap(cell, ch) {
  cell.dataset.c = ch;
  cell.querySelector('.flap-top').textContent = ch;
  cell.querySelector('.flap-bottom').textContent = ch;
  cell.classList.remove('flip');
  void cell.offsetWidth;                         // restart the flip animation
  cell.classList.add('flip');
}
function flipTo(cell, target, delay = 60) {
  if (!ALPHABET.includes(target)) return;
  let i = ALPHABET.indexOf(cell.dataset.c || ' ');
  const goal = ALPHABET.indexOf(target);
  const next = () => {
    if (i === goal) return;
    i = (i + 1) % ALPHABET.length;
    setFlap(cell, ALPHABET[i]);
    setTimeout(next, delay);
  };
  next();
}
```

CSS: each cell has a top half and a bottom half. The `.flip` class runs a short keyframe on the top half with `rotateX` and `transform-origin: bottom`.

## 13. Minimal WebGL field

```js
const canvas = document.getElementById('field');
const gl = canvas.getContext('webgl');
if (!gl) { canvas.hidden = true; /* show a CSS gradient fallback here */ }
else {
  const VS = 'attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }';
  const FS = `precision mediump float; uniform vec2 r; uniform float t;
    void main(){ vec2 u = gl_FragCoord.xy / r;
      float v = sin(u.x * 6.0 + t) + cos(u.y * 5.0 - t * 0.7);
      gl_FragColor = vec4(0.5 + 0.5 * sin(v + vec3(0.0, 2.0, 4.0)), 1.0); }`;
  const shader = (type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  };
  const prog = gl.createProgram();
  gl.attachShader(prog, shader(gl.VERTEX_SHADER, VS));
  gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(prog); gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const uR = gl.getUniformLocation(prog, 'r'), uT = gl.getUniformLocation(prog, 't');
  const resize = () => {
    canvas.width = Math.floor(canvas.clientWidth * 0.6);   // 60% resolution is cheap and soft enough
    canvas.height = Math.floor(canvas.clientHeight * 0.6);
    gl.viewport(0, 0, canvas.width, canvas.height);
  };
  resize(); addEventListener('resize', resize);
  const frame = (ms) => {
    gl.uniform2f(uR, canvas.width, canvas.height);
    gl.uniform1f(uT, ms / 1000);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}
```

Pause the loop when the canvas is off screen, with an IntersectionObserver that sets a flag.

## 14. Web Audio pluck (created after a click)

```js
let audio = null;
function pluck(freq, velocity = 0.5) {
  if (!audio) audio = new (window.AudioContext || window.webkitAudioContext)();
  if (audio.state === 'suspended') audio.resume();
  const now = audio.currentTime;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = 'triangle';
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(velocity * 0.3, now + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);
  osc.connect(gain).connect(audio.destination);
  osc.start(now);
  osc.stop(now + 1.5);
}
```

Only call `pluck` from a user gesture, because browsers block audio before one. Keep a mute toggle.

## 15. Variable font proximity

The font must load its axes, for example `family=Anybody:wdth,wght@50..150,100..900`.

```js
function proximity(el, mx, my, radius = 220) {
  const r = el.getBoundingClientRect();
  const d = Math.hypot(mx - (r.left + r.width / 2), my - (r.top + r.height / 2));
  const k = Math.max(0, 1 - d / radius);
  el.style.fontVariationSettings = `'wght' ${Math.round(100 + k * 800)}, 'wdth' ${Math.round(50 + k * 100)}`;
}
```

Read the letters' positions once after layout, and update them inside one rAF loop. Recalculate on resize.

## 16. Eased camera that follows a moving target

Frame-rate independent easing: the gap closes by the same fraction per second at any frame rate.

```js
const cam = { x: 0, y: 0, z: 1 };
const goal = { x: 0, y: 0, z: 1 };   // set goal each frame from the followed object
let last = performance.now();
function camera(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  const k = 1 - Math.pow(0.001, dt);   // the remaining gap shrinks to 0.1% per second
  cam.x += (goal.x - cam.x) * k;
  cam.y += (goal.y - cam.y) * k;
  cam.z += (goal.z - cam.z) * k;
  render(cam);
  requestAnimationFrame(camera);
}
requestAnimationFrame(camera);
```

## 17. CSS scroll-driven animation with a fallback

```css
.progress { transform: scaleX(0); transform-origin: left center; }
@supports (animation-timeline: scroll()) {
  .progress { animation: grow linear both; animation-timeline: scroll(root); }
}
@keyframes grow { to { transform: scaleX(1); } }

@supports (animation-timeline: view()) {
  [data-reveal] {
    animation: rise linear both;
    animation-timeline: view();
    animation-range: entry 0% cover 35%;
  }
}
@keyframes rise {
  from { opacity: 0; transform: translateY(40px); }
  to   { opacity: 1; transform: none; }
}

@media (prefers-reduced-motion: reduce) {
  .progress, [data-reveal] { animation: none; }
}
```

Without support, the page shows the final state, which is still readable. Check the current support table before you promise a browser.

## 18. 3D page turn

```css
.book { perspective: 2000px; position: relative; }
.leaf {
  position: absolute; inset: 0;
  transform-origin: left center;
  transform-style: preserve-3d;
  transition: transform 0.9s cubic-bezier(0.6, 0.05, 0.2, 1);
}
.leaf.turned { transform: rotateY(-180deg); }
.face { position: absolute; inset: 0; backface-visibility: hidden; }
.face.back { transform: rotateY(180deg); }
```

In JavaScript, raise the z-index of the leaf that is turning, and drop it back when the transition ends (`transitionend`), so pages never cut through each other.

## 19. Before and after slider (clip-path)

```html
<div class="ba" style="--pos: 50%" role="slider" aria-label="Before and after" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" tabindex="0">
  <img class="after" src="..." alt="After: ...">
  <img class="before" src="..." alt="Before: ...">
</div>
```

```css
.ba { position: relative; }
.ba img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.ba .before { clip-path: inset(0 calc(100% - var(--pos)) 0 0); }
```

Drag sets `--pos` from the pointer's position inside the element. Arrow keys change it by 5 points. Both images need the same crop.

## 20. Magnetic button (pointer devices only)

```js
const magnetic = window.matchMedia('(hover: hover)').matches;
function magnet(el, strength = 0.25) {
  if (!magnetic) return;
  el.style.transition = 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)';
  el.addEventListener('pointermove', (e) => {
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  });
  el.addEventListener('pointerleave', () => { el.style.transform = ''; });
}
```

## 21. Rolling digit counter

```html
<span class="digit"><span class="strip">
  <span>0</span><span>1</span><span>2</span><span>3</span><span>4</span>
  <span>5</span><span>6</span><span>7</span><span>8</span><span>9</span>
</span></span>
```

```css
.digit { display: inline-block; height: 1em; overflow: hidden; vertical-align: top; }
.strip { display: flex; flex-direction: column; transition: transform 0.9s cubic-bezier(0.2, 0.8, 0.2, 1); }
.strip > span { height: 1em; line-height: 1em; }
```

```js
function setDigit(strip, n) { strip.style.transform = `translateY(${-n}em)`; }
```

## 22. Marquee ticker (CSS only)

```html
<div class="marquee"><div class="track"><span>Item</span><span>Item</span></div>
  <div class="track" aria-hidden="true"><span>Item</span><span>Item</span></div></div>
```

```css
.marquee { overflow: hidden; }
.marquee .track { display: flex; width: max-content; animation: run 30s linear infinite; }
.marquee:hover .track { animation-play-state: paused; }
@keyframes run { to { transform: translateX(-50%); } }
@media (prefers-reduced-motion: reduce) { .marquee .track { animation: none; } }
```

Duplicate the content so the loop has no gap. Hide the second copy from screen readers.
