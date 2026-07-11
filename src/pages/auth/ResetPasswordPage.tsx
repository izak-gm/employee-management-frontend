import { useState } from "react";
import {
  useSearchParams,
  useNavigate,
  Link as RouterLink,
} from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
  Link,
  InputAdornment,
  IconButton,
  LinearProgress,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { resetPasswordViaToken } from "../../api/authApi";
import { extractErrorMessage } from "../../api/errorUtils";

const getStrength = (p: string) => {
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  const levels = [
    { label: "Too weak", color: "#d32f2f" },
    { label: "Weak", color: "#f57c00" },
    { label: "Fair", color: "#fbc02d" },
    { label: "Strong", color: "#388e3c" },
    { label: "Excellent", color: "#2e7d32" },
  ];
  return { score: s, ...levels[s] };
};

const ResetPasswordTokenPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const strength = getStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await resetPasswordViaToken({ token, password });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      setError(
        extractErrorMessage(
          err,
          "Failed to reset password. The link may have expired.",
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        p: 3,
      }}
    >
      <Paper
        sx={{
          p: 5,
          maxWidth: 400,
          width: "100%",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Reset your password
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Enter your new password below.
        </Typography>

        {success && (
          <Alert severity="success">
            Password reset! Redirecting to login…
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!success && (
          <form onSubmit={handleSubmit}>
            <TextField
              label="New Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            {password && (
              <Box sx={{ mb: 1 }}>
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
              label="Confirm Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              margin="normal"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ mt: 2, py: 1.4 }}
            >
              {loading ? "Resetting…" : "Reset Password"}
            </Button>
          </form>
        )}

        <Typography sx={{ mt: 3, textAlign: "center" }}>
          <Link component={RouterLink} to="/login" sx={{ fontWeight: 600 }}>
            Back to Login
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default ResetPasswordTokenPage;
