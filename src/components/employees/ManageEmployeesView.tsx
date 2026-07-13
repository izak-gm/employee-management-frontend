import { useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAddAlt";
import EmployeeTable from "../EmployeeTable";
import CreateEmployeeDialog from "../CreateEmployeeDialog";
import UserFormDialog from "../UserFormDialog";
import type { EmployeeResponse } from "../../types/auth.type";

type Role = "ADMIN" | "SUPERADMIN" | "EMPLOYEE";

const ManageEmployeesView = ({
  availableRoles,
}: {
  availableRoles: Role[];
}) => {
  const [createOpen, setCreateOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] =
    useState<EmployeeResponse | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <Box>
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h5">Employees</Typography>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={() => setCreateOpen(true)}
        >
          Add Employee
        </Button>
      </Stack>

      <EmployeeTable
        key={refreshKey}
        onEdit={(emp) => {
          setEditingEmployee(emp);
          setDialogOpen(true);
        }}
      />

      <CreateEmployeeDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSaved={() => {
          setRefreshKey((k) => k + 1);
          setCreateOpen(false);
        }}
        availableRoles={availableRoles}
      />
      <UserFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSaved={() => setRefreshKey((k) => k + 1)}
        editingEmployee={editingEmployee}
        availableRoles={availableRoles}
      />
    </Box>
  );
};

export default ManageEmployeesView;
