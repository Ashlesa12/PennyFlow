export type Theme = "Light" | "Dark" | "System";
export type ResolvedTheme = Exclude<Theme, "System">;

const THEME_STORAGE_KEY = "pennyflow_theme";
const THEME_TRANSITION_MS = 350;

const systemMedia =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-color-scheme: dark)")
    : null;

let transitionTimer: number | undefined;

export function getStoredTheme(): Theme {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return stored === "Dark" || stored === "System" ? stored : "Light";
}

export function resolveSystemTheme(): ResolvedTheme {
  return systemMedia?.matches ? "Dark" : "Light";
}

export function resolveTheme(theme: Theme): ResolvedTheme {
  return theme === "System" ? resolveSystemTheme() : theme;
}

export function applyTheme(theme: Theme, animate = true): void {
  const root = document.documentElement;

  if (animate) {
    root.classList.add("theme-transition");
    if (transitionTimer) window.clearTimeout(transitionTimer);
    transitionTimer = window.setTimeout(
      () => root.classList.remove("theme-transition"),
      THEME_TRANSITION_MS,
    );
  }

  root.classList.toggle("dark", resolveTheme(theme) === "Dark");
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

export function initTheme(): void {
  applyTheme(getStoredTheme(), false);

  systemMedia?.addEventListener("change", () => {
    if (getStoredTheme() === "System") applyTheme("System");
  });
}
