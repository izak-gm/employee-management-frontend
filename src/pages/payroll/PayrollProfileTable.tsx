// PayrollProfilesTable.tsx

import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { payrollProfileColumns } from "../../tables/payroll/payrollProfileColumns";
import { usePayrollProfileList } from "../../hooks/usePayrollProfile";

export default function PayrollProfilesTable() {
  const navigate = useNavigate();

  const { data, isLoading } = usePayrollProfileList();

  return (
    <DataGrid
      rows={data}
      columns={payrollProfileColumns(navigate)}
      loading={isLoading}
      getRowId={(row) => row.id}
    />
  );
}
