// src/pages/employee/EmployeeDashboard.tsx
import { Grid, Paper, Typography, Box } from "@mui/material";
import BadgeIcon from "@mui/icons-material/Badge";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";

const EmployeeDashboard = () => {
  const { email } = useAuth();
  return (
    <DashboardLayout title="Dashboard">
      <Typography variant="h5" gutterBottom>
        Welcome back 
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        {email}
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Paper sx={{ p: 3, border: "1px solid", borderColor: "divider" }}>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}
            >
              <BadgeIcon sx={{ color: "secondary.main" }} />
              <Typography variant="subtitle2" color="text.secondary">
                Account Status
              </Typography>
            </Box>
            <Typography variant="h5">Active</Typography>
          </Paper>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};

export default EmployeeDashboard;
