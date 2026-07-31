import { formatDate } from "./formatDate";

export function dueLabel(dateInput: string): string {
  const due = new Date(`${dateInput}T00:00:00`);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffDays = Math.round(
    (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays === 0) return "Due Today";
  if (diffDays === 1) return "Due Tomorrow";
  if (diffDays === -1) return "Overdue by 1 day";
  if (diffDays < 0) return `Overdue by ${Math.abs(diffDays)} days`;
  if (diffDays < 7) return `Due in ${diffDays} days`;
  if (diffDays < 14) return "Due next week";
  return formatDate(due);
}
