---
description: Visualize every artifact in a Pangaea collection moving through its checklist (stub to published).
allowed-tools: Bash, Read, Grep, Glob, mcp__visualize__read_me, mcp__visualize__show_widget
---

Pangaea already tracks a per-artifact checklist on the homepage (`src/pages/index.astro`,
the "parts" ledger): each piece is a stack of layers, not a single finished/unfinished
flag. This command renders that same checklist as a live board, one chip per artifact,
so it's obvious at a glance where the backlog actually sits, not just the aggregate count.

Argument (`$ARGUMENTS`): which collection to visualize. Default to `essays` if empty.

## 1. Know the checklist for the collection

Read the `parts` array in `src/pages/index.astro` for the real stage names. As of this
writing:

- **essays** (`src/content/posts/`): stub (body still contains `[Stub. Open this in
  /studio`) -> written (has a real body) -> blurbed (`blurb:` set) -> tagged (`tags:`
  set, not `[seedling]`) -> published (`draft: false`)
- **apps** (`src/content/apps/`): has a live `url:` -> has a `blurb:` -> has a `cover:`
  -> published (`draft: false`)

If asked for a collection not listed here, read its schema in `src/content/config.ts`
and its own draft/published convention before inventing stages.

## 2. Compute real per-artifact stage data

Don't estimate. Read every file in the collection and classify it by the FURTHEST
stage it has actually cleared (an artifact that's published also counts as written,
blurbed, and tagged; only report its furthest stage in the board). A quick way for
essays:

```bash
python3 -c "
import re, glob
files = glob.glob('src/content/posts/*.md') + glob.glob('src/content/posts/*.mdx')
for f in files:
    c = open(f, encoding='utf-8').read()
    # classify: stub / written / blurbed / tagged / published, print title + stage
"
```

Get real titles for every non-stub item (there won't be many); the stub bucket is
usually too large to enumerate individually, so just get its count.

## 3. Render the board

Call `mcp__visualize__read_me` with `modules: ["data_viz"]` if not already loaded this
session, then `mcp__visualize__show_widget` with an HTML kanban: one column per
checklist stage, in order, header = stage name + count. Individually-named chips for
every non-stub artifact (title as the chip label). The stub stage is almost always too
large for individual chips: render it as a compact aggregate tile (dot grid or a single
count block), not 400 individual pills.

Color by stage meaning, not sequence: gray for not-yet-started (stub), coral for
in-progress (written/blurbed/tagged), amber/gold for done (published) — this mirrors
Pangaea's own site convention where gold means "shipped" and terracotta means
"in motion."

## 4. Report

One or two lines in your response (not in the widget) naming the real bottleneck: which
stage is holding the most artifacts, and what the single next unblocking action is
(usually "write the next stub" per `tools/rep.ps1`).
