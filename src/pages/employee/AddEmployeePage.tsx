import DashboardLayout from "../../components/layout/DashboardLayout";
import { Alert, Box, Button, Card, CardContent, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import EmployeeForm from "../../components/employees/EmployeeForm";

const AddEmployeePage = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout title="Add Employee">
      <Stack spacing={3}>
        <Box>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/employees")}>
            Back to Employees
          </Button>
        </Box>

        <Card elevation={2}>
          <CardContent sx={{ p: 4 }}>
            <Stack spacing={3}>
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  Register Employee
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Fill in the employee information below. An invitation email will automatically be
                  sent for password setup.
                </Typography>
              </Box>

              <Alert severity="info">
                The employee will receive an email containing a secure link to create their
                password.
              </Alert>

              <EmployeeForm
                availableRoles={[
                  "SUPERADMIN",
                  "HR_ADMIN",
                  "HR_OFFICER",
                  "PAYROLL_MANAGER",
                  "FINANCE_MANAGER",
                  "TECH_LEAD",
                  "SOFTWARE_ENGINEER",
                  "INTERN",
                ]}
                availableGenders={["MALE", "FEMALE"]}
                onSuccess={() => navigate("/employees")}
              />
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </DashboardLayout>
  );
};

export default AddEmployeePage;
