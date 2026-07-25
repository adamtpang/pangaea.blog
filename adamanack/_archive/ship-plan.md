# Poor Adam's Almanack — ASAP Action Checklist

*Time is not the factor. Actions are. Each box is a discrete sitting-down action. Check them in order — every step unblocks the next.*

---

## What done looks like

One PDF + one EPUB. *Poor Adam's Almanack*. A curated collection of your own aphorisms, mined comprehensively from everything you've **already** written and posted across X, Farcaster, Substack, and your essay drafts. Blog ideas and unwritten future posts are parked — they're version 2 fuel, not v1 source material.

---

## Phase 0 — Kick off the slow exports right now (5 minutes total)

These run in the background. Start them before anything else.

- [ ] **Request the X archive.** x.com → Settings → Your Account → Download an archive of your data → request. 4–24 hour delay. Captures **published** posts + replies + X Articles. **Does not capture drafts** — those are device-local.
- [ ] **Request the Substack export.** Substack → Settings → Exports → New export. Captures **published posts + drafts**. Email arrives within minutes to hours.
- [ ] **Save your Farcaster FID** to a sticky note. Find it at warpcast.com/~/profile or in app settings. We'll fetch your casts via API once the script is ready.

---

## Phase 1A — Pull every PUBLISHED thing you've ever written

Everything lands in `➰ Loops/poor-adams-almanack/sources/`.

- [ ] **Drop the X archive zip into `sources/twitter/`** when it arrives. Unzip. The file we care about is `data/tweets.js`. Includes X Articles too.
- [ ] **Drop the Substack zip into `sources/substack/`** when it arrives. Includes drafts and published posts as HTML + a CSV index.
- [ ] **Pull Farcaster casts** via the Neynar/Hub API using your FID. Save as `sources/farcaster/casts.json`. *(Tell me your FID and I'll write the fetch script.)*
- [ ] **Sweep for other published platforms.** Anything you've written publicly that's not in the three above? Tick the ones that apply, skip the rest:
    - [ ] LinkedIn posts + articles
    - [ ] Medium articles
    - [ ] Bluesky / Threads posts
    - [ ] Hacker News / Reddit comments worth keeping
    - [ ] Personal blog before Substack (Wordpress, Ghost, custom)
    - [ ] Old newsletter platforms (Mailchimp, Revue, TinyLetter)
    - [ ] Public GitHub READMEs / gists with prose
    - [ ] Public Notion docs
- [ ] **Drop each into its own subfolder** under `sources/` as text or HTML. Don't edit. Just collect.

---

## Phase 1B — Capture the DRAFTS that exports won't give you

This is the manual part. Drafts on X and Farcaster are local to the device that wrote them. Touch every device you've ever composed on.

- [ ] **X drafts on phone.** Open X app → tap compose (✏️) → tap the drafts label at the top of the compose sheet. Screenshot the list, then open each draft and copy the text into a single file: `sources/twitter-drafts.txt`. One draft per line break.
- [ ] **X drafts on every other device** you compose on (iPad, second phone, web extension). Same drill. Append to the same file.
- [ ] **Farcaster drafts in Warpcast.** Open Warpcast → compose → drafts list. Copy each into `sources/farcaster-drafts.txt`.
- [ ] **Essay drafts — sweep every notes app and writing tool.** One file per essay into `sources/essays/`:
    - [ ] Obsidian vault
    - [ ] Apple Notes / Google Keep
    - [ ] Drafts (the iOS app, if you use it)
    - [ ] Google Docs (search "essay" or "draft" in your Drive)
    - [ ] Notion (search your entire workspace)
    - [ ] Local `.md` / `.txt` files on your laptop
    - [ ] Gmail drafts (yes, really — search `in:drafts`)
    - [ ] iMessage to yourself (people use it as a notes app)
- [ ] **Old machines.** If you have a 2018 laptop in a drawer, boot it, look in Documents and Notes, then copy anything writerly into `sources/essays/`.

---

## Phase 1C — Parking lot (so the future doesn't poison the present)

Blog post drafts and blog *ideas* you want to write later are valuable — but they're not source material for *this* book. Park them so they're safe but out of the way.

- [ ] Create `➰ Loops/poor-adams-almanack/parking-lot.md`
- [ ] Move every "future post" / "blog idea" / unwritten draft into it
- [ ] Title at the top: **"Version 2 fuel. Not for V1. Revisit after ship."**
- [ ] When triaging in Phase 3, if you catch yourself thinking *"I should write this out properly first,"* drop it in the parking lot and move on.

**Why this matters:** v1 is a curation of what you've already said. If you start writing new essays now, you'll never finish. The parking lot keeps the ideas safe so you can let them go for now.

---

## Phase 2 — Normalize into one raw corpus

Turn all the exports + drafts into one big list of candidate lines.

- [ ] **Extract tweets** from `tweets.js` → one tweet per line, strip URLs, @mentions, RTs, anything < 10 chars → `corpus/tweets.txt`
- [ ] **Extract X Articles** → split into sentences, one per line → `corpus/x-articles.txt`
- [ ] **Extract X drafts** → already one per line → `corpus/twitter-drafts.txt`
- [ ] **Extract casts** from Farcaster JSON → one per line, same filters → `corpus/casts.txt`
- [ ] **Extract Farcaster drafts** → already one per line → `corpus/farcaster-drafts.txt`
- [ ] **Extract Substack** → one sentence per line from each post and draft → `corpus/substack.txt`
- [ ] **Extract essays** → one sentence per line per essay → `corpus/essays.txt`
- [ ] **Merge and dedupe** all of the above into `corpus/raw.txt`. Drop exact dupes and near-dupes (first 40 chars match). Write the line count at the top.

> **Say the word and I'll write this whole phase as a single Python script.** You drop everything into `sources/`, run one command, get `raw.txt` out.

---

## Phase 3 — Triage

Read every line once. Tag each as:

- `A` — already an aphorism, keep
- `S` — seed of one, rewrite later
- `N` — noise, cut

- [ ] Tag every line.
- [ ] Delete every `N`. Don't be precious.
- [ ] Count the survivors. Strong shape: 500+. Workable: 200+. Below 100: write fresh.

---

## Phase 4 — Polish

- [ ] Sharpen each `A`. Cut the hedging clause.
- [ ] Rewrite each `S` into a standalone one-liner.
- [ ] Re-dedupe. Polished lines often converge.
- [ ] Cut to your target count (150–300).

---

## Phase 5 — Lock the six decisions

- [ ] **Target length** (the count from Phase 4)
- [ ] **Organizing principle** — month, theme, virtue, alphabetical, or deliberate flow
- [ ] **Persona** — Tomas, or a character named Adam
- [ ] **Voice register** — modern, archaic, or hybrid
- [ ] **Scope of frame** — just aphorisms + preface, or also seasonal essays / calendar
- [ ] **Audience** — friends, or open web

---

## Phase 6 — Structure

- [ ] Apply the organizing principle to every line.
- [ ] Order within each section. Strongest line last.

---

## Phase 7 — Frame

- [ ] **Preface** (300–500 words). Why this book, the Franklin nod, what the reader holds.
- [ ] **Title page.** Title, subtitle, byline, year.
- [ ] **Dedication.** One line.
- [ ] **Colophon.** Set in [typeface], produced [year/place].
- [ ] **Optional author's note.** A page on the sources — a decade of posts and drafts, distilled.

---

## Phase 8 — Typeset

- [ ] **Pick tooling in 15 minutes.** Pandoc + XeLaTeX, Typst, or Vellum. Commit and move on.
- [ ] **Page:** 5" × 8". Generous margins. One beautiful serif (EB Garamond, Sabon, Caslon).
- [ ] **Interior:** one aphorism per page, or two with a hairline rule. Lots of whitespace.
- [ ] **Cover:** typographic only. Black on cream. Title, subtitle, byline.
- [ ] **Export:** `almanack.pdf` and `almanack.epub` from the same Markdown source.

---

## Phase 9 — Proof

- [ ] Print single-sided or load on an e-reader. Read as a reader.
- [ ] Mark every typo, bad break, widow, orphan.
- [ ] Fix. Re-export.

---

## Phase 10 — Ship

- [ ] Move final files to `➰ Loops/poor-adams-almanack/final/`
- [ ] Log: *"Poor Adam's Almanack. Shipped YYYY-MM-DD."*
- [ ] Send to one person who didn't know you were writing it.
- [ ] Close the loop.

---

## Kill switches (catch these the moment they appear)

- **"Let me write a few new essays first."** → Parking lot. Not for V1.
- **"What if I also include LinkedIn comments / podcast transcripts / book annotations?"** → Cap your sources at the end of Phase 1. No new sources after that.
- **"This tool isn't quite right, let me try another."** → 15 minutes to pick. Then commit.
- **"Maybe I should add illustrations / a website / a publisher pitch."** → V2.
- **Triage paralysis.** → If you're hovering between `A` and `S` for more than 5 seconds, mark it `S` and move.

---

## What I can run for you on demand

- **Farcaster fetch script** — give me your FID, I'll dump every cast you've ever made
- **Phase 2 extractor** — single Python script, takes the whole `sources/` folder, outputs `raw.txt`
- **Triage co-pilot** — you paste batches, I tag `A/S/N` with one-line reasons and suggest rewrites
- **Polish pass** — paste a keeper, I sharpen it
- **Preface draft** — once your six decisions are locked
- **Pandoc/Typst config** — one-source-to-two-outputs setup
