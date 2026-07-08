import { useState } from "react";
import { Container, TextField, Button, Typography, Alert } from "@mui/material";
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
      setMessage("Profile updated successfully");
    } catch {
      setMessage("Update failed");
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Edit Profile
      </Typography>
      {message && <Alert severity="info">{message}</Alert>}
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
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Save
        </Button>
      </form>
    </Container>
  );
};
export default EditProfilePage;
