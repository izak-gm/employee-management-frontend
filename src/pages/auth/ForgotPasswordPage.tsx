import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, TextField, Button, Typography, Alert, Link, Paper } from "@mui/material";
import { forgotPassword } from "../../api/authApi";
import { extractErrorMessage } from "../../api/errorUtils";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await forgotPassword({ email });
      setSent(true);
    } catch (err) {
      setError(extractErrorMessage(err));
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
          Forgot your password?
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Enter your work email and we'll send you a reset link.
        </Typography>

        {sent ? (
          <Alert severity="success">
            If that email is registered, a reset link is on its way. Check your inbox.
          </Alert>
        ) : (
          <>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <form onSubmit={handleSubmit}>
              <TextField
                label="Work Email"
                fullWidth
                margin="normal"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{ mt: 2, py: 1.4 }}
              >
                {loading ? "Sending…" : "Send Reset Link"}
              </Button>
            </form>
          </>
        )}

        <Typography sx={{ mt: 3, textAlign: "center" }} color="text.secondary">
          <Link component={RouterLink} to="/login" sx={{ fontWeight: 600 }}>
            Back to Login
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default ForgotPasswordPage;
