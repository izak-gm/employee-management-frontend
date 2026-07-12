import { useEffect, useMemo, useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Stack,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LeaveBalanceCards from "../../components/LeaveBalanceCards";
import StageChip from "../../components/StageChip";
import {
  getMyLeaves,
  getMyBalance,
  type LeaveResponse,
  type LeaveBalance,
} from "../../api/leaveApi";
import { useNavigate } from "react-router-dom";
import {
  ProgressRow,
  MiniCalendar,
} from "../../components/dashboard/DashboardWidgets";

const TYPE_COLORS: Record<string, string> = {
  ANNUAL: "#0F2A4A",
  SICK: "#C9A227",
  PATERNITY: "#2C4A6E",
  MATERNITY: "#aa3bff",
  COMPASSIONATE: "#5B6B7A",
};

const MyLeavePage = () => {
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState<LeaveResponse[]>([]);
  const [balances, setBalances] = useState<LeaveBalance[]>([]);

  useEffect(() => {
    getMyLeaves().then((r) => setLeaves(r.data));
    getMyBalance().then((r) => setBalances(r.data));
  }, []);

  const leaveDaysSet = useMemo(() => {
    const set = new Set<string>();
    leaves
      .filter((l) => l.status === "APPROVED")
      .forEach((l) => {
        if (!l.startDate || !l.endDate) return;
        let d = new Date(l.startDate);
        const end = new Date(l.endDate);
        while (d <= end) {
          set.add(d.toISOString().slice(0, 10));
          d = new Date(d.getTime() + 86_400_000);
        }
      });
    return set;
  }, [leaves]);

  return (
    <DashboardLayout title="My Leaves">
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h5">My Leaves</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/employee/apply-leave")}
        >
          Apply for Leave
        </Button>
      </Stack>

      <Typography
        variant="overline"
        color="text.secondary"
        sx={{ letterSpacing: "0.1em" }}
      >
        Your Leave Balances
      </Typography>
      <LeaveBalanceCards />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper
            sx={{
              p: 3,
              border: "1px solid",
              borderColor: "divider",
              height: "100%",
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Leave usage this cycle
            </Typography>
            <Stack spacing={2.5}>
              {balances.map((b) => (
                <ProgressRow
                  key={b.leaveType}
                  label={b.leaveType ?? ""}
                  used={b.usedDays ?? 0}
                  max={b.maxDays ?? 0}
                  unlimited={b.unlimited}
                  color={TYPE_COLORS[b.leaveType ?? ""] ?? "#0F2A4A"}
                />
              ))}
              {balances.length === 0 && (
                <Typography color="text.secondary">
                  No balance data yet.
                </Typography>
              )}
            </Stack>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper
            sx={{
              p: 3,
              border: "1px solid",
              borderColor: "divider",
              height: "100%",
            }}
          >
            <MiniCalendar highlighted={leaveDaysSet} color="#0F2A4A" />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mt: 1.5 }}
            >
              Highlighted days are your approved leave. Public holidays aren't
              wired in yet — that needs a holidays endpoint.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ border: "1px solid", borderColor: "divider" }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6">Leave History</Typography>
        </Box>
        <Divider />
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
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <Box>
                <Typography
                  sx={{ fontWeight: 600 }}
                >{`${l.leaveType ?? ""} Leave`}</Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >{`${l.startDate ?? ""} → ${l.endDate ?? ""}`}</Typography>
                {l.coverEmployeeFullName && (
                  <Typography variant="caption" color="text.secondary">
                    Cover: {l.coverEmployeeFullName}
                  </Typography>
                )}
              </Box>
              <StageChip status={l.status} />
            </Box>
          ))
        )}
      </Paper>
    </DashboardLayout>
  );
};
export default MyLeavePage;
