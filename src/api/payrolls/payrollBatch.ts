/**
 * api/payrolls/payrollBatch.ts
 * Batch/bulk payroll operations: review report, bulk approve, bulk reverse.
 */

import apiClient from "../client";
import type { PayrollResponse, PayrollSummaryResponse, BulkReverseRequest } from "../types/payroll";

// ─── Admin: Generated payrolls awaiting approval for a period ─────────────────

export async function getGeneratedPayrolls(
  month: number,
  year: number,
): Promise<PayrollSummaryResponse[]> {
  const { data } = await apiClient.get<PayrollSummaryResponse[]>("/api/v1/payroll/generated", {
    params: { month, year },
  });
  return data;
}

// ─── Admin: Bulk approve all GENERATED payrolls for a period ──────────────────

export async function bulkApprove(year: number, month: number): Promise<PayrollResponse[]> {
  const { data } = await apiClient.post<PayrollResponse[]>(
    `/api/v1/payroll/batch/${year}/${month}/approve`,
  );
  return data;
}

// ─── Admin: Bulk approve specific payrolls by ID ──────────────────────────────

export async function bulkApproveByIds(payrollIds: string[]): Promise<PayrollResponse[]> {
  const { data } = await apiClient.post<PayrollResponse[]>(
    "/api/v1/payroll/batch/approve",
    payrollIds,
  );
  return data;
}

// ─── Admin: Bulk reverse specific payrolls ─────────────────────────────────────

export async function bulkReverse(payload: BulkReverseRequest): Promise<PayrollResponse[]> {
  const { data } = await apiClient.post<PayrollResponse[]>(
    "/api/v1/payroll/batch/reverse",
    payload,
  );
  return data;
}

// ─── Admin: Download batch payroll report PDF for a period ───────────────────

export async function downloadBatchReport(year: number, month: number): Promise<Blob> {
  const { data } = await apiClient.get(`/api/v1/payroll/batch/${year}/${month}/report`, {
    responseType: "blob",
  });
  return data;
}

export async function downloadApprovedBatchReport(year: number, month: number): Promise<Blob> {
  const { data } = await apiClient.get(`/api/v1/payroll/batch/${year}/${month}/report/approved`, {
    responseType: "blob",
  });
  return data;
}

// ─── Helper: trigger browser download for a batch report Blob ────────────────

export function triggerBatchReportDownload(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
