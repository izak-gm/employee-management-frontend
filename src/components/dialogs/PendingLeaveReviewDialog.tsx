import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  Chip,
} from "@mui/material";
import type { LeaveResponse } from "../../api/leaveApi";
import StageChip from "../StageChip";

interface Props {
  open: boolean;
  leave: LeaveResponse | null;
  loading?: boolean;
  onApprove: () => void;
  onReject: () => void;
  onClose: () => void;
}

const PendingLeaveReviewDialog = ({
  open,
  leave,
  loading,
  onApprove,
  onReject,
  onClose,
}: Props) => {
  if (!leave) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Review Leave Request</DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2}>
          <Typography>
            <strong>Employee:</strong> {leave.employeeFullName}
          </Typography>

          <Typography>
            <strong>Leave Type:</strong> {leave.leaveType}
          </Typography>

          <Typography>
            <strong>Dates:</strong> {leave.startDate} → {leave.endDate}
          </Typography>

          <Typography>
            <strong>Cover Employee:</strong> {leave.coverEmployeeFullName ?? "None"}
          </Typography>

          <Typography>
            <strong>Reason:</strong>
          </Typography>

          <Typography color="text.secondary">{leave.reason || "No reason provided"}</Typography>

          <Stack direction="row" spacing={1}>
            <Chip label={leave.leaveType} />
            <StageChip status={leave.status} />
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>

        <Button color="error" variant="contained" disabled={loading} onClick={onReject}>
          Reject
        </Button>

        <Button variant="contained" color="success" disabled={loading} onClick={onApprove}>
          Approve
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PendingLeaveReviewDialog;
