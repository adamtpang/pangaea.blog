import { getCollection } from 'astro:content';

export const PUBLIC_EPOCH = new Date('1971-01-01').valueOf();
export const ESSAY_GOAL = 1000;

export async function publishedPosts() {
  const posts = await getCollection(
    'posts',
    ({ data }) => !data.draft && data.date.valueOf() >= PUBLIC_EPOCH,
  );
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}
