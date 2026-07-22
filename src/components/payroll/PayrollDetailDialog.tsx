import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Divider,
  Button,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";

import PayrollStatusChip from "./PayrollStatusChip";
import { usePayroll, usePayrollActions } from "../../hooks/usePayroll";

const NAVY = "#132A46";
const SLATE = "#5B6B7F";
const BORDER = "#E4E8ED";
const SURFACE = "#F7F8FA";
const DANGER = "#B3261E";

const fmt = (n?: number) =>
  new Intl.NumberFormat("en-KE", { maximumFractionDigits: 0 }).format(n ?? 0);

interface Props {
  open: boolean;
  payrollId: string | null;
  onClose: () => void;
}

export default function PayrollDetailDialog({ open, payrollId, onClose }: Props) {
  const { data: payroll, isLoading, error } = usePayroll(open ? payrollId : null);
  const { resend, download, isProcessing } = usePayrollActions();

  const handleDownload = () => {
    if (payroll?.id) {
      download(payroll.id, `Payslip-${payroll.payrollNumber}.pdf`);
    }
  };

  const handleResend = () => {
    if (payroll?.id) resend(payroll.id);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pr: 1 }}
      >
        <Typography sx={{ fontWeight: 700, color: NAVY }}>Payroll details</Typography>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ bgcolor: SURFACE }}>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress size={26} sx={{ color: NAVY }} />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : payroll ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            {/* Header card */}
            <Box
              sx={{
                bgcolor: NAVY,
                color: "#fff",
                borderRadius: 2,
                p: 2.5,
              }}
            >
              <Box
                sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}
              >
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {payroll.employeeFullName}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    {payroll.employeeNumber} · {payroll.department} · {payroll.position}
                  </Typography>
                </Box>
                <PayrollStatusChip status={payroll.status} />
              </Box>
              <Divider sx={{ my: 1.5, borderColor: "rgba(255,255,255,0.15)" }} />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  {payroll.payrollNumber}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  {payroll.payrollMonth}/{payroll.payrollYear}
                </Typography>
              </Box>
            </Box>

            {/* Earnings */}
            <Box sx={{ bgcolor: "#fff", borderRadius: 2, border: `1px solid ${BORDER}`, p: 2.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: NAVY, mb: 1.5 }}>
                Earnings
              </Typography>
              {payroll.earnings?.map((e) => (
                <Box key={e.id} sx={{ display: "flex", justifyContent: "space-between", py: 0.5 }}>
                  <Typography variant="body2" sx={{ color: SLATE }}>
                    {e.earningType}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {fmt(e.amount)}
                  </Typography>
                </Box>
              ))}
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: NAVY }}>
                  Gross pay
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: NAVY }}>
                  KES {fmt(payroll.grossPay)}
                </Typography>
              </Box>
            </Box>

            {/* Deductions */}
            <Box sx={{ bgcolor: "#fff", borderRadius: 2, border: `1px solid ${BORDER}`, p: 2.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: NAVY, mb: 1.5 }}>
                Deductions
              </Typography>
              {payroll.deductions?.map((d) => (
                <Box key={d.id} sx={{ display: "flex", justifyContent: "space-between", py: 0.5 }}>
                  <Typography variant="body2" sx={{ color: SLATE }}>
                    {d.deductionType}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: DANGER }}>
                    −{fmt(d.amount)}
                  </Typography>
                </Box>
              ))}
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: NAVY }}>
                  Total deductions
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: DANGER }}>
                  −KES {fmt(payroll.totalDeductions)}
                </Typography>
              </Box>
            </Box>

            {/* Net pay */}
            <Box
              sx={{
                bgcolor: "#E7F3EE",
                borderRadius: 2,
                p: 2.5,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1E6B4E" }}>
                Net pay
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#1E6B4E" }}>
                KES {fmt(payroll.netPay)}
              </Typography>
            </Box>

            {payroll.paymentReference && (
              <Typography variant="caption" sx={{ color: SLATE, textAlign: "right" }}>
                Payment ref: {payroll.paymentReference} · {payroll.paymentDate}
              </Typography>
            )}
            {payroll.reversalReason && (
              <Box sx={{ bgcolor: "#FBEAEA", borderRadius: 1.5, p: 2 }}>
                <Typography variant="caption" sx={{ color: DANGER, fontWeight: 700 }}>
                  Reversed
                </Typography>
                <Typography variant="body2" sx={{ color: DANGER }}>
                  {payroll.reversalReason}
                </Typography>
              </Box>
            )}
          </Box>
        ) : null}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={handleResend}
          disabled={isProcessing || !payroll}
          startIcon={<EmailOutlinedIcon fontSize="small" />}
          sx={{ color: SLATE, textTransform: "none" }}
        >
          Resend payslip
        </Button>
        <Button
          variant="contained"
          onClick={handleDownload}
          disabled={isProcessing || !payroll}
          startIcon={
            isProcessing ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <DownloadIcon fontSize="small" />
            )
          }
          sx={{
            bgcolor: NAVY,
            textTransform: "none",
            fontWeight: 600,
            "&:hover": { bgcolor: "#1E3A5F" },
          }}
        >
          Download PDF
        </Button>
      </DialogActions>
    </Dialog>
  );
}
