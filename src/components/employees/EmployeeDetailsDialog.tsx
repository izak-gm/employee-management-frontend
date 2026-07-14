import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Divider,
} from "@mui/material";
import type { EmployeeResponse } from "../../types/auth.type";

interface Props {
  open: boolean;
  employee: EmployeeResponse | null;
  onClose: () => void;
}

const Field = ({ label, value }: { label: string; value?: string | null }) => (
  <Grid size={{ xs: 12, sm: 6 }}>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
      {value || "—"}
    </Typography>{" "}
  </Grid>
);

const EmployeeDetailsDialog = ({ open, employee, onClose }: Props) => {
  if (!employee) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Employee Details</DialogTitle>

      <Divider />

      <DialogContent>
        <Grid container spacing={2}>
          <Field label="First Name" value={employee.firstName} />

          <Field label="Last Name" value={employee.lastName} />

          <Field label="Email" value={employee.email} />

          <Field label="Phone" value={employee.phoneNumber} />

          <Field label="Role" value={employee.role} />

          <Field label="Gender" value={employee.gender} />

          {/* <Field label="Status" value={employee.status} /> */}
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmployeeDetailsDialog;
