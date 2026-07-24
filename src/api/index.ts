/**
 * api/index.ts — single import point for the entire API layer.
 *
 * Usage:
 *   import { createEmployee, login, generatePayroll } from "@/api";
 */

// Types
export type * from "./types";

// Client utilities
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

// ── Payroll ────────────────────────────────────────────────────────────────

export {
  generatePayroll,
  approvePayroll,
  markPayrollAsPaid,
  reversePayroll,
  getPayrollsByMonthAndYear,
  getPayrollById,
  resendPayslip,
  downloadPayslip,
  getMyPayrolls,
  getMyPayrollForPeriod,
  downloadMyPayslip,
  triggerPayslipDownload,
} from "./payrolls/payroll";

// ── Payroll Batch (bulk approve/reverse + report) ───────────────────────────

export {
  getGeneratedPayrolls,
  bulkApprove,
  bulkApproveByIds,
  bulkReverse,
  downloadBatchReport,
  downloadApprovedBatchReport,
  triggerBatchReportDownload,
} from "./payrolls/payrollBatch";

// Payroll Profiles
export {
  getAllPayrollProfiles,
  createPayrollProfile,
  getPayrollProfileById,
  updatePayrollProfile,
  deactivatePayrollProfile,
  getPayrollProfileByEmployee,
} from "./payrolls/payrollProfiles";

// Earning Types
export {
  getAllEarningTypes,
  getActiveEarningTypes,
  getEarningTypeById,
  createEarningType,
  updateEarningType,
  deactivateEarningType,
  activateEarningType,
} from "./payrolls/earningTypes";

// Deduction Types
export {
  getAllDeductionTypes,
  getActiveDeductionTypes,
  getDeductionTypeById,
  createDeductionType,
  updateDeductionType,
  deactivateDeductionType,
  activateDeductionType,
} from "./payrolls/deductionTypes";
