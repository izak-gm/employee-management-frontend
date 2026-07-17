/**
 * api/index.ts — single import point for the entire API layer.
 *
 * Usage:
 *   import { createEmployee, login, getMyLeaves } from "@/api";
 */

// Types
export type * from "./types";

// Client utilities (error class, token helpers)
export { ApiError, tokenStorage } from "./client";

// Auth
export { login, logout, forgotPassword, resetPassword, setupPassword } from "./auth";

// Employees
export {
  getEmployees,
  getActiveEmployees,
  getMyProfile,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  updateMyProfile,
  deleteEmployee,
} from "./employees";

// Leaves
export {
  getAllLeaves,
  getMyLeaves,
  getPendingLeaves,
  getMyBalance,
  getMyNotifications,
  getLeaveById,
  applyForLeave,
  updateLeave,
  adminActionLeave,
  coverAction,
  deleteLeave,
  withdrawLeave,
} from "./leaves";

// Dashboard
export { getDashboardStats } from "./dashboard";
