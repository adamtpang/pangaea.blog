# Pangaea design

Calm editorial pages. A spring-green ground, a terracotta line, and a white highlight, set in Fraunces and Newsreader with room to breathe. The reference is a two-color risograph (soft green field, rust drawing, white paper showing through) and the quiet pace of brunellocucinelli.ai.

Source of truth: `src/styles/tokens.css`. `global.css` and `pilot.css` import it. Do not paste colors, fonts, or radii into a page. The `/share` frame keeps a copied set of the same values because that page cannot import a stylesheet.

Per-essay pages may override the color tokens. They do not invent a second type system, spacing scale, or motion.

## Color

Light theme, the default.

| Token | Value | Role |
| --- | --- | --- |
| `--paper` | `#c3d398` | Spring green ground. Page background. |
| `--paper-2` | `#d5e4b8` | Lifted green for bands. |
| `--paper-3` | `#e7ecd6` | Pale green, pressed and inset. |
| `--surface` | `#f7f4ea` | White highlight. Inputs, thumbnail wells, meter track. |
| `--ink` | `#2c241c` | Body text and headings. About 9.5:1 on `--paper`. |
| `--ink-soft` | `#3f3228` | Secondary prose. |
| `--ink-mute` | `#5c4034` | Dates, counts, captions. About 5.8:1 on `--paper`. |
| `--accent` | `#8f3d2c` | Terracotta line. Links, focus, the progress fill, the active sort. 4.5:1 on `--paper`. |
| `--accent-deep` | `#6e2e22` | Pressed terracotta. |
| `--accent-tint` | `#ead9cf` | Terracotta wash. Selection. |
| `--rule` | `#c9b39a` | Hairline. |
| `--rule-soft` | `#d7c7b4` | Quieter hairline. |

`--gold` matches `--accent` on purpose. Identity marks (issue numbers, the progress fill) are the same terracotta line as links. Underline still tells a link from a number.

Neutrals for topic chips only, never for body text or links: `--music`, `--philosophy`, `--tech`.

Dark theme keeps the same roles on a deep moss ground (`--paper: #1c2618`) with a light terracotta line (`--accent: #e7b5a6`). It follows `prefers-color-scheme` unless `data-theme` is set.

`--bg`, `--muted`, and `--land` are aliases. New rules use the names above.

## Type

| Token | Face |
| --- | --- |
| `--display` | Fraunces. Wordmark, headings, essay titles. |
| `--serif` | Newsreader. Body, navigation, dates. |
| `--sans` | Alias of `--serif`. There is no sans. |
| `--mono` | IBM Plex Mono. Code, and any figure that must line up in columns. |

Scale:

| Token | Size |
| --- | --- |
| `--text-sm` | `0.85rem` |
| `--text-base` | `1rem` |
| `--text-lg` | `1.2rem` |
| `--text-xl` | `clamp(1.7rem, 1.4rem + 1vw, 2.4rem)` |

Body size on the page is `clamp(17px, 16.1px + 0.25vw, 19px)`. Line height for reading is 1.66. The essay world tightens that so a short essay can sit beside its picture. Headings stay `--ink`. Do not color a heading.

## Space

A single step, then doubles. Use these instead of one-off margins.

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

`--measure` is `36rem`. Do not push a reading line past about 38rem. The directory and the header share that width. An essay world may grow wider so the picture can sit beside the text. The text column itself stays at `--measure`.

## Radius and borders

Flat. `--radius` is `2px`. The scale (`--radius-sm` through `--radius-xl`) stays inside 1px to 4px. No shadows. Borders are `1px solid var(--rule)`.

## Links and hover

Links are `--accent`, underlined, offset about 3px. Hover and current links use `--accent-deep` or keep `--accent` with a thicker underline. Color is never the only affordance.

The wordmark is `--ink` and not underlined at rest. Hover turns it terracotta and underlines it.

The sort control is quiet: uppercase, `--text-sm`, tracked. The active choice is `--ink`. The other choice is `--ink-mute`, still underlined.

## Motion

| Token | Value |
| --- | --- |
| `--ease` | `cubic-bezier(0.2, 0.6, 0.2, 1)` |
| `--duration` | `180ms` |
| `--duration-slow` | `420ms` |

Directory thumbnails fade in over `--duration-slow` when they load. `prefers-reduced-motion: reduce` disables that fade and every other transition. Do not add looping motion.

## Per-essay palettes

`src/lib/palette.ts` reads the essay image at build time, quantizes it, and writes the color tokens above (`--paper`, `--ink`, `--accent`, `--surface`, `--rule`, and the aliases). Text and link colors are moved along the sampled hue until they clear WCAG AA (4.5:1, 7:1 for body). No image, or a file sharp cannot read, leaves the site palette in place.

Type, space, radius, and motion do not change on an essay page. Only the color tokens are replaced, on the `<html>` element, so the header and the page move together.

The Spotify player sits on `--player`, a slight mix of the sampled paper and ink. The embed theme follows that surface: light paper gets the light player.
