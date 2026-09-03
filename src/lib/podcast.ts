export const PODCAST_TITLE = 'Pangaea Pod';
export const PODCAST_PROMISE = 'Essays and conversations across time.';

export const SUMMON_DISCLOSURE =
  "This is an AI-assisted historical simulation grounded in the subject's published work. It is not the actual person, and generated responses are interpretations rather than quotations.";

export const EPISODE_FORMATS = ['summon', 'living', 'essay'] as const;

export type EpisodeFormat = (typeof EPISODE_FORMATS)[number];

export const FORMAT_META: Record<
  EpisodeFormat,
  { label: string; description: string }
> = {
  summon: {
    label: 'SUMMON',
    description:
      'Source-grounded conversations with AI-assisted historical simulations of the dead greats.',
  },
  living: {
    label: 'LIVING',
    description:
      'Long-form conversations with living founders, artists, thinkers, and potential friends.',
  },
  essay: {
    label: 'ESSAY',
    description: 'Solo audio essays, field notes, and ideas from Adam.',
  },
};

export function episodeCode(format: EpisodeFormat, number: number) {
  return `${FORMAT_META[format].label} ${String(number).padStart(3, '0')}`;
}

export function episodeDisplayTitle(data: {
  format: EpisodeFormat;
  format_number: number;
  title: string;
}) {
  return `${episodeCode(data.format, data.format_number)} | ${data.title}`;
}

