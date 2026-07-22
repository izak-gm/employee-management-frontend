import { Box, Paper, Typography } from "@mui/material";
import type { PayrollSummaryResponse } from "../../api/types/payroll";

const NAVY = "#132A46";
const SLATE = "#5B6B7F";
const BORDER = "#E4E8ED";
const GOLD = "#B8862E";
const GOLD_SOFT = "#F5EDE0";
const SUCCESS = "#1E6B4E";
const SUCCESS_SOFT = "#E7F3EE";

const fmt = (n: number) => new Intl.NumberFormat("en-KE", { maximumFractionDigits: 0 }).format(n);

interface Props {
  rows: PayrollSummaryResponse[];
}

export default function PayrollSummaryCards({ rows }: Props) {
  const totalGross = rows.reduce((sum, r) => sum + (r.grossPay ?? 0), 0);
  const totalNet = rows.reduce((sum, r) => sum + (r.netPay ?? 0), 0);
  const totalDeductions = rows.reduce((sum, r) => sum + (r.totalDeductions ?? 0), 0);
  const pendingApproval = rows.filter((r) => r.status === "GENERATED").length;
  const paidCount = rows.filter((r) => r.status === "PAID").length;

  const cards = [
    {
      label: "Employees paid",
      value: rows.length.toString(),
      sub: `${paidCount} disbursed`,
      accent: NAVY,
      bg: "#fff",
    },
    {
      label: "Total gross pay",
      value: `KES ${fmt(totalGross)}`,
      sub: "before deductions",
      accent: NAVY,
      bg: "#fff",
    },
    {
      label: "Total deductions",
      value: `KES ${fmt(totalDeductions)}`,
      sub: "PAYE, NSSF, SHIF, Levy",
      accent: "#B3261E",
      bg: "#fff",
    },
    {
      label: "Total net pay",
      value: `KES ${fmt(totalNet)}`,
      sub: "amount disbursed",
      accent: SUCCESS,
      bg: SUCCESS_SOFT,
    },
    {
      label: "Pending approval",
      value: pendingApproval.toString(),
      sub: "awaiting review",
      accent: GOLD,
      bg: GOLD_SOFT,
    },
  ];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(5, 1fr)" },
        gap: 2,
        mb: 3,
      }}
    >
      {cards.map((c) => (
        <Paper
          key={c.label}
          variant="outlined"
          sx={{
            borderColor: BORDER,
            borderRadius: 2,
            p: 2,
            bgcolor: c.bg,
          }}
        >
          <Typography variant="caption" sx={{ color: SLATE, fontWeight: 600 }}>
            {c.label}
          </Typography>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: c.accent, mt: 0.5, lineHeight: 1.2 }}
          >
            {c.value}
          </Typography>
          <Typography variant="caption" sx={{ color: SLATE }}>
            {c.sub}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
}
