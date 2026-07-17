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

  return (
    <DashboardLayout title={editId ? "Edit Leave" : "Apply for Leave"}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/leaves")}
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
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              disabled={isEndDateAutoCalculated}
              helperText={
                isEndDateAutoCalculated
                  ? "Calculated automatically from your start date and leave entitlement."
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
                renderInput={(params) => <TextField {...params} label="Cover Employee" required />}
              />
            )}

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={
                loading || !startDate || !endDate || (leaveType !== "COMPASSIONATE" && !cover)
              }
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
            >
              {loading ? "Submitting..." : editId ? "Save Changes" : "Submit Application"}
            </Button>
          </Stack>
        </form>
      </Paper>
    </DashboardLayout>
  );
};

export default ApplyLeavePage;
