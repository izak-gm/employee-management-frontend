// src/pages/profile/ViewProfilePage.tsx
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
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getMyProfile } from "../../api/employeeApi";
import type { EmployeeResponse } from "../../types/auth.type";

const roleColor: Record<string, string> = {
  SUPERADMIN: "#C9A227",
  ADMIN: "#2C4A6E",
  EMPLOYEE: "#5B6B7A",
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
  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, py: 1.5 }}>
    <Box sx={{ color: "text.secondary", mt: 0.3 }}>{icon}</Box>
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
        {label}
      </Typography>
      <Typography sx={{ fontWeight: 500 }} color={value ? "text.primary" : "text.disabled"}>
        {value || "Not provided yet"}
      </Typography>
    </Box>
  </Box>
);

const ViewProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<EmployeeResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getMyProfile();
        setProfile(res.data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const initials =
    `${profile?.firstName?.[0] ?? ""}${profile?.lastName?.[0] ?? ""}`.toUpperCase() ||
    profile?.email?.[0]?.toUpperCase() ||
    profile?.gender?.[0] ||
    "?";

  const isIncomplete = !profile?.firstName || !profile?.lastName || !profile?.phoneNumber;

  return (
    <DashboardLayout title="My Profile">
      <Paper
        sx={{
          maxWidth: 560,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            bgcolor: "primary.dark",
            backgroundImage: "linear-gradient(135deg, #0F2A4A 0%, #1A3A5C 100%)",
            px: 4,
            pt: 4,
            pb: 7,
            position: "relative",
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
          {loading ? (
            <Stack spacing={2} sx={{ mt: -5 }}>
              <Skeleton variant="circular" width={88} height={88} />
              <Skeleton variant="text" width="50%" height={32} />
              <Skeleton variant="text" width="70%" />
            </Stack>
          ) : (
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: 2,
                  mt: -5.5,
                  mb: 1,
                }}
              >
                <Avatar
                  sx={{
                    width: 88,
                    height: 88,
                    fontSize: 32,
                    fontWeight: 600,
                    bgcolor: "#fff",
                    color: "primary.main",
                    border: "4px solid #fff",
                    boxShadow: 2,
                  }}
                >
                  {initials}
                </Avatar>
                {profile?.role && (
                  <Chip
                    label={profile.role}
                    size="small"
                    sx={{
                      mb: 1,
                      ml: "auto",
                      bgcolor: `${roleColor[profile.role]}1A`,
                      color: roleColor[profile.role],
                      fontWeight: 600,
                    }}
                  />
                )}
              </Box>

              <Typography variant="h5">
                {profile?.firstName || profile?.lastName
                  ? `${profile?.firstName ?? ""} ${profile?.lastName ?? ""}`.trim()
                  : "Unnamed User"}
              </Typography>
              <Typography color="text.secondary" variant="body2" sx={{ mb: 1 }}>
                {profile?.email}
              </Typography>

              {isIncomplete && (
                <Chip
                  label="Complete your profile"
                  size="small"
                  color="warning"
                  variant="outlined"
                  sx={{ mb: 1 }}
                />
              )}

              <Divider sx={{ my: 2 }} />

              <InfoRow
                icon={<BadgeOutlinedIcon fontSize="small" />}
                label="First Name"
                value={profile?.firstName}
              />
              <InfoRow
                icon={<BadgeOutlinedIcon fontSize="small" />}
                label="Last Name"
                value={profile?.lastName}
              />
              <InfoRow
                icon={<PhoneOutlinedIcon fontSize="small" />}
                label="Phone Number"
                value={profile?.phoneNumber}
              />
              <InfoRow
                icon={<EmailOutlinedIcon fontSize="small" />}
                label="Email"
                value={profile?.email}
              />
              <InfoRow
                icon={<EmailOutlinedIcon fontSize="small" />}
                label="Gender"
                value={profile?.gender}
              />

              <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={() => navigate("/profile/edit")}
                >
                  Edit Profile
                </Button>
                <Tooltip title="Change your password">
                  <Button
                    variant="outlined"
                    startIcon={<LockResetIcon />}
                    onClick={() => navigate("/profile/reset-password")}
                  >
                    Reset Password
                  </Button>
                </Tooltip>
              </Stack>
            </>
          )}
        </Box>
      </Paper>
    </DashboardLayout>
  );
};

export default ViewProfilePage;
