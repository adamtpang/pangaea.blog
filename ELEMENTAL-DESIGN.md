# Elemental sibling design contract

Owner direction, 2026-09-09: Pele, Pangaea, and Pacifica are reciprocal kin repositories with a red, green, and blue design family.

| Repository | Purpose | Element | Accent | Hover | Quiet surface |
| --- | --- | --- | --- | --- | --- |
| pele.business | Business and ventures | Fire | #b83224 | #92271d | #f8eae4 |
| pangaea.blog | Philosophy and essays | Earth | #2f6b4f | #24533d | #e4eee6 |
| pacifica.surf | Music and its fictional world | Water | #176079 | #10495e | #e3eff3 |

## Standing creative goals

Owner confirmed, 2026-09-09:

- Pele: 1,000 businesses, created through summon.company, with Pele as their home. Red, fire.
- Pacifica: 1,000 songs. Blue, water.
- Pangaea: 1,000 essays. Green, earth.

These are long-term goals, not claims of completed output. No deadline or current count was established by this clarification. Track real businesses, songs, and essays separately from ideas, drafts, repositories, and website setup. Detailed completion criteria remain to be defined; do not silently substitute revenue, profitability, or publication thresholds.

## Shared implementation contract

Each site exposes --brand-accent, --brand-accent-hover, --brand-accent-quiet, --brand-paper, and --brand-ink in its production stylesheet. They map to that site's existing tokens and preserve its typography, layout, content and theme behavior.

Pele owns src/styles/global.css. Pangaea owns src/styles/tokens.css, plus the standalone share page and graph color use. Pacifica owns public/tokens.css, imported by public/style.css. No runtime fetch or dependency on another sibling is required.

Use readable ink on pale surfaces, a restrained accent for interactions and identity, generous space, visible keyboard focus, and reduced-motion support. Pangaea keeps its reading measure and serif system. Pacifica keeps its italic wordmark, music-led artwork and utility sans. Pele keeps its original volcano and editorial business layout. Do not make the three sites identical.

Pangaea's dark theme uses lighter green accents. Topic markers use music blue, philosophy green and business red. Sentiment colors such as error red retain their functional meaning.

Artwork, music, characters and social profiles are outside this palette update. No release art recoloring or private identity disclosure is implied. This local kin relationship is not authorization to publish personal links on Pacifica.

## Repository coordination

All three repositories keep this same contract and declare the other two as kin because they jointly maintain this concrete token interface and palette mapping. A manual read-only recipe can audit each sibling's implementation and return drift evidence. Recipes need approval before execution; no watcher, exchange or automatic mutation is enabled by connecting them.

When this contract changes, update all three copies deliberately and verify the three manifests. Preserve unrelated work in each checkout. Validate actual styles and mobile/desktop rendering before claiming a palette change is complete.
