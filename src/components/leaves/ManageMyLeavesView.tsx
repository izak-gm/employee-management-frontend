import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  MenuItem,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { getMyLeaves, getLeaveById, withdrawLeave } from "../../api/leaves";
import AddIcon from "@mui/icons-material/Add";
import LeaveDetailsDialog from "./LeaveDetailsDialog";
import { useNavigate } from "react-router-dom";
import type { LeaveResponse } from "../../api";
import { DataGrid } from "@mui/x-data-grid";
import { createLeaveColumns } from "../../tables/leaves/leavesColumns";

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
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [leaveToWithdraw, setLeaveToWithdraw] = useState<string | null>(null);
  const [leaves, setLeaves] = useState<LeaveResponse[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [refreshKey, _setRefreshKey] = useState(0);
  const fetchLeaves = async () => {
    const leaves = await getMyLeaves();
    setLeaves(leaves);
  };

  useEffect(() => {
    fetchLeaves();
  }, [refreshKey]);

  const visibleLeaves =
    statusFilter === "ALL" ? leaves : leaves.filter((l) => l.status === statusFilter);

  const handleViewLeave = async (id: string) => {
    try {
      const leave = await getLeaveById(id);
      setSelectedLeave(leave);
      setDetailsOpen(true);
    } catch (err) {
      console.error(err);
    }
  };
  const handleWithdraw = async () => {
    if (!leaveToWithdraw) return;

    try {
      await withdrawLeave(leaveToWithdraw);

      setLeaves((prev) =>
        prev.map((l) => (l.id === leaveToWithdraw ? { ...l, status: "WITHDRAWN" } : l)),
      );

      setWithdrawOpen(false);
      setLeaveToWithdraw(null);
    } catch (err) {
      console.error(err);
    }
  };
  const openWithdrawDialog = (id: string) => {
    setLeaveToWithdraw(id);
    setWithdrawOpen(true);
  };
const columns = createLeaveColumns({
  navigate,
  handleViewLeave,
  openWithdrawDialog,
});
  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        All Leaves
      </Typography>

      {/* Apply button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mb: 2,
        }}
      >
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/leaves/apply")}
          sx={{
            backgroundColor: "#009688",
            "&:hover": {
              backgroundColor: "#00796B",
            },
          }}
        >
          Apply Leave
        </Button>
      </Box>

      {/* Filter */}
      <Box sx={{ mb: 3 }}>
        <TextField
          select
          size="small"
          label="Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          sx={{ minWidth: 220 }}
        >
          {STATUS_FILTERS.map((f) => (
            <MenuItem key={f.value} value={f.value}>
              {f.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <Paper
        sx={{
          border: "1px solid",
          borderColor: "divider",
          height: 650,
        }}
      >
        <DataGrid
          rows={visibleLeaves}
          columns={columns}
          getRowId={(row) => row.id!}
          disableRowSelectionOnClick
          pageSizeOptions={[5, 10, 20, 50]}
          initialState={{
            pagination: {
              paginationModel: {
                page: 0,
                pageSize: 10,
              },
            },
          }}
          sx={{
            border: 0,
            "& .MuiDataGrid-columnHeaders": {
              fontWeight: 700,
            },
            "& .MuiDataGrid-cell": {
              display: "flex",
              alignItems: "center",
            },
          }}
        />
      </Paper>
      <LeaveDetailsDialog
        open={detailsOpen}
        leave={selectedLeave}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedLeave(null);
        }}
      />
      <Dialog open={withdrawOpen} onClose={() => setWithdrawOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Withdraw Leave</DialogTitle>

        <DialogContent>
          <Typography>Are you sure you want to withdraw this leave request?</Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setWithdrawOpen(false)}>Cancel</Button>

          <Button variant="contained" color="error" onClick={handleWithdraw}>
            Withdraw
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageLeavesView;
