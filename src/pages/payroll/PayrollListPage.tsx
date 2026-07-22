import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  TextField,
  MenuItem,
  Button,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import PersonSearchOutlinedIcon from "@mui/icons-material/PersonSearchOutlined";

import { usePayrollList, usePayrollActions } from "../../hooks/usePayroll";
import { useActiveEmployees } from "../../hooks/useEmployees"; // existing hook in your app

import PayrollSummaryCards from "../../components/payroll/PayrollSummaryCards";
import PayrollTable from "../../components/payroll/PayrollTable";
import GeneratePayrollDialog from "../../components/payroll/GeneratePayrollDialog";
import PayrollDetailDialog from "../../components/payroll/PayrollDetailDialog";
import MarkAsPaidDialog from "../../components/payroll/MarkAsPaidDialog";
import ReversePayrollDialog from "../../components/payroll/ReversePayrollDialog";

import type { PayrollSummaryResponse } from "../../api/types/payroll";
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

export default function PayrollListPage() {
  const navigate = useNavigate();

  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const { data: rows, isLoading, error, reload } = usePayrollList(month, year);
  const { data: employees = [] } = useActiveEmployees();
  const { approve, download, resend, error: actionError } = usePayrollActions();

  const [generateOpen, setGenerateOpen] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [markPaidRow, setMarkPaidRow] = useState<PayrollSummaryResponse | null>(null);
  const [reverseRow, setReverseRow] = useState<PayrollSummaryResponse | null>(null);
  const [flash, setFlash] = useState<string | null>(null);

  const years = useMemo(() => {
    const y = now.getFullYear();
    return [y - 1, y, y + 1];
  }, [now]);

  const employeeOptions = useMemo(
    () =>
      employees.map((e) => ({
        id: e.id ?? "",
        label: [e.firstName, e.lastName].filter(Boolean).join(" "),
      })),
    [employees],
  );

  const handleGenerated = (results: PayrollSummaryResponse[]) => {
    setFlash(`Generated ${results.length} payroll ${results.length === 1 ? "record" : "records"}.`);
    reload();
  };

  const handleApprove = async (row: PayrollSummaryResponse) => {
    if (!row.id) return;
    const result = await approve(row.id);
    if (result) {
      setFlash(`${row.employeeFullName}'s payroll approved.`);
      reload();
    }
  };

  const handleResend = async (row: PayrollSummaryResponse) => {
    if (!row.id) return;
    const result = await resend(row.id);
    if (result !== null) setFlash(`Payslip resent to ${row.employeeFullName}.`);
  };

  const handleDownload = async (row: PayrollSummaryResponse) => {
    if (!row.id) return;
    await download(row.id, `Payslip-${row.payrollNumber}.pdf`);
  };

  return (
    <DashboardLayout title="Payrolls">
      <Box sx={{ bgcolor: "#F7F8FA", minHeight: "100vh" }}>
        {/* Header */}
        <Box sx={{ bgcolor: "#fff", borderBottom: `1px solid ${BORDER}` }}>
          <Container maxWidth="lg" sx={{ py: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
              }}
            >
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: NAVY }}>
                  Payroll
                </Typography>
                <Typography variant="body2" sx={{ color: SLATE, mt: 0.5 }}>
                  Generate, review, and approve monthly payroll runs.
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1.5 }}>
                <Button
                  variant="outlined"
                  startIcon={<PersonSearchOutlinedIcon fontSize="small" />}
                  onClick={() => navigate("/payroll/profiles")}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    borderColor: BORDER,
                    color: NAVY,
                  }}
                >
                  Payroll profiles
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddCircleIcon fontSize="small" />}
                  onClick={() => setGenerateOpen(true)}
                  sx={{
                    bgcolor: NAVY,
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": { bgcolor: "#1E3A5F" },
                  }}
                >
                  Generate payroll
                </Button>
              </Box>
            </Box>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Period selector */}
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

          {flash && (
            <Alert severity="success" sx={{ mb: 2 }} onClose={() => setFlash(null)}>
              {flash}
            </Alert>
          )}
          {(error || actionError) && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error || actionError}
            </Alert>
          )}

          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress size={28} sx={{ color: NAVY }} />
            </Box>
          ) : (
            <>
              <PayrollSummaryCards rows={rows} />

              <Paper variant="outlined" sx={{ borderColor: BORDER, borderRadius: 2 }}>
                <PayrollTable
                  rows={rows}
                  onView={(row) => row.id && setDetailId(row.id)}
                  onApprove={handleApprove}
                  onMarkPaid={setMarkPaidRow}
                  onReverse={setReverseRow}
                  onResend={handleResend}
                  onDownload={handleDownload}
                />
              </Paper>
            </>
          )}
        </Container>

        {/* Dialogs */}
        <GeneratePayrollDialog
          open={generateOpen}
          onClose={() => setGenerateOpen(false)}
          employees={employeeOptions}
          defaultMonth={month}
          defaultYear={year}
          onGenerated={handleGenerated}
        />

        <PayrollDetailDialog
          open={!!detailId}
          payrollId={detailId}
          onClose={() => setDetailId(null)}
        />

        <MarkAsPaidDialog
          open={!!markPaidRow}
          payroll={markPaidRow}
          onClose={() => setMarkPaidRow(null)}
          onDone={() => {
            setFlash(`${markPaidRow?.employeeFullName}'s payroll marked as paid.`);
            reload();
          }}
        />

        <ReversePayrollDialog
          open={!!reverseRow}
          payroll={reverseRow}
          onClose={() => setReverseRow(null)}
          onDone={() => {
            setFlash(`${reverseRow?.employeeFullName}'s payroll reversed.`);
            reload();
          }}
        />
      </Box>
    </DashboardLayout>
  );
}
