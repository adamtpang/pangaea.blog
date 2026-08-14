# Favorites: how an entry gets made

`/favorites` is a running record of what's actually taken root in Adam's
mind right now: people, music, channels, tools. Not a ranked "best of," not
a static about-page list. New entries show up whenever something real is
sitting in his attention, not on a schedule.

## The process, every time

1. **Interview, don't invent.** When Adam names something he's into (an
   artist, a channel, a person, a tool), ask real questions before writing
   anything: what specifically about it, since when, what it changed in how
   he thinks or works, is there a specific moment/video/song that's the real
   entry point. Never write the "why this matters" from a cold guess at his
   taste.
2. **Check the Obsidian vault first.** `C:\Users\adamp\ObsidianVault` often
   already has real notes on the same subject (a capture, a half-formed
   thought, a link he saved). Grep for the name before or alongside the
   interview; a real note beats a memory of the conversation. This is the
   same discipline already used for essay sourcing (see the Obsidian audit
   in the essay batches, and WRITERS-STUDIED.md).
3. **Scaffold the file.** `src/content/favorites/{slug}.md`:
   - `title`: the thing/person's actual name
   - `category`: music / video / person / tool / book / other
   - `blurb`: one line, in Adam's own words if he gave one, not a Claude
     paraphrase dressed up as his voice
   - `url`: the thing's own site/channel/profile, when there is one
   - `tags`, `cover` optional
   - body: the actual writeup, first person (Adam's voice, same house
     rules as posts: no em dashes, title is the claim where it applies)
4. **Embed when there's something to embed.** Same MDX kit as posts
   (`import { YouTube, Spotify, SoundCloud } from '../../components/embeds'`)
   — a channel gets a `<YouTube>`, an artist gets a `<Spotify>` track, not
   just a link.
5. **Stays `draft: true` until Adam says otherwise.** Same rule as every
   other collection here. Nothing publishes itself.

## Why this collection exists, distinct from /posts

A post is an argument: a claim, defended in 150-400 words. A favorite is
not an argument, it's a record: this specific thing is in my head right
now, here's why. Some favorites will later grow into a real essay (Aphex
Twin already has one: `src/content/posts/aphex-twin-is-the-shadow.md`) —
when that happens, link the two, don't duplicate the argument.
