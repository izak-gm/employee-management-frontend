import { useEffect, useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Stack,
  Divider,
} from "@mui/material";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import AddIcon from "@mui/icons-material/Add";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LeaveBalanceCards from "../../components/LeaveBalanceCards";
import StageChip from "../../components/StageChip";
import { getMyLeaves, type LeaveResponse } from "../../api/leaveApi";
import { useAuth } from "../../context/AuthContext";

const EmployeeDashboard = () => {
  const { email } = useAuth();
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState<LeaveResponse[]>([]);

  useEffect(() => {
    getMyLeaves().then((r) => setLeaves(r.data));
  }, []);

  const pending = leaves.filter((l) => l.status?.startsWith("PENDING")).length;
  const recent = leaves.slice(0, 4);

  return (
    <DashboardLayout title="Dashboard">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5">Welcome back 👋</Typography>
        <Typography color="text.secondary">{email}</Typography>
      </Box>

      <Typography
        variant="overline"
        color="text.secondary"
        sx={{ letterSpacing: "0.1em" }}
      >
        Your Leave Balances
      </Typography>
      <LeaveBalanceCards />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper
            sx={{
              p: 3,
              border: "1px solid",
              borderColor: "divider",
              height: "100%",
            }}
          >
            <Stack
              direction="row"
              spacing={2}
              sx={{ alignItems: "center", mb: 2 }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  bgcolor: "rgba(201,162,39,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <BeachAccessIcon sx={{ color: "secondary.main" }} />
              </Box>
              <Box>
                <Typography variant="h6">{`${pending} in progress`}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Leave requests awaiting action
                </Typography>
              </Box>
            </Stack>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              fullWidth
              onClick={() => navigate("/employee/apply-leave")}
            >
              Apply for Leave
            </Button>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper
            sx={{
              p: 3,
              border: "1px solid",
              borderColor: "divider",
              height: "100%",
            }}
          >
            <Stack
              direction="row"
              spacing={2}
              sx={{ alignItems: "center", mb: 2 }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  bgcolor: "rgba(15,42,74,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <PersonIcon sx={{ color: "primary.main" }} />
              </Box>
              <Box>
                <Typography variant="h6" color="success.main">
                  Active
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Your account status
                </Typography>
              </Box>
            </Stack>
            <Button
              variant="outlined"
              startIcon={<PersonIcon />}
              fullWidth
              onClick={() => navigate("/profile")}
            >
              View Profile
            </Button>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ border: "1px solid", borderColor: "divider" }}>
        <Box
          sx={{
            p: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Recent Leave Activity</Typography>
          <Button
            size="small"
            startIcon={<ListAltIcon />}
            onClick={() => navigate("/employee/leaves")}
          >
            View All
          </Button>
        </Box>
        <Divider />
        {recent.length === 0 ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography color="text.secondary">
              No leave applications yet.
            </Typography>
          </Box>
        ) : (
          recent.map((l) => (
            <Box
              key={l.id}
              sx={{
                px: 3,
                py: 2,
                borderBottom: "1px solid",
                borderColor: "divider",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography
                  sx={{ fontWeight: 600 }}
                >{`${l.leaveType ?? ""} Leave`}</Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >{`${l.startDate ?? ""} → ${l.endDate ?? ""}`}</Typography>
              </Box>
              <StageChip status={l.status} />
            </Box>
          ))
        )}
      </Paper>
    </DashboardLayout>
  );
};
export default EmployeeDashboard;
