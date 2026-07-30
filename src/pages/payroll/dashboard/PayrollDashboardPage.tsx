import {
  Container,
  Grid,
  Box,
  TextField,
  MenuItem,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useMemo, useState } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import PayrollHeader from "../../../components/payroll/dashboard/PayrollHeader";
import QuickActionCard from "../../../components/payroll/dashboard/QuickActionCard";
import BadgeIcon from "@mui/icons-material/Badge";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PaymentsIcon from "@mui/icons-material/Payments";
import GroupsIcon from "@mui/icons-material/Groups";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

import { useNavigate } from "react-router-dom";
import { usePayrollSummary } from "../../../hooks/usePayrollReports";

const NAVY = "#132A46";
const SLATE = "#5B6B7F";
const BORDER = "#E4E8ED";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const fmt = (n?: number) =>
  new Intl.NumberFormat("en-KE", { maximumFractionDigits: 0 }).format(n ?? 0);

type CardColor = "navy" | "teal" | "coral" | "amber" | "purple" | "blue";

const CARD_COLORS: Record<CardColor, { bg: string; fg: string }> = {
  navy: { bg: "#E6ECF2", fg: "#132A46" },
  teal: { bg: "#E1F5EE", fg: "#0F6E56" },
  coral: { bg: "#FAECE7", fg: "#993C1D" },
  amber: { bg: "#FAEEDA", fg: "#854F0B" },
  purple: { bg: "#EEEDFE", fg: "#534AB7" },
  blue: { bg: "#E6F1FB", fg: "#185FA5" },
};

function SummaryCard({
  label,
  value,
  icon,
  color = "navy",
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color?: CardColor;
}) {
  const { bg, fg } = CARD_COLORS[color];
  return (
    <Box
      sx={{
        border: `1px solid ${BORDER}`,
        borderRadius: 2,
        p: 2.5,
        bgcolor: "#fff",
        display: "flex",
        alignItems: "center",
        gap: 2,
        height: "100%",
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 1.5,
          bgcolor: bg,
          color: fg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="caption" sx={{ color: SLATE }}>
          {label}
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 700, color: NAVY, lineHeight: 1.3 }}>
          {value}
        </Typography>
      </Box>
    </Box>
  );
}

export default function PayrollDashboardPage() {
  const navigate = useNavigate();

  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const years = useMemo(() => {
    const y = now.getFullYear();
    return [y - 1, y, y + 1];
  }, [now]);

  const { data: summary, isLoading } = usePayrollSummary(month, year);

  return (
    <DashboardLayout title="Payroll">
      <Container maxWidth="xl">
        <PayrollHeader />

        {/* Period selector */}
        <Box
          sx={{
            border: `1px solid ${BORDER}`,
            borderRadius: 2,
            p: 2,
            mb: 3,
            display: "flex",
            gap: 2,
            bgcolor: "#fff",
          }}
        >
          <TextField
            select
            size="small"
            label="Month"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            sx={{ minWidth: 160 }}
          >
            {MONTH_NAMES.map((name, idx) => (
              <MenuItem key={name} value={idx + 1}>
                {name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            size="small"
            label="Year"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            sx={{ minWidth: 120 }}
          >
            {years.map((y) => (
              <MenuItem key={y} value={y}>
                {y}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {/* Summary cards */}
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress size={28} sx={{ color: NAVY }} />
          </Box>
        ) : summary ? (
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid size={{ xs: 6, sm: 4, md: 3 }}>
              <SummaryCard
                label="Employees Paid"
                value={summary.employeeCount}
                icon={<GroupsIcon fontSize="small" />}
                color="navy"
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 4, md: 3 }}>
              <SummaryCard
                label="Gross Pay"
                value={fmt(summary.totalGrossPay)}
                icon={<PaymentsIcon fontSize="small" />}
                color="blue"
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 4, md: 3 }}>
              <SummaryCard
                label="Net Pay"
                value={fmt(summary.totalNetPay)}
                icon={<PaymentsIcon fontSize="small" />}
                color="teal"
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 4, md: 3 }}>
              <SummaryCard
                label="PAYE"
                value={fmt(summary.totalPaye)}
                icon={<ReceiptLongIcon fontSize="small" />}
                color="coral"
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 4, md: 3 }}>
              <SummaryCard
                label="NSSF (Employee)"
                value={fmt(summary.totalNssf)}
                icon={<AccountBalanceIcon fontSize="small" />}
                color="purple"
              />
            </Grid>        <Grid size={{ xs: 6, sm: 4, md: 3 }}>
              <SummaryCard
                label="NSSF (Employer)"
                value={fmt(summary.totalEmployerNssf)}
                icon={<AccountBalanceIcon fontSize="small" />}
                color="purple"
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 4, md: 3 }}>
              <SummaryCard
                label="SHIF"
                value={fmt(summary.totalShif)}
                icon={<HealthAndSafetyIcon fontSize="small" />}
                color="amber"
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 4, md: 3 }}>
              <SummaryCard
                label="Housing Levy"
                value={fmt(summary.totalHousingLevy)}
                icon={<HomeWorkIcon fontSize="small" />}
                color="coral"
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 4, md: 3 }}>
              <SummaryCard
                label="Housing Levy (Employer)"
                value={fmt(summary.totalEmployerHousingLevy)}
                icon={<HomeWorkIcon fontSize="small" />}
                color="coral"
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 4, md: 3 }}>
              <SummaryCard
                label="Total Deductions"
                value={fmt(summary.totalDeductions)}
                icon={<ReceiptLongIcon fontSize="small" />}
                color="navy"
              />
            </Grid>
          </Grid>
        ) : (
          <Typography variant="body2" sx={{ color: SLATE, mb: 4 }}>
            No payroll data for this period.
          </Typography>
        )}

        {/* Quick actions */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 3 }}>
            <QuickActionCard
              title="Payroll Profiles"
              description="Manage salaries, bank details and statutory information."
              icon={<BadgeIcon />}
              buttonLabel="Manage"
              onClick={() => navigate("/payroll/profiles")}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <QuickActionCard
              title="Reports"
              description="Access payroll reports, statutory deductions and summaries."
              icon={<AssessmentIcon />}
              buttonLabel="Open Reports"
              onClick={() => navigate("/payroll/reports")}
            />
          </Grid>
        </Grid>
      </Container>
    </DashboardLayout>
  );
}
