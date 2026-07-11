import type {
  RegisterLoginRequest,
  AdminRegisterRequest,
  AuthResponse,
} from "../types/auth.type";
import axiosInstance from "./axiosInstance";

// Public self-registration (creates EMPLOYEE by default, per backend logic)
export const login = (data: RegisterLoginRequest) =>
  axiosInstance.post<AuthResponse>("/auth/login", data);

// Admin/SuperAdmin-only: create a user with a specific role
export const registerUserWithRole = (data: AdminRegisterRequest) =>
  axiosInstance.post<AuthResponse>("/auth/admin/register", data);

export const setupPassword = (data: { token: string; password: string }) =>
  axiosInstance.post("/auth/setup-password", data);

export const forgotPassword = (data: { email: string }) =>
  axiosInstance.post("/auth/forgot-password", data);

export const resetPasswordViaToken = (data: {
  token: string;
  password: string;
}) => axiosInstance.post("/auth/reset-password", data);

export const createEmployee = (data: {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}) => axiosInstance.post("/employees/create", data);