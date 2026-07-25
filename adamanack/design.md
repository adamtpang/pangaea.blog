# Poor Adam's Almanack — Visual Identity

*The brand bible. White paper. Black ink. One serif. Editorial. If a design choice isn't in this doc, it's not in the project.*

---

## Brand position

**Poor Adam's Almanack** — a small, beautiful, timeless book of original aphorisms by Tomas "Bubba" Pangelinan. Hosted at adamanack.com.

- **Full name** (cover, masthead, formal): *Poor Adam's Almanack*
- **Nickname** (informal, domain only): *Adamanack*

Lineage: **Franklin's compression × Naval's design × Procrustes' edge × editorial restraint.**

The book and the site share a single source of truth (`corpus/keepers.json`). The visual identity holds across both surfaces and across every version of the living doc (v1.0 → v1.x).

---

## Typography

**One serif: EB Garamond** (variable, vendored under `fonts/EBGaramond/`).

| Use | Weight | Style | Size (book) | Size (web) |
|---|---|---|---|---|
| Body | 400 (Regular) | Roman | 11 pt | 19 px |
| Aphorism display | 400 | Roman | 13 pt | clamp(1.45rem, 3.2vw, 1.95rem) |
| Cover title | 500 (Medium) | Roman | 28 pt | clamp(2.4rem, 6vw, 3.6rem) |
| Subtitle | 400 | Italic | 11 pt | clamp(1rem, 2vw, 1.15rem) |
| Section header | 400 | Italic, lowercase, tracked 0.4em | 10 pt | 0.95rem |
| Metadata caps | 400 | UPPERCASE, tracked 0.18–0.32em | 8–9 pt | 0.72–0.78rem |
| Numerals | — | Old-style figures (`onum`) | — | — |

**Rules:**
- Old-style figures everywhere.
- Italics: subtitles, quotes, theme names, in-prose mentions of the book title.
- All caps for metadata only — always tracked at least 0.18em.
- Cover title at weight 500 for editorial authority. Body stays Regular.
- No bold in body. No drop caps. No small caps unless system-supported.

---

## Color palette

**One mode: white + black.**

```
paper    #FFFFFF   page background
raised   #FAFAFA   hover surfaces, subtle pressed states
ink      #0A0A0A   body text, primary
muted    #6B6B6B   secondary text, metadata
hairline #E5E5E5   borders, dividers, rules
```

That's it. No accent colors. No dark mode. No warm tones. The white–black contrast carries the entire visual.

**Selection state:** ink background, paper text. Standard editorial inversion.

---

## Marks

### Letterform mark (favicon, app icon)
Italic capital **A** in EB Garamond (weight 500), centered on a white square, glyph in `ink`. Locked in `site/public/favicon.svg`.

### Wordmark
**Poor Adam's Almanack** in EB Garamond Regular at masthead-size in the site nav. No flourish. No italic. Just the name.

The nickname *Adamanack* is reserved for the domain (adamanack.com) and informal contexts. It does not appear on the cover or in the site chrome.

---

## Cover treatment

The PDF v1.0 cover is canonical. Composition:

```
┌─────────────────────────┐
│                         │
│                         │
│                         │  top whitespace ~25%
│                         │
│                         │
│   Poor Adam's Almanack  │  title, EBG Medium, ~28pt
│                         │
│   Notes from a life     │  subtitle, EBG Italic, ~11pt
│   under construction    │  muted
│                         │
│                         │
│                         │
│       ━━━━━━━━━         │  hairline rule, 1in wide
│                         │
│                         │
│                         │
│   Tomas "Bubba"         │  byline, EBG Regular, ~10pt
│   Pangelinan            │
│                         │
│   NETWORK SCHOOL        │  place, EBG Regular,
│   FOREST CITY           │  tracked caps, ~8pt, muted
│                         │
└─────────────────────────┘
```

No imagery. No coordinates. No subtitle decoration. The ratio of whitespace to ink is the entire design.

---

## Web composition rules

- **Reading width:** max 32ch for body, 28ch for aphorism display
- **Vertical rhythm:** 1.55 leading for body, 1.45 for display
- **Margins:** 1.5rem mobile, 1.75rem desktop
- **No cards on the reader.** Paper-on-paper would feel like a UI.
- **Hover states:** subtle — opacity, underline color, 1px translate. Never glow or scale.
- **Transitions:** 0.18s ease for color, 0.35s for movement
- **Accessibility:** keyboard navigable, swipe on mobile, `prefers-reduced-motion` respected

---

## Voice & tone

For UI copy outside the aphorisms (preface, author's note, button labels):

- Modern, plain English. No fake archaisms.
- Short sentences. Aphorism rhythm leaks into the prose.
- Sentence-case is fine in nav links ("Read", "Themes", "About").
- One word better than two. Two words better than five.
- No exclamation marks anywhere in chrome.

---

## Anti-design (what we never do)

- ❌ Multiple fonts
- ❌ Imagery, illustrations, photos, emoji
- ❌ Drop caps, ornaments, dingbats, fleurons
- ❌ Color beyond the locked palette
- ❌ Bold weight in body copy
- ❌ Background images, textures, patterns, gradients
- ❌ Animations beyond fade and 1px translation
- ❌ Skeumorphic page-curl effects
- ❌ Author photo on the cover
- ❌ Marketing copy treated like art
- ❌ Dark mode (kept off in v1.0 for editorial purity)

---

## Versioning visual

Each version (v1.0, v1.1, …) carries the same identity. The version is named in the colophon only — not surfaced in site chrome. The book is a living doc. New versions add lines or refine wording; the identity does not move.
