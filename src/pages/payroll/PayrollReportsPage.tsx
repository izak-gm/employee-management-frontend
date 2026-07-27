import { useMemo, useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  MenuItem,
  Button,
  Paper,
  Tabs,
  Tab,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Alert,
  Grid,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { usePayrollSummary, usePayrollReports } from "../../hooks/usePayrollReports";
import DashboardLayout from "../../components/layout/DashboardLayout";

const NAVY = "#132A46";
const SLATE = "#5B6B7F";
const BORDER = "#E4E8ED";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const fmt = (n?: number) =>
  new Intl.NumberFormat("en-KE", { maximumFractionDigits: 0 }).format(n ?? 0);

const TABS = [
  { key: "summary", label: "Summary" },
  { key: "paye", label: "PAYE" },
  { key: "nssf", label: "NSSF" },
  { key: "shif", label: "SHIF" },
  { key: "housing-levy", label: "Housing Levy" },
  { key: "bank-transfer", label: "Bank Transfer" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function PayrollReportsPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [tab, setTab] = useState<TabKey>("summary");
  const [rows, setRows] = useState<any[]>([]);

  const years = useMemo(() => {
    const y = now.getFullYear();
    return [y - 1, y, y + 1];
  }, [now]);

  const {
    data: summary,
    isLoading: isSummaryLoading,
    error: summaryError,
    reload,
  } = usePayrollSummary(month, year);
  const {
    isLoading,
    isDownloading,
    error,
    loadPaye,
    loadNssf,
    loadShif,
    loadHousingLevy,
    loadBankTransfer,
    download,
  } = usePayrollReports();

  useEffect(() => {
    if (tab === "summary") return;
    (async () => {
      let result: any[] | null = null;
      if (tab === "paye") result = await loadPaye(month, year);
      if (tab === "nssf") result = await loadNssf(month, year);
      if (tab === "shif") result = await loadShif(month, year);
      if (tab === "housing-levy") result = await loadHousingLevy(month, year);
      if (tab === "bank-transfer") result = await loadBankTransfer(month, year);
      setRows(result ?? []);
    })();
  }, [tab, month, year]);

  useEffect(() => {
    if (tab === "summary") reload();
  }, [month, year, tab]);

  const columns: Record<TabKey, { key: string; label: string; align?: "right" }[]> = {
    summary: [],
    paye: [
      { key: "employeeNumber", label: "Emp No." },
      { key: "employeeFullName", label: "Name" },
      { key: "kraPin", label: "KRA PIN" },
      { key: "taxablePay", label: "Taxable Pay", align: "right" },
      { key: "incomeTax", label: "Income Tax", align: "right" },
      { key: "personalRelief", label: "Relief", align: "right" },
      { key: "paye", label: "PAYE", align: "right" },
    ],
    nssf: [
      { key: "employeeNumber", label: "Emp No." },
      { key: "employeeFullName", label: "Name" },
      { key: "nssfNumber", label: "NSSF No." },
      { key: "employeeNssf", label: "Employee", align: "right" },
      { key: "employerNssf", label: "Employer", align: "right" },
      { key: "totalNssf", label: "Total", align: "right" },
    ],
    shif: [
      { key: "employeeNumber", label: "Emp No." },
      { key: "employeeFullName", label: "Name" },
      { key: "shifNumber", label: "SHIF No." },
      { key: "employeeShif", label: "SHIF", align: "right" },
    ],
    "housing-levy": [
      { key: "employeeNumber", label: "Emp No." },
      { key: "employeeFullName", label: "Name" },
      { key: "grossPay", label: "Gross Pay", align: "right" },
      { key: "housingLevy", label: "Employee", align: "right" },
      { key: "employerHouseLevy", label: "Employer", align: "right" },
      { key: "totalHouseLevy", label: "Total", align: "right" },
    ],
    "bank-transfer": [
      { key: "employeeNumber", label: "Emp No." },
      { key: "employeeFullName", label: "Name" },
      { key: "bankName", label: "Bank" },
      { key: "bankBranch", label: "Branch" },
      { key: "accountNumber", label: "Account No." },
      { key: "netPay", label: "Net Pay", align: "right" },
    ],
  };

  const renderCell = (col: { key: string; align?: string }, row: any) => {
    const val = row[col.key];
    if (col.align === "right") return fmt(val);
    return val ?? "—";
  };

  return (
    <DashboardLayout title="Payroll Reports">
      <Box sx={{ bgcolor: "#F7F8FA", minHeight: "100vh" }}>
        <Box sx={{ bgcolor: "#fff", borderBottom: `1px solid ${BORDER}` }}>
          <Container maxWidth="lg" sx={{ py: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: NAVY }}>
              Payroll reports
            </Typography>
            <Typography variant="body2" sx={{ color: SLATE, mt: 0.5 }}>
              Summary, statutory, and bank transfer reports for a payroll period.
            </Typography>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Paper
            variant="outlined"
            sx={{ borderColor: BORDER, borderRadius: 2, p: 2, mb: 3, display: "flex", gap: 2 }}
          >
            <TextField
              select
              size="small"
              label="Month"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              sx={{ minWidth: 160 }}
            >
              {MONTH_NAMES.map((name, idx) => (
                <MenuItem key={name} value={idx + 1}>
                  {name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              size="small"
              label="Year"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              sx={{ minWidth: 120 }}
            >
              {years.map((y) => (
                <MenuItem key={y} value={y}>
                  {y}
                </MenuItem>
              ))}
            </TextField>
          </Paper>

          {(error || summaryError) && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error || summaryError}
            </Alert>
          )}

          <Paper variant="outlined" sx={{ borderColor: BORDER, borderRadius: 2 }}>
            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              sx={{ borderBottom: `1px solid ${BORDER}`, px: 2 }}
            >
              {TABS.map((t) => (
                <Tab
                  key={t.key}
                  value={t.key}
                  label={t.label}
                  sx={{ textTransform: "none", fontWeight: 600 }}
                />
              ))}
            </Tabs>

            <Box sx={{ p: 3 }}>
              {tab === "summary" ? (
                isSummaryLoading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                    <CircularProgress size={28} sx={{ color: NAVY }} />
                  </Box>
                ) : summary ? (
                  <Grid container spacing={2}>
                    {[
                      ["Employees", summary.employeeCount],
                      ["Gross Pay", fmt(summary.totalGrossPay)],
                      ["Taxable Pay", fmt(summary.totalTaxablePay)],
                      ["PAYE", fmt(summary.totalPaye)],
                      ["NSSF (Employee)", fmt(summary.totalNssf)],
                      ["NSSF (Employer)", fmt(summary.totalEmployerNssf)],
                      ["SHIF (Employee)", fmt(summary.totalShif)],
                      ["Housing Levy", fmt(summary.totalHousingLevy)],
                      ["Housing Levy(Employer)", fmt(summary.totalHousingLevy)],
                      ["Pension", fmt(summary.totalPensionContribution)],
                      ["Statutory Deductions", fmt(summary.totalStatutoryDeductions)],
                      ["Total Deductions", fmt(summary.totalDeductions)],
                      ["Net Pay", fmt(summary.totalNetPay)],
                    ].map(([label, value]) => (
                      <Grid size={{ xs: 6, sm: 4, md: 3 }} key={label as string}>
                        <Paper
                          variant="outlined"
                          sx={{ borderColor: BORDER, borderRadius: 1.5, p: 2 }}
                        >
                          <Typography variant="caption" sx={{ color: SLATE }}>
                            {label}
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: NAVY }}>
                            {value}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography variant="body2" sx={{ color: SLATE }}>
                    No data for this period.
                  </Typography>
                )
              ) : (
                <>
                  <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<DownloadIcon fontSize="small" />}
                      onClick={() => download(tab, month, year)}
                      disabled={isDownloading || rows.length === 0}
                      sx={{
                        textTransform: "none",
                        fontWeight: 600,
                        borderColor: BORDER,
                        color: NAVY,
                      }}
                    >
                      Download PDF
                    </Button>
                  </Box>
                  {isLoading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                      <CircularProgress size={28} sx={{ color: NAVY }} />
                    </Box>
                  ) : rows.length === 0 ? (
                    <Typography variant="body2" sx={{ color: SLATE, textAlign: "center", py: 4 }}>
                      No records for this period.
                    </Typography>
                  ) : (
                    <Box sx={{ overflowX: "auto" }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            {columns[tab].map((c) => (
                              <TableCell
                                key={c.key}
                                align={c.align}
                                sx={{
                                  fontWeight: 700,
                                  fontSize: 12,
                                  color: SLATE,
                                  textTransform: "uppercase",
                                }}
                              >
                                {c.label}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {rows.map((row, i) => (
                            <TableRow key={i} hover>
                              {columns[tab].map((c) => (
                                <TableCell key={c.key} align={c.align}>
                                  {renderCell(c, row)}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Box>
                  )}
                </>
              )}
            </Box>
          </Paper>
        </Container>
      </Box>
    </DashboardLayout>
  );
}
