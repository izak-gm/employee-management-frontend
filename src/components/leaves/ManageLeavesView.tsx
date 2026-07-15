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
  IconButton,
  Tooltip,
  Chip,
  MenuItem,
  TextField,
  Stack,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import StageChip from "../StageChip";
import {
  getAllLeaves,
  adminActionLeave,
  getLeaveById,
  type LeaveResponse,
} from "../../api/leaveApi";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import TablePagination from "@mui/material/TablePagination";
import LeaveDetailsDialog from "./LeaveDetailsDialog";

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
  const [selectedLeave, setSelectedLeave] = useState<LeaveResponse | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    getAllLeaves().then((r) => setLeaves(r.data));
  }, [refreshKey]);

  const handleAction = async (id: string, status: "APPROVED" | "REJECTED") => {
    await adminActionLeave(id, status);
    setRefreshKey((k) => k + 1);
  };

  const visibleLeaves =
    statusFilter === "ALL" ? leaves : leaves.filter((l) => l.status === statusFilter);
  const handleViewLeave = async (id: string) => {
    try {
      const res = await getLeaveById(id);
      setSelectedLeave(res.data);
      setDetailsOpen(true);
    } catch (err) {
      console.error(err);
    }
  };
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
            <Typography color="text.secondary">No leave requests match this filter.</Typography>
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
                <TableCell>View</TableCell>
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
                  <TableCell align="right">
                    <Tooltip title="View leave details">
                      <IconButton color="primary" onClick={() => handleViewLeave(l.id!)}>
                        <VisibilityOutlinedIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>{" "}
                  <TableCell align="right">
                    {l.status === "PENDING_ADMIN" ? (
                      <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end" }}>
                        <Tooltip title="Approve">
                          <IconButton
                            color="success"
                            onClick={() => handleAction(l.id!, "APPROVED")}
                          >
                            <CheckCircleIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Reject">
                          <IconButton color="error" onClick={() => handleAction(l.id!, "REJECTED")}>
                            <CancelIcon />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    ) : l.status === "PENDING_COVER" ? (
                      <Chip label="Waiting on cover" size="small" variant="outlined" />
                    ) : (
                      <Typography variant="caption" color="text.secondary">
                        —
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TablePagination
              component="div"
              count={visibleLeaves.length}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={(_, newPage) => setPage(newPage)}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[5, 10, 20, 50]}
            />
          </Table>
        )}
      </Paper>
      <LeaveDetailsDialog
        open={detailsOpen}
        leave={selectedLeave}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedLeave(null);
        }}
      />
      
    </Box>
  );
};

export default ManageLeavesView;
