import { useEffect, useMemo, useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Stack,
  Divider,
  IconButton,
  Tooltip,
  Chip,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import GroupsIcon from "@mui/icons-material/Groups";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import EventNoteIcon from "@mui/icons-material/EventNote";
import HandshakeIcon from "@mui/icons-material/Handshake";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  getPendingLeaves,
  getAllLeaves,
  getMyNotifications,
  adminActionLeave,
  coverAction,
} from "../../api/leaves";
import {
  StatCard,
  Donut,
  BarList,
  TrendBars,
  RoadmapNote,
  isOnLeaveToday,
  isUpcoming,
} from "../../components/dashboard/DashboardWidgets";
import { getDashboardStats, type DashboardStatsResponse, type LeaveResponse } from "../../api";

const TYPE_COLORS: Record<string, string> = {
  ANNUAL: "#0F2A4A",
  SICK: "#C9A227",
  PATERNITY: "#2C4A6E",
  MATERNITY: "#aa3bff",
  COMPASSIONATE: "#5B6B7A",
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [pending, setPending] = useState<LeaveResponse[]>([]);
  const [allLeaves, setAllLeaves] = useState<LeaveResponse[]>([]);
  const [stats, setStats] = useState<DashboardStatsResponse | null>(null);
  const [coverRequests, setCoverRequests] = useState<LeaveResponse[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    getPendingLeaves().then((leaves) =>
      setPending(leaves.filter((l) => l.status === "PENDING_ADMIN")),
    );

    getAllLeaves().then(setAllLeaves);

    getDashboardStats().then(setStats);

    getMyNotifications().then((leaves) =>
      setCoverRequests(leaves.filter((l) => l.status === "PENDING_COVER")),
    );
  }, [refreshKey]);

  const handleCoverAction = async (id: string, accept: boolean) => {
    await coverAction(id, { accept });
    setRefreshKey((k) => k + 1);
  };

  const handleAction = async (id: string, status: "APPROVED" | "REJECTED") => {
    await adminActionLeave(id, { status });
    setRefreshKey((k) => k + 1);
  };

  const derived = useMemo(() => {
    const onLeaveNow = allLeaves.filter(
      (l) => l.status === "APPROVED" && isOnLeaveToday(l.startDate, l.endDate),
    );
    const upcoming = allLeaves
      .filter((l) => l.status === "APPROVED" && isUpcoming(l.startDate))
      .sort((a, b) => (a.startDate ?? "").localeCompare(b.startDate ?? ""))
      .slice(0, 4);
    const withdrawn = allLeaves.filter((l) => l.status === "WITHDRAWN").length;

    const byType = Object.entries(
      allLeaves.reduce<Record<string, number>>((acc, l) => {
        if (!l.leaveType) return acc;
        acc[l.leaveType] = (acc[l.leaveType] ?? 0) + 1;
        return acc;
      }, {}),
    ).map(([label, value]) => ({
      label,
      value,
      color: TYPE_COLORS[label] ?? "#5B6B7A",
    }));

    const trend = (() => {
      const now = new Date();
      const buckets = Array.from({ length: 6 }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
        return {
          key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
          label: d.toLocaleDateString(undefined, { month: "short" }),
          value: 0,
        };
      });
      const byKey = new Map(buckets.map((b) => [b.key, b]));
      allLeaves.forEach((l) => {
        const key = l.createdAt?.slice(0, 7);
        const bucket = key && byKey.get(key);
        if (bucket) bucket.value += 1;
      });
      return buckets;
    })();

    return { onLeaveNow, upcoming, withdrawn, byType, trend };
  }, [allLeaves]);

  return (
    <DashboardLayout title="Admin Dashboard">
      {/* KPI row */}
      <Grid container spacing={2} sx={{ mb: 2.5 }}>
        <Grid size={{ xs: 6, sm: 6, md: 3 }}>
          <StatCard
            icon={<GroupsIcon />}
            label="Total Employees"
            value={stats?.totalEmployees ?? "—"}
            color="#0F2A4A"
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 6, md: 3 }}>
          <StatCard
            icon={<BeachAccessIcon />}
            label="On Leave Now"
            value={derived.onLeaveNow.length}
            color="#2C4A6E"
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 6, md: 3 }}>
          <StatCard
            icon={<HourglassEmptyIcon />}
            label="Pending Your Approval"
            value={pending.length}
            color="#f57c00"
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 6, md: 3 }}>
          <StatCard
            icon={<EventNoteIcon />}
            label="Total Requests"
            value={stats?.totalLeaves ?? "—"}
            color="#5B6B7A"
          />
        </Grid>
      </Grid>

      {/* Quick actions row — replaces two separate full-width link cards */}
      <Grid container spacing={2} sx={{ mb: 2.5 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            sx={{
              p: 2,
              height: "100%",
              border: "1px solid",
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 1.5,
            }}
          >
            <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
              <PeopleIcon fontSize="small" sx={{ color: "primary.main" }} />
              <Typography variant="body2">Manage employees & roles</Typography>
            </Stack>
            <Button
              size="small"
              variant="outlined"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate("/admin/employees")}
            >
              Employees
            </Button>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            sx={{
              p: 2,
              height: "100%",
              border: "1px solid",
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 1.5,
            }}
          >
            <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
              <EventNoteIcon fontSize="small" sx={{ color: "primary.main" }} />
              <Typography variant="body2">All requests, org-wide</Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                variant="text"
                startIcon={<BeachAccessIcon fontSize="small" />}
                onClick={() => navigate("/employee/apply-leave")}
              >
                Request time off
              </Button>
              <Button
                size="small"
                variant="outlined"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate("/admin/leaves")}
              >
                Leaves
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Cover requests + pending approvals side by side on desktop */}
      <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ border: "1px solid", borderColor: "divider", height: "100%" }}>
            <Box
              sx={{
                p: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
                <HandshakeIcon fontSize="small" sx={{ color: "secondary.main" }} />
                <Typography variant="subtitle1">Cover requests</Typography>
              </Stack>
              {coverRequests.length > 0 && (
                <Chip label={coverRequests.length} color="warning" size="small" />
              )}
            </Box>
            <Divider />
            {coverRequests.length === 0 ? (
              <Box sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  Nobody's asked you to cover.
                </Typography>
              </Box>
            ) : (
              coverRequests.slice(0, 4).map((l) => (
                <Box
                  key={l.id}
                  sx={{
                    px: 2,
                    py: 1.25,
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
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {l.employeeFullName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {l.leaveType} · {l.startDate} → {l.endDate}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={0.5}>
                    <Tooltip title="Accept cover">
                      <IconButton
                        size="small"
                        color="success"
                        onClick={() => handleCoverAction(l.id!, true)}
                      >
                        <CheckCircleIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Decline cover">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleCoverAction(l.id!, false)}
                      >
                        <CancelIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Box>
              ))
            )}
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ border: "1px solid", borderColor: "divider", height: "100%" }}>
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle1">Awaiting your approval</Typography>
            </Box>
            <Divider />
            {pending.length === 0 ? (
              <Box sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  Nothing pending — all caught up.
                </Typography>
              </Box>
            ) : (
              pending.slice(0, 4).map((l) => (
                <Box
                  key={l.id}
                  sx={{
                    px: 2,
                    py: 1.25,
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
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {l.employeeFullName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {l.leaveType} · {l.startDate} → {l.endDate}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={0.5}>
                    <Tooltip title="Approve">
                      <IconButton
                        size="small"
                        color="success"
                        onClick={() => handleAction(l.id!, "APPROVED")}
                      >
                        <CheckCircleIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Reject">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleAction(l.id!, "REJECTED")}
                      >
                        <CancelIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Box>
              ))
            )}
            {pending.length > 4 && (
              <Box
                sx={{
                  p: 1.5,
                  textAlign: "center",
                  borderTop: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Button size="small" onClick={() => navigate("/admin/leaves")}>
                  View all {pending.length} →
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Charts row */}
      <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            sx={{
              p: 2,
              border: "1px solid",
              borderColor: "divider",
              height: "100%",
            }}
          >
            <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
              Requests by status
            </Typography>
            <Donut
              centerLabel="requests"
              segments={[
                {
                  label: "Approved",
                  value: stats?.approvedLeaves ?? 0,
                  color: "#388e3c",
                },
                {
                  label: "Pending",
                  value: stats?.pendingLeaves ?? 0,
                  color: "#f57c00",
                },
                {
                  label: "Rejected",
                  value: stats?.rejectedLeaves ?? 0,
                  color: "#d32f2f",
                },
                {
                  label: "Withdrawn",
                  value: derived.withdrawn,
                  color: "#5B6B7A",
                },
              ]}
            />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            sx={{
              p: 2,
              border: "1px solid",
              borderColor: "divider",
              height: "100%",
            }}
          >
            <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
              By leave type
            </Typography>
            {derived.byType.length > 0 ? (
              <BarList segments={derived.byType} />
            ) : (
              <Typography variant="body2" color="text.secondary">
                No leave requests yet.
              </Typography>
            )}
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            sx={{
              p: 2,
              border: "1px solid",
              borderColor: "divider",
              height: "100%",
            }}
          >
            <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
              Monthly trend
            </Typography>
            <TrendBars data={derived.trend} color="#2C4A6E" />
          </Paper>
        </Grid>
      </Grid>

      {/* On leave / upcoming, compact side by side */}
      <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ border: "1px solid", borderColor: "divider", height: "100%" }}>
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle1">On leave right now</Typography>
            </Box>
            {derived.onLeaveNow.length === 0 ? (
              <Box sx={{ p: 2.5, textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  Everyone's in today.
                </Typography>
              </Box>
            ) : (
              derived.onLeaveNow.slice(0, 3).map((l) => (
                <Box
                  key={l.id}
                  sx={{
                    px: 2,
                    py: 1,
                    borderTop: "1px solid",
                    borderColor: "divider",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="body2">{l.employeeFullName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    back {l.endDate}
                  </Typography>
                </Box>
              ))
            )}
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ border: "1px solid", borderColor: "divider", height: "100%" }}>
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle1">Upcoming leave</Typography>
            </Box>
            {derived.upcoming.length === 0 ? (
              <Box sx={{ p: 2.5, textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  Nothing scheduled yet.
                </Typography>
              </Box>
            ) : (
              derived.upcoming.map((l) => (
                <Box
                  key={l.id}
                  sx={{
                    px: 2,
                    py: 1,
                    borderTop: "1px solid",
                    borderColor: "divider",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="body2">{l.employeeFullName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {l.startDate} → {l.endDate}
                  </Typography>
                </Box>
              ))
            )}
          </Paper>
        </Grid>
      </Grid>

      <RoadmapNote text="Department breakdown and average approval time need a department field on Employee and an approvedAt timestamp on Leave — not in the current API." />
    </DashboardLayout>
  );
};
export default AdminDashboard;
