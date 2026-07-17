import { z } from "zod";
import { isValidPhoneNumber } from "react-phone-number-input";
import type { CreateEmployeeRequest } from "../api/types";

export const ROLES = [
  "SUPERADMIN",
  "HR_ADMIN",
  "HR_OFFICER",
  "PAYROLL_MANAGER",
  "FINANCE_MANAGER",
  "TECH_LEAD",
  "SOFTWARE_ENGINEER",
  "INTERN",
] as const;

export const GENDERS = ["MALE", "FEMALE"] as const;

export const EMPLOYMENT_TYPES = ["PERMANENT", "CONTRACT", "INTERN", "PART_TIME", "CASUAL"] as const;

export const personalDetailsSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email address"),

  phoneNumber: z.string().refine(isValidPhoneNumber, {
    message: "Enter a valid phone number",
  }),

  gender: z.enum(GENDERS),

  dateOfBirth: z.string().optional(),

  nationalId: z.string().optional(),
});

export const employmentDetailsSchema = z.object({
  role: z.enum(ROLES),

  hireDate: z.string().min(1, "Hire date is required"),

  confirmationDate: z.string().optional(),

  employment_type: z.enum(EMPLOYMENT_TYPES).optional(),

  departmentId: z.string().uuid().optional(),

  positionId: z.string().uuid().optional(),

  supervisorId: z.string().uuid().optional(),
});
export const createEmployeeSchema = personalDetailsSchema.merge(employmentDetailsSchema);

export type PersonalDetailsForm = z.infer<typeof personalDetailsSchema>;
export type EmploymentDetailsForm = z.infer<typeof employmentDetailsSchema>;
export type CreateEmployeeForm = z.infer<typeof createEmployeeSchema>;

// ─── Added ─────────────────────────────────────────────────────────────────────

/** Per-step field keys — used by CreateEmployeeForm to trigger validation per step */
export const STEP_FIELDS: (keyof CreateEmployeeForm)[][] = [
  Object.keys(personalDetailsSchema.shape) as (keyof CreateEmployeeForm)[],
  Object.keys(employmentDetailsSchema.shape) as (keyof CreateEmployeeForm)[],
  [], // Review step — no new fields
];

/**
 * Maps form values to the API CreateEmployeeRequest payload.
 * z.preprocess already converts "" → undefined for optional fields,
 * so this is mostly a type-safe pass-through.
 */
export function toCreateEmployeeRequest(data: CreateEmployeeForm): CreateEmployeeRequest {
  return {
    firstName: data.firstName,
    middleName: data.middleName || undefined,
    lastName: data.lastName,
    email: data.email,
    phoneNumber: data.phoneNumber,
    gender: data.gender,
    dateOfBirth: data.dateOfBirth || undefined,
    nationalId: data.nationalId || undefined,
    role: data.role,
    hireDate: data.hireDate,
    confirmationDate: data.confirmationDate || undefined,
    employment_type: data.employment_type,
    departmentId: data.departmentId,
    positionId: data.positionId,
    supervisorId: data.supervisorId,
  };
}
