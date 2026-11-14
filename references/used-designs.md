# Used Designs

A log of every page built so far, so new pages do not repeat a family, a display font or a palette. Update it whenever a page is kept. Fonts are read from each example's files. Where a page uses a second font or a palette detail from the session, it is noted as such.

Rules before you build:

- The mechanic family must be new, or the input and visual idea must differ enough to pass `thinking-process.md` step 3.
- The display font must not appear in the last three rows.
- Avoid the accent colour of the last three rows.

| # | Folder | Made-up brand | Family | Display font (secondary) | Base / ink / accent | Port |
|---|--------|---------------|--------|--------------------------|---------------------|------|
| 1 | `layered-stack-hyperframe` | Placeholder Brand (originally a branded trades site) | Layered 3D stack | Archivo (JetBrains Mono) | #14161a ink, #f2c94c accent (original brand accent was lime) | 8000 |
| 2 | `ring-tea-site` | Kettle & Cloud | 3D carousel ring | Fraunces | #2b2b33 base, #f6f1e8 ink, #e8d9c0 accent | 8001 |
| 3 | `depth-rail-site` | Meridian Night Rail | Scroll tunnel | Space Grotesk (IBM Plex Mono) | #f2efe6 paper, #111111 ink, red accent | 8002 |
| 4 | `particle-studio-site` | Murmur | Canvas particle morph | Syne | #0b0f2a base, #eef0ff ink, #ff6b6b accent (coral, yellow, mint per word) | 8003 |
| 5 | `trail-draw-site` | Switchback | Stroke drawn by scroll | Bricolage Grotesque (Manrope) | sage paper, #1d2a1f ink, orange accent | 8004 |
| 6 | `swatch-flip-site` | Pigment & Pail | FLIP layout and expand | Instrument Serif (Familjen Grotesk) | #faf6ef paper, #1b1a18 ink | 8005 |
| 7 | `reel-inertia-site` | Late Reel | Momentum carousel | Anton (Space Mono) | #0d0d0f base, #f4efe6 ink | 8006 |
| 8 | `gumdrop-physics-site` | Gumdrop Labs | Physics pile | Rubik | #ffe9e1 pink base, #2a1730 ink | 8007 |
| 9 | `terminal-type-site` | Parsec CLI | Typed terminal and decode | JetBrains Mono | #14110c amber base, #07120b phosphor variant | 8008 |
| 10 | `goo-juice-site` | Squeeze & Co. | SVG gooey cursor | Unbounded | #fff4d6 cream, #231a0d ink, orange and yellow | 8009 |
| 11 | `almanac-css-site` | The Garden Almanac | CSS scroll-driven | Playfair Display (Karla) | #f3ecd8 paper, #1f2a1c ink, terracotta | 8010 |
| 12 | `shader-scent-site` | Maison Nocturne | WebGL shader | Cormorant Garamond (Jost) | dark field, scent palettes | 8011 |
| 13 | `recipe-book-site` | Salt & Ladle | 3D page turn | Josefin Sans (Lora) | #fbf4e4 paper, #2e2118 ink, red cloth | 8012 |
| 14 | `ledger-morph-site` | Crumb & Co. Ledger | Morphing charts | Outfit (DM Mono) | #f4f6fa base, #10213a ink, coral accent | 8013 |
| 15 | `harp-audio-site` | Harp & Hum | Sound-reactive strings | Fraunces | #0c0a1f indigo, purple glow | 8014 |
| 16 | `harbor-daynight-site` | Gull Cove Inn | Scene driven by one value | Young Serif (Figtree) | #f6f1e7 cream, #1d2433 ink, orange | 8015 |
| 17 | `swipe-deck-site` | Fork or Pass | Swipe deck with undo | Bagel Fat One | #fff1dc cream, #2b1a12 ink | 8016 |
| 18 | `lantern-reveal-site` | The Night Gallery | Spotlight reveal | Cinzel (Work Sans) | near-black room, warm amber light | 8017 |
| 19 | `splitflap-board-site` | Moonrise Festival | Split-flap display | Roboto Mono (Archivo Narrow) | #14110e board, #f3ead6 flap, brass frame | 8018 |
| 20 | `variable-type-site` | Stretch & Co. | Variable font proximity | Anybody (Inter) | #f5e63c yellow, #12100c ink | 8019 |
| 21 | `holo-tilt-site` | Hatchling Cards | Pointer 3D tilt with foil | Lilita One | #1b1030 purple, #ffffff ink, foil colours | 8020 |
| 22 | `orrery-orbit-site` | The Orrery | Orbital camera follow | Syne (Manrope) | #070b1a navy, #eef2ff ink | 8021 |
| 23 | `before-after-renovation-site` | Quillfield Renovations | Before and after mask with intro sweep | Big Shoulders Display (Hanken Grotesk) | #0e2b24 deep green, #eef5ef ink, #ffb86b apricot | served from `examples/` |
| 24 | `pinned-buying-story-site` | Marrow & Co. Property | Pinned scrollytelling route | Sora (Source Sans 3) | #f7f5f0 off-white, #1b1b1f ink, #2f5bff electric blue | served from `examples/` |
| 25 | `flip-listing-site` | Tallow Row Estates | Flip cards with a wave | Italiana (IBM Plex Sans) | #f6e7e3 dusty rose, #2c1a1e ink, #a8324a deep rose | served from `examples/` |

## Repeats to watch

- **Fraunces** is the display font of rows 2 and 15.
- **Syne** is the display font of rows 4 and 22.
- **Dark navy, indigo or deep green** backgrounds appear in rows 4, 15, 21, 22 and 23.
- **Cream or paper** backgrounds appear in rows 1, 3, 5, 6, 10, 11, 13, 14, 16, 17, 19 and 25.
- **Electric blue, rose and apricot** accents are each used once, in rows 24, 25 and 23.

Next pages should favour a display font not listed above, and a background family that is under-used (for example a saturated colour field, or a deep green).

## Families not yet used

Use `mechanic-library.md` Part 2 for these. They are candidates for the next page: magnetic button, ripple, parallax depth layers, horizontal pinned track, bento reveal, clip-path wipe, odometer count-up, stroke icon draw, magnifier lens, cover-flow carousel, calendar slot select, area map flyover, shared-element transition. Pinned scrollytelling, before and after, and flip cards are built (rows 23 to 25).

## How to add a row

When a page is kept, add a row with the same columns. Fill the font from the page's stylesheet, the colours from its variables, and the port from the server you used. If a page was rejected or deleted, say so in the row rather than removing it.
