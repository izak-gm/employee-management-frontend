import { useFormContext } from "react-hook-form";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import type { CreateEmployeeForm } from "../../../schemas/employeeSchema";
import { useDepartments } from "../../../hooks/useDepartments";
import { usePositions } from "../../../hooks/usePositions";
import { useActiveEmployees } from "../../../hooks/useEmployees";

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
      <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
        {label}
      </Typography>
      <Typography variant="body2">{value?.trim() ? value : "—"}</Typography>
    </Grid>
  );
}

export default function ReviewStep() {
  const { getValues } = useFormContext<CreateEmployeeForm>();
  const values = getValues();

  const { data: departments = [] } = useDepartments();
  const { data: positions = [] } = usePositions();
  const { data: supervisors = [] } = useActiveEmployees();

  const departmentLabel = departments.find((d) => d.id === values.departmentId)?.name ?? "-";

  const positionLabel = positions.find((p) => p.id === values.positionId)?.name ?? "-";

  const supervisor = supervisors.find((s) => s.id === values.supervisorId);

  const supervisorLabel = supervisor
    ? [supervisor.firstName, supervisor.middleName, supervisor.lastName].filter(Boolean).join(" ")
    : "-";

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <Typography variant="h6" gutterBottom>
          Review &amp; Submit
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Please confirm the details below before creating this employee.
        </Typography>
      </Grid>

      <Grid size={12}>
        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Personal Details
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Field
              label="Full Name"
              value={[values.firstName, values.middleName, values.lastName]
                .filter(Boolean)
                .join(" ")}
            />
            <Field label="Email" value={values.email} />
            <Field label="Phone Number" value={values.phoneNumber} />
            <Field label="Gender" value={values.gender} />
            <Field label="Date of Birth" value={values.dateOfBirth} />
            <Field label="National ID" value={values.nationalId} />
          </Grid>
        </Paper>
      </Grid>

      <Grid size={12}>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Employment Details
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Field label="Role" value={values.role} />
            <Field label="Employment Type" value={values.employment_type} />
            <Field label="Hire Date" value={values.hireDate} />
            <Field label="Confirmation Date" value={values.confirmationDate} />
            <Field label="Department" value={departmentLabel} />
            <Field label="Position" value={positionLabel} />
            <Field label="Supervisor" value={supervisorLabel} />
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}
