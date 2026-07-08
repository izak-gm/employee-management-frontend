import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  Pagination,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
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
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employees.map((emp) => (
            <TableRow key={emp.id}>
              <TableCell>
                {emp.firstName} {emp.lastName}
              </TableCell>
              <TableCell>{emp.email}</TableCell>
              <TableCell>{emp.phoneNumber}</TableCell>
              <TableCell>{emp.role}</TableCell>
              <TableCell align="right">
                <IconButton onClick={() => onEdit(emp)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(emp.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination
        page={page}
        onChange={(_, val) => setPage(val)}
        count={10} // backend doesn't return total count in EmployeeResponse[] — see note below
        sx={{ mt: 2 }}
      />
    </Box>
  );
};
export default EmployeeTable;
