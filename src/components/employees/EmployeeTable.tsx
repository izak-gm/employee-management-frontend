import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  Button,
  Stack,
  Typography,
  Box,
  TableContainer,
  Chip,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import Tooltip from "@mui/material/Tooltip";
import EmployeeDetailsDialog from "../employees/CreateEmployeeDialog";
import DeleteConfirmationDialog from "../employees/DeleteConfirmationDialog";
import { getEmployees, getEmployeeById, deleteEmployee, type EmployeeResponse } from "../../api";
const PAGE_SIZE = 10;

const EmployeeTable = ({ onEdit }: { onEdit: (emp: EmployeeResponse) => void }) => {
  const [employees, setEmployees] = useState<EmployeeResponse[]>([]);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeResponse | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const fetchEmployees = async () => {
    const employees = await getEmployees({
      filter,
      page: page - 1,
      size: PAGE_SIZE,
    });

    setEmployees(employees);
  };
  useEffect(() => {
    fetchEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, page]);

  const isLastPage = employees.length < PAGE_SIZE;

  const handleView = async (id?: string) => {
    if (!id) return;

    try {
      const employee = await getEmployeeById(id);
      setSelectedEmployee(employee);
      setDetailsOpen(true);
    } catch (err) {
      console.error(err);
    }
  };
  const formatRole = (role?: string) =>
    role
      ?.toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()) ?? "-";

  return (
    <Box>
      <TextField
        label="Search"
        fullWidth
        margin="normal"
        value={filter}
        onChange={(e) => {
          setFilter(e.target.value);
          setPage(1);
        }}
      />
      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{
          borderRadius: 2,
          mt: 2,
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell width={130}>Employee #</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell align="center" width={150}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {employees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">
                    {filter ? "No employees match this search." : "No employees found."}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              employees.map((emp) => (
                <TableRow
                  hover
                  key={emp.id}
                  sx={{
                    "&:last-child td": {
                      borderBottom: 0,
                    },
                  }}
                >
                  <TableCell>{emp.employeeNumber ?? "-"}</TableCell>

                  <TableCell sx={{ fontWeight: 500 }}>
                    {emp.firstName} {emp.lastName}
                  </TableCell>

                  <TableCell>{emp.email}</TableCell>

                  <TableCell>{emp.phoneNumber}</TableCell>

                  <TableCell>{emp.departmentName ?? "-"}</TableCell>

                  <TableCell>{formatRole(emp.role)}</TableCell>

                  <TableCell>
                    <Chip
                      size="small"
                      label={emp.gender}
                      color={emp.gender === "MALE" ? "primary" : "secondary"}
                      variant="outlined"
                    />
                  </TableCell>

                  <TableCell align="center">
                    <Tooltip title="View Details">
                      <IconButton color="primary" onClick={() => handleView(emp.id)}>
                        <VisibilityOutlinedIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Edit">
                      <IconButton color="warning" onClick={() => onEdit(emp)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        onClick={() => {
                          setSelectedEmployee(emp);
                          setDeleteOpen(true);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mt: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Previous
        </Button>
        <Typography variant="body2" color="text.secondary">
          Page {page}
        </Typography>
        <Button
          endIcon={<ArrowForwardIcon />}
          disabled={isLastPage}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </Stack>
      <EmployeeDetailsDialog
        open={detailsOpen}
        employee={selectedEmployee}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedEmployee(null);
        }}
      />
      <DeleteConfirmationDialog
        open={deleteOpen}
        itemName={
          selectedEmployee
            ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}`
            : undefined
        }
        onClose={() => {
          setDeleteOpen(false);
          setSelectedEmployee(null);
        }}
        onConfirm={async () => {
          if (!selectedEmployee?.id) return;

          await deleteEmployee(selectedEmployee.id);

          setDeleteOpen(false);
          setSelectedEmployee(null);

          fetchEmployees();
        }}
      />
    </Box>
  );
};
export default EmployeeTable;
