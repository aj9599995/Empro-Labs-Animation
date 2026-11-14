# Mechanic Library

Two parts. **Built** entries have a runnable example in `examples/`. **Not built** entries are tested ideas with a technique, an input, a fallback and a real estate use. Build them with `technique-recipes.md`, and mark them built in `used-designs.md` once they exist.

Each entry lists: the primitive (what it simulates), the input, the technique, the fallback, and the real estate use.

## Part 1: Built (25 examples, including the layered stack)

| # | Family | Example folder | Input | Technique |
|---|--------|----------------|-------|-----------|
| 1 | Layered 3D stack that fans | `layered-stack-hyperframe` | Hover, focus, click | CSS 3D, measured-width underline, Web Animations intro |
| 2 | 3D carousel ring | `ring-tea-site` | Drag, keys, buttons | CSS 3D ring, snap on release |
| 3 | Scroll-driven 3D tunnel | `depth-rail-site` | Scroll, keys, dots | `translateZ` per card, blur ahead |
| 4 | Particles forming words | `particle-studio-site` | Pointer, buttons, keys | Canvas particles, springs to sampled text |
| 5 | Stroke drawn by scrolling | `trail-draw-site` | Scroll | `stroke-dashoffset`, IntersectionObserver wipes |
| 6 | Layout (FLIP) and expand | `swatch-flip-site` | Filter buttons, click | FLIP, rectangle-to-fullscreen expand |
| 7 | Momentum carousel | `reel-inertia-site` | Drag, fling, wheel, keys | Velocity, friction, wrap-around loop |
| 8 | Physics pile | `gumdrop-physics-site` | Drag and throw, buttons | Gravity, circle collisions, capped throw |
| 9 | Typed terminal and decode | `terminal-type-site` | Typed commands, arrows | Timed typing, glyph decode, history |
| 10 | Gooey liquid cursor | `goo-juice-site` | Pointer, click | Lagging circles, SVG blur and threshold |
| 11 | CSS scroll-driven | `almanac-css-site` | Scroll | `animation-timeline`, sticky stacking, no JavaScript |
| 12 | WebGL shader field | `shader-scent-site` | Pointer, keys | Fragment shader, uniforms, resolution scale |
| 13 | 3D page-turning book | `recipe-book-site` | Click, buttons, keys | Hinged leaves, `rotateY`, z-order during turn |
| 14 | Morphing charts | `ledger-morph-site` | Range switch, hover | Tweened arrays, count-up, live tooltip |
| 15 | Sound-reactive strings | `harp-audio-site` | Pointer, keys | Web Audio oscillators, gesture gate |
| 16 | Scene driven by one value | `harbor-daynight-site` | Slider, timed play | One value sets sky, sun, moon, labels |
| 17 | Swipe deck with undo | `swipe-deck-site` | Drag, fling, keys | Drag tilt, threshold, spring-back, undo stack |
| 18 | Spotlight reveal | `lantern-reveal-site` | Pointer, press | Two layers and a moving mask, proximity |
| 19 | Split-flap display | `splitflap-board-site` | Time, hover | Per-cell flaps stepping through an alphabet |
| 20 | Cursor-driven variable font | `variable-type-site` | Pointer, sliders | Font variation axes from distance |
| 21 | Pointer 3D tilt with foil | `holo-tilt-site` | Pointer, focus | Pointer to rotation, glare and foil variables |
| 22 | Orbital camera follow | `orrery-orbit-site` | Click, slider, keys | Simulated clock, eased camera target |
| 23 | Before and after mask | `before-after-renovation-site` | Drag, keys | `clip-path` on a top layer, intro sweep |
| 24 | Pinned scrollytelling route | `pinned-buying-story-site` | Scroll | Sticky stage, active chapter, stroke drawn by step |
| 25 | Flip cards with a wave | `flip-listing-site` | Click, keys | 3D flip, `inert` on the hidden face, staggered wave |

## Part 2: Ideas (Q, G and U are now built)

### Interaction and cursor

**A. Magnetic button.** Primitive: magnetism. Input: pointer near a button. Technique: translate the button towards the pointer in proportion to its distance (`transform`, with a short CSS transition). Fallback: a plain button. Real estate: "Book a viewing" CTA. Use only where the pointer is available (`hover: hover`).

**B. Pointer spotlight.** Primitive: light. Input: pointer. Technique: `--mx` and `--my` CSS variables drive a radial gradient on the section. Fallback: static gradient. Real estate: highlight a feature on a floor plan. Lantern reveal (17) is a stronger version, so pick one.

**C. Ripple.** Primitive: water. Input: click. Technique: a circle at the click point scales from 0 to the card size and fades (`transform` and `opacity`), removed on `animationend`. Fallback: no ripple. Real estate: confirm a saved search.

**D. Cursor trail.** Primitive: inertia of a trail. Input: pointer. Technique: a canvas of dots, each following the previous one with a lag and fading. Fallback: none needed. Real estate: decorative only; avoid on listing pages.

**E. Elastic toggle.** Primitive: spring. Input: click or key. Technique: a spring (overshoot under 6%) moves the knob; use one spring curve per page. Fallback: a plain switch. Real estate: "show only with garden" filters.

### Scroll and layout

**F. Parallax depth layers.** Primitive: depth. Input: scroll. Technique: three or four layers move at different speeds (`transform: translate3d`) inside one rAF loop, or with `animation-timeline: scroll()`. Fallback: static layers. Real estate: hero photograph over a skyline. Keep the movement small (under 40 px) and not on text.

**G. Pinned scrollytelling.** *Built: `pinned-buying-story-site`.* Primitive: chapters. Input: scroll. Technique: a `position: sticky` stage, with an IntersectionObserver marking the active chapter, which swaps its content. Fallback: the chapters stack normally. Real estate: "How buying works" in five steps. Maximum two pins per page.

**H. Horizontal pinned track.** Primitive: panning. Input: scroll. Technique: a sticky container; `translateX` mapped to scroll progress. Fallback: a horizontal scrollbar. Real estate: a neighbourhood photo strip. Desktop only.

**I. Bento grid reveal.** Primitive: assembly. Input: scroll. Technique: a CSS grid with spanning cells; each cell enters with a stagger (`--i`). Fallback: visible cells. Real estate: a neighbourhood or amenities grid.

**J. Scroll colour shift.** Primitive: light changing through a day. Input: scroll. Technique: interpolate a background colour variable between sections. Fallback: one colour. Real estate: the mood of an area.

**K. Ken Burns hero.** Primitive: slow camera. Input: none (time). Technique: a slow `scale` and `translate` keyframe on the hero photo, 20 s or more, stopped under reduced motion. Fallback: still photo. Real estate: the hero listing. Check that alt text still describes the photo.

### Reveals and text

**L. Clip-path wipe.** Primitive: curtain. Input: scroll or enter. Technique: `clip-path: inset(0 100% 0 0)` to `inset(0)` via a class added by IntersectionObserver. Fallback: visible. Real estate: reveal a property photo.

**M. Blur-to-focus words.** Primitive: focus. Input: enter. Technique: words start at `filter: blur(8px)` with `opacity` 0 and `translateY(12px)`, staggered. Keep blur small (blur is costly on large elements). Fallback: visible text. Real estate: section headings.

**N. Odometer count-up roll.** Primitive: mechanical counter. Input: enter. Technique: each digit is a vertical strip; `translateY` moves to the target digit. Fallback: the number. Real estate: price per square metre, days on market. Show the source and date.

**O. Stroke icon draw.** Primitive: pen. Input: enter or click. Technique: an SVG icon's stroke draws with `stroke-dasharray` and `stroke-dashoffset`. Fallback: full icon. Real estate: a "submitted" tick after an enquiry.

**P. Marquee ticker.** Primitive: conveyor. Input: none, pause on hover. Technique: duplicated content with `translateX(-50%)` on an infinite linear keyframe. Fallback: static list. Real estate: "Just listed" strip. Stop it under reduced motion.

### Shapes and images

**Q. Before and after slider.** *Built: `before-after-renovation-site`.* Primitive: mask. Input: drag, keys. Technique: two images, the top one clipped with `clip-path: inset(0 calc(100% - var(--pos)) 0 0)`. Fallback: two images side by side. Real estate: renovation or staging. Both images need the same crop.

**R. Magnifier lens.** Primitive: lens. Input: pointer. Technique: a circle showing a scaled copy of the image under the pointer (`transform` and `background-position`). Fallback: none needed. Real estate: zoom into a floor plan detail or a material sample.

**S. Liquid blob morph.** Primitive: fluid. Input: time or hover. Technique: SVG path `d` interpolated between two shapes with the same number of points. Fallback: static blob. Real estate: abstract hero background, decoration only.

**T. Image distortion on hover.** Primitive: heat shimmer. Input: pointer. Technique: an SVG `feDisplacementMap` with an animated scale, or a small WebGL pass. Fallback: plain image. Real estate: a hover on a gallery image. Costly; keep to one image.

**U. Flip card.** *Built: `flip-listing-site`.* Primitive: card. Input: hover, click, tap. Technique: `rotateY(180deg)` with `backface-visibility: hidden` on two faces. Fallback: the front face with a details link. Real estate: a listing card whose back shows the key facts.

**V. Cover-flow carousel.** Primitive: carousel in depth. Input: drag, keys. Technique: items placed around `rotateY` with `translateZ`, the nearest one fronted. Fallback: a horizontal list. Real estate: a photo set. Similar to 2, so change the input or the look.

**W. Animated gradient mesh.** Primitive: light. Input: time. Technique: registered CSS custom properties (`@property`) animated in a keyframe, so the gradient moves smoothly. Fallback: static gradient. Real estate: a calm hero background.

### Data and time

**X. Timeline scrub.** Primitive: time. Input: slider or scroll. Technique: one value (a date) sets positions and labels, as in 16. Fallback: a static chart with a table. Real estate: market history across years.

**Y. Calendar slot select.** Primitive: selection that slides. Input: click, keys. Technique: a shared pill that moves between slots with FLIP. Fallback: a list of buttons. Real estate: choose a viewing time.

**Z. Area map flyover.** Primitive: camera on a map. Input: click a marker, drag. Technique: a schematic map in SVG or canvas; the camera eases to the marker (as in 22). Fallback: a list of areas. Real estate: neighbourhoods. Use a schematic map unless the licence allows a real one.

### Feedback and celebration

**AA. Confetti burst.** Primitive: celebration. Input: a successful action. Technique: a short canvas burst that fades in under 1.5 s. Fallback: a message. Real estate: after a booking is sent. Use only once and never on load.

**AB. Form field focus.** Primitive: a line that draws. Input: focus. Technique: an underline that scales from the left with `transform: scaleX`. Fallback: a visible focus ring. Real estate: enquiry form.

**AC. Shared-element page transition.** Primitive: continuity. Input: click. Technique: the View Transitions API (`document.startViewTransition`) with matching `view-transition-name` on the photo. Fallback: a plain page change. Real estate: list to detail. Check browser support before promising it.

## Choosing from the library

- Prefer a family that the visitor can drive with the input the page offers. A page with no hover needs a touch or click version of the primitive.
- Prefer one family plus its fallback over three families that compete.
- Check `used-designs.md` before picking. If the family is built, change the input, the purpose or the look enough to pass the novelty test.
