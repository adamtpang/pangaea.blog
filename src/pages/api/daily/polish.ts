import type { APIRoute } from 'astro';
import { SESSION_COOKIE } from '../../../lib/session';
import { authorizeDailyRequest } from '../../../lib/dailyAuth';

/*
  /api/daily/polish — turn a rough spoken/typed page into a tight Pangaea
  seedling: claim-title, blurb, 150-400 word body, a few tags.

  Raw fetch to the Anthropic Messages API (no SDK — this file is the one place
  Pangaea talks to Anthropic directly, so a dependency wasn't worth adding).
  Forces exactly one tool call so the response is structured, not prose to
  parse. Gated behind the same auth as sync/seeds and fails closed the same
  way: no ANTHROPIC_API_KEY, no polish.

  This never runs automatically. /daily calls it only when Adam taps "Polish"
  after reaching 300 words; the raw page is always saved regardless of whether
  this succeeds.
*/

export const prerender = false;

const MODEL = 'claude-opus-5';
// Spoken rambling can run long; cap what we send so cost and latency stay
// bounded regardless of how far past 300 words the session went.
const MAX_INPUT_CHARS = 6000;

const SYSTEM = `You polish a rough, spoken-out-loud daily page into a tight Pangaea essay.

Voice: terse, considered, eclectic. Whole Earth Catalog energy, sive.rs brevity. 150 to 400 words.
The title IS the claim, not the topic ("Agency is judgment times action," not "On agency").
Preserve the author's actual opinions, claims, and specific details. Do not invent facts, examples,
or conclusions they did not say. Cut filler, false starts, and spoken tics (um, so basically, like I
said), tighten run-ons into clean sentences, but keep it in first person and keep it theirs.
No em dashes or en dashes anywhere: use commas, semicolons, colons, periods, or parentheses. Hyphens
inside compound words are fine. Write plain prose: no headers, no bullet lists, no markdown.`;

const TOOL_NAME = 'draft_essay';
const TOOL = {
  name: TOOL_NAME,
  description:
    'Submit the polished essay: a claim-style title, a one-line blurb, the essay body, and a few lowercase topic tags.',
  input_schema: {
    type: 'object',
    properties: {
      title: { type: 'string', description: 'The claim, not the topic. Under 12 words.' },
      blurb: { type: 'string', description: 'One sentence, italic subtitle style.' },
      body: {
        type: 'string',
        description: 'The polished essay, 150-400 words, first person, no em or en dashes.',
      },
      tags: {
        type: 'array',
        items: { type: 'string' },
        description: 'Up to 4 lowercase one-word topic tags.',
      },
    },
    required: ['title', 'blurb', 'body'],
    additionalProperties: false,
  },
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });

// Belt-and-suspenders: the prompt already forbids these, this catches any slip.
const stripDashes = (s: string) => s.replace(/\s*[—–]\s*/g, ', ').replace(/[—–]/g, ', ');

interface PolishRequest {
  text?: string;
  seedTitle?: string;
  seedPrompt?: string;
}

export const POST: APIRoute = async ({ request, cookies }) => {
  const denied = authorizeDailyRequest(request, cookies.get(SESSION_COOKIE)?.value);
  if (denied) return denied;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return json({ error: 'ANTHROPIC_API_KEY not configured.' }, 503);

  let body: PolishRequest;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON.' }, 400);
  }

  const raw = (body.text ?? '').trim();
  if (!raw) return json({ error: 'Nothing to polish yet — write your page first.' }, 400);
  const text = raw.slice(0, MAX_INPUT_CHARS);

  const context = body.seedPrompt
    ? `Today's prompt was: "${body.seedPrompt}"${body.seedTitle ? ` (${body.seedTitle})` : ''}.\n\n`
    : '';

  let res: Response;
  try {
    res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 4096,
        // Adaptive thinking (the default) stays ON here on purpose: disabling
        // it on a forced tool_choice call risks the model writing the tool
        // call as plain text instead of a real tool_use block, which would
        // silently break this endpoint. "medium" trims latency/cost without
        // that risk, since it only tunes thinking depth, not whether it runs.
        output_config: { effort: 'medium' },
        system: SYSTEM,
        tools: [TOOL],
        tool_choice: { type: 'tool', name: TOOL_NAME },
        messages: [
          { role: 'user', content: `${context}Here is today's raw spoken/typed page:\n\n${text}` },
        ],
      }),
    });
  } catch {
    return json({ error: 'Could not reach the model. Try again.' }, 502);
  }

  if (!res.ok) {
    const errText = await res.text();
    return json({ error: `Anthropic error ${res.status}: ${errText}` }, 502);
  }

  const data = await res.json();

  // Opus 5's safety classifiers can decline a request; that's a 200 with this
  // stop_reason, not an HTTP error, so it needs its own check before content.
  if (data.stop_reason === 'refusal') {
    return json(
      { error: 'The model declined this one. Try rephrasing, or send your raw words instead.' },
      422
    );
  }

  const content = Array.isArray(data.content) ? data.content : [];
  const toolUse = content.find((b: any) => b?.type === 'tool_use' && b?.name === TOOL_NAME);
  if (!toolUse?.input || typeof toolUse.input.body !== 'string') {
    return json({ error: 'The model did not return a usable draft. Try again.' }, 502);
  }

  const input = toolUse.input as { title?: string; blurb?: string; body: string; tags?: unknown };

  return json({
    title: stripDashes((input.title ?? '').trim()),
    blurb: stripDashes((input.blurb ?? '').trim()),
    body: stripDashes(input.body.trim()),
    tags: Array.isArray(input.tags) ? input.tags.filter((t) => typeof t === 'string').slice(0, 4) : [],
  });
};
