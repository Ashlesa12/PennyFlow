export function formatCurrency(amount: number): string {
  const formatted = new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
  return `Rs. ${formatted}`;
}
