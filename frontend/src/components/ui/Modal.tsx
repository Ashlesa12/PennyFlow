import { type ReactNode, useEffect } from "react";
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
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close modal overlay"
        className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        className={cn(
          "relative z-10 w-full max-w-lg rounded-3xl border border-neutral-200 bg-white p-6 shadow-xl",
          className,
        )}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="space-y-1">
            {title ? (
              <h2 id="modal-title" className="text-lg font-semibold text-neutral-900">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="text-sm text-neutral-500">{description}</p>
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
