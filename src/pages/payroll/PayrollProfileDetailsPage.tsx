import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import BadgeIcon from "@mui/icons-material/Badge";
import PaymentsIcon from "@mui/icons-material/Payments";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import { getPayrollProfileById } from "../../api/payrolls/payrollProfiles";
import type { PayrollProfileResponse } from "../../api/types/payroll";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { DetailRow, maskAccount, SectionCard } from "./helper/helpers";

const TOKENS = {
  navy: "#132A46",
  surface: "#F7F8FA",
  border: "#E4E8ED",
};

export default function PayrollProfileDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<PayrollProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        if (!id) return;

        const response = await getPayrollProfileById(id);
        setProfile(response);
      } catch {
        setError("Unable to load payroll profile.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const money = (value?: number) =>
    new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      maximumFractionDigits: 0,
    }).format(value ?? 0);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 8,
        }}
      >
        {" "}
        <CircularProgress />
      </Box>
    );
  }

  if (error || !profile) {
    return <Alert severity="error">{error || "Payroll profile not found."}</Alert>;
  }

  const gross =
    (profile.basicSalary ?? 0) +
    (profile.houseAllowance ?? 0) +
    (profile.transportAllowance ?? 0) +
    (profile.medicalAllowance ?? 0) +
    (profile.otherAllowance ?? 0);

  return (
    <DashboardLayout title="Payroll Profile">
      <Box
        sx={{
          bgcolor: "#F5F7FA",
          minHeight: "100vh",
        }}
      >
        {/* ---------------------------------------------------------------- */}
        {/* HERO HEADER                                                      */}
        {/* ---------------------------------------------------------------- */}

        <Box
          sx={{
            bgcolor: "#fff",
            borderBottom: "1px solid #E5E7EB",
          }}
        >
          <Box
            sx={{
              maxWidth: 1400,
              mx: "auto",
              px: 4,
              py: 4,
            }}
          >
            <Stack spacing={2}>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                }}
              >
                Payroll / Payroll Profiles / {profile.employeeFullName}
              </Typography>

              <Stack
                direction={{
                  xs: "column",
                  md: "row",
                }}
                spacing={3}
                sx={{
                  justifyContent: "space-between",
                  alignItems: {
                    xs: "flex-start",
                    md: "center",
                  },
                }}
              >
                <Box>
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: TOKENS.navy,
                      }}
                    >
                      {profile.employeeFullName}
                    </Typography>

                    <Chip color="success" label="Active Payroll Profile" />
                  </Stack>

                  <Typography
                    sx={{
                      mt: 1,
                      color: "text.secondary",
                    }}
                  >
                    {profile.employeeNumber}
                    {" • "}
                    {profile.department}
                    {" • "}
                    {profile.position}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 1,
                      color: "#6B7280",
                      maxWidth: 650,
                    }}
                  >
                    Review the employee payroll configuration including salary structure, statutory
                    identifiers and banking information.
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Box>
        </Box>

        {/* ---------------------------------------------------------------- */}
        {/* SUMMARY CARDS                                                    */}
        {/* ---------------------------------------------------------------- */}

        <Box
          sx={{
            maxWidth: 1400,
            mx: "auto",
            px: 4,
            py: 4,
          }}
        >
          <Grid container spacing={3}>
            {/* Executive Salary Card */}

            <Grid size={{ xs: 12, md: 4 }}>
              <Card
                sx={{
                  bgcolor: TOKENS.navy,
                  color: "#fff",
                  borderRadius: 3,
                  height: "100%",
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography
                    variant="overline"
                    sx={{
                      opacity: 0.8,
                      letterSpacing: 1,
                    }}
                  >
                    GROSS MONTHLY SALARY
                  </Typography>

                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      mt: 1,
                    }}
                  >
                    {money(gross)}
                  </Typography>

                  <Divider
                    sx={{
                      my: 3,
                      borderColor: "rgba(255,255,255,.15)",
                    }}
                  />

                  <Stack spacing={2}>
                    <Stack
                      direction="row"
                      sx={{
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "grey.300",
                        }}
                      >
                        Basic Salary
                      </Typography>

                      <Typography
                        sx={{
                          fontWeight: 600,
                        }}
                      >
                        {money(profile.basicSalary)}
                      </Typography>
                    </Stack>

                    <Stack
                      direction="row"
                      sx={{
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "grey.300",
                        }}
                      >
                        Pension
                      </Typography>

                      <Typography
                        sx={{
                          fontWeight: 600,
                        }}
                      >
                        {money(profile.pensionContribution)}
                      </Typography>
                    </Stack>

                    <Stack
                      direction="row"
                      sx={{
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "grey.300",
                        }}
                      >
                        Effective From
                      </Typography>

                      <Typography
                        sx={{
                          fontWeight: 600,
                        }}
                      >
                        {profile.effectiveFrom}
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            {/* Employee Snapshot */}

            <Grid size={{ xs: 12, md: 8 }}>
              <Card
                sx={{
                  borderRadius: 3,
                  border: "1px solid #E5E7EB",
                  boxShadow: "none",
                  height: "100%",
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    Employee Snapshot
                  </Typography>

                  <Typography
                    sx={{
                      color: "text.secondary",
                      mb: 4,
                    }}
                  >
                    Core employment and payroll information.
                  </Typography>

                  <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <DetailRow label="Employee Number" value={profile.employeeNumber} />

                      <DetailRow label="Department" value={profile.department} />

                      <DetailRow label="Position" value={profile.position} />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <DetailRow label="KRA PIN" value={profile.kraPin} />

                      <DetailRow label="SHIF Number" value={profile.shifNumber} />

                      <DetailRow label="NSSF Number" value={profile.nssfNumber} />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            {/* ---------------------------------------------------------------- */}
            {/* SALARY BREAKDOWN                                                 */}
            {/* ---------------------------------------------------------------- */}
            <Grid container spacing={9}>
              {/* Salary Breakdown */}
              <Grid size={{ xs: 12, lg: 7 }}>
                <SectionCard
                  title="Salary Breakdown"
                  subtitle="Employee compensation configuration"
                  icon={<PaymentsIcon />}
                >
                  <DetailRow label="Basic Salary" value={money(profile.basicSalary)} />

                  <DetailRow label="House Allowance" value={money(profile.houseAllowance)} />

                  <DetailRow
                    label="Transport Allowance"
                    value={money(profile.transportAllowance)}
                  />

                  <DetailRow label="Medical Allowance" value={money(profile.medicalAllowance)} />

                  <DetailRow label="Other Allowance" value={money(profile.otherAllowance)} />

                  <Divider sx={{ my: 2 }} />

                  <DetailRow label="Gross Salary" value={money(gross)} highlight />

                  <DetailRow
                    label="Pension Contribution"
                    value={money(profile.pensionContribution)}
                  />
                </SectionCard>
              </Grid>

              {/* Bank Information */}
              <Grid size={{ xs: 12, lg: 5 }}>
                <SectionCard
                  title="Bank Information"
                  subtitle="Salary payment destination"
                  icon={<AccountBalanceIcon />}
                >
                  <DetailRow label="Bank" value={profile.bankName} />

                  <DetailRow label="Branch" value={profile.bankBranch} />

                  <DetailRow label="Account Number" value={maskAccount(profile.accountNumber)} />

                  <Divider sx={{ my: 2 }} />

                  <DetailRow
                    label="Payroll Status"
                    value={<Chip size="small" color="success" label="ACTIVE" />}
                  />

                  <DetailRow label="Effective From" value={profile.effectiveFrom} />
                </SectionCard>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </DashboardLayout>
  );
}
