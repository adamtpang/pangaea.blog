# Poor Adam's Almanack — project context for Claude Code

*This file is auto-loaded on every Claude Code session in this directory. Read it before doing anything.*

---

## Mission

Ship V1.0 of *Poor Adam's Almanack* — a small, beautiful, timeless book of original aphorisms — as a finished PDF + EPUB. Living document; V1.x ships when more sources become available.

The bar: **Franklin's compression × Naval's design.** See `spec.md` for the full constitution.

## Author

- **Tomas "Bubba" Pangelinan** (Adam, the persona/byline of the book)
- Network School · Forest City
- Farcaster: `@adampang` · FID `875739`
- X: `@adampang` (handle to confirm)
- Domain: **adamanack.com** (purchased — for the future website; book title remains *Poor Adam's Almanack*)

## Reference books (read for inspiration, not copying)

Tomas uploaded these as references during planning:
- *Poor Richard's Almanack* (Franklin) — substance ceiling. Pure compressed wisdom. Scored 9/6 (substance/aesthetic).
- *The Almanack of Naval Ravikant* (Eric Jorgenson) — aesthetic ceiling and the **structural model** for this project (compiled from public-thought sources). Scored 8/9.
- *Poor Charlie's Almanack* (Kaufman) — what *not* to do (618 pages, encyclopedic, opposite of minimal). Scored 9/7.
- Adamanack target: **9.5/9.5**.

## Project files

**Active docs (top-level):**
- `CLAUDE.md` — this file.
- `spec.md` — design constitution (mission, principles, anti-spec, scoring rubric). The substance bar.
- `design.md` — **visual identity bible**: typography, palette, marks, cover, anti-design.
- `success-today.md` — ASAP execution checklist.
- `manuscript.typ` — the book itself in Typst markup. Reads `corpus/keepers.json`.
- `preview.ps1` — `.\preview.ps1` starts the live PDF preview loop (typst watch + Sumatra).

**Active scripts:**
- `scripts/extract.py` — unified extractor (Farcaster JSON + X archive + drafts + essays → `corpus/raw.txt`).
- `scripts/fetch_farcaster.py` — resumable Warpcast fetcher (used to gather all 1,925 casts).
- `scripts/triage.py` — heuristic scorer that sorts `raw.txt` into `corpus/shortlist.txt` and `corpus/all_triage.tsv` for first-pass narrowing.

**Source of truth:**
- `corpus/keepers.json` — **the book**, structured as a `chapters` array of mixed themes and interludes. Both `manuscript.typ` and the Astro site read this file. Edit it; both rebuild.
- `corpus/raw.txt` — 1,966 deduplicated candidates (from 1,925 Farcaster + 846 tweets + 6 X articles after filter + dedup).
- `corpus/shortlist.txt` — top 300 by heuristic score.
- `corpus/all_triage.tsv` — every candidate with score + reasons.

**Site (`site/`):**
- Astro 4 + EB Garamond. Routes: `/`, `/read/[1..N]`, `/themes`, `/about`.
- Reads `../corpus/keepers.json` via JSON import. Hot-reload on save.
- `site/public/fonts/EBGaramond/` — fonts vendored for the deployed site.
- `npm run dev` for live preview at http://localhost:4321; `npm run build` for `dist/`.

**Working folders:**
- `sources/farcaster/casts.json` — 1,925 Farcaster casts.
- `sources/twitter/data/*.js` — X archive text data (16 MB extracted from a 2.2 GB zip).
- `fonts/EBGaramond/` — vendored variable fonts (Typst reads via `--font-path fonts`).
- `references/` — Naval, Franklin, Munger, Procrustes, Tribe of Mentors. See `references/recommended.md` for the deeper aphorism reading list.
- `build/` — compiled `almanack.pdf` (rebuilt continuously by `typst watch`).
- `final/v1.0/` — versioned output ships here on launch.
- `_archive/` — superseded planning docs (ship-today, ship-plan, kickoff-prompt) kept for reference.

## Where we are right now

**Pipeline is wired. Ready to triage.** See `success-today.md` for the five-step execution path.

Done:
- ✅ Spec locked (`spec.md`)
- ✅ Project migrated from `Desktop\loops\➰ Loops\poor-adams-almanack` into `Aether\adamanack.com\` (single domain folder)
- ✅ Title locked: *Poor Adam's Almanack*
- ✅ X archive arrived, extracted (16 MB of `data/*.js` from a 2.2 GB zip into `sources/twitter/data/`)
- ✅ Farcaster fetch: **500 casts** in `sources/farcaster/casts.json` (2026-02-05 → 2026-04-06)
- ✅ Typst + Sumatra installed; EB Garamond vendored under `fonts/`
- ✅ `manuscript.typ` scaffolded with title page, epigraph, preface, 4 themes, 16 seed aphorisms, author's note, colophon — compiles to a real-looking 5×8 PDF
- ✅ `scripts/extract.py` written + run: **816 candidates** in `corpus/raw.txt` (846 tweets + 455 casts → filtered + deduped)
- ✅ Live preview loop wired: `.\preview.ps1` runs `typst watch` + opens Sumatra (auto-reloads on save)

Ready next (this is where we are):
- ⏭️ **Triage** `corpus/raw.txt` in batches of ~50 → `corpus/keepers.txt` (A/S/N tagging, see `success-today.md`)
- ⏭️ Polish keepers → `corpus/polished.txt` (~100 finished lines)
- ⏭️ Group into 7–10 themes; drop into `manuscript.typ`
- ⏭️ Frame (preface, dedication, etc.)
- ⏭️ Export to `final/v1.0/almanack.pdf` + EPUB
- ⏭️ Ship

In flight:
- 🔄 **Full Farcaster cast history fetch** — `scripts/fetch_farcaster.py --reset --max-pages 250 --sleep 6` running in background (Bash task `blxuks7a2`). ~25 min cap. When it finishes, re-run `python scripts/extract.py` to refresh `corpus/raw.txt`.

Cancelled (per Tomas, 2026-05-02):
- ❌ X drafts manual sweep
- ❌ Farcaster drafts manual sweep
- ❌ Essay drafts sweep

Queued for after casts finish:
- ⏭️ Plan + scaffold adamanack.com site (interactive book reader, voice-clone TTS, versioned living doc)
- ⏭️ Triage `corpus/raw.txt` together (A/S/N tagging in batches of 50)

## Decisions locked

- **Title:** *Poor Adam's Almanack* (not *The Almanack of Tomas Pangelinan*)
- **Source pipeline (V1.0):** X archive (already extracted, 846 candidates) + Farcaster casts (full history via Hub or Warpcast client API). **No manual draft sweeps. No essay drafts. Substack is NOT a source.** (Locked 2026-05-02 by Tomas — drop the manual sweeps from the plan.)
- **adamanack.com is now in scope** (overrides the original "post-launch only" anti-spec). It's a *book site* — interactive reader, AI voice-clone narration of every aphorism, versioned living doc (V1.0 → V1.1 → ...). The book and the site share a single source of truth so editing manuscript text updates both.
- **Sections:** ONE — aphorisms only. The original 5-section draft (Aphorisms, Field Notes, Calendar, Builder's Almanac, Marginalia) was collapsed to one. Anything that isn't an aphorism goes to `parking-lot.md` for V2.
- **V1.0 target count:** 75–125 polished aphorisms. (Spec target of 175 is the long-run destination as the living doc grows.)
- **Numbering:** continuous 1 → ~100 across the whole book; theme headers don't reset.
- **No dated entries.** Aphorisms are timeless; dating ages them.
- **Format:** PDF + EPUB. **Typst is the chosen pipeline** (not Pandoc). `manuscript.typ` is the single source of truth; `typst compile` produces the PDF; EPUB export is Block 5 work via Typst HTML export → epub-pack, or Pandoc fallback.
- **Page:** 5" × 8". Generous margins. One serif (EB Garamond default). One aphorism per page (or two with a hairline rule).
- **Cover:** typographic only. Cream + black ink. No imagery.

## Anti-spec (kill these on sight)

Re-read `spec.md` for the full list. The big ones:
- ❌ Adding a Field Notes / Calendar / Builder section back. (One section. Aphorisms only.)
- ❌ Writing new aphorisms from scratch instead of curating existing material. New ideas go to `parking-lot.md`.
- ❌ Adding illustrations, ornaments, drop caps, callout boxes.
- ❌ Tool yak-shaving. Pick Pandoc-or-Typst in 15 minutes and commit.
- ❌ Padding to hit a target line count. 100 polished beats 175 mediocre.
- ❌ Waiting for the X archive to ship V1.0. V1.1 is the right place for X content; V1.0 ships from Farcaster + drafts + essays.
- ~~❌ Building the adamanack.com website before V1.0 ships. Site is post-launch.~~ **OVERRIDDEN 2026-05-02:** site is now in-scope as a book-reader experience. V1.0 publishes to the site at the same moment the PDF lands in `final/v1.0/`.

## Working with Tomas

- He's working through the ➰ Loops project — closing long-carried open commitments. The almanack is one of those. **Help him close it, don't extend it.**
- He's named "Bubba" by friends; the byline keeps it.
- He took a vow of silence on Farcaster until the book ships ("I will not post until Poor Adam's Almanack is shipped! 📖" in his bio). Treat shipping as the unblock.
- Voice: modern, plain English, with one foot in the Franklin tradition. No fake archaisms.
- He's prone (his words) to scope creep on writing projects. The kill switches in `spec.md` are there for a reason. Push back when he tries to add scope mid-flight.

## Tools you'll use in this project

- **Typst 0.14** for the PDF (`typst compile manuscript.typ build/almanack.pdf --font-path fonts`). Compile time is sub-second.
- **SumatraPDF** for live preview — the only Windows PDF viewer that doesn't lock the file, so it auto-reloads when Typst rewrites the PDF on save.
- **Python 3.14** for fetching/extracting/dedup. Scripts live in `scripts/`.
- **EB Garamond** (variable) — vendored under `fonts/EBGaramond/`, fetched from google/fonts. Typst loads via `--font-path fonts`.
- **PowerShell** for the preview script (`.\preview.ps1`). PATH-sensitive — typst was added by winget but isn't always picked up by fresh terminals; the script refreshes it.

## Domain notes (adamanack.com)

Tomas owns adamanack.com. It's the **eventual home for the digital edition** + future expansions. Not a V1.0 dependency. The book title stays *Poor Adam's Almanack*; the domain is the brand container ("adamanack" = portmanteau of Adam + almanack, in the spirit of Naval's "Navalmanack").

When the book ships, a future task is a single-page site that hosts the free PDF + EPUB downloads. Do not start the site work until V1.0 is in `final/v1.0/`.

## How to resume

If you're starting fresh in a new Claude Code session, read these in order:

1. `CLAUDE.md` — this file (auto-loaded).
2. `spec.md` — the substance constitution (Franklin's compression × Naval's design).
3. `design.md` — the visual identity bible (typography, palette, cover treatment).
4. `success-today.md` — active execution checklist.
5. `corpus/keepers.json` — the actual book content (117 aphorisms across 8 themes + 7 interludes).

Then check the working tree:
- `manuscript.typ` compiles → PDF pipeline is alive.
- `build/almanack.pdf` exists → book renders.
- `site/` builds via `npm run build` → 127 pages including reader, themes, cover.
- `corpus/raw.txt` (1,966 candidates) and `corpus/shortlist.txt` (top 300) for re-triage.

**To restart the live preview loop:** `.\preview.ps1` from the project root (PDF watch + Sumatra). For the site: `cd site && npm run dev` (live at localhost:4321).

Then ask Tomas which step he's on and continue.
