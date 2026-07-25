# Poor Adam's Almanack — handoff

*Consolidated into pangaea.blog on 2026-07-25. Everything lives in `adamanack/`. This file is the whole context; the Claude session that built it can be deleted.*

---

## What it is

A book of practical aphorisms, curated (never newly written) from Adam's own decade of public writing. Franklin's *Poor Richard's Almanack* is the namesake; Taleb's *The Bed of Procrustes* is the compression target; Naval's *Almanack* is the design target.

**Shipped v1.0** — live at **https://adamanack.com** as a single page that embeds the PDF full-viewport. 117 aphorisms, 8 themes, 5 pages, 105 KB, ~5 minute read.

Pangaea's own homepage already lists a "forthcoming Almanack" in its project list — this is that project, now co-located.

---

## Current state

| | |
|---|---|
| Aphorisms | **117** (verified unique, no dupes) |
| Themes | 8, lettered A–H, char-sorted within each |
| Word count | 849 words, avg 7.3 words/aphorism |
| Read time | ~5 min at 170 WPM |
| PDF | 5 pages, 107 KB — cover + 4 dense list pages |
| Live | https://adamanack.com |
| Repo | https://github.com/adamtpang/adamanack.com (private) |

Theme breakdown: A·Beginning 15 · B·Building 15 · C·Truth 15 · D·Love 15 · E·Errors 12 · F·People 15 · G·Mind 15 · H·Time 15

Every line is labelled `A1`…`H15` in the PDF.

---

## Where everything lives (`adamanack/`)

```
adamanack/
├── corpus/
│   ├── keepers.json              ← THE SOURCE OF TRUTH. Edit this.
│   ├── keepers.themed-snapshot.json  ← older version w/ Tribe-of-Mentors interludes
│   ├── raw.txt                   ← 1,966 deduped candidates
│   ├── shortlist.txt             ← top 300 by heuristic score
│   └── all_triage.tsv            ← every candidate + score + reasons
├── manuscript.typ                ← Typst source; reads keepers.json
├── site/                         ← Astro, one page, embeds the PDF
│   └── public/almanack.pdf       ← the compiled book that ships
├── scripts/
│   ├── extract.py                ← sources/ → corpus/raw.txt
│   ├── fetch_farcaster.py        ← resumable Warpcast fetcher
│   └── triage.py                 ← heuristic scorer → shortlist + tsv
├── sources/
│   ├── farcaster/casts.json      ← 1,925 casts (full history)
│   └── twitter/data/*.js         ← X archive authoring files
├── fonts/EBGaramond/             ← vendored variable fonts
├── design.md                     ← visual identity bible
├── spec.md                       ← substance constitution
├── references/recommended.md     ← aphorism reading list (5 books to acquire)
├── deploy.ps1                    ← compile → sync → ship
└── _archive/                     ← superseded planning docs
```

---

## The loop

Everything flows from **one file**: `corpus/keepers.json`.

```powershell
# from adamanack/
.\deploy.ps1
```

That script: compiles `manuscript.typ` → `build/almanack.pdf`, copies it to `site/public/almanack.pdf`, pushes to Vercel production. ~30 seconds.

For live PDF preview while editing: `.\preview.ps1` (runs `typst watch` + opens SumatraPDF, which auto-reloads on save).

**Requires:** Typst 0.14 (`winget install Typst.Typst`), SumatraPDF for preview, Node for the site. Vercel CLI authed as `adamtpang`.

---

## The one open decision

**The book is too short. It should be expanded.**

117 aphorisms is only the top **6%** of the 1,966-candidate corpus — that's starving it. The math on expansion:

| Cut | Aphorisms | Words | Read time | Comparable |
|---|---|---|---|---|
| top 5% | 98 | ~715 | ~4 min | *(where we are now)* |
| top 10% | 197 | ~1,438 | ~8 min | long magazine essay |
| top 15% | 295 | ~2,154 | ~13 min | short chapter |
| **top 20%** | **393** | **~2,869** | **~17 min** | **Bed of Procrustes (~370)** |
| top 25% | 492 | ~3,592 | ~21 min | Naval's quote section |
| top 33% | 649 | ~4,738 | ~28 min | genuine short read |

**Recommendation: expand to ~393 (the Pareto 20%).** It matches Procrustes' proven scale, lands at 17 minutes (finishable in one sitting, substantial enough to feel like a book), and keeps the best 1-in-5 rather than 1-in-17.

That means roughly 50 per theme instead of 15. `corpus/all_triage.tsv` has every candidate pre-scored — the expansion pass should work down from the top of that file, not re-read the raw corpus from scratch. Aphorisms scoring 5–7 in the mid-band were verified to contain a lot of unused gold.

---

## Deploy / infra facts

- **Vercel project:** `adamtpangs-projects/adamanack.com`
- **Domain:** registered *through Vercel itself* — nameservers `ns1/ns2.vercel-dns.com` already correct, no third-party DNS. Renews ~$11.25/yr (expires 2027-04-30).
- **GitHub:** `adamtpang/adamanack.com`, private, one commit on `main`. Flip public with `gh repo edit adamanack.com --visibility public`.
- **`vercel.json`** builds from `site/` and outputs `site/dist`; framework is `null` so Vercel doesn't misdetect from repo root.
- **`.vercelignore` gotcha:** it once had `**/*.pdf`, which silently excluded the book itself and produced a 404. It's fixed — do not re-add a global PDF exclusion.

---

## Locked decisions (don't relitigate)

- **Curation only.** Never write new aphorisms. Everything comes from the existing corpus. New ideas go elsewhere.
- **Spelling:** *Almanack* with the K (Franklin's spelling). "Adamanack" is the informal nickname / domain; **"Poor Adam's Almanack" is the proper name** used everywhere visible.
- **Typography:** one serif, EB Garamond. White `#FFFFFF` / black `#0A0A0A` / muted `#6B6B6B` / hairline `#E5E5E5`. No dark mode. No color. No imagery, ornaments, or drop caps. Full palette + anti-design list in `design.md`.
- **Removed on purpose:** subtitle, byline, place stamp, dedication, preface, colophon, interludes, Mariana coordinates. The cover is the title plus a read-time stamp, nothing else.
- **Format:** Typst → PDF. Not Pandoc, not LaTeX.
- **Cancelled:** X drafts sweep, Farcaster drafts sweep, essay drafts sweep. The archive + full cast history is enough corpus.

---

## Next steps, in order

1. **Expand to ~393 aphorisms** from `corpus/all_triage.tsv` (the open decision above). Biggest single quality win.
2. **Wire it into pangaea.blog properly** — the homepage already promises a forthcoming Almanack. Options: link out to adamanack.com, or build an `/almanack` route in pangaea's Astro site reading the same `keepers.json`. The content collection pattern in `src/content/` would fit.
3. **EPUB export** — Typst HTML export → epub-pack, or Pandoc fallback. Never started.
4. **Voice clone** (deferred by Adam) — ElevenLabs, ~1–3 min reference audio, then a batch script generating one MP3 per aphorism. The original site design had a per-aphorism "listen" button; that markup is in git history if the audio edition gets revived.

---

## Cleanup

The original project folder **`Aether/adamanack.com/` is still on disk and untouched** — nothing was moved or deleted, only copied. It's also fully pushed to GitHub.

Once you've confirmed `adamanack/` here has everything you need, that folder is safe to delete. Note that deleting it does **not** affect the live site (Vercel serves from its own build) or the GitHub repo.

Two things intentionally **not** copied over:
- Copyrighted reference PDFs (Naval / Poor Charlie's / Procrustes / Tribe of Mentors) — they live in `~/OneDrive/Documents/books/`
- Private X-archive data (DMs, likes, Grok chats, contacts, ad data) — never needed for curation
