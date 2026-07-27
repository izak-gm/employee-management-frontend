import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import type { LeaveResponse } from "../../api";
import { IconButton, Tooltip } from "@mui/material";
import type { NavigateFunction } from "react-router-dom";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import UndoOutlinedIcon from "@mui/icons-material/UndoOutlined";
import StageChip from "../../components/dashboard/StageChip";

interface LeaveColumnsProps {
  navigate: NavigateFunction;
  handleViewLeave: (id: string) => void;
  openWithdrawDialog: (id: string) => void;
}

export const createLeaveColumns = ({
  navigate,
  handleViewLeave,
  openWithdrawDialog,
}: LeaveColumnsProps): GridColDef<LeaveResponse>[] => [
  {
    field: "employeeFullName",
    headerName: "Employee",
    flex: 1.3,
    minWidth: 180,
    valueGetter: (_, row) => row.employeeFullName ?? "—",
  },
  {
    field: "leaveType",
    headerName: "Leave Type",
    flex: 1,
    minWidth: 150,
    valueGetter: (_, row) => row.leaveType ?? "—",
  },
  {
    field: "startDate",
    headerName: "Start Date",
    flex: 1,
    minWidth: 130,
    valueGetter: (_, row) => row.startDate ?? "—",
  },
  {
    field: "endDate",
    headerName: "End Date",
    flex: 1,
    minWidth: 130,
    valueGetter: (_, row) => row.endDate ?? "—",
  },
  {
    field: "coverEmployeeFullName",
    headerName: "Cover Employee",
    flex: 1.3,
    minWidth: 180,
    valueGetter: (_, row) => row.coverEmployeeFullName ?? "—",
  },
  {
    field: "status",
    headerName: "Stage",
    flex: 1,
    minWidth: 160,
    sortable: false,
    renderCell: (params: GridRenderCellParams<LeaveResponse>) => (
      <StageChip status={params.row.status} />
    ),
  },
  {
    field: "createdAt",
    headerName: "Applied On",
    flex: 1,
    minWidth: 160,
    valueGetter: (_, row) => (row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "—"),
  },
  {
    field: "actions",
    headerName: "Actions",
    sortable: false,
    filterable: false,
    align: "right",
    headerAlign: "right",
    width: 180,
    renderCell: (params: GridRenderCellParams<LeaveResponse>) => (
      <>
        <Tooltip title="View Details">
          <IconButton color="primary" onClick={() => handleViewLeave(params.row.id!)}>
            <VisibilityOutlinedIcon />
          </IconButton>
        </Tooltip>

        {(params.row.status === "PENDING_COVER" || params.row.status === "COVER_DECLINED") && (
          <Tooltip title="Edit Leave">
            <IconButton
              color="primary"
              onClick={() => navigate(`/leaves/apply?edit=${params.row.id}`)}
            >
              <EditOutlinedIcon />
            </IconButton>
          </Tooltip>
        )}

        {(params.row.status === "PENDING_COVER" ||
          params.row.status === "PENDING_ADMIN" ||
          params.row.status === "COVER_DECLINED") && (
          <Tooltip title="Withdraw Request">
            <IconButton color="warning" onClick={() => openWithdrawDialog(params.row.id!)}>
              <UndoOutlinedIcon />
            </IconButton>
          </Tooltip>
        )}
      </>
    ),
  },
];
