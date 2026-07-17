/**
 * This file was auto-generated from openapi-typescript.
 * Do not make direct changes to this file.
 * Source: openapi.ts (provided schema)
 */

// ─── Enums ────────────────────────────────────────────────────────────────────

export type Gender = "MALE" | "FEMALE";

export type Role =
  | "SUPERADMIN"
  | "HR_ADMIN"
  | "HR_OFFICER"
  | "PAYROLL_MANAGER"
  | "FINANCE_MANAGER"
  | "TECH_LEAD"
  | "SOFTWARE_ENGINEER"
  | "INTERN";

export type EmploymentType = "PERMANENT" | "CONTRACT" | "INTERN" | "PART_TIME" | "CASUAL";

export type EmployeeStatus = "INVITED" | "ACTIVE" | "INACTIVE";

export type LeaveType = "ANNUAL" | "SICK" | "PATERNITY" | "MATERNITY" | "COMPASSIONATE";

export type LeaveStatus =
  | "PENDING_COVER"
  | "COVER_DECLINED"
  | "PENDING_ADMIN"
  | "APPROVED"
  | "REJECTED"
  | "WITHDRAWN";

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface LoginRequest {
  /** Format: email */
  email: string;
  password: string;
}

export interface AuthResponse {
  token?: string;
}

export interface ForgotPasswordRequest {
  /** Format: email */
  email: string;
}

export interface SetPasswordRequest {
  token: string;
  password: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface MessageResponse {
  message?: string;
}

// ─── Employee ─────────────────────────────────────────────────────────────────

export interface CreateEmployeeRequest {
  firstName: string;
  middleName?: string;
  lastName: string;
  /** Format: email */
  email: string;
  phoneNumber: string;
  gender: Gender;
  /** Format: date */
  dateOfBirth?: string;
  nationalId?: string;
  role: Role;
  /** Format: date */
  hireDate: string;
  /** Format: date */
  confirmationDate?: string;
  employment_type?: EmploymentType;
  /** Format: uuid */
  departmentId?: string;
  /** Format: uuid */
  positionId?: string;
  /** Format: uuid */
  supervisorId?: string;
}

export interface UpdateEmployee {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  /** Format: email */
  email?: string;
  phoneNumber?: string;
  password?: string;
  gender?: Gender;
  /** Format: date */
  dateOfBirth?: string;
  nationalId?: string;
  role?: Role;
  status?: EmployeeStatus;
  /** Format: date */
  hireDate?: string;
  /** Format: date */
  confirmationDate?: string;
  /** Format: date */
  exitDate?: string;
  /** Format: uuid */
  departmentId?: string;
  /** Format: uuid */
  positionId?: string;
  /** Format: uuid */
  supervisorId?: string;
}

export interface EmployeeResponse {
  /** Format: uuid */
  id?: string;
  employeeNumber?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  gender?: Gender;
  /** Format: date */
  dateOfBirth?: string;
  nationalId?: string;
  role?: Role;
  status?: EmployeeStatus;
  /** Format: date */
  hireDate?: string;
  /** Format: date */
  confirmationDate?: string;
  /** Format: date */
  exitDate?: string;
  /** Format: uuid */
  departmentId?: string;
  departmentName?: string;
  /** Format: uuid */
  positionId?: string;
  positionName?: string;
  /** Format: uuid */
  supervisorId?: string;
  supervisorName?: string;
  /** Format: date-time */
  createdAt?: string;
  /** Format: date-time */
  updatedAt?: string;
}

export interface EmployeeRequest {
  filter?: string;
  /** Format: int32 */
  page?: number;
  /** Format: int32 */
  size?: number;
}

// ─── Leave ────────────────────────────────────────────────────────────────────

export interface LeaveRequest {
  leaveType: LeaveType;
  /** Format: date */
  startDate: string;
  /** Format: date */
  endDate: string;
  reason?: string;
  /** Format: uuid */
  coverEmployeeId: string;
}

export interface LeaveResponse {
  /** Format: uuid */
  id?: string;
  /** Format: uuid */
  employeeId?: string;
  employeeFullName?: string;
  /** Format: uuid */
  coverEmployeeId?: string;
  coverEmployeeFullName?: string;
  leaveType?: LeaveType;
  status?: LeaveStatus;
  /** Format: date */
  startDate?: string;
  /** Format: date */
  endDate?: string;
  reason?: string;
  approvedByFullName?: string;
  /** Format: date-time */
  createdAt?: string;
}

export interface CoverActionRequest {
  accept: boolean;
}

export interface LeaveActionRequest {
  status: LeaveStatus;
}

export interface LeaveBalanceResponse {
  leaveType?: LeaveType;
  /** Format: int32 */
  maxDays?: number;
  /** Format: int32 */
  usedDays?: number;
  /** Format: int32 */
  remainingDays?: number;
  unlimited?: boolean;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export interface DashboardStatsResponse {
  /** Format: int64 */
  totalEmployees?: number;
  /** Format: int64 */
  activeEmployees?: number;
  /** Format: int64 */
  invitedEmployees?: number;
  /** Format: int64 */
  inactiveEmployees?: number;
  /** Format: int64 */
  totalAdmins?: number;
  /** Format: int64 */
  totalSuperAdmins?: number;
  /** Format: int64 */
  pendingLeaves?: number;
  /** Format: int64 */
  approvedLeaves?: number;
  /** Format: int64 */
  rejectedLeaves?: number;
  /** Format: int64 */
  totalLeaves?: number;
}
