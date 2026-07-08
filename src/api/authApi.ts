import type {
  RegisterLoginRequest,
  AdminRegisterRequest,
  AuthResponse,
} from "../types/auth.type";
import axiosInstance from "./axiosInstance";

// Public self-registration (creates EMPLOYEE by default, per backend logic)
export const register = (data: RegisterLoginRequest) =>
  axiosInstance.post<AuthResponse>("/auth/register", data);

export const login = (data: RegisterLoginRequest) =>
  axiosInstance.post<AuthResponse>("/auth/login", data);

// Admin/SuperAdmin-only: create a user with a specific role
export const registerUserWithRole = (data: AdminRegisterRequest) =>
  axiosInstance.post<AuthResponse>("/auth/admin/register", data);
