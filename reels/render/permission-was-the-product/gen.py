import asyncio, edge_tts, json, sys

async def main():
    with open("script-flat.txt", encoding="utf-8") as f:
        text = f.read().strip()
    communicate = edge_tts.Communicate(text, "en-US-AndrewNeural", rate="-6%", boundary="WordBoundary")
    words = []
    with open("narration.mp3", "wb") as audio_out:
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                audio_out.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                words.append({
                    "text": chunk["text"],
                    "start": chunk["offset"] / 10_000_000,
                    "duration": chunk["duration"] / 10_000_000,
                })
    with open("words.json", "w", encoding="utf-8") as f:
        json.dump(words, f, indent=2)
    print(f"words: {len(words)}, last end: {words[-1]['start'] + words[-1]['duration']:.2f}s")

asyncio.run(main())
