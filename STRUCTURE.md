# Pangaea — structure plan

How the flat blog becomes a scaffolded, interlinked, Obsidian-graph body of work that scales to 1,000 essays without clutter. Distilled from a research pass on the canon (Graham, Sivers, Popova, Visakan, Matuschak, Appleton, Gwern, Kottke, Collison, Godin, et al.) and a deep-dive on the three exemplars Adam loves.

## Finding: there is no old blog to migrate

A full crawl of adampang.com found **no `/blog`, `/essays`, `/writing`, or archive** (all 404). The site is a link-directory landing page: `/`, `/about`, `/now`, `/ns`, `/support`. Every page points to pangaea.blog as where the writing happens. The Wayback Machine was unreachable from the crawl, so a removed older version can't be ruled out (check it from a browser if you believe one existed). Net: **the writing was never on the old site. The seeds live in your X/Farcaster and your head, not in a recoverable archive.**

### Recovered write-about seeds (real, from the site's own themes)

1. The infinite game / compounding by shipping in public
2. Why I support myself without investors or employers (the owned-media economics)
3. Leaving Guam for Network School (personal narrative)
4. strummer.fun and "check your vibe weekly" (music as a personal time capsule)
5. The project constellation (summon, optimism.fun, deathmoney, sellsniper, book.movie) as build-log essays
6. Reading-list reactions (Deutsch, Rockefeller, Elon)
7. The Network School diary (currently an off-site X thread: x.com/adamtpang/status/1914254825816227954)

## The lessons that matter most (the canon, compressed)

- **Write to surprise yourself, then cut hard** (Graham). If nothing surprised you while writing it, don't publish it. Fast ugly draft, then ruthless simplification to one non-obvious claim.
- **Standardize a tiny atomic unit** (Sivers). One post = one idea, often under 300 words, title that IS the thesis. Makes post #500 as frictionless as #5.
- **Title by the claim, not the topic** (Matuschak). "Agency = Judgment x Action," not "On Agency." Concept-titles are the bricks wiki-links snap into.
- **Cadence beats any single post** (Godin, Kottke, Popova). Set a floor you can hit forever; protect it by allowing tiny linkblog posts on dry days. The streak is the strategy.
- **Surface maturity** (Appleton). Tag pieces seedling / growing / evergreen. This licenses early publishing, the direct cure for the posting aversion.
- **Treat posts as perpetual drafts; date the revisions** (Gwern). Created + modified dates. A stream of small edits compounds; it tells readers the work is alive.
- **Mine your own archive** (Popova). Resurface an old post weekly. Wiki-links turn the back-catalog into a living network.
- **Anchor essays + a guided path keep 1,000 pieces from becoming a "big ball of mud"** (Visakan). This is the structural key, below.

## The structural gap: you have the engine, not the steering

Visakan is the exemplar of exactly what Pangaea wants: 1,000+ interconnected pieces that stay navigable. He does it with (a) a handful of **anchor essays** everything links back to, (b) a **/start guided reading path**, (c) associative **prev/next by theme**, and (d) a **/memex map** of recurring motifs over his public graph. Pangaea already has the engine Visakan built by hand (the `/graph` + `[[wiki-links]]`). What's missing is the **human curation layer on top.**

## The model: three layers on the existing `posts` collection (no rebuild)

1. **Flat spine (exists).** `src/content/posts/`, one file per essay, `/posts` index with search/sort/tag/cadence. Source of truth. Keep `draft: true` default and the `№` odometer.
2. **Anchor essays (~12-20).** The hubs everything wiki-links into. A frontmatter flag, not a new collection: `anchor: z.boolean().default(false)`. Anchors are the only nodes allowed to grow large in the graph. Seed them from the recovered theses + existing posts ("Why a thousand" is already one in spirit).
3. **Topic spine pages (~10-14, hand-curated, NOT auto-tags).** Sivers tames 555 posts with ~14 topic pages. Build `/topics/{slug}` from a hand-written `src/data/topics.ts`. Each page: one thesis line + the anchor for that theme + a tag-filtered post list. Candidate spine: building-in-public, music, philosophy, network-school, leverage, agency, books, guam, the-1000.

Uncluttered at 1,000 = the homepage and nav never grow; scale is absorbed by the `/posts` filter, ~14 fixed topic pages, and the graph. Nothing paginates.

## Interlinking discipline (the part that was missing)

1. **Title by the claim.** (above)
2. **Every post wiki-links into >=1 anchor.** The non-negotiable rule that keeps the graph connected instead of a dust cloud.
3. **Tags are a closed vocabulary** (the ~14 topic slugs), validated in the scaffolder. Tag = which topic page you appear on. Wiki-link = idea-to-idea association. Keep the two jobs separate.
4. **Wiki-link on first mention.** If an idea recurs across posts, that recurrence is the signal to make it an anchor.
5. **Backlinks.** Invert the edge list `graph.astro` already builds; render "Referenced by" at the foot of each post. Old anchors accrue value as new posts point at them.

## Graph upgrades (turn the toy into a memex)

All in the existing `src/pages/graph.astro`, no new deps:
1. **Size nodes by degree** so anchors visibly bulge (landmasses vs islands).
2. **Color by topic tag** (blue-marble hues), keep anchors green `--land`.
3. **Labels on hover** + always-on for anchors (1,000 always-on labels are mush).
4. **Search/highlight box** above the canvas; cap or freeze the sim past ~150-300 nodes (perf cliff).
Plus a new **`/map`** page: a static, prose "map of recurring motifs," one sentence per anchor linking to it. The force graph is the engine; `/map` is the human-readable legend.

## Navigation: five ways in (under 3 clicks at scale)

1. **Search** (`/posts`, the `/` shortcut) with tag count badges (`philosophy 47`) to signal depth.
2. **Topic spine** (`/topics/{slug}`).
3. **`/start`** guided reading path (~10 posts, philosophical to practical, + "if you read one thing").
4. **`/graph` + `/map`** for associative browsing.
5. **`/now`** (the Sivers convention; you already had the bones on adampang.com/now).

Nav: Read - Listen - Watch - Graph - Start, with Now / Topics / Map in the footer. Every post detail page shows its topic, its backlinks, and prev/next by theme, so depth-first reading never dead-ends.

## The post unit (lock it)

One claim, 150-400 words, claim-as-title, serif single column. Formalize the **image + essay + song** pattern as the default scaffold (the ownable house style and a real moat). Two lightweight variants to protect cadence: a **linkblog** post (`kind: 'link'`) and a **seedling** note. Add **created + modified dates**. Screenshot-essay (`/share/{slug}`, exists) is the last step of every publish.

## Workflow: capture -> scaffold -> ship (designed to defeat the aversion)

- **Capture:** repurpose `src/content/inbox/` as a zero-stakes idea buffer (one-line title files). Preload the 7 recovered seeds + the 10 almanack essays already there.
- **Scaffold:** upgrade `/write` (client-side, no API key): a topic `<select>` from `topics.ts`, prefill `status: seedling`, auto-insert a `[[anchor]]` link stub, and a "promote from inbox" picker.
- **Ship:** publish commits via the existing GitHub API route, then chain straight to `/share/{slug}`. Publishing as `seedling` means "allowed to be unfinished," the psychological unlock.

## Next actions (ordered)

1. Add 3 schema fields to `src/content/config.ts`: `anchor`, `status` (seedling/growing/evergreen), `updated`. Backward-compatible.
2. Designate ~12 anchors (`anchor: true`). Promote `inbox/agency.md` as the "Agency = Judgment x Action" anchor; keep "Why a thousand."
3. Topic spine: `src/data/topics.ts` + `src/pages/topics/[topic].astro`. Lock tags to these slugs.
4. Build `/start` (`src/pages/start.astro`): the guided reading path. Biggest navigation win.
5. Upgrade `/graph`: size by degree, color by topic, labels on hover, search box.
6. Add backlinks + prev/next-by-theme to `/posts/[...slug].astro`.
7. Upgrade `/write`: topic select, seedling default, `[[anchor]]` stub, promote-from-inbox.
8. Add `/now` and `/map`; update nav.

## The one risk above all

> Spending the next month on topic pages and graph polish is a sophisticated form of not-writing. The curation layer only matters once there's a corpus to curate.

**Mitigation: ship actions 1-2 and 4 (schema + anchors + /start), then WRITE 20 posts before touching the rest.** Build the minimum, then fill it. The structure is the steering wheel; it is useless without a car in motion.
