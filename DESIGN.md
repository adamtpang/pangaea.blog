# Pangaea — design brief

Paste this (or the relevant mode) into any design prompt — claude.ai/design, v0, a human designer — to build on-brand Pangaea screens. Values are the real tokens from `src/styles/global.css` and `src/styles/pilot.css`.

**Identity:** A hub for the spoken & the written word. Quiet, considered, built to last. Whole Earth Catalog meets sive.rs. The bareness is the message.

## Universal principles (both modes)

- **Serif-forward.** Single narrow column, ~640px (`38rem`) max reading width. Generous whitespace.
- **1px hairline rules**, used sparingly. **No drop shadows. No gradients** (flat fields only). Rounded corners 0–2px max.
- **Color is never the only affordance** — links stay underlined. All text clears WCAG AA.
- **No ad-era cruft:** no popups, no cookie banners, no newsletter modals, no social-share buttons, no "related posts," no visible analytics.
- **Punctuation:** no em dashes (—) or en dashes (–) in any copy. Use commas, colons, semicolons, periods, parentheses.
- **Motion:** none beyond simple opacity fades. Honor `prefers-reduced-motion`.

Pangaea has **two modes.** Pick one per surface.

## Mode A — "The Blue Marble" (the hub: blog, podcast, graph)

Earth seen from space. Calm, legible, built for long reading.

| Token | Hex | Role |
|---|---|---|
| Background | `#f3f7f6` | sea-mist white |
| Surface | `#ffffff` | inset cards |
| Ink | `#14201f` | body text (abyssal near-black) |
| Muted | `#4d635f` | meta text (slate-teal) |
| Hairline | `#cad9d3` | rules, borders |
| **Ocean blue** | `#176079` | **interaction only**: links, focus rings, reading-flow accent bars |
| Shallow water | `#6a9bad` | decorative borders / hovers |
| **Pangaea green** | `#2f6b4f` | **identity only**: brand mark, № issue badges, structural stripes, progress. Never links/interaction. |
| Lichen | `#8fb6a1` | quiet green accents |

**Discipline:** blue = ocean = things you click; green = supercontinent = who it is; white = sky = space. Headings stay `ink`, never colored.

**Type:** serif body — `"Iowan Old Style", Charter, Georgia, Cambria, serif`. Sans for meta/labels — `"IBM Plex Sans", system-ui`. Mono for numbers/code — `"IBM Plex Mono", Menlo, Consolas`.

## Mode B — "The Monastery" (the audio publication: home, Pilot)

Pure, austere, audio-first. Maximum restraint.

| Token | Hex | Role |
|---|---|---|
| Paper | `#ffffff` | pure white background |
| Ink | `#000000` | pure black text |
| **Terracotta** | `#9e3c1b` | the single warm accent: link-hover, top stripe, album cover |
| Muted | `#555555` | timestamps, attribution |
| Hairlines | `#000000` | pure black, 1px |

**Type:** Times New Roman (or EB Garamond) serif **throughout. No sans-serif anywhere.**

**On top of the universal rules:** no imagery except album covers and pull-quotes. Pull-quotes set **huge** (`clamp(2.2rem, 6vw, 4.5rem)`), italic, attributed in small caps. No nav. No CTAs, no "subscribe." Assumes the reader already knows why they're here.

## Choosing a mode

- Reading / browsing surface (essays, lists, podcast, graph) → **Mode A (Blue Marble)**.
- A single audio work, or the front door, where stillness is the point → **Mode B (Monastery)**.

When unsure: serif, white, one accent, 640px column, hairlines, no shadows. That is always Pangaea.
