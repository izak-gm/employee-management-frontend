import { useEffect, useMemo, useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Stack,
  Divider,
  Chip,
} from "@mui/material";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import AddIcon from "@mui/icons-material/Add";
import ListAltIcon from "@mui/icons-material/ListAlt";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import EventNoteIcon from "@mui/icons-material/EventNote";
import WorkIcon from "@mui/icons-material/Work";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LeaveBalanceCards from "../../components/LeaveBalanceCards";
import StageChip from "../../components/StageChip";
import {
  getMyLeaves,
  getMyBalance,
  type LeaveResponse,
  type LeaveBalance,
} from "../../api/leaveApi";
import { useAuth } from "../../context/AuthContext";
import {
  StatCard,
  ProgressRow,
  MiniCalendar,
  isOnLeaveToday,
  isUpcoming,
  daysBetweenInclusive,
} from "../../components/dashboard/DashboardWidgets";

const TYPE_COLORS: Record<string, string> = {
  ANNUAL: "#0F2A4A",
  SICK: "#C9A227",
  PATERNITY: "#2C4A6E",
  MATERNITY: "#aa3bff",
  COMPASSIONATE: "#5B6B7A",
};

const EmployeeDashboard = () => {
  const { email } = useAuth();
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState<LeaveResponse[]>([]);
  const [balances, setBalances] = useState<LeaveBalance[]>([]);

  useEffect(() => {
    getMyLeaves().then((r) => setLeaves(r.data));
    getMyBalance().then((r) => setBalances(r.data));
  }, []);

  const stats = useMemo(() => {
    const year = new Date().getFullYear();
    const thisYear = leaves.filter((l) =>
      (l.createdAt ?? "").startsWith(String(year)),
    );
    const pending = leaves.filter((l) =>
      l.status?.startsWith("PENDING"),
    ).length;
    const approved = leaves.filter((l) => l.status === "APPROVED");
    const rejected = leaves.filter((l) => l.status === "REJECTED").length;

    const daysTaken = balances.reduce((sum, b) => sum + (b.usedDays ?? 0), 0);
    const remainingTotal = balances.reduce(
      (sum, b) => sum + (b.unlimited ? 0 : (b.remainingDays ?? 0)),
      0,
    );
    const hasUnlimited = balances.some((b) => b.unlimited);

    const currentLeave = approved.find((l) =>
      isOnLeaveToday(l.startDate, l.endDate),
    );
    const nextLeave = approved
      .filter((l) => isUpcoming(l.startDate))
      .sort((a, b) => (a.startDate ?? "").localeCompare(b.startDate ?? ""))[0];

    const leaveDaysSet = new Set<string>();
    approved.forEach((l) => {
      if (!l.startDate || !l.endDate) return;
      let d = new Date(l.startDate);
      const end = new Date(l.endDate);
      while (d <= end) {
        leaveDaysSet.add(d.toISOString().slice(0, 10));
        d = new Date(d.getTime() + 86_400_000);
      }
    });

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
      leaveDaysSet,
    };
  }, [leaves, balances]);

  const recent = leaves.slice(0, 5);

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
            value={
              stats.hasUnlimited
                ? `${stats.remainingTotal}+`
                : stats.remainingTotal
            }
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
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: "center" }}
                >
                  {stats.currentLeave ? (
                    <>
                      <Chip
                        icon={<WorkIcon />}
                        label="On leave today"
                        color="warning"
                        size="small"
                      />
                    </>
                  ) : (
                    <Chip
                      icon={<WorkIcon />}
                      label="Working today"
                      color="success"
                      size="small"
                    />
                  )}
                </Stack>
                {stats.nextLeave ? (
                  <Box sx={{ mt: 1.5 }}>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ alignItems: "center" }}
                    >
                      <FlightTakeoffIcon
                        fontSize="small"
                        sx={{ color: "secondary.main" }}
                      />
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Next leave: {stats.nextLeave.startDate} →{" "}
                        {stats.nextLeave.endDate}
                      </Typography>
                    </Stack>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ ml: 4 }}
                    >
                      {stats.nextLeave.leaveType} ·{" "}
                      {daysBetweenInclusive(
                        stats.nextLeave.startDate,
                        stats.nextLeave.endDate,
                      )}{" "}
                      day(s)
                    </Typography>
                  </Box>
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1.5 }}
                  >
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
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            icon={<HourglassEmptyIcon />}
            label="Pending"
            value={stats.pending}
            color="#f57c00"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            icon={<CheckCircleIcon />}
            label="Approved"
            value={stats.approvedCount}
            color="#388e3c"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            icon={<CancelIcon />}
            label="Rejected"
            value={stats.rejected}
            color="#d32f2f"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            icon={<EventNoteIcon />}
            label="Requests this year"
            value={stats.totalRequestsYtd}
            color="#5B6B7A"
          />
        </Grid>
      </Grid>

      <Typography
        variant="overline"
        color="text.secondary"
        sx={{ letterSpacing: "0.1em" }}
      >
        Your Leave Balances
      </Typography>
      <LeaveBalanceCards />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper
            sx={{
              p: 3,
              border: "1px solid",
              borderColor: "divider",
              height: "100%",
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Leave usage this cycle
            </Typography>
            <Stack spacing={2.5}>
              {balances.map((b) => (
                <ProgressRow
                  key={b.leaveType}
                  label={b.leaveType ?? ""}
                  used={b.usedDays ?? 0}
                  max={b.maxDays ?? 0}
                  unlimited={b.unlimited}
                  color={TYPE_COLORS[b.leaveType ?? ""] ?? "#0F2A4A"}
                />
              ))}
              {balances.length === 0 && (
                <Typography color="text.secondary">
                  No balance data yet.
                </Typography>
              )}
            </Stack>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper
            sx={{
              p: 3,
              border: "1px solid",
              borderColor: "divider",
              height: "100%",
            }}
          >
            <MiniCalendar highlighted={stats.leaveDaysSet} color="#0F2A4A" />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mt: 1.5 }}
            >
              Highlighted days are your approved leave. Public holidays aren't
              wired in yet — that needs a holidays endpoint.
            </Typography>
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
