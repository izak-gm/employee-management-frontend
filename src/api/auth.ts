/**
 * api/auth.ts
 * Endpoints:
 *   POST /api/v1/auth/login
 *   POST /api/v1/auth/forgot-password
 *   POST /api/v1/auth/reset-password
 *   POST /api/v1/auth/setup-password
 */

import apiClient, { tokenStorage } from "./client";
import type {
  LoginRequest,
  AuthResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  SetPasswordRequest,
  MessageResponse,
} from "./types";

/**
 * Login — persists the returned JWT automatically.
 */
export async function login(payload: LoginRequest): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/api/v1/auth/login", payload);
  if (data.token) {
    tokenStorage.set(data.token);
  }
  return data;
}

/** Client-side logout — clears the stored token. */
export function logout(): void {
  tokenStorage.clear();
}

/** Send a password-reset link to the provided email. */
export async function forgotPassword(payload: ForgotPasswordRequest): Promise<MessageResponse> {
  const { data } = await apiClient.post<MessageResponse>("/api/v1/auth/forgot-password", payload);
  return data;
}

/** Complete password reset using the token from the reset email. */
export async function resetPassword(payload: ResetPasswordRequest): Promise<MessageResponse> {
  const { data } = await apiClient.post<MessageResponse>("/api/v1/auth/reset-password", payload);
  return data;
}

/** First-time password setup for newly invited employees. */
export async function setupPassword(payload: SetPasswordRequest): Promise<MessageResponse> {
  const { data } = await apiClient.post<MessageResponse>("/api/v1/auth/setup-password", payload);
  return data;
}
