/**
 * URL helpers. JSON configuration files use root-relative URLs (e.g. "/copilot-logo.png") so they stay
 * independent from the deployment target. These helpers prefix the Astro `base` path, which is
 * required when the site is served from a sub-path such as https://microsoft.github.io/copilot-extensibility/.
 */

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Returns true for absolute URLs (http, https, mailto, tel, protocol-relative). */
export function isExternal(url: string): boolean {
  return /^(https?:)?\/\//i.test(url) || /^(mailto|tel):/i.test(url);
}

/** Resolves a URL coming from a JSON configuration file into a URL usable in an `href`/`src`. */
export function resolveUrl(url: string): string {
  if (!url || isExternal(url) || url.startsWith('#')) return url;
  if (url.startsWith('/')) return `${BASE}${url}` || '/';
  return url;
}

/** Computes `target`/`rel` attributes for a link. External links open in a new tab by default. */
export function linkAttrs(url: string, external?: boolean): Record<string, string> {
  const openInNewTab = external ?? isExternal(url);
  return openInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {};
}
