import { useState, useEffect, useRef } from "react";
import {
  Paper,
  TextField,
  Button,
  MenuItem,
  Alert,
  Stack,
  Autocomplete,
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  applyForLeave,
  updateLeave,
  getActiveEmployees,
  getMyLeaves,
  getMyBalance,
  type LeaveBalance,
} from "../../api/leaveApi";
import { extractErrorMessage } from "../../api/errorUtils";
import { useAuth } from "../../context/AuthContext";

const TYPES = ["ANNUAL", "SICK", "PATERNITY", "MATERNITY", "COMPASSIONATE"];

// Leave types whose end date is derived from the start date rather than
// picked by the employee — driven by that type's entitlement (maxDays),
// not a hardcoded number, so it can't drift from LeaveBalanceCards elsewhere.
const AUTO_CALCULATED_TYPES = new Set(["MATERNITY", "PATERNITY"]);

const ApplyLeavePage = () => {
  const { employeeId } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const editId = params.get("edit");

  const [leaveType, setLeaveType] = useState("ANNUAL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [cover, setCover] = useState<any>(null);
  const [active, setActive] = useState<any[]>([]);
  const [balances, setBalances] = useState<LeaveBalance[]>([]);
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Guards the auto-calc effect from firing before the edit-mode fetch
  // has populated the form, so we don't stomp the saved dates on load.
  const readyRef = useRef(false);

  useEffect(() => {
    getActiveEmployees().then((r) =>
      setActive(r.data.filter((e: any) => e.id !== employeeId)),
    );
    getMyBalance().then((r) => setBalances(r.data));

    if (editId) {
      getMyLeaves().then((r) => {
        const l = r.data.find((x: any) => x.id === editId);
        if (l) {
          setLeaveType(l.leaveType ?? "ANNUAL");
          setStartDate(l.startDate ?? "");
          setEndDate(l.endDate ?? "");
          setReason(l.reason ?? "");
        }
        readyRef.current = true;
      });
    } else {
      readyRef.current = true;
    }
  }, [editId, employeeId]);

  // Auto-populate end date for maternity/paternity leave whenever the
  // start date changes or the leave type is switched to one of these.
  useEffect(() => {
    if (!readyRef.current) return;
    if (!AUTO_CALCULATED_TYPES.has(leaveType)) return;
    if (!startDate) return;

    const entitlementDays = balances.find(
      (b) => b.leaveType === leaveType,
    )?.maxDays;
    if (!entitlementDays) return;

    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + entitlementDays - 1); // inclusive of the start day
    setEndDate(end.toISOString().slice(0, 10));
  }, [leaveType, startDate, balances]);

  const entitlementDays = balances.find(
    (b) => b.leaveType === leaveType,
  )?.maxDays;
  const isEndDateAutoCalculated =
    AUTO_CALCULATED_TYPES.has(leaveType) && !!entitlementDays;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBanner(null);
    if (!startDate || !endDate) {
      setBanner({ type: "error", text: "Select start and end dates." });
      return;
    }
    setLoading(true);
    try {
      const payload = {
        leaveType: leaveType as any,
        startDate,
        endDate,
        reason,
        coverEmployeeId: cover?.id,
      };
      if (editId) await updateLeave(editId, payload);
      else await applyForLeave(payload);
      setBanner({
        type: "success",
        text: `Leave ${editId ? "updated" : "submitted"} successfully.`,
      });
      setTimeout(() => navigate("/employee/leaves"), 1200);
    } catch (err) {
      setBanner({ type: "error", text: extractErrorMessage(err) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title={editId ? "Edit Leave" : "Apply for Leave"}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/employee/leaves")}
        sx={{ mb: 2, color: "text.secondary" }}
      >
        Back
      </Button>
      <Paper
        sx={{
          p: 4,
          maxWidth: 520,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        {banner && (
          <Alert severity={banner.type} sx={{ mb: 2 }}>
            {banner.text}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <Stack spacing={2.5}>
            <TextField
              select
              label="Leave Type"
              fullWidth
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
            >
              {TYPES.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Start Date"
              type="date"
              fullWidth
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              label="End Date"
              type="date"
              fullWidth
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              disabled={isEndDateAutoCalculated}
              helperText={
                isEndDateAutoCalculated
                  ? "Calculated automatically from your start date and leave entitlement."
                  : undefined
              }
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              label="Reason"
              multiline
              rows={3}
              fullWidth
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <Autocomplete
              options={active}
              getOptionLabel={(e: any) =>
                `${e.firstName ?? ""} ${e.lastName ?? ""}`
              }
              value={cover}
              onChange={(_, v) => setCover(v)}
              renderInput={(p) => (
                <TextField
                  {...p}
                  label="Cover Person"
                  placeholder="Select an active employee"
                />
              )}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
            >
              {loading
                ? "Submitting…"
                : editId
                  ? "Save Changes"
                  : "Submit Application"}
            </Button>
          </Stack>
        </form>
      </Paper>
    </DashboardLayout>
  );
};
export default ApplyLeavePage;
