import type { APIRoute } from 'astro';
import { postFilename, slugify, todayIso } from '../../../lib/slugify';

export const prerender = false;

interface PublishRequest {
  title: string;
  body: string;
  slug?: string;
  draft?: boolean;
}

interface PublishResponse {
  url: string;
  path: string;
  commitSha: string;
}

const OWNER = process.env.GITHUB_OWNER ?? 'adamtpang';
const REPO = process.env.GITHUB_REPO ?? 'pangaea.blog';
const BRANCH = process.env.GITHUB_BRANCH ?? 'main';

export const POST: APIRoute = async ({ request }) => {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return new Response(JSON.stringify({ error: 'GITHUB_TOKEN not configured.' }), {
      status: 503,
      headers: { 'content-type': 'application/json' },
    });
  }

  let body: PublishRequest;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON.' }), { status: 400 });
  }

  const title = (body.title ?? '').trim();
  const content = (body.body ?? '').trim();
  if (!title || !content) {
    return new Response(JSON.stringify({ error: 'Missing title or body.' }), { status: 400 });
  }

  const isoDate = todayIso();
  const slug = body.slug?.trim() ? slugify(body.slug) : slugify(title);
  if (!slug) {
    return new Response(JSON.stringify({ error: 'Could not derive slug from title.' }), {
      status: 400,
    });
  }

  const filename = postFilename(slug, isoDate);
  const path = `src/content/posts/${filename}`;
  const commitMessage = `post: ${title}`;

  const ghResponse = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`,
    {
      method: 'PUT',
      headers: {
        authorization: `Bearer ${token}`,
        accept: 'application/vnd.github+json',
        'x-github-api-version': '2022-11-28',
        'content-type': 'application/json',
        'user-agent': 'pangaea-write',
      },
      body: JSON.stringify({
        message: commitMessage,
        branch: BRANCH,
        // GitHub API expects base64-encoded file contents
        content: Buffer.from(content, 'utf-8').toString('base64'),
      }),
    }
  );

  if (!ghResponse.ok) {
    const errText = await ghResponse.text();
    return new Response(
      JSON.stringify({ error: `GitHub error ${ghResponse.status}: ${errText}` }),
      { status: 502, headers: { 'content-type': 'application/json' } }
    );
  }

  const result = await ghResponse.json();
  const payload: PublishResponse = {
    url: `https://pangaea.blog/posts/${slug}/`,
    path,
    commitSha: result?.commit?.sha ?? '',
  };

  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
};
