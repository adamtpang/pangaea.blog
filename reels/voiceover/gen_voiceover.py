"""
Turn a Crayon-Capital-style research table into a voice-over, free.

Input: a markdown table with columns | No | Topic & Link | Quotation |
(exactly the shape of a script doc pulled from real sources before writing
narration). Bold single-cell rows like | **ACT 1 - ...** | | | mark act
breaks.

Two modes:

  --script-only   No audio at all. Writes teleprompter.md: the quotations
                  only, act-grouped, numbered, stripped of table/link
                  clutter, one clear block per line, ready to read aloud
                  and record yourself. Use this when you're voicing it
                  in your own voice.

  (default)       Synthetic TTS mode. Writes, in --out:
                  - 001.mp3, 002.mp3, ... one clip per row, in order
                  - full.mp3, every clip concatenated
                  - cue-sheet.md: row number, act, topic, real duration,
                    cumulative timestamp, for cutting b-roll/slides against.

Usage:
  python gen_voiceover.py --in "script.md" --out "out/" --script-only
  python gen_voiceover.py --in "script.md" --out "out/" --voice en-US-AndrewNeural

Requires: pip install edge-tts (already used elsewhere in this repo, not
needed at all for --script-only).
Needs ffmpeg on PATH for full.mp3 concatenation (skipped if not found).
"""

import argparse
import asyncio
import re
import shutil
import subprocess
from pathlib import Path


def parse_table(md_text: str):
    """Return a list of {act, topic, quote} in document order."""
    rows = []
    current_act = None
    for line in md_text.splitlines():
        line = line.strip()
        if not line.startswith("|"):
            continue
        cells = [c.strip() for c in line.strip("|").split("|")]
        if len(cells) < 3:
            continue
        # Header / separator rows
        if cells[0] in ("No", ":----", "---") or set(cells[0]) <= {"-", ":"}:
            continue
        # Act header: single bold cell, other cells empty
        if cells[0].startswith("**") and all(not c for c in cells[1:]):
            current_act = cells[0].strip("*").strip()
            continue
        # Data row: No | Topic & Link | Quotation
        no, topic_link, quote = cells[0], cells[1], cells[2]
        if not quote or not no.strip().isdigit():
            continue
        # Strip markdown links down to plain topic text for the cue label
        topic = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", topic_link).strip()
        topic = re.sub(r"https?://\S+", "", topic).strip(" -")
        rows.append({"no": no.strip(), "act": current_act, "topic": topic, "quote": quote})
    return rows


async def synth(text: str, voice: str, rate: str, out_path: Path, retries: int = 4) -> float:
    import edge_tts  # lazy: --script-only mode never needs this installed

    last_err = None
    for attempt in range(retries):
        try:
            communicate = edge_tts.Communicate(text, voice, rate=rate)
            with open(out_path, "wb") as f:
                async for chunk in communicate.stream():
                    if chunk["type"] == "audio":
                        f.write(chunk["data"])
            dur = get_duration(out_path)
            if dur > 0:
                return dur
            last_err = "zero duration"
        except Exception as e:
            last_err = e
        await asyncio.sleep(1.5 * (attempt + 1))
    raise RuntimeError(f"Failed after {retries} attempts: {last_err}")


def get_duration(path: Path) -> float:
    try:
        result = subprocess.run(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
            capture_output=True, text=True, timeout=10,
        )
        return float(result.stdout.strip())
    except Exception:
        return 0.0


def write_teleprompter(rows, outdir: Path) -> Path:
    """Plain read-aloud script: quotations only, act-grouped, numbered.
    No table, no links, no clutter -- just what your voice needs to say."""
    lines = ["# Teleprompter script", ""]
    current_act = None
    for row in rows:
        if row["act"] != current_act:
            current_act = row["act"]
            if current_act:
                lines.append(f"\n## {current_act}\n")
        lines.append(f"**{row['no']}.** {row['quote']}\n")
    out_path = outdir / "teleprompter.md"
    out_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    return out_path


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--in", dest="infile", required=True)
    ap.add_argument("--out", dest="outdir", required=True)
    ap.add_argument("--voice", default="en-US-AndrewNeural")
    ap.add_argument("--rate", default="-4%")
    ap.add_argument("--script-only", action="store_true", help="Write teleprompter.md only, no audio, no edge-tts needed.")
    args = ap.parse_args()

    outdir = Path(args.outdir).resolve()
    outdir.mkdir(parents=True, exist_ok=True)

    md_text = Path(args.infile).read_text(encoding="utf-8")
    rows = parse_table(md_text)
    if not rows:
        print("No narration rows found. Expecting a | No | Topic & Link | Quotation | table.")
        return

    if args.script_only:
        out_path = write_teleprompter(rows, outdir)
        print(f"{len(rows)} lines written to {out_path}. Read it aloud and record yourself; no TTS involved.")
        return

    cue_lines = ["# Cue sheet", "", "| # | Act | Topic | Duration | Cumulative | File |", "|---|---|---|---|---|---|"]
    cumulative = 0.0
    clip_paths = []

    async def run_all():
        nonlocal cumulative
        for row in rows:
            fname = f"{int(row['no']):03d}.mp3"
            fpath = outdir / fname
            if fpath.exists() and get_duration(fpath) > 0:
                duration = get_duration(fpath)
                tag = "skipped, already done"
            else:
                duration = await synth(row["quote"], args.voice, args.rate, fpath)
                tag = "generated"
            clip_paths.append(fpath)
            cue_lines.append(
                f"| {row['no']} | {row['act'] or ''} | {row['topic']} | {duration:.1f}s | {cumulative:.1f}s | {fname} |"
            )
            cumulative += duration
            print(f"{fname}: {duration:.1f}s ({tag}) — {row['topic'][:60]}")

    asyncio.run(run_all())

    (outdir / "cue-sheet.md").write_text("\n".join(cue_lines) + "\n", encoding="utf-8")

    if shutil.which("ffmpeg") and clip_paths:
        listfile = outdir / "concat-list.txt"
        listfile.write_text("\n".join(f"file '{p.name}'" for p in clip_paths), encoding="utf-8")
        subprocess.run(
            ["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(listfile), "-c", "copy", str(outdir / "full.mp3")],
            cwd=outdir, capture_output=True,
        )
        print(f"\nfull.mp3 written, total {cumulative:.1f}s")
    else:
        print("\nffmpeg not found on PATH, skipped full.mp3 (individual clips are still complete).")

    print(f"\n{len(rows)} clips + cue-sheet.md written to {outdir}")


if __name__ == "__main__":
    main()
