import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  Divider,
} from "@mui/material";
import StageChip from "./dashboard/StageChip";

interface Props {
  open: boolean;
  onClose: () => void;
  leave: any;
}

const LeaveDetailsDialog = ({ open, onClose, leave }: Props) => {
  if (!leave) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Leave Details</DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography color="text.secondary">Status</Typography>
            <StageChip status={leave.status} />
          </Stack>

          <Divider />

          <Stack direction="row" sx={{ justifyContent: "space-between" }}>
            <Typography color="text.secondary">Leave Type</Typography>
            <Typography>{leave.leaveType}</Typography>
          </Stack>

          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography color="text.secondary">Start Date</Typography>
            <Typography>{leave.startDate}</Typography>
          </Stack>

          <Stack direction="row" sx={{ justifyContent: "space-between" }}>
            <Typography color="text.secondary">End Date</Typography>
            <Typography>{leave.endDate}</Typography>
          </Stack>

          {leave.coverEmployeeFullName && (
            <Stack direction="row" sx={{ justifyContent: "space-between" }}>
              <Typography color="text.secondary">Cover Person</Typography>
              <Typography>{leave.coverEmployeeFullName}</Typography>
            </Stack>
          )}

          {leave.approvedByFullName && (
            <Stack direction="row" sx={{ justifyContent: "space-between" }}>
              <Typography color="text.secondary">Approved By</Typography>
              <Typography>{leave.approvedByFullName}</Typography>
            </Stack>
          )}

          {leave.createdAt && (
            <Stack direction="row" sx={{ justifyContent: "space-between" }}>
              <Typography color="text.secondary">Submitted</Typography>
              <Typography>{leave.createdAt.slice(0, 10)}</Typography>
            </Stack>
          )}

          {leave.reason && (
            <>
              <Divider />
              <Typography color="text.secondary">Reason</Typography>
              <Typography>{leave.reason}</Typography>
            </>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default LeaveDetailsDialog;
