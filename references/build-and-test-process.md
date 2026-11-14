# Build and Test Process

How each demo in this skill was built and checked. Follow the same steps so reports stay consistent.

## Setup

- Three files per page: `index.html`, `styles.css`, `script.js`. Add assets only when a demo needs them.
- Fonts come from Google Fonts. Pages need an internet connection for fonts. Everything else is local.
- Serve over HTTP. Opening `index.html` directly (`file://`) can show a static snapshot, so the scripts do not run. Use `python -m http.server <port>` inside the folder.
- Give each demo its own port, or serve one folder at a time.

## Build order

1. Write the layout first, with plain text, so the page reads correctly with no motion.
2. Add the mechanic in its own function or block, driven by one state object.
3. Add the controls (buttons, keys, sliders) after the mechanic works.
4. Add reduced-motion handling and the phone layout.

## Naming

- Give every id a unique name. Two elements with one id break scripts silently.
- Prefix class names with the demo's name, or use specific names such as `.cell-top` rather than `.top`. Generic names pick up rules from the page header and other sections.
- Check every selector against the whole page. A rule such as `.unit span` matches every span inside the unit, not only the label.

## Performance and motion

- Animate `transform` and `opacity`. Avoid animating `width`, `height`, `top` and `left`. Use `scaleX` for an underline that grows.
- For a WebGL canvas, render at a lower resolution (for example 60%) and provide a plain fallback with no WebGL.
- For sound, start the audio context only after a click, because browsers block audio until there is a gesture.
- For scroll-driven CSS, check current browser support on MDN before you promise it, and show a readable static page where it is missing.

## Test checklist

Run every item and record the result.

1. **Load.** Open the page with the local server. Check the console for errors (ignore only failed font requests).
2. **Settle.** Wait for the intro and any timed loops to finish. Judge the layout only after everything has settled. A screenshot taken mid-transition can show a broken layout that is really just timing.
3. **Each control.** Hover, click, drag, scroll, keys, buttons, sliders. Note the ones you did not run.
4. **Desktop 1440 px.** Check the layout and the mechanic.
5. **Phone 375 px.** Check that the page does not scroll sideways. Measure with `document.documentElement.scrollWidth - window.innerWidth`, which should be 0.
6. **Reduced motion.** Emulate `prefers-reduced-motion: reduce` and check that movement stops and the content stays visible.
7. **Real timing.** The preview pane may draw few frames. When a check depends on speed, confirm the animation state with `document.getAnimations()` or a JavaScript timer, not with a screenshot.

## Lessons from the sessions

| Symptom | Cause | Fix |
|---------|-------|-----|
| Script finds the wrong element | Two elements shared one `id` | Give each id one owner |
| Layer has zero size | Absolutely positioned child inside a centred grid | Set an explicit `inset` or size |
| Horizontal scroll on phones | Glow or shadow wider than the viewport | Size the glow to the scene. Do not add a global `overflow` hide |
| Heading does not reveal | Observer watches clipped child elements | Observe the layout parent |
| Hover causes a stutter | Underline animates `width` | Use `scaleX` |
| Screen reader chatter on hover | `aria-live` on text that changes on every hover | Only announce real status changes |
| Tooltip shows an old value mid-animation | Value read once, before the tween finishes | Read the live value on every frame |
| Deck stays locked | `animationend` never fired | Add a timer fallback |
| Word clips at the edges | Width estimated instead of measured | Measure the word in a hidden element |
| Digits shrink to 12 px | Generic label rule matched every span | Scope the rule to the direct child |
| Cell top half looks empty | Page `.top` rule applied to the cell | Rename the class |
| Screenshot shows a half-finished frame | Animation still running | Wait for the animation to finish, then capture |

## Reporting

Use the template in `SKILL.md`. Always include the **Not tested** line. Earlier sessions reported only what they had seen, and that was the right habit.
