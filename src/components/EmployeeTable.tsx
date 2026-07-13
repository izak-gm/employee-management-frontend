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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { getEmployees, deleteEmployee } from "../api/employeeApi";
import type { EmployeeResponse } from "../types/auth.type";

const PAGE_SIZE = 10;

const EmployeeTable = ({
  onEdit,
}: {
  onEdit: (emp: EmployeeResponse) => void;
}) => {
  const [employees, setEmployees] = useState<EmployeeResponse[]>([]);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);

  const fetchEmployees = async () => {
    const res = await getEmployees({ filter, page: page - 1, size: PAGE_SIZE });
    setEmployees(res.data);
  };

  useEffect(() => {
    fetchEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, page]);

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm("Delete this employee?")) return;
    await deleteEmployee(id);
    fetchEmployees();
  };

  // The API returns a bare EmployeeResponse[] with no total-count field, so a
  // numbered page count can't be computed honestly. A returned page shorter
  // than PAGE_SIZE reliably signals "this is the last page" without needing
  // the backend to report a total.
  const isLastPage = employees.length < PAGE_SIZE;

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
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Gender</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employees.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                <Typography color="text.secondary">
                  {filter
                    ? "No employees match this search."
                    : "No employees found."}
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            employees.map((emp) => (
              <TableRow key={emp.id}>
                <TableCell>
                  {emp.firstName} {emp.lastName}
                </TableCell>
                <TableCell>{emp.email}</TableCell>
                <TableCell>{emp.phoneNumber}</TableCell>
                <TableCell>{emp.role}</TableCell>
                <TableCell>{emp.gender}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => onEdit(emp)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(emp.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Stack
        direction="row"
        sx={{ justifyContent: "space-between", alignItems: "center", mt: 2 }}
      >
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
    </Box>
  );
};
export default EmployeeTable;
