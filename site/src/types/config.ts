/**
 * Type contracts for the JSON configuration files in `src/data/`.
 * Every landing-page component receives exactly one of these objects through its `config` prop.
 */

/** Names of the icons available in `src/components/Icon.astro`. */
export type IconName = string;

/**
 * Accent colors shared by all components. Each accent maps to a pair of CSS variables
 * (`--accent-<name>` and `--accent-<name>-soft`) defined in `src/styles/global.css`.
 * Allowed values: purple | blue | green | orange | teal | pink | indigo | red | yellow | gray
 */
export type Accent = string;

/** A generic hyperlink. Internal links start with "/" or "#"; external links start with "http". */
export interface Link {
  label: string;
  url: string;
  /** Opens the link in a new tab. Defaults to `true` for external URLs. */
  external?: boolean;
}

export interface SectionHeading {
  /** Anchor id of the section, used for in-page navigation (e.g. "featured"). */
  id: string;
  title: string;
  subtitle?: string;
  viewAll?: Link;
}

// ---------------------------------------------------------------------------
// navigation.json  ->  Header.astro (header section) + Footer.astro (footer section)
// ---------------------------------------------------------------------------

export interface Brand {
  name: string;
  /** Path (relative to `public/`) or absolute URL of the logo image. */
  logo: string;
  url: string;
}

export interface NavItem {
  label: string;
  url?: string;
  external?: boolean;
  /** When present, the item renders as a dropdown menu. */
  children?: Array<Link & { description?: string }>;
}

export interface HeaderConfig {
  brand: Brand;
  items: NavItem[];
  search: {
    enabled: boolean;
    placeholder: string;
    /** Fallback search engine for queries that do not match site content. `{query}` is replaced. */
    fallbackUrl?: string;
    fallbackLabel?: string;
  };
  themeToggle: { enabled: boolean };
  actions: Array<{ label: string; icon: IconName; url: string }>;
}

export interface FooterConfig {
  brand: Brand & { tagline: string };
  social: Array<{ label: string; icon: IconName; url: string }>;
  columns: Array<{ title: string; links: Link[] }>;
}

export interface NavigationConfig {
  header: HeaderConfig;
  footer: FooterConfig;
}

// ---------------------------------------------------------------------------
// hero.json -> Hero.astro
// ---------------------------------------------------------------------------

export interface HeroConfig {
  title: string;
  /** Second title line, rendered with the gradient highlight on `highlight`. */
  titleLine2: { highlight: string; text: string };
  description: string;
  primaryAction: Link;
  secondaryAction: Link;
  /** Icons floating around the illustration. */
  floatingIcons: IconName[];
}

// ---------------------------------------------------------------------------
// quick-links.json -> QuickLinks.astro
// ---------------------------------------------------------------------------

export interface QuickLinksConfig {
  items: Array<{
    title: string;
    description: string;
    icon: IconName;
    accent: Accent;
    link: Link;
  }>;
}

// ---------------------------------------------------------------------------
// featured-content.json -> FeaturedContent.astro
// ---------------------------------------------------------------------------

export const FEATURED_CONTENT_TYPES = ['Cookbook', 'Blog', 'Lab', 'News', 'Article', 'Website', 'Video'] as const;

export type FeaturedContentType = (typeof FEATURED_CONTENT_TYPES)[number];

export function parseFeaturedContentType(value: string): FeaturedContentType {
  const type = FEATURED_CONTENT_TYPES.find((candidate) => candidate === value);
  if (!type) {
    throw new Error(`Unsupported featured content type "${value}". Expected one of: ${FEATURED_CONTENT_TYPES.join(', ')}.`);
  }
  return type;
}

export interface FeaturedContentConfig {
  heading: SectionHeading;
  items: Array<{
    /** Content type shown as a badge. */
    type: FeaturedContentType;
    title: string;
    /** ISO 8601 date and time used to select and order the newest featured content. */
    publishedAt: string;
    description: string;
    icon: IconName;
    accent: Accent;
    link: Link;
  }>;
}

// ---------------------------------------------------------------------------
// technologies.json -> Technologies.astro
// ---------------------------------------------------------------------------

export interface TechnologiesConfig {
  heading: SectionHeading;
  items: Array<{
    name: string;
    description?: string;
    icon: IconName;
    accent: Accent;
    /** Optional image (path relative to `public/`) that replaces the icon, e.g. an official logo. */
    image?: string;
    url: string;
  }>;
}

// ---------------------------------------------------------------------------
// learning-paths.json -> LearningPaths.astro
// ---------------------------------------------------------------------------

export interface LearningPathsConfig {
  heading: SectionHeading;
  items: Array<{
    title: string;
    description: string;
    /** Persona icon shown next to the title. */
    icon: IconName;
    accent: Accent;
    /** Decorative illustration: "blocks" | "code" | "cubes". */
    illustration: string;
    link: Link;
  }>;
}

// ---------------------------------------------------------------------------
// community-events.json -> CommunityEvents.astro
// ---------------------------------------------------------------------------

export interface EventItem {
  title: string;
  description: string;
  icon: IconName;
  accent: Accent;
  /** Organizer name, shown as a tooltip and used by the search index. */
  organizer?: string;
  /** ISO date (YYYY-MM-DD) or free-text schedule. Optional for recurring initiatives/communities. */
  date?: string;
  /** ISO end date for multi-day events. */
  endDate?: string;
  /** Legacy free-text date override. Prefer a free-text `date` value. */
  dateLabel?: string;
  link: Link;
}

export interface EventGroup {
  title: string;
  viewAll?: Link;
  footerLink?: Link;
  /** Hide items whose (end) date is in the past at build time. */
  hidePast?: boolean;
  /** Sort dated items chronologically. */
  sortByDate?: boolean;
  items: EventItem[];
}

export interface CommunityEventsConfig {
  heading: SectionHeading;
  /** Events organized by Microsoft and/or the Copilot Extensibility team. */
  firstPartyEvents: EventGroup;
  /** Events, communities and initiatives organized by the community. */
  communityEvents: EventGroup;
}

// ---------------------------------------------------------------------------
// ecosystem.json -> Ecosystem.astro
// ---------------------------------------------------------------------------

export interface EcosystemConfig {
  heading: SectionHeading;
  cards: Array<{
    title: string;
    accent: Accent;
    /** Decorative illustration: "people" | "calendar" | "folder". */
    illustration: string;
    links: Link[];
  }>;
}

// ---------------------------------------------------------------------------
// video.json -> Videos.astro
// ---------------------------------------------------------------------------

export const VIDEO_KINDS = ['video', 'playlist'] as const;

export type VideoKind = (typeof VIDEO_KINDS)[number];

/** Validates a video `kind`, defaulting missing values to `"video"`. */
export function parseVideoKind(value: string | undefined): VideoKind {
  if (value === undefined) return 'video';
  const kind = VIDEO_KINDS.find((candidate) => candidate === value);
  if (!kind) {
    throw new Error(`Unsupported video kind "${value}". Expected one of: ${VIDEO_KINDS.join(', ')}.`);
  }
  return kind;
}

export interface VideoItem {
  title: string;
  /** Technology area the video covers, shown as a badge (e.g. "Copilot Studio", "MCP"). */
  technology: string;
  /** Badge color. Reuse the same accent as the matching entry in `technologies.json` for consistency. */
  accent: Accent;
  /**
   * `"video"` (default) for a single video, or `"playlist"` to render it as a YouTube playlist:
   * a stacked-card thumbnail and a "Playlist" badge instead of a plain play button.
   */
  kind?: VideoKind;
  /**
   * Canonical YouTube URL (watch, youtu.be, shorts or embed form). The thumbnail image and the
   * "watch" link are both derived from it at build time — no separate thumbnail field needed.
   * For `"kind": "playlist"`, use a `watch?v=...&list=...` link to a representative video so a
   * thumbnail can still be derived; a bare `playlist?list=...` URL has no derivable thumbnail.
   */
  url: string;
}

export interface VideosConfig {
  heading: SectionHeading;
  items: VideoItem[];
}

// ---------------------------------------------------------------------------
// team.json -> Team.astro
// ---------------------------------------------------------------------------

export interface TeamMember {
  name: string;
  role: string;
  /** Path (relative to `public/`) to a square headshot image, rendered as a circle. */
  picture: string;
}

export interface TeamConfig {
  heading: SectionHeading;
  members: TeamMember[];
}

// ---------------------------------------------------------------------------
// site.json -> BaseLayout.astro
// ---------------------------------------------------------------------------

export interface SiteConfig {
  title: string;
  description: string;
  lang: string;
  favicon: string;
  themeColor: string;
}
