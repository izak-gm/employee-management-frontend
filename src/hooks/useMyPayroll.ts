/**
 * hooks/useMyPayroll.ts
 * Employee self-service — viewing and downloading own payslips.
 */

import { useCallback, useEffect, useState } from "react";
import {
  getMyPayrolls,
  getMyPayrollForPeriod,
  downloadMyPayslip,
  triggerPayslipDownload,
  ApiError,
} from "../api";
import type { PayrollResponse, PayrollSummaryResponse } from "../api/types/payroll";

// ── useMyPayrolls — list of the current employee's own payrolls ───────────────

export function useMyPayrolls() {
  const [data, setData] = useState<PayrollSummaryResponse[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getMyPayrolls();
      setData(result);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load your payrolls");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, isLoading, error, reload };
}

// ── useMyPayrollForPeriod — a specific month/year for the current employee ────

export function useMyPayrollForPeriod(month: number, year: number) {
  const [data, setData] = useState<PayrollResponse | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getMyPayrollForPeriod(month, year);
      setData(result);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No payroll found for this period");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, isLoading, error, reload };
}

// ── useMyPayslipDownload — download own payslip PDF ────────────────────────────

export function useMyPayslipDownload() {
  const [isDownloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const download = useCallback(async (month: number, year: number) => {
    setDownloading(true);
    setError(null);
    try {
      const blob = await downloadMyPayslip(month, year);
      triggerPayslipDownload(blob, `Payslip-${year}-${String(month).padStart(2, "0")}.pdf`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to download payslip");
    } finally {
      setDownloading(false);
    }
  }, []);

  return { download, isDownloading, error, clearError: () => setError(null) };
}
