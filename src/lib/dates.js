export function formatShortDate(date) {
  if (!date) return "";
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export function formatDateRange(checkIn, checkOut) {
  if (!checkIn && !checkOut) return "Add dates";
  if (checkIn && !checkOut) return `${formatShortDate(checkIn)} – Select checkout`;
  if (!checkIn && checkOut) return formatShortDate(checkOut);
  return `${formatShortDate(checkIn)} – ${formatShortDate(checkOut)}`;
}

export function nightsBetween(checkIn, checkOut, fallback = 5) {
  if (!checkIn || !checkOut) return fallback;
  const diff = checkOut.getTime() - checkIn.getTime();
  if (diff <= 0) return 1;
  return Math.max(1, Math.round(diff / 86400000));
}

export function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function addDays(d, n) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return startOfDay(x);
}

export function isSameDay(a, b) {
  if (!a || !b) return false;
  return a.getTime() === b.getTime();
}

export function isInRange(day, start, end) {
  if (!start || !end) return false;
  const t = day.getTime();
  return t > start.getTime() && t < end.getTime();
}

export function getMonthDays(year, month) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startPad = first.getDay();
  const days = [];
  for (let i = 0; i < startPad; i++) days.push(null);
  for (let d = 1; d <= last.getDate(); d++) {
    days.push(startOfDay(new Date(year, month, d)));
  }
  return days;
}
