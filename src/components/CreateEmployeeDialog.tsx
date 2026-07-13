import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  Stack,
  MenuItem,
} from "@mui/material";
import { createEmployee } from "../api/authApi";
import { extractErrorMessage } from "../api/errorUtils";

type Role = "ADMIN" | "SUPERADMIN" | "EMPLOYEE";

const roleLabel: Record<Role, string> = {
  ADMIN: "Admin",
  SUPERADMIN: "Super Admin",
  EMPLOYEE: "Employee",
};
type Gender = "MALE" | "FEMALE";

const genderLabel: Record<Gender, string> = {
  MALE: "Male",
  FEMALE: "Female",
};

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  /** Roles this operator is allowed to assign when creating an employee */
  availableRoles: Role[];
  availableGenders: Gender[];
}

const CreateEmployeeDialog = ({
  open,
  onClose,
  onSaved,
  availableRoles,
  availableGenders
}: Props) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState<Role | "">(
    availableRoles.length === 1 ? availableRoles[0] : "",
  );
  const [gender, setGender] = useState<Gender | "">(
    availableGenders.length === 1 ? availableGenders[0] : "",
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhoneNumber("");
    setRole(availableRoles.length === 1 ? availableRoles[0] : "");
    setGender(availableGenders.length === 1 ? availableGenders[0] : "");
    setError("");
  };

  const handleSave = async () => {
    setError("");
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !phoneNumber.trim() ||
      !role ||
      ! gender
    ) {
      setError("All fields are required.");
      return;
    }
    setLoading(true);
    try {
      await createEmployee({ firstName, lastName, email, phoneNumber, role ,gender});
      reset();
      onSaved();
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>Add New Employee</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <Alert severity="info" sx={{ mb: 1 }}>
            An invitation email will be sent to the employee to set up their
            password.
          </Alert>
          <TextField
            label="First Name"
            required
            fullWidth
            placeholder="Fill this field"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <TextField
            label="Last Name"
            required
            fullWidth
            placeholder="Fill this field"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <TextField
            label="Email"
            required
            fullWidth
            type="email"
            placeholder="Fill this field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Phone Number"
            required
            fullWidth
            placeholder="Fill this field"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <TextField
            label="Role"
            select
            required
            fullWidth
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
          >
            {availableRoles.map((r) => (
              <MenuItem key={r} value={r}>
                {roleLabel[r]}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Gender"
            select
            required
            fullWidth
            value={gender}
            onChange={(e) => setGender(e.target.value as Gender)}
          >
            {availableGenders.map((g) => (
              <MenuItem key={g} value={g}>
                {genderLabel[g]}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={loading}>
          {loading ? "Sending invite…" : "Create & Send Invite"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateEmployeeDialog;
