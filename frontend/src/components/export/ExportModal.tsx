import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Download,
  FileSpreadsheet,
  FileText,
  LoaderCircle,
  Search,
} from "lucide-react";
import { cn } from "../../utils/cn";
import { getCurrencySymbol } from "../../utils/formatCurrency";
import { Button, Modal, Select, type SelectOption } from "../ui";
import { useCategories } from "../../hooks/useCategories";
import { useMonth } from "../../context/MonthContext";
import { fetchExpenses, type ExpenseFilters } from "../../api/expenses";
import { downloadExport, exportExpenses, type ExportFormat } from "../../api/export";

export type NotifyFn = (message: string, type: "success" | "error") => void;

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
  notify: NotifyFn;
}

const FORMATS: { value: ExportFormat; label: string; icon: typeof FileText }[] = [
  { value: "csv", label: "CSV", icon: FileText },
  { value: "xlsx", label: "Excel", icon: FileSpreadsheet },
];

export function ExportModal({ open, onClose, notify }: ExportModalProps) {
  const { categories, refetch: refetchCategories } = useCategories();
  const { selectedMonthNumber, selectedYear, monthLabel } = useMonth();
  const [format, setFormat] = useState<ExportFormat>("csv");
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [previewCount, setPreviewCount] = useState<number | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [prevOpen, setPrevOpen] = useState(open);

  useEffect(() => {
    refetchCategories();
  }, [refetchCategories]);

  if (prevOpen !== open) {
    setPrevOpen(open);
    if (open) {
      setFormat("csv");
      setSearch("");
      setCategoryId("");
      setStartDate("");
      setEndDate("");
      setMinAmount("");
      setMaxAmount("");
      setPreviewCount(null);
      setPreviewLoading(true);
    }
  }

  const categoryOptions = useMemo<SelectOption[]>(
    () => [
      { value: "", label: "All Categories" },
      ...categories.map((cat) => ({ value: String(cat.id), label: cat.name })),
    ],
    [categories],
  );

  const apiFilters: ExpenseFilters = useMemo(
    () => ({
      search: search || undefined,
      category_id: categoryId ? Number(categoryId) : undefined,
      start_date: startDate || undefined,
      end_date: endDate || undefined,
      month: selectedMonthNumber,
      year: selectedYear,
      min_amount: minAmount !== "" ? Number(minAmount) : undefined,
      max_amount: maxAmount !== "" ? Number(maxAmount) : undefined,
    }),
    [search, categoryId, startDate, endDate, selectedMonthNumber, selectedYear, minAmount, maxAmount],
  );

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(async () => {
      setPreviewLoading(true);
      try {
        const items = await fetchExpenses(apiFilters);
        setPreviewCount(items.length);
      } catch {
        setPreviewCount(0);
      } finally {
        setPreviewLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [open, apiFilters]);

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    try {
      const result = await exportExpenses(format, apiFilters);
      downloadExport(result);
      notify("Expenses exported successfully.", "success");
      onClose();
    } catch {
      notify("Failed to export expenses. Please try again.", "error");
    } finally {
      setIsExporting(false);
    }
  }, [format, apiFilters, notify, onClose]);

  const inputClass =
    "h-11 w-full rounded-2xl border border-border-strong bg-surface-muted px-4 text-sm text-text-primary backdrop-blur-sm placeholder:text-text-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500/50";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Export Expenses"
      description="Download your expenses as a CSV or Excel file."
    >
      <div className="space-y-5">
        <div className="flex items-center justify-between rounded-2xl border border-border-strong bg-surface-soft px-4 py-3">
          <span className="text-sm text-text-secondary">
            Exporting expenses for
          </span>
          <span className="text-sm font-semibold text-text-primary">
            {monthLabel}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1 rounded-2xl border border-border-strong bg-surface-soft p-1">
          {FORMATS.map((opt) => {
            const Icon = opt.icon;
            const active = format === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setFormat(opt.value)}
                aria-pressed={active}
                className={cn(
                  "flex h-10 items-center justify-center gap-2 rounded-xl text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-surface text-text-primary shadow-sm"
                    : "text-text-secondary hover:text-text-primary",
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4",
                    active ? "text-accent" : "text-text-tertiary",
                  )}
                />
                {opt.label}
              </button>
            );
          })}
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
          <input
            type="text"
            placeholder="Search expenses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={cn(inputClass, "pl-11")}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary">
              Category
            </label>
            <Select
              value={categoryId}
              onChange={setCategoryId}
              options={categoryOptions}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary">
              Amount Range ({getCurrencySymbol()})
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                placeholder="Min"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
                className={inputClass}
              />
              <span className="shrink-0 text-sm text-text-tertiary">—</span>
              <input
                type="number"
                min="0"
                placeholder="Max"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary">
              From Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary">
              To Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-2xl border border-dashed border-accent/30 bg-accent/[0.03] px-4 py-3">
          <span className="text-sm text-text-secondary">
            {previewLoading ? (
              "Counting matching expenses…"
            ) : (
              <>
                <span className="font-semibold text-text-primary">
                  {previewCount ?? 0}
                </span>{" "}
                {previewCount === 1 ? "expense" : "expenses"} will be exported
                as {format === "csv" ? "CSV" : "Excel"}
              </>
            )}
          </span>
          {previewLoading ? (
            <LoaderCircle className="h-4 w-4 shrink-0 animate-spin text-accent" />
          ) : format === "csv" ? (
            <FileText className="h-4 w-4 shrink-0 text-accent" />
          ) : (
            <FileSpreadsheet className="h-4 w-4 shrink-0 text-accent" />
          )}
        </div>

        {isExporting && (
          <div className="space-y-2">
            <div className="h-1 w-full overflow-hidden rounded-full bg-neutral-200/60">
              <div className="h-full w-full animate-pulse rounded-full bg-accent" />
            </div>
            <p className="text-center text-xs text-text-secondary">
              Preparing your file…
            </p>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isExporting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            isLoading={isExporting}
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
    </Modal>
  );
}
