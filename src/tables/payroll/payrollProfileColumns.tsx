import type { GridColDef } from "@mui/x-data-grid";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { GridActionsCellItem } from "@mui/x-data-grid";
import type { useNavigate } from "react-router-dom";

const currency = new Intl.NumberFormat("en-KE", {
  style: "currency",
  currency: "KES",
  maximumFractionDigits: 0,
});

export const payrollProfileColumns = (navigate: ReturnType<typeof useNavigate>): GridColDef[] => [
  {
    field: "employeeNumber",
    headerName: "Employee No.",
    width: 140,
  },
  {
    field: "employeeFullName",
    headerName: "Employee",
    flex: 1.5,
    minWidth: 220,
  },
  {
    field: "department",
    headerName: "Department",
    flex: 1,
    minWidth: 170,
  },
  {
    field: "position",
    headerName: "Position",
    flex: 1,
    minWidth: 170,
  },
  {
    field: "basicSalary",
    headerName: "Basic Salary",
    width: 170,
    type: "number",
    valueFormatter: (value) => {
      if (value == null) return "";
      return currency.format(Number(value));
    },
  },
  {
    field: "bankName",
    headerName: "Bank",
    width: 180,
  },
  {
    field: "bankBranch",
    headerName: "Bank Branch",
    width: 180,
  },
  {
    field: "kraPin",
    headerName: "KRA PIN",
    width: 150,
  },
  {
    field: "actions",
    type: "actions",
    width: 90,
    getActions: ({ row }) => [
      <GridActionsCellItem
        icon={<VisibilityOutlinedIcon />}
        label="View"
        onClick={() => navigate(`/payroll/profiles/${row.id}`)}
      />,
      <GridActionsCellItem
        icon={<EditOutlinedIcon />}
        label="Edit"
        onClick={() => navigate(`/payroll/profiles/${row.id}/edit`)}
        showInMenu
      />,
    ],
  },
];
