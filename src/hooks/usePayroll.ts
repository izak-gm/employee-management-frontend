/**
 * hooks/usePayroll.ts
 * Hooks for payroll generation, approval workflow, and queries.
 */

import { useCallback, useEffect, useState } from "react";
import {
  generatePayroll,
  approvePayroll,
  markPayrollAsPaid,
  reversePayroll,
  getPayrollsByMonthAndYear,
  getPayrollById,
  resendPayslip,
  downloadPayslip,
  triggerPayslipDownload,
  ApiError,
} from "../api";
import type {
  GeneratePayrollRequest,
  MarkAsPaidRequest,
  ReversePayrollRequest,
  PayrollResponse,
  PayrollSummaryResponse,
} from "../api/types/payroll";
import { deletePayroll } from "../api/payrolls/payroll";

// ── usePayrollList — list of payrolls for a given month/year ──────────────────

export function usePayrollList(month: number, year: number) {
  const [data, setData] = useState<PayrollSummaryResponse[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getPayrollsByMonthAndYear(month, year);
      setData(result);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load payrolls");
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, isLoading, error, reload };
}

// ── usePayroll — single payroll by ID ──────────────────────────────────────────

export function usePayroll(payrollId: string | null) {
  const [data, setData] = useState<PayrollResponse | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!payrollId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await getPayrollById(payrollId);
      setData(result);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load payroll");
    } finally {
      setLoading(false);
    }
  }, [payrollId]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, isLoading, error, reload };
}

// ── usePayrollActions — mutations: generate, approve, mark-paid, reverse ──────

export function usePayrollActions() {
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

  const generate = useCallback(
    (payload: GeneratePayrollRequest) => runAction(() => generatePayroll(payload)),
    [runAction],
  );

  const approve = useCallback(
    (payrollId: string) => runAction(() => approvePayroll(payrollId)),
    [runAction],
  );

  const markPaid = useCallback(
    (payrollId: string, payload: MarkAsPaidRequest) =>
      runAction(() => markPayrollAsPaid(payrollId, payload)),
    [runAction],
  );

  const reverse = useCallback(
    (payrollId: string, payload: ReversePayrollRequest) =>
      runAction(() => reversePayroll(payrollId, payload)),
    [runAction],
  );

  const resend = useCallback(
    (payrollId: string) => runAction(() => resendPayslip(payrollId)),
    [runAction],
  );

  const download = useCallback(
    (payrollId: string, filename: string) =>
      runAction(async () => {
        const blob = await downloadPayslip(payrollId);
        triggerPayslipDownload(blob, filename);
      }),
    [runAction],
  );

  const remove = useCallback(
    (payrollId: string) => runAction(() => deletePayroll(payrollId)),
    [runAction],
  );

  return {
    isProcessing,
    error,
    clearError: () => setError(null),
    generate,
    approve,
    markPaid,
    reverse,
    resend,
    download,
    remove, // add this
  };
}
