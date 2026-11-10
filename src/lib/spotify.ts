/** Turn a Spotify track URL, URI, or id into the official embed URL. */
export function spotifyEmbed(input: string, theme?: 0 | 1): { src: string; track: boolean } | null {
  const raw = input.trim();
  if (!raw) return null;

  const id =
    raw.match(/spotify:track:([A-Za-z0-9]+)/)?.[1] ??
    raw.match(/open\.spotify\.com\/(?:intl-[a-z]{2}\/)?track\/([A-Za-z0-9]+)/)?.[1] ??
    raw.match(/^track\/([A-Za-z0-9]+)$/)?.[1] ??
    (/^[A-Za-z0-9]{22}$/.test(raw) ? raw : null);

  if (id) {
    const query = theme === undefined ? '' : `?theme=${theme}`;
    return { src: `https://open.spotify.com/embed/track/${id}${query}`, track: true };
  }

  const path = raw
    .replace(/^https?:\/\/open\.spotify\.com\//, '')
    .replace(/^spotify:/, '')
    .replace(/:/g, '/')
    .replace(/^embed\//, '');
  if (!/^(track|album|playlist|episode|show)\//.test(path)) return null;
  const query = theme === undefined ? '' : `?theme=${theme}`;
  return { src: `https://open.spotify.com/embed/${path}${query}`, track: path.startsWith('track/') };
}
