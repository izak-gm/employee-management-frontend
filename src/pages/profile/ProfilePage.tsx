import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Avatar,
  Chip,
  Divider,
  Stack,
  Skeleton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getEmployeeById, updateEmployee } from "../../api/employeeApi";
import { useAuth } from "../../context/AuthContext";
import type { EmployeeResponse, UpdateEmployee } from "../../types/auth.type";

const roleColor: Record<string, string> = {
  SUPERADMIN: "#C9A227",
  ADMIN: "#2C4A6E",
  EMPLOYEE: "#5B6B7A",
};

const ProfilePage = () => {
  const { employeeId } = useAuth();
  const [profile, setProfile] = useState<EmployeeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<UpdateEmployee>({});
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchProfile = async () => {
    if (!employeeId) return;
    setLoading(true);
    try {
      const res = await getEmployeeById(employeeId);
      setProfile(res.data);
      setForm({
        firstName: res.data.firstName ?? "",
        lastName: res.data.lastName ?? "",
        phoneNumber: res.data.phoneNumber ?? "",
        email: res.data.email ?? "",
      });
    } catch {
      setMessage({ type: "error", text: "Failed to load profile." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId]);

  const handleChange =
    (field: keyof UpdateEmployee) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSave = async () => {
    if (!employeeId) return;
    setSaving(true);
    try {
      await updateEmployee(employeeId, form);
      setMessage({ type: "success", text: "Profile updated successfully." });
      setEditing(false);
      fetchProfile(); // refresh view with latest saved data
    } catch {
      setMessage({ type: "error", text: "Update failed. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // reset form back to current profile values, discard unsaved edits
    if (profile) {
      setForm({
        firstName: profile.firstName ?? "",
        lastName: profile.lastName ?? "",
        phoneNumber: profile.phoneNumber ?? "",
        email: profile.email ?? "",
      });
    }
    setEditing(false);
    setMessage(null);
  };

  const initials =
    `${profile?.firstName?.[0] ?? ""}${profile?.lastName?.[0] ?? ""}`.toUpperCase() ||
    profile?.email?.[0]?.toUpperCase() ||
    "?";

  return (
    <DashboardLayout title="My Profile">
      <Paper
        sx={{
          p: 4,
          maxWidth: 560,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        {loading ? (
          <Stack spacing={2}>
            <Skeleton variant="circular" width={64} height={64} />
            <Skeleton variant="text" width="60%" height={32} />
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="80%" />
          </Stack>
        ) : (
          <>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: "primary.main",
                  fontSize: 24,
                }}
              >
                {initials}
              </Avatar>
              <Box>
                <Typography variant="h6">
                  {profile?.firstName || profile?.lastName
                    ? `${profile?.firstName ?? ""} ${profile?.lastName ?? ""}`.trim()
                    : "Unnamed User"}
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  {profile?.email}
                </Typography>
              </Box>
              {profile?.role && (
                <Chip
                  label={profile.role}
                  size="small"
                  sx={{
                    ml: "auto",
                    bgcolor: `${roleColor[profile.role]}1A`,
                    color: roleColor[profile.role],
                    fontWeight: 600,
                  }}
                />
              )}
            </Box>

            <Divider sx={{ mb: 3 }} />

            {message && (
              <Alert
                severity={message.type}
                sx={{ mb: 2 }}
                onClose={() => setMessage(null)}
              >
                {message.text}
              </Alert>
            )}

            {!editing ? (
              // VIEW MODE
              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    First Name
                  </Typography>
                  <Typography>{profile?.firstName || "—"}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Last Name
                  </Typography>
                  <Typography>{profile?.lastName || "—"}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Phone Number
                  </Typography>
                  <Typography>{profile?.phoneNumber || "—"}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Email
                  </Typography>
                  <Typography>{profile?.email || "—"}</Typography>
                </Box>

                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={() => setEditing(true)}
                  sx={{ alignSelf: "flex-start", mt: 1 }}
                >
                  Edit Profile
                </Button>
              </Stack>
            ) : (
              // EDIT MODE
              <Stack spacing={2}>
                <TextField
                  label="First Name"
                  fullWidth
                  value={form.firstName ?? ""}
                  onChange={handleChange("firstName")}
                />
                <TextField
                  label="Last Name"
                  fullWidth
                  value={form.lastName ?? ""}
                  onChange={handleChange("lastName")}
                />
                <TextField
                  label="Phone Number"
                  fullWidth
                  value={form.phoneNumber ?? ""}
                  onChange={handleChange("phoneNumber")}
                />
                <TextField
                  label="Email"
                  fullWidth
                  value={form.email ?? ""}
                  onChange={handleChange("email")}
                />

                <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? "Saving…" : "Save Changes"}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<CloseIcon />}
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Stack>
            )}
          </>
        )}
      </Paper>
    </DashboardLayout>
  );
};

export default ProfilePage;
