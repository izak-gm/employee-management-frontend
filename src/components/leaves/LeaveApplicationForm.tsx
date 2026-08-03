import { useState, useEffect, useRef } from "react";
import {
  Paper,
  TextField,
  Button,
  MenuItem,
  Alert,
  Stack,
  Autocomplete,
  CircularProgress,
  Typography,
  Box,
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DashboardLayout from "../../components/layout/DashboardLayout";

import { extractErrorMessage } from "../../api/errorUtils";
import { useAuth } from "../../context/AuthContext";
import {
  getMyProfile,
  getActiveEmployees,
  getMyBalance,
  getMyLeaves,
  updateLeave,
  applyForLeave,
  type LeaveBalanceResponse,
} from "../../api";

const ALL_TYPES = ["ANNUAL", "SICK", "PATERNITY", "MATERNITY", "COMPASSIONATE"];

const AUTO_CALCULATED_TYPES = new Set(["MATERNITY", "PATERNITY"]);

const ApplyLeavePage = () => {
  const { id } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const editId = params.get("edit");

  const [employee, setEmployee] = useState<any>(null);

  const [leaveType, setLeaveType] = useState("ANNUAL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [cover, setCover] = useState<any>(null);

  const [active, setActive] = useState<any[]>([]);
  const [balances, setBalances] = useState<LeaveBalanceResponse[]>([]);

  const [loading, setLoading] = useState(false);

  const [banner, setBanner] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const readyRef = useRef(false);
  useEffect(() => {
    const loadData = async () => {
      try {
        const employee = await getMyProfile();
        setEmployee(employee);

        const employees = await getActiveEmployees();
        setActive(employees.filter((e: any) => e.id !== id));

        const leaveBalances = await getMyBalance();
        setBalances(leaveBalances);

        if (editId) {
          const leaves = await getMyLeaves();

          const leave = leaves.find((l: any) => l.id === editId);

          if (leave) {
            setLeaveType(leave.leaveType ?? "ANNUAL");
            setStartDate(leave.startDate ?? "");
            setEndDate(leave.endDate ?? "");
            setReason(leave.reason ?? "");
          }
        }

        readyRef.current = true;
      } catch (err) {
        console.error(err);
      }
    };

    loadData();
  }, [id, editId]);

  useEffect(() => {
    if (!editId || active.length === 0) return;

    const loadCover = async () => {
      try {
        const leaves = await getMyLeaves();

        const leave = leaves.find((l: any) => l.id === editId);

        if (!leave) return;

        const selectedCover = active.find((e: any) => e.id === leave.coverEmployeeId);

        setCover(selectedCover ?? null);
      } catch (err) {
        console.error(err);
      }
    };

    loadCover();
  }, [editId, active]);
  const TYPES = ALL_TYPES.filter((type) => {
    if (!employee?.gender) return true;

    if (employee.gender === "MALE") {
      return type !== "MATERNITY";
    }

    if (employee.gender === "FEMALE") {
      return type !== "PATERNITY";
    }

    return true;
  });

  useEffect(() => {
    if (!readyRef.current) return;

    if (!AUTO_CALCULATED_TYPES.has(leaveType)) return;

    if (!startDate) return;

    const entitlementDays = balances.find((b) => b.leaveType === leaveType)?.maxDays;

    if (!entitlementDays) return;

    const start = new Date(startDate);
    const end = new Date(start);

    end.setDate(end.getDate() + entitlementDays - 1);

    setEndDate(end.toISOString().slice(0, 10));
  }, [leaveType, startDate, balances]);

  const entitlementDays = balances.find((b) => b.leaveType === leaveType)?.maxDays;

  const isEndDateAutoCalculated = AUTO_CALCULATED_TYPES.has(leaveType) && !!entitlementDays;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setBanner(null);

    if (!startDate || !endDate) {
      setBanner({
        type: "error",
        text: "Select start and end dates.",
      });

      return;
    }
    if (leaveType !== "COMPASSIONATE" && !cover?.id) {
      setBanner({
        type: "error",
        text: "Please select a cover employee.",
      });
      return;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedStart = new Date(startDate);
    selectedStart.setHours(0, 0, 0, 0);

    if (selectedStart <= today) {
      setBanner({
        type: "error",
        text: "Leave must start from tomorrow onwards.",
      });
      return;
    }
    setLoading(true);

    try {
      const payload = {
        leaveType: leaveType as any,
        startDate,
        endDate,
        reason,
        coverEmployeeId: leaveType === "COMPASSIONATE" ? null : cover!.id,
      };
      if (editId) {
        await updateLeave(editId, payload);
      } else {
        await applyForLeave(payload);
      }
      setBanner({
        type: "success",
        text: `Leave ${editId ? "updated" : "submitted"} successfully.`,
      });

      setTimeout(() => navigate("/leaves"), 1200);
    } catch (err) {
      setBanner({
        type: "error",
        text: extractErrorMessage(err),
      });
    } finally {
      setLoading(false);
    }
  };

  // EDIT
const TYPE_META: Record<string, { color: string; label: string }> = {
  ANNUAL: { color: "#1F8A5F", label: "Annual Leave" },
  SICK: { color: "#B8860B", label: "Sick Leave" },
  MATERNITY: { color: "#B5637A", label: "Maternity Leave" },
  PATERNITY: { color: "#3D6FB4", label: "Paternity Leave" },
  COMPASSIONATE: { color: "#5B4B8A", label: "Compassionate Leave" },
};
return (
  <DashboardLayout title={editId ? "Edit Leave" : "Apply for Leave"}>
    <Box sx={{ bgcolor: "#F4F6F9", minHeight: "100vh", pb: 6 }}>
      {/* Header bar */}
      <Box sx={{ bgcolor: "#fff", borderBottom: "1px solid #E1E6ED" }}>
        <Box sx={{ maxWidth: 1200, mx: "auto", px: 3, py: 3 }}>
          <Button
            startIcon={<ArrowBackIcon sx={{ fontSize: 18 }} />}
            onClick={() => navigate("/leaves")}
            sx={{
              color: "#8493A6",
              fontWeight: 500,
              textTransform: "none",
              mb: 1,
              pl: 0,
              "&:hover": { bgcolor: "transparent", color: "#132A46" },
            }}
          >
            Back to leaves
          </Button>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#0F1E33" }}>
            {editId ? "Edit Leave Request" : "Apply for Leave"}
          </Typography>
          <Typography variant="body2" sx={{ color: "#8493A6", mt: 0.5 }}>
            Submit your request and track your available balance below.
          </Typography>
        </Box>
      </Box>

      <Box sx={{ maxWidth: 1200, mx: "auto", px: 3, mt: 4 }}>
        {banner && (
          <Alert severity={banner.type} sx={{ mb: 3, borderRadius: 1.5 }}>
            {banner.text}
          </Alert>
        )}

        <Stack direction={{ xs: "column", md: "row" }} spacing={3} alignItems="flex-start">
          {/* FORM CARD */}
          <Paper
            elevation={0}
            sx={{
              width: { xs: "100%", md: "34%" },
              minWidth: { md: 380 },
              border: "1px solid #E1E6ED",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <Box sx={{ px: 3, py: 2.5, borderBottom: "1px solid #E1E6ED", bgcolor: "#FAFBFC" }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#0F1E33" }}>
                Request Details
              </Typography>
            </Box>

            <Box sx={{ p: 3 }}>
              <form onSubmit={handleSubmit}>
                <Stack spacing={2.5}>
                  <TextField
                    select
                    label="Leave Type"
                    fullWidth
                    size="small"
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value)}
                  >
                    {TYPES.map((t) => (
                      <MenuItem key={t} value={t}>
                        {TYPE_META[t]?.label ?? t}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    label="Start Date"
                    type="date"
                    fullWidth
                    size="small"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    slotProps={{
                      inputLabel: { shrink: true },
                      htmlInput: {
                        min: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                      },
                    }}
                  />
                  <TextField
                    label="End Date"
                    type="date"
                    fullWidth
                    size="small"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    disabled={isEndDateAutoCalculated}
                    helperText={
                      isEndDateAutoCalculated
                        ? "Calculated automatically from your entitlement."
                        : undefined
                    }
                    slotProps={{
                      inputLabel: { shrink: true },
                      htmlInput: {
                        min: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                      },
                    }}
                  />

                  <TextField
                    label="Reason"
                    multiline
                    rows={3}
                    fullWidth
                    size="small"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />

                  {leaveType !== "COMPASSIONATE" && (
                    <Autocomplete
                      options={active}
                      value={cover}
                      onChange={(_, value) => setCover(value)}
                      getOptionLabel={(e: any) => `${e.firstName} ${e.lastName}`}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      renderInput={(params) => (
                        <TextField {...params} label="Cover Employee" size="small" required />
                      )}
                    />
                  )}

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={
                      loading || !startDate || !endDate || (leaveType !== "COMPASSIONATE" && !cover)
                    }
                    startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
                    sx={{
                      bgcolor: "#132A46",
                      textTransform: "none",
                      fontWeight: 600,
                      py: 1.2,
                      "&:hover": { bgcolor: "#0F1E33" },
                    }}
                  >
                    {loading ? "Submitting…" : editId ? "Save Changes" : "Submit Application"}
                  </Button>
                </Stack>
              </form>
            </Box>
          </Paper>

          {/* BALANCE CARD */}
          <Paper
            elevation={0}
            sx={{
              width: { xs: "100%", md: "66%" },
              border: "1px solid #E1E6ED",
              borderRadius: 2,
              overflow: "hidden",
              position: { md: "sticky" },
              top: { md: 24 },
            }}
          >
            <Box
              sx={{
                px: 3,
                py: 2.5,
                borderBottom: "1px solid #E1E6ED",
                bgcolor: "#FAFBFC",
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#0F1E33" }}>
                  Leave Balance
                </Typography>
                <Typography variant="caption" sx={{ color: "#8493A6" }}>
                  Days available as of today
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                p: 3,
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2,
              }}
            >
              {TYPES.map((t) => {
                const bal = balances.find((b) => b.leaveType === t);
                const max = bal?.maxDays ?? 0;
                const used = bal?.usedDays ?? 0;
                const remaining = bal?.remainingDays ?? Math.max(max - used, 0);
                const unlimited = bal?.unlimited || max < 0;
                const isSelected = t === leaveType;
                const meta = TYPE_META[t] ?? { color: "#8493A6", label: t };
                const pct = !unlimited && max > 0 ? Math.min((remaining / max) * 100, 100) : 0;
                const isLow = !unlimited && remaining === 0;

                return (
                  <Box
                    key={t}
                    sx={{
                      p: 2.25,
                      borderRadius: 1.5,
                      border: "1px solid",
                      borderColor: isSelected ? "#132A46" : "#E1E6ED",
                      bgcolor: isSelected ? "#F5F8FC" : "#FFFFFF",
                      boxShadow: isSelected ? "0 0 0 1px #132A46 inset" : "none",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Box>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              bgcolor: meta.color,
                            }}
                          />
                          <Typography variant="body2" sx={{ fontWeight: 600, color: "#0F1E33" }}>
                            {meta.label}
                          </Typography>
                        </Stack>
                        {isSelected && (
                          <Typography
                            variant="caption"
                            sx={{ color: "#132A46", fontWeight: 600, ml: 2.25 }}
                          >
                            Selected
                          </Typography>
                        )}
                      </Box>
                    </Stack>

                    <Stack direction="row" alignItems="baseline" spacing={0.5} sx={{ mt: 1.5 }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: "#0F1E33" }}>
                        {unlimited ? "∞" : remaining}
                      </Typography>
                      {!unlimited && (
                        <Typography variant="body2" sx={{ color: "#8493A6", fontWeight: 500 }}>
                          / {max} days
                        </Typography>
                      )}
                    </Stack>

                    {!unlimited ? (
                      <Box
                        sx={{
                          mt: 1.5,
                          height: 6,
                          borderRadius: 3,
                          bgcolor: "#EEF1F5",
                          overflow: "hidden",
                        }}
                      >
                        <Box
                          sx={{
                            height: "100%",
                            width: `${pct}%`,
                            bgcolor: isLow ? "#C0392B" : meta.color,
                            borderRadius: 3,
                          }}
                        />
                      </Box>
                    ) : (
                      <Typography
                        variant="caption"
                        sx={{ color: "#8493A6", mt: 1.5, display: "block" }}
                      >
                        No annual cap
                      </Typography>
                    )}

                    <Typography
                      variant="caption"
                      sx={{ color: "#8493A6", mt: 0.75, display: "block" }}
                    >
                      {unlimited
                        ? "Unlimited entitlement"
                        : `${used} day${used === 1 ? "" : "s"} used`}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Paper>
        </Stack>
      </Box>
    </Box>
  </DashboardLayout>
);
};

export default ApplyLeavePage;
