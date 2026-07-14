// src/types/auth.types.ts
import type { components } from "./api-schema";

export type Role = "ADMIN" | "SUPERADMIN" | "EMPLOYEE";
export type Gender = "MALE" | "FEMALE";

export type LoginRequest = components["schemas"]["LoginRequest"];
export type AuthResponse = components["schemas"]["AuthResponse"];
export type UpdateEmployee = components["schemas"]["UpdateEmployee"];
export type Employee = components["schemas"]["Employee"];
export type EmployeeResponse = components["schemas"]["EmployeeResponse"];
export type MessageResponse = components["schemas"]["MessageResponse"];

export interface DecodedToken {
  sub: string;
  id: string;
  email: string;
  role: Role;
  iat: number;
  exp: number;
}
