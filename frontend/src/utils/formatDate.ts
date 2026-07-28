type DateInput = string | Date;

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  year: "numeric",
  month: "short",
  day: "numeric",
});

const monthYearFormatter = new Intl.DateTimeFormat(undefined, {
  year: "numeric",
  month: "long",
});

export function formatDate(value: DateInput): string {
  const date = value instanceof Date ? value : new Date(value);
  return dateFormatter.format(date);
}

export function formatMonthYear(value: DateInput): string {
  const date = value instanceof Date ? value : new Date(value);
  return monthYearFormatter.format(date);
}

export function toISODateString(value: DateInput): string {
  const date = value instanceof Date ? value : new Date(value);
  return date.toISOString().slice(0, 10);
}
