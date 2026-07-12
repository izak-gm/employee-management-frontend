import { useEffect, useMemo, useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Stack,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import GroupsIcon from "@mui/icons-material/Groups";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import EventNoteIcon from "@mui/icons-material/EventNote";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StageChip from "../../components/StageChip";
import {
  getPendingLeaves,
  getAllLeaves,
  getDashboardStats,
  adminActionLeave,
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

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [pending, setPending] = useState<LeaveResponse[]>([]);
  const [allLeaves, setAllLeaves] = useState<LeaveResponse[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    getPendingLeaves().then((r) =>
      setPending(r.data.filter((l) => l.status === "PENDING_ADMIN")),
    );
    getAllLeaves().then((r) => setAllLeaves(r.data));
    getDashboardStats().then((r) => setStats(r.data));
  }, [refreshKey]);

  const handleAction = async (id: string, status: "APPROVED" | "REJECTED") => {
    await adminActionLeave(id, status);
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
    <DashboardLayout title="Admin Dashboard">
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
            icon={<BeachAccessIcon />}
            label="On Leave Now"
            value={derived.onLeaveNow.length}
            color="#2C4A6E"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            icon={<HourglassEmptyIcon />}
            label="Pending Your Approval"
            value={pending.length}
            color="#f57c00"
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
            Add employees, edit profiles, and manage roles from the dedicated
            Employees page.
          </Typography>
        </Stack>
        <Button
          variant="outlined"
          endIcon={<ArrowForwardIcon />}
          onClick={() => navigate("/admin/employees")}
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
              Monthly request trend
            </Typography>
            <TrendBars data={derived.trend} color="#2C4A6E" />
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            sx={{ border: "1px solid", borderColor: "divider", height: "100%" }}
          >
            <Box sx={{ p: 3, pb: 1.5 }}>
              <Typography variant="h6">On leave right now</Typography>
            </Box>
            {derived.onLeaveNow.length === 0 ? (
              <Box sx={{ p: 3, textAlign: "center" }}>
                <Typography color="text.secondary">
                  Everyone's in today.
                </Typography>
              </Box>
            ) : (
              derived.onLeaveNow.map((l) => (
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
                    back {l.endDate}
                  </Typography>
                </Box>
              ))
            )}
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
        <RoadmapNote text="Department breakdown and average approval time need a department field on Employee and an approvedAt timestamp on Leave — not in the current API." />
      </Box>

      <Paper sx={{ border: "1px solid", borderColor: "divider" }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6">Leave Requests Awaiting Approval</Typography>
        </Box>
        <Divider />
        {pending.length === 0 ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography color="text.secondary">
              Nothing pending — all caught up.
            </Typography>
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Dates</TableCell>
                <TableCell>Cover</TableCell>
                <TableCell>Stage</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pending.map((l) => (
                <TableRow key={l.id}>
                  <TableCell>{l.employeeFullName}</TableCell>
                  <TableCell>{l.leaveType}</TableCell>
                  <TableCell>{`${l.startDate ?? ""} → ${l.endDate ?? ""}`}</TableCell>
                  <TableCell>{l.coverEmployeeFullName ?? "—"}</TableCell>
                  <TableCell>
                    <StageChip status={l.status} />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Approve">
                      <IconButton
                        color="success"
                        onClick={() => handleAction(l.id!, "APPROVED")}
                      >
                        <CheckCircleIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Reject">
                      <IconButton
                        color="error"
                        onClick={() => handleAction(l.id!, "REJECTED")}
                      >
                        <CancelIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </DashboardLayout>
  );
};
export default AdminDashboard;
