import type { LucideIcon } from "lucide-react";
import {
  Utensils,
  Car,
  ShoppingBag,
  Gamepad2,
  Receipt,
  HeartPulse,
  GraduationCap,
  Plane,
  Ellipsis,
} from "lucide-react";
import type { Category } from "../types/expense";
import api from "../api/client";

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 1, name: "Food", icon: "utensils" },
  { id: 2, name: "Transport", icon: "car" },
  { id: 3, name: "Shopping", icon: "shopping-bag" },
  { id: 4, name: "Bills", icon: "receipt" },
  { id: 5, name: "Entertainment", icon: "gamepad-2" },
  { id: 6, name: "Health", icon: "heart-pulse" },
  { id: 7, name: "Education", icon: "graduation-cap" },
  { id: 8, name: "Other", icon: "ellipsis" },
];

export const CATEGORY_ICON_MAP: Record<number, LucideIcon> = {
  1: Utensils,
  2: Car,
  3: ShoppingBag,
  4: Receipt,
  5: Gamepad2,
  6: HeartPulse,
  7: GraduationCap,
  8: Ellipsis,
};

export interface CategoryStyle {
  color: string;
  icon: LucideIcon;
}

const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  Food: { color: "#10B981", icon: Utensils },
  "Food & Dining": { color: "#10B981", icon: Utensils },
  Transport: { color: "#3B82F6", icon: Car },
  Transportation: { color: "#3B82F6", icon: Car },
  Shopping: { color: "#8B5CF6", icon: ShoppingBag },
  Bills: { color: "#F59E0B", icon: Receipt },
  "Bills & Utilities": { color: "#F59E0B", icon: Receipt },
  Entertainment: { color: "#EC4899", icon: Gamepad2 },
  Health: { color: "#06B6D4", icon: HeartPulse },
  Education: { color: "#F97316", icon: GraduationCap },
  Travel: { color: "#F97316", icon: Plane },
  Other: { color: "#6B7280", icon: Ellipsis },
};

const DEFAULT_STYLE: CategoryStyle = { color: "#6B7280", icon: Ellipsis };

export function getCategoryStyle(name: string): CategoryStyle {
  return CATEGORY_STYLES[name] ?? DEFAULT_STYLE;
}

export function getCategoryColor(name: string): string {
  return getCategoryStyle(name).color;
}

export function getCategoryIconByName(name: string): LucideIcon {
  return getCategoryStyle(name).icon;
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await api.get<Category[]>("/categories/").catch(() => null);
  if (res && Array.isArray(res.data) && res.data.length > 0) {
    return res.data.map((c) => ({ ...c, icon: c.icon || "ellipsis" }));
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
  return CATEGORY_ICON_MAP[id] ?? Ellipsis;
}
