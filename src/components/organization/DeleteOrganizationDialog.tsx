import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

interface DeleteOrganizationDialogProps {
  open: boolean;
  loading?: boolean;
  entityName: string; // e.g. "Department" or "Position"
  itemName?: string;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
}

export default function DeleteOrganizationDialog({
  open,
  loading = false,
  entityName,
  itemName,
  onClose,
  onConfirm,
}: DeleteOrganizationDialogProps) {
  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{`Delete ${entityName}`}</DialogTitle>

      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this {entityName.toLowerCase()}?
        </DialogContentText>

        {itemName && (
          <Typography
            sx={{
              mt: 2,
              fontWeight: 600,
            }}
          >
            {itemName}
          </Typography>
        )}

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          This action cannot be undone.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>

        <Button color="error" variant="contained" onClick={handleConfirm} disabled={loading}>
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
