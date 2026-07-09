// src/pages/profile/ResetPasswordPage.tsx
import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Stack,
  InputAdornment,
  IconButton,
  LinearProgress,
} from "@mui/material";
import LockResetIcon from "@mui/icons-material/LockReset";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { updateMyProfile } from "../../api/employeeApi";
import { extractErrorMessage } from "../../api/errorUtils";

const getStrength = (
  password: string,
): { score: number; label: string; color: string } => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const levels = [
    { label: "Too weak", color: "#d32f2f" },
    { label: "Weak", color: "#f57c00" },
    { label: "Fair", color: "#fbc02d" },
    { label: "Strong", color: "#388e3c" },
    { label: "Excellent", color: "#2e7d32" },
  ];
  return { score, ...levels[score] };
};

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  const strength = getStrength(newPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSaving(true);
    try {
      await updateMyProfile({ password: newPassword });
      setSuccess(true);
      setNewPassword("");
      setConfirmPassword("");
 } catch (err) {
  setError(extractErrorMessage(err, 'Could not reset password. Please try again.'));
}finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout title="Reset Password">
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
          maxWidth: 440,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
          <LockResetIcon sx={{ color: "secondary.main" }} />
          <Typography variant="h6">Change Password</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Choose a strong password you haven't used before.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Password updated successfully.
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Stack spacing={2.5}>
            <TextField
              label="New Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((s) => !s)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            {newPassword && (
              <Box>
                <LinearProgress
                  variant="determinate"
                  value={(strength.score / 4) * 100}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    bgcolor: "divider",
                    "& .MuiLinearProgress-bar": {
                      bgcolor: strength.color,
                      borderRadius: 3,
                    },
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{ color: strength.color, fontWeight: 600 }}
                >
                  {strength.label}
                </Typography>
              </Box>
            )}

            <TextField
              label="Confirm New Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <Button
              type="submit"
              variant="contained"
              disabled={saving}
              sx={{ mt: 1 }}
            >
              {saving ? "Updating…" : "Update Password"}
            </Button>
          </Stack>
        </form>
      </Paper>
    </DashboardLayout>
  );
};

export default ResetPasswordPage;
