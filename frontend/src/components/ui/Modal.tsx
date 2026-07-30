import { type ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "../../utils/cn";
import { Button } from "./Button";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  showCloseButton?: boolean;
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  className,
  showCloseButton = true,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    } else {
      setVisible(false);
      const timer = setTimeout(() => setMounted(false), 250);
      return () => clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    if (!visible) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [visible, onClose]);

  if (!mounted) return null;

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-250",
        visible
          ? "bg-black/[0.04] backdrop-blur-sm"
          : "bg-transparent backdrop-blur-none",
      )}
    >
      <button
        type="button"
        aria-label="Close modal overlay"
        className="absolute inset-0"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        className={cn(
          "relative z-10 w-full max-w-lg rounded-3xl border border-white/40 bg-white/70 p-6 shadow-xl shadow-black/[0.02] backdrop-blur-xl transition-all duration-250",
          visible
            ? "scale-100 opacity-100"
            : "scale-95 opacity-0",
          className,
        )}
        style={{
          animation: !visible
            ? undefined
            : "modalEnter 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            {title ? (
              <h2
                id="modal-title"
                className="text-lg font-semibold tracking-tight text-text-primary"
              >
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="text-sm text-text-secondary">{description}</p>
            ) : null}
          </div>

          {showCloseButton ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Close modal"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          ) : null}
        </div>

        {children}
      </div>
    </div>,
    document.body,
  );
}
