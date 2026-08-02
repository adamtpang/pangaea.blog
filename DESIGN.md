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
