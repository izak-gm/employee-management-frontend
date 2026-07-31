import { Controller, useFormContext } from "react-hook-form";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Typography from "@mui/material/Typography";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import type { CreateEmployeeForm } from "../../../schemas/employeeSchema";

export default function PersonalDetailsStep() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<CreateEmployeeForm>();

  return (
    <Grid container spacing={3}>
      <Grid size={12}>
        <Typography variant="h6" gutterBottom>
          Personal Details
        </Typography>
      </Grid>

      <Grid size={{ xs: 12, sm: 4 }}>
        <TextField
          fullWidth
          size="small"
          required
          label="First Name"
          {...register("firstName")}
          error={!!errors.firstName}
          helperText={errors.firstName?.message}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 4 }}>
        <TextField
          fullWidth
          size="small"
          required
          label="Middle Name"
          {...register("middleName")}
          error={!!errors.middleName}
          helperText={errors.middleName?.message}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 4 }}>
        <TextField
          fullWidth
          required
          size="small"
          label="Last Name"
          {...register("lastName")}
          error={!!errors.lastName}
          helperText={errors.lastName?.message}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          required
          size="small"
          type="email"
          label="Email Address"
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="phoneNumber"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.phoneNumber}>
              <FormLabel
                sx={{
                  fontSize: "0.75rem",
                  color: "text.secondary",
                  fontWeight: 500,
                  mb: 1,
                }}
              >
                Phone Number
              </FormLabel>

              <PhoneInput
                international
                defaultCountry="KE"
                value={field.value}
                onChange={(value) => field.onChange(value ?? "")}
                onBlur={field.onBlur}
                className={`phone-input-mui ${errors.phoneNumber ? "phone-input-error" : ""}`}
              />

              <FormHelperText>{errors.phoneNumber?.message ?? " "}</FormHelperText>
            </FormControl>
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="phoneNumber"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.phoneNumber}>
              <FormLabel
                sx={{
                  fontSize: "0.75rem",
                  color: "text.secondary",
                  fontWeight: 500,
                  mb: 1,
                }}
              >
                Phone Number
              </FormLabel>

              <PhoneInput
                international
                defaultCountry="KE"
                value={field.value}
                onChange={(value) => field.onChange(value ?? "")}
                onBlur={field.onBlur}
                className={`phone-input-mui ${errors.phoneNumber ? "phone-input-error" : ""}`}
              />

              <FormHelperText>{errors.phoneNumber?.message ?? " "}</FormHelperText>
            </FormControl>
          )}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          type="date"
          label="Date of Birth"
          slotProps={{ inputLabel: { shrink: true } }}
          {...register("dateOfBirth")}
          error={!!errors.dateOfBirth}
          helperText={errors.dateOfBirth?.message}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          label="National ID"
          {...register("nationalId")}
          error={!!errors.nationalId}
          helperText={errors.nationalId?.message}
        />
      </Grid>
    </Grid>
  );
}
