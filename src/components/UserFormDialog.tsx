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
import { updateEmployee } from "../api/employeeApi";
import type { EmployeeResponse, Role, Gender } from "../types/auth.type";

const genderLabel: Record<Gender, string> = {
  MALE: "Male",
  FEMALE: "Female",
};

const roleLabel: Record<Role, string> = {
  SUPERADMIN: "Super Admin",
  HR_ADMIN: "HR Admin",
  HR_OFFICER: "HR Officer",
  PAYROLL_MANAGER: "Payroll Manager",
  FINANCE_MANAGER: "Finance Manager",
  TECH_LEAD: "Tech LEAD",
  SOFTWARE_ENGINEER: "Software Engineer",
  INTERN: "Inter",
};

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  editingEmployee?: EmployeeResponse | null;
  availableRoles: Role[];
  availableGenders: Gender[];
}

const UserFormDialog = ({
  open,
  onClose,
  onSaved,
  editingEmployee,
  availableRoles,
  availableGenders,
}: Props) => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState<Role>(availableRoles[0]);
  const [gender, setGender] = useState<Gender>(availableGenders[0]);

  useEffect(() => {
    if (editingEmployee) {
      setEmail(editingEmployee.email ?? "");
      setFirstName(editingEmployee.firstName ?? "");
      setLastName(editingEmployee.lastName ?? "");
      setPhoneNumber(editingEmployee.phoneNumber ?? "");
      setRole(editingEmployee.role ?? availableRoles[0]);
      setGender(editingEmployee.gender ?? availableGenders[0]);
    } else {
      setEmail("");
      setFirstName("");
      setLastName("");
      setPhoneNumber("");
      setRole(availableRoles[0]);
      setGender(availableGenders[0]);
    }
  }, [editingEmployee, open, availableRoles, availableGenders]);

  const handleSave = async () => {
    if (!editingEmployee?.id) return;

    await updateEmployee(editingEmployee.id, {
      firstName,
      lastName,
      phoneNumber,
      email,
      role,
      gender,
    });

    onSaved();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Edit Employee</DialogTitle>

      <DialogContent>
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

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
              {roleLabel[r]}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Gender"
          fullWidth
          margin="normal"
          value={gender}
          onChange={(e) => setGender(e.target.value as Gender)}
        >
          {availableGenders.map((g) => (
            <MenuItem key={g} value={g}>
              {genderLabel[g]}
            </MenuItem>
          ))}
        </TextField>
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
