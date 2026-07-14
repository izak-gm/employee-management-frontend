import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  MenuItem,
  TextField,
  Stack,
} from "@mui/material";
import StageChip from "../StageChip";
import {
  getMyLeaves,
  type LeaveResponse,
} from "../../api/leaveApi";

type StatusFilter =
  | "ALL"
  | "PENDING_COVER"
  | "COVER_DECLINED"
  | "PENDING_ADMIN"
  | "APPROVED"
  | "REJECTED"
  | "WITHDRAWN";

const STATUS_FILTERS: { label: string; value: StatusFilter }[] = [
  { label: "All", value: "ALL" },
  { label: "Pending Cover", value: "PENDING_COVER" },
  { label: "Cover Declined", value: "COVER_DECLINED" },
  { label: "Pending Admin", value: "PENDING_ADMIN" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Withdrawn", value: "WITHDRAWN" },
];

const ManageLeavesView = () => {
  const [leaves, setLeaves] = useState<LeaveResponse[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [refreshKey, _setRefreshKey] = useState(0);

  useEffect(() => {
    getMyLeaves().then((r) => setLeaves(r.data));
  }, [refreshKey]);

  const visibleLeaves =
    statusFilter === "ALL"
      ? leaves
      : leaves.filter((l) => l.status === statusFilter);

  return (
    <Box>
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h5">All Leaves</Typography>
        <TextField
          select
          size="small"
          label="Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          sx={{ minWidth: 180 }}
        >
          {STATUS_FILTERS.map((f) => (
            <MenuItem key={f.value} value={f.value}>
              {f.label}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      <Paper sx={{ border: "1px solid", borderColor: "divider" }}>
        {visibleLeaves.length === 0 ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography color="text.secondary">
              No leave requests match this filter.
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
              {visibleLeaves.map((l) => (
                <TableRow key={l.id}>
                  <TableCell>{l.employeeFullName}</TableCell>
                  <TableCell>{l.leaveType}</TableCell>
                  <TableCell>{`${l.startDate ?? ""} → ${l.endDate ?? ""}`}</TableCell>
                  <TableCell>{l.coverEmployeeFullName ?? "—"}</TableCell>
                  <TableCell>
                    <StageChip status={l.status} />
                  </TableCell>
            
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Box>
  );
};

export default ManageLeavesView;
