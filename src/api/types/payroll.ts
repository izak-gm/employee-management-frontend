/**
 * api/types.ts — ADD these to your existing types.ts file
 * (append to the file, don't replace it — keep your existing Employee/Leave/etc types)
 */

// ─── Enums ────────────────────────────────────────────────────────────────────

export type PayrollStatus = "DRAFT" | "GENERATED" | "APPROVED" | "PAID" | "REVERSED";

export type DeductionCalculationType = "FIXED" | "PERCENTAGE" | "MANUAL" | "FORMULA";

// ─── Payroll ──────────────────────────────────────────────────────────────────

export interface GeneratePayrollRequest {
  /** Format: int32 */
  month: number;
  /** Format: int32 */
  year: number;
  employeeIds?: string[];
}

export interface MarkAsPaidRequest {
  paymentReference: string;
}

export interface ReversePayrollRequest {
  reason: string;
}
export interface BulkReverseRequest {
  payrollIds: string[];
  reason: string;
}
export interface PayrollEarningResponse {
  /** Format: uuid */
  id?: string;
  earningType?: string;
  taxable?: boolean;
  amount?: number;
  remarks?: string;
}

export interface PayrollDeductionResponse {
  /** Format: uuid */
  id?: string;
  deductionType?: string;
  statutory?: boolean;
  amount?: number;
  remarks?: string;
}

export interface PayrollResponse {
  /** Format: uuid */
  id?: string;
  payrollNumber?: string;
  /** Format: uuid */
  employeeId?: string;
  employeeNumber?: string;
  employeeFullName?: string;
  department?: string;
  position?: string;
  /** Format: int32 */
  payrollMonth?: number;
  /** Format: int32 */
  payrollYear?: number;
  /** Format: date */
  payrollDate?: string;
  grossPay?: number;
  taxablePay?: number;
  totalEarnings?: number;
  totalDeductions?: number;
  netPay?: number;
  paye?: number;
  nssf?: number;
  shif?: number;
  housingLevy?: number;
  employerNssf?: number;
  employerShif?: number;
  earnings?: PayrollEarningResponse[];
  deductions?: PayrollDeductionResponse[];
  status?: PayrollStatus;
  generatedBy?: string;
  /** Format: date-time */
  generatedAt?: string;
  approvedBy?: string;
  /** Format: date-time */
  approvedAt?: string;
  reversedBy?: string;
  /** Format: date-time */
  reversedAt?: string;
  reversalReason?: string;
  /** Format: date */
  paymentDate?: string;
  paymentReference?: string;
  remarks?: string;
}

export interface PayrollSummaryResponse {
  /** Format: uuid */
  id?: string;
  payrollNumber?: string;
  /** Format: uuid */
  employeeId?: string;
  employeeFullName?: string;
  employeeNumber?: string;
  department?: string;
  /** Format: int32 */
  payrollMonth?: number;
  /** Format: int32 */
  payrollYear?: number;
  grossPay?: number;
  netPay?: number;
  totalDeductions?: number;
  status?: PayrollStatus;
  /** Format: date */
  payrollDate?: string;
  /** Format: date */
  paymentDate?: string;
  personalRelief?: number;
  incomeTax?: number;
  statutoryDeductions?: number;
  payAfterStatutoryDeductions?: number;
}

// ─── Payroll Profile ──────────────────────────────────────────────────────────

export interface PayrollProfileRequest {
  /** Format: uuid */
  employeeId: string;
  basicSalary: number;
  houseAllowance?: number;
  transportAllowance?: number;
  medicalAllowance?: number;
  otherAllowance?: number;
  pensionContribution?: number;
  bankName: string;
  bankBranch?: string;
  accountNumber: string;
  kraPin: string;
  shifNumber: string;
  nssfNumber: string;
  /** Format: date */
  effectiveFrom?: string;
  /** Format: date */
  effectiveTo?: string;
}

export interface PayrollProfileResponse {
  /** Format: uuid */
  id?: string;
  /** Format: uuid */
  employeeId?: string;
  employeeNumber?: string;
  employeeFullName?: string;
  department?: string;
  position?: string;
  basicSalary?: number;
  houseAllowance?: number;
  transportAllowance?: number;
  medicalAllowance?: number;
  otherAllowance?: number;
  pensionContribution?: number;
  grossSalary?: number;
  bankName?: string;
  bankBranch?: string;
  accountNumber?: string;
  kraPin?: string;
  shifNumber?: string;
  nssfNumber?: string;
  active?: boolean;
  /** Format: date */
  effectiveFrom?: string;
}

// ─── Earning Type ─────────────────────────────────────────────────────────────

export interface EarningTypeRequest {
  name: string;
  description?: string;
  taxable: boolean;
  fixed: boolean;
  /** Format: int32 */
  displayOrder?: number;
}

export interface EarningTypeResponse {
  /** Format: uuid */
  id?: string;
  name?: string;
  description?: string;
  taxable?: boolean;
  fixed?: boolean;
  active?: boolean;
  /** Format: int32 */
  displayOrder?: number;
}

// ─── Deduction Type ───────────────────────────────────────────────────────────

export interface DeductionTypeRequest {
  name: string;
  description?: string;
  statutory: boolean;
  taxable: boolean;
  calculationType: DeductionCalculationType;
  fixedAmount?: number;
  percentage?: number;
  /** Format: int32 */
  displayOrder?: number;
}

export interface DeductionTypeResponse {
  /** Format: uuid */
  id?: string;
  name?: string;
  description?: string;
  statutory?: boolean;
  taxable?: boolean;
  active?: boolean;
  calculationType?: DeductionCalculationType;
  fixedAmount?: number;
  percentage?: number;
  /** Format: int32 */
  displayOrder?: number;
}
