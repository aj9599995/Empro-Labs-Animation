# Layered Stack (Hyperframe-Style) Mechanics

Use this when a request asks for a stacked or layered 3D hover effect that fans apart and changes a headline. The working example is `examples/layered-stack-hyperframe/`.

Write new code for every project. The notes below describe the technique in general terms. They are not a copy of any site.

## What the visitor sees

- A stack of tilted slabs in a 3D scene. The stack floats gently and tilts towards the pointer.
- Hovering or focusing a slab fans the stack into a staircase, colours that slab, shows its glow, and swaps a headline phrase above an underline that matches the phrase's width.
- Its description and service chips update.
- Clicking jumps to that slab's section.
- On load, the slabs fly in and the text builds in order. Any click, key or touch skips the intro.

## Building blocks

1. **Scene.** A container with `perspective`. Inside it, a stack element with `transform-style: preserve-3d`, rotated on X and Z to give a floor-plan view.
2. **Slabs.** Each slab has three faces (top, front edge, side edge) so it reads as a solid object. Set the slab size in CSS variables.
3. **Idle motion.** A CSS keyframe bob with a different delay per slab. A requestAnimationFrame loop eases the stack towards the pointer (about 6% per frame) and adds a small sine sway.
4. **Preview state.** One function previews slab `i`:
   - sets the hovered index;
   - sets colour variables on the slab and dims the others;
   - fans the slabs apart with staggered transition delays;
   - updates the title, description and the underline colour;
   - renders the chips with a short rise animation;
   - swaps the headline phrase.

   The reverse function runs when the pointer leaves a small margin around the stack. The margin stops the fan from flickering at the edges.
5. **Headline swap.** Keep a hidden element with the same text style. Put the new phrase in it, read its width, and set the underline to that width. Then fade the phrase out, change the text while it is invisible, move it to its start position with transitions off, force a reflow (read `offsetWidth`), and fade it back in. Use a counter so that an older timeout cannot overwrite a newer swap.
6. **Underline.** Animate the underline with `transform: scaleX()`, not `width`. A width change triggers layout on every hover.
7. **Intro.** Each slab flies in from a random edge with a spin and drops onto the stack. A ring pulse runs outward. Then the text lines appear in sequence. Use the Web Animations API for the intro so it can be skipped cleanly.
8. **Input.** Pointer hover previews. Focus previews too, so keyboard users get the same view. Enter and Space open the section. On touch, the first tap previews and the second tap opens.
9. **Fit.** Scale a fixed stage (for example 1100 × 600) to the viewport with `transform: scale()`. Size the stack so it fits beside the text column.
10. **Reduced motion.** Turn off the intro, the bob and the tilt. Keep the colour and text changes, which are state, not movement.

## Pitfalls seen while building

- **A centred grid shrinks its absolutely positioned child to zero size.** Give the layer an explicit `inset` or size.
- **A glow wider than the scene causes horizontal scroll on phones.** Fix the glow's size. Do not hide the overflow with a global `overflow-x: clip` on `body`, because that can hide the real problem.
- **Two elements sharing one `id` breaks scripts.** The script finds the first match, which may be the wrong element.
- **Text width must be measured, not guessed.** Use the hidden measure element.
- **Keep one script file with clear state.** A design that splits the logic into numbered blocks, each replacing the functions of the last, is hard to follow and easy to break. The reference site has this structure, and you should not copy it.
- **Screenshots can catch the middle of a transition.** Wait for the animations to finish before you judge the layout (see `build-and-test-process.md`).
