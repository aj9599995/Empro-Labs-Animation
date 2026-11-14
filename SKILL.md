---
name: empro-labs-animations
argument-hint: "[animation to build, a reference to study, or a real estate section to animate]"
description: Designs and builds new, premium web animation mechanics as small self-contained pages. Uses a knowledge base of 22 tested examples, a mechanic library, a design language, a technique cookbook, real estate applications and a quality bar, so it can invent new animations beyond the examples. Use when the user asks for a different or new animation, a premium or high-end animated website or section, a reference-style hover, scroll or motion effect, or an animation for a real estate or other business site. Not for production frameworks, backend work or video rendering.
---

# Empro Labs Animation

Designs and builds one new animation mechanic per page. Each page is a local, self-contained demo with placeholder brand copy, so it can be adapted to any business, including real estate.

## Request

The user's request from the slash command:

$ARGUMENTS

If the request above is empty, ask one question: which mechanic or section should we build, or which reference should we learn from? Then start the workflow.

## Knowledge base (read it, do not guess)

| File | Read when |
|------|-----------|
| `references/thinking-process.md` | Always, before choosing a mechanic. How to invent one and justify it |
| `references/used-designs.md` | Always. Families, fonts and palettes already used, so you do not repeat them |
| `references/mechanic-library.md` | Always. 22 built families and about 30 tested ideas not yet built |
| `references/design-language.md` | Step 3. Type pairing, palette, layout and copy rules, and what to avoid |
| `references/technique-recipes.md` | Step 4. Working building blocks: tilt, FLIP, particles, physics, WebGL, audio and more |
| `references/real-estate-applications.md` | When the brief is for a real estate or property section |
| `references/premium-quality-bar.md` | Step 6. The must and should list, and the report template |
| `references/build-and-test-process.md` | Steps 5 and 6. Naming rules, test checklist, bugs seen before |
| `references/mechanics-catalogue.md` | When you need the details of an existing example |
| `references/layered-stack-hyperframe.md` | The request is a layered or stacked 3D hover effect |

## Rules

1. **Invent, do not repeat.** Pick a mechanic family that is not in `used-designs.md`, or change the input and the visual idea enough to pass the novelty test in `thinking-process.md`.
2. **Recreate, do not copy.** When the user points to a reference site, study its behaviour and technique, then write new code, copy and layout. Never copy another site's code, text, logo, fonts or images.
3. **Placeholder brand.** Use invented brand copy unless the user supplies a brand. Do not add emails, phone numbers, client names or real figures. Label every demo as a concept.
4. **Local only.** Serve pages on localhost. Do not connect to GitHub, Vercel or any other host unless the user asks.
5. **One signature moment per page.** Everything else stays calm.
6. **Test before reporting.** No console errors, the interaction works, a 375 px screen has no sideways scroll, reduced motion is handled, and the content reads with no motion. Say what you did not test.
7. **Unique ids and prefixed class names.** Generic names such as `.top` or `.unit span` break pages.

## Workflow

1. **Read the knowledge base** for the request: `thinking-process.md`, `used-designs.md`, `mechanic-library.md`.
2. **Sketch** the page in the reply: visitor and goal, primitive, input, signature moment, supporting motion, fallbacks. Use `thinking-process.md` section 4.
3. **Choose the design language:** a display font not used in the last three rows of `used-designs.md`, one accent colour, a palette with 4.5:1 text contrast. Use `design-language.md`.
4. **Create the folder** `<mechanic>-site/`. Copy `templates/starter-site/` into it, then replace the copy, palette, fonts and the signature moment. Build the mechanic from `technique-recipes.md`.
5. **Serve and test** with `python -m http.server <port>` inside the folder. Use the next free port from 8000 upward. Run the checklist in `build-and-test-process.md` at 1440 px and 375 px.
6. **Judge** against `premium-quality-bar.md`. Fix any failed must item before you report.
7. **Report** with the template in `premium-quality-bar.md`.
8. **Log it:** if the user keeps the page, add a row to `used-designs.md` and, if it is a new family, mark it built in `mechanic-library.md`.

## Examples

`examples/` holds 22 runnable demos, including the neutral layered-stack example. To try them, run `python -m http.server 8000` inside `examples/`, then open a folder, for example http://localhost:8000/layered-stack-hyperframe/.

## Templates

| Folder | Use |
|--------|-----|
| `templates/starter-site/` | Starting point for every new page. Layout, tokens, reveals, tilt and reduced motion already wired in |

## Fallback chain

- The user names a reference but gives no page to study → ask for the URL or a screen recording. Do not guess the mechanic from the name.
- A mechanic needs a feature the browser lacks (WebGL, Web Audio, scroll-driven CSS) → build the fallback first, then the feature, and say which browsers were tested.
- No request at all → propose two families from `mechanic-library.md` that are not built yet, and ask which one.
- The request is for a real property (real listings, real prices, real photos) → use placeholder data, say so, and ask for the real content before it goes live.
