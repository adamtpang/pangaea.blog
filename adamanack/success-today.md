# Ship Poor Adam's Almanack V1.0 — Today

*The new ASAP checklist (post-pivot, post-Cowork). Replaces the original eight-block ship-today.md for execution; the old plan stays in the file as historical reference.*

**Definition of done for V1.0:** a 5"×8" hardcover-shaped PDF (and EPUB) of 75–125 polished aphorisms, set in EB Garamond, themed and numbered, sitting at `final/v1.0/almanack.pdf`. Hosted at adamanack.com after the file exists.

The bar: **Franklin's compression × Naval's design.** See `spec.md`.

---

## The vibewriting loop (the whole point of this rig)

```
.\preview.ps1
```

That command:
1. Opens `build/almanack.pdf` in SumatraPDF.
2. Starts `typst watch` on `manuscript.typ`.
3. Every save recompiles the PDF in <1 second; Sumatra auto-reloads.

So the loop is: **prompt me → I edit `manuscript.typ` → you watch the PDF update.** That's the 10/10 ebook feedback cycle.

Source of truth: `manuscript.typ`. Output: `build/almanack.pdf`. Tools: Typst (PDF), Sumatra (preview), EB Garamond (font, vendored under `fonts/`).

---

## Where the corpus came from

```
sources/farcaster/casts.json       (500 casts)
sources/twitter/data/*.js          (X archive — tweets, community, deleted, articles)
            ↓
        scripts/extract.py
            ↓
sources/twitter/data/...      ┐
sources/farcaster/casts.json  ├──→  corpus/raw.txt   (816 candidates)
[future: drafts, essays]      ┘
```

Re-run `python scripts/extract.py` any time new sources land. Idempotent.

---

## Five steps to V1.0

### 1. Triage to keepers (60–90 min, the real work)

We work `corpus/raw.txt` in batches of ~50.
- You paste a batch in chat.
- I tag each line `A` (already an aphorism), `S` (seed — needs a rewrite), or `N` (cut), with a one-line reason.
- You override anything you disagree with.
- Output: `corpus/keepers.txt` (only A and S lines).

**Exit criterion:** corpus down from 816 → ~150–200.

### 2. Polish to ~100 (60–90 min)

Every `S` line gets rewritten into a one-liner. Every `A` line gets a sharpening pass — accept or counter.
- We dedupe again (polished lines often converge).
- Cut to **target: ~100 finished aphorisms** for V1.0.
- Output: `corpus/polished.txt`.

**Exit criterion:** ~100 lines that all pass the carved-doorway test (stands alone, compresses, memorable).

### 3. Theme + order (30 min)

Themes emerge from the polished list, not before.
- Read through. I propose 7–10 themes; you adjust.
- Group lines under themes.
- Order each theme so the strongest line lands last.
- Continuous numbering 1 → ~100 across the whole book; theme headers don't reset.
- Drop into `manuscript.typ`.

**Exit criterion:** the manuscript is the real book in shape.

### 4. Frame (30 min)

- **Preface:** 300 words. Why, the Franklin nod, the reader's contract. (Draft already in `manuscript.typ`; we sharpen.)
- **Title-page subtitle:** confirm or change. (Current: *Notes from a life under construction.*)
- **Dedication:** one line. Tell me to whom — or pick *"For the unfinished."*
- **Author's note:** one paragraph (already drafted).
- **Colophon:** already drafted.
- **Epigraph:** already in: *"Write what should not be forgotten."*

**Exit criterion:** the manuscript is complete top to bottom.

### 5. Export + ship (30 min)

- Final compile: `typst compile manuscript.typ final/v1.0/almanack.pdf --font-path fonts`.
- EPUB: `manuscript.md` mirror + Pandoc, OR Typst HTML export → epub-pack. (15-min decision when we get here.)
- You read it cover-to-cover on phone or screen as a reader. Mark typos and weak lines.
- I fix, re-export.
- You log it: *"Poor Adam's Almanack V1.0 — Shipped 2026-05-02."*
- You send it to **one person** who didn't know you were writing it.

**Exit criterion:** the book exists. The loop is closed.

---

## What's cancelled (don't do these)

Per Tomas 2026-05-02:
- ❌ X drafts manual sweep
- ❌ Farcaster drafts manual sweep
- ❌ Essay drafts sweep

The X archive + full Farcaster cast history is enough corpus for V1.0.

## What's queued after V1.0 (same artifact, more surfaces)

- adamanack.com **book-reader site** — interactive read-on-web, AI voice clone narrating each aphorism, versioned living doc (V1.0 → V1.1 → ...). Same source of truth as the PDF.
- Print + audio bundle.

When new sources land later, re-run `scripts/extract.py`, triage only the new lines, add survivors, re-export.

---

## Today's kill switches

- **"Let me write a few new lines from scratch."** → No. Curation only. New ideas go to `parking-lot.md`.
- **"This serif isn't quite right."** → It's EB Garamond. Done. Ship.
- **"The cover needs more."** → It doesn't. Black on cream. Title. Done.
- **"75 isn't enough."** → It is. Franklin's most-quoted lines number ~60.
- **"Let me audit the whole 816 line by line."** → No. Batch of 50. Tag. Move.

---

## What I need from you, right now

1. Open `.\preview.ps1` in a PowerShell terminal at the project root. Confirm Sumatra opens with the current `build/almanack.pdf`.
2. Tell me to start triage and **paste the first 50 lines from `corpus/raw.txt`** in chat. I'll tag them A/S/N.
3. Optional: tell me to kick off a background Farcaster backfill (`scripts/fetch_farcaster.py`) — it will run quietly while we triage.

That's it. The pipeline is wired. The corpus is gathered. The book has a real first compile. Now we curate.
