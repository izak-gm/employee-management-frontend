import { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Paper,
  Grid,
  TextField,
  Typography,
  Divider,
  Autocomplete,
  Button,
  Alert,
  Chip,
  InputAdornment,
  CircularProgress,
  Stack,
} from "@mui/material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalanceOutlined";
import BadgeIcon from "@mui/icons-material/BadgeOutlined";
import PaymentsIcon from "@mui/icons-material/PaymentsOutlined";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonthOutlined";

import {
  payrollProfileSchema,
  PAYROLL_PROFILE_DEFAULTS,
  type PayrollProfileFormValues,
} from "../../../schemas/payrollProfileSchema";
import { usePayrollProfileActions } from "../../../hooks/usePayrollProfile";
import type { PayrollProfileRequest, PayrollProfileResponse } from "../../../api/types/payroll";

// ── Design tokens — medium corporate, Pinterest-referenced ────────────────────
// Navy anchor + slate surfaces + a single warm gold accent for emphasis only.
const TOKENS = {
  navy: "#132A46",
  navySoft: "#1E3A5F",
  slate: "#5B6B7F",
  slateLight: "#8B98A8",
  surface: "#F7F8FA",
  surfaceCard: "#FFFFFF",
  border: "#E4E8ED",
  gold: "#B8862E",
  goldSoft: "#F5EDE0",
  success: "#1E6B4E",
  successSoft: "#E7F3EE",
};

interface EmployeeOption {
  id: string;
  label: string;
  department?: string;
}

interface Props {
  employees: EmployeeOption[];
  existingProfile?: PayrollProfileResponse | null;
  profileId?: string;
  onSaved?: (profile: PayrollProfileResponse) => void;
  onCancel?: () => void;
}

function toRequest(values: PayrollProfileFormValues): PayrollProfileRequest {
  const num = (v: string) => (v ? Number(v) : 0);
  return {
    employeeId: values.employeeId,
    basicSalary: num(values.basicSalary),
    houseAllowance: num(values.houseAllowance ?? ""),
    transportAllowance: num(values.transportAllowance ?? ""),
    medicalAllowance: num(values.medicalAllowance ?? ""),
    otherAllowance: num(values.otherAllowance ?? ""),
    pensionContribution: num(values.pensionContribution ?? ""),
    bankName: values.bankName,
    bankBranch: values.bankBranch || undefined,
    accountNumber: values.accountNumber,
    kraPin: values.kraPin,
    shifNumber: values.shifNumber,
    nssfNumber: values.nssfNumber,
    effectiveFrom: values.effectiveFrom || undefined,
    effectiveTo: values.effectiveTo || undefined,
  };
}

export default function PayrollProfileForm({
  employees,
  existingProfile,
  profileId,
  onSaved,
  onCancel,
}: Props) {
  const isEditMode = Boolean(existingProfile && profileId);
  const { create, update, isSaving, error, clearError } = usePayrollProfileActions();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<PayrollProfileFormValues>({
    resolver: zodResolver(payrollProfileSchema),
    defaultValues: PAYROLL_PROFILE_DEFAULTS,
    mode: "onBlur",
  });

  // Pre-fill when editing an existing profile
  useEffect(() => {
    if (existingProfile) {
      reset({
        employeeId: existingProfile.employeeId ?? "",
        basicSalary: String(existingProfile.basicSalary ?? ""),
        houseAllowance: String(existingProfile.houseAllowance ?? ""),
        transportAllowance: String(existingProfile.transportAllowance ?? ""),
        medicalAllowance: String(existingProfile.medicalAllowance ?? ""),
        otherAllowance: String(existingProfile.otherAllowance ?? ""),
        pensionContribution: String(existingProfile.pensionContribution ?? ""),
        bankName: existingProfile.bankName ?? "",
        bankBranch: existingProfile.bankBranch ?? "",
        accountNumber: existingProfile.accountNumber ?? "",
        kraPin: existingProfile.kraPin ?? "",
        shifNumber: existingProfile.shifNumber ?? "",
        nssfNumber: existingProfile.nssfNumber ?? "",
        effectiveFrom: existingProfile.effectiveFrom ?? "",
        effectiveTo: "",
      });
    }
  }, [existingProfile, reset]);

  // Live gross salary preview
  const watched = watch([
    "basicSalary",
    "houseAllowance",
    "transportAllowance",
    "medicalAllowance",
    "otherAllowance",
  ]);

  const grossPreview = useMemo(() => {
    return watched.reduce((sum, v) => sum + (Number(v) || 0), 0);
  }, [watched]);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-KE", { maximumFractionDigits: 0 }).format(n);

  const onSubmit = async (values: PayrollProfileFormValues) => {
    setSuccessMsg(null);
    const payload = toRequest(values);

    const result = isEditMode
      ? await update(profileId as string, payload)
      : await create(payload);

    if (result) {
      setSuccessMsg(
        isEditMode ? "Payroll profile updated." : "Payroll profile created."
      );
      onSaved?.(result);
      if (!isEditMode) reset(PAYROLL_PROFILE_DEFAULTS);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ bgcolor: TOKENS.surface, minHeight: "100%" }}
    >
      <Grid container spacing={3}>
        {/* ── Main column ────────────────────────────────────────────── */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>

            {/* Employee selection */}
            <Paper
              variant="outlined"
              sx={{ borderColor: TOKENS.border, borderRadius: 2, p: 3 }}
            >
              <SectionHeading icon={<BadgeIcon />} title="Employee" />
              <Controller
                name="employeeId"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    options={employees}
                    disabled={isEditMode}
                    getOptionLabel={(o) => o.label}
                    isOptionEqualToValue={(o, v) => o.id === v.id}
                    value={employees.find((e) => e.id === field.value) ?? null}
                    onChange={(_, val) => field.onChange(val?.id ?? "")}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select employee"
                        placeholder="Search by name…"
                        error={!!errors.employeeId}
                        helperText={
                          errors.employeeId?.message ??
                          (isEditMode
                            ? "Employee cannot be changed once a profile exists."
                            : undefined)
                        }
                      />
                    )}
                  />
                )}
              />
            </Paper>

            {/* Salary & allowances */}
            <Paper
              variant="outlined"
              sx={{ borderColor: TOKENS.border, borderRadius: 2, p: 3 }}
            >
              <SectionHeading
                icon={<PaymentsIcon />}
                title="Salary & allowances"
                caption="Basic salary and allowances are individual to this employee — set once here, not derived from their position."
              />

              <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <MoneyField
                    label="Basic salary"
                    field="basicSalary"
                    register={register}
                    error={errors.basicSalary?.message}
                    required
                    emphasize
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <MoneyField
                    label="House allowance"
                    field="houseAllowance"
                    register={register}
                    error={errors.houseAllowance?.message}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <MoneyField
                    label="Transport allowance"
                    field="transportAllowance"
                    register={register}
                    error={errors.transportAllowance?.message}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <MoneyField
                    label="Medical allowance"
                    field="medicalAllowance"
                    register={register}
                    error={errors.medicalAllowance?.message}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <MoneyField
                    label="Other allowance"
                    field="otherAllowance"
                    register={register}
                    error={errors.otherAllowance?.message}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <MoneyField
                    label="Pension contribution"
                    field="pensionContribution"
                    register={register}
                    error={errors.pensionContribution?.message}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Bank details */}
            <Paper
              variant="outlined"
              sx={{ borderColor: TOKENS.border, borderRadius: 2, p: 3 }}
            >
              <SectionHeading icon={<AccountBalanceIcon />} title="Bank details" />
              <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    required
                    label="Bank name"
                    {...register("bankName")}
                    error={!!errors.bankName}
                    helperText={errors.bankName?.message}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Bank branch"
                    {...register("bankBranch")}
                    error={!!errors.bankBranch}
                    helperText={errors.bankBranch?.message}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    required
                    label="Account number"
                    {...register("accountNumber")}
                    error={!!errors.accountNumber}
                    helperText={errors.accountNumber?.message}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Statutory numbers */}
            <Paper
              variant="outlined"
              sx={{ borderColor: TOKENS.border, borderRadius: 2, p: 3 }}
            >
              <SectionHeading icon={<BadgeIcon />} title="Statutory identifiers" />
              <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    required
                    label="KRA PIN"
                    placeholder="A123456789Z"
                    {...register("kraPin")}
                    error={!!errors.kraPin}
                    helperText={errors.kraPin?.message}
                    onInput={(e) => {
                      const t = e.target as HTMLInputElement;
                      t.value = t.value.toUpperCase();
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    required
                    label="SHIF number"
                    {...register("shifNumber")}
                    error={!!errors.shifNumber}
                    helperText={errors.shifNumber?.message}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    required
                    label="NSSF number"
                    {...register("nssfNumber")}
                    error={!!errors.nssfNumber}
                    helperText={errors.nssfNumber?.message}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Effective dates */}
            <Paper
              variant="outlined"
              sx={{ borderColor: TOKENS.border, borderRadius: 2, p: 3 }}
            >
              <SectionHeading
                icon={<CalendarMonthIcon />}
                title="Effective period"
                caption="Optional — leave blank if this profile applies immediately and indefinitely."
              />
              <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Effective from"
                    slotProps={{ inputLabel: { shrink: true } }}
                    {...register("effectiveFrom")}
                    error={!!errors.effectiveFrom}
                    helperText={errors.effectiveFrom?.message}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Effective to"
                    slotProps={{ inputLabel: { shrink: true } }}
                    {...register("effectiveTo")}
                    error={!!errors.effectiveTo}
                    helperText={errors.effectiveTo?.message}
                  />
                </Grid>
              </Grid>
            </Paper>

            {error && (
              <Alert severity="error" onClose={clearError}>
                {error}
              </Alert>
            )}
            {successMsg && <Alert severity="success">{successMsg}</Alert>}

<Box sx={{ display: "flex", flexDirection: "row", gap: 1.5, justifyContent: "flex-end" }}>
              {onCancel && (
                <Button variant="text" onClick={onCancel} sx={{ color: TOKENS.slate }}>
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                variant="contained"
                disabled={isSaving}
                startIcon={isSaving ? <CircularProgress size={16} color="inherit" /> : null}
                sx={{
                  bgcolor: TOKENS.navy,
                  textTransform: "none",
                  fontWeight: 600,
                  px: 3.5,
                  borderRadius: 1.5,
                  "&:hover": { bgcolor: TOKENS.navySoft },
                }}
              >
                {isSaving
                  ? "Saving…"
                  : isEditMode
                  ? "Save changes"
                  : "Create payroll profile"}
              </Button>
            </Box>
          </Stack>
        </Grid>

        {/* ── Sticky summary sidebar ─────────────────────────────────── */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ position: { md: "sticky" }, top: { md: 24 } }}>
            <Paper
              elevation={0}
              sx={{
                bgcolor: TOKENS.navy,
                color: "#fff",
                borderRadius: 2,
                p: 3,
                mb: 2,
              }}
            >
              <Typography
                variant="overline"
                sx={{ color: TOKENS.goldSoft, letterSpacing: 1, opacity: 0.8 }}
              >
                Gross salary preview
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mt: 0.5 }}>
                KES {fmt(grossPreview)}
              </Typography>
              <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.15)" }} />
              <Stack spacing={1}>
                <SummaryRow label="Basic salary" value={watched[0]} fmt={fmt} />
                <SummaryRow label="House allowance" value={watched[1]} fmt={fmt} />
                <SummaryRow label="Transport allowance" value={watched[2]} fmt={fmt} />
                <SummaryRow label="Medical allowance" value={watched[3]} fmt={fmt} />
                <SummaryRow label="Other allowance" value={watched[4]} fmt={fmt} />
              </Stack>
              <Typography
                variant="caption"
                sx={{ display: "block", mt: 2, color: "rgba(255,255,255,0.6)" }}
              >
                Statutory deductions (PAYE, NSSF, SHIF, Housing Levy) are calculated
                automatically when payroll is generated.
              </Typography>
            </Paper>

            <Paper
              variant="outlined"
              sx={{ borderColor: TOKENS.border, borderRadius: 2, p: 2.5 }}
            >
<Box sx={{ display: "flex", flexDirection: "row", gap: 1, alignItems: "center", mb: 1 }}>
                <Chip
                  size="small"
                  label={isEditMode ? "Editing profile" : "New profile"}
                  sx={{
                    bgcolor: isEditMode ? TOKENS.goldSoft : TOKENS.successSoft,
                    color: isEditMode ? TOKENS.gold : TOKENS.success,
                    fontWeight: 600,
                    fontSize: 11,
                  }}
                />
              </Box>
              <Typography variant="body2" sx={{ color: TOKENS.slate, lineHeight: 1.6 }}>
                Pay varies per individual and is not derived from job position. Set the
                basic salary and allowances once here — they carry forward to every
                payroll run until this profile is updated.
              </Typography>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function SectionHeading({
  icon,
  title,
  caption,
}: {
  icon: React.ReactNode;
  title: string;
  caption?: string;
}) {
  return (
      <Box sx={{ display: "flex", flexDirection: "row", gap: 1, alignItems: "flex-start", mb: 1 }}>

      <Box
        sx={{
          color: TOKENS.navy,
          bgcolor: TOKENS.surface,
          borderRadius: 1.5,
          width: 36,
          height: 36,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: TOKENS.navy }}>
          {title}
        </Typography>
        {caption && (
          <Typography variant="caption" sx={{ color: TOKENS.slateLight }}>
            {caption}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

function MoneyField({
  label,
  field,
  register,
  error,
  required,
  emphasize,
}: {
  label: string;
  field: keyof PayrollProfileFormValues;
  register: ReturnType<typeof useForm<PayrollProfileFormValues>>["register"];
  error?: string;
  required?: boolean;
  emphasize?: boolean;
}) {
  return (
    <TextField
      fullWidth
      required={required}
      label={label}
      {...register(field)}
      error={!!error}
      helperText={error}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <Typography sx={{ color: TOKENS.slateLight, fontSize: 14 }}>
                KES
              </Typography>
            </InputAdornment>
          ),
        },
      }}
      sx={
        emphasize
          ? {
              "& .MuiOutlinedInput-root": {
                bgcolor: TOKENS.goldSoft,
                "& fieldset": { borderColor: TOKENS.gold },
              },
            }
          : undefined
      }
    />
  );
}

function SummaryRow({
  label,
  value,
  fmt,
}: {
  label: string;
  value?: string;
  fmt: (n: number) => string;
}) {
  return (
      <Box sx={{ display: "flex", flexDirection: "row", gap: 1, alignItems: "center",justifyContent: "space-between", mb: 1 }}>

      <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.65)" }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        KES {fmt(Number(value) || 0)}
      </Typography>
    </Box>
  );
}
