/**
 * api/leaves.ts
 * Endpoints:
 *   GET    /api/v1/leaves
 *   GET    /api/v1/leaves/my
 *   GET    /api/v1/leaves/pending
 *   GET    /api/v1/leaves/balance
 *   GET    /api/v1/leaves/notifications
 *   GET    /api/v1/leaves/{leaveId}
 *   POST   /api/v1/leaves
 *   PUT    /api/v1/leaves/{leaveId}
 *   PUT    /api/v1/leaves/{leaveId}/action
 *   PUT    /api/v1/leaves/{leaveId}/cover-action
 *   DELETE /api/v1/leaves/{leaveId}
 *   DELETE /api/v1/leaves/{leaveId}/withdraw
 */

import apiClient from "./client";
import type {
  LeaveRequest,
  LeaveResponse,
  LeaveActionRequest,
  CoverActionRequest,
  LeaveBalanceResponse,
  MessageResponse,
} from "./types";

// ─── Queries ──────────────────────────────────────────────────────────────────

/** Admin: all leave applications across the organisation. */
export async function getAllLeaves(): Promise<LeaveResponse[]> {
  const { data } = await apiClient.get<LeaveResponse[]>("/api/v1/leaves");
  return data;
}

/** Employee: own leave applications. */
export async function getMyLeaves(): Promise<LeaveResponse[]> {
  const { data } = await apiClient.get<LeaveResponse[]>("/api/v1/leaves/my");
  return data;
}

/** Admin / HR: leaves awaiting admin action (PENDING_ADMIN). */
export async function getPendingLeaves(): Promise<LeaveResponse[]> {
  const { data } = await apiClient.get<LeaveResponse[]>("/api/v1/leaves/pending");
  return data;
}

/** Employee: leave balance per leave type. */
export async function getMyBalance(): Promise<LeaveBalanceResponse[]> {
  const { data } = await apiClient.get<LeaveBalanceResponse[]>("/api/v1/leaves/balance");
  return data;
}

/**
 * Employee: notifications — leaves where the employee is nominated as cover
 * and needs to accept or decline.
 */
export async function getMyNotifications(): Promise<LeaveResponse[]> {
  const { data } = await apiClient.get<LeaveResponse[]>("/api/v1/leaves/notifications");
  return data;
}

/** Fetch a single leave application by UUID. */
export async function getLeaveById(leaveId: string): Promise<LeaveResponse> {
  const { data } = await apiClient.get<LeaveResponse>(`/api/v1/leaves/${leaveId}`);
  return data;
}

// ─── Mutations ────────────────────────────────────────────────────────────────

/** Employee: submit a new leave application. */
export async function applyForLeave(payload: LeaveRequest): Promise<LeaveResponse> {
  const { data } = await apiClient.post<LeaveResponse>("/api/v1/leaves", payload);
  return data;
}

/** Employee: edit a leave application that is still pending. */
export async function updateLeave(leaveId: string, payload: LeaveRequest): Promise<LeaveResponse> {
  const { data } = await apiClient.put<LeaveResponse>(`/api/v1/leaves/${leaveId}`, payload);
  return data;
}

/**
 * Admin / HR: approve or reject a leave.
 * Payload status: "APPROVED" | "REJECTED"
 */
export async function adminActionLeave(
  leaveId: string,
  payload: LeaveActionRequest,
): Promise<LeaveResponse> {
  const { data } = await apiClient.put<LeaveResponse>(`/api/v1/leaves/${leaveId}/action`, payload);
  return data;
}

/**
 * Cover employee: accept or decline being the cover.
 * Payload: { accept: true | false }
 */
export async function coverAction(
  leaveId: string,
  payload: CoverActionRequest,
): Promise<LeaveResponse> {
  const { data } = await apiClient.put<LeaveResponse>(
    `/api/v1/leaves/${leaveId}/cover-action`,
    payload,
  );
  return data;
}

/** Employee: delete a leave application (before processing). */
export async function deleteLeave(leaveId: string): Promise<MessageResponse> {
  const { data } = await apiClient.delete<MessageResponse>(`/api/v1/leaves/${leaveId}`);
  return data;
}

/** Employee: withdraw a leave (approved or pending). */
export async function withdrawLeave(leaveId: string): Promise<LeaveResponse> {
  const { data } = await apiClient.delete<LeaveResponse>(`/api/v1/leaves/${leaveId}/withdraw`);
  return data;
}
