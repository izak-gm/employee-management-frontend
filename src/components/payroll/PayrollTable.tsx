import { useState } from "react";
import {
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import UndoIcon from "@mui/icons-material/Undo";
import DownloadIcon from "@mui/icons-material/Download";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import PayrollStatusChip from "./PayrollStatusChip";
import type { PayrollSummaryResponse } from "../../api/types/payroll";

const NAVY = "#132A46";
const SLATE = "#5B6B7F";
const BORDER = "#E4E8ED";

interface Props {
  rows: PayrollSummaryResponse[];
  onView: (row: PayrollSummaryResponse) => void;
  onApprove: (row: PayrollSummaryResponse) => void;
  onMarkPaid: (row: PayrollSummaryResponse) => void;
  onReverse: (row: PayrollSummaryResponse) => void;
  onResend: (row: PayrollSummaryResponse) => void;
  onDownload: (row: PayrollSummaryResponse) => void;
}

const fmt = (n?: number) =>
  new Intl.NumberFormat("en-KE", { maximumFractionDigits: 0 }).format(n ?? 0);

export default function PayrollTable({
  rows,
  onView,
  onApprove,
  onMarkPaid,
  onReverse,
  onResend,
  onDownload,
}: Props) {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [activeRow, setActiveRow] = useState<PayrollSummaryResponse | null>(null);

  const openMenu = (e: React.MouseEvent<HTMLElement>, row: PayrollSummaryResponse) => {
    setMenuAnchor(e.currentTarget);
    setActiveRow(row);
  };

  const closeMenu = () => {
    setMenuAnchor(null);
    setActiveRow(null);
  };

  const runAction = (fn: (row: PayrollSummaryResponse) => void) => {
    if (activeRow) fn(activeRow);
    closeMenu();
  };

  if (rows.length === 0) {
    return (
      <Box
        sx={{
          textAlign: "center",
          py: 8,
          color: SLATE,
        }}
      >
        <Typography variant="body1" sx={{ fontWeight: 600, color: NAVY, mb: 0.5 }}>
          No payroll runs for this period
        </Typography>
        <Typography variant="body2">Generate payroll to see records here.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ overflowX: "auto" }}>
      <Table sx={{ minWidth: 900 }}>
        <TableHead>
          <TableRow sx={{ "& th": { borderBottom: `2px solid ${BORDER}`, py: 1.5 } }}>
            <TableCell
              sx={{ color: SLATE, fontWeight: 700, fontSize: 12, textTransform: "uppercase" }}
            >
              Employee
            </TableCell>
            <TableCell
              sx={{ color: SLATE, fontWeight: 700, fontSize: 12, textTransform: "uppercase" }}
            >
              Department
            </TableCell>
            <TableCell
              align="right"
              sx={{ color: SLATE, fontWeight: 700, fontSize: 12, textTransform: "uppercase" }}
            >
              Gross pay
            </TableCell>
            <TableCell
              align="right"
              sx={{ color: SLATE, fontWeight: 700, fontSize: 12, textTransform: "uppercase" }}
            >
              Deductions
            </TableCell>
            <TableCell
              align="right"
              sx={{ color: SLATE, fontWeight: 700, fontSize: 12, textTransform: "uppercase" }}
            >
              Net pay
            </TableCell>
            <TableCell
              sx={{ color: SLATE, fontWeight: 700, fontSize: 12, textTransform: "uppercase" }}
            >
              Status
            </TableCell>
            <TableCell
              align="right"
              sx={{ color: SLATE, fontWeight: 700, fontSize: 12, textTransform: "uppercase" }}
            >
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.id}
              hover
              sx={{
                "& td": { borderBottom: `1px solid ${BORDER}`, py: 1.75 },
                cursor: "pointer",
              }}
              onClick={() => onView(row)}
            >
              <TableCell>
                <Typography variant="body2" sx={{ fontWeight: 700, color: NAVY }}>
                  {row.employeeFullName}
                </Typography>
                <Typography variant="caption" sx={{ color: SLATE }}>
                  {row.employeeNumber} · {row.payrollNumber}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ color: SLATE }}>
                  {row.department ?? "—"}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {fmt(row.grossPay)}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2" sx={{ color: "#B3261E" }}>
                  −{fmt(row.totalDeductions)}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2" sx={{ fontWeight: 700, color: NAVY }}>
                  {fmt(row.netPay)}
                </Typography>
              </TableCell>
              <TableCell>
                <PayrollStatusChip status={row.status} />
              </TableCell>
              <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                <IconButton size="small" onClick={(e) => openMenu(e, row)}>
                  <MoreVertIcon fontSize="small" sx={{ color: SLATE }} />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Menu anchorEl={menuAnchor} open={!!menuAnchor} onClose={closeMenu}>
        <MenuItem onClick={() => runAction(onView)}>
          <ListItemIcon>
            <VisibilityOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View details</ListItemText>
        </MenuItem>

        {activeRow?.status === "GENERATED" && (
          <MenuItem onClick={() => runAction(onApprove)}>
            <ListItemIcon>
              <CheckCircleIcon fontSize="small" sx={{ color: "#B8862E" }} />
            </ListItemIcon>
            <ListItemText>Approve</ListItemText>
          </MenuItem>
        )}

        {activeRow?.status === "APPROVED" && (
          <MenuItem onClick={() => runAction(onMarkPaid)}>
            <ListItemIcon>
              <PaymentsOutlinedIcon fontSize="small" sx={{ color: "#1E6B4E" }} />
            </ListItemIcon>
            <ListItemText>Mark as paid</ListItemText>
          </MenuItem>
        )}

        {activeRow?.status === "APPROVED" && (
          <MenuItem onClick={() => runAction(onReverse)}>
            <ListItemIcon>
              <UndoIcon fontSize="small" sx={{ color: "#B3261E" }} />
            </ListItemIcon>
            <ListItemText>Reverse</ListItemText>
          </MenuItem>
        )}

        <MenuItem onClick={() => runAction(onResend)}>
          <ListItemIcon>
            <EmailOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Resend payslip</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => runAction(onDownload)}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Download payslip</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
}
