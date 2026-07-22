import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

import { useMyPayrolls, useMyPayslipDownload } from "../../hooks/useMyPayroll";
import PayrollStatusChip from "../../components/payroll/PayrollStatusChip";
import PayrollDetailDialog from "../../components/payroll/PayrollDetailDialog";
import DashboardLayout from "../../components/layout/DashboardLayout";

const NAVY = "#132A46";
const SLATE = "#5B6B7F";
const BORDER = "#E4E8ED";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const fmt = (n?: number) =>
  new Intl.NumberFormat("en-KE", { maximumFractionDigits: 0 }).format(n ?? 0);

export default function MyPayrollPage() {
  const { data: payrolls, isLoading, error } = useMyPayrolls();
  const { download, isDownloading } = useMyPayslipDownload();
  const [detailId, setDetailId] = useState<string | null>(null);

  return (
    <DashboardLayout title="Payrolls">
      <Box sx={{ bgcolor: "#F7F8FA", minHeight: "100vh" }}>
        <Box sx={{ bgcolor: "#fff", borderBottom: `1px solid ${BORDER}` }}>
          <Container maxWidth="md" sx={{ py: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: NAVY }}>
              My payroll
            </Typography>
            <Typography variant="body2" sx={{ color: SLATE, mt: 0.5 }}>
              View and download your payslips.
            </Typography>
          </Container>
        </Box>

        <Container maxWidth="md" sx={{ py: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress size={28} sx={{ color: NAVY }} />
            </Box>
          ) : payrolls.length === 0 ? (
            <Paper
              variant="outlined"
              sx={{ borderColor: BORDER, borderRadius: 2, p: 4, textAlign: "center" }}
            >
              <Typography sx={{ color: SLATE }}>No payslips available yet.</Typography>
            </Paper>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {payrolls.map((p) => (
                <Paper
                  key={p.id}
                  variant="outlined"
                  sx={{
                    borderColor: BORDER,
                    borderRadius: 2,
                    p: 2.5,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    "&:hover": { borderColor: NAVY },
                  }}
                  onClick={() => p.id && setDetailId(p.id)}
                >
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: NAVY }}>
                      {p.payrollMonth ? MONTH_NAMES[p.payrollMonth - 1] : ""} {p.payrollYear}
                    </Typography>
                    <Typography variant="caption" sx={{ color: SLATE }}>
                      {p.payrollNumber}
                    </Typography>
                  </Box>

                  <Box sx={{ textAlign: "right", mr: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: NAVY }}>
                      KES {fmt(p.netPay)}
                    </Typography>
                    <Typography variant="caption" sx={{ color: SLATE }}>
                      Net pay
                    </Typography>
                  </Box>

                  <PayrollStatusChip status={p.status} />

                  <Button
                    size="small"
                    variant="outlined"
                    disabled={isDownloading || !p.payrollMonth || !p.payrollYear}
                    startIcon={<DownloadIcon fontSize="small" />}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (p.payrollMonth && p.payrollYear) {
                        download(p.payrollMonth, p.payrollYear);
                      }
                    }}
                    sx={{
                      ml: 2,
                      textTransform: "none",
                      fontWeight: 600,
                      borderColor: BORDER,
                      color: NAVY,
                    }}
                  >
                    Download
                  </Button>
                </Paper>
              ))}
            </Box>
          )}
        </Container>

        <PayrollDetailDialog
          open={!!detailId}
          payrollId={detailId}
          onClose={() => setDetailId(null)}
        />
      </Box>
    </DashboardLayout>
  );
}
