# Demucs (local stem separation)

Splits any audio file into stems (vocals / drums / bass / other) so you can
study a song's parts individually, drag stems into Ableton as reference
tracks, or run a stem through an audio-to-MIDI tool to get editable notes.
Runs fully locally, GPU-accelerated, no upload, no subscription.

## Setup (already done on this machine, 2026-08-07)

```powershell
cd scripts\demucs
py -3.12 -m venv .venv
.venv\Scripts\python.exe -m pip install torch torchaudio --index-url https://download.pytorch.org/whl/cu121
.venv\Scripts\python.exe -m pip install demucs numpy scipy soundfile dora-search openunmix diffq
```

Verified working on the RTX 3070 Laptop GPU: `torch.cuda.is_available()` is
`True`, and a 5-second smoke test separated in ~9 seconds.

## Use

```powershell
cd scripts\demucs
.venv\Scripts\python.exe -m demucs -d cuda -o separated "C:\path\to\song.mp3"
```

Output lands in `scripts\demucs\separated\htdemucs\<track name>\` as four
WAVs: `vocals.wav`, `drums.wav`, `bass.wav`, `other.wav`. First run per
machine downloads the pretrained model (~80MB) to
`~/.cache/huggingface/hub`; every run after that is instant.

Useful flags:

- `--two-stems vocals` — just vocals vs. everything else, faster
- `-d cpu` — force CPU if you ever run this without the GPU free
- `--mp3` — write MP3 stems instead of WAV (smaller, lossy)

Drag the resulting WAVs onto tracks in Live's arrangement view like any
other audio file. Live 11 Intro (this machine) can't do this via the
AbletonMCP socket (`create_audio_clip` needs Live 12.0.5+), but plain
drag-and-drop in the GUI works on any edition.

## Legal note

Separating stems from a song for your own private practice and study is
normal ear-training/remix-culture territory. Don't redistribute stems of
commercial songs you don't own the rights to; this is a personal practice
tool, not a distribution pipeline.

## Why local instead of a web tool

Moises.ai / LALAL.AI do the same job as a paid web upload. Demucs (Meta AI
Research, open source) matches or beats their quality, costs nothing, and
never leaves this machine. Ableton Live 12 also ships stem separation
natively, but this machine runs 11 Intro.
