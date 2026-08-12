# Higgsfield camera technique, learned from higgsfield.ai/academy

Reference notes for prompting Higgsfield once the MCP is connected. Summarized
and paraphrased from their public Academy/prompt bank, not copy-pasted; the
values in brackets below are placeholders to fill per shot, same idea as their
own bank, worded fresh.

## What the Academy actually offers

Four flagship courses, all free to start: a 40-minute "Blockbuster 4K" full
pipeline (scripting through scene-by-scene prompting, 10 modules), a
33-minute short-film masterclass built shot by shot, an "AI VFX on real
footage" course (turning normal camera footage into 4K VFX: world swaps,
creature composites), and an animated-short course spanning 8 distinct visual
worlds. Worth working through the Blockbuster 4K one first since it's
structured exactly like the seed-to-render pipeline already built here.

Their prompt bank has 46 camera-move examples, organized into five families.
The pattern across every single one: **specify what does NOT move, as
explicitly as what does.** Their templates spend more words ruling out
unwanted motion (no zoom, no drift, no parallax, no speed ramp) than
describing the intended one. That's the actual technique, not the specific
wording.

## The five move families, and when each earns its place in a mini-film

**Static** — camera locked, zero motion, identical framing start to end.
Use for: a quote card, a held beat where the narration is doing all the work
(this is exactly what `BeatReel.tsx`'s current slides already do, so this
family is the free upgrade path once Higgsfield visuals replace flat paper
backgrounds).

**Pan & tilt** — camera rotates from a fixed point, horizontal (pan) or
vertical (tilt), no travel. Use for: revealing a second subject that enters
frame as the camera turns, e.g. panning from an empty desk to a young
Rockefeller at his ledger.

**Zoom & focus** — either a pure focal-length change (zoom, camera doesn't
move) or a rack focus (camera locked, only the focus plane shifts between a
near and far subject). Their bank also has the dolly zoom (the Hitchcock
"vertigo" effect: camera moves one way while the lens zooms the other, so the
subject stays the same size but the background stretches). Use zoom for a
slow tightening on a detail during a key line; rack focus for a two-plane
composition (foreground object, background subject) where narration shifts
attention between them.

**Aerial & crane** — jib rise, drone orbit, or a pullback that both flies
backward and gains altitude at once. Use for: legacy/scale moments, the "how
big did this get" beat (the flywheel becoming an empire, in the Rockefeller
script's part 4-5 turn).

**Dolly & tracking** — physical camera travel along an axis, constant lens
height, no zoom (the perspective shift comes from the camera actually moving,
which is what makes it read as more "real" than a zoom). Use for a slow
dolly-in during a rising-tension beat, since it's the move every one of these
Crayon-Capital-style documentaries reaches for at their climax.

## The one universal rule worth carrying into every shot prompt

Every template names: what's fixed (tripod/dolly/crane, lens height), what's
changing (the one variable: rotation, focal length, focus plane, or
position), the exact numbers (degrees of rotation, meters of travel, degrees
of field of view), the speed profile (constant, or decelerating into a hold),
and what the shot must NOT do (the negative list). A shot prompt missing any
of those five is underspecified and Higgsfield's own material treats that as
the actual failure mode, not a lack of "creativity" in the prompt.

## Next step

Map each beat type in `reels/README.md`'s formats to a default move: hook = static
or slow dolly-in, argument beats = pan/tilt reveals, legacy/scale beats =
aerial, and build that mapping into the `beats.json` schema
(`reels/studio/src/reels/*.json`) as a `camera` field per beat once Higgsfield
is actually connected and there's a real model to send these prompts to.
