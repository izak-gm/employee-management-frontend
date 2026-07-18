/**
 * api/index.ts — single import point for the entire API layer.
 *
 * Usage:
 *   import { createEmployee, login, getAllDepartments } from "@/api";
 */

// Types
export type * from "./types";

// Client utilities
export { ApiError, tokenStorage } from "./client";

// Auth
export {
  login,
  logout,
  forgotPassword,
  resetPassword,
  setupPassword,
} from "./auth";

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

// Departments
export {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "./departments";

// Positions
export {
  getAllPositions,
  getPositionById,
  createPosition,
  updatePosition,
  deletePosition,
} from "./positions";

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
