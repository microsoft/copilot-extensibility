import type { EventItem } from '../types/config';

const dayFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
const fullFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

function parse(date: string): Date {
  return new Date(`${date}T00:00:00Z`);
}

export function isIsoDate(date: string | undefined): date is string {
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;

  const parsed = parse(date);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().startsWith(date);
}

/**
 * Formats an event date or date range, e.g. "May 21, 2026" or "Jun 10–11, 2026".
 * Free-text date values are returned unchanged. `dateLabel` remains supported for compatibility.
 */
export function formatEventDate(item: Pick<EventItem, 'date' | 'endDate' | 'dateLabel'>): string | undefined {
  if (item.dateLabel) return item.dateLabel;
  if (!item.date) return undefined;
  if (!isIsoDate(item.date)) return item.date;

  const start = parse(item.date);
  if (!isIsoDate(item.endDate) || item.endDate === item.date) return fullFormatter.format(start);

  const end = parse(item.endDate);
  const sameYear = start.getUTCFullYear() === end.getUTCFullYear();
  const sameMonth = sameYear && start.getUTCMonth() === end.getUTCMonth();

  if (sameMonth) return `${dayFormatter.format(start)}–${end.getUTCDate()}, ${end.getUTCFullYear()}`;
  if (sameYear) return `${dayFormatter.format(start)} – ${dayFormatter.format(end)}, ${end.getUTCFullYear()}`;
  return `${fullFormatter.format(start)} – ${fullFormatter.format(end)}`;
}

/** Applies the `hidePast` and `sortByDate` options of an event group (evaluated at build time). */
export function prepareEvents(items: EventItem[], options: { hidePast?: boolean; sortByDate?: boolean }): EventItem[] {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  let result = [...items];
  if (options.hidePast) {
    result = result.filter((item) => {
      const last = item.endDate ?? item.date;
      return !isIsoDate(last) || parse(last) >= today;
    });
  }
  if (options.sortByDate) {
    // Undated and free-text items keep their relative order after dated ones.
    result.sort((a, b) => {
      const aDate = a.date;
      const bDate = b.date;
      if (!isIsoDate(aDate) && !isIsoDate(bDate)) return 0;
      if (!isIsoDate(aDate)) return 1;
      if (!isIsoDate(bDate)) return -1;
      return parse(aDate).getTime() - parse(bDate).getTime();
    });
  }
  return result;
}
