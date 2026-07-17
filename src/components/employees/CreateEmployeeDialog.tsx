import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";

import type { EmployeeResponse } from "../../api/types";

const steps = ["Personal Details", "Employment Details", "System Information"];

interface Props {
  open: boolean;
  employee: EmployeeResponse | null;
  onClose: () => void;
}

const Item = ({ label, value }: { label: string; value?: string | number | null }) => (
  <Paper
    variant="outlined"
    sx={{
      p: 2,
      height: "100%",
    }}
  >
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>

    <Typography variant="body1" sx={{ fontWeight: "fontWeightMedium" }}>
      {value || "-"}
    </Typography>
  </Paper>
);

export default function EmployeeDetailsDialog({ open, employee, onClose }: Props) {
  const [activeStep, setActiveStep] = useState(0);

  if (!employee) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Employee Details</DialogTitle>

      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ mb: 4, mt: 1 }}>
          {steps.map((step) => (
            <Step key={step}>
              <StepLabel>{step}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Item label="First Name" value={employee.firstName} />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Item label="Middle Name" value={employee.middleName} />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Item label="Last Name" value={employee.lastName} />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Item label="Gender" value={employee.gender} />
            </Grid>

            <Grid size={12}>
              <Item label="Email" value={employee.email} />
            </Grid>

            <Grid size={12}>
              <Item label="Phone Number" value={employee.phoneNumber} />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Item label="National ID" value={employee.nationalId} />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Item label="Date of Birth" value={employee.dateOfBirth} />
            </Grid>
          </Grid>
        )}

        {activeStep === 1 && (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Item label="Employee Number" value={employee.employeeNumber} />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Item label="Role" value={employee.role} />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Item label="Department" value={employee.departmentName} />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Item label="Position" value={employee.positionName} />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Item label="Supervisor" value={employee.supervisorName} />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Item label="Hire Date" value={employee.hireDate} />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Item label="Confirmation Date" value={employee.confirmationDate} />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Item label="Exit Date" value={employee.exitDate} />
            </Grid>
          </Grid>
        )}

        {activeStep === 2 && (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Item label="Status" value={employee.status} />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Item label="Employee ID" value={employee.id} />
            </Grid>

            <Grid size={12}>
              <Divider sx={{ my: 1 }} />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Item label="Created At" value={employee.createdAt} />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Item label="Updated At" value={employee.updatedAt} />
            </Grid>
          </Grid>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>

        <Box sx={{ flexGrow: 1 }} />

        <Button disabled={activeStep === 0} onClick={() => setActiveStep((s) => s - 1)}>
          Back
        </Button>

        <Button
          variant="contained"
          disabled={activeStep === steps.length - 1}
          onClick={() => setActiveStep((s) => s + 1)}
        >
          Next
        </Button>
      </DialogActions>
    </Dialog>
  );
}
