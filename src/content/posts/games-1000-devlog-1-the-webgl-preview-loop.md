---
title: "GAMES-1000 Devlog #1: The WebGL Preview Loop, For Real This Time"
date: 2026-08-12
blurb: 'two shipped games, three real bugs, and the build pipeline that finally let me play them in a browser'
tags: [devlog, eyeland-cards, games-1000]
status: seedling
draft: true
---

Two entries into GAMES-1000 (eyeland.cards's 1,000-games pillar), and the actual work tonight wasn't design, it was plumbing: getting from "code that should work" to "a build I can click into a browser and actually play."

**Entry 002, Falling Block Clear**, shipped first as a console app to prove the mechanic (rotate, drop, clear a line) without fighting Unity's licensing. Real bug caught by playing it, not reading the code: `Render()` was labeling every locked cell with the *falling piece's* kind instead of the kind it actually locked in as. Fixed before it counted as shipped.

Then the harder problem: a console game isn't a game anyone else can play. Porting it to Unity WebGL surfaced two more real bugs:

- Default WebGL compression needs a server that sends `Content-Encoding` headers. A plain static file server doesn't, so the browser tried to parse compressed bytes as raw JS and failed. Fixed by disabling compression for local preview builds (itch.io's own pipeline handles this correctly, so it's a local-only tradeoff).
- A leftover scripting define from that build stayed active in the Unity Editor afterward, which meant hitting Play on the *actual* game (the card duel, entry 001) also booted the Falling Block Clear UI on top of it, eating every click. Fixed with a scene-name guard so an entry only ever boots in its own scene, not just behind a flag.

Along the way I went looking for an open-source Hearthstone template to build the duel off of, so entry 001 wouldn't need hand-rolled everything. Found nothing safe to build a commercial game on — every real Hearthstone clone is either unlicensed or, in one case, AGPL copyleft (which would force open-sourcing the whole game to use it). But `CardHouse` (Pipeworks Studios, CC0) had a real, provably-uniform Fisher-Yates shuffle worth stealing the *idea* from — eyeland's own shuffle was doing `OrderBy(_ => rng.Next())`, the classic sort-by-random-key pattern that isn't proven uniform. Reimplemented Fisher-Yates properly in eyeland's own code rather than pulling in CardHouse's MonoBehaviour machinery wholesale.

End state: both shipped entries now load clean in a browser at a local preview hub, `Builds/WebGL/`, that'll pick up every future entry automatically — no more per-game server config.

Next: whichever of the six queued entries (003-008) gets picked next, and whether the deckbuilder's new "Quick Play" button (skip building a deck by hand, just play) survives contact with an actual player.
