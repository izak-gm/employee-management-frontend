import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Alert,
} from "@mui/material";

interface BulkReverseDialogProps {
  open: boolean;
  payrollIds: string[];
  onClose: () => void;
  onSubmit: (reason: string) => Promise<void>;
}

export default function BulkReverseDialog({
  open,
  payrollIds,
  onClose,
  onSubmit,
}: BulkReverseDialogProps) {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reason.trim() || payrollIds.length === 0) return;
    setSubmitting(true);
    try {
      await onSubmit(reason.trim());
      setReason("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Bulk reverse payrolls</DialogTitle>
      <DialogContent>
        {payrollIds.length === 0 ? (
          <Alert severity="warning" sx={{ mt: 1 }}>
            Select one or more payrolls in the batch review list before reversing.
          </Alert>
        ) : (
          <>
            <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
              You are about to reverse {payrollIds.length} payroll
              {payrollIds.length === 1 ? "" : "s"}. This action requires an approved status and
              cannot be undone automatically.
            </Typography>
            <TextField
              label="Reason for reversal"
              fullWidth
              multiline
              minRows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="error"
          disabled={submitting || !reason.trim() || payrollIds.length === 0}
        >
          {submitting ? "Reversing…" : "Reverse"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
