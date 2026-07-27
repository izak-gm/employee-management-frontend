import apiClient from "../client";
import type {
  PayrollSummaryTotals,
  PayeReportLine,
  NssfReportLine,
  ShifReportLine,
  HousingLevyReportLine,
  BankTransferReportLine,
} from "../types/payrollReports";

export async function getPayrollSummary(
  month: number,
  year: number,
): Promise<PayrollSummaryTotals> {
  const { data } = await apiClient.get<PayrollSummaryTotals>("/api/v1/payroll/reports/summary", {
    params: { month, year },
  });
  return data;
}

export async function getPayeReport(month: number, year: number): Promise<PayeReportLine[]> {
  const { data } = await apiClient.get<PayeReportLine[]>("/api/v1/payroll/reports/paye", {
    params: { month, year },
  });
  return data;
}

export async function downloadPayeReportPdf(month: number, year: number): Promise<Blob> {
  const { data } = await apiClient.get("/api/v1/payroll/reports/paye/pdf", {
    params: { month, year },
    responseType: "blob",
  });
  return data;
}

export async function getNssfReport(month: number, year: number): Promise<NssfReportLine[]> {
  const { data } = await apiClient.get<NssfReportLine[]>("/api/v1/payroll/reports/nssf", {
    params: { month, year },
  });
  return data;
}

export async function downloadNssfReportPdf(month: number, year: number): Promise<Blob> {
  const { data } = await apiClient.get("/api/v1/payroll/reports/nssf/pdf", {
    params: { month, year },
    responseType: "blob",
  });
  return data;
}

export async function getShifReport(month: number, year: number): Promise<ShifReportLine[]> {
  const { data } = await apiClient.get<ShifReportLine[]>("/api/v1/payroll/reports/shif", {
    params: { month, year },
  });
  return data;
}

export async function downloadShifReportPdf(month: number, year: number): Promise<Blob> {
  const { data } = await apiClient.get("/api/v1/payroll/reports/shif/pdf", {
    params: { month, year },
    responseType: "blob",
  });
  return data;
}

export async function getHousingLevyReport(
  month: number,
  year: number,
): Promise<HousingLevyReportLine[]> {
  const { data } = await apiClient.get<HousingLevyReportLine[]>(
    "/api/v1/payroll/reports/housing-levy",
    {
      params: { month, year },
    },
  );
  return data;
}

export async function downloadHousingLevyReportPdf(month: number, year: number): Promise<Blob> {
  const { data } = await apiClient.get("/api/v1/payroll/reports/housing-levy/pdf", {
    params: { month, year },
    responseType: "blob",
  });
  return data;
}

export async function getBankTransferReport(
  month: number,
  year: number,
): Promise<BankTransferReportLine[]> {
  const { data } = await apiClient.get<BankTransferReportLine[]>(
    "/api/v1/payroll/reports/bank-transfer",
    {
      params: { month, year },
    },
  );
  return data;
}

export async function downloadBankTransferReportPdf(month: number, year: number): Promise<Blob> {
  const { data } = await apiClient.get("/api/v1/payroll/reports/bank-transfer/pdf", {
    params: { month, year },
    responseType: "blob",
  });
  return data;
}

export function triggerReportDownload(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
