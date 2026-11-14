# Mechanics Catalogue

Twenty-two tested demos. Each one is a different animation mechanic on a made-up brand. Use this file to avoid repeats and to find the closest example to a request.

"Tested" means checked in the session that built it, on desktop only unless stated. Every example loads with no console errors and runs locally. Known gaps are listed so you can test them before reporting.

| # | Folder | Mechanic |
|---|--------|----------|
| 1 | `layered-stack-hyperframe` | Layered 3D stack that fans on hover |
| 2 | `ring-tea-site` | Rotating 3D ring of frames |
| 3 | `depth-rail-site` | Scroll-driven flight through a 3D tunnel of cards |
| 4 | `particle-studio-site` | Canvas particles that form words |
| 5 | `trail-draw-site` | SVG trail drawn by scrolling |
| 6 | `swatch-flip-site` | Layout (FLIP) transitions and a tile that expands to full screen |
| 7 | `reel-inertia-site` | Momentum carousel with friction and speed skew |
| 8 | `gumdrop-physics-site` | Hand-written physics: falling, colliding, throwable objects |
| 9 | `terminal-type-site` | Typed commands and text decoding |
| 10 | `goo-juice-site` | Gooey liquid cursor (SVG filter) |
| 11 | `almanac-css-site` | CSS-only scroll-driven animation |
| 12 | `shader-scent-site` | WebGL fragment shader colour field |
| 13 | `recipe-book-site` | 3D page-turning book |
| 14 | `ledger-morph-site` | Charts that morph between data sets |
| 15 | `harp-audio-site` | Strings that vibrate and sound (Web Audio) |
| 16 | `harbor-daynight-site` | One slider drives a whole scene through a day |
| 17 | `swipe-deck-site` | Swipe gesture deck with fling, spring-back and undo |
| 18 | `lantern-reveal-site` | Lantern-style spotlight reveal |
| 19 | `splitflap-board-site` | Mechanical split-flap display |
| 20 | `variable-type-site` | Cursor-driven variable font (weight and width) |
| 21 | `holo-tilt-site` | Pointer 3D tilt with holographic foil |
| 22 | `orrery-orbit-site` | Orbital simulation with a camera that follows a planet |
| 23 | `before-after-renovation-site` | Before and after comparison with a draggable handle |
| 24 | `pinned-buying-story-site` | Pinned five-step route that draws as the reader scrolls |
| 25 | `flip-listing-site` | Property cards that flip to show the facts |

## Details

### 1. layered-stack-hyperframe
- **Visitor sees:** four tilted slabs in 3D. Hovering one fans them into a staircase, colours that slab, and swaps the headline phrase above a measured underline. Click jumps to a section.
- **Technique:** CSS 3D (`perspective`, `preserve-3d`), CSS variables for colour, a requestAnimationFrame pointer tilt, a Web Animations intro, a measured-width underline.
- **Tested:** the original branded version on desktop, hover, word swap, intro. This neutral copy is re-tested for console errors and mobile overflow (none).
- **Gaps:** touch flow (first tap previews, second opens) not re-checked on a real device. Reduced motion is coded but not checked.

### 2. ring-tea-site
- **Visitor sees:** six frames around a 3D ring. Drag, arrow keys or buttons spin it, and it snaps to the nearest frame. The page colour and the title follow the front frame.
- **Technique:** each frame rotated around the ring axis; snap on release; per-frame data drives colour; title letters roll in.
- **Tested:** desktop spin and snap, colour and title follow.
- **Gaps:** touch dragging, mobile layout.

### 3. depth-rail-site
- **Visitor sees:** scrolling flies the camera through cards laid out in depth. Each card swings to the centre, then slides past and fades. Cards ahead are blurred. Dots and arrow keys jump between stations.
- **Technique:** scroll position mapped to a depth (`translateZ`) per card; blur for cards ahead; a cursor-shifted vanishing point.
- **Tested:** desktop scroll from the first card to station 2.
- **Gaps:** later stations, touch scrolling, mobile.

### 4. particle-studio-site
- **Visitor sees:** thousands of dots fly in and settle into the shape of a word (Listen, Make, Play). The cursor pushes them aside. Colour changes per word.
- **Technique:** canvas particles with target positions taken from a measured text layout; a spring towards each target.
- **Tested:** morph on desktop; the word "Make" fits after measuring its real width.
- **Gaps:** touch, mobile.

### 5. trail-draw-site
- **Visitor sees:** a green trail draws itself down the page as you scroll. A dot rides the tip. An altitude badge counts. Headings wipe in as each stop arrives.
- **Technique:** SVG `stroke-dashoffset` tied to scroll progress; wipe reveals with IntersectionObserver on the layout parents of clipped text.
- **Tested:** the line, dot, counter and one reveal at desktop.
- **Gaps:** other stops; mobile.

### 6. swatch-flip-site
- **Visitor sees:** filter buttons reflow a grid of colour tiles, and the tiles that stay glide to new positions. Clicking a tile grows its colour from that tile's own rectangle to full screen.
- **Technique:** FLIP (measure, invert, play) for the grid; a transform scale from the tile's rectangle to the viewport for the expand.
- **Tested:** Warm filter and the expand to full screen on desktop.
- **Gaps:** closing the tile; mobile. **Known issue:** 37 px horizontal overflow at 375 px wide.

### 7. reel-inertia-site
- **Visitor sees:** a row of posters you can throw. It keeps moving, slows with friction, and loops. The row skews with speed. The poster in the centre scales up and sets the title.
- **Technique:** pointer velocity, friction per frame, a wrap-around loop, skew from speed.
- **Tested:** desktop loop, skew and title change after a drag.
- **Gaps:** touch flinging, arrow keys, mobile.

### 8. gumdrop-physics-site
- **Visitor sees:** coloured candies fall, bounce off each other and the walls, and can be grabbed and thrown. Buttons shake the pile, drop more, or reset.
- **Technique:** hand-written gravity, circle collisions, walls, a capped throw speed.
- **Tested:** candies fall and render with their labels, no console errors. The pile was not seen settling, because the preview pane draws few frames.
- **Gaps:** dragging, the three buttons, mobile.

### 9. terminal-type-site
- **Visitor sees:** a headline that decodes from random symbols, a boot sequence that types out, and a working prompt with `help`, `features`, `deploy`, `pricing`, `theme` and `clear`.
- **Technique:** timed character insertion; per-letter symbol decoding; command history with arrow keys.
- **Tested:** the decode, the boot lines and `deploy` running its progress bar.
- **Gaps:** other commands, the theme switch, arrow-key history, mobile.

### 10. goo-juice-site
- **Visitor sees:** a blob that chases the cursor. Circles lag behind and fuse into one stretched shape. Clicking sprays droplets. Buttons lean towards the cursor.
- **Technique:** lagging circles and an SVG filter (blur, then a colour-matrix threshold) that merges them.
- **Tested:** the chain follows the cursor and fuses, console clean.
- **Gaps:** droplets, magnetic buttons, mobile. **Lesson:** a filter and a container shared one `id`, so the script grabbed the wrong element.

### 11. almanac-css-site
- **Visitor sees:** month cards stick near the top and stack as you scroll, a progress bar fills, a dial turns, and text rises in.
- **Technique:** CSS only, with `animation-timeline` (scroll and view timelines). No JavaScript, just HTML and CSS.
- **Tested:** the stack, bar and dial on desktop.
- **Gaps:** mobile. Browsers without scroll-driven animations show the static page. Check current support before you promise it.

### 12. shader-scent-site
- **Visitor sees:** a slowly folding colour field, like ink in water. The cursor pushes it. Choosing a scent glides the palette to new colours.
- **Technique:** a hand-written WebGL fragment shader with no library; the cursor is a uniform; the canvas renders at 60% resolution; a plain gradient fallback without WebGL.
- **Tested:** the shader renders, the cursor and scent switch work, console clean.
- **Gaps:** palette glide finish, mobile, other browsers.

### 13. recipe-book-site
- **Visitor sees:** a closed book on a desk. Pages turn in 3D, with the moving page on top of the stack. Buttons and arrow keys turn pages.
- **Technique:** each leaf hinged on the spine and rotated 180° in 3D; z-index changes mid-turn so pages do not cut through each other.
- **Tested:** the cover and two page turns on desktop.
- **Gaps:** the last recipes, turning back at the back cover, mobile.

### 14. ledger-morph-site
- **Visitor sees:** a dashboard. Switching Today, Month or Year tweens every chart and counter to the new values in about 0.85 seconds. Hovering shows a tooltip that stays correct mid-morph.
- **Technique:** tweening numeric arrays each frame; count-up figures; the tooltip reads the live value.
- **Tested:** Today to Year on desktop; the tooltip fix.
- **Gaps:** the Month view, the full bars and donut, mobile. **Lesson:** a tooltip kept a stale value until the morph was fixed.

### 15. harp-audio-site
- **Visitor sees:** fourteen strings. Crossing one makes it vibrate and it plays a synthesised note. Keys A to V pluck strings. "Play for me" runs a melody.
- **Technique:** Web Audio oscillators with no sample files; a pentatonic note map; a click is required before sound starts, because browsers block audio until a gesture.
- **Tested:** strings vibrate and glow on desktop. The sound itself was not heard, because the preview pane has no audio.
- **Gaps:** keyboard keys, "Play for me", mute, touch.

### 16. harbor-daynight-site
- **Visitor sees:** one clock slider moves an illustrated harbour through dawn, midday, golden hour, dusk and night. The sun arcs and turns orange, the moon takes over, stars fade in, and a lighthouse beam sweeps.
- **Technique:** one time value drives the sky gradient, the sun and moon positions, star opacity and the labels. Waves and clouds run on their own timers.
- **Tested:** the slider at noon, golden hour, dusk and night, with labels correct.
- **Gaps:** "Play the day", dragging by hand, mobile. **Lessons:** hour labels were one phase off; a beam was brightest at its far end.

### 17. swipe-deck-site
- **Visitor sees:** a stack of dish cards. Drag right to fork, left to pass. A flick flies the card away spinning. A short drag springs back with overshoot. Undo flies the last card back. The end screen lists the choices.
- **Technique:** pointer drag with tilt from the drag distance; threshold and fling detection; spring-back; the stack grows as the top card leaves; an undo stack; a timer fallback when the animation-end event is missed.
- **Tested:** a right drag, a full run of eight cards, undo.
- **Gaps:** touch, arrow keys, "Start over", mobile.

### 18. lantern-reveal-site
- **Visitor sees:** an almost black room. A lantern follows the cursor with a slight lag and reveals the room in colour. Hidden objects glow when the light gets close, and the counter reads "x of 8 found".
- **Technique:** two copies of the scene (dark and bright) with the bright one shown through a moving circular mask; a flicker; proximity checks for discovery; an idle wander.
- **Tested:** discovery of two objects on desktop.
- **Gaps:** holding the button for a bigger light, the idle wander, finding all eight, touch, mobile.

### 19. splitflap-board-site
- **Visitor sees:** a railway-style departures board. Letters flip cell by cell through the alphabet and settle from left to right. The board changes day every 11 seconds. A flip-clock counts down to a date.
- **Technique:** each cell has a top and bottom flap that swing; a step through the alphabet; a staggered settle; a scheduled rotation; screen readers get a plain-text version of the lineup.
- **Tested:** the lineup text for three days; the countdown digits; console clean.
- **Gaps:** the real-time flip speed (the preview pane runs slowly), mobile. **Lessons:** the cell's `.top` class picked up the page header's `.top` style, and a countdown rule `.unit span` shrank every digit.

### 20. variable-type-site
- **Visitor sees:** letters that grow heavier and wider as the cursor gets close, with a slow idle wave. A type tester has weight, width and size sliders, and "Surprise me" glides them to random values.
- **Technique:** per-letter variation axes of one free variable font (Anybody, from Google Fonts), set from cursor distance; tweened sliders.
- **Tested:** the hover swell and "Surprise me" on desktop.
- **Gaps:** dragging the sliders by hand, touch. **Known issue:** 5 px horizontal overflow at 375 px wide.

### 21. holo-tilt-site
- **Visitor sees:** trading-card style cards that lean towards the pointer, lift, and show a glare and a rainbow foil. Each card's art has three layers that shift at different speeds. Tabbing onto a card sweeps the light across it once.
- **Technique:** pointer position mapped to rotation (about 15° at most); glare position and foil gradient set through CSS variables; parallax layers.
- **Tested:** the tilt, glare, foil and lift values on one card, console clean.
- **Gaps:** the keyboard sweep, touch, mobile. The foil was softened after testing and not re-checked.

### 22. orrery-orbit-site
- **Visitor sees:** a planetarium. Planets orbit a sun on flattened orbits at their real year lengths. A time slider runs from under one to about 400 days per second. Picking a planet makes the camera ease towards it and follow it.
- **Technique:** a simulated day clock drives every position; the camera eases towards a moving target; an info panel.
- **Tested:** the overview, and the Earth fly-in with the panel values.
- **Gaps:** other planets, pause, the slider by hand, keyboard, mobile.

### 23. before-after-renovation-site
- **Visitor sees:** one room with a draggable handle. Left of the handle is the bare "before", right is the furnished "after". The handle makes one sweep on load and then settles in the middle. Arrow keys, Home and End move it.
- **Technique:** two SVG illustrations in one frame. The "before" layer sits on top and is clipped with `clip-path: inset(0 calc(100% - var(--pos)) 0 0)`, where `--pos` is set by the pointer or the keyboard. The handle is a `role="slider"` with `aria-valuenow`.
- **Tested:** drag to 20%, arrow keys, Shift plus arrow, Home and End, reduced motion (no sweep), 375 px (no overflow), console clean.
- **Gaps:** touch dragging on a real device, a second room, and a real photo pair (the illustrations are invented on purpose).

### 24. pinned-buying-story-site
- **Visitor sees:** five chapters on the left and one sticky route on the right. As each chapter reaches the middle of the screen, the route line draws to its stop, the stop fills, and the caption changes to that step.
- **Technique:** `position: sticky` on the stage (the one pinned element), an IntersectionObserver with a band across the middle of the viewport to pick the active chapter, and a stroke drawn with `stroke-dashoffset`. Below 860 px the stage is no longer pinned and sits above the chapters.
- **Tested:** all five chapters at desktop (step, stops and caption correct), 375 px (no overflow, step updates), reduced motion (caption changes at once).
- **Gaps:** touch scrolling on a real device, and the route on very short screens.

### 25. flip-listing-site
- **Visitor sees:** six property cards. Each has an illustrated house and a price on the front. Flipping a card shows the facts on the back, with "Book a viewing". "Show all details" flips all six in a wave and announces the change.
- **Technique:** `rotateY(180deg)` on a preserve-3d flipper with two backface-hidden faces. The hidden face gets the `inert` attribute, and keyboard focus moves to the visible face's button when a card flips. The wave is a `transition-delay` set from `--i`.
- **Tested:** one card flip (focus moves, inert states correct), "Show all details" (six cards flipped, status and button label updated), 375 px (no overflow), reduced motion (no turning, a fade instead), console clean.
- **Gaps:** touch on a real device, and the wave timing on slow machines.
