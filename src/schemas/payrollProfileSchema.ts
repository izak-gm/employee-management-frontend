import { z } from "zod";

const money = z
  .string()
  .min(1, "Required")
  .refine((v) => !isNaN(Number(v)), "Must be a number")
  .refine((v) => Number(v) >= 0, "Cannot be negative");

const moneyOptional = z
  .string()
  .optional()
  .or(z.literal(""))
  .refine((v) => !v || !isNaN(Number(v)), "Must be a number")
  .refine((v) => !v || Number(v) >= 0, "Cannot be negative");

export const payrollProfileSchema = z.object({
  employeeId: z.string().min(1, "Employee is required"),

  // Salary — basic salary is fixed per individual, not tied to position
  basicSalary: money,

  // Allowances — set once, editable only by re-configuring the profile
  houseAllowance: moneyOptional,
  transportAllowance: moneyOptional,
  medicalAllowance: moneyOptional,
  otherAllowance: moneyOptional,
  pensionContribution: moneyOptional,

  // Bank details
  bankName: z.string().min(1, "Bank name is required"),
  bankBranch: z.string().optional().or(z.literal("")),
  accountNumber: z.string().min(1, "Account number is required"),

  // Statutory numbers
  kraPin: z
    .string()
    .min(1, "KRA PIN is required")
    .regex(/^[A-Z]\d{9}[A-Z]$/, "Format: A123456789Z"),
  shifNumber: z.string().min(1, "SHIF number is required"),
  nssfNumber: z.string().min(1, "NSSF number is required"),

  // Effective dates
  effectiveFrom: z.string().optional().or(z.literal("")),
  effectiveTo: z.string().optional().or(z.literal("")),
});

export type PayrollProfileFormValues = z.infer<typeof payrollProfileSchema>;

export const PAYROLL_PROFILE_DEFAULTS: PayrollProfileFormValues = {
  employeeId: "",
  basicSalary: "",
  houseAllowance: "",
  transportAllowance: "",
  medicalAllowance: "",
  otherAllowance: "",
  pensionContribution: "",
  bankName: "",
  bankBranch: "",
  accountNumber: "",
  kraPin: "",
  shifNumber: "",
  nssfNumber: "",
  effectiveFrom: "",
  effectiveTo: "",
};
