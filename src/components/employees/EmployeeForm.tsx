import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { createEmployee } from "../../api/authApi";
import { extractErrorMessage } from "../../api/errorUtils";
import type { Gender, Role } from "../../types/auth.type";

interface Props {
  availableRoles: Role[];
  availableGenders: Gender[];
  onSuccess: () => void;
}

const roleLabel: Record<Role, string> = {
  SUPERADMIN: "Super Admin",
  HR_ADMIN: "HR Admin",
  HR_OFFICER: "HR Officer",
  PAYROLL_MANAGER: "Payroll Manager",
  FINANCE_MANAGER: "Finance Manager",
  TECH_LEAD: "Tech Lead",
  SOFTWARE_ENGINEER: "Software Engineer",
  INTERN: "Intern",
};

const genderLabel: Record<Gender, string> = {
  MALE: "Male",
  FEMALE: "Female",
};

const EmployeeForm = ({ availableRoles, availableGenders, onSuccess }: Props) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState<Role | "">("");
  const [gender, setGender] = useState<Gender | "">("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !phoneNumber.trim() ||
      !role ||
      !gender
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);

      await createEmployee({
        firstName,
        lastName,
        email,
        phoneNumber,
        role,
        gender,
      });

      onSuccess();
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={3}>
      {error && <Alert severity="error">{error}</Alert>}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            required
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            required
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            required
            type="email"
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            required
            label="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            select
            fullWidth
            required
            label="Gender"
            value={gender}
            onChange={(e) => setGender(e.target.value as Gender)}
          >
            {availableGenders.map((g) => (
              <MenuItem key={g} value={g}>
                {genderLabel[g]}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            select
            fullWidth
            required
            label="Role"
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
          >
            {availableRoles.map((r) => (
              <MenuItem key={r} value={r}>
                {roleLabel[r]}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          variant="contained"
          size="large"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
        >
          {loading ? "Creating Employee..." : "Create Employee"}
        </Button>
      </Box>
    </Stack>
  );
};

export default EmployeeForm;
