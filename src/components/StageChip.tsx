import { Chip } from "@mui/material";
import type { LeaveStatus } from "../api/leaveApi";

const MAP: Record<string, { label: string; color: any }> = {
  PENDING_COVER: { label: "Awaiting Cover", color: "warning" },
  COVER_DECLINED: { label: "Cover Declined", color: "error" },
  PENDING_ADMIN: { label: "Awaiting Approval", color: "info" },
  APPROVED: { label: "Approved", color: "success" },
  REJECTED: { label: "Rejected", color: "error" },
  WITHDRAWN: { label: "Withdrawn", color: "default" },
};

const StageChip = ({ status }: { status?: LeaveStatus }) => {
  const s = MAP[status ?? ""] ?? { label: status, color: "default" };
  return <Chip label={s.label} color={s.color} size="small" sx={{ fontWeight: 600 }} />;
};
export default StageChip;
