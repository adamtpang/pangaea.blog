# Ship Poor Adam's Almanack V1.0 — Today

*Same-day checklist. V1.0 by tonight. V1.1 when the X archive arrives. Living document forever after.*

**Target for V1.0:** 75–125 polished aphorisms, themed, framed, typeset, exported as PDF + EPUB. The book is real and shippable by end of day. Iteration begins tomorrow.

---

## NOW (next 5 minutes — kick off the async stuff)

- [x] **Request the X archive** ✓ (in flight — fuels V1.1 tomorrow)
- [ ] **Send me your Farcaster FID** — I'll fetch every cast directly from a public Farcaster hub (no auth, no waiting). Output drops into `sources/farcaster/casts.json`.
- [ ] **Block your calendar** for the next 6–8 hours. Tell me when you're heads-down so I know to move fast.

---

## BLOCK 1 — Gather (30–60 min)

While the X archive bakes overnight.

- [ ] **Farcaster posts (automated):** I run the fetch script as soon as you send your FID → drops `casts.json` in `sources/farcaster/`. Every cast you've ever made.
- [ ] **X drafts (manual, phone):** open X app → compose (✏️) → drafts folder (top-right) → copy each into `sources/twitter-drafts.txt`. One per line.
- [ ] **X drafts (manual, web/iPad):** repeat on every device you've composed on. Append to the same file.
- [ ] **Farcaster drafts (manual, Warpcast):** compose → drafts → copy into `sources/farcaster-drafts.txt`. One per line.
- [ ] **Essay drafts sweep — 15 min hard timer:**
    - [ ] Obsidian vault search "essay" / "draft"
    - [ ] Apple Notes / Google Keep
    - [ ] Google Docs (Drive search "essay" or "draft")
    - [ ] Notion (workspace search)
    - [ ] Local `.md` / `.txt` files
    - [ ] Gmail drafts (`in:drafts`)
    - [ ] Drop everything found into `sources/essays/`, one file per essay

**Exit criterion:** `sources/` folder is populated with everything available today (Farcaster posts, X drafts, Farcaster drafts, essays). X archive joins for V1.1.

---

## BLOCK 2 — Extract (15 min, mostly my work)

- [ ] I write and run the extractor script: parses Farcaster JSON, X drafts, Farcaster drafts, and the essays. Output: `corpus/raw.txt` — one candidate line per row, deduplicated, sorted, counted. (X archive plugs in for V1.1 with no script changes.)
- [ ] You glance at the count. If we have 500+ candidates we're in great shape for V1.0.

**Exit criterion:** one file. Every line you've written that's available today, sitting on the page.

---

## BLOCK 3 — Triage (60–120 min, the real work)

This is where you have to focus. We do it together. I'll be your co-pilot.

- [ ] Open `corpus/raw.txt`. We work in batches of ~50 lines.
- [ ] You paste a batch in chat. I tag each `A` (already an aphorism), `S` (seed, rewrite), or `N` (noise, cut) with a one-line reason. You override anything you disagree with.
- [ ] We work through the whole corpus this way.
- [ ] Final output: `corpus/keepers.txt` containing only `A` and `S` lines.

**Exit criterion:** the pile is cut from raw to keepers. Themes start to feel obvious.

---

## BLOCK 4 — Polish (60–90 min)

- [ ] We go through every `A` line. I propose a sharpened version. You accept or counter.
- [ ] Every `S` line gets rewritten into a one-liner. Same loop.
- [ ] Re-dedupe. Polished lines often converge.
- [ ] Cut to **target: 100 lines for V1.0** (we'll grow toward 175 in future versions).

**Exit criterion:** ~100 finished aphorisms in `corpus/polished.txt`.

---

## BLOCK 5 — Structure (30–45 min)

Themes surface from the polished list, not before.

- [ ] We read through the 100 lines and group them. I propose 7–10 themes; you adjust.
- [ ] Apply continuous numbering 1 → ~100 across the whole book. Themes are headers; numbers don't reset.
- [ ] Order each theme: strongest line last in the section.

**Exit criterion:** `manuscript.md` — fully ordered and themed.

---

## BLOCK 6 — Frame (30 min)

- [ ] **Preface (I draft, you edit):** 300 words. Why this book, the Franklin nod, what the reader holds.
- [ ] **Title page:** *Poor Adam's Almanack* / *Notes, Aphorisms & Field Reports from a Life Under Construction* / Tomas "Bubba" Pangelinan / Network School · Forest City / 2026
- [ ] **Dedication:** one line. Tell me to whom or pick: *"For the unfinished."*
- [ ] **Contents:** themes only.
- [ ] **Author's note (back):** one paragraph — *"These were drawn from a decade of posts, casts, drafts, and essays."*
- [ ] **Colophon:** *"Set in EB Garamond. Produced at Network School, Forest City, 2026."*
- [ ] **Epigraph (under title page):** *"Write what should not be forgotten."*

**Exit criterion:** complete book in markdown, top to bottom.

---

## BLOCK 7 — Typeset (60 min, mostly my work)

- [ ] I configure a Pandoc + LaTeX pipeline (or Typst — your call) tuned to the spec: 5"×8", EB Garamond, generous margins, one aphorism per page, hairline section openers, small-caps numbers top-left
- [ ] You provide a one-time decision: serif preference (EB Garamond / Sabon / Caslon — default EBG)
- [ ] I export `almanack.pdf` and `almanack.epub` from the same `manuscript.md`
- [ ] I produce a typographic cover: cream stock look, black ink, no imagery

**Exit criterion:** two files. Both open. Both look like a real book.

---

## BLOCK 8 — Proof + Ship (30–45 min)

- [ ] You load the EPUB on your phone OR you read the PDF on screen (zoomed to single-page mode). Read it cover to cover as a reader.
- [ ] Mark every typo, bad break, line that suddenly feels weak. Send me the list.
- [ ] I fix, re-export.
- [ ] You move final files to `➰ Loops/poor-adams-almanack/final/v1.0/`
- [ ] You log it: *"Poor Adam's Almanack V1.0 — Shipped 2026-04-25."*
- [ ] You send it to **one person** who didn't know you were writing it.

**Exit criterion:** the book exists. The loop is closed. The first commit of a living artifact is live.

---

## V1.1 (next session — when X archive arrives)

- [ ] Drop X archive zip in `sources/twitter/`
- [ ] Re-run extractor (already written from V1.0)
- [ ] Triage only the *new* lines (not the V1.0 keepers)
- [ ] Add the survivors to the manuscript
- [ ] Re-typeset, re-export, ship V1.1

The pipeline you built today runs again with one command.

---

## Today's kill switches (catch these the moment they appear)

- **"Let me wait for the X archive."** → No. V1.0 ships without it. Living document.
- **"75 aphorisms isn't enough."** → It is. Franklin's most-quoted lines number ~60. You're shipping a real book.
- **"Let me write a few new lines from scratch."** → No. Today is curation only. New writing goes into the parking lot.
- **"This serif isn't quite right, let me audit fonts."** → 60 seconds to pick. Ship.
- **"The cover needs more."** → It doesn't. Black on cream. Title. Done.
- **"The preface should be longer."** → 300 words max. Franklin's preface to the 1733 *Poor Richard's* was shorter than this list.

---

## What I need from you, right now, to start

1. **Your Farcaster FID** — I run the fetch from this session, output goes to `sources/farcaster/casts.json`
2. **A serif preference** for typesetting — EB Garamond / Sabon / Caslon, or just say "you pick"

That's it. X archive is already requested. Send the FID and I start fetching while you do the manual draft sweep (Block 1).
