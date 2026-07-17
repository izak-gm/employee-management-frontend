import { useEffect, useMemo, useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Stack,
  Chip,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import EventNoteIcon from "@mui/icons-material/EventNote";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import WorkIcon from "@mui/icons-material/Work";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import HandshakeIcon from "@mui/icons-material/Handshake";
import { useNavigate } from "react-router-dom";
import {
  getMyLeaves,
  getMyBalance,
  getMyNotifications,
  coverAction,
  type LeaveResponse,
  type LeaveBalanceResponse,
} from "../../../api";
import {
  isOnLeaveToday,
  isUpcoming,
  StatCard,
  daysBetweenInclusive,
} from "../../../components/dashboard/DashboardWidgets";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { useAuth } from "../../../context/AuthContext";

const EmployeeDashboard = () => {
  const { email } = useAuth();
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState<LeaveResponse[]>([]);
  const [balances, setBalances] = useState<LeaveBalanceResponse[]>([]);
  const [coverRequests, setCoverRequests] = useState<LeaveResponse[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    getMyLeaves().then(setLeaves);

    getMyBalance().then(setBalances);

    getMyNotifications().then((notifications) =>
      setCoverRequests(notifications.filter((l) => l.status === "PENDING_COVER")),
    );
  }, [refreshKey]);

  const handleCoverAction = async (id: string, accept: boolean) => {
    await coverAction(id, { accept });

    setRefreshKey((k) => k + 1);
  };

  const stats = useMemo(() => {
    const year = new Date().getFullYear();
    const thisYear = leaves.filter((l) => (l.createdAt ?? "").startsWith(String(year)));
    const pending = leaves.filter((l) => l.status?.startsWith("PENDING")).length;
    const approved = leaves.filter((l) => l.status === "APPROVED");
    const rejected = leaves.filter((l) => l.status === "REJECTED").length;

    const daysTaken = balances.reduce((sum, b) => sum + (b.usedDays ?? 0), 0);
    const remainingTotal = balances.reduce(
      (sum, b) => sum + (b.unlimited ? 0 : (b.remainingDays ?? 0)),
      0,
    );
    const hasUnlimited = balances.some((b) => b.unlimited);

    const currentLeave = approved.find((l) => isOnLeaveToday(l.startDate, l.endDate));
    const nextLeave = approved
      .filter((l) => isUpcoming(l.startDate))
      .sort((a, b) => (a.startDate ?? "").localeCompare(b.startDate ?? ""))[0];

    return {
      pending,
      approvedCount: approved.length,
      rejected,
      daysTaken,
      remainingTotal,
      hasUnlimited,
      totalRequestsYtd: thisYear.length,
      currentLeave,
      nextLeave,
    };
  }, [leaves, balances]);

  return (
    <DashboardLayout title="Dashboard">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5">Welcome back</Typography>
        <Typography color="text.secondary">{email}</Typography>
      </Box>

      {/* Hero KPI — leave balance is the number employees care about most */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard
            icon={<BeachAccessIcon />}
            label="Leave balance remaining"
            value={stats.hasUnlimited ? `${stats.remainingTotal}+` : stats.remainingTotal}
            sublabel="Across all leave types"
            color="#0F2A4A"
            emphasis
          />
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper
            sx={{
              p: 3,
              height: "100%",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Stack
              direction="row"
              spacing={2}
              sx={{
                alignItems: "center",
                justifyContent: "space-between",
                height: "100%",
                flexWrap: "wrap",
              }}
            >
              <Box>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                  {stats.currentLeave ? (
                    <Chip icon={<WorkIcon />} label="On leave today" color="warning" size="small" />
                  ) : (
                    <Chip icon={<WorkIcon />} label="Working today" color="success" size="small" />
                  )}
                </Stack>
                {stats.nextLeave ? (
                  <Box sx={{ mt: 1.5 }}>
                    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                      <FlightTakeoffIcon fontSize="small" sx={{ color: "secondary.main" }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Next leave: {stats.nextLeave.startDate} → {stats.nextLeave.endDate}
                      </Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                      {stats.nextLeave.leaveType} ·{" "}
                      {daysBetweenInclusive(stats.nextLeave.startDate, stats.nextLeave.endDate)}{" "}
                      day(s)
                    </Typography>
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                    No upcoming approved leave scheduled.
                  </Typography>
                )}
              </Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate("/employee/apply-leave")}
              >
                Apply for Leave
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <StatCard
            icon={<HourglassEmptyIcon />}
            label="Pending"
            value={stats.pending}
            color="#f57c00"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <StatCard
            icon={<CheckCircleIcon />}
            label="Approved"
            value={stats.approvedCount}
            color="#388e3c"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <StatCard icon={<CancelIcon />} label="Rejected" value={stats.rejected} color="#d32f2f" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <StatCard
            icon={<CalendarMonthIcon />}
            label="Days taken YTD"
            value={stats.daysTaken}
            color="#2C4A6E"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <StatCard
            icon={<EventNoteIcon />}
            label="Requests this year"
            value={stats.totalRequestsYtd}
            color="#5B6B7A"
          />
        </Grid>
      </Grid>

      <Paper sx={{ border: "1px solid", borderColor: "divider", mb: 4 }}>
        <Box
          sx={{
            p: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
            <HandshakeIcon sx={{ color: "secondary.main" }} />
            <Typography variant="h6">Cover requests awaiting your response</Typography>
          </Stack>
          {coverRequests.length > 0 && (
            <Chip label={coverRequests.length} color="warning" size="small" />
          )}
        </Box>
        <Divider />
        {coverRequests.length === 0 ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography color="text.secondary">Nobody's asked you to cover right now.</Typography>
          </Box>
        ) : (
          coverRequests.map((l) => (
            <Box
              key={l.id}
              sx={{
                px: 3,
                py: 2,
                borderTop: "1px solid",
                borderColor: "divider",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: 600 }}>{l.employeeFullName} needs cover</Typography>
                <Typography variant="body2" color="text.secondary">
                  {l.leaveType} · {l.startDate} → {l.endDate}
                </Typography>
              </Box>
              <Stack direction="row" spacing={1}>
                <Tooltip title="Accept cover">
                  <IconButton color="success" onClick={() => handleCoverAction(l.id!, true)}>
                    <CheckCircleIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Decline cover">
                  <IconButton color="error" onClick={() => handleCoverAction(l.id!, false)}>
                    <CancelIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Box>
          ))
        )}
      </Paper>

      <Paper
        sx={{
          p: 2.5,
          border: "1px solid",
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <EventNoteIcon sx={{ color: "primary.main" }} />
          <Typography variant="body1">
            See your leave balance breakdown, usage history, and every request on the My Leaves
            page.
          </Typography>
        </Stack>
        <Button
          variant="outlined"
          endIcon={<ArrowForwardIcon />}
          onClick={() => navigate("/employee/leaves")}
        >
          Go to My Leaves
        </Button>
      </Paper>
    </DashboardLayout>
  );
};
export default EmployeeDashboard;
