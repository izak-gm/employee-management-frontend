import { useEffect, useState } from "react";
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
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
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

const StatCard = ({
  icon,
  label,
  value,
  color = "#0F2A4A",
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color?: string;
}) => (
  <Paper
    sx={{ p: 3, border: "1px solid", borderColor: "divider", height: "100%" }}
  >
    <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 2 }}>
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 2,
          bgcolor: `${color}1A`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ color }}>{icon}</Box>
      </Box>
      <Typography variant="subtitle2" color="text.secondary">
        {label}
      </Typography>
    </Stack>
    <Typography variant="h3" sx={{ fontWeight: 700 }}>
      {value}
    </Typography>
  </Paper>
);

const SuperAdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [pendingLeaves, setPendingLeaves] = useState<LeaveResponse[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] =
    useState<EmployeeResponse | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const load = () => {
    getDashboardStats().then((r) => setStats(r.data));
    getAllLeaves().then((r) =>
      setPendingLeaves(
        r.data.filter(
          (l) => l.status === "PENDING_COVER" || l.status === "PENDING_ADMIN",
        ),
      ),
    );
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
            icon={<TrendingUpIcon />}
            label="Active"
            value={stats?.activeEmployees ?? "—"}
            color="#388e3c"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            icon={<HourglassEmptyIcon />}
            label="Invited (Pending Setup)"
            value={stats?.invitedEmployees ?? "—"}
            color="#f57c00"
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
      </Grid>

      <Typography
        variant="overline"
        color="text.secondary"
        sx={{ mb: 1, display: "block", letterSpacing: "0.1em" }}
      >
        Leave Summary
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            icon={<BeachAccessIcon />}
            label="Total Leaves"
            value={stats?.totalLeaves ?? "—"}
            color="#5B6B7A"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            icon={<HourglassEmptyIcon />}
            label="Pending Approval"
            value={stats?.pendingLeaves ?? "—"}
            color="#f57c00"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            icon={<CheckCircleIcon />}
            label="Approved"
            value={stats?.approvedLeaves ?? "—"}
            color="#388e3c"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            icon={<CancelIcon />}
            label="Rejected"
            value={stats?.rejectedLeaves ?? "—"}
            color="#d32f2f"
          />
        </Grid>
      </Grid>

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
