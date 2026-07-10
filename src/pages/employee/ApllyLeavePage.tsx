import { useState, useEffect } from "react";
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
} from "../../api/leaveApi";
import { extractErrorMessage } from "../../api/errorUtils";
import { useAuth } from "../../context/AuthContext";

const TYPES = ["ANNUAL", "SICK", "PATERNITY", "MATERNITY", "COMPASSIONATE"];

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
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

useEffect(() => {
  getActiveEmployees().then((r) =>
    setActive(r.data.filter((e: any) => e.id !== employeeId)),
  );
  if (editId) {
    getMyLeaves().then((r) => {
      const l = r.data.find((x: any) => x.id === editId);
      if (l) {
        setLeaveType(l.leaveType ?? "ANNUAL");
        setStartDate(l.startDate ?? "");
        setEndDate(l.endDate ?? "");
        setReason(l.reason ?? "");
      }
    });
  }
}, [editId, employeeId]);
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
