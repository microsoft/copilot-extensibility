import type {
  CommunityEventsConfig,
  EcosystemConfig,
  FeaturedContentConfig,
  LearningPathsConfig,
  NavigationConfig,
  QuickLinksConfig,
  TechnologiesConfig,
  VideosConfig,
} from '../types/config';
import { resolveUrl } from './url';

export interface SearchEntry {
  title: string;
  description: string;
  category: string;
  url: string;
}

interface SearchSources {
  navigation?: NavigationConfig;
  quickLinks?: QuickLinksConfig;
  featured?: FeaturedContentConfig;
  videos?: VideosConfig;
  technologies?: TechnologiesConfig;
  learningPaths?: LearningPathsConfig;
  events?: CommunityEventsConfig;
  ecosystem?: EcosystemConfig;
}

/**
 * Builds the client-side search index consumed by the header search box.
 * It is computed at build time from the same JSON files that render the page,
 * so every new entry added to a configuration file becomes searchable automatically.
 */
export function buildSearchIndex(sources: SearchSources): SearchEntry[] {
  const entries: SearchEntry[] = [];
  const add = (title: string, description: string, category: string, url: string) =>
    entries.push({ title, description, category, url: resolveUrl(url) });

  sources.quickLinks?.items.forEach((i) => add(i.title, i.description, 'Section', i.link.url));
  sources.featured?.items.forEach((i) => add(i.title, i.description, i.type, i.link.url));
  sources.videos?.items.forEach((i) => add(i.title, i.technology, 'Video', i.url));
  sources.technologies?.items.forEach((i) => add(i.name, i.description ?? '', 'Technology', i.url));
  sources.learningPaths?.items.forEach((i) => add(i.title, i.description, 'Learning path', i.link.url));
  if (sources.events) {
    const { firstPartyEvents, communityEvents } = sources.events;
    firstPartyEvents.items.forEach((i) => add(i.title, i.description, 'Event', i.link.url));
    communityEvents.items.forEach((i) => add(i.title, i.description, 'Community', i.link.url));
  }
  sources.ecosystem?.cards.forEach((card) =>
    card.links.forEach((l) => add(l.label, card.title, 'Ecosystem', l.url)),
  );
  sources.navigation?.header.items.forEach((item) =>
    item.children?.forEach((c) => add(c.label, c.description ?? item.label, 'Resource', c.url)),
  );

  // De-duplicate by title + url, keeping the first (most descriptive) occurrence.
  const seen = new Set<string>();
  return entries.filter((e) => {
    const key = `${e.title.toLowerCase()}|${e.url}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

