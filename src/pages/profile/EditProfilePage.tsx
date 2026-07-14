// src/pages/profile/EditProfilePage.tsx
import { useEffect, useState } from "react";
import { Box, Paper, Typography, TextField, Button, Alert, Stack, Skeleton } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getMyProfile, updateMyProfile } from "../../api/employeeApi";
import type { UpdateEmployee } from "../../types/auth.type";
import { extractErrorMessage } from "../../api/errorUtils";

type FormState = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const EditProfilePage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [banner, setBanner] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await getMyProfile();
        setForm({
          firstName: res.data.firstName ?? "",
          lastName: res.data.lastName ?? "",
          phoneNumber: res.data.phoneNumber ?? "",
          email: res.data.email ?? "",
        });
      } catch (err) {
        setBanner({
          type: "error",
          text: extractErrorMessage(err, "Update failed. Please try again."),
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleChange = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};
    if (!form.firstName.trim()) nextErrors.firstName = "First name is required";
    if (!form.lastName.trim()) nextErrors.lastName = "Last name is required";
    if (!form.phoneNumber.trim()) nextErrors.phoneNumber = "Phone number is required";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBanner(null);
    if (!validate()) {
      setBanner({
        type: "error",
        text: "Please fill in all required fields before saving.",
      });
      return;
    }

    setSaving(true);
    try {
      const payload: UpdateEmployee = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phoneNumber: form.phoneNumber.trim(),
        email: form.email.trim(),
      };
      await updateMyProfile(payload);
      setBanner({ type: "success", text: "Profile updated successfully." });
      setTimeout(() => navigate("/profile"), 900);
    } catch {
      setBanner({ type: "error", text: "Update failed. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout title="Edit Profile">
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/profile")}
        sx={{ mb: 2, color: "text.secondary" }}
      >
        Back to Profile
      </Button>

      <Paper
        sx={{
          p: 4,
          maxWidth: 480,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Edit Personal Information
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Fields marked as required must be completed before saving.
        </Typography>

        {banner && (
          <Alert severity={banner.type} sx={{ mb: 2 }}>
            {banner.text}
          </Alert>
        )}

        {loading ? (
          <Stack spacing={2}>
            <Skeleton variant="rounded" height={56} />
            <Skeleton variant="rounded" height={56} />
            <Skeleton variant="rounded" height={56} />
            <Skeleton variant="rounded" height={56} />
          </Stack>
        ) : (
          <form onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              <TextField
                label="First Name"
                required
                fullWidth
                placeholder="Fill this field"
                value={form.firstName}
                onChange={handleChange("firstName")}
                error={!!errors.firstName}
                helperText={errors.firstName}
              />
              <TextField
                label="Last Name"
                required
                fullWidth
                placeholder="Fill this field"
                value={form.lastName}
                onChange={handleChange("lastName")}
                error={!!errors.lastName}
                helperText={errors.lastName}
              />
              <TextField
                label="Phone Number"
                required
                fullWidth
                placeholder="Fill this field"
                value={form.phoneNumber}
                onChange={handleChange("phoneNumber")}
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber}
              />
              <TextField
                label="Email"
                fullWidth
                placeholder="Fill this field"
                value={form.email}
                onChange={handleChange("email")}
                helperText="Changing this updates your login email."
              />

              <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  disabled={saving}
                >
                  {saving ? "Saving…" : "Save Changes"}
                </Button>
                <Button variant="outlined" onClick={() => navigate("/profile")} disabled={saving}>
                  Cancel
                </Button>
              </Box>
            </Stack>
          </form>
        )}
      </Paper>
    </DashboardLayout>
  );
};

export default EditProfilePage;
