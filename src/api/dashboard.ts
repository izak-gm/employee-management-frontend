/**
 * api/dashboard.ts
 * Endpoints:
 *   GET /api/v1/dashboard/stats
 */

import apiClient from "./client";
import type { DashboardStatsResponse } from "./types";

/** Aggregate stats: employee counts + leave summary for the admin dashboard. */
export async function getDashboardStats(): Promise<DashboardStatsResponse> {
  const { data } = await apiClient.get<DashboardStatsResponse>("/api/v1/dashboard/stats");
  return data;
}
