import type { APIRoute } from 'astro';
import { SESSION_COOKIE } from '../../../lib/session';
import { authorizeDailyRequest } from '../../../lib/dailyAuth';

/*
  /api/daily/research builds a compact, cited research shelf for one essay.
  It is deliberately separate from polish: research supplies evidence and
  tensions; polish only edits words Adam has already written.
*/

export const prerender = false;

const MODEL = 'claude-opus-5';
const MAX_TITLE_CHARS = 180;
const MAX_QUESTION_CHARS = 700;

const SYSTEM = `You are the research desk for Pangaea, a personal essay publication.

Research the proposed essay before the author writes it. Search the web. Prefer primary sources,
original interviews, peer-reviewed papers, official archives, and books or transcripts by the
person being discussed. Separate what a source actually found from your own synthesis. Include
sample sizes and important limitations when citing experiments. Do not turn correlation into
causation. Do not write the essay or imitate the author's voice.

Return a compact research memo of at most 650 words with exactly these headings:
WHAT THE SOURCES SAY
TENSIONS AND CAVEATS
QUESTIONS WORTH WRITING INTO

Use short numbered findings under the first heading and bullets under the others. No markdown
tables. No em dashes or en dashes anywhere. Use commas, semicolons, colons, or periods instead.`;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });

const stripDashes = (s: string) => s.replace(/\s*[—–]\s*/g, ', ').replace(/[—–]/g, ', ');

interface ResearchRequest {
  title?: string;
  question?: string;
}

interface Citation {
  url: string;
  title: string;
  citedText?: string;
}

export const POST: APIRoute = async ({ request, cookies }) => {
  const denied = authorizeDailyRequest(request, cookies.get(SESSION_COOKIE)?.value);
  if (denied) return denied;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return json({ error: 'ANTHROPIC_API_KEY not configured.' }, 503);

  let body: ResearchRequest;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON.' }, 400);
  }

  const title = (body.title ?? '').trim().slice(0, MAX_TITLE_CHARS);
  const question = (body.question ?? '').trim().slice(0, MAX_QUESTION_CHARS);
  if (!title && !question) return json({ error: 'Name the essay or its question first.' }, 400);

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
        max_tokens: 3000,
        output_config: { effort: 'medium' },
        system: SYSTEM,
        tools: [
          {
            type: 'web_search_20260318',
            name: 'web_search',
            max_uses: 4,
            allowed_callers: ['direct'],
          },
        ],
        messages: [
          {
            role: 'user',
            content:
              `Essay title: ${title || '(untitled)'}\n` +
              `Question: ${question || '(derive the central research question from the title)'}\n\n` +
              'Research this now. Cite every factual claim that matters.',
          },
        ],
      }),
    });
  } catch {
    return json({ error: 'Could not reach the research service. Try again.' }, 502);
  }

  if (!res.ok) {
    const detail = await res.text();
    return json({ error: `Anthropic error ${res.status}: ${detail}` }, 502);
  }

  const data = await res.json();
  if (data.stop_reason === 'refusal') {
    return json({ error: 'The research request was declined. Try a narrower question.' }, 422);
  }

  const blocks = Array.isArray(data.content) ? data.content : [];
  const textBlocks = blocks.filter((block: any) => block?.type === 'text' && block.text);
  const memo = stripDashes(textBlocks.map((block: any) => block.text).join('\n\n').trim());
  if (!memo) return json({ error: 'The research service returned no usable memo.' }, 502);

  const seen = new Set<string>();
  const sources: Citation[] = [];
  for (const block of textBlocks) {
    const citations = Array.isArray(block.citations) ? block.citations : [];
    for (const citation of citations) {
      if (!citation?.url || seen.has(citation.url)) continue;
      seen.add(citation.url);
      sources.push({
        url: citation.url,
        title: citation.title || citation.url,
        ...(citation.cited_text ? { citedText: stripDashes(citation.cited_text) } : {}),
      });
    }
  }

  return json({ memo, sources: sources.slice(0, 12), researchedAt: Date.now() });
};
