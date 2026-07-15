import { useState } from "react";
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";

interface Props {
  open: boolean;
  title?: string;
  message?: string;
  itemName?: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

const DeleteConfirmationDialog = ({
  open,
  title = "Delete Employee",
  message = "This action cannot be undone.",
  itemName,
  onClose,
  onConfirm,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError("");

      await onConfirm();

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete the record.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Alert severity="warning">This operation is permanent and cannot be undone.</Alert>

          {itemName && (
            <Typography>
              You are about to delete <strong>{itemName}</strong>.
            </Typography>
          )}

          <Typography color="text.secondary">{message}</Typography>

          {error && <Alert severity="error">{error}</Alert>}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>

        <Button
          color="error"
          variant="contained"
          disabled={loading}
          onClick={handleDelete}
          startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
        >
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
