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

## Mini-films (long-form, source-cited)

`reels/mini-films/{slug}.md`: 12-20 minute educational documentaries in the
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
length: 12-20 min, landscape
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
