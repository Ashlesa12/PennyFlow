import api from "./client";
import type { DashboardStats } from "../types";

export async function fetchDashboardStats(
  month?: number,
  year?: number,
): Promise<DashboardStats> {
  const res = await api.get<DashboardStats>("/dashboard/stats", {
    params: { month, year },
  });
  return res.data;
}
