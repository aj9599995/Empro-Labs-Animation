# Empro Labs Animation

**A Claude Code skill that designs and builds new, premium web animation mechanics.**

It comes with a knowledge base, not only examples. Claude uses the mechanic library, the design language, the technique recipes and the quality bar to invent new animations, so it is not limited to the 22 demos in the repo.

Each demo is a small, self-contained page (HTML, CSS and JavaScript, no build step) that shows one animation mechanic on a made-up brand. Use them to pick a style for a real estate or other business site, or to ask Claude to build a new one.

## Install in one line

You need [Claude Code](https://claude.com/claude-code) and [Git](https://git-scm.com). Paste one line into your terminal.

**Windows (PowerShell)**

```powershell
$d = "$env:USERPROFILE\.claude\skills\empro-labs-animations"; if (Test-Path "$d\.git") { git -C $d pull --ff-only } else { git clone https://github.com/aj9599995/Empro-Labs-Animation $d }
```

**Mac, Linux or Git Bash**

```bash
d="$HOME/.claude/skills/empro-labs-animations"; if [ -d "$d/.git" ]; then git -C "$d" pull --ff-only; else git clone https://github.com/aj9599995/Empro-Labs-Animation "$d"; fi && echo "Installed. Type /empro-labs-animations in Claude Code."
```

Then type `/` in Claude Code and choose **empro-labs-animations**. Add your request after it, for example:

- `/empro-labs-animations build a before and after renovation slider for a property page`
- `/empro-labs-animations make a premium neighbourhood map flyover for a real estate site`

- If the command does not appear, run `/reload-skills`, or restart Claude Code.
- Works in Claude Code: the terminal CLI, the desktop app and the IDE extensions. Other chat apps do not read this folder.
- **Update:** paste the same line again.
- **Remove:** delete the folder `~/.claude/skills/empro-labs-animations`.

## What the skill knows

| File | What it gives Claude |
|------|----------------------|
| `references/thinking-process.md` | How to invent a mechanic: primitive, purpose and input, a novelty check and a sketch |
| `references/mechanic-library.md` | 22 built families and about 30 tested ideas not yet built, each with a technique and a fallback |
| `references/used-designs.md` | Every page built so far, with its font, palette and family, so new pages do not repeat |
| `references/design-language.md` | Type pairing, colour, layout and copy rules, and the patterns to avoid |
| `references/technique-recipes.md` | 22 working building blocks: tilt, FLIP, particles, physics, WebGL, audio, scroll, page turn and more |
| `references/real-estate-applications.md` | Which mechanic suits which property section, and what to check |
| `references/premium-quality-bar.md` | The must and should list, the performance budget and the report template |
| `references/build-and-test-process.md` | Naming rules, the test checklist, and the bugs seen while building |
| `references/mechanics-catalogue.md` | Details of each example: what was tested and what was not |
| `references/layered-stack-hyperframe.md` | The layered 3D hover stack, described in general terms |
| `templates/starter-site/` | A starting page with layout, tokens, reveals, tilt and reduced motion already wired in |

## Try the examples

```bash
cd empro-labs-animations/examples
python -m http.server 8000
```

Open http://localhost:8000 and choose a folder, for example `layered-stack-hyperframe/`. Pages load fonts from Google, so they need an internet connection.

| # | Folder | Mechanic |
|---|--------|----------|
| 1 | `layered-stack-hyperframe` | Layered 3D stack that fans on hover |
| 2 | `ring-tea-site` | Rotating 3D ring of frames |
| 3 | `depth-rail-site` | Scroll-driven flight through a 3D tunnel |
| 4 | `particle-studio-site` | Canvas particles that form words |
| 5 | `trail-draw-site` | SVG trail drawn by scrolling |
| 6 | `swatch-flip-site` | Layout (FLIP) transitions and a tile that expands |
| 7 | `reel-inertia-site` | Momentum carousel |
| 8 | `gumdrop-physics-site` | Falling, colliding, throwable objects |
| 9 | `terminal-type-site` | Typed commands and text decoding |
| 10 | `goo-juice-site` | Gooey liquid cursor |
| 11 | `almanac-css-site` | CSS-only scroll-driven animation |
| 12 | `shader-scent-site` | WebGL shader colour field |
| 13 | `recipe-book-site` | 3D page-turning book |
| 14 | `ledger-morph-site` | Charts that morph between data sets |
| 15 | `harp-audio-site` | Strings that sound (Web Audio) |
| 16 | `harbor-daynight-site` | One slider drives a scene through a day |
| 17 | `swipe-deck-site` | Swipe deck with fling and undo |
| 18 | `lantern-reveal-site` | Spotlight reveal |
| 19 | `splitflap-board-site` | Split-flap display |
| 20 | `variable-type-site` | Cursor-driven variable font |
| 21 | `holo-tilt-site` | Pointer 3D tilt with holographic foil |
| 22 | `orrery-orbit-site` | Orbital simulation with a camera that follows |

## Known issues

- `swatch-flip-site` overflows horizontally by 37 px on a 375 px screen.
- `variable-type-site` overflows horizontally by 5 px on a 375 px screen.
- Most demos were tested on desktop only. Check touch, keyboard and reduced motion before you ship one.
- The demos are concepts. Replace the placeholder copy, colours and fonts before using any of them on a live site.

## Layout

```
Empro-Labs-Animation/
├── SKILL.md                          # the skill (instructions for Claude)
├── README.md                         # this file
├── LICENSE                           # MIT
├── references/                       # the knowledge base
│   ├── thinking-process.md
│   ├── mechanic-library.md
│   ├── used-designs.md
│   ├── design-language.md
│   ├── technique-recipes.md
│   ├── real-estate-applications.md
│   ├── premium-quality-bar.md
│   ├── build-and-test-process.md
│   ├── mechanics-catalogue.md
│   └── layered-stack-hyperframe.md
├── templates/
│   └── starter-site/                 # index.html, styles.css, script.js
└── examples/                         # 22 runnable demos, including the layered stack
```

## License

[MIT](./LICENSE)
