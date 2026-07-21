/**
 * api/deductionTypes.ts
 * Endpoints:
 *   GET    /api/v1/payroll/deduction-types              — all (admin)
 *   GET    /api/v1/payroll/deduction-types/active        — active only
 *   GET    /api/v1/payroll/deduction-types/{id}          — get single
 *   POST   /api/v1/payroll/deduction-types               — create
 *   PUT    /api/v1/payroll/deduction-types/{id}          — update
 *   PATCH  /api/v1/payroll/deduction-types/{id}/deactivate
 *   PATCH  /api/v1/payroll/deduction-types/{id}/activate
 */

import apiClient from "../client";
import type { DeductionTypeRequest, DeductionTypeResponse } from "../types/payroll";

/** Get all deduction types, including inactive — for admin management screens */
export async function getAllDeductionTypes(): Promise<DeductionTypeResponse[]> {
  const { data } = await apiClient.get<DeductionTypeResponse[]>("/api/v1/payroll/deduction-types");
  return data;
}

/** Get only active deduction types — for dropdowns / payroll generation */
export async function getActiveDeductionTypes(): Promise<DeductionTypeResponse[]> {
  const { data } = await apiClient.get<DeductionTypeResponse[]>(
    "/api/v1/payroll/deduction-types/active",
  );
  return data;
}

/** Get a single deduction type by ID */
export async function getDeductionTypeById(id: string): Promise<DeductionTypeResponse> {
  const { data } = await apiClient.get<DeductionTypeResponse>(
    `/api/v1/payroll/deduction-types/${id}`,
  );
  return data;
}

/** Create a new deduction type (e.g. "PAYE", "NSSF", "Loan Repayment") */
export async function createDeductionType(
  payload: DeductionTypeRequest,
): Promise<DeductionTypeResponse> {
  const { data } = await apiClient.post<DeductionTypeResponse>(
    "/api/v1/payroll/deduction-types",
    payload,
  );
  return data;
}

/** Update an existing deduction type */
export async function updateDeductionType(
  id: string,
  payload: DeductionTypeRequest,
): Promise<DeductionTypeResponse> {
  const { data } = await apiClient.put<DeductionTypeResponse>(
    `/api/v1/payroll/deduction-types/${id}`,
    payload,
  );
  return data;
}

/** Deactivate a deduction type (soft delete — stops it appearing in new payrolls) */
export async function deactivateDeductionType(id: string): Promise<void> {
  await apiClient.patch(`/api/v1/payroll/deduction-types/${id}/deactivate`);
}

/** Re-activate a previously deactivated deduction type */
export async function activateDeductionType(id: string): Promise<void> {
  await apiClient.patch(`/api/v1/payroll/deduction-types/${id}/activate`);
}
