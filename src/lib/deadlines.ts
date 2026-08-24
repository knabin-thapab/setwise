/**
 * Computes the next upcoming IRS estimated-tax deadline relative to the
 * real current date (bug fix: previous version hardcoded "now" to a fixed
 * timestamp, which froze the countdown forever once deployed).
 *
 * Standard 1040-ES due dates: Apr 15, Jun 15, Sep 15 (current year),
 * and Jan 15 (following year) for Q4. If a date falls on a weekend/federal
 * holiday the IRS shifts it to the next business day — this simplified
 * version uses the standard calendar date, which is accurate for most years.
 * Revisit if exact day-of-week precision becomes important.
 */
export type Deadline = { label: string; date: Date; quarter: string };

export function getNextDeadline(now: Date = new Date()): Deadline {
  const year = now.getFullYear();

  const candidates: Deadline[] = [
    { label: `Apr 15, ${year}`, date: new Date(`${year}-04-15T23:59:59`), quarter: "Q1" },
    { label: `Jun 15, ${year}`, date: new Date(`${year}-06-15T23:59:59`), quarter: "Q2" },
    { label: `Sep 15, ${year}`, date: new Date(`${year}-09-15T23:59:59`), quarter: "Q3" },
    { label: `Jan 15, ${year + 1}`, date: new Date(`${year + 1}-01-15T23:59:59`), quarter: "Q4" },
    // fallback into next year in case all of the above have passed
    { label: `Apr 15, ${year + 1}`, date: new Date(`${year + 1}-04-15T23:59:59`), quarter: "Q1" },
  ];

  const upcoming = candidates.find((d) => d.date.getTime() >= now.getTime());
  return upcoming ?? candidates[candidates.length - 1];
}

export function daysUntil(target: Date, now: Date = new Date()) {
  return Math.max(0, Math.ceil((target.getTime() - now.getTime()) / 86_400_000));
}
