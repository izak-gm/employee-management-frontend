import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { usePayrollActions } from "../../hooks/usePayroll";
import type { PayrollResponse, PayrollSummaryResponse } from "../../api/types/payroll";

const NAVY = "#132A46";
const SLATE = "#5B6B7F";
const DANGER = "#B3261E";
const DANGER_SOFT = "#FBEAEA";

interface Props {
  open: boolean;
  payroll: PayrollSummaryResponse | PayrollResponse | null;
  onClose: () => void;
  onDone: () => void;
}

export default function ReversePayrollDialog({ open, payroll, onClose, onDone }: Props) {
  const [reason, setReason] = useState("");
  const { reverse, isProcessing, error, clearError } = usePayrollActions();

  const handleConfirm = async () => {
    if (!payroll?.id || !reason.trim()) return;
    clearError();
    const result = await reverse(payroll.id, { reason: reason.trim() });
    if (result) {
      onDone();
      onClose();
      setReason("");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, color: NAVY }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <WarningAmberIcon sx={{ color: DANGER, fontSize: 22 }} />
          Reverse payroll
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ bgcolor: DANGER_SOFT, borderRadius: 1.5, p: 2, mb: 2.5 }}>
          <Typography variant="body2" sx={{ color: DANGER }}>
            This will cancel <strong>{payroll?.payrollNumber}</strong> for{" "}
            <strong>{payroll?.employeeFullName}</strong>. This action cannot be undone.
          </Typography>
        </Box>

        <TextField
          fullWidth
          autoFocus
          required
          multiline
          minRows={3}
          label="Reason for reversal"
          placeholder="Explain why this payroll is being reversed…"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        {error && (
          <Alert severity="error" sx={{ mt: 2 }} onClose={clearError}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} sx={{ color: SLATE, textTransform: "none" }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={isProcessing || !reason.trim()}
          onClick={handleConfirm}
          startIcon={isProcessing ? <CircularProgress size={16} color="inherit" /> : null}
          sx={{
            bgcolor: DANGER,
            textTransform: "none",
            fontWeight: 600,
            "&:hover": { bgcolor: "#8C1E18" },
          }}
        >
          {isProcessing ? "Reversing…" : "Reverse payroll"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
