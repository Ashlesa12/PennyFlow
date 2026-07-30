import type { LucideIcon } from "lucide-react";
import {
  Utensils,
  Car,
  ShoppingBag,
  Gamepad2,
  Receipt,
  HeartPulse,
  Plane,
  Ellipsis,
} from "lucide-react";
import type { Category } from "../types/expense";
import api from "../api/client";

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

const iconMap: Record<number, LucideIcon> = {
  1: Utensils,
  2: Car,
  3: ShoppingBag,
  4: Gamepad2,
  5: Receipt,
  6: HeartPulse,
  7: Plane,
  8: Ellipsis,
};

export async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await api.get<Category[]>("/categories/");
    if (Array.isArray(res.data) && res.data.length > 0) {
      return res.data.map((c) => ({ ...c, icon: c.icon || "ellipsis" }));
    }
  } catch {
  }
  return DEFAULT_CATEGORIES;
}

export function getCategoryById(id: number): Category | undefined {
  return DEFAULT_CATEGORIES.find((category) => category.id === id);
}

export function getCategoryName(id: number): string {
  return getCategoryById(id)?.name ?? "Unknown";
}

export function getCategoryIcon(id: number): LucideIcon {
  return iconMap[id] ?? Ellipsis;
}
