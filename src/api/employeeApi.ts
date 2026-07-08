import type {
  UpdateEmployee,
  EmployeeResponse,
  MessageResponse,
} from "../types/auth.type";
import axiosInstance from "./axiosInstance";

export const getEmployees = (params: {
  filter?: string;
  page?: number;
  size?: number;
  ids?: string[];
}) => axiosInstance.get<EmployeeResponse[]>("/employees", { params });

export const getEmployeeById = (employeeId: string) =>
  axiosInstance.get<EmployeeResponse>(`/employees/${employeeId}`);

export const updateEmployee = (employeeId: string, data: UpdateEmployee) =>
  axiosInstance.put(`/employees/update-profile/${employeeId}`, data);

export const deleteEmployee = (employeeId: string) =>
  axiosInstance.delete<MessageResponse>(`/employees/${employeeId}`);
