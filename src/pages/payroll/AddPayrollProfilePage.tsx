import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Link as MuiLink,
  Stack,
  CircularProgress,
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import PayrollProfileForm from "../../components/payroll/profile/PayrollProfileForm";
import { useActiveEmployees } from "../../hooks/useEmployees"; // existing hook in your app
import type { PayrollProfileResponse } from "../../api/types/payroll";

const NAVY = "#132A46";
const SLATE = "#5B6B7F";

export default function AddPayrollProfilePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedEmployeeId = searchParams.get("employeeId") ?? undefined;

  const { data: employees = [], isPending } = useActiveEmployees();
  const employeeOptions = useMemo(
    () =>
      employees.map((e) => ({
        id: e.id ?? "",
        label: [e.firstName, e.lastName].filter(Boolean).join(" "),
        department: e.departmentName,
      })),
    [employees],
  );

  const handleSaved = (profile: PayrollProfileResponse) => {
    navigate(`/payroll/profiles/${profile.employeeId}`, { replace: true });
  };

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
              New profile
            </Typography>
          </Breadcrumbs>

          <Typography variant="h5" sx={{ fontWeight: 700, color: NAVY }}>
            Set up payroll profile
          </Typography>
          <Typography variant="body2" sx={{ color: SLATE, mt: 0.5 }}>
            Configure an employee's salary, bank details, and statutory numbers before payroll can
            be generated for them.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {isPending ? (
          <Stack
            sx={{
              alignItems: "center",
              py: 8,
            }}
          >
            {" "}
            <CircularProgress size={28} sx={{ color: NAVY }} />
          </Stack>
        ) : (
          <PayrollProfileForm
            employees={employeeOptions}
            onSaved={handleSaved}
            onCancel={() => navigate(-1)}
          />
        )}
      </Container>
    </Box>
  );
}
