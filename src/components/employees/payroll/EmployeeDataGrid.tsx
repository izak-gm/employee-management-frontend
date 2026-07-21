import { DataGrid, type GridColDef,  } from "@mui/x-data-grid";

import { Box, IconButton } from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";

import { useNavigate } from "react-router-dom";
import { useActiveEmployees } from "../../../hooks/useEmployees";

export default function EmployeeDataGrid() {
  const navigate = useNavigate();

  const { data: employees = [], isLoading, refetch } = useActiveEmployees();

  const columns: GridColDef[] = [
    {
      field: "employeeNumber",
      headerName: "Employee No",
      flex: 1,
    },

    {
      field: "name",
      headerName: "Name",
      flex: 1,
      // valueGetter: (params) => `${params.row.firstName} ${params.row.lastName}`,
    },

    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },

    {
      field: "department",
      headerName: "Department",
      flex: 1,
      // valueGetter: (params) => params.row.department?.name ?? "Not Assigned",
    },

    {
      field: "position",
      headerName: "Position",
      flex: 1,
      // valueGetter: (params) => params.row.position?.name ?? "Not Assigned",
    },

    {
      field: "status",
      headerName: "Status",
      flex: 1,
    },

    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      renderCell: (params) => (
        <IconButton onClick={() => navigate(`/employees/${params.row.id}/profile`)}>
          <VisibilityIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Box sx={{ height: 650, width: "100%" }}>
      <DataGrid
        rows={employees}

        columns={columns}

        loading={isLoading}

        pageSizeOptions={[10, 25, 50]}

        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
              page: 0,
            },
          },
        }}
      />
    </Box>
  );
}
