import { useEffect, useState } from "react";
import { Grid, Paper, Typography, LinearProgress } from "@mui/material";
import { getMyBalance, type LeaveBalanceResponse } from "../../api";

const COLORS: Record<string, string> = {
  ANNUAL: "#0F2A4A",
  SICK: "#C9A227",
  PATERNITY: "#2C4A6E",
  MATERNITY: "#aa3bff",
  COMPASSIONATE: "#5B6B7A",
};

const LeaveBalanceCards = () => {
  const [balances, setBalances] = useState<LeaveBalanceResponse[]>([]);

  useEffect(() => {
    getMyBalance().then(setBalances);
  }, []);

  return (
    <Grid container spacing={2} sx={{ mb: 4 }}>
      {balances.map((b) => (
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }} key={b.leaveType}>
          <Paper sx={{ p: 2.5, border: "1px solid", borderColor: "divider" }}>
            <Typography variant="caption" color="text.secondary">
              {b.leaveType}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {b.unlimited ? "∞" : `${b.remainingDays}/${b.maxDays}`}
            </Typography>
            {!b.unlimited && (
              <LinearProgress
                variant="determinate"
                value={((b.usedDays ?? 0) / (b.maxDays ?? 1)) * 100}
                sx={{
                  mt: 1,
                  height: 5,
                  borderRadius: 3,
                  bgcolor: "divider",
                  "& .MuiLinearProgress-bar": {
                    bgcolor: COLORS[b.leaveType ?? ""] ?? "primary.main",
                    borderRadius: 3,
                  },
                }}
              />
            )}
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};
export default LeaveBalanceCards;
