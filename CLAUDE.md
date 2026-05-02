# Working on pangaea.blog

This repo is Adam's personal blog/curation site at https://pangaea.blog. Astro static site, deployed to Vercel.

## Adding a rift

A "rift" is one weekly issue. Each is a markdown file at `src/content/rifts/NNN-slug.md` with frontmatter for `app`, `essay`, `song`, and optionally `extra`. The schema lives in `src/content/config.ts`.

Default new rifts to `draft: true`. The build excludes drafts from the homepage, the rifts index, and the RSS feed.

## Conventions

- Brand color: iron-oxide red `#8a3b1f` (var `--accent` in `src/styles/global.css`).
- Type: serif body (Iowan / Charter / Georgia stack), sans for meta, mono for issue numbers.
- Issue numbering: zero-padded to 3 digits (`№ 001`).
- Voice: terse, considered, eclectic. Whole Earth Catalog energy.
- Don't add JavaScript unless there's a real reason. Astro emits static HTML and we want to keep it that way.

## Don't do

- Don't add a tracking pixel, ad network, or analytics that requires consent banners.
- Don't change the `--measure` past ~38rem; line length is intentional.
- Don't introduce a CMS. The git repo IS the CMS.
