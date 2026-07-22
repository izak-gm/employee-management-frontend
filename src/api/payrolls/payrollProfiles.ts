/**
 * api/payrollProfiles.ts
 * Endpoints:
 *   POST   /api/v1/payroll/profiles                        — create
 *   PUT    /api/v1/payroll/profiles/{profileId}             — update
 *   DELETE /api/v1/payroll/profiles/{profileId}             — deactivate
 *   GET    /api/v1/payroll/profiles/employee/{employeeId}   — get by employee
 */

import apiClient from "../client";
import type { PayrollProfileRequest, PayrollProfileResponse } from "../types/payroll";

/** Create a new payroll profile for an employee (salary, bank, KRA PIN etc.) */
export async function createPayrollProfile(
  payload: PayrollProfileRequest,
): Promise<PayrollProfileResponse> {
  const { data } = await apiClient.post<PayrollProfileResponse>(
    "/api/v1/payroll/profiles",
    payload,
  );
  return data;
}

/** Update an existing payroll profile */
export async function updatePayrollProfile(
  profileId: string,
  payload: PayrollProfileRequest,
): Promise<PayrollProfileResponse> {
  const { data } = await apiClient.put<PayrollProfileResponse>(
    `/api/v1/payroll/profiles/${profileId}`,
    payload,
  );
  return data;
}

/** Deactivate a payroll profile (e.g. employee exits) */
export async function deactivatePayrollProfile(profileId: string): Promise<void> {
  await apiClient.delete(`/api/v1/payroll/profiles/${profileId}`);
}

/** Get the active payroll profile for a given employee */
export async function getPayrollProfileByEmployee(
  employeeId: string,
): Promise<PayrollProfileResponse> {
  const { data } = await apiClient.get<PayrollProfileResponse>(
    `/api/v1/payroll/profiles/employee/${employeeId}`,
  );
  return data;
}
