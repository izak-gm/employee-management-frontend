import { Chip } from "@mui/material";
import type { PayrollStatus } from "../../api/types/payroll";

const STATUS_STYLES: Record<PayrollStatus, { bg: string; color: string; label: string }> = {
  DRAFT:     { bg: "#EEF0F3", color: "#5B6B7F", label: "Draft" },
  GENERATED: { bg: "#EAF1FB", color: "#1E5490", label: "Generated" },
  APPROVED:  { bg: "#F5EDE0", color: "#B8862E", label: "Approved" },
  PAID:      { bg: "#E7F3EE", color: "#1E6B4E", label: "Paid" },
  REVERSED:  { bg: "#FBEAEA", color: "#B3261E", label: "Reversed" },
};

export default function PayrollStatusChip({ status }: { status?: PayrollStatus }) {
  const style = STATUS_STYLES[status ?? "DRAFT"];
  return (
    <Chip
      size="small"
      label={style.label}
      sx={{
        bgcolor: style.bg,
        color: style.color,
        fontWeight: 700,
        fontSize: 11,
        letterSpacing: 0.3,
        height: 24,
      }}
    />
  );
}
