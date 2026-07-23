import { useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import OrganizationTable from "../../components/organization/PositionOrganizationTable";
import OrganizationDialog from "../../components/organization/OrganizationDialog";
import DeleteOrganizationDialog from "../../components/organization/DeleteOrganizationDialog";

import {
  usePositions,
  useCreatePosition,
  useUpdatePosition,
  useDeletePosition,
} from "../../hooks/usePositions";

import type { PositionRequest, PositionResponse } from "../../api/types";
import DashboardLayout from "../../components/layout/DashboardLayout";

export default function PositionsPage() {
  const { data = [], isLoading } = usePositions();

  const createPosition = useCreatePosition();
  const updatePosition = useUpdatePosition();
  const deletePosition = useDeletePosition();

  const [dialogOpen, setDialogOpen] = useState(false);

  const [editingPosition, setEditingPosition] = useState<PositionResponse | null>(null);

  const [deletingPosition, setDeletingPosition] = useState<PositionResponse | null>(null);

  const openCreate = () => {
    setEditingPosition(null);
    setDialogOpen(true);
  };

  const openEdit = (Position: PositionResponse) => {
    setEditingPosition(Position);
    setDialogOpen(true);
  };

  const handleSubmit = async (values: PositionRequest) => {
    if (editingPosition?.id) {
      await updatePosition.mutateAsync({
        id: editingPosition.id,
        data: values,
      });
    } else {
      await createPosition.mutateAsync(values);
    }

    setDialogOpen(false);
    setEditingPosition(null);
  };

  return (
    <DashboardLayout title="Positions">
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
              Positions
            </Typography>

            <Typography color="text.secondary">Manage company Positions.</Typography>
          </Box>
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
            Add Position
          </Button>
        </Stack>

        <OrganizationTable
          title="Position"
          rows={data}
          loading={isLoading}
          onEdit={openEdit}
          onDelete={setDeletingPosition}
        />

        <OrganizationDialog
          open={dialogOpen}
          title={editingPosition ? "Edit Position" : "Add Position"}
          loading={createPosition.isPending || updatePosition.isPending}
          initialValues={{
            name: editingPosition?.name ?? "",
            description: editingPosition?.description ?? "",
          }}
          onClose={() => {
            setDialogOpen(false);
            setEditingPosition(null);
          }}
          onSubmit={handleSubmit}
        />

        <DeleteOrganizationDialog
          open={!!deletingPosition}
          entityName="Position"
          itemName={deletingPosition?.name}
          loading={deletePosition.isPending}
          onClose={() => setDeletingPosition(null)}
          onConfirm={async () => {
            if (!deletingPosition?.id) return;

            await deletePosition.mutateAsync(deletingPosition.id);

            setDeletingPosition(null);
          }}
        />
      </Stack>
    </DashboardLayout>
  );
}
