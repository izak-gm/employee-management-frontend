import { useEffect, useState } from "react";
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
import PersonAddIcon from "@mui/icons-material/PersonAddAlt";
import GroupsIcon from "@mui/icons-material/Groups";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import DashboardLayout from "../../components/layout/DashboardLayout";
import EmployeeTable from "../../components/EmployeeTable";
import CreateEmployeeDialog from "../../components/CreateEmployeeDialog";
import StageChip from "../../components/StageChip";
import {
  getPendingLeaves,
  adminActionLeave,
  type LeaveResponse,
} from "../../api/leaveApi";
import type { EmployeeResponse } from "../../types/auth.type";

const StatCard = ({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: string;
}) => (
  <Paper sx={{ p: 3, border: "1px solid", borderColor: "divider" }}>
    <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 1.5 }}>
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
    <Typography variant="h4" sx={{ fontWeight: 700 }}>
      {value}
    </Typography>
  </Paper>
);

const AdminDashboard = () => {
  const [createOpen, setCreateOpen] = useState(false);
  const [, setDialogOpen] = useState(false);
  const [, setEditing] = useState<EmployeeResponse | null>(null);
  const [pending, setPending] = useState<LeaveResponse[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const load = () =>
    getPendingLeaves().then((r) =>
      setPending(r.data.filter((l) => l.status === "PENDING_ADMIN")),
    );
  useEffect(() => {
    load();
  }, [refreshKey]);

  const handleAction = async (id: string, status: "APPROVED" | "REJECTED") => {
    await adminActionLeave(id, status);
    setRefreshKey((k) => k + 1);
  };

  return (
    <DashboardLayout title="Admin Dashboard">
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            icon={<GroupsIcon />}
            label="Employees Managed"
            value="—"
            color="#0F2A4A"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            icon={<HourglassEmptyIcon />}
            label="Pending Your Approval"
            value={pending.length}
            color="#f57c00"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            icon={<CheckCircleIcon />}
            label="Actioned Today"
            value="—"
            color="#388e3c"
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
      </Stack>

      <Paper sx={{ border: "1px solid", borderColor: "divider", mb: 4 }}>
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

      <Typography variant="h6" sx={{ mb: 2 }}>
        Manage Employees
      </Typography>
      <EmployeeTable
        key={refreshKey}
        onEdit={(emp) => {
          setEditing(emp);
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
    </DashboardLayout>
  );
};
export default AdminDashboard;
