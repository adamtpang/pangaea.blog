import type { APIRoute } from 'astro';
import { slugify, todayIso } from '../../../lib/slugify';

export const prerender = false;

const SYSTEM_PROMPT = `You are scaffolding a draft blog post for Pangaea (pangaea.blog), the personal hub of Adam Pang. Your job: take a topic from Adam and put "something on the board" — a usable rough draft he can react to and polish in 5–10 minutes.

VOICE & STYLE
- Terse, considered, eclectic. Whole Earth Catalog energy.
- Sive.rs-style brevity: 150–400 words is the target. Say one thing well.
- First-person, Adam's voice. He talks about music, philosophy, business, software, and life.
- No hedging, no AI-flavored throat-clearing ("In this post, I will…").
- Concrete details over abstractions.

FORMAT
- Output a single MDX file as plain text. No code fences, no commentary.
- Start with YAML frontmatter, then body.
- Frontmatter fields: title, date (today's ISO date), blurb (one sentence, optional but nice), draft: true, tags (1–3 lowercase tags).
- Body is markdown/MDX. Short paragraphs. Headings sparingly.
- If embeds make sense, use these MDX components AT THE TOP of the body, AFTER the frontmatter, with this exact import line:
    import { Quote, YouTube, Spotify, SoundCloud, Figure } from '../../components/embeds';
- Available components:
    <Quote attribution="Author">Pull quote text.</Quote>
    <YouTube id="VIDEO_ID" />
    <Spotify uri="track/SPOTIFY_ID" />   (or playlist/..., album/...)
    <SoundCloud url="https://soundcloud.com/..." />
    <Figure src="/images/foo.jpg" alt="..." caption="..." />
- Use bracketed placeholders like [your favorite line from this song] or [insert link to the essay] when only Adam can fill in the detail. Do NOT invent specific URLs, song IDs, or video IDs you don't actually know — leave a placeholder.

RULES
- Always set draft: true.
- Title should be specific and intriguing, not clickbait.
- Today's date: ${todayIso()}.
- Output ONLY the MDX file content. No preface, no explanation.`;

interface ScaffoldRequest {
  topic: string;
}

interface ScaffoldResponse {
  title: string;
  slug: string;
  body: string;
}

function extractTitle(mdx: string): string {
  const match = mdx.match(/^---[\s\S]*?\ntitle:\s*(.+?)\n/);
  if (!match) return 'Untitled';
  return match[1].trim().replace(/^["']|["']$/g, '');
}

export const POST: APIRoute = async ({ request }) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured.' }), {
      status: 503,
      headers: { 'content-type': 'application/json' },
    });
  }

  let body: ScaffoldRequest;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON.' }), { status: 400 });
  }

  const topic = (body.topic ?? '').trim();
  if (!topic) {
    return new Response(JSON.stringify({ error: 'Missing topic.' }), { status: 400 });
  }

  const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      system: [
        {
          type: 'text',
          text: SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [
        {
          role: 'user',
          content: `Topic / note from Adam:\n\n${topic}\n\nScaffold the post.`,
        },
      ],
    }),
  });

  if (!anthropicResponse.ok) {
    const errText = await anthropicResponse.text();
    return new Response(
      JSON.stringify({ error: `Anthropic error ${anthropicResponse.status}: ${errText}` }),
      { status: 502, headers: { 'content-type': 'application/json' } }
    );
  }

  const data = await anthropicResponse.json();
  const text = data?.content?.[0]?.text ?? '';
  if (!text) {
    return new Response(JSON.stringify({ error: 'Empty response from model.' }), {
      status: 502,
    });
  }

  const title = extractTitle(text);
  const slug = slugify(title);
  const payload: ScaffoldResponse = { title, slug, body: text };

  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
};
