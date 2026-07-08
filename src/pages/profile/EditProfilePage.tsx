// src/pages/profile/EditProfilePage.tsx
import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
} from "@mui/material";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { updateEmployee } from "../../api/employeeApi";
import { useAuth } from "../../context/AuthContext";
import type { UpdateEmployee } from "../../types/auth.type";

const EditProfilePage = () => {
  const { employeeId } = useAuth();
  const [form, setForm] = useState<UpdateEmployee>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
  });
  const [message, setMessage] = useState("");

  const handleChange =
    (field: keyof UpdateEmployee) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId) return;
    try {
      await updateEmployee(employeeId, form);
      setMessage("Profile updated successfully.");
    } catch {
      setMessage("Update failed. Please try again.");
    }
  };

  return (
    <DashboardLayout title="My Profile">
      <Paper
        sx={{
          p: 4,
          maxWidth: 480,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Personal Information
        </Typography>
        {message && (
          <Alert severity="info" sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            label="First Name"
            fullWidth
            margin="normal"
            onChange={handleChange("firstName")}
          />
          <TextField
            label="Last Name"
            fullWidth
            margin="normal"
            onChange={handleChange("lastName")}
          />
          <TextField
            label="Phone Number"
            fullWidth
            margin="normal"
            onChange={handleChange("phoneNumber")}
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            onChange={handleChange("email")}
          />
          <Box sx={{ mt: 2 }}>
            <Button type="submit" variant="contained">
              Save Changes
            </Button>
          </Box>
        </form>
      </Paper>
    </DashboardLayout>
  );
};

export default EditProfilePage;
