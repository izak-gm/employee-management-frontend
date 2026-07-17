/**
 * api/employees.ts
 * Endpoints:
 *   GET    /api/v1/employees
 *   GET    /api/v1/employees/active
 *   GET    /api/v1/employees/me
 *   GET    /api/v1/employees/{employeeId}
 *   POST   /api/v1/employees/create
 *   PUT    /api/v1/employees/update-profile/{employeeId}
 *   PUT    /api/v1/employees/update-profile/me
 *   DELETE /api/v1/employees/{employeeId}
 */

import apiClient from "./client";
import type {
  CreateEmployeeRequest,
  UpdateEmployee,
  EmployeeResponse,
  EmployeeRequest,
  MessageResponse,
} from "./types";

// ─── Queries ──────────────────────────────────────────────────────────────────

/**
 * Fetch a paginated / filtered list of employees.
 * Pass `ids` to fetch specific employees by UUID.
 */
export async function getEmployees(
  params: EmployeeRequest & { ids?: string[] } = {}
): Promise<EmployeeResponse[]> {
  const { data } = await apiClient.get<EmployeeResponse[]>("/api/v1/employees", {
    params,
    // axios serialises array params as ids[]=... by default; use repeat format
    paramsSerializer: { indexes: null },
  });
  return data;
}

/**
 * Fetch all active employees.
 * Use this to populate supervisor / cover-employee dropdowns.
 */
export async function getActiveEmployees(): Promise<EmployeeResponse[]> {
  const { data } = await apiClient.get<EmployeeResponse[]>("/api/v1/employees/active");
  return data;
}

/** Get the authenticated user's own profile. */
export async function getMyProfile(): Promise<EmployeeResponse> {
  const { data } = await apiClient.get<EmployeeResponse>("/api/v1/employees/me");
  return data;
}

/** Get a single employee by UUID. */
export async function getEmployeeById(employeeId: string): Promise<EmployeeResponse> {
  const { data } = await apiClient.get<EmployeeResponse>(`/api/v1/employees/${employeeId}`);
  return data;
}

// ─── Mutations ────────────────────────────────────────────────────────────────

/** Create a new employee (SUPERADMIN / HR_ADMIN only). */
export async function createEmployee(
  payload: CreateEmployeeRequest
): Promise<EmployeeResponse> {
  const { data } = await apiClient.post<EmployeeResponse>("/api/v1/employees/create", payload);
  return data;
}

/** Admin updates any employee's profile. */
export async function updateEmployee(
  employeeId: string,
  payload: UpdateEmployee
): Promise<EmployeeResponse> {
  const { data } = await apiClient.put<EmployeeResponse>(
    `/api/v1/employees/update-profile/${employeeId}`,
    payload
  );
  return data;
}

/** Authenticated employee updates their own profile. */
export async function updateMyProfile(payload: UpdateEmployee): Promise<EmployeeResponse> {
  const { data } = await apiClient.put<EmployeeResponse>(
    "/api/v1/employees/update-profile/me",
    payload
  );
  return data;
}

/** Delete an employee by UUID (SUPERADMIN / HR_ADMIN only). */
export async function deleteEmployee(employeeId: string): Promise<MessageResponse> {
  const { data } = await apiClient.delete<MessageResponse>(`/api/v1/employees/${employeeId}`);
  return data;
}
