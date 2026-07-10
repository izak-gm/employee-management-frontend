import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import UndoIcon from "@mui/icons-material/Undo";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LeaveBalanceCards from "../../components/LeaveBalanceCards";
import StageChip from "../../components/StageChip";
import {
  getMyLeaves,
  deleteLeave,
  withdrawLeave,
  type LeaveResponse,
} from "../../api/leaveApi";

const EDITABLE = ["PENDING_COVER", "COVER_DECLINED"];
const WITHDRAWABLE = [
  "PENDING_COVER",
  "COVER_DECLINED",
  "PENDING_ADMIN",
  "APPROVED",
];

const MyLeavesPage = () => {
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState<LeaveResponse[]>([]);

  const load = () => {
    getMyLeaves().then((r) => setLeaves(r.data));
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Delete this leave request?")) {
      await deleteLeave(id);
      load();
    }
  };

  const handleWithdraw = async (id: string) => {
    if (confirm("Withdraw this leave?")) {
      await withdrawLeave(id);
      load();
    }
  };

  return (
    <DashboardLayout title="My Leaves">
      <LeaveBalanceCards />

      <Stack
        direction="row"
        sx={{ justifyContent: "space-between", alignItems: "center", mb: 2 }}
      >
        <Typography variant="h6">Leave History</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/employee/apply-leave")}
        >
          Apply for Leave
        </Button>
      </Stack>

      <Paper sx={{ border: "1px solid", borderColor: "divider" }}>
        {leaves.length === 0 ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography color="text.secondary">
              No leave applications yet.
            </Typography>
          </Box>
        ) : (
          leaves.map((l) => (
            <Box
              key={l.id}
              sx={{
                px: 3,
                py: 2,
                borderBottom: "1px solid",
                borderColor: "divider",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: 600 }}>
                  {`${l.leaveType ?? ""} Leave`}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {`${l.startDate ?? ""} → ${l.endDate ?? ""}`}
                  {l.coverEmployeeFullName
                    ? ` · Cover: ${l.coverEmployeeFullName}`
                    : ""}
                </Typography>
              </Box>

              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <StageChip status={l.status} />

                {EDITABLE.includes(l.status ?? "") && (
                  <Tooltip title="Edit">
                    <IconButton
                      size="small"
                      onClick={() =>
                        navigate(`/employee/apply-leave?edit=${l.id}`)
                      }
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}

                {EDITABLE.includes(l.status ?? "") && (
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(l.id!)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}

                {WITHDRAWABLE.includes(l.status ?? "") && (
                  <Tooltip title="Withdraw">
                    <IconButton
                      size="small"
                      onClick={() => handleWithdraw(l.id!)}
                    >
                      <UndoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Stack>
            </Box>
          ))
        )}
      </Paper>
    </DashboardLayout>
  );
};

export default MyLeavesPage;
