/** Tiny class-name joiner — avoids pulling in a dependency for this. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

/** 178.56 -> "178.56", 30 -> "30" — keeps kW figures honest, no rounding up. */
export function formatKw(kw: number): string {
  return Number.isInteger(kw) ? String(kw) : kw.toFixed(2).replace(/0$/, '');
}

/** 120000 -> "120,000" */
export function formatThb(amount: number): string {
  return new Intl.NumberFormat('th-TH').format(amount);
}

/** ISO date -> "14 กันยายน 2568" (Buddhist era, as Thai readers expect). */
export function formatThaiDate(iso: string): string {
  const date = new Date(iso);
  return new Intl.DateTimeFormat('th-TH', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

