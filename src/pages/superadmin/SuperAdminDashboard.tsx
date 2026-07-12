import { useEffect, useMemo, useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  Chip,
  Button,
  Divider,
  Stack,
  IconButton,
  Tooltip,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import GroupsIcon from "@mui/icons-material/Groups";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import EventNoteIcon from "@mui/icons-material/EventNote";
import HandshakeIcon from "@mui/icons-material/Handshake";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  getDashboardStats,
  getAllLeaves,
  getMyNotifications,
  coverAction,
  type LeaveResponse,
  type DashboardStats,
} from "../../api/leaveApi";
import {
  StatCard,
  Donut,
  BarList,
  TrendBars,
  RoadmapNote,
  isOnLeaveToday,
  isUpcoming,
} from "../../components/dashboard/DashboardWidgets";

const TYPE_COLORS: Record<string, string> = {
  ANNUAL: "#0F2A4A",
  SICK: "#C9A227",
  PATERNITY: "#2C4A6E",
  MATERNITY: "#aa3bff",
  COMPASSIONATE: "#5B6B7A",
};

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [allLeaves, setAllLeaves] = useState<LeaveResponse[]>([]);
  const [pendingLeaves, setPendingLeaves] = useState<LeaveResponse[]>([]);
  const [coverRequests, setCoverRequests] = useState<LeaveResponse[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    getDashboardStats().then((r) => setStats(r.data));
    getAllLeaves().then((r) => {
      setAllLeaves(r.data);
      setPendingLeaves(
        r.data.filter(
          (l) => l.status === "PENDING_COVER" || l.status === "PENDING_ADMIN",
        ),
      );
    });
    getMyNotifications().then((r) =>
      setCoverRequests(r.data.filter((l) => l.status === "PENDING_COVER")),
    );
  }, [refreshKey]);

  const handleCoverAction = async (id: string, accept: boolean) => {
    await coverAction(id, accept);
    setRefreshKey((k) => k + 1);
  };

  const derived = useMemo(() => {
    const onLeaveNow = allLeaves.filter(
      (l) => l.status === "APPROVED" && isOnLeaveToday(l.startDate, l.endDate),
    );
    const upcoming = allLeaves
      .filter((l) => l.status === "APPROVED" && isUpcoming(l.startDate))
      .sort((a, b) => (a.startDate ?? "").localeCompare(b.startDate ?? ""))
      .slice(0, 6);
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
    <DashboardLayout title="Super Admin Dashboard">
      <Typography
        variant="overline"
        color="text.secondary"
        sx={{ mb: 1, display: "block", letterSpacing: "0.1em" }}
      >
        Workforce Overview
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            icon={<GroupsIcon />}
            label="Total Employees"
            value={stats?.totalEmployees ?? "—"}
            color="#0F2A4A"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            icon={<AdminPanelSettingsIcon />}
            label="Admins"
            value={(stats?.totalAdmins ?? 0) + (stats?.totalSuperAdmins ?? 0)}
            color="#C9A227"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            icon={<BeachAccessIcon />}
            label="On Leave Now"
            value={derived.onLeaveNow.length}
            color="#2C4A6E"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            icon={<EventNoteIcon />}
            label="Total Requests"
            value={stats?.totalLeaves ?? "—"}
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
            <Typography variant="h6">
              Cover requests awaiting your response
            </Typography>
          </Stack>
          {coverRequests.length > 0 && (
            <Chip label={coverRequests.length} color="warning" size="small" />
          )}
        </Box>
        <Divider />
        {coverRequests.length === 0 ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography color="text.secondary">
              Nobody's asked you to cover right now.
            </Typography>
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
                <Typography sx={{ fontWeight: 600 }}>
                  {l.employeeFullName} needs cover
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {l.leaveType} · {l.startDate} → {l.endDate}
                </Typography>
              </Box>
              <Stack direction="row" spacing={1}>
                <Tooltip title="Accept cover">
                  <IconButton
                    color="success"
                    onClick={() => handleCoverAction(l.id!, true)}
                  >
                    <CheckCircleIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Decline cover">
                  <IconButton
                    color="error"
                    onClick={() => handleCoverAction(l.id!, false)}
                  >
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
          mb: 4,
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
          <PeopleIcon sx={{ color: "primary.main" }} />
          <Typography variant="body1">
            Add employees, edit profiles, and manage admin roles from the
            dedicated Employees page.
          </Typography>
        </Stack>
        <Button
          variant="outlined"
          endIcon={<ArrowForwardIcon />}
          onClick={() => navigate("/superadmin/employees")}
        >
          Manage employees
        </Button>
      </Paper>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            sx={{
              p: 3,
              border: "1px solid",
              borderColor: "divider",
              height: "100%",
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Employees by status
            </Typography>
            <Donut
              centerLabel="employees"
              segments={[
                {
                  label: "Active",
                  value: stats?.activeEmployees ?? 0,
                  color: "#388e3c",
                },
                {
                  label: "Invited",
                  value: stats?.invitedEmployees ?? 0,
                  color: "#f57c00",
                },
                {
                  label: "Inactive",
                  value: stats?.inactiveEmployees ?? 0,
                  color: "#5B6B7A",
                },
              ]}
            />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            sx={{
              p: 3,
              border: "1px solid",
              borderColor: "divider",
              height: "100%",
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
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
              p: 3,
              border: "1px solid",
              borderColor: "divider",
              height: "100%",
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Requests by leave type
            </Typography>
            {derived.byType.length > 0 ? (
              <BarList segments={derived.byType} />
            ) : (
              <Typography color="text.secondary">
                No leave requests yet.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            sx={{
              p: 3,
              border: "1px solid",
              borderColor: "divider",
              height: "100%",
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Monthly request trend
            </Typography>
            <TrendBars data={derived.trend} color="#C9A227" />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            sx={{ border: "1px solid", borderColor: "divider", height: "100%" }}
          >
            <Box sx={{ p: 3, pb: 1.5 }}>
              <Typography variant="h6">Upcoming scheduled leave</Typography>
            </Box>
            {derived.upcoming.length === 0 ? (
              <Box sx={{ p: 3, textAlign: "center" }}>
                <Typography color="text.secondary">
                  Nothing scheduled yet.
                </Typography>
              </Box>
            ) : (
              derived.upcoming.map((l) => (
                <Box
                  key={l.id}
                  sx={{
                    px: 3,
                    py: 1.5,
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

      <Box sx={{ mb: 4 }}>
        <RoadmapNote text="Department distribution and employee growth trend need a department field and a createdAt timestamp on Employee — not in the current API. A system activity log beyond leave events also needs an audit endpoint." />
      </Box>

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
            {pendingLeaves.length > 0
              ? `${pendingLeaves.length} request${pendingLeaves.length === 1 ? "" : "s"} in progress across the organization.`
              : "View, approve, and reject every leave request from the dedicated Leaves page."}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1.5}>
          <Button
            variant="text"
            startIcon={<BeachAccessIcon />}
            onClick={() => navigate("/employee/apply-leave")}
          >
            Request time off
          </Button>
          <Button
            variant="outlined"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate("/superadmin/leaves")}
          >
            View all leaves
          </Button>
        </Stack>
      </Paper>
    </DashboardLayout>
  );
};
export default SuperAdminDashboard;
