/*
  Curated prompts for /daily's seed picker, pulled from SEEDS-FARCASTER.md,
  SEEDS-OBSIDIAN.md, and src/content/inbox/ (see SEEDS.md for the full ledger).

  Server-side only, on purpose: some of this is drawn from private Obsidian
  notes, not just public Farcaster casts. It is served exclusively through
  /api/daily/seeds, which is gated behind the same sign-in as sync — an
  unauthenticated visitor to /daily never sees this file's contents. Never
  import this into client-shipped code.

  This is a first curated batch (~15), not the full 250+ seed ledger. Add more
  as they get promoted from the source docs.
*/

export interface DailySeed {
  id: string;
  thread: 'music' | 'philosophy' | 'tech';
  source: 'farcaster' | 'obsidian' | 'inbox';
  /** Read this aloud before you start talking. */
  prompt: string;
  suggestedTitle?: string;
}

export const DAILY_SEEDS: DailySeed[] = [
  {
    id: 'the-funny-criterion',
    thread: 'philosophy',
    source: 'inbox',
    prompt:
      "Why is humor an antidote to dread, and what does that reveal about David Deutsch's fun criterion? Start from your own line: reciprocal opening, flow and joy and play, beats reciprocal narrowing, depression and despair and dread.",
    suggestedTitle: 'The Funny Criterion',
  },
  {
    id: 'ten-awesome-people',
    thread: 'philosophy',
    source: 'farcaster',
    prompt:
      'You have said before: "I would rather have 10 awesome people like my thing than 1000 randos." Why? What does an owned blog for the resonant few actually buy you that reach does not?',
    suggestedTitle: 'Ten Awesome People',
  },
  {
    id: 'talking-well-behind-backs',
    thread: 'philosophy',
    source: 'farcaster',
    prompt:
      "You have said \"I love talking well behind people's backs.\" What is that habit actually doing for your friendships? Is there a rule hiding in it?",
    suggestedTitle: 'Talking Well Behind Your Back',
  },
  {
    id: 'writing-to-save-my-life',
    thread: 'philosophy',
    source: 'obsidian',
    prompt:
      'If you had a year left to live, you would write more and love more. So why not just do that now? What is actually stopping you from writing today?',
    suggestedTitle: 'Writing to Save My Life',
  },
  {
    id: 'memetic-lineage',
    thread: 'philosophy',
    source: 'obsidian',
    prompt:
      'You went through your Socrates, Plato, Aristotle phase; now you say you are in your Alexander phase. What changed, from absorbing wisdom to acting on it?',
    suggestedTitle: 'The Memetic Lineage',
  },
  {
    id: 'high-signal-thinking',
    thread: 'philosophy',
    source: 'obsidian',
    prompt:
      'Deutsch, Senra, and psychedelics cleaned the noise out of how you think. Pick one and say exactly what it changed about how you reason.',
    suggestedTitle: 'High-Signal Thinking',
  },
  {
    id: 'both-sides-of-the-deal',
    thread: 'tech',
    source: 'obsidian',
    prompt:
      'You believe you cannot make a deal at all until you have been on both sides of it. What deal taught you this, and what did you learn from the other seat?',
    suggestedTitle: 'Both Sides of the Deal',
  },
  {
    id: 'wealth-is-service',
    thread: 'tech',
    source: 'inbox',
    prompt:
      'You started viewing money "the Elon way": what do you build that is useful for other people? Make the case that being wealthy comes from being maximally useful, not from extraction.',
    suggestedTitle: 'Wealth Is Downstream of Service',
  },
  {
    id: 'agency-formula',
    thread: 'tech',
    source: 'inbox',
    prompt:
      'Agency equals judgment times action: good judgment without action is procrastination, action without judgment is thrashing. Where in your own work right now are you missing one half of that formula?',
    suggestedTitle: 'Agency Is Judgment Times Action',
  },
  {
    id: 'early-to-big-things',
    thread: 'tech',
    source: 'obsidian',
    prompt:
      'Day one on ChatGPT, day one at Network School: you keep being early. Is that luck, or a pattern-recognition skill you have actually practiced? Prove it with one more example.',
    suggestedTitle: "How I'm Early to Big Things",
  },
  {
    id: 'companies-are-fictions',
    thread: 'tech',
    source: 'obsidian',
    prompt:
      'Companies and money are fictions; the real economy is useful goods and services, and true productivity is time-per-thing-produced. What changes if you actually run your work by that measure?',
    suggestedTitle: 'Companies and Money Are Fictions',
  },
  {
    id: 'group-chat-asap',
    thread: 'tech',
    source: 'obsidian',
    prompt:
      'Different audiences move at different speeds; the group chat moves fastest of all. Why do small rooms get things done that big rooms cannot?',
    suggestedTitle: 'The Group Chat, ASAP',
  },
  {
    id: 'podcasts-vs-video-essays',
    thread: 'music',
    source: 'obsidian',
    prompt:
      'You think podcasts beat video essays right now. Make the actual argument: what does audio let you do that a scripted video cannot, at least for now?',
    suggestedTitle: 'Why Podcasts Beat Video Essays (For Now)',
  },
  {
    id: 'music-time-capsule',
    thread: 'music',
    source: 'inbox',
    prompt:
      'Strummer.fun and checking your vibe weekly: what does treating music as a personal time capsule actually teach you about who you were a year ago?',
    suggestedTitle: 'Music as a Personal Time Capsule',
  },
  {
    id: 'no-investors',
    thread: 'tech',
    source: 'inbox',
    prompt:
      'Why do you support yourself without investors or employers? Make the real case for owned-media economics over raising money.',
    suggestedTitle: 'Why I Have No Investors',
  },
  {
    id: 'leaving-guam',
    thread: 'philosophy',
    source: 'inbox',
    prompt:
      'Tell the actual story of leaving Guam for Network School. What did you leave behind, and what did you go looking for?',
    suggestedTitle: 'Leaving Guam',
  },
];
