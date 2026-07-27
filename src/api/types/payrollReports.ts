export interface PayrollSummaryTotals {
  month: number;
  year: number;
  employeeCount: number;
  totalGrossPay: number;
  totalTaxablePay: number;
  totalPaye: number;
  totalNssf: number;
  totalEmployerNssf: number;
  totalShif: number;
  totalEmployerShif: number;
  totalHousingLevy: number;
  totalPensionContribution: number;
  totalStatutoryDeductions: number;
  totalDeductions: number;
  totalNetPay: number;
}

export interface PayeReportLine {
  employeeId: string;
  employeeNumber: string;
  employeeFullName: string;
  kraPin: string;
  taxablePay: number;
  incomeTax: number;
  personalRelief: number;
  paye: number;
}

export interface NssfReportLine {
  employeeId: string;
  employeeNumber: string;
  employeeFullName: string;
  nssfNumber: string;
  employeeNssf: number;
  employerNssf: number;
  totalNssf: number;
}

export interface ShifReportLine {
  employeeId: string;
  employeeNumber: string;
  employeeFullName: string;
  shifNumber: string;
  employeeShif: number;
}

export interface HousingLevyReportLine {
  employeeId: string;
  employeeNumber: string;
  employeeFullName: string;
  grossPay: number;
  housingLevy: number;
  employerHouseLevy: number;
  totalHouseLevy: number;
}

export interface BankTransferReportLine {
  employeeId: string;
  employeeNumber: string;
  employeeFullName: string;
  bankName: string;
  bankBranch: string | null;
  accountNumber: string;
  netPay: number;
}
