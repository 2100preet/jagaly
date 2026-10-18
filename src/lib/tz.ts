/** Time-zone helpers for scheduling across IST and common NRI locations. */
export const NRI_ZONES = [
  { key: 'US-East', label: 'US (New York)', tz: 'America/New_York' },
  { key: 'US-West', label: 'US (San Francisco)', tz: 'America/Los_Angeles' },
  { key: 'UK', label: 'UK (London)', tz: 'Europe/London' },
  { key: 'UAE', label: 'UAE (Dubai)', tz: 'Asia/Dubai' },
  { key: 'SG', label: 'Singapore', tz: 'Asia/Singapore' },
  { key: 'AU', label: 'Australia (Sydney)', tz: 'Australia/Sydney' },
] as const;

/** Build an absolute Date for a calendar day + "h:mm AM/PM" slot in IST (UTC+5:30). */
export function istSlotToDate(day: Date, slot: string) {
  const m = slot.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!m) return day;
  let h = +m[1] % 12; if (m[3].toUpperCase() === 'PM') h += 12;
  return new Date(Date.UTC(day.getFullYear(), day.getMonth(), day.getDate(), h, +m[2]) - 330 * 60000);
}

export function fmtInZone(d: Date, tz: string, withDay = true) {
  return new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: 'numeric', minute: '2-digit', hour12: true, ...(withDay ? { weekday: 'short' } : {}) }).format(d);
}
