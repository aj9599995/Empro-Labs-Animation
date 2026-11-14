# Design Language

How the examples look, and the rules that keep new pages premium and distinct. Use it to choose type, colour, layout and copy. The per-page log is in `used-designs.md`.

## Brand and copy

- **Made-up brand, clearly labelled.** Each demo has a short invented name and a category ("a made-up tea house", "a made-up type foundry"). Say it is a concept, in the corner or the footer.
- **Real-feeling copy.** One concrete line beats three vague ones. Name the thing: a dish, a town, a planet, an instrument. Keep sentences short.
- **Placeholder facts.** Numbers and dates in demos are invented, and the page says so. For a real site, replace them and date them.
- **Plain headings.** Use the words a visitor would search for. Avoid "Unlock", "Elevate" and "Seamless".

## Typography

Pick three roles.

| Role | Job | Examples used |
|------|-----|---------------|
| Display | Headline, carries the personality | Syne, Fraunces, Bagel Fat One, Anton, Cinzel, Playfair Display, Unbounded, Lilita One, Archivo, Instrument Serif, Cormorant Garamond, Young Serif, Outfit, Bricolage Grotesque |
| Text | Body copy, readable at 16 px | Manrope, Inter, Karla, Figtree, Work Sans, Jost, Familjen Grotesk, Lora, Space Grotesk |
| Mono or data | Numbers, labels, code, times | JetBrains Mono, DM Mono, IBM Plex Mono, Roboto Mono, Space Mono |

Rules:

- The display font must match the concept. A split-flap board wants a mono or condensed face. A tea house wants a serif.
- **Do not repeat a display font within the last three pages.** Fraunces and Syne are already used twice each.
- Avoid the default choices (Inter or Roboto as display, Arial, system fonts) unless the page is deliberately plain.
- Size scale: headline 44 to 120 px using `clamp()`, section heading 28 to 48 px, body 16 to 18 px, small labels 14 px at minimum. Line height 1.1 for headlines and 1.6 for body.
- Keep text contrast at 4.5:1 or better. Dark pages use light text, light pages use near-black ink.
- Load fonts from Google Fonts with `display=swap`. Variable fonts need their axis range in the URL (for example `wght@100..900`).

## Colour

- **Three colours per page:** one base (paper or dark), one ink (text), and one accent. Add a second accent only for data or a category.
- The accent appears only on surfaces that matter: the active item, a highlight, the primary button. Do not spread it across the page.
- Dark pages suit drama and night-time themes: harp, lantern, shader, orrery, reel, terminal, split-flap. Warm paper pages suit editorial and food: almanac, recipe book, swatch, swipe deck. Light blue-grey suits data: ledger.
- Avoid the purple-to-blue gradient background. It is the most common AI default and it makes every page look the same.

## Layout patterns used

- **Hero plus stage:** a text column on one side and a moving scene on the other (layered stack, lantern, holo, variable type).
- **Full-bleed scene:** the animation fills the viewport and the text sits over it (orrery, harbour, shader).
- **Card grid:** a row or grid of items that move (ring, swipe deck, reel, swatch, holo).
- **Long scroll story:** sections that reveal as the visitor scrolls (trail, depth rail, almanac).
- **Board or instrument:** a bordered panel that behaves like a device (split-flap, terminal, ledger).

## Motion rhythm

- Durations used in the examples: about 150 to 800 ms for UI, up to about 1.2 s for scene changes.
- Enter curves ease out (`cubic-bezier(0.2, 0.8, 0.2, 1)` appears in several examples). Exits ease in.
- Stagger: 40 to 100 ms per item, and the whole stagger under 600 ms.
- One signature moment per page. Keep supporting motion quieter than the signature.

## Premium signals

- A clear hierarchy: one headline, one lead, one call to action per section.
- A signature moment that fits the content.
- Generous space and a single accent.
- Specific details: a real-looking caption, a labelled control, a visible state.
- Motion that means something: it shows a change, a direction or a result.
- Everything works with a keyboard and on a phone.

## Patterns to avoid

- A tiny uppercase label (an "eyebrow") above every headline. The design hook flags it as the default AI SaaS hero. Fold the label into the lead sentence, or drop it.
- Three identical feature cards with icons under a centred hero.
- Gradient text on every heading.
- Glass cards, heavy shadows and blurred backgrounds everywhere.
- Bounce or elastic easing on everything. Use overshoot only for a playful personality, and only on movement, never on text opacity.
- Stock-style hero copy such as "Transform your workflow".
