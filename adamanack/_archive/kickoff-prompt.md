# Claude Code kickoff prompt

*Paste the block below as your first message in Claude Code after `cd`-ing into this folder.*

---

```
I'm picking up Poor Adam's Almanack from where Cowork left off. Read these
files in order before doing anything:

1. CLAUDE.md   — full project context, current state, decisions locked
2. spec.md     — design constitution (the bar)
3. ship-today.md — the eight-block action checklist

Quick state recap (full version in CLAUDE.md):
- We're mid-Block 1 (Gather)
- Farcaster: 500 casts fetched, in sources/farcaster/casts.json (covers
  2026-02-05 → 2026-04-06; older casts paused at a 429 — resume with
  scripts/fetch_chunk.py and longer sleeps)
- X archive: requested, in flight, fuels V1.1
- X drafts, Farcaster drafts, essay drafts: all pending manual sweep
- Serif default: EB Garamond unless I say otherwise

What I need from you, in order:

1. Resume the Farcaster fetch in the background. Modify
   scripts/fetch_chunk.py to use 5+ second sleeps and 429 backoff. Run it
   in chunks until you stop getting new casts. Save progress between runs.

2. Help me work the manual draft sweep. I'll paste batches of X drafts,
   Farcaster drafts, and essay text into chat. Save them to sources/ in
   the right files (twitter-drafts.txt, farcaster-drafts.txt,
   essays/<slug>.md).

3. When sources/ is full, write scripts/extract.py that produces
   corpus/raw.txt — one candidate line per row, deduplicated. Show me the
   count.

4. Then we triage together (Block 3) — you do a first-pass A/S/N
   auto-tag, I review batches.

Don't change scope. Don't add sections. Don't write new aphorisms.
Curate what exists.

Start by running the three reads above and then proposing the next
concrete action.
```

---

## How to use Claude Code with this project

1. Open a terminal at the project folder. The project lives in your `aether` workspace:
   - macOS / Linux: `cd ~/Desktop/aether/poor-adams-almanack`
   - Windows PowerShell: `cd "$HOME\OneDrive\Desktop\aether\poor-adams-almanack"`
   - Or in File Explorer / Finder: right-click the folder → Open in Terminal
2. Run `claude` (the Claude Code CLI). It'll auto-load `CLAUDE.md`.
3. Paste the prompt above as your first message.
4. From there, work the blocks of `ship-today.md` until the book ships.

If `claude` isn't installed yet: `npm install -g @anthropic-ai/claude-code`, then `claude` to authenticate.

## Optional: tell Claude Code about your other tools

If you have Pandoc, a TeX distribution (MacTeX or BasicTeX or TinyTeX), or Typst already installed, mention that in your first message — saves Claude from having to detect or install. If you don't have any of them, Claude Code can install them via Homebrew/apt.
