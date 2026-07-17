import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  Divider,
  Chip,
  Grid,
} from "@mui/material";

import { formatDateTime } from "../../util/dateUtils";
import type { LeaveResponse } from "../../api";

interface Props {
  open: boolean;
  leave: LeaveResponse | null;
  onClose: () => void;
}

const statusColor = (status?: string): "success" | "warning" | "error" | "default" => {
  switch (status) {
    case "APPROVED":
      return "success";

    case "PENDING_ADMIN":
    case "PENDING_COVER":
      return "warning";

    case "REJECTED":
      return "error";

    default:
      return "default";
  }
};

interface DetailRowProps {
  label: string;
  value?: string | null;
}

const DetailRow = ({ label, value }: DetailRowProps) => (
  <>
    <Grid size={{ xs: 5 }}>
      <Typography
        color="text.secondary"
        sx={{
          fontWeight: 600,
        }}
      >
        {label}
      </Typography>
    </Grid>

    <Grid size={{ xs: 7 }}>
      <Typography>{value || "-"}</Typography>
    </Grid>
  </>
);

const LeaveDetailsDialog = ({ open, leave, onClose }: Props) => {
  if (!leave) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Leave Details</DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2}>
          <Grid container spacing={2}>
            <DetailRow label="Employee" value={leave.employeeFullName} />

            <DetailRow label="Leave Type" value={leave.leaveType} />

            <DetailRow label="Start Date" value={leave.startDate} />

            <DetailRow label="End Date" value={leave.endDate} />

            <DetailRow label="Cover Employee" value={leave.coverEmployeeFullName} />

            <Grid size={{ xs: 5 }}>
              <Typography
                color="text.secondary"
                sx={{
                  fontWeight: 600,
                }}
              >
                Status
              </Typography>
            </Grid>

            <Grid size={{ xs: 7 }}>
              <Chip label={leave.status} color={statusColor(leave.status)} />
            </Grid>
          </Grid>

          <Divider />

          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
            }}
          >
            Reason
          </Typography>

          <Typography color="text.secondary">{leave.reason || "No reason provided."}</Typography>

          <Divider />

          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
            }}
          >
            Timeline
          </Typography>

          <Grid container spacing={2}>
            <DetailRow label="Applied On" value={formatDateTime(leave.createdAt)} />

            {/* <DetailRow
              label="Last Updated"
              value={leave.updatedAt}
            /> */}
            {leave.approvedByFullName && (
              <>
                <DetailRow label="Approved By" value={leave.approvedByFullName} />
              </>
            )}

            {/* {leave.rejectedReason && (
              <>
                <DetailRow
                  label="Rejection Reason"
                  value={leave.rejectedReason}
                />
              </>
            )} */}
          </Grid>

          <Divider />

          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
            }}
          >
            Leave Summary
          </Typography>

          <Typography color="text.secondary">
            {leave.employeeFullName} requested <strong>{leave.leaveType}</strong> leave from{" "}
            <strong>{leave.startDate}</strong> to <strong>{leave.endDate}</strong>.
          </Typography>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button variant="contained" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LeaveDetailsDialog;
