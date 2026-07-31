import { useNavigate, useParams } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
  CircularProgress,
  Alert,
  Container,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import WorkIcon from "@mui/icons-material/Work";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useEmployee } from "../../hooks/useEmployees";
import { formatDate } from "../../util/dateUtils";
import DashboardLayout from "../../components/layout/DashboardLayout";

const Item = ({ label, value }: { label: string; value?: string | number | null }) => (
  <Paper
    elevation={0}
    sx={{
      flex: 1,
      p: 2,
      borderRadius: 3,
      border: "1px solid",
      borderColor: "grey.200",
      bgcolor: "#fafafa",
      transition: "all .2s ease",
      "&:hover": {
        bgcolor: "#f0f7ff",
        borderColor: "primary.main",
        transform: "translateY(-2px)",
      },
    }}
  >
    <Typography
      variant="caption"
      sx={{
        color: "text.secondary",
        textTransform: "uppercase",
        letterSpacing: 0.8,
        fontWeight: 700,
      }}
    >
      {label}
    </Typography>
    <Typography variant="body1" sx={{ mt: 0.7, fontWeight: 600 }}>
      {value || "-"}
    </Typography>
  </Paper>
);

export default function EmployeeDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { data: employee, isPending, isError } = useEmployee(id ?? "");

  if (isPending) {
    return (
      <DashboardLayout title="Employee">
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress size={28} />
        </Box>
      </DashboardLayout>
    );
  }

  if (isError || !employee) {
    return (
      <DashboardLayout title="Employee">
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Alert severity="error">Employee not found.</Alert>
        </Container>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={`${employee.firstName} ${employee.lastName}`}>
      <Box sx={{ bgcolor: "#F7F8FA", minHeight: "100vh" }}>
        <Box sx={{ bgcolor: "primary.main", color: "white" }}>
          <Container maxWidth="lg" sx={{ py: 3 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
              sx={{ color: "white", mb: 2, textTransform: "none" }}
            >
              Back
            </Button>

            <Stack
              sx={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
            >
              <Stack sx={{ flexDirection: "row", gap: 2 }}>
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: "white",
                    color: "primary.main",
                    fontWeight: 700,
                    fontSize: 24,
                  }}
                >
                  {employee.firstName?.charAt(0)}
                  {employee.lastName?.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {employee.firstName} {employee.lastName}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    {employee.positionName || "No Position"} •{" "}
                    {employee.departmentName || "No Department"}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    {employee.email}
                  </Typography>
                </Box>
              </Stack>

              <Stack sx={{ flexDirection: "row", gap: 1.5, alignItems: "center" }}>
                <Chip
                  label={employee.status}
                  color={
                    employee.status === "ACTIVE"
                      ? "success"
                      : employee.status === "INACTIVE"
                        ? "default"
                        : "warning"
                  }
                  sx={{ fontWeight: 700, fontSize: 14 }}
                />
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={() => navigate(`/employees/${employee.id}/edit`)}
                  sx={{
                    bgcolor: "white",
                    color: "primary.main",
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": { bgcolor: "#f0f0f0" },
                  }}
                >
                  Edit
                </Button>
              </Stack>
            </Stack>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Paper variant="outlined" sx={{ borderRadius: 3, p: 3 }}>
            <Stack spacing={4}>
              {/* PERSONAL INFORMATION */}
              <Box>
                <Stack sx={{ flexDirection: "row", gap: 2, mb: 2 }}>
                  <PersonIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Personal Information
                  </Typography>
                </Stack>

                <Stack spacing={2}>
                  <Stack direction="row" spacing={2}>
                    <Item label="First Name" value={employee.firstName} />
                    <Item label="Middle Name" value={employee.middleName} />
                    <Item label="Last Name" value={employee.lastName} />
                  </Stack>

                  <Stack direction="row" spacing={2}>
                    <Item label="Gender" value={employee.gender} />
                    <Item label="Date of Birth" value={formatDate(employee.dateOfBirth)} />
                    <Item label="National ID" value={employee.nationalId} />
                  </Stack>

                  <Stack direction="row" spacing={2}>
                    <Item label="Email Address" value={employee.email} />
                    <Item label="Phone Number" value={employee.phoneNumber} />
                  </Stack>
                </Stack>
              </Box>

              <Divider />

              {/* EMPLOYMENT INFORMATION */}
              <Box>
                <Stack sx={{ flexDirection: "row", gap: 2, mb: 2 }}>
                  <WorkIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Employment Information
                  </Typography>
                </Stack>

                <Stack spacing={2}>
                  <Stack direction="row" spacing={2}>
                    <Item label="Employee Number" value={employee.employeeNumber} />
                    <Item label="Role" value={employee.role} />
                    <Item label="Status" value={employee.status} />
                  </Stack>

                  <Stack direction="row" spacing={2}>
                    <Item label="Department" value={employee.departmentName} />
                    <Item label="Position" value={employee.positionName} />
                    <Item label="Supervisor" value={employee.supervisorName} />
                  </Stack>

                  <Stack direction="row" spacing={2}>
                    <Item label="Hire Date" value={formatDate(employee.hireDate)} />
                    <Item label="Confirmation Date" value={formatDate(employee.confirmationDate)} />
                    <Item label="Exit Date" value={formatDate(employee.exitDate)} />
                  </Stack>
                </Stack>
              </Box>
            </Stack>
          </Paper>
        </Container>
      </Box>
    </DashboardLayout>
  );
}
