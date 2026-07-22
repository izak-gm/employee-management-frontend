import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Alert,
  CircularProgress,
  Autocomplete,
  Chip,
  Divider,
} from "@mui/material";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";

import { usePayrollActions } from "../../hooks/usePayroll";
import type { PayrollSummaryResponse } from "../../api/types/payroll";

const NAVY = "#132A46";
const SLATE = "#5B6B7F";
const SURFACE = "#F7F8FA";

interface EmployeeOption {
  id: string;
  label: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  employees: EmployeeOption[];
  defaultMonth: number;
  defaultYear: number;
  onGenerated: (results: PayrollSummaryResponse[]) => void;
}

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

export default function GeneratePayrollDialog({
  open,
  onClose,
  employees,
  defaultMonth,
  defaultYear,
  onGenerated,
}: Props) {
  const [month, setMonth] = useState(defaultMonth);
  const [year, setYear] = useState(defaultYear);
  const [selectedEmployees, setSelectedEmployees] = useState<EmployeeOption[]>([]);
  const { generate, isProcessing, error, clearError } = usePayrollActions();

  const years = useMemo(() => {
    const current = new Date().getFullYear();
    return [current - 1, current, current + 1];
  }, []);
  useEffect(() => {
    if (open) {
      setMonth(defaultMonth);
      setYear(defaultYear);
      setSelectedEmployees([]);
      clearError();
    }
  }, [open, defaultMonth, defaultYear, clearError]);

  const handleGenerate = async () => {
    clearError();

    const result = await generate({
      month,
      year,
      employeeIds: selectedEmployees.length > 0 ? selectedEmployees.map((e) => e.id) : undefined,
    });

    if (!result) return;

    onGenerated(result);
    onClose();
  };
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, color: NAVY, pb: 1 }}>Generate payroll</DialogTitle>

      <DialogContent>
        <Typography variant="body2" sx={{ color: SLATE, mb: 3 }}>
          Runs payroll for the selected period. Leave employees blank to generate for every active
          employee with a payroll profile.
        </Typography>

        <Box sx={{ display: "flex", gap: 2, mb: 2.5 }}>
          <TextField
            select
            fullWidth
            label="Month"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            {MONTH_NAMES.map((name, idx) => (
              <MenuItem key={name} value={idx + 1}>
                {name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            fullWidth
            label="Year"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            {years.map((y) => (
              <MenuItem key={y} value={y}>
                {y}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Autocomplete<EmployeeOption, true, false, false>
          multiple
          options={employees}
          value={selectedEmployees}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          getOptionLabel={(option) => option.label}
          onChange={(_, value) => setSelectedEmployees(value)}
          renderValue={(value, getItemProps) =>
            value.map((option, index) => (
              <Chip
                {...getItemProps({ index })}
                key={option.id}
                label={option.label}
                size="small"
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Employees (optional)"
              placeholder="Leave blank for all active employees"
            />
          )}
        />

        <Divider sx={{ my: 2.5 }} />

        <Box
          sx={{
            bgcolor: SURFACE,
            borderRadius: 1.5,
            p: 2,
            display: "flex",
            gap: 1,
          }}
        >
          <Typography variant="body2" sx={{ color: SLATE }}>
            {selectedEmployees.length === 0
              ? "This will generate payroll for all active employees who have a payroll profile set up."
              : `This will generate payroll for ${selectedEmployees.length} selected ${
                  selectedEmployees.length === 1 ? "employee" : "employees"
                }.`}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }} onClose={clearError}>
            {error}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} sx={{ color: SLATE, textTransform: "none" }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleGenerate}
          disabled={isProcessing}
          startIcon={
            isProcessing ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <PlayArrowOutlinedIcon />
            )
          }
          sx={{
            bgcolor: NAVY,
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            "&:hover": { bgcolor: "#1E3A5F" },
          }}
        >
          {isProcessing ? "Generating…" : "Generate payroll"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
