/**
 * Helpers to work with YouTube URLs: extracting the video ID and building the thumbnail URL.
 * Used by `Videos.astro` so `video.json` only needs to provide the canonical YouTube URL —
 * no separate thumbnail field to keep in sync.
 */

/** Extracts the 11-character video ID from a watch/short/embed/youtu.be URL. */
export function getYouTubeId(url: string): string | undefined {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return undefined;
  }

  const host = parsed.hostname.replace(/^www\./, '');
  if (host === 'youtu.be') {
    return parsed.pathname.slice(1).split('/')[0] || undefined;
  }
  if (host === 'youtube.com' || host === 'youtube-nocookie.com' || host === 'm.youtube.com') {
    if (parsed.pathname === '/watch') return parsed.searchParams.get('v') ?? undefined;
    const match = parsed.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/);
    if (match) return match[1];
  }
  return undefined;
}

export type ThumbnailQuality = 'mqdefault' | 'hqdefault' | 'sddefault' | 'maxresdefault';

/**
 * Builds the thumbnail URL for a YouTube video. `hqdefault` (480x360) is used by default because,
 * unlike `sddefault`/`maxresdefault`, it is generated for every public video.
 * Returns `undefined` if the URL isn't a recognizable YouTube link.
 */
export function getYouTubeThumbnail(url: string, quality: ThumbnailQuality = 'hqdefault'): string | undefined {
  const id = getYouTubeId(url);
  return id ? `https://i.ytimg.com/vi/${id}/${quality}.jpg` : undefined;
}
