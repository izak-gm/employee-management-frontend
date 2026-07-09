// src/api/employeeApi.ts
import axiosInstance from "./axiosInstance";
import type {
  UpdateEmployee,
  Employee,
  EmployeeResponse,
  MessageResponse,
} from "../types/auth.type";

// --- Self-service endpoints (any authenticated user, own profile only) ---

export const getMyProfile = () =>
  axiosInstance.get<EmployeeResponse>("/employees/me");

export const updateMyProfile = (data: UpdateEmployee) =>
  axiosInstance.put<Employee>("/employees/update-profile/me", data);

// --- Admin/SuperAdmin-only endpoints (manage other employees) ---

export const getEmployees = (params: {
  filter?: string;
  page?: number;
  size?: number;
  ids?: string[];
}) => axiosInstance.get<EmployeeResponse[]>("/employees", { params });

export const getEmployeeById = (employeeId: string) =>
  axiosInstance.get<EmployeeResponse>(`/employees/${employeeId}`);

export const updateEmployee = (employeeId: string, data: UpdateEmployee) =>
  axiosInstance.put<Employee>(`/employees/update-profile/${employeeId}`, data);

export const deleteEmployee = (employeeId: string) =>
  axiosInstance.delete<MessageResponse>(`/employees/${employeeId}`);
