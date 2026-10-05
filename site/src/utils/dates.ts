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

/**
 * Formats an event date or date range, e.g. "May 21, 2026" or "Jun 10–11, 2026".
 * `dateLabel` always wins, which allows free text such as "Monthly".
 */
export function formatEventDate(item: Pick<EventItem, 'date' | 'endDate' | 'dateLabel'>): string | undefined {
  if (item.dateLabel) return item.dateLabel;
  if (!item.date) return undefined;

  const start = parse(item.date);
  if (!item.endDate || item.endDate === item.date) return fullFormatter.format(start);

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
      return !last || parse(last) >= today;
    });
  }
  if (options.sortByDate) {
    // Undated items (recurring initiatives) keep their relative order after dated ones.
    result.sort((a, b) => {
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;
      return parse(a.date).getTime() - parse(b.date).getTime();
    });
  }
  return result;
}
