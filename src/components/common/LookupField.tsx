import { Grid, Autocomplete, TextField } from "@mui/material";
import { useFormContext, Controller } from "react-hook-form";
import type { CreateEmployeeForm } from "../../schemas/employeeSchema";

type LookupOption = {
  id?: string;
  name?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
};

export function LookupField({
  name,
  label,
  options,
  loading,
}: {
  name: "departmentId" | "positionId" | "supervisorId";
  label: string;
  options: LookupOption[];
  loading: boolean;
}) {
  const {
    control,
    formState: { errors },
  } = useFormContext<CreateEmployeeForm>();

  return (
    <Grid size={{ xs: 12, sm: 4 }}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Autocomplete
            options={options}
            loading={loading}
            loadingText={`Loading ${label.toLowerCase()}...`}
            getOptionLabel={(option) =>
              option.name ??
              [option.firstName, option.middleName, option.lastName].filter(Boolean).join(" ")
            }
            isOptionEqualToValue={(a, b) => a.id === b.id}
            value={options.find((o) => o.id === field.value) ?? null}
            onChange={(_, value) => field.onChange(value?.id ?? "")}
            renderInput={(params) => (
              <TextField
                {...params}
                label={label}
                error={!!errors[name]}
                helperText={errors[name]?.message}
              />
            )}
          />
        )}
      />
    </Grid>
  );
}
