import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Link as MuiLink,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import PayrollProfileForm from "../../components/payroll/profile/PayrollProfileForm";
import { usePayrollProfile } from "../../hooks/usePayrollProfile";
import { useActiveEmployees } from "../../hooks/useEmployees"; // existing hook in your app
import type { PayrollProfileResponse } from "../../api/types/payroll";

const NAVY = "#132A46";
const SLATE = "#5B6B7F";

export default function EditPayrollProfilePage() {
  const navigate = useNavigate();
  const { employeeId } = useParams<{ employeeId: string }>();

  const { data: profile, isLoading, error, hasProfile } = usePayrollProfile(employeeId ?? null);
  const { data: employees = [], isLoading: loadingEmployees } = useActiveEmployees();

  const employeeOptions = useMemo(
    () =>
      employees.map((e) => ({
        id: e.id ?? "",
        label: [e.firstName, e.lastName].filter(Boolean).join(" "),
        department: e.departmentName,
      })),
    [employees],
  );

  const employeeName = employeeOptions.find((e) => e.id === employeeId)?.label ?? "Employee";

  const handleSaved = (updated: PayrollProfileResponse) => {
    navigate(`/payroll/profiles/${updated.employeeId}`, { replace: true });
  };

  const busy = isLoading || loadingEmployees;

  return (
    <Box sx={{ bgcolor: "#F7F8FA", minHeight: "100vh" }}>
      <Box sx={{ bgcolor: "#fff", borderBottom: "1px solid #E4E8ED" }}>
        <Container maxWidth="lg" sx={{ py: 3 }}>
          <Breadcrumbs
            separator={<ChevronRightIcon sx={{ fontSize: 16, color: SLATE }} />}
            sx={{ mb: 1, "& .MuiBreadcrumbs-li": { fontSize: 13 } }}
          >
            <MuiLink
              underline="hover"
              color={SLATE}
              onClick={() => navigate("/payroll")}
              sx={{ cursor: "pointer" }}
            >
              Payroll
            </MuiLink>
            <MuiLink
              underline="hover"
              color={SLATE}
              onClick={() => navigate("/payroll/profiles")}
              sx={{ cursor: "pointer" }}
            >
              Payroll profiles
            </MuiLink>
            <Typography
              sx={{
                color: NAVY,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {" "}
              {employeeName}
            </Typography>
          </Breadcrumbs>

          <Typography variant="h5" sx={{ fontWeight: 700, color: NAVY }}>
            Edit payroll profile
          </Typography>
          <Typography variant="body2" sx={{ color: SLATE, mt: 0.5 }}>
            Update {employeeName}'s salary, allowances, or bank details.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {busy ? (
          <Stack
            sx={{
              alignItems: "center",
              py: 8,
            }}
          >
            {" "}
            <CircularProgress size={28} sx={{ color: NAVY }} />
          </Stack>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : !hasProfile ? (
          <Alert severity="info">
            This employee doesn't have a payroll profile yet.{" "}
            <MuiLink
              sx={{ cursor: "pointer", fontWeight: 600 }}
              onClick={() => navigate(`/payroll/profiles/new?employeeId=${employeeId}`)}
            >
              Create one
            </MuiLink>
            .
          </Alert>
        ) : (
          <PayrollProfileForm
            employees={employeeOptions}
            existingProfile={profile}
            profileId={profile?.id}
            onSaved={handleSaved}
            onCancel={() => navigate(-1)}
          />
        )}
      </Container>
    </Box>
  );
}
