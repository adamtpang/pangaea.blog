# Pangaea — design brief

Paste this into any design prompt (claude.ai/design, v0, a human designer) to build on-brand Pangaea screens. Values are the real tokens from `src/styles/tokens.css`, the single source both stylesheets import.

**Identity:** A hub for the spoken & the written word. Quiet, considered, built to last. Whole Earth Catalog meets sive.rs. The bareness is the message.

## Universal principles (both modes)

- **Serif-forward.** Single narrow column, ~640px (`38rem`) max reading width. Generous whitespace.
- **1px hairline rules**, used sparingly. **No drop shadows. No gradients** (flat fields only). Rounded corners 0–2px max.
- **Color is never the only affordance** — links stay underlined. All text clears WCAG AA.
- **No ad-era cruft:** no popups, no cookie banners, no newsletter modals, no social-share buttons, no "related posts," no visible analytics.
- **Punctuation:** no em dashes (—) or en dashes (–) in any copy. Use commas, colons, semicolons, periods, parentheses.
- **Motion:** none beyond simple opacity fades. Honor `prefers-reduced-motion`.

Pangaea has **one palette** (below) and **two layout modes** on top of it. The
palette never changes between them.

## The palette — "the daily page"

It came from the writing surface at `/daily`, and the whole site now wears it:
paper you want to write on, ink you can read for an hour, one warm accent that
means "link", and a gold that means "ours". One voice across all three threads:
**music, philosophy, tech & business.**

Real tokens live in `src/styles/tokens.css`, imported by both stylesheets.

| Token | Hex | Role |
|---|---|---|
| Paper | `#fbf7f0` | warm sheet, the default background |
| Paper 2 / 3 | `#f5efe4` / `#efe7d8` | inset bands, pressed states, meter troughs |
| Surface | `#ffffff` | inputs, the share frame |
| Ink | `#1c1917` | body text and every heading |
| Ink soft | `#403a34` | secondary prose |
| Ink mute | `#6b625a` | meta, timestamps, captions |
| **Terracotta** | `#b34a2f` | **interaction only**: links, focus rings, reading-flow accent bars, active state |
| Terracotta deep | `#8f3721` | hover / pressed |
| Terracotta tint | `#e8cfc3` | decorative rules, selection |
| **Gold** | `#8a6d34` | **identity only**: brand mark, № issue badges, /share masthead stripe, graph nodes, progress. Never links/interaction. |
| Gold soft | `#c9b183` | decorative only, never text |
| Hairline | `#d9cfbe` / `#e7decf` | rules, borders |

**The three threads** — `--music #6d5580` plum, `--philosophy #4f6656` moss,
`--tech #3f6070` slate — are for **topic markers only** (tag chips, thread
labels). Never body text, never a heading, never a link.

**Discipline:** terracotta = things you click; gold = who it is; paper = the
page. Headings stay `ink`, never colored. The body carries a faint two-wash plus
fractal-noise grain: texture, not pattern.

**Type:** **Fraunces** for display (headings, wordmarks) over **Newsreader** for
body. Serif throughout, no sans anywhere (`--sans` deliberately resolves to the
body serif). Mono (`"IBM Plex Mono", Menlo, Consolas`) only for issue numbers
and code.

## Mode A — the hub (essays, lists, daily, podcast, graph)

Calm, legible, built for long reading. Header with wordmark + nav, footer,
`36rem` measure, post lists and media grids. Uses `Base.astro` + `global.css`.

## Mode B — the monastery (the front door, Pilot)

Austere, audio-first, maximum restraint. Single 640px column, **no nav**, no
CTAs, no "subscribe": it assumes the reader already knows why they are here. No
imagery except album covers and pull-quotes, set **huge**
(`clamp(2.2rem, 6vw, 4.5rem)`), italic, attributed in small caps. Uses
`PilotLayout.astro` + `pilot.css`.

Mode B is a *layout* discipline, not a separate color scheme. It shares the
palette above; do not give it a local `:root`.

## Choosing a mode

- Reading / browsing / writing surface (essays, lists, `/daily`, podcast, graph) → **Mode A**.
- A single audio work, or the front door, where stillness is the point → **Mode B**.

When unsure: serif, warm paper, one terracotta accent, narrow column, hairlines,
no shadows. That is always Pangaea.

---

## The token architecture (added 2026-08-24)

`tokens.css` now carries **shadcn/ui's token architecture with Pangaea's own
values**. Three things came from shadcn, one deliberately did not.

**Adopted:**

- **Semantic pairs**, so a shadcn-shaped component or snippet is on-brand the
  moment it lands: `--background/--foreground`, `--card/--card-foreground`,
  `--popover/--popover-foreground`, `--primary/--primary-foreground`,
  `--secondary`, `--muted-bg/--muted-foreground`, `--accent-bg/--accent-foreground`,
  `--destructive`, `--border`, `--input`, `--ring`, `--chart-1..5`. Every one is
  an alias onto an existing Pangaea token, so the brand cannot drift.
- **A radius scale derived from one source** (`--radius`, then `-sm/-md/-lg/-xl`).
- **The three-state theme pattern**, which is how dark mode finally arrived.

**Not adopted:** shadcn's `0.625rem` radius and its card shadow. This file says
flat, 0-2px corners, and a reading page is not a dashboard. `--radius` is `2px`.

**No React, no Tailwind, no build step was added.** The stack is Astro with
hand-written CSS; installing shadcn's CLI would have meant importing a whole
React toolchain to style a text site that ships almost no JS on purpose.

## Dark mode

The site was light-only until now. Dark redefines the **base** tokens (not just
the shadcn aliases), which is why every existing rule in `global.css` and
`pilot.css` follows along untouched.

Three states, because the viewer has three: an explicit `data-theme="dark"`
stamp, an explicit `data-theme="light"` stamp, and the default "system" with no
stamp at all, where only `prefers-color-scheme` decides.

| Token | Light | Dark |
|---|---|---|
| `--paper` | `#fbf7f0` | `#14110f` |
| `--paper-2` | `#f5efe4` | `#1b1714` |
| `--paper-3` | `#efe7d8` | `#221d19` |
| `--surface` | `#ffffff` | `#1b1714` |
| `--ink` | `#1c1917` | `#f2ebdf` |
| `--ink-soft` | `#403a34` | `#d6ccbc` |
| `--ink-mute` | `#6b625a` | `#a2988a` |
| `--accent` | `#b34a2f` | `#dd7551` |
| `--gold` | `#8a6d34` | `#cfab63` |
| `--rule` | `#d9cfbe` | `#332b25` |

Terracotta and gold both **lift** on the dark ground; the light values sink to
roughly 2:1 there and stop being readable. The threads lift too.

## Verified, and not verified

**Verified.** Contrast on the dark ground `#14110f`, computed from the real hex
values: ink 15.87:1, ink-soft 11.84:1, ink-mute 6.62:1, accent 6.03:1, gold
8.65:1. All clear WCAG AA. The full build passes. A grep confirms zero
hardcoded colors remain in `global.css` or `pilot.css`; the page washes, the
cadence band, and code backgrounds are all tokens now, so none of them leave a
light-theme glow sitting on a dark ground.

**Not verified.** Nothing was checked against rendered pixels. The browser pane
would not composite frames (it reports `clientWidth: 0`), so screenshots were
unavailable and the one in-page measurement returned empty custom properties
and a fake 1.00 contrast, which is the known artifact of measuring a hidden
pane rather than a real failure. **Open the site in a real browser and toggle
the OS theme before trusting the dark pass.** Contrast is sound by arithmetic;
what has not been seen is layout and feel.

**Colours were converted, never re-picked.** OKLCH values for the exact
palette, via `~/.claude/skills/beautify/scripts/hex_to_oklch.py`:
paper `oklch(0.9773 0.0102 81.80)`, ink `oklch(0.2161 0.0061 56.04)`,
terracotta `oklch(0.5432 0.1432 35.49)`, gold `oklch(0.5512 0.0835 82.37)`.
