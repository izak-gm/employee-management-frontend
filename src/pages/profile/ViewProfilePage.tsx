import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Chip,
  Divider,
  Stack,
  Skeleton,
  Button,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import LockResetIcon from "@mui/icons-material/LockReset";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import CakeOutlinedIcon from "@mui/icons-material/CakeOutlined";
import FingerprintOutlinedIcon from "@mui/icons-material/FingerprintOutlined";
import WcOutlinedIcon from "@mui/icons-material/WcOutlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import SupervisorAccountOutlinedIcon from "@mui/icons-material/SupervisorAccountOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import EventBusyOutlinedIcon from "@mui/icons-material/EventBusyOutlined";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getMyProfile } from "../../api/employees";
import type { EmployeeResponse } from "../../types/auth.type";
import { useAuth } from "../../context/AuthContext";

const NAVY = "#0F1E33";
const SLATE = "#5B6B7F";
const MUTED = "#8493A6";
const BORDER = "#E1E6ED";
const PAGE_BG = "#F4F6F9";

const roleColor: Record<string, string> = {
  SUPERADMIN: "#C9A227",
  HR_ADMIN: "#2C4A6E",
  HR_OFFICER: "#3D6FB4",
  PAYROLL_MANAGER: "#1F8A5F",
  FINANCE_MANAGER: "#1F8A5F",
  TECH_LEAD: "#5B4B8A",
  SOFTWARE_ENGINEER: "#5B6B7A",
  INTERN: "#B8860B",
};

const statusColor: Record<string, string> = {
  ACTIVE: "#1F8A5F",
  ON_LEAVE: "#B8860B",
  SUSPENDED: "#C0392B",
  TERMINATED: "#8493A6",
  EXITED: "#8493A6",
};

const formatDate = (value?: string) => {
  if (!value) return null;
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
};

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
}) => (
  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.75, py: 1.4 }}>
    <Box sx={{ color: MUTED, mt: 0.3, display: "flex" }}>{icon}</Box>
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="caption" sx={{ color: MUTED, display: "block", fontWeight: 500 }}>
        {label}
      </Typography>
      <Typography sx={{ fontWeight: 500, color: value ? NAVY : "#B7C0CC" }}>
        {value || "Not provided"}
      </Typography>
    </Box>
  </Box>
);

const SectionCard = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) => (
  <Paper
    elevation={0}
    sx={{ border: "1px solid", borderColor: BORDER, borderRadius: 2, overflow: "hidden" }}
  >
    <Box sx={{ px: 3, py: 2, borderBottom: "1px solid", borderColor: BORDER, bgcolor: "#FAFBFC" }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: NAVY }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="caption" sx={{ color: MUTED }}>
          {subtitle}
        </Typography>
      )}
    </Box>
    <Box sx={{ px: 3, py: 0.5 }}>{children}</Box>
  </Paper>
);

const ViewProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<EmployeeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const { role } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const myprofile = await getMyProfile();
        setProfile(myprofile);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const initials =
    `${profile?.firstName?.[0] ?? ""}${profile?.lastName?.[0] ?? ""}`.toUpperCase() ||
    profile?.email?.[0]?.toUpperCase() ||
    "?";

  const isIncomplete =
    !profile?.firstName ||
    !profile?.lastName ||
    !profile?.phoneNumber ||
    !profile?.dateOfBirth ||
    !profile?.nationalId;

  const tenureLabel = (() => {
    if (!profile?.hireDate) return null;
    const start = new Date(profile.hireDate);
    const end = profile.exitDate ? new Date(profile.exitDate) : new Date();
    const months =
      (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    const years = Math.floor(months / 12);
    const remMonths = months % 12;
    if (years <= 0) return `${remMonths} month${remMonths === 1 ? "" : "s"}`;
    return `${years} yr${years === 1 ? "" : "s"}${remMonths ? ` ${remMonths} month` : ""}`;
  })();

  return (
    <DashboardLayout title="My Profile">
      <Box sx={{ bgcolor: PAGE_BG, minHeight: "100vh", pb: 6 }}>
        <Box sx={{ maxWidth: 1100, mx: "auto", px: 3, pt: 4 }}>
          {loading ? (
            <Stack spacing={2}>
              <Skeleton variant="rounded" height={180} />
              <Skeleton variant="rounded" height={220} />
              <Skeleton variant="rounded" height={220} />
            </Stack>
          ) : (
            <Stack spacing={3}>
              {/* HERO / IDENTITY CARD */}
              <Paper
                elevation={0}
                sx={{
                  border: "1px solid",
                  borderColor: BORDER,
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    backgroundImage: "linear-gradient(135deg, #0F2A4A 0%, #1A3A5C 100%)",
                    px: 4,
                    pt: 4,
                    pb: 7,
                  }}
                >
                  <Typography
                    variant="overline"
                    sx={{ color: "rgba(255,255,255,0.6)", letterSpacing: "0.1em" }}
                  >
                    Profile Overview
                  </Typography>
                </Box>

                <Box sx={{ px: 4, pb: 4 }}>
                  <Box sx={{ display: "flex", alignItems: "flex-end", gap: 2, mt: -5.5, mb: 1 }}>
                    <Avatar
                      sx={{
                        width: 88,
                        height: 88,
                        fontSize: 32,
                        fontWeight: 600,
                        bgcolor: "#fff",
                        color: NAVY,
                        border: "4px solid #fff",
                        boxShadow: 2,
                      }}
                    >
                      {initials}
                    </Avatar>
                    <Stack direction="row" spacing={1} sx={{ mb: 1, ml: "auto" }}>
                      {profile?.status && (
                        <Chip
                          label={profile.status.replace("_", " ")}
                          size="small"
                          sx={{
                            bgcolor: `${statusColor[profile.status] ?? MUTED}1A`,
                            color: statusColor[profile.status] ?? MUTED,
                            fontWeight: 600,
                          }}
                        />
                      )}
                      {profile?.role && (
                        <Chip
                          label={profile.role.replace("_", " ")}
                          size="small"
                          sx={{
                            bgcolor: `${roleColor[profile.role] ?? MUTED}1A`,
                            color: roleColor[profile.role] ?? MUTED,
                            fontWeight: 600,
                          }}
                        />
                      )}
                    </Stack>
                  </Box>

                  <Typography variant="h5" sx={{ fontWeight: 700, color: NAVY }}>
                    {profile?.firstName || profile?.lastName
                      ? `${profile?.firstName ?? ""} ${profile?.middleName ?? ""} ${
                          profile?.lastName ?? ""
                        }`
                          .replace(/\s+/g, " ")
                          .trim()
                      : "Unnamed User"}
                  </Typography>
                  <Typography sx={{ color: SLATE, mb: 1.5 }} variant="body2">
                    {profile?.positionName ?? "Position not assigned"}
                    {profile?.departmentName ? ` · ${profile.departmentName}` : ""}
                  </Typography>

                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {profile?.employeeNumber && (
                      <Chip
                        size="small"
                        variant="outlined"
                        label={`ID: ${profile.employeeNumber}`}
                        sx={{ borderColor: BORDER, color: SLATE, fontWeight: 500 }}
                      />
                    )}
                    {tenureLabel && (
                      <Chip
                        size="small"
                        variant="outlined"
                        label={`${tenureLabel} at company`}
                        sx={{ borderColor: BORDER, color: SLATE, fontWeight: 500 }}
                      />
                    )}
                    {isIncomplete && (
                      <Chip
                        label="Complete your profile"
                        size="small"
                        color="warning"
                        variant="outlined"
                      />
                    )}
                  </Stack>

                  <Divider sx={{ my: 2.5 }} />

                  <Stack direction="row" spacing={2} flexWrap="wrap">
                    {(role === "HR_ADMIN" || role === "SUPERADMIN") && (
                      <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={() => navigate("/profile/edit")}
                        sx={{
                          bgcolor: NAVY,
                          textTransform: "none",
                          fontWeight: 600,
                          "&:hover": { bgcolor: "#0A1626" },
                        }}
                      >
                        Edit Profile
                      </Button>
                    )}
                    <Tooltip title="Change your password">
                      <Button
                        variant="outlined"
                        startIcon={<LockResetIcon />}
                        onClick={() => navigate("/profile/reset-password")}
                        sx={{
                          textTransform: "none",
                          fontWeight: 600,
                          borderColor: BORDER,
                          color: NAVY,
                        }}
                      >
                        Reset Password
                      </Button>
                    </Tooltip>
                  </Stack>
                </Box>
              </Paper>

              {/* PERSONAL + EMPLOYMENT GRID */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 3,
                }}
              >
                <SectionCard title="Personal Information" subtitle="Identity and contact details">
                  <InfoRow
                    icon={<BadgeOutlinedIcon fontSize="small" />}
                    label="First Name"
                    value={profile?.firstName}
                  />
                  <Divider />
                  <InfoRow
                    icon={<BadgeOutlinedIcon fontSize="small" />}
                    label="Middle Name"
                    value={profile?.middleName}
                  />
                  <Divider />
                  <InfoRow
                    icon={<BadgeOutlinedIcon fontSize="small" />}
                    label="Last Name"
                    value={profile?.lastName}
                  />
                  <Divider />
                  <InfoRow
                    icon={<EmailOutlinedIcon fontSize="small" />}
                    label="Email"
                    value={profile?.email}
                  />
                  <Divider />
                  <InfoRow
                    icon={<PhoneOutlinedIcon fontSize="small" />}
                    label="Phone Number"
                    value={profile?.phoneNumber}
                  />
                  <Divider />
                  <InfoRow
                    icon={<WcOutlinedIcon fontSize="small" />}
                    label="Gender"
                    value={profile?.gender}
                  />
                  <Divider />
                  <InfoRow
                    icon={<CakeOutlinedIcon fontSize="small" />}
                    label="Date of Birth"
                    value={formatDate(profile?.dateOfBirth)}
                  />
                  <Divider />
                  <InfoRow
                    icon={<FingerprintOutlinedIcon fontSize="small" />}
                    label="National ID"
                    value={profile?.nationalId}
                  />
                </SectionCard>

                <SectionCard title="Employment Details" subtitle="Role, department, and status">
                  <InfoRow
                    icon={<BadgeOutlinedIcon fontSize="small" />}
                    label="Employee Number"
                    value={profile?.employeeNumber}
                  />
                  <Divider />
                  <InfoRow
                    icon={<WorkOutlineOutlinedIcon fontSize="small" />}
                    label="Role"
                    value={profile?.role?.replace("_", " ")}
                  />
                  <Divider />
                  <InfoRow
                    icon={<ApartmentOutlinedIcon fontSize="small" />}
                    label="Department"
                    value={profile?.departmentName}
                  />
                  <Divider />
                  <InfoRow
                    icon={<WorkOutlineOutlinedIcon fontSize="small" />}
                    label="Position"
                    value={profile?.positionName}
                  />
                  <Divider />
                  <InfoRow
                    icon={<SupervisorAccountOutlinedIcon fontSize="small" />}
                    label="Supervisor"
                    value={profile?.supervisorName}
                  />
                  <Divider />
                  <InfoRow
                    icon={<VerifiedOutlinedIcon fontSize="small" />}
                    label="Status"
                    value={profile?.status?.replace("_", " ")}
                  />
                  <Divider />
                  <InfoRow
                    icon={<EventAvailableOutlinedIcon fontSize="small" />}
                    label="Hire Date"
                    value={formatDate(profile?.hireDate)}
                  />
                  <Divider />
                  <InfoRow
                    icon={<VerifiedOutlinedIcon fontSize="small" />}
                    label="Confirmation Date"
                    value={formatDate(profile?.confirmationDate)}
                  />
                  {profile?.exitDate && (
                    <>
                      <Divider />
                      <InfoRow
                        icon={<EventBusyOutlinedIcon fontSize="small" />}
                        label="Exit Date"
                        value={formatDate(profile?.exitDate)}
                      />
                    </>
                  )}
                </SectionCard>
              </Box>

              {/* RECORD META */}
              <Paper
                elevation={0}
                sx={{
                  border: "1px solid",
                  borderColor: BORDER,
                  borderRadius: 2,
                  px: 3,
                  py: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 1,
                }}
              >
                <Typography variant="caption" sx={{ color: MUTED }}>
                  Record created {formatDate(profile?.createdAt) ?? "—"}
                </Typography>
                <Typography variant="caption" sx={{ color: MUTED }}>
                  Last updated {formatDate(profile?.updatedAt) ?? "—"}
                </Typography>
              </Paper>
            </Stack>
          )}
        </Box>
      </Box>
    </DashboardLayout>
  );
};

export default ViewProfilePage;
