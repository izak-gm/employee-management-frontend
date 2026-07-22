/**
 * api/earningTypes.ts
 * Endpoints:
 *   GET    /api/v1/payroll/earning-types              — all (admin)
 *   GET    /api/v1/payroll/earning-types/active        — active only
 *   GET    /api/v1/payroll/earning-types/{id}          — get single
 *   POST   /api/v1/payroll/earning-types               — create
 *   PUT    /api/v1/payroll/earning-types/{id}          — update
 *   PATCH  /api/v1/payroll/earning-types/{id}/deactivate
 *   PATCH  /api/v1/payroll/earning-types/{id}/activate
 */

import apiClient from "../client";
import type { EarningTypeRequest, EarningTypeResponse } from "../types/payroll";

/** Get all earning types, including inactive — for admin management screens */
export async function getAllEarningTypes(): Promise<EarningTypeResponse[]> {
  const { data } = await apiClient.get<EarningTypeResponse[]>("/api/v1/payroll/earning-types");
  return data;
}

/** Get only active earning types — for dropdowns / payroll generation */
export async function getActiveEarningTypes(): Promise<EarningTypeResponse[]> {
  const { data } = await apiClient.get<EarningTypeResponse[]>(
    "/api/v1/payroll/earning-types/active",
  );
  return data;
}

/** Get a single earning type by ID */
export async function getEarningTypeById(id: string): Promise<EarningTypeResponse> {
  const { data } = await apiClient.get<EarningTypeResponse>(`/api/v1/payroll/earning-types/${id}`);
  return data;
}

/** Create a new earning type (e.g. "Bonus", "Overtime") */
export async function createEarningType(payload: EarningTypeRequest): Promise<EarningTypeResponse> {
  const { data } = await apiClient.post<EarningTypeResponse>(
    "/api/v1/payroll/earning-types",
    payload,
  );
  return data;
}

/** Update an existing earning type */
export async function updateEarningType(
  id: string,
  payload: EarningTypeRequest,
): Promise<EarningTypeResponse> {
  const { data } = await apiClient.put<EarningTypeResponse>(
    `/api/v1/payroll/earning-types/${id}`,
    payload,
  );
  return data;
}

/** Deactivate an earning type (soft delete — stops it appearing in new payrolls) */
export async function deactivateEarningType(id: string): Promise<void> {
  await apiClient.patch(`/api/v1/payroll/earning-types/${id}/deactivate`);
}

/** Re-activate a previously deactivated earning type */
export async function activateEarningType(id: string): Promise<void> {
  await apiClient.patch(`/api/v1/payroll/earning-types/${id}/activate`);
}
