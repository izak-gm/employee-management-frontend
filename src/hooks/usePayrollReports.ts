import { useCallback, useEffect, useState } from "react";
import {
  getPayrollSummary,
  getPayeReport,
  downloadPayeReportPdf,
  getNssfReport,
  downloadNssfReportPdf,
  getShifReport,
  downloadShifReportPdf,
  getHousingLevyReport,
  downloadHousingLevyReportPdf,
  getBankTransferReport,
  downloadBankTransferReportPdf,
  triggerReportDownload,
  ApiError,
} from "../api";
import type { PayrollSummaryTotals } from "../api/types/payrollReports";

export function usePayrollSummary(month: number, year: number) {
  const [data, setData] = useState<PayrollSummaryTotals | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await getPayrollSummary(month, year));
    } catch (err) {
      setData(null);
      setError(err instanceof ApiError ? err.message : "Failed to load payroll summary");
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, isLoading, error, reload };
}

type ReportKind = "paye" | "nssf" | "shif" | "housing-levy" | "bank-transfer";

export function usePayrollReports() {
  const [isLoading, setLoading] = useState(false);
  const [isDownloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // const fetchPaye = useCallback((m: number, y: number) => run(() => getPayeReport(m, y))(), []);

  function run<T>(fn: () => Promise<T>) {
    return async (): Promise<T | null> => {
      setLoading(true);
      setError(null);
      try {
        return await fn();
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Failed to load report");
        return null;
      } finally {
        setLoading(false);
      }
    };
  }

  const loadPaye = useCallback(
    (month: number, year: number) => run(() => getPayeReport(month, year))(),
    [],
  );
  const loadNssf = useCallback(
    (month: number, year: number) => run(() => getNssfReport(month, year))(),
    [],
  );
  const loadShif = useCallback(
    (month: number, year: number) => run(() => getShifReport(month, year))(),
    [],
  );
  const loadHousingLevy = useCallback(
    (month: number, year: number) => run(() => getHousingLevyReport(month, year))(),
    [],
  );
  const loadBankTransfer = useCallback(
    (month: number, year: number) => run(() => getBankTransferReport(month, year))(),
    [],
  );

  const download = useCallback(async (kind: ReportKind, month: number, year: number) => {
    setDownloading(true);
    setError(null);
    try {
      const fetchers: Record<ReportKind, (m: number, y: number) => Promise<Blob>> = {
        paye: downloadPayeReportPdf,
        nssf: downloadNssfReportPdf,
        shif: downloadShifReportPdf,
        "housing-levy": downloadHousingLevyReportPdf,
        "bank-transfer": downloadBankTransferReportPdf,
      };
      const blob = await fetchers[kind](month, year);
      if (blob.size === 0) {
        setError(null);
        return;
      }
      triggerReportDownload(blob, `${kind}-report-${year}-${String(month).padStart(2, "0")}.pdf`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to download report");
    } finally {
      setDownloading(false);
    }
  }, []);

  return {
    isLoading,
    isDownloading,
    error,
    clearError: () => setError(null),
    loadPaye,
    loadNssf,
    loadShif,
    loadHousingLevy,
    loadBankTransfer,
    download,
  };
}
