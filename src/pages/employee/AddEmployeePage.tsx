import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Alert, Box, Button, Card, CardContent, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import CreateEmployeeForm from "../../components/employees/CreateEmployeeForm";

const AddEmployeePage = () => {
  const navigate = useNavigate();

  const [success, setSuccess] = useState(false);

  const handleSuccess = () => {
    setSuccess(true);

    setTimeout(() => {
      navigate("/employees");
    }, 1800);
  };
  return (
    <DashboardLayout title="Add Employee">
      <Stack spacing={3}>
        <Box>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/employees")}>
            Back to Employees
          </Button>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Card
            elevation={2}
            sx={{
              width: "100%",
              maxWidth: 900, // adjust to your preferred width
            }}
          >
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
                    Fill in the employee information below. An invitation email will automatically
                    be sent for password setup.
                  </Typography>
                </Box>

                <Alert severity="info">
                  The employee will receive an email containing a secure link to create their
                  password.
                </Alert>

                {success && (
                  <Alert severity="success">
                    Employee created successfully. An invitation email has been sent. Redirecting to
                    Employees...
                  </Alert>
                )}

                <CreateEmployeeForm onSuccess={handleSuccess} />
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Stack>
    </DashboardLayout>
  );
};

export default AddEmployeePage;
