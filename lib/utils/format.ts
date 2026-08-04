export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatShortDate(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

const RELATIVE_UNITS: Array<{ unit: Intl.RelativeTimeFormatUnit; ms: number }> =
  [
    { unit: "year", ms: 1000 * 60 * 60 * 24 * 365 },
    { unit: "month", ms: 1000 * 60 * 60 * 24 * 30 },
    { unit: "week", ms: 1000 * 60 * 60 * 24 * 7 },
    { unit: "day", ms: 1000 * 60 * 60 * 24 },
    { unit: "hour", ms: 1000 * 60 * 60 },
    { unit: "minute", ms: 1000 * 60 },
  ];

/** French relative time, e.g. "il y a 2 jours". */
export function formatRelativeTime(date: Date): string {
  const elapsed = date.getTime() - Date.now();
  const rtf = new Intl.RelativeTimeFormat("fr-FR", { numeric: "auto" });

  for (const { unit, ms } of RELATIVE_UNITS) {
    const value = Math.round(elapsed / ms);
    if (Math.abs(value) >= 1 || unit === "minute") {
      return rtf.format(value, unit);
    }
  }

  return rtf.format(0, "minute");
}

/** Truncate a string to roughly `max` characters, appending an ellipsis. */
export function truncate(text: string, max = 160): string {
  const trimmed = text.trim();
  if (trimmed.length <= max) {
    return trimmed;
  }
  return `${trimmed.slice(0, max - 1).trimEnd()}…`;
}
