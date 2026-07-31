import api from "./client";
import { buildExpenseFilterParams, type ExpenseFilters } from "./expenses";

export type ExportFormat = "csv" | "xlsx";

export interface ExportResult {
  blob: Blob;
  filename: string;
}

export async function exportExpenses(
  format: ExportFormat,
  filters?: ExpenseFilters,
): Promise<ExportResult> {
  const res = await api.get<Blob>(`/export/expenses.${format}`, {
    params: buildExpenseFilterParams(filters),
    responseType: "blob",
  });

  const disposition = res.headers?.["content-disposition"] as
    | string
    | undefined;
  const match = disposition?.match(/filename="?([^";]+)"?/);
  const fallback = `expenses_${new Date().toISOString().slice(0, 10)}.${format}`;

  return {
    blob: res.data,
    filename: match?.[1] ?? fallback,
  };
}

export function downloadExport(result: ExportResult): void {
  const url = URL.createObjectURL(result.blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = result.filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
