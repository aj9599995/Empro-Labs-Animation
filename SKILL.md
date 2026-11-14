---
name: empro-labs-animations
argument-hint: "[animation mechanic to build, e.g. layered stack, scroll tunnel, or a new idea]"
description: Builds distinct web animation mechanics as small, self-contained HTML, CSS and JavaScript pages, and keeps a catalogue of 22 tested examples. Use when the user asks for a different type of animation, a new animation style, a reference-style hover or scroll effect (such as a layered 3D stack, a scroll tunnel or a split-flap board), or a demo of an animation mechanic for a real estate or other business site. Not for production frameworks, backend work or video rendering.
---

# Empro Labs Animation

Builds one animation mechanic per page. Each page is a local, self-contained demo with placeholder brand copy, so it can be adapted to any business, including real estate.

## Request

The user's request from the slash command:

$ARGUMENTS

If the request above is empty, ask one question: which mechanic should we build, or which reference should we learn from? Then start the workflow below.

## Rules

1. **One mechanic per page.** Check `references/mechanics-catalogue.md` first. Do not repeat a mechanic unless the user asks for it. If you do repeat one, say how the new page differs.
2. **Recreate a mechanic, do not copy it.** When the user points to a reference site, study the behaviour and the technique, then write new code, copy and layout. Never copy another site's code, text, logo, fonts or images.
3. **Placeholder brand.** Use "Placeholder Brand" copy unless the user supplies their own brand. Do not add emails, phone numbers, client names or real figures.
4. **Local only.** Serve pages on localhost. Do not connect to GitHub, Vercel or any other host unless the user asks.
5. **Test before reporting.** The console must be clean, the interaction must work, a 375 px wide phone layout must not scroll sideways, and reduced motion must be checked. Say what you did not test.
6. **Unique ids and prefixed class names.** Generic names such as `.top` or `.unit span` break pages. See `references/build-and-test-process.md`.

## Workflow

1. **Pick the mechanic.** Take it from the request. Check the catalogue for an overlap. For a layered or stacked 3D hover effect, read `references/layered-stack-hyperframe.md`.
2. **Create a folder** named `<mechanic>-site/` with `index.html`, `styles.css` and `script.js`. Keep the three-file shape of the examples.
3. **Build the mechanic** with a desktop layout (1440 px) and a phone layout (375 px).
4. **Serve it** with `python -m http.server 8000` inside the folder, then open http://localhost:8000.
5. **Test it** as described in `references/build-and-test-process.md`.
6. **Report** with the template below.
7. **Keep it** by adding the mechanic to the catalogue and to `examples/`, if the user wants it kept.

### Report template

```
Open it: http://localhost:<port> (files in <folder>)
What it is: <the made-up brand and what the page is for>
The animation: <the mechanic in plain words, and how the user drives it>
Checked: <what you saw working, and the console result>
Not tested: <what you did not check>
```

## References

| File | Read when |
|------|-----------|
| `references/mechanics-catalogue.md` | Step 1, to avoid repeats and find the closest example |
| `references/layered-stack-hyperframe.md` | The request is for a layered or stacked 3D hover effect |
| `references/build-and-test-process.md` | Steps 3 to 6 |

## Examples

`examples/` holds 22 runnable demos. To try them, run `python -m http.server 8000` inside `examples/`, then open a folder, for example http://localhost:8000/layered-stack-hyperframe/.

## Fallback chain

- The user names a reference but gives no page to study → ask for the URL or a screen recording. Do not guess the mechanic from the name.
- A mechanic needs a feature the browser lacks (WebGL, Web Audio, scroll-driven CSS) → build the fallback first, then the feature, and say which browsers were tested.
- No request at all → propose two mechanics from the catalogue that have not been built yet, and ask which one.
