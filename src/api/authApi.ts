import type {
  LoginRequest,
  AuthResponse,
} from "../types/auth.type";
import type { components } from "../types/api-schema";
import axiosInstance from "./axiosInstance";

export type CreateEmployeeRequest =
  components["schemas"]["CreateEmployeeRequest"];
export type CreateEmployeeResponse = components["schemas"]["EmployeeResponse"];

// Public self-registration (creates EMPLOYEE by default, per backend logic)
export const login = (data: LoginRequest) =>
  axiosInstance.post<AuthResponse>("/auth/login", data);

export const setupPassword = (data: { token: string; password: string }) =>
  axiosInstance.post("/auth/setup-password", data);

export const forgotPassword = (data: { email: string }) =>
  axiosInstance.post("/auth/forgot-password", data);

export const resetPasswordViaToken = (data: {
  token: string;
  password: string;
}) => axiosInstance.post("/auth/reset-password", data);

export const createEmployee = (data: CreateEmployeeRequest) =>
  axiosInstance.post<CreateEmployeeResponse>("/employees/create", data);
