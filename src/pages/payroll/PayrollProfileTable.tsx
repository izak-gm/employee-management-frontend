import { Box, Button, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CalculateOutlinedIcon from "@mui/icons-material/CalculateOutlined";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";

import { payrollProfileColumns } from "../../tables/payroll/payrollProfileColumns";
import { usePayrollProfileList } from "../../hooks/usePayrollProfile";

export default function PayrollProfilesTable() {
  const navigate = useNavigate();

  const { data, isLoading } = usePayrollProfileList();

  return (
    <Box>
      {/* Header */}
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        {" "}
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Payroll Profiles
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Manage employee payroll profiles and salary configurations.
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<CalculateOutlinedIcon />}
            onClick={() => navigate("/payroll/generate")}
          >
            Generate Payroll
          </Button>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/payroll/profiles/new")}
          >
            Add Profile
          </Button>
        </Stack>
      </Stack>

      {/* Table */}
      <DataGrid
        rows={data}
        columns={payrollProfileColumns(navigate)}
        loading={isLoading}
        getRowId={(row) => row.id}
        autoHeight
        disableRowSelectionOnClick
        pageSizeOptions={[10, 25, 50]}
        initialState={{
          pagination: {
            paginationModel: {
              page: 0,
              pageSize: 10,
            },
          },
        }}
        sx={{
          border: "1px solid #E5E7EB",
          borderRadius: 3,
          bgcolor: "#fff",

          "& .MuiDataGrid-columnHeaders": {
            bgcolor: "#F8FAFC",
            fontWeight: 700,
          },

          "& .MuiDataGrid-cell": {
            borderColor: "#F1F5F9",
          },
        }}
      />
    </Box>
  );
}
