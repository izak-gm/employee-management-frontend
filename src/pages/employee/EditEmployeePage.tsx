import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Stack,
} from "@mui/material";

import {
  createEmployeeSchema,
  toUpdateEmployeeRequest,
  type CreateEmployeeForm,
} from "../../schemas/employeeSchema";
import { useEmployee, useUpdateEmployee } from "../../hooks/useEmployees";

import PersonalDetailsStep from "../../components/employees/steps/Personaldetailsstep";
import EmploymentDetailsStep from "../../components/employees/steps/EmploymentDetailsStep";
import DashboardLayout from "../../components/layout/DashboardLayout";

const NAVY = "#132A46";
const SLATE = "#5B6B7F";

export default function EditEmployeePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { data: employee, isPending, isError } = useEmployee(id ?? "");
  const {
    mutateAsync: updateEmployee,
    isPending: isSaving,
    error: saveError,
  } = useUpdateEmployee();

  const methods = useForm<CreateEmployeeForm>({
    resolver: zodResolver(createEmployeeSchema),
    mode: "onBlur",
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    if (employee) {
      console.log(employee)
      reset({
        firstName: employee.firstName ?? "",
        middleName: employee.middleName ?? "",
        lastName: employee.lastName ?? "",
        email: employee.email ?? "",
        phoneNumber: employee.phoneNumber ?? "",
        gender: employee.gender ?? "MALE",
        dateOfBirth: employee.dateOfBirth ?? "",
        nationalId: employee.nationalId ?? "",
        role: employee.role ?? "SOFTWARE_ENGINEER",
        hireDate: employee.hireDate ?? "",
        confirmationDate: employee.confirmationDate ?? "",
        employment_type: undefined,
        departmentId: employee.departmentId,
        positionId: employee.positionId,
        supervisorId: employee.supervisorId,
      });
    }
  }, [employee, reset]);

  const onSubmit = async (data: CreateEmployeeForm) => {
    if (!id) return;
    const payload = toUpdateEmployeeRequest(data);
    await updateEmployee({ id, payload });
    navigate(`/employees/${id}`);
  };

  if (isPending) {
    return (
      <DashboardLayout title="Edit employee">
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress size={28} sx={{ color: NAVY }} />
        </Box>
      </DashboardLayout>
    );
  }

  if (isError || !employee) {
    return (
      <DashboardLayout title="Edit employee">
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Alert severity="error">Employee not found.</Alert>
        </Container>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Edit employee">
      <Box sx={{ bgcolor: "#F7F8FA", minHeight: "100vh" }}>
        <Box sx={{ bgcolor: "#fff", borderBottom: "1px solid #E4E8ED" }}>
          <Container maxWidth="md" sx={{ py: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: NAVY }}>
              Edit {employee.firstName} {employee.lastName}
            </Typography>
            <Typography variant="body2" sx={{ color: SLATE, mt: 0.5 }}>
              {employee.employeeNumber}
            </Typography>
          </Container>
        </Box>

        <Container maxWidth="md" sx={{ py: 4 }}>
          <FormProvider {...methods}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={3}>
                <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                  <PersonalDetailsStep />
                </Paper>

                <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                  <EmploymentDetailsStep />
                </Paper>

                {saveError && (
                  <Alert severity="error">
                    {saveError instanceof Error ? saveError.message : "Failed to update employee"}
                  </Alert>
                )}

                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5 }}>
                  <Button variant="text" onClick={() => navigate(-1)} sx={{ color: SLATE }}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSaving}
                    startIcon={isSaving ? <CircularProgress size={16} color="inherit" /> : null}
                    sx={{ bgcolor: NAVY, textTransform: "none", fontWeight: 600, px: 3.5 }}
                  >
                    {isSaving ? "Saving…" : "Save changes"}
                  </Button>
                </Box>
              </Stack>
            </Box>
          </FormProvider>
        </Container>
      </Box>
    </DashboardLayout>
  );
}
