import { Chip, IconButton, Stack, Tooltip } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

export interface OrganizationRow {
  id?: string;
  name?: string;
  description?: string;
  active?: boolean;
}

export function positionColumns<T extends OrganizationRow>(
  onEdit: (row: T) => void,
  onDelete: (row: T) => void,
): GridColDef<T>[] {
  return [
    {
      field: "name",
      headerName: "Position",
      flex: 1,
    },
    {
      field: "description",
      headerName: "Description",
      flex: 2,
    },
    {
      field: "active",
      headerName: "Status",
      width: 120,
      renderCell: ({ value }) => (
        <Chip
          size="small"
          label={value ? "Active" : "Inactive"}
          color={value ? "success" : "default"}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => onEdit(row)}>
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={() => onDelete(row)}>
              <DeleteOutlineOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];
}
