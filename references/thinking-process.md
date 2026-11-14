# Thinking Process: How to Design a New Animation

This is how the agent invents a mechanic that is not in the examples, and how it justifies the choice. Follow it for every new page. It replaces guessing with a repeatable method.

## 1. Read the state first

- Open `used-designs.md`. Note which mechanic families, display fonts and palettes already appear. Do not repeat a family, a display font or a palette from the last three pages unless the user asks for it.
- Open `mechanic-library.md`. Choose either an idea marked **not built**, or a combination of two built families that adds a new input or a new visual idea.

## 2. Build the three ingredients

Every new mechanic is **Primitive + Purpose + Input**.

- **Primitive** is the physical or interaction idea. Examples: inertia, magnetism, flip, unfold, tilt, light or a spotlight, fluid, gravity, sound, time (scrubbing), morph, decode or typing, split and merge, depth, mask and reveal, spring tension, drawing a stroke, a mechanical display, a camera move.
- **Purpose** is what the visitor must understand or do in that section. For real estate, see `real-estate-applications.md`: compare before and after, feel a neighbourhood, see a price trend, pick a viewing time, read a floor plan.
- **Input** is how the visitor drives it: pointer hover, drag, scroll, keys, touch, click, a slider, time, or sound.

**Test:** the primitive must explain the purpose. If you could swap the animation for a different one and nothing about the message would change, it is decoration. Rework it.

## 3. Novelty check

Pass all three before you build:

1. The primitive is not in `used-designs.md`, or it is used with a new input and a new visual idea.
2. The display font and the accent colour differ from the last three pages.
3. Every line of code, copy and visual is written for this page. Nothing is copied from a reference site.

## 4. Sketch before code

Write a short sketch in the reply or in a notes block. Use these lines:

- **Visitor and goal:** who is on this section and what should they do or understand?
- **Primitive:** one sentence.
- **Input:** pointer, scroll, keys, touch or time. For touch, the gesture that replaces hover.
- **Signature moment:** the one thing that will be remembered. There is only one per page.
- **Supporting motion:** the calm motion around it (reveals, hover states).
- **Fallbacks:** no JavaScript, no WebGL, reduced motion, small screens.

## 5. Build with restraint

- **One signature moment per page.** Everything else supports it or stays still.
- **Timing:** micro feedback 120 to 250 ms. Transitions 250 to 500 ms. Signature moments 600 to 1200 ms. Intro under 2.5 s in total, and it can be skipped with a click or key.
- **Easing:** entrances ease out, exits ease in, and UI movement is never linear. Use one easing family per page.
- **Layout first.** The page must read correctly with no motion. Then add motion.
- **Unique names.** Every id is unique. Class names carry the page's prefix (see `build-and-test-process.md`).

## 6. Verify and judge

Run the test checklist in `build-and-test-process.md`. Then judge the page against `premium-quality-bar.md`. A page that passes the tests but fails the premium bar is not finished. Fix it, or say which items remain.

## 7. Report honestly

Use the report template in `SKILL.md`. State what you checked and what you did not check. Give the port and the folder.

## Studying a reference (only when the user shows one)

1. Read the page's structure and script. Use the source only to study, never to copy.
2. Map the hero: the elements, their ids and classes, and which functions handle hover, click, scroll and the intro.
3. Trace each state: idle, hover or preview, the transition between states, the click or open action, and the reduced-motion path.
4. Note the CSS techniques: 3D transforms, transitions, keyframes, and any scroll-linked rules.
5. Write a summary in your own words. Give the primitive, the states, the timing values, the fallbacks, and what makes it feel premium.
6. Build your own version with your own code, copy and brand (placeholder). Do not copy code, text, images or fonts that are not free to use.
7. Compare the two only for behaviour. The look should be different.

Example of this procedure: `layered-stack-hyperframe.md`.

## Combining ideas

Pick one entry from each column and check that the result passes the novelty test.

| Primitive | Input | Purpose (real estate) |
|-----------|-------|------------------------|
| Inertia | Drag and fling | Browse a photo set |
| Magnetism | Pointer | Pull the eye to a booking button |
| Light (spotlight) | Pointer | Reveal hidden details on a plan |
| Mechanical display | Time | Show open-house times |
| Scrub (time or value) | Slider | Show how a payment changes |
| Morph | Filter buttons | Re-sort listings without jumping |
| Draw on scroll | Scroll | Show a price trend |
| Mask (before and after) | Drag | Show a renovation |

## Anti-patterns to avoid

- Motion that starts on load and never stops (no pause, no reduced motion).
- Several signature effects on one page.
- An animation that hides the text the visitor needs.
- Effects that are only visible on desktop, with no touch or keyboard path.
- Copying a reference's look because it worked there.
