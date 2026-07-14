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
  Button,
} from "@mui/material";
import StageChip from "../StageChip";
import {
  getMyLeaves,getLeaveById,
  type LeaveResponse,
} from "../../api/leaveApi";
import AddIcon from "@mui/icons-material/Add";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import TablePagination from "@mui/material/TablePagination";
import LeaveDetailsDialog from "./LeaveDetailsDialog";
import { useNavigate } from "react-router-dom";


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
  const navigate = useNavigate();
const [selectedLeave, setSelectedLeave] = useState<LeaveResponse | null>(null);
const [detailsOpen, setDetailsOpen] = useState(false);

const [page, setPage] = useState(0);
const [rowsPerPage, setRowsPerPage] = useState(10);
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
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/employee/apply-leave")}
          sx={{
            backgroundColor: "#009688", // Teal 500
            "&:hover": {
              backgroundColor: "#00796B", // Darker teal
            },
          }}
        >
          Apply Leave
        </Button>
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
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleLeaves
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((l) => (
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
