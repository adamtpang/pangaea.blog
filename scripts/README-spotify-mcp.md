# Spotify MCP

Lets Claude search, read, and manage a real Spotify account: liked songs,
recently played, playlists (full CRUD), playback control, queue.

Upstream: [verIdyia/spotify-mcp](https://github.com/verIdyia/spotify-mcp)
(MIT, forked from `varunneal/spotify-mcp`, updated for the Spotify Web API's
February 2026 changes).

## Two pieces

1. **MCP server** — configured in `.mcp.json`, runs via `uvx` straight from
   git (no local clone to maintain; every launch pulls the current source).
   Claude talks to this.
2. **OAuth token** — a one-time browser login that only Adam can do. Saved to
   `~/.spotify_mcp_cache.json`, auto-refreshes after that.

## What only Adam can do (two steps, ~5 minutes)

Claude cannot retrieve a Developer Dashboard secret or complete an OAuth
login on your behalf — both require your own Spotify account.

### 1. Add a redirect URI to the existing app

Reuse the same Spotify app vibecheck.style already uses (client ID
`e4435ec6b82f42189d94e6229acad817`) rather than creating a second app — you
are already the owner, so this costs none of the app's 5 test-user slots.

1. [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard) → the vibecheck.style app → **Edit Settings**
2. Under **Redirect URIs**, add: `http://127.0.0.1:8080/callback`
3. Save
4. Copy the **Client Secret** (click "View client secret") — you will need it
   in step 2 below. Do not paste it into a chat with Claude; set it as an
   environment variable instead (next step explains exactly how).

### 2. Set the credentials as environment variables, then authenticate

`.mcp.json` references `${SPOTIFY_CLIENT_ID}` / `${SPOTIFY_CLIENT_SECRET}` —
Claude Code resolves those from your OS environment, so the secret never
lives in a file that gets committed to this (public) repo.

**Windows (PowerShell, permanent):**
```powershell
[Environment]::SetEnvironmentVariable('SPOTIFY_CLIENT_ID', 'e4435ec6b82f42189d94e6229acad817', 'User')
[Environment]::SetEnvironmentVariable('SPOTIFY_CLIENT_SECRET', 'paste-the-secret-here', 'User')
```
Restart your terminal (and Claude Code) after setting these so the new
variables are picked up.

**Then run the one-time auth flow** (opens a real browser, you log in and
approve — this is the login step that must be yours):
```powershell
uvx --python 3.12 --from git+https://github.com/verIdyia/spotify-mcp spotify-mcp --auth
```
This writes `~/.spotify_mcp_cache.json`. After that, the `spotify` server in
`.mcp.json` just works — tokens auto-refresh, no repeat login.

## Requirements and known limits (from the README, not guessed)

- **Spotify Premium** required on the account that owns the developer app,
  since Spotify's Feb 2026 API changes.
- **5 authorized users max** in Dev Mode. The app owner is not one of the 5 —
  only matters if you also authorize other people against this same app.
- Playback-control tools (`spotify_playback`, `spotify_queue`,
  `spotify_devices`) need an actual active device: Spotify open and playing
  somewhere.
- Search is capped at 10 results per query (down from 50, per Spotify's own
  Feb 2026 change). `popularity` is no longer returned on track objects.

## Available tools

| Tool | What it does |
|---|---|
| `spotify_playback` | get / start / pause / skip / previous / volume |
| `spotify_search` | search tracks, albums, artists, playlists |
| `spotify_queue` | view and add to the play queue |
| `spotify_get_info` | full details for any item by Spotify URI |
| `spotify_playlist` | create / read / update / delete, add/remove tracks |
| `spotify_liked_songs` | get saved songs (optionally with genre enrichment), like/unlike, check |
| `spotify_recently_played` | recently played tracks with timestamps |
| `spotify_devices` | list devices, transfer playback |

## Verified before wiring this up

`uv sync` against a scratch clone of the upstream repo installed cleanly (21
packages, `spotify-mcp==0.4.0`), confirming the dependency tree resolves on
this machine before asking Adam to spend time on the credential steps above.
