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
import { usePayrollActions } from "../../hooks/usePayroll";
import type { PayrollResponse, PayrollSummaryResponse } from "../../api/types/payroll";

const NAVY = "#132A46";
const SLATE = "#5B6B7F";
const SUCCESS = "#1E6B4E";

interface Props {
  open: boolean;
  payroll: PayrollSummaryResponse | PayrollResponse | null;
  onClose: () => void;
  onDone: () => void;
}

export default function MarkAsPaidDialog({ open, payroll, onClose, onDone }: Props) {
  const [reference, setReference] = useState("");
  const { markPaid, isProcessing, error, clearError } = usePayrollActions();

  const handleConfirm = async () => {
    if (!payroll?.id || !reference.trim()) return;
    clearError();
    const result = await markPaid(payroll.id, { paymentReference: reference.trim() });
    if (result) {
      onDone();
      onClose();
      setReference("");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, color: NAVY }}>Mark as paid</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ color: SLATE, mb: 2.5 }}>
          Confirm that <strong>{payroll?.payrollNumber}</strong> for{" "}
          <strong>{payroll?.employeeFullName}</strong> has been disbursed.
        </Typography>

        <TextField
          fullWidth
          autoFocus
          required
          label="Payment reference"
          placeholder="e.g. bank transaction ID"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
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
          disabled={isProcessing || !reference.trim()}
          onClick={handleConfirm}
          startIcon={isProcessing ? <CircularProgress size={16} color="inherit" /> : null}
          sx={{
            bgcolor: SUCCESS,
            textTransform: "none",
            fontWeight: 600,
            "&:hover": { bgcolor: "#164F39" },
          }}
        >
          {isProcessing ? "Saving…" : "Confirm paid"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
