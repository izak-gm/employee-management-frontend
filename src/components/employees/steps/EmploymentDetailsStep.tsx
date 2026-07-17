import { Controller, useFormContext } from "react-hook-form";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Autocomplete from "@mui/material/Autocomplete";
import Typography from "@mui/material/Typography";
import { useDepartments, usePositions, useSupervisors } from "../../../api/lookups";
import { ROLES, EMPLOYMENT_TYPES } from "../../../schemas/employeeSchema";
import   type {CreateEmployeeForm } from "../../../schemas/employeeSchema";

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
    control,
    formState: { errors },
  } = useFormContext<CreateEmployeeForm>();

  const { data: departments, isLoading: loadingDepartments } = useDepartments();
  const { data: positions, isLoading: loadingPositions } = usePositions();
  const { data: supervisors, isLoading: loadingSupervisors } = useSupervisors();

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

      <Grid size={{ xs: 12, sm: 4 }}>
        <Controller
          name="departmentId"
          control={control}
          render={({ field }) => (
            <Autocomplete
              options={departments}
              loading={loadingDepartments}
              loadingText="Loading departments..."
              getOptionLabel={(opt) => opt.label}
              isOptionEqualToValue={(opt, val) => opt.id === val.id}
              value={departments.find((d) => d.id === field.value) ?? null}
              onChange={(_, val) => field.onChange(val?.id ?? "")}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Department"
                  error={!!errors.departmentId}
                  helperText={errors.departmentId?.message}
                />
              )}
            />
          )}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 4 }}>
        <Controller
          name="positionId"
          control={control}
          render={({ field }) => (
            <Autocomplete
              options={positions}
              loading={loadingPositions}
              getOptionLabel={(opt) => opt.label}
              loadingText="Loading positions..."

              isOptionEqualToValue={(opt, val) => opt.id === val.id}
              value={positions.find((p) => p.id === field.value) ?? null}
              onChange={(_, val) => field.onChange(val?.id ?? "")}

              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Position"
                  error={!!errors.positionId}
                  helperText={errors.positionId?.message}
                />
              )}
            />
          )}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 4 }}>
        <Controller
          name="supervisorId"
          control={control}
          render={({ field }) => (
            <Autocomplete
              options={supervisors}
              loading={loadingSupervisors}
              getOptionLabel={(opt) => opt.label}
              loadingText="Loading supervisors..."
              isOptionEqualToValue={(opt, val) => opt.id === val.id}
              value={supervisors.find((s) => s.id === field.value) ?? null}
              onChange={(_, val) => field.onChange(val?.id ?? "")}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Supervisor"
                  error={!!errors.supervisorId}
                  helperText={errors.supervisorId?.message}
                />
              )}
            />
          )}
        />
      </Grid>
    </Grid>
  );
}
