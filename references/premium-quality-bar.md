# Premium Quality Bar

A page is finished when it passes every item in the "must" list and at least eight of the ten "should" items. Score the page in the report. A failed "must" means the page is not finished.

## Must (every page)

1. **One signature moment.** One animation the visitor will remember. The rest is calm.
2. **Readable without motion.** With JavaScript off or reduced motion on, the content is complete and in order.
3. **No console errors** (font requests excepted when offline).
4. **No horizontal scroll at 375 px.** Measured with `scrollWidth - innerWidth = 0`.
5. **The input works on touch and keyboard** as well as the pointer, or the page says which input it needs.
6. **Reduced motion respected.** Loops stop. Movement goes. Essential state changes stay.
7. **Unique ids and prefixed class names.** No generic class that collides with the page.
8. **Honest labels.** A made-up brand is marked as a concept. Demo numbers are marked as invented.
9. **Contrast 4.5:1 or better** for body text, and visible focus on every control.
10. **The mechanic is new.** It passes the novelty check in `thinking-process.md` and is logged in `used-designs.md`.

## Should (aim for eight of ten)

1. The display font fits the concept and is not in the last three pages.
2. Accent colour used on fewer than three surfaces.
3. Intro under 2.5 s, skippable with a click or key.
4. Timings from one easing family, with micro feedback under 250 ms.
5. Animations only on `transform` and `opacity`, except a short underline or a canvas or WebGL effect.
6. Loops and timers paused when off screen.
7. A text alternative for any visual-only information (for example the split-flap lineup as plain text).
8. The signature moment still works at 375 px, with a simpler input if needed.
9. Copy that sounds like a real business, with specific nouns and no filler.
10. The page was measured in a real browser at two sizes (1440 px and 375 px), and the result is in the report.

## Performance budget

- Keep the main thread free: no more than one heavy effect per page (a WebGL canvas, a particle system with thousands of points, or a physics loop).
- Limit animated elements to about 30 at once. Batch the rest.
- Use `will-change` only during an animation.
- Test with a 4x CPU slowdown in DevTools if the page has a canvas or WebGL.

## Anti-patterns that fail the bar

- Several effects that all fire on load.
- A hero with a gradient background, three feature cards and a generic "Get started" button.
- Text hidden until a script runs (content must show without JavaScript).
- An animation that hides the information the visitor needs.
- Layout that breaks when the animation is mid-way (check the settled state).
- Unexplained icons, low-contrast small print, and tiny buttons on touch.
- A page that works only in one browser, without a fallback that says so.

## Report template

```
Score: <n> of 10 must, <m> of 10 should
Open it: http://localhost:<port> (folder <name>)
What it is: <made-up brand, category, concept label>
The animation: <signature moment, input, reduced-motion behaviour>
Checked: <desktop, 375 px, keyboard, reduced motion, console, overflow>
Not tested: <what was not checked, and why>
Logged: <yes, row added to used-designs.md / no, not kept>
```
