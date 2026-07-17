import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

import {
  createEmployeeSchema,
  toCreateEmployeeRequest,
  STEP_FIELDS,
  type CreateEmployeeForm,
} from "../../schemas/employeeSchema";
import { createEmployee } from "../../api/employees";
import { ApiError } from "../../api/client";
import PersonalDetailsStep from "./steps/Personaldetailsstep";
import EmploymentDetailsStep from "./steps/EmploymentDetailsStep";
import ReviewStep from "./steps/Reviewstep";

const STEP_LABELS = ["Personal Details", "Employment Details", "Review & Submit"];

const DEFAULT_VALUES: CreateEmployeeForm = {
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  gender: "MALE", // satisfies the literal union — user must still pick
  dateOfBirth: "",
  nationalId: "",
  role: "INTERN", // same — drives the select placeholder
  hireDate: "",
  confirmationDate: "",
  employment_type: undefined,
  departmentId: "",
  positionId: "",
  supervisorId: "",
};

interface Props {
  onSuccess?: (employeeId: string) => void;
}

export default function CreateEmployeeForm({ onSuccess }: Props) {
  const [activeStep, setActiveStep] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── useForm typed to CreateEmployeeForm ─────────────────────────────
  const methods = useForm<CreateEmployeeForm>({
    resolver: zodResolver(createEmployeeSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "onBlur",
  });

  const { trigger, handleSubmit, reset } = methods;

  // ── Step navigation ───────────────────────────────────────────────────────
  const handleNext = async () => {
    const valid = await trigger(STEP_FIELDS[activeStep], { shouldFocus: true });
    if (valid) setActiveStep((s) => s + 1);
  };

  const handleBack = () => {
    setSubmitError(null);
    setActiveStep((s) => s - 1);
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const onSubmit = async (data: CreateEmployeeForm) => {
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const payload = toCreateEmployeeRequest(data);
      const response = await createEmployee(payload);
      setSubmitSuccess(true);
      onSuccess?.(response.id ?? "");
    } catch (err) {
      setSubmitError(
        err instanceof ApiError ? err.message : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Success screen ────────────────────────────────────────────────────────
  if (submitSuccess) {
    return (
      <Paper sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
        <Alert severity="success" sx={{ mb: 2 }}>
          Employee created successfully!
        </Alert>
        <Button
          variant="contained"
          onClick={() => {
            reset(DEFAULT_VALUES);
            setActiveStep(0);
            setSubmitSuccess(false);
          }}
        >
          Add Another Employee
        </Button>
      </Paper>
    );
  }

  // ── Main form ─────────────────────────────────────────────────────────────
  return (
    <Paper sx={{ p: 4, maxWidth: 900, mx: "auto" }}>
      <Typography variant="h5" gutterBottom>
        Add New Employee
      </Typography>

      <Stepper activeStep={activeStep} sx={{ my: 4 }}>
        {STEP_LABELS.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <FormProvider {...methods}>
        {/* typed as CreateEmployeeForm so handleSubmit resolves correctly */}
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          {submitError && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setSubmitError(null)}>
              {submitError}
            </Alert>
          )}

          <Box sx={{ display: activeStep === 0 ? "block" : "none" }}>
            <PersonalDetailsStep />
          </Box>
          <Box sx={{ display: activeStep === 1 ? "block" : "none" }}>
            <EmploymentDetailsStep />
          </Box>
          <Box sx={{ display: activeStep === 2 ? "block" : "none" }}>
            <ReviewStep />
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
            <Button disabled={activeStep === 0 || isSubmitting} onClick={handleBack}>
              Back
            </Button>

            {activeStep === STEP_LABELS.length - 1 ? (
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : null}
              >
                {isSubmitting ? "Creating..." : "Create Employee"}
              </Button>
            ) : (
              <Button variant="contained" onClick={handleNext}>
                Next
              </Button>
            )}
          </Box>
        </Box>
      </FormProvider>
    </Paper>
  );
}
