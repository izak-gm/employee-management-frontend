import { useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import OrganizationTable from "../../components/organization/DepartmentOrganizationTable";
import OrganizationDialog from "../../components/organization/OrganizationDialog";
import DeleteOrganizationDialog from "../../components/organization/DeleteOrganizationDialog";

import {
  useDepartments,
  useCreateDepartment,
  useUpdateDepartment,
  useDeleteDepartment,
} from "../../hooks/useDepartments";

import type { DepartmentRequest, DepartmentResponse } from "../../api/types";
import DashboardLayout from "../../components/layout/DashboardLayout";

export default function DepartmentsPage() {
  const { data = [], isLoading } = useDepartments();

  const createDepartment = useCreateDepartment();
  const updateDepartment = useUpdateDepartment();
  const deleteDepartment = useDeleteDepartment();

  const [dialogOpen, setDialogOpen] = useState(false);

  const [editingDepartment, setEditingDepartment] = useState<DepartmentResponse | null>(null);

  const [deletingDepartment, setDeletingDepartment] = useState<DepartmentResponse | null>(null);

  const openCreate = () => {
    setEditingDepartment(null);
    setDialogOpen(true);
  };

  const openEdit = (department: DepartmentResponse) => {
    setEditingDepartment(department);
    setDialogOpen(true);
  };

  const handleSubmit = async (values: DepartmentRequest) => {
    if (editingDepartment?.id) {
      await updateDepartment.mutateAsync({
        id: editingDepartment.id,
        data: values,
      });
    } else {
      await createDepartment.mutateAsync(values);
    }

    setDialogOpen(false);
    setEditingDepartment(null);
  };

  return (
    <DashboardLayout title="Departments">
      <Stack spacing={3}>
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {" "}
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Departments
            </Typography>

            <Typography color="text.secondary">Manage company departments.</Typography>
          </Box>
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
            Add Department
          </Button>
        </Stack>

        <OrganizationTable
          title="Department"
          rows={data}
          loading={isLoading}
          onEdit={openEdit}
          onDelete={setDeletingDepartment}
        />

        <OrganizationDialog
          open={dialogOpen}
          title={editingDepartment ? "Edit Department" : "Add Department"}
          loading={createDepartment.isPending || updateDepartment.isPending}
          initialValues={{
            name: editingDepartment?.name ?? "",
            description: editingDepartment?.description ?? "",
          }}
          onClose={() => {
            setDialogOpen(false);
            setEditingDepartment(null);
          }}
          onSubmit={handleSubmit}
        />

        <DeleteOrganizationDialog
          open={!!deletingDepartment}
          entityName="Department"
          itemName={deletingDepartment?.name}
          loading={deleteDepartment.isPending}
          onClose={() => setDeletingDepartment(null)}
          onConfirm={async () => {
            if (!deletingDepartment?.id) return;

            await deleteDepartment.mutateAsync(deletingDepartment.id);

            setDeletingDepartment(null);
          }}
        />
      </Stack>
    </DashboardLayout>
  );
}
