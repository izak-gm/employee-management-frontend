import { useFormContext } from "react-hook-form";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { ROLES, EMPLOYMENT_TYPES } from "../../../schemas/employeeSchema";
import type { CreateEmployeeForm } from "../../../schemas/employeeSchema";
import { useActiveEmployees } from "../../../hooks/useEmployees";
import { usePositions } from "../../../hooks/usePositions";
import { useDepartments } from "../../../hooks/useDepartments";
import { LookupField } from "../../common/LookupField";

const ROLE_LABELS: Record<(typeof ROLES)[number], string> = {
  SUPERADMIN: "Super Admin",
  HR_ADMIN: "HR Admin",
  HR_OFFICER: "HR Officer",
  PAYROLL_MANAGER: "Payroll Manager",
  FINANCE_MANAGER: "Finance Manager",
  TECH_LEAD: "Tech Lead",
  SOFTWARE_ENGINEER: "Software Engineer",
  INTERN: "Intern",
};

const EMPLOYMENT_TYPE_LABELS: Record<(typeof EMPLOYMENT_TYPES)[number], string> = {
  PERMANENT: "Permanent",
  CONTRACT: "Contract",
  INTERN: "Intern",
  PART_TIME: "Part Time",
  CASUAL: "Casual",
};

export default function EmploymentDetailsStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CreateEmployeeForm>();

  const { data: departments = [], isPending: loadingDepartments } = useDepartments();

  const { data: positions = [], isPending: loadingPositions } = usePositions();

  const { data: supervisors = [], isPending: loadingSupervisors } = useActiveEmployees();

  return (
    <Grid container spacing={3}>
      <Grid size={12}>
        <Typography variant="h6" gutterBottom>
          Employment Details
        </Typography>
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          select
          fullWidth
          required
          label="Role"
          defaultValue=""
          {...register("role")}
          error={!!errors.role}
          helperText={errors.role?.message}
        >
          {ROLES.map((role) => (
            <MenuItem key={role} value={role}>
              {ROLE_LABELS[role]}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          select
          fullWidth
          label="Employment Type"
          defaultValue=""
          {...register("employment_type")}
          error={!!errors.employment_type}
          helperText={errors.employment_type?.message}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {EMPLOYMENT_TYPES.map((type) => (
            <MenuItem key={type} value={type}>
              {EMPLOYMENT_TYPE_LABELS[type]}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          required
          type="date"
          label="Hire Date"
          slotProps={{ inputLabel: { shrink: true } }}
          {...register("hireDate")}
          error={!!errors.hireDate}
          helperText={errors.hireDate?.message}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          type="date"
          label="Confirmation Date"
          slotProps={{ inputLabel: { shrink: true } }}
          {...register("confirmationDate")}
          error={!!errors.confirmationDate}
          helperText={errors.confirmationDate?.message}
        />
      </Grid>
      {/* Department — real API */}
      <LookupField
        name="departmentId"
        label="Department"
        options={departments}
        loading={loadingDepartments}
      />

      {/* Position — real API */}
      <LookupField
        name="positionId"
        label="Position"
        options={positions}
        loading={loadingPositions}
      />

      {/* Supervisor — active employees from real API */}
      <LookupField
        name="supervisorId"
        label="Supervisor"
        options={supervisors}
        loading={loadingSupervisors}
      />
    </Grid>
  );
}
