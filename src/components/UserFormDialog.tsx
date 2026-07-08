import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import { registerUserWithRole } from "../api/authApi";
import { updateEmployee } from "../api/employeeApi";
import type { EmployeeResponse, Role } from "../types/auth.type";

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  editingEmployee?: EmployeeResponse | null;
  availableRoles: Role[]; // Admin dashboard passes ["EMPLOYEE"], SuperAdmin passes all
}

const UserFormDialog = ({
  open,
  onClose,
  onSaved,
  editingEmployee,
  availableRoles,
}: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState<Role>(availableRoles[0]);

  useEffect(() => {
    if (editingEmployee) {
      setEmail(editingEmployee.email ?? "");
      setFirstName(editingEmployee.firstName ?? "");
      setLastName(editingEmployee.lastName ?? "");
      setPhoneNumber(editingEmployee.phoneNumber ?? "");
    } else {
      setEmail("");
      setFirstName("");
      setLastName("");
      setPhoneNumber("");
      setPassword("");
    }
  }, [editingEmployee, open]);

  const handleSave = async () => {
    if (editingEmployee?.id) {
      // Editing existing user
      await updateEmployee(editingEmployee.id, {
        firstName,
        lastName,
        phoneNumber,
        email,
      });
    } else {
      // Creating new user (2-step: create account, then fill profile)
      const res = await registerUserWithRole({ email, password, role });
      // If backend returns just a token (not the new employeeId), we can't immediately
      // fill in firstName/lastName here without knowing the new user's id.
      // You may need an endpoint that returns the created employee's id, or look them up by email.
      console.log("Created user token:", res.data.token);
    }
    onSaved();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>
        {editingEmployee ? "Edit Employee" : "Create User"}
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {!editingEmployee && (
          <>
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
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
            </TextField>
          </>
        )}
        {editingEmployee && (
          <>
            <TextField
              label="First Name"
              fullWidth
              margin="normal"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
              label="Last Name"
              fullWidth
              margin="normal"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <TextField
              label="Phone Number"
              fullWidth
              margin="normal"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default UserFormDialog;
