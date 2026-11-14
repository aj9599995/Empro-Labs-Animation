# Real Estate Animation Mechanics

**A Claude Code skill that builds distinct web animation mechanics, with 22 tested demos.**

Each demo is a small, self-contained page (HTML, CSS and JavaScript, no build step) that shows one animation mechanic on a made-up brand. Use them to pick a style for a real estate or other business site, or to ask Claude to build a new one.

The skill began as a conversation about a layered 3D hover effect on a real estate site. It then built a range of other mechanics, which are kept here as examples.

## Install in one line

You need [Claude Code](https://claude.com/claude-code) and [Git](https://git-scm.com). Paste one line into your terminal.

**Windows (PowerShell)**

```powershell
$d = "$env:USERPROFILE\.claude\skills\real-estate-animation-mechanics"; if (Test-Path "$d\.git") { git -C $d pull --ff-only } else { git clone https://github.com/aj9599995/Real-Estate-Animation-Mechanics $d }
```

**Mac, Linux or Git Bash**

```bash
d="$HOME/.claude/skills/real-estate-animation-mechanics"; if [ -d "$d/.git" ]; then git -C "$d" pull --ff-only; else git clone https://github.com/aj9599995/Real-Estate-Animation-Mechanics "$d"; fi && echo "Installed. Type /real-estate-animation-mechanics in Claude Code."
```

Then type `/` in Claude Code and choose **real-estate-animation-mechanics**. Add your request after it, for example `/real-estate-animation-mechanics build a split-flap board for an open-house schedule`.

- If the command does not appear, run `/reload-skills`, or restart Claude Code.
- Works in Claude Code: the terminal CLI, the desktop app and the IDE extensions. Other chat apps do not read this folder.
- **Update:** paste the same line again.
- **Remove:** delete the folder `~/.claude/skills/real-estate-animation-mechanics`.

## Try the examples

```bash
cd real-estate-animation-mechanics/examples
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
real-estate-animation-mechanics/
├── SKILL.md                         # the skill (instructions for Claude)
├── README.md                        # this file
├── LICENSE                          # MIT
├── references/
│   ├── mechanics-catalogue.md       # the 22 mechanics, with what was tested and the gaps
│   ├── layered-stack-hyperframe.md  # how the layered 3D stack works, in general terms
│   └── build-and-test-process.md    # build steps, test checklist, lessons learned
└── examples/                        # 22 runnable demos (HTML, CSS, JavaScript)
```

## License

[MIT](./LICENSE)
