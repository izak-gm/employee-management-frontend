import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Alert,
  Link,
  InputAdornment,
  IconButton,
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { login as loginApi } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import { extractErrorMessage } from "../../api/errorUtils";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setLoading(true);
  try {
    const res = await loginApi({ email, password });
    if (res.data.token) {
      login(res.data.token);
      navigate("/");
    }
  } catch (err) {
    setError(extractErrorMessage(err, "Invalid email or password."));
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
          bgcolor: "primary.dark",
          backgroundImage: "linear-gradient(160deg, #0F2A4A 0%, #08182E 100%)",
          color: "#fff",
          p: 6,
        }}
      >
        <Typography
          variant="h5"
          sx={{ letterSpacing: "0.05em", fontWeight: 700 }}
        >
          RIVERBANK
        </Typography>
        <Box>
          <Typography
            variant="h3"
            sx={{ fontWeight: 700, mb: 2, maxWidth: 480 }}
          >
            Manage your workforce with clarity.
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.7)", maxWidth: 420 }}>
            One secure platform for employee records, roles, and administration
            — built for teams that move fast.
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
            Welcome back
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 4 }}>
            Sign in to access your dashboard.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              label="Email address"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon color="action" />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              label="Password"
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
                      <IconButton
                        onClick={() => setShowPassword((s) => !s)}
                        edge="end"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Typography sx={{ mt: 1, textAlign: "right" }}>
              <Link
                component={RouterLink}
                to="/forgot-password"
                sx={{ fontSize: 13 }}
              >
                Forgot password?
              </Link>
            </Typography>
            
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ mt: 3, py: 1.4 }}
            >
              {loading ? "Signing in…" : "Sign In"}
            </Button>
          </form>
        </Box>
      </Grid>
    </Grid>
  );
};

export default LoginPage;
