/**
 * hooks/usePayrollBatch.ts
 * Hooks for the batch payroll review-and-approve workflow:
 * list GENERATED payrolls, download the review report, bulk approve, bulk reverse.
 */

import { useCallback, useEffect, useState } from "react";
import {
  getGeneratedPayrolls,
  bulkApprove,
  bulkApproveByIds,
  bulkReverse,
  downloadBatchReport,
  triggerBatchReportDownload,
  ApiError,
  downloadApprovedBatchReport,
} from "../api";
import type {
  PayrollResponse,
  PayrollSummaryResponse,
  BulkReverseRequest,
} from "../api/types/payroll";

// ── useGeneratedPayrolls — GENERATED payrolls for a period, awaiting approval ──

export function useGeneratedPayrolls(month: number, year: number) {
  const [data, setData] = useState<PayrollSummaryResponse[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getGeneratedPayrolls(month, year);
      setData(result);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load generated payrolls");
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, isLoading, error, reload };
}

// ── usePayrollBatchActions — bulk approve / bulk reverse / report download ────

export function usePayrollBatchActions() {
  const [isProcessing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAction = useCallback(async <T>(action: () => Promise<T>): Promise<T | null> => {
    setProcessing(true);
    setError(null);
    try {
      return await action();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Action failed");
      return null;
    } finally {
      setProcessing(false);
    }
  }, []);

  const approveAll = useCallback(
    (year: number, month: number): Promise<PayrollResponse[] | null> =>
      runAction(() => bulkApprove(year, month)),
    [runAction],
  );

  const approveByIds = useCallback(
    (payrollIds: string[]): Promise<PayrollResponse[] | null> =>
      runAction(() => bulkApproveByIds(payrollIds)),
    [runAction],
  );

  const reverseByIds = useCallback(
    (payload: BulkReverseRequest): Promise<PayrollResponse[] | null> =>
      runAction(() => bulkReverse(payload)),
    [runAction],
  );

  const downloadReport = useCallback(
    (year: number, month: number) =>
      runAction(async () => {
        const blob = await downloadBatchReport(year, month);
        triggerBatchReportDownload(
          blob,
          `payroll-batch-${year}-${String(month).padStart(2, "0")}.pdf`,
        );
      }),
    [runAction],
  );

  const downloadApprovedReport = useCallback(
    (year: number, month: number) =>
      runAction(async () => {
        const blob = await downloadApprovedBatchReport(year, month);
        triggerBatchReportDownload(
          blob,
          `payroll-approved-${year}-${String(month).padStart(2, "0")}.pdf`,
        );
      }),
    [runAction],
  );

  return {
    isProcessing,
    error,
    clearError: () => setError(null),
    approveAll,
    approveByIds,
    reverseByIds,
    downloadReport,
    downloadApprovedReport, // add this
  };
}
