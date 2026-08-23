# The 1,000-essay ledger

The honest scaffold. A seed is not an essay; this ledger is the pipeline from
idea to published №. Work the queue top-down: promote a seed from
`src/content/inbox/` into `src/content/posts/` (add date + claim-title + flip
`draft: false`), and it mints the next №.

## The count

Reset 2026-08-23: every post is unpublished on purpose (see
`WEEKLY-DROP.md`). The pipeline below is unchanged; only the published
number went to zero.

| Stage | Count | Where |
|---|---|---|
| Published | 0 | deliberate reset, republish via the weekly drop |
| Post files on disk | 440 | `src/content/posts/` |
| Of those, real drafts (a written body) | 58 | the pickable pool |
| Of those, empty stubs (title only) | 382 | not eligible for a drop |
| Claims queued | 432 | `ESSAYS-1000.md` |
| Slots to 1,000 with no claim yet | ~565 | future capture |

Two different gaps hide inside "1,000 essays." The **writing gap** is 58
real bodies against 440 files. The **sourcing gap** is 432 claims against
1,000. `ESSAYS-1000.md` holds the rule for the second: do not pad the file
to 1,000, a queue you trust beats a queue that is full.

## The craft tiering

Added 2026-08-23. Scores the 58 real drafts on four signals that describe
the writing: **honest length** (150-450 words), **a bold thesis line**, **a
blurb**, and **an ending kicker** (last paragraph 25 words or fewer).

Deliberately excludes `cover`, `song`, and `video_ready`. A first pass
included them and produced a nonsense ranking, because that metadata was
backfilled in bulk by an agent, so it scored which files got touched
rather than which essays are good.

| tier | meaning | count |
|---|---|---|
| S | 4 of 4 | 2 |
| A | 3 of 4 | 8 |
| B | 2 of 4 | 33 |
| C | 0 or 1 | 15 |

S: The Ceiling Is Human, Pangaea Girls.

**The finding, which matters more than the tiers.** What is missing is
uniform: **55 of 58 have no bold thesis line**, **42 of 58 do not end on a
kicker**, and 22 sit outside honest length. Both of the first two are the
Sivers techniques already recorded in `WRITERS-STUDIED.md` as the most
copyable of the three writers studied. Written down, never applied.

So the daily work is finishing, not writing: find the sentence already
carrying the claim, bold it, swap a summary ending for a kicker. Ten
minutes an essay. That is what makes a daily cadence survivable against a
58-draft runway.

The tiering cannot tell whether a claim is true, whether Adam still
believes it, or whether he has something left to say. Those stay his.

## Tier 1 — nearly ready (promote these first)

academia · acceleration · accountability · addiction · adventure · advice ·
agency · aging · ai · art

Each is a real ~700-word essay. Promotion = move to `posts/`, strip em dashes,
re-title by the claim, add date + `draft: false`. One per week is 10 weeks of
cadence; one per day clears the tier in 10 days.

## Tier 2 — thesis seeds (a claim already exists)

infinite-game · no-investors · leaving-guam · music-time-capsule ·
project-constellation · reading-reactions · ns-diary

## Tier 3 — topic seeds (raw shorthand, need an angle)

balance · beautiful · biographies · biography · bjj · blog · blogging · book ·
bookreviews · business · capital · career · celebrity · childhood ·
christianity · comedy · community · consciousness · courage · creativity ·
curation · dating · decisions · depression · discipline · dropout · drugs ·
economics · education · energy · entrepreneurship · ethics · evolution ·
exist · experiences · faith · family · feedback · film · fitness · flow ·
formula · freedom · friends · frontier · games · gaming · gender · genetics ·
genom · golden-ages · governance · hardware · health · heroes · heuristics ·
history · humor · identity · improvement · influencers · insecurity ·
insights · inspiration · internet · jobs · kids · knowledge · kpop ·
language · laws · leadership · leverage · life · location · manufacturing ·
marketing · masculinity · meaning · mentality · mimetic · minimalism ·
money · movies · music · no-dates · opportunities · perfectionism ·
philosophy · plan · podcast · practice · privacy · problems · productivity ·
projects · psychadelics · psychology · questions · religion · romance ·
sales · science · scifi · singapore · society · sports · startups ·
statistics · stoicism · tech · therapy · thinkers · tmi · twitter · welcome ·
what · who · why · wisdom · work · writing · youtube

A topic can seed MANY essays (one claim each), so this tier alone is
plausibly 300+ essays, not 123.

## Captured

- **Farcaster**: DONE. 97 casts pulled from the public Pinata hub (FID 875739),
  sorted by theme in `SEEDS-FARCASTER.md`. Six recurring convictions surfaced as
  anchor-essay candidates.
- **Obsidian**: DONE. Local REST API is live. Harvested the "write about" essay
  seeds from the `✍️ pangaea.blog` board + app ideas from `💡 Ideas`. See
  `SEEDS-OBSIDIAN.md`.
- **Ableton**: DONE. 31 song projects found on disk, titles in `SEEDS-OBSIDIAN.md`.
- **Google Keep**: FOUND. `Downloads/takeout-...zip`, 2,100 notes (the "100s
  Project" system). ~1,000 untitled notes still need content-level mining.

## Blocked / still on Adam

- ~~**X archive**: not on disk.~~ RESOLVED. 1,266 tweets now sit in
  `adamanack/sources/twitter/`; 392 originals were mined into claims per
  `ESSAYS-1000.md`. The rest are retweets, replies, or too short to stand.
- **Google Keep deep-mine**: ~1,000 untitled timestamp notes need reading, not
  just titles. Say the word and I'll sweep them for essay lines.
- **SoundCloud**: track titles for the songs pillar (export steps in chat).
- **Voice notes**: need the audio files (path) to transcribe.
- **Security**: 41 Keep notes hold plaintext passwords / API keys in Downloads.
  Rotate any still-live keys.

## The math

At a daily cadence the 58 real drafts are 58 days, and that only holds
because the work is finishing rather than starting. After that it is 382
stubs, which are titles, not runway. The ledger's job is to make sure
there is never a blank-page morning.
