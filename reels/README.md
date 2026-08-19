# Reels: essays and books to video

Video essays, made two ways:

- **Creation**: a Pangaea essay becomes a vertical reel (script + shot list here first, cut by hand for now).
- **Curation**: someone else's essay or book becomes a reel or, for a book, a YouTube series (one video per chapter).

## The format

Every piece here is `reels/{slug}.md` (a standalone reel) or `reels/{book-slug}/chapter-{n}.md`
(a chapter series). Same shape either way:

```markdown
---
title: The reel's own title (not necessarily the source's)
source: essay slug in this repo, OR an external url + author credit
length: target seconds, vertical reel ~30-60s, chapter video 3-8min
---

## Hook (0-3s)
On-screen text + what's said. This is the only thing most viewers see. Earn the next second.

## Beat 1
VO / on-screen text. One idea per beat, in order, matching the source's actual argument.
Visual: what's on screen (b-roll idea, text card, talking head, screen recording).

## Beat 2
...

## CTA / outro
Where this points (the full essay, the next chapter, pangaea.blog).
```

This is the **script layer**, not the render. It's the only thing that has to
exist to hand to an editor or read straight into a camera. When it's worth
automating the actual cut, a Remotion (React) project can consume these same
files directly: `length` and each `##` beat map 1:1 to a scene/duration in
the render, so nothing here has to be rewritten to plug in a renderer later.

## Curated sources

When the source isn't a Pangaea essay, credit it. `source:` carries the
original URL and author. The script itself should be Adam's own take on the
idea (paraphrase, reaction, argument in his own words), not a read-through of
someone else's prose: it's a video ABOUT the idea, not a copy of the essay.
One short attributed quote is fine; reproducing the piece isn't the point.

## Book -> chapter series

For a book: `reels/{book-slug}/chapter-01.md` through `chapter-NN.md`, each
one a single YouTube video (not reel length, no 60s cap). Same beat
structure, same rule on curated material: Adam's take on the chapter, one
short attributed quote at most, credit the book and author up top.

## The stack (locked, proven twice, $0)

**Remotion** (composition + rendering) + **rough.js** (MIT, hand-drawn SVG
annotations: circles, underlines, timelines, tile grids) + **edge-tts**
(free Microsoft neural voice, narration) + **real Wikimedia Commons public
domain photos** for anything biographical/historical. No paid AI generation
service anywhere in this pipeline. Proven on two full renders (Early to Big
Things, Rockefeller: The Flywheel), both zero cost. This is the default;
don't reach for a paid tool (Higgsfield, ElevenLabs) unless a specific gap
in this stack actually blocks the film, and say so explicitly when it does.

Project lives in `reels/studio/` (self-contained Remotion app, own
`package.json`). Two compositions: `BeatReel` (vertical reels) and `DocFilm`
(landscape mini-films, 5 layouts: quote, title, tiles, timeline, grid,
photo). New films add a `reels/studio/src/reels/{slug}.json` beat file and
register a `<Composition>` in `Root.tsx`; the layout components are already
built and reusable.

**Format targets, locked:**
- **Reels**: 60 seconds, vertical (1080x1920, 9:16). 5-6 beats (hook + 3-4
  argument beats + outro). Already hit exactly on the first one (Agency Is
  the Only Skill, 58s).
- **Mini-films**: ~10 minutes, landscape (1920x1080, 16:9), Crayon Capital
  style. The first two ran short (2:34 and 4:47) because the research
  table wasn't deep enough to sustain 10 minutes honestly. Hitting 10
  minutes for real means roughly 40-50 narration beats, each with its own
  citation, not slower pacing or padded restatement. Depth of research is
  the actual lever, not narration speed or beat count for its own sake: if
  a figure's sourced corpus can't honestly support 40+ distinct claims,
  the film should run short rather than pad, same discipline as the essay
  length rule.

## Picking a topic

Logged as a favorite: `src/content/favorites/crayon-capital.md`. The one
real, validated principle behind why Crayon Capital-style videos work: **a name or event the viewer already half-recognizes, explained
properly.** People click because they recognize "Rockefeller" or "1929
crash," they stay because the video actually teaches them something they
didn't know about a thing they thought they understood. This is why
Rockefeller and the WW2 Economics doc both work, and it's the bar for the
next topic: not "an interesting fact," a name or event with real, existing
public recognition.

What this explicitly rules out as a shortcut, seen in a third-party
tutorial on the same channel and rejected on purpose: generating the topic
and full script from an LLM prompt with no real source underneath it. That
produces a video that LOOKS like this format (recognizable name, documentary
narration) but has no citation discipline behind it, which is the entire
point of the research-table step above. Recognizable topic, real sources,
in that order, never skip the second one.

**A second, different way a topic qualifies:** searching YouTube for
something and coming up empty. If the video you went looking for doesn't
exist yet, that's not a dead end, it's a real signal that a gap is worth
filling, validated by an actual search rather than a guess at demand.
Different bar than "recognizable name" above (this one doesn't need
existing public recognition of the subject, it needs a real search that
turned up nothing good), but the same discipline once a topic qualifies
this way: real sources, real citation table, before a word of narration.
Log it wherever a Pangaea seed normally gets logged (`ESSAYS-1000.md` /
Obsidian capture) the moment the search comes up empty, not after the
fact.

**Production note not yet built in:** low-volume background music under
narration, mixed well under the voiceover, is a real, common technique in
this genre worth adding to the Remotion pipeline (a quiet looping bed track,
volume-ducked, not yet implemented in `DocFilm.tsx`) when a film's tone
calls for it.

## Transcript reels (dead simple, no script needed)

For essays that don't need a scripted 4-act treatment: read the essay
verbatim, word-highlighted captions synced to real per-word timing.
`TranscriptFilm.tsx` in `reels/studio/`. No research table, no beats.json,
no diagrams: title pinned at top (Fraunces), 7 words on screen at a time,
spoken words in ink, the current word in terracotta, upcoming words muted.

The real timing comes from edge-tts's `WordBoundary` event stream (`boundary="WordBoundary"`
on `edge_tts.Communicate`, not the default `SentenceBoundary`), which gives
an exact start/duration per word, not an estimate. Generate audio + a
`words.json` of `{text, start, duration}` in one Python pass, copy both into
`reels/studio/public/{slug}/` and `reels/studio/src/reels/{slug}-words.json`,
register a `<Composition>` with `durationInFrames` matching the real audio
length. Use this whenever the essay itself, read straight, is the video;
save mini-films for topics that need real research and citation.

## Mini-films (long-form, source-cited)

`reels/mini-films/{slug}.md`: ~10 minute educational documentaries in the
Crayon Capital mold (narrated over motion graphics/archival photos, one
historical figure or company per film), sourced from summon.guide's figure
grounding (`summon.guide/src/lib/figureSources.ts`), which is itself built
from youchop.app corpus extractions of real books and interviews. See
`repos.yaml` in both repos for how that pipeline connects.

Different rule than the essay/book format above: this is nonfiction
biography, not Adam's personal take, so every factual claim needs a real
citation, not a paraphrase from memory. Structure:

```markdown
---
title: The film's title
source: which summon.guide figure + which sourced episodes/books it draws on
length: ~10 min, landscape
citation_rule: every quoted line is a real quote from the sourced material,
  nothing invented
---

## Cold open
Hook, then title card.

## Part 1: ...
VO narration (paraphrase is fine when clearly derived from the source).
ON SCREEN QUOTE: an exact real quote.
[Source: episode/book title]

## Part N: ...
...

## Outro
Where this points, credit line.
```

Pull the actual `keyLessons` bullets and `principle` line straight from
`figureSources.ts` before writing a word of narration; don't reconstruct a
figure's story from general knowledge when a cited corpus already exists for
them. If a figure has `coverage: "none"` or `"partial"` in that file, say so
rather than filling the gap with invented specifics.
