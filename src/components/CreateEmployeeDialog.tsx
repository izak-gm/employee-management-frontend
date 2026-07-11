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
} from "@mui/material";
import { createEmployee } from "../api/authApi";
import { extractErrorMessage } from "../api/errorUtils";

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

const CreateEmployeeDialog = ({ open, onClose, onSaved }: Props) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhoneNumber("");
    setError("");
  };

  const handleSave = async () => {
    setError("");
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !phoneNumber.trim()
    ) {
      setError("All fields are required.");
      return;
    }
    setLoading(true);
    try {
      await createEmployee({ firstName, lastName, email, phoneNumber });
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
          {/* <TextField
                        select
                        label="Role"
                        fullWidth
                        margin="normal"
                        value={role}
                        onChange={(e) => setRole(e.target.value as Role)}
                      >
                        {availableRoles.map((r) => (
                          <MenuItem key={r} value={r}>
                            {r}
                          </MenuItem>
                        ))}
                      </TextField> */}
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
