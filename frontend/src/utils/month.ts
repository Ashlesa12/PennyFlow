export function currentMonthKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function monthKeyParts(month: string): { year: number; month: number } {
  const [year, monthNumber] = month.split("-").map(Number);
  return { year, month: monthNumber };
}

export function addMonthsToKey(month: string, delta: number): string {
  const { year, month: monthNumber } = monthKeyParts(month);
  const date = new Date(year, monthNumber - 1 + delta, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function monthLabelFor(month: string): string {
  const { year, month: monthNumber } = monthKeyParts(month);
  return new Intl.DateTimeFormat(undefined, {
    month: "long",
    year: "numeric",
  }).format(new Date(year, monthNumber - 1, 1));
}

export function defaultDateForMonth(month: string): string {
  const { year, month: monthNumber } = monthKeyParts(month);
  const now = new Date();
  if (now.getFullYear() === year && now.getMonth() + 1 === monthNumber) {
    return `${year}-${String(monthNumber).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  }
  return `${year}-${String(monthNumber).padStart(2, "0")}-01`;
}
