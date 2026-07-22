/**
 * api/departments.ts
 * Endpoints:
 *   GET    /api/v1/departments       — list all departments
 *   GET    /api/v1/departments/{id}  — get department by ID
 *   POST   /api/v1/departments       — create a department
 *   PUT    /api/v1/departments/{id}  — update a department
 *   DELETE /api/v1/departments/{id}  — delete a department
 */

import apiClient from "./client";
import type { DepartmentRequest, DepartmentResponse } from "./types";

/** Fetch all departments. */
export async function getAllDepartments(): Promise<DepartmentResponse[]> {
  const { data } = await apiClient.get<DepartmentResponse[]>("/api/v1/departments");
  return data;
}

/** Fetch a single department by UUID. */
export async function getDepartmentById(id: string): Promise<DepartmentResponse> {
  const { data } = await apiClient.get<DepartmentResponse>(`/api/v1/departments/${id}`);
  return data;
}

/** Create a new department. */
export async function createDepartment(payload: DepartmentRequest): Promise<DepartmentResponse> {
  const { data } = await apiClient.post<DepartmentResponse>("/api/v1/departments", payload);
  return data;
}

/** Update an existing department by UUID. */
export async function updateDepartment(
  id: string,
  payload: DepartmentRequest,
): Promise<DepartmentResponse> {
  const { data } = await apiClient.put<DepartmentResponse>(`/api/v1/departments/${id}`, payload);
  return data;
}

/** Delete a department by UUID. */
export async function deleteDepartment(id: string): Promise<void> {
  await apiClient.delete(`/api/v1/departments/${id}`);
}
