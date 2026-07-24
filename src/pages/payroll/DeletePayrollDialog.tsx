import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Alert,
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import type { PayrollSummaryResponse } from "../../api/types/payroll";

const NAVY = "#132A46";
const SLATE = "#5B6B7F";

interface Props {
  open: boolean;
  payroll: PayrollSummaryResponse | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function DeletePayrollDialog({ open, payroll, onClose, onConfirm }: Props) {
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await onConfirm();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={submitting ? undefined : onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <WarningAmberIcon sx={{ color: "#B3261E" }} />
        Delete payroll?
      </DialogTitle>
      <DialogContent>
        {payroll && (
          <>
            <Typography variant="body2" sx={{ color: SLATE, mb: 2 }}>
              You're about to delete the payroll record for:
            </Typography>
            <Box
              sx={{
                bgcolor: "#F7F8FA",
                border: "1px solid #E4E8ED",
                borderRadius: 1.5,
                p: 1.5,
                mb: 2,
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 700, color: NAVY }}>
                {payroll.employeeFullName}
              </Typography>
              <Typography variant="caption" sx={{ color: SLATE }}>
                {payroll.employeeNumber} · {payroll.payrollNumber}
              </Typography>
            </Box>
            <Alert severity="warning" sx={{ fontSize: 13 }}>
              This action cannot be undone from the interface. Only payrolls still awaiting approval
              can be deleted.
            </Alert>
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} disabled={submitting} sx={{ color: SLATE }}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="error"
          disabled={submitting}
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          {submitting ? "Deleting…" : "Delete payroll"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
