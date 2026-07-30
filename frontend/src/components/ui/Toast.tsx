import { useEffect, useState } from "react";
import { CheckCircle, AlertCircle, X } from "lucide-react";
import { cn } from "../../utils/cn";

interface ToastProps {
  message: string;
  type?: "success" | "error";
  visible: boolean;
  onDismiss: () => void;
  duration?: number;
}

export function Toast({
  message,
  type = "success",
  visible,
  onDismiss,
  duration = 3000,
}: ToastProps) {
  const [mounted, setMounted] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      setExiting(false);
      const timer = setTimeout(() => {
        setExiting(true);
        setTimeout(() => {
          setMounted(false);
          onDismiss();
        }, 200);
      }, duration);
      return () => clearTimeout(timer);
    }
    setExiting(true);
    const timer = setTimeout(() => {
      setMounted(false);
    }, 200);
    return () => clearTimeout(timer);
  }, [visible, duration, onDismiss]);

  if (!mounted && !visible) return null;

  const Icon = type === "success" ? CheckCircle : AlertCircle;

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border px-5 py-3.5 text-sm font-medium shadow-xl shadow-black/[0.02] backdrop-blur-xl transition-all duration-200",
        type === "success" &&
          "border-emerald-200/60 bg-emerald-50/90 text-emerald-800",
        type === "error" && "border-red-200/60 bg-red-50/90 text-red-800",
        exiting
          ? "translate-x-4 opacity-0"
          : "translate-x-0 opacity-100",
      )}
      style={{
        animation: !exiting
          ? "toastSlideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)"
          : undefined,
      }}
    >
      <Icon
        className={cn(
          "h-5 w-5 shrink-0",
          type === "success" && "text-emerald-600",
          type === "error" && "text-red-600",
        )}
      />
      <span className="min-w-0">{message}</span>
      <button
        onClick={() => {
          setExiting(true);
          setTimeout(() => {
            setMounted(false);
            onDismiss();
          }, 200);
        }}
        className="shrink-0"
      >
        <X
          className={cn(
            "h-4 w-4",
            type === "success" && "text-emerald-600/60 hover:text-emerald-600",
            type === "error" && "text-red-600/60 hover:text-red-600",
          )}
        />
      </button>
    </div>
  );
}
