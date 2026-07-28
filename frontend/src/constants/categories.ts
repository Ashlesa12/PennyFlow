import type { Category } from "../types/expense";

/**
 * Static fallback categories until GET /categories is available on the backend.
 * Icon values match lucide-react icon names.
 */
export const DEFAULT_CATEGORIES: Category[] = [
  { id: 1, name: "Food & Dining", icon: "utensils" },
  { id: 2, name: "Transportation", icon: "car" },
  { id: 3, name: "Shopping", icon: "shopping-bag" },
  { id: 4, name: "Entertainment", icon: "gamepad-2" },
  { id: 5, name: "Bills & Utilities", icon: "receipt" },
  { id: 6, name: "Health", icon: "heart-pulse" },
  { id: 7, name: "Travel", icon: "plane" },
  { id: 8, name: "Other", icon: "ellipsis" },
];

export function getCategoryById(id: number): Category | undefined {
  return DEFAULT_CATEGORIES.find((category) => category.id === id);
}

export function getCategoryName(id: number): string {
  return getCategoryById(id)?.name ?? "Unknown";
}
