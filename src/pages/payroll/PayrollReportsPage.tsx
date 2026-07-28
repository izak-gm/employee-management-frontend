import { useMemo, useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
} from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import DownloadIcon from "@mui/icons-material/Download";
import DescriptionIcon from "@mui/icons-material/Description";
import * as XLSX from "xlsx";
import { usePayrollReports } from "../../hooks/usePayrollReports";
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
  { key: "paye", label: "PAYE" },
  { key: "nssf", label: "NSSF" },
  { key: "shif", label: "SHIF" },
  { key: "housing-levy", label: "Housing Levy" },
  { key: "bank-transfer", label: "Bank Transfer" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const COLUMN_DEFS: Record<TabKey, GridColDef[]> = {
  paye: [
    { field: "employeeNumber", headerName: "Emp No.", width: 110 },
    { field: "employeeFullName", headerName: "Name", flex: 1, minWidth: 180 },
    { field: "kraPin", headerName: "KRA PIN", width: 130 },
    {
      field: "taxablePay",
      headerName: "Taxable Pay",
      width: 140,
      align: "right",
      headerAlign: "right",
      valueFormatter: (v) => fmt(v as number),
    },
    {
      field: "incomeTax",
      headerName: "Income Tax",
      width: 130,
      align: "right",
      headerAlign: "right",
      valueFormatter: (v) => fmt(v as number),
    },
    {
      field: "personalRelief",
      headerName: "Relief",
      width: 120,
      align: "right",
      headerAlign: "right",
      valueFormatter: (v) => fmt(v as number),
    },
    {
      field: "paye",
      headerName: "PAYE",
      width: 130,
      align: "right",
      headerAlign: "right",
      valueFormatter: (v) => fmt(v as number),
    },
  ],
  nssf: [
    { field: "employeeNumber", headerName: "Emp No.", width: 110 },
    { field: "employeeFullName", headerName: "Name", flex: 1, minWidth: 180 },
    { field: "nssfNumber", headerName: "NSSF No.", width: 140 },
    {
      field: "employeeNssf",
      headerName: "Employee",
      width: 130,
      align: "right",
      headerAlign: "right",
      valueFormatter: (v) => fmt(v as number),
    },
    {
      field: "employerNssf",
      headerName: "Employer",
      width: 130,
      align: "right",
      headerAlign: "right",
      valueFormatter: (v) => fmt(v as number),
    },
    {
      field: "totalNssf",
      headerName: "Total",
      width: 130,
      align: "right",
      headerAlign: "right",
      valueFormatter: (v) => fmt(v as number),
    },
  ],
  shif: [
    { field: "employeeNumber", headerName: "Emp No.", width: 110 },
    { field: "employeeFullName", headerName: "Name", flex: 1, minWidth: 180 },
    { field: "shifNumber", headerName: "SHIF No.", width: 140 },
    {
      field: "employeeShif",
      headerName: "SHIF",
      width: 140,
      align: "right",
      headerAlign: "right",
      valueFormatter: (v) => fmt(v as number),
    },
  ],
  "housing-levy": [
    { field: "employeeNumber", headerName: "Emp No.", width: 110 },
    { field: "employeeFullName", headerName: "Name", flex: 1, minWidth: 180 },
    {
      field: "grossPay",
      headerName: "Gross Pay",
      width: 140,
      align: "right",
      headerAlign: "right",
      valueFormatter: (v) => fmt(v as number),
    },
    {
      field: "housingLevy",
      headerName: "Employee",
      width: 130,
      align: "right",
      headerAlign: "right",
      valueFormatter: (v) => fmt(v as number),
    },
    {
      field: "employerHouseLevy",
      headerName: "Employer",
      width: 130,
      align: "right",
      headerAlign: "right",
      valueFormatter: (v) => fmt(v as number),
    },
    {
      field: "totalHouseLevy",
      headerName: "Total",
      width: 130,
      align: "right",
      headerAlign: "right",
      valueFormatter: (v) => fmt(v as number),
    },
  ],
  "bank-transfer": [
    { field: "employeeNumber", headerName: "Emp No.", width: 110 },
    { field: "employeeFullName", headerName: "Name", flex: 1, minWidth: 180 },
    { field: "bankName", headerName: "Bank", width: 160 },
    { field: "bankBranch", headerName: "Branch", width: 160, valueFormatter: (v) => v ?? "—" },
    { field: "accountNumber", headerName: "Account No.", width: 160 },
    {
      field: "netPay",
      headerName: "Net Pay",
      width: 140,
      align: "right",
      headerAlign: "right",
      valueFormatter: (v) => fmt(v as number),
    },
  ],
};

export default function PayrollReportsPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [tab, setTab] = useState<TabKey>("paye");
  const [rows, setRows] = useState<any[]>([]);

  const years = useMemo(() => {
    const y = now.getFullYear();
    return [y - 1, y, y + 1];
  }, [now]);

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
    (async () => {
      let result: any[] | null = null;
      if (tab === "paye") result = await loadPaye(month, year);
      if (tab === "nssf") result = await loadNssf(month, year);
      if (tab === "shif") result = await loadShif(month, year);
      if (tab === "housing-levy") result = await loadHousingLevy(month, year);
      if (tab === "bank-transfer") result = await loadBankTransfer(month, year);
      setRows((result ?? []).map((r, i) => ({ id: r.employeeId ?? i, ...r })));
    })();
  }, [tab, month, year]);

  const handleExportExcel = useCallback(() => {
    if (rows.length === 0) return;

    const columns = COLUMN_DEFS[tab];
    const headerLabels = columns.map((c) => c.headerName as string);
    const dataRows = rows.map((row) =>
      columns.map((c) => {
        const val = row[c.field as string];
        return typeof val === "number" ? val : (val ?? "—");
      }),
    );

    const worksheet = XLSX.utils.aoa_to_sheet([headerLabels, ...dataRows]);
    worksheet["!cols"] = columns.map((c) => ({ wch: Math.max(12, (c.width ?? 120) / 8) }));

    const workbook = XLSX.utils.book_new();
    const sheetName = TABS.find((t) => t.key === tab)?.label ?? "Report";
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    const filename = `${tab}-report-${year}-${String(month).padStart(2, "0")}.xlsx`;
    XLSX.writeFile(workbook, filename);
  }, [rows, tab, month, year]);

  return (
    <DashboardLayout title="Payroll Reports">
      <Box
        sx={{ bgcolor: "#F7F8FA", minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        <Box sx={{ bgcolor: "#fff", borderBottom: `1px solid ${BORDER}` }}>
          <Box sx={{ px: 3, py: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: NAVY }}>
              Payroll reports
            </Typography>
            <Typography variant="body2" sx={{ color: SLATE, mt: 0.5 }}>
              Statutory and bank transfer reports for a payroll period.
            </Typography>
          </Box>
        </Box>

        <Box sx={{ px: 3, py: 3, flex: 1, display: "flex", flexDirection: "column" }}>
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

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Paper
            variant="outlined"
            sx={{
              borderColor: BORDER,
              borderRadius: 2,
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: `1px solid ${BORDER}`,
                px: 2,
              }}
            >
              <Tabs value={tab} onChange={(_, v) => setTab(v)}>
                {TABS.map((t) => (
                  <Tab
                    key={t.key}
                    value={t.key}
                    label={t.label}
                    sx={{ textTransform: "none", fontWeight: 600 }}
                  />
                ))}
              </Tabs>

              <Box sx={{ display: "flex", gap: 1.5, py: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<DescriptionIcon fontSize="small" />}
                  onClick={handleExportExcel}
                  disabled={rows.length === 0}
                  sx={{ textTransform: "none", fontWeight: 600, borderColor: BORDER, color: NAVY }}
                >
                  Export Excel
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<DownloadIcon fontSize="small" />}
                  onClick={() => download(tab, month, year)}
                  disabled={isDownloading || rows.length === 0}
                  sx={{ textTransform: "none", fontWeight: 600, borderColor: BORDER, color: NAVY }}
                >
                  Download PDF
                </Button>
              </Box>
            </Box>

            <Box sx={{ flex: 1, minHeight: 500, p: 2 }}>
              {isLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                  <CircularProgress size={28} sx={{ color: NAVY }} />
                </Box>
              ) : (
                <DataGrid
                  rows={rows}
                  columns={COLUMN_DEFS[tab]}
                  density="comfortable"
                  disableRowSelectionOnClick
                  pageSizeOptions={[10, 25, 50, 100]}
                  initialState={{
                    pagination: { paginationModel: { pageSize: 25 } },
                  }}
                  sx={{
                    border: "none",
                    "& .MuiDataGrid-columnHeaders": {
                      bgcolor: "#F7F8FA",
                      color: SLATE,
                      fontWeight: 700,
                      fontSize: 12,
                      textTransform: "uppercase",
                    },
                  }}
                  slots={{
                    noRowsOverlay: () => (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "100%",
                        }}
                      >
                        <Typography variant="body2" sx={{ color: SLATE }}>
                          No records for this period.
                        </Typography>
                      </Box>
                    ),
                  }}
                />
              )}
            </Box>
          </Paper>
        </Box>
      </Box>
    </DashboardLayout>
  );
}
