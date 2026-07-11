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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import PersonAddIcon from "@mui/icons-material/PersonAddAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import GroupsIcon from "@mui/icons-material/Groups";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import EventNoteIcon from "@mui/icons-material/EventNote";
import DashboardLayout from "../../components/layout/DashboardLayout";
import EmployeeTable from "../../components/EmployeeTable";
import UserFormDialog from "../../components/UserFormDialog";
import CreateEmployeeDialog from "../../components/CreateEmployeeDialog";
import StageChip from "../../components/StageChip";
import {
  getDashboardStats,
  getAllLeaves,
  adminActionLeave,
  type LeaveResponse,
  type DashboardStats,
} from "../../api/leaveApi";
import type { EmployeeResponse } from "../../types/auth.type";
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
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [allLeaves, setAllLeaves] = useState<LeaveResponse[]>([]);
  const [pendingLeaves, setPendingLeaves] = useState<LeaveResponse[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] =
    useState<EmployeeResponse | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const load = () => {
    getDashboardStats().then((r) => setStats(r.data));
    getAllLeaves().then((r) => {
      setAllLeaves(r.data);
      setPendingLeaves(
        r.data.filter(
          (l) => l.status === "PENDING_COVER" || l.status === "PENDING_ADMIN",
        ),
      );
    });
  };

  useEffect(() => {
    load();
  }, [refreshKey]);

  const handleLeaveAction = async (
    leaveId: string,
    status: "APPROVED" | "REJECTED",
  ) => {
    await adminActionLeave(leaveId, status);
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
      <Grid container spacing={3} sx={{ mb: 4 }}>
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

      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={() => setCreateOpen(true)}
        >
          Add Employee
        </Button>
        <Button
          variant="outlined"
          startIcon={<PeopleIcon />}
          onClick={() => {
            setEditingEmployee(null);
            setDialogOpen(true);
          }}
        >
          Manage Users
        </Button>
      </Stack>

      <Paper sx={{ border: "1px solid", borderColor: "divider", mb: 4 }}>
        <Box
          sx={{
            p: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6">Leave Requests In Progress</Typography>
          <Chip label={pendingLeaves.length} color="warning" size="small" />
        </Box>
        <Divider />
        {pendingLeaves.length === 0 ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography color="text.secondary">
              No leave requests in progress.
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
              {pendingLeaves.map((leave) => (
                <TableRow key={leave.id}>
                  <TableCell>{leave.employeeFullName}</TableCell>
                  <TableCell>{leave.leaveType}</TableCell>
                  <TableCell>{`${leave.startDate ?? ""} → ${leave.endDate ?? ""}`}</TableCell>
                  <TableCell>{leave.coverEmployeeFullName ?? "—"}</TableCell>
                  <TableCell>
                    <StageChip status={leave.status} />
                  </TableCell>
                  <TableCell align="right">
                    {leave.status === "PENDING_ADMIN" ? (
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ justifyContent: "flex-end" }}
                      >
                        <Tooltip title="Approve">
                          <IconButton
                            color="success"
                            onClick={() =>
                              handleLeaveAction(leave.id!, "APPROVED")
                            }
                          >
                            <CheckCircleIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Reject">
                          <IconButton
                            color="error"
                            onClick={() =>
                              handleLeaveAction(leave.id!, "REJECTED")
                            }
                          >
                            <CancelIcon />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    ) : (
                      <Typography variant="caption" color="text.secondary">
                        Waiting on cover
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>

      <Typography variant="h6" sx={{ mb: 2 }}>
        Manage Employees
      </Typography>
      <EmployeeTable
        key={refreshKey}
        onEdit={(emp) => {
          setEditingEmployee(emp);
          setDialogOpen(true);
        }}
      />

      <CreateEmployeeDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSaved={() => {
          setRefreshKey((k) => k + 1);
          setCreateOpen(false);
        }}
      />
      <UserFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSaved={() => setRefreshKey((k) => k + 1)}
        editingEmployee={editingEmployee}
        availableRoles={["ADMIN", "SUPERADMIN", "EMPLOYEE"]}
      />
    </DashboardLayout>
  );
};
export default SuperAdminDashboard;
