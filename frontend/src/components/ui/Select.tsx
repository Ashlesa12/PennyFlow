import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "../../utils/cn";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: readonly SelectOption[];
  placeholder?: string;
  label?: string;
  name?: string;
  id?: string;
  className?: string;
  disabled?: boolean;
  error?: string;
  ariaLabel?: string;
}

interface PopupPosition {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
  openUp: boolean;
}

export function Select({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  label,
  name,
  id,
  className,
  disabled,
  error,
  ariaLabel,
}: SelectProps) {
  const generatedId = useId();
  const buttonId = id ?? generatedId;
  const listboxId = `${buttonId}-listbox`;

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [pos, setPos] = useState<PopupPosition | null>(null);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const typeAheadRef = useRef("");
  const typeAheadTimerRef = useRef<number | null>(null);

  const selectedIndex = useMemo(
    () => options.findIndex((opt) => opt.value === value),
    [options, value],
  );
  const selected = selectedIndex >= 0 ? options[selectedIndex] : undefined;

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    if (typeAheadTimerRef.current) window.clearTimeout(typeAheadTimerRef.current);
    return () => {
      if (typeAheadTimerRef.current) window.clearTimeout(typeAheadTimerRef.current);
    };
  }, []);

  const closeDropdown = useCallback((focusTrigger: boolean) => {
    setOpen(false);
    if (focusTrigger) triggerRef.current?.focus();
  }, []);

  const computePosition = (): PopupPosition | null => {
    const trigger = triggerRef.current;
    if (!trigger) return null;
    const rect = trigger.getBoundingClientRect();
    const viewportH = window.innerHeight;
    const gap = 6;
    const spaceBelow = viewportH - rect.bottom;
    const spaceAbove = rect.top;
    const openUp = spaceBelow < 200 && spaceAbove > spaceBelow;
    const contentHeight = options.length * 40 + 12;
    const scrollLimit = 300;
    const maxHeight = Math.max(
      40,
      Math.min(scrollLimit, (openUp ? spaceAbove : spaceBelow) - gap - 8),
    );
    const displayHeight = Math.min(contentHeight, maxHeight);
    const left = Math.max(
      8,
      Math.min(rect.left, window.innerWidth - rect.width - 8),
    );
    const top = Math.min(
      Math.max(8, openUp ? rect.top - gap - displayHeight : rect.bottom + gap),
      Math.max(8, viewportH - 8 - displayHeight),
    );
    return {
      top,
      left,
      width: rect.width,
      maxHeight,
      openUp,
    };
  };

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (triggerRef.current?.contains(target) || popupRef.current?.contains(target)) {
        return;
      }
      closeDropdown(true);
    };
    const handleScroll = () => closeDropdown(false);
    const handleResize = () => closeDropdown(false);
    document.addEventListener("pointerdown", handlePointerDown, true);
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleResize);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleResize);
    };
  }, [open, closeDropdown]);

  useEffect(() => {
    if (!open) return;
    popupRef.current
      ?.querySelector<HTMLElement>('[data-active="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex]);

  const openDropdown = () => {
    if (disabled) return;
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
    setPos(computePosition());
    setOpen(true);
  };

  const selectOption = (opt: SelectOption) => {
    if (opt.disabled) return;
    onChange(opt.value);
    closeDropdown(true);
  };

  const handleTypeAhead = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key.length !== 1) return;
    const text = typeAheadRef.current + e.key.toLowerCase();
    typeAheadRef.current = text;
    if (typeAheadTimerRef.current) window.clearTimeout(typeAheadTimerRef.current);
    typeAheadTimerRef.current = window.setTimeout(() => {
      typeAheadRef.current = "";
    }, 500);
    const active = activeIndexRef.current;
    const afterActive = options.findIndex(
      (opt, i) => i > active && opt.label.toLowerCase().startsWith(text),
    );
    const next =
      afterActive >= 0
        ? afterActive
        : options.findIndex((opt) => opt.label.toLowerCase().startsWith(text));
    if (next >= 0) setActiveIndex(next);
  };

  const handleNavigation = (e: KeyboardEvent<HTMLElement>) => {
    const last = options.length - 1;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => (i >= last ? 0 : i + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => (i <= 0 ? last : i - 1));
        break;
      case "Home":
        e.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        e.preventDefault();
        setActiveIndex(last);
        break;
      case "Enter":
        e.preventDefault();
        if (options[activeIndex]) selectOption(options[activeIndex]);
        break;
      case "Escape":
        e.preventDefault();
        closeDropdown(true);
        break;
      case "Tab":
        closeDropdown(false);
        break;
      default:
        handleTypeAhead(e);
    }
  };

  const handleTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (open) {
      handleNavigation(e);
      return;
    }
    switch (e.key) {
      case "ArrowDown":
      case "ArrowUp":
      case "Enter":
      case " ":
        e.preventDefault();
        openDropdown();
        break;
    }
  };

  return (
    <div className="w-full">
      {label ? (
        <label
          htmlFor={buttonId}
          className="mb-2 block text-sm font-medium text-text-secondary"
        >
          {label}
        </label>
      ) : null}

      <button
        type="button"
        ref={triggerRef}
        id={buttonId}
        name={name}
        disabled={disabled}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-label={ariaLabel}
        onClick={openDropdown}
        onKeyDown={handleTriggerKeyDown}
        className={cn(
          "flex h-11 w-full items-center justify-between gap-2 rounded-2xl border border-border-strong bg-surface-muted px-4 text-left text-sm backdrop-blur-sm transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500/50",
          open && "ring-2 ring-emerald-500/30 border-emerald-500/50",
          disabled && "cursor-not-allowed opacity-50",
          error && "border-red-400/60 focus-visible:ring-red-500/30",
          className,
        )}
      >
        <span
          className={cn(
            "truncate",
            selected ? "text-text-primary" : "text-text-tertiary",
          )}
        >
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-text-tertiary transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {open && pos
        ? createPortal(
            <div
              ref={popupRef}
              id={listboxId}
              role="listbox"
              tabIndex={-1}
              aria-label={ariaLabel}
              style={{
                top: pos.top,
                left: pos.left,
                width: pos.width,
                maxHeight: pos.maxHeight,
              }}
              className="fixed z-[60] overflow-y-auto rounded-xl border border-border-strong bg-surface py-1.5 shadow-2xl shadow-black/[0.15]"
              onKeyDown={handleNavigation}
            >
              {options.map((opt, index) => (
                <div
                  key={opt.value}
                  role="option"
                  aria-selected={opt.value === value}
                  data-active={index === activeIndex}
                  data-value={opt.value}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => selectOption(opt)}
                  className={cn(
                    "flex cursor-pointer items-center justify-between gap-3 px-3 py-2.5 text-sm",
                    opt.value === value
                      ? "font-medium text-text-primary"
                      : "text-text-secondary",
                    index === activeIndex && "bg-accent/10 text-text-primary",
                    opt.disabled && "pointer-events-none opacity-50",
                  )}
                >
                  <span className="truncate">{opt.label}</span>
                  {opt.value === value && (
                    <Check className="h-4 w-4 shrink-0 text-accent" />
                  )}
                </div>
              ))}
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
