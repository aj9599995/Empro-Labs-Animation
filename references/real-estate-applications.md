# Real Estate Applications

How the mechanics apply to a real estate website. Each row links a section of a property site to a mechanic family, says why it fits, and names the risk to check. Use it when the brief is for a real estate or property business, and in step 2 of `thinking-process.md` (choosing the purpose).

## Section to mechanic

| Section | Mechanic | Why it fits | Check before you ship |
|---------|----------|-------------|-----------------------|
| Hero listing photo | Parallax depth layers, or a slow Ken Burns move | The property feels like a space, not a flat picture | Alt text describes the photo. Movement stays small. No motion on text |
| Renovation or staging | Before and after slider (clip-path) | Shows the change without a paragraph | Both images have the same crop. The handle is keyboard operable |
| Property grid | FLIP filter (`swatch-flip-site`) | Filtering by beds, price or area moves items instead of jumping | Announce the result count with `aria-live="polite"`. Filtering works without animation |
| Price history | Stroke drawn on scroll (`trail-draw-site`), or a morphing chart (`ledger-morph-site`) | One line shows the trend | Real data only. Label the axes and the dates. Give a text table as well |
| Neighbourhood | Area map flyover (camera eases to a marker, as in `orrery-orbit-site`) | Feels like exploring the area | A schematic map unless the map licence allows a real one. A list of areas as the fallback |
| Floor plan | Lantern-style spotlight (`lantern-reveal-site`), or a 3D room extrusion | Rooms reveal on hover and touch | Room sizes in text. The plan is accurate to the measured drawing |
| Mortgage or payment calculator | Scene driven by one value (`harbor-daynight-site`) | A payment changes visibly with each slider | Show the formula, the rate and the date. Include the standard disclaimer |
| Agent or team cards | Pointer 3D tilt (`holo-tilt-site`) | A premium card feel | Touch fallback. No tilt on text blocks |
| Testimonials | Swipe deck (`swipe-deck-site`) | One story at a time, with buttons | Arrow keys, a pause control, and every testimonial readable as text |
| Open-house schedule | Split-flap board (`splitflap-board-site`) | Times flip into place like a station board | A plain list for screen readers. The schedule is correct when motion is off |
| How buying works | Pinned scrollytelling (not built) | Steps follow the scroll, one per screen | At most two pins. Each step readable without motion |
| Book a viewing | Magnetic button (not built) | Invites the click on desktop | Desktop only. A normal button on touch |
| Area statistics | Odometer count-up (not built) | Numbers land one by one | Cite the source and the date beside the numbers |
| Listing to detail | Shared-element transition (not built) | The photo carries across the page | Fallback to a plain page change |
| Enquiry form | Underline draw on focus (not built) | Shows where the cursor is | Visible focus ring always. Error messages in text |

## Content rules

- **Photos must be real and licensed.** Use placeholder images for demos, and say so.
- **Prices, areas and dates must be checked.** Mark demo values as invented, the way the examples do.
- **Keep the legal wording.** Property sites often need fair housing, licensing and disclaimer text. Ask for the wording rather than inventing it.
- **Do not imply a sale or a result that did not happen.** Testimonials and statistics need a source.
- **Maps and data have licences.** Check them before a real map or a dataset goes into a page.

## Choosing for a real estate page

1. Start from the visitor's task: compare, explore, decide, book, or check a number.
2. Pick the section that carries the task, then the mechanic that makes that task clearer.
3. Keep the animation on that section only. The rest of the page stays calm.
4. Check the fallback for a visitor who only reads the text.

## Ideas that suit premium real estate

- A hero where the property's floor plan builds itself line by line, then the photo fades in.
- A neighbourhood page where the map eases from the city to the street as the visitor scrolls.
- A price page where a single scrub control moves a home's value through five years, with the line drawn behind it.
- An agent page where the card tilts with the pointer and the listings it has sold flip one by one.
