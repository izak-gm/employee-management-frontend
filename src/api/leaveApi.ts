import axiosInstance from "./axiosInstance";
import type { components } from "../types/api-schema";

export type LeaveRequest = components["schemas"]["LeaveRequest"];
export type LeaveResponse = components["schemas"]["LeaveResponse"];
export type LeaveBalance = components["schemas"]["LeaveBalanceResponse"];
export type DashboardStats = components["schemas"]["DashboardStatsResponse"];
export type LeaveStatus = LeaveResponse["status"];

export const applyForLeave = (data: LeaveRequest) =>
  axiosInstance.post<LeaveResponse>("/leaves", data);
export const updateLeave = (id: string, data: LeaveRequest) =>
  axiosInstance.put<LeaveResponse>(`/leaves/${id}`, data);
export const deleteLeave = (id: string) =>
  axiosInstance.delete(`/leaves/${id}`);
export const withdrawLeave = (id: string) =>
  axiosInstance.delete<LeaveResponse>(`/leaves/${id}/withdraw`);
export const coverAction = (id: string, accept: boolean) =>
  axiosInstance.put<LeaveResponse>(`/leaves/${id}/cover-action`, { accept });
export const adminActionLeave = (id: string, status: "APPROVED" | "REJECTED") =>
  axiosInstance.put<LeaveResponse>(`/leaves/${id}/action`, { status });

export const getLeaveById = (id: string) => axiosInstance.get<LeaveResponse>(`/leaves/${id}`);
export const getMyLeaves = () =>
  axiosInstance.get<LeaveResponse[]>("/leaves/my");
export const getAllLeaves = () => axiosInstance.get<LeaveResponse[]>("/leaves");
export const getPendingLeaves = () =>
  axiosInstance.get<LeaveResponse[]>("/leaves/pending");
export const getMyNotifications = () =>
  axiosInstance.get<LeaveResponse[]>("/leaves/notifications");
export const getMyBalance = () =>
  axiosInstance.get<LeaveBalance[]>("/leaves/balance");
export const getDashboardStats = () =>
  axiosInstance.get<DashboardStats>("/dashboard/stats");
export const getActiveEmployees = () => axiosInstance.get("/employees/active");
