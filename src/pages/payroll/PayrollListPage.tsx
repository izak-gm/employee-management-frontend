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
  Checkbox,
  Chip,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import PersonSearchOutlinedIcon from "@mui/icons-material/PersonSearchOutlined";
import DownloadIcon from "@mui/icons-material/Download";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import UndoIcon from "@mui/icons-material/Undo";

import { usePayrollList, usePayrollActions } from "../../hooks/usePayroll";
import { useGeneratedPayrolls, usePayrollBatchActions } from "../../hooks/usePayrollBatch";
import { useActiveEmployees } from "../../hooks/useEmployees"; // existing hook in your app

import PayrollSummaryCards from "../../components/payroll/PayrollSummaryCards";
import PayrollTable from "../../components/payroll/PayrollTable";
import GeneratePayrollDialog from "../../components/payroll/GeneratePayrollDialog";
import PayrollDetailDialog from "../../components/payroll/PayrollDetailDialog";
import MarkAsPaidDialog from "../../components/payroll/MarkAsPaidDialog";
import ReversePayrollDialog from "../../components/payroll/ReversePayrollDialog";
import BulkReverseDialog from "../../components/payroll/BulkReverseDialog";

import type { PayrollSummaryResponse } from "../../api/types/payroll";
import DashboardLayout from "../../components/layout/DashboardLayout";
import DeletePayrollDialog from "./DeletePayrollDialog";

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
  const { approve, download, resend, remove, error: actionError } = usePayrollActions();

  // ── Batch review state ──────────────────────────────────────────────────
  const {
    data: generatedRows,
    isLoading: isGeneratedLoading,
    reload: reloadGenerated,
  } = useGeneratedPayrolls(month, year);

  const {
    approveAll,
    approveByIds,
    reverseByIds,
    downloadReport,
    downloadApprovedReport, // add this
    isProcessing: isBatchProcessing,
    error: batchError,
  } = usePayrollBatchActions();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkReverseOpen, setBulkReverseOpen] = useState(false);
  const [deleteRow, setDeleteRow] = useState<PayrollSummaryResponse | null>(null);

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

  const refreshAll = () => {
    reload();
    reloadGenerated();
    setSelectedIds([]);
  };

  const handleGenerated = (results: PayrollSummaryResponse[]) => {
    setFlash(`Generated ${results.length} payroll ${results.length === 1 ? "record" : "records"}.`);
    refreshAll();
  };

  const handleApprove = async (row: PayrollSummaryResponse) => {
    if (!row.id) return;
    const result = await approve(row.id);
    if (result) {
      setFlash(`${row.employeeFullName}'s payroll approved.`);
      refreshAll();
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

  // ── Batch handlers ──────────────────────────────────────────────────────

  const handleDownloadReport = async () => {
    await downloadReport(year, month);
  };

  const handleApproveAllGenerated = async () => {
    const result = await approveAll(year, month);
    if (result) {
      setFlash(`Approved ${result.length} payroll ${result.length === 1 ? "record" : "records"}.`);
      refreshAll();
    }
  };

  const handleApproveSelected = async () => {
    if (selectedIds.length === 0) return;
    const result = await approveByIds(selectedIds);
    if (result) {
      setFlash(
        `Approved ${result.length} selected payroll ${result.length === 1 ? "record" : "records"}.`,
      );
      refreshAll();
    }
  };

  const toggleSelected = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleSelectAllGenerated = () => {
    const allIds = generatedRows.map((r) => r.id).filter(Boolean) as string[];
    setSelectedIds((prev) => (prev.length === allIds.length ? [] : allIds));
  };

  const handleBulkReverseDone = (result: PayrollSummaryResponse[] | null) => {
    setBulkReverseOpen(false);
    if (result) {
      setFlash(`Reversed ${result.length} payroll ${result.length === 1 ? "record" : "records"}.`);
      refreshAll();
    }
  };
  const handleDownloadApprovedReport = async () => {
    await downloadApprovedReport(year, month);
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteRow?.id) return;
    const result = await remove(deleteRow.id);
    if (result !== null) {
      setFlash(`Deleted payroll ${deleteRow.payrollNumber}.`);
      refreshAll();
    }
    setDeleteRow(null);
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

              <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
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
          {(error || actionError || batchError) && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error || actionError || batchError}
            </Alert>
          )}

          {/* ── Batch review panel ────────────────────────────────────────── */}
          <Paper variant="outlined" sx={{ borderColor: BORDER, borderRadius: 2, p: 2.5, mb: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                mb: generatedRows.length > 0 ? 2 : 0,
              }}
            >
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: NAVY }}>
                  Batch review & approval
                </Typography>
                <Typography variant="body2" sx={{ color: SLATE }}>
                  {isGeneratedLoading
                    ? "Loading generated payrolls…"
                    : `${generatedRows.length} record${generatedRows.length === 1 ? "" : "s"} awaiting approval for ${MONTH_NAMES[month - 1]} ${year}`}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<DownloadIcon fontSize="small" />}
                  onClick={handleDownloadReport}
                  disabled={isBatchProcessing || generatedRows.length === 0}
                  sx={{ textTransform: "none", fontWeight: 600, borderColor: BORDER, color: NAVY }}
                >
                  Download report
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<DoneAllIcon fontSize="small" />}
                  onClick={handleApproveSelected}
                  disabled={isBatchProcessing || selectedIds.length === 0}
                  sx={{ textTransform: "none", fontWeight: 600, borderColor: BORDER, color: NAVY }}
                >
                  Approve selected ({selectedIds.length})
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<DoneAllIcon fontSize="small" />}
                  onClick={handleApproveAllGenerated}
                  disabled={isBatchProcessing || generatedRows.length === 0}
                  sx={{
                    bgcolor: NAVY,
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": { bgcolor: "#1E3A5F" },
                  }}
                >
                  Approve all
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<DownloadIcon fontSize="small" />}
                  onClick={handleDownloadApprovedReport}
                  disabled={isBatchProcessing}
                  sx={{ textTransform: "none", fontWeight: 600, borderColor: BORDER, color: NAVY }}
                >
                  Download approved report
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  color="error"
                  startIcon={<UndoIcon fontSize="small" />}
                  onClick={() => setBulkReverseOpen(true)}
                  disabled={isBatchProcessing}
                  sx={{ textTransform: "none", fontWeight: 600 }}
                >
                  Bulk reverse…
                </Button>
              </Box>
            </Box>

            {!isGeneratedLoading && generatedRows.length > 0 && (
              <Box
                sx={{
                  border: `1px solid ${BORDER}`,
                  borderRadius: 1.5,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    px: 1,
                    py: 0.5,
                    bgcolor: "#F7F8FA",
                    borderBottom: `1px solid ${BORDER}`,
                  }}
                >
                  <Checkbox
                    size="small"
                    checked={
                      selectedIds.length === generatedRows.length && generatedRows.length > 0
                    }
                    indeterminate={
                      selectedIds.length > 0 && selectedIds.length < generatedRows.length
                    }
                    onChange={toggleSelectAllGenerated}
                  />
                  <Typography variant="caption" sx={{ fontWeight: 600, color: SLATE }}>
                    Select all
                  </Typography>
                </Box>
                {generatedRows.map((row) => (
                  <Box
                    key={row.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      px: 1,
                      py: 0.75,
                      borderBottom: `1px solid ${BORDER}`,
                      "&:last-of-type": { borderBottom: "none" },
                    }}
                  >
                    <Checkbox
                      size="small"
                      checked={!!row.id && selectedIds.includes(row.id)}
                      onChange={() => row.id && toggleSelected(row.id)}
                    />
                    <Typography variant="body2" sx={{ flex: 1, color: NAVY }}>
                      {row.employeeFullName} — {row.payrollNumber}
                    </Typography>
                    <Chip
                      label={row.status}
                      size="small"
                      sx={{ bgcolor: "#FFF3CD", color: "#856404", fontWeight: 600, mr: 1 }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ color: SLATE, minWidth: 100, textAlign: "right" }}
                    >
                      {row.netPay?.toLocaleString()}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Paper>

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
                  onDelete={setDeleteRow}
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
            refreshAll();
          }}
        />

        <ReversePayrollDialog
          open={!!reverseRow}
          payroll={reverseRow}
          onClose={() => setReverseRow(null)}
          onDone={() => {
            setFlash(`${reverseRow?.employeeFullName}'s payroll reversed.`);
            refreshAll();
          }}
        />

        <BulkReverseDialog
          open={bulkReverseOpen}
          payrollIds={selectedIds}
          onClose={() => setBulkReverseOpen(false)}
          onSubmit={async (reason) => {
            const result = await reverseByIds({ payrollIds: selectedIds, reason });
            handleBulkReverseDone(result);
          }}
        />
        <DeletePayrollDialog
          open={!!deleteRow}
          payroll={deleteRow}
          onClose={() => setDeleteRow(null)}
          onConfirm={handleDeleteConfirmed}
        />
      </Box>
    </DashboardLayout>
  );
}
