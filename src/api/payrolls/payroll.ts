/**
 * api/payroll.ts
 * Endpoints:
 *   POST   /api/v1/payroll/generate                    — generate payroll
 *   PUT    /api/v1/payroll/{payrollId}/approve          — approve
 *   PUT    /api/v1/payroll/{payrollId}/mark-paid        — mark as paid
 *   PUT    /api/v1/payroll/{payrollId}/reverse          — reverse
 *   GET    /api/v1/payroll?month=&year=                 — list by month/year
 *   GET    /api/v1/payroll/{payrollId}                  — get single
 *   POST   /api/v1/payroll/{payrollId}/resend-payslip   — resend email
 *   GET    /api/v1/payroll/{payrollId}/payslip           — download PDF (admin)
 *   GET    /api/v1/payroll/me                           — my payrolls
 *   GET    /api/v1/payroll/me/{month}/{year}            — my payroll for period
 *   GET    /api/v1/payroll/me/{month}/{year}/payslip    — download own payslip
 */

import apiClient from "../client";
import type {
  GeneratePayrollRequest,
  MarkAsPaidRequest,
  ReversePayrollRequest,
  PayrollResponse,
  PayrollSummaryResponse,
} from "../types/payroll";

// ─── Admin: Generate ──────────────────────────────────────────────────────────

export async function generatePayroll(
  payload: GeneratePayrollRequest,
): Promise<PayrollSummaryResponse[]> {
  const { data } = await apiClient.post<PayrollSummaryResponse[]>(
    "/api/v1/payroll/generate",
    payload,
  );
  return data;
}

// ─── Admin: Approve ───────────────────────────────────────────────────────────

export async function approvePayroll(payrollId: string): Promise<PayrollResponse> {
  const { data } = await apiClient.put<PayrollResponse>(`/api/v1/payroll/${payrollId}/approve`);
  return data;
}

// ─── Finance: Mark as paid ────────────────────────────────────────────────────

export async function markPayrollAsPaid(
  payrollId: string,
  payload: MarkAsPaidRequest,
): Promise<PayrollResponse> {
  const { data } = await apiClient.put<PayrollResponse>(
    `/api/v1/payroll/${payrollId}/mark-paid`,
    payload,
  );
  return data;
}

// ─── Admin: Reverse ───────────────────────────────────────────────────────────

export async function reversePayroll(
  payrollId: string,
  payload: ReversePayrollRequest,
): Promise<PayrollResponse> {
  const { data } = await apiClient.put<PayrollResponse>(
    `/api/v1/payroll/${payrollId}/reverse`,
    payload,
  );
  return data;
}

// ─── Admin: List by month/year ────────────────────────────────────────────────

export async function getPayrollsByMonthAndYear(
  month: number,
  year: number,
): Promise<PayrollSummaryResponse[]> {
  const { data } = await apiClient.get<PayrollSummaryResponse[]>("/api/v1/payroll", {
    params: { month, year },
  });
  return data;
}

// ─── Admin: Get single payroll ────────────────────────────────────────────────

export async function getPayrollById(payrollId: string): Promise<PayrollResponse> {
  const { data } = await apiClient.get<PayrollResponse>(`/api/v1/payroll/${payrollId}`);
  return data;
}

// ─── Admin: Re-send payslip email ─────────────────────────────────────────────

export async function resendPayslip(payrollId: string): Promise<void> {
  await apiClient.post(`/api/v1/payroll/${payrollId}/resend-payslip`);
}

// ─── Admin: Download payslip PDF ──────────────────────────────────────────────

export async function downloadPayslip(payrollId: string): Promise<Blob> {
  const { data } = await apiClient.get(`/api/v1/payroll/${payrollId}/payslip`, {
    responseType: "blob",
  });
  return data;
}

// ─── Employee: My payrolls ─────────────────────────────────────────────────────

export async function getMyPayrolls(): Promise<PayrollSummaryResponse[]> {
  const { data } = await apiClient.get<PayrollSummaryResponse[]>("/api/v1/payroll/me");
  return data;
}

// ─── Employee: My payroll for a specific period ───────────────────────────────

export async function getMyPayrollForPeriod(month: number, year: number): Promise<PayrollResponse> {
  const { data } = await apiClient.get<PayrollResponse>(`/api/v1/payroll/me/${month}/${year}`);
  return data;
}

// ─── Employee: Download own payslip ───────────────────────────────────────────

export async function downloadMyPayslip(month: number, year: number): Promise<Blob> {
  const { data } = await apiClient.get(`/api/v1/payroll/me/${month}/${year}/payslip`, {
    responseType: "blob",
  });
  return data;
}

// ─── Helper: trigger browser download for a payslip Blob ─────────────────────

export function triggerPayslipDownload(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
