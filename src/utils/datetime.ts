export interface TimezoneInfo {
  label: string;
  offset: string;
  iana: string;
}

export const TIMEZONES: TimezoneInfo[] = [
  { label: "UTC", offset: "+00:00", iana: "UTC" },
  { label: "New York (EST/EDT)", offset: "-05:00", iana: "America/New_York" },
  { label: "Chicago (CST/CDT)", offset: "-06:00", iana: "America/Chicago" },
  { label: "Denver (MST/MDT)", offset: "-07:00", iana: "America/Denver" },
  { label: "Los Angeles (PST/PDT)", offset: "-08:00", iana: "America/Los_Angeles" },
  { label: "London (GMT/BST)", offset: "+00:00", iana: "Europe/London" },
  { label: "Paris (CET/CEST)", offset: "+01:00", iana: "Europe/Paris" },
  { label: "Berlin (CET/CEST)", offset: "+01:00", iana: "Europe/Berlin" },
  { label: "Moscow (MSK)", offset: "+03:00", iana: "Europe/Moscow" },
  { label: "Dubai (GST)", offset: "+04:00", iana: "Asia/Dubai" },
  { label: "Mumbai (IST)", offset: "+05:30", iana: "Asia/Kolkata" },
  { label: "Bangkok (ICT)", offset: "+07:00", iana: "Asia/Bangkok" },
  { label: "Ho Chi Minh (ICT)", offset: "+07:00", iana: "Asia/Ho_Chi_Minh" },
  { label: "Singapore (SGT)", offset: "+08:00", iana: "Asia/Singapore" },
  { label: "Shanghai (CST)", offset: "+08:00", iana: "Asia/Shanghai" },
  { label: "Tokyo (JST)", offset: "+09:00", iana: "Asia/Tokyo" },
  { label: "Seoul (KST)", offset: "+09:00", iana: "Asia/Seoul" },
  { label: "Sydney (AEST/AEDT)", offset: "+10:00", iana: "Australia/Sydney" },
  { label: "Auckland (NZST/NZDT)", offset: "+12:00", iana: "Pacific/Auckland" },
  { label: "São Paulo (BRT)", offset: "-03:00", iana: "America/Sao_Paulo" },
];

export interface DurationResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  hours: number;
  minutes: number;
  seconds: number;
  weeks: number;
  businessDays: number;
}

export function calculateDuration(start: Date, end: Date): DurationResult {
  const [earlier, later] = start <= end ? [start, end] : [end, start];

  const totalMs = later.getTime() - earlier.getTime();
  const totalDays = Math.floor(totalMs / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(totalDays / 7);

  const remainderMs = totalMs - totalDays * 24 * 60 * 60 * 1000;
  const hours = Math.floor(remainderMs / (1000 * 60 * 60));
  const minutes = Math.floor((remainderMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remainderMs % (1000 * 60)) / 1000);

  let years = later.getFullYear() - earlier.getFullYear();
  let months = later.getMonth() - earlier.getMonth();
  let days = later.getDate() - earlier.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(later.getFullYear(), later.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  const businessDays = countBusinessDays(earlier, later);

  return { years, months, days, totalDays, hours, minutes, seconds, weeks, businessDays };
}

function countBusinessDays(start: Date, end: Date): number {
  let count = 0;
  const current = new Date(start);
  while (current < end) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) count++;
    current.setDate(current.getDate() + 1);
  }
  return count;
}

export function addToDate(
  date: Date,
  amount: number,
  unit: "years" | "months" | "weeks" | "days" | "hours" | "minutes"
): Date {
  const result = new Date(date);
  switch (unit) {
    case "years":
      result.setFullYear(result.getFullYear() + amount);
      break;
    case "months":
      result.setMonth(result.getMonth() + amount);
      break;
    case "weeks":
      result.setDate(result.getDate() + amount * 7);
      break;
    case "days":
      result.setDate(result.getDate() + amount);
      break;
    case "hours":
      result.setHours(result.getHours() + amount);
      break;
    case "minutes":
      result.setMinutes(result.getMinutes() + amount);
      break;
  }
  return result;
}

export function formatDatetime(date: Date, iana: string): string {
  return date.toLocaleString("en-US", {
    timeZone: iana,
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

export function formatDateForInput(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function formatTimeForInput(date: Date): string {
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}
