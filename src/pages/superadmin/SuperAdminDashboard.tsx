// src/pages/superadmin/SuperAdminDashboard.tsx
import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAddAlt";
import DashboardLayout from "../../components/layout/DashboardLayout";
import EmployeeTable from "../../components/EmployeeTable";
import UserFormDialog from "../../components/UserFormDialog";
import type { EmployeeResponse } from "../../types/auth.type";

const SuperAdminDashboard = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<EmployeeResponse | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <DashboardLayout title="All Users">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5">Manage All Users</Typography>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
        >
          Add User
        </Button>
      </Box>
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
        availableRoles={["ADMIN", "SUPERADMIN", "EMPLOYEE"]}
      />
    </DashboardLayout>
  );
};

export default SuperAdminDashboard;
