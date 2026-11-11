# Pangaea design brief

Paste this into any design prompt to build on-brand Pangaea screens. Values are the real tokens from `src/styles/tokens.css`, the single source both stylesheets import. The `/share` frame keeps a copied set of the same values because that page cannot import a stylesheet.

**Identity:** Adam Pang's essays. Quiet, considered, built to last. A risograph print (spring green ground, terracotta line, white paper showing through) with the slow whitespace of a quiet luxury house. The bareness is the message.

## Universal principles

- Serif throughout. Reading width stays near `36rem` (`--measure`). Do not push a line past about 38rem. Generous whitespace.
- 1px hairline rules, used sparingly. No drop shadows. No gradients on public pages (flat fields only). Corners stay at 0 to 2px. `--radius` is `2px`.
- Color is never the only affordance. Links stay underlined. All text clears WCAG AA on `--paper`.
- No ad-era cruft: no popups, no cookie banners, no newsletter modals, no social-share buttons.
- Punctuation: do not use em dashes or en dashes in any copy. Use commas, colons, semicolons, periods, or parentheses.
- Motion: none beyond a short opacity fade. Honor `prefers-reduced-motion`.

## Color

Spring green is the ground. Terracotta is the line (links, the progress fill, issue numbers). White is the highlight (inputs, thumbnail wells, the meter track). Headings stay `--ink`. Never color a heading.

| Token | Light | Dark | Role |
| --- | --- | --- | --- |
| `--paper` | `#c3d398` | `#1c2618` | Ground. Page background. |
| `--paper-2` | `#d5e4b8` | `#24301f` | Lifted band. |
| `--paper-3` | `#e7ecd6` | `#2c3826` | Pressed, inset. |
| `--surface` | `#f7f4ea` | `#263528` | White highlight. |
| `--ink` | `#2c241c` | `#f4f1e6` | Body and headings. About 9.5:1 on light paper. |
| `--ink-soft` | `#3f3228` | `#e4d8c8` | Secondary prose. |
| `--ink-mute` | `#5c4034` | `#cbbba8` | Dates, counts, captions. About 5.8:1 on light paper. |
| `--accent` | `#8f3d2c` | `#e7b5a6` | Terracotta line. Links, focus, active sort, progress fill. 4.5:1 on light paper. |
| `--accent-deep` | `#6e2e22` | `#f3d2c6` | Pressed terracotta. |
| `--accent-tint` | `#ead9cf` | `#3a2a24` | Wash, selection. |
| `--gold` | `#8f3d2c` | `#e7b5a6` | Same line as `--accent`. Issue numbers and the progress fill. |
| `--rule` | `#c9b39a` | `#3d4a34` | Hairline. |
| `--rule-soft` | `#d7c7b4` | `#31402c` | Quieter hairline. |

`--bg`, `--muted`, and `--land` are aliases. New rules use the names above.

Neutrals for topic chips only, never body text or links: `--music`, `--philosophy`, `--tech`.

Dark mode redefines the base tokens, so `global.css` and `pilot.css` follow without a second stylesheet. Three states: `data-theme="dark"`, `data-theme="light"`, and no stamp, where `prefers-color-scheme` decides.

## Type

| Token | Face |
| --- | --- |
| `--display` | Fraunces. Wordmark, headings, essay titles. |
| `--serif` | Newsreader. Body, navigation, dates. |
| `--sans` | Alias of `--serif`. There is no sans. |
| `--mono` | IBM Plex Mono, Menlo, Consolas. Code, and figures that must line up. |

| Token | Size |
| --- | --- |
| `--text-sm` | `0.85rem` |
| `--text-base` | `1rem` |
| `--text-lg` | `1.2rem` |
| `--text-xl` | `clamp(1.7rem, 1.4rem + 1vw, 2.4rem)` |

Body size on the page is `clamp(17px, 16.1px + 0.25vw, 19px)`. Reading line height is 1.66. An essay world may tighten that so a short essay can sit beside its picture.

## Space

| Token | Size |
| --- | --- |
| `--space-1` | `0.25rem` |
| `--space-2` | `0.5rem` |
| `--space-3` | `0.75rem` |
| `--space-4` | `1rem` |
| `--space-5` | `1.5rem` |
| `--space-6` | `2.25rem` |
| `--space-7` | `3.5rem` |
| `--space-8` | `5.5rem` |

Use the scale for new layout. The directory, the header, and the footer share `--measure`.

## Radius, borders, links, motion

Borders are `1px solid var(--rule)`. The radius scale (`--radius-sm` through `--radius-xl`) stays inside 1px to 4px. No card shadow. shadcn's semantic pairs (`--background`, `--foreground`, `--card`, `--ring`, and the rest) alias these tokens. The stack stays Astro and hand-written CSS.

Links are `--accent`, underlined, offset about 3px. Hover may thicken the underline or move to `--accent-deep`. The wordmark is `--ink` and not underlined at rest. Hover turns it terracotta and underlines it.

The sort control is quiet: uppercase, `--text-sm`, tracked. The active choice is `--ink`. The other choice is `--ink-mute`, still underlined.

| Token | Value |
| --- | --- |
| `--ease` | `cubic-bezier(0.2, 0.6, 0.2, 1)` |
| `--duration` | `180ms` |
| `--duration-slow` | `420ms` |

Directory thumbnails fade in over `--duration-slow` when they finish loading. `prefers-reduced-motion: reduce` skips that fade and every other transition.

## Two layouts, one palette

**The directory and the essay** (`Base.astro`, `global.css`). Header, narrow column, the essay list, the essay world. This is the front door.

**The still page** (`PilotLayout.astro`, `pilot.css`). A single column with no nav, for a page whose point is stillness. It is a layout, not a second palette. Do not give it a local `:root`.

## Per-essay palettes

`src/lib/palette.ts` reads an essay's image at build time, quantizes it, and replaces the color tokens (`--paper`, `--ink`, `--accent`, `--surface`, `--rule`, and the aliases) on that page's `<html>`. Text and link colors move along the sampled hue until they clear WCAG AA (4.5:1 for links and meta, 7:1 for body). No image, or a file that cannot be read, leaves the site palette in place.

Type, space, radius, and motion do not change on an essay page. Only color is replaced, so the header and the page move together. The Spotify player sits on `--player`, a slight mix of the sampled paper and ink, and the embed theme follows that surface.
