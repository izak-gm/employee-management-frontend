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
  Alert,
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
  getAllLeaves,
  getMyNotifications,
  coverAction,
  adminActionLeave,
 
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
import {  getDashboardStats, type DashboardStatsResponse, type LeaveResponse } from "../../api";
import PendingLeaveReviewDialog from "../../components/leaves/PendingLeaveReviewDialog";

const TYPE_COLORS: Record<string, string> = {
  ANNUAL: "#0F2A4A",
  SICK: "#C9A227",
  PATERNITY: "#2C4A6E",
  MATERNITY: "#aa3bff",
  COMPASSIONATE: "#5B6B7A",
};

const SuperAdminDashboard = () => {
const navigate = useNavigate();

const [stats, setStats] = useState<DashboardStatsResponse | null>(null);
const [allLeaves, setAllLeaves] = useState<LeaveResponse[]>([]);
const [pendingAdminLeaves, setPendingAdminLeaves] = useState<LeaveResponse[]>([]);
const [coverRequests, setCoverRequests] = useState<LeaveResponse[]>([]);
const [refreshKey, setRefreshKey] = useState(0);

const [reviewOpen, setReviewOpen] = useState(false);
const [selectedLeave, setSelectedLeave] = useState<LeaveResponse | null>(null);
const [reviewLoading, setReviewLoading] = useState(false);

useEffect(() => {
  const loadDashboard = async () => {
    try {
      const dashboardStats = await getDashboardStats();
      setStats(dashboardStats);

      const leaves = await getAllLeaves();
      setAllLeaves(leaves);
      setPendingAdminLeaves(leaves.filter((leave) => leave.status === "PENDING_ADMIN"));

      const notifications = await getMyNotifications();
      setCoverRequests(notifications.filter((leave) => leave.status === "PENDING_COVER"));
    } catch (err) {
      console.error(err);
    }
  };

  loadDashboard();
}, [refreshKey]);

const handleCoverAction = async (id: string, accept: boolean) => {
  await coverAction(id, { accept });
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

  const openReview = () => {
    if (pendingAdminLeaves.length === 0) return;

    // Open the oldest pending request
    setSelectedLeave(pendingAdminLeaves[0]);
    setReviewOpen(true);
  };

const handleAdminDecision = async (status: "APPROVED" | "REJECTED") => {
  if (!selectedLeave?.id) return;

  setReviewLoading(true);

  try {
    await adminActionLeave(selectedLeave.id, { status });

    setReviewOpen(false);
    setSelectedLeave(null);

    setRefreshKey((k) => k + 1);
  } finally {
    setReviewLoading(false);
  }
};
  return (
    <DashboardLayout title="Super Admin Dashboard">
      {pendingAdminLeaves.length > 0 && (
        <Alert
          severity="info"
          action={
            <Button color="inherit" size="small" onClick={openReview}>
              Review
            </Button>
          }
          sx={{ mb: 3 }}
        >
          There are {pendingAdminLeaves.length} leave(s)
          {pendingAdminLeaves.length === 1 ? " request" : " requests"} awaiting approval.
        </Alert>
      )}

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
            icon={<AdminPanelSettingsIcon />}
            label="Admins"
            value={(stats?.totalAdmins ?? 0) + (stats?.totalSuperAdmins ?? 0)}
            color="#C9A227"
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
            icon={<EventNoteIcon />}
            label="Total Requests"
            value={stats?.totalLeaves ?? "—"}
            color="#5B6B7A"
          />
        </Grid>
      </Grid>

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
              <Typography variant="body2">Manage employees & admin roles</Typography>
            </Stack>
            <Button
              size="small"
              variant="outlined"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate("/superadmin/employees")}
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
              <Typography variant="body2">
                {coverRequests.length > 0
                  ? `${coverRequests.length} in progress`
                  : "All requests, org-wide"}
              </Typography>
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
                onClick={() => navigate("/superadmin/leaves")}
              >
                Leaves
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

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
          <Paper
            sx={{
              p: 2,
              border: "1px solid",
              borderColor: "divider",
              height: "100%",
            }}
          >
            <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
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
      </Grid>

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
            <TrendBars data={derived.trend} color="#C9A227" />
          </Paper>
        </Grid>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }} sx={{ mb: 2.5 }}>
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
      <PendingLeaveReviewDialog
        open={reviewOpen}
        leave={selectedLeave}
        loading={reviewLoading}
        onClose={() => setReviewOpen(false)}
        onApprove={() => handleAdminDecision("APPROVED")}
        onReject={() => handleAdminDecision("REJECTED")}
      />
      <RoadmapNote text="Department distribution and employee growth trend need a department field and a createdAt timestamp on Employee — not in the current API. A system activity log beyond leave events also needs an audit endpoint." />
    </DashboardLayout>
  );
};
export default SuperAdminDashboard;
