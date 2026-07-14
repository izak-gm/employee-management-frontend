import { useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAddAlt";
import EmployeeTable from "../EmployeeTable";
import CreateEmployeeDialog from "../CreateEmployeeDialog";
import UserFormDialog from "../UserFormDialog";
import type { EmployeeResponse, Role, Gender } from "../../types/auth.type";

interface Props {
  availableRoles: Role[];
  availableGenders: Gender[];
}

const ManageEmployeesView = ({ availableRoles, availableGenders }: Props) => {
  const [createOpen, setCreateOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<EmployeeResponse | null>(null);
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
        availableGenders={availableGenders}
      />

      <UserFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSaved={() => {
          setRefreshKey((k) => k + 1);
          setDialogOpen(false);
        }}
        editingEmployee={editingEmployee}
        availableRoles={availableRoles}
        availableGenders={availableGenders}
      />
    </Box>
  );
};

export default ManageEmployeesView;
