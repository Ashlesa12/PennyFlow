import { useState, useCallback, useRef } from "react";
import api from "../api/client";
import { DEFAULT_CATEGORIES } from "../constants/categories";
import type { Category } from "../types";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const abortRef = useRef(false);

  const load = useCallback(async () => {
    abortRef.current = false;
    setIsLoading(true);
    setError("");
    try {
      const res = await api.get<Category[]>("/categories/");
      if (!abortRef.current) {
        const data = Array.isArray(res.data) ? res.data : [];
        setCategories(
          data.length > 0
            ? data.map((c) => ({ ...c, icon: c.icon || "ellipsis" }))
            : DEFAULT_CATEGORIES,
        );
      }
    } catch {
      if (!abortRef.current) setError("Failed to load categories");
    } finally {
      if (!abortRef.current) setIsLoading(false);
    }
  }, []);

  const refetch = useCallback(() => {
    load();
  }, [load]);

  return {
    categories,
    isLoading,
    error,
    refetch,
  };
}
