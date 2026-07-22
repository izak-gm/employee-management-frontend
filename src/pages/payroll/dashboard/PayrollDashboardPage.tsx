import { Container, Grid } from "@mui/material";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import PayrollHeader from "../../../components/payroll/dashboard/PayrollHeader";
import QuickActionCard from "../../../components/payroll/dashboard/QuickActionCard";
import PaymentsIcon from "@mui/icons-material/Payments";
import BadgeIcon from "@mui/icons-material/Badge";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AssessmentIcon from "@mui/icons-material/Assessment";

import { useNavigate } from "react-router-dom";
import PayrollStatCard from "../../../components/payroll/dashboard/PayrollStatCard";

export default function PayrollDashboardPage() {
  const navigate = useNavigate();

  return (
    <DashboardLayout title="Payroll">
      <Container maxWidth="xl">
        <PayrollHeader />

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 3 }}>
            <QuickActionCard
              title="Generate Payroll"
              description="Generate monthly payroll for all eligible employees."
              icon={<PaymentsIcon />}
              buttonLabel="Generate"
              onClick={() => navigate("/payroll/payslips")}
            />
          </Grid>

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
              title="Payroll Runs"
              description="View payroll history, approvals and payment status."
              icon={<ReceiptLongIcon />}
              buttonLabel="View Runs"
              onClick={() => navigate("/payroll/runs")}
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
        {/* 
        <PayrollStatCard employees={184} profiles={179} pendingPayrolls={6} paidPayrolls={42} />

        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <LatestPayrollCard />
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <RecentPayrollTable />
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <RecentActivityCard />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <PayrollTimelineCard />
          </Grid>
        </Grid> */}
      </Container>
    </DashboardLayout>
  );
}
