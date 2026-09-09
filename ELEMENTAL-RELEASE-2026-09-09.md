# Elemental release, 2026-09-09

## Shipped

- Pele: clarified public home for businesses created through Summon. Red/fire. Masterplan and target of 1,000 businesses recorded.
- Pangaea: green/earth UI tokens, including dark theme and standalone share view. Goal of 1,000 essays recorded.
- Pacifica: blue/water UI tokens, preserving existing release artwork and all live pages. Goal of 1,000 songs recorded.
- Summon: reciprocal Pele kin and reviewed business-home contract committed locally. No Summon runtime or landing deployment.

## Production receipts

- Pele: dpl_k2KYaB7XR3oZ881gAMpWBGVJmyh5, source Git, commit 49583b2ad654211b215719867e0c1a034f451e06.
- Pangaea: dpl_AdxXF1aG1ivAnprvBgXAbGXqfQMu, source Git, commit 3d1bb85.
- Pacifica: dpl_EF1K1MMLtmGXdj9K8tKcMpg8wJ38, prebuilt production release, palette commit 428931e on codex/elemental-release-20260909.

Pacifica's prior production included uncommitted changes. Its release was prepared from the exact previously deployed assets, changing only style.css and adding tokens.css. Eleven other assets, including HTML and artwork, were verified byte-identical against the prior deployment. Its older remote main was not pushed as production because that would omit previously deployed pages. The palette source is backed up on the release branch. A future full-source deployment must first reconcile the previously deployed baseline with Git; do not deploy the old main blindly.

Unrelated checkout changes were left on disk and excluded from our commits. Summon's working branch has six earlier unpublished commits, so this task did not push that branch and publish unrelated history. The new contract is committed locally as 16ac78b1c.

## Validation

Live HTTPS 200 for all three homepages. Desktop 1440px and mobile 390px pass with one H1, correct computed accents, and no horizontal overflow or page errors. Pangaea's dark accent is #8fc9a7. Pele's work navigation reaches its target. Pacifica private-document probes return 404.

Pele analytics collection is verified: POST /eee59444baf07149/view returned HTTP 200. These were marked verification visits using a normal browser identity. The analytics script intentionally excludes webdriver/headless sessions, explaining earlier missing collection. This confirms transport acceptance, not real audience traffic or dashboard reporting. Pangaea collection was not observed during this check; Pacifica retains its existing no-script CSP and no analytics was added.

Pele check/build, Pangaea build, and Pacifica's five existing site tests passed before release. The successful Pangaea cloud deployment resolves the release concern raised by its older local adapter's runtime warning; no runtime migration was introduced.

repos.chat: all four scoped identities valid. Workspace verifier output: 152 claims confirmed by a real path, 0 unverifiable, 4 broken, 7 warnings. The unrelated findings are unchanged. No exchanges or watchers were started.

## Still open

Owner decisions: completion/counting rules and verified starting totals for businesses, songs and essays; whether to configure Search Console, external uptime monitoring, and a Lighthouse baseline. No invented counts or deadlines.

Local screenshots and machine-readable checks are retained in Pele's ignored verification directory. MASTERPLAN.md is the stable Pele constitution. Saved Codex project 🌋 pele.business is confirmed present.
