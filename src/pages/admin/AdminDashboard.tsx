// src/pages/admin/AdminDashboard.tsx
import { useState } from "react";
import { Container, Typography, Button } from "@mui/material";
import EmployeeTable from "../../components/EmployeeTable";
import UserFormDialog from "../../components/UserFormDialog";
import type { EmployeeResponse } from "../../types/auth.type";

const AdminDashboard = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<EmployeeResponse | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Button
        variant="contained"
        onClick={() => {
          setEditing(null);
          setDialogOpen(true);
        }}
      >
        Add Employee
      </Button>
      <EmployeeTable
        key={refreshKey}
        onEdit={(emp) => {
          setEditing(emp);
          setDialogOpen(true);
        }}
      />
      <UserFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSaved={() => setRefreshKey((k) => k + 1)}
        editingEmployee={editing}
        availableRoles={["EMPLOYEE"]} // Admin can only create Employees
      />
    </Container>
  );
};
export default AdminDashboard;
