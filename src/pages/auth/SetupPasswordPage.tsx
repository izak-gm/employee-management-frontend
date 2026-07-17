import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  LinearProgress,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { setupPassword } from "../../api/auth";
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

const SetupPasswordPage = () => {
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
      setError("Invalid or missing token.");
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
      await setupPassword({ token, password });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      setError(extractErrorMessage(err, "Failed to set password. The link may have expired."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container sx={{ minHeight: "100vh" }}>
      <Grid
        size={{ xs: 0, md: 6 }}
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "space-between",
          p: 6,
          backgroundImage: "linear-gradient(160deg, #0F2A4A 0%, #08182E 100%)",
          color: "#fff",
        }}
      >
        <Typography variant="h5" sx={{ letterSpacing: "0.05em", fontWeight: 700 }}>
          RIVERBANK
        </Typography>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, maxWidth: 480 }}>
            Welcome to the team.
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.7)", maxWidth: 420 }}>
            Set up your password to activate your account and access your dashboard.
          </Typography>
        </Box>
        <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)" }}>
          © {new Date().getFullYear()} Riverbank. All rights reserved.
        </Typography>
      </Grid>

      <Grid
        size={{ xs: 12, md: 6 }}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 380 }}>
          <Typography variant="h4" gutterBottom>
            Set up your password
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 4 }}>
            Choose a strong password to activate your account.
          </Typography>

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Password set! Redirecting to login…
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
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword((s) => !s)} edge="end">
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
                  <Typography variant="caption" sx={{ color: strength.color, fontWeight: 600 }}>
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
                {loading ? "Activating…" : "Activate Account"}
              </Button>
            </form>
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export default SetupPasswordPage;
